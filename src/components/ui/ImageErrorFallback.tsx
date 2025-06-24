interface ImageErrorFallbackProps {
  message?: string;
  description?: string;
}

function ImageErrorFallback({
  message = 'Failed to load image',
  description = 'Please check your connection and try again',
}: ImageErrorFallbackProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <span className="text-lg text-red-500">{message}</span>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export default ImageErrorFallback;
