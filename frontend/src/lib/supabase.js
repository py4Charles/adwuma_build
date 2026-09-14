import { createClient } from '@supabase/supabase.js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ----- AUTH -------------------------------------
export const authApi = {
    /** Sign up a new user (customer or provider) */
    signUp: async ({ email, password, username, role = "customer" }) => {
        return supabase.auth.signUp({
            email,
            password,
            options: { data: { username, role } },
        });
    },

    /** Sign in with email + password */
    signIn: async ({ email, password }) => {
        return supabase.auth.signInWithPassword({ email, password });
    },

    /** Sign out */
    signOut: () => supabase.auth.signOut(),

    /** Get current session */
    getSession: () => supabase.auth.getSession(),

    /** Get current user */
    getUser: () => supabase.auth.getUser(),
};

// ─── PROFILES ────────────────────────────────────────────────
export const profilesApi = {
    /** Get a profile by user id */
    get: async (userId) => {
        return supabase.from("profiles").select("*").eq("id", userId).single();
    },

    /** Update the current user's profile */
    update: async (userId, updates) => {
        return supabase.from("profiles").update(updates).eq("id", userId);
    },
};

// ─── ARTISAN PROFILES ────────────────────────────────────────
export const artisansApi = {
    /** List artisans with optional filters */
    list: async ({ category, subcategory, region, verified } = {}) => {
        let q = supabase
            .from('artisan_profiles')
            .select('*, profiles(username, first_name, last_name, avatar_url)');
        if (category) q = q.eq('category', category);
        if (subcategory) q = q.eq('subcategory', subcategory);
        if (region) q = q.eq('region', region);
        if (verified) q = q.eq('is_verified', true);
        return q.order('rating', { ascending: false });
    },

    /** Get a single artisan by id */
    get: async (id) => {
        return supabase
            .from('artisan_profiles')
            .select('*, profiles(username, first_name, last_name, avatar_url)')
            .eq('id', id)
            .single();
    },

    /** Get the artisan profile for the logged-in provider */
    getMine: async (userId) => {
        return supabase
            .from('artisan_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
    },

    /** Create or update provider profile */
    upsert: async (userId, data) => {
        return supabase
            .from('artisan_profiles')
            .upsert({ user_id: userId, ...data }, { onConflict: 'user_id' });
    },
};

// ─── SERVICE REQUESTS ────────────────────────────────────────
export const requestsApi = {
    /** Create a new request */
    create: async (data) => {
        return supabase.from('service_requests').insert(data).select().single();
    },

    /** List requests for the logged-in customer */
    listMine: async (customerId, status) => {
        let q = supabase
            .from('service_requests')
            .select(`
        *,
        artisan:artisan_profiles(
          id, subcategory, region,
          profiles(username, first_name, last_name)
        )
      `)
            .eq('customer_id', customerId);
        if (status && status !== 'All') q = q.eq('status', status.toLowerCase().replace(' ', '_'));
        return q.order('created_at', { ascending: false });
    },

    /** List open flex requests (for artisan job pool) */
    listOpen: async () => {
        return supabase
            .from('service_requests')
            .select(`*, profiles(username)`)
            .eq('status', 'pending')
            .eq('request_type', 'flex')
            .order('created_at', { ascending: false });
    },

    /** Update request (e.g. assign artisan, change status) */
    update: async (id, updates) => {
        return supabase.from('service_requests').update(updates).eq('id', id);
    },
};

// ─── WALLET ──────────────────────────────────────────────────
export const walletApi = {
  /** Get wallet balance */
  get: async (userId) => {
    return supabase.from('wallets').select('*').eq('user_id', userId).single();
  },

  /** Fund wallet (deposit) */
  fund: async (userId, amount, method = 'mobile_money') => {
    // Insert transaction record
    const { error: txErr } = await supabase.from('wallet_transactions').insert({
      user_id: userId,
      type: 'deposit',
      amount,
      description: `Wallet top-up via ${method}`,
      status: 'success',
      reference: `DEP-${Date.now()}`,
    });
    if (txErr) return { error: txErr };

    // Update balance
    const { data: wallet } = await supabase
      .from('wallets').select('balance').eq('user_id', userId).single();
    return supabase
      .from('wallets')
      .update({ balance: Number(wallet.balance) + Number(amount) })
      .eq('user_id', userId);
  },

  /** List transactions */
  transactions: async (userId) => {
    return supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },
};

// ─── REVIEWS ─────────────────────────────────────────────────
export const reviewsApi = {
  /** Submit a review */
  create: async ({ requestId, customerId, artisanId, rating, comment }) => {
    return supabase
      .from('reviews')
      .insert({ request_id: requestId, customer_id: customerId, artisan_id: artisanId, rating, comment })
      .select()
      .single();
  },

  /** Get reviews for an artisan */
  forArtisan: async (artisanId) => {
    return supabase
      .from('reviews')
      .select('*, profiles(username, first_name, last_name)')
      .eq('artisan_id', artisanId)
      .order('created_at', { ascending: false });
  },
};

// ─── SUPPORT TICKETS ─────────────────────────────────────────
export const ticketsApi = {
  /** Submit a new support ticket */
  create: async ({ customerId, requestId, subjectType, description }) => {
    return supabase
      .from('support_tickets')
      .insert({
        customer_id: customerId,
        request_id: requestId || null,
        subject_type: subjectType,
        description,
        status: 'open',
        last_update: 'Your ticket has been received. Our team will review it shortly.',
      })
      .select()
      .single();
  },

  /** List tickets for the logged-in customer */
  listMine: async (customerId) => {
    return supabase
      .from('support_tickets')
      .select(`*, service_requests(title)`)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
  },
};

// ─── NOTIFICATIONS ───────────────────────────────────────────
export const notificationsApi = {
  listMine: async (userId) => {
    return supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
  },

  markAllRead: async (userId) => {
    return supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);
  },
};