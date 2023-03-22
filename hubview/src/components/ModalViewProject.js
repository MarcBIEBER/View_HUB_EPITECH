import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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

export default function ModalViewProject(props) {
    const { open, setOpen, title, content, id } = props;

    const handleClose = () => setOpen(false);
    const handleSubscribe = (event) => {
        const login = getCookie('login');
        const param = {
            projectId: id,
            email: login,
            name: title
        }
        axios
            .post('http://localhost:3000/project/api/v1/subscribeToProject', param)
            .then((res) => {
                console.log(res.data);
                handleClose();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {content}
                </Typography>
                <Button variant='contained' color='success' onClick={handleSubscribe} size='small' >Subscribe to this project</Button>
            </Box>
        </Modal>
    );
}