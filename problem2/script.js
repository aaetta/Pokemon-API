const pokemonInput = document.getElementById("pokemonInput");
const addBtn = document.getElementById("addBtn");
const teamContainer = document.getElementById("teamContainer");
const clearBtn = document.getElementById("clearBtn");
const errorMessage = document.getElementById("errorMessage");

let team = [];

async function fetchPokemon(name) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Pokémon not found!");

        const data = await response.json();
        return {
            name: data.name,
            sprite: data.sprites.front_default,
            types: data.types.map(typeInfo => typeInfo.type.name)
        };
    } catch (error) {
        showError(error.message);
        return null;
    }
}

function showError(message) {
    errorMessage.textContent = message;
    setTimeout(() => {
        errorMessage.textContent = "";
    }, 3000);
}

function displayTeam() {
    teamContainer.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        if (team[i]) {
            const pokemon = team[i];
            const card = document.createElement("div");
            card.classList.add("pokemon-card");

            card.innerHTML = `
                <img src="${pokemon.sprite}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
                <p>${pokemon.types.map(type => `<span class="pokemon-type type-${type}">${type}</span>`).join(" ")}</p>
                <button class="remove-btn" data-index="${i}">Remove</button>
            `;

            teamContainer.appendChild(card);
        } else {
            const emptySlot = document.createElement("div");
            emptySlot.classList.add("pokemon-card");
            emptySlot.innerHTML = `<p>Empty Slot</p>`;
            teamContainer.appendChild(emptySlot);
        }
    }

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = Number(e.target.getAttribute("data-index"));
            team.splice(index, 1);
            displayTeam();
        });
    });
}

addBtn.addEventListener("click", async () => {
    if (team.length >= 6) {
        showError("Your team is full!");
        return;
    }

    const pokemonName = pokemonInput.value.trim();
    if (!pokemonName) {
        showError("Please enter a Pokémon name!");
        return;
    }

    const pokemon = await fetchPokemon(pokemonName);
    if (pokemon) {
        team.push(pokemon);
        displayTeam();
    }
    pokemonInput.value = "";
});

clearBtn.addEventListener("click", () => {
    team = [];
    displayTeam();
});

// Initialize with empty slots
displayTeam();
