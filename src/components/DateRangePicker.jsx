import { addMonths, subMonths } from 'date-fns';
import './DateRangePicker.css';

function DateRangePicker({ dateRange, setDateRange }) {

  const nextMonth = (prev, direction) => {

    let year = prev.year ? prev.year : new Date().getFullYear();
    let month = prev.month >= 0 ? prev.month : new Date().getMonth();

    let prevDate = new Date(year, month);

    const options = { year: 'numeric', month: 'long' };

    let nextDate = direction > 0 ? addMonths(prevDate, 1) : subMonths(prevDate, 1);

    return {
      month: nextDate.getMonth(),
      year: nextDate.getFullYear()
    }

  }

  const goToPreviousMonth = () => {
    setDateRange((prevRange) => nextMonth(prevRange, -1));
  };

  const goToNextMonth = () => {
    setDateRange((prevRange) => nextMonth(prevRange, 1));
  };

  const goToThisMonth = () => {
    setDateRange({
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    });
  };

  const goToPreviousYear = () => {
    setDateRange((prevRange) => ({
      month: -1,
      year: prevRange.year ? prevRange.year - 1 : new Date().getFullYear() - 1
    }));
  };

  const goToNextYear = () => {
    setDateRange((prevRange) => ({
      month: -1,
      year: prevRange.year ? prevRange.year + 1 : new Date().getFullYear() + 1
    }));
  };

  const goToThisYear = () => {
    setDateRange({
      month: -1,
      year: new Date().getFullYear()
    });
  };

  const formatDateRange = () => {
    if (dateRange.month >= 0) {
      const date = new Date(dateRange.year, dateRange.month);
      const options = { year: 'numeric', month: 'long' };
      return date.toLocaleDateString(undefined, options);
    } else {
      return `All of ${dateRange.year}`;
    }
  }

  return (
    <div className="container">
      <div className="buttonContainer">
        <button className="button" onClick={goToPreviousYear}>◀</button>
        <button className="button" onClick={goToThisYear}>This Year</button>
        <button className="button" onClick={goToNextYear}>▶</button>
      </div>
      <div className="buttonContainer">
        <button className="button" onClick={goToPreviousMonth}>◀</button>
        <button className="button" onClick={goToThisMonth}>This Month</button>
        <button className="button" onClick={goToNextMonth}>▶</button>
      </div>
      <div className="dateRange">
        {formatDateRange()}
      </div>
    </div>
  );
}

export default DateRangePicker;