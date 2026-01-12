import styles from './Hero.module.css'

function Hero({ onSearch, searchQuery, setSearchQuery }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>Gjej mjeshtrin e duhur në Kosovë</h1>
        <p className={styles.subtitle}>
          Lidhu me mjeshtër të kualifikuar për çdo nevojë të shtëpisë
        </p>
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Kërko mjeshtër..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Kërko
          </button>
        </form>
      </div>
    </section>
  )
}

export default Hero
