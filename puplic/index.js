// Load tasks from backend
function loadtasks() {
  fetch(`/api/task/all`)
    .then(res => res.json())
    .then(data => {
      const app = document.querySelector('.all-tasks');
      app.innerHTML = ''; // clear existing tasks
      data.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskDiv.dataset.id = task.id;
        taskDiv.dataset.status = task.status;
        if (task.status != 0) taskDiv.classList.add('completed');

        const span = document.createElement('span');
        span.textContent = task.task_name;

        const actionDIV = document.createElement('div');
        actionDIV.classList.add('actions');

        const doneBTN = document.createElement('button');
        doneBTN.classList.add('done');
        doneBTN.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
        doneBTN.dataset.id = task.id;

        const deleteBTN = document.createElement('button');
        deleteBTN.classList.add('delete');
        deleteBTN.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        deleteBTN.dataset.id = task.id;

        // Delete functionality
        deleteBTN.addEventListener('click', () => delete_data(task.id));

        // Done functionality
        doneBTN.addEventListener('click', () => {
          taskDiv.classList.toggle('completed');
          check(task.id, taskDiv.classList.contains('completed') ? 1 : 0);
        });

        actionDIV.appendChild(doneBTN);
        actionDIV.appendChild(deleteBTN);
        taskDiv.appendChild(span);
        taskDiv.appendChild(actionDIV);
        app.appendChild(taskDiv);
      });
    });
}
