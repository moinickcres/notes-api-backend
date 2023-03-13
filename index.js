const http = require('http')
const express = require('express')
const cors = require('cors')

const app = express()
const logger = require('./loggerMiddleware')

app.use(cors())

app.use(express.json())

app.use(logger)


notes = [
    {
        "id": 1,
        "important": true,
        "content": "manolo",
        "date": new Date
    },
    {
        "id": 2,
        "important": true,
        "content": "manolo",
        "date": new Date
    },
]


/*const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(notes));
    
})*/

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>');

})

app.get('/notes', (request, response) => {
    response.json(notes);

})

app.get('/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    
    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    } 
})


app.delete('/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);
    response.status(204).end();
})


app.post('/notes', (request, response) => {
    const note = request.body;
    
    const ids = notes.map(note => note.id);
    const maxId = Math.max(...ids);

    const newNote = {
        id: maxId + 1,
        content: note.content,
        important: typeof note.important !== 'undefined' ? note.important : false,
        date: new Date().toISOString()
    }

    notes = [...notes, newNote];

    response.json(newNote);
})

app.use((request, response) => {
    response.status(404).json({ error: 'Not found' });

})

const PORT = 3001
/*app.listen(PORT)
console.log('Server running on port: ${3001}')*/

app.listen(PORT, () => {
    console.log('Server running on port: ${3001}')
})