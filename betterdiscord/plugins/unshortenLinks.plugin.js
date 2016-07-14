//META{"name":"unshortenLinks"}*//

var unshortenLinks = function () {};

// To limit API calls I added a whitelist.
var whitelist = true;
var domains = [
	"goo.gl",
	"bit.ly",
	"adf.ly",
	"tinyurl.com",
	"t.co",
	"1url.com",
	"ow.ly",
]

unshortenLinks.prototype.checklinks = function() {
	$(".message").each(function() {
		var message = $(this)

		message.find($("a")).each(function() {
			var link = $(this);
	        var href = link.attr("href");
	        if (href == undefined) { return true; };

			if (whitelist) {
				var passed = false;

				for (i = 0; i < domains.length; i++) {
					if (this.hostname == domains[i]) {
						passed = true;
						break
					}
				}

				if (!passed) {
					return true;
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
}

unshortenLinks.prototype.onMessage = function () {
	this.checklinks();
};

unshortenLinks.prototype.start = function () {
	this.checklinks();
};

unshortenLinks.prototype.onSwitch = function () {
	this.checklinks();
};

unshortenLinks.prototype.load = function () {};

unshortenLinks.prototype.unload = function () {};

unshortenLinks.prototype.stop = function () {};

unshortenLinks.prototype.observer = function (e) {};

unshortenLinks.prototype.getSettingsPanel = function () {
    return "";
};

unshortenLinks.prototype.getName = function () {
    return "Unshorten Links";
};

unshortenLinks.prototype.getDescription = function () {
    return "Tries to convert most shortened links to the original.";
};

unshortenLinks.prototype.getVersion = function () {
    return "0.1.0";
};

unshortenLinks.prototype.getAuthor = function () {
    return "samfun123";
};