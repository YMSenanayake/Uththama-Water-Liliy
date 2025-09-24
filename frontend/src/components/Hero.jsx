import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/data'

const Hero = () => {
    return (
        <section className='max-padd-container'>
            <div className="bg-[url('/src/assets/bg.png')] bg-cover bg-center bg-no-repeat h-[89vh] w-full mt-38 rounded-2xl relative">
                <div className="mx-auto max-w-[1440px] px-4 pt-1 sm:pt-8 flex flex-col justify-betweenh h-full">
                    <div className="max-w-3xl">
                        <h1 className='h1 !font-[400] capitalize'>Bring Nature's Beauty  Home With Elegant Water Lilies </h1>
                        <p>Freshly grown water lilies, delivered with care. Perfect for gardens,ponds,and decor.</p>
                        <div className="flex ">
                            <Link to={'/collection'} className="bg-secondary text-white text-xs font-medium capitalize pl-5 rounded-full flexCenter gap-x-2 mt-10 group">
                                Shop Water Lilies
                                <img src={assets.forward} alt="" width={41} className="bg-white rounded-full flexCenter p-2 m-1 group-hover:translate-x-3 transition-all duration-500"/>
                            </Link>
                        </div>
                    </div>
                    {/* card */}
                    <div className="bg-white p-3 max-w-[249px] rounded-2xl mt-20">
                        <div className='h-32 w-56 overflow-hidden'>
                            <img src={assets.hero} alt="" className='h-30 object-cover w-full rounded-2xl' />
                        </div>
                        <p className='text-[13px] pt-2'>
                            <b className='uppercase'>Discover Rare Blue Lilies</b><br /> Add a unique touch to your pond today. <Link to={'/collection'}><b>Shop Now</b></Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
