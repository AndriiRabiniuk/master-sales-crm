import { 
  UserRole, 
  LeadSource, 
  LeadStatus, 
  InteractionType, 
  TaskStatus 
} from '@/services/api/types';

/**
 * Safely formats a date value that might come as string, object or Date
 */
export const formatDate = (dateValue: string | Date | any): string => {
  if (!dateValue) return 'N/A';
  
  try {
    // If it's an object with _id and name (reference object)
    if (typeof dateValue === 'object' && dateValue !== null) {
      if (dateValue._id && dateValue.name) {
        return dateValue.name;
      }
      
      // If it's a Date object or has toLocaleString method
      if (dateValue instanceof Date || typeof dateValue.toLocaleString === 'function') {
        return new Date(dateValue).toLocaleString('fr-FR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
    
    // If it's a string or can be converted to Date
    return new Date(dateValue).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(dateValue) || 'N/A';
  }
};

/**
 * Safely get name from an object reference
 */
export const getNameFromRef = (ref: any, defaultValue: string = 'N/A'): string => {
  if (!ref) return defaultValue;
  
  // If it's a string (ID), return it
  if (typeof ref === 'string') return ref;
  
  // If it's an object with name property
  if (typeof ref === 'object' && ref !== null) {
    if (ref.name) return ref.name;
    if (ref.prenom && ref.name) return `${ref.prenom} ${ref.name}`;
    if (ref.titre) return ref.titre;
  }
  
  return defaultValue;
};

/**
 * Safely get ID from an object reference
 */
export const getIdFromRef = (ref: any): string => {
  if (!ref) return '';
  
  // If it's a string (ID), return it
  if (typeof ref === 'string') return ref;
  
  // If it's an object with _id property
  if (typeof ref === 'object' && ref !== null && ref._id) {
    return ref._id;
  }
  
  return '';
};

/**
 * Format user role for display
 */
export const formatUserRole = (role: UserRole | any): string => {
  if (typeof role === 'object' && role !== null) {
    if (role._id && role.name) {
      return role.name;
    }
    return 'Unknown Role';
  }
  
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return 'Super Admin';
    case UserRole.ADMIN:
      return 'Admin';
    case UserRole.MANAGER:
      return 'Manager';
    case UserRole.SALES:
      return 'Sales';
    case UserRole.SUPPORT:
      return 'Support';
    default:
      return String(role) || 'Unknown Role';
  }
};

/**
 * Get user role badge color class
 */
export const getUserRoleBadgeColor = (role: UserRole | any): string => {
  if (typeof role === 'object' && role !== null) {
    if (role._id) {
      const roleName = role.name ? role.name.toLowerCase() : '';
      
      // Match based on name keywords
      if (roleName.includes('super')) return 'bg-purple-100 text-purple-800';
      if (roleName.includes('admin')) return 'bg-red-100 text-red-800';
      if (roleName.includes('manager')) return 'bg-blue-100 text-blue-800';
      if (roleName.includes('sales')) return 'bg-green-100 text-green-800';
      if (roleName.includes('support')) return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  }
  
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return 'bg-purple-100 text-purple-800';
    case UserRole.ADMIN:
      return 'bg-red-100 text-red-800';
    case UserRole.MANAGER:
      return 'bg-blue-100 text-blue-800';
    case UserRole.SALES:
      return 'bg-green-100 text-green-800';
    case UserRole.SUPPORT:
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Format lead source for display
 */
export const formatLeadSource = (source: LeadSource | any): string => {
  if (typeof source === 'object' && source !== null) {
    if (source._id && source.name) {
      return source.name;
    }
    return 'Unknown Source';
  }
  
  switch (source) {
    case LeadSource.WEBSITE:
      return 'Website';
    case LeadSource.REFERRAL:
      return 'Referral';
    case LeadSource.EVENT:
      return 'Event';
    default:
      return String(source) || 'Unknown Source';
  }
};

/**
 * Get lead source badge color class
 */
export const getLeadSourceBadgeColor = (source: LeadSource | any): string => {
  if (typeof source === 'object' && source !== null) {
    if (source._id) {
      const sourceName = source.name ? source.name.toLowerCase() : '';
      
      if (sourceName.includes('website')) return 'bg-blue-100 text-blue-800';
      if (sourceName.includes('referral')) return 'bg-green-100 text-green-800';
      if (sourceName.includes('event')) return 'bg-purple-100 text-purple-800';
    }
    return 'bg-gray-100 text-gray-800';
  }
  
  switch (source) {
    case LeadSource.WEBSITE:
      return 'bg-blue-100 text-blue-800';
    case LeadSource.REFERRAL:
      return 'bg-green-100 text-green-800';
    case LeadSource.EVENT:
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Format lead status for display
 */
export const formatLeadStatus = (status: LeadStatus | any): string => {
  if (typeof status === 'object' && status !== null) {
    if (status._id && status.name) {
      return status.name;
    }
    return 'Unknown Status';
  }
  
  switch (status) {
    case LeadStatus.NEW:
      return 'New';
    case LeadStatus.CONTACTED:
      return 'Contacted';
    case LeadStatus.WON:
      return 'Won';
    case LeadStatus.LOST:
      return 'Lost';
    default:
      return String(status) || 'Unknown Status';
  }
};

/**
 * Get lead status badge color class
 */
export const getLeadStatusBadgeColor = (status: LeadStatus | any): string => {
  if (typeof status === 'object' && status !== null) {
    if (status._id) {
      const statusName = status.name ? status.name.toLowerCase() : '';
      
      if (statusName.includes('new')) return 'bg-blue-100 text-blue-800';
      if (statusName.includes('contacted')) return 'bg-yellow-100 text-yellow-800';
      if (statusName.includes('won')) return 'bg-green-100 text-green-800';
      if (statusName.includes('lost')) return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  }
  
  switch (status) {
    case LeadStatus.NEW:
      return 'bg-blue-100 text-blue-800';
    case LeadStatus.CONTACTED:
      return 'bg-yellow-100 text-yellow-800';
    case LeadStatus.WON:
      return 'bg-green-100 text-green-800';
    case LeadStatus.LOST:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Format interaction type for display
 */
export const formatInteractionType = (type: InteractionType | any): string => {
  if (typeof type === 'object' && type !== null) {
    if (type._id && type.name) {
      return type.name;
    }
    return 'Unknown Type';
  }
  
  switch (type) {
    case InteractionType.CALL:
      return 'Call';
    case InteractionType.EMAIL:
      return 'Email';
    case InteractionType.MEETING:
      return 'Meeting';
    default:
      return String(type) || 'Unknown Type';
  }
};

/**
 * Get interaction type badge color class
 */
export const getInteractionTypeBadgeColor = (type: InteractionType | any): string => {
  if (typeof type === 'object' && type !== null) {
    if (type._id) {
      const typeName = type.name ? type.name.toLowerCase() : '';
      
      if (typeName.includes('call')) return 'bg-blue-100 text-blue-800';
      if (typeName.includes('email')) return 'bg-purple-100 text-purple-800';
      if (typeName.includes('meeting')) return 'bg-green-100 text-green-800';
    }
    return 'bg-gray-100 text-gray-800';
  }
  
  switch (type) {
    case InteractionType.CALL:
      return 'bg-blue-100 text-blue-800';
    case InteractionType.EMAIL:
      return 'bg-purple-100 text-purple-800';
    case InteractionType.MEETING:
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Format task status for display
 */
export const formatTaskStatus = (status: TaskStatus | any): string => {
  if (typeof status === 'object' && status !== null) {
    if (status._id && status.name) {
      return status.name;
    }
    return 'Unknown Status';
  }
  
  switch (status) {
    case TaskStatus.PENDING:
      return 'Pending';
    case TaskStatus.IN_PROGRESS:
      return 'In Progress';
    case TaskStatus.COMPLETED:
      return 'Completed';
    default:
      return String(status) || 'Unknown Status';
  }
};

/**
 * Get task status badge color class
 */
export const getTaskStatusBadgeColor = (status: TaskStatus | any): string => {
  if (typeof status === 'object' && status !== null) {
    if (status._id) {
      const statusName = status.name ? status.name.toLowerCase() : '';
      
      if (statusName.includes('pending')) return 'bg-yellow-100 text-yellow-800';
      if (statusName.includes('progress')) return 'bg-blue-100 text-blue-800';
      if (statusName.includes('completed')) return 'bg-green-100 text-green-800';
    }
    return 'bg-gray-100 text-gray-800';
  }
  
  switch (status) {
    case TaskStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case TaskStatus.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800';
    case TaskStatus.COMPLETED:
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}; 