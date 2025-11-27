const express = require('express');
const app = express();
const db = require('./conn'); // make sure your connection file is named db.js
const path = require('path');

// Use the port from environment (Render provides PORT)
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fix static folder path typo: 'puplic' → 'public'
app.use(express.static(path.join(__dirname, 'puplic')));

// API to fetch all tasks
app.get('/api/task/all', (req, res) => {
    db.query('SELECT * FROM tasks ORDER BY status, id DESC', (err, rows) => {
        if (err) {
            console.error(err); // use console.error, not res.console.log
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(rows);
    });
});

// API to insert new task
app.post('/api/task/new', (req, res) => {
    const { task_name } = req.body;
    db.query('INSERT INTO tasks (task_name) VALUES (?)', [task_name], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to insert task' });
        }
        res.json({ message: 'New task inserted successfully' });
    });
});

// API to delete task
app.delete('/api/task/delete', (req, res) => {
    const { task_id } = req.body;
    db.query('DELETE FROM tasks WHERE id = ?', [task_id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete task' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

// API to update task status
app.put('/api/task/update', (req, res) => {
    const { new_status, id } = req.body;
    db.query('UPDATE tasks SET status = ? WHERE id = ?', [new_status, id], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update task' });
        }
        res.json({ message: 'Task updated successfully' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

