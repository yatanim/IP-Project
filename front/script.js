document.getElementById('submit').addEventListener('click', async () => {
    const start = document.getElementById('departure').value;
    const end = document.getElementById('destination').value;
    console.log(start,end);
    // Fetch fare information from backend
    const fareResponse = await fetch('http://localhost:7000/getFare', { // Update the URL with your backend URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from: start, to: end })
    });

    if (fareResponse.ok) {
        const fareData = await fareResponse.json();
        console.log('Fare data:', fareData); // Debugging log
        // Update UI with fare information
        updateFareUI(fareData);
    } else {
        console.error('Failed to fetch fare information');
    }

    // Continue with calculating and displaying route
    calculateAndDisplayRoute();
});

// Function to update UI with fare information
const updateFareUI = (fareData) => {
    if (fareData) {
        const busFare = fareData.bus;
        const cngFare = fareData.cng;
        console.log(`Bus Fare: ${busFare}, CNG Fare: ${cngFare}`); // Debugging log
        // Update UI elements with bus and cng fares
        document.getElementById('busFare').innerText = 'Bus Fare: ' + busFare;
        document.getElementById('cngFare').innerText = 'CNG Fare: ' + cngFare;
    } else {
        document.getElementById('busFare').innerText = 'No fare information available';
        document.getElementById('cngFare').innerText = '';
    }
};

let map, directionsService, directionsDisplay;
let startAutocomplete, endAutocomplete;

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 14
    });
    directionsDisplay.setMap(map);

    startAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('departure'));
    endAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('destination'));
}

function calculateAndDisplayRoute() {
    const start = document.getElementById('departure').value;
    const end = document.getElementById('destination').value;

    directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    }, (response, status) => {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            // Calculate and display distance
            const route = response.routes[0];
            const distance = route.legs[0].distance.text;
            document.getElementById('distance').innerText = 'Distance: ' + distance;
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
