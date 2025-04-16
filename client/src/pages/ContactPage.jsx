/**
 * @file ContactPage.jsx
 * @description Renders the contact page for the application.
 * Includes a contact form, contact information, and a background video.
 * Uses react-hook-form for form handling and validation.
 * Displays a modal upon successful form submission.
 */

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import starryVideo from '../../public/videos/starryVideo.mp4'; // Import the background video
import { useForm } from 'react-hook-form'; // Hook for form management
import { FaEnvelope } from 'react-icons/fa'; // Email icon

/**
 * @component ContactPage
 * @description The main component for the contact page.
 * Manages form state, submission handling, and modal visibility.
 * @returns {JSX.Element} The rendered contact page component.
 */
const ContactPage = () => {
  // react-hook-form setup for form handling, validation, and state
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  // State to control the visibility of the submission confirmation modal
  const [showModal, setShowModal] = React.useState(false);
  // State to store the data submitted through the form
  const [submittedData, setSubmittedData] = React.useState(null);

  /**
   * @function onSubmit
   * @description Handles the form submission process.
   * Logs the submitted data, stores it in state, shows the confirmation modal,
   * and resets the form fields.
   * @param {object} data - The data collected from the form fields.
   */
  const onSubmit = async (data) => {
    console.log('Submitted Data:', data); // Log data for debugging
    setSubmittedData(data); // Store submitted data to display in the modal
    setShowModal(true); // Show the confirmation modal
    reset(); // Clear the form fields
  };

  return (
    // Main container with relative positioning for the absolute positioned video background
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Video Element */}
      <video
        autoPlay // Start playing automatically
        loop // Loop the video playback
        muted // Mute the video audio
        playsInline // Play inline on mobile devices
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]" // Position behind all other content
      >
        <source src={starryVideo} type="video/mp4" />
        Your browser does not support the video tag. {/* Fallback text */}
      </video>

      {/* Navigation Bar Component */}
      <Navbar />

      {/* Content Area with Semi-Transparent Overlay */}
      {/* This overlay improves text readability over the video background */}
      <div className="flex-grow flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 py-16 relative z-10 bg-black bg-opacity-30 dark:bg-opacity-50">
        {/* Left Column: Page Title and Contact Info */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          {/* Page Headings */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Let's chat.
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Let me know if you have any questions or feedback.
          </h2>

          {/* Under Construction Notice */}
          <p className="text-2xl text-red-500 dark:text-red-500 mb-10">
            ** Page currently under construction and not ready for use. **
          </p>

          {/* Email Contact Information Box */}
          {/* Styled with a blurred background for readability */}
          <div className="bg-white bg-opacity-20 dark:bg-black dark:bg-opacity-40 backdrop-blur-sm rounded-lg p-6 inline-flex items-center mt-4 w-fit border border-gray-200 dark:border-gray-600">
            <FaEnvelope className="text-blue-300 mr-3" /> {/* Email Icon */}
            <span className="text-white">Mail us at</span>
            <a href="mailto:contact@devblog.com" className="text-blue-300 ml-2 hover:underline">sampleEmail@gmail.com</a>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12">
          {/* Form Container with Blurred Background */}
          <div className="bg-white bg-opacity-20 dark:bg-black dark:bg-opacity-40 backdrop-blur-sm rounded-xl p-8 md:p-10 shadow-xl border border-gray-200 dark:border-gray-600">
            <h2 className="text-2xl font-bold text-white mb-6">
              Send us a message
            </h2>

            {/* Contact Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {/* Full Name Input Field */}
                <div>
                  <input
                    type="text"
                    placeholder="Full Name*"
                    className="w-full px-4 py-3 rounded-md bg-white bg-opacity-30 dark:bg-black dark:bg-opacity-50 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 border border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-white"
                    {...register("name", { required: true })} // Register field with validation
                  />
                  {/* Validation Error Message */}
                  {errors.name && <span className="text-red-400 text-sm mt-1">Name is required</span>}
                </div>

                {/* Email Address Input Field */}
                <div>
                  <input
                    type="email"
                    placeholder="Email Address*"
                    className="w-full px-4 py-3 rounded-md bg-white bg-opacity-30 dark:bg-black dark:bg-opacity-50 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 border border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-white"
                    {...register("email", {
                      required: true, // Email is required
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i // Email format validation
                    })}
                  />
                  {/* Validation Error Messages */}
                  {errors.email?.type === 'required' && <span className="text-red-400 text-sm mt-1">Email is required</span>}
                  {errors.email?.type === 'pattern' && <span className="text-red-400 text-sm mt-1">Invalid email address</span>}
                </div>

                {/* Subject Input Field */}
                <div>
                  <input
                    type="text"
                    placeholder="Subject*"
                    className="w-full px-4 py-3 rounded-md bg-white bg-opacity-30 dark:bg-black dark:bg-opacity-50 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 border border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-white"
                    {...register("subject", { required: true })} // Register field with validation
                  />
                  {/* Validation Error Message */}
                  {errors.subject && <span className="text-red-400 text-sm mt-1">Subject is required</span>}
                </div>

                {/* Message Textarea Field */}
                <div>
                  <textarea
                    placeholder="Tell us more about your project"
                    rows={4}
                    className="w-full px-4 py-3 rounded-md bg-white bg-opacity-30 dark:bg-black dark:bg-opacity-50 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 border border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-white resize-none"
                    {...register("message", { required: true })} // Register field with validation
                  />
                  {/* Validation Error Message */}
                  {errors.message && <span className="text-red-400 text-sm mt-1">Message is required</span>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 flex items-center justify-center"
                >
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      {/* Conditionally rendered based on showModal state */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          {/* Modal Content Box */}
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-purple-500 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Message Sent!</h2>
            {/* Display Submitted Data */}
            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300"><span className="text-purple-700 dark:text-purple-400 font-semibold">Name:</span> {submittedData?.name}</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="text-purple-700 dark:text-purple-400 font-semibold">Email:</span> {submittedData?.email}</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="text-purple-700 dark:text-purple-400 font-semibold">Subject:</span> {submittedData?.subject}</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="text-purple-700 dark:text-purple-400 font-semibold">Message:</span> {submittedData?.message}</p>
            </div>
            {/* Close Modal Button */}
            <div className="text-center">
              <button
                onClick={() => setShowModal(false)} // Hide modal on click
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default ContactPage;