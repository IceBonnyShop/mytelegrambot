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

const launchDate = new Date("August 15, 2026 18:00:00").getTime();

const startDate = new Date("July 22, 2026 00:00:00").getTime();

setInterval(function(){

    const now = new Date().getTime();

    const distance = launchDate - now;

    if(distance <= 0){

        document.querySelector(".beta-launch").innerHTML = `
            <h2>🎉 IceBonny Shop официально открыт!</h2>
            <p>Добро пожаловать!</p>
        `;

        return;
    }

    const days=Math.floor(distance/(1000*60*60*24));

    const hours=Math.floor((distance%(1000*60*60*24))/(1000*60*60));

    const minutes=Math.floor((distance%(1000*60*60))/(1000*60));

    const seconds=Math.floor((distance%(1000*60))/1000);

    document.getElementById("days").textContent=days;
    document.getElementById("hours").textContent=hours;
    document.getElementById("minutes").textContent=minutes;
    document.getElementById("seconds").textContent=seconds;

    const total=launchDate-startDate;

    const passed=now-startDate;

    let percent=Math.floor((passed/total)*100);

    if(percent>100) percent=100;
    if(percent<0) percent=0;

    document.getElementById("percent").textContent=percent;

    document.getElementById("progressFill").style.width=percent+"%";

},1000);
