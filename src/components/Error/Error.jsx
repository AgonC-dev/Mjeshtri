import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import styles from "./Error.module.css";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  /* ---------------- SEO ---------------- */
  /* IMPORTANT: Page must still return HTTP 404 from router/server */
  /* This only controls indexing behavior */
  /* ----------------------------------- */
  const navigate = useNavigate()

  /* Mouse parallax */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [12, -12]);
  const rotateY = useTransform(mouseX, [-300, 300], [-12, 12]);

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  /* Mini-game state */
  const [score, setScore] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const movePixel = () => {
    setScore((s) => s + 1);
    setPos({
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
    });
  };

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>404 – Faqja nuk u gjet</title>
        <meta
          name="description"
          content="Faqja që po kërkoni nuk ekziston. Kthehuni në faqen kryesore për të vazhduar."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Background */}
      <div className={styles.background}>
        <span className={styles.orb}></span>
        <span className={styles.orb}></span>
        <span className={styles.orb}></span>
        <div className={styles.grid}></div>
        <div className={styles.scanlines}></div>
      </div>

      {/* Card */}
      <motion.div
        className={styles.card}
        style={{ rotateX, rotateY }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className={styles.glitch} data-text="404">
          404
        </h1>

        <p className={styles.subtitle}>Faqja nuk u gjet</p>
        <p className={styles.desc}>
          Duket se kjo faqe është humbur në një dimension tjetër.
        </p>

        {/* MINI GAME */}
        <div className={styles.game}>
          <p className={styles.gameTitle}>
            🎮 Kap pikselin e humbur
          </p>

          <div className={styles.gameArea}>
            <motion.div
              className={styles.pixel}
              onClick={movePixel}
              animate={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </div>

          <p className={styles.score}>
            Pikë: <strong>{score}</strong>
          </p>
        </div>

        <button
          className={styles.homeBtn}
          onClick={() => navigate('/')}
        >
          Kthehu në Fillim
        </button>
      </motion.div>
    </div>
  );
}
