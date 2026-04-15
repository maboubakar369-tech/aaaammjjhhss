const express = require('express');
let pokemons = require('./db-pokemons');
let helper = require('./helper');

const app = express();
const PORT = process.env.PORT || 3003;
app.get('/', (req, res) => {
    let html = `
        <style>
            body { font-family: sans-serif; background: #f0f0f0; padding: 20px; text-align: center; }
            .search-container { margin-bottom: 30px; }
            input { padding: 12px; width: 300px; border-radius: 8px; border: 2px solid #ddd; font-size: 16px; outline: none; }
            input:focus { border-color: #ef5350; }
            .gallery { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
            .card { background: white; border-radius: 12px; padding: 15px; text-align: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 160px; }
            img { width: 110px; height: 110px; }
            h3 { color: #333; margin: 10px 0 5px 0; }
            .hp-bar-bg { background: #eee; border-radius: 10px; height: 8px; width: 100%; margin-top: 5px; }
            .hp-bar-fill { background: #2ecc71; height: 100%; border-radius: 10px; }
        </style>

        <h1>YBoosST POKÉDEX LIVE</h1>

        <div class="search-container">
            <input type="text" id="searchInput" placeholder="Tapez pour filtrer..." onkeyup="filterPokemons()">
        </div>

        <div class="gallery" id="pokemonGallery">
    `;

    pokemons.forEach(pokemon => {
        const hpPercent = (pokemon.hp / 100) * 100;
        // On ajoute la classe "pokemon-card" et on stocke le nom dans un attribut data-name
        html += `
            <div class="card pokemon-card" data-name="${pokemon.name.toLowerCase()}">
                <img src="${pokemon.picture}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
                <div style="margin-bottom: 10px;">
                    <small>PV: ${pokemon.hp}</small>
                    <div class="hp-bar-bg">
                        <div class="hp-bar-fill" style="width: ${hpPercent}%;"></div>
                    </div>
                </div>
                <span style="color: #999; font-size: 0.8em;">ID: ${pokemon.id}</span>
            </div>
        `;
    });

    // (L'intelligence de la recherche live)
    html += `
        </div>
        <script>
            function filterPokemons() {
                const input = document.getElementById('searchInput');
                const filter = input.value.toLowerCase();
                const cards = document.getElementsByClassName('pokemon-card');

                for (let i = 0; i < cards.length; i++) {
                    const pokemonName = cards[i].getAttribute('data-name');
                    if (pokemonName.includes(filter)) {
                        cards[i].style.display = ""; // On affiche
                    } else {
                        cards[i].style.display = "none"; // On cache
                    }
                }
            }
        </script>
    `;

    res.send(html);
});

app.get('/api/pokemons', (req, res) => {
    const message = `List of ${pokemons.length} * pokemons`;
    res.json( helper.success(message, pokemons) );    
});

// CORRECTION : J'ai gardé une seule version propre de la route par ID
app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemons.find(p => p.id === id);
    
    if (!pokemon) {
        return res.status(404).json({ message: "Ce Pokémon n'existe pas !" });
    }

    const message = "Un Pokémon a bien été trouvé !";
    res.json(helper.success(message, pokemon));
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});