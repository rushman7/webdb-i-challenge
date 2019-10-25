const router = require('express').Router();

const db = require('../data/dbConfig');

router.get('/', (req, res) => {
  db('accounts')
    .then(accounts => res.status(200).json(accounts))
    .catch(err => res.status(500).json(err))
})

router.post('/', accountIsValid, (req, res) => {
  const { name, budget } = req.body;

  db('accounts').insert({ name: name, budget: budget})
    .then(account => res.status(201).json({ message: 'Added new budget' }))
    .catch(err => res.status(500).json({ message: 'Failed to add account' }))
})

function accountIsValid(req, res, next) {
  const { name, budget } = req.body;

  if (!req.body) res.status(400).json({ message: "missing fields data" })
  else if (!name && typeof budget === 'number' && budget >= 0) res.status(400).json({ message: "name missing or budget is not an int" })
  else next();
}

module.exports = router;