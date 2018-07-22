/**
 * Created by sanchitgupta001 on 11/07/18.
 */
const _pick = require('lodash/pick');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { User } = require('./models/user');
const { Todo } = require('./models/todo');
const { authenticate } = require('./middleware/authenticate');
const { mongoose } = require('./db/mongoose');

const app = express();

// middleware
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id,
  });
  todo.save().then(doc => {
    res.send(doc);
  }, e => {
    res.status(400).send(e);
  });
});

app.post('/users', (req, res) => {
  const body = _pick(req.body, ['email', 'password']);
  const user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then(token => {
    res.header('x-auth', token).send(user); // `x-`: denotes custom header
  }).catch(e => {
    res.status(400).send(e);
  });
});

app.post('/users/login', (req, res) => {
  const body = _pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then(user => {
    user.generateAuthToken().then(token => {
      res.header('x-auth', token).send(user);
    });
  }).catch(e => {
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id,
  }).then(todos => {
    res.send({ todos });
  }, e => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  // validate object ID
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  Todo.findOne({
    _creator: req.user._id,
    id,
  }).then(todo => {
    if (!todo) {
      return res.status(404).send();
    }
    return res.send({ todo });
  }, e => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOneAndRemove({
    _creator: req.user._id,
    id,
  }).then(todo => {
    if (!todo) {
      return res.status(404).send();
    }
    return res.send({ todo });
  }, e => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _creator: req.user._id,
    id,
  }, { $set: body }, { new: true }).then(todo => {
    if (!todo) {
      return res.status(404).send();
    }
    return res.send({ todo });
  }, e => {
    res.status(400).send();
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000!');
});



