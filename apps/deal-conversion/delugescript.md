/*
  Deluge Function: widgetConvertLead
  Arguments: arguments (String containing JSON payload)
  Note: This function acts as the Orchestrator. It calls separate Helper Functions for each entity.
*/
string standalone.widgetConvertLead(String arguments)
{
	// ============================================================
	// 1. INPUT PARSING & VALIDATION
	// ============================================================
	if(arguments == null || arguments.trim() == "")
	{
		return '{"code":"error", "message":"Missing payload"}';
	}

	leadPayload = Map();
	try 
	{
		leadPayload = zoho.encryption.urlDecode(arguments).toMap();
	}
	catch (e)
	{
		return '{"code":"error", "message":"JSON Parser Error: ' + e + '"}';
	}

	if(leadPayload == null)
	{
		return '{"code":"error", "message":"Invalid JSON"}';
	}

	leadId = leadPayload.get("leadId");
	if(leadId == null)
	{
		return '{"code":"error", "message":"Lead ID required"}';
	}

	// ============================================================
	// CHECK IF LEAD ALREADY CONVERTED
	// ============================================================
	// Get lead record to check if already converted
	leadRecord = zoho.crm.getRecordById("Leads", leadId.toLong());
	if(leadRecord != null)
	{
		leadStatus = ifnull(leadRecord.get("Lead_Status"), "");
		leadStatusLower = leadStatus.toLowerCase();
		info "Lead Status: " + leadStatus;
		
		// Check if lead is already converted - check multiple possible statuses
		if(leadStatusLower.contains("converted") || leadStatus == "Converted" || 
		   leadStatus == "Closed-Converted" || leadStatus == "Closed - Converted")
		{
			info "Lead already converted, returning error";
			return '{"code":"error", "message":"This lead has already been converted. Cannot convert again."}';
		}
		
		// Also check if Converted_Deal_Id is populated (indicates lead was converted)
		convertedDealId = leadRecord.get("Converted_Deal_Id");
		if(convertedDealId != null && convertedDealId != "")
		{
			info "Lead has Converted_Deal_Id: " + convertedDealId;
			return '{"code":"error", "message":"This lead has already been converted. Deal ID: ' + convertedDealId + '"}';
		}
	}
	else
	{
		// Lead not found - might be already converted (Zoho removes converted leads from Leads module)
		// Check if a deal exists for this lead
		dealSearch = zoho.crm.searchRecords("Deals", "(Converted_Lead_Id:equals:" + leadId + ")");
		if(dealSearch != null && dealSearch.size() > 0)
		{
			existingDeal = dealSearch.get(0);
			info "Deal already exists for this lead: " + existingDeal.get("id");
			return '{"code":"error", "message":"This lead has already been converted. Deal ID: ' + existingDeal.get("id") + '"}';
		}
	}

	scenario = leadPayload.get("scenario"); // e.g., "TENANT", "LANDLORD"
	accountInfo = leadPayload.get("account");
	contactInfo = leadPayload.get("contact");
	billingInfo = leadPayload.get("billing");
	serviceLocation = leadPayload.get("serviceLocation");
	// Extract address from root if available (Landlord scenario)
	rootAddress = leadPayload.get("billingAddress");

	// Initial Validation
	if (scenario == null || accountInfo == null || contactInfo == null || billingInfo == null) {
		return '{"code":"error", "message":"Incomplete data payload (missing scenario, account, contact, or billing info)"}';
	}

	// ============================================================
	// 2. ACCOUNT STRATEGY
	// ============================================================
	// Call Helper: handleAccount
	// This function handles creating a new Landlord account or finding an existing one.
	accountIdToLink = standalone.handleAccount(accountInfo, billingInfo, contactInfo, scenario, rootAddress);
	
	// Error Check for Account
	if (accountIdToLink != null && accountIdToLink.toString().contains("error")) {
		return accountIdToLink; // Return the error message directly
	}

	// ============================================================
	// 3. CONTACT STRATEGY
	// ============================================================
	// Call Helper: handleContact
	// This function handles creating a new Contact (Tenant/Landlord) or updating an existing one.
	contactIdToLink = standalone.handleContact(contactInfo, accountIdToLink);

	// Error Check for Contact
	if (contactIdToLink != null && contactIdToLink.toString().contains("error")) {
		return contactIdToLink; // Return the error message directly
	}

	// ============================================================
	// 4. SERVICE LOCATION STRATEGY
	// ============================================================
	// Call Helper: handleServiceLocation
	// This function creates the Service Location record linked to the Account.
	serviceLocationId = standalone.handleServiceLocation(serviceLocation, contactInfo, accountIdToLink);

	// ============================================================
	// 5. DEAL STRATEGY & CONVERSION
	// ============================================================
	// Call Helper: convertLeadWithDeal
	// This function prepares the Deal payload and executes the Lead Conversion.
	conversionResponse = standalone.convertLeadWithDeal(leadId, accountIdToLink, contactIdToLink, serviceLocationId, contactInfo, scenario);

	return conversionResponse;
}

/* -------------------------------------------------------------------------
   HELPER FUNCTION 1: handleAccount
   Inputs: accountInfo (Map), billingInfo (Map), contactInfo (Map), scenario (String), rootAddress (Map)
   Returns: Long (Account ID) or String (Error JSON)
   ------------------------------------------------------------------------- */
string standalone.handleAccount(Map accountInfo, Map billingInfo, Map contactInfo, String scenario, Map rootAddress)
{
	accountIdToLink = null;

	// 1. Check if Existing ID Provided
	if(accountInfo != null && accountInfo.get("existingId") != null && accountInfo.get("existingId") != "")
	{
		accountIdToLink = accountInfo.get("existingId");
		
		// Check if we need to update account with contact details (Landlord sync)
		if(accountInfo.get("updateWithContact") == true)
		{
			updateAccountMap = Map();
			
			if(accountInfo.get("updateName") != null && accountInfo.get("updateName").trim() != "") {
				updateAccountMap.put("Account_Name", accountInfo.get("updateName"));
			}
			if(accountInfo.get("updatePhone") != null && accountInfo.get("updatePhone").trim() != "") {
				updateAccountMap.put("Phone", accountInfo.get("updatePhone"));
			}
			if(accountInfo.get("updateEmail") != null && accountInfo.get("updateEmail").trim() != "") {
				updateAccountMap.put("Email", accountInfo.get("updateEmail"));
				updateAccountMap.put("Description", "Account Email: " + accountInfo.get("updateEmail"));
			}
			
			if(!updateAccountMap.isEmpty()) {
				updateAccResp = zoho.crm.updateRecord("Accounts", accountIdToLink.toLong(), updateAccountMap);
				info "Account updated with contact details: " + updateAccResp;
			}
		}
		
		// Check if we need to update billing address (Same account, different billing)
		if(accountInfo.get("updateBillingAddress") == true && accountInfo.get("newBillingAddress") != null)
		{
			billingAddrMap = Map();
			newBillingAddr = accountInfo.get("newBillingAddress");
			
			if(newBillingAddr.get("street") != null) {
				billingAddrMap.put("Billing_Street", newBillingAddr.get("street"));
			}
			if(newBillingAddr.get("city") != null) {
				billingAddrMap.put("Billing_City", newBillingAddr.get("city"));
			}
			if(newBillingAddr.get("province") != null) {
				billingAddrMap.put("Billing_State", newBillingAddr.get("province"));
			}
			if(newBillingAddr.get("postal") != null) {
				billingAddrMap.put("Billing_Code", newBillingAddr.get("postal"));
			}
			if(newBillingAddr.get("country") != null) {
				billingAddrMap.put("Billing_Country", newBillingAddr.get("country"));
			}
			
			if(!billingAddrMap.isEmpty()) {
				updateBillingResp = zoho.crm.updateRecord("Accounts", accountIdToLink.toLong(), billingAddrMap);
				info "Account billing address updated: " + updateBillingResp;
			}
		}
	}
	// 2. Scenario Specific: Tenant might provide 'landlordAccountId'
	else if (accountInfo != null && accountInfo.get("landlordAccountId") != null) 
	{
		accountIdToLink = accountInfo.get("landlordAccountId");
	}
	
	// 3. Create New Account (if no ID found)
	if(accountIdToLink == null)
	{
		newAccountMap = Map();
		
		// Name Logic
		accountName = "Converted Account";
		if(accountInfo.get("newName") != null && accountInfo.get("newName").trim() != "") {
			accountName = accountInfo.get("newName");
		} else if (accountInfo.get("newLandlordName") != null && accountInfo.get("newLandlordName").trim() != "") {
			accountName = accountInfo.get("newLandlordName");
		} else if (contactInfo != null && contactInfo.get("name") != null && contactInfo.get("name").trim() != "") {
			// Fallback: Use Contact Name if no specific Account Name is provided
			accountName = contactInfo.get("name");
		}
		newAccountMap.put("Account_Name", accountName);
		
		// Type Logic - Use type from accountInfo if provided, otherwise use scenario
		accountTypeValue = "";
		if (accountInfo.get("type") != null && accountInfo.get("type") != "") {
			accountTypeValue = accountInfo.get("type");
		} else if(scenario == "LANDLORD/OWNER" || scenario == "LANDLORD") {
			accountTypeValue = "Landlord";
		} else if (scenario != null) {
			accountTypeValue = scenario;
		}
		if (accountTypeValue != "") {
			newAccountMap.put("Account_Type", accountTypeValue);
		}

		// Phone/Email (check newPhone first, then newLandlordPhone, then contactInfo fallback)
		phoneValue = "";
		if (accountInfo.get("newPhone") != null && accountInfo.get("newPhone") != "") {
			phoneValue = accountInfo.get("newPhone");
		} else if (accountInfo.get("newLandlordPhone") != null && accountInfo.get("newLandlordPhone") != "") {
			phoneValue = accountInfo.get("newLandlordPhone");
		} else if (contactInfo != null && contactInfo.get("phone") != null && contactInfo.get("phone") != "") {
			phoneValue = contactInfo.get("phone");
		}
		if (phoneValue != "") {
			newAccountMap.put("Phone", phoneValue);
		}
		
		// Email (check newEmail first, then newLandlordEmail, then contactInfo fallback)
		emailValue = "";
		if (accountInfo.get("newEmail") != null && accountInfo.get("newEmail") != "") {
			emailValue = accountInfo.get("newEmail");
		} else if (accountInfo.get("newLandlordEmail") != null && accountInfo.get("newLandlordEmail") != "") {
			emailValue = accountInfo.get("newLandlordEmail");
		} else if (contactInfo != null && contactInfo.get("email") != null && contactInfo.get("email") != "") {
			emailValue = contactInfo.get("email");
		}
		if (emailValue != "") {
			// Store in Email field if exists, otherwise Description
			newAccountMap.put("Email", emailValue);
			// Also store in Description for visibility
			newAccountMap.put("Description", "Account Email: " + emailValue);
		}

		// Billing Info (Custom Fields)
		if(billingInfo != null)
		{
			if(billingInfo.get("centralized") != null) {
				newAccountMap.put("Centralized_Billing__c", billingInfo.get("centralized"));
			}
			if(billingInfo.get("usage") != null) {
				newAccountMap.put("Billing_Usage__c", billingInfo.get("usage"));
			}
			if(billingInfo.get("sourceAccountId") != null) {
				newAccountMap.put("Billing_Source_Account__c", billingInfo.get("sourceAccountId"));
			}
		}
		
		// Address Logic (Check explicit address first, then clone if needed)
		// Use root address map if available, otherwise check scenario-specific
		addressSource = rootAddress;
		
		// If explicit 'landlordAddress' exists (e.g. Tenant scenario), prefer that
		if (accountInfo.get("landlordAddress") != null) {
			addressSource = accountInfo.get("landlordAddress");
		}

		if (addressSource != null && !addressSource.isEmpty()) {
			// Map to Billing Address (Standard Account Fields)
			newAccountMap.put("Billing_Street", addressSource.get("street"));
			newAccountMap.put("Billing_City", addressSource.get("city"));
			newAccountMap.put("Billing_State", addressSource.get("province"));
			newAccountMap.put("Billing_Code", addressSource.get("postal"));
			newAccountMap.put("Billing_Country", addressSource.get("country"));
			
			// Map to Shipping Address (Optional, if needed to mirror)
			<!-- newAccountMap.put("Shipping_Street", addressSource.get("street")); -->
			<!-- newAccountMap.put("Shipping_City", addressSource.get("city")); -->
			<!-- newAccountMap.put("Shipping_State", addressSource.get("province")); -->
			<!-- newAccountMap.put("Shipping_Code", addressSource.get("postal")); -->
			<!-- newAccountMap.put("Shipping_Country", addressSource.get("country")); -->
		}

		createAccResp = zoho.crm.createRecord("Accounts", newAccountMap);
		
		if(createAccResp.get("id") != null)
		{
			accountIdToLink = createAccResp.get("id");
		}
		else
		{
			return '{"code":"error", "message":"Account Creation Failed", "details":' + createAccResp.toString() + '}';
		}
	}
	
	return accountIdToLink;
}

/* -------------------------------------------------------------------------
   HELPER FUNCTION 2: handleContact
   Inputs: contactInfo (Map), accountId (Long/String)
   Returns: Long (Contact ID) or String (Error JSON)
   ------------------------------------------------------------------------- */
string standalone.handleContact(Map contactInfo, String accountId)
{
	contactIdToLink = "";
	
	if(contactInfo == null) {
		info "contactInfo is null, returning empty";
		return ""; // Return empty string instead of null for string function
	}

	// 1. Check for Existing ID
	if(contactInfo.get("existingId") != null && contactInfo.get("existingId") != "")
	{
		contactIdToLink = contactInfo.get("existingId");
		
		// Update Existing Contact Logic
		updateContactMap = Map();
		
		uPhone = contactInfo.get("phone");
		if (uPhone != null && uPhone != "") {
			updateContactMap.put("Phone", uPhone);
			updateContactMap.put("Mobile", uPhone);
		}
		
		uEmail = contactInfo.get("email");
		if (uEmail != null && uEmail != "") {
			updateContactMap.put("Email", uEmail);
		}
		
		// Name Update (Optional)
		uName = contactInfo.get("name");
		if (uName != null && uName != "") {
			 if (uName.contains(" ")) {
				updateContactMap.put("First_Name", uName.subString(0, uName.indexOf(" ")));
				updateContactMap.put("Last_Name", uName.subString(uName.indexOf(" ") + 1));
			} else {
				updateContactMap.put("Last_Name", uName);
			}
		}
		
		// Update Roles if provided
		roles = contactInfo.get("roles");
		if(roles != null && roles.size() > 0) {
			updateContactMap.put("Contact_Roles", roles);
		}
		
		if (!updateContactMap.isEmpty()) {
			zoho.crm.updateRecord("Contacts", contactIdToLink.toLong(), updateContactMap);
		}
	}
	// 2. Search by Email (Fallback if no ID but email exists)
	else if(contactInfo.get("email") != null && contactInfo.get("email") != "")
	{
		search = zoho.crm.searchRecords("Contacts", "(Email:equals:" + contactInfo.get("email") + ")");
		if(search != null && search.size() > 0)
		{
			contactIdToLink = search.get(0).get("id");
		}
	}

	// 3. Create New Contact
	if(contactIdToLink == null)
	{
		newContactMap = Map();
		
		// Name Parsing
		fullName = contactInfo.get("name");
		if(fullName == null) fullName = "Converted Contact";
		
		if (fullName.contains(" ")) {
			newContactMap.put("First_Name", fullName.subString(0, fullName.indexOf(" ")));
			newContactMap.put("Last_Name", fullName.subString(fullName.indexOf(" ") + 1));
		} else {
			newContactMap.put("Last_Name", fullName);
		}

		if(contactInfo.get("email") != null) {
			newContactMap.put("Email", contactInfo.get("email"));
		}
		if(contactInfo.get("phone") != null) {
			newContactMap.put("Phone", contactInfo.get("phone"));
			newContactMap.put("Mobile", contactInfo.get("phone"));
		}
		
		// Link to Account (if provided)
		if(accountId != null) {
			newContactMap.put("Account_Name", accountId);
		}
		
		newContactMap.put("Do_Not_Invoice__c", contactInfo.get("doNotInvoice"));
		
		// Roles - Contact_Roles is a multi-select picklist, expects a list
		roles = contactInfo.get("roles");
		if(roles != null && roles.size() > 0) {
			// For multi-select, pass as list directly
			newContactMap.put("Contact_Roles", roles);
		}

		createResp = zoho.crm.createRecord("Contacts", newContactMap);
		if(createResp != null && createResp.get("id") != null)
		{
			contactIdToLink = createResp.get("id");
		}
		else
		{
			return '{"code":"error", "message":"Contact Creation Failed", "details":' + createResp + '}';
		}
	}
	
	return contactIdToLink;
}

/* -------------------------------------------------------------------------
   HELPER FUNCTION 3: handleServiceLocation
   Inputs: serviceLocation (Map), contactInfo (Map), accountId (Long/String)
   Returns: Long (Service Location ID) or null
   ------------------------------------------------------------------------- */
string standalone.handleServiceLocation(Map serviceLocation, Map contactInfo, String accountId)
{
	serviceLocationId = null;
	
	if(serviceLocation != null && accountId != null)
	{
		serviceMap = Map();
		
		// Naming: Street - Contact Name
		slName = "Service Location";
		if(serviceLocation.get("street") != null) {
			slName = serviceLocation.get("street");
		}
		if(contactInfo != null && contactInfo.get("name") != null) {
			slName = slName + " - " + contactInfo.get("name");
		}
		serviceMap.put("Name", slName);
		
		serviceMap.put("Account", accountId);
		
		if(serviceLocation.get("addressType") != null) {
			serviceMap.put("Address_Type", serviceLocation.get("addressType"));
		}
		
		// Address Fields
		street = serviceLocation.get("street"); if(street==null) street="";
		city = serviceLocation.get("city"); if(city==null) city="";
		province = serviceLocation.get("province"); if(province==null) province="";
		postal = serviceLocation.get("postal"); if(postal==null) postal="";
		country = serviceLocation.get("country"); if(country==null) country="";
		
		fullAddr = street + ", " + city + ", " + province + ", " + country + ", " + postal;
		serviceMap.put("Service_Address", fullAddr);
		
		// Map individual fields
		serviceMap.put("Shipping_Street", street);
		serviceMap.put("Shipping_City", city);
		serviceMap.put("Shipping_State", province);
		serviceMap.put("Shipping_Zip", postal);
		serviceMap.put("Shipping_Country", country);
		
		createSLResp = zoho.crm.createRecord("Service_Locations", serviceMap);
		if(createSLResp.get("id") != null)
		{
			serviceLocationId = createSLResp.get("id");
		}
	}
	
	return serviceLocationId;
}

/* -------------------------------------------------------------------------
   HELPER FUNCTION 4: convertLeadWithDeal
   Inputs: leadId, accountId, contactId, serviceLocationId, contactInfo, scenario
   Returns: String (JSON Response)
   ------------------------------------------------------------------------- */
string standalone.convertLeadWithDeal(String leadId, String accountId, String contactId, String serviceLocationId, Map contactInfo, String scenario)
{
	if(leadId == null) {
		return '{"code":"error", "message":"Lead ID is missing for conversion"}';
	}

	convertMap = Map();
	convertMap.put("overwrite_assignment_rules", true);
	convertMap.put("notify_lead_owner", true);
	convertMap.put("notify_new_entity_owner", true);

	// Link Account - check for both null AND empty string
	if(accountId != null && accountId != "") {
		convertMap.put("Accounts", accountId);
	}
	
	// Link Contact - check for both null AND empty string
	if(contactId != null && contactId != "") {
		convertMap.put("Contacts", contactId);
	}

	// Prepare Deal
	scenarioLabel = "General";
	if(scenario != null) {
		scenarioLabel = scenario;
	}
	dealName = "Deal - " + scenarioLabel;
	if(contactInfo != null && contactInfo.get("name") != null) {
		dealName = dealName + " - " + contactInfo.get("name");
	}

	dealMap = Map();
	dealMap.put("Deal_Name", dealName);
	dealMap.put("Stage", "Draft");
	dealMap.put("Closing_Date", zoho.currentdate.addDay(30));
	
	convertMap.put("Deals", dealMap);

	// Execute Conversion
	convertResponse = zoho.crm.convertLead(leadId.toLong(), convertMap);
	info "Convert Lead Response: " + convertResponse;
	
	if(convertResponse == null)
	{
		return '{"code":"error", "message":"Conversion returned null"}';
	}
	
	// Check if conversion response contains an error
	// First extract values to log them
	errorStatus = ifnull(convertResponse.get("status"), "");
	errorCode = ifnull(convertResponse.get("code"), "");
	errorMsg = ifnull(convertResponse.get("message"), "Conversion failed");
	
	info "Error Status: " + errorStatus;
	info "Error Code: " + errorCode;
	info "Error Message: " + errorMsg;
	
	// Check for any error indicators
	if(errorStatus == "error" || errorCode == "ID_ALREADY_CONVERTED" || 
	   errorCode == "DUPLICATE_DATA" || errorCode == "INVALID_DATA" ||
	   errorCode == "MANDATORY_NOT_FOUND")
	{
		return '{"code":"error", "message":"' + errorMsg + '", "errorCode":"' + errorCode + '"}';
	}
	
	// ============================================================
	// POST-CONVERSION: Update Deal with Service Location
	// ============================================================
	// Extract Deal ID from conversion response
	dealId = null;
	if(convertResponse.get("Deals") != null) {
		dealId = convertResponse.get("Deals");
	}
	
	// Update Deal with Service Location
	if(dealId != null && serviceLocationId != null) {
		updateDealMap = Map();
		updateDealMap.put("Service_Location", serviceLocationId);
		
		updateResp = zoho.crm.updateRecord("Deals", dealId.toLong(), updateDealMap);
		info "Deal updated with Service Location: " + updateResp;
	}
	
	return ('{"code":"success", "message":"Lead converted", "details":' + convertResponse) + '}';
}
