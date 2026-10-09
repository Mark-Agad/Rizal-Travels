import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getPlace } from "@/data/rizalTravelData";

// Locations no longer have their own page: they are sections of the
// country page. This route only keeps old links (/europe/belgium/ghent)
// working by sending them to the matching section (/europe/belgium#place-ghent).
export const Route = createFileRoute("/europe/$countryId/$placeId")({
  beforeLoad: ({ params }) => {
    if (!getPlace(params.countryId, params.placeId)) throw notFound();
    throw redirect({
      to: "/europe/$countryId",
      params: { countryId: params.countryId },
      hash: `place-${params.placeId}`,
      replace: true,
    });
  },
});
