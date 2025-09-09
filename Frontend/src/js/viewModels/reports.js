define(['knockout', 'accUtils', '../utils/authfetch'], function(ko, accUtils, authFetch) {
  function ReportsViewModel() {
    var self = this;
    // Data arrays
    self.customers = ko.observableArray([]);
    self.stocks = ko.observableArray([]);
    self.transactions = ko.observableArray([]);
    // Reports
    self.assetReportList = ko.observableArray([]);
    self.maxAssetCustomer = ko.observable();
    self.minAssetCustomer = ko.observable();
    self.topStock = ko.observable();
    self.leastStock = ko.observable();
    self.highestPriceStock = ko.observable();
    self.mostFrequentType = ko.observable('-');
    self.totalAssetValue = ko.observable(0);

    // Load all data and compute after loaded
    self.loadData = function() {
      authFetch('http://localhost:8181/api/customers')
        .then(function(cs) {
          self.customers(cs);
          return authFetch('http://localhost:8181/api/stocks');
        })
        .then(function(ss) {
          self.stocks(ss);
          return authFetch('http://localhost:8181/api/transactions');
        })
        .then(function(ts) {
          self.transactions(ts);
          self.computeReports();
        })
        .catch(function(err) {
          alert("Failed to load reports data: " + err.message);
        });
    };

    self.computeReports = function() {
      // 1,2,3,11: assets per customer, min/max, total
      var stocksMap = {};
      self.stocks().forEach(function(s) { stocksMap[s.stockId] = s; });

      var assetReports = self.customers().map(function(c) {
        var myTxns = self.transactions().filter(function(t) { return t.customer && t.customer.customerId === c.customerId; });
        var holdingsMap = {};
        myTxns.forEach(function(t) {
          var sid = t.stock && t.stock.stockId;
          if (!sid) return;
          if (!holdingsMap[sid]) holdingsMap[sid] = 0;
          holdingsMap[sid] += (t.transactionType === 'BUY' ? 1 : -1) * t.quantity;
        });
        var assetValue = 0;
        Object.keys(holdingsMap).forEach(function(sid) {
          var stock = stocksMap[sid];
          if (stock && holdingsMap[sid] > 0) assetValue += (stock.price * holdingsMap[sid]);
        });
        // Most frequent transaction type
        var buys = myTxns.filter(t => t.transactionType === "BUY").length;
        var sells = myTxns.filter(t => t.transactionType === "SELL").length;
        var frequent = "-";
        if (buys > sells) frequent = "BUY";
        else if (sells > buys) frequent = "SELL";
        else if (buys + sells === 0) frequent = "-";
        else frequent = "TIE";
        return { ...c, assetValue: assetValue, frequentTxnType: frequent };
      });
      self.assetReportList(assetReports);

      // Max/min
      if (assetReports.length > 0) {
        self.maxAssetCustomer(assetReports.reduce((a, b) => a.assetValue > b.assetValue ? a : b));
        self.minAssetCustomer(assetReports.reduce((a, b) => a.assetValue < b.assetValue ? a : b));
      } else {
        self.maxAssetCustomer(null);
        self.minAssetCustomer(null);
      }
      // Total assets
      self.totalAssetValue(assetReports.map(r=>r.assetValue).reduce((a,b)=>a+b,0));
      // 4/5 Most/least transacted stocks
      var txByStock = {};
      self.transactions().forEach(function(t) {
        var sid = t.stock && t.stock.stockId;
        if (!sid) return;
        txByStock[sid] = (txByStock[sid] || 0) + 1;
      });
      var top = null, least = null;
      Object.keys(txByStock).forEach(function(sid) {
        var s = self.stocks().find(stock => stock.stockId == sid);
        var count = txByStock[sid];
        if (count && (!top || count > top.count)) top = { symbol: s.symbol, count: count };
        if (count && (!least || count < least.count)) least = { symbol: s.symbol, count: count };
      });
      self.topStock(top);
      self.leastStock(least);
      // 6 stock with highest price
      var high = self.stocks().reduce((a, b) => (a.price > b.price ? a : b), { price: -Infinity });
      self.highestPriceStock(high && high.symbol ? { symbol: high.symbol, price: high.price } : null);

      // 10 most frequent transaction type
      var buys = self.transactions().filter(t => t.transactionType === "BUY").length;
      var sells = self.transactions().filter(t => t.transactionType === "SELL").length;
      self.mostFrequentType(buys > sells ? "BUY" : sells > buys ? "SELL" : "TIE");
    };

    self.connected = function() {
      accUtils.announce('Reports page loaded.', 'assertive');
      document.title = "Reports & Analytics";
      self.loadData();
    };
  }
  return ReportsViewModel;
});