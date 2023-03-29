import * as React from 'react';
import { Modal, Box, Typography, Button, Tooltip, IconButton, Chip, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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

export default function ModalViewProject(props) {
    const { open, setOpen, project } = props;

    const [subscribers, setSubscribers] = React.useState([]);
    const [isLogged, setIsLogged] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);

    const handleClose = () => setOpen(false);
    const handleSubscribe = (event) => {
        const login = getCookie('login');
        const param = {
            email: login,
            projectName: project.name,
            token: getCookie('accessToken')
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
            projectName: project.name,
            token: getCookie('accessToken')
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

    const handleDeletProject = (event) => {
        axios
            .delete('http://localhost:3000/project/api/v1/deleteProject?name=' + project.name + '&email=' + getCookie('login') + '&token=' + getCookie('accessToken'))
            .then((res) => {
                handleClose();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    React.useEffect(() => {
        axios
            .get('http://localhost:3000/project/api/v1/getSubscribers?name=' + project.name)
            .then((res) => {
                setSubscribers(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .post('http://localhost:3000/user/api/v1/checkToken', { token: getCookie('accessToken') })
            .then((res) => {
                if (res.status === 200)
                    setIsLogged(true);
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .post('http://localhost:3000/user/api/v1/checkSuperToken', { token: getCookie('accessToken') })
            .then((res) => {
                if (res.status === 200)
                    setIsAdmin(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [project.name]);

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h5" sx={{ textAlign: 'center' }}>
                    {project.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    {project.tag.map((tag) => (
                        <Chip key={tag} label={tag} size="small" sx={{ margin: 0.5 }} />
                    ))}
                </Box>
                <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: 16, textAlign: 'center' }}>
                    {project.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2, flexDirection: 'column' }}>
                    {isLogged ?
                    subscribers.find(user => user.email === (getCookie("login"))) ? (
                        <Button variant='contained' color='error' onClick={handleUnSubscribe} size='small' sx={{ margin: 1 }}>
                            Se désinscrire du projet
                        </Button>
                    ) : (
                        <Button variant='contained' color='success' onClick={handleSubscribe} size='small' sx={{ margin: 1 }}>
                            S'inscrire au projet
                        </Button>
                    )
                    :
                    <></>
                }
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        {subscribers.map((box) => (
                            <Tooltip key={box.email} title={box.email}>
                                <Box
                                    sx={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: 'gray',
                                        margin: '5px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        borderRadius: '50%'
                                    }}
                                >
                                    {
                                        box.urlImage === null ?
                                            box.email.split('')[0].toUpperCase()
                                            :
                                            <Avatar alt={box.email.split('')[2]} src={box.urlImage} srcSet={box.urlImage} />
                                    }
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>
                    {(isLogged && getCookie('login') === project.owner) || (isAdmin) ? (
                        <IconButton size='small' aria-label="remove" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 1 }} onClick={() => handleDeletProject()}>
                            <DeleteIcon />
                        </IconButton>
                    ) : (
                        <></>
                    )}
                </Box>
                <Typography variant="subtitle1" sx={{ pt: 2 }}>
                    Type: {project.type === 'personal' ? 'Projet personelle' : 'Projet entreprise'}
                </Typography>
            </Box>
        </Modal>
    );
}