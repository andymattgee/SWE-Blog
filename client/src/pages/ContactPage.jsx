import React from 'react';
import Navbar from '../components/Navbar';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [message, setMessage] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState(null);

  const onSubmit = async (data) => {
    console.log('Submitted Data:', data);
    setSubmittedData(data);
    setShowModal(true);
    // try {
    //   const result = await axios.post('/api/contact', data);
    //   if (result.data.success) {
    //     reset();
    //     setMessage('Message sent successfully!');
    //   }
    // } catch (error) {
    //   console.error('Error sending message:', error);
    //   setMessage('Failed to send message. Please try again.');
    // }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-tr from-purple-700 via-purple-900 to-black">
        <h1 className='text-blue-500 text-6xl mb-10'>
          Leave your Contact Info and I'll reach out!
        </h1>
        <form className='w-full max-w-sm' onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <label htmlFor="name" className="block text-white font-medium mb-1"> Name</label>
            <input
            id="name"
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            {...register("Name", { required: true })}
            />
          </div>

          <div className='mb-4'>
            <label htmlFor="email" className="block text-white font-medium mb-1"> Email</label>
            <input
            id="email"
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            {...register("Email", { required: true })}
            />
          </div>

          <div className='mb-4'>
            <label htmlFor="message" className="block text-white font-medium mb-1"> Message</label>
            <textarea
            id="message"
            type="text"
            rows={5}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            {...register("Message", { required: true })}
            />
          </div>

          <button
                        type="submit"
                        className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Submit Contact Info
                    </button>
          {message && <p className="text-white mt-4">{message}</p>}
        </form>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Your Contact Information</h2>
              <p><strong>Name:</strong> {submittedData?.Name}</p>
              <p><strong>Email:</strong> {submittedData?.Email}</p>
              <p><strong>Message:</strong> {submittedData?.Message}</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactPage;