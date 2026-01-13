"use client"

import React, { useState } from 'react'
import { Eye, EyeOff, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { useSignUp } from '@/hooks/useSignUp'
import { useSignIn } from '@/hooks/useSignIn'
import { toast } from 'sonner'
import Link from 'next/link'

const accountSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(48, "Password is too long"),
})

const AccountCreationSection = ({ onProceed }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSignInMode, setIsSignInMode] = useState(false)
  const { signUpWithEmail, signUpWithGoogle, signUpWithApple, loading: signUpLoading, error: signUpError } = useSignUp()
  const { signInWithEmail, signInWithGoogle, signInWithApple, loading: signInLoading, error: signInError } = useSignIn()

  const loading = signUpLoading || signInLoading
  const error = signUpError || signInError

  const form = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = form

  const onSubmit = async (data) => {
    const { email, password } = data
    
    if (isSignInMode) {
      // Sign in existing user
      const result = await signInWithEmail(email, password, true)
      if (result?.success) {
        toast.success('Signed in successfully!')
        if (onProceed) onProceed({ email })
      } else {
        toast.error(result?.error || 'Failed to sign in')
      }
    } else {
      // Sign up new user
      const result = await signUpWithEmail(email, password, null, false)
      if (result?.success) {
        toast.success('Account created successfully!')
        if (onProceed) onProceed({ email })
      } else {
        // If email already in use, suggest signing in
        if (result?.error?.includes('already registered') || result?.error?.includes('already in use')) {
          toast.error(result.error, {
            action: {
              label: 'Sign In Instead',
              onClick: () => setIsSignInMode(true)
            }
          })
        } else {
          toast.error(result?.error || 'Failed to create account')
        }
      }
    }
  }

  const handleGoogle = async () => {
    const result = isSignInMode ? await signInWithGoogle() : await signUpWithGoogle()
    if (result?.success) {
      toast.success(isSignInMode ? 'Signed in successfully!' : 'Account created successfully!')
      if (onProceed) onProceed({ provider: 'google' })
    } else {
      toast.error(result?.error || 'Authentication failed')
    }
  }

  const handleApple = async () => {
    const result = isSignInMode ? await signInWithApple() : await signUpWithApple()
    if (result?.success) {
      toast.success(isSignInMode ? 'Signed in successfully!' : 'Account created successfully!')
      if (onProceed) onProceed({ provider: 'apple' })
    } else {
      toast.error(result?.error || 'Authentication failed')
    }
  }

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isSignInMode ? 'Sign In to Your Account' : 'Create Your Account'}
        </h2>
        <p className="text-sm text-gray-600">
          {isSignInMode ? 'Welcome back! Sign in to continue.' : 'Sign up to complete your purchase.'}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600 z-10">
                  Your email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contact.example@gmail.com"
                    autoComplete="email"
                    className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-400 outline-none transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Input */}
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-gray-600 z-10">
                  Enter Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      className="px-4 py-3 pr-10 border-2 border-gray-300 rounded-xl focus:border-yellow-400 outline-none transition-all"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Proceed Button */}
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-secondary hover:bg-yellow-500 text-black font-medium py-3 rounded-lg flex items-center justify-center space-x-2"
          >
            <span>
              {loading 
                ? (isSignInMode ? 'Signing in...' : 'Creating account...') 
                : (isSignInMode ? 'Sign In & Continue' : 'Create Account & Continue')
              }
            </span>
            <span>→</span>
          </Button>

          {/* Toggle Sign In / Sign Up */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignInMode(!isSignInMode)}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              {isSignInMode ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </Form>

      {/* Separator */}
      <div className="my-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or {isSignInMode ? 'sign in' : 'sign up'} with
            </span>
          </div>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={handleGoogle} disabled={loading} variant="outline" className="flex items-center justify-center space-x-2 py-3">
          <span className="text-lg font-bold">G</span>
          <span>Google</span>
        </Button>
        <Button onClick={handleApple} disabled={loading} variant="outline" className="flex items-center justify-center space-x-2 py-3">
          <Smartphone className="h-4 w-4" />
          <span>Apple</span>
        </Button>
      </div>

      {/* Additional Help */}
      {isSignInMode && (
        <p className="text-center text-sm text-gray-600 mt-4">
          Forgot your password?{' '}
          <Link href="/forgot-password" className="text-yellow-600 font-medium hover:underline">
            Reset it here
          </Link>
        </p>
      )}
    </div>
  )
}

export default AccountCreationSection

