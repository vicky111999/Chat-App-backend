export const serverResponse = (res, statuscode, message) => {
  return res.status(statuscode).json({ staus: statuscode < 400, message });
};
