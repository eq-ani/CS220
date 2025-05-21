export function imageMapCoord(img, func) {
    const returnImg = img.copy();
    for (let i = 0; i < returnImg.height; i++) {
        for (let j = 0; j < returnImg.width; j++) {
            returnImg.setPixel(j, i, func(img, j, i));
        }
    }
    return returnImg;
}
export function imageMapIf(img, cond, func) {
    function conditionFunc(img, x, y) {
        if (cond(img, x, y)) {
            return func(img.getPixel(x, y));
        }
        return img.getPixel(x, y);
    }
    return imageMapCoord(img, conditionFunc);
}
export function mapWindow(img, xInterval, // Assumed to be a two element array containing [x_min, x_max]
yInterval, // Assumed to be a two element array containing [y_min, y_max]
func) {
    function condition(img, x, y) {
        return x >= xInterval[0] && x <= xInterval[1] && y >= yInterval[0] && y <= yInterval[1];
    }
    return imageMapIf(img, condition, func);
}
export function isGrayish(p) {
    const max = Math.max(p[0], p[1], p[2]);
    const min = Math.min(p[0], p[1], p[2]);
    return max - min <= 85;
}
export function makeGrayish(img) {
    function func(p) {
        const m = Math.trunc((p[0] + p[1] + p[2]) / 3);
        return [m, m, m];
    }
    function cond(img, x, y) {
        return !isGrayish(img.getPixel(x, y));
    }
    return imageMapIf(img, cond, func);
}
export function pixelBlur(img, x, y) {
    let total = 0;
    let sum = [0, 0, 0];
    for (let xCd = -1; xCd <= 1; xCd++) {
        for (let yCd = -1; yCd <= 1; yCd++) {
            const cDX = x + xCd, cDY = y + yCd;
            if (cDX >= 0 && cDX < img.width && cDY >= 0 && cDY < img.height) {
                sum = sum.map((val, i) => val + img.getPixel(cDX, cDY)[i]);
                total++;
            }
        }
    }
    return sum.map(val => Math.trunc(val / total));
}
export function imageBlur(img) {
    return imageMapCoord(img, pixelBlur);
}
//# sourceMappingURL=imageProcessingHOF.js.map