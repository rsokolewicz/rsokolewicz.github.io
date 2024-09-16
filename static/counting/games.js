// tabControl.js

function openGame(evt, gameName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(gameName).style.display = "block";
    evt.currentTarget.className += " active";

    // Initialize games based on the tab clicked
    if (gameName === "NumberGuess") {
        startNumberGuessGame();
    } else if (gameName === "Arithmetic") {
        // Call initialization function for Arithmetic game if needed
        startArithmeticGame(); // Uncomment or add the relevant function if needed
    }
}

// Ensure the first tab is opened by default when the page loads
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.tablinks').click(); // Automatically click the first tab
});
