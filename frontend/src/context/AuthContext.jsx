import { createContext, useContext, useEffect, useState } from "react";
import { supabase, profilesApi } from "../lib/supabase.js";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);  // auth.users row
    const [profile, setProfile] = useState(null);  // profiles row
    const [loading, setLoading] = useState(true);

    const loadProfile = async (authUser) => {
        if (!authUser) { setProfile(null); return; }
        const { data } = await profilesApi.get(authUser.id);
        setProfile(data || null);
    };

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user ?? null;
            setUser(u);
            loadProfile(u).finally(() => setLoading(false));
        });

        // Listen for auth state changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            const u = session?.user ?? null;
            setUser(u);
            loadProfile(u);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const refreshProfile = () => loadProfile(user);

    return (
        <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};