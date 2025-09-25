import React from 'react'
import { assets } from '../assets/data'

const Features = () => {
    return (
        <section className='max-padd-container my-10 xl:my-22'>
            {/* container */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-6 gap-y-12 items-center rounded-xl'>
                <div><img src={assets.features1} alt="" height={77} width={222} className='rounded-full' /></div>
                <div><img src={assets.features2} alt="" height={77} width={222} className='rounded-full' /></div>
                <div className='p-4'>
                    <h4 className='h4 capitalize'>Quality Plants</h4>
                    <p>Freshly grown water lilies, delivered with care. </p>
                </div>
                <div className='p-4'>
                    <h4 className='h4 capitalize'>Fast Delivery</h4>
                    <p>Freshly grown water lilies, delivered with care. </p>
                </div>
                <div className='p-4'>
                    <h4 className='h4 capitalize'>Secure Payment</h4>
                    <p>Freshly grown water lilies, delivered with care. </p>
                </div>
            </div>
        </section>
    )
}

export default Features
