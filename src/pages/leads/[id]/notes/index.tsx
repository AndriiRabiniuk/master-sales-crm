import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiPlus, FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import leadService from '@/services/api/leadService';
import noteService from '@/services/api/noteService';

const LeadNotesPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const leadId = id as string;
  
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    if (leadId) {
      fetchData();
    }
  }, [leadId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadData, notesData] = await Promise.all([
        leadService.getById(leadId),
        noteService.getByLeadId(leadId)
      ]);
      
      setLead(leadData);
      setNotes(notesData.notes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load lead notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await noteService.delete(noteId);
        toast.success('Note deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="large" color="indigo" />
        </div>
      </MainLayout>
    );
  }

  if (!lead) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-4">Lead not found</h1>
            <p className="text-gray-600 mb-4">
              The lead you are looking for does not exist or has been deleted.
            </p>
            <Link
              href="/leads"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            >
              Back to Leads
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href={`/leads/${leadId}`} 
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FiArrowLeft className="mr-2" /> Back to Lead
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notes for {lead.name}</h1>
          <Link
            href={`/leads/${leadId}/notes/add`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded flex items-center"
          >
            <FiPlus className="mr-2" /> Add Note
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {notes.length === 0 ? (
            <div className="text-center p-12">
              <p className="text-gray-500 mb-4">No notes recorded for this lead yet.</p>
              <Link
                href={`/leads/${leadId}/notes/add`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded inline-flex items-center"
              >
                <FiPlus className="mr-2" /> Add your first note
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notes.map((note) => (
                <div key={note._id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                    <div className="flex space-x-2">
                      <Link
                        href={`/leads/${leadId}/notes/edit/${note._id}`}
                        className="text-green-600 hover:text-green-900"
                        title="Edit note"
                      >
                        <FiEdit />
                      </Link>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete note"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4 prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>By {note.user?.name || 'Unknown'}</span>
                    <span>{formatDate(note.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default LeadNotesPage; 