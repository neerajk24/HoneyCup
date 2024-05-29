// src/utils/geolocation.js
import axios from 'axios';

const AZURE_MAPS_API_KEY = '8GVwJf6Ra91GPhoM1Txx6d0JIu1jb8MM0RcvzZGlZ7ybGGyRInK8JQQJ99AEACYeBjF59nzlAAAgAZMPCGoI'; // Your primary key

export async function getCurrentLocation() {
    try {
        const response = await axios.get('https://atlas.microsoft.com/geolocation/ip/json', {
            params: {
                'subscription-key': AZURE_MAPS_API_KEY
            },
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'axios/1.7.2'
            }
        });
        const { location } = response.data;
        const { lat, lon } = location;
        return [lon, lat];
    } catch (error) {
        console.error('Error getting current location:', error.response ? error.response.data : error.message);
        // Handle error gracefully, e.g., return a default location
        return [0, 0]; // Return default location or handle error as needed
    }
}


// import axios from 'axios';

// const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your Google Maps API key

// export async function getCurrentLocation() {
//     try {
//         const response = await axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_MAPS_API_KEY}`, {
//             considerIp: true, // Use the IP address of the requesting client
//             // Optionally, you can add wifiAccessPoints and cellTowers data here if available
//         });

//         const { location } = response.data;
//         const { lat, lng } = location;
//         return [lng, lat];
//     } catch (error) {
//         console.error('Error getting current location:', error.response ? error.response.data : error.message);
//         // Handle error gracefully, e.g., return a default location
//         return [0, 0]; // Return default location or handle error as needed
//     }
// }
