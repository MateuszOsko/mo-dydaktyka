document.querySelectorAll(".course-button").forEach(button => {

    button.addEventListener("click", () => {

        button.parentElement.classList.toggle("open");

    });

});
