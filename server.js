const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dbPath = path.join(__dirname, './Develop/db/db.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Develop/public')));

// Route to serve notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

// Route to serve index.html
app.get('/', (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

// API route to get notes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  res.json(notes);
});

// API route to post new notes
app.post('/api/notes', (req, res) => {
  try {
    const notes = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const newNote = req.body;
    newNote.id = uuidv4();
    notes.push(newNote);
    fs.writeFileSync(dbPath, JSON.stringify(notes, null, 2));
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
});

// API route to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const newNotesArray = notes.filter((note) => note.id !== req.params.id);
  fs.writeFileSync(dbPath, JSON.stringify(newNotesArray, null, 2));
  res.json(newNotesArray);
});

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
