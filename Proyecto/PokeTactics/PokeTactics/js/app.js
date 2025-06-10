document.addEventListener("DOMContentLoaded", () => {
    for (let i = 1; i <= 4; i++) {
        const select = document.getElementById(`movimientos${i}`);
        select.addEventListener("change", async () => {
            const movimientoNombre = select.value;
            const tipo = await obtenerTipoMovimientoPorNombre(movimientoNombre);
            actualizarLogoPorTipo(tipo, `logotipo${i}`);
        });
    }
});

async function buscarAleatorio() {
    try {
        document.getElementById('nombrePokemon').textContent = 'Nombre: Cargando...';
        document.getElementById('numeroPokedex').textContent = 'N. Pokédex: Cargando...';
        document.getElementById('tipoPokemon').textContent = 'Tipo: Cargando...';
        document.getElementById('imgPokemon').src = '';

        const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1010');
        const datos = await respuesta.json();
        const lista = datos.results;

        let pokemon = null;
        let intento = 0;

        while (!pokemon && intento < 10) {
            const aleatorio = lista[Math.floor(Math.random() * lista.length)];
            const respuestaPokemon = await fetch(aleatorio.url);
            const datosPokemon = await respuestaPokemon.json();

            if (datosPokemon.sprites.front_default) {
                pokemon = datosPokemon;
            }

            intento++;
        }

        if (!pokemon) throw new Error('No se pudo encontrar un Pokémon con imagen.');

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

        actualizarLogoPorTipo(tipoES, 'logoTipoPokemon');

        // Obtener todos los movimientos del Pokémon
        const movimientos = pokemon.moves;

        // Limpiar todos los selects de movimientos
        for (let i = 1; i <= 4; i++) {
            const select = document.getElementById(`movimientos${i}`);
            select.innerHTML = '';
            
            const opcionVacia = document.createElement('option');
            opcionVacia.value = '';
            opcionVacia.textContent = 'Movimiento ' + i;
            select.appendChild(opcionVacia);
        }

        // Crear un array para almacenar los datos de los movimientos
        const movimientosData = [];

        // Recolectar información de los movimientos
        for (const movimiento of movimientos) {
            const movimientoDetalle = await fetch(movimiento.move.url).then(res => res.json());
            
            const nombreEN = movimientoDetalle.name;
            const nombreES = movimientoDetalle.names.find(n => n.language.name === 'es')?.name || nombreEN;
            const tipoMovimiento = movimientoDetalle.type.name;

            movimientosData.push({
                nombreEN,
                nombreES,
                tipoMovimiento
            });
        }

        // Llenar cada select con todos los movimientos disponibles
        for (const movimiento of movimientosData) {
            for (let i = 1; i <= 4; i++) {
                const select = document.getElementById(`movimientos${i}`);
                const opcion = document.createElement('option');
                opcion.value = movimiento.nombreEN; // Valor interno en inglés
                opcion.textContent = formatearMovimiento(movimiento.nombreES); // Mostrar en español
                opcion.dataset.tipo = movimiento.tipoMovimiento; // Almacenar tipo
                select.appendChild(opcion);
            }
        }

        // Actualizar event listeners para los selects
        for (let i = 1; i <= 4; i++) {
            const select = document.getElementById(`movimientos${i}`);
            select.replaceWith(select.cloneNode(true));
            
            document.getElementById(`movimientos${i}`).addEventListener('change', async function() {
                const selectedOption = this.options[this.selectedIndex];
                if (selectedOption.value) {
                    const tipoEN = selectedOption.dataset.tipo;
                    const tipoES = await obtenerNombreTipoEnEspanol(tipoEN);
                    actualizarLogoPorTipo(tipoES, `logotipo${i}`);
                }
            });
        }

        // Actualizar el logo del tipo para el primer movimiento (si existe)
        if (movimientosData.length > 0) {
            const tipoPrimerMovimiento = movimientosData[0].tipoMovimiento;
            const tipoES = await obtenerNombreTipoEnEspanol(tipoPrimerMovimiento);
            
            for (let i = 1; i <= 4; i++) {
                actualizarLogoPorTipo(tipoES, `logotipo${i}`);
            }
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

async function obtenerNombreTipoEnEspanol(tipoEN) {
    const tipoMap = {
        'fire': 'Fuego',
        'water': 'Agua',
        'grass': 'Planta',
        'electric': 'Eléctrico',
        'ice': 'Hielo',
        'fighting': 'Lucha',
        'poison': 'Veneno',
        'ground': 'Tierra',
        'flying': 'Volador',
        'psychic': 'Psíquico',
        'bug': 'Bicho',
        'rock': 'Roca',
        'ghost': 'Fantasma',
        'dragon': 'Dragón',
        'dark': 'Siniestro',
        'steel': 'Acero',
        'fairy': 'Hada',
        'normal': 'Normal',
        // Compatibilidad con versiones en español
        'Fuego': 'Fuego',
        'Agua': 'Agua',
        'Planta': 'Planta',
        'Eléctrico': 'Eléctrico',
        'Hielo': 'Hielo',
        'Lucha': 'Lucha',
        'Veneno': 'Veneno',
        'Tierra': 'Tierra',
        'Volador': 'Volador',
        'Psíquico': 'Psíquico',
        'Bicho': 'Bicho',
        'Roca': 'Roca',
        'Fantasma': 'Fantasma',
        'Dragón': 'Dragón',
        'Siniestro': 'Siniestro',
        'Acero': 'Acero',
        'Hada': 'Hada',
        'Normal': 'Normal'
    };

    return tipoMap[tipoEN] || tipoEN;
}

function actualizarLogoPorTipo(tipo, idLogo) {
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
        'Normal': 'img/tipoPokemon/Normal.webp'
    };

    const logoPath = tipoLogo[tipo] || null;
    const target = document.getElementById(idLogo);

    if (logoPath && target) {
        target.style.backgroundImage = `url('${logoPath}')`;
        target.style.backgroundSize = 'cover';
        target.style.backgroundColor = 'transparent';
    } else if (target) {
        target.style.backgroundImage = '';
        target.style.backgroundColor = '#ccc';
    }
}

function formatearMovimiento(nombre) {
    return nombre
        .replace(/-/g, ' ')
        .split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
}

async function obtenerTipoMovimientoPorNombre(nombreMovimiento) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/move/${nombreMovimiento.toLowerCase()}`);
        const detalle = await response.json();
        const tipoUrl = detalle.type.url;
        const tipoData = await fetch(tipoUrl).then(res => res.json());
        const tipoES = tipoData.names.find(n => n.language.name === 'es')?.name || detalle.type.name;

        return tipoES;
    } catch (e) {
        console.error('Error obteniendo tipo de movimiento:', e);
        return 'Normal';
    }
}

function guardarPokemonSeleccionado(pokemon, rol) {
    fetch('http://localhost/PokeTactics/guardar_pokemon.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: pokemon.nombre,
            numero: pokemon.numero,
            tipo: pokemon.tipo,
            movimientos: pokemon.movimientos,
            rol: rol
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.mensaje) {
            alert(data.mensaje);
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
    });
}

document.querySelector(".botonSPokemon").addEventListener("click", function () {
    const pokemon = {
        nombre: document.getElementById("nombrePokemon").textContent.replace("Nombre: ", ""),
        numero: parseInt(document.getElementById("numeroPokedex").textContent.replace("N. Pokédex: ", "")),
        tipo: document.getElementById("tipoPokemon").textContent.replace("Naturaleza: ", ""),
        movimientos: [
            document.getElementById("movimientos1").value,
            document.getElementById("movimientos2").value,
            document.getElementById("movimientos3").value,
            document.getElementById("movimientos4").value
        ]
    };

    const rol = document.title.includes("Jugador") ? "jugador" : "rival";

    guardarPokemonSeleccionado(pokemon, rol);
});