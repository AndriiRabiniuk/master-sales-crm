import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiEdit, FiArrowLeft, FiUser, FiCalendar, FiInfo, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import interactionService from '@/services/api/interactionService';

const InteractionDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [interaction, setInteraction] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchInteraction(id as string);
    }
  }, [id]);

  const fetchInteraction = async (interactionId: string) => {
    try {
      setLoading(true);
      console.log("Fetching interaction details:", interactionId);
      const data = await interactionService.getById(interactionId);
      console.log("Interaction details received:", data);
      const dataWithContacts = data as any;
      console.log("Contact data available:", dataWithContacts.contacts ? 
        `Yes, ${dataWithContacts.contacts.length} contacts` : "No contacts found");
      setInteraction(data);
    } catch (error) {
      console.error('Error fetching interaction:', error);
      toast.error('Failed to load interaction details');
      router.push('/interactions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'call':
        return 'bg-blue-100 text-blue-800';
      case 'meeting':
        return 'bg-green-100 text-green-800';
      case 'email':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            href="/interactions"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <FiArrowLeft className="mr-2" /> Back to Interactions
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : !interaction ? (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 text-center">
            <p className="text-gray-500">Interaction not found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800">Interaction Details</h1>
                  {interaction.lead_id && (
                    <div className="mt-1 text-sm text-gray-500">
                      Lead: <Link href={`/leads/${interaction.lead_id._id}`} className="text-indigo-600 hover:text-indigo-800">
                        {interaction.lead_id.name}
                      </Link>
                    </div>
                  )}
                </div>
                <Link
                  href={`/interactions/${interaction._id}/edit`}
                  className="p-2 text-blue-600 hover:text-blue-900 rounded-full hover:bg-gray-100"
                  title="Edit"
                >
                  <FiEdit className="w-5 h-5" />
                </Link>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start">
                    <FiInfo className="mt-1 mr-2 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="text-sm font-medium">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(interaction.type_interaction)}`}>
                          {interaction.type_interaction}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiCalendar className="mt-1 mr-2 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Interaction Date</p>
                      <p className="text-sm font-medium">{formatDate(interaction.date_interaction)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiCalendar className="mt-1 mr-2 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Created At</p>
                      <p className="text-sm font-medium">{formatDate(interaction.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {interaction.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Description</h2>
                  <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap break-words">
                    {interaction.description}
                  </div>
                </div>
              )}

              {interaction.contacts && interaction.contacts.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Contacts</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {interaction.contacts.map((contact: any) => (
                          <tr key={contact._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {contact.prenom} {contact.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{contact.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{contact.telephone || '-'}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <div>ID: {interaction._id}</div>
                  <div>Last Updated: {formatDate(interaction.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default InteractionDetailPage; 