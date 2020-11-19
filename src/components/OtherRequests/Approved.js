import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import ReviewsFilter from './ReviewsFilter';
import { loadData } from './LoadReviewsData';
import { getMyReviewsByFilter } from '../Axios';
import { convertDate } from '../../config';
import { Users } from '../../Context';
import { types, states } from '../../constants';
import { notifyOtherRequests } from '../../notifications';

const headCellsNew = [
  { id: 'From', label: 'From' },
  { id: 'Role', label: 'Role' },
  { id: 'Type', label: 'Type' },
  { id: 'Dates', label: 'Dates' },
  { id: 'State', label: 'State' },
  { id: 'Comments', label: 'RequestComments' },
  { id: 'Details', label: 'StateDetails' },
];

function EnhancedTableHead({ headCells, actions, t }) {
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
        {actions ? (
          <TableCell className="reviews__table-cell" align="center" padding="default">
            {t('Actions')}
          </TableCell>
        ) : null}
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

function Approved() {
  const [data, setData] = useState(null);
  const [isSendingRequest, setRequestSending] = useState(false);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setLoading] = useState(true);
  const { t, i18n } = useTranslation(['reviews', 'translation', 'roles', 'notifications']);
  const [users] = useContext(Users);

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
      const count = Math.floor(data.length / 5);

      for (let index = 1; index < count + 1; index++) {
        array.push(5 * index);
      }
      array.push(data.length);
      return array;
    }
  };

  const emptyRows = data && rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

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

  const handleFilter = (fromDate, toDate, name, typeId) => {
    setRequestSending(true);
    setLoading(true);
    getMyReviewsByFilter(fromDate, toDate, name, typeId)
      .then(({ data }) => {
        const isNew = data.filter((item) => item.isApproved === true);
        setData(isNew);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          notifyOtherRequests('Network Error');
        } else if (err.response.status === 400) {
          notifyOtherRequests('400');
        } else {
          notifyOtherRequests('');
        }
      });
    setRequestSending(false);
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

  const getData = (data) => {
    setData(data);
  };

  const uploaded = () => {
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);

    loadData(getData, uploaded, true);
  }, []);

  return (
    <div>
      <ReviewsFilter
        types={types}
        isSendingRequest={isSendingRequest}
        handleFilter={handleFilter}
      />
      {/* <ReviewsTable data={testData} headCells={headCellsNew} /> */}
      <div className={classes.root}>
        {isLoading ? (
          <CircularProgress />
        ) : data.length > 0 ? (
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={'medium'}
              aria-label="enhanced table">
              <EnhancedTableHead headCells={headCellsNew} t={t} />
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
                        <TableCell align="center">{t(`roles:${item.request.user.role}`)}</TableCell>
                        <TableCell align="center">
                          {t(`translation:${types[item.request.typeId].title}`)}
                        </TableCell>
                        <TableCell align="center">
                          {convertDate(item.request.startDate, i18n.language)} -{' '}
                          {convertDate(item.request.endDate, i18n.language)}
                        </TableCell>
                        <TableCell align="center">
                          {t(`translation:${states[item.request.stateId]}`)}
                        </TableCell>
                        <TableCell align="center">{item.request.comment}</TableCell>
                        <TableCell align="center">{isApprovedBy(item)}</TableCell>
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
              rowsPerPageOptions={setRange()}
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
          <h3>{t('NoData')}</h3>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Approved;
