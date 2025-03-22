import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import leadService from '@/services/api/leadService';
import contactService from '@/services/api/contactService';
import interactionService, { Interaction } from '@/services/api/interactionService';

const AddInteractionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const leadId = id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lead, setLead] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  
  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Interaction['type']>('call');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [contactId, setContactId] = useState('');

  useEffect(() => {
    if (leadId) {
      Promise.all([
        fetchLead(),
        fetchContacts()
      ]);
    }
  }, [leadId]);

  const fetchLead = async () => {
    try {
      const leadData = await leadService.getById(leadId);
      setLead(leadData);
      return leadData;
    } catch (error) {
      console.error('Error fetching lead:', error);
      toast.error('Failed to load lead details');
      router.push('/leads');
      return null;
    }
  };

  const fetchContacts = async () => {
    try {
      // Assuming we have a way to get contacts for a client
      // If the lead has a client_id, fetch contacts for that client
      const leadData = await leadService.getById(leadId);
      
      if (leadData.client_id) {
        const contactsData = await contactService.getByClientId(leadData.client_id);
        setContacts(contactsData.contacts || []);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Interaction title is required');
      return;
    }

    try {
      setSubmitting(true);
      
      // Use the authenticated user's ID from a context or auth service if available
      // For now, we'll use a placeholder
      const userId = localStorage.getItem('userId') || ''; // Replace with actual user ID from auth context
      
      const interactionData = {
        lead_id: leadId,
        contact_id: contactId || undefined,
        user_id: userId,
        type,
        title,
        content,
        date
      };

      await interactionService.create(interactionData);
      toast.success('Interaction added successfully');
      router.push(`/leads/${leadId}/interactions`);
    } catch (error) {
      console.error('Error creating interaction:', error);
      toast.error('Failed to add interaction');
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
              The lead you are trying to add an interaction to does not exist or has been deleted.
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
            href={`/leads/${leadId}/interactions`} 
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FiArrowLeft className="mr-2" /> Back to Interactions
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add Interaction for {lead.name}</h1>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as Interaction['type'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <select
                    id="contact"
                    value={contactId}
                    onChange={(e) => setContactId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a contact (optional)</option>
                    {contacts.map((contact) => (
                      <option key={contact._id} value={contact._id}>
                        {contact.name || `${contact.prenom} ${contact.nom}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Link
                  href={`/leads/${leadId}/interactions`}
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
                      <FiSave className="mr-2" /> Save Interaction
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

export default AddInteractionPage; 