const express = require('express');
const app = express();
const db = require('./conn');
const path = require('path');

const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Correct static folder
app.use(express.static(path.join(__dirname, 'public')));

// ================= FETCH ALL TASKS =================
app.get('/api/task/all', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY status, id DESC', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(rows);
  });
});

// ================= INSERT NEW TASK =================
app.post('/api/task/new', (req, res) => {
  const { task_name } = req.body;

  if (!task_name || task_name.trim() === '') {
    return res.status(400).json({ error: 'Task name required' });
  }

  db.query(
    'INSERT INTO tasks (task_name, status) VALUES (?, 0)',
    [task_name],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to insert task' });
      }
      res.json({ message: 'Task added successfully' });
    }
  );
});

// ================= DELETE TASK =================
app.delete('/api/task/delete', (req, res) => {
  const { task_id } = req.body;

  db.query('DELETE FROM tasks WHERE id = ?', [task_id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete task' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

// ================= UPDATE TASK STATUS =================
app.put('/api/task/update', (req, res) => {
  const { new_status, id } = req.body;

  db.query(
    'UPDATE tasks SET status = ? WHERE id = ?',
    [new_status, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update task' });
      }
      res.json({ message: 'Task updated successfully' });
    }
  );
});

// ================= START SERVER =================
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
