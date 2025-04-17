import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiEdit, FiArrowLeft, FiUser, FiCalendar, FiBriefcase, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import taskService, { Task } from '@/services/api/taskService';

const TaskDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (id) {
      fetchTask(id as string);
    }
  }, [id]);

  const fetchTask = async (taskId: string) => {
    try {
      setLoading(true);
      const data = await taskService.getById(taskId);
      setTask(data);
    } catch (error) {
      console.error('Error fetching task:', error);
      toast.error('Failed to load task details');
      router.push('/tasks');
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
      day: 'numeric'
    }).format(date);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'canceled':
        return 'Canceled';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'in progress':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'canceled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            href="/tasks"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <FiArrowLeft className="mr-2" /> Back to Tasks
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : !task ? (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 text-center">
            <p className="text-gray-500">Task not found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">{task.titre}</h1>
                <Link
                  href={`/tasks/edit/${task._id}`}
                  className="p-2 text-blue-600 hover:text-blue-900 rounded-full hover:bg-gray-100"
                  title="Edit"
                >
                  <FiEdit className="w-5 h-5" />
                </Link>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center mb-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.statut)}`}>
                    {getStatusLabel(task.statut)}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <FiCalendar className="mt-1 mr-2 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="text-sm font-medium">{formatDate(task.due_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiUser className="mt-1 mr-2 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Assigned To</p>
                      <p className="text-sm font-medium">{task.assigned_to?.email || 'Not assigned'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiCalendar className="mt-1 mr-2 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="text-sm font-medium">{formatDate(task.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiCalendar className="mt-1 mr-2 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-sm font-medium">{formatDate(task.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {task.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Description</h2>
                  <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap break-words">
                    {task.description}
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Related Information</h2>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start">
                      <FiBriefcase className="mt-1 mr-2 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Client</p>
                        <Link 
                          href={`/clients/${task.interaction_id.lead_id.client_id._id}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          {task.interaction_id.lead_id.client_id.name}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiFileText className="mt-1 mr-2 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Lead</p>
                        <Link 
                          href={`/leads/${task.interaction_id.lead_id._id}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          {task.interaction_id.lead_id.name}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiCalendar className="mt-1 mr-2 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Interaction</p>
                        <div className="flex flex-wrap items-center">
                          <span className="text-sm font-medium">
                            {task.interaction_id.type_interaction} - {formatDate(task.interaction_id.date_interaction)}
                          </span>
                          <Link 
                            href={`/interactions/${task.interaction_id._id}`}
                            className="ml-2 text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TaskDetailPage; 