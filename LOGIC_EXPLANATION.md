# Complete Logic Explanation: Category, Filter, and Search

## 🔄 **FLOW OVERVIEW**

There are **3 entry points** that lead to filtering:
1. **Category Grid** (Home page) → Navigates with URL parameter `?category=slug`
2. **Hero Search** (Home page) → Navigates with URL parameter `?search=query`
3. **Filter Sidebar** (Worker List page) → Updates state directly

All paths lead to `/workers` page where the **filtering logic** happens.

---

## 📍 **1. CATEGORY SELECTION LOGIC** (CategoryGrid.jsx)

### Line-by-Line Breakdown:

```javascript
// Lines 4-10: Define categories with slugs
const categories = [
  { id: 1, name: 'Instalues', icon: '🔧', slug: 'plumber' },
  // Each category has:
  // - id: unique identifier
  // - name: Albanian display name
  // - icon: emoji icon
  // - slug: URL-friendly English name (used in URL)
]
```

**Why slugs?** URLs use English slugs (`plumber`), but the app displays Albanian names (`Instalues`).

```javascript
// Line 13: Get navigation function
const navigate = useNavigate()
// This hook from React Router lets us change the URL programmatically
```

```javascript
// Lines 15-17: Handle category click
const handleCategoryClick = (slug) => {
  navigate(`/workers?category=${slug}`)
  // Example: If user clicks "Instalues", slug is "plumber"
  // URL becomes: /workers?category=plumber
}
```

```javascript
// Lines 23-32: Render category cards
{categories.map((category) => (
  <div onClick={() => handleCategoryClick(category.slug)}>
    {/* When clicked, calls handleCategoryClick with the slug */}
  </div>
))}
```

**Result:** User clicks category → URL changes to `/workers?category=plumber` → WorkerList page loads

---

## 🔍 **2. SEARCH LOGIC** (Home.jsx + Hero.jsx)

### Home.jsx Logic:

```javascript
// Line 9: Get navigation function
const navigate = useNavigate()

// Line 10: State to store what user types
const [searchQuery, setSearchQuery] = useState('')
// Initially empty string
```

```javascript
// Lines 12-18: Handle search submission
const handleSearch = (query) => {
  if (query.trim()) {
    // .trim() removes whitespace from start/end
    // If query has actual content (not just spaces):
    navigate(`/workers?search=${encodeURIComponent(query)}`)
    // encodeURIComponent() converts special characters to URL-safe format
    // Example: "test search" becomes "test%20search"
  } else {
    // If query is empty or only spaces:
    navigate('/workers')
    // Navigate without search parameter
  }
}
```

**Why `encodeURIComponent`?** 
- User types: "Arben Krasniqi"
- URL needs: `?search=Arben%20Krasniqi` (space becomes `%20`)
- Prevents URL breaking with special characters

### Hero.jsx Logic:

```javascript
// Line 3: Receives props from Home component
function Hero({ onSearch, searchQuery, setSearchQuery }) {
  // onSearch: function to call when form submitted
  // searchQuery: current input value
  // setSearchQuery: function to update input value
```

```javascript
// Lines 4-7: Handle form submission
const handleSubmit = (e) => {
  e.preventDefault()
  // Prevents page refresh (default form behavior)
  onSearch(searchQuery)
  // Calls the handleSearch function from Home.jsx
  // Passes current searchQuery value
}
```

```javascript
// Lines 17-23: Search input field
<input
  value={searchQuery}
  // Controlled input: value comes from state
  onChange={(e) => setSearchQuery(e.target.value)}
  // Every keystroke updates searchQuery state
  // e.target.value = what user just typed
/>
```

**Result:** User types → presses Enter/Submit → URL becomes `/workers?search=query` → WorkerList page loads

---

## 🎯 **3. FILTERING LOGIC** (WorkerList.jsx) - THE CORE

This is where **ALL filtering happens**. Let's break it down:

### **A. Initial State Setup (Lines 75-81)**

```javascript
// Line 76: Get URL search parameters
const [searchParams] = useSearchParams()
// This reads URL like: /workers?category=plumber&search=arben
// searchParams.get('category') returns "plumber"
// searchParams.get('search') returns "arben"

// Line 77: Navigation function
const navigate = useNavigate()

// Line 78: City filter state
const [selectedCity, setSelectedCity] = useState('Të gjitha')
// Default: "All cities" (no filter)

// Line 79: Category filter state
const [selectedCategory, setSelectedCategory] = useState('Të gjitha')
// Default: "All categories" (no filter)

// Line 80: Search query state
const [searchQuery, setSearchQuery] = useState('')
// Default: empty (no search)

// Line 81: Filtered results state
const [filteredWorkers, setFilteredWorkers] = useState(allWorkers)
// Initially shows ALL workers (no filtering yet)
```

### **B. URL Parameter Reading (Lines 83-101)**

```javascript
// Line 83: useEffect runs when component mounts OR URL changes
useEffect(() => {
  // This effect reads URL parameters and updates state accordingly
  
  // Line 84: Get category from URL
  const categoryParam = searchParams.get('category')
  // Example: URL is /workers?category=plumber
  // categoryParam = "plumber"
  
  // Line 85: Get search from URL
  const searchParam = searchParams.get('search')
  // Example: URL is /workers?search=arben
  // searchParam = "arben"
```

```javascript
  // Lines 87-96: Convert URL slug to Albanian category name
  if (categoryParam) {
    // If URL has ?category=something
    const categoryMap = {
      plumber: 'Instalues',      // URL slug → Display name
      electrician: 'Elektricist',
      hvac: 'Klima/AC',
      tiling: 'Plastifikim',
      cleaning: 'Pastrim',
    }
    setSelectedCategory(categoryMap[categoryParam] || 'Të gjitha')
    // categoryMap['plumber'] = 'Instalues'
    // If slug not found, default to 'Të gjitha'
  }
```

**Why this mapping?**
- URL uses: `?category=plumber` (English, URL-friendly)
- App displays: "Instalues" (Albanian, user-friendly)
- This converts between them

```javascript
  // Lines 98-100: Set search query from URL
  if (searchParam) {
    setSearchQuery(searchParam)
    // If URL has ?search=arben, update searchQuery state
  }
}, [searchParams])
// Dependency: runs when searchParams changes (URL changes)
```

### **C. THE MAIN FILTERING LOGIC (Lines 103-124)**

This is the **heart of the filtering system**:

```javascript
// Line 103: useEffect runs when filters change
useEffect(() => {
  // This effect runs whenever:
  // - selectedCity changes
  // - selectedCategory changes  
  // - searchQuery changes
  
  // Line 104: Start with ALL workers
  let filtered = [...allWorkers]
  // [...allWorkers] creates a COPY (not reference)
  // We'll filter this copy step by step
```

**Step 1: Filter by City (Lines 106-108)**

```javascript
  if (selectedCity !== 'Të gjitha') {
    // If user selected a specific city (not "All")
    filtered = filtered.filter((worker) => worker.city === selectedCity)
    // .filter() creates new array with only matching items
    // Example: selectedCity = "Prishtinë"
    // Keeps only workers where worker.city === "Prishtinë"
  }
  // If selectedCity === 'Të gjitha', skip this (show all cities)
```

**How `.filter()` works:**
- Goes through each worker
- If `worker.city === selectedCity` → keep it
- If not → remove it
- Returns new array with only matches

**Step 2: Filter by Category (Lines 110-112)**

```javascript
  if (selectedCategory !== 'Të gjitha') {
    // If user selected a specific category (not "All")
    filtered = filtered.filter((worker) => worker.category === selectedCategory)
    // Example: selectedCategory = "Instalues"
    // Keeps only workers where worker.category === "Instalues"
    // This works on the ALREADY FILTERED array from Step 1
  }
```

**Important:** This filters the **already city-filtered** array. Filters are **chained** (AND logic).

**Step 3: Filter by Search Query (Lines 114-121)**

```javascript
  if (searchQuery.trim()) {
    // .trim() removes spaces from start/end
    // If searchQuery has actual content (not empty/whitespace)
    
    filtered = filtered.filter(
      (worker) =>
        // Check if search query matches ANY of these fields:
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // Does worker name contain the search text?
        // .toLowerCase() makes it case-insensitive
        // "Arben" matches "arben", "ARBEN", "ArBeN"
        
        worker.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // Does category contain the search text?
        // User types "instal" → matches "Instalues"
        
        worker.city.toLowerCase().includes(searchQuery.toLowerCase())
        // Does city contain the search text?
        // User types "pris" → matches "Prishtinë"
    )
    // || means OR - matches if ANY field contains the search
  }
```

**Example Search Flow:**
- User types: "arben"
- Checks: name contains "arben"? → YES (Arben Krasniqi)
- Result: Shows Arben Krasniqi

- User types: "pris"
- Checks: name contains "pris"? → NO
- Checks: city contains "pris"? → YES (Prishtinë)
- Result: Shows all workers from Prishtinë

**Final Step: Update State (Line 123)**

```javascript
  setFilteredWorkers(filtered)
  // Update state with the final filtered array
  // React will re-render and show only these workers
}, [selectedCity, selectedCategory, searchQuery])
// Dependencies: re-run when any of these change
```

### **D. Display Logic (Lines 140-158)**

```javascript
// Line 141-143: Show count
{filteredWorkers.length} mjeshtër{filteredWorkers.length !== 1 ? 'ë' : ''} u gjetën
// Shows: "3 mjeshtërë u gjetën" (plural)
// Or: "1 mjeshtër u gjet" (singular)
```

```javascript
// Lines 144-158: Conditional rendering
{filteredWorkers.length > 0 ? (
  // If we have results:
  <div className={styles.grid}>
    {filteredWorkers.map((worker) => (
      <WorkerCard key={worker.id} worker={worker} />
      // Render each worker as a card
    ))}
  </div>
) : (
  // If no results:
  <div className={styles.noResults}>
    <p>Nuk u gjet asnjë mjeshtër me këto kritere.</p>
  </div>
)}
```

---

## 🎛️ **4. FILTER SIDEBAR LOGIC** (FilterSidebar.jsx)

This component **receives** state and **updates** it:

```javascript
// Lines 3-12: Component receives props
function FilterSidebar({
  cities,              // Array of city options
  categories,          // Array of category options
  selectedCity,        // Current selected city (from state)
  selectedCategory,    // Current selected category (from state)
  onCityChange,        // Function to update city (setSelectedCity)
  onCategoryChange,    // Function to update category (setSelectedCategory)
  searchQuery,         // Current search text (from state)
  onSearchChange,      // Function to update search (setSearchQuery)
})
```

**Search Input (Lines 17-26):**

```javascript
<input
  value={searchQuery}
  // Controlled input: value = current state
  onChange={(e) => onSearchChange(e.target.value)}
  // When user types, call onSearchChange (which is setSearchQuery)
  // This updates searchQuery state in WorkerList
  // Which triggers the filtering useEffect
/>
```

**City Select (Lines 28-41):**

```javascript
<select
  value={selectedCity}
  // Current selection = selectedCity state
  onChange={(e) => onCityChange(e.target.value)}
  // When user picks different city:
  // e.target.value = the selected option value
  // Calls onCityChange (which is setSelectedCity)
  // Updates selectedCity state
  // Triggers filtering useEffect
>
  {cities.map((city) => (
    <option key={city} value={city}>
      {city}
    </option>
  ))}
</select>
```

**Category Select (Lines 43-56):**
- Same logic as city select
- Updates `selectedCategory` state
- Triggers filtering

---

## 🔗 **COMPLETE FLOW EXAMPLE**

### Scenario: User clicks "Instalues" category

1. **CategoryGrid.jsx (Line 27):**
   ```javascript
   onClick={() => handleCategoryClick('plumber')}
   ```

2. **CategoryGrid.jsx (Line 16):**
   ```javascript
   navigate(`/workers?category=plumber`)
   ```
   - URL changes to `/workers?category=plumber`

3. **WorkerList.jsx (Line 76):**
   ```javascript
   const [searchParams] = useSearchParams()
   ```
   - React Router detects URL change

4. **WorkerList.jsx (Lines 83-101):**
   ```javascript
   useEffect(() => {
     const categoryParam = searchParams.get('category') // "plumber"
     const categoryMap = { plumber: 'Instalues' }
     setSelectedCategory('Instalues') // Updates state
   }, [searchParams])
   ```

5. **WorkerList.jsx (Lines 103-124):**
   ```javascript
   useEffect(() => {
     let filtered = [...allWorkers] // Start with all
     if (selectedCategory !== 'Të gjitha') {
       filtered = filtered.filter(w => w.category === 'Instalues')
     }
     setFilteredWorkers(filtered) // Update results
   }, [selectedCategory])
   ```

6. **WorkerList.jsx (Lines 144-152):**
   ```javascript
   {filteredWorkers.map((worker) => (
     <WorkerCard worker={worker} />
   ))}
   ```
   - React re-renders with filtered workers
   - Only "Instalues" workers shown

---

## 🧠 **KEY CONCEPTS**

### 1. **Controlled Components**
- Input values come from React state
- Changes update state, which updates UI
- Single source of truth

### 2. **URL as State**
- URL parameters are read on page load
- Allows bookmarking/sharing filtered views
- Back/forward buttons work correctly

### 3. **Chained Filtering**
- Filters apply sequentially (AND logic)
- Each filter narrows the previous result
- Order: City → Category → Search

### 4. **Case-Insensitive Search**
- `.toLowerCase()` on both sides
- "ARBEN" matches "arben"

### 5. **Multiple Field Search**
- Uses `||` (OR) operator
- Matches name OR category OR city
- Flexible search experience

---

## 🎯 **SUMMARY**

**Entry Points:**
- Category click → URL param → State update → Filter
- Search submit → URL param → State update → Filter  
- Sidebar change → State update → Filter

**Filtering Process:**
1. Start with all workers
2. Filter by city (if selected)
3. Filter by category (if selected)
4. Filter by search query (if provided)
5. Display results

**State Management:**
- URL parameters sync with component state
- State changes trigger filtering
- Filtered results update UI

This creates a **reactive, URL-aware filtering system** that works seamlessly across navigation and direct user interaction!
