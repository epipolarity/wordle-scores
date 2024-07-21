import pako from "pako";
import { parseText } from "../utils/parser";
import AddedRecords from "./AddedRecords";
import { useRef, useState } from "react";
import './Upload.css';

function Upload({ onCancel, onUploadComplete }) {
    const dropAreaRef = useRef(null);
    const fileInputRef = useRef(null);
    const [parsedFileData, setParsedFileData] = useState({});
    const [password, setPassword] = useState('');
    const [recordsWereAdded, setRecordsWereAdded] = useState(false);
    const [recordsAdded, setRecordsAdded] = useState([]);

    const handleFiles = (files) => {
        if (Object.keys(files).length > 1) {
            alert("Only one file can be uploaded at a time");
            return;
        } else if (files.length === 0) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const parsedData = parseText(text);
            dropAreaRef.current.innerText = `Found ${Object.keys(parsedData).length} records`;
            setParsedFileData(parsedData);
        };
        reader.readAsText(files[0]);
    }

    const onDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        handleFiles(files);
    };

    const onDragOver = (event) => {
        event.preventDefault();
    };

    const onDropAreaClick = () => {
        fileInputRef.current.click();
    };

    const onFileInputClick = (event) => {
        event.stopPropagation();
    };

    const onFileChange = (event) => {
        const files = event.target.files;
        handleFiles(files);
    };

    const onSubmit = async () => {
        // Prepare the JSON payload
        const payload = {
            password: password,
            data: parsedFileData,
        };
        
        const compressedPayload = pako.gzip(JSON.stringify(payload), { to: 'string' });

        try {
            const response = await fetch('https://lab.epipolar.com/api/wordle/upload', {
                method: 'POST',
                headers: {
                    'Content-Encoding': 'gzip',
                },
                body: compressedPayload,
            });
    
            if (!response.ok) {
                const message = await response.text();
                alert(`Error: ${message}`);
            } else {
                const data = await response.json();
                if (Array.isArray(data)) {
                    console.log(data);
                    setRecordsWereAdded(true);
                    setRecordsAdded(data);
                } else { // just text
                    alert(data);
                    onCancel();
                }
            }
        } catch (error) {
            console.error("Error uploading data:", error);
            alert("Error uploading data. Please try again later.");
        }
    };

    return (
        <div id="uploadContainer">
            {recordsWereAdded ?
                <>
                    <AddedRecords records={recordsAdded} onBack={onUploadComplete} />
                </>
                :
                <>
                    <div>Upload file:</div>
                    <div
                        id="dropArea"
                        ref={dropAreaRef}
                        onClick={onDropAreaClick}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                    >
                        Drag and drop your file here
                        <br />or<br />
                        click to select a file
                        <input
                            ref={fileInputRef}
                            type="file"
                            onClick={onFileInputClick}
                            onChange={onFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <div id="uploadButtons">
                        <button
                            onClick={onSubmit}
                            disabled={Object.keys(parsedFileData).length === 0 || password === ''}
                        >Submit</button>
                        <button
                            onClick={onCancel}
                        >Cancel</button>
                    </div>
                </>
            }
        </div>
    );
}

export default Upload;