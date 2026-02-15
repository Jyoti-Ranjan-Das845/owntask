# Timeline Redesign Plan: Vertical-Centered Layout

## Current Issues
- Horizontal + vertical scrolling required
- Card positioning off-screen
- Complex coordinate calculations
- Heart not centered during hops
- Journey start board missing

## New Design Concept

### Container Structure
```
Body (full width)
└── Journey Header (full width)
    └── Button (full width)
        └── Timeline Track Container (75% width, centered)
            └── Path Container
                ├── SVG Curvy Path
                ├── 9 Checkpoints (on 8 vertical lines)
                ├── Love Heart
                └── Journey Start Board
└── Timeline Cards (position: fixed, viewport center)
```

### Vertical Line System
- **8 cards = 8 vertical lines + 1 starting point**
- Lines evenly spaced across 75% container
- Line positions: 0%, 14.29%, 28.57%, 42.86%, 57.14%, 71.43%, 85.71%, 100%
- All checkpoints positioned ON these lines

### Checkpoint Positions (New)
```javascript
Container width: 75vw
Container centered: margin 12.5vw on each side

Checkpoint positions (relative to container):
0: {x: 37.5%, y: 100px}   // Starting point (middle)
1: {x: 14.29%, y: 400px}  // Line 1 (left)
2: {x: 71.43%, y: 700px}  // Line 5 (right)
3: {x: 28.57%, y: 1000px} // Line 2 (left-center)
4: {x: 85.71%, y: 1300px} // Line 6 (far right)
5: {x: 42.86%, y: 1600px} // Line 3 (center)
6: {x: 57.14%, y: 1900px} // Line 4 (right-center)
7: {x: 100%, y: 2200px}   // Line 7 (far right)
8: {x: 0%, y: 2500px}     // Line 0 (far left)
```

### SVG Path (New)
```svg
<path d="
  M 150,100                    <!-- Start (center) -->
  Q 100,250 57,400             <!-- Curve to checkpoint 1 -->
  Q 20,550 286,700             <!-- S-curve to checkpoint 2 -->
  Q 350,850 114,1000           <!-- S-curve to checkpoint 3 -->
  Q 50,1150 343,1300           <!-- S-curve to checkpoint 4 -->
  Q 400,1450 171,1600          <!-- S-curve to checkpoint 5 -->
  Q 130,1750 228,1900          <!-- S-curve to checkpoint 6 -->
  Q 280,2050 400,2200          <!-- S-curve to checkpoint 7 -->
  Q 450,2350 0,2500            <!-- S-curve to checkpoint 8 -->
" />
```

## Implementation Changes

### 1. CSS Changes (timeline-style.css)

```css
/* Remove wide container */
body.journey-active .journey-container {
  width: 100vw;          /* Change from 200vw */
  margin-left: 0;        /* Change from -50vw */
  padding-left: 2rem;    /* Change from 50vw */
  padding-right: 2rem;   /* Change from 50vw */
}

/* Add centered track container */
.timeline-track-container {
  width: 75%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

/* Path container inside track container */
.path-container {
  width: 100%;
  margin: 0;              /* Remove auto centering */
  min-height: 2800px;     /* Adjust for vertical layout */
}
```

### 2. JavaScript Changes (timeline-script.js)

```javascript
// NEW: Calculate vertical line positions
const numCards = 8;
const numLines = numCards;
const verticalLines = [];
for (let i = 0; i <= numLines; i++) {
  verticalLines.push((i / numLines) * 100); // Percentages
}

// NEW: Checkpoint positions (in percentages of container)
const checkpointPositions = [
  { left: '37.5%', top: 100 },   // Start (middle)
  { left: '14.29%', top: 400 },  // Checkpoint 1
  { left: '71.43%', top: 700 },  // Checkpoint 2
  { left: '28.57%', top: 1000 }, // Checkpoint 3
  { left: '85.71%', top: 1300 }, // Checkpoint 4
  { left: '42.86%', top: 1600 }, // Checkpoint 5
  { left: '57.14%', top: 1900 }, // Checkpoint 6
  { left: '100%', top: 2200 },   // Checkpoint 7
  { left: '0%', top: 2500 }      // Checkpoint 8
];

// MODIFIED: centerLove function (vertical only)
function centerLove(behavior = 'auto') {
  const coords = getLoveAbsolutePosition();
  if (!coords) return;

  // Only center vertically, no horizontal scroll
  const viewport = getViewportMetrics();
  const targetScrollY = coords.absoluteY - (viewport.height / 2);

  window.scrollTo({
    top: targetScrollY,
    left: 0,  // No horizontal scroll
    behavior
  });
}
```

### 3. HTML Changes (timeline.html)

```html
<!-- Add track container wrapper -->
<div class="journey-container">
  <div class="timeline-track-container">
    <div class="path-container">
      <!-- Existing SVG and checkpoints -->
    </div>
  </div>
</div>
```

## Testing Checklist

- [ ] Initial state: Button centered, no scroll
- [ ] Click button: Track appears in 75% container
- [ ] Heart hops: Stays centered horizontally, scrolls vertically
- [ ] Checkpoints: All visible within container width
- [ ] Cards: Open at viewport center
- [ ] iPhone size: Works without horizontal scroll
- [ ] Desktop: Works without horizontal scroll
- [ ] Journey start board: Visible at first checkpoint

## Benefits

✅ **No horizontal scrolling** - Only vertical
✅ **Predictable layout** - Checkpoints on fixed vertical lines
✅ **Simpler scroll logic** - Only Y-axis calculations
✅ **Mobile-friendly** - No wide horizontal space needed
✅ **Centered cards** - Always in viewport center
✅ **Cleaner design** - More organized visual flow
