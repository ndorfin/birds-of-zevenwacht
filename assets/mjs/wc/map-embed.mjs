class MapEmbed extends HTMLElement {

	#map;

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
			let groupedMarkerObject = {};
			let sightingIcon = L.divIcon({
				className: 'icon_sighting',
				iconAnchor: [0, 24],
				labelAnchor: [-6, 0],
				popupAnchor: [0, -36],
				html: `<span></span>`
			});
			let areaIcon = L.divIcon({
				className: 'icon_area',
				iconAnchor: [0, 24],
				labelAnchor: [-6, 0],
				popupAnchor: [0, -36],
				html: `<span></span>`
			});
			data.forEach(item => {
				if (!item.location.latitude) {
					if (!groupedMarkerObject[item.location.areaId]) {
						groupedMarkerObject[item.location.areaId] = {
							area: item.location.area,
							location: {
								latitude: item.location.area.location.latitude,
								longitude: item.location.area.location.longitude,
							}
						};
					}
					return;
				}
				let id = item.id;
				let markerObj = {
					id,
					location: {
						latitude: item.location.latitude,
						longitude: item.location.longitude,
					}
				};
				markerArray.push(markerObj);
				let popupHTML = `
					<b>Sighting</b> on ${ new Date(item.datetime).toISOString().substring(0, 10) }<br>
					<a href="./${ id }-${ item.birdId }/">${ item.quantity } ⨉ ${ item.bird.name }</a>
				`;
				L.marker([markerObj.location.latitude, markerObj.location.longitude], {icon: sightingIcon})
					.addTo(this.#map)
					.bindPopup(popupHTML);
			});
			Object.keys(groupedMarkerObject).forEach(areaId => {
				let areaObj = groupedMarkerObject[areaId];
				let popupHTML = `
					<b>Grouped Sightings</b><br>
					<a href="../areas/${ areaId }/">${ areaObj.area.name }</a>
				`;
				L.marker([areaObj.location.latitude, areaObj.location.longitude], {icon: areaIcon})
					.addTo(this.#map)
					.bindPopup(popupHTML);
			});
		});
	}

	#invokeLeaflet() {
		this.#map = window.L.map(this.getAttribute('id'), {
			scrollWheelZoom: false,
		}).setView([-33.929, 18.72], 15);

		L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
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