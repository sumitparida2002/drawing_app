import { RgbaColor } from "react-colorful";
import { useToolboxStore } from "../../stores/use-toolbox-store";
import { useRoom } from "@/providers/room-provider";
import { useRoomStore } from "../../stores/use-room-store";

const getWidthAndHeight = (
  x: number,
  y: number,
  from: [number, number],
  shift?: boolean
) => {
  let width = x - from[0];
  let height = y - from[1];

  if (shift) {
    if (Math.abs(width) > Math.abs(height)) {
      if ((width > 0 && height < 0) || (width < 0 && height > 0))
        width = -height;
      else width = height;
    } else if ((height > 0 && width < 0) || (height < 0 && width > 0))
      height = -width;
    else height = width;
  } else {
    width = x - from[0];
    height = y - from[1];
  }

  return { width, height };
};

// export const beginPath = (
//   ctx: CanvasRenderingContext2D,

//   x: number,
//   y: number
// ) => {
//   ctx.beginPath();
//   ctx.moveTo(x, y);
// };

// export const drawRect = (
//   ctx: CanvasRenderingContext2D,
//   x: number,
//   y: number,
//   width: number,
//   height: number,
//   fill?: boolean
// ) => {
//   ctx.beginPath();

//   if (fill) ctx.fillRect(x, y, width, height);
//   else ctx.rect(x, y, width, height);

//   ctx.stroke();
//   //   ctx.fill();
//   ctx.closePath();

//   return { width, height };
// };

// export const drawLine = (
//   ctx: CanvasRenderingContext2D,
//   x: number,
//   y: number
// ) => {
//   ctx.lineTo(x, y);
//   ctx.stroke();
// };

// export const drawCircle = (
//   ctx: CanvasRenderingContext2D,
//   from: [number, number],
//   x: number,
//   y: number,
//   shift?: boolean
// ) => {
//   ctx.beginPath();

//   const { width, height } = getWidthAndHeight(x, y, from, shift);

//   const cX = from[0] + width / 2;
//   const cY = from[1] + height / 2;
//   const radiusX = Math.abs(width / 2);
//   const radiusY = Math.abs(height / 2);

//   ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);

//   ctx.stroke();
//   ctx.fill();
//   ctx.closePath();

//   return { cX, cY, radiusX, radiusY };
// };
// export const drawCircle = (
//   ctx: CanvasRenderingContext2D,
//   from: [number, number],
//   to: [number, number],
//   shift?: boolean
// ) => {
//   ctx.beginPath();

//   const [x, y] = to;
//   const [fromX, fromY] = from;
//   const radiusX = Math.abs(x - fromX);
//   const radiusY = Math.abs(y - fromY);

//   ctx.ellipse(fromX, fromY, radiusX, radiusY, 0, 0, 2 * Math.PI);

//   ctx.fill();

//   ctx.lineWidth = 2;
//   ctx.stroke();

//   ctx.closePath();

//   return { fromX, fromY, radiusX, radiusY };
// };

export const rgbaToString = (rgba: RgbaColor) => {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
};

export const handleDownload = (canvas: any) => {
  const URL = canvas.toDataURL();
  const anchor = document.createElement("a");
  anchor.href = URL;
  anchor.download = "sketch.jpg";
  anchor.click();
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean
) => {
  ctx.beginPath();

  const { width, height } = getWidthAndHeight(x, y, from, shift);

  const cX = from[0] + width / 2;
  const cY = from[1] + height / 2;
  const radiusX = Math.abs(width / 2);
  const radiusY = Math.abs(height / 2);

  ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);

  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  return { cX, cY, radiusX, radiusY };
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean,
  fill?: boolean
) => {
  ctx.beginPath();

  const { width, height } = getWidthAndHeight(x, y, from, shift);

  if (fill) ctx.fillRect(from[0], from[1], width, height);
  else ctx.rect(from[0], from[1], width, height);

  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  return { width, height };
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean
) => {
  if (shift) {
    ctx.beginPath();
    ctx.lineTo(from[0], from[1]);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    return;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
};
