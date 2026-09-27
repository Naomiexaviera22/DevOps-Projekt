package com.example.notes_app.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class Note {

    private Long id;

    @NotBlank(message = "Titel darf nicht leer sein")
    @Size(max = 200, message = "Titel darf maximal 200 Zeichen sein")
    private String title;

    @Size(max = 5000, message = "Inhalt darf maximal 5000 Zeichen sein")
    private String content;

    public Note() {
    }

    public Note(Long id, String title, String content) {
        this.id = id;
        this.title = title;
        this.content = content;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}