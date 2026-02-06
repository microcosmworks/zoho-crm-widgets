/*
What it does
This client script runs when the Lead detail page loads.
It hides empty Additional Service Category fields, follow-up related fields, and
disables the Convert button unless the Lead status is set to "Ready to Convert".
This helps keep the detail page clean and prevents users from converting a Lead
before it is ready.

Where this client script runs

Page Details
- Category: Module
- Module: Leads
- Page: Detail Page (Standard)
- Layout: Standard

Event Details
- Event Type: Page Event
- Event: onLoad

How to create
1. Go to Setup → Developer Space → Client Scripts
2. Click Create Script
3. Select:
   - Category: Module
   - Module: Leads
   - Page: Detail Page (Standard)
   - Layout: Standard
4. Under Event Details:
   - Event Type: Page Event
   - Event: onLoad
5. Paste this script code
6. Save and publish the script
*/


// Code -->


const addCat = ZDK.Page.getField("Additional_Service_Category");
const secAddCat = ZDK.Page.getField("Second_Additional_Service_Category");
const thAddCat = ZDK.Page.getField("Third_Additional_Service_Category");

try {
    
   let convertButton = ZDK.Page.getButton('convert');
    let leadStatus = ZDK.Page.getField('Lead_Status').getValue();
    if (leadStatus !== "Ready to Convert") {
        convertButton.disable();
        // console.log("button convert try to change");
        // var convertBtnId = convertButton.getApiName();
        // console.log("button id", convertBtnId);
        // ZDK.Page.getField(convertBtnId).setVisibility(false);
        // convertBtnId.hidden;
    }
} catch (error) {
    console.log(
        "error while getting button"
    );
    
}


if (addCat.getValue() == null) addCat.setVisibility(false);

if (secAddCat.getValue() == null) secAddCat.setVisibility(false);

if (thAddCat.getValue() == null) thAddCat.setVisibility(false);



let val1 = ZDK.Page.getField("Follow_Up_1").setVisibility(false);
// val1.setVisibility(false);
ZDK.Page.getField("Follow_up_1_Email_Template").setVisibility(false);
ZDK.Page.getField("Follow_up_1_sent_to").setVisibility(false);


ZDK.Page.getField("Follow_Up_2").setVisibility(false);
ZDK.Page.getField("Follow_up_2_Email_Template").setVisibility(false);
ZDK.Page.getField("Follow_up_2_sent_to").setVisibility(false);


ZDK.Page.getField("Follow_Up_3").setVisibility(false);
ZDK.Page.getField("Follow_up_3_Email_Template").setVisibility(false);
ZDK.Page.getField("Follow_up_3_sent_to").setVisibility(false);

ZDK.Page.getField("Follow_Up_1_Status").setVisibility(false);
ZDK.Page.getField("Follow_Up_2_Status").setVisibility(false);
ZDK.Page.getField("Follow_Up_3_Status").setVisibility(false);


ZDK.Page.getField("Follow_Up_Reminders").setVisibility(false);
