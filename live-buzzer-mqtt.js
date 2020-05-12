document.addEventListener('DOMContentLoaded', function(){ 
    // pushThePlayButton();
    setTimeout(test, 2600);  
}, false)

let game_state = {
    total_players: 0,
    player_list: [

    ],
    rowsize: 10,
    colsize: 10
};

let PLAYER_HEIGHT = 1;
async function test() {
    // updateChartWithStrings(['Getting started is 50% of the job done'], 'started');

}


var number = Math.floor(Math.random() * 8888) + 1111;

function beginTheThing() {
    init();
}
function init() {
    //For Aria
    document.getElementById('connection_code').innerHTML = number;
    document.getElementById('connection_code').setAttribute('aria-label', `Connection Code is ${number}`);
    let btn = document.getElementById('init-btn');
    btn.style.display = "none";

    // For VR
    let theScene = document.getElementById('theScene');
    document.getElementById('theScene').style.zIndex = 10;
    document.getElementById('theScene').setAttribute("background", `color: #3E${number}`);
    let connection_code_position = `0 2 -5`;
    let connection_code = document.createElement('a-text');
    
    connection_code.setAttribute("color", '#030303');
    connection_code.setAttribute("position", connection_code_position);
    connection_code.setAttribute("font", 'mozillavr');
    connection_code.setAttribute("scale", '3 3 3');
    connection_code.setAttribute("rotation", `0 0 0`);
    connection_code.setAttribute("value", number);
    theScene.appendChild(connection_code);
    
};

// init();
function perform_vibration(type = 1) {
    try {
        if (type == 0) {
            window.navigator.vibrate(300);
        } else if (type == 1) {
            window.navigator.vibrate([20, 30, 20,30,20]);
        } else if (type == 2) {
            window.navigator.vibrate([20]);
        }
    } catch (error) {
        console.log(error);
    }
   
}

var ID = function () {
    
    return (
        "_" +
        Math.random()
            .toString(36)
            .substr(2, 9)
    );
};
var client = new Paho.Client("wss://api.akriya.co.in:8084/mqtt",
    `clientId-vb-choopad-${ID()}`
);

// var client = new Paho.Client(
//     "api.akriya.co.in",
//     8083,
//     `clientId-91springboard_${ID}`
//   );


// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect });

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe(`vchoopad/${number}/connected`);
    client.subscribe(`vchoopad/${number}/move`);
    let message = new Paho.Message("Hello");
    message.destinationName = `vchoopad/${number}/presence`;
    client.send(message);
    
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    if (message.topic === `vchoopad/${number}/detected`) {
        perform_vibration(0);
    } else if (message.topic === `vchoopad/${number}/connected`){
        // When new Player/Controller sends connecting to board Request
        // show_options();
        show_connected_feedback();
        send_ack_connection(message.payloadString);

        init_player_if_new(message.payloadString);

    } else if (message.topic === `vchoopad/${number}/phrase`) {
        let phrase = message.payloadString;
        phrase = phrase.toLowerCase();
        
        updateChartWithStrings([phrase]);
    } else if (message.topic === `vchoopad/${number}/move`) {
        let move = message.payloadString;
        let move_player = move.split('/')[0];
        let move_val = move.split('/')[1];
        
        updatePlayerWithVal(move_player, move_val);
    }

    console.log(message);
    console.log("onMessageArrived:" + message.payloadString);
}
function show_connected_feedback() {
    document.getElementById('connection_code').style.backgroundColor ='#00FF00';
}
function send_ack_connection (ack_dev_id) {
    let message = new Paho.Message("ack");
    message.destinationName = `vchoopad/${ack_dev_id}/connection_ack`;
    client.send(message);
}

function buzzer_click() {
    let message = new Paho.Message("ack");
    message.destinationName = `vchoopad/${number}/requested`;
    client.send(message);
}

function init_player_if_new(dev_id) {
    if (game_state.player_list[dev_id]) {
        console.log(`player is already added`);
        console.log(game_state.player_list);
    } else {
        
        console.log('New player');
        game_state.player_list[dev_id] = {
            player_dev_id: dev_id,
            player_index: game_state.total_players,
            board_position: -1,
            DOM_id: `player-${game_state.total_players}`
        }
        game_state.total_players++;

    }

    console.log(`Looking for player-${game_state.player_list[dev_id].player_index}`);
    //vitualFeedbackOfConnected:
    document.getElementById(`player-${game_state.player_list[dev_id].player_index}`).setAttribute('scale', '0.3 0.3 0.3');

}

function updatePlayerWithVal(player_id, value) {
    let player = game_state.player_list[player_id];
    let playerEl = document.getElementById(player.DOM_id);
    player.board_position += parseInt(value);
    console.log(`Moving ${player_id} with ${value} block.. ${player.board_position} | -${(player.board_position)%(game_state.rowsize)} ${PLAYER_HEIGHT} ${ ((player.board_position)/(game_state.rowsize))}`);

    playerEl.setAttribute('position', `-${(player.board_position)%(game_state.rowsize)} ${PLAYER_HEIGHT} ${ ((player.board_position)/(game_state.rowsize))}`);
}