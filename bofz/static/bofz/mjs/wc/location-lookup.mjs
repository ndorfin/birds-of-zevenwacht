class LocationLookup extends HTMLElement {
	#addButton() {
		let template = this.querySelector('template');
		let contents = template.content.children[0].cloneNode(true);
		template.insertAdjacentElement('afterend', contents);
	}

	#handleButtonClick() {
		const options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		},
		success = (pos) => {
			this.querySelector('[name="latitude"]').value = pos.coords.latitude;
			this.querySelector('[name="longitude"]').value = pos.coords.longitude;
		},
		error = (err) => {
			console.warn(`ERROR(${err.code}): ${err.message}`);
		};
		
		navigator.geolocation.getCurrentPosition(success, error, options);
	}

	connectedCallback() {
		this.#addButton();
		this.addEventListener('click', this.#handleButtonClick.bind(this));
	}
}

customElements.define('location-lookup', LocationLookup);