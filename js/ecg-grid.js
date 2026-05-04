/* #region ECG Grid Module
   ============================================================
   Draws the ECG paper grid.
   Small boxes + big boxes.
============================================================ */

window.ECG = window.ECG || {};

/*
 * Draws the ECG paper grid.
 *
 * Time Complexity: O(W + H)
 * Space Complexity: O(1)
 */
window.ECG.drawGrid = function drawGrid(ctx, canvas, options = {}) {
  const opacity = options.opacity ?? 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const smallStep = 10;
  const bigStep = smallStep * 5;

  // Small grid lines
  ctx.strokeStyle = `rgba(247, 150, 150, ${0.28 * opacity})`;
  ctx.lineWidth = 0.5;

  for (let x = 0; x <= canvas.width; x += smallStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += smallStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Big grid lines
  ctx.strokeStyle = `rgba(220, 70, 70, ${0.55 * opacity})`;
  ctx.lineWidth = 1.1;

  for (let x = 0; x <= canvas.width; x += bigStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += bigStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
};

/* #endregion */