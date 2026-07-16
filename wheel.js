const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const prizes = [
    "🎟️ 5% скидка",
    "🔄 Еще вращение",
    "❌ Ничего",
    "🎟️ 10% скидка",
    "💎 30/80 гемов",
    "❌ Ничего",
    "⭐ 15 Stars",
    "❌ Ничего"
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

const angle = (Math.PI * 2) / prizes.length;

let rotation = 0;
let spinning = false;

function drawWheel() {

    ctx.clearRect(0, 0, 420, 420);

    for (let i = 0; i < prizes.length; i++) {

        ctx.beginPath();

        ctx.moveTo(210, 210);

        ctx.arc(
            210,
            210,
            200,
            i * angle + rotation,
            (i + 1) * angle + rotation
        );

        ctx.fillStyle = colors[i];

        ctx.fill();

        ctx.save();

        ctx.translate(210, 210);

        ctx.rotate(i * angle + angle / 2 + rotation);

        ctx.fillStyle = "white";

        ctx.font = "bold 18px Arial";

        ctx.textAlign = "right";

        ctx.fillText(prizes[i], 175, 8);

        ctx.restore();
    }

}
function randomPrize() {

    const random = Math.random() * 100;

    if (random < 25) return 0;      // 5% скидка
    if (random < 55) return 1;      // Еще вращение
    if (random < 65) return 2;      // Ничего
    if (random < 80) return 3;      // 10% скидка
    if (random < 85) return 4;      // 30/80 гемов
    if (random < 90) return 5;      // Ничего
    if (random < 92) return 6;      // 15 Stars
    return 7;                       // Ничего

}

document.getElementById("spin").onclick = () => {

    if (spinning) return;

    spinning = true;

    const prizeIndex = randomPrize();

    const turns = 6;

    const targetRotation =
        (Math.PI * 2 * turns) +
        (Math.PI / 2) -
        (prizeIndex * angle) -
        (angle / 2);

    const startRotation = rotation;

    const duration = 5000;

    const startTime = performance.now();
    function animate(now) {

    const elapsed = now - startTime;

    let progress = elapsed / duration;

    if (progress > 1) progress = 1;

    // Плавное замедление
    const ease = 1 - Math.pow(1 - progress, 3);

    rotation =
        startRotation +
        (targetRotation - startRotation) * ease;

    drawWheel();

    if (progress < 1) {

        requestAnimationFrame(animate);

    } else {

        spinning = false;

        alert(
`🎉 Поздравляем!

Ваш приз:

${prizes[prizeIndex]}`
        );

    }

}

requestAnimationFrame(animate);

};

drawWheel();
