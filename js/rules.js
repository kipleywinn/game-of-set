"use strict";
///////////////// BUILD SHAPES (got a lot of internet help with this one, I do not understand canvas drawing at all
function buildShapes(count, color, shading, shape) {
  // Create and configure canvas
  const canvas = document.createElement('canvas');
  canvas.width = 210;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');

  // Canvas center
  const centerY = canvas.height / 2;

  // Dynamically calculate shape size and spacing
  const margin = 2; // Margin on both sides
  const shapeSize = canvas.height * 0.6; // Shape size is 60% of canvas height
  const totalShapesWidth = count * shapeSize; // Total width occupied by shapes
  const totalAvailableSpace = canvas.width - (2 * margin) - totalShapesWidth; // Space for gaps between shapes
  let padding = 0;

  switch (count) {
    case 1:
      // For 1 shape, center it by dividing the space in half
      padding = totalAvailableSpace / 2;
      break;
    case 2:
      // For 2 shapes, define custom logic for spacing
      // Ensure they are evenly spaced with some room on either side
      padding = totalAvailableSpace / 3; // Divides the space into 3 sections for better spacing
      break;
    default:
      // For 3 or more shapes, divide the space by (count - 1) for equal gaps
      padding = totalAvailableSpace / (count - 1);
      break;
  }

  // Adjust the start position to center the shapes
  const startX = (canvas.width - totalShapesWidth - (padding * (count - 1))) / 2 + shapeSize / 2;

  // Function to draw a shape
  const drawShape = (type, x, y, size, color, shading) => {
    ctx.beginPath();

    // Define shapes (same as before)
    if (type === 'circle') {
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    } else if (type === 'triangle') {
      const adjustment = 1.5 // Adjust this value if needed
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x - size / 2, y + size / 2 - adjustment); // Adjusted
      ctx.lineTo(x + size / 2, y + size / 2 - adjustment); // Adjusted
      ctx.closePath();
    } else if (type === 'square') {
      const adjustment = 1.5; // Adjust this value if needed
      ctx.rect(x - size / 2, y - size / 2, size, size - adjustment); // Adjusted
    }

    if (shading === 'striped') {
      ctx.fillStyle = color; // Fill the shape FIRST
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();//draw the outline

      ctx.save(); // Save context before clipping
      ctx.beginPath(); // New path for clipping
      //Redraw the shape for clipping
      if (type === 'circle') {
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      } else if (type === 'triangle') {
        ctx.moveTo(x, y - size / 2);
        ctx.lineTo(x - size / 2, y + size / 2);
        ctx.lineTo(x + size / 2, y + size / 2);
        ctx.closePath();
      } else if (type === 'square') {
        ctx.rect(x - size / 2, y - size / 2, size, size);
      }
      ctx.clip(); // Clip to the shape

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      const stripeOffset = 1.5;
      for (let i = -size / 2 + stripeOffset; i < size / 2; i += 5) {
        ctx.beginPath();
        ctx.moveTo(x - size / 2, y + i);
        ctx.lineTo(x + size / 2, y + i);
        ctx.stroke();
      }
      ctx.restore(); // Restore context after clipping
    } else if (shading === 'empty') {
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();
    } else {
      ctx.fillStyle = color;
      ctx.fill();
    }
  };

  // Draw shapes evenly spaced across the canvas
  for (let i = 0; i < count; i++) {
    const x = startX + i * (shapeSize + padding);
    drawShape(shape, x, centerY, shapeSize, color, shading);
  }

  return canvas;
}

const pink = "#ee0276";
const green = "#02b008";
const purple = "#aa02ec";

const colorArray = [pink, green, purple];
const shapeArray = ["circle", "square", "triangle"];
const shadingArray = ["solid", "striped", "empty"];

const numberProp = document.querySelector("#numberProp");
const colorProp = document.querySelector("#colorProp");
const shapeProp = document.querySelector("#shapeProp");
const shadingProp = document.querySelector("#shadingProp");

/////// NUMBER property cards
for (let i = 1; i <= 3; i++) {
  const cardCanvas = buildShapes(i, pink, "solid", "circle");
  const fullCardDiv = document.createElement('div');
  fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
  numberProp.appendChild(fullCardDiv); // Append the div to the parent
}

/////// COLOR property cards
for (let i = 1; i <= 3; i++) {
  const cardCanvas = buildShapes(2, colorArray[i-1], "solid", "triangle");
  const fullCardDiv = document.createElement('div');
  fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
  colorProp.appendChild(fullCardDiv); // Append the div to the parent
}

/////// SHAPE property cards
for (let i = 1; i <= 3; i++) {
  const cardCanvas = buildShapes(3, green, "striped", shapeArray[i-1]);
  const fullCardDiv = document.createElement('div');
  fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
  shapeProp.appendChild(fullCardDiv); // Append the div to the parent
}

/////// SHADING property cards
for (let i = 1; i <= 3; i++) {
  const cardCanvas = buildShapes(1, purple, shadingArray[i-1], "square");
  const fullCardDiv = document.createElement('div');
  fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
  shadingProp.appendChild(fullCardDiv); // Append the div to the parent
}


const example1a = document.querySelector("#example1a");
const example1b = document.querySelector("#example1b");
const example2a = document.querySelector("#example2a");
const example2b = document.querySelector("#example2b");
const example3a = document.querySelector("#example3a");
const example3b = document.querySelector("#example3b");


function drawExampleCard(exampleNum) {
  let number = Number(document.querySelector(`#number${exampleNum}`).value);
  let color = colorArray[document.querySelector(`#color${exampleNum}`).value];
  let shading = shadingArray[document.querySelector(`#shading${exampleNum}`).value];
  let shape = shapeArray[document.querySelector(`#shape${exampleNum}`).value];

  document.querySelector(`#example${exampleNum}b`).innerHTML = "";

  function drawTheCardAlready(number, color, shading, shape) {
    const cardCanvas = buildShapes(number, color, shading, shape);
    const fullCardDiv = document.createElement('div');
    fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
    document.querySelector(`#example${exampleNum}b`).appendChild(fullCardDiv); // Append the div to the parent
  }

drawTheCardAlready(number, color, shading, shape);
}

function checkExample(exampleNum) {
  let number = Number(document.querySelector(`#number${exampleNum}`).value);
  let color = colorArray[document.querySelector(`#color${exampleNum}`).value];
  let shading = shadingArray[document.querySelector(`#shading${exampleNum}`).value];
  let shape = shapeArray[document.querySelector(`#shape${exampleNum}`).value];

  document.querySelector(`#checkMessage${exampleNum}`).innerHTML = "";

  switch (exampleNum) {
    case 1:
      document.querySelector(`#checkMessage${exampleNum}`).classList.remove("hidden");
      if (number === 1 && color === green && shading === "striped" && shape === "square") {
        document.querySelector(`#checkMessage${exampleNum}`).innerHTML = `<p>Congrats! You built the correct card to complete this set.</p>`;
      } else {
        document.querySelector(`#checkMessage${exampleNum}`).innerHTML = `<p>Sorry! That's not the right card. Try another variation!</p>`;
      }
        break;
    case 2:
      document.querySelector(`#checkMessage${exampleNum}`).classList.remove("hidden");
      if (number === 2 && color === green && shading === "empty" && shape === "square") {
        document.querySelector(`#checkMessage${exampleNum}`).innerHTML = `<p>Congrats! You built the correct card to complete this set.</p>`;
      } else {
        document.querySelector(`#checkMessage${exampleNum}`).innerHTML = `<p>Sorry! That's not the right card. Try another variation!</p>`;
      }
      break;
    case 3:
      document.querySelector(`#checkMessage${exampleNum}`).classList.remove("hidden");
      if (number === 2 && color === purple && shading === "striped" && shape === "triangle") {
        document.querySelector(`#checkMessage${exampleNum}`).innerHTML = `<p>Congrats! You built the correct card to complete this set.</p>`;
      } else {
        document.querySelector(`#checkMessage${exampleNum}`).innerHTML = `<p>Sorry! That's not the right card. Try another variation!</p>`;
      }
      break;
    default:
      document.querySelector(`#checkMessage${exampleNum}`).innerHTML = "";
  }

}

// const example1CheckButton = document.querySelector("#checkExample1");
// example1CheckButton.addEventListener("click", checkExample(1));



//// Example 1 Cards
{
  const cardCanvas = buildShapes(3, green, "striped", "circle");
  const fullCardDiv = document.createElement('div');
  fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
  example1a.appendChild(fullCardDiv); // Append the div to the parent
}
{
  const cardCanvas = buildShapes(2, green, "striped", "triangle");
  const fullCardDiv = document.createElement('div');
  fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
  example1a.appendChild(fullCardDiv); // Append the div to the parent
}
//// Example 2 Cards
{
  const cardCanvas = buildShapes(2, purple, "striped", "circle");
  const fullCardDiv = document.createElement('div');
  fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
  example2a.appendChild(fullCardDiv); // Append the div to the parent
}
{
  const cardCanvas = buildShapes(2, pink, "solid", "triangle");
  const fullCardDiv = document.createElement('div');
  fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
  example2a.appendChild(fullCardDiv); // Append the div to the parent
}
//// Example 3 Cards
{
  const cardCanvas = buildShapes(3, pink, "empty", "square");
  const fullCardDiv = document.createElement('div');
  fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
  example3a.appendChild(fullCardDiv); // Append the div to the parent
}
{
  const cardCanvas = buildShapes(1, green, "solid", "circle");
  const fullCardDiv = document.createElement('div');
  fullCardDiv.appendChild(cardCanvas); // Append the canvas to the div
  example3a.appendChild(fullCardDiv); // Append the div to the parent
}


example1b.addEventListener("load", drawExampleCard(1));
example2b.addEventListener("load", drawExampleCard(2));
example3b.addEventListener("load", drawExampleCard(3));
