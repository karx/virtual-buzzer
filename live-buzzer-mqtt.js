document.addEventListener('DOMContentLoaded', function(){ 
    // pushThePlayButton();
    setTimeout(test, 2600);  
}, false)


async function test() {
    // updateChartWithStrings(['Getting started is 50% of the job done'], 'started');

}


var number = Math.floor(Math.random() * 8888) + 1111;

function beginTheThing() {
    init();
}
function init() {
    document.getElementById('connection_code').innerHTML = number;
    document.getElementById('connection_code').setAttribute('aria-label', `Connection Code is ${number}`);
    let btn = document.getElementById('init-btn');
    // var pointer = document.getElementById('the-pointer-to-show');
    btn.style.display = "none";
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
    `clientId-vb-buzzer-${ID()}`
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
    client.subscribe(`vbuzzer/${number}/connected`);
    let message = new Paho.Message("Hello");
    message.destinationName = `vbuzzer/${number}/presence`;
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
    if (message.topic === `vbuzzer/${number}/detected`) {
        perform_vibration(0);
    } else if (message.topic === `vbuzzer/${number}/connected`){
        // show_options();
        show_connected_feedback();
        send_ack_connection();
    } else if (message.topic === `vbuzzer/${number}/phrase`) {
        let phrase = message.payloadString;
        phrase = phrase.toLowerCase();
        
        updateChartWithStrings([phrase]);
    }

    console.log(message);
    console.log("onMessageArrived:" + message.payloadString);
}
function show_connected_feedback() {
    document.getElementById('connection_code').style.backgroundColor ='#00FF00';
}
function send_ack_connection () {
    let message = new Paho.Message("ack");
    message.destinationName = `vbuzzer/${number}/connection_ack`;
    client.send(message);
}

function buzzer_click() {
    let message = new Paho.Message("ack");
    message.destinationName = `vbuzzer/${number}/requested`;
    client.send(message);
}