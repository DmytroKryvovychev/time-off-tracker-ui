import React from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

function Signers({ options, managers, onChange, idx, isDisabled, isEditable, isApproved }) {
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
            managers[idx] = newValue;
            onChange([...managers]);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </li>
      {!isEditable && (
        <>
          <button
            className="approvers__add-btn"
            disabled={isApproved === null ? true : isApproved || isDisabled}
            onClick={() => {
              if (options.length < 1 || managers.length === options.length) return;
              let array = [...managers];
              array.splice(idx + 1, 0, '');
              onChange(array);
            }}>
            Add manager
          </button>
          <button
            className="approvers__delete-btn"
            disabled={isApproved === null ? true : isApproved || isDisabled}
            onClick={() => {
              if (managers.length === 1) return;
              let array = [...managers];
              array.splice(idx, 1);
              onChange(array);
            }}>
            Delete manager
          </button>
        </>
      )}
    </div>
  );
}

export default React.memo(Signers);
