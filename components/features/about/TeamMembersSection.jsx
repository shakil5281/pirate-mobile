"use client"

import React from 'react'
import Image from 'next/image'

const teamMembers = [
  {
    name: 'Paul Skillen',
    title: 'CEO & Founder',
    image: 'https://ik.imagekit.io/odc49ttmc/public/images/about/ceo.png?updatedAt=1754489858191',
  },
  {
    name: 'Simon Minett',
    title: 'Operations Director',
    image: 'https://ik.imagekit.io/odc49ttmc/public/images/about/director.png?updatedAt=1754489859016',
  },
  {
    name: 'Sahidul Islam Jony',
    title: 'Chief Technology Officer',
    image: 'https://ik.imagekit.io/odc49ttmc/public/images/about/developer.png?updatedAt=1754489856775',
  },
  {
    name: 'Poramai',
    title: 'Social Media Manager',
    image: 'https://ik.imagekit.io/odc49ttmc/public/images/about/social-midea-manager.png?updatedAt=1754489863625',
  },
]

export default function TeamMembersSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="">Our Dedicated </span>
            <span className="text-primary">Team Member</span>
          </h2>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Profile Image */}
              <div className="w-full mb-5 sm:mb-6">
                <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-sm">
                  <div className="relative w-full aspect-[4/5] sm:aspect-[3/4]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
                      priority={index < 2}
                      quality={95}
                      className="object-cover bg-center"
                    />
                  </div>
                </div>
              </div>

              {/* Name */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 px-4">
                {member.name}
              </h3>

              {/* Title */}
              <p className="text-sm sm:text-base text-gray-600 px-6 pb-6">
                {member.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
