/**
 * Created by dstewart on 3/10/2017.
 */

var http      = require('http');
var express   = require('express');
var gpio      = require('pi-gpio');

var app       = express();

var pins = {};
pins['7'] = null;
pins['11'] = null;
pins['12'] = null;
pins['13'] = null;
pins['15'] = null;
pins['16'] = null;
pins['18'] = null;
pins['22'] = null;

// -----------------------------------------------------------------------
// populate GPIO pin values
for (var pin in pins) {
    console.log('reading GPIO pin ' + pin);
    read(pin, function(state){
        console.log('pin ' + pin + 'current state: ' + state);
        pins[pin] = state;
    }) 
}

function read(pin, callback){

    gpio.open(pin, "input", function(err){
        if (err){
            gpio.close(pin);
            throw err;
        }
        gpio.read(pin, function(err, value){
            if (err){
                gpio.close(pin);
                throw err;
            }
            console.log('pin ' + pin + ' value: ' + value);
            pins[pin] = value;
            gpio.close(pin);
            console.log('closed pin ' + pin);
            callback(value);
        });
    });
}

function toggle(state){
    if (state == 0){
        return 1;
    }
    if (state == 1){
        return 0;
    }
    throw 'pin has no state';
}

function toggleState(pin, callback){

    gpio.open(pin, "output", function(err){
        console.log('toggle pin ' + pin + ' from ' + pins[pin] + ' to ' + toggle(pins[pin]))
        gpio.write(pin, toggle(pins[pin]), function(err){
            if(err){
                gpio.close(pin);
                throw 'write attempt: ' + err;
            }
            pins[pin] = toggle(pins[pin]);
            console.log('toggle successful');
            gpio.close(pin);
            console.log('closed pin ' + pin);
            callback(pins[pin]);
        });

        if(err){
            gpio.close(pin);
            throw err;
        }
    });
}

// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored
// in the home directory
app.use(express.static(__dirname));

app.get('/pin/:id', function (req, res) {

    console.log('received API get request for pin number ' + req.params.id);

    if (req.params.id in pins){

        read(req.params.id, function(state){
            console.log('current state: ' + state);
            pins[req.params.id] = state;
            res.status(200).json({'pin' : req.params.id, 'state' : state});
        }) 
    }
    else{
        console.log('invalid pin number');
        res.status(403).send('invalid pin number ' + req.params.id);
    }
});

// put
app.put('/pin/:id', function (req, res){
    console.log('received API put request for pin number ' + req.params.id);

    if (req.params.id in pins){
        
        console.log(req.params.id + ' found');

        try{
            toggleState(req.params.id, function(newState){
                res.status(200).json({'pin' : req.params.id, 'state' : newState});
            });
        }
        catch(err){
            console.log(err);
        }
    }
    else{
        console.log(req.params.id + ' not found');
    }
});

// Express route for incoming requests for a list of all pins states
app.get('/pins', function (req, res) {
    console.log('all pins');
    res.status(200).send(pins);
}); // apt.get()

// Express route for any other unrecognised incoming requests
app.get('*', function (req, res) {
    res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function (err, req, res, next) {
    if (req.xhr) {
        res.status(500).send('Oops, Something went wrong!');
    } else {
        next(err);
    }
}); // apt.use()

process.on('SIGINT', function() {
    console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");
    process.exit();
});

// ------------------------------------------------------------------------
// Start Express App Server
//
app.listen(3000);
console.log('App Server is listening on port 3000');