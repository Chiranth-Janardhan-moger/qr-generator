function generateQR() {
    const urlInput = document.getElementById("url");
    const url = urlInput.value.trim();
    const qrWrapper = document.getElementById("qrWrapper");
    const qrcodeDiv = document.getElementById("qrcode");
    const btnSpan = document.querySelector("#generateBtn span");
    const btnIcon = document.querySelector("#generateBtn svg");

    if (url === "") {
        urlInput.style.borderColor = "#ef4444";
        urlInput.style.animation = "shake 0.4s ease";
        setTimeout(() => {
            urlInput.style.animation = "";
            urlInput.style.borderColor = "var(--border)";
        }, 400);
        return;
    }

    // Reset styles
    urlInput.style.borderColor = "var(--border)";
    
    // UI Loading state
    btnSpan.textContent = "Generating...";
    btnIcon.style.display = "none";
    document.getElementById("generateBtn").style.opacity = "0.7";
    document.getElementById("generateBtn").style.pointerEvents = "none";

    setTimeout(() => {
        // Clear previous QR
        qrcodeDiv.innerHTML = "";
        
        // Generate new QR
        new QRCode(qrcodeDiv, {
            text: url,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Show result with animation
        qrWrapper.style.display = "flex";
        
        // Reset button
        btnSpan.textContent = "Generate QR Code";
        btnIcon.style.display = "block";
        document.getElementById("generateBtn").style.opacity = "1";
        document.getElementById("generateBtn").style.pointerEvents = "auto";
    }, 400);
}

function downloadQR() {
    const qrCanvas = document.querySelector("#qrcode canvas");
    if (qrCanvas) {
        const imageURI = qrCanvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = imageURI;
        downloadLink.download = "qrcode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}

// Handle Enter key
document.getElementById("url").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        generateQR();
    }
});

// Add shake animation to document
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
}`;
document.head.appendChild(style);
