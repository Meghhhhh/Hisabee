import React, { useState } from 'react';
import { signimg } from '../constants/index1';
import Login from '../components/Login';
import Registrationform from '../components/Registrationform';

const Register = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className='bg-black flex h-screen w-full'>
      <div className='flex w-full flex-col [@media(min-width:1080px)]:flex-row'>
        
        {/* Left Side - Image */}
        <div className='w-full [@media(min-width:1080px)]:w-[35%] [@media(max-width:1079px)]:hidden h-full'>
          <img src={signimg} alt="Sign Up" className='w-full h-full object-cover' />
        </div>

        {/* Right Side - Form Section */}
        <div className='w-[65%] h-full flex flex-col items-center justify-center text-white p-4'>

          {isLogin ? <Login /> : <Registrationform />}

          <p className='mt-6 text-sm'>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className='ml-2 text-blue-500 hover:underline'
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
