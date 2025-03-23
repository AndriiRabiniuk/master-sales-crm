import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import ClientForm from '@/components/clients/ClientForm';
import { clientService } from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const EditClientPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [id]);

  const fetchClient = async () => {
    try {
      setIsLoading(true);
      const data = await clientService.getById(id as string);
      setClient(data);
    } catch (error) {
      console.error('Error fetching client:', error);
      toast.error('Failed to fetch client details');
      router.push('/clients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await clientService.update(id as string, data);
      toast.success('Client updated successfully');
      router.push('/clients');
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast.error(error.response?.data?.message || 'Failed to update client');
    } finally {
      setIsSubmitting(false);
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

  if (!client) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <p className="text-gray-500">Client not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Edit Client: {client.name}
        </h2>
      </div>

      <div className="mt-6">
        <ClientForm
          initialData={client}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          mode="edit"
        />
      </div>
    </MainLayout>
  );
};

export default EditClientPage; 