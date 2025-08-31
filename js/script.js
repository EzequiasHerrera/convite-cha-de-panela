const invitation = document.getElementById("invitation-card")
const overlay = document.getElementById("overlay");

const toggleFocusView = () => {
    invitation.classList.toggle("focus-view");
    invitation.classList.toggle("zoom-in");
    overlay.classList.toggle("d-none");
}

invitation.onclick = toggleFocusView;
overlay.onclick = toggleFocusView;