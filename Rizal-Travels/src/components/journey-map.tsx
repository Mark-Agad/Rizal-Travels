import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { countries, type Country } from "@/data/rizalTravelData";

// ---------------------------------------------------------------
// MAP SETTINGS: the map picture lives in the /public folder.
// MAP_CROP says which part of the picture to show (in pixels of the
// original picture). Pin positions (`mapPosition`) in rizalTravelData.ts
// are percentages of THIS cropped area.
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

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
export const chapterNumeral = (index: number) => ROMAN[index] ?? String(index + 1);

// Wax seal drawn in code (no image needed).
export function WaxSeal({ label, className = "h-12 w-12" }: { label: string; className?: string }) {
  const points = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    const r = 21 + 1.4 * Math.sin(a * 7) + 0.8 * Math.sin(a * 13 + 1);
    return `${(24 + r * Math.cos(a)).toFixed(2)},${(24 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <polygon points={points} className="fill-primary" />
      <circle
        cx="24"
        cy="24"
        r="15"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
      <ellipse
        cx="17"
        cy="15"
        rx="7"
        ry="3.5"
        fill="#fff"
        opacity="0.12"
        transform="rotate(-30 17 15)"
      />
      <text
        x="24"
        y="25"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize={label.length > 2 ? 11 : 15}
        fontWeight="600"
        className="font-display"
      >
        {label}
      </text>
    </svg>
  );
}

// The route is drawn in a coordinate space the same shape as the map crop,
// so lines never stretch. Pin positions (in %) are scaled into it.
const VB_W = 600;
const VB_H = (VB_W * MAP_CROP.height) / MAP_CROP.width;

type Pt = { x: number; y: number };

// A gentle curve between two stops, bowed sideways so the route reads as travel, not a ruler line.
function curve(a: Pt, b: Pt) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const bow = 0.14;
  const cx = mx - dy * bow;
  const cy = my + dx * bow;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

const STEP = 0.55; // seconds the route takes to reach each next stop

type PinProps = {
  country: Country;
  index: number;
  active: boolean;
  animate: boolean;
  // "link": clicking a pin opens the country. "select": clicking a pin only selects it.
  mode: "link" | "select";
  onActivate?: ((id: string) => void) | undefined;
  onOpen?: ((id: string) => void) | undefined;
};

function MapPin({ country, index, active, animate, mode, onActivate, onOpen }: PinProps) {
  const pos = country.mapPosition;
  if (!pos) return null;

  const labelAt = {
    bottom: "left-1/2 top-full mt-1 -translate-x-1/2",
    top: "bottom-full left-1/2 mb-1 -translate-x-1/2",
    left: "right-full top-1/2 mr-1 -translate-y-1/2",
    right: "left-full top-1/2 ml-1 -translate-y-1/2",
  }[country.labelPosition ?? "bottom"];

  const body = (
    <>
      {active && (
        <span
          className="pin-pulse absolute inset-0 rounded-full bg-primary/60"
          aria-hidden="true"
        />
      )}
      <WaxSeal
        label={chapterNumeral(index)}
        className="relative h-9 w-9 text-primary-foreground drop-shadow-md sm:h-12 sm:w-12"
      />
      <span
        className={`absolute ${labelAt} whitespace-nowrap rounded-sm px-2 py-0.5 text-sm font-semibold shadow-sm transition-colors sm:text-base ${
          active ? "bg-primary text-primary-foreground" : "bg-card/95 text-foreground"
        }`}
      >
        {country.name}
      </span>
    </>
  );

  const cls = `relative block transition-transform duration-200 ${active ? "scale-110" : "hover:scale-105"}`;
  const center = { x: "-50%", y: "-50%" };

  return (
    <motion.div
      className={`absolute ${active ? "z-20" : "z-10"}`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      initial={animate ? { opacity: 0, scale: 0.4, ...center } : center}
      animate={{ opacity: 1, scale: 1, ...center }}
      transition={{ delay: animate ? 0.3 + index * STEP : 0, duration: 0.35, ease: "easeOut" }}
    >
      {mode === "link" ? (
        <Link
          to="/europe/$countryId"
          params={{ countryId: country.id }}
          aria-label={`Open ${country.name}`}
          className={cls}
        >
          {body}
        </Link>
      ) : (
        <button
          type="button"
          aria-label={`${country.name}. Press Enter to select, double-click to open.`}
          aria-pressed={active}
          onMouseEnter={() => onActivate?.(country.id)}
          onFocus={() => onActivate?.(country.id)}
          onClick={() => onActivate?.(country.id)}
          onDoubleClick={() => onOpen?.(country.id)}
          className={cls}
        >
          {body}
        </button>
      )}
    </motion.div>
  );
}

// The vintage map with the route drawn between the stops (in the same order as the
// countries in rizalTravelData.ts) and one wax-seal pin per country.
export function JourneyMap({
  activeId = null,
  mode = "link",
  animate = true,
  onActivate,
  onOpen,
  className = "",
}: {
  activeId?: string | null;
  mode?: "link" | "select";
  animate?: boolean;
  onActivate?: (id: string) => void;
  onOpen?: (id: string) => void;
  className?: string;
}) {
  const stops = countries.flatMap((c, i) => (c.mapPosition ? [{ c, i }] : []));
  const pts: Pt[] = stops.map(({ c }) => ({
    x: ((c.mapPosition?.x ?? 0) / 100) * VB_W,
    y: ((c.mapPosition?.y ?? 0) / 100) * VB_H,
  }));

  return (
    <div
      className={`overflow-hidden rounded-md bg-card p-2 shadow-xl ring-1 ring-foreground/15 sm:p-3 ${className}`}
    >
      <div
        className="relative overflow-hidden rounded-sm"
        style={{ aspectRatio: `${MAP_CROP.width} / ${MAP_CROP.height}` }}
      >
        <img src={MAP_IMAGE} alt="Vintage map of Europe" style={mapImageStyle} />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-primary"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          aria-hidden="true"
        >
          {pts.slice(1).map((p, i) => (
            <motion.path
              key={i}
              d={curve(pts[i] ?? p, p)}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.8"
              initial={animate ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{
                delay: animate ? 0.3 + i * STEP : 0,
                duration: STEP,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>

        {stops.map(({ c, i }) => (
          <MapPin
            key={c.id}
            country={c}
            index={i}
            active={activeId === c.id}
            animate={animate}
            mode={mode}
            onActivate={onActivate}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}
