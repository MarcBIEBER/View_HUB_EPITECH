function getCookie(name) {
    const regex = new RegExp(`(?:(?:^|.*;\\s*)${name}\\s*\\=\\s*([^;]*).*$)|^.*$`);
    const cookie = document.cookie.replace(regex, "$1");
    return cookie;
}

module.exports = {
    getCookie
};