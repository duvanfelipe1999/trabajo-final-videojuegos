package com.VideoJuegos.controller;


import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Optional;
import com.VideoJuegos.model.Usuario;
import com.VideoJuegos.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = {"http://127.0.0.1:9001", "http://127.0.0.1:5500"})
public class UsuarioController {

    private final UsuarioRepository repositorio;

    public UsuarioController(UsuarioRepository repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping
    public List<Usuario> obtenerUsuarios() {
        return repositorio.findAll();
    }

    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        if (usuario.getId() != null) {
            return ResponseEntity.badRequest().build();
        }
        Usuario guardado = repositorio.save(usuario);
        return ResponseEntity.ok(guardado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable Long id) {
        Optional<Usuario> opt = repositorio.findById(id);
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
