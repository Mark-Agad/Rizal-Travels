import { Link, useNavigate } from "@tanstack/react-router";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { countries, type Country, type Highlight, type Place } from "@/data/rizalTravelData";
import { WaxSeal, chapterNumeral } from "@/components/journey-map";

// Page widths. Reading pages use `wrap`; the map page uses `wrapWide`.
export const wrap = "mx-auto w-full max-w-6xl px-6 sm:px-8";
export const wrapWide = "mx-auto w-full max-w-[88rem] px-6 sm:px-8";

// ---------------------------------------------------------------
// Entrance animation presets (used once per page, when it opens).
// A parent <motion.div variants={stagger}> reveals its children in
// sequence; each child carries variants={rise}.
// ---------------------------------------------------------------
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function Compass({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="26" />
      <circle cx="32" cy="32" r="19" strokeDasharray="2 4" />
      <path d="M32 6v52M6 32h52" opacity="0.45" />
      <path d="M32 11 38 32 32 53 26 32Z" fill="currentColor" stroke="none" opacity="0.7" />
      <path d="M11 32 32 26 53 32 32 38Z" fill="currentColor" stroke="none" opacity="0.35" />
    </svg>
  );
}

// ---------------------------------------------------------------
// Chrome shared by every page.
// ---------------------------------------------------------------

// Journey trail: shows where the viewer is (Home › Europe › Country).
export function Navigation({ country, wide = false }: { country?: Country; wide?: boolean } = {}) {
  const sep = (
    <span className="text-muted-foreground/60" aria-hidden="true">
      ›
    </span>
  );
  const cur = "font-semibold text-primary";
  const link = "text-muted-foreground transition-colors hover:text-primary";
  return (
    <header className="border-b border-border bg-background">
      <nav
        aria-label="Journey"
        className={`${wide ? wrapWide : wrap} flex items-center justify-between gap-6 py-4`}
      >
        <Link to="/" className="font-display text-3xl font-semibold text-foreground">
          Rizal's Journey
        </Link>
        <ol className="flex items-center gap-3 text-base">
          <li>
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className={link}
              activeProps={{ className: cur }}
            >
              Home
            </Link>
          </li>
          <li>{sep}</li>
          <li>
            <Link
              to="/europe"
              activeOptions={{ exact: true }}
              className={link}
              activeProps={{ className: cur }}
            >
              Europe
            </Link>
          </li>
          {country && (
            <>
              <li>{sep}</li>
              <li>
                <span className={cur} aria-current="page">
                  {country.name}
                </span>
              </li>
            </>
          )}
        </ol>
      </nav>
    </header>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.main>
  );
}

// Thin bar along the top edge that fills as the page is read.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-primary"
      aria-hidden="true"
    />
  );
}

// ←/→ move between chapters. Past the first or last chapter they go back to the map.
export function useChapterKeys(countryId: string) {
  const navigate = useNavigate();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (document.querySelector('[role="dialog"]')) return; // photo viewer is open
      const i = countries.findIndex((c) => c.id === countryId);
      const target = countries[i + (e.key === "ArrowRight" ? 1 : -1)];
      if (target) navigate({ to: "/europe/$countryId", params: { countryId: target.id } });
      else navigate({ to: "/europe" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [countryId, navigate]);
}

// ---------------------------------------------------------------
// Photos: one treatment everywhere, click to enlarge.
// ---------------------------------------------------------------
export function Photo({
  image,
  alt,
  className = "aspect-[4/3]",
}: {
  image?: string | undefined;
  alt: string;
  className?: string;
}) {
  if (!image) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-sm bg-secondary text-muted-foreground ${className}`}
      >
        <Compass className="h-10 w-10 text-primary/50" />
        <span className="text-base">Photo to be added</span>
      </div>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Enlarge photo: ${alt}`}
          className={`photo group relative block w-full cursor-zoom-in overflow-hidden rounded-sm bg-muted ${className}`}
        >
          <img src={image} alt={alt} className="h-full w-full object-cover" />
          <span className="absolute bottom-2 right-2 rounded-sm bg-night/85 p-2 text-night-foreground opacity-80 transition-opacity group-hover:opacity-100">
            <Expand className="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-[min(94vw,1200px)] gap-3 border-0 bg-night p-3 text-night-foreground sm:rounded-md"
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="photo">
          <img src={image} alt={alt} className="max-h-[80vh] w-full object-contain" />
        </div>
        <p className="px-1 pb-1 text-xl">{alt}</p>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------
// Country page
// ---------------------------------------------------------------

// The journey in order, with the current country marked. Each name is a link.
function RouteStrip({ current }: { current: string }) {
  return (
    <nav aria-label="Route through Europe" className="mt-10">
      <ol className="flex flex-wrap items-center gap-y-3">
        {countries.map((c, i) => {
          const here = c.id === current;
          return (
            <li key={c.id} className="flex items-center">
              {i > 0 && (
                <span className="mx-2 h-px w-6 bg-night-foreground/35" aria-hidden="true" />
              )}
              <Link
                to="/europe/$countryId"
                params={{ countryId: c.id }}
                aria-current={here ? "page" : undefined}
                className={`rounded-full px-4 py-1.5 text-lg transition-colors ${
                  here
                    ? "bg-brass font-semibold text-night"
                    : "border border-night-foreground/35 text-night-foreground hover:border-brass hover:text-brass"
                }`}
              >
                {c.name}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Chapter opener: dark band with the country name, introduction and image.
export function CountryHeader({ country }: { country: Country }) {
  const index = countries.findIndex((c) => c.id === country.id);
  return (
    <section className="on-night bg-night text-night-foreground">
      <div
        className={`${wrap} grid gap-10 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20`}
      >
        <motion.div variants={rise}>
          <div className="flex items-center gap-4">
            <WaxSeal label={chapterNumeral(index)} className="h-14 w-14 text-primary-foreground" />
            <p className="text-xl font-semibold text-brass">
              Chapter {chapterNumeral(index)} of {chapterNumeral(countries.length - 1)}
            </p>
          </div>
          <h1 className="mt-6 font-display text-7xl font-semibold leading-none sm:text-8xl">
            {country.name}
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-night-foreground/85">
            {country.shortDescription}
          </p>
          <RouteStrip current={country.id} />
        </motion.div>

        <motion.div variants={rise} className="rounded-sm bg-card p-2 shadow-2xl sm:p-3">
          <Photo image={country.image} alt={`${country.name}: historical image`} />
        </motion.div>
      </div>
    </section>
  );
}

export const placeAnchor = (placeId: string) => `place-${placeId}`;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

// Tracks which section the viewer is reading: the last section whose top edge has
// passed ~40% of the way down the screen. null = still in the country opener.
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

// Sticky bar: back to the map, plus a jump button for every place in this country.
export function PlaceShortcuts({ places }: { places: Place[] }) {
  const active = useActiveSection(places.map((p) => placeAnchor(p.id)));
  const base =
    "inline-flex shrink-0 items-center rounded-full px-4 py-2 text-base font-medium transition-colors";
  const idle = "text-foreground/75 hover:bg-secondary hover:text-primary";
  const on = "bg-primary text-primary-foreground";
  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <nav
        aria-label="Places in this country"
        className={`${wrap} flex items-center gap-2 overflow-x-auto py-2.5`}
      >
        <Link
          to="/europe"
          className="group mr-2 inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2 text-base font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Map
        </Link>
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
        {places.map((p) => {
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
              {p.name}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

// One place: header (name, summary, visit dates, photo) followed by its timeline.
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
    <section
      id={placeAnchor(place.id)}
      aria-labelledby={`place-${place.id}-title`}
      className={`scroll-mt-14 ${index > 0 ? "border-t border-border" : ""}`}
    >
      <div className={`${wrap} py-16 md:py-24`}>
        <header className="grid gap-8 md:grid-cols-[1fr_22rem] md:items-end lg:grid-cols-[1fr_26rem] lg:gap-14">
          <div>
            <p className="text-lg font-semibold text-primary">
              {total > 1 ? `Stop ${index + 1} of ${total} in ${country.name}` : country.name}
            </p>
            <h2
              id={`place-${place.id}-title`}
              className="mt-2 font-display text-6xl font-semibold leading-none text-foreground md:text-7xl"
            >
              {place.name}
            </h2>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">
              {place.shortDescription}
            </p>

            {place.visits && place.visits.length > 0 && (
              <div className="mt-8">
                <p className="text-base font-semibold text-muted-foreground">
                  {place.visits.length > 1 ? "Visits" : "Visit"}
                </p>
                <ul className="mt-2 flex flex-wrap gap-3">
                  {place.visits.map((v) => (
                    <li
                      key={v}
                      className="rounded-md border border-primary/40 bg-card px-4 py-2 text-lg font-medium text-primary"
                    >
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-sm bg-card p-2 shadow-lg ring-1 ring-foreground/10">
            <Photo image={place.image} alt={`${place.name}: historical image`} />
          </div>
        </header>

        <h3 className="mt-16 font-display text-4xl font-semibold text-foreground md:mt-20">
          Timeline
        </h3>
        <div className="mt-10">
          <Timeline highlights={place.highlights} label={`${place.name} timeline`} />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------
// Timeline: year on the left, a line that fills in as you scroll,
// and one card per event. Single-sided, so long dates always fit.
// ---------------------------------------------------------------
function TimelineEntry({ highlight }: { highlight: Highlight }) {
  const year = highlight.year?.trim() || "Date to be added";
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative pb-12 pl-10 last:pb-0 md:grid md:grid-cols-[10rem_2rem_1fr] md:pl-0 lg:grid-cols-[12rem_3rem_1fr]"
    >
      {/* year (desktop) */}
      <p className="hidden pt-5 pr-2 text-right font-display text-3xl font-semibold leading-tight text-primary md:block">
        {year}
      </p>

      {/* dot on the line */}
      <span
        className="absolute left-3 top-6 h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-primary bg-background md:hidden"
        aria-hidden="true"
      />
      <span className="hidden justify-center pt-[1.65rem] md:flex" aria-hidden="true">
        <span className="relative z-10 h-4 w-4 rounded-full border-[3px] border-primary bg-background" />
      </span>

      {/* card */}
      <article className="overflow-hidden rounded-md bg-card shadow-sm ring-1 ring-foreground/10 xl:grid xl:grid-cols-[20rem_1fr]">
        <div className="p-2 xl:p-3">
          <Photo
            image={highlight.image}
            alt={highlight.title}
            className="aspect-[16/10] xl:h-full xl:min-h-60 xl:aspect-auto"
          />
        </div>
        <div className="p-6 xl:py-8 xl:pl-4 xl:pr-8">
          <p className="font-display text-2xl font-semibold text-primary md:hidden">{year}</p>
          <p className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-base font-medium text-primary md:mt-0">
            {highlight.category}
          </p>
          <h4 className="mt-3 font-display text-3xl font-semibold leading-tight text-card-foreground lg:text-4xl">
            {highlight.title}
          </h4>
          <p className="mt-3 text-xl leading-8 text-foreground/80">{highlight.description}</p>
        </div>
      </article>
    </motion.li>
  );
}

export function Timeline({ highlights, label }: { highlights: Highlight[]; label: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const lineCls =
    "pointer-events-none absolute bottom-0 top-0 left-3 w-0.5 -translate-x-1/2 md:left-[11rem] lg:left-[13.5rem]";
  return (
    <ol ref={ref} className="relative" aria-label={label}>
      <span className={`${lineCls} bg-primary/20`} aria-hidden="true" />
      <motion.span
        className={`${lineCls} origin-top bg-primary`}
        style={{ scaleY: fill }}
        aria-hidden="true"
      />
      {highlights.map((h) => (
        <TimelineEntry key={h.id} highlight={h} />
      ))}
    </ol>
  );
}

// Bottom of a country page: previous and next chapter.
export function ChapterPager({ countryId }: { countryId: string }) {
  const i = countries.findIndex((c) => c.id === countryId);
  const prev = countries[i - 1];
  const next = countries[i + 1];
  const card =
    "group flex items-center gap-5 rounded-md border border-border bg-card px-6 py-6 transition-colors hover:border-primary";
  return (
    <nav aria-label="Chapters" className="border-t border-border bg-secondary/60">
      <div className={`${wrap} grid gap-5 py-12 md:grid-cols-2`}>
        {prev ? (
          <Link to="/europe/$countryId" params={{ countryId: prev.id }} className={card}>
            <ArrowLeft
              className="h-6 w-6 shrink-0 text-primary transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span>
              <span className="block text-base text-muted-foreground">Previous chapter</span>
              <span className="block font-display text-4xl font-semibold text-foreground">
                {prev.name}
              </span>
            </span>
          </Link>
        ) : (
          <Link to="/europe" className={card}>
            <ArrowLeft
              className="h-6 w-6 shrink-0 text-primary transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span>
              <span className="block text-base text-muted-foreground">Start of the journey</span>
              <span className="block font-display text-4xl font-semibold text-foreground">
                Back to the map
              </span>
            </span>
          </Link>
        )}
        {next ? (
          <Link
            to="/europe/$countryId"
            params={{ countryId: next.id }}
            className={`${card} justify-between bg-night text-night-foreground hover:border-brass`}
          >
            <span>
              <span className="block text-base text-night-foreground/75">Next chapter</span>
              <span className="block font-display text-4xl font-semibold">{next.name}</span>
            </span>
            <ArrowRight
              className="h-6 w-6 shrink-0 text-brass transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        ) : (
          <Link
            to="/europe"
            className={`${card} justify-between bg-night text-night-foreground hover:border-brass`}
          >
            <span>
              <span className="block text-base text-night-foreground/75">End of the journey</span>
              <span className="block font-display text-4xl font-semibold">Back to the map</span>
            </span>
            <ArrowRight
              className="h-6 w-6 shrink-0 text-brass transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>
    </nav>
  );
}
