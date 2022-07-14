const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

let scale = 1.0;
let scaleMultiplier = 0.8;
let isMouseDown = false;

let isDragging = false;
let dragged = false;

let startDragOffset = {};

let startX;
let startY;

let allowPanning = false;
let currentCardIndex;

const translatePosition = {
    // x: canvas.width / 2,
    // y: canvas.height / 2
    x: 0,
    y: 0
};

const zoomIn = () => {
    scale /= scaleMultiplier;
    drawCards(scale, translatePosition);
}

const zoomOut = () => {
    scale *= scaleMultiplier;
    drawCards(scale, translatePosition);
}

const togglePanMode = () => {
    allowPanning = !allowPanning;
}

document.getElementById("plus").addEventListener("click", zoomIn, false);
document.getElementById("minus").addEventListener("click", zoomOut, false);
document.getElementById("pan-mode").addEventListener("click", togglePanMode, false);

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

    console.log('mouse down');

    isMouseDown = true;
    isDragging = false;
    dragged = false;

    // startX = e.clientX;
    // startY = e.clientY;

    startX = (e.clientX - translatePosition.x) / scale;
    startY = (e.clientY - translatePosition.y) / scale;

    startDragOffset.x = e.clientX - translatePosition.x;
    startDragOffset.y = e.clientY - translatePosition.y;

    const x = (e.clientX - translatePosition.x) / scale;
    const y = (e.clientY - translatePosition.y) / scale;

    const index = cards.findIndex(c => x > c.x && x < (c.x + c.width) && y > c.y && y < (c.y + c.height));

    if (index !== -1) {
        isDragging = true;
        currentCardIndex = index;
    }
}

const handleMouseUp = (e) => {
    console.log('mouse up');
    isMouseDown = false;
    isDragging = false;
}

const handleMouseover = (e) => {
    isMouseDown = false;
}

const handleMouseout = (e) => {
    isMouseDown = false;
    isDragging = false;
}

const handleMousemove = (e) => {
    if (isMouseDown && allowPanning) {
        panCanvas(e);
        return;
    }

    if (isDragging && currentCardIndex > -1) {

        // const mouseX = e.clientX;
        // const mouseY = e.clientY;

        const mouseX = (e.clientX - translatePosition.x) / scale;
        const mouseY = (e.clientY - translatePosition.y) / scale;

        const dx = mouseX - startX;
        const dy = mouseY - startY;

        const card = cards[currentCardIndex];

        card.x += dx;
        card.y += dy;

        drawCards(scale, translatePosition);

        startX = mouseX;
        startY = mouseY;

        dragged = true;

        return;

    }

}

const panCanvas = (e) => {
    translatePosition.x = e.clientX - startDragOffset.x;
    translatePosition.y = e.clientY - startDragOffset.y;
    drawCards(scale, translatePosition);
}

const handleClick = (e) => {
    console.log('mouse click');
    if (dragged || allowPanning) {
        return;
    }

    const x = (e.clientX - translatePosition.x) / scale;
    const y = (e.clientY - translatePosition.y) / scale;

    console.log("x,y", x + "," + y);
    console.log("scale", scale);

    const index = cards.findIndex(c => x > c.x && x < (c.x + c.width) && y > c.y && y < (c.y + c.height));

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

