import React from 'react'
import Hero from '../components/Hero'
import Features from '../context/features'
import NewArrivals from '../components/NewArrivals'
import PopularProducts from '../components/PopularProducts'
import Testimonial from '../components/Testimonial'

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <NewArrivals/>
      <PopularProducts/>
      <div>banner</div>
      <Testimonial/>
    </>
  )
}

export default Home
