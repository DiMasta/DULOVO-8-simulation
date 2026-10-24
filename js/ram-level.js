// Shared logic for levels where the student fills the RAM's address column.
//
// options:
//   level       - level number, marked complete in Progress on success
//   maxLength   - max characters per address input
//   filter      - regex of characters to strip while typing
//   isCorrect   - (value, index) => boolean
//   showDecimal - show the decimal address next to each row as a helper
//   hint        - optional (values) => extra text shown when answers are wrong
const RAM_SIZE = 16;

function setupRamLevel(options) {
  const ramBody = document.getElementById("ram-body");
  const feedback = document.getElementById("feedback");
  const checkButton = document.getElementById("check-button");
  const next = document.getElementById("next");
  const inputs = [];

  for (let i = 0; i < RAM_SIZE; i++) {
    const row = document.createElement("tr");

    if (options.showDecimal) {
      const decimalCell = document.createElement("td");
      decimalCell.className = "decimal";
      decimalCell.textContent = i;
      row.appendChild(decimalCell);
    }

    const addressCell = document.createElement("td");
    addressCell.className = "address";
    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "numeric";
    input.maxLength = options.maxLength;
    input.setAttribute("aria-label", "Адрес на клетка " + (i + 1));
    input.addEventListener("input", () => {
      input.value = input.value.replace(options.filter, "");
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
      } else if (options.isCorrect(input.value, i)) {
        cell.classList.add("correct");
      } else {
        cell.classList.add("wrong");
        wrong++;
      }
    });

    if (empty === 0 && wrong === 0) {
      const name = Progress.getName();
      setFeedback(
        "Браво" + (name ? ", " + name : "") + "! Всички 16 адреса са верни. Ниво " +
          options.level + " е завършено!",
        "ok"
      );
      Progress.complete(options.level);
      inputs.forEach((input) => (input.disabled = true));
      checkButton.disabled = true;
      next.hidden = false;
    } else if (wrong > 0) {
      let text = wrong === 1 ? "Има 1 грешен адрес" : "Има " + wrong + " грешни адреса";
      text += " (в червено). Опитай пак!";
      const hint = options.hint && options.hint(inputs.map((input) => input.value));
      setFeedback(hint ? text + " " + hint : text, "error");
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
    checkButton.disabled = false;
    next.hidden = true;
    setFeedback("", "");
    inputs[0].focus();
  }

  checkButton.addEventListener("click", checkAnswers);
  document.getElementById("clear-button").addEventListener("click", clearAnswers);

  showPlayerName();
  inputs[0].focus();
}
