import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiEye, FiEdit, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import leadService, { Lead } from '@/services/api/leadService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Pagination from '@/components/common/Pagination';

const LeadsPage = () => {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchLeads(currentPage);
  }, [currentPage]);

  const fetchLeads = async (page: number, search = '') => {
    try {
      setLoading(true);
      const response = await leadService.getAll(page, itemsPerPage, search);
      setLeads(response.leads);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
      setCurrentPage(response.page);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
    fetchLeads(1, searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
    fetchLeads(1, '');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.delete(id);
        toast.success('Lead deleted successfully');
        fetchLeads(currentPage, isSearching ? searchTerm : '');
      } catch (error) {
        console.error('Error deleting lead:', error);
        toast.error('Failed to delete lead');
      }
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchLeads(1, isSearching ? searchTerm : '');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'website':
        return 'bg-indigo-100 text-indigo-800';
      case 'referral':
        return 'bg-purple-100 text-purple-800';
      case 'event':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leads</h1>
          <Link 
            href="/leads/add" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded flex items-center"
          >
            <FiPlus className="mr-2" /> Add Lead
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search leads by name..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {isSearching && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded flex items-center"
              >
                <FiSearch className="mr-2" /> Search
              </button>
              {isSearching && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                >
                  Clear
                </button>
              )}
            </form>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-12">
              <LoadingSpinner size="large" color="indigo" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.length > 0 ? (
                      leads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {lead.client_id.name || '—'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceBadgeColor(lead.source)}`}>
                              {lead.source}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(lead.statut)}`}>
                              {lead.statut}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                              }).format(lead.valeur_estimee)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(lead.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                            <Link
                              href={`/leads/${lead._id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View Details"
                            >
                              <FiEye />
                            </Link>
                            <Link
                              href={`/leads/edit/${lead._id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <FiEdit />
                            </Link>
                            <button
                              onClick={() => handleDelete(lead._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          {isSearching ? 'No leads found matching your search.' : 'No leads available.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">Items per page:</span>
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default LeadsPage; 