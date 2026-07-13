"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";

const FALLBACK_IMAGE = "/images/earthing-systems.jpg";

type ProductImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

function getInitialSrc(src?: string | null) {
  if (!src?.trim()) return FALLBACK_IMAGE;
  return src;
}

export default function ProductImage({ src, alt, ...props }: ProductImageProps) {
  const initialSrc = useMemo(() => getInitialSrc(src), [src]);
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  useEffect(() => {
    setCurrentSrc(initialSrc);
  }, [initialSrc]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => setCurrentSrc(FALLBACK_IMAGE)}
    />
  );
}
