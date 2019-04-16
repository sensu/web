export const unregisterAll = () =>
  Promise.resolve()
    .then(() => {
      if ("serviceWorker" in navigator) {
        return navigator.serviceWorker.getRegistrations();
      }
      return [];
    })
    .then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
