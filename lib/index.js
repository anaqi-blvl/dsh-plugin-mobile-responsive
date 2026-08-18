/**
 * Node half of dsh-mobile-responsive. Besides being a loadable entry, it serves
 * the iOS "Add to Home Screen" icon (assets/apple-touch-icon.png) at a stable
 * URL the browser half links via <link rel="apple-touch-icon">.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICON_PATH = join(dirname(fileURLToPath(import.meta.url)), "../assets/apple-touch-icon.png");

export const inject = ["webServer"];

export function apply(ctx) {
	ctx.effect(() => ctx.webServer.register({
		kind: "exact",
		path: "/dsh-mobile-icon.png",
		handler: async (req, res) => {
			if (req.method !== "GET" && req.method !== "HEAD") {
				res.writeHead(405);
				res.end();
				return;
			}
			try {
				const body = await readFile(ICON_PATH);
				res.writeHead(200, {
					"content-type": "image/png",
					"cache-control": "public, max-age=86400"
				});
				res.end(body);
			} catch {
				res.writeHead(404);
				res.end();
			}
		}
	}), "dsh-mobile-responsive: apple icon route");
}
