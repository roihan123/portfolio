/***********************************************
 *  SPIDER BACKGROUND ANIMATION (Both pages)   *
 ***********************************************/
const canvas = document.getElementById("canvas");
let ctx = null, w = 0, h = 0;

if (canvas) {
  ctx = canvas.getContext("2d");

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const { sin, cos, PI, hypot, min, max } = Math;

  function rnd(x = 1, dx = 0) { return Math.random() * x + dx; }
  function many(n, f) { return [...Array(n)].map((_, i) => f(i)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, PI * 2);
    ctx.fill();
  }
  function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    for (let i = 1; i <= 100; i++) {
      let t = i / 100;
      let xx = lerp(x0, x1, t);
      let yy = lerp(y0, y1, t);
      ctx.lineTo(xx, yy);
    }
    ctx.stroke();
  }

  function spawnSpider() {
    const pts = many(333, () => {
      return { x: rnd(innerWidth), y: rnd(innerHeight), len: 0, r: 0 };
    });
    const pts2 = many(9, (i) => {
      return {
        x: cos((i / 9) * PI * 2),
        y: sin((i / 9) * PI * 2)
      };
    });
    let seed = rnd(100);
    let tx = rnd(innerWidth);
    let ty = rnd(innerHeight);
    let x = rnd(innerWidth);
    let y = rnd(innerHeight);
    let kx = rnd(0.5, 0.5);
    let ky = rnd(0.5, 0.5);
    let walkRadius = { x: rnd(50, 50), y: rnd(50, 50) };
    let rr = innerWidth / rnd(100, 150);

    function paintPt(pt) {
      pts2.forEach((pt2) => {
        if (!pt.len) return;
        drawLine(
          lerp(x + pt2.x * rr, pt.x, pt.len * pt.len),
          lerp(y + pt2.y * rr, pt.y, pt.len * pt.len),
          x + pt2.x * rr,
          y + pt2.y * rr
        );
      });
      drawCircle(pt.x, pt.y, pt.r);
    }

    return {
      follow(mx, my) {
        tx = mx;
        ty = my;
      },
      tick(t) {
        // spider wiggles around the mouse
        const selfMoveX = cos(t * kx + seed) * walkRadius.x;
        const selfMoveY = sin(t * ky + seed) * walkRadius.y;
        let fx = tx + selfMoveX;
        let fy = ty + selfMoveY;

        x += min(innerWidth / 100, (fx - x) / 10);
        y += min(innerWidth / 100, (fy - y) / 10);

        let i = 0;
        pts.forEach((pt) => {
          const dx = pt.x - x,
                dy = pt.y - y;
          const dist = hypot(dx, dy);
          let rad = min(2, innerWidth / dist / 5);
          const close = dist < innerWidth / 10 && (i++) < 8;
          let dir = close ? 0.1 : -0.1;  
          if (close) {
            rad *= 1.5;
          }
          pt.r = rad;
          pt.len = max(0, min(pt.len + dir, 1));
          paintPt(pt);
        });
      }
    };
  }

  const spiders = many(2, spawnSpider);

  window.addEventListener("pointermove", (e) => {
    spiders.forEach(sp => sp.follow(e.clientX, e.clientY));
  });

  requestAnimationFrame(function anim(t) {
    if (w !== innerWidth) w = canvas.width = innerWidth;
    if (h !== innerHeight) h = canvas.height = innerHeight;

    ctx.fillStyle = "#000";
    drawCircle(0, 0, w * 10);

    ctx.fillStyle = ctx.strokeStyle = "#fff";
    t /= 1000;
    spiders.forEach(sp => sp.tick(t));
    requestAnimationFrame(anim);
  });
}

/***********************************************
 *   LANDING PAGE LOGIC (index.html only)
 ***********************************************/
const landingSection = document.getElementById('landing');
const startButton = document.getElementById('startButton');
if (startButton) {
  startButton.addEventListener('click', () => {
    // Instead of fading out on the same page,
    // simply redirect to your Portfolio page:
    window.location.href = 'portfolio.html';
  });
}
document.addEventListener("DOMContentLoaded", () => {
    const fadeOverlay = document.getElementById("fadeOverlay");
    const welcomeText = document.getElementById("welcomeText");
    const canvas = document.getElementById("canvas");
    const startButton = document.getElementById("startButton");

  const blurHero = document.getElementById('blur-hero');
  if (blurHero) {
    // Ambil semua childNodes (text dan element)
    const nodes = Array.from(blurHero.childNodes);
    blurHero.textContent = ''; // Kosongkan dulu

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Untuk text biasa, split per kata
        node.textContent.split(' ').forEach((word, i, arr) => {
          if (word) {
            const span = document.createElement('span');
            span.textContent = word;
            span.className = 'blur-word';
            blurHero.appendChild(span);
          }
          // Tambahkan spasi antar kata (kecuali terakhir)
          if (i < arr.length - 1) {
            blurHero.appendChild(document.createTextNode(' '));
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Untuk elemen (misal <span id="greetingsPart"> atau <span id="roihanName">)
        node.classList.add('blur-word');
        blurHero.appendChild(node);
      }
    });

    

    // Animasi per kata/elemen
    const words = blurHero.querySelectorAll('.blur-word');
    words.forEach((span, i) => {
      setTimeout(() => {
        span.classList.add('visible');
      }, 200 * i); // Delay per kata
    });
  }
    
    // FADE IN EFFECT (on page load)
    setTimeout(() => {
        fadeOverlay.classList.add("hidden"); // Fade-in effect on load
    }, 100);

    // FADE OUT EFFECT (on Start button click)
    if (startButton) {
        startButton.addEventListener("click", () => {
            startButton.disabled = true; // Prevent multiple clicks
            welcomeText.style.opacity = "0"; // Slowly fade out welcome text
            
            setTimeout(() => {
                canvas.classList.add("visible"); // Slowly show spider animation
            }, 1000); // Show spider after text fades

            setTimeout(() => {
                fadeOverlay.classList.remove("hidden"); // Fade to black before redirect
                fadeOverlay.style.opacity = "1";
            }, 3500); // Delay before black screen

            setTimeout(() => {
                window.location.href = "portfolio.html"; // Redirect after fade-out
            }, 5000); // Redirect after 4 seconds
        });
    }
});


/***********************************************
 *   PORTFOLIO PAGE LOGIC (portfolio.html only)
 ***********************************************/

// "About Me" toggle
const toggleAboutButton = document.getElementById('toggleAbout');
const aboutContent = document.getElementById('aboutContent');

if (toggleAboutButton && aboutContent) {
    toggleAboutButton.addEventListener('click', () => {
        aboutContent.classList.toggle('active');
    });
}

// "My Work" toggle
const toggleWorkButton = document.getElementById('toggleWork');
const workContent = document.getElementById('workContent');
if (toggleWorkButton && workContent) {
  toggleWorkButton.addEventListener('click', () => {
    workContent.classList.toggle('active');
  });
}

// "Project 2" toggle
const kuliahkuToggle = document.getElementById('kuliahkuToggle');
const kuliahkuContent = document.getElementById('kuliahkuContent');
if (kuliahkuToggle && kuliahkuContent) {
  kuliahkuToggle.addEventListener('click', () => {
    kuliahkuContent.style.display = kuliahkuContent.style.display === 'block' ? 'none' : 'block';
    kuliahkuContent.classList.toggle('active');
  });
}

// "Project 1" toggle
const project1Toggle = document.getElementById('project1Toggle');
const project1Content = document.getElementById('project1Content');
if (project1Toggle && project1Content) {
  project1Toggle.addEventListener('click', () => {
    project1Content.classList.toggle('active');
  });
}

// "Project 3" toggle
const tebakanomaliToggle = document.getElementById('tebakanomaliToggle');
const tebakanomaliContent = document.getElementById('tebakanomaliContent');
if (tebakanomaliToggle && tebakanomaliContent) {
  tebakanomaliToggle.addEventListener('click', () => {
    tebakanomaliContent.classList.toggle('active');
  });
}

// "Research" toggle
const researchToggle = document.getElementById('researchToggle');
const researchContent = document.getElementById('researchContent');
if (researchToggle && researchContent) {
  researchToggle.addEventListener('click', () => {
    researchContent.classList.toggle('active');
  });
}

// "Roblox" toggle
const robloxBtn = document.getElementById('roblox');
const robloxContent = document.getElementById('robloxContent');
if (robloxBtn && robloxContent) {
  robloxBtn.addEventListener('click', () => {
    robloxContent.classList.toggle('active');
  });
}

// Social icons
const socialToggle = document.getElementById('socialToggle');
const socialIcons = document.getElementById('socialIcons');
if (socialToggle && socialIcons) {
  socialToggle.addEventListener('click', () => {
    socialIcons.classList.toggle('active');
  });
}

/***********************************************
 *  SHARED ACROSS BOTH PAGES (If elements exist)
 ***********************************************/

// Cycling "welcome." fonts on Landing only
const welcomeText = document.getElementById("welcomeText");
if (welcomeText) {
  const welcomeFonts = [
    "'Open Sans', sans-serif",
    "Arial, sans-serif",
    "'Courier New', monospace",
    "'Times New Roman', serif",
    "'Roboto Mono', sans-serif"
  ];
  let fontIndex = 0;
  function updateWelcomeFont() {
    welcomeText.style.fontFamily = welcomeFonts[fontIndex];
    fontIndex = (fontIndex + 1) % welcomeFonts.length;
  }
  updateWelcomeFont();
  setInterval(updateWelcomeFont, 200);
}

// Greetings cycle (on portfolio's hero)
const greetingsPart = document.getElementById("greetingsPart");
if (greetingsPart) {
  const greetings = [
    "你好","Hello","Hola","Olá","Hallo","Ciao","yo!",
    "안녕","Hæ","Привет","Hi"
  ];
  let greetingIndex = 0;
  function updateGreeting() {
    greetingsPart.textContent = greetings[greetingIndex];
    greetingIndex = (greetingIndex + 1) % greetings.length;
  }
  updateGreeting();
  setInterval(updateGreeting, 500);
}

// Role cycle (on portfolio's hero)
const roleElement = document.getElementById("roleText");
if (roleElement) {
  const roles = ["Full-Stack Web Developer", 
                  "Game Developer",
                  "2D/3D Designer",
  ];
  let roleIndex = 0;
  function updateRole() {
    roleElement.textContent = `I'm a ${roles[roleIndex]}.`;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  updateRole();
  setInterval(updateRole, 2000);
}

// "roihanName" color flicker
const roihanSpan = document.getElementById('roihanName');
if (roihanSpan) {
  function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function scheduleColorChange() {
    // Wait a random time between 1s and 2s
    const delay = randomDelay(1000, 2000);
    setTimeout(() => {
      // Turn text red
      roihanSpan.style.color = 'red';
      // After 200ms, revert to white
      setTimeout(() => {
        roihanSpan.style.color = 'white';
        // schedule next cycle
        scheduleColorChange();
      }, 200);
    }, delay);
  }
  scheduleColorChange();
}

function startTransition() {
  const landing = document.getElementById('landing');
  landing.style.opacity = '0'; // Fade out the landing section
  setTimeout(() => {
    window.location.href = 'nextpage.html'; // Redirect to another page
  }, 2000); // Wait for the transition to complete (2 seconds)
}

