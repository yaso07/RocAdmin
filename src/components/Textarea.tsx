// src/Textarea.tsx
import React, { useEffect } from 'react';


interface TextareaProps {
    short_description: any,
    title: any,
    handleChange?: any,
    handleBlur: any,
    error?: any,
    touch?: any,
    setFieldValue?: any,
}

const Textarea: React.FC<TextareaProps> = ({ short_description, title, handleChange, handleBlur, error, touch, setFieldValue}) => {


    // const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     setShortDescription(event.target.value);
    // };
    useEffect(() => {
        if (short_description) {
            const strippedDescription = stripHtmlTags(short_description);
            setFieldValue("short_description",strippedDescription);
        }
    }, [short_description]);

    const stripHtmlTags = (html: any) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    };


    return (
        <div className='w-[95%]'>
            <h1 className="text-2xl font-bold mt-2 ">{title}</h1>
            <textarea
                id="short_description"
                name="short_description"
                rows={5}
                value={short_description}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter your message..."
            ></textarea>
            {touch ? (
                <div style={{color:'red'}}>{error}</div>
            ) : null}
            {/* <p className="mt-2 text-gray-600">Character Count: {text.length}</p> */}
        </div>
    );
};

export default Textarea;
