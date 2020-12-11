// Properly encode unicode characters
export const btoa = (str: string) =>
  window.btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (m, p) =>
      String.fromCharCode(parseInt("0x" + p, 16)),
    ),
  );
