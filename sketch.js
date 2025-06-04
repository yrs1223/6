let video;
let handpose;
let predictions = [];

let catcherX = 320;
let ball;
let score = 0;

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO, () => {
    console.log("📷 相機已開啟");
  });
  video.size(width, height);
  video.hide(); // 不讓它自己跑，畫面我們自己畫

  handpose = ml5.handpose(video, () => {
    console.log("✋ 模型載入完成");
  });

  handpose.on("predict", (results) => {
    predictions = results;
  });

  ball = new Ball();
}

function draw() {
  background(220);

  // 正確畫鏡像畫面（這裡最容易出錯！）
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  scale(-1, 1);
  translate(-width, 0);

  // 讀手掌位置
  if (predictions.length > 0) {
    let hand = predictions[0].landmarks;
    let palmX = hand[9][0];
    catcherX = width - palmX; // 鏡像調整
  }

  // 畫接盤
  fill(0, 100, 255);
  rectMode(CENTER);
  rect(catcherX, height - 20, 80, 10);

  // 畫球
  ball.update();
  ball.display();

  // 判斷接球
  if (
    ball.y > height - 30 &&
    ball.x > catcherX - 40 &&
    ball.x < catcherX + 40
  ) {
    score += ball.correct ? 1 : -1;
    ball = new Ball();
  }

  // 掉出畫面就重生
  if (ball.y > height) {
    ball = new Ball();
  }

  // 畫分數
  fill(0);
  textSize(20);
  text("分數：" + score, 10, 30);
}

class Ball {
  constructor() {
    this.x = random(50, width - 50);
    this.y = 0;
    this.speed = 3;
    this.text = random(["3+1=4", "3+1=5"]);
    this.correct = this.text === "3+1=4";
  }

  update() {
    this.y += this.speed;
  }

  display() {
    fill(this.correct ? "green" : "red");
    ellipse(this.x, this.y, 40);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(this.text, this.x, this.y);
  }
}
