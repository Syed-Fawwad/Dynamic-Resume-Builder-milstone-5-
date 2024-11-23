document.addEventListener("DOMContentLoaded", function () {
    setupSubmitButton();
    setupRepeaterButtons();
    enableEditing(); // Enable editable sections
    setupShareResume("username123"); // Example username for URL generation
    setupDownloadPDF();
});
function setupSubmitButton() {
    var submitButton = document.querySelector(".submit-button");
    submitButton === null || submitButton === void 0 ? void 0 : submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Generate button clicked");
        var formData = collectFormData();
        console.log("Form Data Collected:", formData);
        displayResumeData(formData);
    });
}
function setupRepeaterButtons() {
    document.querySelectorAll(".repeater-add-btn").forEach(function (addButton) {
        addButton.addEventListener("click", function () {
            var _a, _b;
            var repeaterList = (_a = addButton.closest(".repeater")) === null || _a === void 0 ? void 0 : _a.querySelector('[data-repeater-list]');
            if (repeaterList) {
                var item = (_b = repeaterList.firstElementChild) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
                if (item) {
                    item.querySelectorAll("input").forEach(function (input) { return (input.value = ""); });
                    repeaterList.appendChild(item);
                    setupRemoveButtons(); // Activate remove button for new items
                }
            }
        });
    });
    setupRemoveButtons();
}
function setupRemoveButtons() {
    document.querySelectorAll(".repeater-remove-btn").forEach(function (removeButton) {
        removeButton.addEventListener("click", function () {
            var _a;
            var item = removeButton.closest("[data-repeater-item]");
            (_a = item === null || item === void 0 ? void 0 : item.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(item);
        });
    });
}
function collectFormData() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var data = {};
    data.firstname = ((_a = document.querySelector(".firstname")) === null || _a === void 0 ? void 0 : _a.value) || '';
    data.middlename = ((_b = document.querySelector(".middlename")) === null || _b === void 0 ? void 0 : _b.value) || '';
    data.lastname = ((_c = document.querySelector(".lastname")) === null || _c === void 0 ? void 0 : _c.value) || '';
    data.designation = ((_d = document.querySelector(".designation")) === null || _d === void 0 ? void 0 : _d.value) || '';
    data.email = ((_e = document.querySelector(".email")) === null || _e === void 0 ? void 0 : _e.value) || '';
    data.phone = ((_f = document.querySelector(".phoneno")) === null || _f === void 0 ? void 0 : _f.value) || '';
    data.address = ((_g = document.querySelector(".address")) === null || _g === void 0 ? void 0 : _g.value) || '';
    data.summary = ((_h = document.querySelector(".summary")) === null || _h === void 0 ? void 0 : _h.value) || '';
    var imageInput = document.querySelector(".image");
    if ((_j = imageInput === null || imageInput === void 0 ? void 0 : imageInput.files) === null || _j === void 0 ? void 0 : _j[0]) {
        data.imageUrl = URL.createObjectURL(imageInput.files[0]);
    }
    data.achievements = collectRepeatedData(".achieve_title", ".achieve_description");
    data.experience = collectRepeatedData(".exp_title", ".exp_organization", ".exp_location", ".exp_start_date", ".exp_end_date", ".exp_description");
    data.education = collectRepeatedData(".edu_school", ".edu_degree", ".edu_city", ".edu_start_date", ".edu_graduation_date", ".edu_description");
    data.projects = collectRepeatedData(".proj_title", ".proj_link", ".proj_description");
    // Replacing Array.from with an alternate approach
    var skills = document.querySelectorAll(".skill");
    data.skills = [];
    for (var i = 0; i < skills.length; i++) {
        data.skills.push(skills[i].value || '');
    }
    return data;
}
function collectRepeatedData() {
    var selectors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        selectors[_i] = arguments[_i];
    }
    var dataItems = [];
    var elements = document.querySelectorAll(selectors[0]);
    elements.forEach(function (_, index) {
        var item = {};
        selectors.forEach(function (selector) {
            var _a;
            item[selector.slice(1)] = ((_a = document.querySelectorAll(selector)[index]) === null || _a === void 0 ? void 0 : _a.value) || '';
        });
        dataItems.push(item);
    });
    return dataItems;
}
function displayResumeData(data) {
    document.getElementById("fullname_dsp").textContent = " ".concat(data.firstname, " ").concat(data.middlename, " ").concat(data.lastname);
    document.getElementById("designation_dsp").textContent = data.designation;
    document.getElementById("email_dsp").textContent = data.email;
    document.getElementById("phoneno_dsp").textContent = data.phone;
    document.getElementById("address_dsp").textContent = data.address;
    document.getElementById("summary_dsp").textContent = data.summary;
    if (data.imageUrl) {
        document.getElementById("image_dsp").src = data.imageUrl;
    }
    displayRepeatedData("achievements_dsp", data.achievements, ["achieve_title", "achieve_description"]);
    displayRepeatedData("experiences_dsp", data.experience, ["exp_title", "exp_organization", "exp_location", "exp_start_date", "exp_end_date", "exp_description"]);
    displayRepeatedData("educations_dsp", data.education, ["edu_school", "edu_degree", "edu_city", "edu_start_date", "edu_graduation_date", "edu_description"]);
    displayRepeatedData("projects_dsp", data.projects, ["proj_title", "proj_link", "proj_description"]);
    var skillsDisplay = document.getElementById("skills_dsp");
    skillsDisplay.innerHTML = data.skills.map(function (skill) { return " <div>".concat(skill, "</div>"); }).join('');
}
function displayRepeatedData(elementId, dataArray, fields) {
    var container = document.getElementById(elementId);
    container.innerHTML = dataArray.map(function (item) {
        return "<div>".concat(fields.map(function (field) { return item[field] ? " <p>".concat(item[field], "</p>") : ''; }).join(''), "</div>");
    }).join('');
}
// Editable Sections
function enableEditing() {
    var editableFields = document.querySelectorAll("[data-editable]");
    editableFields.forEach(function (field) {
        field.addEventListener("click", function () {
            var currentValue = field.textContent;
            var input = document.createElement("input");
            input.type = "text";
            input.value = currentValue || "";
            field.replaceWith(input);
            input.focus();
            input.addEventListener("blur", function () {
                var updatedValue = input.value;
                var span = document.createElement("span");
                span.textContent = updatedValue;
                span.setAttribute("data-editable", "");
                input.replaceWith(span);
                enableEditing(); // Rebind click event
            });
        });
    });
}
// Unique URL Generation
function generateUniqueURL(username) {
    return " ".concat(username, ".vercel.app/resume");
}
// Share Resume
function setupShareResume(username) {
    var shareButton = document.querySelector(".share-button");
    if (shareButton) {
        shareButton.addEventListener("click", function () {
            var uniqueURL = generateUniqueURL(username);
            navigator.clipboard.writeText(uniqueURL).then(function () {
                alert("Resume link copied to clipboard: " + uniqueURL);
            });
        });
    }
}
// Download Resume as PDF
function setupDownloadPDF() {
    var downloadButton = document.querySelector(".download-button");
    downloadButton === null || downloadButton === void 0 ? void 0 : downloadButton.addEventListener("click", function () {
        window.print(); // PDF Download through browser print
    });
}
