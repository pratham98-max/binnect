const User = require('../models/User');

const syncUser = async (req, res) => {
  const { uid, email, name, picture } = req.user; // Data from Firebase middleware

  try {
    // Check if user exists, if not, create them
    let user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { 
        email, 
        displayName: name, 
        photoURL: picture 
      },
      { new: true, upsert: true } // Upsert: true creates the record if it doesn't exist
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error syncing user with database", error });
  }
};

module.exports = { syncUser };