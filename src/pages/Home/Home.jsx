import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../../components/Hero/Hero'
import CategoryGrid from '../../components/CategoryGrid/CategoryGrid'
import FeaturedWorkers from '../../components/FeaturedWorkers/FeaturedWorkers'
import styles from './Home.module.css'

function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/workers?search=${encodeURIComponent(query)}`)
    } else {
      navigate('/workers')
    }
  }

  return (
    <div className={styles.home}>
      <Hero onSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryGrid />
      <FeaturedWorkers />
    </div>
  )
}

export default Home
