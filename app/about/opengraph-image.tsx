 
import { ImageResponse } from 'next/og'; 

const logoImg = `${process.env.NEXTAUTH_URL}/images/storymelody_logo_1780521281759.png`;

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Helper: convert ArrayBuffer to base64 in safe chunks
async function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000; // 32KB
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return typeof btoa === 'function' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
}

export default async function Image() {
  // Try to fetch the original image and embed as data URL so ImageResponse can rasterize it reliably
  let imgSrc = logoImg;
  try {
    const res = await fetch(logoImg);
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      const b64 = await arrayBufferToBase64(buffer);
      imgSrc = `data:image/png;base64,${b64}`;
    } else {
      console.warn('Failed to fetch logo for OG image, status:', res.status);
    }
  } catch (err) {
    console.warn('Error fetching logo for OG image:', err);
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#ffffff00',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '45px',
          flexDirection: 'column',
        }}
      >
        <img width={800} height={600} alt={'About'} src={imgSrc} style={{ objectFit: 'cover' }} />
      </div>
    ),
    {
      ...size,
    }
  );
}