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

/** @type Rgb[] */
export const palette = Array(256);

/**
 * Generate a random color.
 */
export const randomColor = () => ({
    red: Math.floor(Math.random() * 256),
    green: Math.floor(Math.random() * 256),
    blue: Math.floor(Math.random() * 256),
});

/**
 * Generate a gradient palette from black to the parsed color.
 * @param {Rgb} color 
 */
export const gradient = (color) => {
    for (let i = 0; i < 256; i++) {
        palette[i] = {
            red: color.red * i / 256,
            green: color.green * i / 256,
            blue: color.blue * i / 256
        };
    }
};

/**
 * @param {Color} color
 * @returns {Rgb}
 */
export const colorToRgb = (color) => {
    if ("index" in color) {
        return palette[color.index];
    } else {
        return color;
    }
};
