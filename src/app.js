/**
 * 模块名称：Zhejiang Amap itinerary app
 * 职责描述：渲染三天行程侧栏、高德地图 POI 标记、带原生方向箭头的行程连接线和路线标签。
 * 输入/输出：读取 `window.TRIP_DATA`、`window.RouteUtils` 和 `window.AMAP_CONFIG`；输出交互式高德地图页面。
 * 依赖关系：依赖高德 JSAPI v2.0 Loader、Amap Polyline/Marker/InfoWindow、前端行程数据和路线工具。
 * 注意事项：高德 `showDir` 负责箭头样式；线条是行程连接线，不替代购票、预约或实时导航。
 */
(async function initZhejiangAmapItinerary() {
  const data = window.TRIP_DATA;
  const utils = window.RouteUtils;
  const config = window.AMAP_CONFIG;
  const routeSegments = utils.createRouteSegments(data);
  const markerByPoiId = new Map();
  const routeOverlays = [];

  window.__AMAP_ROUTE_STATUS = {
    planned: routeSegments.length,
    completed: 0,
    failed: 0,
    directional: 0,
  };

  function syncRouteStatus() {
    document.documentElement.dataset.amapRouteStatus = JSON.stringify(window.__AMAP_ROUTE_STATUS);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function segmentForDay(day, index) {
    return day.segments[index] || null;
  }

  function renderSummary() {
    document.getElementById("trip-title").textContent = data.title;
    document.getElementById("trip-subtitle").textContent = data.subtitle;
    const totalRailFare = data.rail.reduce((sum, item) => sum + item.second_class_cny, 0);
    document.getElementById("summary-list").innerHTML = [
      ["行程", "6/8 泰州出发，6/10 回到泰州"],
      ["主线", "泰州 -> 张家港 -> 桐乡 -> 绍兴 -> 杭州东 -> 泰州"],
      ["车票", `二等座合计约 ${totalRailFare} 元，均为 2026-06-03 刷新`],
      ["版本", data.version],
    ].map(([label, value]) => `
      <article class="summary-item">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </article>
    `).join("");
  }

  function segmentDetail(segment) {
    if (!segment) return "当天最后一站";
    const parts = [segment.recommended?.label || segment.transit?.route || "交通待确认"];
    if (segment.train) parts.push(segment.train);
    if (segment.transit?.fare_cny) parts.push(`二等座 ${segment.transit.fare_cny} 元`);
    if (segment.driving?.distance_m) parts.push(`${(segment.driving.distance_m / 1000).toFixed(1)} km`);
    if (segment.walking?.distance_m) parts.push(`${Math.round(segment.walking.distance_m)} m`);
    if (segment.transit?.note) parts.push(segment.transit.note);
    return parts.join(" · ");
  }

  function renderItinerary() {
    const list = document.getElementById("itinerary-list");
    list.innerHTML = data.days.map((day) => `
      <article class="day-card" style="--day-color:${day.color}">
        <header class="day-header">
          <span>${escapeHtml(day.date)}</span>
          <h2>${escapeHtml(day.title)}</h2>
          <p>${escapeHtml(day.summary)}</p>
          <div class="day-base">${escapeHtml(day.base)}</div>
        </header>
        <ol class="timeline">
          ${day.schedule.map((item) => `
            <li>
              <time>${escapeHtml(item.time)}</time>
              <div>
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.text)}</p>
              </div>
            </li>
          `).join("")}
        </ol>
        <div class="stop-list">
          ${day.pois.map((poiId, index) => {
            const poi = utils.getPoiById(data, poiId);
            const nextSegment = segmentForDay(day, index);
            return `
              <button class="stop-button" type="button" data-day="${day.id}" data-index="${index}">
                <span>${index + 1}</span>
                <strong>${escapeHtml(poi.name_zh)}</strong>
                <small>${escapeHtml(poi.note || poi.opening || "")}</small>
                <em>${escapeHtml(segmentDetail(nextSegment))}</em>
              </button>
            `;
          }).join("")}
        </div>
      </article>
    `).join("");
  }

  function popupHtml(poi) {
    return `
      <div class="popup-title">${escapeHtml(poi.name_zh)}</div>
      <div class="popup-meta">${escapeHtml(poi.type)}<br>${escapeHtml(poi.note || poi.opening || "")}</div>
    `;
  }

  function routeStroke(segment) {
    if (segment.geometry === "rail") return { weight: 7, opacity: 0.82, style: "dashed", dash: [12, 8] };
    if (segment.geometry === "walking") return { weight: 5, opacity: 0.78, style: "solid", dash: [0, 0] };
    return { weight: 6, opacity: 0.86, style: "solid", dash: [0, 0] };
  }

  function routeLabelHtml(segment) {
    const train = segment.train ? `<b>${escapeHtml(segment.train)}</b>` : "";
    return `<div class="route-label" style="border-color:${segment.color}">${train}<span>${segment.order}. ${escapeHtml(segment.label)}</span></div>`;
  }

  function setMapError(message) {
    document.getElementById("map").innerHTML = `<div class="map-error">${escapeHtml(message)}</div>`;
    window.__AMAP_ROUTE_STATUS.failed = window.__AMAP_ROUTE_STATUS.planned;
    syncRouteStatus();
  }

  syncRouteStatus();
  renderSummary();
  renderItinerary();

  window._AMapSecurityConfig = {
    securityJsCode: config.securityJsCode,
  };

  try {
    const AMap = await AMapLoader.load({
      key: config.jsApiKey,
      version: "2.0",
      plugins: ["AMap.Scale", "AMap.ToolBar"],
    });

    const mapBounds = utils.bounds(data);
    const map = new AMap.Map("map", {
      viewMode: "2D",
      zoom: 7,
      center: mapBounds.center,
      mapStyle: "amap://styles/normal",
    });
    map.addControl(new AMap.Scale());
    map.addControl(new AMap.ToolBar({ position: "RT" }));

    const infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });

    for (const poi of data.pois) {
      const marker = new AMap.Marker({
        position: utils.coordinatesOf(poi),
        title: poi.name_zh,
        anchor: "bottom-center",
        zIndex: poi.recommendation === "must" ? 110 : 90,
      });
      marker.on("click", () => {
        infoWindow.setContent(popupHtml(poi));
        infoWindow.open(map, marker.getPosition());
      });
      markerByPoiId.set(poi.id, marker);
      map.add(marker);
    }

    for (const segment of routeSegments) {
      const stroke = routeStroke(segment);
      const line = new AMap.Polyline({
        path: segment.path,
        strokeColor: segment.color,
        strokeWeight: stroke.weight,
        strokeOpacity: stroke.opacity,
        strokeStyle: stroke.style,
        strokeDasharray: stroke.dash,
        lineJoin: "round",
        lineCap: "round",
        showDir: true,
        zIndex: segment.geometry === "rail" ? 70 : 80,
      });
      const label = new AMap.Marker({
        position: utils.midpoint(segment.path, segment.geometry === "rail" ? 0.52 : 0.58),
        content: routeLabelHtml(segment),
        anchor: "center",
        zIndex: 120,
      });
      routeOverlays.push(line, label);
      map.add([line, label]);
      window.__AMAP_ROUTE_STATUS.completed += 1;
      window.__AMAP_ROUTE_STATUS.directional += 1;
      syncRouteStatus();
    }

    function fitRoute() {
      map.setFitView(
        [...markerByPoiId.values(), ...routeOverlays],
        false,
        [40, 40, 40, 40]
      );
    }

    document.getElementById("fit-route").addEventListener("click", fitRoute);
    document.getElementById("itinerary-list").addEventListener("click", (event) => {
      const button = event.target.closest(".stop-button");
      if (!button) return;
      const day = data.days.find((item) => item.id === button.dataset.day);
      const poi = utils.getPoiById(data, day.pois[Number(button.dataset.index)]);
      const position = utils.coordinatesOf(poi);
      map.setZoomAndCenter(13, position);
      const marker = markerByPoiId.get(poi.id);
      infoWindow.setContent(popupHtml(poi));
      infoWindow.open(map, marker?.getPosition?.() || position);
    });

    fitRoute();
  } catch (error) {
    console.error(error);
    setMapError("高德地图加载失败，请检查网络或 JSAPI Key。");
  }
})();
