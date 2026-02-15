document.addEventListener("DOMContentLoaded", () => {
  const loveMover = document.querySelector(".love-mover");
  const dashMarkersContainer = document.getElementById("dashMarkers");
  const pathContainer = document.querySelector(".path-container");
  const timelineCards = document.querySelectorAll(".timeline-card");
  const timelineCardsContainer = document.querySelector(".timeline-cards");
  const nextButtons = document.querySelectorAll(".next-btn");
  const makePromiseBtn = document.getElementById("makePromiseBtn");
  const startJourneyBtn = document.getElementById("startJourneyBtn");
  const journeyStartBoard = document.getElementById("journeyStartBoard");

  let currentCheckpoint = 0;
  let isAnimating = false;
  let dashCount = 0;

  // NEW: Vertical-centered layout with checkpoints on 8 evenly-spaced lines
  // Container is 75% width, positions scale with container
  // Using 400px as reference container width
  const containerWidth = 400; // Reference width
  const verticalLines = [0, 57, 114, 171, 228, 285, 342, 400]; // 8 lines evenly spaced

  const checkpointPositions = [
    { left: 200, top: 100 },   // Start (middle line 4)
    { left: 57, top: 400 },    // Checkpoint 1 (line 1 - left)
    { left: 285, top: 700 },   // Checkpoint 2 (line 5 - right)
    { left: 114, top: 1000 },  // Checkpoint 3 (line 2 - left-center)
    { left: 342, top: 1300 },  // Checkpoint 4 (line 6 - far right)
    { left: 171, top: 1600 },  // Checkpoint 5 (line 3 - center-left)
    { left: 228, top: 1900 },  // Checkpoint 6 (line 4 - center-right)
    { left: 360, top: 2200 },  // Checkpoint 7 (line 7 - right, moved from 400 to 360 to keep pointer in bounds)
    { left: 40, top: 2500 }    // Checkpoint 8 (line 0 - left, moved from 0 to 40 to keep pointer in bounds)
  ];

  // Track actual love position (updated after each hop sequence)
  let actualLovePosition = { left: 100, top: 100 };

  // Track which checkpoints have been unlocked/visited
  let unlockedCheckpoints = [0]; // Start with first checkpoint unlocked

  // Track which cards have been visited
  let visitedCards = new Set();

  // Number of hops between checkpoints
  const HOPS_PER_SEGMENT = 10;

  // Viewport helpers to keep scroll centering consistent on mobile browsers
  function getViewportMetrics() {
    const viewport = {
      width: window.innerWidth || 0,
      height: window.innerHeight || 0,
      offsetTop: 0,
      offsetLeft: 0
    };

    if (window.visualViewport) {
      viewport.width = window.visualViewport.width;
      viewport.height = window.visualViewport.height;
      viewport.offsetTop = window.visualViewport.offsetTop || 0;
      viewport.offsetLeft = window.visualViewport.offsetLeft || 0;
    }

    return viewport;
  }

  function clampScrollValue(value, max) {
    if (typeof max !== 'number' || max <= 0) {
      return Math.max(0, value);
    }
    return Math.min(max, Math.max(0, value));
  }

  function scrollWindowToCenter(absoluteX, absoluteY, behavior = 'auto') {
    const viewport = getViewportMetrics();
    const doc = document.documentElement || document.body;
    const maxScrollY = (doc.scrollHeight || 0) - viewport.height;

    let targetScrollY = absoluteY - (viewport.height / 2) + viewport.offsetTop;
    targetScrollY = clampScrollValue(targetScrollY, maxScrollY);

    // VERTICAL-ONLY scrolling - no horizontal scroll
    if (typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({
          top: targetScrollY,
          left: 0, // Always 0 - no horizontal scroll
          behavior
        });
      } catch (err) {
        window.scrollTo(0, targetScrollY);
      }
    }
  }

  function centerElementInViewport(element, behavior = 'smooth') {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || 0;

    const absoluteY = rect.top + scrollTop + (rect.height / 2);
    const absoluteX = rect.left + scrollLeft + (rect.width / 2);

    scrollWindowToCenter(absoluteX, absoluteY, behavior);
  }

  function getLoveAbsolutePosition() {
    if (!pathContainer || !actualLovePosition) return null;

    const containerRect = pathContainer.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || 0;

    return {
      absoluteX: containerRect.left + scrollLeft + actualLovePosition.left,
      absoluteY: containerRect.top + scrollTop + actualLovePosition.top
    };
  }

  function centerLove(behavior = 'auto') {
    const coords = getLoveAbsolutePosition();
    if (!coords) return;
    scrollWindowToCenter(coords.absoluteX, coords.absoluteY, behavior);
  }

  function isStartButtonVisible() {
    return !!(startJourneyBtn && !startJourneyBtn.classList.contains('hidden'));
  }

  function centerStartButton(behavior = 'auto') {
    if (!startJourneyBtn || !isStartButtonVisible()) return;
    centerElementInViewport(startJourneyBtn, behavior);
  }

  function maintainCenteredFocus(behavior = 'auto') {
    if (isStartButtonVisible()) {
      centerStartButton(behavior);
      return;
    }
    if (loveMover && loveMover.style.display !== 'none') {
      centerLove(behavior);
    }
  }

  const MAX_CENTER_ATTEMPTS = 4;
  const CENTER_RETRY_DELAY = 250;

  function centerActiveCardRepeatedly(behavior = 'smooth') {
    let attempts = 0;

    function attemptCenter() {
      const activeCard = document.querySelector('.timeline-card.active');
      if (!activeCard || attempts >= MAX_CENTER_ATTEMPTS) {
        return;
      }
      centerElementInViewport(activeCard, behavior);
      attempts += 1;
      if (attempts < MAX_CENTER_ATTEMPTS) {
        setTimeout(attemptCenter, CENTER_RETRY_DELAY);
      }
    }

    requestAnimationFrame(attemptCenter);
  }

  // Get SVG path element
  function getSVGPath() {
    return document.getElementById('journey-path');
  }

  // Calculate single dash position along the SVG curve
  function getDashPosition(segmentIndex, hopIndex) {
    const path = getSVGPath();
    if (!path) return null;

    const totalLength = path.getTotalLength();
    const segments = checkpointPositions.length - 1;
    const segmentLength = totalLength / segments;
    const startLength = segmentIndex * segmentLength;
    const endLength = (segmentIndex + 1) * segmentLength;

    // Progress through this segment (0 to 1)
    const progress = (hopIndex + 1) / (HOPS_PER_SEGMENT + 1);
    const lengthAtPoint = startLength + (endLength - startLength) * progress;
    const point = path.getPointAtLength(lengthAtPoint);

    return {
      left: point.x,
      top: point.y
    };
  }

  // Create a single dash marker at position
  function createDash(position, segmentIndex, hopIndex) {
    if (!dashMarkersContainer || !position) return null;

    const dash = document.createElement("div");
    dash.className = "dash-marker";
    dash.style.left = position.left + "px";
    dash.style.top = position.top + "px";
    dash.dataset.segment = segmentIndex;
    dash.dataset.index = hopIndex;
    dash.dataset.id = dashCount++;

    dashMarkersContainer.appendChild(dash);
    return dash;
  }

  // Fade in a dash
  function fadeDashIn(dash) {
    return new Promise((resolve) => {
      if (!dash) {
        resolve();
        return;
      }

      // Trigger fade in
      setTimeout(() => {
        dash.classList.add("visible");
      }, 50);

      // Wait for fade animation
      setTimeout(() => {
        resolve();
      }, 350);
    });
  }

  // Hop love to a position
  function hopLoveTo(position) {
    return new Promise((resolve) => {
      if (!loveMover || !position) {
        resolve();
        return;
      }

      // Move love to position
      loveMover.style.left = position.left + "px";
      loveMover.style.top = position.top + "px";
      actualLovePosition = { left: position.left, top: position.top };

      // Auto-scroll to keep heart centered both horizontally and vertically (instant)
      if (pathContainer && position) {
        centerLove('auto');
      }

      // Add jumping animation
      loveMover.classList.add("jumping");

      // Wait for jump animation
      setTimeout(() => {
        loveMover.classList.remove("jumping");
        resolve();
      }, 250);
    });
  }

  // Show checkpoint pin at specific position
  function showCheckpoint(checkpointIndex, position) {
    const checkpoint = document.querySelector(`.checkpoint[data-checkpoint="${checkpointIndex}"]`);
    if (checkpoint && position) {
      // Move checkpoint pin to actual hop-end position
      checkpoint.style.left = position.left + "px";
      checkpoint.style.top = position.top + "px";
      checkpoint.classList.add("visible");
    }
  }

  // Make love enlarge and fade at checkpoint
  function loveReachCheckpoint() {
    return new Promise((resolve) => {
      if (loveMover) {
        loveMover.classList.add("checkpoint-reached");
        setTimeout(() => {
          resolve();
        }, 500);
      } else {
        resolve();
      }
    });
  }

  // Reset love to normal state
  function resetLoveState() {
    if (loveMover) {
      loveMover.classList.remove("checkpoint-reached");
    }
  }

  // Progressive reveal: create dash → fade in → hop to it
  async function progressiveHopSequence(segmentIndex) {
    if (isAnimating) return;
    isAnimating = true;

    let lastPosition = null;

    // Hop through each position in segment
    for (let hopIndex = 0; hopIndex < HOPS_PER_SEGMENT; hopIndex++) {
      // Get position for this hop
      const position = getDashPosition(segmentIndex, hopIndex);
      lastPosition = position;

      // Create dash at this position
      const dash = createDash(position, segmentIndex, hopIndex);

      // Fade dash in
      await fadeDashIn(dash);

      // Make dash grow when love is about to land
      if (dash) {
        dash.classList.add("active");
      }

      // Hop love to this dash
      await hopLoveTo(position);

      // Shrink dash back after love lands
      setTimeout(() => {
        if (dash) {
          dash.classList.remove("active");
        }
      }, 100);

      // Small pause before next hop (even faster)
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Love is now at the 15th hop position - this IS the checkpoint
    // DON'T move love again, just mark this as the checkpoint
    if (lastPosition) {
      // Update actual love position
      actualLovePosition = { left: lastPosition.left, top: lastPosition.top };

      // Update checkpoint position to match where love actually is
      checkpointPositions[segmentIndex + 1] = actualLovePosition;

      // Show checkpoint pin at this exact position
      showCheckpoint(segmentIndex + 1, actualLovePosition);

      // Mini card marker will appear when showCard() is called

      // Make love enlarge and fade at checkpoint
      await loveReachCheckpoint();
    }

    isAnimating = false;
  }

  // DON'T clear dashes - keep them visible to show the path traveled
  // function clearAllDashes() {
  //   if (dashMarkersContainer) {
  //     dashMarkersContainer.innerHTML = "";
  //   }
  // }

  // Hide path container with fade
  function hidePathContainer() {
    return new Promise((resolve) => {
      if (pathContainer) {
        pathContainer.classList.add("hidden");
        setTimeout(resolve, 600);
      } else {
        resolve();
      }
    });
  }

  // Show path container with fade
  function showPathContainer() {
    return new Promise((resolve) => {
      if (pathContainer) {
        pathContainer.classList.remove("hidden");
        setTimeout(resolve, 600);
      } else {
        resolve();
      }
    });
  }

  // Show mini card marker at checkpoint
  function showMiniCardMarker(checkpointIndex, position) {
    const miniCard = document.querySelector(`.mini-card-marker[data-mini-card="${checkpointIndex}"]`);
    if (miniCard && position && pathContainer) {
      miniCard.style.left = position.left + "px";
      miniCard.style.top = position.top + "px";
      miniCard.classList.remove("hidden");

      // Check if marker would be cut off at screen edges (iPhone mode only)
      setTimeout(() => {
        const isMobile = window.innerWidth <= 500;

        if (isMobile) {
          const containerRect = pathContainer.getBoundingClientRect();
          const markerRect = miniCard.getBoundingClientRect();
          const containerLeft = containerRect.left;
          const containerRight = containerRect.right;

          // Calculate if marker extends beyond container edges
          const markerLeft = markerRect.left;
          const markerRight = markerRect.right;

          // If too close to left edge, adjust transform to keep it inside
          if (markerLeft < containerLeft) {
            miniCard.style.transform = 'translate(0%, -100%)'; // Left-align instead of center
          }
          // If too close to right edge, adjust transform to keep it inside
          else if (markerRight > containerRight) {
            miniCard.style.transform = 'translate(-100%, -100%)'; // Right-align instead of center
          }
          // Otherwise use default center alignment
          else {
            miniCard.style.transform = 'translate(-50%, -100%)';
          }
        } else {
          // Desktop: always use center alignment
          miniCard.style.transform = 'translate(-50%, -100%)';
        }
      }, 50);

      // Add click handler to reopen card
      miniCard.addEventListener("click", () => {
        showCard(checkpointIndex);
      });

      setTimeout(() => {
        miniCard.classList.add("visible");
      }, 100);
    }
  }

  // Update Next button visibility based on unlocked checkpoints
  function updateNextButtonVisibility(cardIndex) {
    const card = timelineCards[cardIndex];
    if (!card) return;

    const nextBtn = card.querySelector(".next-btn");
    if (!nextBtn) return;

    // Calculate next card index
    const nextCardIndex = cardIndex + 1;

    // If this is the last card or beyond, always show Next (it goes to promise card)
    if (nextCardIndex >= timelineCards.length) {
      nextBtn.classList.remove("hidden");
      return;
    }

    const nextCheckpoint = cardCheckpointIndex(nextCardIndex);

    // Hide Next button if next checkpoint is already unlocked
    if (unlockedCheckpoints.includes(nextCheckpoint)) {
      nextBtn.classList.add("hidden");
    } else {
      nextBtn.classList.remove("hidden");
    }
  }

  // Show timeline card with fade
  function cardCheckpointIndex(index) {
    return Math.min(index + 1, checkpointPositions.length - 1);
  }

  function showCard(index) {
    console.log(`📇 showCard(${index}) called`);
    console.log(`   timelineCards.length: ${timelineCards.length}`);
    console.log(`   timelineCards[${index}]:`, timelineCards[index]);

    if (timelineCards[index]) {
      console.log(`   Adding 'active' class to card ${index}...`);
      timelineCards[index].classList.add("active");
      console.log(`   Card ${index} classes:`, timelineCards[index].classList.toString());

      const checkpointIdx = cardCheckpointIndex(index);
      currentCheckpoint = checkpointIdx;
      if (loveMover && checkpointPositions[checkpointIdx]) {
        loveMover.style.left = checkpointPositions[checkpointIdx].left + "px";
        loveMover.style.top = checkpointPositions[checkpointIdx].top + "px";
        loveMover.style.display = "block";
        actualLovePosition = {
          left: checkpointPositions[checkpointIdx].left,
          top: checkpointPositions[checkpointIdx].top
        };
        // Don't center - heart is already centered from hopping
      }

      centerActiveCardRepeatedly('smooth');

      // Mark card as visited
      visitedCards.add(index);
      checkAllCardsVisited();

      // Update Next button visibility
      updateNextButtonVisibility(index);

      // Hide mini card marker when card is open
      const miniCard = document.querySelector(`.mini-card-marker[data-mini-card="${index}"]`);
      if (miniCard) {
        miniCard.classList.remove("visible");
      }
    }
  }

  // Check if all cards have been visited and show My Valentine button
  function checkAllCardsVisited() {
    const totalCards = timelineCards.length;
    if (visitedCards.size === totalCards) {
      const exploreSection = document.getElementById("exploreSection");
      if (exploreSection) {
        exploreSection.classList.remove("hidden");
      }
    }
  }

  // Hide timeline card
  function hideCard(index) {
    if (timelineCards[index]) {
      timelineCards[index].classList.remove("active");

      // Show mini card marker when card is closed
      const checkpointIdx = cardCheckpointIndex(index);
      if (checkpointPositions[checkpointIdx]) {
        showMiniCardMarker(index, checkpointPositions[checkpointIdx]);
      }
    }
  }


  // Initialize - position love at start
  function positionStartBoard() {
    if (!journeyStartBoard || !pathContainer || !checkpointPositions[0]) return;
    const rect = pathContainer.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || 0;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

    // Position at checkpoint 0 (now at 200, 100 in new layout)
    journeyStartBoard.style.left = rect.left + scrollLeft + checkpointPositions[0].left + "px";
    journeyStartBoard.style.top = rect.top + scrollTop + checkpointPositions[0].top + "px";
  }

  // Function to scroll to center a specific checkpoint
  function scrollToCenterCheckpoint(checkpointIndex) {
    if (pathContainer && checkpointPositions[checkpointIndex]) {
      const containerRect = pathContainer.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      const absoluteY = containerRect.top + scrollTop + checkpointPositions[checkpointIndex].top;
      const absoluteX = containerRect.left + scrollLeft + checkpointPositions[checkpointIndex].left;

      scrollWindowToCenter(absoluteX, absoluteY, 'auto');

      console.log('🔥 Scrolled to center checkpoint', checkpointIndex, '- AbsoluteY:', absoluteY, 'AbsoluteX:', absoluteX);
    }
  }

  function init() {
    // Add journey-not-started class to body initially
    document.body.classList.add('journey-not-started');

    positionStartBoard();

    // Hide path container initially
    if (pathContainer) {
      pathContainer.classList.add("hidden");
    }

    // Position love at first checkpoint
    if (loveMover && checkpointPositions[0]) {
      loveMover.style.left = checkpointPositions[0].left + "px";
      loveMover.style.top = checkpointPositions[0].top + "px";
      actualLovePosition = checkpointPositions[0];
    }

    // Show first checkpoint pin at initial position
    showCheckpoint(0, checkpointPositions[0]);

    // Scroll to center the "Begin Our Journey" button after layout is ready
    setTimeout(() => {
      if (startJourneyBtn) {
        console.log('🔥🔥🔥 Centering start button before journey begins');
        centerStartButton('auto');
      } else {
        console.log('🔥🔥🔥 START BUTTON NOT FOUND!');
      }
    }, 100);

    // Don't show mini card marker for checkpoint 0 (starting position)
  }

  // Hide love heart
  function hideLove() {
    if (loveMover) {
      loveMover.style.display = "none";
    }
  }

  // Show love heart
  function showLove() {
    if (loveMover) {
      loveMover.style.display = "block";
      if (checkpointPositions[currentCheckpoint]) {
        const pos = checkpointPositions[currentCheckpoint];
        loveMover.style.left = pos.left + "px";
        loveMover.style.top = pos.top + "px";
        actualLovePosition = { left: pos.left, top: pos.top };
        centerLove('auto');
      }
    }
  }

  // X close button handlers
  const closeButtons = document.querySelectorAll(".close-card");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", function() {
      const cardIndex = parseInt(this.getAttribute("data-close"));
      hideCard(cardIndex);
      hideLove(); // Hide heart when closing card
    });
  });

  // Start Journey button handler
  if (startJourneyBtn) {
    startJourneyBtn.addEventListener("click", async () => {
      // Remove journey-not-started and add journey-active class
      document.body.classList.remove('journey-not-started');
      document.body.classList.add('journey-active');

      // Hide start button
      startJourneyBtn.classList.add("hidden");

      // Show path container
      await showPathContainer();

      // Wait for layout to settle after container expansion
      await new Promise(resolve => setTimeout(resolve, 50));

      // Reposition journey start board AFTER container expansion
      positionStartBoard();

      // Show journey start board now that it's properly positioned
      if (journeyStartBoard) {
        journeyStartBoard.classList.remove("hidden");
      }

      // Wait a moment for board to appear
      await new Promise(resolve => setTimeout(resolve, 50));

      // Recenter view on the initial checkpoint before hopping ahead
      centerLove('auto'); // Instant center before starting journey

      // Small pause for visual clarity
      await new Promise(resolve => setTimeout(resolve, 100));

      // Progressive hop from checkpoint 0 to checkpoint 1
      console.log('🐰 Starting progressive hop sequence...');
      await progressiveHopSequence(0);
      console.log('✅ Progressive hop sequence completed');

      // Don't hide path container - keep it visible with the traveled path
      // Don't clear dashes - keep them visible

      // Show first card (it has blurred background so track is visible)
      console.log('📇 Calling showCard(0)...');
      showCard(0);
      console.log('✅ showCard(0) called');
    });
  }

  // Next button click handlers
  nextButtons.forEach((btn) => {
    btn.addEventListener("click", async function() {
      if (isAnimating) return;

      const currentCardIndex = parseInt(this.getAttribute("data-next"));

      // Hide current card
      hideCard(currentCardIndex);

      // Wait for card to fade out
      await new Promise(resolve => setTimeout(resolve, 600));

      // Calculate next card index and its corresponding checkpoint
      const nextCardIndex = currentCardIndex + 1;
      const nextCheckpoint = cardCheckpointIndex(nextCardIndex);

      // Check if next checkpoint is already unlocked (already visited)
      if (unlockedCheckpoints.includes(nextCheckpoint)) {
        // Already visited - just show the card directly, no hopping
        showCard(nextCardIndex);
        return;
      }

      // Next checkpoint is new - need to hop to it
      // Add next checkpoint to unlocked (we're about to visit it)
      unlockedCheckpoints.push(nextCheckpoint);

      // Show heart again for hopping
      showLove();

      // Reset love state (remove enlarge/fade effect)
      resetLoveState();

      // Re-center viewport to heart position before hopping
      // This ensures we start from heart position even if user manually scrolled
      centerLove('auto'); // Instant re-center to heart position
      await new Promise(resolve => setTimeout(resolve, 100)); // Small pause for visual clarity

      // Love is already at current checkpoint from previous hop
      // Path container is already visible with previous trail
      // Just continue hopping from current position

      // Progressive hop to next checkpoint
      // Segment index = currentCheckpoint (we hop FROM currentCheckpoint TO currentCheckpoint+1)
      await progressiveHopSequence(currentCheckpoint);

      // Don't hide path container - keep it visible with all traveled paths
      // Don't clear dashes - keep them all visible

      // Show next card
      showCard(nextCardIndex);

      // currentCheckpoint is already updated in showCard()
    });
  });

  // Make a Promise button - Sends email to both
  if (makePromiseBtn) {
    makePromiseBtn.addEventListener("click", async () => {
      makePromiseBtn.disabled = true;
      makePromiseBtn.textContent = "Sending...";

      try {
        const response = await fetch('/api/send-promise', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          makePromiseBtn.textContent = "Promise Sent! 💕";
        } else {
          throw new Error(data.error || 'Failed to send');
        }
      } catch (error) {
        console.error('Error:', error);
        makePromiseBtn.textContent = "Error - Try again";
        makePromiseBtn.disabled = false;
      }
    });
  }

  // My Valentine button - Opens valentine.html
  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      window.location.href = 'valentine.html';
    });
  }

  // Initialize
  function handleViewportResize() {
    positionStartBoard();
    maintainCenteredFocus('auto');
  }

  window.addEventListener("resize", handleViewportResize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportResize);
  }

  init();
});
