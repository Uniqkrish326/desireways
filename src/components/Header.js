import React from 'react';

function Header() {
  return (
    <header className="bg-blue-700 p-4 shadow-lg relative">
    <meta name="google-site-verification" content="jc1g5hw3g1nXlZI9rJ7saz4R8d7BmqKDnmfrBcbMoUo" />
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
        {/* Left Side: Logo, Title, Slogan */}
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src={`${process.env.PUBLIC_URL}/logo_nav.png`}
            alt="Desireways Logo"
            className="h-10 mr-3"
          />
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-white">Desireways</h1>
            <p className="mt-1 text-sm text-white italic">Your desires, our products.</p>
          </div>
        </div>

        {/* Right Side: Beta version info, vertically centered */}
        <div className="text-white text-sm italic">
          No signup required, beta version
        </div>
      </div>
    </header>
  );
}

export default Header;
