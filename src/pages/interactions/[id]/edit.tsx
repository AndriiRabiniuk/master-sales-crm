import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import interactionService, { Interaction } from '@/services/api/interactionService';

const EditInteractionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interaction, setInteraction] = useState<Interaction | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Interaction['type']>('call');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (id) {
      fetchInteraction(id as string);
    }
  }, [id]);

  const fetchInteraction = async (interactionId: string) => {
    try {
      setLoading(true);
      const data = await interactionService.getById(interactionId);
      setInteraction(data);
      setTitle(data.title);
      setType(data.type);
      setContent(data.content);
      setDate(data.date ? new Date(data.date).toISOString().split('T')[0] : '');
    } catch (error) {
      console.error('Error fetching interaction:', error);
      toast.error('Failed to load interaction details');
      router.push('/interactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }
    
    if (!date) {
      toast.error('Date is required');
      return;
    }
    
    if (!interaction) return;
    
    try {
      setSubmitting(true);
      
      const updatedInteraction = {
        title,
        type,
        content,
        date
      };
      
      await interactionService.update(interaction._id, updatedInteraction);
      toast.success('Interaction updated successfully');
      router.push(`/interactions/${interaction._id}`);
    } catch (error) {
      console.error('Error updating interaction:', error);
      toast.error('Failed to update interaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            href={interaction ? `/interactions/${interaction._id}` : '/interactions'}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <FiArrowLeft className="mr-2" /> Back to {interaction ? 'Interaction Details' : 'Interactions'}
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Interaction</h1>

            {loading ? (
              <div className="flex justify-center py-10">
                <LoadingSpinner />
              </div>
            ) : !interaction ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Interaction not found</p>
              </div>
            ) : (
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
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value as Interaction['type'])}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="call">Call</option>
                      <option value="meeting">Meeting</option>
                      <option value="email">Email</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href={`/interactions/${interaction._id}`}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <LoadingSpinner size="small" color="white" />
                        <span className="ml-2">Saving...</span>
                      </>
                    ) : (
                      <FiSave className="mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditInteractionPage; 