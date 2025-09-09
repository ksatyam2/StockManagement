define([
  'knockout', 'accUtils', '../utils/authfetch', 'ojs/ojchart'
], function(ko, accUtils, authFetch) {
  function DashboardViewModel() {
    var self = this;
    self.profile = ko.observable({ name: '', email: '' });
    self.customerId = ko.observable(localStorage.getItem('customerId'));
    self.stocks = ko.observableArray([]);
    self.holdings = ko.observableArray([]);
    self.myTransactions = ko.observableArray([]);
    self.totalPortfolioValue = ko.observable(0);

    self.buyStockId = ko.observable();
    self.buyQty = ko.observable('');

    // Each holding row gets its own sellQty observable
    function addSellQtyObservable(holding) {
      if (!ko.isObservable(holding.sellQty)) {
        holding.sellQty = ko.observable('');
      }
      return holding;
    }

    self.holdings.subscribe(function(arr) {
      arr.forEach(addSellQtyObservable);
    });

    // Pie chart of holdings value by stock
    self.holdingsPieSeries = ko.computed(function() {
      return self.holdings().filter(h => h.quantity > 0).map(function(h) {
        return { name: h.symbol, items: [h.totalValue] };
      });
    });

    // Bar chart of buy/sell history
    self.myTxnChartSeries = ko.computed(function() {
      var buys = self.myTransactions().filter(tx => tx.transactionType === "BUY").length;
      var sells = self.myTransactions().filter(tx => tx.transactionType === "SELL").length;
      return [
        { name: "Buy", items: [buys] },
        { name: "Sell", items: [sells] }
      ];
    });
    self.myTxnChartGroups = ["History"];

    self.fetchProfile = function() {
      authFetch("http://localhost:8181/api/me")
        .then(function(data) {
          self.profile({ name: data.username, email: data.email || "" });
          if (data.customerId) {
            self.customerId(data.customerId);
            localStorage.setItem('customerId', data.customerId);
          }
          self.fetchTransactions();
          self.fetchStocks();
        });
    };
    self.fetchStocks = function() {
      authFetch("http://localhost:8181/api/stocks")
        .then(function(data) {
          self.stocks(data);
          self.computeHoldings();
        })
        .catch(function(error) { alert("Failed to load stocks: " + error.message); });
    };
    self.fetchTransactions = function() {
      authFetch("http://localhost:8181/api/transactions")
        .then(function(data) {
          var cid = self.customerId();
          var mine = data.filter(function(tx) { return tx.customer && tx.customer.customerId == cid; });
          self.myTransactions(mine);
          self.computeHoldings();
        })
        .catch(function(error) { alert("Failed to load transactions: " + error.message); });
    };

    // Compute holdings and update per-row sellQty, and charts
    self.computeHoldings = function() {
      var txns = self.myTransactions();
      var stocks = self.stocks();
      var map = {};
      txns.forEach(function(tx) {
        if (!tx.stock) return;
        var sid = tx.stock.stockId;
        if (!map[sid]) {
          var stockObj = stocks.find(function(s) { return s.stockId == sid; }) || tx.stock;
          map[sid] = { name: stockObj.name, symbol: stockObj.symbol, price: stockObj.price, quantity: 0, totalValue: 0, sellQty: ko.observable('') };
        }
        if (tx.transactionType === 'BUY') map[sid].quantity += tx.quantity;
        if (tx.transactionType === 'SELL') map[sid].quantity -= tx.quantity;
      });
      Object.values(map).forEach(function(h) { h.totalValue = (h.price || 0) * (h.quantity || 0); });
      var arr = Object.values(map).filter(h => h.quantity > 0);
      self.holdings(arr);
      self.totalPortfolioValue(arr.map(h=>h.totalValue).reduce((a,b)=>a+b,0));
    };

    self.buyStock = function(formElement, event) {
      if (event) event.preventDefault();
      var stockId = self.buyStockId();
      var quantity = parseInt(self.buyQty(), 10);
      var customerId = self.customerId();
      if (!stockId || !quantity || !customerId) return alert("Pick a stock and quantity to buy.");
      if (quantity <= 0) return alert("Quantity must be positive.");
      authFetch("http://localhost:8181/api/transactions/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customerId, stockId: stockId, quantity: quantity })
      })
      .then(function() {
        alert("Buy successful!");
        self.buyStockId('');
        self.buyQty('');
        self.fetchTransactions();
      })
      .catch(function(err) { alert("Buy failed: " + err.message); });
    };

    self.sellStock = function(h, formElement, event) {
      if (event) event.preventDefault();
      var quantity = parseInt(h.sellQty(), 10);
      var customerId = self.customerId();
      if (!h || !h.symbol || !quantity || !customerId) return alert("Pick a quantity to sell.");
      if (quantity > h.quantity) return alert("Can't sell more than holdings!");
      if (quantity <= 0) return alert("Sell quantity must be positive!");
      var stockId = self.stocks().find(function(s) { return s.symbol == h.symbol; }).stockId;
      if (!stockId) return alert("Stock not found!");
      authFetch("http://localhost:8181/api/transactions/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customerId, stockId: stockId, quantity: quantity })
      })
      .then(function() {
        alert("Sell successful!");
        h.sellQty('');
        self.fetchTransactions();
      })
      .catch(function(err) { alert("Sell failed: " + err.message); });
    };

    self.connected = function() {
      accUtils.announce('Dashboard page loaded.', 'assertive');
      document.title = "Dashboard";
      self.fetchProfile();
    };
  }
  return DashboardViewModel;
});