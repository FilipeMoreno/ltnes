importScripts(
	"https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js",
	"https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js",
);

const firebaseConfig = {
	apiKey: "AIzaSyBvO-JIULoAJi1YX3yd1uKpPUNBndCcPi8",
	authDomain: "deltaclass-2.firebaseapp.com",
	databaseURL: "https://deltaclass-2.firebaseio.com",
	projectId: "deltaclass-2",
	storageBucket: "deltaclass-2.appspot.com",
	messagingSenderId: "833417827558",
	appId: "1:833417827558:web:f89a9439e0928eb029d727",
	measurementId: "G-NLNSHMRSPW",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	if (!(self.Notification && self.Notification.permission === "granted")) {
		return;
	}

	if (!payload || !payload.data) {
		return;
	}
});

self.addEventListener("notificationclick", (evt) => {
	let url = undefined;
	if (evt.notification?.data) {
		const payload = evt.notification.data;
		if (payload.modulo && payload.id) {
			url = `${payload.modulo}/${payload.id}`;
			if (payload.modulo == "mensagens") {
				url = `publicacoes/recebida/${payload.id}`;
			}
		}
	}
	evt.notification.close();

	if (url) {
		evt.waitUntil(
			clients
				.matchAll({
					type: "window",
				})
				.then((clientList) => {
					for (const client of clientList) {
						if (client.url === url && "focus" in client) return client.focus();
					}
					if (clients.openWindow) return clients.openWindow(url);
				}),
		);
	}
});
