import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleImageUpload } from '@/services/ImageUpload';

export const useImageUpload = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const mutation = useMutation<string | null, Error, File>({
    mutationFn: handleImageUpload,
    onSuccess: (imageUrl) => {
      if (imageUrl) {
        setUploadedImageUrl(imageUrl);
        toast.success("Image uploaded successfully", {
          duration: 2000,
        });
      }
    },
    onError: (error) => {
      console.error('Image upload error', error);
      setPreviewUrl(null);
      setUploadedImageUrl(null);
      // Note: The toast is already handled in the handleImageUpload function
    }
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Trigger upload
      mutation.mutate(file);
    }
  };

  const resetImage = () => {
    setPreviewUrl(null);
    setUploadedImageUrl(null);
    mutation.reset();
  };

  return {
    previewUrl,
    isUploading: mutation.isPending,
    uploadedImageUrl,
    handleImageChange,
    resetImage,
    uploadError: mutation.error
  };
};