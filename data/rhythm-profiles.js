/* ============================================================
   ECG RHYTHM PROFILES
   Educational visual presets only. Not medical diagnosis.
============================================================ */

window.ECG = window.ECG || {};

window.ECG.rhythmProfiles = {
  normal: {
    label: "Normal Sinus Rhythm",
    pHeight: 0.15,
    qDepth: -0.24,
    rHeight: 1.20,
    sDepth: -0.35,
    qrsWidth: 0.008,
    tHeight: 0.35,
    tWidth: 0.060,
    irregularity: 0,
    fibrillation: false,
    pvc: false
  },

  brady: {
    label: "Sinus Bradycardia",
    forcedRate: 45,
    pHeight: 0.15,
    qDepth: -0.24,
    rHeight: 1.20,
    sDepth: -0.35,
    qrsWidth: 0.008,
    tHeight: 0.35,
    tWidth: 0.060,
    irregularity: 0,
    fibrillation: false,
    pvc: false
  },

  tachy: {
    label: "Sinus Tachycardia",
    forcedRate: 135,
    pHeight: 0.13,
    qDepth: -0.22,
    rHeight: 1.12,
    sDepth: -0.32,
    qrsWidth: 0.008,
    tHeight: 0.30,
    tWidth: 0.050,
    irregularity: 0,
    fibrillation: false,
    pvc: false
  },

  afib: {
    label: "Atrial Fibrillation",
    pHeight: 0.00,
    qDepth: -0.20,
    rHeight: 1.08,
    sDepth: -0.30,
    qrsWidth: 0.008,
    tHeight: 0.22,
    tWidth: 0.055,
    irregularity: 0.35,
    fibrillation: true,
    pvc: false
  },

  pvc: {
    label: "PVC",
    pHeight: 0.12,
    qDepth: -0.22,
    rHeight: 1.08,
    sDepth: -0.32,
    qrsWidth: 0.008,
    tHeight: 0.30,
    tWidth: 0.060,
    irregularity: 0,
    fibrillation: false,
    pvc: true
  },

  hyperkalemia: {
    label: "Hyperkalemia Look",
    pHeight: 0.05,
    qDepth: -0.18,
    rHeight: 1.00,
    sDepth: -0.30,
    qrsWidth: 0.010,
    tHeight: 0.82,
    tWidth: 0.035,
    irregularity: 0,
    fibrillation: false,
    pvc: false
  },

  stemiAnterior: {
    label: "Anterior STEMI Look",
    pHeight: 0.13,
    qDepth: -0.22,
    rHeight: 1.15,
    sDepth: -0.33,
    qrsWidth: 0.008,
    tHeight: 0.38,
    tWidth: 0.060,
    irregularity: 0,
    fibrillation: false,
    pvc: false,
    stElevation: {
      V1: 0.12,
      V2: 0.25,
      V3: 0.26,
      V4: 0.15
    }
  }
};
