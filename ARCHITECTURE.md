# Smart Blog Editor - Architecture Documentation

## Overview
Smart Blog Editor is a full-stack web application that allows users to create and manage blog drafts with a rich text editor built using Lexical.  
It supports auto-save with debouncing, draft publishing, authentication with JWT, and AI-powered features such as summary generation and grammar correction using Gemini API.

This project was built with a focus on:
- **LLD (Frontend Design & Component Structure)**
- **HLD (Backend API Design & Database Schema)**
- **DSA/Logic (Debounced Auto-Save Algorithm)**
- **Bonus Features (AI Integration + Authentication)**

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Lexical Editor
- Zustand (Global state management)

### Backend
- FastAPI (Python)
- MongoDB (Database)
- JWT Authentication
- Gemini API Integration

---

## Folder Structure

### Root

---

## Key Frontend Components

### BlogEditor.jsx
- Uses Lexical framework for rich-text editing.
- Supports headings, lists, history, formatting.
- Editor state is stored as Lexical JSON.

### ToolBar.jsx
- Provides buttons like:
  - Generate Summary
  - Fix Grammar
- Calls backend AI streaming endpoints.

### EditorPage.jsx
- Displays sidebar drafts list and editor.
- Handles:
  - selecting drafts
  - creating new draft
  - publishing draft
  - showing auto-save status

---

## Zustand Global State (State Management)

### postStore.js
Maintains global draft/editor state such as:
- drafts list
- active post
- editorText
- editorJson
- loading status
- autosave status (isSaving, lastSavedAt)

This ensures editor and sidebar stay synced without prop drilling.

### authStore.js
Maintains authentication state:
- token
- login/logout methods
- persistent storage via localStorage

---

## Auto-Save Algorithm (DSA & Logic Focus)

### Problem
Saving on every keystroke spams the backend API.

### Solution: Debouncing
Auto-save is implemented using a debounced timer:
- Each time user types, the timer resets.
- Only after user stops typing for X seconds, save is triggered.

### Benefits
- Reduces API calls
- Efficient for real-time editing
- Improves performance

Implementation is handled in:
- `hooks/useAutoSave.js`

---

## Backend Architecture (HLD Focus)

### Backend Folder Structure

---

## Backend Modules

### main.py
- FastAPI entry point
- Registers routers:
  - `/api/auth`
  - `/api/posts`
  - `/api/ai`

### db.py
- MongoDB connection
- Exposes collections:
  - users_collection
  - posts_collection

---

## Database Schema (MongoDB)

### User Document
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password": "hashed_password"
}
{
  "_id": "ObjectId",
  "title": "string",
  "content": { "lexical_json": "object" },
  "status": "draft/published",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "userId": "string"
}
