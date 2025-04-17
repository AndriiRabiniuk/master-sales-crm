import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiEdit, FiTrash2, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import interactionService from '@/services/api/interactionService';
import userService from '@/services/api/userService';
import taskService, { Task } from '@/services/api/taskService';

const TaskDetailPage = () => {
  const router = useRouter();
  const { id, taskId } = router.query;
  const interactionId = id as string;
  
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const [interaction, setInteraction] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  useEffect(() => {
    if (interactionId && taskId) {
      fetchData();
    }
  }, [interactionId, taskId]);

  const fetchData = async () => {
    try {
      const taskData = await taskService.getById(taskId as string);
      setTask(taskData);
      
      // Fetch interaction data
      const interactionData = await interactionService.getById(taskData.interaction_id);
      setInteraction(interactionData);
      
      // Fetch user data if available
      if (taskData.user_id) {
        try {
          const userData = await userService.getById(taskData.user_id);
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user:', error);
          // Don't show error toast for user fetch failures
        }
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
      toast.error('Failed to load task details');
      router.push(`/interactions/${interactionId}/tasks`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!task) return;
    
    try {
      setProcessingAction('complete');
      
      const updatedTaskData = {
        ...task,
        statut: 'completed' as Task['statut']
      };
      
      await taskService.update(taskId as string, updatedTaskData);
      toast.success('Task marked as completed');
      
      // Refresh the task data
      setTask({
        ...task,
        statut: 'completed' as Task['statut']
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    } finally {
      setProcessingAction(null);
    }
  };

  const handleDeleteTask = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setProcessingAction('delete');
      await taskService.delete(taskId as string);
      toast.success('Task deleted successfully');
      router.push(`/interactions/${interactionId}/tasks`);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      setProcessingAction(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-200 text-gray-800';
      case 'in progress':
        return 'bg-blue-200 text-blue-800';
      case 'completed':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-200 text-gray-800';
      case 'medium':
        return 'bg-yellow-200 text-yellow-800';
      case 'high':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Not Started';
      case 'in progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      default:
        return priority;
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

  if (!task || !interaction) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-4">Task not found</h1>
            <p className="text-gray-600 mb-4">
              The task you are looking for does not exist or has been deleted.
            </p>
            <Link
              href={`/interactions/${interactionId}/tasks`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            >
              Back to Tasks
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
            href={`/interactions/${interactionId}/tasks`} 
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FiArrowLeft className="mr-2" /> Back to Tasks
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <div className="flex space-x-2">
            {task.statut !== 'completed' && (
              <button
                onClick={handleCompleteTask}
                disabled={processingAction === 'complete'}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center"
              >
                {processingAction === 'complete' ? (
                  <>
                    <LoadingSpinner size="small" color="white" />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2" />
                    Mark as Complete
                  </>
                )}
              </button>
            )}
            <Link
              href={`/interactions/${interactionId}/tasks/edit/${taskId}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded flex items-center"
            >
              <FiEdit className="mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDeleteTask}
              disabled={processingAction === 'delete'}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center"
            >
              {processingAction === 'delete' ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  <span className="ml-2">Deleting...</span>
                </>
              ) : (
                <>
                  <FiTrash2 className="mr-2" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Task Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Title</h3>
                    <p className="mt-1">{task.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1 whitespace-pre-wrap">{task.description || 'No description provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1">
                      <span className={`px-2 py-1 text-sm rounded-full ${getStatusBadgeColor(task.statut)}`}>
                        {getStatusLabel(task.statut)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                    <div className="mt-1">
                      <span className={`px-2 py-1 text-sm rounded-full ${getPriorityBadgeColor(task.priorite)}`}>
                        {getPriorityLabel(task.priorite)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                    <p className="mt-1">{formatDate(task.due_date)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                    <p className="mt-1">{user ? user.name : 'Not assigned'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Related Interaction</h3>
                    <p className="mt-1">
                      <Link 
                        href={`/interactions/${interaction._id}`} 
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {interaction.title || 'View interaction'}
                      </Link>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                    <p className="mt-1">{formatDate(task.created_at)}</p>
                  </div>
                  
                  {task.updated_at && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                      <p className="mt-1">{formatDate(task.updated_at)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TaskDetailPage; 