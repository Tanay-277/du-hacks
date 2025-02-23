import { supaBaseClient } from './supaBaseClient';
import { AuthError, User, Session } from '@supabase/supabase-js';

export async function signUp(email: string, password: string, userType: 'vendor' | 'consumer'): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
    try {
        const { data: { user, session }, error } = await supaBaseClient.auth.signUp({
            email,
            password,
        });
        if (user) {
            const table = userType === 'vendor' ? 'vendor' : 'consumer';

            const { error: insertError } = await supaBaseClient
                .from(table)
                .insert([{ id: user.id, email: user.email, created_at: new Date().toISOString() }]);

            if (insertError) throw insertError;
        }
        
        return { user, session, error };
    } catch (error) {
        console.error('Error signing up:', error);
        return { user: null, session: null, error: error as AuthError };
    }
}

export async function signIn(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: AuthError | null }> {
    try {
        const { data: { user, session }, error } = await supaBaseClient.auth.signInWithPassword({
            email,
            password,
        });
        
        return { user, session, error };
    } catch (error) {
        console.error('Error signing in:', error);
        return { user: null, session: null, error: error as AuthError };
    }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
    try {
        const { error } = await supaBaseClient.auth.signOut();
        return { error };
    } catch (error) {
        console.error('Error signing out:', error);
        return { error: error as AuthError };
    }
}

export async function getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
        const { data: { user }, error } = await supaBaseClient.auth.getUser();
        return { user, error };
    } catch (error) {
        console.error('Error getting user:', error);
        return { user: null, error: error as AuthError };
    }
}

export type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'USER_DELETED';

export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supaBaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
            callback(event, session);
        }
    });
}
