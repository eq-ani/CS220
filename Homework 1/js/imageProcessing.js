/**
 * Saturates green color in each pixel of an image
 * @param img An image
 * @returns A new image where each pixel has the green channel set to its maximum.
 */
export function saturateGreen(img) {
    const width = img.width;
    const height = img.height;
    const modImg = img.copy();
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const pix = modImg.getPixel(j, i);
            modImg.setPixel(j, i, [pix[0], 255, pix[2]]);
        }
    }
    return modImg;
}
/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixel's channel has been
 *  set as the truncated average of the other two
 */
export function flipColors(img) {
    const width = img.width;
    const height = img.height;
    const modImg = img.copy();
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const arr = modImg.getPixel(j, i);
            modImg.setPixel(j, i, [
                Math.floor((arr[1] + arr[2]) / 2),
                Math.floor((arr[0] + arr[2]) / 2),
                Math.floor((arr[0] + arr[1]) / 2),
            ]);
        }
    }
    return modImg;
}
/**
 * Modifies the given `img` such that the value of each pixel
 * in the given line is the result of applying `func` to the
 * corresponding pixel of `img`. If `lineNo` is not a valid line
 * number, then `img` should not be modified.
 * @param img An image
 * @param lineNo A line number
 * @param func A color transformation function
 */
export function mapLine(img, lineNo, func) {
    const isNum = Number.isInteger(lineNo);
    if (lineNo >= img.height || lineNo < 0 || !isNum) {
        return;
    }
    for (let i = 0; i < img.width; i++) {
        const p = img.getPixel(i, lineNo);
        img.setPixel(i, lineNo, func(p));
    }
    return;
}
/**
 * The result must be a new image with the same dimensions as `img`.
 * The value of each pixel in the new image should be the result of
 * applying `func` to the corresponding pixel of `img`.
 * @param img An image
 * @param func A color transformation function
 */
export function imageMap(img, func) {
    const modImg = img.copy();
    for (let i = 0; i < img.height; i++) {
        mapLine(modImg, i, func);
    }
    return modImg;
}
/**
 * Saturates green color in an image
 * @param img An image
 * @returns A new image where each pixel has the green channel has been set to its maximum.
 */
export function mapToGreen(img) {
    img = imageMap(img, arr => [arr[0], 255, arr[2]]);
    return img;
}
/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixels channel has been
 *  set as the truncated average of the other two
 */
export function mapFlipColors(img) {
    img = imageMap(img, arr => [
        Math.floor((arr[1] + arr[2]) / 2),
        Math.floor((arr[0] + arr[2]) / 2),
        Math.floor((arr[0] + arr[1]) / 2),
    ]);
    return img;
}
//# sourceMappingURL=imageProcessing.js.map