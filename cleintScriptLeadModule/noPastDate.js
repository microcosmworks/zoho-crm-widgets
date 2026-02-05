// noPastDate 
// Page Details
// Category - Module
// Page - Detail Page (Standard)
// Module - Leads
// Layout - Standard
// Event Details
// Event Type - Field Event
// Field - Estimation Date
// Event - onBeforeUpdate


// Code -->


let estimationField = ZDK.Page.getField("Estimation_Date");
let estimationValue =value;
console.log("i called ",value);
// Add this line to your script and check the Console (F12)
console.log("THE NEW VALUE IS: ", value); 
let prevEstimatevalue = estimationValue;

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



