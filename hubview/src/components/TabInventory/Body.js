import * as React from 'react';
import TableBody from '@mui/material/TableBody';
import { modifyItemInventory, removeItemInventory } from '../../utils/handleInventory';
import { IconButton, TableRow, TextField, TableCell } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';

import { getCookie } from '../../utils/handlePage';
import axios from 'axios';

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

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

export default function BodyTable(props) {

    const { rows, setRows, order, orderBy, page, rowsPerPage, handleOpenModalAsk } = props;

	const [admin, setAdmin] = React.useState(false);

	React.useEffect(() => {
		const cookie = getCookie("accessToken");
		axios
			.post("http://localhost:3000/user/api/v1/checkSuperToken", { token: cookie })
			.then((res) => {
				if (res.status === 200)
					setAdmin(true);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const handleRemoveRow = async (name, id) => {
		const res = await removeItemInventory(name);
		if (res.status !== 200) { return; }
		const newRows = rows.filter(row => row.id !== id);
		setRows(newRows);
	};

	const handleAskItem = async (name, totalItem) => {
		handleOpenModalAsk()
	}

	const handleDetailsChange = (event, id) => {
		const newRows = rows.map(row => {
			if (row.id === id) {
				modifyItemInventory(row.name, "details", event.target.value);
				return {
					...row,
					details: event.target.value
				}
			}
			return row;
		});
		setRows(newRows);
	};

	const handleAddTotal = (id) => {
		const newRows = rows.map(row => {
			if (row.id === id) {
				modifyItemInventory(row.name, "totalItem", parseInt(row.totalItem) + 1);
				modifyItemInventory(row.name, "available", parseInt(row.available) + 1);
				return {
					...row,
					totalItem: parseInt(row.totalItem, 10) + 1,
					available: parseInt(row.available, 10) + 1
				}
			}
			return row;
		});
		setRows(newRows);
	};

	const handleRemoveTotal = (id) => {
		const newRows = rows.map(row => {
			if (row.id === id) {
				if (row.totalItem == 0 || row.available == 0)
					return { ...row };
				modifyItemInventory(row.name, "totalItem", parseInt(row.totalItem) - 1);
				modifyItemInventory(row.name, "available", parseInt(row.available) - 1);
				return {
					...row,
					totalItem: parseInt(row.totalItem, 10) - 1,
					available: parseInt(row.available, 10) - 1
				}
			}
			return row;
		});
		setRows(newRows);
	};

	const handleAddUsed = (id) => {
		const newRows = rows.map(row => {
			if (row.id === id) {
				if (row.available == 0)
					return { ...row };
				modifyItemInventory(row.name, "used", parseInt(row.used) + 1);
				modifyItemInventory(row.name, "available", parseInt(row.available) - 1);
				return {
					...row,
					used: parseInt(row.used, 10) + 1,
					available: parseInt(row.available, 10) - 1
				}
			}
			return row;
		});
		setRows(newRows);
	};

	const handleRemoveUsed = (id) => {
		const newRows = rows.map(row => {
			if (row.id === id) {
				if (row.used == 0)
					return row;
				modifyItemInventory(row.name, "used", parseInt(row.used) - 1);
				modifyItemInventory(row.name, "available", parseInt(row.available) + 1);
				return {
					...row,
					used: parseInt(row.used, 10) - 1,
					available: parseInt(row.available, 10) + 1
				}
			}
			return row;
		});
		setRows(newRows);
	};
	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
            <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                            <TableCell component="th" id={labelId} scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">
                                {row.totalItem}
								{
									admin ?
									<>
                                <IconButton size='small' aria-label="add" onClick={() => handleAddTotal(row.id)}>
                                    <AddIcon />
                                </IconButton>
                                <IconButton size='small' aria-label="add" onClick={() => handleRemoveTotal(row.id)}>
                                    <RemoveIcon />
                                </IconButton>
									</>
									:
									<></>
								}
                            </TableCell>

                            <TableCell align="right">{row.available}</TableCell>
                            <TableCell align="right">
                                {row.used}
								{
									admin ?
									<>
										<IconButton size='small' aria-label="add" onClick={() => handleAddUsed(row.id)}>
											<AddIcon />
										</IconButton>
										<IconButton size='small' aria-label="add" onClick={() => handleRemoveUsed(row.id)}>
											<RemoveIcon />
										</IconButton>
									</>
									:
									<></>
								}
                            </TableCell>

                            <TableCell align="right">
							{
								admin ?
                                <TextField
                                    id="standard-multiline-flexible"
                                    label="Commentaires"
                                    multiline
                                    maxRows={4}
                                    variant="standard"
                                    defaultValue={row.details}
                                    onBlur={(e) => handleDetailsChange(e, row.id)}
                                />
								:
								<>{row.details}</>
							}
                            </TableCell>
							{
								admin ?
								<TableCell align="right" style={{ width: "2vw"}}>
									<IconButton size='small' aria-label="remove" onClick={() => handleRemoveRow(row.name, row.id)}>
										<DeleteIcon />
									</IconButton>
								</TableCell>
								:
								<TableCell align='right' style={{ width: "2vw"}}>
									<IconButton size='small' aria-label="sendRequestItem" onClick={() => handleAskItem(row.name, row.id)}>
										<SendIcon />
									</IconButton>
								</TableCell>
							}
                        </TableRow>
                    );
                })}
            {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }} >
                    <TableCell colSpan={6} />
                </TableRow>
            )}
        </TableBody>
    );
}