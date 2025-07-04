import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../../context/CASLContext';
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
  X,
  DoorOpen,
  Wrench
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  permission: { action: string; subject: string };
  adminOnly?: boolean;
}

const Navigation = () => {
  const location = useLocation();
  const { can, isAdmin, isAuthenticated, logout, permissions } = useRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define all possible navigation items with their required permissions
  const allNavItems: NavItem[] = useMemo(() => [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      permission: { action: 'read', subject: 'dashboard' },
      adminOnly: false
    },
    {
      path: '/rooms',
      label: 'Rooms',
      icon: DoorOpen,
      permission: { action: 'read', subject: 'room' },
      adminOnly: false
    },
    {
      path: '/guests-profile',
      label: 'Guests',
      icon: Users,
      permission: { action: 'read', subject: 'guest' },
      adminOnly: false
    },
    {
      path: '/calendar',
      label: 'Calendar',
      icon: Calendar,
      permission: { action: 'read', subject: 'reservation' },
      adminOnly: false
    },
    {
      path: '/team-members',
      label: 'Team',
      icon: Users,
      permission: { action: 'read', subject: 'user' },
      adminOnly: false
    },
    {
      path: '/maintenance',
      label: 'Maintenance',
      icon: Wrench,
      permission: { action: 'read', subject: 'maintenance' },
      adminOnly: false
    },
    {
      path: '/roles-permissions',
      label: 'Roles',
      icon: Shield,
      permission: { action: 'manage', subject: 'role' },
      adminOnly: true
    },
    {
      path: '/billing',
      label: 'Billing',
      icon: CreditCard,
      permission: { action: 'read', subject: 'billing' },
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
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Icon className="h-4 w-4" />
        {item.label}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Hotel className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">HMS</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {visibleNavItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <div className="relative ml-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {isAuthenticated ? (
                      <>
                        {isAdmin ? 'Admin' : 'User'}
                        <span className="text-xs text-gray-500">
                          ({permissions.length} permissions)
                        </span>
                      </>
                    ) : (
                      'Guest'
                    )}
                  </span>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-500"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
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

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {visibleNavItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;