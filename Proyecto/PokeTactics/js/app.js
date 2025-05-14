async function buscarAleatorio() {
    try {
        // Mostrar mensaje de carga temporal
        document.getElementById('nombrePokemon').textContent = 'Nombre: Cargando...';
        document.getElementById('numeroPokedex').textContent = 'N. Pokédex: Cargando...';
        document.getElementById('naturalezaPokemon').textContent = 'Naturaleza: Cargando...';
        document.getElementById('imgPokemon').src = '';

        // Obtener lista de Pokémon
        const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1010');
        const datos = await respuesta.json();
        const lista = datos.results;

        let pokemon = null;
        let intento = 0, maxIntentos = 10;

        while (!pokemon && intento < maxIntentos) {
            const aleatorio = lista[Math.floor(Math.random() * lista.length)];
            const respuestaPokemon = await fetch(aleatorio.url);
            const datosPokemon = await respuestaPokemon.json();

            if (datosPokemon.sprites.front_default) {
                pokemon = datosPokemon;
            }

            intento++;
        }

        if (!pokemon) throw new Error('No se pudo encontrar un Pokémon con imagen.');

        // Obtener naturaleza aleatoria
        const respNaturalezas = await fetch('https://pokeapi.co/api/v2/nature?limit=25');
        const dataNaturalezas = await respNaturalezas.json();
        const listaNaturalezas = dataNaturalezas.results;

        const naturalezaURL = listaNaturalezas[Math.floor(Math.random() * listaNaturalezas.length)].url;
        const respNaturaleza = await fetch(naturalezaURL);
        const naturalezaData = await respNaturaleza.json();
        const nombreNaturalezaES = naturalezaData.names.find(n => n.language.name === "es")?.name || naturalezaData.name;

        // Mostrar datos en el HTML
        document.getElementById('nombrePokemon').textContent = `Nombre: ${pokemon.name.toUpperCase()}`;
        document.getElementById('numeroPokedex').textContent = `N. Pokédex: #${pokemon.id}`;
        document.getElementById('naturalezaPokemon').textContent = `Naturaleza: ${nombreNaturalezaES}`;
        document.getElementById('imgPokemon').src = pokemon.sprites.front_default;

        // Obtener movimientos del Pokémon
        const movimientos = pokemon.moves.map(m => m.move.name);

        // Mezclar y seleccionar 4 movimientos aleatorios
        const movimientosAleatorios = movimientos
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        // Llenar los select con los movimientos
        for (let i = 0; i < 4; i++) {
            const select = document.getElementById(`movimientos${i + 1}`);
            select.innerHTML = ''; // Limpiar opciones anteriores

            if (movimientosAleatorios[i]) {
                const opcion = document.createElement('option');
                opcion.value = movimientosAleatorios[i];
                opcion.textContent = formatearMovimiento(movimientosAleatorios[i]);
                select.appendChild(opcion);
            } else {
                const opcion = document.createElement('option');
                opcion.textContent = 'Ninguno';
                select.appendChild(opcion);
            }
        }

    } catch (error) {
        console.error('Error al buscar Pokémon:', error);
        document.getElementById('nombrePokemon').textContent = 'Error al cargar Pokémon.';
        document.getElementById('numeroPokedex').textContent = '';
        document.getElementById('naturalezaPokemon').textContent = '';
        document.getElementById('imgPokemon').src = '';

        for (let i = 1; i <= 4; i++) {
            const select = document.getElementById(`movimientos${i}`);
            select.innerHTML = '<option>Error</option>';
        }
    }
}

// Función auxiliar para formatear nombres de movimientos
function formatearMovimiento(nombre) {
    return nombre
        .replace(/-/g, ' ')
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
}
