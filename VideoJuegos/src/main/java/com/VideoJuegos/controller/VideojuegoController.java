package com.VideoJuegos.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.VideoJuegos.model.Videojuego;
import com.VideoJuegos.repository.VideojuegoRepository;

@RestController
@CrossOrigin(origins = {"http://127.0.0.1:9001", "http://127.0.0.1:5500"})
public class VideojuegoController {

    private final VideojuegoRepository repositorio;

    public VideojuegoController(VideojuegoRepository repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping("/api/videojuegos")
    public List<Videojuego> obtenerVideojuegos() {
        return repositorio.findAll();
    }

    @GetMapping("/api/videojuegos/{id}")
    public ResponseEntity<Videojuego> obtenerVideojuego(@PathVariable Long id) {
        Optional<Videojuego> opt = repositorio.findById(id);
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/api/videojuegos")
    public ResponseEntity<Videojuego> guardarVideojuego(@RequestBody Videojuego videojuego) {
        if (videojuego.getId() != null) {
            return ResponseEntity.badRequest().build();
        }
        Videojuego videojuegoGuardado = repositorio.save(videojuego);
        return ResponseEntity.ok(videojuegoGuardado);
    }

    @PutMapping("/api/videojuegos")
    public ResponseEntity<Videojuego> actualizarVideojuego(@RequestBody Videojuego videojuego) {
        if (videojuego.getId() == null || !repositorio.existsById(videojuego.getId())) {
            return ResponseEntity.badRequest().build();
        }
        Videojuego videojuegoActualizado = repositorio.save(videojuego);
        return ResponseEntity.ok(videojuegoActualizado);
    }

    @DeleteMapping("/api/videojuegos/{id}")
    public ResponseEntity<Void> borrarVideojuego(@PathVariable Long id) {
        if (id == null || !repositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}