// Script de prueba para verificar las APIs
const API_BASE = 'http://localhost:3001/api';

async function testAPI(endpoint, description) {
  try {
    console.log(`🔍 Probando ${description}...`);
    const response = await fetch(`${API_BASE}${endpoint}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${description} - OK`);
      console.log(`   Datos recibidos:`, data);
      return data;
    } else {
      console.log(`❌ ${description} - Error ${response.status}: ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ ${description} - Error de conexión:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Iniciando pruebas de API...\n');
  
  // Probar endpoints principales
  const stores = await testAPI('/stores?page=1&limit=1', 'Stores API');
  const users = await testAPI('/users', 'Users API');
  const events = await testAPI('/events?page=1&limit=1', 'Events API');
  const schedules = await testAPI('/schedules', 'Schedules API');
  
  console.log('\n📊 Resumen de resultados:');
  console.log(`   Stores: ${stores ? '✅' : '❌'}`);
  console.log(`   Users: ${users ? '✅' : '❌'}`);
  console.log(`   Events: ${events ? '✅' : '❌'}`);
  console.log(`   Schedules: ${schedules ? '✅' : '❌'}`);
  
  if (stores && users && events && schedules) {
    console.log('\n🎉 Todas las APIs están funcionando correctamente!');
  } else {
    console.log('\n⚠️  Algunas APIs no están funcionando. Revisa los errores arriba.');
  }
}

// Ejecutar las pruebas
runTests(); 