/*
What it does
This client script runs when the Lead edit page loads.
It checks the additional service category fields and hides them if they do not
contain any values, keeping the edit form clean and easier to work with.

Where this client script runs

Page Details
- Category: Module
- Module: Leads
- Page: Edit Page (Standard)
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
   - Page: Edit Page (Standard)
   - Layout: Standard
4. Under Event Details:
   - Event Type: Page Event
   - Event: onLoad
5. Paste this script code
6. Save and publish the script
*/


// Code -->


try {

    
    const addCat = ZDK.Page.getField("Additional_Service_Category");
    if (addCat.getValue() == null) addCat.setVisibility(false);
    // const addServiceName = ZDK.Page.getField("Additional_Service_Name");

    const secCat = ZDK.Page.getField("Second_Additional_Service_Category");
    if (secCat.getValue() == null) secCat.setVisibility(false);
    // const secAddServiceName = ZDK.Page.getField("Second_Additional_Service_Name");

    const thCat = ZDK.Page.getField("Third_Additional_Service_Category");
    if(thCat.getValue() == null) thCat.setVisibility(false);
    // const thirdAddServiceName = ZDK.Page.getField("Third_Additional_Service_Name");

    // const addName = ZDK.Page.getField("Additional_Service_Name");
    // ZDK.Page.getField("additional")
    // addName.setVisibility(false);
    // console.log("i runnnnn bcz....");
    

} catch (error) {
    console.log("error is shwoing",error);
        
}