function calculateLoadTime() {
    return window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
}

function displayStatistics() {
    let footer = document.getElementById("footer-statistic");
    let loadTime = calculateLoadTime();

    footer.innerText = "Время загрузки страницы: " + loadTime + " мс";
}

window.addEventListener("load", displayStatistics);