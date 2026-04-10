'use client';
import { useState } from 'react';
import { AxiosError } from 'axios';
import api from '../lib/api';

const FILE_TYPES = ['Lab Report','Prescription','X-Ray','Blood Report','MRI Scan','CT Scan'];

export default function FileUpload({ onUpload }: { onUpload: () => void }) {
  const [fileType, setFileType] = useState('');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');

  const submit = async () => {
    if (!fileType || !fileName || !file) {
      setMsg('Please fill all fields'); return;
    }
    const fd = new FormData();
    fd.append('fileType', fileType);
    fd.append('fileName', fileName);
    fd.append('file', file);
    try {
      await api.post('/files/upload', fd);
      setMsg('Uploaded!');
      setFileName(''); setFileType(''); setFile(null);
      onUpload();
    } catch (e) {
      if (e instanceof AxiosError) {
        setMsg(e.response?.data || 'Upload failed');
      } else {
        setMsg('Upload failed');
      }
    }
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-blue-700 font-bold text-lg mb-4">Please Add Your Medical Records</h2>
      <select className="w-full border rounded p-2 mb-3"
        value={fileType} onChange={e => setFileType(e.target.value)}>
        <option value="">Select file type</option>
        {FILE_TYPES.map(t => <option key={t}>{t}</option>)}
      </select>
      <input className="w-full border rounded p-2 mb-3" placeholder="Enter Name of File..."
        value={fileName} onChange={e => setFileName(e.target.value)} />
      <div className="flex gap-2">
        <label className="border rounded p-2 text-sm cursor-pointer bg-gray-50 flex-1">
          {file ? file.name : 'Select file'}
          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => setFile(e.target.files?.[0] || null)} />
        </label>
        <button onClick={submit}
          className="bg-blue-900 text-white px-4 rounded hover:bg-blue-800">
          Submit
        </button>
      </div>
      {msg && <p className="text-sm mt-2 text-green-600">{msg}</p>}
    </div>
  );
}