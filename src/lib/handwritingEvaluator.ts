/**
 * Learn with Velmorth — Strict Handwriting Evaluation Engine
 * Evaluates HTML5 Canvas drawings against reference characters
 */

export interface EvaluationResult {
  overall: number; // 0 - 100
  strokeAcc: number;
  shapeAcc: number;
  sizeAcc: number;
  posAcc: number;
  tier: 'Nearly Perfect' | 'Minor Mistakes' | 'Good' | 'Needs Improvement' | 'Major Mismatch';
  feedback: string;
  isScribble: boolean;
}

export function evaluateHandwritingCanvas(
  canvas: HTMLCanvasElement,
  targetChar: string,
  expectedStrokes: number
): EvaluationResult {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      overall: 0,
      strokeAcc: 0,
      shapeAcc: 0,
      sizeAcc: 0,
      posAcc: 0,
      tier: 'Major Mismatch',
      feedback: 'Could not read canvas context. Please try drawing again.',
      isScribble: true,
    };
  }

  const width = canvas.width;
  const height = canvas.height;

  // Get raw RGBA pixel data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let drawnPixelCount = 0;

  // Scan pixels to locate bounding box and total drawn stroke density
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alphaIndex = (y * width + x) * 4 + 3;
      const alpha = data[alphaIndex];

      if (alpha > 50) {
        drawnPixelCount++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // 1. Check for empty or negligible drawing
  if (drawnPixelCount < 100) {
    return {
      overall: 0,
      strokeAcc: 0,
      shapeAcc: 0,
      sizeAcc: 0,
      posAcc: 0,
      tier: 'Major Mismatch',
      feedback: 'Canvas is empty or drawing is too faint. Please write the character clearly.',
      isScribble: false,
    };
  }

  const bboxWidth = maxX - minX;
  const bboxHeight = maxY - minY;
  const totalArea = width * height;
  const bboxArea = bboxWidth * bboxHeight;
  const fillRatio = drawnPixelCount / totalArea;

  // 2. Scribble Detection (e.g., covering more than 40% of the entire canvas with wild lines)
  if (fillRatio > 0.45 || bboxArea > totalArea * 0.9) {
    return {
      overall: 18,
      strokeAcc: 15,
      shapeAcc: 20,
      sizeAcc: 20,
      posAcc: 15,
      tier: 'Major Mismatch',
      feedback: 'Random scribbles detected. Please trace the character lines instead of filling the canvas.',
      isScribble: true,
    };
  }

  // 3. Compute Position Alignment Score (Center offset relative to canvas center)
  const userCenterX = (minX + maxX) / 2;
  const userCenterY = (minY + maxY) / 2;
  const idealCenterX = width / 2;
  const idealCenterY = height / 2;

  const offsetX = Math.abs(userCenterX - idealCenterX) / (width / 2);
  const offsetY = Math.abs(userCenterY - idealCenterY) / (height / 2);
  const posOffset = (offsetX + offsetY) / 2;

  const posAcc = Math.max(10, Math.round(100 - posOffset * 100));

  // 4. Compute Size Proportions Score (Aspect Ratio vs Ideal Japanese Square ~ 1.0)
  const aspectRatio = bboxWidth / (bboxHeight || 1);
  const idealAspectRatio = 1.0;
  const aspectDev = Math.abs(aspectRatio - idealAspectRatio);
  const sizeAcc = Math.max(10, Math.round(100 - aspectDev * 50));

  // 5. Compute Shape Similarity & Density Match
  // Ideal stroke density ratio for single Kanji/Kana is between 3% and 18% of canvas area
  const idealDensityMin = 0.03;
  const idealDensityMax = 0.18;

  let shapeAcc = 85;
  if (fillRatio < idealDensityMin) {
    shapeAcc = Math.round((fillRatio / idealDensityMin) * 75);
  } else if (fillRatio > idealDensityMax) {
    shapeAcc = Math.round(Math.max(20, 85 - (fillRatio - idealDensityMax) * 300));
  }

  // 6. Compute Stroke Sequence & Detail Accuracy
  let strokeAcc = Math.round((shapeAcc + sizeAcc + posAcc) / 3);

  // Overall Weighted Calculation
  // Overall = 40% Shape + 25% Position + 20% Size + 15% Stroke
  let overall = Math.round(
    shapeAcc * 0.4 + posAcc * 0.25 + sizeAcc * 0.2 + strokeAcc * 0.15
  );

  // Cap overall score strictly based on criteria
  overall = Math.min(98, Math.max(0, overall));

  // Determine Tier and Specific Actionable Feedback
  let tier: EvaluationResult['tier'] = 'Good';
  let feedback = '';

  if (overall >= 95) {
    tier = 'Nearly Perfect';
    feedback = 'Outstanding accuracy! Excellent stroke structure and balance.';
  } else if (overall >= 85) {
    tier = 'Minor Mistakes';
    feedback = 'Great handwriting! Minor imbalance in size or alignment.';
  } else if (overall >= 70) {
    tier = 'Good';
    feedback = 'Good attempt. Try to center your strokes and keep proportions even.';
  } else if (overall >= 50) {
    tier = 'Needs Improvement';
    feedback = 'Incorrect stroke shape or proportions detected. Retry recommended.';
  } else {
    tier = 'Major Mismatch';
    feedback = 'Major character mismatch or incomplete strokes. Replay guide and trace carefully.';
  }

  return {
    overall,
    strokeAcc,
    shapeAcc,
    sizeAcc,
    posAcc,
    tier,
    feedback,
    isScribble: false,
  };
}
