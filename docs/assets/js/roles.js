// Role matrix — the single source for the Jobs page, form dropdowns and category counts.
// status: "open" (verified vacancy: employer, pay and contract confirmed)
//         "paused" (recruitment on hold)
//         "none"  (no verified vacancy right now — applicants can register interest)
// Only set "open" once the vacancy details are verified. Add `verified: "YYYY-MM-DD"` when you do.
window.MAS_CATEGORIES = [
  {
    id: "driving",
    name: "Heavy driving & logistics",
    icon: "i-truck",
    verify: "Licence class and validity checks, a practical driving evaluation and road-safety awareness. Final eligibility depends on documents and local licence rules.",
  },
  {
    id: "welding",
    name: "Fabrication & welding",
    icon: "i-spark",
    verify: "Practical trade test, recorded with the candidate's consent, plus blueprint reading where the role needs it. X-ray / NDT weld testing only when carried out by a qualified provider.",
  },
  {
    id: "construction",
    name: "Construction & mechanical",
    icon: "i-helmet",
    verify: "Practical assessment of tool competency and safety knowledge. We name a certificate only when it is verified, together with the body that issued it.",
  },
  {
    id: "general",
    name: "General labour",
    icon: "i-box",
    verify: "Work readiness and basic communication, physical requirements stated openly, references with consent, and medical checks only where the job or law requires them.",
  },
];

window.MAS_ROLES = [
  { id: "trailer-driver", title: "Trailer / heavy vehicle driver", cat: "driving", status: "none", summary: "Long-haul and regional heavy vehicle driving, load securing and vehicle checks." },
  { id: "equipment-operator", title: "Heavy equipment operator", cat: "driving", status: "none", summary: "Excavators, loaders, cranes and similar plant on construction and industrial sites." },
  { id: "forklift-driver", title: "Forklift driver", cat: "driving", status: "none", summary: "Warehouse and yard handling, stock movement and safe loading." },
  { id: "fleet-mechanic", title: "Fleet mechanic", cat: "driving", status: "none", summary: "Servicing and repair of trucks, trailers and heavy vehicles." },

  { id: "welder-6g", title: "6G pipe welder", cat: "welding", status: "none", summary: "All-position pipe welding to project specifications." },
  { id: "welder-tig-mig", title: "TIG / MIG welder", cat: "welding", status: "none", summary: "Steel, stainless and aluminium welding for fabrication shops and sites." },
  { id: "pipe-fitter", title: "Pipe fitter", cat: "welding", status: "none", summary: "Measuring, cutting, fitting and installing industrial pipework." },
  { id: "structural-fabricator", title: "Structural fabricator", cat: "welding", status: "none", summary: "Fabricating and assembling steel structures from drawings." },
  { id: "millwright", title: "Millwright", cat: "welding", status: "none", summary: "Installing, aligning and maintaining industrial machinery." },

  { id: "electrician", title: "Industrial electrician", cat: "construction", status: "none", summary: "Installation and maintenance of industrial electrical systems." },
  { id: "plumber", title: "Plumber", cat: "construction", status: "none", summary: "Water, drainage and heating installations on new builds and renovations." },
  { id: "mason", title: "Mason", cat: "construction", status: "none", summary: "Blockwork, brickwork and concrete finishing." },
  { id: "scaffolder", title: "Scaffolder", cat: "construction", status: "none", summary: "Erecting and dismantling scaffolding safely to plan." },
  { id: "hvac-technician", title: "HVAC technician", cat: "construction", status: "none", summary: "Installing and servicing heating, ventilation and cooling systems." },

  { id: "construction-helper", title: "Construction helper", cat: "general", status: "none", summary: "Supporting skilled trades on site: materials, preparation and clean-up." },
  { id: "warehouse-packer", title: "Warehouse packer", cat: "general", status: "none", summary: "Picking, packing and labelling orders in warehouses." },
  { id: "factory-crew", title: "Factory assembly-line crew", cat: "general", status: "none", summary: "Production-line work, assembly and basic quality checks." },
  { id: "agricultural-worker", title: "Agricultural worker", cat: "general", status: "none", summary: "Seasonal and year-round farm work, including harvesting and packing." },
  { id: "site-cleaner", title: "Site cleaner", cat: "general", status: "none", summary: "Cleaning construction sites, facilities and industrial premises." },
];
