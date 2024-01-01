/**
 * 
 * @param {*} res res
 * @param {*} data data to be sent back
 * @param {*} message message to be sent back
 * @param {*} statusCode dynamic status code optional
 * @param {*} state 1/0 1 for success 0 for false
 * @returns 
 */
export default function response (res, data, message, statusCode, state = 1) {
  return res.status(statusCode ? statusCode : 200).json({
    message: message ? message : "success",
    state: state,
    time: new Date(),
    data: data ? data : [],
  });
};

