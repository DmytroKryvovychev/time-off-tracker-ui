import React, { useEffect } from 'react';
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

import { convertDate } from '../config';
import { types, states } from '../constants';

const headCells = [
  { id: 'State', label: 'State' },
  { id: 'Type', label: 'Type' },
  { id: 'Dates', label: 'Dates' },
  { id: 'MyComment', label: 'My Comment' },
  { id: 'Details', label: 'State Details' },
  { id: 'View', label: 'View' },
];

const headCellsShort = [
  { id: 'State', label: 'State' },
  { id: 'Type', label: 'Type' },
  { id: 'Dates', label: 'Dates' },
  { id: 'Details', label: 'State Details' },
];

function EnhancedTableHead({ headCells }) {
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

export default function RequestTable({ data, short, users }) {
  const classes = useStyles();
  let history = useHistory();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
      const count = Math.floor(data.length / 5);

      for (let index = 1; index < count + 1; index++) {
        array.push(5 * index);
      }
      array.push(data.length);
      return array;
    }
  };

  const joinData = () => {
    const joinedData = data.map((item) => {
      item.reviews.map(
        (item) => (item.reviewer = users.find((user) => user.id === item.reviewerId)),
      );
      item.user = users.find((user) => user.id === item.userId);
      return item;
    });
    return joinedData;
  };

  const isApprovedBy = (obj) => {
    const { reviews } = obj;
    const approved = reviews.reduce((sum, item) => {
      if (item.isApproved) {
        return `${sum} ${item.reviewer.firstName.concat(' ', item.reviewer.lastName)},`;
      }
      return sum;
    }, '');
    return approved ? `Already approved by: ${approved.slice(0, -1)}` : '';
  };

  //   useEffect(() => {
  //     if (short) setRowsPerPage(3);
  //   }, []);

  return (
    <div className={classes.root}>
      {data ? (
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table">
            <EnhancedTableHead headCells={short ? headCellsShort : headCells} />
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
                        {states[item.stateId]}
                      </TableCell>
                      <TableCell align="center">{types[item.typeId].title}</TableCell>
                      <TableCell align="center">
                        {convertDate(item.startDate)} - {convertDate(item.endDate)}
                      </TableCell>
                      {short ? null : <TableCell align="center">{item.comment}</TableCell>}
                      <TableCell align="center">
                        {item.stateId === 4
                          ? item.reviews.find((rev) => rev.isApproved === false).comment
                          : isApprovedBy(item)}
                      </TableCell>
                      {short ? null : (
                        <TableCell align="center">
                          <Button
                            className="reviews-table__ok-btn"
                            variant="contained"
                            style={{ marginRight: 10 }}
                            onClick={() => {}}>
                            View
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          {short ? null : (
            <TablePagination
              rowsPerPageOptions={setRange()}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          )}
        </TableContainer>
      ) : (
        <p>No data</p>
      )}
    </div>
  );
}
