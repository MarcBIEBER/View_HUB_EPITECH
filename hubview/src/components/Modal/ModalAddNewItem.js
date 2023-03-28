import * as React from 'react';
import { Modal, TextField, Box, Typography, Button } from '@mui/material';
import axios from 'axios';
import { getCookie } from '../../utils/handlePage';

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

export default function ModalAddNewItem(props) {

    const { open, setOpen, updateRows } = props;


	const handleClose = () => setOpen(false);

	const createNewItem = (event) => {
        
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const name = data.get('name');
		const totalItem = data.get('total');
		axios
			.post("http://localhost:3000/inventory/api/v1/addItem", { name, totalItem, token: getCookie("accessToken") })
			.then((res) => {
				handleClose();
                updateRows();
			})
			.catch((err) => {
				console.log(err);
			});
	}

    return (

        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>

                <Typography variant="h4" align="center" color="text.primary" gutterBottom>
                    Crée un item:
                </Typography>
                <Box component="form" noValidate onSubmit={createNewItem} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Nom de l'item"
                        name="name"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="total"
                        label="Total (quantité)"
                        id="total"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Ajouter un item
                    </Button>
                </Box>
            </Box>
        </Modal>
    );

}