'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// Zod schema for form validation
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject must be less than 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters')
})

export default function ContactForm() {
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  })

  const onSubmit = (data) => {
    console.log('Form submitted:', data)
    // Handle form submission here
    // You can add API call to submit the form data
    form.reset()
  }

  return (
    <div className="bg-white/95 border border-[#FBEBA6] rounded-[28px] shadow-[0_20px_40px_-24px_rgba(15,23,42,0.25)] p-8 sm:p-10 h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Name and Email Fields - Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-slate-900">
                    Name*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="M M Kamal"
                      className="w-full h-[56px] px-5 text-base rounded-2xl border border-[#E1E1E1] bg-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#FFE066] focus-visible:border-[#FFE066] transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm pt-1" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-slate-900">
                    Email*
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contact.uixmk@gmail.com"
                      className="w-full h-[56px] px-5 text-base rounded-2xl border border-[#E1E1E1] bg-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#FFE066] focus-visible:border-[#FFE066] transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm pt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Subject Field - Full Width */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-slate-900">
                  Enter Subject*
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Subject"
                    className="w-full h-[56px] px-5 text-base rounded-2xl border border-[#E1E1E1] bg-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#FFE066] focus-visible:border-[#FFE066] transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm pt-1" />
              </FormItem>
            )}
          />

          {/* Message Field - Full Width */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-slate-900">
                  Write message*
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your Message"
                    rows={6}
                    className="w-full min-h-[180px] px-5 py-5 text-base rounded-2xl border border-[#E1E1E1] bg-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#FFE066] focus-visible:border-[#FFE066] transition-all resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm pt-1" />
              </FormItem>
            )}
          />

          {/* Submit Button - Full Width */}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full h-[60px] rounded-full bg-[#FFE066] hover:bg-[#FFD633] text-gray-900 font-semibold text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
