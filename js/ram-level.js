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
  const checkButton = document.getElementById("check-button");
  const inputs = [];

  if (options.showDecimal) ramBody.parentElement.classList.add("with-decimal");

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
      inputs.forEach((input) => (input.disabled = true));
      checkButton.disabled = true;
      showSuccess(options.level, "Всички 16 адреса са верни. Ниво " + options.level + " е завършено!");
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
    setFeedback("", "");
    inputs[0].focus();
  }

  checkButton.addEventListener("click", checkAnswers);
  document.getElementById("clear-button").addEventListener("click", clearAnswers);

  inputs[0].focus();
}

// Options shared by the levels that ask for 4-bit binary addresses.
const BINARY_ADDRESS_OPTIONS = {
  maxLength: 4,
  filter: /[^01]/g,
  isCorrect: (value, i) => value === i.toString(2).padStart(4, "0"),
  hint: (values) =>
    values.some((value) => value !== "" && value.length < 4)
      ? "Адресът има точно 4 бита: 3 е 0011."
      : "",
};
