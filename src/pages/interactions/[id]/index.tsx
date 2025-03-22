import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiEdit, FiArrowLeft } from 'react-icons/fi';
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
      const data = await interactionService.getById(interactionId);
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
                <h1 className="text-2xl font-semibold text-gray-800">{interaction.title}</h1>
                <Link
                  href={`/interactions/${interaction._id}/edit`}
                  className="p-2 text-blue-600 hover:text-blue-900 rounded-full hover:bg-gray-100"
                  title="Edit"
                >
                  <FiEdit className="w-5 h-5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-sm font-medium">{interaction.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-sm font-medium">{formatDate(interaction.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-sm font-medium">{formatDate(interaction.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium">{formatDate(interaction.updated_at)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Content</h2>
                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap break-words">
                  {interaction.content}
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