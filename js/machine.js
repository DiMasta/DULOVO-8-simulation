// Shared pieces for the levels where the RAM holds bytes and instructions
// and the CPU runs a program: byte helpers, RAM rendering, screen and CPU.
const RAM_SIZE = 16;
const STEP_DELAY = 600;

function toBinary(n, bits) {
  return n.toString(2).padStart(bits, "0");
}

// 5 -> "0000 0101", as the bytes are written in the original sheet.
function formatByte(n) {
  const bits = toBinary(n, 8);
  return bits.slice(0, 4) + " " + bits.slice(4);
}

// "0000 0101" or "00000101" -> 5; anything that isn't exactly 8 bits -> null.
function parseByte(text) {
  const bits = text.replace(/\s/g, "");
  return /^[01]{8}$/.test(bits) ? parseInt(bits, 2) : null;
}

// windows-1251 fits both Latin and Cyrillic letters in one byte.
const CHARSET = new TextDecoder("windows-1251");
const CHAR_CODES = new Map();

function byteToChar(n) {
  return CHARSET.decode(Uint8Array.of(n));
}

for (let n = 0; n < 256; n++) {
  const char = byteToChar(n);
  if (!CHAR_CODES.has(char)) CHAR_CODES.set(char, n);
}

function charToByte(char) {
  return CHAR_CODES.has(char) ? CHAR_CODES.get(char) : null;
}

// Renders the RAM with fixed binary addresses and an input per content cell.
// cells[i] = { text, editable }; filter strips characters while typing.
function buildRam(tbody, cells, filter) {
  const inputs = [];

  const focusFrom = (i, step) => {
    for (let j = i + step; j >= 0 && j < RAM_SIZE; j += step) {
      if (!inputs[j].disabled) return inputs[j].focus();
    }
  };

  cells.forEach((cell, i) => {
    const row = document.createElement("tr");

    const addressCell = document.createElement("td");
    addressCell.className = "address label";
    addressCell.textContent = toBinary(i, 4);

    const contentCell = document.createElement("td");
    contentCell.className = "content";
    const input = document.createElement("input");
    input.type = "text";
    input.value = cell.text || "";
    input.disabled = !cell.editable;
    input.maxLength = 12;
    input.spellcheck = false;
    input.autocomplete = "off";
    input.setAttribute("autocapitalize", "characters");
    input.setAttribute("aria-label", "Клетка " + toBinary(i, 4));
    input.addEventListener("input", () => {
      if (filter) input.value = input.value.replace(filter, "");
      contentCell.classList.remove("correct", "wrong");
    });
    input.addEventListener("blur", () => {
      const value = parseByte(input.value);
      if (value !== null) input.value = formatByte(value);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === "ArrowDown") {
        event.preventDefault();
        focusFrom(i, 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        focusFrom(i, -1);
      }
    });
    contentCell.appendChild(input);

    row.appendChild(addressCell);
    row.appendChild(contentCell);
    tbody.appendChild(row);
    inputs.push(input);
  });

  return inputs;
}

// OUT prints a number on its own line; consecutive OUTC letters share a line.
function createScreen(el) {
  let lines = [];
  let lastWasChar = false;

  return {
    clear() {
      lines = [];
      lastWasChar = false;
      el.textContent = "";
    },
    print(text, isChar) {
      if (isChar && lastWasChar) lines[lines.length - 1] += text;
      else lines.push(text);
      lastWasChar = isChar;
      el.textContent = lines.join("\n");
    },
    lines() {
      return lines.slice();
    },
  };
}

function decodeInstruction(text) {
  const t = text.trim().toUpperCase().replace(/\s+/g, " ");
  if (t === "") return { op: "EMPTY" };
  if (t === "STOP!" || t === "STOP") return { op: "STOP" };
  const match = t.match(/^(OUTC|OUT) ([01]{4})$/);
  if (match) return { op: match[1], address: parseInt(match[2], 2) };
  if (parseByte(t) !== null) return { op: "DATA" };
  return { op: "UNKNOWN" };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Runs the program from address 0000 until STOP!. Resolves to null on success
// or to { address, message } describing what went wrong.
async function runProgram(memory, { allowed, onStep, onOutput }) {
  for (let pc = 0; pc < memory.length; pc++) {
    onStep(pc);
    await sleep(STEP_DELAY);

    const at = toBinary(pc, 4);
    const instruction = decodeInstruction(memory[pc]);

    switch (instruction.op) {
      case "STOP":
        return null;
      case "EMPTY":
        return {
          address: pc,
          message: "Клетка " + at + " е празна и компютърът не знае какво да прави. Забрави ли STOP!?",
        };
      case "DATA":
        return {
          address: pc,
          message: "Клетка " + at + " съдържа число, а не инструкция. Забрави ли STOP! преди данните?",
        };
    }

    if (instruction.op === "UNKNOWN" || !allowed.includes(instruction.op)) {
      return {
        address: pc,
        message: "Непозната инструкция в клетка " + at + ": „" + memory[pc].trim() + "“.",
      };
    }

    const value = parseByte(memory[instruction.address]);
    if (value === null) {
      return {
        address: pc,
        message:
          "Клетка " + toBinary(instruction.address, 4) + " не съдържа байт (8 бита), който да се покаже.",
      };
    }
    if (instruction.op === "OUTC") onOutput(byteToChar(value), true);
    else onOutput(String(value), false);
  }

  return { address: RAM_SIZE - 1, message: "Програмата стигна края на паметта, без да срещне STOP!." };
}

// Wires up a level where the student writes a program and runs it.
// options:
//   level   - level number, marked complete in Progress on success
//   cells   - initial RAM cells, see buildRam
//   allowed - instructions this level knows besides STOP!, e.g. ["OUT"]
//   check   - (screenLines) => error message, or "" when the goal is met
function setupProgramLevel(options) {
  const inputs = buildRam(document.getElementById("ram-body"), options.cells);
  const screen = createScreen(document.getElementById("screen"));
  const runButton = document.getElementById("run-button");
  const rows = [...document.querySelectorAll("#ram-body tr")];

  const clearMarks = () =>
    rows.forEach((row) => row.querySelectorAll("td").forEach((td) => td.classList.remove("running", "wrong")));

  runButton.addEventListener("click", async () => {
    clearMarks();
    screen.clear();
    setFeedback("Компютърът работи…", "");
    runButton.disabled = true;
    const editable = inputs.filter((input) => !input.disabled);
    editable.forEach((input) => (input.disabled = true));

    const error = await runProgram(
      inputs.map((input) => input.value),
      {
        allowed: options.allowed,
        onStep(address) {
          clearMarks();
          rows[address].querySelectorAll("td").forEach((td) => td.classList.add("running"));
        },
        onOutput: (text, isChar) => screen.print(text, isChar),
      }
    );

    clearMarks();
    editable.forEach((input) => (input.disabled = false));
    runButton.disabled = false;

    if (error) {
      rows[error.address].querySelector(".content").classList.add("wrong");
      setFeedback(error.message, "error");
      return;
    }

    const problem = options.check(screen.lines());
    if (problem) {
      setFeedback(problem, "error");
      return;
    }

    showSuccess(options.level, "Програмата работи. Ниво " + options.level + " е завършено!");
  });
}
