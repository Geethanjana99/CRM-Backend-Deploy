// Helper to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Helper to validate phone number
const isValidPhoneNumber = (phone) => {
  // Accept international format with various patterns
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Helper to format response
const formatResponse = (success, message, data = null) => {
  return {
    success,
    message,
    ...(data && { data }),
  };
};

module.exports = {
  isValidEmail,
  isValidPhoneNumber,
  formatResponse,
};
