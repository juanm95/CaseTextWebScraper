var timer;
var timeout = 7000
var caseNumber = 0
var caseData = {}
var firstTimer = false
    // https://casetext.com/search?q=329 U.S. 29
chrome.browserAction.onClicked.addListener(function (tab) {
    if (!firstTimer) {
        timer = setTimeout(resetTabs, timeout)
        firstTimer = true
    }
    var _case = cases[caseNumber]
    var caseID = _case.usCite
    caseData[caseID] = _case
    chrome.tabs.create({
        "url": "http://casetext.com/search?q=" + caseID
    })
    caseNumber += 1
});
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        clearInterval(timer)
        timer = setTimeout(resetTabs, timeout)
        console.log(request.usCite)
        caseData[request.usCite]["connections"] = request.connections
        var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
        xmlhttp.open("POST", "http://localhost:80");
        xmlhttp.send(JSON.stringify(caseData[request.usCite]));
        delete caseData[request.usCite]

        var _case = cases[caseNumber]
        var caseID = _case.usCite
        caseData[caseID] = _case
        chrome.tabs.update(sender.tab.id, {
            url: "http://casetext.com/search?q=" + cases[caseNumber].usCite
        });
        caseNumber += 1
    });

function resetTabs() {
    chrome.tabs.query({
        "url": "*://casetext.com/*"
    }, function (tabs) {
        timer = setTimeout(resetTabs, timeout)
        tabs.forEach(function (tab) {
            chrome.tabs.remove(tab.id)
            var _case = cases[caseNumber]
            var caseID = _case.usCite
            caseData[caseID] = _case
            chrome.tabs.create({
                "url": "http://casetext.com/search?q=" + caseID
            })
            caseNumber += 1
        })
    })
}