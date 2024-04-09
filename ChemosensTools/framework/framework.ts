declare var PptxGenJS: any;
declare var html2canvas: any;
declare var XLSX: any;
declare var interact: any;
declare var localforage: any;
declare var noUiSlider: any;
declare var YT: any;
declare var interact: any;
//declare var MediaRecorder: any;
declare var d3: any;
//declare var SpeechRecognition: any;
//declare var SpeechGrammarList: any;
declare var Quagga: any;
declare var tinymce: any;
//declare var ClipboardItem: any;
declare var Tesseract: any;
declare var saveTextAs: any;
//TODO : boostrap 4
//TODO : JSScramber

if (FileReader.prototype.readAsBinaryString === undefined) {
    FileReader.prototype.readAsBinaryString = function (fileData) {
        var binary = "";
        var pt = this;
        var reader = new FileReader();
        reader.onload = function (e) {
            var bytes = new Uint8Array(<any>reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            //pt.result  - readonly so assign content to another property
            pt.content = binary;
            pt.onload(); // thanks to @Denis comment
        }
        reader.readAsArrayBuffer(fileData);
    }
}

module Framework {

    // extensions : extensions du module à charger
    export function LoadFramework(frameworkUrl: string, callback: Function, extensions: string[] = ["DataTable", "Slider", "Pivot", "PPT", "Crypto", "Zip", "Capture"]) {

        //TODO : check requirements            


        // Affichage splash screen pendant le chargement
        showSplashScreen(frameworkUrl);

        // Fichiers css communs à tous les modules utilisant Framework        
        let css = [frameworkUrl + '/css/font-awesome-4.7.0/css/font-awesome.min.css', frameworkUrl + '/css/framework.css', frameworkUrl + '/css/bootstrap.min.css', frameworkUrl + '/css/jquery-ui.min.css', frameworkUrl + '/css/tooltipster.bundle.css', frameworkUrl + '/css/jquery.mCustomScrollbar.min.css', frameworkUrl + '/css/bootstrap-colorpalette.css', frameworkUrl + '/css/bootstrap-multiselect.css'];

        // Fichiers js communs à tous les modules utilisant Framework        
        let scriptsRequiredByFramework = []; // Attention localforage inclut polyfill pour Promises

        scriptsRequiredByFramework.push(frameworkUrl + '/ts/models.js');

        if (extensions.indexOf("DataTable") > -1) {
            css.push(frameworkUrl + '/css/jquery.dataTables.min.css');
            css.push(frameworkUrl + '/css/dataTables.bootstrap.min.css');
            css.push(frameworkUrl + '/css/datatable.css');
            scriptsRequiredByFramework.push(frameworkUrl + '/js/pdfmake.min.js');
            scriptsRequiredByFramework.push(frameworkUrl + '/js/vfs_fonts.js');
            scriptsRequiredByFramework.push(frameworkUrl + '/js/buttons.html5.min.js');
            scriptsRequiredByFramework.push(frameworkUrl + '/js/buttons.print.min.js');
            scriptsRequiredByFramework.push(frameworkUrl + '/js/dataTables.buttons.min.js');
            scriptsRequiredByFramework.push(frameworkUrl + '/js/jquery.dataTables.min.js');
        }

        if (extensions.indexOf("Rating") > -1) {
            css.push(frameworkUrl + '/css/fontawesome-stars-o.css');
            scriptsRequiredByFramework.push(frameworkUrl + '/js/jquery.barrating.min.js');
        }

        if (extensions.indexOf("Slider") > -1) {
            css.push(frameworkUrl + '/css/nouislider.min.css');
            scriptsRequiredByFramework.push(frameworkUrl + '/js/nouislider.min.js');
        }

        if (extensions.indexOf("Pivot") > -1) {
            css.push(frameworkUrl + '/css/pivot.min.css');
            scriptsRequiredByFramework.push(frameworkUrl + '/js/pivot/tips_data.min.js');
            scriptsRequiredByFramework.push(frameworkUrl + '/js/pivot/pivot.min.js');
        }

        if (extensions.indexOf("PPT") > -1) {
            scriptsRequiredByFramework.push(frameworkUrl + '/js/pptxgen.js');
        }

        if (extensions.indexOf("Xlsx") > -1) {
            scriptsRequiredByFramework.push(frameworkUrl + '/js/shim.min.js');
            scriptsRequiredByFramework.push(frameworkUrl + '/js/xlsx.full.min.js');
        }

        if (extensions.indexOf("Crypto") > -1) {
            scriptsRequiredByFramework.push(frameworkUrl + '/js/crypto-js/jcrypto.js');
        }

        if (extensions.indexOf("Zip") > -1) {
            scriptsRequiredByFramework.push(frameworkUrl + '/js/jszip.min.js');
        }

        if (extensions.indexOf("Capture") > -1) {
            scriptsRequiredByFramework.push(frameworkUrl + '/js/html2canvas.min.js');
        }

        if (extensions.indexOf("Offline") > -1) {
            scriptsRequiredByFramework.push(frameworkUrl + '/js/offline.min.js');
        }

        if (extensions.indexOf("Barcode") > -1) {
            scriptsRequiredByFramework.push(frameworkUrl + '/js/quagga.min.js');
        }

        if (extensions.indexOf("D3") > -1) {
            scriptsRequiredByFramework.push(frameworkUrl + '/js/d3.js');
        }

        if (extensions.indexOf("VirtualKeyboard") > -1) {
            css.push(frameworkUrl + '/js/Keyboard-master/css/keyboard-basic.css');
            scriptsRequiredByFramework.push(frameworkUrl + '/js/Keyboard-master/js/jquery.keyboard.js');
        }

        if (extensions.indexOf("Tesseract") > -1) {
            scriptsRequiredByFramework.push(frameworkUrl + '/js/tesseract.min.js');
        }

        if (extensions.indexOf("Face") > -1) {
            scriptsRequiredByFramework.push(frameworkUrl + '/js/face-api.min.js');
        }

        //if (extensions.indexOf("Speech") > -1) {
        //    scriptsRequiredByFramework.push(rootUrl + '/framework/js/BingSpeech.js');
        //}

        // Chargement des fichiers CSS
        css.forEach((x) => {
            DynamicLoader.AddCss(x);
        })

        // Attention, l'ordre de chargement des scriptys est important
        scriptsRequiredByFramework = scriptsRequiredByFramework.concat([frameworkUrl + '/js/dragdroptouch.js', frameworkUrl + '/js/bootstrap-multiselect.js', frameworkUrl + '/js/bootstrap.min.js', frameworkUrl + '/js/jquery-ui.min.js', frameworkUrl + '/js/tooltipster.bundle.js', frameworkUrl + '/js/jquery.mCustomScrollbar.concat.min.js', frameworkUrl + '/js/modernizr.js', frameworkUrl + '/js/jquery.ui.touch-punch.min.js', frameworkUrl + '/js/FileSaver.min.js', frameworkUrl + '/js/interact.min.js', frameworkUrl + '/js/bootstrap-colorpalette.js', frameworkUrl + '/js/localforage.min.js', frameworkUrl + '/js/jquery.js']);

        DynamicLoader.AddScripts(scriptsRequiredByFramework, () => {
            callback();
            hideSplashScreen();

            // Ajouté à cause d'un bug dans chrome qui highlight le texte ?
            if (window.getSelection) { window.getSelection().removeAllRanges(); }
            else if ((<any>document).selection) { (<any>document).selection.empty(); }
        });
    }

    export function LoadModule(requirements: ModuleRequirements) {

        Framework.CanIUse.CheckBrowser.ReadData();

        let checkModuleCompatibilityResult: ModuleCompatibilityCheck = DynamicLoader.CheckModuleCompatibility(requirements);

        if (requirements.DisableRefresh == true) {
            Browser.DisableRefresh(); // Interdit d'actualiser la page
        }
        if (requirements.DisableGoBack == true) {
            Browser.DisableGoBack(); // Interdit de revenir en arrière
        }

        // Chemin vers le WebService
        if (requirements.WcfServiceUrl) {
            WCF.BaseURL = requirements.WcfServiceUrl;
        }

        // Choix de la langue  
        let lang: string = "en";
        if (requirements.AuthorizedLanguages && requirements.DefaultLanguage) {
            lang = Browser.GetLanguage(requirements.AuthorizedLanguages, requirements.DefaultLanguage);
        }

        // Affichage splash screen pendant le chargement
        showSplashScreen(requirements.FrameworkUrl);

        // Fichiers css 
        let css = [];

        // Fichiers css nécessaires au module chargé
        requirements.CssFiles.forEach((x) => { css.push(requirements.AppUrl + x) });

        // Chargement des fichiers CSS
        css.forEach((x) => {
            DynamicLoader.AddCss(x);
        })

        // Fichiers js nécessaires au module chargé
        let scripts = [];
        requirements.JsFiles.forEach((x) => { scripts.push(requirements.AppUrl + x) });

        // Ressources
        let resources = [requirements.FrameworkUrl + "/resources/framework.json"];
        requirements.JsonResources.forEach((x) => { resources.push(requirements.AppUrl + x) });

        if (scripts.length == 0) {
            loadResources(resources, lang, () => { requirements.OnLoaded(checkModuleCompatibilityResult); })
        } else {
            DynamicLoader.AddScripts(scripts, () => {
                loadResources(resources, lang, () => { requirements.OnLoaded(checkModuleCompatibilityResult); })
            });
        }
    }

    function loadResources(resources: string[], lang: string, callback: Function) {
        LocalizationManager.LoadResources(resources, lang, () => {
            callback();
            hideSplashScreen();
        });
    }

    export var RootUrl: string;

    function showSplashScreen(frameworkUrl: string) {

        if (document.getElementById("divSplash") == undefined) {

            let outerSplashDiv = document.createElement("div");
            outerSplashDiv.id = "divSplash";
            outerSplashDiv.classList.add("splashDiv");
            outerSplashDiv.classList.add("noselect");


            let innerSplashDiv = document.createElement("div");
            outerSplashDiv.appendChild(innerSplashDiv);

            let image: HTMLImageElement = document.createElement("img");
            innerSplashDiv.appendChild(image);

            image.src = frameworkUrl + "/images/progressbar.gif";
            image.classList.add("noselect");

            document.body.insertBefore(outerSplashDiv, document.body.firstChild);
        }
    }

    function hideSplashScreen() {

        let splash = document.getElementById("divSplash");
        if (splash) {
            document.body.removeChild(splash);
        }

        document.getElementsByTagName("body")[0].style.visibility = "visible";
    }

    export module DynamicLoader {

        export var LoadedCss: string[] = [];
        export var LoadedScripts: string[] = [];

        export function CheckModuleCompatibility(requirements: ModuleRequirements): ModuleCompatibilityCheck {

            let compatibility = new ModuleCompatibilityCheck();
            compatibility.Type = "full";

            // Tests Modernizr
            let recommandedCheck: boolean;
            let recommandedFailed: string[] = [];
            requirements.Recommanded.forEach((x) => {
                let test: boolean = Modernizr[x];
                if (test == false) {
                    recommandedCheck = false;
                    recommandedFailed.push(x);
                }
            });

            let requiredCheck: boolean;
            let requiredFailed: string[] = [];
            requirements.Required.forEach((x) => {
                let test: boolean = Modernizr[x];
                if (test == false) {
                    requiredCheck = false;
                    requiredFailed.push(x);
                }
            });

            if (requiredCheck == false) {
                compatibility.Type = "notCompatible";
                compatibility.MissingRequired = requiredFailed;
            }

            if (recommandedCheck == false) {
                // Warning rencontré       
                compatibility.Type = "partial";
                compatibility.MissingRecommanded = recommandedFailed;
            }

            return compatibility;
        }

        //export function AddInlineCss(cssString: string, div: HTMLDivElement): void {
        //    // TODO : Suppression éventuelle du style existant                        
        //    var style = document.createElement('style');
        //    style.type = 'text/css';

        //    let newCssString: string = "";
        //    let lines: string[] = cssString.split('\r\n');
        //    for (var i = 0; i < lines.length; i++) {
        //        if (lines[i].length > 0) {
        //            newCssString += '[id = "' + div.id + '"] ' + lines[i] + '\r\n';
        //        }
        //    }

        //    //style.appendChild(document.createTextNode(cssString));
        //    style.appendChild(document.createTextNode(newCssString));
        //    div.appendChild(style);
        //}

        export function AddCss(pathToCss: string) {

            let head = document.getElementsByTagName('head')[0];

            if (DynamicLoader.LoadedCss.indexOf(pathToCss) < 0) {
                var link = document.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('type', 'text/css');
                link.setAttribute('href', pathToCss);
                head.appendChild(link);
                DynamicLoader.LoadedCss.push(pathToCss);
            }
        }

        export function AddScripts(scripts: string[], callback: Function) {
            let s = scripts.pop();

            while (DynamicLoader.LoadedScripts.indexOf(s) > -1) {
                s = scripts.pop();
            }

            if (s) {
                let script = AddScript(s);
                //if (script) {
                script.onload = () => {
                    if (scripts.length > 0) {
                        AddScripts(scripts, callback);
                    } else {
                        callback();
                    }
                }
            } else {
                callback();
            }
        }

        export function AddScript(pathToScript: string): HTMLScriptElement {
            let head = window.document.getElementsByTagName('head')[0];

            if (DynamicLoader.LoadedScripts.indexOf(pathToScript) < 0) {
                var script = document.createElement('script');
                script.setAttribute('src', pathToScript);
                script.setAttribute('type', 'text/javascript');
                head.appendChild(script);
                DynamicLoader.LoadedScripts.push(pathToScript);
                return script;
            }

            return undefined;
        }
    }

    export module ServiceWorker {
        export function Register(scope: string, scriptName: string, success: Function, error: Function) {

            if (Modernizr.serviceworker) {

                (<any>navigator).serviceWorker.register(scope + scriptName, { scope: scope }).then(function (reg) {
                    //    if (reg.installing) {
                    //    alert('Service worker installing');
                    //} else if (reg.waiting) {
                    //    alert('Service worker installed');
                    //} else if (reg.active) {
                    //    alert('Service worker active');
                    //}
                    success();

                }).catch(function (e) {
                    error();
                });

                // Install banner pour les mobiles
                window.addEventListener('beforeinstallprompt', function (e) {
                    (<any>e).userChoice.then(function (choiceResult) {
                        console.log(choiceResult.outcome);
                        if (choiceResult.outcome == 'dismissed') {
                            console.log('User cancelled home screen install');
                        }
                        else {
                            console.log('User added to home screen');
                        }
                    });
                });

            }
        }

        export function GetLoadedResources() {
            //TODO : utiliser ça pour remplir cache.addAll([...
            // Appeler dans daily task et remplir fichier txt
            let txt = "";
            let res = window.performance.getEntries();
            res.forEach((x) => {
                if (x.entryType == "resource") {
                    let path = x.name.replace("http://localhost:56206", "");
                    txt += path + "\r\n";
                }
            })
            //TODO : virer blob, aboutblank
            console.log(txt);
        }
    }

    export module Log {
        export function FetchChangeLog(path: string, callback: Function) {
            if (Modernizr.fetch) {
                fetch(path).then(function (response) {
                    return response.text();
                }).then(function (text) {
                    callback(text);
                });
            } else {
                $.ajax({
                    url: path,
                    success: function (data) {
                        callback(data);
                    },
                    error: function (e) {
                        let v = e;
                    }
                });
            }
        }
    }

    export module LocalStorage {

        // Teste si le stockage local est autorisé
        export function canSaveToLocalStorage(): boolean {
            return (typeof window['localStorage'] != "undefined" && window['localStorage'] != null);
        }

        // Enregistre une variable dans le local storage
        export function SaveToLocalStorage(key: string, item: string, obfuscate = false): void {

            // TODO : encryption facultative
            if (LocalStorage.canSaveToLocalStorage() == false) {
                return;
            }
            if (obfuscate == true) {
                item = btoa(item);
            }
            localStorage.setItem(key, item);
        }

        // Récupère une variable dans le local storage
        export function GetFromLocalStorage(key: string, obfuscate = false): string {
            if (LocalStorage.canSaveToLocalStorage() == false) {
                return null;
            }
            let res: string = localStorage.getItem(key);
            if (res != null && obfuscate == true && res.substring(0, 1) != "{") {
                res = atob(res);
            }
            return (res);
        }

        export function RemoveItem(key: string): void {
            if (LocalStorage.canSaveToLocalStorage() == false) {
                return;
            }
            localStorage.removeItem(key);
        }

        export function GetLocalStorageActualSize(): number {
            var sum = 0;
            for (var i = 0; i < localStorage.length; ++i) {
                var key = localStorage.key(i)
                if (key == "") {
                    localStorage.removeItem(key);
                } else {
                    var value = localStorage.getItem(key);
                    sum += key.length + value.length;
                }
            }
            return sum;
        }

        export function GetLocalStorageItemSize(key: string): number {
            var value = localStorage.getItem(key);
            if (value === null) {
                return NaN;
            }
            else {
                return key.length + value.length;
            }
        }

        // Récupère toutes les variables du local storage
        export function GetAllLocalStorageItems(): string[] {
            if (LocalStorage.canSaveToLocalStorage() == false) {
                return null;
            }
            return Object.keys(localStorage)
        }
    }

    export module Browser {

        export function GetScrollbarWidth() {
            var outer = document.createElement("div");
            outer.style.visibility = "hidden";
            outer.style.width = "100px";
            //outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

            document.body.appendChild(outer);

            var widthNoScroll = outer.offsetWidth;
            // force scrollbars
            outer.style.overflow = "scroll";

            // add innerdiv
            var inner = document.createElement("div");
            inner.style.width = "100%";
            outer.appendChild(inner);

            var widthWithScroll = inner.offsetWidth;

            // remove divs
            outer.parentNode.removeChild(outer);

            return widthNoScroll - widthWithScroll;
        }

        export function CanUseLocalFile(): boolean {
            return Modernizr.fileinput && Modernizr.filereader && Modernizr.localstorage && Modernizr.blobconstructor;
        }

        export var IsFullScreen: boolean = false;

        export function NavigateToUrl(url: string, blank = false) {
            if (blank == false) {
                (<any>window).location = url;
            }
            if (blank == true) {
                OpenNew(url);
            }
        }

        export function OpenNew(url: string) {
            window.open(url, '_blank');
        }

        export function GoHome() {
            //if (typeof (<any>window).home == 'function') { // The rest of the world
            //    (<any>window).home();
            //} else if (document.all) { // For IE 
            //   window.location.href = "about:home";
            //} else {
            //    document.write("<p>Please click on your browser's Home button.< /p>");
            //}

            let ua = navigator.userAgent;
            let browser = /Edge\/\d+/.test(ua) ? 'ed' : /MSIE 9/.test(ua) ? 'ie9' : /MSIE 10/.test(ua) ? 'ie10' : /MSIE 11/.test(ua) ? 'ie11' : /MSIE\s\d/.test(ua) ? 'ie?' : /rv\:11/.test(ua) ? 'ie11' : /Firefox\W\d/.test(ua) ? 'ff' : /Chrom(e|ium)\W\d|CriOS\W\d/.test(ua) ? 'gc' : /\bSafari\W\d/.test(ua) ? 'sa' : /\bOpera\W\d/.test(ua) ? 'op' : /\bOPR\W\d/i.test(ua) ? 'op' : typeof PointerEvent !== 'undefined' ? 'ie?' : '';
            let os = /Windows NT 10/.test(ua) ? "win10" : /Windows NT 6\.0/.test(ua) ? "winvista" : /Windows NT 6\.1/.test(ua) ? "win7" : /Windows NT 6\.\d/.test(ua) ? "win8" : /Windows NT 5\.1/.test(ua) ? "winxp" : /Windows NT [1-5]\./.test(ua) ? "winnt" : /Mac/.test(ua) ? "mac" : /Linux/.test(ua) ? "linux" : /X11/.test(ua) ? "nix" : "";
            let touch = 'ontouchstart' in document.documentElement;
            let mobile = /IEMobile|Windows Phone|Lumia/i.test(ua) ? 'w' : /iPhone|iP[oa]d/.test(ua) ? 'i' : /Android/.test(ua) ? 'a' : /BlackBerry|PlayBook|BB10/.test(ua) ? 'b' : /Mobile Safari/.test(ua) ? 's' : /webOS|Mobile|Tablet|Opera Mini|\bCrMo\/|Opera Mobi/i.test(ua) ? 1 : 0;
            let tablet = /Tablet|iPad/i.test(ua);

            let homepageurl = browser == 'gc' ? 'https://www.google.com/_/chrome/newtab' : browser == 'op' ? 'about:speeddial' : browser == 'sa' ? 'http://livepage.apple.com' : 'about:home'
            window.location.href = homepageurl;


        }

        export function GetServiceWorkerVersion(callback: Function) {
            if (Modernizr.fetch) {
                fetch('sw.js').then(function (response) {
                    return response.text();
                }).then(function (text) {
                    callback(text);
                });
            }
        }

        export function SetCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        export function GetCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        export function checkFeatures(features: string[]): string[] {

            var missing: string[] = [];

            for (var i = 0; i < features.length; i++) {
                var feature = features[i];
                if (typeof Modernizr[feature] === "boolean") {
                    if (Modernizr[feature] == false) {
                        missing.push(feature);
                    }
                    //for (var subFeature in Modernizr[feature]) {
                    //    if (typeof Modernizr[feature][subFeature] === "boolean") {
                    //        if (Modernizr[feature][subFeature] == true) {
                    //            tab.push(feature + "_" + subFeature);
                    //        }
                    //    }
                    //}
                }
            }

            return missing;
        }

        // Teste si le navigateur est compatible
        export function CheckCompatibility(required: string[], recommanded: string[]): { isCompatible: string; issues: string; } {

            let missingRequired: string[] = Browser.checkFeatures(required);
            let missingRecommanded: string[] = Browser.checkFeatures(recommanded);

            let compatibility: string = "notCompatible";
            if (missingRequired.length == 0) {
                compatibility = "full";
                if (missingRecommanded.length > 0) {
                    compatibility = "partial";
                }
            }
            let txt = missingRecommanded.join(', ');

            return { "isCompatible": compatibility, "issues": txt };
        }

        export function GetCurrentQueryString(): string[] {
            let url = window.location.href;
            return GetQueryStringParameters(url);
        }

        export function GetUrlParameter(sParam):string {
            var sPageURL = window.location.search.substring(1),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? "" : decodeURIComponent(sParameterName[1]);
                }
            }
            return "";
        }

        export function GetQueryStringParameters(text: string): string[] {
            var vars = [], hash;
            //if (text.indexOf('?') < 0) {
            //    return [];
            //}            
            var hashes = text.slice(text.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }

        export function AddBookmark(): void {

            let w = <any>window;

            var bookmarkURL = window.location.href;
            var bookmarkTitle = document.title;

            if ('addToHomescreen' in window && w.addToHomescreen.isCompatible) {
                // Mobile browsers
                //addToHomescreen({ autostart: false, startDelay: 0 }).show(true);
            } else if (w.sidebar && w.sidebar.addPanel) {
                // Firefox version < 23
                w.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
            } else if ((w.sidebar && /Firefox/i.test(navigator.userAgent)) || (w.opera && window.print)) {
                // Firefox version >= 23 and Opera Hotlist
                $(this).attr({
                    href: bookmarkURL,
                    title: bookmarkTitle,
                    rel: 'sidebar'
                }).off(null);
            } else if (window.external && ('AddFavorite' in window.external)) {
                // IE Favorite
                w.external.AddFavorite(bookmarkURL, bookmarkTitle);
            } else {
                // Other browsers (mainly WebKit - Chrome/Safari)
                //Panelist.Views.ShowModalBox(Localization.Localize("Information"), 'Please press ' + (/Mac/i.test(navigator.userAgent) ? 'CMD' : 'Strg') + ' + D to add this page to your favorites.');
            }
        }

        export function AskFullScreen() {
            let div = document.createElement("div");

            let p1 = document.createElement("p");
            p1.innerHTML = Framework.LocalizationManager.Get("SwitchToFullScreen");
            p1.style.textAlign = "center";
            div.appendChild(p1);

            let p = document.createElement("p");
            p.innerHTML = "&nbsp;"
            p.style.textAlign = "center";
            p.style.fontSize = "12px";
            div.appendChild(p);

            let cpt: number = 5;
            let interval = setInterval(() => {
                p.innerHTML = Framework.LocalizationManager.Format("ThisWindowsWillCloseInSeconds", [cpt.toString()]);
                cpt--;
                if (cpt < 0) {
                    modal.Close();
                    clearInterval(interval);
                }
            }, 1000)

            let modal = Framework.Modal.Confirm(undefined, div, () => {
                FullScreen();
            }, undefined, undefined, undefined, "100px", "450px", true, false, true);
        }

        export function FullScreen() {
            var document: any = window.document;
            var fs = document.documentElement;

            if (fs.requestFullscreen) {
                fs.requestFullscreen();
            } else if (fs.msRequestFullscreen) {
                fs.msRequestFullscreen();
            } else if (fs.mozRequestFullScreen) {
                fs.mozRequestFullScreen();
            } else if (fs.webkitRequestFullscreen) {
                fs.webkitRequestFullscreen();
            }
            Browser.IsFullScreen = true;
        }

        export function ToggleFullScreen(): void {
            if (Modernizr.fullscreen == false) {
                return;
            }

            var document: any = window.document;
            var fs = document.body;
            if (Browser.IsFullScreen == false && (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement)) {
                FullScreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
                Browser.IsFullScreen = false;
            }
        }

        // Browser utilisé
        export function GetBrowserInfo(): any {
            var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return { Name: 'IE', Version: (tem[1] || '') };
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\bOPR\/(\d+)/)
                if (tem != null) { return { Name: 'Opera', Version: tem[1] }; }
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) {
                M.splice(1, 1, tem[1]);
            }
            return {
                Name: M[0],
                Version: M[1]
            };
        }

        export class BrowserInfo {
            public Name: string;
            public Version: string;
            public OS: string;
            public Touch: boolean;
            public Mobile: any;
            public Tablet: boolean;
            public CanIUseName: string;
        }

        export function GetInfo(): BrowserInfo {

            let bi: BrowserInfo = new BrowserInfo();

            var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

            let os = /Windows NT 10/.test(ua) ? "win10" : /Windows NT 6\.0/.test(ua) ? "winvista" : /Windows NT 6\.1/.test(ua) ? "win7" : /Windows NT 6\.\d/.test(ua) ? "win8" : /Windows NT 5\.1/.test(ua) ? "winxp" : /Windows NT [1-5]\./.test(ua) ? "winnt" : /Mac/.test(ua) ? "mac" : /Linux/.test(ua) ? "linux" : /X11/.test(ua) ? "nix" : "";
            let touch = 'ontouchstart' in document.documentElement;
            let mobile = /IEMobile|Windows Phone|Lumia/i.test(ua) ? 'w' : /iPhone|iP[oa]d/.test(ua) ? 'i' : /Android/.test(ua) ? 'a' : /BlackBerry|PlayBook|BB10/.test(ua) ? 'b' : /Mobile Safari/.test(ua) ? 's' : /webOS|Mobile|Tablet|Opera Mini|\bCrMo\/|Opera Mobi/i.test(ua) ? 1 : 0;
            let tablet = /Tablet|iPad/i.test(ua);

            let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
            let nua = navigator.userAgent;
            let android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

            bi.OS = os;
            bi.Touch = touch;
            bi.Mobile = mobile;
            bi.Tablet = tablet;

            //TODO
            //"edge"
            //"safari"
            //"opera"
            //"ios_saf"
            //"op_mini"
            //"android"
            //"bb"
            //"op_mob"
            //"and_chr"
            //"and_ff"
            //"ie_mob"
            //"and_uc"
            //"samsung"
            //"and_qq"
            //"baidu"



            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                bi.Name = 'IE';
                bi.Version = (tem[1] || '');
                bi.CanIUseName = "ie";
            }
            else if (M[1] === 'Chrome') {

                let getChromeVersion = function () {
                    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
                    return raw ? parseInt(raw[2], 10) : 0;
                }
                bi.Version = getChromeVersion().toString();

                tem = ua.match(/\bOPR\/(\d+)/);
                bi.CanIUseName = "chrome";
                if (android == true) {
                    bi.CanIUseName = "and_chr"; // TOTEST
                }
                if (tem != null) {
                    bi.Name = 'Opera';
                    bi.Version = tem[1];
                    bi.CanIUseName = "opera";
                }
            } else {
                M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
                if ((tem = ua.match(/version\/(\d+)/i)) != null) {
                    M.splice(1, 1, tem[1]);
                }
                bi.Name = M[0];
                bi.Version = M[1];
                if (bi.Name == "Firefox") {
                    bi.CanIUseName = "firefox";
                }
            }

            return bi;
        }

        // Désactive l'actualisation de la page (F5 + MAJ depuis navigateur)
        export function DisableRefresh(): void {
            $(document).on("keydown", function (e) {
                if ((e.which || e.keyCode) == 116) e.preventDefault();
            });

            //window.onbeforeunload = function () {
            //    return LocalizationManager.Get("AreYouSureToWantToRefreshPage");
            //}
        }

        // Désactive le retour en arrière
        export function DisableGoBack(): void {
            try {
                if (Modernizr.history) {
                    history.pushState(null, document.title, location.href);
                    window.addEventListener('popstate', function (event) {
                        history.pushState(null, document.title, location.href);
                    });
                }
            } catch (e) {
            }
        }

        // Language du navigateur
        export function GetLanguage(authorizedLanguage: string[], defaultLanguage: string): string {
            let language = (navigator.language).substring(0, 2).toLowerCase();
            if (language && authorizedLanguage.indexOf(language) > -1) {
                return language;
            }
            return defaultLanguage;
        }


    }

    export module WCF {
        export var Type: string = "POST";
        export var ContentType: string = "application/json; charset=utf-8";
        export var BaseURL: string = "";
        export var ProcessData: boolean = true;
        export var DataType: string = "json";

        export function AjaxCall(service: string, data: string, success: (any) => void, error: (any) => void) {

            $.ajax({
                type: WCF.Type,
                contentType: WCF.ContentType,
                url: WCF.BaseURL + service,
                data: data,
                processData: WCF.ProcessData,
                dataType: WCF.DataType,
                success: success,
                error: error
            });
        }

        export class WCFResult {
            public Status: string;
            public Result: string;
            public ErrorMessage: string;
        }

        export function Call(baseURL: string, service: string, data: string, onStart: () => void, onCompleted: (res: WCFResult) => void, sType: string = "POST", contentType: string = "application/json; charset=utf-8", processData: boolean = true, dataType: string = "json") {
            onStart();

            let result = new WCFResult();

            $.ajax({
                type: sType,
                contentType: contentType,
                url: baseURL + service,
                data: data,
                processData: processData,
                dataType: dataType,
                success: (s) => {
                    result.Status = 'success';
                    result.Result = s.d;
                    result.ErrorMessage = undefined;
                    onCompleted(result);
                },
                error: (e) => {
                    try {
                        let err = JSON.parse(e.responseText);
                        result.Status = 'error';
                        result.Result = undefined;
                        result.ErrorMessage = err.Message;
                        onCompleted(result);
                    } catch (ex) {
                        result.Status = 'error';
                        result.Result = undefined;
                        result.ErrorMessage = ex.Message;
                        onCompleted(result);
                    }
                }
            });

        }
    }

    export module Modal {

        export function Confirm(title: string, content: HTMLElement | string, onConfirm: Function = undefined, onCancel: Function = undefined, confirmText: string = undefined, cancelText: string = undefined, height: string = undefined, width: string = undefined, canClose: boolean = false, grayBackground: boolean = true, backdrop: boolean = false): ConfirmModal {
            let confirmModal = new ConfirmModal(title, content, onConfirm, onCancel, confirmText, cancelText, height, width, canClose, grayBackground, backdrop);
            confirmModal.show();
            return confirmModal;
        }

        export function Custom(content: HTMLElement, title: string = undefined, buttons: Form.Button[] = undefined, height: string = undefined, width: string = undefined, canClose: boolean = false, grayBackground: boolean = true, backdrop: boolean = false): CustomModal {
            let customModal = new CustomModal(content, title, buttons, height, width, canClose, grayBackground, backdrop);
            customModal.show();
            return customModal;
        }

        export function CustomWithBackdrop(content: HTMLElement): CustomModal {
            let customModal = new CustomModal(content);
            customModal.backdrop = true;
            customModal.show();
            return customModal;
        }

        export function Alert(title: string, content: HTMLElement | string, onConfirm: Function = undefined, confirmText: string = undefined, height: string = undefined, width: string = undefined, canClose: boolean = false, grayBackground: boolean = true, backdrop: boolean = false): AlertModal {
            let alertModal = new AlertModal(title, content, onConfirm, confirmText, height, width, canClose, grayBackground, backdrop);
            alertModal.show();
            return alertModal;
        }

        export class Modal {

            protected outerDiv: HTMLDivElement;
            protected innerDiv: HTMLDivElement;
            protected contentDiv: HTMLDivElement;
            protected headerDiv: HTMLDivElement;
            protected closeButtonIcon: HTMLButtonElement;
            //protected helpButtonIcon: HTMLButtonElement;
            protected titleH4: HTMLElement;
            protected bodyDiv: HTMLDivElement;
            protected footerDiv: HTMLDivElement;

            public backdrop: boolean = false;

            public OnClose: () => void = undefined;

            public HelpFunction: () => void;

            public IsVisible: boolean = false;

            public get Height(): number {
                return Number(this.bodyDiv.style.height.replace("px", ""));
            }

            public get Width(): number {
                return Number(this.innerDiv.style.width.replace("px", ""));
            }

            public get OuterDiv(): HTMLDivElement {
                return this.outerDiv;
            }

            constructor(canClose: boolean = true, css: string[] = [], grayBackground: boolean = true, backdrop: boolean = false) {
                let self = this;

                this.backdrop = backdrop;

                this.outerDiv = document.createElement("div");
                this.outerDiv.classList.add("modal");
                this.outerDiv.classList.add("fade");
                this.outerDiv.id = "modalWindow";
                css.forEach((x) => {
                    this.outerDiv.classList.add(x);
                });

                if (grayBackground == true) {
                    this.outerDiv.style.background = "rgba(40, 40, 40, 0.6)";
                } else {
                    this.outerDiv.style.background = "transparent";
                }

                this.innerDiv = document.createElement("div");
                this.innerDiv.classList.add("modal-dialog");
                this.innerDiv.classList.add("modal-lg");
                this.outerDiv.appendChild(this.innerDiv);

                this.contentDiv = document.createElement("div");
                this.contentDiv.classList.add("modal-content");
                this.innerDiv.appendChild(this.contentDiv);

                this.headerDiv = document.createElement("div");
                this.headerDiv.classList.add("modal-header");
                this.contentDiv.appendChild(this.headerDiv);

                if (canClose == true) {
                    this.closeButtonIcon = document.createElement("button");
                    this.closeButtonIcon.type = "button";
                    this.closeButtonIcon.style.display = "inline";
                    this.closeButtonIcon.setAttribute("data-dismiss", "modal");
                    this.closeButtonIcon.className = "close";
                    this.closeButtonIcon.innerHTML = "<i class='far fa-times-circle'></i>";
                    this.closeButtonIcon.onclick = () => {
                        self.Close();
                    }
                    this.headerDiv.appendChild(this.closeButtonIcon);
                }

                //this.helpButtonIcon = document.createElement("button");
                //this.helpButtonIcon.type = "button";
                //this.helpButtonIcon.className = "close";
                //this.helpButtonIcon.style.display = "inline";
                //this.helpButtonIcon.innerHTML = "<i class='far fa-question-circle'></i>";
                //this.headerDiv.appendChild(this.helpButtonIcon);
                //this.helpButtonIcon.classList.add("hidden");
                //this.helpButtonIcon.style.marginRight = "5px";

                this.titleH4 = document.createElement("h4");
                this.titleH4.className = "modal-title";
                this.headerDiv.appendChild(this.titleH4);

                this.bodyDiv = document.createElement("div");
                this.bodyDiv.classList.add("modal-body");
                this.contentDiv.appendChild(this.bodyDiv);

                this.footerDiv = document.createElement("div");
                this.footerDiv.classList.add("modal-footer");
                this.contentDiv.appendChild(this.footerDiv);

                this.contentDiv.style.borderRadius = "0";

                $(this.outerDiv).on("hidden.bs.modal", function () {
                    self.Close();
                });
            }

            public SetHelpFunction(action: () => void) {

                //this.helpButtonIcon.classList.remove("hidden");
                //this.helpButtonIcon.onclick = () => {
                //    action();
                //}
                //this.HelpFunction = action;
            }

            public AddButton(button: Framework.Form.Button) {
                this.footerDiv.style.display = "block";
                this.footerDiv.appendChild(button.HtmlElement);
            }

            public Transparent() {
                //this.outerDiv.style.background = "transparent";
                this.innerDiv.style.background = "transparent";
                this.contentDiv.style.background = "transparent";
                this.outerDiv.style.border = "0";
                this.innerDiv.style.border = "0";
                this.contentDiv.style.border = "0";
                this.contentDiv.style.boxShadow = "none";
            }

            public Close() {
                $(this.outerDiv).remove();
                $('.modal-backdrop').remove();
                this.IsVisible = false;
                if (this.OnClose) {
                    this.OnClose();
                }
            }

            public SetTitle(title: string) {
                this.titleH4.innerHTML = title;
            }

            public SetHeight(height: number) {
                this.contentDiv.style.height = height + "px";
            }

            public SetWidth(width: number) {
                this.contentDiv.style.width = width + "px";
            }

            public removeFooter() {
                this.footerDiv.style.display = "none";
            }

            public removeHeader() {
                this.headerDiv.style.display = "none";
            }

            public get Content(): HTMLDivElement {
                return this.outerDiv;
            }

            public get Body(): HTMLDivElement {
                return this.bodyDiv;
            }

            public show() {
                $('body').append(this.Content);
                $(this.Content).modal({ backdrop: this.backdrop, keyboard: false });
                this.IsVisible = true;
            }

            public Float(position: string) {
                if (position == "left") {
                    this.innerDiv.style.left = "0";
                    this.outerDiv.classList.add('left');
                }

                if (position == "right") {
                    this.innerDiv.style.right = "0";
                    this.outerDiv.classList.add('right');
                }

                if (position == "top") {
                    this.innerDiv.style.top = "0";
                    this.innerDiv.style.left = "0";
                    this.innerDiv.style.right = "0";
                }

                if (position == "bottom") {
                    this.innerDiv.style.bottom = "0";
                }

                this.innerDiv.style.position = "absolute";

                $(this.Content).modal().draggable({
                    handle: ".modal-header",
                });

            }

            public SetPosition(left: number, top: number) {
                this.innerDiv.style.top = top + "px";
                this.innerDiv.style.left = left + "px";
            }

            public Position(left: number, top: number) {
                this.outerDiv.style.top = top + "px";
                this.outerDiv.style.left = left + "px";
                this.outerDiv.style.position = "absolute";
                this.outerDiv.style.margin = "0";
                this.outerDiv.style.padding = "0";
            }

            //public static HideAll() {
            //    $('.modal').modal('hide');
            //}
        }

        export class CustomModal extends Modal {

            constructor(content: HTMLElement, title: string = undefined, buttons: Form.Button[] = undefined, height: string = undefined, width: string = undefined, canClose: boolean = false, grayBackground: boolean = true, backdrop: boolean = false) {
                super(canClose, [], grayBackground, backdrop);

                if (title) {
                    this.SetTitle(title);
                } else {
                    this.removeHeader();
                }

                if (content) {
                    this.bodyDiv.appendChild(content);
                }

                if (buttons) {
                    buttons.forEach((b) => {
                        this.AddButton(b);
                    });
                } else {
                    this.removeFooter();
                }

                if (width) {
                    this.innerDiv.style.width = width;
                }

                if (height) {
                    this.bodyDiv.style.height = height;
                }

            }

        }

        export class AlertModal extends CustomModal {

            protected onConfirm: Function;
            protected confirmButton: Framework.Form.Button;

            constructor(title: string, content: HTMLElement | string, onConfirm: Function = undefined, confirmText: string = undefined, height: string = undefined, width: string = undefined, canClose: boolean = false, grayBackground: boolean = true, backdrop: boolean = false) {

                super(undefined, title, [], height, width, canClose, grayBackground, backdrop);

                if (content instanceof HTMLElement) {
                    this.bodyDiv.appendChild(content);
                } else {
                    let textDiv = document.createElement("div");
                    textDiv.innerHTML = content;
                    this.bodyDiv.appendChild(textDiv);
                }


                let self = this;

                //let contentDiv = document.createElement("div");

                //let div = document.createElement("div");
                //div.innerHTML = content;
                //contentDiv.appendChild(div);

                //if (additionalContent) {
                //    this.bodyDiv.appendChild(additionalContent);
                //}

                if (confirmText == undefined) {
                    confirmText = Framework.LocalizationManager.Get("OK");
                }

                this.onConfirm = onConfirm;

                this.confirmButton = Framework.Form.Button.Create(() => { return true; }, () => {
                    if (self.onConfirm) {
                        self.onConfirm();
                    }
                    this.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], confirmText);

                this.AddButton(this.confirmButton);

            }

            public get ConfirmButton() {
                return this.confirmButton;
            }

            public Confirm() {
                if (this.confirmButton) {
                    this.confirmButton.Click();
                }
            }

            public AddNumericUpDown(min: number, max: number, val: number, increment: number, onConfirm: (val: number) => void): Framework.Form.InputNumericUpDown {
                let div = document.createElement("div");
                let nud = Framework.Form.InputNumericUpDown.Create(val, min, max, increment, () => { }, true);
                div.appendChild(nud.HtmlElement);
                let self = this;
                this.Body.appendChild(div);
                this.onConfirm = () => {
                    onConfirm(nud.Value);
                    self.Close();
                };
                return nud;

            }

            public AddCheckbox(checkboxText: string, onConfirmIfChecked: Function = undefined, onConfirmIfUnchecked: Function = undefined): HTMLInputElement {

                let div = document.createElement("div");

                let p2 = document.createElement("p");
                let input = document.createElement("input");
                input.type = "checkbox";
                p2.appendChild(input);
                let span = document.createElement("span");
                span.innerText = checkboxText;
                span.style.marginLeft = "5px";
                p2.appendChild(span);
                div.appendChild(p2);

                this.Body.appendChild(div);

                this.onConfirm = () => {
                    if (input.checked == true) {
                        onConfirmIfChecked();
                    } else {
                        onConfirmIfUnchecked();
                    }
                };

                return input;

            }

        }

        export class ConfirmModal extends AlertModal {

            private cancelButton: Framework.Form.Button;

            constructor(title: string, content: HTMLElement | string, onConfirm: Function = undefined, onCancel: Function = undefined, confirmText: string = undefined, cancelText: string = undefined, height: string = undefined, width: string = undefined, canClose: boolean = false, grayBackground: boolean = true, backdrop: boolean = false) {
                super(title, content, onConfirm, confirmText, height, width, canClose, grayBackground, backdrop);

                if (cancelText == undefined) {
                    cancelText = Framework.LocalizationManager.Get("Cancel");
                }

                this.cancelButton = Framework.Form.Button.Create(() => { return true; }, () => {
                    if (onCancel) {
                        onCancel();
                    }
                    this.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], cancelText);

                this.AddButton(this.cancelButton);

            }



            public Cancel() {
                if (this.cancelButton) {
                    this.cancelButton.Click();
                }
            }
        }
    }

    export class PhotoRecorder {

        private liveStream;
        private recorder;
        private videoData;
        private videoElement: HTMLVideoElement;
        private hidden_canvas: HTMLCanvasElement;
        private div: HTMLDivElement;
        private recordDiv: HTMLDivElement;
        private pictureBtn: HTMLButtonElement;

        private facingMode: string;

        public OnSave: (base64: string) => void;

        constructor(pictureBtn, videoElement, facingMode = "environment") {
            try {
                let self = this;

                this.pictureBtn = pictureBtn;
                this.videoElement = videoElement;
                this.facingMode = facingMode;

                if (this.pictureBtn != undefined) {
                    this.pictureBtn.addEventListener('click', function () {
                        self.takeSnapshot();
                    });
                }

                //this.videoElement.addEventListener('click', function () {
                //    self.takeSnapshot();
                //});

                this.videoElement.controls = false;
                this.videoElement.autoplay = true;
                this.videoElement.style.background = "white";

                this.hidden_canvas = document.createElement("canvas");
                this.hidden_canvas.width = 800;
                this.hidden_canvas.height = 800;

                const constraints = {
                    advanced: [{
                        facingMode: facingMode
                    }]
                };


                (<any>navigator).mediaDevices.getUserMedia({
                    //TODO : Video, Audio, Picture
                    audio: false,                    
                    video: constraints
                })
                    .then(function (stream) {
                        
                        self.liveStream = stream;
                        try {
                            self.videoElement.srcObject = stream;
                        } catch (error) {
                            self.videoElement.src = window.URL.createObjectURL(stream);
                        }

                        self.videoElement.muted = true;
                        self.videoElement.play();
                        self.recorder = new MediaRecorder(self.liveStream);
                        self.recorder.addEventListener('dataavailable', (e) =>
                            self.onRecordingReady(e));

                    }).catch(function (err) {

                        alert("a " + err);
                    });
            }
            catch (exception) {
                alert("b " + exception);
            }

        }

        private onRecordingReady(e) {
            // e.data contains a blob representing the recording
            //recorder.stop();           

            let self = this;

            this.videoData = e.data;

            let v: HTMLVideoElement = document.createElement("video");
            v.src = URL.createObjectURL(this.videoData);

            //this.convertControl(v, function (blob, name) {

            //    //if (self.OnSave && (self._OnStopAction == "Save" || self._OnStopAction == "SaveAndUpload")) {
            //    //    self.OnSave(blob, self.extension);
            //    //    //self.StopRecord();
            //    //}

            //    Framework.BlobHelper.BlobToBase64(blob, function (base64) {

            //        self.OnSave(base64);

            //        //self.OnLocalSave(base64, self.extension);

            //        //if (self.OnUpload && (self._OnStopAction == "UploadOnServer" || self._OnStopAction == "SaveAndUpload")) {
            //        //    self.OnUpload(base64, self.extension);
            //        //    //self.StopRecord();
            //        //}
            //    });



            //});           
        }

        //private convertControl(control: HTMLImageElement | HTMLVideoElement, callback: Function) {
        //    let self = this;


        //        //let image: HTMLImageElement = document.createElement("img");

        //        // Get the exact size of the video element.
        //        var width = this.videoElement.videoWidth;
        //        var height = this.videoElement.videoHeight;

        //        // Context object for working with the canvas.
        //        var context = this.hidden_canvas.getContext('2d');

        //        // Set the canvas to the same dimensions as the video.
        //        this.hidden_canvas.width = width;
        //        this.hidden_canvas.height = height;

        //        // Draw a copy of the current frame from the video on the canvas.
        //        context.drawImage(this.videoElement, 0, 0, width, height);

        //        (<any>this.hidden_canvas).toBlob(function (blob) {
        //            callback(blob, "png");
        //        });

        //    //if (self._Type == "VideoRecorder") {
        //    //    callback(this.videoData, this.extension);
        //    //}
        //}

        private takeSnapshot() {

            if (this.videoElement.paused == false) {
                this.videoElement.pause();
            } else {
                this.videoElement.play();
            }

            var width = this.videoElement.videoWidth;
            var height = this.videoElement.videoHeight;

            // Context object for working with the canvas.
            var context = this.hidden_canvas.getContext('2d');

            // Set the canvas to the same dimensions as the video.
            this.hidden_canvas.width = width;
            this.hidden_canvas.height = height;

            // Draw a copy of the current frame from the video on the canvas.
            context.drawImage(this.videoElement, 0, 0, width, height);

            //this.hidden_canvas.getContext('2d').drawImage(this.videoElement, 0, 0, 800, 800);
            var data = this.hidden_canvas.toDataURL('image/png');
            this.OnSave(data);
        }

    }

    export class BaseView {
        protected container: HTMLDivElement; // Container principal de la vue
        private isVisible: boolean = false;
        private isModal: boolean = false;

        get Container(): HTMLDivElement {
            return this.container;
        }

        get IsVisible() {
            return this.isVisible;
        }

        constructor(container: HTMLDivElement, isModal: boolean = false) {
            this.container = container;
            this.isModal = isModal;
        }

        public Hide(): void {
            if (this.isModal) {
                $(this.container).modal('hide');
            } else {
                this.container.classList.add('hidden');
            }
            this.isVisible = false;
            $(".modal-backdrop").remove();
        }

        public Show(): void {
            let self = this;
            if (this.isModal) {
                setTimeout(() => {
                    $(self.container).modal('show');
                }, 200);
            } else {
                this.container.classList.remove('hidden');
            }
            this.isVisible = true;
        }

        public static Load(htmlFilePath: string, containerId: string, onSuccess: (div: HTMLDivElement) => void): void {

            $.ajax({
                url: htmlFilePath,
                async: false,
                success: function (result) {
                    var div = document.createElement('div');
                    div.innerHTML = result;
                    let id = (<HTMLDivElement>div.firstChild).id;
                    // Si aucun élément avec le même id, ajouter à body  
                    if (containerId != undefined && document.getElementById((<HTMLDivElement>div.firstChild).id) == undefined) {
                        document.getElementById(containerId).appendChild(div.firstChild);
                        // Localisation partielle du document
                        Framework.LocalizationManager.StaticLocalizationManager.Localize('#' + id + ' *');
                        onSuccess(<HTMLDivElement>document.getElementById(id));
                    } else {
                        Framework.LocalizationManager.StaticLocalizationManager.Localize($('*', div));
                        onSuccess(div);
                    }

                },
                error: function (error) {
                    let e = error;
                }
            });
        }
    }

    export class LocalizationManager {
        private resources = [];
        private displayLanguage: string = "en";
        private static staticLocalizationManager: LocalizationManager;

        public static get StaticLocalizationManager(): LocalizationManager {
            if (LocalizationManager.staticLocalizationManager == undefined) {
                return new LocalizationManager();
            }
            return LocalizationManager.staticLocalizationManager;
        }

        public static LoadResources(jsonRessourcePaths: string[], language: string, callback: Function) {
            if (jsonRessourcePaths.length == 0) {
                callback();
                return;
            };

            if (LocalizationManager.staticLocalizationManager == undefined) {
                LocalizationManager.staticLocalizationManager = new LocalizationManager();
            }
            LocalizationManager.staticLocalizationManager.AddResourcesFromJson(jsonRessourcePaths, () => {
                LocalizationManager.staticLocalizationManager.SetDisplayLanguage(language);
                callback();
            });
        }

        public static Get(key: string, lang: string = undefined): string {
            return (LocalizationManager.StaticLocalizationManager.Get(key, lang));
        }

        public static SetDisplayLanguage(lang: string): void {
            return (LocalizationManager.StaticLocalizationManager.SetDisplayLanguage(lang));
        }

        public static GetDisplayLanguage(): string {
            return (LocalizationManager.StaticLocalizationManager.displayLanguage);
        }

        public static AcceptedLanguages: KeyValuePair[] = [
            { Key: "English", Value: "en" },
            { Key: "Français", Value: "fr" }
        ];

        public SetDisplayLanguage(lang: string): void {
            // Langues acceptées
            var acceptedLanguages = { "en": "english", "fr": "français" };

            if (lang in acceptedLanguages) {
                this.displayLanguage = lang;
            } else {
                this.displayLanguage = 'en';
            }

            this.Localize();
        }

        public Localize(selector: any = '*'): void {
            let self = this;

            // Localisation des textes
            var localizedElements = $(selector).filter(function () {
                return $(this).attr("data-localize") !== undefined;
            });

            localizedElements.each(function () {
                $(this).text(self.Get($(this).attr("data-localize")));
            });


            // Mise en place des tooltips et localisation
            var localizedTooltips = $(selector).filter(function () {
                return $(this).attr("data-localize-tooltip") !== undefined;
            });
            localizedTooltips.each(function () {
                setTimeout(() => {
                    try {
                        $(this).tooltipster({}).tooltipster('destroy');
                        $(this)
                            .tooltipster({})
                            .tooltipster('content', self.Get($(this).attr("data-localize-tooltip")));
                    } catch { }
                }, 1);
            });

            // Mise en place des placeholdes et localisation
            var localizedPlaceholders = $(selector).filter(function () {
                return $(this).attr("data-localize-placeholder") !== undefined;
            });
            localizedPlaceholders.each(function () {
                $(this).attr("placeholder", self.Get($(this).attr("data-localize-placeholder")));
            });
        }

        public AddResourcesFromJson(jsonFilePath: string[], success: Function): void {
            let self = this;
            let cnt: number = 0;
            let nbIter: number = jsonFilePath.length;
            jsonFilePath.forEach((x) => {
                $.getJSON(x, function (data) {
                    self.resources = self.resources.concat(data);
                    cnt++;
                    if (cnt == nbIter) {
                        success();
                    }
                }).fail(function (e) {
                    console.log("error");
                });
            });
        }

        public Get(key: string, lang: string = undefined): string {
            if (lang == undefined) {
                lang = this.displayLanguage;
            }
            if (this.resources != undefined) {
                let res = this.resources.filter((x) => x.key == key);
                if (res && res.length > 0 && res[0][lang]) {
                    return res[0][lang];
                }
            }
            return key;
        }

        public static Format(key: string, args: string[]): string {
            if (key == undefined) { return }
            let text: string = LocalizationManager.StaticLocalizationManager.Get(key);
            return text.replace(new RegExp("{-?[0-9]+}", "g"), function (item) {
                var intVal = parseInt(item.substring(1, item.length - 1));
                var replace;
                if (intVal >= 0) {
                    replace = args[intVal];
                } else if (intVal === -1) {
                    replace = "{";
                } else if (intVal === -2) {
                    replace = "}";
                } else {
                    replace = "";
                }
                return replace;
            });
        }

    }

    export module VirtualKeyboard {

        // TODO: theme, langue

        export function Enable(cssId: string) {
            $(cssId).keyboard({
                language: "fr",
                layout: 'french-azerty-1'
            });
        }

        export function Disable(cssId: string) {
            if ($(cssId).keyboard({}).getkeyboard()) {
                $(cssId).keyboard({}).getkeyboard().destroy();
            }
        }

    }

    export module Network {

        export function CheckConnectivity(url: string, onChanged: (isOnline: boolean) => void): void {

            //Offline.options = <OfflineOptions>({ checks: { xhr: { url: Framework.RootUrl + '/website/images/favicon.png' } }, reconnect: { initialDelay: 3, delay: 3 } });
            //Offline.on('confirmed-up', function () {
            //    onChanged(true);
            //});
            //Offline.on('up', function () {
            //    onChanged(true);
            //});
            //Offline.on('down', function () {
            //    onChanged(false);
            //});
            //var res: any = Offline.check();
        }



    }

    export module Array {

        export function MultipleSort(array: any[], args: string[]): any[] {
            return array.sort(dynamicSortMultiple(args))
        }

        function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a, b) {
                /* next line works with strings and numbers, 
                 * and you may want to customize it to your needs
                 */
                let result: number = 0;
                if (a[property] == undefined || b[property] == undefined || a[property] == null || b[property] == null) {
                    result = 1;
                } else {
                    result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                }
                return result * sortOrder;
            }
        }


        function dynamicSortMultiple(args: string[]) {
            /*
             * save the arguments object as it will be overwritten
             * note that arguments object is an array-like object
             * consisting of the names of the properties to sort by
             */
            var props = args;
            return function (obj1, obj2) {
                var i = 0, result = 0, numberOfProperties = props.length;
                /* try getting a different result from 0 (equal)
                 * as long as we have extra properties to compare
                 */
                while (result === 0 && i < numberOfProperties) {
                    result = dynamicSort(props[i])(obj1, obj2);
                    i++;
                }
                return result;
            }
        }

        export function Shuffle(array: any[]) {
            var i = 0
                , j = 0
                , temp = null

            for (i = array.length - 1; i > 0; i -= 1) {
                j = Math.floor(Math.random() * (i + 1))
                temp = array[i]
                array[i] = array[j]
                array[j] = temp
            }

            return array;
        }

        export function SortBy(array: any[], by: string, mode="asc"): any[] {
            let sortedArray = array.sort((a, b) => {
                if (mode == "asc") {
                    if (a[by] - b[by] > 0) { return 1; }
                    if (a[by] - b[by] < 0) { return -1; }
                }
                if (mode == "desc") {
                    if (b[by] - a[by] > 0) { return 1; }
                    if (b[by] - a[by] < 0) { return -1; }
                }
            });
            return sortedArray;
        }

        export function Unique(array: any[]): any[] {
            return array.reduce(function (accum, current) {
                if (accum.indexOf(current) < 0) {
                    accum.push(current);
                }
                return accum;
            }, []);
        }

        export function Intercept(a: any[], b: any[]) {
            //TODO : test
            var t;
            if (b.length > a.length) t = b, b = a, a = t;
            return a.filter(function (e) {
                return b.indexOf(e) > -1;
            });
        }

        export function Merge(a: any[], b: any[]): any[] {
            return a.concat(b);
        }

        export function Difference(a: any[], b: any[]) {
            return a.filter(function (i) { return b.indexOf(i) < 0; });
        }

        export function Remove(array: any[], item: any) {
            var index = array.indexOf(item);
            if (index >= 0) {
                array.splice(index, 1);
            }
        }

        export function Toggle(array: any[], item: any) {
            if (array.indexOf(item) > -1) {
                Framework.Array.Remove(array, item);
            } else {
                array.push(item);
            }
        }

        export function Frequency(array: any[]): Framework.Dictionary.Dictionary {
            let res = new Dictionary.Dictionary();
            array.forEach((x) => {

                let entry = res.Get(x);

                if (entry == undefined) {
                    res.Add(x, 1);
                } else {
                    res.Add(x, entry + 1);
                }
            });
            return res;
        }

        export function SwapElements(array, x, y) {
            if (array.length === 1) return array;
            array.splice(y, 1, array.splice(x, 1, array[y])[0]);
            return array;
        };

        export function SwapElementsAt(arr, slot1, slot2) {
            var newArr = arr;
            var tempVal = newArr[slot2];
            arr[slot2] = arr[slot1];
            arr[slot1] = tempVal;
            return newArr;
        }

        export function GetAllIndexes(arr, val) {
            var indexes = [], i = -1;
            while ((i = arr.indexOf(val, i + 1)) != -1) {
                indexes.push(i);
            }
            return indexes;
        }

        export function AreEquals(a, b) {
            /*
        Array-aware equality checker:
        Returns whether arguments a and b are == to each other;
        however if they are equal-lengthed arrays, returns whether their 
        elements are pairwise == to each other recursively under this
        definition.
    */

            if (a.length != b.length)  // assert same length
                return false;
            for (var i = 0; i < a.length; i++)  // assert each element equal
                if (!Framework.Array.AreEquals(a[i], b[i]))
                    return false;
            return true;

        }
    }

    export module Scale {
        //export function ScaleDiv(div: HTMLDivElement, parentWidth: number, parentHeight: number): number {

        //    let ratio: number;

        //    //setTimeout(() => {
        //    let actualHeight: number = Number(div.style.height.replace('px', ''));
        //    let actualWidth: number = Number(div.style.width.replace('px', ''));
        //    let widthRatio = parentWidth / actualWidth;
        //    let heightRatio = parentHeight / actualHeight;
        //    ratio = Math.min(widthRatio, heightRatio);
        //    if (Framework.Browser.GetBrowserInfo().Name == "Chrome") {
        //        // Scale arrondi au décimal le plus proche, sinon le rendu est flou dans Chrome
        //        ratio = Framework.Maths.Floor(ratio, 2);
        //    }
        //    div.style.marginTop = (parentHeight - actualHeight) / 2 + "px";
        //    div.style.marginBottom = (parentHeight - actualHeight) / 2 + "px";
        //    div.style.marginLeft = (parentWidth - actualWidth) / 2 + "px";

        //    //if (window.innerHeight < window.innerWidth) {
        //    //    alert("Landscape " + div.style.marginTop + " " + div.style.marginBottom + " " + div.style.marginLeft);
        //    //}


        //    div.style.transform = "scale(" + ratio + ") ";
        //    //}, 100);

        //    return ratio;
        //}

        export function MeasureText(text: string, fontSize: number, fontFamily: string = undefined, fontStyle: string = undefined, fontWeight: string = undefined): any {
            var lDiv = document.createElement('lDiv');

            document.body.appendChild(lDiv);

            lDiv.style.fontSize = fontSize + "px";
            if (fontFamily != undefined) {
                lDiv.style.fontFamily = fontFamily;
            }
            if (fontStyle != undefined) {
                lDiv.style.fontStyle = fontStyle;
            }
            if (fontWeight != undefined) {
                lDiv.style.fontWeight = fontWeight;
            }
            lDiv.style.position = "absolute";
            lDiv.style.left = "-10000px";
            lDiv.style.top = "-10000px";

            lDiv.innerHTML = text;

            var lResult = {
                width: lDiv.clientWidth,
                height: lDiv.clientHeight
            };

            document.body.removeChild(lDiv);
            lDiv = null;

            return lResult;
        }
    }

    export module Sound {
        export function PlaySound(mp3File: string): void {
            var audio: HTMLAudioElement;
            audio = new Audio('../sounds/' + mp3File);
            var playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Automatic playback started!
                    // Show playing UI.
                })
                    .catch(error => {
                        // Auto-play was prevented
                        // Show paused UI.
                    });
            }
        }

        //TODO : mp3 ?
        //TOFIX
        export function PlayB64Sound(b64sound: string): void {
            var audio: HTMLAudioElement;
            audio = new Audio("data:audio/wav;base64," + b64sound);
            var playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Automatic playback started!
                    // Show playing UI.
                })
                    .catch(error => {
                        // Auto-play was prevented
                        // Show paused UI.
                    });
            }
        }
    }

    export module Dictionary {

        export class Dictionary {
            public Entries: DictionaryEntry[];

            constructor() {
                this.Entries = [];
            }

            public Add(key: string, val: any) {
                let items = this.Entries.filter((x) => { return x.Key == key; });
                if (items.length > 0) {
                    items[0].Val = val;
                } else {
                    this.Entries.push({ Key: key, Val: val });
                }
            }

            public Remove(key: string, val: any) {
                let items = this.Entries.filter((x) => { return x.Key == key; });
                if (items.length == 0) {
                    throw new Error('Key does not exist');
                } else {
                    this.Entries.slice(this.Entries.indexOf({ Key: key, Val: val }), 1);
                }
            }

            public Get(key) {
                let items = this.Entries.filter((x) => { return x.Key == key; });
                if (items.length == 0) {
                    return undefined;
                } else {
                    return items[0].Val;
                }
            }

        }

        export class DictionaryEntry {
            public Key: string;
            public Val: any;
        }

    }

    export module Slider {

        export class Slider {

            public static Convert(val: number, oldMin: number, oldMax: number, newMin: number, newMax: number): number {
                let oldRange = oldMax - oldMin;
                let newRange = newMax - newMin;
                let newValue = (((val - oldMin) * newRange) / oldRange) + newMin;
                return newValue;
            }

            public static Create(name: string, min: number, max: number, value: number, onChange: (name: string, score: number) => void): HTMLDivElement {

                let div = document.createElement("div");
                div.classList.add("frameworkSliderContainer");

                let input = document.createElement("input");
                if (value != undefined) {
                    input.className = "frameworkSlider";
                    input.value = Slider.Convert(value, min, max, 0, 100).toString();
                } else {
                    input.className = "frameworkSliderHide";
                }
                input.type = "range";
                input.min = "0";
                input.max = "100";

                input.id = name;

                input.oninput = () => {
                    input.className = "frameworkSlider";
                    let val: number = Number(input.value);
                    let score = Slider.Convert(val, 0, 100, min, max);
                    onChange(name, score);
                }

                div.appendChild(input);

                return div;
            }
        }

        //export class SliderLabel {
        //    public Value: number;
        //    public Label: string;
        //    public Placement: string;
        //    public TooltipImage: string;
        //    public FontSize: number = 20;
        //    public Margin: number = 12;
        //    public Color: string = "darkblue";
        //    public Visibility: boolean = true;
        //    public FontFamily: string;

        //    constructor(value: number, label: string = "") {
        //        this.Value = value;
        //        this.Label = label;
        //        this.Placement = "Top";
        //        this.TooltipImage = "";
        //        this.FontSize = 20;
        //        this.Margin = 10;
        //        this.Color = "darkblue";
        //        this.Visibility = true
        //    }
        //}

        //export class Slider {
        //    private orientation: string;
        //    //public TickVisibility: string;
        //    private height: number;
        //    private width: number;
        //    private  maximum: number;
        //    private  minimum: number;
        //    //public DelayThumbVisibility: number;
        //    //public Precision: number;
        //    //public CursorColor: string = "blue";
        //    private cursorOpacity: number = 0;
        //    private score: number = undefined;
        //    //public OnClick: Function;

        //    private barHeight: number;

        //    //public ListControlLabels: ControlLabel[];

        //    //public OnTickLabelChanged: (value: number, htmlContent: string) => void;

        //    private slider: HTMLDivElement;

        //    public static Create(orientation: string, height: number, width: number, barHeight: number, minimum: number, maximum: number, precision: number, background: string, borderThickness: number, borderBrush: string, cursorColor: string, listControlLabels: SliderLabel[], onClick: (slider:Slider, x: number) => void): Slider {

        //        var timeOut;

        //        var slider = document.createElement("div");
        //        if (orientation == "Horizontal") {
        //            slider.style.top = ((height - barHeight) / 2) + "px";
        //        }

        //        var direction: string = 'ltr';
        //        if (orientation == "Vertical") {
        //            direction = 'rtl';
        //        }

        //        noUiSlider.create(slider, {
        //            start: 0,
        //            range: {
        //                'min': minimum,
        //                'max': maximum
        //            },
        //            step: precision,
        //            animate: true,
        //            orientation: orientation.toLowerCase(),
        //            direction: direction
        //        });

        //        var sl: any = slider;

        //        let customSlider: Slider = new Slider();
        //        customSlider.slider = sl;
        //        customSlider.orientation = orientation;
        //        customSlider.width = width;
        //        customSlider.height = height;
        //        customSlider.minimum = minimum;
        //        customSlider.maximum = maximum;
        //        customSlider.barHeight = barHeight;

        //        var f = function () {
        //            clearTimeout(timeOut);
        //            customSlider.cursorOpacity = 1;
        //            $(slider).find(".noUi-handle").show();

        //            // Masquer le curseur
        //            //if (customSlider.DelayThumbVisibility > 0) {
        //            //timeOut = setTimeout(function () {
        //            //    customSlider.cursorOpacity = 0;
        //            //    $(slider).find(".noUi-handle").hide();
        //            //}, customSlider.DelayThumbVisibility);
        //            //}

        //            $(slider).find(".noUi-handle").show();

        //            customSlider.score = Number(sl.noUiSlider.get());

        //            onClick(customSlider, customSlider.score);

        //        }

        //        sl.noUiSlider.on('set', function () {
        //            f();
        //        });

        //        sl.noUiSlider.on('change', function () {
        //            f();
        //        });

        //        sl.noUiSlider.on('slide', function () {
        //            // Slide : on force à avoir une différence minimale de 1/100 du range de l'échelle pour enregistrer les données
        //            let oldscore = undefined;
        //            if (customSlider.score != undefined) {
        //                oldscore = customSlider.score;
        //            }
        //            if (oldscore == undefined) {
        //                oldscore = 0;
        //            }
        //            let newscore = sl.noUiSlider.get();
        //            let diff = (maximum - minimum) / 100;
        //            if (Math.abs(newscore - oldscore) >= diff) {
        //                f();
        //            }
        //        });


        //        //$(slider).addClass('noUi-target-' + this._FriendlyName);


        //        setTimeout(function () {
        //            if (customSlider.score == undefined) {
        //                $(slider).find(".noUi-handle").hide();
        //            }
        //            //$(slider).find(".noUi-handle").addClass('noUi-handle-' + _customSlider._FriendlyName);


        //            if (orientation == "Horizontal") {
        //                $(customSlider.slider).find(".noUi-target").css('width', width + "px");
        //                $(customSlider.slider).find(".noUi-target").css('height', barHeight + "px");
        //                $(customSlider.slider).find(".noUi-target").css('left', "0");
        //                $(customSlider.slider).find(".noUi-handle").css('height', (barHeight + 10) + "px");
        //                $(customSlider.slider).find(".noUi-handle").css('width', '4px');
        //                $(customSlider.slider).find(".noUi-handle").css('left', "-2px");
        //            } else {
        //                $(customSlider.slider).find(".noUi-target").css('width', (barHeight + 10) + "px");
        //                $(customSlider.slider).find(".noUi-target").css('height', height + "px");
        //                $(customSlider.slider).find(".noUi-handle").css('height', '10px');
        //                $(customSlider.slider).find(".noUi-handle").css('width', (barHeight + 10) + "px");
        //                $(customSlider.slider).find(".noUi-handle").css('top', "-5px");
        //            }

        //            $(customSlider.slider).find(".noUi-target").css('background', background);
        //            $(customSlider.slider).find(".noUi-target").css('border', borderThickness + "px solid " + borderBrush);
        //            $(customSlider.slider).find(".noUi-target").css('color', "transparent");
        //            $(customSlider.slider).find(".noUi-target").css('border-radius', "0");
        //            $(customSlider.slider).find(".noUi-target").css('box-shadow', "none");
        //            $(customSlider.slider).find(".noUi-handle").css('background', cursorColor);
        //            $(customSlider.slider).find(".noUi-handle").css('border-radius', "0");
        //            $(customSlider.slider).find(".noUi-handle").css('box-shadow', "none");
        //            $(customSlider.slider).find(".noUi-handle").css('border', '0');

        //        }, 10);

        //        customSlider.setTicks(listControlLabels);

        //        return customSlider;
        //    }

        //    public get Div(): HTMLDivElement {
        //        return this.slider;
        //    }

        //    public SetSelectedValue(score: number) {
        //        var sl: any = this.slider;
        //        sl.noUiSlider.set(score);
        //    }

        //    public GetSelectedValue(): number {
        //        var sl: any = this.slider;
        //        return sl.noUiSlider.get();
        //    }

        //    private setTicks(labels: SliderLabel[]) {

        //        let self = this;

        //        // Ticks
        //        for (var j = 0; j < labels.length; j++) {
        //            var sliderLabel: SliderLabel = labels[j];


        //            // Texte
        //            var txt: string = "";
        //            if (sliderLabel.Label != undefined && sliderLabel.Visibility == true) {
        //                txt = sliderLabel.Label;
        //            }

        //            //if (sliderLabel.FontSize == undefined) {
        //            //    sliderLabel.FontSize = 20;
        //            //}

        //            //if (sliderLabel.Margin == undefined) {
        //            //    sliderLabel.Margin = 10;
        //            //}

        //            var tick: HTMLDivElement = document.createElement("div");
        //            tick.innerHTML = txt;

        //            var measure = Framework.Scale.MeasureText(txt, sliderLabel.FontSize);
        //            var tickWidth: number = measure.width;

        //            sliderLabel.Margin = Number(sliderLabel.Margin);

        //            let left = 0;
        //            let top = 0;

        //            if (this.orientation == "Horizontal") {                        
        //                left = Math.max(0, (this.width) * ((sliderLabel.Value - this.minimum) / (this.maximum - this.minimum)) - 2) - tickWidth / 2;

        //                if (sliderLabel.Placement == "Top") {
        //                    top = -sliderLabel.FontSize - sliderLabel.Margin;
        //                }
        //                if (sliderLabel.Placement == "Bottom") {
        //                    top = sliderLabel.FontSize + sliderLabel.Margin;
        //                }
        //                if (sliderLabel.Placement == "Left") {
        //                    top = 0;
        //                    left = sliderLabel.FontSize - tickWidth - sliderLabel.Margin;
        //                }
        //                if (sliderLabel.Placement == "Right") {
        //                    top = 0;
        //                    left = this.width - sliderLabel.FontSize + sliderLabel.Margin;
        //                }
        //                tick.style.width = tickWidth + "px";
        //                tick.style.height = this.height + "px";
        //                tick.style.textAlign = "center";
        //            }

        //            if (this.orientation == "Vertical") {          
        //                left = 0;
        //                tick.style.textAlign = "center";

        //                if (sliderLabel.Placement == "Top") {
        //                    top = 0;
        //                }
        //                if (sliderLabel.Placement == "Bottom") {
        //                    top = this.height;
        //                }
        //                if (sliderLabel.Placement == "Left") {
        //                    top = this.height * ((sliderLabel.Value - this.minimum) / (this.maximum - this.minimum));
        //                    left = - tickWidth;
        //                }
        //                if (sliderLabel.Placement == "Right") {
        //                    top = this.height * ((sliderLabel.Value - this.minimum) / (this.maximum - this.minimum));
        //                    left = this.barHeight + 10;
        //                }
        //                tick.style.width = this.width + "px";
        //                //tick.style.height = this._FontSize;
        //            }



        //            tick.style.left = left + "px";
        //            tick.style.top = top + "px";

        //            tick.style.fontFamily = sliderLabel.FontFamily;
        //            tick.style.fontSize = sliderLabel.FontSize.toString();
        //            tick.style.color = sliderLabel.Color;
        //            //tick._FontWeight = this._FontWeight;
        //            //tick._FontStyle = this._FontStyle;
        //            //tick._ZIndex = -100;
        //            tick.style.whiteSpace = "nowrap";
        //            tick.style.overflow = "auto";
        //            tick.setAttribute("Value", sliderLabel.Value.toString());

        //            this.slider.appendChild(tick);


        //            // Marque
        //            var tickMark: HTMLDivElement = document.createElement("div");

        //            var offsetTop = (this.height - this.barHeight) / 2;
        //            var offsetLeft = (this.width - this.barHeight) / 2;

        //            if (this.orientation == "Horizontal") {
        //                tickMark.style.height = (this.barHeight + 6)+"px";
        //                tickMark.style.width = "2px";
        //                tickMark.style.left = (Math.max(0, (this.width * 2) * ((sliderLabel.Value - this.minimum) / (this.maximum - this.minimum)) - 2) )+"px";
        //                tickMark.style.top = (-3 + offsetTop)+"px";
        //            }

        //            if (this.orientation == "Vertical") {
        //                tickMark.style.height = "2px";
        //                tickMark.style.width = (this.barHeight + 6)+"px";
        //                tickMark.style.top = (Math.max(0, this.height * ((sliderLabel.Value - this.minimum) / (this.maximum - this.minimum)) - 2))+"px";
        //                tickMark.style.left = (-5 + offsetLeft)+"px";
        //            }


        //            tickMark.style.zIndex = "-1";
        //            tickMark.style.background = sliderLabel.Color;

        //            if (sliderLabel.TooltipImage && sliderLabel.TooltipImage.length > 0) {
        //                let img = document.createElement("img");
        //                img.src = sliderLabel.TooltipImage;
        //                img.height = 100;
        //                Framework.Popup.Create(tickMark, img, "top", "hover");
        //            }

        //            this.slider.appendChild(tickMark);



        //        }
        //    }

        //    public SetProperty(name: string, value: string) {
        //        this.slider.setAttribute(name, value);
        //    }

        //    public GetProperty(name: string) :string{
        //        return (this.slider.getAttribute(name));
        //    }

        //    public Enable(): void {
        //        this.slider.removeAttribute('disabled');
        //        this.slider.style.cursor = "pointer";
        //    }

        //    public Disable(): void {
        //        this.slider.setAttribute('disabled', 'true');
        //        this.slider.style.cursor = "not-allowed";
        //    }
        //}
    }

    //export class Tooltip {

    //    public static OnClick(element: HTMLElement, side = "top") {

    //        setTimeout(() => {
    //            try {
    //                if (element.offsetHeight > 0) {

    //                    $(element)
    //                        //.tooltipster({ 'contentAsHTML': true, 'timer': 3000 })
    //                        //.tooltipster('option', 'side', side)
    //                        //.tooltipster('option', 'theme', 'light')
    //                        .tooltipster('show');

    //                }
    //            } catch { }
    //        }, 200);

    //        //$(element).tooltipster({ trigger: 'click', contentAsHTML:true })
    //        //.tooltipster('option', 'side', side)
    //        //.tooltipster('option', 'theme', 'light')            
    //    }
    //}

    export module Form {

        export class PropertyEditor {

            public Group: string;

            protected div: Framework.Form.TextElement;
            protected span2: HTMLSpanElement;
            protected span3: HTMLSpanElement;
            protected span4: HTMLSpanElement;

            protected visibilityFunction: () => boolean;

            public ValidationResult: string = "";

            public get Editor(): Framework.Form.TextElement {
                return this.div;
            }

            public get SpanWithButton(): HTMLSpanElement {
                return this.span4;
            }

            public Enable() {
                this.div.HtmlElement.style.opacity = "1";
                this.div.HtmlElement.style.pointerEvents = "auto";
            }

            public Disable() {
                this.div.HtmlElement.style.opacity = "0.3";
                this.div.HtmlElement.style.pointerEvents = "none"
            }

            public SetPropertyKeyMaxWidth(width: number) {
                this.span2.style.maxWidth = width + "px";
            }

            constructor(group: string, propertyKey: string, visibilityFunction: () => boolean) {

                let self = this;

                this.Group = group;
                this.visibilityFunction = visibilityFunction;

                this.div = Framework.Form.TextElement.Create("", ["editableProperty"]);
                let tooltip = Framework.LocalizationManager.Get(propertyKey + "Tooltip");
                if (tooltip != propertyKey + "Tooltip") {
                    this.div.HtmlElement.title = tooltip;
                }

                //let span1 = document.createElement("span");
                //span1.classList.add("fas");
                //span1.classList.add("fa-caret-right");
                //span1.classList.add("spanEditablePropertyCaret");
                //this.div.HtmlElement.appendChild(span1);

                this.span2 = document.createElement("span");
                this.span2.classList.add("spanEditablePropertyKey");
                this.div.HtmlElement.appendChild(this.span2);
                this.span2.innerHTML = Framework.LocalizationManager.Get(propertyKey) + ":&nbsp;";
                this.span2.title = Framework.LocalizationManager.Get(propertyKey);
                let div = document.createElement("div");
                div.innerHTML = Framework.LocalizationManager.Get(propertyKey);
                Framework.Popup.Create(this.span2, div, 'bottom');

                this.span3 = document.createElement("span");
                this.span3.classList.add("spanEditablePropertyValue");
                this.div.HtmlElement.appendChild(this.span3);

                this.span4 = document.createElement("span");
                this.span4.classList.add("spanEditablePropertyButton");

                this.div.HtmlElement.appendChild(this.span4);


            }

            public SetLabelForPropertyValue(label: string) {
                this.span3.innerHTML = label;
                this.span3.title = label;
            }

            public OnCheck: () => void = () => { };

            public Check(): string {

                if (this.visibilityFunction() == true) {
                    this.Editor.Show();

                    if (this.ValidationResult.length > 0) {
                        this.span2.classList.add("editableSpanError");
                        this.OnCheck();
                        return (this.ValidationResult + "\n");
                    } else {
                        this.span2.classList.remove("editableSpanError");
                        this.OnCheck();
                        return "";
                    }

                } else {
                    this.Editor.Hide();
                }

            }

            protected checkVisibility() {
                if (this.visibilityFunction() == true) {
                    this.Editor.Show();
                } else {
                    this.Editor.Hide();
                }
            }

            public get IsVisible(): boolean {
                return this.visibilityFunction() == true;
            }

        }

        export class PropertyEditorWithButton extends PropertyEditor {

            public static Render(group: string, propertyKey: string, text: string, onClick: () => void, visibilityFunction: () => boolean = () => { return true; }, iconCss: string = "fas fa-caret-down"): PropertyEditorWithButton {

                let propertyEditor = new PropertyEditorWithButton(group, propertyKey, visibilityFunction);
                propertyEditor.span3.innerHTML = text;
                propertyEditor.span3.title = text;

                let btnEdit = Framework.Form.Button.Create(() => { return true; }, () => {
                    onClick();
                }, '<i class="' + iconCss + '" > </i>', ["btnCircle", "btn24"]);
                propertyEditor.span4.appendChild(btnEdit.HtmlElement);

                propertyEditor.Check();
                return propertyEditor;
            }

        }

        export class PropertyEditorWithTextInput extends PropertyEditor {

            public static Render(group: string, propertyKey: string, propertyValue: string, onChange: (x: string) => void, validator: Framework.Form.Validator.CustomValidator = Framework.Form.Validator.NoValidation(), visibilityFunction: () => boolean = () => { return true; }): PropertyEditorWithTextInput {

                let validate = function () {
                    propertyEditor.ValidationResult = validator.Function(propertyEditor.span3.innerText, validator.Parameters, validator.ErrorMessage);
                    propertyEditor.Check();
                    //if (propertyEditor.ValidationResult == "") {
                    //    btnEdit.HtmlElement.innerHTML = '<i class="fas fa-check-square"></i>';
                    //} else {
                    //    btnEdit.HtmlElement.innerHTML = '<i class="fas fa-square"></i>';
                    //}
                }

                let propertyEditor = new PropertyEditorWithTextInput(group, propertyKey, visibilityFunction);

                propertyEditor.span3.innerHTML = propertyValue;
                propertyEditor.span3.contentEditable = "true";
                propertyEditor.span3.classList.add("editableSpan");
                propertyEditor.span3.onkeyup = () => {
                    validate();
                    if (propertyEditor.ValidationResult == "") {
                        propertyEditor.span3.classList.remove("editableSpanInvalid");
                    } else {
                        propertyEditor.span3.classList.add("editableSpanInvalid");
                    }
                    propertyEditor.span3.title = propertyEditor.ValidationResult;
                    onChange(propertyEditor.span3.innerText);
                };

                let btnEdit = Framework.Form.Button.Create(() => { return true; }, () => {
                    propertyEditor.span3.focus();
                }, '<i class="fas fa-pen"></i>', ["btnCircle", "btn24"]);
                propertyEditor.span4.appendChild(btnEdit.HtmlElement);

                validate();

                return propertyEditor;
            }
        }

        //public static RenderWithConfirmableTextInput(group: string, propertyKey: string, propertyValue: string, onChange: (x: string) => void, validator: Framework.Form.Validator.CustomValidator = Framework.Form.Validator.NoValidation(), visibilityFunction: () => boolean = () => { return true; }): PropertyEditor {

        //    let validate = function () {
        //        propertyEditor.ValidationResult = validator.Function(propertyEditor.span3.innerText, validator.Parameters, validator.ErrorMessage);
        //        propertyEditor.Check();
        //    }

        //    let propertyEditor = new PropertyEditor(group, propertyKey, visibilityFunction);

        //    propertyEditor.span3.innerHTML = propertyValue;
        //    propertyEditor.span3.contentEditable = "true";
        //    propertyEditor.span3.classList.add("editableSpan");
        //    propertyEditor.span3.onkeyup = () => {
        //        validate();
        //        if (propertyEditor.ValidationResult == "") {
        //            propertyEditor.span3.classList.remove("editableSpanInvalid");
        //        } else {
        //            propertyEditor.span3.classList.add("editableSpanInvalid");
        //        }
        //        propertyEditor.span3.title = propertyEditor.ValidationResult;

        //    };

        //    let btnEdit = Framework.Form.Button.Create(() => { return true; }, () => {
        //        onChange(propertyEditor.span3.innerText);
        //    }, '<i class="fas fa-check"></i>', ["btnCircle", "btn24"]);
        //    propertyEditor.span4.appendChild(btnEdit.HtmlElement);

        //    validate();

        //    return propertyEditor;
        //}

        //export class PropertyEditorWithFormPopup extends PropertyEditor {

        //    public static Render(group: string, propertyKey: string, form: HTMLElement, visibilityFunction: () => boolean = () => { return true; }): PropertyEditorWithFormPopup {

        //        let propertyEditor = new PropertyEditorWithFormPopup(group, propertyKey, visibilityFunction);
        //        propertyEditor.span3.innerHTML = Framework.LocalizationManager.Get("ClickToEdit");
        //        propertyEditor.span3.title = Framework.LocalizationManager.Get("ClickToEdit");

        //        let btnEdit = Framework.Form.Button.Create(() => { return true; }, () => {
        //        }, '<i class="fas fa-caret-down"></i>', ["btnCircle", "btn24"]);
        //        propertyEditor.span4.appendChild(btnEdit.HtmlElement);

        //        Framework.Popup.Create(btnEdit.HtmlElement, form);
        //        propertyEditor.Check();

        //        return propertyEditor;
        //    }

        //}

        export class PropertyEditorWithPopup extends PropertyEditor {

            public static Render(group: string, propertyKey: string, propertyValue: string, values: string[], onChange: (x: string, btn: Framework.Form.Button) => void, hidePopupOnClick: boolean = true, validator: Framework.Form.Validator.CustomValidator = Framework.Form.Validator.NoValidation(), visibilityFunction: () => boolean = () => { return true; }): PropertyEditorWithPopup {

                let validate = function () {
                    propertyEditor.ValidationResult = validator.Function(propertyValue, validator.Parameters, validator.ErrorMessage);
                }

                let propertyEditor = new PropertyEditorWithPopup(group, propertyKey, visibilityFunction);
                propertyEditor.span3.innerHTML = Framework.LocalizationManager.Get(propertyValue);
                propertyEditor.span3.title = Framework.LocalizationManager.Get(propertyValue);

                let div: HTMLDivElement = document.createElement("div");
                if (values == undefined) {
                    values = [];
                }
                values.forEach((x) => {
                    let element = Framework.Form.Button.Create(() => { return true; }, (btn) => {
                        propertyValue = btn.CustomAttributes.Get("Key");
                        propertyEditor.span3.innerHTML = Framework.LocalizationManager.Get(propertyValue);
                        propertyEditor.span3.title = Framework.LocalizationManager.Get(propertyValue);
                        validate();
                        onChange(propertyValue, btn);
                        propertyEditor.Check();
                        if (hidePopupOnClick == true) {
                            Framework.Popup.Hide(btnPopUp.HtmlElement);
                        }
                    }, Framework.LocalizationManager.Get(x), ["blockForm", "popupEditableProperty"]);
                    element.HtmlElement.style.whiteSpace = "nowrap";
                    element.HtmlElement.style.maxWidth = "500px";
                    element.HtmlElement.style.textOverflow = "ellipsis";
                    element.CustomAttributes.Add("Key", x);
                    div.appendChild(element.HtmlElement);
                });

                let btnPopUp = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                }, '<i class="fas fa-caret-down"></i>', ["btnCircle", "btn24"]);
                propertyEditor.span4.appendChild(btnPopUp.HtmlElement);

                Framework.Popup.Create(btnPopUp.HtmlElement, div);

                validate();
                propertyEditor.Check();

                return propertyEditor;
            }

            public static RenderWithButtons(group: string, propertyKey: string, propertyValue: string, values: Framework.KeyValuePair[], onChange: (x: string, btn: Framework.Form.Button) => void, hidePopupOnClick: boolean = true, validator: Framework.Form.Validator.CustomValidator = Framework.Form.Validator.NoValidation(), visibilityFunction: () => boolean = () => { return true; }): PropertyEditorWithPopup {

                let validate = function () {
                    propertyEditor.ValidationResult = validator.Function(propertyValue, validator.Parameters, validator.ErrorMessage);
                }

                let propertyEditor = new PropertyEditorWithPopup(group, propertyKey, visibilityFunction);
                propertyEditor.span3.innerHTML = Framework.LocalizationManager.Get(propertyValue);
                propertyEditor.span3.title = Framework.LocalizationManager.Get(propertyValue);

                let div: HTMLDivElement = document.createElement("div");
                values.forEach((x) => {
                    let element = Framework.Form.Button.Create(() => { return true; }, (btn) => {
                        propertyValue = btn.CustomAttributes.Get("Key");
                        propertyEditor.span3.innerHTML = Framework.LocalizationManager.Get(propertyValue);
                        propertyEditor.span3.title = Framework.LocalizationManager.Get(propertyValue);
                        validate();
                        onChange(propertyValue, btn);
                        propertyEditor.Check();
                        if (hidePopupOnClick == true) {
                            Framework.Popup.Hide(btnPopUp.HtmlElement);
                        }
                    }, "", ["blockForm", "popupEditableProperty", x.Value], Framework.LocalizationManager.Get(x.Key));
                    element.HtmlElement.style.whiteSpace = "nowrap";
                    element.HtmlElement.style.maxWidth = "500px";
                    element.HtmlElement.style.textOverflow = "ellipsis";
                    element.CustomAttributes.Add("Key", x.Key);
                    div.appendChild(element.HtmlElement);
                });

                let btnPopUp = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                }, '<i class="fas fa-caret-down"></i>', ["btnCircle", "btn24"]);
                propertyEditor.span4.appendChild(btnPopUp.HtmlElement);

                Framework.Popup.Create(btnPopUp.HtmlElement, div);

                validate();
                propertyEditor.Check();

                return propertyEditor;
            }

        }

        export class PropertyEditorWithColorPopup extends PropertyEditor {
            public static Render(group: string, propertyKey: string, propertyValue: string, onChange: (x: string) => void, visibilityFunction: () => boolean = () => { return true; }): PropertyEditorWithColorPopup {

                //TODO : améliorer rendu, trier couleurs

                let propertyEditor = new PropertyEditorWithColorPopup(group, propertyKey, visibilityFunction);
                propertyEditor.span3.innerHTML = Framework.LocalizationManager.Get(propertyValue);
                propertyEditor.span3.title = Framework.LocalizationManager.Get(propertyValue);

                let div: HTMLDivElement = document.createElement("div");
                div.style.width = "200px";
                //Framework.Color.List.forEach((x) => {
                Framework.Color.BasePalette.forEach((x) => {
                    let element = Framework.Form.Button.Create(() => { return true; }, (btn) => {
                        propertyValue = btn.CustomAttributes.Get("Color");
                        propertyEditor.span3.innerHTML = Framework.LocalizationManager.Get(propertyValue);
                        propertyEditor.span3.title = Framework.LocalizationManager.Get(propertyValue);
                        onChange(propertyValue);
                        propertyEditor.Check();
                        Framework.Popup.Hide(btnPopUp.HtmlElement);
                    }, "", ["blockForm", "popupColorEditableProperty"]);
                    element.HtmlElement.style.background = x.Hex;
                    element.HtmlElement.title = x.Name;
                    element.CustomAttributes.Add("Color", x.Hex);
                    div.appendChild(element.HtmlElement);
                });

                let btnPopUp = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                }, '<i class="fas fa-caret-down"></i>', ["btnCircle", "btn24"]);
                propertyEditor.span4.appendChild(btnPopUp.HtmlElement);

                Framework.Popup.Create(btnPopUp.HtmlElement, div);
                propertyEditor.Check();
                return propertyEditor;
            }
        }

        export class PropertyEditorWithToggle extends PropertyEditor {

            private btnToggle: Framework.Form.Button;

            public get BtnToggle() {
                return this.btnToggle;
            }

            public static Render(group: string, propertyKey: string, propertyValue: boolean, onChange: (x: boolean) => void, visibilityFunction: () => boolean = () => { return true; }): PropertyEditorWithToggle {

                let propertyEditor = new PropertyEditorWithToggle(group, propertyKey, visibilityFunction);
                propertyEditor.span3.innerHTML = Framework.LocalizationManager.Get(propertyValue.toString());
                propertyEditor.span3.title = Framework.LocalizationManager.Get(propertyValue.toString());

                let setIcon = () => {
                    if (propertyValue == true) {
                        propertyEditor.btnToggle.HtmlElement.innerHTML = '<i class="fas fa-check"></i>';
                    } else {
                        propertyEditor.btnToggle.HtmlElement.innerHTML = '<i class="fas fa-check" style="color:white"></i>';
                    }

                };

                propertyEditor.btnToggle = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    propertyValue = !propertyValue;
                    setIcon();
                    propertyEditor.span3.innerHTML = Framework.LocalizationManager.Get(propertyValue.toString());
                    propertyEditor.span3.title = Framework.LocalizationManager.Get(propertyValue.toString());
                    onChange(propertyValue);
                    propertyEditor.Check();
                }, '', ["btnCircle", "btn24"]);
                setIcon();
                propertyEditor.span4.appendChild(propertyEditor.btnToggle.HtmlElement);
                propertyEditor.Check();
                return propertyEditor;
            }

        }

        export class PropertyEditorWithNumericUpDown extends PropertyEditor {

            private btnPlus: Framework.Form.Button;
            private btnMinus: Framework.Form.Button;

            public get BtnPlus() {
                return this.btnPlus;
            }

            public get BtnMinus() {
                return this.btnMinus;
            }

            public static Render(group: string, propertyKey: string, propertyValue: number, min: number, max: number, onChange: (x: number) => void, precision: number = 1, visibilityFunction: () => boolean = () => { return true; }): PropertyEditorWithNumericUpDown {

                let propertyEditor = new PropertyEditorWithNumericUpDown(group, propertyKey, visibilityFunction);

                let onValueChanged = (updateHtml: boolean = true) => {
                    if (propertyValue != undefined) {
                        if (updateHtml == true) {
                            propertyEditor.span3.innerHTML = Framework.Maths.Round(propertyValue, 2).toString();
                        }
                        propertyEditor.span3.title = Framework.Maths.Round(propertyValue, 2).toString();
                        onChange(propertyValue);
                        propertyEditor.btnMinus.CheckState();
                        propertyEditor.btnPlus.CheckState();
                        propertyEditor.Check();
                    }
                };

                propertyEditor.btnPlus = Framework.Form.Button.Create(() => {
                    return propertyValue < max;
                }, () => {
                    if (propertyValue < max) {
                        propertyValue += precision;
                        onValueChanged();
                    }
                }, '<i class="fas fa-plus" ></i>', ["btnCircle", "btn24"]);

                propertyEditor.btnMinus = Framework.Form.Button.Create(() => {
                    return propertyValue > min;
                }, () => {
                    if (propertyValue > min) {
                        propertyValue -= precision;
                        onValueChanged();
                    }
                }, '<i class="fas fa-minus" ></i>', ["btnCircle", "btn24"]);

                if (propertyValue != undefined) {
                    propertyEditor.span3.innerHTML = Framework.Maths.Round(propertyValue, 2).toString();
                    propertyEditor.span3.title = Framework.Maths.Round(propertyValue, 2).toString();
                }

                //onValueChanged();

                //propertyEditor.span3.innerHTML = propertyValue.toString();
                propertyEditor.span3.contentEditable = "true";
                propertyEditor.span3.classList.add("editableSpan");
                propertyEditor.span3.classList.add("numeric");

                //propertyEditor.span3.onkeydown = function (x) {

                //    let ret = false;

                //    if (x.char == "\b" || x.char == "") {
                //        // Suppression
                //        ret = true;
                //    } else {
                //        let res = Number(propertyEditor.span3.innerText + x.char);
                //        if (res /*&& res >= min && res <= max*/) {
                //            ret = true;
                //        }
                //    }


                //    propertyEditor.Check();



                //    return ret;


                //};

                propertyEditor.span3.onkeyup = function () {
                    let res = Number(propertyEditor.span3.innerText);
                    if (res && res >= min && res <= max) {
                        propertyValue = Number(res);
                        onValueChanged(false);
                        propertyEditor.Check();
                    }
                    //validate();
                    //if (propertyEditor.ValidationResult == "") {
                    //    propertyEditor.span3.classList.remove("editableSpanInvalid");
                    //} else {
                    //    propertyEditor.span3.classList.add("editableSpanInvalid");
                    //}
                    //propertyEditor.span3.title = propertyEditor.ValidationResult;
                    //onChange(propertyEditor.span3.innerText);
                };


                propertyEditor.span4.appendChild(propertyEditor.btnPlus.HtmlElement);
                propertyEditor.span4.appendChild(propertyEditor.btnMinus.HtmlElement);
                propertyEditor.Check();

                return propertyEditor;
            }

        }

        export class ControlWithLabel {

            public Element: Framework.Form.TextElement;
            public Label: HTMLLabelElement;
            public Control: Framework.Form.BaseElement;

            constructor(element: Framework.Form.TextElement, label: HTMLLabelElement, control: Framework.Form.BaseElement) {
                this.Element = element;
                this.Label = label;
                this.Control = control;
            }

            public static Render(control: Framework.Form.BaseElement, text: string = undefined, spanCss: string = "", labelCss: string[] = [], tooltip: string = undefined, onClickOnSpan: Function = undefined): ControlWithLabel {

                let div = Framework.Form.TextElement.Create("", ["form-group"]);

                let label = document.createElement("label");
                if (text) {
                    let label = document.createElement("label");
                    label.innerHTML = text;
                    div.HtmlElement.appendChild(label);
                    labelCss.forEach((x) => {
                        label.classList.add(x)
                    });
                }

                let div1 = Framework.Form.TextElement.Create("", ["input-group"]);
                div.Append(div1);

                let div2 = Framework.Form.TextElement.Create("", ["input-group-addon"]);
                div1.Append(div2);

                let span = document.createElement("span");
                if (spanCss.length > 0) {
                    span.classList.add("fas");
                    span.classList.add(spanCss);
                }
                div2.HtmlElement.appendChild(span);
                if (tooltip) {
                    span.title = tooltip;
                }
                if (onClickOnSpan) {
                    span.onclick = () => { onClickOnSpan(); };
                }

                control.HtmlElement.classList.add("form-control");

                div1.Append(control);

                let controlWithLabel = new ControlWithLabel(div, label, control);

                return controlWithLabel;
            }
        }

        export class BaseElement {

            protected htmlElement;

            protected getElementFromId(id: string): HTMLElement {
                let element = document.getElementById(id);

                if (!element) {
                    throw new Error("UNDEFINED_ELEMENT");
                }

                this.htmlElement = element;

                return element;
            }

            public static GetElementFromId(id: string): HTMLElement {
                let element = document.getElementById(id);

                if (!element) {
                    throw new Error("UNDEFINED_ELEMENT");
                }
                return element;
            }

            public SetUniqueId(id: string = undefined): string {
                if (id == undefined) {
                    id = Math.random().toString(36).substr(2, 9);
                }
                this.HtmlElement.id = id;
                return this.HtmlElement.id;
            }

            public get Id(): string {
                return this.HtmlElement.id;
            }

            public Hide() {
                this.HtmlElement.classList.add('hidden');
            };

            public Show() {
                this.HtmlElement.classList.remove('hidden');
            };

            public ToggleVisibility(): void {
                this.HtmlElement.classList.toggle('hidden');
            }

            get HtmlElement(): HTMLElement {
                return this.htmlElement;
            }

            public Highlight(side: string = 'right') {
                let self = this;

                //if ($(self.htmlElement).hasClass("tooltipstered")) {
                //    $(self.htmlElement).tooltipster('destroy')
                //}

                setTimeout(() => {
                    try {
                        if (self.htmlElement.offsetHeight > 0) {
                            $(self.htmlElement)
                                .tooltipster({ 'contentAsHTML': true, 'timer': 3000 })
                                .tooltipster('option', 'side', side)
                                .tooltipster('option', 'theme', 'light')
                                .tooltipster('open');
                        }
                    } catch { }
                }, 200);
            }

            public HighlightOn(message: string, side: string = 'right') {
                let self = this;

                //if ($(self.htmlElement).hasClass("tooltipstered")) {
                //    $(self.htmlElement).tooltipster('destroy')
                //}

                setTimeout(() => {
                    try {
                        if (self.htmlElement.offsetHeight > 0 && message.length > 0) {
                            $(self.htmlElement)
                                .tooltipster({ 'contentAsHTML': true, 'timer': 3000 })
                                .tooltipster('content', message)
                                .tooltipster('option', 'side', side)
                                .tooltipster('option', 'theme', 'light')
                                .tooltipster('open');
                        }
                    } catch { }
                }, 200);
            }

            public HighlightOff() {
                let self = this;

                //if ($(self.htmlElement).hasClass("tooltipstered")) {
                //    $(self.htmlElement).tooltipster('destroy')
                //}

                setTimeout(() => {
                    try {
                        $(self.htmlElement).tooltipster({}).tooltipster('content', null);
                    } catch { }
                }, 200);
            }

            public get IsVisible(): boolean {
                return (this.htmlElement.classList.contains('hidden') == false);
            }

            public Collapsible(triggerId: string) {
                this.HtmlElement.classList.add("collapse");
                this.HtmlElement.setAttribute("data-collapse", triggerId);
            }

            public CustomAttributes: Dictionary.Dictionary = new Dictionary.Dictionary();

        }

        export class TextElement extends BaseElement {
            private htmlDivElement: HTMLDivElement | HTMLSpanElement | HTMLLIElement | HTMLUListElement | HTMLTableCellElement;
            private text: string;

            constructor(id: string, text: string) {
                super();
                if (id) {
                    this.htmlDivElement = this.getElementFromId(id);
                } else {
                    this.htmlDivElement = document.createElement("div");
                }

                if (text) {
                    this.Set(text);
                }
            }

            public static Register(id: string, text: string = undefined): Form.TextElement {
                let elt: Form.TextElement = new Form.TextElement(id, text);
                return elt;
            }

            public static Create(text: string = undefined, css: string[] = []): Form.TextElement {
                let res = new TextElement(undefined, text);
                css.forEach((x) => {
                    res.htmlDivElement.classList.add(x);
                });
                res.SetHtml(text);
                return res;
            }

            public get HtmlElement() {
                return this.htmlDivElement;
            }

            public Set(text: string) {
                this.htmlDivElement.innerText = text;
            }

            public SetHtml(html: string) {
                this.htmlDivElement.innerHTML = html;
            }

            get Text(): string {
                return this.htmlDivElement.innerText;
            }

            public Append(elt: BaseElement) {
                this.htmlDivElement.appendChild(elt.HtmlElement);
            }



        }

        export class RadioElement extends BaseElement {

            private htmlRadioElement: HTMLInputElement;
            private group: RadioGroup;

            constructor(id: string, group: RadioGroup, onClickFunction: () => void) {
                super();

                let self = this;

                if (id) {
                    this.htmlRadioElement = <HTMLInputElement>this.getElementFromId(id);
                    this.htmlRadioElement.type = "radio";
                    this.group = group;
                }

                this.htmlRadioElement.onclick = () => {
                    self.group.Value = self.htmlRadioElement.value;
                    if (onClickFunction) {
                        onClickFunction();
                    }
                }
            }

            public Check() {
                this.htmlRadioElement.checked = true;
                this.group.Value = this.htmlRadioElement.value;
            }

            public static Register(id: string, group: RadioGroup, onClickFunction: () => void = undefined): Form.RadioElement {
                let radio: Form.RadioElement = new Form.RadioElement(id, group, onClickFunction);
                return radio;
            }
        }

        export class RadioGroup {
            private value: string;
            private onChangeFunction: () => void;

            public get Value(): string {
                return this.value;
            }

            public set Value(value: string) {
                this.value = value;
                if (this.onChangeFunction) {
                    this.onChangeFunction();
                }
            }

            public static Register(onChangeFunction: () => void = undefined): Form.RadioGroup {
                let group: Form.RadioGroup = new Form.RadioGroup();
                group.onChangeFunction = onChangeFunction;
                return group;
            }
        }

        export class ClickableElement extends BaseElement {

            private isEnable: boolean = true;
            private checkEnableFunction: () => boolean;
            //protected onClickFunction: (any) => void;

            public get IsEnabled(): boolean {
                return this.isEnable;
            }

            constructor(id: string | HTMLElement, checkEnableFunction: () => boolean, onClickFunction: (event: any, clickableElement: ClickableElement) => void, stopPropagation: boolean = false) {
                super();

                let self = this;

                let elt: HTMLElement;

                if (typeof id == 'string') {
                    elt = this.getElementFromId(id);
                } else if (id instanceof HTMLElement) {
                    elt = id;
                }

                if (elt instanceof HTMLButtonElement) {
                    this.htmlElement = <HTMLButtonElement>elt;
                }
                if (elt instanceof HTMLDivElement) {
                    this.htmlElement = <HTMLDivElement>elt;
                }
                if (elt instanceof HTMLAnchorElement) {
                    this.htmlElement = <HTMLAnchorElement>elt;
                }
                if (elt instanceof HTMLInputElement) {
                    this.htmlElement = <HTMLInputElement>elt;
                }

                this.checkEnableFunction = checkEnableFunction;
                //this.onClickFunction = onClickFunction;

                this.htmlElement.onclick = (e) => {
                    if (onClickFunction) {
                        onClickFunction(e, this);
                        if (stopPropagation) {
                            e.stopPropagation();
                        }
                    }
                    //if (self.OnClicked) {
                    //    self.OnClicked(self);
                    //}
                };
                this.CheckState();
            }

            public SetCheckEnableFunction(checkEnableFunction: () => boolean) {
                this.checkEnableFunction = checkEnableFunction;
            }

            public static Register(id: string, checkEnableFunction: () => boolean = () => { return true; }, onClickFunction: (any) => void, title: string = ""): Form.ClickableElement {
                let button: Form.ClickableElement = new Form.ClickableElement(id, checkEnableFunction, onClickFunction);
                if (title.length > 0) {
                    button.htmlElement.title = title;
                }
                return button;
            }

            public CheckState() {
                if (this.checkEnableFunction) {
                    this.isEnable = this.checkEnableFunction();
                    if (this.isEnable == true) {
                        this.Enable();
                    } else {
                        this.Disable();
                    }
                }
            }

            public Click() {
                this.htmlElement.click();
            }

            public DelayedClick(delay: number = 100) {

                let self = this;

                let f = function (delay: number, callback: Function) {
                    self.Click();
                    setTimeout(() => callback(), delay);
                }

                return new Promise((resolve, reject) => {
                    f(delay, () => {
                        resolve();
                    });
                });
            }

            public Disable() {
                this.isEnable = false;
                if (this.htmlElement instanceof HTMLButtonElement) {
                    this.htmlElement.disabled = true;
                }
                if (this.htmlElement instanceof HTMLDivElement) {
                    this.htmlElement.classList.add("disabled");
                }
                if (this.htmlElement instanceof HTMLAnchorElement) {
                    this.htmlElement.classList.add("disabled");
                    this.htmlElement.style.pointerEvents = "none";
                    this.htmlElement.style.cursor = "not-allowed";
                }
            }

            public Enable() {
                this.isEnable = true;
                if (this.htmlElement instanceof HTMLButtonElement) {
                    this.htmlElement.disabled = false;
                }
                if (this.htmlElement instanceof HTMLDivElement) {
                    this.htmlElement.classList.remove("disabled");
                    this.htmlElement.classList.remove("disabledDiv");
                }
                if (this.htmlElement instanceof HTMLAnchorElement) {
                    this.htmlElement.classList.remove("disabled");
                    this.htmlElement.style.pointerEvents = "auto";
                    this.htmlElement.style.cursor = "pointer";
                    if (this.htmlElement.parentElement) {
                        this.htmlElement.parentElement.style.cursor = "pointer";
                    }
                }
            }

            public Tooltip(content: any, position: string = "top") {
                try {
                    $(this.htmlElement).tooltipster({
                        trigger: 'click',
                        interactive: true,
                        position: position,
                        content: $(content)
                    });
                } catch { }
            }

            public SetInnerHTML(html: string) {
                this.htmlElement.innerHTML = html;
            }

            //public OnClicked: (clickableElement: ClickableElement) => void;

        }

        export class Button extends ClickableElement {

            public static Register(id: string, checkEnableFunction: () => boolean = () => { return true; }, onClickFunction: (any) => void, title: string = ""): Form.Button {
                let button: Form.Button = new Form.Button(id, checkEnableFunction, onClickFunction);
                if (title.length > 0) {
                    button.htmlElement.title = title;
                }
                return button;
            }

            public static DisableDuring(button: Button, time: number) {
                let self = this;
                button.Disable();
                setTimeout(() => { button.Enable(); }, time * 1000);
            }

            public static ShowAfter(button: Button, time: number) {
                let self = this;
                button.Hide();
                setTimeout(() => { button.Show(); }, time * 1000);
            }

            public static Create(checkEnableFunction: () => boolean = () => { return true; }, onClickFunction: (btn: Button) => void = undefined, text: string, css: string[], title: string = ""): Button {

                let button: HTMLButtonElement = document.createElement("button");
                button.type = "button";
                button.innerHTML = text;
                css.forEach((x) => {
                    if (x != "") {
                        button.classList.add(x);
                    }
                });

                let ce: Button = new Button(button, checkEnableFunction, (e) => {
                    e.stopPropagation();
                    onClickFunction(ce);
                });

                ce.htmlElement = button;

                if (title) {
                    button.title = title;
                }

                return ce;
            }

        }

        export class PopupColorpickerButton extends ClickableElement {

            // Bouton qui affiche un ColorPicker sous forme de tooltip. 
            // Si text est défini, le texte est affiché à gauche (libellé + valeur) et un bouton colorpicker à droite

            //public static Render(checkEnableFunction: () => boolean, onClickFunction: (color: Framework.Color) => void, css: string[], title: string, color: Framework.Color = undefined, text: Function = undefined): PopupColorpickerButton {
            public static Render(checkEnableFunction: () => boolean, onClickFunction: (color: string) => void, css: string[], title: string, color: string = undefined, text: Function = undefined): PopupColorpickerButton {
                let button: HTMLElement;
                let span1 = document.createElement("span");
                let colorPickerIcon = document.createElement("span");
                let tooltipsteredElement;

                if (text != undefined) {
                    // Bouton avec texte
                    button = document.createElement("div");
                    button.style.display = "flex";
                    button.style.flexDirection = "row";
                    span1.style.flex = "1";
                    button.appendChild(span1);
                    span1.innerHTML = text();
                    colorPickerIcon.classList.add("colorPickerButton");
                    button.appendChild(colorPickerIcon);
                    tooltipsteredElement = colorPickerIcon;

                } else {
                    // Bouton sans texte
                    button = document.createElement("button");
                    (<HTMLButtonElement>button).type = "button";
                    tooltipsteredElement = button;
                }

                css.forEach((x) => { button.classList.add(x); });

                if (title) {
                    button.title = title;
                }

                let parentDiv = document.createElement("div");

                let div: HTMLDivElement = document.createElement("div");
                div.style.height = "auto";
                div.style.width = "auto";

                (<any>$(div)).colorPalette()
                    .on('selectColor', function (e) {
                        //let col: Color = Color.ColorFromString(e.color, false);
                        let col: Color = e.color;
                        input.Set(e.color);
                    });

                parentDiv.appendChild(div);

                //let input: Framework.Form.InputText = Framework.Form.InputText.Create(Color.RgbToHex(color), (x) => {
                let input: Framework.Form.InputText = Framework.Form.InputText.Create(color, (x) => {

                    //TODO : améliorer
                    if (Framework.Color.IsColor(x)) {
                        //let col: Color = Color.ColorFromString(x, false);
                        let col: string = x;
                        onClickFunction(col);
                        if (text != undefined) {
                            span1.innerHTML = text();
                        }
                        try {
                            $(tooltipsteredElement).tooltipster('hide');
                        } catch { }
                    }
                }, Validator.NoValidation(), false);
                input.HtmlElement.style.lineHeight = "1";
                input.HtmlElement.style.height = "18px";
                input.HtmlElement.style.marginTop = "10px";
                input.HtmlElement.style.width = "144px";
                input.HtmlElement.style.color = "black";

                //TODO : proposer dropdown avec couleur web à la place de input

                parentDiv.appendChild(input.HtmlElement);

                //TODO : faire apparaitre tooltip au bon endroit

                try {
                    $(tooltipsteredElement).tooltipster({
                        trigger: 'click',
                        interactive: true,
                        content: $(parentDiv)
                    });
                } catch { }

                let tbutton = new PopupColorpickerButton(button, checkEnableFunction, () => {

                }, true);
                return tbutton;
            }
        }

        export class PopupButton extends ClickableElement {

            public HideContent() {
                try {
                    $(this.htmlElement).tooltipster('hide');
                } catch { }
            }

            // Bouton qui affiche un ColorPicker sous forme de tooltip. 
            // Si text est défini, le texte est affiché à gauche (libellé + valeur) et un bouton à droite
            public static Render(checkEnableFunction: () => boolean, css: string[], title: string, items: HTMLElement[], position: string = 'top', text: Function = undefined, hideOnClick: boolean = true): PopupButton {
                let button: HTMLElement;
                let span1 = document.createElement("span");
                let popupIcon = document.createElement("span");
                let tooltipsteredElement;

                if (text != undefined) {
                    // Bouton avec texte
                    button = document.createElement("div");
                    button.style.display = "flex";
                    button.style.flexDirection = "row";
                    span1.style.flex = "1";
                    button.appendChild(span1);
                    span1.innerHTML = text();
                    popupIcon.classList.add("popupButton");
                    button.appendChild(popupIcon);
                    tooltipsteredElement = popupIcon;

                } else {
                    // Bouton sans texte
                    button = document.createElement("button");
                    (<HTMLButtonElement>button).type = "button";
                    tooltipsteredElement = button;
                }

                css.forEach((x) => { button.classList.add(x); });

                if (title) {
                    button.title = title;
                }

                let div: HTMLDivElement = document.createElement("div");
                items.forEach((item) => {
                    div.appendChild(item);
                    if (hideOnClick == true) {
                        item.addEventListener("click", () => {
                            try {
                                $(button).tooltipster('hide');
                            } catch { }
                        }, false);
                    }
                });

                $(button).tooltipster({
                    trigger: 'click',
                    interactive: true,
                    animation: 'grow',
                    autoClose: false,
                    multiple: true,
                    position: position,
                    content: $(div),
                });

                let tbutton = new PopupButton(button, checkEnableFunction, () => { });
                return tbutton;
            }

        }

        export class PopupButtonPanel extends ClickableElement {

            // Bouton qui affiche un ColorPicker sous forme de tooltip. 
            // Si text est défini, le texte est affiché à gauche (libellé + valeur) et un bouton à droite
            public static Render(checkEnableFunction: () => boolean, css: string[], title: string, div: HTMLDivElement, position: string = 'top', text: Function = undefined): PopupButton {
                let button: HTMLElement;
                let span1 = document.createElement("span");
                let popupIcon = document.createElement("span");
                let tooltipsteredElement;

                if (text != undefined) {
                    // Bouton avec texte
                    button = document.createElement("div");
                    button.style.display = "flex";
                    button.style.flexDirection = "row";
                    span1.style.flex = "1";
                    button.appendChild(span1);
                    span1.innerHTML = text();
                    popupIcon.classList.add("popupButton");
                    button.appendChild(popupIcon);
                    tooltipsteredElement = popupIcon;

                } else {
                    // Bouton sans texte
                    button = document.createElement("button");
                    (<HTMLButtonElement>button).type = "button";
                    tooltipsteredElement = button;
                }

                css.forEach((x) => { button.classList.add(x); });

                if (title) {
                    button.title = title;
                }

                try {
                    $(button).tooltipster({
                        trigger: 'click',
                        interactive: true,
                        animation: 'grow',
                        autoClose: false,
                        multiple: true,
                        position: position,
                        content: $(div),
                    });
                } catch { }

                let tbutton = new PopupButton(button, checkEnableFunction, () => { });

                return tbutton;
            }

        }

        export class CollapseButton extends ClickableElement {

            private span: HTMLSpanElement;
            private chevron: HTMLElement;
            private button: HTMLElement;
            private id: string;
            private closedCss: string;
            private openedCss: string;

            constructor(id: string | HTMLElement, checkEnableFunction: () => boolean, onClickFunction: (any) => void = undefined) {
                super(id, checkEnableFunction, onClickFunction);
            }

            // Affiche/masque tous les éléments qui ont l'attribut data-collapse=id
            public static Register(id: string, checkEnableFunction: () => boolean = () => { return true; }, onClickFunction: (any) => void = undefined, title: string = undefined): CollapseButton {
                let ce: CollapseButton = new CollapseButton(id, checkEnableFunction, (e) => {
                    e.stopPropagation();
                    $("*[data-collapse='" + id + "']").collapse('toggle');
                });
                //ce.HtmlElement.title = title;
                return ce;
            }

            public static Create(id: string, checkEnableFunction: () => boolean = () => { return true; }, onClickFunction: (any) => void = undefined, text: string, css: string[], openedCss: string = "fa-chevron-up", closedCss = "fa-chevron-down"): CollapseButton {

                //TODO : remplacer opened closedcss par class opened et :before

                let button: HTMLDivElement = document.createElement("div");
                //button.type = "button";
                button.id = id;
                css.forEach((x) => {
                    button.classList.add(x);
                });
                button.style.display = "flex";
                button.style.flexDirection = "row";

                let span = document.createElement("span");
                span.innerHTML = text;
                span.style.flex = "1";

                let chevron = document.createElement("i");
                chevron.classList.add("fas");
                chevron.classList.add(closedCss);

                button.appendChild(span);
                button.appendChild(chevron);

                let ce: CollapseButton = new CollapseButton(button, checkEnableFunction, (e) => {
                    e.stopPropagation();
                    ce.ToggleCollapse();
                });

                ce.span = span;
                ce.chevron = chevron;
                ce.button = button;
                ce.id = id;
                ce.openedCss = openedCss;
                ce.closedCss = closedCss;

                return ce;
            }

            public ToggleCollapse() {
                $("*[data-collapse='" + this.id + "']").collapse('toggle');
                if (this.chevron.classList.contains(this.closedCss)) {
                    this.chevron.classList.remove(this.closedCss);
                    this.chevron.classList.add(this.openedCss);
                } else {
                    this.chevron.classList.add(this.closedCss);
                    this.chevron.classList.remove(this.openedCss);
                }
            }

            public get HtmlElement() {
                return this.button;
            }

            public SetText(text: string) {
                this.span.innerHTML = text;
            }
        }

        export class Accordion extends BaseElement {
            private containerDiv: HTMLDivElement;
            private headerDiv: HTMLDivElement;
            private contentDiv: HTMLDivElement;
            private chevronSpan: HTMLSpanElement;
            private isOpened: boolean;

            public static Create(text: string = undefined, css: string[] = [], isOpened: boolean = true, chevronPosition: string = "left"): Form.Accordion {

                let accordion = new Accordion();

                accordion.containerDiv = document.createElement("div");
                accordion.containerDiv.style.cursor = "pointer";

                accordion.isOpened = isOpened;

                accordion.headerDiv = document.createElement("div");
                css.forEach((x) => {
                    accordion.headerDiv.classList.add(x);
                });
                accordion.headerDiv.style.display = "flex";
                accordion.headerDiv.style.flexDirection = "row";

                accordion.chevronSpan = document.createElement("span");
                accordion.chevronSpan.style.flex = "0 0 0";
                accordion.chevronSpan.style.width = "20px";
                accordion.chevronSpan.classList.add("accordion");

                if (chevronPosition == "left") {
                    accordion.headerDiv.appendChild(accordion.chevronSpan);
                }

                let span2 = document.createElement("span");
                span2.innerHTML = text;
                accordion.headerDiv.appendChild(span2);
                span2.style.flex = "1 0 0";

                if (chevronPosition == "right") {
                    accordion.headerDiv.appendChild(accordion.chevronSpan);
                }

                accordion.headerDiv.onclick = () => {
                    accordion.contentDiv.classList.toggle("hidden");
                    accordion.chevronSpan.classList.toggle("opened");
                    accordion.isOpened = !accordion.isOpened;
                }

                accordion.containerDiv.appendChild(accordion.headerDiv);

                accordion.contentDiv = document.createElement("div");
                accordion.containerDiv.appendChild(accordion.contentDiv);
                if (isOpened == true) {
                    accordion.chevronSpan.classList.add("opened");
                } else {
                    accordion.contentDiv.classList.add("hidden");
                }

                return accordion;
            }

            public Append(htmlElement: HTMLElement) {
                this.contentDiv.appendChild(htmlElement);
            }

            public get HtmlElement() {
                return this.containerDiv;
            }

            public AddRightContent(div: HTMLDivElement) {
                div.style.marginLeft = "auto";
                div.style.paddingLeft = "30px";
                this.headerDiv.appendChild(div);
            }

        }

        export class CheckBox extends ClickableElement {
            public get IsChecked(): boolean {
                if (this.inputElement) {
                    return (<HTMLInputElement>this.inputElement).checked;
                }
                return false;
            }

            private inputElement: HTMLInputElement;

            public Check() {
                if (this.inputElement) {
                    this.inputElement.checked = true;
                }
            }

            public Uncheck() {
                if (this.inputElement) {
                    this.inputElement.checked = false;
                }
            }

            public static Register(id: string, checkEnableFunction: () => boolean = () => { return true; }, onClickFunction: (event: any, cb: CheckBox) => void, title: string): CheckBox {
                let cb: CheckBox = new CheckBox(id, checkEnableFunction, onClickFunction);
                cb.htmlElement.title = title;
                cb.inputElement = cb.htmlElement;
                cb.Uncheck();
                return cb;
            }

            public static Create(checkEnableFunction: () => boolean = () => { return true; }, onClickFunction: (event: any, cb: CheckBox) => void, text: string, title: string, isChecked: boolean = false, css: string[] = []): CheckBox {

                let div: HTMLDivElement = document.createElement("div");

                let input = document.createElement("input");
                input.type = "checkbox";
                if (isChecked) {
                    input.checked = true;
                }
                div.appendChild(input);

                let span = document.createElement("span");
                span.style.marginLeft = "10px";
                span.innerText = text;
                div.appendChild(span);

                div.classList.add("checkboxDiv");

                css.forEach((x) => {
                    div.classList.add(x);
                });

                let cb: CheckBox = new CheckBox(div, checkEnableFunction, onClickFunction);
                cb.htmlElement.title = title;
                cb.inputElement = input;
                return cb;
            }

            public Value: any;

            public Enable() {
                if (this.inputElement) {
                    this.inputElement.disabled = false;
                }
            }

            public Disable() {
                if (this.inputElement) {
                    this.inputElement.disabled = true;
                }
            }

            //public OnClicked: (cb: CheckBox) => void;

        }

        export class ValidableElement extends BaseElement {
            protected value: any = '';
            protected isValid: boolean = false;
            protected isEnable: boolean = true;
            protected validator: Validator.CustomValidator;
            protected cssValidity: boolean = true;
            protected onChangeFunction: (newValue: string, sender: any) => void;

            get ValidationMessage(): string {
                return this.htmlElement.validationMessage
            }

            public Invalidate(validationMessage: string) {
                if (validationMessage.length == 0) {
                    return;
                }

                this.htmlElement.classList.add('invalid');
                this.htmlElement.classList.remove('valid');

                let self = this;

                setTimeout(() => {
                    try {
                        if (self.htmlElement.offsetHeight > 0) {
                            $(self.htmlElement)
                                .tooltipster({})
                                .tooltipster('content', validationMessage)
                                .tooltipster('open');
                        }
                    } catch { }
                }, 200);



            }

            protected setCssValidity(highlight: boolean = true) {
                // Modèle de validation bootstrap 3 : style sur div parente
                if (this.htmlElement && this.htmlElement.parentElement && this.htmlElement.validationMessage && this.htmlElement.validationMessage.length > 0) {
                    this.htmlElement.parentElement.classList.add("has-error");
                    this.htmlElement.parentElement.classList.remove("has-success");

                    this.htmlElement.classList.add('invalid');
                    this.htmlElement.classList.remove('valid');

                    if (highlight == true) {
                        this.HighlightOn(this.htmlElement.validationMessage, "top");
                    }
                }
                else {
                    if (this.htmlElement.parentElement) {
                        this.htmlElement.parentElement.classList.remove("has-error");
                        this.htmlElement.parentElement.classList.add("has-success");
                    }

                    this.htmlElement.classList.add('valid');
                    this.htmlElement.classList.remove('invalid');

                    this.HighlightOff();
                }
            }

            get Value(): any {
                return this.value;
            }

            get IsValid(): boolean {
                return this.isValid;
            }

            protected validate(showTooltip: boolean = true) {

                let self = this;

                if (this instanceof Select && (this.Value == "" || this.Value == "-")) {
                    showTooltip = false;
                }

                this.isValid = true;
                let validationMsg: string = "";

                if (this.validator) {
                    validationMsg += this.validator.Function(self.value, this.validator.Parameters, this.validator.ErrorMessage);
                }
                if (this.htmlElement && this.htmlElement.setCustomValidity) {
                    this.htmlElement.setCustomValidity(validationMsg);
                }
                if (validationMsg.length > 0) {
                    this.isValid = false;
                }
                if (this.cssValidity) {
                    this.setCssValidity(showTooltip);
                }
            }

            public Set(value: any) {
                this.value = value;
                this.validate();

                if (this.onChangeFunction) {
                    this.onChangeFunction(value, this);
                }
            }

            public Enable() {
                this.htmlElement.disabled = false;
            }

            public Disable() {
                this.htmlElement.disabled = true;
            }
        }

        export class Select extends Form.ValidableElement {

            private htmlSelectElement: HTMLSelectElement;
            public Binding: Binding;

            public get HtmlSelectElement(): HTMLSelectElement {
                return this.htmlSelectElement;
            }

            constructor(htmlSelectElement: HTMLSelectElement, value: any, values: KeyValuePair[], validator: Validator.CustomValidator, onChangeFunction: (newValue: any, select: Select) => void, cssValidity: boolean, authorizedEmptyValue: boolean) {
                super();
                let self = this;
                this.htmlSelectElement = htmlSelectElement;
                this.htmlElement = htmlSelectElement;

                this.onChangeFunction = onChangeFunction;
                this.validator = validator;
                this.cssValidity = cssValidity;


                this.value = value;
                this.htmlSelectElement.value = this.value;
                this.validate(false);

                this.htmlSelectElement.onclick = (e) => {
                    e.stopPropagation();
                }

                this.htmlSelectElement.onchange = () => {
                    self.value = self.htmlSelectElement.value;
                    self.validate();
                    if (self.onChangeFunction) {
                        self.onChangeFunction(this.htmlSelectElement.value, this);
                    }
                }

                this.SetValues(values, authorizedEmptyValue);
            }

            public Set(value: any) {
                this.htmlSelectElement.value = value;
                $(this.htmlSelectElement).trigger("onchange");
            }

            public SetValues(values: KeyValuePair[], authorizedEmptyValue: boolean = true) {

                let self = this;

                this.htmlSelectElement.innerHTML = "";

                // Si selected value pas dans liste
                let v = values.filter((x) => { return x.Value == self.value; })
                if (values.filter((x) => { return x.Value == self.value; }).length == 0 && authorizedEmptyValue == true) {
                    let option: HTMLOptionElement = document.createElement("option");
                    option.text = "";
                    option.value = "";
                    option.selected = true;

                    this.htmlSelectElement.appendChild(option);
                }

                values.forEach((kvp) => {
                    let option: HTMLOptionElement = document.createElement("option");
                    option.text = LocalizationManager.Get(kvp.Key);
                    option.setAttribute("data-localize", kvp.Key);
                    option.value = kvp.Value;
                    if (option.value == self.value) {
                        option.selected = true;
                    }
                    this.htmlSelectElement.appendChild(option);
                });
            }

            public StyleOptions(values: KeyValuePair[]) {
                let self = this;
                for (var i = 0; i < this.htmlSelectElement.options.length; i++) {
                    let kvps = values.filter((x) => { return x.Key == self.htmlSelectElement.options[i].value });
                    if (kvps.length > 0) {
                        self.htmlSelectElement.options[i].style[kvps[0].Value["StyleName"]] = kvps[0].Value["StyleValue"];
                    }
                }
            }

            public static Register(id: string, value: any, values: KeyValuePair[], validator: Validator.CustomValidator = Validator.NotEmpty("NotEmpty"), onChangeFunction: (newValue: any) => void = undefined, cssValidity: boolean = true, authorizedEmptyValue: boolean = true): Select {

                let selectElement: HTMLSelectElement;

                if (id) {
                    let elt = BaseElement.GetElementFromId(id);
                    if (elt instanceof HTMLSelectElement) {
                        selectElement = <HTMLSelectElement>elt;
                    }
                }

                let select: Form.Select = new Form.Select(selectElement, value, values, validator, onChangeFunction, cssValidity, authorizedEmptyValue);
                return select;
            }

            public static Render(value: any, values: KeyValuePair[], validator: Validator.CustomValidator, onChangeFunction: (newValue: any, elt: Select) => void, cssValidity: boolean, css: string[] = [], binding: Binding = undefined, authorizedEmptyValue: boolean = true): Select {
                let select: HTMLSelectElement = document.createElement("select");
                css.forEach((x) => {
                    select.classList.add(x);
                });
                //select.id = GetUniqueId();

                //select.classList.add("form-control");
                //select.classList.add("input-sm");

                let slct: Select = new Select(select, value, values, validator, onChangeFunction, cssValidity, authorizedEmptyValue);
                slct.SetUniqueId();

                if (binding) {
                    slct.htmlSelectElement.onchange = () => {
                        binding.Object[binding.Property] = slct.htmlSelectElement.value;
                        slct.validate();
                        if (slct.onChangeFunction) {
                            slct.onChangeFunction(slct.htmlSelectElement.value, slct);
                        }
                    }
                    slct.Binding = binding;
                }

                return slct;
            }

            public static RenderWithLabel(label: string, value: any, values: KeyValuePair[], validator: Validator.CustomValidator, onChangeFunction: (newValue: any, elt: Select) => void, cssValidity: boolean, css: string[] = [], binding: Binding = undefined, authorizedEmptyValue: boolean = true): TextElement {
                let select: Framework.Form.Select = Framework.Form.Select.Render(value, values, validator, onChangeFunction, cssValidity, ["form-control"], binding, authorizedEmptyValue);
                let text: Framework.Form.TextElement = Framework.Form.TextElement.Create(label);
                let div: Framework.Form.TextElement = Framework.Form.TextElement.Create("", css);
                div.Append(text);
                div.Append(select);

                if (binding) {
                    select.htmlSelectElement.onchange = () => {
                        binding.Object[binding.Property] = select.htmlSelectElement.value;
                        select.validate();
                        if (select.onChangeFunction) {
                            select.onChangeFunction(select.htmlSelectElement.value, select);
                        }
                    }
                    select.Binding = binding;
                }

                return div;
            }

            public static RenderMultipleWithLabel(label: string, selectedValues: string[], values: KeyValuePair[], validator: Validator.CustomValidator, onChangeFunction: (newValue: any, elt: Select) => void, cssValidity: boolean, css: string[] = [], binding: Binding = undefined, multiple: boolean = true, authorizedEmptyValue: boolean = false): TextElement {
                let select: Framework.Form.Select = Framework.Form.Select.Render(selectedValues[0], values, validator, undefined, cssValidity, [], binding, authorizedEmptyValue);
                let text: Framework.Form.TextElement = Framework.Form.TextElement.Create(label);
                let div: Framework.Form.TextElement = Framework.Form.TextElement.Create("", css);
                div.Append(text);
                div.Append(select);

                if (binding) {
                    select.Binding = binding;
                }

                select.htmlSelectElement.multiple = multiple;

                let f = function (control) {
                    var selected = control.$select.val();
                    if (binding) {
                        binding.Object[binding.Property] = selected;
                    }

                    select.isValid = true;
                    control.$button[0].classList.remove("redborder");

                    if (validator) {
                        let msg = validator.Function(selected, validator.Parameters, validator.ErrorMessage);
                        if (msg.length > 0) {
                            select.isValid = false;
                            control.$button[0].classList.add("redborder");
                        }
                    }

                    if (onChangeFunction) {
                        onChangeFunction(selected, select);
                    }

                    //if (select.onChangeFunction) {
                    //    select.onChangeFunction(selected, select);
                    //}
                }

                $(select.htmlSelectElement).multiselect({
                    buttonWidth: '400px',
                    onChange: function (element, checked) {
                        //var selected = this.$select.val();
                        //if (binding) {
                        //    binding.Object[binding.Property] = selected;                            
                        //}

                        //if (validator) {
                        //    let msg = validator.Function(selected, validator.Parameters, validator.ErrorMessage);
                        //}

                        ////select.validate();    //TODO                        
                        //if (select.onChangeFunction) {
                        //    select.onChangeFunction(selected, select);
                        //}
                        f(this)
                    },
                    allSelectedText: Framework.LocalizationManager.Get('AllSelected'),
                    nSelectedText: Framework.LocalizationManager.Get('Selected'),
                    nonSelectedText: Framework.LocalizationManager.Get('NoneSelected'),
                    numberDisplayed: 6,
                    includeSelectAllOption: true,
                    selectAllText: Framework.LocalizationManager.Get('CheckAll'),
                    onSelectAll: function () {
                        f(this)
                    },
                    onDeselectAll: function () {
                        f(this)
                    }
                });
                //$(".caret").css('float', 'right');
                //$(".caret").css('margin', '8px 0');
                $(select.htmlSelectElement).multiselect('select', selectedValues);

                //TODO : onchange, selectedvalues

                return div;
            }

        }

        export class Binding {
            public Object: object;
            public Property: string
        }

        //export class InputTextWithButton extends ValidableElement {

        //    public Container: TextElement;
        //    public InputText: InputText;
        //    public Button: Button;

        //    public static Create(val: any, onChange: (newValue: any, sender: InputText) => void, validator: Validator.CustomValidator = undefined): InputTextWithButton {

        //        let control = new InputTextWithButton();

        //        control.Container = TextElement.Create("");
        //        control.InputText = InputText.Create(val, () => {
        //            control.Button.Show();
        //        }, validator, false, []);
        //        control.Button = Button.Create(() => {
        //            return control.InputText.IsValid == true;
        //        }, () => {
        //            onChange(control.InputText.Value, control.InputText);
        //            }, "", [], "");
        //        control.Button.Hide();

        //        control.Container.Append(control.InputText);
        //        control.Container.Append(control.Button);


        //        return control;
        //    }

        //}

        export class InputText extends ValidableElement {

            private htmlInputElement: HTMLInputElement | HTMLTextAreaElement;

            public RemoveSpecialCharacters: boolean = false;

            public SetPlaceHolder(text: string) {
                this.htmlInputElement.placeholder = text;
            }

            constructor(htmlInputElement: HTMLInputElement | HTMLTextAreaElement, value: string, validator: Validator.CustomValidator, onChangeFunction: (newValue: any, sender: InputText) => void, cssValidity: boolean, css: string[] = []) {
                super();
                let self = this;

                this.htmlInputElement = htmlInputElement;
                this.htmlElement = htmlInputElement;

                css.forEach((x) => {
                    this.htmlInputElement.classList.add(x);
                });

                this.onChangeFunction = onChangeFunction;
                this.validator = validator;
                this.cssValidity = cssValidity;
                this.value = value;
                this.htmlInputElement.value = this.value;
                this.validate(false);

                this.htmlInputElement.onclick = (e) => {
                    e.stopPropagation();
                }

                // Changement dans DOM -> changement dans objet
                this.htmlInputElement.oninput = (e) => {
                    if (self.RemoveSpecialCharacters == true) {
                        self.htmlInputElement.value = Framework.Form.Validator.RemoveSpecialCharacters(self.htmlInputElement.value);
                    }
                    self.value = self.htmlInputElement.value;
                    self.validate();
                    if (self.onChangeFunction) {
                        self.onChangeFunction(this.htmlInputElement.value, self);
                    }
                }

            }

            public static Register(id: string, value: string, validator: Validator.CustomValidator = undefined, onChangeFunction: (newValue: any) => void = undefined, cssValidity: boolean = true): InputText {

                let inputElement: HTMLInputElement | HTMLTextAreaElement;

                if (id) {
                    let elt = BaseElement.GetElementFromId(id);
                    if (elt instanceof HTMLInputElement) {
                        inputElement = <HTMLInputElement>elt;
                    }
                    if (elt instanceof HTMLTextAreaElement) {
                        inputElement = <HTMLTextAreaElement>elt;
                    }
                }

                let input: Form.InputText = new Form.InputText(inputElement, value, validator, onChangeFunction, cssValidity);
                return input;
            }

            public Set(value: any) {
                this.htmlInputElement.value = value;
                if (value && value.length > 0) {
                    $(this.htmlInputElement).trigger("oninput");
                } else {
                    this.value = value;
                    this.validate(false);
                    if (this.onChangeFunction) {
                        this.onChangeFunction(value, this);
                    }
                }
            }

            public SetWithoutValidation(value: any) {
                this.htmlInputElement.value = value;
            }

            public static Create(val: any, onChange: (newValue: any, sender: InputText) => void, validator: Validator.CustomValidator = undefined, cssValidity: boolean = true, css: string[] = []): InputText {
                let input: HTMLInputElement = document.createElement("input");
                input.type = "text";
                //input.id = GetUniqueId();                
                let inputText: InputText = new InputText(input, val, validator, onChange, cssValidity, css);
                inputText.SetUniqueId();

                return inputText;
            }

            public static CreateWithLabel(label: string, val: any, onChange: (newValue: any, sender: InputText) => void, validator: Validator.CustomValidator = undefined, cssValidity: boolean = true, css: string[] = []) {
                let input: Framework.Form.InputText = Framework.Form.InputText.Create(val, onChange, validator, cssValidity, css);
                let text: Framework.Form.TextElement = Framework.Form.TextElement.Create(label);
                let div: Framework.Form.TextElement = Framework.Form.TextElement.Create("", css);
                div.Append(text);
                div.Append(input);
                return div;
            }

            public ReadOnly() {
                this.htmlInputElement.readOnly = true;
            }

            public Select() {
                this.htmlInputElement.setSelectionRange(0, this.htmlInputElement.value.length)
            }
        }

        export class InputFile extends Form.ValidableElement {

            private htmlInputElement: HTMLInputElement;

            constructor(id: HTMLInputElement, onChangeFunction: (newValue: any) => void, cssValidity: boolean) {
                super();
                let self = this;

                this.htmlInputElement = id;

                this.onChangeFunction = onChangeFunction;
                this.cssValidity = cssValidity;

                this.htmlInputElement.addEventListener('change', () => {
                    onChangeFunction(this.htmlInputElement.files[0]);
                }, false);

                //this.htmlInputElement.oninput = () => {
                //    self.Set(this.htmlInputElement.value);
                //}
            }

            public get HtmlElement() {
                return this.htmlInputElement;
            }

            public static Register(id: string, onChangeFunction: (newValue: any) => void = undefined, cssValidity: boolean = true): InputFile {

                let inputElement: HTMLInputElement;

                if (id) {
                    let elt = BaseElement.GetElementFromId(id);
                    if (elt instanceof HTMLInputElement) {
                        inputElement = <HTMLInputElement>elt;
                    }
                }

                let input: Form.InputFile = new Form.InputFile(inputElement, onChangeFunction, cssValidity);
                return input;
            }

            public static Create(accept: string, onChangeFunction: (newValue: any) => void = undefined, cssValidity: boolean = true): InputFile {
                let i = document.createElement("input");
                i.type = "file";
                i.accept = accept;

                let input: Form.InputFile = new Form.InputFile(i, onChangeFunction, cssValidity);
                return input;
            }

            public Click() {
                this.htmlInputElement.click();
            }

        }

        export class InputNumericUpDown extends Form.ValidableElement {

            private buttonDown: HTMLButtonElement;
            private buttonUp: HTMLButtonElement;
            private input: HTMLInputElement;

            public get ButtonDown() {
                return this.buttonDown;
            }

            public get ButtonUp() {
                return this.buttonUp;
            }

            public get Input() {
                return this.input;
            }

            public get Value(): number {
                return Number(this.input.value);
            }

            constructor(min: number, max: number, precision: number, value: number, validator: Validator.CustomValidator, onChangeFunction: (newValue: any) => void, cssValidity: boolean, showInput: boolean = true) {
                super();
                let self = this;

                this.htmlElement = document.createElement("div");
                //(<HTMLDivElement>this.htmlElement).id = Form.GetUniqueId();
                (<HTMLDivElement>this.htmlElement).style.display = "flex";
                (<HTMLDivElement>this.htmlElement).style.flexDirection = "row";

                this.buttonDown = document.createElement("button");
                this.buttonDown.type = "button";

                this.buttonDown.textContent = "-";
                (<HTMLDivElement>this.htmlElement).appendChild(this.buttonDown);

                this.input = document.createElement("input");
                if (showInput == true) {
                    this.input.type = "text";

                    this.input.value = value.toString();

                    this.input.style.flex = "1";
                    this.input.style.textAlign = "center";
                    this.input.onchange = (e) => {
                        let current: number = Number(self.input.value);
                        if (current <= max && current >= min) {
                            onChangeFunction(current);
                        }
                    };
                    (<HTMLDivElement>this.htmlElement).appendChild(this.input);
                }

                this.buttonUp = document.createElement("button");
                this.buttonUp.type = "button";
                this.buttonUp.textContent = "+";
                (<HTMLDivElement>this.htmlElement).appendChild(this.buttonUp);

                this.buttonUp.onclick = (e) => {
                    let current: number = Number(self.input.value);
                    if (current < max) {
                        current += precision;
                        self.input.value = current.toString();
                        onChangeFunction(current);
                    }
                    e.stopPropagation();
                }

                this.buttonDown.onclick = (e) => {
                    let current: number = Number(self.input.value);
                    if (current > min) {
                        current -= precision;
                        self.input.value = current.toString();
                        onChangeFunction(current);
                    }
                    e.stopPropagation();
                }

                this.onChangeFunction = onChangeFunction;
                this.validator = validator;
                this.cssValidity = cssValidity;
            }

            public static Create(val: number, min: number, max: number, precision: number, onChange: (newValue: number) => void, showInput: boolean = true): InputNumericUpDown {

                let inputNumericUpDown = new InputNumericUpDown(min, max, precision, val, undefined, onChange, true, showInput);
                return inputNumericUpDown;
            }

            public static Register(inputId: string, btnIncreaseId: string, btnDecreaseId: string, val: number, min: number, max: number, precision: number, onChange: (newValue: number) => void): InputNumericUpDown {

                //TODO : améliorer ça (doublon avec Render)

                let inup = new InputNumericUpDown(min, max, precision, val, undefined, onChange, true);

                inup.input = <HTMLInputElement>document.getElementById(inputId);
                inup.buttonUp = <HTMLButtonElement>document.getElementById(btnIncreaseId);
                inup.buttonDown = <HTMLButtonElement>document.getElementById(btnDecreaseId);

                inup.input.onchange = (e) => {
                    let current: number = Number(inup.input.value);
                    if (current <= max && current >= min) {
                        onChange(current);
                    }
                };

                inup.buttonUp.onclick = (e) => {
                    let current: number = Number(inup.input.value);
                    if (current < max) {
                        current += precision;
                        inup.input.value = current.toString();
                        onChange(current);
                    }
                }

                inup.buttonDown.onclick = (e) => {
                    let current: number = Number(inup.input.value);
                    if (current > min) {
                        current -= precision;
                        inup.input.value = current.toString();
                        onChange(current);
                    }
                }

                //TODO : css validity

                return undefined;
            }

            public static Render(val: number, min: number, max: number, precision: number, onChange: (newValue: number) => void, showInput: boolean = true): HTMLDivElement {

                let inputNumericUpDown = new InputNumericUpDown(min, max, precision, val, undefined, onChange, true, showInput);
                return inputNumericUpDown.htmlElement;
            }
        }

        export class ModalDatePicker {

            public static Render(elt: HTMLElement, date: Date, onChange: (date: Date) => void) {

                let newDate = date;

                let setDayForm = () => {
                    let d = new Date(newDate.getFullYear(), newDate.getMonth(), 0);
                    let max = d.getDate();
                    let dayForm = Framework.Form.PropertyEditorWithNumericUpDown.Render("", "Day", newDate.getDate(), 1, max, (x) => {
                        newDate = new Date(newDate.getFullYear(), newDate.getMonth(), x);
                    }, 1);
                    divDay.innerHTML = "";
                    divDay.appendChild(dayForm.Editor.HtmlElement);
                }

                let div: HTMLDivElement = document.createElement("div");

                let divDay = document.createElement("div");
                div.appendChild(divDay);
                setDayForm();

                let monthForm = Framework.Form.PropertyEditorWithNumericUpDown.Render("", "Month", date.getMonth() + 1, 1, 12, (x) => {
                    newDate = new Date(newDate.getFullYear(), x, newDate.getDate());
                    setDayForm();
                }, 1);
                div.appendChild(monthForm.Editor.HtmlElement);

                let yearForm = Framework.Form.PropertyEditorWithNumericUpDown.Render("", "Year", date.getFullYear(), 1900, 2050, (x) => {
                    newDate = new Date(x, newDate.getMonth(), newDate.getDate());
                    setDayForm();
                }, 1);
                div.appendChild(yearForm.Editor.HtmlElement);
                let modal = Modal.Custom(div, undefined, undefined, undefined, "300px", false, false, true);
                modal.Float('');

                let rect = elt.getBoundingClientRect();

                modal.SetPosition(rect.left, rect.top);
                modal.OnClose = () => { onChange(newDate); };
            }
        }

        export class DatePicker extends Form.ValidableElement {

            //TODO : format

            private htmlInputElement: HTMLInputElement;

            constructor(id: string, value: any, validator: Validator.CustomValidator, onChangeFunction: (newValue: any) => void, css: string[], cssValidity: boolean) {
                super();
                let self = this;

                if (id) {
                    this.htmlInputElement = <HTMLInputElement>this.getElementFromId(id);
                } else {
                    this.htmlInputElement = document.createElement("input");
                    this.htmlInputElement.type = "text";
                }

                css.forEach((x) => {
                    self.htmlInputElement.classList.add(x);
                });

                this.onChangeFunction = onChangeFunction;
                this.validator = validator;
                this.cssValidity = cssValidity;

                $(this.htmlInputElement).datepicker();

                self.Set(value);


                this.htmlInputElement.onclick = () => {

                    document.getElementById('ui-datepicker-div').style.zIndex = "100000";

                }

                this.htmlInputElement.onchange = () => {
                    self.Set(this.htmlInputElement.value);
                }
            }

            public static Register(id: string, value: any, validator: Validator.CustomValidator = undefined, onChangeFunction: (newValue: any) => void = undefined, css: string[], cssValidity: boolean = true): DatePicker {
                let input: Form.DatePicker = new Form.DatePicker(id, value, validator, onChangeFunction, css, cssValidity);
                return input;
            }

            public Set(value: any) {
                this.htmlInputElement.value = (new Date(value)).toLocaleDateString();
                super.Set(value);
            }

        }

        export module Validator {

            //private setRegExpFromMask() {
            //    let pattern = "";
            //    //TODO : Framework.Form.Validator.
            //    switch (this._Mask) {
            //        case "NumberBetween1And20":
            //            pattern = "^1?[1-9]$|^[1-2]0$";
            //            break;
            //        case "DecimalBetween0And10":
            //            pattern = "(^(?:\\d|[0-9]|1[0])$)|(^[0-9]([\\.\\,][0-9]{1,3})?$)";
            //            break;
            //        case "PhoneNumber":

            //            pattern = "(^(\\+?\\-? *[0-9]+)([,0-9 ]*)([0-9 ])*$)|(^ *$)";
            //            break;
            //    }
            //    if (this._Mask != "") {
            //        this.pattern = new RegExp(this._Mask.replace("\\", "\\\\") + "@");
            //    } else {
            //        this.pattern = null;
            //    }

            //    //new PairedString(LocalizedString.GetString("None"), ""),


            //    //    new PairedString(LocalizedString.GetString("Mask3"), "(^(\\+?\\-? *[0-9]+)([,0-9 ]*)([0-9 ])*$)|(^ *$)"), //Numéro de téléphone
            //    //    new PairedString(LocalizedString.GetString("Mask4"), "^\\d{1,5}(\\.\\d{1,2})?$"), // Décimal 5 + 2
            //    //    new PairedString(LocalizedString.GetString("Mask5"), "^([0-5]?\\d?\\d?\\d?\\d|6[0-4]\\d\\d\\d|65[0-4]\\d\\d|655[0-2]\\d|6553[0-5])$"), // Entier 0 à 65365
            //    //    new PairedString(LocalizedString.GetString("Mask6"), "^-?[0-9]{0,2}(\\.[0-9]{1,2})?$|^-?(100)(\\.[0]{1,2})?$"), // Pourcentage
            //    //    new PairedString(LocalizedString.GetString("Mask7"), "^([0-9a-zA-Z]([-.\\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9})$"), // Email
            //    //    new PairedString(LocalizedString.GetString("Mask8"), "^(http|https|ftp)\\://[a-zA-Z0-9\\-\\.]+\\.[a-zA-Z]{2,3}(:[a-zA-Z0-9]*)?/?([a-zA-Z0-9\\-\\._\\?\\,\\'/\\\\+&amp;%\\$#\\=~])*[^\\.\\,\\)\\(\\s]$"),
            //    //    new PairedString(LocalizedString.GetString("Mask9"), "(?n:^(?=\\d)((?<month>(0?[13578])|1[02]|(0?[469]|11)(?!.31)|0?2(?(.29)(?=.29.((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|(16|[2468][048]|[3579][26])00))|(?!.3[01])))(?<sep>[-./])(?<day>0?[1-9]|"),
            //    //    //new PairedString("Date jj/mm/aaaa","/^\\d{1,2}\\/\\d{1,2}\\/\\d{4}$/"),
            //    //    new PairedString(LocalizedString.GetString("Mask10"), "^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\\d\\d$"),
            //    //    new PairedString(LocalizedString.GetString("Mask11"), "^(([0-9])|([0-1][0-9])|([2][0-3])):(([0-9])|([0-5][0-9]))$"),
            //    //    new PairedString(LocalizedString.GetString("Mask12"), "/^0[1-9]|[1-8][0-9]|9[0-8]|2A|2B[0-9]{3}$/"),
            //    //    new PairedString(LocalizedString.GetString("Mask13"), "/^\\d+(\\.(\\d{3}))?€?$/"),
            //    //    new PairedString(LocalizedString.GetString("Mask14"), "/^\\$?\\d+(\\.(\\d{2}))?$/"),
            //    //    new PairedString(LocalizedString.GetString("Mask15"), "/^.{3,}$/"),
            //    //    new PairedString(LocalizedString.GetString("Mask16"), "/^(arbre|feuille|fleur){1}$/"),
            //    //    new PairedString(LocalizedString.GetString("Mask17"), "/^(arbre|feuille|fleur){1}$/i"),
            //}

            export function RemoveSpecialCharacters(text: string): string {
                return text.replace(/[^a-z0-9_]/gi, '_');
            }

            export class CustomValidator {
                public Function: (value: any, parameters: any, errorMessage: string) => string;
                public Parameters: any;
                public ErrorMessage: string;
            }

            export function Custom(f: (value: any, parameters: any, errorMessage: string) => string, parameters: any = undefined, errorMessage: string = undefined): CustomValidator {
                let res = new CustomValidator();
                res.Function = f;
                res.Parameters = parameters;
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function HasMinLength(text: string, minLength: number, errorMessage: string = "MinLength"): string {
                let isValid: boolean = text != undefined && text.length >= minLength;
                if (isValid == false) {
                    return LocalizationManager.Format(errorMessage, [minLength.toString()])
                }
                return "";
            }

            export function MinLength(minLength: number = 0, errorMessage: string = "MinLength"): CustomValidator {
                let res = new CustomValidator();

                let f = function (text: string, parameters: any, errorMessage): string {
                    let minLength = parameters["minLength"];
                    return HasMinLength(text, minLength, errorMessage);
                }

                res.Function = f;
                res.Parameters = { "minLength": minLength };
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function CodePostal(errorMessage: string = "ZipCode"): CustomValidator {
                let res = new CustomValidator();

                let f = function (text: string, parameters: any, errorMessage): string {
                    if (text.length == 5 && Number(text) > 0) {
                        return "";
                    } else {
                        return errorMessage;
                    }
                }

                res.Function = f;
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function FrenchDate(maxYear, errorMessage: string = "InvalidDate"): CustomValidator {
                let res = new CustomValidator();

                let f = function (text: string, parameters: any, errorMessage): string {
                    let tab = text.split("/");

                    if (Number(tab[2]) > maxYear) {
                        return errorMessage;
                    }

                    if (tab.length == 3 && Number(tab[0]) <= 31 && Number(tab[1]) <= 12 && Number(tab[2]) >= 1900) {
                        return "";
                    } else {
                        return errorMessage;
                    }
                }

                res.Function = f;
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function Unique(ref: any[], errorMessage: string = "ValueMustBeUnique"): CustomValidator {
                let res = new CustomValidator();

                let f = function (text: string): string {
                    return IsUnique(text, ref, errorMessage);
                }

                res.Function = f;
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function Unique2(getRefFunction: () => any[], minLength: number = 4, errorMessage: string = "ValueMustBeUnique"): CustomValidator {
                let res = new CustomValidator();

                let f = function (text: string): string {
                    let result = HasMinLength(text, minLength);
                    if (result == "") {
                        result = IsUnique(text, getRefFunction(), errorMessage);
                    }
                    return result;
                }

                res.Function = f;
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function IsUnique(text: string, ref: any[], errorMessage: string = "ValueMustBeUnique"): string {
                let isValid: boolean = ref.indexOf(text) < 0;
                if (isValid == false) {
                    return LocalizationManager.Get(errorMessage);
                }
                return "";
            }



            export function Password(minLength: number = 6, errorMessage: string = "PasswordFormat"): CustomValidator {
                let res = new CustomValidator();

                let f = function (password: string, parameters: any, errorMessage): string {
                    let minLength = parameters["minLength"];
                    let isValid: boolean = password.length >= minLength && password.match(/\d/) != undefined && password.match(/[A-Z]/) != undefined && password.match(/[a-z]/) != undefined;
                    if (isValid == false) {
                        return LocalizationManager.Format(errorMessage, [minLength.toString()]);
                    }
                    return "";
                }

                res.Function = f;
                res.Parameters = { "minLength": minLength };
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function Mail(errorMessage: string = "EMailFormatExpected"): CustomValidator {
                let res = new CustomValidator();

                let f = function (mail: string): string {
                    //let pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                    //let isValid: boolean = $.trim(mail).match(pattern) ? true : false;
                    //if (isValid == false) {
                    //    return LocalizationManager.Get(errorMessage);
                    //}
                    //return "";
                    return IsMail(mail);
                }

                res.Function = f;
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function NumberPos(errorMessage: string = "NumberFormatExpected", min=0.01): CustomValidator {
                let res = new CustomValidator();

                let f = function (number: string): string {
                    //let pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                    //let isValid: boolean = $.trim(mail).match(pattern) ? true : false;
                    //if (isValid == false) {
                    //    return LocalizationManager.Get(errorMessage);
                    //}
                    //return "";
                    return IsPositiveInteger(number, errorMessage, min);
                }

                res.Function = f;
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function IsURL(url: string, errorMessage: string = "URLFormatExpected"): string {
                let pattern = /^((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
                // TOFIX let isValid: boolean = $.trim(url).match(pattern) ? true : false;
                let isValid: boolean = url.substr(0, 4) == "http";
                if (isValid == false) {
                    return LocalizationManager.Get(errorMessage);
                }
                return "";
            }

            export function IsImageURL(url: string, errorMessage: string = "URLFormatExpected"): string {
                let pattern = /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)$/;
                let isValid: boolean = $.trim(url).match(pattern) ? true : false;
                if (isValid == false) {
                    return LocalizationManager.Get(errorMessage);
                }
                return "";
            }

            export function URL(errorMessage: string = "URLFormatExpected"): CustomValidator {
                let res = new CustomValidator();

                let f = function (url: string): string {
                    return IsURL(url, errorMessage);
                }

                res.Function = f;
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function ImageURL(errorMessage: string = "URLFormatExpected"): CustomValidator {
                let res = new CustomValidator();

                let f = function (url: string): string {
                    return IsImageURL(url, errorMessage);
                }

                res.Function = f;
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function IsMail(mail: string, errorMessage: string = "EMailFormatExpected"): string {
                let pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                let isValid: boolean = $.trim(mail).match(pattern) ? true : false;
                if (isValid == false) {
                    return LocalizationManager.Get(errorMessage);
                }
                return "";
            }

            export function IsNotEmpty(text: string, errorMessage: string = "NotEmpty"): string {
                let isValid: boolean = text && text.replace(/(\r\n|\n|\r)/gm, "").length > 0 && text != '-';
                if (isValid == false) {
                    return LocalizationManager.Get(errorMessage);
                }
                return "";
            }

            export function IsNotEmptyArray(array: any[], errorMessage: string = "NotEmpty"): string {
                let isValid: boolean = array && array.length > 0;
                if (isValid == false) {
                    return LocalizationManager.Get(errorMessage);
                }
                return "";
            }

            export function IsPositiveInteger(n: string, errorMessage: string = "NotANumber", min=0.01) {
                n = n.replace(",", ".");
                let nAsnumber = Number(n);
                let isValid: boolean = n && isNaN(nAsnumber) == false && nAsnumber >= min;
                if (isValid == false) {
                    return LocalizationManager.Get(errorMessage);
                }
                return "";
            }

            export function NotEmpty(errorMessage: string = "NotEmpty"): CustomValidator {
                let res = new CustomValidator();

                let f = function (text: string): string {
                    //return IsNotEmpty(text, errorMessage);
                    return "";
                }

                res.Function = f;
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function IsNumber(typeOfNumber: string = "number", errorMessage: string = "NotANumber"): CustomValidator {
                let res = new CustomValidator();

                let f = function (n: string): string {
                    let nAsnumber = Number(n);
                    let isValid: boolean = n && isNaN(nAsnumber) == false;
                    if (typeOfNumber == "positiveInteger" || typeOfNumber == "integer") {
                        isValid = isValid && isNaN(parseInt(n)) == false;
                        if (typeOfNumber == "positiveInteger") {
                            isValid = isValid && nAsnumber > 0;
                        }
                    }
                    if (isValid == false) {
                        return LocalizationManager.Get(errorMessage);
                    }
                    return "";
                }

                res.Function = f;
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function IsDate(minDate: Date = undefined, maxDate: Date = undefined, errorMessage: string = "NotAValidDate"): CustomValidator {
                let res = new CustomValidator();

                let f = function (date: string): string {
                    let d = new Date(date);
                    let isValid: boolean = d != undefined;
                    if (minDate && d < minDate) {
                        isValid = false;
                    }
                    if (maxDate && d > maxDate) {
                        isValid = false;
                    }
                    if (isValid == false) {
                        return LocalizationManager.Get(errorMessage);
                    }
                    return "";
                }

                res.Function = f;
                res.ErrorMessage = errorMessage;
                return res;
            }

            export function NoValidation(): CustomValidator {
                let res = new CustomValidator();

                let f = function (text: string): string {
                    return "";
                }

                res.Function = f;
                return res;
            }

            //TODO
            export function Validate(validatorName: string, textToValidate: string): string {
                switch (validatorName) {
                    case "None":
                        return "";
                    case "Mail":
                        return IsMail(textToValidate);
                    case "NotEmpty":
                        return IsNotEmpty(textToValidate);
                    case "URL":
                        return IsURL(textToValidate);
                }
                return "";
            }

            export var ValidatorEnum: string[] = ["None", "Mail", "NotEmpty", "URL"];
        }

        export class DataTableFilter {
            public Column: string;
            public SelectedValues: any[];
            public Values: any[]
            public Search: string;
        }

        export class DataTable extends Form.ValidableElement {

            public HtmlTable: HTMLTableElement;
            public DataTable: any;
            public SelectedRow: any;
            public Columns: any = [];

            private isEnabled: boolean = true;

            public SelectedData: any[] = [];
            public ListData: any[] = [];

            public FilteredData: any[] = [];
            private columnFilters: DataTableFilter[]; // Filtres appliqués
            private filterButtons: Framework.Form.Button[] = [];

            private parameters: Form.DataTableParameters;

            public UpdateSelectedRow(item: any) {
                this.DataTable.row(this.SelectedRow).data(item).draw();
            }

            public AddItem(item: any) {
                //TODO : vérification objet unique...
                this.DataTable.row.add(item).draw();
                this.DataTable.page('last').draw(false);
                this.ListData.push(item);
            }

            public RemoveItem(item: any) {
                Framework.Array.Remove(this.ListData, item);
                this.SetItems(this.ListData);
            }

            public RemoveSelection() {
                let self = this;
                self.SelectedData.forEach((x) => {
                    Framework.Array.Remove(self.ListData, x);
                });
                self.SelectedData = [];
                self.SetItems(self.ListData);
            }

            public AddColumnDefinitions(columnDefs: object[]) {
                let self = this;
                columnDefs.forEach((x) => {
                    self.DataTable.ListColumns.push(x);
                });
                self.DataTable.draw();
            }

            public SetItems(items: any[]) {
                let self = this;
                self.DataTable.clear();
                items.forEach((item) => {
                    //self.DataTable.row.add(item).draw();
                    self.DataTable.row.add(item);
                });
                self.setPagination();
            }

            public Refresh() {
                this.SetItems(this.ListData);
            }

            private setPagination() {

                let self = this;

                if (self.parameters.Paging == false) {
                    $('.dataTables_info').hide();
                    return;
                }

                var info = self.DataTable.page.info();
                if ($('#' + self.HtmlTable.id + ' tr').length < self.parameters.PageLength && info.pages == 1) {
                    $('.dataTables_paginate').hide();
                } else {
                    $('.dataTables_paginate').show();
                }


            }

            public AdjustSize() {
                let self = this;
                setTimeout(() => {
                    self.DataTable.columns.adjust().draw();
                }, 100);

            }

            public Export(filename: string, customFormats: any[] = undefined) {

                //TODO : bouton OK, annuler

                let format: string = "XLSX";
                let content = document.createElement("div");
                let formats = ["XLSX", "CSV",/*, "PDF"*/];
                let customF = [];
                if (customFormats) {
                    customFormats.forEach((x) => {
                        formats.push(x.name);
                        customF.push(x.name);
                    });
                }

                let t = document.createElement("div");
                t.innerHTML = Framework.LocalizationManager.Get("ChooseFileFormat")
                content.appendChild(t);

                let select = Framework.Form.Select.Render(format, Framework.KeyValuePair.FromArray(formats), Framework.Form.Validator.NotEmpty(), (x) => { format = x; }, false);
                select.HtmlElement.style.width = "100%";
                content.appendChild(select.HtmlElement);
                let self = this;

                Framework.Modal.Confirm(Framework.LocalizationManager.Get("ExportTable"), content, () => {
                    if (format == "XLSX") {

                        self.ExportTo(filename, "xlsx");

                        // $('#' + this.HtmlTable.id + "_wrapper").find('.buttons-excel').click();
                    }
                    if (format == "CSV") {
                        self.ExportTo(filename, "csv");
                        //$('#' + this.HtmlTable.id + "_wrapper").find('.buttons-csv').click();
                    }

                    if (customF.indexOf(format) > -1) {
                        let f = customFormats.filter((x) => { return x.name == format })[0].func;
                        f();
                    }

                    //if (format == "PDF") {
                    //    $('#' + this.HtmlTable.id + "_wrapper").find('.buttons-csv').click();
                    //}
                });
            }

            public Copy() {
                let l = $('#' + this.HtmlTable.id + "_wrapper").find('.buttons-csv').click();
            }

            public Select(selectedData: any[]) {

                if (selectedData.length == 0) {
                    return;
                }

                let self = this;
                // Sélection initiale
                this.DataTable.column(0).nodes().each(function (cell, i) {
                    let d = self.DataTable.row(i).data();
                    if (selectedData.indexOf(d) > -1) {
                        let cb: HTMLInputElement = cell.children[0];
                        cb.click();
                    }
                });


                //this.DataTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
                //    var row = self.DataTable.row(rowIdx);
                //    var data = this.data();
                //    // ... do something with data(), or this.node(), etc
                //});

            }

            public SelectAll() {
                var cells = this.DataTable.cells().nodes();
                $(cells).find(':checkbox').prop('checked', true);
                let rows = this.DataTable.rows().nodes();
                this.SelectedData = this.ListData;
                this.parameters.OnSelectionChanged(this.SelectedData);
            }

            public UnselectAll() {
                var cells = this.DataTable.cells().nodes();
                $(cells).find(':checkbox').prop('checked', false);
                this.SelectedData = [];
                this.parameters.OnSelectionChanged(this.SelectedData);
            }

            public Enable() {
                this.isEnabled = true;
            }

            public Disable() {
                this.isEnabled = false;
            }

            private editedCell;
            private editedData;
            private editedPropertyName;
            private editedPropertyOldValue;

            private static register(table: HTMLTableElement, parameters: Form.DataTableParameters, onLoaded: (dataTable: Form.DataTable) => void) {

                // Suppression des warnings
                //$.fn.dataTable.ext.errMode = 'none';

                //TODO : améliorer (animation)               
                let div = document.createElement("div");
                div.style.position = "absolute";
                div.style.margin = "auto";
                div.style.top = "0";
                div.style.bottom = "0";
                div.style.left = "0";
                div.style.right = "0";
                div.style.height = "100px";
                div.style.width = "100px";
                div.style.textAlign = "center";
                div.innerHTML = 'Loading...';
                document.body.appendChild(div);

                let self = new Form.DataTable();

                self.parameters = parameters;

                self.HtmlTable = table;
                self.ListData = parameters.ListData;

                self.Columns = [];
                self.columnFilters = [];
                self.filterButtons = [];

                let hasSelectCell = false;
                let currentCell: HTMLElement = undefined;

                let cpt: number = -1;

                if (parameters.OnSelectionChanged) {

                    let selectionDictionary: Framework.KeyValuePair[] = [];

                    // Ajout de case à cocher
                    let dtc = {
                        data: null,
                        title: "",
                        render: function (data, type, row) {
                            if (type === 'display') {
                                cpt++;
                                selectionDictionary.push(new Framework.KeyValuePair(cpt, row));
                                return '<input type="checkbox" class="editor-active" value="' + cpt + '" >';
                                //let res = '<input type="checkbox" class="editor-active" value="' + cpt + '" ';

                                //if (selectionCriterion && selectionValue.indexOf(data[selectionCriterion]) > -1) {
                                //    res += 'checked=checked';
                                //    self.SelectedData.push(data);
                                //}

                                //res += '>';
                                //return res;
                            }
                            return data;
                        },
                        sortable: false
                    }
                    self.Columns.push(dtc);
                    self.columnFilters.push({ Column: "", SelectedValues: [], Values: [], Search: "" });
                    hasSelectCell = true;

                    $(self.HtmlTable).on('click', 'input[type="checkbox"]', function () {
                        //var row = $(this).closest('tr');       
                        //self.toggleSelectRow(row[0]);                
                        let val = Number(this.value);
                        let data = selectionDictionary.filter((x) => { return x.Key == val })[0].Value;

                        let tr = self.HtmlTable.rows[val + 1];

                        if (self.SelectedData.indexOf(data) > -1) {
                            Framework.Array.Remove(self.SelectedData, data);
                            //Framework.Array.Remove(self.SelectedRows, tr);
                            //tr.classList.remove("selected");
                        } else {
                            self.SelectedData.push(data);
                            //self.SelectedRows.push(tr);
                            //tr.classList.add("selected");
                        }

                        //var row= this.parentElement.parentElement;
                        //self.toggleSelectRow(tr);
                        parameters.OnSelectionChanged(self.SelectedData);

                    });

                }

                let render = function (data, type, row) {
                    if (data && type === 'display') {
                        return data;
                    }
                    return "";
                }

                parameters.ListColumns.forEach((x) => {
                    let renderer = render;
                    if (x.render) {
                        renderer = x.render;
                    }
                    let dtc = { data: x.data, title: x.title, render: renderer, sortable: false };
                    self.Columns.push(dtc);
                    let vals = Array.Unique(self.ListData.map((d) => { return d[x.data]; }));
                    self.columnFilters.push({ Column: x.data, SelectedValues: Factory.Clone(vals), Values: Factory.Clone(vals), Search: "" });
                });

                $(document).ready(function () {
                    setTimeout(function () {
                        if ($.fn.DataTable.isDataTable(self.HtmlTable)) {
                            self.DataTable = $(self.HtmlTable).DataTable();
                            self.DataTable.destroy();
                        }

                        let pageLength = parameters.PageLength;
                        // Calcul du nombre de lignes
                        if (parameters.TableHeight) {
                            let height = (parameters.TableHeight - (2 * parameters.TdHeight)) / (parameters.TdHeight * 2);
                            pageLength = Math.floor(height / 5) * 5;
                        }

                        if (parameters.OnSelectionChanged) {
                            parameters.ColumnDefs.push({
                                width: "5px", targets: 0
                            });
                        }

                        self.FilteredData = self.ListData;

                        self.DataTable = $(self.HtmlTable).DataTable({
                            data: parameters.ListData,
                            columns: self.Columns,
                            columnDefs: parameters.ColumnDefs,
                            scrollY: parameters.ScrollY,
                            paging: parameters.Paging,
                            searching: parameters.Searching,
                            scrollCollapse: true,
                            lengthChange: false,
                            ordering: parameters.Ordering,
                            pageLength: pageLength,
                            language: {
                                "decimal": "",
                                "emptyTable": LocalizationManager.Get("DataTable_EmptyTable"),
                                "info": LocalizationManager.Get("DataTable_Info"),
                                "infoEmpty": LocalizationManager.Get("DataTable_InfoEmpty"),
                                "infoFiltered": LocalizationManager.Get("DataTable_InfoFiltered"),
                                "infoPostFix": "",
                                "thousands": ",",
                                "lengthMenu": LocalizationManager.Get("DataTable_LengthMenu"),
                                "loadingRecords": LocalizationManager.Get("DataTable_Loading"),
                                "processing": LocalizationManager.Get("DataTable_Processing"),
                                "search": LocalizationManager.Get("DataTable_Search"),
                                "zeroRecords": LocalizationManager.Get("DataTable_ZeroRecord"),
                                "paginate": {
                                    "first": LocalizationManager.Get("DataTable_First"),
                                    "last": LocalizationManager.Get("DataTable_Last"),
                                    "next": LocalizationManager.Get("DataTable_Next"),
                                    "previous": LocalizationManager.Get("DataTable_Previous")
                                },
                                "aria": {
                                    "sortAscending": LocalizationManager.Get("DataTable_SortAscending"),
                                    "sortDescending": LocalizationManager.Get("DataTable_SortDescending")
                                }
                            },
                            //ordering: false,
                            order: parameters.Order,
                            dom: 'Bfrtip',
                            buttons: [
                                'copyHtml5', 'excelHtml5', 'pdfHtml5', 'csvHtml5'
                            ],
                            createdRow: parameters.OnCreatedRow,
                            drawCallback: function () {
                                // Suppression de la pagination si non nécéssaire
                                //if ($('#' + self.HtmlTable.id + ' tr').length < pageLength) {
                                //    var info = self.DataTable.page.info();
                                //    $('.dataTables_paginate').hide();
                                //}

                                //TOFIX : si plusieurs pages et dernière page affichée, plus de naviugation



                            }
                        });

                        // Boutons
                        $('.dt-buttons').css('float', 'right');

                        if (parameters.Buttons.indexOf('Pdf') > -1) {
                            $('#' + self.HtmlTable.id + "_wrapper").find('.buttons-pdf').addClass('btnPdf');
                        } else {
                            $('#' + self.HtmlTable.id + "_wrapper").find('.buttons-pdf').css('display', 'none');
                        }

                        if (parameters.Buttons.indexOf('Csv') > -1) {
                            $('#' + self.HtmlTable.id + "_wrapper").find('.buttons-csv').addClass('btnCsv');
                        } else {
                            $('#' + self.HtmlTable.id + "_wrapper").find('.buttons-csv').css('display', 'none');
                        }

                        if (parameters.Buttons.indexOf('Excel') > -1) {
                            $('#' + self.HtmlTable.id + "_wrapper").find('.buttons-excel').addClass('btnExcel');
                        } else {
                            $('#' + self.HtmlTable.id + "_wrapper").find('.buttons-excel').css('display', 'none');
                        }

                        if (parameters.Buttons.indexOf('Copy') > -1) {
                            $('#' + self.HtmlTable.id + "_wrapper").find('.buttons-copy').addClass('btnCopy');
                        } else {
                            $('#' + self.HtmlTable.id + "_wrapper").find('.buttons-copy').css('display', 'none');
                        }

                        $('#' + self.HtmlTable.id + " tr td").css("height", parameters.TdHeight);


                        $('#' + self.HtmlTable.id + "_wrapper").css('font-size', parameters.FontSize);


                        // Action déclenchée quand on clique sur une ligne                        
                        $(self.HtmlTable).on('click', 'tr', function (x) {
                            let clickedRow = x.currentTarget;
                            self.SelectedRow = clickedRow;
                            let clickedRowData = self.DataTable.row(clickedRow).data();
                            if (parameters.OnRowClick) {
                                parameters.OnRowClick(x.currentTarget, clickedRowData);
                            }

                            // Surligne ligne sélectionnée
                            if ($(this).hasClass('selected')) {
                                $(this).removeClass('selected');
                            }
                            else {
                                self.DataTable.$('tr.selected').removeClass('selected');
                                $(this).addClass('selected');
                            }


                        });

                        // Filtre et tri
                        for (var i = 0; i < self.Columns.length; i++) {
                            var title = self.DataTable.columns(i).header()[0];

                            if (self.parameters.Filtering == true) {


                                let filters = self.columnFilters.filter((x) => {
                                    let col = "";
                                    if (self.Columns[i].mData != null) {
                                        col = self.Columns[i].mData;
                                    }
                                    return x.Column == col;
                                    //})[0].Values.sort();
                                });

                                let vals = [];
                                if (filters.length > 0 && filters[0].Values && filters[0].Values.length > 0) {
                                    vals = filters[0].Values.sort();
                                }

                                // Bouton pour filtrer
                                if (vals.length > 1) {

                                    let div = Framework.Form.TextElement.Create("");
                                    div.HtmlElement.style.fontSize = "12px";
                                    div.HtmlElement.style.textAlign = "center";

                                    let anchor = Framework.Form.Button.Create(() => { return true; }, () => {
                                        // Select/unselect all
                                        let checked = checkboxes.filter((x) => { return x.IsChecked == true; });
                                        if ((checked.length / checkboxes.length) < 0.5) {
                                            checkboxes.forEach((x) => {
                                                x.Check();
                                            });
                                        } else {
                                            checkboxes.forEach((x) => {
                                                x.Uncheck();
                                            });
                                        }

                                    }, Framework.LocalizationManager.Get("SelectUnselectAll"), ["m1", "btn", "btn-link", "btn-light", "block"]);
                                    anchor.HtmlElement.style.color = "white";
                                    div.Append(anchor);

                                    let div1 = Framework.Form.TextElement.Create("");
                                    div1.HtmlElement.style.border = "1px solid white";
                                    div1.HtmlElement.style.maxHeight = "400px";
                                    div1.HtmlElement.style.overflowY = "auto";

                                    let checkboxes: Framework.Form.CheckBox[] = [];

                                    vals.forEach((x) => {
                                        let checkbox = Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {

                                            let colName = cb.HtmlElement.getAttribute("ColName");
                                            let filter = self.columnFilters.filter((f) => { return f.Column == colName; });
                                            if (cb.IsChecked == true) {
                                                filter[0].SelectedValues.push(x);
                                            } else {
                                                filter[0].SelectedValues.splice(filter[0].SelectedValues.indexOf(x), 1);
                                            }

                                        }, x, "", true, ["filterCb", "m1"]);
                                        checkbox.HtmlElement.setAttribute("ColName", self.Columns[i].mData);
                                        div1.Append(checkbox);
                                        checkboxes.push(checkbox);
                                    });

                                    div.Append(div1);

                                    let input = Framework.Form.InputText.Create("", (newVal, input) => {
                                        let col = input.CustomAttributes.Get("ColumnName");
                                        self.columnFilters.filter((x) => { return x.Column == col })[0].Search = newVal;

                                    }, Framework.Form.Validator.NoValidation(), false, ["block", "input-block-level", "m1", "inputPlaceholder"]);
                                    input.SetPlaceHolder(Framework.LocalizationManager.Get("Search"));
                                    input.HtmlElement.style.color = "black";
                                    input.CustomAttributes.Add("ColumnName", self.Columns[i].mData);
                                    div.Append(input);

                                    let div3 = Framework.Form.TextElement.Create("", ["block", "m1"]);

                                    let btnCancelFilter = Framework.Form.Button.Create(() => {
                                        return true;
                                    }, (btn) => {

                                        //TOFIX quand filtres multiples dans data

                                        checkboxes.forEach((x) => {
                                            x.Check();
                                        });
                                        input.Set("");
                                        let col = btn.CustomAttributes.Get("ColumnName");
                                        self.columnFilters.filter((x) => { return x.Column == col })[0].Search = "";

                                        let button = self.filterButtons.filter((x) => {
                                            return x.CustomAttributes.Get("ColumnName") == col;
                                        });
                                        if (button.length > 0) {
                                            button[0].HtmlElement.innerHTML = '<i class="fa fa-filter" style="width: 1px;"></i>';
                                        }

                                        self.SetItems(self.ListData);
                                        try {
                                            $(b.HtmlElement).tooltipster('hide');
                                        } catch { }
                                    }, Framework.LocalizationManager.Get("CancelFilter"), ["btn", "btn-primary", "btn-sm", "m1"]);
                                    btnCancelFilter.CustomAttributes.Add("ColumnName", self.Columns[i].mData);
                                    div3.Append(btnCancelFilter);

                                    let btnApplyFilter = Framework.Form.Button.Create(() => {
                                        return true;
                                    }, (btn) => {
                                        self.FilteredData = [];

                                        self.ListData.forEach((d) => {
                                            let shoudAdd: boolean = true;

                                            self.columnFilters.forEach((f) => {
                                                // Filtres checkbox
                                                if (d[f.Column] && f.SelectedValues.indexOf(d[f.Column]) < 0) {
                                                    shoudAdd = false;
                                                }
                                                // filtre input
                                                if (d[f.Column] && (d[f.Column]).toString().indexOf(f.Search) < 0) {
                                                    shoudAdd = false;
                                                }
                                            });
                                            if (shoudAdd) {
                                                self.FilteredData.push(d);
                                            }
                                        });

                                        // Changement icone si filtre actif ou non
                                        self.columnFilters.forEach((f) => {
                                            let button = self.filterButtons.filter((x) => {
                                                return x.CustomAttributes.Get("ColumnName") == f.Column;
                                            });
                                            if (button.length > 0) {
                                                if (f.SelectedValues.length < f.Values.length || f.Search.length > 0) {
                                                    button[0].HtmlElement.innerHTML = '<i class="fa fa-filter" style="width: 1px;color:lightgreen"></i>';
                                                } else {
                                                    button[0].HtmlElement.innerHTML = '<i class="fa fa-filter" style="width: 1px;"></i>';
                                                }
                                            }
                                        });

                                        self.SetItems(self.FilteredData);
                                        self.DataTable.draw();

                                        $(b.HtmlElement).tooltipster('hide');
                                    }, Framework.LocalizationManager.Get("ApplyFilter"), ["btn", "btn-primary", "btn-sm", "m1"]);
                                    div3.Append(btnApplyFilter);
                                    btnApplyFilter.CustomAttributes.Add("ColumnName", self.Columns[i].mData);

                                    div.Append(div3);


                                    let b = Framework.Form.PopupButtonPanel.Render(() => { return true; }, [], Framework.LocalizationManager.Get("Filter"), <HTMLDivElement>div.HtmlElement, "bottom", undefined);
                                    b.HtmlElement.innerHTML = '<i class="fa fa-filter" style="width:1px"></i>';
                                    b.HtmlElement.style.background = "transparent";
                                    b.HtmlElement.style.border = "0";
                                    b.CustomAttributes.Add("ColumnName", self.Columns[i].mData);
                                    title.appendChild(b.HtmlElement);
                                    self.filterButtons.push(b);

                                    // Bouton pour trier
                                    let b1 = Framework.Form.Button.Create(() => { return true; }, (btn) => {

                                        // Tri(s) actuel
                                        //let order = self.DataTable.order();


                                        // Index de la colonne
                                        let index = Number(btn.HtmlElement.getAttribute("ColumnIndex"));
                                        let newOrder = "asc";

                                        let currentOrder = undefined;
                                        let currentOrderIndex = -1;
                                        for (let i = 0; i < self.parameters.Order.length; i++) {
                                            if (self.parameters.Order[i][0] == index) {
                                                currentOrderIndex = i;
                                                currentOrder = self.parameters.Order[i][1];
                                                break;
                                            }
                                        }

                                        if (currentOrder) {
                                            if (currentOrder == "asc") {
                                                newOrder = "desc";
                                            } else {
                                                newOrder = "asc";
                                            }
                                            self.parameters.Order[currentOrderIndex][1] = newOrder;
                                            //    Framework.Array.Remove(self.parameters.Order, currentOrder);
                                            //    self.parameters.Order.push([index, newOrder]);
                                        }

                                        //ICI : mettre à jour listdata ?
                                        let colName = self.Columns[index].mData;
                                        let orderedListData = self.ListData.sort((a, b) => {
                                            let res = (a[colName] > colName) ? 1 : ((colName > a[colName]) ? -1 : 0)

                                            if (newOrder == "desc") {
                                                res = -res;
                                            }
                                            return res;
                                        });
                                        self.SetItems(orderedListData);

                                        //let currentOrder = self.parameters.Order.filter((x) => {
                                        //    return x[0] == index;
                                        //});

                                        //if (currentOrder.length > 0) {
                                        //    if (currentOrder[0][1] == "asc") {
                                        //        newOrder = "desc";
                                        //    } else {
                                        //        newOrder = "asc";
                                        //    }
                                        //    Framework.Array.Remove(self.parameters.Order, currentOrder);
                                        //    self.parameters.Order.push([index, newOrder]);
                                        //}

                                        if (newOrder == "desc") {
                                            btn.HtmlElement.innerHTML = '<i class="fa fa-sort-down" style="width:1px"></i>';
                                        }
                                        if (newOrder == "asc") {
                                            btn.HtmlElement.innerHTML = '<i class="fa fa-sort-up" style="width:1px"></i>';
                                        }
                                        //self.DataTable.order([index, newOrder]).draw();
                                        //
                                        //self.DataTable.order([index, newOrder]);                                        
                                        //self.DataTable.draw();




                                    }, "", [], Framework.LocalizationManager.Get("Sort"));
                                    b1.HtmlElement.setAttribute("ColumnIndex", i.toString());

                                    let currentOrder = self.parameters.Order.filter((x) => {
                                        return x[0] == i;
                                    });
                                    let html = '<i class="fa fa-sort" style="width:1px"></i>';
                                    if (currentOrder.length > 0 && currentOrder[0][1] == "asc") {
                                        html = '<i class="fa fa-sort-up" style="width:1px"></i>';
                                    }
                                    if (currentOrder.length > 0 && currentOrder[0][1] == "desc") {
                                        html = '<i class="fa fa-sort-desc" style="width:1px"></i>';
                                    }

                                    b1.HtmlElement.innerHTML = html;
                                    b1.HtmlElement.style.background = "transparent";
                                    b1.HtmlElement.style.border = "0";
                                    title.appendChild(b1.HtmlElement);
                                }
                                //TODO : tri multiple
                                //TOFIX : quand on clique, change l'alignement et la largeur de colonne
                            }
                        }



                        // Action déclenchée quand on édite une cellule
                        if (parameters.OnEditCell) {

                            // Suppression du mode édition
                            let test = function (evt) {

                                if (evt.target.nodeName != "DIV" && evt.target != self.editedCell) {
                                    try {
                                        if (self.editedData && self.editedPropertyName && self.editedPropertyOldValue) {
                                            if (self.editedData[self.editedPropertyName] != self.editedPropertyOldValue) {
                                                parameters.OnDataChanged(self.editedData, self.editedPropertyName, self.editedPropertyOldValue, self.editedData[self.editedPropertyName]);
                                            }
                                        }
                                        self.editedData = undefined;
                                        self.editedPropertyName = undefined;
                                        self.editedPropertyOldValue = undefined;
                                        self.DataTable.cell(self.editedCell).data(self.DataTable.cell(self.editedCell).data()).draw();
                                    } catch {
                                    }
                                    currentCell = undefined;
                                    document.removeEventListener('click', test);
                                }
                            }



                            $(self.HtmlTable).on('click', 'tbody td', function (x) {

                                let scroll = self.DataTable.context[0].nScrollBody;

                                let cell = <HTMLElement>x.currentTarget;

                                let row = self.DataTable.row(this);
                                self.SelectedRow = row;
                                let data = row.data();

                                let index = self.DataTable.cell(this).index().column;
                                if (hasSelectCell == true) {
                                    index -= 1;
                                }
                                if (index > -1) {

                                    let propertyName = parameters.ListColumns[index].data;

                                    if (self.editedData && self.editedPropertyName && self.editedPropertyOldValue) {
                                        if ((self.editedData[self.editedPropertyName] != self.editedPropertyOldValue) && (self.editedData != data || self.editedPropertyName != propertyName)) {
                                            parameters.OnDataChanged(self.editedData, self.editedPropertyName, self.editedPropertyOldValue, self.editedData[self.editedPropertyName]);
                                        }
                                    }


                                    self.editedData = data;
                                    self.editedPropertyName = propertyName;
                                    self.editedPropertyOldValue = data[propertyName];

                                    let res = parameters.OnEditCell(propertyName, data);

                                    if (res && currentCell != cell) {
                                        // MAJ de la cellule précédente
                                        let prevCell = self.DataTable.cell(currentCell).data(self.DataTable.cell(currentCell).data());
                                        if (prevCell) {
                                            prevCell.draw();
                                        }

                                        currentCell = cell;
                                        if (res instanceof HTMLElement) {
                                            currentCell.innerHTML = "";
                                            currentCell.appendChild(res);
                                            self.editedCell = currentCell;

                                            //self.editedCell.scrollIntoView();

                                            //scroll.scrollTop = currentCell.offsetTop - scroll.offsetTop;

                                            //if (currentCell.offsetTop < scroll.scrollTop) {
                                            //    scroll.scrollTop = currentCell.offsetTop;
                                            //} else {
                                            //    let offsetBottom = currentCell.offsetTop + currentCell.offsetHeight;
                                            //    let scrollBottom = scroll.scrollTop + scroll.offsetHeight;
                                            //    if (offsetBottom > scrollBottom) {
                                            //        scroll.scrollTop = offsetBottom - scroll.offsetHeight;
                                            //    }
                                            //}

                                            scroll.scrollTop = cell.offsetTop - scroll.offsetTop;


                                            document.addEventListener('click', test);
                                        }
                                    } else {

                                    }
                                }

                            });
                        }

                        document.body.removeChild(div);


                        if (parameters.OnSelectionChanged) {
                            let h = self.DataTable.column(0).header();
                            h.innerHTML = "";
                            let cb = document.createElement("input");
                            cb.type = "checkbox";
                            cb.onclick = () => {
                                if (cb.checked == true) {
                                    self.SelectAll();
                                } else {
                                    self.UnselectAll();
                                }
                            }
                            h.appendChild(cb);
                        }

                        onLoaded(self);

                        self.setPagination();


                    }, 1);


                });

            }

            public SetStyle(selector: string, propertyName: string, value: string) {
                this.DataTable.$('td').css(propertyName, value);
            }

            public static Register(id: string, parameters: Form.DataTableParameters, onLoaded: (dataTable: Form.DataTable) => void) {
                DataTable.register(<HTMLTableElement>document.getElementById(id), parameters, onLoaded);
            }

            public static Create(table: HTMLTableElement, parameters: Form.DataTableParameters, onLoaded: (dataTable: Form.DataTable) => void) {
                DataTable.register(table, parameters, onLoaded);
            }

            public static AppendToDiv(title: string, tableHeight: string, parentDiv: HTMLElement, parameters: Form.DataTableParameters, onLoaded: (dt: Framework.Form.DataTable) => void, onSelectionChanged: (sel: any[]) => void = undefined, onAdd: () => void = undefined, onDelete: () => void = undefined, onImport: () => void = undefined, onExport: () => void = undefined, buttons: Framework.Form.Button[] = []): void {


                //let isInVP = Framework.ViewPort.ElementIsInViewport(parentDiv);

                let btnDelete: Framework.Form.Button;

                parentDiv.innerHTML = "";

                let titleDiv = Framework.Form.TextElement.Create(title + " (" + parameters.ListData.length + " " + Framework.LocalizationManager.Get("Lines").toLowerCase() + ")", ["tableTitleDiv"]);
                if (title != undefined) {
                    parentDiv.appendChild(titleDiv.HtmlElement);
                }

                let contentDiv = Framework.Form.TextElement.Create("", ["tableContentDiv"]);
                parentDiv.appendChild(contentDiv.HtmlElement);

                let htmlTable: HTMLTableElement = document.createElement("table");
                htmlTable.classList.add("display");

                contentDiv.HtmlElement.appendChild(htmlTable);

                let footerDiv = Framework.Form.TextElement.Create("", ["tableFooterDiv"]);
                parentDiv.appendChild(footerDiv.HtmlElement);

                parameters.ScrollY = tableHeight;
                if (onSelectionChanged) {
                    parameters.OnSelectionChanged = (sel: any[]) => {

                        titleDiv.SetHtml(title + " (" + sel.length + "/" + parameters.ListData.length + " " + Framework.LocalizationManager.Get("SelectedLines").toLowerCase() + ")");

                        onSelectionChanged(sel);

                        if (btnDelete) {
                            if (sel.length > 0) {
                                btnDelete.Enable();
                            } else {
                                btnDelete.Disable();
                            }
                        }
                    };
                }

                Framework.Form.DataTable.Create(htmlTable, parameters, (table) => {
                    if (table.ListData.length > 0) {
                        setTimeout(() => {
                            try {
                                table.DataTable.columns.adjust().draw();
                            } catch { }
                        }, 100);
                    }
                    onLoaded(table);


                });

                let showActionDiv: boolean = false;
                //let actionDiv = Framework.Form.TextElement.Create("", ["tableActionDiv"]);

                if (onAdd) {
                    showActionDiv = true;
                    let btnAdd = Framework.Form.Button.Create(() => { return true; }, () => {
                        onAdd();
                    }, Framework.LocalizationManager.Get("InsertRow"), ['btnTable'], Framework.LocalizationManager.Get("InsertRow"));
                    footerDiv.Append(btnAdd);
                }

                if (onDelete) {
                    showActionDiv = true;
                    btnDelete = Framework.Form.Button.Create(() => { return false; }, () => {
                        onDelete();
                        btnDelete.Disable();
                    }, Framework.LocalizationManager.Get("DeleteRows"), ['btnTable'], Framework.LocalizationManager.Get("DeleteRows"));
                    btnDelete.Disable();
                    footerDiv.Append(btnDelete);
                }

                if (onImport) {
                    showActionDiv = true;
                    let btnImport = Framework.Form.Button.Create(() => { return true; }, () => {
                        onImport();
                    }, Framework.LocalizationManager.Get("Import"), ['btnTable'], Framework.LocalizationManager.Get("Import"));
                    footerDiv.Append(btnImport);
                }

                if (onExport) {
                    showActionDiv = true;
                    let btnExport = Framework.Form.Button.Create(() => { return true; }, () => {
                        onExport();
                    }, Framework.LocalizationManager.Get("Export"), ['btnTable'], Framework.LocalizationManager.Get("Export"));
                    footerDiv.Append(btnExport);
                }

                buttons.forEach((b) => {
                    showActionDiv = true;
                    footerDiv.Append(b);
                });

                if (showActionDiv == false) {
                    ////titleDiv.Append(actionDiv);
                    footerDiv.Hide();
                }
            }

            private getColumnNames(): Framework.KeyValuePair[] {
                let res: Framework.KeyValuePair[] = [];
                for (var i = 0; i < this.Columns.length; i++) {
                    if (this.Columns[i].title.length > 0) {
                        var title = this.Columns[i].title;
                        var data = this.Columns[i].data;
                        res.push(new Framework.KeyValuePair(title, data));
                    }
                }
                return res;
            }

            public GetColumnNames(): Framework.KeyValuePair[] {
                return this.getColumnNames();
            }

            public GetAsArray(): string[][] {
                let array: string[][] = [];

                let tabKvp = this.getColumnNames();

                let titleRow = tabKvp.map((x) => { return x.Key });
                let titleData = tabKvp.map((x) => { return x.Value });
                array.push(titleRow);

                this.ListData.forEach((x) => {
                    let row = [];
                    titleData.forEach((y) => {
                        row.push(x[y]);
                    });
                    array.push(row);
                });

                return array;
            }

            public ExportTo(filename: string, format: string): void {
                let wb = new Framework.ExportManager("", "", "");
                wb.AddWorksheet("1", this.GetAsArray());
                wb.Save(filename, format);
            }

            // TODO : utiliser ça dans toutes les datatable pour créer type de champ éditable automatique
            // TODO : onDataChanged
            // TODO : beforeDataChanged
            public static OnEditDataTableCell(data: any, propertyName: string, pType: string, defaultValue: any = undefined, kvp: Framework.KeyValuePair[] = [], customValidator: Framework.Form.Validator.CustomValidator = undefined) {

                if (data[propertyName] == undefined) {
                    if (defaultValue) {
                        data[propertyName] = defaultValue;
                    } else {
                        data[propertyName] = "";
                    }
                }

                if (pType == 'Character') {
                    let validator = Framework.Form.Validator.NoValidation();
                    if (customValidator) {
                        validator = customValidator;
                    }
                    return Framework.Form.InputText.Create(data[propertyName], (x) => {
                        data[propertyName] = x;
                    }, validator, false, ["tableInput"]).HtmlElement;
                }

                if (pType == 'Numeric') {
                    let validator = Framework.Form.Validator.IsNumber();
                    if (customValidator) {
                        validator = customValidator;
                    }
                    return Framework.Form.InputText.Create(data[propertyName], (x) => {
                        data[propertyName] = x;
                    }, validator, false, ["tableInput"]).HtmlElement;
                }

                if (pType == 'Enumeration') {

                    let validator = Framework.Form.Validator.NotEmpty();
                    if (customValidator) {
                        validator = customValidator;
                    }

                    return Framework.Form.Select.Render(data[propertyName], kvp, validator, (x) => {
                        data[propertyName] = x;
                    }, false, ["tableInput"]).HtmlElement;
                }

                //TODO Date, Boolean, couleur...

            }

        }

        export class DataTableParameters {
            public ListData: any[];
            public ListColumns: any[];
            public ExportDivButtonsId: string = undefined;
            public ScrollY: string = "700px";
            public Paging: boolean = true;
            public Searching: boolean = false;
            public OnSelectionChanged: (any) => void = undefined;
            public Order: any[] = [[0, 'asc']];
            public Ordering: boolean = true;
            public Filtering: boolean = true;
            public OnRowClick: (row, data) => void;
            public OnEditCell: (propertyName: string, data) => any;
            public Buttons: string[] = [];
            public FontSize: string = '14px';
            public ColumnDefs: any[] = [];
            public PageLength: number = 10;
            public TdHeight: number = 20;
            public TableHeight: number;
            public OnCreatedRow: (row, data, index) => void = undefined;
            public OnDataChanged: (data, propertyName, oldValue, newValue) => void = () => { };
        }

        export class TableColumn {
            public Name: string;
            public Type: string = "character";
            public Title: string = "";
            public Sortable: boolean = true;
            public Filterable: boolean = true;
            public Editable: boolean = true;
            public RenderFunction: (val: any, row: any) => string = undefined;
            public RenderHTMLFunction: (val: any, row: any) => HTMLElement = undefined;
            public RenderBackgroundFunction: (val: any, row: any) => string = undefined;
            public MinWidth: number = 200;
            public SortDirection: string = "none"; //asc;desc;none
            public SortIndex: number = undefined;
            public Filter: any[] = [""];
            public EnumValues: Framework.KeyValuePair[] = [];
            public Validator: Framework.Form.Validator.CustomValidator = undefined;
            public RemoveSpecialCharacters: boolean = false;
            public DefaultValue: any;
            public TextAlign: string = "left";
            public EditFunction: (val: any, row: any) => HTMLElement = undefined;
            public OnChangeFunction: (row: any) => void = undefined;
        }

        export class Table<T> extends Form.ValidableElement {

            //private displayedData: T[] = [];

            private tbody: HTMLTableSectionElement;
            private tfooter: HTMLTableSectionElement;
            private tfooterTd: HTMLTableCellElement;
            private availableWidth: number;

            private btnToggleSelection: Framework.Form.Button;

            private selectionButtons: Framework.Form.Button[] = [];

            public ListColumns: TableColumn[] = [];
            public ListData: T[] = [];
            public Height: string = "400px";
            public CanSelect: boolean = true;
            public CanExport: boolean = false;
            //public CanAdd: boolean = true;
            //public CanDelete: boolean = true;
            public ShowFooter: boolean = true;
            public OnSelectionChanged: (selection: T[]) => void = () => { };
            public OnDataUpdated: (data: T, propertyName: string, oldValue: any, newValue: any) => void = () => { };
            public FullWidth: boolean = true;

            public MaxDisplayedRows = 200;
            public CurrentPage: number = 1;

            public AddFunction: Function = undefined;
            public RemoveFunction: Function = undefined;

            private container: HTMLDivElement;
            private table: HTMLTableElement;
            private increase: number = 0;

            public TopFilter: string[] = [];


            public Render(parent: HTMLElement, tableWidth: number = undefined) {

                let self = this;

                let parentWidth = parent.clientWidth;
                if (tableWidth) {
                    parentWidth = tableWidth;
                }

                this.container = document.createElement("div");

                if (this.TopFilter.length > 0) {
                    let filterDiv = document.createElement("div");
                    this.container.appendChild(filterDiv);
                    this.TopFilter.forEach(f => {

                        let col = self.ListColumns.filter(c => { return c.Name == f })[0];

                        let d = document.createElement("div");
                        filterDiv.appendChild(d);
                        let l = document.createElement("span");
                        l.innerText = col.Title;
                        l.style.display = "inline-block";
                        l.style.width = "150px";
                        d.appendChild(l);

                        let values = Framework.Array.Unique(self.ListData.map((x) => { return x[f] })).sort((a, b) => { if (a > b) return 1; return -1; });
                        let checkboxes: Framework.Form.CheckBox[] = [];

                        values.forEach((x) => {

                            let checkbox = Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {
                                if (cb.IsChecked == true) {
                                    col.Filter.push(x);
                                } else {
                                    Framework.Array.Remove(col.Filter, x);
                                }
                                self.Refresh();
                            }, x, "", false, ["inlineCheckbox"]);
                            checkboxes.push(checkbox);
                            d.appendChild(checkbox.HtmlElement);
                        });
                    });
                }

                this.table = document.createElement("table");
                this.table.classList.add("tableScroll");

                let thead = document.createElement("thead");
                this.table.appendChild(thead);

                let trh = document.createElement("tr");
                thead.appendChild(trh);

                let nbCells = 0;
                let width: number = 0;
                let colWidth = 0;

                if (this.CanSelect == true) {
                    let th = document.createElement("th");
                    trh.appendChild(th);
                    th.classList.add("tableSelectionCell");

                    this.btnToggleSelection = Framework.Form.Button.Create(() => { return true; }, (btn) => {
                        self.toggleSelection();
                    }, '', [], Framework.LocalizationManager.Get("SelectUnselectAll"));
                    this.btnToggleSelection.HtmlElement.style.background = "transparent";
                    this.btnToggleSelection.HtmlElement.style.border = "0";
                    this.btnToggleSelection.HtmlElement.style.textAlign = "center";

                    th.appendChild(this.btnToggleSelection.HtmlElement);
                    width += 30;
                    colWidth = 30;
                    nbCells++;
                }

                this.ListColumns.forEach((col) => { colWidth += col.MinWidth });

                let availableWidth: number = parentWidth - colWidth - 30;

                this.increase = Math.round(availableWidth / this.ListColumns.length);

                if (this.FullWidth == false) {
                    this.increase = 0;
                }

                this.ListColumns.forEach((col) => {

                    let th = document.createElement("th");
                    trh.appendChild(th);

                    let w = Math.round(col.MinWidth + self.increase)

                    th.style.width = w + "px";
                    th.style.maxWidth = th.style.width;

                    let span = document.createElement("span");
                    span.innerText = col.Title;
                    span.title = col.Title;
                    span.style.width = w + "px";
                    span.style.maxWidth = th.style.width;
                    span.style.minWidth = th.style.width;
                    //span.style.cssFloat = "left";
                    //span.style.maxWidth = "30px";
                    span.style.display = "block";
                    span.style.textAlign = "center";
                    span.classList.add("ellipsis")
                    span.style.marginTop = "5px";

                    th.appendChild(span);


                    if (col.Sortable == true || col.Filterable == true) {

                        let span2 = document.createElement("span");
                        span2.style.display = "block";
                        span2.style.textAlign = "center";
                        span2.style.height = "16px";
                        span2.style.marginRight = "3px";
                        span2.style.padding = "0";
                        //span.innerText = col.Title;
                        //span.title = col.Title;
                        //span.style.cssFloat = "left";
                        //span.style.maxWidth = "30px";

                        th.appendChild(span2);

                        if (col.Sortable == true) {
                            let sortButton = self.getSortButton(col);
                            sortButton.HtmlElement.style.cssFloat = "right";
                            span2.appendChild(sortButton.HtmlElement);
                        }

                        if (col.Filterable == true) {
                            let filterButton = self.getFilterButton(col);
                            filterButton.HtmlElement.style.cssFloat = "right";
                            span2.appendChild(filterButton.HtmlElement);

                            //self.onTitleClick(col, span);

                        }
                    }
                    //} else {
                    //    th.style.textAlign = "center";
                    //    th.innerText = col.Title;
                    //}

                    nbCells++;
                    width += w;
                });

                //let th = document.createElement("th");
                //trh.appendChild(th);
                //th.style.width = Math.round(Framework.Browser.GetScrollbarWidth()) + "px";
                //th.style.background = "#f0f0f0";
                //th.style.borderRight = "2px solid #f0f0f0";
                //th.innerHTML = "&nbsp;";

                this.tbody = document.createElement("tbody");
                this.tbody.style.maxHeight = this.Height;

                this.table.appendChild(this.tbody);

                //if (this.ShowFooter == true) {
                this.tfooter = document.createElement("tfoot");
                this.table.appendChild(this.tfooter);
                let trf = document.createElement("tr");
                this.tfooter.appendChild(trf);
                this.tfooterTd = document.createElement("td");
                trf.appendChild(this.tfooterTd);
                this.tfooterTd.colSpan = nbCells;
                //this.tfooterTd.style.borderTop = "1px solid gray";
                this.tfooterTd.style.padding = "3px";
                //}

                this.renderRows();

                this.container.appendChild(this.table);

                parent.innerHTML = "";
                parent.appendChild(this.container);

                //thead.style.width = width + 30 + availableWidth + "px";
                thead.style.width = Math.round(width) + 30 + "px";

                this.tbody.style.width = thead.style.width;

                // TODO : Gestion événements clavier                
                //this.table.onkeydown = (ev) => {
                //    if (ev.keyCode == 40) {
                //        // Down Arrow

                //        let clickedInput = document.activeElement;                        
                //        let currentCell = <HTMLTableCellElement>clickedInput.parentElement;
                //        let currentRow = <HTMLTableRowElement>currentCell.parentElement;
                //        let currentCellIndex = currentCell.cellIndex;
                //        let currentRowIndex = currentRow.rowIndex;
                //        let nextCell = self.table.tBodies[0].children[currentRowIndex + 1].children[currentCellIndex];
                //        (<HTMLElement>nextCell.children[0]).focus();
                //    }
                //};


            }

            public AddCol(name: string, title: string, minWidth: number = 60, textAlign: string = "center", renderFunction = undefined, renderBackgroundFunction = undefined, renderHTMLFunction = undefined) {
                let col = new Framework.Form.TableColumn();
                col.Editable = false;
                col.Filterable = false;
                col.MinWidth = minWidth;
                col.Name = name;
                col.Sortable = false;
                col.Title = title;
                col.TextAlign = textAlign;
                this.ListColumns.push(col);
                col.RenderFunction = renderFunction;
                col.RenderHTMLFunction = renderHTMLFunction;
                col.RenderBackgroundFunction = renderBackgroundFunction;

                //if (col13.Title == "PUHT") {
                //    col13.RenderFunction = (val, row) => {
                //        return row["ListDetailMagasin"][0]["PVUnitaireTTC"];
                //    }
                //}
                //if (col13.Name == "SousFamilles") {
                //    col13.RenderFunction = (val, row) => {
                //        return val.join();
                //    }
                //}
                //if (col13.Name == "Poids") {
                //    col13.RenderFunction = (val, row) => {
                //        return Framework.Maths.Round(row["Quantite"] * row["QuantiteKg"], 2).toString();
                //    }
                //}
            }

            private renderRows() {

                let self = this;
                this.tbody.innerHTML = "";

                let orderedColumns = this.ListColumns.filter((x) => {
                    return x.Sortable == true && x.SortDirection != "none"
                });

                let filteredColumns = this.ListColumns.filter((x) => {
                    return x.Filter.length > 0 && x.Filterable == true
                });

                if (self.TopFilter.length > 0) {
                    filteredColumns = [];
                    self.TopFilter.forEach(f => {
                        let col = self.ListColumns.filter((x) => { return x.Name == f; })[0];
                        if (col.Filter.length > 0) {
                            filteredColumns.push(col);
                        }
                    })
                }

                //ICI : problème pour gestion des filtres de valeurs nulles


                // Ajout de la propriété "Selected" a ListData
                this.ListData.forEach((x) => {
                    if (x["IsSelected"] == undefined) {
                        x["IsSelected"] = false;
                    }

                    let displayed: boolean = true;
                    //if (x["Displayed"] == undefined) {
                    //    x["Displayed"] = true;
                    //}


                    for (let i = 0; i < filteredColumns.length; i++) {
                        let col = filteredColumns[i];
                        if (col.Filter[0] != undefined && col.Filter.indexOf(x[col.Name]) == -1) {
                            displayed = false;
                            break;
                        }
                    }

                    x["Displayed"] = displayed;
                });

                //this.displayedData = this.ListData;

                // Filtres                
                //if (filteredColumns.length > 0) {
                //    filteredColumns.forEach((x) => {
                //        if (x.Filter[0] != null) {
                //            //self.displayedData = self.displayedData.filter((y) => {
                //            //    if (y[x.Name] == undefined) {
                //            //        return true;
                //            //    }
                //            //    return x.Filter.indexOf(y[x.Name]) > -1
                //            //});
                //            self.ListData.filter((y) => {
                //                return x.Filter.indexOf(y[x.Name]) > -1
                //            }).forEach((y) => {
                //                y["Displayed"] = true;
                //            });
                //        }
                //    });
                //}

                //self.ListData.forEach((d) => {
                //    if (col.Filter.indexOf(d[col.Name]) > -1) {
                //        d["Displayed"] = true;
                //    } else {
                //        d["Displayed"] = false;
                //    }
                //});

                // Tri multiple
                if (orderedColumns.length > 0) {
                    let sortCriterions = [];
                    orderedColumns.forEach((x) => {
                        let prefix = "";
                        if (x.SortDirection == "desc") {
                            prefix = "-";
                        }
                        sortCriterions.push(prefix + x.Name);
                    });

                    //self.displayedData = Framework.Array.MultipleSort(self.displayedData, sortCriterions);
                    self.ListData = Framework.Array.MultipleSort(self.ListData, sortCriterions);
                }



                //TODO : suppression de tri ?

                this.selectionButtons = [];
                //let currentDataIndex = 0;
                let firstIndex = (self.CurrentPage - 1) * self.MaxDisplayedRows;
                let lastIndex = firstIndex + self.MaxDisplayedRows;
                //self.displayedData.forEach((data) => {

                self.ListData.filter((x) => { return x["Displayed"] == true; }).slice(firstIndex, lastIndex).forEach((data) => {
                    self.insertRow(data);
                });

                //self.ListData.forEach((data) => {
                //    if (data["Displayed"]==true && currentDataIndex >= firstIndex && currentDataIndex < lastIndex) {
                //        self.insertRow(data);
                //    }
                //    currentDataIndex++;
                //});

                this.setSelectUnselectAllButtonIcon();
                this.setFooter();
            }

            private renderRow(data: T): HTMLTableRowElement {
                let self = this;
                let tr = document.createElement("tr");

                data["Row"] = tr;

                if (self.CanSelect == true) {
                    let td = document.createElement("td");
                    td.classList.add("tableSelectionCell");
                    tr.appendChild(td);

                    let btn = Framework.Form.Button.Create(() => { return true; }, (b) => {
                        let d = b.CustomAttributes.Get("Data");
                        d["IsSelected"] = !d["IsSelected"];
                        self.setSelectionButtonIcon(b);
                        self.setFooter();
                        self.OnSelectionChanged(self.SelectedData);
                    }, '', [], Framework.LocalizationManager.Get("SelectUnselect"));
                    btn.HtmlElement.style.background = "transparent";
                    btn.HtmlElement.style.border = "0";
                    btn.HtmlElement.style.textAlign = "center";
                    btn.CustomAttributes.Add("Data", data);
                    btn.CustomAttributes.Add("Row", tr);
                    self.setSelectionButtonIcon(btn);
                    self.selectionButtons.push(btn);
                    td.appendChild(btn.HtmlElement);
                }

                self.ListColumns.forEach((col) => {

                    let td = document.createElement("td");
                    tr.appendChild(td);

                    td.style.textAlign = col.TextAlign;

                    if (col.RenderBackgroundFunction) {
                        td.style.background = col.RenderBackgroundFunction(data[col.Name], data);
                    }

                    if (col.RenderFunction) {
                        td.innerHTML = col.RenderFunction(data[col.Name], data);
                    } else if (col.RenderHTMLFunction) {
                        td.appendChild(col.RenderHTMLFunction(data[col.Name], data));
                    }
                    else {
                        if (data[col.Name] == undefined) {
                            td.innerHTML = "";
                        } else {
                            td.innerHTML = data[col.Name];
                        }
                    }
                    td.title = td.innerHTML;
                    td.style.width = Math.round(col.MinWidth + self.increase) + "px";
                    td.style.maxWidth = td.style.width;
                    td.style.minWidth = td.style.width;

                    if (col.Editable == true) {
                        //td.onclick = () => {
                        //self.editRow(tr, data);                            
                        //}
                        td.innerHTML = "";

                        if (col.EditFunction) {
                            td.appendChild(col.EditFunction(data[col.Name], data));
                        } else {

                            if (col.Type == 'character' || col.Type == 'password') {
                                let validator = Framework.Form.Validator.NoValidation();
                                if (col.Validator) {
                                    validator = col.Validator;
                                }
                                if (data[col.Name] == undefined) {
                                    data[col.Name] = "";
                                }
                                let input = Framework.Form.InputText.Create(data[col.Name], (x, y) => {
                                    if (input.IsValid == true) {
                                        input.HtmlElement.style.background = "transparent";
                                        self.updateData(data, col.Name, x);
                                        if (col.OnChangeFunction) {
                                            col.OnChangeFunction(data);
                                        }

                                    } else {
                                        input.HtmlElement.style.background = "rgba(255, 0, 0, 0.5);";
                                    }
                                }, validator, true, ['tableInput']);
                                input.HtmlElement.style.background = "transparent";
                                input.HtmlElement.style.border = "0";
                                if (col.RemoveSpecialCharacters == true) {
                                    input.RemoveSpecialCharacters = true;
                                }
                                if (col.Type == 'password') {
                                    (<HTMLInputElement>input.HtmlElement).type = "password";
                                }
                                td.appendChild(input.HtmlElement);
                            }
                           

                            if (col.Type == 'html') {

                                //TOFIX

                                let validator = Framework.Form.Validator.NoValidation();
                                if (col.Validator) {
                                    validator = col.Validator;
                                }
                                if (data[col.Name] == undefined) {
                                    data[col.Name] = "";
                                }
                                //let input = Framework.Form.InputText.Create(data[col.Name], (x, y) => {
                                //    if (input.IsValid == true) {
                                //        input.HtmlElement.style.background = "transparent";
                                //        self.updateData(data, col.Name, x);
                                //    } else {
                                //        input.HtmlElement.style.background = "rgba(255, 0, 0, 0.5);";
                                //    }
                                //}, validator, true, ['tableInput']);

                                let input = document.createElement("div");
                                input.innerHTML = data[col.Name];
                                input.style.boxSizing = "border-box";
                                input.style.display = "table-cell";
                                input.style.textOverflow = "ellipsis";
                                input.style.whiteSpace = "pre-wrap";

                                input.contentEditable = "true";
                                input.addEventListener('mouseup', function (e) {
                                    // Sélection
                                    input.focus();
                                    Framework.InlineHTMLEditor.Show(() => {
                                        data[col.Name] = input.innerHTML;
                                    });
                                }, false);
                                input.addEventListener('keydown', function (e) {
                                    if (e.keyCode == 13) {
                                        e.preventDefault();
                                    }
                                });
                                input.addEventListener('keyup', function (e) {
                                    data[col.Name] = input.innerHTML;
                                });
                                input.addEventListener('DOMNodeInserted', function (e) {
                                    data[col.Name] = input.innerHTML;
                                });
                                input.addEventListener('DOMNodeRemoved', function (e) {
                                    data[col.Name] = input.innerHTML;
                                });

                                //input.HtmlElement.addEventListener('mouseup', function (e) {
                                //    // Sélection
                                //    let selection: string = window.getSelection().toString();
                                //    //if (selection.length > 0) {
                                //    Framework.InlineHTMLEditor.ShowInControl(input.HtmlElement);
                                //    //} 
                                //}, false);

                                input.style.background = "transparent";
                                input.style.border = "0";
                                td.appendChild(input);
                            }

                            if (col.Type == 'integer' || col.Type == 'number' || col.Type == 'positiveInteger') {
                                let validator = Framework.Form.Validator.IsNumber(col.Type);
                                if (col.Validator) {
                                    validator = col.Validator;
                                }
                                if (data[col.Name] == undefined && col.DefaultValue) {
                                    data[col.Name] = col.DefaultValue;
                                }
                                let input = Framework.Form.InputText.Create(data[col.Name], (x, y) => {
                                    if (input.IsValid == true) {
                                        input.HtmlElement.style.background = "transparent";
                                        self.updateData(data, col.Name, x);
                                        if (col.OnChangeFunction) {
                                            col.OnChangeFunction(data);
                                        }
                                    } else {
                                        input.HtmlElement.style.background = "rgba(255, 0, 0, 0.5);";
                                    }
                                }, validator, true, ['tableInput']);
                                input.HtmlElement.style.background = "transparent";
                                input.HtmlElement.style.border = "0";
                                td.appendChild(input.HtmlElement);
                            }

                            if (col.Type == 'enum') {
                                let validator = Framework.Form.Validator.NotEmpty();
                                if (col.Validator) {
                                    validator = col.Validator;
                                }
                                if (data[col.Name] == undefined) {
                                    data[col.Name] = "";
                                }

                                let select = Framework.Form.Select.Render(data[col.Name], col.EnumValues, validator, (x) => {
                                    self.updateData(data, col.Name, x);
                                    if (col.OnChangeFunction) {
                                        col.OnChangeFunction(data);
                                    }
                                }, false, ["tableInput"]).HtmlElement;
                                select.style.background = "transparent";
                                select.style.border = "0";
                                td.appendChild(select);
                            }

                            if (col.Type == 'image') {
                                let validator = Framework.Form.Validator.NotEmpty();
                                if (col.Validator) {
                                    validator = col.Validator;
                                }

                                let setIcon = () => {
                                    if (data[col.Name] && data[col.Name].length > 0) {
                                        btn.HtmlElement.innerHTML = '<i class="far fa-folder"></i>';
                                        let img = document.createElement("img");
                                        img.src = data[col.Name];
                                        img.height = 100;
                                        Framework.Popup.Create(btn.HtmlElement, img, "right", "hover");
                                    } else {
                                        btn.HtmlElement.innerHTML = '<i class="far fa-folder-open"></i>';
                                    }
                                };

                                let btn = Framework.Form.Button.Create(() => { return true; }, (b) => {
                                    Framework.FileHelper.BrowseBinaries(".png,.jpg,.jpeg", (binaries) => {
                                        self.updateData(data, col.Name, binaries);
                                        if (col.OnChangeFunction) {
                                            col.OnChangeFunction(data);
                                        }
                                        setIcon();
                                    });
                                }, '<i class="far fa-folder-open"></i>', [], Framework.LocalizationManager.Get("ClickToEdit"));
                                btn.HtmlElement.style.background = "transparent";
                                btn.HtmlElement.style.border = "0";
                                setIcon();
                                td.appendChild(btn.HtmlElement);
                            }

                            if (col.Type == 'color') {
                                let validator = Framework.Form.Validator.NoValidation();
                                if (col.Validator) {
                                    validator = col.Validator;
                                }

                                let b = Framework.Form.PopupColorpickerButton.Render(() => { return true; }, (color) => {
                                    self.updateData(data, col.Name, Framework.Color.HexToColorName(color));
                                    if (col.OnChangeFunction) {
                                        col.OnChangeFunction(data);
                                    }
                                    //b.style.color = data[col.Name];
                                    b.style.background = data[col.Name];
                                    b.title = data[col.Name];
                                    //b.innerHTML = data[col.Name];
                                }, [], '', data[col.Name]).HtmlElement;
                                //b.innerHTML = data[col.Name];
                                b.innerHTML = "&nbsp;";
                                b.style.border = "0";
                                b.style.background = data[col.Name];
                                //b.style.color = data[col.Name];
                                b.style.textAlign = "left";
                                b.style.margin = "0";
                                b.style.padding = "0";
                                b.style.width = "50px";
                                b.title = data[col.Name];

                                td.appendChild(b);
                            }
                        }
                    }

                });

                return tr;
            }

            private insertRow(data: T, index: number = undefined) {
                let self = this;
                let tr = this.renderRow(data);
                if (index == undefined) {
                    self.tbody.appendChild(tr);
                } else {
                    self.tbody.insertBefore(tr, self.tbody.children[index])
                }
            }

            private setSelectUnselectAllButtonIcon() {
                if (this.btnToggleSelection) {
                    //if (this.SelectedData.length == this.displayedData.length) {
                    if (this.SelectedData.length == this.ListData.length) {
                        this.btnToggleSelection.HtmlElement.innerHTML = '<i class="far fa-square" style="border:1px solid black;color:transparent;background:darkblue"></i>';
                    } else {
                        this.btnToggleSelection.HtmlElement.innerHTML = '<i class="far fa-square" style="border:1px solid black;color:transparent;background:white"></i>';
                    }
                }
            }

            private setSelectionButtonIcon(b: Framework.Form.Button) {
                let data = b.CustomAttributes.Get("Data");
                let tr: HTMLTableRowElement = b.CustomAttributes.Get("Row");
                if (data["IsSelected"] == true) {
                    b.HtmlElement.innerHTML = '<i class="far fa-square" style="border:1px solid black;color:transparent;background:darkblue"></i>';
                    tr.classList.add("selectedRow");
                } else {
                    b.HtmlElement.innerHTML = '<i class="far fa-square" style="border:1px solid black;color:transparent;background:white"></i>';
                    tr.classList.remove("selectedRow");
                }
            }

            private toggleSelection() {

                //let nbChecked = this.SelectedData.length;
                let nbUnchecked = this.ListData.length - this.SelectedData.length;
                let toCheck = true;
                //let toCheck = false;

                //if (nbChecked == this.ListData.length) {
                if (nbUnchecked == 0) {
                    toCheck = false;
                    //toCheck = true;
                }

                let self = this;

                this.selectionButtons.forEach((x) => {
                    let d = x.CustomAttributes.Get("Data");
                    d["IsSelected"] = toCheck;
                    self.setSelectionButtonIcon(x);
                });

                this.setSelectUnselectAllButtonIcon();
                this.setFooter();

                this.OnSelectionChanged(this.SelectedData);
            }

            //public get SelectedData(): T[] { return this.displayedData.filter((x) => { return x["IsSelected"] == true }) }
            public get SelectedData(): T[] { return this.ListData.filter((x) => { return x["IsSelected"] == true }) }

            //public get DisplayedData(): T[] { return this.displayedData; }
            public get DisplayedData(): T[] { return this.ListData.filter((x) => { return x["Displayed"] == true }) }

            private setFooter() {
                let self = this;
                //if (this.ShowFooter == true || this.displayedData.length > this.MaxDisplayedRows) {
                if (this.ShowFooter == true || this.DisplayedData.length > this.MaxDisplayedRows) {
                    this.tfooterTd.innerHTML = "";
                    let span = document.createElement("span");
                    //span.innerHTML = Framework.LocalizationManager.Get("SelectedItems") + this.SelectedData.length + "/" + this.ListData.length;
                    span.innerHTML = Framework.LocalizationManager.Get("Lines") + " " + ((this.CurrentPage - 1) * this.MaxDisplayedRows + 1) + "-" + Math.min(((this.CurrentPage) * this.MaxDisplayedRows), this.DisplayedData.length) + "/" + this.DisplayedData.length;

                    if (this.CanSelect == true && this.OnSelectionChanged) {
                        span.innerHTML += " (" + Framework.LocalizationManager.Get("SelectedItems") + " : " + this.SelectedData.length + ")";
                    }

                    span.style.cssFloat = "left";
                    this.tfooterTd.appendChild(span);

                    //this.tfooterTd.innerHTML = Framework.LocalizationManager.Get("SelectedItems") + this.SelectedData.length + "/" + this.ListData.length;
                    //this.tfooterTd.innerHTML = Framework.LocalizationManager.Get("SelectedItems") + this.SelectedData.length + "/" + this.DisplayedData.length;
                    //if (this.displayedData.length > this.MaxDisplayedRows) {
                    if (this.DisplayedData.length > this.MaxDisplayedRows) {
                        //let nbPages = Math.floor(this.displayedData.length / this.MaxDisplayedRows);
                        let nbPages = Math.floor(this.DisplayedData.length / this.MaxDisplayedRows);
                        //let remainder = this.displayedData.length % this.MaxDisplayedRows;
                        let remainder = this.DisplayedData.length % this.MaxDisplayedRows;
                        if (remainder > 0) {
                            nbPages++;
                        }

                        let createButton = function (content: string, goToPageIndex: number) {
                            let b = document.createElement("button");
                            b.type = "button";
                            b.innerHTML = content;
                            b.style.marginRight = "10px";
                            b.style.cssFloat = "right";
                            b.style.border = "1px solid black";
                            b.setAttribute("page", goToPageIndex.toString());
                            b.style.height = "24px";
                            b.style.lineHeight = "24px";
                            b.style.width = "24px";
                            b.style.fontSize = "16px";
                            b.style.textAlign = "center";
                            b.style.padding = "0";
                            //if (self.CurrentPage != goToPageIndex) {
                            b.onclick = (x) => {
                                let page = Number((<HTMLButtonElement>x.currentTarget).getAttribute("page"));
                                self.CurrentPage = page;
                                self.renderRows();
                            }
                            //} else {
                            //    b.style.cursor = "none";
                            //    b.style.background = "darkblue";
                            //    b.style.color = "white";
                            //}
                            return b;
                        }

                        this.tfooterTd.appendChild(createButton('<i class="fas fa-angle-double-right"></i>', nbPages));
                        this.tfooterTd.appendChild(createButton('<i class="fas fa-angle-right"></i>', Math.min(nbPages, self.CurrentPage + 1)));
                        this.tfooterTd.appendChild(createButton('<i class="fas fa-angle-left"></i>', Math.max(1, self.CurrentPage - 1)));
                        this.tfooterTd.appendChild(createButton('<i class="fas fa-angle-double-left"></i>', 1));





                        //for (let i = nbPages; i > 0; i--) {
                        //    let span = document.createElement("button");
                        //    span.type = "button";
                        //    span.innerHTML = i.toString();
                        //    span.style.marginRight = "10px";
                        //    span.style.cssFloat = "right";
                        //    span.style.border = "1px solid darkblue";
                        //    span.setAttribute("page", i.toString());
                        //    span.style.height = "24px";
                        //    span.style.lineHeight = "24px";
                        //    span.style.width = "24px";
                        //    span.style.fontSize = "16px";
                        //    span.style.textAlign = "center";
                        //    span.style.padding = "0";
                        //    if (self.CurrentPage != i) {
                        //        span.onclick = (x) => {
                        //            let page = Number((<HTMLButtonElement>x.currentTarget).getAttribute("page"));
                        //            self.CurrentPage = page;
                        //            self.renderRows();
                        //        }
                        //    } else {
                        //        span.style.cursor = "none";
                        //        span.style.background = "darkblue";
                        //        span.style.color = "white";
                        //    }
                        //    this.tfooterTd.appendChild(span);
                        //}
                    }

                    if (this.AddFunction) {
                        let span = document.createElement("button");
                        span.type = "button";
                        span.innerHTML = '<i class="fas fa-plus-square"></i>';
                        span.style.marginRight = "10px";
                        span.style.cssFloat = "right";
                        span.style.border = "0";
                        span.style.background = "transparent";
                        span.style.height = "24px";
                        span.style.lineHeight = "24px";
                        span.style.width = "24px";
                        span.style.fontSize = "16px";
                        span.style.textAlign = "center";
                        span.style.padding = "0";
                        span.onclick = (x) => {
                            self.AddFunction();
                        }
                        this.tfooterTd.appendChild(span);
                    }

                    if (this.RemoveFunction) {
                        let span = document.createElement("button");
                        span.type = "button";
                        span.innerHTML = '<i class="fas fa-trash-alt"></i>';
                        span.style.marginRight = "10px";
                        span.style.cssFloat = "right";
                        span.style.border = "0";
                        span.style.background = "transparent";
                        span.style.height = "24px";
                        span.style.lineHeight = "24px";
                        span.style.width = "24px";
                        span.style.fontSize = "16px";
                        span.style.textAlign = "center";
                        span.style.padding = "0";
                        span.onclick = (x) => {
                            self.RemoveFunction();
                        }
                        this.tfooterTd.appendChild(span);
                    }

                    if (this.CanExport) {
                        let span = document.createElement("button");
                        span.type = "button";
                        span.innerHTML = '<i class="fas fa-file-excel"></i>';
                        span.style.marginRight = "10px";
                        span.style.cssFloat = "right";
                        span.style.border = "0";
                        span.style.background = "transparent";
                        span.style.height = "24px";
                        span.style.lineHeight = "24px";
                        span.style.width = "24px";
                        span.style.fontSize = "16px";
                        span.style.textAlign = "center";
                        span.style.padding = "0";
                        span.onclick = (x) => {
                            self.ExportTo("export", "xlsx");
                        }
                        this.tfooterTd.appendChild(span);
                    }


                }
            }

            //private onTitleClick(col: TableColumn, span: HTMLSpanElement) {

            //    if (col.Sortable == true || col.Filterable == true) {

            //        let self = this;
            //        let values = Framework.Array.Unique(self.ListData.map((x) => { return x[col.Name] }));
            //        col.Filter = Factory.Clone(values);
            //        span.onclick = () => {
            //            let values = Framework.Array.Unique(self.ListData.map((x) => { return x[col.Name] })).sort((a, b) => { if (a > b) return 1; return -1; });
            //            col.Filter = Factory.Clone(values);

            //            let div = Framework.Form.TextElement.Create("");

            //            if (col.Sortable == true) {

            //                let h4 = document.createElement("h3");
            //                h4.innerHTML = "Tri";
            //                div.HtmlElement.appendChild(h4);

            //                let checkbox1 = Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {
            //                    col.SortDirection = "asc";
            //                    let maxIndex = Math.max.apply(null, self.ListColumns.map((x) => { return x.SortIndex }));
            //                    if (isNaN(maxIndex)) {
            //                        maxIndex = 0;
            //                    }
            //                    col.SortIndex = maxIndex + 1;
            //                }, "Tri croissant", "", true, ["filterCb", "m1"]);
            //                div.Append(checkbox1);

            //                let checkbox2 = Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {
            //                    col.SortDirection = "desc";
            //                    let maxIndex = Math.max.apply(null, self.ListColumns.map((x) => { return x.SortIndex }));
            //                    if (isNaN(maxIndex)) {
            //                        maxIndex = 0;
            //                    }
            //                    col.SortIndex = maxIndex + 1;
            //                }, "Tri décroissant", "", true, ["filterCb", "m1"]);
            //                div.Append(checkbox2);

            //            }

            //            if (col.Filterable == true) {

            //                let h3 = document.createElement("h3");
            //                h3.innerHTML = "Filtres";
            //                div.HtmlElement.appendChild(h3);

            //                let show = function (x) {
            //                    if (x != null) {
            //                        return x;
            //                    } else {
            //                        return "-";
            //                    }
            //                }

            //                let checkboxes: Framework.Form.CheckBox[] = [];

            //                values.forEach((x) => {

            //                    let checkbox = Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {
            //                        if (cb.IsChecked == true) {
            //                            col.Filter.push(x);
            //                        } else {
            //                            Framework.Array.Remove(col.Filter, x);
            //                        }

            //                    }, show(x), "", col.Filter.indexOf(x) > -1, ["filterCb", "m1"]);
            //                    checkboxes.push(checkbox);
            //                    div.Append(checkbox);
            //                });


            //                let p = document.createElement("p");
            //                div.HtmlElement.appendChild(p);

            //                let selectButton = Framework.Form.Button.Create(() => { return true; }, (btn) => {
            //                    if (col.Filter.length < values.length) {
            //                        col.Filter = Factory.Clone(values);
            //                        checkboxes.forEach((x) => { x.Check() })
            //                    } else {
            //                        col.Filter = [];
            //                        checkboxes.forEach((x) => { x.Uncheck() })
            //                    }
            //                }, Framework.LocalizationManager.Get("SelectUnselectAll"), ['btnFilterSelect'], Framework.LocalizationManager.Get("SelectUnselectAll"));
            //                p.appendChild(selectButton.HtmlElement);

            //            }

            //            let okButton = Framework.Form.Button.Create(() => { return true; }, (btn) => {
            //                self.CurrentPage = 1;
            //                self.renderRows();
            //                modal.Close();
            //            }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("ApplyFilter"));

            //            let modal = Modal.Custom(div.HtmlElement, Framework.LocalizationManager.Format("FilterBy", [col.Name]), [okButton], "300px", "300px", false, false, true);
            //            modal.Float('');
            //            let rect = span.getBoundingClientRect();
            //            modal.SetPosition(rect.left, rect.top);
            //            modal.OnClose = () => {
            //                self.renderRows();
            //            };
            //        }
            //    }
            //}

            private getFilterButton(col: TableColumn): Framework.Form.Button {

                let self = this;

                let values = Framework.Array.Unique(self.ListData.map((x) => { return x[col.Name] }));
                col.Filter = Factory.Clone(values);

                let setFilterIcon = (col: TableColumn) => {
                    if (col.Filter.length == values.length) {
                        b.HtmlElement.innerHTML = '<i class="fa fa-filter" style="width:1px"></i>';
                    } else {
                        b.HtmlElement.innerHTML = '<i class="fa fa-filter" style="width:1px;color:lightblue"></i>';
                    }
                }

                let b = Framework.Form.Button.Create(() => { return true; }, (btn) => {

                    values = Framework.Array.Unique(self.ListData.map((x) => { return x[col.Name] })).sort((a, b) => { if (a > b) return 1; return -1; });
                    col.Filter = Factory.Clone(values);

                    let div = Framework.Form.TextElement.Create("");

                    let show = function (x) {
                        if (x != null) {
                            return x;
                        } else {
                            return "-";
                        }
                    }

                    let checkboxes: Framework.Form.CheckBox[] = [];

                    values.forEach((x) => {

                        let checkbox = Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {
                            if (cb.IsChecked == true) {
                                col.Filter.push(x);
                            } else {
                                Framework.Array.Remove(col.Filter, x);
                            }

                        }, show(x), "", col.Filter.indexOf(x) > -1, ["filterCb", "m1"]);
                        checkboxes.push(checkbox);
                        div.Append(checkbox);
                    });



                    let okButton = Framework.Form.Button.Create(() => { return true; }, (btn) => {
                        self.CurrentPage = 1;
                        self.renderRows();
                        modal.Close();
                    }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("ApplyFilter"));

                    let selectButton = Framework.Form.Button.Create(() => { return true; }, (btn) => {
                        if (col.Filter.length < values.length) {
                            col.Filter = Factory.Clone(values);
                            checkboxes.forEach((x) => { x.Check() })
                        } else {
                            col.Filter = [];
                            checkboxes.forEach((x) => { x.Uncheck() })
                        }
                    }, Framework.LocalizationManager.Get("SelectUnselectAll"), ['btnFilterSelect'], Framework.LocalizationManager.Get("SelectUnselectAll"));

                    let modal = Modal.Custom(div.HtmlElement, Framework.LocalizationManager.Format("FilterBy", [col.Name]), [selectButton, okButton], "300px", "300px", false, false, true);
                    modal.Float('');
                    let rect = btn.HtmlElement.getBoundingClientRect();
                    modal.SetPosition(rect.left, rect.top);
                    modal.OnClose = () => {
                        setFilterIcon(col);
                        self.renderRows();
                    };

                }, "", [], Framework.LocalizationManager.Get("Filter"));

                b.HtmlElement.style.background = "transparent";
                b.HtmlElement.style.border = "0";
                b.CustomAttributes.Add("TableColumn", col);
                setFilterIcon(col);

                return b;

            }

            private getSortButton(col: TableColumn): Framework.Form.Button {
                // Bouton tri
                let self = this;

                let setSortIcon = (col: TableColumn) => {
                    if (col.SortDirection == "none") {
                        b1.HtmlElement.innerHTML = '<i class="fa fa-sort" style="width:1px"></i>';
                        b1.HtmlElement.title = Framework.LocalizationManager.Get("ClickToSortAsc");
                    }
                    if (col.SortDirection == "asc") {
                        b1.HtmlElement.innerHTML = '<i class="fa fa-sort-up" style="width:1px"></i>';
                        b1.HtmlElement.title = Framework.LocalizationManager.Get("ClickToSortDesc");
                    }
                    if (col.SortDirection == "desc") {
                        b1.HtmlElement.innerHTML = '<i class="fa fa-sort-desc" style="width:1px"></i>';
                        b1.HtmlElement.title = Framework.LocalizationManager.Get("ClickToCancelSort");
                    }
                }

                let b1 = Framework.Form.Button.Create(() => { return true; }, (btn) => {
                    if (col.SortDirection == "none") {
                        col.SortDirection = "asc";
                    } else if (col.SortDirection == "asc") {
                        col.SortDirection = "desc";
                    } else if (col.SortDirection == "desc") {
                        col.SortDirection = "none";
                        col.SortIndex = undefined;
                    }

                    // Ordre des filtres
                    let maxIndex = Math.max.apply(null, self.ListColumns.map((x) => { return x.SortIndex }));
                    if (isNaN(maxIndex)) {
                        maxIndex = 0;
                    }
                    col.SortIndex = maxIndex + 1;


                    setSortIcon(col);
                    self.renderRows();
                }, "", [], Framework.LocalizationManager.Get("Sort"));


                setSortIcon(col);
                b1.HtmlElement.style.background = "transparent";
                b1.HtmlElement.style.border = "0";
                b1.CustomAttributes.Add("TableColumn", col);

                return b1;
            }

            public Refresh(listData: T[] = undefined) {
                let self = this;

                if (listData == undefined) {
                    this.renderRows();
                    return;
                }

                // MAJ ligne
                listData.forEach((data) => {
                    let row = <HTMLTableRowElement>data["Row"];
                    let newRow = self.renderRow(data);
                    row.parentNode.replaceChild(newRow, row);
                });
            }

            public Insert(listData: T[], index: number = 0) {
                let self = this;

                listData.forEach((data) => {
                    // Ajout donnée
                    data["IsSelected"] = false;
                    data["Displayed"] = true;
                    //self.displayedData.push(data);
                    self.ListData.push(data);

                    // Ajout ligne
                    self.insertRow(data, index);
                    if (index != undefined) {
                        index++;
                    }
                });

                self.setFooter();
                self.OnSelectionChanged([]);
            }

            public Remove(listData: T[]) {
                let self = this;

                let removedData = [];

                listData.forEach((data) => {
                    // Suppression de la donnée
                    //Framework.Array.Remove(self.displayedData, data);
                    //Framework.Array.Remove(self.DisplayedData, data);
                    Framework.Array.Remove(self.ListData, data);
                    // Suppression de la ligne
                    self.tbody.removeChild(data["Row"]);
                    removedData.push(data);
                });

                self.setFooter();
                self.OnSelectionChanged(self.SelectedData);

            }

            private updateData(data: T, propertyName: string, newValue: any, updateUI: boolean = true) {
                // Mémorisation
                let oldValue = data[propertyName];

                // MAJ donnée
                data[propertyName] = newValue;

                this.OnDataUpdated(data, propertyName, oldValue, newValue);
            }

            public UpdateData(data: T, propertyName: string, newValue: any) {
                this.updateData(data, propertyName, newValue);
            }

            public DisableAndAddRefreshIcon(callback: Function) {
                let self = this;
                if (this.isEnable == true) {
                    this.isEnable = false;
                    this.table.classList.add('tableLoading');

                    let handleMouseDown = () => {
                        self.isEnable = true;
                        self.table.removeEventListener("click", handleMouseDown, true);
                        self.table.classList.remove('tableLoading');
                        callback();
                    }

                    this.table.removeEventListener("click", handleMouseDown, true);
                    this.table.addEventListener("click", handleMouseDown, true);
                }
            }

            public Disable() {
                this.table.classList.add('tableDisabled');
            }

            public Enable() {
                this.table.classList.remove('tableDisabled');
            }

            //public RemoveSelection(callback: (selection: T[]) => void = undefined) {
            //    let self = this;
            //    let removedData: T[] = [];
            //    this.SelectedData.forEach((x) => {
            //        removedData.push(x);
            //        // Suppression de la donnée
            //        Framework.Array.Remove(self.displayedData, x);
            //        // Suppression de la ligne
            //        self.tbody.removeChild(x["Row"]);
            //    });

            //    self.setFooter();
            //    self.OnSelectionChanged([]);

            //    if (callback) {
            //        callback(removedData);
            //    }

            //}

            //private editRow(tr:HTMLTableRowElement, data:T) {

            //    let rect = tr.getBoundingClientRect();

            //    let table = document.createElement("table");
            //    table.classList.add("tableScroll");
            //    table.style.height = rect.height + 20 + "px";
            //    table.style.maxHeight = rect.height + 20 + "px";
            //    table.style.width = rect.width + "px";
            //    table.style.maxWidth = rect.width + "px";                
            //    //table.style.border = "1px solid blue";

            //    let tbody = document.createElement("tbody");
            //    table.appendChild(tbody);

            //    let tr1 = document.createElement("tr");
            //    tbody.appendChild(tr1);

            //    let self = this;

            //    let colspan = 0;

            //    if (self.CanSelect == true) {
            //        let td = document.createElement("td");
            //        td.classList.add("tableSelectionCell");
            //        td.style.background = "lightblue";

            //        let btn = Framework.Form.Button.Create(() => { return true; }, (b) => {     
            //            //TODO : afficher aide                   
            //        }, '<i class="far fa-edit" style="border:1px solid black;color:transparent;"></i>', [], Framework.LocalizationManager.Get("Help"));
            //        btn.HtmlElement.style.background = "transparent";
            //        btn.HtmlElement.style.border = "0";
            //        btn.HtmlElement.style.textAlign = "center";
            //        td.appendChild(btn.HtmlElement);

            //        tr1.appendChild(td);

            //        colspan++;
            //    }

            //    self.ListColumns.forEach((col) => {

            //        let td = document.createElement("td");
            //        tr1.appendChild(td);
            //        td.style.width = col.Width;
            //        td.style.maxWidth = col.Width;
            //        td.style.background = "lightblue";
            //        //td.style.borderLeft = "1px solid gray";

            //        if (col.Editable == true) {
            //            td.innerHTML = data[col.Name];
            //            //TODO : contrôle spécifique
            //        } else {
            //            td.innerHTML = data[col.Name];
            //        }

            //        colspan++;
            //    });

            //    let tr2 = document.createElement("tr");
            //    tr2.style.height = "20px";
            //    tr2.style.margin = "0";
            //    tbody.appendChild(tr2);
            //    let td = document.createElement("td");
            //    td.style.height = "20px";
            //    td.style.margin = "0";
            //    td.vAlign = "top";
            //    tr2.appendChild(td);
            //    td.colSpan = colspan;
            //    let btnPrev = Framework.Form.Button.Create(() => { return true; }, (b) => {
            //        //TODO           
            //    }, '<i class="fas fa-arrow-circle-left" style="font-size:8px" > </i>', ["editRowButton"], Framework.LocalizationManager.Get("Previous"));
            //    let btnNext = Framework.Form.Button.Create(() => { return true; }, (b) => {
            //        //TODO 
            //    }, '<i class="fas fa-arrow-circle-right" style="font-size:8px" > </i>', ["editRowButton"], Framework.LocalizationManager.Get("Next"));
            //    td.appendChild(btnPrev.HtmlElement);
            //    td.appendChild(btnNext.HtmlElement);
            //    //TODO : bouton valider, suivant, précédent



            //    let modal = Modal.Custom(table, undefined, undefined, rect.height + 20 + "px", rect.width + 2 + "px", false, false, true);
            //    modal.Float('');
            //    modal.Body.style.overflow = "hidden";
            //    modal.Body.style.margin = "0";
            //    modal.Body.style.padding = "0";
            //    modal.Body.style.background = "transparent";
            //    modal.SetPosition(rect.left - 2, rect.top - rect.height + 4);
            //    modal.OnClose = () => {
            //        //OnRowChanged
            //    };

            //}

            //public AddColumnDefinitions(columnDefs: object[]) {
            //    //let self = this;
            //    //columnDefs.forEach((x) => {
            //    //    self.DataTable.ListColumns.push(x);
            //    //});
            //    //self.DataTable.draw();
            //}

            //public SetItems(items: any[]) {
            //    //let self = this;
            //    //self.DataTable.clear();
            //    //items.forEach((item) => {
            //    //    //self.DataTable.row.add(item).draw();
            //    //    self.DataTable.row.add(item);
            //    //});
            //    //self.setPagination();
            //}

            //public Refresh() {
            //    //this.SetItems(this.ListData);
            //}

            //private setPagination() {

            //    let self = this;

            //    if (self.parameters.Paging == false) {
            //        $('.dataTables_info').hide();
            //        return;
            //    }

            //    var info = self.DataTable.page.info();
            //    if ($('#' + self.HtmlTable.id + ' tr').length < self.parameters.PageLength && info.pages == 1) {
            //        $('.dataTables_paginate').hide();
            //    } else {
            //        $('.dataTables_paginate').show();
            //    }


            //}

            //public AdjustSize() {
            //    let self = this;
            //    setTimeout(() => {
            //        self.DataTable.columns.adjust().draw();
            //    }, 100);

            //}

            public Export(filename: string, customFormats: any[] = undefined) {

                //TODO : bouton OK, annuler

                let format: string = "XLSX";
                let content = document.createElement("div");
                let formats = ["XLSX", "CSV",/*, "PDF"*/];
                let customF = [];
                if (customFormats) {
                    customFormats.forEach((x) => {
                        formats.push(x.name);
                        customF.push(x.name);
                    });
                }

                let t = document.createElement("div");
                t.innerHTML = Framework.LocalizationManager.Get("ChooseFileFormat")
                content.appendChild(t);

                let select = Framework.Form.Select.Render(format, Framework.KeyValuePair.FromArray(formats), Framework.Form.Validator.NotEmpty(), (x) => { format = x; }, false);
                select.HtmlElement.style.width = "100%";
                content.appendChild(select.HtmlElement);
                let self = this;

                Framework.Modal.Confirm(Framework.LocalizationManager.Get("ExportTable"), content, () => {
                    if (format == "XLSX") {

                        self.ExportTo(filename, "xlsx");

                        // $('#' + this.HtmlTable.id + "_wrapper").find('.buttons-excel').click();
                    }
                    if (format == "CSV") {
                        self.ExportTo(filename, "csv");
                        //$('#' + this.HtmlTable.id + "_wrapper").find('.buttons-csv').click();
                    }

                    if (customF.indexOf(format) > -1) {
                        let f = customFormats.filter((x) => { return x.name == format })[0].func;
                        f();
                    }

                    //if (format == "PDF") {
                    //    $('#' + this.HtmlTable.id + "_wrapper").find('.buttons-csv').click();
                    //}
                });
            }

            //public Copy() {
            //    //let l = $('#' + this.HtmlTable.id + "_wrapper").find('.buttons-csv').click();
            //}

            //public Select(selectedData: any[]) {

            //    //if (selectedData.length == 0) {
            //    //    return;
            //    //}

            //    //let self = this;
            //    //// Sélection initiale
            //    //this.DataTable.column(0).nodes().each(function (cell, i) {
            //    //    let d = self.DataTable.row(i).data();
            //    //    if (selectedData.indexOf(d) > -1) {
            //    //        let cb: HTMLInputElement = cell.children[0];
            //    //        cb.click();
            //    //    }
            //    //});


            //}

            //public SelectAll() {
            //    //var cells = this.DataTable.cells().nodes();
            //    //$(cells).find(':checkbox').prop('checked', true);
            //    //let rows = this.DataTable.rows().nodes();
            //    //this.SelectedData = this.ListData;
            //    //this.parameters.OnSelectionChanged(this.SelectedData);
            //}

            //public UnselectAll() {
            //    //var cells = this.DataTable.cells().nodes();
            //    //$(cells).find(':checkbox').prop('checked', false);
            //    //this.SelectedData = [];
            //    //this.parameters.OnSelectionChanged(this.SelectedData);
            //}

            //public Enable() {
            //    //this.isEnabled = true;
            //}

            //public Disable() {
            //    //this.isEnabled = false;
            //}

            private getColumnNames(): Framework.KeyValuePair[] {
                let res: Framework.KeyValuePair[] = [];
                for (var i = 0; i < this.ListColumns.length; i++) {
                    if (this.ListColumns[i].Title.length > 0) {
                        var title = this.ListColumns[i].Title;
                        var data = this.ListColumns[i].Name;
                        res.push(new Framework.KeyValuePair(title, data));
                    }
                }
                return res;
            }

            //public GetColumnNames(): Framework.KeyValuePair[] {
            //    return this.getColumnNames();
            //}

            public GetAsArray(): string[][] {
                let self = this;
                let array: string[][] = [];

                let tabKvp = this.getColumnNames();

                let titleRow = tabKvp.map((x) => { return x.Key });
                let titleData = tabKvp.map((x) => { return x.Value });
                array.push(titleRow);

                this.ListData.forEach((x) => {
                    let row = [];
                    titleData.forEach((y) => {
                        let col = self.ListColumns.filter((c) => { return c.Name == y })[0];
                        if (col.RenderFunction) {
                            try {
                                let res = col.RenderFunction(x[y], x);
                                row.push(res);
                            }
                            catch (ex) {
                                row.push(x[y]);
                            }

                        } else {
                            row.push(x[y]);
                        }
                    });
                    array.push(row);
                });

                return array;
            }

            public GetAsArray2(): string[][] {
                let array: string[][] = [];

                for (var r = 0; r < this.table.rows.length; r++) {
                    let row = [];
                    let rr = this.table.rows[r];
                    for (var c = 0; c < rr.cells.length; c++) {
                        let cell = rr.cells[c];
                        row.push(cell.innerText);
                    }
                    array.push(row);
                }

                return array;
            }

            public ExportTo(filename: string, format: string): void {
                let wb = new Framework.ExportManager("", "", "");
                wb.AddWorksheet("1", this.GetAsArray());
                wb.Save(filename, format);
            }

            //public static OnEditDataTableCell(data: any, propertyName: string, pType: string, defaultValue: any = undefined, kvp: Framework.KeyValuePair[] = [], customValidator: Framework.Form.Validator.CustomValidator = undefined) {

            //    if (data[propertyName] == undefined) {
            //        if (defaultValue) {
            //            data[propertyName] = defaultValue;
            //        } else {
            //            data[propertyName] = "";
            //        }
            //    }

            //    if (pType == 'Character') {
            //        let validator = Framework.Form.Validator.NoValidation();
            //        if (customValidator) {
            //            validator = customValidator;
            //        }
            //        return Framework.Form.InputText.Create(data[propertyName], (x) => {
            //            data[propertyName] = x;
            //        }, validator, false, ["tableInput"]).HtmlElement;
            //    }

            //    if (pType == 'Numeric') {
            //        let validator = Framework.Form.Validator.IsNumber();
            //        if (customValidator) {
            //            validator = customValidator;
            //        }
            //        return Framework.Form.InputText.Create(data[propertyName], (x) => {
            //            data[propertyName] = x;
            //        }, validator, false, ["tableInput"]).HtmlElement;
            //    }

            //    if (pType == 'Enumeration') {

            //        let validator = Framework.Form.Validator.NotEmpty();
            //        if (customValidator) {
            //            validator = customValidator;
            //        }

            //        return Framework.Form.Select.Render(data[propertyName], kvp, validator, (x) => {
            //            data[propertyName] = x;
            //        }, false, ["tableInput"]).HtmlElement;
            //    }

            //    //TODO Date, Boolean, couleur...

            //}

        }


        //export class TableColumn {
        //    public Name: string;
        //    public Type: string = "character";
        //    public Title: string = "";
        //    public Sortable: boolean = true;
        //    public Filterable: boolean = true;
        //    public Editable: boolean = true;
        //    public RenderFunction: (val: any, row: any) => string = undefined;
        //    public MinWidth: number = 200;
        //    public SortDirection: string = "none"; //asc;desc;none
        //    public SortIndex: number = undefined;
        //    public Filter: any[] = [];
        //    public EnumValues: Framework.KeyValuePair[] = [];
        //    public Validator: Framework.Form.Validator.CustomValidator = undefined;
        //    public RemoveSpecialCharacters: boolean = false;
        //    public DefaultValue: any;

        //}

        //export class Table<T> extends Form.ValidableElement {

        //    private displayedData: T[] = [];

        //    private tbody: HTMLTableSectionElement;
        //    private tfooter: HTMLTableSectionElement;
        //    private tfooterTd: HTMLTableCellElement;
        //    private availableWidth: number;

        //    private btnToggleSelection: Framework.Form.Button;

        //    private selectionButtons: Framework.Form.Button[] = [];

        //    public ListColumns: TableColumn[] = [];
        //    public ListData: T[] = [];
        //    public Height: string = "400px";
        //    public CanSelect: boolean = true;
        //    //public CanAdd: boolean = true;
        //    //public CanDelete: boolean = true;
        //    public ShowFooter: boolean = true;
        //    public OnSelectionChanged: (selection: T[]) => void = () => { };
        //    public OnDataUpdated: (data: T, propertyName: string, oldValue: any, newValue: any) => void = () => { };
        //    public FullWidth: boolean = true;

        //    public MaxDisplayedRows = 100;
        //    public CurrentPage: number = 1;

        //    public AddFunction: Function = undefined;
        //    public RemoveFunction: Function = undefined;

        //    private container: HTMLDivElement;
        //    private table: HTMLTableElement;
        //    private increase: number = 0;


        //    public Render(parent: HTMLElement, tableWidth: number = undefined) {

        //        let self = this;

        //        let parentWidth = parent.clientWidth;
        //        if (tableWidth) {
        //            parentWidth = tableWidth;
        //        }

        //        this.container = document.createElement("div");

        //        this.table = document.createElement("table");
        //        this.table.classList.add("tableScroll");

        //        let thead = document.createElement("thead");
        //        this.table.appendChild(thead);

        //        let trh = document.createElement("tr");
        //        thead.appendChild(trh);

        //        let nbCells = 0;
        //        let width: number = 0;
        //        let colWidth = 0;

        //        if (this.CanSelect == true) {
        //            let th = document.createElement("th");
        //            trh.appendChild(th);
        //            th.classList.add("tableSelectionCell");

        //            this.btnToggleSelection = Framework.Form.Button.Create(() => { return true; }, (btn) => {
        //                self.toggleSelection();
        //            }, '', [], Framework.LocalizationManager.Get("SelectUnselectAll"));
        //            this.btnToggleSelection.HtmlElement.style.background = "transparent";
        //            this.btnToggleSelection.HtmlElement.style.border = "0";
        //            this.btnToggleSelection.HtmlElement.style.textAlign = "center";

        //            th.appendChild(this.btnToggleSelection.HtmlElement);
        //            width += 30;
        //            colWidth = 30;
        //            nbCells++;
        //        }

        //        this.ListColumns.forEach((col) => { colWidth += col.MinWidth });

        //        let availableWidth: number = parentWidth - colWidth - 30;

        //        this.increase = availableWidth / this.ListColumns.length;

        //        if (this.FullWidth == false) {
        //            this.increase = 0;
        //        }

        //        this.ListColumns.forEach((col) => {

        //            let th = document.createElement("th");
        //            trh.appendChild(th);

        //            th.style.width = (col.MinWidth + self.increase) + "px";;
        //            th.style.maxWidth = th.style.width;


        //            if (col.Sortable == true || col.Filterable == true) {

        //                let span = document.createElement("span");
        //                span.innerText = col.Title;
        //                span.title = col.Title;
        //                span.style.cssFloat = "left";
        //                span.style.maxWidth = "30px";

        //                th.appendChild(span);

        //                if (col.Sortable == true) {
        //                    let sortButton = self.getSortButton(col);
        //                    sortButton.HtmlElement.style.cssFloat = "right";
        //                    th.appendChild(sortButton.HtmlElement);
        //                }

        //                if (col.Filterable == true) {
        //                    let filterButton = self.getFilterButton(col);
        //                    filterButton.HtmlElement.style.cssFloat = "right";
        //                    th.appendChild(filterButton.HtmlElement);
        //                }
        //            } else {
        //                th.style.textAlign = "center";
        //                th.innerText = col.Title;
        //            }

        //            nbCells++;
        //            width += col.MinWidth + self.increase;
        //        });

        //        let th = document.createElement("th");
        //        trh.appendChild(th);
        //        th.style.width = Framework.Browser.GetScrollbarWidth() + "px";
        //        th.innerHTML = "&nbsp;";

        //        this.tbody = document.createElement("tbody");
        //        this.tbody.style.maxHeight = this.Height;

        //        this.table.appendChild(this.tbody);

        //        if (this.ShowFooter == true) {
        //            this.tfooter = document.createElement("tfoot");
        //            this.table.appendChild(this.tfooter);
        //            let trf = document.createElement("tr");
        //            this.tfooter.appendChild(trf);
        //            this.tfooterTd = document.createElement("td");
        //            trf.appendChild(this.tfooterTd);
        //            this.tfooterTd.colSpan = nbCells;
        //            this.tfooterTd.style.borderTop = "1px solid gray";
        //            this.tfooterTd.style.padding = "3px";
        //        }

        //        this.renderRows();

        //        this.container.appendChild(this.table);

        //        parent.innerHTML = "";
        //        parent.appendChild(this.container);

        //        //thead.style.width = width + 30 + availableWidth + "px";
        //        thead.style.width = width + 30 + "px";
        //        this.tbody.style.width = thead.style.width;

        //        // TODO : Gestion événements clavier                
        //        //this.table.onkeydown = (ev) => {
        //        //    if (ev.keyCode == 40) {
        //        //        // Down Arrow

        //        //        let clickedInput = document.activeElement;                        
        //        //        let currentCell = <HTMLTableCellElement>clickedInput.parentElement;
        //        //        let currentRow = <HTMLTableRowElement>currentCell.parentElement;
        //        //        let currentCellIndex = currentCell.cellIndex;
        //        //        let currentRowIndex = currentRow.rowIndex;
        //        //        let nextCell = self.table.tBodies[0].children[currentRowIndex + 1].children[currentCellIndex];
        //        //        (<HTMLElement>nextCell.children[0]).focus();
        //        //    }
        //        //};


        //    }

        //    private renderRows() {

        //        let self = this;
        //        this.tbody.innerHTML = "";

        //        let orderedColumns = this.ListColumns.filter((x) => {
        //            return x.Sortable == true && x.SortDirection != "none"
        //        });

        //        let filteredColumns = this.ListColumns.filter((x) => {
        //            return x.Filter.length > 0 && x.Filterable == true
        //        });

        //        // Ajout de la propriété "Selected" a ListData
        //        this.ListData.forEach((x) => {
        //            if (x["IsSelected"] == undefined) {
        //                x["IsSelected"] = false;
        //            }
        //        });

        //        this.displayedData = this.ListData;

        //        // Filtres                
        //        if (filteredColumns.length > 0) {
        //            filteredColumns.forEach((x) => {
        //                if (x.Filter[0] != null) {
        //                    self.displayedData = self.displayedData.filter((y) => {
        //                        if (y[x.Name] == undefined) {
        //                            return true;
        //                        }
        //                        return x.Filter.indexOf(y[x.Name]) > -1
        //                    });
        //                }
        //            });
        //        }

        //        // Tri multiple
        //        if (orderedColumns.length > 0) {
        //            let sortCriterions = [];
        //            orderedColumns.forEach((x) => {
        //                let prefix = "";
        //                if (x.SortDirection == "desc") {
        //                    prefix = "-";
        //                }
        //                sortCriterions.push(prefix + x.Name);
        //            });

        //            self.displayedData = Framework.Array.MultipleSort(self.displayedData, sortCriterions);
        //        }



        //        //TODO : suppression de tri ?

        //        this.selectionButtons = [];
        //        let currentDataIndex = 0;
        //        let firstIndex = (self.CurrentPage - 1) * self.MaxDisplayedRows;
        //        let lastIndex = firstIndex + self.MaxDisplayedRows;
        //        self.displayedData.forEach((data) => {
        //            if (currentDataIndex >= firstIndex && currentDataIndex < lastIndex) {
        //                self.insertRow(data);
        //            }
        //            currentDataIndex++;
        //        });

        //        this.setSelectUnselectAllButtonIcon();
        //        this.setFooter();
        //    }

        //    private renderRow(data: T): HTMLTableRowElement {
        //        let self = this;
        //        let tr = document.createElement("tr");

        //        data["Row"] = tr;

        //        if (self.CanSelect == true) {
        //            let td = document.createElement("td");
        //            td.classList.add("tableSelectionCell");
        //            tr.appendChild(td);

        //            let btn = Framework.Form.Button.Create(() => { return true; }, (b) => {
        //                let d = b.CustomAttributes.Get("Data");
        //                d["IsSelected"] = !d["IsSelected"];
        //                self.setSelectionButtonIcon(b);
        //                self.setFooter();
        //                self.OnSelectionChanged(self.SelectedData);
        //            }, '', [], Framework.LocalizationManager.Get("SelectUnselect"));
        //            btn.HtmlElement.style.background = "transparent";
        //            btn.HtmlElement.style.border = "0";
        //            btn.HtmlElement.style.textAlign = "center";
        //            btn.CustomAttributes.Add("Data", data);
        //            btn.CustomAttributes.Add("Row", tr);
        //            self.setSelectionButtonIcon(btn);
        //            self.selectionButtons.push(btn);
        //            td.appendChild(btn.HtmlElement);
        //        }

        //        self.ListColumns.forEach((col) => {

        //            let td = document.createElement("td");
        //            tr.appendChild(td);
        //            if (col.RenderFunction) {
        //                td.innerHTML = col.RenderFunction(data[col.Name], data);
        //            } else {
        //                if (data[col.Name] == undefined) {
        //                    td.innerHTML = "";
        //                } else {
        //                    td.innerHTML = data[col.Name];
        //                }
        //            }
        //            td.style.width = (col.MinWidth + self.increase) + "px";
        //            td.style.maxWidth = td.style.width;

        //            if (col.Editable == true) {
        //                //td.onclick = () => {
        //                //self.editRow(tr, data);                            
        //                //}
        //                td.innerHTML = "";

        //                if (col.Type == 'character') {
        //                    let validator = Framework.Form.Validator.NoValidation();
        //                    if (col.Validator) {
        //                        validator = col.Validator;
        //                    }
        //                    if (data[col.Name] == undefined) {
        //                        data[col.Name] = "";
        //                    }
        //                    let input = Framework.Form.InputText.Create(data[col.Name], (x, y) => {
        //                        if (input.IsValid == true) {
        //                            input.HtmlElement.style.background = "transparent";
        //                            self.updateData(data, col.Name, x);
        //                        } else {
        //                            input.HtmlElement.style.background = "rgba(255, 0, 0, 0.5);";
        //                        }
        //                    }, validator, true, ['tableInput']);
        //                    input.HtmlElement.style.background = "transparent";
        //                    input.HtmlElement.style.border = "0";
        //                    input.HtmlElement.onclick = () => {
        //                        input.Select();
        //                    }
        //                    if (col.RemoveSpecialCharacters == true) {
        //                        input.RemoveSpecialCharacters = true;
        //                    }
        //                    td.appendChild(input.HtmlElement);
        //                }

        //                if (col.Type == 'html') {

        //                    //TOFIX

        //                    let validator = Framework.Form.Validator.NoValidation();
        //                    if (col.Validator) {
        //                        validator = col.Validator;
        //                    }
        //                    if (data[col.Name] == undefined) {
        //                        data[col.Name] = "";
        //                    }
        //                    //let input = Framework.Form.InputText.Create(data[col.Name], (x, y) => {
        //                    //    if (input.IsValid == true) {
        //                    //        input.HtmlElement.style.background = "transparent";
        //                    //        self.updateData(data, col.Name, x);
        //                    //    } else {
        //                    //        input.HtmlElement.style.background = "rgba(255, 0, 0, 0.5);";
        //                    //    }
        //                    //}, validator, true, ['tableInput']);

        //                    let input = document.createElement("div");
        //                    input.innerHTML = data[col.Name];
        //                    input.style.boxSizing = "border-box";
        //                    input.style.display = "table-cell";
        //                    input.style.textOverflow = "ellipsis";
        //                    input.style.whiteSpace = "pre-wrap";

        //                    input.contentEditable = "true";
        //                    input.addEventListener('mouseup', function (e) {
        //                        // Sélection
        //                        input.focus();
        //                        Framework.InlineHTMLEditor.Show(() => {
        //                            data[col.Name] = input.innerHTML;
        //                        });
        //                    }, false);
        //                    input.addEventListener('keydown', function (e) {
        //                        if (e.keyCode == 13) {
        //                            e.preventDefault();
        //                        }
        //                    });
        //                    input.addEventListener('keyup', function (e) {
        //                        data[col.Name] = input.innerHTML;
        //                    });
        //                    input.addEventListener('DOMNodeInserted', function (e) {
        //                        data[col.Name] = input.innerHTML;
        //                    });
        //                    input.addEventListener('DOMNodeRemoved', function (e) {
        //                        data[col.Name] = input.innerHTML;
        //                    });

        //                    //input.HtmlElement.addEventListener('mouseup', function (e) {
        //                    //    // Sélection
        //                    //    let selection: string = window.getSelection().toString();
        //                    //    //if (selection.length > 0) {
        //                    //    Framework.InlineHTMLEditor.ShowInControl(input.HtmlElement);
        //                    //    //} 
        //                    //}, false);

        //                    input.style.background = "transparent";
        //                    input.style.border = "0";
        //                    td.appendChild(input);
        //                }

        //                if (col.Type == 'integer' || col.Type == 'number' || col.Type == 'positiveInteger') {
        //                    let validator = Framework.Form.Validator.IsNumber(col.Type);
        //                    if (col.Validator) {
        //                        validator = col.Validator;
        //                    }
        //                    if (data[col.Name] == undefined && col.DefaultValue) {
        //                        data[col.Name] = col.DefaultValue;
        //                    }
        //                    let input = Framework.Form.InputText.Create(data[col.Name], (x, y) => {
        //                        if (input.IsValid == true) {
        //                            input.HtmlElement.style.background = "transparent";
        //                            self.updateData(data, col.Name, x);
        //                        } else {
        //                            input.HtmlElement.style.background = "rgba(255, 0, 0, 0.5);";
        //                        }
        //                    }, validator, true, ['tableInput']);
        //                    input.HtmlElement.style.background = "transparent";
        //                    input.HtmlElement.style.border = "0";
        //                    td.appendChild(input.HtmlElement);
        //                }

        //                if (col.Type == 'enum') {
        //                    let validator = Framework.Form.Validator.NotEmpty();
        //                    if (col.Validator) {
        //                        validator = col.Validator;
        //                    }
        //                    if (data[col.Name] == undefined) {
        //                        data[col.Name] = "";
        //                    }

        //                    let select = Framework.Form.Select.Render(data[col.Name], col.EnumValues, validator, (x) => {
        //                        self.updateData(data, col.Name, x);
        //                    }, false, ["tableInput"]).HtmlElement;
        //                    select.style.background = "transparent";
        //                    select.style.border = "0";
        //                    td.appendChild(select);
        //                }

        //                if (col.Type == 'image') {
        //                    let validator = Framework.Form.Validator.NotEmpty();
        //                    if (col.Validator) {
        //                        validator = col.Validator;
        //                    }

        //                    let setIcon = () => {
        //                        if (data[col.Name] && data[col.Name].length > 0) {
        //                            btn.HtmlElement.innerHTML = '<i class="far fa-folder"></i>';
        //                            let img = document.createElement("img");
        //                            img.src = data[col.Name];
        //                            img.height = 100;
        //                            Framework.Popup.Create(btn.HtmlElement, img, "right", "hover");
        //                        } else {
        //                            btn.HtmlElement.innerHTML = '<i class="far fa-folder-open"></i>';
        //                        }
        //                    };

        //                    let btn = Framework.Form.Button.Create(() => { return true; }, (b) => {
        //                        Framework.FileHelper.BrowseBinaries(".png,.jpg,.jpeg", (binaries) => {
        //                            self.updateData(data, col.Name, binaries);
        //                            setIcon();
        //                        });
        //                    }, '<i class="far fa-folder-open"></i>', [], Framework.LocalizationManager.Get("ClickToEdit"));
        //                    btn.HtmlElement.style.background = "transparent";
        //                    btn.HtmlElement.style.border = "0";
        //                    setIcon();
        //                    td.appendChild(btn.HtmlElement);
        //                }

        //                if (col.Type == 'color') {
        //                    let validator = Framework.Form.Validator.NoValidation();
        //                    if (col.Validator) {
        //                        validator = col.Validator;
        //                    }

        //                    let b = Framework.Form.PopupColorpickerButton.Render(() => { return true; }, (color) => {
        //                        self.updateData(data, col.Name, Framework.Color.HexToColorName(color));
        //                        //b.style.color = data[col.Name];
        //                        b.style.background = data[col.Name];
        //                        b.title = data[col.Name];
        //                        //b.innerHTML = data[col.Name];
        //                    }, [], '', data[col.Name]).HtmlElement;
        //                    //b.innerHTML = data[col.Name];
        //                    b.innerHTML = "&nbsp;";
        //                    b.style.border = "0";
        //                    b.style.background = data[col.Name];
        //                    //b.style.color = data[col.Name];
        //                    b.style.textAlign = "left";
        //                    b.style.margin = "0";
        //                    b.style.padding = "0";
        //                    b.style.width = "50px";
        //                    b.title = data[col.Name];

        //                    td.appendChild(b);
        //                }


        //            }

        //        });

        //        return tr;
        //    }

        //    private insertRow(data: T, index: number = undefined) {
        //        let self = this;
        //        let tr = this.renderRow(data);
        //        if (index == undefined) {
        //            self.tbody.appendChild(tr);
        //        } else {
        //            self.tbody.insertBefore(tr, self.tbody.children[index])
        //        }
        //    }

        //    private setSelectUnselectAllButtonIcon() {
        //        if (this.btnToggleSelection) {
        //            if (this.SelectedData.length == this.displayedData.length) {
        //                this.btnToggleSelection.HtmlElement.innerHTML = '<i class="far fa-square" style="border:1px solid black;color:transparent;background:darkblue"></i>';
        //            } else {
        //                this.btnToggleSelection.HtmlElement.innerHTML = '<i class="far fa-square" style="border:1px solid black;color:transparent;background:white"></i>';
        //            }
        //        }
        //    }

        //    private setSelectionButtonIcon(b: Framework.Form.Button) {
        //        let data = b.CustomAttributes.Get("Data");
        //        let tr: HTMLTableRowElement = b.CustomAttributes.Get("Row");
        //        if (data["IsSelected"] == true) {
        //            b.HtmlElement.innerHTML = '<i class="far fa-square" style="border:1px solid black;color:transparent;background:darkblue"></i>';
        //            tr.classList.add("selectedRow");
        //        } else {
        //            b.HtmlElement.innerHTML = '<i class="far fa-square" style="border:1px solid black;color:transparent;background:white"></i>';
        //            tr.classList.remove("selectedRow");
        //        }
        //    }

        //    private toggleSelection() {

        //        let nbChecked = this.SelectedData.length;
        //        let toCheck = true;

        //        if (nbChecked == this.displayedData.length) {
        //            toCheck = false;
        //        }

        //        let self = this;

        //        this.selectionButtons.forEach((x) => {
        //            let d = x.CustomAttributes.Get("Data");
        //            d["IsSelected"] = toCheck;
        //            self.setSelectionButtonIcon(x);
        //        });

        //        this.setSelectUnselectAllButtonIcon();
        //        this.setFooter();

        //        this.OnSelectionChanged(this.SelectedData);
        //    }

        //    public get SelectedData(): T[] { return this.displayedData.filter((x) => { return x["IsSelected"] == true }) }

        //    public get DisplayedData(): T[] { return this.displayedData; }

        //    private setFooter() {
        //        let self = this;
        //        if (this.ShowFooter == true || this.displayedData.length > this.MaxDisplayedRows) {
        //            this.tfooterTd.innerHTML = "";
        //            let span = document.createElement("span");
        //            span.innerHTML = Framework.LocalizationManager.Get("SelectedItems") + this.SelectedData.length + "/" + this.ListData.length;
        //            span.style.cssFloat = "left";
        //            this.tfooterTd.appendChild(span);

        //            this.tfooterTd.innerHTML = Framework.LocalizationManager.Get("SelectedItems") + this.SelectedData.length + "/" + this.ListData.length;
        //            if (this.displayedData.length > this.MaxDisplayedRows) {
        //                let nbPages = Math.floor(this.displayedData.length / this.MaxDisplayedRows);
        //                let remainder = this.displayedData.length % this.MaxDisplayedRows;
        //                if (remainder > 0) {
        //                    nbPages++;
        //                }
        //                for (let i = nbPages; i > 0; i--) {
        //                    let span = document.createElement("button");
        //                    span.type = "button";
        //                    span.innerHTML = i.toString();
        //                    span.style.marginRight = "10px";
        //                    span.style.cssFloat = "right";
        //                    span.style.border = "1px solid darkblue";
        //                    span.setAttribute("page", i.toString());
        //                    span.style.height = "24px";
        //                    span.style.lineHeight = "24px";
        //                    span.style.width = "24px";
        //                    span.style.fontSize = "16px";
        //                    span.style.textAlign = "center";
        //                    span.style.padding = "0";
        //                    if (self.CurrentPage != i) {
        //                        span.onclick = (x) => {
        //                            let page = Number((<HTMLButtonElement>x.currentTarget).getAttribute("page"));
        //                            self.CurrentPage = page;
        //                            self.renderRows();
        //                        }
        //                    } else {
        //                        span.style.cursor = "none";
        //                        span.style.background = "darkblue";
        //                        span.style.color = "white";
        //                    }
        //                    this.tfooterTd.appendChild(span);
        //                }
        //            }

        //            if (this.AddFunction) {
        //                let span = document.createElement("button");
        //                span.type = "button";
        //                span.innerHTML = '<i class="fas fa-plus-square"></i>';
        //                span.style.marginRight = "10px";
        //                span.style.cssFloat = "right";
        //                span.style.border = "0";
        //                span.style.background = "transparent";
        //                span.style.height = "24px";
        //                span.style.lineHeight = "24px";
        //                span.style.width = "24px";
        //                span.style.fontSize = "16px";
        //                span.style.textAlign = "center";
        //                span.style.padding = "0";
        //                span.onclick = (x) => {
        //                    self.AddFunction();
        //                }
        //                this.tfooterTd.appendChild(span);
        //            }

        //            if (this.RemoveFunction) {
        //                let span = document.createElement("button");
        //                span.type = "button";
        //                span.innerHTML = '<i class="fas fa-trash-alt"></i>';
        //                span.style.marginRight = "10px";
        //                span.style.cssFloat = "right";
        //                span.style.border = "0";
        //                span.style.background = "transparent";
        //                span.style.height = "24px";
        //                span.style.lineHeight = "24px";
        //                span.style.width = "24px";
        //                span.style.fontSize = "16px";
        //                span.style.textAlign = "center";
        //                span.style.padding = "0";
        //                span.onclick = (x) => {
        //                    self.RemoveFunction();
        //                }
        //                this.tfooterTd.appendChild(span);
        //            }
        //        }
        //    }

        //    private getFilterButton(col: TableColumn): Framework.Form.Button {

        //        let self = this;

        //        let values = Framework.Array.Unique(self.ListData.map((x) => { return x[col.Name] }));
        //        col.Filter = Factory.Clone(values);

        //        let setFilterIcon = (col: TableColumn) => {
        //            if (col.Filter.length == values.length) {
        //                b.HtmlElement.innerHTML = '<i class="fa fa-filter" style="width:1px"></i>';
        //            } else {
        //                b.HtmlElement.innerHTML = '<i class="fa fa-filter" style="width:1px;color:lightblue"></i>';
        //            }
        //        }

        //        let b = Framework.Form.Button.Create(() => { return true; }, (btn) => {

        //            values = Framework.Array.Unique(self.ListData.map((x) => { return x[col.Name] })).sort((a, b) => { if (a < b) return -1; else return 1; });
        //            col.Filter = Factory.Clone(values);

        //            let div = Framework.Form.TextElement.Create("");

        //            let checkboxes: Framework.Form.CheckBox[] = [];
        //            values.forEach((x) => {

        //                let checkbox = Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {
        //                    if (cb.IsChecked == true) {
        //                        col.Filter.push(x);
        //                    } else {
        //                        Framework.Array.Remove(col.Filter, x);
        //                    }

        //                }, x, "", col.Filter.indexOf(x) > -1, ["filterCb", "m1"]);
        //                checkboxes.push(checkbox);
        //                div.Append(checkbox);
        //            });

        //            let okButton = Framework.Form.Button.Create(() => { return true; }, (btn) => {
        //                self.renderRows();
        //                modal.Close();
        //            }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("ApplyFilter"));

        //            let selectButton = Framework.Form.Button.Create(() => { return true; }, (btn) => {
        //                if (col.Filter.length < values.length) {
        //                    col.Filter = Factory.Clone(values);
        //                    checkboxes.forEach((x) => { x.Check() })
        //                } else {
        //                    col.Filter = [];
        //                    checkboxes.forEach((x) => { x.Uncheck() })
        //                }
        //            }, Framework.LocalizationManager.Get("SelectUnselectAll"), ['btnFilterSelect'], Framework.LocalizationManager.Get("SelectUnselectAll"));

        //            let modal = Modal.Custom(div.HtmlElement, Framework.LocalizationManager.Format("FilterBy", [col.Name]), [selectButton, okButton], "300px", "300px", false, false, true);
        //            modal.Float('');
        //            let rect = btn.HtmlElement.getBoundingClientRect();
        //            modal.SetPosition(rect.left, rect.top);
        //            modal.OnClose = () => {
        //                setFilterIcon(col);
        //                self.renderRows();
        //            };

        //        }, "", [], Framework.LocalizationManager.Get("Filter"));

        //        b.HtmlElement.style.background = "transparent";
        //        b.HtmlElement.style.border = "0";
        //        b.CustomAttributes.Add("TableColumn", col);
        //        setFilterIcon(col);

        //        return b;

        //    }

        //    private getSortButton(col: TableColumn): Framework.Form.Button {
        //        // Bouton tri
        //        let self = this;

        //        let setSortIcon = (col: TableColumn) => {
        //            if (col.SortDirection == "none") {
        //                b1.HtmlElement.innerHTML = '<i class="fa fa-sort" style="width:1px"></i>';
        //                b1.HtmlElement.title = Framework.LocalizationManager.Get("ClickToSortAsc");
        //            }
        //            if (col.SortDirection == "asc") {
        //                b1.HtmlElement.innerHTML = '<i class="fa fa-sort-up" style="width:1px"></i>';
        //                b1.HtmlElement.title = Framework.LocalizationManager.Get("ClickToSortDesc");
        //            }
        //            if (col.SortDirection == "desc") {
        //                b1.HtmlElement.innerHTML = '<i class="fa fa-sort-desc" style="width:1px"></i>';
        //                b1.HtmlElement.title = Framework.LocalizationManager.Get("ClickToCancelSort");
        //            }
        //        }

        //        let b1 = Framework.Form.Button.Create(() => { return true; }, (btn) => {
        //            if (col.SortDirection == "none") {
        //                col.SortDirection = "asc";
        //            } else if (col.SortDirection == "asc") {
        //                col.SortDirection = "desc";
        //            } else if (col.SortDirection == "desc") {
        //                col.SortDirection = "none";
        //                col.SortIndex = undefined;
        //            }

        //            // Ordre des filtres
        //            let maxIndex = Math.max.apply(null, self.ListColumns.map((x) => { return x.SortIndex }));
        //            if (isNaN(maxIndex)) {
        //                maxIndex = 0;
        //            }
        //            col.SortIndex = maxIndex + 1;


        //            setSortIcon(col);
        //            self.renderRows();
        //        }, "", [], Framework.LocalizationManager.Get("Sort"));

        //        setSortIcon(col);
        //        b1.HtmlElement.style.background = "transparent";
        //        b1.HtmlElement.style.border = "0";
        //        b1.CustomAttributes.Add("TableColumn", col);

        //        return b1;
        //    }

        //    public Refresh(listData: T[] = undefined) {
        //        let self = this;

        //        if (listData == undefined) {
        //            this.renderRows();
        //            return;
        //        }

        //        // MAJ ligne
        //        listData.forEach((data) => {
        //            let row = <HTMLTableRowElement>data["Row"];
        //            let newRow = self.renderRow(data);
        //            row.parentNode.replaceChild(newRow, row);
        //        });
        //    }

        //    public Insert(listData: T[], index: number = undefined) {
        //        let self = this;

        //        listData.forEach((data) => {
        //            // Ajout donnée
        //            data["IsSelected"] = false;
        //            self.displayedData.push(data);

        //            // Ajout ligne
        //            self.insertRow(data, index);
        //            if (index != undefined) {
        //                index++;
        //            }
        //        });

        //        self.setFooter();
        //        self.OnSelectionChanged([]);
        //    }

        //    public Remove(listData: T[]) {
        //        let self = this;

        //        let removedData = [];

        //        listData.forEach((data) => {
        //            // Suppression de la donnée
        //            Framework.Array.Remove(self.displayedData, data);
        //            // Suppression de la ligne
        //            self.tbody.removeChild(data["Row"]);
        //            removedData.push(data);
        //        });

        //        self.setFooter();
        //        self.OnSelectionChanged(self.SelectedData);

        //    }

        //    private updateData(data: T, propertyName: string, newValue: any, updateUI: boolean = true) {
        //        // Mémorisation
        //        let oldValue = data[propertyName];

        //        // MAJ donnée
        //        data[propertyName] = newValue;

        //        this.OnDataUpdated(data, propertyName, oldValue, newValue);
        //    }

        //    public DisableAndAddRefreshIcon(callback: Function) {
        //        let self = this;
        //        if (this.isEnable == true) {
        //            this.isEnable = false;
        //            this.table.classList.add('tableLoading');

        //            let handleMouseDown = () => {
        //                self.isEnable = true;
        //                self.table.removeEventListener("click", handleMouseDown, true);
        //                self.table.classList.remove('tableLoading');
        //                callback();
        //            }

        //            this.table.removeEventListener("click", handleMouseDown, true);
        //            this.table.addEventListener("click", handleMouseDown, true);
        //        }
        //    }

        //    public Disable() {
        //        this.table.classList.add('tableDisabled');
        //    }

        //    public Enable() {
        //        this.table.classList.remove('tableDisabled');
        //    }

        //    //public RemoveSelection(callback: (selection: T[]) => void = undefined) {
        //    //    let self = this;
        //    //    let removedData: T[] = [];
        //    //    this.SelectedData.forEach((x) => {
        //    //        removedData.push(x);
        //    //        // Suppression de la donnée
        //    //        Framework.Array.Remove(self.displayedData, x);
        //    //        // Suppression de la ligne
        //    //        self.tbody.removeChild(x["Row"]);
        //    //    });

        //    //    self.setFooter();
        //    //    self.OnSelectionChanged([]);

        //    //    if (callback) {
        //    //        callback(removedData);
        //    //    }

        //    //}

        //    //private editRow(tr:HTMLTableRowElement, data:T) {

        //    //    let rect = tr.getBoundingClientRect();

        //    //    let table = document.createElement("table");
        //    //    table.classList.add("tableScroll");
        //    //    table.style.height = rect.height + 20 + "px";
        //    //    table.style.maxHeight = rect.height + 20 + "px";
        //    //    table.style.width = rect.width + "px";
        //    //    table.style.maxWidth = rect.width + "px";                
        //    //    //table.style.border = "1px solid blue";

        //    //    let tbody = document.createElement("tbody");
        //    //    table.appendChild(tbody);

        //    //    let tr1 = document.createElement("tr");
        //    //    tbody.appendChild(tr1);

        //    //    let self = this;

        //    //    let colspan = 0;

        //    //    if (self.CanSelect == true) {
        //    //        let td = document.createElement("td");
        //    //        td.classList.add("tableSelectionCell");
        //    //        td.style.background = "lightblue";

        //    //        let btn = Framework.Form.Button.Create(() => { return true; }, (b) => {     
        //    //            //TODO : afficher aide                   
        //    //        }, '<i class="far fa-edit" style="border:1px solid black;color:transparent;"></i>', [], Framework.LocalizationManager.Get("Help"));
        //    //        btn.HtmlElement.style.background = "transparent";
        //    //        btn.HtmlElement.style.border = "0";
        //    //        btn.HtmlElement.style.textAlign = "center";
        //    //        td.appendChild(btn.HtmlElement);

        //    //        tr1.appendChild(td);

        //    //        colspan++;
        //    //    }

        //    //    self.ListColumns.forEach((col) => {

        //    //        let td = document.createElement("td");
        //    //        tr1.appendChild(td);
        //    //        td.style.width = col.Width;
        //    //        td.style.maxWidth = col.Width;
        //    //        td.style.background = "lightblue";
        //    //        //td.style.borderLeft = "1px solid gray";

        //    //        if (col.Editable == true) {
        //    //            td.innerHTML = data[col.Name];
        //    //            //TODO : contrôle spécifique
        //    //        } else {
        //    //            td.innerHTML = data[col.Name];
        //    //        }

        //    //        colspan++;
        //    //    });

        //    //    let tr2 = document.createElement("tr");
        //    //    tr2.style.height = "20px";
        //    //    tr2.style.margin = "0";
        //    //    tbody.appendChild(tr2);
        //    //    let td = document.createElement("td");
        //    //    td.style.height = "20px";
        //    //    td.style.margin = "0";
        //    //    td.vAlign = "top";
        //    //    tr2.appendChild(td);
        //    //    td.colSpan = colspan;
        //    //    let btnPrev = Framework.Form.Button.Create(() => { return true; }, (b) => {
        //    //        //TODO           
        //    //    }, '<i class="fas fa-arrow-circle-left" style="font-size:8px" > </i>', ["editRowButton"], Framework.LocalizationManager.Get("Previous"));
        //    //    let btnNext = Framework.Form.Button.Create(() => { return true; }, (b) => {
        //    //        //TODO 
        //    //    }, '<i class="fas fa-arrow-circle-right" style="font-size:8px" > </i>', ["editRowButton"], Framework.LocalizationManager.Get("Next"));
        //    //    td.appendChild(btnPrev.HtmlElement);
        //    //    td.appendChild(btnNext.HtmlElement);
        //    //    //TODO : bouton valider, suivant, précédent



        //    //    let modal = Modal.Custom(table, undefined, undefined, rect.height + 20 + "px", rect.width + 2 + "px", false, false, true);
        //    //    modal.Float('');
        //    //    modal.Body.style.overflow = "hidden";
        //    //    modal.Body.style.margin = "0";
        //    //    modal.Body.style.padding = "0";
        //    //    modal.Body.style.background = "transparent";
        //    //    modal.SetPosition(rect.left - 2, rect.top - rect.height + 4);
        //    //    modal.OnClose = () => {
        //    //        //OnRowChanged
        //    //    };

        //    //}

        //    //public AddColumnDefinitions(columnDefs: object[]) {
        //    //    //let self = this;
        //    //    //columnDefs.forEach((x) => {
        //    //    //    self.DataTable.ListColumns.push(x);
        //    //    //});
        //    //    //self.DataTable.draw();
        //    //}

        //    //public SetItems(items: any[]) {
        //    //    //let self = this;
        //    //    //self.DataTable.clear();
        //    //    //items.forEach((item) => {
        //    //    //    //self.DataTable.row.add(item).draw();
        //    //    //    self.DataTable.row.add(item);
        //    //    //});
        //    //    //self.setPagination();
        //    //}

        //    //public Refresh() {
        //    //    //this.SetItems(this.ListData);
        //    //}

        //    //private setPagination() {

        //    //    let self = this;

        //    //    if (self.parameters.Paging == false) {
        //    //        $('.dataTables_info').hide();
        //    //        return;
        //    //    }

        //    //    var info = self.DataTable.page.info();
        //    //    if ($('#' + self.HtmlTable.id + ' tr').length < self.parameters.PageLength && info.pages == 1) {
        //    //        $('.dataTables_paginate').hide();
        //    //    } else {
        //    //        $('.dataTables_paginate').show();
        //    //    }


        //    //}

        //    //public AdjustSize() {
        //    //    let self = this;
        //    //    setTimeout(() => {
        //    //        self.DataTable.columns.adjust().draw();
        //    //    }, 100);

        //    //}

        //    public Export(filename: string, customFormats: any[] = undefined) {

        //        //TODO : bouton OK, annuler

        //        let format: string = "XLSX";
        //        let content = document.createElement("div");
        //        let formats = ["XLSX", "CSV",/*, "PDF"*/];
        //        let customF = [];
        //        if (customFormats) {
        //            customFormats.forEach((x) => {
        //                formats.push(x.name);
        //                customF.push(x.name);
        //            });
        //        }

        //        let t = document.createElement("div");
        //        t.innerHTML = Framework.LocalizationManager.Get("ChooseFileFormat")
        //        content.appendChild(t);

        //        let select = Framework.Form.Select.Render(format, Framework.KeyValuePair.FromArray(formats), Framework.Form.Validator.NotEmpty(), (x) => { format = x; }, false);
        //        select.HtmlElement.style.width = "100%";
        //        content.appendChild(select.HtmlElement);
        //        let self = this;

        //        Framework.Modal.Confirm(Framework.LocalizationManager.Get("ExportTable"), content, () => {
        //            if (format == "XLSX") {

        //                self.ExportTo(filename, "xlsx");

        //                // $('#' + this.HtmlTable.id + "_wrapper").find('.buttons-excel').click();
        //            }
        //            if (format == "CSV") {
        //                self.ExportTo(filename, "csv");
        //                //$('#' + this.HtmlTable.id + "_wrapper").find('.buttons-csv').click();
        //            }

        //            if (customF.indexOf(format) > -1) {
        //                let f = customFormats.filter((x) => { return x.name == format })[0].func;
        //                f();
        //            }

        //            //if (format == "PDF") {
        //            //    $('#' + this.HtmlTable.id + "_wrapper").find('.buttons-csv').click();
        //            //}
        //        });
        //    }

        //    //public Copy() {
        //    //    //let l = $('#' + this.HtmlTable.id + "_wrapper").find('.buttons-csv').click();
        //    //}

        //    //public Select(selectedData: any[]) {

        //    //    //if (selectedData.length == 0) {
        //    //    //    return;
        //    //    //}

        //    //    //let self = this;
        //    //    //// Sélection initiale
        //    //    //this.DataTable.column(0).nodes().each(function (cell, i) {
        //    //    //    let d = self.DataTable.row(i).data();
        //    //    //    if (selectedData.indexOf(d) > -1) {
        //    //    //        let cb: HTMLInputElement = cell.children[0];
        //    //    //        cb.click();
        //    //    //    }
        //    //    //});


        //    //}

        //    //public SelectAll() {
        //    //    //var cells = this.DataTable.cells().nodes();
        //    //    //$(cells).find(':checkbox').prop('checked', true);
        //    //    //let rows = this.DataTable.rows().nodes();
        //    //    //this.SelectedData = this.ListData;
        //    //    //this.parameters.OnSelectionChanged(this.SelectedData);
        //    //}

        //    //public UnselectAll() {
        //    //    //var cells = this.DataTable.cells().nodes();
        //    //    //$(cells).find(':checkbox').prop('checked', false);
        //    //    //this.SelectedData = [];
        //    //    //this.parameters.OnSelectionChanged(this.SelectedData);
        //    //}

        //    //public Enable() {
        //    //    //this.isEnabled = true;
        //    //}

        //    //public Disable() {
        //    //    //this.isEnabled = false;
        //    //}

        //    private getColumnNames(): Framework.KeyValuePair[] {
        //        let res: Framework.KeyValuePair[] = [];
        //        for (var i = 0; i < this.ListColumns.length; i++) {
        //            if (this.ListColumns[i].Title.length > 0) {
        //                var title = this.ListColumns[i].Title;
        //                var data = this.ListColumns[i].Name;
        //                res.push(new Framework.KeyValuePair(title, data));
        //            }
        //        }
        //        return res;
        //    }

        //    //public GetColumnNames(): Framework.KeyValuePair[] {
        //    //    return this.getColumnNames();
        //    //}

        //    public GetAsArray(): string[][] {
        //        let array: string[][] = [];

        //        let tabKvp = this.getColumnNames();

        //        let titleRow = tabKvp.map((x) => { return x.Key });
        //        let titleData = tabKvp.map((x) => { return x.Value });
        //        array.push(titleRow);

        //        this.ListData.forEach((x) => {
        //            let row = [];
        //            titleData.forEach((y) => {
        //                row.push(x[y]);
        //            });
        //            array.push(row);
        //        });

        //        return array;
        //    }

        //    public ExportTo(filename: string, format: string): void {
        //        let wb = new Framework.ExportManager("", "", "");
        //        wb.AddWorksheet("1", this.GetAsArray());
        //        wb.Save(filename, format);
        //    }

        //    //public static OnEditDataTableCell(data: any, propertyName: string, pType: string, defaultValue: any = undefined, kvp: Framework.KeyValuePair[] = [], customValidator: Framework.Form.Validator.CustomValidator = undefined) {

        //    //    if (data[propertyName] == undefined) {
        //    //        if (defaultValue) {
        //    //            data[propertyName] = defaultValue;
        //    //        } else {
        //    //            data[propertyName] = "";
        //    //        }
        //    //    }

        //    //    if (pType == 'Character') {
        //    //        let validator = Framework.Form.Validator.NoValidation();
        //    //        if (customValidator) {
        //    //            validator = customValidator;
        //    //        }
        //    //        return Framework.Form.InputText.Create(data[propertyName], (x) => {
        //    //            data[propertyName] = x;
        //    //        }, validator, false, ["tableInput"]).HtmlElement;
        //    //    }

        //    //    if (pType == 'Numeric') {
        //    //        let validator = Framework.Form.Validator.IsNumber();
        //    //        if (customValidator) {
        //    //            validator = customValidator;
        //    //        }
        //    //        return Framework.Form.InputText.Create(data[propertyName], (x) => {
        //    //            data[propertyName] = x;
        //    //        }, validator, false, ["tableInput"]).HtmlElement;
        //    //    }

        //    //    if (pType == 'Enumeration') {

        //    //        let validator = Framework.Form.Validator.NotEmpty();
        //    //        if (customValidator) {
        //    //            validator = customValidator;
        //    //        }

        //    //        return Framework.Form.Select.Render(data[propertyName], kvp, validator, (x) => {
        //    //            data[propertyName] = x;
        //    //        }, false, ["tableInput"]).HtmlElement;
        //    //    }

        //    //    //TODO Date, Boolean, couleur...

        //    //}

        //}

        export class Card {

            private div: Framework.Form.TextElement;
            public ID: string = "";

            public get TextElement() {
                return this.div;
            }

            constructor() {
                let self = this;
                this.div = Framework.Form.TextElement.Create("", ["card", "templateCard"]);
                this.div.HtmlElement.style.marginBottom = "15px";
            }

            public static Create(title: string, content: string, onClick: () => void): Card {

                let card = new Card();

                let cbody = Framework.Form.TextElement.Create("", ["card-body"]); card.div.Append(cbody);
                let ctitle = Framework.Form.TextElement.Create(title, ["card-title", "text-center"]);
                cbody.Append(ctitle);
                ctitle.HtmlElement.style.borderBottom = "1px solid";
                ctitle.HtmlElement.style.marginBottom = "15px";
                //let csubtitle = Framework.Form.TextElement.Create(datatype, ["card-subtitle", "text-center", "mb-2", "text-muted"]); cbody.Append(csubtitle);
                let ctext = Framework.Form.TextElement.Create(content, ["card-text", "text-center", "maxHeight4"]);
                cbody.Append(ctext);
                ctext.HtmlElement.title = content;

                //TOFIX : overflow moins abrupt

                card.div.HtmlElement.onclick = () => {
                    onClick();
                };

                return card;
            }

            public Click() {
                this.div.HtmlElement.click();;
            }
        }
    }

    export module Encryption {

        //TODO : télécharger clé au lancement et installation dans appstorage pour éviter qu'elle soit écrite en dur

        /// Clé côté TimeSens PL
        //var bytes = new Uint8Array([164, 242, 84, 80, 236, 17, 11, 208, 211, 195, 47, 38, 178, 237, 138, 121]);
        //var wa = toWordArray(bytes);
        //var key = wa.toString(CryptoJS.enc.Hex);
        //var key = "a4f25450ec110bd0d3c42f26b2ed8a79"; 

        // Clé côté serveur
        //var bytes = new Uint8Array([62, 201, 20, 36, 59, 74, 155, 69, 185, 81, 55, 215, 78, 28, 244, 251]);
        //var wa = toWordArray(bytes);
        //var key = wa.toString(CryptoJS.enc.Hex);
        //private static key = "3ec914243b4a9b45b95137d74e1cf4fb";
        //private static keyPL = "a4f25450ec110bd0d3c42f26b2ed8a79";  // clé panel elader

        // Convertit un UInt8Array en WordArray
        function toWordArray(u8arr) {
            var len = u8arr.length;
            var words = [];
            for (var i = 0; i < len; i++) {
                words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
            }
            return CryptoJS.lib.WordArray.create(words, len);
        }

        // Convertit un WordArray en UInt8Array
        function toUint8Array(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var u8 = new Uint8Array(sigBytes);
            for (var i = 0; i < sigBytes; i++) {
                var byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                u8[i] = byte;
            }
            return u8;
        }

        // Convertir une string en bytearray
        function toByteArray(str) {
            var byteArray = [];
            for (var i = 0; i < str.length; i++)
                if (str.charCodeAt(i) <= 0x7F)
                    byteArray.push(str.charCodeAt(i));
                else {
                    var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
                    for (var j = 0; j < h.length; j++)
                        byteArray.push(parseInt(h[j], 16));
                }
            return byteArray;
        };

        // Encrypte une chaine de caractère utf8 et renvoie une chaine de caractère base 64
        export function EncryptString(decryptedString: string, key: string, success: (decryptedText: string) => void, error: (any) => void) {
            try {
                encryptString(decryptedString, key, success);
            } catch (e) {
                error(e);
            }
        }

        function encryptString(decryptedString: string, key: string, success: (decryptedText: string) => void) {
            var hexKey = CryptoJS.enc.Hex.parse(key);
            var ui8arr = [];
            for (var i = 0; i < decryptedString.length; ++i) {
                ui8arr[i] = decryptedString.charCodeAt(i);
            }
            var words = toWordArray(ui8arr);
            var encrypted = CryptoJS.AES.encrypt(words, hexKey, { mode: CryptoJS.mode.CBC, iv: hexKey, padding: CryptoJS.pad.Pkcs7 });
            var encryptedUi8arr = toUint8Array(encrypted.ciphertext);
            var b64encoded: string = btoa(String.fromCharCode.apply(null, encryptedUi8arr));
            success(b64encoded);
        }

        function decryptString(b64encodedString: string, key: string, success: (decryptedText: string) => void) {
            var hexKey = CryptoJS.enc.Hex.parse(key);
            var decryptedString = CryptoJS.AES.decrypt(b64encodedString, hexKey, { mode: CryptoJS.mode.CBC, iv: hexKey, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);
            success(decryptedString);
        }

        export function DecryptString(b64encodedString: string, key: string, success: (decryptedText: string) => void) {
            decryptString(b64encodedString, key, success);
        }
    }

    export module Factory {

        // Crée un objet (éventuellement depuis une chaine json)
        // TOFIX : objet de l'objet non affectés (méthodes non prises en compte)
        export function Create<T>(c: { new(): T; }, json: string = undefined): T {
            let obj: T = new c();
            if (json) {
                let jsonObj = JSON.parse(json);
                for (var v in jsonObj) {
                    obj[v] = jsonObj[v];
                }
            }
            return obj;
        }

        export function CreateFrom<T>(c: { new(): T; }, fromObj: T, byRef = false): T {
            let obj: T = new c();

            for (var v in fromObj) {
                let l = typeof obj[v];
                if (byRef == true || typeof fromObj[v] != 'object') {
                    obj[v] = fromObj[v];
                } else {
                    let clonedProperty = JSON.stringify(fromObj[v]);
                    obj[v] = JSON.parse(clonedProperty);
                }
            }

            return obj;
        }

        //TODO : deep copy - problème avec objets imbriqués qui ne sont pas copiés mais passés par référence

        export function Clone<T>(obj: T): T {
            let serializedObject: string = JSON.stringify(obj);
            let clone: T = JSON.parse(serializedObject);

            for (var k in obj) {
                // Copie des méthodes
                //if (typeof obj[k] != 'object') {
                clone[k] = obj[k];
                //}
            }
            return clone;
        }
    }

    export module Serialization {

        // TODO : supprimer, utiliser factory à l aplace

        export function JsonToInstance<T>(obj: T, json: string): T {
            var jsonObj = JSON.parse(json);
            if (typeof obj["fromJSON"] === "function") {
                obj["fromJSON"](jsonObj);
            }
            else {
                for (var propName in jsonObj) {
                    obj[propName] = jsonObj[propName]
                }
            }
            return obj;
        }



    }

    export module FileHelper {

        export function SaveBase64As(b64string: string, fileName: string) {
            var byteCharacters = atob(b64string);
            var byteNumbers = [];
            //var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray], { type: "application/octet-stream" });
            saveAs(blob, fileName);
        }


        export function SaveAs(blob: Blob, filename: string) {
            saveAs(blob, filename);
        }

        export function SaveTextAs(txt: string, fileName: string) {
            let blob: Blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
            FileHelper.SaveAs(blob, fileName);
        }

        export function SaveObjectAs(obj: object, fileName: string) {
            let txt = JSON.stringify(obj);
            let blob: Blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
            FileHelper.SaveAs(blob, fileName);
        }

        export function SaveAsZip(obj: object, fileName: string) {
            //TODO
            //DynamicLoader.Load(FileRequirements)
            //    .then(() => {
            //        let txt = JSON.stringify(obj);
            //        let blob: Blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
            //        saveAs(blob, fileName);
            //    })
            //    .catch(() => {
            //        //TODO
            //        throw Error("Browser not compatible");
            //    }
            //    );
        }

        export function BrowseFile(extension: string, onChange: (file: File) => void) {
            let input: HTMLInputElement = document.createElement("input");
            input.type = "file";
            input.accept = extension;
            input.style.position = "absolute";
            input.style.left = "-1000px";
            input.onchange = function () {
                let file = (<HTMLInputElement>this).files[0];
                onChange(file);
                document.body.removeChild(input);
            }
            document.body.appendChild(input);
            setTimeout(() => {
                input.click();
            }, 500);

        }

        export function BrowseBinaries(extension: string, onLoad: (binaries: string, filename:string) => void) {
            let input: HTMLInputElement = document.createElement("input");
            input.type = "file";
            input.accept = extension;
            input.style.position = "absolute";
            input.style.left = "-1000px";
            input.onchange = function () {
                let file = (<HTMLInputElement>this).files[0];

                var fileReader: FileReader = new FileReader();
                fileReader.onload = function (e) {                    
                    let binaries: string = <any>fileReader.result;
                    onLoad(binaries, file.name);
                }

                fileReader.readAsDataURL(file);

                document.body.removeChild(input);
            }
            document.body.appendChild(input);
            setTimeout(() => {
                input.click();
            }, 500);

        }


        //export function Browse(extension: string, onLoad: (result: string) => void, readMode: string = "DataUrl") {
        //    let control = Framework.Form.InputFile.Create(extension, (file) => {
        //        var fileReader: FileReader = new FileReader();
        //        fileReader.onload = function (e) {
        //            let binaries: string = fileReader.result;
        //            onLoad(binaries);
        //            document.body.removeChild(control.HtmlElement);
        //        }

        //        if (readMode == "DataUrl") {
        //            fileReader.readAsDataURL(file);
        //        } else {
        //            fileReader.readAsText(file);
        //        }

        //    }, false);
        //    document.body.appendChild(control.HtmlElement);
        //    setTimeout(() => {
        //        control.Click();
        //    }, 500);
        //}
    }

    export class KeyValuePair {
        public Key: any;
        public Value: any;

        constructor(key: any, value: any) {
            this.Key = key;
            this.Value = value;
        }

        public static FromArray(array: string[], translate: boolean = false): KeyValuePair[] {
            if (array == undefined) {
                return [];
            }
            let res = [];
            array.forEach((x) => {
                let val = x;
                if (translate) {
                    val = Framework.LocalizationManager.Get(x);
                }
                res.push({ Key: val, Value: x });
            });
            return res;
        }
    }

    export class NamedColor {
        public Hex: string;
        public Name: string;
        public RGB: number[];
        public Palettes: string[];
        public Foreground: string;
    }

    export class Color {

        public static ContrastedColorPalette: string[] = ["red", "blue", "lawngreen", "purple", "darkgrey", "cyan", "fuschia", "coral", "orange", "turquoise", "darkgreen", "violet", "gold", "indigo", "burlywood"];

        public static GetColorFromContrastedPalette(currentColors: string[]): string {
            let index = 0;
            let color = Color.ContrastedColorPalette[index];
            while (currentColors.indexOf(color) > -1 && index < Color.ContrastedColorPalette.length - 1) {
                index++;
                color = Color.ContrastedColorPalette[index];
            }
            return color;
        }

        public static List: NamedColor[] = [
            { Name: "pink", Hex: "#ffc0cb", RGB: [255, 192, 203], Palettes: ["Base", "Distinct"], Foreground: "black" },
            { Name: "lightpink", Hex: "#ffb6c1", RGB: [255, 182, 193], Palettes: [], Foreground: "black" },
            { Name: "hotpink", Hex: "#ff69b4", RGB: [255, 105, 180], Palettes: [], Foreground: "black" },
            { Name: "deeppink", Hex: "#ff1493", RGB: [255, 20, 147], Palettes: [], Foreground: "black" },
            { Name: "palevioletred", Hex: "#d87093", RGB: [219, 112, 147], Palettes: [], Foreground: "black" },
            { Name: "mediumvioletred", Hex: "#c71585", RGB: [199, 21, 133], Palettes: [], Foreground: "black" },

            { Name: "lightsalmon", Hex: "#ffa07a", RGB: [255, 160, 122], Palettes: [], Foreground: "black" },
            { Name: "salmon", Hex: "#fa8072", RGB: [250, 128, 114], Palettes: [], Foreground: "black" },
            { Name: "darksalmon", Hex: "#e9967a", RGB: [233, 150, 122], Palettes: [], Foreground: "black" },
            { Name: "lightcoral", Hex: "#f08080", RGB: [240, 128, 128], Palettes: [], Foreground: "black" },
            { Name: "indianred", Hex: "#cd5c5c", RGB: [205, 92, 92], Palettes: [], Foreground: "black" },
            { Name: "crimson", Hex: "#dc143c", RGB: [220, 20, 60], Palettes: [], Foreground: "black" },
            { Name: "firebrick", Hex: "#b22222", RGB: [178, 34, 34], Palettes: [], Foreground: "black" },
            { Name: "darkred", Hex: "#8b0000", RGB: [139, 0, 0], Palettes: [], Foreground: "black" },
            { Name: "red", Hex: "#ff0000", RGB: [255, 0, 0], Palettes: ["Base", "Distinct"], Foreground: "black" },

            { Name: "orangered", Hex: "#ff4500", RGB: [255, 69, 0], Palettes: [], Foreground: "black" },
            { Name: "tomato", Hex: "#ff6347", RGB: [255, 99, 71], Palettes: [], Foreground: "black" },
            { Name: "coral", Hex: "#ff7f50", RGB: [255, 127, 80], Palettes: [], Foreground: "black" },
            { Name: "darkorange", Hex: "#ff8c00", RGB: [255, 140, 0], Palettes: ["Base"], Foreground: "black" },
            { Name: "orange", Hex: "#ffa500", RGB: [255, 165, 0], Palettes: ["Distinct"], Foreground: "black" },

            { Name: "yellow", Hex: "#ffff00", RGB: [255, 255, 0], Palettes: ["Base", "Distinct"], Foreground: "black" },
            { Name: "lightyellow", Hex: "#ffffe0", RGB: [255, 255, 224], Palettes: [], Foreground: "black" },
            { Name: "lemonchiffon", Hex: "#fffacd", RGB: [255, 250, 205], Palettes: [], Foreground: "black" },
            { Name: "lightgoldenrodyellow", Hex: "#fafad2", RGB: [250, 250, 210], Palettes: [], Foreground: "black" },
            { Name: "papayawhip", Hex: "#ffefd5", RGB: [255, 239, 213], Palettes: [], Foreground: "black" },
            { Name: "moccasin", Hex: "#ffe4b5", RGB: [255, 228, 181], Palettes: [], Foreground: "black" },
            { Name: "peachpuff", Hex: "#ffdab9", RGB: [255, 218, 185], Palettes: [], Foreground: "black" },
            { Name: "palegoldenrod", Hex: "#eee8aa", RGB: [238, 232, 170], Palettes: [], Foreground: "black" },
            { Name: "khaki", Hex: "#f0e68c", RGB: [240, 230, 140], Palettes: [], Foreground: "black" },
            { Name: "darkkhaki", Hex: "#bdb76b", RGB: [189, 183, 107], Palettes: [], Foreground: "black" },
            { Name: "gold", Hex: "#ffd700", RGB: [255, 215, 0], Palettes: [], Foreground: "black" },

            { Name: "cornsilk", Hex: "#fff8dc", RGB: [255, 248, 220], Palettes: [], Foreground: "black" },
            { Name: "blanchedalmond", Hex: "#ffebcd", RGB: [255, 235, 205], Palettes: [], Foreground: "black" },
            { Name: "bisque", Hex: "#ffe4c4", RGB: [255, 228, 196], Palettes: [], Foreground: "black" },
            { Name: "navajowhite", Hex: "#ffdead", RGB: [255, 222, 173], Palettes: [], Foreground: "black" },
            { Name: "wheat", Hex: "#f5deb3", RGB: [245, 222, 179], Palettes: [], Foreground: "black" },
            { Name: "burlywood", Hex: "#deb887", RGB: [222, 184, 135], Palettes: [], Foreground: "black" },
            { Name: "tan", Hex: "#d2b48c", RGB: [210, 180, 140], Palettes: [], Foreground: "black" },
            { Name: "rosybrown", Hex: "#bc8f8f", RGB: [188, 143, 143], Palettes: [], Foreground: "black" },
            { Name: "sandybrown", Hex: "#f4a460", RGB: [244, 164, 96], Palettes: [], Foreground: "black" },
            { Name: "goldenrod", Hex: "#daa520", RGB: [218, 165, 32], Palettes: [], Foreground: "black" },
            { Name: "darkgoldenrod", Hex: "#b8860b", RGB: [184, 134, 11], Palettes: [], Foreground: "black" },
            { Name: "peru", Hex: "#cd853f", RGB: [205, 133, 63], Palettes: [], Foreground: "black" },
            { Name: "chocolate", Hex: "#d2691e", RGB: [210, 105, 30], Palettes: [], Foreground: "black" },
            { Name: "saddlebrown", Hex: "#8b4513", RGB: [139, 69, 19], Palettes: [], Foreground: "black" },
            { Name: "sienna", Hex: "#a0522d", RGB: [160, 82, 45], Palettes: [], Foreground: "black" },
            { Name: "brown", Hex: "#a52a2a", RGB: [165, 42, 42], Palettes: ["Distinct"], Foreground: "black" },
            { Name: "maroon", Hex: "#800000", RGB: [128, 0, 0], Palettes: ["Base", "Distinct"], Foreground: "black" },

            { Name: "darkolivegreen", Hex: "#556b2f", RGB: [85, 107, 47], Palettes: [], Foreground: "black" },
            { Name: "olive", Hex: "#808000", RGB: [128, 128, 0], Palettes: ["Base", "Distinct"], Foreground: "black" },
            { Name: "olivedrab", Hex: "#6b8e23", RGB: [107, 142, 35], Palettes: [], Foreground: "black" },
            { Name: "yellowgreen", Hex: "#9acd32", RGB: [154, 205, 50], Palettes: [], Foreground: "black" },
            { Name: "limegreen", Hex: "#32cd32", RGB: [50, 205, 50], Palettes: [], Foreground: "black" },
            { Name: "lime", Hex: "#00ff00", RGB: [0, 255, 0], Palettes: ["Base", "Distinct"], Foreground: "black" },
            { Name: "lawngreen", Hex: "#7cfc00", RGB: [124, 252, 0], Palettes: [], Foreground: "black" },
            { Name: "chartreuse", Hex: "#7fff00", RGB: [127, 255, 0], Palettes: [], Foreground: "black" },
            { Name: "greenyellow", Hex: "#adff2f", RGB: [173, 255, 47], Palettes: [], Foreground: "black" },
            { Name: "springgreen", Hex: "#00ff7f", RGB: [0, 255, 127], Palettes: [], Foreground: "black" },
            { Name: "mediumspringgreen", Hex: "#00fa9a", RGB: [0, 250, 154], Palettes: [], Foreground: "black" },
            { Name: "lightgreen", Hex: "#90ee90", RGB: [144, 238, 144], Palettes: ["Text"], Foreground: "black" },
            { Name: "palegreen", Hex: "#98fb98", RGB: [152, 251, 152], Palettes: [], Foreground: "black" },
            { Name: "darkseagreen", Hex: "#8fbc8f", RGB: [143, 188, 143], Palettes: [], Foreground: "black" },
            { Name: "mediumaquamarine", Hex: "#66cdaa", RGB: [102, 205, 170], Palettes: [], Foreground: "black" },
            { Name: "mediumseagreen", Hex: "#3cb371", RGB: [60, 179, 113], Palettes: [], Foreground: "black" },
            { Name: "seagreen", Hex: "#2e8b57", RGB: [46, 139, 87], Palettes: [], Foreground: "black" },
            { Name: "forestgreen", Hex: "#228b22", RGB: [34, 139, 34], Palettes: [], Foreground: "black" },
            { Name: "green", Hex: "#008000", RGB: [0, 128, 0], Palettes: ["Base", "Distinct"], Foreground: "black" },
            { Name: "darkgreen", Hex: "#006400", RGB: [0, 100, 0], Palettes: [], Foreground: "black" },

            { Name: "aqua", Hex: "#00ffff", RGB: [0, 255, 255], Palettes: [], Foreground: "black" },
            { Name: "cyan", Hex: "#00ffff", RGB: [0, 255, 255], Palettes: ["Base", "Distinct"], Foreground: "black" },
            { Name: "lightcyan", Hex: "#e0ffff", RGB: [224, 255, 255], Palettes: [], Foreground: "black" },
            { Name: "paleturquoise", Hex: "#afeeee", RGB: [175, 238, 238], Palettes: [], Foreground: "black" },
            { Name: "aquamarine", Hex: "#7fffd4", RGB: [127, 255, 212], Palettes: [], Foreground: "black" },
            { Name: "turquoise", Hex: "#40e0d0", RGB: [64, 224, 208], Palettes: [], Foreground: "black" },
            { Name: "mediumturquoise", Hex: "#48d1cc", RGB: [72, 209, 204], Palettes: [], Foreground: "black" },
            { Name: "darkturquoise", Hex: "#00ced1", RGB: [0, 206, 209], Palettes: [], Foreground: "black" },
            { Name: "lightseagreen", Hex: "#20b2aa", RGB: [32, 178, 170], Palettes: [], Foreground: "black" },
            { Name: "cadetblue", Hex: "#5f9ea0", RGB: [95, 158, 160], Palettes: [], Foreground: "black" },
            { Name: "darkcyan", Hex: "#008b8b", RGB: [0, 139, 139], Palettes: [], Foreground: "black" },
            { Name: "teal", Hex: "#008080", RGB: [0, 128, 128], Palettes: ["Base", "Distinct"], Foreground: "black" },

            { Name: "lightsteelblue", Hex: "#b0c4de", RGB: [176, 196, 222], Palettes: [], Foreground: "black" },
            { Name: "powderblue", Hex: "#b0e0e6", RGB: [176, 224, 230], Palettes: [], Foreground: "black" },
            { Name: "lightblue", Hex: "#add8e6", RGB: [173, 216, 230], Palettes: [], Foreground: "black" },
            { Name: "skyblue", Hex: "#87ceeb", RGB: [135, 206, 235], Palettes: [], Foreground: "black" },
            { Name: "lightskyblue", Hex: "#87cefa", RGB: [135, 206, 250], Palettes: [], Foreground: "black" },
            { Name: "deepskyblue", Hex: "#00bfff", RGB: [0, 191, 255], Palettes: [], Foreground: "black" },
            { Name: "dodgerblue", Hex: "#1e90ff", RGB: [30, 144, 255], Palettes: [], Foreground: "black" },
            { Name: "cornflowerblue", Hex: "#6495ed", RGB: [100, 149, 237], Palettes: [], Foreground: "black" },
            { Name: "steelblue", Hex: "#4682b4", RGB: [70, 130, 180], Palettes: [], Foreground: "black" },
            { Name: "royalblue", Hex: "#4169e1", RGB: [65, 105, 225], Palettes: [], Foreground: "white" },
            { Name: "blue", Hex: "#0000ff", RGB: [0, 0, 255], Palettes: ["Base", "Distinct"], Foreground: "white" },
            { Name: "mediumblue", Hex: "#0000cd", RGB: [0, 0, 205], Palettes: [], Foreground: "white" },
            { Name: "darkblue", Hex: "#00008b", RGB: [0, 0, 139], Palettes: [], Foreground: "white" },
            { Name: "navy", Hex: "#000080", RGB: [0, 0, 128], Palettes: ["Base", "Distinct"], Foreground: "white" },
            { Name: "midnightblue", Hex: "#191970", RGB: [25, 25, 112], Palettes: [], Foreground: "white" },

            { Name: "lavender", Hex: "#e6e6fa", RGB: [230, 230, 250], Palettes: [], Foreground: "black" },
            { Name: "thistle", Hex: "#d8bfd8", RGB: [216, 191, 216], Palettes: [], Foreground: "black" },
            { Name: "plum", Hex: "#dda0dd", RGB: [221, 160, 221], Palettes: [], Foreground: "black" },
            { Name: "violet", Hex: "#ee82ee", RGB: [238, 130, 238], Palettes: [], Foreground: "white" },
            { Name: "orchid", Hex: "#da70d6", RGB: [218, 112, 214], Palettes: [], Foreground: "black" },
            { Name: "fuchsia", Hex: "#ff00ff", RGB: [255, 0, 255], Palettes: ["Base"], Foreground: "black" },
            { Name: "magenta", Hex: "#ff00ff", RGB: [255, 0, 255], Palettes: ["Distinct"], Foreground: "black" },
            { Name: "mediumorchid", Hex: "#ba55d3", RGB: [186, 85, 211], Palettes: [], Foreground: "black" },
            { Name: "mediumpurple", Hex: "#9370d8", RGB: [147, 112, 219], Palettes: [], Foreground: "white" },
            { Name: "blueviolet", Hex: "#8a2be2", RGB: [138, 43, 226], Palettes: [], Foreground: "white" },
            { Name: "darkviolet", Hex: "#9400d3", RGB: [148, 0, 211], Palettes: [], Foreground: "white" },
            { Name: "darkorchid", Hex: "#9932cc", RGB: [153, 50, 204], Palettes: [], Foreground: "white" },
            { Name: "darkmagenta", Hex: "#8b008b", RGB: [139, 0, 139], Palettes: [], Foreground: "black" },
            { Name: "purple", Hex: "#800080", RGB: [128, 0, 128], Palettes: ["Base", "Distinct"], Foreground: "black" },
            { Name: "indigo", Hex: "#4b0082", RGB: [75, 0, 130], Palettes: [], Foreground: "black" },
            { Name: "darkslateblue", Hex: "#483d8b", RGB: [72, 61, 139], Palettes: [], Foreground: "white" },
            { Name: "slateblue", Hex: "#6a5acd", RGB: [106, 90, 205], Palettes: [], Foreground: "white" },
            { Name: "mediumslateblue", Hex: "#7b68ee", RGB: [123, 104, 238], Palettes: [], Foreground: "black" },

            { Name: "transparent", Hex: "#000000", RGB: [], Palettes: [], Foreground: "black" },
            { Name: "white", Hex: "#ffffff", RGB: [255, 255, 255], Palettes: ["Base"], Foreground: "black" },
            { Name: "snow", Hex: "#fffafa", RGB: [255, 250, 250], Palettes: [], Foreground: "black" },
            { Name: "honeydew", Hex: "#f0fff0", RGB: [240, 255, 240], Palettes: [], Foreground: "black" },
            { Name: "mintcream", Hex: "#f5fffa", RGB: [245, 255, 250], Palettes: ["Distinct"], Foreground: "black" },
            { Name: "azure", Hex: "#f0ffff", RGB: [240, 255, 255], Palettes: [], Foreground: "black" },
            { Name: "aliceblue", Hex: "#f0f8ff", RGB: [240, 255, 255], Palettes: [], Foreground: "black" },
            { Name: "ghostwhite", Hex: "#f8f8ff", RGB: [248, 248, 255], Palettes: [], Foreground: "black" },
            { Name: "whitesmoke", Hex: "#f5f5f5", RGB: [245, 245, 245], Palettes: [], Foreground: "black" },
            { Name: "seashell", Hex: "#fff5ee", RGB: [255, 245, 238], Palettes: [], Foreground: "black" },
            { Name: "beige", Hex: "#f5f5dc", RGB: [245, 245, 220], Palettes: ["Distinct"], Foreground: "black" },
            { Name: "oldlace", Hex: "#fdf5e6", RGB: [253, 245, 230], Palettes: [], Foreground: "black" },
            { Name: "floralwhite", Hex: "#fffaf0", RGB: [255, 250, 240], Palettes: [], Foreground: "black" },
            { Name: "ivory", Hex: "#fffff0", RGB: [255, 255, 240], Palettes: [], Foreground: "black" },
            { Name: "antiquewhite", Hex: "#faebd7", RGB: [250, 235, 215], Palettes: [], Foreground: "black" },
            { Name: "linen", Hex: "#faf0e6", RGB: [250, 240, 230], Palettes: [], Foreground: "black" },
            { Name: "lavenderblush", Hex: "#fff0f5", RGB: [255, 240, 245], Palettes: ["Distinct"], Foreground: "black" },
            { Name: "mistyrose", Hex: "#ffe4e1", RGB: [255, 228, 225], Palettes: [], Foreground: "black" },

            { Name: "gainsboro", Hex: "#dcdcdc", RGB: [220, 220, 220], Palettes: [], Foreground: "black" },
            { Name: "lightgray", Hex: "#d3d3d3", RGB: [211, 211, 211], Palettes: [], Foreground: "black" },
            { Name: "silver", Hex: "#c0c0c0", RGB: [192, 192, 192], Palettes: ["Base"], Foreground: "black" },
            { Name: "darkgray", Hex: "#a9a9a9", RGB: [169, 169, 169], Palettes: [], Foreground: "white" },
            { Name: "gray", Hex: "#808080", RGB: [128, 128, 128], Palettes: ["Base"], Foreground: "white" },
            { Name: "dimgray", Hex: "#696969", RGB: [105, 105, 105], Palettes: [], Foreground: "white" },
            { Name: "lightslategray", Hex: "#778899", RGB: [119, 136, 153], Palettes: [], Foreground: "black" },
            { Name: "slategray", Hex: "#708090", RGB: [112, 128, 144], Palettes: [], Foreground: "white" },
            { Name: "darkslategray", Hex: "#2f4f4f", RGB: [47, 79, 79], Palettes: [], Foreground: "white" },
            { Name: "black", Hex: "#000000", RGB: [0, 0, 0], Palettes: ["Base", "Distinct"], Foreground: "white" }

        ];


        public static GetContrastedColor(colorName: string): string {
            let colors = Color.List.filter((x) => { return x.Name == colorName });
            if (colors.length > 0) {
                return colors[0].Foreground;
            }
            return "black";
        }

        public static get BasePalette(): NamedColor[] {
            return (Color.List.filter((x) => { return x.Palettes.indexOf("Base") > -1; })).sort((obj1, obj2) => {
                if (obj1.Hex > obj2.Hex) {
                    return 1;
                }

                if (obj1.Hex < obj2.Hex) {
                    return -1;
                }

                return 0;
            });
        };

        public static get DistinctPalette(): NamedColor[] {
            return (Color.List.filter((x) => { return x.Palettes.indexOf("Distinct") > -1; })).sort((obj1, obj2) => {
                if (obj1.Hex > obj2.Hex) {
                    return 1;
                }

                if (obj1.Hex < obj2.Hex) {
                    return -1;
                }

                return 0;
            });
        };

        public static IsColor(col: string): boolean {
            let span = document.createElement("span");
            span.style.color = col;
            if (span.style.color) {
                return true;
            }
            return false;
        }

        //public static GetColoredSpan(c: Color): string {
        public static GetColoredSpan(c: string): string {
            //let stringColor = Color.RgbToHex(c)
            //return '<span style="color:' + stringColor + '">' + stringColor + '</span>';
            return '<span style="color:' + c + '">' + c + '</span>';
        }

        public static ColorFromRGB(c: string): string {
            try {

                var a = parseInt(c.substring(1, 3), 16);
                var r = parseInt(c.substring(3, 5), 16);
                var g = parseInt(c.substring(5, 7), 16);
                var b = parseInt(c.substring(7, 9), 16);

                if (a == 1) {
                    return "transparent";
                }

                let col = "#" + Color.componentToHex(r) + Color.componentToHex(g) + Color.componentToHex(b);
                return col;

            }
            catch (e) {
                return "#FFFFFF";
            }
        }

        private static componentToHex(c: number) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        public static HexToColorName(hex: string): string {
            let colors = Color.List.filter((x) => { return x.Hex == hex.toLowerCase() });
            if (colors.length > 0) {
                return colors[0].Name;
            }
            return hex;
        }

        public static ColorNameToHex(color: string): string {
            let colors = Color.List.filter((x) => { return x.Name == color.toLowerCase() });
            if (colors.length > 0) {
                return colors[0].Hex;
            }
            return null;
        }

        //public static ColorNameToColor(color: string): Color {
        //    return Color.ColorFromString(Color.ColorNameToHex(color), false);
        //}

        //public static GetContrastedBackgroundColors(n: number, opacity: number = 1): Color[] {
        //    var res: Color[] = [];
        //    for (var i = 0; i < n; i++) {
        //        var c: Color = Color.ColorFromString(Color.List[i].Hex, false);
        //        c.A = opacity;
        //        res.push(c);
        //    }
        //    return res;
        //}

        public static InvertHexColor(hex: string) {

            if (hex.indexOf('#') < 0) {
                hex = Color.ColorNameToHex(hex);
            }


            if (hex.indexOf('#') === 0) {
                hex = hex.slice(1);
            }
            // convert 3-digit hex to 6-digits.
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            if (hex.length !== 6) {
                throw new Error('Invalid HEX color.');
            }
            // invert color components
            var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
                g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
                b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);


            let res = '#' + Format.PadLeft(r, 2) + Format.PadLeft(g, 2) + Format.PadLeft(b, 2);
            return res;
        }


    }

    export class ModuleRequirements {
        public Name: string;
        public CssFiles: string[] = [];
        public JsFiles: string[] = [];
        public JsonResources: string[] = [];
        public Recommanded: string[] = [];
        public Required: string[] = [];
        public AppUrl: string;
        public FrameworkUrl: string;
        public WcfServiceUrl: string;
        public DisableRefresh: boolean;
        public DisableGoBack: boolean;
        public AuthorizedLanguages: string[];
        public DefaultLanguage: string;
        public OnLoaded: Function;
        public Extensions: string[] = [];
        public VersionPath: string;
    }

    export class ModuleCompatibilityCheck {
        public Type: string;
        public MissingRecommanded: string[];
        public MissingRequired: string[];
        //TODO : lien avec Modernizr pour préciser fonctionnalité manquante + recommandation navigateur
    }

    export class Events {
        public static get Click(): string {

            let clickEventType: string = 'mousedown';

            try {
                if (Modernizr.touchevents == true) {
                    clickEventType = 'touchstart';
                }
            }
            catch (ex) {
            }
            return clickEventType;
        }
    }

    export class Selection {

        //private static getCaretCharacterOffsetWithin(element) {
        //    var caretOffset = 0;
        //    var doc = element.ownerDocument || element.document;
        //    var win = doc.defaultView || doc.parentWindow;
        //    var sel;
        //    if (typeof win.getSelection != "undefined") {
        //        sel = win.getSelection();
        //        if (sel.rangeCount > 0) {
        //            var range = win.getSelection().getRangeAt(0);
        //            var preCaretRange = range.cloneRange();
        //            preCaretRange.selectNodeContents(element);
        //            preCaretRange.setEnd(range.endContainer, range.endOffset);
        //            caretOffset = preCaretRange.toString().length;
        //        }
        //    } else if ((sel = doc.selection) && sel.type != "Control") {
        //        var textRange = sel.createRange();
        //        var preCaretTextRange = doc.body.createTextRange();
        //        preCaretTextRange.moveToElementText(element);
        //        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        //        caretOffset = preCaretTextRange.text.length;
        //    }
        //    return caretOffset;
        //}

        private static getCaretPosition(node) {
            var range = window.getSelection().getRangeAt(0),
                preCaretRange = range.cloneRange(),
                caretPosition,
                tmp = document.createElement("div");

            preCaretRange.selectNodeContents(node);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            tmp.appendChild(preCaretRange.cloneContents());
            caretPosition = tmp.innerHTML.length;
            return caretPosition;
        }

        public static GetHTMLCaretPosition(element) {
            var textPosition = Selection.getCaretPosition(element),
                htmlContent = element.innerHTML,
                textIndex = 0,
                htmlIndex = 0,
                insideHtml = false,
                htmlBeginChars = ['&', '<'],
                htmlEndChars = [';', '>'];


            if (textPosition == 0) {
                return 0;
            }

            while (textIndex < textPosition) {

                htmlIndex++;

                // check if next character is html and if it is, iterate with htmlIndex to the next non-html character
                while (htmlBeginChars.indexOf(htmlContent.charAt(htmlIndex)) > -1) {
                    // console.log('encountered HTML');
                    // now iterate to the ending char
                    insideHtml = true;

                    while (insideHtml) {
                        if (htmlEndChars.indexOf(htmlContent.charAt(htmlIndex)) > -1) {
                            if (htmlContent.charAt(htmlIndex) == ';') {
                                htmlIndex--; // entity is char itself
                            }
                            // console.log('encountered end of HTML');
                            insideHtml = false;
                        }
                        htmlIndex++;
                    }
                }
                textIndex++;
            }

            //console.log(htmlIndex);
            //console.log(textPosition);
            // in htmlIndex is caret position inside html
            return htmlIndex;
        }



        public static SetCaretPosition(el, pos) {

            // Loop through all child nodes
            for (var node of el.childNodes) {
                if (node.nodeType == 3) { // we have a text node
                    if (node.length >= pos) {
                        // finally add our range
                        var range = document.createRange(),
                            sel = window.getSelection();
                        range.setStart(node, pos);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                        return -1; // we are done
                    } else {
                        pos -= node.length;
                    }
                } else {
                    pos = Selection.SetCaretPosition(node, pos);
                    if (pos == -1) {
                        return -1; // no need to finish the for loop
                    }
                }
            }
            return pos; // needed because of recursion stuff
        }

        public static GetParentElement() {
            var parentEl = null, sel;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.rangeCount) {
                    parentEl = sel.getRangeAt(0).commonAncestorContainer;
                    if (parentEl.nodeType != 1) {
                        parentEl = parentEl.parentNode;
                    }
                }
            } else if ((sel = document) && sel.type != "Control") {
                parentEl = sel.createRange().parentElement();
            }
            return parentEl;
        }

        public static GetParentElementOfType(tag: string): any {
            let parent = Selection.GetParentElement();
            let ancestors = ($(parent).closest(tag));
            if (ancestors) {
                return ancestors[0];
            }
            return undefined;
        }

        public static ApplyStyle(style: string, val: string, tag: string = undefined) {
            let parent = Selection.GetParentElement();
            if (tag) {
                parent = Framework.Selection.GetParentElementOfType(tag);
            }
            $(parent).css(style, val);
        }

        public static Replace(text: string) {
            if (window.getSelection) {
                let sel = window.getSelection();
                if (sel.rangeCount) {
                    let range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(text));
                }
            }
        }

        public static SetFontSize(fontSize: number) {

            var sel, range;
            if (window.getSelection) {
                range = window.getSelection().getRangeAt(0);
                var content = range.extractContents();
                var span = document.createElement('SPAN');
                span.setAttribute("style", " font-size: " + fontSize + "pt !important;");
                span.appendChild(content);
                var htmlContent = span.innerHTML;
                htmlContent = htmlContent.replace(/<\/?span[^>]*>/g, "");
                htmlContent = htmlContent.replace(/font-size:[^;]+/g, '');
                htmlContent = htmlContent.replace(/<font/g, "<span").replace(/<\/font>/g, "</span>");

                if (span.innerHTML.toString() == "")
                    htmlContent = htmlContent + " ";

                var cursorPosition = htmlContent.length;
                span.innerHTML = htmlContent;
                span.setAttribute("style", " font-size: " + fontSize + "pt !important;");

                range.insertNode(span);

                sel = window.getSelection();
                range = sel.getRangeAt(0);
                range.collapse(true);
                var lastChildElement = span.childNodes.length - 1;
                if (cursorPosition == 1) {
                    range.setStart(span.childNodes[0], 1);
                }
                else {
                    range.setEndAfter(span);
                }
                sel.removeAllRanges();
                sel.addRange(range);
            }

        }

        public static SetLineHeight(height: number) {

            var sel, range;
            if (window.getSelection) {
                range = window.getSelection().getRangeAt(0);
                var content = range.extractContents();
                var span = document.createElement('SPAN');
                span.setAttribute("style", " line-height: " + height + "pt !important;");
                span.appendChild(content);
                var htmlContent = span.innerHTML;

                htmlContent = htmlContent.replace(/line-height:[^;]+/g, '');


                if (span.innerHTML.toString() == "")
                    htmlContent = htmlContent + " ";

                var cursorPosition = htmlContent.length;
                span.innerHTML = htmlContent;
                span.setAttribute("style", " line-height: " + height + "pt !important;");

                range.insertNode(span);

                sel = window.getSelection();
                range = sel.getRangeAt(0);
                range.collapse(true);
                var lastChildElement = span.childNodes.length - 1;
                if (cursorPosition == 1) {
                    range.setStart(span.childNodes[0], 1);
                }
                else {
                    range.setEndAfter(span);
                }
                sel.removeAllRanges();
                sel.addRange(range);
            }

        }

    }

    export module Random {

        export class Helper {
            static GetRandomInt(min: number, max: number): number {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            static GetRandomNumberAsString(digits: number) {
                let res = "";
                for (var i = 0; i < digits; i++) {
                    res += Helper.GetRandomInt(0, 9);
                }
                return res;
            }

            static GetRandomCode(includeDigits: boolean = true, lowerCase: boolean = true, upperCase: boolean = true, length: number = 3): string {
                let code = "";
                let chars: string[] = [];
                if (includeDigits == true) {
                    chars = chars.concat(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
                }
                if (lowerCase == true) {
                    chars = chars.concat(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
                }
                if (upperCase == true) {
                    chars = chars.concat(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
                }
                Framework.Array.Shuffle(chars);
                for (let i = 0; i < length; i++) {
                    let index = Helper.GetRandomInt(0, chars.length - 1);
                    code += chars[i];
                }
                return code;
            }

            static GetUniqueRandomCodes(existingCodes: string[], n: number, includeDigits: boolean = true, lowerCase: boolean = true, upperCase: boolean = true, length: number = 3, distance: number = 0): string[] {

                let codes: string[] = [];

                let dist = function (x) {

                    let mind = 1;
                    existingCodes.forEach((code) => {
                        let d = Framework.Random.Helper.Levenshtein(x, code);
                        if (d < mind) {
                            mind = d;
                        }
                    });
                    return mind;
                }

                let nIter = 0;
                for (let i = 0; i < n; i++) {
                    let code = Helper.GetRandomCode(includeDigits, lowerCase, upperCase, length);
                    while (existingCodes.indexOf(code) > -1 || dist(code) < distance) {
                        code = Helper.GetRandomCode(includeDigits, lowerCase, upperCase, length);
                        nIter++;
                        if (nIter > 10) {
                            // Pour ne pas boucler à cause de critères trop restrictifs
                            distance = 0;
                        }
                    }
                    existingCodes.push(code);
                    codes.push(code);
                }

                return codes;
            }

            static Levenshtein(str1: string, str2: string) {

                let cost = [];
                let n = str1.length;
                let m = str2.length;

                var minimum = function (a, b, c) {
                    var min = a;
                    if (b < min) {
                        min = b;
                    }
                    if (c < min) {
                        min = c;
                    }
                    return min;
                }

                if (n == 0) {
                    return;
                }
                if (m == 0) {
                    return;
                }

                for (var i = 0; i <= n; i++) {
                    cost[i] = [];
                }

                for (var i = 0; i <= n; i++) {
                    cost[i][0] = i;
                }

                for (var j = 0; j <= m; j++) {
                    cost[0][j] = j;
                }

                for (i = 1; i <= n; i++) {

                    var x = str1.charAt(i - 1);

                    for (j = 1; j <= m; j++) {

                        var y = str2.charAt(j - 1);

                        if (x == y) {

                            cost[i][j] = cost[i - 1][j - 1];

                        } else {

                            cost[i][j] = 1 + minimum(cost[i - 1][j - 1], cost[i][j - 1], cost[i - 1][j]);
                        }

                    }

                }

                let d = cost[n][m];

                let normD = d / Math.max(n, m);

                return normD;

            }

        }

        export class Generator {
            public IncludeDigits: boolean = true;
            public IncludeUppercases: boolean = false;
            public IncludeLowercases: boolean = false;
            public Length: number = 3;

            public static GetFormContent(rcg: Generator, minLength: number): Framework.Form.TextElement {
                // Options de labels : numbers, minuscules, majuscules, length, reset
                let cbContent = Framework.Form.TextElement.Create("");

                cbContent.Append(Framework.Form.PropertyEditorWithToggle.Render("", "IncludeDigits", rcg.IncludeDigits, (x) => {
                    rcg.IncludeDigits = x;
                }).Editor);

                cbContent.Append(Framework.Form.PropertyEditorWithToggle.Render("", "IncludeUppercase", rcg.IncludeUppercases, (x) => {
                    rcg.IncludeUppercases = x;
                }).Editor);

                cbContent.Append(Framework.Form.PropertyEditorWithToggle.Render("", "IncludeLowercase", rcg.IncludeLowercases, (x) => {
                    rcg.IncludeLowercases = x;
                }).Editor);

                cbContent.Append(Framework.Form.PropertyEditorWithNumericUpDown.Render("", "MinLength1", rcg.Length, minLength, 10, (x) => {
                    rcg.Length = x;
                }, 1).Editor);

                //cbContent.Append(Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {
                //    rcg.IncludeDigits = cb.IsChecked;
                //}, Framework.LocalizationManager.Get("IncludeDigits"), '', rcg.IncludeDigits, ["block"]));
                //cbContent.Append(Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {
                //    rcg.IncludeUppercases = cb.IsChecked;
                //}, Framework.LocalizationManager.Get("IncludeUppercase"), '', rcg.IncludeUppercases, ["block"]));
                //cbContent.Append(Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {
                //    rcg.IncludeLowercases = cb.IsChecked;
                //}, Framework.LocalizationManager.Get("IncludeLowercase"), '', rcg.IncludeLowercases, ["block"]));
                //cbContent.Append(Framework.Form.Select.RenderWithLabel(Framework.LocalizationManager.Get("MinLength"), rcg.Length.toString(), Framework.KeyValuePair.FromArray(['1', '2', '3', '4', '5']), Framework.Form.Validator.NotEmpty(), (newVal) => {
                //    rcg.Length = Number(newVal);
                //}, false, []));
                return cbContent;
            }

            //static GetForm(rcg: RandomCodeGenerator, onValidate: () => void): Framework.Form.TextElement {

            //    // Options de labels : numbers, minuscules, majuscules, length, reset
            //    let cbContent = Framework.Form.TextElement.Create("");
            //    cbContent.Append(Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {
            //        rcg.IncludeDigits = cb.IsChecked;
            //        okButton.CheckState();
            //    }, Framework.LocalizationManager.Get("IncludeDigits"), '', rcg.IncludeDigits, ["block"]));
            //    cbContent.Append(Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {
            //        rcg.IncludeUppercases = cb.IsChecked;
            //        okButton.CheckState();
            //    }, Framework.LocalizationManager.Get("IncludeUppercase"), '', rcg.IncludeUppercases, ["block"]));
            //    cbContent.Append(Framework.Form.CheckBox.Create(() => { return true; }, (ev, cb) => {
            //        rcg.IncludeLowercases = cb.IsChecked;
            //        okButton.CheckState();
            //    }, Framework.LocalizationManager.Get("IncludeLowercase"), '', rcg.IncludeLowercases, ["block"]));
            //    cbContent.Append(Framework.Form.Select.Render(length.toString(), Framework.KeyValuePair.FromArray(['1', '2', '3', '4', '5']), Framework.Form.Validator.NotEmpty(), (newVal) => {
            //        //length = Number(newVal);
            //        rcg.Length = Number(newVal);
            //    }, false, ["block", "selectItemLabelsButton"]));

            //    let okButton = Framework.Form.Button.Create(() => { return (rcg.IncludeLowercases == true || rcg.IncludeUppercases == true || rcg.IncludeDigits == true); }, () => {
            //        onValidate();
            //    }, Framework.LocalizationManager.Get("NewLabels"), ["block", "btn", "btn-primary"], "")

            //    cbContent.Append(okButton);

            //    return cbContent;


            //}
        }

    }

    export class DateDiff {

        public static ToDays(date1: Date, date2: Date): number {
            let timeDiff = Math.abs(date2.getTime() - date1.getTime());
            let dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return dayDifference;
        }
    }

    //export class DateFormat {
    //    public static Get(d: Date = undefined, format: string = "DateTime", lang: string = "en"): string {

    //        if (d == undefined) {
    //            d = new Date(Date.now());
    //        }

    //        let year = "" + d.getFullYear();
    //        let month = "" + (d.getMonth() + 1);
    //        if (month.length == 1) { month = "0" + month; }
    //        let day = "" + d.getDate();
    //        if (day.length == 1) { day = "0" + day; }
    //        let hour = "" + d.getHours();
    //        if (hour.length == 1) { hour = "0" + hour; }
    //        let minute = "" + d.getMinutes();
    //        if (minute.length == 1) { minute = "0" + minute; }
    //        let second = "" + d.getSeconds();
    //        if (second.length == 1) { second = "0" + second; }
    //        if (lang == "en") {
    //            if (format == "DateTime") {
    //                return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    //            }
    //            if (format == "Date") {
    //                return year + "-" + month + "-" + day;
    //            }
    //            if (format == "Time") {
    //                return hour + ":" + minute + ":" + second;
    //            }
    //        }
    //        if (lang == "fr") {
    //            if (format == "DateTime") {
    //                return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
    //            }
    //            if (format == "Date") {
    //                return day + "/" + month + "/" + year;
    //            }
    //            if (format == "Time") {
    //                return hour + ":" + minute + ":" + second;
    //            }
    //        }
    //    }
    //}

    export class Pivot {

        public static Render(container: HTMLDivElement, data: any[], rows: string[], cols: string[], vals: string[], hiddenAttributes: string[], aggregator: string = "Count", renderer: string = "Table", onRefresh: Function = () => { }) {

            $(container).pivotUI(
                data, {
                rows: rows,
                cols: cols,
                vals: vals,
                aggregatorName: aggregator,
                rendererName: renderer,
                hiddenAttributes: hiddenAttributes,
                onRefresh: onRefresh
            });

        }
    }

    export class PowerPoint {
        public static Create() {

            //TODO
            //https://gitbrent.github.io/PptxGenJS/docs/api-text.html

            var pptx = new PptxGenJS();


            pptx.setAuthor('Brent Ely');
            pptx.setCompany('S.T.A.R. Laboratories');
            pptx.setRevision('15');
            pptx.setSubject('Annual Report');
            pptx.setTitle('PptxGenJS Sample Presentation');

            pptx.setLayout('LAYOUT_WIDE');

            pptx.setLayout({ name: 'A3', width: 16.5, height: 11.7 });


            var slide = pptx.addNewSlide();
            slide.addText('Hello World!', { x: 1.5, y: 1.5, fontSize: 18, color: '363636' });
            pptx.save('Sample Presentation');
        }
    }

    export class Screenshot {

        //export function Screenshot(element: HTMLElement, callback: (b64img: string) => void) {

        //// Marche pas dans IE

        //html2canvas(element).then(function (canvas) {
        //    //// Export the canvas to its data URI representation
        //    var base64image = canvas.toDataURL("image/png");
        //    callback(base64image);

        //    // Open the image in a new window
        //    //window.open(base64image, "_blank");

        //    //canvas.toBlob(function (blob) {
        //    //    // Generate file download
        //    //    Framework.File.SaveAs(blob, "yourwebsite_screenshot.png");
        //    //});

        //});

        public static Capture(elt: HTMLElement, callback: (b64img: string) => void, height: number, width: number) {

            html2canvas(elt, { width: width, height: height }).then(canvas => {
                var base64image = canvas.toDataURL("image/png");
                callback(base64image);
            }).catch(e => {
                alert(e);
            });

        }

        public static SaveAs(elt: HTMLElement, filename: string = undefined) {

            html2canvas(elt).then(canvas => {
                //document.body.appendChild(canvas)
                //var dataURL = canvas.toDataURL();
                //console.log(dataURL);
                //canvas.toBlob(function (blob) {
                //    // Generate file download
                //    File.SaveAs(blob, "yourwebsite_screenshot.png");
                //});


                var base64image = canvas.toDataURL("image/png");

                // Split the base64 string in data and contentType
                var block = base64image.split(";");
                // Get the content type
                var mimeType = block[0].split(":")[1];// In this case "image/png"
                // get the real base64 content of the file
                var realData = block[1].split(",")[1];// For example:  iVBORw0KGgouqw23....

                // Convert b64 to blob and store it into a variable (with real base64 as value)
                var canvasBlob = Screenshot.B64toBlob(realData, mimeType);

                if (filename == undefined) {
                    filename = "screenshot" + Random.Helper.GetRandomNumberAsString(4) + ".png";
                }

                // Generate file download
                FileHelper.SaveAs(canvasBlob, filename);

            }).catch(e => {
                alert(e);
            });

        }

        public static Clipboard(elt: HTMLElement) {

            html2canvas(elt).then(canvas => {
                var img = document.createElement('img');
                img.src = canvas.toDataURL()

                var div = document.createElement('div');
                div.contentEditable = "true";
                div.appendChild(img);
                document.body.appendChild(div);

                var doc = document;
                if ((<any>doc.body).createTextRange) {
                    var range1 = (<any>document.body).createTextRange();
                    range1.moveToElementText(div);
                    range1.select();
                } else if (window.getSelection) {
                    var selection = window.getSelection();
                    var range = document.createRange();
                    range.selectNodeContents(div);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }

                document.execCommand('Copy');
                document.body.removeChild(div);
            });

        }

        public static B64toBlob(b64Data, contentType, sliceSize = 512) {
            contentType = contentType || '';

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = [];
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers.push(slice.charCodeAt(i));
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }

    }

    export module ImportManager {

        export class ColumnTemplate {
            public AttributeName: string; // Nom de l'attribut de l'objet
            public Synonyms: string[]; // Noms à rechercher dans le fichier à importer, synonymes du nom de l'attribut
            public IsImperative: boolean;
            public Description: string;
            public Type: any;
            public ColumnName; // Nom de la colonne dans le fichier à importer            
        }

        export class Template {
            public Name: string;
            public ColumnTemplates: ImportManager.ColumnTemplate[];
            public NbFixedColumns: number = 0;
        }

        export class Form<T> {

            private template: ImportManager.Template;
            private importedObject;
            private foundColumnNames: string[] = [];
            //private dataTableParameters: Framework.Form.DataTableParameters;
            private tabOfObject: T[];

            private isValid: boolean = false;

            //TODO : progressbar

            public get ImportedObject(): any {
                return this.importedObject;
            }

            //public get DataTableParameters(): Framework.Form.DataTableParameters {
            //    return this.dataTableParameters;
            //}

            public get IsValid(): boolean {
                return this.isValid;
            }

            public CheckValidity() {
                let self = this;
                this.isValid = true;
                this.template.ColumnTemplates.forEach((x) => {
                    if (x.IsImperative == true && (x.ColumnName == "" || x.ColumnName == "[Select]")) {
                        self.isValid = false;
                    }
                });
            }

            public static ImportFromXML<T>(template: ImportManager.Template, importFromXMLFunction: (json: string, cb: (data: T[]) => void) => void, onSuccess: (res: Framework.ImportManager.Form<T>) => void) {

                let form: ImportManager.Form<T> = new ImportManager.Form<T>();
                form.template = template;

                let input: Framework.Form.InputFile = Framework.Form.InputFile.Create(".xml", (file) => {

                    let extension = file.name.split('.')[1];

                    var fileReader: FileReader = new FileReader();
                    fileReader.onload = function (e) {
                        if (!e) {
                            var data = (<any>fileReader).content;
                        }
                        else {
                            var data = (<any>e.target).result;
                        }

                        importFromXMLFunction(data, (listData: T[]) => {
                            form.importedObject = listData;
                            form.prepareImport(template, onSuccess);


                            //onSuccess(form);
                        });

                        document.body.removeChild(input.HtmlElement);
                    }

                    fileReader.readAsText(file);
                });

                input.Hide();
                document.body.appendChild(input.HtmlElement);
                input.Click();
            }


            public static Import<T>(extension: string, template: ImportManager.Template, onSuccess: (form: Form<T>) => void/*, onValidityChanged: (validity: boolean) => void*/) {

                let form: ImportManager.Form<T> = new ImportManager.Form<T>();
                form.template = template;
                form.foundColumnNames = [];

                let input: Framework.Form.InputFile = Framework.Form.InputFile.Create(extension, (file) => {

                    let extension = file.name.split('.')[1];

                    var fileReader: FileReader = new FileReader();
                    fileReader.onload = function (e) {
                        if (!e) {
                            var data = (<any>fileReader).content;
                        }
                        else {
                            var data = (<any>e.target).result;
                        }

                        if (extension == "xls" || extension == "xlsx") {
                            var workbook = XLSX.read(data, {
                                type: 'binary'
                            });

                            // TODO : Si plusieurs onglets, afficher nom onglet à importer
                            let index = 0;
                            workbook.SheetNames.forEach(function (sheetName) {
                                if (index == 0) {
                                    form.importedObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                }
                                index++;
                            })

                            form.prepareImport(template, onSuccess/*, onValidityChanged*/);
                        }

                        if (extension == "csv" || extension == "txt") {

                            // Séparateur de lignes
                            let lineSeparator: string = "";

                            if (data.indexOf('\r\n') > -1) {
                                lineSeparator = '\r\n';
                            } else if (data.indexOf('\r') > -1) {
                                lineSeparator = '\r';
                            } else if (data.indexOf('\n') > -1) {
                                lineSeparator = '\n';
                            }

                            if (lineSeparator == "") {
                                //TODO : erreur
                            }

                            let lines: string[] = data.split(lineSeparator);
                            let firstLine: string = lines[0];
                            let separator: string = "";

                            // Trouver séparateur de champ sur la première ligne
                            if (firstLine.indexOf(';') > -1) {
                                separator = ';';
                            } else if (firstLine.indexOf(',') > -1) {
                                separator = ',';
                            } else if (firstLine.indexOf('\t') > -1) {
                                separator = '\t';
                            }

                            if (separator == "") {
                                //TODO : erreur
                            }

                            form.importedObject = [];

                            firstLine = firstLine.replace('ï»¿', ''); //BOM

                            firstLine = firstLine.replace(/[`~!@#$%^&*()_|+\-=?:'".<>\{\}\[\]\\\/]/gi, '');

                            let headerColumns: string[] = firstLine.split(separator);

                            lines.slice(1).forEach((line) => {
                                let cols: string[] = line.replace(/[`~!@#$%^&*()_|+\-=?:'"<>\{\}\[\]\\\/]/gi, '').split(separator);
                                let obj = {};
                                for (var i = 0; i < headerColumns.length; i++) {
                                    obj[headerColumns[i]] = cols[i]; //.replace(/[`~!@#$%^&*()_|+\-=?:'"<>\{\}\[\]\\\/]/gi, '');
                                }
                                form.importedObject.push(obj);
                            });

                            form.prepareImport(template, onSuccess/*, onValidityChanged*/);

                            // //TODO Séparateur décimal ?

                        }

                        document.body.removeChild(input.HtmlElement);
                    }

                    fileReader.readAsBinaryString(file);

                });

                input.Hide();
                document.body.appendChild(input.HtmlElement);
                input.Click();
            }

            private generateTemplateColumns(template: ImportManager.Template, nb: number) {
                let columnsToBeGenerated = template.ColumnTemplates.filter((x) => { return x.Type == "Automatic" });
                columnsToBeGenerated.forEach((x) => {
                    for (let i = 1; i <= nb; i++) {
                        let columTemplate = new ColumnTemplate();
                        columTemplate.AttributeName = x.AttributeName + i;
                        columTemplate.ColumnName = x.ColumnName;
                        columTemplate.Description = x.Description;
                        columTemplate.IsImperative = x.IsImperative;
                        columTemplate.Synonyms = [];
                        x.Synonyms.forEach((s) => {
                            columTemplate.Synonyms.push(s + " " + i);
                            columTemplate.Synonyms.push(s + i);
                        });
                        Framework.Array.Remove(template.ColumnTemplates, x);
                        template.ColumnTemplates.push(columTemplate);
                    }
                });
            }

            private prepareImport(template: ImportManager.Template, onSuccess: (form: Form<T>) => void/*, onValidityChanged: (validity: boolean) => void*/) {
                // Noms des colonnes du fichier
                for (var propertyName in this.importedObject[0]) {
                    this.foundColumnNames.push(propertyName);
                }

                let lowerFoundColumnNames = this.foundColumnNames.map((s: string) => { return s.toLowerCase(); });

                // Génération des colonnes automatiques
                let nb: number = this.foundColumnNames.length - template.NbFixedColumns;
                this.generateTemplateColumns(template, nb);

                //{ AttributeName: "Rank", Synonyms: ["rank", "rang"], IsImperative: true, Description: "Code", Type: "Automatic", ColumnName: "" }

                // Appariement par défaut des attributs de l'objet avec les colonnes du fichier
                template.ColumnTemplates.forEach((x) => {
                    let defaultValue = "[Select]";//TODO
                    let synonyms = x.Synonyms.map((s: string) => { return s.toLowerCase(); });
                    let intercept = Array.Intercept(synonyms, lowerFoundColumnNames);

                    if (intercept.length > 0) {
                        let index = lowerFoundColumnNames.indexOf(intercept[0]);
                        defaultValue = this.foundColumnNames[index];
                    }
                    x.ColumnName = defaultValue;
                });


                //let dtParameters = new Framework.Form.DataTableParameters();
                //dtParameters.ListData = template.ColumnTemplates;
                //dtParameters.ListColumns = [
                //    { data: "AttributeName", title: Framework.LocalizationManager.Get("AttributeName") },
                //    { data: "ColumnName", title: Framework.LocalizationManager.Get("ColumnName") },
                //    { data: "IsImperative", title: Framework.LocalizationManager.Get("IsImperative") },
                //    { data: "Description", title: Framework.LocalizationManager.Get("Description") }
                //];
                //dtParameters.Order = [];
                //dtParameters.Paging = false;
                //dtParameters.OnSelectionChanged = undefined;

                //let kvp: Framework.KeyValuePair[] = [];

                //kvp.push({ Key: "[Select]", Value: "[Select]" });

                //for (var propertyName in this.importedObject[0]) {
                //    let p = propertyName;
                //    kvp.push({ Key: p, Value: p });
                //}

                ////TODO :champ vide

                //let self = this;

                //dtParameters.OnEditCell = (propertyName, data) => {
                //    if (propertyName == "ColumnName") {
                //        //TODO : validation que si data["IsImperative"]==true
                //        return Framework.Form.Select.Render(data["ColumnName"], kvp, Framework.Form.Validator.NotEmpty(), (x, y) => {
                //            if (y.IsValid == true) {
                //                data["ColumnName"] = x;
                //            }
                //            self.CheckValidity();
                //            onValidityChanged(self.isValid);
                //        }, true, ["tableInput"]).HtmlElement;
                //    }
                //}

                //this.dataTableParameters = dtParameters;
                //this.CheckValidity();
                //if (onValidityChanged) {
                //    onValidityChanged(this.isValid);
                //}
                onSuccess(this);

            }

            private import() {

                let self = this;

                this.tabOfObject = [];

                this.importedObject.forEach((line) => {
                    let obj = {};

                    //TODO : valeur par défaut, vérifier type
                    //let nb: number = Object.getOwnPropertyNames(line).length - self.template.NbFixedColumns;
                    //self.generateTemplateColumns(self.template, nb);

                    self.template.ColumnTemplates.forEach((t) => {
                        obj[t.AttributeName] = line[t.ColumnName];
                    });
                    self.tabOfObject.push(obj as T);
                });
            }

            private getPreviewDataTableParameters(): Framework.Form.DataTableParameters {

                let self = this;

                this.import();

                let dtParametersApercu = new Framework.Form.DataTableParameters();
                dtParametersApercu.ListData = this.tabOfObject.slice(0, Math.min(10, this.tabOfObject.length));
                dtParametersApercu.ListColumns = [];
                this.template.ColumnTemplates.forEach((c) => {
                    dtParametersApercu.ListColumns.push({
                        "data": c.AttributeName, "title": Framework.LocalizationManager.Get(c.AttributeName), "render": function (data, type, row) {
                            if (type === 'display') {
                                if (data == undefined) {
                                    return "";
                                }
                                return data;
                            }
                            return "";
                        }
                    });
                });
                dtParametersApercu.Order = [];
                dtParametersApercu.Paging = false;
                return dtParametersApercu;
            }
        }

    }

    export class ExportManager {

        public static CreateWorkBook() {
            let wb = XLSX.utils.book_new();

            wb.Props = {
                Title: "SheetJS Tutorial",
                Subject: "Test",
                Author: "Red Stapler",
                CreatedDate: new Date(2017, 12, 19)
            };

            wb.SheetNames.push("Test Sheet");

            var ws_data = [['hello', 'world'], ['hello', 'world']];  //a row with 2 columns
            var ws = XLSX.utils.aoa_to_sheet(ws_data);
            wb.Sheets["Test Sheet"] = ws;

            var wopts = { bookType: 'xlsx', bookSST: false, type: 'array' };
            var wbout = XLSX.write(wb, wopts);
            saveAs(new Blob([wbout], { type: "application/octet-stream" }), "test.xlsx");
        }

        private wb;

        constructor(title: string = "", subject: string = "", author: string = "") {
            this.wb = XLSX.utils.book_new();

            this.wb.Props = {
                //Subject: subject,
                //Author: author,
                //CreatedDate: new Date(Date.now().toString())
                Title: title,
                Subject: subject,
                Author: author,
                CreatedDate: new Date(Date.now())
            };

        }

        public AddWorksheet(sheetName: string, data: string[][]) {
            this.wb.SheetNames.push(sheetName);
            var ws_data = data;
            var ws = XLSX.utils.aoa_to_sheet(ws_data);
            this.wb.Sheets[sheetName] = ws;
        }

        public Save(filename: string, format: string,) {
            var wopts = { bookType: format, bookSST: false, type: 'array' };
            var wbout = XLSX.write(this.wb, wopts);
            saveAs(new Blob([wbout], { type: "application/octet-stream" }), filename + "." + format);
        }

        private s2ab(s) {
            var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
            var view = new Uint8Array(buf);  //create uint8array as viewer
            for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
            return buf;
        }
    }

    export class BlobHelper {

        public static BlobToBase64(blob, cb) {
            var reader = new FileReader();
            reader.onload = function () {
                //var dataUrl = reader.result;
                //alert(dataUrl);
                //var base64 = dataUrl.split(',')[1];
                var base64 = (<any>reader.result).replace(/^data:.+;base64,/, '');
                cb(base64);
            };
            reader.readAsDataURL(blob);
        }


    }

    export class Format {

        public static Unique(id: string, ids: string[]) {
            let i = 1;
            //let newId: string = id + "_" + i.toString();
            let newId: string = id;
            while (ids.indexOf(newId) > -1) {
                i += 1;
                newId = id + "_" + i.toString();
            }
            return (newId);
        }

        public static GetCode(list: string[], prefix: string, length: number = 3): string {

            let code: number = 1;

            let f = function () {
                return (list.filter((x) => { return x == prefix + Framework.Format.PadLeft(code, length) })).length > 0;
            }

            while (f() == true) {
                code += 1;
            }
            return prefix + Framework.Format.PadLeft(code, length);
        }

        public static GetNumberAtEndOfString(text: string): number {
            return parseInt(text.match(/\d+$/)[0], 10);
        }


        public static PadLeft(n: string | number, size: number): string {
            let s = n.toString();
            while (s.length < (size || 2)) {
                s = "0" + s;
            }
            return s;
        }

        public static ToDateString(d: Date = undefined, format: string = "DateTime", lang: string = "en"): string {

            if (d == undefined) {
                d = new Date(Date.now());
            }

            let year = "" + d.getFullYear();
            let month = "" + (d.getMonth() + 1);
            if (month.length == 1) { month = "0" + month; }
            let day = "" + d.getDate();
            if (day.length == 1) { day = "0" + day; }
            let hour = "" + d.getHours();
            if (hour.length == 1) { hour = "0" + hour; }
            let minute = "" + d.getMinutes();
            if (minute.length == 1) { minute = "0" + minute; }
            let second = "" + d.getSeconds();
            if (second.length == 1) { second = "0" + second; }
            if (lang == "en") {
                if (format == "DateTime") {
                    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
                }
                if (format == "Date") {
                    return year + "-" + month + "-" + day;
                }
                if (format == "Time") {
                    return hour + ":" + minute + ":" + second;
                }
            }
            if (lang == "fr") {
                if (format == "DateTime") {
                    return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
                }
                if (format == "Date") {
                    return day + "/" + month + "/" + year;
                }
                if (format == "Time") {
                    return hour + ":" + minute + ":" + second;
                }
            }
        }
    }

    export class Command {

        private execute: () => void;
        private undo: () => void;

        constructor(execute: () => void, undo: () => void = undefined) {
            this.execute = execute;
            this.undo = undo;
        }

        public Execute() {
            this.execute();
        }

        public get Undoable(): boolean {
            return this.undo != undefined;
        }

        public Undo() {
            this.undo();
        }
    }

    export class InlineHTMLEditor {

        public static FontNameEnum: string[] = ["Arial", "Calibri", "Comic Sans MS", "Courier New", "Georgia", "Helvetica", "Palatino", "Times New Roman", "Trebuchet MS", "Verdana"];

        public static FontSizeEnum: string[] = ['8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '40', '50', '60', '70', '80'];

        private static show(content: HTMLElement, elt: HTMLElement = undefined, pos: string = 'top') {

            var rect: ClientRect;

            if (elt != undefined) {
                rect = elt.getBoundingClientRect();
            } else {
                var selection = window.getSelection();
                if (selection) {
                    var range = selection.getRangeAt(0);
                    rect = range.getBoundingClientRect();
                } else {
                    return;
                }
            }

            var tooltipWrap = content;
            tooltipWrap.className = 'customtooltip';
            //tooltipWrap.appendChild(content); //TODO : effect

            //$(content).appendTo(tooltipWrap).show("scale", { percent: 200, direction: 'horizontal', origin: ['top', 'left'] });

            var firstChild = document.body.firstChild;
            firstChild.parentNode.insertBefore(tooltipWrap, firstChild);

            var padding = 5;
            var linkProps = rect;
            var tooltipProps = tooltipWrap.getBoundingClientRect();

            var topPos = 0;
            var leftPos = 0;

            if (pos == 'top') {
                topPos = linkProps.top - (tooltipProps.height + padding);
                leftPos = linkProps.left;
                tooltipWrap.classList.add("top");
            }

            if (pos == 'right') {
                topPos = linkProps.top;
                leftPos = linkProps.right + padding;
                tooltipWrap.classList.add("right");
            }

            if (pos == 'left') {
                topPos = linkProps.top;
                leftPos = linkProps.left + padding;
                tooltipWrap.classList.add("left");
            }

            tooltipWrap.setAttribute('style', 'top:' + topPos + 'px;' + 'left:' + leftPos + 'px;')
            tooltipWrap.style.zIndex = "9999";

            document.onmousedown = (e) => {
                if ((<HTMLElement>e.target).tagName != "BUTTON" && (<HTMLElement>e.target).tagName != "INPUT" && (<HTMLElement>e.target).tagName != "SELECT") {
                    $(".customtooltip").remove();
                }
            };
        }

        public static Show(callback: Function = undefined, insertSpecialTextButtons: Framework.Form.Button[] = [], showBaseButtons: boolean = true) {
            let div = document.createElement("div");

            Framework.InlineHTMLEditor.GetButtons(callback, insertSpecialTextButtons, showBaseButtons).forEach((x) => {
                div.appendChild(x.HtmlElement);
            });

            Framework.InlineHTMLEditor.show(div, undefined);
        }

        public static SetSelection(element: HTMLElement) {
            var newSelection = element;
            var selection = window.getSelection();
            var range = document.createRange();
            range.setStartBefore(newSelection.firstChild);
            range.setEndAfter(newSelection.lastChild);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        public static GetButtons(callback: Function = undefined, insertSpecialTextButtons: Framework.Form.Button[] = [], showBaseButtons: boolean = true /*selection:HTMLElement = undefined*/): Framework.Form.ClickableElement[] {

            let res = [];

            //let setSelection = () => {
            //    if (selection != undefined) {
            //        InlineHTMLEditor.SetSelection(selection);
            //    }
            //}

            if (callback == undefined) {
                callback = () => { };
            }

            if (showBaseButtons == true) {

                let b1 = Framework.Form.Button.Create(() => { return true; }, () => {
                    //setSelection();
                    Framework.Selection.ApplyStyle('text-align', 'left', 'p,div');
                    callback();
                }, "", ["toolboxbutton", "alignLeftButton", "background60"], Framework.LocalizationManager.Get("AlignTextLeftTooltip"))
                b1.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(b1);

                let b2 = Framework.Form.Button.Create(() => { return true; }, () => {
                    //setSelection();
                    Framework.Selection.ApplyStyle('text-align', 'center', 'p,div');
                    callback();
                }, "", ["toolboxbutton", "alignCenterButton", "background60"], Framework.LocalizationManager.Get("AlignTextCenterTooltip"));
                b2.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(b2);

                let b3 = Framework.Form.Button.Create(() => { return true; }, () => {
                    //setSelection();
                    Framework.Selection.ApplyStyle('text-align', 'right', 'p,div');
                    callback();
                }, "", ["toolboxbutton", "alignRightButton", "background60"], Framework.LocalizationManager.Get("AlignTextRightTooltip"));
                b3.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(b3);

                let b4 = Framework.Form.Button.Create(() => { return true; }, () => {
                    //setSelection();
                    Framework.Selection.ApplyStyle('text-align', 'justify', 'p,div');
                    callback();
                }, "", ["toolboxbutton", "alignJustifyButton", "background60"], Framework.LocalizationManager.Get("AlignTextJustifyTooltip"));
                b4.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(b4);

                let b5 = Framework.Form.Button.Create(() => { return true; }, (e) => {
                    //setSelection();                                                                
                    document.execCommand('bold', false, '');
                    //Framework.Selection.ApplyStyle('font-weight', 'bold', 'p,div');
                    callback();
                }, "", ["toolboxbutton", "boldButton", "background60"], Framework.LocalizationManager.Get("ToggleBoldTooltip"));
                b5.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(b5);

                let b6 = Framework.Form.Button.Create(() => { return true; }, () => {
                    //setSelection();
                    document.execCommand('italic', false, '');
                    callback();
                }, "", ["toolboxbutton", "italicButton", "background60"], Framework.LocalizationManager.Get("ToggleItalicTooltip"));
                b6.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(b6);

                let b7 = Framework.Form.Button.Create(() => { return true; }, () => {
                    //setSelection();
                    document.execCommand('strikeThrough', false, '');
                    callback();
                }, "", ["toolboxbutton", "strikethroughButton", "background60"], Framework.LocalizationManager.Get("ToggleStrikeThroughTooltip"));
                b7.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(b7);

                let b8 = Framework.Form.Button.Create(() => { return true; }, () => {
                    //setSelection();
                    document.execCommand('underline', false, '');
                    callback();
                }, "", ["toolboxbutton", "underlineButton", "background60"], Framework.LocalizationManager.Get("ToggleUnderlineTooltip"));
                b8.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(b8);

                let b9 = Framework.Form.Button.Create(() => { return true; }, () => {
                    //setSelection();
                    document.execCommand('subscript', false, '');
                    callback();
                }, "", ["toolboxbutton", "subscriptButton", "background60"], Framework.LocalizationManager.Get("ToggleSubscriptTooltip"));
                b9.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(b9);

                let b10 = Framework.Form.Button.Create(() => { return true; }, () => {
                    //setSelection();
                    document.execCommand('superscript', false, '');
                    callback();
                }, "", ["toolboxbutton", "superscriptButton", "background60"], Framework.LocalizationManager.Get("ToggleSuperscriptTooltip"));
                b10.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(b10);

                let fontFamilyButton = Framework.Form.Button.Create(() => { return true; }, () => {
                }, "", ["toolboxbutton", "fontNameButton", "background60"], Framework.LocalizationManager.Get("FontNameTooltip"));

                let fontFamilyDiv = Framework.Form.TextElement.Create("");
                fontFamilyDiv.HtmlElement.style.height = "170px";
                fontFamilyDiv.HtmlElement.style.width = "120px";
                fontFamilyDiv.HtmlElement.style.overflow = "hidden";
                InlineHTMLEditor.FontNameEnum.forEach((x) => {
                    let button = Framework.Form.Button.Create(() => { return true; }, () => {
                        //setSelection();
                        document.execCommand('fontName', false, x);
                        callback();
                    }, x, ["popupEditableProperty"]);
                    button.HtmlElement.style.fontFamily = x;
                    fontFamilyDiv.Append(button);
                });
                Framework.Popup.Create(fontFamilyButton.HtmlElement, fontFamilyDiv.HtmlElement);
                fontFamilyButton.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(fontFamilyButton);

                let fontSizeButton = Framework.Form.Button.Create(() => { return true; }, () => {
                }, "", ["toolboxbutton", "fontSizeButton", "background60"], Framework.LocalizationManager.Get("FontSizeTooltip"));

                let fontSizeDiv = Framework.Form.TextElement.Create("");
                fontSizeDiv.HtmlElement.style.height = "340px";
                fontSizeDiv.HtmlElement.style.width = "70px";
                fontSizeDiv.HtmlElement.style.overflow = "hidden";
                InlineHTMLEditor.FontSizeEnum.forEach((x) => {
                    let button = Framework.Form.Button.Create(() => { return true; }, () => {
                        //setSelection();
                        Framework.Selection.SetFontSize(Number(x));
                        callback();
                    }, x, ["popupEditableProperty"]);
                    button.HtmlElement.style.fontSize = x + "px";
                    button.HtmlElement.style.height = x + "px";
                    fontSizeDiv.Append(button);
                });
                Framework.Popup.Create(fontSizeButton.HtmlElement, fontSizeDiv.HtmlElement);
                fontSizeButton.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(fontSizeButton);

                let fontColorButton = Framework.Form.Button.Create(() => { return true; }, () => {
                }, "", ["toolboxbutton", "foregroundButton", "background60"], Framework.LocalizationManager.Get("ForegroundTooltip"));

                let fontColorDiv = Framework.Form.TextElement.Create("");
                fontColorDiv.HtmlElement.style.height = "180px";
                fontColorDiv.HtmlElement.style.width = "288px";
                fontColorDiv.HtmlElement.style.overflow = "hidden";
                Framework.Color.List.forEach((x) => {
                    let button = Framework.Form.Button.Create(() => { return true; }, () => {
                        //setSelection();
                        document.execCommand('foreColor', false, x.Hex);
                        callback();
                    }, "", ["popupEditableProperty"]);
                    button.HtmlElement.style.height = "16px";
                    button.HtmlElement.style.width = "16px";
                    button.HtmlElement.style.marginRight = "2px";
                    button.HtmlElement.style.marginBottom = "2px";
                    button.HtmlElement.style.cssFloat = "left";
                    button.HtmlElement.style.background = x.Hex;
                    button.HtmlElement.title = x.Name + "(" + x.Hex + ")";
                    fontColorDiv.Append(button);
                });
                Framework.Popup.Create(fontColorButton.HtmlElement, fontColorDiv.HtmlElement);
                fontColorButton.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(fontColorButton);

                let backColorButton = Framework.Form.Button.Create(() => { return true; }, () => {
                }, "", ["toolboxbutton", "backgroundButton", "background60"], Framework.LocalizationManager.Get("BackgroundTooltip"));

                let backColorDiv = Framework.Form.TextElement.Create("");
                backColorDiv.HtmlElement.style.height = "180px";
                backColorDiv.HtmlElement.style.width = "288px";
                backColorDiv.HtmlElement.style.overflow = "hidden";
                Framework.Color.List.forEach((x) => {
                    let button = Framework.Form.Button.Create(() => { return true; }, () => {
                        //setSelection();
                        document.execCommand('backColor', false, x.Hex);
                        callback();
                    }, "", ["popupEditableProperty"]);
                    button.HtmlElement.style.height = "16px";
                    button.HtmlElement.style.width = "16px";
                    button.HtmlElement.style.marginRight = "2px";
                    button.HtmlElement.style.marginBottom = "2px";
                    button.HtmlElement.style.cssFloat = "left";
                    button.HtmlElement.style.background = x.Hex;
                    button.HtmlElement.title = x.Name + "(" + x.Hex + ")";
                    backColorDiv.Append(button);
                });
                Framework.Popup.Create(backColorButton.HtmlElement, backColorDiv.HtmlElement);
                backColorButton.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(backColorButton);
            }

            if (insertSpecialTextButtons.length > 0) {
                let insertSpecialTextButton = Framework.Form.Button.Create(() => { return true; }, () => {
                }, "", ["toolboxbutton", "insertButton", "background60"], Framework.LocalizationManager.Get("InsertSpecialTextTooltip"));

                let insertSpecialTextDiv = Framework.Form.TextElement.Create("");
                //insertSpecialTextDiv.HtmlElement.style.minHeight = "120px";
                //insertSpecialTextDiv.HtmlElement.style.width = "280px";
                insertSpecialTextDiv.HtmlElement.style.overflow = "hidden";
                //ScreenReader.Controls.TextArea.SpecialTextEnum.forEach((x) => {
                //    let button = Framework.Form.Button.Create(() => { return true; }, () => { Framework.Selection.Replace("/" + x + "/"); }, Framework.LocalizationManager.Get(x), ["popupEditableProperty"]);
                //    insertSpecialTextDiv.Append(button);
                //});

                insertSpecialTextButtons.forEach((x) => {
                    insertSpecialTextDiv.Append(x);
                });

                Framework.Popup.Create(insertSpecialTextButton.HtmlElement, insertSpecialTextDiv.HtmlElement);
                insertSpecialTextButton.HtmlElement.onmousedown = (e) => {
                    e.preventDefault();
                }
                res.push(insertSpecialTextButton);
            }



            //TODO : indent, outdent, tableproperties

            return res;
        }

    }

    export class CommandInvoker {

        private commands: Command[] = [];
        private current = -1;
        private onChange: () => void;

        constructor(onChange: () => void) {
            this.onChange = onChange;
        }

        public ExecuteCommand(command: Command) {

            if (command.Undoable == false) {
                command.Execute();
                return;
            }

            if (this.commands.length - 1 > this.current) {
                var next = this.current + 1
                this.commands.splice(next, this.commands.length - next);
            }
            this.commands.push(command);
            command.Execute();
            this.current = this.commands.length - 1;
            this.onChange();
        }

        public Undo() {
            if (this.current >= 0) {
                this.commands[this.current--].Undo();
            }
            this.onChange();
        }

        public get CanUndo(): boolean {
            return this.current >= 0;
        }

        public get CanRedo(): boolean {
            return (this.current < this.commands.length - 1);
        }

        public Redo() {
            if (this.current < this.commands.length - 1) {
                this.commands[++this.current].Execute();
            }
            this.onChange();
        }
    }

    export class Maths {

        public static Sequence(min: number, max: number): number[] {
            let res = [];
            for (let i = min; i <= max; i++) {
                res.push(i);
            }
            return res;
        }

        public static Round(val: number, digits: number): number {
            let mult = "1";
            for (var i = 0; i < digits; i++) {
                mult += "0";
            }
            let multN = Number(mult);

            let res = Math.round(val * multN) / multN;
            return res;
        }

        public static Floor(val: number, digits: number): number {
            let mult = "1";
            for (var i = 0; i < digits; i++) {
                mult += "0";
            }
            let multN = Number(mult);

            let res = Math.floor(val * multN) / multN;
            return res;
        }

        public static Combinations(array: any[], k: number): any[] {
            var i, j, combs, head, tailcombs;

            // There is no way to take e.g. sets of 5 elements from
            // a set of 4.
            if (k > array.length || k <= 0) {
                return [];
            }

            // K-sized set has only one K-sized subset.
            if (k == array.length) {
                return [array];
            }

            // There is N 1-sized subsets in a N-sized set.
            if (k == 1) {
                combs = [];
                for (i = 0; i < array.length; i++) {
                    combs.push([array[i]]);
                }
                return combs;
            }

            // Assert {1 < k < set.length}

            // Algorithm description:
            // To get k-combinations of a set, we want to join each element
            // with all (k-1)-combinations of the other elements. The set of
            // these k-sized sets would be the desired result. However, as we
            // represent sets with lists, we need to take duplicates into
            // account. To avoid producing duplicates and also unnecessary
            // computing, we use the following approach: each element i
            // divides the list into three: the preceding elements, the
            // current element i, and the subsequent elements. For the first
            // element, the list of preceding elements is empty. For element i,
            // we compute the (k-1)-computations of the subsequent elements,
            // join each with the element i, and store the joined to the set of
            // computed k-combinations. We do not need to take the preceding
            // elements into account, because they have already been the i:th
            // element so they are already computed and stored. When the length
            // of the subsequent list drops below (k-1), we cannot find any
            // (k-1)-combs, hence the upper limit for the iteration:
            combs = [];
            for (i = 0; i < array.length - k + 1; i++) {
                // head is a list that includes only our current element.
                head = array.slice(i, i + 1);
                // We take smaller combinations from the subsequent elements
                tailcombs = Maths.Combinations(array.slice(i + 1), k - 1);
                // For each (k-1)-combination we join it with the current
                // and store it to the set of k-combinations.
                for (j = 0; j < tailcombs.length; j++) {
                    combs.push(head.concat(tailcombs[j]));
                }
            }
            return combs;
        }

    }

    export module Database {

        export class LocalDB {

            private db: LocalForage;
            private dbName: string;
            //private wcfUrl;
            //private wcfLogin: string;
            //private wcfPassword: string;

            public static GetInstance(dbName: string, synchronize: boolean = false, wcfUrl: string, wcfLogin: string, wcfPassword: string): LocalDB {
                let localDB = new LocalDB();
                let res = localforage.createInstance({
                    name: dbName
                });
                localDB.db = res;
                localDB.dbName = dbName;
                //localDB.wcfLogin = wcfLogin;
                //localDB.wcfPassword = wcfPassword;
                ////localDB.synchronize = synchronize;
                //localDB.wcfUrl = wcfUrl;
                return localDB;
            }

            private localDBEntryExists(obj: any) {
                let self = this;
                return new Promise((resolve, reject) => {
                    self.db.getItem(obj.ID).then((x) => {
                        if (x) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }).catch((error) => {
                        reject(error);
                    });
                });
            }

            private setLocalDBEntry(obj: any) {
                let self = this;
                return new Promise((resolve, reject) => {
                    self.db.setItem(obj.ID, JSON.stringify(obj)).then(() => {
                        resolve(obj);
                    }).catch((error) => {
                        reject(error);
                    });
                });
            }

            public RemoveAllItems() {
                let self = this;
                return new Promise((resolve, reject) => {
                    self.db.iterate(function (value, key, iterationNumber) {
                        self.db.removeItem(key);
                    }).then(() => {
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                });
            }

            public GetAllItems(onStart: () => void, onError: (x: any) => void, onComplete: (items: Framework.Database.DBItem[]) => void) {

                let self = this;

                let items: Framework.Database.DBItem[] = [];
                self.db.iterate(function (value, key, iterationNumber) {
                    items.push(JSON.parse(value));
                }).then(() => {
                    onComplete(items);
                }).catch((x) => {
                    onError(x);
                });

            }

            public SaveItem(item: DBItem, onStart: () => void, onError: (x: any) => void, onComplete: (item: Framework.Database.DBItem) => void, cancelSynchronization = false) {

                let self = this;

                self.localDBEntryExists(item).then((exists: boolean) => {
                    if (exists == true) {
                        item.LastUpdate = Date.now().toString();
                    } else {
                        if (item.ID == undefined) {
                            item.ID = Date.now().toString();
                        }
                        item.LastUpdate = item.ID;
                        self.setLocalDBEntry(item).then((item: DBItem) => {
                            onComplete(item);
                        });
                    }
                })

            }

            //private localDBEntryExists(obj: any) {
            //    let self = this;
            //    return new Promise((resolve, reject) => {
            //        self.db.getItem(obj.ID).then((x) => {
            //            if (x) {
            //                resolve(true);
            //            } else {
            //                resolve(false);
            //            }
            //        }).catch((error) => {
            //            reject(error);
            //        });
            //    });
            //}

            //private addLocalDBEntry(obj: any) {
            //    let self = this;
            //    return new Promise((resolve, reject) => {
            //        self.db.setItem(obj.ID, JSON.stringify(obj)).then(() => {
            //            resolve(obj);
            //        }).catch((error) => {
            //            reject(error);
            //        });
            //    });
            //}

            //private updateLocalDBEntry(obj: any) {
            //    let self = this;
            //    return new Promise((resolve, reject) => {
            //        self.db.setItem(obj.ID, JSON.stringify(obj)).then(() => {
            //            resolve(obj);
            //        }).catch((error) => {
            //            reject(error);
            //        });
            //    });
            //}

            //public RemoveAllItems() {
            //    let self = this;
            //    return new Promise((resolve, reject) => {
            //        self.db.iterate(function (value, key, iterationNumber) {
            //            self.db.removeItem(key);
            //        }).then(() => {
            //            resolve();
            //        }).catch((error) => {
            //            reject(error);
            //        });
            //    });
            //}

            //public GetAllItems(onStart: () => void, onError: (x: any) => void, onComplete: (items: Framework.Database.DBItem[]) => void) {

            //    let self = this;

            //    let items: Framework.Database.DBItem[] = [];
            //    self.db.iterate(function (value, key, iterationNumber) {
            //        items.push(JSON.parse(value));
            //    }).then(() => {

            //        if (self.synchronize == true) {

            //            Framework.WCF.Call(self.wcfUrl, 'SynchronizeItemsWithServer', '{"login":"' + self.wcfLogin + '","password":"' + self.wcfPassword + '", "json":"' + encodeURI(JSON.stringify(items)) + '","dbName":"' + self.dbName + '"}', onStart, (res: Framework.WCF.WCFResult) => {
            //                let list: Framework.Database.DBItem[] = JSON.parse(res.Result);

            //                let toReplace = list.filter((x) => { return x.Status == "ServerFileMostRecent" || x.Status == "MissingOnClient" });

            //                let toReplaceLength = toReplace.length;

            //                if (toReplaceLength == 0) {
            //                    onComplete(list);
            //                }

            //                for (let i = 0; i < toReplaceLength; i++) {
            //                    let synchronizable = Framework.Factory.CreateFrom(Framework.Database.DBItem, toReplace[i]);
            //                    let onSuccess = () => { };
            //                    if (i == toReplaceLength - 1) {
            //                        onSuccess = () => {
            //                            onComplete(list);
            //                        }
            //                    }

            //                    self.DownloadItem(synchronizable.ID, () => { }, () => { }, () => { onSuccess() });
            //                }

            //            });
            //        }
            //        else {
            //            onComplete(items);
            //        }
            //    }).catch((x) => {
            //        onError(x);
            //    });

            //}

            //public SaveItem(item: DBItem, onStart: () => void, onError: (x: any) => void, onComplete: (item: Framework.Database.DBItem) => void, cancelSynchronization = false) {

            //    let self = this;

            //    let wcf = (item: DBItem) => {
            //        if (self.synchronize == true && cancelSynchronization == false) {
            //            self.UploadItem(item, () => { }, () => { }, (item) => { onComplete(item); });
            //        } else {
            //            onComplete(item);
            //        }
            //    }

            //    self.Exists(item).then((exists: boolean) => {
            //        if (exists == true) {
            //            item.LastUpdate = Date.now().toString();
            //            item.Status = "LocalFileMostRecent";
            //            self.updateEntry(item).then((item: DBItem) => {
            //                wcf(item);
            //            });

            //        } else {
            //            item.Owner = self.wcfLogin;
            //            if (item.ID == undefined) {
            //                item.ID = Date.now().toString();
            //            }
            //            item.LastUpdate = item.ID;
            //            item.Status = "MissingOnServer";
            //            self.addEntry(item).then((item: DBItem) => {
            //                wcf(item);
            //            });
            //        }
            //    })

            //}

            //public UploadItem(item: DBItem, onStart: () => void, onError: (x: any) => void, onComplete: (item: Framework.Database.DBItem) => void) {

            //    let self = this;

            //    Framework.WCF.Call(self.wcfUrl, 'CheckItemStatus', '{"login":"' + self.wcfLogin + '","password":"' + self.wcfPassword + '", "json":"' + encodeURI(JSON.stringify(item)) + '","dbName":"' + self.dbName + '"}', onStart, (res: Framework.WCF.WCFResult) => {
            //        let status: string = res.Result;
            //        if (status == "LocalFileMostRecent" || status == "MissingOnServer") {
            //            Framework.WCF.Call(self.wcfUrl, 'UploadItemOnServer', '{"login":"' + self.wcfLogin + '","password":"' + self.wcfPassword + '", "json":"' + encodeURI(JSON.stringify(item)) + '","dbName":"' + self.dbName + '"}', onStart, (res: Framework.WCF.WCFResult) => {
            //                item.Status = "ServerFileMostRecent";
            //                onComplete(item);
            //            });
            //        } else {
            //            //TODO : erreur, fichier distant plus récent, retourner item distant
            //            onComplete(item);
            //        }
            //    });

            //}

            //public DownloadItems(onStart: () => void, onError: (x: any) => void, onComplete: (items: Framework.Database.DBItem[]) => void) {

            //    let self = this;

            //    Framework.WCF.Call(self.wcfUrl, 'DownloadItemsFromServer', '{"login":"' + self.wcfLogin + '","password":"' + self.wcfPassword + '", "dbName":"' + self.dbName + '"}', onStart, (res: Framework.WCF.WCFResult) => {
            //        let items: DBItem[] = JSON.parse(res.Result);
            //        //items.forEach((item) => {
            //        //    self.updateLocalDBEntry(item);
            //        //});
            //        onComplete(items);
            //    });

            //    //let items: Framework.Database.DBItem[] = [];
            //    //self.db.iterate(function (value, key, iterationNumber) {
            //    //    items.push(JSON.parse(value));
            //    //}).then(() => {

            //    //    if (self.synchronize == true) {

            //    //        Framework.WCF.Call(self.wcfUrl, 'SynchronizeItemsWithServer', '{"login":"' + self.wcfLogin + '","password":"' + self.wcfPassword + '", "json":"' + encodeURI(JSON.stringify(items)) + '","dbName":"' + self.dbName + '"}', onStart, (res: Framework.WCF.WCFResult) => {
            //    //            let list: Framework.Database.DBItem[] = JSON.parse(res.Result);

            //    //            let toReplace = list.filter((x) => { return x.Status == "ServerFileMostRecent" || x.Status == "MissingOnClient" });

            //    //            let toReplaceLength = toReplace.length;

            //    //            if (toReplaceLength == 0) {
            //    //                onComplete(list);
            //    //            }

            //    //            for (let i = 0; i < toReplaceLength; i++) {
            //    //                let synchronizable = Framework.Factory.CreateFrom(Framework.Database.DBItem, toReplace[i]);
            //    //                let onSuccess = () => { };
            //    //                if (i == toReplaceLength - 1) {
            //    //                    onSuccess = () => {
            //    //                        onComplete(list);
            //    //                    }
            //    //                }

            //    //                self.DownloadItem(synchronizable.ID, () => { }, () => { }, () => { onSuccess() });
            //    //            }

            //    //        });
            //    //    }
            //    //    else {
            //    //        onComplete(items);
            //    //    }
            //    //}).catch((x) => {
            //    //    onError(x);
            //    //});

            //}


            //public RemoveItem(item: DBItem, onStart: () => void, onError: (x: any) => void, onComplete: (item: Framework.Database.DBItem) => void) {

            //    let self = this;

            //    let wcf = (item: DBItem) => {
            //        if (self.synchronize == true) {
            //            Framework.WCF.Call(self.wcfUrl, 'DeleteItemOnServer', '{"login":"' + self.wcfLogin + '","password":"' + self.wcfPassword + '", "json":"' + encodeURI(JSON.stringify(item)) + '","dbName":"' + self.dbName + '"}', onStart, (res: Framework.WCF.WCFResult) => {
            //                onComplete(item);
            //            });
            //        } else {
            //            onComplete(item);
            //        }
            //    }

            //    self.db.removeItem(item.ID).then(() => {
            //        wcf(item);
            //    });

            //}

            //public GetItemOnServer(id: string) {
            //    //let self = this;
            //    //return new Promise((resolve, reject) => {
            //    //    self.db.getItem(id).then((item: string) => {
            //    //        resolve(JSON.parse(item));
            //    //    }).catch((error) => {
            //    //        reject(error);
            //    //    });
            //    //});

            //    let self = this;

            //    return new Promise((resolve, reject) => {
            //        Framework.WCF.Call(self.wcfUrl, 'DownloadItemFromServer', '{"login":"' + self.wcfLogin + '","password":"' + self.wcfPassword + '", "id":"' + id + '","dbName":"' + self.dbName + '"}', () => { }, (res: Framework.WCF.WCFResult) => {
            //            let item: DBItem = JSON.parse(res.Result);
            //            resolve(item);
            //        });
            //    });
            //}

        }

        export class ServerDB {

            private dbName: string;
            private wcfUrl;
            private wcfLogin: string;
            private wcfPassword: string;

            public static GetInstance(dbName: string, synchronize: boolean = false, wcfUrl: string, wcfLogin: string, wcfPassword: string): ServerDB {
                let localDB = new ServerDB();
                //let res = localforage.createInstance({
                //    name: dbName
                //});
                //localDB.db = res;
                localDB.dbName = dbName;
                localDB.wcfLogin = wcfLogin;
                localDB.wcfPassword = wcfPassword;
                //localDB.synchronize = synchronize;
                localDB.wcfUrl = wcfUrl;
                return localDB;
            }

            public SaveItem(item: DBItem, onStart: () => void, onError: (x: any) => void, onComplete: (item: Framework.Database.DBItem) => void) {
                let self = this;
                Framework.WCF.Call(self.wcfUrl, 'UploadItemOnServer', '{"login":"' + self.wcfLogin + '","password":"' + self.wcfPassword + '", "json":"' + encodeURI(JSON.stringify(item)) + '","dbName":"' + self.dbName + '"}', onStart, (res: Framework.WCF.WCFResult) => {
                    item.ID = res.Result;
                    onComplete(item);
                });
            }

            public DownloadItem(id: string, onStart: () => void, onError: (x: any) => void, onComplete: (item: Framework.Database.DBItem) => void) {
                let self = this;
                Framework.WCF.Call(self.wcfUrl, 'DownloadItemFromServer', '{"login":"' + self.wcfLogin + '","password":"' + self.wcfPassword + '", "id":"' + id + '","dbName":"' + self.dbName + '"}', onStart, (res: Framework.WCF.WCFResult) => {
                    let item: DBItem = JSON.parse(res.Result);
                    onComplete(item);
                });

            }

            public DownloadItems(onStart: () => void, onError: (x: any) => void, onComplete: (items: Framework.Database.DBItem[]) => void) {
                let self = this;
                Framework.WCF.Call(self.wcfUrl, 'DownloadItemsFromServer', '{"login":"' + self.wcfLogin + '","password":"' + self.wcfPassword + '", "dbName":"' + self.dbName + '"}', onStart, (res: Framework.WCF.WCFResult) => {
                    let items: DBItem[] = JSON.parse(res.Result);
                    onComplete(items);
                });
            }

            public RemoveItem(item: DBItem, onStart: () => void, onError: (x: any) => void, onComplete: (item: Framework.Database.DBItem) => void) {
                let self = this;
                Framework.WCF.Call(self.wcfUrl, 'DeleteItemOnServer', '{"login":"' + self.wcfLogin + '","password":"' + self.wcfPassword + '", "json":"' + encodeURI(JSON.stringify(item)) + '","dbName":"' + self.dbName + '"}', onStart, (res: Framework.WCF.WCFResult) => {
                    onComplete(item);
                });
            }

            public GetItemOnServer(id: string) {
                let self = this;
                return new Promise((resolve, reject) => {
                    Framework.WCF.Call(self.wcfUrl, 'DownloadItemFromServer', '{"login":"' + self.wcfLogin + '","password":"' + self.wcfPassword + '", "id":"' + id + '","dbName":"' + self.dbName + '"}', () => { }, (res: Framework.WCF.WCFResult) => {
                        let item: DBItem = JSON.parse(res.Result);
                        resolve(item);
                    });
                });
            }
        }

        export class DBItem {
            public ID: string; // Date de création
            public LastUpdate: string; // Date de dernière mise à jour
            //public Status: string;
            public Owner: string;
        }
    }

    export class Coordinate {
        public Top: number;
        public Left: number;
    }

    //TODO : utiliser service worker generic (1 seul fichier js pour faire plusiers actions)
    export module Enums {

        export var CountryEnum: string[] = ["NR", "AFGHANISTAN",
            "ALBANIA",
            "ALGERIA",
            "AMERICAN SAMOA",
            "ANDORRA",
            "ANGOLA",
            "ANGUILLA",
            "ANTARCTICA",
            "ANTIGUA AND BARBUDA",
            "ARGENTINA",
            "ARMENIA",
            "ARUBA",
            "AUSTRALIA",
            "AUSTRIA",
            "AZERBAIJAN",
            "BAHAMAS",
            "BAHRAIN",
            "BANGLADESH",
            "BARBADOS",
            "BELARUS",
            "BELGIUM",
            "BELIZE",
            "BENIN",
            "BERMUDA",
            "BHUTAN",
            "BOLIVIA",
            "BOSNIA AND HERZEGOVINA",
            "BOTSWANA",
            "BOUVET ISLAND",
            "BRAZIL",
            "BRITISH INDIAN OCEAN TERRITORY",
            "BRUNEI DARUSSALAM",
            "BULGARIA",
            "BURKINA FASO",
            "BURUNDI",
            "CAMBODIA",
            "CAMEROON",
            "CANADA",
            "CAPE VERDE",
            "CAYMAN ISLANDS",
            "CENTRAL AFRICAN REPUBLIC",
            "CHAD",
            "CHILE",
            "CHINA",
            "CHRISTMAS ISLAND",
            "COCOS (KEELING) ISLANDS",
            "COLOMBIA",
            "COMOROS",
            "CONGO",
            "CONGO, THE DEMOCRATIC REPUBLIC OF THE",
            "COOK ISLANDS",
            "COSTA RICA",
            "COTE D'IVOIRE",
            "CROATIA",
            "CUBA",
            "CYPRUS",
            "CZECH REPUBLIC",
            "DENMARK",
            "DJIBOUTI",
            "DOMINICA",
            "DOMINICAN REPUBLIC",
            "EAST TIMOR",
            "ECUADOR",
            "EGYPT",
            "EL SALVADOR",
            "EQUATORIAL GUINEA",
            "ERITREA",
            "ESTONIA",
            "ETHIOPIA",
            "FALKLAND ISLANDS (MALVINAS)",
            "FAROE ISLANDS",
            "FIJI",
            "FINLAND",
            "FRANCE",
            "FRENCH GUIANA",
            "FRENCH POLYNESIA",
            "FRENCH SOUTHERN TERRITORIES",
            "GABON",
            "GAMBIA",
            "GEORGIA",
            "GERMANY",
            "GHANA",
            "GIBRALTAR",
            "GREECE",
            "GREENLAND",
            "GRENADA",
            "GUADELOUPE",
            "GUAM",
            "GUATEMALA",
            "GUINEA",
            "GUINEA-BISSAU",
            "GUYANA",
            "HAITI",
            "HEARD ISLAND AND MCDONALD ISLANDS",
            "HONDURAS",
            "HONG KONG",
            "HUNGARY",
            "ICELAND",
            "INDIA",
            "INDONESIA",
            "IRAN, ISLAMIC REPUBLIC OF",
            "IRAQ",
            "IRELAND",
            "ISRAEL",
            "ITALY",
            "JAMAICA",
            "JAPAN",
            "JORDAN",
            "KAZAKHSTAN",
            "KENYA",
            "KIRIBATI",
            "KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF",
            "KOREA, REPUBLIC OF",
            "KUWAIT",
            "KYRGYZSTAN",
            "LAO PEOPLE'S DEMOCRATIC REPUBLIC",
            "LATVIA",
            "LEBANON",
            "LESOTHO",
            "LIBERIA",
            "LIBYAN ARAB JAMABIRIYA",
            "LIECHTENSTEIN",
            "LITHUANIA",
            "LUXEMBOURG",
            "MACAU",
            "MACEDONIA, THE FORMER YUGOSLAV REPU8LIC OF",
            "MADAGASCAR",
            "MALAWI",
            "MALAYSIA",
            "MALDIVES",
            "MALI",
            "MALTA",
            "MARSHALL ISLANDS",
            "MARTINIQUE",
            "MAURITANIA",
            "MAURITIUS",
            "MAYOTTE",
            "MEXICO",
            "MICRONESIA, FEDERATED STATES OF",
            "MOLDOVA, REPUBLIC OF",
            "MONACO",
            "MONGOLIA",
            "MONTSERRAT",
            "MOROCCO",
            "MOZAMBIQUE",
            "MYANMAR",
            "NAMIBIA",
            "NEPAL",
            "NETHERLANDS",
            "NETHERLANDS ANTILLES",
            "NEW CALEDONIA",
            "NEW ZEALAND",
            "NICARAGUA",
            "NIGER",
            "NIGERIA",
            "NIUE",
            "NORFOLK ISLAND",
            "NORTHERN MARIANA ISLANDS",
            "NORWAY",
            "OMAN",
            "PAKISTAN",
            "PALAU",
            "PANAMA",
            "PAPUA NEW GUINEA",
            "PARAGUAY",
            "PERU",
            "PHILIPPINES",
            "PITCAIRN",
            "POLAND",
            "PORTUGAL",
            "PUERTO RICO",
            "QATAR",
            "REUNION",
            "ROMANIA",
            "RUSSIAN FEDERATION",
            "RWANDA",
            "SAINT HELENA",
            "SAINT KITTS AND NEVIS",
            "SAINT LUCIA",
            "SAINT PIERRE AND MIQUELON",
            "SAMOA",
            "SAN MARINO",
            "SAO TOME AND PRINCIPE",
            "SAUDI ARABIA",
            "SENEGAL",
            "SEYCHELLES",
            "SIERRA LEONE",
            "SINGAPORE",
            "SLOVAKIA",
            "SLOVENIA",
            "SOLOMON ISLANDS",
            "SOMALIA",
            "SOUTH AFRICA",
            "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS",
            "SPAIN",
            "SRI LANKA",
            "SUDAN",
            "SURINAME",
            "SVALBARD AND JAN MAYEN",
            "SWAZILAND",
            "SWEDEN",
            "SWITZERLAND",
            "SYRIAN ARAB REPUBLIC",
            "TAIWAN, PROVINCE OF CHINA",
            "TAJIKISTAN",
            "TANZANIA, UNITED REPUBLIC OF",
            "THAILAND",
            "TOGO",
            "TOKELAU",
            "TONGA",
            "TRINIDAD AND TOBAGO",
            "TUNISIA",
            "TURKEY",
            "TURKMENISTAN",
            "TURKS AND CAICOS ISLANDS",
            "TUVALU",
            "UGANDA",
            "UKRAINE",
            "UNITED ARAB EMIRATES",
            "UNITED KINGDOM",
            "UNITED STATES",
            "UNITED STATES MINOR OUTLYING ISLANDS",
            "URUGUAY",
            "UZBEKISTAN",
            "VANUATU",
            "VENEZUELA",
            "VIET NAM",
            "VIRGIN ISLANDS, BRITISH",
            "VIRGIN ISLANDS, US",
            "WALLIS AND FUTUNA",
            "WESTERN SARARA",
            "YEMEN",
            "YUGOSLAVIA",
            "ZAMBIA",
            "ZIMBABWE"];

    }

    export class Popup {

        //TODO : uniformiser appels popup

        public static Destroy(element: HTMLElement) {
            try {
                if ($(element).hasClass("tooltipstered")) {
                    $(element).tooltipster('destroy');
                }
            } catch { }
        }

        public static Create(element: HTMLElement, content: HTMLElement, position: string = 'right', trigger = "click") {
            try {
                if ($(element).hasClass("tooltipstered") == false) {
                    $(element).tooltipster({
                        trigger: trigger,
                        interactive: true,
                        animation: 'grow',
                        autoClose: false,
                        multiple: true,
                        position: position,
                        content: $(content),
                    });
                }
            } catch { }
        }

        public static Show(element: HTMLElement, content: HTMLElement, position: string = 'right') {
            //if ($(element).hasClass("tooltipstered") == false) {                
            //    Popup.Create(element, content, position);
            //    $(element).tooltipster('show');
            //} else {
            try {
                Popup.Destroy(element);
                setTimeout(() => {
                    Popup.Create(element, content, position);
                    $(element).tooltipster('show');
                }, 500);
            } catch { }
            //}
        }

        public static Hide(element: HTMLElement) {
            try {
                $(element).tooltipster('hide');
            } catch { }
        }


    }

    export class DragDropManager {

        //private static getScale(element: HTMLElement): number {
        //    var scaleM = $(element).css('transform').replace('matrix(', '');
        //    var scale = Number(scaleM.split(',')[0]);
        //    if (!scale) {
        //        scale = undefined;
        //    }
        //    return scale;
        //}

        // element : élément sur lequel le drag/drop sera appliqué
        // zone : zone dans laquelle le drag/drop est autorisé
        // handle : poignée permettant le drag/drop (optionnelle)
        public static Draggable(element: HTMLElement, zone: HTMLElement, onStart: () => void, onMove: (draggable: HTMLElement, dx: number, dy: number) => void, onEnd: (draggable: HTMLElement, left: number, top: number) => void, handle: HTMLElement = undefined, dropZones: HTMLElement[] = undefined, scale: number) {

            let draggableElement = element;
            if (handle) {
                draggableElement = handle;
            }

            //let scale = 1;

            interact(draggableElement)
                .draggable({
                    inertia: true,
                    restrict: {
                        restriction: zone,
                    },
                    autoScroll: true,
                    onstart: function (event) {
                        try {
                            //scale = DragDropManager.getScale(zone);
                            //if (scale == undefined) {
                            //    scale = DragDropManager.getScale(zone.parentElement);
                            //    if (scale == undefined) {
                            //        scale = 1;
                            //    }
                            //}
                            onStart();
                        } catch (err) {
                            //alert(JSON.stringify(err));
                        }
                    },
                    onmove: function (event) {
                        try {
                            let elementRect = element.getClientRects();
                            let parentRect = zone.getClientRects();

                            //let dx = Number(event.dx.toFixed(2)) / scale;
                            //let dy = Number(event.dy.toFixed(2)) / scale;

                            let dx = Number(event.dx.toFixed(2));
                            let dy = Number(event.dy.toFixed(2));

                            let isOK1 = elementRect[0].bottom + dy <= parentRect[0].bottom;
                            let isOK2 = elementRect[0].top + dy >= parentRect[0].top;
                            let isOK3 = elementRect[0].left + dx >= parentRect[0].left;
                            let isOK4 = elementRect[0].right + dx <= parentRect[0].right;

                            if (isOK1 && isOK2 && isOK2 && isOK4) {
                                onMove(element, dx, dy);
                            } else {
                                let l = "";
                            }
                        } catch (err) {
                            //alert(JSON.stringify(err));
                        }

                    },
                    onend: function (event) {
                        try {
                            let elementRect = element.getClientRects();
                            let parentRect = zone.getClientRects();
                            //let x = (elementRect[0].left - parentRect[0].left) / scale;
                            //let y = (elementRect[0].top - parentRect[0].top) / scale;
                            let x = (elementRect[0].left - parentRect[0].left);
                            let y = (elementRect[0].top - parentRect[0].top);

                            onEnd(element, x, y);
                        } catch (err) {
                            //alert(JSON.stringify(err));
                        }
                    }
                });

        }

        public static Dropable(element: HTMLElement, zone: HTMLElement, onStart: () => void, onMove: (draggable: HTMLElement, dx: number, dy: number) => void, onDrop: (draggable: HTMLElement, dropZone: HTMLElement) => void, dropZones: HTMLElement[], scale: number) {

            let baseX: string = "";
            let baseY: string = "";

            DragDropManager.Draggable(element, zone,
                () => {
                    let elementRect = element.getClientRects();
                    baseX = element.style.left;
                    baseY = element.style.top;
                    onStart();
                },
                (draggable: HTMLElement, dx: number, dy: number) => {
                    onMove(draggable, dx, dy);
                },
                (draggable, left, top) => {
                    let isDropped = false;

                    let elementRect = element.getClientRects();

                    dropZones.forEach((zone) => {
                        let rect = zone.getClientRects();

                        //10 : tolérance d'écart à la boite, en pixels
                        let isOK = elementRect[0].bottom <= (rect[0].bottom + 10)
                            && elementRect[0].top >= (rect[0].top - 10)
                            && elementRect[0].left >= (rect[0].left - 10)
                            && elementRect[0].right <= (rect[0].right + 10);

                        if (isOK == true) {
                            isDropped = true;
                            onDrop(element, zone);
                        }
                    });

                    if (isDropped == false) {
                        // Position initiale
                        element.style.left = baseX;
                        element.style.top = baseY;
                    }

                }, undefined, undefined, scale);
        }

        //public static Sortable(element: HTMLElement, droppableDivId: string, onReceive: (droppedItem: HTMLElement, dropDiv: HTMLElement, ui) => void) {


        //    element.classList.add("connected");

        //    $(element).sortable({
        //        connectWith: ".connected",
        //        tolerance: "pointer",

        //        receive: function (event, ui) {
        //            onReceive(ui.item[0], this, ui);
        //        },
        //        sort: function (e, ui) {

        //            let droppableDiv = document.getElementById(droppableDivId);
        //            let scale = DragDropManager.getScale(droppableDiv);

        //            var changeLeft = ui.position.left - ui.originalPosition.left;
        //            var newLeft = (ui.originalPosition.left + changeLeft) / scale;

        //            var changeTop = ui.position.top - ui.originalPosition.top;
        //            var newTop = (ui.originalPosition.top + changeTop) / scale;


        //            ui.helper.css(
        //                {
        //                    left: newLeft,
        //                    top: newTop
        //                });
        //        }
        //    });


        //}
    }

    export class WordComparer {

        public static Contains(word: string, phrase: string): boolean {
            let res: boolean = false;
            if (word && word.length > 0 && phrase.toLowerCase().indexOf(word.toLowerCase()) > -1) {
                res = true;
            }
            return res;
        }

        public static ContainsWithSoundex(word, phrase, language: string = 'en'): boolean {
            let words: string[] = phrase.split(' ');
            words.forEach((x) => {
                if (WordComparer.Contains(WordComparer.Soundex(word, language), WordComparer.Soundex(x, language)) == true) {
                    return true;
                }
            });
            return false;
        }

        public static Soundex(word: string, language: string = 'en'): string {
            let a = word.toLowerCase().split('');
            let f = a.shift();
            let r = '';
            let codes = {
                a: '', e: '', i: '', o: '', u: '',
                b: 1, f: 1, p: 1, v: 1,
                c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
                d: 3, t: 3,
                l: 4,
                m: 5, n: 5,
                r: 6
            };

            if (language == 'fr') {
                codes = {
                    a: '', e: '', i: '', o: '', u: '',
                    b: 1, p: 1,
                    c: 2, k: 2, q: 2,
                    d: 3, t: 3,
                    l: 4,
                    m: 5, n: 5,
                    r: 6,
                    g: 7, j: 7,
                    x: 8, z: 8, s: 8,
                    f: 9, v: 9
                };
            }

            r = f +
                a
                    .map(function (v, i, a) { return codes[v] })
                    .filter(function (v, i, a) {
                        return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
                    })
                    .join('');

            return (r + '000').slice(0, 4).toUpperCase();
        }
    }

    export module ShortcutManager {

        export class Shortcut {
            public Condition: () => boolean;
            public KeyCode: number;
            public Action: () => void;
            public ControlPressed: boolean = false;
            public Propagation: boolean = true;
        }

        export var ListShortcuts: Shortcut[];

        export function Initialize() {
            ShortcutManager.ListShortcuts = [];
            document.addEventListener("keydown", (evt) => {
                ShortcutManager.ListShortcuts.forEach((x) => {
                    if (x.Condition() == true && evt.keyCode == x.KeyCode && evt.ctrlKey == x.ControlPressed) {
                        //TOFIX : CTRL pas pris en compte
                        x.Action();
                    }
                    return x.Propagation;
                });
            });
        }

        export function Add(condition: () => boolean, keyCode: number, action: () => void, controlPressed: boolean = false, propagation: boolean = true) {
            let shortcut = new Shortcut();
            shortcut.Condition = condition;
            shortcut.KeyCode = keyCode;
            shortcut.Action = action;
            shortcut.ControlPressed = controlPressed;
            shortcut.Propagation = propagation;
            ShortcutManager.ListShortcuts.push(shortcut);
        }

        //13: ENTER
        //27: ESCAPE
        //113: F2
        //Liste: cf : https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    }

    export class GlobalErrorCatcher {

        public static ErrorContext: string = "";

        public static Initialize(onError: (error: string) => void) {

            if (window.onerror) {
                window.onerror = function (messageOrEvent, source, noligne, nocolonne, erreur) {
                    let txt = "<p>Message : " + messageOrEvent + "</p>";
                    txt += "<p>Source : " + source + "</p>";
                    txt += "<p>Ligne : " + noligne + ", colonne : " + nocolonne + "</p>";
                    txt += "<p>Erreur : " + JSON.stringify(erreur) + "</p>";
                    GlobalErrorCatcher.ErrorContext += txt;
                    onError(txt);
                }
            }

            if (window.addEventListener) {
                window.addEventListener("error", function (e) {
                    let txt = "<p>" + e.error.message + " " + e.error.stack + "</p>";
                    GlobalErrorCatcher.ErrorContext += txt;
                    onError(txt);
                });
            }


        }

        public static GetHtmlReport(software: string, user: string, detail: string, date: string, browser: string, os: string, context: string, img: string, callback: (htmlData: string) => void) {

            let div = document.createElement("div");

            let p1 = document.createElement("p");
            p1.innerHTML = "Date : " + date;
            div.appendChild(p1);

            let p2 = document.createElement("p");
            p2.innerHTML = "Module : " + software;
            div.appendChild(p2);

            let p5 = document.createElement("p");
            p5.innerHTML = "Utilisateur : " + user;
            div.appendChild(p5);

            let p3 = document.createElement("p");
            p3.innerHTML = "Navigateur : " + browser;
            div.appendChild(p3);

            let p4 = document.createElement("p");
            p4.innerHTML = "OS : " + os;
            div.appendChild(p4);

            let p6 = document.createElement("p");
            p6.innerHTML = "Détail : " + detail;
            div.appendChild(p6);

            let p7 = document.createElement("p");
            p7.innerHTML = "Contexte : " + context;
            div.appendChild(p7);

            var image = new Image();
            image.src = img;
            image.style.border = "1px solid black";
            image.style.margin = "10px";
            image.style.height = '600px';
            image.style.width = 'auto';
            div.appendChild(image);
            callback(div.outerHTML);



        }

        public static GetBugReport(callback: (date: string, browser: string, os: string, context: string, img: string) => void) {
            Framework.Screenshot.Capture(document.getElementById("body"), (b64img: string) => {
                let date = new Date(Date.now()).toLocaleDateString() + " " + new Date(Date.now()).toLocaleTimeString();
                let info: Framework.Browser.BrowserInfo = Framework.Browser.GetInfo();
                let browser = info.Name + " " + info.Version;
                let os = info.OS + "(Mobile : " + info.Mobile + ", Tablette : " + info.Tablet + ", Touch : " + info.Touch + ")";
                let context = Framework.GlobalErrorCatcher.ErrorContext;
                callback(date, browser, os, context, b64img);
            }, window.innerHeight, window.innerWidth);
        }


    }

    export class Progress {

        private static div: HTMLDivElement;

        public static Show(message: string) {

            let outerDiv = document.createElement("div");
            outerDiv.classList.add("progressBarOuter");
            let innerDiv = document.createElement("div");
            innerDiv.classList.add("progressBarInner");
            outerDiv.appendChild(innerDiv);
            let p1 = document.createElement("p");
            p1.innerHTML = message;
            innerDiv.appendChild(p1);
            let p2 = document.createElement("p");
            //TOFIX : centrage
            p2.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size:3em; transform-origin: 50% calc(50% - .5px);"></i>';
            innerDiv.appendChild(p2);

            Progress.div = outerDiv;

            document.body.appendChild(Progress.div);

        }

        public static Hide() {
            try {
                document.body.removeChild(Progress.div);
            } catch {
            }
        }

    }

    export class Version {


        // Lit le numéro de version d'un fichier changelog
        // Le fichier doit commencer par <!--version: xxx -->
        public static Read(url: string, callback: (version: string, content: string) => void) {
            let self = this;

            $.ajax({
                url: url,
                async: false,
                success: function (result: string) {
                    let version: string = "";
                    try {
                        let start = result.indexOf('<!--version:') + 12;
                        let stop = result.indexOf('-->');
                        version = result.substring(start, stop);
                    } catch {
                        version = "?";
                    }
                    callback(version, result);
                }
            });
        }

    }

    export module Test {

        export function LoadPage(pageToBeLoaded: string, callback: Function) {
            $.get(pageToBeLoaded, function (data) {
                let content = $.parseHTML(data);
                $('#qunit-content').empty().append(content);
                $("body").css("overflow-y", "scroll");
                $("body").css("width", "100%");
                callback();
            });
        }

    }

    export class Observer {

        public static OnAppend() {

            var onAppend = function (elem, f) {
                var observer = new MutationObserver(function (mutations) {
                    mutations.forEach(function (m) {
                        if (m.addedNodes.length) {
                            f(m.addedNodes)
                        }
                    })
                })
                observer.observe(elem, { childList: true })
            }

            onAppend(document.body, function (added) {
                console.log(added) // [p]
            })

        }


    }

    //export class PrintHelper {

    //    public static Print(elem:HTMLElement) {
    //        var domClone = elem.cloneNode(true);

    //        var printSection = document.getElementById("printSection");

    //        if (!printSection) {
    //            printSection = document.createElement("div");
    //            printSection.id = "printSection";
    //            document.body.appendChild(printSection);
    //        }

    //        printSection.innerHTML = "";
    //        printSection.appendChild(domClone);
    //        window.print();
    //    }

    //}

    export class ViewModel {

        public Container: HTMLElement;

        public get IsContainerVisible(): boolean {
            return document.getElementById(this.Container.id) != null;
        }

        public HelpPage: string = "menu";

        public OnConnectivityChanged(isOnline: boolean) {
        }

    }

    export abstract class ModalViewModel extends Framework.ViewModel {

        protected mw: Framework.Modal.Modal;

        constructor(mw: Framework.Modal.Modal) {
            super();
            this.mw = mw;
        }

        public Close() {
            this.mw.Close();
        }
    }

    export class App {

        protected version: string;
        protected changelog: string;
        protected currentViewContainerName: string = "currentView";
        protected compatibilityCheckResult: Framework.ModuleCompatibilityCheck;
        protected queryString: string[] = [];
        protected isInDebug: boolean = false;
        protected isInTest: boolean = false;
        protected isOnline: boolean = true;
        protected rootURL: string;
        protected wcfServiceUrl: string;
        protected requirements: ModuleRequirements;

        protected start(fullScreen: boolean = true) {
            if (fullScreen && this.isInTest == false) {
                Framework.Browser.AskFullScreen();
            }
        }

        protected onConnectivityChanged(isOnline: boolean) {
            this.isOnline = isOnline;
        }

        protected onError(error: string) {
            Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), error);
        }

        public get IsOnline(): boolean {
            return this.isOnline;
        }

        public get Version(): string {
            return this.version;
        }

        public get Changelog(): string {
            return this.changelog;
        }

        constructor(requirements: ModuleRequirements, isInTest: boolean = false) {

            let self = this;

            self.isInTest = isInTest;
            self.requirements = requirements;

            if (window.location.hostname == "localhost") {
                self.isInDebug = true;
                //requirements.RootUrl = 'http://localhost:56206';
                //requirements.RootUrl = window.location.href.replace("/index.html", "");
                requirements.DisableGoBack = false;
                requirements.DisableRefresh = false;
            }

            //self.wcfServiceUrl = requirements.RootUrl + requirements.WcfServiceURL;
            self.wcfServiceUrl = requirements.WcfServiceUrl;

            requirements.OnLoaded = (compatibilityCheck) => {
                self.compatibilityCheckResult = compatibilityCheck;
                self.queryString = Framework.Browser.GetCurrentQueryString();
                self.rootURL = requirements.AppUrl;

                // Gestionnaire d'erreur
                Framework.GlobalErrorCatcher.Initialize(
                    (error: string) => {
                        self.onError(error);
                    }
                );

                // Gestionnaire de raccourcis
                Framework.ShortcutManager.Initialize();

                // Liste des ressources
                //Framework.ServiceWorker.GetLoadedResources();

                if (requirements.VersionPath && requirements.VersionPath.length > 0) {
                    Framework.Version.Read(requirements.AppUrl + "/" + requirements.VersionPath, (version: string, changelog: string) => {
                        self.version = version;
                        self.changelog = changelog;
                    });
                }

                Framework.Network.CheckConnectivity(Framework.RootUrl + '/website/images/favicon.png',
                    (isOnline: boolean) => {
                        self.onConnectivityChanged(isOnline);
                    }
                );

                self.start();
            };

            Framework.LoadFramework(requirements.FrameworkUrl, (compatibility) => {
                Framework.LoadModule(requirements);
            }, requirements.Extensions);

        }

        public CallWCF(service: string, data: object, onStart: () => void, onCompleted: (res: Framework.WCF.WCFResult) => void, sType: string = "POST", contentType: string = "application/json; charset=utf-8", processData: boolean = true, dataType: string = "json") {
            Framework.WCF.Call(this.wcfServiceUrl, service, JSON.stringify(data), onStart, onCompleted, sType, contentType, processData, dataType);
        }

        protected showView(htmlPath: string, viewModelFactory: () => ViewModel, onLoaded: (viewModel: ViewModel, container: HTMLElement) => void = undefined) {
            let self = this;

            document.getElementById(self.currentViewContainerName).innerHTML = "";
            Framework.BaseView.Load(htmlPath, self.currentViewContainerName, (container) => {
                let viewModel: ViewModel = viewModelFactory();
                viewModel.Container = container;
                if (onLoaded) {
                    onLoaded(viewModel, container);
                }
            });
        }

        protected showModal(htmlPath: string, title: string, viewFactory: (mw: Framework.Modal.Modal) => ViewModel, height: string = undefined, width: string = undefined, canClose: boolean = false, grayBackground: boolean = true, backdrop: boolean = false, onLoaded: (viewModel: ViewModel, modal: Framework.Modal.Modal) => void = undefined) {
            let self = this;

            Framework.BaseView.Load(htmlPath, undefined, (div) => {
                let mw = Framework.Modal.Custom(div, title, undefined, height, width, canClose, grayBackground, backdrop);
                let vm = viewFactory(mw);
                if (onLoaded) {
                    onLoaded(vm, mw);
                }
            });

        }

        protected show(htmlPath: string, onLoaded: (div) => void) {
            let self = this;
            document.body.innerHTML = "";
            let path = self.requirements.AppUrl + "/" + htmlPath;
            Framework.BaseView.Load(path, "body", (div) => {
                onLoaded(div);
            });
        }

        protected showAsModal(htmlPath: string, title: string, onLoaded: (mw: Framework.Modal.Modal) => void) {
            let self = this;
            document.body.innerHTML = "";            
            let path = self.requirements.AppUrl + "/" + htmlPath;
            Framework.BaseView.Load(path, undefined, (div) => {
                let mw = Framework.Modal.Custom(div, title);
                onLoaded(mw);
                document.body.classList.remove("modal-open");
            });
        }
    }

    //export class ResizeSensor {

    //    public static ResizeSensor(element, callback) {


    //        let expand = document.createElement('div');
    //        expand.style.position = "absolute";
    //        expand.style.left = "0px";
    //        expand.style.top = "0px";
    //        expand.style.right = "0px";
    //        expand.style.bottom = "0px";
    //        expand.style.overflow = "hidden";

    //        expand.style.visibility = "hidden";

    //        let expandChild = document.createElement('div');
    //        expandChild.style.position = "absolute";
    //        expandChild.style.left = "0px";
    //        expandChild.style.top = "0px";
    //        expandChild.style.width = "10000000px";
    //        expandChild.style.height = "10000000px";
    //        expand.appendChild(expandChild);

    //        let shrink = document.createElement('div');
    //        shrink.style.position = "absolute";
    //        shrink.style.left = "0px";
    //        shrink.style.top = "0px";
    //        shrink.style.right = "0px";
    //        shrink.style.bottom = "0px";
    //        shrink.style.overflow = "hidden";

    //        shrink.style.visibility = "hidden";

    //        let shrinkChild = document.createElement('div');
    //        shrinkChild.style.position = "absolute";
    //        shrinkChild.style.left = "0px";
    //        shrinkChild.style.top = "0px";
    //        shrinkChild.style.width = "200%";
    //        shrinkChild.style.height = "200%";
    //        shrink.appendChild(shrinkChild);

    //        element.appendChild(expand);
    //        element.appendChild(shrink);

    //        function setScroll() {
    //            expand.scrollLeft = 10000000;
    //            expand.scrollTop = 10000000;

    //            shrink.scrollLeft = 10000000;
    //            shrink.scrollTop = 10000000;
    //        };
    //        setScroll();

    //        let size = element.getBoundingClientRect();

    //        let currentWidth = size.width;
    //        let currentHeight = size.height;

    //        let onScroll = function () {
    //            let size = element.getBoundingClientRect();

    //            let newWidth = size.width;
    //            let newHeight = size.height;

    //            if (newWidth != currentWidth || newHeight != currentHeight) {
    //                currentWidth = newWidth;
    //                currentHeight = newHeight;

    //                callback();
    //            }

    //            setScroll();
    //        };

    //        expand.addEventListener('scroll', onScroll);
    //        shrink.addEventListener('scroll', onScroll);
    //    };

    //    public static OnResize(container:HTMLElement, callback:(height:number, width:number)=>void) {

    //        new ResizeSensor.ResizeSensor(container, function () {
    //            callback(container.clientHeight, container.clientWidth);                
    //        });

    //    }

    //}

    //export class ViewPort {

    //    public static ElementIsInViewport(element: HTMLElement) {
    //        var elementTop = $(element).offset().top;
    //        var elementBottom = elementTop + $(this).outerHeight();

    //        var viewportTop = $(window).scrollTop();
    //        var viewportBottom = viewportTop + $(window).height();

    //        return elementBottom > viewportTop && elementTop < viewportBottom;
    //    }

    //}

    export module CanIUse {

        // https://github.com/fyrd/caniuse

        export class CheckBrowserResult {
            public CurrentBrowserCompatible: boolean;
            public ListCompatibleBrowsers: KeyValuePair[];

            public get CompatibleBrowsers(): string {
                let res = "";
                this.ListCompatibleBrowsers.forEach((kvp) => {
                    res += Framework.LocalizationManager.Get(kvp.Key) + " >= " + kvp.Value + " ";
                });
                return res;
            }
        }

        export class CheckBrowser {

            public static Data: object;

            public static ReadData() {
                $.ajax({
                    url: Framework.RootUrl + '/framework/resources/caniuse.json',
                    async: false,
                    success: function (result) {
                        CheckBrowser.Data = result;
                    }
                });
            }


            public static GetBrowserCompatibitityResult(property: string): CheckBrowserResult {
                //if (CheckBrowser.Data == undefined) {
                //    CheckBrowser.readData(() => { CheckBrowser.GetBrowserCompatibitityResult(property) });
                //    return;
                //} else {
                //let prop = CheckBrowser.Data["data"][property];
                //if (prop == undefined) {
                //    return undefined;
                //}

                let compatibleBrowsers: Framework.KeyValuePair[] = [];

                //let browsers = Object.keys(prop["stats"]);

                //for (let j = 0; j < browsers.length; j++) {
                //    let browser = browsers[j];
                //    let versions = Object.keys(prop["stats"][browser]);
                //    for (let i = 0; i < versions.length; i++) {
                //        let version = versions[i];
                //        let supported = prop["stats"][browser][version] == "y";
                //        if (supported) {
                //            compatibleBrowsers.push(new Framework.KeyValuePair(browser, version));
                //            break;
                //        }
                //    }

                //}

                let res: CheckBrowserResult = new CheckBrowserResult();
                res.ListCompatibleBrowsers = compatibleBrowsers;

                let currentBrowser = Framework.Browser.GetInfo();


                res.CurrentBrowserCompatible = compatibleBrowsers.filter((x) => { return x.Key == currentBrowser.CanIUseName && x.Value <= currentBrowser.Version }).length > 0;;

                return res;
                //}


            }
        }
    }

    export module DataReport {

        export class Output {
            protected name: string;
            protected outerDiv: Framework.Form.Accordion;
            protected divWithTitleAndSubtitle: DivWithTitleAndSubtitle; // Contient Plot ou HTML
            protected onDelete: (id: string) => void;
            private optionAccordion: Framework.Form.Accordion;
            private progressDiv: Framework.Form.TextElement;
            private errorDiv: Framework.Form.TextElement;
            public ID: string;

            constructor(header: string, divWithTitleAndSubtitle: DivWithTitleAndSubtitle, onDelete: (id: string) => void, properties: Framework.Form.PropertyEditor[], onChange: () => void = () => { }) {
                this.outerDiv = Framework.Form.Accordion.Create(header, ["reportHeader"]);
                this.divWithTitleAndSubtitle = divWithTitleAndSubtitle;
                this.divWithTitleAndSubtitle.ContentDiv.style.textAlign = "center";
                this.name = header;
                this.onDelete = onDelete;

                let id = Math.random().toString(36).substr(2, 9);
                this.ID = id;

                this.outerDiv.HtmlElement.id = id;
                this.outerDiv.HtmlElement.style.marginBottom = "20px";

                let actionsDiv = this.getActionDiv(properties);

                this.progressDiv = Framework.Form.TextElement.Create("");
                this.progressDiv.SetHtml('<i class="fas fa-spinner fa-spin"></i>');
                this.progressDiv.HtmlElement.style.textAlign = "center";
                this.progressDiv.HtmlElement.style.fontSize = "50px";
                this.outerDiv.Append(this.progressDiv.HtmlElement);
                this.progressDiv.Hide();

                this.errorDiv = Framework.Form.TextElement.Create("");
                this.errorDiv.HtmlElement.style.color = "red";
                this.outerDiv.Append(this.errorDiv.HtmlElement);
                this.errorDiv.Hide();

                this.outerDiv.Append(divWithTitleAndSubtitle.Container);

                if (properties.length > 0) {
                    this.optionAccordion = Framework.Form.Accordion.Create(Framework.LocalizationManager.Get("Options"));
                    this.optionAccordion.HtmlElement.style.marginTop = "15px";
                    let optionsDiv = document.createElement("div");
                    optionsDiv.style.width = "500px";
                    properties.forEach((x) => {
                        optionsDiv.appendChild(x.Editor.HtmlElement);
                    });
                    this.optionAccordion.Append(optionsDiv);

                    this.outerDiv.Append(this.optionAccordion.HtmlElement);
                }

                this.outerDiv.AddRightContent(actionsDiv);

                onChange();

            }

            public get OuterDiv(): Framework.Form.Accordion {
                return this.outerDiv;
            }

            public get DivWithTitleAndSubtitle(): DivWithTitleAndSubtitle {
                return this.divWithTitleAndSubtitle;
            }

            public Save() {
                //TOFIX
                //gérer html ou svg
                let self = this;

                var doctype = '<?xml version="1.0" standalone="no"?>'
                    + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

                // serialize our SVG XML to a string.
                var source = (new XMLSerializer()).serializeToString(d3.select('svg').node());

                // create a file blob of our SVG.
                var blob = new Blob([doctype + source], { type: 'image/svg+xml;charset=utf-8' });

                var url = window.URL.createObjectURL(blob);

                // Put the svg into an image tag so that the Canvas element can read it in.
                var img = d3.select('body').append('img')
                    .attr('width', 100)
                    .attr('height', 100)
                    .node();

                img.onload = function () {
                    // Now that the image has loaded, put the image into a canvas element.
                    var canvas: HTMLCanvasElement = d3.select('body').append('canvas').node();
                    canvas.width = 600;
                    canvas.height = 600;
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    var base64image = canvas.toDataURL("image/png");

                    // Split the base64 string in data and contentType
                    var block = base64image.split(";");
                    // Get the content type
                    var mimeType = block[0].split(":")[1];// In this case "image/png"
                    // get the real base64 content of the file
                    var realData = block[1].split(",")[1];// For example:  iVBORw0KGgouqw23....

                    // Convert b64 to blob and store it into a variable (with real base64 as value)
                    var canvasBlob = Screenshot.B64toBlob(realData, mimeType);

                    // Generate file download
                    FileHelper.SaveAs(canvasBlob, self.name + ".png");

                }
                // start loading the image.
                img.src = url;

            }

            public Clipboard() {
                //TOFIX : chrome only
                //gérer html ou svg

                var doctype = '<?xml version="1.0" standalone="no"?>'
                    + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

                // serialize our SVG XML to a string.
                var source = (new XMLSerializer()).serializeToString(d3.select('svg').node());

                // create a file blob of our SVG.
                var blob = new Blob([doctype + source], { type: 'image/svg+xml;charset=utf-8' });

                var url = window.URL.createObjectURL(blob);

                // Put the svg into an image tag so that the Canvas element can read it in.
                var img = d3.select('body').append('img')
                    .attr('width', 100)
                    .attr('height', 100)
                    .node();


                img.onload = function () {
                    // Now that the image has loaded, put the image into a canvas element.
                    var canvas: HTMLCanvasElement = d3.select('body').append('canvas').node();
                    canvas.width = 600;
                    canvas.height = 600;
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob(function (blob) {
                        const item = new ClipboardItem({ "image/png": blob });
                        (<any>navigator).clipboard.write([item]);
                    });



                }
                // start loading the image.
                img.src = url;



            }

            public ExportToCSV() {
                //TODO
                alert("todo");
            }

            private getActionDiv(properties: Framework.Form.PropertyEditor[]): HTMLDivElement {

                let self = this;

                let actionsDiv = document.createElement("div");
                actionsDiv.style.textAlign = "right";

                let saveButton = Framework.Form.Button.Create(() => { return true; }, () => {
                    self.Save();
                }, '<i class="fas fa-save"></i>', ["headerBtn"], Framework.LocalizationManager.Get("SaveAsPNG"));
                actionsDiv.appendChild(saveButton.HtmlElement);

                let copyButton = Framework.Form.Button.Create(() => { return true; }, () => {
                    self.Clipboard();
                }, '<i class="fas fa-clipboard"></i>', ["headerBtn"], Framework.LocalizationManager.Get("CopyToClipboard"));
                actionsDiv.appendChild(copyButton.HtmlElement);

                let csvButton = Framework.Form.Button.Create(() => { return true; }, () => {
                    self.ExportToCSV();
                }, '<i class="fas fa-file-excel"></i>', ["headerBtn"], Framework.LocalizationManager.Get("GetDataAsXLS"));
                actionsDiv.appendChild(csvButton.HtmlElement);

                let deleteButton = Framework.Form.Button.Create(() => { return true; }, () => {
                    self.outerDiv.HtmlElement.parentElement.removeChild(self.outerDiv.HtmlElement);
                    self.onDelete(this.ID);
                }, '<i class="fas fa-trash"></i>', ["headerBtn"], Framework.LocalizationManager.Get("Delete"));
                actionsDiv.appendChild(deleteButton.HtmlElement);


                return actionsDiv;
            }

            public HideOuterDiv() {
                this.divWithTitleAndSubtitle.HideTitle();
                this.divWithTitleAndSubtitle.HideSubtitle();
                if (this.optionAccordion) {
                    this.optionAccordion.Hide();
                }
            }

            public ShowOuterDiv() {
                this.divWithTitleAndSubtitle.ShowTitle();
                this.divWithTitleAndSubtitle.ShowSubtitle();
                if (this.optionAccordion) {
                    this.optionAccordion.Show();
                }
            }

            public ShowProgress() {
                this.progressDiv.Show();
            }

            public HideProgress() {
                this.progressDiv.Hide();
            }

            public ShowError(error: string) {
                this.errorDiv.Show();
                this.errorDiv.Set(error);
            }

            public HideError() {
                this.errorDiv.Hide();
            }

            //    output.DivWithTitleAndSubtitle.ContentDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            //}, (json) => {
            //    output.Show();
            //    onSuccess(json);
            //}, (error: string) => {
            //    output.DivWithTitleAndSubtitle.ContentDiv.innerHTML = "<p style='color:red'>" + error + "</p>";
        }

        export class DivWithTitleAndSubtitle {
            protected title: string = "Title";
            protected subtitle: string = "Subtitle";
            private container: HTMLDivElement;
            protected contentDiv: HTMLDivElement;
            protected titleDiv: HTMLDivElement;
            protected subtitleDiv: HTMLDivElement;

            constructor(title: string, subtitle: string) {

                let self = this;

                this.contentDiv = document.createElement("div");
                this.container = document.createElement("div");

                this.titleDiv = document.createElement("div");

                this.subtitleDiv = document.createElement("div");


                if (this.title && this.title.length > 0) {

                    this.titleDiv.innerText = this.title;
                    this.titleDiv.style.textAlign = "center";
                    this.titleDiv.style.marginBottom = "20px";
                    this.titleDiv.style.fontSize = "20px";
                    this.titleDiv.style.fontWeight = "bold";
                    this.titleDiv.contentEditable = "true";

                    this.titleDiv.addEventListener('mouseup', function (e) {
                        // Sélection
                        self.titleDiv.focus();
                        Framework.InlineHTMLEditor.Show(() => {
                        });
                    }, false);
                }

                this.container.appendChild(this.titleDiv);

                this.container.appendChild(this.contentDiv);
                this.contentDiv.style.cursor = "default";

                if (this.subtitle.length > 0) {

                    this.subtitleDiv.innerText = this.subtitle;
                    this.subtitleDiv.style.textAlign = "center";
                    this.subtitleDiv.style.marginTop = "20px";
                    this.subtitleDiv.contentEditable = "true";

                    this.subtitleDiv.addEventListener('mouseup', function (e) {
                        // Sélection
                        self.subtitleDiv.focus();
                        Framework.InlineHTMLEditor.Show(() => {
                        });
                    }, false);
                }

                this.container.appendChild(this.subtitleDiv);

            }

            public SetTitle(title: string) {
                this.title = title;
                this.titleDiv.innerHTML = title;
            }

            public SetSubtitle(subtitle: string) {
                this.subtitle = subtitle;
                this.subtitleDiv.innerHTML = subtitle;
            }

            public get Container() {
                return this.container;
            }

            public get ContentDiv() {
                return this.contentDiv;
            }

            public HideTitle() {
                this.titleDiv.classList.add("hidden");
            }

            public HideSubtitle() {
                this.subtitleDiv.classList.add("hidden");
            }

            public ShowTitle() {
                this.titleDiv.classList.remove("hidden");
            }

            public ShowSubtitle() {
                this.subtitleDiv.classList.remove("hidden");
            }
        }

        export module Plot {

            export class PlotMargin {
                public Left: number;
                public Right: number;
                public Top: number;
                public Bottom: number;
            }

            export class Element {
                // TODO : hide/show/chane color
            }

            export class Label extends Element {
                public X: number;
                public Y: number;
                public FontSize: number;
                public Color: string;
                public Text: string;
                public Editable: boolean;
                public Movable: boolean;

                //TODO : edit
            }

            export class Shape extends Element {
                public Fill: string;
                public Stroke: string;
                public StrokeWidth: number;
            }

            export class Point extends Shape {
                public X: number;
                public Y: number;
                public Size: number;
                public Symbol: string;
                public Tooltip: string;

                //TODO : onclick, move

                //export function makeDraggable(svg) {


                //    svg.addEventListener('mousedown', startDrag);
                //    svg.addEventListener('mousemove', drag);
                //    svg.addEventListener('mouseup', endDrag);
                //    svg.addEventListener('mouseleave', endDrag);
                //    svg.addEventListener('touchstart', startDrag);
                //    svg.addEventListener('touchmove', drag);
                //    svg.addEventListener('touchend', endDrag);
                //    svg.addEventListener('touchleave', endDrag);
                //    svg.addEventListener('touchcancel', endDrag);

                //    var selectedElement, offset, transform,
                //        bbox, minX, maxX, minY, maxY, confined;

                //    var boundaryX1 = 10.5;
                //    var boundaryX2 = 30;
                //    var boundaryY1 = 2.2;
                //    var boundaryY2 = 19.2;

                //    function getMousePosition(evt) {
                //        var CTM = svg.getScreenCTM();
                //        if (evt.touches) { evt = evt.touches[0]; }
                //        return {
                //            x: (evt.clientX - CTM.e) / CTM.a,
                //            y: (evt.clientY - CTM.f) / CTM.d
                //        };
                //    }

                //    function startDrag(evt) {
                //        //if (evt.target.classList.contains('draggable')) {
                //        selectedElement = evt.target;
                //        offset = getMousePosition(evt);

                //        // Make sure the first transform on the element is a translate transform
                //        var transforms = selectedElement.transform.baseVal;

                //        if (transforms.numberOfItems == 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
                //            // Create an transform that translates by (0, 0)
                //            var translate = svg.createSVGTransform();
                //            translate.setTranslate(0, 0);
                //            selectedElement.transform.baseVal.insertItemBefore(translate, 0);
                //        }

                //        // Get initial translation
                //        transform = transforms.getItem(0);
                //        offset.x -= transform.matrix.e;
                //        offset.y -= transform.matrix.f;

                //        //confined = evt.target.classList.contains('confine');
                //        //if (confined) {
                //        bbox = selectedElement.getBBox();
                //        minX = boundaryX1 - bbox.x;
                //        maxX = boundaryX2 - bbox.x - bbox.width;
                //        minY = boundaryY1 - bbox.y;
                //        maxY = boundaryY2 - bbox.y - bbox.height;
                //        //}
                //        //}
                //    }

                //    function drag(evt) {
                //        if (selectedElement) {
                //            evt.preventDefault();

                //            var coord = getMousePosition(evt);
                //            var dx = coord.x - offset.x;
                //            var dy = coord.y - offset.y;

                //            if (confined) {
                //                if (dx < minX) { dx = minX; }
                //                else if (dx > maxX) { dx = maxX; }
                //                if (dy < minY) { dy = minY; }
                //                else if (dy > maxY) { dy = maxY; }
                //            }

                //            transform.setTranslate(dx, dy);
                //        }
                //    }

                //    function endDrag(evt) {
                //        selectedElement = false;
                //    }
                //}

                // d3.symbolCircle d3.symbolCross d3.symbolDiamond d3.symbolSquare d3.symbolStar d3.symbolTriangle d3.symbolWye d3.pointRadial
            }

            //export class Circle extends Shape {
            //    public CX: number;
            //    public CY: number;
            //    public R: number;
            //}

            export class Line extends Shape {
                public X1: number;
                public X2: number;
                public Y1: number;
                public Y2: number;
                public MarkerStart: string;
                public MarkerEnd: string;
            }

            export class Rectangle extends Shape {
                public X: number;
                public Y: number;
                public Height: number;
                public Width: number;
            }

            export class Ellipse extends Shape {
                public CX: number;
                public CY: number;
                public RX: number;
                public RY: number;
            }

            export class Polyline extends Shape {
                public Points: Point[];
            }

            export class Plot extends DivWithTitleAndSubtitle {
                //TODO : icone chargement
                //TODO : gérer différents styles            

                protected svg: any;
                protected svgHeight: number;
                protected svgWidth: number;
                protected svgMargin: PlotMargin;

                protected xScale: any;
                protected yScale: any;
                protected xTicks: any;
                protected yTicks: any;

                protected name: string;

                constructor(name: string, height: number, width: number, margin: PlotMargin, title: string, subtitle: string) {
                    super(title, subtitle);
                    let self = this;

                    this.svgMargin = margin;
                    this.svgWidth = width - margin.Left - margin.Right;
                    this.svgHeight = height - margin.Top - margin.Bottom;

                    this.svg = d3.select(this.contentDiv)
                        .append("svg")
                        .attr("width", self.svgWidth + self.svgMargin.Left + self.svgMargin.Right)
                        .attr("height", self.svgHeight + self.svgMargin.Top + self.svgMargin.Bottom)
                        .append("g")
                        .attr("transform", "translate(" + self.svgMargin.Left + "," + self.svgMargin.Top + ")");

                }

                protected addLinearXAxis(min: number, max: number, legend: string = "", tickValues: number[] = undefined) {
                    let self = this;

                    this.xScale = d3.scaleLinear()
                        .domain([min, max])
                        .range([0, self.svgWidth]);

                    // Légende
                    this.svg.append("text")
                        .attr("transform",
                            "translate(" + (self.svgWidth / 2) + " ," +
                            (self.svgHeight + self.svgMargin.Top + 20) + ")")
                        .style("text-anchor", "middle")
                        .text(legend)
                        .style('fill', 'darkBlue');

                    if (tickValues) {
                        this.xTicks = this.svg.append('g')
                            .attr("transform", "translate(0," + self.svgHeight + ")")
                            .call(d3.axisBottom(self.xScale).tickValues(tickValues));
                    } else {
                        this.xTicks = this.svg.append('g')
                            .attr("transform", "translate(0," + self.svgHeight + ")")
                            .call(d3.axisBottom(self.xScale));
                    }



                }

                protected addBandXAxis(groups: string[], innerPadding: number = 0, outerPadding: number = 0) {
                    let self = this;

                    this.xScale = d3.scaleBand()
                        .range([0, self.svgWidth])
                        .domain(groups)
                        .paddingInner(innerPadding)
                        .paddingOuter(outerPadding)

                    this.svg.append('g')
                        .attr("transform", "translate(0," + self.svgHeight + ")")
                        .call(d3.axisBottom(self.xScale));
                }

                protected addYAxis(min: number, max: number, title: string = "", tickValues: number[] = undefined) {
                    let self = this;

                    this.yScale = d3.scaleLinear()
                        .domain([min, max])
                        .range([self.svgHeight, 0]);


                    this.svg.append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 0 - self.svgMargin.Left)
                        .attr("x", 0 - (self.svgHeight / 2))
                        .attr("dy", "1em")
                        .style("text-anchor", "middle")
                        .text(title)
                        .style('fill', 'darkBlue');

                    if (tickValues) {
                        this.yTicks = this.svg.append('g')
                            .call(d3.axisLeft(self.yScale).tickValues(tickValues));
                    } else {
                        this.yTicks = this.svg.append('g')
                            .call(d3.axisLeft(self.yScale));
                    }


                }

                protected addPoints(points: Point[]) {
                    let self = this;

                    let symbols = self.svg
                        .selectAll()
                        .data(points)
                        .enter()
                        .append('path')
                        .attr("class", "point")
                        .attr("d", d3.symbol().size(function (d: Point) { return d.Size; }).type(d3.symbolSquare)) //TODO
                        .attr('fill', function (d: Point) { return d.Fill; })
                        .attr('stroke', function (d: Point) { return d.Stroke; })
                        .attr('stroke-width', function (d: Point) { return d.StrokeWidth; })
                        .attr("transform", function (d: Point) { return "translate(" + self.xScale(d.X) + "," + self.yScale(d.Y) + ")"; });

                    symbols.append("svg:title")
                        .text(function (d: Point) { return d.Tooltip; });

                }

                protected addLabels(labels: Label[]) {
                    let self = this;

                    let l = self.svg
                        .selectAll()
                        .data(labels)
                        .enter()
                        .append("text")
                        .text(function (d: Label) { return d.Text; })
                        .style('fill', function (d: Label) { return d.Color })
                        .attr("text-anchor", "middle")

                        //.on("click", function () {
                        //    alert('test');
                        //})
                        .on("mouseover", function () {
                            d3.select(this).style("cursor", "move");
                        })
                        .on("mouseout", function () {
                            d3.select(this).style("cursor", "default");
                        })
                        .attr("x", function (d: Label) { return self.xScale(d.X) })
                        .attr("y", function (d: Label) { return self.yScale(d.Y) });


                    let dragHandler = d3.drag()
                        .on("drag", function () {
                            d3.select(this)
                                .attr("x", d3.event.x)
                                .attr("y", d3.event.y);
                        });

                    dragHandler(self.svg.selectAll("text"));

                }

                protected addLines(lines: Line[]) {
                    let self = this;

                    let line = self.svg
                        .selectAll()
                        .data(lines)
                        .enter()
                        .append("line")
                        .attr("x1", function (d: Line) { return self.xScale(d.X1) })
                        .attr("y1", function (d: Line) { return self.yScale(d.Y1) })
                        .attr("x2", function (d: Line) { return self.xScale(d.X2) })
                        .attr("y2", function (d: Line) { return self.yScale(d.Y2) })
                        .attr("stroke-width", function (d: Line) { return d.StrokeWidth })
                        .attr("stroke", function (d: Line) { return d.Stroke })
                        .attr("marker-end", function (d: Line) { return d.MarkerEnd != "" ? "url(#" + d.MarkerEnd + ")" : "" })
                        .attr("marker-start", function (d: Line) { return d.MarkerStart != "" ? "url(#" + d.MarkerStart + ")" : "" })
                }

                protected addPolylines(polylines: Polyline[]) {
                    let self = this;

                    polylines.forEach((pl) => {
                        let text = "";
                        pl.Points.forEach((p) => {
                            text += self.xScale(p.X) + ", " + self.yScale(p.Y) + " ";
                        });
                        self.svg.append("polyline")
                            .style("stroke", pl.Stroke)
                            .style("fill", pl.Fill)
                            .attr("points", text);
                    });

                }

                protected addRectangles(rectangles: Rectangle[]) {
                    let self = this;

                    self.svg.selectAll()
                        .data(rectangles)
                        .enter()
                        .append("rect")
                        .attr("x", function (d: Rectangle) { return (self.xScale(d.X) - d.Width / 2) })
                        .attr("y", function (d) { return (self.yScale(d.Height)) })
                        .attr("width", function (d: Rectangle) { return d.Width })
                        .attr("height", function (d) { return self.svgHeight - self.yScale(d.Height); })
                        .attr("stroke", function (d: Rectangle) { return d.Stroke })
                        .attr("fill", function (d: Rectangle) { return d.Fill })

                }

                protected addEllipses(ellipses: Ellipse[]) {
                    let self = this;

                    let ell = self.svg
                        .selectAll()
                        .data(ellipses)
                        .enter()
                        .append("ellipse")
                        .attr("cx", function (d: Ellipse) { return self.xScale(d.CX) })
                        .attr("cy", function (d: Ellipse) { return self.yScale(d.CY) })
                        .attr("rx", function (d: Ellipse) { return self.xScale(d.RX) })
                        .attr("ry", function (d: Ellipse) { return self.yScale(d.RY) })
                        .attr("fill", function (d: Ellipse) { return d.Fill })
                        .attr("stroke", function (d: Ellipse) { return d.Stroke })
                }

                protected addLegend() {

                    //TODO
                    //TODO : remplacer les couleurs par un click
                    //TODO : afficher masquer
                    let self = this;

                    var keys = ["Mister A", "Brigitte", "Eleonore", "Another friend", "Batman"]

                    var color = d3.scaleOrdinal()
                        .domain(keys)
                        .range(d3.schemeSet1)

                    var legend = this.svg.selectAll(".legend")
                        .data(color.domain())
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

                    // draw legend colored rectangles
                    legend.append("rect")
                        .attr("x", self.svgWidth - 18)
                        .attr("width", 18)
                        .attr("height", 18)
                        .style("fill", color);

                    // draw legend text
                    legend.append("text")
                        .attr("x", self.svgWidth - 24)
                        .attr("y", 9)
                        .attr("dy", ".35em")
                        .style("text-anchor", "end")
                        .text(function (d) { return d; })
                }

                //TODO : pointwithlabel

                public static Aggregate(listData: GroupedData[], listGroups: Group[], order: string = 'AscendingMean') {

                    let groups = d3.map(listData, (d) => { return d.Group; }).keys();
                    let gmin = d3.min(listData, (d) => { return d.Score; })
                    let gmax = d3.max(listData, (d) => { return d.Score; });

                    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
                    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
                        .key(function (d) { return d.Group; })
                        .rollup(function (d) {
                            let q1 = d3.quantile(d.map(function (g) { return g.Score; }).sort(d3.ascending), .25);
                            let median = d3.quantile(d.map(function (g) { return g.Score; }).sort(d3.ascending), .5);
                            let q3 = d3.quantile(d.map(function (g) { return g.Score; }).sort(d3.ascending), .75);
                            let interQuantileRange = q3 - q1;
                            let min = q1 - 1.5 * interQuantileRange;
                            let max = q3 + 1.5 * interQuantileRange;
                            let sd = d3.deviation(d.map(function (g) { return g.Score; }));
                            let mean = d3.mean(d.map(function (g) { return g.Score; }));
                            let color = "gray";
                            let colors = listGroups.filter((x) => { return x.Group == d.Group });
                            if (colors.length > 0) {
                                color = colors[0].Color;
                            }
                            return ({ q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max, color: color, sd: sd, mean: mean })
                        })
                        .entries(listData);

                    if (order == 'AscendingMean') {
                        // Tri par moyenne croissante
                        sumstat.sort(function (b, a) {
                            return b.value.mean - a.value.mean;
                        });
                    }

                    if (order == 'DescendingMean') {
                        // Tri par moyenne croissante
                        sumstat.sort(function (b, a) {
                            return a.value.mean - b.value.mean;
                        });
                    }

                    if (order == 'AscendingAlphabetical') {
                        // Tri par moyenne croissante
                        sumstat.sort(function (b, a) {
                            return b.key - a.key;
                        });
                    }

                    if (order == 'DescendingAlphabetical') {
                        // Tri par moyenne croissante
                        sumstat.sort(function (b, a) {
                            return a.key - b.key;
                        });
                    }

                    return { Min: gmin, Max: gmax, Groups: sumstat }

                }

            }

            export class ScatterPlot extends Plot {

                public Points: DataReport.Plot.Point[] = [
                    { X: 10, Y: 10, Size: 10, Fill: "blue", Stroke: "red", StrokeWidth: 1, Symbol: "+", Tooltip: "AA" },
                    { X: -30, Y: -50, Size: 10, Fill: "blue", Stroke: "red", StrokeWidth: 1, Symbol: "+", Tooltip: "AA" },
                    { X: 40, Y: 20, Size: 10, Fill: "blue", Stroke: "red", StrokeWidth: 1, Symbol: "+", Tooltip: "AA" },
                ];

                public Labels: DataReport.Plot.Label[] = [
                    { X: 10, Y: 10, FontSize: 10, Color: "blue", Text: "A", Editable: true, Movable: false },
                    { X: -30, Y: -50, FontSize: 10, Color: "blue", Text: "Azefzef", Editable: true, Movable: false },
                    { X: 40, Y: 20, FontSize: 10, Color: "blue", Text: "A", Editable: true, Movable: false },
                ];

                //public Circles: DataReport.Plot.Circle[] = [
                //    { CX: 60, CY: 60, R: 5, Fill: "yellow", Stroke: "red", StrokeWidth: 1 }
                //];

                public Ellipses: DataReport.Plot.Ellipse[] = [
                    { CX: 60, CY: 60, RX: 25, RY: 40, Fill: "rgba(0, 128, 0, 0.5)", Stroke: "red", StrokeWidth: 1 }
                ];

                public Lines: DataReport.Plot.Line[] = [
                    { X1: 0, X2: 50, Y1: 0, Y2: 50, Fill: "yellow", Stroke: "red", StrokeWidth: 1, MarkerStart: "", MarkerEnd: "" }
                ];

                constructor(name: string, height: number, width: number, title: string, subtitle: string) {
                    super(name, height, width, { Top: 30, Left: 30, Right: 30, Bottom: 30 }, title, subtitle);
                    this.addLinearXAxis(-100, 100);
                    this.addYAxis(-100, 100);
                    this.addPoints(this.Points);

                    //this.addCircles(this.Circles);
                    this.addLines(this.Lines);
                    //this.addArrows(this.Arrows);
                    this.addEllipses(this.Ellipses);
                    this.addLegend();
                    this.addLabels(this.Labels);
                }

            }

            export class BoxPlot extends Plot {

                constructor(name: string, height: number, width: number, title: string, subtitle: string, xLabel: string, yLabel: string, listData: GroupedData[], listGroups: Group[]) {
                    super(name, height, width, { Top: 30, Left: 30, Right: 30, Bottom: 30 }, title, subtitle);
                    let self = this;
                    let groups = d3.map(listData, (d) => { return d.Group; }).keys();
                    let gmin = d3.min(listData, (d) => { return d.Score; })
                    let gmax = d3.max(listData, (d) => { return d.Score; });

                    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
                    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
                        .key(function (d) { return d.Group; })
                        .rollup(function (d) {
                            let q1 = d3.quantile(d.map(function (g) { return g.Score; }).sort(d3.ascending), .25)
                            let median = d3.quantile(d.map(function (g) { return g.Score; }).sort(d3.ascending), .5)
                            let q3 = d3.quantile(d.map(function (g) { return g.Score; }).sort(d3.ascending), .75)
                            let interQuantileRange = q3 - q1
                            let min = q1 - 1.5 * interQuantileRange
                            let max = q3 + 1.5 * interQuantileRange
                            let color = "gray";
                            let colors = listGroups.filter((x) => { return x.Group == d.Group });
                            if (colors.length > 0) {
                                color = colors[0].Color;
                            }
                            return ({ q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max, color: color })
                        })
                        .entries(listData);

                    this.addBandXAxis(groups, 1, 1);
                    this.addYAxis(gmin, gmax);

                    self.svg.append("svg:defs").append("svg:marker")
                        .attr("id", "triangle")
                        .attr("refX", 6)
                        .attr("refY", 6)
                        .attr("markerWidth", 30)
                        .attr("markerHeight", 30)
                        .attr("markerUnits", "userSpaceOnUse")
                        .attr("orient", "auto")
                        .append("path")
                        .attr("d", "M 0 0 12 6 0 12 3 6")
                        .style("fill", "black"); //TODO couleur

                    let lines: Line[] = [];
                    let rectangles: Rectangle[] = [];
                    let boxWidth = 20;
                    sumstat.forEach((x) => {
                        let line = new Line();
                        line.X1 = (x.key);
                        line.X2 = (x.key);
                        line.Y1 = Math.max(gmin, x.value.min);
                        line.Y2 = Math.min(gmax, x.value.max);
                        line.Stroke = "black";
                        line.StrokeWidth = 1;
                        line.MarkerStart = "triangle";
                        line.MarkerEnd = "triangle";
                        lines.push(line);

                        let rectangle = new Rectangle();
                        rectangle.X = x.key;
                        rectangle.Y = x.value.q3;
                        rectangle.Height = x.value.q1 - x.value.q3; //TOFIX
                        rectangle.Width = boxWidth;
                        rectangle.Stroke = "black";
                        rectangle.Fill = "gray";
                        rectangles.push(rectangle);
                    });
                    this.addLines(lines);
                    this.addRectangles(rectangles);



                    // rectangle for the main box



                    //self.svg
                    //    .selectAll("boxes")
                    //    .data(sumstat)
                    //    .enter()
                    //    .append("rect")
                    //    .attr("x", function (d) { return (self.xAxis(d.key) - boxWidth / 2) })
                    //    .attr("y", function (d) { return (self.yAxis(d.value.q3)) })
                    //    .attr("height", function (d) { return (self.yAxis(d.value.q1) - self.yAxis(d.value.q3)) })
                    //    .attr("width", boxWidth)
                    //    .attr("stroke", "black")
                    //    .attr("fill", "red")

                    // Show the median
                    self.svg
                        .selectAll("medianLines")
                        .data(sumstat)
                        .enter()
                        .append("line")
                        .attr("x1", function (d) { return (self.xScale(d.key) - boxWidth / 2) })
                        .attr("x2", function (d) { return (self.xScale(d.key) + boxWidth / 2) })
                        .attr("y1", function (d) { return (self.yScale(d.value.median)) })
                        .attr("y2", function (d) { return (self.yScale(d.value.median)) })
                        .attr("stroke", "black")
                        .style("width", 80)

                    //// Titre
                    //self.svg.append("text")
                    //    .attr("x", (self.svgWidth / 2))
                    //    .attr("y", 0 - (self.svgMargin.Top / 2))
                    //    .attr("text-anchor", "middle")
                    //    .style("font-size", "16px")
                    //    .style("text-decoration", "underline")
                    //    .text("Value");


                }

            }

            export class BarPlot extends Plot {

                constructor(name: string, height: number, width: number, title: string, subtitle: string, xLabel: string, yLabel: string, listData: GroupedData[], listGroups: Group[], bars: string = "sd") {
                    super(name, height, width, { Top: 30, Left: 30, Right: 30, Bottom: 30 }, title, subtitle);
                    let self = this;

                    let sumstat = Plot.Aggregate(listData, listGroups);

                    this.addBandXAxis(sumstat.Groups.map((x) => { return x.key }), 1, 1);
                    this.addYAxis(sumstat.Min, sumstat.Max);

                    //self.svg.append("svg:defs").append("svg:marker")
                    //    .attr("id", "bar")
                    //    .attr("refX", 0)
                    //    .attr("refY", 0)
                    //    .attr("markerWidth", 30)
                    //    .attr("markerHeight", 30)
                    //    .attr("markerUnits", "userSpaceOnUse")
                    //    .attr("orient", "auto")
                    //    .append("path")
                    //    .attr("d", "M 0,0 m -5,-5 L 5,-5 L 5,5 L -5,5 Z")
                    //    .style("fill", "black"); //TODO couleur

                    //let symbolGenerator = d3.symbol().size(200).type(d3.symbolTriangle);

                    //var def = self.svg.append("svg:defs")
                    //    .append("svg:marker")
                    //    .attr("id", "bar")
                    //    .attr("class", "traffic")
                    //    .attr("viewBox", "-7 -7 14 14")
                    //    .append("svg:path")
                    //    .attr("d", symbolGenerator)
                    //    .style("fill", "black") ;

                    let lines: Line[] = [];
                    let rectangles: Rectangle[] = [];
                    let points: Point[] = [];
                    let boxWidth = 20;
                    sumstat.Groups.forEach((x) => {
                        let line = new Line();
                        line.X1 = (x.key);
                        line.X2 = (x.key);
                        if (bars == "sd") {
                            line.Y1 = x.value.mean + x.value.sd;
                            line.Y2 = x.value.mean - x.value.sd;
                        }
                        line.Stroke = "black";
                        line.StrokeWidth = 1;
                        line.MarkerStart = "";
                        line.MarkerEnd = "";
                        lines.push(line);

                        let point = new Point();
                        point.X = x.key;
                        point.Y = x.value.mean + x.value.sd;
                        point.Size = 20;
                        point.Stroke = "black";
                        point.StrokeWidth = 1;
                        point.Symbol = "";
                        point.Tooltip = Framework.Maths.Round(point.Y, 2).toString();
                        points.push(point);

                        let point2 = new Point();
                        point2.X = x.key;
                        point2.Y = x.value.mean - x.value.sd;
                        point2.Size = 20;
                        point2.Stroke = "black";
                        point2.StrokeWidth = 1;
                        point2.Symbol = "";
                        point2.Tooltip = Framework.Maths.Round(point2.Y, 2).toString();
                        points.push(point2);


                        let rectangle = new Rectangle();
                        rectangle.X = x.key;
                        rectangle.Y = 0;
                        rectangle.Height = x.value.mean;
                        rectangle.Width = boxWidth;
                        rectangle.Stroke = "black";
                        rectangle.Fill = "gray";
                        rectangles.push(rectangle);
                    });

                    this.addRectangles(rectangles);
                    this.addLines(lines);
                    this.addPoints(points);

                    // gridlines in x axis function
                    //function make_x_gridlines() {
                    //    return d3.axisBottom(self.xAxis)
                    //        .ticks(5)
                    //}

                    //// gridlines in y axis function
                    //function make_y_gridlines() {
                    //    return d3.axisLeft(self.yAxis)
                    //        .ticks(2)
                    //}

                    //self.svg.append("g")
                    //    .attr("class", "grid")
                    //    .attr("transform", "translate(0," + height + ")")
                    //    .call(make_x_gridlines()
                    //        .tickSize(-height)
                    //        .tickFormat("")
                    //    )

                    //self.svg.append("g")
                    //    .attr("class", "grid")
                    //    .call(make_y_gridlines()
                    //        .tickSize(-width)
                    //        .tickFormat("")
                    //    )

                    // gridlines in y axis function
                    //function make_y_gridlines() {
                    //    return d3.axisLeft(yAxis)
                    //        .ticks(5)
                    //}

                    //       // Show the median
                    //self.svg
                    //    .selectAll("medianLines")
                    //    .data(sumstat)
                    //    .enter()
                    //    .append("line")
                    //    .attr("x1", function (d) { return (self.xAxis(d.key) - boxWidth / 2) })
                    //    .attr("x2", function (d) { return (self.xAxis(d.key) + boxWidth / 2) })
                    //    .attr("y1", function (d) { return (self.yAxis(d.value.median)) })
                    //    .attr("y2", function (d) { return (self.yAxis(d.value.median)) })
                    //    .attr("stroke", "black")
                    //    .style("width", 80)

                    //// Titre
                    //self.svg.append("text")
                    //    .attr("x", (self.svgWidth / 2))
                    //    .attr("y", 0 - (self.svgMargin.Top / 2))
                    //    .attr("text-anchor", "middle")
                    //    .style("font-size", "16px")
                    //    .style("text-decoration", "underline")
                    //    .text("Value");

                    //TODO : gmean
                }
            }

            //export class PCA extends Plot {

            //    private datasetSummary: PanelLeaderModels.DatasetSummary;
            //    private parameters: Framework.DataReport.ANOVAParameter;

            //    constructor(datasetSummary: PanelLeaderModels.DatasetSummary, parameters: PCAParameter, rServerInstance: RServer) {
            //        super(parameters.Name, parameters.Height, parameters.Width, { Top: 30, Left: 30, Right: 30, Bottom: 30 }, parameters.Title, parameters.Subtitle);
            //        let self = this;
            //        let script = "";
            //        //rServerInstance.Run(listData, script, () => { }, () => { });
            //    }
            //}

            //export class CVA extends Plot {

            //    private datasetSummary: PanelLeaderModels.DatasetSummary;
            //    private parameters: Framework.DataReport.CVAParameter;

            //    private points: DataReport.Plot.Point[];
            //    private labels: DataReport.Plot.Label[];
            //    private lines: DataReport.Plot.Line[];
            //    private ellipses: DataReport.Plot.Polyline[];

            //    private hotellingTable: Framework.Form.Table<any>;

            //    private xmin: number = 0;
            //    private xmax: number = 0;
            //    private ymin: number = 0;
            //    private ymax: number = 0;

            //    private obj: any;

            //    ////constructor(datasetSummary: PanelLeaderModels.DatasetSummary, parameters: Framework.DataReport.CVAParameter, title: string, subtitle: string) {
            //    ////    super(parameters.Name, parameters.Height, parameters.Width, { Top: 10, Left: 30, Right: 30, Bottom: 30 }, title, subtitle);
            //    ////    this.parameters = parameters;
            //    ////    this.datasetSummary = datasetSummary;
            //    ////}

            //    public GetScript() {
            //        //TODO : descripteurs significatifs ou non, tous les axes
            //        return 'CVA(rSession = rSession, test = "Hotelling-Lawley", option = "TwoWayANOVA", alpha = 0.1, representation = "Biplot", t2byRep = F, ellipsesType = "Barycentric", ellipsesCalculation = "Chi", confInt = 0.9, linkBetweenProducts = TRUE, panellists = "None", ellipsesByRep = F, individualsLabels = TRUE, variablesLabels = TRUE);\n';
            //    }

            //    public Render(obj: any = undefined) {

            //        let self = this;

            //        if (obj) {
            //            this.obj = obj;
            //        }

            //        this.svg.selectAll("*").remove();

            //        this.points = [];
            //        this.labels = [];
            //        this.lines = [];
            //        this.ellipses = [];

            //        let planIndex = this.parameters.AxesCombinations.indexOf(this.parameters.Axes);

            //        this.obj["Plans"][planIndex]["Ellipses"].forEach((x) => {

            //            let e = new DataReport.Plot.Polyline();
            //            e.Fill = "none";
            //            e.Stroke = "blue";
            //            e.StrokeWidth = 1;
            //            e.Points = [];
            //            self.ellipses.push(e);

            //            x.forEach((p) => {
            //                let point = new Point();
            //                point.X = p[0];
            //                point.Y = p[1];
            //                if (point.X < self.xmin) {
            //                    self.xmin = point.X;
            //                }
            //                if (point.X > self.xmax) {
            //                    self.xmax = point.X;
            //                }
            //                if (point.Y < self.ymin) {
            //                    self.ymin = point.Y;
            //                }
            //                if (point.Y > self.ymax) {
            //                    self.ymax = point.Y;
            //                }
            //                e.Points.push(point);
            //            })

            //        });

            //        self.xmin *= 1.05;
            //        self.ymin *= 1.05;
            //        self.xmax *= 1.05;
            //        self.ymax *= 1.05;

            //        //self.xmin = Math.min(self.xmin, self.ymin);
            //        //self.xmax = Math.max(self.xmax, self.ymax);
            //        //self.ymin = self.xmin;
            //        //self.ymax = self.ymax;

            //        let yOffset = (this.ymax - this.ymin) / 100;

            //        let axes = this.parameters.Axes.split(", ");
            //        let axe1 = "V" + axes[0];
            //        let axe2 = "V" + axes[1];

            //        this.obj["IndivCoord"].forEach((x) => {
            //            let p = new DataReport.Plot.Point();
            //            p.X = x[axe1];
            //            p.Y = x[axe2];
            //            p.Size = 10;
            //            p.Fill = "blue";
            //            p.Stroke = "blue";
            //            p.StrokeWidth = 1;
            //            p.Symbol = "+";
            //            p.Tooltip = x["_row"];
            //            self.points.push(p);

            //            let l = new DataReport.Plot.Label();
            //            l.X = x[axe1];
            //            l.Y = Number(x[axe2]) + yOffset;
            //            l.Color = "blue";
            //            l.Movable = true;
            //            l.Text = x["_row"];
            //            l.FontSize = 20;
            //            l.Editable = true;
            //            self.labels.push(l);

            //        });

            //        yOffset *= 2;

            //        this.obj["VarCoord"].forEach((x) => {
            //            let a = new DataReport.Plot.Line();
            //            a.Y1 = 0;
            //            a.Y2 = x[axe2];
            //            a.X1 = 0;
            //            a.X2 = x[axe1];
            //            a.Fill = "red";
            //            a.Stroke = "red";
            //            a.StrokeWidth = 1;
            //            a.MarkerEnd = "triangle";
            //            self.lines.push(a);

            //            let l = new DataReport.Plot.Label();
            //            l.X = x[axe1];
            //            l.Y = Number(x[axe2]);
            //            if (l.Y > 0) {
            //                l.Y += yOffset;
            //            } else {
            //                l.Y += -yOffset * 2;
            //            }
            //            l.Color = "red";
            //            l.Movable = true;
            //            l.Text = x["_row"];
            //            l.FontSize = 20;
            //            l.Editable = true;
            //            self.labels.push(l);

            //        });

            //        // Marqueur des flèches des attributs
            //        this.svg.append("svg:defs").append("svg:marker")
            //            .attr("id", "triangle")
            //            .attr("refX", 6)
            //            .attr("refY", 6)
            //            .attr("markerWidth", 30)
            //            .attr("markerHeight", 30)
            //            .attr("markerUnits", "userSpaceOnUse")
            //            .attr("orient", "auto")
            //            .append("path")
            //            .attr("d", "M 0 0 12 6 0 12 3 6")
            //            .style("fill", "red");

            //        //# Pour conserver le rapport de distance
            //        this.ymin = this.xmin;
            //        this.ymax = this.xmax;

            //        this.addLinearXAxis(this.xmin, this.xmax, "Can. " + axes[0] + " (" + Maths.Round(this.obj["Plans"][planIndex]["Inertie1"], 2) + "%)");
            //        this.addYAxis(this.ymin, this.ymax, "Can. " + axes[1] + " (" + Maths.Round(this.obj["Plans"][planIndex]["Inertie2"], 2) + "%)");

            //        // Axes invisibles
            //        this.xTicks.selectAll('text').attr('fill', 'none');
            //        this.xTicks.selectAll('path').attr('stroke', 'none');
            //        this.xTicks.selectAll('line').attr('stroke', 'none');

            //        this.yTicks.selectAll('text').attr('fill', 'none');
            //        this.yTicks.selectAll('path').attr('stroke', 'none');
            //        this.yTicks.selectAll('line').attr('stroke', 'none');

            //        let line0 = new DataReport.Plot.Line();
            //        line0.Y1 = this.ymin; line0.Y2 = this.ymax; line0.X1 = 0; line0.X2 = 0; line0.Fill = "lightgray"; line0.Stroke = "lightgray"; line0.StrokeWidth = 1;
            //        this.lines.push(line0);
            //        let line1 = new DataReport.Plot.Line();
            //        line1.Y1 = 0; line1.Y2 = 0; line1.X1 = this.xmin; line1.X2 = this.xmax; line1.Fill = "lightgray"; line1.Stroke = "lightgray"; line1.StrokeWidth = 1;
            //        this.lines.push(line1);
            //        let line2 = new DataReport.Plot.Line();
            //        line2.Y1 = this.ymax; line2.Y2 = this.ymax; line2.X1 = this.xmin; line2.X2 = this.xmax; line2.Fill = "darkblue"; line2.Stroke = "darkblue";
            //        this.lines.push(line2);
            //        let line3 = new DataReport.Plot.Line();
            //        line3.Y1 = this.ymin; line3.Y2 = this.ymax; line3.X1 = this.xmin; line3.X2 = this.xmin; line3.Fill = "darkblue"; line3.Stroke = "darkblue";
            //        this.lines.push(line3);
            //        let line4 = new DataReport.Plot.Line();
            //        line4.Y1 = this.ymin; line4.Y2 = this.ymin; line4.X1 = this.xmin; line4.X2 = this.xmax; line4.Fill = "darkblue"; line4.Stroke = "darkblue";
            //        this.lines.push(line4);
            //        let line5 = new DataReport.Plot.Line();
            //        line5.Y1 = this.ymin; line5.Y2 = this.ymax; line5.X1 = this.xmax; line5.X2 = this.xmax; line5.Fill = "darkblue"; line5.Stroke = "darkblue";
            //        this.lines.push(line5);


            //        this.addLines(this.lines);
            //        this.addPolylines(this.ellipses);
            //        this.addPoints(this.points);
            //        this.addLabels(this.labels);

            //        //TODO : centrer carte

            //        this.SetTitle(Framework.LocalizationManager.Get("CVAOfScores") + " (" + Framework.Maths.Round(this.obj["Plans"][planIndex]["InertieCumul"], 2) + "%)");
            //        let pv = Framework.Maths.Round(this.obj["Stats"]["pval"][0], 3);
            //        let tpv = "";
            //        if (pv < 0.001) {
            //            tpv = "<0.001";
            //        } else {
            //            tpv = "=" + pv;
            //        }
            //        this.SetSubtitle("NDIMSIG=" + this.obj["NbDimSig"][0] + ", F=" + Framework.Maths.Round(this.obj["Stats"]["F"][0], 3) + " (p" + tpv + ")</p><p>Confidence ellipses=" + this.parameters.EllipsesConfidenceLevel + "%");

            //        let dtable = new Framework.Form.Table();
            //        dtable.ListColumns = [];
            //        dtable.ShowFooter = false;

            //        let col = new Framework.Form.TableColumn();
            //        col.Name = "_row";
            //        col.Filterable = false;
            //        col.Sortable = false;
            //        col.Title = "";
            //        col.Editable = false;
            //        dtable.ListColumns.push(col);

            //        this.datasetSummary.Products.forEach((x) => {
            //            let col1 = new Framework.Form.TableColumn();
            //            col1.Name = x;
            //            col1.Filterable = false;
            //            col1.Sortable = false;
            //            col1.Title = x;
            //            col1.Editable = false;

            //            col1.RenderFunction = (val, row) => {
            //                let roundVal = Maths.Round(val, 3).toString();
            //                if (Number(val) < 0.001) {
            //                    roundVal = "<0.001";
            //                }
            //                if (val <= (1 - self.parameters.EllipsesConfidenceLevel)) {
            //                    return "<strong>" + roundVal + "<strong>";
            //                }

            //                return roundVal.toString();
            //            };

            //            dtable.ListColumns.push(col1);
            //        });

            //        dtable.CanSelect = false;
            //        dtable.Height = "400px";
            //        dtable.ListData = this.obj["HotellingTable"];

            //        this.hotellingTable = dtable;

            //    }

            //    public get Table(): Framework.Form.Table<any> {
            //        return this.hotellingTable;
            //    }

            //}


        }

        export class GroupedData {
            public Score: number;
            public Group: string;

        }

        export class Group {
            public Group: string;
            public Color: string;
        }

        export class Function {
            public IsSelected: boolean;
            public Name: string;
            public Label: string;
            public Parameters: Framework.DataReport.FunctionParameter;
        }

        export class FunctionParameter {
            public Name: string;
            public Height: number = 600;
            public Width: number = 600;
            public Title: string;
            public Subtitle: string = "";

            constructor(name: string = "", title: string = "") {
                this.Name = name;
                this.Title = title;
            }

            public GetParameters(onChange: (mustReload: boolean) => void): Framework.Form.PropertyEditor[] {
                let self = this;

                let properties = [];

                return properties;
            }
        }

        export class BarplotParameter extends FunctionParameter {
            public Group: string;
            public Unit: string;
            public Bars: string;

            constructor(name: string, title: string, group: string, unit: string, bars: string) {
                super(name, title);
                this.Group = group;
                this.Unit = unit;
                this.Bars = bars;

            }
        }

        export class BoxplotParameter extends FunctionParameter {
            public Group: string;
            public Unit: string;

            constructor(name: string, title: string, group: string, unit: string) {
                super(name, title);
                this.Group = group;
                this.Unit = unit;
            }
        }

        export class PCAParameter extends FunctionParameter {
            public Option: string = "Covariance";
            public Plot: string = "DistanceBiplot";
            public NDim: number = 2;
            public Ellipses: string = "Barycentric";
            public EllipsesCalculationMode: string = "Chi2";
            public EllipsesConfidenceLevel: number = 0.9;
            public AttributeSelectionAlpha: number = 1;
        }

        export class CVAParameter extends FunctionParameter {
            public Plot: string = "Biplot";
            public Axes: string = "1, 2";
            public AxesCombinations: string[] = ["1, 2"];
            public Ellipses: string = "Barycentric";
            public EllipsesCalculationMode: string = "Chi2";
            public EllipsesConfidenceLevel: number = 0.9;
            public AttributeSelectionAlpha: number = 1;

            public GetParameters(onChange: (mustReload: boolean) => void): Framework.Form.PropertyEditor[] {
                let self = this;

                let properties = [];

                let p1 = Framework.Form.PropertyEditorWithPopup.Render("", "Axes", this.Axes, this.AxesCombinations, (x) => {
                    self.Axes = x;
                    onChange(false);
                });
                properties.push(p1);

                //let p2 = Framework.Form.PropertyEditorWithPopup.Render("", "CalculationMode", this.CalculationMode, ["Ols", "ML"], (x) => {
                //    self.CalculationMode = x;
                //    onChange(true);
                //});
                //properties.push(p2);
                let p3 = Framework.Form.PropertyEditorWithPopup.Render("", "Plot", this.Plot, ["Biplot", "TwoMaps"], (x) => {
                    self.Plot = x;
                    onChange(false);
                });
                properties.push(p3);

                return properties;
            }
        }

        export class ANOVAParameter extends FunctionParameter {
            public Model: string = "TwoWayMultiplicative";
            public RandomEffects: string = "SubjectCode";
            public CalculationMode: string = "Ols";
            public LSMeansAdjustment: string = "Tukey";
            public LSMeansAlpha: number = 0.05;
            public Columns: string[] = ["AttributeCode", "GMean", "FProd", "PProd", "RMSE"];
            public HomoscedasticityTest: string = "";
            public NormalityTest: string = "";
            public RowOrder: string = "FProd";

            public GetParameters(onChange: (mustReload: boolean) => void): Framework.Form.PropertyEditor[] {
                let self = this;

                let properties = [];

                let p1 = Framework.Form.PropertyEditorWithPopup.Render("", "Model", this.Model, ["TwoWayMultiplicative", "TwoWayAdditive"], (x) => {
                    self.Model = x;
                    onChange(true);
                });
                properties.push(p1);
                let p2 = Framework.Form.PropertyEditorWithPopup.Render("", "CalculationMode", this.CalculationMode, ["Ols", "ML"], (x) => {
                    self.CalculationMode = x;
                    onChange(true);
                });
                properties.push(p2);
                let p3 = Framework.Form.PropertyEditorWithPopup.Render("", "RowOrder", this.RowOrder, ["FProd", "GMean"], (x) => {
                    self.RowOrder = x;
                    onChange(false);
                });
                properties.push(p3);
                return properties;
            }
        }

        //export class Pivot extends DivWithTitleAndSubtitle {
        //    constructor(datasetSummary: PanelLeaderModels.DatasetSummary, title: string, subtitle: string) {
        //        super(title, subtitle);
        //        Framework.Pivot.Render(this.contentDiv, datasetSummary.ListData, ["Session", "Replicate", "ProductCode"], ["AttributeCode"], ["Score"], ["Type", "DataControlId", "ProductRank", "AttributeRank", "RecordedDate", "ControlName", "State", "SheetName", "Group", "Description"], "Average", "Table", () => { });
        //    }
        //}

        export class HTMLTable extends DivWithTitleAndSubtitle {
            constructor(title: string, subtitle: string) {
                super(title, subtitle);
            }
        }

        //export class ANOVA extends HTMLTable {

        //    private datasetSummary: PanelLeaderModels.DatasetSummary;
        //    private parameters: Framework.DataReport.ANOVAParameter;

        //    constructor(datasetSummary: PanelLeaderModels.DatasetSummary, p: Framework.DataReport.ANOVAParameter, title: string, subtitle: string) {
        //        super(title, subtitle);
        //        this.datasetSummary = datasetSummary;
        //        this.parameters = p;
        //    }

        //    public GetScript() {
        //        return 'AnovaTable(rSession = rSession, model = "' + this.parameters.Model + '", randomSubject = T, correlationStructure = "AR1", testRep = "EachRepVsPrevious", lsMeansAlpha = ' + this.parameters.LSMeansAlpha + ', lsMeansAdjustment = "' + this.parameters.LSMeansAdjustment + '", anovaCalculationMode = "' + this.parameters.CalculationMode + '");\n';
        //    }

        //    public GetTable(list: any[]): Framework.Form.Table<any> {

        //        let self = this;

        //        //this.contentDiv.innerHTML = "";

        //        let dtable = new Framework.Form.Table();
        //        dtable.ListColumns = [];
        //        dtable.ShowFooter = false;

        //        let colnames = this.parameters.Columns;

        //        this.datasetSummary.Products.forEach((x) => {
        //            if (colnames.indexOf(x) < 0) {
        //                colnames.push(x);
        //            }
        //        });

        //        if (self.parameters.RowOrder) {
        //            list = list.sort((a, b) => {
        //                let x = a[self.parameters.RowOrder];
        //                let y = b[self.parameters.RowOrder];

        //                if (Number(x)) {
        //                    x = Number(x);
        //                    y = Number(y);
        //                }
        //                if (x < y) {
        //                    return 1;
        //                } else {
        //                    return -1;
        //                }
        //            })
        //        }

        //        colnames.forEach((x) => {
        //            let col1 = new Framework.Form.TableColumn();
        //            col1.Name = x;
        //            col1.Filterable = false;
        //            col1.Sortable = false;
        //            col1.Title = Framework.LocalizationManager.Get(x);
        //            col1.Editable = false;
        //            dtable.ListColumns.push(col1);

        //            if (x == "FProd" || x == "PProd") {
        //                col1.RenderFunction = (val, row) => {
        //                    if (row["PProd"] <= 0.05) {
        //                        return "<span style='font-weight:bold;'>" + row[x] + "</span>";
        //                    }
        //                    return row[x];
        //                };
        //            }
        //        });

        //        dtable.CanSelect = false;
        //        dtable.Height = "400px";
        //        dtable.ListData = list;

        //        dtable.Render(this.contentDiv);

        //        return dtable;


        //    }

        //}

        //export class RServer {

        //    public WorkingDirectoryId: string;
        //    public WcfServiceUrl: string;
        //    public Login: string;
        //    public Password: string;
        //    public OnComplete: (result: string) => void;

        //    constructor(rServerWCFServiceURL: string, rServerLogin: string, rServerPassword: string, rServerOnComplete: (result: string) => void) {
        //        this.WcfServiceUrl = rServerWCFServiceURL;
        //        this.Login = rServerLogin;
        //        this.Password = rServerPassword;
        //        this.OnComplete = rServerOnComplete;
        //    }

        //    public Open(listData: Models.Data[], onStart: () => void, onSuccess: (result: string) => void, onError: (error: string) => void) {

        //        let self = this;

        //        let script: string = "library(\"TimeSensNew\");\n";
        //        script += "rSession <- OpenRSession('Profile');\n";

        //        let data: string = "";

        //        let columns = Models.Data.GetColumns(Models.Data.GetType(listData[0]));
        //        columns.forEach((col) => {
        //            data += col + ";";
        //        });
        //        data = data.substr(0, data.length - 1);
        //        data += "\n";

        //        listData.forEach((x) => {
        //            data += Models.Data.ToString(x) + "\n";
        //        });

        //        let obj = {
        //            login: self.Login,
        //            password: self.Password,
        //            data: data,
        //            script: script
        //        };

        //        Framework.WCF.Call(this.WcfServiceUrl, 'OpenRSession', JSON.stringify(obj), () => {
        //            onStart();
        //        }, (result) => {
        //            if (result.Status == 'success') {
        //                let res = result.Result;
        //                onSuccess(res);
        //            }
        //            if (result.Status == 'error') {
        //                onError(result.ErrorMessage);
        //            }

        //            self.OnComplete(result.Status);

        //        });

        //    }

        //    public Run(f: string, onStart: () => void, onSuccess: (result: string) => void, onError: (error: string) => void) {

        //        let self = this;

        //        let script: string = "library(\"TimeSensNew\");\n";
        //        script += f;

        //        let obj = {
        //            functionAsText: script,
        //            login: self.Login,
        //            id: self.WorkingDirectoryId
        //        };

        //        Framework.WCF.Call(this.WcfServiceUrl, 'RunRFunction', JSON.stringify(obj), () => {
        //            onStart();
        //        }, (result) => {
        //            if (result.Status == 'success') {
        //                let res = result.Result;
        //                onSuccess(res);
        //            }
        //            if (result.Status == 'error') {
        //                onError(result.ErrorMessage);
        //            }

        //            self.OnComplete(result.Status);

        //        });


        //    }
        //}

        //export class Report {

        //    // TODO : mémoriser en tant que template
        //    // TODO : gestion du menu
        //    // TODO : gestion des paramètres
        //    // TODO : paramètres dynamiques

        //    //public Name: string;

        //    private functions: Framework.DataReport.Function[];

        //    private datasetSummary: PanelLeaderModels.DatasetSummary;

        //    private reportDiv: Framework.Form.TextElement;
        //    private menuDiv: Framework.Form.TextElement;
        //    private outputsDiv: Framework.Form.TextElement;

        //    private rServer: Framework.DataReport.RServer;

        //    constructor(datasetSummary: PanelLeaderModels.DatasetSummary, rServer: Framework.DataReport.RServer, functions: Framework.DataReport.Function[] = undefined) {
        //        this.rServer = rServer;
        //        this.datasetSummary = datasetSummary;
        //        if (functions) {
        //            this.functions = functions;
        //        } else {
        //            this.functions = this.getFunctions();
        //        }

        //        this.reportDiv = Framework.Form.TextElement.Create("");

        //        // Journal
        //        let logDiv = Framework.Form.Accordion.Create(Framework.LocalizationManager.Get("Log"), ["reportHeader"]);
        //        let log = datasetSummary.GetLogDiv().HtmlElement;
        //        log.style.marginBottom = "30px";
        //        logDiv.Append(log);
        //        this.reportDiv.HtmlElement.appendChild(logDiv.HtmlElement);

        //        // Liste des sorties
        //        let menuDiv = Framework.Form.Accordion.Create(Framework.LocalizationManager.Get("Outputs"), ["reportHeader"]);
        //        this.menuDiv = Framework.Form.TextElement.Create("");
        //        this.menuDiv.HtmlElement.style.marginBottom = "30px";
        //        menuDiv.Append(this.menuDiv.HtmlElement);
        //        this.reportDiv.HtmlElement.appendChild(menuDiv.HtmlElement);

        //        this.outputsDiv = Framework.Form.TextElement.Create("");
        //        this.reportDiv.Append(this.outputsDiv);

        //        //TODO : date, warnings...

        //        this.reportDiv.Append(this.getNewAnalysisButton());

        //        this.render();
        //    }

        //    public get ReportDiv() {
        //        return this.reportDiv;
        //    }

        //    public get Functions() {
        //        return this.functions;
        //    }

        //    private getFunctions(): Framework.DataReport.Function[] {
        //        // TODO : conditionnel au type de données et à l'applicabilité
        //        // Ajout des fonctions disponibles en fonction du type de données et des données elles même
        //        let functions: Framework.DataReport.Function[] = [];
        //        //if (Models.Data.GetType(this.datasetSummary.ListData[0]) == "Profile") {
        //        //    functions.push({ IsSelected: false, Label: "Pivot", Name: "Pivot", Parameters: new Framework.DataReport.FunctionParameter("Pivot", "Pivot") });
        //        //    functions.push({ IsSelected: false, Label: "BarplotByProduct", Name: "Barplot", Parameters: new Framework.DataReport.BarplotParameter("Barplot", "Barplot", "ProductCode", "AttributeCode", "") });
        //        //    functions.push({ IsSelected: false, Label: "BarplotByAttribute", Name: "Barplot", Parameters: new Framework.DataReport.BarplotParameter("Barplot", "Barplot", "AttributeCode", "ProductCode", "") });
        //        //    functions.push({ IsSelected: false, Label: "BoxplotByProduct", Name: "Boxplot", Parameters: new Framework.DataReport.BoxplotParameter("Barplot", "Barplot", "ProductCode", "AttributeCode") });
        //        //    functions.push({ IsSelected: false, Label: "BoxplotByAttribute", Name: "Boxplot", Parameters: new Framework.DataReport.BoxplotParameter("Barplot", "Barplot", "AttributeCode", "ProductCode") });
        //        //    //functions.push({ IsSelected: false, Label: "RadarplotByProduct", Name: "Radarplot", Parameters: { Unit: "ProductCode", Group: "AtributeCode" } });
        //        //    //functions.push({ IsSelected: false, Label: "RadarplotByAttribute", Name: "Radarplot", Parameters: { Unit: "AttributeCode", Group: "ProductCode" } });
        //        //    //functions.push({ IsSelected: false, Label: "HistogramByProduct", Name: "Histogram", Parameters: { Unit: "AttributeCode", Group: "ProductCode" } });
        //        //    //functions.push({ IsSelected: false, Label: "HistogramByAttribute", Name: "Histogram", Parameters: { Unit: "AttributeCode", Group: "ProductCode" } });
        //        //    functions.push({ IsSelected: false, Label: "ANOVA", Name: "ANOVA", Parameters: new Framework.DataReport.ANOVAParameter() });
        //        //    //functions.push({ IsSelected: true, Label: "FlashTable", Name: "FlashTable", Parameters: { ComparisonVs: "GMean", ReferenceProduct: "", SimilarityIndice: "Pearson", ClusteringMethod: "Complete", ContrastTestAlpha: 0.1, MinimumProportonOfExplainedVariance: 0.5, VisualizationOfCOntrasts: "" } });
        //        //    //functions.push({ IsSelected: true, Label: "CAPTable", Name: "CAPTable", Parameters: { Model: "Subject+Product+Interaction", RandomEffects: "SubjectCode", CalculationMode: "OLS", LSMeansAdjustment: "Scheffe", LSMeansAlpha: 0.05, Columns: ["Groups", "GMean", "Sd", "F", "p", "RMSE", "VarTest", "NormalityTest", "RD", "HSD"], HomoscedasticityTest: "", NormalityTest: "", RowOrder: "" } });
        //        //    //functions.push({ IsSelected: false, Label: "PCA", Name: "PCA", Parameters: Framework.D3.PCAParameter.Get({ Name: "PCA", Title: "PCA", Option: "Covariance", Plot: "DistanceBiplot", NDim: 2, Ellipses: "Barycentric", EllipsesCalculationMode: "Chi2", EllipsesConfidenceLevel: 0.9, SignificantAttributes: false, AttributeSelectionAlpha: 0.15 }) });

        //        //    functions.push({ IsSelected: true, Label: "CVA", Name: "CVA", Parameters: new Framework.DataReport.CVAParameter() });
        //        //}
        //        return functions;
        //    }

        //    public ShowModal() {

        //        let saveHTMLBtn = Framework.Form.Button.Create(() => { return true; }, () => {
        //            //TODO
        //        }, '<i class="fas fa-file-code"></i>', ["btnCircle"], Framework.LocalizationManager.Get("SaveAsHTML"));

        //        let savePPTBtn = Framework.Form.Button.Create(() => { return true; }, () => {
        //            //TODO
        //        }, '<i class="fas fa-file-powerpoint"></i>', ["btnCircle"], Framework.LocalizationManager.Get("SaveAsPPT"));

        //        let savePDFBtn = Framework.Form.Button.Create(() => { return true; }, () => {
        //            //TODO
        //            //var doc = new jsPDF();
        //            //var specialElementHandlers = {
        //            //    '#editor': function (element, renderer) {
        //            //        return true;
        //            //    }
        //            //};
        //            //doc.fromHTML($(this.reportDiv.HtmlElement).html(), 15, 15, {
        //            //    'width': 170,
        //            //    'elementHandlers': specialElementHandlers
        //            //});
        //            //doc.save('sample-file.pdf');

        //        }, '<i class="fas fa-file-pdf"></i>', ["btnCircle"], Framework.LocalizationManager.Get("SaveAsPDF"));

        //        let printBtn = Framework.Form.Button.Create(() => { return true; }, () => {

        //            //TODO : CSS + suppression des éléments (boutons, ...)

        //            var mywindow = window.open('', 'PRINT', 'height=400,width=600');

        //            mywindow.document.write('<html><head><title>' + document.title + '</title>');
        //            mywindow.document.write('</head><body >');
        //            mywindow.document.write('<h1>' + document.title + '</h1>');
        //            mywindow.document.write(this.reportDiv.HtmlElement.innerHTML);
        //            mywindow.document.write('</body></html>');

        //            mywindow.document.close(); // necessary for IE >= 10
        //            mywindow.focus(); // necessary for IE >= 10*/

        //            mywindow.print();
        //            mywindow.close();

        //            return true;
        //        }, '<i class="fas fa-print"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Print"));

        //        let saveAsTemplateBtn = Framework.Form.Button.Create(() => { return true; }, () => {
        //            //TODO
        //        }, '<i class="fas fa-heart"></i>', ["btnCircle"], Framework.LocalizationManager.Get("SaveAsTemplate"));

        //        let exitBtn = Framework.Form.Button.Create(() => { return true; }, () => {
        //            mw.Close();
        //        }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Close"));

        //        let mw = Framework.Modal.Custom(this.reportDiv.HtmlElement, Framework.LocalizationManager.Get("Report"), [saveHTMLBtn, savePPTBtn, savePDFBtn, printBtn, saveAsTemplateBtn, exitBtn], "95vh", "80vw", true);
        //        //TODO mw.SetHelpFunction();
        //        mw.show();
        //    }

        //    private render() {
        //        let self = this;
        //        this.functions.filter((x) => { return x.IsSelected == true }).forEach((f) => {
        //            self.executeFunction(f);
        //        });

        //    }

        //    private executeFunction(f: Framework.DataReport.Function) {
        //        let self = this;

        //        if (f.Name == "Pivot") {
        //            self.AddPivot();
        //        }
        //        if (f.Name == "Barplot") {
        //            self.AddBarplots(<Framework.DataReport.BarplotParameter>f.Parameters);
        //        }
        //        if (f.Name == "Boxplot") {
        //            self.AddBoxplots(<Framework.DataReport.BoxplotParameter>f.Parameters);
        //        }
        //        //if (f.Name == "PCA") {
        //        //    self.AddPCA(<Framework.DataReport.PCAParameter>f.Parameters);
        //        //}
        //        if (f.Name == "CVA") {
        //            self.AddCVA(<Framework.DataReport.CVAParameter>f.Parameters);
        //        }
        //        if (f.Name == "ANOVA") {
        //            self.AddANOVA(<Framework.DataReport.ANOVAParameter>f.Parameters);
        //        }

        //    }

        //    private runRScript(output: Output, functionAsText: string, onSuccess: (json: string) => void) {
        //        let self = this;

        //        output.HideOuterDiv();
        //        output.ShowProgress();

        //        this.rServer.Run(functionAsText, () => {
        //        }, (json) => {
        //            output.ShowOuterDiv();
        //            output.HideProgress();
        //            onSuccess(json);
        //        }, (error: string) => {
        //            output.ShowError(error);
        //        });
        //    }

        //    public AddANOVA(p: Framework.DataReport.ANOVAParameter) {
        //        let self = this;
        //        let res = new Framework.DataReport.ANOVA(this.datasetSummary, p, "ANOVA", "Subanova");
        //        //res.SetTitle("ANOVA");
        //        //res.SetSubtitle("sub anova");//TODO : parameters

        //        let table: Framework.Form.Table<any>;

        //        let onChange = (mustReload: boolean) => {
        //            if (mustReload == true) {
        //                self.runRScript(output, res.GetScript(), (json: string) => {
        //                    table = res.GetTable(JSON.parse(json)[0]);
        //                });
        //            } else {
        //                table = res.GetTable(table.ListData);
        //            }
        //        };

        //        let output = this.addOutput("ANOVA", res, p.GetParameters(onChange));
        //        onChange(true);
        //    }

        //    public AddCVA(p: Framework.DataReport.CVAParameter) {
        //        let self = this;

        //        let axes = [];
        //        for (let i = 1; i <= this.datasetSummary.Products.length; i++) {
        //            axes.push(i);
        //        }

        //        let comb = Maths.Combinations(axes, 2);

        //        p.AxesCombinations = [];
        //        comb.forEach((c) => {
        //            p.AxesCombinations.push(c[0] + ", " + c[1]);
        //        });

        //        let cvaPlot = new Framework.DataReport.Plot.CVA(this.datasetSummary, p, "CVA", "Sub cva");
        //        let hotellingHTMLTable = new Framework.DataReport.HTMLTable("HotellingTable", "");

        //        let onChange = (mustReload: boolean) => {
        //            if (mustReload == true) {
        //                self.runRScript(output1, cvaPlot.GetScript(), (json: string) => {
        //                    cvaPlot.Render(JSON.parse(json));
        //                    cvaPlot.Table.Render(hotellingHTMLTable.ContentDiv);
        //                    output2.DivWithTitleAndSubtitle.SetTitle(Framework.LocalizationManager.Get("HotellingTable"));
        //                    output2.DivWithTitleAndSubtitle.SetSubtitle("p-value <= " + Maths.Round(1 - p.EllipsesConfidenceLevel, 2) + " (bold cells): Significant difference between products on NBDIMSIG.");
        //                });
        //            } else {
        //                cvaPlot.Render();
        //            }
        //        };

        //        let output1 = this.addOutput("CVA", cvaPlot, p.GetParameters(onChange));
        //        let output2 = this.addOutput("HotellingTable", hotellingHTMLTable, []);

        //        onChange(true);
        //    }

        //    //public AddPCA(p: Framework.DataReport.PCAParameter) {
        //    //    let res = new Framework.DataReport.Plot.PCA(this.datasetSummary.ListData, p, this.rServer);
        //    //    this.addOutput("PCA", res, p.GetParameters())
        //    //}

        //    public AddPivot() {
        //        let res = new Framework.DataReport.Pivot(this.datasetSummary, Framework.LocalizationManager.Get("Pivot"), "");
        //        this.addOutput(Framework.LocalizationManager.Get("Pivot"), res, []);
        //    }

        //    //public AddBoxplots(p: Framework.DataReport.BoxplotParameter) {
        //    //    let self = this;
        //    //    let units = Framework.Array.Unique(self.datasetSummary.ListData.map((x: Models.Data) => { return x[p.Unit] }));
        //    //    units.forEach((code) => {
        //    //        let sel = self.datasetSummary.ListData.filter((x: Models.Data) => { return x[p.Unit] == code }).map((x: Models.Data) => { return { Score: x.Score, Group: x[p.Group] } });
        //    //        let groups = [];
        //    //        let box = new Framework.DataReport.Plot.BoxPlot("Test boxplot", 600, 600, code, "Sub boxplot", "Product", "Score", sel, groups);
        //    //        self.addOutput("Boxplot " + code, box, p.GetParameters(() => { }))
        //    //    });
        //    //}

        //    //public AddBarplots(p: Framework.DataReport.BarplotParameter) {
        //    //    //TODO : orientation
        //    //    let self = this;
        //    //    let units = Framework.Array.Unique(self.datasetSummary.ListData.map((x: Models.Data) => { return x[p.Unit] })).sort(function (b, a) {
        //    //        if (b < a) return -1;
        //    //        if (b > a) return 1;
        //    //        return 0;
        //    //    });
        //    //    units.forEach((code) => {
        //    //        let sel = self.datasetSummary.ListData.filter((x: Models.Data) => { return x[p.Unit] == code }).map((x: Models.Data) => { return { Score: x.Score, Group: x[p.Group] } });
        //    //        let groups = [];
        //    //        let box = new Framework.DataReport.Plot.BarPlot("Test barplot", 600, 600, code, "Sub barplot", "Product", "Score", sel, groups, p.Bars);
        //    //        self.addOutput("Barplot " + code, box, p.GetParameters(() => { }))
        //    //    });
        //    //}

        //    private addOutput(header: string, htmlElement: DivWithTitleAndSubtitle, properties: Framework.Form.PropertyEditor[]): Output {

        //        let self = this;

        //        let output = new Output(header, htmlElement, (id: string) => {
        //            let elt = document.getElementById("Menu" + id);
        //            self.menuDiv.HtmlElement.removeChild(elt);
        //        }, properties);
        //        this.outputsDiv.Append(output.OuterDiv);

        //        // Ajout dans le menu
        //        let menuDivItem = Framework.Form.TextElement.Create(header);
        //        menuDivItem.HtmlElement.id = "Menu" + output.ID;
        //        menuDivItem.HtmlElement.onclick = () => {
        //            location.hash = "#" + output.ID;
        //        };
        //        this.menuDiv.Append(menuDivItem);

        //        return output;

        //        //TODO : gestion des options
        //    }

        //    private getNewAnalysisButton() {
        //        let self = this;

        //        let buttonsDiv = Framework.Form.TextElement.Create("");

        //        this.functions.forEach((x) => {
        //            let b = Framework.Form.Button.Create(() => { return true; }, () => {
        //                self.executeFunction(x);
        //                mw.Close();
        //            }, Framework.LocalizationManager.Get(x.Label), []);
        //            buttonsDiv.Append(b);
        //        });

        //        let mw: Framework.Modal.AlertModal;

        //        let button = Framework.Form.Button.Create(() => { return true; }, () => {
        //            mw = Framework.Modal.Alert("Analysis", buttonsDiv.HtmlElement);
        //        }, Framework.LocalizationManager.Get("NewAnalysis"), []);
        //        return button;
        //    }

        //}
    }

    export class Rating {

        //https://antennaio.github.io/jquery-bar-rating/

        private container: HTMLElement;
        private select: HTMLSelectElement;

        public static Render(container: HTMLElement, name: string, min: number = 1, max: number = 5, current: number = undefined, onChange: (x: number, name: string) => void = undefined): Rating {
            container.innerHTML = "";
            let div = document.createElement("div");
            container.appendChild(div);

            let select = document.createElement("select");
            select.name = name;
            div.appendChild(select);

            let option = document.createElement("option");
            option.value = "";
            select.appendChild(option);

            for (let i = min; i <= max; i++) {
                let option = document.createElement("option");
                option.value = "";
                select.appendChild(option);

                let option1 = document.createElement("option");
                option1.value = i.toString();
                if (i == current) {
                    option1.selected = true;
                }
                select.appendChild(option1);
            }

            $(select).barrating({
                theme: 'fontawesome-stars-o',
                initialRating: null,
                allowEmpty: true,
                showValues: false,
                showSelectedRating: true,
                deselectable: false,
                reverse: false,
                readonly: false,
                fastClicks: false,
                hoverState: false,
                silent: false,
                triggerChange: true,
                onSelect: function (value, text, event) {
                    if (typeof (event) !== 'undefined') {
                        // rating was selected by a user
                        onChange(Number(value), select.name);
                    } else {
                        // rating was selected programmatically
                        // by calling `set` method
                    }
                }
            });

            let rating: Rating = new Rating();
            rating.select = select;
            rating.container = container;

            return rating;
        }


        public Set(val: number) {
            $(this.select).barrating('set', val);
        }

        public Clear() {
            $(this.select).barrating('clear');
            $(this.select).barrating('set', '');
        }

        public Disable() {
            $(this.select).barrating('readonly', true);
        }

        public Enable() {
            $(this.select).barrating('readonly', false);
        }
    }

    export class Editor {

        private editor: HTMLDivElement;
        private toolbar: HTMLUListElement;
        //private forecolor: HTMLUListElement;
        //private backcolor: HTMLUListElement;
        private btnBold: HTMLButtonElement;
        private btnItalic: HTMLButtonElement;
        private btnUnderline: HTMLButtonElement;
        private btnStrikeThrough: HTMLButtonElement;
        //private btnJustifyLeft: HTMLButtonElement;
        //private btnJustifyRight: HTMLButtonElement;
        //private btnJustifyCenter: HTMLButtonElement;
        //private btnUnorderedList: HTMLButtonElement;
        //private btnOrderedList: HTMLButtonElement;
        private btnForecolor: HTMLButtonElement;
        private btnBackcolor: HTMLButtonElement;
        //private btnFont: HTMLButtonElement;
        private btnFontSize: HTMLButtonElement;
        //private btnLineHeight: HTMLButtonElement;

        public static Render(container: HTMLElement): Editor {

            container.innerHTML = "";

            let ed: Editor = new Editor();

            let wrapper = document.createElement("div");
            wrapper.classList.add("toolbar-wrapper");

            container.appendChild(wrapper);

            ed.toolbar = document.createElement("ul");
            ed.toolbar.style.display = "block";
            wrapper.appendChild(ed.toolbar);

            let li1 = document.createElement("li");
            li1.style.display = "inline-block";
            ed.btnBold = document.createElement("button");
            ed.btnBold.setAttribute("data-action", "bold");
            ed.btnBold.classList.add("btnEditor");
            ed.btnBold.classList.add("btnBold");
            ed.toolbar.append(li1);
            li1.append(ed.btnBold);

            let li2 = document.createElement("li");
            li2.style.display = "inline-block";
            ed.btnItalic = document.createElement("button");
            ed.btnItalic.setAttribute("data-action", "italic");
            ed.btnItalic.classList.add("btnEditor");
            ed.btnItalic.classList.add("btnItalic");
            ed.toolbar.append(li2);
            li2.append(ed.btnItalic);

            let li3 = document.createElement("li");
            li3.style.display = "inline-block";
            ed.btnUnderline = document.createElement("button");
            ed.btnUnderline.setAttribute("data-action", "underline");
            ed.btnUnderline.classList.add("btnEditor");
            ed.btnUnderline.classList.add("btnUnderline");
            ed.toolbar.append(li3);
            li3.append(ed.btnUnderline);

            let li4 = document.createElement("li");
            li4.style.display = "inline-block";
            ed.btnStrikeThrough = document.createElement("button");
            ed.btnStrikeThrough.setAttribute("data-action", "strikeThrough");
            ed.btnStrikeThrough.classList.add("btnEditor");
            ed.btnStrikeThrough.classList.add("btnStrikeThrough");
            ed.toolbar.append(li4);
            li4.append(ed.btnStrikeThrough);

            //let li5 = document.createElement("li");
            //li5.style.display = "inline-block";
            //ed.btnJustifyLeft = document.createElement("button");
            //ed.btnJustifyLeft.setAttribute("data-action", "justifyleft");
            //ed.btnJustifyLeft.classList.add("btnEditor");
            //ed.btnJustifyLeft.classList.add("btnJustifyLeft");
            //ed.toolbar.append(li5);
            //li5.append(ed.btnJustifyLeft);

            //let li6 = document.createElement("li");
            //li6.style.display = "inline-block";
            //ed.btnJustifyCenter = document.createElement("button");
            //ed.btnJustifyCenter.setAttribute("data-action", "justifycenter");
            //ed.btnJustifyCenter.classList.add("btnEditor");
            //ed.btnJustifyCenter.classList.add("btnJustifyCenter");
            //ed.toolbar.append(li6);
            //li6.append(ed.btnJustifyCenter);

            //let li7 = document.createElement("li");
            //li7.style.display = "inline-block";
            //ed.btnJustifyRight = document.createElement("button");
            //ed.btnJustifyRight.setAttribute("data-action", "justifyright");
            //ed.btnJustifyRight.classList.add("btnEditor");
            //ed.btnJustifyRight.classList.add("btnJustifyRight");
            //ed.toolbar.append(li7);
            //li7.append(ed.btnJustifyRight);

            //let li8 = document.createElement("li");
            //li8.style.display = "inline-block";
            //ed.btnUnorderedList = document.createElement("button");
            //ed.btnUnorderedList.setAttribute("data-action", "insertunorderedlist");
            //ed.btnUnorderedList.classList.add("btnEditor");
            //ed.btnUnorderedList.classList.add("btnUnorderedList");
            //ed.toolbar.append(li8);
            //li8.append(ed.btnUnorderedList);

            //let li9 = document.createElement("li");
            //li9.style.display = "inline-block";
            //ed.btnOrderedList = document.createElement("button");
            //ed.btnOrderedList.setAttribute("data-action", "insertorderedlist");
            //ed.btnOrderedList.classList.add("btnEditor");
            //ed.btnOrderedList.classList.add("btnOrderedList");
            //ed.toolbar.append(li9);
            //li9.append(ed.btnOrderedList);

            let li10 = document.createElement("li");
            li10.style.display = "inline-block";
            //li10.classList.add("popup_editor");
            ed.btnForecolor = document.createElement("button");
            ed.btnForecolor.classList.add("btnEditor");
            ed.btnForecolor.classList.add("btnForecolor");
            ed.toolbar.append(li10);
            li10.append(ed.btnForecolor);
            //ed.forecolor = document.createElement("ul");
            //ed.forecolor.classList.add("submenu_editor");
            //li10.appendChild(ed.forecolor);

            let li11 = document.createElement("li");
            li11.style.display = "inline-block";
            //li11.classList.add("popup_editor");
            ed.btnBackcolor = document.createElement("button");
            ed.btnBackcolor.classList.add("btnEditor");
            ed.btnBackcolor.classList.add("btnBackcolor");
            ed.toolbar.append(li11);
            li11.append(ed.btnBackcolor);
            //ed.backcolor = document.createElement("ul");
            //ed.backcolor.classList.add("submenu_editor");
            //li11.appendChild(ed.backcolor);

            //let li12 = document.createElement("li");
            //li12.style.display = "inline-block";           
            //ed.btnFont = document.createElement("button");
            //ed.btnFont.classList.add("btnEditor");
            //ed.btnFont.classList.add("btnFont");
            //ed.toolbar.append(li12);
            //li12.append(ed.btnFont);

            let li13 = document.createElement("li");
            li13.style.display = "inline-block";
            ed.btnFontSize = document.createElement("button");
            ed.btnFontSize.classList.add("btnEditor");
            ed.btnFontSize.classList.add("btnFontSize");
            ed.toolbar.append(li13);
            li13.append(ed.btnFontSize);

            //let li14 = document.createElement("li");
            //li14.style.display = "inline-block";
            //ed.btnLineHeight = document.createElement("button");
            //ed.btnLineHeight.classList.add("btnEditor");
            //ed.btnLineHeight.classList.add("btnLineHeight");
            //ed.toolbar.append(li14);
            //li14.append(ed.btnLineHeight);

            //let li12 = document.createElement("li");
            //li12.style.display = "inline-block";
            //ed.toolbar.append(li12);
            //let select1 = document.createElement("select");
            //li12.append(select1);
            //select1.setAttribute("data-action", "fontName");
            //let o1: HTMLOptionElement = new Option("Modern", '"Helvetica Neue", Helvetica, Arial, sans-serif');
            //select1.appendChild(o1);
            //let o2: HTMLOptionElement = new Option("Classic Wide", '"bookman old style", "new york", times, serif');
            //select1.appendChild(o2);
            //let o3: HTMLOptionElement = new Option("Courier New", '"courier new", courier, monaco, monospace, sans-serif');
            //select1.appendChild(o3);
            //let o4: HTMLOptionElement = new Option("Garamond", 'garamond, "new york", times, serif');
            //select1.appendChild(o4);
            //let o5: HTMLOptionElement = new Option("Lucida Console", '"lucida console", sans-serif');
            //select1.appendChild(o5);

            //let li13 = document.createElement("li");
            //li13.style.display = "inline-block";
            //ed.toolbar.append(li13);
            //let select2 = document.createElement("select");
            //li13.append(select2);
            //select2.setAttribute("data-action", "fontSize");
            //let o6: HTMLOptionElement = new Option("1", 'Tiny');
            //select2.appendChild(o6);
            //let o7: HTMLOptionElement = new Option("2", 'Small');
            //select2.appendChild(o7);
            //let o8: HTMLOptionElement = new Option("3", 'Medium');
            //select2.appendChild(o8);
            //let o9: HTMLOptionElement = new Option("6", 'Large');
            //select2.appendChild(o9);
            //let o10: HTMLOptionElement = new Option("7", 'X-Large');
            //select2.appendChild(o10);

            ed.bindEventHandlers();
            ed.Disable();

            return ed;

            //<div class="toolbar-wrapper">
            //               <ul id="toolbar">
            //                   <li><button data-action="bold">Bold</button></li>
            //                   <li><button data-action="italic">Italic</button></li>
            //                   <li><button data-action="underline">UnderLine</button></li>
            //                   <li><button data-action="strikeThrough">Strike</button></li>
            //                   <li><button data-action="justifyleft">Left</button></li>
            //                   <li><button data-action="justifycenter">Center</button></li>
            //                   <li><button data-action="justifyright">Right</button></li>
            //                   <li><button data-action="insertunorderedlist">Bullet</button></li>
            //                   <li><button data-action="insertorderedlist">List</button></li>
            //                   <li class="popup">
            //                       <button>ForeColor</button>
            //                       <ul class="submenu" id="foreColor">
            //                       </ul>
            //                   </li>
            //                   <li class="popup">
            //                       <button>Highlight</button>
            //                       <ul class="submenu" id="backColor">
            //                       </ul>
            //                   </li>
            //                   <li>
            //                       <select data-action="fontName" id="fontName">
            //                           <option value='"Helvetica Neue", Helvetica, Arial, sans-serif'>Modern</option>
            //                           <option value='"bookman old style", "new york", times, serif'>Classic Wide</option>
            //                           <option value='"courier new", courier, monaco, monospace, sans-serif'>Courier New</option>
            //                           <option value='garamond, "new york", times, serif'>Garamond</option>
            //                           <option value='"lucida console", sans-serif'>Lucida Console</option>
            //                       </select>
            //                   </li>
            //                   <li>
            //                       <select data-action="fontSize" id="fontSize">
            //                           <option value="1">Tiny</option>
            //                           <option value="2">Small</option>
            //                           <option value="3">Medium</option>
            //                           <option value="6">Large</option>
            //                           <option value="7">X-Large</option>
            //                       </select>
            //                   </li>
            //               </ul>
            //           </div>
        }

        public Disable() {

            this.btnBold.classList.remove('btnActive');
            this.btnBold.disabled = true;
            this.btnItalic.classList.remove('btnActive');
            this.btnItalic.disabled = true;
            this.btnUnderline.classList.remove('btnActive');
            this.btnUnderline.disabled = true;
            this.btnStrikeThrough.classList.remove('btnActive');
            this.btnStrikeThrough.disabled = true;

            //this.btnJustifyLeft.classList.remove('btnActive');
            //this.btnJustifyRight.classList.remove('btnActive');
            //this.btnJustifyCenter.classList.remove('btnActive');
            //this.btnUnorderedList.classList.remove('btnActive');
            //this.btnOrderedList.classList.remove('btnActive');
            this.btnForecolor.classList.remove('btnActive');
            this.btnBackcolor.classList.remove('btnActive');
            //this.btnJustifyLeft.disabled = true;
            //this.btnJustifyRight.disabled = true;
            //this.btnJustifyCenter.disabled = true;
            //this.btnUnorderedList.disabled = true;
            //this.btnOrderedList.disabled = true;
            this.btnForecolor.disabled = true;
            this.btnBackcolor.disabled = true;
            this.btnForecolor.style.background = "gray";
            this.btnBackcolor.style.background = "gray";

            //this.btnFont.disabled = true;
            this.btnFontSize.disabled = true;
            //this.btnLineHeight.disabled = true;
        }

        public Set(editor: HTMLDivElement, onChanged: (text: string) => void, text: boolean = false) {

            this.btnBold.disabled = false;
            this.btnItalic.disabled = false;
            this.btnUnderline.disabled = false;
            this.btnStrikeThrough.disabled = false;
            //this.btnJustifyLeft.disabled = false;
            //this.btnJustifyRight.disabled = false;
            //this.btnJustifyCenter.disabled = false;
            //this.btnUnorderedList.disabled = false;
            //this.btnOrderedList.disabled = false;
            this.btnForecolor.disabled = false;
            this.btnBackcolor.disabled = false;
            //this.btnFont.disabled = false;
            this.btnFontSize.disabled = false;
            //this.btnLineHeight.disabled = false;



            if (editor.getAttribute('listener') !== 'true') {
                editor.addEventListener("paste", function (e) {
                    // cancel paste
                    e.preventDefault();

                    // get text representation of clipboard
                    var text = e.clipboardData.getData('text/plain');

                    // insert text manually
                    document.execCommand("insertHTML", false, text);

                    return false;
                });
                editor.addEventListener('keyup', function (e) {

                    // Changement de texte
                    if (onChanged) {
                        if (text == false) {
                            onChanged(editor.innerHTML);
                        } else {
                            onChanged(editor.textContent);
                        }
                    }
                }, false);
                editor.addEventListener('DOMNodeInserted', function (e) {
                    // Changement de style
                    if (text == false) {
                        onChanged(editor.innerHTML);
                    } else {
                        onChanged(editor.textContent);
                    }
                }, false);
                editor.addEventListener('DOMNodeRemoved', function (e) {
                    // Changement de style
                    if (text == false) {
                        onChanged(editor.innerHTML);
                    } else {
                        onChanged(editor.textContent);
                    }
                }, false);
                editor.setAttribute('listener', 'true');
            }
            this.editor = editor;
        }

        private getToolbarState() {
            return {
                foreColor: this.RGBToHex(document.queryCommandValue("ForeColor")),
                backColor: this.getBackColor() || document.queryCommandValue("backcolor"),
                bold: document.queryCommandState("bold"),
                italic: document.queryCommandState("italic"),
                fontName: document.queryCommandValue("fontName"),
                fontSize: document.queryCommandValue("fontSize"),
                underline: document.queryCommandState("Underline"),
                strikeThrough: document.queryCommandState("strikeThrough"),
                insertunorderedlist: document.queryCommandState("insertunorderedlist"),
                insertorderedlist: document.queryCommandState("insertorderedlist"),
                justifyleft: document.queryCommandState("justifyleft"),
                justifycenter: document.queryCommandState("justifycenter"),
                justifyright: document.queryCommandState("justifyright"),
            };
        }

        private getBackColor() {
            var node = document.getSelection().focusNode;

            var isNonDefault = function (c) { return c && c !== 'transparent'; }

            // If TEXTNODE set to parentNode
            if (node.nodeType == 3) {
                node = node.parentNode;
            }

            while (node && node !== this.editor) {
                var tempColor = (<any>node).style && (<any>node).style.backgroundColor;

                if (isNonDefault(tempColor)) {
                    return tempColor;
                }

                node = node.parentNode;
            }

            return 'transparent';
        }

        private focusEditor() {
            if (this.editor) {
                this.editor.focus();
            }
        }

        private setColorPicker(btnColor: HTMLButtonElement, command: string) {

            var state = this.getToolbarState();
            let div = document.createElement("div");
            if (command == "ForeColor") {
                btnColor.style.background = state.foreColor;
            }
            if (command == "BackColor") {
                if (state.backColor == "transparent") {
                    btnColor.style.background = "white";
                } else {
                    btnColor.style.background = state.backColor;
                }
            }

            let colors = Framework.Color.BasePalette.map(x => x.Hex);
            colors.forEach(col => {
                let btn = document.createElement("button");
                btn.onclick = (e => {
                    e.stopPropagation();
                    document.execCommand(command, false, col);
                    btnColor.style.background = col;
                });
                btn.style.border = "0";
                btn.style.background = col;
                btn.style.height = "24px";
                btn.style.width = "24px";
                btn.style.margin = "1px";
                btn.title = col;
                div.appendChild(btn);
            });

            Framework.Popup.Create(btnColor, div, "top", "click")
        }

        private setFontPicker() {
            let self = this;
            var state = this.getToolbarState();
            let div = document.createElement("div");

            let fonts = ["Arial", "Calibri", "Comic Sans MS", "Courier New", "Georgia", "Helvetica", "Palatino", "Times New Roman", "Trebuchet MS", "Verdana"];
            fonts.forEach(font => {
                let btn = document.createElement("button");
                btn.onclick = (e => {
                    e.stopPropagation();
                    document.execCommand("fontName", false, font);
                });
                btn.style.border = "0";
                btn.style.background = "transparent";
                btn.style.color = "white";
                btn.style.display = "block";

                let decoration = "none";
                //if (font == state.fontName) {
                //    decoration = "underline";
                //}

                btn.innerHTML = "<span style=\"font-family:" + font + " ; text-decoration:" + decoration + "\">" + font + "</span>";
                div.appendChild(btn);



            });

            //Framework.Popup.Create(this.btnFont, div, "top", "click")
        }

        private setFontSizePicker() {
            let self = this;
            var state = this.getToolbarState();
            let div = document.createElement("div");

            let fonts = [1, 2, 3, 4, 5, 6];
            fonts.forEach(font => {
                let btn = document.createElement("button");
                btn.onclick = (e => {
                    e.stopPropagation();
                    //self.setFontSize(Number(font));
                    //Framework.Selection.SetLineHeight(Number(font));                    
                    document.execCommand("fontSize", false, font.toString());
                });
                btn.style.border = "0";
                btn.style.background = "transparent";
                btn.style.color = "white";
                btn.style.display = "block";
                let text = "";
                if (font == 1) {
                    text = "50%"
                }
                if (font == 2) {
                    text = "75%"
                }
                if (font == 3) {
                    text = "100%"
                }
                if (font == 4) {
                    text = "125%"
                }
                if (font == 5) {
                    text = "150%"
                }
                if (font == 6) {
                    text = "200%"
                }
                btn.innerHTML = "<span>" + text + "</span>";
                div.appendChild(btn);
            });

            Framework.Popup.Create(this.btnFontSize, div, "top", "click")
        }

        private setFontSize(fontSize: number) {

            var state = this.getToolbarState();

            var sel, range;
            if (window.getSelection) {
                range = window.getSelection().getRangeAt(0);
                var content = range.extractContents();
                var span = document.createElement('SPAN');
                //span.setAttribute("style", " font-size: " + fontSize + "pt !important;");
                //span.setAttribute("style", " background: " + state.backColor + ";");
                //if (state.bold) {
                //    span.setAttribute("style", " font-weight: bold;");
                //}
                //span.setAttribute("style", " font-family: " + state.fontName + ";");
                ////span.setAttribute("style", " color: " + state.foreColor + ";");

                //if (state.italic) {
                //    span.setAttribute("style", " font-style: italic;");
                //}

                //if (state.underline) {
                //    span.setAttribute("style", " text-decoration: underline;");
                //}

                span.appendChild(content);
                var htmlContent = span.innerHTML;
                htmlContent = htmlContent.replace(/<\/?span[^>]*>/g, "");
                htmlContent = htmlContent.replace(/font-size:[^;]+/g, '');
                htmlContent = htmlContent.replace(/<font/g, "<span").replace(/<\/font>/g, "</span>");

                if (span.innerHTML.toString() == "")
                    htmlContent = htmlContent + " ";

                var cursorPosition = htmlContent.length;
                span.innerHTML = htmlContent;
                span.setAttribute("style", " font-size: " + fontSize + "pt !important;");

                range.insertNode(span);

                sel = window.getSelection();
                range = sel.getRangeAt(0);
                range.collapse(true);
                var lastChildElement = span.childNodes.length - 1;
                if (cursorPosition == 1) {
                    range.setStart(span.childNodes[0], 1);
                }
                else {
                    range.setEndAfter(span);
                }
                sel.removeAllRanges();
                sel.addRange(range);
            }

        }

        private setLineHeightPicker() {
            let self = this;
            var state = this.getToolbarState();
            let div = document.createElement("div");

            let fonts = [10, 20, 25, 30, 35, 40, 45, 50, 55, 60];
            fonts.forEach(font => {
                let btn = document.createElement("button");
                btn.onclick = (e => {
                    e.stopPropagation();
                    Framework.Selection.SetLineHeight(Number(font));
                });
                btn.style.border = "0";
                btn.style.background = "transparent";
                btn.style.color = "white";
                btn.style.display = "block";
                btn.innerHTML = "<span>" + font + "px</span>";
                div.appendChild(btn);
            });

            //Framework.Popup.Create(this.btnLineHeight, div, "top", "click")
        }

        private updateToolbar(ed: Editor) {
            var focusNode = document.getSelection().focusNode;

            if (ed.editor == undefined || !ed.editor.contains(focusNode)) {
                return;
            }

            var state = ed.getToolbarState();

            //let div = document.createElement("div");
            //ed.btnForecolor.style.background = state.foreColor;
            //let colors = ["#00aaaa","#000000","#ffffff","pink"];
            //colors.forEach(col => {
            //    let btn = document.createElement("button");
            //    btn.onclick = (e => {
            //        e.stopPropagation();
            //        document.execCommand("ForeColor", false, col);
            //        ed.btnForecolor.style.background = col;
            //    });
            //    btn.style.border = "1px solid gray";
            //    btn.style.background = col;
            //    btn.style.height = "16px";
            //    btn.style.width = "16px";
            //    btn.title = col;
            //    div.appendChild(btn);
            //});

            //Framework.Popup.Create(ed.btnForecolor, div, "top", "hover")

            this.setColorPicker(ed.btnForecolor, "ForeColor");
            this.setColorPicker(ed.btnBackcolor, "BackColor");
            //this.setFontPicker();
            this.setFontSizePicker();
            //this.setLineHeightPicker();

            //log(state);
            ed.updateButtonState(state);
        }

        //private updatePopupValue(key, value) {
        //    var activeBtn = document.querySelector('#' + key + ' button.active');
        //    var btn = document.querySelector('#' + key + '  [data-value="' + value + '"]');

        //    if (!btn) {
        //        return;
        //    }

        //    if (activeBtn) {
        //        activeBtn.classList.remove('active');
        //    }

        //    btn.classList.add('active');
        //}

        private updateButtonState(config) {
            Object.keys(config).forEach(k => {

                //if (k == 'foreColor' || k == 'backColor') {

                //    this.updatePopupValue(k, config[k]);

                //    return;
                //}

                var el = document.querySelector('[data-action="' + k + '"]');

                if (!el) {
                    return;
                }

                //if (el.tagName == 'SELECT') {
                //    (<any>el).value = config[k];
                //}

                if (config[k] == true) {
                    el.classList.add('btnActive');
                } else {
                    el.classList.remove('btnActive');
                }
            });
        }

        private RGBToHex(rgb) {
            if (!rgb || rgb.indexOf('rgb(') < 0) {
                return rgb;
            }

            var sep = rgb.indexOf(",") > -1 ? "," : " ";
            var colors = rgb.substr(4).split(")")[0].split(sep);
            var r = (+colors[0]).toString(16);
            var g = (+colors[1]).toString(16);
            var b = (+colors[2]).toString(16);

            r = `0${r}`.slice(-2);
            g = `0${g}`.slice(-2);
            b = `0${b}`.slice(-2);

            return "#" + r + g + b;
        }

        private onAction(e, ed: Editor) {


            var value = null;
            var target = e.target;

            if (target.tagName != 'BUTTON') {

                return;
            }

            var action = target.getAttribute('data-action');

            if (action == 'foreColor' || action == "backColor") {
                value = target.getAttribute('data-value');
            }

            document.execCommand(action, false, value);

            ed.updateToolbar(ed);
            ed.focusEditor();
        }

        private onChange(e, ed: Editor) {
            var value = e.target.value;
            var action = e.target.getAttribute('data-action');

            document.execCommand(action, false, value);

            ed.updateToolbar(ed);
            ed.focusEditor();
        }

        private bindEventHandlers() {

            let self = this;

            var dropDowns = [].slice.call(document.getElementsByTagName('select'));

            this.toolbar.addEventListener("click", (e) => { self.onAction(e, self) });
            dropDowns.forEach(d => d.addEventListener("change", (e) => { self.onChange(e, self) }));
            document.addEventListener("selectionchange", () => { self.updateToolbar(self) });
        }

        //private initForeColor() {
        //    var colors = [
        //        "#9d1811",
        //        "#e4ac64",
        //        "#5b8828",
        //        "#440062",
        //        "#ffffff",
        //        "#000000"
        //    ];

        //    var fragment = document.createDocumentFragment();

        //    colors.forEach(color => {
        //        var li = document.createElement('li');
        //        var btn = document.createElement('button');

        //        btn.style.backgroundColor = color;
        //        btn.setAttribute("data-action", "foreColor");
        //        btn.setAttribute("data-value", color);

        //        if (color === '#ffffff') {
        //            btn.setAttribute('data-color', 'white');
        //        }

        //        li.appendChild(btn);
        //        fragment.appendChild(li);
        //    });

        //    this.forecolor.appendChild(fragment);
        //}

        //private initBackColor() {
        //    var colors = [
        //        "rgb(157, 24, 17)",
        //        "rgb(164, 96, 22)",
        //        "rgb(91, 136, 40)",
        //        "rgb(253, 239, 43)",
        //        "rgb(112, 172, 237)",
        //        "rgb(255, 255, 255)",
        //    ];

        //    var fragment = document.createDocumentFragment();

        //    colors.forEach(color => {
        //        var li = document.createElement('li');
        //        var btn = document.createElement('button');

        //        btn.style.backgroundColor = color;
        //        btn.setAttribute("data-value", color);
        //        btn.setAttribute("data-action", "backColor");

        //        if (color === 'rgb(255, 255, 255)') {
        //            btn.setAttribute('data-color', 'white');
        //        }

        //        li.appendChild(btn);
        //        fragment.appendChild(li);
        //    });

        //    this.backcolor.appendChild(fragment);
        //}

        //private log(state) {
        //    var output = "<pre>{" + "\n"
        //    var debug = document.getElementById("debug");

        //    Object.keys(state).forEach(function (k) {
        //        output += '' + k + ':' + state[k] + ', \n';
        //    });

        //    output += "}</pre>";

        //    debug.innerHTML = output;
        //}

        //private init() {
        //    //this.initForeColor();
        //    //this.initBackColor();
        //    this.bindEventHandlers();

        //    //document.body.style.fontSize = "7";
        //    //document.body.style.fontFamily = '"Helvetica Neue",  Helvetica, Arial, sans-serif';
        //}

    }
}

