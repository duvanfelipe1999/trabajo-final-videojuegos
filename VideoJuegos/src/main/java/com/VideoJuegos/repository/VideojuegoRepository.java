package com.VideoJuegos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VideoJuegos.model.Videojuego;

@Repository
public interface VideojuegoRepository extends JpaRepository<Videojuego, Long> {

}  
    

