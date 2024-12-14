class MapEmbed extends HTMLElement {

	#map;
	#tiles;
	#markers;

	#checkSourceElementExists(elemId) {
		if (document.getElementById(elemId)) return true;
		return false;
	}

	#addScript() {
		const attributes = {
			id: 'script-leaflet',
			url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
			integrity: 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=',
			crossorigin: '',
		}
		if (!this.#checkSourceElementExists(attributes.id)) {
			let scriptElem = document.createElement('script');
			scriptElem.id = attributes.id;
			scriptElem.src = attributes.url;
			scriptElem.integrity = attributes.integrity;
			scriptElem.crossOrigin = attributes.crossorigin;
			scriptElem.onload = this.#invokeLeaflet.bind(this);
			document.head.append(scriptElem);
		}
	}

	#addCSS() {
		const attributes = {
			id: 'stylesheet-leaflet',
			url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
			integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
			crossorigin: '',
		}
		if (!this.#checkSourceElementExists(attributes.id)) {
			let linkElem = document.createElement('link');
			linkElem.id = attributes.id;
			linkElem.rel = 'stylesheet';
			linkElem.href = attributes.url;
			linkElem.integrity = attributes.integrity;
			linkElem.crossOrigin = attributes.crossorigin;
			document.head.append(linkElem);
		}
	}

	#addMapPointsFromJSON() {
		const JSON = this.getAttribute('json');
		fetch(JSON).then(response => response.json()).then(data => {
			let markerArray = [];
			data.forEach(item => {
				let id = item.id;
				let markerObj = {
					id,
					location: {
						latitude: item.location.latitude || item.location.area.location.latitude,
						longitude: item.location.longitude || item.location.area.location.longitude,
					}
				};
				markerArray.push(markerObj);
				let popupHTML = `
					<b>Sighting</b> on ${ new Date(item.datetime).toISOString().substring(0, 10) }<br>
					<a href="./${ id }-${ item.birdId }/">${ item.quantity } ⨉ ${ item.bird.name }</a>
				`;
				L.marker([markerObj.location.latitude, markerObj.location.longitude])
					.addTo(this.#map)
					.bindPopup(popupHTML);
			});
			this.#markers = markerArray;
		});
	}

	#invokeLeaflet() {
		this.#map = window.L.map(this.getAttribute('id'), { scrollWheelZoom: false }).setView([-33.9319, 18.718], 15);
		this.#tiles = window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 20,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(this.#map);

		if (this.getAttribute('json')) {
			this.#addMapPointsFromJSON();
		}
	}

	connectedCallback() {
		this.#addScript();
		this.#addCSS();
	}
}

customElements.define('map-embed', MapEmbed);