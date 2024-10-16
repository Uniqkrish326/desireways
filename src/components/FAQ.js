import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle the answer visibility on click
  };

  const faqs = [
    {
      question: "What is Desireways and how does it help me?",
      answer:
        "Desireways is your personal guide to finding the best products that align with your needs, helping you save time and money. By showing you tailored recommendations, we help you avoid overpaying, so you can get the best value without the hassle. Imagine having all the best options, just a click away—saving you hours of research!",
    },
    {
      question: "How does Desireways help me save money?",
      answer:
        "We filter through thousands of products to find the ones that offer the best deals. Desireways doesn’t just show you random products—it curates items with the best reviews, prices, and deals from trusted retailers like Amazon, Flipkart, and Meesho. You’re not just saving money—you’re investing in smarter choices for your needs!",
    },
    {
      question: "Why should I trust the recommendations on Desireways?",
      answer:
        "Our recommendations are built on data from millions of customers and expert opinions. By trusting our platform, you benefit from a community of people who, just like you, want the best value for their money. Each recommendation is carefully selected to ensure quality, affordability, and reliability. You're part of something bigger—a smart, money-saving community.",
    },
    {
      question: "Is Desireways easy to use?",
      answer:
        "Absolutely! With a simple and intuitive interface, Desireways makes it easy to find exactly what you’re looking for in seconds. We focus on convenience, because we know your time is valuable. Whether you’re on mobile or desktop, you’ll find what you need with minimal effort, leaving you more time to enjoy the things you love.",
    },
    {
      question: "How does Desireways emotionally connect with its users?",
      answer:
        "At Desireways, we don’t just offer products—we offer solutions to your everyday needs. Whether you’re looking for something special or just browsing, we understand the importance of getting the right product at the right price. Our goal is to make you feel empowered and confident in every purchase, knowing you’re making informed decisions.",
    },
  ];

  return (
    <div className="bg-gray-900 text-white py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-6">
            <button
              className="w-full text-left text-lg font-medium text-blue-400 hover:underline focus:outline-none"
              onClick={() => toggleAnswer(index)}
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <p className="mt-3 text-gray-400">
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
