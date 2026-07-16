// Initialize QRCodeStyling once
let qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: "https://github.com",
    dotsOptions: {
        color: "#6366f1",
        type: "square"
    },
    backgroundOptions: {
        color: "#ffffff"
    },
    cornersSquareOptions: {
        color: "#6366f1",
        type: "square"
    },
    cornersDotOptions: {
        color: "#6366f1",
        type: "square"
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 6,
        imageSize: 0.3
    }
});

// Append canvas to container
qrCode.append(document.getElementById("qrcode"));

// Accordion Toggles
document.querySelectorAll(".accordion-trigger").forEach(trigger => {
    trigger.addEventListener("click", () => {
        const item = trigger.parentElement;
        const isActive = item.classList.contains("active");
        
        // Collapse all items
        document.querySelectorAll(".accordion-item").forEach(i => i.classList.remove("active"));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add("active");
        }
    });
});

// Helper: Generate Canvas-drawn presets to avoid CORS errors during download
function generatePresetLogo(name) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 64, 64);
    
    if (name === "github") {
        ctx.fillStyle = "#24292e";
        ctx.beginPath();
        ctx.arc(32, 32, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#ffffff";
        // Head
        ctx.beginPath();
        ctx.arc(32, 34, 13, 0, Math.PI * 2);
        ctx.fill();
        // Ears
        ctx.beginPath();
        ctx.moveTo(22, 26);
        ctx.lineTo(26, 16);
        ctx.lineTo(30, 24);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(42, 26);
        ctx.lineTo(38, 16);
        ctx.lineTo(34, 24);
        ctx.fill();
        // Base/body
        ctx.beginPath();
        ctx.ellipse(32, 47, 9, 7, 0, 0, Math.PI * 2);
        ctx.fill();
    } else if (name === "google") {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(32, 32, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = "bold 38px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#4285f4";
        ctx.fillText("G", 32, 32);
    } else if (name === "twitter") {
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(32, 32, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.lineTo(44, 44);
        ctx.moveTo(44, 20);
        ctx.lineTo(20, 44);
        ctx.stroke();
    } else if (name === "linkedin") {
        ctx.fillStyle = "#0077b5";
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(4, 4, 56, 56, 10);
        } else {
            ctx.rect(4, 4, 56, 56);
        }
        ctx.fill();
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 32px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("in", 32, 29);
    } else if (name === "instagram") {
        const grad = ctx.createLinearGradient(0, 64, 64, 0);
        grad.addColorStop(0, "#f9ce34");
        grad.addColorStop(0.5, "#ee2a7b");
        grad.addColorStop(1, "#6228d7");
        ctx.fillStyle = grad;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(4, 4, 56, 56, 14);
        } else {
            ctx.rect(4, 4, 56, 56);
        }
        ctx.fill();
        
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(16, 16, 32, 32, 8);
        } else {
            ctx.rect(16, 16, 32, 32);
        }
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(32, 32, 7, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(41, 23, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    return canvas.toDataURL("image/png");
}

// Global active custom logo data URL
let uploadedLogoDataUrl = null;

// Trigger QR Code updates dynamically
function updateQR() {
    const textInput = document.getElementById("url");
    const text = textInput.value.trim() || " ";
    
    // 1. Shapes
    const dotType = document.querySelector("#dotTypeGrid .option-btn.active").dataset.value;
    const cornerSquareType = document.querySelector("#cornerSquareTypeGrid .option-btn.active").dataset.value;
    const cornerDotType = document.querySelector("#cornerDotTypeGrid .option-btn.active").dataset.value;
    
    // 2. Colors
    const dotsColor = document.getElementById("dotsColor").value;
    const transparentBg = document.getElementById("transparentBg").checked;
    const bgColor = transparentBg ? "transparent" : document.getElementById("bgColor").value;
    
    const matchCorners = document.getElementById("customCornerColors").checked;
    const cornerSquareColor = matchCorners ? dotsColor : document.getElementById("cornerSquareColor").value;
    const cornerDotColor = matchCorners ? dotsColor : document.getElementById("cornerDotColor").value;
    
    // 3. Logo
    const activeLogoBtn = document.querySelector(".logo-btn.active");
    const logoType = activeLogoBtn ? activeLogoBtn.dataset.logo : "none";
    let logoUrl = null;
    
    const sizeGroup = document.getElementById("logoSizeGroup");
    
    if (logoType === "custom" && uploadedLogoDataUrl) {
        logoUrl = uploadedLogoDataUrl;
        sizeGroup.style.display = "block";
    } else if (logoType !== "none" && logoType !== "custom") {
        logoUrl = generatePresetLogo(logoType);
        sizeGroup.style.display = "block";
    } else {
        sizeGroup.style.display = "none";
    }
    
    const logoSize = parseFloat(document.getElementById("logoSize").value);
    
    // Apply styling options
    const newOptions = {
        data: text,
        dotsOptions: {
            type: dotType,
            color: dotsColor
        },
        backgroundOptions: {
            color: bgColor
        },
        cornersSquareOptions: {
            type: cornerSquareType,
            color: cornerSquareColor
        },
        cornersDotOptions: {
            type: cornerDotType,
            color: cornerDotColor
        },
        image: logoUrl,
        imageOptions: {
            imageSize: logoSize,
            margin: 6
        }
    };
    
    qrCode.update(newOptions);
}

// Set up UI Event Listeners for Live Updates
// 1. Text input updates live
document.getElementById("url").addEventListener("input", updateQR);

// 2. Button group option selectors (shapes)
const setupOptionGrid = (gridId) => {
    const grid = document.getElementById(gridId);
    grid.querySelectorAll(".option-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            grid.querySelectorAll(".option-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            updateQR();
        });
    });
};
setupOptionGrid("dotTypeGrid");
setupOptionGrid("cornerSquareTypeGrid");
setupOptionGrid("cornerDotTypeGrid");

// 3. Color updates & dynamic Hex labels
const setupColorPicker = (pickerId) => {
    const picker = document.getElementById(pickerId);
    const label = picker.nextElementSibling;
    picker.addEventListener("input", () => {
        label.textContent = picker.value.toUpperCase();
        updateQR();
    });
};
setupColorPicker("dotsColor");
setupColorPicker("bgColor");
setupColorPicker("cornerSquareColor");
setupColorPicker("cornerDotColor");

// 4. Transparent background toggle
const transCheckbox = document.getElementById("transparentBg");
const bgColorInput = document.getElementById("bgColor");
transCheckbox.addEventListener("change", () => {
    const wrapper = bgColorInput.closest(".color-input-wrapper");
    if (transCheckbox.checked) {
        wrapper.style.opacity = "0.5";
        wrapper.style.pointerEvents = "none";
    } else {
        wrapper.style.opacity = "1";
        wrapper.style.pointerEvents = "auto";
    }
    updateQR();
});

// 5. Match corner colors toggle
const matchCornersCheckbox = document.getElementById("customCornerColors");
const cornerColorsPanel = document.getElementById("cornerColorsPanel");
matchCornersCheckbox.addEventListener("change", () => {
    if (matchCornersCheckbox.checked) {
        cornerColorsPanel.style.display = "none";
    } else {
        cornerColorsPanel.style.display = "grid";
    }
    updateQR();
});

// 6. Preset Palettes
document.querySelectorAll(".palette-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const dotsColor = btn.dataset.dots;
        const bgColor = btn.dataset.bg;
        
        // Update picker inputs
        document.getElementById("dotsColor").value = dotsColor;
        document.getElementById("dotsColor").nextElementSibling.textContent = dotsColor.toUpperCase();
        
        if (bgColor === "transparent") {
            transCheckbox.checked = true;
            bgColorInput.closest(".color-input-wrapper").style.opacity = "0.5";
            bgColorInput.closest(".color-input-wrapper").style.pointerEvents = "none";
        } else {
            transCheckbox.checked = false;
            bgColorInput.value = bgColor;
            bgColorInput.nextElementSibling.textContent = bgColor.toUpperCase();
            bgColorInput.closest(".color-input-wrapper").style.opacity = "1";
            bgColorInput.closest(".color-input-wrapper").style.pointerEvents = "auto";
        }
        
        updateQR();
    });
});

// 7. Logo Preset Buttons
const logoBtnGrid = document.querySelector(".logo-preset-grid");
logoBtnGrid.querySelectorAll(".logo-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        logoBtnGrid.querySelectorAll(".logo-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        updateQR();
    });
});

// 8. Logo size slider
const sizeSlider = document.getElementById("logoSize");
const sizeValLabel = document.getElementById("logoSizeVal");
sizeSlider.addEventListener("input", () => {
    sizeValLabel.textContent = `${Math.round(parseFloat(sizeSlider.value) * 100)}%`;
    updateQR();
});

// 9. Custom Logo Upload Handlers
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("logoUpload");
const previewContainer = document.getElementById("logoPreviewContainer");
const previewImg = document.getElementById("logoPreview");
const fileNameLabel = document.getElementById("logoFileName");

// Trigger file open
dropZone.addEventListener("click", () => fileInput.click());

// Drag-n-drop states
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});
dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) {
        handleLogoFile(e.dataTransfer.files[0]);
    }
});

// File input selection
fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        handleLogoFile(fileInput.files[0]);
    }
});

function handleLogoFile(file) {
    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedLogoDataUrl = e.target.result;
        
        // Show preview
        previewImg.src = uploadedLogoDataUrl;
        fileNameLabel.textContent = file.name;
        previewContainer.style.display = "flex";
        
        // Highlight custom option
        logoBtnGrid.querySelectorAll(".logo-btn").forEach(b => b.classList.remove("active"));
        
        // Check if there is already a custom button; if not, create one or reuse active states
        let customBtn = logoBtnGrid.querySelector("[data-logo='custom']");
        if (!customBtn) {
            customBtn = document.createElement("button");
            customBtn.className = "logo-btn";
            customBtn.dataset.logo = "custom";
            customBtn.textContent = "Custom";
            // Insert custom button into grid before none or at the end
            logoBtnGrid.appendChild(customBtn);
            
            customBtn.addEventListener("click", () => {
                logoBtnGrid.querySelectorAll(".logo-btn").forEach(b => b.classList.remove("active"));
                customBtn.classList.add("active");
                updateQR();
            });
        }
        customBtn.classList.add("active");
        
        updateQR();
    };
    reader.readAsDataURL(file);
}

// Remove Custom Logo Handler
document.getElementById("removeLogoBtn").addEventListener("click", () => {
    uploadedLogoDataUrl = null;
    previewContainer.style.display = "none";
    fileInput.value = "";
    
    // Remove custom button if it exists
    const customBtn = logoBtnGrid.querySelector("[data-logo='custom']");
    if (customBtn) {
        customBtn.remove();
    }
    
    // Set logo to none
    logoBtnGrid.querySelectorAll(".logo-btn").forEach(b => b.classList.remove("active"));
    logoBtnGrid.querySelector("[data-logo='none']").classList.add("active");
    
    updateQR();
});

// 10. Export Functions
document.getElementById("downloadBtn").addEventListener("click", () => {
    const filename = document.getElementById("fileName").value.trim() || "qrcode";
    const extension = document.getElementById("exportFormat").value;
    
    qrCode.download({
        name: filename,
        extension: extension
    });
});

// 11. Copy to Clipboard
document.getElementById("copyBtn").addEventListener("click", () => {
    const canvas = document.querySelector("#qrcode canvas");
    if (!canvas) {
        alert("QR Code has not been generated as canvas.");
        return;
    }
    
    try {
        canvas.toBlob((blob) => {
            if (!blob) {
                alert("Failed to extract image blob.");
                return;
            }
            
            navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
            ]).then(() => {
                showToast("Copied to clipboard!");
            }).catch(err => {
                console.error("Clipboard write error", err);
                alert("Failed to copy image automatically. Try downloading it instead.");
            });
        }, "image/png");
    } catch (e) {
        console.error("toBlob error", e);
        alert("Failed to copy. If transparency is enabled or a custom logo is used, security policies may block copy. Please use download instead.");
    }
});

// Toast notification helper
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Initial draw
updateQR();
