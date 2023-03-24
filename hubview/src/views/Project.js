import * as React from 'react';
import { Button, Grid, Stack, Box, Typography, Container, Alert, createTheme, ThemeProvider } from '@mui/material';
import axios from 'axios';

import ProjectCard from '../components/ProjectCard';
import ModalCreateProject from '../components/Modal/ModalCreateProject';
import { getCookie } from '../utils/handlePage';

const theme = createTheme();


export default function Project() {

	const [project, setProject] = React.useState([]);
	const [buttonDisabled, setButtonDisabled] = React.useState(true);

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => { setOpen(true) };
	const handleClose = () => setOpen(false);

	const getAllProjects = () => {
		axios
			.get('http://localhost:3000/project/api/v1/getProjects')
			.then((res) => {
				setProject(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	React.useEffect(() => {
		getAllProjects();
		if (getCookie("accessToken")) {
			setButtonDisabled(false);
			handleClose();
		}
	}, []);

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
							<Stack sx={{ pt: 4 }} spacing={2} justifyContent="center" >
								<Button variant="contained" onClick={handleOpen} disabled={buttonDisabled}>
									Crée un projet
								</Button>
								{ buttonDisabled ? <Alert severity="error">Vous devez être connecté pour créer un projet</Alert> : null }
							</Stack>
						</Container>
					</Box>
					<Container sx={{ py: 8 }} maxWidth="md">
						<Grid container spacing={4}>
							{project.map((project) => (
								<ProjectCard
									avatar={project.owner.split('')[0]}
									title={project.name}
									subheader={project.date.trim().split('T')[0] }
									content={project.description}
									owner={project.owner}
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
			<ModalCreateProject
				open={open}
				setOpen={setOpen}
				getAllProjects={getAllProjects}
			/>
		</div>
	);
}
