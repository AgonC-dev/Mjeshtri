import { useNavigate } from "react-router-dom";
import styles from "./CategoryGrid.module.css";

const categories = [
  { id: 1, name: "Instalues", icon: "🔧", slug: "plumber", color: "#3b82f6" },
  {
    id: 2,
    name: "Elektricist",
    icon: "⚡",
    slug: "electrician",
    color: "#f59e0b",
  },
  { id: 3, name: "Klima / AC", icon: "❄️", slug: "hvac", color: "#06b6d4" },
  { id: 4, name: "Plastifikim", icon: "🧱", slug: "tiling", color: "#8b5cf6" },
  { id: 5, name: "Pastrim", icon: "🧹", slug: "cleaning", color: "#10b981" },
  { id: 6, name: "Më shumë", icon: "➜", slug: "all", color: "#0f172a" },
];

function CategoryGrid() {
  const navigate = useNavigate();

  const handleClick = (slug) => {
    navigate(`/workers?category=${slug}`);
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h2>Kategoritë kryesore</h2>
        <p>Zgjidh profesionin që të nevojitet</p>
      </div>

      <div className={styles.grid}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={styles.tile}
            onClick={() => handleClick(cat.slug)}
            style={{ "--accent": cat.color }}
          >
            <div className={styles.icon}>{cat.icon}</div>
            <span className={styles.label}>{cat.name}</span>
            <div className={styles.backgroundAccent}></div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;
