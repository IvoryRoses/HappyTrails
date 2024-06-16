import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
  useMap,
} from "react-leaflet";
import { Icon, LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import presetLocations from "../../Data/locations.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../../../firebase";

import { fs } from "../../../firebase";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

import MarkerImages from "../../Data/markerImages";
import FoodMarker from "../Assets/Food_Marker.png";
import NatureMarker from "../Assets/Nature_Marker.png";
import HistoricalMarker from "../Assets/Historical_Marker.png";
import EntertainmentMarker from "../Assets/Entertainment_Marker.png";
import UserMarker from "../Assets/User_Marker.png";
import { TiArrowBack, TiArrowForward } from "react-icons/ti";

const apiKey = "5b3ce3597851110001cf624847b902f1b415417ba738563c66a1cff4";

export default function Dashboard() {
  // Define the type for markers
  type MarkerType = {
    id: string;
    geocode: [number, number]; // explicitly a tuple with two elements
    popUp: string;
    type?: string;
    budget?: string;
    name?: string;
    image?: string;
  };

  type MarkerImagesType = { [key: string]: any };

  const preferenceMarker = presetLocations.map((location) => ({
    geocode: location.coordinates,
    type: location.type,
    budget: location.budget,
    name: location.name,
    image: (MarkerImages as MarkerImagesType)[location.name],
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

  const [priceRange, setPriceRange] = useState<number>(0);

  // State to manage selected budgets
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);

  const [showConfirmationForm, setShowConfirmationForm] =
    useState<boolean>(false);
  const [clickEvent, setClickEvent] = useState<LeafletMouseEvent | null>(null);

  const [historyPopup, setHistoryPopup] = useState(false);

  const mapRef = useRef<L.Map | null>(null);

  // Custom icon for the markers
  const customIcon = new Icon({
    iconUrl: UserMarker,
    iconSize: [55, 55],
    iconAnchor: [27.5, 55],
  });

  const foodIcon = new Icon({
    iconUrl: FoodMarker,
    iconSize: [55, 55],
  });

  const natureIcon = new Icon({
    iconUrl: NatureMarker,
    iconSize: [55, 55],
  });

  const historicalIcon = new Icon({
    iconUrl: HistoricalMarker,
    iconSize: [55, 55],
  });

  const entertainmentIcon = new Icon({
    iconUrl: EntertainmentMarker,
    iconSize: [55, 55],
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
        const [lng, lat] = data.features[0].geometry.coordinates as [
          number,
          number
        ];
        const newMarker: MarkerType = {
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
          geocode: selectedLocation.coordinates as [number, number],
          popUp: `Starting at ${
            selectedLocation?.coordinates?.[0].toFixed(2) as string
          }, ${selectedLocation?.coordinates?.[1].toFixed(2) as string}`,
          type: selectedLocation.type,
          budget: selectedLocation.budget,
          image: (MarkerImages as MarkerImagesType)[
            selectedLocation.name
          ] as string,
        },
      ]);
      setInputLocation(""); // clear input location
    }
    setSelectedPresetLocation(e.target.value);
  };

  //back to laguna
  const handleBackToLagunaClick = () => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([14.27, 121.46], 12);
    }
  };

  // Component to handle map clicks
  function AddMarkerOnClick() {
    useMapEvents({
      click: (e) => {
        setShowConfirmationForm(true);
        setClickEvent(e); // Set the click event
      },
    });
    return null;
  }

  const handleConfirmAddMarker = () => {
    if (clickEvent) {
      const { lat, lng } = clickEvent.latlng; // Access latlng from clickEvent
      const newMarker: MarkerType = {
        id: generateId(),
        geocode: [lat, lng],
        popUp: `Starting at ${lat.toFixed(2)}, ${lng.toFixed(2)}`,
      };
      setMarkers([newMarker]);
      setShowConfirmationForm(false);
      setRoute([]);
    }
  };

  const handleCancelAddMarker = () => {
    setShowConfirmationForm(false);
  };

  const ConfirmationPopup = () => {
    return (
      <div className="confirm-overlay">
        <div className="confirm-form">
          <text style={{ color: "#ded2aa", fontSize: "1.4rem" }}>
            Do you want to place a pin?
          </text>
          <div className="confirm-choice">
            <button
              className="confirm-button "
              onClick={handleConfirmAddMarker}
            >
              Yes
            </button>
            <button className="cancel-button" onClick={handleCancelAddMarker}>
              No
            </button>
          </div>
        </div>
      </div>
    );
  };

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

    const handleLocationFound = (e: any) => {
      const { lat, lng } = e.latlng;
      const radius = e.accuracy;

      L.circle([lat, lng], radius).addTo(map);

      // Add the GPS location as a marker
      const newMarker: any = {
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
      toast.error("Please add a start marker on the map first.", {
        autoClose: 3000,
      });
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
            [preferenceMarker.geocode[1], preferenceMarker.geocode[0]], // Preference marker coordinates
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        if (
          data &&
          data.features &&
          data.features.length > 0 &&
          data.features[0].geometry &&
          data.features[0].geometry.coordinates
        ) {
          const routeCoordinates = data.features[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]]
          );
          const routeDistance =
            data.features[0].properties.segments[0].distance;
          setRoute(routeCoordinates);
          setRouteLength(routeDistance / 1000);

          // Save trip information to Firestore
          const currentUser = auth.currentUser;
          if (currentUser) {
            const tripData = {
              locationName: preferenceMarker.name,
              timestamp: new Date().toISOString(),
            };
            await setDoc(
              doc(fs, "users", currentUser.uid, "tripHistory", generateId()),
              tripData
            );
          } else {
            console.error("No user logged in!");
          }
        } else {
          console.error("Invalid route data:", data);
          setRoute([]);
          setRouteLength(0);
        }
      } else {
        if (response.status === 404) {
          toast.error("Location is offroad, please try somewhere else.", {
            autoClose: 3000,
          });
        }
        console.error("Error fetching route data:", response.status);
        setRoute([]);
        setRouteLength(0);
      }
    } catch (error) {
      console.error("Error fetching route data:", error);
      setRoute([]);
      setRouteLength(0);
    }
  };

  // Function to clear the route and remove the marker
  const clearRouteAndMarker = () => {
    setMarkers([]);
    setRoute([]);
    setRouteLength(0);
    setSelectedPresetLocation(""); // clear selected preset location
    setUseGPS(false);
    setSelectedBudgets([]);
    const map = mapRef.current;
    if (map) {
      map.eachLayer((layer) => {
        if (
          layer instanceof L.Circle &&
          layer.options.className === "gps-circle"
        ) {
          map.removeLayer(layer);
        }
      });
    }
  };

  function Checkbox({ label, value, onChange }: any) {
    return (
      <div className="checkbox-wrapper-5">
        <div className="check">
          <input
            id={label}
            type="checkbox"
            checked={value}
            onChange={onChange}
          />
          <label htmlFor={label}></label>
        </div>
        <label htmlFor={label}>{label}</label>
      </div>
    );
  }

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prevSelectedTypes) =>
      prevSelectedTypes.includes(type)
        ? prevSelectedTypes.filter((t) => t !== type)
        : [...prevSelectedTypes, type]
    );
  };

  const handleHistoryPopup = () => {
    setHistoryPopup(!historyPopup);
  };

  const handlePriceRangeChange = (inputValue: number) => {
    // Update price range state
    setPriceRange(inputValue);

    // Update selected budgets based on price range
    if (inputValue < 500) {
      setSelectedBudgets(["Low"]);
    } else if (inputValue >= 501 && inputValue <= 999) {
      setSelectedBudgets(["Mid"]);
    } else if (inputValue >= 1000) {
      setSelectedBudgets(["High"]);
    } else {
      setSelectedBudgets([]); // Clear selected budgets if no valid range is selected
    }
  };

  const clearPrice = () => {
    setSelectedBudgets([]);
    setPriceRange(Number(0));
  };

  const filteredMarkers = preferenceMarker.filter((marker) => {
    const typeMatch =
      selectedTypes.length === 0 ||
      selectedTypes.includes(marker.type as string);
    const budgetMatch =
      selectedBudgets.length === 0 ||
      selectedBudgets.includes(marker.budget as string);
    return typeMatch && budgetMatch;
  });

  return (
    <>
      <div className="dashboard-main">
        <div className="button-container">
          <input
            type="text"
            value={inputLocation}
            onChange={(e) => setInputLocation(e.target.value)}
            placeholder="Enter your current location"
            className="location-input"
          />
          <button className="geocode-button" onClick={geocodeLocation}>
            Search Location
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
          <button className="clear-route-button" onClick={clearRouteAndMarker}>
            Clear Route
          </button>
          <button className="GPS" onClick={() => setUseGPS(true)}>
            Use GPS
          </button>
          <button className="GPS" onClick={handleBackToLagunaClick}>
            Back to Laguna
          </button>
          <button className="GPS" onClick={handleHistoryPopup}>
            History
          </button>
          {historyPopup && (
            <HistoryPopup handleClose={handleHistoryPopup} mapRef={mapRef} />
          )}
          {routeLength !== null && (
            <div className="route-length">
              Trip Length: {routeLength.toFixed(2)} km
            </div>
          )}
        </div>

        <div className="preference-panel">
          <h1>Preference</h1>
          <div className="check-icon">
            <img src={FoodMarker} className="pref-icon" />
            <Checkbox
              label="Food"
              value={selectedTypes.includes("Food")}
              onChange={() => handleTypeChange("Food")}
            />
          </div>
          <div className="check-icon">
            <img src={NatureMarker} className="pref-icon" />
            <Checkbox
              label="Nature"
              value={selectedTypes.includes("Nature")}
              onChange={() => handleTypeChange("Nature")}
            />
          </div>
          <div className="check-icon">
            <img src={HistoricalMarker} className="pref-icon" />
            <Checkbox
              label="Historical"
              value={selectedTypes.includes("Historical")}
              onChange={() => handleTypeChange("Historical")}
            />
          </div>
          <div className="check-icon">
            <img src={EntertainmentMarker} className="pref-icon" />
            <Checkbox
              label="Entertainment"
              value={selectedTypes.includes("Entertainment")}
              onChange={() => handleTypeChange("Entertainment")}
            />
          </div>
          <h1>Budget</h1>
          <input
            className="price-input"
            type="number"
            placeholder="Enter price range: e.g., 1000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
          />
          <div className="price-button-container">
            <button
              onClick={() => handlePriceRangeChange(priceRange as number)}
            >
              Enter
            </button>
            <button onClick={() => clearPrice()}>Clear</button>
          </div>
        </div>

        <div style={{ height: "100%" }}>
          <MapContainer
            className="dashboard-map"
            center={[14.27, 121.46]}
            zoom={12}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredMarkers.map((marker: any) => {
              // Determine the appropriate icon based on marker type
              let icon;
              switch (marker.type) {
                case "Food":
                  icon = foodIcon;
                  break;
                case "Nature":
                  icon = natureIcon;
                  break;
                case "Historical":
                  icon = historicalIcon;
                  break;
                case "Entertainment":
                  icon = entertainmentIcon;
                  break;
                default:
                  icon = customIcon;
              }

              // Check if marker.geocode is defined before attempting to join
              if (!marker.geocode) {
                console.error("Marker geocode is undefined", marker);
                return null;
              }

              return (
                <Marker
                  key={marker.geocode.join(",")}
                  position={marker.geocode as [number, number]}
                  icon={icon}
                >
                  <Popup>
                    <div className="popup-display">
                      <img
                        src={marker.image}
                        style={{
                          width: "180px", //made this wider from 150
                          height: "150px",
                          marginBottom: "10px",
                        }}
                      />
                      <span className="marker-name">{marker.name}</span>
                      <button
                        className="popup-button"
                        onClick={() => handleStartTripClick(marker)}
                      >
                        Start trip
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {markers.map((marker: MarkerType) => (
              <Marker
                key={marker.id}
                position={marker.geocode}
                icon={customIcon}
              >
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
        {showConfirmationForm && <ConfirmationPopup />}
        <ToastContainer position="top-center" className="dashboard-toast" />
      </div>
    </>
  );
}

interface HistoryPopupProps {
  handleClose: () => void;
  mapRef: React.MutableRefObject<L.Map | null>; // Adjust the type as per your useRef declaration
}

//History Popup Container
const HistoryPopup: React.FC<HistoryPopupProps> = ({ handleClose, mapRef }) => {
  const [tripHistory, setTripHistory] = useState<
    { locationName: string; timestamp: string }[]
  >([]);

  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 10;

  const currentUser = auth.currentUser;

  const handleRevisit = (locationName: string) => {
    const location = presetLocations.find((loc) => loc.name === locationName);

    if (location && mapRef.current) {
      handleClose();
      const [lat, lng] = location.coordinates;
      mapRef.current.flyTo([lat, lng], 15); // Adjust zoom level as needed
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  useEffect(() => {
    const fetchTripHistory = async () => {
      // Ensure currentUser is not null before fetching trip history
      if (currentUser) {
        const querySnapshot = await getDocs(
          collection(fs, "users", currentUser.uid, "tripHistory")
        );
        const trips: { locationName: string; timestamp: string }[] = [];
        querySnapshot.forEach((doc) => {
          trips.push(doc.data() as { locationName: string; timestamp: string });
        });
        setTripHistory(trips);
      }
    };

    if (currentUser) {
      fetchTripHistory();
    }
  }, []);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const startIndex = (currentPage - 1) * tripsPerPage;
  const currentTrips = tripHistory
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(startIndex, startIndex + tripsPerPage);

  return (
    <div className="history-popup" onClick={handleOutsideClick}>
      <div className="history-container">
        <p className="account-profile-header" style={{ textAlign: "center" }}>
          History
        </p>
        <div
          className="category-history"
          style={{ backgroundColor: "#b98f68" }}
        >
          <p>Name</p>
          <p>Time & Date </p>
          <p>Revisit</p>
        </div>
        <div id="dashboard-history" className="dashbaord-history">
          {tripHistory.length === 0 ? (
            <p>No Past Trip Recorded.</p>
          ) : (
            <ul>
              {currentTrips.map((trip, index) => (
                <li key={index} className="trip-item">
                  <div className="trip-name">{trip.locationName}</div>
                  <div className="trip-tripstamp">
                    {new Date(trip.timestamp).toLocaleString()}
                  </div>
                  <div className="trip-action">
                    <button onClick={() => handleRevisit(trip.locationName)}>
                      Revisit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {tripHistory.length > tripsPerPage && (
          <div className="pagination">
            <button onClick={handlePrevPage}>
              <TiArrowBack className="react-icon" />
            </button>
            <div style={{ alignContent: "center" }}>{currentPage}</div>
            <button onClick={handleNextPage}>
              <TiArrowForward className="react-icon" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
