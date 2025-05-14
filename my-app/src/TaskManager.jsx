import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './TaskManager.css';


const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const [allCompleted, setAllCompleted] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ width: 300, height: 'auto' });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);
  const [inProgressTask, setInProgressTask] = useState(null);
  const [theme, setTheme] = useState('light'); // default theme
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  
  const taskManagerRef = useRef(null);
  const settingsRef = useRef(null);

  // load tasks from localStorage
  const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  };

  // save tasks to localStorage
  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // save position to localStorage
  const savePositionToLocalStorage = (position) => {
    localStorage.setItem('widgetPosition', JSON.stringify(position));
  };

  // load position from localStorage
  const loadPositionFromLocalStorage = () => {
    const savedPosition = localStorage.getItem('widgetPosition');
    return savedPosition ? JSON.parse(savedPosition) : { x: 50, y: 50 };
  };

  // save size to localStorage
  const saveSizeToLocalStorage = (size) => {
    localStorage.setItem('widgetSize', JSON.stringify(size));
  };

  // load size from localStorage
  const loadSizeFromLocalStorage = () => {
    const savedSize = localStorage.getItem('widgetSize');
    return savedSize ? JSON.parse(savedSize) : { width: 300, height: 'auto' };
  };

  // load expanded/collapsed state from localStorage
  const loadExpandedStateFromLocalStorage = () => {
    const savedExpandedState = localStorage.getItem('widgetExpandedState');
    return savedExpandedState !== null ? JSON.parse(savedExpandedState) : true;
  };

  // save expanded/collapsed state to localStorage
  const saveExpandedStateToLocalStorage = (state) => {
    localStorage.setItem('widgetExpandedState', JSON.stringify(state));
  };

  // save highlighted task to localStorage
  const saveHighlightedTaskToLocalStorage = (taskId) => {
    if (taskId === null) {
      localStorage.removeItem('inProgressTask'); // Remove item instead of storing "null"
    } else {
      localStorage.setItem('inProgressTask', taskId);
    }
  };

  // load highlighted task from localStorage
  const loadHighlightedTaskFromLocalStorage = () => {
    const savedInProgressTask = localStorage.getItem('inProgressTask');
    return savedInProgressTask ? parseInt(savedInProgressTask, 10) : null;
  };

  // save theme to localStorage
  const saveThemeToLocalStorage = (selectedTheme) => {
    localStorage.setItem('widgetTheme', selectedTheme);
  };

  // load theme from localStorage
  const loadThemeFromLocalStorage = () => {
    const savedTheme = localStorage.getItem('widgetTheme');
    return savedTheme || 'light';
  };

  // load tasks, position, size, expanded state, and theme
  useEffect(() => {
    const storedTasks = loadTasksFromLocalStorage();
    setTasks(storedTasks);

    const storedPosition = loadPositionFromLocalStorage();
    setPosition(storedPosition);

    const storedSize = loadSizeFromLocalStorage();
    setSize(storedSize);

    const storedExpandedState = loadExpandedStateFromLocalStorage();
    setIsExpanded(storedExpandedState);

    const storedInProgressTask = loadHighlightedTaskFromLocalStorage();
    setInProgressTask(storedInProgressTask);

    const storedTheme = loadThemeFromLocalStorage();
    setTheme(storedTheme);

    setLoading(false);
  }, []);

  // save position, size, expanded state, and theme to localStorage on change
  useEffect(() => {
    if (!loading) {
      savePositionToLocalStorage(position);
      saveSizeToLocalStorage(size);
      saveExpandedStateToLocalStorage(isExpanded);
      saveThemeToLocalStorage(theme);
    }
  }, [position, size, isExpanded, theme, loading]);

  // close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target) && 
          !event.target.classList.contains('settings-icon')) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // handle editing a task
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  // handle saving an edited task
  const handleSaveTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, text: editingTaskText } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  // handle canceling editing
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskText('');
  };

  // add new task
  const addTask = () => {
    if (taskInput.trim()) {
      const newTask = { id: Date.now(), text: taskInput, completed: false };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setTaskInput('');
    }
  };

  // handle task completion toggle
  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    // check if the completed task is the highlighted task
    const toggledTask = updatedTasks.find(task => task.id === taskId);
    
    // if the task is completed and its the currently highlighted task, remove highlight
    if (toggledTask.completed && inProgressTask === taskId) {
      setInProgressTask(null);
      saveHighlightedTaskToLocalStorage(null);
    }
    
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  // handle task highlight toggle on double-click
  const toggleTaskHighlight = (taskId) => {
    if (inProgressTask === taskId) {
      // if the task is already highlighted, remove the highlight
      setInProgressTask(null);
      saveHighlightedTaskToLocalStorage(null);
    } else if (!tasks.find(task => task.id === taskId).completed) {
      // set the task as highlighted (if not completed)
      setInProgressTask(taskId);
      saveHighlightedTaskToLocalStorage(taskId);
    }
  };

  // remove task
  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    
    // if removing the highlighted task, clear highlight
    if (inProgressTask === taskId) {
      setInProgressTask(null);
      saveHighlightedTaskToLocalStorage(null);
    }
  };

  // check if all tasks are completed
  const checkAllCompleted = () => {
    if (tasks.length > 0) {
      const completed = tasks.every(task => task.completed);
      if (completed && !allCompleted) {
        setAllCompleted(true);
        triggerConfetti();
      } else if (!completed && allCompleted) {
        setAllCompleted(false);
      }
    }
  };

  const triggerConfetti = () => {
    const widgetRect = taskManagerRef.current.getBoundingClientRect();
    const widgetCenterX = widgetRect.left + (widgetRect.width / 2);
    
    confetti({
      particleCount: 200,
      spread: 70,
      origin: {
        x: widgetCenterX / window.innerWidth,
        y: widgetRect.top / window.innerHeight,
      },
    });
  };

  useEffect(() => {
    checkAllCompleted();
  }, [tasks]);

  // mouse down event for dragging
  const handleMouseDown = (e) => {
    if (!e.target.classList.contains('resize-handle') && 
        !e.target.classList.contains('settings-icon') && 
        !e.target.closest('.settings-dropdown')) {
      setDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // handle mouse move event for dragging/resizing
  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    } else if (resizing) {
      const newWidth = Math.max(200, size.width + (e.clientX - resizeStartPos.x));
      setSize({
        ...size,
        width: newWidth
      });
      setResizeStartPos({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  // mouse up event to stop dragging/resizing
  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  // handle resize start
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setResizing(true);
    setResizeStartPos({
      x: e.clientX,
      y: e.clientY
    });
  };

  // mouse event listeners to handle drag/resize globally
  useEffect(() => {
    if (dragging || resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing]);

  // toggle expand/collapse
  const toggleExpand = () => {
    setIsExpanded(prevState => !prevState);
  };

  const toggleSettings = (e) => {
    e.stopPropagation();
    
    if (!settingsOpen) {
      const rect = e.target.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 5,
        left: rect.left
      });
    }
    
    setSettingsOpen(prevState => !prevState);
  };

  // change theme
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    setSettingsOpen(false);
  };

  const handleDragStart = (e, index) => {
    setDraggedTaskIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.target.classList.add("dragging");
    e.stopPropagation();
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
  
    if (draggedTaskIndex === null || draggedTaskIndex === dropIndex) return;
  
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(draggedTaskIndex, 1);
    updatedTasks.splice(dropIndex, 0, movedTask);
  
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setDraggedTaskIndex(null);
  };
  
  const handleDragEnd = (e) => {
    setDraggedTaskIndex(null);
    e.target.classList.remove("dragging");
  };

  // handle keypresses for adding tasks
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // get theme-specific CSS class
  const getThemeClass = () => {
    return `theme-${theme}`;
  };

  // render the widget once position and expanded state are loaded
  if (loading) {
    return <div>Loading...</div>;
  }

  // clear completed tasks button
  const clearCompletedTasks = () => {
    const remainingTasks = tasks.filter(task => !task.completed);
    setTasks(remainingTasks); // This assumes `setTasks` updates the state for tasks
  };

  return (
    <div
      ref={taskManagerRef}
      className={`taskManager ${getThemeClass()}`}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: dragging ? 'grabbing' : 'grab',
        width: `${size.width}px`,
        height: size.height,
      }}
    >
      <div className={`header ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="settings-container">
          <span className="settings-icon" onClick={toggleSettings}>⚙️</span>
          {settingsOpen && (
            <div className="settings-dropdown" ref={settingsRef}
              style={{ 
                top: `${dropdownPosition.top}px`, 
                left: `${dropdownPosition.left}px` 
              }}
            > 
              <h3>Theme</h3>
              <div className="theme-options">
                <button 
                  className={`theme-option ${theme === 'light' ? 'active' : ''}`} 
                  onClick={() => changeTheme('light')}
                >
                  Light
                </button>
                <button 
                  className={`theme-option ${theme === 'dark' ? 'active' : ''}`} 
                  onClick={() => changeTheme('dark')}
                >
                  Dark
                </button>
                <button 
                  className={`theme-option ${theme === 'coffee' ? 'active' : ''}`} 
                  onClick={() => changeTheme('coffee')}
                >
                  Coffee
                </button>
                <button 
                  className={`theme-option ${theme === 'matcha' ? 'active' : ''}`} 
                  onClick={() => changeTheme('matcha')}
                >
                  Matcha
                </button>
                <button 
                  className={`theme-option ${theme === 'catppuccin-mocha' ? 'active' : ''}`} 
                  onClick={() => changeTheme('catppuccin-mocha')}
                >
                  Catppuccin Mocha
                </button>
                <button 
                  className={`theme-option ${theme === 'breeze' ? 'active' : ''}`} 
                  onClick={() => changeTheme('breeze')}
                >
                  Breeze
                </button>
              </div>
            </div>
          )}
        </div>
        <h1>Pebble Task</h1>
        <button
          onClick={toggleExpand}
          className="expand-collapse-btn"
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {!isExpanded && inProgressTask !== null && (
        <div className="collapsed-task-preview">
          <span className="current-task-label">Current task:</span>
          <div className="current-task">
            {tasks.find(task => task.id === inProgressTask)?.text || "No task in progress"}
          </div>
        </div>
      )}

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: tasks.length === 0
              ? '0%' 
              : `${(tasks.filter(task => task.completed).length / tasks.length) * 100}%`,
          }}
        ></div>
      </div>

      <div className={`content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {isExpanded && (
          <>
            <div className="input-container">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter task..."
              />
              <button onClick={addTask}>Add Task</button>
            </div>

            <ul className="task-list">
              {tasks.map((task, index) => (
                <li
                  key={task.id}
                  className={`task-item ${draggedTaskIndex === index ? "dragging" : ""} ${inProgressTask === task.id && !task.completed ? "in-progress" : ""} ${task.completed ? "completed" : ""}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  onDoubleClick={() => toggleTaskHighlight(task.id)}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                  />
                  {editingTaskId === task.id ? (
                    <>
                      <input
                        type="text"
                        value={editingTaskText}
                        onChange={(e) => setEditingTaskText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveTask(task.id);
                          }
                        }}
                      />
                      <button onClick={() => handleSaveTask(task.id)}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span>{task.text}</span>
                      <button onClick={() => handleEditTask(task)}>Edit</button>
                      <button className="x-button" onClick={() => removeTask(task.id)}>X</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
      
            {tasks.some(task => task.completed) && (
            <button 
              id="clear-completed"
              onClick={clearCompletedTasks}
              className="clear-completed-btn"
            >
              Clear Completed
            </button>
          )}
            {allCompleted && tasks.length > 0 && <div className="good-job">Good Job! All tasks completed!</div>}
          </>
        )}
      </div>
      
      <div 
        className="resize-handle"
        onMouseDown={handleResizeStart}
      ></div>
    </div>
  );
};

export default TaskManager;
