// ==UserScript==
// @name         Auto Inject-JQuery for BetterDiscord
// @namespace    https://github.com/samfun123/script-storage
// @version      0.1
// @description  Allows faster testing of BetterDiscord Plugins that uses jquery.
// @author       samfun123
// @match        https://discordapp.com/channels/*
// @grant        none
// ==/UserScript==

(function() {
	var script = document.createElement('script');script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js";document.getElementsByTagName('head')[0].appendChild(script);
})();