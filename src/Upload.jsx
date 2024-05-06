import { parseText } from "./utils/parser";
import { useRef, useState } from "react";

import './Upload.css';

function Upload({ onCancel }) {
    const fileInputRef = useRef(null);
    const [results, setResults] = useState({});
    const [password, setPassword] = useState('');

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
            const results = parseText(text);
            setResults(results);
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

    const onSubmit = () => {
        console.log(results);
    }

    return (
        <div id="uploadContainer">
            <div>Upload file:</div>
            <div
                id="dropArea"
                onClick={onDropAreaClick}
                onDrop={onDrop}
                onDragOver={onDragOver}
            >
                Drag and drop your file here
                <br/>or<br/>
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
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onSubmit} disabled={Object.keys(results).length === 0 || password === ''}>Submit</button>
            </div>
        </div>
    );
}

export default Upload;