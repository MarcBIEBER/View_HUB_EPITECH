import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { red } from '@mui/material/colors';
import axios from 'axios';

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

export default function ProjectCard(props) {
    const { avatar, title, subheader, content, id } = props;

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

    const handleSubscribe = (event) => {
        const param = {
            projectId: id,
            email: "123"
        }
        axios
			.post('http://localhost:3000/project/api/v1/subscribeToProject', param)
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
    }

    return (
        <div>
            <Card sx={{ maxWidth: 345 }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            {avatar}
                        </Avatar>
                    }
                    title={title}
                    subheader={subheader}
                />
                <CardContent>
                    <Typography variant="body" color="text.primary">
                        { content.length < 100 ? content : content.trim().substring(0, 100) + '...' }
                    </Typography>
                </CardContent>
                <Button onClick={handleOpen} variant="outlined">Show details</Button>
            </Card>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {content}
                    </Typography>
                    <Button variant='contained' color='success' onClick={handleSubscribe} >Subscribe to this project</Button>
                </Box>
            </Modal>
        </div>
    );
}