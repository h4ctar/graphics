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
 * Generate a flame palette.
 */
export const flame = () => {
    for (let i = 0; i < 256; i++) {
        palette[i] = {
            red: 0,
            green: 0,
            blue: 0,
        };
    }

    for (let i = 0; i < 32; ++i) {
        palette[i].blue = i << 1;

        palette[i + 32].red = i << 3;
        palette[i + 32].blue = 64 - (i << 1);

        palette[i + 64].red = 255;
        palette[i + 64].green = i << 3;

        palette[i + 96].red = 255;
        palette[i + 96].green = 255;
        palette[i + 96].blue = i << 2;

        palette[i + 128].red = 255;
        palette[i + 128].green = 255;
        palette[i + 128].blue = 64 + (i << 2);

        palette[i + 160].red = 255;
        palette[i + 160].green = 255;
        palette[i + 160].blue = 128 + (i << 2);

        palette[i + 192].red = 255;
        palette[i + 192].green = 255;
        palette[i + 192].blue = 192 + i;

        palette[i + 224].red = 255;
        palette[i + 224].green = 255;
        palette[i + 224].blue = 224 + i;
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
