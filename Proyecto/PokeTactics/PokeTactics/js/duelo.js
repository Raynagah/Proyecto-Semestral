async function cargarDatosJugador() {
    try {
        const respuesta = await fetch('http://localhost/PokeTactics/obtener_pokemon.php?rol=jugador');
        const datos = await respuesta.json();

        const { nombre, numero_pokedex, tipo, movimientos } = datos;

        document.getElementById('nombreJugador').textContent = `Nombre: ${nombre}`;
        document.getElementById('tipoJugador').textContent = `Tipo: ${tipo}`;
        
        // Obtener sprite desde PokéAPI
        const resPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${numero_pokedex}`);
        const infoPokemon = await resPokemon.json();
        const sprite = infoPokemon.sprites.front_default;

        document.getElementById('spriteJugador').src = sprite;

        // Mostrar movimientos
        movimientos.forEach((mov, i) => {
            const boton = document.getElementById(`btnMovimiento${i + 1}`);
            if (boton) {
                boton.textContent = mov;
            }
        });

    } catch (error) {
        console.error("Error cargando datos del jugador:", error);
    }
}

//Pendiente de realizar