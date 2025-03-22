import React from 'react';
import { useForm } from 'react-hook-form';
import { FiSave, FiX } from 'react-icons/fi';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ICreateContactRequest, IClient } from '@/services/api/types';
import { getNameFromRef } from '@/utils/dataFormatters';

interface ContactFormProps {
  initialData?: ICreateContactRequest;
  isSubmitting: boolean;
  onSubmit: (data: ICreateContactRequest) => void;
  mode: 'add' | 'edit';
  clients?: IClient[];
}

const ContactForm: React.FC<ContactFormProps> = ({
  initialData,
  isSubmitting,
  onSubmit,
  mode,
  clients = []
}) => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<ICreateContactRequest>({
    defaultValues: initialData || {
      name: '',
      prenom: '',
      email: '',
      telephone: '',
      fonction: '',
      client_id: clients.length > 0 ? getNameFromRef(clients[0]._id) : '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Contact Information</h3>
            <p className="mt-1 text-sm text-gray-500">
              {mode === 'add' ? 'Add a new contact to the system.' : 'Edit contact information.'}
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Last name is required' })}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.name ? 'border-red-300' : ''}`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  id="prenom"
                  {...register('prenom', { required: 'First name is required' })}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.prenom ? 'border-red-300' : ''}`}
                />
                {errors.prenom && (
                  <p className="mt-2 text-sm text-red-600">{errors.prenom.message}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.email ? 'border-red-300' : ''}`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="telephone"
                  {...register('telephone')}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="fonction" className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  id="fonction"
                  {...register('fonction')}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
                  Associated Client
                </label>
                <select
                  id="client_id"
                  {...register('client_id')}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">None</option>
                  {clients.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center"
        >
          <FiX className="mr-2 h-4 w-4" /> Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="small" color="white" /> 
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            <>
              <FiSave className="mr-2 h-4 w-4" /> Save
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;