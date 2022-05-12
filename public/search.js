type_g = "";
storage = "";


function processPokemonResp2(data) {
    $("main").append(`
    <div class="card">
    <a href="/profile/${data.id}">
    <img src="${data.sprites.other["official-artwork"].front_default}"></a>
    ${data.name}</div>`)
}

function processPokemonResp(data) {
    for (i = 0; i < data.pokemon.length; i++)
        $.ajax({
            type: "get",
            url: data.pokemon[i].pokemon.url,
            success: processPokemonResp2
        })
}

function processPokeRegion(data) {
    storage = data.results;
    for (i = 0; i < data.results.length; i++) {
        $("main").append(`
        <div class="card">
        <a href = "/profile/${getID(data.results[i].url)}">
        <div>${data.results[i].name}</div>
        <img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getID(data.results[i].url)}.png"> </a>
        </div>
        `)

    }
}

function searchPokemon() {
    searchInput = $("#pokemonName").val().toLowerCase()
    console.log(searchOnePokemon);
    $.ajax({
        type:"GET",
        url:`https://pokeapi.co/api/v2/pokemon/${searchInput}`,
        success: searchOnePokemon
    })
    $("main").empty()
}

function searchOnePokemon(data) {
    $("main").append(`
        <div class="card">
            <div> ${data.id}</div>
            <img src="${data.sprites.other["official-artwork"].front_default}">
        </div>
    `)
    getHistory(data);
}

function getHistory(data) {
    $('#history').append(`
            <div>
                <a href="../profile/${data.id}">${data.name}</a>
            </div>
            `)
}

function getID(url) {
    return url.split(`pokemon/`)[1].split(`/`)[0]
}

function display(type_) {
    // how to grab "type" of pokemon
    $("main").empty()
    type_g = type_
    $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/type/${type_}`,
        success: processPokemonResp
    })
}

function displayRegion(start, end) {
    $("main").empty()
    $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/pokemon/?limit=${end}&offset=${start}`,
        success: processPokeRegion
    })
}

function nextPage(){

}

function previousPage(){

}


function setup() {
    // display grass pokemon
    display($("#pokemon_type option:selected").val())
    $("#pokemon_type").change(() => {
        pokemon_type = $("#pokemon_type option:selected").val();
    display($("#pokemon_type option:selected").val())
    })

    $("#region").change(() => {
        pokeregion = $("#region option:selected").val();
        switch (pokeregion) {
            case 'kanto':
                displayRegion(0, 151)
                break;
            case 'johto':
                displayRegion(151, 251)
                break
            case 'hoenn':
                displayRegion(251, 386)
                break
            case 'sinnoh':
                displayRegion(386, 494)
                break
            case 'unova':
                displayRegion(494, 649)
                break
            case 'kalos':
                displayRegion(649, 721)
                break
            case 'alola':
                displayRegion(721, 809)
                break
            case 'galar':
                displayRegion(810, 898)
                break
            default:
                console.log('This shouldnt happen')
                break
        }
    })

    $("#searchPokemon").click(() => {
        searchPokemon();
    })
}

$(document).ready(setup)