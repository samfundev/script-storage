//META{"name":"betterRepo"}*//

var betterRepo = function () {};

var BetterID = 86004744966914048;

function GetCurrentServerID() {
	var ID = 0;

	$(".guild.selected .avatar-small").each(function() {
		var server = $(this)
		ID = parseInt(server.attr("href").match(/\/(\d+)\//)[1]);
	})

	return ID
}

// These function's were based on the quickSave plugin. https://github.com/kosshishub/Quicksave-BD-plugin/blob/master/Quicksave.plugin.js
var dir = process.env.APPDATA + "\\BetterDiscord\\plugins\\"
function fileExists(filename) {
	try{
		require('fs').accessSync(filename)
		return true;
	} catch(e) {
		return false;
	}
}

function downloadFile(url, callbacks) {
	var fs = require('fs');
	var net = (url.split('//')[0] == 'https:') ? require('https') : require('http');

	var filename = url.match(/[^\/]+$/)[0];

	var dest = dir + filename;
	if (fileExists(dest)) {
		if (callbacks.exists) {
			callbacks.exists();
		}
		return;
	}

	var file = fs.createWriteStream(dest);
	net.get(url, function(response) {
		response.pipe(file);
		file.on('finish', function() {
			if (callbacks.installed) {
				callbacks.installed();
			}
			file.close();
		});
	}).on('error', function(err) {
		if (callbacks.failed) {
			callbacks.failed();
		}
		fs.unlink(dest);
		file.close();
	});
}

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
	$(".messages .message-content .inline").attr("plugin-state", null);
	BdApi.clearCSS("RepoCSS");

	if (scroller) {
		scroller.remove();
		scroller = null;
	}
}

betterRepo.prototype.checkServer = function() {
	if (GetCurrentServerID() == BetterID && $(".title .channel-name").text() == "plugin-repo") {
		if (!scroller) {
			scroller = $('<div class="scroller plugins"></div>')
			$(".messages-wrapper .scroller-wrap").append(scroller);

			BdApi.injectCSS("RepoCSS", RepoCSS);
		}

		$(".messages .message .inline").each(function() {
			var parent = $(this).parent();
			var title = $(this).clone();

			if (title.text().search("-") > -1 && $(this).attr("plugin-state") == undefined) {
				var description = parent.find("pre").first().clone();
				var source =  parent.find("a").first().clone().text("View Source");

				// Handle download button
				var direct;
				var exists = false;
				var href = source.attr("href");
				if (href.search("raw.githubusercontent.com") > -1 && (href.endsWith(".plugin.js") || href.endsWith(".js"))) {
					if (!fileExists(dir + href.match(/[^\/]+$/)[0])) {
						direct = source.clone().text("Install Plugin").click(function() {
							direct.text("Installing plugin...");
							downloadFile(href, {
								exists: function() {
									direct.text("Plugin already installed!");
								},
								installed: function() {
									direct.text("Plugin Installed!");
								},
								failed: function() {
									direct.text("Installation failed!");
								},
							});
							setTimeout(function() { direct.text("Install Plugin"); }, 2500);

							return false;
						});
					} else {
						exists = true;
					}
				}

				// Handle title & credits
				var info = title.text().match(/(.+) - (.+)/)
				title.text(info[1]);
				var credit = $('<p class="credits">By: </p>').append($('<text>' + info[2] + '</text>'));

				var markup = $('<div class="markup"></div>');
				var comment = $('<div class="comment"></div>').append(markup);
				var group = $('<div class="message-group"></div>').append(comment);

				markup.append(title, credit, '<p class="desc">Description:</p>', description, "\n");
				if (direct) {
					source.css("margin-left", "0px")
					markup.append(direct, "  or  ", source);
				} else {
					markup.append(source);
				}
				markup.append($('<p class="credits">\n' + (exists ? '' : 'not ') + 'installed</p>'));

				if (exists) {
					group.addClass("installed");
				}

				scroller.append(group);
			}

			$(this).attr("plugin-state", "loaded"); // Prevent double loading.
		});
	} else {
		this.removeRepo();
	}
}

betterRepo.prototype.onMessage = function() { this.checkServer() };
betterRepo.prototype.start = function() { this.checkServer() };
betterRepo.prototype.onSwitch = function() { this.checkServer() };
betterRepo.prototype.load = function() { this.checkServer() };

betterRepo.prototype.unload = function() { this.removeRepo() };
betterRepo.prototype.stop = function() { this.removeRepo() };

betterRepo.prototype.observer = function () {};
betterRepo.prototype.getSettingsPanel = function () {
	return ""
};

betterRepo.prototype.getName = function () {
	return "Better Plugin Repository"
};

betterRepo.prototype.getDescription = function () {
    return "Makes the #plugin-repo look a bit fancier.";
};

betterRepo.prototype.getVersion = function () {
    return "0.1.0";
};

betterRepo.prototype.getAuthor = function () {
    return "samfun123";
};
