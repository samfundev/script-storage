//META{"name":"unshortenLinks"}*//

// USER SETTINGS //

var whitelistEnabled = true; // Only try to convert links in the whitelist?
var whitelisted = [ // Whitelisted domains that will try to be unshortened.
	"goo.gl",
	"bit.ly",
	"adf.ly",
	"tinyurl.com",
	"t.co",
	"1url.com",
	"ow.ly",
	"flic.kr"
];

// If you don't want your computer to unshorten urls you can use the options below
var useAPI = false;
var webURL = "https://unshorten.me/s/{url}";
// NOTE: The API must return a valid url from a GET request to the url above with {url} replaced.

// PLUGIN //

var unshortenLinks = function () {};
var request = require("request");
var urlAPI = require("url");
var urlCache = {};

// Thanks to noodlebox for this this jQuery plugin.
function initQuery($) {
	$.fn.scrollBottom = function(val) {
		   var elem = this[0];
		   if (val === undefined) {
			   if (elem === undefined) {
				   return undefined;
			   }
			   return elem.scrollHeight - (this.scrollTop() + this.height());
		   }
		   if (elem === undefined) {
			   return this;
		   }
		   return this.scrollTop(elem.scrollHeight - (val + this.height()));
	};
}

function unshortenURL(url) {
	return new Promise(function(resolve, reject) {
		if (urlCache[url]) {
			resolve(urlCache[url]);
		} else {
			if (!useAPI) {
				request({method: "HEAD", url: url, followAllRedirects: true}, 
				function (error, response) {
					if (!error) {
						urlCache[url] = response.request.href;
						resolve(response.request.href);
					} else {
						reject();
					}
				});
			} else {
				request({method: "GET", url: webURL.replace(/{url}/g, url)}, 
				function (error, response, body) {
					if (!error) {
						try {
							new URL(body); // This will throw a TypeError if the url is invalid.

							urlCache[url] = body;
							resolve(body);
						} catch (e) {
							if (e.name == "TypeError") {
								reject();
							} else {
								console.error(e);
							}
						}
					} else {
						reject();
					}
				});
			}
		}
	});
}

unshortenLinks.prototype.checklinks = function() {
	var messagesContainer = $(".messages");
	var bottom = messagesContainer.scrollBottom();

	$(".message a").each(function() {
		var link = $(this);
		var href = link.attr("href");
		if (href === undefined) { return true; }

		if (whitelistEnabled && whitelisted.indexOf(this.hostname) == -1) {
			return true;
		}

		unshortenURL(href).then(function(url) {
			link.attr("href", url);
			link.text(url);
		});
	});

	setTimeout(function() {
		messagesContainer.scrollBottom(bottom);
	}, 2000);
};

unshortenLinks.prototype.onMessage = function () {
	this.checklinks();
};

unshortenLinks.prototype.start = function () {
	this.checklinks();
};

unshortenLinks.prototype.onSwitch = function () {
	this.checklinks();
};

unshortenLinks.prototype.load = function () {
	initQuery($);
	this.checklinks();
};

unshortenLinks.prototype.unload = function () {};

unshortenLinks.prototype.stop = function () {};

unshortenLinks.prototype.observer = function () {};

unshortenLinks.prototype.getSettingsPanel = function () {
	return "";
};

unshortenLinks.prototype.getName = function () {
	return "Unshorten Links";
};

unshortenLinks.prototype.getDescription = function () {
	return "Converts shortened links to their original url.";
};

unshortenLinks.prototype.getVersion = function () {
	return "0.1.2";
};

unshortenLinks.prototype.getAuthor = function () {
	return "samfun123";
};
