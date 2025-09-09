define(['knockout', 'accUtils', '../utils/authfetch','ojs/ojdialog'], function(ko, accUtils, authFetch) {
  function CustomersViewModel() {
    var self = this;
    self.customers = ko.observableArray([]);
    self.selectedCustomerId = ko.observable();
    self.newCustomerName = ko.observable('');
    self.newCustomerEmail = ko.observable('');
    self.editCustomer = ko.observable({customerId: null, name: '', email: ''});

    self.listCustomers = function() {
      authFetch("http://localhost:8181/api/customers")
        .then(data => self.customers(data))
        .catch(error => alert("Failed to load customers: " + error.message));
    };

    self.addCustomer = function(formElement, event) {
      if (event) event.preventDefault();
      const name = self.newCustomerName();
      const email = self.newCustomerEmail();
      if (!name || !email) return alert("Name and email are required!");
      authFetch("http://localhost:8181/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      })
      .then(() => {
        self.newCustomerName('');
        self.newCustomerEmail('');
        self.listCustomers();
      })
      .catch(error => alert("Failed to add customer: " + error.message));
    };

    self.deleteCustomer = function() {
      const id = self.selectedCustomerId();
      if (!id || !window.confirm("Are you sure you want to delete this customer?")) return;
      authFetch(`http://localhost:8181/api/customers/${id}`, { method: "DELETE" })
        .then(() => {
          self.customers.remove(c => c.customerId === id);
          self.selectedCustomerId(null);
        })
        .catch(error => alert("Failed to delete customer: " + error.message));
    };

    self.openEditDialog = function(customer) {
      self.editCustomer(Object.assign({}, customer));
      var dlg = document.getElementById('editCustomerDialog');
      if (dlg && typeof dlg.open === "function") dlg.open();
      else setTimeout(() => {
        var dlg2 = document.getElementById('editCustomerDialog');
        if (dlg2 && typeof dlg2.open === "function") dlg2.open();
        else alert("Dialog not ready!");
      }, 100);
    };
    self.closeEditDialog = function() {
      var dlg = document.getElementById('editCustomerDialog');
      if (dlg && typeof dlg.close === "function") dlg.close();
    };
    self.saveEditCustomer = function(formElement, event) {
      if (event) event.preventDefault();
      const c = self.editCustomer();
      authFetch(`http://localhost:8181/api/customers/${c.customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: c.name, email: c.email })
      })
        .then(() => {
          self.closeEditDialog();
          self.listCustomers();
        })
        .catch(error => alert("Failed to update customer: " + error.message));
    };

    self.connected = function() {
      accUtils.announce('Customers page loaded.', 'assertive');
      document.title = "Customers";
      self.listCustomers();
    };
  }
  return CustomersViewModel;
});