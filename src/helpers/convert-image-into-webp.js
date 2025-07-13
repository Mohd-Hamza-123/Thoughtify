const convertToWebPFile = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not a valid image file."));
      return;
    }

    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("WebP conversion failed."));
            return;
          }

          // Create a new File from the blob
          const webpFile = new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
            type: "image/webp",
            lastModified: Date.now(),
          });

          resolve(webpFile);
        },
        "image/webp",
        quality
      );
    };

    reader.onerror = () => reject(new Error("Failed to read file."));
    img.onerror = () => reject(new Error("Failed to load image."));

    reader.readAsDataURL(file);
  });
};

export default convertToWebPFile;