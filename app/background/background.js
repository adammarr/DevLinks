var messages = {
	getSettings: getSettings,
	setSettings: setSettings,
	loadFile: loadFile
}

var defaults = {
		general: JSON.stringify({
			omnibox: true,
			bookmarks: false,
			debugging: false
		}),
		configurations: JSON.stringify([])
	},
	options;

////////////////////////

function getSettings(request, sender, sendResponse) {
	console.log(arguments);
	//dev stuff will often vary by machine, and some config files may exceed the
	//sync quota, so lets only store locally unless they request sync
	chrome.storage.local.get(defaults, function(response) {
		console.log(response);
		options = {
			general: JSON.parse(response.general),
			configurations: JSON.parse(response.configurations)
		};
		console.log(options);
		sendResponse(options);
	});
}

function setSettings(request, sender, sendResponse) {
	console.log(arguments);
	chrome.storage.local.set({
		general: JSON.stringify(request.options.general),
		configurations: JSON.stringify(request.options.configurations)
	}, function() {
		console.log(arguments);
		options = request.options;
		sendResponse();
	});
}

function loadFile(request, sender, sendResponse) {
	console.log(request);
	for (var i in request.files) {
		console.log(i + ' : ' + request.files[i].type, request.files[i]);
	}
	sendResponse();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(arguments);
	if(typeof messages[request.type] === 'function') {
		console.log(messages[request.type]);
		messages[request.type].call(this, request, sender, sendResponse);
	} else {
		sendResponse({ errors: 'Invalid Request Type' });
	}
	return true;
});