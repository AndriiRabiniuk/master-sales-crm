import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import taskService, { Task } from '@/services/api/taskService';
import userService from '@/services/api/userService';
import interactionService from '@/services/api/interactionService';

const AddTaskPage = () => {
  const router = useRouter();
  const { lead_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<Task['statut']>('not_started');
  const [priority, setPriority] = useState<Task['priorite']>('medium');
  const [userId, setUserId] = useState('');
  const [interactionId, setInteractionId] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([fetchUsers(), fetchInteractions()])
      .finally(() => setLoading(false));
  }, [lead_id]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.users || []);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      return null;
    }
  };

  const fetchInteractions = async () => {
    try {
      const response = await interactionService.getAll(1, 500);
      // Filter interactions by lead_id if it exists
      const filteredInteractions = lead_id 
        ? response.interactions.filter((interaction: any) => interaction.lead_id._id === lead_id)
        : response.interactions;
      setInteractions(filteredInteractions || []);
      return response;
    } catch (error) {
      console.error('Error fetching interactions:', error);
      toast.error('Failed to load interactions');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!interactionId) {
      toast.error('Interaction is required');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const taskData = {
        titre: title,
        description: description || undefined,
        due_date: dueDate || undefined,
        statut: status,
        priorite: priority,
        interaction_id: interactionId,
        assigned_to: userId || undefined
      };
      
      const newTask = await taskService.create(taskData);
      toast.success('Task created successfully');
      // If we came from a lead page, go back there
      if (lead_id) {
        router.push(`/leads/${lead_id}`);
      } else {
        router.push(`/tasks/${newTask._id}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            href={lead_id ? `/leads/${lead_id}` : "/tasks"}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <FiArrowLeft className="mr-2" /> Back to {lead_id ? 'Lead' : 'Tasks'}
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add New Task</h1>

            {loading ? (
              <div className="flex justify-center py-10">
                <LoadingSpinner />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter task title"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter task description (optional)"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="interaction" className="block text-sm font-medium text-gray-700 mb-1">
                    Related Interaction <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="interaction"
                    value={interactionId}
                    onChange={(e) => setInteractionId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select an interaction</option>
                    {interactions.map((interaction) => (
                      <option key={interaction._id} value={interaction._id}>
                        {interaction.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned To
                    </label>
                    <select
                      id="assignedTo"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Task['statut'])}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Task['priorite'])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href={lead_id ? `/leads/${lead_id}` : "/tasks"}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <LoadingSpinner size="small" color="white" />
                        <span className="ml-2">Creating...</span>
                      </>
                    ) : (
                      <FiSave className="mr-2" />
                    )}
                    Create Task
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddTaskPage; 