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
    <div className="min-h-screen flex flex-col [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <Navbar />
      
      <div className="flex-grow flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 py-16">
        {/* Left Column - Content */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Let's chat.
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Tell us about your project.
          </h2>
          <p className="text-lg text-gray-300 mb-10">
            Let's create something together
          </p>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 inline-flex items-center mt-4 w-fit">
            <FaEnvelope className="text-blue-400 mr-3" />
            <span className="text-white">Mail us at</span>
            <a href="mailto:contact@devblog.com" className="text-blue-400 ml-2 hover:underline">contact@devblog.com</a>
          </div>
        </div>
        
        {/* Right Column - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12">
          <div className="bg-blue-600 rounded-xl p-8 md:p-10 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              Send us a message
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name*"
                    className="w-full px-4 py-3 rounded-md bg-blue-500 bg-opacity-50 text-white placeholder-blue-200 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-white"
                    {...register("name", { required: true })}
                  />
                  {errors.name && <span className="text-red-300 text-sm mt-1">Name is required</span>}
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Email Address*"
                    className="w-full px-4 py-3 rounded-md bg-blue-500 bg-opacity-50 text-white placeholder-blue-200 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-white"
                    {...register("email", { 
                      required: true,
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i 
                    })}
                  />
                  {errors.email?.type === 'required' && <span className="text-red-300 text-sm mt-1">Email is required</span>}
                  {errors.email?.type === 'pattern' && <span className="text-red-300 text-sm mt-1">Invalid email address</span>}
                </div>
                
                <div>
                  <input
                    type="text"
                    placeholder="Subject*"
                    className="w-full px-4 py-3 rounded-md bg-blue-500 bg-opacity-50 text-white placeholder-blue-200 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-white"
                    {...register("subject", { required: true })}
                  />
                  {errors.subject && <span className="text-red-300 text-sm mt-1">Subject is required</span>}
                </div>
                
                <div>
                  <textarea
                    placeholder="Tell us more about your project"
                    rows={4}
                    className="w-full px-4 py-3 rounded-md bg-blue-500 bg-opacity-50 text-white placeholder-blue-200 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-white resize-none"
                    {...register("message", { required: true })}
                  />
                  {errors.message && <span className="text-red-300 text-sm mt-1">Message is required</span>}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-md hover:bg-blue-50 transition duration-300 flex items-center justify-center"
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
          <div className="bg-gray-900 border border-purple-500 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-white">Message Sent!</h2>
            <div className="mb-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-300"><span className="text-purple-400 font-semibold">Name:</span> {submittedData?.name}</p>
              <p className="text-gray-300"><span className="text-purple-400 font-semibold">Email:</span> {submittedData?.email}</p>
              <p className="text-gray-300"><span className="text-purple-400 font-semibold">Subject:</span> {submittedData?.subject}</p>
              <p className="text-gray-300"><span className="text-purple-400 font-semibold">Message:</span> {submittedData?.message}</p>
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