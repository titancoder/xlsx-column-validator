module.exports = class ExcelColumnValidator {
  #errorObj = {};
  #validationObj;
  #keys;
  #options;
  constructor(validationObj, options) {
    this.#validationObj = validationObj;
    this.#keys = Object.keys(validationObj);
    this.#options = options;
  }

  #validateCell(cell, value) {
    const allowedValue = this.#validationObj[cell[0]].allowed;
    if (allowedValue) {
      return allowedValue.includes(value.toUpperCase() || value.toLowerCase())
        ? { match: true }
        : { match: false, message: this.#validationObj[cell[0]].onError };
    } else {
      return new RegExp(this.#validationObj[cell[0]].pattern).test(value)
        ? { match: true }
        : { match: false, message: this.#validationObj[cell[0]].onError };
    }
  }

  validateSheet(sheet) {
    for (const key in sheet) {
      const rowNo = key.slice(1);
      if (this.#options.headers && rowNo == 1) {
        continue;
      }
      if (this.#keys.includes(key[0])) {
        if (Object.hasOwnProperty.call(sheet, key)) {
          const validationResult = this.#validateCell(key, sheet[key].v);
          const errMsg = validationResult.message;
          if (!validationResult.match) {
            this.#errorObj[`Row ${rowNo}`]
              ? (this.#errorObj[`Row ${rowNo}`] = this.#errorObj[
                  `Row ${rowNo}`
                ].concat(`, ${errMsg}`))
              : (this.#errorObj[`Row ${rowNo}`] = `${errMsg}`);
          }
        }
      }
    }
    return this.#errorObj;
  }
};
