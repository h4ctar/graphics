// @ts-check
/**
 * @callback Callback 
 */

/**
 * @param {Callback} code 
 */
export const loop = (code) => {
    let start = Date.now();
    let frameCount = 0;

    const frame = () => {
        code();

        const now = Date.now();
        frameCount++;
        if (now - start > 1000) {
            console.log(`FPS: ${frameCount}`);
            start = now;
            frameCount = 0;
        }

        window.requestAnimationFrame(frame);
    };

    window.requestAnimationFrame(frame);
};
