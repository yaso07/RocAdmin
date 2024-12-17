import { ChangeEvent, FormEvent, KeyboardEvent, useState } from "react";

interface Props {
  tags: any;
  placeholder?: string;
  error?: any;
  touch?: any;
  value: any;
  handleBlur?: any;
}

const TagField = ({ tags, placeholder, error, touch, value, handleBlur }: Props) => {
  const [inputValue, setInputValue] = useState("");

  function handleTagAdd(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (inputValue && !tags.includes(inputValue)) {
      value("tags", [...tags, inputValue]);
    }
    setInputValue("");
  }

  const handleTagRemove = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    value("tags", newTags.length ? newTags : "");
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setInputValue(event.target.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if(event.key === ","){
      handleTagAdd(event as any)
    }
  }

  return (
    <form onSubmit={handleTagAdd}>
      <div className="mb-2">
        <div className="flex flex-wrap">
          {tags.length
            ? tags?.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2 mb-2 flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-2 outline-none focus:outline-none"
                    onClick={() => handleTagRemove(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.293-11.293a1 1 0 10-1.414-1.414L10 8.586 7.121 5.707a1 1 0 00-1.414 1.414L8.586 10l-2.879 2.879a1 1 0 101.414 1.414L10 11.414l2.879 2.879a1 1 0 001.414-1.414L11.414 10l2.879-2.879z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              ))
            : ""}
        </div>
        <input
          type="text"
          name="tags"
          value={inputValue}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        {error && touch && <span className="text-[#ff0000]">{error}</span>}
      </div>
    </form>
  );
};

export default TagField;
