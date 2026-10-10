import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BackNav, Navigation, PageTransition } from "@/components/journey";
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

// ---------------------------------------------------------------
// MAP SETTINGS: the map picture lives in the /public folder.
// MAP_CROP says which part of the picture to show (in pixels of the
// original picture). Pin positions in rizalTravelData.ts are
// percentages of THIS cropped area.
// ---------------------------------------------------------------
const MAP_IMAGE = "/europe-map.jpg";
const MAP_IMAGE_SIZE = { width: 1376, height: 768 };
const MAP_CROP = { x: 400, y: 320, width: 600, height: 350 };

const mapImageStyle = {
  position: "absolute" as const,
  maxWidth: "none",
  width: `${(MAP_IMAGE_SIZE.width / MAP_CROP.width) * 100}%`,
  left: `${(-MAP_CROP.x / MAP_CROP.width) * 100}%`,
  top: `${(-MAP_CROP.y / MAP_CROP.height) * 100}%`,
};

// Softly fades the paper-grain layer into the page so it has no hard edges.
const grainFade = "radial-gradient(ellipse closest-side, #000 65%, transparent 100%)";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const chapterNumeral = (index: number) => ROMAN[index] ?? String(index + 1);

type ActivateFn = (id: string | null) => void;

// Wax seal drawn in code (no image needed). Used on the map pins and
// on the card corners so each pin visibly belongs to its card.
function WaxSeal({ label, className = "h-11 w-11" }: { label: string; className?: string }) {
  const points = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    const r = 21 + 1.4 * Math.sin(a * 7) + 0.8 * Math.sin(a * 13 + 1);
    return `${(24 + r * Math.cos(a)).toFixed(2)},${(24 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <polygon points={points} className="fill-primary" />
      <circle cx="24" cy="24" r="15" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1" />
      <ellipse cx="17" cy="15" rx="7" ry="3.5" fill="#fff" opacity="0.12" transform="rotate(-30 17 15)" />
      <text
        x="24"
        y="25"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize={label.length > 2 ? 10 : 14}
        fontWeight="600"
        className="font-display"
      >
        {label}
      </text>
    </svg>
  );
}

function CountryCard({
  country,
  index,
  active,
  onActivate,
}: {
  country: Country;
  index: number;
  active: boolean;
  onActivate: ActivateFn;
}) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
    >
      <Link
        to="/europe/$countryId"
        params={{ countryId: country.id }}
        onMouseEnter={() => onActivate(country.id)}
        onMouseLeave={() => onActivate(null)}
        onFocus={() => onActivate(country.id)}
        onBlur={() => onActivate(null)}
        className={`group relative flex h-full flex-col border bg-card/90 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl ${
          active ? "-translate-y-2 border-primary/50 shadow-xl" : "border-foreground/20 shadow-sm"
        }`}
      >
        {/* thin inner rule, like a bound book page */}
        <span className="pointer-events-none absolute inset-1.5 border border-primary/25" aria-hidden="true" />

        <WaxSeal
          label={chapterNumeral(index)}
          className="absolute -left-3 -top-3 z-10 h-11 w-11 text-primary-foreground drop-shadow-md transition-transform duration-500 group-hover:scale-110"
        />

        <figure className="vintage-photo mb-5">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            {country.image ? (
              <img
                src={country.image}
                alt={country.name}
                className="h-full w-full object-cover"
                style={{ filter: "sepia(0.7) contrast(1.05)" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-xs italic tracking-widest text-muted-foreground/50">Image placeholder</span>
              </div>
            )}
          </div>
        </figure>

        <p className="font-label text-[11px] uppercase tracking-[0.26em] text-primary">
          Chapter {chapterNumeral(index)}
        </p>
        <h3 className="mt-1 font-display text-3xl text-card-foreground">{country.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{country.shortDescription}</p>

        <div className="mt-auto flex justify-end pt-6">
          <span
            className={`inline-flex items-center gap-2 border border-primary/60 px-4 py-1.5 font-label text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground ${
              active ? "bg-primary text-primary-foreground" : "text-primary"
            }`}
          >
            View Journal <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// One wax-seal pin on the map. Hovering it lights up its card (and
// hovering the card lights up the pin). Clicking opens the country.
function MapPin({
  country,
  index,
  active,
  onActivate,
}: {
  country: Country;
  index: number;
  active: boolean;
  onActivate: ActivateFn;
}) {
  const pos = country.mapPosition;
  if (!pos) return null;
  return (
    <Link
      to="/europe/$countryId"
      params={{ countryId: country.id }}
      aria-label={`Open the journal for ${country.name}`}
      onMouseEnter={() => onActivate(country.id)}
      onMouseLeave={() => onActivate(null)}
      onFocus={() => onActivate(country.id)}
      onBlur={() => onActivate(null)}
      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ${
        active ? "z-20 scale-110" : "z-10"
      }`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      <WaxSeal label={chapterNumeral(index)} className="h-11 w-11 text-primary-foreground drop-shadow-md" />
      <span
        className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap border px-2 py-0.5 font-label text-[10px] uppercase tracking-[0.2em] transition-colors ${
          active ? "border-primary bg-primary text-primary-foreground" : "border-primary/30 bg-card/90 text-foreground"
        }`}
      >
        {country.name}
      </span>
    </Link>
  );
}

// The cropped vintage map with a dashed route (in the same order as
// the countries in rizalTravelData.ts) and one pin per country.
// Hidden on phones, where the cards below do the job.
function JourneyMap({ activeId, onActivate }: { activeId: string | null; onActivate: ActivateFn }) {
  const routePoints = countries.flatMap((c) => (c.mapPosition ? [`${c.mapPosition.x},${c.mapPosition.y}`] : []));
  return (
    <div className="journal-frame mx-auto mt-12 hidden max-w-4xl p-4 md:block">
      <div className="relative overflow-hidden" style={{ aspectRatio: `${MAP_CROP.width} / ${MAP_CROP.height}` }}>
        <img src={MAP_IMAGE} alt="" aria-hidden="true" style={mapImageStyle} />

        {routePoints.length > 1 && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full text-primary/60"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polyline
              points={routePoints.join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="5 7"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}

        {countries.map((c, i) => (
          <MapPin key={c.id} country={c} index={i} active={activeId === c.id} onActivate={onActivate} />
        ))}
      </div>
    </div>
  );
}

function Europe() {
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <>
      <Navigation />
      <PageTransition>
        <div className="relative">
          <div
            className="pointer-events-none absolute -inset-x-8 -inset-y-12"
            style={{ WebkitMaskImage: grainFade, maskImage: grainFade }}
            aria-hidden="true"
          >
            <div className="paper-grain ink-stains absolute inset-0" />
          </div>

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
              <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-foreground/80">
                Select a destination on the map to open that chapter of the journal.
              </p>
            </div>

            <JourneyMap activeId={activeId} onActivate={setActiveId} />

            <div className="relative mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {countries.map((c, i) => (
                <CountryCard key={c.id} country={c} index={i} active={activeId === c.id} onActivate={setActiveId} />
              ))}
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