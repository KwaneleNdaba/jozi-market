'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUserAction } from '@/app/actions/auth/auth';
import type { IUser } from '@/interfaces/auth/auth';

export interface ProfileSidebarUser {
  name: string;
  email: string;
  avatar: string;
  level: number;
  points: number;
}

interface ProfileUserContextType {
  user: IUser | null;
  loading: boolean;
  sidebarUser: ProfileSidebarUser;
  refetch: () => Promise<void>;
}

const defaultSidebarUser: ProfileSidebarUser = {
  name: 'Loading...',
  email: '',
  avatar: 'https://picsum.photos/seed/user/200/200',
  level: 0,
  points: 0,
};

const ProfileUserContext = createContext<ProfileUserContextType | undefined>(undefined);

export function ProfileUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const response = await getCurrentUserAction();
      if (!response.error && response.data) setUser(response.data);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const sidebarUser: ProfileSidebarUser = user
    ? {
        name: user.fullName || 'User',
        email: user.email || '',
        avatar: user.profileUrl || 'https://picsum.photos/seed/user/200/200',
        level: 22, // TODO: from loyalty tier
        points: 1250, // TODO: from user.loyaltyPoints
      }
    : defaultSidebarUser;

  return (
    <ProfileUserContext.Provider
      value={{ user, loading, sidebarUser, refetch: fetchUser }}
    >
      {children}
    </ProfileUserContext.Provider>
  );
}

export function useProfileUser() {
  const ctx = useContext(ProfileUserContext);
  if (ctx === undefined)
    throw new Error('useProfileUser must be used within ProfileUserProvider');
  return ctx;
}
