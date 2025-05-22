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

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // 1. Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data?.user) {
        // 2. Set user state
        setUser(data.user);
        setLoggedOut(false);
        
        // 3. Fetch and set profile
        const prof = await fetchProfile(data.user.id);
        setProfile(prof);
        
        // 4. Store name in localStorage if available
        if (prof?.name) {
          localStorage.setItem('userName', prof.name);
        }
        
        // 5. Show welcome message
        setShowWelcome(true);
        
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            setShowWelcome(false);
            resolve();
          }, 2000);
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoggedOut(true);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      setProfile(null);
      localStorage.removeItem('userName');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
      setLoggedOut(false);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
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

  useEffect(() => {
    const checkSession = async () => {
      if (loggedOut) return;
      
      try {
        // 1. Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          // 2. Set user state
          setUser(session.user);
          setLoggedOut(false);
          
          // 3. Fetch and set profile
          const prof = await fetchProfile(session.user.id);
          setProfile(prof);
          
          // 4. Store name in localStorage if available
          if (prof?.name) {
            localStorage.setItem('userName', prof.name);
          }
        } else {
          // 5. Clear states if no session
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('[AUTH] Session check failed:', err);
        setUser(null);
        setProfile(null);
        // Clear any stale auth data
        localStorage.removeItem('userName');
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 6. Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setLoggedOut(true);
        localStorage.removeItem('userName');
        // Clear all Supabase-related items
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      } else if (session) {
        setLoggedOut(false);
        setUser(session.user);
        const prof = await fetchProfile(session.user.id);
        setProfile(prof);
        if (prof?.name) {
          localStorage.setItem('userName', prof.name);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loggedOut]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, signup, updateProfile, setUser }}>
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