function exceptions(success, code, err, msg) {
  this.success = success;
  this.code = code;
  this.error = err;
  this.message = msg;
}

module.exports = {
  exceptions,
};
