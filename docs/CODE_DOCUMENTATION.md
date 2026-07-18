
# WordConnect.tsx Technical Documentation

The `WordConnect` component handles the core logic for a circular word-linking puzzle game.

## Core Mechanics

### Circular Layout
Letters are positioned around a central point using polar-to-cartesian coordinate conversion. 
- `getLetterPos(index)`: Calculates the `{x, y}` position for a letter based on its index in the 5-letter array.

### Interaction Logic
The game uses a "drawing" interaction model supported by both Mouse and Touch events.
- `handleInteractionStart`: Initializes the selection path.
- `handleInteractionMove`: Tracks the cursor/finger. It detects "collision" with other letters by checking the distance between the pointer and letter centers.
- `handleInteractionEnd`: Validates the formed string against the current level's `validWords` list.

### Word Validation
Words are only counted once. If the user finds all valid words for a level, the `onLevelComplete` callback is triggered.

### Visual Feedback
- **SVG Layer**: Draws dynamic lines between selected letters in real-time.
- **Word Grid**: A collection of hidden letter boxes that reveal their content once a word is correctly identified.

## AI Hint Integration
The AI advisor receives the current set of letters, words already found, and the full list of valid words. It identifies a missing word and provides a cryptic hint.
