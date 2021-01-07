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
    method: "GET",
    url: `${API_URL}${availabilityParam}`,
    success: (data) => {
      doctors = data;
    },
    async: false,
  });
};

const addAvailabilityIndicator = () => {
  doctors.forEach((doctor, _) => {
    updateDoctorRowFromUPIN(doctor);
  });
};

const createListeners = () => {
  $("#availabilityFilterSelect").on("change", (event) => {
    const filterValue = $(event.currentTarget).val();
    handleFilterChange(filterValue);
  });

  $(".button").on("click", (event) => {
    const upin = $(event.currentTarget).parent().parent().attr("data-upin");
    let doctorWithUPIN = doctors.filter((doctor) => {
      return doctor.upin == upin;
    })[0];

    doctorWithUPIN.available = !doctorWithUPIN.available;

    changeDoctorAvailability(doctorWithUPIN);
  });
};

const handleFilterChange = (value) => {
  doctors.forEach((doctor, _) => {
    let item = getDoctorRowFromUPIN(doctor.upin);
    if (value == "available" && !doctor.available) {
      item.addClass("hidden");
    } else if (value == "all") {
      item.removeClass("hidden");
    }
  });
};

const changeDoctorAvailability = (doctor) => {
  $.ajax({
    method: "PUT",
    contentType: "application/json",
    url: `${API_URL}/${doctor.upin}`,
    data: JSON.stringify(doctor),
    success: (updatedDoctor) => {
      updateDoctorRowFromUPIN(updatedDoctor);
    },
  });
};

const updateDoctorRowFromUPIN = (doctor) => {
  const doctorRow = getDoctorRowFromUPIN(doctor.upin);
  const buttonText = `Mark as ${doctor.available ? "Una" : "A"}vailable`;

  doctorRow.find(".button").html(buttonText);

  if (doctor.available) {
    doctorRow.addClass("available");
  } else {
    if (doctorRow.hasClass("available")) doctorRow.removeClass("available");
  }
};

const getDoctorRowFromUPIN = (upin) => {
  return $(`[data-upin='${upin}']`).first();
};

$(document).ready(() => {
  onInit();
});
