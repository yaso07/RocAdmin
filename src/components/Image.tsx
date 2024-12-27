import { memo, useEffect, useState } from 'react';

interface Props {
    src?: string | any;
    alt?: string;
    name?: string;
    className?: string | any;
}

const ImageWithFallback = ({ src, alt, name, className }: Props) => {
    const [hasError, setHasError] = useState(false);
    useEffect(() => {
        setHasError(false);
    }, [src]);
    return (
        <div className='flex justify-center items-center h-full rounded-md uppercase bg-[#cd6060]'>
            {!hasError  && src ? (
                <img
                    src={src}
                    className={className}
                    alt={alt}
                    onError={() => setHasError(true)}
                // style={{ width: '300px', height: '200px' }} 
                />
            ) : (
                <h3>{name}</h3> // Render name tag if image fails to load
            )}
        </div>
    );
};

export default memo(ImageWithFallback)


