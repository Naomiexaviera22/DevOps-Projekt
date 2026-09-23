package com.example.notes_app.controller;

import com.example.notes_app.model.Note;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class NoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllNotes_funktioniert() throws Exception {
        mockMvc.perform(get("/notes"))
                .andExpect(status().isOk());
    }

    @Test
    void createNote_erstelltNeueNotiz() throws Exception {
        Note note = new Note();
        note.setTitle("Testtitel");
        note.setContent("Testinhalt");

        mockMvc.perform(post("/notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(note)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Testtitel"))
                .andExpect(jsonPath("$.content").value("Testinhalt"))
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void updateNote_aendertBestehendeNotiz() throws Exception {
        Note note = new Note();
        note.setTitle("Alter Titel");
        note.setContent("Alter Inhalt");

        String response = mockMvc.perform(post("/notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(note)))
                .andReturn().getResponse().getContentAsString();

        Note createdNote = objectMapper.readValue(response, Note.class);

        Note updatedNote = new Note();
        updatedNote.setTitle("Neuer Titel");
        updatedNote.setContent("Neuer Inhalt");

        mockMvc.perform(put("/notes/" + createdNote.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedNote)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Neuer Titel"));
    }

    @Test
    void deleteNote_loeschtNotiz() throws Exception {
        Note note = new Note();
        note.setTitle("Zu löschen");
        note.setContent("Wird gelöscht");

        String response = mockMvc.perform(post("/notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(note)))
                .andReturn().getResponse().getContentAsString();

        Note createdNote = objectMapper.readValue(response, Note.class);

        mockMvc.perform(delete("/notes/" + createdNote.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/notes/" + createdNote.getId()))
                .andExpect(status().isNotFound());
    }
}