import React, { useEffect, useMemo, useState } from 'react'
import Item from '../components/Item'
import { useAppContext } from '../context/AppContext'
import SearchInput from '../components/SearchInput'


const Collection = () => {

  const { products, searchQuery } = useAppContext()
  const [ category, setCategory ] = useState([])
  const [type, setType] = useState([])
  const [selectedSort, setSelectedSort] = useState("relevant")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [availableTypes, setavailableTypes] = useState([])
  const itemsPerPage = 8

  // predefined categories list 
  const allCataegories = useMemo(() => ["Hair Care", "Body Care", "Face Care"], [])

  // Reusable function to toggle filter values
  const toggleFilter = (value, setState) => {
    setState((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value])
  }

  // Dynamically update types based on selected categories
  useEffect(() => {
    const selectedCats = category.length > 0 ? category : allCataegories;
    const filteredProds = products.filter((p) => selectedCats.includes(p.category))
    const typesSet = new Set(filteredProds.map((p) => p.type))
    const newAvailableTypes = [...typesSet].sort();
    setavailableTypes(newAvailableTypes)
    //Remove unavailable types from selection
    setType((prev) => prev.filter((t) => typesSet.has(t)))
  }, [category, products, allCataegories])

  // apply filter line search, category, type and instock
  const applyFilters = () => {
    let filtered = [...products]
    //products that are insock
    filtered = filtered.filter(p => p.inStock)

    if (searchQuery) {
      filtered = filtered.filter(product => product.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (category.length) {
      filtered = filtered.filter(product => category.includes(product.category))

    }
    if (type.length) {
      filtered = filtered.filter(product => type.includes(product.type))
    }

    return filtered
  }

  // sorting logic based on price or relevent
  const applySorting = (productsList) => {
    switch (selectedSort) {
      case "low":
        return [...productsList].sort((a, b) => Math.min(...Object.values(a.price)) - Math.min(...Object.values(b.price)))
        break;

      case "high":
        return [...productsList].sort((a, b) => Math.min(...Object.values(b.price)) - Math.min(...Object.values(a.price)))
        break;

      default:
        return productsList
        break;
    }
  }

  //update filtered and sorted products whenever dependencies change
  useEffect(() => {
    let filtered = applyFilters()
    let sorted = applySorting(filtered)
    setFilteredProducts(sorted)
    setCurrentPage(1) // Reset to first page when filters change
  }, [category, type, selectedSort, products, searchQuery])

  // handel pagination logic
  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredProducts.slice(startIndex, endIndex)
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  return (
    <div className='max-padd-container !px-0 mt-40'>
      <div className='flex flex-col sm:flex-row gap-8 mb-16'>
        {/* filter Option  */}
        <div className='min-w-72 bg-primary p-4 pl-6 lg:pl-12 rounded-r-xl'>
          <SearchInput />
          <div className='px-4 py-3 mt-2 bg-white rounded-xl'>
            <h5 className='h5 mb-4'>Sort By Price</h5>
            <select onChange={(e) => setSelectedSort(e.target.value)} className='border border-slate-900/10 outline-none text-gray-30 medium-14 h-8 w-full px-2 rounded-md'>
              <option value="relevant">Relevant</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className='pl-5 py-3 mt-4 bg-white rounded-xl'>
            <h5 className='h5 mb-4'>Categories</h5>
            <div className='flex flex-col gap-2 text-sm font-light'>
              {allCataegories.map((cat) => (
                <label key={cat} className='flex gap-2 medium-14 text-gray-30'>
                  <input onChange={(e) => toggleFilter(e.target.value, setCategory)} type='checkbox' value={cat} checked={category.includes(cat)} className='w-3' />
                  {cat}
                </label>
              ))}
            </div>
          </div>
          <div className='pl-5 mt-4 bg-white rounded-xl'>
            <h5 className='h5 mb-4'>Types</h5>
            <div className='flex flex-col gap-2 text-sm font-light'>
              {availableTypes.map((typ)=>(
              <label key={typ} className='flex gap-2 medium-14 text-gray-30'>
                <input onChange={(e) => toggleFilter(e.target.value, setType)} type='checkbox' value={typ} checked={type.includes(typ)} className='w-3'/>
                {typ}
              </label>
              ))}
            </div>
          </div>
        </div>
        {/* right side - filterd products  */}
        <div className='max-sm:px-10 sm:pr-10'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {getPaginatedProducts().length > 0 ? (
              getPaginatedProducts().map((product) => (
                <Item product={product} key={product._id} />
              ))
            ) : (
              <p className="capitalize">No products found for selected filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Collection
