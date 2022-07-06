function exceptions(success, code, err, msg) {
  this.success = success;
  this.code = code;
  this.error = err;
  this.message = msg;
}

function permissionExceptions(code, error, message) {
  this.code = code;
  this.error = error;
  this.message = message;
}

module.exports = {
  exceptions,
  permissionExceptions,
};
