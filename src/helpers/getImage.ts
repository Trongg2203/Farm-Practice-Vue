export function getImageUrl(imagePath: string) {
  const baseUrl = 'http://118.69.126.49:8878'
  if (!imagePath) {
    return `${baseUrl}/uploads/farms/default-image.png`; // Đường dẫn đến hình ảnh mặc định
  }
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}
