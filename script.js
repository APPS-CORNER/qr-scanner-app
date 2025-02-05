document.getElementById("darkModeToggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

document.getElementById("generate-qr").addEventListener("click", function() {
    const qrText = document.getElementById("qr-text").value.trim();
    
    // Check if it's a valid URL
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\w .-]*)*\/?$/;
    if (qrText && !urlPattern.test(qrText) && !qrText.includes(" ")) {
        alert("Please enter a valid URL or text.");
        return;
    }

    const qrColor = document.getElementById("qr-color").value;
    const qrBgColor = document.getElementById("qr-bg-color").value;
    document.getElementById("qr-output").innerHTML = "";
    
    new QRCode(document.getElementById("qr-output"), {
        text: qrText,
        width: 128,
        height: 128,
        colorDark: qrColor,
        colorLight: qrBgColor
    });
});

document.getElementById("generate-location-qr").addEventListener("click", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const coords = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
            document.getElementById("qr-output").innerHTML = "";
            new QRCode(document.getElementById("qr-output"), {
                text: coords,
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff"
            });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

document.getElementById("start-scan").addEventListener("click", function() {
    const video = document.getElementById("qr-video");
    const qrScanner = new QrScanner(video, result => {
        document.getElementById("qr-result").textContent = result;
        addToHistory(result);
        if (result.startsWith("http")) {
            window.open(result, "_blank");
        }
    });
    qrScanner.start();
});

function addToHistory(qrData) {
    const historyList = document.getElementById("scan-history");
    const listItem = document.createElement("li");
    listItem.textContent = qrData;
    historyList.appendChild(listItem);
}

// Live search filter for scan history
document.getElementById("search-bar").addEventListener("input", function() {
    let filter = this.value.toLowerCase();
    let items = document.querySelectorAll("#scan-history li");
    items.forEach(item => {
        if (item.textContent.toLowerCase().includes(filter)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
});
