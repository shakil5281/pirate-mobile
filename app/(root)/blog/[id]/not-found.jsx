'use client'

import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="relative mx-auto flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center gap-6">
        <p className="text-2xl font-semibold tracking-widest text-yellow-600">404</p>
        <h1 className="text-balance text-3xl font-extrabold sm:text-4xl text-neutral-900">
          Blog Post Not Found
        </h1>
        <p className="text-neutral-600 text-pretty">
          The blog post you are looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md  px-4 py-2 text-sm font-medium bg-primary text-white hover:shadow-lg duration-150 shadow-sm transition-colors"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  )
}