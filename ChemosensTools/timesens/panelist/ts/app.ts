module Panelist {

    export class App extends Framework.App {

        protected currentViewContainerName: string = "content";

        protected onConnectivityChanged(isOnline: boolean) {
            this.isOnline = isOnline;
        }

        protected onError(error: string) {
            Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), error);
        }

        public static GetRequirements(): Framework.ModuleRequirements {
            let requirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
            if (window.location.hostname.indexOf("localhost") > -1) {
                requirements.AppUrl = 'http://localhost:44301/timesens';
                requirements.FrameworkUrl = 'http://localhost:44301/framework';
                requirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
            } else {
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
            requirements.Recommanded = ["getusermedia", "localstorage", "placeholder", "fileinput", /*"filesystem"*/, "filereader", "oninput", /*"contains"*/, "progressbar", "hidden", "classlist", "cssvwunit", "cssvhunit", "cssvalid", "csstransitions", "textshadow", "rgba", /*"cssresize"*/, "opacity", "mediaqueries", "cssgradients", "fontface", "flexbox", "ellipsis", "checked", "csscalc", "boxsizing", "boxshadow", "borderradius", "bgsizecover", "backgroundsize", "bgpositionxy", "video", "svg", "input", "fullscreen", "audio", "serviceworker", "fetch"];
            requirements.Required = ["atobbtoa", "webworkers", "json", "eventlistener", "cryptography", "blobconstructor"];

            requirements.Extensions = ["DataTable", "Slider", "Crypto", "Zip", "Speech", "Capture", "Offline", "Barcode", "VirtualKeyboard"];
            return requirements;
        }

        // Divs de index.html
        private headerDiv: HTMLDivElement;
        private footerDiv: HTMLDivElement;
        private contentDiv: HTMLDivElement;
        private progressDiv: HTMLDivElement;

        //private btnBrowserCompatibilityIssue: Framework.Form.ClickableElement;
        //private btnBrowserCompatibilityError: Framework.Form.ClickableElement;
        //private btnBrowserCompatibility: Framework.Form.ClickableElement;
        private btnLocalStorage: Framework.Form.ClickableElement;
        private btnInternetConnection: Framework.Form.ClickableElement;
        private btnNoInternetConnection: Framework.Form.ClickableElement;
        //private btnInstall: Framework.Form.ClickableElement;
        //private anchorVersion: Framework.Form.ClickableElement;
        private changeLog: string;
        private spanVersion: Framework.Form.TextElement;

        public OnVersionChanged: () => void;

        private reader: ScreenReader.Reader;

        public OnReaderLoaded: () => void;

        // Paramètres d'URL
        private serverCode: string = ""; // Code serveur du formulaire
        private subjectCode: string = ""; // Code sujet du formulaire
        private password: string = ""; // Mot de passe du formulaire              
        private startDemoParameter: string = ""; // Mode démonstration              

        private forceLocalProgress: boolean = false; // Si true, cela veut dire que le progrès server est plus récent que le progrès local -> Affiche un warning                
        private isVirtualKeyboardEnabled: boolean = false; // Clavier virtuel activé
        private isLocked = false;// Gestion du verrouillage
        private isAutoSynchronized = false; // Synchronisation automatique au démarrage
        private isInSimulationMode: boolean = false;
        private isInPanelLeaderMode: boolean = false;
        private isInScreenshotMode: boolean = false;
        private screensBySheet: number = 2;

        protected start(fullScreen: boolean = false) {
            super.start(fullScreen);

            let self = this;

            // Extraction des paramètres de l'URL
            this.serverCode = "";
            this.subjectCode = "";
            this.password = "";
            this.startDemoParameter = "";
            this.isInPanelLeaderMode = false;
            this.isInScreenshotMode = false;
            let language: string = "";

            let urlParameters = this.queryString;

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
                    let b64 = urlParameters["id"];

                    let parameters = Framework.Browser.GetQueryStringParameters(atob(b64));

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
            } else {
                // Language mémorisé
                if (Framework.LocalStorage.GetFromLocalStorage("Language") != null) {
                    this.changeLanguage(Framework.LocalStorage.GetFromLocalStorage("Language"));
                }
            }

            // Chargement des paramètres mémorisés
            let isLock = JSON.parse(Framework.LocalStorage.GetFromLocalStorage("IsLock"));
            this.isLocked = isLock != null ? isLock : false;
            let virtualKeyboardEnabled = JSON.parse(Framework.LocalStorage.GetFromLocalStorage("VirtualKeyboardEnabled"));
            this.isVirtualKeyboardEnabled = virtualKeyboardEnabled != null ? virtualKeyboardEnabled : false;
            let autoSynchronization = JSON.parse(Framework.LocalStorage.GetFromLocalStorage("AutoSynchronization"));
            this.isAutoSynchronized = autoSynchronization != null ? autoSynchronization : false;

            if (this.isAutoSynchronized == true) {
                // Synchronisation automatique des sessions non synchronisées
                let localSessions: Models.Progress[] = this.getLocalSessionFromLocalStorage(true);
                this.synchronizeLocalSessions(localSessions, () => {
                    Framework.Modal.Alert(Framework.LocalizationManager.Get("Info"), Framework.LocalizationManager.Get("LocalSessionsSynchronized"));
                });
            }

            this.setFooter();

            // Containers du fichier index.html
            this.headerDiv = <HTMLDivElement>document.getElementById("header");
            this.contentDiv = <HTMLDivElement>document.getElementById("content");
            this.progressDiv = <HTMLDivElement>document.getElementById("progress");

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
        }

        private setFooter() {

            let self = this;

            this.footerDiv = <HTMLDivElement>document.getElementById("footer");
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
            } else {
                this.btnNoInternetConnection.Show();
                this.btnNoInternetConnection.Highlight('top');
            }
        }

        protected showView(htmlPath: string, viewModelFactory: () => Framework.ViewModel) {
            let self = this;
            super.showView(htmlPath, viewModelFactory, (vm: Framework.ViewModel) => {

                if (htmlPath == "html/ViewScreenReader.html") {
                    self.footerDiv.style.display = "none";
                    self.headerDiv.style.display = "none";
                    self.contentDiv.style.height = "100%";
                    self.contentDiv.style.top = "0";
                } else {
                    self.footerDiv.style.display = "block";
                    self.headerDiv.style.display = "block";
                    self.contentDiv.style.height = "65%";
                    self.contentDiv.style.top = "25%";
                }
            });
        }

        // Affiche le menu principal
        private showMainMenu() {
            let self = this;
            this.showView("html/ViewMenu.html", () => {
                let vm = new ViewModels.MenuViewModel(Framework.Browser.CanUseLocalFile(), self.isLocked);
                vm.ShowRunSessionMenu = () => { self.showRunSessionMenu(); };
                vm.ShowLocalSessionsMenu = () => { self.showLocalSessionsMenu(); };
                vm.ShowSettingsMenu = () => { self.showSettingsMenu(); };
                vm.ShowHelp = () => { self.showHelp(); };
                return vm;
            });
        }

        // Affiche le menu local sessions
        private showLocalSessionsMenu() {
            let self = this;

            this.showView("html/ViewLocalSessions.html", () => {
                let vm = new ViewModels.LocalSessionsViewModel(self.isOnline);

                vm.ZipLocalSessions = (progresses: Models.Progress[]) => {
                    if (progresses.length > 0) {
                        var zip = new JSZip();
                        for (var i = 0; i < progresses.length; i++) {
                            var subjectseance: Models.SubjectSeance = new Models.SubjectSeance();
                            var progress: Models.Progress = progresses[i];
                            subjectseance.Progress = progress;
                            subjectseance.Subject = new Models.Subject();
                            subjectseance.Subject.Code = progress.CurrentState.SubjectCode; //TODO : récupérer infos sujet
                            var json: string = JSON.stringify(subjectseance);
                            zip.file(progress.CurrentState.ServerCode + "_" + progress.CurrentState.SubjectCode + ".xml", btoa(json)); // données cryptées
                        }
                        zip.generateAsync({ type: "blob" })
                            .then(function (content) {
                                saveAs(content, "localprogress.zip");
                            });
                    }
                };

                vm.DeleteLocalSessions = (progresses: Models.Progress[], callback: Function) => {
                    if (progresses.length > 0) {
                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("ConfirmRemoval"), () => {
                            for (var i = 0; i < progresses.length; i++) {
                                Framework.LocalStorage.RemoveItem(progresses[i].GetKey());
                            }
                            callback();
                        });
                    }
                };

                vm.ResetLocalSessions = (progresses: Models.Progress[], callback: Function) => {
                    if (progresses.length > 0) {
                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("ConfirmReset"), () => {
                            for (var i = 0; i < progresses.length; i++) {
                                var progress: Models.Progress = progresses[i];
                                progress.CurrentState.CurrentScreen = 0;
                                progress.CurrentState.LastAccess = undefined;
                                progress.ListData = [];
                                Framework.LocalStorage.SaveToLocalStorage(progress.CurrentState.ServerCode + "_" + progress.CurrentState.SubjectCode, JSON.stringify(progress), true);
                            }
                            callback();
                        });
                    }
                };

                vm.SynchronizeLocalSessions = (progresses: Models.Progress[], callback: Function) => { self.synchronizeLocalSessions(progresses, callback); };

                vm.GetSessionsFromLocalStorage = (notSynchronizedOnly: boolean) => {
                    let keys: string[] = Framework.LocalStorage.GetAllLocalStorageItems().filter((x) => { return Number(x.substring(0, 7)) > 999999 }); // Teste si c'est bien une séance (code numérique au moins 7 digits)
                    let progress: Models.LocalSessionProgress[] = [];
                    for (var i = 0; i < keys.length; i++) {
                        let p: Models.Progress = Framework.Serialization.JsonToInstance<Models.Progress>(new Models.Progress(), Framework.LocalStorage.GetFromLocalStorage(keys[i], true));
                        let key: string = p.GetKey();
                        if (notSynchronizedOnly == false || (notSynchronizedOnly == true && p.CurrentState.LastUpload < p.CurrentState.LastAccess)) {

                            let lsp: Models.LocalSessionProgress = new Models.LocalSessionProgress();
                            lsp.Progress = p;
                            lsp.Key = key;
                            lsp.ServerCode = p.CurrentState.ServerCode;
                            lsp.SubjectCode = p.CurrentState.SubjectCode;
                            if (p.CurrentState.LastAccess != undefined) {
                                lsp.LastAccess = new Date(p.CurrentState.LastAccess.toString()).toLocaleString();
                            } else {
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
                }
                vm.ShowMainMenu = () => { self.showMainMenu(); };
                vm.ShowDownloadLocalSessionsMenu = () => { self.showDownloadLocalSessionsMenu(); };

                vm.Refresh();

                return vm;
            });
        }

        // Affiche le menu download local sessions
        private showDownloadLocalSessionsMenu() {
            let self = this;

            this.showView("html/ViewDownloadLocalSession.html", () => {
                let vm = new ViewModels.DownloadLocalSessionViewModel();
                vm.DownloadLocalSessions = (serverCode: string, password: string) => {

                    if (password == undefined) {
                        password = "";
                    }
                    if (serverCode != undefined && serverCode.length > 2) {

                        self.CallWCF('DownloadAllSubjectSeances', { serverCode: serverCode, password: password }, () => { }, (res) => {

                            if (res.ErrorMessage) {
                                Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get(res.ErrorMessage));
                                return;
                            }

                            if (res.Result) {
                                let sessions: Models.SubjectSeance[] = [];
                                Framework.Serialization.JsonToInstance<Models.SubjectSeance[]>(sessions, res.Result);
                                sessions.forEach((x) => {
                                    Framework.FileHelper.SaveObjectAs(x, x.Access.ServerCode + "_" + x.Subject.Code + ".xml");
                                });
                            }

                        });

                    }
                };
                vm.ShowLocalSessionsMenu = () => { self.showLocalSessionsMenu(); };
                return vm;
            });
        }

        // Affiche le menu settings
        private showSettingsMenu() {

            let self = this;
            this.showView("html/ViewSettings.html", () => {
                let vm = new ViewModels.SettingsViewModel(self.isVirtualKeyboardEnabled, self.isLocked, self.isOnline, self.isAutoSynchronized);

                vm.ToggleLanguage = () => {
                    switch (Framework.LocalizationManager.GetDisplayLanguage()) {
                        case "en":
                            Framework.LocalizationManager.SetDisplayLanguage("fr");
                            break;
                        case "fr":
                            Framework.LocalizationManager.SetDisplayLanguage("en");
                            break;
                    }
                    Framework.LocalStorage.SaveToLocalStorage("Language", Framework.LocalizationManager.GetDisplayLanguage());
                }

                vm.ToggleVirtualKeyboard = () => {
                    self.isVirtualKeyboardEnabled = !self.isVirtualKeyboardEnabled;
                    // Clavier virtuel : tous les éléments de class vk            
                    if (self.isVirtualKeyboardEnabled == true) {
                        Framework.VirtualKeyboard.Enable('.vk');
                    } else {
                        Framework.VirtualKeyboard.Disable('.vk');
                    }
                    Framework.LocalStorage.SaveToLocalStorage("VirtualKeyboardEnabled", JSON.stringify(self.isVirtualKeyboardEnabled));
                    vm.SetToggleVirtualKeyboardValue(self.isVirtualKeyboardEnabled);
                }

                vm.ToggleLock = () => {
                    self.toggleLock();
                    vm.SetToggleLockValue(self.isLocked);
                }

                vm.ToggleSynchronization = () => {
                    self.isAutoSynchronized = !self.isAutoSynchronized;
                    Framework.LocalStorage.SaveToLocalStorage("AutoSynchronization", JSON.stringify(self.isAutoSynchronized));
                    vm.SetToggleSynchronizationValue(self.isAutoSynchronized);
                }

                vm.ShowMainMenu = () => { self.showMainMenu(); }

                return vm;
            });
        }

        // Affiche le menu run session
        private showRunSessionMenu() {
            let self = this;
            this.showView("html/ViewRunSession.html", () => {
                let vm = new ViewModels.RunSessionViewModel(self.isOnline, Framework.Browser.CanUseLocalFile());
                vm.ShowRunFromServerCodeMenu = (checkStart: boolean) => { self.showRunFromServerCodeMenu(checkStart); };
                vm.ShowRunFromLocalFileMenu = () => { self.showRunFromLocalFileMenu(); };
                vm.ShowMainMenu = () => { self.showMainMenu(); };
                return vm;
            });
        }

        // Affiche le menu run session from local file
        private showRunFromLocalFileMenu() {
            let self = this;
            this.showView("html/ViewLocalFile.html", () => {
                let vm = new ViewModels.RunFromLocalFileViewModel();
                vm.ShowRunSessionMenu = () => { self.showRunSessionMenu(); };
                vm.StartFromLocalFile = (file: File) => {
                    // Lecture du fichier local
                    var fileReader: FileReader = new FileReader();

                    fileReader.onload = function (e) {
                        let json: string = <any>fileReader.result;
                        self.startSubjectSessionFromJson(json, false, true);
                    }
                    fileReader.readAsText(file);
                };
                return vm;
            });
        }

        // Affiche l'écran courant de screenReader et cache le header et footer
        private showCurrentSubjectSessionScreen() {
            let self = this;
            this.showView("html/ViewScreenReader.html", () => {
                let vm = new ViewModels.ScreenReaderViewModel();
                return vm;
            });

        }

        // Affiche le menu run session from server code
        private showRunFromServerCodeMenu(checkStart: boolean, servercode: string = "") {
            let self = this;
            this.showView("html/ViewRunFromServerCode.html", () => {
                let vm = new ViewModels.RunFromServerCodeViewModel(servercode);
                vm.DownloadSubjectSession = () => { self.downloadSubjectSession(); };
                vm.ShowRunSessionMenu = () => { self.showRunSessionMenu(); };
                vm.SetServerCode = (serverCode: string) => { self.serverCode = serverCode; };
                vm.SetSubjectCode = (subjectCode: string) => { self.subjectCode = subjectCode; };
                vm.SetPassword = (password: string) => { self.password = password; };
                vm.GetListSubjectsForSeance = (serverCode: string, callback: (res: Framework.WCF.WCFResult) => void) => {
                    self.CallWCF('GetListSubjectsForSeance', { serverCode: serverCode }, () => { }, (res) => { callback(res); });
                }
                return vm;
            });
        }

        // Affiche l'aide dans une boite modale
        private showHelp() {
            //TODO : redirection vers page spécifique
            Framework.Modal.Alert(Framework.LocalizationManager.Get("Help"), 'Work in progress');
        }

        // Synchronisation des séances locales sélectionnées avec le serveur
        private synchronizeLocalSessions(progresses: Models.Progress[], callback: Function) {

            let self = this;

            if (progresses.length > 0) {
                for (var i = 0; i < progresses.length; i++) {
                    var progress: Models.Progress = progresses[i];
                    var json: string = JSON.stringify(progress);
                    //TODO : progressbar, vérifier sur serveur si pas maj plus récente
                    self.uploadProgress(progress.CurrentState.ServerCode, progress.CurrentState.SubjectCode, progress,
                        (res) => {
                            if (res.ErrorMessage) {
                                return;
                            }
                            let serverProgress: Models.Progress = Framework.Serialization.JsonToInstance<Models.Progress>(new Models.Progress(), res.Result);
                            //progress.CurrentState.CurrentScreen = serverProgress.CurrentState.CurrentScreen;
                            progress.CurrentState.LastAccess = serverProgress.CurrentState.LastAccess;
                            progress.CurrentState.LastUpload = serverProgress.CurrentState.LastUpload;
                            progress.Notification = serverProgress.Notification;
                            Framework.LocalStorage.SaveToLocalStorage(progress.GetKey(), JSON.stringify(progress), true);

                        });
                    callback();
                }
            }
        }

        // Renvoie un tableau des avancements enregistrés dans le local storage
        private getLocalSessionFromLocalStorage(notSynchronizedOnly: boolean = false): Models.Progress[] {

            let keys: string[] = Framework.LocalStorage.GetAllLocalStorageItems().filter((x) => { return Number(x.substring(0, 7)) > 999999 }); // Teste si c'est bien une séance (code numérique au moins 7 digits)
            let progress: Models.Progress[] = [];
            for (var i = 0; i < keys.length; i++) {
                let p: Models.Progress = Framework.Serialization.JsonToInstance<Models.Progress>(new Models.Progress(), Framework.LocalStorage.GetFromLocalStorage(keys[i], true));
                if (notSynchronizedOnly == false || (notSynchronizedOnly == true && p.CurrentState.LastUpload < p.CurrentState.LastAccess)) {
                    progress.push(p);
                }
            }
            return progress;
        }

        // Lance le screenreader à partir d'une chaine JSON
        private startSubjectSessionFromJson(json: string, isDemo: boolean = false, isLocal: boolean = false): void {
            let self = this;

            let login = "";
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
            var worker: Worker = new Worker(this.rootURL + "/screenreader/ReadJSONWorker.js");
            worker.onmessage = function (e) {
                var subjectSeance: Models.SubjectSeance = e.data;

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
                    var serializedLocalProgress: string = Framework.LocalStorage.GetFromLocalStorage(subjectSeance.Access.ServerCode + "_" + subjectSeance.Access.SubjectCode, true);
                    if (serializedLocalProgress != null) {
                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("LocalProgressFound"), Framework.LocalizationManager.Get("LocalProgressFoundDetail"), () => {
                            // Confirmation pour reprendre à partir de localpprogress
                            var p: Models.Progress = Framework.Serialization.JsonToInstance(new Models.Progress(), serializedLocalProgress);
                            subjectSeance.Progress = p;
                            self.reader.SetSubjectScreen(subjectSeance.Progress.CurrentState.CurrentScreen);
                        });
                    }
                }

                self.showCurrentSubjectSessionScreen();

                let readerState: ScreenReader.State = new ScreenReader.State();
                readerState.IsInDemo = isDemo;
                readerState.IsInSimulation = false;
                readerState.IsPanelLeader = self.isInPanelLeaderMode;

                let readerActions = new ScreenReader.Actions();

                readerActions.OnLastScreen = () => {
                    if (self.isInTest == false) {
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Information"), Framework.LocalizationManager.Get("CompletedSession"));
                    }
                };
                readerActions.OnNavigation = (url, blank) => {
                    if (self.isInTest == false) {
                        if (url.length > 3) {
                            Framework.Browser.NavigateToUrl(url, blank);
                        }

                    }
                };

                readerActions.OnValidationError = (message) => {
                    if (self.isInTest == false) {
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("ValidationError"), message);
                    }
                };

                readerActions.OnError = (error) => {
                    if (self.isInTest == false) {
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), error);
                    }
                }

                readerActions.OnNotification = (message) => {
                    Framework.Modal.Alert(Framework.LocalizationManager.Get("Tip"), message);
                }

                readerActions.OnSaveProgressAsPanelLeader = (callback) => {
                    Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("CurrentProgressWillReplacePreviousOne"), () => {
                        callback();
                    });
                }

                readerActions.OnBase64StringUpload = (base64string: string, filename: string) => {
                }

                readerActions.OnRScriptStarted = (rScript: string, success: Function, error: Function) => {
                }

                readerActions.OnSave = (blob: Blob, filename: string) => {
                };

                if (!isDemo) {
                    readerActions.OnProgressUpload = (action: Function, checkProgress: boolean) => {
                        //                        var json: string = JSON.stringify(self.reader.Session.Progress);

                        //alert(self.reader.Session.Progress.DisplayedScreenIndex.join(","));

                        self.uploadProgress(self.reader.Session.Access.ServerCode, self.reader.Session.Access.SubjectCode, self.reader.Session.Progress,
                            (res) => {
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
                    }
                }

                readerActions.OnBase64StringUpload = (base64string: string, filename: string) => {
                    self.CallWCF('UploadBase64String', { base64string: base64string, name: filename, servercode: self.reader.Session.Access.ServerCode }, () => { }, (res) => {
                        if (res.ErrorMessage) {
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("ErrorWhileUploadingProgress"));
                        }
                    });
                }

                readerActions.OnRScriptStarted = (rScript: string, success: Function, error: Function) => {
                    self.CallWCF('ExecuteScriptForSubjectSummary', { serverCode: self.serverCode, xmlScript: encodeURIComponent(rScript), login: "TimeSens", password: "timesens" }, () => { }, (res) => {
                        if (res.ErrorMessage) {
                            error();
                        } else {
                            success(res.Result);
                        }
                    });
                }

                readerActions.OnSave = (blob: Blob, filename: string) => {
                    Framework.FileHelper.SaveAs(blob, filename);
                };

                ScreenReader.Reader.Initialize(subjectSeance, <HTMLDivElement>document.getElementById("currentScreen"), readerActions, readerState, (reader: ScreenReader.Reader) => {

                    self.reader = reader;

                    //alert(self.reader.Session.DisplayedScreenIndex.join(","));

                    if (isDemo == false && subjectSeance.Progress != undefined) {
                        self.reader.SetSubjectScreen(subjectSeance.Progress.CurrentState.CurrentScreen);
                    } else {
                        self.reader.SetSubjectScreen(0);
                    }
                    if (self.isInScreenshotMode == true) {

                        let imgHeight = (297 / self.screensBySheet);

                        setTimeout(() => {
                            self.reader.Screenshot([], (listImg: string[]) => {
                                let div = document.createElement("div");
                                listImg.forEach((src) => {
                                    var image = new Image();
                                    image.src = src;
                                    image.style.border = "1px solid black";
                                    image.style.margin = "10px";
                                    //image.style.height = '297mm';//A4
                                    image.style.height = imgHeight + 'mm';
                                    image.style.width = 'auto';
                                    div.appendChild(image);
                                });

                                let blob = new Blob([div.outerHTML], { type: "text/html" });
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
        }

        // Télécharge une séance puis lance screenreader
        private downloadSubjectSession(): void {

            let self = this;

            if (self.serverCode.length > 0 && self.subjectCode.length > 0) {
                self.getSubjectSeanceFileSize(self.serverCode, self.subjectCode,
                    (res) => {

                        if (res.ErrorMessage) {
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("UnableToDownloadSubjectSession"));
                            self.showRunFromServerCodeMenu(false);
                            return;
                        }

                        if (res.Result.length > 0) {
                            self.downloadSubjectSeance(self.serverCode, self.subjectCode, self.password,
                                (res) => {

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
                    }
                );
            } else {
                self.showRunFromServerCodeMenu(false);
            }
        }

        // Télécharge une séance puis lance screenreader
        private downloadAnonymousSession(): void {

            let self = this;

            if (self.serverCode.length > 0) {
                self.getSubjectSeanceFileSize(self.serverCode, "",
                    (res) => {

                        if (res.ErrorMessage) {
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("UnableToDownloadSubjectSession"));
                            self.showRunFromServerCodeMenu(false);
                            return;
                        }

                        if (res.Result.length > 0) {
                            self.downloadSubjectSeance(self.serverCode, "", self.password,
                                (res) => {

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
                    }
                );
            } else {
                self.showRunFromServerCodeMenu(false);
            }
        }

        private logConnexion(login: string): void {
            let self = this;
            self.CallWCF('LogConnexion', { client: "Panelist", version: self.version, login: login }, () => { }, () => { });
        }

        private startDemo() {
            this.isInSimulationMode = true;

            let self = this;

            let file: string = "demo/" + this.startDemoParameter + ".json";
            $.get(file, function (data) {
                let json = data;
                self.startSubjectSessionFromJson(json, true, false);

            }, 'text').fail(function (xhr, status, error) {
                Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("UnableToDownloadSubjectSession"));
            });;
        }

        private changeLanguage(language: string): void {
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
        }

        private toggleLock(): boolean {
            // Change lock -> unlock
            let div: HTMLDivElement = document.createElement("div");

            let d = document.createElement("div");

            div.appendChild(d);

            let p: HTMLParagraphElement = document.createElement("p");
            let input: HTMLInputElement = document.createElement("input");
            input.type = "text";
            input.classList.add("tableInput");
            input.placeholder = Framework.LocalizationManager.Get("Password");
            p.appendChild(input);
            div.appendChild(p);
            let p2: HTMLParagraphElement = document.createElement("p");
            p2.innerText = Framework.LocalizationManager.Get("WrongPassword");
            p2.style.color = "red";
            p2.style.display = "none";
            div.appendChild(p2);

            let self = this;

            let setLock = function () {
                self.isLocked = !self.isLocked;

            }

            if (self.isLocked == false) {
                d.innerHTML = Framework.LocalizationManager.Get("ConfirmLockUI");
                // Message pour bloquer l'UI
                Framework.Modal.Confirm(Framework.LocalizationManager.Get("LockUI"), div, () => {
                    if (input.value.length > 0) {
                        self.isLocked = true;
                        Framework.LocalStorage.SaveToLocalStorage("IsLock", JSON.stringify(self.isLocked));
                        Framework.LocalStorage.SaveToLocalStorage("UIPassword", input.value);
                    }
                });
            } else {
                d.innerHTML = Framework.LocalizationManager.Get("ConfirmUnlockUI");
                // Message pour débloquer l'UI avec le mot de passe
                Framework.Modal.Confirm(Framework.LocalizationManager.Get("LockUI"), div, () => {
                    if (input.value == Framework.LocalStorage.GetFromLocalStorage("UIPassword")) {
                        self.isLocked = false;
                        Framework.LocalStorage.SaveToLocalStorage("IsLock", JSON.stringify(self.isLocked));
                    } else {
                        Framework.LocalStorage.SaveToLocalStorage("IsLock", JSON.stringify(self.isLocked));
                        p2.style.display = "block";
                    }
                });
            }

            return (self.isLocked);
        }

        private getSubjectSeanceFileSize(serverCode: string, subjectCode: string, callback: (res: Framework.WCF.WCFResult) => void) {
            this.CallWCF('GetSubjectSeanceFileSize', { serverCode: serverCode, subjectCode: subjectCode }, () => { }, (res) => { callback(res); });
        }

        private downloadSubjectSeance(serverCode: string, subjectCode: string, password: string, callback: (res: Framework.WCF.WCFResult) => void) {
            this.CallWCF('DownloadSubjectSeance', { serverCode: serverCode, subjectCode: subjectCode, password: password }, () => { }, (res) => { callback(res); });
        }

        private uploadProgress(serverCode: string, subjectCode: string, progress: Models.Progress, callback: (res: Framework.WCF.WCFResult) => void) {

            let self = this;

            this.CallWCF('UploadProgress', {
                serverCode: serverCode,
                subjectCode: subjectCode,
                xmlProgress: JSON.stringify(progress)
            }, () => { }, (res) => {
                callback(res);
            });
        }

    }

    module ViewModels {

        export class RunSessionViewModel extends Framework.ViewModel {

            private btnShowStartFromServerCodeMenu: Framework.Form.ClickableElement;
            private btnShowStartFromLocalFileMenu: Framework.Form.ClickableElement;
            private btnBackFromRunSessionMenu: Framework.Form.ClickableElement;

            public CanUseLocalFile: boolean;
            public ShowRunFromServerCodeMenu: (t: boolean) => void;
            public ShowRunFromLocalFileMenu: () => void;
            public ShowMainMenu: () => void;

            constructor(isOnline: boolean, canUseLocalFile: boolean) {
                super();
                let self = this;
                this.btnShowStartFromServerCodeMenu = Framework.Form.ClickableElement.Register("btnShowStartFromServerCodeMenu", () => {
                    return isOnline;
                }, () => { self.ShowRunFromServerCodeMenu(true); });
                this.btnShowStartFromLocalFileMenu = Framework.Form.ClickableElement.Register("btnShowStartFromLocalFileMenu", () => {
                    return canUseLocalFile;
                }, () => { self.ShowRunFromLocalFileMenu(); });
                this.btnBackFromRunSessionMenu = Framework.Form.ClickableElement.Register("btnBackFromRunSessionMenu", undefined, () => { self.ShowMainMenu(); });
            }

        }

        export class SettingsViewModel extends Framework.ViewModel {

            private btnToggleLanguage: Framework.Form.ClickableElement;
            //private btnToggleVirtualKeyboard: Framework.Form.ClickableElement;
            //private btnToggleLock: Framework.Form.ClickableElement;
            private btnToggleFullScreen: Framework.Form.ClickableElement;
            //private btnToggleSynchronization: Framework.Form.ClickableElement;
            private btnBackFromSettingsMenu: Framework.Form.ClickableElement;

            private spanToggleLanguageValue: Framework.Form.TextElement;
            private spanToggleVirtualKeyboardValue: Framework.Form.TextElement;
            private spanToggleLockValue: Framework.Form.TextElement;
            private spanToggleFullScreenValue: Framework.Form.TextElement;
            private spanToggleSynchronizationValue: Framework.Form.TextElement;

            public ToggleLanguage: () => void;
            public ToggleVirtualKeyboard: () => void;
            public ToggleLock: () => void;
            public ToggleSynchronization: () => void;
            public ShowMainMenu: () => void;

            constructor(isVirtualKeyboardEnabled: boolean, isLocked: boolean, isOnline: boolean, isAutoSynchronized: boolean) {
                super();

                let self = this;

                this.btnToggleLanguage = Framework.Form.ClickableElement.Register("btnToggleLanguage", undefined, () => {
                    self.ToggleLanguage();
                    self.spanToggleLanguageValue.Set(Framework.LocalizationManager.GetDisplayLanguage().toUpperCase());
                });

                //this.btnToggleVirtualKeyboard = Framework.Form.ClickableElement.Register("btnToggleVirtualKeyboard", undefined, () => {
                //    self.ToggleVirtualKeyboard();                    
                //});

                //this.btnToggleLock = Framework.Form.ClickableElement.Register("btnToggleLock", () => { return true; }, () => {
                //    self.ToggleLock();                    
                //});

                this.btnToggleFullScreen = Framework.Form.ClickableElement.Register("btnToggleFullScreen", undefined, () => {
                    Framework.Browser.ToggleFullScreen();
                });

                //this.btnToggleSynchronization = Framework.Form.ClickableElement.Register("btnToggleSynchronization", () => { return isOnline; }, () => {
                //    self.ToggleSynchronization();                    
                //});

                this.btnBackFromSettingsMenu = Framework.Form.ClickableElement.Register("btnBackFromSettingsMenu", () => { return true; }, () => {
                    self.ShowMainMenu();
                });

                this.spanToggleLanguageValue = Framework.Form.TextElement.Register("spanToggleLanguageValue", Framework.LocalizationManager.GetDisplayLanguage().toUpperCase());
                //this.spanToggleVirtualKeyboardValue = Framework.Form.TextElement.Register("spanToggleVirtualKeyboardValue", this.BoolToSwitch(isVirtualKeyboardEnabled));
                //this.spanToggleLockValue = Framework.Form.TextElement.Register("spanToggleLockValue", this.BoolToSwitch(isLocked));
                this.spanToggleFullScreenValue = Framework.Form.TextElement.Register("spanToggleFullScreenValue", this.BoolToSwitch(Framework.Browser.IsFullScreen));
                //this.spanToggleSynchronizationValue = Framework.Form.TextElement.Register("spanToggleSynchronizationValue", this.BoolToSwitch(isAutoSynchronized));
            }

            public BoolToSwitch(b: boolean): string {
                let res: string = b == true ? "ON" : "OFF";
                return res;
            }

            public SetToggleVirtualKeyboardValue(isVirtualKeyboardEnabled) {
                this.spanToggleVirtualKeyboardValue.Set(this.BoolToSwitch(isVirtualKeyboardEnabled));
            }

            public SetToggleSynchronizationValue(synchronization) {
                this.spanToggleSynchronizationValue.Set(this.BoolToSwitch(synchronization));
            }

            public SetToggleLockValue(lock) {
                this.spanToggleLockValue.Set(this.BoolToSwitch(lock));
            }

        }

        export class MenuViewModel extends Framework.ViewModel {

            private btnShowRunSessionMenu: Framework.Form.ClickableElement;
            private btnShowLocalSessionsMenu: Framework.Form.ClickableElement;
            private btnShowSettingsMenu: Framework.Form.ClickableElement;
            //private btnShowHelpMenu: Framework.Form.ClickableElement;

            public ShowRunSessionMenu: () => void;
            public ShowLocalSessionsMenu: () => void;
            public ShowSettingsMenu: () => void;
            public ShowHelp: () => void;

            constructor(canUseLocalFile: boolean, isLocked: boolean) {
                super();
                let self = this;
                this.btnShowRunSessionMenu = Framework.Form.ClickableElement.Register("btnShowRunSessionMenu", () => { return true; }, () => { self.ShowRunSessionMenu(); });
                this.btnShowLocalSessionsMenu = Framework.Form.ClickableElement.Register("btnShowLocalSessionsMenu", () => {
                    return (canUseLocalFile == true && isLocked == false)
                }, () => { self.ShowLocalSessionsMenu(); });
                this.btnShowSettingsMenu = Framework.Form.ClickableElement.Register("btnShowSettingsMenu", () => { return true; }, () => { self.ShowSettingsMenu(); });
                //this.btnShowHelpMenu = Framework.Form.ClickableElement.Register("btnShowHelpMenu", () => { return true; }, () => { self.ShowHelp(); });
            }

        }

        export class RunFromLocalFileViewModel extends Framework.ViewModel {

            private btnBackFromLocalFileMenu: Framework.Form.ClickableElement;
            private btnBrowseLocalFile: Framework.Form.ClickableElement;
            private inputLocalFile: Framework.Form.InputFile;

            public StartFromLocalFile: (file: File) => void;
            public ShowRunSessionMenu: () => void;

            constructor() {
                super();

                let self = this;

                this.btnBackFromLocalFileMenu = Framework.Form.ClickableElement.Register("btnBackFromLocalFileMenu", undefined, () => { self.ShowRunSessionMenu(); });
                this.btnBrowseLocalFile = Framework.Form.ClickableElement.Register("btnBrowseLocalFile", undefined, () => {
                    self.inputLocalFile.Click();
                });
                this.inputLocalFile = Framework.Form.InputFile.Register("inputLocalFile", (file) => {
                    self.StartFromLocalFile(file)
                    //form.reset();
                });
            }
        }

        export class RunFromServerCodeViewModel extends Framework.ViewModel {

            private inputServerCode: Framework.Form.InputText;
            private inputSubjectCode: Framework.Form.InputText;
            private inputPassword: Framework.Form.InputText;
            private selectSubjectCode: Framework.Form.Select;
            private btnSelectSubjectCode: Framework.Form.ClickableElement;
            private btnStartFromServerCode: Framework.Form.ClickableElement;
            private btnBackFromServerCodeMenu: Framework.Form.ClickableElement;

            public OnGetListSubjectsForSeanceCompleted: (list: string[]) => void;
            public OnGetListSubjectsForSeanceFailed: (message: string) => void;
            public DownloadSubjectSession: () => void;

            public SetServerCode: (serverCode: string) => void;
            public SetSubjectCode: (subjectCode: string) => void;
            public SetPassword: (password: string) => void;
            public ShowRunSessionMenu: () => void;
            public GetListSubjectsForSeance: (serverCode: string, callback: (res: Framework.WCF.WCFResult) => void) => void;

            private validateServerCode(serverCode: string): string {
                let self = this;
                let res = "";
                if (serverCode.length == 0) {
                    res = Framework.LocalizationManager.Get("ServerCodeRequired");
                } else if (isNaN(parseFloat(serverCode))) {
                    res = Framework.LocalizationManager.Get("NumericInputOnly");
                } else if (serverCode.length < 7) {
                    res = Framework.LocalizationManager.Get("AtLeast6Digits");
                }
                return res;
            }

            constructor(servercode: string = "") {
                super();

                let self = this;

                this.inputServerCode = Framework.Form.InputText.Register("inputServerCode", servercode, Framework.Form.Validator.Custom(this.validateServerCode), (serverCode: string) => {
                    if (self.inputServerCode.IsValid == true) {
                        self.GetListSubjectsForSeance(serverCode,
                            (res) => {
                                if (res.Result) {
                                    self.SetServerCode(serverCode);
                                    var arrayOfSubjects: string[] = JSON.parse(res.Result);

                                    if (arrayOfSubjects.length > 0) {
                                        let listKvp: Framework.KeyValuePair[] = [];
                                        arrayOfSubjects.forEach((subject) => {
                                            listKvp.push(new Framework.KeyValuePair(subject, subject));
                                        });
                                        self.selectSubjectCode.SetValues(listKvp);

                                        // Sélection du premier juge dispo
                                        self.selectSubjectCode.HighlightOn(Framework.LocalizationManager.Get("SelectSubjectInTheDropDownList"));
                                        self.btnSelectSubjectCode.Enable();
                                        if (self.OnGetListSubjectsForSeanceCompleted) {
                                            self.OnGetListSubjectsForSeanceCompleted(arrayOfSubjects);
                                        }
                                        self.btnStartFromServerCode.Enable();
                                    }
                                } else {
                                    self.inputServerCode.Invalidate(Framework.LocalizationManager.Get("NoMatchingServerCodeFound"));
                                    self.btnStartFromServerCode.Disable();
                                    if (self.OnGetListSubjectsForSeanceFailed) {
                                        self.OnGetListSubjectsForSeanceFailed(Framework.LocalizationManager.Get("NoMatchingServerCodeFound"));
                                    }


                                }
                            });
                    } else if (self.OnGetListSubjectsForSeanceFailed) {
                        self.OnGetListSubjectsForSeanceFailed(self.inputServerCode.ValidationMessage);
                    }
                    self.btnStartFromServerCode.CheckState();
                }, true);

                this.inputSubjectCode = Framework.Form.InputText.Register("inputSubjectCode", "", Framework.Form.Validator.MinLength(0, Framework.LocalizationManager.Get("SubjectCodeRequired")), (subjectCode: string) => {
                    self.SetSubjectCode(subjectCode);
                    self.btnStartFromServerCode.CheckState();
                }, true);

                this.inputPassword = Framework.Form.InputText.Register("inputPassword", "", undefined, (password: string) => {
                    self.SetPassword(password);
                    return "";
                }, false);

                this.selectSubjectCode = Framework.Form.Select.Register("selectSubjectCode", "", [], Framework.Form.Validator.NotEmpty(), (subjectCode: string) => {
                    self.inputSubjectCode.Set(subjectCode);
                    if (self.selectSubjectCode) {
                        self.selectSubjectCode.Hide();
                        self.btnSelectSubjectCode.Show();
                    }
                    self.inputSubjectCode.Show();
                });

                this.btnSelectSubjectCode = Framework.Form.ClickableElement.Register("btnSelectSubjectCode", undefined, () => {
                    self.selectSubjectCode.Show();
                    var length = $('#selectSubjectCode> option').length;
                    $(self.selectSubjectCode.HtmlElement).attr('size', length);
                    self.inputSubjectCode.Hide();
                    self.btnSelectSubjectCode.Hide();
                });

                this.btnStartFromServerCode = Framework.Form.ClickableElement.Register("btnStartFromServerCode", () => {
                    let res = self.inputSubjectCode.Value.length > 0 && self.inputServerCode.Value.length > 6;
                    return res;
                }, () => {
                    self.DownloadSubjectSession();
                });
                this.btnBackFromServerCodeMenu = Framework.Form.ClickableElement.Register("btnBackFromServerCodeMenu", undefined, () => { self.ShowRunSessionMenu(); });

                this.selectSubjectCode.SetValues([]);
                this.selectSubjectCode.Hide();
                this.inputSubjectCode.Show();
            }

        }

        export class DownloadLocalSessionViewModel extends Framework.ViewModel {

            private inputDownloadLocalSessionServerCode: Framework.Form.InputText;
            private inputDownloadLocalSessionPassword: Framework.Form.InputText;
            private btnBackFromDownloadLocalSessionsMenu: Framework.Form.ClickableElement;
            private btnDownloadLocalSessions: Framework.Form.ClickableElement;

            private serverCode: string;
            private password: string;

            public DownloadLocalSessions: (serverCode: string, password: string) => void;
            public ShowLocalSessionsMenu: () => void;

            constructor() {
                super();

                let self = this;

                this.inputDownloadLocalSessionServerCode = Framework.Form.InputText.Register("inputDownloadLocalSessionServerCode", "", Framework.Form.Validator.MinLength(6), (serverCode: string) => {
                    self.serverCode = serverCode;
                    self.btnDownloadLocalSessions.CheckState();
                }, true);
                this.inputDownloadLocalSessionPassword = Framework.Form.InputText.Register("inputDownloadLocalSessionPassword", "", undefined, (password: string) => {
                    self.password = password;
                }, true);
                this.btnDownloadLocalSessions = Framework.Form.ClickableElement.Register("btnDownloadLocalSessions", () => {
                    return self.serverCode && self.serverCode.length >= 6; //TODO : comme dans runfromservercodeview 
                }, () => {
                    self.ShowLocalSessionsMenu();
                });
                this.btnBackFromDownloadLocalSessionsMenu = Framework.Form.ClickableElement.Register("btnBackFromDownloadLocalSessionsMenu",
                    undefined, () => {
                        self.DownloadLocalSessions(self.serverCode, self.password);
                    });
            }
        }

        export class LocalSessionsViewModel extends Framework.ViewModel {

            //TODO : utiliser localforage

            private spanLocalSessionsSize: Framework.Form.TextElement;
            private btnBackFromLocalSessionsMenu: Framework.Form.ClickableElement;
            private btnShowDownloadLocalSessionsMenu: Framework.Form.Button;
            private btnZipLocalSessions: Framework.Form.Button;
            private btnDeleteLocalSessions: Framework.Form.Button;
            private btnResetLocalSessions: Framework.Form.Button;
            private btnSynchronizeLocalSessions: Framework.Form.Button;

            //private btnShowVideos: Framework.Form.ClickableElement;


            private tableLocalSessions: Framework.Form.DataTable;

            private progresses: Models.LocalSessionProgress[] = [];
            private selectedProgresses: Models.Progress[] = [];

            public ZipLocalSessions: (progresses: Models.Progress[]) => void;
            public DeleteLocalSessions: (progresses: Models.Progress[], callback: Function) => void;
            public ResetLocalSessions: (progresses: Models.Progress[], callback: Function) => void;
            public SynchronizeLocalSessions: (progresses: Models.Progress[], callback: Function) => void;
            public GetSessionsFromLocalStorage: (notSynchronizedOnly: boolean) => Models.LocalSessionProgress[];

            public ShowMainMenu: () => void;
            public ShowDownloadLocalSessionsMenu: () => void;

            constructor(isOnline: boolean) {
                super();

                let self = this;

                this.btnBackFromLocalSessionsMenu = Framework.Form.ClickableElement.Register("btnBackFromLocalSessionsMenu", undefined, () => { self.ShowMainMenu(); });

                this.btnShowDownloadLocalSessionsMenu = Framework.Form.Button.Register("btnShowDownloadLocalSessionsMenu", () => { return isOnline; }, () => {
                    self.ShowDownloadLocalSessionsMenu();
                }, Framework.LocalizationManager.Get("Download"));

                this.btnZipLocalSessions = Framework.Form.Button.Register("btnZipLocalSessions", () => {
                    return self.selectedProgresses.length > 0;
                }, () => { self.ZipLocalSessions(self.selectedProgresses); }, Framework.LocalizationManager.Get("SaveAsZip"));

                this.btnDeleteLocalSessions = Framework.Form.Button.Register("btnDeleteLocalSessions", () => { return self.selectedProgresses.length > 0; }, () => {
                    self.DeleteLocalSessions(self.selectedProgresses, () => { self.Refresh(); });
                }, Framework.LocalizationManager.Get("Delete"));

                this.btnResetLocalSessions = Framework.Form.Button.Register("btnResetLocalSessions", () => { return self.selectedProgresses.length > 0; }, () => { self.ResetLocalSessions(self.selectedProgresses, () => { self.Refresh(); }); }, Framework.LocalizationManager.Get("Reset"));

                this.btnSynchronizeLocalSessions = Framework.Form.Button.Register("btnSynchronizeLocalSessions", () => { return isOnline && self.selectedProgresses.length > 0; }, () => { self.SynchronizeLocalSessions(self.selectedProgresses, () => { self.Refresh(); }); }, Framework.LocalizationManager.Get("Synchronize"));

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
                this.spanLocalSessionsSize = Framework.Form.TextElement.Register("spanLocalSessionsSize");

            }

            public Refresh() {
                // Espace disponible/utilisé
                var actualSize: number = Framework.LocalStorage.GetLocalStorageActualSize();
                var totalSize: number = 5 * 1048576;// 5Mo TODO : ajuster en fonction du navigateur
                var remainingSize = totalSize - actualSize;
                this.spanLocalSessionsSize.Set(Math.round(actualSize / 1048576) + "/" + Math.round(totalSize / 1048576) + " Mo (" + Math.round((actualSize * 100) / totalSize) + " %)");

                let self = this;

                //TODO : couleur des cellules

                this.progresses = this.GetSessionsFromLocalStorage(false);

                let table: Framework.Form.Table<Models.LocalSessionProgress> = new Framework.Form.Table<Models.LocalSessionProgress>();
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

                table.OnSelectionChanged = (selection) => {
                    self.selectedProgresses = selection.map(x => x.Progress);
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
            }

        }

        export class ScreenReaderViewModel extends Framework.ViewModel {

        }
    }

}


