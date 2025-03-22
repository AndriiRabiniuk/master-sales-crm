import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiEdit, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import noteService, { Note } from '@/services/api/noteService';

const NoteDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    if (id) {
      fetchNote(id as string);
    }
  }, [id]);

  const fetchNote = async (noteId: string) => {
    try {
      setLoading(true);
      const data = await noteService.getById(noteId);
      setNote(data);
    } catch (error) {
      console.error('Error fetching note:', error);
      toast.error('Failed to load note details');
      router.push('/notes');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            href="/notes"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <FiArrowLeft className="mr-2" /> Back to Notes
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : !note ? (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 text-center">
            <p className="text-gray-500">Note not found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">{note.title}</h1>
                <Link
                  href={`/notes/${note._id}/edit`}
                  className="p-2 text-blue-600 hover:text-blue-900 rounded-full hover:bg-gray-100"
                  title="Edit"
                >
                  <FiEdit className="w-5 h-5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-sm font-medium">{formatDate(note.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium">{formatDate(note.updated_at)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Content</h2>
                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap break-words">
                  {note.content}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NoteDetailPage; 