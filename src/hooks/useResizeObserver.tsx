import { MutableRefObject, RefObject, useEffect } from "react";

export const useResizeObserver = (
  ref: RefObject<HTMLCanvasElement>,
  size: MutableRefObject<[number, number] | null>
) => {
  useEffect(() => {
    let first = true;
    const canvas = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (canvas && first) {
        canvas.width = width;
        canvas.height = height;
      }
      size.current = [width, height];
      first = false;
    });

    if (canvas) {
      resizeObserver.observe(canvas);
    }

    return () => {
      resizeObserver.unobserve(canvas!);
    };
    // eslint-disable-next-line
  }, []);
};
