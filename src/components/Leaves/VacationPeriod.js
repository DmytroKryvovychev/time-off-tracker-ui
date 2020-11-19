import React, { useState } from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('leaves');

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
        placeholder={t('From')}
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
        placeholder={t('To')}
        isOutsideRange={showAllDays && showPastDays}
        isDayBlocked={(day) => (fromDate ? day < fromDate : null)}
        numberOfMonths={1}
        date={toDate}
        onDateChange={(date) => changeToDate(date)}
        focused={focusedTo}
        onFocusChange={({ focused }) => setFocusTo(focused)}
      />

      {!disablePeriod && fromDate && toDate && getDateDifference >= 0 ? (
        <h4 style={{ paddingTop: 3 }}>{t('VacationDays', { days: getDateDifference + 1 })}</h4>
      ) : null}
    </div>
  );
}

export default React.memo(VacationPeriod);
