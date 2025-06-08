
/**
 * Canvas-Based Image Processing
 * 
 * Low-level canvas operations for image manipulation.
 */

/**
 * Process image with canvas directly (lower-level control)
 */
export async function processImageWithCanvas(
  file: File,
  canvasProcessor: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, img: HTMLImageElement) => void,
  outputFormat: 'webp' | 'jpeg' | 'png' = 'jpeg',
  quality = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Let the processor configure the canvas and draw
        canvasProcessor(canvas, ctx, img);

        // Convert to blob
        const mimeType = `image/${outputFormat}`;
        const outputQuality = outputFormat === 'png' ? undefined : quality;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          },
          mimeType,
          outputQuality
        );
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(img.src);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Resize image to exact dimensions (may distort aspect ratio)
 */
export async function resizeImageExact(
  file: File,
  width: number,
  height: number,
  format: 'webp' | 'jpeg' | 'png' = 'jpeg',
  quality: number = 0.85
): Promise<Blob> {
  return processImageWithCanvas(
    file,
    (canvas, ctx, img) => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
    },
    format,
    quality
  );
}
