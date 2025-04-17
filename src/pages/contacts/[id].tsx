import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiEdit, FiTrash2, FiArrowLeft, FiMail, FiPhone, FiUser, FiBriefcase } from 'react-icons/fi';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import { contactService } from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ContactDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [contact, setContact] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchContact();
    }
  }, [id]);

  const fetchContact = async () => {
    try {
      setIsLoading(true);
      const data = await contactService.getById(id as string);
      setContact(data);
    } catch (error) {
      console.error('Error fetching contact:', error);
      toast.error('Failed to fetch contact details');
      router.push('/contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        setIsDeleting(true);
        await contactService.delete(id as string);
        toast.success('Contact deleted successfully');
        router.push('/contacts');
      } catch (error) {
        console.error('Error deleting contact:', error);
        toast.error('Failed to delete contact');
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (!contact) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <p className="text-gray-500">Contact not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          {contact.prenom} {contact.nom}
        </h2>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <Link
            href="/contacts"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <FiArrowLeft className="mr-2 -ml-1 h-5 w-5" />
            Back to List
          </Link>
          <Link
            href={`/contacts/edit/${id}`}
            className="ml-3 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            <FiEdit className="mr-2 -ml-1 h-5 w-5" />
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="ml-3 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50"
          >
            <FiTrash2 className="mr-2 -ml-1 h-5 w-5" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            <FiUser className="inline-block mr-2" /> Contact Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details and contact information.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {contact.prenom} {contact.nom}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <FiMail className="mr-2 text-gray-400" />
                <a href={`mailto:${contact.email}`} className="text-indigo-600 hover:text-indigo-900">
                  {contact.email}
                </a>
              </dd>
            </div>
            {contact.telephone && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <FiPhone className="mr-2 text-gray-400" />
                  <a href={`tel:${contact.telephone}`} className="text-indigo-600 hover:text-indigo-900">
                    {contact.telephone}
                  </a>
                </dd>
              </div>
            )}
            {contact.poste && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Position</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <FiBriefcase className="mr-2 text-gray-400" />
                  {contact.poste}
                </dd>
              </div>
            )}
            {contact.client && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Associated client</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Link href={`/clients/${contact.client.id}`} className="text-indigo-600 hover:text-indigo-900">
                    {contact.client.nom}
                  </Link>
                </dd>
              </div>
            )}
            {contact.notes && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {contact.notes}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactDetailsPage; 