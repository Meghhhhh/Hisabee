import React from 'react'
import Navbar from '../components/Navbar'
import Intro from '../components/Intro'
import { main } from 'framer-motion/client'

const Home = () => {
  return (
    <main className='bg-black  w-full h-full'>
      <Navbar/>
      <div className='bg-black w-full h-full'>
        <Intro />
      </div>
    </main>
  )
}

export default Home