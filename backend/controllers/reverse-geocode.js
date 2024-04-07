const express = require('express')
const axios = require('axios')
require('dotenv').config()


const reverseGeoCode = async (req, res) => {

    // Frontend post request which provides used coords
    const { latitude, longitude } = req.body
    const googleApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.MAPS_API_KEY}`;
    // Get request for reversed geocode data from google geocode API
    try {
        const response = await axios.get(googleApiUrl);
        const data = response.data 
        // console.log(data)
        
    }
    catch (err) {
        console.log(err)
    }
    // Extract needed data from response 
    const locationData = {}
    // Consider changing to only looking at the first results array if consistently provides all required data 
    for (let result of response.data.results) {
        for (let component of result.address_components) {
            if (component.types.includes('neighborhood')) {
                locationData.neighborhood = component.long_name
            }
            else if (component.types.includes('postal_code')) {
                locationData.zipcode = component.long_name
            }
            else if (component.types.includes('locality')) {
                locationData.city = component.long_name
            }
            else if (component.types.includes('administrative_area_level_1')) {
                locationData.state = component.long_name
            }
            else if (component.types.includes('administrative_area_level_2')) {
                locationData.county = component.long_name
            }
            else if (component.types.includes('country')) {
                country = component.long_name
            }
        }
        if ( location.neighborhood && locationData.county && locationData.state && locationData.city && locationData.zipcode) {
            break
        }
            
    }
    console.log(locationData)
    res.status(200).json(locationData)
   
}

module.exports = reverseGeoCode