document.addEventListener("DOMContentLoaded", () => {
  const confettiLayer = document.querySelector(".confetti-layer");
  const stage = document.querySelector(".stage");

  // Light sparkle particles around the stage
  const sparkleCount = 30;
  const sparkles = document.createDocumentFragment();
  for (let i = 0; i < sparkleCount; i++) {
    const span = document.createElement("span");
    span.className = "sparkle";
    span.style.left = Math.random() * 100 + "%";
    span.style.top = Math.random() * 100 + "%";
    span.style.animationDelay = Math.random() * 4 + "s";
    span.style.animationDuration = 3 + Math.random() * 3 + "s";
    sparkles.appendChild(span);
  }
  stage?.appendChild(sparkles);

  // Remove confetti splash after animation ends
  if (confettiLayer) {
    confettiLayer.addEventListener("animationend", () => {
      confettiLayer.remove();
    });
  }

  // Balloon blast effect
  const balloons = document.querySelectorAll(".balloon");

  balloons.forEach((balloon) => {
    balloon.style.cursor = "pointer";

    balloon.addEventListener("click", function() {
      // Add blast animation
      this.style.animation = "balloonBlast 0.3s ease-out forwards";

      // Create blast particles
      const rect = this.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      for (let i = 0; i < 8; i++) {
        const particle = document.createElement("div");
        particle.className = "blast-particle";
        particle.style.left = centerX + "px";
        particle.style.top = centerY + "px";
        particle.style.background = getComputedStyle(this).background;

        const angle = (i / 8) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        particle.style.setProperty("--x", Math.cos(angle) * distance + "px");
        particle.style.setProperty("--y", Math.sin(angle) * distance + "px");

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 600);
      }

      // Store balloon classes
      const balloonClasses = this.className;
      const parent = this.parentElement;

      // Remove balloon
      setTimeout(() => {
        this.remove();

        // Recreate balloon after 1 second
        setTimeout(() => {
          const newBalloon = document.createElement("div");
          newBalloon.className = balloonClasses;
          newBalloon.style.animation = "balloonFadeIn 0.8s ease-out forwards";
          newBalloon.style.cursor = "pointer";
          parent.appendChild(newBalloon);

          // Re-add click listener to new balloon
          newBalloon.addEventListener("click", arguments.callee);
        }, 1000);
      }, 300);
    });
  });

  // Candle blow-out interaction
  const candles = document.querySelectorAll(".candles span");
  const valentineMessage = document.getElementById("valentineMessage");
  let blownCandles = 0;

  candles.forEach((candle) => {
    candle.addEventListener("click", function() {
      if (!this.classList.contains("candle-blown")) {
        // Blow out the candle
        this.classList.add("candle-blown");
        blownCandles++;

        // Check if all 3 candles are blown out
        if (blownCandles === 3) {
          setTimeout(() => {
            valentineMessage.classList.remove("hidden");
            valentineMessage.classList.add("reveal");
          }, 500);
        }
      }
    });
  });

});
