document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalImagen");
    const btnAbrir = document.getElementById("botonAbrirModal");
    const spanCerrar = document.querySelector(".cerrar");

    modal.style.display = "none";

    btnAbrir.addEventListener("click", (e) => {
        e.preventDefault(); // Previene cualquier acción por defecto
        e.stopPropagation(); // Evita la propagación del evento
        modal.style.display = "block";
    });

    spanCerrar.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});