import React, { useState } from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';

function VacationPeriod({
  fromDate,
  changeFromDate,
  toDate,
  changeToDate,
  isSendingRequest,
  disablePeriod,
  showAllDays,
}) {
  const [focusedFrom, setFocusFrom] = useState(false);
  const [focusedTo, setFocusTo] = useState(false);

  const getDateDifference = Math.round(toDate - fromDate) / (1000 * 60 * 60 * 24);

  const showPastDays = () => false;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <SingleDatePicker
        id={`dateFrom`}
        disabled={isSendingRequest}
        showClearDate
        placeholder="From"
        isOutsideRange={showAllDays && showPastDays}
        isDayBlocked={(day) => (toDate ? day > toDate : null)}
        numberOfMonths={1}
        date={fromDate}
        onDateChange={(date) => changeFromDate(date)}
        focused={focusedFrom}
        onFocusChange={({ focused }) => setFocusFrom(focused)}
      />

      <SingleDatePicker
        id={`dateTo`}
        disabled={isSendingRequest}
        showClearDate
        placeholder="To"
        isOutsideRange={showAllDays && showPastDays}
        isDayBlocked={(day) => (fromDate ? day < fromDate : null)}
        numberOfMonths={1}
        date={toDate}
        onDateChange={(date) => changeToDate(date)}
        focused={focusedTo}
        onFocusChange={({ focused }) => setFocusTo(focused)}
      />

      {!disablePeriod && fromDate && toDate && getDateDifference >= 0 ? (
        <h4 style={{ paddingTop: 3 }}>
          {getDateDifference + 1} vacation {getDateDifference === 0 ? 'day' : 'days'}
        </h4>
      ) : null}
    </div>
  );
}

export default React.memo(VacationPeriod);
