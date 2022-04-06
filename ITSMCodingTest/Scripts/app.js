// Initialize these variables which will be used globally throughout the application
var addressBookRecords = [];
var countryList = [];
var currentRecord = null;


// Generic Functions

$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

function showLoading() {
    $(".loading-overlay-panel").show();
}

function hideLoading() {
    $(".loading-overlay-panel").hide();
}

function xhrErrorMessage(jqXhr) {
    if (jqXhr.responseText !== undefined) {
        var errMessage = $(jqXhr.responseText)[1].innerText;
        if (errMessage !== null && errMessage !== undefined) {
            return errMessage;
        }
    }
    return "An Internal Server Error Occurred.";
}

function sortRecords() {
    addressBookRecords.sort(function(a, b) {
        var aLastChar = a.lastName.charAt(0);
        var bLastChar = b.lastName.charAt(0);
        if (aLastChar > bLastChar) {
            return 1;
        } else if (aLastChar < bLastChar) {
            return -1;
        } else {
            var aFirstChar = a.firstName.charAt(0);
            var bFirstChar = b.firstName.charAt(0);
            if (aFirstChar > bFirstChar) {
                return 1;
            } else if (aFirstChar < bFirstChar) {
                return -1;
            } else {
                return 0;
            }
        }
    });
}

// Interactive Functions

// Initializes the Address Book by loading the records and country dropdown.
function initAddressBook() {
    // Load all of the Entries and display them
    // This ajax call is provided to you as a base for how your other calls need to be structured    
    $.ajax({
        url: "Home/GetAllEntries",
        type: "GET",
        dataType: "json"
    }).done(function (data) {
        if (data.result) {
            addressBookRecords = data.resultSet;
            sortRecords();
            displayRecords();
            return;
        }
        toastr.error(data.error, "Failed to get Load Records");
    }).fail(function(xhr) {
        toastr.error(xhrErrorMessage(xhr), "Failed to Load Records");
    });

    // Initialize the Country Selector by retriving via the GetCountries action and populating the dropdown and variable
    // << YOUR CODE HERE >>
    $.ajax({
        url: "Home/GetCountries",
        type: "GET",
        dataType: "json"
    }).done(function (data) {
        if (data.result) {
            countryList = data.resultSet;
            $.each(countryList, function (index, value) {
                // APPEND OR INSERT DATA TO SELECT ELEMENT.
                $('#selectCountry').append('<option value="' + value.name + '">' + value.name + '</option>');
            });
            return;
        }
        toastr.error(data.error, "Failed to get Countries");
    }).fail(function (xhr) {
        toastr.error(xhrErrorMessage(xhr), "Failed to Countries");
    });
}

// Displays the address book records, with an optional parameter to pre-select an ID of a record
function displayRecords(preselectId) {
    // << YOUR CODE HERE >>
    $(".address-book-entries").empty();
    $.each(addressBookRecords, function (index, value) {
        if (index == 0 && !preselectId) {
            preselectId = value.id;
        }
        $(".address-book-entries").append('<a id="left' + value.id + '" class="address-book-record" href="javascript:selectRecord(' + value.id +');"><div class="row  align-items-center"><div class= "col-3" ><img src="~/Content/Images/blankuser.png" onerror="this.src = \'Content/Images/blankuser.png\';" class="record-photo rounded-circle" id="recordPhoto"/></div ><div class= "col-9 text-left" ><h5>' + value.lastName+", " + value.firstName + '</h5></div ></div ></a>');
    });
    selectRecord(preselectId);
}

// Adds a new entry with the First and Last name of "New"
function addNewEntry() {
    // << YOUR CODE HERE >> 
    showLoading();
    $.ajax({
        url: "Home/AddEntry",
        type: "POST"
    }).done(function (data) {
        if (data.recordId) {
            currentRecord = {};
            currentRecord.id = data.recordId;
            $("#inputFirstName").val("New");
            $("#inputLastName").val("New");
            hideLoading();
            refreshAllRecords(data.recordId);
            return;
        }
        toastr.error(data.error, "Failed to get Countries");
        hideLoading();
    }).fail(function (xhr) {
        toastr.error(xhrErrorMessage(xhr), "Failed to Countries");
        hideLoading();
    });
    
}

/**
 * Function to refresh All Records with a selected record id Added by Peng
 * @param {any} selectedId
 */
function refreshAllRecords(selectedId) {
    $.ajax({
        url: "Home/GetAllEntries",
        type: "GET",
        dataType: "json"
    }).done(function (data) {
        if (data.result) {
            addressBookRecords = data.resultSet;
            sortRecords();
            displayRecords(selectedId);
            return;
        }
        toastr.error(data.error, "Failed to get Load Records");
    }).fail(function (xhr) {
        toastr.error(xhrErrorMessage(xhr), "Failed to Load Records");
    });
}

/**
 * Get Current Record by Record Id
 * @param {any} selectedId
 */
function getCurrentRecordById(recordId) {
    if (recordId) {
        currentRecord = addressBookRecords.find(function (item) { return item.id == recordId; });
    } else {
        currentRecord = null;
    }
}

// Selects a record based on the element in the list or a record ID number
function selectRecord(record) {
    let recordId = 0;
    // Check if the record is a number or if it's our <a> element that contains the record data, and get the ID accordingly
    // << YOUR CODE HERE >>
    if (typeof record == 'number') {
        recordId = record;
    }
    // Hide all fields, as we're only going to show them if they have data
    // << YOUR CODE HERE >>
    $("#displayAddressColumn").hide();
    $("#displayContactColumn").hide();
    $("#displayAddress").hide();
    $("#displayPhoneItem").hide();
    $("#displayEmailItem").hide();
    $("#displayPhone").hide();
    $("#displayEmail").hide();
    // Once we've gotten the record from the addressBookRecords, display the content on the front end and enable the Edit button
    // << YOUR CODE HERE >>
    if (addressBookRecords && addressBookRecords.length > 0 && recordId > 0) {
        $(".address-book-record").removeClass("active");
        $("#left" + recordId).addClass("active");
        getCurrentRecordById(recordId);

        $("#displayName").html(currentRecord.firstName + " " + currentRecord.lastName);

        let addressHtml = currentRecord.address ? currentRecord.address + "<br/>" : "";
        addressHtml += currentRecord.addressLine2 ? currentRecord.addressLine2 + "<br/>" : "";
        addressHtml += currentRecord.city ? currentRecord.city : "";
        addressHtml += currentRecord.provinceState ? ", " + currentRecord.provinceState + "<br/>" : "";
        addressHtml += currentRecord.postalZip ? currentRecord.postalZip + "<br/>" : "";
        addressHtml += currentRecord.country ? currentRecord.country : "";
        $("#displayAddress").html(addressHtml);

        $("#displayPhone").text(currentRecord.phoneNumber);
        $("#displayEmail").text(currentRecord.emailAddress);

        $("#editButton").prop('disabled', false);
    }
    // Show all columns/items that have data
    // << YOUR CODE HERE >>
    if ($("#displayAddress").html().length > 0) {
        $("#displayAddressColumn").show();
        $("#displayAddress").show();
    }

    if ($("#displayPhone").text().length > 0) {
        $("#displayPhone").show();
        $("#displayPhoneItem").show();
        $("#displayContactColumn").show();
    }

    if ($("#displayEmail").text().length > 0) {
        $("#displayEmail").show();
        $("#displayEmailItem").show();
        $("#displayContactColumn").show();
    }
    // Display the panel
    // << YOUR CODE HERE >>
    $("#readOnlyDisplay").show();
    $("#editableDisplay").hide();
}

// Edits a record when pressing the 'Edit' button or triggered after creating a new entry
function editRecord(recordId) {
    // Set the currentRecord from the addressBookRecords
    // << YOUR CODE HERE >>
    getCurrentRecordById(recordId);

    // Populate the editable fields
    // << YOUR CODE HERE >>
    if (currentRecord) {
        $("#inputFirstName").val(currentRecord.firstName);
        $("#inputLastName").val(currentRecord.lastName);
        $("#inputAddress").val(currentRecord.address);
        $("#inputAddressLine2").val(currentRecord.addressLine2);
        $("#inputCity").val(currentRecord.city);
        $("#inputProvinceState").val(currentRecord.provinceState);
        $("#selectCountry").val(currentRecord.country);
        $("#inputPhoneNumber").val(currentRecord.phoneNumber);
        $("#inputEmailAddress").val(currentRecord.emailAddress);
    // Show the panel and disable the Edit button
    // << YOUR CODE HERE >>
        $("#editableDisplay").show();
        $("#readOnlyDisplay").hide();
        $("#editButton").prop('disabled', true);
    }    
}

// Saves the current editing entry
function saveEntry() {
    // Validate all entries which contain the "data-required" attribute
    // If validation fails, display an error message and an indicator on the fields
    // << YOUR CODE HERE >>
    let validateFlag = true;
    showLoading();
    $.each($("#editableDisplay input"), function (index, value) {
        let attr = $(this).attr('data-required');

        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof attr !== 'undefined' && attr !== false) {
            // ...            
            if ($(this).val() == null || $(this).val() == "") {
                toastr.error($("label[for*='" + $(this).attr("id") + "']").text().replace(":", "") + " is required");
                $(this).css("border-color", "red");
                validateFlag = false;
            } else {
                $(this).css("border-color", "#ced4da");
            }
        }
    });

    if (validateFlag) {
    // Update the currentRecord with the data entered in
    // << YOUR CODE HERE >>
        currentRecord.firstName = $("#inputFirstName").val();
        currentRecord.lastName = $("#inputLastName").val();
        currentRecord.address = $("#inputAddress").val();
        currentRecord.addressLine2 = $("#inputAddressLine2").val();
        currentRecord.city = $("#inputCity").val();
        currentRecord.provinceState = $("#inputProvinceState").val();
        currentRecord.postalZip = $("#inputPostalZip").val();
        currentRecord.country = $("#selectCountry").val();
        currentRecord.phoneNumber = $("#inputPhoneNumber").val();
        currentRecord.emailAddress = $("#inputEmailAddress").val();

    // Create a $formData object, attach the photo if necessary, and include the currentRecord as part of the payload
    // << YOUR CODE HERE >>
        let formData  = new FormData();
        $.each(jQuery('#photoUpload')[0].files, function (i, file) {
            formData.append('file-' + i, file);
        });
        formData.set("id", currentRecord.id);
        formData.set("firstName", currentRecord.firstName);
        formData.set("lastName", currentRecord.lastName);
        formData.set("address", currentRecord.address);
        formData.set("addressLine2", currentRecord.addressLine2);
        formData.set("city", currentRecord.city);
        formData.set("provinceState", currentRecord.provinceState);
        formData.set("postalZip", currentRecord.postalZip);
        formData.set("country", currentRecord.country);
        formData.set("phoneNumber", currentRecord.phoneNumber);
        formData.set("emailAddress", currentRecord.emailAddress);

    // Save the record, re-sort and display if successful
    // << YOUR CODE HERE >>
        $.ajax({
            url: "Home/SaveEntry",
            type: "POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
        }).done(function (data) {
            if (data.result) {
                refreshAllRecords(currentRecord.id);
                hideLoading();
                return;
            }
            toastr.error(data.error, "Failed to Save Record");
            hideLoading();
        }).fail(function (xhr) {
            toastr.error(xhrErrorMessage(xhr), "Failed to Save Record");
            hideLoading();
        });
    }
    
}

// Deletes the current editing entry
function deleteEntry() {
    // Delete via the DeleteEntry action in the controller.
    // On successful deletion, remove the record from the addressBookRecords array and update the display
    // << YOUR CODE HERE >>
    if (currentRecord) {
        showLoading();
        $.ajax({
            url: "Home/DeleteEntry",
            type: "POST",
            dataType: "json",
            data: {
                recordId: currentRecord.id
            }
        }).done(function (data) {
            if (data.result) {
                hideLoading();
                refreshAllRecords();
                return;
            }
            toastr.error(data.error, "Failed to Delete Record");
            hideLoading();
        }).fail(function (xhr) {
            toastr.error(xhrErrorMessage(xhr), "Failed to Delete Record");
            hideLoading();
        });
    }
    
}