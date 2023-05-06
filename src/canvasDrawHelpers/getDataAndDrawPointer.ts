import {
  POINTER_MATRICS_SIZE,
  POINTER_SIZE,
  RECT_SIZE_OF_POINTER,
} from "../constants";
import { convertColorArrToString } from "../helpers/convertColorArrToString";

export const getDataAndDrawPointer = (
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number
) => {
  const { data } = ctx.getImageData(
    offsetX - POINTER_MATRICS_SIZE / 2,
    offsetY - POINTER_MATRICS_SIZE / 2,
    POINTER_MATRICS_SIZE,
    POINTER_MATRICS_SIZE
  );

  ctx.beginPath();
  ctx.arc(offsetX, offsetY, POINTER_SIZE, 0, 2 * Math.PI);
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 0.4;
  ctx.stroke();
  ctx.clip();

  for (let i = 0; i < data.length; i += 4) {
    const chunkItem: [number, number, number, number] = [
      data[i + 0],
      data[i + 1],
      data[i + 2],
      data[i + 3],
    ];
    const rgbColor: string = convertColorArrToString(chunkItem);
    ctx.beginPath();
    const itemX =
      offsetX -
      (POINTER_MATRICS_SIZE / 2) * RECT_SIZE_OF_POINTER +
      Math.floor((i % (POINTER_MATRICS_SIZE * 4)) / 4) * RECT_SIZE_OF_POINTER;
    const itemY =
      offsetY -
      (POINTER_MATRICS_SIZE / 2) * RECT_SIZE_OF_POINTER +
      Math.floor(i / (POINTER_MATRICS_SIZE * 4)) * RECT_SIZE_OF_POINTER;

    ctx.fillStyle = rgbColor;
    ctx.strokeStyle = "grey";
    ctx.rect(itemX, itemY, RECT_SIZE_OF_POINTER, RECT_SIZE_OF_POINTER);
    ctx.fill();
    ctx.lineWidth = 0.2;
    ctx.stroke();
  }
  const center = Math.floor(data.length / 8) * 4;
  return convertColorArrToString([
    data[center + 0],
    data[center + 1],
    data[center + 2],
    data[center + 3],
  ]);
};
