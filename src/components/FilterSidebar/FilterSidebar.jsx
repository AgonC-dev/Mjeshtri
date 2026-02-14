import { useMemo, useState } from "react";
import styles from "./FilterSidebar.module.css";
import Search from '../../assets/Search2.png';


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
  isVerified,
  onVerifiedChange,
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
    

      {/* Main Search with Smart Suggestions */}
      <div className={styles.section1}>
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
          <img src={Search} alt="Search icon" className={styles.searchIcon}/>
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
      <div className={styles.section2}>
       
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
      <div className={styles.section4}>
 
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

       <div className={styles.section5}>
  <label className={styles.switchLabel}>
    <input
      type="checkbox"
      checked={isVerified}
      onChange={(e) => onVerifiedChange(e.target.checked)}
      className={styles.hiddenCheckbox}
    />
    <div className={`${styles.toggle} ${isVerified ? styles.active : ''}`}>
       <div className={styles.toggleBall} />
    </div>
    <span className={styles.toggleText}>Verifikuar</span>
    {/* This is the Instagram Badge */}
    <span className={styles.verifiedBadge}>
      <svg viewBox="0 0 24 24" aria-label="Verified account" className={styles.badgeIcon}>
        <path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.15-.44.23-.91.23-1.4 0-2.43-1.97-4.4-4.4-4.4-.49 0-.96.09-1.4.24-1.17-1.55-3.04-2.56-5.16-2.56-2.12 0-3.99 1.01-5.16 2.56-.44-.15-.91-.24-1.4-.24-2.43 0-4.4 1.97-4.4 4.4 0 .49.08.96.23 1.41-1.3.71-2.18 2.08-2.18 3.65 0 1.58.88 2.95 2.18 3.66-.15.44-.23.91-.23 1.4 0 2.43 1.97 4.4 4.4 4.4.49 0 .96-.09 1.4-.24 1.17 1.55 3.04 2.56 5.16 2.56 2.12 0 3.99-1.01 5.16-2.56.44.15.91.24 1.4.24 2.43 0 4.4-1.97 4.4-4.4 0-.49-.08-.96-.23-1.41 1.3-.71 2.18-2.08 2.18-3.66zm-13.42 4.4L5.5 13.32l1.45-1.45 2.13 2.13 5.3-5.3 1.45 1.45-6.75 6.75z" fill="currentColor"></path>
      </svg>
    </span>
  </label>
</div>
    </aside>
  );
}

export default FilterSidebar;
