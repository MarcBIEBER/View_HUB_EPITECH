import * as React from 'react';
import { Avatar, Button, CssBaseline, TextField, Alert, Link, Grid, Box, Typography, Container, createTheme, ThemeProvider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';

const theme = createTheme();

export default function Register(props) {
	const { previousView } = props;
	const [fieldErrors, setFieldErrors] = React.useState({});
	const [requestStatus, setRequestStatus] = React.useState(null);


	const handleSubmit = (event) => {
		event.preventDefault();
		setRequestStatus(null);
		const data = new FormData(event.currentTarget);
		const email = data.get('email');
		const password = data.get('password');
		const fieldErrorss = {};
		if (!email) {
			fieldErrorss.email = 'Veuillez renseigner votre adresse e-mail';
		}
		if (!password) {
			fieldErrorss.password = 'Veuillez renseigner un mot de passe';
		}
		if (Object.keys(fieldErrorss).length > 0) {
			setFieldErrors(fieldErrorss);
			return;
		}

		axios
			.post('http://localhost:3000/user/api/v1/register', { email, password })
			.then((res) => {
				document.cookie = "accessToken=" + res.data.accessToken
				document.cookie = "login=" + res.data.email
				window.location.href = !previousView ? "/" : previousView;
				setFieldErrors({});
				setRequestStatus(res.status);
			})
			.catch((err) => {
				console.log(err);
				setRequestStatus(err.response?.status);
				setFieldErrors({});
			})
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography variant="h5">
						Créez votre compte
					</Typography>
					<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									label="Adresse e-mail"
									name="email"
									autoComplete="email"
									error={Boolean(fieldErrors.email)}
									helperText={fieldErrors.email}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="password"
									label="Mot de passe"
									type="password"
									id="password"
									autoComplete="new-password"
									error={Boolean(fieldErrors.password)}
									helperText={fieldErrors.password}
								/>
							</Grid>
						</Grid>

						{
							requestStatus === 400 && (
								<Alert severity="error" margin="normal" required fullWidth>Identifiants déjà existant</Alert>
							)
						}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							S'inscrire
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link href="/login" variant="body2">
									Vous avez déjà un compte ? Connectez-vous !
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}