.wc-container {
  font-size: 14px;
  font-family: arial, helvetica;
}

.wc-toolbar {
  padding: 1em;
  font-size: 0.8em;
}

.wc-toolbar .wc-nav {
  float: left;
}

.wc-toolbar .wc-display {
  float: right;
}

.wc-toolbar button {
  margin-top: 0;
  margin-bottom: 0;
}

.wc-toolbar .wc-title {
  text-align: center;
  padding: 0;
  margin: 0;
}

.wc-container table {
  border-collapse: collapse;
  border-spacing: 0;
}
.wc-container table td {
  margin: 0;
  padding: 0;
}

.wc-header {
  background: #eee;
  border-width: 1px 0;
  border-style: solid;
}
.wc-header table {
  width: 100%;
  table-layout: fixed;
}

.wc-grid-timeslot-header,
.wc-header .wc-time-column-header {
  width: 45px;
}

.wc-header .wc-scrollbar-shim {
  width: 16px;
}

.wc-header .wc-day-column-header {
  text-align: center;
  padding: 0.4em;
}

.wc-header .wc-user-header {
  text-align: center;
  padding: 0.4em 0;
  overflow: hidden;
}
.wc-grid-timeslot-header {
  background: #eee;
}

.wc-scrollable-grid {
  overflow: auto;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  position: relative;
  background-color: #fff;
  width: 100%;
}

table.wc-time-slots {
  width: 100%;
  table-layout: fixed;
  cursor: default;
  overflow: hidden;
}

.wc-day-column {
  width: 13.5%;
  overflow: visible;
  vertical-align: top;
}
.wc-day-column-header {
  border-width: 0 0 1px 3px;
  border-style: solid;
  border-color: transparent;
}
.wc-scrollable-grid .wc-day-column-last,
.wc-scrollable-grid .wc-day-column-middle {
  border-width: 0 0 0 1px;
  border-style: dashed;
}
.wc-scrollable-grid .wc-day-column-first {
  border-width: 0 0 0 3px;
  border-style: double;
}

.wc-day-column-inner {
  width: 100%;
  position: relative;
}

.wc-no-height-wrapper {
  position: relative;
  overflow: visible;
  height: 0px;
}

.wc-time-slot-wrapper {
  /*  top: 3px;*/
}
.wc-oddeven-wrapper .wc-full-height-column {
  /*  top: 2px; */
  /* Modern Browsers */
  opacity: 0.4;
  /* IE 8 */
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)";
  /* IE 5-7 */
  filter: alpha(opacity=40);
  /* Netscape */
  -moz-opacity: 0.4;
  /* Safari 1 */
  -khtml-opacity: 0.4;
}
.wc-freebusy-wrapper .wc-freebusy {
  /*  top: 1px;*/
  /* Modern Browsers */
  opacity: 0.4;
  /* IE 8 */
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)";
  /* IE 5-7 */
  filter: alpha(opacity=40);
  /* Netscape */
  -moz-opacity: 0.4;
  /* Safari 1 */
  -khtml-opacity: 0.4;
}

.wc-time-slots {
  position: absolute;
  width: 100%;
}

.wc-column-odd,
.wc-column-even.ui-state-hover {
  background-image: none;
  border: none;
}

.wc-header .wc-today.ui-state-active {
  background-image: none;
}
.wc-header .wc-today.wc-day-column-header {
  border-width: 0 3px;
  border-style: solid;
}
.wc-header .wc-user-header {
  border-width: 0;
}

.wc-time-slots .wc-day-column.ui-state-default {
  background: transparent;
}
.wc-time-slots .wc-today.ui-state-active {
  background-image: none;
}
.wc-header .wc-today.ui-state-active.wc-day-column-middle {
  border-width: 0;
}
.wc-header .wc-today.ui-state-active.wc-day-column-first {
  border-left-width: 3px;
}
.wc-header .wc-today.ui-state-active.wc-day-column-last {
  border-right-width: 3px;
}

.wc-full-height-column {
  display: block;
  /*  width:100%;*/
}

.wc-time-header-cell {
  padding: 5px;
  height: 80px; /* reference height */
}

.wc-time-slot {
  border-bottom: 1px dotted #ddd;
}

.wc-hour-header {
  text-align: right;
}
.wc-hour-header.ui-state-active,
.wc-hour-header.ui-state-default {
  border-width: 0 0 1px 0;
}

.wc-hour-end,
.wc-hour-header {
  /* border-bottom: 1px solid #ccc; */
  color: #555;
}

.wc-business-hours {
  background-color: #e6eef1;
  border-bottom: 1px solid #ccc;
  color: #333;
  font-size: 1.4em;
}

.wc-business-hours .wc-am-pm {
  font-size: 0.6em;
}

.wc-day-header-cell {
  text-align: center;
  vertical-align: middle;
  padding: 5px;
}

.wc-time-slot-header .wc-header-cell {
  text-align: right;
  padding-right: 10px;
}

.wc-cal-event {
  background-color: #68a1e5;
  /* Modern Browsers */
  opacity: 0.8;
  /* IE 8 */
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";
  /* IE 5-7 */
  filter: alpha(opacity=80);
  /* Netscape */
  -moz-opacity: 0.8;
  /* Safari 1 */
  -khtml-opacity: 0.8;
  position: absolute;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  color: #fff;
  width: 100%;
  display: none;
}

.wc-cal-event-delete {
  float: right;
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.wc-cal-event.ui-resizable-resizing {
  cursor: s-resize;
}

.wc-cal-event .wc-time {
  background-color: #558ed9;
  border: 1px solid #106ebe;
  color: #fff;
  padding: 0;
  font-weight: bold;
}

.wc-container .ui-draggable .wc-time {
  cursor: move;
}

.wc-cal-event .wc-title {
  position: relative;
}

.wc-container .ui-resizable-s {
  height: 10px;
  line-height: 10px;
  bottom: -2px;
  font-size: 0.75em;
}

.wc-container .ui-draggable-dragging {
  z-index: 1000;
}

.free-busy-free {
}
.free-busy-busy {
  background: url("./libs/css/smoothness/images/ui-bg_flat_0_aaaaaa_40x100.png")
    repeat scroll 50% 50% #525252;
}

/** hourLine */

.wc-hourline {
  height: 0pt;
  border-top: 2px solid #ff7f6e;
  overflow: hidden;
  position: absolute;
  width: inherit;
}

/* IE6 hacks */
* html .wc-no-height-wrapper {
  position: absolute;
}
* html .wc-time-slot-wrapper {
  top: 3px;
}
* html .wc-grid-row-oddeven {
  top: 2px;
}
* html .wc-grid-row-freebusy {
  top: 1px;
}

/* IE7 hacks */
*:first-child + html .wc-no-height-wrapper {
  position: relative;
}
*:first-child + html .wc-time-slot-wrapper {
  top: 3px;
}
*:first-child + html .wc-grid-row-oddeven {
  top: 2px;
}
*:first-child + html .wc-grid-row-freebusy {
  top: 1px;
}
*:first-child + html .wc-time-slots .wc-today {
  /* due to rendering issues, no background */
  background: none;
}
