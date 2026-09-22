/**
 * Gene Therapy & CRISPR-Cas9 Precision Medicine Cure Engine
 * Written in crystal-clear, easy-to-understand human language with simple analogies.
 */
import * as THREE from 'three';

export const CURE_DATABASE = {
  'sickle_cell': {
    diseaseName: 'Sickle Cell Anemia',
    therapyName: 'CRISPR-Cas9 Gene Editing (Casgevy)',
    therapyType: 'Real-World FDA-Approved Cure: Molecular DNA Scissors',
    targetGene: 'HBB Gene (Chromosome 11)',
    guideRNA: 'Finds the typo: 5\'-AGACUCCUUGUGGAAGUCUG-3\'',
    pamSite: 'DNA Cutting Site (AGG)',
    donorTemplate: 'Healthy Letter Patch (Puts "A" back)',
    simpleHowItWorks: 'Think of CRISPR like the "Find and Replace" tool in a computer word processor! A scout molecule (Guide RNA) finds the exact misspelled letter T in your DNA. Then, molecular scissors (Cas9) snip out the bad letter, and a healthy repair patch rewrites it back to letter A. Once cured, your body permanently makes soft, round donut blood cells instead of stiff bananas!',
    molecularMechanism: 'Molecular scissors (Cas9) locate codon 6. They make a clean cut and insert the correct letter A, changing GTG back to GAG. The red blood cells stop sickling, and blood flows freely with zero blockages!',
    clinicalOutcome: 'Cure achieved! Red blood cells live a full 120 days. Vaso-occlusive pain attacks and organ damage vanish completely.',
    repairedCodon: 'GAG (Letter A Restored)',
    repairedAmino: 'Glutamic Acid (Soft & Smooth)',
    steps: [
      { step: 1, title: '1. Scout Molecule (Guide RNA)', desc: 'A genetic scout reads along your DNA until it finds the exact misspelled letter T.' },
      { step: 2, title: '2. Molecular Scissors (Cas9)', desc: 'Microscopic protein scissors make a precise, microscopic snip right at the typo.' },
      { step: 3, title: '3. Spell-Check Repair Patch', desc: 'A healthy donor template swaps the bad letter T back to the correct letter A.' },
      { step: 4, title: '4. Full Body Healing', desc: 'Blood cells stop turning into crescent bananas and permanently become soft round discs!' }
    ]
  },

  'cystic_fibrosis': {
    diseaseName: 'Cystic Fibrosis (ΔF508)',
    therapyName: 'AAV Gene Delivery & Trikafta Helper Medicine',
    therapyType: 'Delivery Truck Gene Therapy & Protein Chaperones',
    targetGene: 'CFTR Salt Doorway Gene (Chromosome 7)',
    guideRNA: 'Targeting deleted 3 letters (CTT)',
    pamSite: 'Cell Doorway Site',
    donorTemplate: 'Restores Missing 3 Letters (CTT)',
    simpleHowItWorks: 'Imagine a recipe that was missing a key ingredient. A harmless delivery vehicle (friendly virus) drops off the missing 3 letters into lung cells. Meanwhile, helper medicines (called Trikafta) act like tiny origami masters, properly folding the salt doorway channels so they reach the lung surface and pump salt and water, thinning the mucus instantly!',
    molecularMechanism: 'Delivers the missing 3 letters (CTT) and guides the salt channel out of the cell factory into the lung lining. Active salt and water pumping restarts, washing away thick mucus.',
    clinicalOutcome: 'Lungs clear up! Breathing becomes effortless, mucus stops trapping bacteria, and chronic lung infections are prevented.',
    repairedCodon: 'TTT (Restored)',
    repairedAmino: 'Phenylalanine-508 (Doorway Opened)',
    steps: [
      { step: 1, title: '1. Harmless Delivery Vehicle', desc: 'A friendly microscopic delivery vehicle carries the missing recipe letters into lung cells.' },
      { step: 2, title: '2. Protein Folding Helpers', desc: 'Helper medicines (Trikafta) fold the doorway channel properly so it does not get destroyed.' },
      { step: 3, title: '3. Doorway Opens at Lung Surface', desc: 'Salt and water pump freely into airways, turning sticky mucus into thin liquid.' },
      { step: 4, title: '4. Clear, Easy Breathing', desc: 'Clogged airways open up and the patient breathes freely without coughing fits.' }
    ]
  },

  'huntington': {
    diseaseName: "Huntington's Disease",
    therapyName: 'Genetic Message Shredder (Antisense ASO / Tominersen)',
    therapyType: 'Targeted RNA Silencing & Shredding',
    targetGene: 'HTT Huntingtin Gene (Chromosome 4)',
    guideRNA: 'Targets repeating "CAG" stutter',
    pamSite: 'Stutter RNA Sequence',
    donorTemplate: 'Destroys repeating toxic message',
    simpleHowItWorks: 'When DNA has a stutter that repeats "CAG" too many times, it tries to print toxic clumps that hurt brain cells. Scientists inject genetic "paper shredders" (called ASOs) into the spinal fluid. These shredders find the stuttering message and destroy it BEFORE it can ever make toxic clumps, keeping brain cells safe and alive!',
    molecularMechanism: 'Synthetic antisense molecules lock onto the repeating CAG message and summon natural cellular shredder enzymes (RNase H) to cut the toxic message to pieces.',
    clinicalOutcome: 'Brain cells in the movement and memory centers are protected from death. Involuntary twitching and cognitive decline are stopped.',
    repairedCodon: 'Normal CAG Count (<26)',
    repairedAmino: 'Healthy Brain Protein',
    steps: [
      { step: 1, title: '1. Gentle Infusion', desc: 'Genetic shredder molecules are infused into spinal fluid and travel up to the brain.' },
      { step: 2, title: '2. Stutter Detection', desc: 'The shredders stick specifically to the repeating "CAG" letters on the mutant message.' },
      { step: 3, title: '3. Cellular Shredding', desc: 'Natural clean-up enzymes shred the repeating message before it can form sticky knots.' },
      { step: 4, title: '4. Brain Cell Protection', desc: 'Nerve cells are preserved, protecting movement, speech, and memory.' }
    ]
  },

  'down_syndrome': {
    diseaseName: 'Down Syndrome (Trisomy 21)',
    therapyName: 'Chromosome Sleep Switch (XIST Gene Silencing)',
    therapyType: 'Epigenetic "Off-Switch" Therapy',
    targetGene: 'Extra 3rd Chromosome 21',
    guideRNA: 'Inserts Sleep Switch onto 3rd Copy',
    pamSite: 'Chromosome 21 Site',
    donorTemplate: 'XIST Silencing Cloud',
    simpleHowItWorks: 'Instead of trying to physically delete a whole chromosome, nature already knows how to turn off extra chromosomes (this happens naturally in women with two X chromosomes). Scientists insert a natural "sleep switch" called XIST into the extra 3rd copy of Chromosome 21. The switch wraps the extra chromosome in a cozy cloud that puts it to sleep, leaving 2 balanced, active chromosomes!',
    molecularMechanism: 'XIST non-coding RNA blankets the extra chromosome 21 and condenses it into an inactive Barr body, restoring perfect 2-copy balance across all genes.',
    clinicalOutcome: 'Cellular gene instructions return to the healthy 100% balance instead of an overwhelming 150% overload.',
    repairedCodon: '46 Balanced Chromosomes',
    repairedAmino: 'Perfect Gene Balance',
    steps: [
      { step: 1, title: '1. Install the Sleep Switch', desc: 'The natural XIST gene switch is placed onto the extra 3rd copy of Chromosome 21.' },
      { step: 2, title: '2. Cozy Inactivation Cloud', desc: 'The switch releases a blanket of RNA that coats and condenses the extra chromosome.' },
      { step: 3, title: '3. Extra Copy Goes to Sleep', desc: 'The 3rd copy becomes quiet and inactive, preventing protein overload.' },
      { step: 4, title: '4. Balanced Development', desc: 'Cells now read from exactly two balanced chromosomes, just like in healthy cells.' }
    ]
  }
};

/**
 * 3D CRISPR-Cas9 Molecular Scissors Visual Effect
 */
export class CrisprVisualEffect {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'CRISPR_Cas9_Complex';
    this.group.visible = false;
    this.scene.add(this.group);

    this.buildCas9Model();
  }

  buildCas9Model() {
    // Cas9 Protein Scissors Body (Violet/Purple Dual Lobes)
    const lobeMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.65,
      roughness: 0.3,
      metalness: 0.4
    });

    const lobe1Geo = new THREE.SphereGeometry(1.8, 20, 20);
    lobe1Geo.scale(1.2, 0.9, 1.0);
    this.lobe1 = new THREE.Mesh(lobe1Geo, lobeMat);
    this.lobe1.position.set(-1.2, 0, 0);

    const lobe2Geo = new THREE.SphereGeometry(1.5, 20, 20);
    lobe2Geo.scale(1.0, 1.2, 0.9);
    this.lobe2 = new THREE.Mesh(lobe2Geo, lobeMat);
    this.lobe2.position.set(1.2, 0, 0);

    this.group.add(this.lobe1);
    this.group.add(this.lobe2);

    // Guide RNA Ribbon (Amber Scout Wire)
    const curvePoints = [];
    for (let i = -2; i <= 2; i += 0.4) {
      curvePoints.push(new THREE.Vector3(i, Math.sin(i * 2) * 0.4, 0.8));
    }
    const rnaCurve = new THREE.CatmullRomCurve3(curvePoints);
    const rnaGeo = new THREE.TubeGeometry(rnaCurve, 24, 0.15, 8, false);
    const rnaMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8
    });
    this.gRnaMesh = new THREE.Mesh(rnaGeo, rnaMat);
    this.group.add(this.gRnaMesh);

    // Cutting Sparkles
    const sparkCount = 40;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount * 3; i++) {
      sparkPos[i] = (Math.random() - 0.5) * 3;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.35,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    this.sparks = new THREE.Points(sparkGeo, sparkMat);
    this.sparks.visible = false;
    this.group.add(this.sparks);
  }

  playRepairAnimation(targetPosition, onComplete) {
    this.group.position.set(targetPosition.x + 8, targetPosition.y + 4, targetPosition.z + 10);
    this.group.visible = true;
    this.sparks.visible = true;

    const startTime = performance.now();
    const duration = 2200;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      if (progress < 0.6) {
        const p = progress / 0.6;
        this.group.position.lerpVectors(
          new THREE.Vector3(targetPosition.x + 8, targetPosition.y + 4, targetPosition.z + 10),
          targetPosition,
          p
        );
        this.group.rotation.y = p * Math.PI;
      } else if (progress < 0.85) {
        this.sparks.rotation.y += 0.2;
        this.sparks.scale.set(1.5, 1.5, 1.5);
      } else {
        const p = (progress - 0.85) / 0.15;
        this.group.position.lerpVectors(
          targetPosition,
          new THREE.Vector3(targetPosition.x - 12, targetPosition.y + 6, targetPosition.z - 8),
          p
        );
        this.group.scale.setScalar(1 - p * 0.5);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.group.visible = false;
        this.sparks.visible = false;
        this.group.scale.setScalar(1);
        if (onComplete) onComplete();
      }
    };

    requestAnimationFrame(animate);
  }
}
