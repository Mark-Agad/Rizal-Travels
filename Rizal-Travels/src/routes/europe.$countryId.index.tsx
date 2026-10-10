import { createFileRoute, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ChapterPager,
  CountryHeader,
  Navigation,
  PageTransition,
  PlaceSection,
  PlaceShortcuts,
  ScrollProgress,
  stagger,
  useChapterKeys,
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
    const d = loaderData
      ? `Places Rizal visited in ${loaderData.country.name}.`
      : "Country not found.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  component: CountryPage,
});

// One continuous page: chapter opener, sticky place shortcuts, then every place
// (header + timeline) in the order they appear in rizalTravelData.ts.
// ←/→ move to the previous or next chapter.
function CountryPage() {
  const { country } = Route.useLoaderData();
  useChapterKeys(country.id);
  return (
    <>
      <ScrollProgress />
      <Navigation country={country} />
      <PageTransition>
        <motion.div variants={stagger} initial="hidden" animate="show">
          <CountryHeader country={country} />
        </motion.div>

        <PlaceShortcuts places={country.places} />

        {country.places.map((p, i) => (
          <PlaceSection
            key={p.id}
            country={country}
            place={p}
            index={i}
            total={country.places.length}
          />
        ))}

        <ChapterPager countryId={country.id} />
      </PageTransition>
    </>
  );
}
