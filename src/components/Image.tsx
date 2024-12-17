import  { useState } from 'react';

interface Props {
    src?: string | any;
    alt?: string;
    name?: string;
    className?: string | any;
}

export const ImageWithFallback = ({ src, alt, name, className }: Props) => {
    const [hasError, setHasError] = useState(false);

    return (
        <div className='flex justify-center items-center h-full rounded-md uppercase bg-[#cd6060]'>
            {!hasError ? (
                <img
                    src={src}
                    className={className}
                    alt={alt}
                    loading="lazy"
                    onError={() => setHasError(true)}
                // style={{ width: '300px', height: '200px' }} 
                />
            ) : (
                <h3>{name}</h3> // Render name tag if image fails to load
            )}
        </div>
    );
};

// Usage
// const App = () => {
//     return (
//         <div>
//             <ImageWithFallback
//                 src="https://example.com/non-existent-image.jpg"
//                 alt="Example"
//                 name="Image Not Found"
//             />
//         </div>
//     );
// };

// export default App;
