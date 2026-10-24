/* TrybNetwork Admin service worker — push notifications only.
   No fetch handler: page loads are never intercepted or cached. */
self.addEventListener("push", (event) => {
  let note = { title: "TrybNetwork Admin", body: "You have an update.", url: "https://admin.trybnetwork.com/" };
  try { note = { ...note, ...event.data.json() }; } catch (e) { /* keep defaults */ }
  event.waitUntil(
    self.registration.showNotification(note.title, {
      body: note.body,
      icon: "https://app.trybnetwork.com/icon-192.png",
      badge: "https://app.trybnetwork.com/icon-192.png",
      tag: "tn-admin-alert",
      data: { url: note.url || "https://admin.trybnetwork.com/" }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "https://admin.trybnetwork.com/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if (w.url.startsWith("https://admin.trybnetwork.com") && "focus" in w) return w.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
