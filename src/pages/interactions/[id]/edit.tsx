import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import interactionService from '@/services/api/interactionService';
import contactService from '@/services/api/contactService';
import { InteractionType } from '@/services/api/types';

const EditInteractionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interaction, setInteraction] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [typeInteraction, setTypeInteraction] = useState('');
  const [dateInteraction, setDateInteraction] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchInteraction(id as string);
    }
  }, [id]);

  const fetchInteraction = async (interactionId: string) => {
    try {
      setLoading(true);
      console.log("⚙️ Fetching interaction:", interactionId);
      const data = await interactionService.getById(interactionId);
      console.log("⚙️ Interaction data received:", data);
      setInteraction(data);
      setDescription(data.description || '');
      setTypeInteraction(data.type_interaction || 'email');
      
      // Format date for input field
      if (data.date_interaction) {
        const date = new Date(data.date_interaction);
        setDateInteraction(date.toISOString().split('T')[0]);
      } else {
        setDateInteraction(new Date().toISOString().split('T')[0]);
      }

      // Extract selected contacts from interaction
      const interactionData = data as any; // Use type assertion for flexibility
      if (interactionData.contact_ids && Array.isArray(interactionData.contact_ids)) {
        console.log("⚙️ Setting selected contacts from contact_ids:", interactionData.contact_ids);
        setSelectedContacts(interactionData.contact_ids);
      } else if (interactionData.contacts && Array.isArray(interactionData.contacts)) {
        console.log("⚙️ Setting selected contacts from contacts array:", interactionData.contacts);
        const contactIds = interactionData.contacts.map((contact: any) => 
          typeof contact === 'string' ? contact : contact._id
        );
        setSelectedContacts(contactIds);
      } else {
        console.log("⚙️ No contacts found in interaction data");
        setSelectedContacts([]);
      }
      
      // Always fetch contacts directly instead of using client ID
      fetchContacts();
    } catch (error) {
      console.error('Error fetching interaction:', error);
      toast.error('Failed to load interaction details');
      router.push('/interactions');
    }
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      console.log("📞 Fetching ALL contacts");
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const endpoint = `${apiUrl}/contacts`;
      
      // Get auth token
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      // Make direct API request to get all contacts
      const response = await fetch(endpoint, { headers });
      const data = await response.json();
      
      console.log("📞 Contacts API raw response:", data);
      
      // Handle different response formats
      if (data && Array.isArray(data)) {
        console.log("📞 Using direct array format with", data.length, "contacts");
        setContacts(data);
      } else if (data && data.contacts && Array.isArray(data.contacts)) {
        console.log("📞 Using contacts[] format with", data.contacts.length, "contacts");
        setContacts(data.contacts);
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log("📞 Using data[] format with", data.data.length, "contacts");
        setContacts(data.data);
      } else {
        console.log("📞 No valid contacts format found in response:", data);
        setContacts([]);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContactChange = (contactId: string) => {
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error('Description is required');
      return;
    }
    
    if (!dateInteraction) {
      toast.error('Date is required');
      return;
    }
    
    if (!interaction) return;
    
    try {
      setSubmitting(true);
      
      const updatedInteraction = {
        description,
        type_interaction: typeInteraction as InteractionType,
        date_interaction: new Date(dateInteraction).toISOString(),
        contact_ids: selectedContacts.length > 0 ? selectedContacts : undefined
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

  // Debug log when contacts or selected contacts change
  useEffect(() => {
    console.log("📊 Contacts loaded:", contacts.length);
    console.log("📊 Selected contacts:", selectedContacts);
    
    if (contacts.length > 0 && selectedContacts.length > 0) {
      // Check if all selected contacts exist in the contacts array
      selectedContacts.forEach(selectedId => {
        const found = contacts.some(contact => contact._id === selectedId);
        console.log(`📊 Selected contact ${selectedId} exists in contacts: ${found}`);
      });
    }
  }, [contacts, selectedContacts]);

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      value={typeInteraction}
                      onChange={(e) => setTypeInteraction(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="call">Call</option>
                      <option value="meeting">Meeting</option>
                      <option value="email">Email</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={dateInteraction}
                      onChange={(e) => setDateInteraction(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {contacts.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contacts
                    </label>
                    <div className="bg-gray-50 p-3 rounded-md max-h-60 overflow-y-auto">
                      {contacts.map((contact) => (
                        <div key={contact._id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`contact-${contact._id}`}
                            value={contact._id}
                            checked={selectedContacts.includes(contact._id)}
                            onChange={() => handleContactChange(contact._id)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label 
                            htmlFor={`contact-${contact._id}`} 
                            className="ml-2 block text-sm text-gray-900"
                          >
                            {contact.prenom} {contact.name} - {contact.email}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                      <>
                        <FiSave className="mr-2" />
                        Save Changes
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

export default EditInteractionPage; 