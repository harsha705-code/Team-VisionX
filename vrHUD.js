/**
 * VisionX - In-World 3D WebXR Floating Holographic HUD & Interaction System
 * Enables complete VR-first control without ever needing to remove the headset:
 * - Floating curved 3D holographic command dashboard
 * - Large raycastable 3D buttons for biological scales, organs, diseases, and cure
 * - High-contrast readable holographic dynamic canvas info panels in 3D space
 * - VR controller raycasting with hover glow, click feedback, and haptic pulses
 * - Two-hand or single-hand controller grip rotation and model inspection
 */
import * as THREE from 'three';
import { ORGAN_METADATA } from './bodyModel.js';
import { soundEngine } from './audio.js';

export class VRHUDManager {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;

    this.group = new THREE.Group();
    this.group.name = 'VR_Floating_Holographic_HUD';
    this.group.visible = false; // Hidden on desktop, activated in VR
    this.scene.add(this.group);

    this.interactiveButtons = [];
    this.hoveredButton = null;
    this.callbacks = {};

    this.currentScale = 'body';
    this.currentOrganKey = 'heart';
    this.currentDisorderKey = 'sickle_cell';

    this.initHUDCanvas();
    this.buildHUDPanels();
  }

  setCallbacks(callbacks) {
    this.callbacks = callbacks;
  }

  initHUDCanvas() {
    this.canvasWidth = 1024;
    this.canvasHeight = 640;
    this.hudCanvas = document.createElement('canvas');
    this.hudCanvas.width = this.canvasWidth;
    this.hudCanvas.height = this.canvasHeight;
    this.ctx = this.hudCanvas.getContext('2d');

    this.hudTexture = new THREE.CanvasTexture(this.hudCanvas);
    this.hudTexture.minFilter = THREE.LinearFilter;
    this.hudTexture.magFilter = THREE.LinearFilter;

    this.hudMaterial = new THREE.MeshBasicMaterial({
      map: this.hudTexture,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
  }

  buildHUDPanels() {
    // 1. Center Floating Hologram Screen (Curved plane)
    const screenGeo = new THREE.PlaneGeometry(2.4, 1.5, 16, 16);
    this.screenMesh = new THREE.Mesh(screenGeo, this.hudMaterial);
    this.screenMesh.position.set(0, 1.45, -1.8);
    this.group.add(this.screenMesh);

    // Glowing border frame around the screen
    const frameGeo = new THREE.EdgesGeometry(screenGeo);
    const frameMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
    const frameLine = new THREE.LineSegments(frameGeo, frameMat);
    this.screenMesh.add(frameLine);

    // 2. Scale Navigator Ribbon (Bottom of HUD)
    this.scaleButtonGroup = new THREE.Group();
    this.scaleButtonGroup.position.set(0, 0.55, -1.75);

    const scales = [
      { key: 'body', label: '0: BODY' },
      { key: 'organ_diagram', label: '1: DIAGRAM' },
      { key: 'cell', label: '2: CELL' },
      { key: 'karyotype', label: '3: GENES' },
      { key: 'dna', label: '4: DNA' },
      { key: 'phenotype', label: '5: IMPACT' }
    ];

    const btnWidth = 0.32;
    const btnGap = 0.05;
    const totalW = scales.length * btnWidth + (scales.length - 1) * btnGap;
    const startX = -totalW / 2 + btnWidth / 2;

    scales.forEach((scale, idx) => {
      const btn = this.createVRButton(scale.label, btnWidth, 0.12, 0x0284c7, () => {
        if (this.callbacks.onScaleChange) {
          this.callbacks.onScaleChange(scale.key);
        }
      });
      btn.position.set(startX + idx * (btnWidth + btnGap), 0, 0);
      btn.userData.scaleKey = scale.key;
      this.scaleButtonGroup.add(btn);
    });

    this.group.add(this.scaleButtonGroup);

    // 3. Quick Organ Chips Bar (Left Wing of HUD)
    this.organButtonGroup = new THREE.Group();
    this.organButtonGroup.position.set(-1.45, 1.35, -1.7);
    this.organButtonGroup.rotation.y = 0.35; // Angled inward towards user

    const organList = [
      { key: 'brain', label: '🧠 Brain' },
      { key: 'heart', label: '❤️ Heart' },
      { key: 'lungs', label: '🫁 Lungs' },
      { key: 'liver', label: '🟤 Liver' },
      { key: 'kidneys', label: '🫘 Kidneys' },
      { key: 'stomach', label: '🥣 Stomach' },
      { key: 'intestines', label: '〰️ Intestines' },
      { key: 'pancreas', label: '🥖 Pancreas' }
    ];

    organList.forEach((organ, idx) => {
      const row = Math.floor(idx / 2);
      const col = idx % 2;
      const btn = this.createVRButton(organ.label, 0.36, 0.11, 0x1e293b, () => {
        if (this.callbacks.onOrganSelect) {
          this.callbacks.onOrganSelect(organ.key);
        }
      });
      btn.position.set((col - 0.5) * 0.4, 0.35 - row * 0.14, 0);
      btn.userData.organKey = organ.key;
      this.organButtonGroup.add(btn);
    });

    this.group.add(this.organButtonGroup);

    // 4. Action Controls Bar (Right Wing of HUD)
    this.actionButtonGroup = new THREE.Group();
    this.actionButtonGroup.position.set(1.45, 1.35, -1.7);
    this.actionButtonGroup.rotation.y = -0.35; // Angled inward

    // Administer CRISPR Cure Button
    this.cureVRBtn = this.createVRButton('✨ ADMINISTER CURE', 0.65, 0.14, 0x10b981, () => {
      if (this.callbacks.onAdministerCure) {
        this.callbacks.onAdministerCure();
      }
    });
    this.cureVRBtn.position.set(0, 0.3, 0);
    this.actionButtonGroup.add(this.cureVRBtn);

    // Auto-Play Cure Story Button
    const storyBtn = this.createVRButton('▶ Play Cure Story', 0.65, 0.12, 0x6366f1, () => {
      if (this.callbacks.onPlayStory) {
        this.callbacks.onPlayStory();
      }
    });
    storyBtn.position.set(0, 0.12, 0);
    this.actionButtonGroup.add(storyBtn);

    // Unwind DNA Strands Button
    const unwindBtn = this.createVRButton('🧬 Unzip DNA Strands', 0.65, 0.12, 0x0284c7, () => {
      if (this.callbacks.onToggleUnwind) {
        this.callbacks.onToggleUnwind();
      }
    });
    unwindBtn.position.set(0, -0.06, 0);
    this.actionButtonGroup.add(unwindBtn);

    // Reset View Button
    const resetBtn = this.createVRButton('🔄 Reset Camera View', 0.65, 0.12, 0x334155, () => {
      if (this.callbacks.onResetView) {
        this.callbacks.onResetView();
      }
    });
    resetBtn.position.set(0, -0.24, 0);
    this.actionButtonGroup.add(resetBtn);

    this.group.add(this.actionButtonGroup);

    // Render initial canvas
    this.renderInfoCanvas();
  }

  createVRButton(text, width, height, bgColor, onClick) {
    const group = new THREE.Group();

    // Button Base Box
    const geo = new THREE.BoxGeometry(width, height, 0.03);
    const mat = new THREE.MeshStandardMaterial({
      color: bgColor,
      emissive: bgColor,
      emissiveIntensity: 0.45,
      roughness: 0.3,
      metalness: 0.2
    });
    const mesh = new THREE.Mesh(geo, mat);

    // Button Text Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 26px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const textGeo = new THREE.PlaneGeometry(width * 0.95, height * 0.85);
    const textMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.z = 0.017;

    group.add(mesh, textMesh);

    mesh.userData = {
      isVRButton: true,
      onClick: onClick,
      originalColor: bgColor,
      originalScale: new THREE.Vector3(1, 1, 1),
      parentGroup: group
    };

    this.interactiveButtons.push(mesh);
    return group;
  }

  renderInfoCanvas() {
    const ctx = this.ctx;
    const w = this.canvasWidth;
    const h = this.canvasHeight;

    ctx.clearRect(0, 0, w, h);

    // High-tech dark glassmorphic card background
    ctx.fillStyle = 'rgba(7, 13, 34, 0.92)';
    ctx.roundRect(10, 10, w - 20, h - 20, 24);
    ctx.fill();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Top Header Banner
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 34px Outfit, sans-serif';
    ctx.fillText('VISIONX • VIRTUAL MEDICAL LABORATORY', 40, 65);

    // Mode Badge
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.roundRect(w - 240, 35, 195, 42, 12);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px Outfit, sans-serif';
    ctx.fillText('● VR ACTIVE (6DoF)', w - 225, 63);

    // Divider Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 95);
    ctx.lineTo(w - 40, 95);
    ctx.stroke();

    // Organ & System Data
    const organMeta = ORGAN_METADATA[this.currentOrganKey] || ORGAN_METADATA.heart;

    // Icon + Organ Title
    ctx.font = '54px sans-serif';
    ctx.fillText(organMeta.icon, 45, 170);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 40px Outfit, sans-serif';
    ctx.fillText(organMeta.name, 125, 155);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '24px Outfit, sans-serif';
    ctx.fillText(`SYSTEM: ${organMeta.system.toUpperCase()}  |  SCALE: ${organMeta.scale}`, 125, 192);

    // Section 1: Biological Function
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.fillText('PHYSIOLOGICAL FUNCTION:', 45, 245);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '22px Outfit, sans-serif';
    this.wrapText(ctx, organMeta.function, 45, 278, w - 90, 32);

    // Section 2: Clinical Facts
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.fillText('BIOLOGICAL FACTS:', 45, 365);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '22px Outfit, sans-serif';
    this.wrapText(ctx, organMeta.facts, 45, 398, w - 90, 32);

    // Section 3: Related Pathology & Gene Therapy
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.fillText('ASSOCIATED CONDITIONS & PRECISION MEDICINE TARGETS:', 45, 485);

    ctx.fillStyle = '#fde68a';
    ctx.font = '22px Outfit, sans-serif';
    this.wrapText(ctx, organMeta.relatedDiseases, 45, 518, w - 90, 32);

    // Bottom Note
    ctx.fillStyle = '#64748b';
    ctx.font = '18px Outfit, sans-serif';
    ctx.fillText('Point your VR laser pointer at buttons or organ nodes to interact • Squeeze grip to rotate model', 45, 605);

    this.hudTexture.needsUpdate = true;
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  updateInfo(organKey, disorderKey, scaleName) {
    if (organKey) this.currentOrganKey = organKey;
    if (disorderKey) this.currentDisorderKey = disorderKey;
    if (scaleName) this.currentScale = scaleName;
    this.renderInfoCanvas();
  }

  updateRaycast(raycaster, isTriggerJustPressed, controller) {
    if (!this.group.visible) return null;

    const intersects = raycaster.intersectObjects(this.interactiveButtons, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const uData = hit.userData;

      if (this.hoveredButton !== hit) {
        // Reset old button
        if (this.hoveredButton && this.hoveredButton.material) {
          this.hoveredButton.material.emissiveIntensity = 0.45;
          this.hoveredButton.scale.set(1, 1, 1);
        }
        this.hoveredButton = hit;
        hit.material.emissiveIntensity = 1.35;
        hit.scale.set(1.08, 1.08, 1.08);

        // Haptic feedback pulse on hover
        this.pulseHaptic(controller, 0.2, 15);
      }

      // Handle Trigger Click
      if (isTriggerJustPressed && uData && uData.onClick) {
        // Visual click flash
        hit.material.emissiveIntensity = 2.2;
        setTimeout(() => {
          if (hit.material) hit.material.emissiveIntensity = 1.35;
        }, 160);

        // Stronger haptic pulse on click
        this.pulseHaptic(controller, 0.8, 60);
        soundEngine.playClick();

        uData.onClick();
        return hit;
      }

      return hit;
    } else {
      if (this.hoveredButton && this.hoveredButton.material) {
        this.hoveredButton.material.emissiveIntensity = 0.45;
        this.hoveredButton.scale.set(1, 1, 1);
      }
      this.hoveredButton = null;
      return null;
    }
  }

  pulseHaptic(controller, intensity = 0.5, duration = 30) {
    if (!controller) return;
    try {
      // Find matching gamepad from XR session input sources
      const session = this.renderer.xr.getSession();
      if (!session || !session.inputSources) return;

      for (const source of session.inputSources) {
        if (source.gamepad && source.gamepad.hapticActuators && source.gamepad.hapticActuators.length > 0) {
          source.gamepad.hapticActuators[0].pulse(intensity, duration);
          break;
        }
      }
    } catch {
      // Haptics not supported or unavailable
    }
  }

  showInVR(camera) {
    this.group.visible = true;

    // Position HUD comfortably in front of user's eye level
    if (camera) {
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      forward.y = 0; // Keep level with horizon
      forward.normalize();

      const targetPos = camera.position.clone().add(forward.multiplyScalar(2.0));
      targetPos.y = camera.position.y - 0.15;
      this.group.position.copy(targetPos);
      this.group.lookAt(camera.position.x, targetPos.y, camera.position.z);
    }
  }

  hide() {
    this.group.visible = false;
  }
}
