self.addEventListener("install", (event) => {
	console.log("Service worker installed");
});

self.addEventListener("activate", (event) => {
	console.log("Service worker activated");
});

self.addEventListener("fetch", (event) => {
	console.log("Fetching:", event.request.url);
});

self.addEventListener("push", (event) => {
	const data = event.data.json();
	const title = data.title ?? "";
	const body = data.body ?? "";
	const url = data.data.url ?? "/";
	const icon = data.icon ?? "/logo.png";

	event.waitUntil(
		self.registration.showNotification(title, {
			body,
			icon,
			data: {
				url,
			},
		}),
	);
});
