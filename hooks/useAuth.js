'use client';

import { useAuthContext } from '../components/providers/AuthProvider';

export default function useAuth() {
  return useAuthContext();
}
