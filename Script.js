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

// 🔹 helper to draw rounded image on canvas
function drawRoundedImage(ctx, img, x, y, w, h, r) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
}

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
                    aspectRatio: 340 / 339,
                    autoCropArea: 1,
                    viewMode: 2,
                });
            }
        });

        options.classList.remove("hide");
        previewButton.classList.remove("hide");
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

    let resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = 340;
    resizedCanvas.height = 339;

    resizedCanvas.getContext("2d").drawImage(cropper.getCroppedCanvas({}), 0, 0, 340, 339);
    previewImage.src = resizedCanvas.toDataURL();
    previewImage.style.borderRadius = "20px"; // ✅ preview with rounded corners
    doneimageButton.style.display = "block"
});

window.onload = () => {
    options.classList.add("hide");
    previewButton.classList.add("hide");
};

// 🔹 Load image into canvas with rounded corners
function loadImage(imageSrc) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const staticImage = document.getElementById("static-image");
    const uploadedImage = document.getElementById("uploaded-image");

    const img = new Image();
    img.onload = function () {
        // Draw frame
        ctx.drawImage(staticImage, 0, 0, canvas.width, canvas.height);

        // Draw uploaded image with rounded corners
        drawRoundedImage(ctx, img, 638, 766, 330, 331, 20);

        uploadedImage.src = img.src;
        staticImage.style.display = "none";
        staticImage.style.objectFit = "cover";
    };

    img.src = imageSrc;
    canvas.style.display = "inline-block";
    document.getElementById("text-input").style.display = "inline-block";
}

document.querySelector('.btn-danger').addEventListener('click', function () {
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

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw static frame
    ctx.drawImage(staticImage, 0, 0, canvas.width, canvas.height);

    // Draw uploaded image with radius (if exists)
    if (uploadedImage.src) {
        drawRoundedImage(ctx, uploadedImage, 638, 766, 330, 331, 20);
    }

    // Draw text
    ctx.font = "bold 35px Arial";
    ctx.fillStyle = "white";

    if (textInput.length <= 8) {
        ctx.fillText(capitalize(textInput), 755, 1148);
    } else if (textInput.length <= 9) {
        ctx.fillText(capitalize(textInput), 750, 1148);
    } else if (textInput.length <= 15) {
        ctx.fillText(capitalize(textInput), 630, 1148);
    } else {
        ctx.fillText(capitalize(textInput), 650, 1148);
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
    a.download = "Khodaldham-Navratri.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}