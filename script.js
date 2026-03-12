function val(id) {
    return Number(document.getElementById(id).value) || 0;
}

function calc() {
    let goldValue = val("goldWeight") * val("goldPrice");
    let silverValue = val("silverWeight") * val("silverPrice");

    let assets =
        goldValue +
        silverValue +
        val("cash") +
        val("bank") +
        val("loanGiven") +
        val("business") +
        val("property") +
        val("invest");

    let liabilities =
        val("loans") +
        val("mahr") +
        val("electric") +
        val("gas") +
        val("phone") +
        val("rent") +
        val("salary") +
        val("other");

    let net = assets - liabilities;
    let zakat = net > 0 ? net / 40 : 0;

    let silverNisab = val("silverPrice") * 612;
    let status = "Below Nisab";

    if (net >= silverNisab && silverNisab > 0) {
        status = "Above Nisab (Zakat Required)";
    }

    document.getElementById("assets").innerText = assets.toFixed(2);
    document.getElementById("liabilities").innerText = liabilities.toFixed(2);
    document.getElementById("net").innerText = net.toFixed(2);
    document.getElementById("zakat").innerText = zakat.toFixed(2);
    document.getElementById("nisab").innerText = status;
}

async function getMetalPrices() {
    try {
        let response = await fetch("https://api.metals.live/v1/spot");
        let data = await response.json();

        let goldData = data.find((m) => m.gold);
        let silverData = data.find((m) => m.silver);

        if (goldData && silverData) {
            document.getElementById("goldPrice").value = (goldData.gold / 31.1).toFixed(2);
            document.getElementById("silverPrice").value = (silverData.silver / 31.1).toFixed(2);
            calc();
            alert("✅ Live prices updated successfully!");
        } else {
            alert("⚠️ Could not fetch live prices. Please try again.");
        }
    } catch (e) {
        alert("❌ Error fetching live prices. Check your internet connection.");
        console.error(e);
    }
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    let assets = document.getElementById("assets").innerText;
    let liabilities = document.getElementById("liabilities").innerText;
    let net = document.getElementById("net").innerText;
    let zakat = document.getElementById("zakat").innerText;
    let nisab = document.getElementById("nisab").innerText;

    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Zakat Calculator Report", 20, 20);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    let yPosition = 40;
    const lineHeight = 8;

    doc.text("SUMMARY", 20, yPosition);
    yPosition += lineHeight + 2;

    doc.text(`Total Assets: ${assets}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Total Liabilities: ${liabilities}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Net Wealth: ${net}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Nisab Status: ${nisab}`, 20, yPosition);
    yPosition += lineHeight + 5;

    doc.setFillColor(102, 126, 234);
    doc.rect(0, yPosition - 5, 210, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("ZAKAT PAYABLE", 20, yPosition);

    yPosition += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.text(zakat, 20, yPosition);

    yPosition += 15;
    doc.setFontSize(10);
    doc.text("Generated on: " + new Date().toLocaleDateString(), 20, yPosition);

    doc.save("zakat-report.pdf");
    alert("✅ Zakat Report downloaded successfully!");
}