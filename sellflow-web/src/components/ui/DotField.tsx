import { useEffect, useRef } from "react";

type DotFieldProps = {
  className?: string;
  gap?: number;
};

export function DotField({ className = "", gap = 28 }: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const pointer = { x: -1000, y: -1000, active: false };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      const radius = 145;
      const offset = reduceMotion ? 0 : Math.sin(time * 0.00045) * 1.4;

      for (let y = gap / 2; y < height; y += gap) {
        for (let x = gap / 2; x < width; x += gap) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const influence = pointer.active ? Math.max(0, 1 - distance / radius) : 0;
          const push = influence * 9;
          const px = x + (distance ? (dx / distance) * push : 0);
          const py = y + (distance ? (dy / distance) * push : 0);
          const dotRadius = 1 + influence * 2.2 + offset * 0.08;

          context.beginPath();
          context.arc(px, py, dotRadius, 0, Math.PI * 2);
          context.fillStyle = influence
            ? `rgba(124, 58, 237, ${0.22 + influence * 0.64})`
            : "rgba(100, 116, 139, 0.18)";
          context.fill();
        }
      }

      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      if (reduceMotion) draw();
    };
    const clearPointer = () => {
      pointer.active = false;
      if (reduceMotion) draw();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    canvas.addEventListener("pointermove", handlePointer);
    canvas.addEventListener("pointerleave", clearPointer);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("pointerleave", clearPointer);
    };
  }, [gap]);

  return <canvas ref={canvasRef} className={`pointer-events-auto absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />;
}
