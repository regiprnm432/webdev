const LAYOUT_WIDTH = 100;
const LAYOUT_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;
 
const layoutElement = document.getElementById("layout");
const scoreElement = document.getElementById("score");
const startScreenElement = document.getElementById("start-screen");

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("keydown", handleGameStart, { once: true });

let lastTime;
let speedScale;
let scoreValue;

function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;

  updateGround(delta, speedScale);
  updateCharacter(delta, speedScale);
  updateObstacle(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  if (checkLoseCondition()) return handleGameLoss();

  lastTime = time;
  window.requestAnimationFrame(update);
}

function checkLoseCondition() {
  const characterRectangle = getCharacterRectangle();
  return getObstacleRectangles().some(rectangle => isCollision(rectangle, characterRectangle));
}

function isCollision(rectangle1, rectangle2) {
  return (
    rectangle1.left < rectangle2.right &&
    rectangle1.top < rectangle2.bottom &&
    rectangle1.right > rectangle2.left &&
    rectangle1.bottom > rectangle2.top
  );
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
  scoreValue += delta * 0.01;
  scoreElement.textContent = Math.floor(scoreValue);
}

function handleGameStart() {
  lastTime = null;
  speedScale = 1;
  scoreValue = 0;
  setupGround();
  setupCharacter();
  setupObstacle();
  startScreenElement.classList.add("hide");
  window.requestAnimationFrame(update);
}

function handleGameLoss() {
  setCharacterLoss();
  setTimeout(() => {
    document.addEventListener("keydown", handleGameStart, { once: true });
    startScreenElement.classList.remove("hide");
  }, 100);
}

function setPixelToWorldScale() {
  let worldToPixelScale;
  if (window.innerWidth / window.innerHeight < LAYOUT_WIDTH / LAYOUT_HEIGHT) {
    worldToPixelScale = window.innerWidth / LAYOUT_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / LAYOUT_HEIGHT;
  }

  layoutElement.style.width = `${LAYOUT_WIDTH * worldToPixelScale}px`;
  layoutElement.style.height = `${LAYOUT_HEIGHT * worldToPixelScale}px`;
}

const OBSTACLE_INTERVAL_MIN = 500;
const OBSTACLE_INTERVAL_MAX = 2000;
let nextObstacleTime;

export function setupObstacle() {
  nextObstacleTime = OBSTACLE_INTERVAL_MIN;
  document.querySelectorAll("[data-cactus]").forEach(cactus => {
    cactus.remove();
  });
}

export function updateObstacle(delta, speedScale) {
  document.querySelectorAll("[data-cactus]").forEach(cactus => {
    incrementCustomProperty(cactus, "--left", delta * speedScale * OBSTACLE_SPEED * -1);
    if (getCustomProperty(cactus, "--left") <= -100) {
      cactus.remove();
    }
  });

  if (nextObstacleTime <= 0) {
    createObstacle();
    nextObstacleTime = randomNumberBetween(OBSTACLE_INTERVAL_MIN, OBSTACLE_INTERVAL_MAX) / speedScale;
  }
  nextObstacleTime -= delta;
}

export function getObstacleRectangles() {
  return [...document.querySelectorAll("[data-cactus]")].map(cactus => {
    return cactus.getBoundingClientRect();
  });
}

function createObstacle() {
  const cactus = document.createElement("img");
  cactus.dataset.cactus = true;
  cactus.src = "assets/cactus.png";
  cactus.classList.add("cactus");
  setCustomProperty(cactus, "--left", 100);
  layoutElement.append(cactus);
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getCustomProperty(element, property) {
  return parseFloat(getComputedStyle(element).getPropertyValue(property)) || 0;
}

export function setCustomProperty(element, property, value) {
  element.style.setProperty(property, value);
} 

export function incrementCustomProperty(element, property, increment) {
  setCustomProperty(element, property, getCustomProperty(element, property) + increment);
}

const characterElement = document.getElementById("character");
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015; 
const CHARACTER_FRAME_COUNT = 2;
const FRAME_TIME = 100;
let isJumping;
let characterFrame;
let currentFrameTime;
let yVelocity;
 
export function setupCharacter() {
  isJumping = false;
  characterFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(characterElement, "--bottom", 0);
  document.removeEventListener("keydown", jumpOnKeyPress);
  document.addEventListener("keydown", jumpOnKeyPress);
}

export function updateCharacter(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

export function getCharacterRectangle() {
  return characterElement.getBoundingClientRect();
}

export function setCharacterLoss() {
  characterElement.src = "assets/dino-lose.png";
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    characterElement.src = `assets/dino-stationary.png`;
    return;
  } 

  if (currentFrameTime >= FRAME_TIME) {
    characterFrame = (characterFrame + 1) % CHARACTER_FRAME_COUNT;
    characterElement.src = `assets/dino-run-${characterFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;

  incrementCustomProperty(characterElement, "--bottom", yVelocity * delta);

  if (getCustomProperty(characterElement, "--bottom") <= 0) {
    setCustomProperty(characterElement, "--bottom", 0);
    isJumping = false;
  }

  yVelocity -= GRAVITY * delta;
}

function jumpOnKeyPress(e) {
  if (e.code !== "Space" || isJumping) return;

  yVelocity = JUMP_SPEED;
  isJumping = true;
}

const OBSTACLE_SPEED = 0.05;
const groundElements = document.querySelectorAll("[data-ground");

export function setupGround() {
  setCustomProperty(groundElements[0], "--left", 0);
  setCustomProperty(groundElements[1], "--left", 300);
}

export function updateGround(delta, speedScale) {
  groundElements.forEach(ground => {
    incrementCustomProperty(ground, "--left", delta * speedScale * OBSTACLE_SPEED * -1);

    if (getCustomProperty(ground, "--left") <= -300) {
      incrementCustomProperty(ground, "--left", 600);
    }
  });
}
