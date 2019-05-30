import "jest-dom/extend-expect";

process.on(
  "unhandledRejection",
  (error): void => {
    throw error;
  },
);
