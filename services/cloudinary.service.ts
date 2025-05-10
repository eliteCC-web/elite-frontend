// Este servicio maneja la carga directa a Cloudinary desde el frontend
// Utilizando la técnica de upload sin firmar (unsigned upload)

export interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    original_filename: string;
  }
  
  const CloudinaryService = {
    // Configuración 
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset',
    
    // Función para subir una imagen a Cloudinary
    async uploadImage(file: File): Promise<CloudinaryUploadResult> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', 'elite-cc-stores'); // Carpeta donde se guardarán las imágenes
      
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        
        if (!response.ok) {
          throw new Error('Error al subir la imagen a Cloudinary');
        }
        
        const data = await response.json();
        return {
          secure_url: data.secure_url,
          public_id: data.public_id,
          format: data.format,
          width: data.width,
          height: data.height,
          original_filename: data.original_filename,
        };
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
      }
    },
    
    // Función para generar la URL de transformación (ejemplo: redimensionar)
    getTransformedUrl(url: string, width: number, height: number, crop = 'fill'): string {
      if (!url) return '';
      
      // Si la URL ya es de Cloudinary, realizar la transformación
      if (url.includes('cloudinary.com')) {
        // Extraer la parte de la URL antes de 'upload/'
        const baseUrl = url.split('upload/')[0] + 'upload/';
        // Extraer la parte después de 'upload/'
        const imageId = url.split('upload/')[1];
        
        // Construir la URL con transformaciones
        return `${baseUrl}c_${crop},w_${width},h_${height}/${imageId}`;
      }
      
      // Si no es una URL de Cloudinary, devolver la original
      return url;
    }
  };
  
  export default CloudinaryService;