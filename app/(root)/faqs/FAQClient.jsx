'use client';

import React, { useState, useMemo } from 'react';
import { Search, HelpCircle, MessageCircle, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import faqsData from '@/data/faq/faqsData.json';

export default function FAQClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordion, setOpenAccordion] = useState('');

  // Flatten all FAQs for search
  const allFaqs = useMemo(() => {
    return faqsData.flatMap(section => 
      section.faqs.map(faq => ({
        ...faq,
        sectionTitle: section.title,
        sectionDescription: section.description
      }))
    );
  }, []);

  // Filter FAQs based on search query
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) {
      return faqsData;
    }

    const query = searchQuery.toLowerCase();
    const matchingFaqs = allFaqs.filter(faq => 
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.sectionTitle.toLowerCase().includes(query)
    );

    // Group matching FAQs by section
    const groupedFaqs = {};
    matchingFaqs.forEach(faq => {
      if (!groupedFaqs[faq.sectionTitle]) {
        groupedFaqs[faq.sectionTitle] = {
          title: faq.sectionTitle,
          description: faq.sectionDescription,
          faqs: []
        };
      }
      groupedFaqs[faq.sectionTitle].faqs.push({
        question: faq.question,
        answer: faq.answer
      });
    });

    return Object.values(groupedFaqs);
  }, [searchQuery, allFaqs]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the filteredFaqs useMemo
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#FFF6BA] to-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
              Frequently Asked <span className="text-green-600">Questions</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Find answers to common questions about eSIMs, travel connectivity, and our services
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-6 pr-20 text-lg border shadow-lg border-gray-200 rounded-full focus:border-green-500 focus:ring-0 bg-white"
              />
              <Button
                type="submit"
                className="absolute right-2 top-2 h-10 px-8 bg-secondary hover:bg-secondary-foreground text-black rounded-full font-medium"
              >
                <Search className="w-5 h-5 mr-1" />
                Search
              </Button>
            </form>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {allFaqs.length}
              </div>
              <div className="text-gray-600">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {faqsData.length}
              </div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {searchQuery && (
          <div className="mb-8 text-center">
            <p className="text-gray-600 text-lg">
              {filteredFaqs.length === 0 
                ? `No results found for "${searchQuery}"`
                : `Found ${filteredFaqs.reduce((total, section) => total + section.faqs.length, 0)} results for "${searchQuery}"`
              }
            </p>
          </div>
        )}

        {filteredFaqs.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">Try searching with different keywords or browse our categories below</p>
            <Button 
              onClick={() => setSearchQuery('')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredFaqs.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {section.description}
                  </p>
                </div>

                <Accordion 
                  type="single" 
                  collapsible 
                  className="space-y-4"
                  value={openAccordion}
                  onValueChange={setOpenAccordion}
                >
                  {section.faqs.map((faq, faqIndex) => {
                    const accordionValue = `${sectionIndex}-${faqIndex}`;
                    const isOpen = openAccordion === accordionValue;
                    
                    return (
                      <AccordionItem 
                        key={faqIndex} 
                        value={accordionValue}
                        className="border-0"
                      >
                        <div className={`rounded-2xl bg-white shadow-sm border-2 hover:shadow-md transition-all ${
                          isOpen 
                            ? 'border-[#02050A]' 
                            : 'border-gray-200'
                        }`}>
                          <AccordionTrigger className="lg:px-6 lg:py-5 px-4 py-3 no-underline hover:no-underline">
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-4 ${
                                isOpen 
                                  ? 'bg-[#35B34B] text-white' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {faqIndex + 1}
                              </div>
                              <span className="font-semibold text-base lg:text-lg text-gray-900 leading-relaxed">
                                {faq.question}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-5 lg:px-6 lg:pb-5">
                            <div className="lg:ml-12 lg:border-l-2 border-green-200 lg:pl-6">
                              <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </AccordionContent>
                        </div>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Support Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our support team is here to help you 24/7
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Button 
              className="h-14 bg-green-600 hover:bg-green-700 text-white rounded-full text-lg font-medium"
              onClick={() => window.open('https://wa.me/34655877579', '_blank')}
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Chat on WhatsApp
            </Button>
            <Button 
              variant="outline"
              className="h-14 border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-full text-lg font-medium"
              onClick={() => window.open('tel:+34655877579')}
            >
              <Phone className="w-6 h-6 mr-3" />
              Call Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

