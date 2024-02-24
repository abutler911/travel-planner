const form = document.getElementById("trip-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const destination = document.getElementById("destination").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const formData = {
    destination: destination,
    startDate: startDate,
    endDate: endDate,
  };

  fetch("/plan-trip", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      console.log("Full Response:", response); // Inspect the entire response object
      if (response.ok) {
        window.location.href = response.url;
      } else {
        console.error("Server Error:", response.status);
      }
    })
    .catch((error) => {
      console.error("Error submitting form:", error);
    });
});
