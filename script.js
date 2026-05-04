/* ============================================================
   ECG 12 LEAD GENERATOR - MAIN SCRIPT
   Educational simulator only. Not for diagnosis.
============================================================ */

/* ============================================================
   PROJECT MAP - SCRIPT.JS
   ============================================================

   00. App Namespace
   01. Canvas Setup
   02. DOM References
   03. Preferences / Local Storage
   04. Safety + Debug Helpers
   05. Math Helpers
   06. ECG Wave Generator
   07. Draw Helpers
   08. Main Render Function
   09. UI Events
   10. App Init

   Tip:
   Use Ctrl + F and search "#region 08" to jump to events.

============================================================ */


/* #region 00 - App Namespace */

window.ECG = window.ECG || {};

/* #endregion */


/* #region 01 - Canvas Setup */

const canvas = document.getElementById("ecgCanvas");
const ctx = canvas.getContext("2d");

/* #endregion */


/* #region 02 - DOM References */

const controls = {
  heartRate: document.getElementById("heartRate"),
  heartRateHint: document.getElementById("heartRateHint"),
  rhythm: document.getElementById("rhythm"),
  noiseLevel: document.getElementById("noiseLevel"),

  rightEcgToggle: document.getElementById("rightEcgToggle"),

  printBtn: document.getElementById("printBtn"),
  settingsBtn: document.getElementById("settingsBtn"),

  ecgControlsBtn: document.getElementById("ecgControlsBtn"),
  ecgControlsOverlay: document.getElementById("ecgControlsOverlay"),
  closeEcgControlsBtn: document.getElementById("closeEcgControlsBtn"),
  closeEcgControlsFooterBtn: document.getElementById("closeEcgControlsFooterBtn"),

  drawerBeatSpacingSlider: document.getElementById("drawerBeatSpacingSlider"),
  drawerBeatSpacingValue: document.getElementById("drawerBeatSpacingValue"),

  drawerPHeightSlider: document.getElementById("drawerPHeightSlider"),
  drawerPHeightValue: document.getElementById("drawerPHeightValue"),

  drawerQDepthSlider: document.getElementById("drawerQDepthSlider"),
  drawerQDepthValue: document.getElementById("drawerQDepthValue"),

  drawerRHeightSlider: document.getElementById("drawerRHeightSlider"),
  drawerRHeightValue: document.getElementById("drawerRHeightValue"),

  drawerSDepthSlider: document.getElementById("drawerSDepthSlider"),
  drawerSDepthValue: document.getElementById("drawerSDepthValue"),

  drawerTHeightSlider: document.getElementById("drawerTHeightSlider"),
  drawerTHeightValue: document.getElementById("drawerTHeightValue"),

  drawerQrsWidthSlider: document.getElementById("drawerQrsWidthSlider"),
  drawerQrsWidthValue: document.getElementById("drawerQrsWidthValue"),

  drawerTWidthSlider: document.getElementById("drawerTWidthSlider"),
  drawerTWidthValue: document.getElementById("drawerTWidthValue"),

  drawerResetWaveformBtn: document.getElementById("drawerResetWaveformBtn"),

  settingsOverlay: document.getElementById("settingsOverlay"),
  closeSettingsBtn: document.getElementById("closeSettingsBtn"),
  saveSettingsBtn: document.getElementById("saveSettingsBtn"),
  resetSettingsBtn: document.getElementById("resetSettingsBtn"),

  darkModeToggle: document.getElementById("darkModeToggle"),

  pageScaleSlider: document.getElementById("pageScaleSlider"),
  pageScaleValue: document.getElementById("pageScaleValue"),

  signalHeightSlider: document.getElementById("signalHeightSlider"),
  signalHeightValue: document.getElementById("signalHeightValue"),


  gridOpacitySlider: document.getElementById("gridOpacitySlider"),
  gridOpacityValue: document.getElementById("gridOpacityValue")
};

/* #endregion */


/* #region 03 - Preferences / Local Storage */

const DEFAULT_PREFS = {
  darkMode: false,
  pageScale: 88,
  signalHeight: 45,
  gridOpacity: 100,

  heartRate: 75,
  rhythm: "normal",
  noiseLevel: "0",
  rightEcg: false,

  beatSpacing: 75,

  pHeightScale: 100,
  qDepthScale: 100,
  rHeightScale: 100,
  sDepthScale: 100,
  tHeightScale: 100,
  qrsWidthScale: 100,
  tWidthScale: 100
};

const RHYTHM_RATE_HINTS = {
  normal: "Recommended: 60–100",
  brady: "Recommended: 40–59",
  tachy: "Recommended: 100–160",
  afib: "Often variable: 80–160",
  pvc: "Usually base rhythm: 60–100",
  hyperkalemia: "Variable: 50–120",
  stemiAnterior: "Often 60–110"
};

const RHYTHM_DEFAULT_HR = {
  normal: 75,
  brady: 45,
  tachy: 120,
  afib: 90,
  pvc: 75,
  hyperkalemia: 75,
  stemiAnterior: 80
};

const STORAGE_KEY = "dor_ecg_generator_prefs_v2";

let prefs = { ...DEFAULT_PREFS };

/**
 * Loads saved user preferences from localStorage.
 *
 * If no preferences exist, the app uses DEFAULT_PREFS.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function loadPrefs() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    prefs = { ...DEFAULT_PREFS };
    return;
  }

  try {
    prefs = { ...DEFAULT_PREFS, ...JSON.parse(saved) };
  } catch (error) {
    console.warn("Could not parse saved ECG preferences. Using defaults.", error);
    prefs = { ...DEFAULT_PREFS };
  }
}

/**
 * Saves the current preferences to localStorage.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function savePrefs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

/**
 * Reads all current UI values into the prefs object.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function readPrefsFromUI() {
  prefs.darkMode = controls.darkModeToggle.checked;
  prefs.pageScale = Number(controls.pageScaleSlider.value);
  prefs.signalHeight = Number(controls.signalHeightSlider.value);
  prefs.gridOpacity = Number(controls.gridOpacitySlider.value);

  prefs.heartRate = Number(controls.heartRate.value);
  prefs.rhythm = controls.rhythm.value;
  prefs.noiseLevel = controls.noiseLevel.value;

  prefs.rightEcg = Boolean(controls.rightEcgToggle.checked);

  /*** Waveform Scales - Drawer Source ***/
  prefs.beatSpacing = Number(controls.drawerBeatSpacingSlider.value);

  prefs.pHeightScale = Number(controls.drawerPHeightSlider.value);
  prefs.qDepthScale = Number(controls.drawerQDepthSlider.value);
  prefs.rHeightScale = Number(controls.drawerRHeightSlider.value);
  prefs.sDepthScale = Number(controls.drawerSDepthSlider.value);
  prefs.tHeightScale = Number(controls.drawerTHeightSlider.value);
  prefs.qrsWidthScale = Number(controls.drawerQrsWidthSlider.value);
  prefs.tWidthScale = Number(controls.drawerTWidthSlider.value);

  prefs.pHeightScale = Number(controls.drawerPHeightSlider.value);
  prefs.qDepthScale = Number(controls.drawerQDepthSlider.value);
  prefs.rHeightScale = Number(controls.drawerRHeightSlider.value);
  prefs.sDepthScale = Number(controls.drawerSDepthSlider.value);
  prefs.tHeightScale = Number(controls.drawerTHeightSlider.value);
  prefs.qrsWidthScale = Number(controls.drawerQrsWidthSlider.value);
  prefs.tWidthScale = Number(controls.drawerTWidthSlider.value);
}

/**
 * Applies the current prefs object back into the UI.
 *
 * This keeps the HTML controls synchronized with localStorage.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function applyPrefsToUI() {
  document.body.classList.toggle("dark-mode", prefs.darkMode);

  controls.darkModeToggle.checked = prefs.darkMode;
  controls.pageScaleSlider.value = prefs.pageScale;
  controls.signalHeightSlider.value = prefs.signalHeight;
  controls.gridOpacitySlider.value = prefs.gridOpacity;

  controls.heartRate.value = prefs.heartRate;
  controls.rhythm.value = prefs.rhythm;
  controls.noiseLevel.value = prefs.noiseLevel;

  controls.rightEcgToggle.checked = prefs.rightEcg;

  controls.drawerBeatSpacingSlider.value = prefs.beatSpacing;

  controls.drawerPHeightSlider.value = prefs.pHeightScale;
  controls.drawerQDepthSlider.value = prefs.qDepthScale;
  controls.drawerRHeightSlider.value = prefs.rHeightScale;
  controls.drawerSDepthSlider.value = prefs.sDepthScale;
  controls.drawerTHeightSlider.value = prefs.tHeightScale;
  controls.drawerQrsWidthSlider.value = prefs.qrsWidthScale;
  controls.drawerTWidthSlider.value = prefs.tWidthScale;

  updateDrawerLabels();

  updateSettingsLabels();

  document.documentElement.style.setProperty("--ecg-scale", prefs.pageScale / 100);
}

/**
 * Updates visible values next to each settings slider.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function updateSettingsLabels() {
  controls.pageScaleValue.textContent = `${controls.pageScaleSlider.value}%`;
  controls.signalHeightValue.textContent = controls.signalHeightSlider.value;
  controls.gridOpacityValue.textContent = `${controls.gridOpacitySlider.value}%`;

}



/**
 * Updates visible values inside the ECG drawer.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function updateDrawerLabels() {
  controls.drawerBeatSpacingValue.textContent = `${controls.drawerBeatSpacingSlider.value}%`;
  controls.drawerPHeightValue.textContent = `${controls.drawerPHeightSlider.value}%`;
  controls.drawerQDepthValue.textContent = `${controls.drawerQDepthSlider.value}%`;
  controls.drawerRHeightValue.textContent = `${controls.drawerRHeightSlider.value}%`;
  controls.drawerSDepthValue.textContent = `${controls.drawerSDepthSlider.value}%`;
  controls.drawerTHeightValue.textContent = `${controls.drawerTHeightSlider.value}%`;
  controls.drawerQrsWidthValue.textContent = `${controls.drawerQrsWidthSlider.value}%`;
  controls.drawerTWidthValue.textContent = `${controls.drawerTWidthSlider.value}%`;
}


/**
 * Updates the small heart-rate recommendation text according to rhythm.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function updateHeartRateHint() {
  const rhythm = controls.rhythm.value;
  controls.heartRateHint.textContent =
    RHYTHM_RATE_HINTS[rhythm] || "Recommended: depends on rhythm";
}

/**
 * Resets all preferences to the default app state.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function resetPrefs() {
  localStorage.removeItem(STORAGE_KEY);
  prefs = { ...DEFAULT_PREFS };

  applyPrefsToUI();
  savePrefs();
  drawAllLeads(false);
}

/**
 * Resets ECG-related controls for the currently selected rhythm.
 *
 * This resets:
 * - HR to the default value of the selected rhythm
 * - Signal height
 * - Beat spacing
 * - P/Q/R/S/T morphology sliders
 * - QRS/T width sliders
 *
 * It does not reset:
 * - Dark mode
 * - Page scale
 * - Grid opacity
 * - Selected rhythm
 * - Noise level
 * - Right ECG
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function resetWaveformPrefs() {
  const selectedRhythm = controls.rhythm.value;
  const selectedProfile = getProfile(selectedRhythm);

  prefs.heartRate =
    selectedProfile.forcedRate ||
    RHYTHM_DEFAULT_HR[selectedRhythm] ||
    DEFAULT_PREFS.heartRate;

  prefs.signalHeight = DEFAULT_PREFS.signalHeight;
  prefs.beatSpacing = DEFAULT_PREFS.beatSpacing;

  prefs.pHeightScale = DEFAULT_PREFS.pHeightScale;
  prefs.qDepthScale = DEFAULT_PREFS.qDepthScale;
  prefs.rHeightScale = DEFAULT_PREFS.rHeightScale;
  prefs.sDepthScale = DEFAULT_PREFS.sDepthScale;
  prefs.tHeightScale = DEFAULT_PREFS.tHeightScale;
  prefs.qrsWidthScale = DEFAULT_PREFS.qrsWidthScale;
  prefs.tWidthScale = DEFAULT_PREFS.tWidthScale;

  applyPrefsToUI();
  updateHeartRateHint();
  updateDrawerLabels();

  savePrefs();
  drawAllLeads(false);
}

/**
 * Reads settings, saves them, updates UI labels/hints,
 * and redraws the ECG.
 *
 * Used by sliders and select controls for live updates.
 *
 * Time Complexity: O(W)
 * Space Complexity: O(1)
 */
function liveUpdateSettings() {
  readPrefsFromUI();
  savePrefs();

  updateSettingsLabels();
  updateHeartRateHint();

  document.documentElement.style.setProperty("--ecg-scale", prefs.pageScale / 100);
  document.body.classList.toggle("dark-mode", prefs.darkMode);

  drawAllLeads(false);
}

/* #endregion */


/* #region 04 - Safety + Debug Helpers */

/**
 * Checks that required DOM elements and ECG modules exist.
 *
 * This helps locate bugs quickly in the browser console.
 *
 * Time Complexity: O(N)
 * Space Complexity: O(N)
 */
function assertRequiredElements() {
  const missing = Object.entries(controls)
    .filter(([, element]) => !element)
    .map(([name]) => name);

  if (missing.length > 0) {
    console.error("Missing DOM elements:", missing);
    return false;
  }

  if (!window.ECG.drawGrid) {
    console.error("ECG.drawGrid is missing. Check js/ecg-grid.js.");
    return false;
  }

  if (!window.ECG.leads || !window.ECG.leadModifiers) {
    console.error("ECG leads are missing. Check js/ecg-leads.js.");
    return false;
  }

  if (!window.ECG.rhythmProfiles) {
    console.error("ECG rhythm profiles are missing. Check data/rhythm-profiles.js.");
    return false;
  }

  return true;
}

/* #endregion */


/* #region 05 - Math Helpers */

/**
 * Gaussian helper used to create smooth ECG wave parts.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function gaussian(x, center, width, height) {
  return height * Math.exp(-Math.pow(x - center, 2) / (2 * width * width));
}

/**
 * Creates deterministic fake noise based on a numeric seed.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function randomNoise(seed, amount) {
  if (!amount) return 0;
  return Math.sin(seed * 12.9898) * Math.sin(seed * 78.233) * amount;
}

/**
 * Gets the selected rhythm profile safely.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function getProfile(rhythm) {
  return window.ECG.rhythmProfiles[rhythm] || window.ECG.rhythmProfiles.normal;
}

/**
 * Safely converts a preference percentage into a multiplier.
 *
 * Missing or invalid values fall back to 100%.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function scalePercent(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return 1;
  }

  return numberValue / 100;
}
/* #endregion */


/* #region 06 - ECG Wave Generator */
/**
 * Creates the base P-QRS-T wave for a single beat.
 *
 * Uses both the selected rhythm profile and user morphology overrides.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function baseEcgWave(t, profile, leadLabel) {
  let y = 0;

  const pHeight = profile.pHeight * scalePercent(prefs.pHeightScale);
  const qDepth = profile.qDepth * scalePercent(prefs.qDepthScale);
  const rHeight = profile.rHeight * scalePercent(prefs.rHeightScale);
  const sDepth = profile.sDepth * scalePercent(prefs.sDepthScale);
  const tHeight = profile.tHeight * scalePercent(prefs.tHeightScale);

  const qrsWidthScale = scalePercent(prefs.qrsWidthScale);
  const tWidthScale = scalePercent(prefs.tWidthScale);

  const qrsWidth = profile.qrsWidth * qrsWidthScale;
  const tWidth = profile.tWidth * tWidthScale;

  y += gaussian(t, 0.18, 0.025, pHeight);
  y += gaussian(t, 0.38, 0.010 * qrsWidthScale, qDepth);
  y += gaussian(t, 0.40, qrsWidth, rHeight);
  y += gaussian(t, 0.43, 0.012 * qrsWidthScale, sDepth);
  y += gaussian(t, 0.68, tWidth, tHeight);

  const stElevation = profile.stElevation?.[leadLabel] || 0;

  if (t > 0.45 && t < 0.62) {
    y += stElevation;
  }

  return y;
}

/**
 * Adds fibrillation-like baseline movement.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function afibBaseline(px) {
  return (
    Math.sin(px * 0.08) * 0.04 +
    Math.sin(px * 0.17) * 0.03 +
    Math.sin(px * 0.031) * 0.02
  );
}

/**
 * Creates a simple PVC-looking wide complex.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function pvcWave(t) {
  let y = 0;

  y += gaussian(t, 0.42, 0.030, 1.35);
  y += gaussian(t, 0.50, 0.040, -0.75);
  y += gaussian(t, 0.75, 0.080, -0.35);

  return y;
}

/* #endregion */


/* #region 07 - Draw Helpers */

/**
 * Draws the ECG calibration pulse.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function drawCalibrationPulse(x, y) {
  ctx.save();

  ctx.strokeStyle = "#111";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 15, y);
  ctx.lineTo(x + 15, y - 50);
  ctx.lineTo(x + 55, y - 50);
  ctx.lineTo(x + 55, y);
  ctx.lineTo(x + 80, y);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws a small ownership watermark on the ECG print.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function drawWatermark() {
  ctx.save();

  ctx.globalAlpha = 0.34;
  ctx.fillStyle = "#111";
  ctx.font = "600 18px Rubik, Arial";
  ctx.textAlign = "right";
  ctx.direction = "ltr";

  ctx.fillText("Made by Dor Mandel", canvas.width - 40, canvas.height - 28);

  ctx.restore();
}

/**
 * Returns the visible label for a lead.
 *
 * If Right ECG is enabled, every lead gets an R prefix.
 * Example: I -> RI, V1 -> RV1.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function getLeadDisplayLabel(label) {
  if (!prefs.rightEcg) {
    return label;
  }

  return `R${label}`;
}

/**
 * Draws one ECG lead on the canvas.
 *
 * Time Complexity: O(W)
 * Space Complexity: O(1)
 */
function drawLead(label, x, y, width, height, heartRate, rhythm, noiseLevel, options = {}) {
  const baseline = y + height / 2;
  const profile = getProfile(rhythm);
  const modifier = window.ECG.leadModifiers[label] || { amp: 1, invert: false };

  const beatSpacingFactor = Number.isFinite(Number(prefs.beatSpacing))
    ? Number(prefs.beatSpacing) / 100
    : 1;

  const SMALL_BOX_PX = 10;
  const PAPER_SPEED_MM_PER_SEC = 25;
  const SECONDS_PER_SMALL_BOX = 1 / PAPER_SPEED_MM_PER_SEC;
  const PIXELS_PER_SECOND = SMALL_BOX_PX / SECONDS_PER_SMALL_BOX;

  const pixelsPerBeat = (60 / heartRate) * PIXELS_PER_SECOND * beatSpacingFactor;

  const amplitude = options.signalHeight ?? prefs.signalHeight ?? 45;

  ctx.save();

  /* 
  ctx.fillStyle = "#111"; 

  ctx.textAlign = "left";
  ctx.direction = "ltr";
  ctx.font = "700 22px Rubik, Arial";
  ctx.fillText(getLeadDisplayLabel(label), x + 8, y + 26);
  */
  ctx.textAlign = "left";
  ctx.direction = "ltr";
  ctx.font = "700 22px Rubik, Arial";

  if (prefs.rightEcg) {
    ctx.fillStyle = "#d92323";
    ctx.fillText("R", x + 8, y + 26);

    ctx.fillStyle = "#111";
    ctx.fillText(label, x + 24, y + 26);
  } else {
    ctx.fillStyle = "#111";
    ctx.fillText(label, x + 8, y + 26);
  }
  ctx.strokeStyle = "rgba(0, 0, 0, 0.16)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(x, baseline);
  ctx.lineTo(x + width, baseline);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#171717";
  ctx.lineWidth = 2.2;

  for (let px = 0; px < width; px++) {
    let localPx = px;

    if (profile.irregularity) {
      localPx += Math.sin(px * 0.018) * pixelsPerBeat * profile.irregularity;
    }

    const t = (((localPx % pixelsPerBeat) + pixelsPerBeat) % pixelsPerBeat) / pixelsPerBeat;

    let wave = baseEcgWave(t, profile, label);

    if (profile.fibrillation) {
      wave += afibBaseline(px);
    }

    const isPVCZone = profile.pvc && px > width * 0.42 && px < width * 0.55;

    if (isPVCZone) {
      wave = pvcWave(t);
    }

    wave += randomNoise(px + y, noiseLevel);
    wave *= modifier.amp;

    if (modifier.invert) {
      wave *= -1;
    }

    const drawX = x + px;
    const drawY = baseline - wave * amplitude;

    if (px === 0) {
      ctx.moveTo(drawX, drawY);
    } else {
      ctx.lineTo(drawX, drawY);
    }
  }

  ctx.stroke();
  ctx.restore();
}

/* #endregion */


/* #region 08 - Main Render Function */

/**
 * Redraws the entire ECG sheet.
 *
 * Steps:
 * 1. Optionally reads UI values.
 * 2. Gets selected rhythm profile.
 * 3. Draws ECG grid.
 * 4. Draws calibration pulse.
 * 5. Draws all 12 leads.
 * 6. Draws long Lead II rhythm strip.
 * 7. Draws watermark.
 *
 * Time Complexity: O(12W + R)
 * Space Complexity: O(1)
 */
function drawAllLeads(shouldReadUI = true) {
  if (shouldReadUI) {
    readPrefsFromUI();
    savePrefs();
  }

  let heartRate = Number(prefs.heartRate);
  const rhythm = prefs.rhythm;
  const profile = getProfile(rhythm);
  const noiseLevel = Number(prefs.noiseLevel);

  // Keep forcedRate only when the user did not manually change HR from the default.
  if (profile.forcedRate && Number(prefs.heartRate) === DEFAULT_PREFS.heartRate) {
    heartRate = profile.forcedRate;
  }

  window.ECG.drawGrid(ctx, canvas, { opacity: prefs.gridOpacity / 100 });

  drawCalibrationPulse(1450, 65);

  const marginX = 55;
  const marginY = 68;

  const leadWidth = 370;
  const leadHeight = 210;

  window.ECG.leads.forEach((lead, index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);

    const x = marginX + col * leadWidth;
    const y = marginY + row * leadHeight;

    drawLead(
      lead,
      x,
      y,
      leadWidth - 28,
      leadHeight - 34,
      heartRate,
      rhythm,
      noiseLevel,
      { signalHeight: prefs.signalHeight }
    );
  });

  drawLead(
    "II",
    marginX,
    770,
    1460,
    170,
    heartRate,
    rhythm,
    noiseLevel,
    { signalHeight: prefs.signalHeight }
  );

  drawWatermark();
}

/* #endregion */


/* #region 09 - UI Events */

/**
 * Opens the settings popup.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function openSettings() {
  controls.settingsOverlay.classList.remove("hidden");
}

/**
 * Closes the settings popup.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function closeSettings() {
  controls.settingsOverlay.classList.add("hidden");
}

/**
 * Opens the ECG waveform controls drawer.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function openEcgControls() {
  controls.ecgControlsOverlay.classList.remove("hidden");
  controls.ecgControlsOverlay.classList.remove("is-closing");
  updateDrawerLabels();
}

/**
 * Closes the ECG waveform controls drawer with an out animation.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function closeEcgControls() {
  controls.ecgControlsOverlay.classList.add("is-closing");

  window.setTimeout(function () {
    controls.ecgControlsOverlay.classList.add("hidden");
    controls.ecgControlsOverlay.classList.remove("is-closing");
  }, 160);
}


controls.printBtn.addEventListener("click", function () {
  window.print();
});

controls.settingsBtn.addEventListener("click", openSettings);

controls.ecgControlsBtn.addEventListener("click", openEcgControls);
controls.closeEcgControlsBtn.addEventListener("click", closeEcgControls);
controls.closeEcgControlsFooterBtn.addEventListener("click", closeEcgControls);

controls.ecgControlsOverlay.addEventListener("click", function (event) {
  if (event.target === controls.ecgControlsOverlay) {
    closeEcgControls();
  }
});

controls.closeSettingsBtn.addEventListener("click", closeSettings);

controls.saveSettingsBtn.addEventListener("click", function () {
  liveUpdateSettings();
  closeSettings();
});

controls.resetSettingsBtn.addEventListener("click", resetPrefs);

controls.settingsOverlay.addEventListener("click", function (event) {
  if (event.target === controls.settingsOverlay) {
    closeSettings();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeSettings();
    closeEcgControls();
  }
});

/**
 * Live page-setting controls.
 *
 * These controls affect page view and ECG drawing:
 * - Dark mode
 * - ECG page scale
 * - Signal height
 * - Grid opacity
 *
 * Time Complexity: O(1) per event
 * Space Complexity: O(1)
 */
[
  controls.darkModeToggle,
  controls.pageScaleSlider,
  controls.signalHeightSlider,
  controls.gridOpacitySlider
].forEach(function (input) {
  input.addEventListener("input", liveUpdateSettings);
  input.addEventListener("change", liveUpdateSettings);
});

[
  controls.heartRate,
  controls.rhythm,
  controls.noiseLevel,
  controls.rightEcgToggle
].forEach(function (input) {
  input.addEventListener("input", liveUpdateSettings);
  input.addEventListener("change", liveUpdateSettings);
});

[
  controls.drawerBeatSpacingSlider,
  controls.drawerPHeightSlider,
  controls.drawerQDepthSlider,
  controls.drawerRHeightSlider,
  controls.drawerSDepthSlider,
  controls.drawerTHeightSlider,
  controls.drawerQrsWidthSlider,
  controls.drawerTWidthSlider
].forEach(function (input) {
  input.addEventListener("input", function () {
    liveUpdateSettings();
    updateDrawerLabels();
  });
});

controls.drawerResetWaveformBtn.addEventListener("click", function () {
  resetWaveformPrefs();
  updateDrawerLabels();
});

/* #endregion */


/* #region 10 - App Init */

if (assertRequiredElements()) {
  loadPrefs();
  applyPrefsToUI();
  drawAllLeads(false);
}

/* #endregion */