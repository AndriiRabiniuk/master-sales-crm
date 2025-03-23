import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import noteService, { CreateNoteRequest } from '@/services/api/noteService';
import clientService from '@/services/api/clientService';

const AddNotePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contenu, setContenu] = useState('');
  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getAll(1, 100); // Get a large number of clients for the dropdown
      setClients(response.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contenu.trim()) {
      toast.error('Note content is required');
      return;
    }

    if (!clientId) {
      toast.error('Please select a client');
      return;
    }

    try {
      setSubmitting(true);

      const noteData: CreateNoteRequest = {
        contenu,
        client_id: clientId,
      };

      const newNote = await noteService.create(noteData);
      toast.success('Note created successfully');
      router.push(`/notes/${newNote._id}`);
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
      setSubmitting(false);
    }
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

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add New Note</h1>

            {loading ? (
              <div className="flex justify-center py-10">
                <LoadingSpinner />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                    Client <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="client"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.name || client.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="contenu" className="block text-sm font-medium text-gray-700 mb-1">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contenu"
                    value={contenu}
                    onChange={(e) => setContenu(e.target.value)}
                    rows={6}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter note content..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/notes"
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
                        <span className="ml-2">Creating...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2 -ml-1 h-5 w-5" />
                        Create Note
                      </>
                    )}
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

export default AddNotePage; 