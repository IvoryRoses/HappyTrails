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
import presetLocations from "../../Data/locations.json";

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

  // State to hold the route length
  const [routeLength, setRouteLength] = useState<number | null>(null);

  // State to hold the user input location
  const [inputLocation, setInputLocation] = useState<string>("");

  // State to hold the selected preset location
  const [selectedPresetLocation, setSelectedPresetLocation] =
    useState<string>("");

  // Custom icon for the markers
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/149/149059.png",
    iconSize: [38, 38],
  });

  // Function to generate a unique ID for each marker
  const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

  // Function to handle geocoding of user input location
  const geocodeLocation = async () => {
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(
          inputLocation
        )}`
      );
      const data = await response.json();
      console.log("Geocoding API response:", data);

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        const newMarker = {
          id: generateId(),
          geocode: [lat, lng],
          popUp: `Starting at ${lat.toFixed(2)}, ${lng.toFixed(2)}`,
        };
        setMarkers([newMarker]);
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  };

  // Function to handle preset location selection
  const handlePresetLocationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLocation = presetLocations.find(
      (loc) => loc.name === e.target.value
    );
    if (selectedLocation) {
      setMarkers([
        {
          id: generateId(),
          geocode: selectedLocation.coordinates,
          popUp: `Starting at ${selectedLocation.coordinates[0].toFixed(
            2
          )}, ${selectedLocation.coordinates[1].toFixed(2)}`,
        },
      ]);
      setInputLocation(""); // clear input location
    }
    setSelectedPresetLocation(e.target.value);
  };

  // Component to handle map clicks
  function AddMarkerOnClick() {
    useMapEvents({
      click: (e) => {
        const newMarker = {
          id: generateId(),
          geocode: [e.latlng.lat, e.latlng.lng],
          popUp: `Starting at ${e.latlng.lat.toFixed(
            2
          )}, ${e.latlng.lng.toFixed(2)}`,
        };
        setMarkers([newMarker]);
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

  // Function to fetch the route
  const fetchRoute = async () => {
    if (markers.length > 0) {
      try {
        const markerLocation = markers[0].geocode;
        console.log("Marker location:", markerLocation);

        // Define the fixed destination point
        const destinationPoint = [14.3195223, 121.4757249];

        // Construct the API URL
        const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: apiKey,
          },
          body: JSON.stringify({
            coordinates: [
              [markerLocation[1], markerLocation[0]],
              [destinationPoint[1], destinationPoint[0]],
            ],
          }),
        });
        const data = await response.json();
        console.log("Openrouteservice API response:", data);

        if (data.features && data.features.length > 0) {
          const routeCoordinates = data.features[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]]
          );
          setRoute(routeCoordinates);

          // Calculate the route length
          const routeLengthInMeters =
            data.features[0].properties.segments.reduce(
              (total: number, segment: any) => total + segment.distance,
              0
            );
          setRouteLength(routeLengthInMeters / 1000); // Convert to kilometers
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    }
  };

  // Function to clear the route and remove the marker
  const clearRouteAndMarker = () => {
    setMarkers([]);
    setRoute([]);
    setRouteLength(null);
    setSelectedPresetLocation(""); // clear selected preset location
  };

  return (
    <>
      <div className="page-content dashboardMain">
        <input
          type="text"
          value={inputLocation}
          onChange={(e) => setInputLocation(e.target.value)}
          placeholder="Enter your location"
          className="location-input"
        />
        <button className="geocode-button" onClick={geocodeLocation}>
          Geocode Location
        </button>
        <select
          value={selectedPresetLocation}
          onChange={handlePresetLocationChange}
          className="preset-location-dropdown"
        >
          <option value="" disabled>
            Select a preset location
          </option>
          {presetLocations.map((loc) => (
            <option key={loc.name} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
        <button className="trip-start-button" onClick={fetchRoute}>
          Start Trip
        </button>
        <button className="clear-route-button" onClick={clearRouteAndMarker}>
          Clear Route
        </button>
        {routeLength !== null && (
          <div className="route-length">
            Trip Length: {routeLength.toFixed(2)} km
          </div>
        )}
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
