const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MongoDB Connection
const uri = 'mongodb+srv://saumyapiumi7:123@cluster0.obmo0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const notificationSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes

app.post('/api/notifications', async (req, res) => {
    const { message } = req.body;
    try {
      const newNotification = new Notification({ message });
      await newNotification.save();
      res.status(201).send({ success: true, data: newNotification });
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  });
  

app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.status(200).send({ success: true, data: notifications });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

// DELETE route for deleting a notification by ID
app.delete('/api/notifications/:id', async (req, res) => {
    const { id } = req.params;  // Get notification ID from the URL parameter
    try {
      // Try to find and delete the notification with the given ID
      const deletedNotification = await Notification.findByIdAndDelete(id);
  
      if (deletedNotification) {
        res.status(200).send({ success: true, message: 'Notification deleted successfully' });
      } else {
        res.status(404).send({ success: false, message: 'Notification not found' });
      }
    } catch (error) {
      res.status(500).send({ success: false, error: error.message });
    }
  });
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
