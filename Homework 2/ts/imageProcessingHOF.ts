import { Image, Color } from "../include/image.js";

export function imageMapCoord(img: Image, func: (img: Image, x: number, y: number) => Color): Image {
  const returnImg = img.copy();
  for (let i = 0; i < returnImg.height; i++) {
    for (let j = 0; j < returnImg.width; j++) {
      returnImg.setPixel(j, i, func(img, j, i));
    }
  }
  return returnImg;
}

export function imageMapIf(
  img: Image,
  cond: (img: Image, x: number, y: number) => boolean,
  func: (p: Color) => Color
): Image {
  function conditionFunc(img: Image, x: number, y: number): Color {
    if (cond(img, x, y)) {
      return func(img.getPixel(x, y));
    }
    return img.getPixel(x, y);
  }
  return imageMapCoord(img, conditionFunc);
}

export function mapWindow(
  img: Image,
  xInterval: number[], // Assumed to be a two element array containing [x_min, x_max]
  yInterval: number[], // Assumed to be a two element array containing [y_min, y_max]
  func: (p: Color) => Color
): Image {
  function condition(img: Image, x: number, y: number): boolean {
    return x >= xInterval[0] && x <= xInterval[1] && y >= yInterval[0] && y <= yInterval[1];
  }
  return imageMapIf(img, condition, func);
}

export function isGrayish(p: Color): boolean {
  const max = Math.max(p[0], p[1], p[2]);
  const min = Math.min(p[0], p[1], p[2]);
  return max - min <= 85;
}

export function makeGrayish(img: Image): Image {
  function func(p: Color): Color {
    const m = Math.trunc((p[0] + p[1] + p[2]) / 3);
    return [m, m, m];
  }
  function cond(img: Image, x: number, y: number): boolean {
    return !isGrayish(img.getPixel(x, y));
  }
  return imageMapIf(img, cond, func);
}

export function pixelBlur(img: Image, x: number, y: number): Color {
  let total = 0;
  let sum = [0, 0, 0];

  for (let xCd = -1; xCd <= 1; xCd++) {
    for (let yCd = -1; yCd <= 1; yCd++) {
      const cDX = x + xCd,
        cDY = y + yCd;
      if (cDX >= 0 && cDX < img.width && cDY >= 0 && cDY < img.height) {
        sum = sum.map((val, i) => val + img.getPixel(cDX, cDY)[i]);
        total++;
      }
    }
  }
  return sum.map(val => Math.trunc(val / total));
}

export function imageBlur(img: Image): Image {
  return imageMapCoord(img, pixelBlur);
}
