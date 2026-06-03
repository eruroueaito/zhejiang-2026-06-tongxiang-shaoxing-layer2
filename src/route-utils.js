/**
 * 模块名称：Route utilities
 * 职责描述：提供行程点位数组与地图坐标、连接线、文本标签之间的轻量转换。
 * 输入/输出：输入日程 stop 数组；输出 Leaflet 坐标、连接段与地图边界。
 * 依赖关系：依赖 Leaflet 的 `L.latLngBounds`，无网络服务调用。
 * 注意事项：生成的是行程连接线，不代表道路、铁路或步行导航真实轨迹。
 */
window.RouteUtils = {
  toLatLng(stop) {
    return [stop[2], stop[3]];
  },

  directionDegrees(from, to) {
    const startLat = (from[2] * Math.PI) / 180;
    const endLat = (to[2] * Math.PI) / 180;
    const deltaLng = ((to[3] - from[3]) * Math.PI) / 180;
    const y = Math.sin(deltaLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(deltaLng);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  },

  pointBetween(from, to, fraction = 0.5) {
    return [
      from[2] + (to[2] - from[2]) * fraction,
      from[3] + (to[3] - from[3]) * fraction
    ];
  },

  segments(day) {
    return day.stops.slice(0, -1).map((stop, index) => ({
      from: stop,
      to: day.stops[index + 1],
      label: `${index + 1}. ${day.labels[index] || "待确认"}`,
      bearingDeg: this.directionDegrees(stop, day.stops[index + 1])
    }));
  },

  bounds(days) {
    const coords = days.flatMap((day) => day.stops.map((stop) => this.toLatLng(stop)));
    return L.latLngBounds(coords);
  }
};
