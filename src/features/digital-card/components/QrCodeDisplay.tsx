'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QrCodeDisplayProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
}

export default function QrCodeDisplay({ value, size = 180, level = 'H' }: QrCodeDisplayProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
      <QRCodeSVG value={value} size={size} level={level} />
    </div>
  );
}