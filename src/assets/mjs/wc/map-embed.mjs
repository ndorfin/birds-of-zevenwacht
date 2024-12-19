function getBaseURI() {
	if (location.href.indexOf('/birds-of-zevenwacht/') > -1) {
		return '/birds-of-zevenwacht/';
	} else {
		return '/'
	}
}

class MapEmbed extends HTMLElement {

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
		return L.divIcon(iconObj);
	}

	#addMarkerToMap(type, markerObj) {
		function getHTMLByType(type) {
			if (type === 'location') return null;
			if (type === 'sighting') return `
				<b>Sighting</b> on ${ new Date(markerObj.item.datetime).toISOString().substring(0, 10) }<br>
				<a href="${ getBaseURI() }sightings/${ markerObj.id }-${ markerObj.item.birdId }/">${ markerObj.item.quantity } × ${ markerObj.item.bird.name }</a>
			`;
			if (type === 'sightings') return `
				<b>Grouped Sightings</b><br>
				<a href="${ getBaseURI() }areas/${ markerObj.id }/">${ markerObj.area.name }</a>
			`;
			if (type === 'photo') return `
				<b>Photo</b> on ${ new Date(markerObj.item.datetime).toISOString().substring(0, 10) }<br>
				<a href="${ getBaseURI() }photos/${ markerObj.id }-${ markerObj.item.photographer }/">${ markerObj.item.birds[0].name }</a>
			`;
			if (type === 'photos') return `
				<b>Grouped Photos</b><br>
				<a href="${ getBaseURI() }areas/${ markerObj.id }/">${ markerObj.area.name }</a>
			`;
		}
		L.marker(
			[markerObj.location.latitude, markerObj.location.longitude],
			{icon: this.#createIcon(type)}
		).addTo(this.#map).bindPopup(getHTMLByType(type));
	}

	#addSinglePointMarker(locationObj, type) {
		L.marker(
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
		let polygon = L.polygon(data, {color: 'hsla(220 50% 50% / 0.80)'}).addTo(this.#map);
		this.#map.fitBounds(polygon.getBounds());
	}

	#invokeLeaflet() {
		this.#map = L.map(this.getAttribute('id'), {
			scrollWheelZoom: false,
		}).setView(
			[parseFloat(this.getAttribute('latitude')),parseFloat(this.getAttribute('longitude')),],
			parseInt(this.getAttribute('zoom'))
		);

		L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: `<a href="${ getBaseURI() }attribution/">Attribution</a>`
		}).addTo(this.#map);

		if (this.hasAttribute('marker-latitude')) {
			let locationObj = {
				latitude: parseFloat(this.getAttribute('marker-latitude')),
				longitude: parseFloat(this.getAttribute('marker-longitude')),
			}
			this.#addSinglePointMarker(locationObj, this.getAttribute('type'));
		}

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
	}
}

customElements.define('map-embed', MapEmbed);