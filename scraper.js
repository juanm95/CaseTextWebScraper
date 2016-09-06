var gotTheData = false

var supremeCourtRegex = /(\d+ U.S. \d+)|(\d+ U. S. \d+)/g;
var dateRegex = / \(\d+\)/;

var caseNumber = 0

function getTheData() {
    if (!gotTheData) {
        gotTheData = true
        var connections = new Set()
        var caseID = $('header ct-document-header ul li')[2].innerHTML

        $('section.opinion').each(function (index, listItem) {
            var theHTML = listItem.innerHTML
            var matches = theHTML.match(supremeCourtRegex)
            if (matches) {
                matches.forEach(function (connection) {
                    connections.add(connection.replace("U. S.", "U.S."))
                })
            }
        })

        chrome.runtime.sendMessage({
            connections: Array.from(connections)
            , usCite: caseID.replace(dateRegex, "").replace("U. S.", "U.S.")
        }, function (response) {
            
        });
    }
}

$("html").livequery('section.opinion', getTheData)
