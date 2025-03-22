import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import leadService from '@/services/api/leadService';
import noteService, { Note } from '@/services/api/noteService';

const AddNotePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const leadId = id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lead, setLead] = useState<any>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (leadId) {
      fetchLead();
    }
  }, [leadId]);

  const fetchLead = async () => {
    try {
      const leadData = await leadService.getById(leadId);
      setLead(leadData);
    } catch (error) {
      console.error('Error fetching lead:', error);
      toast.error('Failed to load lead details');
      router.push('/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Note title is required');
      return;
    }

    if (!content.trim()) {
      toast.error('Note content is required');
      return;
    }

    try {
      setSubmitting(true);
      
      // Use the authenticated user's ID from a context or auth service if available
      // For now, we'll use a placeholder
      const userId = localStorage.getItem('userId') || ''; // Replace with actual user ID from auth context
      
      const noteData = {
        lead_id: leadId,
        user_id: userId,
        title,
        content
      };

      await noteService.create(noteData);
      toast.success('Note added successfully');
      router.push(`/leads/${leadId}/notes`);
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to add note');
      setSubmitting(false);
    }
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
              The lead you are trying to add a note to does not exist or has been deleted.
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
            href={`/leads/${leadId}/notes`} 
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FiArrowLeft className="mr-2" /> Back to Notes
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add Note for {lead.name}</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Link
                  href={`/leads/${leadId}/notes`}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded flex items-center"
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner size="small" color="white" />
                      <span className="ml-2">Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" /> Save Note
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddNotePage; 