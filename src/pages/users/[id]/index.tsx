import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiEdit, FiKey, FiUser, FiMail, FiCalendar, FiShield, FiBriefcase } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import userService, { User, UserRole } from '@/services/api/userService';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const UserDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchUser(id as string);
    }
  }, [id]);

  const fetchUser = async (userId: string) => {
    try {
      setLoading(true);
      const data = await userService.getById(userId);
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to fetch user details');
      router.push('/users');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue: string | Date | any) => {
    if (!dateValue) return 'N/A';
    
    // If it's an object with _id and name properties (likely a reference)
    if (typeof dateValue === 'object' && dateValue !== null) {
      if (dateValue._id && dateValue.name) {
        return `${dateValue.name}`;
      }
      
      // If it's a Date object or has toLocaleString method
      if (dateValue instanceof Date || dateValue.toLocaleString) {
        return dateValue.toLocaleString();
      }
    }
    
    // Otherwise treat as string
    try {
      return new Date(dateValue).toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return String(dateValue);
    }
  };

  const getRoleBadgeColor = (role: UserRole | any) => {
    // Handle case when role is an object
    if (typeof role === 'object' && role !== null) {
      if (role._id) {
        // Try to match by role name if present
        if (role.name) {
          const roleName = role.name.toLowerCase();
          if (roleName.includes('super') || roleName.includes('admin')) return 'bg-purple-100 text-purple-800';
          if (roleName.includes('admin')) return 'bg-red-100 text-red-800';
          if (roleName.includes('manager')) return 'bg-blue-100 text-blue-800';
          if (roleName.includes('sales')) return 'bg-green-100 text-green-800';
          if (roleName.includes('support')) return 'bg-yellow-100 text-yellow-800';
        }
        return 'bg-gray-100 text-gray-800';
      }
    }
    
    // Handle normal enum values
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-purple-100 text-purple-800';
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800';
      case UserRole.MANAGER:
        return 'bg-blue-100 text-blue-800';
      case UserRole.SALES:
        return 'bg-green-100 text-green-800';
      case UserRole.SUPPORT:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRoleLabel = (role: UserRole | any): string => {
    // Handle case when role is an object
    if (typeof role === 'object' && role !== null) {
      if (role._id && role.name) {
        return role.name; // Return name if it's a reference object
      }
      return 'Unknown Role';
    }
    
    // Handle string role values
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.MANAGER:
        return 'Manager';
      case UserRole.SALES:
        return 'Sales';
      case UserRole.SUPPORT:
        return 'Support';
      default:
        return String(role);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header with back button and actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <Link
              href="/users"
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-150"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-500" />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-800">User Details</h1>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link
              href={`/users/${id}/password`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
            >
              <FiKey className="mr-2 h-5 w-5" />
              Change Password
            </Link>
            <Link
              href={`/users/${id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
            >
              <FiEdit className="mr-2 h-5 w-5" />
              Edit
            </Link>
          </div>
        </div>

        {/* User details content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : user ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  <FiUser className="h-10 w-10 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{user.name}</h3>
                  <div className="mt-1 max-w-2xl text-sm text-gray-500 flex items-center">
                    <FiMail className="mr-1" /> {user.email}
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {formatRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <FiShield className="mr-2" /> Role
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatRoleLabel(user.role)}
                  </dd>
                </div>
                {user.company_id && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FiBriefcase className="mr-2" /> Company ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {user.company_id.name}
                    </dd>
                  </div>
                )}
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <FiCalendar className="mr-2" /> Created At
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDate(user.created_at)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <FiCalendar className="mr-2" /> Last Updated
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDate(user.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">User not found</p>
            <Link href="/users" className="mt-4 text-indigo-600 hover:text-indigo-800">
              Back to users
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserDetailPage; 