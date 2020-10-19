import React from 'react'
import { Map as LeafletMap, TileLayer, Popup, Marker } from 'react-leaflet';
import { showDataOnMap } from './util';
import { useEffect } from 'react';
import './css/Map.css'
import L from 'leaflet';

const markerIcon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    // specify the path here
    iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
  });

function Map({countries, country, casesType, center, zoom}) {

    return (
        <div className="Map" id="worldMap">
            
            <LeafletMap center={center} zoom={zoom} minZoom={2} worldCopyJump={true}>
                        
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                { center[0] != 34.80746 && <Marker position={center} icon={markerIcon}/>}
                
                {showDataOnMap(countries, casesType)}

            </LeafletMap>
            
        </div>
    )
}

export default Map;
