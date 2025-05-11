import React from 'react'

import { signimg } from '../constants/index1'
import Login from '../components/Login'

const SignUp = () => {
  return (
    <div className='bg-black flex h-screen w-full'>
      <div className='flex w-full flex-col [@media(min-width:1080px)]:flex-row'>
        {/* Left Side - Image (Hidden below 1080px) */}
        <div className='w-full [@media(min-width:1080px)]:w-[35%] [@media(max-width:1079px)]:hidden h-full'>
          <img src={signimg} alt="Sign Up" className='w-full h-full object-cover' />
        </div>

        {/* Right Side - Login Form */}
        <div className='w-[65%] h-full flex items-center justify-center text-white'>
        <Login>
    
        </Login>
        </div>
      </div>
    </div>
  )
}

export default SignUp
