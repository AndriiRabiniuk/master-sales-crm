import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiEdit, FiArrowLeft, FiPhone, FiMail, FiFileText, FiCalendar, FiList, FiPlus, FiUser, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import leadService, { Lead, Task } from '@/services/api/leadService';
import userService from '@/services/api/userService';
import taskService from '@/services/api/taskService';

const LeadDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const leadId = id as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    if (leadId) {
      Promise.all([
        fetchLeadData(),
        fetchUsers()
      ]);
    }
  }, [leadId]);

  const fetchLeadData = async () => {
    try {
      setLoading(true);
      const leadData = await leadService.getById(leadId);
      setLead(leadData);
    } catch (error) {
      console.error('Error fetching lead details:', error);
      toast.error('Failed to load lead details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleAssignLead = async () => {
    if (!selectedUserId) {
      toast.error('Please select a user to assign the lead to');
      return;
    }

    try {
      await leadService.update(leadId, {
        user_id: selectedUserId
      });
      toast.success('Lead assigned successfully');
      setShowAssignModal(false);
      fetchLeadData();
    } catch (error) {
      console.error('Error assigning lead:', error);
      toast.error('Failed to assign lead');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await taskService.delete(taskToDelete._id);
      toast.success('Task deleted successfully');
      setShowDeleteTaskModal(false);
      fetchLeadData(); // Refresh lead data to update tasks list
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR');
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
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInteractionTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-800';
      case 'call':
        return 'bg-green-100 text-green-800';
      case 'meeting':
        return 'bg-purple-100 text-purple-800';
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
          <Link
            href="/leads"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" />
            Back to Leads
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAssignModal(true)}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiUser className="mr-2" />
              Assign Lead
            </button>
            <Link
              href={`/leads/${lead._id}/edit`}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiEdit className="mr-2" />
              Edit
            </Link>
          </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Assigned User</h3>
                    {lead.user_id && typeof lead.user_id === 'object' ? (
                      <Link 
                        href={`/users/${lead.user_id._id}`}
                        className="flex items-center hover:bg-gray-50 p-2 rounded-lg transition-colors duration-150"
                      >
                        <FiUser className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-gray-800 font-medium">{lead.user_id.name}</p>
                          <p className="text-sm text-gray-500">{lead.user_id.email}</p>
                        </div>
                      </Link>
                    ) : (
                      <p className="text-gray-800">Not assigned</p>
                    )}
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
                {lead.client_id ? (
                  <div>
                    <p className="font-medium text-gray-800 mb-2">{typeof lead.client_id === 'object' ? lead.client_id.name : 'Client ID: ' + lead.client_id}</p>
                    {typeof lead.client_id === 'object' && lead.client_id.SIREN && <p className="text-sm text-gray-600 mb-1">SIREN: {lead.client_id.SIREN}</p>}
                    {typeof lead.client_id === 'object' && lead.client_id.SIRET && <p className="text-sm text-gray-600 mb-1">SIRET: {lead.client_id.SIRET}</p>}
                    {typeof lead.client_id === 'object' && lead.client_id.company_id && typeof lead.client_id.company_id === 'object' && (
                      <p className="text-sm text-gray-600 mb-1">Company: {lead.client_id.company_id.name}</p>
                    )}
                    {typeof lead.client_id === 'object' && lead.client_id._id && (
                      <Link 
                        href={`/clients/${lead.client_id._id}`} 
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2 inline-block"
                      >
                        View Client Details
                      </Link>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">No client associated with this lead</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FiList className="mr-2" /> Interactions
            </h2>
          </div>
          
          <div className="mb-4">
            <Link
              href={`/leads/${lead._id}/interactions/add`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded text-center inline-flex items-center"
            >
              <FiPlus className="mr-2" /> Add Interaction
            </Link>
          </div>
          
          {!lead.interactions || lead.interactions.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No interactions recorded for this lead yet.</p>
              <Link
                href={`/leads/${lead._id}/interactions/add`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded inline-flex items-center"
              >
                <FiPlus className="mr-2" /> Record your first interaction
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lead.interactions.map((interaction: any) => (
                    <tr key={interaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getInteractionTypeColor(
                            interaction.type_interaction
                          )}`}
                        >
                          {interaction.type_interaction}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {interaction.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(interaction.date_interaction || interaction.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/interactions/${interaction._id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit interaction"
                          >
                            <FiEdit />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FiList className="mr-2" /> Tasks
            </h2>
            <Link
              href={`/tasks/add?lead_id=${lead._id}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded text-center inline-flex items-center"
            >
              <FiPlus className="mr-2" /> Add Task
            </Link>
          </div>
          
          {!lead.tasks || lead.tasks.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No tasks assigned for this lead yet.</p>
              <Link
                href={`/tasks/add?lead_id=${lead._id}`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded inline-flex items-center"
              >
                <FiPlus className="mr-2" /> Create your first task
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lead.tasks.map((task: Task) => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {task.titre}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {task.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.statut === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : task.statut === 'in progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {task.statut.charAt(0).toUpperCase() + task.statut.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(task.due_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {task.assigned_to.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/tasks/${task._id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit task"
                          >
                            <FiEdit />
                          </Link>
                          <button
                            onClick={() => {
                              setTaskToDelete(task);
                              setShowDeleteTaskModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete task"
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
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FiList className="mr-2" /> Status History
            </h2>
          </div>
          
          {!lead.statusLogs || lead.statusLogs.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No status changes recorded for this lead yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Previous Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      New Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Changed By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Changed At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lead.statusLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            log.previous_status
                          )}`}
                        >
                          {log.previous_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            log.new_status
                          )}`}
                        >
                          {log.new_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{log.changed_by.name}</div>
                        <div className="text-sm text-gray-500">{log.changed_by.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(log.changed_at).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {log.duration === 0 
                            ? 'Just changed' 
                            : `${log.duration} ${log.duration === 1 ? 'day' : 'days'}`
                          }
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Task Modal */}
        {showDeleteTaskModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Delete Task
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteTaskModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteTask}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign Lead Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Assign Lead
                </h3>
                <div className="mt-2">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
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
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignLead}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LeadDetailPage; 