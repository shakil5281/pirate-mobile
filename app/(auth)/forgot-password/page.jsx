"use client";

import { ForgotPasswordForm } from "@/components/form/forgot-password-form"
import Image from "next/image";
import TextSlider from "@/components/shared/TextSlider";
import Link from "next/link";
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";

export default function ForgotPasswordPage() {
  return (
    <RedirectIfAuthenticated>
      <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6">
        <div className='flex max-w-md mx-auto w-full'>
          <Link href="/">
            <Image
              src="https://ik.imagekit.io/odc49ttmc/public/logo/main_logo.png?updatedAt=1754489823979"
              alt="Pirate"
              width={500}
              height={500}
              className="size-20"
              priority
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <ForgotPasswordForm />
          </div>
        </div>
        <p className="text-gray-500 mt-6 text-center text-xs md:text-left">
          Copyright © 2025 Pirate Mobile Limited. All right reserved
        </p>
      </div>
      <div className="relative hidden lg:block">
        <div
          className="absolute inset-0 z-0 flex flex-col justify-center items-center"
          style={{
            background: 'linear-gradient(-25deg, #FED975  0%, #ffffff 50%, #E5EFF7 100%)'
          }}
        >
          <div className="relative z-10 flex flex-col items-center text-center px-8">
            <Image
              src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/login/world-tourism-day-3d-rendering-background%201.png?updatedAt=1760023790393"
              alt="Pirate"
              className="mb-6"
              width={500}
              height={400}
              priority
            />
            <TextSlider />
          </div>
        </div>
      </div>
    </div>
    </RedirectIfAuthenticated>
  );
}


