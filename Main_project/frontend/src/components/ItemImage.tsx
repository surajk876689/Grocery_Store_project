import { useState, useEffect } from 'react';
import { loadItemImage } from '../utils/itemImages';

interface ItemImageProps {
  name: string;
  size?: number;
  className?: string;
}

const FALLBACK = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&h=80&fit=crop&auto=format&q=80';

export default function ItemImage({ name, size = 48, className = '' }: ItemImageProps) {
  const [src, setSrc] = useState<string>(FALLBACK);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadItemImage(name, size).then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => { cancelled = true; };
  }, [name, size]);

  return (
    <img
      src={errored ? FALLBACK : src}
      alt={name}
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className={`object-cover rounded-lg shrink-0 ${className}`}
      loading="lazy"
    />
  );
}
