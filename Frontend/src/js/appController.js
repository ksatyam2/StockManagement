define([
  'knockout', 'ojs/ojcontext', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils',
  'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter',
  'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
  'ojs/ojdrawerpopup', 'ojs/ojmodule-element', 'ojs/ojknockout'
], function(
  ko, Context, moduleUtils, KnockoutTemplateUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter,
  ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider
) {
  function ControllerViewModel() {
    let self = this;

    this.KnockoutTemplateUtils = KnockoutTemplateUtils;

    // Accessibility
    this.manner = ko.observable('polite');
    this.message = ko.observable();
    var announcementHandler = (event) => {
      this.message(event.detail.message);
      this.manner(event.detail.manner);
    };
    document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);

    // Responsive
    const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
    this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
    const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
    this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

    // Navigation data
    let navData = [
      { path: '', redirect: 'login' },
      { path: 'login', detail: { label: 'Login', iconClass: 'oj-ux-ico-enter' } },
      { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-dashboard' } },
      { path: 'customers', detail: { label: 'Customers', iconClass: 'oj-ux-ico-contact-group' } },
      { path: 'stocks', detail: { label: 'Stocks', iconClass: 'oj-ux-ico-bar-chart' } },
      { path: 'transactions', detail: { label: 'Transactions', iconClass: 'oj-ux-ico-fire' } },
      { path: 'reports', detail: { label: 'Reports', iconClass: 'oj-ux-ico-bar-chart' } },
      { path: 'about', detail: { label: 'About', iconClass: 'oj-ux-ico-information-s' } }
    ];
    let router = new CoreRouter(navData, { urlAdapter: new UrlParamAdapter() });
    router.sync();
    this.moduleAdapter = new ModuleRouterAdapter(router);
    this.selection = new KnockoutRouterAdapter(router);

    this.navDataProvider = new ArrayDataProvider(navData.slice(1), { keyAttributes: "path" });

    // Drawer logic
    self.sideDrawerOn = ko.observable(false);
    this.mdScreen.subscribe(function() { self.sideDrawerOn(false); });
    this.toggleDrawer = function() {
      self.sideDrawerOn(!self.sideDrawerOn());
    };

    this.appName = ko.observable("Stock Manager");
    this.userLogin = ko.observable("User");

    this.footerLinks = [
      { name: 'About Oracle', linkId: 'aboutOracle', linkTarget: 'http://www.oracle.com/us/corporate/index.html#menu-about' },
      { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
      { name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
      { name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
      { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" }
    ];

    // Login and role
    self.isLoggedIn = ko.observable(localStorage.getItem("loggedIn") === "true");
    self.userRole = ko.observable(localStorage.getItem("userRole"));
    self.isAdmin = ko.computed(() => self.isLoggedIn() && self.userRole() === "ADMIN");
    self.isCustomer = ko.computed(() => self.isLoggedIn() && self.userRole() === "CUSTOMER");

    // Role-based navigation guard
    router.currentState.subscribe(function(navState) {
      if (!navState) return;
      var newPath = navState.state && navState.state.path;
      if (!self.isLoggedIn() && newPath !== 'login') {
        router.go('login');
      }
      if (self.isLoggedIn()) {
        if (self.userRole() === "ADMIN" && (newPath === "dashboard" || newPath === "login")) {
          router.go('transactions');
        }
        if (self.userRole() === "CUSTOMER" &&
          (newPath !== "dashboard" && newPath !== "about" && newPath !== "login")) {
          router.go('dashboard');
        }
      }
    });

    self.shouldShowAdminNav = ko.computed(() =>
      self.isLoggedIn() && self.userRole() === "ADMIN"
    );
    self.shouldShowCustomerNav = ko.computed(() =>
      self.isLoggedIn() && self.userRole() === "CUSTOMER"
    );

    // OJET user menu signout handling
    document.addEventListener('ojMenuAction', function(event) {
      if (event && event.detail && event.detail.value === 'out') {
        self.logout();
      }
    });

    // Also allow explicit KO button for logout
    self.logout = function() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("authUser");
  localStorage.removeItem("authPass");
  localStorage.removeItem("userRole");
  localStorage.removeItem("customerId");
  // Force reload to clear Knockout/OJET state, return to login
  window.location.reload();
};
    // After login event, set role and redirect by role
    window.addEventListener("ojet-login-success", function() {
      self.isLoggedIn(true);
      self.userRole(localStorage.getItem("userRole"));
      if (self.userRole() === "ADMIN") router.go('transactions');
      else router.go('dashboard');
    });
  }

  Context.getPageContext().getBusyContext().applicationBootstrapComplete();
  return new ControllerViewModel();
});