// Level 1: fill the address column of the empty 16-cell RAM with 0..15.
const RAM_SIZE = 16;

const ramBody = document.getElementById("ram-body");
const feedback = document.getElementById("feedback");
const inputs = [];

for (let i = 0; i < RAM_SIZE; i++) {
  const row = document.createElement("tr");

  const addressCell = document.createElement("td");
  addressCell.className = "address";
  const input = document.createElement("input");
  input.type = "text";
  input.inputMode = "numeric";
  input.maxLength = 2;
  input.setAttribute("aria-label", "Адрес на клетка " + (i + 1));
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");
    addressCell.classList.remove("correct", "wrong");
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault();
      if (i + 1 < RAM_SIZE) inputs[i + 1].focus();
      else checkAnswers();
    } else if (event.key === "ArrowUp" && i > 0) {
      event.preventDefault();
      inputs[i - 1].focus();
    }
  });
  addressCell.appendChild(input);
  inputs.push(input);

  const contentCell = document.createElement("td");
  contentCell.className = "content";

  row.appendChild(addressCell);
  row.appendChild(contentCell);
  ramBody.appendChild(row);
}

function setFeedback(text, kind) {
  feedback.textContent = text;
  feedback.className = "feedback " + kind;
}

function checkAnswers() {
  let empty = 0;
  let wrong = 0;

  inputs.forEach((input, i) => {
    const cell = input.parentElement;
    cell.classList.remove("correct", "wrong");
    if (input.value === "") {
      empty++;
    } else if (Number(input.value) === i) {
      cell.classList.add("correct");
    } else {
      cell.classList.add("wrong");
      wrong++;
    }
  });

  if (empty === 0 && wrong === 0) {
    const name = Progress.getName();
    setFeedback(
      "Браво" + (name ? ", " + name : "") + "! Всички 16 адреса са верни. Ниво 1 е завършено!",
      "ok"
    );
    Progress.complete(1);
    inputs.forEach((input) => (input.disabled = true));
    document.getElementById("check-button").disabled = true;
    document.getElementById("next").hidden = false;
  } else if (wrong > 0) {
    const text = wrong === 1 ? "Има 1 грешен адрес" : "Има " + wrong + " грешни адреса";
    setFeedback(text + " (в червено). Опитай пак!", "error");
  } else {
    setFeedback(empty === 1 ? "Остава 1 празна клетка." : "Остават " + empty + " празни клетки.", "error");
  }
}

function clearAnswers() {
  inputs.forEach((input) => {
    input.value = "";
    input.disabled = false;
    input.parentElement.classList.remove("correct", "wrong");
  });
  document.getElementById("check-button").disabled = false;
  document.getElementById("next").hidden = true;
  setFeedback("", "");
  inputs[0].focus();
}

document.getElementById("check-button").addEventListener("click", checkAnswers);
document.getElementById("clear-button").addEventListener("click", clearAnswers);

showPlayerName();
inputs[0].focus();
