// postalCodeUpdate 
// Page Details
// Category - Module
// Page - Detail Page (Standard)
// Module - Leads
// Layout - Standard
// Event Details
// Event Type - Field Event
// Field - Postal Code
// EventonBeforeUpdate


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
