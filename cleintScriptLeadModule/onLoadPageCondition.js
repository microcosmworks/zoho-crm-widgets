/*
What it does
This client script runs when the Lead creation page loads.
It hides all Additional Service Category fields by default, ensuring the form
starts in a clean and simplified state for users.

Where this client script runs

Page Details
- Category: Module
- Module: Leads
- Page: Create Page (Standard)
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
   - Page: Create Page (Standard)
   - Layout: Standard
4. Under Event Details:
   - Event Type: Page Event
   - Event: onLoad
5. Paste this script code
6. Save and publish the script
*/



// Code -->


try {

    ZDK.Page.getField("Additional_Service_Category").setVisibility(false);
    // const addServiceName = ZDK.Page.getField("Additional_Service_Name");

    ZDK.Page.getField("Second_Additional_Service_Category").setVisibility(false);
    // const secAddServiceName = ZDK.Page.getField("Second_Additional_Service_Name");

    ZDK.Page.getField("Third_Additional_Service_Category").setVisibility(false);
    // const thirdAddServiceName = ZDK.Page.getField("Third_Additional_Service_Name");

    

} catch (error) {
    console.log("error is shwoing",error);
        
}