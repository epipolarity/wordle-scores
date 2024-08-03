import Scores from './components/Scores';
import Enter from './components/Enter';
import Upload from './components/Upload';
import { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [refreshKey, setRefreshKey] = useState(0); // used to force a re-render of the Scores component
  const [entered, setEntered] = useState(true);
  const [dateRange, setDateRange] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth()
  });
  const [scores, setScores] = useState({ data: [], summary: {} });
  const [uploading, setUploading] = useState(false);

  // useEffect hook to fetch the scores when the selected date range changes
  useEffect(() => {
    const abortController = new AbortController();

    let url;
    if (dateRange.month >= 0) {
      url = `https://lab.epipolar.com/api/wordle/getscores?game=wordle&year=${dateRange.year}&month=${dateRange.month + 1}`; // month is zero-based      
    } else {
      url = `https://lab.epipolar.com/api/wordle/getscores?game=wordle&year=${dateRange.year}`;      
    }

    fetch(url, { signal: abortController.signal })
      .then((response) => response.json())
      .then((data) => {
        setScores(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching scores:", error);
        }
      });

    return () => {
      abortController.abort();
    }

  }, [dateRange, refreshKey]);

  function enter() {
    setEntered(true);
  }

  function onUploadComplete() {
    setUploading(false);
    // fetch the scores again to update the list  
    setRefreshKey((prevKey) => prevKey + 1);
  }

  function cancelUpload() {
    setUploading(false);
  }

  function startUpload() {
    setUploading(true);
  }

  let componentToRender;

  if (!entered) {
    componentToRender = <Enter onEnter={enter} />;
  } else if (uploading) {
    componentToRender = <Upload onCancel={cancelUpload} onUploadComplete={onUploadComplete} />;
  } else {
    componentToRender = <>
      <Scores
        dateRange={dateRange}
        setDateRange={setDateRange}
        scores={scores} />
      <button onClick={startUpload}>Upload Latest Scores</button>
    </>;
  }

  return (
    <div className='appContainer'>
      {componentToRender}
    </div>
  );
}

export default App;