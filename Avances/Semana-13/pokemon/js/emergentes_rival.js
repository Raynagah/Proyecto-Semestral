document.addEventListener("DOMContentLoaded", () => {
    const modal_rival = document.getElementById("modalImagen_rival");
    const btnAbrir_rival = document.getElementById("botonAbrirModal_rival");
    const spanCerrar_rival = document.querySelector(".cerrar_rival");

    modal_rival.style.display = "none";

    btnAbrir_rival.addEventListener("click", (e) => {
        e.preventDefault(); // Previene cualquier acción por defecto
        e.stopPropagation(); // Evita la propagación del evento
        modal_rival.style.display = "block";
    });

    spanCerrar_rival.addEventListener("click", () => {
        modal_rival.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal_rival) {
            modal_rival.style.display = "none";
        }
    });
});