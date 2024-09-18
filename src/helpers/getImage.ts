export function getImageUrl(imagePath: string | null | File):string {
  const baseUrl = 'http://118.69.126.49:8878'
  // Nếu imagePath là null hoặc không có giá trị
  if (!imagePath) {
    return `${baseUrl}/uploads/farms/default-image.png`; // Đường dẫn đến hình ảnh mặc định
  }

  // Nếu imagePath là File, chuyển đổi nó thành URL tạm thời
  if (imagePath instanceof File) {
    return URL.createObjectURL(imagePath);
  }

  // Nếu imagePath là string
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}
