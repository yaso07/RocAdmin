
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";


interface Props {
    setTags: any;
    tags: any;
    placeholder?: string;
}


const TagField = ({tags, setTags, placeholder }: Props) => {
   

    const handleDelete = (index: number) => {
        setTags(tags.filter((_: any, i: number) => i !== index));
    };

    const onTagUpdate = (index: number, newTag: any) => {
        const updatedTags = [...tags];
        updatedTags.splice(index, 1, newTag);
        setTags(updatedTags);
    };

    const handleAddition = (tag: any) => {
        setTags((prevTags: any) => {
            return [...prevTags, tag];
        });
    };

    const handleDrag = (tag: any, currPos: number, newPos: number) => {
        const newTags = tags.slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        setTags(newTags);
    };

    const handleTagClick = (index: number) => {
        console.log("The tag at index " + index + " was clicked");
    };

    const onClearAll = () => {
        setTags([]);
    };
    return (
        <ReactTags
            tags={tags}
            autofocus={false}
            placeholder={placeholder} 
            separators={[SEPARATORS.ENTER, SEPARATORS.COMMA]}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            handleTagClick={handleTagClick}
            onTagUpdate={onTagUpdate}
            inputFieldPosition="bottom"
            editable
            clearAll
            onClearAll={onClearAll}
        // maxTags={7}
        />
    )
}

export default TagField