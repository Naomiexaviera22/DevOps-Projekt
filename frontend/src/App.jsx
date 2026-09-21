import { useState } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Willkommen',
      content: 'Das ist unsere erste Notiz.'
    },
    {
      id: 2,
      title: 'DevOps',
      content: 'Frontend mit React und Vite erstellen.'
    }
  ]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const addNote = (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    const newNote = {
      id: Date.now(),
      title: title,
      content: content
    };

    setNotes([...notes, newNote]);

    setTitle('');
    setContent('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
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

          <form onSubmit={addNote}>

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

            <button type="submit">
              + Notiz erstellen
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

                  <button className="edit-button">
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