/**
 * Quick test script to verify Strapi CMS connection
 * Run with: node test-strapi-connection.js
 */

const CMS_URL = 'http://localhost:1337/api';

async function testEndpoint(name, url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name}: OK (${response.status})`);
      if (data.data) {
        const count = Array.isArray(data.data) ? data.data.length : 1;
        console.log(`   → ${count} item(s) found`);
      }
    } else {
      console.log(`❌ ${name}: FAILED (${response.status})`);
      console.log(`   → ${data.error?.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ ${name}: CONNECTION ERROR`);
    console.log(`   → ${error.message}`);
  }
}

async function runTests() {
  console.log('\n🔍 Testing Strapi CMS Connection...\n');
  console.log(`Base URL: ${CMS_URL}\n`);
  
  // Test collection types
  console.log('📦 Collection Types:');
  await testEndpoint('Events', `${CMS_URL}/events`);
  await testEndpoint('News Articles', `${CMS_URL}/news-articles`);
  await testEndpoint('News Categories', `${CMS_URL}/news-categories`);
  await testEndpoint('Leadership', `${CMS_URL}/leaderships`);
  await testEndpoint('Benefits', `${CMS_URL}/benefits`);
  await testEndpoint('FAQs', `${CMS_URL}/faqs`);
  await testEndpoint('Partners', `${CMS_URL}/partners`);
  await testEndpoint('Timeline Events', `${CMS_URL}/timeline-events`);
  
  console.log('\n📄 Single Types:');
  await testEndpoint('Homepage', `${CMS_URL}/homepage`);
  await testEndpoint('About Page', `${CMS_URL}/about-page`);
  await testEndpoint('Membership Page', `${CMS_URL}/membership-page`);
  await testEndpoint('Contact Info', `${CMS_URL}/contact-info`);
  await testEndpoint('Site Settings', `${CMS_URL}/site-setting`);
  
  console.log('\n✨ Test complete!\n');
  console.log('If you see ❌ errors:');
  console.log('1. Make sure Strapi is running: cd CMS && yarn develop');
  console.log('2. Configure API permissions in Strapi admin panel');
  console.log('3. See CMS/API_PERMISSIONS_SETUP.md for detailed instructions\n');
}

runTests();
