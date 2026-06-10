export const compressImage = (file: File, quality = 0.8, maxWidth = 1920, maxHeight = 1080): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Solo comprimir imágenes
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(blob => {
          if (!blob) return resolve(file);
          const newFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(newFile);
        }, file.type, quality);
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};
