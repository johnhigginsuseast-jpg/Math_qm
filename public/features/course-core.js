(function (root) {
  'use strict';
  const modules = ['数与式', '方程与不等式', '函数', '三角形与四边形', '圆', '图形变换', '统计与概率'];
  const lessons = [];
  const n = (label, answer, reason, unit = '') => ({ label, answer, reason, unit });
  const c = (label, answer, choices, reason) => ({ label, answer, choices, reason });
  const q = (prompt, ...steps) => ({ prompt, steps });
  const sign = x => x < 0 ? `(${x})` : String(x);
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const fraction = (a, b) => { const d = gcd(a, b); return [a / d * Math.sign(b), Math.abs(b / d)]; };
  function check(value, expected) {
    if (typeof expected === 'number') {
      const text = String(value).trim().replace(/−/g, '-');
      return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text) && Number.isFinite(Number(text)) && Math.abs(Number(text) - expected) < 1e-8;
    }
    return String(value).trim() === String(expected);
  }
  function add(module, id, title, experiment, rule, build, covers = [title], extension = false) {
    const variedBuild = i => {
      const question = build(i), type=i%10;
      if(type<4)return question;
      const target=question.steps[type<8||type===9?0:question.steps.length-1];
      const valid=type<8&&i%2===0;
      const proposed=valid?target.answer:typeof target.answer==='number'?target.answer+(i%2+1):target.choices.find(value=>value!==target.answer);
      const judgement=c(`同学的“${target.label}＝${proposed}”正确吗？`,valid?'正确':'不正确',['正确','不正确'],target.reason);
      return type<8?q(`${question.prompt} 同学给出“${target.label}＝${proposed}”，先辨错，再计算。`,judgement,...question.steps)
        :q(`${question.prompt} 逐步核对同学的结论“${target.label}＝${proposed}”。`,...question.steps,judgement);
    };
    lessons.push({ module, id, title, experiment, rule, build:variedBuild, covers, extension });
  }
  const api = { modules, lessons, n, c, q, sign, gcd, fraction, check, add };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Courses = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);

