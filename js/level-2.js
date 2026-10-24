// Level 2: write the 16 RAM addresses as 4-bit binary numbers (0000..1111).
setupRamLevel({
  level: 2,
  maxLength: 4,
  filter: /[^01]/g,
  showDecimal: true,
  isCorrect: (value, i) => value === i.toString(2).padStart(4, "0"),
  hint: (values) =>
    values.some((value) => value !== "" && value.length < 4)
      ? "Всеки адрес трябва да има точно 4 бита — допълни с нули отпред (например 0011)."
      : "",
});
