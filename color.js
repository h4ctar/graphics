export const black = { red: 0, green: 0, blue: 0 };
export const red = { red: 255, green: 0, blue: 0 };
export const green = { red: 0, green: 255, blue: 0 };
export const blue = { red: 0, green: 0, blue: 255 };

export const randomColor = () => ({
    red: Math.floor(Math.random() * 256),
    green: Math.floor(Math.random() * 256),
    blue: Math.floor(Math.random() * 256),
});
