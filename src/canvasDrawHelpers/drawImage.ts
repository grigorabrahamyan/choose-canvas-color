export const drawImage = (
  image: HTMLImageElement | null,
  ctx: CanvasRenderingContext2D | null
) => {
  if (ctx && image) {
    const scaleFactor = Math.min(
      (ctx?.canvas.width || 1) / image.width,
      (ctx?.canvas.height || 1) / image.height
    );
    ctx?.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      (ctx.canvas.width - scaleFactor * image.width) / 2,
      (ctx.canvas.height - scaleFactor * image.height) / 2,
      scaleFactor * image.width,
      scaleFactor * image.height
    );
  }
};
