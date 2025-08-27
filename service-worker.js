let cacheGroups = {
	css: {
		matches: /.css$/,
		name: `cache_css-v1756282857399`,
		urls: [
			"/birds-of-zevenwacht/assets/css/all.css?timestamp=1756282857399"
		],
		version: 1756282857399,
	},
	
	libJS: {
		matches: /.js$/,
		name: `cache_libJS-v1734619420205`,
		urls: [
			"/birds-of-zevenwacht/assets/mjs/lib/leaflet.1.9.4.js"
		],
		version: 1734619420205,
	},
	mjs: {
		matches: /.mjs$/,
		name: `cache_mjs-v1753027909498`,
		urls: [
			"/birds-of-zevenwacht/assets/mjs/bundle.mjs?timestamp=1753027909498"
		],
		version: 1753027909498,
	},
	static: {
		matches: /.(ico|manifest|svg)$/,
		name: `cache_static-v1734619420205`,
		urls: [
			"/birds-of-zevenwacht/favicon.ico",
			"/birds-of-zevenwacht/icon_pwa.svg",
			"/birds-of-zevenwacht/web.manifest",
			"/birds-of-zevenwacht/assets/img/icon_bird.svg",
			"/birds-of-zevenwacht/assets/img/icon_photo.svg",
			"/birds-of-zevenwacht/assets/img/icon_sighting.svg"
		],
		version: 1734619420205,
	},
}

self.addEventListener('install', event => {
	event.waitUntil(
		(async () => {
			return Promise.all(Object.keys(cacheGroups).map(cacheType => {
				const cacheGroup = cacheGroups[cacheType];
				return caches.open(cacheGroup.name).then(cache => cache.addAll(cacheGroup.urls));
			}));
		})(),
		self.skipWaiting()
	);
});

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = Object.entries(cacheGroups).map(([key, value]) => value.name);
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener('activate', (event) => {
  event.waitUntil(
		clients.claim(),
		deleteOldCaches(),
	);
});

self.addEventListener('fetch', event => {
	const request = event.request;

	// Ignore non-GET requests
	if (request.method !== 'GET') return;

	let matchingType;
	Object.keys(cacheGroups).forEach(type => {
		const cacheType = cacheGroups[type];
		if (request.url.match(cacheType.matches)) {
			matchingType = type;
			return;
		}
	});

	event.respondWith((async () => {
		if (matchingType) {
			const cachedResponse = await caches
				.open(cacheGroups[matchingType].name)
				.then(cache => cache.match(request));

			if (cachedResponse) {
				return cachedResponse;
			}
		}

		const response = await fetch(request);

		return response;
	})());
});