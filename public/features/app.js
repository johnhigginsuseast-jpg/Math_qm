'use strict';
const app = document.querySelector('#app');
const storageKey = 'math-lab-equations-v1';
let step = 0;
let equation = { a: 2, b: 3, c: 11 };
let hintLevel = 0;
let completed = false;
if(!Auth.online) try { completed = localStorage.getItem(storageKey) === 'complete'; } catch (_) { /* 无存储权限时仍可学习。 */ }

function balance(a = 2, b = 3, c = 11) {
  const boxes = Array.from({ length: a }, (_, i) => `<rect x="${75 + i * 47}" y="91" width="38" height="48" rx="6" fill="#447e62"/><text x="${94 + i * 47}" y="121" text-anchor="middle" fill="white" font-size="22">x</text>`).join('');
  return `<svg viewBox="0 0 440 220" role="img" aria-label="等式模型：左边 ${a} 个 x${b ? ' 加 ' + b : ''}，右边 ${c}。两边相等。"><path d="M220 75 L195 193 H245 Z" fill="#d1dcbc"/><rect x="170" y="191" width="100" height="10" rx="5" fill="#a9b990"/><path d="M55 73 H385" stroke="#66835a" stroke-width="7" stroke-linecap="round"/><circle cx="220" cy="73" r="9" fill="#335a45"/><path d="M64 73 V147 M183 73 V147 M258 73 V147 M378 73 V147" stroke="#a4b390" stroke-width="2"/><path d="M54 143 H193 Q183 164 124 164 Q64 164 54 143 M248 143 H388 Q378 164 318 164 Q258 164 248 143" fill="#c1d0ae"/>${boxes}${b ? `<circle cx="175" cy="122" r="15" fill="#e7bb6e"/><text x="175" y="128" text-anchor="middle" fill="#624e2c" font-size="17">${b}</text>` : ''}<rect x="287" y="99" width="61" height="40" rx="9" fill="#e7bb6e"/><text x="318" y="125" text-anchor="middle" fill="#624e2c" font-size="23">${c}</text><text x="220" y="35" text-anchor="middle" fill="#78916a" font-size="12">两边相等 · 保持平衡</text></svg>`;
}
function formula() { return `${equation.a === 1 ? '' : equation.a}x${equation.b ? ' ＋ ' + equation.b : ''} ＝ ${equation.c}`; }
function home() {
  app.innerHTML = `<section class="hero"><div><span class="pill">七年级 · 代数入门</span><h1>方程里的秘密，<br>自己动手找出来。</h1><p class="lead">为什么解方程时，两边要做同样的事？<br>来做一个小实验，让每一步都有理由。</p><div class="controls"><button class="primary" id="start">${completed ? '再探索一次' : '开始探索'} <span aria-hidden="true">↗</span></button></div><p class="note">约 20–30 分钟 · 无需登录${completed ? ' · 你已完成本课' : ''}</p></div><div class="hero-card"><div class="small-label">第 01 个数学实验 / 一元一次方程</div><div class="equation">2x ＋ 3 ＝ 11</div>${balance()}<p class="center note">找到 x 之前，先想想如何保持平衡。</p></div></section><div class="cards"><div class="feature"><span class="number">01</span><b>先猜一猜</b><p>从一个问题开始，给自己的想法一个机会。</p></div><div class="feature"><span class="number">02</span><b>动手试一试</b><p>看图示与公式一起变化，发现每一步的依据。</p></div><div class="feature"><span class="number">03</span><b>自己讲明白</b><p>解释原因，配合例题巩固，再独立挑战。</p></div></div>`;
  document.querySelector('#start').onclick = () => { step = 0; equation = { a: 2, b: 3, c: 11 }; renderLesson(); };
}
const lessons = [
  { label: '先预测', title: '只改变一边，还会相等吗？', text: '我们知道 2x＋3＝11。假如只把左边的 3 去掉，右边保持 11，两边还相等吗？', choices: ['仍然相等，因为只是去掉了一个数。', '不相等了，左边少了 3，右边没有变化。'], correct: 1, wrong: '原来两边一样大。只让左边少 3，它就比右边小 3。试着重新判断。', success: '对！要让相等关系继续成立，不能只改变一边。', hints: ['想象两个相同的数量，只从其中一个拿走 3。', '左边减少了，右边没有减少，两边还能一样大吗？'] },
  { label: '动手操作', title: '先让含 x 的部分留下来。', text: '左边的 2x 旁边还加着 3。为了留下 2x，同时保持相等，你会怎样操作？', choices: ['只在左边减去 3', '两边同时减去 3', '两边同时加上 3'], correct: 1, wrong: '试着让左边的“＋3”变成 0，同时保证两边仍然相等。', success: '两边同时减去 3：2x＋3−3＝11−3，所以 2x＝8。', hints: ['目标是消去左边的常数 3。', '减去 3 可以抵消加上的 3。两边需要一起做。'] },
  { label: '继续探索', title: '两个 x 是 8，一个 x 呢？', text: '2x 表示两个相同的 x 相加。把两边各平均分成两份，就能知道一个 x 是多少。', choices: ['只把左边除以 2', '两边同时减去 2', '两边同时除以 2'], correct: 2, wrong: '我们要从两个相同的 x 找到一个 x。想想“平均分成两份”对应什么运算，并让两边一起做。', success: '两边同时除以 2：2x÷2＝8÷2，所以 x＝4。', hints: ['两个 x 的总和是 8，每个 x 相同。', '平均分成两份就是除以 2，两边同时除以 2。'] },
  { label: '解释原因', title: '你已经找到 x，能讲清理由吗？', text: '回顾刚才的操作：两边减去 3，再两边除以 2。为什么这样做后，方程的解保持不变？', choices: ['因为解方程时，数字都要移到右边。', '相等的两个数，减去同一个数或除以同一个非零数，结果仍相等。', '因为图里的天平始终是水平的。'], correct: 1, wrong: '图示帮助我们观察，但每一步还需要运算的依据。选一个能解释两步操作的理由。', success: '这就是等式的性质。除数必须不为零；图示帮助观察，等式的性质解释为什么成立。代回检查：2×4＋3＝11。', hints: ['想想每一步中，等式的左右两边有什么共同的变化。', '关键是两边做相同操作；除法还要求除数不为零。'] }
];
function feedback(message, good = false) { const el = document.querySelector('#feedback'); el.className = `feedback${good ? ' success' : ''}`; el.textContent = message; }
function renderLesson() {
  hintLevel = 0;
  let solved = false;
  const lesson = lessons[step];
  app.innerHTML = `<div class="lesson-top"><button class="back" id="home">← 返回实验室</button><div class="progress" aria-label="第 ${step + 1} 步，共 7 步">${Array.from({ length: 7 }, (_, i) => `<span class="${i <= step ? 'active' : ''}"></span>`).join('')}</div></div><div class="lesson-grid"><section class="panel visual"><div class="small-label center">观察区 / 图示与公式同步变化</div><div class="equation" id="formula">${formula()}</div><div id="balance">${balance(equation.a, equation.b, equation.c)}</div><div class="caption">绿色方块表示 x，黄色数字表示已知数量。</div><div class="history" id="history">${step >= 2 ? '① 两边减去 3 → 2x＝8' : '起点：2x＋3＝11'}${step >= 3 ? '<br>② 两边除以 2 → x＝4' : ''}</div></section><section class="panel"><span class="eyebrow">0${step + 1} / ${lesson.label}</span><h2>${lesson.title}</h2><p>${lesson.text}</p><div class="choice-list">${lesson.choices.map((choice, i) => `<button class="choice" data-choice="${i}">${choice}</button>`).join('')}</div><div id="feedback" class="feedback" role="status" aria-live="polite"></div><div class="controls"><button id="hint" class="hint">给我一点提示</button><button id="next" class="primary" hidden>${step === 3 ? '例题巩固 →' : '继续探索 →'}</button></div></section></div>`;
  document.querySelector('#home').onclick = home;
  document.querySelector('#hint').onclick = () => { feedback(lesson.hints[Math.min(hintLevel++, lesson.hints.length - 1)]); };
  document.querySelectorAll('[data-choice]').forEach(button => { button.onclick = () => {
    if (solved) return;
    if (Number(button.dataset.choice) !== lesson.correct) { feedback(lesson.wrong); return; }
    solved = true;
    if (step === 1) equation = MathLesson.transform(equation, 'subtract', 3);
    if (step === 2) equation = MathLesson.transform(equation, 'divide', 2);
    document.querySelector('#formula').textContent = formula();
    document.querySelector('#balance').innerHTML = balance(equation.a, equation.b, equation.c);
    document.querySelector('#history').innerHTML = step === 1 ? '① 两边减去 3 → 2x＝8' : step >= 2 ? '① 两边减去 3 → 2x＝8<br>② 两边除以 2 → x＝4' : '起点：2x＋3＝11';
    feedback(lesson.success, true);
    document.querySelector('.choice-list').hidden = true;
    document.querySelector('#hint').hidden = true;
    document.querySelector('#next').hidden = false;
  }; });
  document.querySelector('#next').onclick = () => { step++; step === 4 ? examples() : renderLesson(); };
}
function examples() {
  const items = [
    { title: '例题 1 · 消去加上的数', equation: 'x＋7＝12', prompt: '要让左边只剩 x，应该消去哪个数？', steps: [
      ['两边同时减去 7', 'x＋7−7＝12−7 → x＝5', '减去 7 抵消左边的＋7；两边一起减，相等关系保持成立。'],
      ['代回原方程检查', '5＋7＝12 ✓', '把 x＝5 代入，左右两边相等，说明这个解成立。']
    ] },
    { title: '例题 2 · 先减，再除', equation: '4x＋3＝19', prompt: '回想实验：先留下含 x 的部分，再求一个 x。', steps: [
      ['两边同时减去 3', '4x＋3−3＝19−3 → 4x＝16', '先消去常数 3，让左边只剩 4x。'],
      ['两边同时除以 4', '4x÷4＝16÷4 → x＝4', '4x 是四个相同的 x；两边平均分成四份。除数 4 不为零。'],
      ['代回原方程检查', '4×4＋3＝19 ✓', '左边计算得到 19，与右边相等。']
    ] },
    { title: '例题 3 · 遇到减法怎么办？', equation: '3x−6＝9', prompt: '这次左边是减去 6。要抵消它，应该加上还是减去 6？', steps: [
      ['两边同时加上 6', '3x−6＋6＝9＋6 → 3x＝15', '−6 与＋6 抵消。这里要加上 6，不能照搬前两题的减法。'],
      ['两边同时除以 3', '3x÷3＝15÷3 → x＝5', '三个相同的 x 合起来是 15，每个 x 是 5。两边同除以非零数 3。'],
      ['代回原方程检查', '3×5−6＝9 ✓', '算出 15−6＝9，确认解满足原方程。']
    ] }
  ];
  app.innerHTML = `<div class="lesson-top"><button class="back" id="home">← 返回实验室</button><span class="small-label">05 / 例题巩固</span></div><div class="quiz"><span class="eyebrow">把刚才的发现用起来</span><h2>换一道题，理由还是一样。</h2><p class="lead">先自己想一想，再逐步展开解法。每一步都看看：做了什么，为什么这样做。</p>${items.map((item, i) => `<section class="question-card"><h3>${item.title}</h3><div class="equation">${item.equation}</div><p>${item.prompt}</p><ol class="worked-steps" id="example-${i}" aria-live="polite"></ol><button class="secondary" data-example="${i}" aria-controls="example-${i}">展开第 1 步</button></section>`).join('')}<section class="result"><b>比较一下这三道题</b><p>加着一个数，就两边减去它；减去一个数，就两边加上它。留下几个 x 后，再两边同除以 x 的系数。</p><p class="note">判断操作的依据是等式的性质，除数必须不为零。</p></section><div class="controls"><button class="primary" id="to-quiz">进入独立挑战 →</button></div></div>`;
  document.querySelector('#home').onclick = home;
  document.querySelectorAll('[data-example]').forEach(button => {
    const index = Number(button.dataset.example);
    let revealed = 0;
    button.onclick = () => {
      const item = items[index];
      if (revealed === item.steps.length) return;
      const [operation, expression, reason] = item.steps[revealed++];
      document.querySelector(`#example-${index}`).insertAdjacentHTML('beforeend', `<li><b>${operation}</b><p class="worked-equation">${expression}</p><p class="note">${reason}</p></li>`);
      if (revealed === item.steps.length) button.hidden = true;
      else button.textContent = `展开第 ${revealed + 1} 步`;
    };
  });
  document.querySelector('#to-quiz').onclick = quiz;
}
function practice() {
  let questionIndex = 0;
  let stageIndex = 0;
  let accepted = false;
  const questions = MathLesson.practiceQuestions;
  function equationText(value) {
    return `${value.a === 1 ? '' : value.a}x${value.b ? ` ${value.b > 0 ? '＋' : '−'} ${Math.abs(value.b)}` : ''} ＝ ${value.c}`;
  }
  function render() {
    accepted = false;
    const question = questions[questionIndex];
    const stages = MathLesson.practiceSteps(question);
    const current = stages[stageIndex];
    app.innerHTML = `<div class="lesson-top"><button class="back" id="home">← 返回实验室</button><span class="small-label">07 / 分步练习</span></div><div class="quiz"><span class="eyebrow">第 ${questionIndex + 1} / ${questions.length} 题 · 已完成 ${questionIndex} 题</span><h2>一步一步，把方程解出来。</h2><p class="lead">先计算加减后的结果，再计算除法结果。每一步正确后才能继续。</p><section class="question-card"><h3>解方程</h3><div class="equation">${equationText(question)}</div>${stageIndex ? `<div class="history">✓ 第 1 步：${stages[0].operation}<br>${equationText(stages[0].equation)}</div>` : ''}<form id="practice-form" novalidate><p><b>第 ${stageIndex + 1} 步：${current.operation}</b></p><p class="note">${current.reason}</p><label for="step-answer">计算右边：${current.calculation} ＝ ?</label><p class="answer-row"><input id="step-answer" name="step-answer" type="text" inputmode="decimal" autocomplete="off" placeholder="本步计算结果" required></p><div id="feedback" class="feedback" role="status" aria-live="polite"></div><div class="controls"><button class="primary" id="check-step" type="submit">检查这一步</button><button class="hint" id="practice-hint" type="button">给我一点提示</button><button class="primary" id="practice-next" type="button" hidden>${stageIndex === 0 ? '继续第 2 步 →' : questionIndex === questions.length - 1 ? '完成练习 →' : '下一题 →'}</button></div></form><div id="step-result" aria-live="polite"></div></section><p class="note">第 1–4 题练习减法，第 5–8 题练习加法，第 9–10 题尝试负数和零的解。</p></div>`;
    document.querySelector('#home').onclick = home;
    document.querySelector('#practice-hint').onclick = () => feedback(stageIndex === 0
      ? `左边要消去 ${Math.abs(question.b)}，右边也要${question.b > 0 ? '减去' : '加上'} ${Math.abs(question.b)}。请计算 ${current.calculation}，不要直接填写最终的 x。`
      : `想一想：什么数乘以 ${question.a} 等于 ${stages[0].equation.c}？负数除以正数得到负数，0 除以非零数还是 0。`);
    document.querySelector('#practice-form').onsubmit = event => {
      event.preventDefault();
      if (accepted) return;
      const input = document.querySelector('#step-answer');
      if (!input.value.trim()) { feedback('先填写这一步的计算结果，再检查。'); return; }
      if (!MathLesson.checkAnswer(input.value, current.equation.c)) {
        feedback(`这一步还没算对。请重新计算 ${current.calculation}；${stageIndex === 0 ? '这里填写的是加减后的结果，还不是最终的 x。' : '注意除法和正负号。'}`);
        return;
      }
      accepted = true;
      input.readOnly = true;
      feedback(`计算正确：${current.calculation}＝${current.equation.c}。`, true);
      document.querySelector('#step-result').innerHTML = `<div class="result"><b>${equationText(current.equation)}</b>${stageIndex === 1 ? `<p class="note">代回检查：${question.a}×${current.equation.c < 0 ? `(${current.equation.c})` : current.equation.c} ${question.b > 0 ? '＋' : '−'} ${Math.abs(question.b)}＝${question.c} ✓</p>` : ''}</div>`;
      document.querySelector('#check-step').hidden = true;
      document.querySelector('#practice-hint').hidden = true;
      document.querySelector('#practice-next').hidden = false;
    };
    document.querySelector('#practice-next').onclick = () => {
      if (!accepted) return;
      if (stageIndex === 0) { stageIndex = 1; render(); return; }
      questionIndex++;
      stageIndex = 0;
      if (questionIndex < questions.length) { render(); return; }
      Auth.saveCompletion('legacy-equation',()=>{
      completed = true;
      if(!Auth.online) try { localStorage.setItem(storageKey, 'complete'); } catch (_) { /* 无存储权限时不影响完成课程。 */ }
      app.innerHTML = `<div class="quiz"><span class="eyebrow">07 / 分步练习已完成</span><h2>10 道题，20 步计算。</h2><section class="result"><p>你完成了加减、除法和代回检查，也遇到了负数与零的解。</p><p>记住：每一步都对等式两边做相同操作，除数必须不为零。</p></section><button class="primary" id="practice-finish">回到实验室</button></div>`;
      document.querySelector('#practice-finish').onclick = home;
      },app);
    };
  }
  render();
}
function quiz() {
  app.innerHTML = `<div class="lesson-top"><button class="back" id="home">← 返回实验室</button><span class="small-label">06 / 独立挑战</span></div><div class="quiz"><span class="eyebrow">把理解带到新题里</span><h2>现在，试着独立解决。</h2><p class="lead">这次没有图示。答错也没关系，看看反馈，再试一次。</p><form id="quiz-form" novalidate><section class="question-card"><label for="answer"><b>1. 解方程：3x＋6＝21</b></label><p class="answer-row"><span>x ＝</span><input id="answer" name="answer" type="text" inputmode="decimal" autocomplete="off" placeholder="输入数字" required></p></section><section class="question-card"><b id="reason-label">2. 为什么第一步要两边同时减去 6？</b><div class="choice-list" role="group" aria-labelledby="reason-label"><label class="choice"><input type="radio" name="reason" value="0"> 只要把 6 移到右边就行，不用考虑原因。</label><label class="choice"><input type="radio" name="reason" value="1"> 消去左边的常数，同时保持两边相等。</label></div></section><section class="question-card"><b id="zero-label">3. 等式两边可以同时除以 0 吗？</b><div class="choice-list" role="group" aria-labelledby="zero-label"><label class="choice"><input type="radio" name="zero" value="0"> 可以，两边做同样操作就行。</label><label class="choice"><input type="radio" name="zero" value="1"> 不可以，0 不能作为除数。</label></div></section><div id="feedback" class="feedback" role="status" aria-live="polite"></div><div class="controls"><button class="primary" type="submit">检查我的理解</button><button class="hint" type="button" id="quiz-hint">我需要提示</button></div></form><div id="result"></div></div>`;
  document.querySelector('#home').onclick = home;
  document.querySelector('#quiz-hint').onclick = () => feedback('先两边减去 6，得到 3x＝15，再两边除以 3。记得检查每一步为什么成立，以及除数的限制。');
  document.querySelector('#quiz-form').onsubmit = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    if (!String(data.get('answer')).trim() || data.get('reason') === null || data.get('zero') === null) { feedback('请先填写 x，并完成两道判断题。'); return; }
    if (!MathLesson.checkAnswer(data.get('answer'), 5)) { feedback('第 1 题再想一想：两边减去 6 后是 3x＝15，再把两边平均分成 3 份。'); return; }
    if (data.get('reason') !== '1') { feedback('第 2 题：减去 6 是为了消去左边的常数；两边同时做，才能保持相等。'); return; }
    if (data.get('zero') !== '1') { feedback('第 3 题：0 不能作为除数。等式两边同除时，必须除以同一个非零数。'); return; }
    feedback('三题都正确！代回检查：3×5＋6＝21。', true);
    document.querySelector('#result').innerHTML = `<section class="result"><span class="eyebrow">独立挑战已完成</span><h2>每一步，都有理由。</h2><p>两边同时加上或减去同一个数，或同时乘以、除以同一个非零数，相等关系保持成立。</p><p class="note">接下来用 10 道分步练习，巩固每一步的计算与理由。</p><button class="secondary" id="finish">开始 10 道分步练习 →</button></section>`;
    document.querySelector('#finish').onclick = practice;
  };
}
if(!Auth.online) home();

