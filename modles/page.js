const mongoose = require('mongoose');
const pageSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }, content: {
        type: String,
        required: true
    },
    sorting: {
        type: String
    },
});
// we are using slud in place of id in this project because in url we get the title of page which held in serach optmizing engine.
const Page = module.exports = mongoose.model('Page', pageSchema);