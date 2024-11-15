// Include the Zoho Embedded App SDK
const script = document.createElement('script');
script.src = "https://live.zwidgets.com/js-sdk/1.2/ZohoEmbededAppSDK.min.js";
document.head.appendChild(script);

script.onload = function () {
    console.log('Zoho SDK loaded successfully.');

    // Declare recId globally
    let recId;
    let mandatoryFields;

    // Subscribe to the PageLoad event to get the record ID
    ZOHO.embeddedApp.on("PageLoad", function (data) {
        console.log("Page loaded:", data);

        // Since EntityId is a string, just assign it directly
        if (data && data.EntityId) {
            recId = data.EntityId;
            console.log('Record ID:', recId);
        } else {
            console.error("Record ID not found in PageLoad data.");
        }
    });

    // Run this on page load
    document.addEventListener("DOMContentLoaded", function () {
    });
    // Elements
    // const sellerType = document.getElementById('sellerType');
    // const sellerFields = ['firstName', 'lastName', 'sellerEmail', 'sellerPhone', 'sellerAddress', 'sellerCity', 'sellerProvince', 'postalCode'];
    // const companyFields = ['companyName', 'companyPhone', 'companyEmail', 'companyAddress', 'companyCity', 'companyProvince', 'companyPostalCode'];

    // Function to show/hide fields based on Seller Type
    // function toggleFieldsBasedOnSellerType() {
    //     const selectedSellerType = sellerType.value;

    //     if (selectedSellerType === 'Private_Seller') {
    //         // Show seller fields and make them mandatory
    //         sellerFields.forEach(function (fieldId) {
    //             const fieldElement = document.getElementById(fieldId);
    //             fieldElement.parentElement.style.display = 'block';
    //             fieldElement.setAttribute('required', 'required'); // Make field mandatory
    //         });

    //         // Hide company fields and remove mandatory requirements
    //         companyFields.forEach(function (fieldId) {
    //             const fieldElement = document.getElementById(fieldId);
    //             fieldElement.parentElement.style.display = 'none';
    //             fieldElement.removeAttribute('required'); // Remove mandatory requirement
    //             fieldElement.value = ''; // Clear any existing values
    //         });
    //     } else if (selectedSellerType === 'Dealership') {
    //         // Show company fields and make them mandatory
    //         companyFields.forEach(function (fieldId) {
    //             const fieldElement = document.getElementById(fieldId);
    //             fieldElement.parentElement.style.display = 'block';
    //             fieldElement.setAttribute('required', 'required'); // Make field mandatory
    //         });

    //         // Hide seller fields and remove mandatory requirements
    //         sellerFields.forEach(function (fieldId) {
    //             const fieldElement = document.getElementById(fieldId);
    //             fieldElement.parentElement.style.display = 'none';
    //             fieldElement.removeAttribute('required'); // Remove mandatory requirement
    //             fieldElement.value = ''; // Clear any existing values
    //         });
    //     } else {
    //         // Hide all fields if no selection is made
    //         sellerFields.concat(companyFields).forEach(function (fieldId) {
    //             const fieldElement = document.getElementById(fieldId);
    //             fieldElement.parentElement.style.display = 'none';
    //             fieldElement.removeAttribute('required');
    //             fieldElement.value = '';
    //         });
    //     }
    // }

    const sellerTypeSelect = document.getElementById('sellerType');
    const companySection = document.querySelector('.company-details');
    const sellerFields = ['firstName', 'lastName', 'sellerEmail', 'sellerPhone', 'sellerAddress', 'sellerCity', 'sellerProvince', 'postalCode'];
    const companyFieldsToClear = ['companyName', 'companyPhone', 'companyEmail', 'companyAddress', 'companyCity', 'companyProvince', 'companyPostalCode'];
    const companyFields = [
        document.getElementById("companyName"),
        document.getElementById("companyPhone"),
        document.getElementById("companyEmail"),
        document.getElementById("companyAddress"),
        document.getElementById("companyCity"),
        document.getElementById("companyProvince"),
        document.getElementById("companyPostalCode")
    ];

    // Function to toggle company section visibility and rename fields
    function handleSellerTypeChange() {
        const selectedSellerType = sellerTypeSelect.value;

        if (selectedSellerType === 'Private_Seller') {
            companySection.style.display = 'none'; // Hide Company Details
            renameFields('Seller'); // Rename fields back to 'Seller'
            ///////////////////
            markRequiredFields(companyFields, false); // Unmark company fields as required
            clearFormFields(companyFields);

        } else if (selectedSellerType === 'Dealership') {
            companySection.style.display = 'block'; // Show Company Details
            renameFields('Contact'); // Rename fields to 'Contact'
            markRequiredFields(companyFields, true); // Mark company fields as required
        } else {
            companySection.style.display = 'none'; // Hide Company Details if no valid type
        }

        //////////
        mandFieldList();
    }

    // Function to rename seller fields
    function renameFields(newPrefix) {
        sellerFields.forEach(fieldId => {
            const label = document.querySelector(`label[for=${fieldId}]`); // Correctly use template literals
            if (label) {
                // Replace 'Seller' with the new prefix
                label.textContent = label.textContent.replace(/Seller|Contact/, newPrefix);
            }
        });
    }

    // Function to clear company fields
    function clearFormFields(fields) {
        fields.forEach(field => {
            field.value = ""; // Clear field value
        });
    }

    // Function to mark fields as required
    function markRequiredFields(fields, required) {
        fields.forEach(field => {
            if (required) {
                field.setAttribute("required", "required");
            } else {
                field.removeAttribute("required");
            }
        });
    }

    function mandFieldList() {
        const seller_Selected = document.getElementById('sellerType').value;
        if (seller_Selected === 'Private_Seller' || seller_Selected === '') {

            mandatoryFields = sellerFields;
        }
        else if (seller_Selected === 'Dealership') {

            mandatoryFields = sellerFields.concat(companyFieldsToClear);
        }
    }

    // Validation function
    function validateFields() {
        mandFieldList()
        let isValid = true;
        mandatoryFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                field.style.borderColor = 'red'; // Highlight invalid field
                isValid = false;
            } else {
                field.style.borderColor = ''; // Reset border color
            }
        });
        return isValid;
    }

    // Initialize the embedded app
    ZOHO.embeddedApp.init();

    // // Attach event listener for when the seller type is changed
    // sellerType.addEventListener('change', toggleFieldsBasedOnSellerType);

    // // Run the function once on page load in case there's already a selection
    // toggleFieldsBasedOnSellerType();

    // Add event listener for changes in the seller type select
    sellerTypeSelect.addEventListener('change', handleSellerTypeChange);

    // Initialize on page load
    handleSellerTypeChange(); // Call this function to set the initial state

    // Function to create loading overlay
    function createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent background
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '9999'; // Ensure it's on top of everything

        const loadingElement = document.createElement('div');
        loadingElement.innerText = 'Creating Seller...';
        loadingElement.style.color = 'white';
        loadingElement.style.fontWeight = 'bold';
        loadingElement.style.fontSize = '20px';

        overlay.appendChild(loadingElement);
        document.body.appendChild(overlay);
    }

    // Function to remove loading overlay
    function removeLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }

    // Create Seller
    function FinalclearFormFields() {
        //document.getElementById('sellerType').value = '';
        sellerFields.concat(companyFieldsToClear).forEach(fieldId => {
            document.getElementById(fieldId).value = '';
        });
    }

    document.getElementById('create-button').onclick = function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Validate form fields
        if (!validateFields()) {
            alert('Please fill out all required fields.');
            return; // Stop execution if validation fails
        }

        // Perform validations
        const sellerPhone = document.getElementById('sellerPhone').value.trim();
        const companyPhone = document.getElementById('companyPhone').value.trim();
        const postalCode = document.getElementById('postalCode').value.trim();
        const companyPostalCode = document.getElementById('companyPostalCode').value.trim();
        const sellerEmail = document.getElementById('sellerEmail').value.trim();
        const companyEmail = document.getElementById('companyEmail').value.trim();

        // Phone number regex (allows optional country code and 10-digit numbers)
        const phoneRegex = /^[+]?(\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

        // Postal code regex (Canadian postal codes in A1A 1A1 format)
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

        // Email regex (basic validation)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Validation checks
        if (!phoneRegex.test(sellerPhone) && sellerType.value === 'Private_Seller') {
            alert("Invalid seller phone number. Please enter a valid phone number.");
            return;
        }

        if (!phoneRegex.test(companyPhone) && sellerType.value === 'Dealership') {
            alert("Invalid company phone number. Please enter a valid phone number.");
            return;
        }

        if (!postalCodeRegex.test(postalCode) && sellerType.value === 'Private_Seller') {
            alert("Invalid seller postal code. Please enter a valid Canadian postal code (e.g., A1A 1A1).");
            return;
        }

        if (!postalCodeRegex.test(companyPostalCode) && sellerType.value === 'Dealership') {
            alert("Invalid company postal code. Please enter a valid Canadian postal code (e.g., A1A 1A1).");
            return;
        }

        if (!emailRegex.test(sellerEmail) && sellerType.value === 'Private_Seller') {
            alert("Invalid seller email address. Please enter a valid email.");
            return;
        }

        if (!emailRegex.test(companyEmail) && sellerType.value === 'Dealership') {
            alert("Invalid company email address. Please enter a valid email.");
            return;
        }

        createLoadingOverlay();

        const func_name = "CreateSeller";
        const req_data = {
            "arguments": JSON.stringify({
                "workSheetId": recId,
                "seller_Type": document.getElementById('sellerType').value.trim() || '',
                "Seller_FN": document.getElementById('firstName').value.trim() || '',
                "Seller_LN": document.getElementById('lastName').value.trim() || '',
                "Seller_Email": sellerEmail,
                "Seller_Phone": sellerPhone,
                "Seller_Address": document.getElementById('sellerAddress').value.trim() || '',
                "Seller_City": document.getElementById('sellerCity').value.trim() || '',
                "Seller_Pro": document.getElementById('sellerProvince').value.trim() || '',
                "Seller_Post": postalCode,
                "company_Name": document.getElementById('companyName').value.trim() || '',
                "company_Email": companyEmail,
                "company_Phn": companyPhone,
                "company_Add": document.getElementById('companyAddress').value.trim() || '',
                "company_City": document.getElementById('companyCity').value.trim() || '',
                "company_Province": document.getElementById('companyProvince').value.trim() || '',
                "company_Post": companyPostalCode
            })
        };

        console.log('Request Data: ', req_data); // Log the request data

        ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
            .then(function (data) {
                removeLoadingOverlay();
                console.log('data CreateSeller: ', data);
                if (data && data.details && data.details.output === 'Success') {
                    alert('Seller created successfully!');
                    FinalclearFormFields(); // Clear fields after successful creation
                    //////////////////////
                    ZOHO.CRM.BLUEPRINT.proceed()
                        .then(function (response) {
                            console.log('Blueprint proceeded:', response);
                        })
                        .catch(function (error) {
                            console.error('Error proceeding with blueprint:', error);
                        });
                    /////////////////////
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(function (error) {
                removeLoadingOverlay();
                console.error('Error executing function:', error);
                alert('An error occurred while creating the seller. Please try again.');
            });
    };

    // Proceed button handler (blueprint transition)
    document.getElementById('done-button').onclick = function () {
        ZOHO.CRM.BLUEPRINT.proceed()
            .then(function (response) {
                console.log('Blueprint proceeded:', response);
            })
            .catch(function (error) {
                console.error('Error proceeding with blueprint:', error);
            });
    };

    // Cancel button handler (close popup)
    document.getElementById('cancel-button').onclick = function () {
        ZOHO.CRM.UI.Popup.close()
            .then(function (data) {
                console.log('Popup closed:', data);
            })
            .catch(function (error) {
                console.error('Error closing popup:', error);
            });
    };

};