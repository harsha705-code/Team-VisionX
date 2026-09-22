/**
 * VisionX - Main Application Orchestrator & Entry Point
 * Futuristic WebXR Medical Visualization Laboratory & Genomic Explorer
 *
 * Implements:
 * 1. Multi-scale biological journey (WHOLE BODY -> ORGAN -> CELL -> CHROMOSOMES -> DNA -> CELL IMPACT)
 * 2. 8 Interactive Major Organs (Brain, Heart, Lungs, Liver, Kidneys, Stomach, Intestines, Pancreas) + Genome
 * 3. In-world 3D WebXR Floating Holographic Command Center (VRHUDManager)
 * 4. 9-Step Guided Medical Tour (Whole Body to CRISPR cure and cellular phenotype recovery)
 * 5. Procedural CRISPR-Cas9 Precision Molecular Scissors Intervention
 * 6. Desktop & 6DoF VR Headset interaction parity with haptic feedback
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

import { DNAModel } from './dnaModel.js';
import { ScaleViewsManager } from './scaleViews.js';
import { ORGAN_METADATA } from './bodyModel.js';
import { VRHUDManager } from './vrHUD.js';
import { CrisprVisualEffect, CURE_DATABASE } from './cureEngine.js';
import { soundEngine } from './audio.js';
import {
  DISORDERS_DB,
  CODON_TABLE,
  BASE_METADATA,
  translateSequence,
  COMPLEMENTS
} from './disorderEngine.js';

class VisionXApp {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.currentDisorderKey = 'sickle_cell';
    this.currentOrganKey = 'heart';
    this.currentSequence = [...DISORDERS_DB.sickle_cell.sequence];
    this.selectedBaseIndex = 19;
    this.isRotating = true;
    this.rotationSpeed = 1.0;
    this.isUnwound = false;
    this.currentTourStep = 1;
    this.isAutoPlaying = false;
    this.tourTimeouts = [];

    // Controller interaction state
    this.isTriggerDown = false;
    this.isGripDown = false;
    this.previousControllerPos = new THREE.Vector3();

    this.initLoadingScreen();
    this.initScene();
    this.initLights();
    this.initModels();
    this.initVR();
    this.initInteraction();
    this.initUI();

    // Start at Step 1 of the Guided Medical Tour
    this.setTourStep(1);

    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    this.renderer.setAnimationLoop(this.animate);
  }

  initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('loading-progress-bar');
    const statusText = document.getElementById('loading-status-text');

    if (!loadingScreen) return;

    const steps = [
      { progress: '25%', text: 'Loading 3D anatomical human models...' },
      { progress: '55%', text: 'Synthesizing organ systems & neural pathways...' },
      { progress: '85%', text: 'Initializing WebXR 6DoF holographic HUD...' },
      { progress: '100%', text: 'VisionX Virtual Medical Laboratory Ready.' }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        if (progressBar) progressBar.style.width = steps[stepIndex].progress;
        if (statusText) statusText.textContent = steps[stepIndex].text;
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          loadingScreen.classList.add('fade-out');
          setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 800);
        }, 350);
      }
    }, 280);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040714);
    this.scene.fog = new THREE.FogExp2(0x040714, 0.014);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 2, 28);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.renderer.xr.enabled = true;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 95;
    this.controls.minDistance = 3.2;
    this.controls.target.set(0, 2, 0);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initLights() {
    // Medical Studio Lighting: Ambient base + Key Cyan + Fill Violet + Floor Warm
    const ambientLight = new THREE.AmbientLight(0x0d1527, 2.0);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.6);
    keyLight.position.set(15, 22, 18);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    fillLight.position.set(-15, -12, -15);
    this.scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 1.8, 40);
    rimLight.position.set(0, 8, 8);
    this.scene.add(rimLight);
  }

  initModels() {
    this.dnaModel = new DNAModel(this.scene);
    this.scaleManager = new ScaleViewsManager(this.scene, this.camera, this.controls);
    this.crisprEffect = new CrisprVisualEffect(this.scene);

    this.dnaModel.buildHelix(this.currentSequence, 19);
    this.renderCodonStrip();
  }

  initVR() {
    const vrBtnSlot = document.getElementById('vr-button-slot');
    try {
      const vrButton = VRButton.createButton(this.renderer);
      vrBtnSlot.appendChild(vrButton);
    } catch (e) {
      console.warn('WebXR VRButton not supported or unavailable', e);
    }

    // Initialize In-World 3D Floating WebXR HUD
    this.vrHUD = new VRHUDManager(this.scene, this.renderer);
    this.vrHUD.setCallbacks({
      onScaleChange: (scaleKey) => {
        this.selectScale(scaleKey);
      },
      onOrganSelect: (organKey) => {
        this.selectOrgan(organKey);
      },
      onAdministerCure: () => {
        this.administerCure();
      },
      onPlayStory: () => {
        this.playAutoCureStory();
      },
      onToggleUnwind: () => {
        document.getElementById('btn-unwind-dna')?.click();
      },
      onResetView: () => {
        document.getElementById('btn-reset-cam')?.click();
      }
    });

    // 6DoF Controllers
    this.controller1 = this.renderer.xr.getController(0);
    this.controller2 = this.renderer.xr.getController(1);

    const controllerModelFactory = new XRControllerModelFactory();
    this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
    this.controllerGrip1.add(controllerModelFactory.createControllerModel(this.controllerGrip1));
    this.scene.add(this.controllerGrip1);

    this.controllerGrip2 = this.renderer.xr.getControllerGrip(1);
    this.controllerGrip2.add(controllerModelFactory.createControllerModel(this.controllerGrip2));
    this.scene.add(this.controllerGrip2);

    // Laser rays for both controllers
    const laserGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -6)
    ]);
    const laserMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85
    });

    this.laser1 = new THREE.Line(laserGeo, laserMat);
    this.laser2 = new THREE.Line(laserGeo, laserMat);
    this.controller1.add(this.laser1);
    this.controller2.add(this.laser2);

    this.scene.add(this.controller1);
    this.scene.add(this.controller2);

    // VR Controller event listeners
    this.controller1.addEventListener('selectstart', () => {
      this.isTriggerDown = true;
      this.handleVRTrigger(this.controller1);
    });
    this.controller1.addEventListener('selectend', () => {
      this.isTriggerDown = false;
    });

    this.controller2.addEventListener('selectstart', () => {
      this.isTriggerDown = true;
      this.handleVRTrigger(this.controller2);
    });
    this.controller2.addEventListener('selectend', () => {
      this.isTriggerDown = false;
    });

    // Grip Squeeze for Model Grab & Rotate
    this.controller1.addEventListener('squeezestart', () => {
      this.isGripDown = true;
      this.previousControllerPos.copy(this.controller1.position);
    });
    this.controller1.addEventListener('squeezeend', () => {
      this.isGripDown = false;
    });

    // WebXR Session lifecycle
    this.renderer.xr.addEventListener('sessionstart', () => {
      document.body.classList.add('in-vr-session');
      document.getElementById('vr-hud-notice')?.classList.remove('hidden');
      this.vrHUD.showInVR(this.camera);
    });

    this.renderer.xr.addEventListener('sessionend', () => {
      document.body.classList.remove('in-vr-session');
      document.getElementById('vr-hud-notice')?.classList.add('hidden');
      this.vrHUD.hide();
    });
  }

  handleVRTrigger(controller) {
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);

    const raycaster = new THREE.Raycaster();
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    // First check VR HUD 3D buttons
    const hudHit = this.vrHUD.updateRaycast(raycaster, true, controller);
    if (hudHit) return;

    // Next check 3D scene objects (Organ hotspots or DNA base pairs)
    let candidates = [];
    if (this.scaleManager.currentScale === 'body') {
      candidates = this.scaleManager.bodyModel.getClickableHotspots();
    } else if (this.dnaModel && this.dnaModel.group.visible) {
      candidates = this.dnaModel.getClickableMeshes();
    }

    const intersects = raycaster.intersectObjects(candidates, false);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const uData = hit.userData;
      if (uData.organKey) {
        this.selectOrgan(uData.organKey);
      } else if (uData.disorderKey) {
        this.loadDisorder(uData.disorderKey);
      } else if (uData.base) {
        this.selectNucleotide(uData);
      }
      this.vrHUD.pulseHaptic(controller, 0.8, 50);
      soundEngine.playClick();
    }
  }

  initInteraction() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.hoveredMesh = null;
    this.tooltip = document.getElementById('hud-tooltip');
    this.tooltipTitle = document.getElementById('tooltip-base-title');
    this.tooltipSub = document.getElementById('tooltip-base-sub');

    window.addEventListener('pointermove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (this.tooltip && !this.tooltip.classList.contains('hidden')) {
        this.tooltip.style.left = `${e.clientX}px`;
        this.tooltip.style.top = `${e.clientY}px`;
      }
    });

    this.canvas.addEventListener('click', () => {
      if (this.hoveredMesh) {
        const uData = this.hoveredMesh.userData;
        if (uData.organKey) {
          this.selectOrgan(uData.organKey);
        } else if (uData.disorderKey) {
          this.loadDisorder(uData.disorderKey);
          this.showOrganDiseasePopup(uData.disorderKey, uData.organ || uData.name);
        } else if (uData.base) {
          this.selectNucleotide(uData);
          soundEngine.playClick();
        }
      }
    });
  }

  selectOrgan(organKey) {
    this.currentOrganKey = organKey;
    const organMeta = ORGAN_METADATA[organKey];
    if (!organMeta) return;

    // Highlight on 3D body
    this.scaleManager.bodyModel.highlightOrgan(organKey);

    // Zoom camera to organ if in body mode
    if (this.scaleManager.currentScale === 'body') {
      this.scaleManager.zoomToOrganOnBody(organKey);
    }

    // Update 3D VR HUD
    this.vrHUD.updateInfo(organKey, this.currentDisorderKey, this.scaleManager.currentScale);

    // Sync Desktop Organ Chip selection
    document.querySelectorAll('.organ-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.organ === organKey);
    });

    // Show 2D floating organ popup
    this.showOrganDiseasePopup(organMeta.disorderKey, organKey);
    soundEngine.playScanSound();
  }

  showOrganDiseasePopup(disorderKey, organKey) {
    const popup = document.getElementById('organ-popup-overlay');
    if (!popup) return;

    const organMeta = ORGAN_METADATA[organKey] || ORGAN_METADATA.heart;
    const disease = DISORDERS_DB[disorderKey] || DISORDERS_DB['sickle_cell'];
    const cure = CURE_DATABASE[disorderKey] || CURE_DATABASE['sickle_cell'];

    const iconEl = document.getElementById('organ-popup-icon');
    if (iconEl) iconEl.textContent = organMeta.icon || '🔬';

    const partEl = document.getElementById('organ-popup-part');
    if (partEl) partEl.textContent = `System: ${organMeta.system} (${organMeta.scale})`;

    const titleEl = document.getElementById('organ-popup-disease-title');
    if (titleEl) titleEl.textContent = organMeta.name;

    const funcEl = document.getElementById('organ-popup-function-text');
    if (funcEl) funcEl.textContent = organMeta.function;

    const factsEl = document.getElementById('organ-popup-facts-text');
    if (factsEl) factsEl.textContent = organMeta.facts;

    const probEl = document.getElementById('organ-popup-problem-text');
    if (probEl) probEl.textContent = `${disease.name}: ${disease.simpleExplain}`;

    const cureNameEl = document.getElementById('organ-popup-cure-name');
    if (cureNameEl) cureNameEl.textContent = cure.therapyName;

    const cureDescEl = document.getElementById('organ-popup-cure-desc');
    if (cureDescEl) cureDescEl.textContent = cure.simpleHowItWorks;

    popup.classList.remove('hidden');
  }

  selectNucleotide(userData) {
    if (!userData) return;
    this.selectedBaseIndex = userData.index;
    this.dnaModel.highlightBase(userData.index);
    this.highlightCodonInStrip(userData.codonIndex);
  }

  selectScale(scaleKey) {
    document.querySelectorAll('.scale-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.scale === scaleKey);
    });

    this.scaleManager.setScale(scaleKey, this.dnaModel.group, this.currentDisorderKey);
    this.updateScaleIndicator(scaleKey);
    this.vrHUD.updateInfo(this.currentOrganKey, this.currentDisorderKey, scaleKey);
    soundEngine.playClick();
  }

  updateScaleIndicator(scaleKey) {
    const labelEl = document.getElementById('current-scale-label');
    if (!labelEl) return;

    const scaleLabels = {
      'body': 'SCALE: WHOLE BODY (1x)',
      'organ_diagram': 'SCALE: ORGAN VIEW (10x)',
      'cell': 'SCALE: CELL / TISSUE (10,000x)',
      'karyotype': 'SCALE: CHROMOSOMES (100,000x)',
      'dna': 'SCALE: DNA HELIX (100,000,000x)',
      'phenotype': 'SCALE: CELL IMPACT & CURE'
    };
    labelEl.textContent = scaleLabels[scaleKey] || 'SCALE: WHOLE BODY (1x)';
  }

  initUI() {
    // Top Scale Navigation Buttons
    document.querySelectorAll('.scale-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectScale(btn.dataset.scale);
      });
    });

    // 8-Organ Scanner Chips
    document.querySelectorAll('.organ-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const organKey = chip.dataset.organ;
        const disorderKey = chip.dataset.disorder;
        if (disorderKey) this.loadDisorder(disorderKey);
        this.selectOrgan(organKey);
      });
    });

    // Disorder Cards
    document.querySelectorAll('.disorder-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const key = card.dataset.disorder;
        if (!key || key === 'wildtype') return;

        if (e.target.closest('.card-cure-btn')) {
          e.stopPropagation();
          this.playAutoCureStory(key);
          return;
        }

        this.loadDisorder(key);
        this.setTourStep(4);
        this.showOrganDiseasePopup(key, this.currentOrganKey);
        soundEngine.playMutateSound();
      });
    });

    // Tour Step Dots Click
    document.querySelectorAll('.story-step-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const step = parseInt(dot.dataset.step);
        this.setTourStep(step);
      });
    });

    // Tour Navigation Buttons (Back & Next)
    document.getElementById('btn-story-prev')?.addEventListener('click', () => {
      if (this.currentTourStep > 1) {
        this.setTourStep(this.currentTourStep - 1);
      }
    });

    document.getElementById('btn-story-next')?.addEventListener('click', () => {
      if (this.currentTourStep < 9) {
        this.setTourStep(this.currentTourStep + 1);
      }
    });

    // Auto-Play 9-Step Guided Tour
    document.getElementById('btn-story-autoplay')?.addEventListener('click', () => {
      this.playAutoTour();
    });

    // Skip Tour
    document.getElementById('btn-tour-skip')?.addEventListener('click', () => {
      this.selectScale('body');
      soundEngine.playClick();
    });

    // Top Guided Tour Toggle
    document.getElementById('btn-tour-toggle')?.addEventListener('click', () => {
      this.setTourStep(1);
      this.playAutoTour();
    });

    // Administer Cure Button
    document.getElementById('btn-administer-cure')?.addEventListener('click', () => {
      this.setTourStep(8);
    });

    // Audio Toggle
    const audioBtn = document.getElementById('btn-audio-toggle');
    const soundOn = document.getElementById('icon-sound-on');
    const soundOff = document.getElementById('icon-sound-off');

    audioBtn?.addEventListener('click', () => {
      const isPlaying = soundEngine.toggleAudio();
      audioBtn.classList.toggle('active', isPlaying);
      soundOn?.classList.toggle('hidden', !isPlaying);
      soundOff?.classList.toggle('hidden', isPlaying);
    });

    // Play / Pause Rotation
    const pauseBtn = document.getElementById('btn-pause-rotation');
    const iconPause = document.getElementById('icon-pause');
    const iconPlay = document.getElementById('icon-play');

    pauseBtn?.addEventListener('click', () => {
      this.isRotating = !this.isRotating;
      iconPause?.classList.toggle('hidden', !this.isRotating);
      iconPlay?.classList.toggle('hidden', this.isRotating);
      soundEngine.playClick();
    });

    const speedSlider = document.getElementById('slider-rotation-speed');
    speedSlider?.addEventListener('input', (e) => {
      this.rotationSpeed = parseFloat(e.target.value);
    });

    // Unwind & Transcription
    const btnUnwind = document.getElementById('btn-unwind-dna');
    btnUnwind?.addEventListener('click', () => {
      this.isUnwound = !this.isUnwound;
      btnUnwind.classList.toggle('active', this.isUnwound);
      this.dnaModel.setUnwind(this.isUnwound ? 1 : 0);
      soundEngine.playUnwindSound();
    });

    const btnTranscribe = document.getElementById('btn-transcription');
    btnTranscribe?.addEventListener('click', () => {
      this.simulateTranscription();
    });

    // Modals
    document.getElementById('btn-view-phenotype-3d')?.addEventListener('click', () => {
      document.getElementById('phenotype-modal')?.classList.remove('hidden');
      soundEngine.playClick();
    });
    document.getElementById('btn-close-phenotype')?.addEventListener('click', () => {
      document.getElementById('phenotype-modal')?.classList.add('hidden');
    });

    document.getElementById('btn-open-sandbox')?.addEventListener('click', () => {
      document.getElementById('sandbox-modal')?.classList.remove('hidden');
      soundEngine.playClick();
    });
    document.getElementById('btn-close-sandbox')?.addEventListener('click', () => {
      document.getElementById('sandbox-modal')?.classList.add('hidden');
    });

    document.getElementById('btn-help-toggle')?.addEventListener('click', () => {
      document.getElementById('help-modal')?.classList.remove('hidden');
      soundEngine.playClick();
    });
    document.getElementById('btn-close-help')?.addEventListener('click', () => {
      document.getElementById('help-modal')?.classList.add('hidden');
    });

    document.getElementById('btn-reset-cam')?.addEventListener('click', () => {
      this.selectScale('body');
      this.scaleManager.animateCameraTo(new THREE.Vector3(0, 2, 28), new THREE.Vector3(0, 2, 0));
      soundEngine.playClick();
    });

    // Sandbox Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.applySandboxPreset(btn.dataset.preset);
        soundEngine.playMutateSound();
      });
    });

    // Fullscreen Mode Toggle
    const fsBtn = document.getElementById('btn-fullscreen-toggle');
    const iconFsEnter = document.getElementById('icon-fs-enter');
    const iconFsExit = document.getElementById('icon-fs-exit');

    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      }
    };

    fsBtn?.addEventListener('click', toggleFullscreen);

    document.addEventListener('fullscreenchange', () => {
      const isFs = !!document.fullscreenElement;
      iconFsEnter?.classList.toggle('hidden', isFs);
      iconFsExit?.classList.toggle('hidden', !isFs);
    });

    // Organ Popup Action Buttons
    document.getElementById('btn-close-organ-popup')?.addEventListener('click', () => {
      document.getElementById('organ-popup-overlay')?.classList.add('hidden');
    });

    document.getElementById('btn-popup-launch-cure')?.addEventListener('click', () => {
      document.getElementById('organ-popup-overlay')?.classList.add('hidden');
      this.playAutoCureStory();
    });

    document.getElementById('btn-popup-zoom-organ')?.addEventListener('click', () => {
      document.getElementById('organ-popup-overlay')?.classList.add('hidden');
      this.scaleManager.zoomToOrganOnBody(this.currentOrganKey);
    });

    // Comprehensive Desktop Hotkeys
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        pauseBtn?.click();
      } else if (e.key === 'm' || e.key === 'M') {
        audioBtn?.click();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'r' || e.key === 'R') {
        document.getElementById('btn-reset-cam')?.click();
      } else if (e.key === 'b' || e.key === 'B') {
        this.selectScale('body');
      } else if (e.key === 'o' || e.key === 'O') {
        this.selectScale('organ_diagram');
      } else if (e.key === 'c' || e.key === 'C') {
        this.selectScale('cell');
      } else if (e.key === 'd' || e.key === 'D') {
        this.selectScale('dna');
      } else if (e.key === 't' || e.key === 'T') {
        document.getElementById('btn-tour-toggle')?.click();
      } else if (e.key === 'Escape') {
        // Close all modals & popups
        document.getElementById('organ-popup-overlay')?.classList.add('hidden');
        document.getElementById('phenotype-modal')?.classList.add('hidden');
        document.getElementById('sandbox-modal')?.classList.add('hidden');
        document.getElementById('help-modal')?.classList.add('hidden');
      } else if (e.key >= '1' && e.key <= '9') {
        this.setTourStep(parseInt(e.key));
      }
    });
  }

  loadDisorder(key) {
    const data = DISORDERS_DB[key];
    if (!data) return;

    this.currentDisorderKey = key;
    this.currentSequence = [...data.sequence];

    document.querySelectorAll('.disorder-card').forEach(c => c.classList.remove('active'));
    document.querySelector(`.disorder-card[data-disorder="${key}"]`)?.classList.add('active');

    this.dnaModel.buildHelix(this.currentSequence, data.mutatedIndex);

    // Update Pathology Panel safely with optional chaining
    const pathTitle = document.getElementById('pathology-title');
    if (pathTitle) pathTitle.textContent = `Condition: ${data.name}`;

    const statusPill = document.getElementById('pathology-status');
    if (statusPill) {
      statusPill.className = `status-pill ${data.statusClass}`;
      statusPill.textContent = data.statusLabel;
    }

    const pathDesc = document.getElementById('pathology-desc');
    if (pathDesc) pathDesc.textContent = data.simpleExplain;

    // Update Cure Information Card
    const cureData = CURE_DATABASE[key] || CURE_DATABASE['sickle_cell'];
    const cureName = document.getElementById('cure-therapy-name');
    if (cureName) cureName.textContent = cureData.therapyName;

    const cureType = document.getElementById('cure-therapy-type');
    if (cureType) cureType.textContent = cureData.therapyType;

    const cureMech = document.getElementById('cure-mechanism-text');
    if (cureMech) cureMech.textContent = cureData.simpleHowItWorks;

    const cureBtnText = document.getElementById('cure-btn-text');
    if (cureBtnText) cureBtnText.textContent = `ADMINISTER ${cureData.therapyName.split('(')[0].trim().toUpperCase()} CURE`;

    this.renderCodonStrip();
    this.vrHUD.updateInfo(this.currentOrganKey, key, this.scaleManager.currentScale);
  }

  /**
   * Orchestrates the 9-Step Guided Medical Tour
   */
  setTourStep(stepNumber) {
    this.currentTourStep = stepNumber;
    const disease = DISORDERS_DB[this.currentDisorderKey] || DISORDERS_DB['sickle_cell'];
    const cure = CURE_DATABASE[this.currentDisorderKey] || CURE_DATABASE['sickle_cell'];
    const organMeta = ORGAN_METADATA[this.currentOrganKey] || ORGAN_METADATA.heart;

    // Update Step Dots & Buttons
    document.querySelectorAll('.story-step-dot').forEach(d => {
      const dStep = parseInt(d.dataset.step);
      d.classList.toggle('active', dStep === stepNumber);
      d.classList.toggle('completed', dStep < stepNumber);
    });

    const btnPrev = document.getElementById('btn-story-prev');
    const btnNext = document.getElementById('btn-story-next');
    if (btnPrev) btnPrev.disabled = (stepNumber === 1);
    if (btnNext) btnNext.disabled = (stepNumber === 9);

    const badge = document.getElementById('story-step-badge');
    const title = document.getElementById('story-title');
    const subtitle = document.getElementById('story-subtitle');
    const desc = document.getElementById('story-description');
    const highlight = document.getElementById('story-highlight-box');

    if (badge) badge.textContent = `STEP ${stepNumber} / 9`;

    switch (stepNumber) {
      case 1:
        // Step 1: Whole Human Body Hologram
        if (title) title.textContent = 'Step 1: Whole Human Body Hologram';
        if (subtitle) subtitle.textContent = 'Macroscopic Human Anatomy Scanner (1x Scale)';
        if (desc) desc.textContent = 'Welcome to VisionX Virtual Medical Laboratory. We begin with the complete macroscopic human body, contoured with translucent bioluminescent skin and scanning lasers.';
        if (highlight) highlight.innerHTML = '<strong>What you see:</strong> Contoured 3D human anatomy rotating on the medical pedestal with an active diagnostic laser sweep.';
        this.selectScale('body');
        soundEngine.playScanSound();
        break;

      case 2:
        // Step 2: Major Organ Systems
        if (title) title.textContent = 'Step 2: Exploring Major Organs';
        if (subtitle) subtitle.textContent = '8 Anatomical Organs & Cellular Genome';
        if (desc) desc.textContent = 'The human body comprises complex organ systems working in harmony: Brain, Heart, Lungs, Liver, Kidneys, Stomach, Intestines, and Pancreas.';
        if (highlight) highlight.innerHTML = '<strong>What you see:</strong> Highlighting all 8 major anatomical organ nodes with pulsing targeting reticles.';
        this.selectScale('body');
        this.scaleManager.bodyModel.clearHighlight();
        soundEngine.playClick();
        break;

      case 3:
        // Step 3: Cardiovascular System & Heart Focus
        if (title) title.textContent = 'Step 3: Cardiovascular System & Heart Focus';
        if (subtitle) subtitle.textContent = 'Arterial Blood Circulation & Erythrocytes';
        if (desc) desc.textContent = 'Zooming into the heart and arterial tree, which pumps oxygen-rich red blood cells through miles of microscopic capillaries.';
        if (highlight) highlight.innerHTML = '<strong>What you see:</strong> Close-up view of the beating myocardial muscle and pulsating aorta arch.';
        this.selectOrgan('heart');
        break;

      case 4:
        // Step 4: Disease Detection (Sickle Cell / Cystic Fibrosis / etc.)
        if (title) title.textContent = `Step 4: Pathological Disease Detection`;
        if (subtitle) subtitle.textContent = `${disease.name} (${disease.chromosome})`;
        if (desc) desc.textContent = disease.simpleExplain;
        if (highlight) highlight.innerHTML = `<strong>Diagnostic Alert:</strong> Pathological mutation detected at ${disease.gene}. Red blood cells deform into rigid crescents that obstruct microvascular blood flow!`;
        this.selectScale('organ_diagram');
        soundEngine.playMutateSound();
        break;

      case 5:
        // Step 5: Cell / Tissue Scale
        if (title) title.textContent = 'Step 5: Microscopic Cell & Nuclear Pores';
        if (subtitle) subtitle.textContent = 'Diving into Cellular Organelles (10,000x Scale)';
        if (desc) desc.textContent = 'We penetrate the outer cellular membrane into the nucleus, through microscopic nuclear pores to reach chromatin fibers.';
        if (highlight) highlight.innerHTML = '<strong>What you see:</strong> Spherical cell membrane with 40 active nuclear transport pores and unfurling chromatin threads.';
        this.selectScale('cell');
        soundEngine.playClick();
        break;

      case 6:
        // Step 6: Molecular B-DNA Double Helix
        if (title) title.textContent = 'Step 6: Molecular DNA Double Helix';
        if (subtitle) subtitle.textContent = '3.2 Billion Base Pairs (100,000,000x Scale)';
        if (desc) desc.textContent = 'We reach the molecular double helix: Adenine (A) pairs with Thymine (T) via 2 hydrogen bonds; Cytosine (C) pairs with Guanine (G) via 3 hydrogen bonds.';
        if (highlight) highlight.innerHTML = '<strong>What you see:</strong> B-DNA double helix with 10.5 base pairs per helical turn and bioluminescent nucleotide glows.';
        this.selectScale('dna');
        soundEngine.playClick();
        break;

      case 7:
        // Step 7: Identifying the Genetic Typo
        if (title) title.textContent = 'Step 7: Identifying the Genetic Typo';
        if (subtitle) subtitle.textContent = `Pinpointing Mutation: ${disease.shiftSummary}`;
        if (desc) desc.textContent = `The strand unwinds in an active replication bubble to reveal the exact genetic typo: ${disease.shiftSummary}, altering protein translation.`;
        if (highlight) highlight.innerHTML = '<strong>What you see:</strong> Unwinding replication bubble pinpointing the glowing mutant nucleotide in the reading frame!';
        this.selectScale('dna');
        this.dnaModel.animateReplicationAndUnwind(disease.mutatedIndex);
        soundEngine.playUnwindSound();
        break;

      case 8:
        // Step 8: CRISPR-Cas9 Precision Molecular Intervention
        if (title) title.textContent = 'Step 8: CRISPR-Cas9 Precision Intervention';
        if (subtitle) subtitle.textContent = cure.therapyName;
        if (desc) desc.textContent = cure.simpleHowItWorks;
        if (highlight) highlight.innerHTML = '<strong>What you see:</strong> 3D Cas9 molecular scissors fly into the target sequence, making a precise cut and inserting the healthy repair patch!';
        this.administerCure();
        break;

      case 9:
        // Step 9: Return to Healthy State & Phenotypic Recovery
        if (title) title.textContent = 'Step 9: Physiological Recovery & Healthy State';
        if (subtitle) subtitle.textContent = 'Complete Phenotype Restoration';
        if (desc) desc.textContent = 'Following precision molecular correction, the body permanently resumes producing healthy, flexible biconcave discs. Capillaries flow freely with zero blockages!';
        if (highlight) highlight.innerHTML = '<strong>What you see:</strong> Deformed crescent blood cells smoothly morph into soft, flexible round donuts! Organ circulation is fully restored.';
        this.selectScale('phenotype');
        this.scaleManager.morphMutantToCured();
        soundEngine.playCureSound();
        break;
    }
  }

  playAutoTour() {
    this.clearTourTimeouts();
    this.isAutoPlaying = true;

    const btn = document.getElementById('btn-story-autoplay');
    if (btn) {
      btn.style.opacity = '0.65';
      btn.innerHTML = `<span>▶ Playing Guided Tour...</span>`;
    }

    const stepInterval = 3400;
    for (let s = 1; s <= 9; s++) {
      this.tourTimeouts.push(
        setTimeout(() => {
          this.setTourStep(s);
          if (s === 9) {
            this.tourTimeouts.push(
              setTimeout(() => {
                if (btn) {
                  btn.style.opacity = '1.0';
                  btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>Play Full 9-Step Guided Tour</span>`;
                }
                this.isAutoPlaying = false;
              }, 4000)
            );
          }
        }, (s - 1) * stepInterval)
      );
    }
  }

  playAutoCureStory(disorderKey) {
    if (disorderKey && disorderKey !== this.currentDisorderKey) {
      this.loadDisorder(disorderKey);
    }
    this.setTourStep(7);
    setTimeout(() => {
      this.setTourStep(8);
      setTimeout(() => {
        this.setTourStep(9);
      }, 3500);
    }, 2800);
  }

  clearTourTimeouts() {
    if (this.tourTimeouts) {
      this.tourTimeouts.forEach(t => clearTimeout(t));
    }
    this.tourTimeouts = [];
  }

  administerCure() {
    const cureBtn = document.getElementById('btn-administer-cure');
    if (cureBtn) {
      cureBtn.disabled = true;
      cureBtn.style.opacity = '0.6';
    }

    soundEngine.playCrisprCutSound();

    if (this.scaleManager.currentScale !== 'dna') {
      this.selectScale('dna');
    }

    const cure = CURE_DATABASE[this.currentDisorderKey] || CURE_DATABASE['sickle_cell'];

    // Target base index & repair character for each condition
    let targetIndex = 19;
    let repairChar = 'A';
    let cureSuccessMessage = 'CURED! HEALTHY DONUT CELLS RESTORED';

    if (this.currentDisorderKey === 'huntington') {
      targetIndex = 3;
      repairChar = 'C';
      cureSuccessMessage = 'CURED! BRAIN NERVES SAVED & TOXIC CLUMPS DISSOLVED';
    } else if (this.currentDisorderKey === 'cystic_fibrosis') {
      targetIndex = 6;
      repairChar = 'C';
      cureSuccessMessage = 'CURED! LUNG AIRWAYS OPENED & MUCUS CLEARED';
    } else if (this.currentDisorderKey === 'down_syndrome') {
      targetIndex = 9;
      repairChar = 'A';
      cureSuccessMessage = 'CURED! CHROMOSOME 21 BALANCED VIA XIST SLEEP SWITCH';
    }

    const targetPos = this.dnaModel.getBasePosition(targetIndex);

    // Play 3D Cas9 molecular scissors animation
    this.crisprEffect.playRepairAnimation(targetPos, () => {
      // Golden particle burst & sequence repair
      this.dnaModel.animateCrisprRepair(targetIndex, repairChar, () => {
        soundEngine.playCureSound();

        const statusPill = document.getElementById('pathology-status');
        if (statusPill) {
          statusPill.className = 'status-pill status-healthy';
          statusPill.textContent = cureSuccessMessage;
        }

        // Heal functional organ diagrams & morph cells
        if (this.currentDisorderKey === 'sickle_cell') {
          this.scaleManager.organDiagrams.healBlood();
          this.scaleManager.morphMutantToCured();
        } else if (this.currentDisorderKey === 'cystic_fibrosis') {
          this.scaleManager.organDiagrams.healLungs();
        } else if (this.currentDisorderKey === 'huntington') {
          this.scaleManager.organDiagrams.healBrain();
        } else {
          this.scaleManager.morphMutantToCured();
        }

        const cureBtnText = document.getElementById('cure-btn-text');
        if (cureBtnText) {
          cureBtnText.textContent = `${cure.therapyName.split('(')[0].trim()} SUCCESSFUL! CURED ✓`;
        }
        if (cureBtn) {
          cureBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          cureBtn.style.opacity = '1.0';
        }

        this.renderCodonStrip();

        setTimeout(() => {
          if (cureBtn) cureBtn.disabled = false;
        }, 3000);
      });
    });
  }

  renderCodonStrip() {
    const track = document.getElementById('codon-track');
    if (!track) return;
    track.innerHTML = '';

    const codons = translateSequence(this.currentSequence);
    const mutantCodon = (this.currentDisorderKey === 'sickle_cell') ? 7 : -1;

    codons.forEach((codon) => {
      const pill = document.createElement('div');
      pill.className = `codon-pill ${codon.index === mutantCodon ? 'mutant' : ''}`;
      pill.dataset.codon = codon.index;

      pill.innerHTML = `
        <span class="codon-triplet">${codon.mrna}</span>
        <span class="codon-amino">${codon.amino.code}</span>
      `;

      pill.addEventListener('click', () => {
        this.highlightCodonInHelix(codon.index);
        soundEngine.playClick();
      });

      track.appendChild(pill);
    });
  }

  highlightCodonInStrip(codonIndex) {
    document.querySelectorAll('.codon-pill').forEach(p => {
      p.classList.toggle('active', parseInt(p.dataset.codon) === codonIndex);
    });
    const ribosomeMarker = document.getElementById('ribosome-marker');
    if (ribosomeMarker) {
      ribosomeMarker.textContent = `Word ${codonIndex} of ${Math.ceil(this.currentSequence.length / 3)}`;
    }
  }

  highlightCodonInHelix(codonIndex) {
    const baseIndex = (codonIndex - 1) * 3;
    if (baseIndex < this.currentSequence.length) {
      this.dnaModel.highlightBase(baseIndex);
    }
  }

  simulateTranscription() {
    soundEngine.playUnwindSound();
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const codonIndex = (step % Math.ceil(this.currentSequence.length / 3)) + 1;
      this.highlightCodonInHelix(codonIndex);
      if (step > 12) clearInterval(interval);
    }, 280);
  }

  applySandboxPreset(type) {
    const mutBox = document.getElementById('sandbox-mut-seq');
    const peptideBox = document.getElementById('sandbox-peptide');
    const impactBox = document.getElementById('sandbox-impact');

    if (type === 'missense') {
      if (mutBox) mutBox.textContent = 'ATG GTG CAC CTG ACT CCT GTG GAG AAG TCT GCC';
      if (peptideBox) peptideBox.textContent = 'Met - Val - His - Leu - Thr - Pro - [Val] - Glu - Lys - Ser - Ala';
      if (impactBox) impactBox.innerHTML = '<strong>1-Letter Swap:</strong> Letter A changed to T at position 7 (Sickle Cell Anemia).';
      this.loadDisorder('sickle_cell');
      this.setTourStep(7);
    } else if (type === 'nonsense') {
      if (mutBox) mutBox.textContent = 'ATG GTG CAC CTG ACT CCT TAA GAG AAG TCT GCC';
      if (peptideBox) peptideBox.textContent = 'Met - Val - His - Leu - Thr - Pro - [STOP]';
      if (impactBox) impactBox.innerHTML = '<strong>Premature Stop:</strong> A stop word was created too early, cutting protein production short.';
    } else if (type === 'frameshift') {
      if (mutBox) mutBox.textContent = 'ATG GTG CAC CTG ACT CCT A GAG GAG AAG TCT GCC';
      if (peptideBox) peptideBox.textContent = 'Met - Val - His - Leu - Thr - Pro - [Arg] - [Gly] - [Arg]...';
      if (impactBox) impactBox.innerHTML = '<strong>Letter Insertion:</strong> Pushing 1 extra letter shifts all words downstream, creating jumbled gibberish.';
    } else if (type === 'deletion') {
      if (mutBox) mutBox.textContent = 'ATG GTG CAC CTG ACT CCT --- GAG AAG TCT GCC';
      if (peptideBox) peptideBox.textContent = 'Met - Val - His - Leu - Thr - Pro - [Deleted] - Glu - Lys...';
      if (impactBox) impactBox.innerHTML = '<strong>3 Letters Erased:</strong> Erasing 3 letters breaks the protein without jumbling the rest (Cystic Fibrosis ΔF508).';
      this.loadDisorder('cystic_fibrosis');
      this.setTourStep(7);
    } else if (type === 'reset') {
      if (mutBox) mutBox.textContent = 'ATG GTG CAC CTG ACT CCT GAG GAG AAG TCT GCC';
      if (peptideBox) peptideBox.textContent = 'Met - Val - His - Leu - Thr - Pro - Glu - Glu - Lys - Ser - Ala';
      if (impactBox) impactBox.innerHTML = '<strong>100% Healthy:</strong> Normal healthy recipe without typos.';
      this.loadDisorder('wildtype');
      this.setTourStep(1);
    }
  }

  animate() {
    const delta = this.clock.getDelta();

    if (this.dnaModel) {
      this.dnaModel.animate(delta, this.rotationSpeed, !this.isRotating);
    }
    if (this.scaleManager) {
      this.scaleManager.animate(delta);
    }

    // VR Interaction & Raycasting Loop
    if (this.renderer.xr.isPresenting) {
      // Raycast right controller laser pointer into VR HUD
      if (this.controller1 && this.vrHUD) {
        const tempMatrix = new THREE.Matrix4();
        tempMatrix.identity().extractRotation(this.controller1.matrixWorld);

        const vrRaycaster = new THREE.Raycaster();
        vrRaycaster.ray.origin.setFromMatrixPosition(this.controller1.matrixWorld);
        vrRaycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        this.vrHUD.updateRaycast(vrRaycaster, false, this.controller1);
      }

      // Model Grabbing with Grip button
      if (this.isGripDown && this.controller1) {
        const deltaX = this.controller1.position.x - this.previousControllerPos.x;
        if (this.scaleManager.bodyModel && this.scaleManager.bodyModel.group.visible) {
          this.scaleManager.bodyModel.group.rotation.y += deltaX * 3.5;
        } else if (this.dnaModel && this.dnaModel.group.visible) {
          this.dnaModel.group.rotation.y += deltaX * 3.5;
        }
        this.previousControllerPos.copy(this.controller1.position);
      }
    } else {
      // Desktop OrbitControls & Raycaster Hover Tooltip
      this.controls.update();

      this.raycaster.setFromCamera(this.mouse, this.camera);
      let hitCandidates = [];

      if (this.scaleManager.currentScale === 'body') {
        hitCandidates = this.scaleManager.bodyModel.getClickableHotspots();
      } else if (this.dnaModel && this.dnaModel.group.visible) {
        hitCandidates = this.dnaModel.getClickableMeshes();
      }

      const intersects = this.raycaster.intersectObjects(hitCandidates, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        this.hoveredMesh = hit;
        const uData = hit.userData;

        if (this.tooltip && uData) {
          this.tooltip.classList.remove('hidden');
          if (uData.organKey) {
            const meta = ORGAN_METADATA[uData.organKey];
            this.tooltipTitle.textContent = `${meta.icon} ${meta.simpleName}`;
            this.tooltipSub.textContent = `Click to Zoom & Inspect (${meta.system})`;
          } else if (uData.organ) {
            this.tooltipTitle.textContent = uData.name;
            this.tooltipSub.textContent = `Click to Zoom & Inspect (${uData.organ})`;
          } else if (uData.base) {
            const meta = BASE_METADATA[uData.base] || BASE_METADATA['A'];
            this.tooltipTitle.textContent = `${meta.name} (${uData.base})`;
            this.tooltipSub.textContent = `Pairs with ${uData.complement} • Word ${uData.codonIndex}`;
          }
        }
        document.body.style.cursor = 'pointer';
      } else {
        this.hoveredMesh = null;
        if (this.tooltip) this.tooltip.classList.add('hidden');
        document.body.style.cursor = 'default';
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new VisionXApp();
});
