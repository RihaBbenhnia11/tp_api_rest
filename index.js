const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./database');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
res.json("Registre de personnes! Choisissez le bon routage!")
})

/*app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4200']
}));*/

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    message:
      "Trop de requêtes effectuées depuis cette IP, veuillez réessayer après 15 minutes."
  }
});
app.use(limiter);




// Récupérer toutes les personnes
app.get('/personnes', (req, res) => {
db.all("SELECT * FROM personnes", [], (err, rows) => {
if (err) {
res.status(400).json({
"error": err.message
});
return;
}
res.json({
"message": "success",
"data": rows
});
});
});



// Récupérer une personne par ID
app.get('/personnes/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM personnes WHERE id = ?", [id], (err, row) => {
    if (err) {
    res.status(400).json({
    "error": err.message
    });
    return; }
    res.json({
    "message": "success",
    "data": row });
    });
    });


    // Créer une nouvelle personne
    app.post('/personnes', (req, res) => {
        const { nom, adresse } = req.body;
      
        db.run(
          `INSERT INTO personnes (nom, adresse) VALUES (?, ?)`,
          [nom, adresse],
          function(err) {
            if (err) {
              res.status(400).json({ error: err.message });
              return;
            }
      
            res.json({
              message: "success",
              data: { id: this.lastID }
            });
          }
        );
      });

    // Mettre à jour une personne
    app.put('/personnes/:id', (req, res) => {
        const id = req.params.id;
        const { nom, adresse } = req.body;
      
        db.run(
          `UPDATE personnes SET nom=?, adresse=? WHERE id=?`,
          [nom, adresse, id],
          function(err) {
            if (err) {
              res.status(400).json({ error: err.message });
              return;
            }
      
            res.json({ message: "success" });
          }
        );
      });


    // Supprimer une personne
    app.delete('/personnes/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM personnes WHERE id = ?`, id, function(err) {
    if (err) {
    res.status(400).json({
    "error": err.message
    });
    return;
    }
    res.json({
    "message": "success" });
    });
    });
    
    app.listen(PORT, () => {console.log(`Server running on port ${PORT}`); });