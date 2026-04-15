const express = require('express');
let pokemons = require('./db-pokemons');
let helper = require('./helper');

const app = express();
const PORT = process.env.PORT || 3003;

app.get('/', (req, res) => {
    
    let html = `
        <style>
            body { font-family: sans-serif; display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; background: #f0f0f0; padding: 20px; }
            .card { background: white; border-radius: 10px; padding: 10px; text-align: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 150px; }
            img { width: 100px; height: 100px; }
            h3 { color: #333; margin: 10px 0 5px 0; }
            span { font-size: 0.8em; color: #777; }
        </style>
        <h1 style="width: 100%; text-align: center;">YBoosST POKÉDEX</h1>
    `;

    pokemons.forEach(pokemon => {
        html += `
            <div class="card">
                <img src="${pokemon.picture}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
                <span>ID: ${pokemon.id} - HP: ${pokemon.hp}</span>
            </div>
        `;
    });

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