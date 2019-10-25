const router = require('express').Router();

const db = require('../data/dbConfig');

router.get('/', (req, res) => {
  db('accounts')
    .then(accounts => res.status(200).json(accounts))
    .catch(err => res.status(500).json(err))
})

router.get('/:id', (req, res) => {
  db('accounts').where({ id: req.params.id })
    .then(account => {
      if (account.length > 0) res.status(200).json(account)
      else res.status(404).json({ message: 'account does not exist' })
    })
    .catch(err => res.status(500).json(err))
})

router.post('/', fieldsAreValid, (req, res) => {
  db('accounts').insert(req.body, 'ids')
    .then(() => res.status(201).json({ message: 'Added new budget' }))
    .catch(err => res.status(500).json(err))
})

router.put('/:id', fieldsAreValid, (req, res) => {
  db('accounts')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => res.status(200).json(count))
    .catch(err => res.status(500).json(err))
})

router.delete('/:id', (req, res) => {
  db('accounts')
    .where({ id: req.params.id })
    .del()
    .then(() => res.status(202).json({ error: `The account with the ID ${req.params.id} has been removed.` }))
    .catch(err => res.status(500).json(err))
})

function fieldsAreValid(req, res, next) {
  const { name, budget } = req.body;

  if (!req.body) res.status(400).json({ message: "missing fields data" })
  else if (!name && typeof budget === 'number' && budget >= 0) res.status(400).json({ message: "name missing or budget is not an int" })
  else next();
}

module.exports = router;