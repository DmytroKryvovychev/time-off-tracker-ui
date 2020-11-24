import React, { useState } from 'react';
import { Button, Select, MenuItem, FormControl, InputLabel, TextField } from '@material-ui/core';

import VacationPeriod from '../Leaves/VacationPeriod';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

function ReviewsFilter({ types, isSendingRequest, handleFilter }) {
  const [type, setType] = useState(0);
  const [name, setName] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const { t } = useTranslation(['translation', 'reviews']);

  const handleFromDate = (date) => {
    setFromDate(date);
  };

  const handleToDate = (date) => {
    setToDate(date);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  return (
    <div className="review-filter__content">
      <VacationPeriod
        fromDate={fromDate}
        changeFromDate={handleFromDate}
        toDate={toDate}
        changeToDate={handleToDate}
        showAllDays={true}
        isSendingRequest={isSendingRequest}
        disablePeriod={true}
      />
      <TextField
        value={name}
        label={t('reviews:FilterByName')}
        variant="standard"
        onChange={(e) => setName(e.target.value)}
        className="review-filter__name"
      />
      <FormControl className="review-filter__type">
        <InputLabel>{t('reviews:Type')}</InputLabel>
        <Select value={type} onChange={(e) => handleTypeChange(e)}>
          {types.map((type, idx) => (
            <MenuItem key={`type-${type.title}-idx-${idx}`} value={type.id}>
              {t(type.title)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          const typeId = type === 0 ? '' : type;
          const startDate =
            fromDate !== null ? moment(fromDate._d).format('YYYY-MM-DD').toString() : '';
          const endDate = toDate !== null ? moment(toDate._d).format('YYYY-MM-DD').toString() : '';
          handleFilter(startDate, endDate, name, typeId);
        }}
        className="review-filter__btn">
        {t('reviews:Filter')}
      </Button>
    </div>
  );
}

export default React.memo(ReviewsFilter);
