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
	/* The drawer is wider than the sidebar's designed 280px content (inline
	   width) — let the content fill the drawer instead of leaving a gap. */
	[data-details-collapsed]:not([data-sidebar-collapsed]) > :first-child .hHd-Xa_root {
		width: 100% !important;
	}

	/* Session stats strip (ui-conversation StatsLine): wrap instead of truncate.
	   Specificity [attr]+class beats the module's own rule regardless of style
	   tag order. Class is CSS-module-hashed; update on upgrades if it stops matching. */
	[data-details-collapsed] .FJxK0a_root {
		white-space: normal;
		overflow: visible;
	}

	/* Same strip: collapsed by default on phones — a single line with a chevron
	   affordance; tapping the strip expands the full stats (attribute toggled by
	   the plugin's click delegate, so React re-renders never wipe the state).
	   Collapse rules come after the wrap rule so overflow/max-height win.
	   The chevron is an SVG data-URI background (the app's own convention for
	   chevrons) — border-drawn pseudo chevrons are fragile on iOS. */
	[data-details-collapsed] .FJxK0a_root {
		position: relative;
		max-height: 24px;
		overflow: hidden;
		padding-right: 36px;
		cursor: pointer;
	}
	[data-details-collapsed] .FJxK0a_root[data-expanded] {
		max-height: none;
		overflow: visible;
	}
	[data-details-collapsed] .FJxK0a_root::after {
		content: "";
		width: 12px;
		height: 12px;
		color: var(--dsw-alias-label-caption);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: center;
		transition: transform .12s;
		position: absolute;
		top: 50%;
		right: 18px;
		transform: translateY(-50%);
	}
	[data-details-collapsed] .FJxK0a_root[data-expanded]::after {
		transform: translateY(-50%) rotate(180deg);
	}

	/* Home-indicator safe area under the composer on notched phones */
	[data-details-collapsed] > :nth-child(2) {
		padding-bottom: env(safe-area-inset-bottom, 0px);
	}
}

/* Settings modal (ui-settings-general): 800px panel with a fixed 188px nav
   column — on phones that leaves ~150px for the content. Stack it: full-screen
   panel, nav becomes a horizontal tab strip, content fills the rest.
   Settings' own CSS is injected on open (after ours), so these rules carry
   html-prefix specificity + !important. */
@media (max-width: 640px) {
	html .VOzbGW_panel {
		width: 100% !important;
		max-width: 100% !important;
		height: 100% !important;
		max-height: 100% !important;
		border-radius: 0 !important;
		flex-direction: column !important;
	}
	html .VOzbGW_nav {
		width: 100% !important;
		flex-direction: row !important;
		gap: 4px !important;
		padding: 8px 8px 4px !important;
		overflow-x: auto !important;
		flex: none !important;
	}
	html .VOzbGW_navTitle {
		display: none !important;
	}
	html .VOzbGW_navCell {
		flex: none !important;
		height: 36px !important;
		padding: 0 12px !important;
		font-size: 13px !important;
		line-height: 20px !important;
	}
	html .VOzbGW_header {
		height: auto !important;
		padding: 12px 12px 8px !important;
	}
	html .VOzbGW_options {
		padding: 0 16px 24px !important;
	}
}

/* User-question dialog (ui-client-user-questions): let the footer/CTA rows
   wrap and the action buttons share the row instead of overflowing. */
@media (max-width: 640px) {
	html .Mbwy4a_footer, html .LVzXQa_footer {
		flex-wrap: wrap !important;
	}
	html .Mbwy4a_footerActions, html .LVzXQa_actions {
		flex-wrap: wrap !important;
		flex: 1 1 auto !important;
		justify-content: flex-end !important;
	}
	html .Mbwy4a_footerActions > *, html .LVzXQa_actions > * {
		flex: 1 1 auto !important;
		min-width: 0 !important;
	}
	html .LVzXQa_strip {
		flex-wrap: wrap !important;
	}
}

/* Composer control row: below 460px the row is tighter than its items, so the
   right-anchored model selector (trailing has flex:none upstream) paints over
   the workspace picker. Let the trailing shrink and cap the model trigger so
   its label truncates with ellipsis and clears the workspace control. 460px
   mirrors the workspace picker's own label-hide container query. */
@media (max-width: 460px) {
	[data-details-collapsed] .uV2eYG_trailing {
		flex: 0 1 auto !important;
	}
	[data-details-collapsed] ._7KE1Ra_trigger {
		max-width: 22vw !important;
	}
}

/* Lock the page on touch devices: the app is a fixed shell (the frame is
   overflow:hidden), but html/body default to overflow:visible, so on mobile
   the whole app can still scroll — iOS URL-bar resizing, rubber-band
   overscroll at the chat's top/bottom, Android pull-to-refresh. Pinning the
   page height + overflow leaves only the chat's own scroll container moving.
   dvh tracks the collapsing iOS URL bar so the app never overflows the page. */
@media (max-width: 1023px) {
	html, body {
		height: 100%;
		overflow: hidden;
		overscroll-behavior: none;
	}
	html {
		height: 100dvh;
	}
}

/* iOS WebKit: position: sticky stops working when an ancestor is
   overflow: hidden — WebKit treats the hidden ancestor as a scroll container
   and anchors the sticky element to it, so the composer scrolls away with the
   messages. The conversation root (active), the center column and the frame
   are all overflow: hidden. Switching them to overflow: clip clips identically
   but carries no scroll-container semantics. Fallback lines keep older
   Safari (no clip support) unchanged. */
@media (max-width: 1023px) {
	[data-details-collapsed] {
		overflow: hidden;
		overflow: clip !important;
	}
	[data-details-collapsed] > :nth-child(2) {
		overflow: hidden;
		overflow: clip !important;
	}
	[data-details-collapsed] .wSkVaW_root[data-phase="active"] {
		overflow: hidden;
		overflow: clip !important;
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
			if (typeof document === "undefined" || typeof window === "undefined") return;
			const STATS_CLASS = ".FJxK0a_root";
			const isMobile = () => window.matchMedia("(max-width: 640px)").matches;
			/* The stats strip doubles as its own toggle: taps expand/collapse it
			   (mobile only). Imperative attribute + delegation — the element
			   re-renders every second (live timers), so React-managed state would
			   be lost; a DOM-level attribute is not. */
			const onToggle = (el) => {
				const expanded = el.hasAttribute("data-expanded");
				el.toggleAttribute("data-expanded", !expanded);
				el.setAttribute("aria-expanded", String(!expanded));
			};
			/* pointerup + click can both fire for one tap; dedupe within 400ms. */
			let lastToggleAt = 0;
			const toggleFrom = (el) => {
				const now = Date.now();
				if (now - lastToggleAt < 400) return;
				lastToggleAt = now;
				onToggle(el);
			};
			const statsFrom = (t) => t instanceof Element ? t.closest(STATS_CLASS) : null;
			const onPointerUp = (e) => {
				if (!isMobile() || e.button !== 0) return;
				const el = statsFrom(e.target);
				if (!el) return;
				e.stopPropagation();
				toggleFrom(el);
			};
			const onClick = (e) => {
				if (!isMobile()) return;
				const el = statsFrom(e.target);
				if (!el) return;
				e.stopPropagation();
				toggleFrom(el);
			};
			const onKeyDown = (e) => {
				if (!isMobile()) return;
				if (e.key !== "Enter" && e.key !== " ") return;
				const el = statsFrom(e.target);
				if (!el) return;
				e.preventDefault();
				onToggle(el);
			};
			document.addEventListener("pointerup", onPointerUp);
			document.addEventListener("click", onClick);
			document.addEventListener("keydown", onKeyDown);
			/* Tapping a chat in the open drawer should land you straight in that
			   chat: let the row's own click navigate first, then collapse the
			   drawer on the next frames. */
			const onNavTap = (e) => {
				if (!isMobile()) return;
				const t = e.target instanceof Element ? e.target : null;
				if (!t) return;
				if (!t.closest("[class*=sessionRow]") && !t.closest('[aria-label="New session"]')) return;
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						document.querySelector('[aria-label="Collapse sidebar"]')?.click();
					});
				});
			};
			document.addEventListener("pointerup", onNavTap);
			/* Make the strip keyboard/screen-reader friendly once it mounts
			   (imperative attributes survive React re-renders). */
			let mo = null;
			try {
				mo = new MutationObserver(() => {
					if (!isMobile()) return;
					const el = document.querySelector(STATS_CLASS);
					if (el && !el.hasAttribute("role")) {
						el.setAttribute("role", "button");
						el.setAttribute("tabindex", "0");
						el.setAttribute("aria-expanded", el.hasAttribute("data-expanded") ? "true" : "false");
					}
				});
				mo.observe(document.body, { childList: true, subtree: true });
			} catch {
				mo = null;
			}
			return () => {
				document.removeEventListener("pointerup", onPointerUp);
				document.removeEventListener("click", onClick);
				document.removeEventListener("keydown", onKeyDown);
				document.removeEventListener("pointerup", onNavTap);
				mo?.disconnect();
			};
		};
		return module.exports;
	}
});
