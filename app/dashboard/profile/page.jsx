'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Camera, Save, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { getToken, getUserData } from '@/lib/utils/tokenStorage';
import { DeleteAccountDialog } from '@/components/dashboard/DeleteAccountDialog';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  emailUpdates: z.boolean().default(false),
});

const ProfilePage = () => {
  const { user, loading: authLoading, token } = useAuth();
  const { updateCompleteProfile, deleteAccountWithPassword, getUserProvider, loading: profileLoading } = useProfile();
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [localToken, setLocalToken] = useState(null);
  const [storedUserData, setStoredUserData] = useState(null);

  // Get user's authentication provider
  const userProvider = getUserProvider();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      emailUpdates: false,
    },
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.displayName || '',
        email: user.email || '',
        password: '',
        emailUpdates: false,
      });
    }

    // Get token and stored user data
    const currentToken = getToken();
    const userData = getUserData();
    
    setLocalToken(currentToken);
    setStoredUserData(userData);
  }, [user, form]);

  const onSubmit = async (data) => {
    try {
      const updates = {
        displayName: data.name || user.displayName,
        email: data.email,
      };

      // Only include password if it's not empty
      if (data.password && data.password.length >= 8) {
        updates.password = data.password;
      }

      const result = await updateCompleteProfile(updates);

      if (result.success) {
        toast.success('Profile updated successfully!');
        // Clear password field after successful update
        form.setValue('password', '');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile');
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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Information</h1>
        <p className="text-gray-600">Manage your profile and account settings</p>
      </div>


      <Card className="bg-white shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                    <AvatarImage 
                      src={user.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"} 
                      alt="Profile picture" 
                    />
                    <AvatarFallback className="bg-secondary text-gray-900 text-2xl font-bold">
                      {user.email?.[0]?.toUpperCase() || <User className="w-8 h-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-gray-200 hover:bg-gray-50 p-0"
                    onClick={() => toast.info('Photo upload coming soon')}
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
                <p className="mt-3 text-sm text-gray-600">{user.email}</p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Write your name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                          placeholder="Enter your name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Change email address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                          placeholder="Enter your email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Change password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          className="w-full h-12 pr-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Preferences Checkbox */}
              <FormField
                control={form.control}
                name="emailUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-gray-700 cursor-pointer">
                      Yes. I&apos;d love to receive exclusive offers and updates via email.
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={profileLoading}
                  className="flex-1 sm:flex-none bg-secondary hover:bg-secondary-foreground text-gray-900 font-semibold h-12 px-8 rounded-full flex items-center justify-center gap-2"
                >
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex-1 sm:flex-none border-red-300 text-red-600 hover:bg-red-50 h-12 px-8 rounded-full flex items-center justify-center gap-2 "
                >
                  Delete Account
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

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

export default ProfilePage;