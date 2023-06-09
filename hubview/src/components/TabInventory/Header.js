import { TableHead, TableRow, TableCell, TableSortLabel, Box } from '@mui/material';
import PropTypes from 'prop-types';

const headCells = [
	{
		id: "image",
		numeric: false,
		label: "Image",
	},
	{
		id: 'name',
		numeric: false,
		label: 'Nom',
	},
	{
		id: "localisation",
		numeric: true,
		label: "Localisation",
	},
	{
		id: 'total',
		numeric: true,
		label: 'Total',
	},
	{
		id: 'available',
		numeric: true,
		label: 'Disponibilité',
	},
	{
		id: 'used',
		numeric: true,
		label: 'En cours d\'utilisation',
	},
	{
		id: 'details',
		numeric: true,
		label: 'Détails',
	},
];

export default function EnhancedTableHead(props) {
	const { order, orderBy, onRequestSort, visuallyHidden } =
		props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	onRequestSort: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired
};