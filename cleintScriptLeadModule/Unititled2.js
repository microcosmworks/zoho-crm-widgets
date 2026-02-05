// Untitled 
// Page Details
// Category - Module
// PageCreate Page (Standard)
// Module - Leads
// Layout - Standard
// Event Details
// Event Type - Button Event
// Button - Add more service
// Event - onClick


// Code -->



const serviceName = ZDK.Page.getField("Service_Name");

const addServiceCat = ZDK.Page.getField("Additional_Service_Category");
const addServiceName = ZDK.Page.getField("Additional_Service_Name");

const secAddServiceCat = ZDK.Page.getField("Second_Additional_Service_Category");
const secAddServiceName = ZDK.Page.getField("Second_Additional_Service_Name");

const thirdAddServiceCat = ZDK.Page.getField("Third_Additional_Service_Category");
const thirdAddServiceName = ZDK.Page.getField("Third_Additional_Service_Name");

/* Get values */
const serviceNameVal = serviceName.getValue();
const addServiceNameVal = addServiceName.getValue();
const secAddServiceNameVal = secAddServiceName.getValue();

/* Hide everything first */
// addServiceCat.hide();
// addServiceName.hide();
// secAddServiceCat.hide();
// secAddServiceName.hide();
// thirdAddServiceCat.hide();
// thirdAddServiceName.hide();

console.log("value print now.....");

console.log("service name val", serviceNameVal,addServiceNameVal);


/* Level 1 */
if (serviceNameVal == "" || serviceNameVal == null) {    
    ZDK.Client.showAlert("Please Select Service Type and Service Catergory.....");
    return;
}

if (serviceNameVal != "" && (addServiceCat.getValue() == "" || addServiceCat.getValue() == null )) {
    addServiceCat.setVisibility(true);
    return;
}

if (addServiceNameVal != "" && (secAddServiceCat.getValue() == "" || secAddServiceCat.getValue() == null )) {
    secAddServiceCat.setVisibility(true);
    return;
}


if (secAddServiceNameVal != "" && (thirdAddServiceCat.getValue() == "" || thirdAddServiceCat.getValue() == null)) {
    thirdAddServiceCat.setVisibility(true);
    return;
}


ZDK.Client.showAlert("No additional services can be added.");

