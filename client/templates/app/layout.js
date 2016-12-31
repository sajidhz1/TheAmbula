Template.layout.onCreated(function(){
     self.log = new ReactiveVar([]);
    self.currentIdentity = new ReactiveVar("No Identity Set");

    // We don't want to register analytics if it has been blocked by an adblocker.
    if (typeof analytics === "undefined") return;

    self.currentIdentity.set(analytics._user._getTraits().email || "No Identity Set");

    analytics.on("page", (event, properties, options) => {
      const latest = self.log.get();
      latest.push(`Page: ${options.path}`);
      self.log.set(latest);
    });

    analytics.on("identify", (event, properties, options) => {
      const latest = self.log.get();
      latest.push(`Identify: ${properties.email}`);
      self.log.set(latest);
      self.currentIdentity.set(properties.email);
    });

    analytics.on("track", (event, properties, options) => {
      const latest = self.log.get();
      latest.push(`Track: ${event}`);
      self.log.set(latest);
});
});