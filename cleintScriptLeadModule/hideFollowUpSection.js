// hideFollowUpSection 
// Page Details
// Category - Module
// Page - Edit Page (Standard)
// Module - Leads
// Layout - Standard
// Event Details
// Event Type - Page Event
// Event - onLoad


// Code -->




/** 
 * log("sample logging statement") --> can be used to print any data in the browser console.
 * ZDK module can be used for customising the UI and other functionalities.
 * return false to prevent <SAVE> action
**/


let val1 = ZDK.Page.getField("Follow_Up_1").setVisibility(false);
// val1.setVisibility(false);
ZDK.Page.getField("Follow_up_1_Email_Template").setVisibility(false);
ZDK.Page.getField("Follow_up_1_sent_to").setVisibility(false);


ZDK.Page.getField("Follow_Up_2").setVisibility(false);
ZDK.Page.getField("Follow_up_2_Email_Template").setVisibility(false);
ZDK.Page.getField("Follow_up_2_sent_to").setVisibility(false);


ZDK.Page.getField("Follow_Up_3").setVisibility(false);
ZDK.Page.getField("Follow_up_3_Email_Template").setVisibility(false);
ZDK.Page.getField("Follow_up_3_sent_to").setVisibility(false);

// ZDK.Page.getField("Follow_Up_Reminders").setVisibility(false);
ZDK.Page.getField("Follow_Up_Reminders").setVisibility(false);