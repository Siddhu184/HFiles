'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserProfile from '../components/UserProfile';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';

export default function Dashboard() {
  const router = useRouter();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // Temporarily disabled auth check for testing
    // if (!localStorage.getItem('token')) router.push('/login');
  }, [router]);

  const logout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">🗂 HFiles</h1>
        <button onClick={logout} className="bg-white text-blue-900 px-4 py-1 rounded font-semibold">
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <UserProfile />
          <FileUpload onUpload={() => setRefresh(r => !r)} />
        </div>
        <FileList refresh={refresh} />
      </div>
    </div>
  );
}