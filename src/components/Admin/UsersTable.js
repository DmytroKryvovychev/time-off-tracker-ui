import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import ConfirmationDialog from './ConfirmationDialog';
import AddNewUserDialog from './AddNewUserDialog';
import { deleteUser, changeUserRole } from '../Axios';
import { notifyAdmin } from '../../notifications';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'firstName', numeric: true, disablePadding: true, label: 'Name' },
  { id: 'userName', numeric: false, disablePadding: false, label: 'Username' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
  { id: 'button', numeric: false, disablePadding: false, label: '' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, t } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'center'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            className="reviews__table-cell">
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              {t([headCell.label, 'roles:' + headCell.label])}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = ({ roles, updateUsers, t }) => {
  const classes = useToolbarStyles();
  const [openNewUser, setOpenNewUser] = useState(false);

  return (
    <Toolbar className={classes.root}>
      <h2 className="users-table__title">{t('UsersList')}</h2>

      <>
        <Tooltip title={t('AddNewUser')}>
          <IconButton
            className="new_user-btn"
            aria-label="add new user"
            onClick={() => {
              setOpenNewUser(true);
            }}>
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
        <AddNewUserDialog
          isOpen={openNewUser}
          onClose={() => setOpenNewUser(false)}
          roles={roles}
          updateUsers={updateUsers}
        />
      </>
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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

export default function EnhancedTable({ data, roles, updateUsers }) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEditing, setEditing] = useState(null);
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);
  const [deletableUser, setDeletableUser] = useState(null);
  const { t } = useTranslation(['admin', 'roles', 'notifications']);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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
      data.length !== array[array.length - 1] && array.push(data.length);
      return array;
    }
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const handleDelete = async (id) => {
    await deleteUser(id)
      .then(() => {
        notifyAdmin('User delete success');
        setOpen(false);
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          notifyAdmin('Network Error');
        } else if (err.response && err.response.status === 400) {
          notifyAdmin('400');
        } else {
          notifyAdmin('User delete failed');
        }
      });
    updateUsers();
  };

  const handleChangeRole = async (id, item) => {
    if (role === roles.indexOf(item.role)) {
      setEditing(null);
      return;
    }

    await changeUserRole({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      userName: item.userName,
      email: item.email,
      role: roles[role],
    })
      .then(() => {
        notifyAdmin('Role changed success');
        setEditing(false);
      })
      .catch((err) => {
        if (err.message === 'Network Error') {
          notifyAdmin('Network Error');
        } else if (err.response && err.response.status === 400) {
          notifyAdmin('400');
        } else {
          notifyAdmin('Role changed failed');
        }
      });
    updateUsers();
  };

  return (
    <div className={classes.root}>
      <EnhancedTableToolbar roles={roles} updateUsers={updateUsers} t={t} />

      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size={'medium'}
          aria-label="enhanced table">
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            t={t}
          />
          <TableBody>
            {stableSort(data, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    className="admin__users-table-row"
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={item.id}>
                    <TableCell padding="checkbox">
                      <Tooltip title={t('Delete')}>
                        <IconButton
                          className="delete-icon"
                          aria-label="delete"
                          onClick={() => {
                            setDeletableUser([item.id, item.firstName.concat(' ', item.lastName)]);
                            setOpen(true);
                          }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {item.firstName ? item.firstName.concat(' ', item.lastName) : ''}
                    </TableCell>
                    <TableCell align="center">{item.userName}</TableCell>
                    <TableCell align="center">{item.email}</TableCell>
                    <TableCell align="center">
                      {isEditing === item.id ? (
                        <FormControl>
                          <InputLabel>{t('roles:Role')}</InputLabel>
                          <Select
                            value={role}
                            onChange={(event) => {
                              setRole(event.target.value);
                            }}>
                            {roles.map((obj, idx) => (
                              <MenuItem key={`key-${idx}-name${obj}`} value={idx}>
                                {t('roles:' + obj)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        t('roles:' + item.role)
                      )}
                    </TableCell>

                    <TableCell align="center">
                      {isEditing === item.id ? (
                        <div className="row">
                          <Button
                            className="users-table__ok-btn"
                            variant="contained"
                            onClick={() => {
                              handleChangeRole(item.id, item);
                            }}>
                            {t('Ok')}
                          </Button>
                          <Button
                            className="users-table__cancel-btn"
                            variant="contained"
                            onClick={() => {
                              setEditing(null);
                            }}>
                            {t('Cancel')}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={() => {
                            setEditing(item.id);
                            setRole(item.role === 'Employee' ? 0 : 1);
                          }}>
                          {t('Edit')}
                        </Button>
                      )}
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
      <ConfirmationDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onDelete={handleDelete}
        user={deletableUser}
      />
      <ToastContainer />
    </div>
  );
}
