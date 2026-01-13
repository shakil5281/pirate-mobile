'use client';
import React from 'react';
import FeatureCard from '../../../card/FeatureCard';

const hajjHowItWorksData = [
  {
    image: 'https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/Group%2011725236319%201.svg?updatedAt=1761391414719',
    title: "Check Your Phone's eSIM Compatibility",
    description:
      "Not all phones support eSIM, but we've made it easy! Check compatibility in seconds. Our eSIM magic works seamlessly with your compatible device, ensuring a smooth, hassle-free connectivity in Saudi Arabia."
  },
  {
    image: 'https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/Frame%2026082548689.svg?updatedAt=1761391434305',
    title: 'Choose Your Desired eSIM Plan',
    description:
      "Choose from our wide range of prepaid eSIM plans that best match your Hajj needs and budget. Our flexible eSIM plans ensure uninterrupted connectivity at affordable prices."
  },
  {
    image: 'https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/Frame%20260878458708.svg?updatedAt=1761391453375',
    title: 'Scan the QR Code Sent via Email',
    description:
      "We sent the QR code via the last step of eSIM activation. Scan the code on your phone as instructed. We offer clear steps in Saudi Arabia connectivity—no fuss, just fast and reliable service."
  }
];

export default function HajjHowItWorksSection() {
  return (
    <section className="py-16 md:py-20 px-4 bg-white font-[family-name:var(--font-philosopher)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            How Does{' '}
            <span className="text-[#32C38C]">Our eSIM</span>{' '}
            Work?
          </h2>
        </div>
        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {hajjHowItWorksData.map((step, idx) => (
            <FeatureCard
              key={idx}
              image={step.image}
              title={step.title}
              description={step.description}
              imageAlt={step.title}
              usePhilosopherFont={true}
              className="items-center text-center h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
