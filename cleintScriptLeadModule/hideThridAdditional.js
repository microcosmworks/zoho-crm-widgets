// hideThridAdditional 
// Page Details
// Category - Module
// Page - Create Page (Standard)
// Module - Leads
// Layout - Standard
// Event Details
// Event Type - Field Event
// Field - Additional Service Category 3
// Event - onChange


// Code -->


const thAddCat = ZDK.Page.getField("Third_Additional_Service_Category");
const thAddName = ZDK.Page.getField("Third_Additional_Service_Name");

if (thAddCat.getValue() == "Remove") {
    // if (secAddCat.getValue() == "" || secAddCat.getValue() == null) {
    //     addCat.setValue(null);
    //     addName.setValue(null);
    //     addCat.setVisibility(false);
    //     return;
    // }

    // addCat.setValue(secAddCat.getValue());
    // addName.setValue(secAddName.getValue());

    // if (thAddCat.getValue() == "" || thAddCat.getValue() == null) {
    //     secAddCat.setValue(null);
    //     secAddName.setValue(null);
    //     secAddCat.setVisibility(false);
    //     return;
    // }

    // secAddCat.setValue(thAddCat.getValue());
    // secAddName.setValue(thAddName.getValue());


    thAddCat.setValue(null);
    thAddName.setValue(null);
    thAddCat.setVisibility(false);


}