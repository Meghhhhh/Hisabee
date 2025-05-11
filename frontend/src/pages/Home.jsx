import React from 'react'
import Navbar from '../components/Navbar'
import Intro from '../components/Intro'
import { main } from 'framer-motion/client'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <main className='bg-black  w-full h-full'>
      <Navbar/>
      <div className='bg-black w-full h-full'>
        <Intro />
      </div>
      <Footer />
    </main>
  )
}

export default Home