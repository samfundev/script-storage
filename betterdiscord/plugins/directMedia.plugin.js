//META{"name":"directMedia"}*//

var directMedia = function () {}

function testImage(url, callback) {
	var img = $("<img>")
	img.on("load", function() {
		callback(this.width, this.height)
	}).attr("src", url)
}

// Credit to noodlebox for this jquery plugin.
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

directMedia.prototype.checklinks = function() {
	var messagesContainer = $(".messages")
	var bottom = messagesContainer.scrollBottom()
	var loading = 0

	$(".message").each(function() {
		var msg = $(this)

		msg.find("a").each(function() {
			var link = $(this)

			var href = link.attr("href")
			if (href == undefined) return true
			href = href.replace("http:", "https:")
			
			testImage(href, function(width, height) {
				var duplicate = false
				var clear = false

				msg.find(".attachment-image a").each(function() {
					var link = $(this)
					var href2 = link.attr("href")
					if (href2 == undefined) return true
					href2 = href2.replace("http:", "https:")

					if (href == href2 || link.hasClass("directMedia")) {
						duplicate = true

						if (!link.hasClass("directMedia")) {
							clear = true
						}
					}
				})

				if (clear) {
					msg.find(".attachment-image a.directMedia").remove()
				}

				if (!duplicate) {
					/*<div class="attachment-image">
						<a href="" target="_blank" rel="noreferrer">
							<img class="image" src="" href="" width="" height="">
						</a>
					</div>*/

					var attachment = $('<div class="attachment-image">').appendTo(msg.find(".accessory"))
					var link = $('<a class="directMedia" href="' + encodeURI(href) + '" target="_blank" rel="noreferrer">').appendTo(attachment)
					loading++
					var img = $('<img class="image" src="' + encodeURI(href) + '" href="' + encodeURI(href) + '">').appendTo(link)
					img.on("load", function() {
						loading--
					})
					if (href.endsWith(".gif")) {
						$('<span class="image-gif"></span>').appendTo(img)
					}

					if (img.height() == height) {
						img.height(img.width() / width * img.height()) 
					} else if (img.width() == width) {
						img.width(img.height() / height * img.width())
					}
				}
			})
		})
	})
	
	function wait() {
		if (loading == 0) {
			setTimeout(function() {
				messagesContainer.scrollBottom(bottom)
			}, 2000)
		} else {
			setTimeout(wait, 100)
		}
	}

	wait()
}

directMedia.prototype.onMessage = function () {
	this.checklinks()
}

directMedia.prototype.start = function () {
	links = []
	this.checklinks()
}

directMedia.prototype.onSwitch = function () {
	this.checklinks()
}

directMedia.prototype.load = function () {
	links = []
	initQuery($)
}

directMedia.prototype.unload = function () {}

directMedia.prototype.stop = function () {}

directMedia.prototype.observer = function (e) {}

directMedia.prototype.getSettingsPanel = function () {
	return ""
}

directMedia.prototype.getName = function () {
	return "Direct Media"
}

directMedia.prototype.getDescription = function () {
	return "Tries to convert most direct media links to embedded pictures."
}

directMedia.prototype.getVersion = function () {
	return "0.1.0"
}

directMedia.prototype.getAuthor = function () {
	return "samfun123"
}
