require('dotenv').config()
require('./mongo')

const http = require('http')
const express = require('express')
const cors = require('cors')

const app = express()
const logger = require('./loggerMiddleware')

const Note = require('./models/Note')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')


app.use(cors())

app.use(express.json())

app.use(logger)


/*const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(notes));
    
})*/

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>');

})

app.get('/notes', (request, response) => {
    //response.json(notes);
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/notes/:id', (request, response, next) => {
    
    const {id} = request.params

    Note.findById(id).then(note => {
        if (note) {
            response.json(note);
        } else {
            response.status(404).end();
        } 
    })
    .catch(error => next(error))
})  

app.put('/notes/:id', (request, response, next) => {

    const { id } = request.params
    const note = request.body

    const newNoteInfo = {
        content: note.content,
        important: note.important
    }

    Note.findByIdAndUpdate(id, newNoteInfo, {new : true})
        .then(result => {
            response.json(result)
        })

})

app.delete('/notes/:id', (request, response, next) => {
    
    const { id } = request.params

    Note.findByIdAndRemove(id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))

    response.status(204).end();
})


app.post('/notes', (request, response) => {
    const note = request.body;
    
    //const ids = note.map(note => note.id);
    //const maxId = Math.max(...ids);

    if (!note.content){
        return response.status(400).json({
            error: 'required "content" field is missing'
        })
    }

    const newNote = new Note({
        content: note.content,
        important: note.important || false,
        date: new Date()
    })

    newNote.save().then(savedNote => {
        response.json(savedNote)
    })

    /*
    const newNote = {
        id: maxId + 1,
        content: note.content,
        important: typeof note.important !== 'undefined' ? note.important : false,
        date: new Date().toISOString()
    }
    */

    //notes = [...notes, newNote];

    //response.json(newNote);
})

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT || 3001
/*app.listen(PORT)
console.log('Server running on port: ${3001}')*/

app.listen(PORT, () => {
    console.log('Server running on port: ${PORT}')
})