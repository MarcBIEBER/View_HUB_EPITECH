import * as React from 'react';
import { Toolbar, Typography, Button } from '@mui/material';
import { getCookie } from '../../utils/handlePage';

export default function EnhancedTableToolbar(props) {

	const { handleOpen } = props;

	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
			}}
		>
			<Typography
				sx={{ flex: '1 1 100%' }}
				variant="h6"
				id="tableTitle"
				component="div"
			>
				Inventaire du HUB
			</Typography>

			{
				getCookie("user") === "fabien1.vogelweith@epitech.eu" ?
				<Button variant="contained" size='small' onClick={handleOpen} sx={{ ml: 2 }}>
					Ajouter un nouvel item
				</Button>
				:
				<></>
			}
		</Toolbar>
	);
}