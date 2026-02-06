/*
What it does
This client script runs when the third Additional Service Category field changes
on the Lead edit page.
If the user selects "Remove", it clears the third additional service category and
name fields and hides them, keeping the form clean and preventing unused data.

Where this client script runs

Page Details
- Category: Module
- Module: Leads
- Page: Edit Page (Standard)
- Layout: Standard

Event Details
- Event Type: Field Event
- Field: Additional Service Category 3
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
   - Field: Additional Service Category 3
   - Event: onChange
5. Paste this script code
6. Save and publish the script
*/



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