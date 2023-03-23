import * as React from 'react';
import { Modal, Box, Typography, Button, Container, Tooltip } from '@mui/material';

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
    const { open, setOpen, title, content } = props;

    const [subscribers, setSubscribers] = React.useState([]);

    const handleClose = () => setOpen(false);
    const handleSubscribe = (event) => {
        const login = getCookie('login');
        const param = {
            email: login,
            projectName: title
        }
        axios
            .post('http://localhost:3000/project/api/v1/subscribeToProject', param)
            .then((res) => {
                handleClose();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleUnSubscribe = (event) => {
        const login = getCookie('login');
        const param = {
            email: login,
            projectName: title
        }
        axios
            .post('http://localhost:3000/project/api/v1/unsubscribeToProject', param)
            .then((res) => {
                handleClose();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    React.useEffect(() => {
        axios
            .get('http://localhost:3000/project/api/v1/getSubscribers?name=' + title)
            .then((res) => {
                setSubscribers(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {content}
                </Typography>
                <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6, display: 'grid', justifyContent: 'center' }} center>
                    {
                        subscribers.includes(getCookie("login")) ?
                        <Button variant='contained' color='error' onClick={handleUnSubscribe} size='small' >Unsubscribe to this project</Button>
                        :
                        <Button variant='contained' color='success' onClick={handleSubscribe} size='small' >Subscribe to this project</Button>
                    }

                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                        {subscribers.map((box) => (
                            <Tooltip id={box.split()[0]} title={box}>
                                <Box
                                    sx={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: 'gray',
                                        margin: '5px',
                                        display: 'inline-block',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}
                                    center
                                >
                                    {box.split('')[0]}
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>

                </Box>
            </Box>
        </Modal>
    );
}