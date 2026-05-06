const learningGoalsEl = document.getElementById('learning-goals');
const dailyTasksEl = document.getElementById('daily-tasks');
const taskListEl = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const formMessageEl = document.getElementById('form-message');
const refreshBtn = document.getElementById('refresh-btn');

const statusCycle = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
};

function formatLabel(value) {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function setFormMessage(message, isError = false) {
  formMessageEl.textContent = message;
  formMessageEl.classList.toggle('error-text', isError);
}

function createDayCard(item) {
  const [day, topic] = item.split(':');

  return `
    <article class="day-card">
      <span class="day-number">${day}</span>
      <h3>${topic.trim()}</h3>
      <p>${day === 'Day 5' ? 'Final in-memory project deliverable.' : 'Core concept for the week progression.'}</p>
    </article>
  `;
}

function createTaskCard(task) {
  const nextStatus = statusCycle[task.status];

  return `
    <article class="task-card">
      <div class="task-meta">
        <span class="status-badge status-${task.status}">${formatLabel(task.status)}</span>
        <span>#${task.id}</span>
      </div>
      <h3>${task.title}</h3>
      <p>${task.description || 'No description yet. Keep it minimal, keep it moving.'}</p>
      <div class="task-actions">
        <button class="btn btn-secondary" type="button" data-action="cycle" data-id="${task.id}" data-status="${nextStatus}">
          Move to ${formatLabel(nextStatus)}
        </button>
        <button class="btn btn-ghost" type="button" data-action="delete" data-id="${task.id}">
          Delete
        </button>
      </div>
    </article>
  `;
}

async function loadProjectInfo() {
  const response = await fetch('/api-info');
  const data = await response.json();

  learningGoalsEl.innerHTML = data.learningGoals.map((goal) => `<li>${goal}</li>`).join('');
  dailyTasksEl.innerHTML = data.dailyTasks.map(createDayCard).join('');
}

async function loadTasks() {
  taskListEl.innerHTML = '<div class="empty-state">Loading tasks...</div>';

  try {
    const response = await fetch('/tasks');
    const tasks = await response.json();

    if (!Array.isArray(tasks) || tasks.length === 0) {
      taskListEl.innerHTML =
        '<div class="empty-state">No tasks yet. Make the first one and start the grind.</div>';
      return;
    }

    taskListEl.innerHTML = tasks.map(createTaskCard).join('');
  } catch (error) {
    taskListEl.innerHTML =
      '<div class="empty-state error-text">Could not load tasks. Check if the API server is still running.</div>';
  }
}

async function createTask(event) {
  event.preventDefault();

  const formData = new FormData(taskForm);
  const payload = {
    title: String(formData.get('title') || '').trim(),
    description: String(formData.get('description') || '').trim(),
    status: String(formData.get('status') || 'todo'),
  };

  if (!payload.title) {
    setFormMessage('Title is required.', true);
    return;
  }

  try {
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = Array.isArray(errorData.message) ? errorData.message[0] : 'Request failed.';
      throw new Error(message);
    }

    taskForm.reset();
    document.getElementById('status').value = 'todo';
    setFormMessage('Task created. API is eating.');
    await loadTasks();
  } catch (error) {
    setFormMessage(error.message || 'Something went wrong.', true);
  }
}

async function handleTaskAction(event) {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const taskId = target.dataset.id;
  const action = target.dataset.action;

  if (!taskId || !action) {
    return;
  }

  try {
    if (action === 'delete') {
      await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
    }

    if (action === 'cycle') {
      await fetch(`/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: target.dataset.status }),
      });
    }

    await loadTasks();
  } catch (error) {
    setFormMessage('Task action failed.', true);
  }
}

taskForm.addEventListener('submit', createTask);
refreshBtn.addEventListener('click', loadTasks);
taskListEl.addEventListener('click', handleTaskAction);

Promise.all([loadProjectInfo(), loadTasks()]).catch(() => {
  setFormMessage('The page loaded, but project data could not be fetched.', true);
});
