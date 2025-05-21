import assert from "assert";
import { COLORS, Image } from "../include/image.js";
import { imageMapCoord, imageMapIf, mapWindow, isGrayish, makeGrayish, pixelBlur, imageBlur, } from "./imageProcessingHOF.js";
// Helper function to check if a color is equal to another one with an error of 1 (default)
function expectColorToBeCloseTo(actual, expected, error = 1) {
    [0, 1, 2].forEach(i => expect(Math.abs(actual[i] - expected[i])).toBeLessThanOrEqual(error));
}
describe("imageMapCoord", () => {
    function identity(img, x, y) {
        return img.getPixel(x, y);
    }
    it("should return a different image", () => {
        const input = Image.create(10, 10, COLORS.WHITE);
        const output = imageMapCoord(input, identity);
        assert(input !== output);
    });
    // More tests for imageMapCoord go here.
    it("should not modify the original image", () => {
        function darken(img, x, y) {
            const p = img.getPixel(x, y);
            return [p[0] - 2, p[1] - 2, p[2] - 2];
        }
        const input = Image.create(10, 10, COLORS.WHITE);
        imageMapCoord(input, darken);
        for (let i = 0; i < input.height; i++) {
            for (let j = 0; j < input.width; j++) {
                expectColorToBeCloseTo(input.getPixel(j, i), [255, 255, 255]);
            }
        }
    });
    it("should have same dimensions", () => {
        const input = Image.create(10, 20, COLORS.WHITE);
        const output = imageMapCoord(input, identity);
        assert(output.height === 20 && output.width === 10);
    });
    it("should apply a function that uses the left neighbor's color", () => {
        const copyLeft = (img, x, y) => (x > 0 ? img.getPixel(x - 1, y) : img.getPixel(x, y));
        const input = Image.create(3, 3, COLORS.WHITE);
        input.setPixel(0, 1, [0, 0, 255]);
        input.setPixel(1, 1, [255, 0, 255]);
        const output = imageMapCoord(input, copyLeft);
        expectColorToBeCloseTo(output.getPixel(1, 1), [0, 0, 255]);
        expectColorToBeCloseTo(output.getPixel(2, 1), [255, 0, 255]);
        expectColorToBeCloseTo(output.getPixel(0, 1), [0, 0, 255]);
    });
});
describe("imageMapIf", () => {
    // More tests for imageMapIf go here
    function darken(c) {
        return [c[0] - 2, c[1] - 2, c[2] - 2];
    }
    it("should return a different image", () => {
        function tru() {
            return true;
        }
        const input = Image.create(10, 10, COLORS.WHITE);
        const output = imageMapIf(input, tru, darken);
        assert(input !== output);
    });
    it("should apply func, if true", () => {
        function tru() {
            return true;
        }
        const input = Image.create(10, 10, COLORS.WHITE);
        const output = imageMapIf(input, tru, darken);
        const p = output.getPixel(0, 0);
        expectColorToBeCloseTo(p, [253, 253, 253]);
    });
    it("should not apply func, if false", () => {
        function fals() {
            return false;
        }
        const input = Image.create(10, 10, COLORS.WHITE);
        const output = imageMapIf(input, fals, darken);
        const p = output.getPixel(0, 0);
        expectColorToBeCloseTo(p, [255, 255, 255]);
    });
});
describe("mapWindow", () => {
    function darken(c) {
        return [c[0] - 2, c[1] - 2, c[2] - 2];
    }
    // More tests for mapWindow go here
    it("should return a different image", () => {
        const input = Image.create(5, 5, COLORS.WHITE);
        const intervalx = [0, 0];
        const intervaly = [0, 0];
        const output = mapWindow(input, intervalx, intervaly, (p) => p);
        assert(input !== output);
    });
    it("should work for an image that is not square", () => {
        const input = Image.create(9, 32, COLORS.WHITE);
        const intervalx = [0, 6];
        const intervaly = [2, 7];
        const output = mapWindow(input, intervalx, intervaly, (p) => [p[0] - 2, p[1] - 2, p[2] - 2]);
        for (let i = 0; i < output.height; i++) {
            for (let j = 0; j < output.width; j++) {
                if (i >= 2 && i <= 7 && j >= 0 && j <= 6) {
                    expectColorToBeCloseTo(output.getPixel(j, i), [253, 253, 253]);
                }
                else {
                    expectColorToBeCloseTo(output.getPixel(j, i), COLORS.WHITE);
                }
            }
        }
        assert(input !== output);
    });
    it("should change the top of the image", () => {
        const input = Image.create(10, 10, COLORS.WHITE);
        const xInterval = [0, input.width - 1];
        const yInterval = [0, (input.height - 1) / 2];
        const output = mapWindow(input, xInterval, yInterval, darken);
        for (let i = 0; i < output.height; i++) {
            for (let j = 0; j < output.width; j++) {
                if (i < (output.height - 1) / 2) {
                    expectColorToBeCloseTo(output.getPixel(j, i), [253, 253, 253]);
                }
                else {
                    expectColorToBeCloseTo(output.getPixel(j, i), COLORS.WHITE);
                }
            }
        }
    });
    it("should change the whole image (0,9) to (0,9) (inclusive)", () => {
        const input = Image.create(10, 10, COLORS.WHITE);
        const output = mapWindow(input, [0, input.width - 1], [0, input.height - 1], darken);
        for (let i = 0; i < output.height; i++) {
            for (let j = 0; j < output.width; j++) {
                const p = output.getPixel(j, i);
                expectColorToBeCloseTo(p, [253, 253, 253]);
            }
        }
    });
});
describe("isGrayish", () => {
    // More tests for isGrayish go here
    it("should return true (200 - 150 <= 85)", () => {
        const color = [150, 150, 200];
        assert(isGrayish(color));
    });
    it("should return false (255 - 0 > 85)", () => {
        const color = [255, 255, 0];
        assert(!isGrayish(color));
    });
    it("should return true (185 - 100 <= 85) (3 dups)", () => {
        const color = [100, 100, 185];
        assert(isGrayish(color));
    });
    it("should return false (200 - 100 > 85) (2 dups)", () => {
        const color = [100, 100, 200];
        assert(!isGrayish(color));
    });
});
describe("makeGrayish", () => {
    // More tests for makeGrayish go here
    it("should return a different image", () => {
        const inputW = Image.create(10, 10, COLORS.WHITE);
        const outputW = makeGrayish(inputW);
        assert(inputW !== outputW);
    });
    it("should stay the same color if already grayish (white)", () => {
        const inputW = Image.create(10, 10, COLORS.WHITE);
        const outputW = makeGrayish(inputW);
        const p1 = outputW.getPixel(0, 0);
        expectColorToBeCloseTo(p1, [255, 255, 255]);
        const p2 = outputW.getPixel(5, 5);
        expectColorToBeCloseTo(p2, [255, 255, 255]);
    });
    it("should stay the same color if already grayish (light gray)", () => {
        const inputG = Image.create(10, 10, [100, 100, 100]);
        const outputG = makeGrayish(inputG);
        const p1 = outputG.getPixel(0, 0);
        expectColorToBeCloseTo(p1, [100, 100, 100]);
        const p2 = outputG.getPixel(5, 5);
        expectColorToBeCloseTo(p2, [100, 100, 100]);
    });
    it("should convert a non-gray color to grayscale", () => {
        const input = Image.create(1, 1, [200, 50, 50]);
        const output = makeGrayish(input);
        const p = output.getPixel(0, 0);
        expectColorToBeCloseTo(p, [100, 100, 100]);
    });
    it("should properly deal with it being 85 (should not change anything)", () => {
        const input = Image.create(1, 1, [185, 100, 100]);
        const output = makeGrayish(input);
        const p = output.getPixel(0, 0);
        expectColorToBeCloseTo(p, [185, 100, 100]);
    });
    it("should properly deal with it being 86 (should make grayish)", () => {
        const input = Image.create(1, 1, [186, 100, 100]);
        const output = makeGrayish(input);
        const p = output.getPixel(0, 0);
        expectColorToBeCloseTo(p, [128, 128, 128]);
    });
});
describe("pixelBlur", () => {
    // Tests for pixelBlur go here
    it("should stay the same since colors are uniform", () => {
        const img = Image.create(3, 3, COLORS.RED);
        const p = pixelBlur(img, 1, 1);
        expectColorToBeCloseTo(p, [255, 0, 0]);
    });
    it("should be different since colors are not uniform (center)", () => {
        const img = Image.create(3, 3, COLORS.RED);
        img.setPixel(1, 1, [0, 255, 255]);
        const p = pixelBlur(img, 1, 1);
        expectColorToBeCloseTo(p, [226, 28, 28]); //255*8/9, 255*1/9, 255*1/9
    });
    it("should be different since colors are not uniform (edge)", () => {
        const img = Image.create(3, 3, COLORS.RED);
        img.setPixel(0, 1, [0, 255, 255]);
        const p = pixelBlur(img, 0, 1);
        expectColorToBeCloseTo(p, [212, 42, 42]); //255*5/6, 255*1/6, 255*1/6
    });
    it("should be different since colors are not uniform (corner)", () => {
        const img = Image.create(3, 3, COLORS.RED);
        img.setPixel(0, 0, [0, 255, 255]);
        const p = pixelBlur(img, 0, 0);
        expectColorToBeCloseTo(p, [191, 63, 63]); //255*3/4, 255*1/4, 255*1/4
    });
    it("should maintain functionality in a 2x2", () => {
        const tbt = Image.create(2, 2, COLORS.RED);
        tbt.setPixel(0, 0, [0, 255, 255]);
        const p1 = pixelBlur(tbt, 0, 0);
        const p2 = pixelBlur(tbt, 1, 1);
        expectColorToBeCloseTo(p1, [191, 63, 63]); //255*3/4, 255*1/4, 255*1/4
        expectColorToBeCloseTo(p2, [191, 63, 63]); //255*3/4, 255*1/4, 255*1/4
    });
});
describe("imageBlur", () => {
    // Tests for imageBlur go here
    it("should not change color (image is uniform)", () => {
        const img = Image.create(3, 3, COLORS.RED);
        const blurredimg = imageBlur(img); //not actually blurred
        assert(img !== blurredimg);
        const p = blurredimg.getPixel(1, 1);
        expectColorToBeCloseTo(p, [255, 0, 0]);
    });
    it("should change color (image is non-uniform)", () => {
        const img = Image.create(3, 3, COLORS.RED);
        img.setPixel(0, 0, [0, 255, 255]);
        const blurredImg = imageBlur(img);
        const p1 = blurredImg.getPixel(0, 0);
        expectColorToBeCloseTo(p1, [191, 63, 63]); //first pixel
        const p2 = blurredImg.getPixel(1, 0);
        expectColorToBeCloseTo(p2, [212, 42, 42]); //second pixel
    });
});
//# sourceMappingURL=imageProcessingHOF.test.js.map