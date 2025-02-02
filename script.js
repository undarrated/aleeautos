document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const carsContainer = document.getElementById("cars");

    function fetchCars(query = "") {
        fetch(`http://localhost:3000/cars?search=${query}`)
            .then(response => response.json())
            .then(cars => {
                carsContainer.innerHTML = ""; // Clear previous results
                cars.forEach(car => {
                    const carElement = document.createElement("div");
                    carElement.className = "car";
                    carElement.innerHTML = `
                        <img src="${car.image_url}" alt="${car.make} ${car.model}">
                        <h3>${car.make} ${car.model} (${car.year})</h3>
                        <p>Condition: ${car.car_condition}</p>
                        <p>Price: $${car.price}</p>
                    `;
                    carElement.onclick = () => window.location.href = `car.html?id=${car.id}`;
                    carsContainer.appendChild(carElement);
                });
            })
            .catch(error => console.error("Error fetching cars:", error));
    }

    searchInput.addEventListener("input", () => {
        fetchCars(searchInput.value);
    });

    fetchCars(); // Load all cars on page load
});

const params = new URLSearchParams(window.location.search);
const carId = params.get("car_id");

if (!carId) {
    console.error("Car ID is missing!");
    document.getElementById("response-message").innerText = "Error: No car selected.";
} else {
    document.getElementById("car_id").value = carId; // Set the car ID in the form
}

