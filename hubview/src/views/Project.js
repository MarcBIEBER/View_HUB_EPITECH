import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';

import axios from 'axios';

import ProjectCard from '../components/ProjectCard';

export default function Project() {

	const [project, setProject] = React.useState([]);

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

	return (
		<div>
			{project.map((project) => (
				<ProjectCard
					avatar={project.owner.split('')[0]}
					title={project.name}
					subheader={project.date}
					content={project.description}
					id={project.id}
				/>
			))}
		</div>
	);
}

// lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.