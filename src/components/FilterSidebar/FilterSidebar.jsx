import { useMemo, useState } from "react";
import styles from "./FilterSidebar.module.css";

function FilterSidebar({
  cities,
  categories,
  selectedCity,
  workerNames,
  selectedCategory,
  onCityChange,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) {

 const [isCatOpen, setIsCatOpen] = useState(false);
 const [isSearchOpen, setIsSearchOpen] = useState(false);

 const normalize = (str) => 
  str?.toLowerCase()
   .replace(/ë/g, "e")
   .replace(/ç/g, "c")
   .trim();

  const searchSuggestions = useMemo(() => {
    const query = normalize(searchQuery);
    if(!query || query.length < 2) return [];

    const matchedCats = categories
    .filter((cat) => normalize(cat).includes(query) && cat !== "Të gjitha")
    .map((cat) => ({ type: "Kategoria", value: cat}));

    const matchedNames = workerNames
    .filter((name) => normalize(name).includes(query))
    .slice(0, 5)
    .map((name) => ({ type: "Mjeshtri", value: name}))

    const matchedCities = cities
    .filter((city) => normalize(city).includes(normalize(searchQuery)))
    .map((city) => ({ type: "Qyteti", value: city}))

     return [...matchedCats, ...matchedNames, ...matchedCities];
  }, [categories, workerNames, searchQuery]) 


  const categorySuggestions = useMemo(() => {
    if (!selectedCategory?.trim()) return categories;
    return categories.filter((cat) =>
      normalize(cat).includes(normalize(selectedCategory))
    );
  }, [categories, selectedCategory]);

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Filtro</h2>

      {/* Main Search with Smart Suggestions */}
      <div className={styles.section}>
        <label className={styles.label}>Kërko</label>
        <div className={styles.autocomplete}>
          <input
            type="text"
            placeholder="Kërko (psh: Moler ose Emri)..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            className={styles.input}
          />
          {isSearchOpen && searchSuggestions.length > 0 && (
  <ul className={styles.suggestionList}>
    {searchSuggestions.map((item, index) => (
      <li
        key={index}
        className={styles.suggestionItem}
        onClick={() => {
          // NOW 'item' is defined because we are inside the .map()!
          if (item.type === "Qyteti") {
            onCityChange(item.value); 
            onSearchChange("");       
          } else if (item.type === "Kategoria") {
            onCategoryChange(item.value); 
            onSearchChange("");
          } else {
            onSearchChange(item.value); 
          }
          setIsSearchOpen(false);
        }}
      >
        <small className={styles.typeLabel}>{item.type}:</small> {item.value}
      </li>
    ))}
  </ul>
)}
        </div>
      </div>

      {/* City Select */}
      <div className={styles.section}>
        <label className={styles.label}>Qyteti</label>
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className={styles.select}
        >
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
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
            placeholder="Zgjidh kategorinë..."
            value={selectedCategory}
            onChange={(e) => {
              onCategoryChange(e.target.value);
              setIsCatOpen(true);
            }}
            onFocus={() => setIsCatOpen(true)}
            onBlur={() => setTimeout(() => setIsCatOpen(false), 200)}
          />
          {isCatOpen && categorySuggestions.length > 0 && (
            <ul className={styles.suggestionList}>
              {categorySuggestions.map((cat) => (
                <li
                  key={cat}
                  className={styles.suggestionItem}
                  onClick={() => {
                    onCategoryChange(cat);
                    setIsCatOpen(false);
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
