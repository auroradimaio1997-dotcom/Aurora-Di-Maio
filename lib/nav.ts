export type NavLeaf = {
  label: string;
  href: string;
};

export type NavGroup = {
  label: string;
  href: string;
  children: NavLeaf[];
};

export type NavSection = {
  label: string;
  href: string;
  groups: NavGroup[];
};

/**
 * Single source of truth for the sidebar's two-macro-section architecture.
 * Every route below has a matching placeholder page — see app/assistente-notarile
 * and app/accademia. Each Assistente Notarile group maps 1:1 to its own
 * future dedicated n8n agent, kept separate on purpose, never merged.
 */
export const NAV: NavSection[] = [
  {
    label: "Assistente Notarile",
    href: "/assistente-notarile",
    groups: [
      {
        label: "Redazione Atti",
        href: "/assistente-notarile/redazione-atti",
        children: [
          { label: "Inter vivos", href: "/assistente-notarile/redazione-atti/inter-vivos" },
          { label: "Mortis causa", href: "/assistente-notarile/redazione-atti/mortis-causa" },
          { label: "Societario", href: "/assistente-notarile/redazione-atti/societario" },
          {
            label: "Mutui e relazioni preliminari",
            href: "/assistente-notarile/redazione-atti/mutui-relazioni-preliminari",
          },
        ],
      },
      {
        label: "Fai una ricerca scientifica approfondita",
        href: "/assistente-notarile/ricerca-scientifica",
        children: [
          { label: "Ricerca dottrinale", href: "/assistente-notarile/ricerca-scientifica/dottrinale" },
          {
            label: "Ricerca giurisprudenziale",
            href: "/assistente-notarile/ricerca-scientifica/giurisprudenziale",
          },
          {
            label: "Ricerca banche dati notarili",
            href: "/assistente-notarile/ricerca-scientifica/banche-dati-notarili",
          },
        ],
      },
      {
        label: "Tassazione",
        href: "/assistente-notarile/visure-adempimenti/tassazione",
        children: [],
      },
      {
        label: "Adempimenti",
        href: "/assistente-notarile/visure-adempimenti/adempimenti",
        children: [],
      },
      {
        label: "Visure",
        href: "/assistente-notarile/visure-adempimenti",
        children: [
          { label: "Visure camerali", href: "/assistente-notarile/visure-adempimenti/visure-camerali" },
          { label: "Visure ipocatastali", href: "/assistente-notarile/visure-adempimenti/visure-ipocatastali" },
        ],
      },
    ],
  },
  {
    label: "Accademia",
    href: "/accademia",
    groups: [
      {
        label: "Dottorato",
        href: "/accademia/dottorato",
        children: [
          { label: "Lezioni", href: "/accademia/dottorato/lezioni" },
          { label: "Tesi di dottorato", href: "/accademia/dottorato/tesi" },
          { label: "Progetti", href: "/accademia/dottorato/progetti" },
          { label: "Convegni", href: "/accademia/dottorato/convegni" },
        ],
      },
      {
        label: "Ricerca",
        href: "/accademia/ricerca",
        children: [
          { label: "Saggi pubblicati", href: "/accademia/ricerca/saggi-pubblicati" },
        ],
      },
      {
        label: "Lavori in corso",
        href: "/accademia/lavori-in-corso",
        children: [
          { label: "Saggi da pubblicare", href: "/accademia/lavori-in-corso/saggi-da-pubblicare" },
        ],
      },
      {
        label: "Monografia",
        href: "/accademia/monografia",
        children: [],
      },
    ],
  },
];
