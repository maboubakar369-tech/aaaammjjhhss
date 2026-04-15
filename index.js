const express = require('express');
let pokemons = require('./db-pokemons');
let helper = require('./helper');

const app = express();
const PORT = process.env.PORT || 3003;

app.get('/', (req, res) => {
    // On prépare le début de la page avec le CSS pour le fond
    let html = `
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                /* LE FOND : Dégradé bleu et motif discret */
                background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), 
                            url('https://www.transparenttextures.com/patterns/white-diamond.png'),
                            linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                background-attachment: fixed;
                margin: 0;
                padding: 40px 20px; 
                text-align: center; 
                color: white;
            }

            .search-container { 
                margin-bottom: 40px; 
                background: rgba(255, 255, 255, 0.2);
                padding: 20px;
                border-radius: 15px;
                display: inline-block;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                border: 1px solid rgba(255,255,255,0.3);
            }

            input { 
                padding: 12px 20px; 
                width: 300px; 
                border-radius: 25px; 
                border: none; 
                font-size: 16px; 
                outline: none;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            }

            .gallery { 
                display: flex; 
                flex-wrap: wrap; 
                gap: 25px; 
                justify-content: center; 
            }

            .card { 
                background: white; 
                border-radius: 20px; 
                padding: 20px; 
                text-align: center; 
                box-shadow: 0 10px 20px rgba(0,0,0,0.2); 
                width: 170px; 
                transition: transform 0.3s ease;
                color: #333;
            }

            .card:hover { transform: translateY(-10px); }

            img { width: 120px; height: 120px; filter: drop-shadow(0 5px 5px rgba(0,0,0,0.1)); }

            h3 { margin: 15px 0 5px 0; font-size: 1.4em; text-transform: capitalize; }

            .hp-container { margin: 10px 0; font-weight: bold; font-size: 0.9em; }

            .hp-bar-bg { 
                background: #eee; 
                border-radius: 10px; 
                height: 10px; 
                width: 100%; 
                margin-top: 5px; 
                overflow: hidden; 
                border: 1px solid #ddd;
            }

            .hp-bar-fill { 
                background: linear-gradient(to right, #2ecc71, #27ae60); 
                height: 100%; 
                border-radius: 10px; 
                transition: width 0.5s ease-in-out;
            }
        </style>

        <h1 style="font-size: 3em; margin-bottom: 10px;">YBoosST POKÉDEX</h1>
        <p style="margin-bottom: 30px; opacity: 0.9;">Attrapez-les tous depuis votre navigateur !</p>

        <div class="search-container">
            <input type="text" id="searchInput" placeholder="Rechercher un Pokémon..." onkeyup="filterPokemons()">
        </div>

        <div class="gallery" id="pokemonGallery">
    `;

  // Dans ta boucle pokemons.forEach
    pokemons.forEach(pokemon => {
        const hpPercent = (pokemon.hp / 100) * 100;
        html += `
            <div class="card pokemon-card" id="pokemon-${pokemon.id}" data-name="${pokemon.name.toLowerCase()}">
                <img src="${pokemon.picture}" alt="${pokemon.name}">
                <h3 id="name-${pokemon.id}">${pokemon.name}</h3>
                
                <div class="hp-container">
                    <span>HP: ${pokemon.hp}</span>
                    <div class="hp-bar-bg">
                        <div class="hp-bar-fill" style="width: ${hpPercent}%;"></div>
                    </div>
                </div>

                <button onclick="editPokemon(${pokemon.id})" style="background: #3498db; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                    Modifier
                </button>

                <div style="color: #999; font-size: 0.8em; margin-top: 10px;">#0${pokemon.id}</div>
            </div>
        `;
    });

    // Dans ton bloc <script> en bas du fichier
    html += `
        </div>
        <script>
            // Fonction pour la recherche
            function filterPokemons() {
                const input = document.getElementById('searchInput');
                const filter = input.value.toLowerCase();
                const cards = document.getElementsByClassName('pokemon-card');
                for (let i = 0; i < cards.length; i++) {
                    const name = cards[i].getAttribute('data-name');
                    cards[i].style.display = name.includes(filter) ? "" : "none";
                }
            }

            // NOUVELLE FONCTION POUR MODIFIER
            function editPokemon(id) {
                const currentName = document.getElementById('name-' + id).innerText;
                const newName = prompt("Modifier le nom du Pokémon :", currentName);
                
                if (newName != null && newName != "") {
                    // On change le nom sur l'écran tout de suite
                    document.getElementById('name-' + id).innerText = newName;
                    
                    // On met à jour l'attribut de recherche pour que ça continue de marcher
                    document.getElementById('pokemon-' + id).setAttribute('data-name', newName.toLowerCase());
                    
                    alert("Nom modifié avec succès !");
                }
            }
        </script>
    `;

    res.send(html);
});

// Les autres routes restent les mêmes...
app.get('/api/pokemons', (req, res) => {
    res.json(helper.success(`List of ${pokemons.length} pokemons`, pokemons));
});

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemons.find(p => p.id === id);
    if (!pokemon) return res.status(404).json({ message: "Non trouvé" });
    res.json(helper.success("Trouvé !", pokemon));
});

app.listen(PORT, () => console.log(`Démarré sur http://localhost:${PORT}`));