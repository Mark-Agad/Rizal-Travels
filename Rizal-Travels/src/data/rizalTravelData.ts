// ============================================================
//  RIZAL'S JOURNEY — WEBSITE CONTENT FILE
// ============================================================
//  ALL TEXT BELOW IS PLACEHOLDER CONTENT. It is NOT historically
//  accurate. Your group will replace it with researched information
//  about José Rizal's actual travels through Europe.
//
//  HOW TO EDIT (plain language):
//  - The site reads everything from this one file. No page has its
//    own hard-coded text, so you only ever edit here.
//  - Structure: Europe → countries → places → historical highlights.
//  - To add a new country: copy a whole { ... } block inside the
//    `countries` list below and change the text.
//  - To add a new place: copy a line inside `places: [ ... ]` and
//    change the text.
//  - To add a new highlight: copy a { ... } block inside
//    `highlights: [ ... ]` and change the text.
//  - `image` fields: leave the empty string ("") to show a dashed
//    "Image placeholder" box, or paste a web address (URL) of a photo.
//  - `flag` fields: a short label or emoji shown on the country card.
// ============================================================

export type Highlight = {
  id: string;
  year: string; // placeholder — e.g. "1885"
  title: string;
  category: string; // placeholder — e.g. "Event" / "Achievement"
  description: string;
  image?: string; // optional — empty shows an "Image placeholder" box
};

export type Place = {
  id: string;
  name: string;
  shortDescription: string;
  image?: string; // optional — empty shows an "Image placeholder" box
  highlights: Highlight[];
};

export type Country = {
  id: string;
  name: string;
  flag: string; // placeholder emoji or short label
  shortDescription: string;
  image?: string; // optional — empty shows an "Image placeholder" box
  places: Place[];
};

// Small helpers so each placeholder block below stays short.
// They generate placeholder highlights you can replace one by one.
const placeholderHighlights = (n: number): Highlight[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `h${i + 1}`,
    year: "Year to be added",
    title: `Placeholder Historical Highlight ${i + 1}`,
    category: i % 2 === 0 ? "Placeholder Historical Event" : "Placeholder Achievement",
    description: "Placeholder description. Replace with researched information about what José Rizal did here.",
    image: "",
  }));

const placeholderPlace = (id: string, name: string): Place => ({
  id,
  name,
  shortDescription: "Placeholder short description. Replace with a summary of Rizal's time in this place.",
  image: "",
  highlights: placeholderHighlights(3),
});

// ============================================================
//  THE DATA — Europe → Countries → Places → Historical Highlights
// ============================================================

export const countries: Country[] = [
  {
    id: "spain",
    name: "Spain",
    flag: "🇪🇸",
    shortDescription: "Placeholder overview of Rizal's time in Spain.",
    image: "",
    places: [
      placeholderPlace("madrid", "Madrid"),
      placeholderPlace("barcelona", "Barcelona"),
    ],
  },
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    shortDescription: "Placeholder overview of Rizal's time in France.",
    image: "",
    places: [
      placeholderPlace("paris", "Paris"),
    ],
  },
  {
    id: "belgium",
    name: "Belgium",
    flag: "🇧🇪",
    shortDescription: "Rizal stayed in Belgium from 1890 to 1891, living in Brussels and later in Ghent, where El Filibusterismo was printed.",
    image: "/map_belgium.jpg",
    places: [
    {
    id: "brussels",
    name: "Brussels",
    shortDescription: "Rizal lived in Brussels from 1890 to 1891.",
    image: "/brussels.jpg",
    highlights: [
      {
        id: "h1",
        year: "1890–1891",
        title: "Residence in Brussels",
        category: "Residence",
        description: "Rizal lived at 42 Rue Philippe de Champagne, where he worked on his novel El Filibusterismo.",
        image: "/42rue.jpg",
      },
      {
        id: "h2",
        year: "1890–1891",
        title: "Writing in Brussels",
        category: "Writing",
        description: "Rizal worked on El Filibusterismo and contributed essays to La Solidaridad, including “The Indolence of the Filipinos,” published in five installments in 1890.",
        image: "/elfili.jpg",
      },
    ],
  },
  {
    id: "ghent",
    name: "Ghent",
    shortDescription: "In 1891, Rizal moved to Ghent, where El Filibusterismo was printed.",
    image: "/ghent.jpg",
    highlights: [
      {
        id: "h1",
        year: "1891",
        title: "Printing in Ghent",
        category: "Printing",
        description: "Financial difficulties forced Rizal to suspend the printing of El Filibusterismo temporarily. With financial assistance from Valentín Ventura, the printing resumed and the novel was completed.",
        image: "/print.jpg",
      },
      {
        id: "h2",
        year: "September 1891",
        title: "Publication of El Filibusterismo",
        category: "Publication",
        description: "El Filibusterismo came off the press in Ghent, Belgium, on September 18, 1891.",
        image: "/publish.jpg",
      },
      {
        id: "h3",
        year: "1891",
        title: "El Filibusterismo",
        category: "Literary Work",
        description: "Rizal’s second novel and the sequel to Noli Me Tangere. It presents a darker view of Philippine society under Spanish colonial rule and is dedicated to Mariano Gómez, José Burgos, and Jacinto Zamora (GOMBURZA), who were executed on February 17, 1872.",
        image: "/gomez.jpg",
      },
    ],
  },
    ],
  },
  {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
    shortDescription: "Placeholder overview of Rizal's time in Germany.",
    image: "",
    places: [
      placeholderPlace("heidelberg", "Heidelberg"),
      placeholderPlace("berlin", "Berlin"),
    ],
  },
];

// ============================================================
//  LOOKUP HELPERS — the pages use these; you don't need to edit them.
// ============================================================

export const getCountry = (id: string) => countries.find((c) => c.id === id);
export const getPlace = (countryId: string, placeId: string) =>
  getCountry(countryId)?.places.find((p) => p.id === placeId);
