/**
 * Procedural 3D B-DNA Double Helix Model with Bioluminescent Shaders & Interactive Nucleotides
 * Includes CRISPR-Cas9 golden healing animation & replication unwinding bubble.
 */
import * as THREE from 'three';
import { BASE_METADATA, COMPLEMENTS } from './disorderEngine.js';

export class DNAModel {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'DNA_Double_Helix';
    this.scene.add(this.group);

    // B-DNA Geometric Parameters
    this.bpPerTurn = 10.5;
    this.risePerBp = 1.4;
    this.radius = 4.2;
    this.angleStep = (Math.PI * 2) / this.bpPerTurn;

    // State
    this.currentSequence = [];
    this.nucleotideMeshes = [];
    this.backboneGroup = new THREE.Group();
    this.rungsGroup = new THREE.Group();
    this.sparklesGroup = new THREE.Group();
    this.healingGroup = new THREE.Group();

    this.group.add(this.backboneGroup);
    this.group.add(this.rungsGroup);
    this.group.add(this.sparklesGroup);
    this.group.add(this.healingGroup);

    this.unwindFactor = 0;
    this.selectedMesh = null;
    this.highlightMesh = null;

    this.initMaterials();
    this.createGlowDust();
  }

  initMaterials() {
    this.backboneMat1 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.8
    });

    this.backboneMat2 = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: 0x4338ca,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.8
    });

    this.baseMaterials = {
      'A': new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.4
      }),
      'T': new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x0891b2,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.4
      }),
      'C': new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.4
      }),
      'G': new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0xe11d48,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.4
      })
    };

    this.hBondMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.75
    });

    const ringGeo = new THREE.RingGeometry(2.4, 2.7, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    this.highlightRing = new THREE.Mesh(ringGeo, ringMat);
    this.highlightRing.visible = false;
    this.group.add(this.highlightRing);
  }

  createGlowDust() {
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x38bdf8);
    const c2 = new THREE.Color(0x818cf8);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const mixed = Math.random() > 0.5 ? c1 : c2;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.sparkles = new THREE.Points(geometry, pMaterial);
    this.sparklesGroup.add(this.sparkles);
  }

  buildHelix(sequence, mutatedIndex = -1) {
    this.currentSequence = [...sequence];
    this.mutatedIndex = mutatedIndex;

    while (this.backboneGroup.children.length > 0) {
      const obj = this.backboneGroup.children.pop();
      if (obj.geometry) obj.geometry.dispose();
    }
    while (this.rungsGroup.children.length > 0) {
      const obj = this.rungsGroup.children.pop();
      if (obj.geometry) obj.geometry.dispose();
    }
    this.nucleotideMeshes = [];

    const count = sequence.length;
    const totalHeight = (count - 1) * this.risePerBp;
    const yOffset = -totalHeight / 2;

    const strand1Points = [];
    const strand2Points = [];

    const baseRadius = 0.35;
    const baseLength = (this.radius * 0.95);

    for (let i = 0; i < count; i++) {
      const base1 = sequence[i];
      const base2 = COMPLEMENTS[base1] || 'A';
      const angle = i * this.angleStep;
      const y = yOffset + i * this.risePerBp;

      const x1 = Math.cos(angle) * this.radius;
      const z1 = Math.sin(angle) * this.radius;
      strand1Points.push(new THREE.Vector3(x1, y, z1));

      const x2 = Math.cos(angle + Math.PI) * this.radius;
      const z2 = Math.sin(angle + Math.PI) * this.radius;
      strand2Points.push(new THREE.Vector3(x2, y, z2));

      const rungGroup = new THREE.Group();
      rungGroup.position.set(0, y, 0);
      rungGroup.rotation.y = -angle;

      const isThisMutated = (i === mutatedIndex);

      // Left Base Mesh
      const leftGeo = new THREE.CylinderGeometry(baseRadius, baseRadius, baseLength * 0.44, 16);
      leftGeo.rotateZ(Math.PI / 2);
      leftGeo.translate(baseLength * 0.24, 0, 0);

      const leftMat = this.baseMaterials[base1] || this.baseMaterials['A'];
      const leftMesh = new THREE.Mesh(leftGeo, leftMat.clone());
      leftMesh.castShadow = true;
      leftMesh.userData = {
        base: base1,
        complement: base2,
        index: i,
        codonIndex: Math.floor(i / 3) + 1,
        isLeft: true,
        isMutated: isThisMutated,
        name: `${base1} (Letter #${i + 1})`
      };

      // Right Base Mesh
      const rightGeo = new THREE.CylinderGeometry(baseRadius, baseRadius, baseLength * 0.44, 16);
      rightGeo.rotateZ(Math.PI / 2);
      rightGeo.translate(-baseLength * 0.24, 0, 0);

      const rightMat = this.baseMaterials[base2] || this.baseMaterials['T'];
      const rightMesh = new THREE.Mesh(rightGeo, rightMat.clone());
      rightMesh.castShadow = true;
      rightMesh.userData = {
        base: base2,
        complement: base1,
        index: i,
        codonIndex: Math.floor(i / 3) + 1,
        isLeft: false,
        isMutated: isThisMutated,
        name: `${base2} (Letter #${i + 1})`
      };

      if (isThisMutated) {
        leftMesh.material.emissive = new THREE.Color(0xff0044);
        leftMesh.material.emissiveIntensity = 1.0;
        rightMesh.material.emissive = new THREE.Color(0xff0044);
        rightMesh.material.emissiveIntensity = 0.8;
      }

      // Hydrogen Bond Connectors
      const hBondsCount = BASE_METADATA[base1]?.bonds || 2;
      const hBondGroup = new THREE.Group();

      for (let b = 0; b < hBondsCount; b++) {
        const offset = (b - (hBondsCount - 1) / 2) * 0.22;
        const bondGeo = new THREE.CylinderGeometry(0.08, 0.08, baseLength * 0.16, 8);
        bondGeo.rotateZ(Math.PI / 2);
        bondGeo.translate(0, offset, 0);
        const bondMesh = new THREE.Mesh(bondGeo, this.hBondMat);
        hBondGroup.add(bondMesh);
      }

      const sphereGeo = new THREE.SphereGeometry(baseRadius * 1.3, 16, 16);
      const node1 = new THREE.Mesh(sphereGeo, this.backboneMat1);
      node1.position.set(this.radius, 0, 0);

      const node2 = new THREE.Mesh(sphereGeo, this.backboneMat2);
      node2.position.set(-this.radius, 0, 0);

      rungGroup.add(leftMesh);
      rungGroup.add(rightMesh);
      rungGroup.add(hBondGroup);
      rungGroup.add(node1);
      rungGroup.add(node2);

      this.rungsGroup.add(rungGroup);
      this.nucleotideMeshes.push(leftMesh, rightMesh);
    }

    if (strand1Points.length > 2) {
      const curve1 = new THREE.CatmullRomCurve3(strand1Points);
      const tubeGeo1 = new THREE.TubeGeometry(curve1, count * 6, 0.22, 12, false);
      const tubeMesh1 = new THREE.Mesh(tubeGeo1, this.backboneMat1);
      this.backboneGroup.add(tubeMesh1);

      const curve2 = new THREE.CatmullRomCurve3(strand2Points);
      const tubeGeo2 = new THREE.TubeGeometry(curve2, count * 6, 0.22, 12, false);
      const tubeMesh2 = new THREE.Mesh(tubeGeo2, this.backboneMat2);
      this.backboneGroup.add(tubeMesh2);
    }

    if (mutatedIndex >= 0) {
      this.highlightBase(mutatedIndex);
    }
  }

  highlightBase(index) {
    if (index < 0 || index >= this.currentSequence.length) {
      this.highlightRing.visible = false;
      return;
    }

    const totalHeight = (this.currentSequence.length - 1) * this.risePerBp;
    const yOffset = -totalHeight / 2;
    const y = yOffset + index * this.risePerBp;
    const angle = index * this.angleStep;

    this.highlightRing.position.set(0, y, 0);
    this.highlightRing.rotation.x = Math.PI / 2;
    this.highlightRing.rotation.z = angle;
    this.highlightRing.visible = true;
  }

  getBasePosition(index) {
    if (index < 0 || index >= this.currentSequence.length) {
      return new THREE.Vector3(0, 0, 0);
    }
    const totalHeight = (this.currentSequence.length - 1) * this.risePerBp;
    const yOffset = -totalHeight / 2;
    const y = yOffset + index * this.risePerBp;
    const angle = index * this.angleStep;
    return new THREE.Vector3(
      Math.cos(angle) * this.radius * 0.5,
      y,
      Math.sin(angle) * this.radius * 0.5
    );
  }

  /**
   * Animated DNA Replication & Unwinding Sequence
   */
  animateReplicationAndUnwind(mutatedIndex, onComplete) {
    const startTime = performance.now();
    const duration = 1600;

    const anim = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Unwind and re-wind smoothly
      const wave = Math.sin(progress * Math.PI) * 0.8;
      this.setUnwind(wave);

      if (progress < 1) {
        requestAnimationFrame(anim);
      } else {
        this.setUnwind(0);
        this.highlightBase(mutatedIndex);
        if (onComplete) onComplete();
      }
    };
    requestAnimationFrame(anim);
  }

  animateCrisprRepair(index, wildTypeBase, onComplete) {
    if (index < 0 || index >= this.currentSequence.length) {
      if (onComplete) onComplete();
      return;
    }

    const targetPos = this.getBasePosition(index);
    const count = 60;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const vel = [];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = targetPos.x;
      pos[i * 3 + 1] = targetPos.y;
      pos[i * 3 + 2] = targetPos.z;

      vel.push(new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      ));
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.4,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 1.0
    });

    const particles = new THREE.Points(geo, mat);
    this.healingGroup.add(particles);

    this.currentSequence[index] = wildTypeBase;
    this.buildHelix(this.currentSequence, -1);

    const startTime = performance.now();
    const duration = 1200;

    const animParticles = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        positions[i * 3] += vel[i].x * 0.04;
        positions[i * 3 + 1] += vel[i].y * 0.04;
        positions[i * 3 + 2] += vel[i].z * 0.04;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      mat.opacity = 1 - progress;

      if (progress < 1) {
        requestAnimationFrame(animParticles);
      } else {
        this.healingGroup.remove(particles);
        geo.dispose();
        mat.dispose();
        if (onComplete) onComplete();
      }
    };
    requestAnimationFrame(animParticles);
  }

  updateSequenceBase(index, newBase) {
    if (index >= 0 && index < this.currentSequence.length) {
      this.currentSequence[index] = newBase;
      this.buildHelix(this.currentSequence, index);
    }
  }

  setUnwind(amount) {
    this.unwindFactor = amount;
    this.rungsGroup.children.forEach(rung => {
      const left = rung.children[0];
      const right = rung.children[1];
      const bonds = rung.children[2];

      if (left && right && bonds) {
        left.position.x = amount * 1.5;
        right.position.x = -amount * 1.5;
        bonds.scale.set(Math.max(0.01, 1 - amount), 1, 1);
        bonds.visible = amount < 0.9;
      }
    });

    this.backboneGroup.position.x = amount * 0.8;
  }

  animate(delta, speed = 1.0, isPaused = false) {
    if (!isPaused) {
      this.group.rotation.y += delta * 0.5 * speed;
    }

    if (this.sparkles) {
      this.sparkles.rotation.y += delta * 0.05;
      this.sparkles.rotation.x += delta * 0.02;
    }

    if (this.highlightRing.visible) {
      const pulse = 1 + Math.sin(Date.now() * 0.006) * 0.12;
      this.highlightRing.scale.set(pulse, pulse, 1);
    }
  }

  getClickableMeshes() {
    return this.nucleotideMeshes;
  }
}
