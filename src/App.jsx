import Scores from './Scores';
import { useState, useEffect } from 'react';
import './App.css';
import Enter from './Enter';
import Upload from './Upload';


function App() {
  const [refreshKey, setRefreshKey] = useState(0); // used to force a re-render of the Scores component
  const [entered, setEntered] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [scores, setScores] = useState({ data: [], summary: {} });
  const [uploading, setUploading] = useState(false);

  // useEffect hook to fetch the scores when the selected month changes
  useEffect(() => {
    const abortController = new AbortController();

    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth() + 1; // getMonth() is zero-based

    fetch(`https://epipolar.com/wordle/get_scores.php?year=${year}&month=${month}`, { signal: abortController.signal })
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

  }, [selectedMonth, refreshKey]);

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
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
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