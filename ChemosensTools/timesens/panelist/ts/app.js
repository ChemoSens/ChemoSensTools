var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Panelist;
(function (Panelist) {
    var App = /** @class */ (function (_super) {
        __extends(App, _super);
        function App() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.currentViewContainerName = "content";
            // Paramètres d'URL
            _this.serverCode = ""; // Code serveur du formulaire
            _this.subjectCode = ""; // Code sujet du formulaire
            _this.password = ""; // Mot de passe du formulaire              
            _this.startDemoParameter = ""; // Mode démonstration              
            _this.forceLocalProgress = false; // Si true, cela veut dire que le progrès server est plus récent que le progrès local -> Affiche un warning                
            _this.isVirtualKeyboardEnabled = false; // Clavier virtuel activé
            _this.isLocked = false; // Gestion du verrouillage
            _this.isAutoSynchronized = false; // Synchronisation automatique au démarrage
            _this.isInSimulationMode = false;
            _this.isInPanelLeaderMode = false;
            _this.isInScreenshotMode = false;
            _this.screensBySheet = 2;
            return _this;
        }
        App.prototype.onConnectivityChanged = function (isOnline) {
            this.isOnline = isOnline;
        };
        App.prototype.onError = function (error) {
            Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), error);
        };
        App.GetRequirements = function () {
            var requirements = new Framework.ModuleRequirements();
            if (window.location.hostname.indexOf("localhost") > -1) {
                requirements.AppUrl = 'http://localhost:44301/timesens';
                requirements.FrameworkUrl = 'http://localhost:44301/framework';
                requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
            }
            else {
                requirements.AppUrl = 'https://www.chemosenstools.com/timesens';
                requirements.FrameworkUrl = 'https://www.chemosenstools.com/framework';
                requirements.WcfServiceUrl = 'https://www.chemosenstools.com/WebService.svc/';
            }
            requirements.AuthorizedLanguages = ['en', 'fr'];
            requirements.CssFiles = ['/panelist/css/panelist.css'];
            requirements.DefaultLanguage = 'en';
            requirements.DisableGoBack = true;
            requirements.DisableRefresh = true;
            requirements.VersionPath = 'panelist/html/changelog.html';
            requirements.JsFiles = ['/screenreader/models.js', '/screenreader/screenreader.js'];
            requirements.JsonResources = ['/panelist/resources/panelist.json', '/screenreader/resources/screenreader.json'];
            requirements.Recommanded = ["getusermedia", "localstorage", "placeholder", "fileinput", /*"filesystem"*/ , "filereader", "oninput", /*"contains"*/ , "progressbar", "hidden", "classlist", "cssvwunit", "cssvhunit", "cssvalid", "csstransitions", "textshadow", "rgba", /*"cssresize"*/ , "opacity", "mediaqueries", "cssgradients", "fontface", "flexbox", "ellipsis", "checked", "csscalc", "boxsizing", "boxshadow", "borderradius", "bgsizecover", "backgroundsize", "bgpositionxy", "video", "svg", "input", "fullscreen", "audio", "serviceworker", "fetch"];
            requirements.Required = ["atobbtoa", "webworkers", "json", "eventlistener", "cryptography", "blobconstructor"];
            requirements.Extensions = ["DataTable", "Slider", "Crypto", "Zip", "Speech", "Capture", "Offline", "Barcode", "VirtualKeyboard"];
            return requirements;
        };
        App.prototype.start = function (fullScreen) {
            if (fullScreen === void 0) { fullScreen = false; }
            _super.prototype.start.call(this, fullScreen);
            var self = this;
            // Extraction des paramètres de l'URL
            this.serverCode = "";
            this.subjectCode = "";
            this.password = "";
            this.startDemoParameter = "";
            this.isInPanelLeaderMode = false;
            this.isInScreenshotMode = false;
            var language = "";
            var urlParameters = this.queryString;
            if (urlParameters.length > 0) {
                if (urlParameters["startdemo"] != undefined) {
                    this.startDemoParameter = urlParameters["startdemo"];
                }
                if (urlParameters["servercode"] != undefined) {
                    this.serverCode = urlParameters["servercode"];
                }
                if (urlParameters["subjectcode"] != undefined) {
                    this.subjectCode = urlParameters["subjectcode"];
                }
                if (urlParameters["password"] != undefined) {
                    this.password = urlParameters["password"];
                }
                if (urlParameters["panelleader"] != undefined && urlParameters["panelleader"] == "true") {
                    this.isInPanelLeaderMode = true;
                }
                if (urlParameters["screenshot"] != undefined && urlParameters["screenshot"] == "true") {
                    this.isInScreenshotMode = true;
                    if (urlParameters["screensbysheet"] != undefined) {
                        this.screensBySheet = urlParameters["screensbysheet"];
                    }
                }
                if (urlParameters["lang"] != undefined) {
                    language = urlParameters["lang"];
                }
                if (urlParameters["id"] != undefined) {
                    // Lien encodé en base 64
                    var b64 = urlParameters["id"];
                    var parameters = Framework.Browser.GetQueryStringParameters(atob(b64));
                    if (parameters["servercode"] != undefined) {
                        this.serverCode = parameters["servercode"];
                    }
                    if (parameters["subjectcode"] != undefined) {
                        this.subjectCode = parameters["subjectcode"];
                    }
                    if (parameters["password"] != undefined) {
                        this.password = parameters["password"];
                    }
                    if (parameters["panelleader"] != undefined && (parameters["panelleader"] == true || parameters["panelleader"] == "true")) {
                        this.isInPanelLeaderMode = true;
                    }
                    if (parameters["lang"] != undefined) {
                        language = parameters["lang"];
                    }
                }
            }
            if (language != "") {
                // Chargement du language passé en paramètre
                this.changeLanguage(language);
            }
            else {
                // Language mémorisé
                if (Framework.LocalStorage.GetFromLocalStorage("Language") != null) {
                    this.changeLanguage(Framework.LocalStorage.GetFromLocalStorage("Language"));
                }
            }
            // Chargement des paramètres mémorisés
            var isLock = JSON.parse(Framework.LocalStorage.GetFromLocalStorage("IsLock"));
            this.isLocked = isLock != null ? isLock : false;
            var virtualKeyboardEnabled = JSON.parse(Framework.LocalStorage.GetFromLocalStorage("VirtualKeyboardEnabled"));
            this.isVirtualKeyboardEnabled = virtualKeyboardEnabled != null ? virtualKeyboardEnabled : false;
            var autoSynchronization = JSON.parse(Framework.LocalStorage.GetFromLocalStorage("AutoSynchronization"));
            this.isAutoSynchronized = autoSynchronization != null ? autoSynchronization : false;
            if (this.isAutoSynchronized == true) {
                // Synchronisation automatique des sessions non synchronisées
                var localSessions = this.getLocalSessionFromLocalStorage(true);
                this.synchronizeLocalSessions(localSessions, function () {
                    Framework.Modal.Alert(Framework.LocalizationManager.Get("Info"), Framework.LocalizationManager.Get("LocalSessionsSynchronized"));
                });
            }
            this.setFooter();
            // Containers du fichier index.html
            this.headerDiv = document.getElementById("header");
            this.contentDiv = document.getElementById("content");
            this.progressDiv = document.getElementById("progress");
            // Initialisation du clavier virtuel
            if (this.isVirtualKeyboardEnabled == true) {
                Framework.VirtualKeyboard.Enable('.vk');
            }
            if (urlParameters["goto"] == "login") {
                this.showRunFromServerCodeMenu(false, this.serverCode);
                return;
            }
            // Si paramètres d'URL remplis                        
            if (this.startDemoParameter != null && this.startDemoParameter.length > 0) {
                this.startDemo();
                return;
            }
            if ((this.serverCode != null && this.serverCode.length > 1) || this["startfromservercode"] != undefined) {
                Framework.Progress.Show(Framework.LocalizationManager.Get("SearchingSession"));
                if (this.subjectCode != null && this.subjectCode.length > 0) {
                    // Séance avec juge identifié                                
                    this.downloadSubjectSession();
                }
                else {
                    // Séance anonyme (en mode UseExperimentalDesign)                                
                    this.downloadAnonymousSession();
                }
            }
            else {
                // Affichage du menu principal            
                this.showMainMenu();
            }
            //TODO : lien crypté, mode panel leader, mode simulation, lien vers autres pages, test       
        };
        App.prototype.setFooter = function () {
            var self = this;
            this.footerDiv = document.getElementById("footer");
            //this.btnBrowserCompatibility = Framework.Form.ClickableElement.Register("btnBrowserCompatibility", undefined, undefined);
            //this.btnBrowserCompatibilityError = Framework.Form.ClickableElement.Register("btnBrowserCompatibilityError", undefined, () => {
            //    Framework.Modal.Alert(Framework.LocalizationManager.Get("BrowserCompatibilityError"), self.compatibilityCheckResult.MissingRequired.join(', '));  /* TODO :améliorer Panelist.Views.ShowModalBox(Localization.Localize("BrowserCompatibility"), '<iframe src= "html/browsercompatibility.html" style="width:100%;height:100%" ></iframe>');*/
            //});
            //this.btnBrowserCompatibilityIssue = Framework.Form.ClickableElement.Register("btnBrowserCompatibilityIssue", undefined, () => {
            //    Framework.Modal.Alert(Framework.LocalizationManager.Get("BrowserCompatibilityIssue"), self.compatibilityCheckResult.MissingRecommanded.join(', '));  /* TODO :améliorer Panelist.Views.ShowModalBox(Localization.Localize("BrowserCompatibility"), '<iframe src= "html/browsercompatibility.html" style="width:100%;height:100%" ></iframe>');*/
            //});
            this.btnLocalStorage = Framework.Form.ClickableElement.Register("btnLocalStorage", undefined, undefined);
            this.btnInternetConnection = Framework.Form.ClickableElement.Register("btnInternetConnection", undefined, undefined);
            this.btnNoInternetConnection = Framework.Form.ClickableElement.Register("btnNoInternetConnection", undefined, undefined);
            //this.btnInstall = Framework.Form.ClickableElement.Register("btnInstall", undefined, () => {
            //    Framework.Browser.AddBookmark();
            //});
            //this.anchorVersion = Framework.Form.ClickableElement.Register("anchorVersion", undefined, () => {
            //    Framework.Modal.Alert(Framework.LocalizationManager.Get("ChangeLog"), self.changeLog);
            //});
            this.spanVersion = Framework.Form.TextElement.Register("spanVersion", self.Version);
            this.changeLog = self.Changelog;
            // Vérification de la compatibilité
            //if (self.compatibilityCheckResult) {
            //    if (self.compatibilityCheckResult.Type == "full") {
            //        this.btnBrowserCompatibility.Show();
            //    } else if (self.compatibilityCheckResult.Type == "partial") {
            //        this.btnBrowserCompatibilityIssue.Show();
            //        this.btnBrowserCompatibilityIssue.Highlight('top');
            //    } else if (self.compatibilityCheckResult.Type == "notCompatible") {
            //        this.btnBrowserCompatibilityError.Show();
            //        this.btnBrowserCompatibilityError.Highlight('top');
            //    }
            //}
            // Vérification de la connexion
            if (self.IsOnline == true) {
                this.btnInternetConnection.Show();
            }
            else {
                this.btnNoInternetConnection.Show();
                this.btnNoInternetConnection.Highlight('top');
            }
        };
        App.prototype.showView = function (htmlPath, viewModelFactory) {
            var self = this;
            _super.prototype.showView.call(this, htmlPath, viewModelFactory, function (vm) {
                if (htmlPath == "html/ViewScreenReader.html") {
                    self.footerDiv.style.display = "none";
                    self.headerDiv.style.display = "none";
                    self.contentDiv.style.height = "100%";
                    self.contentDiv.style.top = "0";
                }
                else {
                    self.footerDiv.style.display = "block";
                    self.headerDiv.style.display = "block";
                    self.contentDiv.style.height = "65%";
                    self.contentDiv.style.top = "25%";
                }
            });
        };
        // Affiche le menu principal
        App.prototype.showMainMenu = function () {
            var self = this;
            this.showView("html/ViewMenu.html", function () {
                var vm = new ViewModels.MenuViewModel(Framework.Browser.CanUseLocalFile(), self.isLocked);
                vm.ShowRunSessionMenu = function () { self.showRunSessionMenu(); };
                vm.ShowLocalSessionsMenu = function () { self.showLocalSessionsMenu(); };
                vm.ShowSettingsMenu = function () { self.showSettingsMenu(); };
                vm.ShowHelp = function () { self.showHelp(); };
                return vm;
            });
        };
        // Affiche le menu local sessions
        App.prototype.showLocalSessionsMenu = function () {
            var self = this;
            this.showView("html/ViewLocalSessions.html", function () {
                var vm = new ViewModels.LocalSessionsViewModel(self.isOnline);
                vm.ZipLocalSessions = function (progresses) {
                    if (progresses.length > 0) {
                        var zip = new JSZip();
                        for (var i = 0; i < progresses.length; i++) {
                            var subjectseance = new Models.SubjectSeance();
                            var progress = progresses[i];
                            subjectseance.Progress = progress;
                            subjectseance.Subject = new Models.Subject();
                            subjectseance.Subject.Code = progress.CurrentState.SubjectCode; //TODO : récupérer infos sujet
                            var json = JSON.stringify(subjectseance);
                            zip.file(progress.CurrentState.ServerCode + "_" + progress.CurrentState.SubjectCode + ".xml", btoa(json)); // données cryptées
                        }
                        zip.generateAsync({ type: "blob" })
                            .then(function (content) {
                            saveAs(content, "localprogress.zip");
                        });
                    }
                };
                vm.DeleteLocalSessions = function (progresses, callback) {
                    if (progresses.length > 0) {
                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("ConfirmRemoval"), function () {
                            for (var i = 0; i < progresses.length; i++) {
                                Framework.LocalStorage.RemoveItem(progresses[i].GetKey());
                            }
                            callback();
                        });
                    }
                };
                vm.ResetLocalSessions = function (progresses, callback) {
                    if (progresses.length > 0) {
                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("ConfirmReset"), function () {
                            for (var i = 0; i < progresses.length; i++) {
                                var progress = progresses[i];
                                progress.CurrentState.CurrentScreen = 0;
                                progress.CurrentState.LastAccess = undefined;
                                progress.ListData = [];
                                Framework.LocalStorage.SaveToLocalStorage(progress.CurrentState.ServerCode + "_" + progress.CurrentState.SubjectCode, JSON.stringify(progress), true);
                            }
                            callback();
                        });
                    }
                };
                vm.SynchronizeLocalSessions = function (progresses, callback) { self.synchronizeLocalSessions(progresses, callback); };
                vm.GetSessionsFromLocalStorage = function (notSynchronizedOnly) {
                    var keys = Framework.LocalStorage.GetAllLocalStorageItems().filter(function (x) { return Number(x.substring(0, 7)) > 999999; }); // Teste si c'est bien une séance (code numérique au moins 7 digits)
                    var progress = [];
                    for (var i = 0; i < keys.length; i++) {
                        var p = Framework.Serialization.JsonToInstance(new Models.Progress(), Framework.LocalStorage.GetFromLocalStorage(keys[i], true));
                        var key = p.GetKey();
                        if (notSynchronizedOnly == false || (notSynchronizedOnly == true && p.CurrentState.LastUpload < p.CurrentState.LastAccess)) {
                            var lsp = new Models.LocalSessionProgress();
                            lsp.Progress = p;
                            lsp.Key = key;
                            lsp.ServerCode = p.CurrentState.ServerCode;
                            lsp.SubjectCode = p.CurrentState.SubjectCode;
                            if (p.CurrentState.LastAccess != undefined) {
                                lsp.LastAccess = new Date(p.CurrentState.LastAccess.toString()).toLocaleString();
                            }
                            else {
                                lsp.LastAccess = "-";
                            }
                            if (p.CurrentState.LastUpload != undefined) {
                                lsp.LastDownload = new Date(p.CurrentState.LastUpload.toString()).toLocaleString();
                            }
                            else {
                                lsp.LastDownload = "-";
                            }
                            lsp.Screen = p.CurrentState.CurrentScreen + "/" + p.CurrentState.CountScreen;
                            if (p.ListData != undefined) {
                                lsp.Data = p.ListData.length.toString();
                            }
                            lsp.Size = Math.round((Framework.LocalStorage.GetLocalStorageItemSize(key) / 1024)) + " Ko";
                            progress.push(lsp);
                        }
                    }
                    return progress;
                };
                vm.ShowMainMenu = function () { self.showMainMenu(); };
                vm.ShowDownloadLocalSessionsMenu = function () { self.showDownloadLocalSessionsMenu(); };
                vm.Refresh();
                return vm;
            });
        };
        // Affiche le menu download local sessions
        App.prototype.showDownloadLocalSessionsMenu = function () {
            var self = this;
            this.showView("html/ViewDownloadLocalSession.html", function () {
                var vm = new ViewModels.DownloadLocalSessionViewModel();
                vm.DownloadLocalSessions = function (serverCode, password) {
                    if (password == undefined) {
                        password = "";
                    }
                    if (serverCode != undefined && serverCode.length > 2) {
                        self.CallWCF('DownloadAllSubjectSeances', { serverCode: serverCode, password: password }, function () { }, function (res) {
                            if (res.ErrorMessage) {
                                Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get(res.ErrorMessage));
                                return;
                            }
                            if (res.Result) {
                                var sessions = [];
                                Framework.Serialization.JsonToInstance(sessions, res.Result);
                                sessions.forEach(function (x) {
                                    Framework.FileHelper.SaveObjectAs(x, x.Access.ServerCode + "_" + x.Subject.Code + ".xml");
                                });
                            }
                        });
                    }
                };
                vm.ShowLocalSessionsMenu = function () { self.showLocalSessionsMenu(); };
                return vm;
            });
        };
        // Affiche le menu settings
        App.prototype.showSettingsMenu = function () {
            var self = this;
            this.showView("html/ViewSettings.html", function () {
                var vm = new ViewModels.SettingsViewModel(self.isVirtualKeyboardEnabled, self.isLocked, self.isOnline, self.isAutoSynchronized);
                vm.ToggleLanguage = function () {
                    switch (Framework.LocalizationManager.GetDisplayLanguage()) {
                        case "en":
                            Framework.LocalizationManager.SetDisplayLanguage("fr");
                            break;
                        case "fr":
                            Framework.LocalizationManager.SetDisplayLanguage("en");
                            break;
                    }
                    Framework.LocalStorage.SaveToLocalStorage("Language", Framework.LocalizationManager.GetDisplayLanguage());
                };
                vm.ToggleVirtualKeyboard = function () {
                    self.isVirtualKeyboardEnabled = !self.isVirtualKeyboardEnabled;
                    // Clavier virtuel : tous les éléments de class vk            
                    if (self.isVirtualKeyboardEnabled == true) {
                        Framework.VirtualKeyboard.Enable('.vk');
                    }
                    else {
                        Framework.VirtualKeyboard.Disable('.vk');
                    }
                    Framework.LocalStorage.SaveToLocalStorage("VirtualKeyboardEnabled", JSON.stringify(self.isVirtualKeyboardEnabled));
                    vm.SetToggleVirtualKeyboardValue(self.isVirtualKeyboardEnabled);
                };
                vm.ToggleLock = function () {
                    self.toggleLock();
                    vm.SetToggleLockValue(self.isLocked);
                };
                vm.ToggleSynchronization = function () {
                    self.isAutoSynchronized = !self.isAutoSynchronized;
                    Framework.LocalStorage.SaveToLocalStorage("AutoSynchronization", JSON.stringify(self.isAutoSynchronized));
                    vm.SetToggleSynchronizationValue(self.isAutoSynchronized);
                };
                vm.ShowMainMenu = function () { self.showMainMenu(); };
                return vm;
            });
        };
        // Affiche le menu run session
        App.prototype.showRunSessionMenu = function () {
            var self = this;
            this.showView("html/ViewRunSession.html", function () {
                var vm = new ViewModels.RunSessionViewModel(self.isOnline, Framework.Browser.CanUseLocalFile());
                vm.ShowRunFromServerCodeMenu = function (checkStart) { self.showRunFromServerCodeMenu(checkStart); };
                vm.ShowRunFromLocalFileMenu = function () { self.showRunFromLocalFileMenu(); };
                vm.ShowMainMenu = function () { self.showMainMenu(); };
                return vm;
            });
        };
        // Affiche le menu run session from local file
        App.prototype.showRunFromLocalFileMenu = function () {
            var self = this;
            this.showView("html/ViewLocalFile.html", function () {
                var vm = new ViewModels.RunFromLocalFileViewModel();
                vm.ShowRunSessionMenu = function () { self.showRunSessionMenu(); };
                vm.StartFromLocalFile = function (file) {
                    // Lecture du fichier local
                    var fileReader = new FileReader();
                    fileReader.onload = function (e) {
                        var json = fileReader.result;
                        self.startSubjectSessionFromJson(json, false, true);
                    };
                    fileReader.readAsText(file);
                };
                return vm;
            });
        };
        // Affiche l'écran courant de screenReader et cache le header et footer
        App.prototype.showCurrentSubjectSessionScreen = function () {
            var self = this;
            this.showView("html/ViewScreenReader.html", function () {
                var vm = new ViewModels.ScreenReaderViewModel();
                return vm;
            });
        };
        // Affiche le menu run session from server code
        App.prototype.showRunFromServerCodeMenu = function (checkStart, servercode) {
            if (servercode === void 0) { servercode = ""; }
            var self = this;
            this.showView("html/ViewRunFromServerCode.html", function () {
                var vm = new ViewModels.RunFromServerCodeViewModel(servercode);
                vm.DownloadSubjectSession = function () { self.downloadSubjectSession(); };
                vm.ShowRunSessionMenu = function () { self.showRunSessionMenu(); };
                vm.SetServerCode = function (serverCode) { self.serverCode = serverCode; };
                vm.SetSubjectCode = function (subjectCode) { self.subjectCode = subjectCode; };
                vm.SetPassword = function (password) { self.password = password; };
                vm.GetListSubjectsForSeance = function (serverCode, callback) {
                    self.CallWCF('GetListSubjectsForSeance', { serverCode: serverCode }, function () { }, function (res) { callback(res); });
                };
                return vm;
            });
        };
        // Affiche l'aide dans une boite modale
        App.prototype.showHelp = function () {
            //TODO : redirection vers page spécifique
            Framework.Modal.Alert(Framework.LocalizationManager.Get("Help"), 'Work in progress');
        };
        // Synchronisation des séances locales sélectionnées avec le serveur
        App.prototype.synchronizeLocalSessions = function (progresses, callback) {
            var self = this;
            if (progresses.length > 0) {
                for (var i = 0; i < progresses.length; i++) {
                    var progress = progresses[i];
                    var json = JSON.stringify(progress);
                    //TODO : progressbar, vérifier sur serveur si pas maj plus récente
                    self.uploadProgress(progress.CurrentState.ServerCode, progress.CurrentState.SubjectCode, progress, function (res) {
                        if (res.ErrorMessage) {
                            return;
                        }
                        var serverProgress = Framework.Serialization.JsonToInstance(new Models.Progress(), res.Result);
                        //progress.CurrentState.CurrentScreen = serverProgress.CurrentState.CurrentScreen;
                        progress.CurrentState.LastAccess = serverProgress.CurrentState.LastAccess;
                        progress.CurrentState.LastUpload = serverProgress.CurrentState.LastUpload;
                        progress.Notification = serverProgress.Notification;
                        Framework.LocalStorage.SaveToLocalStorage(progress.GetKey(), JSON.stringify(progress), true);
                    });
                    callback();
                }
            }
        };
        // Renvoie un tableau des avancements enregistrés dans le local storage
        App.prototype.getLocalSessionFromLocalStorage = function (notSynchronizedOnly) {
            if (notSynchronizedOnly === void 0) { notSynchronizedOnly = false; }
            var keys = Framework.LocalStorage.GetAllLocalStorageItems().filter(function (x) { return Number(x.substring(0, 7)) > 999999; }); // Teste si c'est bien une séance (code numérique au moins 7 digits)
            var progress = [];
            for (var i = 0; i < keys.length; i++) {
                var p = Framework.Serialization.JsonToInstance(new Models.Progress(), Framework.LocalStorage.GetFromLocalStorage(keys[i], true));
                if (notSynchronizedOnly == false || (notSynchronizedOnly == true && p.CurrentState.LastUpload < p.CurrentState.LastAccess)) {
                    progress.push(p);
                }
            }
            return progress;
        };
        // Lance le screenreader à partir d'une chaine JSON
        App.prototype.startSubjectSessionFromJson = function (json, isDemo, isLocal) {
            if (isDemo === void 0) { isDemo = false; }
            if (isLocal === void 0) { isLocal = false; }
            var self = this;
            var login = "";
            if (this.serverCode) {
                login += this.serverCode + "/";
            }
            if (this.subjectCode) {
                login += this.subjectCode;
            }
            if (isDemo) {
                login = "Demo";
            }
            this.logConnexion(login);
            // worker pour ne pas bloquer l'UI
            var worker = new Worker(this.rootURL + "/screenreader/ReadJSONWorker.js");
            worker.onmessage = function (e) {
                var subjectSeance = e.data;
                worker.terminate();
                Framework.Progress.Hide();
                if (subjectSeance == null || subjectSeance == undefined) {
                    // Format de fichier non valide            
                    Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("InvalidFile"));
                    return;
                }
                // Initialisation du screenReader et affichage de la séance
                // Synchronisation avec l'avancement local (séance locale uniquement)                
                if (isLocal == true) {
                    var serializedLocalProgress = Framework.LocalStorage.GetFromLocalStorage(subjectSeance.Access.ServerCode + "_" + subjectSeance.Access.SubjectCode, true);
                    if (serializedLocalProgress != null) {
                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("LocalProgressFound"), Framework.LocalizationManager.Get("LocalProgressFoundDetail"), function () {
                            // Confirmation pour reprendre à partir de localpprogress
                            var p = Framework.Serialization.JsonToInstance(new Models.Progress(), serializedLocalProgress);
                            subjectSeance.Progress = p;
                            self.reader.SetSubjectScreen(subjectSeance.Progress.CurrentState.CurrentScreen);
                        });
                    }
                }
                self.showCurrentSubjectSessionScreen();
                var readerState = new ScreenReader.State();
                readerState.IsInDemo = isDemo;
                readerState.IsInSimulation = false;
                readerState.IsPanelLeader = self.isInPanelLeaderMode;
                var readerActions = new ScreenReader.Actions();
                readerActions.OnLastScreen = function () {
                    if (self.isInTest == false) {
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Information"), Framework.LocalizationManager.Get("CompletedSession"));
                    }
                };
                readerActions.OnNavigation = function (url, blank) {
                    if (self.isInTest == false) {
                        if (url.length > 3) {
                            Framework.Browser.NavigateToUrl(url, blank);
                        }
                    }
                };
                readerActions.OnValidationError = function (message) {
                    if (self.isInTest == false) {
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("ValidationError"), message);
                    }
                };
                readerActions.OnError = function (error) {
                    if (self.isInTest == false) {
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), error);
                    }
                };
                readerActions.OnNotification = function (message) {
                    Framework.Modal.Alert(Framework.LocalizationManager.Get("Tip"), message);
                };
                readerActions.OnSaveProgressAsPanelLeader = function (callback) {
                    Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("CurrentProgressWillReplacePreviousOne"), function () {
                        callback();
                    });
                };
                readerActions.OnBase64StringUpload = function (base64string, filename) {
                };
                readerActions.OnRScriptStarted = function (rScript, success, error) {
                };
                readerActions.OnSave = function (blob, filename) {
                };
                if (!isDemo) {
                    readerActions.OnProgressUpload = function (action, checkProgress) {
                        //                        var json: string = JSON.stringify(self.reader.Session.Progress);
                        //alert(self.reader.Session.Progress.DisplayedScreenIndex.join(","));
                        self.uploadProgress(self.reader.Session.Access.ServerCode, self.reader.Session.Access.SubjectCode, self.reader.Session.Progress, function (res) {
                            //
                            if (res.ErrorMessage) {
                                Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("ErrorWhileUploadingProgress") + " " + Framework.LocalizationManager.Get(res.ErrorMessage));
                                self.forceLocalProgress = true;
                                //return;
                            }
                            action();
                            //let serverProgress: Models.Progress = Framework.Serialization.JsonToInstance<Models.Progress>(new Models.Progress(), res.Result);
                            //if (checkProgress == true && self.forceLocalProgress == false && (serverProgress.CurrentState.CurrentScreen > self.reader.Session.Progress.CurrentState.CurrentScreen)) {
                            //    // Le progrès sur le serveur existe déjà et est plus avance que le progrès local
                            //    Framework.Modal.Confirm(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("ServerProgressMoreRecent") + "\n" + Framework.LocalizationManager.Get("ContinueWithServerProgress"),  () => {
                            //        // On reprend au niveau du serveur
                            //        self.reader.Session.Progress.CurrentState.CurrentScreen = serverProgress.CurrentState.CurrentScreen;
                            //        // TODO : A rajouter ? Panelist.SubjectSession.Reader.Session.Progress.CurrentState.CountScreen = serverProgress.CurrentState.CountScreen;
                            //        self.reader.Session.Progress.CurrentState.LastAccess = serverProgress.CurrentState.LastAccess;
                            //        self.reader.Session.Progress.CurrentState.LastUpload = serverProgress.CurrentState.LastUpload;
                            //        self.reader.Session.Progress.Notification = serverProgress.Notification;
                            //        //TODO ?
                            //        //if (p.ListData != null && p.ListData.Count > 0)
                            //        //    MySeance.Progress.ListData = p.ListData;
                            //        //TODO : show notification si existe ?
                            //        Framework.LocalStorage.SaveToLocalStorage(self.reader.Session.Progress.CurrentState.ServerCode + "_" + self.reader.Session.Progress.CurrentState.SubjectCode, JSON.stringify(self.reader.Session.Progress));
                            //    }, () => {
                            //        self.forceLocalProgress = true;
                            //        self.reader.Session.Progress.Notification = serverProgress.Notification;
                            //        // TODO : Envoi d'issue sur le serveur Localization.Localize("ConflictBetweenServerAndLocalProgress");
                            //        // TODO ? : Renommer le subjet en subject + ... pour garder les 2 infos (pour instant subjectform pas enregistré)
                            //        Framework.LocalStorage.SaveToLocalStorage(self.reader.Session.Progress.CurrentState.ServerCode + "_" + self.reader.Session.Progress.CurrentState.SubjectCode, JSON.stringify(self.reader.Session.Progress));
                            //    });
                            //}
                        });
                    };
                }
                readerActions.OnBase64StringUpload = function (base64string, filename) {
                    self.CallWCF('UploadBase64String', { base64string: base64string, name: filename, servercode: self.reader.Session.Access.ServerCode }, function () { }, function (res) {
                        if (res.ErrorMessage) {
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("ErrorWhileUploadingProgress"));
                        }
                    });
                };
                readerActions.OnRScriptStarted = function (rScript, success, error) {
                    self.CallWCF('ExecuteScriptForSubjectSummary', { serverCode: self.serverCode, xmlScript: encodeURIComponent(rScript), login: "TimeSens", password: "timesens" }, function () { }, function (res) {
                        if (res.ErrorMessage) {
                            error();
                        }
                        else {
                            success(res.Result);
                        }
                    });
                };
                readerActions.OnSave = function (blob, filename) {
                    Framework.FileHelper.SaveAs(blob, filename);
                };
                ScreenReader.Reader.Initialize(subjectSeance, document.getElementById("currentScreen"), readerActions, readerState, function (reader) {
                    self.reader = reader;
                    //alert(self.reader.Session.DisplayedScreenIndex.join(","));
                    if (isDemo == false && subjectSeance.Progress != undefined) {
                        self.reader.SetSubjectScreen(subjectSeance.Progress.CurrentState.CurrentScreen);
                    }
                    else {
                        self.reader.SetSubjectScreen(0);
                    }
                    if (self.isInScreenshotMode == true) {
                        var imgHeight_1 = (297 / self.screensBySheet);
                        setTimeout(function () {
                            self.reader.Screenshot([], function (listImg) {
                                var div = document.createElement("div");
                                listImg.forEach(function (src) {
                                    var image = new Image();
                                    image.src = src;
                                    image.style.border = "1px solid black";
                                    image.style.margin = "10px";
                                    //image.style.height = '297mm';//A4
                                    image.style.height = imgHeight_1 + 'mm';
                                    image.style.width = 'auto';
                                    div.appendChild(image);
                                });
                                var blob = new Blob([div.outerHTML], { type: "text/html" });
                                Framework.FileHelper.SaveAs(blob, self.reader.Session.UploadId + "_" + self.reader.Session.Subject.Code + ".html");
                            });
                        }, 500);
                    }
                    if (self.OnReaderLoaded) {
                        self.OnReaderLoaded();
                    }
                });
            };
            worker.postMessage(json);
        };
        // Télécharge une séance puis lance screenreader
        App.prototype.downloadSubjectSession = function () {
            var self = this;
            if (self.serverCode.length > 0 && self.subjectCode.length > 0) {
                self.getSubjectSeanceFileSize(self.serverCode, self.subjectCode, function (res) {
                    if (res.ErrorMessage) {
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("UnableToDownloadSubjectSession"));
                        self.showRunFromServerCodeMenu(false);
                        return;
                    }
                    if (res.Result.length > 0) {
                        self.downloadSubjectSeance(self.serverCode, self.subjectCode, self.password, function (res) {
                            if (res.ErrorMessage) {
                                Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get(res.ErrorMessage));
                                self.showRunFromServerCodeMenu(false);
                                Framework.Progress.Hide();
                                return;
                            }
                            self.startSubjectSessionFromJson(res.Result, false, false);
                        });
                    }
                    else {
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("UnableToDownloadSubjectSession"));
                        self.showRunFromServerCodeMenu(false);
                    }
                });
            }
            else {
                self.showRunFromServerCodeMenu(false);
            }
        };
        // Télécharge une séance puis lance screenreader
        App.prototype.downloadAnonymousSession = function () {
            var self = this;
            if (self.serverCode.length > 0) {
                self.getSubjectSeanceFileSize(self.serverCode, "", function (res) {
                    if (res.ErrorMessage) {
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("UnableToDownloadSubjectSession"));
                        self.showRunFromServerCodeMenu(false);
                        return;
                    }
                    if (res.Result.length > 0) {
                        self.downloadSubjectSeance(self.serverCode, "", self.password, function (res) {
                            if (res.ErrorMessage) {
                                Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("UnableToDownloadSubjectSession"));
                                self.showRunFromServerCodeMenu(false);
                                return;
                            }
                            self.startSubjectSessionFromJson(res.Result, false, false);
                        });
                    }
                    else {
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("UnableToDownloadSubjectSession"));
                        self.showRunFromServerCodeMenu(false);
                    }
                });
            }
            else {
                self.showRunFromServerCodeMenu(false);
            }
        };
        App.prototype.logConnexion = function (login) {
            var self = this;
            self.CallWCF('LogConnexion', { client: "Panelist", version: self.version, login: login }, function () { }, function () { });
        };
        App.prototype.startDemo = function () {
            this.isInSimulationMode = true;
            var self = this;
            var file = "demo/" + this.startDemoParameter + ".json";
            $.get(file, function (data) {
                var json = data;
                self.startSubjectSessionFromJson(json, true, false);
            }, 'text').fail(function (xhr, status, error) {
                Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("UnableToDownloadSubjectSession"));
            });
            ;
        };
        App.prototype.changeLanguage = function (language) {
            switch (language) {
                case "en":
                    Framework.LocalizationManager.SetDisplayLanguage("en");
                    break;
                case "fr":
                    Framework.LocalizationManager.SetDisplayLanguage("fr");
                    break;
                default:
                    Framework.LocalizationManager.SetDisplayLanguage("en");
                    break;
            }
            Framework.LocalStorage.SaveToLocalStorage("Language", Framework.LocalizationManager.GetDisplayLanguage());
        };
        App.prototype.toggleLock = function () {
            // Change lock -> unlock
            var div = document.createElement("div");
            var d = document.createElement("div");
            div.appendChild(d);
            var p = document.createElement("p");
            var input = document.createElement("input");
            input.type = "text";
            input.classList.add("tableInput");
            input.placeholder = Framework.LocalizationManager.Get("Password");
            p.appendChild(input);
            div.appendChild(p);
            var p2 = document.createElement("p");
            p2.innerText = Framework.LocalizationManager.Get("WrongPassword");
            p2.style.color = "red";
            p2.style.display = "none";
            div.appendChild(p2);
            var self = this;
            var setLock = function () {
                self.isLocked = !self.isLocked;
            };
            if (self.isLocked == false) {
                d.innerHTML = Framework.LocalizationManager.Get("ConfirmLockUI");
                // Message pour bloquer l'UI
                Framework.Modal.Confirm(Framework.LocalizationManager.Get("LockUI"), div, function () {
                    if (input.value.length > 0) {
                        self.isLocked = true;
                        Framework.LocalStorage.SaveToLocalStorage("IsLock", JSON.stringify(self.isLocked));
                        Framework.LocalStorage.SaveToLocalStorage("UIPassword", input.value);
                    }
                });
            }
            else {
                d.innerHTML = Framework.LocalizationManager.Get("ConfirmUnlockUI");
                // Message pour débloquer l'UI avec le mot de passe
                Framework.Modal.Confirm(Framework.LocalizationManager.Get("LockUI"), div, function () {
                    if (input.value == Framework.LocalStorage.GetFromLocalStorage("UIPassword")) {
                        self.isLocked = false;
                        Framework.LocalStorage.SaveToLocalStorage("IsLock", JSON.stringify(self.isLocked));
                    }
                    else {
                        Framework.LocalStorage.SaveToLocalStorage("IsLock", JSON.stringify(self.isLocked));
                        p2.style.display = "block";
                    }
                });
            }
            return (self.isLocked);
        };
        App.prototype.getSubjectSeanceFileSize = function (serverCode, subjectCode, callback) {
            this.CallWCF('GetSubjectSeanceFileSize', { serverCode: serverCode, subjectCode: subjectCode }, function () { }, function (res) { callback(res); });
        };
        App.prototype.downloadSubjectSeance = function (serverCode, subjectCode, password, callback) {
            this.CallWCF('DownloadSubjectSeance', { serverCode: serverCode, subjectCode: subjectCode, password: password }, function () { }, function (res) { callback(res); });
        };
        App.prototype.uploadProgress = function (serverCode, subjectCode, progress, callback) {
            var self = this;
            this.CallWCF('UploadProgress', {
                serverCode: serverCode,
                subjectCode: subjectCode,
                xmlProgress: JSON.stringify(progress)
            }, function () { }, function (res) {
                callback(res);
            });
        };
        return App;
    }(Framework.App));
    Panelist.App = App;
    var ViewModels;
    (function (ViewModels) {
        var RunSessionViewModel = /** @class */ (function (_super) {
            __extends(RunSessionViewModel, _super);
            function RunSessionViewModel(isOnline, canUseLocalFile) {
                var _this = _super.call(this) || this;
                var self = _this;
                _this.btnShowStartFromServerCodeMenu = Framework.Form.ClickableElement.Register("btnShowStartFromServerCodeMenu", function () {
                    return isOnline;
                }, function () { self.ShowRunFromServerCodeMenu(true); });
                _this.btnShowStartFromLocalFileMenu = Framework.Form.ClickableElement.Register("btnShowStartFromLocalFileMenu", function () {
                    return canUseLocalFile;
                }, function () { self.ShowRunFromLocalFileMenu(); });
                _this.btnBackFromRunSessionMenu = Framework.Form.ClickableElement.Register("btnBackFromRunSessionMenu", undefined, function () { self.ShowMainMenu(); });
                return _this;
            }
            return RunSessionViewModel;
        }(Framework.ViewModel));
        ViewModels.RunSessionViewModel = RunSessionViewModel;
        var SettingsViewModel = /** @class */ (function (_super) {
            __extends(SettingsViewModel, _super);
            function SettingsViewModel(isVirtualKeyboardEnabled, isLocked, isOnline, isAutoSynchronized) {
                var _this = _super.call(this) || this;
                var self = _this;
                _this.btnToggleLanguage = Framework.Form.ClickableElement.Register("btnToggleLanguage", undefined, function () {
                    self.ToggleLanguage();
                    self.spanToggleLanguageValue.Set(Framework.LocalizationManager.GetDisplayLanguage().toUpperCase());
                });
                //this.btnToggleVirtualKeyboard = Framework.Form.ClickableElement.Register("btnToggleVirtualKeyboard", undefined, () => {
                //    self.ToggleVirtualKeyboard();                    
                //});
                //this.btnToggleLock = Framework.Form.ClickableElement.Register("btnToggleLock", () => { return true; }, () => {
                //    self.ToggleLock();                    
                //});
                _this.btnToggleFullScreen = Framework.Form.ClickableElement.Register("btnToggleFullScreen", undefined, function () {
                    Framework.Browser.ToggleFullScreen();
                });
                //this.btnToggleSynchronization = Framework.Form.ClickableElement.Register("btnToggleSynchronization", () => { return isOnline; }, () => {
                //    self.ToggleSynchronization();                    
                //});
                _this.btnBackFromSettingsMenu = Framework.Form.ClickableElement.Register("btnBackFromSettingsMenu", function () { return true; }, function () {
                    self.ShowMainMenu();
                });
                _this.spanToggleLanguageValue = Framework.Form.TextElement.Register("spanToggleLanguageValue", Framework.LocalizationManager.GetDisplayLanguage().toUpperCase());
                //this.spanToggleVirtualKeyboardValue = Framework.Form.TextElement.Register("spanToggleVirtualKeyboardValue", this.BoolToSwitch(isVirtualKeyboardEnabled));
                //this.spanToggleLockValue = Framework.Form.TextElement.Register("spanToggleLockValue", this.BoolToSwitch(isLocked));
                _this.spanToggleFullScreenValue = Framework.Form.TextElement.Register("spanToggleFullScreenValue", _this.BoolToSwitch(Framework.Browser.IsFullScreen));
                return _this;
                //this.spanToggleSynchronizationValue = Framework.Form.TextElement.Register("spanToggleSynchronizationValue", this.BoolToSwitch(isAutoSynchronized));
            }
            SettingsViewModel.prototype.BoolToSwitch = function (b) {
                var res = b == true ? "ON" : "OFF";
                return res;
            };
            SettingsViewModel.prototype.SetToggleVirtualKeyboardValue = function (isVirtualKeyboardEnabled) {
                this.spanToggleVirtualKeyboardValue.Set(this.BoolToSwitch(isVirtualKeyboardEnabled));
            };
            SettingsViewModel.prototype.SetToggleSynchronizationValue = function (synchronization) {
                this.spanToggleSynchronizationValue.Set(this.BoolToSwitch(synchronization));
            };
            SettingsViewModel.prototype.SetToggleLockValue = function (lock) {
                this.spanToggleLockValue.Set(this.BoolToSwitch(lock));
            };
            return SettingsViewModel;
        }(Framework.ViewModel));
        ViewModels.SettingsViewModel = SettingsViewModel;
        var MenuViewModel = /** @class */ (function (_super) {
            __extends(MenuViewModel, _super);
            function MenuViewModel(canUseLocalFile, isLocked) {
                var _this = _super.call(this) || this;
                var self = _this;
                _this.btnShowRunSessionMenu = Framework.Form.ClickableElement.Register("btnShowRunSessionMenu", function () { return true; }, function () { self.ShowRunSessionMenu(); });
                _this.btnShowLocalSessionsMenu = Framework.Form.ClickableElement.Register("btnShowLocalSessionsMenu", function () {
                    return (canUseLocalFile == true && isLocked == false);
                }, function () { self.ShowLocalSessionsMenu(); });
                _this.btnShowSettingsMenu = Framework.Form.ClickableElement.Register("btnShowSettingsMenu", function () { return true; }, function () { self.ShowSettingsMenu(); });
                return _this;
                //this.btnShowHelpMenu = Framework.Form.ClickableElement.Register("btnShowHelpMenu", () => { return true; }, () => { self.ShowHelp(); });
            }
            return MenuViewModel;
        }(Framework.ViewModel));
        ViewModels.MenuViewModel = MenuViewModel;
        var RunFromLocalFileViewModel = /** @class */ (function (_super) {
            __extends(RunFromLocalFileViewModel, _super);
            function RunFromLocalFileViewModel() {
                var _this = _super.call(this) || this;
                var self = _this;
                _this.btnBackFromLocalFileMenu = Framework.Form.ClickableElement.Register("btnBackFromLocalFileMenu", undefined, function () { self.ShowRunSessionMenu(); });
                _this.btnBrowseLocalFile = Framework.Form.ClickableElement.Register("btnBrowseLocalFile", undefined, function () {
                    self.inputLocalFile.Click();
                });
                _this.inputLocalFile = Framework.Form.InputFile.Register("inputLocalFile", function (file) {
                    self.StartFromLocalFile(file);
                    //form.reset();
                });
                return _this;
            }
            return RunFromLocalFileViewModel;
        }(Framework.ViewModel));
        ViewModels.RunFromLocalFileViewModel = RunFromLocalFileViewModel;
        var RunFromServerCodeViewModel = /** @class */ (function (_super) {
            __extends(RunFromServerCodeViewModel, _super);
            function RunFromServerCodeViewModel(servercode) {
                if (servercode === void 0) { servercode = ""; }
                var _this = _super.call(this) || this;
                var self = _this;
                _this.inputServerCode = Framework.Form.InputText.Register("inputServerCode", servercode, Framework.Form.Validator.Custom(_this.validateServerCode), function (serverCode) {
                    if (self.inputServerCode.IsValid == true) {
                        self.GetListSubjectsForSeance(serverCode, function (res) {
                            if (res.Result) {
                                self.SetServerCode(serverCode);
                                var arrayOfSubjects = JSON.parse(res.Result);
                                if (arrayOfSubjects.length > 0) {
                                    var listKvp_1 = [];
                                    arrayOfSubjects.forEach(function (subject) {
                                        listKvp_1.push(new Framework.KeyValuePair(subject, subject));
                                    });
                                    self.selectSubjectCode.SetValues(listKvp_1);
                                    // Sélection du premier juge dispo
                                    self.selectSubjectCode.HighlightOn(Framework.LocalizationManager.Get("SelectSubjectInTheDropDownList"));
                                    self.btnSelectSubjectCode.Enable();
                                    if (self.OnGetListSubjectsForSeanceCompleted) {
                                        self.OnGetListSubjectsForSeanceCompleted(arrayOfSubjects);
                                    }
                                    self.btnStartFromServerCode.Enable();
                                }
                            }
                            else {
                                self.inputServerCode.Invalidate(Framework.LocalizationManager.Get("NoMatchingServerCodeFound"));
                                self.btnStartFromServerCode.Disable();
                                if (self.OnGetListSubjectsForSeanceFailed) {
                                    self.OnGetListSubjectsForSeanceFailed(Framework.LocalizationManager.Get("NoMatchingServerCodeFound"));
                                }
                            }
                        });
                    }
                    else if (self.OnGetListSubjectsForSeanceFailed) {
                        self.OnGetListSubjectsForSeanceFailed(self.inputServerCode.ValidationMessage);
                    }
                    self.btnStartFromServerCode.CheckState();
                }, true);
                _this.inputSubjectCode = Framework.Form.InputText.Register("inputSubjectCode", "", Framework.Form.Validator.MinLength(0, Framework.LocalizationManager.Get("SubjectCodeRequired")), function (subjectCode) {
                    self.SetSubjectCode(subjectCode);
                    self.btnStartFromServerCode.CheckState();
                }, true);
                _this.inputPassword = Framework.Form.InputText.Register("inputPassword", "", undefined, function (password) {
                    self.SetPassword(password);
                    return "";
                }, false);
                _this.selectSubjectCode = Framework.Form.Select.Register("selectSubjectCode", "", [], Framework.Form.Validator.NotEmpty(), function (subjectCode) {
                    self.inputSubjectCode.Set(subjectCode);
                    if (self.selectSubjectCode) {
                        self.selectSubjectCode.Hide();
                        self.btnSelectSubjectCode.Show();
                    }
                    self.inputSubjectCode.Show();
                });
                _this.btnSelectSubjectCode = Framework.Form.ClickableElement.Register("btnSelectSubjectCode", undefined, function () {
                    self.selectSubjectCode.Show();
                    var length = $('#selectSubjectCode> option').length;
                    $(self.selectSubjectCode.HtmlElement).attr('size', length);
                    self.inputSubjectCode.Hide();
                    self.btnSelectSubjectCode.Hide();
                });
                _this.btnStartFromServerCode = Framework.Form.ClickableElement.Register("btnStartFromServerCode", function () {
                    var res = self.inputSubjectCode.Value.length > 0 && self.inputServerCode.Value.length > 6;
                    return res;
                }, function () {
                    self.DownloadSubjectSession();
                });
                _this.btnBackFromServerCodeMenu = Framework.Form.ClickableElement.Register("btnBackFromServerCodeMenu", undefined, function () { self.ShowRunSessionMenu(); });
                _this.selectSubjectCode.SetValues([]);
                _this.selectSubjectCode.Hide();
                _this.inputSubjectCode.Show();
                return _this;
            }
            RunFromServerCodeViewModel.prototype.validateServerCode = function (serverCode) {
                var self = this;
                var res = "";
                if (serverCode.length == 0) {
                    res = Framework.LocalizationManager.Get("ServerCodeRequired");
                }
                else if (isNaN(parseFloat(serverCode))) {
                    res = Framework.LocalizationManager.Get("NumericInputOnly");
                }
                else if (serverCode.length < 7) {
                    res = Framework.LocalizationManager.Get("AtLeast6Digits");
                }
                return res;
            };
            return RunFromServerCodeViewModel;
        }(Framework.ViewModel));
        ViewModels.RunFromServerCodeViewModel = RunFromServerCodeViewModel;
        var DownloadLocalSessionViewModel = /** @class */ (function (_super) {
            __extends(DownloadLocalSessionViewModel, _super);
            function DownloadLocalSessionViewModel() {
                var _this = _super.call(this) || this;
                var self = _this;
                _this.inputDownloadLocalSessionServerCode = Framework.Form.InputText.Register("inputDownloadLocalSessionServerCode", "", Framework.Form.Validator.MinLength(6), function (serverCode) {
                    self.serverCode = serverCode;
                    self.btnDownloadLocalSessions.CheckState();
                }, true);
                _this.inputDownloadLocalSessionPassword = Framework.Form.InputText.Register("inputDownloadLocalSessionPassword", "", undefined, function (password) {
                    self.password = password;
                }, true);
                _this.btnDownloadLocalSessions = Framework.Form.ClickableElement.Register("btnDownloadLocalSessions", function () {
                    return self.serverCode && self.serverCode.length >= 6; //TODO : comme dans runfromservercodeview 
                }, function () {
                    self.ShowLocalSessionsMenu();
                });
                _this.btnBackFromDownloadLocalSessionsMenu = Framework.Form.ClickableElement.Register("btnBackFromDownloadLocalSessionsMenu", undefined, function () {
                    self.DownloadLocalSessions(self.serverCode, self.password);
                });
                return _this;
            }
            return DownloadLocalSessionViewModel;
        }(Framework.ViewModel));
        ViewModels.DownloadLocalSessionViewModel = DownloadLocalSessionViewModel;
        var LocalSessionsViewModel = /** @class */ (function (_super) {
            __extends(LocalSessionsViewModel, _super);
            function LocalSessionsViewModel(isOnline) {
                var _this = _super.call(this) || this;
                _this.progresses = [];
                _this.selectedProgresses = [];
                var self = _this;
                _this.btnBackFromLocalSessionsMenu = Framework.Form.ClickableElement.Register("btnBackFromLocalSessionsMenu", undefined, function () { self.ShowMainMenu(); });
                _this.btnShowDownloadLocalSessionsMenu = Framework.Form.Button.Register("btnShowDownloadLocalSessionsMenu", function () { return isOnline; }, function () {
                    self.ShowDownloadLocalSessionsMenu();
                }, Framework.LocalizationManager.Get("Download"));
                _this.btnZipLocalSessions = Framework.Form.Button.Register("btnZipLocalSessions", function () {
                    return self.selectedProgresses.length > 0;
                }, function () { self.ZipLocalSessions(self.selectedProgresses); }, Framework.LocalizationManager.Get("SaveAsZip"));
                _this.btnDeleteLocalSessions = Framework.Form.Button.Register("btnDeleteLocalSessions", function () { return self.selectedProgresses.length > 0; }, function () {
                    self.DeleteLocalSessions(self.selectedProgresses, function () { self.Refresh(); });
                }, Framework.LocalizationManager.Get("Delete"));
                _this.btnResetLocalSessions = Framework.Form.Button.Register("btnResetLocalSessions", function () { return self.selectedProgresses.length > 0; }, function () { self.ResetLocalSessions(self.selectedProgresses, function () { self.Refresh(); }); }, Framework.LocalizationManager.Get("Reset"));
                _this.btnSynchronizeLocalSessions = Framework.Form.Button.Register("btnSynchronizeLocalSessions", function () { return isOnline && self.selectedProgresses.length > 0; }, function () { self.SynchronizeLocalSessions(self.selectedProgresses, function () { self.Refresh(); }); }, Framework.LocalizationManager.Get("Synchronize"));
                //let videos: Framework.KeyValuePair[] = [];
                //this.btnShowVideos = Framework.Form.ClickableElement.Register("btnShowVideos", () => {
                //    let db = localforage.createInstance({
                //        name: "Videos"
                //    });
                //    db.iterate(function (value, key, iterationNumber) {
                //        videos.push({ Key: key, Value: value });
                //    });
                //    return videos.length > 0;
                //}, () => {
                //    let db = localforage.createInstance({
                //        name: "Videos"
                //    });
                //    db.iterate(function (value, key, iterationNumber) {
                //        alert(key);
                //        videos.push({ Key: key, Value: value });
                //    });
                //    alert(videos.length.toString());
                //});
                //this.divLocalSessionsTable = <HTMLDivElement>document.getElementById("divLocalSessionsTable");
                _this.spanLocalSessionsSize = Framework.Form.TextElement.Register("spanLocalSessionsSize");
                return _this;
            }
            LocalSessionsViewModel.prototype.Refresh = function () {
                // Espace disponible/utilisé
                var actualSize = Framework.LocalStorage.GetLocalStorageActualSize();
                var totalSize = 5 * 1048576; // 5Mo TODO : ajuster en fonction du navigateur
                var remainingSize = totalSize - actualSize;
                this.spanLocalSessionsSize.Set(Math.round(actualSize / 1048576) + "/" + Math.round(totalSize / 1048576) + " Mo (" + Math.round((actualSize * 100) / totalSize) + " %)");
                var self = this;
                //TODO : couleur des cellules
                this.progresses = this.GetSessionsFromLocalStorage(false);
                var table = new Framework.Form.Table();
                table.CanSelect = false;
                table.ShowFooter = false;
                table.ListData = this.progresses;
                table.Height = "30vh";
                table.FullWidth = true;
                table.CanExport = false;
                table.CanSelect = true;
                table.AddCol("ServerCode", "Code séance", 70, "left");
                table.AddCol("SubjectCode", "Code juge", 70, "left");
                table.AddCol("LastAccess", "Dernière MAJ", 70, "left");
                table.AddCol("LastDownload", "Dernière synchronisation", 70, "left");
                table.AddCol("Screen", "Avancement", 70, "left");
                table.AddCol("Data", "Données", 70, "left");
                table.AddCol("Size", "Espace disque", 70, "left");
                table.Render(document.getElementById("divLocalSessionsTable"));
                table.OnSelectionChanged = function (selection) {
                    self.selectedProgresses = selection.map(function (x) { return x.Progress; });
                    self.btnSynchronizeLocalSessions.CheckState();
                    self.btnZipLocalSessions.CheckState();
                    self.btnDeleteLocalSessions.CheckState();
                    self.btnResetLocalSessions.CheckState();
                };
                //Framework.Form.DataTable.AppendToDiv("", "30vh", document.getElementById("divLocalSessionsTable"), Models.LocalSessionProgress.GetDataTableParameters(this.progresses), (dt) => {
                //    self.tableLocalSessions = dt;
                //}, (listSelectedProgresses: Models.LocalSessionProgress[]) => {
                //    self.selectedProgresses = listSelectedProgresses.map(x => x.Progress);
                //    self.btnSynchronizeLocalSessions.CheckState();
                //    self.btnZipLocalSessions.CheckState();
                //    self.btnDeleteLocalSessions.CheckState();
                //    self.btnResetLocalSessions.CheckState();
                //});
            };
            return LocalSessionsViewModel;
        }(Framework.ViewModel));
        ViewModels.LocalSessionsViewModel = LocalSessionsViewModel;
        var ScreenReaderViewModel = /** @class */ (function (_super) {
            __extends(ScreenReaderViewModel, _super);
            function ScreenReaderViewModel() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ScreenReaderViewModel;
        }(Framework.ViewModel));
        ViewModels.ScreenReaderViewModel = ScreenReaderViewModel;
    })(ViewModels || (ViewModels = {}));
})(Panelist || (Panelist = {}));
//# sourceMappingURL=app.js.map