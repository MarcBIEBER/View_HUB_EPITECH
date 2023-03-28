import * as React from 'react';
import { Modal, TextField, Box, Alert, Typography, Button } from '@mui/material';
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

export default function ModalAskItem(props) {

    const { open, setOpen } = props;
    const [fieldErrors, setFieldErrors] = React.useState({});
    const [requestStatus, setRequestStatus] = React.useState(null);

    React.useEffect(() => {
        setRequestStatus(null);
        setFieldErrors({});
    }, [open]);

    const handleClose = () => setOpen(false);

    const handleAskForItem = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const quantity = data.get('quantity');
        const reason = data.get('reason');


        const fieldErrorss = {};
        if (!quantity) {
            fieldErrorss.quantity = "La quantité est obligatoire";
        }
        if (!reason) {
            fieldErrorss.reason = "La raison est obligatoire";
        }
        if (Object.keys(fieldErrorss).length > 0) {
            setFieldErrors(fieldErrorss);
            return;
        }

        axios
            .post("http://localhost:3000/inventory/api/v1/askForItem", { quantity, reason, token: getCookie("accessToken") })
            .then((res) => {
                if (res.status === 200) {
                    handleClose();
                    setFieldErrors({});
                    setRequestStatus(res.status);
                }
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
                    Demander un objet:
                </Typography>
                <Box component="form" noValidate onSubmit={handleAskForItem} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="quantity"
                        label="Quantité"
                        name="quantity"
                        error={Boolean(fieldErrors.quantity)}
                        helperText={fieldErrors.quantity}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="reason"
                        label="Pour quoi faire ?"
                        error={Boolean(fieldErrors.reason)}
                        helperText={fieldErrors.reason}
                        id="reason"
                    />

                    {
                        requestStatus === 400 && (
                            <Alert severity="error" margin="normal" required fullWidth>Identifiants incorrects</Alert>
                        )
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Faire une demande d'objet
                    </Button>
                </Box>
            </Box>
        </Modal>
    );

}