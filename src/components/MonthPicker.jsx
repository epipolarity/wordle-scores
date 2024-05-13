import DatePicker from 'react-datepicker';
import { addMonths, subMonths, startOfMonth } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import './MonthPicker.css';

function MonthPicker({selectedMonth, setSelectedMonth}) {
  
    const handleMonthChange = (date) => {
      setSelectedMonth(date);
    };
  
    const goToPreviousMonth = () => {
      setSelectedMonth((currentDate) => subMonths(currentDate, 1));
    };
  
    const goToNextMonth = () => {
      setSelectedMonth((currentDate) => addMonths(currentDate, 1));
    };
  
    const goToThisMonth = () => {
      setSelectedMonth(startOfMonth(new Date()));
    };
  
    return (
      <div className="container">
        <div className="buttonContainer">
          <button className="button" onClick={goToPreviousMonth}>Previous</button>
          <button className="button" onClick={goToThisMonth}>This Month</button>
          <button className="button" onClick={goToNextMonth}>Next</button>
        </div>
        <DatePicker
          selected={selectedMonth}
          onChange={handleMonthChange}
          showMonthYearPicker
          dateFormat="MMMM yyyy"
        />
      </div>
    );
  }

  export default MonthPicker;