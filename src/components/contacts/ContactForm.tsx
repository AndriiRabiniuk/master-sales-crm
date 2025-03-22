import React from 'react';
import { useForm } from 'react-hook-form';
import { FiSave, FiX } from 'react-icons/fi';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ContactFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  poste?: string;
  client_id?: string;
  notes?: string;
}

interface ContactFormProps {
  initialData?: ContactFormData;
  isSubmitting: boolean;
  onSubmit: (data: ContactFormData) => void;
  mode: 'add' | 'edit';
  clients?: { id: string; nom: string }[];
}

const ContactForm: React.FC<ContactFormProps> = ({
  initialData,
  isSubmitting,
  onSubmit,
  mode,
  clients = []
}) => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
    defaultValues: initialData || {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      poste: '',
      client_id: clients.length > 0 ? clients[0].id : '',
      notes: ''
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
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="nom"
                  {...register('nom', { required: 'Last name is required' })}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.nom ? 'border-red-300' : ''}`}
                />
                {errors.nom && (
                  <p className="mt-2 text-sm text-red-600">{errors.nom.message}</p>
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
                <label htmlFor="poste" className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  id="poste"
                  {...register('poste')}
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
                    <option key={client.id} value={client.id}>
                      {client.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  {...register('notes')}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                ></textarea>
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