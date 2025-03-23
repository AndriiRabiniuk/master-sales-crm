import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import MainLayout from '@/components/layout/MainLayout';
import ContactForm from '@/components/contacts/ContactForm';
import { contactService, clientService } from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { IClient, IContact, ICreateContactRequest } from '@/services/api/types';

const EditContactPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [contact, setContact] = useState<IContact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<IClient[]>([]);

  useEffect(() => {
    if (id) {
      Promise.all([
        fetchContact(),
        fetchClients()
      ]);
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

  const fetchClients = async () => {
    try {
      const response = await clientService.getAll(1, 100); // Get a large number of clients for the dropdown
      setClients(response.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
      setClients([]);
    }
  };

  const handleSubmit = async (data: ICreateContactRequest) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await contactService.update(id as string, data);
      toast.success('Contact updated successfully');
      router.push('/contacts');
    } catch (error: any) {
      console.error('Error updating contact:', error);
      toast.error(error.response?.data?.message || 'Failed to update contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert contact data to form data format
  const mapContactToFormData = (): ICreateContactRequest | undefined => {
    if (!contact) return undefined;

    return {
      name: contact.name || '',
      prenom: contact.prenom || '',
      email: contact.email || '',
      telephone: contact.telephone || '',
      fonction: contact.fonction || '',
      client_id: typeof contact.client_id === 'object' ? contact.client_id._id : contact.client_id || '',
    };
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
          Edit Contact: {contact.prenom} {contact.name}
        </h2>
      </div>

      <div className="mt-6">
        <ContactForm
          initialData={mapContactToFormData()}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          mode="edit"
          clients={clients}
        />
      </div>
    </MainLayout>
  );
};

export default EditContactPage; 