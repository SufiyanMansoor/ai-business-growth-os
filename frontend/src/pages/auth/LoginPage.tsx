import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { enableDemoMode } from '@/lib/demo';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setError, enterDemoMode } from '@/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Sparkles, Mail, Play } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleDemo = () => {
    enableDemoMode();
    dispatch(enterDemoMode());
    navigate('/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Google login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-animated opacity-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{ background: 'var(--primary-color)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--accent-color)' }} />
      </div>

      <div className="absolute top-6 right-6">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-animated mx-auto flex items-center justify-center mb-4">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold font-display">AI Business Growth OS</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Your AI-powered marketing operating system
          </p>
        </div>

        <div className="glass-card p-8">
          <Button onClick={handleDemo} className="w-full mb-6" size="lg">
            <Play size={20} /> Try Demo — No Login Required
          </Button>
          <p className="text-center text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            Bina account ke poori app explore karein
          </p>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'var(--border-color)' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4" style={{ background: 'var(--card-bg)', color: 'var(--text-muted)' }}>
                or sign in
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Button type="submit" variant="secondary" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'var(--border-color)' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4" style={{ background: 'var(--card-bg)', color: 'var(--text-muted)' }}>
                or continue with
              </span>
            </div>
          </div>

          <Button variant="secondary" onClick={handleGoogleLogin} loading={loading} className="w-full">
            <Mail size={18} /> Google
          </Button>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-color)' }} className="font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
