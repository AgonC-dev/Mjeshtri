import styles from "./FilterSidebar.module.css";

function FilterSidebar({
  cities,
  categories,
  selectedCity,
  selectedCategory,
  onCityChange,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}) {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Filtro</h2>

      <div className={styles.section}>
        <label className={styles.label}>Kërko</label>
        <input
          type="text"
          placeholder="Kërko mjeshtër..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Qyteti</label>
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className={styles.select}
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Kategoria</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={styles.select}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Çmimi (nga - deri)</label>
        <div className={styles.priceRow}>
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minPrice ?? ""}
            onChange={(e) =>
              onMinPriceChange && onMinPriceChange(e.target.value)
            }
            className={styles.input + " " + styles.priceInput}
          />
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice ?? ""}
            onChange={(e) =>
              onMaxPriceChange && onMaxPriceChange(e.target.value)
            }
            className={styles.input + " " + styles.priceInput}
          />
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
