import { useEffect, useState, type CSSProperties } from "react";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  style?: CSSProperties;
  eager?: boolean;
  onLoad?: () => void;
}

export function ProgressiveImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  style,
  eager = false,
  onLoad,
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(false), [src]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-slate-200/70 transition-opacity duration-500 motion-reduce:transition-none ${loaded ? "opacity-0" : "animate-pulse opacity-100"}`}
      />
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        className={`${imageClassName} transition-[opacity,filter,transform] duration-500 motion-reduce:transition-none ${loaded ? "scale-100 blur-0 opacity-100" : "scale-[1.02] blur-lg opacity-0"}`}
      />
    </div>
  );
}
