import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import starryVideo from '../../public/videos/starryVideo.mp4'; // Import the video
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
    // Make the main container relative to position the video absolutely within it, and remove background color
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]" // Position behind content
      >
        <source src={starryVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <Navbar />
      
      {/* Add a semi-transparent overlay to make text more readable */}
      <div className="flex-grow flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 py-16 relative z-10 bg-black bg-opacity-30 dark:bg-opacity-50">
        {/* Left Column - Content */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          {/* Light: dark text; Dark: white text */}
          {/* Ensure text is white or light-colored for visibility over the video */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Let's chat.
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Let me know if you have any questions or feedback.
          </h2>
          {/* Light: medium gray text; Dark: light gray text */}
          
          <p className="text-2xl text-red-500 dark:text-red-500 mb-10">
            ** Page currently under construction and not ready for use. **
          </p>
          
          {/* Adjust background for better readability over video */}
          <div className="bg-white bg-opacity-20 dark:bg-black dark:bg-opacity-40 backdrop-blur-sm rounded-lg p-6 inline-flex items-center mt-4 w-fit border border-gray-200 dark:border-gray-600">
            <FaEnvelope className="text-blue-300 mr-3" />
            <span className="text-white">Mail us at</span>
            <a href="mailto:contact@devblog.com" className="text-blue-300 ml-2 hover:underline">sampleEmail@gmail.com</a>
          </div>
        </div>
        
        {/* Right Column - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12">
          {/* Adjust form background for readability */}
          <div className="bg-white bg-opacity-20 dark:bg-black dark:bg-opacity-40 backdrop-blur-sm rounded-xl p-8 md:p-10 shadow-xl border border-gray-200 dark:border-gray-600">
            <h2 className="text-2xl font-bold text-white mb-6">
              Send us a message
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  {/* Light: light gray bg, dark text/placeholder/border; Dark: original blue styles */}
                  <input
                    type="text"
                    placeholder="Full Name*"
                    className="w-full px-4 py-3 rounded-md bg-white bg-opacity-30 dark:bg-black dark:bg-opacity-50 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 border border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-white"
                    {...register("name", { required: true })}
                  />
                  {/* Light: darker red error; Dark: original light red */}
                  {errors.name && <span className="text-red-400 text-sm mt-1">Name is required</span>}
                </div>
                
                <div>
                  {/* Light: light gray bg, dark text/placeholder/border; Dark: original blue styles */}
                  <input
                    type="email"
                    placeholder="Email Address*"
                    className="w-full px-4 py-3 rounded-md bg-white bg-opacity-30 dark:bg-black dark:bg-opacity-50 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 border border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-white"
                    {...register("email", { 
                      required: true,
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i 
                    })}
                  />
                  {/* Light: darker red error; Dark: original light red */}
                  {errors.email?.type === 'required' && <span className="text-red-400 text-sm mt-1">Email is required</span>}
                  {errors.email?.type === 'pattern' && <span className="text-red-400 text-sm mt-1">Invalid email address</span>}
                </div>
                
                <div>
                  {/* Light: light gray bg, dark text/placeholder/border; Dark: original blue styles */}
                  <input
                    type="text"
                    placeholder="Subject*"
                    className="w-full px-4 py-3 rounded-md bg-white bg-opacity-30 dark:bg-black dark:bg-opacity-50 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 border border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-white"
                    {...register("subject", { required: true })}
                  />
                  {/* Light: darker red error; Dark: original light red */}
                  {errors.subject && <span className="text-red-400 text-sm mt-1">Subject is required</span>}
                </div>
                
                <div>
                  {/* Light: light gray bg, dark text/placeholder/border; Dark: original blue styles */}
                  <textarea
                    placeholder="Tell us more about your project"
                    rows={4}
                    className="w-full px-4 py-3 rounded-md bg-white bg-opacity-30 dark:bg-black dark:bg-opacity-50 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-400 border border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-white resize-none"
                    {...register("message", { required: true })}
                  />
                  {/* Light: darker red error; Dark: original light red */}
                  {errors.message && <span className="text-red-400 text-sm mt-1">Message is required</span>}
                </div>
                
                {/* Light: blue bg, white text; Dark: original white bg, blue text */}
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