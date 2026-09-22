/**
 * VisionX - 3D Holographic Human Body Anatomy & Medical Diagnostic Scanner
 * Polished, futuristic, and highly interactive.
 * Features:
 * - Sculpted humanoid anatomy with dual-pass physically believable holographic materials
 * - Vascular arterial and venous pulse networks
 * - 8 Major Interactive Organs: Brain, Heart, Lungs, Liver, Kidneys, Stomach, Intestines, Pancreas
 * - Cellular Genome Locus Core
 * - Animated medical laser scanner sweeps and pulsing target reticles
 * - Rich medical metadata registry for all organs
 */
import * as THREE from 'three';

export const ORGAN_METADATA = {
  brain: {
    id: 'brain',
    name: 'Brain & Central Nervous System',
    simpleName: 'Brain',
    system: 'Nervous System',
    icon: '🧠',
    disorderKey: 'huntington',
    cameraPos: new THREE.Vector3(0, 11.6, 5.0),
    cameraTarget: new THREE.Vector3(0, 11.6, 0),
    function: 'Processes sensory signals, controls motor coordination, regulates emotion, memory, and executive reasoning.',
    facts: 'Contains approximately 86 billion neurons, consuming 20% of total body oxygen and glucose despite being 2% of body mass.',
    relatedDiseases: 'Huntington\'s Disease (toxic polyQ aggregates), Alzheimer\'s, Parkinson\'s, Glioblastoma.',
    scale: 'ORGAN → NEURAL TISSUE → SYNAPSE'
  },
  heart: {
    id: 'heart',
    name: 'Heart & Cardiovascular System',
    simpleName: 'Heart / Blood',
    system: 'Cardiovascular System',
    icon: '❤️',
    disorderKey: 'sickle_cell',
    cameraPos: new THREE.Vector3(0.3, 7.1, 5.0),
    cameraTarget: new THREE.Vector3(0.3, 7.1, 0),
    function: 'Pumps oxygenated erythrocytes and nutrient-rich plasma through 60,000 miles of blood vessels.',
    facts: 'Beats ~100,000 times per day, pumping over 2,000 gallons of blood continuously without resting.',
    relatedDiseases: 'Sickle Cell Anemia (HBB mutation), Atherosclerosis, Arrhythmia, Myocardial Infarction.',
    scale: 'ORGAN → VASCULAR BED → ERYTHROCYTE'
  },
  lungs: {
    id: 'lungs',
    name: 'Lungs & Respiratory System',
    simpleName: 'Lungs',
    system: 'Respiratory System',
    icon: '🫁',
    disorderKey: 'cystic_fibrosis',
    cameraPos: new THREE.Vector3(0, 7.4, 5.5),
    cameraTarget: new THREE.Vector3(0, 7.4, 0),
    function: 'Facilitates gas exchange: absorbs atmospheric oxygen into pulmonary capillaries and expels carbon dioxide.',
    facts: 'Houses 480 million microscopic alveoli providing a gas exchange surface area equivalent to half a tennis court.',
    relatedDiseases: 'Cystic Fibrosis (CFTR deletion ΔF508), Asthma, Pulmonary Fibrosis, COPD.',
    scale: 'ORGAN → BRONCHIOLE → ALVEOLAR CELL'
  },
  liver: {
    id: 'liver',
    name: 'Liver (Hepatic Metabolic Factory)',
    simpleName: 'Liver',
    system: 'Digestive & Metabolic System',
    icon: '🟤',
    disorderKey: 'sickle_cell', // Linked to hemoglobin breakdown & metabolic clearance
    cameraPos: new THREE.Vector3(-0.8, 5.6, 5.0),
    cameraTarget: new THREE.Vector3(-0.8, 5.6, 0),
    function: 'Synthesizes plasma proteins, metabolizes nutrients, detoxifies metabolites, and secretes digestive bile.',
    facts: 'The only internal human organ capable of natural regeneration; as little as 25% of liver tissue can regenerate into a full organ.',
    relatedDiseases: 'Cirrhosis, Wilson\'s Disease (ATP7B mutation), Hemochromatosis, Viral Hepatitis.',
    scale: 'ORGAN → HEPATIC LOBULE → HEPATOCYTE'
  },
  kidneys: {
    id: 'kidneys',
    name: 'Kidneys & Renal Filtration System',
    simpleName: 'Kidneys',
    system: 'Urinary & Renal System',
    icon: '🫘',
    disorderKey: 'cystic_fibrosis', // Linked to electrolyte & osmotic channel regulation
    cameraPos: new THREE.Vector3(0, 4.2, 5.2),
    cameraTarget: new THREE.Vector3(0, 4.2, 0),
    function: 'Filters cellular waste products from blood, maintains electrolyte osmolarity, and regulates blood pressure via renin.',
    facts: 'Contain 2 million functional nephrons that continuously filter over 50 gallons of fluid every 24 hours.',
    relatedDiseases: 'Polycystic Kidney Disease (PKD1/PKD2 mutations), Glomerulonephritis, Chronic Renal Failure.',
    scale: 'ORGAN → RENAL NEPHRON → PODOCYTE'
  },
  stomach: {
    id: 'stomach',
    name: 'Stomach & Gastrointestinal Reservoir',
    simpleName: 'Stomach',
    system: 'Digestive System',
    icon: '🥣',
    disorderKey: 'cystic_fibrosis',
    cameraPos: new THREE.Vector3(0.7, 5.4, 5.0),
    cameraTarget: new THREE.Vector3(0.7, 5.4, 0),
    function: 'Secretes hydrochloric acid and pepsinogen to chemically digest proteins into chyme while sterilizing food.',
    facts: 'Gastric acid has a pH of 1.5 to 2.0 (strong enough to dissolve metals), lined by epithelial mucus renewed every 3-5 days.',
    relatedDiseases: 'Peptic Ulcer Disease, Gastric Adenocarcinoma, Pernicious Anemia, Gastroparesis.',
    scale: 'ORGAN → GASTRIC PIT → PARIETAL CELL'
  },
  intestines: {
    id: 'intestines',
    name: 'Intestines & Enteric Absorption System',
    simpleName: 'Intestines',
    system: 'Digestive & Immune System',
    icon: '〰️',
    disorderKey: 'cystic_fibrosis',
    cameraPos: new THREE.Vector3(0, 3.2, 5.2),
    cameraTarget: new THREE.Vector3(0, 3.2, 0),
    function: 'Absorbs amino acids, sugars, fatty acids, water, and houses trillions of symbiotic microbiome bacteria.',
    facts: 'The small and large intestines span ~25 feet, covered in microvilli creating an absorptive surface area over 320 square feet.',
    relatedDiseases: 'Celiac Disease, Crohn\'s Disease, Ulcerative Colitis, Familial Adenomatous Polyposis.',
    scale: 'ORGAN → INTESTINAL VILLUS → ENTEROCYTE'
  },
  pancreas: {
    id: 'pancreas',
    name: 'Pancreas (Endocrine & Digestive Hub)',
    simpleName: 'Pancreas',
    system: 'Endocrine & Exocrine System',
    icon: '🥖',
    disorderKey: 'cystic_fibrosis', // Mucus blocks pancreatic ducts in CF
    cameraPos: new THREE.Vector3(0.1, 4.8, 5.0),
    cameraTarget: new THREE.Vector3(0.1, 4.8, 0),
    function: 'Produces glucose-regulating hormones (insulin & glucagon) and secretes pancreatic digestive enzymes into duodenum.',
    facts: 'Houses over 1 million microscopic Islets of Langerhans that continuously monitor systemic blood glucose levels in real time.',
    relatedDiseases: 'Type 1 Diabetes (Autoimmune beta cell destruction), Pancreatitis, Pancreatic Ductal Carcinoma.',
    scale: 'ORGAN → ISLET OF LANGERHANS → BETA CELL'
  },
  genome: {
    id: 'genome',
    name: 'Cellular Genome & Genetic Blueprint',
    simpleName: 'DNA & Chromosomes',
    system: 'Cellular & Molecular Core',
    icon: '🧬',
    disorderKey: 'down_syndrome',
    cameraPos: new THREE.Vector3(0, 2.0, 5.0),
    cameraTarget: new THREE.Vector3(0, 2.0, 0),
    function: 'Contains the complete human genome instruction manual encoded in 3.2 billion base pairs across 23 chromosome pairs.',
    facts: 'Every microscopic human cell nucleus contains ~2 meters of uncoiled DNA packed into a space just 6 micrometers wide.',
    relatedDiseases: 'Trisomy 21 (Down Syndrome), Turner Syndrome, Chromosomal Translocations.',
    scale: 'NUCLEUS → CHROMOSOME → B-DNA HELIX'
  }
};

export class BodyModel {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'Human_Body_Hologram';
    this.group.visible = false;
    this.scene.add(this.group);

    this.organHotspots = [];
    this.organMeshesMap = {};
    this.isScanning = true;
    this.scanDirection = 1;
    this.scanHeight = 0;
    this.activeHighlightedOrgan = null;

    this.initMaterials();
    this.buildSculptedHumanBody();
    this.buildVascularSystem();
    this.buildOrganNodes();
    this.buildScanningLaser();
  }

  initMaterials() {
    // Holographic Translucent Skin - Sleek, smooth, and futuristic
    this.skinMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.38,
      roughness: 0.22,
      metalness: 0.15,
      transparent: true,
      opacity: 0.62,
      transmission: 0.35,
      ior: 1.25,
      clearcoat: 0.5
    });

    // Wireframe overlay for high-tech medical scan effect
    this.wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });

    // Joint and bone glow
    this.accentMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.85,
      roughness: 0.25
    });

    // Specialized organ materials with distinct medical color signatures
    this.organMaterials = {
      brain: new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0xa855f7,
        emissiveIntensity: 0.95,
        roughness: 0.25,
        metalness: 0.2
      }),
      heart: new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0xe11d48,
        emissiveIntensity: 1.1,
        roughness: 0.2,
        metalness: 0.2
      }),
      lungs: new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.9,
        roughness: 0.25,
        metalness: 0.2
      }),
      liver: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.95,
        roughness: 0.3,
        metalness: 0.2
      }),
      kidneys: new THREE.MeshStandardMaterial({
        color: 0xec4899,
        emissive: 0xdb2777,
        emissiveIntensity: 0.95,
        roughness: 0.25,
        metalness: 0.2
      }),
      stomach: new THREE.MeshStandardMaterial({
        color: 0x14b8a6,
        emissive: 0x0d9488,
        emissiveIntensity: 0.9,
        roughness: 0.3,
        metalness: 0.2
      }),
      intestines: new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        emissive: 0x7c3aed,
        emissiveIntensity: 0.9,
        roughness: 0.3,
        metalness: 0.2
      }),
      pancreas: new THREE.MeshStandardMaterial({
        color: 0xeab308,
        emissive: 0xca8a04,
        emissiveIntensity: 0.95,
        roughness: 0.25,
        metalness: 0.2
      }),
      genome: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.95,
        roughness: 0.25,
        metalness: 0.2
      })
    };
  }

  buildSculptedHumanBody() {
    this.bodyGroup = new THREE.Group();

    // 1. Organic Head with jawline contour
    const headGeo = new THREE.SphereGeometry(1.4, 32, 24);
    headGeo.scale(0.85, 1.15, 1.0);
    const headMesh = new THREE.Mesh(headGeo, this.skinMat);
    const headWire = new THREE.Mesh(headGeo, this.wireMat);
    headMesh.position.set(0, 11.5, 0);
    headWire.position.set(0, 11.5, 0);
    this.bodyGroup.add(headMesh, headWire);

    // 2. Neck with natural throat contour
    const neckGeo = new THREE.CylinderGeometry(0.65, 0.85, 1.4, 24);
    const neckMesh = new THREE.Mesh(neckGeo, this.skinMat);
    neckMesh.position.set(0, 9.9, 0);
    this.bodyGroup.add(neckMesh);

    // 3. Anatomical Contoured Torso using Lathe (Shoulders -> Chest -> Tapered Waist -> Flared Hips)
    const torsoPoints = [
      new THREE.Vector2(0.9, 9.4),   // Base of neck
      new THREE.Vector2(2.4, 9.0),   // Broad shoulders / Clavicle
      new THREE.Vector2(2.5, 7.8),   // Pectoral chest
      new THREE.Vector2(2.1, 6.2),   // Lower ribcage
      new THREE.Vector2(1.7, 4.6),   // Tapered athletic waist
      new THREE.Vector2(2.1, 2.8),   // Flared anatomical hips
      new THREE.Vector2(1.9, 1.2),   // Pelvis / Groin
      new THREE.Vector2(0.2, 0.8)    // Base
    ];
    const torsoGeo = new THREE.LatheGeometry(torsoPoints, 32);
    torsoGeo.scale(1.0, 1.0, 0.65);
    torsoGeo.computeVertexNormals();

    const torsoMesh = new THREE.Mesh(torsoGeo, this.skinMat);
    const torsoWire = new THREE.Mesh(torsoGeo, this.wireMat);
    this.bodyGroup.add(torsoMesh, torsoWire);

    // 4. Contoured Organic Arms (Deltoid -> Bicep -> Elbow -> Forearm -> Hand)
    [-1, 1].forEach((side) => {
      // Deltoid Shoulder
      const shoulderGeo = new THREE.SphereGeometry(0.85, 20, 20);
      shoulderGeo.scale(0.9, 1.1, 0.9);
      const shoulder = new THREE.Mesh(shoulderGeo, this.skinMat);
      shoulder.position.set(side * 2.55, 8.8, 0);
      this.bodyGroup.add(shoulder);

      // Upper Arm
      const bicepCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 2.65, 8.6, 0),
        new THREE.Vector3(side * 3.0, 7.0, 0.05),
        new THREE.Vector3(side * 3.15, 5.6, 0)
      ]);
      const bicepGeo = new THREE.TubeGeometry(bicepCurve, 16, 0.52, 16, false);
      const bicepMesh = new THREE.Mesh(bicepGeo, this.skinMat);
      this.bodyGroup.add(bicepMesh);

      // Elbow
      const elbowGeo = new THREE.SphereGeometry(0.48, 16, 16);
      const elbow = new THREE.Mesh(elbowGeo, this.accentMat);
      elbow.position.set(side * 3.15, 5.5, 0);
      this.bodyGroup.add(elbow);

      // Forearm
      const forearmCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 3.15, 5.4, 0),
        new THREE.Vector3(side * 3.4, 3.8, 0.1),
        new THREE.Vector3(side * 3.5, 2.2, 0.1)
      ]);
      const forearmGeo = new THREE.TubeGeometry(forearmCurve, 16, 0.42, 16, false);
      const forearmMesh = new THREE.Mesh(forearmGeo, this.skinMat);
      this.bodyGroup.add(forearmMesh);

      // Hand
      const handGeo = new THREE.BoxGeometry(0.45, 1.1, 0.7);
      handGeo.translate(0, -0.5, 0);
      const hand = new THREE.Mesh(handGeo, this.skinMat);
      hand.position.set(side * 3.55, 2.1, 0.1);
      hand.rotation.z = side * -0.15;
      this.bodyGroup.add(hand);
    });

    // 5. Contoured Organic Legs
    [-1, 1].forEach((side) => {
      // Upper Thigh
      const thighCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 1.25, 1.2, 0),
        new THREE.Vector3(side * 1.35, -1.8, 0.1),
        new THREE.Vector3(side * 1.3, -4.8, 0)
      ]);
      const thighGeo = new THREE.TubeGeometry(thighCurve, 20, 0.82, 20, false);
      const thighMesh = new THREE.Mesh(thighGeo, this.skinMat);
      const thighWire = new THREE.Mesh(thighGeo, this.wireMat);
      this.bodyGroup.add(thighMesh, thighWire);

      // Knee Joint
      const kneeGeo = new THREE.SphereGeometry(0.68, 20, 20);
      const knee = new THREE.Mesh(kneeGeo, this.accentMat);
      knee.position.set(side * 1.3, -5.0, 0.05);
      this.bodyGroup.add(knee);

      // Calf muscle
      const calfCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 1.3, -5.2, 0.05),
        new THREE.Vector3(side * 1.38, -6.8, -0.1),
        new THREE.Vector3(side * 1.25, -9.2, 0)
      ]);
      const calfGeo = new THREE.TubeGeometry(calfCurve, 20, 0.65, 20, false);
      const calfMesh = new THREE.Mesh(calfGeo, this.skinMat);
      const calfWire = new THREE.Mesh(calfGeo, this.wireMat);
      this.bodyGroup.add(calfMesh, calfWire);

      // Foot
      const footGeo = new THREE.BoxGeometry(0.85, 0.55, 1.8);
      footGeo.translate(0, 0, 0.4);
      const foot = new THREE.Mesh(footGeo, this.skinMat);
      foot.position.set(side * 1.25, -9.6, 0);
      this.bodyGroup.add(foot);
    });

    // Holographic Medical Pedestal with concentric glowing rings
    const platformGeo = new THREE.CylinderGeometry(5.5, 6.2, 0.5, 32);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x071026,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.85
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -10.2;
    this.bodyGroup.add(platform);

    for (let r = 1; r <= 3; r++) {
      const ringGeo = new THREE.RingGeometry(r * 1.6, r * 1.6 + 0.08, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -9.92 + r * 0.02;
      this.bodyGroup.add(ring);
    }

    this.group.add(this.bodyGroup);
  }

  buildVascularSystem() {
    this.vascularGroup = new THREE.Group();

    const arteryMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.85 });
    const veinMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });

    // Main Aorta & Vena Cava
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.2, 7.5, 0.1),
      new THREE.Vector3(0.1, 5.0, 0.05),
      new THREE.Vector3(0.3, 3.0, 0),
      new THREE.Vector3(0.7, 1.2, 0)
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 24, 0.14, 8, false);
    const aortaMesh = new THREE.Mesh(aortaGeo, arteryMat);
    this.vascularGroup.add(aortaMesh);

    const venaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, 7.5, 0.1),
      new THREE.Vector3(-0.1, 5.0, 0.05),
      new THREE.Vector3(-0.3, 3.0, 0),
      new THREE.Vector3(-0.7, 1.2, 0)
    ]);
    const venaGeo = new THREE.TubeGeometry(venaCurve, 24, 0.14, 8, false);
    const venaMesh = new THREE.Mesh(venaGeo, veinMat);
    this.vascularGroup.add(venaMesh);

    this.group.add(this.vascularGroup);
  }

  buildOrganNodes() {
    this.organsGroup = new THREE.Group();

    // Helper to register hotspot
    const registerHotspot = (mesh, organKey) => {
      const meta = ORGAN_METADATA[organKey];
      mesh.userData = {
        id: meta.id,
        organKey: meta.id,
        name: meta.name,
        simpleName: meta.simpleName,
        organ: meta.simpleName,
        system: meta.system,
        icon: meta.icon,
        disorderKey: meta.disorderKey,
        description: meta.function,
        facts: meta.facts,
        relatedDiseases: meta.relatedDiseases,
        scale: meta.scale,
        isOrganHotspot: true
      };
      this.organHotspots.push(mesh);
      this.organMeshesMap[organKey] = mesh;
    };

    // Helper to create glowing animated reticle around an organ
    const createReticle = (pos, radius = 1.1) => {
      const reticleGeo = new THREE.RingGeometry(radius, radius + 0.12, 32);
      const reticleMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const reticle = new THREE.Mesh(reticleGeo, reticleMat);
      reticle.position.copy(pos);
      this.organsGroup.add(reticle);
      return reticle;
    };

    // 1. BRAIN (Cerebral Hemispheres + Cerebellum)
    const brainGroup = new THREE.Group();
    brainGroup.position.set(0, 11.6, 0);

    const leftHemiGeo = new THREE.SphereGeometry(0.7, 16, 16);
    leftHemiGeo.scale(0.8, 1.0, 1.2);
    const leftHemi = new THREE.Mesh(leftHemiGeo, this.organMaterials.brain);
    leftHemi.position.set(-0.35, 0, 0);

    const rightHemiGeo = new THREE.SphereGeometry(0.7, 16, 16);
    rightHemiGeo.scale(0.8, 1.0, 1.2);
    const rightHemi = new THREE.Mesh(rightHemiGeo, this.organMaterials.brain);
    rightHemi.position.set(0.35, 0, 0);

    const cerebGeo = new THREE.SphereGeometry(0.42, 14, 14);
    cerebGeo.scale(1.2, 0.7, 0.9);
    const cereb = new THREE.Mesh(cerebGeo, this.organMaterials.brain);
    cereb.position.set(0, -0.45, -0.45);

    brainGroup.add(leftHemi, rightHemi, cereb);
    registerHotspot(leftHemi, 'brain');
    registerHotspot(rightHemi, 'brain');
    registerHotspot(cereb, 'brain');
    createReticle(brainGroup.position, 1.3);

    // 2. LUNGS (Left & Right Multi-Lobed Airway Sacs)
    const lungsGroup = new THREE.Group();
    lungsGroup.position.set(0, 7.4, 0.1);

    [-1, 1].forEach((side) => {
      const lungGeo = new THREE.SphereGeometry(0.85, 18, 18);
      lungGeo.scale(0.72, 1.32, 0.72);
      const lungMesh = new THREE.Mesh(lungGeo, this.organMaterials.lungs);
      lungMesh.position.set(side * 0.98, 0, 0);
      lungsGroup.add(lungMesh);
      registerHotspot(lungMesh, 'lungs');
    });
    createReticle(lungsGroup.position, 1.6);

    // 3. HEART (Asymmetric Myocardial Muscle with Aortic Arch)
    const heartGeo = new THREE.SphereGeometry(0.68, 20, 20);
    heartGeo.scale(1.0, 1.25, 0.92);
    const heartMesh = new THREE.Mesh(heartGeo, this.organMaterials.heart);
    heartMesh.position.set(0.28, 7.1, 0.38);

    // Aortic Arch
    const aortaArcCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.2, 0.5, 0),
      new THREE.Vector3(0.0, 0.85, 0.1),
      new THREE.Vector3(-0.25, 0.55, 0.05)
    ]);
    const aortaArcGeo = new THREE.TubeGeometry(aortaArcCurve, 12, 0.14, 8, false);
    const aortaArcMesh = new THREE.Mesh(aortaArcGeo, this.organMaterials.heart);
    heartMesh.add(aortaArcMesh);

    registerHotspot(heartMesh, 'heart');
    this.heartMesh = heartMesh;
    createReticle(heartMesh.position, 1.1);

    // 4. LIVER (Anatomical broad wedge shape in right hypochondrium)
    const liverGeo = new THREE.CylinderGeometry(0.4, 1.45, 1.5, 16);
    liverGeo.scale(1.25, 0.75, 0.95);
    liverGeo.rotateZ(Math.PI * 0.35);
    const liverMesh = new THREE.Mesh(liverGeo, this.organMaterials.liver);
    liverMesh.position.set(-0.75, 5.6, 0.22);
    registerHotspot(liverMesh, 'liver');
    createReticle(liverMesh.position, 1.2);

    // 5. KIDNEYS (Bilateral retroperitoneal bean shapes with adrenal caps)
    const kidneysGroup = new THREE.Group();
    kidneysGroup.position.set(0, 4.2, -0.28);

    [-1, 1].forEach((side) => {
      const kidneyGeo = new THREE.SphereGeometry(0.46, 16, 16);
      kidneyGeo.scale(0.7, 1.35, 0.8);
      const kidneyMesh = new THREE.Mesh(kidneyGeo, this.organMaterials.kidneys);
      // Right kidney sits slightly lower due to liver
      const yOffset = side === -1 ? -0.15 : 0.08;
      kidneyMesh.position.set(side * 0.92, yOffset, 0);

      // Adrenal Gland cap
      const adrenalGeo = new THREE.ConeGeometry(0.22, 0.25, 8);
      const adrenalMat = this.organMaterials.pancreas;
      const adrenal = new THREE.Mesh(adrenalGeo, adrenalMat);
      adrenal.position.set(0, 0.52, 0);
      kidneyMesh.add(adrenal);

      kidneysGroup.add(kidneyMesh);
      registerHotspot(kidneyMesh, 'kidneys');
    });
    createReticle(kidneysGroup.position, 1.35);

    // 6. STOMACH (J-shaped digestive pouch in left epigastrium)
    const stomachCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.25, 6.1, 0.1),  // Cardia / Esophagus entry
      new THREE.Vector3(0.85, 5.6, 0.3),  // Fundus
      new THREE.Vector3(0.72, 4.9, 0.32), // Greater curvature
      new THREE.Vector3(0.22, 4.8, 0.2)   // Pylorus
    ]);
    const stomachGeo = new THREE.TubeGeometry(stomachCurve, 20, 0.48, 14, false);
    const stomachMesh = new THREE.Mesh(stomachGeo, this.organMaterials.stomach);
    registerHotspot(stomachMesh, 'stomach');
    createReticle(new THREE.Vector3(0.65, 5.3, 0.25), 1.05);

    // 7. INTESTINES (Coiled small intestine loops & surrounding large colon frame)
    const intestinesGroup = new THREE.Group();
    intestinesGroup.position.set(0, 3.2, 0.22);

    // Small intestine folded gyri
    const smallIntGeo = new THREE.TorusGeometry(0.85, 0.28, 12, 24);
    smallIntGeo.scale(1.1, 0.9, 0.6);
    const smallIntMesh = new THREE.Mesh(smallIntGeo, this.organMaterials.intestines);
    intestinesGroup.add(smallIntMesh);

    const smallInt2Geo = new THREE.SphereGeometry(0.7, 14, 14);
    smallInt2Geo.scale(1.2, 0.8, 0.7);
    const smallInt2 = new THREE.Mesh(smallInt2Geo, this.organMaterials.intestines);
    smallInt2.position.set(0, 0, 0.05);
    intestinesGroup.add(smallInt2);

    // Surrounding colon frame
    const colonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.15, -0.8, 0), // Cecum
      new THREE.Vector3(-1.15, 0.8, 0),  // Ascending
      new THREE.Vector3(0, 0.9, 0.05),    // Transverse
      new THREE.Vector3(1.15, 0.8, 0),   // Descending
      new THREE.Vector3(0.9, -0.9, 0)    // Sigmoid
    ]);
    const colonGeo = new THREE.TubeGeometry(colonCurve, 24, 0.22, 10, false);
    const colonMesh = new THREE.Mesh(colonGeo, this.organMaterials.intestines);
    intestinesGroup.add(colonMesh);

    registerHotspot(smallIntMesh, 'intestines');
    registerHotspot(smallInt2, 'intestines');
    registerHotspot(colonMesh, 'intestines');
    createReticle(intestinesGroup.position, 1.4);

    // 8. PANCREAS (Transverse elongated gland posterior to stomach)
    const pancreasCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, 4.85, 0.05), // Head
      new THREE.Vector3(0.15, 4.95, 0.08),  // Body
      new THREE.Vector3(0.65, 5.15, 0.05)   // Tail pointing to spleen
    ]);
    const pancreasGeo = new THREE.TubeGeometry(pancreasCurve, 16, 0.22, 10, false);
    const pancreasMesh = new THREE.Mesh(pancreasGeo, this.organMaterials.pancreas);
    registerHotspot(pancreasMesh, 'pancreas');
    createReticle(new THREE.Vector3(0.2, 4.95, 0.06), 0.85);

    // 9. CELLULAR GENOME / NUCLEUS (Genetic Core Hotspot in Pelvis)
    const genomeGeo = new THREE.SphereGeometry(0.75, 20, 20);
    const genomeMesh = new THREE.Mesh(genomeGeo, this.organMaterials.genome);
    genomeMesh.position.set(0, 1.8, 0.25);
    registerHotspot(genomeMesh, 'genome');
    createReticle(genomeMesh.position, 1.1);

    // Add all organ components to the group
    this.organsGroup.add(
      brainGroup,
      lungsGroup,
      heartMesh,
      liverMesh,
      kidneysGroup,
      stomachMesh,
      intestinesGroup,
      pancreasMesh,
      genomeMesh
    );

    this.group.add(this.organsGroup);
  }

  buildScanningLaser() {
    this.scannerGroup = new THREE.Group();

    const laserRingGeo = new THREE.RingGeometry(4.8, 5.0, 48);
    const laserRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    this.laserRing = new THREE.Mesh(laserRingGeo, laserRingMat);
    this.laserRing.rotation.x = Math.PI / 2;

    const planeGeo = new THREE.PlaneGeometry(9.6, 9.6);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    this.laserPlane = new THREE.Mesh(planeGeo, planeMat);
    this.laserPlane.rotation.x = Math.PI / 2;

    this.scannerGroup.add(this.laserRing);
    this.scannerGroup.add(this.laserPlane);
    this.group.add(this.scannerGroup);
  }

  getClickableHotspots() {
    return this.organHotspots;
  }

  getOrganData(organKey) {
    return ORGAN_METADATA[organKey] || null;
  }

  highlightOrgan(organKey) {
    this.activeHighlightedOrgan = organKey;
    this.organHotspots.forEach(mesh => {
      const uData = mesh.userData;
      if (uData && mesh.material) {
        if (uData.organKey === organKey) {
          mesh.material.emissiveIntensity = 1.6;
          mesh.scale.set(1.12, 1.12, 1.12);
        } else {
          mesh.material.emissiveIntensity = 0.8;
          mesh.scale.set(1.0, 1.0, 1.0);
        }
      }
    });
  }

  clearHighlight() {
    this.activeHighlightedOrgan = null;
    this.organHotspots.forEach(mesh => {
      if (mesh.material) {
        mesh.material.emissiveIntensity = 0.9;
        mesh.scale.set(1.0, 1.0, 1.0);
      }
    });
  }

  animate(delta) {
    if (!this.group.visible) return;

    // Gentle holographic rotation
    this.bodyGroup.rotation.y += delta * 0.22;

    // Heartbeat pulse animation
    if (this.heartMesh) {
      const beat = 1 + Math.sin(Date.now() * 0.008) * 0.09;
      this.heartMesh.scale.set(beat, beat * 1.1, beat);
    }

    // Laser scanner vertical sweep (from y = -9.5 to y = 13)
    if (this.isScanning) {
      this.scanHeight += this.scanDirection * delta * 6.0;
      if (this.scanHeight > 13) {
        this.scanHeight = 13;
        this.scanDirection = -1;
      } else if (this.scanHeight < -9.5) {
        this.scanHeight = -9.5;
        this.scanDirection = 1;
      }
      this.scannerGroup.position.y = this.scanHeight;
    }
  }
}
