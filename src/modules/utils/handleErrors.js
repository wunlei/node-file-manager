function handleError(message, error) {
  if (error) {
    console.error("Error: ", error.message);
  } else if (message) {
    console.error("Error: ", message);
  } else {
    console.error("Error: ", "Something went wrong");
  }
}

export { handleError };
