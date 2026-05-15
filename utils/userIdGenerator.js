// Generate unique user ID: 7 digits + 2 letters
function generateUserId() {
  const digits = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letter1 = letters[Math.floor(Math.random() * letters.length)];
  const letter2 = letters[Math.floor(Math.random() * letters.length)];
  return `${digits}${letter1}${letter2}`;
}

// Check if userId is unique (works with both Prisma and Mongoose)
async function isUserIdUnique(userId, dbClient) {
  // If using Prisma
  if (dbClient && dbClient.user && dbClient.user.findUnique) {
    const existingUser = await dbClient.user.findUnique({
      where: { userId }
    });
    return !existingUser;
  }
  
  // If using Mongoose (default)
  const User = require("../models/User");
  const existingUser = await User.findOne({ userId });
  return !existingUser;
}

// Generate unique user ID with collision checking
async function generateUniqueUserId(prismaClient) {
  let userId;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    userId = generateUserId();
    attempts++;
    if (attempts >= maxAttempts) {
      throw new Error('Unable to generate unique user ID after maximum attempts');
    }
  } while (!(await isUserIdUnique(userId, prismaClient)));

  return userId;
}

module.exports = { generateUniqueUserId };