import { createFileRoute, notFound } from "@tanstack/react-router";
import { motion, MotionConfig } from "framer-motion";
import {
  BackNav,
  Compass,
  CountryHeader,
  Navigation,
  PageTransition,
  PlaceSection,
  PlaceShortcuts,
  rise,
  stagger,
} from "@/components/journey";
import { getCountry } from "@/data/rizalTravelData";

export const Route = createFileRoute("/europe/$countryId/")({
  loader: ({ params }) => {
    const country = getCountry(params.countryId);
    if (!country) throw notFound();
    return { country };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.country.name} — Rizal's Journey` : "Not found";
    const d = loaderData ? `Places Rizal visited in ${loaderData.country.name}.` : "Country not found.";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  component: CountryPage,
});

// One continuous page: country header, sticky location shortcuts, then
// every location (header + timeline) stacked in the order they appear
// in rizalTravelData.ts.
function CountryPage() {
  const { country } = Route.useLoaderData();
  return (
    <MotionConfig reducedMotion="user">
      <Navigation country={country} />
      <PageTransition>
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={rise}>
            <BackNav to="/europe">Europe</BackNav>
          </motion.div>

          <CountryHeader country={country} />

          <motion.div variants={rise} className="mt-16">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-primary/50" />
              <h2 className="font-display text-4xl italic text-foreground">Places associated with Rizal</h2>
            </div>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              {/* Scroll to follow the journey in order, or use the shortcuts below to jump straight to a
              location. Placeholder text until your group adds the researched information. */}
            </p>
          </motion.div>

          <PlaceShortcuts places={country.places} />

          {country.places.map((p, i) => (
            <PlaceSection key={p.id} country={country} place={p} index={i} total={country.places.length} />
          ))}

          <motion.div variants={rise} className="mt-16 flex justify-center opacity-35" aria-hidden="true">
            <Compass className="h-10 w-10 text-foreground" />
          </motion.div>
        </motion.div>
      </PageTransition>
    </MotionConfig>
  );
}
