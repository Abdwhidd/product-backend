const axios = require('axios');

// Fungsi untuk mengambil data Eksternal dari Fashion-MNIST API
async function fetchFashionMNISTData() {
  try {
    const response = await axios.get('https://world.openfoodfacts.org/api/v0/product/737628064502.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Fashion-MNIST API:', error);
    throw error; 
  }
}

module.exports = {
  fetchFashionMNISTData,
};