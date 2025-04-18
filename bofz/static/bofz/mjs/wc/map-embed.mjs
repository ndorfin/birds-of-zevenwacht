import getBaseURI from '../lib/get-base-uri.mjs';

class MapEmbed extends HTMLElement {

	observer;
	#map;

	#checkSourceElementExists(elemId) {
		if (document.getElementById(elemId)) return true;
		return false;
	}

	#addScript() {
		const scriptElemId = 'script-leaflet';
		if (!this.#checkSourceElementExists(scriptElemId)) {
			let scriptElem = document.createElement('script');
			scriptElem.id = scriptElemId;
			scriptElem.src = `${ getBaseURI() }assets/mjs/lib/leaflet.1.9.4.js`;
			scriptElem.onload = this.#invokeLeaflet.bind(this);
			document.head.append(scriptElem);
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
				<a href="${ getBaseURI() }sightings/${ markerObj.id }/">${ markerObj.item.quantity } × ${ markerObj.item.bird.name }</a>
			`;
			if (type === 'sightings') return `
				<b>Grouped Sightings</b><br>
				<a href="${ getBaseURI() }areas/${ markerObj.id }/">${ markerObj.area.name }</a>
			`;
			if (type === 'photo') return `
				<b>Photo</b> on ${ new Date(markerObj.item.datetime).toISOString().substring(0, 10) }<br>
				<a href="${ getBaseURI() }photos/${ markerObj.id }_${ markerObj.item.photographer }/">${ markerObj.item.birds[0].name }</a>
			`;
			if (type === 'photos') return `
				<b>Grouped Photos</b><br>
				<a href="${ getBaseURI() }areas/${ markerObj.id }/">${ markerObj.area.name }</a>
			`;
		}
		window.L.marker(
			[markerObj.location.latitude, markerObj.location.longitude],
			{icon: this.#createIcon(type)}
		).addTo(this.#map).bindPopup(getHTMLByType(type));
	}

	#addSinglePointMarker(locationObj, type) {
		window.L.marker(
			[locationObj.latitude, locationObj.longitude],
			{icon: this.#createIcon(type)}
		).addTo(this.#map);
		this.#map.flyTo({lat: locationObj.latitude, lng: locationObj.longitude});
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
		window.L.polygon(data, {color: 'hsla(220 50% 50% / 0.80)'}).addTo(this.#map);
	}

	#invokeLeaflet() {
		this.#map = window.L.map(this.id, {
			scrollWheelZoom: false,
		}).setView(
			[this.latitude, this.longitude],
			this.zoom
		);

		window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: `<a href="${ getBaseURI() }attribution/">Attribution</a>`
		}).addTo(this.#map);

		if (this.markerLatitude) {
			let locationObj = {
				latitude: parseFloat(this.markerLatitude),
				longitude: parseFloat(this.markerLongitude),
			}
			this.#addSinglePointMarker(locationObj, this.type);
		}


		if (this.sightings) {
			fetch(this.sightings).then(response => response.json()).then(data => {
				this.#addPointMarkers('sighting', data);
			});
		}

		if (this.photos) {
			fetch(this.photos).then(response => response.json()).then(data => {
				this.#addPointMarkers('photo', data);
			});
		}

		if (this.boundaries) {
			fetch(this.boundaries).then(response => response.json()).then(data => {
				this.#addBoundaries(data);
			});
		}

		this.#addObserver();
	}

	#redrawMap() {
		this.#map.invalidateSize();
	}

	#addObserver() {
		const options = {
			root: document.querySelector('html'),
			threshold: 0.1,
		};
		this.observer = new IntersectionObserver(this.#redrawMap.bind(this), options);
		this.observer.observe(this);
	}

	connectedCallback() {
		this.#addScript();
	}

	get boundaries() {
		return this.getAttribute('boundaries');
	}

	get latitude() {
		return parseFloat(this.getAttribute('latitude'));
	}

	get longitude() {
		return parseFloat(this.getAttribute('longitude'));
	}

	get location() {
		return this.getAttribute('location');
	}

	get markerLatitude() {
		return parseFloat(this.getAttribute('marker-latitude'));
	}

	get markerLongitude() {
		return parseFloat(this.getAttribute('marker-longitude'));
	}
	
	get photos() {
		return this.getAttribute('photos');
	}
	
	get sightings() {
		return this.getAttribute('sightings');
	}

	get type() {
		return this.getAttribute('type');
	}

	get zoom() {
		return parseInt(this.getAttribute('zoom'));
	}
}

customElements.define('map-embed', MapEmbed);