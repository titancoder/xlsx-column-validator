const xlsx = require("xlsx");

const wb = xlsx.readFile("sample.xlsx");
const sheet = wb.Sheets.Sheet1;

const ECV = require("./validator");

const excelColumnValidator = new ECV(
  {
    A: { pattern: "^[a-zA-Z\\s]+$", onError: "Invalid Firstname" },
    B: { pattern: "^[a-zA-Z]+$", onError: "Invalid Lastname" },
    C: {
      pattern:
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$",
      onError: "Invalid email",
    },
    D: {
      allowed: ["USER", "ADMIN"],
      onError: "Invalid user type",
    },
  },
  { headers: true }
);

console.log(excelColumnValidator.validateSheet(sheet));
