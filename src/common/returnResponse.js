exports.returnList = (result) => {
  return {
    total_count: result?.length,
    data: result,
  };
};

exports.returnError = (res, status, code, message) => {
  res.status(status).send({
    code,
    message,
  });
};
