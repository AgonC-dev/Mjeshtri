import styles from './Hero.module.css';
import searchIcon from '../../assets/Icon.png';
import Workers from '../../assets/workers.png'
import { useEffect, useState } from 'react';

const words = [
  { text: "mjeshtër", color: '#0004FF'},
  { text: "mekanik", color: '#51C6D3'},
  { text: 'elektricist', color: '#0004FF'},
  { text: 'moler', color: '#51C6D3'},
]

function Hero({ onSearch, searchQuery, setSearchQuery }) {
const [ index, setIndex ] = useState(0);
const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  
useEffect(() => {
    const currentWord = words[index].text;
    
    const handleTyping = () => {
      if (!isDeleting) {
        // Typing logic
        setDisplayText(currentWord.substring(0, displayText.length + 1));
         // Inside handleTyping logic for !isDeleting
        const humanTypingSpeed = Math.floor(Math.random() * (150 - 80 + 1)) + 80;
        setSpeed(humanTypingSpeed);// Speed of typing

        if (displayText === currentWord) {
          setSpeed(1000); // Pause at the end
          setIsDeleting(true);
        }
      } else {
        // Deleting logic
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        setSpeed(75); // Speed of deleting (usually faster)

        if (displayText === '') {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index, speed]);

  

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>
         A po t'duhet një <span className={styles.typewriter} style={{ color: words[index].color }}>
            {displayText} ?
          </span>
        </h1>
        <p className={styles.subtitle}>
          Zgjidhja ideale për çdo nevojë të shtëpisë apo biznesit tuaj. Gjeni mjeshtrin e duhur dhe kryeni punën shpejt e sigurt.
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
            <img src={searchIcon} alt='search button' />
          </button>
        </form>
      </div>
      <div className={styles.imageCon}>
        <img src={Workers} alt='workers photo' className={styles.workerImage}/>
      </div>
    </section>
  )
}

export default Hero
