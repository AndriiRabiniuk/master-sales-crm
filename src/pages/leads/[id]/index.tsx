import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiEdit, FiArrowLeft, FiPhone, FiMail, FiFileText, FiCalendar, FiList, FiCheckSquare } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import leadService from '@/services/api/leadService';
import clientService from '@/services/api/clientService';

const LeadDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const leadId = id as string;
  
  const [lead, setLead] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (leadId) {
      fetchLeadData();
    }
  }, [leadId]);

  const fetchLeadData = async () => {
    try {
      setLoading(true);
      const leadData = await leadService.getById(leadId);
      setLead(leadData);
      
      if (leadData.client_id) {
        const clientData = await clientService.getById(leadData.client_id);
        setClient(clientData);
      }
    } catch (error) {
      console.error('Error fetching lead details:', error);
      toast.error('Failed to load lead details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'proposition':
        return 'bg-yellow-100 text-yellow-800';
      case 'negotiation':
        return 'bg-purple-100 text-purple-800';
      case 'won':
        return 'bg-indigo-100 text-indigo-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <Link href="/leads" className="flex items-center text-indigo-600 hover:text-indigo-800">
            <FiArrowLeft className="mr-2" /> Back to Leads
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          <Link
            href={`/leads/${lead._id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
          >
            <FiEdit className="mr-2" /> Edit Lead
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Lead Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Status</h3>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(lead.statut)}`}>
                      {lead.statut}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Source</h3>
                    <p className="text-gray-800">{lead.source || '—'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Estimated Value</h3>
                    <p className="text-gray-800">{lead.valeur_estimee ? `€${lead.valeur_estimee.toLocaleString()}` : '—'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Created Date</h3>
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-400 mr-2" />
                      <span className="text-gray-800">{formatDate(lead.created_at || lead.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                {lead.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Description</h3>
                    <p className="text-gray-800 whitespace-pre-wrap">{lead.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Associated Client</h2>
                {client ? (
                  <div>
                    <p className="font-medium text-gray-800 mb-2">{client.nom}</p>
                    {client.SIREN && <p className="text-sm text-gray-600 mb-1">SIREN: {client.SIREN}</p>}
                    {client.code_postal && <p className="text-sm text-gray-600 mb-1">Postal Code: {client.code_postal}</p>}
                    <Link 
                      href={`/clients/${client._id}`} 
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2 inline-block"
                    >
                      View Client Details
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-600">No client associated with this lead</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FiList className="mr-2" /> Interactions
              </h2>
              <Link
                href={`/leads/${lead._id}/interactions`}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <Link
              href={`/leads/${lead._id}/interactions/add`}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded text-center block"
            >
              Add Interaction
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FiFileText className="mr-2" /> Notes
              </h2>
              <Link
                href={`/leads/${lead._id}/notes`}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <Link
              href={`/leads/${lead._id}/notes/add`}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded text-center block"
            >
              Add Note
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FiCheckSquare className="mr-2" /> Tasks
              </h2>
              <Link
                href={`/leads/${lead._id}/tasks`}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <Link
              href={`/leads/${lead._id}/tasks/add`}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded text-center block"
            >
              Add Task
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LeadDetailPage; 