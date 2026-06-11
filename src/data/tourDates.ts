/**
 * Tour data — single source of truth for the Tour section.
 * Each show carries display + ISO start, status, optional ticket URL,
 * and lng/lat coords for the map view.
 *
 * Status meanings:
 *   "on-sale"        – tickets available, link is live
 *   "selling-fast"   – majority sold, urgency badge shown
 *   "last-tickets"   – red urgency badge
 *   "sold-out"       – row dimmed, no ticket link
 *   "invite"         – invite only / industry, no public ticket
 *   "announced"      – on the routing but no public on-sale yet → notify-me
 */

export type ShowStatus =
  | "on-sale"
  | "selling-fast"
  | "last-tickets"
  | "sold-out"
  | "invite"
  | "announced";

export type Region = "africa" | "europe" | "americas";

export type Show = {
  id: string;
  display: string;         // "30 May" — pretty date
  iso: string;             // "2026-05-30T20:00:00+01:00" — local doors
  iso_end?: string;        // optional explicit end (for multi-day legs)
  city: string;
  country: string;         // ISO-3166 two-letter
  flag: string;            // emoji
  region: Region;
  venue: string;
  status: ShowStatus;
  ticketUrl?: string;      // null = no link
  coords: [number, number]; // [lng, lat] for the map view
};

export const TOUR_SHOWS: Show[] = [
  {
    id: "lisbon-moga-2026",
    display: "30 May",
    iso: "2026-05-30T19:00:00+01:00",
    iso_end: "2026-05-30T23:30:00+01:00",
    city: "Lisbon",
    country: "PT",
    flag: "🇵🇹",
    region: "europe",
    venue: "MOGA Festival",
    status: "on-sale",
    ticketUrl: "https://moga-festival.com",
    coords: [-9.14, 38.72],
  },
  {
    id: "lagos-element-2026",
    display: "3 – 5 Jun",
    iso: "2026-06-03T18:00:00+01:00",
    iso_end: "2026-06-05T23:00:00+01:00",
    city: "Lagos",
    country: "NG",
    flag: "🇳🇬",
    region: "africa",
    venue: "Element House",
    status: "invite",
    coords: [3.38, 6.45],
  },
  {
    id: "mexico-2026",
    display: "7 – 11 Jun",
    iso: "2026-06-07T20:00:00-06:00",
    iso_end: "2026-06-11T23:00:00-06:00",
    city: "Mexico",
    country: "MX",
    flag: "🇲🇽",
    region: "americas",
    venue: "Tour Week",
    status: "announced",
    coords: [-99.13, 19.43],
  },
  {
    id: "usa-2026",
    display: "14 – 22 Jun",
    iso: "2026-06-14T20:00:00-04:00",
    iso_end: "2026-06-22T23:00:00-04:00",
    city: "USA",
    country: "US",
    flag: "🇺🇸",
    region: "americas",
    venue: "Tour Run",
    status: "announced",
    coords: [-74.0, 40.71],
  },
  {
    id: "london-2026",
    display: "23 – 30 Jun",
    iso: "2026-06-23T20:00:00+01:00",
    iso_end: "2026-06-30T23:00:00+01:00",
    city: "London",
    country: "GB",
    flag: "🇬🇧",
    region: "europe",
    venue: "Tour Week",
    status: "announced",
    coords: [-0.13, 51.51],
  },
  {
    id: "durban-2026",
    display: "5 Jul",
    iso: "2026-07-05T20:00:00+02:00",
    city: "Durban",
    country: "ZA",
    flag: "🇿🇦",
    region: "africa",
    venue: "Homecoming",
    status: "announced",
    coords: [31.03, -29.86],
  },
  {
    id: "ibiza-hi-2026",
    display: "10 Aug",
    iso: "2026-08-10T23:00:00+02:00",
    iso_end: "2026-08-11T06:00:00+02:00",
    city: "Ibiza",
    country: "ES",
    flag: "🇪🇸",
    region: "europe",
    venue: "Hï Ibiza",
    status: "on-sale",
    ticketUrl: "https://hiibiza.com",
    coords: [1.43, 38.91],
  },
  {
    id: "latin-village-2026",
    display: "16 Aug",
    iso: "2026-08-16T14:00:00+02:00",
    iso_end: "2026-08-16T23:30:00+02:00",
    city: "Netherlands",
    country: "NL",
    flag: "🇳🇱",
    region: "europe",
    venue: "Latin Village Festival",
    status: "on-sale",
    ticketUrl: "https://latinvillage.nl",
    coords: [4.9, 52.37],
  },
  {
    id: "angola-2026",
    display: "18 Sep",
    iso: "2026-09-18T20:00:00+01:00",
    city: "Angola",
    country: "AO",
    flag: "🇦🇴",
    region: "africa",
    venue: "TBA",
    status: "announced",
    coords: [13.23, -8.83],
  },
];

export const REGION_LABELS: Record<Region | "all", string> = {
  all: "All",
  africa: "Africa",
  europe: "Europe",
  americas: "Americas",
};

export const STATUS_LABELS: Record<ShowStatus, string> = {
  "on-sale": "On Sale",
  "selling-fast": "Selling Fast",
  "last-tickets": "Last Tickets",
  "sold-out": "Sold Out",
  invite: "Invite Only",
  announced: "Just Announced",
};
