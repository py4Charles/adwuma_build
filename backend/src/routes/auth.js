import { Router } from 'express';
import { adminClient } from '../lib/supabase.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/signup', async (req, res) => {
  const { email, password, username, role } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  if (!['customer', 'provider'].includes(role)) {
    return res.status(400).json({ error: 'unknown role' });
  }

  const { data, error } = await adminClient.auth.signUp({
    email,
    password,
    options: { data: { username, role } },
  });

  if (error) {
    if (error.message === 'email rate limit exceeded') {
      return res.status(429).json({ error: 'Too many signups. Please try again in about an hour.' });
    }
    return res.status(400).json({ error: error.message });
  }

  if (data.user) {
    const { error: stampError } = await adminClient.auth.admin.updateUserById(data.user.id, {
      app_metadata: { role: 'customer' },
    });
    if (stampError) return res.status(400).json({ error: stampError.message });
  }

  res.status(201).json(data);
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const { data, error } = await adminClient.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: error.message });
  res.json(data);
});

router.post('/signout', requireAuth, async (req, res) => {
  await adminClient.auth.admin.signOut(req.token);
  res.status(204).end();
});

router.get('/me', requireAuth, async (req, res) => {
  const { data: profile, error } = await req.client
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: req.user, profile });
});

router.post('/provider-request', requireAuth, async (req, res) => {
  const { proof } = req.body || {};

  if (!proof) {
    return res.status(400).json({ error: 'proof is required' });
  }

  const { data, error } = await adminClient
    .from('provider_requests')
    .insert({ user_id: req.user.id, status: 'pending', proof });

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.get('/provider-requests', requireAuth, requireAdmin, async (req, res) => {
  const { data, error } = await adminClient
    .from('provider_requests')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/provider-requests/:id/approve', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  const { data: request, error: fetchError } = await adminClient
    .from('provider_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    const status = fetchError.code === 'PGRST116' ? 404 : 400;
    return res.status(status).json({ error: fetchError.message });
  }

  if (request.status !== 'pending') {
    return res.status(409).json({ error: 'request is not pending' });
  }

  const { error: roleError } = await adminClient.auth.admin.updateUserById(request.user_id, {
    app_metadata: { role: 'provider' },
  });

  if (roleError) return res.status(400).json({ error: roleError.message });

  const { error: updateError } = await adminClient
    .from('provider_requests')
    .update({ status: 'approved' })
    .eq('id', id);

  if (updateError) return res.status(400).json({ error: updateError.message });
  res.json({ id, status: 'approved' });
});

router.post('/provider-requests/:id/reject', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  const { data: request, error: fetchError } = await adminClient
    .from('provider_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    const status = fetchError.code === 'PGRST116' ? 404 : 400;
    return res.status(status).json({ error: fetchError.message });
  }

  if (request.status !== 'pending') {
    return res.status(409).json({ error: 'request is not pending' });
  }

  const { error: updateError } = await adminClient
    .from('provider_requests')
    .update({ status: 'rejected' })
    .eq('id', id);

  if (updateError) return res.status(400).json({ error: updateError.message });
  res.json({ id, status: 'rejected' });
});

router.patch('/role', requireAuth, requireAdmin, async (req, res) => {
  const { userId, role } = req.body || {};

  if (!['customer', 'provider'].includes(role)) {
    return res.status(400).json({ error: 'unknown role' });
  }

  const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
    app_metadata: { role },
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;