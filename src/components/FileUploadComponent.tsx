import React, { memo } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";


import { read, utils } from 'xlsx';


interface FileUploadComponentProps {
  onCsvDataUpload: (csvData: any[]) => void;
  children: React.ReactNode;
  setUploadedFileName: React.Dispatch<React.SetStateAction<string | null>>;
}


const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  onCsvDataUpload,
  children,
  setUploadedFileName,
}) => {

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      console.log(acceptedFiles)
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = e.target.result;
          try {
            const workbook = read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = utils.sheet_to_json(worksheet);
            if (json.length === 0) {
              setUploadedFileName("")
              return toast.error("File is empty.");
            } else {
              onCsvDataUpload(json)
              setUploadedFileName(file.name);
            }
            
          } catch (error) {
            setUploadedFileName("")
            toast.error("Error parsing CSV data.")
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setUploadedFileName("")
        toast.error("Please select only .xlsx or .csv file")
      }
      // setUploadedFileName(file.name);
      // const reader = new FileReader();
      // reader.onload = async () => {
      //   try {
      //  const contents = reader.result as string;
      //  const rows = contents.split("\n");
      //  const parsedData = [];

      //  Papa.parse(file, {
      //    header: true,
      //    skipEmptyLines: true,
      //    complete: function (results) {
      //      console.log(results.data)
      //      if (results.data.length === 0) {
      //       setErrorMessage("CSV data is empty.");
      //       return;
      //     } else {
      //       onCsvDataUpload(results.data)
      //     }
      //     },
      //   });


      // Skip the header row (if present)
      //  const headers = rows[0].split(",");
      //  for (let i = 1; i < rows.length; i++) {
      //    const values = rows[i].split(",");
      //    const rowData: any = {};
      //    for (let j = 0; j < headers.length; j++) {
      //      rowData[headers[j]] = values[j];
      //    }
      //    parsedData.push(rowData);
      //  }





      // Send the data to the parent component
      //  onCsvDataUpload(parsedData);
      // } catch (error) {
      //   setErrorMessage("Error parsing CSV data.");
      // }
      // };

      // reader.readAsText(file);
    } catch (error) {
      setUploadedFileName("");
    }
  };


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "text/xlsx": [".csv", ".xlsx"], // dont include anything else because it will only support csv , if you want to adopt more formate then adjust the code accordingly
    }, // Use an array if you need to accept multiple types
  });

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      {children}
    </div>
  );
};


export default memo(FileUploadComponent);
