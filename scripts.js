$(document).ready(function() {
    // Function to load protocol content
    function loadProtocol(protocol) {
        $("#protocol-content").load(`protocols/${protocol}.html`, function(response, status, xhr) {
            if (status == "error") {
                $("#protocol-content").html("<p>Protocol not found.</p>");
            }
            // Collapse all sections initially
            $(".protocol-section ul").hide();

            // Toggle visibility on section header click
            $(".protocol-section h3").click(function() {
                $(this).next("ul").slideToggle();
            });
        });
    }

    // Load default protocol
    loadProtocol("ucsd-standard");

    // Change event for protocol select
    $("#protocol-select").change(function() {
        var protocol = $(this).val();
        loadProtocol(protocol);
    });
});
