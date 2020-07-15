/**
 * @param {string} src 
 */
export const loadTexture = (src) => {
    const texture = new ImageData(64, 64);
    const textureImage = new Image();
    textureImage.src = src;
    textureImage.onload = () => {
        const offscreenCanvas = new OffscreenCanvas(texture.width, texture.height);
        const offscreenContext = offscreenCanvas.getContext("2d");
        offscreenContext.drawImage(textureImage, 0, 0);
        const imageData = offscreenContext.getImageData(0, 0, texture.width, texture.height);
        texture.data.set(imageData.data);
    };
    return texture;
};
