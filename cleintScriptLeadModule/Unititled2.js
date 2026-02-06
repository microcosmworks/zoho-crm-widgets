/*
What it does
This client script runs when the "Add more service" button is clicked on the
Lead creation page.
It allows users to add up to three additional service categories in sequence.
The script validates that the main Service Type is selected first, then
progressively reveals the next available Additional Service Category field.
If all additional service slots are already used, it shows a message indicating
that no more services can be added.

Where this client script runs

Page Details
- Category: Module
- Module: Leads
- Page: Create Page (Standard)
- Layout: Standard

Event Details
- Event Type: Button Event
- Button: Add more service
- Event: onClick

How to create
1. Go to Setup → Developer Space → Client Scripts
2. Click Create Script
3. Select:
   - Category: Module
   - Module: Leads
   - Page: Create Page (Standard)
   - Layout: Standard
4. Under Event Details:
   - Event Type: Button Event
   - Button: Add more service
   - Event: onClick
5. Paste this script code
6. Save and publish the script
*/

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

