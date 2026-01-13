'use client';
import React from 'react';
import FeatureCard from '../../../card/FeatureCard';

const hajjOffersData = {
  title: "Special Hajj / Umrah Offers",
  subtitle: "Choose Our Saudi Arabia eSIM for Your Hajj & Umrah",
  features: [
    {
      id: 1,
      title: "Instant Activation",
      description: "No waiting in lines or hunting for SIM stores. Get connected within 3 minutes of landing. We provide premium Saudi Arabia eSIM service without any hassle, so you can focus on what truly matters during your spiritual journey.",
      image: "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/Group%201175263316.svg?updatedAt=1761391360395",
      imageAlt: "Instant Activation illustration"
    },
    {
      id: 2,
      title: "No Physical SIM Card Needed",
      description: "Forget about your physical SIM card! Activate your perfect eSIM plan instantly – just scan the QR code from anywhere in Saudi Arabia! You are on the verge of exploring the world's best eSIM services.",
      image: "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/Group%201175253695317.svg?updatedAt=1761391378389",
      imageAlt: "No Physical SIM Card illustration"
    },
    {
      id: 3,
      title: "Enjoy High-Speed 4G/5G Coverage",
      description: "Our powerful 4G/5G network keeps you online everywhere – from the Haram to your hotel – without slowdowns! There is no need to deal with weak networks. Pure relaxation and holy moments are uninterrupted.",
      image: "https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Hajj/Group%2012525275318.svg?updatedAt=1761391395580",
      imageAlt: "High-Speed 4G/5G Coverage illustration"
    }
  ]
};

export default function HajjOffersSection() {
  const data = hajjOffersData;

  return (
    <section className="py-16 px-4 bg-[#F0F8F0] font-[family-name:var(--font-philosopher)]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-[family-name:var(--font-philosopher)]">
            {data.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 font-[family-name:var(--font-philosopher)]">
            {data.subtitle}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {data.features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              imageAlt={feature.imageAlt}
              usePhilosopherFont={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
