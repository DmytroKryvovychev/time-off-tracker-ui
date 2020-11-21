import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { convertDate } from '../../config';
import { types } from '../../constants';

const headCells = [
  { id: 'From', label: 'From' },
  { id: 'Role', label: 'Role' },
  { id: 'Type', label: 'Type' },
  { id: 'Dates', label: 'Dates' },
  { id: 'Comments', label: 'RequestComments' },
  { id: 'Details', label: 'StateDetails' },
];

const headCellsShort = [
  { id: 'From', label: 'From' },
  { id: 'Type', label: 'Type' },
  { id: 'Dates', label: 'Dates' },
  { id: 'Comments', label: 'RequestComments' },
];

function EnhancedTableHead({ headCells, t }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={`table-cell-${headCell.id}`}
            className="reviews__table-cell"
            align="center"
            padding="default">
            {t(headCell.label)}
          </TableCell>
        ))}

        <TableCell className="reviews__table-cell" align="center" padding="default">
          {t('Actions')}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: '10px',
    //margin: '0 auto',
  },
  table: {
    width: '100%',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function ReviewsTable({ data, short, users }) {
  const classes = useStyles();
  let history = useHistory();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { t, i18n } = useTranslation(['reviews', 'translation', 'roles', 'notifications']);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const setRange = () => {
    if (data) {
      let array = [];
      const opt = short ? 3 : 5;
      const count = Math.floor(data.length / opt);

      for (let index = 1; index < count + 1; index++) {
        array.push(opt * index);
      }
      data.length !== array[array.length - 1] && array.push(data.length);
      return array;
    }
  };

  const joinData = () => {
    const joinedData = data.map((item) => {
      item.request.reviews.map(
        (item) => (item.reviewer = users.find((user) => user.id === item.reviewerId)),
      );
      item.request.user = users.find((user) => user.id === item.request.userId);
      return item;
    });
    return joinedData;
  };

  const isApprovedBy = (obj) => {
    const { reviews } = obj.request;
    const approved = reviews.reduce((sum, item) => {
      if (item.isApproved) {
        return `${sum} ${item.reviewer.firstName.concat(' ', item.reviewer.lastName)},`;
      }
      return sum;
    }, '');
    return approved ? `${t('AlreadyApproved')}: ${approved.slice(0, -1)}` : '';
  };

  const emptyRows = data && rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  useEffect(() => {
    if (short) setRowsPerPage(3);
  }, []);

  return (
    <div className={classes.root}>
      {data ? (
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table">
            <EnhancedTableHead headCells={short ? headCellsShort : headCells} t={t} />
            <TableBody>
              {joinData()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => {
                  const labelId = `enhanced-table-${index}`;

                  return (
                    <TableRow
                      className="reviews__users-table-row"
                      hover
                      tabIndex={-1}
                      key={item.id}>
                      <TableCell
                        component="th"
                        align="center"
                        id={labelId}
                        scope="row"
                        padding="none">
                        {item.request.user.firstName.concat(' ', item.request.user.lastName)}
                      </TableCell>
                      {short ? null : (
                        <TableCell align="center">{t(`roles:${item.request.user.role}`)}</TableCell>
                      )}
                      <TableCell align="center">
                        {t('translation:' + types[item.request.typeId].title)}
                      </TableCell>
                      <TableCell align="center">
                        {convertDate(item.request.startDate, i18n.language)} -{' '}
                        {convertDate(item.request.endDate, i18n.language)}
                      </TableCell>
                      <TableCell align="center">{item.request.comment}</TableCell>
                      {short ? null : <TableCell align="center">{isApprovedBy(item)}</TableCell>}
                      <TableCell align="center">
                        <Button
                          className="reviews-table__ok-btn"
                          variant="contained"
                          style={{ marginRight: 10 }}
                          onClick={() => {
                            history.push(
                              `/other_requests/actions?review=${item.id}&action=approve`,
                            );
                          }}>
                          {t('Accept')}
                        </Button>
                        <Button
                          className="reviews-table__cancel-btn"
                          variant="contained"
                          onClick={() => {
                            history.push(`/other_requests/actions?review=${item.id}&action=reject`);
                          }}>
                          {t('Reject')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={short ? [3] : setRange()}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={t('LabelRowsPerPage')}
            labelDisplayedRows={({ from, to, count }) =>
              t('LabelDisplayedRows', { from: from, to: to, count: count })
            }
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        <p>{t('NoData')}</p>
      )}
    </div>
  );
}
