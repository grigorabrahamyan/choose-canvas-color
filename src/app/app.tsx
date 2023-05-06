import { useCallback, useEffect, useRef, useState } from "react";
import cx from "classnames";
import { ReactComponent as Logo } from "../assets/svg/IconColorPicker.svg";
import { drawImage } from "../canvasDrawHelpers/drawImage";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { RECT_SIZE_OF_POINTER } from "../constants";
import { getDataAndDrawPointer } from "../canvasDrawHelpers/getDataAndDrawPointer";

import styles from "./app.module.css";

export default function App() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const currentColor = useRef("");
  const size = useRef<[number, number] | null>([1, 1]);

  useResizeObserver(ref, size);

  const [rgbaColor, setRgbaColor] = useState("");
  const [isColorPicker, setIsColorPicker] = useState(false);

  const onceDocumentClick = () => {
    const ctx = ctxRef.current;
    ctx?.canvas.removeEventListener("pointermove", handleMove);
    ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (imageRef.current) {
      drawImage(imageRef.current, ctx);
    }
    setIsColorPicker(false);
  };

  const handleClickColorPicker = () => {
    const ctx = ctxRef.current;
    if (!isColorPicker) {
      ctx?.canvas.addEventListener("pointermove", handleMove);
      document.addEventListener("click", onceDocumentClick, {
        once: true,
        capture: true,
      });
    }
    setIsColorPicker(true);
  };

  const handlePointerLeave = () => {
    const ctx = ctxRef.current;
    if (isColorPicker) {
      ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      if (imageRef.current) {
        drawImage(imageRef.current, ctx);
      }
    }
  };

  const handleMove = useCallback((event: PointerEvent) => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;

    let { offsetX, offsetY } = event;

    const [width = 1, height = 1] = size.current || [];

    offsetX *= (ref.current?.width || 1) / width;
    offsetY *= (ref.current?.height || 1) / height;
    ctx.save();

    ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (imageRef.current) {
      drawImage(imageRef.current, ctx);
    }

    currentColor.current = getDataAndDrawPointer(ctx, offsetX, offsetY);

    ctx.restore();

    ctx.beginPath();
    ctx.rect(offsetX - 40, offsetY + 50, 80, RECT_SIZE_OF_POINTER);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "grey";
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "grey";
    ctx.textAlign = "center";
    ctx.font = "20px";
    ctx.fillText(currentColor.current, offsetX, offsetY + 63);
  }, []);

  useEffect(() => {
    ctxRef.current =
      ref.current?.getContext("2d", {
        willReadFrequently: true,
      }) || null;
    if (!ctxRef.current) throw new Error("Can not create context 2d");
  }, []);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const [file] = event.target.files;
      if (!file) return;
      const image = new Image();
      image.src = URL.createObjectURL(file);
      await image.decode();
      imageRef.current = image;
      if (imageRef.current) {
        drawImage(imageRef.current, ctxRef.current);
      }
      event.target.files = null;
    }
  };

  return (
    <div className={styles.app}>
      <section className={styles.headerWrapper}>
        <div className={styles.header}>
          <button
            className={cx(styles.headerButton, {
              [styles.active]: isColorPicker,
            })}
            onClick={handleClickColorPicker}
          >
            <Logo />
          </button>
          <div className={styles.colorInfo}>
            <p>Color: {rgbaColor}</p>
            <div
              className={styles.colorRect}
              style={{ backgroundColor: rgbaColor }}
            />
          </div>
          <div className={styles.inputFile}>
            <label className={styles.customFileUpload}>
              <input type="file" onChange={handleChange} />
              <p>File upload</p>
            </label>
          </div>
        </div>
      </section>
      <section className={styles.canvasWrapper}>
        <canvas
          className={styles.canvas}
          width={4000}
          height={4000}
          ref={ref}
          onClick={() => setRgbaColor(currentColor.current)}
          onPointerLeave={handlePointerLeave}
        />
      </section>
    </div>
  );
}
