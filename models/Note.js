var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var NoteSchema = new Schema({
  article_id: Schema.Types.ObjectId,
  title: String,
  body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
