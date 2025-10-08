import React from 'react'

const ProductDescription = () => {
  return (
    <div className='mt-14 bg-white'>
      <div className='flex gap-3 bg-primary rounded-2xl'>
        <button className='medium-14 p-3 w-32 border-b-2 border-secondary'>Description</button>
        <button className='medium-14 p-3 w-32'>Color Guide</button>
        <button className='medium-14 p-3 w-32'>Size Guide</button>
      </div>
      <hr className='h-[1px] w-full text-slate-900/20' />
      <div className='flex flex-col gap-3 p-3'>
        <div>
          <h5 className='h5'>Detail</h5>
          <p className='text-sm'>
            LoremBrighten your skin with our Vitamin C Face Oil, helping to reduce dark spots and even tone. This antioxidant-rich formula protects against environmental damage.
          </p>
          <p>Brighten your skin with our Vitamin C Face Oil, helping to reduce dark spots and even tone. This antioxidant-rich formula protects against environmental damage.</p>
        </div>
        <div>
          <h5 className='h5'>Benefit</h5>
          <ul className='list-disc pl-5 text-sm text-gray-30 flex flex-col gap-1'>
            <li>High Quality materials ensure long lasting durablelity and comfort</li>
            <li>High Quality materials ensure long lasting durablelity and comfort</li>
            <li>High Quality materials ensure long lasting durablelity and comfort</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProductDescription
