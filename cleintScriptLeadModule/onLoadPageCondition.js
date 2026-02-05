// onLoadPageCondition 
// Page Details
// Category - Module
// Page - Create Page (Standard)
// Module - Leads
// Layout - Standard
// Event Details
// Event Type - Page Event
// Event - onLoad


// Code -->


try {

    ZDK.Page.getField("Additional_Service_Category").setVisibility(false);
    // const addServiceName = ZDK.Page.getField("Additional_Service_Name");

    ZDK.Page.getField("Second_Additional_Service_Category").setVisibility(false);
    // const secAddServiceName = ZDK.Page.getField("Second_Additional_Service_Name");

    ZDK.Page.getField("Third_Additional_Service_Category").setVisibility(false);
    // const thirdAddServiceName = ZDK.Page.getField("Third_Additional_Service_Name");

    // const addName = ZDK.Page.getField("Additional_Service_Name");
    // ZDK.Page.getField("additional")
    // addName.setVisibility(false);
    // console.log("i runnnnn bcz....");
    

} catch (error) {
    console.log("error is shwoing",error);
        
}