import React from 'react';
import { TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

function LeaveComment({ disabled, comment, changeComment }) {
  const { t } = useTranslation('leaves');

  return (
    <TextField
      disabled={disabled}
      label={t('Comment')}
      variant="standard"
      fullWidth
      multiline
      className="form-comment"
      value={comment}
      onChange={(e) => changeComment(e)}
    />
  );
}

export default LeaveComment;
