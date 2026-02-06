/*
What it does
This client script prevents users from selecting a past date in the
Preferred Specific Time field on the Lead detail page.
Before saving the record, it compares the selected date with today’s date
and blocks the update if a past date is chosen.

Where this client script runs

Page Details
- Category: Module
- Module: Leads
- Page: Detail Page (Standard)
- Layout: Standard

Event Details
- Event Type: Field Event
- Field: Preferred Contact Time
- Event: onBeforeUpdate

How to create
1. Go to Setup → Developer Space → Client Scripts
2. Click Create Script
3. Select:
   - Category: Module
   - Module: Leads
   - Page: Detail Page (Standard)
   - Layout: Standard
4. Under Event Details:
   - Event Type: Field Event
   - Field: Preferred Contact Time
   - Event: onBeforeUpdate
5. Paste this script code
6. Save and publish the script
*/


// Code -->




let estimationField1 = ZDK.Page.getField("Preferred_Specific_Time_if_Selected");
let estimationValue1 =value;
console.log("i called ",value);
// Add this line to your script and check the Console (F12)
console.log("THE NEW VALUE IS: ", value); 
prevEstimatevalue = estimationValue;

if (estimationValue) {
    // 1. Convert both to Date Objects
    var selectedDate = new Date(estimationValue);
    var today = new Date();

    // 2. Reset time to midnight (00:00:00) so we only compare the Date part
    selectedDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    // 3. Compare
    if (selectedDate < today) {
        // Log for debugging
        console.log("Invalid: " + selectedDate + " is before " + today);
        
        // Show Alert
        ZDK.Client.showAlert("❌ You cannot select a past date!", "Invalid Date");
        
        // Clear Field
        estimationField.setValue(null);
    }
}