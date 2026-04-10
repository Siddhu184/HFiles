'use client';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import Image from 'next/image';

interface UserProfileData {
  email: string;
  phoneNumber?: string;
  gender?: string;
  profileImagePath?: string;
  fullName: string;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [userId] = useState(() => `FH${Math.random().toString(36).toUpperCase().slice(2, 10)}`);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/user/profile').then(r => {
      setProfile(r.data);
      setEmail(r.data.email);
      setPhone(r.data.phoneNumber || '');
      setGender(r.data.gender || 'Male');
    });
  }, []);

  const save = async () => {
    const fd = new FormData();
    fd.append('email', email);
    fd.append('gender', gender);
    fd.append('phoneNumber', phone);
    if (image) fd.append('profileImage', image);
    await api.put('/user/profile', fd);
    setMsg('Saved!');
    setTimeout(() => setMsg(''), 2000);
  };

  if (!profile) return <div className="bg-white p-6 rounded-xl">Loading...</div>;

  const imgSrc = profile.profileImagePath
    ? `https://localhost:7001${profile.profileImagePath}`
    : '/default-avatar.png';

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-xs text-gray-400 mb-3 font-mono">
        ID: {userId}
      </p>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <Image src={imgSrc} width={80} height={80} className="w-20 h-20 rounded-full object-cover border" alt="avatar" />
          <label className="text-xs text-blue-600 cursor-pointer underline block mt-1">
            Change
            <input type="file" className="hidden" accept="image/*"
              onChange={e => setImage(e.target.files?.[0] || null)} />
          </label>
        </div>
        <div>
          <h2 className="font-bold text-lg">{profile.fullName}</h2>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm w-20 text-gray-500">Email :</span>
          <input className="border rounded p-1 text-sm flex-1" value={email}
            onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm w-20 text-gray-500">Phone :</span>
          <input className="border rounded p-1 text-sm flex-1" value={phone}
            onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm w-20 text-gray-500">Gender :</span>
          <label className="text-sm"><input type="radio" name="g" value="Male"
            checked={gender === 'Male'} onChange={() => setGender('Male')} /> Male</label>
          <label className="text-sm ml-2"><input type="radio" name="g" value="Female"
            checked={gender === 'Female'} onChange={() => setGender('Female')} /> Female</label>
        </div>
      </div>
      {msg && <p className="text-green-600 text-sm mt-2">{msg}</p>}
      <button onClick={save}
        className="mt-4 bg-yellow-400 px-6 py-1 rounded font-semibold hover:bg-yellow-300">
        Save
      </button>
    </div>
  );
}