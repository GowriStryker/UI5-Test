sap.ui.define([
	"sap/ui/test/Opa5",
	"./arrangements/Startup",
	"./NavigationJourney"
], function (Opa5, Startup) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Startup(),
		viewNamespace: "ZCREATE_WRICEF_ID.ZCREATE_WRICEF_ID.view.",
		autoWait: true
	});
});