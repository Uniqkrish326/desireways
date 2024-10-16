import React, { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch('https://formspree.io/f/mgveelwk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess(true);
        setEmail('');
      } else {
        setError('Failed to submit email. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit email. Please try again later.');
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h2>
      <p className="mb-4">Stay updated with the latest news and offers!</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-2 rounded-md mb-4 border border-gray-600 focus:outline-none focus:border-blue-500 text-black" // Set text color to black
          required
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">Thank you for subscribing!</p>}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
