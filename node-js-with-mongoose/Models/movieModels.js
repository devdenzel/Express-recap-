const mongoose = require('mongoose');
const fs = require("fs");
// creating a schema and model
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        trim: true
    },
    
    description: {
        type: String,
        required: [true, 'Description is required field!'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required field!']
    },
    ratings: {
        type: Number
        
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release year is required field!']
    },
    releaseDate:{
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    genres: {
        type: [String],
        required: [true, 'Genres is required field!'],
        // enum: {
        //      values: ["Action", "Adventure", "Sci-Fi", "Thriller", "Crime", "Drama", "Comedy", "Romance", "Biography"],
        //      message: "This genre does not exist"
        // }
    },
    directors: {
        type: [String],
        required: [true, 'Directors is required field!']
    },
    coverImage:{
        type: String,
        require: [true, 'Cover image is required field!']
    },
    actors: {
        type: [String],
        require: [true, 'actors is required field!']
    },
    price: {
        type: Number,
        require: [true, 'Price is required field!.']
    },
    createdBy: String
    
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

// virtual properites
movieSchema.virtual('durationInHours').get(function(){
    return this.duration / 60
});

// executing a 'pre' hook/a middleware function on a save event before a document is saved to database
movieSchema.pre('save', function(next) {
    this.createdBy = "X"
    next();
});

movieSchema.post('save', function(doc, next){
    const content = `A new movie document with ${doc.name} has been created by ${doc.createdBy}\n`;
    fs.writeFileSync('./Log/log.txt', content, {flag: 'a'}, (err)=>{
        console.log(err.message);
    });
    // calls the next middleware, which is the create post RHF
    next();
});
// creating model with schema..
const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;

