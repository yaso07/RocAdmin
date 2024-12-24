import React from "react";
interface Props {
    imageInput: string[];
    setImageInput: any;
    setFieldValue: any;
    imageValue: any;
    error: any;
    touch: any;
}

const DynamicInput: React.FC<Props> = ({ imageInput, setImageInput, setFieldValue, imageValue, error, touch }) => {
    //   const [inputs, setInputs] = useState<string[]>([""]); // Start with one input

    // Handle change in input value
    const handleImageInput = (index: number, value: string) => {
        const newInputs = [...imageInput];
        newInputs[index] = value;
        setImageInput(newInputs);
        setFieldValue("imageUrl", newInputs);
    };

    // Add a new input box
    const handleAddInput = () => {
        if (imageInput.length < 8) {
            setImageInput([...imageInput, ""]);
            setFieldValue("imageUrl", [...imageInput, ""]);
        }
    };

    // Remove an input box
    const handleRemoveInput = (index: number) => {
        const newInputs = imageInput.filter((_, i) => i !== index);
        const newInputs1 = imageValue.filter((_: any, i: number) => i !== index);
        setImageInput(newInputs);
        setFieldValue("imageUrl", newInputs1);
    };
    return (
        <div >
            {/* <h3>Image Url</h3> */}
            {imageInput.map((value: any, index: number) => (
                <div key={index} style={styles.container}>
                    <input
                        type="text"
                        name="imageUrl"
                        value={value}
                        onChange={(e) => handleImageInput(index, e.target.value.replace(" ", "%20"))}
                        placeholder={`Image URL ${index + 1}`}
                        style={styles.input}
                    />
                    {imageInput.length > 1 &&

                        <button
                            onClick={() => handleRemoveInput(index)}
                            style={styles.removeButton}
                            disabled={imageInput.length === 1}
                        >
                            Remove
                        </button>
                    }
                </div>
            ))}
            <div className=" mb-4">
                {error && touch && <span className="text-[#ff0000]">{error}</span>}
            </div>
            {
                imageInput.length < 8 &&
                <button
                    onClick={handleAddInput}
                    style={styles.addButton}
                    disabled={imageInput.length >= 8}
                >
                    Add More URL
                </button>
            }
        </div>
    );
};

const styles = {
    container: { width: '100%', marginBottom: "10px", display: "flex" },

    input: {
        border: '1px solid #ccc',
        outline: "none",
        width: "100%",
        padding: "8px 12px",
        paddingLeft: "5px",
        transition: 'border-color 0.3s', // Smooth transition for border color
    },
    addButton: {
        backgroundColor: "#1890ff",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "4px",
        cursor: "pointer",
    },
    removeButton: {
        backgroundColor: "#ff4d4f",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "4px",
        cursor: "pointer",
    },
};


export default DynamicInput;
