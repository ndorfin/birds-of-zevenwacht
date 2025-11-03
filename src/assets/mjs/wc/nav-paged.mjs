export default class NavPaged extends HTMLElement {

	#createNav() {

	}

	#showHideItems() {
		
	}

	connectedCallback() {
		console.log('maxItems', this.maxItems);
		console.log('numItems', this.numItems);
		console.log('list', this.list);
		console.log('maxPages', this.maxPages);

		if (this.maxPages > 1) {
			this.#createNav();
			this.pageIndex = 0;
			this.#showHideItems();
		}
	}

	get list() {
		return this.querySelector('ul,ol');
	}

	get numItems() {
		if (!this.list) {
			console.warn('<nav-paged> needs a list with one or more list-items');
			return null;
		}
		return this.list.children.length;
	}

	get maxItems() {
		if (!this.hasAttribute('max-items')) return 100;
		return parseInt(this.getAttribute('max-items'));
	}

	get maxPages() {
		if (!this.maxItems || !this.numItems || this.maxItems >= this.numItems) return 1;
		return Math.round(this.numItems / this.maxItems);
	}
}

window.customElements.define('nav-paged', NavPaged);