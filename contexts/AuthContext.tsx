import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase'; // Make sure this path is correct
import { Profile } from '../types'; // Make sure this path is correct

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean; // Renamed from 'isLoading' in my previous example to match yours
  signOut: () => Promise<void>;
  // We don't export refreshSession because we don't need to call it manually
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true); // Start loading until we check session

  // Helper function to fetch profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return userProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // 1. Run once on app load to get the current session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
          setProfile(null);
        } else if (session) {
          setSession(session);
          setUser(session.user);
          // If we have a session, fetch the profile
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        } else {
          // No session
          const localToken = window.localStorage.getItem('scolay-auth-token');
          if (localToken) {
            console.warn('No session found in Supabase client, but token exists in localStorage. This might indicate a sync issue or expired token.');
          }
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false); // We're done loading
      }
    };

    getInitialSession();

    // 2. Set up the auth listener to react to changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session active' : 'No session');

        // No need to set loading here, just update the state
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // User logged in or session refreshed, fetch profile
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        } else {
          // User logged out
          setProfile(null);
        }
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this runs ONCE on mount

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && !session) {
        const localToken = window.localStorage.getItem('scolay-auth-token');
        if (localToken) {
          console.log('Attempting to recover session from localStorage...');
          try {
            const parsed = JSON.parse(localToken);
            if (parsed.access_token && parsed.refresh_token) {
              const { data, error } = await supabase.auth.setSession({
                access_token: parsed.access_token,
                refresh_token: parsed.refresh_token,
              });

              if (error) {
                console.error('Failed to recover session:', error);
              } else if (data.session) {
                console.log('Session recovered successfully');
                // State updates will be handled by onAuthStateChange listener
              }
            }
          } catch (e) {
            console.error('Error parsing local token during recovery:', e);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session]);

  // Sign out function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    // No need to manually set state here, 
    // onAuthStateChange will fire with a SIGNED_OUT event 
    // and handle clearing the session and profile.
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
  };

  // Render children only after the initial session check is complete
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
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