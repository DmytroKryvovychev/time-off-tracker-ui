import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from 'react-i18next';

export default function ConfirmationDialog({ isOpen, onClose, onOk, onCancel }) {
  const { t } = useTranslation('leaves');

  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} aria-labelledby="alert-dialog-title">
        <DialogTitle id="alert-dialog-title">{t('DatesIntersection')}</DialogTitle>
        <DialogContent>
          <span className="alert-dialog-description">{t('DatesIntersectionConfirmation')}</span>
        </DialogContent>
        <DialogActions>
          <Button onClick={onOk} color="primary">
            {t('OK')}
          </Button>
          <Button onClick={onCancel} color="primary" autoFocus>
            {t('Cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
