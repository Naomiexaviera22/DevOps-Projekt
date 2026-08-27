package com.example.notes_app.service;

import com.example.notes_app.model.Note;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class NoteService {

    private final Map<Long, Note> notes = new LinkedHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(0);

    public List<Note> getAllNotes() {
        return new ArrayList<>(notes.values());
    }

    public Note getNoteById(Long id) {
        Note note = notes.get(id);
        if (note == null) {
            throw new NoteNotFoundException(id);
        }
        return note;
    }

    public Note createNote(Note note) {
        long newId = idCounter.incrementAndGet();
        note.setId(newId);
        notes.put(newId, note);
        return note;
    }

    public Note updateNote(Long id, Note updatedNote) {
        Note existing = getNoteById(id);
        existing.setTitle(updatedNote.getTitle());
        existing.setContent(updatedNote.getContent());
        return existing;
    }

    public void deleteNote(Long id) {
        getNoteById(id);
        notes.remove(id);
    }
}