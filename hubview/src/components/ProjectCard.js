import * as React from 'react';
import { Card, CardHeader, CardContent, Avatar, Typography, Button, CardActions, Grid, Stack } from '@mui/material';
import { red } from '@mui/material/colors';
import ModalViewProject from './Modal/ModalViewProject';

export default function ProjectCard(props) {
    const { avatar, title, subheader, content, owner } = props;
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);

    return (
        <Grid item key={title} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} >
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            {avatar}
                        </Avatar>
                    }
                    title={title}
                    subheader={subheader}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {title}
                    </Typography>
                    <Typography>
                        {content.length < 100 ? content : content.trim().substring(0, 100) + '...'}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Stack sx={{ pt: 4 }} justifyContent="center">
                        <Button onClick={handleOpen} variant="outlined" size='small'>
                            Afficher les détails
                        </Button>
                    </Stack>
                </CardActions>
            </Card>
            <ModalViewProject
                open={open}
                setOpen={setOpen}
                title={title}
                content={content}
                owner={owner}
            />
        </Grid>
    );
}