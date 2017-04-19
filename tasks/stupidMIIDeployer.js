/*
 * grunt-stupidMIIDeployer
 * https://github.com/ltogno/gruntStupidMIIDeployer
 *
 * Copyright (c) 2017 Luca Togno
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.registerMultiTask('stupidMIIDeployer', 'A grunt plugin for deploy files to MII', function () {

        var Base64 = {

            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;

                input = Base64._utf8_encode(input);

                while (i < input.length) {

                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

                }

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                while (i < input.length) {

                    enc1 = this._keyStr.indexOf(input.charAt(i++));
                    enc2 = this._keyStr.indexOf(input.charAt(i++));
                    enc3 = this._keyStr.indexOf(input.charAt(i++));
                    enc4 = this._keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                }

                output = Base64._utf8_decode(output);

                return output;

            },

            _utf8_encode: function (string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            },

            _utf8_decode: function (utftext) {
                var string = "";
                var i = 0;
                var c = c1 = c2 = 0;

                while (i < utftext.length) {

                    c = utftext.charCodeAt(i);

                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    } else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    } else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }

                }

                return string;
            }

        };


        function sendDataToMII(hostname, port, login, pass, path, content) {
            var qs = require("querystring");
            var http = require("http");

            var reqOptions = {
                "method": "POST",
                "hostname": hostname,
                "port": port,
                "path": "/XMII/Catalog",
                "headers": {
                    "authorization": "Basic " + Base64.encode(login + ":" + pass),
                    "content-type": "application/x-www-form-urlencoded",
                    "cache-control": "no-cache"
                }
            };

            var req = http.request(reqOptions, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());
                });
            });

            req.write(qs.stringify({Mode: 'SaveBinary',
                Class: 'Content',
                ObjectName: path,
                TemporaryFile: 'false',
                notify: 'true',
                Content: content,
                'Content-Type': 'raw/binary'}));
            req.end();
        }

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({});

        if (!grunt.file.exists(options.localPath) || !grunt.file.isDir(options.localPath)) {
            grunt.log.warn('Source dir "' + options.localPath + '" not found.');
            return false;
        }

        grunt.file.recurse(options.localPath, callback);

        // Iterate over all specified file groups.
        function callback(abspath, rootdir, subdir, filename) {
            // The full path to the current file, which is nothing more than
            // the rootdir + subdir + filename arguments, joined. => abspath
            // The root director, as originally specified. => rootdir
            // The current file's directory, relative to rootdir. => subdir
            // The filename of the current file, without any directory parts. => filename
            // Concat specified files.

            var fileContent = grunt.file.read(abspath);
            var b64content = Base64.encode(fileContent);


            var path = options.remotePath + "/" + (subdir ? subdir + "/" : "") + filename;

            // SEND the file.
            grunt.log.debug("SEND FILE WITH PROP : " + [options.miiHost, options.miiPort, options.login, options.pass, path, b64content].join(" ; "));
            sendDataToMII(options.miiHost, options.miiPort, options.login, options.pass, path, b64content);
        }
    });

};