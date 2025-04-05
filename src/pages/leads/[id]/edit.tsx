import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import leadService, { Lead } from '@/services/api/leadService';
import clientService from '@/services/api/clientService';
import { LeadSource, LeadStatus } from '@/services/api/types';
import userService from '@/services/api/userService';

const EditLeadPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const leadId = id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [lead, setLead] = useState<Lead | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [source, setSource] = useState<LeadSource | ''>('');
  const [status, setStatus] = useState<LeadStatus>(LeadStatus.START_TO_CALL);
  const [estimatedValue, setEstimatedValue] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (leadId) {
      Promise.all([
        fetchLead(),
        fetchClients(),
        fetchUsers()
      ]);
    }
  }, [leadId]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const leadData = await leadService.getById(leadId);
      setLead(leadData);
      
      // Set form values
      setName(leadData.name || '');
      setClientId(typeof leadData.client_id === 'string' ? leadData.client_id : leadData.client_id._id);
      setSource(leadData.source || '');
      setStatus(leadData.statut || LeadStatus.START_TO_CALL);
      setEstimatedValue(leadData.valeur_estimee ? String(leadData.valeur_estimee) : '');
      setUserId(typeof leadData.user_id === 'string' ? leadData.user_id : leadData.user_id._id);
    } catch (error) {
      console.error('Error fetching lead:', error);
      toast.error('Failed to load lead details');
      router.push('/leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientService.getAll();
      setClients(response.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Lead name is required');
      return;
    }

    try {
      setSubmitting(true);
      
      const leadData = {
        name,
        client_id: clientId || undefined,
        user_id: userId,
        assigned_user_id: userId,
        source: source as LeadSource,
        statut: status,
        valeur_estimee: estimatedValue ? parseFloat(estimatedValue) : undefined
      };

      await leadService.update(leadId, leadData);
      toast.success('Lead updated successfully');
      router.push(`/leads/${leadId}`);
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    } finally {
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
              The lead you are trying to edit does not exist or has been deleted.
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
            <FiArrowLeft className="mr-2" /> Back to Lead Details
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Lead</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Lead Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                  Associated Client
                </label>
                <select
                  id="client"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a client (optional)</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value as LeadSource)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a source</option>
                    <option value={LeadSource.WEBSITE}>Website</option>
                    <option value={LeadSource.REFERRAL}>Referral</option>
                    <option value={LeadSource.EVENT}>Event</option>
                    <option value={LeadSource.OUTBOUND}>Outbound</option>
                    <option value={LeadSource.INBOUND}>Inbound</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LeadStatus)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value={LeadStatus.START_TO_CALL}>Start to Call</option>
                    <option value={LeadStatus.CALL_TO_CONNECT}>Call to Connect</option>
                    <option value={LeadStatus.CONNECT_TO_CONTACT}>Connect to Contact</option>
                    <option value={LeadStatus.CONTACT_TO_DEMO}>Contact to Demo</option>
                    <option value={LeadStatus.DEMO_TO_CLOSE}>Demo to Close</option>
                    <option value={LeadStatus.LOST}>Lost</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="estimatedValue" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Value (€)
                  </label>
                  <input
                    type="number"
                    id="estimatedValue"
                    min="0"
                    step="0.01"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned User
                </label>
                <select
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <Link
                  href={`/leads/${leadId}`}
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
                      <FiSave className="mr-2" /> Save Changes
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

export default EditLeadPage; 