
const mongoose = require('mongoose')

//import {Note} from './models/Note.js'

const connectionString = process.env.MONGO_DB_URI

// conexión a mongodb

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Database connected ')
    }).catch(err => {
        console.error(err)
    })

/*
const note = new Note ({
    content: 'MongoDB y tal',
    date: new Date(),
    important: true
})

note.save()
    .then(result => {
        console.log(result)
        mongoose.connection.close()
    })
    .catch(err => {
        console.error(err)
    })
*/

