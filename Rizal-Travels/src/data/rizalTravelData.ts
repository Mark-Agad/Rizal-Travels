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
//  - `visits` (optional, places only): a list of visit dates, e.g.
//    visits: ["June 1883", "September 1888"]. Shown as date chips at the
//    top of the place. Leave it out and nothing is shown.
//  - `labelPosition` (optional, countries only): where the country name sits
//    next to its pin: "bottom" (default), "top", "left" or "right". Use it
//    if two labels overlap on the map.
//  - `mapPosition` (optional, countries only): where the wax-seal pin
//    sits on the Europe map page, as percentages from the left (x)
//    and from the top (y). Leave it out and that country gets no pin.
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
  visits?: string[]; // optional — dates of each visit, shown as chips
  image?: string; // optional — empty shows an "Image placeholder" box
  highlights: Highlight[];
};

export type Country = {
  id: string;
  name: string;
  flag: string; // placeholder emoji or short label
  shortDescription: string;
  image?: string; // optional — empty shows an "Image placeholder" box
  labelPosition?: "top" | "bottom" | "left" | "right"; // optional — which side of the pin the name sits on
  mapPosition?: { x: number; y: number }; // optional — pin spot on the Europe map, in % from the left (x) and top (y)
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
    mapPosition: { x: 22.5, y: 81.4 },
    labelPosition: "right",
    shortDescription: "Rizal's first European base. He arrived in Barcelona in 1882 and studied in Madrid until 1884, where his political ideas took shape.",
    image: "/map_spain.jpg",
    places: [
      {
        id: "barcelona",
        name: "Barcelona",
        shortDescription: "His port of arrival in Spain in June 1882, and where he wrote his first article on Spanish soil.",
        image: "/barcelona.jpg",
        highlights: [
          {
            id: "h1",
            year: "June 1882",
            title: "Arrival in Barcelona",
            category: "Arrival",
            description: "After travelling by sea and then by train from Marseilles, Rizal reached Barcelona on June 16, 1882. He first found the city unpleasant, then came to admire its freedom and its people. Filipino friends welcomed him with a gathering at a café.",
            image: "/barcelona_cafe.jpg",
          },
          {
            id: "h2",
            year: "1882",
            title: "“Amor Patrio”",
            category: "Writing",
            description: "Rizal wrote the essay “Amor Patrio” in Barcelona, his first article written on Spanish soil. He sent it to the Diariong Tagalog in Manila, whose publisher encouraged him to write more.",
            image: "/amor_patrio.jpg",
          },
          {
            id: "h3",
            year: "Fall 1882",
            title: "Leaving for Madrid",
            category: "Journey",
            description: "News of a cholera outbreak in Manila reached him, and his brother Paciano advised him to continue his medical studies in Madrid. Rizal left Barcelona for the capital in the fall of 1882.",
            image: "/mandrid.jpg",
          },
        ],
      },
      {
        id: "madrid",
        name: "Madrid",
        shortDescription: "Where Rizal studied at the Universidad Central de Madrid from 1882 to 1884 and joined Spain's liberal circles.",
        image: "/town_madrid.jpg",
        highlights: [
          {
            id: "h1",
            year: "November 1882",
            title: "Enrolment at the Universidad Central",
            category: "Education",
            description: "On November 3, 1882, Rizal enrolled in Medicine and in Philosophy and Letters. Alongside these courses he studied painting and sculpture, took language lessons, and trained in fencing and shooting.",
            image: "/central_mandrid.jpg",
          },
          {
            id: "h2",
            year: "1883",
            title: "Joining a Masonic Lodge",
            category: "Society",
            description: "Rizal joined the Acacia lodge in Madrid, hoping to gain support in his campaign against the friars in the Philippines. He was later transferred to Lodge Solidaridad.",
            image: "/joining_masonic.jpg",
          },
          {
            id: "h3",
            year: "June 1884",
            title: "Licentiate in Medicine",
            category: "Milestone",
            description: "On June 21, 1884, Rizal received his Licentiate in Medicine from the Universidad Central. He also completed his studies in Philosophy and Letters with excellent ratings.",
            image: "/Licentiate_in_Medicine.jpg",
          },
          {
            id: "h4",
            year: "November 1884",
            title: "Student Demonstrations",
            category: "Event",
            description: "Rizal took part in student demonstrations in support of the professor Miguel Morayta, whose views on academic freedom were condemned by Spain's Catholic bishops.",
            image: "/student_demo.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    mapPosition: { x: 41.7, y: 42.9 },
    labelPosition: "left",
    shortDescription: "Rizal's time in France helped him grow as a doctor, historian, and reformist through medical training, historical research, Filipino organizations, and artistic connections.",
    image: "/map_france.jpg",
    places: [
            {
        id: "paris",
        name: "Paris",
        shortDescription: "Paris was a major center of learning, culture, and Filipino intellectual activity during Rizal’s travels in Europe",
        image: "/paris 2.png",
        highlights: [
          {
            id: "h1",
            year: "November 1885 – February 1886",
            title: "Ophthalmology Training",
            category: "Medical Training",
            description:
              "Rizal worked as an assistant at Dr. Louis de Wecker's eye clinic, learning advanced eye-treatment and surgical techniques to help improve his mother's eyesight.",
            image: "/Ophthalmology training.jpeg",
          },
          {
            id: "h2",
            year: "1885–1886 and later visits",
            title: "Interaction with Filipino Artists",
            category: "Art & Culture",
            description:
              "Rizal spent time with Filipino artists such as Juan Luna, visited art studios and museums, and developed his appreciation of European art.",
            image: "/joserizal_juanluna.jpg",
          },
          {
            id: "h3",
            year: "1889",
            title: "Formation of Filipino Organizations",
            category: "Filipino Nationalism & Organizations",
            description:
              "During the Paris Universal Exposition, Rizal organized the Kidlat Club and the Indios Bravos, promoting friendship among Filipinos and pride in Filipino identity. He also established the secret society R.D.L.M.",
            image: "/kidlatclub.jpg",
          },
          {
            id: "h4",
            year: "1890",
            title: "Publication of His Annotated Historical Book",
            category: "Historical Research & Publication",
            description:
              "Rizal published his annotated edition of Antonio de Morga's Sucesos de las Islas Filipinas, presenting historical evidence of Filipino society before Spanish colonization. He had conducted much of the underlying research in London.",
            image: "/islasbook.jpg",
          },
        ],
      },
    ],
  },
  {
    id: "belgium",
    name: "Belgium",
    flag: "🇧🇪",
    mapPosition: { x: 49.5, y: 33.5 },
    labelPosition: "top",
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
    mapPosition: { x: 63, y: 34 },
    shortDescription:
      "During his time in Germany from February 1886 to May 1887, Dr. Jose Rizal studied ophthalmology, finished and published his landmark novel Noli Me Tángere, and integrated himself into European scientific and academic circles.",
    image: "/map_germany.jpg",
    places: [
      {
        id: "heidelberg",
        name: "Heidelberg & Wilhelmsfeld",
        shortDescription:
          "During his stay in Heidelberg and Wilhelmsfeld from February to August 1886, Dr. José Rizal focused on specializing in ophthalmology while immersing himself in German culture. At the University Eye Hospital, he trained under the renowned surgeon Dr. Otto Becker to master eye surgery techniques that would later allow him to operate on his mother's failing eyesight.",
        image: "/Germany2.jpg",
        highlights: [
          {
            id: "h1",
            year: "1886",
            title: "Medical Specialization",
            category: "Advanced Ophthalmic Training",
            description:
              "Rizal specialized in eye surgery at the University Eye Hospital in Heidelberg under the guidance of the renowned German ophthalmologist Dr. Otto Becker, aiming to acquire the surgical skills needed to cure his mother's blindness.",
            image: "/Ophthalmology training.jpeg",
          },
          {
            id: "h2",
            year: "1886",
            title: "Literary & Cultural Engagement",
            category: "Artistic & Social Immersion",
            description:
              "He joined the Heidelberg Chess Club to integrate into local academic circles and penned the nostalgic poem A Las Flores de Heidelberg, drawn from the beauty of forget-me-nots blooming along the banks of the Neckar River.",
            image: "/germanychess.jpg",
          },
          {
            id: "h3",
            year: "1886",
            title: "Philosophical & Linguistic Growth",
            category: "The Wilhelmsfeld Interlude",
            description:
              "During a three-month stay with Pastor Karl Ullmer and his family in Wilhelmsfeld, Rizal perfected his German fluency, engaged in open-minded philosophical and religious dialogues, and continued polishing his novel Noli Me Tángere.",
            image: "/germanypastor.jpg",
          },
          {
            id: "h4",
            year: "1886",
            title: "Intellectual Alliances",
            category: "Beginning of the Blumentritt Correspondence",
            description:
              "Rizal initiated contact with Austrian scholar Professor Ferdinand Blumentritt by mailing him a bilingual (Tagalog/Spanish) arithmetic book (Aritmetica), sparking a historic intellectual partnership and lifelong friendship.",
            image: "/GermanyFerdinand.jpeg",
          },
        ],
      },
      {
        id: "berlin",
        name: "Berlin",
        shortDescription:
          "During his stay in Berlin (Nov 1886 – May 1887), Dr. José Rizal earned scientific recognition by joining Berlin’s Anthropological, Ethnological, and Geographical Societies and presenting his paper Tagalische Verskunst. Despite enduring severe poverty and hunger, he completed and published his historic novel Noli Me Tángere in March 1887, made possible by a ₱300 loan from Dr. Máximo Viola.",
        image: "/berlincity.jpg",
        highlights: [
          {
            id: "b1",
            year: "1886",
            title: "Integration into European Scientific Circles",
            category: "Scientific & Academic Recognition",
            description:
              "Rizal gained recognition among prominent European scholars and was inducted into Berlin's Anthropological, Ethnological, and Geographical Societies. During this time, he presented his scholarly paper on Tagalog metrical art, \"Tagalische Verskunst\", before the Ethnographic Society of Berlin.",
            image: "/berlinanthro.webp",
          },
          {
            id: "b2",
            year: "1887",
            title: "The Publication of Noli Me Tángere",
            category: "Literary Landmark",
            description:
              "While enduring extreme poverty, hunger, and health struggles in Berlin, Rizal completed his masterpiece novel exposing Philippine society under Spanish rule. Noli Me Tángere was officially printed in March 1887, made possible by a financial loan of ₱300 from his friend Dr. Máximo Viola.",
            image: "/nolimetangere.jpg",
          },
        ],
      },
    ],
  },
];

// ============================================================
//  LOOKUP HELPERS — the pages use these; you don't need to edit them.
// ============================================================

export const getCountry = (id: string) => countries.find((c) => c.id === id);
export const getPlace = (countryId: string, placeId: string) =>
  getCountry(countryId)?.places.find((p) => p.id === placeId);