import React, { useEffect, useState } from 'react'
import Title from './Title'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
// import required modules
import { Autoplay } from 'swiper/modules';
import { useAppContext } from '../context/AppContext';
import Item from './Item';


const NewArrivals = () => {

    const { products } = useAppContext()
    const [newArrivals, setnewArrivals] = useState([])

    useEffect(() => {
        const data = products.filter((item) => item.inStock).slice(0, 10)
        setnewArrivals(data)
    }, [products])

    return (
        <section className='max-padd-container mt-28'>
            <Title title1={'New'} title2={'Arrivals'} titleStyles={'pb-10'} />
            {/* container */}
            <Swiper
                spaceBetween={30}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    555: {
                        slidesPerView: 1
                    },
                    600: {
                        slidesPerView: 2
                    },
                    1022: {
                        slidesPerView: 3
                    },
                    1350: {
                        slidesPerView: 4
                    },
                }}
                modules={[Autoplay]}
                className="min-h-[399px]"
            >
                {newArrivals.map((product) => (

                    <SwiperSlide key={product._id}>
                        <Item product={product}/>
                    </SwiperSlide>
                ))
                }
            </Swiper>
        </section>
    )
}

export default NewArrivals
