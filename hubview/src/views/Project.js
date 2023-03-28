import * as React from 'react';
import { Button, Grid, Stack, Box, Typography, Container, Alert, createTheme, ThemeProvider, MenuItem, Select, ListItemText } from '@mui/material';
import axios from 'axios';

import ProjectCard from '../components/ProjectCard';
import ModalCreateProject from '../components/Modal/ModalCreateProject';
import { getCookie } from '../utils/handlePage';

const theme = createTheme();

const tags = [
	'Front',
	'Back',
	'Fullstack',
	'Mobile',
	'Web',
	'Desktop',
	'IOT',
	'AI'
];

export default function Project() {

	const [projects, setProjects] = React.useState([]);
	const [buttonDisabled, setButtonDisabled] = React.useState(true);
	const [filterType, setFilterType] = React.useState("");

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => { setOpen(true) };
	const handleClose = () => setOpen(false);

	const [selectedTag, setSelectedTag] = React.useState('');

	const getAllProjects = () => {
		axios
			.get('http://localhost:3000/project/api/v1/getProjects')
			.then((res) => {
				setProjects(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	const handleFilterChange = (event) => {
		setFilterType(event.target.value);
	}

	React.useEffect(() => {
		getAllProjects();
		if (getCookie("accessToken")) {
			setButtonDisabled(false);
			handleClose();
		}
	}, []);

	const handleTagChange = (event) => {
		setSelectedTag(event.target.value);
	}
	const filteredProjectsByType = selectedTag
		? projects.filter((project) => project.tag.includes(selectedTag))
		: projects;

	const filteredProjects = filterType
		? filteredProjectsByType.filter((project) => project.type === filterType)
		: filteredProjectsByType;



	return (
		<>
			<ThemeProvider theme={theme}>
				<main>
					<Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6, }}>
						<Container maxWidth="sm">
							<Typography
								variant="h2"
								component={'h1'}
								align="center"
								color="text.primary"
								gutterBottom
							>
								Vue des projets en cours
							</Typography>
							{buttonDisabled ? <Alert severity="error">Vous devez être connecté pour créer un projet</Alert> : <></>}
							<Stack sx={{ pt: 4 }} spacing={2} justifyContent="center" >
								<Button variant="contained" onClick={handleOpen} disabled={buttonDisabled}>
									Créer un projet
								</Button>
								
								<Select
									value={selectedTag}
									onChange={handleTagChange}
									displayEmpty
									inputProps={{ 'aria-label': 'Select tag filter' }}
								>
									<MenuItem value="">Sélectionner un filtre</MenuItem>
									{tags.map((name) => (
										<MenuItem key={name} value={name}>
											<ListItemText primary={name} />
										</MenuItem>
									))}
								</Select>
								<Select
									value={filterType}
									onChange={handleFilterChange}
									displayEmpty
								>
									<MenuItem value="">Tous les types</MenuItem>
									<MenuItem value="Projet entreprise">Entreprise</MenuItem>
									<MenuItem value="Projet personelle">Perso</MenuItem>
								</Select>
							</Stack>
						</Container>
					</Box>
					<Container sx={{ py: 8 }} maxWidth="md">
						<Grid container spacing={4}>
							{filteredProjects.map((project) => (
								<ProjectCard
									key={project.name}
									project={project}
								/>
							))}
						</Grid>
					</Container>
				</main>
			</ThemeProvider>
			<ModalCreateProject
				open={open}
				setOpen={setOpen}
				getAllProjects={getAllProjects}
			/>
		</>
	);
}
