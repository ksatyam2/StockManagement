define(['knockout', 'accUtils', '../utils/authfetch','ojs/ojdialog'], function(ko, accUtils, authFetch) {
  function StocksViewModel() {
    var self = this;
    self.stocks = ko.observableArray([]);
    self.selectedStockId = ko.observable();
    self.newStockName = ko.observable('');
    self.newStockSymbol = ko.observable('');
    self.newStockPrice = ko.observable('');
    self.newStockQuantity = ko.observable('');
    self.editStock = ko.observable({stockId: null, name: '', symbol: '', price: '', quantity: ''});

    self.listStocks = function() {
      authFetch("http://localhost:8181/api/stocks")
        .then(data => self.stocks(data))
        .catch(error => alert("Failed to load stocks: " + error.message));
    };

    self.addStock = function(formElement, event) {
      if (event) event.preventDefault();
      const name = self.newStockName();
      const symbol = self.newStockSymbol();
      const price = parseFloat(self.newStockPrice());
      const quantity = parseInt(self.newStockQuantity(), 10);
      if (!name || !symbol || isNaN(price) || isNaN(quantity))
        return alert("All fields are required!");
      authFetch("http://localhost:8181/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, symbol, price, quantity })
      })
      .then(() => {
        self.newStockName('');
        self.newStockSymbol('');
        self.newStockPrice('');
        self.newStockQuantity('');
        self.listStocks();
      })
      .catch(error => alert("Failed to add stock: " + error.message));
    };

    self.deleteStock = function() {
      const id = self.selectedStockId();
      if (!id || !window.confirm("Are you sure you want to delete this stock?")) return;
      authFetch(`http://localhost:8181/api/stocks/${id}`, { method: "DELETE" })
        .then(() => {
          self.stocks.remove(s => s.stockId === id);
          self.selectedStockId(null);
        })
        .catch(error => alert("Failed to delete stock: " + error.message));
    };

    self.openEditDialog = function(stock) {
      self.editStock(Object.assign({}, stock));
      var dlg = document.getElementById('editStockDialog');
      if (dlg && typeof dlg.open === "function") dlg.open();
      else setTimeout(() => {
        var dlg2 = document.getElementById('editStockDialog');
        if (dlg2 && typeof dlg2.open === "function") dlg2.open();
        else alert("Dialog not ready!");
      }, 100);
    };
    self.closeEditDialog = function() {
      var dlg = document.getElementById('editStockDialog');
      if (dlg && typeof dlg.close === "function") dlg.close();
    };
    self.saveEditStock = function(formElement, event) {
      if (event) event.preventDefault();
      const s = self.editStock();
      authFetch(`http://localhost:8181/api/stocks/${s.stockId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: s.name,
          symbol: s.symbol,
          price: parseFloat(s.price),
          quantity: parseInt(s.quantity, 10)
        })
      })
      .then(() => {
        self.closeEditDialog();
        self.listStocks();
      })
      .catch(error => alert("Failed to update stock: " + error.message));
    };

    self.connected = function() {
      accUtils.announce('Stocks page loaded.', 'assertive');
      document.title = "Stocks";
      self.listStocks();
    };
  }
  return StocksViewModel;
});