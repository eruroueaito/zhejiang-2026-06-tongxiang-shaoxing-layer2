/**
 * 模块名称：Zhejiang trip data
 * 职责描述：加载 2026 年 6 月泰州、桐乡、绍兴三天路线的结构化点位、日程和交通段。
 * 输入/输出：无入参；向浏览器全局暴露 `window.TRIP_DATA` 供地图渲染模块读取。
 * 依赖关系：依赖浏览器 `window` 对象；数据内容与 `data/trip-data.json` 保持一致。
 * 注意事项：路线线条只表示行程连接顺序，不是实时导航轨迹；购票、预约和开放状态仍需出行前刷新。
 */
window.TRIP_DATA = JSON.parse(String.raw`{
  "title": "2026-06 泰州 - 桐乡 - 绍兴三天路线",
  "subtitle": "6月8日泰州出发到桐乡见朋友，6月9日 D3107 到绍兴，6月10日 D3296 + D3126 经杭州东回泰州。",
  "version": "A：绍兴老城路线，不加入兰亭",
  "must_see_poi_ids": ["luxun_native_place"],
  "source_notes": [
    "12306 刷新日期：2026-06-03；页面信息用于规划，购票前仍需再次刷新余票。",
    "地图线条是行程连接线，高铁段不是实时铁路轨迹，市内段按高德坐标连接并使用高德原生方向箭头。",
    "6月8日主方案保留 C3897，因为它给张家港同站换乘留 56 分钟；C3855 10:36 也可接 G7539，但换乘只剩 31 分钟。"
  ],
  "pois": [
    {"id":"taizhou_station","name":"Taizhou Railway Station","name_zh":"泰州站","coordinates":{"lng":119.980546,"lat":32.528857},"type":"station","recommendation":"strong","note":"6月8日出发站，6月10日晚返程终点。"},
    {"id":"zhangjiagang_station","name":"Zhangjiagang Railway Station","name_zh":"张家港站","coordinates":{"lng":120.674056,"lat":31.817334},"type":"station","recommendation":"strong","note":"6月8日 C3897 与 G7539 同站换乘点。"},
    {"id":"tongxiang_station","name":"Tongxiang Railway Station","name_zh":"桐乡站","coordinates":{"lng":120.567363,"lat":30.537324},"type":"station","recommendation":"strong","note":"6月8日抵达桐乡，6月9日乘 D3107 出发。"},
    {"id":"tongxiang_hanting","name":"Hanting Hotel Tongxiang Xiaochang East Road","name_zh":"汉庭酒店(桐乡校场东路店)","coordinates":{"lng":120.582786,"lat":30.620247},"type":"hotel","recommendation":"strong","note":"6月8日晚桐乡住宿点，位于桐乡站与浙江传媒学院桐乡校区之间。"},
    {"id":"zhejiang_media_university_tongxiang","name":"Communication University of Zhejiang Tongxiang Campus","name_zh":"浙江传媒学院桐乡校区","coordinates":{"lng":120.526516,"lat":30.647393},"type":"campus","recommendation":"strong","note":"6月8日唯一固定任务：见朋友。"},
    {"id":"shaoxing_north","name":"Shaoxing North Railway Station","name_zh":"绍兴北站","coordinates":{"lng":120.539485,"lat":30.098661},"type":"station","recommendation":"strong","note":"6月9日抵达绍兴，6月10日返程出发。"},
    {"id":"shaoxing_hanting_luxun","name":"Hanting Hotel Shaoxing Lu Xun Native Place","name_zh":"汉庭酒店(绍兴鲁迅故里店)","coordinates":{"lng":120.586176,"lat":29.996166},"type":"hotel","recommendation":"strong","note":"绍兴住宿点，人民中路216号。"},
    {"id":"luxun_native_place","name":"Lu Xun Native Place","name_zh":"鲁迅故里","coordinates":{"lng":120.584419,"lat":29.993263},"type":"must-see","recommendation":"must","opening":"通常周二至周日 08:30-21:00；出行前刷新预约和入园截止时间。","note":"本次绍兴必去点。"},
    {"id":"shen_garden","name":"Shen Garden","name_zh":"沈园","coordinates":{"lng":120.590035,"lat":29.990303},"type":"garden","recommendation":"strong","opening":"高德记录约 08:00-21:00；出行前刷新。"},
    {"id":"cangqiao_street","name":"Cangqiao Straight Street","name_zh":"仓桥直街","coordinates":{"lng":120.577947,"lat":29.997525},"type":"old-street","recommendation":"strong","note":"6月9日晚餐和夜游段。"},
    {"id":"shusheng_guli","name":"Shusheng Guli","name_zh":"书圣故里","coordinates":{"lng":120.58574,"lat":30.008014},"type":"historic-district","recommendation":"strong","note":"6月10日上午轻量老城段。"},
    {"id":"bazhiqiao","name":"Bazhiqiao","name_zh":"八字桥","coordinates":{"lng":120.591561,"lat":29.999705},"type":"historic-bridge","recommendation":"strong","note":"与书圣故里搭配，避免上午拉去兰亭造成返程压力。"},
    {"id":"hangzhou_east","name":"Hangzhou East Railway Station","name_zh":"杭州东站","coordinates":{"lng":120.212605,"lat":30.290846},"type":"station","recommendation":"strong","note":"6月10日 D3296 与 D3126 同站换乘点。"}
  ],
  "days": [
    {
      "id":"day-1",
      "date":"2026-06-08",
      "title":"6/8 泰州出发，到桐乡住下并见朋友",
      "color":"#0f766e",
      "base":"桐乡：汉庭酒店(桐乡校场东路店)",
      "summary":"主任务只有抵达桐乡和去浙江传媒学院桐乡校区见朋友，其他时间留作换乘、放行李和晚饭缓冲。",
      "pois":["taizhou_station","zhangjiagang_station","tongxiang_station","tongxiang_hanting","zhejiang_media_university_tongxiang","tongxiang_hanting"],
      "schedule":[
        {"time":"09:35","title":"到泰州站","text":"预留取票、安检和候车时间。若从市区打车，按实际住址再倒推 20-40 分钟。"},
        {"time":"10:03-11:29","title":"C3897 泰州 -> 张家港","text":"二等座 62 元，2026-06-03 刷新显示有票。"},
        {"time":"11:29-12:25","title":"张家港站同站换乘","text":"主方案换乘 56 分钟，适合不赶。更晚备选是 C3855 10:36-11:54，但只剩 31 分钟换乘。"},
        {"time":"12:25-14:10","title":"G7539 张家港 -> 桐乡","text":"二等座 116 元，2026-06-03 刷新显示有票。"},
        {"time":"14:10-14:35","title":"桐乡站 -> 汉庭酒店","text":"建议打车，约 11.3 km / 20 分钟，先放行李。"},
        {"time":"14:35-15:00","title":"入住/寄存缓冲","text":"酒店为汉庭酒店(桐乡校场东路店)，比车站区更靠近学校。"},
        {"time":"15:00-18:30","title":"去浙江传媒学院桐乡校区见朋友","text":"酒店到校区约 7.6 km / 16 分钟，建议打车往返。"},
        {"time":"18:30-20:30","title":"晚饭与返回酒店","text":"这晚不安排其他景点，把时间留给朋友和休息。"},
        {"time":"20:30 后","title":"住桐乡","text":"次日 10:00 左右从酒店出发去桐乡站，接 D3107。"}
      ],
      "segments":[
        {"from":"taizhou_station","to":"zhangjiagang_station","train":"C3897","transit":{"route":"C3897","duration_min":86,"fare_cny":62,"note":"泰州 10:03 -> 张家港 11:29；二等座有票，2026-06-03 刷新。"},"recommended":{"mode":"rail","minutes":86,"label":"C3897 1小时26分","geometry":"rail"}},
        {"from":"zhangjiagang_station","to":"tongxiang_station","train":"G7539","transit":{"route":"G7539","duration_min":105,"fare_cny":116,"note":"张家港 12:25 -> 桐乡 14:10；二等座有票，2026-06-03 刷新。"},"recommended":{"mode":"rail","minutes":105,"label":"G7539 1小时45分","geometry":"rail"}},
        {"from":"tongxiang_station","to":"tongxiang_hanting","driving":{"distance_m":11301,"duration_min":20},"transit":{"note":"带行李建议打车。"},"recommended":{"mode":"taxi","minutes":20,"label":"打车约20分钟","geometry":"driving"}},
        {"from":"tongxiang_hanting","to":"zhejiang_media_university_tongxiang","driving":{"distance_m":7600,"duration_min":16},"transit":{"note":"去校区见朋友，建议打车。"},"recommended":{"mode":"taxi","minutes":16,"label":"打车约16分钟","geometry":"driving"}},
        {"from":"zhejiang_media_university_tongxiang","to":"tongxiang_hanting","driving":{"distance_m":7600,"duration_min":16},"transit":{"note":"晚饭后回酒店休息。"},"recommended":{"mode":"taxi","minutes":16,"label":"打车约16分钟","geometry":"driving"}}
      ]
    },
    {
      "id":"day-2",
      "date":"2026-06-09",
      "title":"6/9 D3107 到绍兴，鲁迅故里核心半日",
      "color":"#2563eb",
      "base":"绍兴：汉庭酒店(绍兴鲁迅故里店)",
      "summary":"按用户确认的 D3107 10:57 出发，午后主攻鲁迅故里，傍晚接沈园和仓桥直街。",
      "pois":["tongxiang_hanting","tongxiang_station","shaoxing_north","shaoxing_hanting_luxun","luxun_native_place","shen_garden","cangqiao_street","shaoxing_hanting_luxun"],
      "schedule":[
        {"time":"10:00","title":"桐乡酒店出发","text":"从汉庭酒店(桐乡校场东路店)打车去桐乡站，约 20 分钟。"},
        {"time":"10:25-10:50","title":"桐乡站候车","text":"D3107 是用户选定的下一班 10:57 出发车次。"},
        {"time":"10:57-11:45","title":"D3107 桐乡 -> 绍兴北","text":"二等座 35 元，2026-06-03 刷新显示有票。"},
        {"time":"11:45-12:20","title":"绍兴北 -> 绍兴汉庭","text":"建议打车，约 15.6 km / 23-25 分钟。"},
        {"time":"12:20-13:20","title":"午饭/寄存/入住","text":"酒店为汉庭酒店(绍兴鲁迅故里店)，人民中路216号。"},
        {"time":"13:30-16:20","title":"鲁迅故里","text":"本次绍兴必去点，优先把展馆、故居和街区完整看完。"},
        {"time":"16:40-18:00","title":"沈园","text":"从鲁迅故里步行约 840 m，作为同一片区的补充点。"},
        {"time":"18:20-20:00","title":"仓桥直街","text":"晚饭和夜游，沈园过去步行偏长，建议打车或骑行。"},
        {"time":"20:15","title":"返回绍兴酒店","text":"保留早休息，次日上午走轻量老城线。"}
      ],
      "segments":[
        {"from":"tongxiang_hanting","to":"tongxiang_station","driving":{"distance_m":11301,"duration_min":20},"transit":{"note":"带行李建议打车。"},"recommended":{"mode":"taxi","minutes":20,"label":"打车约20分钟","geometry":"driving"}},
        {"from":"tongxiang_station","to":"shaoxing_north","train":"D3107","transit":{"route":"D3107","duration_min":48,"fare_cny":35,"note":"桐乡 10:57 -> 绍兴北 11:45；二等座有票，2026-06-03 刷新。"},"recommended":{"mode":"rail","minutes":48,"label":"D3107 48分钟","geometry":"rail"}},
        {"from":"shaoxing_north","to":"shaoxing_hanting_luxun","driving":{"distance_m":15583,"duration_min":23},"transit":{"note":"带行李建议打车。"},"recommended":{"mode":"taxi","minutes":25,"label":"打车约25分钟","geometry":"driving"}},
        {"from":"shaoxing_hanting_luxun","to":"luxun_native_place","walking":{"distance_m":962,"duration_min":20},"recommended":{"mode":"walk","minutes":20,"label":"步行约20分钟","geometry":"walking"}},
        {"from":"luxun_native_place","to":"shen_garden","walking":{"distance_m":840,"duration_min":20},"recommended":{"mode":"walk","minutes":20,"label":"步行约20分钟","geometry":"walking"}},
        {"from":"shen_garden","to":"cangqiao_street","walking":{"distance_m":1831,"duration_min":35},"transit":{"note":"步行可行但偏长；晚间更建议打车或骑行。"},"recommended":{"mode":"taxi","minutes":12,"label":"打车/骑行约12分钟","geometry":"driving"}},
        {"from":"cangqiao_street","to":"shaoxing_hanting_luxun","walking":{"distance_m":1100,"duration_min":18},"transit":{"note":"饭后可步行回酒店；疲劳或下雨就打车。"},"recommended":{"mode":"walk","minutes":18,"label":"步行约18分钟","geometry":"walking"}}
      ]
    },
    {
      "id":"day-3",
      "date":"2026-06-10",
      "title":"6/10 老城上午，下午经杭州东回泰州",
      "color":"#b45309",
      "base":"绍兴 -> 杭州东 -> 泰州",
      "summary":"上午只放书圣故里和八字桥，不压兰亭；下午留足取行李、去站和杭州东同站换乘时间。",
      "pois":["shaoxing_hanting_luxun","shusheng_guli","bazhiqiao","shaoxing_hanting_luxun","shaoxing_north","hangzhou_east","taizhou_station"],
      "schedule":[
        {"time":"08:45","title":"退房并寄存行李","text":"把行李留在汉庭，上午只带随身物品走老城。"},
        {"time":"09:10-10:40","title":"书圣故里","text":"王羲之相关的老城片区，替代兰亭作为轻量书法主题。"},
        {"time":"10:50-11:30","title":"八字桥","text":"与书圣故里相邻，适合补一个古桥/水巷点。"},
        {"time":"11:45-13:20","title":"午饭和休息","text":"回酒店附近吃饭，避免下午带着疲劳赶车。"},
        {"time":"13:20-15:00","title":"缓冲与取行李","text":"天气差、景点拖时、午饭排队都可以用这段吸收。"},
        {"time":"15:10-15:40","title":"打车去绍兴北站","text":"建议 15:40 左右到站，给 16:27 的 D3296 留足余量。"},
        {"time":"16:27-16:48","title":"D3296 绍兴北 -> 杭州东","text":"二等座 17 元，2026-06-03 刷新显示有票。"},
        {"time":"16:48-17:30","title":"杭州东同站换乘","text":"换乘 42 分钟，重点是看清检票口和站内流线。"},
        {"time":"17:30-21:06","title":"D3126 杭州东 -> 泰州","text":"二等座 183 元，2026-06-03 刷新显示有票，21:06 到泰州。"}
      ],
      "segments":[
        {"from":"shaoxing_hanting_luxun","to":"shusheng_guli","walking":{"distance_m":1600,"duration_min":25},"recommended":{"mode":"walk","minutes":25,"label":"步行约25分钟","geometry":"walking"}},
        {"from":"shusheng_guli","to":"bazhiqiao","walking":{"distance_m":1519,"duration_min":26},"recommended":{"mode":"walk","minutes":26,"label":"步行约26分钟","geometry":"walking"}},
        {"from":"bazhiqiao","to":"shaoxing_hanting_luxun","walking":{"distance_m":1400,"duration_min":22},"transit":{"note":"可步行回酒店；下雨或疲劳就打车。"},"recommended":{"mode":"walk","minutes":22,"label":"步行约22分钟","geometry":"walking"}},
        {"from":"shaoxing_hanting_luxun","to":"shaoxing_north","driving":{"distance_m":16879,"duration_min":25},"transit":{"note":"带行李打车，目标 15:40 左右到站。"},"recommended":{"mode":"taxi","minutes":25,"label":"打车约25分钟","geometry":"driving"}},
        {"from":"shaoxing_north","to":"hangzhou_east","train":"D3296","transit":{"route":"D3296","duration_min":21,"fare_cny":17,"note":"绍兴北 16:27 -> 杭州东 16:48；二等座有票，2026-06-03 刷新。"},"recommended":{"mode":"rail","minutes":21,"label":"D3296 21分钟","geometry":"rail"}},
        {"from":"hangzhou_east","to":"taizhou_station","train":"D3126","transit":{"route":"D3126","duration_min":216,"fare_cny":183,"note":"杭州东 17:30 -> 泰州 21:06；二等座有票，2026-06-03 刷新。"},"recommended":{"mode":"rail","minutes":216,"label":"D3126 3小时36分","geometry":"rail"}}
      ]
    }
  ],
  "rail":[
    {"date":"2026-06-08","train":"C3897","from":"泰州","to":"张家港","depart":"10:03","arrive":"11:29","duration_min":86,"second_class_cny":62,"query_date":"2026-06-03"},
    {"date":"2026-06-08","train":"G7539","from":"张家港","to":"桐乡","depart":"12:25","arrive":"14:10","duration_min":105,"second_class_cny":116,"query_date":"2026-06-03"},
    {"date":"2026-06-09","train":"D3107","from":"桐乡","to":"绍兴北","depart":"10:57","arrive":"11:45","duration_min":48,"second_class_cny":35,"query_date":"2026-06-03"},
    {"date":"2026-06-10","train":"D3296","from":"绍兴北","to":"杭州东","depart":"16:27","arrive":"16:48","duration_min":21,"second_class_cny":17,"query_date":"2026-06-03"},
    {"date":"2026-06-10","train":"D3126","from":"杭州东","to":"泰州","depart":"17:30","arrive":"21:06","duration_min":216,"second_class_cny":183,"query_date":"2026-06-03"}
  ]
}`);
