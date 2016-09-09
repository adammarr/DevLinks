var defaults = {
		general: JSON.stringify({
			omnibox: true,
			bookmarks: false,
			debugging: false
		}),
		configurations: JSON.stringify([])
	},
	general, configurations;

function log(text) {
	var node = document.createElement('p');
	node.innerText = text; 
	document.getElementById('log').appendChild(node);
}

function setOptions(options) {
	var i;
	general = (options.general) ? JSON.parse(options.general) : JSON.parse(defaults.general);
	configurations = (options.configurations) ? JSON.parse(options.configurations) : JSON.parse(defaults.configurations);

	for(i in general) {
		document.getElementById(i).checked = general[i];
	}
}

function saveSettings() {
	document.querySelectorAll('#general input[type="checkbox"]').forEach(function(el) {
		general[el.id] = el.checked || false;
		log(el.id + ' ' + el.checked);
	});

	chrome.storage.local.set({
		general: JSON.stringify(general),
		configurations: JSON.stringify(configurations)
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('save-status');
		status.textContent = 'Options Saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 1500);
	});
}

function setEvents() {
	document.getElementById('apply').addEventListener('click', saveSettings);
}

function runPage() {
	//dev stuff will often vary by machine, and some config files may exceed the
	//sync quota, so lets only store locally
	chrome.storage.local.get(defaults, setOptions);
	setEvents();
}

document.addEventListener('DOMContentLoaded', runPage);