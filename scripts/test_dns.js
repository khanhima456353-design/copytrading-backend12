const dns = require('dns').promises;
const domain = process.argv[2] || 'gmail.com';
const DNS_TIMEOUT_MS = 2000;
const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));

async function run() {
  try {
    const mx = await Promise.race([dns.resolveMx(domain), timeout(DNS_TIMEOUT_MS)]);
    console.log('MX records found:', Array.isArray(mx) ? mx.length : mx);
  } catch (e) {
    console.error('MX lookup failed:', e.code || e.message);
  }

  try {
    const a = await Promise.race([dns.resolve(domain), timeout(DNS_TIMEOUT_MS)]);
    console.log('A/AAAA records found:', Array.isArray(a) ? a.length : a);
  } catch (e) {
    console.error('A lookup failed:', e.code || e.message);
  }
}

run().catch(err => console.error('Test error:', err));
