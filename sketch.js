let nodes = [];
const weekLabels = ['1', '2-1', '2-2', '3-1', '3-2', '4', '5', '7-1', '7-2']; // 更新後的週次標籤
let particles = []; // 儲存星光粒子的陣列
let backgroundStars = []; // 儲存背景星星的陣列

function setup() {
  // 將畫布大小設定為左側容器的尺寸
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  
  // 根據 weekLabels 陣列產生節點
  const numNodes = weekLabels.length;
  for (let i = 0; i < numNodes; i++) {
    // 改為橫向佈局
    let x = map(i, 0, numNodes - 1, width * 0.15, width * 0.85);
    let yOffset = sin(i * 1.5) * 40;
    let y = height / 2 + yOffset;
    
    // 建立每個週次的物件 (X, Y, 週次標籤)
    nodes.push(new TimeNode(x, y, weekLabels[i]));
  }

  // 產生背景星星
  for (let i = 0; i < 150; i++) {
    backgroundStars.push(new Star());
  }
}

function draw() {
  background(11, 12, 16); // 與 CSS 搭配的深色背景

  // --- 顯示背景星點 ---
  for (let star of backgroundStars) {
    star.display();
  }

  // --- 更新與顯示向上流動的星光粒子 ---
  // 降低粒子生成速率，並讓它們從底部出現
  if (frameCount % 2 === 0) {
    let x = width / 2 + random(-60, 60);
    let y = height + 10; // 從畫布底部開始
    particles.push(new Particle(x, y));
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }

  // --- 繪製發光藤蔓 ---
  // 透過 frameCount 和 sin() 讓藤蔓上下搖擺
  const swaySpeed = 0.02;
  const swayAmount = 15;
  const startX = -100;
  const endX = width + 100;

  push();
  noFill();
  // 1. 將藤蔓本身改為淡黃色
  stroke(255, 255, 200); 
  strokeWeight(3);
  // 利用 Canvas API 產生發光效果
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = color(255, 255, 200, 150);

  beginShape();
  let startSway = sin(startX * 0.01 + frameCount * swaySpeed) * swayAmount;
  curveVertex(startX, height / 2 + startSway); 
  curveVertex(startX, height / 2 + startSway);
  for (let node of nodes) {
    // 每個節點的搖擺幅度根據其X座標而略有不同，更自然
    let nodeSway = sin(node.baseX * 0.01 + frameCount * swaySpeed) * swayAmount;
    curveVertex(node.baseX, node.baseY + nodeSway);
  }
  let endSway = sin(endX * 0.01 + frameCount * swaySpeed) * swayAmount;
  curveVertex(endX, height / 2 + endSway);
  curveVertex(endX, height / 2 + endSway);
  endShape();
  pop();

  // 2. 繪製纏繞的白色線條
  push();
  noFill();
  stroke(255, 255, 255, 150); // 白色、半透明
  strokeWeight(1);
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = color(255);
  beginShape();
  let wrapFrequency = 0.02;
  let wrapAmplitude = 35;
  let wrapStartSway = sin(startX * 0.01 + frameCount * swaySpeed) * swayAmount;
  curveVertex(startX, height / 2 + wrapStartSway + sin(startX * wrapFrequency) * wrapAmplitude);
  curveVertex(startX, height / 2 + wrapStartSway + sin(startX * wrapFrequency) * wrapAmplitude);
  for (let node of nodes) {
    let nodeSway = sin(node.baseX * 0.01 + frameCount * swaySpeed) * swayAmount;
    let wrapY = node.baseY + nodeSway + sin(node.baseX * wrapFrequency) * wrapAmplitude;
    curveVertex(node.baseX, wrapY);
  }
  let wrapEndSway = sin(endX * 0.01 + frameCount * swaySpeed) * swayAmount;
  curveVertex(endX, height / 2 + wrapEndSway + sin(endX * wrapFrequency) * wrapAmplitude);
  curveVertex(endX, height / 2 + wrapEndSway + sin(endX * wrapFrequency) * wrapAmplitude);
  endShape();
  pop();

  // 3. 繪製第二條纏繞線條 (較細、較寬)
  push();
  noFill();
  stroke(255, 255, 255, 120); // 更透明一點
  strokeWeight(0.5); // 較細
  drawingContext.shadowBlur = 8;
  drawingContext.shadowColor = color(255);
  beginShape();
  let wrapFrequency2 = 0.025;
  let wrapAmplitude2 = 45;
  // 使用 PI 來讓它從另一側開始纏繞
  let wrapStartSway2 = sin(startX * 0.01 + frameCount * swaySpeed) * swayAmount;
  curveVertex(startX, height / 2 + wrapStartSway2 + sin(startX * wrapFrequency2 + PI) * wrapAmplitude2);
  curveVertex(startX, height / 2 + wrapStartSway2 + sin(startX * wrapFrequency2 + PI) * wrapAmplitude2);
  for (let node of nodes) {
    let nodeSway = sin(node.baseX * 0.01 + frameCount * swaySpeed) * swayAmount;
    let wrapY = node.baseY + nodeSway + sin(node.baseX * wrapFrequency2 + PI) * wrapAmplitude2;
    curveVertex(node.baseX, wrapY);
  }
  let wrapEndSway2 = sin(endX * 0.01 + frameCount * swaySpeed) * swayAmount;
  curveVertex(endX, height / 2 + wrapEndSway2 + sin(endX * wrapFrequency2 + PI) * wrapAmplitude2);
  curveVertex(endX, height / 2 + wrapEndSway2 + sin(endX * wrapFrequency2 + PI) * wrapAmplitude2);
  endShape();
  pop();

  // 4. 繪製第三條纏繞線條 (較粗、較緊)
  push();
  noFill();
  stroke(255, 255, 255, 180); // 較不透明
  strokeWeight(1.5); // 較粗
  drawingContext.shadowBlur = 12;
  drawingContext.shadowColor = color(255);
  beginShape();
  let wrapFrequency3 = 0.015;
  let wrapAmplitude3 = 25;
  // 使用 PI/2 來產生不同的相位
  let wrapStartSway3 = sin(startX * 0.01 + frameCount * swaySpeed) * swayAmount;
  curveVertex(startX, height / 2 + wrapStartSway3 + sin(startX * wrapFrequency3 + PI / 2) * wrapAmplitude3);
  curveVertex(startX, height / 2 + wrapStartSway3 + sin(startX * wrapFrequency3 + PI / 2) * wrapAmplitude3);
  for (let node of nodes) {
    let nodeSway = sin(node.baseX * 0.01 + frameCount * swaySpeed) * swayAmount;
    let wrapY = node.baseY + nodeSway + sin(node.baseX * wrapFrequency3 + PI / 2) * wrapAmplitude3;
    curveVertex(node.baseX, wrapY);
  }
  let wrapEndSway3 = sin(endX * 0.01 + frameCount * swaySpeed) * swayAmount;
  curveVertex(endX, height / 2 + wrapEndSway3 + sin(endX * wrapFrequency3 + PI / 2) * wrapAmplitude3);
  curveVertex(endX, height / 2 + wrapEndSway3 + sin(endX * wrapFrequency3 + PI / 2) * wrapAmplitude3);
  endShape();
  pop();

  // --- 更新與顯示所有節點 ---
  for (let node of nodes) {
    node.update();
    node.display();
  }
}

// 當滑鼠點擊時，觸發節點的點擊檢查
function mousePressed() {
  for (let node of nodes) {
    if (node.checkClick()) {
      break; // 點擊到一個節點後就停止檢查，避免重疊問題
    }
  }
}

// 當視窗縮放時自適應畫面
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重新計算節點位置
  const numNodes = nodes.length;
  for (let i = 0; i < numNodes; i++) {
    let x = map(i, 0, numNodes - 1, width * 0.15, width * 0.85);
    let yOffset = sin(i * 1.5) * 40;
    let y = height / 2 + yOffset;
    nodes[i].baseX = x;
    nodes[i].baseY = y;
    nodes[i].x = x;
    nodes[i].y = y;
  }
  // 重新產生背景星星以適應新畫布
  backgroundStars = [];
  for (let i = 0; i < 150; i++) {
    backgroundStars.push(new Star());
  }
}

// --- 節點 (TimeNode) 類別 ---
class TimeNode {
  constructor(x, y, weekLabel) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.weekLabel = weekLabel;
    
    this.baseRadius = 15; // 基礎大小
    this.radius = this.baseRadius;
    this.isHovered = false;
    this.isActive = false; // 新增：是否為當前點擊的節點
    
    // 根據標籤產生對應的 HTML 檔案路徑
    // 最簡單的方式：將所有檔案放在同一個資料夾，直接跳轉到對應的 html 檔案
    this.url = `week${weekLabel}.html`;
  }

  update() {
    // 讓節點跟著藤蔓上下搖擺
    const swaySpeed = 0.02;
    const swayAmount = 15;
    this.y = this.baseY + sin(this.baseX * 0.01 + frameCount * swaySpeed) * swayAmount;

    if (this.isActive) {
      // 如果是當前啟動的節點，給它一個緩慢的脈動效果
      this.radius = this.baseRadius + sin(frameCount * 0.05) * 3;
      return;
    }

    // 檢查滑鼠是否懸停在節點上
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.baseRadius * 2) {
      this.isHovered = true;
      // 動態效果：像呼吸/心跳般跳動開花 (利用 sin 與 frameCount)
      this.radius = this.baseRadius + sin(frameCount * 0.15) * 8 + 5;
    } else {
      this.isHovered = false;
      // 平滑恢復成原本大小
      this.radius = lerp(this.radius, this.baseRadius, 0.1);
    }
  }

  display() {
    // 3. 根據節點是否為 active，決定繪製星星或圓形
    if (this.isActive) {
      this.drawStar();
    } else {
      this.drawCircle();
    }
    this.drawText();
  }

  drawCircle() {
    push();
    if (this.isHovered) {
      drawingContext.shadowBlur = 30;
      // 懸浮時改為白色
      drawingContext.shadowColor = color(255);
      fill(255);
      stroke(220);
    } else {
      drawingContext.shadowBlur = 15;
      drawingContext.shadowColor = color(255, 255, 200); // 配合藤蔓顏色
      fill(31, 40, 51);
      stroke(255, 255, 200);
    }
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius * 2);
    pop();
  }

  drawStar() {
    push();
    // 啟動狀態有更強的發光效果
    drawingContext.shadowBlur = 35;
    drawingContext.shadowColor = color(255, 255, 100);
    fill(255, 255, 220);
    noStroke();
    
    translate(this.x, this.y);
    rotate(frameCount * 0.01); // 讓星星緩慢旋轉

    let angle = TWO_PI / 5;
    let halfAngle = angle / 2.0;
    let outerRadius = this.radius * 1.6;
    let innerRadius = this.radius * 0.8;

    beginShape();
    for (let a = -PI / 2; a < TWO_PI - PI / 2; a += angle) {
      let sx = cos(a) * outerRadius;
      let sy = sin(a) * outerRadius;
      vertex(sx, sy);
      sx = cos(a + halfAngle) * innerRadius;
      sy = sin(a + halfAngle) * innerRadius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
    pop();
  }
  
  drawText() {
    push();
    noStroke();
    fill(255);
    drawingContext.shadowBlur = 0; // 關閉文字陰影以維持清晰度
    textSize(16);
    textStyle(BOLD);
    // 將文字改為 weekX 並置於節點下方
    textAlign(CENTER, TOP);
    text(`week${this.weekLabel}`, this.x, this.y + this.radius + 10);
    pop();
  }

  checkClick() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.baseRadius * 2) {
      // 觸發轉場動畫並導航
      playTransitionAndNavigate(this.url);
      return true; // 回傳 true 表示已處理點擊
    }
    return false; // 回傳 false 表示未點擊到此節點
  }
}

// --- 星光粒子 (Particle) 類別 ---
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    // 向上移動，帶有輕微的水平抖動
    this.vel = createVector(random(-0.3, 0.3), random(-0.5, -1.5));
    this.lifespan = 255;
    this.size = random(1, 3);
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan -= 2.5; // 粒子消失速度
  }

  display() {
    noStroke();
    // 粒子自身的發光效果
    drawingContext.shadowBlur = 8;
    drawingContext.shadowColor = color(255, 255, 255);
    fill(255, this.lifespan);
    ellipse(this.pos.x, this.y, this.size);
  }

  isDead() {
    return this.lifespan < 0;
  }
}

// --- 背景星星 (Star) 類別 ---
class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.twinkleOffset = random(TWO_PI);

    // 15% 的機率成為一顆會發亮的星星
    this.isBright = random() < 0.15;

    if (this.isBright) {
      this.size = random(1.5, 2.5);
      this.twinkleSpeed = random(0.04, 0.08); // 閃爍更快
      this.minAlpha = 80;
      this.maxAlpha = 255;
    } else {
      this.size = random(0.5, 1.5);
      this.twinkleSpeed = random(0.01, 0.04); // 正常速度
      this.minAlpha = 40;
      this.maxAlpha = 160;
    }
  }

  display() {
    // 使用 sin() 函數讓 alpha 值在一定範圍內平滑變化，產生閃爍效果
    let currentAlpha = map(sin(frameCount * this.twinkleSpeed + this.twinkleOffset), -1, 1, this.minAlpha, this.maxAlpha);
    
    push(); // 保存當前繪圖設置
    noStroke();
    
    // 發亮的星星有光暈效果
    if (this.isBright) {
      drawingContext.shadowBlur = this.size * 4;
      drawingContext.shadowColor = color(255, 255, 220, 100);
    }
    
    fill(255, 255, 255, currentAlpha);
    ellipse(this.x, this.y, this.size);
    pop(); // 恢復繪圖設置
  }
}

// --- 新增：轉場動畫函式 ---
function playTransitionAndNavigate(url) {
  const overlay = document.getElementById('transition-overlay');
  if (!overlay) return;

  overlay.style.display = 'block';

  // 創建一個新的 p5 實例來繪製轉場動畫
  new p5(s => {
    let stars = [];
    s.setup = () => {
      s.createCanvas(s.windowWidth, s.windowHeight).parent('transition-overlay');
      for (let i = 0; i < 400; i++) {
        stars.push({
          x: s.random(s.width),
          y: s.random(-s.height, 0), // 從螢幕上方開始
          speed: s.random(5, 15),
          size: s.random(1, 4)
        });
      }
      // 1.5秒後執行頁面跳轉
      setTimeout(() => {
        window.location.href = url;
      }, 1500);
    };

    s.draw = () => {
      s.background(11, 12, 16, 180); // 帶透明度的背景
      s.noStroke();
      s.fill(255);
      for (let star of stars) {
        star.y += star.speed;
        s.ellipse(star.x, star.y, star.size);
        if (star.y > s.height) {
          star.y = s.random(-100, -10); // 重置回頂部
        }
      }
    };
  });
}
