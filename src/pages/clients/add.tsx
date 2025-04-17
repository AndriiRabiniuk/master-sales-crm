import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
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
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Failed to create client');
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/clients" 
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FiArrowLeft className="mr-2" /> Back to Clients
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add New Client</h1>
        </div>

        <ClientForm 
          mode="add"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </div>
    </MainLayout>
  );
};

export default AddClientPage; 