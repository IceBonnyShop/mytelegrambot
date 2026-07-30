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

const launchDate = new Date("August 31, 2026 00:00:00").getTime();

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
const canvas = document.getElementById("particles");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

for(let i = 0; i < 70; i++){

    particles.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        r:Math.random()*3+1,
        dx:(Math.random()-0.5)*0.4,
        dy:(Math.random()-0.5)*0.4
    });

}

function animate(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p=>{

        p.x+=p.dx;
        p.y+=p.dy;

        if(p.x<0||p.x>canvas.width)p.dx*=-1;
        if(p.y<0||p.y>canvas.height)p.dy*=-1;

        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="rgba(77,163,255,0.8)";
        ctx.shadowColor="#4da3ff";
        ctx.shadowBlur=12;
        ctx.fill();

    });

    requestAnimationFrame(animate);

}

animate();

window.addEventListener("resize",()=>{

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

});

window.addEventListener("load", function(){

    setTimeout(function(){

        document.getElementById("loader").classList.add("hide");

    }, 2000);

});
