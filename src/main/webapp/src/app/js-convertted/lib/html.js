/**
 * @license RequireJS html 0.0.2 Copyright (c) 2012-2012, Gabriel Reitz Giannattasio All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/gartz/html for details
 */
/*jslint regexp: true */
/*global define: false */

define(['text'], function (text) {
    'use strict';

    var html = {
        load: function (name, req, load, config) {

            // Do not bother with the work if a build
            if (config.isBuild) {
                load();
                return;
            }

            req(['text!' + name], function (value) {
                var doc = document.createDocumentFragment();
                var re = /<html( |>)((.|[\r\n])*)<\/html(.*)>|<head( |>)((.|[\r\n])*)<\/head(.*)>/i;
                var isDocument = re.test(value), el;
                var regStr1 = 'html\\ssegment\\sbegin-->';
                var regStr2 = '<!--html\\ssegment\\send';
                var reg = new RegExp(regStr1 + '([\\s\\S]*?)' + regStr2);
                var isCustomHtml = value.indexOf(regStr1.replace(/\\s/g, ' ')) >= 0;
                el = document.createElement((isDocument && !isCustomHtml) ? 'html' : 'body');
                if (isCustomHtml) {
                    value = value.match(reg)[1];
                    value = value.replace(/..\/..\/images\//g, 'app/images/');
                    value = value.replace(/<!--segment\sexclude\sbegin[\s\S]*?segment\sexclude\send-->/g, '');
                    if (/text\/html/.test(value)) {
                        value = value.match(/<script\stype="text\/html">([\s\S]*)<\/script>\s*$/)[1];
                    }
                }
                el.innerHTML = value;

                if (el.children) {
                    for (var i = 0, max = el.children.length; i < max; i++) {
                        doc.appendChild(el.children[0]);
                    }
                }

                var stash = doc.cloneNode(true);

                doc.stash = function () {
                    if (this.childNodes) {
                        var nodes = this.childNodes;
                        for (var i = 0, max = nodes.length; i < max; i++) {
                            this.removeChild(nodes[0]);
                        }
                    }
                    this.appendChild(stash.cloneNode(true));
                };

                doc.path = name;
                doc.source = value;
                var title = $(doc).find('input[name=title]').val();
                window.shareOption.title = title;
                window.shareOption.link = location.href;
                changeTitle(title);
                function changeTitle(title) {
                    document.title = title;
                    var $iframe = $('<iframe  frameborder="0" src="blank.html" style="display: none;"></iframe>');
                    $iframe[0].onload = function () {
                        setTimeout(function () {
                            try {
                                $iframe[0] && ($iframe[0].onload = null);
                                $iframe[0].remove();
                            } catch (ex) {
                            }
                        }, 100);
                    };
                    $iframe.appendTo($('body'));
                };
                load(doc);
            });
        }
    };

    return html;
});