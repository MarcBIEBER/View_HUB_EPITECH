import * as React from 'react';
import { Card, CardHeader, CardContent, Avatar, Typography, Button, CardActions, Grid, Stack, Chip } from '@mui/material';
import { red } from '@mui/material/colors';
import ModalViewProject from './Modal/ModalViewProject';
import { getCookie } from '../utils/handlePage';

export default function ProjectCard(props) {
    const { project } = props;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);

    return (
        <Grid item key={project.name} xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex', flexDirection: 'column', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' , minHeight: "45vh"}}>
                <CardHeader
                    avatar={
                        !getCookie("urlImage") ?
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            {project.owner[0].toUpperCase()}
                        </Avatar>
                        :
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={getCookie("urlImage")} />
                    }
                    title={project.name}
                    subheader={project.date.split('T')[0]}
                    sx={{ textAlign: 'center' }}
                />
                <CardContent sx={{ flexGrow: 1, maxHeight: "27vh" }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Description:
                    </Typography>
                    <Typography variant="body1">
                        {project.description.length < 100 ? project.description : project.description.trim().substring(0, 100) + '...'}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ pt: 2 }}>
                        Tags:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ pt: 1, overflowX: 'auto' }}>
                        {project.tag.map((tag) => (
                            <Chip key={tag} label={tag} />
                        ))}
                    </Stack>
                    <Typography variant="subtitle1" sx={{ pt: 2 }}>
                        Type:
                    </Typography>
                    <Typography variant="body1">
                        {project.type === 'Projet personelle' ? 'Projet personelle' : 'Projet entreprise'}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Stack sx={{ pt: 4 }} justifyContent="center">
                        <Button onClick={handleOpen} variant="outlined" size='small'>
                            Voir les détails
                        </Button>
                    </Stack>
                </CardActions>
            </Card>
            <ModalViewProject
                open={open}
                setOpen={setOpen}
                project={project}
            />
        </Grid>
    );
}
