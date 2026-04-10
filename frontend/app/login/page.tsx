'use client';
import { useState } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">🗂 HFiles Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input className="w-full border p-2 rounded mb-3" placeholder="Email"
            onChange={e => setForm({...form, email: e.target.value})} />
          <input className="w-full border p-2 rounded mb-4" type="password" placeholder="Password"
            onChange={e => setForm({...form, password: e.target.value})} />
          <button type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800">
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          No account? <Link href="/signup" className="text-blue-600 underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}