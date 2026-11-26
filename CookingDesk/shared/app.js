const menuItems = [
    { name: "🏠 Home", link: BASE_URL },
    { name: "📲 Download", link: BASE_URL + "download/" },
    { name: "📖 Guide", link: BASE_URL + "guide/" },
    { name: "🛠 Repository", link: "https://github.com/elvarhex/CookingDesk" },
    { name: "🛠 elvarHex", link: "https://elvarhex.github.io/" }
];

const menuLinks = document.getElementById("menuLinks");

if (menuLinks) {
    menuItems.forEach(item => {
        const link = document.createElement("a");
        link.href = item.link;
        link.textContent = item.name;
        menuLinks.appendChild(link);
    });
}

function openMenu() {
    document.getElementById("menu").classList.add("show");
    document.getElementById("overlay").classList.add("show");
}

function closeMenu() {
    document.getElementById("menu").classList.remove("show");
    document.getElementById("overlay").classList.remove("show");
}