async function loadPage(url, push = true) {
    const response = await fetch(url);

    if (!response.ok) {
        window.location.href = url;
        return;
    }

    const html = await response.text();

    const newDocument = new DOMParser()
        .parseFromString(html, "text/html");

    const newMain = newDocument.querySelector(".main");
    const currentMain = document.querySelector(".main");

    if (!newMain || !currentMain) {
        window.location.href = url;
        return;
    }

    currentMain.replaceWith(newMain);

    document.title = newDocument.title;

    if (push) {
        history.pushState({}, "", url);
    }

    window.scrollTo(0, 0);
}


document.addEventListener("click", event => {
    const link = event.target.closest(
        ".course-blocks a, .sidebar > a"
    );

    if (!link) {
        return;
    }

    if (
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
    ) {
        return;
    }

    event.preventDefault();

    loadPage(link.href);
});


document.querySelectorAll(".course-button").forEach(button => {
    button.addEventListener("click", () => {
        button.parentElement.classList.toggle("open");
    });
});


window.addEventListener("popstate", () => {
    loadPage(location.href, false);
});