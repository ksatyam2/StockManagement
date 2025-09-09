define(['knockout'], function(ko) {
  function LoginViewModel(params) {
    var self = this;
    self.username = ko.observable('');
    self.password = ko.observable('');
    self.errorMsg = ko.observable('');
    self.successMsg = ko.observable('');

    self.login = function(formElement, event) {
      if(event) event.preventDefault();
      self.errorMsg(""); self.successMsg("");
      const basicAuth = 'Basic ' + btoa(self.username() + ':' + self.password());
      fetch("http://localhost:8181/api/me", { headers: { "Authorization": basicAuth } })
        .then(response => {
          if (!response.ok) throw new Error("Login failed: Check username or password");
          return response.json();
        })
        .then(data => {
          localStorage.setItem("authUser", self.username());
          localStorage.setItem("authPass", self.password());
          localStorage.setItem("userRole", data.role);
          if (data.customerId) localStorage.setItem("customerId", data.customerId);
          self.successMsg("Login successful!");
          // Fire event so the appController can handle the redirect
          window.dispatchEvent(new CustomEvent("ojet-login-success", { detail: { role: data.role }}));
        })
        .catch((err) => self.errorMsg(err.message));
    };
  }
  return LoginViewModel;
});