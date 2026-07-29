/**
 * MindForge — Geometry-Based Handwriting Scoring Engine v2
 * =====================================================================
 * Pure deterministic scoring. Zero AI calls. Zero random numbers.
 * AI may be added later for natural language FEEDBACK only — never for scoring.
 *
 * Final Score = Bounding Box (20%) + Pixel Overlap (30%) + Stroke Count (10%)
 *             + Stroke Position (20%) + Stroke Direction (10%) + Canvas Overflow (10%)
 */

export interface StrokeVector {
  points: { x: number; y: number }[];
}

export interface GeometryBreakdown {
  /** Bounding box size & aspect ratio similarity vs reference — 0-100 */
  boundingBoxScore: number;
  /** Pixel-level overlap (user canvas vs reference ghost rendered offscreen) — 0-100 */
  pixelOverlapScore: number;
  /** How close the user stroke count is to expected — 0-100 */
  strokeCountScore: number;
  /** How well the drawing is centred inside the canvas — 0-100 */
  strokePositionScore: number;
  /** How consistent the stroke directions are (no wild reversals) — 0-100 */
  strokeDirectionScore: number;
  /** Penalises ink that bleeds outside the central guide zone — 0-100 */
  canvasOverflowScore: number;
  /** Weighted final score 0-100 */
  overall: number;
  /** Human-readable tier label */
  tier: 'Nearly Perfect' | 'Minor Mistakes' | 'Good' | 'Needs Improvement' | 'Major Mismatch';
  /** Per-component explanation strings */
  insights: string[];
  /** True when the drawing is a random scribble */
  isScribble: boolean;
}

// ─── Weights (must sum to 1.0) ────────────────────────────────────────────────
const W = {
  BOUNDING_BOX:    0.20,
  PIXEL_OVERLAP:   0.30,
  STROKE_COUNT:    0.10,
  STROKE_POSITION: 0.20,
  STROKE_DIRECTION:0.10,
  CANVAS_OVERFLOW: 0.10,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Render the reference character into an offscreen canvas at the same size. */
function renderReferenceCharacter(
  char: string,
  width: number,
  height: number
): ImageData | null {
  if (typeof document === 'undefined') return null;

  const offscreen = document.createElement('canvas');
  offscreen.width  = width;
  offscreen.height = height;
  const ctx = offscreen.getContext('2d');
  if (!ctx) return null;

  // Match the writing page's ghost style
  ctx.clearRect(0, 0, width, height);
  ctx.font         = `bold ${Math.round(height * 0.8)}px serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = '#ffffff';
  ctx.fillText(char, width / 2, height / 2);

  return ctx.getImageData(0, 0, width, height);
}

/** Scan pixel data and return bounding box + drawn pixel count. */
function scanPixels(data: Uint8ClampedArray, width: number, height: number) {
  let minX = width, minY = height, maxX = 0, maxY = 0, count = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3];
      if (a > 30) {
        count++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return { minX, minY, maxX, maxY, count };
}

/** Clamp a value between lo and hi then round to integer. */
function clamp(val: number, lo = 0, hi = 100): number {
  return Math.round(Math.min(hi, Math.max(lo, val)));
}

// ─── Component Scorers ────────────────────────────────────────────────────────

/**
 * COMPONENT 1 — Bounding Box (20%)
 * Compare user bounding box vs reference bounding box:
 * - Width / Height ratio similarity
 * - Size relative to canvas
 */
function scoreBoundingBox(
  user: ReturnType<typeof scanPixels>,
  ref: ReturnType<typeof scanPixels>,
  canvasW: number,
  canvasH: number
): { score: number; insight: string } {
  const userW = Math.max(1, user.maxX - user.minX);
  const userH = Math.max(1, user.maxY - user.minY);
  const refW  = Math.max(1, ref.maxX  - ref.minX);
  const refH  = Math.max(1, ref.maxY  - ref.minY);

  // Aspect ratio similarity (1.0 = identical)
  const userAR = userW / userH;
  const refAR  = refW / refH;
  const arDiff = Math.abs(userAR - refAR) / Math.max(userAR, refAR);
  const arScore = clamp(100 - arDiff * 120);

  // Size relative to reference (how close is the user size to reference size)
  const sizeDiffW = Math.abs(userW - refW) / Math.max(refW, 1);
  const sizeDiffH = Math.abs(userH - refH) / Math.max(refH, 1);
  const sizeScore = clamp(100 - ((sizeDiffW + sizeDiffH) / 2) * 80);

  const score = clamp((arScore + sizeScore) / 2);

  const insight =
    score >= 85 ? 'Size & proportions match well.' :
    score >= 65 ? `Character ${arDiff > 0.3 ? 'aspect ratio is off' : 'size differs from reference'}.` :
    `Character proportions are significantly off — width/height ratio should be ≈ ${refAR.toFixed(1)}.`;

  return { score, insight };
}

/**
 * COMPONENT 2 — Pixel Overlap (30%)
 * Render reference character offscreen. Count pixels that overlap between
 * user drawing and reference. High overlap = good.
 * Formula: overlap% × coverage_bonus
 */
function scorePixelOverlap(
  userImageData: ImageData,
  refImageData: ImageData
): { score: number; insight: string } {
  const { data: uData, width, height } = userImageData;
  const { data: rData } = refImageData;
  const total = width * height;

  let userPixels = 0;
  let refPixels  = 0;
  let overlap    = 0;
  let userOnly   = 0;   // user ink outside reference → penalise

  for (let i = 0; i < total; i++) {
    const uA = uData[i * 4 + 3] > 30;
    const rA = rData[i * 4 + 3] > 30;

    if (uA) userPixels++;
    if (rA) refPixels++;
    if (uA && rA) overlap++;
    if (uA && !rA) userOnly++;
  }

  if (userPixels === 0) return { score: 0, insight: 'No drawing detected.' };
  if (refPixels === 0)  return { score: 50, insight: 'Reference render failed — pixel overlap unavailable.' };

  // Recall: what fraction of the reference is covered by the user?
  const recall = overlap / refPixels;           // 0-1
  // Precision: what fraction of user strokes sits on the reference?
  const precision = overlap / userPixels;       // 0-1
  // F1-style harmonic mean — rewards both hitting the reference AND not going outside
  const f1 = recall + precision > 0
    ? (2 * recall * precision) / (recall + precision)
    : 0;

  const score = clamp(f1 * 100);

  const overlapPct  = Math.round(recall * 100);
  const outsidePct  = userPixels > 0 ? Math.round((userOnly / userPixels) * 100) : 0;

  const insight =
    score >= 85 ? `Excellent overlap — ${overlapPct}% of reference covered.` :
    score >= 65 ? `Good coverage (${overlapPct}%). ${outsidePct}% of your strokes are outside the reference.` :
    `Low overlap (${overlapPct}%). ${outsidePct}% of ink is outside the character shape — trace more carefully.`;

  return { score, insight };
}

/**
 * COMPONENT 3 — Stroke Count (10%)
 * Uses the number of distinct stroke vectors recorded by the canvas.
 * 0 strokes off = 100. Each extra/missing stroke costs 25 points.
 */
function scoreStrokeCount(
  userStrokeCount: number,
  expectedStrokeCount: number
): { score: number; insight: string } {
  const diff  = Math.abs(userStrokeCount - expectedStrokeCount);
  const score = clamp(100 - diff * 25);

  const insight =
    diff === 0 ? `Correct stroke count (${expectedStrokeCount}).` :
    userStrokeCount < expectedStrokeCount
      ? `Missing ${diff} stroke${diff > 1 ? 's' : ''}. Expected ${expectedStrokeCount}, you drew ${userStrokeCount}.`
      : `${diff} extra stroke${diff > 1 ? 's' : ''}. Expected ${expectedStrokeCount}, you drew ${userStrokeCount}.`;

  return { score, insight };
}

/**
 * COMPONENT 4 — Stroke Position / Centering (20%)
 * How far is the user's bounding box center from the canvas center?
 * Perfect centering = 100. Shifted to corner = low score.
 */
function scoreStrokePosition(
  user: ReturnType<typeof scanPixels>,
  canvasW: number,
  canvasH: number
): { score: number; insight: string } {
  if (user.count === 0) return { score: 0, insight: 'No drawing detected.' };

  const userCX = (user.minX + user.maxX) / 2;
  const userCY = (user.minY + user.maxY) / 2;
  const idealCX = canvasW / 2;
  const idealCY = canvasH / 2;

  const offsetX = Math.abs(userCX - idealCX) / (canvasW / 2);  // 0-1
  const offsetY = Math.abs(userCY - idealCY) / (canvasH / 2);  // 0-1
  const offset  = (offsetX + offsetY) / 2;

  const score = clamp(100 - offset * 110);

  const dirX = userCX < idealCX ? 'left' : 'right';
  const dirY = userCY < idealCY ? 'up'   : 'down';

  const insight =
    score >= 85 ? 'Character is well centred.' :
    score >= 60 ? `Character is slightly shifted ${dirX} and ${dirY}.` :
    `Character is significantly off-centre (shifted ${dirX} / ${dirY}). Try to draw in the middle of the guide.`;

  return { score, insight };
}

/**
 * COMPONENT 5 — Stroke Direction Consistency (10%)
 * Analyses the stroke vectors to detect back-and-forth zigzagging, which
 * indicates wrong direction or random scribbling.
 * Clean, directional strokes → high score. Wild reversals → low score.
 */
function scoreStrokeDirection(
  strokes: StrokeVector[]
): { score: number; insight: string } {
  if (strokes.length === 0) return { score: 0, insight: 'No strokes detected.' };

  let totalConsistency = 0;

  for (const stroke of strokes) {
    const pts = stroke.points;
    if (pts.length < 3) { totalConsistency += 100; continue; }

    let reversals = 0;
    let segments  = 0;

    // Calculate primary direction of the whole stroke
    const dxTotal = pts[pts.length - 1].x - pts[0].x;
    const dyTotal = pts[pts.length - 1].y - pts[0].y;

    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x;
      const dy = pts[i].y - pts[i - 1].y;
      // A reversal is when a segment goes significantly opposite the primary direction
      const dot = dx * dxTotal + dy * dyTotal;
      segments++;
      if (dot < -5) reversals++; // signed dot product negative = reversal
    }

    const reversalRatio = segments > 0 ? reversals / segments : 0;
    totalConsistency += clamp(100 - reversalRatio * 150);
  }

  const score = clamp(totalConsistency / strokes.length);

  const insight =
    score >= 85 ? 'Stroke directions are clean and consistent.' :
    score >= 60 ? 'Some strokes have slight direction inconsistencies.' :
    'Multiple strokes drawn in wrong or inconsistent direction. Follow the stroke guide carefully.';

  return { score, insight };
}

/**
 * COMPONENT 6 — Canvas Overflow (10%)
 * What fraction of the user's ink falls outside the central 75% zone
 * of the canvas? The guide square occupies roughly the centre 75%.
 */
function scoreCanvasOverflow(
  userImageData: ImageData
): { score: number; insight: string } {
  const { data, width, height } = userImageData;

  // Define the safe zone as the central 75% of each axis
  const margin = 0.125;
  const xMin = Math.floor(width  * margin);
  const xMax = Math.ceil (width  * (1 - margin));
  const yMin = Math.floor(height * margin);
  const yMax = Math.ceil (height * (1 - margin));

  let inside  = 0;
  let outside = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3];
      if (a > 30) {
        const inZone = x >= xMin && x <= xMax && y >= yMin && y <= yMax;
        if (inZone) inside++; else outside++;
      }
    }
  }

  const total = inside + outside;
  if (total === 0) return { score: 0, insight: 'No drawing detected.' };

  const overflowRatio = outside / total;
  const score = clamp(100 - overflowRatio * 200);

  const insight =
    overflowRatio <= 0.05 ? 'All strokes stay within the guide area.' :
    overflowRatio <= 0.20 ? `${Math.round(overflowRatio * 100)}% of strokes extend slightly outside the guide.` :
    `${Math.round(overflowRatio * 100)}% of strokes are outside the guide box — keep your writing inside the grid.`;

  return { score, insight };
}

// ─── Scribble Detector ────────────────────────────────────────────────────────
/**
 * Fast pre-check before running full analysis.
 * Returns true if the drawing is obviously a random scribble.
 */
function detectScribble(
  userImageData: ImageData,
  strokes: StrokeVector[]
): boolean {
  const { data, width, height } = userImageData;
  const total = width * height;

  let drawnPixels = 0;
  for (let i = 0; i < total; i++) {
    if (data[i * 4 + 3] > 30) drawnPixels++;
  }

  const fillRatio = drawnPixels / total;

  // Filling >40% of the canvas is definitely a scribble
  if (fillRatio > 0.40) return true;

  // >20 strokes for a single character is chaotic
  if (strokes.length > 20) return true;

  // Single "stroke" that is extremely long and zigzagged
  if (strokes.length === 1 && strokes[0].points.length > 500) return true;

  return false;
}

// ─── Tier Labelling ───────────────────────────────────────────────────────────
function getTier(score: number): GeometryBreakdown['tier'] {
  if (score >= 95) return 'Nearly Perfect';
  if (score >= 85) return 'Minor Mistakes';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Improvement';
  return 'Major Mismatch';
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Main entry point.
 * Call this from the writing page when the user taps "Evaluate Score".
 *
 * @param canvas         The HTML5 canvas the user drew on
 * @param targetChar     The Japanese character being practised (e.g. '日')
 * @param expectedStrokes The expected stroke count for this character
 * @param strokes        Array of stroke vectors recorded during drawing
 */
export function evaluateHandwritingCanvas(
  canvas: HTMLCanvasElement,
  targetChar: string,
  expectedStrokes: number,
  strokes: StrokeVector[] = []
): GeometryBreakdown {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return emptyResult('Could not access canvas. Please try again.');
  }

  const W_px = canvas.width;
  const H_px = canvas.height;

  // Grab user's pixel data
  const userImageData = ctx.getImageData(0, 0, W_px, H_px);
  const user = scanPixels(userImageData.data, W_px, H_px);

  // Guard: nearly empty canvas
  if (user.count < 80) {
    return emptyResult('Canvas is empty or drawing is too faint. Please write the character clearly.');
  }

  // ── Scribble detection ──────────────────────────────────────────────────────
  if (detectScribble(userImageData, strokes)) {
    return {
      boundingBoxScore:    15,
      pixelOverlapScore:   12,
      strokeCountScore:    10,
      strokePositionScore: 15,
      strokeDirectionScore:10,
      canvasOverflowScore: 10,
      overall: 12,
      tier: 'Major Mismatch',
      insights: [
        'Random scribble detected.',
        'Your drawing covers too much canvas area.',
        'Please trace the character outline carefully — do not fill the canvas.',
      ],
      isScribble: true,
    };
  }

  // ── Render reference offscreen ──────────────────────────────────────────────
  const refImageData = renderReferenceCharacter(targetChar, W_px, H_px);

  // ── Run all 6 component scorers ─────────────────────────────────────────────
  const bb  = scoreBoundingBox(user, refImageData ? scanPixels(refImageData.data, W_px, H_px) : user, W_px, H_px);
  const po  = refImageData ? scorePixelOverlap(userImageData, refImageData)
                           : { score: 50, insight: 'Reference render unavailable — pixel overlap skipped.' };
  const sc  = scoreStrokeCount(strokes.length > 0 ? strokes.length : expectedStrokes, expectedStrokes);
  const sp  = scoreStrokePosition(user, W_px, H_px);
  const sd  = scoreStrokeDirection(strokes);
  const co  = scoreCanvasOverflow(userImageData);

  // ── Weighted final score ─────────────────────────────────────────────────────
  const overall = clamp(
    bb.score  * W.BOUNDING_BOX    +
    po.score  * W.PIXEL_OVERLAP   +
    sc.score  * W.STROKE_COUNT    +
    sp.score  * W.STROKE_POSITION +
    sd.score  * W.STROKE_DIRECTION +
    co.score  * W.CANVAS_OVERFLOW
  );

  return {
    boundingBoxScore:    bb.score,
    pixelOverlapScore:   po.score,
    strokeCountScore:    sc.score,
    strokePositionScore: sp.score,
    strokeDirectionScore:sd.score,
    canvasOverflowScore: co.score,
    overall,
    tier: getTier(overall),
    insights: [bb.insight, po.insight, sc.insight, sp.insight, sd.insight, co.insight],
    isScribble: false,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function emptyResult(msg: string): GeometryBreakdown {
  return {
    boundingBoxScore:    0,
    pixelOverlapScore:   0,
    strokeCountScore:    0,
    strokePositionScore: 0,
    strokeDirectionScore:0,
    canvasOverflowScore: 0,
    overall: 0,
    tier: 'Major Mismatch',
    insights: [msg],
    isScribble: false,
  };
}
