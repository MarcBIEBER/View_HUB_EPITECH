import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Modal from '@mui/material/Modal';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

import ProjectCard from '../components/ProjectCard';

const theme = createTheme();

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export default function Project() {

	const [project, setProject] = React.useState([]);

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => {
		// TODO: Check if there is a access token in cookies and if it is valid
		setOpen(true)
	};
	const handleClose = () => setOpen(false);

	React.useEffect(() => {
		axios
			.get('http://localhost:3000/project/api/v1/getProjects')
			.then((res) => {
				setProject(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const createProject = (event) => {
	}

	return (
		<div>
			<ThemeProvider theme={theme}>
				{/* <AppBar position="relative">
					<Toolbar>
						<CameraIcon sx={{ mr: 2 }} />
						<Typography variant="h6" color="inherit" noWrap>
							Album layout
						</Typography>
					</Toolbar>
				</AppBar> */}
				<main>
					{/* Hero unit */}
					<Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6, }}>
						<Container maxWidth="sm">
							<Typography
								component="h1"
								variant="h2"
								align="center"
								color="text.primary"
								gutterBottom
							>
								Vue des projets en cours
							</Typography>
							<Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
								<Button variant="contained" onClick={handleOpen}>
									Crée un projet
								</Button>
							</Stack>
						</Container>
					</Box>
					<Container sx={{ py: 8 }} maxWidth="md">
						<Grid container spacing={4}>
							{project.map((project) => (
								<ProjectCard
									avatar={project.owner.split('')[0]}
									title={project.name}
									subheader={project.date}
									content={project.description}
									id={project.id}
								/>
							))}
						</Grid>
					</Container>

				</main>
				{/* Footer */}
				{/* <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
					<Typography variant="h6" align="center" gutterBottom>
						Footer
					</Typography>
					<Typography variant="subtitle1" align="center" color="text.secondary" component="p">
						Something here to give the footer a purpose!
					</Typography>
				</Box> */}
				{/* End footer */}
			</ThemeProvider>

			<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						title
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						content
					</Typography>
					<Stack sx={{ pt: 4 }} justifyContent="center">
						<Button variant='contained' color='success' onClick={createProject} size='small' >Subscribe to this project</Button>
					</Stack>
				</Box>
			</Modal>
		</div>
	);
}