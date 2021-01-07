const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(__dirname, "../src/index.ejs"),
  "utf8"
);

describe("Simple test to check names by UPIN", function () {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  it("check doctor with UPIN 202029 to have a name John Doe", () => {
    const doctorName = $(`[data-upin='202029'] td`).first().text();
    expect(doctorName).toBe("John Doe");
  });

  it("check doctor with UPIN 402910 to have a name Nick Ramsen", () => {
    const doctorName = $(`[data-upin='402910'] td`).first().text();
    expect(doctorName).toEqual("Nick Ramsen");
  });

  it("check doctor with UPIN 202029 not to have a name John Doe and be invalid", () => {
    const doctorName = $(`[data-upin='202029'] td`).first().text();
    expect(doctorName).toEqual(expect.not.stringContaining("Nick Ramsen"));
    });
});
