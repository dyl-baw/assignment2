function loadEventsToMainDiv() {
    $('#events').empty();
    $.ajax({
        url: "https://arcane-fjord-59410.herokuapp.com/getAllEvents",
        type: "GET",
        success: (r) => {
            for (i = 0; i < r.length; i++) {
                let id = r[i]["_id"];
                $('#events').append(`
                <div class="event"> 
                <span class="time"> Event Time - ${r[i].time} </span>
                <span class="hits"> Event Hits - ${r[i].hits} </span>
                <span>Event Text - ${r[i].text} </span>
                <button class="deletebutton" onclick=deleteEvent('${id}')> Delete </button>
                <button class="likeButtons" onclick=increaseHits('${id}')> Like! </button>
                </div>
                `)
            }
        }
    })
}

var date = new Date();

function clearEvents() {
    $.ajax({
        url: `/timeline/removeAll`,
        type: "GET",
        success: () => {
            loadEventsToMainDiv();
        }
    })
}

function checkProfile(pokemonName) {
    $.ajax({
        url: `/timeline/insert`,
        type: "POST",
        data: {
            text: `${pokemonName} viewed`,
            time: date.toLocaleTimeString(),
            hits: 1
        },
        success: (data) => {
            loadEventsToMainDiv();
        }
    })
}

function deleteEvent(id) {
    $.ajax({
        url: `/timeline/delete/${id}`,
        type: "GET",
        success: () => {
            loadEventsToMainDiv();
        }
    })
}

function increaseHits(id) {
    $.ajax({
        url: `/timeline/inscreaseHits/${id}`,
        type: "GET",
        success: () => {
            loadEventsToMainDiv();
        }
    })
}

function setup() {
    loadEventsToMainDiv();
}

$(document).ready(setup)