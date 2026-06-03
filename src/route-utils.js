/**
 * 模块名称：Amap route utilities
 * 职责描述：把行程 POI 与相邻交通段转换为高德 JSAPI 可绘制的方向路线数据。
 * 输入/输出：输入 `TRIP_DATA`；输出 POI 查询、[lng, lat] 坐标、路线段和地图边界工具。
 * 依赖关系：依赖浏览器 `window` 对象，无网络服务调用。
 * 注意事项：生成的是行程连接线；高铁段不是实时铁路轨迹，市内段不是逐路口导航轨迹。
 */
(function exposeRouteUtils() {
  function getPoiById(data, id) {
    return data.pois.find((poi) => poi.id === id);
  }

  function coordinatesOf(poi) {
    const coordinates = poi.coordinates || {};
    const lng = Number(coordinates.lng ?? poi.lng);
    const lat = Number(coordinates.lat ?? poi.lat);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      throw new Error(`Invalid coordinates for ${poi.id}`);
    }
    return [lng, lat];
  }

  function midpoint(path, fraction = 0.5) {
    const [start, end] = path;
    return [
      start[0] + (end[0] - start[0]) * fraction,
      start[1] + (end[1] - start[1]) * fraction,
    ];
  }

  function transportGeometry(segment) {
    return segment.recommended?.geometry || (segment.train ? "rail" : "driving");
  }

  function transportLabel(segment) {
    return segment.recommended?.label || segment.transit?.route || segment.train || "待确认交通";
  }

  function createRouteSegments(data) {
    return data.days.flatMap((day) => day.segments.map((segment, index) => {
      const fromPoi = getPoiById(data, segment.from);
      const toPoi = getPoiById(data, segment.to);
      if (!fromPoi || !toPoi) {
        throw new Error(`Missing POI for segment ${day.id} #${index + 1}`);
      }
      const path = [coordinatesOf(fromPoi), coordinatesOf(toPoi)];
      const geometry = transportGeometry(segment);
      return {
        ...segment,
        id: `${day.id}-${index + 1}-${segment.from}-${segment.to}`,
        dayId: day.id,
        dayDate: day.date,
        dayTitle: day.title,
        color: day.color,
        order: index + 1,
        fromPoi,
        toPoi,
        path,
        geometry,
        label: transportLabel(segment),
        train: segment.train || segment.transit?.route || null,
        showDir: true,
      };
    }));
  }

  function bounds(data) {
    const points = data.pois.map(coordinatesOf);
    const lngs = points.map((point) => point[0]);
    const lats = points.map((point) => point[1]);
    return {
      southWest: [Math.min(...lngs), Math.min(...lats)],
      northEast: [Math.max(...lngs), Math.max(...lats)],
      center: [
        (Math.min(...lngs) + Math.max(...lngs)) / 2,
        (Math.min(...lats) + Math.max(...lats)) / 2,
      ],
    };
  }

  window.RouteUtils = {
    getPoiById,
    coordinatesOf,
    midpoint,
    createRouteSegments,
    bounds,
  };
})();
