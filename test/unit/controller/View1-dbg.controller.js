/*global QUnit*/

sap.ui.define([
	"ZCREATE_WRICEF_ID/ZCREATE_WRICEF_ID/controller/View1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("View1 Controller");

	QUnit.test("I should test the View1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});