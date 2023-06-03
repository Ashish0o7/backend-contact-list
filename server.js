const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://ashishkbazad:ashish++7@cluster0.pgfxmdq.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  mail2: String,
});


const Contact = mongoose.model('Contact', contactSchema);


app.post('/contacts', async (req, res) => {
  try {
    const { name, email, phone,mail2 } = req.body;
   
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
   
    await Contact.findOneAndDelete({ _id: id});
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
    const { name, phone,mail2 } = req.body;
    const {email}=req.query;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, email },
      { name, phone,mail2 },
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



app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

