import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Desireways and how does it help me?",
      answer:
        "Desireways is your personal guide to finding the best products that align with your needs, helping you save time and money. By showing you tailored recommendations, we help you avoid overpaying, so you can get the best value without the hassle.",
    },
    {
      question: "How does Desireways help me save money?",
      answer:
        "We filter through thousands of products to find the ones that offer the best deals. Desireways curates items with the best reviews, prices, and deals from trusted retailers, saving you money and helping you make smarter choices.",
    },
    {
      question: "Why should I trust the recommendations on Desireways?",
      answer:
        "Our recommendations are built on data from millions of customers and expert opinions. Each recommendation is carefully selected to ensure quality, affordability, and reliability.",
    },
    {
      question: "Is Desireways easy to use?",
      answer:
        "Absolutely! With a simple and intuitive interface, Desireways makes it easy to find exactly what you’re looking for in seconds. Whether you’re on mobile or desktop, it’s designed for convenience.",
    },
    {
      question: "How does Desireways emotionally connect with its users?",
      answer:
        "We offer solutions to your everyday needs, not just products. Our goal is to empower you to make confident, informed decisions that make your life easier.",
    },
  ];

  return (
    <div className="bg-gray-800 text-gray-200 py-7 px-4 sm:py-12 sm:px-6">
      <h2 className="text-3xl font-bold text-center mb-5 sm:text-2xl text-white">Frequently Asked Questions</h2>
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-700 pb-2 sm:pb-8">
            <button
              className="flex justify-between items-center w-full text-sm text-left text-lg sm:text-lg font-medium text-blue-300 hover:text-blue-400 focus:outline-none transition-colors duration-200 py-2"
              onClick={() => toggleAnswer(index)}
            >
              <span>{faq.question}</span>
              <span className="text-xl">
                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-gray-400 text-sm sm:text-base transition-opacity duration-300">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
