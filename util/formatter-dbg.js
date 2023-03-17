sap.ui.define([], function () {
		'use strict';
		return {
			setViz: function (object) {
	
					if ( object === "") {
						return false;
					}else{
						return true;
					}
				
			},
			setStatus: function(object){
				
					if ( object === "PENDING") {
						return "Warning";
					}else if( object === "REJECTED"){
						return "Error";
					}else if( object === "APPROVED"){
						return "Success";
					}
			},
			setActive: function(object){
				if( object === "PENDING" ){
					return false;
				}else{
					return true;
				}
			},
			setVisible: function(object){
				if( object === "INTERFACE" ){
					return true;
				}else{
					return false;
				}
				
			},
			setEnabled: function(object){

					if( object === "TECHNICAL" || object === "FUNCTIONAL" ){
					return true;
				}else{
					return false;
				}
			}
		};
	}
);