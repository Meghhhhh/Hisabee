import React from "react";

const Support = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto pb-12 px-4 sm:px-6 md:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 mt-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 text-transparent bg-clip-text">SUPPORT</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            We're here to help you. Find answers, ask questions, or contact our team directly.
          </p>
        </div>

        {/* Contact Form */}
        <div className="backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm mb-1 text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-white/15 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400/40 focus:border-green-400/40 focus:outline-none transition"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm mb-1 text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-white/15 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400/40 focus:border-green-400/40 focus:outline-none transition"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm mb-1 text-gray-300">
                Your Message
              </label>
              <textarea
                id="message"
                rows="4"
                className="w-full px-4 py-3 border border-white/15 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400/40 focus:border-green-400/40 focus:outline-none transition"
                placeholder="Type your message..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-7 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-md text-base flex items-center gap-2"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="backdrop-blur-sm bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {/* Question 1 */}
            <div className="bg-white/10 rounded-xl p-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer">
                  <span className="font-medium text-gray-100">
                    What is your refund policy?
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="text-gray-400 mt-2 pl-2">
                  We offer a 30-day money-back guarantee. If you're not satisfied, contact support and we'll issue a full refund.
                </p>
              </details>
            </div>
            {/* Question 2 */}
            <div className="bg-white/10 rounded-xl p-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer">
                  <span className="font-medium text-gray-100">
                    How do I reset my password?
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="text-gray-400 mt-2 pl-2">
                  Go to the login page and click on "Forgot Password". Enter your email and follow the instructions sent to you.
                </p>
              </details>
            </div>
            {/* Question 3 */}
            <div className="bg-white/10 rounded-xl p-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer">
                  <span className="font-medium text-gray-100">
                    How can I update my account information?
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="text-gray-400 mt-2 pl-2">
                  Log in to your account and navigate to Settings. There, you can update your email, password, and profile.
                </p>
              </details>
            </div>
            {/* Question 4 */}
            <div className="bg-white/10 rounded-xl p-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer">
                  <span className="font-medium text-gray-100">
                    How do I contact support outside business hours?
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="text-gray-400 mt-2 pl-2">
                  Please fill out the form above and we'll get back to you as soon as possible. Typical response time is 24 hours.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;