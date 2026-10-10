import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { JourneyMap } from "@/components/journey-map";
import { Navigation, stagger, rise, wrapWide } from "@/components/journey";
import { countries } from "@/data/rizalTravelData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rizal's Journey Through Europe" },
      {
        name: "description",
        content: "An interactive look at José Rizal's travels across Europe.",
      },
      { property: "og:title", content: "Rizal's Journey Through Europe" },
      {
        property: "og:description",
        content: "An interactive look at José Rizal's travels across Europe.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

// The opening screen: who (José Rizal), what (his travels), how (follow the route, open a country).
// The route on the map draws itself once on load; that is the only big motion on this page.
function Home() {
  return (
    <>
      <Navigation wide />
      <main className="relative overflow-hidden">
        <div
          className="paper-grain pointer-events-none absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <div
          className={`${wrapWide} relative grid min-h-[calc(100vh-4.5rem)] items-center gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16`}
        >
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p variants={rise} className="text-xl font-semibold text-primary">
              The travels of José Rizal
            </motion.p>
            <motion.h1
              variants={rise}
              className="mt-4 font-display text-6xl font-semibold leading-[1.02] text-foreground sm:text-7xl xl:text-7xl 2xl:text-8xl"
            >
              Rizal's Journey Through Europe
            </motion.h1>
            <motion.p
              variants={rise}
              className="mt-7 max-w-xl text-xl leading-relaxed text-muted-foreground"
            >
              Follow his route across the map. Open any country to see where he stayed and what he
              did there.
            </motion.p>

            <motion.div variants={rise} className="mt-10">
              <Link
                to="/europe"
                className="group inline-flex items-center gap-3 rounded-md bg-primary px-9 py-4 text-xl font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
              >
                Begin the journey
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>

            <motion.nav variants={rise} aria-label="Countries" className="mt-10">
              <ol className="flex flex-wrap items-center gap-y-3 text-lg">
                {countries.map((c, i) => (
                  <li key={c.id} className="flex items-center">
                    {i > 0 && (
                      <span className="mx-3 h-px w-6 bg-foreground/30" aria-hidden="true" />
                    )}
                    <Link
                      to="/europe/$countryId"
                      params={{ countryId: c.id }}
                      className="font-medium text-foreground/80 underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ol>
            </motion.nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <JourneyMap mode="link" />
          </motion.div>
        </div>
      </main>
    </>
  );
}
