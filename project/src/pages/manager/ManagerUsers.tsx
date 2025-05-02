import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { 
  Search, UserPlus, Edit, Trash, User, Phone, UserCheck, UserX 
} from 'lucide-react';
import { userAtom } from '../../store/auth';
import { UserRole } from '../../types';

// Define User interface locally to avoid conflict
interface User {
  id: string;
  name: string;
  role: UserRole;
  phoneNumber: string;
}

// Mock users for the demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmed Passenger',
    role: 'passenger',
    phoneNumber: '01012345678',
  },
  {
    id: '2',
    name: 'Mohammed Driver',
    role: 'driver',
    phoneNumber: '01123456789',
  },
  {
    id: '3',
    name: 'Admin Manager',
    role: 'manager',
    phoneNumber: '01234567890',
  },
  {
    id: '4',
    name: 'Sara Ahmed',
    role: 'passenger',
    phoneNumber: '01234578901',
  },
  {
    id: '5',
    name: 'Mahmoud Ibrahim',
    role: 'driver',
    phoneNumber: '01122334455',
  },
];

const ManagerUsers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentUser] = useAtom(userAtom);
  const [users] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  
  // Ensure user exists and is a manager
  if (!currentUser || currentUser.role !== 'manager') {
    navigate('/login');
    return null;
  }
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    let filtered = [...users];
    
    // Apply role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }
    
    // Apply search filter
    if (term) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(
        user => 
          user.name.toLowerCase().includes(lowerTerm) ||
          user.phoneNumber?.toLowerCase().includes(lowerTerm)
      );
    }
    
    setFilteredUsers(filtered);
  };
  
  const handleRoleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole | 'all';
    setFilterRole(role);
    
    let filtered = [...users];
    
    // Apply role filter
    if (role !== 'all') {
      filtered = filtered.filter(user => user.role === role);
    }
    
    // Apply search filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        user => 
          user.name.toLowerCase().includes(lowerTerm) ||
          user.phoneNumber?.toLowerCase().includes(lowerTerm)
      );
    }
    
    setFilteredUsers(filtered);
  };
  
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditingUser(true);
  };
  
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeletingUser(true);
  };
  
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'passenger':
        return 'bg-blue-100 text-blue-800';
      case 'driver':
        return 'bg-green-100 text-green-800';
      case 'manager':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">
          {t('navigation.users')}
        </h1>
        
        <button
          onClick={() => setIsAddingUser(true)}
          className="btn btn-primary"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          {t('manager.addUser')}
        </button>
      </div>
      
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative flex-1 md:max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input w-full pl-10"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div>
            <select
              className="select"
              value={filterRole}
              onChange={handleRoleFilter}
            >
              <option value="all">{t('common.all')}</option>
              <option value="passenger">{t('auth.passenger')}</option>
              <option value="driver">{t('auth.driver')}</option>
              <option value="manager">{t('auth.manager')}</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t('auth.name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t('auth.role')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t('auth.phoneNumber')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {t(`auth.${user.role}`)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-gray-400" />
                    {user.phoneNumber}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="mr-3 text-primary-600 hover:text-primary-900"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="text-error-600 hover:text-error-900"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add user modal - Would be implemented in a real app */}
      {isAddingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold">{t('manager.addUser')}</h2>
            <p className="mb-4 text-gray-600">Form would go here in a real application</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAddingUser(false)}
                className="btn btn-outline"
              >
                {t('common.cancel')}
              </button>
              <button className="btn btn-primary">
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit user modal - Would be implemented in a real app */}
      {isEditingUser && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold">{t('manager.editUser')}</h2>
            <p className="mb-4 text-gray-600">Editing {selectedUser.name}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditingUser(false)}
                className="btn btn-outline"
              >
                {t('common.cancel')}
              </button>
              <button 
                onClick={() => setIsEditingUser(false)}
                className="btn btn-primary"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete user modal - Would be implemented in a real app */}
      {isDeletingUser && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold">{t('manager.deleteUser')}</h2>
            <p className="mb-4 text-gray-600">
              {t('manager.confirmDeleteUser')} <b>{selectedUser.name}</b>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeletingUser(false)}
                className="btn btn-outline"
              >
                {t('common.cancel')}
              </button>
              <button 
                onClick={() => setIsDeletingUser(false)}
                className="btn btn-error"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerUsers;