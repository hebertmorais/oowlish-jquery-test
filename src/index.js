import "./index.css";

const API_URL = "http://localhost:3030/doctors";

let doctors = [];

const onInit = () => {
  getDoctors();
  addAvailabilityIndicator();
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

$(document).ready(() => {
  onInit();
});
