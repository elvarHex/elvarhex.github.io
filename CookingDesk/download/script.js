const repos = {
    mobile: {
        prefix: "mobile-v",
        description: "Use the mobile version to discover recipes and create your own."
    },
    desk: {
        prefix: "desk-v",
        description: "Use the desk version in the kitchen to discover and cook recipes from around the world, as well as your own recipes created using the mobile version. It is recommended to use the desktop version on an Android device with a large, easy-to-read screen."
    }
};

async function fetchReleaseInfo(type) {
    const info = repos[type];
    document.getElementById("releaseVersion").textContent = "Loading...";
    document.getElementById("releaseDate").textContent = "Checking latest release date...";

    try {
        const response = await fetch("https://api.github.com/repos/elvarHex/CookingDesk/releases");
        if (!response.ok) throw new Error("API request failed");
        
        const releases = await response.json();
        let targetRelease = null;
        for (let i = 0; i < releases.length; i++) {
            if (releases[i].tag_name.startsWith(info.prefix)) {
                targetRelease = releases[i];
                break;
            }
        }

        if (!targetRelease) throw new Error("Release not found");

        const tag = targetRelease.tag_name;
        const cleanVersion = tag.removePrefix ? tag.removePrefix(info.prefix) : tag.replace(info.prefix, "");
        const dateObj = new Date(targetRelease.published_at);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        let downloadUrl = "";
        const assets = targetRelease.assets;
        for (let j = 0; j < assets.length; j++) {
            if (assets[j].name.endsWith(".apk")) {
                downloadUrl = assets[j].browser_download_url;
                break;
            }
        }

        document.getElementById("releaseVersion").textContent = cleanVersion;
        document.getElementById("releaseDate").textContent = `Released on ${formattedDate}`;
        document.getElementById("githubDownloadLink").href = downloadUrl || targetRelease.html_url;
        document.getElementById("releaseNotesLink").href = targetRelease.html_url;

    } catch (err) {
        document.getElementById("releaseVersion").textContent = "Unavailable";
        document.getElementById("releaseDate").textContent = "Could not fetch release info";
        document.getElementById("githubDownloadLink").href = `https://github.com/elvarHex/CookingDesk/releases`;
        document.getElementById("releaseNotesLink").href = `https://github.com/elvarHex/CookingDesk/releases`;
    }
}

function selectVersion(type) {
    document.getElementById("btnMobile").classList.toggle("active", type === 'mobile');
    document.getElementById("btnDesk").classList.toggle("active", type === 'desk');
    document.getElementById("infoText").textContent = repos[type].description;
    fetchReleaseInfo(type);
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?app=" + type;
    window.history.replaceState({path: newUrl}, "", newUrl);
}

window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const appType = urlParams.get("app");
    if (appType === "desk") {
        selectVersion("desk");
    } else {
        selectVersion("mobile");
    }
});