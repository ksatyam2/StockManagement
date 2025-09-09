define([], function() {
  return function authFetch(url, options = {}) {
    const username = localStorage.getItem("authUser");
    const password = localStorage.getItem("authPass");
    const basicAuth = "Basic " + btoa(username + ":" + password);

    options.headers = options.headers || {};
    options.headers["Authorization"] = basicAuth;
    return fetch(url, options)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        // Only parse JSON for JSON responses
        const ct = response.headers.get("content-type") || "";
        if (ct.includes("application/json")) return response.json();
        else return response.text();
      });
  };
});