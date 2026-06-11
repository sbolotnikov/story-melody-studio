 
import { ImageResponse } from 'next/og'; 
import { StaticImageData } from 'next/image';
const birthdayImg = `${process.env.NEXTAUTH_URL}/images/birthday_hero_1780580660623.png`;
const weddingImg = `${process.env.NEXTAUTH_URL}/images/wedding_hero_1780580674632.png`;
const anniversaryImg = `${process.env.NEXTAUTH_URL}/images/anniversary_hero_1780580687961.png`;
const danceImg = `${process.env.NEXTAUTH_URL}/images/dance_hero_1780580701564.png`;
const retirementImg = `${process.env.NEXTAUTH_URL}/images/retirement_hero_1780580714256.png`;
const logoImg = `${process.env.NEXTAUTH_URL}/images/storymelody_logo.png`;

 
const imageMap: Record<string, string> = {
  birthdays: birthdayImg,
  weddings: weddingImg,
  anniversaries: anniversaryImg,
  dance: danceImg,
  retirements: retirementImg,
  logo: logoImg,
};
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export default async function Image({
  params: { id },
}: {
  params: { id: string };
}) {
   
  
    
  return new ImageResponse(
    (
      <div
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '45px',
          flexDirection: 'column',
        }}
      >
         
          {(() => {
            const val = imageMap[id];
            const src = typeof val === 'string' ? val : (val as StaticImageData).src;
            return <img width={800} height={600} alt={id} src={src} />;
          })()}

        </div>

        
    ),
    {
      ...size,
    }
  );
}