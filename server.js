const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(
    'mongodb+srv://ashishkbazad:ashish++7@cluster0.pgfxmdq.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
);

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  mail2: String,
});

const expenseSchema = new mongoose.Schema({
  email: String,
  item: String,
  amount: Number,
});

const Contact = mongoose.model('Contact', contactSchema);
const Expense = mongoose.model('Expense', expenseSchema);

app.post('/contacts', async (req, res) => {
  try {
    const { name, email, phone, mail2 } = req.body;
    const newContact = new Contact({ name, email, phone, mail2 });
    const savedContact = await newContact.save();
    res.json(savedContact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

app.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findOneAndDelete({ _id: id });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

app.get('/contacts', async (req, res) => {
  try {
    const { email } = req.query;
    const contacts = await Contact.find({ email });
    res.json(contacts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.put('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, mail2 } = req.body;
    const { email } = req.query;
    const updatedContact = await Contact.findOneAndUpdate(
        { _id: id, email },
        { name, phone, mail2 },
        { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(updatedContact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.post('/expenses', async (req, res) => {
  try {
    const { email, item, amount } = req.body;
    const newExpense = new Expense({ email, item, amount });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Error saving expense:', error);
    res.status(500).json({ error: 'Failed to save expense' });
  }
});

app.get('/expenses', async (req, res) => {
  try {
    const { email } = req.query;
    const expenses = await Expense.find({ email });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.delete('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.findOneAndDelete({ _id: id });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

app.put('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { item, amount } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(
        id,
        { item, amount },
        { new: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
