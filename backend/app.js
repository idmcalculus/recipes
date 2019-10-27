const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Recipe = require('./models/recipe.js');

const app = express();

/*const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://idmcalculus:5VwsDO0ArDkKZPTI@cluster0-c2zua.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/

mongoose.connect('mongodb+srv://idmcalculus:5VwsDO0ArDkKZPTI@cluster0-c2zua.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.post('/api/recipes', (req, res, next) => {
    const recipe = new Recipe({
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      difficulty: req.body.difficulty,
      userId: req.body.userId,
      time: req.body.time
    });
    recipe.save().then(
      () => {
        res.status(201).json({
          message: 'Post saved successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  });

app.use((req, res, next) => {
    console.log('Request received!');
    next();
  });
  
  app.use('/api/recipes', (req, res, next) => {
    Recipe.find().then(
      (recipes) => {
        res.status(200).json(recipes);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  });

  app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({
      _id: req.params.id
    }).then(
      (recipe) => {
        res.status(200).json(recipe);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  });

  app.put('/api/recipes/:id', (req, res, next) => {
    const recipe = new Recipe({
      _id: req.params.id,
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      difficulty: req.body.difficulty,
      userId: req.body.userId,
      time: req.body.time
    });
    Recipe.updateOne({_id: req.params.id}, recipe).then(
      () => {
        res.status(201).json({
          message: 'Recipe updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  });

  app.delete('/api/recipes/:id', (req, res, next) => {
    Recipe.deleteOne({_id: req.params.id}).then(
      () => {
        res.status(200).json({
          message: 'Recipe deleted!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  });

module.exports = app;