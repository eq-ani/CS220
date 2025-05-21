import assert from "assert";
import { Color, COLORS, Image } from "../include/image.js";
import { flipColors, saturateGreen, mapLine, imageMap, mapToGreen, mapFlipColors } from "./imageProcessing.js";

describe("saturateGreen", () => {
  it("should maximize green in the upper left corner", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(0, 0);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });

  it("should maximize green in the center", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(5, 7);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });

  it("should maximize green in the bottom right", () => {
    const blackImage = Image.create(10, 15, COLORS.BLACK);
    const gbImage = saturateGreen(blackImage);
    const p = gbImage.getPixel(9, 14);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 0, "The blue channel should be 0.");
  });
});

describe("flipColors", () => {
  it("should correctly flip top left corner", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(0, 0, [100, 0, 150]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(0, 0);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });
  it("should correctly flip the center", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(5, 5, [100, 0, 150]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(5, 5);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });
  it("should correctly flip bottom right", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(9, 9, [100, 0, 150]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(9, 9);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });
});

describe("mapLine", () => {
  it("should create a strip of color in the top row", () => {
    const lineImage = Image.create(10, 10, COLORS.RED);
    const func = (c: Color) => [c[0], 2, 3];
    mapLine(lineImage, 0, func);
    for (let i = 0; i < lineImage.width; i++) {
      const p = lineImage.getPixel(i, 0);
      assert(p[0] === 255);
      assert(p[1] === 2);
      assert(p[2] === 3);
    }
  });
  it("should do nothing (negative lines)", () => {
    const lineImage = Image.create(10, 10, COLORS.RED);
    const func = (c: Color) => [c[0], 2, 3];
    mapLine(lineImage, -1, func);
    for (let i = 0; i < lineImage.height; i++) {
      for (let j = 0; j < lineImage.width; j++) {
        const p = lineImage.getPixel(j, i);
        assert(p[0] === 255);
        assert(p[1] === 0);
        assert(p[2] === 0);
      }
    }
  });
  it("should do nothing (too many lines)", () => {
    const lineImage = Image.create(10, 10, COLORS.RED);
    const func = (c: Color) => [c[0], 2, 3];
    mapLine(lineImage, 100, func);
    for (let i = 0; i < lineImage.height; i++) {
      for (let j = 0; j < lineImage.width; j++) {
        const p = lineImage.getPixel(j, i);
        assert(p[0] === 255);
        assert(p[1] === 0);
        assert(p[2] === 0);
      }
    }
  });
  it("should do nothing (not an integer)", () => {
    const lineImage = Image.create(10, 10, COLORS.RED);
    const func = (c: Color) => [c[0], 2, 3];
    mapLine(lineImage, 1.1, func);
    for (let i = 0; i < lineImage.height; i++) {
      for (let j = 0; j < lineImage.width; j++) {
        const p = lineImage.getPixel(j, i);
        assert(p[0] === 255);
        assert(p[1] === 0);
        assert(p[2] === 0);
      }
    }
  });
});

describe("imageMap", () => {
  it("should map color to the entire image", () => {
    const mapImage = Image.create(10, 10, COLORS.BLUE);
    const func = (c: Color) => [13, 26, c[2]];
    const imagedMap = imageMap(mapImage, func);
    for (let i = 0; i < imagedMap.height; i++) {
      for (let j = 0; j < imagedMap.width; j++) {
        const p = imagedMap.getPixel(j, i);
        assert(p[0] === 13);
        assert(p[1] === 26);
        assert(p[2] === 255);
      }
    }
  });
});

describe("mapToGreen", () => {
  it("should map green to the entire map", () => {
    const toGreenImage = Image.create(10, 10, COLORS.BLACK);
    const toGreen = mapToGreen(toGreenImage);
    for (let i = 0; i < toGreen.height; i++) {
      for (let j = 0; j < toGreen.width; j++) {
        const p = toGreen.getPixel(j, i);
        assert(p[0] === 0);
        assert(p[1] === 255);
        assert(p[2] === 0);
      }
    }
  });
});

describe("mapFlipColors", () => {
  it("should flip the entire maps color", () => {
    const flipImage = Image.create(10, 10, COLORS.BLACK);
    for (let i = 0; i < flipImage.height; i++) {
      for (let j = 0; j < flipImage.width; j++) {
        flipImage.setPixel(j, i, [24, 48, 100]);
      }
    }
    const flippedImage = mapFlipColors(flipImage);
    for (let i = 0; i < flippedImage.height; i++) {
      for (let j = 0; j < flippedImage.width; j++) {
        const p = flippedImage.getPixel(j, i);
        assert(p[0] === 74);
        assert(p[1] === 62);
        assert(p[2] === 36);
      }
    }
  });
});
