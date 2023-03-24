import axios from 'axios';

export function getCookie(name) {
    const regex = new RegExp(`(?:(?:^|.*;\\s*)${name}\\s*\\=\\s*([^;]*).*$)|^.*$`);
    const cookie = document.cookie.replace(regex, "$1");
    return cookie;
}

export function checkConnexion() {
    const cookie = getCookie("accessToken");
    if (!cookie) {
        window.location.href = "/";
    }
    axios
        .post('http://localhost:3000/user/api/v1/checkToken', { token: cookie })
        .then((res) => {
            if (res.status !== 200) {
                window.location.href = "/";
            }
        })
        .catch((err) => {
            console.log(err);
        });
}