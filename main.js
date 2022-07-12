const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

let scale = 1.0;
let scaleMultiplier = 0.8;
let isMouseDown = false;
let isDragging = false;
let startDragOffset = {};

let startX;
let startY;

const translatePosition = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

const zoomIn = () => {
    scale /= scaleMultiplier;
    drawCards(scale, translatePosition);
}

const zoomOut = () => {
    scale *= scaleMultiplier;
    drawCards(scale, translatePosition);
}

document.getElementById("plus").addEventListener("click", zoomIn, false);
document.getElementById("minus").addEventListener("click", zoomOut, false);

// set the canvas to the size of the window
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;
canvas.style.border = "5px solid red";

const cards = [
    {
        x: 0, y: 0, width: 200, height: 100, color: 'orange', type: 'color'
    },
    {
        x: 200, y: 100, width: 200, height: 100, color: 'blue', type: 'color'
    },
    {
        x: 400, y: 200, width: 200, height: 100, color: 'red', type: 'color'
    },
    {
        x: 0,
        y: 300,
        width: 200,
        height: 100,
        url: 'https://www.tutorialspoint.com/images/seaborn-4.jpg?v=2',
        type: 'image'
    }
];

const handleMouseDown = (e) => {
    isMouseDown = true;
    isDragging = false;
    
    startDragOffset.x = e.clientX - translatePosition.x;
    startDragOffset.y = e.clientY - translatePosition.y;
}

const handleMouseUp = (e) => {
    isMouseDown = false;
}

const handleMouseover = (e) => {
    isMouseDown = false;
}

const handleMouseout = (e) => {
    isMouseDown = false;
}

const handleMousemove = (e) => {
    isDragging = isMouseDown;
    if (isMouseDown) {
        translatePosition.x = e.clientX - startDragOffset.x;
        translatePosition.y = e.clientY - startDragOffset.y;
        drawCards(scale, translatePosition);
    }
}

const handleClick = (e) => {
    if (isDragging) {
        return;
    }

    const x = (e.clientX - translatePosition.x) / scale;
    const y = (e.clientY - translatePosition.y) / scale;

    console.log("x,y", x + "," + y);
    console.log("scale", scale);

    const index = cards.findIndex(c => x > c.x && x < (c.x + c.width) && y > c.y && y < (c.y + c.height));
    debugger;
    if (index > -1) {
        const color = cards[index].color;
        alert('clicked  ' + color);
    }
}

canvas.addEventListener('mousedown', handleMouseDown, false);
canvas.addEventListener('mouseup', handleMouseUp, false);
canvas.addEventListener('mouseover', handleMouseover, false);
canvas.addEventListener('mouseout', handleMouseout, false);
canvas.addEventListener('mousemove', handleMousemove, false);
canvas.addEventListener('click', handleClick, false);

const drawCards = (scaleValue, translatePos) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(translatePos.x, translatePos.y);
    context.scale(scaleValue, scaleValue);

    for (const card of cards) {

        switch (card.type) {
            case 'color':
                drawColorCards(card);
                break;

            case 'image':
                // drawImageCards(card, scaleValue);
                break;

            default:
                break;
        }

        // context.setLineDash([4]);
        // context.strokeRect(card.x - 5, card.y - 5, card.width + 10, card.height + 10);
    }

    context.restore();
}

const drawColorCards = (card) => {
    context.fillStyle = card.color;
    context.fillRect(card.x, card.y, card.width, card.height);
}

const drawImageCards = (card, scaleValue) => {
    const img = new Image();
    img.onload = function () {
        context.drawImage(img, card.x, card.y, card.width, card.height);
    };
    img.src = 'https://www.tutorialspoint.com/images/seaborn-4.jpg?v=2';
}

drawCards(scale, translatePosition);

