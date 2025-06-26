async function buscarAleatorio() {
    try {
        // Mostrar mensaje de carga temporal
        document.getElementById('nombrePokemon').textContent = 'Nombre: Cargando...';
        document.getElementById('numeroPokedex').textContent = 'N. Pokédex: Cargando...';
        document.getElementById('tipoPokemon').textContent = 'Tipo: Cargando...';
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

        // Obtener nombre en español
        const especie = await fetch(pokemon.species.url);
        const datosEspecie = await especie.json();
        const nombreES = datosEspecie.names.find(n => n.language.name === 'es').name;

        // Obtener tipo en español
        const tipoUrl = pokemon.types[0].type.url;
        const tipoResp = await fetch(tipoUrl);
        const tipoDatos = await tipoResp.json();
        const tipoES = tipoDatos.names.find(n => n.language.name === 'es').name;

        // Mostrar datos en el HTML
        document.getElementById('nombrePokemon').textContent = `Nombre: ${nombreES}`;
        document.getElementById('numeroPokedex').textContent = `N. Pokédex: #${pokemon.id}`;
        document.getElementById('tipoPokemon').textContent = `Tipo: ${tipoES}`;
        document.getElementById('imgPokemon').src = pokemon.sprites.front_default;

        // Actualizar el logo del tipo de movimiento
        actualizarLogoPorTipo(tipoES);

        // Obtener movimientos en español
        const movimientos = pokemon.moves.map(m => m.move.url);
        const movimientosDetalles = await Promise.all(movimientos.map(url => fetch(url).then(res => res.json())));
        const movimientosES = movimientosDetalles.map(m => {
            const nombre = m.names.find(n => n.language.name === 'es');
            return nombre ? nombre.name : m.name;
        });

        // Ordenar alfabéticamente
        movimientosES.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

        // Llenar cada <select> con todos los movimientos disponibles
        for (let i = 0; i < 4; i++) {
            const select = document.getElementById(`movimientos${i + 1}`);
            select.innerHTML = ''; // Limpiar opciones anteriores

            movimientosES.forEach(nombreMovimiento => {
                const opcion = document.createElement('option');
                opcion.value = nombreMovimiento;
                opcion.textContent = formatearMovimiento(nombreMovimiento);
                select.appendChild(opcion);
            });
        }

    } catch (error) {
        console.error('Error al buscar Pokémon:', error);
        document.getElementById('nombrePokemon').textContent = 'Error al cargar Pokémon.';
        document.getElementById('numeroPokedex').textContent = '';
        document.getElementById('tipoPokemon').textContent = '';
        document.getElementById('imgPokemon').src = '';

        for (let i = 1; i <= 4; i++) {
            const select = document.getElementById(`movimientos${i}`);
            select.innerHTML = '<option>Error</option>';
        }
    }
}

// Función auxiliar para actualizar el logo según el tipo de movimiento
function actualizarLogoPorTipo(tipo) {
    const tipoLogo = {
        'Fuego': 'img/tipoPokemon/Fuego.webp',
        'Agua': 'img/tipoPokemon/Agua.webp',
        'Planta': 'img/tipoPokemon/Planta.webp',
        'Eléctrico': 'img/tipoPokemon/Eléctrico.webp',
        'Hielo': 'img/tipoPokemon/Hielo.webp',
        'Lucha': 'img/tipoPokemon/Lucha.webp',
        'Veneno': 'img/tipoPokemon/Veneno.webp',
        'Tierra': 'img/tipoPokemon/Tierra.webp',
        'Volador': 'img/tipoPokemon/Volador.webp',
        'Psíquico': 'img/tipoPokemon/Psíquico.webp',
        'Bicho': 'img/tipoPokemon/Bicho.webp',
        'Roca': 'img/tipoPokemon/Roca.webp',
        'Fantasma': 'img/tipoPokemon/Fantasma.webp',
        'Dragón': 'img/tipoPokemon/Dragón.webp',
        'Siniestro': 'img/tipoPokemon/Siniestro.webp',
        'Acero': 'img/tipoPokemon/Acero.webp',
        'Hada': 'img/tipoPokemon/Hada.webp',
    };

    const logoPath = tipoLogo[tipo];
    if (logoPath) {
        document.querySelector('.cuadro-color').style.backgroundImage = `url('${logoPath}')`;
    } else {
        document.querySelector('.cuadro-color').style.backgroundColor = '#ccc'; // Default if no type found
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


//Funcion para buscar pokemon por nombre o numero de pokedex
async function buscarPorNombreONumero() {
    const input = document.getElementById('inputBusqueda').value.trim().toLowerCase();
    if (!input) return;

    try {
        document.getElementById('nombrePokemon').textContent = 'Nombre: Cargando...';
        document.getElementById('numeroPokedex').textContent = 'N. Pokédex: Cargando...';
        document.getElementById('tipoPokemon').textContent = 'Tipo: Cargando...';
        document.getElementById('imgPokemon').src = '';

        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
        if (!respuesta.ok) throw new Error('Pokémon no encontrado');

        const pokemon = await respuesta.json();

        const especie = await fetch(pokemon.species.url);
        const datosEspecie = await especie.json();
        const nombreES = datosEspecie.names.find(n => n.language.name === 'es')?.name || pokemon.name;

        const tipoUrl = pokemon.types[0].type.url;
        const tipoResp = await fetch(tipoUrl);
        const tipoDatos = await tipoResp.json();
        const tipoES = tipoDatos.names.find(n => n.language.name === 'es')?.name || pokemon.types[0].type.name;

        document.getElementById('nombrePokemon').textContent = `Nombre: ${nombreES}`;
        document.getElementById('numeroPokedex').textContent = `N. Pokédex: #${pokemon.id}`;
        document.getElementById('tipoPokemon').textContent = `Tipo: ${tipoES}`;
        document.getElementById('imgPokemon').src = pokemon.sprites.front_default;

        actualizarLogoPorTipo(tipoES);

        const movimientos = pokemon.moves.map(m => m.move.url);
        const movimientosDetalles = await Promise.all(movimientos.map(url => fetch(url).then(res => res.json())));
        const movimientosES = movimientosDetalles.map(m => {
            const nombre = m.names.find(n => n.language.name === 'es');
            return nombre ? nombre.name : m.name;
        }).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

        for (let i = 0; i < 4; i++) {
            const select = document.getElementById(`movimientos${i + 1}`);
            select.innerHTML = '';
            movimientosES.forEach(nombreMovimiento => {
                const opcion = document.createElement('option');
                opcion.value = nombreMovimiento;
                opcion.textContent = formatearMovimiento(nombreMovimiento);
                select.appendChild(opcion);
            });
        }

    } catch (error) {
        console.error('Error en la búsqueda:', error);
        document.getElementById('nombrePokemon').textContent = 'No se encontró el Pokémon.';
        document.getElementById('numeroPokedex').textContent = '';
        document.getElementById('tipoPokemon').textContent = '';
        document.getElementById('imgPokemon').src = '';
        for (let i = 1; i <= 4; i++) {
            const select = document.getElementById(`movimientos${i}`);
            select.innerHTML = '<option>Error</option>';
        }
    }
}

