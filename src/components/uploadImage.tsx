// Filename - App.js
// currently it's not using=====================================
import { useState } from "react";

function UploadFile() {
	const [file, setFile] = useState();
	function handleChange(e: any) {
		console.log(e.target.files);
		setFile(URL.createObjectURL(e.target.files[0]) as any);
	}

	return (
		<div className="App">
			<h2>Add Image:</h2>
			<input type="file" onChange={handleChange} />
			<img src={file} />
		</div>
	);
}

export default UploadFile;
