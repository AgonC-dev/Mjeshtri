import { useMemo, useState } from "react";
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
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Autocomplete suggestions ONLY (UI logic)
  const suggestions = useMemo(() => {
    if (!selectedCategory?.trim()) return categories;

    return categories.filter((cat) =>
      cat.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [categories, selectedCategory]);

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Filtro</h2>

      {/* Search */}
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

      {/* City */}
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

      {/* Category Autocomplete */}
      <div className={styles.section}>
        <label className={styles.label}>Kategoria</label>
        <div className={styles.autocomplete}>
          <input
            type="text"
            className={styles.input}
            placeholder="Zgjidh ose kërko..."
            value={selectedCategory}
            onChange={(e) => {
              const value = e.target.value;
              onCategoryChange(value);
              setIsOpen(value !== "");
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          />

          <button
            type="button"
            className={styles.dropdownToggle}
            onClick={() => setIsOpen((o) => !o)}
            tabIndex={-1}
          >
            {isOpen ? "▲" : "▼"}
          </button>

          {isOpen && suggestions.length > 0 && (
            <ul className={styles.suggestionList}>
              {suggestions.map((cat) => (
                <li
                  key={cat}
                  className={styles.suggestionItem}
                  onClick={() => {
                    onCategoryChange(cat);
                    setIsOpen(false);
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
