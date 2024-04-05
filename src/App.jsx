import Scores from './Scores';
import { useState, useEffect } from 'react';
import './App.css';
import Enter from './Enter';


function App() {
  const [entered, setEntered] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [scores, setScores] = useState({ scores: [], summary: {} });

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
        console.error("Error fetching scores:", error);
      });

    return () => {
      abortController.abort();
    }

  }, [selectedMonth]);

  function enter() {
    setEntered(true);
  }

  return (
    <div className='appContainer'>
      {!entered
        ?
        <Enter onEnter={enter} />
        :
        <Scores selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} scores={scores} />
      }
    </div>
  );
}

export default App;