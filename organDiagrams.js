/**
 * 3D Functional Organ Diagrams for GENOME VR
 * Provides detailed, animated functional diagrams for:
 * 1. Brain: Neural network with firing synapses and toxic polyQ protein clumps
 * 2. Lungs: Bronchial branching tree, alveoli, and epithelial mucus layer
 * 3. Heart & Blood: Microvascular capillary bed with flowing red blood cells
 */
import * as THREE from 'three';

export class OrganDiagramsManager {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'Functional_Organ_Diagrams';
    this.group.visible = false;
    this.scene.add(this.group);

    this.currentOrgan = null;
    this.brainGroup = new THREE.Group();
    this.lungsGroup = new THREE.Group();
    this.bloodGroup = new THREE.Group();

    this.group.add(this.brainGroup);
    this.group.add(this.lungsGroup);
    this.group.add(this.bloodGroup);

    this.buildBrainDiagram();
    this.buildLungsDiagram();
    this.buildBloodDiagram();
  }

  /* ==========================================================================
     1. BRAIN FUNCTIONAL DIAGRAM: Neural Network & Synapses
     ========================================================================== */
  buildBrainDiagram() {
    this.neurons = [];
    this.synapticPulses = [];
    this.toxicClumps = [];

    const neuronMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.3
    });

    const axonMat = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.6
    });

    // Generate interconnected neurons
    const neuronPositions = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-3.5, 2.0, 1.0),
      new THREE.Vector3(3.2, 1.8, -1.0),
      new THREE.Vector3(-2.8, -2.5, -0.5),
      new THREE.Vector3(2.5, -2.2, 1.2),
      new THREE.Vector3(0, 3.5, -1.5),
      new THREE.Vector3(-1.2, -3.8, 1.0),
      new THREE.Vector3(1.4, 3.2, 1.2)
    ];

    neuronPositions.forEach((pos, idx) => {
      // Cell body (Soma)
      const somaGeo = new THREE.SphereGeometry(0.55, 16, 16);
      const soma = new THREE.Mesh(somaGeo, neuronMat);
      soma.position.copy(pos);
      this.brainGroup.add(soma);
      this.neurons.push(soma);

      // Dendrite spikes
      for (let d = 0; d < 5; d++) {
        const dCurve = new THREE.CatmullRomCurve3([
          pos,
          pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.8, (Math.random() - 0.5) * 1.8, (Math.random() - 0.5) * 1.8))
        ]);
        const dGeo = new THREE.TubeGeometry(dCurve, 8, 0.05, 6, false);
        const dMesh = new THREE.Mesh(dGeo, neuronMat);
        this.brainGroup.add(dMesh);
      }
    });

    // Axon connections between neurons
    for (let i = 0; i < neuronPositions.length; i++) {
      for (let j = i + 1; j < neuronPositions.length; j++) {
        if (neuronPositions[i].distanceTo(neuronPositions[j]) < 5.5) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            neuronPositions[i],
            neuronPositions[j]
          ]);
          const axonLine = new THREE.Line(lineGeo, axonMat);
          this.brainGroup.add(axonLine);

          // Animated synaptic electrical impulse
          const pulseGeo = new THREE.SphereGeometry(0.18, 8, 8);
          const pulseMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
          const pulse = new THREE.Mesh(pulseGeo, pulseMat);
          pulse.userData = {
            start: neuronPositions[i],
            end: neuronPositions[j],
            t: Math.random(),
            speed: 0.8 + Math.random() * 0.6
          };
          this.brainGroup.add(pulse);
          this.synapticPulses.push(pulse);
        }
      }
    }

    // Toxic PolyQ Protein Clumps (Huntington's disease accumulation)
    const clumpMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.9,
      roughness: 0.5
    });

    for (let c = 0; c < 12; c++) {
      const clumpGeo = new THREE.DodecahedronGeometry(0.42, 1);
      const clump = new THREE.Mesh(clumpGeo, clumpMat.clone());
      clump.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3
      );
      this.brainGroup.add(clump);
      this.toxicClumps.push(clump);
    }
  }

  /* ==========================================================================
     2. LUNGS FUNCTIONAL DIAGRAM: Bronchial Tree & Mucus Layer
     ========================================================================== */
  buildLungsDiagram() {
    // Bronchial Tree Tubes
    const airwayMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      roughness: 0.3
    });

    // Main Trachea dividing into left & right primary bronchi
    const tracheaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 4.5, 0),
      new THREE.Vector3(0, 2.2, 0),
      new THREE.Vector3(0, 0.8, 0)
    ]);
    const tracheaGeo = new THREE.TubeGeometry(tracheaCurve, 16, 0.5, 12, false);
    const trachea = new THREE.Mesh(tracheaGeo, airwayMat);
    this.lungsGroup.add(trachea);

    // Left & Right Bronchi branches
    [-1, 1].forEach(side => {
      const bCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.8, 0),
        new THREE.Vector3(side * 1.6, -0.4, 0),
        new THREE.Vector3(side * 3.2, -1.8, 0)
      ]);
      const bGeo = new THREE.TubeGeometry(bCurve, 16, 0.35, 10, false);
      const bMesh = new THREE.Mesh(bGeo, airwayMat);
      this.lungsGroup.add(bMesh);

      // Alveoli Clusters (tiny breathing air grape clusters)
      for (let a = 0; a < 8; a++) {
        const alvGeo = new THREE.SphereGeometry(0.38, 12, 12);
        const alvMat = new THREE.MeshStandardMaterial({
          color: 0x60a5fa,
          emissive: 0x2563eb,
          emissiveIntensity: 0.4
        });
        const alv = new THREE.Mesh(alvGeo, alvMat);
        alv.position.set(
          side * (2.8 + Math.random() * 1.8),
          -1.6 - Math.random() * 2.2,
          (Math.random() - 0.5) * 1.5
        );
        this.lungsGroup.add(alv);
      }
    });

    // Thick Clogged Mucus Layer (Amber/Red Translucent Blob)
    const mucusGeo = new THREE.CylinderGeometry(0.55, 0.45, 2.2, 16);
    this.mucusMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.85
    });
    this.mucusMesh = new THREE.Mesh(mucusGeo, this.mucusMat);
    this.mucusMesh.position.set(0, 1.8, 0);
    this.lungsGroup.add(this.mucusMesh);
  }

  /* ==========================================================================
     3. HEART & BLOOD FUNCTIONAL DIAGRAM: Microcapillary & Flowing Blood Cells
     ========================================================================== */
  buildBloodDiagram() {
    this.flowingRBCs = [];

    // Transparent Microvascular Capillary Pipe
    const pipeGeo = new THREE.CylinderGeometry(2.4, 2.4, 14, 24, 1, true);
    pipeGeo.rotateZ(Math.PI / 2);
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0xbe123c,
      emissive: 0x881337,
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    this.bloodGroup.add(pipe);

    // Endothelial Cell Wall Rings
    for (let x = -6; x <= 6; x += 3) {
      const ringGeo = new THREE.TorusGeometry(2.42, 0.08, 8, 32);
      ringGeo.rotateY(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.x = x;
      this.bloodGroup.add(ring);
    }

    // Flowing Red Blood Cells inside the pipe (both Normal Discs and Sickle Bananas)
    const normalDiscGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.3, 16);
    normalDiscGeo.scale(1, 0.4, 1);
    const sickleGeo = new THREE.TorusGeometry(0.75, 0.22, 10, 20, Math.PI * 1.1);

    const rbcMat = new THREE.MeshStandardMaterial({
      color: 0xbe123c,
      emissive: 0x881337,
      emissiveIntensity: 0.5,
      roughness: 0.3
    });

    const sickleMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.6,
      roughness: 0.4
    });

    for (let r = 0; r < 16; r++) {
      const isSickle = r % 3 === 0;
      const mesh = new THREE.Mesh(isSickle ? sickleGeo : normalDiscGeo, isSickle ? sickleMat.clone() : rbcMat.clone());
      mesh.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 2.8,
        (Math.random() - 0.5) * 2.8
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.userData = {
        isSickle: isSickle,
        speed: 1.5 + Math.random() * 1.5
      };
      this.bloodGroup.add(mesh);
      this.flowingRBCs.push(mesh);
    }
  }

  showOrgan(organKey) {
    this.currentOrgan = organKey;
    this.group.visible = true;

    this.brainGroup.visible = (organKey === 'huntington' || organKey === 'brain');
    this.lungsGroup.visible = (organKey === 'cystic_fibrosis' || organKey === 'lungs');
    this.bloodGroup.visible = (organKey === 'sickle_cell' || organKey === 'heart' || organKey === 'blood');
  }

  hide() {
    this.group.visible = false;
  }

  /* ==========================================================================
     HEALING TRANSITIONS (When CRISPR / Gene Therapy cure is administered)
     ========================================================================== */
  healBrain(onComplete) {
    // Dissolve toxic protein clumps with glowing particles
    const startTime = performance.now();
    const duration = 1800;

    const anim = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      this.toxicClumps.forEach(clump => {
        clump.scale.setScalar(Math.max(0.01, 1 - progress));
        clump.material.opacity = 1 - progress;
        clump.material.transparent = true;
      });

      if (progress < 1) {
        requestAnimationFrame(anim);
      } else {
        this.toxicClumps.forEach(c => (c.visible = false));
        if (onComplete) onComplete();
      }
    };
    requestAnimationFrame(anim);
  }

  healLungs(onComplete) {
    // Thin out and clear the thick mucus layer
    const startTime = performance.now();
    const duration = 1800;

    const anim = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      if (this.mucusMesh) {
        this.mucusMesh.scale.y = Math.max(0.1, 1 - progress * 0.85);
        this.mucusMat.color.setHex(0x38bdf8);
        this.mucusMat.emissive.setHex(0x0284c7);
        this.mucusMat.opacity = 0.85 - progress * 0.55;
      }

      if (progress < 1) {
        requestAnimationFrame(anim);
      } else {
        if (onComplete) onComplete();
      }
    };
    requestAnimationFrame(anim);
  }

  healBlood(onComplete) {
    // Morph all sickle cells into soft round discs
    const startTime = performance.now();
    const duration = 1800;

    const anim = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      this.flowingRBCs.forEach(rbc => {
        if (rbc.userData.isSickle) {
          rbc.rotation.z = (1 - progress) * Math.PI * 0.4;
          rbc.material.color.setHex(0xbe123c);
          rbc.material.emissive.setHex(0x881337);
        }
      });

      if (progress < 1) {
        requestAnimationFrame(anim);
      } else {
        this.flowingRBCs.forEach(rbc => (rbc.userData.isSickle = false));
        if (onComplete) onComplete();
      }
    };
    requestAnimationFrame(anim);
  }

  animate(delta) {
    if (!this.group.visible) return;

    // Animate Brain synaptic impulses
    if (this.brainGroup.visible) {
      this.brainGroup.rotation.y += delta * 0.12;

      this.synapticPulses.forEach(pulse => {
        pulse.userData.t += delta * pulse.userData.speed;
        if (pulse.userData.t > 1) pulse.userData.t = 0;
        pulse.position.lerpVectors(pulse.userData.start, pulse.userData.end, pulse.userData.t);
      });
    }

    // Animate Lungs gentle breathing expansion
    if (this.lungsGroup.visible) {
      const breath = 1 + Math.sin(Date.now() * 0.003) * 0.06;
      this.lungsGroup.scale.set(breath, breath, breath);
    }

    // Animate Blood Flowing Cells
    if (this.bloodGroup.visible) {
      this.flowingRBCs.forEach(rbc => {
        rbc.position.x += delta * rbc.userData.speed * 3.5;
        if (rbc.position.x > 7) rbc.position.x = -7;
        rbc.rotation.x += delta * 1.2;
        rbc.rotation.y += delta * 1.5;
      });
    }
  }
}
