const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
    button.addEventListener("click", () => {

        const game = button.parentElement.querySelector("h3").textContent;

        if (game === "Roblox") {
            window.location.href = "roblox.html";
        } else {
            alert("Раздел " + game + " скоро появится!");
        }

    });
});
