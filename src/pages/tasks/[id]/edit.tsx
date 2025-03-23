import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import taskService, { Task } from '@/services/api/taskService';

const EditTaskPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<Task['statut']>('not_started');
  const [priority, setPriority] = useState<Task['priorite']>('medium');

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
      setTitle(data.title);
      setDescription(data.description || '');
      setDueDate(data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : '');
      setStatus(data.statut);
      setPriority(data.priorite);
    } catch (error) {
      console.error('Error fetching task:', error);
      toast.error('Failed to load task details');
      router.push('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!task) return;
    
    try {
      setSubmitting(true);
      
      const updatedTask = {
        title,
        description,
        due_date: dueDate || undefined,
        statut: status,
        priorite: priority
      };
      
      await taskService.update(task._id, updatedTask);
      toast.success('Task updated successfully');
      router.push(`/tasks/${task._id}`);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            href={task ? `/tasks/${task._id}` : '/tasks'}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <FiArrowLeft className="mr-2" /> Back to {task ? 'Task Details' : 'Tasks'}
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Task</h1>

            {loading ? (
              <div className="flex justify-center py-10">
                <LoadingSpinner />
              </div>
            ) : !task ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Task not found</p>
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
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                     <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="pending">pending</option>
                    </select>
                  </div>

                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href={`/tasks/${task._id}`}
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
                        <span className="ml-2">Saving...</span>
                      </>
                    ) : (
                      <FiSave className="mr-2" />
                    )}
                    Save Changes
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

export default EditTaskPage; 