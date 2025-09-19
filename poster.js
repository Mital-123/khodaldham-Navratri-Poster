
let fileInput = document.getElementById("file");
let imagecrop = document.getElementById("image");
const previewButton = document.getElementById("preview");
const doneimageButton = document.getElementById("doneimage");
const previewImage = document.getElementById("preview-image");
const options = document.querySelector(".options");
const widthInput = document.getElementById("width-input");
const heightInput = document.getElementById("height-input");
let cropper = "";
let fileName = "";

fileInput.onchange = () => {
  previewImage.src = "";
  heightInput.value = 340;
  widthInput.value = 339;

  let reader = new FileReader();
  reader.readAsDataURL(fileInput.files[0]);

  reader.onload = () => {
    imagecrop.setAttribute("src", reader.result);
    if (cropper) {
      cropper.destroy();
    }
    document.getElementById('staticBackdrop').addEventListener('shown.bs.modal', function () {
    if (cropper) {
        cropper.replace(imagecrop.getAttribute('src'));
    } else {
        cropper = new Cropper(imagecrop, {
            aspectRatio: 340 / 339, // Update with the aspect ratio
            autoCropArea: 1,
            viewMode: 2,
        });
    }
});

    options.classList.remove("hide");
    previewButton.classList.remove("hide");
    // doneimageButton.classList.remove("hide");
    const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
  modal.show();
};
  fileName = fileInput.files[0].name.split(".")[0];
};

heightInput.addEventListener("input", () => {
  const newHeight = parseInt(heightInput.value);
  cropper.setCropBoxData({ height: newHeight });
});

widthInput.addEventListener("input", () => {
  const newWidth = parseInt(widthInput.value);
  cropper.setCropBoxData({ width: newWidth });
});

previewButton.addEventListener("click", (e) => {
  e.preventDefault();

  let imgSrc = cropper.getCroppedCanvas({}).toDataURL();
  let resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = 340;
  resizedCanvas.height = 339;

  resizedCanvas.getContext("2d").drawImage(cropper.getCroppedCanvas({}), 0, 0, 340, 339);
  previewImage.src = resizedCanvas.toDataURL();
  doneimageButton.style.display="block"
});

window.onload = () => {
  options.classList.add("hide");
  previewButton.classList.add("hide");

  // doneimageButton.classList.remove("hide");
};

function loadImage(imageSrc) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const staticImage = document.getElementById("static-image");
  const uploadedImage = document.getElementById("uploaded-image");

  const img = new Image();
  img.onload = function () {
      ctx.drawImage(staticImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 711, 820.5, 320, 351);
      uploadedImage.src = img.src;
      staticImage.style.display = "none";
      staticImage.style.objectFit = "cover";
  };

  img.src = imageSrc;
  canvas.style.display = "inline-block";
  document.getElementById("text-input").style.display = "inline-block";
}

document.querySelector('.btn-danger').addEventListener('click', function() {
  const previewSrc = document.getElementById('preview-image').src;
  loadImage(previewSrc);
});

function renderText() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const textInput = document.getElementById("text-input").value.toLowerCase();
  const capitalize = (text) => {
    let splitStr = textInput.split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);  
    }
    return splitStr.join(' ')
  }

  const uploadedImage = document.getElementById("uploaded-image");
  const staticImage = document.getElementById("static-image");

  // Clear previous text
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the static image
  ctx.drawImage(staticImage, 0, 0, canvas.width, canvas.height);

  // Draw the uploaded image
  ctx.drawImage(uploadedImage,  711, 820.5, 320, 351);

  // Set font style and position
  ctx.font = "bold 30px Arial";
  ctx.fillStyle = "#000";

if(textInput.length <= 7){
  const textX = 805; // X coordinate
  const textY = 1252; // Y coordinate
  ctx.fillText(capitalize(textInput), textX, textY);
}else if(textInput.length <= 9){
  const textX = 810; // X coordinate
  const textY = 1252; // Y coordinate
  ctx.fillText(capitalize(textInput), textX, textY);
}else if(textInput.length <= 12){
  const textX = 700; // X coordinate
  const textY = 1252; // Y coordinate
  ctx.fillText(capitalize(textInput), textX, textY);
}
else{
 // Adjust these coordinates to position the text over the image correctly
 const textX = 700; // X coordinate
  const textY = 1252; // Y coordinate
  ctx.fillText(capitalize(textInput), textX, textY);
}

  const nameError = document.getElementById("name-error");
  if (textInput.length >= 18) {
    nameError.style.display = "block";
  } else {
    nameError.style.display = "none";
  }
}

function downloadImage() {
  const canvas = document.getElementById("canvas");
  const dataURL = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "viranjaliblood-donation.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
