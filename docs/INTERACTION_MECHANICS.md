
# Interaction Mechanics: Drawing Logic - Lexi.AI

This document explains the technical implementation of the circular line-drawing interaction in the `WordConnect.tsx` component.

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

## 3. The "Undo" (Backtrack) Mechanic
To make the game feel fluid, Lexi.AI supports un-drawing:
- If the pointer moves back toward the **previously** selected letter (the one before the current head of the chain), the last index is popped from the array.
- This allows players to correct mistakes without releasing their touch.

## 4. Visual Rendering (SVG Layer)
The lines are rendered using a dedicated SVG overlay:
- **Connected Segments**: A set of `<line>` elements (or a single `<path>`) connects the centers of all letters in `selectedIndices`.
- **The "Elastic" Path**: A final `<line>` segment is drawn from the center of the last selected letter to the current pointer position (`dragPath`). This provides immediate visual feedback that the game is tracking the user's movement.
- **Glow Effects**: A CSS filter (`#line-glow`) is applied to the lines to match the glassmorphic aesthetic.

## 5. Optimization
- **`useRef` for Indices**: We mirror the `selectedIndices` state in a `useRef` (`selectedIndicesRef`). This allows the `handleInteractionMove` callback (which is wrapped in `useCallback`) to access the latest state without being re-created on every single pixel of movement, ensuring 60fps interaction even on mobile devices.
