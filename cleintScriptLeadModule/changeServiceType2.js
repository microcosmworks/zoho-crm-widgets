// changeServiceType 
// Page Details
// Category - Module
// PageCreate Page (Standard)
// Module - Leads
// Layout - Standard
// Event Details
// Event Type - Field Event
// Field - Service Type
// Event - 


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