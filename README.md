# 🧬 VisionX: Virtual Medical Laboratory & Multi-Scale Genomic WebXR Explorer

An interactive 3D and WebXR Virtual Reality medical visualization experience that takes users on an immersive journey across multiple biological scales:
**HUMAN BODY → ORGAN → TISSUE/CELL → CHROMOSOMES → DNA → GENETIC MUTATION → PRECISION CRISPR CURE SIMULATION**.

Deployed for static hosting on GitHub Pages:
**[https://harsha705-code.github.io/VisionX/](https://harsha705-code.github.io/VisionX/)**

---

## 🌟 The Complete Multi-Scale Medical Workflow

```
[Scale 0: Whole Human Body Hologram]
       │ (Medical Scanner sweeps & highlights 8 Interactive Organs)
       ▼ (Brain, Heart, Lungs, Liver, Kidneys, Stomach, Intestines, Pancreas, Genome)
[Scale 1: Functional Organ & Tissue Diagram]
       │ (Neural synapses firing, bronchial airways, or capillary bed)
       ▼ (Cinematic Dive through nuclear pores)
[Scale 2: Microscopic Cell Nucleus & Chromatin]
       │ (Chromatin unfurling & nuclear transport pores)
       ▼ (Locates Pathogenic Gene Loci: HBB, CFTR, HTT, Trisomy 21)
[Scale 3: 23 Chromosome Karyotype]
       │ (Inspects chromosomal structure & numerical aneuploidies)
       ▼ (Atomic zoom to base pairs)
[Scale 4: Molecular B-DNA Double Helix]
       │ (10.5 bp/turn, A-T & G-C hydrogen bonding, unwinding bubble)
       ▼ (User activates "ADMINISTER CRISPR-CAS9 CURE")
[Scale 5: Precision Molecular Intervention & Phenotypic Recovery]
  - 3D Cas9 molecular scissors and gRNA complex flies into DNA sequence
  - Double-strand break and Homology-Directed Repair (HDR)
  - Mutant sequence restored to Wild-Type (e.g. GTG -> GAG)
  - Diseased cells (Sickle Erythrocytes) morph into healthy biconcave discs!
```

---

## 🚀 Key Features

1. **Futuristic Medical Holodeck Environment (`js/scaleViews.js`)**:
   - Dark sci-fi medical laboratory with radial glowing floor grid and concentric light rings.
   - Volumetric diagnostic scanner light cone projecting onto the patient pedestal.
   - Drifting ambient bio-digital holographic particles.
   - Diagnostic laboratory measurement arches.

2. **8 Interactive Major Organs (`js/bodyModel.js`)**:
   - 🧠 **Brain / CNS**: Huntington's Disease ($HTT$ locus on Chromosome 4)
   - ❤️ **Heart / Cardiovascular**: Sickle Cell Anemia ($HBB$ locus on Chromosome 11)
   - 🫁 **Lungs / Respiratory**: Cystic Fibrosis ($CFTR$ locus on Chromosome 7)
   - 🟤 **Liver / Hepatic**: Metabolic clearance & Wilson's Disease ($ATP7B$ locus)
   - 🫘 **Kidneys / Renal**: Fluid filtration & Polycystic Kidney Disease ($PKD1/PKD2$)
   - 🥣 **Stomach / GI**: Acid secretion & gastric physiology
   - 〰️ **Intestines / Enteric**: Nutrient absorption & Celiac/IBD physiology
   - 🥖 **Pancreas / Endocrine**: Islets of Langerhans, insulin regulation & diabetes
   - 🧬 **Cellular Genome**: Down Syndrome (Trisomy 21)

3. **In-World 3D WebXR Floating Holographic HUD (`js/vrHUD.js`)**:
   - Floating curved 3D holographic command dashboard inside VR.
   - 6DoF VR controller laser raycasting with hover glow, click feedback, and haptic pulses.
   - Controller grip grabbing for rotating and inspecting the 3D model directly in virtual space.
   - High-contrast dynamic 3D canvas information panels readable in VR headsets.
   - Seamless switching: 3D panels in VR, 2D responsive glassmorphic UI on desktop.

4. **9-Step Guided Medical Tour (`js/main.js`)**:
   - Step 1: Whole Human Body Hologram & Medical Scanner
   - Step 2: 8 Major Organ Systems Exploration
   - Step 3: Cardiovascular System & Heart Focus
   - Step 4: Pathological Disease Detection (Sickle Cell Anemia)
   - Step 5: Microscopic Cell & Nuclear Pores (10,000x)
   - Step 6: Molecular DNA Double Helix & Base Pairing (100,000,000x)
   - Step 7: Identifying Genetic Mutation & Unwinding Bubble
   - Step 8: CRISPR-Cas9 Precision Molecular Intervention
   - Step 9: Physiological Cell Recovery & Return to Healthy State

5. **Gene Therapy & CRISPR-Cas9 Precision Cure Engine (`js/cureEngine.js`)**:
   - **Sickle Cell Anemia Cure**: Cas9 molecular scissors and donor template restore codon 6 ($GTG \rightarrow GAG$), morphing sickle cells into flexible biconcave discs.
   - **Cystic Fibrosis Therapy**: AAV delivery and Trikafta molecular chaperones restoring CFTR chloride channel transport.
   - **Huntington's Therapy**: ASO antisense oligonucleotide shredders targeting toxic $CAG$ repeat transcripts.
   - **Down Syndrome Therapy**: Targeted $XIST$ chromosome dosage compensation sleep switch.

6. **WebXR VR & Procedural Audio Synthesizer (`js/audio.js`)**:
   - One-click **ENTER VR** button for Meta Quest, HTC Vive, Apple Vision Pro.
   - Pure Web Audio API procedural sound engine: ambient drone, medical scanner sweeps, CRISPR snips, and curative fanfare chords.

---

## ⚡ Quick Start (Zero Dependencies)

Runs directly on Windows without Node.js or Python:

1. Open PowerShell in the project directory:
   ```powershell
   cd C:\Users\harsh\.gemini\antigravity-ide\scratch\vr-dna-disorder-explorer
   ```

2. Start the local HTTP server:
   ```powershell
   .\serve.ps1
   ```

3. Open your browser:
   ```
   http://localhost:8080/
   ```

---

## 🎮 Desktop Controls

- **Mouse Left Drag**: Rotate 3D camera / hologram
- **Mouse Wheel**: Smooth zoom in / out
- **Mouse Left Click**: Select organ / base pair / button
- **Key B**: Switch to Whole Body Scale
- **Key O**: Switch to Organ Diagram Scale
- **Key C**: Switch to Cell / Tissue Scale
- **Key D**: Switch to DNA Double Helix Scale
- **Key R**: Reset Camera View
- **Key Space**: Play / Pause Rotation
- **Key M**: Mute / Unmute Audio Synthesizer
- **Key F**: Toggle Fullscreen Mode
- **Key T**: Toggle 9-Step Guided Tour
- **Key ESC**: Close all active popups / modals
- **Keys 1 - 9**: Jump directly to Guided Tour steps 1 through 9

---

## 🥽 WebXR Virtual Reality Controls

- **Laser Pointer**: Aim controller at 3D floating buttons, organ nodes, or DNA rungs.
- **Trigger Pull**: Select scales, inspect organs, and deploy CRISPR cure with haptic pulse.
- **Grip Squeeze**: Grab and rotate the 3D human body or DNA model in virtual space.
