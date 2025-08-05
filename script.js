document.addEventListener("DOMContentLoaded", updateFavoritesList);

let pokemonActual = null;

function searchPokemon() {
  const input = document.getElementById("pokemonInput").value.toLowerCase().trim();
  if (!input) return;

  const url = `https://pokeapi.co/api/v2/pokemon/${input}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Pokémon no encontrado");
      return response.json();
    })
    .then(data => {
      pokemonActual = {
        nombre: data.name,
        imagen: data.sprites.front_default
      };
      mostrarPokemon(data);
    })
    .catch(error => {
      document.getElementById("resultado").innerHTML = `<p>${error.message}</p>`;
      pokemonActual = null;
    });
}

function mostrarPokemon(pokemon) {
  const contenedor = document.getElementById("resultado");
  contenedor.innerHTML = `
    <h2>${pokemon.name.toUpperCase()}</h2>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <p><strong>ID:</strong> ${pokemon.id}</p>
    <button onclick="saveFavorite()">⭐ Guardar como favorito</button>
  `;
}

function saveFavorite() {
  if (!pokemonActual) return;

  let favoritos = JSON.parse(localStorage.getItem("pokemonFavoritos")) || [];

  if (!favoritos.some(p => p.nombre === pokemonActual.nombre)) {
    favoritos.push(pokemonActual);
    localStorage.setItem("pokemonFavoritos", JSON.stringify(favoritos));
    updateFavoritesList();
  }
}

function updateFavoritesList() {
  const favoritos = JSON.parse(localStorage.getItem("pokemonFavoritos")) || [];
  const contenedor = document.getElementById("favoritos");

  contenedor.innerHTML = "";

  favoritos.forEach((pokemon, index) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <img src="${pokemon.imagen}" alt="${pokemon.nombre}" width="80">
      <p>${pokemon.nombre}</p>
      <button onclick="eliminarFavorito('${pokemon.nombre}')">❌ Eliminar</button>
    `;
    card.style.textAlign = "center";
    card.style.border = "1px solid #ccc";
    card.style.borderRadius = "8px";
    card.style.padding = "8px";
    card.style.width = "100px";
    contenedor.appendChild(card);
  });
}

function eliminarFavorito(nombre) {
  let favoritos = JSON.parse(localStorage.getItem("pokemonFavoritos")) || [];
  favoritos = favoritos.filter(p => p.nombre !== nombre);
  localStorage.setItem("pokemonFavoritos", JSON.stringify(favoritos));
  updateFavoritesList();
}