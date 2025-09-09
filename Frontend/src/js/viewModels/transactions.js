define([
  'knockout', 'accUtils', '../utils/authfetch', 'ojs/ojchart'
], function(ko, accUtils, authFetch) {
  function TransactionsViewModel() {
    var self = this;
    self.transactions = ko.observableArray([]);
    self.displayedTransactions = ko.observableArray([]);
    self.customers = ko.observableArray([]);
    self.stocks = ko.observableArray([]);
    self.selectedCustomerId = ko.observable();
    self.selectedStockId = ko.observable();
    self.txnQuantity = ko.observable('');
    self.txnType = ko.observable('BUY');

    // Filters (ensure defined for HTML binding)
    self.filterCustomerId = ko.observable();
    self.filterStockId = ko.observable();
    self.filterTxnType = ko.observable("");

    // Analytics
    self.buyCount = ko.observable(0);
    self.sellCount = ko.observable(0);
    self.topCustomer = ko.observable(); // {customerId, name, count}
    self.topStock = ko.observable(); // {stockId, symbol, count}
    self.mostFrequentType = ko.observable('-');
    self.txnChartSeries = ko.computed(function() {
      return [
        { name: "Buy", items: [self.buyCount()] },
        { name: "Sell", items: [self.sellCount()] }
      ];
    });
    self.txnChartGroups = ["Transactions"];

    // List and filter logic
    self.listTransactions = function() {
      authFetch("http://localhost:8181/api/transactions")
        .then(function(data) {
          self.transactions(data);
          self.applyFilters();
        })
        .catch(function(error) { alert("Failed to load transactions: " + error.message); });
    };

    self.listCustomers = function() {
      authFetch("http://localhost:8181/api/customers")
        .then(function(data) { self.customers(data); })
        .catch(function(error) { alert("Failed to load customers: " + error.message); });
    };

    self.listStocks = function() {
      authFetch("http://localhost:8181/api/stocks")
        .then(function(data) { self.stocks(data); })
        .catch(function(error) { alert("Failed to load stocks: " + error.message); });
    };

    self.applyFilters = function() {
      var custId = self.filterCustomerId();
      var stockId = self.filterStockId();
      var txnType = self.filterTxnType();
      var filtered = self.transactions();

      if (custId) filtered = filtered.filter(function(tx) { return tx.customer && tx.customer.customerId == custId; });
      if (stockId) filtered = filtered.filter(function(tx) { return tx.stock && tx.stock.stockId == stockId; });
      if (txnType) filtered = filtered.filter(function(tx) { return tx.transactionType === txnType; });

      self.displayedTransactions(filtered);
      self.computeAnalytics();
    };

    self.clearFilters = function() {
      self.filterCustomerId(undefined);
      self.filterStockId(undefined);
      self.filterTxnType("");
      self.displayedTransactions(self.transactions());
      self.computeAnalytics();
    };

    self.computeAnalytics = function() {
      var txns = self.displayedTransactions();
      var buy = 0, sell = 0;
      var custCount = {}, stockCount = {}, typeCount = {};

      txns.forEach(function(tx) {
        // Buy/sell counts
        if (tx.transactionType === 'BUY') buy++;
        else if (tx.transactionType === 'SELL') sell++;

        // Customer frequency
        if (tx.customer) {
          var id = tx.customer.customerId, name = tx.customer.name;
          if (!custCount[id]) custCount[id] = { customerId: id, name: name, count: 0 };
          custCount[id].count++;
        }
        // Stock frequency
        if (tx.stock) {
          var id = tx.stock.stockId, symbol = tx.stock.symbol;
          if (!stockCount[id]) stockCount[id] = { stockId: id, symbol: symbol, count: 0 };
          stockCount[id].count++;
        }
        // Type frequency
        typeCount[tx.transactionType] = (typeCount[tx.transactionType] || 0) + 1;
      });
      self.buyCount(buy);
      self.sellCount(sell);

      // Top customer
      var maxCust = null;
      for (var cid in custCount) {
        if (!maxCust || custCount[cid].count > maxCust.count) maxCust = custCount[cid];
      }
      self.topCustomer(maxCust);

      // Top stock
      var maxStock = null;
      for (var sid in stockCount) {
        if (!maxStock || stockCount[sid].count > maxStock.count) maxStock = stockCount[sid];
      }
      self.topStock(maxStock);

      // Most frequent type
      if (typeCount['BUY'] > typeCount['SELL']) self.mostFrequentType('BUY');
      else if (typeCount['SELL'] > typeCount['BUY']) self.mostFrequentType('SELL');
      else if (buy + sell === 0) self.mostFrequentType('-');
      else self.mostFrequentType('TIE');
    };
    self.displayedTransactions.subscribe(self.computeAnalytics);

    self.submitTransaction = function(formElement, event) {
      if (event) event.preventDefault();
      const customerId = self.selectedCustomerId();
      const stockId = self.selectedStockId();
      const quantity = parseInt(self.txnQuantity(), 10);
      const txnType = self.txnType();

      if (!customerId || !stockId || isNaN(quantity) || quantity < 1) {
        alert("Please fill all fields.");
        return;
      }
      const endpoint = txnType === 'BUY'
        ? "http://localhost:8181/api/transactions/buy"
        : "http://localhost:8181/api/transactions/sell";
      authFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, stockId, quantity })
      })
      .then(function() {
        self.txnQuantity("");
        self.listTransactions();
      })
      .catch(function(error) { alert("Failed to submit transaction: " + error.message); });
    };

    self.connected = function() {
      accUtils.announce('Transactions page loaded.', 'assertive');
      document.title = "Transactions";
      self.listTransactions();
      self.listCustomers();
      self.listStocks();
    };
  }
  return TransactionsViewModel;
});