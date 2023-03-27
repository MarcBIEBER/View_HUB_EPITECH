import * as React from 'react';
import { Button, Grid, Stack, Box, Typography, Container, Alert, createTheme, ThemeProvider, MenuItem, Select, ListItemText } from '@mui/material';
import axios from 'axios';

import ProjectCard from '../components/ProjectCard';
import ModalCreateProject from '../components/Modal/ModalCreateProject';
import { getCookie } from '../utils/handlePage';

const theme = createTheme();

const premadeTags = [
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
	const [tags, setTags] = React.useState(premadeTags);
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
		<div>
			<ThemeProvider theme={theme}>
				<main>
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
								<Select
									value={selectedTag}
									onChange={handleTagChange}
									displayEmpty
									inputProps={{ 'aria-label': 'Select tag filter' }}
								>
									<MenuItem value="">Selectionner un filtre</MenuItem>
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
									key={project.id}
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
		</div>
	);
}


// lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, quae quo quod, quidem, voluptas voluptate quibusdam voluptatum quos voluptates quia n esciun dunt ut la uda parum. Quam, quae quo quod, quidem, voluptas voluptate quibusdam voluptatum quos voluptates quia nesciunt ut laudantium pariatur. 
