"use client"

import React, { useState } from 'react';
import { User, ShoppingBag, LogOut, Trash2, Smartphone, ChevronRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSignOut } from '@/hooks/useSignOut';
import { useProfile } from '@/hooks/useProfile';
import { DeleteAccountDialog } from '@/components/dashboard/DeleteAccountDialog';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import TrashIcon from '../icons/TrashIcon';
import SignOutIcon from '../icons/SignOut';
import UserIcon from '../icons/UserIcon';
import BagIcon from '../icons/BagIcon';
import SimIcon from '../icons/SimIcon';

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { logout, loading: logoutLoading } = useSignOut();
  const { deleteAccountWithPassword, getUserProvider, loading: profileLoading } = useProfile();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Get user's authentication provider
  const userProvider = getUserProvider();

  const navigationItems = [
    { href: "/dashboard", label: "My eSim", icon: SimIcon },
    { href: "/dashboard/orders", label: "My Orders", icon: BagIcon },
    { href: "/dashboard/profile", label: "My Profile", icon: UserIcon },
  ];

  const handleSignOut = async () => {
    const result = await logout();
    if (result.success) {
      toast.success('Signed out successfully');
      router.push('/login');
    } else {
      toast.error(result.error || 'Failed to sign out');
    }
  };

  const handleDeleteAccount = async (password) => {
    const result = await deleteAccountWithPassword(password);
    
    if (result.success) {
      toast.success('Account deleted successfully. Redirecting...');
      setShowDeleteDialog(false);
      
      // Clear any remaining auth data and redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
      
      return result;
    } else {
      // Return the error result to the dialog
      toast.error(result.error || 'Failed to delete account');
      return result;
    }
  };

  const openDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  return (
    <div className=" bg-white">

      {/* Desktop Layout */}
      <div className='hidden lg:block'>
        <div className="max-w-7xl mx-auto h-full bg-[#FAFAFA] rounded-4xl p-4 mb-20">
          <div className="flex h-full">
            {/* Sidebar - Fixed height */}
            <div className="w-72 bg-white overflow-hidden border-gray-200 rounded-2xl m-4">
              <div className="flex flex-col h-full">
                {/* User Profile Section */}
                <div className="p-6 bg-linear-to-t from-[#F6F8F5] to-[#FEEECC] rounded-t-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-900">
                        {user?.email?.[0]?.toUpperCase() || <User className="w-6 h-6 text-gray-600" />}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Hello.</h3>
                      <p className="text-sm font-bold text-gray-900">
                        {user?.displayName || user?.email?.split('@')[0] || 'User'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${pathname === item.href ? 'text-[#4BBB5F] bg-[#E7F6E9] border border-[#4BBB5F]' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      <span className={pathname === item.href ? 'text-[#4BBB5F]' : 'text-gray-400'}>
                        <ChevronRight />
                      </span>
                    </Link>
                  ))}
                </nav>

                {/* Action Buttons - Positioned at bottom */}
                <div className="p-4 space-y-3 border-t border-gray-200 mt-auto">
                  <button 
                    onClick={handleSignOut}
                    disabled={logoutLoading}
                    className="w-full cursor-pointer flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SignOutIcon width={20} height={20} className='text-gray-700' />
                    <span>{logoutLoading ? 'Signing out...' : 'Sign Out'}</span>
                  </button>
                  <button 
                    onClick={openDeleteDialog}
                    className="w-full flex cursor-pointer items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon width={20} height={20} className='text-red-600' />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <main className="h-full">
                <div className="p-4 sm:p-6 lg:p-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile User Profile Section */}
        <div className="bg-linear-to-r from-yellow-50 to-yellow-100 p-4 border-b border-gray-200 hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {user?.email?.[0]?.toUpperCase() || <User className="w-5 h-5 text-gray-600" />}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-900">Hello.</h3>
                <p className="text-sm font-bold text-gray-900">
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleSignOut}
                disabled={logoutLoading}
                className="flex items-center cursor-pointer space-x-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{logoutLoading ? 'Signing out...' : 'Sign Out'}</span>
              </button>
              <button 
                onClick={openDeleteDialog}
                className="flex items-center cursor-pointer space-x-1 px-3 py-2 text-xs font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
               <Image src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Svg/Delete.svg" alt="delete" width={24} height={24} />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Main Content */}
        <main className=" pb-20">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>


      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center space-y-1 px-3 py-2 transition-colors ${pathname === item.href ? 'text-green-600' : 'text-gray-400'
                }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteAccount}
        loading={profileLoading}
        userProvider={userProvider}
      />
    </div>
  );
};

export default DashboardLayout;
