import "./style.css";

export function frontendTemplate(
  apiDomain: string,
  title: string,
  shouldSetCookie = true
) {
  return () => {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
      <div>
        <h1>${title}</h1>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1rem;">
          <div>
            <h3>Read Cookie via API</h3>
            <pre id="log-api" style="background:#f6f8fa; padding:1rem; border-radius:6px; height:300px; overflow:auto;"></pre>
          </div>
          <div>
            <h3>Read Cookie via JavaScript</h3>
            <pre id="log-js" style="background:#f6f8fa; padding:1rem; border-radius:6px; height:300px; overflow:auto;"></pre>
          </div>
        </div>
      </div>
    `;

    function log(id: string, msg: any) {
      const el = document.getElementById(id)!;
      el.textContent =
        typeof msg === "object" ? JSON.stringify(msg, null, 2) : String(msg);
    }

    const setCookie = () =>
      fetch(`${apiDomain}/set-cookie`, { credentials: "include" }).then((r) =>
        r.json()
      );
    const setHttpCookie = () =>
      fetch(`${apiDomain}/set-http-only-cookie`, {
        credentials: "include",
      }).then((r) => r.json());
    const clearCookies = () =>
      fetch(`${apiDomain}/clear-cookies`, { credentials: "include" }).then(
        (r) => r.json()
      );
    const readCookieFromApi = () =>
      fetch(`${apiDomain}/read-cookie`, { credentials: "include" }).then((r) =>
        r.json()
      );
    const readCookieViaJS = () => Promise.resolve(document.cookie);

    function cookieParser(header: string = "") {
      return Object.fromEntries(
        header
          .split("; ")
          .map((p) => {
            const [k, ...v] = p.split("=");
            return [k, v.join("=")];
          })
          .filter(([k]) => k.startsWith("mol"))
      );
    }

    (async () => {
      await clearCookies();

      try {
        if (shouldSetCookie) {
          await setCookie();
          await setHttpCookie();
        }

        const { cookie } = await readCookieFromApi();
        log("log-api", cookieParser(cookie));

        const jsCookie = await readCookieViaJS();
        log("log-js", cookieParser(jsCookie));
      } catch (e) {
        console.error(e);
      }
    })();
  };
}
