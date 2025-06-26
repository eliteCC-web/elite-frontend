const axios = require('axios');

// Configuración
const API_BASE_URL = 'https://elite-backend-production-70a3.up.railway.app';
const TEST_EMAIL = 'admin@elite.com';
const TEST_PASSWORD = 'admin123';

async function testScheduleEndpoint() {
  try {
    console.log('🔍 Probando endpoint de horarios...\n');

    // 1. Primero hacer login para obtener el token
    console.log('1. Haciendo login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    const { access_token, user } = loginResponse.data;
    console.log('✅ Login exitoso');
    console.log('Usuario:', user.email);

    // 2. Probar el endpoint de horarios con el token
    console.log('\n2. Probando endpoint /api/schedule/my-schedule/three-weeks...');
    const scheduleResponse = await axios.get(`${API_BASE_URL}/api/schedule/my-schedule/three-weeks`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const scheduleData = scheduleResponse.data;
    console.log('✅ Horarios obtenidos exitosamente');
    console.log('Datos del horario:', JSON.stringify(scheduleData, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('URL:', error.config?.url);
    }
  }
}

testScheduleEndpoint(); 