import React from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTranslation } from 'react-i18next';

function Signers({ options, managers, onChange, idx, isDisabled, isEditable, isApproved }) {
  const { t } = useTranslation('leaves');

  return (
    <div className="approvers__item">
      <li>
        <Autocomplete
          className="approvers__item-form"
          disabled={isApproved || isDisabled}
          options={options.filter((item) => !managers.includes(item))}
          getOptionSelected={(option, value) => option.value === value.value}
          value={managers[idx] ? (managers[idx].length === 0 ? null : managers[idx]) : null}
          onChange={(e, newValue) => {
            managers[idx] = newValue !== null ? newValue : '';
            onChange([...managers]);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </li>
      {!isEditable && (
        <>
          <button
            className="approvers__add-btn"
            disabled={isApproved === true ? true : isApproved || isDisabled}
            onClick={() => {
              if (options.length < 1 || managers.length === options.length) return;
              let array = [...managers];
              array.splice(idx + 1, 0, '');
              onChange(array);
            }}>
            {t('AddManager')}
          </button>
          <button
            className="approvers__delete-btn"
            disabled={isApproved === true ? true : isApproved || isDisabled}
            onClick={() => {
              if (managers.length === 1) return;
              let array = [...managers];
              array.splice(idx, 1);
              onChange(array);
            }}>
            {t('DeleteManager')}
          </button>
        </>
      )}
    </div>
  );
}

export default React.memo(Signers);
