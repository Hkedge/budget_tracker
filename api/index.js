const express = require('express');
const router = express.Router();

// ? These will be needed if you want to have users in the future
// const jwt = require('jsonwebtoken');
// const { getUserById } = require('../db');
// const { JWT_SECRET } = process.env;


router.get('/budget', async (req, res, next) => {
    res.send ({message: "Welcome to our budget tracker"})
    next;
});

// ? This will run before all of the routers and get the user if token is received. It will store the user as req.user - if users are wanted in the future
router.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    if (!auth) {
        next();
    } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${ prefix }`
        });
    }
});

// ? ROUTER: /api/users - if users are used in the future
// const usersRouter = require('./users');
// router.use('/users', usersRouter);

// * ROUTER: /api/budgetWeeks
const budgetWeeksRouter = require('./budget_weeks');
router.use('/budget_weeks', budgetWeeksRouter);

// * ROUTER: /api/expenses
const expensesRouter = require('./expenses');
router.use('/expenses', expensesRouter);

// * This will run if no matching route was found
router.use('*', (req, res, next) => {
  const err = new Error("Not found")
  err.status = 404
  res.status(404)
  next({
    name: "404 Error",
    error: "404",
    message: "Error 404 - Page not found"
  })
});

// * This will run last and send any error messages passed in from next // * eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  res.send({
    name: err.name,
    error: err.error,
    message: err.message
  });
});

module.exports = router;

