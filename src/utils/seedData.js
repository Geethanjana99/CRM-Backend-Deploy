const Lead = require('../models/Lead');

// Data initialization script - creates test data if needed
const initializeTestData = async (User) => {
  try {
    // Check if test user already exists
    let testUser = await User.findOne({ email: 'admin@example.com' });

    if (!testUser) {
      // Create test user
      testUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        active: true,
      });
      await testUser.save();
      console.log('Test user created: admin@example.com');
    }

    // Check if test leads exist
    const leadCount = await Lead.countDocuments();
    if (leadCount === 0) {
      console.log('Database initialized with test user');
    }
  } catch (error) {
    console.error('Error initializing test data:', error.message);
  }
};

module.exports = {
  initializeTestData,
};
