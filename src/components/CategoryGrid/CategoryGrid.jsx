// 1. ALL imports go here at the very top
import { useNavigate } from 'react-router-dom'
import styles from './CategoryGrid.module.css'

// 2. Constants go next
const categories = [
  { id: 1, name: 'Instalues', icon: '🔧', slug: 'plumber' },
  { id: 2, name: 'Elektricist', icon: '⚡', slug: 'electrician' },
  { id: 3, name: 'Klima/AC', icon: '❄️', slug: 'hvac' },
  { id: 4, name: 'Plastifikim', icon: '🧱', slug: 'tiling' },
  { id: 5, name: 'Pastrim', icon: '🧹', slug: 'cleaning' },
  { id: 6, name: 'Më shumë', icon: '...', slug: 'all' },
]

// 3. The Function Component
function CategoryGrid() {
  const navigate = useNavigate()

  const handleCategoryClick = (slug) => {
    navigate(`/workers?category=${slug}`)
  }

  return (
    <section className={styles.categoryGrid}>
      <h2 className={styles.title}>Kategoritë</h2>
      <div className={styles.grid}>
        {categories.map((category) => (
          <div
            key={category.id}
            className={styles.card}
            onClick={() => handleCategoryClick(category.slug)}
          >
            <div className={styles.icon}>{category.icon}</div>
            <h3 className={styles.name}>{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}

// 4. The export at the bottom (or top level)
export default CategoryGrid