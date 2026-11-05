/**
 * TheViralFinds (TVF) — Bright Architectural Low-Poly 3D Scene Engine
 * Exact Emons Aesthetic: Bright daylight studio lighting, low-poly polygonal trees,
 * physical delivery vans, warehouse racks with pallets, container ships, and clean modern architecture.
 */

import * as THREE from 'three';

export interface TVFWaypoint {
  id: string;
  stepNum: string;
  name: string;
  title: string;
  subtitle: string;
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
  badgeColor: string;
  stats: { label: string; value: string }[];
  description: string;
  features: string[];
}

export interface TVFHotspot {
  id: string;
  title: string;
  stationId: string;
  position: [number, number, number];
  metric: string;
  details: string;
  actionText: string;
}

export const TVF_WAYPOINTS: TVFWaypoint[] = [
  {
    id: 'radar',
    stepNum: '01',
    name: 'Product Scout',
    title: 'TheViralFinds — Radar Penemuan Produk Viral',
    subtitle: 'Automated Product Discovery & Trend Tracking',
    cameraPos: [-28, 22, 12],
    targetPos: [-22, 2, -6],
    badgeColor: '#1b55ff',
    stats: [
      { label: 'Produk/Hari', value: '45,000+' },
      { label: 'Ketepatan AI', value: '94.8%' },
      { label: 'Masa Mengesan', value: '3.2 Hari' }
    ],
    description: 'Pusat pengimbas pintar yang menapis trend e-dagang Shopee, TikTok Shop dan Amazon secara masa nyata untuk mengesan produk berpotensi tinggi sebelum tular di pasaran.',
    features: [
      'Analisis Algoritma Sentimen Media Sosial',
      'Pengiraan Margin Untung & ROI Bersih',
      'Pengesahan Pembekal & Kelajuan Stok'
    ]
  },
  {
    id: 'studio',
    stepNum: '02',
    name: 'AI Video Studio',
    title: 'TheViralFinds — Studio Video AI & Suara Yasmin',
    subtitle: 'Automated Scripting, Neural Voice & Video Rendering',
    cameraPos: [-8, 20, 26],
    targetPos: [-10, 3, 12],
    badgeColor: '#1b55ff',
    stats: [
      { label: 'Masa Render', value: '42s / video' },
      { label: 'Model Suara', value: 'Yasmin Neural' },
      { label: 'Peningkatan CTR', value: '+3.4x' }
    ],
    description: 'Studio jana video automatik yang menggabungkan skrip hook viral, suara neural Bahasa Melayu merdu (Yasmin Neural), dan klip dinamik 60 FPS sedia kongsi.',
    features: [
      'Skrip Format Hook 3-Saat (TikTok & Reels)',
      'Sari Kata Dinamik (Karaoke Captions)',
      'Eksport Kualiti HD 1080x1920 9:16'
    ]
  },
  {
    id: 'launchpad',
    stepNum: '03',
    name: 'Multi-Channel',
    title: 'TheViralFinds — Pelancar Siaran Multi-Saluran',
    subtitle: 'Multi-Platform Broadcasting & Auto-Scheduling',
    cameraPos: [18, 24, 28],
    targetPos: [14, 3, 14],
    badgeColor: '#1b55ff',
    stats: [
      { label: 'Saluran', value: '6 Platform' },
      { label: 'Ketepatan Siaran', value: '99.9%' },
      { label: 'Barisan Siaran', value: 'Tanpa Had' }
    ],
    description: 'Pusat pemancar satelit pintar yang mengedarkan video secara serentak ke TikTok, Instagram Reels, YouTube Shorts, Facebook, dan Saluran Telegram.',
    features: [
      'Penjadualan Waktu Puncak (Peak Traffic Optimizer)',
      'Penyuntikan Tagar (#Hashtags) Viral Automatik',
      'Integrasi Bot Telegram & Webhook Segera'
    ]
  },
  {
    id: 'revenue',
    stepNum: '04',
    name: 'Revenue Vault',
    title: 'TheViralFinds — Peti Komisen & Untung Bersih',
    subtitle: 'Real-Time Telemetry, Payouts & Profit Optimization',
    cameraPos: [28, 22, 8],
    targetPos: [24, 3, -4],
    badgeColor: '#1b55ff',
    stats: [
      { label: 'Purata Komisen', value: 'RM14,850/bln' },
      { label: 'Pindahan Bank', value: 'Segera / T+1' },
      { label: 'Kadar Penukaran', value: '+352%' }
    ],
    description: 'Papan pemuka kewangan masa nyata yang menjejak setiap klik pautan afiliasi, komisen jualan Shopee/TikTok, dan pengoptimuman kadar penukaran.',
    features: [
      'Penjejakan Klik SubID Unik & Pautan Pendek',
      'Kalkulator Untung Bersih Tolak Kos Iklan',
      'Integrasi Bank Tempatan & Payout Automatik'
    ]
  },
  {
    id: 'hermes',
    stepNum: '05',
    name: 'Hermes HQ',
    title: 'TheViralFinds — Ibu Pejabat Autonomi Hermes OS',
    subtitle: '24/7 Sovereign Agent Command & Self-Healing Core',
    cameraPos: [8, 26, -10],
    targetPos: [0, 5, -20],
    badgeColor: '#1b55ff',
    stats: [
      { label: 'Subagent Aktif', value: '12 Ejen AI' },
      { label: 'Watchdog Uptime', value: '100% 24/7' },
      { label: 'Kelajuan Respon', value: '140ms' }
    ],
    description: 'Pusat arahan AI Hermes yang mengendalikan keseluruhan ekosistem pemasaran secara autonomi dengan perlindungan Managed Scope dan pemantauan 24/7.',
    features: [
      'Kawalan Penuh Telegram Bot (@StadeumHermesBot)',
      'Model Termaju NVIDIA MiniMax M3 Autopilot',
      'Swa-Pulih Automatik Watchdog (Self-Healing)'
    ]
  }
];

export const TVF_HOTSPOTS: TVFHotspot[] = [
  {
    id: 'hotspot-scout-truck',
    stationId: 'radar',
    title: 'Lori Penghantaran Shopee / TikTok',
    position: [-22, 3.5, -6],
    metric: '45k produk/hari',
    details: 'Armada logistik pintar yang mengumpulkan sampel produk viral terus daripada pembekal.',
    actionText: 'Imbas Produk Viral'
  },
  {
    id: 'hotspot-studio-warehouse',
    stationId: 'studio',
    title: 'Gudang Rak & Studio Rakaman',
    position: [-10, 4.5, 12],
    metric: '42s / video HD',
    details: 'Fasiliti penggambaran digital berautomasi dengan rak produk fizikal dan suara latar Yasmin.',
    actionText: 'Dengar Suara Yasmin'
  },
  {
    id: 'hotspot-launch-tower',
    stationId: 'launchpad',
    title: 'Menara Pemancar Multi-Saluran',
    position: [14, 7, 14],
    metric: '6 Saluran Siaran',
    details: 'Menara satelit yang menyiarkan video kempen ke TikTok, Reels, dan Shorts serentak.',
    actionText: 'Semak Jadual Siaran'
  },
  {
    id: 'hotspot-revenue-vault',
    stationId: 'revenue',
    title: 'Peti Tunai & Kiraan Komisen',
    position: [24, 4.5, -4],
    metric: 'RM14,850/bulan',
    details: 'Kiraan hasil komisen jualan afiliasi masa nyata berserta pemindahan bank segera.',
    actionText: 'Kira Dividen Untung'
  },
  {
    id: 'hotspot-hermes-tower',
    stationId: 'hermes',
    title: 'Ibu Pejabat Korporat Hermes OS',
    position: [0, 8.5, -20],
    metric: '24/7 Online Active',
    details: 'Pencakar langit korporat moden yang menempatkan pelayan pintar dan ejen AI swa-pulih.',
    actionText: 'Buka Status AI'
  }
];

export class TVFSceneEngine {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private canvas: HTMLCanvasElement;
  private animFrameId: number | null = null;

  // Material Library (Daylight Architectural Palette)
  private mats: {
    ground: THREE.MeshStandardMaterial;
    road: THREE.MeshStandardMaterial;
    pavement: THREE.MeshStandardMaterial;
    whiteWall: THREE.MeshStandardMaterial;
    greyWall: THREE.MeshStandardMaterial;
    darkGlass: THREE.MeshStandardMaterial;
    tvfBlue: THREE.MeshStandardMaterial;
    tvfRed: THREE.MeshStandardMaterial;
    tvfLime: THREE.MeshStandardMaterial;
    cardboard: THREE.MeshStandardMaterial;
    steel: THREE.MeshStandardMaterial;
    foliage1: THREE.MeshStandardMaterial;
    foliage2: THREE.MeshStandardMaterial;
    woodTrunk: THREE.MeshStandardMaterial;
    roofSolar: THREE.MeshStandardMaterial;
  };

  // Animated elements
  private trucks: THREE.Group[] = [];
  private satelliteDish?: THREE.Group;
  private studioForklift?: THREE.Group;

  // Camera state
  private targetCamPos = new THREE.Vector3(-28, 22, 12);
  private currentTarget = new THREE.Vector3(-22, 2, -6);
  private targetLookAt = new THREE.Vector3(-22, 2, -6);
  private onHotspotUpdate?: (hotspots: { id: string; x: number; y: number; visible: boolean }[]) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();

    // Clean daylight sky/background matching Emons
    this.scene.background = new THREE.Color('#eef1f6');
    this.scene.fog = new THREE.FogExp2('#eef1f6', 0.009);

    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(28, aspect, 0.5, 300);
    this.camera.position.set(-28, 22, 12);
    this.camera.lookAt(-22, 2, -6);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.mats = this.initMaterials();
    this.setupDaylight();
    this.buildTerrainAndRoads();
    this.buildStation01RadarFleet();
    this.buildStation02StudioWarehouse();
    this.buildStation03LaunchpadSeaport();
    this.buildStation04RevenueTerminal();
    this.buildStation05HermesHQ();
    this.populateLowPolyTrees();

    this.startLoop();
  }

  private initMaterials() {
    return {
      ground: new THREE.MeshStandardMaterial({ color: '#e2e7ef', roughness: 0.9 }),
      road: new THREE.MeshStandardMaterial({ color: '#4a5568', roughness: 0.8 }),
      pavement: new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.7 }),
      whiteWall: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 }),
      greyWall: new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.6 }),
      darkGlass: new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.1, metalness: 0.8 }),
      tvfBlue: new THREE.MeshStandardMaterial({ color: '#1b55ff', roughness: 0.3, metalness: 0.2 }),
      tvfRed: new THREE.MeshStandardMaterial({ color: '#e52421', roughness: 0.3, metalness: 0.1 }),
      tvfLime: new THREE.MeshStandardMaterial({ color: '#84cc16', roughness: 0.4 }),
      cardboard: new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.8 }),
      steel: new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.3, metalness: 0.8 }),
      foliage1: new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.8, flatShading: true }),
      foliage2: new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.8, flatShading: true }),
      woodTrunk: new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9 }),
      roofSolar: new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.2, metalness: 0.7 })
    };
  }

  public setHotspotCallback(cb: (hotspots: { id: string; x: number; y: number; visible: boolean }[]) => void) {
    this.onHotspotUpdate = cb;
  }

  private setupDaylight() {
    // Warm hemisphere ambient light (sky/ground contrast)
    const hemiLight = new THREE.HemisphereLight('#ffffff', '#cbd5e1', 1.2);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    // Warm directional sunlight creating clean shadows
    const sunLight = new THREE.DirectionalLight('#fffaf0', 1.8);
    sunLight.position.set(45, 60, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.camera.left = -55;
    sunLight.shadow.camera.right = 55;
    sunLight.shadow.camera.top = 55;
    sunLight.shadow.camera.bottom = -55;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    // Soft fill light from opposite angle
    const fillLight = new THREE.DirectionalLight('#e0f2fe', 0.6);
    fillLight.position.set(-30, 40, -30);
    this.scene.add(fillLight);
  }

  private buildTerrainAndRoads() {
    // Main circular base
    const groundGeo = new THREE.CylinderGeometry(55, 55, 1, 64);
    const ground = new THREE.Mesh(groundGeo, this.mats.ground);
    ground.position.y = -0.55;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Asphalt ring road connecting the facilities
    const roadGroup = new THREE.Group();
    const roadGeo = new THREE.RingGeometry(18, 28, 48);
    const road = new THREE.Mesh(roadGeo, this.mats.road);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.01;
    road.receiveShadow = true;
    roadGroup.add(road);

    // White dashed center line
    const dashGeo = new THREE.RingGeometry(22.8, 23.2, 48);
    const dashMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const dash = new THREE.Mesh(dashGeo, dashMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.y = 0.02;
    roadGroup.add(dash);

    this.scene.add(roadGroup);
  }

  // Helper: Low-poly Freight Semi-Truck (like Emons red/blue trucks)
  private createSemiTruck(colorMat: THREE.MeshStandardMaterial): THREE.Group {
    const truck = new THREE.Group();

    // 1. Cab
    const cabGeo = new THREE.BoxGeometry(2.4, 2.6, 2.0);
    const cab = new THREE.Mesh(cabGeo, colorMat);
    cab.position.set(3.2, 1.6, 0);
    cab.castShadow = true;
    truck.add(cab);

    // Windshield (dark glass)
    const glassGeo = new THREE.BoxGeometry(0.8, 1.0, 1.8);
    const glass = new THREE.Mesh(glassGeo, this.mats.darkGlass);
    glass.position.set(4.05, 2.0, 0);
    truck.add(glass);

    // 2. White Trailer
    const trailerGeo = new THREE.BoxGeometry(5.8, 2.8, 2.1);
    const trailer = new THREE.Mesh(trailerGeo, this.mats.whiteWall);
    trailer.position.set(-1.0, 1.8, 0);
    trailer.castShadow = true;
    trailer.receiveShadow = true;
    truck.add(trailer);

    // Blue/Red branding stripe on trailer
    const stripeGeo = new THREE.BoxGeometry(5.85, 0.5, 2.15);
    const stripe = new THREE.Mesh(stripeGeo, colorMat);
    stripe.position.set(-1.0, 1.8, 0);
    truck.add(stripe);

    // 3. Wheels (6 black cylinders)
    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.9 });
    const wheelPositions = [
      [3.2, 0.45, 1.05], [3.2, 0.45, -1.05],
      [-2.0, 0.45, 1.1], [-2.0, 0.45, -1.1],
      [-3.0, 0.45, 1.1], [-3.0, 0.45, -1.1]
    ];
    wheelPositions.forEach(([x, y, z]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, y, z);
      wheel.castShadow = true;
      truck.add(wheel);
    });

    return truck;
  }

  // --- 01. PRODUCT SCOUT DEPOT (Emons Road Fleet style) ---
  private buildStation01RadarFleet() {
    const group = new THREE.Group();
    group.position.set(-22, 0, -6);

    // Warehouse Logistics Building (White with Red Architectural Frame)
    const buildingGeo = new THREE.BoxGeometry(14, 5.5, 8);
    const building = new THREE.Mesh(buildingGeo, this.mats.whiteWall);
    building.position.set(0, 2.75, -4);
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);

    // Red Portal Entrance (Exact Emons Red Accent)
    const portalGeo = new THREE.BoxGeometry(3, 4, 1);
    const portal = new THREE.Mesh(portalGeo, this.mats.tvfRed);
    portal.position.set(-4, 2, 0.5);
    portal.castShadow = true;
    group.add(portal);

    // Angled Loading Bays (3 dark garage shutters)
    for (let i = 0; i < 3; i++) {
      const bayGeo = new THREE.BoxGeometry(2.4, 3.2, 0.2);
      const bay = new THREE.Mesh(bayGeo, this.mats.greyWall);
      bay.position.set(0.5 + i * 3.2, 1.6, 0.1);
      group.add(bay);
    }

    // Semi Trucks parked at the loading bays
    const truck1 = this.createSemiTruck(this.mats.tvfRed);
    truck1.position.set(0.5, 0, 4.5);
    truck1.rotation.y = Math.PI / 2;
    group.add(truck1);

    const truck2 = this.createSemiTruck(this.mats.tvfBlue);
    truck2.position.set(4.0, 0, 4.5);
    truck2.rotation.y = Math.PI / 2;
    group.add(truck2);

    this.scene.add(group);
  }

  // --- 02. CUTAWAY WAREHOUSE & AI STUDIO (Emons Logistics style) ---
  private buildStation02StudioWarehouse() {
    const group = new THREE.Group();
    group.position.set(-10, 0, 12);

    // Cutaway Warehouse Base & Back Wall
    const backWallGeo = new THREE.BoxGeometry(12, 6, 0.6);
    const backWall = new THREE.Mesh(backWallGeo, this.mats.greyWall);
    backWall.position.set(0, 3, -4);
    backWall.castShadow = true;
    group.add(backWall);

    const sideWallGeo = new THREE.BoxGeometry(0.6, 6, 8);
    const sideWall = new THREE.Mesh(sideWallGeo, this.mats.greyWall);
    sideWall.position.set(-6, 3, 0);
    sideWall.castShadow = true;
    group.add(sideWall);

    // Multi-tier Storage Racks loaded with cardboard boxes
    const rackGroup = new THREE.Group();
    rackGroup.position.set(-1.5, 0, -2.5);

    // Steel Rack Frame
    for (let col = 0; col < 4; col++) {
      for (let lvl = 0; lvl < 3; lvl++) {
        // Shelf Beam
        const beamGeo = new THREE.BoxGeometry(2.2, 0.1, 1.2);
        const beam = new THREE.Mesh(beamGeo, this.mats.steel);
        beam.position.set(col * 2.4 - 3.5, lvl * 1.6 + 0.8, 0);
        rackGroup.add(beam);

        // Cardboard boxes on shelf
        for (let b = 0; b < 2; b++) {
          const boxGeo = new THREE.BoxGeometry(0.9, 0.8, 0.9);
          const box = new THREE.Mesh(boxGeo, this.mats.cardboard);
          box.position.set(col * 2.4 - 3.5 + (b * 1.0 - 0.45), lvl * 1.6 + 1.25, 0);
          box.castShadow = true;
          rackGroup.add(box);
        }
      }
    }
    group.add(rackGroup);

    // Red Forklift
    const forklift = new THREE.Group();
    forklift.position.set(2.5, 0, 1.5);
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.1), this.mats.tvfRed);
    body.position.y = 0.8;
    body.castShadow = true;
    forklift.add(body);

    const mast = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.5, 0.9), this.mats.steel);
    mast.position.set(0.9, 1.3, 0);
    forklift.add(mast);

    const forks = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 0.8), this.mats.steel);
    forks.position.set(1.4, 0.5, 0);
    forklift.add(forks);

    group.add(forklift);
    this.studioForklift = forklift;

    this.scene.add(group);
  }

  // --- 03. MULTI-CHANNEL SEAPORT & AIRPORT (Emons Air & Sea style) ---
  private buildStation03LaunchpadSeaport() {
    const group = new THREE.Group();
    group.position.set(14, 0, 14);

    // Water basin (Faceted blue ocean polygon)
    const waterGeo = new THREE.CylinderGeometry(8, 8, 0.4, 24);
    const waterMat = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      roughness: 0.1,
      metalness: 0.3,
      flatShading: true
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.set(2, 0.1, 2);
    water.receiveShadow = true;
    group.add(water);

    // Seaport Concrete Quay / Dock
    const quayGeo = new THREE.BoxGeometry(9, 0.8, 5);
    const quay = new THREE.Mesh(quayGeo, this.mats.pavement);
    quay.position.set(-2, 0.4, -2);
    quay.castShadow = true;
    quay.receiveShadow = true;
    group.add(quay);

    // Red Gantry Container Crane
    const craneGroup = new THREE.Group();
    craneGroup.position.set(-2, 0, 0);

    const legGeo = new THREE.BoxGeometry(0.4, 6.5, 0.4);
    const leg1 = new THREE.Mesh(legGeo, this.mats.tvfRed);
    leg1.position.set(-2, 3.25, -1.8);
    craneGroup.add(leg1);

    const leg2 = new THREE.Mesh(legGeo, this.mats.tvfRed);
    leg2.position.set(2, 3.25, -1.8);
    craneGroup.add(leg2);

    const topBeamGeo = new THREE.BoxGeometry(6.5, 0.6, 3.5);
    const topBeam = new THREE.Mesh(topBeamGeo, this.mats.tvfRed);
    topBeam.position.set(0, 6.5, 0);
    topBeam.castShadow = true;
    craneGroup.add(topBeam);

    group.add(craneGroup);

    // Cargo Container Ship
    const ship = new THREE.Group();
    ship.position.set(3, 0.3, 3);

    const hullGeo = new THREE.BoxGeometry(7, 1.2, 2.8);
    const hull = new THREE.Mesh(hullGeo, this.mats.tvfRed);
    hull.castShadow = true;
    ship.add(hull);

    // Containers on ship
    const containerColors = [this.mats.tvfBlue, this.mats.whiteWall, this.mats.tvfLime];
    for (let c = 0; c < 6; c++) {
      const cBox = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.9, 1.1),
        containerColors[c % containerColors.length]
      );
      cBox.position.set((c % 3) * 2 - 2, 1.1, (c < 3 ? -0.6 : 0.6));
      cBox.castShadow = true;
      ship.add(cBox);
    }

    group.add(ship);
    this.scene.add(group);
  }

  // --- 04. REVENUE RAIL TERMINAL (Emons Rail style) ---
  private buildStation04RevenueTerminal() {
    const group = new THREE.Group();
    group.position.set(24, 0, -4);

    // Railway Ground Bed
    const railBedGeo = new THREE.BoxGeometry(12, 0.3, 6);
    const railBed = new THREE.Mesh(railBedGeo, this.mats.road);
    railBed.position.y = 0.15;
    group.add(railBed);

    // Steel Tracks (2 parallel silver lines)
    for (let t = 0; t < 2; t++) {
      const track = new THREE.Mesh(new THREE.BoxGeometry(12, 0.1, 0.15), this.mats.steel);
      track.position.set(0, 0.35, -1 + t * 2);
      group.add(track);
    }

    // Red Freight Locomotive & Flatbed Cars
    const train = new THREE.Group();
    train.position.set(-1, 0.4, 0);

    // Locomotive
    const loco = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.2, 1.6), this.mats.tvfRed);
    loco.position.set(3, 1.2, 0);
    loco.castShadow = true;
    train.add(loco);

    // Flatbed carrying red TVF Container
    const flatbed = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.4, 1.6), this.mats.steel);
    flatbed.position.set(-1.8, 0.3, 0);
    train.add(flatbed);

    const cont = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 1.5), this.mats.tvfBlue);
    cont.position.set(-1.8, 1.4, 0);
    cont.castShadow = true;
    train.add(cont);

    group.add(train);
    this.scene.add(group);
  }

  // --- 05. HERMES HQ HEADQUARTERS (Emons Modern Office style) ---
  private buildStation05HermesHQ() {
    const group = new THREE.Group();
    group.position.set(0, 0, -20);

    // Main Corporate Skyscraper Tower
    const towerGeo = new THREE.BoxGeometry(8, 14, 8);
    const tower = new THREE.Mesh(towerGeo, this.mats.whiteWall);
    tower.position.set(0, 7, 0);
    tower.castShadow = true;
    tower.receiveShadow = true;
    group.add(tower);

    // Dark glass window grid strips
    for (let f = 1; f < 6; f++) {
      const windowStrip = new THREE.Mesh(new THREE.BoxGeometry(8.1, 1.0, 8.1), this.mats.darkGlass);
      windowStrip.position.set(0, f * 2.2 + 0.5, 0);
      group.add(windowStrip);
    }

    // Red Architectural Roof Portal & Trim (Emons HQ style)
    const roofTrim = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.6, 8.4), this.mats.tvfRed);
    roofTrim.position.set(0, 14.3, 0);
    group.add(roofTrim);

    // Rooftop Communications Satellite & Solar Panels
    const dishGroup = new THREE.Group();
    dishGroup.position.set(2, 15.2, 2);
    const dish = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.5),
      this.mats.steel
    );
    dish.rotation.x = -Math.PI / 3;
    dishGroup.add(dish);
    group.add(dishGroup);
    this.satelliteDish = dishGroup;

    // Solar panels on roof
    const solar = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 4), this.mats.roofSolar);
    solar.position.set(-2, 14.8, -1);
    solar.rotation.x = 0.2;
    group.add(solar);

    this.scene.add(group);
  }

  // Low-poly faceted green trees scattered around (like Emons landscape)
  private populateLowPolyTrees() {
    const treePositions = [
      [-15, -4], [-12, -2], [-18, 4], [-26, 6],
      [-5, 8], [-2, 16], [6, 12], [8, 4],
      [18, -12], [22, -14], [-8, -18], [12, -24]
    ];

    treePositions.forEach(([x, z], i) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);

      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.2, 6), this.mats.woodTrunk);
      trunk.position.y = 0.6;
      trunk.castShadow = true;
      tree.add(trunk);

      // Faceted Icosahedron Foliage
      const foliageGeo = new THREE.IcosahedronGeometry(1.2 + (i % 3) * 0.2, 0);
      const foliage = new THREE.Mesh(foliageGeo, i % 2 === 0 ? this.mats.foliage1 : this.mats.foliage2);
      foliage.position.y = 2.0;
      foliage.rotation.y = (i * Math.PI) / 3;
      foliage.castShadow = true;
      tree.add(foliage);

      this.scene.add(tree);
    });
  }

  // Camera navigation
  public navigateToWaypoint(waypoint: TVFWaypoint) {
    this.targetCamPos.set(...waypoint.cameraPos);
    this.targetLookAt.set(...waypoint.targetPos);
  }

  public handleResize() {
    if (!this.canvas) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // Animation Loop
  private startLoop() {
    let clock = new THREE.Clock();

    const animate = () => {
      this.animFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera lerp
      this.camera.position.lerp(this.targetCamPos, 0.05);
      this.currentTarget.lerp(this.targetLookAt, 0.05);
      this.camera.lookAt(this.currentTarget);

      // Rotate Satellite
      if (this.satelliteDish) {
        this.satelliteDish.rotation.y = Math.sin(elapsed * 0.4) * 0.5;
      }

      // Hotspot projections
      if (this.onHotspotUpdate && this.canvas) {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        const widthHalf = width / 2;
        const heightHalf = height / 2;

        const hotspotList = TVF_HOTSPOTS.map((h) => {
          const pos = new THREE.Vector3(...h.position);
          pos.project(this.camera);

          const isVisible = pos.z < 1 && pos.x >= -1.1 && pos.x <= 1.1 && pos.y >= -1.1 && pos.y <= 1.1;
          const x = pos.x * widthHalf + widthHalf;
          const y = -pos.y * heightHalf + heightHalf;

          return { id: h.id, x, y, visible: isVisible };
        });

        this.onHotspotUpdate(hotspotList);
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  public destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.renderer.dispose();
  }
}
