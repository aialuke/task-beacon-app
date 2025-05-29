// Web Worker for image processing
self.onmessage = async event => {
  const { file, maxWidth, maxHeight, quality } = event.data;

  try {
    const result = await compressAndResizePhoto(
      file,
      maxWidth,
      maxHeight,
      quality
    );
    self.postMessage({ success: true, processedFile: result });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};

// Worker version of compressAndResizePhoto function
async function compressAndResizePhoto(
  fileData,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
) {
  // Create an image bitmap from the file data
  const arrayBuffer = await fileData.arrayBuffer();
  const bitmap = await createImageBitmap(
    new Blob([arrayBuffer], { type: fileData.type })
  );

  // Calculate the new dimensions
  let width = bitmap.width;
  let height = bitmap.height;

  // Scale down if either dimension exceeds the maximum
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.floor(width * ratio);
    height = Math.floor(height * ratio);
  }

  // Create a canvas and draw the resized image
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(bitmap, 0, 0, width, height);

  // Convert the canvas to a Blob
  const blob = await canvas.convertToBlob({
    type: 'image/jpeg',
    quality: quality,
  });

  // Transfer the processed data back
  return blob;
}
