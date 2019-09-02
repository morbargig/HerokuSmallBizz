// import React from 'react';
import React, { Component } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {GoogleMap } from 'react-google-maps'
class Maps extends Component {
  constructor() {
    super()
  }
  render() {
    return <GoogleMap defaultZoom={10}
      defaultCenter={{ lat: 45.421532, lng: -75.697189 }} />
  }
}
export default Maps;