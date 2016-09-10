var options = {}, fileInput, urlContainer, loadCancel;

function log(text) {
	var node = document.createElement('p');
	node.innerText = text; 
	document.getElementById('log').appendChild(node);
}

function setOptions(options) {
	log(JSON.stringify(options));
	var i;
	options = options;
	for(i in options.general) {
		document.getElementById(i).checked = options.general[i];
	}
}

function saveSettings() {
	document.querySelectorAll('#general input[type="checkbox"]').forEach(function(el) {
		options.general[el.id] = el.checked || false;
		log(el.id + ' ' + el.checked);
	});

	options.configurations = [];

	chrome.runtime.sendMessage({ type: 'setSettings', options: options }, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('save-status');
		status.textContent = 'Options Saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 1500);
	});
}

function showFile() {
	fileInput.className = '';
	urlContainer.className = 'hide';
	loadCancel.className = '';
}

function showURL() {
	fileInput.className = 'hide';
	urlContainer.className = '';
	loadCancel.className = '';
}

function hideSelect() {
	fileInput.className = 'hide';
	urlContainer.className = 'hide';
	loadCancel.className = 'hide';
}

function fileResponse(response) {

}

function fileSelect(evt) {
	log(evt.target); log(evt.target.files); log(evt.target.files.length);
	var files = evt.target.files;
	log(files[0].type);
	for (var i in files) {
		log(i + ' : ' + files[i]);
	}
	chrome.runtime.sendMessage({ type: 'loadFile', files: evt.target.files }, fileResponse);
}

function setEvents() {
	//buttons
	document.getElementById('apply').addEventListener('click', saveSettings);
	document.getElementById('load-file').addEventListener('click', showFile);
	document.getElementById('load-url').addEventListener('click', showURL);
	loadCancel.addEventListener('click', hideSelect);

	//inputs
	document.getElementById('file').addEventListener('change', fileSelect);
}

function setElements() {
	fileInput = document.getElementById('file');
	urlContainer = document.getElementById('url-container');
	loadCancel = document.getElementById('load-cancel');
}

function runPage() {
	chrome.runtime.sendMessage({ type: 'getSettings' }, setOptions);
	setElements();
	setEvents();
}

document.addEventListener('DOMContentLoaded', runPage);