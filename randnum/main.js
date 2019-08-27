// Load express
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');

// Configure the PORT
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;

// Create an instance of Express
const app = express();

// Configure express to use handlebars
app.engine('hbs', handlebars({ defaultLayout: 'default.hbs' }));
app.set('view engine', 'hbs');

// Rules to handle incoming request
// Log all incoming request
app.use(morgan('combined'))

const randnum = function() {
    return (Math.floor(Math.random() * 31));
}

const randimg = function() {
    const imgNum = Math.floor(Math.random() * 31);
    return (`number${imgNum}.jpg`);
}
// GET /number
app.get('/number',
    (req, resp) => {
        const image = randimg();
        resp.status(200);
        resp.type('text/html');
        resp.send(`
            <h2>Random number of the day</h2>
            <img src="/number/${image}" height="256px">
        `)
    }
)

// GET /toto
// GET /toto?key=value&key=value&key=value - query string
// GET /toto?nums=10
// GET /toto?nums=10&min=0&max=20
app.get('/toto', 
    (req, resp) => {
        const totalNum = parseInt(req.query.nums) || 6;
        const nums = []
        for (let i = 0; i < totalNum; i++)
            nums.push(randnum())

        const mapped = nums.map(v => {
            return ({
                value: v,
                image: `/number/number${v}.jpg`
            })
        })

        let result = '';
        for (let i = 0; i < mapped.length; i++) {
            result += `<img src="${mapped[i].image}" height="100px">\n`
        }

        resp.status(200);
        resp.type('text/html');
        resp.end('<h2>Your lucky TOTO numbers</h2>' + result);
    }
)

app.get('/toto2', (req, resp) => {
    const totalNum = parseInt(req.query.nums) || 6;
    const nums = []
    for (let i = 0; i < totalNum; i++)
        nums.push(randnum())

    /*
        [
            { value: 1, image: '/number/number1.jpg' },
            ...
        ]
    */
    const mapped = nums.map(v => {
        return ({
            value: v,
            image: `/number/number${v}.jpg`
        })
    })

    resp.status(200);
    resp.format({
        'text/html': () => {
            resp.type('text/html');
            resp.render('toto2', 
                { 
                    nums: totalNum,
                    numList: mapped
                }
            )
        },
        'application/json': () => {
            resp.type('application/json')
            resp.json(mapped);
        },
        'default': () => {
            resp.status(406);
            resp.end();
        }
    })
})

// Serve static images
app.use(express.static(__dirname + '/public'));

// Start the server
app.listen(PORT, () => {
    console.info(`Application started on ${PORT} at ${new Date()}`)
});