const express = require('express');
const app = express();
const port = 3000; // You can use any port

const savingsGoalsRouter = require('./routes/savingsGoals'); // Import the savings goals router

app.use(express.json()); // Important: to parse JSON request bodies

// Mount the savings goals router
app.use('/savings-goals', savingsGoalsRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Car Savings Backend!');
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});