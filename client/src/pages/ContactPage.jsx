import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaArrowRight } from 'react-icons/fa';

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [showModal, setShowModal] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState(null);

  const onSubmit = async (data) => {
    console.log('Submitted Data:', data);
    setSubmittedData(data);
    setShowModal(true);
    reset();
  };

  return (
    // Light: white bg; Dark: black bg (simplified from gradient)
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <Navbar />
      
      <div className="flex-grow flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 py-16">
        {/* Left Column - Content */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          {/* Light: dark text; Dark: white text */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Let's chat.
          </h1>
          {/* Light: dark text; Dark: white text */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Tell us about your project.
          </h2>
          {/* Light: medium gray text; Dark: light gray text */}
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
            Let's create something together
          </p>
          
          {/* Light: light gray bg, dark text; Dark: original translucent bg, white text */}
          <div className="bg-gray-100 dark:bg-white dark:bg-opacity-10 dark:backdrop-blur-md rounded-lg p-6 inline-flex items-center mt-4 w-fit border border-gray-200 dark:border-transparent">
            <FaEnvelope className="text-blue-600 dark:text-blue-400 mr-3" />
            <span className="text-gray-800 dark:text-white">Mail us at</span>
            <a href="mailto:contact@devblog.com" className="text-blue-600 dark:text-blue-400 ml-2 hover:underline">contact@devblog.com</a>
          </div>
        </div>
        
        {/* Right Column - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12">
          {/* Light: white bg, dark text; Dark: original blue bg, white text */}
          <div className="bg-white dark:bg-purple-900 rounded-xl p-8 md:p-10 shadow-xl border-2 border-gray-200 ">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send us a message
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  {/* Light: light gray bg, dark text/placeholder/border; Dark: original blue styles */}
                  <input
                    type="text"
                    placeholder="Full Name*"
                    className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-purple-800 dark:bg-opacity-50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-purple-300 border border-gray-300 dark:border-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white"
                    {...register("name", { required: true })}
                  />
                  {/* Light: darker red error; Dark: original light red */}
                  {errors.name && <span className="text-red-600 dark:text-red-300 text-sm mt-1">Name is required</span>}
                </div>
                
                <div>
                  {/* Light: light gray bg, dark text/placeholder/border; Dark: original blue styles */}
                  <input
                    type="email"
                    placeholder="Email Address*"
                    className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-purple-800 dark:bg-opacity-50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-purple-300 border border-gray-300 dark:border-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white"
                    {...register("email", { 
                      required: true,
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i 
                    })}
                  />
                  {/* Light: darker red error; Dark: original light red */}
                  {errors.email?.type === 'required' && <span className="text-red-600 dark:text-red-300 text-sm mt-1">Email is required</span>}
                  {errors.email?.type === 'pattern' && <span className="text-red-600 dark:text-red-300 text-sm mt-1">Invalid email address</span>}
                </div>
                
                <div>
                  {/* Light: light gray bg, dark text/placeholder/border; Dark: original blue styles */}
                  <input
                    type="text"
                    placeholder="Subject*"
                    className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-purple-800 dark:bg-opacity-50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-purple-300 border border-gray-300 dark:border-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white"
                    {...register("subject", { required: true })}
                  />
                  {/* Light: darker red error; Dark: original light red */}
                  {errors.subject && <span className="text-red-600 dark:text-red-300 text-sm mt-1">Subject is required</span>}
                </div>
                
                <div>
                  {/* Light: light gray bg, dark text/placeholder/border; Dark: original blue styles */}
                  <textarea
                    placeholder="Tell us more about your project"
                    rows={4}
                    className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-purple-800 dark:bg-opacity-50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-purple-300 border border-gray-300 dark:border-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white resize-none"
                    {...register("message", { required: true })}
                  />
                  {/* Light: darker red error; Dark: original light red */}
                  {errors.message && <span className="text-red-600 dark:text-red-300 text-sm mt-1">Message is required</span>}
                </div>
                
                {/* Light: blue bg, white text; Dark: original white bg, blue text */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 dark:bg-white text-white dark:text-purple-700 font-bold py-3 px-6 rounded-md hover:bg-blue-700 dark:hover:bg-purple-100 transition duration-300 flex items-center justify-center"
                >
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          {/* Modal - Light: white bg, dark text; Dark: original dark bg, light text */}
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-purple-500 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Message Sent!</h2>
            {/* Modal Content Box - Light: light gray bg; Dark: original dark gray bg */}
            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {/* Light: dark text, darker purple label; Dark: light text, light purple label */}
              <p className="text-gray-700 dark:text-gray-300"><span className="text-purple-700 dark:text-purple-400 font-semibold">Name:</span> {submittedData?.name}</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="text-purple-700 dark:text-purple-400 font-semibold">Email:</span> {submittedData?.email}</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="text-purple-700 dark:text-purple-400 font-semibold">Subject:</span> {submittedData?.subject}</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="text-purple-700 dark:text-purple-400 font-semibold">Message:</span> {submittedData?.message}</p>
            </div>
            <div className="text-center">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default ContactPage;