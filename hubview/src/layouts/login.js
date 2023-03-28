import * as React from 'react';
import { Avatar, Button, CssBaseline, TextField, Link, Paper, Box, Grid, Typography, createTheme, ThemeProvider, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';

const theme = createTheme();

export default function Login(props) {
    const { previousView } = props;

	const [fieldErrors, setFieldErrors] = React.useState({});
    const [requestStatus, setRequestStatus] = React.useState(null);

    const handleSubmit = (event) => {
		event.preventDefault();
        setRequestStatus(null);
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');

		const fieldErrorss = {};
		if (!email) {
			fieldErrorss.email = 'Veuillez renseigner votre adresse e-mail';
		}
		if (!password) {
			fieldErrorss.password = 'Veuillez renseigner votre mot de passe';
		}
		if (Object.keys(fieldErrorss).length > 0) {
			setFieldErrors(fieldErrorss);
			return;
		}
        const body = {
            email: email,
            password: password
        }
        axios
            .post('http://localhost:3000/user/api/v1/login', body)
            .then((res) => {
                document.cookie = "accessToken=" + res.data.accessToken
                document.cookie = "login=" + res.data.email
                document.cookie = "urlImage=" + res.data.urlImage
                window.location.href = !previousView ? "/" : previousView;
                setFieldErrors({});
                setRequestStatus(res.status);
            })
            .catch((err) => {
                // console.log(err);
                setRequestStatus(err.response?.status);
                setFieldErrors({});
            })

    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: "url(https://www.km0.info/wp-inside/uploads/2021/05/km0-soir.jpg)",
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography variant="h5">
                            Connexion
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Adresse e-mail"
                                name="email"
                                autoComplete="email"
                                error={Boolean(fieldErrors.email)}
                                helperText={fieldErrors.email}
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mot de passe"
                                type="password"
                                id="password"
                                error={Boolean(fieldErrors.password)}
                                helperText={fieldErrors.password}
                                autoComplete="current-password"
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
                                Se connecter
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link href="/register" variant="body2">
                                        {"Vous n'avez pas de compte ? Inscrivez-vous !"}
                                    </Link>
                                </Grid>
                            </Grid>

                            <Grid container marginTop={"4vh"}>
                                <Grid item>
                                    <Link href="/" variant="body2">
                                        Continuer sans se connecter
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}