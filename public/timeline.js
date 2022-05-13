const { setup } = require("jsdom/lib/jsdom/living/generated/Element");

const urldb = "http://localhost:3000";

function loadEventsToMainDiv() {
    $.ajax({
        url: urldb + "timeline/getAllEvents",
        type: "GET",
        success:(r) => {
            console.log(r)
            for( i = 0; i < r.length; i++) {
                $("#events").append(`
                <div class="event"> Event Text - ${r[i].text} 

                <span class="time"> Event Time - ${r[i].time} </span>

                <span class="hits"> Event Hits - ${r[i].hits} </span>
                <button class="deleteButton" onclick = deleteEvent("${id}") </button>
                <button class="likeButtons" id="${r[i]["_id"]}"> Like! </button>
                </div>
                `)
            }
        }
    })
}

function deleteEvent() {
    $.ajax({
        url: urldb + `/timeline/delete/:id`,
        type: "GET",
        success:  () => {
            loadEvent();
        }
    })
}

function increaseHits() {
    x = this.id
    $.ajax({
        url: urldb + "timeline/increaseHits/${x}",
        type: "GET",
        success: function (x){
            console.log(x)
        }
    })
}

function setup(){
    loadEventsToMainDiv()

    $("body").on("click", ".likeButtons", inscreaseHits)
}

$(document).ready(setup)