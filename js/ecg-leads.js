/* ============================================================
   ECG LEAD CONFIGURATION
============================================================ */

window.ECG = window.ECG || {};

window.ECG.leads = [
  "I", "aVR", "V1", "V4",
  "II", "aVL", "V2", "V5",
  "III", "aVF", "V3", "V6"
];

window.ECG.leadModifiers = {
  I:   { amp: 0.85, invert: false },
  II:  { amp: 1.00, invert: false },
  III: { amp: 0.70, invert: false },

  aVR: { amp: 0.70, invert: true },
  aVL: { amp: 0.55, invert: false },
  aVF: { amp: 0.75, invert: false },

  V1:  { amp: 0.55, invert: true },
  V2:  { amp: 0.78, invert: false },
  V3:  { amp: 0.95, invert: false },
  V4:  { amp: 1.10, invert: false },
  V5:  { amp: 1.00, invert: false },
  V6:  { amp: 0.85, invert: false }
};
