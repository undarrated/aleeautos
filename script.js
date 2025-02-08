// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA_FAJySouf9bfws2yuqFrD2ibFaWIeMEs",
  authDomain: "aleeautos-ad65a.firebaseapp.com",
  databaseURL: "https://aleeautos-ad65a-default-rtdb.firebaseio.com",
  projectId: "aleeautos-ad65a",
  storageBucket: "aleeautos-ad65a.appspot.com",
  messagingSenderId: "953793922856",
  appId: "1:953793922856:web:e2c61b44489855b7b9f21d",
  measurementId: "G-JW2P5LX0B8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {
    const typeSelect = document.getElementById("typeSelect");
    const makeSelect = document.getElementById("makeSelect");
    const modelSelect = document.getElementById("modelSelect");
    const searchButton = document.getElementById("searchButton");
    const resultsContainer = document.getElementById("results");

    let carData = [];

    async function fetchCarData() {
        const carsRef = ref(db, "cars");
        const snapshot = await get(carsRef);

        if (snapshot.exists()) {
            carData = Object.entries(snapshot.val()).map(([id, car]) => ({ id, ...car }));
            populateMakes();
        } else {
            console.log("No car data found.");
        }
    }

    function populateMakes() {
        const makes = [...new Set(carData.map(car => car.make))];
        makeSelect.innerHTML = '<option value="">Select Make</option>';
        makes.forEach(make => {
            const option = document.createElement("option");
            option.value = make;
            option.textContent = make;
            makeSelect.appendChild(option);
        });
    }

    function populateModels() {
        const selectedMake = makeSelect.value;
        modelSelect.innerHTML = '<option value="">Select Model</option>';
        if (selectedMake) {
            const models = [...new Set(carData.filter(car => car.make === selectedMake).map(car => car.model))];
            models.forEach(model => {
                const option = document.createElement("option");
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        }
    }

    function searchCars() {
        const selectedType = typeSelect.value;
        const selectedMake = makeSelect.value;
        const selectedModel = modelSelect.value;

        let filteredCars = carData;

        if (selectedType && selectedType !== "New/Used") {
            filteredCars = filteredCars.filter(car => car.type === selectedType);
        }
        if (selectedMake) {
            filteredCars = filteredCars.filter(car => car.make === selectedMake);
        }
        if (selectedModel) {
            filteredCars = filteredCars.filter(car => car.model === selectedModel);
        }

        displayResults(filteredCars);
    }

    function displayResults(cars) {
        resultsContainer.innerHTML = "";
        if (cars.length === 0) {
            resultsContainer.innerHTML = "<p>No cars found.</p>";
        } else {
            cars.forEach(car => {
                const carItem = document.createElement("div");
                carItem.className = "car-item";

                // Create a clickable link with image
                const carLink = document.createElement("a");
                carLink.href = `car-details.html?id=${car.id}`;
                carLink.style.textDecoration = "none";
                carLink.style.color = "black";

                const carImage = document.createElement("img");
                carImage.src = car.image;
                carImage.style.width = "100px";
                carImage.style.height = "auto";
                carImage.style.display = "block";

                const carText = document.createElement("span");
                carText.textContent = `${car.type} ${car.make} ${car.model} (${car.year})`;

                carLink.appendChild(carImage);
                carLink.appendChild(carText);
                carItem.appendChild(carLink);
                resultsContainer.appendChild(carItem);
            });
        }
    }

    fetchCarData();
    makeSelect.addEventListener("change", populateModels);
    searchButton.addEventListener("click", searchCars);
});
