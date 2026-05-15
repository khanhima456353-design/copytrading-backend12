// Test script to verify duplicate email prevention
const axios = require('axios');

const API_BASE = 'http://localhost:5001/api/auth';

async function testDuplicateEmailPrevention() {
  console.log('🧪 Testing duplicate email prevention...\n');

  try {
    // Test 1: Try to send OTP to an email that doesn't exist
    console.log('Test 1: Sending OTP to new email...');
    const otpResponse1 = await axios.post(`${API_BASE}/send-otp`, {
      email: 'test@example.com',
    });
    console.log('✅ OTP sent to new email');

  } catch (error) {
    console.log('❌ Error sending OTP:', error.response?.data?.message || error.message);
  }

  try {
    // Test 2: Try to send OTP to the same email again (should fail if user has password)
    console.log('\nTest 2: Attempting to send OTP to same email again...');
    const otpResponse2 = await axios.post(`${API_BASE}/send-otp`, {
      email: 'test@example.com',
    });
    console.log('❌ This should have failed - user already exists');

  } catch (error) {
    if (error.response?.data?.message === 'User already exists. Please login instead.') {
      console.log('✅ Duplicate email prevention working correctly');
    } else {
      console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
    }
  }

  console.log('\n🎉 Test completed!');
}

testDuplicateEmailPrevention();