// Load tasks from backend
function loadtasks() {
  fetch('/api/task/all')
    .then(res => res.json())
    .then(data => {
      const app = document.querySelector('.all-tasks');
      app.innerHTML = '';

      data.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskDiv.dataset.id = task.id;

        if (task.status != 0) taskDiv.classList.add('completed');

        const span = document.createElement('span');
        span.textContent = task.task_name;

        const actionDIV = document.createElement('div');
        actionDIV.classList.add('actions');

        const doneBTN = document.createElement('button');
        doneBTN.classList.add('done');
        doneBTN.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;

        const deleteBTN = document.createElement('button');
        deleteBTN.classList.add('delete');
        deleteBTN.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        // ✅ DELETE TASK
        deleteBTN.addEventListener('click', () => delete_data(task.id));

        // ✅ MARK COMPLETE
        doneBTN.addEventListener('click', () => {
          const newStatus = taskDiv.classList.contains('completed') ? 0 : 1;
          taskDiv.classList.toggle('completed');
          check(task.id, newStatus);
        });

        actionDIV.appendChild(doneBTN);
        actionDIV.appendChild(deleteBTN);
        taskDiv.appendChild(span);
        taskDiv.appendChild(actionDIV);
        app.appendChild(taskDiv);
      });
    });
}

// ================= INSERT TASK =================
function send_data() {
  const input = document.getElementById('new-task');
  const taskName = input.value.trim();

  if (taskName === '') {
    alert('Please enter a task');
    return;
  }

  fetch('/api/task/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task_name: taskName })
  })
  .then(res => res.json())
  .then(() => {
    input.value = '';
    loadtasks();
  })
  .catch(err => console.error(err));
}

// ================= DELETE FUNCTION =================
function delete_data(id) {
  fetch('/api/task/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task_id: id })
  })
  .then(res => res.json())
  .then(() => loadtasks());
}

// ================= UPDATE STATUS =================
function check(id, status) {
  fetch('/api/task/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id, new_status: status })
  })
  .then(res => res.json())
  .then(() => loadtasks());
}

// Auto load on page open
document.addEventListener('DOMContentLoaded', loadtasks);
