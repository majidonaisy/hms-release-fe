// src/atomic/Organisms/Navigation.tsx
import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import {
  Home,
  BarChart3,
  Hotel,
  Users,
  Calendar,
  CreditCard,
  Shield,
  User,
  ChevronDown,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { ACTIONS } from '@/lib/ability/actions';
import { SUBJECTS } from '@/lib/ability/subjects';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: {
    action: string;
    subject: string;
  };
  adminOnly?: boolean;
}

const Navigation = () => {
  const location = useLocation();
  const { currentRole, setRole, can, isAdmin, isGuest, logout } = usePermissions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define all possible navigation items with their required permissions
  const allNavItems: NavItem[] = useMemo(() => [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      permission: { action: ACTIONS.READ, subject: SUBJECTS.DASHBOARD }
    },
    {
      path: '/Dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      permission: { action: ACTIONS.READ, subject: SUBJECTS.DASHBOARD }
    },
    {
      path: '/Rooms',
      label: 'Rooms',
      icon: Hotel,
      permission: { action: ACTIONS.READ, subject: SUBJECTS.ROOM }
    },
    {
      path: '/Guests',
      label: 'Guests',
      icon: Users,
      permission: { action: ACTIONS.READ, subject: SUBJECTS.GUEST }
    },
    {
      path: '/Reservations',
      label: 'Reservations',
      icon: Calendar,
      permission: { action: ACTIONS.READ, subject: SUBJECTS.RESERVATION }
    },
    {
      path: '/Billing',
      label: 'Billing',
      icon: CreditCard,
      permission: { action: ACTIONS.READ, subject: SUBJECTS.BILLING }
    },
    {
      path: '/caslTest',
      label: 'CASL Test',
      icon: Shield,
      permission: { action: ACTIONS.READ, subject: SUBJECTS.DASHBOARD },
      adminOnly: false
    },
  ], []);

  // Filter nav items based on user permissions
  const visibleNavItems = useMemo(() =>
    allNavItems.filter(item => {
      const hasPermission = can(item.permission.action, item.permission.subject);

      if (item.adminOnly && !isAdmin) {
        return false;
      }

      return hasPermission;
    }), [allNavItems, can, isAdmin]
  );

  // Role options for the dropdown
  const roleOptions = [
    { value: 'admin' as const, label: 'Admin', color: 'text-red-600', bgColor: 'bg-red-50' },
    { value: 'manager' as const, label: 'Manager', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { value: 'receptionist' as const, label: 'Receptionist', color: 'text-green-600', bgColor: 'bg-green-50' },
    { value: 'guest' as const, label: 'Guest', color: 'text-gray-600', bgColor: 'bg-gray-50' },
  ];

  const currentRoleData = roleOptions.find(role => role.value === currentRole);

  const handleRoleChange = (newRole: typeof roleOptions[number]['value']) => {
    setRole(newRole);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <Link
        to={item.path}
        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${isActive
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Icon className="h-4 w-4" />
        {item.label}
        {/* Show permission indicator for testing */}
        {item.path === '/caslTest' && (
          <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {visibleNavItems.length}
          </span>
        )}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">


          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {visibleNavItems.map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <button
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border transition-colors ${currentRoleData ? `${currentRoleData.color} ${currentRoleData.bgColor} border-current` : 'text-gray-600 bg-gray-50'
                  }`}
              >
                <User className="h-4 w-4" />
                {currentRoleData?.label || 'Unknown'}
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Role Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                    Switch Role ({visibleNavItems.length} items visible)
                  </div>
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => handleRoleChange(role.value)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors ${currentRole === role.value
                        ? `${role.bgColor} ${role.color}`
                        : 'text-gray-700'
                        }`}
                    >
                      <User className="h-4 w-4" />
                      {role.label}
                      {currentRole === role.value && (
                        <span className="ml-auto text-current">✓</span>
                      )}
                    </button>
                  ))}
                  <div className="border-t mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout (Guest Mode)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>



      </div>


    </nav>
  );
};

export default Navigation;