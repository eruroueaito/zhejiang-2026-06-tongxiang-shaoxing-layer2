/**
 * 模块名称：Layer 2 map app
 * 职责描述：渲染桐乡-绍兴 Layer 2 路线地图、日程卡片和相邻交通标签。
 * 输入/输出：读取 `window.TRIP_DATA`；输出浏览器页面中的地图标记、连接线和行程列表。
 * 依赖关系：依赖 Leaflet、`src/trip-data.js` 和 `src/route-utils.js`。
 * 注意事项：地图线条为行程连接线；购票、开放时间、预约状态仍需出行前刷新。
 */
const data = window.TRIP_DATA;
const map = L.map("map", { zoomControl: true }).setView([30.1, 120.56], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const dayLayerGroups = new Map();
const list = document.querySelector("#itinerary-list");

for (const day of data.days) {
  const group = L.layerGroup().addTo(map);
  dayLayerGroups.set(day.id, group);

  const section = document.createElement("section");
  section.className = "day-card";
  section.innerHTML = `<h2>${day.title}</h2>`;

  for (const stop of day.stops) {
    const marker = L.circleMarker(window.RouteUtils.toLatLng(stop), {
      radius: 7,
      color: day.color,
      fillColor: day.color,
      fillOpacity: 0.86,
      weight: 2
    }).bindPopup(`<strong>${stop[1]}</strong><br>${stop[4]}`);
    marker.addTo(group);
  }

  for (const segment of window.RouteUtils.segments(day)) {
    const line = L.polyline([window.RouteUtils.toLatLng(segment.from), window.RouteUtils.toLatLng(segment.to)], {
      color: day.color,
      weight: 4,
      opacity: 0.72,
      dashArray: segment.label.includes("D3107") ? "8 8" : ""
    }).addTo(group);
    L.marker(window.RouteUtils.pointBetween(segment.from, segment.to, 0.62), {
      icon: L.divIcon({
        className: "route-label",
        html: segment.label,
        iconSize: [120, 24],
        iconAnchor: [60, 12]
      }),
      interactive: false
    }).addTo(group);
    L.marker(window.RouteUtils.pointBetween(segment.from, segment.to, 0.42), {
      icon: L.divIcon({
        className: "direction-arrow",
        html: `<span class="direction-arrow-inner" style="transform: rotate(${segment.bearingDeg.toFixed(1)}deg)"></span>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      }),
      interactive: false
    }).addTo(group);
    line.bindTooltip(segment.label);
  }

  const orderedStops = document.createElement("ol");
  day.stops.forEach((stop, index) => {
    const item = document.createElement("li");
    item.innerHTML = `<button type="button" data-day="${day.id}" data-index="${index}">${stop[1]}</button><span>${stop[4]}</span>`;
    orderedStops.appendChild(item);
  });
  section.appendChild(orderedStops);
  list.appendChild(section);
}

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-day]");
  if (!button) return;
  const day = data.days.find((item) => item.id === button.dataset.day);
  const stop = day.stops[Number(button.dataset.index)];
  map.setView(window.RouteUtils.toLatLng(stop), 15);
});

document.querySelector("#fit-route").addEventListener("click", () => {
  map.fitBounds(window.RouteUtils.bounds(data.days), { padding: [24, 24] });
});

map.fitBounds(window.RouteUtils.bounds(data.days), { padding: [24, 24] });
