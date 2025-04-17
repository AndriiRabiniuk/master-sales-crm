import React from 'react';
import { useForm } from 'react-hook-form';
import { FiSave, FiX } from 'react-icons/fi';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ClientFormData {
  name: string;
  description?: string;
  marketSegment?: string;
  SIREN: string;
  SIRET: string;
  code_postal: string;
  code_NAF: string;
  chiffre_d_affaires?: number;
  EBIT?: number;
  latitude?: number;
  longitude?: number;
  pdm?: number;
}

interface ClientFormProps {
  initialData?: ClientFormData;
  isSubmitting: boolean;
  onSubmit: (data: ClientFormData) => void;
  mode: 'add' | 'edit';
}

const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  isSubmitting,
  onSubmit,
  mode,
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    defaultValues: initialData || {
      name: '',
      description: '',
      marketSegment: '',
      SIREN: '',
      SIRET: '',
      code_postal: '',
      code_NAF: '',
      chiffre_d_affaires: undefined,
      EBIT: undefined,
      latitude: undefined,
      longitude: undefined,
      pdm: undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Client Information
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {mode === 'add' ? 'Add a new client to your CRM system.' : 'Update client information.'}
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              {/* Company Name */}
              <div className="col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Client Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Company name is required' })}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                    errors.name ? 'border-red-300' : ''
                  }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register('description')}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              {/* Market Segment */}
              <div className="col-span-6">
                <label htmlFor="marketSegment" className="block text-sm font-medium text-gray-700">
                  Market Segment
                </label>
                <input
                  type="text"
                  id="marketSegment"
                  {...register('marketSegment')}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              {/* SIREN */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="SIREN" className="block text-sm font-medium text-gray-700">
                  SIREN
                </label>
                <input
                  type="text"
                  id="SIREN"
                  {...register('SIREN', { required: 'SIREN is required' })}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                    errors.SIREN ? 'border-red-300' : ''
                  }`}
                />
                {errors.SIREN && (
                  <p className="mt-2 text-sm text-red-600">{errors.SIREN.message}</p>
                )}
              </div>

              {/* SIRET */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="SIRET" className="block text-sm font-medium text-gray-700">
                  SIRET
                </label>
                <input
                  type="text"
                  id="SIRET"
                  {...register('SIRET', { required: 'SIRET is required' })}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                    errors.SIRET ? 'border-red-300' : ''
                  }`}
                />
                {errors.SIRET && (
                  <p className="mt-2 text-sm text-red-600">{errors.SIRET.message}</p>
                )}
              </div>

              {/* Postal Code */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="code_postal" className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="code_postal"
                  {...register('code_postal', { required: 'Postal code is required' })}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                    errors.code_postal ? 'border-red-300' : ''
                  }`}
                />
                {errors.code_postal && (
                  <p className="mt-2 text-sm text-red-600">{errors.code_postal.message}</p>
                )}
              </div>

              {/* NAF Code */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="code_NAF" className="block text-sm font-medium text-gray-700">
                  NAF Code
                </label>
                <input
                  type="text"
                  id="code_NAF"
                  {...register('code_NAF', { required: 'NAF code is required' })}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                    errors.code_NAF ? 'border-red-300' : ''
                  }`}
                />
                {errors.code_NAF && (
                  <p className="mt-2 text-sm text-red-600">{errors.code_NAF.message}</p>
                )}
              </div>

              {/* Revenue */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="chiffre_d_affaires" className="block text-sm font-medium text-gray-700">
                  Revenue
                </label>
                <input
                  type="number"
                  id="chiffre_d_affaires"
                  step="0.01"
                  {...register('chiffre_d_affaires', { valueAsNumber: true })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              {/* EBIT */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="EBIT" className="block text-sm font-medium text-gray-700">
                  EBIT
                </label>
                <input
                  type="number"
                  id="EBIT"
                  step="0.01"
                  {...register('EBIT', { valueAsNumber: true })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              {/* Latitude */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  step="0.000001"
                  {...register('latitude', { valueAsNumber: true })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              {/* Longitude */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  step="0.000001"
                  {...register('longitude', { valueAsNumber: true })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              {/* Market Share */}
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="pdm" className="block text-sm font-medium text-gray-700">
                  Market Share (%)
                </label>
                <input
                  type="number"
                  id="pdm"
                  step="0.01"
                  {...register('pdm', { valueAsNumber: true })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiX className="w-5 h-5 mr-2 -ml-1 inline" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <LoadingSpinner size="medium" color="#ffffff" />
          ) : (
            <>
              <FiSave className="w-5 h-5 mr-2 -ml-1" />
              {mode === 'add' ? 'Create Client' : 'Update Client'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ClientForm; 