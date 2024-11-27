const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const User = require('../Models/User')
const bucket = require('../firebase'); // Firebase bucket
const router = express.Router();
// Multer setup for file handling
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage }); 

// Endpoint to get logged-in user info (check session)
router.get('/user', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ message: 'User not logged in' });
  }

  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) return res.status(404).send({ message: 'User not found' });
    
    res.status(200).send({ userId: user._id, email: user.email, name: user.name });
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
});

// Register a user
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const file = req.file;

    // Log the request body for debugging
    console.log('Received Body:', req.body);

    const { name, email, password, address, phone } = req.body;

    // Check if the user already exists
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).send('User already exists');

    let profilePictureUrl = null;

    if (file) {
      // Generate a unique file name
      const fileName = `${Date.now()}_${file.originalname}`;
      const blob = bucket.file(fileName);

      // Create a write stream for the file
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Handle errors during the upload
      blobStream.on('error', (error) => {
        console.error('Blob stream error:', error);
        return res.status(500).send('Error uploading profile picture');
      });

      // Handle successful upload
      blobStream.on('finish', async () => {
        try {
          // Make the file public
          await blob.makePublic();

          // Generate the public URL for the file
          profilePictureUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;

          console.log('Profile Picture Public URL:', profilePictureUrl);

          // Save user to the database
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          const user = new User({
            name,
            email,
            password: hashedPassword,
            address,
            phone,
            profilePicture: profilePictureUrl,
          });

          await user.save();
          res.status(201).send('User registered successfully');
        } catch (makePublicError) {
          console.error('Error making profile picture public:', makePublicError);
          res.status(500).send('Error making profile picture public');
        }
      });

      // End the blob stream with the file buffer
      blobStream.end(file.buffer);
    } else {
      // Save user without a profile picture
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        address,
        phone,
        profilePicture: null, // No picture uploaded
      });

      await user.save();
      res.status(201).send('User registered successfully');
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});


router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    // Log received data
    console.log('Received Data:', {
      name,
      email,
      password,
      address,
      phone,
      profilePicture: req.file ? req.file.originalname : 'No file uploaded',
    });

    // Check if the user already exists
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).send('User already exists');

    // Handle profile picture upload to Firebase
    let profilePictureUrl = null;
    if (req.file) {
      const fileName = `${Date.now()}_${req.file.originalname}`;
      const blob = bucket.file(fileName);

      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on('error', (error) => {
        console.error('Blob stream error:', error);
        return res.status(500).send('Error uploading profile picture');
      });

      blobStream.on('finish', async () => {
        try {
          // Make the file public
          await blob.makePublic();

          // Generate the public URL
          profilePictureUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;

          console.log('Profile Picture Public URL:', profilePictureUrl);

          // Save user data to MongoDB
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          const user = new User({
            name,
            email,
            password: hashedPassword,
            address,
            phone,
            profilePicture: profilePictureUrl,
          });

          await user.save();
          res.status(201).send('User registered successfully');
        } catch (makePublicError) {
          console.error('Error making profile picture public:', makePublicError);
          res.status(500).send('Error making profile picture public');
        }
      });

      blobStream.end(req.file.buffer);
    } else {
      // If no file is uploaded, proceed with user registration without a profile picture
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        address,
        phone,
        profilePicture: null, // No picture uploaded
      });

      await user.save();
      res.status(201).send('User registered successfully');
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send('Error registering user');
  }
});

router.get('/session', async (req, res) => {
  console.log('Session start')
  if (req.session && req.session.userId) {
    console.log('Session', req.session)
    console.log('SessionID', req.session.userId)
    try {
      const user = await User.findById(req.session.userId).select('name avatar _id');
      console.log('User Not Found!')
      if (!user) return res.status(404).send({ error: 'User not found' });
      console.log('User Found!')
      console.log('Session')
      console.log(user.profilePicture)
      res.status(200).json({
        userName: user.name,
        userAvatar: user.profilePicture || 'https://via.placeholder.com/40', // Default image if no avatar
        userId: user._id, // Include user ID
        token: req.session.token, // Include token if used
      });
    } catch (error) {
      res.status(500).send({ error: 'Failed to retrieve session' });
    }
  } else {
    res.status(401).json({ error: 'Session expired or not logged in' });
  }
});


// Login User (Session-based)
router.post('/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');

  req.session.userId = user._id;
  req.session.user = { userName: user.name, userAvatar: user.profilePicture };

  // Set cookie expiration based on "Remember Me" option
  if (rememberMe) {
    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
  } else {
    req.session.cookie.maxAge = 1000 * 60 * 60; // 1 hour
  }

  res.status(200).send({
    userId: user._id,
    userName: user.name,
    userAvatar: user.profilePicture,
  });
});


// Logout User
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    res.status(200).send('Logged out');
  });
});


module.exports = router;
