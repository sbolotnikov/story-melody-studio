 
import { ImageResponse } from 'next/og'; 
import { StaticImageData } from 'next/image';
import birthdayImg from "../../assets/images/birthday_hero_1780580660623.png";
import weddingImg from "../../assets/images/wedding_hero_1780580674632.png";
import anniversaryImg from "../../assets/images/anniversary_hero_1780580687961.png";
import danceImg from "../../assets/images/dance_hero_1780580701564.png";
import retirementImg from "../../assets/images/retirement_hero_1780580714256.png";
import logoImg from "../assets/images/storymelody_logo_1780521281759.png";


type ImageType = string | StaticImageData;
const imageMap: Record<string, ImageType> = {
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