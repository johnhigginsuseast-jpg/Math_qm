(function (root) {
  'use strict';
  const control = (label, min, max, value, step = 1) => ({ label, min, max, value, step });
  const svg = body => `<svg viewBox="0 0 480 280" role="img" aria-label="数学实验图示">${body}</svg>`;
  const text = (x, y, label, size = 16) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#365c49">${String(label).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</text>`;
  const line = (x1,y1,x2,y2,color='#698b68') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="3"/>`;
  const dot = (x,y,color='#276954') => `<circle cx="${x}" cy="${y}" r="6" fill="${color}"/>`;
  function make(kind, intro, controls, observe) { return { kind, intro, controls, observe }; }
  function numberLine(mode) {
    return make('数轴', '先预测：改变数的位置后，坐标、相反数与到原点的距离会怎样变化？', mode==='add'?[control('数 a',-8,8,-3),control('变化量 b',-4,4,2)]:[control('数 a',-8,8,-3)], ([a,b=0]) => {
      const result = mode === 'add' ? a+b : mode === 'negative' ? -a : mode === 'absolute' ? Math.abs(a) : a;
      let body = line(25,145,455,145);
      for(let i=-12;i<=12;i++) body += line(240+i*17,140,240+i*17,150)+text(240+i*17,173,i,10);
      body += dot(240+a*17,145)+text(240+a*17,112,`a=${a}`);
      if(mode !== 'signed') body += dot(240+result*17,145,'#c38b37')+text(240+result*17,208,`结果 ${result}`);
      const explanation = mode === 'add' ? `${a}＋${b<0?`(${b})`:b}＝${result}；正数向右，负数向左。` : mode === 'negative' ? `${a} 的相反数是 ${result}，关于原点对称。` : mode === 'absolute' ? `|${a}|＝${result}。绝对值表示距离，不会小于 0。` : `${a} ${a>0?'是正数':a<0?'是负数':'既不是正数也不是负数'}；数轴上越右边的数越大。`;
      return { svg:svg(body), text:explanation };
    });
  }
  function area(mode = 'square') {
    return make('面积拼接', '先预测：改变边长后，总面积和各部分面积有什么关系？', [control('边长 a',1,7,4),control('边长 b',1,5,2)], ([a,b]) => {
      const scale=16, total=(a+b)*scale;
      const body=`<rect x="70" y="35" width="${total}" height="${total}" fill="#c9d9b8" stroke="#547955"/><rect x="70" y="35" width="${a*scale}" height="${a*scale}" fill="#6c9d78"/><rect x="${70+a*scale}" y="${35+a*scale}" width="${b*scale}" height="${b*scale}" fill="#e4b96c"/>${line(70+a*scale,35,70+a*scale,35+total)}${line(70,35+a*scale,70+total,35+a*scale)}${text(320,80,`a²=${a*a}`)}${text(320,115,`ab=${a*b}`)}${text(320,150,`b²=${b*b}`)}`;
      const explanation=mode==='difference' ? `若 a>b，(a＋b)(a−b)＝a²−b²。当前差 ${a*a-b*b}；${a>b?'长度均为正，可以解释为面积':'a≤b，a−b 不能作为正长度，改用代数等式说明'}。` : mode==='factor' ? `同一块面积可以求和，也可以写成边长的乘积：(a＋b)²＝a²＋2ab＋b²。展开和因式分解互为逆过程。` : `(a＋b)²＝${(a+b)**2}；a²＋2ab＋b²＝${a*a+2*a*b+b*b}。两块长方形分别贡献 ab。`;
      const differenceBody=a>b?`<rect x="25" y="40" width="${a*20}" height="${a*20}" fill="#c9d9b8" stroke="#547955"/><rect x="25" y="40" width="${b*20}" height="${b*20}" fill="#e4b96c"/><rect x="250" y="40" width="${(a+b)*14}" height="${(a-b)*14}" fill="#c9d9b8" stroke="#547955"/>${text(100,235,`a²−b²=${a*a-b*b}`)}${text(330,235,`(a＋b)(a−b)=${a*a-b*b}`)}`:text(240,140,'a≤b：改用代数等式，不能解释为正面积');
      return {svg:svg(mode==='difference'?differenceBody:body),text:explanation};
    });
  }
  function table(intro, controls, observe) {
    return make('数量关系',intro,controls, values => {
      const result=observe(values);
      return {svg:svg(`${text(240,75,result.heading||'改变条件，比较结果',19)}${(result.lines||[]).map((s,i)=>text(240,125+i*38,s,17)).join('')}`),text:result.text};
    });
  }
  function graph(mode='linear') {
    const controls=mode==='inverse'?[control('k（非零）',-8,8,4)]:mode==='quadratic'?[control('a（非零）',-3,3,1),control('顶点横坐标 h',-3,3,0),control('顶点纵坐标 v',-3,3,0)]:[control('k',-3,3,1),control('b',-4,4,2)];
    return make('函数图像','先预测参数变化的效果，再调整滑块。公式、图像和坐标同步变化。',controls, values => {
      let body=line(30,140,450,140)+line(240,20,240,260);
      if(mode!=='linear'&&values[0]===0)return {svg:svg(body+text(240,75,'参数不能为0')),text:mode==='inverse'?'k＝0时不属于反比例函数。请选择非零k。':'a＝0时没有二次项，不属于二次函数。请选择非零a。'};
      for(let i=-6;i<=6;i++) {body+=text(240+i*30,158,i,10);if(i)body+=text(225,140-i*30,i,10);}
      const f=x=>mode==='inverse'?values[0]/x:mode==='quadratic'?values[0]*(x-values[1])**2+values[2]:values[0]*x+values[1];
      let d='',started=false;
      for(let i=-210;i<=210;i+=2){const x=i/30,y=f(x);if(!Number.isFinite(y)||Math.abs(y)>4){started=false;continue;}d+=`${started?'L':'M'}${240+i},${140-y*30} `;started=true;}
      body+=`<path d="${d}" fill="none" stroke="#276954" stroke-width="3"/>`;
      const explanation=mode==='inverse'?`y=${values[0]}/x，x≠0。两支图像分开；在各自区间内随 x 增大而${values[0]>0?'减小':'增大'}。取 x=2，y=${values[0]/2}，xy=${values[0]}。`:mode==='quadratic'?`y=${values[0]}(x−(${values[1]}))²＋(${values[2]})；顶点 (${values[1]},${values[2]})，对称轴 x=${values[1]}，${values[0]>0?'最小':'最大'}值 ${values[2]}，开口向${values[0]>0?'上':'下'}。`:`y=${values[0]}x＋(${values[1]})，y 轴交点 (0,${values[1]})。${values[0]===0?'此时为常函数，不属于 k≠0 的一次函数。':values[0]>0?'随 x 增大，y 增大。':'随 x 增大，y 减小。'}`;
      return {svg:svg(body),text:explanation};
    });
  }
  function triangle(mode='angles') {
    const locked=['isosceles','similar','right','pythagoras'].includes(mode);
    return make('几何探索','先预测：顶点改变后，哪些角度或长度关系保持成立？滑块改变顶点，并保持当前模型的已知条件。',[control(locked?'底边长':'顶点水平位置',80,360,230),control('高',60,170,130)],([x,h])=>{
      let ax=60,ay=220,bx=420,by=220,cx=x,cy=220-h;
      if(locked){bx=60+x;cx=mode==='isosceles'?60+x/2:60;}
      const ab=bx-ax,ac=Math.hypot(cx-ax,h),bc=Math.hypot(bx-cx,h);
      const A=Math.atan2(h,cx-ax)*180/Math.PI,B=Math.atan2(h,bx-cx)*180/Math.PI,C=180-A-B;
      let body=`<polygon points="${ax},${ay} ${bx},${by} ${cx},${cy}" fill="#dce6ce" stroke="#5c805a" stroke-width="3"/>${dot(cx,cy)}${text(ax,247,'A')}${text(bx,247,'B')}${text(cx,cy-12,'C')}`;
      body+=line(cx,cy,cx,ay,'#c28d3f');
      const explanation=mode==='right'||mode==='pythagoras'?`保持 ∠A=90°。两直角边为 ${ab}、${h}，斜边约 ${bc.toFixed(2)}；${ab}²＋${h}²＝${ab*ab+h*h}，与斜边平方相等。`:mode==='isosceles'?`顶点保持在底边的垂直平分线上，CA=CB≈${ac.toFixed(2)}；底角相等，高同时平分底边与顶角。`:mode==='similar'?`保持直角三角形模型。整体按比例缩放时，对应边之比相同，角不变，面积按比例的平方变化。当前面积=${ab*h/2}。`:`∠A≈${A.toFixed(1)}°，∠B≈${B.toFixed(1)}°，∠C≈${C.toFixed(1)}°，和为180°。测量帮助发现，证明需要平行线角关系等依据。`;
      return {svg:svg(body),text:explanation};
    });
  }
  function circle(mode='angle') {
    const distanceMode=['position','point','chord','tangent'].includes(mode);
    const controls=distanceMode?[control('到圆心距离 d',mode==='tangent'?100:0,mode==='chord'?90:mode==='tangent'?180:160,mode==='tangent'?150:60)]:[control('圆心角 θ',20,mode==='cyclic'?160:180,mode==='diameter'?180:80)];
    if(mode==='sector')controls.push(control('半径 R',1,8,3));
    return make('圆的探索','先预测，再改变角度或距离。观察量的变化和适用条件。',controls,(values)=>{
      const theta=distanceMode?80:values[0],d=distanceMode?values[0]:60,R=mode==='sector'?values[1]:90;
      const angle=theta*Math.PI/180,cx=235,cy=140,r=mode==='sector'?R*15:90;
      const A=[cx+r,cy],B=[cx+r*Math.cos(angle),cy-r*Math.sin(angle)],P=[cx,cy+r];
      let body=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#e4ead6" stroke="#64835f" stroke-width="3"/>${dot(cx,cy)}${text(cx-10,cy+20,'O')}`;
      let observation;
      if(mode==='point'){body+=dot(cx+d,cy,'#c08b39')+text(cx+d,cy-18,'P');observation=`OP=${d}，r=90。点P在${d<r?'圆内':d===r?'圆上':'圆外'}。`;}
      else if(mode==='tangent'){
        const tx=r*r/d,ty=r*Math.sqrt(d*d-r*r)/d,T1=[cx+tx,cy-ty],T2=[cx+tx,cy+ty],external=[cx+d,cy];
        body+=line(...external,...T1,'#c08b39')+line(...external,...T2,'#c08b39')+line(cx,cy,...T1)+line(cx,cy,...T2)+dot(...external)+text(external[0],external[1]-15,'P');
        observation=`OP=${d}>r=90。两切线长都为√(OP²−r²)≈${Math.sqrt(d*d-r*r).toFixed(2)}。半径与对应切线垂直。`;
      }else if(mode==='position'||mode==='chord'){
        body+=line(60,cy-d,425,cy-d,'#c08b39')+line(cx,cy,cx,cy-d)+text(350,260,`r=90, d=${d}`);
        observation=mode==='chord'?`垂足平分弦。半弦长√(90²−${d}²)≈${Math.sqrt(r*r-d*d).toFixed(2)}。${d===90?'此时退化为切点，不是非零弦。':'整弦是半弦的2倍。'}`:`圆心到直线距离d=${d}；${d<r?'d<r，相交':d===r?'d=r，相切':'d>r，相离'}。`;
      }else if(mode==='cyclic'){
        const C=[cx-r,cy],D=[cx,cy+r];body+=`<polygon points="${[A,B,C,D].map(p=>p.join(',')).join(' ')}" fill="none" stroke="#c08b39" stroke-width="3"/>`+text(A[0]+15,A[1],'A')+text(...[B[0],B[1]-12],'B')+text(C[0]-15,C[1],'C')+text(D[0],D[1]+18,'D');
        observation=`四点共圆。∠A=${(270-theta)/2}°，∠C=${(90+theta)/2}°，对角之和180°。`;
      }else{
        body+=mode==='sector'?`<path d="M${cx},${cy} L${A.join(',')} A${r},${r} 0 0 0 ${B.join(',')} Z" fill="#e7bb71"/>${line(cx,cy,...A)}${line(cx,cy,...B)}${text(360,260,`θ=${theta}°`)}`:line(cx,cy,...A)+line(cx,cy,...B)+line(...P,...A,'#c08b39')+line(...P,...B,'#c08b39')+text(360,260,`θ=${theta}°`)+text(A[0]+15,A[1],'A')+text(B[0],B[1]-12,'B')+text(P[0],P[1]+18,'P');
        observation=mode==='sector'?`半径${R}，圆心角${theta}°；弧长=${theta}/360×2π×${R}，扇形面积=${theta}/360×π×${R}²。`:`同一条弧所对圆周角为${theta/2}°。当θ=180°时，AB是直径，圆周角90°。`;
      }
      return {svg:svg(body),text:observation};
    });
  }
  function transform(mode='translation') {
    const controls=mode==='rotation'?[control('旋转角度',0,180,90,15)]:mode==='reflection'?[control('原图水平位置',-3,3,0)]:[control('水平位移',-3,3,2),control('垂直位移',-2,2,0)];
    return make('图形变换','预测对应点的位置，再调整参数；比较图形的长度和角度。',controls,(values)=>{
      const dx=values[0],dy=values[1]||0,angle=mode==='rotation'?values[0]:0;
      const original=[[1,1],[3,1],[2,3]].map(([x,y])=>[x+(mode==='reflection'?dx:0),y]);
      const rad=angle*Math.PI/180;
      const changed=original.map(([x,y])=>mode==='reflection'?[-x,y]:mode==='rotation'?[x*Math.cos(rad)-y*Math.sin(rad),x*Math.sin(rad)+y*Math.cos(rad)]:[x+dx,y+dy]);
      const points=p=>p.map(([x,y])=>`${240+x*30},${180-y*30}`).join(' ');
      return {svg:svg(`${line(25,180,455,180)}${line(240,15,240,265)}<polygon points="${points(original)}" fill="#c9dcb4" stroke="#668962"/><polygon points="${points(changed)}" fill="#e8c48788" stroke="#b17b33"/>`),text:mode==='reflection'?'关于 y 轴对称：(x,y)→(−x,y)。对应点到对称轴的距离相等。':mode==='rotation'?`绕原点逆时针旋转 ${angle}°。到旋转中心的距离及边长不变。`:`平移向量(${dx},${dy})：(x,y)→(x＋${dx},y＋${dy})，图形大小和形状不变。`};
    });
  }
  function statistics(mode='bar') {
    return make('数据观察','先预测：只改变一个数据，平均数、中位数和波动都会怎样变化？',[control('最后一个数据',0,20,8)],([last])=>{
      const data=[2,4,4,6,last],sorted=[...data].sort((a,b)=>a-b),mean=data.reduce((a,b)=>a+b,0)/5,variance=data.reduce((a,b)=>a+(b-mean)**2,0)/5;
      const body=mode==='line'?`<polyline points="${data.map((v,i)=>`${77+i*75},${230-v*9}`).join(' ')}" fill="none" stroke="#276954" stroke-width="3"/>${data.map((v,i)=>dot(77+i*75,230-v*9)+text(77+i*75,253,v)).join('')}`:data.map((v,i)=>`<rect x="${55+i*75}" y="${230-v*9}" width="45" height="${v*9}" fill="${i===4?'#e2b772':'#7ba17b'}"/>${text(77+i*75,253,v)}`).join('');
      return {svg:svg(body),text:`数据：[${data.join(', ')}]。平均数=${mean.toFixed(2)}，中位数=${sorted[2]}，方差=${variance.toFixed(2)}。极端值会影响平均数和方差；中位数由排序后的位置决定。`};
    });
  }
  function probability() {
    return make('概率实验','预测掷硬币的结果。点击“做100次试验”观察频率；试验结果会波动。',[],()=>({svg:svg(`${text(240,100,'公平硬币：正面 / 反面',22)}${text(240,155,'理论概率各为 1/2')}`),text:'两个结果等可能；有限次试验的正面频率不一定恰好等于 1/2。'}));
  }
  function quadrilateral(mode='parallelogram') {
    return make('四边形探索','预测边角关系，再改变形状。矩形保持直角，菱形保持四边相等，正方形同时保持两种条件。',[control('角度 α',40,130,70),control('边长',60,130,100)],([angle,length])=>{
      if(mode==='rectangle'||mode==='square')angle=90;
      const rad=angle*Math.PI/180,bottom=mode==='rhombus'||mode==='square'?length:180,dx=length*Math.cos(rad),dy=length*Math.sin(rad);
      const A=[90,220],B=[90+bottom,220],D=[90+dx,220-dy],C=[90+bottom+dx,220-dy];
      return {svg:svg(`<polygon points="${[A,B,C,D].map(p=>p.join(',')).join(' ')}" fill="#d9e4c9" stroke="#5a7d57" stroke-width="3"/>${line(...A,...C,'#c18e40')}${line(...B,...D,'#c18e40')}${text(A[0],245,'A')}${text(B[0],245,'B')}${text(C[0],C[1]-10,'C')}${text(D[0],D[1]-10,'D')}`),text:`对边平行且相等；邻角${angle}°与${180-angle}°互补。${mode==='rhombus'?'四边相等，对角线垂直平分。':mode==='rectangle'?'四角直角，对角线相等且互相平分。':mode==='square'?'四边相等、四角直角，两组性质同时具备。':'对角线互相平分，但一般不相等也不垂直。'}`};
    });
  }
  function similar() {
    return make('缩放实验','先预测：边长扩大k倍，面积会扩大几倍？',[control('缩放比例 k',1,3,2,.5)],([k])=>({svg:svg(`<polygon points="30,250 90,250 30,170" fill="#a4c496"/><polygon points="200,250 ${200+60*k},250 200,${250-80*k}" fill="#e6bd79"/>${text(75,274,'原三角形')}${text(315,274,`缩放 ${k} 倍`)}`),text:`对应角不变，所有对应边扩大${k}倍；面积从2400扩大到${2400*k*k}，面积比为${k*k}。相似只需形状相同，不要求大小相同。`}));
  }
  function trapezoid() {
    return make('梯形面积','预测：上底改变时，面积怎样变化？',[control('上底 a',1,8,3),control('下底 b',2,10,7),control('高 h',1,8,4)],([a,b,h])=>({svg:svg(`<polygon points="${240-a*10},${230-h*20} ${240+a*10},${230-h*20} ${240+b*10},230 ${240-b*10},230" fill="#d6e3c5" stroke="#63845e"/>${line(240,230-h*20,240,230,'#c48c3b')}${text(240,255,`下底 ${b}`)}${text(240,210-h*20,`上底 ${a}`)}${text(270,230-h*10,`高 ${h}`)}`),text:`S=(a＋b)h/2＝${(a+b)*h/2}。高是平行底边之间的垂直距离。将两个相同梯形拼成平行四边形，可解释除以2。`}));
  }
  function cone() {
    return make('圆锥展开','预测：圆锥母线与高是同一个量吗？改变底面半径和高。',[control('半径 r',1,6,3),control('高 h',1,8,4)],([r,h])=>{const l=Math.hypot(r,h);return {svg:svg(`<path d="M160,${230-h*20} L${160-r*15},230 A${r*15},15 0 0 0 ${160+r*15},230 Z" fill="#d8e3c9" stroke="#66865f"/>${line(160,230-h*20,160,230,'#c18c3e')}${line(160,230,160+r*15,230,'#c18c3e')}${text(355,90,`母线 l≈${l.toFixed(2)}`)}${text(355,140,`半径 r=${r}`)}${text(355,190,`高 h=${h}`)}`),text:`l²=r²+h²；侧面扇形的半径是l，弧长是底面周长2πr。侧面积πrl≈${(Math.PI*r*l).toFixed(2)}，再加底面积πr²得到全面积。`};});
  }
  function dice() {
    return make('列表实验','预测两枚骰子点数和，改变目标点数，看看哪些有序结果被选中。',[control('目标点数和',2,12,7)],([target])=>{
      let body='',count=0;for(let a=1;a<=6;a++)for(let b=1;b<=6;b++){const selected=a+b===target;count+=selected?1:0;body+=`<rect x="${55+(a-1)*59}" y="${20+(b-1)*40}" width="55" height="36" rx="4" fill="${selected?'#e4b66c':'#e3e9d8'}"/>${text(82+(a-1)*59,44+(b-1)*40,`${a},${b}`,12)}`;}
      return {svg:svg(body),text:`36个等可能有序结果，其中和为${target}有${count}个，概率${count}/36。两枚骰子可区分，因此(1,2)和(2,1)是不同结果。`};
    });
  }
  function tree() {
    return make('树状图实验','预测放回与不放回的区别，再改变球数和抽法。',[control('红球数',1,4,2),control('蓝球数',1,4,2),control('是否放回（1是，0否）',0,1,0)],([r,b,replacement])=>{
      const total=r+b,remaining=total-(replacement?0:1),afterRed=r-(replacement?0:1),afterBlue=b-(replacement?0:1);
      const body=line(45,140,180,70)+line(45,140,180,210)+line(180,70,380,40)+line(180,70,380,105)+line(180,210,380,175)+line(180,210,380,245)+text(60,130,'开始')+text(175,55,`红 ${r}/${total}`)+text(175,235,`蓝 ${b}/${total}`)+text(390,30,`红 ${afterRed}/${remaining}`)+text(390,125,`蓝 ${b}/${remaining}`)+text(390,165,`红 ${r}/${remaining}`)+text(390,265,`蓝 ${afterBlue}/${remaining}`);
      return {svg:svg(body),text:`${replacement?'放回：第二次球数不变':'不放回：第二次总数减少1，并减少已抽取颜色的球数'}。红→红路径概率为${r}/${total}×${afterRed}/${remaining}，每层分支合计概率为1。`};
    });
  }
  function scientific() {
    return table('预测小数点移动与指数的关系。',[control('系数 a',1,9,3),control('指数 n',-5,5,3)],([a,k])=>({lines:[`a=${a}，n=${k}`,`${a}×10^(${k})＝${Number((a*10**k).toPrecision(10))}`],text:'系数保持1≤|a|<10。指数为正表示较大的数量，为负表示较小的正数量；指数不是数值的正负号。'}));
  }
  function triangleSides() {
    return make('三边搭建','预测第三边能否与3、4组成三角形，再改变长度。',[control('第三边 c',1,8,5)],([c])=>{
      const valid=c>1&&c<7,px=(9+16-c*c)/6;
      const body=valid?`<polygon points="130,230 220,230 ${130+px*30},${230-Math.sqrt(Math.max(0,16-px*px))*30}" fill="#d9e4cb" stroke="#68845f"/>${text(175,255,'边3')}${text(95,155,'边4')}${text(290,155,`边${c}`)}`:line(90,100,180,100)+line(90,160,210,160)+line(90,220,90+c*30,220)+text(350,140,'无法闭合为三角形');
      return {svg:svg(body),text:`第三边必须满足1<c<7。当前c=${c}，${valid?'能构成三角形':'不能构成三角形'}；等于1或7时退化，不能包含端点。`};
    });
  }
  function inverseArea() {
    return make('反比例面积','固定k，预测x增大时y和矩形面积会怎样变化。',[control('k',1,12,6),control('x',1,6,2)],([k,x])=>{const y=k/x;return {svg:svg(`<rect x="100" y="${245-y*18}" width="${x*30}" height="${y*18}" fill="#d5e2c6" stroke="#66885e"/>${text(100+x*15,270,`x=${x}`)}${text(65,245-y*9,`y≈${y.toFixed(2)}`)}${text(345,100,`xy=${k}`)}`),text:`y=k/x=${k}/${x}≈${y.toFixed(3)}，面积xy始终等于${k}。对负k，几何面积取|k|，不能解释为负面积。`};});
  }
  function movingArea() {
    return make('动点面积','预测参数t怎样影响面积。先观察有效范围，再找面积最大的位置。',[control('总长度 W',6,10,8),control('底边 t',1,9,3)],([w,t])=>{const h=w-t;if(h<=0)return {svg:svg(text(240,140,'t必须小于W，才能构成正高度三角形')),text:`当前t=${t}，W=${w}，高度W−t≤0，不是题目要求的三角形。`};return {svg:svg(`<polygon points="90,235 ${90+t*25},235 90,${235-h*25}" fill="#d6e2c7" stroke="#66885e"/>${text(90+t*12.5,263,`底边 t=${t}`)}${text(48,235-h*12.5,`高 ${h}`)}${text(365,110,`S=${t*h/2}`)}`),text:`S=t(W−t)/2＝${t*h/2}，0<t<W。配方为S=−(t−W/2)²/2＋W²/8，最大面积在t=${w/2}处。`};});
  }
  function reflectedPath() {
    return make('最短路径','预测河岸上哪里使总路程最短，再移动P。',[control('岸上点横坐标 t',0,8,2)],([t])=>({svg:svg(`${line(20,180,455,180)}${line(50,90,50+t*30,180)}${line(50+t*30,180,290,90)}${line(50,270,290,90,'#c28b3e')}${dot(50,90)}${dot(290,90)}${dot(50,270,'#c28b3e')}${dot(50+t*30,180)}${text(35,70,'A')}${text(305,70,'B')}${text(30,268,'A′')}${text(50+t*30,205,'P')}`),text:`AP＋PB≈${(Math.hypot(t,3)+Math.hypot(8-t,3)).toFixed(3)}。A′P＝AP；当P在直线A′B上（t=4）时，总长最小为10。` }));
  }
  function rootBoard() {
    return make('面积与开方','预测：正方形面积增加，边长怎样变化？平方根与算术平方根有何区别？',[control('面积 S',0,64,9)],([s])=>{const side=Math.sqrt(s);return {svg:svg(`<rect x="120" y="${235-side*22}" width="${side*22}" height="${side*22}" fill="#d4e2c3" stroke="#65875e"/>${text(120+side*11,263,`边长 √${s}≈${side.toFixed(3)}`)}`),text:`面积S=${s}，非负边长√S≈${side.toFixed(3)}。${s===0?'0的平方根只有0。':'代数平方根还有负的一根，但负数不能作边长。'}完全平方数给出整数边长，其他整数的平方根需用根式保留精确值。`};});
  }
  function polygon() {
    return make('多边形分割','预测n边形能分成几个三角形，再改变边数。',[control('边数 n',3,10,5)],([count])=>{const pts=Array.from({length:count},(_,i)=>[240+100*Math.cos(-Math.PI/2+i*2*Math.PI/count),145+100*Math.sin(-Math.PI/2+i*2*Math.PI/count)]);const body=`<polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="#d7e3c8" stroke="#66875e" stroke-width="3"/>${pts.slice(2,-1).map(p=>line(...pts[0],...p,'#c38b3e')).join('')}`;return {svg:svg(body),text:`从一个顶点连向非相邻顶点，分成${count-2}个三角形；内角和${(count-2)*180}°，外角和360°。正多边形一个外角为360/${count}°。`};});
  }
  const api={control,make,table,numberLine,area,graph,triangle,circle,transform,statistics,probability,quadrilateral,similar,trapezoid,cone,dice,tree,scientific,triangleSides,inverseArea,movingArea,reflectedPath,rootBoard,polygon};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Experiments=api;
})(typeof globalThis!=='undefined'?globalThis:this);

