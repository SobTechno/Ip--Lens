const $ = (id) => document.getElementById(id);

const PROVIDERS = [
  {
    url: "https://ipwho.is/",
    map: (d) => {
      if (!d.success) throw new Error("lookup failed");
      return {
        ip: d.ip, type: d.type,
        country: d.country, cc: d.country_code,
        city: [d.city, d.region].filter(Boolean).join(", "),
        isp: (d.connection && (d.connection.isp || d.connection.org)) || "",
        asn: d.connection && d.connection.asn ? "AS" + d.connection.asn : "",
        tz: d.timezone && d.timezone.id ? d.timezone.id : ""
      };
    }
  },
  {
    url: "https://ipapi.co/json/",
    map: (d) => {
      if (d.error) throw new Error(d.reason || "lookup failed");
      return {
        ip: d.ip, type: d.version === "IPv6" ? "IPv6" : "IPv4",
        country: d.country_name, cc: d.country_code,
        city: [d.city, d.region].filter(Boolean).join(", "),
        isp: d.org || "", asn: d.asn || "", tz: d.timezone || ""
      };
    }
  }
];

async function lookup() {
  for (const p of PROVIDERS) {
    try {
      const res = await fetch(p.url, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return p.map(await res.json());
    } catch (e) { /* try next provider */ }
  }
  throw new Error("all providers failed");
}

function setText(id, value) {
  const el = $(id);
  el.replaceChildren();
  const s = document.createElement("span");
  s.textContent = value || "Unknown";
  el.appendChild(s);
}

function render(info) {
  const ip = $("ip");
  ip.classList.remove("skeleton");
  ip.classList.toggle("long", info.ip.length > 18);
  ip.textContent = info.ip;

  const ver = $("ver");
  ver.textContent = info.type || (info.ip.includes(":") ? "IPv6" : "IPv4");
  ver.hidden = false;

  const c = $("country");
  c.replaceChildren();
  if (info.cc) {
    const img = document.createElement("img");
    img.className = "flag";
    img.alt = "";
    img.src = "https://flagcdn.com/" + info.cc.toLowerCase() + ".svg";
    img.onerror = () => img.remove();
    c.appendChild(img);
  }
  const name = document.createElement("span");
  name.textContent = info.country || "Unknown";
  c.appendChild(name);

  setText("city", info.city);
  setText("isp", info.isp);
  setText("asn", info.asn);
  setText("tz", info.tz);

  $("copy").disabled = false;
  $("dot").classList.add("ok");
  $("status").textContent = "Updated " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function setLoading() {
  $("error").hidden = true;
  $("details").hidden = false;
  $("ip").classList.add("skeleton");
  $("ip").textContent = "000.000.000.000";
  $("ver").hidden = true;
  ["country", "city", "isp", "asn", "tz"].forEach((id) => {
    $(id).innerHTML = '<i class="skeleton">Loading</i>';
  });
  $("copy").disabled = true;
  $("dot").classList.remove("ok");
  $("status").textContent = "Looking up…";
}

async function load() {
  setLoading();
  $("refresh").classList.add("spin");
  try {
    render(await lookup());
  } catch (e) {
    $("details").hidden = true;
    $("error").hidden = false;
    $("ip").classList.remove("skeleton");
    $("ip").textContent = "—";
    $("status").textContent = "Offline";
  } finally {
    $("refresh").classList.remove("spin");
  }
}

$("copy").addEventListener("click", async () => {
  const btn = $("copy");
  try {
    await navigator.clipboard.writeText($("ip").textContent);
    btn.textContent = "Copied";
    btn.classList.add("done");
    setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1400);
  } catch (e) { /* clipboard unavailable */ }
});
$("refresh").addEventListener("click", load);
$("retry").addEventListener("click", load);
load();
