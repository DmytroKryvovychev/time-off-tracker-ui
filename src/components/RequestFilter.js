import React, { useState } from 'react';
import { Button, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

import VacationPeriod from '../components/Leaves/VacationPeriod';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { states, types } from '../constants';

function ReviewsFilter({ isSendingRequest, handleFilter }) {
  const [state, setState] = useState(0);
  const [type, setType] = useState(0);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const { t } = useTranslation(['translation', 'requests']);

  const handleFromDate = (date) => {
    setFromDate(date);
  };

  const handleToDate = (date) => {
    setToDate(date);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };
  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: '15px',
      }}>
      <VacationPeriod
        fromDate={fromDate}
        changeFromDate={handleFromDate}
        toDate={toDate}
        changeToDate={handleToDate}
        showAllDays={true}
        isSendingRequest={isSendingRequest}
        disablePeriod={true}
      />
      <FormControl style={{ marginRight: 50, width: 150 }}>
        <InputLabel>{t('requests:State')}</InputLabel>
        <Select value={state} onChange={(e) => handleStateChange(e)}>
          {states.map((state, idx) => (
            <MenuItem key={`type-${state}-idx-${idx}`} value={idx}>
              {t(state)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl style={{ marginRight: 50, width: 350 }}>
        <InputLabel>{t('requests:Type')}</InputLabel>
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
          const stateId = state === 0 ? '' : state;
          const typeId = type === 0 ? '' : type;
          const startDate =
            fromDate !== null ? moment(fromDate._d).format('YYYY-MM-DD').toString() : '';
          const endDate = toDate !== null ? moment(toDate._d).format('YYYY-MM-DD').toString() : '';
          handleFilter(startDate, endDate, stateId, typeId);
        }}
        style={{ verticalAlign: 'bottom', height: '40px' }}>
        {t('requests:Filter')}
      </Button>
    </div>
  );
}

export default React.memo(ReviewsFilter);
