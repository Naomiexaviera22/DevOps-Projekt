import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  useEffect(() => {
  fetch('http://localhost:8080/notes')
    .then((response) => response.json())
    .then((data) => setNotes(data))
    .catch((error) => console.error('Fehler beim Laden der Notizen:', error));
}, []);

  const addNote = (event) => {
  event.preventDefault();

  if (!title.trim() || !content.trim()) {
    return;
  }

  fetch('http://localhost:8080/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title,
      content: content
    })
  })
    .then((response) => response.json())
    .then((newNote) => {
      setNotes([...notes, newNote]);
      setTitle('');
      setContent('');
    })
    .catch((error) => {
      console.error('Fehler beim Erstellen der Notiz:', error);
    });
};
const editNote = (note) => {
  setEditingId(note.id);
  setTitle(note.title);
  setContent(note.content);
};
  const updateNote = (event) => {
  event.preventDefault();

  if (!title.trim() || !content.trim() || editingId === null) {
    return;
  }

  fetch(`http://localhost:8080/notes/${editingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title,
      content: content
    })
  })
    .then((response) => response.json())
    .then((updatedNote) => {
      setNotes(
        notes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        )
      );

      setTitle('');
      setContent('');
      setEditingId(null);
    })
    .catch((error) => {
      console.error('Fehler beim Aktualisieren der Notiz:', error);
    });
};
  const deleteNote = (id) => {
  fetch(`http://localhost:8080/notes/${id}`, {
    method: 'DELETE'
  })
    .then(() => {
      setNotes(notes.filter((note) => note.id !== id));
    })
    .catch((error) => {
      console.error('Fehler beim Löschen der Notiz:', error);
    });
};

  return (
    <div className="app">

      <header className="header">
        <h1>📝 Notes App</h1>
        <p>Meine persönlichen Notizen</p>
      </header>

      <main className="main">

        <section className="new-note">
          <h2>Neue Notiz</h2>

          <form onSubmit={editingId !== null ? updateNote : addNote}>

            <input
              type="text"
              placeholder="Titel"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <textarea
              placeholder="Inhalt"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows="5"
            />

            <button type="submit" onClick={editingId !== null ? updateNote : addNote}>
              {editingId !== null ? 'Notiz speichern' : '+ Notiz erstellen'}
            </button>

          </form>
        </section>

        <section className="notes-section">
          <h2>Meine Notizen</h2>

          <div className="notes-grid">

            {notes.map((note) => (
              <div className="note-card" key={note.id}>

                <h3>{note.title}</h3>

                <p>{note.content}</p>

                <div className="note-actions">

                  <button
                    className="edit-button"
                    onClick={() => editNote(note)}
                  >
                    Bearbeiten
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => deleteNote(note.id)}
                  >
                    Löschen
                  </button>

                </div>

              </div>
            ))}

          </div>
        </section>

      </main>

    </div>
  );
}

export default App;