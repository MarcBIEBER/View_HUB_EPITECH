import * as React from 'react';
import { Modal, TextField, Alert, Box, Typography, Button } from '@mui/material';
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
    const [fieldErrors, setFieldErrors] = React.useState({});
    const [requestStatus, setRequestStatus] = React.useState(null);

    React.useEffect(() => {
        setRequestStatus(null);
        setFieldErrors({});
    }, [open]);

    const handleClose = () => setOpen(false);

    const createNewItem = (event) => {

        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const body = {
            name: data.get('name'),
            totalItem: data.get('total'),
            urlImage: data.get('urlImage'),
            localisation: data.get('localisation'),
            token: getCookie("accessToken")
        }

        const fieldErrorss = {};
        if (!body.name) {
            fieldErrorss.name = "Le nom de l'objet est obligatoire";
        }
        if (!body.totalItem) {
            fieldErrorss.totalItem = "Le total d'objet est obligatoire";
        }
        if (!body.urlImage) {
            fieldErrorss.urlImage = "L'url de l'image est obligatoire";
        }
        if (!body.localisation) {
            fieldErrorss.localisation = "La localisation est obligatoire";
        }
        if (Object.keys(fieldErrorss).length > 0) {
            setFieldErrors(fieldErrorss);
            return;
        }

        axios
            .post("http://localhost:3000/inventory/api/v1/addItem", body)
            .then((res) => {
                handleClose();
                updateRows();
                setFieldErrors({});
                setRequestStatus(res.status);
            })
            .catch((err) => {
                console.log(err);
                setRequestStatus(err.response?.status);
                setFieldErrors({});
            });
    }

    return (

        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>

                <Typography variant="h4" align="center" color="text.primary" gutterBottom>
                    Ajouter un objet
                </Typography>
                <Box component="form" noValidate onSubmit={createNewItem} sx={{ mt: 1 }}>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="urlImage"
                        label="URL de l'image"
                        id="urlImage"
                        error={Boolean(fieldErrors.urlImage)}
                        helperText={fieldErrors.urlImage}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Nom de l'objet"
                        name="name"
                        error={Boolean(fieldErrors.name)}
                        helperText={fieldErrors.name}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="localisation"
                        label="Localisation"
                        id="localisation"
                        error={Boolean(fieldErrors.localisation)}
                        helperText={fieldErrors.localisation}
                    />


                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="total"
                        label="Total (quantité)"
                        error={Boolean(fieldErrors.totalItem)}
                        helperText={fieldErrors.totalItem}
                        id="total"
                    />

                    {
                        requestStatus === 400 && (
                            <Alert severity="error" margin="normal" required fullWidth>L'objet existe déjà</Alert>
                        )
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Ajouter un objet
                    </Button>
                </Box>
            </Box>
        </Modal>
    );

}