// @ts-check
/**
 * @typedef {{ red: number, green: number, blue: number }} Rgb
 * @typedef {{ index: number }} PaletteIndex
 * @typedef { Rgb | PaletteIndex } Color
 */

export const black = { red: 0, green: 0, blue: 0 };
export const white = { red: 255, green: 255, blue: 255 };
export const red = { red: 255, green: 0, blue: 0 };
export const green = { red: 0, green: 255, blue: 0 };
export const blue = { red: 0, green: 0, blue: 255 };
export const yellow = { red: 255, green: 255, blue: 0 };
export const magenta = { red: 255, green: 0, blue: 255 };
export const cyan = { red: 0, green: 255, blue: 255 };

/** @type number[] */
export const palette = Array(256);

export const randomColor = () => ({
    red: Math.floor(Math.random() * 256),
    green: Math.floor(Math.random() * 256),
    blue: Math.floor(Math.random() * 256),
});

export const gradient = () => {
    for (let i = 0; i < 256; i++) {
        palette[i] = colorToValue({ red: i, green: i, blue: i });
    }
};

/**
 * @param {Color} color
 * @returns {number}
 */
export const colorToValue = (color) => {
    if ("index" in color) {
        return palette[color.index];
    } else {
        return (255 << 24) | (color.blue << 16) | (color.green << 8) | color.red;
    }
};