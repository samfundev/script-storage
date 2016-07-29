//META{"name":"directMedia"}*//

var directMedia = function () {}

function testImage(url, callback) {
	var img = $('<img src="' + url + '" height="0" width="0"></img>')
	img.on("error", function() {
		img.remove()
		callback(false)
	}).on("load", function() {
		img.remove()
		callback(true)
	})

	$(".body").append(img)
}

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

var links = []
directMedia.prototype.checklinks = function() {
	correctScrolling(function() {
		$(".message").each(function() {
			var message = $(this)

			message.find($("a")).each(function() {
				if (links.indexOf(this) == -1) {
					links.push(this)

					var link = $(this)
			        var href = link.attr("href")
			        if (href === undefined) { return true }

					if (href.endsWith(".png") || href.endsWith(".jpg") || href.endsWith(".gif")) {
						testImage(href.replace("http:", "https:"), function(https) {
							if (https) {
								href = href.replace("http:", "https:")
							}

							var embed = false
							message.find(".embed-thumbnail-image").each(function() {
								var img = $(this)
								var href2 = img.attr("href")
						        if (href2 === undefined) { return true }
								if (https) {
									href2 = href2.replace("http:", "https:")
								}

								if (href == href2) {
									embed = true
								}
							})

							if (!embed && link.text() !== "") {
								testImage(href, function(success) {
									if (success) {
										var html = $(
											'<div class="embed embed-image custom">' +
												'<a class="embed-thumbnail embed-thumbnail-image" href="' + href + '" target="_blank" rel="noreferrer">' +
													'<span class="image">' +
														'<img class="image" src="' + href + '" href="' + href + '">' +
														(href.endsWith(".gif") ? '<span class="image-gif"></span>' : '') +
													'</span>' +
												'</a>' +
											'</div>'
										)

										message.find(".accessory").append(html)
									}
								})
							}
						})
					}
				}
			})
		})
	})
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
	this.checklinks()
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
