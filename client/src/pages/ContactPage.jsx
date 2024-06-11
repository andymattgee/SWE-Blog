import React from 'react';
import NavBar from '../components/navbar';
import { useForm } from 'react-hook-form';

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async data => {
    console.log('submitted');
    console.log('data ->', data);
    reset({Name:'',Email:'',Message:''});
  }
  return (
    <div>
      <NavBar />
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-tr from-cyan-600 via-blue-700 to-indigo-800">
        <h1 className='text-white text-6xl mb-10'>
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

        </form>
      </div>
    </div>
  )
}

export default ContactPage;