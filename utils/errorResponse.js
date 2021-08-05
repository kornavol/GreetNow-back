class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

function test() {
  throw new ErrorResponse("Whoops!");
}

try {
  test();
} catch (err) {
  console.log(err.message); // Whoops!
}

module.exports = ErrorResponse;
