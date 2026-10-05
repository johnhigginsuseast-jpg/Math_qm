'use strict';
let activeCourse;
let coursePhase = 0;
let taskIndex = 0;
let taskStep = 0;
let taskAccepted = false;
const courseMarks = new Set();
if(!Auth.online) try { const saved = JSON.parse(localStorage.getItem('math-lab-courses-v1') || '[]'); if(Array.isArray(saved)) saved.forEach(id=>courseMarks.add(id)); } catch (_) { /* 存储不可用仍可学习。 */ }
function esc(value) { return String(value).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }
function catalogue() {
  app.innerHTML=`<section class="catalogue-hero"><span class="pill">初中数学 · 互动学习</span><h1>动手探索，<br>把数学想明白。</h1><p class="lead">从一个实验开始，跟着例题理解，再独立挑战，一步步完成练习。</p>${Auth.guest?'<p class="note">公开学习版 · 无需登录。完成记录仅保存在当前浏览器，换设备或清除浏览器数据后不会同步。</p>':''}<div class="learning-path">实验 <span>→</span> 例题 <span>→</span> 独立挑战 <span>→</span> 10 道分步练习</div></section><div class="catalogue-tools"><label for="course-search">找一个知识点</label><input type="search" id="course-search" placeholder="搜索：绝对值、函数、圆…"><span class="note">${Courses.lessons.length+1} 节课程 · 7 大模块</span></div><div id="catalogue-list">${Courses.modules.map((module,index)=>`<section class="module-section"><div class="module-heading"><span class="number">0${index+1}</span><h2>${module}</h2></div><div class="course-grid">${module==='方程与不等式'?`<button class="course-card" data-course="legacy-equation"><span class="small-label">天平实验</span><b>一元一次方程：等式性质</b><span class="note">${completed?'已完成 ✓':'开始学习 →'}</span></button>`:''}${Courses.lessons.filter(l=>l.module===module).map(l=>`<button class="course-card" data-course="${l.id}" data-search="${esc([l.title,...l.covers].join(' '))}"><span class="small-label">${esc(l.experiment.kind)}${l.extension?' · 拓展':''}</span><b>${esc(l.title)}</b><span class="note">${courseMarks.has(l.id)?'已完成 ✓':'开始学习 →'}</span></button>`).join('')}</div></section>`).join('')}</div>`;
  document.querySelectorAll('[data-course]').forEach(button=>button.onclick=()=>{
    if(button.dataset.course==='legacy-equation'){step=0;equation={a:2,b:3,c:11};renderLesson();return;}
    activeCourse=Courses.lessons.find(l=>l.id===button.dataset.course);coursePhase=0;renderCourse();
  });
  document.querySelector('#course-search').oninput=event=>{
    const keyword=event.target.value.trim().toLowerCase();
    document.querySelectorAll('.course-card').forEach(button=>button.hidden=!`${button.textContent} ${button.dataset.search||''}`.toLowerCase().includes(keyword));
    document.querySelectorAll('.module-section').forEach(section=>section.hidden=!Array.from(section.querySelectorAll('.course-card')).some(button=>!button.hidden));
  };
  window.scrollTo(0,0);
}
function courseHeader() {
  return `<div class="lesson-top"><button class="back" id="catalogue-back">← 课程目录</button><span class="small-label">${esc(activeCourse.module)}</span></div><h2>${esc(activeCourse.title)}</h2><nav class="phase-nav" aria-label="学习环节">${['实验','例题','独立挑战','10 道分步练习'].map((name,i)=>`<span class="${i===coursePhase?'selected':''}" ${i===coursePhase?'aria-current="step"':''}>${i+1}. ${name}</span>`).join('')}</nav>`;
}
function bindBack() { document.querySelector('#catalogue-back').onclick=catalogue; }
function renderCourse() {
  app.innerHTML=courseHeader()+`<div id="course-content"></div>`;bindBack();
  if(coursePhase===0)renderExperiment();
  if(coursePhase===1)renderExamples();
  if(coursePhase>=2){taskIndex=0;taskStep=0;renderTask();}
  window.scrollTo(0,0);
}
function renderExperiment() {
  const experiment=activeCourse.experiment;
  document.querySelector('#course-content').innerHTML=`<div class="lesson-grid"><section class="panel visual"><div id="experiment-drawing"></div><div class="experiment-controls">${experiment.controls.map((control,i)=>`<label>${esc(control.label)} <output id="control-value-${i}">${control.value}</output><input aria-label="${esc(control.label)}" data-control="${i}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${control.value}"></label>`).join('')}</div>${experiment.kind==='概率实验'?'<button class="secondary" id="run-trials">做100次试验</button>':''}</section><section class="panel"><span class="eyebrow">先预测 · 再观察 · 说理由</span><p>${esc(experiment.intro)}</p><button class="secondary" id="observe">我已预测，查看观察结果</button><div id="observation" class="feedback" role="status" hidden></div><section id="rule" class="result" hidden><b>为什么成立？</b><p>${esc(activeCourse.rule)}</p></section><button class="primary" id="experiment-next" hidden>带着发现，看例题 →</button></section></div>`;
  let observed=false, heads=0, trials=0;
  function update() {
    const values=Array.from(document.querySelectorAll('[data-control]')).map(input=>Number(input.value));
    const result=experiment.observe(values);
    document.querySelector('#experiment-drawing').innerHTML=result.svg;
    document.querySelectorAll('[data-control]').forEach((input,i)=>document.querySelector(`#control-value-${i}`).textContent=input.value);
    document.querySelector('#observation').textContent=trials?`共 ${trials} 次，正面 ${heads} 次，频率 ${(heads/trials).toFixed(3)}。试验频率可波动；理论概率仍为 1/2。`:result.text;
  }
  document.querySelectorAll('[data-control]').forEach(input=>input.oninput=update);
  document.querySelector('#observe').onclick=()=>{observed=true;document.querySelector('#observation').hidden=false;document.querySelector('#rule').hidden=false;document.querySelector('#experiment-next').hidden=false;update();};
  if(experiment.kind==='概率实验')document.querySelector('#run-trials').onclick=()=>{for(let i=0;i<100;i++)heads+=Math.random()<.5?1:0;trials+=100;document.querySelector('#observe').click();};
  document.querySelector('#experiment-next').onclick=()=>{if(observed){coursePhase=1;renderCourse();}};
  update();
}
function stepAnswer(step) { return step.unit ? `${step.answer} ${step.unit}` : String(step.answer); }
function renderExamples() {
  const examples=[11,15,19].map(activeCourse.build);
  document.querySelector('#course-content').innerHTML=`<p class="lead">先想下一步，再逐步展开。观察每一步的结论和依据。</p><div class="example-grid">${examples.map((question,i)=>`<section class="question-card"><span class="eyebrow">例题 ${i+1}</span><h3>${esc(question.prompt)}</h3><ol class="worked-steps" id="worked-${i}" aria-live="polite"></ol><button class="secondary" data-worked="${i}">展开第 1 步</button></section>`).join('')}</div><button class="primary" id="examples-next">试试独立挑战 →</button>`;
  document.querySelectorAll('[data-worked]').forEach(button=>{let index=0;const i=Number(button.dataset.worked),question=examples[i];button.onclick=()=>{if(index>=question.steps.length)return;const s=question.steps[index++];document.querySelector(`#worked-${i}`).insertAdjacentHTML('beforeend',`<li><b>${esc(s.label)}</b><p class="worked-equation">${esc(stepAnswer(s))}</p><p class="note">${esc(s.reason)}</p></li>`);button.hidden=index===question.steps.length;button.textContent=`展开第 ${index+1} 步`;};});
  document.querySelector('#examples-next').onclick=()=>{coursePhase=2;renderCourse();};
}
function renderTask() {
  taskAccepted=false;
  const challenge=coursePhase===2,total=challenge?3:10;
  const question=activeCourse.build(challenge?[12,16,20][taskIndex]:taskIndex);
  const current=question.steps[taskStep];
  document.querySelector('#course-content').innerHTML=`<div class="quiz"><span class="eyebrow">${challenge?'独立挑战':'分步练习'} ${taskIndex+1} / ${total} · 第 ${taskStep+1} / ${question.steps.length} 步</span><section class="question-card"><h3>${esc(question.prompt)}</h3>${taskStep?`<div class="history">${question.steps.slice(0,taskStep).map(s=>`✓ ${esc(s.label)}：${esc(stepAnswer(s))}`).join('<br>')}</div>`:''}<form id="task-form" novalidate><p><b>${esc(current.label)}</b></p>${current.choices?`<div class="choice-list">${current.choices.map((choice,i)=>`<label class="choice"><input type="radio" name="task-answer" value="${esc(choice)}" required> ${esc(choice)}</label>`).join('')}</div>`:`<label class="answer-row"><span>本步结果${current.unit?`（${esc(current.unit)}）`:''}</span><input id="task-answer" name="task-answer" type="text" inputmode="decimal" autocomplete="off" placeholder="填写当前步骤" required></label>`}<div id="feedback" class="feedback" role="status"></div><div class="controls"><button class="primary" type="submit" id="task-check">检查这一步</button><button class="hint" type="button" id="task-hint">提示依据</button><button class="primary" type="button" id="task-next" hidden>${taskStep+1<question.steps.length?'继续下一步 →':taskIndex+1<total?'下一题 →':challenge?'进入 10 道分步练习 →':'完成本课 →'}</button></div></form></section><p class="note">先完成当前步骤，再继续。分数、根式和证明按题目要求分步填写。</p></div>`;
  document.querySelector('#task-hint').onclick=()=>feedback(current.reason);
  document.querySelector('#task-form').onsubmit=event=>{
    event.preventDefault();if(taskAccepted)return;
    const value=new FormData(event.target).get('task-answer');
    if(value===null||!String(value).trim()){feedback('请先填写或选择当前步骤的结果。');return;}
    if(!Courses.check(value,current.answer)){feedback(`这一步还不正确。${current.reason} 请检查当前步骤，不要跳到最后答案。`);return;}
    taskAccepted=true;feedback(`正确。${current.reason}`,true);
    document.querySelectorAll('#task-form input').forEach(input=>input.disabled=true);
    document.querySelector('#task-check').hidden=true;document.querySelector('#task-hint').hidden=true;document.querySelector('#task-next').hidden=false;
  };
  document.querySelector('#task-next').onclick=()=>{
    if(!taskAccepted)return;
    taskStep++;
    if(taskStep<question.steps.length){renderTask();return;}
    taskStep=0;taskIndex++;
    if(taskIndex<total){renderTask();return;}
    if(challenge){coursePhase=3;renderCourse();return;}
    Auth.saveCompletion(activeCourse.id,()=>{
    courseMarks.add(activeCourse.id);if(!Auth.online)try{localStorage.setItem('math-lab-courses-v1',JSON.stringify([...courseMarks]));}catch(_){/* 本地存储不可用时保留本次会话标记。 */}
    document.querySelector('#course-content').innerHTML=`<section class="result"><span class="eyebrow">本课已完成 ✓</span><h2>你把每一步都想清楚了。</h2><p>${esc(activeCourse.rule)}</p><p class="note">隔一天再试一次，看看能否独立解释这些步骤。</p><button class="primary" id="done-home">回到课程目录</button></section>`;
    document.querySelector('#done-home').onclick=catalogue;
    },document.querySelector('#course-content'));
  };
}
home=catalogue;
Auth.start(catalogue);

