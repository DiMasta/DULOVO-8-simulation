// Level 1: fill the address column of the empty 16-cell RAM with 0..15.
setupRamLevel({
  level: 1,
  maxLength: 2,
  filter: /\D/g,
  isCorrect: (value, i) => Number(value) === i,
});
