const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const prizes = [
    {
        text: "🎟️ 5% скидка",
        color: "#00ffb7",
        chance: 25
    },
    {
        text: "🔄 Еще вращение",
        color: "#00c3ff",
        chance: 30
    },
    {
        text: "❌ Ничего",
        color: "#ffb300",
        chance: 10
    },
    {
        text: "🎟️ 10% скидка",
        color: "#ff4d6d",
        chance: 15
    },
    {
        text: "💎 30/80 гемов",
        color: "#9b5cff",
        chance: 5
    },
    {
        text: "❌ Ничего",
        color: "#00e676",
        chance: 5
    },
    {
        text: "⭐ 15 Stars",
        color: "#ff7043",
        chance: 2
    },
    {
        text: "❌ Ничего",
        color: "#26c6da",
        chance: 8
    }
];

const centerX = 210;
const centerY = 210;
const radius = 200;

const sectorAngle = (Math.PI * 2) / prizes.length;

let rotation = 0;
let spinning = false;
function drawWheel() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < prizes.length; i++) {

        const startAngle = rotation + i * sectorAngle;
        const endAngle = startAngle + sectorAngle;

        // сектор
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
            centerX,
            centerY,
            radius,
            startAngle,
            endAngle
        );
        ctx.closePath();

        ctx.fillStyle = prizes[i].color;
        ctx.fill();

        // граница
        ctx.strokeStyle = "#062427";
        ctx.lineWidth = 3;
        ctx.stroke();

        // текст
        ctx.save();

        ctx.translate(centerX, centerY);

        ctx.rotate(startAngle + sectorAngle / 2);

        ctx.fillStyle = "white";
        ctx.font = "bold 17px Arial";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        ctx.fillText(
            prizes[i].text,
            radius - 20,
            0
        );

        ctx.restore();
    }

    // центральный круг
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
    ctx.fillStyle = "#0b1f22";
    ctx.fill();

}
function choosePrize() {

    let total = 0;

    for (const prize of prizes) {
        total += prize.chance;
    }

    let random = Math.random() * total;

    for (let i = 0; i < prizes.length; i++) {

        random -= prizes[i].chance;

        if (random <= 0) {
            return i;
        }

    }

    return prizes.length - 1;

}

function easeOut(t) {

    return 1 - Math.pow(1 - t, 3);

}
document.getElementById("spin").onclick = () => {

    if (spinning) return;

    spinning = true;

    const prizeIndex = choosePrize();

    // Центр нужного сектора
    const targetAngle =
        (Math.PI * 1.5) -
        (prizeIndex * sectorAngle + sectorAngle / 2);

    // 6–8 полных оборотов
    const extraTurns =
        (6 + Math.floor(Math.random() * 3)) * Math.PI * 2;

    const startRotation = rotation;

    const endRotation =
        extraTurns + targetAngle;

    const duration = 5000;

    const startTime = performance.now();

    function animate(now) {

        const elapsed = now - startTime;

        let progress = elapsed / duration;

        if (progress > 1) progress = 1;

        rotation =
            startRotation +
            (endRotation - startRotation) *
            easeOut(progress);

        drawWheel();

        if (progress < 1) {

            requestAnimationFrame(animate);

        } else {

            spinning = false;

            rotation = endRotation % (Math.PI * 2);

            alert(
`🎉 Поздравляем!

Ваш приз:

${prizes[prizeIndex].text}`
            );

        }

    }

    requestAnimationFrame(animate);

};

drawWheel();
// Первый рисунок колеса
drawWheel();
