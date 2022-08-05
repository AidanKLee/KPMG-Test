import L from 'leaflet';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faMagnifyingGlassPlus, faMagnifyingGlassMinus } from '@fortawesome/free-solid-svg-icons';
import { Icon } from 'leaflet';
import { useEffect, useMemo } from 'react';

const Map = props => {

    const { 
        companies,
        handleToggleMenu,
        mapRef
    } = useMemo(() => props, [props]);

    return (
        <div id="map" ref={ mapRef }>
            <MapContainer
                center={[51.505, -0.09]}
                maxBounds={[[-90, -180], [90, 180]]}
                maxBoundsViscosity={1}
                minZoom={2}
                zoom={3} 
                zoomControl={false}
                >
                <Controls handleToggleMenu={ handleToggleMenu }/>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Companies data={ companies } />
            </MapContainer>
        </div>
    )

}

const Companies = props => {

    const { data } = props;

    const map = useMap();

    useEffect(() => {

        const markers = L.markerClusterGroup();
        data.forEach(company => {
            
            const { latitude: lat, longitude: lng } = company.location;
            
            const {
                address,
                company: name,
                // fees,
                // id,
                // sector,
                // stockSymbol
            } = company;

            const marker = L.marker([lat, lng], {
                icon: new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})
            });

            const popup = L.popup()
                .setLatLng([lat, lng])
                .setContent(
                    `
                    <p class="title">${name}</p>
                    <p>${address}</p>
                    `
                )

            marker.bindPopup(popup);
        
            markers.addLayer(marker);
        })

        map.addLayer(markers);

    }, [data, map])

}

const Controls = props => {

    const map = useMap();

    const { handleToggleMenu } = useMemo(() => props, [props]);
    
    return (
        <div id="controls">

          <Button 
            className='p-2 rounded-pill btn-light border' variant="primary"
            onClick={() => map.zoomIn()}
            >
            <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
          </Button>

          <Button
            className='p-2 rounded-pill btn-light border' variant="primary"
            onClick={() => map.zoomOut()}
            >
            <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
          </Button>

          <Button
            className='p-2 rounded-pill border' variant="primary"
            onClick={() => handleToggleMenu()}
            >
            <FontAwesomeIcon icon={faTableList} />
          </Button>

        </div>
    )
}

export default Map;