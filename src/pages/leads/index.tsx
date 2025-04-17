import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiEye, FiEdit, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import leadService, { Lead, LeadsResponse } from '@/services/api/leadService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Pagination from '@/components/common/Pagination';

const LeadsPage = () => {
  const router = useRouter();
  const { client_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showPersonalOnly, setShowPersonalOnly] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [pagination.currentPage, showPersonalOnly]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response: LeadsResponse = await leadService.getAll(
        pagination.currentPage,
        pagination.limit,
        searchTerm,
        typeof client_id === 'string' ? client_id : undefined,
        showPersonalOnly
      );
      
      // Filter by status if needed
      let filteredLeads = response.leads;
      if (filterStatus) {
        filteredLeads = filteredLeads.filter((lead) => lead.statut === filterStatus);
      }
      
      setLeads(filteredLeads);
      setPagination({
        totalPages: response.totalPages,
        currentPage: response.page,
        limit: response.limit,
        total: response.total,
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    fetchLeads();
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setPagination({ ...pagination, currentPage: 1 });
    fetchLeads();
  };

  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.delete(leadId);
        toast.success('Lead deleted successfully');
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
        toast.error('Failed to delete lead');
      }
    }
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'start-to-call':
        return 'bg-blue-100 text-blue-800';
      case 'call-to-connect':
        return 'bg-yellow-100 text-yellow-800';
      case 'connect-to-contact':
        return 'bg-green-100 text-green-800';
      case 'contact-to-demo':
        return 'bg-purple-100 text-purple-800';
      case 'demo-to-close':
        return 'bg-indigo-100 text-indigo-800';
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Leads</h1>
          <Link
            href="/leads/add"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded flex items-center"
          >
            <FiPlus className="mr-2" /> Create Lead
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search leads..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Search
                  </button>
                </div>
              </form>
              
              <div className="flex items-center">
                <label htmlFor="personalLeads" className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="personalLeads"
                    checked={showPersonalOnly}
                    onChange={() => {
                      setShowPersonalOnly(!showPersonalOnly);
                      setPagination({...pagination, currentPage: 1});
                    }}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">Show my leads only</span>
                </label>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <LoadingSpinner size="large" color="indigo" />
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-gray-500 mb-4">No leads found</p>
                <Link
                  href="/leads/add"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded inline-flex items-center"
                >
                  <FiPlus className="mr-2" /> Create your first lead
                </Link>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Est. Value
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {typeof lead.client_id === 'string' ? 'Loading...' : lead.client_id.name || 'No client'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            lead.statut
                          )}`}
                        >
                          {lead.statut.charAt(0).toUpperCase() + lead.statut.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.source || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.valeur_estimee ? formatValue(lead.valeur_estimee) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/leads/${lead._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View details"
                          >
                            <FiEye />
                          </Link>
                          <Link
                            href={`/leads/${lead._id}/edit`}
                            className="text-green-600 hover:text-green-900"
                            title="Edit lead"
                          >
                            <FiEdit />
                          </Link>
                          <button
                            onClick={() => handleDeleteLead(lead._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete lead"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && leads.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
              <Pagination
                totalPages={pagination.totalPages}
                currentPage={pagination.currentPage}
                onPageChange={handlePageChange}
                totalItems={pagination.total}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default LeadsPage; 