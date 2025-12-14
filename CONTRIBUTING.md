# Contributing to Dodge Object Game

<a href="https://winter-of-open-source.vercel.app/"><img src="assets/banner.png"></a>

Welcome to Winter of Open Source! 🎉    
We're excited to have you contribute to this Dodge the Falling Objects game project.

---

## Table of Contents

- [Setting Up Local Environment](#setting-up-local-environment)
- [How to Contribute](#how-to-contribute)
- [How to Write a Clean PR](#how-to-write-a-clean-pr)
- [Scoring Rules](#scoring-rules)
- [Learning Resources](#learning-resources)
- [Code Style](#code-style)
- [Getting Help](#getting-help)

---

## Setting Up Local Environment

### Prerequisites
1. Basic knowledge of HTML, CSS, and JavaScript
2. Understanding of DOM manipulation and event handling
3. Git installed on your system
4. A GitHub account

### Installation

1. **Fork the repository**
   
   Click the "Fork" button at the top right of this repository.

2. **Clone your fork**

```bash
git clone https://github.com/YOUR_NAME/dodge-objects.git
cd dodge-objects
```

3. **Open in your browser**

   Simply open `index.html` in your browser to test the application.

4. **Use a local server** (recommended for development)

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .

# Using VS Code Live Server extension
# Right-click on index.html -> "Open with Live Server"
```

5. **Visit** `http://localhost:8000` in your browser

### Dependencies

This project has **no npm/yarn dependencies**. It's pure HTML, CSS, and JavaScript!

---

## How to Contribute

### Step 1: Choose an Issue

* Browse [open issues](../../issues)
* Look for labels:
  * `good first issue` / `beginner-friendly` – great for newcomers
  * `easy`, `medium`, `hard` – based on difficulty
  * `gameplay`, `ui`, `performance` – based on component
  * `documentation`, `bug`, `feature`, `enhancement`

### Step 2: Comment `/assign`

* Comment `/assign` on the issue you want to work on
* Wait for maintainer approval
* **Only 1 person per issue at a time**
* **Complete within 48 hours** or it gets unassigned

### Step 3: Create a Branch

```bash
git checkout -b fix/issue-number-short-description
```

Example branch names:
* `fix/23-improve-collision-detection`
* `feature/45-add-power-ups`
* `docs/12-improve-readme`

### Step 4: Make Changes

* Follow existing code style
* Add meaningful comments explaining **why**, not just what
* Test your changes thoroughly in multiple browsers
* Keep commits atomic

### Step 5: Commit Changes

```bash
git add .
git commit -m "Fixes #23: Improve collision detection

- Implemented more accurate bounding box calculations
- Added collision debug visualization
- Updated game loop to use new detection method"
```

### Step 6: Push & Create PR

```bash
git push origin fix/issue-number-short-description
```

* Go to your fork on GitHub → "Compare & pull request"
* Fill out the PR template completely
* Link the issue using `Fixes #<issue-number>`

---

## How to Write a Clean PR

### Must Include:
- Link to the issue: `Fixes #<issue-number>`
- Clear description of what you changed
- Screenshots (if UI changes)
- Tested in multiple browsers

### Code Requirements:
- Proper indentation (2 spaces for HTML/CSS/JS)
- Meaningful comments
- Use formatters (Prettier recommended)
- No console errors
- **NO external game frameworks** – use vanilla JavaScript!

### PR Template :
- Open `.github/pull_request_template.md` for guidance
- Moreover, for other templates refer to the `.github/ISSUE_TEMPLATE/` folder
  
## Scoring Rules

## Issue Labels

| Label | Description |
|-------|-------------|
| `easy` | Beginner-friendly, small fixes |
| `medium` | Moderate complexity, features |
| `hard` | Complex tasks, major features |
| `documentation` | Documentation improvements |
| `bug` | Something isn't working |
| `feature` | New feature request |
| `good-first-issue` | Great for newcomers |
| `beginner-friendly` | Suitable for beginners |

### Points Per PR

| PR Type | Points |
|---------|--------|
| **Easy** | 10 |
| **Medium** | 20 |
| **Hard** | 40 |
| **Documentation Fix** | 5 |
| **Bug Fix** | 20 |
| **Feature Addition** | 30 |

### Bonuses

| Bonus | Points |
|-------|--------|
|**First 10 PRs** | +10 |
| **First PR of the Week** (resets Monday 12 AM) | +10 |
| **Most Impactful PR **(decided at end) | +50 |

### Rules

- **Only merged PRs count**
- Work on **only 1 issue at a time**
- Complete within **48 hours** or issue gets unassigned

---

## Learning Resources

Before you start contributing, we **strongly recommend** learning the fundamentals of game development with vanilla JavaScript. The goal is to build everything **from scratch without using any prebuilt game frameworks**.

### Game Development - Essential Reading

| Resource | Description |
|----------|-------------|
| [MDN Game Development](https://developer.mozilla.org/en-US/docs/Games) | Comprehensive guide to browser game development |
| [RequestAnimationFrame Guide](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) | Understanding the game loop |
| [Collision Detection](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection) | Techniques for detecting collisions |
| [Keyboard Events](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) | Handling user input |

### Game Mechanics - Suggested Readings

| Resource | Description |
|----------|-------------|
| [Game Loop Patterns](https://gameprogrammingpatterns.com/game-loop.html) | Understanding game loop architecture |
| [2D Game Physics](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection) | Basic physics for 2D games |
| [Performance Optimization](https://developer.mozilla.org/en-US/docs/Games/Techniques/Performance_techniques) | Optimizing game performance |

### Additional Resources

- [DOM Manipulation](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents) – for updating game elements
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations) – for smooth visual effects
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) – for saving game state

> [!IMPORTANT]
> **Do NOT use game frameworks like Phaser, Three.js, or similar.** The goal is to understand and implement game mechanics yourself using vanilla JavaScript!

---

## Code Style

- Use proper **indentation** for HTML/CSS/JS
- Use **descriptive variable names**
- Explain **why**, not just what in comments
- **Logic** for the functions, algorithms used should be clear

### Example:

```javascript
// Good: Explains WHY
// Use requestAnimationFrame for smooth 60fps updates
// This syncs with browser refresh rate and pauses when tab is inactive
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastFrameTime;
  updateGame(deltaTime);
  lastFrameTime = timestamp;
  requestAnimationFrame(gameLoop);
}

// Bad: Explains WHAT (obvious from code)
// Update game and request next frame
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastFrameTime;
  updateGame(deltaTime);
  lastFrameTime = timestamp;
  requestAnimationFrame(gameLoop);
}
```

---

## Getting Help

- **Discord**: [Winter of Open Source Server](https://discord.gg/EzvckznUDG) (everyone is requested to join this server)
- **GitHub Discussions**: Ask questions, share ideas
- **Issues**: Comment to reach maintainers

---

## Important Rules

- Work on **one issue at a time**
- Complete within **48 hours** (can be extended based on difficulty)
- Respect the code of conduct
- Always link your PR to an issue
- **No plagiarism**
- Keeep **AI** use **minimal** and **relevant**, i.e. only for assistance, not for entire code
- **NO external game frameworks** – implement from scratch
---

<p align="center">
<b>Happy Contributing! ❤️</b>
</p>
