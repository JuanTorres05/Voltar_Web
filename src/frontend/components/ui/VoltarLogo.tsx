import React from 'react';

interface VoltarLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

const SIZE_CLASSES = {
  sm:   'h-9 w-9',
  md:   'h-14 w-14',
  lg:   'h-24 w-24',
  hero: 'h-36 w-36 sm:h-44 sm:w-44',
};

export default function VoltarLogo({
  size = 'sm',
  className = '',
}: VoltarLogoProps) {
  return (
    <div
      className={`relative shrink-0 bg-transparent ${SIZE_CLASSES[size]} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/voltar-logo.png"
        alt="VØLTAR® Emblema Oficial"
        className="h-full w-full object-contain contrast-125"
      />
    </div>
  );
}
