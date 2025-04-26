const searchInput = document.getElementById('searchInput');
const countryContainer = document.getElementById('countryContainer');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

searchInput.addEventListener('input', function() {
  const query = searchInput.value.trim();
  if (query.length >= 2) {
    fetchCountryData(query);
  } else {
    countryContainer.innerHTML = '';
  }
});

async function fetchCountryData(name) {
  const url = `https://restcountries.com/v3.1/name/${name}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayCountries(data);
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
}

function displayCountries(countries) {
  countryContainer.innerHTML = '';

  countries.forEach(country => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common} flag">
      <h2>${country.name.common}</h2>
      <p><strong>Region:</strong> ${country.region}</p>
      <button class="more-details" onclick="showMoreDetails('${country.name.common}')">More Details</button>
    `;
    countryContainer.appendChild(card);
  });
}

async function showMoreDetails(countryName) {
  const url = `https://restcountries.com/v3.1/name/${countryName}`;
  try {
    const res = await fetch(url);
    const [country] = await res.json();

    const weather = await fetchWeatherData(country.capital[0]);

    modalBody.innerHTML = `
      <h2>${country.name.common}</h2>
      <img src="${country.flags.png}" alt="Flag" style="width:150px; margin: 1rem 0;">
      <p><strong>Capital:</strong> ${country.capital[0]}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Weather in ${country.capital[0]}:</strong> ${weather}</p>
    `;
    modal.style.display = 'flex';
  } catch (error) {
    console.error('Error fetching more details:', error);
  }
}

async function fetchWeatherData(city) {
  const apiKey = '63288f5e3b7247dfbf880513252604';  // You must replace this
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Weather not found');
    }
    const data = await res.json();
    return `${data.current.temp_c}°C, ${data.current.condition.text}`;
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    return 'Weather data not available';
  }
}

// Close modal
closeModal.onclick = () => {
  modal.style.display = 'none';
}
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}
