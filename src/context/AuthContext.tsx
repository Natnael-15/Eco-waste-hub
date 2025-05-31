/** @jsxImportSource react */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import SplashScreen from '../components/SplashScreen';

interface Profile {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeProfile = (profile: any): Profile => {
  if (!profile) return profile;
  return {
    ...profile,
    name: profile.full_name || profile.name || '',
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const storedName = localStorage.getItem('userName');
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert([
              {
                id: userId,
                email: user?.email,
                full_name: storedName || user?.user_metadata?.name || user?.email?.split('@')[0],
                role: 'user',
              },
            ])
            .select()
            .single();
          if (createError) throw createError;
          return normalizeProfile(newProfile);
        }
        throw error;
      }
      if (storedName && (!profile?.full_name || profile.full_name !== storedName)) {
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ full_name: storedName })
          .eq('id', userId)
          .select()
          .single();
        if (updateError) throw updateError;
        return normalizeProfile(updatedProfile);
      }
      return normalizeProfile(profile);
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      return null;
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('[AUTH] checkUser session:', session);
        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          setUser(session.user);
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            throw profileError;
          }

          setProfile(normalizeProfile(profileData));
          setIsAdmin(profileData?.role === 'admin');
        } else {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AUTH] onAuthStateChange event:', event, 'session:', session);
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(normalizeProfile(profileData));
        setIsAdmin(profileData?.role === 'admin');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        setProfile(normalizeProfile(profileData));
        setIsAdmin(profileData?.role === 'admin');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoggedOut(true);
      setLoading(true);
      
      // First clear all local state
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      setShowWelcome(false);
      
      // Clear all relevant localStorage items
      localStorage.removeItem('userName');
      localStorage.removeItem('rememberedEmail');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });

      // Clear session storage
      sessionStorage.clear();

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log('[AUTH] logout: Successfully logged out');
    } catch (error) {
      console.error('Error during logout:', error);
      setLoggedOut(false);
      setError(error instanceof Error ? error.message : 'An error occurred during logout');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      console.log('[AUTH] Attempting signup with:', { email, name });
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { 
            full_name: name, 
            phone: '', 
            role: 'user' 
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('[AUTH] Signup error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        throw error;
      }

      console.log('[AUTH] Signup response:', data);

      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('userName', name);
        const prof = await fetchProfile(data.user.id);
        setProfile(prof);
      } else {
        throw new Error('No user data returned from signup');
      }
    } catch (error) {
      console.error('[AUTH] Error in signUp:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAdmin,
      loading,
      error,
      signIn,
      signUp,
      logout,
      showWelcome,
      setShowWelcome
    }}>
      {children}
      {showWelcome && <SplashScreen onFinish={() => setShowWelcome(false)} />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 