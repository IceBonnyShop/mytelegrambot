const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const prizes = [
    "???",
    "???",
    "???",
    "???",
    "???",
    "???",
    "???",
    "???"
];

const colors = [
    "#00ffb7",
    "#00c3ff",
    "#ffb300",
    "#ff4d6d",
    "#9b5cff",
    "#00e676",
    "#ff7043",
    "#26c6da"
];

let rotation = 0;
let spinning = false;

function drawWheel() {

    const angle = (Math.PI * 2) / prizes.length;

    ctx.clearRect(0,0,420,420);

    for(let i=0;i<prizes.length;i++){

        ctx.beginPath();

        ctx.moveTo(210,210);

        ctx.arc(
            210,
            210,
            200,
            angle*i+rotation,
            angle*(i+1)+rotation
        );

        ctx.fillStyle = colors[i];

        ctx.fill();

        ctx.save();

        ctx.translate(210,210);

        ctx.rotate(angle*i+angle/2+rotation);

        ctx.fillStyle="white";

        ctx.font="bold 18px Arial";

        ctx.textAlign="right";

        ctx.fillText(prizes[i],175,8);

        ctx.restore();

    }

}

drawWheel();

document.getElementById("spin").onclick = ()=>{

    if(spinning) return;

    spinning=true;

    let speed=Math.random()*0.4+0.45;

    const timer=setInterval(()=>{

        rotation+=speed;

        speed*=0.985;

        drawWheel();

        if(speed<0.003){

            clearInterval(timer);

            spinning=false;

            alert("🎉 Колесо остановилось!");

        }

    },16);

};