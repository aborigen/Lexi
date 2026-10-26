# Git Workflow Guide - Lexi.AI

This guide explains how to manage your project using Git branches, specifically tailored for the Lexi.AI multi-platform environment.

---

## 1. What is a Branch?
A branch is a parallel version of your code. It allows you to work on new features (like a new AI hint logic or VK integration) without affecting the stable "Main" version of your game.

## 2. How to Create a Branch (Step-by-Step)

To create a new branch and switch to it immediately, run the following command in your terminal:

```bash
git checkout -b branch-name
```

**Example:**
`git checkout -b feature/ai-hint-update`

### Why the `-b`?
- `git checkout` is the command to switch branches.
- The `-b` flag tells Git to **create** the branch before switching to it.

---

## 3. Recommended Branching Strategy for Lexi.AI

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

---

## 4. Why it matters for Lexi.AI
Since this project targets multiple platforms (Yandex, VK, Sber), branches allow you to:
1.  **Experiment**: Try a new Genkit prompt in a branch without breaking the existing AI Advisor.
2.  **Verify**: Build a static archive from a specific branch to test on the VK sandbox before committing to the main release.
3.  **Safety**: If an `npm install` breaks your environment (as seen with versioning issues), you can easily revert to the state of the branch before the change.

---

## 5. Useful Commands Reference
- **Check current branch**: `git branch`
- **Create and switch**: `git checkout -b branch-name`
- **Switch back to main**: `git checkout main`
- **Merge changes**: (While on main) `git merge branch-name`
- **Delete a branch**: `git branch -d branch-name`
