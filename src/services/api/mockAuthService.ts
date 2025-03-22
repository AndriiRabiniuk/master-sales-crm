// This file provides mock authentication services for development
// Will be replaced with actual API calls in production

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

// A fixed mock user to facilitate development
const MOCK_USER: User = {
  id: '1',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Mock user for testing regular user permissions
const MOCK_REGULAR_USER: User = {
  id: '2',
  email: 'user@example.com',
  firstName: 'Regular',
  lastName: 'User',
  role: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const mockAuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`Mock login attempt for email: ${email}`);

    // Check credentials (in a real app this would verify against a database)
    if (email === 'admin@example.com' && password === 'password') {
      console.log('Mock login successful: admin user');
      return {
        token: 'mock-jwt-token-for-admin-very-secure',
        user: MOCK_USER
      };
    } else if (email === 'user@example.com' && password === 'password') {
      console.log('Mock login successful: regular user');
      return {
        token: 'mock-jwt-token-for-regular-user-very-secure',
        user: MOCK_REGULAR_USER
      };
    } else {
      console.log('Mock login failed: invalid credentials');
      throw new Error('Invalid email or password');
    }
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Mock register attempt', userData);
    
    // In a real app, this would create a new user in the database
    // For now, just return a mock success
    return {
      id: '3',
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  getUserProfile: async (token: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log(`Mock getUserProfile with token: ${token}`);
    
    // Validate the token
    if (token === 'mock-jwt-token-for-admin-very-secure') {
      console.log('Mock token validation successful: admin user');
      return MOCK_USER;
    } else if (token === 'mock-jwt-token-for-regular-user-very-secure') {
      console.log('Mock token validation successful: regular user');
      return MOCK_REGULAR_USER;
    } else {
      console.log('Mock token validation failed');
      throw new Error('Invalid token');
    }
  },

  updateProfile: async (userId: string, profileData: Partial<Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>>): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log(`Mock updateProfile for user: ${userId}`, profileData);
    
    // In a real app, this would update the user in the database
    // For now, just return a mock success with updated fields
    if (userId === '1') {
      const updatedUser = {
        ...MOCK_USER,
        ...profileData,
        updatedAt: new Date().toISOString()
      };
      console.log('Mock profile update successful for admin user');
      return updatedUser;
    } else if (userId === '2') {
      const updatedUser = {
        ...MOCK_REGULAR_USER,
        ...profileData,
        updatedAt: new Date().toISOString()
      };
      console.log('Mock profile update successful for regular user');
      return updatedUser;
    } else {
      console.log('Mock profile update failed: user not found');
      throw new Error('User not found');
    }
  },

  changePassword: async (userId: string, oldPassword: string, newPassword: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log(`Mock changePassword for user: ${userId}`);
    
    // Validate old password (in a real app this would check against stored password)
    if (oldPassword !== 'password') {
      console.log('Mock password change failed: incorrect old password');
      throw new Error('Incorrect old password');
    }
    
    // In a real app, this would update the password in the database
    console.log('Mock password change successful');
    return true;
  }
};

export default mockAuthService; 