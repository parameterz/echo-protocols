document.addEventListener("DOMContentLoaded", function() {
    console.log("Document is ready.");

    // Check if marked.js is loaded
    if (typeof marked === 'undefined') {
        console.error("marked.js is not loaded correctly.");
        return;
    } else {
        console.log("marked.js is loaded correctly.");
    }

    // Function to load and parse protocol Markdown or HTML file
    function loadProtocol(protocol) {
        fetch(`protocols/${protocol}.md`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.text();
            })
            .then(data => {
                let protocolContent = document.getElementById("protocol-content");

                // Parse Markdown and replace placeholders with Font Awesome icons
                let html = marked.parse(data);
                html = html.replace(/:crosshair:/g, '<i class="fas fa-crosshairs"></i>');
                html = html.replace(/:caliper:/g, '<i class="fas fa-ruler-combined"></i>');
                html = html.replace(/:meas:/g, '<i class="fas fa-ruler"></i>');
                protocolContent.innerHTML = html;

                // Collapse all direct UL or OL elements following H2 elements initially
                document.querySelectorAll("#protocol-content h2 + ul, #protocol-content h2 + ol").forEach(element => {
                    element.style.display = 'none';
                });

                // Toggle visibility on section header click
                document.querySelectorAll("#protocol-content h2").forEach(h2 => {
                    h2.addEventListener("click", function() {
                        let nextElement = this.nextElementSibling;
                        while (nextElement && nextElement.tagName !== 'H2') {
                            if (nextElement.tagName === 'UL' || nextElement.tagName === 'OL') {
                                if (nextElement.style.display === 'none') {
                                    nextElement.style.display = 'block';
                                } else {
                                    nextElement.style.display = 'none';
                                }
                            }
                            nextElement = nextElement.nextElementSibling;
                        }
                    });
                });

                // Execute embedded scripts
                protocolContent.querySelectorAll('script').forEach(script => {
                    const newScript = document.createElement('script');
                    newScript.textContent = script.textContent;
                    document.head.appendChild(newScript).parentNode.removeChild(newScript);
                });
            })
            .catch(error => {
                console.error("Error processing protocol: ", error);
                document.getElementById("protocol-content").innerHTML = "<p>There was an error processing the protocol.</p>";
            });
    }

    // Load default protocol if one is selected by default
    const defaultProtocol = document.getElementById("protocol-select").value;
    if (defaultProtocol) {
        loadProtocol(defaultProtocol);
    }

    // Change event for protocol select dropdown
    document.getElementById("protocol-select").addEventListener("change", function() {
        const protocol = this.value;
        if (protocol) {
            loadProtocol(protocol);
        } else {
            document.getElementById("protocol-content").innerHTML = "<p>Please select a protocol to view its content.</p>";
        }
    });
});

// calculate predicted LVOT diameter from the AS protocol page
function calculateLVOT() {
    const bsa = parseFloat(document.getElementById('bsa-lvot').value);
    const pred_lvot = (5.7 * bsa) + 12.1; //(5.7 × BSA) + 12.1
    document.getElementById('lvotResult').innerText = 'Predicted LVOT: ' + pred_lvot.toFixed(1) + ' mm';
}
