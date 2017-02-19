//META{"name":"unshortenLinks"}*//

var unshortenLinks = function () {}
var request = require("request")

// To limit http requests I added a whitelist.
var whitelist = true
var domains = [
	"goo.gl",
	"bit.ly",
	"adf.ly",
	"tinyurl.com",
	"t.co",
	"1url.com",
	"ow.ly",
]
var urlCache = {}


// Thanks to noodlebox for this this jQuery plugin.
function initQuery($) {
	$.fn.scrollBottom = function(val) {
		   var elem = this[0]
		   if (val === undefined) {
			   if (elem === undefined) {
				   return undefined
			   }
			   return elem.scrollHeight - (this.scrollTop() + this.height())
		   }
		   if (elem === undefined) {
			   return this
		   }
		   return this.scrollTop(elem.scrollHeight - (val + this.height()))
	}
}

function unshortenURL(url) {
	return new Promise(function(resolve, reject) {
		if (urlCache[url]) {
			resolve(urlCache[url])
		} else {
			request({method: "HEAD", url: url, followAllRedirects: true}, 
			function (error, response) {
				if (!error) {
					urlCache[url] = response.request.href
					resolve(response.request.href)
				} else {
					reject()
				}
			})
		}
	})
}

unshortenLinks.prototype.checklinks = function() {
	var messagesContainer = $(".messages")
	var bottom = messagesContainer.scrollBottom()

	$(".message a").each(function() {
		var link = $(this)
		var href = link.attr("href")
		if (href === undefined) { return true }

		if (whitelist && domains.indexOf(this.hostname) == -1) {
			return true
		}

		unshortenURL(href).then(function(url) {
			link.attr("href", url)
			link.text(url)
		})
	})

	setTimeout(function() {
		messagesContainer.scrollBottom(bottom)
	}, 2000)
}

unshortenLinks.prototype.onMessage = function () {
	this.checklinks()
}

unshortenLinks.prototype.start = function () {
	this.checklinks()
}

unshortenLinks.prototype.onSwitch = function () {
	this.checklinks()
}

unshortenLinks.prototype.load = function () {
	initQuery($)
	this.checklinks()
}

unshortenLinks.prototype.unload = function () {}

unshortenLinks.prototype.stop = function () {}

unshortenLinks.prototype.observer = function (e) {}

unshortenLinks.prototype.getSettingsPanel = function () {
	return ""
}

unshortenLinks.prototype.getName = function () {
	return "Unshorten Links"
}

unshortenLinks.prototype.getDescription = function () {
	return "Converts shortened links to their original url."
}

unshortenLinks.prototype.getVersion = function () {
	return "0.1.1"
}

unshortenLinks.prototype.getAuthor = function () {
	return "samfun123"
}
