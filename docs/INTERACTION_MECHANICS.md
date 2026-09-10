
# Interaction Mechanics: Drawing & Visual Feedback - Lexi.AI

This document explains the technical implementation of the circular line-drawing interaction and the visual feedback system in the `WordConnect.tsx` component.

## 1. Gesture Tracking Lifecycle
The drawing process is managed via three main event handlers attached to the root game container:
- **`onMouseDown` / `onTouchStart`**: Triggers `handleInteractionStart(index)`. It initializes the `selectedIndices` array with the first letter and plays the base pitch SFX.
- **`onMouseMove` / `onTouchMove`**: Triggers `handleInteractionMove`. This is the core engine that tracks the pointer and updates the visual path.
- **`onMouseUp` / `onTouchEnd`**: Triggers `handleInteractionEnd`, which hands the formed string over to the validation logic.

## 2. Real-time Collision Detection
As the user drags their finger/mouse, the app performs high-frequency distance calculations:
- **Coordinate Mapping**: The pointer's screen coordinates (`clientX/Y`) are converted to the internal SVG coordinate space ($2 \times \text{CIRCLE\_RADIUS}$) using a scale factor derived from `getBoundingClientRect()`.
- **Proximity Check**: The system calculates the Euclidean distance between the pointer and every letter's center point.
- **Selection**: If the distance is less than `LETTER_RADIUS * 1.5` and the letter isn't already in the chain, it's added to `selectedIndices`.

## 3. Visual Feedback Mechanics

### 3.1 The "Elastic" Path
To make the game feel responsive, Lexi.AI uses a two-tier line rendering system:
- **Committed Segments**: Solid lines (with `url(#line-gradient)`) connect letters that have already been selected.
- **Dynamic Drag Path**: A semi-transparent "elastic" line segment is drawn from the center of the last selected letter directly to the user's current pointer position (`dragPath`). This provides immediate feedback that the system is active and tracking.

### 3.2 Reactive Letter Scaling
When a letter is added to the selection chain, it undergoes a transformation:
- **Scale Jump**: The letter bubble scales from `1.0` to `1.25` using CSS transitions.
- **Z-Index Elevation**: Selected letters are brought to the front (`z-10`) to overlap the SVG lines.
- **Theme Shift**: The background changes from a transparent glass effect to the `sunny-gradient`, indicating an active state.

### 3.3 The Current Word Preview
As letters are added, a real-time preview appears above the ring:
- **Visual Style**: A glassmorphic "pill" with the `sunny-gradient` background.
- **Animation**: Uses `animate-in zoom-in-95` to pop into existence as soon as the first letter is selected.
- **Typography**: Features uppercase, bold, italicized text to emphasize the "construction" phase of the word.

### 3.4 SVG Glow & Filtering
The lines are not just flat colors; they use advanced SVG definitions:
- **`#line-glow`**: A Gaussian blur filter applied to a duplicate stroke layer to create a soft neon effect.
- **`#line-gradient`**: A linear gradient that transitions between the `primary` and `accent` theme colors, giving the path a sense of energy and direction.

## 4. The "Undo" (Backtrack) Mechanic
To make the game feel fluid, Lexi.AI supports un-drawing:
- If the pointer moves back toward the **previously** selected letter (the one before the current head of the chain), the last index is popped from the array.
- This allows players to correct mistakes without releasing their touch, reducing frustration.

## 5. Optimization
- **`useRef` for Indices**: We mirror the `selectedIndices` state in a `useRef` (`selectedIndicesRef`). This allows the `handleInteractionMove` callback (which is wrapped in `useCallback`) to access the latest state without being re-created on every single pixel of movement, ensuring 60fps interaction even on mobile devices.
