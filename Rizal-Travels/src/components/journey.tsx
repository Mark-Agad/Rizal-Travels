import { Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import heroMap from "@/assets/hero-map.jpg";
import type { Country, Highlight, Place } from "@/data/rizalTravelData";

// ---------------------------------------------------------------
// Entrance animation presets.
// A parent <motion.div variants={stagger}> reveals its children in
// sequence; each child carries variants={rise}.
// ---------------------------------------------------------------
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

export const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

// ---------------------------------------------------------------
// Small vintage ornaments (all decorative, all aria-hidden).
// ---------------------------------------------------------------
export function Compass({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="26" />
      <circle cx="32" cy="32" r="19" strokeDasharray="2 4" />
      <path d="M32 6v52M6 32h52" opacity="0.45" />
      <path d="M32 11 38 32 32 53 26 32Z" fill="currentColor" stroke="none" opacity="0.7" />
      <path d="M11 32 32 26 53 32 32 38Z" fill="currentColor" stroke="none" opacity="0.35" />
    </svg>
  );
}

// Thin rule with a diamond in the middle — used under titles.
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-foreground/25" />
      <span className="h-1.5 w-1.5 rotate-45 border border-primary/70" />
      <span className="h-px flex-1 bg-foreground/25" />
    </div>
  );
}

// Deep-red map pin, sitting on a card's top-left corner.
export function Pin({ className = "absolute -top-3 -left-3 z-10 h-8 w-8 fill-current text-primary drop-shadow" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

// Perforated-edge postage stamp holding the country flag.
export function StampFlag({ flag, label }: { flag: string; label?: string }) {
  return (
    <div className="stamp w-24 px-3 py-3 -rotate-3" aria-hidden="true">
      <span className="text-3xl leading-none">{flag}</span>
      {label ? (
        <span className="font-label mt-2 block truncate text-[10px] uppercase tracking-[0.18em] text-primary">{label}</span>
      ) : null}
    </div>
  );
}

// Circular postmark ornament.
export function Postmark({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`postmark flex h-24 w-24 -rotate-12 items-center justify-center p-3 text-center ${className}`} aria-hidden="true">
      <span className="font-label text-[9px] uppercase leading-relaxed tracking-[0.16em] text-primary/80">{text}</span>
    </div>
  );
}

// Vintage photograph presentation: cream mat, sepia image, caption
// strip. Shows a framed placeholder (over faint map texture) until an
// image URL is added in the data file.
export function VintagePhoto({
  image,
  alt,
  height = "h-72",
}: {
  image?: string | undefined;
  alt: string;
  height?: string;
}) {
  return (
    <figure className="vintage-photo">
      <div className={`relative overflow-hidden bg-muted ${height}`}>
        {image ? (
          <img src={image} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <>
            <img src={heroMap} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale" />
            <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <Compass className="h-11 w-11 text-primary/50" />
              <span className="font-label text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Photograph forthcoming
              </span>
            </div>
          </>
        )}
      </div>
      <figcaption className="mt-3 flex items-center justify-between px-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span>Historical image</span>
        <span>{image ? "Archival print" : "Placeholder"}</span>
      </figcaption>
    </figure>
  );
}

// ---------------------------------------------------------------
// Chrome shared by every page.
// ---------------------------------------------------------------

// Journey trail: shows where the viewer is (Home › Europe › Country › Place).
export function Navigation({ country, place }: { country?: Country; place?: Place } = {}) {
  const sep = <span className="text-muted-foreground/50">›</span>;
  const cur = "text-primary font-semibold";
  const link = "text-muted-foreground hover:text-primary transition-colors";
  return (
    <header className="border-b border-border">
      <nav aria-label="Journey" className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
        <Link to="/" className="font-display text-2xl text-foreground">Rizal's Journey</Link>
        <ol className="flex items-center gap-3 text-sm uppercase tracking-widest">
          <li><Link to="/" activeOptions={{ exact: true }} className={link} activeProps={{ className: cur }}>Home</Link></li>
          <li>{sep}</li>
          <li><Link to="/europe" activeOptions={{ exact: true }} className={link} activeProps={{ className: cur }}>Europe</Link></li>
          {country && (<>
            <li>{sep}</li>
            <li>{place
              ? <Link to="/europe/$countryId" params={{ countryId: country.id }} className={link}>{country.name}</Link>
              : <span className={cur} aria-current="page">{country.name}</span>}</li>
          </>)}
          {country && place && (<>
            <li>{sep}</li>
            <li><span className={cur} aria-current="page">{place.name}</span></li>
          </>)}
        </ol>
      </nav>
    </header>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mx-auto max-w-6xl px-8 py-12"
    >
      {children}
    </motion.main>
  );
}

export function BackNav({ children, to, params }: { children: ReactNode; to: string; params?: Record<string, string> }) {
  return (
    <Link to={to as never} params={params as never} className="group mb-8 inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 text-sm uppercase tracking-widest text-muted-foreground transition hover:border-primary hover:text-primary">
      <span className="transition-transform group-hover:-translate-x-1">←</span> Back to {children}
    </Link>
  );
}

const cardCls = "group block rounded-sm border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg";

// Shows a dashed placeholder box until an image URL is filled in the data file.
export function ImageBox({ image, alt, className = "h-40" }: { image?: string | undefined; alt: string; className?: string }) {
  if (image) {
    return <img src={image} alt={alt} className={`w-full rounded-sm object-cover ${className}`} />;
  }
  return (
    <div className={`flex w-full items-center justify-center rounded-sm border-2 border-dashed border-border ${className}`}>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">Image placeholder</span>
    </div>
  );
}

export function CountryCard({ country, index }: { country: Country; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Link to="/europe/$countryId" params={{ countryId: country.id }} className={cardCls}>
        <ImageBox image={country.image} alt={country.name} />
        <p className="mt-4 text-xs uppercase tracking-widest text-primary">{country.flag}</p>
        <h3 className="mt-2 font-display text-3xl text-card-foreground">{country.name}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{country.shortDescription}</p>
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------
// Country page: the "arrival" entry and its place cards.
// ---------------------------------------------------------------

// Header panel for a country page — reads like the first page of a
// journal chapter: stamp, title, rule, introduction, framed image.
export function CountryHeader({ country }: { country: Country }) {
  const count = country.places.length;
  return (
    <header className="journal-frame relative px-8 py-9 sm:px-11 sm:py-11">
      <div className="map-grid paper-grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <motion.div variants={rise}>
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4 pt-3">
              <span className="h-px w-10 bg-primary/50" />
              <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">Journal Entry</p>
            </div>
            <StampFlag flag={country.flag} label={country.name} />
          </div>

          <h1 className="mt-6 font-display text-7xl leading-[0.92] text-foreground">{country.name}</h1>
          <Divider className="mt-7 max-w-xs" />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{country.shortDescription}</p>

          <p className="mt-8 text-[11px] uppercase tracking-[0.26em] text-muted-foreground/80">
            {count} {count === 1 ? "place" : "places"} in this chapter · placeholder entry
          </p>
        </motion.div>

        <motion.div variants={rise}>
          <VintagePhoto image={country.image} alt={`${country.name} — historical image`} />
        </motion.div>
      </div>

      <ArrivalLine />
    </header>
  );
}

// Dashed travel route that draws itself across the bottom of the
// arrival panel and ends on a pin — the "we have arrived" beat.
function ArrivalLine() {
  return (
    <div className="relative mt-10">
      <motion.div
        className="text-primary/55"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 1.5, delay: 0.75, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <svg className="h-6 w-full" viewBox="0 0 800 24" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M4,12 H796" stroke="currentColor" strokeWidth="1" strokeDasharray="5 9" strokeLinecap="round" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute -top-1 right-0"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.1, duration: 0.5, ease: "easeOut" }}
        aria-hidden="true"
      >
        <Pin className="h-6 w-6 fill-current text-primary" />
      </motion.div>
    </div>
  );
}

// Place card: numbered stop on the route, framed image, hover lift.
export function PlaceCard({ countryId, place, index }: { countryId: string; place: Place; index: number }) {
  const stop = String(index + 1).padStart(2, "0");
  const entries = place.highlights.length;
  return (
    <motion.div variants={rise}>
      <Link
        to="/europe/$countryId/$placeId"
        params={{ countryId, placeId: place.id }}
        className="journal-card group relative block px-6 py-7 hover:-translate-y-2"
      >
        <Pin className="absolute -top-3 -left-3 z-10 h-7 w-7 fill-current text-primary/80 drop-shadow transition-transform duration-500 group-hover:-translate-y-1" />

        <div className="relative mb-5 h-44 overflow-hidden border border-border bg-muted">
          {place.image ? (
            <img
              src={place.image}
              alt={place.name}
              className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
            />
          ) : (
            <>
              <img src={heroMap} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15 grayscale" />
              <div className="relative flex h-full items-center justify-center">
                <span className="font-label text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
                  Image placeholder
                </span>
              </div>
            </>
          )}
        </div>

        <p className="font-label text-[10px] uppercase tracking-[0.26em] text-primary">Stop {stop}</p>
        <h3 className="mt-2 font-display text-3xl text-card-foreground">{place.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{place.shortDescription}</p>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            {entries} {entries === 1 ? "entry" : "entries"}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary transition-transform duration-300 group-hover:translate-x-1">
            Read the journal →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------
// Place page: journal header + scroll-revealed timeline.
// ---------------------------------------------------------------

// Header panel for a place page — the journal entry for one stop:
// location name, country, introduction, framed historical image.
export function PlaceHeader({
  country,
  place,
  stop,
  total,
}: {
  country: Country;
  place: Place;
  stop?: number;
  total?: number;
}) {
  const entries = place.highlights.length;
  return (
    <header className="journal-frame relative px-8 py-9 sm:px-11 sm:py-11">
      <div className="map-grid paper-grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <motion.div variants={rise}>
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4 pt-3">
              <span className="h-px w-10 bg-primary/50" />
              <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">
                {country.name} · {country.flag}
              </p>
            </div>
            <Postmark text={place.name} />
          </div>

          <h2 id={`place-${place.id}-title`} className="mt-6 font-display text-7xl leading-[0.92] text-foreground">{place.name}</h2>
          <Divider className="mt-7 max-w-xs" />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{place.shortDescription}</p>

          <p className="mt-8 text-[11px] uppercase tracking-[0.26em] text-muted-foreground/80">
            {stop && total ? `Stop ${String(stop).padStart(2, "0")} of ${String(total).padStart(2, "0")} · ` : ""}
            {entries} {entries === 1 ? "entry" : "entries"} in this journal · placeholder content
          </p>
        </motion.div>

        <motion.div variants={rise}>
          <VintagePhoto image={place.image} alt={`${place.name} — historical image`} />
        </motion.div>
      </div>
    </header>
  );
}

// One timeline entry: a paper card hanging off the ink line with the
// title, description and a framed image (placeholder until one is added
// in the data file). On phones the year sits inside the card; on
// desktop it is set large on the opposite side of the line instead.
export function HighlightCard({ highlight, year }: { highlight: Highlight; year: string }) {
  return (
    <article className="journal-card relative px-6 py-6 sm:px-8 sm:py-7">
      <p className="font-display text-5xl leading-none text-primary md:hidden">{year}</p>
      <span className="stamp mt-4 px-3 py-1.5 font-label text-xs uppercase tracking-[0.16em] text-primary md:mt-0">
        {highlight.category}
      </span>
      <h4 className="mt-4 font-display text-3xl leading-tight text-card-foreground sm:text-4xl">{highlight.title}</h4>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground sm:text-xl">{highlight.description}</p>
      <div className="mt-6">
        <VintagePhoto image={highlight.image} alt={highlight.title} height="h-56" />
      </div>
    </article>
  );
}

// Vertical timeline for ONE location. Desktop: a thin dashed ink line
// down the centre, a marker per entry, cards alternating left/right and
// the year set large on the opposite side. Mobile: the line moves to the
// left edge and every card sits on the right of it (single-sided).
// Entries fade in as they scroll into view; the page-level MotionConfig
// turns the movement off for viewers who prefer reduced motion.
export function Timeline({ highlights, label }: { highlights: Highlight[]; label: string }) {
  return (
    <ol className="relative" aria-label={label}>
      <span
        className="pointer-events-none absolute bottom-0 left-4 top-0 border-l border-dashed border-primary/45 md:left-1/2"
        aria-hidden="true"
      />
      {highlights.map((h, i) => {
        const cardOnLeft = i % 2 === 0;
        const year = h.year?.trim() || "Date to be added";
        return (
          <motion.li
            key={h.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative pb-14 pl-12 last:pb-0 md:grid md:grid-cols-[1fr_4rem_1fr] md:pl-0"
          >
            {/* marker on the line */}
            <span
              className="absolute left-4 top-9 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-primary bg-background md:left-1/2"
              aria-hidden="true"
            />
            <span
              className="absolute left-4 top-[1.9rem] h-[1.625rem] w-[1.625rem] -translate-x-1/2 rounded-full border border-primary/30 md:left-1/2"
              aria-hidden="true"
            />

            {/* card */}
            <div
              className={
                cardOnLeft
                  ? "relative md:col-start-1 md:row-start-1"
                  : "relative md:col-start-3 md:row-start-1"
              }
            >
              <span
                className={
                  cardOnLeft
                    ? "absolute -left-8 top-11 h-px w-8 bg-primary/45 md:left-auto md:-right-8"
                    : "absolute -left-8 top-11 h-px w-8 bg-primary/45"
                }
                aria-hidden="true"
              />
              <HighlightCard highlight={h} year={year} />
            </div>

            {/* desktop year marker, opposite the card */}
            <p
              className={
                cardOnLeft
                  ? "hidden pl-4 pt-6 font-display text-5xl leading-tight text-primary md:col-start-3 md:row-start-1 md:block lg:text-6xl"
                  : "hidden pr-4 pt-6 text-right font-display text-5xl leading-tight text-primary md:col-start-1 md:row-start-1 md:block lg:text-6xl"
              }
              aria-hidden="true"
            >
              {year}
            </p>
          </motion.li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------
// Country page: location shortcuts + continuous location sections.
// ---------------------------------------------------------------

export const placeAnchor = (placeId: string) => `place-${placeId}`;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Smoothly scrolls to an element on the same page (instant if the
// viewer has asked their system for reduced motion).
function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

// Tracks which section the viewer is reading: the last section whose
// top edge has passed ~40% of the way down the screen. null = still
// above the first section (the country overview).
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const id of key.split("|")) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);
  return active;
}

// Sticky row of location buttons. Stays at the top of the screen while
// scrolling so the presenter can jump to any location at any time.
export function PlaceShortcuts({ places }: { places: Place[] }) {
  const active = useActiveSection(places.map((p) => placeAnchor(p.id)));
  const base =
    "group inline-flex shrink-0 items-center gap-3 rounded-sm border px-4 py-2 text-sm uppercase tracking-widest transition";
  const idle = "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary hover:text-primary";
  const on = "border-primary bg-primary text-primary-foreground shadow";
  return (
    <motion.div
      variants={rise}
      className="sticky top-0 z-30 -mx-8 mt-8 border-y border-border bg-background/90 px-8 py-3 backdrop-blur"
    >
      <nav aria-label="Locations in this country" className="flex items-center gap-3 overflow-x-auto">
        <span className="font-label hidden shrink-0 text-[11px] uppercase tracking-[0.26em] text-muted-foreground/80 sm:block">
          Jump to
        </span>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
          }}
          className={`${base} ${active === null ? on : idle}`}
          aria-current={active === null ? "location" : undefined}
        >
          Overview
        </a>
        {places.map((p, i) => {
          const id = placeAnchor(p.id);
          const isActive = active === id;
          return (
            <a
              key={p.id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(id);
              }}
              className={`${base} ${isActive ? on : idle}`}
              aria-current={isActive ? "location" : undefined}
            >
              <span className="font-label text-[10px] tracking-[0.2em] opacity-70">{String(i + 1).padStart(2, "0")}</span>
              {p.name}
            </a>
          );
        })}
      </nav>
    </motion.div>
  );
}

// One location on the country page: its journal header followed by its
// historical highlights timeline. Reveals as it scrolls into view.
export function PlaceSection({
  country,
  place,
  index,
  total,
}: {
  country: Country;
  place: Place;
  index: number;
  total: number;
}) {
  return (
    <motion.section
      id={placeAnchor(place.id)}
      aria-labelledby={`place-${place.id}-title`}
      className="scroll-mt-24 pt-20 md:pt-28"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      {index > 0 && <SectionRoute />}

      <PlaceHeader country={country} place={place} stop={index + 1} total={total} />

      <motion.div variants={rise} className="mt-16">
        <div className="flex items-center gap-4">
          <Compass className="h-9 w-9 shrink-0 text-primary/60" />
          <div>
            <p className="font-label text-sm uppercase tracking-[0.28em] text-primary">Timeline</p>
            <h3 id={`place-${place.id}-timeline`} className="font-display text-4xl text-foreground sm:text-5xl">
              {place.name}: Historical Timeline
            </h3>
          </div>
        </div>
        <Divider className="mt-5 max-w-md" />
        <p className="mt-4 max-w-2xl text-base uppercase tracking-[0.18em] text-muted-foreground">
          Entries from the journal · scroll to read them in order
        </p>
      </motion.div>

      <div className="mt-14">
        <Timeline highlights={place.highlights} label={`${place.name} historical timeline`} />
      </div>
    </motion.section>
  );
}

// Short dashed route with a pin, linking one location to the next.
function SectionRoute() {
  return (
    <div className="-mt-8 mb-8 flex flex-col items-center text-primary/55" aria-hidden="true">
      <span className="h-12 border-l border-dashed border-current" />
      <Pin className="h-6 w-6 fill-current" />
    </div>
  );
}
