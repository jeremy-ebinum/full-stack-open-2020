const logger = {
  info: (...args) => {
    if (process.env.NODE_ENV === "development") {
      console.log(...args);
    }
  },
  error: (...args) => {
    console.error(...args);
  },
};

export default logger;
