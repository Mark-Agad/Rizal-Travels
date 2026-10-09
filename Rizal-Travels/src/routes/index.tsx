import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import heroMap from "@/assets/hero-map.jpg";
import { Navigation } from "@/components/journey";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rizal's Journey Through Europe" },
      { name: "description", content: "An interactive look at José Rizal's travels across Europe." },
      { property: "og:title", content: "Rizal's Journey Through Europe" },
      { property: "og:description", content: "An interactive look at José Rizal's travels across Europe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

// Faint dashed route across the map: Madrid → Paris → Brussels → Berlin.
function HeroRoute() {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 1 }}
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <motion.path
        d="M 480 850 C 600 660, 700 520, 870 420 S 960 340, 1000 300 S 1350 220, 1450 180"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeDasharray="1 14"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, delay: 1.2, ease: "easeInOut" }}
      />
      {[
        [480, 850],
        [870, 420],
        [1000, 300],
        [1450, 180],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="6"
          fill="currentColor"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4 + i * 0.7, duration: 0.4 }}
        />
      ))}
    </motion.svg>
  );
}

function Home() {
  return (
    <>
      <Navigation />
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <section className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden text-center">
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src={heroMap}
              alt=""
              width={1920}
              height={1080}
              className="hero-drift h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/80" />
          </div>

          <div className="absolute inset-0 text-foreground/20" aria-hidden="true">
            <HeroRoute />
          </div>

          <div className="relative z-10 px-8 py-16">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center justify-center gap-4"
            >
              <span className="h-px w-12 bg-primary/50" />
              <p className="text-xs uppercase tracking-[0.35em] text-primary">An interactive historical travel experience</p>
              <span className="h-px w-12 bg-primary/50" />
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 font-display text-7xl leading-tight text-foreground drop-shadow-sm"
            >
              Rizal's Journey
              <br />
              <em>Through Europe</em>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
            >
              Open the journal and follow José Rizal across the cities and countries
              of Europe that shaped his ideas — one place, one story at a time.
            </motion.p>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.55 }}>
              <Link
                to="/europe"
                className="group mt-10 inline-flex items-center gap-3 rounded-sm bg-primary px-10 py-4 text-sm uppercase tracking-widest text-primary-foreground shadow-lg transition hover:bg-primary/90"
              >
                Begin the Journey
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-10 text-xs uppercase tracking-[0.3em] text-muted-foreground"
            >
              Spain · France · Belgium · Germany
            </motion.p>
          </div>
        </section>
      </motion.main>
    </>
  );
}
