import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';
import { useTranslation } from 'react-i18next';

import Approvers from './Approvers';
import LeaveComment from './LeaveComment';

import { states } from '../../constants';

const useTypes = [
  { id: 1, text: 'Half day', tag: 'HalfDay' },
  { id: 2, text: 'Full day', tag: 'FullDay' },
];

function SickNoDoc({
  isSendingRequest,
  comment,
  changeComment,
  fromDate,
  changeFromDate,
  toDate,
  changeToDate,
  duration,
  changeDuration,
  request,
  isEditable,
}) {
  const [focusedFrom, setFocusFrom] = useState(false);
  const [focusedTo, setFocusTo] = useState(false);
  const { t } = useTranslation('leaves');

  return (
    <div>
      <div className="nodoc__content">
        <SingleDatePicker
          id="dateFrom"
          disabled={
            (request && (request.stateId === states.indexOf('In progress') ? true : isEditable)) ||
            isSendingRequest
          }
          showClearDate
          placeholder={t('From')}
          numberOfMonths={1}
          date={fromDate}
          onDateChange={(date) => {
            changeFromDate(date);
            changeToDate(date);
          }}
          focused={focusedFrom}
          onFocusChange={({ focused }) => setFocusFrom(focused)}
        />

        <SingleDatePicker
          id="dateTo"
          disabled={
            (request && (request.stateId === states.indexOf('In progress') ? true : isEditable)) ||
            isSendingRequest
          }
          showClearDate
          placeholder={t('To')}
          numberOfMonths={1}
          date={fromDate}
          onDateChange={(date) => {
            changeFromDate(date);
            changeToDate(date);
          }}
          focused={focusedTo}
          onFocusChange={({ focused }) => setFocusTo(focused)}
        />

        <FormControl className="sick-no-doc__use">
          <InputLabel>{t('Use')}</InputLabel>
          <Select
            disabled={
              (request &&
                (request.stateId === states.indexOf('In progress') ? true : isEditable)) ||
              isSendingRequest
            }
            value={duration}
            onChange={(e) => changeDuration(e.target.value)}>
            {useTypes.map((use, idx) => (
              <MenuItem key={`use-${use.text}-idx-${idx}`} value={use.id}>
                {t(use.tag)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <LeaveComment
        disabled={
          (request && (request.stateId === states.indexOf('In progress') ? true : isEditable)) ||
          isSendingRequest
        }
        comment={comment}
        changeComment={changeComment}
      />

      <Approvers />
    </div>
  );
}

export default SickNoDoc;
