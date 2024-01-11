async function fetchProvinces() {
    try {
      const response = await fetch('https://turkiyeapi.dev/api/v1/provinces');
      const data = await response.json();
  
      // Check if 'data' property exists and is an array
      const provinces = Array.isArray(data.data) ? data.data : [];
  
      //console.log('Provinces:', provinces);
      return provinces;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return [];
    }
  }

  function populateCityDropdown() {
    const cityDropdown = document.getElementById('city');
  
    fetchProvinces().then(provinces => {
      provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province.name;
        option.text = province.name;
        cityDropdown.appendChild(option);
        //console.log(province.districts);
      });
  
      // Call the function to populate the towns based on the initial selected city
      populateTownDropdown();
    });
  }
  
  async function populateTownDropdown() {
    const cityDropdown = document.getElementById('city');
    const townDropdown = document.getElementById('town');
    const selectedCityName = cityDropdown.value; // Parse to ensure numeric comparison
  
    // Clear the existing options in the town dropdown
    townDropdown.innerHTML = '';
  
    try {
      const response = await fetch('https://turkiyeapi.dev/api/v1/provinces');
      const responseData = await response.json();
  
      console.log('API Response:', responseData);
  
      // Check if the 'data' property is an array
      if (Array.isArray(responseData.data)) {
        // Find the selected city in the data
        const selectedCity = responseData.data.find(city => city.name === selectedCityName);
  
        if (selectedCity && Array.isArray(selectedCity.districts) && selectedCity.districts.length > 0) {
          selectedCity.districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district.name;
            option.text = district.name;
            townDropdown.appendChild(option);
          });
        } else {
          console.error('No districts found for the selected city.');
        }
      } else {
        console.error('Invalid response structure for districts.');
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  }
  document.getElementById('city').addEventListener('change', populateTownDropdown);
  populateCityDropdown();
  document.getElementById('submit').addEventListener('click', () => {
    requestBlood();
  });

  function requestBlood() {

      const backendEndpoint = '/api/blood-requests';

      const requestBody = {
        hospital: document.getElementById('requestorHospital').value,
        city: document.getElementById('city').value,
        town: document.getElementById('town').value,
        bloodType: document.getElementById('bloodType').value,
        units: document.getElementById('units').value,
        contactEmail: document.getElementById('email').value,
      };

      fetch(backendEndpoint, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            alert('Blood Request Failed!');
          } else {
            console.log('Blood Request is sucessful:', data);
            // donorInfo = data.donorInfo;
          }
        })
        .catch(error => {
          console.error('Error requesting blood:', error);
        });
  }