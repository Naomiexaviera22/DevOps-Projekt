package com.example.notes_app.service;

public class NoteNotFoundException extends RuntimeException {

    public NoteNotFoundException(Long id) {
        super("Notiz mit ID " + id + " wurde nicht gefunden");
    }
}