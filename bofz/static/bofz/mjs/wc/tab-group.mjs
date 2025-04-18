// See: https://inclusive-components.design/tabbed-interfaces/
class TabGroup extends HTMLElement {
	#setRoleAttributes() {
		this.querySelector('nav ul').setAttribute('role', 'tablist');
		Array.from(this.querySelectorAll('nav li')).forEach(listitem => {
			listitem.setAttribute('role', 'presentation');
		});
		Array.from(this.querySelectorAll('nav li a')).forEach(anchor => {
			anchor.setAttribute('role', 'tab');
			anchor.setAttribute('aria-controls', this.#getIdValueFromHref(anchor.href));
		});
		Array.from(this.querySelectorAll('nav ~ *')).forEach(section => {
			section.setAttribute('role', 'tabpanel');
		});
	}

	#getMatchingAnchorFromLocation() {
		let fragmentId = window.location.hash;
		let anchorElem = this.#getMatchingAnchorByHref(fragmentId);
		if (anchorElem) {
			let currentTab = this.querySelector('nav a[aria-selected="true"]');
			if (currentTab) currentTab.removeAttribute('aria-selected');

			anchorElem.setAttribute('aria-selected', 'true');
			this.activeTab = this.#getAnchorElemParentIndex(anchorElem);
		}
	}

	#getMatchingAnchorByHref(href) {
		let possibleMatchingAnchor = this.querySelector(`[href="${ href }"]`);
		if (possibleMatchingAnchor && possibleMatchingAnchor.closest('nav')) {
			/* We have a matching anchor. Pass the element back */
			return possibleMatchingAnchor;
		} else {
			/* No matching anchor found */
			return null;
		}
	}

	#getMatchingAnchorByIndex() {
		return this.querySelector(`nav li:nth-child(${ this.activeTab + 1 }) a`);
	} 

	#getAnchorElemParentIndex(anchorElem) {
		let listitem = anchorElem.closest('li');
		return Array.prototype.indexOf.call(listitem.parentNode.children, listitem);
	}

	#getIdValueFromHref(href) {
		return href.split('#')[1];
	}

	#targetInitialSection() {
		let initialAnchor = this.#getMatchingAnchorByIndex();
		if (initialAnchor) {
			let idValue = this.#getIdValueFromHref(initialAnchor.href);
			this.#showRelevantSection(idValue);
		}
	}

	#showRelevantSection(idValue) {
		/* First remove any other active tabs */
		let currentSection = this.querySelector('nav ~ [data-active]');
		if (currentSection) currentSection.removeAttribute('data-active');

		/* Now set the desired section to visible */
		this.querySelector(`#${ idValue }`).setAttribute('data-active', '');
	}

	#handleTabClicks(event) {
		/* 
			On a tab click:
			1. Check that the origin of the event is within the `nav` of the tab-group before continuing
			2. Remove any active tabs
			3. Prevent the default click action from happening.
			4. Simulate a navigation event, as if the anchor was behaving normally.
			5. Set the activeTab index, highlighting the active tab.
			6. Show the relevant section
		*/
		if (event.target.closest('nav')) {
			event.preventDefault();
			
			let currentTab = this.querySelector('nav a[aria-selected="true"]');
			if (currentTab) currentTab.removeAttribute('aria-selected');

			let anchor = event.target.closest('a[href]');
			let idValue = this.#getIdValueFromHref(anchor.href);
			anchor.setAttribute('aria-selected', 'true');
			window.history.pushState('','', `#${ idValue }`);
			this.activeTab = this.#getAnchorElemParentIndex(anchor);
			this.#showRelevantSection(idValue);
		}
	}

	connectedCallback() {
		/* 
			On startup:
			0. Set the correct roles on the tabs
			1. Check if the user-agent has followed a bookmark to a section in this tab-group
			2a. If they have, set that section and related tab to active
			2b. If they haven't, use the `data-initial` attribute (or 0) as the active tab. Then display the relevant section.
			3. Bind a click handler to any links in the tab-group's nav.
		*/
		this.#setRoleAttributes();
		this.#getMatchingAnchorFromLocation();

		if (this.hasAttribute('data-active') == false && this.initialTab != -1) {
			this.activeTab = this.initialTab;
			this.querySelector(`nav li:nth-child(${ this.activeTab + 1 }) a`).setAttribute('aria-selected', 'true');
			this.#targetInitialSection();
		}
		this.addEventListener('click', this.#handleTabClicks.bind(this));
	}

	get initialTab() {
		if (this.hasAttribute('data-initial')) {
			return parseInt(this.getAttribute('data-initial'));
		} else {
			return 0;
		}
	}

	get activeTab() {
		if (this.hasAttribute('data-active')) {
			return parseInt(this.getAttribute('data-active'));
		}
	}

	set activeTab(index) {
		this.setAttribute('data-active', index);
	}
}

customElements.define('tab-group', TabGroup);