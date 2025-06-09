'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageValidation {
  maxSizeInMB: number;
  allowedTypes: string[];
}

interface ImageState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
  isValid: boolean;
}

interface ImageResponse {
  // Current state
  imageState: ImageState;

  // File handling
  selectImage: (file: File) => void;
  removeImage: () => void;
  replaceImage: (file: File) => void;

  // Drag & Drop
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  isDragOver: boolean;

  // File input ref for click-to-upload
  fileInputRef: React.RefObject<HTMLInputElement>;
  openFileDialog: () => void;

  // Validation
  validateImage: (file: File) => boolean;
  getValidationError: (file: File) => string | null;

  // Reset
  resetImage: () => void;
}

const DEFAULT_VALIDATION: ImageValidation = {
  maxSizeInMB: 5,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

const useImage = (
  initialImageUrl?: string,
  validation: ImageValidation = DEFAULT_VALIDATION,
): ImageResponse => {
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    preview: initialImageUrl || null,
    isUploading: false,
    error: null,
    isValid: true,
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImage = useCallback(
    (file: File): boolean => {
      // Check file type
      if (!validation.allowedTypes.includes(file.type)) {
        return false;
      }

      // Check file size
      const maxSizeInBytes = validation.maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        return false;
      }

      return true;
    },
    [validation],
  );

  const getValidationError = useCallback(
    (file: File): string | null => {
      if (!validation.allowedTypes.includes(file.type)) {
        const allowedExtensions = validation.allowedTypes
          .map((type) => type.split('/')[1].toUpperCase())
          .join(', ');
        return `Nur folgende Dateiformate sind erlaubt: ${allowedExtensions}`;
      }

      const maxSizeInBytes = validation.maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        return `Datei ist zu groß. Maximum: ${validation.maxSizeInMB}MB`;
      }

      return null;
    },
    [validation],
  );

  const createPreview = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageState((prev) => ({
        ...prev,
        preview: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const selectImage = useCallback(
    (file: File) => {
      const validationError = getValidationError(file);
      const isValid = !validationError;

      setImageState((prev) => ({
        ...prev,
        file: isValid ? file : null,
        error: validationError,
        isValid,
        preview: null, // Will be set by createPreview if valid
      }));

      if (isValid) {
        createPreview(file);
      }
    },
    [getValidationError, createPreview],
  );

  const removeImage = useCallback(() => {
    setImageState({
      file: null,
      preview: null,
      isUploading: false,
      error: null,
      isValid: true,
    });

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const replaceImage = useCallback(
    (file: File) => {
      selectImage(file);
    },
    [selectImage],
  );

  const resetImage = useCallback(() => {
    setImageState({
      file: null,
      preview: initialImageUrl || null,
      isUploading: false,
      error: null,
      isValid: true,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [initialImageUrl]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Drag & Drop handlers
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      const files = Array.from(event.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith('image/'));

      if (imageFile) {
        selectImage(imageFile);
      } else {
        setImageState((prev) => ({
          ...prev,
          error: 'Bitte nur Bilddateien ziehen.',
        }));
      }
    },
    [selectImage],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    },
    [],
  );

  return {
    imageState,
    selectImage,
    removeImage,
    replaceImage,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    isDragOver,
    fileInputRef,
    openFileDialog,
    validateImage,
    getValidationError,
    resetImage,
  };
};

export default useImage;
