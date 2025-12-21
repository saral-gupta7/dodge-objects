
// Game configuration
const GAME_CONFIG = {
  playerSpeed: 360,
  obstacleSpeedStart: 210,
  obstacleSpeedIncrement: 12,
  spawnIntervalStart: 950,
  spawnIntervalMin: 320,
  spawnIntervalStep: 16,
  maxObstacles: 8,
};
// Difficulty configuration(newly added)
const DIFFICULTY_CONFIG = {
  levelDuration: 10000, 
  maxLevel: 15,
};


// using document.getElementById to get the elements from the HTML
const gameArea = document.getElementById("game-area");
const playerEl = document.getElementById("player");
const overlayEl = document.getElementById("overlay");
const restartButtonEl = document.getElementById("restart-button");
const currentTimeEl = document.getElementById("current-time");
const bestTimeEl = document.getElementById("best-time");
const finalTimeEl = document.getElementById("final-time");

const playerState = {
  x: 0,
};

let activeObstacles = [];

const inputState = {
  left: false,
  right: false,
};

const gameState = {
  running: false,
  lastFrameTime: 0,
  startTime: 0,
  elapsed: 0,
  obstacleSpeed: GAME_CONFIG.obstacleSpeedStart,
  spawnInterval: GAME_CONFIG.spawnIntervalStart,
  timeSinceLastSpawn: 0,
  bestTime: 0,
  frameHandle: null,
  //initialised for difficulty level tracking(newly added)
  difficultyLevel: 0,

};

// Persist best time between page reloads
const BEST_TIME_STORAGE_KEY = "dodgeGame.bestTimeSeconds";

function loadBestTime() {
  const raw = window.localStorage.getItem(BEST_TIME_STORAGE_KEY);
  if (!raw) return 0;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function saveBestTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return;
  window.localStorage.setItem(BEST_TIME_STORAGE_KEY, String(seconds.toFixed(2)));
}

// Input handling
function handleKeyDown(event) {
  if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
    inputState.left = true;
    event.preventDefault();
  } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
    inputState.right = true;
    event.preventDefault();
  } else if (event.key === " " && !gameState.running) {
    event.preventDefault();
    startGame();
  }
}

function handleKeyUp(event) {
  if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
    inputState.left = false;
    event.preventDefault();
  } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
    inputState.right = false;
    event.preventDefault();
  }
}

const touchState = {
  active: false,
  startX: 0
};

function handleTouchStart(event) {
  if (event.touches.length === 0) {
    return;
  }
  const tap = event.touches[0];
  touchState.active = true;
  touchState.startX = tap.clientX;
  if (!gameState.running) {
    startGame();
  }
  event.preventDefault();
}

function handleTouchMove(event) {
  if (!touchState.active) {
    return;
  }
  if (event.touches.length === 0) {
    return;
  }
  const tap = event.touches[0];
  const deltaX = tap.clientX - touchState.startX;

  if (Math.abs(deltaX) <= 12) {
    inputState.left = false;
    inputState.right = false;
  } else if (deltaX < 0) {
    inputState.left = true;
    inputState.right = false;
  } else {
    inputState.left = false;
    inputState.right = true;
  }
  event.preventDefault();
}

function handleTouchEnd() {
  touchState.active = false;
  inputState.left = false;
  inputState.right = false;
}

// Core game lifecycle
function startGame() {
  clearObstacles();
  overlayEl.classList.add("overlay--hidden");
  overlayEl.setAttribute("aria-hidden", "true");

  gameState.running = true;
  gameState.lastFrameTime = performance.now();
  gameState.startTime = gameState.lastFrameTime;
  gameState.elapsed = 0;
  gameState.obstacleSpeed = GAME_CONFIG.obstacleSpeedStart;
  gameState.spawnInterval = GAME_CONFIG.spawnIntervalStart;
  gameState.timeSinceLastSpawn = 0;
  //resetting difficulty level to 0(newly added)
  gameState.difficultyLevel = 0;


  centerPlayer();
  updateTimeDisplays(0, gameState.bestTime);

  if (gameState.frameHandle !== null) {
    cancelAnimationFrame(gameState.frameHandle);
  }
  gameState.frameHandle = requestAnimationFrame(gameLoop);
}

function endGame() {
  if (!gameState.running) return;

  gameState.running = false;
  if (gameState.frameHandle !== null) {
    cancelAnimationFrame(gameState.frameHandle);
    gameState.frameHandle = null;
  }

  const survivedSeconds = gameState.elapsed / 1000;
  const previousBest = gameState.bestTime;
  const newBest = survivedSeconds > previousBest ? survivedSeconds : previousBest;
  gameState.bestTime = newBest;

  if (survivedSeconds > previousBest) {
    saveBestTime(survivedSeconds);
  }

  finalTimeEl.textContent = formatSeconds(survivedSeconds);
  updateTimeDisplays(survivedSeconds, newBest);

  overlayEl.classList.remove("overlay--hidden");
  overlayEl.setAttribute("aria-hidden", "false");
}
// Difficulty adjustment based on elapsed time(newly added)
function updateDifficulty(elapsedMs) {
  const level = Math.min(
    Math.floor(elapsedMs / DIFFICULTY_CONFIG.levelDuration),
    DIFFICULTY_CONFIG.maxLevel
  );

  if (level === gameState.difficultyLevel) return;

  gameState.difficultyLevel = level;

  // Faster objects
  gameState.obstacleSpeed =
    GAME_CONFIG.obstacleSpeedStart +
    level * GAME_CONFIG.obstacleSpeedIncrement;

  // Shorter spawn interval
  gameState.spawnInterval = Math.max(
    GAME_CONFIG.spawnIntervalMin,
    GAME_CONFIG.spawnIntervalStart -
      level * GAME_CONFIG.spawnIntervalStep
  );
// Debug output to console
 /*  console.log(
  "Level:", level,
  "Speed:", gameState.obstacleSpeed,
  "Spawn:", gameState.spawnInterval,
  "MaxObs:", 4 + level
); */

}


// Game loop and mechanics
function gameLoop(timestamp) {
  if (!gameState.running) return;

  const deltaMs = timestamp - gameState.lastFrameTime;
  const deltaSeconds = deltaMs / 1000;
  gameState.lastFrameTime = timestamp;

  gameState.elapsed = timestamp - gameState.startTime;
  // Update difficulty based on elapsed time (newly added)
  updateDifficulty(gameState.elapsed);
  updateTimeDisplays(gameState.elapsed / 1000, gameState.bestTime);

  movePlayer(deltaSeconds);
  updateObstacles(deltaSeconds);
  maybeSpawnObstacle(deltaMs);

  if (checkCollision()) {
    endGame();
    return;
  }

  gameState.frameHandle = requestAnimationFrame(gameLoop);
}

// Player movement and positioning
function centerPlayer() {
  const areaRect = gameArea.getBoundingClientRect();
  const playerRect = playerEl.getBoundingClientRect();
  const initialX = areaRect.width / 2 - playerRect.width / 2;
  playerState.x = initialX;
  playerEl.style.left = `${initialX}px`;
}

function movePlayer(deltaSeconds) {
  if (!inputState.left && !inputState.right) return;

  const direction = inputState.left && !inputState.right ? -1 : inputState.right && !inputState.left ? 1 : 0;
  if (!direction) return;

  const distance = direction * GAME_CONFIG.playerSpeed * deltaSeconds;
  const areaRect = gameArea.getBoundingClientRect();
  const playerRect = playerEl.getBoundingClientRect();
  const minX = 4;
  const maxX = areaRect.width - playerRect.width - 4;

  let nextX = playerState.x + distance;
  if (nextX < minX) nextX = minX;
  if (nextX > maxX) nextX = maxX;
  playerState.x = nextX;
  playerEl.style.left = `${nextX}px`;
}

// Obstacle management 
function createObstacle() {

 /*  if (activeObstacles.length >= GAME_CONFIG.maxObstacles) {
    return;
  } */
 //dynamic max obstacles based on difficulty level(newly added)
 const dynamicMax = 4 + gameState.difficultyLevel;
if (activeObstacles.length >= dynamicMax) return;


  const obstacleEl = document.createElement("div");
  obstacleEl.className = "obstacle";

  const areaRect = gameArea.getBoundingClientRect();
 //
  // const obstacleRectWidth = 32;
  const padding = 4;
  // Random size between 20px and 46px
  const size = 20 + Math.random() * 26; // 20px–46px
 // Set size
  obstacleEl.style.width = `${size}px`;
  obstacleEl.style.height = `${size}px`;
 // Random horizontal position within game area
 
 const x =
    Math.random() * (areaRect.width - size - padding * 2) +
    padding;
   obstacleEl.style.left = `${x}px`;
  obstacleEl.style.top = "-42px";
  gameArea.appendChild(obstacleEl);

  const obstacle = {
    el: obstacleEl,
    x,
    y: -42,
    speed: gameState.obstacleSpeed,
  };

  activeObstacles.push(obstacle);
}

function updateObstacles(deltaSeconds) {
  const areaRect = gameArea.getBoundingClientRect();
  const floorY = areaRect.height + 64;

  for (let i = activeObstacles.length - 1; i >= 0; i -= 1) {
    const obstacle = activeObstacles[i];
    obstacle.y += obstacle.speed * deltaSeconds;
    obstacle.el.style.top = `${obstacle.y}px`;

    if (obstacle.y > floorY) {
      obstacle.el.remove();
      activeObstacles.splice(i, 1);
    }
  }
}

function maybeSpawnObstacle(deltaMs) {
  gameState.timeSinceLastSpawn += deltaMs;
//initially difficulty was increasaing based on obstacle spawned
  if (gameState.timeSinceLastSpawn < gameState.spawnInterval) {
    return;
  }

  createObstacle();
  gameState.timeSinceLastSpawn = 0;
// Difficulty increase removed from here
  /* if (gameState.spawnInterval > GAME_CONFIG.spawnIntervalMin) {
    gameState.spawnInterval = Math.max(
      GAME_CONFIG.spawnIntervalMin,
      gameState.spawnInterval - GAME_CONFIG.spawnIntervalStep
    );
  }

  gameState.obstacleSpeed += GAME_CONFIG.obstacleSpeedIncrement; 
   *///now after commenting this difficulty increased has no relation with spawning
}

function clearObstacles() {
  for (const obstacle of activeObstacles) {
    obstacle.el.remove();
  }
  activeObstacles = [];
}

// Collision detection
function checkCollision() {
  const playerRect = playerEl.getBoundingClientRect();

  for (const obstacle of activeObstacles) {
    const rect = obstacle.el.getBoundingClientRect();

    const overlapX =
      rect.left < playerRect.right && rect.right > playerRect.left;
    const overlapY =
      rect.top < playerRect.bottom && rect.bottom > playerRect.top;

    if (overlapX && overlapY) {
      return true;
    }
  }

  return false;
}

// Utility functions
function formatSeconds(seconds) {
  return `${seconds.toFixed(2)}s`;
}

function updateTimeDisplays(currentSeconds, bestSeconds) {
  currentTimeEl.textContent = formatSeconds(currentSeconds);
  bestTimeEl.textContent = formatSeconds(bestSeconds);
}

// Initialisation
function bootstrap() {
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  restartButtonEl.addEventListener("click", () => startGame());

  gameArea.addEventListener("touchstart", handleTouchStart, { passive: false });
  gameArea.addEventListener("touchmove", handleTouchMove, { passive: false });
  gameArea.addEventListener("touchend", handleTouchEnd, { passive: false });
  gameArea.addEventListener("touchcancel", handleTouchEnd, { passive: false });

  overlayEl.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (!gameState.running) startGame();
  }, { passive: false });

  gameState.bestTime = loadBestTime();
  centerPlayer();
  updateTimeDisplays(0, gameState.bestTime);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}

const soundToggleBtn = document.getElementById("sound-toggle");
const soundIcon = document.getElementById("sound-icon");

// Background music
const bgMusic = new Audio("./assets/bg.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.35;

// Sound state (default ON, no autoplay)
let isSoundOn = true;

/* =============================== */
/* Toggle Button Logic */
/* =============================== */
soundToggleBtn.addEventListener("click", () => {
  isSoundOn = !isSoundOn;

  soundIcon.src = isSoundOn
    ? "./assets/Sound_On.png"
    : "./assets/Sound_Off.png";

  soundIcon.alt = isSoundOn ? "Sound On" : "Sound Off";

  if (isSoundOn && gameState.running) {
    bgMusic.play().catch(() => {});
  } else {
    bgMusic.pause();
  }
});

/* =============================== */
/* Game Lifecycle Hooks */
/* =============================== */

const originalStartGame = startGame;
startGame = function () {
  originalStartGame();

  if (isSoundOn) {
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
  }
};

const originalEndGame = endGame;
endGame = function () {
  originalEndGame();
  bgMusic.pause();
};
