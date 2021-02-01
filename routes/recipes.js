const express = require('express');
const { validate } = require('jsonschema');
const multer = require('multer');
const shortid = require('shortid');

const db = require('../db/db')

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/');
  },
  filename: function (req, file, cb) {
    cb(null, `${getRandomInt(10000, 20000)}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get('/', (req, res, next) => {
  const recipes = db.get('recipes')
  res.json({ status: 'OK', data: recipes });
});

router.get("/:id", (req, res, next) => {
  const recipes = db.get('recipes')
  const { id } = req.params;
  const data = recipes.find((recipe) => String(recipe.id) === id);

  res.json({ status: "OK", data });
});

router.post('/',(req, res, next) => {
  const { body } = req;
  const recipeSchema = {
    type: 'object',
    properties: {
      title: {
        type: 'string'
      },
      ingredients: {
        type: 'array'
      },
      time: {
        type: 'string'
      },
      difficulty: {
        type: 'string'
      },
      description: {
        type: 'string'
      },
      calories: {
        type: 'string'
      },
      img: {
        type: 'string'
      },
    },
    required: ['title', 'calories', 'description', 'ingredients'],
    additionalProperties: false
  };

  const validationResult = validate(req.body, recipeSchema);
  if (!validationResult.valid) {
    return next(new Error('INVALID_JSON_OR_API_FORMAT'));
  }

  const newRecipe = {
    id: shortid.generate(),
    title: body.title,
    ingredients: body.ingredients,
    time: body.time,
    difficulty: body.difficulty,
    description: body.description,
    calories: body.calories,
    img: body.img
  };
  try {
    db.get('recipes')
      .push(newRecipe)
      .write()
  } catch (error) {
    throw new Error(error);
  }

  res.json({ status: 'OK', data: newRecipe})
})

router.post('/img', upload.single('image'), function (req, res, next) {
  const { file} = req;
  const image = {
    img: `http://localhost:8080/img/${file.filename}`
  }
  res.json({ status: 'OK', data: image })
})

router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const recipe = db.get('recipes').find((task) => String(task.id) === id)
    .assign({
      title: body.title,
      time: body.time,
      difficulty: body.difficulty,
      description: body.description,
      calories: body.calories,
      img: body.img
    })
    .write()

  res.json({ recipe });
})

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  db.get('recipes')
    .remove({ id: id })
    .write()

  res.json({ status: "OK"})
})

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = router;