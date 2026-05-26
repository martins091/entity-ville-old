const products = [
  {
    id: 1,
    slug: 'cable-trays',
    name: 'Cable Trays & Ladders',
    description:
      'High-performance cable management systems designed for safe, organized, and efficient routing in industrial and commercial environments.',
    features: [
      'Pre-Galvanized & HDG Finishes',
      'Complete Accessories System',
      'Heavy-Duty Load Capacity',
      'Corrosion Resistant Design',
    ],
    specs: [
      'Material: Pre-Galvanized Steel / HDG',
      'Widths: 100mm – 600mm',
      'Load Capacity: up to 500kg/m',
    ],
    applications: [
      'Industrial plants',
      'Commercial buildings',
      'Data centers and telecom rooms',
    ],
    image: '/images/cable-tray.png',
    images: ['/images/cable-tray.png', '/images/cable.jpg', '/images/cableladder.jpg'],
    category: 'Cable Management',
    price: 12000,
  },

  {
    id: 2,
    slug: 'cable-lugs',
    name: 'Cable Lugs',
    description:
      'Durable and high-conductivity cable lugs engineered for secure electrical terminations and efficient power transmission.',
    features: [
      'Copper & Aluminum Types',
      'High Conductivity',
      'Corrosion Resistant Finish',
      'Wide Size Range',
    ],
    specs: [
      'Materials: Copper, Aluminum',
      'Stud Sizes: M4 – M20',
      'Plating: Tinned or Bare',
    ],
    applications: ['Panel terminations', 'Transformer connections', 'Switchgear'],
    image: '/images/cablelugs.jpeg',
    images: ['/images/cablelugs.jpeg', '/images/cable.jpg', '/images/cable-tray.png'],
    category: 'Electrical Accessories',
    price: 450,
  },

  {
    id: 3,
    slug: 'circuit-breakers',
    name: 'Circuit Breakers',
    description:
      'Advanced electrical protection devices designed to safeguard systems against overloads, short circuits, and faults.',
    features: [
      'MCB / MCCB / RCD Types',
      '6A – 630A Ratings',
      'Multi-Pole Configurations',
      'High Breaking Capacity',
    ],
    specs: [
      'Ratings: 6A – 630A',
      'Poles: 1P – 4P',
      'Standards: IEC/EN compliant',
    ],
    applications: ['Distribution boards', 'Motor protection', 'Industrial panels'],
    image: '/images/breakers.jpg',
    images: ['/images/breakers.jpg', '/images/product-protection.jpg', '/images/product-power.jpg'],
    category: 'Protection Devices',
    price: 8500,
  },

  {
    id: 4,
    slug: 'earth-rods',
    name: 'Earth Rods & Earthing Materials',
    description:
      'Complete grounding materials including earth rods, clamps, and accessories for reliable electrical safety and protection.',
    features: [
      'Copper & Galvanized Rods',
      'High Conductivity',
      'Complete Accessories',
      'Long Service Life',
    ],
    specs: [
      'Lengths: 1.2m, 1.8m, 3m',
      'Materials: Galvanized steel, Copper bonded',
      'Diameter: 16mm–25mm',
    ],
    applications: ['Substations', 'Buildings', 'Telecom towers'],
    image: '/images/earthing-systems.jpg',
    images: ['/images/earthing-systems.jpg', '/images/inspection.png', '/images/product-installation.jpg'],
    category: 'Earthing & Protection',
    price: 2200,
  },

  {
    id: 5,
    slug: 'conduits',
    name: 'Conduit Pipes & Fittings',
    description:
      'Robust conduit systems designed to protect electrical wiring from mechanical damage and environmental conditions.',
    features: [
      'Steel & PVC Options',
      'Flexible & Rigid Types',
      'Corrosion Resistant',
      'Full Fittings Range',
    ],
    specs: [
      'Materials: Steel, PVC',
      'Diameters: 16mm–63mm',
      'Standards: IP-rated options',
    ],
    applications: ['Residential wiring', 'Industrial installations', 'Underground ducts'],
    image: '/images/conduit-pipe.jpg',
    images: ['/images/conduit-pipe.jpg', '/images/conduit-pipes-fittings.jpg', '/images/product-installation.jpg'],
    category: 'Wiring Systems',
    price: 650,
  },

  {
    id: 6,
    slug: 'busbars',
    name: 'Tinned Copper Busbars',
    description:
      'High-efficiency copper busbars with protective tin coating for reliable and low-loss power distribution.',
    features: [
      'High Conductivity Copper',
      'Anti-Corrosion Coating',
      'Custom Sizes Available',
      'Low Power Loss',
    ],
    specs: [
      'Widths: 20mm–100mm',
      'Thicknesses: 3mm–10mm',
      'Finish: Tinned copper',
    ],
    applications: ['Switchgear', 'Distribution panels', 'Transformers'],
    image: '/images/plated-copper-busbar.jpg',
    images: ['/images/plated-copper-busbar.jpg', '/images/product-power.jpg', '/images/wiring-device.png'],
    category: 'Power Distribution',
    price: 18000,
  },

  {
    id: 7,
    slug: 'lightning-arrestors',
    name: 'Lightning Arrestors',
    description:
      'Reliable surge and lightning protection systems designed to safeguard electrical installations and infrastructure.',
    features: [
      'High Surge Protection',
      'IEC Compliant',
      'Durable Construction',
      'Easy Installation',
    ],
    specs: [
      'Type: Surge arrestor, Neutral & Line configurations',
      'Standards: IEC compliant',
      'Mounting: Roof or tower mounts',
    ],
    applications: ['Buildings', 'Towers', 'Substations'],
    image: '/images/surge-arresters.png',
    images: ['/images/surge-arresters.png', '/images/product-protection.jpg', '/images/earthing-systems.jpg'],
    category: 'Surge Protection',
    price: 5400,
  },

  {
    id: 8,
    slug: 'wiring-devices',
    name: 'Wiring Devices',
    description:
      'Modern switches, sockets, and lighting solutions built for safety, durability, and aesthetic installations.',
    features: [
      'Switches & Socket Outlets',
      'LED Lighting Solutions',
      'Weatherproof Options',
      'Industrial Grade Designs',
    ],
    specs: [
      'Finish: Matte, Gloss',
      'Ingress Protection: IP44 options',
      'Compatibility: Modular frames',
    ],
    applications: ['Homes', 'Offices', 'Industrial sites'],
    image: '/images/wiring-device.png',
    images: ['/images/wiring-device.png', '/images/electric.png', '/images/product-installation.jpg'],
    category: 'Wiring Systems',
    price: 1200,
  },

  {
    id: 9,
    slug: 'inspection-chambers',
    name: 'Inspection Chambers',
    description:
      'Durable underground access systems designed for easy inspection and maintenance of cable and drainage networks.',
    features: [
      'Concrete / HDPE / Steel Options',
      'Multiple Size Variants',
      'High Strength Build',
      'Corrosion Resistant',
    ],
    specs: [
      'Materials: HDPE, Concrete, Steel',
      'Diameters: 300mm–600mm',
      'Load Class: Up to D400',
    ],
    applications: ['Underground cabling', 'Drainage systems', 'Infrastructure maintenance'],
    image: '/images/inspection.png',
    images: ['/images/inspection.png', '/images/conduit-pipes-fittings.jpg', '/images/product-installation.jpg'],
    category: 'Underground Infrastructure',
    price: 7600,
  },

  {
    id: 10,
    slug: 'solar-materials',
    name: 'Solar Materials',
    description:
      'Complete solar energy components including panels, lithium batteries, inverters, and accessories for reliable power solutions.',
    features: [
      'Solar Panels (300W – 700W)',
      'Lithium & Deep Cycle Batteries',
      'Hybrid & Off-Grid Inverters',
      'Full Installation Accessories',
    ],
    specs: [
      'Panels: 300W–700W',
      'Batteries: 12V–48V systems',
      'Inverters: 1kVA–10kVA',
    ],
    applications: ['Residential solar', 'Commercial systems', 'Off-grid installations'],
    image: '/images/sola.jpg',
    images: ['/images/sola.jpg', '/images/product-renewable.jpg', '/images/product-backup.jpg'],
    category: 'Renewable Energy',
    price: 45000,
  },
];

const productsMap = products.reduce((acc, p) => {
  acc[p.slug] = p;
  return acc;
}, {});

export { products, productsMap };
