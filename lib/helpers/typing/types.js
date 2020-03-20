/**
   * @desc NUMBER
   */
exports.NUMBER = (data) => {
  data = String(data).replace(/,/g, '.'); // switch , to .
  data = String(data).replace(/[^\d.-]/g, ''); // remove if it's not digit
  return Number(data);
};

/**
   * @desc STRING
   */
exports.STRING = (data) => String(data);
