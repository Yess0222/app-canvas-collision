const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() - 0.5) * this.speed;
        this.dy = (Math.random() - 0.5) * this.speed;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);
        // Mantener los círculos dentro del tamaño de la pantalla
        if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
            this.posX += this.dx;
        }
        if ((this.posY + this.radius) > window_height || (this.posY - this.radius) < 0) {
            this.dy = -this.dy;
            this.posY += this.dy;
        }
        this.posX += this.dx;
        this.posY += this.dy;
    }

    checkCollision(otherCircle) {
        const dx = this.posX - otherCircle.posX;
        const dy = this.posY - otherCircle.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + otherCircle.radius;
    }

    handleCollision(otherCircle) {
        if (this.checkCollision(otherCircle)) {
            // Calcular la nueva dirección después de la colisión
            const angle = Math.atan2(this.posY - otherCircle.posY, this.posX - otherCircle.posX);
            const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            const otherSpeed = Math.sqrt(otherCircle.dx * otherCircle.dx + otherCircle.dy * otherCircle.dy);

            this.dx = Math.cos(angle) * speed;
            this.dy = Math.sin(angle) * speed;
            otherCircle.dx = -Math.cos(angle) * otherSpeed;
            otherCircle.dy = -Math.sin(angle) * otherSpeed;

            // Mover los círculos para que no se superpongan
            const overlap = this.radius + otherCircle.radius - Math.sqrt((this.posX - otherCircle.posX) ** 2 + (this.posY - otherCircle.posY) ** 2);
            const offsetX = Math.cos(angle) * overlap / 2;
            const offsetY = Math.sin(angle) * overlap / 2;
            this.posX += offsetX;
            this.posY += offsetY;
            otherCircle.posX -= offsetX;
            otherCircle.posY -= offsetY;
        }
    }
}

let circles = [];
const circleCount = 10;

for (let i = 0; i < circleCount; i++) {
    let randomX = Math.random() * window_width;
    let randomY = Math.random() * window_height;
    let randomRadius = Math.floor(Math.random() * 50 + 20);
    let circle = new Circle(randomX, randomY, randomRadius, "blue", i.toString(), 3);
    circles.push(circle);
}

let updateCircles = function () {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach((circle, index) => {
        circle.update(ctx);
        for (let j = index + 1; j < circles.length; j++) {
            circle.handleCollision(circles[j]);
        }
    });
};

updateCircles();
