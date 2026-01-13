"use client"

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
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "motion/react"
import Image from "next/image"
import { useForgotPassword } from "@/hooks/useForgotPassword"
import { toast } from "sonner"
import Link from "next/link"

const ForgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
})

export function ForgotPasswordForm({
  className,
  ...props
}) {
  const { sendResetEmail, loading: authLoading, success } = useForgotPassword()
  
  const form = useForm({
    defaultValues: { email: "" },
    mode: "onTouched",
  })

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
    const fieldSchema = ForgotSchema.pick({ [name]: true })
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
    const parsed = ForgotSchema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const key = issue.path?.[0]
        if (typeof key === "string") {
          setError(key, { type: "zod", message: issue.message })
        }
      })
      return
    }

    // Send reset email
    const result = await sendResetEmail(values.email)
    
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.error)
      if (result.error.includes("email")) {
        setError("email", { type: "manual", message: result.error })
      }
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
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground text-sm">Enter your email and we’ll send you instructions to reset your password.</p>
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
          <Button
            type="submit"
            aria-busy={isSubmitting || authLoading}
            disabled={isSubmitting || authLoading || success}
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
            {(isSubmitting || authLoading) ? "Sending..." : success ? "Email Sent ✓" : (
              <span className="inline-flex items-center gap-2">Send Reset Link <span aria-hidden>→</span></span>
            )}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Remembered your password? <Link href="/login" className="text-green-600 underline underline-offset-4">Back to Sign in</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}


