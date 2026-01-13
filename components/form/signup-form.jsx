"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "motion/react"
import Link from "next/link"
import Image from "next/image"
import { useSignUp } from "@/hooks/useSignUp"
import { toast } from "sonner"
import ArrowRightIcon from "../icons/ArrowRightIcon"

const SignupSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function SignupForm({
  className,
  ...props
}) {
  const router = useRouter()
  const { signUpWithEmail, signUpWithGoogle, signUpWithApple, loading: authLoading } = useSignUp()
  
  const form = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  })

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    getValues,
  } = form

  function validateField(name) {
    const value = getValues(name)
    const fieldSchema = SignupSchema.pick({ [name]: true })
    const result = fieldSchema.safeParse({ [name]: value })
    if (!result.success) {
      const message = result.error.issues[0]?.message
      setError(name, { type: "zod", message })
      return false
    }
    clearErrors(name)
    return true
  }

  async function onSubmitValidated(values) {
    const parsed = SignupSchema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const key = issue.path?.[0]
        if (typeof key === "string") {
          setError(key, { type: "zod", message: issue.message })
        }
      })
      return
    }

    // Sign up with Firebase
    const result = await signUpWithEmail(values.email, values.password)
    
    if (result.success) {
      toast.success(result.message || "Account created successfully!")
      router.push("/dashboard")
    } else {
      toast.error(result.error)
      // Set form error if it's a field-specific error
      if (result.error.includes("email")) {
        setError("email", { type: "manual", message: result.error })
      } else if (result.error.includes("password")) {
        setError("password", { type: "manual", message: result.error })
      }
    }
  }

  async function handleGoogleSignUp() {
    const result = await signUpWithGoogle()
    if (result.success) {
      toast.success(result.message || "Account created successfully!")
      router.push("/dashboard")
    } else {
      toast.error(result.error)
    }
  }

  async function handleAppleSignUp() {
    const result = await signUpWithApple()
    if (result.success) {
      toast.success(result.message || "Account created successfully!")
      router.push("/dashboard")
    } else {
      toast.error(result.error)
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmitValidated)}
      className={cn("flex flex-col gap-6", className)}
      {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
          <h1 className="text-2xl font-bold">Create Your Account</h1>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Your email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="contact.uximk@gmail.com"
            aria-invalid={!!errors.email}
            className="h-12 rounded-full px-4 text-sm"
            {...register("email", { onBlur: () => validateField("email") })}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field>
          <div className="flex items-center gap-3">
            <FieldLabel htmlFor="password">Enter Password</FieldLabel>
          </div>
          <InputGroup className="h-12 rounded-full pr-1">
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              className="h-12 rounded-full px-4 text-sm"
              {...register("password", { onBlur: () => validateField("password") })}
            />
            <InputGroupButton
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((v) => !v)}
              size="icon-sm"
              className="rounded-full bg-muted text-foreground/60 hover:bg-muted/80 mr-0.5">
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4" aria-hidden>
                  <path fill="currentColor" d="M3 3.7 20.3 21l-1.3 1.3-3.1-3.1A11.6 11.6 0 0 1 12 20C5.6 20 2 14 2 14s1.1-2 3.2-4.1l-3-3.1L3 3.7Zm6 6 2 2a2.5 2.5 0 0 0-2-2Zm3 7.6c3.8 0 6.6-2.6 8-4.3-.5-.7-1.2-1.6-2.2-2.5l-2.1-2.1C18.9 9 20 10.7 20 10.7S16.4 16 10 16c-.3 0-.6 0-.9-.1l1.9 1.9c.3 0 .6 0 1 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4" aria-hidden>
                  <path fill="currentColor" d="M12 6c6.4 0 10 6 10 6s-3.6 6-10 6S2 12 2 12s3.6-6 10-6Zm0 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                </svg>
              )}
            </InputGroupButton>
          </InputGroup>
          <FieldError>{errors.password?.message}</FieldError>
        </Field>

        <Field>
          <Button
            type="submit"
            aria-busy={isSubmitting || authLoading}
            disabled={isSubmitting || authLoading}
            className="h-12 rounded-full bg-secondary hover:bg-secondary-foreground text-black">
            {(isSubmitting || authLoading) && (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" className="opacity-30" />
                <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              </motion.svg>
            )}
            {(isSubmitting || authLoading) ? "Sign Up..." : (
              <span className="inline-flex items-center gap-2">Sign Up
               <span aria-hidden>
               <ArrowRightIcon size={30} />
               </span></span>
            )}
          </Button>
        </Field>

        <div className="-my-1">
          <div className="h-px bg-muted"></div>
        </div>
        <p className="text-muted-foreground text-xs">Or sign up using your Google / Apple account</p>
        <Field className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            type="button" 
            className="h-11 rounded-full"
            onClick={handleGoogleSignUp}
            disabled={authLoading || isSubmitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4" aria-hidden>
              <path fill="#EA4335" d="M12 10.2v3.7h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.7-2.6-5.7-5.8S8.9 6 12 6c1.8 0 3 0.8 3.7 1.5l2.5-2.4C16.9 3.8 14.7 3 12 3 6.9 3 2.8 7.1 2.8 12.2S6.9 21.5 12 21.5c5.8 0 9.6-4.1 9.6-9.9 0-.7-.1-1.2-.2-1.7H12z" />
            </svg>
            Google
          </Button>
          <Button 
            variant="outline" 
            type="button" 
            className="h-11 rounded-full"
            onClick={handleAppleSignUp}
            disabled={authLoading || isSubmitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4" aria-hidden>
              <path fill="currentColor" d="M16.365 13.44c.015 3.27 2.86 4.36 2.875 4.37-.024.078-.45 1.54-1.49 3.05-.9 1.31-1.84 2.62-3.31 2.65-1.44.025-1.9-.855-3.54-.855-1.63 0-2.15.83-3.5.88-1.4.05-2.47-1.41-3.38-2.72-1.84-2.67-3.25-7.55-1.36-10.85.94-1.64 2.62-2.68 4.45-2.72 1.39-.03 2.7.93 3.54.93.84 0 2.43-1.15 4.11-.98.7.03 2.67.28 3.93 2.11-.1.07-2.34 1.36-2.32 4.14zM14.28 4.62C15.05 3.68 15.56 2.38 15.43 1c-1.06.04-2.36.71-3.13 1.65-.69.79-1.29 2.1-1.13 3.37 1.2.09 2.43-.61 3.11-1.4z" />
            </svg>
            Apple
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Already have an account? <Link href="/login" className="text-green-600 underline underline-offset-4">Sign in</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}


