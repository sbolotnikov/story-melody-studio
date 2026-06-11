 
import { ImageResponse } from 'next/og'; 

const logoImg = `${process.env.NEXTAUTH_URL}/images/storymelody_logo.png`;


 
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export default async function Image() {
   
  
    
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
            return <img width={800} height={600} alt={'Occasions'} src={logoImg} />;
          })()}

        </div>

        
    ),
    {
      ...size,
    }
  );
}