import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiEye, FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiCheck, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import taskService, { Task } from '@/services/api/taskService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Pagination from '@/components/common/Pagination';

const TasksPage = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage, statusFilter, priorityFilter]);

  const fetchTasks = async (page: number, search = '') => {
    try {
      setLoading(true);
      const response = await taskService.getAll(page, itemsPerPage, search);
      
      // Client-side filtering (ideally this would be server-side)
      let filteredTasks = response.tasks || [];
      if (statusFilter && statusFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.statut === statusFilter);
      }
      if (priorityFilter && priorityFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.priorite === priorityFilter);
      }
      
      setTasks(filteredTasks);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
      setCurrentPage(response.page);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
    fetchTasks(1, searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
    fetchTasks(1, '');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(id);
        toast.success('Task deleted successfully');
        fetchTasks(currentPage, isSearching ? searchTerm : '');
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  const handleToggleCompletion = async (task: Task) => {
    try {
      await taskService.update(task.id, { 
        statut: task.statut === 'completed' ? 'not_started' : 'completed' 
      });
      toast.success(`Task marked as ${task.statut !== 'completed' ? 'completed' : 'not started'}`);
      fetchTasks(currentPage, isSearching ? searchTerm : '');
    } catch (error) {
      console.error('Error updating task completion:', error);
      toast.error('Failed to update task');
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchTasks(1, isSearching ? searchTerm : '');
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePriorityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriorityFilter(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'haute':
        return 'bg-red-100 text-red-800';
      case 'medium':
      case 'moyenne':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
      case 'basse':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <Link 
            href="/tasks/add" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded flex items-center"
          >
            <FiPlus className="mr-2" /> Add Task
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-grow">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search tasks by title or description..."
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
              
              <div className="flex items-center">
                <label htmlFor="statusFilter" className="mr-2 text-sm text-gray-700">Status:</label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              <div className="flex items-center">
                <label htmlFor="priorityFilter" className="mr-2 text-sm text-gray-700">Priority:</label>
                <select
                  id="priorityFilter"
                  value={priorityFilter}
                  onChange={handlePriorityFilterChange}
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
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
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Related To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <tr key={task.id} className={`hover:bg-gray-50 ${task.statut === 'completed' ? 'bg-gray-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleCompletion(task)}
                              className={`rounded-full p-1 focus:outline-none ${
                                task.statut === 'completed' 
                                  ? 'text-green-600 hover:bg-green-50' 
                                  : 'text-gray-400 hover:bg-gray-50'
                              }`}
                              title={task.statut === 'completed' ? 'Mark as not started' : 'Mark as complete'}
                            >
                              {task.statut === 'completed' ? (
                                <FiCheck className="h-5 w-5" />
                              ) : (
                                <FiClock className="h-5 w-5" />
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${task.statut === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {task.titre}
                            </div>
                            {task.description && (
                              <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                {task.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(task.due_date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {task.assigned_to ? (
                                <Link href={`/clients/${task.assigned_to._id}`} className="text-indigo-600 hover:text-indigo-900">
                                  {task.assigned_to?.email || 'Client'}
                                </Link>
                              ) : task.lead_id ? (
                                <Link href={`/leads/${task.lead_id}`} className="text-indigo-600 hover:text-indigo-900">
                                  {task.lead?.nom || 'Lead'}
                                </Link>
                              ) : (
                                '—'
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                            <Link
                              href={`/tasks/${task._id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View Details"
                            >
                              <FiEye />
                            </Link>
                            <Link
                              href={`/tasks/edit/${task._id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <FiEdit />
                            </Link>
                            <button
                              onClick={() => handleDelete(task._id)}
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
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          {isSearching ? 'No tasks found matching your search.' : 'No tasks available.'}
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

export default TasksPage; 