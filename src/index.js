import "./index.css";

const API_URL = "http://localhost:3030/doctors";

let doctors = [];

const onInit = () => {
  getDoctors();
  addAvailabilityIndicator();
  createListeners();
};

const getDoctors = (availability = undefined) => {
  const availabilityParam = availability ? `/available${availability}` : "";
  $.ajax({
    method: 'GET',
    url: `${API_URL}${availabilityParam}`,
    success: (data) => {
      console.log(data)
      doctors = data;
    },
    async: false,
  });
};

const addAvailabilityIndicator = () => {
  doctors.forEach((doctor, _) => {
    if (doctor.available) {
      let item = $(`[data-upin='${doctor.upin}']`).first();
      item.addClass("available");
    }
  });
};

const createListeners = () => {
  $('#availabilityFilterSelect').on('change', event => {
    const filterValue = $(event.currentTarget).val();
    handleFilterChange(filterValue);
  });
}

const handleFilterChange = (value) => {
  doctors.forEach((doctor, _) => {
    let item = $(`[data-upin='${doctor.upin}']`).first();
    if (value == "available" && !doctor.available) {
      item.addClass("hidden");
    } else if (value == "all") {
      item.removeClass("hidden");
    }
  });
}

$(document).ready(() => {
  onInit();
});
