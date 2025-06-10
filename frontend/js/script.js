// Verificar autenticación antes de cargar la app
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}
checkAuth();

let applications = []; // Declarar aquí para que sea global

document.addEventListener('DOMContentLoaded', async () => {
    // Cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }

    // Obtener categorías para mapear el nombre
    let categorias = [];
    try {
        const resp = await fetch("http://localhost:8080/api/categorias");
        categorias = await resp.json();
    } catch (e) {
        console.error("Error cargando categorías", e);
    }

    // Obtener videojuegos desde el backend
    try {
        const resp = await fetch("http://localhost:8080/api/videojuegos");
        const videojuegos = await resp.json();
        applications = videojuegos.map(vj => {
            const cat = categorias.find(c => Number(c.id) === Number(vj.categoria_id));
            let imagePath = vj.image ? 'src/' + encodeURI(vj.image) : 'src/default.jpg';
            return {
                id: vj.id,
                name: vj.titulo,
                category: cat ? cat.nombreCategoria.toLowerCase().replace(/\s/g, '') : 'sin categoria',
                description: vj.director, // O usa vj.descripcion si tienes ese campo
                version: vj.precio ? `$ ${vj.precio}` : '',
                image:  imagePath// vj.image ? vj.image : 'src/default.jpg' 
            };
        });
    } catch (e) {
        console.error("Error cargando videojuegos", e);
    }

    // Elementos del DOM
    const appListContainer = document.getElementById('app-list');
    const categoryItems = document.querySelectorAll('.category-item');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    const appModal = document.getElementById('app-modal');
    const closeModalButton = document.querySelector('.close-button');
    const modalAppTitle = document.getElementById('modal-app-title');
    const modalAppDescription = document.getElementById('modal-app-description');
    const modalAppCategory = document.getElementById('modal-app-category');
    const modalAppVersion = document.getElementById('modal-app-version');
    const modalDownloadButton = document.getElementById('modal-download-button');
    const modalAppScreenshotContainer = document.getElementById('modal-app-screenshot-container');

    // Función para renderizar las aplicaciones
    function renderApps(appsToRender) {
        appListContainer.innerHTML = '';
        if (appsToRender.length === 0) {
            appListContainer.innerHTML = '<p>No se encontraron herramientas.</p>';
            return;
        }


        // Dentro de renderApps
        appsToRender.forEach(app => {
            console.log(app.image); // <-- Esto
            const appCard = document.createElement('div');
            // ...resto del código...
        });




        appsToRender.forEach(app => {
            const appCard = document.createElement('div');
            appCard.classList.add('app-card');
            appCard.dataset.id = app.id;

            appCard.innerHTML = `
                <img src="${app.image}" alt="${app.name}"onerror="this.onerror=null;this.src='src/default.jpg';">
                <div class="app-info">
                    <h3>${app.name}</h3>
                    <p>${app.description}</p>
                    <span class="category-tag">${app.category.charAt(0).toUpperCase() + app.category.slice(1).replace('_', ' ')}</span>
                </div>
            `;
            appListContainer.appendChild(appCard);

            appCard.addEventListener('click', () => openAppModal(app));
        });
    }

    // Función para filtrar por categoría
    function filterByCategory(category) {
        categoryItems.forEach(item => item.classList.remove('active'));
        document.querySelector(`.category-item[data-category="${category}"]`).classList.add('active');

        let filteredApps = applications;
        if (category !== 'all') {
            filteredApps = applications.filter(app => app.category === category);
        }
        renderApps(filteredApps);
    }

    // Función para buscar aplicaciones
    function searchApps() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredApps = applications.filter(app =>
            app.name.toLowerCase().includes(searchTerm) ||
            app.description.toLowerCase().includes(searchTerm) ||
            app.category.toLowerCase().includes(searchTerm)
        );
        renderApps(filteredApps);
    }

    // Función para abrir el modal de la aplicación
    function openAppModal(app) {
        modalAppTitle.textContent = app.name;
        modalAppDescription.textContent = app.description;
        modalAppCategory.textContent = app.category.charAt(0).toUpperCase() + app.category.slice(1).replace('_', ' ');
        modalAppVersion.textContent = app.version;
        modalDownloadButton.onclick = () => alert(`Simulando descarga de "${app.name}"...`);

        modalAppScreenshotContainer.innerHTML = '';
        if (app.screenshots && app.screenshots.length > 0) {
            app.screenshots.forEach(screenshotUrl => {
                const img = document.createElement('img');
                img.src = screenshotUrl;
                img.alt = `Captura de ${app.name}`;
                modalAppScreenshotContainer.appendChild(img);
            });
        } else {
            modalAppScreenshotContainer.innerHTML = '<p>No hay capturas disponibles.</p>';
        }

        appModal.style.display = 'flex';
    }

    // Eventos
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            filterByCategory(item.dataset.category);
        });
    });

    searchButton.addEventListener('click', searchApps);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchApps();
        }
    });

    closeModalButton.addEventListener('click', () => {
        appModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === appModal) {
            appModal.style.display = 'none';
        }
    });

    // Cargar todas las aplicaciones al inicio
    renderApps(applications);
});