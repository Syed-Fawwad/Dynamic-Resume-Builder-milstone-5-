document.addEventListener("DOMContentLoaded", function () {
    setupSubmitButton();
    setupRepeaterButtons();
    enableEditing(); // Enable editable sections
    setupShareResume("username123"); // Example username for URL generation
    setupDownloadPDF();
});

function setupSubmitButton() {
    var submitButton = document.querySelector(".submit-button");
    submitButton?.addEventListener("click", function (event) {
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
            var repeaterList = addButton.closest(".repeater")?.querySelector('[data-repeater-list]');
            if (repeaterList) {
                var item = repeaterList.firstElementChild?.cloneNode(true);
                if (item) {
                    (item as HTMLElement).querySelectorAll("input").forEach(input => (input.value = ""));
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
            var item = removeButton.closest("[data-repeater-item]");
            item?.parentNode?.removeChild(item);
        });
    });
}

function collectFormData() {
    var data: any = {};
    data.firstname = (document.querySelector(".firstname") as HTMLInputElement)?.value || '';
    data.middlename = (document.querySelector(".middlename") as HTMLInputElement)?.value || '';
    data.lastname = (document.querySelector(".lastname") as HTMLInputElement)?.value || '';
    data.designation = (document.querySelector(".designation") as HTMLInputElement)?.value || '';
    data.email = (document.querySelector(".email") as HTMLInputElement)?.value || '';
    data.phone = (document.querySelector(".phoneno") as HTMLInputElement)?.value || '';
    data.address = (document.querySelector(".address") as HTMLInputElement)?.value || '';
    data.summary = (document.querySelector(".summary") as HTMLInputElement)?.value || '';
    var imageInput = document.querySelector(".image") as HTMLInputElement;
    if (imageInput?.files?.[0]) {
        data.imageUrl = URL.createObjectURL(imageInput.files[0]);
    }
    data.achievements = collectRepeatedData(".achieve_title", ".achieve_description");
    data.experience = collectRepeatedData(".exp_title", ".exp_organization", ".exp_location", ".exp_start_date", ".exp_end_date", ".exp_description");
    data.education = collectRepeatedData(".edu_school", ".edu_degree", ".edu_city", ".edu_start_date", ".edu_graduation_date", ".edu_description");
    data.projects = collectRepeatedData(".proj_title", ".proj_link", ".proj_description");

    // Replacing Array.from with an alternate approach
    const skills = document.querySelectorAll(".skill");
    data.skills = [];
    for (let i = 0; i < skills.length; i++) {
        data.skills.push((skills[i] as HTMLInputElement).value || '');
    }

    return data;
}

function collectRepeatedData(...selectors: string[]) {
    var dataItems: any[] = [];
    var elements = document.querySelectorAll(selectors[0]);
    elements.forEach((_, index) => {
        var item: any = {};
        selectors.forEach(selector => {
            item[selector.slice(1)] = (document.querySelectorAll(selector)[index] as HTMLInputElement)?.value || '';
        });
        dataItems.push(item);
    });
    return dataItems;
}

function displayResumeData(data: any) {
    document.getElementById("fullname_dsp")!.textContent =` ${data.firstname} ${data.middlename} ${data.lastname}`;
    document.getElementById("designation_dsp")!.textContent = data.designation;
    document.getElementById("email_dsp")!.textContent = data.email;
    document.getElementById("phoneno_dsp")!.textContent = data.phone;
    document.getElementById("address_dsp")!.textContent = data.address;
    document.getElementById("summary_dsp")!.textContent = data.summary;
    if (data.imageUrl) {
        (document.getElementById("image_dsp") as HTMLImageElement).src = data.imageUrl;
    }
    displayRepeatedData("achievements_dsp", data.achievements, ["achieve_title", "achieve_description"]);
    displayRepeatedData("experiences_dsp", data.experience, ["exp_title", "exp_organization", "exp_location", "exp_start_date", "exp_end_date", "exp_description"]);
    displayRepeatedData("educations_dsp", data.education, ["edu_school", "edu_degree", "edu_city", "edu_start_date", "edu_graduation_date", "edu_description"]);
    displayRepeatedData("projects_dsp", data.projects, ["proj_title", "proj_link", "proj_description"]);
    var skillsDisplay = document.getElementById("skills_dsp")!;
    skillsDisplay.innerHTML = data.skills.map(skill =>` <div>${skill}</div>`).join('');
}

function displayRepeatedData(elementId: string, dataArray: any[], fields: string[]) {
    var container = document.getElementById(elementId)!;
    container.innerHTML = dataArray.map(item => {
        return `<div>${fields.map(field => item[field] ?` <p>${item[field]}</p>` : '').join('')}</div>`;
    }).join('');
}

// Editable Sections
function enableEditing() {
    const editableFields = document.querySelectorAll("[data-editable]");
    editableFields.forEach((field) => {
        field.addEventListener("click", function () {
            const currentValue = field.textContent;
            const input = document.createElement("input");
            input.type = "text";
            input.value = currentValue || "";
            field.replaceWith(input);
            input.focus();

            input.addEventListener("blur", function () {
                const updatedValue = input.value;
                const span = document.createElement("span");
                span.textContent = updatedValue;
                span.setAttribute("data-editable", "");
                input.replaceWith(span);
                enableEditing(); // Rebind click event
            });
        });
    });
}

// Unique URL Generation
function generateUniqueURL(username: string): string {
    return` ${username}.vercel.app/resume`;
}

// Share Resume
function setupShareResume(username: string) {
    const shareButton = document.querySelector(".share-button");
    if (shareButton) {
        shareButton.addEventListener("click", () => {
            const uniqueURL = generateUniqueURL(username);
            navigator.clipboard.writeText(uniqueURL).then(() => {
                alert("Resume link copied to clipboard: " + uniqueURL);
            });
        });
    }
}

// Download Resume as PDF
function setupDownloadPDF() {
    const downloadButton = document.querySelector(".download-button");
    downloadButton?.addEventListener("click", function () {
        window.print(); // PDF Download through browser print
    });
}