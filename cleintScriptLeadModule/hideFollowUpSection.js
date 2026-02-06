/*
What it does
This client script runs when the Lead edit page loads.
It hides all follow-up related fields and the follow-up reminders section so users
are not distracted by follow-up tracking fields while editing the Lead.

Where this client script runs

Page Details
- Category: Module
- Module: Leads
- Page: Edit Page (Standard)
- Layout: Standard

Event Details
- Event Type: Page Event
- Event: onLoad

How to create
1. Go to Setup → Developer Space → Client Scripts
2. Click Create Script
3. Select:
   - Category: Module
   - Module: Leads
   - Page: Edit Page (Standard)
   - Layout: Standard
4. Under Event Details:
   - Event Type: Page Event
   - Event: onLoad
5. Paste this script code
6. Save and publish the script
*/



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