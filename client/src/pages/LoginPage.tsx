import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@vantamo.io');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex bg-[var(--bg)]'>
      {/* Left decorative panel */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-[var(--accent)]/20 via-[var(--bg)] to-[var(--accent)]/5' />
        <div className='absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--accent)]/10 blur-3xl' />
        <div className='absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[var(--accent)]/5 blur-3xl' />
        <div className='relative z-10 flex flex-col justify-center p-16'>
          <div className='w-14 h-14 rounded-2xl accent-gradient flex items-center justify-center mb-8'>
            <span className='text-white font-bold text-2xl font-display'>
              V
            </span>
          </div>
          <h1 className='text-5xl font-bold font-display text-[var(--text)] leading-tight'>
            Welcome to
            <br />
            <span className='accent-text'>Vantamo</span>
          </h1>
          <p className='text-lg text-[var(--text-secondary)] mt-4 max-w-md'>
            A modern project management platform built for creative agencies.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className='flex-1 flex items-center justify-center p-8'>
        <div className='w-full max-w-sm'>
          <div className='lg:hidden flex items-center gap-3 mb-8'>
            <div className='w-10 h-10 rounded-xl accent-gradient flex items-center justify-center'>
              <span className='text-white font-bold text-lg font-display'>
                V
              </span>
            </div>
            <span className='text-xl font-semibold font-display'>Vantamo</span>
          </div>

          <h2 className='text-2xl font-bold font-display text-[var(--text)]'>
            Sign in
          </h2>
          <p className='text-sm text-[var(--text-secondary)] mt-1 mb-6'>
            Enter your credentials to access the platform
          </p>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='Email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@agency.com'
              required
            />
            <Input
              label='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              required
            />

            {error && (
              <div className='p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400'>
                {error}
              </div>
            )}

            <Button
              type='submit'
              className='w-full'
              size='lg'
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className='mt-6 p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]'>
            <p className='text-xs text-[var(--text-muted)]'>
              Demo:{' '}
              <span className='text-[var(--text)] font-mono'>
                admin@vantamo.io
              </span>{' '}
              /{' '}
              <span className='text-[var(--text)] font-mono'>password123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
