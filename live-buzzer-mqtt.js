document.addEventListener('DOMContentLoaded', function(){ 
    // pushThePlayButton();
    setTimeout(test, 2600);  
}, false)

const camera_rigs = ["camera", "camera2", "camera3", "camera4"];
let switch_count = 0;

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
    
    generateVirtue(4,19);
    generateVirtue(80,90);
    generateVirtue(6,30);
    generateVirtue(8,18);
    generateVirtue(52,89);
    generateVirtue(5,45);

    generateVice(98,29);
    generateVice(46,2);
    generateVice(62,35);
    generateVice(78,21);
    generateVice(43,15);
    generateVice(63,44);
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
    client.subscribe(`vchoopad/${number}/cam`);
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
    } else if (message.topic === `vchoopad/${number}/cam`) {
        switchCamera();
    }

    console.log(message);
    console.log("onMessageArrived:" + message.payloadString);
}
function show_connected_feedback() {
    document.getElementById('connection_code').style.backgroundColor ='#00FF00';
    cam_rig_1();
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


function cam_rig_1() {
    console.log('firing event');
    document.getElementById('rig').emit('connected');
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


function generateVirtue(start_index, end_index) {
    generateVirtueVice(start_index, end_index, "virtue");
}


function generateVice(start_index, end_index) {
    generateVirtueVice(start_index, end_index, "vice");
}
function generateVirtueVice(start_index, end_index, type = "virtue") {
    let isVirtue = type == "virtue";
    let start_box = calcBoxCordFromIndex(start_index);
    let end_box = calcBoxCordFromIndex(end_index);

    let virtueTube = document.createElement('a-tube');

    let pos_array_for_tube = [];
    let curve_count = 3;

    for (let point_index = 0; point_index <= curve_count; point_index++) {
        let factor = point_index * (curve_count - point_index);
        let central_x = ((start_box.x * (curve_count-point_index)) + (end_box.x * point_index))/curve_count;
        let central_z = ((start_box.z * (curve_count-point_index)) + (end_box.z * point_index))/curve_count;
        
        let random_X = (Math.random() *factor) - factor/2; /// gives random bw -factor/2 and factor/2
        let random_Y = (Math.random() *factor) + 0.7; /// gives random bw 2 and 2 + factor
        let random_Z = (Math.random() *factor) - factor/2; /// gives random bw -factor/2 and factor/2

        let pos_val = `${central_x + random_X} ${isVirtue ? '' : '-'}${random_Y} ${central_z + random_Z}`;

        pos_array_for_tube.push(pos_val);
        
    }
    let tube_postion_string = pos_array_for_tube.join(',');
    console.log(tube_postion_string);

    virtueTube.setAttribute('path', tube_postion_string);
    virtueTube.setAttribute('radius', (end_index - start_index) * 0.004);
    virtueTube.setAttribute('material', isVirtue ? 'color: #3EE34E' : 'color: #E33E4E' );
    let theScene = document.getElementById('theScene');
    
    theScene.append(virtueTube);
    // MODI Ji is LIve Gotta Go for sometime.... will be back.....

}

function calcBoxCordFromIndex(index, rowsize = 10) {
    let x_index = (((parseInt(index/rowsize)%2)* rowsize) - (index%rowsize)) - (parseInt(index/rowsize)%2); //MOD of this actuyall
    x_index = x_index < 0 ? -x_index : x_index;
    let z_index = parseInt(index/rowsize) + ((index * 0.4) /rowsize);
    return {
        x: - x_index,
        z: z_index
    };
  }

  function switchCamera() {
    let cam_id = camera_rigs[++switch_count % camera_rigs.length];
    let camEl = document.getElementById(cam_id);
    camEl.setAttribute("camera", "active", true);
    console.log(camEl.getAttribute('rotation'));
    console.log(camEl.getAttribute('position'));
    camEl.emit('switch');
  }


//   setInterval( () => {
//       console.log('Switching Camera');
//       switchCamera();
//   }, 2000);