//Load Express
const express = require('express');

//Look for PORT
const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3000;

//Create an instance of the application
const app = express();

// GET /time
app.get('/time',
    //req, resp
    (req, resp) => {
        resp.set('X-written-by', 'chuk');
        //Status code
        resp.status(200);
        // content negotiation
        resp.format({
            // Accept: text/html
            'text/html': () => {
                resp.type('text/html')
                resp.end(`<h2>The current time is ${new Date()}</h2>`);
            },
            // Accept: application/json
            'application/json': () => {
                resp.type('application/json')
                resp.json({
                    currentTime: (new Date()).getTime()
                })
            },
            'default': () => {
                resp.status(406);
                resp.end();
            }
        })
        // content type - representation
        // application/json
        // // resp.send(), resp.end(), resp.json()
        // resp.end(`<h2>The current time is ${new Date()}</h2>`);
    }
)

//Rules for express to handle your request
//ignore the request method and just process the 
//request with express.static
app.use(
    express.static(__dirname + '/public')
);

//Start the server - listening to a port of our choosing
app.listen(PORT, 
    () => {
        console.info(`Application has started on ${PORT} at ${new Date()}`);
    }
)