import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

const Item = ({ product }) => {
    const { navigate, currency } = useAppContext()
    const [hovered, setHovered] = useState(false)
    const [size, setsize] = useState(product.sizes[0]) // default size (first in the array)

    return (
        <div>
            <div className="overflow-hidden">
                {/* image */}
                <div
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="flexCenter h-[182px] w-full transition-all duration-100 rounded-xl group relative"
                // style={{backgroundColor: bgcolor}}
                >

                    <img src={product.images.length > 1 && hovered ? product.images
                    [1] : product.images[0]} alt="" height={144} width={144}/>

                </div>
            </div>
        </div>
    )
}

export default Item
