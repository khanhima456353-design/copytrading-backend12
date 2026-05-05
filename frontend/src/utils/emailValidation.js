// frontend/src/utils/emailValidation.js

export const isValidEmailFormat = (email) => {
  if (!email) return false;

  const cleanEmail = email.trim().toLowerCase();

  // basic email format check only
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(cleanEmail);
};