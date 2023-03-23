import * as React from 'react';
import { Box, Table, TableContainer, Paper } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';

import TableBody from '../components/TabInventory/Body';
import EnhancedTableToolbar from '../components/TabInventory/ToolBarHeader';
import EnhancedTableHead from '../components/TabInventory/Header';
import TabPagination from '../components/TabInventory/Pagination';
import ModalAddNewItem from '../components/Modal/ModalAddNewItem';

export default function EnhancedTable() {
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('name');
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const [rows, setRows] = React.useState([]);

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => { setOpen(true) };
	const handleClose = () => setOpen(false);

	const updateRows = () => {
		axios
			.get('http://localhost:3000/inventory/api/v1/getItems')
			.then((res) => {
				setRows(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	React.useEffect(() => {
		updateRows();
	}, []);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<div>
			<Box sx={{ width: '100%' }}>
				<Paper sx={{ width: '100%', mb: 2 }}>
					<EnhancedTableToolbar handleOpen={handleOpen} />
					<TableContainer>
						<Table
							sx={{ minWidth: 750 }}
							aria-labelledby="tableTitle"
							size={'medium'}
						>
							<EnhancedTableHead
								order={order}
								orderBy={orderBy}
								onRequestSort={handleRequestSort}
								rowCount={rows.length}
								visuallyHidden={visuallyHidden}
							/>
							<TableBody
								rows={rows}
								setRows={setRows}
								order={order}
								orderBy={orderBy}
								page={page}
								rowsPerPage={rowsPerPage}
							/>
						</Table>
					</TableContainer>
					<TabPagination
						rows={rows}
						page={page}
						rowsPerPage={rowsPerPage}
						handleChangePage={handleChangePage}
						handleChangeRowsPerPage={handleChangeRowsPerPage}
					/>
				</Paper>
			</Box>
			<ModalAddNewItem
				open={open}
				setOpen={setOpen}
				updateRows={updateRows}
			/>
		</div>
	);
}