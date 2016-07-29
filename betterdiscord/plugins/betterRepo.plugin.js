//META{"name":"betterRepo"}*//

var betterRepo = function () {}

var BetterID = 86004744966914048

function GetCurrentServerID() {
	var ID = 0

	$(".guild.selected .avatar-small").each(function() {
		var server = $(this)
		ID = parseInt(server.attr("href").match(/\/(\d+)\//)[1])
	})

	return ID
}

// These function's were based on the quickSave plugin. https://github.com/kosshishub/Quicksave-BD-plugin/blob/master/Quicksave.plugin.js
var dir = process.env.APPDATA + "\\BetterDiscord\\plugins\\"
function fileExists(filename) {
	try{
		require('fs').accessSync(filename)
		return true
	} catch(e) {
		return false
	}
}

function downloadFile(url, callbacks) {
	var fs = require('fs')
	var net = (url.split('//')[0] == 'https:') ? require('https') : require('http')

	var filename = url.match(/[^\/]+$/)[0]

	var dest = dir + filename
	if (fileExists(dest)) {
		if (callbacks.exists) {
			callbacks.exists()
		}
		return
	}

	var file = fs.createWriteStream(dest)
	net.get(url, function(response) {
		response.pipe(file)
		file.on('finish', function() {
			if (callbacks.installed) {
				callbacks.installed()
			}
			file.close()
		})
	}).on('error', function(err) {
		if (callbacks.failed) {
			callbacks.failed()
		}
		fs.unlink(dest)
		file.close()
	})
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
		  messagesContainer.scrollBottom(100)
	 }
}

/*eslint-env es6*/

var RepoCSS = `.plugins .message-group .comment .markup code.inline {
	 background: transparent;
	 font-size: 100%;
}

.plugins .comment .markup code.inline {
	padding: 0px;
	font-weight: bold;
}

.plugins .message-group .comment .markup pre {
	 border: none;
	margin-left: 10px;
}

.plugins p.desc {
	 margin-bottom: 2px;
	margin-left: 10px;
}

.messages-wrapper .scroller-wrap .scroller.messages {
	display: none;
}

.plugins p.credits {
	margin: 0px;
	margin-left: 10px;
	font-size: 80%;
}

.plugins a:link, a:visited {
	margin-left: 10px;
	box-sizing: border-box;
	 background-color: #7289da;
	 border-radius: 3px;
	 padding: 5px 13px;
	white-space: nowrap;
	color: #fff;
}

.plugins .installed {
	box-shadow: -1000px -1000px rgba(114, 137, 218, 0.25) inset;
	padding-left: 10px;
}`

var scroller
betterRepo.prototype.removeRepo = function() {
	$(".messages .message-content .inline").attr("plugin-state", null)
	BdApi.clearCSS("RepoCSS")

	if (scroller) {
		scroller.remove()
		scroller = null
	}
}

betterRepo.prototype.checkServer = function() {
	if (GetCurrentServerID() == BetterID && $(".title .channel-name").text() == "plugin-repo") {
		correctScrolling(function() {
			if (!scroller) {
				scroller = $('<div class="scroller plugins"></div>')
				$(".messages-wrapper .scroller-wrap").append(scroller)

				BdApi.injectCSS("RepoCSS", RepoCSS)
			}

			$(".messages .message .inline").each(function() {
				var parent = $(this).parent()
				var title = $(this).clone()

				if (title.text().search("-") > -1 && $(this).attr("plugin-state") === undefined) {
					var group
					var status
					var description = parent.find("pre").first().clone()
					var source =  parent.find("a").first().clone().text("View Source")

					// Handle download button
					var direct
					var exists = false
					var href = source.attr("href")
					if ((href.search("github.com/") > -1 || href.search("raw.githubusercontent.com/") > -1) && (href.endsWith(".plugin.js") || href.endsWith(".js"))) {
						if (!fileExists(dir + href.match(/[^\/]+$/)[0])) {
							if (href.search("github.com/") > -1) {
								href = href.replace("blob/", "").replace("github.com/", "raw.githubusercontent.com/")
							}

							direct = source.clone().text("Install Plugin").click(function() {
								direct.text("Installing...")
								downloadFile(href, {
									exists: function() {
										direct.text("Plugin already installed!")
									},
									installed: function() {
										direct.text("Installed!")

										group.addClass("installed")
										status.text("\n(installed)")
									},
									failed: function() {
										direct.text("Installation failed!")
									},
								})
								setTimeout(function() { direct.text("Install Plugin") }, 3000)

								return false
							})
						} else {
							exists = true
						}
					}

					// Handle title & credits
					var info = title.text().match(/(.+) - (.+)/)
					title.text(info[1])
					var credit = $('<p class="credits">By: </p>').append($('<text>' + info[2] + '</text>'))

					var status = $('<p class="credits">\n(' + (exists ? '' : 'not ') + 'installed)</p>')
					var markup = $('<div class="markup"></div>')
					var comment = $('<div class="comment"></div>').append(markup)
					group = $('<div class="message-group"></div>').append(comment)

					markup.append(title, credit, '<p class="desc">Description:</p>', description, "\n")
					if (direct) {
						source.css("margin-left", "0px")
						markup.append(direct, "  or  ", source)
					} else {
						markup.append(source)
					}
					markup.append(status)

					if (exists) {
						group.addClass("installed")
					}

					scroller.append(group)
				}

				$(this).attr("plugin-state", "loaded") // Prevent double loading.
			})
		})
	} else {
		this.removeRepo()
	}
}

betterRepo.prototype.onMessage = function() { this.checkServer() }
betterRepo.prototype.start = function() { this.checkServer() }
betterRepo.prototype.onSwitch = function() { this.checkServer() }
betterRepo.prototype.load = function() { initQuery($); this.checkServer() }

betterRepo.prototype.unload = function() { this.removeRepo() }
betterRepo.prototype.stop = function() { this.removeRepo() }

betterRepo.prototype.observer = function () {}
betterRepo.prototype.getSettingsPanel = function () {
	return ""
}

betterRepo.prototype.getName = function () {
	return "Better Plugin Repository"
}

betterRepo.prototype.getDescription = function () {
	 return "Makes the #plugin-repo look a bit fancier."
}

betterRepo.prototype.getVersion = function () {
	 return "0.1.0"
}

betterRepo.prototype.getAuthor = function () {
	 return "samfun123"
}
