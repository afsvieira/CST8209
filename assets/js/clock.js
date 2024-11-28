/*
 * Student Name: Antonio Felipe Souza Vieira
 * Student ID: 041-176-405
 * Course: CST8209 - Web Programming I
 * Semester: 1
 * Assignment: 4 – Calendar of Events – Part 4 
 * Date Submitted: November 28th, 2024
 */

/*
 * References:
 * MDN Web Docs. (n.d.). Basic animations using Canvas. Retrieved from
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
 * 
 * W3Schools. (n.d.). Canvas Clock. Retrieved from
 * https://www.w3schools.com/graphics/canvas_clock.asp
 */

// Select the canvas and get the context
const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');
const radius = canvas.height / 2;
ctx.translate(radius, radius);

// Adjust radius for scaling
const clockRadius = radius * 0.9;

function drawClock() {
  drawFace(ctx, clockRadius);
  drawNumbers(ctx, clockRadius);
  drawTime(ctx, clockRadius);
}

// Draw the clock face
function drawFace(ctx, radius) {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = radius * 0.05;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
  ctx.fillStyle = '#333';
  ctx.fill();
}

// Draw the numbers on the clock
function drawNumbers(ctx, radius) {
    const fontSize = radius * 0.15; 
    ctx.font = `${fontSize}px Arial`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
  
    for (let num = 1; num <= 12; num++) {
      const angle = (num * Math.PI) / 6; 
      const x = radius * 0.85 * Math.cos(angle - Math.PI / 2); 
      const y = radius * 0.85 * Math.sin(angle - Math.PI / 2);
      ctx.fillText(num, x, y);
    }
  }

// Draw the clock hands
function drawTime(ctx, radius) {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  // Hour hand
  const hourAngle = ((hour % 12) * Math.PI) / 6 + (minute * Math.PI) / 360;
  drawHand(ctx, hourAngle, radius * 0.5, radius * 0.07);

  // Minute hand
  const minuteAngle = (minute * Math.PI) / 30 + (second * Math.PI) / 1800;
  drawHand(ctx, minuteAngle, radius * 0.8, radius * 0.07);

  // Second hand
  const secondAngle = (second * Math.PI) / 30;
  drawHand(ctx, secondAngle, radius * 0.9, radius * 0.02, 'red');
}

// Helper to draw clock hands
function drawHand(ctx, angle, length, width, color = '#333') {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.strokeStyle = color;
  ctx.moveTo(0, 0);
  ctx.rotate(angle);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-angle);
}

// Update clock every second
setInterval(drawClock, 1000);

// Initial clock draw
drawClock();
