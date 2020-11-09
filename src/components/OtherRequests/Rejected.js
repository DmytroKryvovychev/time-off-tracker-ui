import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import CircularProgress from '@material-ui/core/CircularProgress';

import ReviewsFilter from './ReviewsFilter';
import { loadData } from './LoadReviewsData';
import { getMyReviewsByFilter } from '../Axios';
import { convertDate } from '../../config';
import { types } from '../../constants';
import { Users } from '../../Context';

const headCellsNew = [
  { id: 'From', label: 'From' },
  { id: 'Role', label: 'Role' },
  { id: 'Type', label: 'Type' },
  { id: 'Dates', label: 'Dates' },
  { id: 'Comments', label: 'Request Comments' },
  { id: 'Reject', label: 'My Reject Comment' },
];

function EnhancedTableHead({ headCells, actions }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={`table-cell-${headCell.id}`}
            className="reviews__table-cell"
            align="center"
            padding="default">
            {headCell.label}
          </TableCell>
        ))}
        {actions ? (
          <TableCell className="reviews__table-cell" align="center" padding="default">
            Actions
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

function Rejected() {
  const [data, setData] = useState(null);
  const [isSendingRequest, setRequestSending] = useState(false);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isLoading, setLoading] = useState(true);

  const [users, setUsers] = React.useContext(Users);

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

  const handleSendRequest = async () => {
    setRequestSending(true);
  };

  const joinData = () => {
    const joinedData = data.map((item) => {
      item.request.user = users.find((user) => user.id === item.request.userId);
      return item;
    });
    return joinedData;
  };

  const handleFilter = (fromDate, toDate, name, typeId) => {
    setLoading(true);
    getMyReviewsByFilter(fromDate, toDate, name, typeId).then(({ data }) => {
      const isNew = data.filter((item) => item.isApproved === false);
      setData(isNew);
      setLoading(false);
    });
  };

  const getData = (data) => {
    setData(data);
  };

  const uploaded = () => {
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);

    loadData(getData, uploaded, false);
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
              <EnhancedTableHead headCells={headCellsNew} />
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
                        <TableCell align="center">{item.request.user.role}</TableCell>
                        <TableCell align="center">{types[item.request.typeId].title}</TableCell>
                        <TableCell align="center">
                          {convertDate(item.request.startDate)} -{' '}
                          {convertDate(item.request.endDate)}
                        </TableCell>
                        <TableCell align="center">{item.request.comment}</TableCell>
                        <TableCell align="center">{item.comment}</TableCell>
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
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </TableContainer>
        ) : (
          <h3>No data</h3>
        )}
      </div>
    </div>
  );
}

export default Rejected;
