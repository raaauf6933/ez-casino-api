exports.returnList = (result) => {
  return {
    total_count: result?.length,
    data: result,
  };
};
