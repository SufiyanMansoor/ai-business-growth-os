import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { enableDemoMode } from '@/lib/demo';
import { useAppDispatch } from '@/store/hooks';
import { setError, enterDemoMode } from '@/store/slices/authSlice';
import { UserRole } from '@/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Sparkles, Play } from 'lucide-react';

const roleOptions = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Administrator' },
  { value: 'manager', label: 'Manager' },
  { value: 'sales', label: 'Sales Team' },
  { value: 'marketing', label: 'Marketing Team' },
  { value: 'client', label: 'Client / Business Owner' },
  { value: 'agency', label: 'Marketing Agency' },
  { value: 'influencer', label: 'Influencer / Creator' },
  { value: 'viewer', label: 'Viewer' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    role: 'owner' as UserRole,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDemo = () => {
    enableDemoMode();
    dispatch(enterDemoMode());
    navigate('/dashboard');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(user, { displayName: form.name });

      const tenantId = `tenant-${user.uid}`;
      const tenantName = form.company || `${form.name}'s Workspace`;

      const profile = {
        uid: user.uid,
        email: form.email,
        displayName: form.name,
        role: form.role,
        tenantId,
        tenantName,
        company: form.company,
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', user.uid), profile);
      } catch {
        // Firestore may be unavailable
      }

      // Create tenant + membership so backend can enforce multi-tenant RBAC.
      try {
        await setDoc(doc(db, 'tenants', tenantId), {
          id: tenantId,
          name: tenantName,
          plan: 'starter',
          createdAt: new Date().toISOString(),
        });
        await setDoc(doc(db, 'tenants', tenantId, 'members', user.uid), {
          userId: user.uid,
          tenantId,
          role: form.role,
          createdAt: new Date().toISOString(),
        });
      } catch {
        // Firestore may be unavailable
      }

      navigate('/dashboard');
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      const tenantId = `tenant-${user.uid}`;
      const tenantName = user.displayName ? `${user.displayName}'s Workspace` : 'Personal Workspace';

      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'owner',
          tenantId,
          tenantName,
          createdAt: new Date().toISOString(),
        }, { merge: true });
      } catch { /* ignore */ }

      // Create tenant + membership so backend can enforce multi-tenant RBAC.
      try {
        await setDoc(doc(db, 'tenants', tenantId), {
          id: tenantId,
          name: tenantName,
          plan: 'starter',
          createdAt: new Date().toISOString(),
        });
        await setDoc(doc(db, 'tenants', tenantId, 'members', user.uid), {
          userId: user.uid,
          tenantId,
          role: 'owner',
          createdAt: new Date().toISOString(),
        });
      } catch { /* ignore */ }

      navigate('/dashboard');
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Google signup failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: 'var(--bg-color)' }} />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-25 blur-3xl bg-animated" />
      </div>

      <div className="absolute top-6 right-6"><ThemeSwitcher /></div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-animated mx-auto flex items-center justify-center mb-4">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold font-display">Create Account</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Start growing your business with AI
          </p>
        </div>

        <div className="glass-card p-8">
          <Button onClick={handleDemo} className="w-full mb-6" size="lg">
            <Play size={20} /> Try Demo — No Login Required
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'var(--border-color)' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4" style={{ background: 'var(--card-bg)', color: 'var(--text-muted)' }}>or register</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
            <Input label="Company (optional)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <Select label="Account Type" options={roleOptions} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} />
            <Button type="submit" variant="secondary" loading={loading} className="w-full">Create Account</Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'var(--border-color)' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4" style={{ background: 'var(--card-bg)', color: 'var(--text-muted)' }}>or</span>
            </div>
          </div>

          <Button variant="secondary" onClick={handleGoogleRegister} loading={loading} className="w-full">
            Sign up with Google
          </Button>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-color)' }} className="font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
