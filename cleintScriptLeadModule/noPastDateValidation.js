/*
What it does
This client script validates the Estimation Date field on the Lead creation page.
When the field value changes, it checks that the selected date is not in the past.
If a past date is selected, it shows an alert and clears the field immediately.

Where this client script runs

Page Details
- Category: Module
- Module: Leads
- Page: Create Page (Standard)
- Layout: Standard

Event Details
- Event Type: Field Event
- Field: Estimation Date
- Event: onChange

How to create
1. Go to Setup → Developer Space → Client Scripts
2. Click Create Script
3. Select:
   - Category: Module
   - Module: Leads
   - Page: Create Page (Standard)
   - Layout: Standard
4. Under Event Details:
   - Event Type: Field Event
   - Field: Estimation Date
   - Event: onChange
5. Paste this script code
6. Save and publish the script
*/



// Code -->

var estimationField = ZDK.Page.getField("Estimation_Date");
var estimationValue = estimationField.getValue();

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