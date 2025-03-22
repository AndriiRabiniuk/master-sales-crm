import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import ClientForm from '@/components/clients/ClientForm';
import { clientService } from '@/services/api';

const AddClientPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await clientService.create(data);
      toast.success('Client created successfully');
      router.push('/clients');
    } catch (error: any) {
      console.error('Error creating client:', error);
      toast.error(error.response?.data?.message || 'Failed to create client');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Add New Client
        </h2>
      </div>

      <div className="mt-6">
        <ClientForm
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          mode="add"
        />
      </div>
    </MainLayout>
  );
};

export default AddClientPage; 