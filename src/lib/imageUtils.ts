
/**
 * Compresses and resizes a photo for upload
 * 
 * This utility function takes a File object (image), compresses it, and resizes it
 * to reduce file size while maintaining reasonable quality for uploads.
 * 
 * @param file - The image File object to process
 * @param maxWidth - Maximum width of the processed image (default: 1200px)
 * @param maxHeight - Maximum height of the processed image (default: 1200px)
 * @param quality - JPEG compression quality (0-1, default: 0.85)
 * @returns A Promise that resolves to a processed File object
 */
export async function compressAndResizePhoto(
  file: File, 
  maxWidth = 1200, 
  maxHeight = 1200, 
  quality = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      // Create an image object from the file
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        // Calculate the new dimensions
        let width = img.width;
        let height = img.height;
        
        // Scale down if either dimension exceeds the maximum
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        // Create a canvas and draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert the canvas to a Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob from image'));
              return;
            }
            
            // Create a new File object from the blob
            const processedFile = new File(
              [blob], 
              file.name, 
              { 
                type: 'image/jpeg',
                lastModified: Date.now() 
              }
            );
            
            // Clean up the object URL
            URL.revokeObjectURL(img.src);
            
            resolve(processedFile);
          }, 
          'image/jpeg', 
          quality
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };
    } catch (error) {
      reject(error);
    }
  });
}
