import { Carousel } from 'antd';
import React from 'react';

// const slides = [
//     { id: 1, image: 'https://via.placeholder.com/600x300?text=Slide+1' },
//     { id: 3, image: 'https://via.placeholder.com/600x300?text=Slide+3' },
// ];

interface Props {
    slides?: string[] | any
}

const Slider: React.FC<Props> = ({slides}) => {
    const contentStyle: React.CSSProperties = {
        margin: 0,
        height: '160px',
        width:'300px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
        boxSizing: "border-box",
      };
      return (
          <Carousel style={{width:'300px'}} autoplay infinite arrows>
            {
                slides.map(( image: string | undefined, index: any) => {
                    return (
                        <div
                        style={contentStyle}
                        key={`${image}-${index}`}
                        >
                        <img src={image} alt={`Slide ${image}`} className="w-[300px] h-[150px]" />
                      </div>

                    )
                })
            }

        </Carousel>
    );
};

export default Slider;
