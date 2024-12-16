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

	#createIcon(type) {
		let iconObj = {
			className: `icon_${ type }`,
			iconAnchor: [0, 24],
			labelAnchor: [-6, 0],
			popupAnchor: [0, -36],
			html: `<span></span>`
		}
		return window.L.divIcon(iconObj);
	}

	#addMarkerToMap(type, markerObj) {
		function getHTMLByType(type) {
			if (type === 'sighting') return `
				<b>Sighting</b> on ${ new Date(markerObj.item.datetime).toISOString().substring(0, 10) }<br>
				<a href="./${ markerObj.id }-${ markerObj.item.birdId }/">${ markerObj.item.quantity } × ${ markerObj.item.bird.name }</a>
			`;
			if (type === 'sightings') return `
				<b>Grouped Sightings</b><br>
				<a href="../areas/${ markerObj.id }/">${ markerObj.area.name }</a>
			`;
			if (type === 'photo') return `
				<b>Photo</b> on ${ new Date(markerObj.item.datetime).toISOString().substring(0, 10) }<br>
				<a href="./${ markerObj.id }-${ markerObj.item.photographer }/">${ markerObj.item.birds[0].name }</a>
			`;
			if (type === 'photos') return `
				<b>Grouped Photos</b><br>
				<a href="../areas/${ markerObj.id }/">${ markerObj.area.name }</a>
			`;
		}
		window.L.marker(
			[markerObj.location.latitude, markerObj.location.longitude],
			{icon: this.#createIcon(type)}
		).addTo(this.#map).bindPopup(getHTMLByType(type));
	}

	#addPointMarkers(markerType, data) {
		let groupedMarkerObject = {};
		data.forEach(item => {
			if (!item.location.latitude) {
				if (!groupedMarkerObject[item.location.areaId]) {
					groupedMarkerObject[item.location.areaId] = {
						id: item.location.areaId,
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
				location: item.location,
				item,
			};
			this.#addMarkerToMap(markerType, markerObj);
		});
		Object.keys(groupedMarkerObject).forEach(areaId => {
			this.#addMarkerToMap(`${ markerType }s`, groupedMarkerObject[areaId]);
		});
	}

	#addBoundaries(data) {
		let polygon = window.L.polygon(data, {color: 'hsla(220 50% 50% / 0.80)'}).addTo(this.#map);
		this.#map.fitBounds(polygon.getBounds());
	}

	#invokeLeaflet() {
		this.#map = window.L.map(this.getAttribute('id'), {
			scrollWheelZoom: false,
		}).setView(
			[parseFloat(this.getAttribute('latitude')),parseFloat(this.getAttribute('longitude')),],
			parseInt(this.getAttribute('zoom'))
		);

		window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
		}).addTo(this.#map);

		if (this.hasAttribute('sightings')) {
			const urlJSON = this.getAttribute('sightings');
			fetch(urlJSON).then(response => response.json()).then(data => {
				this.#addPointMarkers('sighting', data);
			});
		}

		if (this.hasAttribute('photos')) {
			const urlJSON = this.getAttribute('photos');
			fetch(urlJSON).then(response => response.json()).then(data => {
				this.#addPointMarkers('photo', data);
			});
		}

		if (this.hasAttribute('boundaries')) {
			const urlJSON = this.getAttribute('boundaries');
			fetch(urlJSON).then(response => response.json()).then(data => {
				this.#addBoundaries(data);
			});
		}
	}

	connectedCallback() {
		this.#addScript();
		this.#addCSS();
	}
}

customElements.define('map-embed', MapEmbed);