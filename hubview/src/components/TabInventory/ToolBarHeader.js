import * as React from 'react';
import { Toolbar, Typography, Button } from '@mui/material';
import { getCookie } from '../../utils/handlePage';
import axios from 'axios';

export default function EnhancedTableToolbar(props) {

	const { handleOpen } = props;

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
				admin ?
				<Button variant="contained" size='small' onClick={handleOpen} sx={{ ml: 2 }}>
					Ajouter un nouvel item
				</Button>
				:
				<></>
			}
		</Toolbar>
	);
}