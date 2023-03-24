import * as React from 'react';
import { AppBar, Toolbar, Typography, Link, Button, Image } from '@mui/material';
import { getCookie } from '../utils/handlePage';

export default function PersistantHeader(props) {

    const [user, setUser] = React.useState(false)

    const handleClick = () => {
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/";
    }
    React.useEffect(() => {
        getCookie("accessToken") ? setUser(true) : setUser(false)
    }, []);
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            <img
                src="https://newsroom.ionis-group.com/wp-content/uploads/2021/10/EPITECH-TECHNOLOGY-QUADRI-2021.png"
                srcSet='https://newsroom.ionis-group.com/wp-content/uploads/2021/10/EPITECH-TECHNOLOGY-QUADRI-2021.png'
                alt="Logo"
                width="100"
                />
        </Typography>
        {
            user ? 
                <Button variant="outlined" onClick={handleClick} sx={{ my: 1, mx: 1.5 }}>
                    Se déconnecter
                </Button>
            :
            <Button href="/login" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                    Se connecter
                </Button>
        }
      </Toolbar>
    </AppBar>
  );
}