import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { FiUsers, FiFileText, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { clientService, leadService, taskService } from '../services/api';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    clientCount: 0,
    leadCount: 0,
    taskCount: 0,
    completedTasks: 0,
  });
  const [leadsByStatus, setLeadsByStatus] = useState({
    new: 0,
    contacted: 0,
    negotiation: 0,
    won: 0,
    lost: 0,
  });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const effectRan = useRef(false);

  useEffect(() => {
    // Skip effect on first render in strict mode's second development render
    if (effectRan.current === true && process.env.NODE_ENV === 'development') {
      return;
    }
    
    effectRan.current = true;
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch clients
        const clients = await clientService.getAll();
        
        // Fetch leads
        const leads = await leadService.getAll();
        
        // Count leads by status
        const leadStatusCounts = {
          new: 0,
          contacted: 0,
          negotiation: 0,
          won: 0,
          lost: 0,
        };
        
        leads.leads.forEach((lead: any) => {
          if (leadStatusCounts[lead.statut as keyof typeof leadStatusCounts] !== undefined) {
            leadStatusCounts[lead.statut as keyof typeof leadStatusCounts]++;
          }
        });
        
        // Fetch tasks
        const tasks = await taskService.getAll();
        const completedTasksCount = tasks.tasks.filter((task: any) => task.statut === 'completed').length;
        
        setStats({
          clientCount: clients.total|| 0,
          leadCount: leads.total || 0,
          taskCount: tasks.total || 0,
          completedTasks: completedTasksCount || 0,
        });
        
        setLeadsByStatus(leadStatusCounts);
        setRecentTasks(tasks?.tasks?.slice(0, 5));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchDashboardData();
    }
  }, [authLoading]);

  // Chart data for lead statuses
  const leadStatusData = {
    labels: ['New', 'Contacted', 'Negotiation', 'Won', 'Lost'],
    datasets: [
      {
        label: 'Leads by Status',
        data: [
          leadsByStatus.new,
          leadsByStatus.contacted,
          leadsByStatus.negotiation,
          leadsByStatus.won,
          leadsByStatus.lost,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 99, 132, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for task completion
  const taskCompletionData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Task Completion',
        data: [stats.completedTasks, stats.taskCount - stats.completedTasks],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading || authLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Welcome back, {user?.firstName || 'User'}
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Here's what's happening with your sales activity today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Clients */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiUsers className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Clients
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.clientCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Leads */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiFileText className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Leads
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.leadCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCalendar className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Tasks
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.taskCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Tasks
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.completedTasks}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Leads by Status</h3>
          <div className="h-64">
            <Pie data={leadStatusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Task Completion</h3>
          <div className="h-64">
            <Pie data={taskCompletionData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Tasks
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentTasks.length > 0 ? (
            recentTasks.map((task: any) => (
              <li key={task._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{task.titre}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : task.status === 'in-progress' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <FiCalendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No tasks found
            </li>
          )}
        </ul>
      </div>
    </MainLayout>
  );
};

export default Dashboard; 