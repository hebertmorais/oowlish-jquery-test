import "./index.css";

const API_URL = "http://localhost:3030/doctors";

let doctors = [];

const onInit = () => {
  getDoctors();
};

const getDoctors = (availability = undefined) => {
  const availabilityParam = availability
    ? `/available${availability}`
    : "";
  $.get(`${API_URL}${availabilityParam}`, (data) => {
    doctors = data;
  });
};

$(document).ready(() => {
  onInit();
});
