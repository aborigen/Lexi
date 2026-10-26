# Git Workflow Guide - Lexi.AI

This guide explains how to manage your project using Git branches, specifically tailored for the Lexi.AI multi-platform environment.

---

## 1. What is a Branch?
A branch is a parallel version of your code. It allows you to work on new features (like a new AI hint logic or VK integration) without affecting the stable "Main" version of your game.

## 2. Recommended Branching Strategy

### The `main` Branch
This is your "Single Source of Truth." It should always contain code that builds and runs perfectly. 

### Feature Branches (`feature/...`)
When adding something new, create a branch from `main`:
- `feature/add-sber-sdk`
- `feature/ui-glassmorphism-update`
- `feature/new-en-levels`

### Bugfix Branches (`fix/...`)
Used for quick patches:
- `fix/victory-dialog-overflow`
- `fix/yandex-sdk-loading-bug`

## 3. Why it matters for Lexi.AI
Since this project targets multiple platforms (Yandex, VK, Sber), branches allow you to:
1.  **Experiment**: Try a new Genkit prompt in a branch without breaking the existing AI Advisor.
2.  **Verify**: Build a static archive from a specific branch to test on the VK sandbox before committing to the main release.
3.  **Safety**: If an `npm install` breaks your environment (as seen with versioning issues), you can easily revert to the state of the branch before the change.

## 4. Basic Commands
- **Create a branch**: `git checkout -b feature-name`
- **Switch branches**: `git checkout main`
- **Merge changes**: (While on main) `git merge feature-name`
