'use client';
import { useEffect, useState } from 'react';
import api from '../lib/api';

interface FileItem {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
}

export default function FileList({ refresh }: { refresh: boolean }) {
  const [files, setFiles] = useState<FileItem[]>([]);

  const load = () => {
    api.get('/files').then(r => setFiles(r.data));
  };

  useEffect(() => { load(); }, [refresh]);

  const del = async (id: number) => {
    if (!confirm('Delete this file?')) return;
    await api.delete(`/files/${id}`);
    load();
  };

  const view = (path: string) => {
    window.open(`https://localhost:7001${path}`, '_blank');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-bold text-lg mb-4">Your Medical Files</h2>
      {files.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-8">
          By default, this space will be empty. It should only appear when you add files.
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {files.map(f => (
          <div key={f.id} className="border rounded-lg p-3">
            <div className="bg-gray-100 rounded h-32 flex items-center justify-center mb-2 text-gray-400 text-sm">
              {f.filePath.endsWith('.pdf') ? '📄 PDF' : '🖼 Image'}
            </div>
            <p className="font-semibold text-sm truncate">{f.fileName}</p>
            <p className="text-xs text-gray-500 mb-2">{f.fileType}</p>
            <div className="flex gap-2">
              <button onClick={() => view(f.filePath)}
                className="flex-1 bg-yellow-400 py-1 rounded text-sm font-medium hover:bg-yellow-300">
                View
              </button>
              <button onClick={() => del(f.id)}
                className="flex-1 bg-blue-900 text-white py-1 rounded text-sm hover:bg-blue-800">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}