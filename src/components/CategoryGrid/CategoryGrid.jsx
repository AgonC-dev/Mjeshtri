import { useNavigate } from 'react-router-dom';
import styles from './CategoryGrid.module.css';

const categories = [
  { id: 1, name: 'Instalues', icon: '🔧', slug: 'plumber' },
  { id: 2, name: 'Elektricist', icon: '⚡', slug: 'electrician' },
  { id: 3, name: 'Klima/AC', icon: '❄️', slug: 'hvac' },
  { id: 4, name: 'Plastifikim', icon: '🧱', slug: 'tiling' },
  { id: 5, name: 'Pastrim', icon: '🧹', slug: 'cleaning' },
  { id: 6, name: 'Më shumë', icon: '⋯', slug: 'all' },
];

function CategoryGrid() {
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/workers?category=${slug}`);
  };

  return (
    <section className={styles.categoryGrid}>
      <h2 className={styles.title}>Kategoritë</h2>
      <div className={styles.grid}>
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={styles.card}
            onClick={() => handleCategoryClick(category.slug)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>{category.icon}</span>
              <div className={styles.iconGlow}></div>
            </div>
            <h3 className={styles.name}>{category.name}</h3>
            <div className={styles.cardGlow}></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;