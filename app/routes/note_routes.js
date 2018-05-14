// routes/notes_routes.js

var ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  app.get("/notes/:id", (req, res) => {
    const noteId = { _id: new ObjectID(req.params.id) };
    db.collection("notes").findOne(noteId, (err, item) => {
      if (err) {
        res.send({ error: "Could not fetch id: " + req.params.id });
      } else {
        res.send(item);
      }
    });
  });

  app.get("/notes", (req, res) => {
    db
      .collection("notes")
      .find()
      .toArray((err, items) => {
        if (err) {
          res.send({ error: "Could not fetch todos" });
        } else {
          res.send(items);
        }
      });
  });

  app.put("/notes/:id", (req, res) => {
    const id = req.params.id;
    const noteId = { _id: new ObjectID(id) };
    const newNote = {
      title: req.body.title,
      completed: JSON.parse(req.body.completed)
    };
    db.collection("notes").update(noteId, newNote, (err, result) => {
      if (err) {
        res.send({ error: "Could not update id: " + id });
      } else {
        res.send(newNote);
      }
    });
  });

  app.delete("/notes/:id", (req, res) => {
    const id = req.params.id;
    const noteId = { _id: new ObjectID(id) };
    db.collection("notes").remove(noteId, (err, item) => {
      if (err) {
        res.send({ error: "Could not delete id: " + id });
      } else {
        res.send("Note " + id + " deleted!");
      }
    });
  });

  app.post("/notes", (req, res) => {
    const note = { title: req.body.title, completed: false };
    db.collection("notes").insert(note, (err, result) => {
      if (err) {
        res.send({ error: "Could not create entry" });
      } else {
        res.send(result.ops[0]);
      }
    });
  });
};
