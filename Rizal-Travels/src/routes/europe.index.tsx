import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { JourneyMap, WaxSeal, chapterNumeral } from "@/components/journey-map";
import { Navigation, PageTransition, wrapWide } from "@/components/journey";
import { countries, type Country } from "@/data/rizalTravelData";

export const Route = createFileRoute("/europe/")({
  head: () => ({
    meta: [
      { title: "Explore Rizal's Journey Through Europe" },
      { name: "description", content: "Choose a European country Rizal visited on his journey." },
      { property: "og:title", content: "Explore Rizal's Journey Through Europe" },
      {
        property: "og:description",
        content: "Choose a European country Rizal visited on his journey.",
      },
    ],
  }),
  component: Europe,
});

// Preview of the selected country. Changes when a pin is hovered, focused or clicked.
function CountryPanel({ country }: { country: Country }) {
  const index = countries.findIndex((c) => c.id === country.id);
  return (
    <aside
      aria-live="polite"
      className="on-night overflow-hidden rounded-md bg-night text-night-foreground shadow-xl"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={country.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="p-6"
        >
          {country.image && (
            <div className="photo overflow-hidden rounded-sm">
              <img src={country.image} alt="" className="h-44 w-full object-cover" />
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <WaxSeal label={chapterNumeral(index)} className="h-10 w-10 text-primary-foreground" />
            <p className="text-lg font-semibold text-brass">
              Chapter {chapterNumeral(index)} of {chapterNumeral(countries.length - 1)}
            </p>
          </div>
          <h2 className="mt-3 font-display text-5xl font-semibold leading-none">{country.name}</h2>
          <p className="mt-3 text-lg leading-relaxed text-night-foreground/85">
            {country.shortDescription}
          </p>

          {country.places.length > 0 && (
            <ul aria-label={`Places in ${country.name}`} className="mt-4 flex flex-wrap gap-2">
              {country.places.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/europe/$countryId/$placeId"
                    params={{ countryId: country.id, placeId: p.id }}
                    className="inline-block rounded-full border border-night-foreground/35 px-3.5 py-1 text-base transition-colors hover:border-brass hover:text-brass"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            to="/europe/$countryId"
            params={{ countryId: country.id }}
            className="group mt-6 flex items-center justify-center gap-3 rounded-md bg-brass px-6 py-3.5 text-xl font-semibold text-night transition-colors hover:bg-brass/90"
          >
            Open {country.name}
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}

function Europe() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string>(countries[0]?.id ?? "");
  const active = countries.find((c) => c.id === activeId) ?? countries[0];

  const open = (id: string) => navigate({ to: "/europe/$countryId", params: { countryId: id } });

  // Presenter shortcuts: ←/→ choose a country, Enter opens it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const i = countries.findIndex((c) => c.id === activeId);
      if (e.key === "ArrowRight")
        setActiveId(countries[Math.min(i + 1, countries.length - 1)]?.id ?? activeId);
      else if (e.key === "ArrowLeft") setActiveId(countries[Math.max(i - 1, 0)]?.id ?? activeId);
      else if (e.key === "Enter" && (e.target as HTMLElement).tagName === "BODY") open(activeId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  if (!active) return null;

  return (
    <>
      <Navigation wide />
      <PageTransition>
        <div className={`${wrapWide} py-6 lg:py-8`}>
          <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start xl:grid-cols-[1fr_27rem]">
            <div>
              <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                Explore Rizal's Journey Through Europe
              </h1>
              <p className="mt-2 text-xl text-muted-foreground">
                Pick a country on the map to preview it.
              </p>
              <JourneyMap
                mode="select"
                activeId={activeId}
                onActivate={setActiveId}
                onOpen={open}
                className="mt-6"
              />
            </div>
            <CountryPanel country={active} />
          </div>
        </div>
      </PageTransition>
    </>
  );
}
