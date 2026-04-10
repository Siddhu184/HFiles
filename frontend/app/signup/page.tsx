'use client';
import { FormEvent, useState } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from 'axios';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', gender: 'Male', phoneNumber: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.post('/auth/signup', form);
      router.push('/login');
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string; title?: string }>;
      const message = axiosError.response?.data?.message
        || axiosError.response?.data?.title
        || (axiosError.message === 'Network Error'
          ? 'Cannot connect to the API server. Check backend and API URL.'
          : axiosError.message)
        || 'Registration failed';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">🗂 Create Account</h1>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input className="w-full border p-2 rounded mb-3" placeholder="Full Name"
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })} />
          <input className="w-full border p-2 rounded mb-3" placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="w-full border p-2 rounded mb-3" type="password" placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} />
          <input className="w-full border p-2 rounded mb-3" type="tel" placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
          <select className="w-full border p-2 rounded mb-4"
            value={form.gender}
            onChange={e => setForm({ ...form, gender: e.target.value })}>
            <option>Male</option>
            <option>Female</option>
          </select>
          <button type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Have account? <Link href="/login" className="text-blue-600 underline">Login</Link>
        </p>
      </div>
    </div>
  );
}