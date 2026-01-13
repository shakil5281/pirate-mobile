'use client';
import React from 'react';
import FeatureCard from '../../../card/FeatureCard';

const hajjBenefitsData = [
  {
    id: 1,
    title: "Smart Connectivity in Saudi Arabia",
    description:
      "Unlock Saudi Arabia with the smartest travel essential—hassle-free, instant connectivity at your fingertips. Our eSIM is perfect for Hajj & Business Travelers.",
    image:
      "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/Group%204152531.svg?updatedAt=1761391480172",
  },
  {
    id: 2,
    title: "Always Stay Connected",
    description:
      "No matter if you're visiting the sacred sites or traveling on local tours or exploring, closing business deals on a business trip—our eSIM keeps you connected every step of the way.",
    image:
      "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/44744.svg?updatedAt=1761391504773",
  },
  {
    id: 3,
    title: "Travel Light & Smart",
    description:
      "Forget about carrying extra SIM tools or searching for local SIM packages. Travel with confidence and focus on what matters.",
    image:
      "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/Group%20105638.svg?updatedAt=1761391521526",
  },
  {
    id: 4,
    title: "Flexible Data Plans",
    description:
      "Always choose from a range of affordable eSIM plans that fit your travel dates, budget, or usage needs. Activate and cancel plans anytime you want.",
    image:
      "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/Group%2010005639.svg?updatedAt=1761391537368",
  },
];

export default function HajjBenefitsSection() {
  return (
    <section className="py-16 md:py-20 px-4 bg-white font-[family-name:var(--font-philosopher)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Benefits of Using{' '}
            <span className="text-[#32C38C]">Our eSIM</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
            Unlock Saudi Arabia with the smartest travel essential—hassle-free, instant connectivity at your fingertips.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12">
          {hajjBenefitsData.map((benefit) => (
            <FeatureCard
              key={benefit.id}
              title={benefit.title}
              description={benefit.description}
              image={benefit.image}
              imageAlt={benefit.title}
              usePhilosopherFont={true}
              className="items-center text-center h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
