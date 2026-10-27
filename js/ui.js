// Page helpers shared by every level: feedback line, help and success dialogs.

function setFeedback(text, kind) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = text;
  feedback.className = "feedback " + (kind || "");
}

// Marks the level complete and congratulates the student in a dialog
// that links to the next level.
function showSuccess(level, text) {
  Progress.complete(level);
  const name = Progress.getName();
  document.getElementById("success-title").textContent = "Браво" + (name ? ", " + name : "") + "!";
  document.getElementById("success-text").textContent = text;
  setFeedback(text, "ok");
  document.getElementById("success-dialog").showModal();
}

document.getElementById("help-button").addEventListener("click", () => {
  document.getElementById("help-dialog").showModal();
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

showPlayerName();
