import * as React from 'react';
import { Modal, TextField, Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import { getCookie } from '../utils/handlePage';

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

export default function ModalProject(props) {
    const { open, setOpen, getAllProjects } = props;

	const createProject = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const name = data.get('name');
		const description = data.get('description');
		const date = new Date().toISOString();
		const owner = getCookie("login");
		axios
			.post("http://localhost:3000/project/api/v1/createProject", { name, description, date, owner })
			.then((res) => {
				handleClose();
				getAllProjects();
				getAllProjects();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	const handleClose = () => setOpen(false);
    return (
			<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>

                <Typography component="h4" variant="h4" align="center" color="text.primary" gutterBottom>
                    Crée un projet:
                </Typography>
                <Box component="form" noValidate onSubmit={createProject} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Nom du projet"
                        name="name"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        multiline
                        name="description"
                        label="Description"
                        id="description"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Crée le projet
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}