import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiPlus, FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import interactionService from '@/services/api/interactionService';
import Pagination from '@/components/common/Pagination';

const InteractionsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInteractions();
  }, [page]);

  const fetchInteractions = async () => {
    try {
      setLoading(true);
      const response = await interactionService.getAll(page, limit, searchTerm);
      setInteractions(response.interactions || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total || 0);
    } catch (error) {
      console.error('Error fetching interactions:', error);
      toast.error('Failed to load interactions');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchInteractions();
  };

  const handleDeleteInteraction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      try {
        await interactionService.delete(id);
        toast.success('Interaction deleted successfully');
        fetchInteractions();
      } catch (error) {
        console.error('Error deleting interaction:', error);
        toast.error('Failed to delete interaction');
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Interactions</h1>
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search interactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
              >
                Search
              </button>
            </form>
            <Link
              href="/interactions/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded flex items-center"
            >
              <FiPlus className="mr-2" />
              Add Interaction
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" color="indigo" />
          </div>
        ) : interactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 mb-4">No interactions found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Lead
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {interactions.map((interaction) => (
                    <tr key={interaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          <Link
                            href={`/interactions/${interaction._id}`}
                            className="hover:text-indigo-600"
                          >
                            {interaction.description}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(
                            interaction.type_interaction
                          )}`}
                        >
                          {interaction.type_interaction}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(interaction.date_interaction || interaction.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {interaction.lead_id && (
                          <Link
                            href={`/leads/${interaction.lead_id._id}`}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                          >
                            {interaction.lead_id.name}
                          </Link>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/interactions/${interaction._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View interaction"
                          >
                            <FiEye />
                          </Link>
                          <Link
                            href={`/interactions/${interaction._id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit interaction"
                          >
                            <FiEdit />
                          </Link>
                          <button
                            onClick={() => handleDeleteInteraction(interaction._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete interaction"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default InteractionsPage; 