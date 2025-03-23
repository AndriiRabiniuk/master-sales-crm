import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiEdit, FiArrowLeft } from 'react-icons/fi';
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
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'delayed':
        return 'Delayed';
      default:
        return status;
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
                <h1 className="text-2xl font-semibold text-gray-800">{task.title}</h1>
                <Link
                  href={`/tasks/${task._id}/edit`}
                  className="p-2 text-blue-600 hover:text-blue-900 rounded-full hover:bg-gray-100"
                  title="Edit"
                >
                  <FiEdit className="w-5 h-5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-sm font-medium">{getStatusLabel(task.statut)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="text-sm font-medium">{formatDate(task.due_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-sm font-medium">{formatDate(task.created_at)}</p>
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
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TaskDetailPage; 