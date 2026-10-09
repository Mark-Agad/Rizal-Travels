import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BackNav, Navigation, PageTransition, Pin } from "@/components/journey";
import { countries, type Country } from "@/data/rizalTravelData";

export const Route = createFileRoute("/europe/")({
  head: () => ({
    meta: [
      { title: "Explore Rizal's Journey Through Europe" },
      { name: "description", content: "Choose a European country Rizal visited on his journey." },
      { property: "og:title", content: "Explore Rizal's Journey Through Europe" },
      { property: "og:description", content: "Choose a European country Rizal visited on his journey." },
    ],
  }),
  component: Europe,
});


function CountryCard({ country, index }: { country: Country; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
    >
      <Link
        to="/europe/$countryId"
        params={{ countryId: country.id }}
        className="group relative block bg-card p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl"
      >
        <Pin />
        <div className="mb-5 aspect-[4/3] overflow-hidden border border-border bg-muted">
          {country.image ? (
            <img
              src={country.image}
              alt={country.name}
              className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-xs italic tracking-widest text-muted-foreground/50">Image placeholder</span>
            </div>
          )}
        </div>
        <div className="mb-2 flex items-center gap-3">
          <span className="text-xl" aria-hidden="true">{country.flag}</span>
          <h3 className="font-display text-2xl text-card-foreground">{country.name}</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{country.shortDescription}</p>
        <div className="mt-5 flex justify-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary transition-transform group-hover:translate-x-1">
            View Journal →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// Faint dashed route threading behind the destination cards.
function RouteLine() {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-1/2 h-8 w-full -translate-y-1/2 opacity-30"
      viewBox="0 0 1000 40"
      fill="none"
      aria-hidden="true"
    >
      <path d="M50,20 Q250,5 500,20 T950,20" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
    </svg>
  );
}

function Europe() {
  return (
    <>
      <Navigation />
      <PageTransition>
        <div className="relative">
          <div className="paper-grain ink-stains pointer-events-none absolute -inset-x-8 -inset-y-12" aria-hidden="true" />

          <div className="relative">
            <BackNav to="/">Home</BackNav>

            <div className="mt-4 text-center">
              <div className="mb-4 flex items-center justify-center gap-4">
                <span className="h-px w-16 bg-foreground/30" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  An Interactive Historical Travel Experience
                </span>
                <span className="h-px w-16 bg-foreground/30" />
              </div>
              <h1 className="font-display text-6xl italic text-foreground">
                Explore Rizal's Journey Through Europe
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Select a destination on the map to open that chapter of the journal.
              </p>
            </div>

            <div className="relative mt-14 text-primary">
              <RouteLine />
              <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {countries.map((c, i) => (
                  <CountryCard key={c.id} country={c} index={i} />
                ))}
              </div>
            </div>

            <div className="mt-16 flex justify-center opacity-40" aria-hidden="true">
              <svg width="200" height="30" viewBox="0 0 200 30" fill="none">
                <path d="M10,15 L90,15 M110,15 L190,15 M100,5 L100,25" stroke="currentColor" strokeWidth="1" />
                <circle cx="100" cy="15" r="4" className="fill-primary" />
              </svg>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
}
