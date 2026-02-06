/*
What it does
This client script controls the visibility of additional service category fields
based on the selected Service Type on the Lead edit page.
If the additional category fields have no value, they are automatically hidden
to keep the form clean and easy to use.

Where this client script runs

Page Details
- Category: Module
- Module: Leads
- Page: Edit Page (Standard)
- Layout: Standard

Event Details
- Event Type: Field Event
- Field: Service Type
- Event: onChange

How to create
1. Go to Setup → Developer Space → Client Scripts
2. Click Create Script
3. Select:
   - Category: Module
   - Module: Leads
   - Page: Edit Page (Standard)
   - Layout: Standard
4. Under Event Details:
   - Event Type: Field Event
   - Field: Service Type
   - Event: onChange
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
