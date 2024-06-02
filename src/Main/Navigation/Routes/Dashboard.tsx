import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
  useMap,
} from "react-leaflet";
import { Icon, popup } from "leaflet";
import L from "leaflet";
import presetLocations from "../../Data/locations.json";

const apiKey = "5b3ce3597851110001cf624847b902f1b415417ba738563c66a1cff4";

export default function Dashboard() {
  // Define the type for markers
  type MarkerType = {
    id: string;
    geocode: [number, number]; // explicitly a tuple with two elements
    popUp: string;
    type: string;
    budget: string;
  };

  const preferenceMarker = presetLocations.map((location) => ({
    geocode: location.coordinates,
    popUp: location.name + " " + location.type,
    type: location.type,
    budget: location.budget,
  }));

  useEffect(() => {
    document.body.style.backgroundColor = "#a3cb8f";
  }, []);

  // State to hold the markers, starting with an empty array
  const [markers, setMarkers] = useState<MarkerType[]>([]);

  // State to hold the route coordinates
  const [route, setRoute] = useState<[number, number][]>([]);

  // State to hold the route length
  const [routeLength, setRouteLength] = useState<number | null>(0);

  // State to hold the user input location
  const [inputLocation, setInputLocation] = useState<string>("");

  // State to hold the selected preset location
  const [selectedPresetLocation, setSelectedPresetLocation] =
    useState<string>("");

  // State to track GPS activation
  const [useGPS, setUseGPS] = useState<boolean>(false);

  // State to manage selected types
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // State to manage selected budgets
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);

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
          type: selectedLocation.type,
          budget: selectedLocation.budget,
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
          type: "",
          budget: "",
        };
        setMarkers([newMarker]);
      },
    });
    return null;
  }

  // Component to handle GPS location
  function GPSLocationHandler() {
    const map = useMap();

    useEffect(() => {
      if (useGPS) {
        map.locate({ setView: true, watch: true });
        map.on("locationfound", handleLocationFound);
      }

      return () => {
        map.off("locationfound", handleLocationFound);
      };
    }, [useGPS]);

    const handleLocationFound = (e) => {
      const { lat, lng } = e.latlng;
      const radius = e.accuracy;

      L.marker([lat, lng]).addTo(map).bindPopup("You are here").openPopup();
      L.circle([lat, lng], radius).addTo(map);

      // Add the GPS location as a marker
      const newMarker = {
        id: generateId(),
        geocode: [lat, lng],
        popUp: `Starting at ${lat.toFixed(2)}, ${lng.toFixed(2)}`,
      };
      setMarkers([newMarker]);
      setUseGPS(false); // Stop watching location after finding it
    };

    return null;
  }

  // Function to handle the deletion of a marker
  const deleteMarker = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker) => marker.id !== id)
    );
  };

  const handleStartTripClick = async (preferenceMarker: MarkerType) => {
    if (markers.length === 0) {
      console.error("User marker not found");
      return;
    }

    const userMarker = markers[0]; // Assuming user marker is always the first one

    try {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({
          coordinates: [
            [userMarker.geocode[1], userMarker.geocode[0]], // User marker coordinates
            [preferenceMarker.geocode[1], preferenceMarker.geocode[0]], // Clicked preference marker coordinates
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
        const routeLengthInMeters = data.features[0].properties.segments.reduce(
          (total: number, segment: any) => total + segment.distance,
          0
        );
        setRouteLength(routeLengthInMeters / 1000); // Convert to kilometers
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  // Function to clear the route and remove the marker
  const clearRouteAndMarker = () => {
    setMarkers([]);
    setRoute([]);
    setRouteLength(0);
    setSelectedPresetLocation(""); // clear selected preset location
    setUseGPS(false);
  };

  const Checkbox = ({ label, value, onChange }) => {
    return (
      <label>
        <input type="checkbox" checked={value} onChange={onChange} />
        {label}
      </label>
    );
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prevSelectedTypes) =>
      prevSelectedTypes.includes(type)
        ? prevSelectedTypes.filter((t) => t !== type)
        : [...prevSelectedTypes, type]
    );
  };

  const handleBudgetChange = (budget: string) => {
    setSelectedBudgets((prevSelectedBudgets) =>
      prevSelectedBudgets.includes(budget)
        ? prevSelectedBudgets.filter((b) => b !== budget)
        : [...prevSelectedBudgets, budget]
    );
  };

  const filteredMarkers = preferenceMarker.filter((marker) => {
    const typeMatch =
      selectedTypes.length === 0 || selectedTypes.includes(marker.type);
    const budgetMatch =
      selectedBudgets.length === 0 || selectedBudgets.includes(marker.budget);
    return typeMatch && budgetMatch;
  });

  return (
    <>
      <div className="page-content dashboardMain">
        <input
          type="text"
          value={inputLocation}
          onChange={(e) => setInputLocation(e.target.value)}
          placeholder="Enter your current location"
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
        {/* <button className="trip-start-button" onClick={fetchRoute}>
          Start Trip
        </button> */}
        <button className="clear-route-button" onClick={clearRouteAndMarker}>
          Clear Route
        </button>
        <button className="GPS" onClick={() => setUseGPS(true)}>
          Use GPS
        </button>
        <div className="reference-panel">
          <h1>Preference</h1>
          <Checkbox
            label="Food"
            value={selectedTypes.includes("Food")}
            onChange={() => handleTypeChange("Food")}
          />
          <Checkbox
            label="Nature"
            value={selectedTypes.includes("Nature")}
            onChange={() => handleTypeChange("Nature")}
          />
          <Checkbox
            label="Historical"
            value={selectedTypes.includes("Historical")}
            onChange={() => handleTypeChange("Historical")}
          />
          <Checkbox
            label="Entertainment"
            value={selectedTypes.includes("Entertainment")}
            onChange={() => handleTypeChange("Entertainment")}
          />
          <h1>Budget</h1>
          <Checkbox
            label="Low"
            value={selectedBudgets.includes("Low")}
            onChange={() => handleBudgetChange("Low")}
          />
          <Checkbox
            label="Mid"
            value={selectedBudgets.includes("Mid")}
            onChange={() => handleBudgetChange("Mid")}
          />
          <Checkbox
            label="High"
            value={selectedBudgets.includes("High")}
            onChange={() => handleBudgetChange("High")}
          />
        </div>
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

          {filteredMarkers.map((marker) => (
            <Marker key={marker.geocode.join(",")} position={marker.geocode}>
              <Popup>
                {marker.popUp}
                <button onClick={() => handleStartTripClick(marker)}>
                  Start trip
                </button>
              </Popup>
            </Marker>
          ))}

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
          <GPSLocationHandler />
        </MapContainer>
      </div>
    </>
  );
}
