#  Pebble Task – Lightweight Task Manager Web Extension  

**Pebble Task** is a draggable, resizable task manager that keeps you organized without cluttering your workspace. Designed for simplicity, it offers intuitive task management with real-time updates and customizable themes.   

---

## ✨ Features  

- **Draggable & Resizable** – Uses `react-rnd` to allow free movement and resizing of the widget.  
- **Task Management** – Create, edit, delete, and reorder tasks effortlessly.  
- **Auto-Save Progress** – Your tasks persist across sessions, so nothing gets lost.  
- **Theme Switching** – Choose between Light, Dark, Coffee, Matcha and Ocean themes in the settings menu.  
- **Task Prioritization** – Highlight important tasks for better organization.  
- **Completion Effects** – Enjoy a confetti celebration when all tasks are completed!  
---

## 🚀 Tech Stack  

- **Framework:** React 18  
- **Build Tool:** Vite  
- **UI Library:** Chakra UI  
- **State Management:** Zustand  
- **Interactions:**  
  - `react-rnd` (Dragging & Resizing)  
  - `framer-motion` (Animations)  
- **Styling:** Emotion (via Chakra UI)  
- **Icons:** Chakra UI Icons, React Icons  

---

## 📋 Prerequisites  

- Node.js (LTS recommended)  
- npm (comes with Node.js) or yarn  

---

## ⚙️ Getting Started  

### 1. Clone the Repository  

```sh
git clone <your-repository-url>
cd pebble-task
```
### 2. Install Dependencies
```
cd my-vite-app
npm install
# or
yarn install
```

### 3. Run the Development Server
```
npm run dev
# or
yarn dev
```

## 🕹️ Usage  

- **Drag** – Click and drag the top bar to move the widget.
- **Collapse** - Collapse widget using the top right icon.
- **Resize** - Resize horizontally by dragging the bottom right edge.
- **Add Tasks** – Type a task in the input field and press **Enter**.  
- **Remove Tasks** – Click on the X to remove a task.  
- **Reorder Tasks** – Drag and drop tasks to rearrange them.  
- **Prioritize Tasks** – Mark important tasks by double clicking them  .
- **Complete & Clear Tasks** – Click a task to mark it as done.
- **Switch Theme** – Open settings to toggle between themes.  
