/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ZCREATE_WRICEF_ID/ZCREATE_WRICEF_ID/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});