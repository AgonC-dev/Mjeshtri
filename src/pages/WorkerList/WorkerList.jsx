import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar'
import WorkerCard from '../../components/WorkerCard/WorkerCard'
import styles from './WorkerList.module.css'
import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../../api/https'

const cities = ['Të gjitha', 'Prishtinë', 'Prizren', 'Gjakovë', 'Mitrovicë', 'Pejë']
const categories = [
  'Të gjitha',
  'Instalues',
  'Elektricist',
  'Klima/AC',
  'Plastifikim',
  'Pastrim',
  'Fotograf',
  'Përkthyes',
  'Avokat',
  'Kontabilist',
  'Kopshtar',
  'Mekanik',
  'Moler',
  'Murator',
  'Vullkanizer',
  'Programer',
  'Dizajner Grafik'
]

function WorkerList() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // State for filters
  const [selectedCity, setSelectedCity] = useState('Të gjitha')
  const [selectedCategory, setSelectedCategory] = useState('Të gjitha')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;



  // Fetching data with TanStack Query
  const { data: allWorkers, isLoading, isFetching } = useQuery({
    queryKey: ['workers', selectedCity, selectedCategory],
    queryFn: () => fetchUsers(selectedCity, selectedCategory),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })

    useEffect(() => {
      setCurrentPage(1);
    }, [selectedCity, selectedCategory, debouncedSearchQuery])

  // Sync URL params with state
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')

    if (categoryParam) {
      const categoryMap = {
  // Original categories
     plumber: 'Instalues',
     electrician: 'Elektricist',
     hvac: 'Klima/AC',
     tiling: 'Plastifikim',
     cleaning: 'Pastrim',
  
  // Your new categories
     photography: 'Fotograf',
     translator: 'Përkthyes',
     lawyer: 'Avokat',
     accountant: 'Kontabilist',
     gardener: 'Kopshtar',
     mechanic: 'Mekanik',
     painter: 'Moler',
     mason: 'Murator',
    'tire-service': 'Vullkanizer', // or 'gomister'
     developer: 'Programer',
     'graphic-design': 'Dizajner Grafik',
  
    // All/Reset
     all: "Të gjitha"
}
      setSelectedCategory(categoryMap[categoryParam] || 'Të gjitha')
    }

    if (searchParam) {
      setSearchQuery(searchParam)
    }
  }, [searchParams])

  // Debounce search input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDebouncedSearchQuery('')
      return
    }

    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Memoized filtering logic
  const filteredWorkers = useMemo(() => {
    if (!allWorkers) return []
    
    return allWorkers.filter((worker) => {
      const matchesCity = selectedCity === 'Të gjitha' || worker.city === selectedCity
      const matchesCategory =
       !selectedCategory?.trim() ||
        selectedCategory === 'Të gjitha' ||
        worker.category === selectedCategory
      // const matchesPrice = (maxPrice === 0) || (worker.startingPrice >= minPrice && worker.startingPrice <= maxPrice)
      
      const searchStr = debouncedSearchQuery.toLowerCase()
      const matchesSearch = !searchStr || 
        worker.fullName?.toLowerCase().includes(searchStr) ||
        worker.category?.toLowerCase().includes(searchStr) ||
        worker.city?.toLowerCase().includes(searchStr)

      return matchesCity && matchesCategory  && matchesSearch
    })
  }, [allWorkers, debouncedSearchQuery, selectedCity, selectedCategory])

  const totalPages = Math.ceil(filteredWorkers.length / itemsPerPage) || 1;

  const paginatedWorkers = useMemo(() => {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return filteredWorkers.slice(firstIndex, lastIndex)
  }, [filteredWorkers, currentPage])

  const workersCount = () => {
    if(filteredWorkers.length === 1) {
      return "Një mjeshtër u gjetë"
    } else {
      return `${filteredWorkers.length} mjeshtër u gjetën`
    }
  }
    
  

  return (
    <div className={styles.workerList}>
      {/* Top Progress Bar for background updates */}
      <div className={`${styles.loadingBar} ${isFetching ? styles.active : ''}`} />
      
      <h1 className={styles.title}>Mjeshtër</h1>
      
      <div className={styles.container}>
        <FilterSidebar
          cities={cities}
          categories={categories}
          selectedCity={selectedCity}
          selectedCategory={selectedCategory}
          onCityChange={setSelectedCity}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <div className={styles.results}>
  {/* The count stays visible but is "placeholder-y" during initial load */}
  <p className={styles.resultsCount}>
    {isLoading ? "Duke kërkuar mjeshtrit..." : workersCount()}
  </p>

 <div className={styles.resultsWrapper}>
  {isLoading ? (
    <div className={styles.initialLoader}>
      <div className={styles.spinner} />
      <p className={styles.loadingText}>Duke u sinkronizuar me Mjeshtri.ks...</p>
    </div>
  ) : (
    <>
      {/* Use the paginated array for rendering cards */}
      {paginatedWorkers.length > 0 ? (
        <>
          <div className={`${styles.grid} ${isFetching ? styles.dimmed : ''}`}>
            {paginatedWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>

          {/* Pagination UI - Only shows if there is more than 1 page */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => {
                  setCurrentPage((prev) => prev - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
              >
                Mbrapa
              </button>

              <span className={styles.pageInfo}>
                Faqja <strong>{currentPage}</strong> nga <strong>{totalPages}</strong>
              </span>

              <button
                className={styles.pageBtn}
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
              >
                Para
              </button>
            </div>
          )}
        </>
      ) : (
        !isFetching && (
          <div className={styles.noResults}>
            <p>Nuk u gjet asnjë mjeshtër me këto kritere.</p>
          </div>
        )
      )}
    </>
  )}
</div>
</div>
      
      </div>
    </div>
  )
}

export default WorkerList