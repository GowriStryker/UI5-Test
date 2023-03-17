// 10-March-2020	SBHASKAR		Create WRICEF ID App 1
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/MessageToast',
	"sap/m/Dialog",
	"sap/ui/model/Filter",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/FilterOperator",
	"root/util/formatter"
], function (Controller, MessageToast, Dialog, Filter, MessageBox, Fragment, JSONModel, FilterOperator, formatter) {
	"use strict";

	return Controller.extend("root.controller.View1", {

		formatter: formatter,
		onAfterRendering: function () {
			if (!sap.ui.Device.system.desktop) {
				//hide generic tag in header of page if device is not desktop
			//	this.getView().byId("genericTag").setVisible(false);

				//1)hide few columns from table, else nothing would be readble & 2) add tap functionality to show details

				//1)hide columns
				this.getView().byId("table").getColumns()[1].setVisible(false);
				this.getView().byId("table").getColumns()[3].setVisible(false);
				this.getView().byId("table").getColumns()[4].setVisible(false);
				this.getView().byId("table").getColumns()[5].setVisible(false);
			}
		},
		onInit: function () {
			//test model for chart

			var oModel = new JSONModel(this.settingsModel);
			this.getView().setModel(oModel);

			var Model = this.getOwnerComponent().getModel("Data");

			this.getView().setModel(Model, "test");

			var that = this;
			//Adapt UI if device is not desktop i.e tablet or phone

			//Create a View for local complexity Data - complexityModel 
			var complexityModel = this.getOwnerComponent().getModel("complexityModel");
			this.getView().setModel(complexityModel, "complexityModel");

			this.valueHelpModel = this.getOwnerComponent().getModel("searchHelp");

			this.valueHelpModel.read("/RICEF_MASTERSet", {
				success: function (data) {

					//Set a named model to app ( to be used by Table in XML)
					var newMod = new sap.ui.model.json.JSONModel(data);
					this.getView().setModel(newMod, "searchData");
					var ricefs2 = [];
					var ricefs = [];
					var Tracks = [];
					var subTracks = [];
					var type = [];
					var subType = [];
					var subTracks2 = [];
					var type2 = [];
					var subType2 = [];
					var Tracks2 = [];
					var ricefTeam = [];
					var sourceSystem = [];
					var sourceSystem2 = [];
					var targetSystem2 = [];
					var targetSystem = [];
					var int = [];
					var int2 = [];

					this.total = data.results.length;

					//create arrays for indivisual helps like : Tracks, subTracks,etc
					for (var i = 0; i < this.total; i++) {
						var t = data.results[i].RICEF.indexOf("-01");
						if (t !== -1) {
							int.push(data.results[i].RICEF);
						}
						sourceSystem.push(data.results[i].SRCSYS);
						targetSystem.push(data.results[i].TARGET_SYSTEM);
						Tracks.push(data.results[i].TEAM); //array containing only Tracks
						subTracks.push(data.results[i].GRP); //array containing only subTracks
						type.push(data.results[i].TYPE); //array containing only type
						subType.push(data.results[i].OBJTYP); //array containing only subtype
						ricefs.push(data.results[i].RICEF);
						var uniqueRicefTeam = data.results[i].RICEF + "//" + data.results[i].TEAM; //unique ricef+team (used for Card)
						ricefTeam.push(uniqueRicefTeam);
					}
				
					//Remove duplicates
					int = this.removeDuplicates(int);
					Tracks = this.removeDuplicates(Tracks);
					subTracks = this.removeDuplicates(subTracks);
					type = this.removeDuplicates(type);
					subType = this.removeDuplicates(subType);
					ricefs = this.removeDuplicates(ricefs);
					ricefTeam = this.removeDuplicates(ricefTeam);
					sourceSystem = this.removeDuplicates(sourceSystem);
					targetSystem = this.removeDuplicates(targetSystem);

					//Prepare data in JSON array format
					for (i = 0; i < Tracks.length; i++) {
						var temp = {};
						temp.value = Tracks[i];
						temp.count = 0; //adding count field to be used in Card
						Tracks2.push(temp);
					}
					//Prepare data in JSON array format
					for (i = 0; i < ricefs.length; i++) {
						temp = {};
						temp.value = ricefs[i];
						//adding count field to be used in Card
						ricefs2.push(temp);
					}
					//recover RICEF and TEAM back from ricefTeam array created for calculation
					var wriTeam = [];
					for (i = 0; i < ricefTeam.length; i++) {
						temp = {};
						var splitArray = ricefTeam[i].toString().split("//"); // "// is chosen  delimeter "
						temp.ricef = splitArray[0];
						temp.team = splitArray[1];
						wriTeam.push(temp);
					}
					for (i = 0; i < int.length; i++) {
						temp = {};
						temp.value = int[i];

						int2.push(temp);
					}

					//This is a small piece of code that will read through all the records of WRICEF recieved from backend
					//and count the number of wricef in each track
					for (i = 0; i < wriTeam.length; i++) { //loop on all lines of WRICEF Master data

						for (var j = 0; j < Tracks2.length; j++) { //loop on unique Tracks array

							if (Tracks2[j].value == wriTeam[i].team) {
								Tracks2[j].count = Tracks2[j].count + 1;
								break;
							}

						}

					}
					//
					for (i = 0; i < subTracks.length; i++) {
						temp = {};
						temp.value = subTracks[i];
						subTracks2.push(temp);
					}
					for (i = 0; i < type.length; i++) {
						temp = {};
						temp.value = type[i];
						type2.push(temp);
					}
					for (i = 0; i < subType.length; i++) {
						temp = {};
						temp.value = subType[i];
						subType2.push(temp);
					}
					for (i = 0; i < sourceSystem.length; i++) {
						temp = {};
						temp.value = sourceSystem[i];
						sourceSystem2.push(temp);
					}
					for (i = 0; i < targetSystem.length; i++) {
						temp = {};
						temp.value = targetSystem[i];
						targetSystem2.push(temp);
					}

					//create models for search helps
					var valueHelp = new sap.ui.model.json.JSONModel(Tracks2);
					that.getView().setModel(valueHelp, "trackHelp");

					var valueHelp = new sap.ui.model.json.JSONModel(sourceSystem2);
					that.getView().setModel(valueHelp, "sourceHelp");

					var valueHelp = new sap.ui.model.json.JSONModel(targetSystem2);
					that.getView().setModel(valueHelp, "targetHelp");

					valueHelp = new sap.ui.model.json.JSONModel(subTracks2);
					that.getView().setModel(valueHelp, "subTrackHelp");
					valueHelp = new sap.ui.model.json.JSONModel(int2);
					valueHelp.setSizeLimit(int2.length);
					that.getView().setModel(valueHelp, "intHelp");

					valueHelp = new sap.ui.model.json.JSONModel(type2);

					that.getView().setModel(valueHelp, "typeHelp");
					valueHelp = new sap.ui.model.json.JSONModel(subType2);
					that.getView().setModel(valueHelp, "subTypeHelp");
					valueHelp = new sap.ui.model.json.JSONModel(ricefs2);
					valueHelp.setSizeLimit(ricefs2.length);
					that.getView().setModel(valueHelp, "ricefsHelp");

					//card utility	
				//	this.getView().byId("totalNumber").setNumber(ricefs.length);

				}.bind(this),
				error: function (data) {

					MessageBox.error(data.message, {
						details: data.responseText
					});
				}.bind(this)
			});

			this.valueHelpModel.read("/RELEASESet", {
				success: function (oData, oResponse) {

					var valueHelp = new sap.ui.model.json.JSONModel(oData);
					valueHelp.iSizeLimit = 99999;
					that.getView().setModel(valueHelp, "releaseHelp");
					valueHelp.updateBindings(true);
					debugger;
					that.originalRelease = oData;
				},
				failed: function (oData, response) {},
				abort: function (oData, response) {}
			});

			this.valueHelpModel.read("/APPROVERSet", {
				success: function (oData, oResponse) {
					var valueHelp = new sap.ui.model.json.JSONModel(oData);
					valueHelp.iSizeLimit = 99999;
					that.getView().setModel(valueHelp, "ISPOHelp");
					valueHelp.updateBindings(true);
				},
				failed: function (oData, response) {},
				abort: function (oData, response) {}
			});

		},
		onRefRicef : function(oObject){
			debugger;
		var iState = this.getView().byId("idRefRicef").getSelected().toString();
		if( iState === 'true' ){
			
		debugger;
		
			this.getView().byId("REFERENCE_WRICEF").setEnabled(true);
			
		}else{
				this.getView().byId("REFERENCE_WRICEF").setEnabled(false);
		}
		},
		
		onOperationChange: function (oObject) {
			var iIndex = oObject.getParameter("selectedIndex");
			if (iIndex === 0) {
				this.getView().byId("F8").setText("Create WRICEF");
				this.enableFields(this);
				this.getView().getModel("releaseHelp").setData(this.originalRelease);
				this.getView().byId("RELEASE").setSelectedKeys(null);
				this.getView().byId("RELEASE").setEnabled(true);
				this.getView().byId("idWricef").setRequired(false);
			} else if (iIndex === 1) {
				this.getView().byId("F8").setText("Extend WRICEF");
				this.disableFields(this);
				this.getView().byId("RELEASE").setEnabled(false);
				this.getView().byId("idWricef").setRequired(true);
			} else if (iIndex === 2) {
				this.disableFields(this);
				this.getView().byId("F8").setText("Cancel WRICEF");
				this.getView().byId("RELEASE").setEnabled(true);
				this.getView().byId("RELEASE").setRequired(true);
				this.getView().byId("idWricef").setRequired(true);
			}
			this.clearFields();
			this.getView().byId("SOURCE_SYSTEM").setRequired(false);
			this.getView().byId("TARGET_SYSTEM").setRequired(false);
		},
		onSelect: function (oContext) {

		},
		onRadioButton: function (oEvent) {
			if (oEvent.getSource().getSelectedIndex() == 0) { //Search WRICEF
				this.getView().byId("form0").setVisible(false);
				//	this.getView().byId("table").setVisible(true);
				this.getView().byId("F8").setText("Search");
				this.getView().byId("F8").setIcon("sap-icon://search");
				this.getView().byId("searchTerm").setVisible(true);

			} else { //Create WRICEF ID
				this.getView().byId("form0").setVisible(true);
				this.getView().byId("table").setVisible(false);
				this.getView().byId("F8").setText("Create WRICEF");
				this.getView().byId("F8").setIcon("sap-icon://create");
				this.getView().byId("searchTerm").setVisible(false);
			}

		},
		attachContentChange: function () {

		},
		onExtend: function (oEvent) {

			var isExtend = oEvent.getSource().getSelected().toString();
			if (isExtend === 'true') {
				this.disableFields(this);
				this.getView().byId("RELEASE").setEnabled(false);
				this.getView().byId("idWricef").setRequired(true);
			} else {
				this.enableFields(this);
				this.getView().getModel("releaseHelp").setData(this.originalRelease);
			//	this.getView().byId("RELEASE").setSelectedKeys(null);
			//	this.getView().byId("RELEASE").setEnabled(true);
		
				this.getView().byId("idWricef").setRequired(false);
			}
			this.clearFields();
			this.getView().byId("SOURCE_SYSTEM").setRequired(false);
			this.getView().byId("TARGET_SYSTEM").setRequired(false);
		},
		clearFields: function () {
			this.getView().byId("idWricef").setValue('');
			this.getView().byId("TRACK").setValue('');
			this.getView().byId("SUBTRACK").setValue('');
			this.getView().byId("DESCRIPTION").setValue('');
			this.getView().byId("WRICEF_TYPE").setValue('');
			this.getView().byId("REFERENCE_WRICEF").setValue('');
			this.getView().byId("WRICEF_SUBTYPE").setValue('');
			this.getView().byId("SAP_COMPLEXITY").setValue('');
			this.getView().byId("NONSAP_COMPLEXITY").setValue('');
			this.getView().byId("MW_COMPLEXITY").setValue('');
			this.getView().byId("CR").setValue('');
			this.getView().byId("RAID").setValue('');
			this.getView().byId("SOURCE_SYSTEM").setValue('');
			this.getView().byId("TARGET_SYSTEM").setValue('');
			this.getView().byId("BPO").setValue('');
			this.getView().byId("MIDDLEWARE_PATTERN").setValue('');
			this.getView().byId("DELIVERY_NOTES").setValue('');
					this.getView().byId("REQUIREMENT_ID").setValue('');
			this.getView().byId("RELEASE").setSelectedKeys(null);

		},
		//when on extend WRICEF mode, this is fired when a wricef is selected from dropdown
		onExtendWricef: function (ochange) {
			debugger;
			var iOpr = this.getView().byId('idOperation').getSelectedIndex();
			if (iOpr === 1) {

				this.getView().byId("RELEASE").setSelectedKeys(null); //clear RELEASE field
				if (this.getView().byId("idWricef").getValue === '') {
					this.getView().byId("RELEASE").setEnabled(false);

				} else {
					this.getView().byId("RELEASE").setEnabled(true);
					this.getView().byId("idWricef").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("RELEASE").setValueState(sap.ui.core.ValueState.None);

					this.clearStatus(this);
				}

				//Set data for Release field
				var newRelease = [];
				const t = this.originalRelease;
				var relMod = {};
				relMod.results = [];
				var flag = 0;

				//	var release = this.getView().getModel("releaseHelp").getData().results;
				var release = t;
				var rel = [];
debugger;
				for (var j = 0; j < release.results.length; j++) {
					rel.push(release.results[j].Release);
				}
				var oData = this.getView().getModel("searchData").getData().results;
				//loop on all records 

				for (var i = 0; i < oData.length; i++) {
					if (oData[i].RICEF === ochange.getParameter("value")) { //filter on selected ricef
						newRelease.push(oData[i].REL);
					}
				}

				for (i = 0; i < newRelease.length; i++) {
					var index = rel.indexOf(newRelease[i].toString());
					rel.splice(index, 1);

				}

				for (i = 0; i < rel.length; i++) {
					var rele = {};
					rele.Release = rel[i];
					relMod.results.push(rele);
				}
				this.getView().getModel("releaseHelp").setData(relMod);

			} else if (iOpr === 2) {

			}
			//	set data on other field for selected ricef
			debugger;
			var items = this.getView().getModel("searchData").getData().results;
			var wricef = ochange.getParameter("value");
			for (i = 0; i < items.length; i++) {
				if (items[i].RICEF === wricef) {
					var lwa_ricef = items[i];
					break;
				}
			}
			this.assignData(lwa_ricef);
			
							//Set data for Release field
				var newRelease = [];
				const t = this.originalRelease;
				var relMod = {};
				relMod.results = [];
				var flag = 0;

				//	var release = this.getView().getModel("releaseHelp").getData().results;
				var release = t;
				var rel = [];
debugger;
				for (var j = 0; j < release.results.length; j++) {
					rel.push(release.results[j].Release);
				}
				var oData = this.getView().getModel("searchData").getData().results;
				//loop on all records 


//find the release existing
				for (var i = 0; i < oData.length; i++) {
					if (oData[i].RICEF === ochange.getParameter("value")) { //filter on selected ricef
						var rele = {};
						rele.Release = oData[i].REL;
						relMod.results.push(rele);
					}
				}

			
				this.getView().getModel("releaseHelp").setData(relMod);
		},
		assignData: function (oObject) {
			debugger;
			this.getView().byId("TRACK").setValue(oObject.TEAM);
			this.getView().byId("SUBTRACK").setValue(oObject.GRP);
			this.getView().byId("DESCRIPTION").setValue(oObject.NAME);
			this.getView().byId("WRICEF_TYPE").setValue(oObject.TYPE);

			this.getView().byId("WRICEF_SUBTYPE").setValue(oObject.OBJTYP);
			this.getView().byId("SAP_COMPLEXITY").setValue(oObject.SAP_COMPLEXITY);
			this.getView().byId("NONSAP_COMPLEXITY").setValue(oObject.NONSAP_COMPLEXITY);
			this.getView().byId("MW_COMPLEXITY").setValue(oObject.MW_COMPLEXITY);
			this.getView().byId("CR").setValue(oObject.CR);
			this.getView().byId("RAID").setValue(oObject.RAID);
			this.getView().byId("SOURCE_SYSTEM").setValue(oObject.SRCSYS);
			this.getView().byId("TARGET_SYSTEM").setValue(oObject.TARGET_SYSTEM);
			this.getView().byId("BPO").setValue(oObject.BPO);
			this.getView().byId("MIDDLEWARE_PATTERN").setValue(oObject.MW_PATTERN);
			this.getView().byId("DELIVERY_NOTES").setValue(oObject.DELIVERY_NOTES);

		},
		disableFields: function (oView) {

			oView.getView().byId("idWricef").setEnabled(true);
			oView.getView().byId("TRACK").setEnabled(false);
			oView.getView().byId("SUBTRACK").setEnabled(false);
			oView.getView().byId("DESCRIPTION").setEnabled(false);
			oView.getView().byId("WRICEF_TYPE").setEnabled(false);
			oView.getView().byId("REFERENCE_WRICEF").setEnabled(false);
			oView.getView().byId("WRICEF_SUBTYPE").setEnabled(false);
			oView.getView().byId("SAP_COMPLEXITY").setEnabled(false);
			oView.getView().byId("NONSAP_COMPLEXITY").setEnabled(false);
			oView.getView().byId("MW_COMPLEXITY").setEnabled(false);
			oView.getView().byId("CR").setEnabled(false);
			oView.getView().byId("RAID").setEnabled(false);
			oView.getView().byId("SOURCE_SYSTEM").setEnabled(false);
			oView.getView().byId("TARGET_SYSTEM").setEnabled(false);
			oView.getView().byId("BPO").setEnabled(false);
			oView.getView().byId("MIDDLEWARE_PATTERN").setEnabled(false);
			oView.getView().byId("DELIVERY_NOTES").setEnabled(false);
	oView.getView().byId("REQUIREMENT_ID").setEnabled(false);
			//set required fields
			oView.getView().byId("TRACK").setRequired(false);
			oView.getView().byId("SUBTRACK").setRequired(false);
			oView.getView().byId("DESCRIPTION").setRequired(false);
			oView.getView().byId("WRICEF_TYPE").setRequired(false);
			oView.getView().byId("REFERENCE_WRICEF").setRequired(false);
			oView.getView().byId("WRICEF_SUBTYPE").setRequired(false);
			oView.getView().byId("SAP_COMPLEXITY").setRequired(false);
			oView.getView().byId("NONSAP_COMPLEXITY").setRequired(false);
			oView.getView().byId("MW_COMPLEXITY").setRequired(false);
			oView.getView().byId("RELEASE").setRequired(true);
			oView.getView().byId("idWricef").setRequired(true);

		},
		enableFields: function (oView) {
			debugger;

			oView.getView().byId("idWricef").setEnabled(false);
			oView.getView().byId("TRACK").setEnabled(true);
			oView.getView().byId("SUBTRACK").setEnabled(true);
			oView.getView().byId("DESCRIPTION").setEnabled(true);
			oView.getView().byId("WRICEF_TYPE").setEnabled(true);
			oView.getView().byId("REFERENCE_WRICEF").setEnabled(true);
			oView.getView().byId("WRICEF_SUBTYPE").setEnabled(true);
			oView.getView().byId("SAP_COMPLEXITY").setEnabled(true);
			oView.getView().byId("NONSAP_COMPLEXITY").setEnabled(true);
			oView.getView().byId("MW_COMPLEXITY").setEnabled(true);
			oView.getView().byId("CR").setEnabled(true);
			oView.getView().byId("RAID").setEnabled(true);
			oView.getView().byId("SOURCE_SYSTEM").setEnabled(true);
			oView.getView().byId("TARGET_SYSTEM").setEnabled(true);
			oView.getView().byId("BPO").setEnabled(true);
			oView.getView().byId("MIDDLEWARE_PATTERN").setEnabled(true);
			oView.getView().byId("DELIVERY_NOTES").setEnabled(true);
	oView.getView().byId("REQUIREMENT_ID").setEnabled(true);
			//Set Mandatory fields
			oView.getView().byId("TRACK").setRequired(true);
			oView.getView().byId("SUBTRACK").setRequired(true);
			oView.getView().byId("DESCRIPTION").setRequired(true);
			oView.getView().byId("WRICEF_TYPE").setRequired(true);
			oView.getView().byId("WRICEF_SUBTYPE").setRequired(true);
			oView.getView().byId("SAP_COMPLEXITY").setRequired(true);
			oView.getView().byId("NONSAP_COMPLEXITY").setRequired(true);
			oView.getView().byId("MW_COMPLEXITY").setRequired(true);
			oView.getView().byId("RELEASE").setRequired(true);
			oView.getView().byId("idWricef").setRequired(true);

		},
		//remove duplicates function when a column contains duplicates (column releaseTeam)
		removeDuplicatesSpecial: function (oArray) {
			var returnArray = [];
			for (var i = 0; i < oArray.length; i++) {
				if (oArray.indexOf(oArray[i].ricefTeam) === i) {
					returnArray.push(oArray[i]);
				}
			}
			return returnArray;
		},
		//this function accepts a array containing duplicate elements & return an array with unique values
		removeDuplicates: function (oArray) {
			var returnArray = [];
			for (var i = 0; i < oArray.length; i++) {
				if (oArray.indexOf(oArray[i]) === i) {
					returnArray.push(oArray[i]);
				}
			}
			return returnArray;
		},
		wricefPopover: function (oEvent) {
			debugger;
			var oView = this.getView();
			var oSourceControl = oEvent.getSource();

			var aIndex = oEvent.getSource().getBindingContextPath("searchData").split("/");
			var iSelectedIndex = aIndex[2]; // index is at third position. EXAMPLE = /results/234

			var sData = oEvent.getSource().getParent().getModel("searchData").getData().results[iSelectedIndex];
			this.oTextModel = new JSONModel(sData);

			if (!this._pPopover2) {
				this._pPopover2 = Fragment.load({
					id: oView.getId(),
					name: "root.fragments.wricefDetail",
					controller: "root.controller.View1"
				}).then(function (oPopover2) {
					oView.addDependent(oPopover2);

					return oPopover2;
				});
			}

			this._pPopover2.then(function (oPopover2) {

				oPopover2.setModel(this.oTextModel);

				oPopover2.openBy(oSourceControl);
			}.bind(this));

		},
		onPressOpenPopover: function (oEvent) {

			//	this.SupplierDialog.open();
			var oView = this.getView(),
				oSourceControl = oEvent.getSource();

			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "root.fragments.card"
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this.getView().byId("idChart").setVizProperties({
				plotArea: {
					dataLabel: {
						visible: true,
						showTotal: true
					}
				}
			});
			this._pPopover.then(function (oPopover) {
				oPopover.openBy(oSourceControl);

			});

		},
		onValueChange: function (oEvent) {

			//display reference WRICEF field if wricef type = Interface
			if (oEvent.getSource().getParent().getAggregation("label") === "WRICEF Type") {
				if (oEvent.getSource().getProperty("value") === "Interface") {
					this.getView().byId("idReference").setVisible(true);
					this.getView().byId("SOURCE_SYSTEM").setRequired(true);
					this.getView().byId("TARGET_SYSTEM").setRequired(true);
					
						this.getView().byId("SOURCE_SYSTEM").setEditable(true);
					this.getView().byId("TARGET_SYSTEM").setEditable(true);
				} else {
					this.getView().byId("idReference").setVisible(false);
					this.getView().byId("SOURCE_SYSTEM").setEditable(false);
					this.getView().byId("TARGET_SYSTEM").setEditable(false);
						this.getView().byId("SOURCE_SYSTEM").setValue("");
								this.getView().byId("TARGET_SYSTEM").setValue("");
					
				}
			}
			var control = oEvent.getSource();
			var len = control.getItems().length;
			var enteredText = control.getValue();
			var bExists = false;
			for (var i = 0; i < len; i++) {
				var itemText = control.getItems()[i].getProperty("text");

				if (itemText === enteredText) {
					bExists = true;
					break;
				}
			}
			if (bExists) {
				control.setValueState(sap.ui.core.ValueState.None);
				//Clear message strip
				this.clearStatus(this);
			} else {
				control.setValueState(sap.ui.core.ValueState.Error);
				control.setValue("");
				this.getView().byId("statusText").setText("<strong>Invalid Input </strong>. Select a value from dropdown list");
				this.getView().byId("statusText").setType("Error");
				this.getView().byId("statusText").setVisible(true);
				this.submitValidation = false; //check documentation for this variable in finction - onSubmit
			}

		},

		onSubmit: function () {
			//collect input values in JSON format
			var oEntry = {};

			if (this.getView().byId("radioGroup").getSelectedIndex() == 1) {
				if (this.getView().byId("F8").getText() === "Create WRICEF") {
					//return if some error already exist and use click on submit

					//-->function onValueChange also does inline validation and on any error user must resolve that first
					//-->function onSubmit does mandatory field validation.
					//-->to identify that error displayed in the footer is from oValueChange or onSubmit we use this variable {this.submitValidation}
					if (this.getView().byId("statusText").getProperty("text").length !== 0 && this.submitValidation !== true) {

						return; // return, as the data in some field is wrong and need to be addressed first.

					}

					//based on above IF condition, if program reached this point it means data validation is okay and we can check now 
					//if the mandatory fields are having data or not.

					this.submitValidation = false;
					this.getView().byId("statusText").setText("");

					//Get NAme of Requestor and send to  backend

					oEntry.REQUESTOR_NAME = sap.ushell.Container.getUser().getFullName();
					oEntry.REQUESTOR_EMAIL = sap.ushell.Container.getUser().getEmail();

					oEntry.TEAM = this.getView().byId("TRACK").getValue();
					oEntry.GRP = this.getView().byId("SUBTRACK").getValue();
					oEntry.NAME = this.getView().byId("DESCRIPTION").getValue();
					//Send Multiple Releases separated by "|" symbol e.g. { CMF|NV|RHQ }
					oEntry.REL = "";
					var impactedRelease = this.getView().byId("RELEASE").getSelectedKeys();
					for (var i = 0; i < impactedRelease.length; i++) {
						if (i == impactedRelease.length - 1) {
							oEntry.REL = oEntry.REL.concat(impactedRelease[i]);
						} else {
							oEntry.REL = oEntry.REL.concat(impactedRelease[i]).concat("|");
						}
					}

					//	oEntry.RELEASE = this.getView().byId("RELEASE").getSelectedKeys();
					oEntry.TYPE = this.getView().byId("WRICEF_TYPE").getValue();
					oEntry.OBJTYP = this.getView().byId("WRICEF_SUBTYPE").getValue();
					oEntry.REFERENCE_WRICEF = this.getView().byId("REFERENCE_WRICEF").getValue();
					oEntry.SAP_COMPLEXITY = this.getView().byId("SAP_COMPLEXITY").getValue();
					oEntry.NON_SAP_COMPLEXITY = this.getView().byId("NONSAP_COMPLEXITY").getValue();
					oEntry.MW_COMPLEXITY = this.getView().byId("MW_COMPLEXITY").getValue();
					oEntry.CR = this.getView().byId("CR").getValue();
					oEntry.RAID = this.getView().byId("RAID").getValue();
					oEntry.SRCSYS = this.getView().byId("SOURCE_SYSTEM").getValue();
					oEntry.TARGET_SYSTEM = this.getView().byId("TARGET_SYSTEM").getValue();
					oEntry.BPO = this.getView().byId("BPO").getValue();
					oEntry.MW_PATTERN = this.getView().byId("MIDDLEWARE_PATTERN").getValue();
					oEntry.DELIVERY_NOTES = this.getView().byId("DELIVERY_NOTES").getValue();
						oEntry.REQUIREMENT_ID = this.getView().byId("REQUIREMENT_ID").getValue();
					oEntry.IS_APPROVER = this.getView().byId("IS_APPROVER").getValue();
					oEntry.REQUEST_CREATEDBY = sap.ushell.Container.getService("UserInfo").getId();
					oEntry.TECH_APPROVAL = 'PENDING';
					oEntry.IS_APPROVAL = 'PENDING';
					oEntry.MW_APPROVAL = 'PENDING';
					//determine if request is for existing interface or a new interface
					if ( this.getView().byId("idRefRicef").getSelected().toString() === 'false' ){
						oEntry.EXISTING_INTERFACE = ' ';
					}else{
						oEntry.EXISTING_INTERFACE = 'X';
					}
					//Since this service being used by 2 APPS , we identify the caller by this variable( Create method is called by both apps)

					oEntry.APP_NUM = 1;

					oEntry.SERVICE_CALLER = "CREATE";
					//check if source and target systems are new

					var src = this.getView().byId("SOURCE_SYSTEM").getValue();
					var trg = this.getView().byId("TARGET_SYSTEM").getValue();
					if (src !== '' && trg !== '') {

						debugger;
						var systems = this.getView().getModel("sourceHelp").getData();
						oEntry.srcflag = 'X';
						oEntry.TARGETFLAG = "X";

						for (i = 0; i < systems.length; i++) {
							if (systems[i].value === src) {
								oEntry.srcflag = '';
							}
							if (systems[i].value === trg) {
								oEntry.TARGETFLAG = '';
							}
						}

					}

					//remove existing value state from input field
					this.getView().byId("TRACK").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("SUBTRACK").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("DESCRIPTION").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("RELEASE").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("WRICEF_TYPE").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("WRICEF_SUBTYPE").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("IS_APPROVER").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("SOURCE_SYSTEM").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("TARGET_SYSTEM").setValueState(sap.ui.core.ValueState.None);

					//Validation for mandatory fields
					this.clearStatus(this);
					if (oEntry.TEAM === "") {
						debugger
						this.getView().byId("TRACK").setValueState(sap.ui.core.ValueState.Error);
						this.mandatoryError(this);

					} else if (oEntry.GRP === "") {
						this.getView().byId("SUBTRACK").setValueState(sap.ui.core.ValueState.Error);
						this.mandatoryError(this);

					} else if (oEntry.NAME === "") {
						this.getView().byId("DESCRIPTION").setValueState(sap.ui.core.ValueState.Error);
						this.mandatoryError(this);
					} else if (oEntry.REL === "") {
						this.getView().byId("RELEASE").setValueState(sap.ui.core.ValueState.Error);
						this.mandatoryError(this);
					} else if (oEntry.TYPE === "") {
						this.getView().byId("WRICEF_TYPE").setValueState(sap.ui.core.ValueState.Error);
						this.mandatoryError(this);
					} else if (oEntry.OBJTYPE === "") {
						this.getView().byId("WRICEF_SUBTYPE").setValueState(sap.ui.core.ValueState.Error);
						this.mandatoryError(this);
					} else if (oEntry.TYPE == "Interface" && this.getView().byId("SOURCE_SYSTEM").getValue() == "") {

						this.getView().byId("SOURCE_SYSTEM").setValueState(sap.ui.core.ValueState.Error);
						this.mandatoryError(this);

					} else if (oEntry.TYPE == "Interface" && this.getView().byId("TARGET_SYSTEM").getValue() == "") {

						this.getView().byId("TARGET_SYSTEM").setValueState(sap.ui.core.ValueState.Error);
						this.mandatoryError(this);

					} else if (oEntry.IS_APPROVER === "") {
						this.getView().byId("IS_APPROVER").setValueState(sap.ui.core.ValueState.Error);
						this.mandatoryError(this);
					}

					if (this.getView().byId("statusText").getProperty("text").length == 0) {

						var approvers = this.getView().getModel("ISPOHelp").getData().results;

						var IS_APPR = "";
						var test = "<p><strong>Tech.  Approvers  </strong> (Any one can approve) : </p>\n <ul>";

						for (i = 0; i < approvers.length; i++) {
							if (approvers[i].OWNERSHIP == "TECHNICAL") { //list all tech lead approvers
								test = test.concat("<li>" + approvers[i].NAME + "</li>");
							}
							if (approvers[i].OWNERSHIP == "FUNCTIONAL") { //list only functional owner selected by user
								if (approvers[i].USER_ID == oEntry.IS_APPROVER) {
									IS_APPR = approvers[i].NAME;
								}
							}
						}
						test = test.concat("</ul><p><strong>IS Approver : </strong></p>\n <ul>");
						test = test.concat("<li>" + IS_APPR + "</li></ul>");

						MessageBox.confirm("WRICEF ID creation request will be sent to Technical & Functional owners for approval. Continue ?", {
							actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
							emphasizedAction: MessageBox.Action.OK,
							details: test,
							onClose: function (sAction) {
								if (sAction === "OK") {

									this.busyDialog = new sap.m.BusyDialog({});
									this.busyDialog.open();
									this.valueHelpModel.create('/SUBMIT_REQUESTSet', oEntry, {

										success: function (data) {
											this.busyDialog.close();
											MessageBox.success(
												"Request sent to approvers. You will recieve an E-mail with your Request ID & a link to Track your request status."
											);
										}.bind(this),
										error: function (data) {
											this.busyDialog.close();
											MessageBox.error(data.message, {
												details: data.responseText
											});
										}.bind(this)
									});
								}
							}.bind(this)

						});

					}
				} else if (this.getView().byId("F8").getText() === "Extend WRICEF") { //handle Extend WRICEF Logic
debugger;
					oEntry.REL = "";
					oEntry.WRICEF_ID = "";
		oEntry.REQUESTOR_NAME = sap.ushell.Container.getUser().getFullName();
					oEntry.REQUESTOR_EMAIL = sap.ushell.Container.getUser().getEmail();

					oEntry.TEAM = this.getView().byId("TRACK").getValue();
					oEntry.GRP = this.getView().byId("SUBTRACK").getValue();
					oEntry.NAME = this.getView().byId("DESCRIPTION").getValue();
					//Send Multiple Releases separated by "|" symbol e.g. { CMF|NV|RHQ }
					oEntry.REL = "";
					var impactedRelease = this.getView().byId("RELEASE").getSelectedKeys();
					for (var i = 0; i < impactedRelease.length; i++) {
						if (i == impactedRelease.length - 1) {
							oEntry.REL = oEntry.REL.concat(impactedRelease[i]);
						} else {
							oEntry.REL = oEntry.REL.concat(impactedRelease[i]).concat("|");
						}
					}

					//	oEntry.RELEASE = this.getView().byId("RELEASE").getSelectedKeys();
					oEntry.TYPE = this.getView().byId("WRICEF_TYPE").getValue();
					oEntry.OBJTYP = this.getView().byId("WRICEF_SUBTYPE").getValue();
					oEntry.SAP_COMPLEXITY = this.getView().byId("SAP_COMPLEXITY").getValue();
					oEntry.NON_SAP_COMPLEXITY = this.getView().byId("NONSAP_COMPLEXITY").getValue();
					oEntry.MW_COMPLEXITY = this.getView().byId("MW_COMPLEXITY").getValue();
					oEntry.CR = this.getView().byId("CR").getValue();
					oEntry.RAID = this.getView().byId("RAID").getValue();
					oEntry.SRCSYS = this.getView().byId("SOURCE_SYSTEM").getValue();
					oEntry.TARGET_SYSTEM = this.getView().byId("TARGET_SYSTEM").getValue();
					oEntry.BPO = this.getView().byId("BPO").getValue();
					oEntry.MW_PATTERN = this.getView().byId("MIDDLEWARE_PATTERN").getValue();
					oEntry.DELIVERY_NOTES = this.getView().byId("DELIVERY_NOTES").getValue();
					oEntry.IS_APPROVER = this.getView().byId("IS_APPROVER").getValue();
					oEntry.REQUEST_CREATEDBY = sap.ushell.Container.getService("UserInfo").getId();
					oEntry.TECH_APPROVAL = 'PENDING';
					oEntry.IS_APPROVAL = 'PENDING';
					oEntry.MW_APPROVAL = 'PENDING';
					this.clearStatus(this);
					oEntry.IS_APPROVER = this.getView().byId("IS_APPROVER").getValue();
					var extendWricef = this.getView().byId("idWricef").getValue();

					if (extendWricef === '') {

						this.getView().byId("idWricef").setValueState(sap.ui.core.ValueState.Error);
						this.mandatoryError(this);
						this.getView().byId("RELEASE").setEnabled(false);

					} else {
						this.clearStatus(this);
						this.getView().byId("idWricef").setValueState(sap.ui.core.ValueState.None);
					}
					impactedRelease = this.getView().byId("RELEASE").getSelectedKeys();
					if (impactedRelease.length === 0) {

						this.getView().byId("RELEASE").setValueState(sap.ui.core.ValueState.Error);
						this.mandatoryError(this);
					} else {
						this.clearStatus(this);
						this.getView().byId("RELEASE").setValueState(sap.ui.core.ValueState.None);
					}
					if (oEntry.IS_APPROVER === '') {

						this.getView().byId("IS_APPROVER").setValueState(sap.ui.core.ValueState.Error);
						this.mandatoryError(this);

					}

					//Validation Done - trigger request

					oEntry.REL = "";
					var impactedRelease = this.getView().byId("RELEASE").getSelectedKeys();
					debugger;
					for (var i = 0; i < impactedRelease.length; i++) {
						if (i == impactedRelease.length - 1) {
							oEntry.REL = oEntry.REL.concat(impactedRelease[i]);
						} else {
							oEntry.REL = oEntry.REL.concat(impactedRelease[i]).concat("|");
						}
					}
					debugger;
					oEntry.WRICEF_ID = this.getView().byId("idWricef").getValue();
					oEntry.APP_NUM = 1;
					oEntry.SERVICE_CALLER = 'EXTEND';
					debugger;
					if (this.getView().byId("statusText").getText().length == 0) {

						var approvers = this.getView().getModel("ISPOHelp").getData().results;

						var IS_APPR = "";
						var test = "<p><strong>Tech.  Approvers  </strong> (Any one can approve) : </p>\n <ul>";

						for (i = 0; i < approvers.length; i++) {
							if (approvers[i].OWNERSHIP == "TECHNICAL") { //list all tech lead approvers
								test = test.concat("<li>" + approvers[i].NAME + "</li>");
							}
							if (approvers[i].OWNERSHIP == "FUNCTIONAL") { //list only functional owner selected by user
								if (approvers[i].USER_ID == oEntry.IS_APPROVER) {
									IS_APPR = approvers[i].NAME;
								}
							}
						}
						test = test.concat("</ul><p><strong>IS Approver : </strong></p>\n <ul>");
						test = test.concat("<li>" + IS_APPR + "</li></ul>");

						MessageBox.confirm("WRICEF ID extension request will be sent to Technical & Functional owners for approval. Continue ?", {
							actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
							emphasizedAction: MessageBox.Action.OK,
							details: test,
							onClose: function (sAction) {
								if (sAction === "OK") {

									this.busyDialog = new sap.m.BusyDialog({});
									this.busyDialog.open();
									this.valueHelpModel.create('/SUBMIT_REQUESTSet', oEntry, {

										success: function (data) {
											this.busyDialog.close();
											MessageBox.success(
												"Request sent to approvers. You will recieve an E-mail with your Request ID & a link to Track your request status."
											);
										}.bind(this),
										error: function (data) {
											this.busyDialog.close();
											MessageBox.error(data.message, {
												details: data.responseText
											});
										}.bind(this)
									});
								}
							}.bind(this)

						});

					}
					debugger;
				} else if (this.getView().byId("F8").getText() === "Cancel WRICEF") { //logic to handl Cancel
	oEntry.WRICEF_ID = "";
	oEntry.APP_NUM = 1;
		oEntry.WRICEF_ID = this.getView().byId("idWricef").getValue();
			oEntry.REL = "";

			oEntry.REQUESTOR_NAME = sap.ushell.Container.getUser().getFullName();
					oEntry.REQUESTOR_EMAIL = sap.ushell.Container.getUser().getEmail();

					oEntry.TEAM = this.getView().byId("TRACK").getValue();
					oEntry.GRP = this.getView().byId("SUBTRACK").getValue();
					oEntry.NAME = this.getView().byId("DESCRIPTION").getValue();
							//get Release information
					var impactedRelease = this.getView().byId("RELEASE").getSelectedKeys();
					for (var i = 0; i < impactedRelease.length; i++) {
						if (i == impactedRelease.length - 1) {
							oEntry.REL = oEntry.REL.concat(impactedRelease[i]);
						} else {
							oEntry.REL = oEntry.REL.concat(impactedRelease[i]).concat("|");
						}
					}
					this.clearStatus(this);
					oEntry.IS_APPROVER = this.getView().byId("IS_APPROVER").getValue();
					oEntry.SERVICE_CALLER = 'CANCEL';
					oEntry.TYPE = this.getView().byId("WRICEF_TYPE").getValue();
					oEntry.OBJTYP = this.getView().byId("WRICEF_SUBTYPE").getValue();
					oEntry.SAP_COMPLEXITY = this.getView().byId("SAP_COMPLEXITY").getValue();
					oEntry.NON_SAP_COMPLEXITY = this.getView().byId("NONSAP_COMPLEXITY").getValue();
					oEntry.MW_COMPLEXITY = this.getView().byId("MW_COMPLEXITY").getValue();
					oEntry.CR = this.getView().byId("CR").getValue();
					oEntry.RAID = this.getView().byId("RAID").getValue();
					oEntry.SRCSYS = this.getView().byId("SOURCE_SYSTEM").getValue();
					oEntry.TARGET_SYSTEM = this.getView().byId("TARGET_SYSTEM").getValue();
					oEntry.BPO = this.getView().byId("BPO").getValue();
					oEntry.MW_PATTERN = this.getView().byId("MIDDLEWARE_PATTERN").getValue();
					oEntry.DELIVERY_NOTES = this.getView().byId("DELIVERY_NOTES").getValue();
					oEntry.IS_APPROVER = this.getView().byId("IS_APPROVER").getValue();
					oEntry.REQUEST_CREATEDBY = sap.ushell.Container.getService("UserInfo").getId();
					oEntry.TECH_APPROVAL = 'PENDING';
					oEntry.IS_APPROVAL = 'PENDING';
					oEntry.MW_APPROVAL = 'PENDING';
					var extendWricef = this.getView().byId("idWricef").getValue();

					if (extendWricef === '') {

						this.getView().byId("idWricef").setValueState(sap.ui.core.ValueState.Error);
						this.mandatoryError(this);
						this.getView().byId("RELEASE").setEnabled(false);

					} else {
						this.clearStatus(this);
						this.getView().byId("idWricef").setValueState(sap.ui.core.ValueState.None);
					}
				}
				
				
					if (this.getView().byId("statusText").getText().length == 0) {

						var approvers = this.getView().getModel("ISPOHelp").getData().results;

						var IS_APPR = "";
						var test = "<p><strong>Tech.  Approvers  </strong> (Any one can approve) : </p>\n <ul>";

						for (i = 0; i < approvers.length; i++) {
							if (approvers[i].OWNERSHIP == "TECHNICAL") { //list all tech lead approvers
								test = test.concat("<li>" + approvers[i].NAME + "</li>");
							}
							if (approvers[i].OWNERSHIP == "FUNCTIONAL") { //list only functional owner selected by user
								if (approvers[i].USER_ID == oEntry.IS_APPROVER) {
									IS_APPR = approvers[i].NAME;
								}
							}
						}
						test = test.concat("</ul><p><strong>IS Approver : </strong></p>\n <ul>");
						test = test.concat("<li>" + IS_APPR + "</li></ul>");

						MessageBox.confirm("WRICEF ID cancellation request will be sent to Technical & Functional owners for approval. Continue ?", {
							actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
							emphasizedAction: MessageBox.Action.OK,
							details: test,
							onClose: function (sAction) {
								if (sAction === "OK") {

									this.busyDialog = new sap.m.BusyDialog({});
									this.busyDialog.open();
									this.valueHelpModel.create('/SUBMIT_REQUESTSet', oEntry, {

										success: function (data) {
											this.busyDialog.close();
											MessageBox.success(
												"Request sent to approvers. You will recieve an E-mail with your Request ID & a link to Track your request status."
											);
										}.bind(this),
										error: function (data) {
											this.busyDialog.close();
											MessageBox.error(data.message, {
												details: data.responseText
											});
										}.bind(this)
									});
								}
							}.bind(this)

						});

					}
					
			} else { //logic to handle search wricef

				var term = this.getView().byId("searchTerm").getValue();

				var oBindings = this.getView().byId("table").getBinding("items");

				oBindings.filter([new sap.ui.model.Filter([
					new sap.ui.model.Filter("NAME", sap.ui.model.FilterOperator.Contains, term),
					new sap.ui.model.Filter("CR_NOTES", sap.ui.model.FilterOperator.Contains, term),
					new sap.ui.model.Filter("CR", sap.ui.model.FilterOperator.Contains, term),
					new sap.ui.model.Filter("RAID", sap.ui.model.FilterOperator.Contains, term),
					new sap.ui.model.Filter("RICEF", sap.ui.model.FilterOperator.Contains, term)
				], false)]);

				this.getView().byId("table").setVisible(true);
			} //if statement for radio button
			//

			//
		},
		mandatoryError: function (object) { // reusable function to display error for mandatory fields
			//Fucntion to populate mandatory field validation message
			debugger;
			object.getView().byId("statusText").setText("<strong>Fill All Required Fields</strong>.");
			object.getView().byId("statusText").setType("Error");
			object.getView().byId("statusText").setVisible(true);
			this.submitValidation = true;
		},
		clearStatus: function (oObject) {
			oObject.getView().byId("statusText").setText("");
			oObject.getView().byId("statusText").setVisible(false);

		}

	});
});