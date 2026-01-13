"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { SearchX, ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  const container = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.06 } }
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }

  return (
    <div className="relative mx-auto flex min-h-svh w-full flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute -top-24 right-[-10rem] h-72 w-72 rounded-full bg-gradient-to-br from-primary/30 to-violet-500/30 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="pointer-events-none absolute -bottom-28 left-[-10rem] h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-400/25 to-primary/25 blur-3xl"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center gap-6"
      >
        <motion.div
          variants={item}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-background/70 ring-1 ring-black/10 backdrop-blur dark:ring-white/10"
        >
          <motion.span
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: [ -10, 6, -4, 0 ], scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-primary"
          >
            <SearchX className="h-7 w-7" />
          </motion.span>
          <motion.span
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-xl"
            animate={{ opacity: [0.25, 0.6, 0.25] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.p variants={item} className="text-xs font-semibold tracking-widest text-yellow-600">404</motion.p>
        <motion.h1 variants={item} className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-balance text-3xl font-extrabold text-transparent sm:text-4xl">
          Page not found
        </motion.h1>
        <motion.p variants={item} className="text-muted-foreground text-pretty">
          The page you are looking for doesn’t exist or may have been moved.
        </motion.p>

        <motion.div variants={item} className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </motion.div>
          <motion.button
            onClick={() => history.back()}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}


