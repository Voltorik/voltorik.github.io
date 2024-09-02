function adjustNavLinks(basePath = '') {
    const navLinks = document.querySelectorAll('nav a[data-link]');
    navLinks.forEach(link => {
        const relativePath = link.getAttribute('data-link');
        link.href = basePath + relativePath;
    });
}

function loadNavbar(navbarId = 'navbar', file = 'navbar.html', basePath = '') {
    fetch(file)
        .then(res => res.text())
        .then(data => {
            document.getElementById(navbarId).innerHTML = data;
            adjustNavLinks(basePath);
        })
        .catch(err => {
            console.error('error loading navbar:', err)
        });
}