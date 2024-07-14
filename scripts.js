$(document).ready(function() {
    if (typeof marked !== 'function') {
        console.error("marked.js is not loaded correctly.");
        return;
    }

    function loadProtocol(protocol) {
        $.get(`protocols/${protocol}.md`, function(data) {
            const html = marked(data);
            const iconHtml = html.replace(/:crosshair:/g, '<i class="fas fa-ruler-combined"></i>');
            $("#protocol-content").html(iconHtml);

            // Collapse all sections initially
            $(".protocol-section ul").hide();

            // Toggle visibility on section header click
            $(".protocol-section h3").click(function() {
                $(this).next("ul").slideToggle();
            });
        }).fail(function() {
            $("#protocol-content").html("<p>Protocol not found.</p>");
        });
    }

    // Load default protocol
    loadProtocol("ucsd-standard");

    // Change event for protocol select
    $("#protocol-select").change(function() {
        const protocol = $(this).val();
        loadProtocol(protocol);
    });
});
