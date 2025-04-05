import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import leadService from '@/services/api/leadService';
import clientService from '@/services/api/clientService';
import { LeadSource, LeadStatus } from '@/services/api/types';
import userService from '@/services/api/userService';

const AddLeadPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  // Form state
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [source, setSource] = useState<LeadSource | ''>('');
  const [status, setStatus] = useState<LeadStatus>(LeadStatus.START_TO_CALL);
  const [estimatedValue, setEstimatedValue] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    Promise.all([
      fetchClients(),
      fetchUsers()
    ]);
  }, []);

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
        source: source as LeadSource,
        statut: status,
        valeur_estimee: estimatedValue ? parseFloat(estimatedValue) : undefined,
        description: description || undefined
      };

      await leadService.create(leadData);
      toast.success('Lead created successfully');
      router.push('/leads');
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Failed to create lead');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/leads" 
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FiArrowLeft className="mr-2" /> Back to Leads
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add New Lead</h1>
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

              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Link
                  href="/leads"
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
                      <FiSave className="mr-2" /> Save Lead
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

export default AddLeadPage; 