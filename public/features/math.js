(function (root) {
  'use strict';
  function transform(equation, operation, amount) {
    if (!Number.isFinite(amount) || !['subtract', 'divide'].includes(operation) || (operation === 'divide' && amount === 0)) {
      throw new Error('请输入有效操作，除数不能为零。');
    }
    const { a, b, c } = equation;
    return operation === 'subtract'
      ? { a, b: b - amount, c: c - amount }
      : { a: a / amount, b: b / amount, c: c / amount };
  }
  function checkAnswer(value, expected) {
    const text = String(value).trim();
    return text !== '' && /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text) && Number(text) === expected;
  }
  const practiceQuestions = [
    { a: 2, b: 4, c: 12 }, { a: 3, b: 5, c: 20 },
    { a: 4, b: 7, c: 31 }, { a: 5, b: 2, c: 17 },
    { a: 2, b: -3, c: 11 }, { a: 3, b: -7, c: 8 },
    { a: 4, b: -5, c: 23 }, { a: 6, b: -9, c: 15 },
    { a: 2, b: 9, c: 3 }, { a: 5, b: 8, c: 8 }
  ];
  function practiceSteps(question) {
    const reduced = transform(question, 'subtract', question.b);
    const solved = transform(reduced, 'divide', question.a);
    return [
      { operation: `两边同时${question.b > 0 ? '减去' : '加上'} ${Math.abs(question.b)}`, calculation: `${question.c} ${question.b > 0 ? '−' : '＋'} ${Math.abs(question.b)}`, equation: reduced, reason: `消去左边的${question.b > 0 ? '加数' : '减数'}，两边一起做，保持相等。` },
      { operation: `两边同时除以 ${question.a}`, calculation: `${reduced.c} ÷ ${question.a}`, equation: solved, reason: `把 ${question.a}x 变成 x，两边同除以非零数 ${question.a}。` }
    ];
  }
  const api = { transform, checkAnswer, practiceQuestions, practiceSteps };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MathLesson = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);

