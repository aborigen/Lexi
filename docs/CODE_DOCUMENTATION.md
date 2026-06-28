# ColumnsGame.tsx Technical Documentation

This document describes the core functions and logic implemented in the `ColumnsGame` component.

## Main Component: `ColumnsGame`
The primary game component for the Columns match-3 puzzle. It manages the game grid, falling stacks, input handling, and the core game loop.

### State Management
- `grid`: A 2D array representing the game board.
- `currentStack`: The IDs of the 3 gems currently falling.
- `stackPos`: The {row, col} position of the top-most gem in the falling stack.
- `isClearing`: Boolean flag to prevent user input during match animations.

## Core Functions

### `generateStack()`
Randomly selects three gem IDs from `GEM_TYPES` to form a new vertical stack. Returns an array of 3 numbers.

### `initGame()`
Resets the game state. Initializes an empty grid, generates the first and second stacks, and resets the score via parent callbacks.

### `cycleGems()`
Shifts the order of gems within the falling stack. Specifically, it moves the bottom gem to the top position.

### `moveLeft()` / `moveRight()`
Attempts to shift the horizontal position of the falling stack. Includes collision detection to ensure the stack doesn't overlap existing gems or go out of bounds.

### `findMatches(currentGrid)`
Scans the grid for sets of 3 or more identical gems.
- **Algorithm**: Iterates through every cell and checks 4 directions: Horizontal, Vertical, Diagonal-Right, and Diagonal-Left.
- **Returns**: A `Set` of coordinate strings (e.g., `"5,2"`) representing gems to be cleared.

### `processBoard(startingGrid)`
An asynchronous orchestrator for the "matching phase".
1. Identifies matches using `findMatches`.
2. Updates score and clears matched cells.
3. Applies "gravity" to collapse gems into empty spaces below them.
4. Recursively repeats until no more matches are found (Cascading).
5. Checks for Game Over if gems reach the top row.

### `tick()`
The "heartbeat" of the game. Advances the falling stack by one row. If the stack cannot move further down (hits bottom or another gem), it triggers `processBoard` to finalize the piece placement.

## Sub-Components

### `Gem`
A UI component representing a single colored gem. Uses CSS properties defined in `GEM_TYPES` (color, shadow, label) and applies a "falling" scale effect when active.
