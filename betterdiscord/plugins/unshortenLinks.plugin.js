//META{"name":"unshortenLinks"}*//

var unshortenLinks = function () {}

// To limit API calls I added a whitelist.
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

// Credit to noodlebox for this jquery plugin & the original code for the correctScrolling function.
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

function correctScrolling(func) {
    var messagesContainer = $(".messages")
    var atBottom = messagesContainer.scrollBottom() < 0.5
    func()

    if (atBottom) {
        messagesContainer.scrollBottom(0)
    }
}

unshortenLinks.prototype.checklinks = function() {
	correctScrolling(function() {
		$(".message").each(function() {
			var message = $(this)

			message.find($("a")).each(function() {
				var link = $(this)
		        var href = link.attr("href")
		        if (href === undefined) { return true }

				if (whitelist) {
					var passed = false

					for (var i = 0; i < domains.length; i++) {
						if (this.hostname == domains[i]) {
							passed = true
						}
					}

					if (!passed) {
						return true
					}
				}

				$.ajax({
					dataType: "json",
					url: "https://jsonp.afeld.me/?url=https://unshorten.me/json/" + href,
					success: function (data) {
						if (data.success) {
							link.attr("href", data.resolvedURL)
							link.text(data.resolvedURL)
						}
					}
				})
			})
		})
	})
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
    return "Tries to convert most shortened links to the original."
}

unshortenLinks.prototype.getVersion = function () {
    return "0.1.0"
}

unshortenLinks.prototype.getAuthor = function () {
    return "samfun123"
}
