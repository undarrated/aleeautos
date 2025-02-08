document.addEventListener("DOMContentLoaded", function () {
    const typeSelect = document.getElementById("typeSelect");
    const makeSelect = document.getElementById("makeSelect");
    const modelSelect = document.getElementById("modelSelect");
    const searchButton = document.getElementById("searchButton");
    const resultsContainer = document.getElementById("results");

    let carData = [];

    // Disable search button until data loads
    searchButton.disabled = true;

    // Fetch car data from Firebase
    async function fetchCarData() {
        const carsRef = ref(db, "cars"); // Reference to the "cars" node in Firebase
        const snapshot = await get(carsRef);

        if (snapshot.exists()) {
            carData = Object.entries(snapshot.val()).map(([id, car]) => ({ id, ...car }));
            populateMakes();
            searchButton.disabled = false; // Enable search button after loading data
        } else {
            console.log("No car data found.");
        }
    }

    // Populate make options based on car data
    function populateMakes() {
        const selectedType = typeSelect.value;

        // Filter cars based on the selected type (if not "New/Used")
        const filteredCars = carData.filter(car => 
            !selectedType || selectedType === "New/Used" || car.type === selectedType
        );

        const makes = [...new Set(filteredCars.map(car => car.make))];

        makeSelect.innerHTML = '<option value="">Select Make</option>';
        makes.forEach(make => {
            const option = document.createElement("option");
            option.value = make;
            option.textContent = make;
            makeSelect.appendChild(option);
        });

        // Reset models dropdown
        modelSelect.innerHTML = '<option value="">Select Model</option>';
    }

    // Populate model options based on the selected make
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

    // Search and filter cars based on selected options
    function searchCars() {
        const selectedType = typeSelect.value;
        const selectedMake = makeSelect.value;
        const selectedModel = modelSelect.value;

        const filteredCars = carData.filter(car => {
            return (!selectedType || selectedType === "New/Used" || car.type === selectedType) &&
                   (!selectedMake || car.make === selectedMake) &&
                   (!selectedModel || car.model === selectedModel);
        });

        displayResults(filteredCars);
    }

    // Display search results
    function displayResults(cars) {
        resultsContainer.innerHTML = "";

        if (cars.length === 0) {
            resultsContainer.innerHTML = "<p>No cars found.</p>";
            return;
        }

        cars.forEach(car => {
            const carItem = document.createElement("div");
            carItem.className = "car-item";

            // Create a clickable link with an image
            const carLink = document.createElement("a");
            carLink.href = `car-details.html?id=${car.id}`;
            carLink.style.textDecoration = "none";
            carLink.style.color = "black";

            const carImage = document.createElement("img");
            carImage.src = car.image ? car.image : "default-image.jpg"; // Placeholder image
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

    // Fetch car data when page loads
    fetchCarData();

    // Event listeners for dropdown changes and search button
    makeSelect.addEventListener("change", populateModels);
    searchButton.addEventListener("click", searchCars);
});