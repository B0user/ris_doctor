import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SettingsIcon from '@mui/icons-material/Settings';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

export default function Orders({ data, onSearchChange, searchQuery }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('dcm_id');
  const [anchorEl, setAnchorEl] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState({
    iin: false,
    name: true,
    gender: true,
    date: true,
    modality: true,
    body_part: true,
    actions: true
  });
  const navigate = useNavigate();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const filteredRows = data?.filter((row) => {
    const patientInfo = row.important_information.patient || {};
    const studyInfo = row.study || {};

    console.log("patientInfo: ");
    console.log(patientInfo);

    return (
      // (patientInfo.iin || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patientInfo.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patientInfo.gender || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (studyInfo.study_date || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (studyInfo.modality || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (studyInfo.body_part || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, marginTop: 2, justifyContent: 'space-between' }}>
        <TextField
          label="Поиск"
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
          onChange={onSearchChange}
        />
        <IconButton onClick={handleSettingsClick}>
          <SettingsIcon />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(visibleColumns).map((column) => (
          <MenuItem key={column} onClick={() => handleMenuItemClick(column)}>
            <Checkbox checked={visibleColumns[column]} />
            {column.charAt(0).toUpperCase() + column.slice(1)}
          </MenuItem>
        ))}
      </Menu>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              {visibleColumns.iin && (
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'patient_info.iin'}
                    direction={orderBy === 'patient_info.iin' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'patient_info.iin')}
                  >
                    ИИН
                  </TableSortLabel>
                </TableCell>
              )}
              {visibleColumns.name && (
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'patient_info.name'}
                    direction={orderBy === 'patient_info.name' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'patient_info.name')}
                  >
                    Имя
                  </TableSortLabel>
                </TableCell>
              )}
              {visibleColumns.gender && (
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'patient_info.gender'}
                    direction={orderBy === 'patient_info.gender' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'patient_info.gender')}
                  >
                    Пол
                  </TableSortLabel>
                </TableCell>
              )}
              {visibleColumns.date && (
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'study_info.date'}
                    direction={orderBy === 'study_info.date' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'study_info.date')}
                  >
                    Дата
                  </TableSortLabel>
                </TableCell>
              )}
              {visibleColumns.modality && (
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'study_info.modality'}
                    direction={orderBy === 'study_info.modality' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'study_info.modality')}
                  >
                    Модальность
                  </TableSortLabel>
                </TableCell>
              )}
              {visibleColumns.body_part && (
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'study_info.body_part'}
                    direction={orderBy === 'study_info.body_part' ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, 'study_info.body_part')}
                  >
                    Часть тела
                  </TableSortLabel>
                </TableCell>
              )}
              {visibleColumns.actions && <TableCell>Действия</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(filteredRows, getComparator(order, orderBy)).map((row) => (
              <TableRow key={row._id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                {visibleColumns.iin && <TableCell>{row.patient_info?.iin}</TableCell>}
                {visibleColumns.name && <TableCell>{row.patient_info?.name}</TableCell>}
                {visibleColumns.gender && <TableCell>{row.patient_info?.gender === "m" ? "Мужской" : "Женский"}</TableCell>}
                {visibleColumns.date && <TableCell>{row.study_info?.date}</TableCell>}
                {visibleColumns.modality && <TableCell>{row.study_info?.modality}</TableCell>}
                {visibleColumns.body_part && <TableCell>{row.study_info?.body_part}</TableCell>}
                {visibleColumns.actions && (
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small">
                        <VisibilityIcon onClick={() => navigate(`${row._id}`)} />
                      </IconButton>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
