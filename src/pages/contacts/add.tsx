import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import ContactForm from '@/components/contacts/ContactForm';
import { contactService, clientService } from '@/services/api';
import { IClient, ICreateContactRequest } from '@/services/api/types';

const AddContactPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<IClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await clientService.getAll(1, 100); // Get a large number of clients for the dropdown
      setClients(response.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: ICreateContactRequest) => {
    try {
      setIsSubmitting(true);
      await contactService.create(data);
      toast.success('Contact added successfully');
      router.push('/contacts');
    } catch (error: any) {
      console.error('Error adding contact:', error);
      toast.error(error.response?.data?.message || 'Failed to add contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Add New Contact
        </h2>
      </div>

      <div className="mt-6">
        <ContactForm
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          mode="add"
          clients={clients}
        />
      </div>
    </MainLayout>
  );
};

export default AddContactPage; 