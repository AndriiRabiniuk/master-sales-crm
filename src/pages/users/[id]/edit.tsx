import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import userService, { User, UserRole } from '@/services/api/userService';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const EditUserPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.SALES);
  const [companyId, setCompanyId] = useState('');
  
  // Form errors
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    companyId?: string;
  }>({});

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
      
      // Initialize form with user data
      setName(data.name);
      setEmail(data.email);
      setRole(data.role);
      setCompanyId(data.company_id || '');
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to fetch user details');
      router.push('/users');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      const userData = {
        name,
        email,
        role,
      };
      
      await userService.update(id as string, userData);
      
      toast.success('User updated successfully');
      router.push(`/users/${id}`);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header with back button */}
        <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
          <Link
            href={`/users/${id}`}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-150"
          >
            <FiArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-800">Edit User</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : user ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`block w-full sm:text-sm rounded-md shadow-sm ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                    placeholder="Enter user name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full sm:text-sm rounded-md shadow-sm ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                    placeholder="Enter user email"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.SALES}>Sales</option>
                  </select>
                </div>

                {/* Company ID (only for roles other than SUPER_ADMIN) */}
              
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex justify-end">
                <Link
                  href={`/users/${id}`}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner size="small" /> Updating...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2 h-5 w-5" /> Update User
                    </>
                  )}
                </button>
              </div>
            </form>
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

export default EditUserPage; 