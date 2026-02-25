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
    <div className="mb-8 p-1">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
          {isSignInMode ? 'Sign In to Your' : 'Create Your'} Account
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-base font-semibold text-gray-900">
                  Your email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contact.uixmk@gmail.com"
                    autoComplete="email"
                    className="h-[52px] px-4 border border-gray-200 rounded-xl focus:border-[#FFF654] bg-[#F9F9F9]/30 outline-none text-sm transition-all placeholder:text-gray-400"
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
              <FormItem className="space-y-2">
                <FormLabel className="text-base font-semibold text-gray-900">
                  Enter Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="****************"
                      className="h-[52px] px-4 pr-12 border border-gray-200 rounded-xl focus:border-[#FFF654] bg-[#F9F9F9]/30 outline-none text-sm transition-all placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-6 w-6 text-gray-400" />
                    ) : (
                      <Eye className="h-6 w-6 text-gray-400" />
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
            className="w-full h-[54px] bg-[#FFF654] hover:bg-[#ffe539] text-gray-900 font-bold text-base rounded-[27px] border-none shadow-none flex items-center justify-center gap-2 transition-colors"
          >
            <span>
              {loading
                ? (isSignInMode ? 'Processing...' : 'Processing...')
                : 'Proceed to Checkout'
              }
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Button>

          {/* Separator */}
          <div className="text-center py-2">
            <span className="text-gray-500 text-sm">
              Or {isSignInMode ? 'Sign In' : 'Sign Up'} using your Google / Apple account
            </span>
          </div>
        </form>
      </Form>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-1">
        <Button
          onClick={handleGoogle}
          disabled={loading}
          variant="outline"
          className="h-[52px] rounded-[26px] border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-none"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-gray-900 font-bold text-sm">Google</span>
        </Button>
        <Button
          onClick={handleApple}
          disabled={loading}
          variant="outline"
          className="h-[52px] rounded-[26px] border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-none"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.96.95-2.04 1.93-3.08 1.93s-1.38-.63-2.6-.63-1.6.61-2.59.61-2.03-1.01-3.14-2.6c-2.28-3.23-2.63-7.53-1.12-9.87 1.07-1.65 2.81-2.63 4.41-2.63 1.25 0 2.22.82 3.01.82.76 0 2.05-.98 3.51-.83 1.54.07 2.69.64 3.4 1.63-3.11 1.83-2.61 5.91.54 7.2-.67 1.69-1.38 3.36-2.34 4.37zM14.05 4.39c.65-.81 1.1-1.94.97-3.06-1.01.04-2.23.68-2.95 1.52-.64.75-1.19 1.91-1.04 3 1.12.08 2.27-.61 3.02-1.46z" />
          </svg>
          <span className="text-gray-900 font-bold text-sm">Apple</span>
        </Button>
      </div>

      {/* Footer Toggle */}
      <div className="text-center mt-8">
        <p className="text-[#333] text-base font-medium">
          {isSignInMode ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignInMode(!isSignInMode)}
            className="text-[#35B34B] font-bold hover:underline"
          >
            {isSignInMode ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>


    </div>
  )
}

export default AccountCreationSection

