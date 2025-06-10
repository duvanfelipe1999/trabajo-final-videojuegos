let categoriasGlobal = [];

window.onload = async function() {
    await cargarCategorias();
    listarVideojuegos();

    let btnModificar = document.getElementById("btnModificar");
    if (btnModificar) {
        btnModificar.addEventListener("click", evento => {
            evento.preventDefault();
            if (typeof idEditarGlobal !== 'undefined') {
                aplicarActualizacion(idEditarGlobal);
            } else {
                console.error("ID para editar no está definido.");
                alert("Error: No se ha seleccionado una videojuego para modificar.");
            }
        });
    }
};

let idEditarGlobal;

async function cargarCategorias() {
    try {
        const resp = await fetch("http://localhost:8080/api/categorias");
        categoriasGlobal = await resp.json();
        const select = document.getElementById("categoria_id");
        if (select) {
            select.innerHTML = '<option value="">Seleccione una categoría</option>';
            categoriasGlobal.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id;
                option.textContent = cat.nombreCategoria;
                select.appendChild(option);
            });
        }
    } catch (e) {
        console.error("Error cargando categorías", e);
    }
}

async function listarVideojuegos() {
    try {
        const peticion = await fetch("http://localhost:8080/api/videojuegos", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        if (!peticion.ok) {
            console.error("Error al listar videojuegos:", peticion.status);
            return;
        }

        const videojuegos = await peticion.json();
        let contenidoTabla = "";

        for (let videojuego of videojuegos) {
            // Buscar el nombre de la categoría por ID
            let categoriaNombre = "Sin categoria";
            if (categoriasGlobal.length > 0) {
                let cat = categoriasGlobal.find(
                    c => Number(c.id) === Number(videojuego.categoria_id || videojuego.categoriaId)
                );
                categoriaNombre = cat ? cat.nombreCategoria : "Sin categoría";
            
            }

            let contenidoFila = `<tr>
                <td>${videojuego.id}</td>
                <td>${videojuego.titulo}</td>
                <td>${videojuego.director}</td>
                <td>${categoriaNombre}</td>
                <td>${videojuego.precio != null ? videojuego.precio : ""}</td>
                <td>
                    <i title="Editar" onClick="editarVideojuego(${videojuego.id})" class="material-icons button edit">edit</i>
                    <i title="Eliminar" onClick="borrarVideojuego(${videojuego.id})" class="material-icons button delete">delete</i>
                </td>
            </tr>`;
            contenidoTabla += contenidoFila;
        }

        let tabla = document.querySelector("#tabla");
        let tbody = tabla.querySelector("tbody");
        if (!tbody) {
            tbody = document.createElement('tbody');
            tabla.appendChild(tbody);
        }
        tbody.innerHTML = contenidoTabla;

    } catch (error) {
        console.error("Error en fetch al listar videojuegos:", error);
    }
}

async function borrarVideojuego(id) {
    if (!confirm("¿Estás seguro de que quieres borrar esta videojuego?")) {
        return;
    }
    try {
        const peticion = await fetch("http://localhost:8080/api/videojuegos/" + id, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        if (!peticion.ok) {
            console.error("Error al borrar videojuego:", peticion.status);
            alert("Error al borrar la videojuego. Código: " + peticion.status);
            return;
        }

        console.log("Videojuego borrado con ID:", id);
        alert("Videojuego borrado con éxito!");
        listarVideojuegos();
    } catch (error) {
        console.error("Error en fetch al borrar videojuego:", error);
        alert("Error de conexión al intentar borrar el videojuego.");
    }
}

async function editarVideojuego(id) {
    mostrarFormulario();
    idEditarGlobal = id;

    try {
        const peticion = await fetch("http://localhost:8080/api/videojuegos/" + id, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        if (!peticion.ok) {
            console.error("Error al obtener videojuego para editar:", peticion.status);
            alert("Error al cargar datos de la videojuego para editar. Código: " + peticion.status);
            return;
        }

        const videojuego = await peticion.json();

        document.getElementById("titulo").value = videojuego.titulo;
        document.getElementById("director").value = videojuego.director;
        document.getElementById("categoria_id").value = videojuego.categoria_id || videojuego.categoriaId || "";
        document.getElementById("precio").value = videojuego.precio != null ? videojuego.precio : "";

    } catch (error) {
        console.error("Error en fetch al obtener videojuego para editar:", error);
        alert("Error de conexión al cargar datos para editar.");
    }
}

async function aplicarActualizacion(id) {
    let campos = {};
    campos.id = id;
    campos.titulo = document.getElementById("titulo").value;
    campos.director = document.getElementById("director").value;
    campos.categoria_id = parseInt(document.getElementById("categoria_id").value);
    campos.precio = parseFloat(document.getElementById("precio").value);

    if (!campos.titulo || !campos.director || !campos.categoria_id || isNaN(campos.precio)) {
        alert("Todos los campos son obligatorios para modificar.");
        return;
    }

    try {
        const peticion = await fetch("http://localhost:8080/api/videojuegos", {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(campos)
        });

        if (!peticion.ok) {
            console.error("Error al actualizar videojuego:", peticion.status, await peticion.text());
            alert("Error al actualizar la videojuego. Código: " + peticion.status);
            return;
        }

        console.log("Videojuego actualizado:", await peticion.json());
        alert("Videojuego actualizado con éxito!");
        listarVideojuegos();
        ocultarFormulario();

    } catch (error) {
        console.error("Error en fetch al actualizar videojuego:", error);
        alert("Error de conexión al intentar actualizar el videojuego.");
    }
}

function mostrarFormulario() {
    let formulario = document.getElementById("formulario");
    if (formulario) {
        formulario.style.visibility = "visible";
    }
}

function ocultarFormulario() {
    let formulario = document.getElementById("formulario");
    if (formulario) {
        formulario.style.visibility = "hidden";
    }
}