// Initialize tabs
$(document).ready(function () {
    $("#tabs").tabs();
});


// Initialize sliders and link them with input fields
function initializeSlider(sliderId, inputId) {
    $(`#${sliderId}`).slider({
        min: -50,
        max: 50,
        value: 0,
        slide: function (event, ui) {
            $(`#${inputId}`).val(ui.value);
        }
    });

    // If text is input then change the slider as well
    $(`#${inputId}`).on("input", function () {
        var val = parseInt($(this).val());
        if (!isNaN(val) && val >= -50 && val <= 50) {
            $(`#${sliderId}`).slider("value", val);
        }
    });
}

// Initialize all sliders
initializeSlider("startMultiplierSlider", "startMultiplier");
initializeSlider("endMultiplierSlider", "endMultiplier");
initializeSlider("startMultiplicandSlider", "startMultiplicand");
initializeSlider("endMultiplicandSlider", "endMultiplicand");

// Form validation and submission
$("#inputForm").validate({
    // Ensure that all fields are numbers and provided and within the range -50 and 50
    rules: {
        startMultiplier: {
            required: true,
            number: true,
            range: [-50, 50]
        },
        endMultiplier: {
            required: true,
            number: true,
            range: [-50, 50]
        },
        startMultiplicand: {
            required: true,
            number: true,
            range: [-50, 50]
        },
        endMultiplicand: {
            required: true,
            number: true,
            range: [-50, 50]
        }
    },
    // Print these messages if the number isn't in range
    messages: {
        startMultiplier: {
            range: "Please enter a number between -50 and 50"
        },
        endMultiplier: {
            range: "Please enter a number between -50 and 50"
        },
        startMultiplicand: {
            range: "Please enter a number between -50 and 50"
        },
        endMultiplicand: {
            range: "Please enter a number between -50 and 50"
        }
    },
    // Error is under the element that causes the error
    errorPlacement: function (error, element) {
        error.insertAfter(element);
    },
    submitHandler: function (form) {
        var startMultiplier = parseInt($("#startMultiplier").val());
        var endMultiplier = parseInt($("#endMultiplier").val());
        var startMultiplicand = parseInt($("#startMultiplicand").val());
        var endMultiplicand = parseInt($("#endMultiplicand").val());

        // Swap the start and end multiplier/multiplicand if start is greater than end
        if (startMultiplier > endMultiplier) {
            var temp = startMultiplier;
            startMultiplier = endMultiplier;
            endMultiplier = temp;
        }
        if (startMultiplicand > endMultiplicand) {
            var temp = startMultiplicand;
            startMultiplicand = endMultiplicand;
            endMultiplicand = temp;
        }

        var tabId = `tab-${Date.now()}`;
        var tabLabel = `${startMultiplier} to ${endMultiplier} * ${startMultiplicand} to ${endMultiplicand}`;

        var $tabs = $("#tabs");
        var $ul = $tabs.find("ul");

        $tabs.append(`<div id="${tabId}" class="tab-content">${generateTable(startMultiplier, endMultiplier, startMultiplicand, endMultiplicand)}</div>`);
        $ul.append(`
            <li aria-controls="${tabId}">
                <input type="checkbox" class="tab-checkbox" data-tab-id="${tabId}">
                <a href="#${tabId}">${tabLabel}</a>
                <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span>
            </li>
        `);
        $tabs.tabs("refresh");

        var newIndex = $ul.children().length - 1;
        $tabs.tabs("option", "active", newIndex);
    }
});

// Tab removal functionality
$("#tabs").on("click", "span.ui-icon-close", function () {
    var panelId = $(this).closest("li").remove().attr("aria-controls");
    $("#" + panelId).remove();
    $("#tabs").tabs("refresh");
});

// Delete selected tabs functionality
$("#deleteSelected").click(function() {
    // If the tab is selected remove it
    $("input.tab-checkbox:checked").each(function() {
        var tabId = $(this).data("tab-id");
        $(`li[aria-controls="${tabId}"]`).remove();
        $(`#${tabId}`).remove();
    });
    $("#tabs").tabs("refresh");
    if ($("#tabs ul li").length === 1) {
        $("#deleteSelected").hide();
    }
});

// Function to generate multiplication table
function generateTable(startMult, endMult, startMulc, endMulc) {
    var table = "<table class='table table-bordered'><thead><tr><th></th>";
    for (var i = startMult; i <= endMult; i++) {
        table += `<th>${i}</th>`;
    }
    table += "</tr></thead><tbody>";

    for (var j = startMulc; j <= endMulc; j++) {
        table += `<tr><th>${j}</th>`;
        for (var i = startMult; i <= endMult; i++) {
            table += `<td>${i * j}</td>`;
        }
        table += "</tr>";
    }
    table += "</tbody></table>";
    return table;
}