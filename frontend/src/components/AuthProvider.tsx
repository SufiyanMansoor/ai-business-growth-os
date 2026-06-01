import { useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { isDemoModeActive } from '@/lib/demo';
import { useAppDispatch } from '@/store/hooks';
import { setUser, enterDemoMode, setLoading } from '@/store/slices/authSlice';
import { UserProfile, UserRole } from '@/store/slices/authSlice';
import { DEMO_MEMBERSHIPS, DEMO_TENANTS } from '@/lib/demoTenantSeed';
import { resetTenantContext, setTenantContext } from '@/store/slices/tenantSlice';

async function buildUserProfile(fbUser: FirebaseUser): Promise<UserProfile> {
  try {
    const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
  } catch {
    // Firestore unavailable — use defaults
  }

  return {
    uid: fbUser.uid,
    email: fbUser.email || '',
    displayName: fbUser.displayName || 'User',
    photoURL: fbUser.photoURL || undefined,
    role: 'client' as UserRole,
    tenantId: `tenant-${fbUser.uid}`,
    tenantName: 'Personal Workspace',
    createdAt: new Date().toISOString(),
  };
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isDemoModeActive()) {
      dispatch(enterDemoMode());
      dispatch(setTenantContext({
        activeTenantId: DEMO_TENANTS[0].id,
        tenants: DEMO_TENANTS,
        memberships: DEMO_MEMBERSHIPS,
      }));
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (isDemoModeActive()) {
        dispatch(enterDemoMode());
        dispatch(setTenantContext({
          activeTenantId: DEMO_TENANTS[0].id,
          tenants: DEMO_TENANTS,
          memberships: DEMO_MEMBERSHIPS,
        }));
        return;
      }

      if (fbUser) {
        const profile = await buildUserProfile(fbUser);
        dispatch(setUser(profile));
        dispatch(setTenantContext({
          activeTenantId: profile.tenantId || `tenant-${fbUser.uid}`,
          tenants: [{
            id: profile.tenantId || `tenant-${fbUser.uid}`,
            name: profile.tenantName || profile.company || 'Personal Workspace',
            plan: 'starter',
          }],
          memberships: [{
            tenantId: profile.tenantId || `tenant-${fbUser.uid}`,
            role: profile.role,
          }],
        }));
        const token = await fbUser.getIdToken();
        localStorage.setItem('authToken', token);
      } else {
        dispatch(setUser(null));
        dispatch(resetTenantContext());
        localStorage.removeItem('authToken');
      }
      dispatch(setLoading(false));
    });

    return unsubscribe;
  }, [dispatch]);

  return <>{children}</>;
}
