import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import leadService from '@/services/api/leadService';
import contactService from '@/services/api/contactService';
import interactionService from '@/services/api/interactionService';
import { InteractionType } from '@/services/api/types';

const AddInteractionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const leadId = id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lead, setLead] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  
  // Form state
  const [description, setDescription] = useState('');
  const [typeInteraction, setTypeInteraction] = useState<InteractionType>(InteractionType.EMAIL);
  const [dateInteraction, setDateInteraction] = useState(new Date().toISOString().split('T')[0]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

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
      // Fetch the lead data to get client information
      const leadData = await leadService.getById(leadId);
      console.log("Lead data for contacts:", leadData);
      
      let clientId = null;
      // Handle different possible structures of client_id
      if (leadData.client_id) {
        if (typeof leadData.client_id === 'string') {
          clientId = leadData.client_id;
        } else if (leadData.client_id._id) {
          clientId = leadData.client_id._id;
        }
      }
      
      if (clientId) {
        console.log("Fetching contacts for client:", clientId);
        const contactsData = await contactService.getByClientId(clientId);
        console.log("Contacts received:", contactsData);
        
        // Handle both possible response formats
        const responseData = contactsData as any;
        if (responseData.contacts && Array.isArray(responseData.contacts)) {
          setContacts(responseData.contacts);
        } else if (responseData.data && Array.isArray(responseData.data)) {
          setContacts(responseData.data);
        } else {
          console.log("Invalid contact data structure received");
          setContacts([]);
        }
      } else {
        console.log("No valid client_id found in lead data");
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
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
      toast.error('Interaction description is required');
      return;
    }

    try {
      setSubmitting(true);
      
      const interactionData = {
        lead_id: leadId,
        description,
        type_interaction: typeInteraction,
        date_interaction: new Date(dateInteraction).toISOString(),
        contact_ids: selectedContacts.length > 0 ? selectedContacts : undefined
      };

      await interactionService.create(interactionData);
      toast.success('Interaction added successfully');
      router.push(`/interactions`);
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id="type"
                    value={typeInteraction}
                    onChange={(e) => setTypeInteraction(e.target.value as InteractionType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value={InteractionType.CALL}>Call</option>
                    <option value={InteractionType.EMAIL}>Email</option>
                    <option value={InteractionType.MEETING}>Meeting</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={dateInteraction}
                    onChange={(e) => setDateInteraction(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
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

              <div className="flex justify-end space-x-3 mt-6">
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
                      <FiSave className="mr-2" />
                      Save Interaction
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