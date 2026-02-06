/*
What it does
This client script validates and formats the Postal Code field on the Lead detail page.
Before the record is saved, it checks that the value is a valid Canadian postal code,
auto-formats it to the standard format (A1A 1A1), and prevents saving if the value is invalid.

Where this client script runs

Page Details
- Category: Module
- Module: Leads
- Page: Detail Page (Standard)
- Layout: Standard

Event Details
- Event Type: Field Event
- Field: Postal Code
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
   - Field: Postal Code
   - Event: onBeforeUpdate
5. Paste this script code
6. Save and publish the script
*/


// Code -->

var field = ZDK.Page.getField("Zip_Code");
var postalCode = value;
var prevCode = field.getValue();
// Exit if empty
if (!postalCode) {
    ZDK.Client.showAlert("empty");
    return;
}

// Normalize
postalCode = postalCode.toUpperCase().trim();
// ZDK.Client.showAlert(postalCode);
var regex = /^[A-Z][0-9][A-Z]\s?[0-9][A-Z][0-9]$/;
console.log("regex   value-",regex.test(postalCode));

// ZDK.Client.showAlert("value-", regex.test(postalCode));

// Correct Canadian postal code regex


if (!regex.test(postalCode)) {
    ZDK.Client.showAlert(
        "Invalid Canadian postal code. Example: A1A 1A1"
    );

    field.setValue(""); // safest reset
    return false;
}


// Optional: force space format (A1A 1A1)
postalCode = postalCode.replace(/^(.{3})(.{3})$/, "$1 $2");
field.setValue(postalCode);
