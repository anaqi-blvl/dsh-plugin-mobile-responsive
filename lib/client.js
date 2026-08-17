/**
 * dsh-mobile-responsive — browser half.
 *
 * Injects a mobile-responsive CSS layer into the dsh web GUI and exposes an
 * empty cordis plugin so the entry activates. All styling is side-effect only;
 * nothing here can throw (injection is wrapped), so this plugin can never
 * fail the web boot audit.
 */
window.__ModuleLoader__.load({
	id: "dsh-mobile-responsive",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const css = `/* dsh-mobile-responsive — phone-width layout fixes for the dsh web GUI.
   The shipped AppFrame already auto-collapses the sidebar to a 56px rail below
   1024px and closes the details column when it cannot fit; at <= 640px the two
   leftovers are: (1) expanding the sidebar pushes the center column to ~110px
   instead of overlaying, and (2) the session stats strip truncates instead of
   wrapping. Stable hooks: the frame exposes data-sidebar-collapsed and
   data-details-collapsed; the columns are its first three children. */
@media (max-width: 640px) {
	/* Expanded sidebar overlays as a drawer instead of squeezing the center */
	[data-details-collapsed]:not([data-sidebar-collapsed]) {
		grid-template-columns: 0px minmax(0, 1fr) 0px !important;
	}
	/* Sidebar leaves grid flow (fixed drawer); keep the center/details in their tracks */
	[data-details-collapsed]:not([data-sidebar-collapsed]) > :first-child {
		position: fixed !important;
		top: 0;
		bottom: 0;
		left: 0;
		z-index: 40;
		width: min(85vw, 340px) !important;
		border-right: 1px solid var(--dsw-alias-border-l2);
		box-shadow: var(--dsw-shadow-lv3);
	}
	[data-details-collapsed]:not([data-sidebar-collapsed]) > :nth-child(2) {
		grid-column: 2;
	}
	[data-details-collapsed]:not([data-sidebar-collapsed]) > :nth-child(3) {
		grid-column: 3;
	}

	/* Session stats strip (ui-conversation StatsLine): wrap instead of truncate.
	   Specificity [attr]+class beats the module's own rule regardless of style
	   tag order. Class is CSS-module-hashed; update on upgrades if it stops matching. */
	[data-details-collapsed] .FJxK0a_root {
		white-space: normal;
		overflow: visible;
	}

	/* Home-indicator safe area under the composer on notched phones */
	[data-details-collapsed] > :nth-child(2) {
		padding-bottom: env(safe-area-inset-bottom, 0px);
	}
}
`;
		const tagId = "dsh-mobile-responsive/mobile.css";
		try {
			if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
				const tag = document.createElement("style");
				tag.dataset.plugin = "dsh-mobile-responsive";
				tag.dataset.pluginCss = tagId;
				tag.textContent = css;
				document.head.appendChild(tag);
			}
		} catch {
			/* styling must never break the app */
		}

		exports.apply = function apply() {
			/* nothing to do at runtime — pure CSS */
		};
		return module.exports;
	}
});
