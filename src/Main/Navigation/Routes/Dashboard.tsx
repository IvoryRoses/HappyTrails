import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import { Icon } from "leaflet";
const apiKey = "5b3ce3597851110001cf624847b902f1b415417ba738563c66a1cff4";

export default function Dashboard() {
  // Define the type for markers
  type MarkerType = {
    id: string;
    geocode: [number, number]; // explicitly a tuple with two elements
    popUp: string;
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#a3cb8f";
  }, []);

  // State to hold the markers, starting with an empty array
  const [markers, setMarkers] = useState<MarkerType[]>([]);

  // State to hold the route coordinates
  const [route, setRoute] = useState<[number, number][]>([]);

  // Custom icon for the markers
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/149/149059.png",
    iconSize: [38, 38],
  });

  // Function to generate a unique ID for each marker
  const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

  // Component to handle map clicks
  function AddMarkerOnClick() {
    useMapEvents({
      click: async (e) => {
        if (markers.length < 1) {
          const newMarker = {
            id: generateId(),
            geocode: [e.latlng.lat, e.latlng.lng],
            popUp: `Starting at ${e.latlng.lat.toFixed(
              2
            )}, ${e.latlng.lng.toFixed(2)}`,
          };
          setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

          // Correctly assigning the latitude and longitude values to the variables
          let initLat = e.latlng.lat;
          let initLng = e.latlng.lng;
          console.log("latitude:", initLat);
          console.log("longitude:", initLng);

          // Construct the API URL
          const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;

          try {
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: apiKey,
              },
              body: JSON.stringify({
                coordinates: [
                  [initLng, initLat],
                  [121.37, 14.24],
                ],
              }),
            });
            const data = await response.json();
            console.log("Openrouteservice API response:", data);

            if (data.features && data.features.length > 0) {
              const routeCoordinates =
                data.features[0].geometry.coordinates.map(
                  (coord: [number, number]) => [coord[1], coord[0]]
                );
              setRoute(routeCoordinates);
            }
          } catch (error) {
            console.error("Error fetching directions:", error);
          }
        }
      },
    });
    return null;
  }

  // Function to handle the deletion of a marker
  const deleteMarker = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker) => marker.id !== id)
    );
  };

  return (
    <>
      <div className="page-content dashboardMain">
        <MapContainer className="map" center={[14.1407, 121.4692]} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {markers.map((marker: MarkerType) => (
            <Marker key={marker.id} position={marker.geocode} icon={customIcon}>
              <Popup>
                {marker.popUp}
                <br />
                <button onClick={(e) => deleteMarker(marker.id, e)}>
                  Delete
                </button>
              </Popup>
            </Marker>
          ))}

          {route.length > 0 && <Polyline positions={route} color="blue" />}

          <AddMarkerOnClick />
        </MapContainer>
      </div>
    </>
  );
}
