/** @jsxImportSource react */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabase';
import { User, Session } from '@supabase/supabase-js';
import WelcomeModal from '../components/WelcomeModal';

interface Profile {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (profile: User) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [showWelcome, setShowWelcome] = useState(false);
  const [lastConnectionTest, setLastConnectionTest] = useState<number>(0);
  const CONNECTION_TEST_INTERVAL = 5000;

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
                name: storedName || user?.user_metadata?.name || user?.email?.split('@')[0],
                role: 'user' 
              }
            ])
            .select()
            .single();
          if (createError) throw createError;
          return newProfile;
        }
        throw error;
      }
      
      if (storedName && (!profile?.name || profile.name !== storedName)) {
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ name: storedName })
          .eq('id', userId)
          .select()
          .single();
        
        if (updateError) throw updateError;
        return updatedProfile;
      }
      
      return profile;
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      return null;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('[AUTH] Checking session on mount...');
        const timeout = setTimeout(() => {
          console.error('[AUTH] getSession() is taking too long or hanging!');
        }, 2000);

        const result = await supabase.auth.getSession();
        clearTimeout(timeout);

        console.log('[AUTH] getSession() result:', result);
        const { data: { session }, error } = result;
        if (error) {
          console.error('[AUTH] getSession() error:', error);
          throw error;
        }
        if (session) {
          console.log('[AUTH] Session found:', session);
          setUser(session.user);
          const prof = await fetchProfile(session.user.id);
          setProfile(prof);
        } else {
          console.log('[AUTH] No session found');
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('[AUTH] Error checking session:', err);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('userName');
      } else if (session) {
        setUser(session.user);
        const prof = await fetchProfile(session.user.id);
        setProfile(prof);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data?.user) {
        setUser(data.user);
        const prof = await fetchProfile(data.user.id);
        setProfile(prof);
        localStorage.setItem('userName', prof.name || '');
        setShowWelcome(true);
        
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            setShowWelcome(false);
            resolve();
          }, 2000);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('userName');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
      const { error: signOutError } = await supabase.auth.signOut({ scope: 'global' });
      if (signOutError) throw signOutError;
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) throw error;
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('userName', name);
        const prof = await fetchProfile(data.user.id);
        setProfile(prof);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: profile.user_metadata?.name })
        .eq('id', profile.id);

      if (error) throw error;
      const prof = await fetchProfile(profile.id);
      setProfile(prof);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, signup, updateProfile, setUser }}>
      {children}
      <WelcomeModal isOpen={showWelcome} userEmail={user?.email || ''} />
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