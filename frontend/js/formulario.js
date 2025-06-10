// Cargar categorías al iniciar
let categoriasGlobal = [];

window.addEventListener("DOMContentLoaded", async () => {
    const select = document.getElementById("categoria_id");
    try {
        const resp = await fetch("http://localhost:8080/api/categorias");
        const categorias = await resp.json();
        categoriasGlobal = categorias;
        categoriasGlobal.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.nombreCategoria;
            select.appendChild(option);
        });
    } catch (e) {
        console.error("Error cargando categorías", e);
    }
});


let boton = document.getElementById("btnRegistrar");

boton.addEventListener("click", evento => {
    evento.preventDefault(); // Prevenir el envío tradicional del formulario si el botón es type="submit"
    registrarVideojuego();
});

let registrarVideojuego = async () => {
    let campos = {};

    campos.titulo = document.getElementById("titulo").value;
    campos.director = document.getElementById("director").value;
    campos.categoria_id = parseInt(document.getElementById("categoria_id").value);
    campos.precio = parseFloat(document.getElementById("precio").value);

    try {
        const peticion = await fetch("http://localhost:8080/api/videojuegos", {
            method: 'POST',
            headers: { // Corregido: headers
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(campos) // Corregido: body
        });

        if (!peticion.ok) {
            // Manejar errores HTTP, por ejemplo, mostrar un mensaje al usuario
            console.error("Error al registrar el videojuego: ", peticion.status, await peticion.text());
            alert("Error al registrar el videojuego. Código: " + peticion.status);
            return;
        }

        const videojuegoGuardado = await peticion.json();
        console.log("Videojuego registrada:", videojuegoGuardado);
        alert("Videojuego registrada con éxito!");
        // Opcional: limpiar el formulario o redirigir
        document.querySelector("form").reset(); // Asume que el form es el único o el que contiene los campos

    } catch (error) {
        console.error("Error en la petición fetch:", error);
        alert("Error de conexión al intentar registrar la videojuego.");
    }
};

