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
var PanelLeader;
(function (PanelLeader) {
    var PanelLeaderApp = /** @class */ (function (_super) {
        __extends(PanelLeaderApp, _super);
        function PanelLeaderApp(isInTest) {
            if (isInTest === void 0) { isInTest = false; }
            var _this = _super.call(this, PanelLeader.PanelLeaderApp.GetRequirements(), isInTest) || this;
            _this.currentViewContainerName = "currentView";
            _this.warnings = [];
            _this.isSaving = false;
            _this.isSaved = true;
            _this.OnLogin = function () { };
            _this.OnSubjectsViewModelLoaded = function () { };
            _this.OnExperimentalDesignViewModelLoaded = function () { };
            _this.OnScenarioViewModelLoaded = function () { };
            _this.OnUploadViewModelLoaded = function () { };
            _this.OnMonitoringViewModelLoaded = function () { };
            _this.OnDataViewModelLoaded = function () { };
            _this.OnModalSettingsViewModelLoaded = function () { };
            //public OnModalSaveAnalysisAsTemplateViewModelLoaded: (vm: ViewModels.ModalSaveAnalysisAsTemplateViewModel) => void = () => { };
            //private showModalSaveAnalysisAsTemplate(templateNames: string[], analysis: PanelLeaderModels.Analysis, onComplete: () => void) {
            //    let self = this;
            //    self.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("SaveAsAnalysisTemplate"), (mw: Framework.Modal.Modal) => {
            //        let modal = new ViewModels.ModalSaveAnalysisAsTemplateViewModel(mw, templateNames, (label: string, description: string) => {
            //            let template: PanelLeaderModels.AnalysisTemplate = new PanelLeaderModels.AnalysisTemplate();
            //            //template.DataType = self.selectedTemplate.DataType;
            //            template.Label = label;
            //            template.Description = description;
            //            template.Json = JSON.stringify(analysis);
            //            //TODO self.analysisTemplatesDB.SaveAnalysisTemplate(template).then(() => { onComplete(); });
            //        });
            //        modal.HelpPage = "modalSaveAsAnalysisTemplate";
            //        self.OnModalSaveAnalysisAsTemplateViewModelLoaded(modal);
            //        return modal;
            //    }, "100vh", "400px");
            //}
            _this.OnModalTokenDownloadConfirmationViewModelLoaded = function () { };
            _this.OnModalProtocolDBFieldsViewModelLoaded = function () { };
            _this.OnModalSubjectsDBViewModelLoaded = function () { };
            _this.OnModalExperimentalDesignItemDBViewModelLoaded = function () { };
            _this.OnModalSaveMailAsTemplateViewModelLoaded = function () { };
            _this.OnModalImportViewModelLoaded = function () { };
            //private showModalNewSessionFromTemplate() {
            //    let self = this;
            //    //TODO
            //    alert("Not implemented");
            //    //this.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("NewSessionFromDelimitedTextFile"), "modalNewSessionFromDelimitedTextFile", (mw: Framework.Modal) => {
            //    //    //let modal = new Views.ModalSimulation(mw, subjectSession);
            //    //    //return modal;
            //    //});
            //}
            _this.OnModalSimulationViewModelLoaded = function () { };
            _this.OnModalEditDesignRanksViewModelLoaded = function () { };
            _this.OnModalScreenStyleViewModelLoaded = function () { };
            _this.OnModalDesignSettingsViewModelLoaded = function () { };
            _this.OnModalSessionLogViewModelLoaded = function () { };
            _this.OnModalScreenFromXMLViewModelLoaded = function () { };
            _this.OnModalScreenPropertiesViewModelLoaded = function () { };
            _this.OnModalSessionsDBViewModelLoaded = function () { };
            _this.OnModalTemplatedSessionsDBLoaded = function () { };
            _this.OnModalAnalysisViewModelLoaded = function () { };
            _this.OnModalSessionWizardViewModelLoaded = function () { };
            _this.OnModalLoginViewModelLoaded = function () { };
            _this.OnModalSaveSessionAsUndeployedCopyViewModelLoaded = function () { };
            _this.OnModalMailViewModelLoaded = function () { };
            return _this;
        }
        Object.defineProperty(PanelLeaderApp.prototype, "DbSubject", {
            get: function () {
                return this.dbSubject;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PanelLeaderApp.prototype, "License", {
            get: function () {
                return this.account;
            },
            enumerable: false,
            configurable: true
        });
        PanelLeaderApp.GetRequirements = function () {
            var panelLeaderRequirements = new Framework.ModuleRequirements();
            if (window.location.hostname.indexOf("localhost") > -1) {
                panelLeaderRequirements.AppUrl = 'http://localhost:44301/timesens';
                panelLeaderRequirements.FrameworkUrl = 'http://localhost:44301/framework';
                panelLeaderRequirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
            }
            else {
                panelLeaderRequirements.AppUrl = 'https://www.chemosenstools.com/timesens';
                panelLeaderRequirements.FrameworkUrl = 'https://www.chemosenstools.com/framework';
                panelLeaderRequirements.WcfServiceUrl = 'https://www.chemosenstools.com/WebService.svc/';
            }
            panelLeaderRequirements.AuthorizedLanguages = ['en', 'fr'];
            panelLeaderRequirements.CssFiles = ['/screenreader/css/screenreader.css', '/panelleader/css/panelleader.css'];
            panelLeaderRequirements.DefaultLanguage = 'en';
            panelLeaderRequirements.DisableGoBack = true;
            panelLeaderRequirements.DisableRefresh = true;
            panelLeaderRequirements.VersionPath = 'panelleader/html/changelog.html';
            panelLeaderRequirements.JsFiles = ['/screenreader/models.js', '/panelleader/ts/models.js', '/screenreader/screenreader.js'];
            panelLeaderRequirements.JsonResources = ['/panelleader/resources/panelleader.json', '/panelleader/resources/analysis.json', '/screenreader/resources/screenreader.json'];
            panelLeaderRequirements.Recommanded = []; //TODO
            panelLeaderRequirements.Required = []; //TODO;
            panelLeaderRequirements.Extensions = ["DataTable", "Slider", /*"Pivot",*/ /*"PPT",*/ "Crypto", "Zip", "Capture", "Xlsx", /*"Speech", */ "Offline" /*, "Barcode", "D3","Face"*/];
            return panelLeaderRequirements;
        };
        PanelLeaderApp.prototype.onError = function (error) {
            _super.prototype.onError.call(this, error);
            //TODO : que si admin, sinon envoi de mail ou stockage sur serveur
        };
        PanelLeaderApp.prototype.onConnectivityChanged = function (isOnline) {
            _super.prototype.onConnectivityChanged.call(this, isOnline);
            if (this.currentViewModel) {
                this.currentViewModel.OnConnectivityChanged(this.isOnline);
            }
            if (isOnline == false) {
                this.addWarning(Framework.LocalizationManager.Get("NoNetwork"));
            }
            else {
                this.removeWarning(Framework.LocalizationManager.Get("NoNetwork"));
            }
        };
        PanelLeaderApp.prototype.start = function (fullScreen) {
            if (fullScreen === void 0) { fullScreen = false; }
            _super.prototype.start.call(this, fullScreen);
            var self = this;
            // Initialisation du menu
            this.ShowMenu();
            // Commandes
            //TODO : framework.app ?
            this.commandInvoker = new Framework.CommandInvoker(function () {
                self.menuViewModel.OnUndoChanged(self.commandInvoker.CanRedo, self.commandInvoker.CanUndo);
                //HOWTO? Quand undo sur une commande d'une autre vue ?
                //Pb sur tous les micro changements sans validation (modification de texte, déplacement à la souris)-> tout est enregistré
            });
            // Vérification de la licence
            var localLicense = Models.Account.FromLocalStorage();
            // Pas de license locale : affichage vue login
            if (localLicense == undefined || localLicense.ExpirationDate <= new Date(Date.now())) {
                this.showModalLogin();
                return;
            }
            self.closeSession();
            // Test licence (si connexion)
            this.login(localLicense.Login, localLicense.Password, function () {
            }, function (error) {
                self.showModalLogin();
            });
        };
        Object.defineProperty(PanelLeaderApp.prototype, "Menu", {
            get: function () {
                return this.menuViewModel;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PanelLeaderApp.prototype, "IsSaved", {
            get: function () {
                return this.isSaved;
            },
            enumerable: false,
            configurable: true
        });
        PanelLeaderApp.prototype.toggleLock = function () {
            this.session.ToggleLock();
            this.menuViewModel.SetLock(this.session.IsLocked);
            this.currentViewModel.OnLockChanged(this.session.IsLocked);
        };
        PanelLeaderApp.prototype.closeSession = function (onClosed) {
            if (onClosed === void 0) { onClosed = function () { }; }
            var self = this;
            this.warnings = [];
            var onComplete = function () {
                if (self.session) {
                    // Ajout aux fichiers récents                                     
                    self.session.Close();
                    self.session = undefined;
                }
                self.menuViewModel.CheckState();
                onClosed();
            };
            if (this.session) {
                // Si une séance non enregistrée est ouverte, demande de confirmation avant d'ouvrir une nouvelle séance            
                if (this.isSaved == false) {
                    Framework.Modal.Confirm(Framework.LocalizationManager.Get("SessionHasUnsavedChanged"), Framework.LocalizationManager.Get("DoYouWantToSaveChanges"), function () {
                        self.saveSessionInLocalDB(function () {
                            onComplete();
                        }, self.account.PanelLeaderApplicationSettings.DatabaseSynchronization);
                    }, function () {
                        onComplete();
                    }, Framework.LocalizationManager.Get("Yes"), Framework.LocalizationManager.Get("No"));
                }
                else {
                    //if (self.license.PanelLeaderApplicationSettings && self.license.PanelLeaderApplicationSettings.DatabaseSynchronization == true) {
                    //    self.dbSession.UploadItem(self.session, () => { }, () => { }, () => { onComplete(); });
                    //} else {
                    //    onComplete();
                    //}
                    self.saveSessionInLocalDB(function () {
                        onComplete();
                    }, self.account.PanelLeaderApplicationSettings.DatabaseSynchronization);
                }
            }
            else {
                onComplete();
            }
        };
        PanelLeaderApp.prototype.addData = function (listData, save, source) {
            var self = this;
            //self.notify(Framework.LocalizationManager.Get("UpdatingData"), 'progress');
            self.notify('', 'progress');
            // Mise à jour des données
            self.session.AddData(listData, source);
            // Enregistrement
            if (save == true) {
                self.saveSessionInLocalDB();
            }
            // Mise à jour de l'onglet
            self.onSessionChanged();
            self.notify('', 'nothing');
        };
        PanelLeaderApp.prototype.onSessionChanged = function () {
            var self = this;
            self.menuViewModel.OnSessionChanged(this.session != undefined, this.session != undefined && this.session.Upload.Date != undefined, this.session != undefined && this.session.ListData != undefined && self.session.ListData.length > 0, this.session.Name);
        };
        PanelLeaderApp.prototype.sendMail = function (recipients, callback) {
            var self = this;
            recipients.forEach(function (code) {
                self.notify(Framework.LocalizationManager.Get("SendingMail"), 'progress');
                var monitoringProgresses = self.session.MonitoringProgress.filter(function (x) {
                    return x.SubjectCode == code;
                });
                if (monitoringProgresses.length > 0) {
                    var monitoringProgress_1 = monitoringProgresses[0];
                    var timesensURL = self.rootURL + "/panelist";
                    var htmlContent = self.session.GetMailContent(code, timesensURL);
                    var obj = {
                        toEmail: monitoringProgress_1.Mail,
                        subject: self.session.Mail.Subject,
                        body: encodeURI(htmlContent),
                        displayName: encodeURI(self.session.Mail.DisplayedName),
                        replyTo: encodeURI(self.session.Mail.ReturnMailAddress)
                    };
                    self.CallWCF('SendMail', obj, function () {
                        self.notify(Framework.LocalizationManager.Format("SendingMail", ["InProgress"]), 'progress');
                    }, function (res) {
                        // Mise à jour du statut du mail
                        monitoringProgress_1.MailStatus = Framework.LocalizationManager.Format("MailSentWith", [Framework.LocalizationManager.Get(res.Status), Framework.Format.ToDateString()]);
                        self.session.LogAction("SendMail", "Mail sent to [" + monitoringProgress_1.Mail + "] with [" + res.Status + "].", false, false);
                        self.notify(Framework.LocalizationManager.Format("SendingMail", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                        callback(monitoringProgresses);
                    });
                }
            });
        };
        PanelLeaderApp.prototype.autoSave = function () {
            if (this.account && this.account.PanelLeaderApplicationSettings.Autosave == true) {
                this.saveSessionInLocalDB();
            }
        };
        PanelLeaderApp.prototype.saveLicense = function (synchronize, notify) {
            if (synchronize === void 0) { synchronize = true; }
            if (notify === void 0) { notify = false; }
            if (this.isInTest == true) {
                return;
            }
            var self = this;
            this.account.SaveInLocalStorage();
            if (synchronize == true) {
                var obj = {
                    login: this.account.Login,
                    password: this.account.Password,
                    jsonLicense: encodeURI(JSON.stringify(this.account))
                };
                self.CallWCF('UpdateAccountAsUser', obj, function () {
                    if (notify == true) {
                        self.notify(Framework.LocalizationManager.Format("SavingLicense", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                    }
                }, function (res) {
                    if (notify == true) {
                        self.notify(Framework.LocalizationManager.Format("SavingLicense", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                    }
                });
            }
        };
        PanelLeaderApp.prototype.notify = function (warning, status, timeOut, minDisplayTime) {
            if (timeOut === void 0) { timeOut = undefined; }
            if (minDisplayTime === void 0) { minDisplayTime = 1; }
            var self = this;
            setTimeout(function () {
                if (status == 'success' || status == 'error') {
                    timeOut = 5000;
                }
                self.menuViewModel.ShowWarning(warning, Framework.LocalizationManager.Get(status));
                if (timeOut) {
                    setTimeout(function () {
                        self.menuViewModel.HideWarning();
                    }, timeOut);
                }
            }, minDisplayTime);
        };
        PanelLeaderApp.prototype.addWarning = function (warning) {
            this.warnings.push(warning);
            this.notify(warning, 'warning', 5000);
        };
        PanelLeaderApp.prototype.removeWarning = function (warning) {
            Framework.Array.Remove(this.warnings, warning);
        };
        PanelLeaderApp.prototype.login = function (loginId, loginPassword, onSuccess, onError) {
            var _this = this;
            var self = this;
            var token = Framework.LocalStorage.GetFromLocalStorage("Token");
            var obj = {
                login: loginId,
                password: loginPassword,
                token: token
            };
            self.CallWCF('LoginAsPanelLeader', obj, function () {
                Framework.Progress.Show(Framework.LocalizationManager.Get("CheckingLicense"));
            }, function (res) {
                Framework.Progress.Hide();
                if (res.Status == 'success') {
                    self.account = Models.Account.FromJson(res.Result);
                    document.getElementById("mainButton").disabled = false;
                    self.menuViewModel.OnLicenseChanged(_this.account.FirstName, _this.account.LastName);
                    self.saveLicense();
                    // Message pour prévenir expiration proche ou peu de jetons restants
                    var message = self.account.CheckForWarning();
                    if (message.length > 0) {
                        var modal = Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), message);
                        modal.AddCheckbox(Framework.LocalizationManager.Get("DoNotDisplayThisWarningAgain"), function () {
                            self.account.PanelLeaderApplicationSettings.LicenceWarningEnabled = false;
                            self.saveLicense();
                        });
                    }
                    var obj_1 = {
                        client: "PanelLeader",
                        version: self.version,
                        login: loginId
                    };
                    self.CallWCF('LogConnexion', obj_1, function () { }, function () { });
                    // Instanciation des bases de données locales
                    self.dbSessionShortcut = Framework.Database.ServerDB.GetInstance("LinkToLocalSession", self.account.PanelLeaderApplicationSettings.DatabaseSynchronization, self.wcfServiceUrl, self.account.Login, self.account.Password);
                    self.dbDirectory = Framework.Database.ServerDB.GetInstance("LocalDirectory", self.account.PanelLeaderApplicationSettings.DatabaseSynchronization, self.wcfServiceUrl, self.account.Login, self.account.Password);
                    self.dbSession = Framework.Database.ServerDB.GetInstance("Session", self.account.PanelLeaderApplicationSettings.DatabaseSynchronization, self.wcfServiceUrl, self.account.Login, self.account.Password);
                    self.dbSubject = Framework.Database.ServerDB.GetInstance("Subject", self.account.PanelLeaderApplicationSettings.DatabaseSynchronization, self.wcfServiceUrl, self.account.Login, self.account.Password);
                    self.dbSubjectCustomField = Framework.Database.ServerDB.GetInstance("SubjectCustomField", self.account.PanelLeaderApplicationSettings.DatabaseSynchronization, self.wcfServiceUrl, self.account.Login, self.account.Password);
                    self.dbProduct = Framework.Database.ServerDB.GetInstance("Product", self.account.PanelLeaderApplicationSettings.DatabaseSynchronization, self.wcfServiceUrl, self.account.Login, self.account.Password);
                    self.dbProductCustomField = Framework.Database.ServerDB.GetInstance("ProductCustomField", self.account.PanelLeaderApplicationSettings.DatabaseSynchronization, self.wcfServiceUrl, self.account.Login, self.account.Password);
                    self.dbAttribute = Framework.Database.ServerDB.GetInstance("Attribute", self.account.PanelLeaderApplicationSettings.DatabaseSynchronization, self.wcfServiceUrl, self.account.Login, self.account.Password);
                    self.dbAttributeCustomField = Framework.Database.ServerDB.GetInstance("AttributeCustomField", self.account.PanelLeaderApplicationSettings.DatabaseSynchronization, self.wcfServiceUrl, self.account.Login, self.account.Password);
                    // Séances récentes (20 dernières séances ouvertes)
                    //self.dbLinkToLocalSession.GetAllItems(() => { }, () => { }, (list: PanelLeaderModels.LinkToLocalSession[]) => {
                    self.dbSessionShortcut.DownloadItems(function () { }, function () { }, function (list) {
                        list = list.sort(function (a, b) { return (Number(a.LastUpdate) - Number(b.LastUpdate)); });
                        self.menuViewModel.SetRecentFiles(list.slice(-20));
                    });
                    self.OnLogin();
                    // Langue
                    if (self.account.PanelLeaderApplicationSettings.Language) {
                        Framework.LocalizationManager.SetDisplayLanguage(self.account.PanelLeaderApplicationSettings.Language);
                    }
                    onSuccess();
                }
                else {
                    onError(res.ErrorMessage);
                }
            });
        };
        PanelLeaderApp.prototype.saveSessionInLocalDB = function (callback, synchronizeOnServer) {
            if (callback === void 0) { callback = undefined; }
            if (synchronizeOnServer === void 0) { synchronizeOnServer = false; }
            if (this.isSaving == true) {
                return;
            }
            if (this.session == undefined) {
                return;
            }
            var self = this;
            if (this.version) {
                this.session.Version = this.version;
            }
            //self.notify(Framework.LocalizationManager.Format("SavingSession", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
            self.notify('', 'progress');
            this.isSaving = true;
            this.dbSession.SaveItem(self.session, function () { }, function () { }, function () {
                setTimeout(function () {
                    //self.notify(Framework.LocalizationManager.Format("SavingSession", [Framework.LocalizationManager.Get('success')]), 'success');
                    self.notify('', 'nothing');
                    self.isSaved = true;
                    self.menuViewModel.OnSaveChanged(false);
                    self.isSaving = false;
                    if (callback) {
                        callback();
                    }
                }, 1000);
            });
        };
        PanelLeaderApp.prototype.SetNewSession = function (session, saveInLocalDB) {
            var _this = this;
            var self = this;
            Framework.Progress.Hide();
            self.closeSession(function () {
                session = Framework.Factory.CreateFrom(PanelLeaderModels.Session, session);
                if (session == null) {
                    Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("UnableToReadSessionFile"));
                    return;
                }
                if (session == undefined) {
                    return;
                }
                self.session = session;
                self.session.Check(self.account.Login, self.account.Mail, self.account.FirstName + " " + self.account.LastName);
                self.session.OnChanged = function () {
                    self.isSaved = false;
                    self.menuViewModel.OnSaveChanged(true);
                };
                self.session.OnLockedChanged = function (x) {
                    self.menuViewModel.SetLock(x);
                    self.currentViewModel.OnLockChanged(x);
                };
                self.session.OnLog = function (action, detail) {
                    var obj = {
                        login: self.account.Login,
                        date: new Date(Date.now()).toUTCString(),
                        action: action,
                        detail: "[" + Framework.Format.ToDateString() + "] " + detail
                    };
                    self.CallWCF('LogPanelLeaderAction', obj, function () { }, function () { });
                };
                self.onSessionChanged();
                Framework.Progress.Hide();
                if (saveInLocalDB == true) {
                    self.showModalSessionsDB(undefined, function () {
                        self.menuViewModel.TabProtocol.Click();
                    }, false);
                }
                self.menuViewModel.CheckState();
                self.menuViewModel.TabProtocol.Click();
                //Log            
                self.session.LogAction("Open", "Session opened with TimeSens for Panel Leader version  [" + _this.version + "].", false, false);
            });
        };
        PanelLeaderApp.prototype.showView = function (htmlPath, viewModelFactory) {
            var self = this;
            _super.prototype.showView.call(this, self.rootURL + "/panelleader/" + htmlPath, viewModelFactory, function (vm, container) {
                self.currentViewModel = vm;
                self.currentContainer = container;
                self.autoSave();
                vm.OnLockChanged(self.session.IsLocked);
            });
        };
        PanelLeaderApp.prototype.showModal = function (htmlPath, title, viewFactory, height, width, canClose, grayBackground, backdrop, onLoaded) {
            if (height === void 0) { height = undefined; }
            if (width === void 0) { width = undefined; }
            if (canClose === void 0) { canClose = false; }
            if (grayBackground === void 0) { grayBackground = true; }
            if (backdrop === void 0) { backdrop = false; }
            if (onLoaded === void 0) { onLoaded = undefined; }
            var self = this;
            _super.prototype.showModal.call(this, self.rootURL + "/panelleader/" + htmlPath, title, viewFactory, height, width, canClose, grayBackground, backdrop, function (vm, modal) {
                if (vm && vm.HelpPage) {
                    modal.SetHelpFunction(function () {
                        self.showModalHelp(vm.HelpPage);
                    });
                }
                self.autoSave();
            });
        };
        PanelLeaderApp.prototype.ShowMenu = function () {
            $(".navbar a").on("click", function () {
                $(".navbar").find(".active").removeClass("active");
                $(this).parent().addClass("active");
            });
            var self = this;
            this.menuViewModel = new ViewModels.MenuViewModel();
            var openSessionFromId = function (id) {
                self.dbSessionShortcut.GetItemOnServer(id).then(function (link) {
                    //self.dbLinkToLocalSession.SaveItemOnServerAndLocalDB(link, () => { }, () => { }, () => { });
                    self.dbSession.GetItemOnServer(id).then(function (session) {
                        if (session != null) {
                            self.SetNewSession(session, false);
                        }
                        else {
                            //TODO
                            //    self.dbSession.DownloadItem(link.ID, () => { }, () => { }, (item: PanelLeaderModels.Session) => {
                            //        self.dbSession.GetItemByID(id.toString()).then((ls: PanelLeaderModels.Session) => {
                            //            self.SetNewSession(ls, false);
                            //        });
                            //    });
                        }
                    });
                });
            };
            this.menuViewModel.Undo = function () {
                self.commandInvoker.Undo();
            };
            this.menuViewModel.Redo = function () {
                self.commandInvoker.Redo();
            };
            this.menuViewModel.ShowWarnings = function () {
                self.menuViewModel.ShowWarningsPopup(self.warnings);
            };
            this.menuViewModel.ShowModalSessionWizard = function () {
                self.showModalSessionWizard();
            };
            this.menuViewModel.ShowModalNewSessionFromArchive = function () {
                Framework.FileHelper.BrowseFile(".ts2", function (file) {
                    PanelLeaderModels.Session.FromFile(file, function () {
                        Framework.Progress.Show(Framework.LocalizationManager.Get("LoadingFile"));
                    }, function (session) {
                        self.SetNewSession(session, true);
                    });
                });
            };
            this.menuViewModel.ShowModalNewSessionFromDelimitedTextFile = function () {
                //TODO : faire une fonction commune avec data
                var selectedDatatype = "";
                var select = Framework.Form.Select.Render("", Framework.KeyValuePair.FromArray(Models.Data.ImportTemplates), Framework.Form.Validator.NotEmpty(), function (newVal) {
                    selectedDatatype = newVal;
                }, true);
                Framework.Modal.Confirm(Framework.LocalizationManager.Get("ChooseDataTypeToImport"), select.HtmlElement, function () {
                    var template = Models.Data.GetImportTemplate(selectedDatatype);
                    self.showModalImport(Framework.LocalizationManager.Get("DataImport"), template, function (items) {
                        items.forEach(function (x) { x.SheetName = selectedDatatype; x.Type = selectedDatatype; x.Status = "Imported"; });
                        var session = PanelLeaderModels.Session.FromData(items);
                        self.SetNewSession(session, true);
                    });
                });
            };
            this.menuViewModel.ExportSessionAsArchive = function () {
                self.session.LogAction("Export", "Session exported as json.", false, false);
                Framework.FileHelper.SaveObjectAs(self.session.SaveAsUndeployedCopy(true, false, false, false, false, false), self.session.Name + ".ts2");
            };
            this.menuViewModel.ShowModalSessionsDB = function () {
                self.showModalSessionsDB(function (id) {
                    openSessionFromId(id);
                });
            };
            this.menuViewModel.SaveSessionInLocalDB = function () {
                self.saveSessionInLocalDB();
            };
            this.menuViewModel.ShowModalSessionLog = function () {
                self.showModalSessionLog();
            };
            this.menuViewModel.ShowModalSaveAsUndeployedCopy = function () {
                self.showModalSaveAsUndeployedCopy();
            };
            this.menuViewModel.Exit = function () {
                self.closeSession();
                Framework.Browser.GoHome();
            };
            this.menuViewModel.ShowModalSettings = function () {
                self.showModalSettings();
            };
            this.menuViewModel.ShowModalHelp = function () {
                if (self.currentViewModel) {
                    self.showModalHelp(self.currentViewModel.HelpPage);
                }
                else {
                    self.showModalHelp("menu");
                }
            };
            this.menuViewModel.LogOut = function () {
                self.account = undefined;
                self.closeSession();
                Framework.LocalStorage.RemoveItem("license");
                self.showModalLogin();
                self.menuViewModel.OnLicenseChanged();
            };
            this.menuViewModel.ToggleLock = function () {
                self.toggleLock();
            };
            this.menuViewModel.ShowModalBugReport = function () {
                self.showModalBugReport();
            };
            this.menuViewModel.ShowViewSubjects = function () {
                self.showViewSubjects();
            };
            this.menuViewModel.ShowViewProducts = function () {
                self.showViewProducts();
            };
            this.menuViewModel.ShowViewAttributes = function () {
                self.showViewAttributes();
            };
            this.menuViewModel.ShowViewScenario = function () {
                return self.showViewScenario();
            };
            this.menuViewModel.ShowViewUpload = function () {
                self.showViewUpload();
            };
            this.menuViewModel.ShowViewMonitoring = function () {
                self.showViewMonitoring();
            };
            this.menuViewModel.ShowViewData = function () {
                self.showViewData();
            };
            this.menuViewModel.OpenSessionFromLocalDB = function (id) {
                openSessionFromId(id);
            };
            this.menuViewModel.Save = function () {
                self.saveSessionInLocalDB();
            };
        };
        PanelLeaderApp.prototype.showViewSubjects = function () {
            var self = this;
            //let subjectDBFields: PanelLeaderModels.DBField[] = [];
            //self.dbSubjectCustomField.GetAllItems(() => { }, () => { }, (x: PanelLeaderModels.DBField[]) => {
            //    subjectDBFields = x;
            self.showView("html/ViewSubjects.html", function () {
                var subjectViewModel = new ViewModels.SubjectsViewModel(self.session.ListSubjects, self.session.SubjectPasswordGenerator /*, subjectDBFields*/);
                subjectViewModel.OnSubjectUpdate = function (subject, propertyName, oldValue, newValue) {
                    var cmd = new Framework.Command(function () {
                        if (propertyName == "Code") {
                            self.session.UpdateSubjectCodes(oldValue, newValue);
                        }
                    }, function () {
                        subject[propertyName] = oldValue;
                        if (propertyName == "Code") {
                            self.session.UpdateSubjectCodes(newValue, oldValue);
                        }
                        subjectViewModel.TableSubject.Refresh([subject]);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                subjectViewModel.ListDataContainsSubjectCode = function (codes) { return self.session.ListDataContainsSubjectCode(codes); };
                subjectViewModel.AddNewPanelists = function (nb) {
                    var addedPanelists = self.session.GetNewPanelists(nb);
                    var cmd = new Framework.Command(function () {
                        self.session.AddNewPanelists(addedPanelists);
                        subjectViewModel.Update();
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("SubjectsAddedCheckDesign"));
                        //subjectViewModel.TableSubject.Insert(addedPanelists, 0, false);
                    }, function () {
                        self.session.RemoveSubjects(addedPanelists, false);
                        //subjectViewModel.TableSubject.Remove(addedPanelists, false);
                        subjectViewModel.Update();
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("SubjectsAddedCheckDesign"));
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                subjectViewModel.RemovePanelists = function (subjects, removeSubjectsData) {
                    var removedPanelists = subjects;
                    var cmd = new Framework.Command(function () {
                        self.session.RemoveSubjects(subjects, removeSubjectsData);
                        subjectViewModel.Update();
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("SubjectsAddedCheckDesign"));
                        //subjectViewModel.TableSubject.Remove(subjects, false);
                    }, function () {
                        self.session.AddNewPanelists(removedPanelists);
                        subjectViewModel.Update();
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("SubjectsAddedCheckDesign"));
                        // Attention index pas bon
                        //subjectViewModel.TableSubject.Insert(removedPanelists, 0, false);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                subjectViewModel.SetPanelistsPasswords = function (subjects) {
                    var oldPasswords = subjects.map(function (x) { return x.Password; });
                    var cmd = new Framework.Command(function () {
                        self.session.SetSubjectsPasswords(subjects);
                        subjectViewModel.TableSubject.Refresh(subjects);
                    }, function () {
                        self.session.SetSubjectsPasswords(subjects, oldPasswords);
                        subjectViewModel.TableSubject.Refresh(subjects);
                        ;
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                subjectViewModel.ResetPanelistsPasswords = function (subjects) {
                    var oldPasswords = subjects.map(function (x) { return x.Password; });
                    var cmd = new Framework.Command(function () {
                        self.session.ResetSubjectsPasswords(subjects);
                        subjectViewModel.TableSubject.Refresh(subjects);
                    }, function () {
                        self.session.SetSubjectsPasswords(subjects, oldPasswords);
                        subjectViewModel.TableSubject.Refresh(subjects);
                        ;
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                subjectViewModel.ShowModalImportPanelists = function () {
                    return self.showModalImport(Framework.LocalizationManager.Get("SubjectImport"), Models.Subject.GetImportTemplate(), function (items) {
                        var cmd = new Framework.Command(function () {
                            var replacedCodes = self.session.AddNewPanelists(items);
                            ////subjectViewModel.TableSubject.Insert(items, 0);
                            subjectViewModel.Update();
                            var text = Framework.LocalizationManager.Get("SubjectsAddedCheckDesign");
                            if (replacedCodes.length > 0) {
                                text += "\n" + Framework.LocalizationManager.Format("ExistingCodesReplaced", [replacedCodes.join(',')]);
                            }
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), text);
                        }, function () {
                            self.session.RemoveSubjects(items, false);
                            //subjectViewModel.TableSubject.Remove(items);
                            subjectViewModel.Update();
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("SubjectsAddedCheckDesign"));
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    }, function () {
                        self.showModalSubjectsDB(function () {
                            //subjectViewModel.Update();
                        });
                    });
                };
                subjectViewModel.ShowViewProducts = function () { self.showViewProducts(); };
                subjectViewModel.ShowViewAttributes = function () { self.showViewAttributes(); };
                //subjectViewModel.EditCustomFields = () => {
                //    self.showModalCustomDBFields(self.dbSubjectCustomField, (fields: PanelLeaderModels.DBField[]) => { });
                //    subjectViewModel.AdditionalFields = subjectDBFields;
                //    //subjectViewModel.Update();
                //}
                //subjectViewModel.ExportPanelistToLocalDB = (subjects: Models.Subject[]) => {
                //    subjects.forEach((x) => {
                //        self.dbSubject.SaveItem(x, () => { }, () => { }, () => { });
                //        //TODO : si code existe déjà, demande pour remplacer
                //    });
                //};
                subjectViewModel.HelpPage = "viewSubject";
                self.OnSubjectsViewModelLoaded(subjectViewModel);
                return subjectViewModel;
            });
            //});
        };
        PanelLeaderApp.prototype.showViewExperimentalDesignItems = function (dtype) {
            var self = this;
            //TOCHECK : import depuis XML
            //let db: Framework.Database.LocalDB;
            //if (dtype == "Product") {
            //    db = self.dbProductCustomField;
            //}
            //if (dtype == "Attribute") {
            //    db = self.dbAttributeCustomField;
            //}
            //let fields: PanelLeaderModels.DBField[] = [];
            //db.GetAllItems(() => { }, () => { }, (x: PanelLeaderModels.DBField[]) => {
            //    fields = x;
            self.showView("html/ViewExperimentalDesignItems.html", function () {
                var viewModel = new ViewModels.ExperimentalDesignItemsViewModel(dtype, self.session.ListExperimentalDesigns /*, fields*/);
                viewModel.SetActiveLi(dtype);
                viewModel.ListDataContainsItemCode = function (codes) {
                    if (dtype == "Product") {
                        return self.session.ListDataContainsProductCode(codes);
                    }
                    if (dtype == "Attribute") {
                        return self.session.ListDataContainsAttributeCode(codes);
                    }
                };
                viewModel.ShowViewAttributes = function () {
                    self.showViewAttributes();
                };
                viewModel.ShowViewSubjects = function () {
                    self.showViewSubjects();
                };
                viewModel.ShowViewProducts = function () {
                    self.showViewProducts();
                };
                viewModel.ExportItemsToLocalDB = function (inlineItemLabels) {
                    inlineItemLabels.forEach(function (x) {
                        //TODO : vérifier si item existe déjà
                        self.dbProduct.SaveItem(x, function () { }, function () { }, function () { });
                    });
                };
                viewModel.ShowModalImportDesign = function () {
                    var template = "";
                    if (dtype == "Product") {
                        template = "ProductDesign";
                    }
                    if (dtype == "Attribute") {
                        template = "AttributeDesign";
                    }
                    self.showModalImport(Framework.LocalizationManager.Get("ExperimentalDesignImport"), Models.ExperimentalDesign.GetImportTemplate(template), function (inlineDesign) {
                        var res = self.session.GetDesignFromInlineDesign(dtype, inlineDesign); // Import depuis CSV ou Excel
                        var cmd = new Framework.Command(function () {
                            self.session.AddNewDesign(res.design);
                            viewModel.Update(res.design);
                            var warning = "";
                            if (res.existingSubjects && res.existingSubjects.length > 0) {
                                warning += Framework.LocalizationManager.Format("ExistingSubjectCodesReplaced", [res.existingSubjects.join(',')]) + "\n";
                            }
                            if (res.existingItems && res.existingItems.length > 0) {
                                warning += Framework.LocalizationManager.Format("ExistingCodesReplaced", [res.existingItems.join(',')]);
                            }
                            if (warning.length > 0) {
                                self.notify(warning, 'info', 3000);
                            }
                        }, function () {
                            self.session.RemoveDesign(res.design);
                            viewModel.Update(undefined);
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    });
                };
                viewModel.ShowModalImportItems = function (design) {
                    self.showModalImport(Framework.LocalizationManager.Get("Import"), Models.ExperimentalDesignItem.GetImportTemplate(dtype), function (items) {
                        var cmd = new Framework.Command(function () {
                            var replacedCodes = self.session.AddItemsToDesign(design, items);
                            viewModel.Update(design);
                            if (replacedCodes.length > 0) {
                                var warning = Framework.LocalizationManager.Format("ExistingCodesReplaced", [replacedCodes.join(',')]);
                                self.notify(warning, 'info', 3000);
                            }
                        }, function () {
                            self.session.RemoveItemsFromDesign(design, items, false);
                            viewModel.Update(design);
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    }, function () {
                        self.showModalExperimentalDesignItemDB(design, function () {
                            viewModel.Update(design);
                        });
                    });
                };
                viewModel.AddNewDesign = function () {
                    var newDesign = self.session.GetNewDesign(dtype, "Fixed", 1, []);
                    var cmd = new Framework.Command(function () {
                        self.showModalDesignSettings(newDesign, function (design) {
                            self.session.AddNewDesign(design);
                            viewModel.Update(design);
                        });
                    }, function () {
                        self.session.RemoveDesign(newDesign);
                        viewModel.Update(undefined);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                    return newDesign;
                };
                viewModel.AddItemsToDesign = function (design, nb) {
                    var items = self.session.GetNewItems(design, nb);
                    var cmd = new Framework.Command(function () {
                        self.session.AddItemsToDesign(design, items);
                        viewModel.Update(design);
                    }, function () {
                        self.session.RemoveItemsFromDesign(design, items, false);
                        viewModel.Update(design);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                viewModel.UpdateDesignLabels = function (design) {
                    var oldItems = Framework.Factory.Clone(design.ListItems);
                    var newItems = design.GetNewLabels();
                    var cmd = new Framework.Command(function () {
                        self.session.UpdateDesignLabels(design, newItems);
                        viewModel.Update(design);
                    }, function () {
                        self.session.UpdateDesignLabels(design, oldItems);
                        viewModel.Update(design);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                viewModel.UpdateItem = function (design, oldItemCode, propertyName, oldPropertyValue, newPropertyValue) {
                    var item = design.ListItems.filter(function (x) { return x.Code == oldItemCode; })[0];
                    var oldCode = oldItemCode;
                    var newCode = undefined;
                    var replicate = 1;
                    var oldLabel = undefined;
                    var newLabel = undefined;
                    if (propertyName == "Code") {
                        oldCode = oldPropertyValue;
                        newCode = newPropertyValue;
                    }
                    else if (propertyName.length > 1 && propertyName.indexOf("R") == 0 && Number(propertyName[1])) {
                        replicate = Number(propertyName.replace("R", ""));
                        oldLabel = oldPropertyValue;
                        newLabel = newPropertyValue;
                    }
                    else if (design.Type == "Attribute" && propertyName == "LongName") {
                        oldLabel = oldPropertyValue;
                        newLabel = newPropertyValue;
                    }
                    else {
                        item[propertyName] = newPropertyValue;
                        return;
                    }
                    var memoryOldCode = newCode;
                    var memoryNewCode = oldCode;
                    var memoryOldLabel = newLabel;
                    var memoryNewLabel = oldLabel;
                    var cmd = new Framework.Command(function () {
                        self.session.UpdateItemLabel(design, oldCode, newCode, replicate, newLabel, oldLabel);
                        viewModel.TableExperimentalDesign.DisableAndAddRefreshIcon(function () { viewModel.Update(design); });
                    }, function () {
                        self.session.UpdateItemLabel(design, memoryOldCode, memoryNewCode, replicate, memoryNewLabel, memoryOldLabel);
                        viewModel.TableExperimentalDesign.DisableAndAddRefreshIcon(function () { viewModel.Update(design); });
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                viewModel.ResetDesign = function (design) {
                    var oldRows = Framework.Factory.Clone(design.ListExperimentalDesignRows);
                    var cmd = new Framework.Command(function () {
                        self.session.ResetDesign(design);
                        viewModel.Update(design);
                    }, function () {
                        design.ListExperimentalDesignRows = oldRows;
                        viewModel.Update(design);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                viewModel.ShowModalEditDesignRanks = function (design, subjectCodes) {
                    self.showModalEditDesignRanks(design, function (itemCode, replicate, newRank) {
                        var oldRows = Framework.Factory.Clone(design.ListExperimentalDesignRows);
                        var cmd = new Framework.Command(function () {
                            self.session.EditDesignRanks(design, subjectCodes, itemCode, replicate, newRank);
                            viewModel.Update(design);
                        }, function () {
                            design.ListExperimentalDesignRows = oldRows;
                            viewModel.Update(design);
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    });
                };
                viewModel.RemoveDesign = function (design, associatedData) {
                    var cmd = new Framework.Command(function () {
                        self.session.RemoveDesign(design, associatedData);
                        viewModel.Update(undefined);
                    }, function () {
                        self.session.AddNewDesign(design);
                        viewModel.Update(design);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                viewModel.EditDesignSettings = function (design) {
                    var oldDesign = Framework.Factory.CreateFrom(Models.ExperimentalDesign, design);
                    var cmd = new Framework.Command(function () {
                        self.showModalDesignSettings(design, function (newDesign) {
                            self.session.UpdateDesign(design, newDesign);
                            viewModel.Update(design);
                        });
                    }, function () {
                        self.session.UpdateDesign(design, oldDesign);
                        viewModel.Update(design);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                viewModel.CheckIfDesignIsUsedByControl = function (design) {
                    return self.session.CheckIfDesignIsUsedByControl(design);
                };
                viewModel.GetDesignData = function (design) {
                    return self.session.GetDesignData(design);
                };
                viewModel.RemoveItemsFromDesign = function (design, items, removeItemsData) {
                    var cmd = new Framework.Command(function () {
                        self.session.RemoveItemsFromDesign(design, items, removeItemsData);
                        viewModel.Update(design);
                    }, function () {
                        self.session.AddItemsToDesign(design, items);
                        viewModel.Update(design);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                //viewModel.EditCustomFields = (design: Models.ExperimentalDesign) => {
                //    self.showModalCustomDBFields(db, (fields: PanelLeaderModels.DBField[]) => { });
                //    viewModel.AdditionalFields = fields;
                //    viewModel.Update(design, fields);
                //}
                viewModel.HelpPage = "viewExperimentalDesignItem";
                self.OnExperimentalDesignViewModelLoaded(viewModel);
                return viewModel;
            });
            //});
        };
        PanelLeaderApp.prototype.showViewProducts = function () {
            this.showViewExperimentalDesignItems("Product");
        };
        PanelLeaderApp.prototype.showViewAttributes = function () {
            this.showViewExperimentalDesignItems("Attribute");
        };
        PanelLeaderApp.prototype.showViewScenario = function () {
            var self = this;
            this.showView("html/ViewScenario.html", function () {
                var scenarioViewModel = new ViewModels.ScenarioViewModel(self.session.GetSubjectSession());
                var showModalScreenXML = function (session, index, experimentalDesignId, callback) {
                    self.showModalScreenXML(session.ListScreens, session.ListExperimentalDesigns, function (screens) {
                        screens.reverse().forEach(function (screen) {
                            screen.Resolution = session.DefaultScreenOptions.Resolution;
                            Models.Screen.ChangeResolution(screen, session.DefaultScreenOptions.Resolution);
                            var cmd = new Framework.Command(function () {
                                self.session.AddScreen(screen, index, experimentalDesignId, true);
                                scenarioViewModel.UpdateMiniatures();
                                //index++;
                                callback();
                            }, function () {
                                self.session.DeleteScreen(screen.Id);
                                scenarioViewModel.UpdateMiniatures();
                                callback();
                            });
                            self.commandInvoker.ExecuteCommand(cmd);
                        });
                    });
                };
                scenarioViewModel.ShowModalScreenFromXML = function (index, experimentalDesignId, callback) {
                    self.showModalSessionsDB(function (id) {
                        //TOFIX : doublon de cette fonction
                        self.dbSessionShortcut.GetItemOnServer(id.toString()).then(function (link) {
                            self.dbSession.GetItemOnServer(id.toString()).then(function (session) {
                                if (session != null) {
                                    showModalScreenXML(session, index, experimentalDesignId, callback);
                                }
                                else {
                                    self.dbSession.DownloadItem(link.ID, function () { }, function () { }, function (item) {
                                        self.dbSession.GetItemOnServer(id.toString()).then(function (ls) {
                                            showModalScreenXML(session, index, experimentalDesignId, callback);
                                        });
                                    });
                                }
                            });
                        });
                    });
                };
                scenarioViewModel.ShowModalScreenProperties = function (screen, index, callback) {
                    self.showModalScreenProperties(screen, index + 1, function () {
                        callback();
                    }, scenarioViewModel);
                };
                scenarioViewModel.MoveScreen = function (index, direction) {
                    //TODO : drag'n drop
                    var undoDirection = "up";
                    var undoIndex = index + 1;
                    if (direction == "up") {
                        undoDirection = "down";
                        undoIndex = index - 1;
                    }
                    var cmd = new Framework.Command(function () {
                        self.session.MoveScreen(index, direction);
                        scenarioViewModel.UpdateMiniatures();
                    }, function () {
                        self.session.MoveScreen(undoIndex, undoDirection);
                        scenarioViewModel.UpdateMiniatures();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                scenarioViewModel.ShowModalSimulation = function (subjectSession, currentScreenId) {
                    self.showModalSimulation(subjectSession, currentScreenId, self.isInTest);
                };
                self.OnModalSimulationViewModelLoaded = function (vm) {
                    vm.Start();
                };
                scenarioViewModel.AddControlToScreen = function (screen, control, onSelect, style) {
                    var cmd = new Framework.Command(function () {
                        self.session.AddControlToScreen(screen, control, onSelect, style);
                    }, function () {
                        self.session.RemoveControlFromScreen(screen, control);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                scenarioViewModel.RemoveControlFromScreen = function (screen, control) {
                    var cmd = new Framework.Command(function () {
                        self.session.RemoveControlFromScreen(screen, control);
                    }, function () {
                        self.session.AddControlToScreen(screen, control, function () { }); //TODO ? onSelect
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                //scenarioViewModel.UpdateControlName = (control: ScreenReader.Controls.BaseControl, oldName: string, newName: string) => {
                //    //TODO : enregistrer le chanement 1 seule fois (pas chaque caractère)
                //    let cmd = new Framework.Command(() => {
                //        self.session.UpdateControlName(control, oldName, newName);
                //    }, () => {
                //        self.session.UpdateControlName(control, newName, oldName);
                //    });
                //    self.commandInvoker.ExecuteCommand(cmd);
                //}
                scenarioViewModel.OnControlPropertyChanged = function (control, propertyName, oldValue, newValue) {
                    //TODO : Attention tous les microchangements sont enregsitrés !
                    var cmd = new Framework.Command(function () {
                        if (propertyName == "_FriendlyName") {
                            self.session.UpdateControlName(control, oldValue, newValue);
                        }
                        self.session.OnChanged();
                    }, function () {
                        control[propertyName] = oldValue;
                        control.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                scenarioViewModel.InsertScreen = function (screen, index, experimentalDesignId) {
                    var newScreen = self.session.GetNewScreen(screen, index, experimentalDesignId);
                    var cmd = new Framework.Command(function () {
                        self.session.AddScreen(newScreen, index, experimentalDesignId);
                        scenarioViewModel.CurrentScreen = newScreen;
                        scenarioViewModel.UpdateMiniatures();
                    }, function () {
                        self.session.DeleteScreen(newScreen.Id);
                        scenarioViewModel.UpdateMiniatures();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                    return newScreen;
                };
                scenarioViewModel.DeleteScreen = function (screen, index) {
                    var cmd = new Framework.Command(function () {
                        var newScreenId = self.session.DeleteScreen(screen.Id);
                        scenarioViewModel.UpdateMiniatures();
                        scenarioViewModel.OnScreenChanged(newScreenId, false);
                    }, function () {
                        //TOFIX : pas inséré au bon endroit si 1er écran supprimé
                        self.session.AddScreen(screen, index);
                        scenarioViewModel.UpdateMiniatures();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                scenarioViewModel.ShowModalScreensStyle = function (callback) {
                    self.showModalScreensStyle(callback);
                };
                scenarioViewModel.GetListSortingControlNames = function () {
                    var res = [];
                    //TODO : mettre ça dans session, écrans précédents uniquement
                    self.session.ListScreens.forEach(function (x) {
                        x.Controls.filter(function (y) { return y._Type == "SortingControl"; }).forEach(function (z) {
                            res.push(z._FriendlyName);
                        });
                    });
                    return res;
                };
                scenarioViewModel.GetListControlNames = function () {
                    var res = [];
                    //TODO : mettre ça dans session, écrans précédents uniquement
                    self.session.ListScreens.forEach(function (x) {
                        x.Controls.forEach(function (z) {
                            res.push(z._FriendlyName);
                        });
                    });
                    return res;
                };
                scenarioViewModel.GetListDataControlNames = function () {
                    var res = [];
                    //TODO : mettre ça dans session, écrans précédents uniquement
                    self.session.ListScreens.forEach(function (x) {
                        x.Controls.filter(function (y) { return y._Type == "FreeTextQuestionControl"; }).forEach(function (z) {
                            res.push(z._FriendlyName);
                        });
                    });
                    return res;
                };
                //scenarioViewModel.OnControlPropertyChanged = () => {
                //    //TODO: faire tous les changements de screenreader ici ?
                //    self.session.OnChanged();
                //}
                scenarioViewModel.HelpPage = "viewScenario";
                self.OnScenarioViewModelLoaded(scenarioViewModel);
                return scenarioViewModel;
            });
        };
        PanelLeaderApp.prototype.showViewUpload = function () {
            var _this = this;
            var self = this;
            this.showView("html/ViewUpload.html", function () {
                var uploadViewModel = new ViewModels.UploadViewModel(self.session.Upload);
                var upload = function () {
                    // Vérifier si on renomme un sujet ce qui se passe
                    // maj séance locale, enregistrement, verrouillage session, désactivation undo, maj vue monitoring, progress, blocage actions, maj vue upload, maj vue data si suppression, maj log serveur et local
                    // TODO : mise à jour des séances ou non
                    // Envoi au web service qui crée les subject sessions sur le serveur et qui retourne un servercode  
                    var templatedSubjectSeance = Models.TemplatedSubjectSeance.CreateTemplatedSubjectSeance(self.session, self.account);
                    var obj = {
                        login: self.account.Login,
                        password: self.account.Password,
                        jsonTemplatedSubjectSeance: JSON.stringify(templatedSubjectSeance),
                    };
                    var wsvc = 'UploadSubjectsSeance';
                    if (self.session.Upload.ServerCode != undefined && self.session.Upload.ServerCode.length > 0) {
                        // MAJ sinon
                        wsvc = 'UpdateSubjectsSeance';
                        obj["updateSessions"] = true;
                    }
                    self.CallWCF(wsvc, obj, function () {
                        self.notify(Framework.LocalizationManager.Format("UploadingSession", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                    }, function (res) {
                        if (res.Status == 'success') {
                            var serverCode = self.session.Upload.ServerCode;
                            if (wsvc == 'UploadSubjectsSeance') {
                                serverCode = res.Result;
                            }
                            if (wsvc == 'UpdateSubjectsSeance') {
                                if (res.Result.length > 0) {
                                    Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Format("CannotUpdateSubjectSessions", [res.Result]));
                                }
                            }
                            self.session.SetUpload(self.rootURL, serverCode, self.account.Login, self.account.Password);
                            // MAJ menu et vue upload
                            self.onSessionChanged();
                            //self.menuViewModel.SetLock(self.session.IsLocked);
                            uploadViewModel.Update(serverCode);
                            // Enregistrement
                            if (self.isInTest == false) {
                                self.saveSessionInLocalDB();
                            }
                            uploadViewModel.OnSessionUploaded();
                        }
                        else {
                            self.session.LogAction("Upload", "Error during session upload.", false);
                        }
                        self.notify(Framework.LocalizationManager.Format("UploadingSession", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                    });
                };
                var remove = function (removeData) {
                    var self = _this;
                    var obj = {
                        serverCode: self.session.Upload.ServerCode,
                        login: self.account.Login,
                        password: self.account.Password
                    };
                    self.CallWCF('DeleteSubjectsSeance', obj, function () {
                        self.notify(Framework.LocalizationManager.Format("DeletingSessionOnServer", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                    }, function (res) {
                        self.session.RemoveUpload(self.rootURL, res.Status, removeData);
                        // MAJ menu et vue upload
                        self.onSessionChanged();
                        uploadViewModel.Update();
                        //self.menuViewModel.SetLock(self.session.IsLocked);
                        // Enregistrement
                        if (self.isInTest == false) {
                            self.saveSessionInLocalDB();
                        }
                        uploadViewModel.OnSessionDeleted();
                        self.notify(Framework.LocalizationManager.Format("DeletingSessionOnServer", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                    });
                };
                uploadViewModel.UploadSessionOnServer = function () {
                    var cmd = new Framework.Command(function () {
                        upload();
                    }, function () {
                        remove(false);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                uploadViewModel.DeleteSessionOnServer = function (removeData) {
                    var cmd = new Framework.Command(function () {
                        remove(removeData);
                    }, function () {
                        upload();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                uploadViewModel.OnSessionDeleted = function () { };
                uploadViewModel.OnSessionUploaded = function () { };
                uploadViewModel.Notify = function () {
                    self.notify(Framework.LocalizationManager.Get("SessionUpdateRequired"), 'info', 3000);
                };
                uploadViewModel.HasAssociatedData = function () {
                    return (self.session.ListData.filter(function (x) { return x.Session.toString() == self.session.Upload.ServerCode; }).length > 0);
                };
                uploadViewModel.HelpPage = "viewUpload";
                self.OnUploadViewModelLoaded(uploadViewModel);
                return uploadViewModel;
            });
        };
        PanelLeaderApp.prototype.showViewMonitoring = function () {
            var _this = this;
            var self = this;
            this.showView("html/ViewMonitoring.html", function () {
                self.session.SetMonitoringProgress(self.rootURL, false);
                var monitoringViewModel = new ViewModels.MonitoringViewModel(self.session.MonitoringProgress);
                monitoringViewModel.UpdateMail = function (subjectCode, mail) {
                    var memory = self.session.GetSubjectFromCode(subjectCode).Mail;
                    var cmd = new Framework.Command(function () {
                        self.session.UpdatePanelistMail(subjectCode, mail);
                    }, function () {
                        self.session.UpdatePanelistMail(subjectCode, memory);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                monitoringViewModel.PrintMemo = function () {
                    self.session.GetMemo();
                };
                //monitoringViewModel.DownloadSubjectSeancesAsZip = (listSubjectCodes: string[]) => {
                //    let obj = {
                //        login: self.license.Login,
                //        password: self.license.Password,
                //        serverCode: self.session.Upload.ServerCode,
                //        listSubjectCodes: encodeURI(listSubjectCodes.join(';'))
                //    }
                //    self.CallWCF('DownloadSubjectSeancesAsZip', obj, () => {
                //        self.notify(Framework.LocalizationManager.Format("DownloadingProgress", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                //    }, (res) => {
                //        if (res.Result) {
                //            var fileName = self.session.Upload.ServerCode + ".zip";
                //            Framework.FileHelper.SaveBase64As(res.Result, fileName);
                //        }
                //        self.session.LogAction("DownloadSubjectSeancesAsZip", listSubjectCodes.length + " subject sessions downloaded for offline mode with " + res.Status + ".", true);
                //        self.notify(Framework.LocalizationManager.Format("DownloadingProgress", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                //    });
                //};
                monitoringViewModel.UpdateData = function (data) {
                    self.addData(data, true, "download");
                };
                monitoringViewModel.RefreshMonitoring = function (success, error) {
                    //TODO : téléchargement des images
                    //TODO : téléchargement de videos + gestion des jetons associée
                    //TODO : analyser les vidéos + gestion des jetons associée
                    //TODO : option analyze emotion que pour licence fullprice
                    //TODO : télécharger les images ?
                    // MAJ session locale, MAJ vue monitoring, MAJ vue data, enregistrement, désactivation undio, maj log serveur et local, progerss bar + blocage actions
                    // Avancement   
                    var obj = {
                        serverCode: self.session.Upload.ServerCode,
                        login: self.account.Login,
                        password: self.account.Password
                    };
                    self.CallWCF('RefreshMonitoring', obj, function () {
                        self.notify(Framework.LocalizationManager.Format("DownloadingProgress", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                    }, function (res) {
                        if (res.Status == 'success') {
                            var progress_1 = JSON.parse(res.Result);
                            // Mise à jour de la progression
                            var monitoringProgress_2 = self.session.UpdateMonitoringProgress(self.rootURL, progress_1.MonitoringProgress);
                            var requiredTokens = progress_1.RequiredTokens;
                            var availableTokens = progress_1.AvailableTokens;
                            var dataCount = progress_1.DataCount;
                            //let videos = progress.Videos;
                            var videosSize = progress_1.VideosSize;
                            var listVideos_1 = progress_1.Videos.join(';');
                            //let subjectCount = progress.Subjects.length;
                            if (dataCount > 0 || videosSize > 0) {
                                //1 vérification de l'avancement
                                //2 téléchargement des données après validation
                                var onConfirm = function (downloadData, downloadVideos, analyzeEmotions) {
                                    //TODO gérer barre d'avancemen avec start event->stop event'
                                    // Enregistrement
                                    self.saveSessionInLocalDB();
                                    if (downloadData == true) {
                                        // Téléchargement des données
                                        var obj_2 = {
                                            serverCode: self.session.Upload.ServerCode,
                                            subjects: progress_1.Subjects.join(';'),
                                            login: self.account.Login,
                                            password: self.account.Password,
                                            dataStatus: "Pending"
                                        };
                                        self.CallWCF('DownloadData', obj_2, function () {
                                            self.notify(Framework.LocalizationManager.Format("DownloadingData", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                                        }, function (res) {
                                            if (res.Status == 'success') {
                                                var listData = JSON.parse(res.Result);
                                                self.addData(listData, true, "download");
                                                //TODO : mise à jour products
                                            }
                                            else {
                                                self.session.LogAction("DownloadData", "Data downloaded with error.", false);
                                            }
                                            self.notify(Framework.LocalizationManager.Format("DownloadingData", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                                        });
                                    }
                                    if (downloadVideos == true) {
                                        var obj_3 = {
                                            serverCode: self.session.Upload.ServerCode,
                                            password: self.account.Password,
                                            login: self.account.Login,
                                            listVideos: encodeURI(listVideos_1)
                                        };
                                        self.CallWCF('DownloadVideos', obj_3, function () {
                                            self.notify(Framework.LocalizationManager.Format("DownloadingVideos", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                                        }, function (res) {
                                            if (res.Status == 'success') {
                                                var url = res.Result;
                                                window.open(url, "windowname", "width:400,height:300");
                                            }
                                            else {
                                                self.session.LogAction("DownloadVideos", "Data downloaded with error.", false);
                                            }
                                            self.notify(Framework.LocalizationManager.Format("DownloadingVideos", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                                        });
                                        // Téléchargement des vidéos  
                                        //let url = self.wcfServiceUrl + "DownloadVideos?login=" + self.license.Login + "&password=" + self.license.Password + "&listVideos=" + encodeURI(listVideos) + "&serverCode=" + self.session.Upload.ServerCode;
                                        //var req = new XMLHttpRequest();
                                        //req.open("GET", url, true);
                                        //req.responseType = "blob";
                                        //req.onload = function (event) {
                                        //    var blob = req.response;
                                        //    var fileName = req.getResponseHeader("fileName") //if you have the fileName header available
                                        //    var link = document.createElement('a');
                                        //    link.href = window.URL.createObjectURL(blob);
                                        //    link.download = fileName;
                                        //    link.click();
                                        //};
                                        //req.send();
                                        //window.open(url, "windowname", "width:400,height:300");
                                        //self.session.LogAction("DownloadVideos", listVideos.length + " videos downloaded (" + videosSize + " Mo).", true);
                                    }
                                    //if (analyzeEmotions == true) {
                                    //    // Analyse des émotions dans les vidéos
                                    //    self.analyzeEmotionsInVideos(progress.Videos);
                                    //}
                                    success(monitoringProgress_2);
                                };
                                var onCancel = function () {
                                    // Pas de mise à jour des données
                                    success(monitoringProgress_2);
                                };
                                self.showModalTokenDownloadConfirmation(progress_1, onConfirm, onCancel);
                            }
                            else {
                                success(monitoringProgress_2);
                            }
                        }
                        else {
                            error();
                        }
                        self.session.LogAction("Monitoring", "Session with server code " + _this.session.Upload.ServerCode + " monitored with " + res.Status + ".", false);
                        self.notify(Framework.LocalizationManager.Format("DownloadingProgress", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                    });
                };
                monitoringViewModel.ResetUserProgress = function (subjects, removeData, callback) {
                    ViewModels.ModalResetProgressViewModel.Show(function (resetProgress, resetMinTimeBetween2Connections) {
                        if (resetProgress == true) {
                            var obj = {
                                serverCode: self.session.Upload.ServerCode,
                                subjectCodes: subjects.join(';'),
                                login: self.account.Login,
                                password: self.account.Password,
                                newCurrentScreen: "0"
                            };
                            self.CallWCF('RemoveProgress', obj, function () {
                                self.notify(Framework.LocalizationManager.Format("ResetingProgress", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                            }, function (res) {
                                var monitoringProgress = JSON.parse(res.Result);
                                if (res.Status == 'success') {
                                    if (removeData == true) {
                                        var toRemoveData = self.session.ListData.filter(function (x) { return subjects.indexOf(x.SubjectCode) > -1; });
                                        self.session.RemoveData(toRemoveData);
                                    }
                                    var result = self.session.UpdateMonitoringProgress(self.rootURL, monitoringProgress);
                                    callback(result);
                                    // Enregistrement
                                    self.saveSessionInLocalDB();
                                }
                                self.session.LogAction("ResetingProgress", "Progress reset for panelist(s) " + subjects.join(', ') + " with " + res.Status + ".", false);
                                self.notify(Framework.LocalizationManager.Format("ResetingProgress", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                            });
                        }
                        if (resetMinTimeBetween2Connections == true) {
                            subjects.forEach(function (subject) {
                                var obj = {
                                    serverCode: self.session.Upload.ServerCode,
                                    subjectCode: subject,
                                    login: self.account.Login,
                                    password: self.account.Password
                                };
                                self.CallWCF('ResetMinTimeBetween2Connections', obj, function () {
                                    self.notify(Framework.LocalizationManager.Format("ResetingMinTimeBetween2Connections", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                                }, function (res) {
                                    self.notify(Framework.LocalizationManager.Format("ResetingMinTimeBetween2Connections", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                                    self.session.LogAction("ResetMinTimeBetween2Connections", "Min time between connections reset for panelist " + subject + " with " + res.Status + ".", false);
                                });
                            });
                        }
                    });
                };
                monitoringViewModel.ShowModalSendMail = function (recipients, onClose) {
                    self.showModalSendMail(recipients, onClose);
                };
                monitoringViewModel.HelpPage = "viewMonitoring";
                self.OnMonitoringViewModelLoaded(monitoringViewModel);
                return monitoringViewModel;
            });
        };
        PanelLeaderApp.prototype.showViewData = function () {
            var self = this;
            this.showView("html/ViewData.html", function () {
                // Découpage en onglet
                self.session.SetDataTabs();
                var dataViewModel = new ViewModels.DataViewModel(self.session.ListData, self.session.DataTabs);
                dataViewModel.RemoveDataTab = function (name) {
                    var cmd = new Framework.Command(function () {
                        self.session.RemoveDataTab(name);
                        dataViewModel.Update();
                    }, function () {
                        self.session.AddDataTab(name);
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                dataViewModel.DeleteData = function (data) {
                    var cmd = new Framework.Command(function () {
                        self.session.RemoveData(data);
                        dataViewModel.Update();
                    }, function () {
                        self.addData(data, false, "");
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                dataViewModel.ModifySelectionInData = function (selectedData, column, replace, copy) {
                    var memory = Framework.Factory.Clone(self.session.ListData);
                    var cmd = new Framework.Command(function () {
                        self.session.ModifySelectionInData(selectedData, column, replace, copy);
                        dataViewModel.Update();
                    }, function () {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                dataViewModel.SearchAndReplaceData = function (selectedData, column, search, replace, copy) {
                    var memory = Framework.Factory.Clone(self.session.ListData);
                    var cmd = new Framework.Command(function () {
                        self.session.SearchAndReplaceData(selectedData, column, search, replace, copy);
                        dataViewModel.Update();
                    }, function () {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                dataViewModel.TransformScoresInRanks = function (selectedData, copy) {
                    var memory = Framework.Factory.Clone(self.session.ListData);
                    var cmd = new Framework.Command(function () {
                        self.session.TransformScoresInRanks(selectedData, copy);
                        dataViewModel.Update();
                    }, function () {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                dataViewModel.TransformScores = function (selectedData, copy, transformation) {
                    var memory = Framework.Factory.Clone(self.session.ListData);
                    var cmd = new Framework.Command(function () {
                        self.session.TransformScores(selectedData, copy, transformation);
                        dataViewModel.Update();
                    }, function () {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                dataViewModel.TransformScoresInMeans = function (selectedData, copy, variable) {
                    var memory = Framework.Factory.Clone(self.session.ListData);
                    var cmd = new Framework.Command(function () {
                        self.session.TransformScoresInMeans(selectedData, copy, variable);
                        dataViewModel.Update();
                    }, function () {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                dataViewModel.TransformReplicatesInIntakes = function (selectedData, copy) {
                    var memory = Framework.Factory.Clone(self.session.ListData);
                    var cmd = new Framework.Command(function () {
                        self.session.TransformReplicatesInIntakes(selectedData, copy);
                        dataViewModel.Update();
                    }, function () {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                dataViewModel.TransformSessionsInReplicates = function (selectedData, copy) {
                    var memory = Framework.Factory.Clone(self.session.ListData);
                    var cmd = new Framework.Command(function () {
                        self.session.TransformSessionsInReplicates(selectedData, copy);
                        dataViewModel.Update();
                    }, function () {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                dataViewModel.MoveSelectionToAnotherTab = function (selectedData, newTab, deleteAfterCopy) {
                    var memory = Framework.Factory.Clone(self.session.ListData);
                    var cmd = new Framework.Command(function () {
                        self.session.MoveSelectionToAnotherTab(selectedData, newTab, deleteAfterCopy);
                        dataViewModel.Update();
                    }, function () {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                dataViewModel.AddDataTab = function () {
                    var name = self.session.GetNewDataTab();
                    var cmd = new Framework.Command(function () {
                        self.session.AddDataTab(name);
                        dataViewModel.Update();
                    }, function () {
                        self.session.RemoveDataTab(name);
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                dataViewModel.AddData = function (sheetName, dType) {
                    var data = self.session.GetNewData(sheetName, dType);
                    var cmd = new Framework.Command(function () {
                        self.session.AddData(data, "Inserted");
                        dataViewModel.Update();
                    }, function () {
                        self.session.RemoveData(data);
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                dataViewModel.OnDataChanged = function (data, propertyName, oldValue, newValue) {
                    var cmd = new Framework.Command(function () {
                        data.Status = "Updated";
                        self.session.LogAction("Data", "Data updated for subject " + data.SubjectCode, false);
                    }, function () {
                        data[propertyName] = oldValue;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                dataViewModel.ShowModalAnalysis = function (listData) {
                    self.showModalAnalysis(listData);
                };
                dataViewModel.ShowModalImportData = function (datatype) {
                    //TODO : insérer juges produits descripteurs ?
                    var template = Models.Data.GetImportTemplate(datatype);
                    self.showModalImport(Framework.LocalizationManager.Get("DataImport"), template, function (items) {
                        var tab = self.session.GetNewDataTab();
                        var cmd = new Framework.Command(function () {
                            self.session.AddDataTab(tab);
                            items.forEach(function (x) { x.SheetName = tab; x.Type = datatype; x.Status = "Imported"; });
                            self.session.AddData(items, "Imported");
                            dataViewModel.Update();
                        }, function () {
                            self.session.RemoveDataTab(tab);
                            dataViewModel.Update();
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    });
                };
                dataViewModel.FeelingAnalysis = function (selectedData, copy) {
                    var tab = [];
                    var id = 0;
                    selectedData.forEach(function (x) {
                        var obj = { id: id, language: 'fr', text: x.Description };
                        //TOFIX : limite au nombre de caractères ?
                        //if (id >=1000) {
                        tab.push(obj);
                        //}
                        id++;
                    });
                    var documents = {
                        'documents': tab
                    };
                    var body = JSON.stringify(documents);
                    $.ajax({
                        type: "POST",
                        url: "https://francecentral.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment", //https://francecentral.api.cognitive.microsoft.com/text/analytics/v2.0
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Ocp-Apim-Subscription-Key', '86ce684ef8444ff484ea5393ee3a1349');
                            xhr.setRequestHeader("Content-Type", "application/json");
                        },
                        data: JSON.stringify(documents),
                        success: function (result) {
                            var tab = "Sentiment";
                            var cmd = new Framework.Command(function () {
                                if (self.session.ListData.filter(function (x) { return x.SheetName == tab; }).length == 0) {
                                    self.session.AddDataTab(tab);
                                }
                                var items = [];
                                result.documents.forEach(function (x) {
                                    var id = Number(x["id"]);
                                    var item = new Models.Data();
                                    item.AttributeCode = selectedData[id].AttributeCode;
                                    item.QuestionLabel = selectedData[id].QuestionLabel;
                                    item.Description = selectedData[id].Description;
                                    item.Intake = selectedData[id].Intake;
                                    item.ProductCode = selectedData[id].ProductCode;
                                    item.SubjectCode = selectedData[id].SubjectCode;
                                    item.Score = x["score"];
                                    item.SheetName = tab;
                                    item.Session = selectedData[id].Session;
                                    item.Type = Models.DataType.Sentiment.toString();
                                    item.Status = "Computed"; //TODO
                                    items.push(item);
                                });
                                self.session.AddData(items, "Computed");
                                dataViewModel.Update();
                            }, function () {
                                self.session.RemoveDataTab(tab);
                                dataViewModel.Update();
                            });
                            self.commandInvoker.ExecuteCommand(cmd);
                        },
                        error: function (result) {
                            alert(result);
                            //TODO
                        }
                    });
                };
                dataViewModel.HelpPage = "viewData";
                self.OnDataViewModelLoaded(dataViewModel);
                return dataViewModel;
            });
        };
        PanelLeaderApp.prototype.showModalSettings = function () {
            var self = this;
            this.showModal("html/ModalSettings.html", Framework.LocalizationManager.Get("Settings"), function (mw) {
                var vm = new ViewModels.ModalSettingsViewModel(mw, self.account.PanelLeaderApplicationSettings, self.version);
                vm.SaveLicense = function (applicationSettings) {
                    self.account.PanelLeaderApplicationSettings.Language = applicationSettings.Language;
                    self.account.PanelLeaderApplicationSettings.DatabaseSynchronization = applicationSettings.DatabaseSynchronization;
                    self.account.PanelLeaderApplicationSettings.Autosave = applicationSettings.Autosave;
                    self.account.PanelLeaderApplicationSettings.DisplayName = applicationSettings.DisplayName;
                    self.account.PanelLeaderApplicationSettings.ReturnMailAddress = applicationSettings.ReturnMailAddress;
                    self.saveLicense();
                    if (self.account.PanelLeaderApplicationSettings.Language) {
                        Framework.LocalizationManager.SetDisplayLanguage(self.account.PanelLeaderApplicationSettings.Language);
                    }
                };
                vm.Close = function () {
                    mw.Close();
                };
                vm.HelpPage = "modalSettings";
                self.OnModalSettingsViewModelLoaded(vm);
                return vm;
            });
        };
        PanelLeaderApp.prototype.showModalTokenDownloadConfirmation = function (progress, onConfirm, onCancel) {
            var self = this;
            this.showModal("html/ModalTokenDownloadConfirmation.html", Framework.LocalizationManager.Get("Validation"), function (mw) {
                var requiredTokens = progress.RequiredTokens;
                var availableTokens = progress.AvailableTokens;
                var dataCount = progress.DataCount;
                var videos = progress.Videos;
                var videosSize = progress.VideosSize;
                var listVideos = progress.Videos.join(';');
                var subjectCount = progress.Subjects.length;
                var modal = new ViewModels.ModalTokenDownloadConfirmationViewModel(mw, requiredTokens, availableTokens, subjectCount, dataCount, videos, videosSize, onConfirm, onCancel);
                modal.HelpPage = "modalValidation";
                self.OnModalTokenDownloadConfirmationViewModelLoaded(modal);
                return modal;
            });
        };
        PanelLeaderApp.prototype.showModalCustomDBFields = function (db, onClose) {
            var self = this;
            var fields = [];
            //db.GetAllItems(() => { }, () => { }, (x: PanelLeaderModels.DBField[]) => {
            db.DownloadItems(function () { }, function () { }, function (x) {
                fields = x;
                show();
            });
            var show = function () {
                return self.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("Fields"), function (mw) {
                    var vm = new ViewModels.ModalProtocolDBFieldsViewModel(mw, fields, function (field) {
                        db.SaveItem(field, function () { }, function () { }, function () { });
                    });
                    vm.AddDBField = function () {
                        var field = new PanelLeaderModels.DBField();
                        db.SaveItem(field, function () { }, function () { }, function () {
                            fields.push(field);
                            vm.SetDataTableFields(fields);
                        });
                    };
                    vm.RemoveDBFields = function (fields) {
                        fields.forEach(function (x) {
                            db.RemoveItem(x, function () { }, function () { }, function () { });
                            Framework.Array.Remove(fields, x);
                        });
                        vm.SetDataTableFields(fields);
                    };
                    vm.HelpPage = "modalCustomDBField";
                    mw.OnClose = function () {
                        onClose(fields);
                    };
                    self.OnModalProtocolDBFieldsViewModelLoaded(vm);
                    return vm;
                }, "80vh", undefined, true);
            };
        };
        PanelLeaderApp.prototype.showModalSubjectsDB = function (onClose) {
            var self = this;
            var subjectDBFields = [];
            var subjects = [];
            //self.dbSubjectCustomField.GetAllItems(() => { }, () => { }, (x: PanelLeaderModels.DBField[]) => {
            self.dbSubjectCustomField.DownloadItems(function () { }, function () { }, function (x) {
                subjectDBFields = x;
                //self.dbSubject.GetAllItems(() => { }, () => { }, (x: Models.Subject[]) => {
                self.dbSubject.DownloadItems(function () { }, function () { }, function (x) {
                    subjects = x;
                    show();
                });
            });
            var show = function () {
                self.showModal("html/ModalSubjectsDB.html", Framework.LocalizationManager.Get("SubjectsDB"), function (mw) {
                    var vm = new ViewModels.ModalSubjectsDBViewModel(mw, subjectDBFields, subjects, function (subject, propertyName, oldValue, newValue) {
                        self.dbSubject.SaveItem(subject, function () { }, function () { }, function () { });
                    });
                    vm.ImportSubjects = function (subjectsToImport) {
                        var cmd = new Framework.Command(function () {
                            var replacedCodes = self.session.AddNewPanelists(subjectsToImport);
                            onClose();
                            var text = Framework.LocalizationManager.Get("SubjectsAddedCheckDesign");
                            if (replacedCodes.length > 0) {
                                text += "\n" + Framework.LocalizationManager.Format("ExistingCodesReplaced", [replacedCodes.join(',')]);
                            }
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), text);
                        }, function () {
                            self.session.RemoveSubjects(subjectsToImport, false);
                            onClose();
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("SubjectsAddedCheckDesign"));
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    };
                    vm.DeleteSubjects = function (subjectsToDelete) {
                        subjectsToDelete.forEach(function (x) {
                            self.dbSubject.RemoveItem(x, function () { }, function () { }, function () { });
                            Framework.Array.Remove(subjects, x);
                        });
                        vm.SetDataTable(subjects, subjectDBFields);
                    };
                    vm.HelpPage = "modalSubjectsDB";
                    self.OnModalSubjectsDBViewModelLoaded(vm);
                    return vm;
                }, "80vh", "95vw", true);
            };
        };
        PanelLeaderApp.prototype.showModalExperimentalDesignItemDB = function (design, onClose) {
            var self = this;
            var fields = [];
            var items = [];
            var dbFields;
            var dbItems;
            if (design.Type == "Product") {
                dbFields = self.dbProductCustomField;
                dbItems = self.dbProduct;
            }
            if (design.Type == "Attribute") {
                dbFields = self.dbAttributeCustomField;
                dbItems = self.dbAttribute;
            }
            //dbFields.GetAllItems(() => { }, () => { }, (x: PanelLeaderModels.DBField[]) => {
            dbFields.DownloadItems(function () { }, function () { }, function (x) {
                fields = x;
                //dbItems.GetAllItems(() => { }, () => { }, (x: Models.ExperimentalDesignItem[]) => {
                dbItems.DownloadItems(function () { }, function () { }, function (x) {
                    items = x;
                    self.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get(design.Type) + " DB", function (mw) {
                        var vm = new ViewModels.ModalExperimentalDesignItemDBViewModel(mw, fields, items, function (item, propertyName, oldValue, newValue) {
                            dbItems.SaveItem(item, function () { }, function () { }, function () { });
                        });
                        vm.ImportItems = function (itemsToImport) {
                            var cmd = new Framework.Command(function () {
                                var replacedCodes = self.session.AddItemsToDesign(design, itemsToImport);
                                onClose();
                                if (replacedCodes.length > 0) {
                                    var warning = Framework.LocalizationManager.Format("ExistingCodesReplaced", [replacedCodes.join(',')]);
                                    self.notify(warning, 'info', 3000);
                                }
                            }, function () {
                                self.session.RemoveItemsFromDesign(design, itemsToImport, false);
                                onClose();
                            });
                            self.commandInvoker.ExecuteCommand(cmd);
                        };
                        vm.DeleteItems = function (itemsToDelete) {
                            itemsToDelete.forEach(function (x) {
                                dbItems.RemoveItem(x, function () { }, function () { }, function () { });
                                Framework.Array.Remove(items, x);
                            });
                            vm.SetDataTable(items, fields);
                        };
                        vm.HelpPage = "modalItemsDB";
                        self.OnModalExperimentalDesignItemDBViewModelLoaded(vm);
                        return vm;
                    }, "80vh", "95vw", true);
                });
            });
        };
        PanelLeaderApp.prototype.showSaveAsMailTemplate = function (recipients, templates) {
            var self = this;
            self.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("SaveAsTemplate"), function (mw) {
                var vm = new ViewModels.ModalSaveMailAsTemplateViewModel(mw, templates);
                vm.OnSave = function (template) {
                    self.sendMail(recipients, function (monitoringProgresses) {
                        //TODO
                    });
                };
                vm.HelpPage = "modalSaveAsMailTemplate";
                self.OnModalSaveMailAsTemplateViewModelLoaded(vm);
                return vm;
            }, "100vh", "400px");
        };
        PanelLeaderApp.prototype.showModalHelp = function (htmlPage) {
            //TODO : CSS, viewmodel            
            var path = "help/" + htmlPage + ".html";
            Framework.BaseView.Load(path, undefined, function (div) {
                var w = window.open();
                $(w.document.body).html(div.innerHTML);
            });
        };
        PanelLeaderApp.prototype.showModalImport = function (title, importTemplate, importFunction, importFromDBFunction) {
            if (importFromDBFunction === void 0) { importFromDBFunction = undefined; }
            var self = this;
            var sources = ["XLS", "XLSX", "CSV", "TXT" /*, "XML"*/];
            //if (importFromDBFunction) {
            //    sources.push("DB");
            //}
            var importFromXMLFunction = function (json, callback) {
                Framework.Progress.Show(Framework.LocalizationManager.Get("ImportingData"));
                var worker = new Worker("ts/ReadJSONWorkerPL.js");
                worker.onmessage = function (e) {
                    var session = Framework.Factory.CreateFrom(PanelLeaderModels.Session, e.data);
                    session.Check();
                    if (importTemplate.Name == "Subject") {
                        callback(session.ListSubjects);
                    }
                    if (importTemplate.Name == "ProductDesign" || importTemplate.Name == "AttributeDesign" || importTemplate.Name == "Product" || importTemplate.Name == "Attribute") {
                        var designs = session.ListExperimentalDesigns;
                        if (importTemplate.Name == "ProductDesign" || importTemplate.Name == "Product") {
                            designs = designs.filter(function (x) { return x.Type == "Product"; });
                        }
                        if (importTemplate.Name == "AttributeDesign" || importTemplate.Name == "Attribute") {
                            designs = designs.filter(function (x) { return x.Type == "Attribute"; });
                        }
                        if (designs.length > 1) {
                            var div_1 = document.createElement("div");
                            var selectedDesign_1 = undefined;
                            var select_1 = Framework.Form.Select.Render("", Framework.KeyValuePair.FromArray(designs.map(function (x) { return x.Name; })), Framework.Form.Validator.NotEmpty(), function (x) {
                                selectedDesign_1 = Framework.Factory.CreateFrom(Models.ExperimentalDesign, session.ListExperimentalDesigns.filter(function (design) { return design.Name == x; })[0]);
                            }, false);
                            div_1.appendChild(select_1.HtmlElement);
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("SelectAnExperimentalDesign"), div_1, function () {
                                if (importTemplate.Name == "ProductDesign" || importTemplate.Name == "AttributeDesign") {
                                    callback(selectedDesign_1.GetExperimentalDesignTable(true));
                                }
                                if (importTemplate.Name == "Product" || importTemplate.Name == "Attribute") {
                                    callback(selectedDesign_1.ListItems);
                                }
                            });
                        }
                        else {
                            if (importTemplate.Name == "ProductDesign" || importTemplate.Name == "AttributeDesign") {
                                callback(Framework.Factory.CreateFrom(Models.ExperimentalDesign, designs[0]).GetExperimentalDesignTable(true));
                            }
                            if (importTemplate.Name == "Product" || importTemplate.Name == "Attribute") {
                                callback(designs[0].ListItems);
                            }
                        }
                    }
                    if (importTemplate.Name == "Data") {
                        callback(session.ListData);
                    }
                    worker.terminate();
                    Framework.Progress.Hide();
                };
                worker.postMessage(json);
            };
            var div = document.createElement("div");
            var d = document.createElement("div");
            d.innerHTML = Framework.LocalizationManager.Get("ChooseFileFormat");
            div.appendChild(d);
            var format = "";
            var select = Framework.Form.Select.Render("", Framework.KeyValuePair.FromArray(sources), Framework.Form.Validator.NotEmpty(), function (x) { format = x; }, false);
            select.HtmlElement.style.width = "100%";
            div.appendChild(select.HtmlElement);
            return Framework.Modal.Confirm(title, div, function () {
                self.showModal("html/ModalImport.html", title, function (mw) {
                    var vm = new ViewModels.ModalImportViewModel(mw, format, importTemplate, importFunction, importFromXMLFunction, importFromDBFunction);
                    self.OnModalImportViewModelLoaded(vm);
                    vm.HelpPage = "modalImport";
                    return vm;
                }, "80vh", "80vw", true);
            });
        };
        PanelLeaderApp.prototype.showModalSimulation = function (subjectSession, currentScreenId, isInTest) {
            var self = this;
            var coef = 1;
            if (subjectSession.ListScreens[0]) {
                coef = Models.Screen.GetRatio(subjectSession.ListScreens[0]);
            }
            var height = window.innerHeight - 160;
            var width = height * coef;
            this.showModal("html/ModalDefault.html", undefined, function (mw) {
                var vm = new ViewModels.ModalSimulationViewModel(mw, subjectSession, currentScreenId, isInTest);
                vm.HelpPage = "modalSimulation";
                self.OnModalSimulationViewModelLoaded(vm);
                return vm;
            }, height + "px", width + "px", true);
        };
        PanelLeaderApp.prototype.showModalEditDesignRanks = function (design, onChange) {
            var self = this;
            this.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("ProductRanks"), function (mw) {
                var vm = new ViewModels.ModalEditDesignRanksViewModel(mw, design, onChange);
                vm.HelpPage = "modalEditDesignRanks";
                self.OnModalEditDesignRanksViewModelLoaded(vm);
                return vm;
            }, "180px", "400px", false, false, true);
        };
        PanelLeaderApp.prototype.showModalScreensStyle = function (onChange) {
            var self = this;
            this.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("ScreenStyle"), function (mw) {
                var vm = new ViewModels.ModalScreenStyleViewModel(mw, self.session.DefaultScreenOptions);
                vm.HelpPage = "modalScreenStyle";
                vm.ChangeScreenResolution = function (resolution) {
                    var memory = self.session.DefaultScreenOptions.Resolution;
                    var cmd = new Framework.Command(function () {
                        self.session.ChangeAllScreensResolution(resolution);
                        onChange();
                    }, function () {
                        self.session.ChangeAllScreensResolution(memory);
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                vm.SetListScreensProgressBar = function (position, barType) {
                    var memoryPosition = self.session.DefaultScreenOptions.ProgressBarPosition;
                    var memoryType = self.session.DefaultScreenOptions.ProgressBar;
                    var cmd = new Framework.Command(function () {
                        self.session.SetListScreensProgressBar(position, barType);
                        onChange();
                    }, function () {
                        self.session.SetListScreensProgressBar(memoryPosition, memoryType);
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                vm.SetListScreensBackground = function (background) {
                    var memory = self.session.DefaultScreenOptions.ScreenBackground;
                    var cmd = new Framework.Command(function () {
                        self.session.SetListScreensBackground(background);
                        onChange();
                    }, function () {
                        self.session.SetListScreensBackground(memory);
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                vm.SetSessionStyle = function (style) {
                    var memory = self.session.DefaultScreenOptions.DefaultStyle;
                    var cmd = new Framework.Command(function () {
                        self.session.ApplyStyle(style);
                        onChange();
                    }, function () {
                        self.session.ApplyStyle(memory);
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                self.OnModalScreenStyleViewModelLoaded(vm);
                mw.Float('right');
                return vm;
            }, "100vh", "550px", true, false, true);
        };
        PanelLeaderApp.prototype.showModalDesignSettings = function (design, onChange) {
            var self = this;
            this.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("ExperimentalDesignSettings"), function (mw) {
                var vm = new ViewModels.ModalDesignSettingsViewModel(mw, design, self.session.ListExperimentalDesigns.map(function (e) { return e.Name; }), onChange);
                vm.HelpPage = "modalExperimentalDesignSettings";
                self.OnModalDesignSettingsViewModelLoaded(vm);
                return vm;
            }, undefined, "750px");
        };
        PanelLeaderApp.prototype.showModalBugReport = function () {
            //TODO : VM
            var self = this;
            var user = "Inconnu";
            if (self.account) {
                user = self.account.FirstName + " " + self.account.LastName;
            }
            var textarea = document.createElement("textarea");
            textarea.rows = 5;
            textarea.style.width = "100%";
            textarea.style.height = "200px";
            textarea.style.verticalAlign = "top";
            Framework.GlobalErrorCatcher.GetBugReport(function (date, browser, os, context, img) {
                var modal = Framework.Modal.Confirm(Framework.LocalizationManager.Get("PleaseEnterBugDescription"), textarea, function () {
                    var detail = textarea.innerText;
                    // Envoi de mail
                    Framework.GlobalErrorCatcher.GetHtmlReport("PanelLeader", user, detail, date, browser, os, context, img, function (html) {
                        var obj = { data: encodeURI(html) };
                        self.CallWCF('UploadBug', obj, function () {
                        }, function () {
                        });
                    });
                    // Enregistrement dans issues
                    var obj1 = {
                        browser: browser,
                        os: os,
                        software: "PanelLeader",
                        type: "Defect",
                        login: self.account.Login,
                        password: self.account.Password,
                        title: "Nouveau bug",
                        detail: detail,
                        sendMail: false
                    };
                    self.CallWCF('CreateIssue', obj1, function () { }, function () { });
                });
            });
        };
        PanelLeaderApp.prototype.showModalSessionLog = function () {
            var self = this;
            var dataBasePath = "";
            var show = function () {
                self.showModal("html/ModalSessionLog.html", Framework.LocalizationManager.Get("SessionLog") + " " + self.session.Name, function (mw) {
                    var vm = new ViewModels.ModalSessionLogViewModel(mw, self.session.GetSessionInfo(dataBasePath + "/" + self.session.Name));
                    vm.HelpPage = "modalSessionLog";
                    self.OnModalSessionLogViewModelLoaded(vm);
                    return vm;
                }, undefined, undefined, true);
            };
            if (self.session.LocalDirectoryId != "0") {
                self.dbDirectory.GetItemOnServer(self.session.LocalDirectoryId).then(function (dir) {
                    //self.dbLocalDirectory.GetAllItems(() => { }, () => { }, (directories: PanelLeaderModels.LocalDirectory[]) => {
                    self.dbDirectory.DownloadItems(function () { }, function () { }, function (directories) {
                        var parents = dir.GetParentDirectories(directories);
                        parents.forEach(function (x) {
                            dataBasePath += "/" + x.Name;
                        });
                        show();
                    });
                });
            }
            else {
                show();
            }
        };
        PanelLeaderApp.prototype.showModalScreenXML = function (screens, listDesigns, callback) {
            var self = this;
            this.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("Screen"), function (mw) {
                var vm = new ViewModels.ModalScreenFromXMLViewModel(mw, screens, listDesigns, callback);
                vm.HelpPage = "modalScreenXML";
                self.OnModalScreenFromXMLViewModelLoaded(vm);
                return vm;
            }, undefined, "830px", true, false, true);
        };
        PanelLeaderApp.prototype.showModalScreenProperties = function (screen, screenIndex, onChange, scenarioView) {
            var self = this;
            this.showModal("html/ModalDefault.html", Framework.LocalizationManager.Format("ScreenId", [screenIndex.toString()]), function (mw) {
                var vm = new ViewModels.ModalScreenPropertiesViewModel(mw, screen, self.session.ListExperimentalDesigns, self.session.ListSubjects, onChange);
                vm.HelpPage = "modalScreenProperties";
                vm.SetBackground = function (currentScreen, background) {
                    var memoryBackground = currentScreen.Background;
                    var cmd = new Framework.Command(function () {
                        self.session.SetScreenBackground(currentScreen, background);
                        onChange();
                    }, function () {
                        self.session.SetScreenBackground(currentScreen, memoryBackground);
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                vm.SetExperimentalDesign = function (currentScreen, experimentalDesignId) {
                    var memoryId = currentScreen.ExperimentalDesignId;
                    var cmd = new Framework.Command(function () {
                        self.session.SetScreenExperimentalDesign(currentScreen, experimentalDesignId);
                        onChange();
                    }, function () {
                        self.session.SetScreenExperimentalDesign(currentScreen, memoryId);
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                //TODo : méthode dans session
                vm.SetTimer = function (currentScreen, timer) {
                    var undoTimer = !timer;
                    var cmd = new Framework.Command(function () {
                        if (timer == true) {
                            var control_1 = ScreenReader.Controls.CustomTimer.Create("Visible", 60);
                            scenarioView.AddControlToScreen(currentScreen, control_1, function (c) {
                                scenarioView.SetCurrentControl(control_1);
                            }, true);
                        }
                        else {
                            scenarioView.RemoveControlFromScreen(currentScreen, currentScreen.GetTimer());
                        }
                    }, function () {
                        if (undoTimer == true) {
                            var control_2 = ScreenReader.Controls.CustomTimer.Create("Visible", 60);
                            scenarioView.AddControlToScreen(currentScreen, control_2, function (c) {
                                scenarioView.SetCurrentControl(control_2);
                            }, true);
                        }
                        else {
                            scenarioView.RemoveControlFromScreen(currentScreen, currentScreen.GetTimer());
                        }
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                //TODo : méthode dans session
                vm.SetChronometer = function (currentScreen, chronometer) {
                    var undoChronometer = !chronometer;
                    var cmd = new Framework.Command(function () {
                        if (chronometer == true) {
                            var control_3 = ScreenReader.Controls.CustomChronometer.Create(60);
                            scenarioView.AddControlToScreen(currentScreen, control_3, function (c) {
                                scenarioView.SetCurrentControl(control_3);
                            }, true);
                        }
                        else {
                            scenarioView.RemoveControlFromScreen(currentScreen, currentScreen.GetChronometer());
                        }
                    }, function () {
                        if (undoChronometer == true) {
                            var control_4 = ScreenReader.Controls.CustomChronometer.Create(60);
                            scenarioView.AddControlToScreen(currentScreen, control_4, function (c) {
                                scenarioView.SetCurrentControl(control_4);
                            }, true);
                        }
                        else {
                            scenarioView.RemoveControlFromScreen(currentScreen, currentScreen.GetChronometer());
                        }
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                //TODo : méthode dans session
                vm.SetConditionalVisibility = function (currentScreen, conditional) {
                    var undoConditional = !conditional;
                    var cmd = new Framework.Command(function () {
                        currentScreen.IsConditionnal = conditional;
                        onChange();
                    }, function () {
                        currentScreen.IsConditionnal = undoConditional;
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                //TODo : méthode dans session
                vm.SetSpeechRecognition = function (currentScreen, recognition) {
                    var cmd = new Framework.Command(function () {
                        var spt = currentScreen.GetSpeechToText();
                        if (spt) {
                            scenarioView.RemoveControlFromScreen(currentScreen, spt);
                        }
                        if (recognition != "None") {
                            var designType = "";
                            var designs = self.session.ListExperimentalDesigns.filter(function (x) {
                                return x.Id === currentScreen.ExperimentalDesignId;
                            });
                            if (designs.length > 0) {
                                designType = designs[0].Type;
                            }
                            var control_5 = ScreenReader.Controls.SpeechToText.Create(designType, recognition);
                            scenarioView.AddControlToScreen(currentScreen, control_5, function (c) {
                                scenarioView.SetCurrentControl(control_5);
                            }, true);
                        }
                    }, function () {
                        scenarioView.RemoveControlFromScreen(currentScreen, currentScreen.GetSpeechToText());
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };
                vm.ToggleScreenCondition = function (screen, condition, value) {
                    self.session.ToggleScreenCondition(screen, condition, value);
                };
                self.OnModalScreenPropertiesViewModelLoaded(vm);
                mw.Float('right');
                return vm;
            }, "100vh", "500px", true, false, true);
        };
        PanelLeaderApp.prototype.showModalSessionsDB = function (callbackOnSelectSession, callbackOnClose, canClose) {
            if (callbackOnClose === void 0) { callbackOnClose = undefined; }
            if (canClose === void 0) { canClose = true; }
            var self = this;
            var listLinkToLocalSession = [];
            var listLocalDirectory = [];
            //self.dbLinkToLocalSession.GetAllItems(() => { }, () => { }, (list: PanelLeaderModels.LinkToLocalSession[]) => {
            self.dbSessionShortcut.DownloadItems(function () { }, function () { }, function (list) {
                listLinkToLocalSession = list;
                //self.dbLocalDirectory.GetAllItems(() => { }, () => { }, (list: PanelLeaderModels.LocalDirectory[]) => {
                self.dbDirectory.DownloadItems(function () { }, function () { }, function (list) {
                    listLocalDirectory = list;
                    show();
                });
            });
            var show = function () {
                self.showModal("html/ModalSessionsDB.html", Framework.LocalizationManager.Get("LocalSessions"), function (mw) {
                    var vm = new ViewModels.ModalSessionsDBViewModel(mw, listLocalDirectory, listLinkToLocalSession, callbackOnSelectSession, callbackOnClose);
                    vm.HelpPage = "modalSessionsDB";
                    vm.SaveAs = function (linkToLocalSession, filename, description, localDirectoryId, callback) {
                        self.isSaving = true;
                        //self.session.Name = PanelLeaderModels.ServerSessionShortcut.GetValidName(linkToLocalSession, filename, listLinkToLocalSession); //TODO : message si rename
                        self.session.Name = filename;
                        self.session.Description = description;
                        self.session.LocalDirectoryId = localDirectoryId;
                        self.session.Version = self.version;
                        var link = new PanelLeaderModels.ServerSessionShortcut();
                        link.Description = self.session.Description;
                        link.Name = self.session.Name;
                        link.LocalDirectoryId = localDirectoryId;
                        ;
                        self.dbSessionShortcut.SaveItem(link, function () { }, function () { }, function (item) {
                            self.session.ID = item.ID;
                            self.dbSession.SaveItem(self.session, function () { }, function () { }, function () {
                                self.isSaving = false;
                                callback();
                            });
                        });
                    };
                    vm.CreateDirectory = function (parentDirectory, callback) {
                        var newDirectory = PanelLeaderModels.ServerDirectory.Create(parentDirectory, listLocalDirectory);
                        self.dbDirectory.SaveItem(newDirectory, function () { }, function () { }, function (item) {
                            listLocalDirectory.push(item);
                            callback();
                        });
                    };
                    vm.DeleteDirectory = function (directory, callback) {
                        self.dbDirectory.RemoveItem(directory, function () { }, function () { }, function (item) {
                            Framework.Array.Remove(listLocalDirectory, item);
                            callback();
                            //TODO : supprimer link et session du directory
                        });
                    };
                    vm.RenameDirectory = function (directory, newName, callback) {
                        directory.Name = PanelLeaderModels.ServerDirectory.GetValidDirectoryName(directory, newName, listLocalDirectory);
                        self.dbDirectory.SaveItem(directory, function () { }, function () { }, function (item) {
                            callback(directory.Name);
                        });
                    };
                    vm.DeleteSession = function (link, callback) {
                        self.dbSessionShortcut.RemoveItem(link, function () { }, function () { }, function (item) {
                            Framework.Array.Remove(listLinkToLocalSession, item);
                            self.dbSession.GetItemOnServer(item.ID).then(function (x) {
                                //TODO : suppression session
                                if (x != null) {
                                    self.dbSession.RemoveItem(x, function () { }, function () { }, function () {
                                        self.menuViewModel.SetRecentFiles(listLinkToLocalSession);
                                        callback();
                                    });
                                }
                            });
                        });
                    };
                    vm.RenameSession = function (link, newName, callback) {
                        link.Name = PanelLeaderModels.ServerSessionShortcut.GetValidName(link, newName, listLinkToLocalSession);
                        self.dbSessionShortcut.SaveItem(link, function () { }, function () { }, function (item) {
                            callback(link.Name);
                            self.dbSession.GetItemOnServer(link.ID).then(function (x) {
                                x.Name = link.Name;
                                self.dbSession.SaveItem(x, function () { }, function () { }, function () { });
                            });
                        });
                    };
                    self.OnModalSessionsDBViewModelLoaded(vm);
                    return vm;
                }, "80vh", "70vw", canClose);
            };
        };
        PanelLeaderApp.prototype.showModalTemplatedSessionsDB = function (callbackOnSelectSession, callbackOnClose, canClose) {
            if (callbackOnClose === void 0) { callbackOnClose = undefined; }
            if (canClose === void 0) { canClose = true; }
            var self = this;
            var listLinkToLocalSession = [];
            var listLocalDirectory = [];
            self.dbSessionShortcut.DownloadItems(function () { }, function () { }, function (list) {
                listLinkToLocalSession = list;
                self.dbDirectory.DownloadItems(function () { }, function () { }, function (list) {
                    listLocalDirectory = list;
                    show();
                });
            });
            var show = function () {
                self.showModal("html/ModalSessionsDB.html", Framework.LocalizationManager.Get("LocalSessions"), function (mw) {
                    var vm = new ViewModels.ModalSessionsDBViewModel(mw, listLocalDirectory, listLinkToLocalSession, callbackOnSelectSession, callbackOnClose);
                    vm.HelpPage = "modalSessionsDB";
                    self.OnModalTemplatedSessionsDBLoaded(vm);
                    return vm;
                }, "80vh", "70vw", canClose);
            };
        };
        PanelLeaderApp.prototype.showModalAnalysis = function (listData) {
            var _this = this;
            var self = this;
            var dbAnalysisTemplates = Framework.Database.ServerDB.GetInstance("AnalysisTemplate", self.account.PanelLeaderApplicationSettings.DatabaseSynchronization, self.wcfServiceUrl, self.account.Login, self.account.Password);
            //dbAnalysisTemplates.GetAllItems(() => { }, () => { }, (templates: PanelLeaderModels.AnalysisTemplate[]) => {
            dbAnalysisTemplates.DownloadItems(function () { }, function () { }, function ( /*templates: PanelLeaderModels.AnalysisTemplate[]*/) {
                self.showModal("html/ModalAnalysis.html", Framework.LocalizationManager.Get("Analysis"), function (mw) {
                    var dataTypes = [];
                    if (self.session.ListData.length > 0) {
                        dataTypes = Framework.Array.Unique(self.session.ListData.map(function (x) { return Models.DataType[x.Type]; }));
                    }
                    //let appropriateTemplates = [];
                    //dataTypes.forEach((x) => {
                    //    let dataTemplates = templates.filter((y) => { return y.DataType == x });
                    //    dataTemplates.forEach((y) => {
                    //        appropriateTemplates.push(y);
                    //    });
                    //});
                    var vm = new ViewModels.ModalAnalysisViewModel(mw, listData, dataTypes /*, appropriateTemplates*/);
                    vm.HelpPage = "modalAnalysis";
                    //private analyzeEmotionsInVideos(listVideos: string[]) {
                    //    let self = this;
                    //    listVideos.forEach((x) => {
                    //        //self.setBackgroundTaskInformation(Framework.LocalizationManager.Get("AnalyzingEmotionsInVideos"));
                    //        WCF.AnalyzeEmotionsInVideo(this.license.Login, this.license.Password, this.session.Upload.ServerCode, x, (result: string) => {
                    //            // Log local et serveur
                    //            let detail = "[" + Framework.Format.ToDateString() + "] ";
                    //            detail += "[" + self.license.Login + "] download [" + result.length + "] data.";
                    //            // Mise à jour des données
                    //            //self.AddData(result, "AnalyzeEmotionInVideo", detail, true);
                    //            //TODO : téléchargement des données et suppression des images sur le serveur, fps
                    //        }, (e) => {
                    //        });
                    //    });
                    //}
                    vm.RServerLogin = _this.account.Login;
                    vm.RServerPassword = _this.account.Password;
                    vm.RServerWCFServiceURL = _this.wcfServiceUrl;
                    vm.RServerOnComplete = function () {
                        //TODO
                        //self.session.LogAction("Analysis", "Analysis [" + dataType + "] run with [" + result.Status + "].", true);
                        //self.notify(Framework.LocalizationManager.Format("RunningRScriptOnServer", [result.Status]), result.Status);    
                    };
                    //vm.RunAnalysis = (analysis: PanelLeaderModels.Analysis, language: string, dataType: string, listData: Models.Data[], callback: () => void, productLabels: string, attributeLabels: string, subjectLabels: string) => {
                    //    let cmd = new Framework.Command(() => {
                    //        //TODO : check paramètres impératifs
                    //        //TODO : traitement des variables supplémentaires -> variable ByVariable
                    //        //TODO : attention aux caractères spéciaux
                    //        let self = this;
                    //        listData.forEach((x) => {
                    //            // Variable(s) supplémentaire (session par défaut)                    
                    //            x["ByVariable"] = "Session " + x.Session;
                    //            //TODO
                    //            //if (this.selectedVariables.length > 0) {         
                    //            //    if (this.selectedVariables.indexOf("Replicate") > -1) {
                    //            //        x["ByVariable"] += ", Replicate " + x.Replicate;
                    //            //    }
                    //            //}
                    //            if (productLabels == "labels") {
                    //                //TOFIX
                    //                //let label = self.session.ListProducts.filter((p) => { return p.Code == x.ProductCode })[0].Description;
                    //                //if (label.length > 0) {
                    //                //    x.ProductCode = label;
                    //                //}
                    //            }
                    //            if (attributeLabels == "labels") {
                    //                //TOFIX
                    //                //let label = self.session.ListAttributes.filter((a) => { return a.Code == x.AttributeCode })[0].Description;
                    //                //if (label.length > 0) {
                    //                //    x.AttributeCode = label;
                    //                //}
                    //            }
                    //            let label = "";
                    //            if (subjectLabels == "firstNames") {
                    //                label = self.session.ListSubjects.filter((s) => { return s.Code == x.SubjectCode })[0].FirstName;
                    //            }
                    //            if (subjectLabels == "lastNames") {
                    //                label = self.session.ListSubjects.filter((s) => { return s.Code == x.SubjectCode })[0].LastName;
                    //            }
                    //            if (label.length > 0) {
                    //                x.SubjectCode = label;
                    //            }
                    //        });
                    //        //TOFIX
                    //        //public GetProductColors(): string {
                    //        //    let res: string = "c()";
                    //        //    let colors = this.ListProducts.map((x) => { return x.Code + '="' + x.Color + '"' });
                    //        //    res = "c(" + colors.join(',') + ")";
                    //        //    return res;
                    //        //}
                    //        let script: string = PanelLeaderModels.Analysis.GetRCode(analysis, listData, language, "", "");
                    //        let obj = {
                    //            script: script,
                    //            login: self.license.Login,
                    //            password: self.license.Password
                    //        };
                    //        self.CallWCF('RunRScript', obj, () => {
                    //            self.notify(Framework.LocalizationManager.Format("RunningRScriptOnServer", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                    //        }, (result) => {
                    //            //TODO : affichage dans nouvelle fenêtre + bouton pour enregistrer sous (html, zip, doc, pdf) + bouton pour uploader
                    //            //let wnd:Window = window.open("about:blank", "", "_blank");                
                    //            //wnd.document.write(s.d);
                    //            //Bug
                    //            //var reader = new FileReader();
                    //            //var out = new Blob([s.d], { type: 'text/html;charset=utf-8' });
                    //            //reader.onload = function (e) {
                    //            //    window.location.href = reader.result;
                    //            //}
                    //            //reader.readAsDataURL(out);
                    //            //TODO : Fichier HTMl obtenu : 
                    //            // Liens vers lib TimeSens ou inclure dans le fichier
                    //            //SaveAsZip
                    //            //SaveAsDoc
                    //            //SaveAsPdf
                    //            //SaveAsPpt
                    //            //UploadAsReport
                    //            //(AttachInXml)
                    //            // Différents templates
                    //            // Chaque tableau : tri, filtre, export csv, html, excel + possibilité d'éditer
                    //            // Chaque image : export png, jpg, wmf + possibilité d'éditer
                    //            // + copié/collé, tout exporter d'un coup'
                    //            if (result.Status == 'success') {
                    //                let res = result.Result;
                    //                res = res.split('<script src="lib').join('<script src="' + self.rootURL + '/analyses/lib');
                    //                res = res.split('<link href="lib').join('<link href="' + self.rootURL + '/analyses/lib');
                    //                var myblob = new Blob([res], {
                    //                    type: 'text/html'
                    //                });
                    //                let name = "TimeSensResult_" + self.session.Name + "_" + dataType + "_" + Framework.Format.ToDateString().replace(' ', '_') + ".html";
                    //            }
                    //            self.session.LogAction("Analysis", "Analysis [" + dataType + "] run with [" + result.Status + "].", true);
                    //            self.notify(Framework.LocalizationManager.Format("RunningRScriptOnServer", [result.Status]), result.Status);
                    //            Framework.FileHelper.SaveAs(myblob, name);
                    //            callback();
                    //        });
                    //    });
                    //    self.commandInvoker.ExecuteCommand(cmd);
                    //};
                    //vm.RemoveAnalysisTemplate = (template: PanelLeaderModels.AnalysisTemplate, callback: () => void) => {
                    //    let cmd = new Framework.Command(() => {
                    //        dbAnalysisTemplates.RemoveItem(template, () => { }, () => { }, () => {
                    //            callback();
                    //            //TODO : confirmation
                    //            //TODO : actualiser (pas de modèle)
                    //        });
                    //        //self.logAction("Scenario", "control " + param.control._FriendlyName + " added on screen " + param.screen.Id + ".");
                    //    }, () => {
                    //        //TODO
                    //    });
                    //    self.commandInvoker.ExecuteCommand(cmd);
                    //};
                    //vm.ShowModalSaveAnalysisAsTemplate = (analysis: PanelLeaderModels.Analysis, onComplete: () => void) => {
                    //    self.showModalSaveAnalysisAsTemplate(templates.map((x) => { return x.Name }), analysis, onComplete);
                    //};
                    vm.ImputData = function (listData, save) {
                        var cmd = new Framework.Command(function () {
                            self.addData(listData, save, "imputation");
                        }, function () {
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    };
                    self.OnModalAnalysisViewModelLoaded(vm);
                    return vm;
                }, "80vh", "80vw", true);
            });
        };
        PanelLeaderApp.prototype.showModalSessionWizard = function () {
            var self = this;
            this.showModal("html/ModalSessionWizard.html", Framework.LocalizationManager.Get("SessionWizard"), function (mw) {
                var vm = new ViewModels.ModalSessionWizardViewModel(mw);
                vm.ShowModalSessionTemplateDB = function (onLoaded) {
                    self.showModalTemplatedSessionsDB(function (id) {
                        self.dbSessionShortcut.GetItemOnServer(id).then(function (link) {
                            self.dbSession.GetItemOnServer(id).then(function (session) {
                                if (session != null) {
                                    onLoaded(session);
                                }
                                else {
                                }
                            });
                        });
                    });
                };
                vm.CreateNewSessionFromTemplate = function (template) {
                    var session = PanelLeaderModels.Session.FromTemplate(template);
                    self.SetNewSession(session, true);
                };
                vm.SaveSession = function (session) {
                    self.SetNewSession(session, true);
                };
                vm.UploadSession = function (session, onUploaded) {
                    var templatedSubjectSeance = Models.TemplatedSubjectSeance.CreateTemplatedSubjectSeance(session, self.account);
                    var obj = {
                        login: self.account.Login,
                        password: self.account.Password,
                        jsonTemplatedSubjectSeance: JSON.stringify(templatedSubjectSeance),
                    };
                    var wsvc = 'UploadSubjectsSeance';
                    self.CallWCF(wsvc, obj, function () {
                    }, function (res) {
                        if (res.Status == 'success') {
                            var serverCode = res.Result;
                            session.SetUpload(self.rootURL, serverCode, self.account.Login, self.account.Password);
                            onUploaded();
                        }
                        else {
                            //self.session.LogAction("Upload", "Error during session upload.", false);
                        }
                        self.notify(Framework.LocalizationManager.Format("UploadingSession", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                    });
                };
                vm.HelpPage = "modalSessionWizard";
                self.OnModalSessionWizardViewModelLoaded(vm);
                return vm;
            }, "80vh", "1000px", true);
        };
        PanelLeaderApp.prototype.showModalLogin = function () {
            var _this = this;
            var self = this;
            this.showModal("html/ModalLogin.html", Framework.LocalizationManager.Get("Login"), function (mw) {
                var login = "";
                var password = "";
                if (_this.account) {
                    login = _this.account.Login;
                    password = _this.account.Password;
                }
                var vm = new ViewModels.ModalLoginViewModel(mw, login, password);
                vm.Login = function (login, password) {
                    self.login(login, password, function () {
                        mw.Close();
                    }, function (error) {
                        vm.OnError(Framework.LocalizationManager.Get(error));
                    });
                };
                vm.HelpPage = "modalLogin";
                self.OnModalLoginViewModelLoaded(vm);
                return vm;
            });
        };
        PanelLeaderApp.prototype.showModalSaveAsUndeployedCopy = function () {
            var self = this;
            this.showModal("html/ModalSaveAsUndeployedCopy.html", Framework.LocalizationManager.Get("SaveAsCopy"), function (mw) {
                var vm = new ViewModels.ModalSaveSessionAsUndeployedCopyViewModel(mw);
                vm.HelpPage = "modalSettings";
                vm.SaveSessionAsUndeployedCopy = function (deleteUpload, deleteData, deleteSubjects, deleteProducts, deleteAttributes, deleteMail, callback) {
                    var copyOfSession = self.session.SaveAsUndeployedCopy(deleteUpload, deleteData, deleteSubjects, deleteProducts, deleteAttributes, deleteMail);
                    copyOfSession.Name = Framework.LocalizationManager.Get("CopyOf ") + copyOfSession.Name;
                    self.SetNewSession(copyOfSession, true);
                    callback();
                };
                self.OnModalSaveSessionAsUndeployedCopyViewModelLoaded(vm);
                return vm;
            }, undefined, undefined, false);
        };
        PanelLeaderApp.prototype.showModalSendMail = function (recipients, onClose) {
            var self = this;
            var dbMailTemplates = Framework.Database.ServerDB.GetInstance("MailTemplate", self.account.PanelLeaderApplicationSettings.DatabaseSynchronization, self.wcfServiceUrl, self.account.Login, self.account.Password);
            //dbMailTemplates.GetAllItems(() => { }, () => { }, (templates: PanelLeaderModels.MailTemplate[]) => {
            dbMailTemplates.DownloadItems(function () { }, function () { }, function (templates) {
                var defaultTemplates = templates.filter(function (y) { return y.IsDefault == true; });
                if (defaultTemplates.length > 0) {
                    var defaultTemplate = defaultTemplates[defaultTemplates.length - 1];
                    self.session.SetMailFromTemplate(defaultTemplate);
                }
                self.showModal("html/ModalSendMail.html", Framework.LocalizationManager.Get("SendMail"), function (mw) {
                    var vm = new ViewModels.ModalMailViewModel(mw, templates, self.session.Mail, recipients, onClose);
                    vm.HelpPage = "modalSendMail";
                    vm.RemoveMailTemplate = function (template, callback) {
                        dbMailTemplates.RemoveItem(template, function () { }, function () { }, function () { callback(); });
                    };
                    vm.SaveMailTemplate = function (template, callback) {
                        dbMailTemplates.SaveItem(template, function () { }, function () { }, function () { callback(); });
                    };
                    vm.SendMail = function (recipients, subject, body, displayName, returnAddress, saveAsTemplate, callback, templates) {
                        //TODO Fractionner envoi de mails
                        self.session.Mail.Body = body;
                        self.session.Mail.DisplayedName = displayName;
                        self.session.Mail.ReturnMailAddress = returnAddress;
                        self.session.Mail.Subject = subject;
                        if (saveAsTemplate == true) {
                            self.showSaveAsMailTemplate(recipients, templates);
                        }
                        else {
                            self.sendMail(recipients, callback);
                        }
                    };
                    self.OnModalMailViewModelLoaded(vm);
                    return vm;
                }, undefined, undefined, true);
            });
        };
        return PanelLeaderApp;
    }(Framework.App));
    PanelLeader.PanelLeaderApp = PanelLeaderApp;
    var ViewModels;
    (function (ViewModels) {
        var PanelLeaderViewModel = /** @class */ (function (_super) {
            __extends(PanelLeaderViewModel, _super);
            function PanelLeaderViewModel() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.isLocked = false;
                return _this;
            }
            PanelLeaderViewModel.prototype.OnLockChanged = function (isLocked) {
            };
            return PanelLeaderViewModel;
        }(Framework.ViewModel));
        ViewModels.PanelLeaderViewModel = PanelLeaderViewModel;
        var PanelLeaderModalViewModel = /** @class */ (function (_super) {
            __extends(PanelLeaderModalViewModel, _super);
            function PanelLeaderModalViewModel(mw) {
                var _this = _super.call(this) || this;
                _this.mw = mw;
                return _this;
            }
            PanelLeaderModalViewModel.prototype.Close = function () {
                this.mw.Close();
            };
            return PanelLeaderModalViewModel;
        }(PanelLeaderViewModel));
        ViewModels.PanelLeaderModalViewModel = PanelLeaderModalViewModel;
        var MenuViewModel = /** @class */ (function () {
            function MenuViewModel() {
                this.hasSessionDefined = false;
                this.canUndo = false;
                this.canRedo = false;
                this.canSave = false;
                this.isUploaded = false;
                this.hasData = false;
                this.isOnline = true;
                var self = this;
                //self.anchorMenuImportSessionV1 = Framework.Form.ClickableElement.Register("anchorMenuImportSessionV1", () => { return true }, () => {
                //    Framework.FileHelper.BrowseFile(".xml", (file: File) => {
                //        var fileReader: FileReader = new FileReader();
                //        fileReader.onload = function (e) {
                //            let json: string = <any>fileReader.result;
                //            let session = JSON.parse(json);
                //            let wb = new Framework.ExportManager("", "", "");
                //            let data = session.ListData;
                //            if (data.length > 0) {
                //            let selectedDataType = Models.Data.GetType(data[0]);
                //            let TableData = new Framework.Form.Table<Models.Data>();
                //            TableData.ListColumns = [];
                //            let col0 = new Framework.Form.TableColumn();
                //            col0.Name = "Type";
                //            col0.Title = Framework.LocalizationManager.Get("Type");
                //            col0.RemoveSpecialCharacters = true;
                //            col0.MinWidth = 100;
                //            TableData.ListColumns.push(col0);
                //            let col1 = new Framework.Form.TableColumn();
                //            col1.Name = "Session";
                //            col1.Title = Framework.LocalizationManager.Get("Session");
                //            col1.RemoveSpecialCharacters = true;
                //            col1.MinWidth = 100;
                //            TableData.ListColumns.push(col1);
                //            let col5 = new Framework.Form.TableColumn();
                //            col5.Name = "Replicate";
                //            col5.Title = Framework.LocalizationManager.Get("Replicate");
                //            col5.Type = "integer";
                //            col5.DefaultValue = 1;
                //            col5.MinWidth = 100;
                //            TableData.ListColumns.push(col5);
                //            let col6 = new Framework.Form.TableColumn();
                //            col6.Name = "Intake";
                //            col6.Title = Framework.LocalizationManager.Get("Intake");
                //            col6.Type = "positiveInteger";
                //            col6.DefaultValue = 1;
                //            col6.MinWidth = 100;
                //            TableData.ListColumns.push(col6);
                //            let col2 = new Framework.Form.TableColumn();
                //            col2.Name = "SubjectCode";
                //            col2.Title = Framework.LocalizationManager.Get("Subject");
                //            col2.RemoveSpecialCharacters = true;
                //            col2.MinWidth = 100;
                //            TableData.ListColumns.push(col2);
                //            let col3 = new Framework.Form.TableColumn();
                //            col3.Name = "ProductCode";
                //            col3.Title = Framework.LocalizationManager.Get("Product");
                //            col3.RemoveSpecialCharacters = true;
                //            col3.MinWidth = 100;
                //            TableData.ListColumns.push(col3);
                //            TableData.ListData = data;
                //            let col4 = new Framework.Form.TableColumn();
                //            col4.Name = "AttributeCode";
                //            col4.Title = Framework.LocalizationManager.Get("Attribute");
                //            col4.RemoveSpecialCharacters = true;
                //            col4.MinWidth = 100;
                //            TableData.ListColumns.push(col4);
                //                let col7 = new Framework.Form.TableColumn();
                //                col7.Name = "Score";
                //                col7.Title = Framework.LocalizationManager.Get("Score");
                //                col7.Type = "number";
                //                col7.MinWidth = 100;
                //                TableData.ListColumns.push(col7);
                //            let col8 = new Framework.Form.TableColumn();
                //            col8.Name = "ControlName";
                //            col8.Title = Framework.LocalizationManager.Get("ControlName");
                //            col8.RemoveSpecialCharacters = true;
                //            col8.MinWidth = 100;
                //            TableData.ListColumns.push(col8);
                //            let col81 = new Framework.Form.TableColumn();
                //            col81.Name = "Time";
                //            col81.Title = Framework.LocalizationManager.Get("Time");
                //            col81.Type = "number";
                //            col81.MinWidth = 100;
                //            TableData.ListColumns.push(col81);
                //            let col11 = new Framework.Form.TableColumn();
                //            col11.Name = "QuestionLabel";
                //            col11.Title = Framework.LocalizationManager.Get("Label");
                //            col11.RemoveSpecialCharacters = true;
                //            TableData.ListColumns.push(col11);
                //            let col12 = new Framework.Form.TableColumn();
                //            col12.Name = "Description";
                //            col12.Title = Framework.LocalizationManager.Get("Description");
                //            TableData.ListColumns.push(col12);
                //            let col14 = new Framework.Form.TableColumn();
                //            col14.Name = "RecordedDate";
                //            col14.Title = Framework.LocalizationManager.Get("Date");
                //            col14.Editable = false;
                //            col14.MinWidth = 100;
                //            col14.RenderFunction = (val, row) => { return new Date(val).toLocaleString(); };
                //                TableData.ListColumns.push(col14);
                //                wb.AddWorksheet("data", TableData.GetAsArray());
                //            }
                //            wb.Save("data", "xlsx");
                //            //Framework.Encryption.DecryptString(json, "ebakleklmj1454agrlkagkéçç!zf", (decrypted: string) => {
                //            //    let session = JSON.parse(decrypted);
                //            //});
                //        }
                //        fileReader.readAsText(file);
                //    })
                //});
                self.anchorMenuFullScreen = Framework.Form.ClickableElement.Register("anchorMenuFullScreen", undefined, function () {
                    Framework.Browser.ToggleFullScreen();
                    if (Framework.Browser.IsFullScreen == false) {
                        self.anchorMenuFullScreen.SetInnerHTML('<i class="fas fa-expand-arrows-alt"></i>');
                    }
                    else {
                        self.anchorMenuFullScreen.SetInnerHTML('<i class="fas fa-compress-arrows-alt"></i>');
                    }
                });
                self.anchorMenuAbout = Framework.Form.ClickableElement.Register("anchorMenuAbout", function () {
                    return self.hasSessionDefined == true;
                }, function () {
                    self.ShowModalSessionLog();
                });
                self.anchorMenuNewSessionFromXML = Framework.Form.ClickableElement.Register("anchorMenuNewSessionFromXML", undefined, function () { self.ShowModalNewSessionFromArchive(); });
                self.anchorMenuNewSessionFromWizard = Framework.Form.ClickableElement.Register("anchorMenuNewSessionFromWizard", undefined, function () {
                    self.ShowModalSessionWizard();
                });
                //self.anchorMenuNewSessionFromDelimitedTextFile = Framework.Form.ClickableElement.Register("anchorMenuNewSessionFromDelimitedTextFile", undefined, () => { self.ShowModalNewSessionFromDelimitedTextFile(); });
                //TODO self.anchorMenuNewSessionFromFromTemplate = Framework.Form.ClickableElement.Register("anchorMenuNewSessionFromFromTemplate", undefined, () => { controller.ShowModalNewSessionFromTemplate(); });
                self.anchorMenuExportSessionAsXML = Framework.Form.ClickableElement.Register("anchorMenuExportSessionAsXML", function () { return self.hasSessionDefined; }, function () { self.ExportSessionAsArchive(); }); //TODO : actualiser quand session change
                self.anchorMenuBrowseLocalDB = Framework.Form.ClickableElement.Register("anchorMenuBrowseLocalDB", undefined, function () {
                    self.ShowModalSessionsDB();
                });
                self.anchorMenuSaveSessionInLocalDB = Framework.Form.ClickableElement.Register("anchorMenuSaveSessionInLocalDB", function () { return self.hasSessionDefined; }, function () {
                    self.SaveSessionInLocalDB();
                });
                //self.anchorMenuCurrentFile = Framework.Form.ClickableElement.Register("anchorMenuCurrentFile", () => { return self.hasSessionDefined }, () => {
                //    self.ShowModalSessionLog();
                //});
                self.anchorMenuSaveSessionAsUndeployedCopy = Framework.Form.ClickableElement.Register("anchorMenuSaveSessionAsUndeployedCopy", function () { return self.hasSessionDefined; }, function () {
                    self.ShowModalSaveAsUndeployedCopy();
                }); //TODO : actualiser quand session change
                //TODO self.anchorMenuSaveSessionAsTemplate = Framework.Form.ClickableElement.Register("anchorMenuSaveSessionAsTemplate", () => { return controller.Session != undefined }, () => { controller.ShowModalSaveSessionAsTemplate(); });        //TODO : actualiser quand session change
                //self.anchorMenuExit = Framework.Form.ClickableElement.Register("anchorMenuExit", () => {
                //    return true;
                //}, () => {
                //    Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToExitTimeSens"), () => {
                //        self.Exit();
                //    });
                //});
                self.anchorMenuShowSettings = Framework.Form.ClickableElement.Register("anchorMenuShowSettings", undefined, function () {
                    self.ShowModalSettings();
                });
                //self.anchorMenuAbout = Framework.Form.ClickableElement.Register("anchorMenuAbout", undefined, () => { controller.ShowModalAbout(); });
                //self.anchorMenuHelp = Framework.Form.ClickableElement.Register("anchorMenuHelp", undefined, () => {
                //    self.ShowModalHelp();
                //});
                self.anchorMenuLogout = Framework.Form.ClickableElement.Register("anchorMenuLogout", function () { return true; }, function () {
                    self.LogOut();
                });
                //self.anchorMenuToggleLock = Framework.Form.ClickableElement.Register("anchorMenuToggleLock", () => {
                //    //return self.hasSessionDefined
                //    return false;
                //}, () => {
                //    self.ToggleLock();
                //});
                //self.anchorMenuToggleLock.Disable();
                //self.anchorMenuUndo = Framework.Form.ClickableElement.Register("anchorMenuUndo", () => {
                //    //return self.canUndo;
                //    return false;
                //}, () => { self.Undo(); });
                //self.anchorMenuRedo = Framework.Form.ClickableElement.Register("anchorMenuRedo", () => {
                //    //return self.canRedo;
                //    return false;
                //}, () => { self.Redo(); });
                self.anchorMenuSave = Framework.Form.ClickableElement.Register("anchorMenuSave", function () { return self.canSave; }, function () { self.Save(); });
                self.anchorMenuCurrentSession = Framework.Form.ClickableElement.Register("anchorMenuCurrentSession", function () { return self.hasSessionDefined; }, function () { });
                //this.anchorMenuBug = Framework.Form.ClickableElement.Register("anchorMenuBug", () => { return true; }, () => { self.ShowModalBugReport(); });
                this.anchorMenuWarning = Framework.Form.ClickableElement.Register("anchorMenuWarning", function () { return true; }, function () {
                    self.ShowWarnings();
                });
                this.anchorMenuWarning.Hide();
                //this.iconMenuToggleLock = Framework.Form.TextElement.Register("iconMenuToggleLock");
                this.ulRecentFiles = document.getElementById("ulRecentFiles");
                this.tabProtocol = Framework.Form.ClickableElement.Register("tabProtocol", function () { return self.hasSessionDefined; }, function () { self.ShowViewSubjects(); });
                this.tabScenario = Framework.Form.ClickableElement.Register("tabScenario", function () { return self.hasSessionDefined; }, function () { self.ShowViewScenario(); });
                this.tabDeployment = Framework.Form.ClickableElement.Register("tabDeployment", function () { return self.hasSessionDefined; }, function () { self.ShowViewUpload(); });
                this.tabMonitoring = Framework.Form.ClickableElement.Register("tabMonitoring", function () { return self.isUploaded; }, function () { self.ShowViewMonitoring(); });
                this.tabData = Framework.Form.ClickableElement.Register("tabData", function () { return self.hasData; }, function () { self.ShowViewData(); });
                //self.tabOutputs = Framework.Form.ClickableElement.Register("tabOutputs", () => { return controller.Session != undefined && controller.Session.ListOutputs != undefined && controller.Session.ListOutputs.length > 0; }, () => { controller.SetCurrentView("Outputs"); });
                // TODO - ajouter dans toutes les vues et les modales : Raccourcis clavier            
                //Framework.ShortcutManager.Add(() => { return true; }, 113, () => { self.anchorMenuBug.Click(); });
                //Framework.ShortcutManager.Add(() => { return true; }, 112, () => { self.anchorMenuHelp.Click(); });
                //Framework.ShortcutManager.Add(() => { return self.anchorMenuSave.IsEnabled; }, 83, () => {
                //    self.anchorMenuHelp.Click();
                //}, true);
            }
            Object.defineProperty(MenuViewModel.prototype, "TabProtocol", {
                //private tabAnalysis: Framework.Form.ClickableElement;
                //private tabOutputs: Framework.Form.ClickableElement;
                get: function () { return this.tabProtocol; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(MenuViewModel.prototype, "HasSessionDefined", {
                get: function () { return this.hasSessionDefined; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(MenuViewModel.prototype, "CanUndo", {
                get: function () { return this.canUndo; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(MenuViewModel.prototype, "CanRedo", {
                get: function () { return this.canRedo; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(MenuViewModel.prototype, "CanSave", {
                get: function () { return this.canSave; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(MenuViewModel.prototype, "IsUploaded", {
                get: function () { return this.isUploaded; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(MenuViewModel.prototype, "HasData", {
                get: function () { return this.hasData; },
                enumerable: false,
                configurable: true
            });
            MenuViewModel.prototype.OnLicenseChanged = function (firstName, lastName) {
                if (firstName === void 0) { firstName = undefined; }
                if (lastName === void 0) { lastName = undefined; }
                this.anchorMenuLogout.Disable();
                if (firstName && lastName) {
                    this.anchorMenuLogout.Enable();
                    this.anchorMenuLogout.HighlightOn(Framework.LocalizationManager.Format("ClickToLogOut", [firstName.charAt(0) + ". " + lastName]), "bottom");
                }
            };
            MenuViewModel.prototype.OnSaveChanged = function (hasChanges) {
                //this.canSave = hasChanges;
                this.canSave = true;
                this.anchorMenuSave.CheckState();
                //if (hasChanges == true) {                    
                //    this.anchorMenuSave.Enable();
                //} else {
                //    this.anchorMenuSave.Disable();
                //}
            };
            MenuViewModel.prototype.OnUndoChanged = function (canRedo, canUndo) {
                this.canRedo = canRedo;
                this.canUndo = canUndo;
                //this.anchorMenuUndo.CheckState();
                //this.anchorMenuRedo.CheckState();
            };
            MenuViewModel.prototype.OnSessionChanged = function (hasSessionDefined, isUploaded, hasData, sessionInfo) {
                if (hasSessionDefined === void 0) { hasSessionDefined = false; }
                if (isUploaded === void 0) { isUploaded = false; }
                if (hasData === void 0) { hasData = false; }
                if (sessionInfo === void 0) { sessionInfo = ""; }
                this.hasSessionDefined = hasSessionDefined;
                this.isUploaded = isUploaded;
                this.hasData = hasData;
                this.tabMonitoring.CheckState();
                this.tabData.CheckState();
                this.anchorMenuAbout.CheckState();
                this.anchorMenuAbout.HtmlElement.title = sessionInfo;
                this.anchorMenuAbout.HighlightOn(sessionInfo, 'bottom');
            };
            MenuViewModel.prototype.CheckState = function () {
                this.anchorMenuExportSessionAsXML.CheckState();
                this.anchorMenuSaveSessionInLocalDB.CheckState();
                this.anchorMenuSaveSessionAsUndeployedCopy.CheckState();
                this.anchorMenuCurrentSession.CheckState();
                //this.anchorMenuCurrentFile.CheckState();
                //this.anchorMenuToggleLock.CheckState();
                this.anchorMenuAbout.CheckState();
                this.tabProtocol.CheckState();
                this.tabScenario.CheckState();
                this.tabDeployment.CheckState();
                this.tabMonitoring.CheckState();
                this.tabData.CheckState();
                //this.tabAnalysis.CheckState();
            };
            MenuViewModel.prototype.ShowWarningsPopup = function (warnings) {
                // affichage de tous les warnings quand on clique sur le bouton
                var div = document.createElement("div");
                warnings.forEach(function (x) {
                    div.innerHTML += '<p>' + Framework.LocalizationManager.Get(x) + '</p>';
                });
                Framework.Popup.Show(this.anchorMenuWarning.HtmlElement, div, 'bottom');
            };
            MenuViewModel.prototype.ShowWarning = function (warning, status) {
                var self = this;
                if (status == 'nothing') {
                    this.anchorMenuWarning.Hide();
                    return;
                }
                var div = document.createElement("div");
                var wclass = 'fas fa-info';
                if (status == 'error') {
                    wclass = 'fas fa-exclamation-triangle';
                }
                if (status == 'success') {
                    wclass = 'fas fa-check-circle';
                }
                if (status == 'progress') {
                    wclass = 'fas fa-spinner fa-spin';
                }
                this.anchorMenuWarning.SetInnerHTML('<i class="' + wclass + '"></i>');
                div.innerHTML = Framework.LocalizationManager.Get(warning);
                this.anchorMenuWarning.Show();
                if (warning && warning.length > 0) {
                    setTimeout(function () {
                        Framework.Popup.Show(self.anchorMenuWarning.HtmlElement, div, 'bottom');
                    }, 100);
                }
            };
            MenuViewModel.prototype.HideWarning = function () {
                this.anchorMenuWarning.Hide();
                try {
                    Framework.Popup.Destroy(this.anchorMenuWarning.HtmlElement);
                }
                catch (_a) {
                }
            };
            MenuViewModel.prototype.SetLock = function (isLocked) {
                if (this.hasSessionDefined == false) {
                    return;
                }
                if (isLocked == true) {
                    //TODOthis.controller.AddWarning(Framework.LocalizationManager.Get("SessionIsLocked"));
                    //TODOthis.controller.Notify(Framework.LocalizationManager.Get("SessionIsLocked"), 'info');
                    //this.iconMenuToggleLock.HighlightOn(Framework.LocalizationManager.Get("SessionIsLocked"), "bottom");
                    //this.iconMenuToggleLock.HtmlElement.className = "fa fa-lock";
                }
                else {
                    //this.controller.RemoveWarning(Framework.LocalizationManager.Get("SessionIsLocked"));
                    //this.iconMenuToggleLock.HighlightOn(Framework.LocalizationManager.Get("SessionIsUnlocked"), "bottom");
                    //this.iconMenuToggleLock.HtmlElement.className = "fa fa-unlock";
                }
                //this.anchorMenuToggleLock.Enable();
                //this.anchorMenuCurrentFile.Enable();
            };
            MenuViewModel.prototype.SetRecentFiles = function (ls) {
                var self = this;
                try {
                    self.ulRecentFiles.innerHTML = "";
                    ls.forEach(function (link) {
                        if (link != null) {
                            var li = document.createElement("li");
                            var a = document.createElement("a");
                            li.appendChild(a);
                            a.innerHTML = '<i class="fa fa-file" aria-hidden="true"></i> ' + link.Name;
                            a.title = link.Description;
                            a.setAttribute("SessionId", link.ID);
                            a.onclick = function () {
                                self.OpenSessionFromLocalDB(this.getAttribute("SessionId"));
                            };
                            self.ulRecentFiles.appendChild(li);
                        }
                    });
                }
                catch (err) {
                    //alert(err);
                }
            };
            ;
            //public GetState(): { tabProtocol: boolean, tabScenario: boolean, tabDeployment: boolean, tabMonitoring: boolean, tabData: boolean, anchorMenuBug: boolean, anchorMenuNewSessionFromXML: boolean, anchorMenuNewSessionFromWizard: boolean, anchorMenuNewSessionFromDelimitedTextFile: boolean, anchorMenuExportSessionAsXML: boolean, anchorMenuBrowseLocalDB: boolean, anchorMenuSaveSessionInLocalDB: boolean, anchorMenuSaveSessionAsUndeployedCopy: boolean, anchorMenuExit: boolean, anchorMenuShowSettings: boolean, anchorMenuHelp: boolean, anchorMenuLogout: boolean, anchorMenuToggleLock: boolean, anchorMenuUndo: boolean, anchorMenuRedo: boolean, anchorMenuAbout: boolean, anchorMenuWarning: boolean, anchorMenuCurrentSession: boolean, anchorMenuDatabase: boolean } {
            //    return {
            //        tabProtocol: this.tabProtocol.IsEnabled,
            //        tabScenario: this.tabScenario.IsEnabled,
            //        tabDeployment: this.tabDeployment.IsEnabled,
            //        tabMonitoring: this.tabMonitoring.IsEnabled,
            //        tabData: this.tabData.IsEnabled,
            //        anchorMenuBug: this.anchorMenuBug.IsEnabled,
            //        anchorMenuNewSessionFromXML: this.anchorMenuNewSessionFromXML.IsEnabled,
            //        anchorMenuNewSessionFromWizard: this.anchorMenuNewSessionFromWizard.IsEnabled,
            //        //anchorMenuNewSessionFromDelimitedTextFile: this.anchorMenuNewSessionFromDelimitedTextFile.IsEnabled,
            //        anchorMenuExportSessionAsXML: this.anchorMenuExportSessionAsXML.IsEnabled,
            //        anchorMenuBrowseLocalDB: this.anchorMenuBrowseLocalDB.IsEnabled,
            //        anchorMenuSaveSessionInLocalDB: this.anchorMenuSaveSessionInLocalDB.IsEnabled,
            //        anchorMenuSaveSessionAsUndeployedCopy: this.anchorMenuSaveSessionAsUndeployedCopy.IsEnabled,
            //        anchorMenuExit: this.anchorMenuExit.IsEnabled,
            //        anchorMenuShowSettings: this.anchorMenuShowSettings.IsEnabled,
            //        anchorMenuHelp: this.anchorMenuHelp.IsEnabled,
            //        anchorMenuLogout: this.anchorMenuLogout.IsEnabled,
            //        anchorMenuToggleLock: this.anchorMenuToggleLock.IsEnabled,
            //        anchorMenuUndo: this.anchorMenuUndo.IsEnabled,
            //        anchorMenuRedo: this.anchorMenuRedo.IsEnabled,
            //        anchorMenuAbout: this.anchorMenuAbout.IsEnabled,
            //        anchorMenuWarning: this.anchorMenuWarning.IsEnabled,
            //        anchorMenuCurrentSession: this.anchorMenuCurrentSession.IsEnabled,
            //        anchorMenuDatabase: this.anchorMenuDatabase.IsEnabled
            //    }
            //}
            MenuViewModel.prototype.OnConnectivityChanged = function (isOnline) {
                this.isOnline = isOnline;
            };
            return MenuViewModel;
        }());
        ViewModels.MenuViewModel = MenuViewModel;
        var ExperimentalDesignItemsViewModel = /** @class */ (function (_super) {
            __extends(ExperimentalDesignItemsViewModel, _super);
            function ExperimentalDesignItemsViewModel(designType, designs /*, additionalFields: PanelLeaderModels.DBField[]*/) {
                var _this = _super.call(this) || this;
                //private btnDatabaseFields: Framework.Form.Button;
                _this.tabs = [];
                _this.selectedDesign = undefined;
                var self = _this;
                _this.designType = designType;
                _this.designs = designs;
                //this.AdditionalFields = additionalFields;
                _this.divList = Framework.Form.TextElement.Register("divList");
                _this.divItemsTable = Framework.Form.TextElement.Register("divItemsTable");
                _this.divExperimentalDesignTable = Framework.Form.TextElement.Register("divExperimentalDesignTable");
                _this.btnShowSubjects = Framework.Form.Button.Register("btnShowSubjects", function () { return true; }, function () {
                    self.ShowViewSubjects();
                });
                _this.btnShowAttributes = Framework.Form.Button.Register("btnShowAttributes", function () { return true; }, function () {
                    self.ShowViewAttributes();
                });
                _this.btnShowProducts = Framework.Form.Button.Register("btnShowProducts", function () { return true; }, function () {
                    self.ShowViewProducts();
                });
                if (designType == "Attribute") {
                    self.btnShowAttributes.HtmlElement.classList.add("active");
                }
                if (designType == "Product") {
                    self.btnShowProducts.HtmlElement.classList.add("active");
                }
                _this.btnImportItems = Framework.Form.Button.Register("btnImportItems", function () {
                    return self.isLocked == false;
                }, function () {
                    var div = document.createElement("div");
                    var p = document.createElement("p");
                    p.innerHTML = Framework.LocalizationManager.Format("ImportItemsOrDesign", [Framework.LocalizationManager.Get(designType).toLowerCase()]);
                    div.appendChild(p);
                    var b1 = Framework.Form.Button.Create(function () { return true; }, function () {
                        modal.Close();
                        self.ShowModalImportItems(self.selectedDesign);
                    }, Framework.LocalizationManager.Format("ImportItems", [Framework.LocalizationManager.Get(designType).toLowerCase()]), ["btn", "btn-primary"]);
                    var b2 = Framework.Form.Button.Create(function () { return true; }, function () {
                        modal.Close();
                        self.ShowModalImportDesign();
                    }, Framework.LocalizationManager.Get("ImportDesign"), ["btn", "btn-primary"]);
                    var modal = Framework.Modal.Custom(div, Framework.LocalizationManager.Format("ImportItems", [Framework.LocalizationManager.Get(designType).toLowerCase()]), [b1, b2]);
                });
                //this.btnExportItems = Framework.Form.Button.Register("btnExportItems", () => {
                //    return true;
                //}, () => {
                //    self.TableItems.Export(Framework.LocalizationManager.Get(designType), [{
                //    //    name: "Memo", func: () => {
                //    //        self.export();
                //    //    }
                //    //},
                //    //{
                //    //    name: "DB", func: () => {
                //    //        self.ExportItemsToLocalDB(self.TableItems.SelectedData);
                //    //    }
                //    }]);
                //});
                _this.btnInsertItems = Framework.Form.Button.Register("btnInsertItems", function () {
                    return self.isLocked == false;
                }, function () {
                    var modal = Framework.Modal.Confirm(Framework.LocalizationManager.Format("AddNewItem", [Framework.LocalizationManager.Get(designType).toLowerCase()]), "");
                    var max = 100;
                    //if (self.selectedDesign.Order == "WilliamsLatinSquare") {
                    //    max = 18;
                    //}
                    modal.AddNumericUpDown(0, max, 1, 1, function (val) {
                        self.AddItemsToDesign(self.selectedDesign, val);
                    });
                });
                _this.btnDeleteItems = Framework.Form.Button.Register("btnDeleteItems", function () {
                    return self.isLocked == false && self.TableItems && self.TableItems.SelectedData.length > 0;
                }, function () {
                    var div = document.createElement("div");
                    var d = document.createElement("div");
                    d.innerHTML = Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveTheSelection");
                    div.appendChild(d);
                    var removeData = false;
                    if (self.ListDataContainsItemCode(self.TableItems.SelectedData.map(function (x) { return x.Code; }))) {
                        var cb = Framework.Form.CheckBox.Create(function () { return true; }, function () { }, Framework.LocalizationManager.Get("RemoveItemData"), "", false, []);
                        div.appendChild(cb.HtmlElement);
                    }
                    var mw = Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), div, function () {
                        self.RemoveItemsFromDesign(self.selectedDesign, self.TableItems.SelectedData, removeData);
                    });
                });
                _this.btnSetLabels = Framework.Form.Button.Register("btnSetLabels", function () {
                    return self.isLocked == false;
                }, function () {
                    Framework.Modal.Confirm(Framework.LocalizationManager.Get("ItemLabelParameters"), Framework.Random.Generator.GetFormContent(self.selectedDesign.RandomCodeGenerator, 3).HtmlElement, function () {
                        self.UpdateDesignLabels(self.selectedDesign);
                    }, undefined, undefined, undefined, undefined, "400px");
                });
                if (designType == "Attribute") {
                    _this.btnSetLabels.Hide();
                }
                _this.btnResetDesign = Framework.Form.Button.Register("btnResetDesign", function () {
                    return self.isLocked == false;
                }, function () {
                    self.ResetDesign(self.selectedDesign);
                });
                _this.btnEditDesign = Framework.Form.Button.Register("btnEditDesign", function () {
                    return self.isLocked == false && self.TableExperimentalDesign && self.TableExperimentalDesign.SelectedData.length > 0;
                }, function () {
                    self.ShowModalEditDesignRanks(self.selectedDesign, self.TableExperimentalDesign.SelectedData.map(function (x) { return x.SubjectCode; }));
                });
                _this.btnDeleteDesign = Framework.Form.Button.Register("btnDeleteDesign", function () {
                    return self.isLocked == false;
                }, function () {
                    var checkResult = self.CheckIfDesignIsUsedByControl(self.selectedDesign);
                    if (checkResult == "") {
                        var associatedData_1 = self.GetDesignData(self.selectedDesign);
                        if (associatedData_1.length > 0) {
                            var modal = Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveThisElement"));
                            modal.AddCheckbox(Framework.LocalizationManager.Get("RemoveItemData"), function () {
                                self.RemoveDesign(self.selectedDesign, associatedData_1);
                            });
                        }
                        else {
                            Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveThisElement"), function () {
                                self.RemoveDesign(self.selectedDesign, associatedData_1);
                            });
                        }
                    }
                    else {
                        var splitResult = checkResult.split(" ");
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("DesignCannotBeRemoved"), Framework.LocalizationManager.Format("DesignIsAttached", [Framework.LocalizationManager.Get(splitResult[0]), splitResult[1]]));
                    }
                });
                _this.btnUpdateDesign = Framework.Form.Button.Register("btnUpdateDesign", function () {
                    return self.isLocked == false;
                }, function () {
                    self.EditDesignSettings(self.selectedDesign);
                });
                //this.btnDatabaseFields = Framework.Form.Button.Register("btnDatabaseFields", () => { return true; }, () => {
                //    self.EditCustomFields(self.selectedDesign);
                //});
                _this.setSelectExperimentalDesigns();
                return _this;
                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return true; }, KeyCode: 113, Action: () => {
                //        self.anchorMenuBug.Click();
                //    }
                //});
            }
            ExperimentalDesignItemsViewModel.prototype.setSelectExperimentalDesigns = function () {
                var _this = this;
                var self = this;
                self.divList.HtmlElement.innerHTML = "";
                self.divExperimentalDesignTable.HtmlElement.innerHTML = "";
                self.divItemsTable.HtmlElement.innerHTML = "";
                this.tabs = [];
                self.designs.filter(function (x) { return x.Type == self.designType; }).forEach(function (x) {
                    var button = Framework.Form.Button.Create(function () { return true; }, function (b) {
                        self.setCurrentDesign(b.CustomAttributes.Get("Design"));
                        self.tabs.forEach(function (y) { y.HtmlElement.classList.remove("selected"); });
                        b.HtmlElement.classList.add("selected");
                    }, x.Name, ["expDesignButton"]);
                    button.CustomAttributes.Add("Design", x);
                    self.divList.Append(button);
                    _this.tabs.push(button);
                });
                if (this.tabs.length > 0) {
                    this.tabs[this.tabs.length - 1].Click();
                }
                var button = Framework.Form.Button.Create(function () { return self.isLocked == false; }, function () {
                    self.AddNewDesign(self.designType);
                }, '<span><i class="fas fa-plus"></i></span>&nbsp;' + Framework.LocalizationManager.Get("NewDesign"), ["expDesignButton"]);
                self.divList.Append(button);
            };
            ExperimentalDesignItemsViewModel.prototype.SetActiveLi = function (dtype) {
                this.btnShowProducts.HtmlElement.parentElement.classList.remove("active");
                this.btnShowAttributes.HtmlElement.parentElement.classList.remove("active");
                if (dtype == "Attribute") {
                    this.btnShowAttributes.HtmlElement.parentElement.classList.add("active");
                }
                if (dtype == "Product") {
                    this.btnShowProducts.HtmlElement.parentElement.classList.add("active");
                }
            };
            ExperimentalDesignItemsViewModel.prototype.Update = function (design, fields) {
                //if (fields) {
                //    this.AdditionalFields = fields;
                //}
                if (fields === void 0) { fields = undefined; }
                this.setSelectExperimentalDesigns();
                if (design) {
                    this.setCurrentDesign(design);
                    this.TableItems.Refresh();
                }
            };
            ExperimentalDesignItemsViewModel.prototype.export = function () {
                var wb = new Framework.ExportManager("", "", "");
                wb.AddWorksheet(Framework.LocalizationManager.Get(this.designType), this.TableItems.GetAsArray());
                var array = this.selectedDesign.GetAsArray();
                wb.AddWorksheet(Framework.LocalizationManager.Get("Codes"), array.CodeArray);
                wb.AddWorksheet(Framework.LocalizationManager.Get("Labels"), array.LabelArray);
                wb.Save(Framework.LocalizationManager.Get(this.selectedDesign.Name), "xlsx");
            };
            ExperimentalDesignItemsViewModel.prototype.setCurrentDesign = function (design) {
                // MAJ nom dans les onglets
                var tabs = this.tabs.filter(function (x) {
                    var d = x.CustomAttributes.Get("Design");
                    return d.Id == design.Id;
                });
                if (tabs.length > 0) {
                    tabs[0].SetInnerHTML(design.Name);
                }
                this.selectedDesign = design;
                this.setItemLabelTable();
                this.setExperimentalDesignTable();
            };
            ExperimentalDesignItemsViewModel.prototype.setItemLabelTable = function () {
                var self = this;
                var listItems = self.selectedDesign.ListItems;
                var codes = [];
                var reps = [];
                listItems.forEach(function (item) {
                    if (self.selectedDesign.Type == "Product") {
                        item.Labels.forEach(function (kvp) {
                            item["R" + kvp.Key] = kvp.Value;
                            reps.push(kvp.Key);
                        });
                    }
                    codes.push(item.Code);
                });
                reps = Framework.Array.Unique(reps);
                var columnsRep = [];
                this.TableItems = new Framework.Form.Table();
                this.TableItems.ListColumns = [];
                var col1 = new Framework.Form.TableColumn();
                col1.Name = "Code";
                if (self.selectedDesign.Type == "Product") {
                    col1.Title = Framework.LocalizationManager.Get("Product");
                }
                if (self.selectedDesign.Type == "Attribute") {
                    col1.Title = Framework.LocalizationManager.Get("Attribute");
                }
                var col1Validator = function (code) {
                    return Framework.Form.Validator.HasMinLength(code, 2) + Framework.Form.Validator.IsUnique(code, self.selectedDesign.ListItems.map(function (a) { return a.Code; }));
                };
                col1.Validator = Framework.Form.Validator.Custom(col1Validator);
                col1.RemoveSpecialCharacters = true;
                this.TableItems.ListColumns.push(col1);
                if (this.selectedDesign.Type == "Attribute") {
                    var col2 = new Framework.Form.TableColumn();
                    col2.Name = "LongName";
                    col2.Title = Framework.LocalizationManager.Get("DisplayedName");
                    this.TableItems.ListColumns.push(col2);
                }
                var col13 = new Framework.Form.TableColumn();
                col13.Name = "Description";
                col13.Title = Framework.LocalizationManager.Get("Description");
                this.TableItems.ListColumns.push(col13);
                if (this.selectedDesign.Type == "Product") {
                    reps.forEach(function (x) {
                        var col = new Framework.Form.TableColumn();
                        col.Name = "R" + x;
                        col.Title = "Code R" + x;
                        self.TableItems.ListColumns.push(col);
                        columnsRep.push("R" + x);
                    });
                }
                //let col3 = new Framework.Form.TableColumn();
                //col3.Name = "Color";
                //col3.Title = Framework.LocalizationManager.Get("ColorAnalysis");
                //col3.Type = "color";
                //col3.Filterable = false;
                //col3.Sortable = false;
                ////col3.Width = "150px";
                //col3.MinWidth = 150;
                //this.TableItems.ListColumns.push(col3);
                if (this.selectedDesign.Type == "Product") {
                    var col = new Framework.Form.TableColumn();
                    col.Name = "Image";
                    col.Title = Framework.LocalizationManager.Get("Image");
                    col.Type = "image";
                    col.Filterable = false;
                    col.Sortable = false;
                    //col.Width = "90px";
                    col.MinWidth = 90;
                    this.TableItems.ListColumns.push(col);
                }
                var col14 = new Framework.Form.TableColumn();
                col14.Name = "Notes";
                col14.Title = Framework.LocalizationManager.Get("Notes");
                this.TableItems.ListColumns.push(col14);
                //this.TableItems.Height = ($('#divExperimentalDesignActions').offset().top - $('#samplesTab').offset().top - 120) + "px";
                this.TableItems.Height = "25vh";
                this.TableItems.ListData = listItems;
                this.TableItems.OnSelectionChanged = function () {
                    self.btnEditDesign.CheckState();
                    self.btnDeleteItems.CheckState();
                };
                this.TableItems.OnDataUpdated = function (item, propertyName, oldValue, newValue) {
                    var oldCode = item["Code"];
                    if (propertyName == "Code") {
                        oldCode = oldValue;
                    }
                    self.UpdateItem(self.selectedDesign, oldCode, propertyName, oldValue, newValue);
                };
                this.TableItems.Render(this.divItemsTable.HtmlElement);
            };
            ExperimentalDesignItemsViewModel.prototype.setExperimentalDesignTable = function () {
                var self = this;
                this.TableExperimentalDesign = new Framework.Form.Table();
                this.TableExperimentalDesign.ListColumns = [];
                var nbRanks = Framework.Array.Unique(self.selectedDesign.ListExperimentalDesignRows.map(function (x) { return x.Rank; })).length;
                var col1 = new Framework.Form.TableColumn();
                col1.Name = "SubjectCode";
                col1.Title = Framework.LocalizationManager.Get("Subject");
                col1.Editable = false;
                //col1.Width = "120px";
                col1.MinWidth = 120;
                this.TableExperimentalDesign.ListColumns.push(col1);
                for (var i = 1; i <= nbRanks; i++) {
                    var col = new Framework.Form.TableColumn();
                    col.Name = "Rank" + i;
                    col.Title = Framework.LocalizationManager.Format("RankNumber", [i.toString()]);
                    col.Editable = false;
                    col.Filterable = false;
                    //col.Width = "90px";
                    col.MinWidth = 90;
                    col.RenderFunction = function (val) {
                        var d = JSON.parse(val);
                        var code = d.Code;
                        var label = d.Label;
                        if (self.selectedDesign.Type == "Product") {
                            code = d.Code + " " + d.Replicate;
                        }
                        return "<span style='font-size:10px' title='" + code + "'>" + code + "</span><br/><span style='font-size:10px' title='" + label + "'>" + label + "</span>";
                    };
                    this.TableExperimentalDesign.ListColumns.push(col);
                }
                //this.TableExperimentalDesign.Height = ($('#divExperimentalDesignActions').offset().top - $('#samplesTab').offset().top - 120) + "px";
                this.TableExperimentalDesign.Height = "25vh";
                this.TableExperimentalDesign.ListData = self.selectedDesign.GetExperimentalDesignTable();
                this.TableExperimentalDesign.OnSelectionChanged = function (sel) {
                    //if (sel.length > 0) {
                    //    self.btnEditDesign.Enable();
                    //} else {
                    //    self.btnEditDesign.Disable();
                    //}
                    self.btnEditDesign.CheckState();
                };
                //this.TableExperimentalDesign.OnDataUpdated = (item: Models.ExperimentalDesignItem, propertyName: string, oldValue: any, newValue: any) => {
                //    //let oldCode = item["Code"];
                //    //if (propertyName == "Code") {
                //    //    oldCode = oldValue;
                //    //}
                //    //self.UpdateItem(self.selectedDesign, oldCode, propertyName, oldValue, newValue);
                //};
                this.TableExperimentalDesign.Render(this.divExperimentalDesignTable.HtmlElement);
            };
            ExperimentalDesignItemsViewModel.prototype.OnLockChanged = function (isLocked) {
                this.isLocked = isLocked;
                this.btnImportItems.CheckState();
                //this.btnExportItems.CheckState();
                this.btnInsertItems.CheckState();
                this.btnSetLabels.CheckState();
                this.btnResetDesign.CheckState();
                this.btnEditDesign.CheckState();
                this.btnDeleteDesign.CheckState();
                this.btnUpdateDesign.CheckState();
                if (this.TableExperimentalDesign && this.TableItems) {
                    if (this.isLocked == true) {
                        this.TableExperimentalDesign.Disable();
                        this.TableItems.Disable();
                    }
                    else {
                        this.TableExperimentalDesign.Enable();
                        this.TableItems.Enable();
                    }
                }
            };
            return ExperimentalDesignItemsViewModel;
        }(PanelLeaderViewModel));
        ViewModels.ExperimentalDesignItemsViewModel = ExperimentalDesignItemsViewModel;
        var SubjectsViewModel = /** @class */ (function (_super) {
            __extends(SubjectsViewModel, _super);
            function SubjectsViewModel(subjects, subjectPasswordGenerator /*, additionalFields: PanelLeaderModels.DBField[]*/) {
                var _this = _super.call(this) || this;
                var self = _this;
                _this.subjects = subjects;
                _this.subjectPasswordGenerator = subjectPasswordGenerator;
                //this.AdditionalFields = additionalFields;
                _this.divPanelistsTable = Framework.Form.TextElement.Register("divPanelistsTable");
                _this.setTable();
                _this.btnShowProducts = Framework.Form.Button.Register("btnShowProducts", function () { return true; }, function () {
                    self.ShowViewProducts();
                });
                _this.btnShowAttributes = Framework.Form.Button.Register("btnShowAttributes", function () { return true; }, function () {
                    self.ShowViewAttributes();
                });
                //this.btnDatabaseFields = Framework.Form.Button.Register("btnDatabaseFields", () => { return true; }, () => {
                //    self.EditCustomFields();
                //});
                _this.btnDeleteSubjects = Framework.Form.Button.Register("btnDeleteSubjects", function () {
                    return self.isLocked == false && self.TableSubject.SelectedData.length > 0;
                }, function () {
                    var div = document.createElement("div");
                    var removeSubjectsData = false;
                    if (self.ListDataContainsSubjectCode(self.TableSubject.SelectedData.map(function (x) { return x.Code; }))) {
                        var cb_1 = Framework.Form.CheckBox.Create(function () { return true; }, function () {
                            removeSubjectsData = cb_1.IsChecked;
                        }, Framework.LocalizationManager.Get("RemoveSubjectData"), "", false, []);
                        div.appendChild(cb_1.HtmlElement);
                    }
                    var mw = Framework.Modal.Confirm(Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveTheSelection"), div, function () {
                        self.RemovePanelists(self.TableSubject.SelectedData, removeSubjectsData);
                    });
                });
                _this.btnInsertSubjects = Framework.Form.Button.Register("btnInsertSubjects", function () {
                    return self.isLocked == false;
                }, function () {
                    var modal = self.modalConfirmInsertSubjects = Framework.Modal.Confirm(Framework.LocalizationManager.Get("AddNewPanelist"), "");
                    modal.AddNumericUpDown(0, 100, 1, 1, function (val) {
                        self.AddNewPanelists(val);
                    });
                });
                _this.btnSetSubjectsPasswords = Framework.Form.Button.Register("btnSetSubjectsPasswords", function () {
                    return self.isLocked == false && self.TableSubject && self.TableSubject.SelectedData.length > 0;
                }, function () {
                    var div = document.createElement("div");
                    div.appendChild(Framework.Random.Generator.GetFormContent(subjectPasswordGenerator, 3).HtmlElement);
                    var resetPasswordsBtn = Framework.Form.Button.Create(function () { return true; }, function () {
                        self.ResetPanelistsPasswords(self.TableSubject.SelectedData);
                        mw.Close();
                    }, Framework.LocalizationManager.Get("ResetPasswords"), ["btnResetPasswords"]);
                    div.appendChild(resetPasswordsBtn.HtmlElement);
                    var mw = Framework.Modal.Confirm(Framework.LocalizationManager.Get("PasswordParameters"), div, function () {
                        self.SetPanelistsPasswords(self.TableSubject.SelectedData);
                    }, undefined, undefined, undefined, undefined, "400px");
                });
                _this.btnImportSubjects = Framework.Form.Button.Register("btnImportSubjects", function () {
                    return self.isLocked == false;
                }, function () {
                    self.ShowModalImportPanelists();
                });
                return _this;
                //this.btnExportSubjects = Framework.Form.Button.Register("btnExportSubjects", () => {
                //    return true;
                //}, () => {
                //    //self.TableSubject.Export(Framework.LocalizationManager.Get("Subjects"), [{
                //    //    name: "DB", func: () => {
                //    //        self.ExportPanelistToLocalDB(self.TableSubject.SelectedData);
                //    //    }
                //    //}]);
                //});
                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return true; }, KeyCode: 113, Action: () => {
                //        self.anchorMenuBug.Click();
                //    }
                //});
            }
            //public Update() {
            //    if (this.dataTableSubject) {
            //        this.setTable(this.dataTableSubject.SelectedData);
            //    }
            //    //TODO : appliquer Seletc partout (recocher cases sélectionnées)
            //}
            SubjectsViewModel.prototype.setTable = function () {
                var self = this;
                this.TableSubject = new Framework.Form.Table();
                this.TableSubject.ListColumns = [];
                var col1 = new Framework.Form.TableColumn();
                col1.Name = "Code";
                col1.Title = Framework.LocalizationManager.Get("Subject");
                var col1Validator = function (code) {
                    return Framework.Form.Validator.HasMinLength(code, 1) + Framework.Form.Validator.IsUnique(code, self.subjects.map(function (a) { return a.Code; }));
                };
                col1.Validator = Framework.Form.Validator.Custom(col1Validator);
                col1.RemoveSpecialCharacters = true;
                this.TableSubject.ListColumns.push(col1);
                //let col2 = new Framework.Form.TableColumn();
                //col2.Name = "FirstName";
                //col2.Title = Framework.LocalizationManager.Get("FirstName");
                //this.TableSubject.ListColumns.push(col2);
                //let col3 = new Framework.Form.TableColumn();
                //col3.Name = "LastName";
                //col3.Title = Framework.LocalizationManager.Get("LastName");
                //this.TableSubject.ListColumns.push(col3);
                var col4 = new Framework.Form.TableColumn();
                col4.Name = "Mail";
                col4.Title = Framework.LocalizationManager.Get("Email");
                col4.Validator = Framework.Form.Validator.Mail();
                this.TableSubject.ListColumns.push(col4);
                var col5 = new Framework.Form.TableColumn();
                col5.Name = "Password";
                col5.Title = Framework.LocalizationManager.Get("Password");
                //col5.Width = "160px";
                col5.MinWidth = 160;
                this.TableSubject.ListColumns.push(col5);
                var col6 = new Framework.Form.TableColumn();
                col6.Name = "Notes";
                col6.Title = Framework.LocalizationManager.Get("Notes");
                //col5.Width = "160px";
                col6.MinWidth = 160;
                this.TableSubject.ListColumns.push(col6);
                //let col6 = new Framework.Form.TableColumn();
                //col6.Name = "Gender";
                //col6.Title = Framework.LocalizationManager.Get("Gender");
                //col6.Type = "enum";
                ////col6.Width = "100px";
                //col6.MinWidth = 100;
                //col6.EnumValues = Models.GetListGenders();
                //this.TableSubject.ListColumns.push(col6);
                //{ data: "Country", title: Framework.LocalizationManager.Get("Country") }, //OK
                //{ data: "Phone", title: Framework.LocalizationManager.Get("Phone") },//OK
                //{ data: "City", title: Framework.LocalizationManager.Get("City") }, //OK
                //{ data: "Address", title: Framework.LocalizationManager.Get("Address") }, //OK
                ////TODO{ data: "BirthDate", title: Localization.Get("BirthDate") },                
                //{ data: "Notes", title: Framework.LocalizationManager.Get("Notes") } //OK
                this.TableSubject.Height = ($('#subjectsActionsDiv').offset().top - $('#divPanelistsTable').offset().top - 120) + "px";
                this.TableSubject.ListData = this.subjects;
                this.TableSubject.OnSelectionChanged = function () {
                    self.btnDeleteSubjects.CheckState();
                    self.btnSetSubjectsPasswords.CheckState();
                };
                this.TableSubject.OnDataUpdated = function (subject, propertyName, oldValue, newValue) {
                    self.OnSubjectUpdate(subject, propertyName, oldValue, newValue);
                };
                this.TableSubject.Render(this.divPanelistsTable.HtmlElement);
                //let height = $('#subjectsActionsDiv').offset().top - $('#divPanelistsTable').offset().top - 120;
                //Framework.Form.DataTable.AppendToDiv(Framework.LocalizationManager.Get("Subjects"), height + "px", this.divPanelistsTable.HtmlElement, Models.Subject.GetDataTableParameters(this.subjects, this.AdditionalFields, (subject: Models.Subject, propertyName: string, oldValue: string, newValue: string) => {
                //    self.OnSubjectChanged(subject, propertyName, oldValue, newValue);
                //}),
                //    (table) => {
                //        self.dataTableSubject = table;
                //        self.dataTableSubject.Select(selectedSubjects);
                //    },
                //    (sel: Models.Subject[]) => {
                //        self.selection = sel;
                //        self.btnSetSubjectsPasswords.CheckState();
                //    },
                //    () => {
                //        self.AddNewPanelists(1);
                //    },
                //    () => {
                //        let div = document.createElement("div");
                //        let removeSubjectsData: boolean = false;
                //        if (self.ListDataContainsSubjectCode(self.dataTableSubject.SelectedData.map((x) => { return x.Code; }))) {
                //            let cb = Framework.Form.CheckBox.Create(() => { return true; }, () => {
                //                removeSubjectsData = cb.IsChecked;
                //            }, Framework.LocalizationManager.Get("RemoveSubjectData"), "", false, []);
                //            div.appendChild(cb.HtmlElement);
                //        }
                //        let mw = Framework.Modal.Confirm(Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveTheSelection"), div, () => {
                //            self.RemovePanelists(self.dataTableSubject.SelectedData, removeSubjectsData);
                //        });
                //    }
                //);
            };
            SubjectsViewModel.prototype.Update = function () {
                this.TableSubject.Render(this.divPanelistsTable.HtmlElement);
            };
            SubjectsViewModel.prototype.GetState = function () {
                return {
                    btnSetSubjectsPasswords: this.btnSetSubjectsPasswords.IsEnabled,
                    btnImportSubjects: this.btnImportSubjects.IsEnabled,
                    //btnExportSubjects: this.btnExportSubjects.IsEnabled,
                    btnInsertSubjects: this.btnInsertSubjects.IsEnabled,
                    btnShowProducts: this.btnShowProducts.IsEnabled,
                    btnShowAttributes: this.btnShowAttributes.IsEnabled
                };
            };
            SubjectsViewModel.prototype.OnLockChanged = function (isLocked) {
                this.isLocked = isLocked;
                this.btnSetSubjectsPasswords.CheckState();
                this.btnImportSubjects.CheckState();
                //this.btnExportSubjects.CheckState();
                this.btnInsertSubjects.CheckState();
                if (this.isLocked == true) {
                    this.TableSubject.Disable();
                }
                else {
                    this.TableSubject.Enable();
                }
            };
            return SubjectsViewModel;
        }(PanelLeaderViewModel));
        ViewModels.SubjectsViewModel = SubjectsViewModel;
        var ModalImportViewModel = /** @class */ (function (_super) {
            __extends(ModalImportViewModel, _super);
            function ModalImportViewModel(mw, format, importTemplate, onImport, importFromXMLFunction, importFromDBFunction) {
                if (importFromXMLFunction === void 0) { importFromXMLFunction = undefined; }
                var _this = _super.call(this, mw) || this;
                _this.format = "";
                var self = _this;
                _this.format = format;
                _this.importFromDBFunction = importFromDBFunction;
                _this.onImport = onImport;
                _this.divColumnsSelection = Framework.Form.TextElement.Register("divColumnsSelection");
                _this.divOverview = Framework.Form.TextElement.Register("divOverview");
                _this.btnShowDivOverview = Framework.Form.Button.Create(function () {
                    return false;
                }, function () {
                    self.showDivOverview();
                }, '<i class="fas fa-arrow-right"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Overview"));
                _this.mw.AddButton(_this.btnShowDivOverview);
                _this.btnImport = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    onImport(self.form.tabOfObject);
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Import"));
                _this.mw.AddButton(_this.btnImport);
                if (self.format == "XLS" || self.format == "XLSX" || self.format == "CSV" || self.format == "TXT") {
                    self.showDivColumnsSelection(importTemplate);
                }
                if (self.format == "XML") {
                    self.importFromXml(importTemplate, importFromXMLFunction);
                }
                if (self.format == "DB") {
                    self.mw.Close();
                    self.importFromDBFunction();
                }
                //TODO
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 13, function () { self.btnImport.Click(); });
                return _this;
            }
            ModalImportViewModel.prototype.hideAll = function () {
                this.divColumnsSelection.Hide();
                this.divOverview.Hide();
                this.btnShowDivOverview.Hide();
                this.btnImport.Hide();
            };
            ModalImportViewModel.prototype.showDivColumnsSelection = function (importTemplate) {
                var self = this;
                this.hideAll();
                this.divColumnsSelection.Show();
                this.btnShowDivOverview.Show();
                this.importFromCsvOrXls(importTemplate);
            };
            ModalImportViewModel.prototype.importFromCsvOrXls = function (importTemplate) {
                var self = this;
                Framework.ImportManager.Form.Import("." + this.format, importTemplate, function (res) {
                    self.form = res;
                    var kvp = [];
                    kvp.push({ Value: "[Select]", Key: Framework.LocalizationManager.Get("Select") });
                    for (var propertyName in res.ImportedObject[0]) {
                        var p = propertyName;
                        kvp.push({ Key: p, Value: p });
                    }
                    //TODO :champ vide
                    //dtParameters.OnEditCell = (propertyName, data) => {
                    //    if (propertyName == "ColumnName") {
                    //        //TODO : validation que si data["IsImperative"]==true
                    //        return Framework.Form.Select.Render(data["ColumnName"], kvp, Framework.Form.Validator.NotEmpty(), (x, y) => {
                    //            if (y.IsValid == true) {
                    //                data["ColumnName"] = x;
                    //            }
                    //            self.checkValidity();
                    //            onValidityChanged(self.isValid);
                    //        }, true, ["tableInput"]).HtmlElement;
                    //    }
                    //}
                    var table = new Framework.Form.Table();
                    table.CanSelect = false;
                    table.ListColumns = [];
                    table.ShowFooter = false;
                    //let col1 = new Framework.Form.TableColumn();
                    //col1.Name = "AttributeName";
                    //col1.Title = Framework.LocalizationManager.Get("AttributeName");           
                    //col1.Editable = false;      
                    //col1.Filterable = false;
                    //col1.Sortable = false;   
                    //table.ListColumns.push(col1);
                    var col4 = new Framework.Form.TableColumn();
                    col4.Name = "Description";
                    col4.Editable = false;
                    col4.Title = Framework.LocalizationManager.Get("AttributeName");
                    col4.Filterable = false;
                    col4.Sortable = false;
                    table.ListColumns.push(col4);
                    var col2 = new Framework.Form.TableColumn();
                    col2.Name = "ColumnName";
                    col2.Title = Framework.LocalizationManager.Get("ColumnName");
                    col2.Type = "enum";
                    col2.EnumValues = kvp;
                    col2.Filterable = false;
                    col2.Sortable = false;
                    table.ListColumns.push(col2);
                    var col3 = new Framework.Form.TableColumn();
                    col3.Name = "IsImperative";
                    col3.Editable = false;
                    col3.Title = Framework.LocalizationManager.Get("IsImperative");
                    col3.Filterable = false;
                    col3.Sortable = false;
                    col3.RenderFunction = function (x) {
                        var res = "False";
                        if (x == true) {
                            res = "True";
                        }
                        return Framework.LocalizationManager.Get(res);
                    };
                    col3.MinWidth = 100;
                    table.ListColumns.push(col3);
                    table.Height = "800px";
                    table.ListData = importTemplate.ColumnTemplates;
                    table.OnDataUpdated = function (item, propertyName, oldValue, newValue) {
                        res.CheckValidity();
                        self.btnShowDivOverview.Disable();
                        if (res.IsValid == true) {
                            self.btnShowDivOverview.Enable();
                        }
                    };
                    table.Render(self.divColumnsSelection.HtmlElement);
                    //Framework.Form.DataTable.AppendToDiv("", "78vh", self.divColumnsSelection.HtmlElement, res.DataTableParameters,
                    //    (table) => {
                    //    }
                    //);
                    //}, (validity: boolean) => {
                    //    self.btnShowDivOverview.Disable();
                    //    if (validity == true) {
                    //        self.btnShowDivOverview.Enable();
                    //    }
                });
            };
            ModalImportViewModel.prototype.importFromXml = function (importTemplate, importFromXMLFunction) {
                var self = this;
                Framework.ImportManager.Form.ImportFromXML(importTemplate, importFromXMLFunction, function (res) {
                    self.form = res;
                    self.showDivOverview();
                });
            };
            ModalImportViewModel.prototype.showDivOverview = function () {
                this.hideAll();
                this.divOverview.Show();
                this.btnImport.Show();
                var dt = this.form.getPreviewDataTableParameters();
                Framework.Form.DataTable.AppendToDiv("", "78vh", this.divOverview.HtmlElement, dt, function (table) {
                });
            };
            return ModalImportViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalImportViewModel = ModalImportViewModel;
        var ModalProtocolDBFieldsViewModel = /** @class */ (function (_super) {
            __extends(ModalProtocolDBFieldsViewModel, _super);
            function ModalProtocolDBFieldsViewModel(mw, subjectDBFields, onFieldChange) {
                var _this = _super.call(this, mw) || this;
                var self = _this;
                _this.onFieldChange = onFieldChange;
                _this.SetDataTableFields(subjectDBFields);
                var btnOK = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    //TODO : addselection to session
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("AddSubjectsToiSessionThenClose"));
                _this.mw.AddButton(btnOK);
                //TODO
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 13, function () { btnOK.Click(); });
                return _this;
            }
            ModalProtocolDBFieldsViewModel.prototype.SetDataTableFields = function (fields) {
                var self = this;
                Framework.Form.DataTable.AppendToDiv(Framework.LocalizationManager.Get("Fields"), "50vh", this.mw.Body, PanelLeaderModels.DBField.GetDataTableParameters(fields, self.onFieldChange), function (dt) {
                    self.dataTableFieldsDB = dt;
                }, function (sel) {
                }, function () {
                    self.AddDBField();
                }, function () {
                    self.RemoveDBFields(self.dataTableFieldsDB.SelectedData);
                });
            };
            return ModalProtocolDBFieldsViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalProtocolDBFieldsViewModel = ModalProtocolDBFieldsViewModel;
        var ModalSubjectsDBViewModel = /** @class */ (function (_super) {
            __extends(ModalSubjectsDBViewModel, _super);
            function ModalSubjectsDBViewModel(mw, fields, subjects, onSubjectChange) {
                var _this = _super.call(this, mw) || this;
                var self = _this;
                _this.onSubjectChange = onSubjectChange;
                var btnCancel = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    self.mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                _this.mw.AddButton(btnCancel);
                var btnOK = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    self.ImportSubjects(self.dataTableSubjectDB.SelectedData);
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Import"));
                _this.mw.AddButton(btnOK);
                _this.SetDataTable(subjects, fields);
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 13, function () { btnOK.Click(); });
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 27, function () { btnCancel.Click(); });
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible && self.dataTableSubjectDB.SelectedData.length > 0; }, 46, function () { self.DeleteSubjects(self.dataTableSubjectDB.SelectedData); });
                return _this;
            }
            ModalSubjectsDBViewModel.prototype.SetDataTable = function (subjects, fields) {
                var self = this;
                Framework.Form.DataTable.AppendToDiv(Framework.LocalizationManager.Get("Subjects"), "50vh", this.mw.Body, Models.Subject.GetDataTableParameters(subjects, fields, self.onSubjectChange), function (dt) {
                    self.dataTableSubjectDB = dt;
                }, function (sel) {
                }, undefined, function () {
                    self.DeleteSubjects(self.dataTableSubjectDB.SelectedData);
                });
            };
            return ModalSubjectsDBViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalSubjectsDBViewModel = ModalSubjectsDBViewModel;
        var ModalExperimentalDesignItemDBViewModel = /** @class */ (function (_super) {
            __extends(ModalExperimentalDesignItemDBViewModel, _super);
            function ModalExperimentalDesignItemDBViewModel(mw, fields, items, onItemChange) {
                var _this = _super.call(this, mw) || this;
                var self = _this;
                _this.onItemChange = onItemChange;
                var btnCancel = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    self.mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                _this.mw.AddButton(btnCancel);
                var btnOK = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    self.ImportItems(self.dataTableDB.SelectedData);
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Import"));
                _this.mw.AddButton(btnOK);
                _this.SetDataTable(items, fields);
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 13, function () { btnOK.Click(); });
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 27, function () { btnCancel.Click(); });
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible && self.dataTableDB.SelectedData.length > 0; }, 46, function () { self.DeleteItems(self.dataTableDB.SelectedData); });
                return _this;
            }
            //TODO : remplacer
            ModalExperimentalDesignItemDBViewModel.prototype.SetDataTable = function (items, fields) {
                var self = this;
                Framework.Form.DataTable.AppendToDiv(Framework.LocalizationManager.Get("Items"), "50vh", this.mw.Body, Models.ExperimentalDesignItem.GetDataTableParameters(items, fields, self.onItemChange), function (dt) {
                    self.dataTableDB = dt;
                }, function (sel) {
                }, undefined, function () {
                    self.DeleteItems(self.dataTableDB.SelectedData);
                });
            };
            return ModalExperimentalDesignItemDBViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalExperimentalDesignItemDBViewModel = ModalExperimentalDesignItemDBViewModel;
        var ModalSettingsViewModel = /** @class */ (function (_super) {
            __extends(ModalSettingsViewModel, _super);
            function ModalSettingsViewModel(mw, applicationSettings, version) {
                var _this = _super.call(this, mw) || this;
                _this.isOnline = true;
                var self = _this;
                _this.applicationSettings = applicationSettings;
                _this.version = version;
                _this.applicationSettingsCopy = Framework.Factory.Clone(applicationSettings);
                _this.selectLanguage = Framework.Form.Select.Register("selectLanguage", applicationSettings.Language, Framework.LocalizationManager.AcceptedLanguages, Framework.Form.Validator.NotEmpty(), function () {
                    self.applicationSettingsCopy.Language = self.selectLanguage.Value;
                    self.btnSave.CheckState();
                });
                //this.selectDatabaseSynchronization = Framework.Form.Select.Register("selectDatabaseSynchronization", applicationSettings.DatabaseSynchronization.toString(), Framework.KeyValuePair.FromArray(["true", "false"]), Framework.Form.Validator.NotEmpty(), () => {
                //    self.applicationSettingsCopy.DatabaseSynchronization = self.selectDatabaseSynchronization.Value == "true";
                //    self.btnSave.CheckState();
                //});
                _this.selectAutosave = Framework.Form.Select.Register("selectAutosave", applicationSettings.Autosave.toString(), Framework.KeyValuePair.FromArray(["true", "false"]), Framework.Form.Validator.NotEmpty(), function () {
                    self.applicationSettingsCopy.Autosave = self.selectAutosave.Value == "true";
                    self.btnSave.CheckState();
                });
                _this.inputDisplayName = Framework.Form.InputText.Register("inputDisplayName", applicationSettings.DisplayName, Framework.Form.Validator.MinLength(3), function () {
                    self.applicationSettingsCopy.DisplayName = self.inputDisplayName.Value;
                    self.btnSave.CheckState();
                });
                _this.inputMailAddress = Framework.Form.InputText.Register("inputMailAddress", applicationSettings.ReturnMailAddress, Framework.Form.Validator.Mail(), function () {
                    self.applicationSettingsCopy.ReturnMailAddress = self.inputMailAddress.Value;
                    self.btnSave.CheckState();
                });
                _this.spanVersion = Framework.Form.TextElement.Register("spanVersion", version);
                var btnCancel = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    self.mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                _this.mw.AddButton(btnCancel);
                _this.btnSave = Framework.Form.Button.Create(function () {
                    return self.isOnline == true && self.selectLanguage.IsValid && /*self.selectDatabaseSynchronization.IsValid &&*/ self.selectAutosave.IsValid && self.inputDisplayName.IsValid && self.inputMailAddress.IsValid;
                }, function () {
                    self.SaveLicense(self.applicationSettingsCopy);
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Save"));
                _this.mw.AddButton(_this.btnSave);
                // Raccourcis clavier
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 13, function () { self.btnSave.Click(); });
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 27, function () { btnCancel.Click(); });
                return _this;
            }
            Object.defineProperty(ModalSettingsViewModel.prototype, "ApplicationSettings", {
                get: function () { return this.applicationSettings; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSettingsViewModel.prototype, "ApplicationSettingsCopy", {
                get: function () { return this.applicationSettingsCopy; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSettingsViewModel.prototype, "BtnSave", {
                get: function () { return this.btnSave; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSettingsViewModel.prototype, "SelectLanguage", {
                get: function () { return this.selectLanguage; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSettingsViewModel.prototype, "InputMailAddress", {
                get: function () { return this.inputMailAddress; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSettingsViewModel.prototype, "InputDisplayName", {
                get: function () { return this.inputDisplayName; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSettingsViewModel.prototype, "SelectAutosave", {
                //public get SelectDatabaseSynchronization() { return this.selectDatabaseSynchronization }
                get: function () { return this.selectAutosave; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSettingsViewModel.prototype, "SpanVersion", {
                get: function () { return this.spanVersion; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSettingsViewModel.prototype, "Version", {
                get: function () {
                    return this.version;
                },
                enumerable: false,
                configurable: true
            });
            ModalSettingsViewModel.prototype.OnConnectivityChanged = function (isOnline) {
                this.isOnline = isOnline;
                this.btnSave.CheckState();
            };
            return ModalSettingsViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalSettingsViewModel = ModalSettingsViewModel;
        var ModalMailViewModel = /** @class */ (function (_super) {
            __extends(ModalMailViewModel, _super);
            function ModalMailViewModel(mw, templates, mail, recipients, onClose) {
                var _this = _super.call(this, mw) || this;
                _this.templates = [];
                _this.isOnline = true;
                _this.mail = mail;
                _this.recipients = recipients;
                _this.onClose = onClose;
                _this.templates = templates;
                var self = _this;
                //TODO : default template
                _this.selectMailTemplate = Framework.Form.Select.Register("selectMailTemplate", "", Framework.KeyValuePair.FromArray(self.templates.map(function (x) { return x.Description; })), Framework.Form.Validator.NoValidation(), function (x) {
                    if (x && x.length > 0) {
                        var template = self.templates.filter(function (t) { return t.Description == x; })[0];
                        self.loadTemplate(template);
                    }
                }, false);
                //this.divLoadMailTemplate = Framework.Form.TextElement.Register("divLoadMailTemplate");
                //let templatesDiv = document.createElement("div");
                //self.templates.forEach((template: PanelLeaderModels.MailTemplate) => {
                //    let d = Framework.Form.TextElement.Create("", []);
                //    let btn = Framework.Form.Button.Create(() => { return true; }, () => {
                //        self.loadTemplate(template);
                //        btnLoadMailTemplate.HideContent();
                //    }, template.Label, ["mailOption"], template.Description);
                //    d.Append(btn);
                //    //TODO
                //    //let btnDelete = Framework.Form.Button.Create(() => { return true; }, () => {
                //    //    self.deleteTemplate(template);                        
                //    //}, '<i class="fas fa-trash"></i>', ["mailOption"], Framework.LocalizationManager.Get("Delete"));
                //    //d.Append(btnDelete);
                //    templatesDiv.appendChild(d.HtmlElement);
                //});
                //let btnLoadMailTemplate = Framework.Form.PopupButtonPanel.Render(() => {
                //    return self.templates.length > 0;
                //}, ["buttonWithIcon", "buttonHeart"], Framework.LocalizationManager.Get("MailTemplates"), templatesDiv, "bottom", undefined);
                //self.divLoadMailTemplate.HtmlElement.innerHTML = "";
                //self.divLoadMailTemplate.Append(btnLoadMailTemplate);
                _this.inputMailReturnAddress = Framework.Form.InputText.Register("inputMailReturnAddress", self.mail.ReturnMailAddress, Framework.Form.Validator.Mail(), function () {
                    self.setButtonStates();
                    self.btnSendMail.CheckState();
                }, false);
                _this.inputMailDisplayName = Framework.Form.InputText.Register("inputMailDisplayName", self.mail.DisplayedName, Framework.Form.Validator.MinLength(5), function () {
                    self.setButtonStates();
                    self.btnSendMail.CheckState();
                }, false);
                _this.inputMailSubject = Framework.Form.InputText.Register("inputMailSubject", self.mail.Subject, Framework.Form.Validator.MinLength(5), function () {
                    self.setButtonStates();
                    self.btnSendMail.CheckState();
                }, false);
                _this.inputSaveAsMailTemplate = Framework.Form.CheckBox.Register("inputSaveAsMailTemplate", function () { return true; }, function () { }, "");
                //TOFIX : unchecked par défaut
                _this.inputMailContent = Framework.Form.TextElement.Register("inputMailContent");
                _this.inputMailContent.SetHtml(self.mail.Body);
                _this.inputMailContent.HtmlElement.onclick = function () {
                    self.setButtonStates();
                };
                _this.spanMailButtons = Framework.Form.TextElement.Register("spanMailButtons");
                //let div = document.createElement("div");
                var insertTextButtons = [];
                _this.btnInsertMailServerCode = Framework.Form.Button.Create(function () { return true; }, function () {
                    Framework.Selection.Replace("[SERVER_CODE]");
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("ServerCode"), ["mailOption"], "");
                insertTextButtons.push(_this.btnInsertMailServerCode);
                _this.btnInsertMailFirstName = Framework.Form.Button.Create(function () { return true; }, function () {
                    Framework.Selection.Replace("[SUBJECT_FIRST_NAME]");
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("SubjectFirstName"), ["mailOption"], "");
                insertTextButtons.push(_this.btnInsertMailFirstName);
                _this.btnInsertMailLastName = Framework.Form.Button.Create(function () { return true; }, function () {
                    Framework.Selection.Replace("[SUBJECT_LAST_NAME]");
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("SubjectLastName"), ["mailOption"], "");
                insertTextButtons.push(_this.btnInsertMailLastName);
                _this.btnInsertMailSubjectCode = Framework.Form.Button.Create(function () { return true; }, function () {
                    Framework.Selection.Replace("[SUBJECT_CODE]");
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("SubjectCode"), ["mailOption"], "");
                insertTextButtons.push(_this.btnInsertMailSubjectCode);
                _this.btnInsertMailSubjectPassword = Framework.Form.Button.Create(function () { return true; }, function () {
                    Framework.Selection.Replace("[SUBJECT_PASSWORD]");
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("SubjectPassword"), ["mailOption"], "");
                insertTextButtons.push(_this.btnInsertMailSubjectPassword);
                //this.btnInsertMailURLAsText = Framework.Form.Button.Create(() => { return true; }, () => {
                //    Framework.Selection.Replace("[SESSION_URL]")
                //    self.btnSendMail.CheckState();
                //}, Framework.LocalizationManager.Get("URLAsText"), ["mailOption"], "");
                //div.appendChild(this.btnInsertMailURLAsText.HtmlElement);
                _this.btnInsertMailEncryptedURL = Framework.Form.Button.Create(function () { return true; }, function () {
                    Framework.Selection.Replace("[SESSION_HYPERLINK]");
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("EncryptedURL"), ["mailOption"], "");
                insertTextButtons.push(_this.btnInsertMailEncryptedURL);
                _this.btnInsertMailTSHomePage = Framework.Form.Button.Create(function () { return true; }, function () {
                    Framework.Selection.Replace("[TIMESENS_HOMEPAGE_HYPERLINK]");
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("URLTSHomePage"), ["mailOption"], "");
                insertTextButtons.push(_this.btnInsertMailTSHomePage);
                _this.htmlEditorButtons = Framework.InlineHTMLEditor.GetButtons(undefined, insertTextButtons);
                self.spanMailButtons.HtmlElement.innerHTML = "";
                _this.htmlEditorButtons.forEach(function (x) {
                    self.spanMailButtons.HtmlElement.appendChild(x.HtmlElement);
                });
                _this.btnSendMail = Framework.Form.Button.Create(function () {
                    return self.isOnline == true && self.inputMailDisplayName.IsValid && self.inputMailReturnAddress.IsValid && self.inputMailSubject.IsValid;
                }, function () {
                    //TODO : tester contenu du message
                    self.SendMail(self.recipients, self.inputMailSubject.Value, self.inputMailContent.HtmlElement.innerHTML, self.inputMailDisplayName.Value, self.inputMailReturnAddress.Value, self.inputSaveAsMailTemplate.IsChecked, function (monitoringProgresses) {
                        self.onClose(monitoringProgresses);
                        self.mw.Close();
                    }, self.templates);
                }, '<i class="far fa-envelope"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Send"));
                _this.mw.AddButton(_this.btnSendMail);
                _this.setButtonStates();
                return _this;
                //TODO
                //Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { self.btnSendMail.Click(); });
            }
            ModalMailViewModel.prototype.OnConnectivityChanged = function (isOnline) {
                this.isOnline = isOnline;
            };
            ModalMailViewModel.prototype.deleteTemplate = function (template) {
                var self = this;
                this.RemoveMailTemplate(template, function () {
                    self.templates.splice(self.templates.indexOf(template), 1);
                });
                //this.controller.LocalDB.RemoveMailTemplate(template).then(() => { self.templates.splice(self.templates.indexOf(template), 1); });
                //TODO : recréer liste de modèles
            };
            ModalMailViewModel.prototype.loadTemplate = function (template) {
                this.inputMailReturnAddress.Set(template.ReturnMailAddress);
                this.inputMailDisplayName.Set(template.DisplayedName);
                this.inputMailSubject.Set(template.Subject);
                this.inputMailContent.SetHtml(template.Body);
            };
            //private showSaveAsTemplate(callback: () => void) {
            //    let self = this;
            //    //TODO : mettre ça dans HTML ? 
            //    let div = document.createElement("div");
            //    let p = document.createElement("p");
            //    p.innerText = Framework.LocalizationManager.Get("TemplateName");
            //    div.appendChild(p);
            //    let inputText = Framework.Form.InputText.Create("", () => {
            //        btnSave.CheckState();
            //    }, Framework.Form.Validator.Unique(self.templates.map((x) => { return x.Label; })), false, ["blockForm"]);
            //    div.appendChild(inputText.HtmlElement);
            //    let p1 = document.createElement("p");
            //    p1.innerText = Framework.LocalizationManager.Get("Description");
            //    div.appendChild(p1);
            //    let inputDescription = Framework.Form.InputText.Create("", () => {
            //    }, Framework.Form.Validator.NoValidation(), false, ["blockForm"]);
            //    div.appendChild(inputDescription.HtmlElement);
            //    let cb = Framework.Form.CheckBox.Create(() => { return true; }, () => { }, Framework.LocalizationManager.Get("DefaultTemplate"), "", false, ["blockForm"]);
            //    div.appendChild(cb.HtmlElement);
            //    let btnSave = Framework.Form.Button.Create(() => {
            //        return inputText.IsValid == true;
            //    }, () => {
            //        self.saveAsTemplate(inputText.Value, inputDescription.Value, cb.IsChecked, () => { mw.Close(); callback(); });
            //    }, Framework.LocalizationManager.Get("Save"), ["btn", "btn-primary"]);
            //    let btnCancel = Framework.Form.Button.Create(() => { return true; }, () => {
            //        mw.Close();
            //    }, Framework.LocalizationManager.Get("Cancel"), ["btn", "btn-primary"]);
            //    //let mw: Framework.ModalWindow = Framework.ModalWindow.ShowCustomFooter(Framework.LocalizationManager.Get("SaveAsTemplate"), div, false, [btnCancel, btnSave], true);
            //    let mw: Framework.Modal = Framework.Modal.Show(div, Framework.LocalizationManager.Get("SaveAsTemplate"), [btnCancel, btnSave], undefined, undefined, true, true, false);
            //}
            ModalMailViewModel.prototype.saveAsTemplate = function (templateName, description, isDefault, callback) {
                var template = new PanelLeaderModels.MailTemplate();
                template.Description = description;
                template.Label = templateName;
                template.DisplayedName = this.inputMailDisplayName.Value;
                template.Body = this.inputMailContent.HtmlElement.innerHTML;
                template.Subject = this.inputMailSubject.Value;
                template.ReturnMailAddress = this.inputMailReturnAddress.Value;
                template.IsDefault = isDefault;
                this.SaveMailTemplate(template, callback);
                //this.controller.LocalDB.SaveMailTemplate(template).then(() => { callback(); });
            };
            ModalMailViewModel.prototype.setButtonStates = function () {
                var active = false;
                if (document.activeElement === this.inputMailContent.HtmlElement) {
                    active = true;
                }
                this.htmlEditorButtons.forEach(function (x) {
                    if (active == true) {
                        x.Enable();
                    }
                    else {
                        x.Disable();
                    }
                });
            };
            return ModalMailViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalMailViewModel = ModalMailViewModel;
        var ModalSaveSessionAsUndeployedCopyViewModel = /** @class */ (function (_super) {
            __extends(ModalSaveSessionAsUndeployedCopyViewModel, _super);
            function ModalSaveSessionAsUndeployedCopyViewModel(mw) {
                var _this = _super.call(this, mw) || this;
                var self = _this;
                _this.cbDeleteData = Framework.Form.CheckBox.Register("cbDeleteData", function () { return true; }, function () { }, "");
                _this.cbDeleteData.Check();
                _this.cbDeleteUpload = Framework.Form.CheckBox.Register("cbDeleteUpload", function () { return true; }, function () { }, "");
                _this.cbDeleteUpload.Check();
                _this.cbDeleteSubjects = Framework.Form.CheckBox.Register("cbDeleteSubjects", function () { return true; }, function () { }, "");
                _this.cbDeleteProducts = Framework.Form.CheckBox.Register("cbDeleteProducts", function () { return true; }, function () { }, "");
                _this.cbDeleteAttributes = Framework.Form.CheckBox.Register("cbDeleteAttributes", function () { return true; }, function () { }, "");
                _this.cbDeleteMail = Framework.Form.CheckBox.Register("cbDeleteMail", function () { return true; }, function () { }, "");
                var btnCancel = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    self.mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                _this.mw.AddButton(btnCancel);
                _this.btnSaveAsUndeployedCopy = Framework.Form.Button.Create(function () { return true; }, function () {
                    self.SaveSessionAsUndeployedCopy(self.cbDeleteUpload.IsChecked, self.cbDeleteData.IsChecked, self.cbDeleteSubjects.IsChecked, self.cbDeleteProducts.IsChecked, self.cbDeleteAttributes.IsChecked, self.cbDeleteMail.IsChecked, function () { self.mw.Close(); });
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Save"));
                _this.mw.AddButton(_this.btnSaveAsUndeployedCopy);
                //TODO
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 13, function () { self.btnSaveAsUndeployedCopy.Click(); });
                return _this;
            }
            return ModalSaveSessionAsUndeployedCopyViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalSaveSessionAsUndeployedCopyViewModel = ModalSaveSessionAsUndeployedCopyViewModel;
        var ModalSessionsDBViewModel = /** @class */ (function (_super) {
            __extends(ModalSessionsDBViewModel, _super);
            function ModalSessionsDBViewModel(mw, localDirectories, linksToLocalSessions, callbackOnSelectSession, callbackOnClose) {
                var _this = _super.call(this, mw) || this;
                _this.currentDirectory = undefined;
                _this.callbackOnClose = undefined;
                _this.callbackOnSelectSession = undefined;
                var self = _this;
                _this.localDirectories = localDirectories;
                _this.linksToLocalSessions = linksToLocalSessions;
                _this.callbackOnSelectSession = callbackOnSelectSession;
                _this.breadcrumbLocalDBDiv = Framework.Form.TextElement.Register("breadcrumbLocalDBDiv");
                _this.localDBDirectoriesDiv = Framework.Form.TextElement.Register("localDBDirectoriesDiv");
                _this.localDBSessionsDiv = Framework.Form.TextElement.Register("localDBSessionsDiv");
                _this.localDBSaveSessionDiv = Framework.Form.TextElement.Register("localDBSaveSessionDiv");
                _this.localDBSaveSessionDiv.Hide();
                _this.localDBDiv = Framework.Form.TextElement.Register("localDBDiv");
                var getFilenames = function () {
                    var localDirectoryId = "0";
                    if (self.currentDirectory) {
                        localDirectoryId = self.currentDirectory.ID;
                    }
                    return linksToLocalSessions.filter(function (x) { return x.LocalDirectoryId == localDirectoryId; }).map(function (x) { return x.Name; });
                };
                _this.inputSessionFileName = Framework.Form.InputText.Register("inputSessionFileName", "", Framework.Form.Validator.Unique2(getFilenames, 4, "FileAlreadyExists"), function () {
                    self.btnSaveSessionInCurrentDirectory.CheckState();
                }, true);
                _this.inputSessionFileDescription = Framework.Form.InputText.Register("inputSessionFileDescription", "", Framework.Form.Validator.NoValidation(), function () {
                    self.btnSaveSessionInCurrentDirectory.CheckState();
                });
                self.openDirectory(new PanelLeaderModels.ServerDirectory());
                if (callbackOnClose) {
                    _this.callbackOnClose = callbackOnClose;
                    _this.localDBDiv.HtmlElement.style.height = "50vh";
                    _this.localDBDiv.HtmlElement.style.maxHeight = "50vh";
                    _this.localDBDiv.HtmlElement.style.overflowY = "scroll";
                    _this.localDBSaveSessionDiv.Show();
                    _this.btnSaveSessionInCurrentDirectory = Framework.Form.Button.Create(function () {
                        return self.inputSessionFileDescription && self.inputSessionFileDescription.IsValid && self.inputSessionFileName && self.inputSessionFileName.IsValid;
                    }, function () {
                        var localDirectoryId = "0";
                        if (self.currentDirectory) {
                            localDirectoryId = self.currentDirectory.ID;
                        }
                        var newSession = new PanelLeaderModels.ServerSessionShortcut();
                        newSession.LocalDirectoryId = localDirectoryId;
                        self.SaveAs(newSession, self.inputSessionFileName.Value, self.inputSessionFileDescription.Value, localDirectoryId, function () {
                            self.mw.Close();
                            if (self.callbackOnClose) {
                                self.callbackOnClose();
                            }
                        });
                    }, '<i class="fas fa-save"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Save"));
                    _this.mw.AddButton(_this.btnSaveSessionInCurrentDirectory);
                    //TODO
                    Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 13, function () { self.btnSaveSessionInCurrentDirectory.Click(); });
                }
                return _this;
            }
            ModalSessionsDBViewModel.prototype.SetInputFileNameError = function () {
                this.inputSessionFileName.Invalidate("Erroe");
            };
            ModalSessionsDBViewModel.prototype.goBack = function () {
                // Remonte d'un niveau
                this.openDirectory(this.currentDirectory.GetParentDirectory(this.localDirectories));
            };
            ModalSessionsDBViewModel.prototype.setBreadcrumb = function () {
                var self = this;
                // RAZ
                this.breadcrumbLocalDBDiv.HtmlElement.innerHTML = "";
                var span = document.createElement("span");
                span.innerHTML = Framework.LocalizationManager.Get("CurrentDirectory");
                this.breadcrumbLocalDBDiv.HtmlElement.appendChild(span);
                // Home
                var homeButton = Framework.Form.Button.Create(function () { return true; }, function () {
                    self.openDirectory(undefined);
                }, Framework.LocalizationManager.Get("RootDirectory"), ["localDBBreadcrumb"], Framework.LocalizationManager.Get("RootDirectory"));
                this.breadcrumbLocalDBDiv.Append(homeButton);
                var parents = this.currentDirectory.GetParentDirectories(this.localDirectories);
                parents.forEach(function (x) {
                    var button = Framework.Form.Button.Create(function () { return true; }, function () {
                        self.openDirectory(x);
                    }, x.Name, ["localDBBreadcrumb"], x.Name);
                    var separator = Framework.Form.TextElement.Create(" > ", ["localDBBreadcrumb"]);
                    self.breadcrumbLocalDBDiv.Append(separator);
                    self.breadcrumbLocalDBDiv.Append(button);
                });
            };
            ModalSessionsDBViewModel.prototype.openDirectory = function (localDirectory) {
                this.currentDirectory = Framework.Factory.CreateFrom(PanelLeaderModels.ServerDirectory, localDirectory);
                this.setBreadcrumb();
                this.setDirectories();
                this.setSessions();
            };
            ModalSessionsDBViewModel.prototype.setDirectories = function () {
                this.localDBDirectoriesDiv.HtmlElement.innerHTML = "";
                var self = this;
                // Bouton retour rep précédent
                if (this.currentDirectory != undefined) {
                    var div0 = Framework.Form.TextElement.Create("", ["localDBDirectory"]);
                    self.localDBDirectoriesDiv.Append(div0);
                    var button0 = Framework.Form.Button.Create(function () { return true; }, function () {
                        self.goBack();
                    }, "", ["localDBBackDirectoryButton"], Framework.LocalizationManager.Get("GoBack"));
                    div0.Append(button0);
                }
                // Bouton nouveau répertoire
                var div = Framework.Form.TextElement.Create("", ["localDBDirectory"]);
                self.localDBDirectoriesDiv.Append(div);
                var button = Framework.Form.Button.Create(function () { return true; }, function () {
                    self.CreateDirectory(self.currentDirectory, function () {
                        self.setDirectories();
                    });
                }, "", ["localDBNewDirectoryButton"], Framework.LocalizationManager.Get("CreateNewDirectory"));
                div.Append(button);
                //let children = this.controller.GetChildrenDirectories(this.currentDirectory);
                var children = this.currentDirectory.GetChildrenDirectories(this.localDirectories);
                children.forEach(function (x) {
                    var div = Framework.Form.TextElement.Create("", ["localDBDirectory"]);
                    self.localDBDirectoriesDiv.Append(div);
                    //TODO : ajouter nombre de sessions dans le répertoire entre parenthèses
                    var btnOpenDir = Framework.Form.Button.Create(function () { return true; }, function () {
                        self.openDirectory(x);
                    }, "", ["localDBDirectoryButton"], x.Name);
                    div.Append(btnOpenDir);
                    var label = Framework.Form.TextElement.Create("", ["localDBLabel"]);
                    label.HtmlElement.title = x.Name;
                    div.Append(label);
                    var span = Framework.Form.TextElement.Create(x.Name);
                    label.Append(span);
                    var btnDelete = Framework.Form.Button.Create(function () { return true; }, function () {
                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveThisElement"), function () {
                            self.DeleteDirectory(x, function () {
                                var l = self.localDirectories;
                                self.setDirectories();
                                self.setSessions();
                            });
                        });
                    }, '<i class="fas fa-trash"></i>', ["btnCircle", "btn24"], Framework.LocalizationManager.Get("Delete"));
                    label.Append(btnDelete);
                    btnDelete.Hide();
                    var btnRename = Framework.Form.Button.Create(function () { return true; }, function () {
                        var input = document.createElement("input");
                        input.value = x.Name;
                        input.type = "text";
                        input.style.width = "100%";
                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("PleaseEnterNewName"), input, function () {
                            var name = input.value;
                            self.RenameDirectory(x, name, function (newName) {
                                span.SetHtml(newName);
                                label.HtmlElement.title = newName;
                            });
                        });
                    }, '<i class="fas fa-edit"></i>', ["btnCircle", "btn24"], Framework.LocalizationManager.Get("Rename"));
                    label.Append(btnRename);
                    btnRename.Hide();
                    //TODO : déplacer répertoire
                    label.HtmlElement.onmouseover = function () {
                        span.Hide();
                        btnDelete.Show();
                        btnRename.Show();
                    };
                    label.HtmlElement.onmouseout = function () {
                        span.Show();
                        btnDelete.Hide();
                        btnRename.Hide();
                    };
                });
            };
            ModalSessionsDBViewModel.prototype.setSessions = function () {
                this.localDBSessionsDiv.HtmlElement.innerHTML = "";
                var self = this;
                var currentDirectoryId = "0";
                if (self.currentDirectory.ID) {
                    currentDirectoryId = self.currentDirectory.ID;
                }
                var children = this.currentDirectory.GetSessions(this.linksToLocalSessions); //this.controller.LocalDB.GetDirectorySessions(currentDirectoryId);
                children.sort(function (x, y) { return x.Name.localeCompare(y.Name); }).forEach(function (x) {
                    var div = Framework.Form.TextElement.Create("", ["localDBDirectory"]);
                    div.HtmlElement.title = x.Name;
                    self.localDBSessionsDiv.Append(div);
                    var btnOpenSession = Framework.Form.Button.Create(function () { return true; }, function () {
                        self.callbackOnSelectSession(x.ID);
                        //self.controller.OpenSessionFromLocalDB(Number(x.Id));
                        self.mw.Close();
                    }, "", ["localDBSessionButton"], x.Name);
                    div.Append(btnOpenSession);
                    var pdiv = document.createElement("div");
                    pdiv.innerHTML = x.Name + "\n" + x.Description;
                    Framework.Popup.Create(btnOpenSession.HtmlElement, pdiv, "right");
                    var label = Framework.Form.TextElement.Create("", ["localDBLabel"]);
                    label.HtmlElement.title = x.Name;
                    div.Append(label);
                    var span = Framework.Form.TextElement.Create(x.Name);
                    label.Append(span);
                    var btnDelete = Framework.Form.Button.Create(function () { return true; }, function () {
                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveThisElement"), function () {
                            self.DeleteSession(x, function () {
                                self.setSessions();
                            });
                        });
                    }, '<i class="fas fa-trash"></i>', ["localDBLabelButton"], Framework.LocalizationManager.Get("Delete"));
                    label.Append(btnDelete);
                    btnDelete.Hide();
                    var btnRename = Framework.Form.Button.Create(function () { return true; }, function () {
                        var input = document.createElement("input");
                        input.value = x.Name;
                        input.type = "text";
                        input.style.width = "100%";
                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("PleaseEnterNewName"), input, function () {
                            self.RenameSession(x, input.value, function (name) {
                                span.SetHtml(name);
                                label.HtmlElement.title = name;
                            });
                        });
                    }, '<i class="fas fa-edit"></i>', ["localDBLabelButton"], Framework.LocalizationManager.Get("Rename"));
                    label.Append(btnRename);
                    btnRename.Hide();
                    //TODO : déplacer fichier
                    label.HtmlElement.onmouseover = function () {
                        span.Hide();
                        btnDelete.Show();
                        btnRename.Show();
                    };
                    label.HtmlElement.onmouseout = function () {
                        span.Show();
                        btnDelete.Hide();
                        btnRename.Hide();
                    };
                });
            };
            return ModalSessionsDBViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalSessionsDBViewModel = ModalSessionsDBViewModel;
        var ModalSessionLogViewModel = /** @class */ (function (_super) {
            __extends(ModalSessionLogViewModel, _super);
            function ModalSessionLogViewModel(mw, sessionInfo) {
                var _this = _super.call(this, mw) || this;
                var self = _this;
                _this.labelDescription = Framework.Form.TextElement.Register("labelDescription", sessionInfo.Description);
                _this.labelDataBasePath = Framework.Form.TextElement.Register("labelDataBasePath", sessionInfo.DataBasePath);
                _this.labelLastSave = Framework.Form.TextElement.Register("labelLastSave", sessionInfo.LastSave);
                //this.labelLastSynchronisation = Framework.Form.TextElement.Register("labelLastSynchronisation", sessionInfo.LastSynchronisation);
                _this.labelActions = Framework.Form.TextElement.Register("labelActions", sessionInfo.Log);
                //this.labelOwner = Framework.Form.TextElement.Register("labelOwner", sessionInfo.Owner);
                _this.labelSize = Framework.Form.TextElement.Register("labelSize", sessionInfo.Size);
                _this.btnPrint = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    var text = Framework.LocalizationManager.Get("DataBasePath") + ": " + sessionInfo.DataBasePath + "\r\n";
                    text += Framework.LocalizationManager.Get("Description") + ": " + sessionInfo.Description + "\r\n";
                    text += Framework.LocalizationManager.Get("LastSave") + ": " + sessionInfo.LastSave + "\r\n";
                    //text += Framework.LocalizationManager.Get("SynchronizationStatus") + ": " + sessionInfo.LastSynchronisation + "\r\n";
                    text += Framework.LocalizationManager.Get("Log") + ":\r\n" + sessionInfo.Log;
                    var blob = new Blob([text], {
                        type: 'text/plain'
                    });
                    Framework.FileHelper.SaveAs(blob, "info.txt");
                }, '<i class="fas fa-save"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Save"));
                _this.mw.AddButton(_this.btnPrint);
                var btnClose = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    self.mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Close"));
                _this.mw.AddButton(btnClose);
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 13, function () { btnClose.Click(); });
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 27, function () { btnClose.Click(); });
                return _this;
            }
            Object.defineProperty(ModalSessionLogViewModel.prototype, "LabelSize", {
                get: function () { return this.labelSize; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSessionLogViewModel.prototype, "LabelDescription", {
                get: function () { return this.labelDescription; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSessionLogViewModel.prototype, "LabelDataBasePath", {
                get: function () { return this.labelDataBasePath; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSessionLogViewModel.prototype, "LabelLastSave", {
                get: function () { return this.labelLastSave; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSessionLogViewModel.prototype, "LabelActions", {
                //public get LabelLastSynchronisation() { return this.labelLastSynchronisation }
                get: function () { return this.labelActions; },
                enumerable: false,
                configurable: true
            });
            return ModalSessionLogViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalSessionLogViewModel = ModalSessionLogViewModel;
        var ModalDesignSettingsViewModel = /** @class */ (function (_super) {
            __extends(ModalDesignSettingsViewModel, _super);
            function ModalDesignSettingsViewModel(mw, selectedDesign, listDesignNames, onChange) {
                var _this = _super.call(this, mw) || this;
                var self = _this;
                var design = Framework.Factory.Create(Models.ExperimentalDesign, JSON.stringify(selectedDesign));
                var res = design.GetProperties(listDesignNames);
                res.forEach(function (p) {
                    p.SetPropertyKeyMaxWidth(530);
                });
                res.forEach(function (x) {
                    self.mw.Body.appendChild(x.Editor.HtmlElement);
                });
                var btnCancel = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    self.mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                _this.mw.AddButton(btnCancel);
                var btnSave = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    onChange(design);
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Save"));
                _this.mw.AddButton(btnSave);
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 27, function () { btnCancel.Click(); });
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 13, function () { btnSave.Click(); });
                return _this;
            }
            return ModalDesignSettingsViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalDesignSettingsViewModel = ModalDesignSettingsViewModel;
        var ModalTokenDownloadConfirmationViewModel = /** @class */ (function (_super) {
            __extends(ModalTokenDownloadConfirmationViewModel, _super);
            function ModalTokenDownloadConfirmationViewModel(mw, requiredTokens, availableTokens, subjectCount, dataCount, videos, videosSize, onConfirm, onCancel) {
                var _this = _super.call(this, mw) || this;
                //private cbAnalyzeVideos: Framework.Form.CheckBox;
                _this.isOnline = true;
                var self = _this;
                var canValidate = true;
                var message = Framework.LocalizationManager.Get("PleaseConfirmDataDownload");
                //TOFIX
                //if (requiredTokens > availableTokens) {
                //    message = Framework.LocalizationManager.Get("NotEnoughTokens");
                //    canValidate = false;
                //    //TODO : lien vers site web pour acheter jetons
                //}
                //this.pTokenConfirmationMessage = Framework.Form.TextElement.Register("pTokenConfirmationMessage", message);
                //this.pTokenRequired = Framework.Form.TextElement.Register("pTokenRequired", Framework.LocalizationManager.Format("RequiredTokens", [requiredTokens.toString()]));
                //this.pTokenAvailable = Framework.Form.TextElement.Register("pTokenAvailable", Framework.LocalizationManager.Format("AvailableTokens", [availableTokens.toString()]));
                _this.btnValidateTokenDownload = Framework.Form.Button.Create(function () { return self.isOnline == true /*&& canValidate*/; }, function () {
                    onConfirm(self.cbDownloadData.IsChecked, self.cbDownloadVideos.IsChecked, false /*self.cbAnalyzeVideos.IsChecked*/);
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Confirm"));
                _this.mw.AddButton(_this.btnValidateTokenDownload);
                _this.btnCancelTokenDownload = Framework.Form.Button.Create(function () { return true; }, function () {
                    onCancel();
                    self.mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                _this.mw.AddButton(_this.btnCancelTokenDownload);
                _this.pDownloadDataConfirmation = Framework.Form.TextElement.Register("pDownloadDataConfirmation");
                _this.pDownloadVideosConfirmation = Framework.Form.TextElement.Register("pDownloadVideosConfirmation");
                //this.pAnalyzeVideos = Framework.Form.TextElement.Register("pAnalyzeVideos");
                _this.spanDownloadDataConfirmation = Framework.Form.TextElement.Register("spanDownloadDataConfirmation", Framework.LocalizationManager.Format("DownloadDataConfirmation", [dataCount.toString(), subjectCount.toString()]));
                var mo = Math.round(videosSize * 100 / 1048576) / 100;
                _this.spanDownloadVideosConfirmation = Framework.Form.TextElement.Register("spanDownloadVideosConfirmation", Framework.LocalizationManager.Format("DownloadVideosConfirmation", [videos.length.toString(), mo.toString()]));
                _this.cbDownloadData = Framework.Form.CheckBox.Register("cbDownloadData", function () { return canValidate; }, function () { }, "");
                _this.cbDownloadVideos = Framework.Form.CheckBox.Register("cbDownloadVideos", function () { return canValidate; }, function () { }, "");
                //this.cbAnalyzeVideos = Framework.Form.CheckBox.Register("cbAnalyzeVideos", () => { return canValidate; }, () => { }, "");
                if (dataCount > 0) {
                    _this.pDownloadDataConfirmation.Show();
                    _this.cbDownloadData.Check();
                }
                else {
                    _this.pDownloadDataConfirmation.Hide();
                }
                if (videos.length > 0) {
                    _this.pDownloadVideosConfirmation.Show();
                    //this.pAnalyzeVideos.Show();
                    _this.cbDownloadVideos.Check();
                    //this.cbAnalyzeVideos.Check();
                }
                else {
                    _this.pDownloadVideosConfirmation.Hide();
                    //this.pAnalyzeVideos.Hide();
                }
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 27, function () { self.btnCancelTokenDownload.Click(); });
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 13, function () { self.btnValidateTokenDownload.Click(); });
                return _this;
            }
            ModalTokenDownloadConfirmationViewModel.prototype.OnConnectivityChanged = function (isOnline) {
                this.isOnline = isOnline;
                this.btnValidateTokenDownload.CheckState();
            };
            return ModalTokenDownloadConfirmationViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalTokenDownloadConfirmationViewModel = ModalTokenDownloadConfirmationViewModel;
        var UploadViewModel = /** @class */ (function (_super) {
            __extends(UploadViewModel, _super);
            function UploadViewModel(upload) {
                var _this = _super.call(this) || this;
                _this.isOnline = true;
                var self = _this;
                _this.upload = upload;
                _this.upload.ExpirationDate = new Date(_this.upload.ExpirationDate.toString());
                _this.btnUpload = Framework.Form.ClickableElement.Register("btnUploadBlock", function () {
                    return self.CanUpload;
                }, function () {
                    self.UploadSessionOnServer();
                });
                _this.btnUpdate = Framework.Form.ClickableElement.Register("btnUpdateBlock", function () {
                    return self.CanUpdate;
                }, function () {
                    self.UploadSessionOnServer();
                });
                _this.btnDelete = Framework.Form.ClickableElement.Register("btnDeleteBlock", function () {
                    return self.CanDelete;
                }, function () {
                    if (self.HasAssociatedData() == true) {
                        var modal = Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), "");
                        modal.AddCheckbox(Framework.LocalizationManager.Get("RemoveAssociatedData"), function () { self.DeleteSessionOnServer(true); }, function () { self.DeleteSessionOnServer(false); });
                    }
                    else {
                        self.DeleteSessionOnServer(false);
                    }
                });
                var descriptionValidator = function (description) {
                    var res = "";
                    if (description.length == 0) {
                        res = Framework.LocalizationManager.Get("DescriptionRequired");
                    }
                    return res;
                };
                var validator1 = Framework.Form.Validator.Custom(descriptionValidator);
                _this.inputUploadDescription = Framework.Form.InputText.Register("inputUploadDescription", _this.upload.Description, validator1, function (description) {
                    self.upload.Description = description;
                    self.checkState();
                    self.remindToUpload();
                });
                _this.inputUploadInformation = Framework.Form.InputText.Register("inputUploadInformation", _this.getUploadInformation(), undefined, function (information) {
                    return self.setUploadInformation(information);
                });
                var dateValidator = function (expirationDate) {
                    var res = "";
                    if (expirationDate <= new Date(Date.now())) {
                        res = Framework.LocalizationManager.Get("WrongExpirationDate");
                    }
                    return res;
                };
                var validator2 = Framework.Form.Validator.Custom(dateValidator);
                _this.inputUploadExpiration = Framework.Form.InputText.Register("inputUploadExpiration", _this.upload.ExpirationDate.toLocaleDateString(), validator2, function (date) {
                    return "";
                });
                _this.inputUploadExpiration.HtmlElement.onclick = function () {
                    Framework.Form.ModalDatePicker.Render(_this.inputUploadExpiration.HtmlElement, self.upload.ExpirationDate, function (date) {
                        self.upload.ExpirationDate = date;
                        self.inputUploadExpiration.Set(_this.upload.ExpirationDate.toLocaleDateString());
                        self.checkState();
                        self.remindToUpload();
                    });
                };
                _this.inputUploadPassword = Framework.Form.InputText.Register("inputUploadPassword", _this.upload.Password, Framework.Form.Validator.NoValidation(), function (password) {
                    self.upload.Password = password;
                    return "";
                }, true);
                _this.selectMinTimeBetweenConnections = Framework.Form.Select.Register("selectMinTimeBetweenConnections", _this.upload.MinTimeBetweenConnexions, Framework.KeyValuePair.FromArray(Framework.Maths.Sequence(0, 48).map(function (x) { return x.toString(); })), Framework.Form.Validator.NoValidation(), function (x) {
                    self.upload.MinTimeBetweenConnexions = x;
                });
                _this.selectUploadPanelistCodeDisplayMode = Framework.Form.Select.Register("selectUploadPanelistCodeDisplayMode", _this.upload.ShowSubjectCodeOnClient, ScreenReader.PanelistCodeDisplayModeEnum, Framework.Form.Validator.NotEmpty(), function (displayMode) {
                    return self.setPanelistCodeDisplayMode(displayMode);
                });
                //this.selectPanelistCheckBrowserMode = Framework.Form.Select.Register("selectPanelistCheckBrowserMode", this.upload.CheckCompatibilityMode, Framework.KeyValuePair.FromArray(ScreenReader.CheckCompatibilityModeEnum), Framework.Form.Validator.NotEmpty(), (mode: string) => {
                //    return self.upload.CheckCompatibilityMode = mode;
                //});
                _this.selectUploadPanelistCodeAnonymousMode = Framework.Form.Select.Register("selectUploadPanelistCodeAnonymousMode", _this.upload.AnonymousMode, [{ Key: "NotAuthorized", Value: "NotAuthorized" }, { Key: "CreateJudgeAuto", Value: "CreateJudgeAuto" }, { Key: "UseExperimentalDesign", Value: "UseExperimentalDesign" }], Framework.Form.Validator.NotEmpty(), function (anonymousMode) {
                    return self.setPanelistAnonymousMode(anonymousMode);
                });
                _this.checkState();
                Framework.ShortcutManager.Add(function () { return self.IsContainerVisible; }, 46, function () {
                    if (self.btnDelete.IsEnabled == true && document.activeElement.localName != "input") {
                        self.btnDelete.Click();
                    }
                });
                Framework.ShortcutManager.Add(function () { return self.IsContainerVisible; }, 13, function () {
                    if (self.btnUpload.IsEnabled == true) {
                        self.btnUpload.Click();
                    }
                    if (self.btnUpdate.IsEnabled == true) {
                        self.btnUpdate.Click();
                    }
                });
                return _this;
            }
            UploadViewModel.prototype.OnConnectivityChanged = function (isOnline) {
                this.checkState();
            };
            Object.defineProperty(UploadViewModel.prototype, "CanUpload", {
                get: function () {
                    return this.isOnline == true && this.isLocked == false && this.upload.Date == undefined && new Date(this.upload.ExpirationDate.toString()) > new Date(Date.now());
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(UploadViewModel.prototype, "CanUpdate", {
                get: function () {
                    return this.isOnline == true && this.isLocked == false && this.upload.Date != undefined && new Date(this.upload.ExpirationDate.toString()) > new Date(Date.now());
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(UploadViewModel.prototype, "CanDelete", {
                get: function () {
                    return this.isOnline == true && this.isLocked == false && this.upload.Date != undefined;
                },
                enumerable: false,
                configurable: true
            });
            UploadViewModel.prototype.setPanelistCodeDisplayMode = function (displayMode) {
                this.upload.ShowSubjectCodeOnClient = displayMode;
                this.remindToUpload();
                return "";
            };
            UploadViewModel.prototype.setPanelistAnonymousMode = function (anonymousMode) {
                this.upload.AnonymousMode = anonymousMode;
                if (anonymousMode == "UseExperimentalDesign") {
                    this.setPanelistCodeDisplayMode("NotStarted");
                    this.selectUploadPanelistCodeDisplayMode.Set("NotStarted");
                }
                this.remindToUpload();
                return "";
            };
            UploadViewModel.prototype.remindToUpload = function () {
                this.Notify();
            };
            UploadViewModel.prototype.setUploadInformation = function (information) {
                if (information == undefined || information.length == 0) {
                    return Framework.LocalizationManager.Get("NotUploaded");
                }
                return "";
            };
            UploadViewModel.prototype.getUploadInformation = function () {
                var res = Framework.LocalizationManager.Get("NotUploaded");
                if (this.upload.Date != undefined) {
                    res = this.upload.ServerCode;
                }
                return res;
            };
            UploadViewModel.prototype.Update = function (serverCode) {
                if (serverCode === void 0) { serverCode = ""; }
                this.inputUploadInformation.Set(serverCode);
                // Etat des boutons
                this.checkState();
            };
            UploadViewModel.prototype.checkState = function () {
                this.btnUpload.CheckState();
                this.btnUpdate.CheckState();
                this.btnDelete.CheckState();
            };
            UploadViewModel.prototype.SetLock = function (isLocked) {
                this.isLocked = true;
                this.checkState();
            };
            Object.defineProperty(UploadViewModel.prototype, "InputUploadDescription", {
                get: function () {
                    return this.inputUploadDescription;
                },
                enumerable: false,
                configurable: true
            });
            return UploadViewModel;
        }(PanelLeaderViewModel));
        ViewModels.UploadViewModel = UploadViewModel;
        var ModalScreenStyleViewModel = /** @class */ (function (_super) {
            __extends(ModalScreenStyleViewModel, _super);
            function ModalScreenStyleViewModel(mw, defaultScreenOptions) {
                var _this = _super.call(this, mw) || this;
                var self = _this;
                var formProperties = PanelLeaderModels.DefaultScreenOptions.GetForm(defaultScreenOptions, function (changedValue, options) {
                    if (changedValue == 'Resolution') {
                        self.ChangeScreenResolution(options.Resolution);
                    }
                    if (changedValue == 'ProgressBar') {
                        self.SetListScreensProgressBar(options.ProgressBarPosition, options.ProgressBar);
                    }
                    if (changedValue == 'Background') {
                        self.SetListScreensBackground(options.ScreenBackground);
                    }
                    if (changedValue == 'Style') {
                        self.SetSessionStyle(options.DefaultStyle);
                    }
                });
                formProperties.forEach(function (x) {
                    x.SetPropertyKeyMaxWidth(320);
                    mw.Body.appendChild(x.Editor.HtmlElement);
                });
                return _this;
                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});
            }
            return ModalScreenStyleViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalScreenStyleViewModel = ModalScreenStyleViewModel;
        var ModalScreenFromXMLViewModel = /** @class */ (function (_super) {
            __extends(ModalScreenFromXMLViewModel, _super);
            function ModalScreenFromXMLViewModel(mw, screens, listDesigns, callback) {
                var _this = _super.call(this, mw) || this;
                var selectedScreens = [];
                var div = document.createElement("div");
                div.style.width = "810px";
                var _loop_1 = function () {
                    var screen_1 = Framework.Factory.CreateFrom(Models.Screen, screens[i]);
                    var miniature = screen_1.RenderAsMiniature(i, 200, listDesigns, function (x) {
                        var selected = selectedScreens.filter(function (x) { return x.Id == screen_1.Id; }).length > 0;
                        if (selected == false) {
                            selectedScreens.push(screen_1);
                            miniature.Div.style.border = "1px solid orange";
                        }
                        else {
                            Framework.Array.Remove(selectedScreens, screen_1);
                            miniature.Div.style.border = "";
                        }
                        btnOK.CheckState();
                    });
                    miniature.Div.style.cssFloat = "left";
                    div.appendChild(miniature.Div);
                };
                for (var i = 0; i < screens.length; i++) {
                    _loop_1();
                }
                mw.Body.appendChild(div);
                var btnOK = Framework.Form.Button.Create(function () { return selectedScreens.length > 0; }, function () {
                    callback(selectedScreens);
                    mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("OK"));
                var btnCancel = Framework.Form.Button.Create(function () { return true; }, function () { mw.Close(); }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                mw.AddButton(btnCancel);
                mw.AddButton(btnOK);
                return _this;
            }
            return ModalScreenFromXMLViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalScreenFromXMLViewModel = ModalScreenFromXMLViewModel;
        var ModalScreenPropertiesViewModel = /** @class */ (function (_super) {
            __extends(ModalScreenPropertiesViewModel, _super);
            function ModalScreenPropertiesViewModel(mw, currentScreen, listDesigns, listSubjects, onChange) {
                var _this = _super.call(this, mw) || this;
                _this.currentScreen = currentScreen;
                _this.onChange = onChange;
                _this.listDesigns = listDesigns;
                _this.listSubjects = listSubjects;
                var self = _this;
                var formSetBackground = Framework.Form.PropertyEditorWithColorPopup.Render("", "ScreenBackground", currentScreen.Background, function (x) {
                    self.SetBackground(currentScreen, x);
                });
                formSetBackground.SetPropertyKeyMaxWidth(300);
                mw.Body.appendChild(formSetBackground.Editor.HtmlElement);
                var setFormSetExperimentalDesignFormPropertyValue = function () {
                    var text = Framework.LocalizationManager.Get("None");
                    var designs = listDesigns.filter(function (x) { return x.Id == currentScreen.ExperimentalDesignId; });
                    if (designs.length > 0) {
                        text = designs[0].Name;
                    }
                    formSetExperimentalDesignFormProperty.SetLabelForPropertyValue(text);
                };
                var designs = listDesigns.map(function (x) { return x.Name; });
                designs.push(Framework.LocalizationManager.Get("NoDesign"));
                var formSetExperimentalDesignFormProperty = Framework.Form.PropertyEditorWithPopup.Render("", "ExperimentalDesign", "", designs, function (x, btn) {
                    var id = 0;
                    if (x == Framework.LocalizationManager.Get("NoDesign")) {
                        id = 0;
                    }
                    else {
                        id = listDesigns.filter(function (y) { return y.Name == x; })[0].Id;
                    }
                    self.SetExperimentalDesign(currentScreen, id);
                    setFormSetExperimentalDesignFormPropertyValue();
                });
                setFormSetExperimentalDesignFormPropertyValue();
                mw.Body.appendChild(formSetExperimentalDesignFormProperty.Editor.HtmlElement);
                var hasTimer = Models.Screen.HasControlOfType(currentScreen, "CustomTimer") == true;
                var formSetScreenTimer = Framework.Form.PropertyEditorWithToggle.Render("", "TimedScreen", hasTimer, function (x) {
                    self.SetTimer(currentScreen, x);
                });
                mw.Body.appendChild(formSetScreenTimer.Editor.HtmlElement);
                var hasChronometer = Models.Screen.HasControlOfType(currentScreen, "CustomChronometer") == true;
                var formSetScreenChronometer = Framework.Form.PropertyEditorWithToggle.Render("", "Chronometer", hasChronometer, function (x) {
                    self.SetChronometer(currentScreen, x);
                });
                mw.Body.appendChild(formSetScreenChronometer.Editor.HtmlElement);
                //TODO : timer value, timer visibility
                var formSetScreenConditional = Framework.Form.PropertyEditorWithButton.Render("", "ConditionalVisibility", Framework.LocalizationManager.Get(currentScreen.IsConditionnal.toString()), function () {
                    var divConditions = _this.getConditionalVisibilityForm(function () { mw.Close(); });
                    var mw = Framework.Modal.Confirm(Framework.LocalizationManager.Get("CheckConditionsToDisplayScreen"), divConditions.HtmlElement, function () {
                        if (self.currentScreen.ListConditions.AttributeConditions.length > 0 ||
                            self.currentScreen.ListConditions.ProductConditions.length > 0 ||
                            self.currentScreen.ListConditions.ProductRankConditions.length > 0 ||
                            self.currentScreen.ListConditions.ReplicateConditions.length > 0 ||
                            self.currentScreen.ListConditions.IntakeConditions.length > 0 ||
                            self.currentScreen.ListConditions.SubjectConditions.length > 0) {
                            self.SetConditionalVisibility(currentScreen, true);
                        }
                        else {
                            self.SetConditionalVisibility(currentScreen, false);
                        }
                        formSetScreenConditional.SetLabelForPropertyValue(Framework.LocalizationManager.Get(currentScreen.IsConditionnal.toString()));
                    }, undefined, undefined, undefined, undefined, "500px");
                });
                mw.Body.appendChild(formSetScreenConditional.Editor.HtmlElement);
                return _this;
                // Controle vocal
                //let hasSpeechRecognition: boolean = Models.Screen.HasControlOfType(currentScreen, "SpeechToText") == true;
                //let speechRecognition = "None"
                //if (hasSpeechRecognition == true) {
                //    speechRecognition = (<ScreenReader.Controls.SpeechToText>Models.Screen.GetControlsOfType(currentScreen, "SpeechToText")[0])._RecognitionLanguage;
                //}
                //let formSetSpeechToText = Framework.Form.PropertyEditorWithPopup.Render("", "SpeechRecognition", speechRecognition, ScreenReader.Controls.SpeechToText.RecognitionLanguageEnum, (x) => {
                //    self.SetSpeechRecognition(currentScreen, x);
                //}, true);
                //formSetSpeechToText.SetPropertyKeyMaxWidth(300);
                //mw.Body.appendChild(formSetSpeechToText.Editor.HtmlElement);
                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});
            }
            ModalScreenPropertiesViewModel.prototype.toggleCondition = function (condition, value) {
                this.ToggleScreenCondition(this.currentScreen, condition, value);
                this.onChange();
            };
            ModalScreenPropertiesViewModel.prototype.getConditionalVisibilityForm = function (close) {
                //TODO : par défaut, cocher tout, plus logique ?
                //TODO : style
                var self = this;
                var div = Framework.Form.TextElement.Create("");
                div.HtmlElement.style.padding = "10px";
                div.HtmlElement.style.margin = "10px";
                var btn = Framework.Form.Button.Create(function () { return true; }, function () {
                    self.currentScreen.ListConditions.AttributeConditions = [];
                    self.currentScreen.ListConditions.IntakeConditions = [];
                    self.currentScreen.ListConditions.ProductConditions = [];
                    self.currentScreen.ListConditions.ProductRankConditions = [];
                    self.currentScreen.ListConditions.ReplicateConditions = [];
                    self.currentScreen.ListConditions.SubjectConditions = [];
                    self.onChange();
                    close();
                }, "Remove all conditions", []);
                div.Append(btn);
                var designs = this.listDesigns.filter(function (x) { return self.currentScreen.ExperimentalDesignId == x.Id; });
                if (designs.length > 0) {
                    var currentDesign = designs[0];
                    if (currentDesign.NbReplicates > 1) {
                        var replicates = [];
                        for (var i = 1; i <= currentDesign.NbReplicates; i++) {
                            replicates.push(i);
                        }
                        var replicateDiv_1 = Framework.Form.TextElement.Create("");
                        replicates.forEach(function (replicate) {
                            var isChecked = self.currentScreen.ListConditions.ReplicateConditions.filter(function (x) { return x == replicate; }).length > 0;
                            var cbf = Framework.Form.PropertyEditorWithToggle.Render("", replicate.toString(), isChecked, function (val) {
                                self.toggleCondition("Replicate", replicate);
                            });
                            replicateDiv_1.Append(cbf.Editor);
                        });
                        var accordionReplicate = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("Replicate"));
                        accordionReplicate.HtmlElement.style.marginTop = "15px";
                        accordionReplicate.HtmlElement.style.fontWeight = "bold";
                        div.Append(accordionReplicate);
                        div.Append(replicateDiv_1);
                    }
                    if (currentDesign.NbIntakes > 1) {
                        var intakes = [];
                        for (var i = 1; i <= currentDesign.NbIntakes; i++) {
                            intakes.push(i);
                        }
                        var intakeDiv_1 = Framework.Form.TextElement.Create("");
                        intakes.forEach(function (intake) {
                            var isChecked = self.currentScreen.ListConditions.IntakeConditions.filter(function (x) { return x == intake; }).length > 0;
                            var cbf = Framework.Form.PropertyEditorWithToggle.Render("", intake.toString(), isChecked, function (val) {
                                self.toggleCondition("Intake", intake);
                            });
                            intakeDiv_1.Append(cbf.Editor);
                        });
                        var accordionIntake = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("Intake"));
                        accordionIntake.HtmlElement.style.marginTop = "15px";
                        accordionIntake.HtmlElement.style.fontWeight = "bold";
                        div.Append(accordionIntake);
                        div.Append(intakeDiv_1);
                    }
                    var items = Framework.Array.SortBy(Models.ExperimentalDesign.GetItems(currentDesign), "Code");
                    if (items.length > 1) {
                        if (currentDesign.Type == "Product") {
                            var productDiv_1 = Framework.Form.TextElement.Create("");
                            items.forEach(function (x) {
                                var isChecked = self.currentScreen.ListConditions.ProductConditions.filter(function (y) { return y == x["Code"]; }).length > 0;
                                var cbf = Framework.Form.PropertyEditorWithToggle.Render("", x["Code"], isChecked, function (val) {
                                    self.toggleCondition("Product", x["Code"]);
                                });
                                productDiv_1.Append(cbf.Editor);
                            });
                            var accordionProduct = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("ProductCode"));
                            accordionProduct.HtmlElement.style.marginTop = "15px";
                            accordionProduct.HtmlElement.style.fontWeight = "bold";
                            div.Append(accordionProduct);
                            div.Append(productDiv_1);
                            var rankDiv_1 = Framework.Form.TextElement.Create("");
                            var ranks = Framework.Array.Unique(currentDesign.ListExperimentalDesignRows.map(function (x) { return x.Rank; })).sort();
                            ranks.forEach(function (x) {
                                var isChecked = self.currentScreen.ListConditions.ProductRankConditions.filter(function (y) { return y == x; }).length > 0;
                                var cbf = Framework.Form.PropertyEditorWithToggle.Render("", x.toString(), isChecked, function (val) {
                                    self.toggleCondition("ProductRank", Number(x));
                                });
                                rankDiv_1.Append(cbf.Editor);
                            });
                            var accordionRank = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("ProductRank"));
                            accordionRank.HtmlElement.style.marginTop = "15px";
                            accordionRank.HtmlElement.style.fontWeight = "bold";
                            div.Append(accordionRank);
                            div.Append(rankDiv_1);
                        }
                        if (currentDesign.Type == "Attribute") {
                            var attributeDiv_1 = Framework.Form.TextElement.Create("");
                            items.forEach(function (x) {
                                var isChecked = self.currentScreen.ListConditions.AttributeConditions.filter(function (y) { return y == x["Code"]; }).length > 0;
                                var cbf = Framework.Form.PropertyEditorWithToggle.Render("", x["Code"], isChecked, function (val) {
                                    self.toggleCondition("Product", x["Code"]);
                                });
                                attributeDiv_1.Append(cbf.Editor);
                            });
                            var accordionAttribute = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("AttributeCode"));
                            accordionAttribute.HtmlElement.style.marginTop = "15px";
                            accordionAttribute.HtmlElement.style.fontWeight = "bold";
                            div.Append(accordionAttribute);
                            div.Append(attributeDiv_1);
                        }
                    }
                }
                var subjectDiv = Framework.Form.TextElement.Create("");
                this.listSubjects.sort().forEach(function (x) {
                    var isChecked = false;
                    if (self.currentScreen.ListConditions && self.currentScreen.ListConditions.SubjectConditions) {
                        isChecked = self.currentScreen.ListConditions.SubjectConditions.filter(function (y) { return y == x.Code; }).length > 0;
                    }
                    var cbf = Framework.Form.PropertyEditorWithToggle.Render("", x.Code, isChecked, function (val) {
                        self.toggleCondition("Subject", x.Code);
                    });
                    subjectDiv.Append(cbf.Editor);
                });
                var accordionSubject = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("SubjectCode"));
                accordionSubject.HtmlElement.style.marginTop = "15px";
                accordionSubject.HtmlElement.style.fontWeight = "bold";
                div.Append(accordionSubject);
                div.Append(subjectDiv);
                return div;
            };
            return ModalScreenPropertiesViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalScreenPropertiesViewModel = ModalScreenPropertiesViewModel;
        var ScenarioViewModel = /** @class */ (function (_super) {
            __extends(ScenarioViewModel, _super);
            //constructor(subject: Models.Subject, listScreens: Models.Screen[], listDesigns: Models.ExperimentalDesign[]) {
            function ScenarioViewModel(subjectSession) {
                var _this = _super.call(this) || this;
                _this.listScreensWidth = 220; // Largeur de la partie gauche de l'écran
                _this.containerHeight = window.innerHeight - 90;
                _this.designGridVisibility = false;
                _this.designGridStickiness = false;
                _this.designGridIncrement = 60;
                _this.scaleFactor = 1;
                _this.selectedControlIndex = 0;
                _this.controlIds = [];
                var self = _this;
                var scenarioView = _this;
                //this.subject = subject;
                //this.listScreens = listScreens;
                //this.listDesigns = listDesigns;
                _this.scenarioViewContainer = $("#scenarioViewContainer")[0];
                _this.listScreensContainer = $("#listScreensContainer")[0];
                _this.activeScreenContainer = ($("#activeScreenContainer")[0]);
                _this.activeScreenWrapper = ($("#activeScreenWrapper")[0]);
                _this.scenarioViewContainer.style.height = _this.containerHeight + "px";
                _this.listScreensContainer.style.height = (_this.containerHeight - 70) + "px";
                _this.listScreensContainer.style.width = _this.listScreensWidth + "px";
                _this.listScreensContainer.style.overflowY = "scroll"; //TODO : css
                _this.listScreensContainer.style.overflowX = "hidden"; //TODO : css
                _this.activeScreenContainer.style.height = _this.containerHeight - 70 + "px";
                _this.activeScreenContainer.style.margin = 5 + "px";
                _this.activeScreenWrapper.style.height = _this.containerHeight - 70 + "px";
                _this.activeScreenWrapper.style.textAlign = "center"; //TODO : css
                _this.activeScreenContainer.style.display = "inline-block"; //TODO : css
                //this.subjectSession = new Models.SubjectSeance();
                //this.subjectSession.ListExperimentalDesigns = listDesigns;
                //this.subjectSession.ListScreens = listScreens;
                //this.subjectSession.Subject = subject;
                //this.subjectSession.Progress = new Models.Progress();
                //this.subjectSession.Progress.CurrentState = new Models.State();
                //this.subjectSession.Progress.CurrentState.CurrentScreen = 0;
                _this.subjectSession = subjectSession;
                _this.listScreens = subjectSession.ListScreens;
                _this.listDesigns = subjectSession.ListExperimentalDesigns;
                _this.btnEditScreenProperties = Framework.Form.Button.Register("btnEditScreenProperties", function () {
                    return (self.isLocked == false && self.CurrentScreen != undefined); //TODO : actualiser état du bouton
                }, function () {
                    self.ShowModalScreenProperties(self.CurrentScreen, self.selectedScreenIndex + 1, function () { self.saveCurrentScreen(); });
                });
                //this.btnSaveScreenAsPicture = Framework.Form.Button.Register("btnSaveScreenAsPicture", () => {
                //    return true;
                //}, (e) => {
                //    Framework.Screenshot.SaveAs(self.activeScreenContainer);
                //});
                _this.btnCopyScreen = Framework.Form.Button.Register("btnCopyScreen", function () {
                    return self.isLocked == false;
                }, function (e) {
                    self.copiedScreen = Framework.Factory.Clone(self.CurrentScreen);
                    self.copiedScreen.Id = undefined;
                });
                _this.btnMoveUpScreen = Framework.Form.Button.Register("btnMoveUpScreen", function () {
                    return (self.isLocked == false && self.selectedScreenIndex > 0); //TODO : actualiser état du bouton
                }, function (e) {
                    self.MoveScreen(self.selectedScreenIndex, "up");
                    //self.setMiniatures();
                    //self.highlightSelectedScreen(self.currentScreen.Id);
                    //self.btnMoveDownScreen.CheckState();
                    //self.btnMoveUpScreen.CheckState();
                });
                _this.btnMoveDownScreen = Framework.Form.Button.Register("btnMoveDownScreen", function () {
                    return (self.isLocked == false && self.selectedScreenIndex != (self.subjectSession.ListScreens.length) - 1); //TODO : actualiser état du bouton
                }, function (e) {
                    self.MoveScreen(self.selectedScreenIndex, "down");
                    //self.setMiniatures();
                    //self.highlightSelectedScreen(self.currentScreen.Id);
                    //self.btnMoveDownScreen.CheckState();
                    //self.btnMoveUpScreen.CheckState();
                });
                _this.btnDeleteScreen = Framework.Form.Button.Register("btnDeleteScreen", function () {
                    return (self.isLocked == false && self.subjectSession && self.subjectSession.ListScreens.length > 1); //TODO : actualiser état du bouton
                }, function (e) {
                    Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("DoYouConfirmScreenRemoval"), function () {
                        self.DeleteScreen(self.CurrentScreen, self.selectedScreenIndex);
                    });
                });
                _this.btnInsertScreen = Framework.Form.Button.Register("btnInsertScreen", function () {
                    return self.isLocked == false;
                }, function (e) {
                    self.showInsertScreen();
                });
                _this.btnPasteScreen = Framework.Form.Button.Register("btnPasteScreen", function () {
                    return self.isLocked == false;
                }, function (e) {
                    self.InsertScreen(Framework.Factory.Clone(self.copiedScreen), self.selectedScreenIndex, undefined);
                });
                _this.btnSetScreenStyle = Framework.Form.Button.Register("btnSetScreenStyle", function () {
                    return self.isLocked == false;
                }, function (e) {
                    self.ShowModalScreensStyle(function () {
                        self.OnScreenChanged(self.CurrentScreen.Id, false);
                        self.setMiniatures();
                        self.highlightSelectedScreen(self.CurrentScreen.Id);
                    });
                });
                _this.btnSimulateSession = Framework.Form.Button.Register("btnSimulateSession", function () {
                    return true;
                }, function () {
                    self.ShowModalSimulation(self.subjectSession, self.CurrentScreen.Id);
                }, Framework.LocalizationManager.Get("SimulateSession"));
                _this.btnZoomIn = Framework.Form.Button.Register("btnZoomIn", function () {
                    return self.scaleFactor < 2;
                }, function (e) {
                    self.scaleFactor += 0.05;
                    self.screenDiv.style.transform = "scale(" + self.scaleFactor + ")";
                    self.btnZoomIn.CheckState();
                    self.btnZoomOut.CheckState();
                }, Framework.LocalizationManager.Get("ZoomIn"));
                _this.btnZoomOut = Framework.Form.Button.Register("btnZoomOut", function () {
                    return self.scaleFactor > 0.6;
                }, function (e) {
                    self.scaleFactor -= 0.05;
                    self.screenDiv.style.transform = "scale(" + self.scaleFactor + ")";
                    self.btnZoomIn.CheckState();
                    self.btnZoomOut.CheckState();
                }, Framework.LocalizationManager.Get("ZoomOut"));
                _this.btnToggleGridVisibility = Framework.Form.Button.Register("btnToggleGrid", function () {
                    return true;
                }, function (e) {
                    self.setGrid();
                }, Framework.LocalizationManager.Get("ToggleGridVisibility"));
                //TODO                
                //    new Framework.Form.ToolBarDropDownButtonItem(() => { self.screenEditor.AlignControlsOnGrid(); }, ["toolboxbutton", "toggleDesignGridButton"], "", Framework.LocalizationManager.Get("AlignAllcontrolsOnGrid"))
                //TODO
                _this.btnSelectNextControl = Framework.Form.Button.Register("btnSelectNextControl", function () {
                    return true;
                }, function (e) {
                    self.selectNextControl();
                }, Framework.LocalizationManager.Get("SelectNextControl"));
                _this.btnAddControl = Framework.Form.Button.Register("btnAddControl", function () {
                    return self.isLocked == false;
                }, function () {
                    self.showControlList();
                });
                _this.btnPasteControl = Framework.Form.Button.Register("btnPasteControl", function () {
                    return (self.isLocked == false && self.CurrentScreen != undefined && self.copiedControl != undefined);
                }, function (e) {
                    var newControl = Framework.Factory.CreateFrom(ScreenReader.Controls.BaseControl, self.copiedControl, false);
                    newControl._Left += 10;
                    newControl._Top += 10;
                    self.addControl(newControl, false);
                }, Framework.LocalizationManager.Get("PasteTooltip"));
                _this.btnCopyControl = Framework.Form.Button.Register("btnCopyControl", function () {
                    return (self.isLocked == false && self.CurrentScreen != undefined && self.selectedControl != undefined); //TODO : actualiser état du bouton
                }, function (e) {
                    self.copiedControl = self.selectedControl;
                    self.btnPasteControl.CheckState();
                }, Framework.LocalizationManager.Get("CopyTooltip"));
                _this.btnEditControl = Framework.Form.Button.Register("btnEditControl", function () {
                    return (self.isLocked == false && self.CurrentScreen != undefined && self.selectedControl != undefined); //TODO : actualiser
                }, function (e) {
                    self.selectedControl.Highlight();
                    self.selectedControl.ShowProperties();
                }, Framework.LocalizationManager.Get("EditControlTooltip"));
                _this.btnPositionControl = Framework.Form.Button.Register("btnPositionControl", function () {
                    return (self.isLocked == false && self.CurrentScreen != undefined && self.selectedControl != undefined); //TODO : actualiser
                }, function (e) {
                    var div = document.createElement("div");
                    div.appendChild(self.selectedControl.GetPositionForm().HtmlElement);
                    Framework.Popup.Show(self.btnPositionControl.HtmlElement, div, "top");
                }, Framework.LocalizationManager.Get("PositionControlTooltip"));
                _this.btnCutControl = Framework.Form.Button.Register("btnCutControl", function () {
                    return (self.isLocked == false && self.CurrentScreen != undefined && self.selectedControl != undefined); //TODO : actualiser état du bouton
                }, function (e) {
                    //TODO
                    self.copiedControl = self.selectedControl;
                    self.RemoveControlFromScreen(self.CurrentScreen, self.selectedControl);
                    //self.currentScreen.DeleteControl(self.selectedControl);
                    self.btnPasteControl.CheckState();
                }, Framework.LocalizationManager.Get("PasteTooltip"));
                _this.btnDeleteControl = Framework.Form.Button.Register("btnDeleteControl", function () {
                    return (self.isLocked == false && self.CurrentScreen != undefined && self.selectedControl != undefined); //TODO : actualiser état du bouton
                }, function (e) {
                    Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("ConfirmControlRemoval"), function () {
                        self.RemoveControlFromScreen(self.CurrentScreen, self.selectedControl);
                    });
                    //self.currentScreen.DeleteControl(self.selectedControl);
                }, Framework.LocalizationManager.Get("DeleteTooltip"));
                _this.miniaturesDiv = document.createElement("div");
                _this.miniaturesDiv.style.width = _this.listScreensContainer.clientWidth + "px";
                _this.miniaturesDiv.style.height = _this.listScreensContainer.clientHeight + "px";
                _this.miniaturesDiv.style.margin = "1px";
                _this.listScreensContainer.appendChild(_this.miniaturesDiv);
                if (self.listScreens && self.listScreens.length > 0) {
                    // Initialisation des miniatures
                    self.setMiniatures();
                    // Ecran sélectionné
                    self.OnScreenChanged(self.listScreens[0].Id, false);
                    //self.currentScreen = controller.Session.ListScreens[0];
                    //self.highlightSelectedScreen(controller.Session.ListScreens[0].Id);
                    //self.miniatures.OnGridChange = (designGridVisibility: boolean, designGridIncrement: number, designGridStickiness: boolean) => {
                    //    self.designGridVisibility = designGridVisibility;
                    //    self.designGridStickiness = designGridStickiness;
                    //    self.designGridIncrement = designGridIncrement;
                    //    self.onGridChanged();
                    //}
                }
                else {
                    //TODO : message pas d'écran
                }
                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});
                self.editor = Framework.Editor.Render(document.getElementById("textEditToolbar"));
                return _this;
            }
            Object.defineProperty(ScenarioViewModel.prototype, "selectedScreenIndex", {
                get: function () {
                    var self = this;
                    if (this.miniaturesScreens == undefined) {
                        return -1;
                    }
                    var index = 0;
                    for (var _i = 0, _a = this.miniaturesScreens; _i < _a.length; _i++) {
                        var mini = _a[_i];
                        if (mini.Screen.Id != self.CurrentScreen.Id) {
                            index++;
                        }
                        else {
                            break;
                        }
                    }
                    return index;
                },
                enumerable: false,
                configurable: true
            });
            ScenarioViewModel.prototype.UpdateMiniatures = function () {
                this.setMiniatures();
                this.highlightSelectedScreen(this.CurrentScreen.Id);
                this.btnMoveDownScreen.CheckState();
                this.btnMoveUpScreen.CheckState();
            };
            ScenarioViewModel.prototype.showInsertScreen = function () {
                var self = this;
                var div = document.createElement("div");
                var cb = function () {
                    //self.setMiniatures();
                    //self.highlightSelectedScreen(self.currentScreen.Id);
                    //self.btnMoveDownScreen.CheckState();
                    //self.btnMoveUpScreen.CheckState();
                    modal.Close();
                };
                //let div1 = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("InsertSingleScreen"), ["font-weight-bold"]);
                //div.appendChild(div1.HtmlElement);
                var b1 = Framework.Form.Button.Create(function () { return true; }, function () {
                    self.InsertScreen(undefined, self.selectedScreenIndex, 0);
                    cb();
                }, Framework.LocalizationManager.Get("InsertSingleScreen"), ["textButton"]);
                div.appendChild(b1.HtmlElement);
                //let b5 = Framework.Form.Button.Create(() => { return true; }, () => {
                //    let screen = Models.Screen.CreateScreenWithContent(0, new PanelLeaderModels.TemplatedScreenWithContent("", Framework.LocalizationManager.Get("EnterText"), Framework.LocalizationManager.Get("EnterText")));
                //    self.InsertScreen(screen, self.selectedScreenIndex, 0);
                //    cb();
                //}, Framework.LocalizationManager.Get("ScreenWithTitleAndContent"), ["textButton"]);
                //div.appendChild(b5.HtmlElement);
                //let div2 = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("InsertRepeatedScreen"), ["font-weight-bold"]);
                //div.appendChild(div2.HtmlElement);
                var b2 = Framework.Form.Button.Create(function () { return true; }, function () {
                    self.InsertScreen(undefined, self.selectedScreenIndex, self.getPreviousScreenExperimentalDesign());
                    cb();
                }, Framework.LocalizationManager.Get("InsertRepeatedScreen"), ["textButton"]);
                div.appendChild(b2.HtmlElement);
                //let b6 = Framework.Form.Button.Create(() => { return true; }, () => {
                //    let screen = Models.Screen.CreateScreenWithContent(self.getPreviousScreenExperimentalDesign(), new PanelLeaderModels.TemplatedScreenWithContent("", Framework.LocalizationManager.Get("EnterText"), Framework.LocalizationManager.Get("EnterText")));
                //    self.InsertScreen(screen, self.selectedScreenIndex, 0);
                //    cb();
                //}, Framework.LocalizationManager.Get("ScreenWithTitleAndContent"), ["textButton"]);
                //div.appendChild(b6.HtmlElement);
                //let div3 = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("Other"), ["font-weight-bold"]);
                //div.appendChild(div3.HtmlElement);
                //let b3 = Framework.Form.Button.Create(() => { return self.copiedScreen != undefined; }, () => {
                //    self.InsertScreen(Framework.Factory.Clone(self.copiedScreen), self.selectedScreenIndex, undefined);
                //    cb();
                //}, Framework.LocalizationManager.Get("FromClipboard"), ["textButton"]);
                //div.appendChild(b3.HtmlElement);
                var b4 = Framework.Form.Button.Create(function () { return true; }, function () {
                    self.ShowModalScreenFromXML(self.selectedScreenIndex, self.getPreviousScreenExperimentalDesign(), function () { cb(); });
                    //self.showInsertScreenFromAnotherSession((screens: Models.Screen[]) => {
                    //    screens.forEach((screen) => {
                    //        self.InsertScreen(screen, self.selectedScreenIndex, self.getPreviousScreenExperimentalDesign());
                    //    });
                    //    cb();
                    //});
                }, Framework.LocalizationManager.Get("FromAnotherSession"), ["textButton"]);
                div.appendChild(b4.HtmlElement);
                //TODO : modèles d'écran
                var modal = Framework.Modal.Custom(div, Framework.LocalizationManager.Get("InsertScreen"), undefined, undefined, "500px", true);
            };
            //TODO : view à part
            //private showInsertScreenFromAnotherSession(callback: (screens: Models.Screen[]) => void) {
            //    let self = this;
            //    //TODO
            //    //this.controller.showModalSessionsDB((id: number) => {
            //    //    self.controller.GetSessionFromLocalDB(id, (session: PanelLeaderModels.Session) => {
            //    //        let selectedScreens: Models.Screen[] = [];
            //    //        let div = document.createElement("div");
            //    //        div.style.width = "810px";
            //    //        for (var i = 0; i < session.ListScreens.length; i++) {
            //    //            let screen = Framework.Factory.CreateFrom(Models.Screen, session.ListScreens[i]);
            //    //            let miniature = screen.RenderAsMiniature(i, 200, self.listDesigns, (x) => {
            //    //                let selected = selectedScreens.filter((x) => { return x.Id == screen.Id; }).length > 0;
            //    //                if (selected == false) {
            //    //                    selectedScreens.push(screen);
            //    //                    miniature.Div.style.border = "1px solid orange";
            //    //                } else {
            //    //                    Framework.Array.Remove(selectedScreens, screen);
            //    //                    miniature.Div.style.border = "";
            //    //                }
            //    //                btnOK.CheckState();
            //    //            });
            //    //            miniature.Div.style.cssFloat = "left";
            //    //            div.appendChild(miniature.Div);
            //    //        }
            //    //        let btnOK = Framework.Form.Button.Create(() => { return selectedScreens.length > 0; }, () => {
            //    //            callback(selectedScreens);
            //    //            modal.Close();
            //    //        }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("OK"));
            //    //        let btnCancel = Framework.Form.Button.Create(() => { return true; }, () => { modal.Close(); }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
            //    //        let modal = Framework.Modal.Show(div, Framework.LocalizationManager.Get("InsertScreenFromAnotherSession"), [btnOK, btnCancel]);
            //    //    });
            //    //});
            //}
            ScenarioViewModel.prototype.getPreviousScreenExperimentalDesign = function () {
                // Plan de présentation de l'écran précédent'
                var previousScreenIndex = Math.max(0, this.selectedScreenIndex - 1);
                var experimentalDesignId = this.miniaturesScreens[previousScreenIndex].Screen.ExperimentalDesignId;
                // Si pas de plan à l'écran précédent, Id du premier plan de présentation
                if (experimentalDesignId == 0) {
                    experimentalDesignId = this.listDesigns.filter(function (x) { return x.Type == "Product"; })[0].Id;
                }
                if (experimentalDesignId == undefined) {
                    experimentalDesignId = 0;
                }
                return experimentalDesignId;
            };
            ScenarioViewModel.prototype.setMiniatures = function () {
                var self = this;
                this.miniaturesDiv.innerHTML = "";
                this.miniaturesScreens = [];
                for (var i = 0; i < self.listScreens.length; i++) {
                    var screen_2 = Framework.Factory.CreateFrom(Models.Screen, self.listScreens[i]);
                    var miniature = screen_2.RenderAsMiniature(i, this.listScreensContainer.clientWidth - 5, this.listDesigns, function (x) {
                        self.OnScreenChanged(x.Screen.Id, true);
                    });
                    this.miniaturesScreens.push(miniature);
                    this.miniaturesDiv.appendChild(miniature.Div);
                }
            };
            ScenarioViewModel.prototype.highlightSelectedScreen = function (selectedScreenId) {
                var self = this;
                this.miniaturesScreens.forEach(function (x) {
                    if (x.Screen.Id == selectedScreenId) {
                        x.Div.style.border = "1px solid gold";
                        x.NumberDiv.style.background = "#F5F6CE";
                    }
                    else {
                        x.Div.style.border = "1px solid gray";
                        x.NumberDiv.style.background = "transparent";
                    }
                });
            };
            ScenarioViewModel.prototype.setGrid = function () {
                $(".screenGrid").remove();
                //let div = this.screenDiv;
                var div = this.activeScreenWrapper;
                //let div = this.activeScreenContainer;
                if (this.designGridIncrement > 0) {
                    //TODO : conserver grille (mettre sur wrapper ?)
                    var scale = this.screenDiv.getBoundingClientRect().width / this.screenDiv.offsetWidth;
                    var width = div.scrollWidth /** scale*/;
                    var height = div.scrollHeight /** scale*/;
                    //let left = div.getBoundingClientRect().left;
                    var left = 0;
                    for (var i = 0; i < width / this.designGridIncrement; i++) {
                        var hr = document.createElement("div");
                        hr.style.width = "1px";
                        hr.style.height = height + "px";
                        hr.style.borderLeft = "1px solid gainsboro";
                        hr.style.position = "absolute";
                        hr.style.top = "0";
                        hr.style.left = (left + (i * this.designGridIncrement)) + "px";
                        hr.classList.add("screenGrid");
                        //this.activeScreenWrapper.appendChild(hr);
                        div.appendChild(hr);
                    }
                    for (var i = 0; i < height / this.designGridIncrement; i++) {
                        var hr = document.createElement("div");
                        hr.style.width = width + "px";
                        hr.style.height = "1px";
                        hr.style.position = "absolute";
                        hr.style.top = (i * this.designGridIncrement) + "px";
                        hr.style.borderTop = "1px solid gainsboro";
                        hr.style.left = "0";
                        hr.classList.add("screenGrid");
                        //this.activeScreenWrapper.appendChild(hr);
                        div.appendChild(hr);
                    }
                }
                this.designGridIncrement -= 20;
                if (this.designGridIncrement < 0) {
                    this.btnToggleGridVisibility.HtmlElement.classList.remove("active");
                    this.designGridIncrement = 60;
                }
                else {
                    this.btnToggleGridVisibility.HtmlElement.classList.add("active");
                }
            };
            ScenarioViewModel.prototype.selectNextControl = function () {
                this.CurrentScreen.Controls.forEach(function (x) {
                    x.RemoveHighlight();
                });
                this.CurrentScreen.Controls[this.selectedControlIndex].Highlight();
                this.selectedControl = this.CurrentScreen.Controls[this.selectedControlIndex];
                this.selectedControlIndex++;
                if (this.selectedControlIndex >= this.CurrentScreen.Controls.length) {
                    this.selectedControlIndex = 0;
                }
                this.btnCopyControl.CheckState();
                this.btnCutControl.CheckState();
                this.btnDeleteControl.CheckState();
                this.btnEditControl.CheckState();
                this.btnPositionControl.CheckState();
            };
            ScenarioViewModel.prototype.saveCurrentScreen = function () {
                if (this.CurrentScreen != undefined && this.selectedScreenIndex != undefined) {
                    this.listScreens[this.selectedScreenIndex] = this.CurrentScreen;
                    this.updateMiniature(this.selectedScreenIndex);
                }
            };
            ScenarioViewModel.prototype.updateMiniature = function (index) {
                var self = this;
                var screen = Framework.Factory.CreateFrom(Models.Screen, this.listScreens[index]);
                var miniature = screen.RenderAsMiniature(index, this.listScreensContainer.clientWidth - 5, this.listDesigns, function (x) {
                    self.OnScreenChanged(x.Screen.Id, true);
                });
                this.miniaturesScreens.splice(index, 1, miniature);
                this.miniaturesDiv.removeChild(this.miniaturesDiv.children[index]);
                this.miniaturesDiv.insertBefore(miniature.Div, this.miniaturesDiv.children[index]);
                this.highlightSelectedScreen(this.CurrentScreen.Id);
            };
            ScenarioViewModel.prototype.OnScreenChanged = function (screenId, saveCurrentScreen) {
                var self = this;
                if (saveCurrentScreen) {
                    this.saveCurrentScreen();
                }
                var activeScreen = this.listScreens.filter(function (x) { return x.Id == screenId; })[0];
                this.CurrentScreen = Framework.Factory.CreateFrom(Models.Screen, activeScreen);
                //    if (self.selectedControl) {
                //        //TODO
                //        //self.screenEditor.SelectedControl.SetLock(self.controller.Session.IsLocked);
                //        //self.screenEditor.SelectedControl.SetStickiness(self.designGridStickiness, self.designGridIncrement);
                //    }
                //}
                var activeScreenHeight = Number(self.activeScreenContainer.style.height.replace("px", ""));
                var activeScreenWidth = activeScreenHeight * Models.Screen.GetRatio(self.listScreens[0]);
                // Affichage écran sélectionné
                var div = Models.Screen.Render(this.CurrentScreen, activeScreenHeight, activeScreenWidth, this.listDesigns, function (control) {
                    self.SetCurrentControl(control);
                });
                // Affichage de la grille, si requis
                //this.onGridChanged();
                div.style.margin = "0";
                this.activeScreenContainer.innerHTML = "";
                this.activeScreenContainer.appendChild(div);
                this.screenDiv = div;
                // Zoom
                self.screenDiv.style.transform = "scale(" + self.scaleFactor + ")";
                // Actualisation des boutons
                this.btnMoveDownScreen.CheckState();
                this.btnMoveUpScreen.CheckState();
                this.btnEditScreenProperties.CheckState();
                var clearControlSelection = function () {
                    self.clearControlsSelection();
                    self.btnCopyControl.CheckState();
                    self.btnCutControl.CheckState();
                    self.btnDeleteControl.CheckState();
                    self.btnEditControl.CheckState();
                    self.btnPositionControl.CheckState();
                    tinymce.remove();
                };
                clearControlSelection();
                // Clic en dehors d'un contrôle : déselection                            
                this.activeScreenContainer.addEventListener(Framework.Events.Click, function (e) {
                    if (e.target.id == "currentScreen") {
                        clearControlSelection();
                    }
                }, false);
                this.highlightSelectedScreen(screenId);
            };
            ScenarioViewModel.prototype.SetCurrentControl = function (control) {
                if (this.isLocked == true) {
                    return;
                    //TODO : désactiver sélection du texte et changement de style
                }
                var self = this;
                self.saveCurrentScreen();
                self.clearControlsSelection();
                self.selectedControl = control;
                self.selectedControl.Highlight();
                if (self.selectedControl._Type == "CustomButton") {
                    self.selectedControl.ScreenIds = self.listScreens.map(function (x) { return x.Id; });
                }
                if (self.selectedControl instanceof ScreenReader.Controls.DataControl) {
                    control.ListExperimentalDesigns = self.listDesigns;
                }
                if (self.selectedControl instanceof ScreenReader.Controls.GroupDescriptionControl) {
                    control.ListControlNames = self.GetListSortingControlNames();
                }
                if (self.selectedControl instanceof ScreenReader.Controls.RandomPrice) {
                    control.ListControlNames = self.GetListDataControlNames();
                }
                //if (self.selectedControl instanceof ScreenReader.Controls.TextArea) {
                //    (<ScreenReader.Controls.TextArea>control).OnChange = () => { self.OnControlPropertyChanged(); }
                //}
                self.btnCopyControl.CheckState();
                self.btnCutControl.CheckState();
                self.btnDeleteControl.CheckState();
                self.btnEditControl.CheckState();
                self.btnPositionControl.CheckState();
                //self.selectedControl.OnFriendlyNameChanged = (oldName: string, newName: string) => {
                //    self.UpdateControlName(self.selectedControl, oldName, newName);
                //};
                self.selectedControl.OnPropertyChanged = function (propertyName, oldValue, newValue) {
                    self.OnControlPropertyChanged(self.selectedControl, propertyName, oldValue, newValue);
                };
                //let f = function convertir(chn: string, p1, decalage, s) {
                //    let r = chn.split(':')[0] + ": " + Math.round(Number(p1) / self.selectedControl.Ratio);
                //    return r;
                //}
                //let setHtmlContent = function (text: string) {
                //    return text.replace(/font-size:\s*(\d+)\s*/g, f);
                //}
                //if (self.selectedControl instanceof ScreenReader.Controls.TextArea) {
                if (self.selectedControl._Type == "TextArea") {
                    self.editor.Set(self.selectedControl.GetHtmlDivElement(), function (text) {
                        //(<ScreenReader.Controls.TextArea>self.selectedControl)._HtmlContent = setHtmlContent(text);
                        self.selectedControl._HtmlContent = text;
                    });
                }
                //else if (self.selectedControl instanceof ScreenReader.Controls.CustomButton) {
                else if (self.selectedControl._Type == "CustomButton") {
                    self.editor.Set(self.selectedControl.HtmlElement, function (text) {
                        self.selectedControl._Content = text;
                    }, true);
                }
                //else if (self.selectedControl instanceof ScreenReader.Controls.BaseQuestionControl) {
                else if (self.selectedControl._Type == "FreeTextQuestionControl" || self.selectedControl._Type == "CheckboxQuestionControl" || self.selectedControl._Type == "ComboboxQuestionControl") {
                    //self.editor.Set((<ScreenReader.Controls.BaseQuestionControl>self.selectedControl).Label.HtmlElement, (text: string) => { (<ScreenReader.Controls.BaseQuestionControl>self.selectedControl)._LabelContent = setHtmlContent(text); });
                    self.editor.Set(self.selectedControl.GetHtmlDivElement(), function (text) {
                        self.selectedControl._LabelContent = text;
                    });
                }
                else {
                    self.editor.Disable();
                }
            };
            ScenarioViewModel.prototype.clearControlsSelection = function () {
                $(".screenContextMenu").remove();
                // Clic remet à 0 la liste des controles sélectionnés, supprime tous les highlights
                var self = this;
                self.selectedControl = undefined;
                self.CurrentScreen.Controls.forEach(function (control) {
                    if (control.RemoveHighlight) {
                        control.RemoveHighlight();
                    }
                });
                if (self.editor) {
                    self.editor.Disable();
                }
            };
            ScenarioViewModel.prototype.addControl = function (control, style) {
                if (style === void 0) { style = true; }
                var self = this;
                this.AddControlToScreen(this.CurrentScreen, control, function (c) {
                    self.SetCurrentControl(control);
                    //TODO : afficher propriétés
                }, style);
                this.controlIds.push(control._FriendlyName);
            };
            ScenarioViewModel.prototype.showControlList = function () {
                var self = this;
                this.controlIds = self.GetListControlNames();
                var container = Framework.Form.TextElement.Create("");
                var controlsDiv = Framework.Form.TextElement.Create("", ["controlsDiv"]);
                container.Append(controlsDiv);
                var optionsDiv = Framework.Form.TextElement.Create("", ["optionsDiv"]);
                container.Append(optionsDiv);
                //let errorDiv = Framework.Form.TextElement.Create("");
                //errorDiv.HtmlElement.style.margin = "20px";
                //container.Append(errorDiv);
                var designs = [];
                var screenDesign = undefined;
                if (this.CurrentScreen.ExperimentalDesignId > 0) {
                    screenDesign = self.listDesigns.filter(function (x) { return x.Id == self.CurrentScreen.ExperimentalDesignId; })[0];
                    if (screenDesign.Type == "Product") {
                        designs = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Attribute');
                    }
                    if (screenDesign.Type == "Attribute") {
                        designs = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Product');
                    }
                }
                var isFormValid = true;
                var setForm = function (control) {
                    control._FriendlyName = Framework.Format.Unique(control._Type + "_1", self.controlIds);
                    modal.SetTitle(Framework.LocalizationManager.Get("Options") + " - " + Framework.LocalizationManager.Get(control._Type));
                    controlsDiv.HtmlElement.innerHTML = "";
                    optionsDiv.HtmlElement.innerHTML = "";
                    control.OnCreationFormClosed = function () {
                        self.addControl(control);
                        modal.Close();
                    };
                    var shouldAddDirectly = true;
                    var creationProperties = control.GetEditableProperties("creation");
                    var validateForm = function () {
                        var validationResult = "";
                        for (var i = 0; i < creationProperties.length; i++) {
                            if (creationProperties[i].IsVisible == true && creationProperties[i].ValidationResult != "") {
                                validationResult += creationProperties[i].ValidationResult + "\n";
                            }
                        }
                        //errorDiv.HtmlElement.classList.remove("alert");
                        //errorDiv.HtmlElement.classList.remove("alert-danger");
                        //errorDiv.HtmlElement.innerHTML = "";
                        if (validationResult.length > 0) {
                            //errorDiv.HtmlElement.classList.add("alert");
                            //errorDiv.HtmlElement.classList.add("alert-danger");
                            //errorDiv.Set(validationResult);
                            isFormValid = false;
                            btnOK.CheckState();
                        }
                        else {
                            isFormValid = true;
                            btnOK.CheckState();
                        }
                    };
                    creationProperties.forEach(function (x) {
                        x.OnCheck = function () {
                            validateForm();
                        };
                        optionsDiv.Append(x.Editor);
                        x.SetPropertyKeyMaxWidth(450);
                        shouldAddDirectly = false;
                    });
                    validateForm();
                    if (shouldAddDirectly == true) {
                        // Pas de contrôle, ajout sans passer par les options
                        self.addControl(control);
                        modal.Close();
                    }
                };
                var control = undefined;
                var btnAddControlButton = Framework.Form.Button.Create(function () { return true; }, function () {
                    control = ScreenReader.Controls.CustomButton.Create();
                    control.SetScreen(self.CurrentScreen);
                    control.ListGroupOfControlFriendlyNames = self.CurrentScreen.Controls.map(function (x) { return x._FriendlyName; });
                    control.ScreenIds = self.listScreens.map(function (x) { return x.Id; });
                    setForm(control);
                }, Framework.LocalizationManager.Get("Button"), ["textButton"]);
                controlsDiv.Append(btnAddControlButton);
                var btnAddControlTextArea = Framework.Form.Button.Create(function () { return true; }, function (e) {
                    //TODO : partout                                       
                    control = ScreenReader.Controls.TextArea.Create();
                    var width = Models.Screen.Width(self.CurrentScreen);
                    control._Width = width * 0.95;
                    control._Left = width * 0.025;
                    setForm(control);
                }, Framework.LocalizationManager.Get("TextArea"), ["textButton"]);
                controlsDiv.Append(btnAddControlTextArea);
                var btnAddControlRectangle = Framework.Form.Button.Create(function () { return true; }, function (e) {
                    control = ScreenReader.Controls.Rectangle.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("Rectangle"), ["textButton"]);
                controlsDiv.Append(btnAddControlRectangle);
                var btnAddControlVideo = Framework.Form.Button.Create(function () { return true; }, function (e) {
                    control = ScreenReader.Controls.CustomMedia.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("VideoPlayer"), ["textButton"]);
                controlsDiv.Append(btnAddControlVideo);
                var btnAddControlImage = Framework.Form.Button.Create(function () { return true; }, function (e) {
                    control = ScreenReader.Controls.CustomImage.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("Picture"), ["textButton"]);
                controlsDiv.Append(btnAddControlImage);
                //let btnAddControlChronometer = Framework.Form.Button.Create(() => { return Models.Screen.HasControlOfType(self.currentScreen, "CustomChronometer") == false; }, (e) => {
                //    control = ScreenReader.Controls.CustomChronometer.Create();
                //    setForm(control);
                //}, Framework.LocalizationManager.Get("Chronometer"), ["textButton"]);
                //controlsDiv.Append(btnAddControlChronometer);
                var btnAddControlVideoRecorder = Framework.Form.Button.Create(function () { return Models.Screen.HasControlOfType(self.CurrentScreen, "VideoRecorder") == false; }, function (e) {
                    control = ScreenReader.Controls.VideoRecorder.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("VideoRecorder"), ["textButton"]);
                controlsDiv.Append(btnAddControlVideoRecorder);
                var btnAddControlPhotoRecorder = Framework.Form.Button.Create(function () { return Models.Screen.HasControlOfType(self.CurrentScreen, "PhotoRecorder") == false; }, function (e) {
                    control = ScreenReader.Controls.PhotoRecorder.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("PhotoRecorder"), ["textButton"]);
                controlsDiv.Append(btnAddControlPhotoRecorder);
                var btnAddRandomPrice = Framework.Form.Button.Create(function () { return self.CurrentScreen.ExperimentalDesignId == 0 && self.listDesigns.filter(function (x) { return x.Type == "Product"; }).length > 0; }, function (e) {
                    control = ScreenReader.Controls.RandomPrice.Create();
                    control.ListExperimentalDesigns = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Product');
                    setForm(control);
                }, Framework.LocalizationManager.Get("BDM"), ["textButton"]);
                controlsDiv.Append(btnAddRandomPrice);
                //let btnAddControlExternalDocument = Framework.Form.Button.Create(() => { return Models.Screen.HasControlOfType(self.CurrentScreen, "ExternalDocument") == false; }, (e) => {
                //    control = ScreenReader.Controls.ExternalDocument.Create();
                //    setForm(control);
                //}, Framework.LocalizationManager.Get("ExternalDocument"), ["textButton"]);
                //controlsDiv.Append(btnAddControlExternalDocument);
                //let btnAddControlTDSTutorial = Framework.Form.Button.Create(() => { return self.CurrentScreen.ExperimentalDesignId == 0 }, (e) => {
                //    control = ScreenReader.Controls.TDSTutorial.Create();
                //    setForm(control);
                //}, Framework.LocalizationManager.Get("TDSTutorial"), ["textButton"]);
                //controlsDiv.Append(btnAddControlTDSTutorial);
                //let btnAddControlBarcodeReader = Framework.Form.Button.Create(() => { return true }, (e) => {
                //    control = ScreenReader.Controls.BarcodeReader.Create();
                //    setForm(control);
                //}, Framework.LocalizationManager.Get("BarcodeReader"), ["textButton"]);
                //controlsDiv.Append(btnAddControlBarcodeReader);
                var btnAddControlButtonList = Framework.Form.Button.Create(function () { return self.CurrentScreen.ExperimentalDesignId > 0; }, function (e) {
                    control = ScreenReader.Controls.DTSButtonsControl.Create();
                    control.ListExperimentalDesigns = designs;
                    setForm(control);
                }, Framework.LocalizationManager.Get("ButtonList"), ["textButton"]);
                controlsDiv.Append(btnAddControlButtonList);
                var btnAddControlContinuousScaleList = Framework.Form.Button.Create(function () { return self.CurrentScreen.ExperimentalDesignId > 0; }, function (e) {
                    control = ScreenReader.Controls.SlidersControl.Create("None", 0, screenDesign.Type, "None");
                    control.ListExperimentalDesigns = designs;
                    //(<SubjectSessionReader.Controls.SlidersControl>control)._EvaluationMode = screenDesign.Type;
                    setForm(control);
                }, Framework.LocalizationManager.Get("ContinuousScalesList"), ["textButton"]);
                controlsDiv.Append(btnAddControlContinuousScaleList);
                //let btnAddControlFreeListOfTerms = Framework.Form.Button.Create(() => { return self.CurrentScreen.ExperimentalDesignId > 0 && self.listDesigns.filter((x) => { return x.Type == "Attribute" }).length > 0 }, (e) => {
                //    control = ScreenReader.Controls.FreeListOfTerms.Create();
                //    (<ScreenReader.Controls.DataControl>control).ListExperimentalDesigns = designs;
                //    setForm(control);
                //}, Framework.LocalizationManager.Get("FreeListOfTerms"), ["textButton"]);
                //controlsDiv.Append(btnAddControlFreeListOfTerms);
                var btnAddControlDiscreteScaleList = Framework.Form.Button.Create(function () { return self.CurrentScreen.ExperimentalDesignId > 0; }, function (e) {
                    control = ScreenReader.Controls.DiscreteScalesControl.Create("None", 0, screenDesign.Type, "None");
                    control.ListExperimentalDesigns = designs;
                    //(<SubjectSessionReader.Controls.DiscreteScalesControl>control)._EvaluationMode = screenDesign.Type;
                    setForm(control);
                }, Framework.LocalizationManager.Get("DiscreteScalesList"), ["textButton"]);
                controlsDiv.Append(btnAddControlDiscreteScaleList);
                var btnAddControlCheckboxList = Framework.Form.Button.Create(function () { return self.CurrentScreen.ExperimentalDesignId > 0; }, function (e) {
                    control = ScreenReader.Controls.CATAControl.Create();
                    control.ListExperimentalDesigns = designs;
                    setForm(control);
                }, Framework.LocalizationManager.Get("CheckboxList"), ["textButton"]);
                controlsDiv.Append(btnAddControlCheckboxList);
                var btnAddControlSorting = Framework.Form.Button.Create(function () { return self.CurrentScreen.ExperimentalDesignId == 0 && self.listDesigns.filter(function (x) { return x.Type == "Attribute"; }).length > 0; }, function (e) {
                    control = ScreenReader.Controls.SortingControl.Create();
                    control.ListExperimentalDesigns = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Product');
                    setForm(control);
                }, Framework.LocalizationManager.Get("SortingControl"), ["textButton"]);
                controlsDiv.Append(btnAddControlSorting);
                var btnAddControlGroupDescription = Framework.Form.Button.Create(function () {
                    return self.CurrentScreen.ExperimentalDesignId == 0 && self.GetListSortingControlNames().length > 0;
                }, function (e) {
                    control = ScreenReader.Controls.GroupDescriptionControl.Create();
                    control.ListControlNames = self.GetListSortingControlNames();
                    control.ListExperimentalDesigns = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Attribute');
                    setForm(control);
                }, Framework.LocalizationManager.Get("GroupDescriptionControl"), ["textButton"]);
                controlsDiv.Append(btnAddControlGroupDescription);
                //let btnAddControlNapping = Framework.Form.Button.Create(() => { return self.CurrentScreen.ExperimentalDesignId == 0 && self.listDesigns.filter((x) => { return x.Type == "Product" }).length > 0 }, (e) => {
                //    control = ScreenReader.Controls.NappingControl.Create();
                //    (<ScreenReader.Controls.DataControl>control).ListExperimentalDesigns = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Product');
                //    setForm(control);
                //}, Framework.LocalizationManager.Get("NappingControl"), ["textButton"]);
                //controlsDiv.Append(btnAddControlNapping);
                var btnAddControlRanking = Framework.Form.Button.Create(function () { return self.CurrentScreen.ExperimentalDesignId == 0 && self.listDesigns.filter(function (x) { return x.Type == "Product"; }).length > 0; }, function (e) {
                    control = ScreenReader.Controls.RankingControl.Create();
                    control.ListExperimentalDesigns = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Product');
                    setForm(control);
                }, Framework.LocalizationManager.Get("RankingControl"), ["textButton"]);
                controlsDiv.Append(btnAddControlRanking);
                //let btnAddControlDiscrimination = Framework.Form.Button.Create(() => {
                //    return (screenDesign && (screenDesign.PresentationMode == "Triangle" || screenDesign.PresentationMode == "Pair" || screenDesign.PresentationMode == "Tetrad" || screenDesign.PresentationMode == "TwoOutOfFive"));
                //}, (e) => {
                //    control = ScreenReader.Controls.DiscriminationTestControl.Create(screenDesign);
                //    (<ScreenReader.Controls.DataControl>control).ListExperimentalDesigns = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Product').filter((x) => { return x.PresentationMode != "Single" });
                //    setForm(control);
                //}, Framework.LocalizationManager.Get("DiscriminationControl"), ["textButton"]);
                //controlsDiv.Append(btnAddControlDiscrimination);
                //TODO
                //let btnAddControlFeedback = Framework.Form.Button.Create(() => {
                //    return true; //TODO : tester datacontrol avant
                //}, (e) => {
                //    control = ScreenReader.Controls.SubjectSummary.Create();
                //    setForm(control);
                //}, Framework.LocalizationManager.Get("Feedback"), ["textButton"]);
                //controlsDiv.Append(btnAddControlFeedback);
                //    { css: "addSubjectForm", title: "AddSubjectForm", parameter: "SubjectForm", enabled: enabledIfSingleScreen },               
                //    { css: "addCheckboxQuestion", title: "AddCheckboxQuestion", parameter: "CheckboxQuestion", enabled: true },
                //    { css: "addComboboxQuestion", title: "AddComboboxQuestion", parameter: "ComboboxQuestion", enabled: true },
                //    { css: "addFreeTextQuestion", title: "AddFreeTextQuestion", parameter: "FreeTextQuestion", enabled: true },
                //    { css: "addAnchor", title: "AddAnchor", parameter: "Anchor", enabled: enabledIfSingleScreen },
                //    { css: "addQuestionTable", title: "AddQuestionTable", parameter: "QuestionTable", enabled: true },
                //TODO
                //let btnAddInteractiveWheelButton = Framework.Form.ButtonWithIconAndText.Create(() => { return true; }, (e) => {
                //    control = ScreenReader.Controls.InteractiveWheel.Create();
                //    setForm(control);
                //}, Framework.LocalizationManager.Get("InteractiveWheel"), ["addControlDiv"], ["addControlButton", "addInteractiveWheel"], ["addControlLabel"], Framework.LocalizationManager.Get("AddInteractiveWheelTooltip"));
                //controlsDiv.Append(btnAddInteractiveWheelButton);
                var btnAddFreeTextQuestionButton = Framework.Form.Button.Create(function () { return true; }, function (e) {
                    control = ScreenReader.Controls.FreeTextQuestionControl.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("FreeTextQuestion"), ["textButton"]);
                controlsDiv.Append(btnAddFreeTextQuestionButton);
                var btnAddCheckboxQuestionButton = Framework.Form.Button.Create(function () { return true; }, function (e) {
                    control = ScreenReader.Controls.CheckboxQuestionControl.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("CheckboxQuestion"), ["textButton"]);
                controlsDiv.Append(btnAddCheckboxQuestionButton);
                var btnAddComboboxQuestionButton = Framework.Form.Button.Create(function () { return true; }, function (e) {
                    control = ScreenReader.Controls.ComboboxQuestionControl.Create();
                    control.ListExperimentalDesigns = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Attribute');
                    setForm(control);
                }, Framework.LocalizationManager.Get("ComboboxQuestion"), ["textButton"]);
                controlsDiv.Append(btnAddComboboxQuestionButton);
                //let btnAddSampleCodeInput = Framework.Form.Button.Create(() => { return self.CurrentScreen.ExperimentalDesignId > 0; }, (e) => {
                //    control = ScreenReader.Controls.SampleCodeInput.Create();
                //    (<ScreenReader.Controls.SampleCodeInput>control).ExperimentalDesign = screenDesign;
                //    setForm(control);
                //}, Framework.LocalizationManager.Get("SampleCodeInput"), ["textButton"]);
                //controlsDiv.Append(btnAddSampleCodeInput);
                //let btnAddSampleCodeChecker = Framework.Form.Button.Create(() => { return self.CurrentScreen.ExperimentalDesignId > 0; }, (e) => {
                //    control = ScreenReader.Controls.SampleCodeChecker.Create();
                //    (<ScreenReader.Controls.SampleCodeChecker>control).ExperimentalDesign = screenDesign;
                //    setForm(control);
                //}, Framework.LocalizationManager.Get("SampleCodeChecker"), ["textButton"]);
                //controlsDiv.Append(btnAddSampleCodeChecker);
                var btnCancel = Framework.Form.Button.Create(function () { return true; }, function () {
                    modal.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                var btnOK = Framework.Form.Button.Create(function () {
                    return isFormValid == true;
                }, function () {
                    self.addControl(control);
                    modal.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("OK"));
                //let modal: Framework.Modal.Modal = Framework.Modal.Custom(container.HtmlElement, Framework.LocalizationManager.Get("NewControl"), [btnCancel, btnOK], "580px", "800px", true, true, false);
                var modal = Framework.Modal.Custom(container.HtmlElement, Framework.LocalizationManager.Get("NewControl"), [btnCancel, btnOK], "580px", "800px", false, true, false);
            };
            ScenarioViewModel.prototype.OnLockChanged = function (isLocked) {
                this.isLocked = isLocked;
                this.btnSimulateSession.CheckState();
                this.btnSelectNextControl.CheckState();
                this.btnInsertScreen.CheckState();
                this.btnSetScreenStyle.CheckState();
                this.btnZoomIn.CheckState();
                this.btnZoomOut.CheckState();
                this.btnToggleGridVisibility.CheckState();
                this.btnPasteControl.CheckState();
                this.btnCopyControl.CheckState();
                this.btnEditControl.CheckState();
                this.btnCutControl.CheckState();
                this.btnDeleteControl.CheckState();
                this.btnMoveUpScreen.CheckState();
                this.btnMoveDownScreen.CheckState();
                this.btnDeleteScreen.CheckState();
                this.btnCopyScreen.CheckState();
                //this.btnSaveScreenAsPicture.CheckState();
                this.btnEditScreenProperties.CheckState();
                this.btnAddControl.CheckState();
                this.btnPositionControl.CheckState();
                if (isLocked == true) {
                    this.activeScreenWrapper.classList.add("disabledScreen");
                }
                else {
                    this.activeScreenWrapper.classList.remove("disabledScreen");
                }
            };
            return ScenarioViewModel;
        }(PanelLeaderViewModel));
        ViewModels.ScenarioViewModel = ScenarioViewModel;
        var MonitoringViewModel = /** @class */ (function (_super) {
            __extends(MonitoringViewModel, _super);
            function MonitoringViewModel(listProgress) {
                var _this = _super.call(this) || this;
                _this.isOnline = true;
                var self = _this;
                _this.isRefreshing = false;
                _this.divMonitoringTable = Framework.Form.TextElement.Register("divMonitoringTable");
                _this.btnPrintMemo = Framework.Form.Button.Register("btnPrintMemo", function () { return true; }, function (e) {
                    self.PrintMemo();
                }, Framework.LocalizationManager.Get("PrintMemo"));
                //this.btnPrintSession = Framework.Form.Button.Register("btnPrintSession", () => { return self.isOnline == true && self.checkSelection(); }, (e) => {
                //    let urls = self.TableMonitoring.SelectedData.map((x) => { return x.URL });
                //    urls.forEach((x) => {
                //        Framework.Browser.OpenNew(PanelLeaderModels.MonitoringProgress.GetEncryptedURL(x + "&screenshot=true"));
                //    });
                //}, Framework.LocalizationManager.Get("PrintSession"));
                _this.btnMail = Framework.Form.Button.Register("btnMail", function () {
                    return self.isOnline == true && self.checkSelection(); //TODO : actualiser
                }, function () {
                    //self.ShowModalSendMail(self.recipients, () => { self.dataTableMonitoring.Refresh(); });
                    self.ShowModalSendMail(self.recipients, function (monitoringProgresses) {
                        self.TableMonitoring.Refresh(monitoringProgresses);
                    });
                }, Framework.LocalizationManager.Get("SendMailToSelectedPanelists"));
                _this.btnResetProgress = Framework.Form.Button.Register("btnResetProgress", function () {
                    return self.isOnline == true && self.checkSelection();
                }, function () {
                    self.ResetUserProgress(self.TableMonitoring.SelectedData.map(function (a) { return a.SubjectCode; }), true, function (monitoringProgress) {
                        self.setDataTable(monitoringProgress);
                    });
                }, Framework.LocalizationManager.Get("UpdateProgress"));
                _this.btnRefreshMonitoring = Framework.Form.Button.Register("btnRefreshMonitoring", function () {
                    //TODO séance non expirée
                    return self.isOnline == true && self.isRefreshing == false;
                }, function () {
                    self.isRefreshing = true;
                    self.btnRefreshMonitoring.CheckState();
                    self.RefreshMonitoring(function (monitoringProgress) {
                        self.setDataTable(monitoringProgress);
                        self.isRefreshing = false;
                        self.btnRefreshMonitoring.CheckState();
                    }, function (error) {
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("ErrorWhileDownloadingProgress"));
                        self.isRefreshing = false;
                        self.btnRefreshMonitoring.CheckState();
                    });
                }, Framework.LocalizationManager.Get("Refresh"));
                _this.btnImportZipFromOfflineMode = Framework.Form.Button.Register("btnImportZipFromOfflineMode", function () {
                    return true;
                }, function () {
                    Framework.FileHelper.BrowseFile(".xml", function (file) {
                        var fileReader = new FileReader();
                        fileReader.onload = function (e) {
                            if (!e) {
                                var data = fileReader.content;
                            }
                            else {
                                var data = e.target.result;
                            }
                            var decrypted = atob(data);
                            var obj = Framework.Serialization.JsonToInstance(new Models.LocalSessionProgress(), decrypted);
                            self.UpdateData(obj.Progress.ListData);
                        };
                        fileReader.readAsBinaryString(file);
                    });
                }, Framework.LocalizationManager.Get("ImportZipFromOfflineMode"));
                //this.btnExportAsZipForOfflineMode = Framework.Form.Button.Register("btnExportAsZipForOfflineMode", () => {
                //    return true;
                //}, () => {
                //    //TODO;
                //    alert("Not implemented");
                //}, Framework.LocalizationManager.Get("ExportAsZipForOfflineMode"));
                _this.setDataTable(listProgress);
                return _this;
                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});
            }
            MonitoringViewModel.prototype.checkSelection = function () {
                //return this.dataTableMonitoring && this.dataTableMonitoring.SelectedData.length > 0;
                return this.TableMonitoring && this.TableMonitoring.SelectedData.length > 0;
            };
            MonitoringViewModel.prototype.OnConnectivityChanged = function (isOnline) {
                this.isOnline = isOnline;
            };
            MonitoringViewModel.prototype.setDataTable = function (listProgress) {
                var self = this;
                this.TableMonitoring = new Framework.Form.Table();
                this.TableMonitoring.ListColumns = [];
                var col1 = new Framework.Form.TableColumn();
                col1.Name = "SubjectCode";
                col1.Title = Framework.LocalizationManager.Get("Code");
                col1.Editable = false;
                col1.MinWidth = 100;
                this.TableMonitoring.ListColumns.push(col1);
                //let col2 = new Framework.Form.TableColumn();
                //col2.Name = "FirstName";
                //col2.Title = Framework.LocalizationManager.Get("FirstName");
                //col2.Editable = false;
                //col2.MinWidth = 110;
                //this.TableMonitoring.ListColumns.push(col2);
                //let col3 = new Framework.Form.TableColumn();
                //col3.Name = "LastName";
                //col3.Title = Framework.LocalizationManager.Get("LastName");
                //col3.Editable = false;
                //col3.MinWidth = 110;
                //this.TableMonitoring.ListColumns.push(col3);
                var col4 = new Framework.Form.TableColumn();
                col4.Name = "Mail";
                col4.Title = Framework.LocalizationManager.Get("Email");
                col4.Validator = Framework.Form.Validator.Mail();
                this.TableMonitoring.ListColumns.push(col4);
                var col5 = new Framework.Form.TableColumn();
                col5.Name = "LastAccess";
                col5.Title = Framework.LocalizationManager.Get("LastAccess");
                col5.Editable = false;
                col5.MinWidth = 200;
                this.TableMonitoring.ListColumns.push(col5);
                var col6 = new Framework.Form.TableColumn();
                col6.Name = "Progress";
                col6.Title = Framework.LocalizationManager.Get("Progress");
                col6.Editable = false;
                col6.MinWidth = 150;
                this.TableMonitoring.ListColumns.push(col6);
                var col6b = new Framework.Form.TableColumn();
                col6b.Name = "Products";
                col6b.Title = Framework.LocalizationManager.Get("Products");
                col6b.Editable = false;
                col6b.MinWidth = 150;
                this.TableMonitoring.ListColumns.push(col6b);
                var col7 = new Framework.Form.TableColumn();
                col7.Name = "MailStatus";
                col7.Title = Framework.LocalizationManager.Get("MailStatus");
                col7.Editable = false;
                col7.MinWidth = 350;
                this.TableMonitoring.ListColumns.push(col7);
                var col8 = new Framework.Form.TableColumn();
                col8.Name = "URL";
                col8.Title = Framework.LocalizationManager.Get("URL");
                col8.Editable = false;
                col8.Filterable = false;
                col8.Sortable = false;
                col8.MinWidth = 100;
                col8.RenderFunction = function (val) {
                    return "<a href='" + PanelLeaderModels.MonitoringProgress.GetEncryptedURL(val) + "' target='_blank' title='" + Framework.LocalizationManager.Get("StartSessionAsPanelist") + "'><i class='fa fa-user' aria-hidden='true'></i></a> <a href='" + PanelLeaderModels.MonitoringProgress.GetEncryptedURL(val + "&panelleader=true") + "' target='_blank'  title='" + Framework.LocalizationManager.Get("StartSessionAsPanelLeader") + "'><i class='fa fa-user-secret' aria-hidden='true'></i></a>";
                    //< a href = '" + val + "&screenshot=true' target = '_blank'  title = '" + Framework.LocalizationManager.Get("SaveScreenshot") + "' > <i class='fas fa-camera' > </i</a > ";
                };
                this.TableMonitoring.ListColumns.push(col8);
                //{
                //    data: "URL", title: Framework.LocalizationManager.Get("URL"), render: function (data, type, row) {
                //        if (type === 'display') {
                //            if (data == undefined) {
                //                return Framework.LocalizationManager.Get("NotDeployed");
                //            }
                //            return "<a href='" + data + "' target='_blank' title='" + Framework.LocalizationManager.Get("StartSessionAsPanelist") + "'><i class='fa fa-user' aria-hidden='true'></i></a> <a href='" + data + "&panelleader=true' target='_blank'  title='" + Framework.LocalizationManager.Get("StartSessionAsPanelLeader") + "'><i class='fa fa-user-secret' aria-hidden='true'></i></a> <a href='" + data + "&screenshot=true' target='_blank'  title='" + Framework.LocalizationManager.Get("SaveScreenshot") + "'><i class='fas fa-camera'></i</a>";
                //        }
                //        return "";
                //    }
                //}
                this.TableMonitoring.Height = ($('#divMonitoringActions').offset().top - $('#divMonitoringTable').offset().top - 120) + "px";
                this.TableMonitoring.ListData = listProgress;
                this.TableMonitoring.OnSelectionChanged = function (selection) {
                    self.recipients = selection.map(function (x) { return x.SubjectCode; });
                    self.btnMail.CheckState();
                    self.btnResetProgress.CheckState();
                    //self.btnPrintSession.CheckState();
                    //self.btnExportAsZipForOfflineMode.CheckState();
                };
                this.TableMonitoring.OnDataUpdated = function (progress, propertyName, oldValue, newValue) {
                    //TOCHECK
                    if (propertyName == "Mail") {
                        self.UpdateMail(progress.SubjectCode, progress.Mail);
                    }
                };
                this.TableMonitoring.Render(this.divMonitoringTable.HtmlElement);
                //Framework.Form.DataTable.AppendToDiv(Framework.LocalizationManager.Get("SubjectsProgress"), "78vh", this.divMonitoringTable.HtmlElement, monitoringDataTableParameters,
                //    (table) => {
                //        self.dataTableMonitoring = table;
                //        if (self.OnDataTableLoaded) {
                //            self.OnDataTableLoaded(table);
                //        }
                //    },
                //    (sel: PanelLeaderModels.MonitoringProgress[]) => {
                //        self.recipients = sel.map((x) => { return x.SubjectCode; });
                //        self.btnMail.CheckState();
                //        self.btnResetProgress.CheckState();
                //        self.btnExportAsZipForOfflineMode.CheckState();
                //    }
                //);
            };
            MonitoringViewModel.prototype.SetLock = function (isLocked) {
                this.isLocked = true;
                this.btnPrintMemo.CheckState();
                this.btnMail.CheckState();
                this.btnResetProgress.CheckState();
                this.btnRefreshMonitoring.CheckState();
                //this.btnImportZipFromOfflineMode.CheckState();
                //this.btnExportAsZipForOfflineMode.CheckState();
                if (this.isLocked == true) {
                    this.TableMonitoring.Disable();
                }
                else {
                    this.TableMonitoring.Enable();
                }
            };
            return MonitoringViewModel;
        }(PanelLeaderViewModel));
        ViewModels.MonitoringViewModel = MonitoringViewModel;
        var ModalResetProgressViewModel = /** @class */ (function (_super) {
            __extends(ModalResetProgressViewModel, _super);
            function ModalResetProgressViewModel() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.isOnline = true;
                return _this;
            }
            ModalResetProgressViewModel.prototype.OnConnectivityChanged = function (isOnline) {
                this.isOnline = isOnline;
            };
            ModalResetProgressViewModel.Show = function (callback) {
                var self = this;
                //TODO : mettre ça dans HTML ? 
                var div = document.createElement("div");
                var cb1 = Framework.Form.CheckBox.Create(function () { return true; }, function () { }, Framework.LocalizationManager.Get("ResetProgress"), "", false, ["blockForm"]);
                div.appendChild(cb1.HtmlElement);
                var cb2 = Framework.Form.CheckBox.Create(function () { return true; }, function () { }, Framework.LocalizationManager.Get("ResetMinTimeBetween2Connections"), "", false, ["blockForm"]);
                div.appendChild(cb2.HtmlElement);
                var btnOK = Framework.Form.Button.Create(function () {
                    //TODO return self.isOnLine == true;
                    return true;
                }, function () {
                    callback(cb1.IsChecked, cb2.IsChecked);
                    mw.Close();
                }, Framework.LocalizationManager.Get("OK"), ["btnCircle"]);
                var mw = Framework.Modal.Confirm(Framework.LocalizationManager.Get("UpdateProgress"), div, function () {
                    callback(cb1.IsChecked, cb2.IsChecked);
                });
                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});
            };
            return ModalResetProgressViewModel;
        }(PanelLeaderViewModel));
        ViewModels.ModalResetProgressViewModel = ModalResetProgressViewModel;
        var ModalSimulationViewModel = /** @class */ (function (_super) {
            __extends(ModalSimulationViewModel, _super);
            function ModalSimulationViewModel(mw, subjectSession, currentScreenId, isInTest) {
                var _this = _super.call(this, mw) || this;
                var self = _this;
                _this.currentScreenId = currentScreenId;
                _this.subjectSession = subjectSession;
                _this.readerState = new ScreenReader.State();
                _this.readerState.IsInSimulation = true;
                _this.readerState.IsPanelLeader = false;
                _this.readerActions = new ScreenReader.Actions();
                _this.readerActions.OnLastScreen = function () {
                    mw.Close();
                };
                _this.readerActions.OnNavigation = function (url) {
                    //TODO
                };
                _this.readerActions.OnValidationError = function (message) {
                    //TODO
                    if (isInTest == false) {
                        alert(message);
                    }
                };
                _this.readerActions.OnError = function (error) {
                    //TODO
                    //if (self.IsInTest == false) {
                    //    self.ShowModalBox(Localization.Localize("Error"), error);
                    //}
                };
                _this.readerActions.OnNotification = function (message) {
                    //self.ShowModalBox(Localization.Localize("Tip"), message);
                };
                _this.readerActions.OnBase64StringUpload = function (base64string, filename) {
                    //TODO
                };
                _this.readerActions.OnRScriptStarted = function (rScript, success, error) {
                    //TODO : message si offline
                };
                _this.readerActions.OnSave = function (blob, filename) {
                    //saveAs(blob, filename);
                };
                _this.readerActions.OnClose = function () {
                    mw.Close();
                };
                _this.readerActions.OnDataChanged = function (data) {
                    var txt = "";
                    if (data.Type != undefined) {
                        txt += Framework.LocalizationManager.Get("Type") + ": " + data.Type + "<br/>";
                    }
                    txt += Framework.LocalizationManager.Get("Subject") + ": " + data.SubjectCode + "<br/>";
                    if (data.ProductCode != undefined) {
                        txt += Framework.LocalizationManager.Get("Product") + ": " + data.ProductCode + "<br/>";
                    }
                    if (data.Replicate != undefined) {
                        txt += Framework.LocalizationManager.Get("Replicate") + ": " + data.Replicate + "<br/>";
                    }
                    if (data.Intake != undefined) {
                        txt += Framework.LocalizationManager.Get("Intake") + ": " + data.Intake + "<br/>";
                    }
                    if (data.AttributeCode != undefined) {
                        txt += Framework.LocalizationManager.Get("Attribute") + ": " + data.AttributeCode + "<br/>";
                    }
                    if (data.Score != undefined) {
                        txt += Framework.LocalizationManager.Get("Score") + ": " + data.Score + "<br/>";
                    }
                    if (data.Time != undefined) {
                        txt += Framework.LocalizationManager.Get("Time") + ": " + data.Time + "<br/>";
                    }
                    if (data.QuestionLabel != undefined) {
                        txt += Framework.LocalizationManager.Get("Question") + ": " + data.QuestionLabel + "<br/>";
                    }
                    if (data.Description != undefined) {
                        txt += Framework.LocalizationManager.Get("Description") + ": " + data.Description + "<br/>";
                    }
                    if (data.Group != undefined) {
                        txt += Framework.LocalizationManager.Get("Group") + ": " + data.Group + "<br/>";
                    }
                    if (data.X != undefined) {
                        txt += "X: " + data.X + "<br/>";
                    }
                    if (data.Y != undefined) {
                        txt += "Y: " + data.Y + "<br/>";
                    }
                    if (_this.btnInfo) {
                        _this.btnInfo.HighlightOn(txt, 'top');
                    }
                };
                return _this;
                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});
            }
            Object.defineProperty(ModalSimulationViewModel.prototype, "Reader", {
                get: function () {
                    return this.reader;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSimulationViewModel.prototype, "SubjectSession", {
                get: function () {
                    return this.subjectSession;
                },
                enumerable: false,
                configurable: true
            });
            ModalSimulationViewModel.prototype.Start = function () {
                var _this = this;
                var self = this;
                ScreenReader.Reader.Initialize(this.subjectSession, this.mw.Body, this.readerActions, this.readerState, function (reader) {
                    self.reader = reader;
                    if (self.OnScreenChanged) {
                        reader.OnScreenChanged = self.OnScreenChanged;
                    }
                    var index = reader.GetIndexOfScreenId(_this.currentScreenId);
                    reader.SetSubjectScreen(index, false, self.mw.Body.clientHeight, self.mw.Body.clientWidth);
                    self.mw.Body.classList.add("noMaxHeight");
                    var btnGoToFirstScreen = Framework.Form.Button.Create(function () { return true; }, function () {
                        reader.GoToFirstScreenAsPanelLeader();
                        self.btnInfo.HighlightOn(Framework.LocalizationManager.Get("Screen") + " " + (self.subjectSession.Progress.CurrentState.CurrentScreen + 1), 'top');
                    }, '<i class="fas fa-fast-backward"></i>', ["btnCircle"], Framework.LocalizationManager.Get("GoToFirstScreenTooltip"));
                    btnGoToFirstScreen.HtmlElement.style.cssFloat = "left";
                    var btnGoToPreviousScreen = Framework.Form.Button.Create(function () { return true; }, function () {
                        reader.GoToPreviousScreenAsPanelLeader();
                        self.btnInfo.HighlightOn(Framework.LocalizationManager.Get("Screen") + " " + (self.subjectSession.Progress.CurrentState.CurrentScreen + 1), 'top');
                    }, '<i class="fas fa-step-backward"></i>', ["btnCircle"], Framework.LocalizationManager.Get("GoToPreviousScreenTooltip"));
                    btnGoToPreviousScreen.HtmlElement.style.cssFloat = "left";
                    var btnGoToNextScreen = Framework.Form.Button.Create(function () { return true; }, function () {
                        reader.GoToNextScreenAsPanelLeader();
                        self.btnInfo.HighlightOn(Framework.LocalizationManager.Get("Screen") + " " + (self.subjectSession.Progress.CurrentState.CurrentScreen + 1), 'top');
                    }, '<i class="fas fa-step-forward"></i>', ["btnCircle"], Framework.LocalizationManager.Get("GoToNextScreenTooltip"));
                    btnGoToNextScreen.HtmlElement.style.cssFloat = "left";
                    var btnGoToLastScreen = Framework.Form.Button.Create(function () { return true; }, function () {
                        reader.GoToLastScreenAsPanelLeader();
                        self.btnInfo.HighlightOn(Framework.LocalizationManager.Get("Screen") + " " + (self.subjectSession.Progress.CurrentState.CurrentScreen + 1), 'top');
                    }, '<i class="fas fa-fast-forward"></i>', ["btnCircle"], Framework.LocalizationManager.Get("GoToLastScreenTooltip"));
                    btnGoToLastScreen.HtmlElement.style.cssFloat = "left";
                    //let btnSubject = Framework.Form.Button.Create(() => { return true; }, () => {
                    //    //TODO
                    //    reader.ChangeSubject("");
                    //}, '<i class="fas fa-users"></i>', ["btnCircle"], Framework.LocalizationManager.Get("ChnageSubject"));
                    var btnExit = Framework.Form.Button.Create(function () { return true; }, function () {
                        if (self.readerState.IsInSimulation == true) {
                            // Suppression des lignes de plans de présentation créés à la volée
                            self.subjectSession.ListExperimentalDesigns
                                .filter(function (x) { return x.CanAddItem == true; })
                                .forEach(function (x) {
                                x.ListExperimentalDesignRows = [];
                            });
                        }
                        self.mw.Close();
                    }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Exit"));
                    //TODO : améliorer design
                    self.btnInfo = Framework.Form.Button.Create(function () { return true; }, function () {
                        self.btnInfo.HighlightOn(Framework.LocalizationManager.Get("Screen") + " " + (self.subjectSession.Progress.CurrentState.CurrentScreen + 1), 'top');
                    }, '<i class="fas fa-info"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Progress"));
                    self.btnInfo.HtmlElement.style.cssFloat = "left";
                    //self.btnInfo.HtmlElement.style.background = "transparent";
                    //self.btnInfo.HtmlElement.style.border = "0";
                    //self.btnInfo.HtmlElement.style.color = "transparent";
                    //self.btnInfo.HtmlElement.style.marginRight = ((self.mw.Width / 2) - 48) + "px";
                    self.mw.AddButton(self.btnInfo); /*self.btnInfo.Disable();*/
                    self.mw.AddButton(btnGoToFirstScreen);
                    self.mw.AddButton(btnGoToPreviousScreen);
                    self.mw.AddButton(btnGoToNextScreen);
                    self.mw.AddButton(btnGoToLastScreen);
                    //mw.AddButton(btnSubject);
                    self.mw.AddButton(btnExit);
                });
            };
            return ModalSimulationViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalSimulationViewModel = ModalSimulationViewModel;
        var ModalLoginViewModel = /** @class */ (function (_super) {
            __extends(ModalLoginViewModel, _super);
            function ModalLoginViewModel(mw, login, password) {
                var _this = _super.call(this, mw) || this;
                _this.isOnline = true;
                var self = _this;
                _this.inputLoginId = Framework.Form.InputText.Register("inputLoginId", "", Framework.Form.Validator.MinLength(4), function () {
                    self.btnLogin.CheckState();
                }, true);
                _this.inputLoginPassword = Framework.Form.InputText.Register("inputLoginPassword", "", Framework.Form.Validator.MinLength(4), function () {
                    self.btnLogin.CheckState();
                }, true);
                _this.divLoginError = Framework.Form.TextElement.Register("divLoginError");
                _this.btnLogin = Framework.Form.Button.Create(function () {
                    return self.isOnline == true && self.inputLoginId.IsValid && self.inputLoginPassword.IsValid;
                }, function () {
                    self.Login(self.inputLoginId.Value, self.inputLoginPassword.Value, function () { self.mw.Close(); }, function (e) {
                        self.divLoginError.SetHtml(e);
                        self.divLoginError.Show();
                    });
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Login"));
                _this.inputLoginId.Set(login);
                _this.inputLoginPassword.Set(password);
                _this.mw.AddButton(_this.btnLogin);
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 13, function () { self.btnLogin.Click(); });
                return _this;
            }
            ModalLoginViewModel.prototype.OnConnectivityChanged = function (isOnline) {
                this.isOnline = isOnline;
            };
            Object.defineProperty(ModalLoginViewModel.prototype, "InputLoginId", {
                get: function () { return this.inputLoginId; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalLoginViewModel.prototype, "InputLoginPassword", {
                get: function () { return this.inputLoginPassword; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalLoginViewModel.prototype, "DivLoginError", {
                get: function () { return this.divLoginError; },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalLoginViewModel.prototype, "BtnLogin", {
                get: function () { return this.btnLogin; },
                enumerable: false,
                configurable: true
            });
            ModalLoginViewModel.prototype.OnError = function (error) {
                this.divLoginError.Set(error);
                this.divLoginError.Show();
            };
            return ModalLoginViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalLoginViewModel = ModalLoginViewModel;
        var ModalSessionWizardViewModel = /** @class */ (function (_super) {
            __extends(ModalSessionWizardViewModel, _super);
            function ModalSessionWizardViewModel(mw) {
                var _this = _super.call(this, mw) || this;
                _this.cards = [];
                _this.selectedTemplate = new PanelLeaderModels.TemplatedSession("", "", "", [], []);
                var self = _this;
                _this.divModel = Framework.Form.TextElement.Register("divModel");
                _this.divModelContent = Framework.Form.TextElement.Register("divModelContent");
                _this.divProtocol = Framework.Form.TextElement.Register("divProtocol");
                _this.divProtocolContent = Framework.Form.TextElement.Register("divProtocolContent");
                _this.divScreens = Framework.Form.TextElement.Register("divScreens");
                _this.divScreensContent = Framework.Form.TextElement.Register("divScreensContent");
                _this.divCommonScreenOptions = Framework.Form.TextElement.Register("divCommonScreenOptions");
                _this.divScreenList = Framework.Form.TextElement.Register("wizardScreenList");
                _this.divScreenSelection = Framework.Form.TextElement.Register("divScreenSelection");
                _this.btnSessionWizardTemplate = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    self.showDivModel();
                }, "", ["btnCircle"]);
                _this.btnSessionWizardProtocol = Framework.Form.Button.Create(function () {
                    return self.selectedTemplate.Id != "";
                }, function () {
                    self.showDivProtocol();
                }, "", ["btnCircle"]);
                _this.btnSessionWizardScreens = Framework.Form.Button.Create(function () {
                    var res = self.selectedTemplate.NbSubjects > 0;
                    self.selectedTemplate.ListExperimentalDesigns.forEach(function (x) {
                        res = res && x.ListItems.length > 0;
                    });
                    return res;
                }, function () {
                    self.showDivScreens();
                }, "", ["btnCircle"]);
                _this.btnSessionWizardComplete = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    self.CreateNewSessionFromTemplate(self.selectedTemplate);
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Complete"));
                _this.hideDivAndButtons();
                _this.showDivModel();
                _this.mw.AddButton(_this.btnSessionWizardTemplate);
                _this.mw.AddButton(_this.btnSessionWizardProtocol);
                _this.mw.AddButton(_this.btnSessionWizardScreens);
                _this.mw.AddButton(_this.btnSessionWizardComplete);
                return _this;
                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});
            }
            Object.defineProperty(ModalSessionWizardViewModel.prototype, "BtnSessionWizardTemplate", {
                get: function () {
                    return this.btnSessionWizardTemplate;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSessionWizardViewModel.prototype, "BtnSessionWizardProtocol", {
                get: function () {
                    return this.btnSessionWizardProtocol;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSessionWizardViewModel.prototype, "BtnSessionWizardScreens", {
                get: function () {
                    return this.btnSessionWizardScreens;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSessionWizardViewModel.prototype, "BtnSessionWizardComplete", {
                get: function () {
                    return this.btnSessionWizardComplete;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSessionWizardViewModel.prototype, "Cards", {
                get: function () {
                    return this.cards;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSessionWizardViewModel.prototype, "SubjectsPropertyEditor", {
                get: function () {
                    return this.subjectsPropertyEditor;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ModalSessionWizardViewModel.prototype, "SelectedTemplate", {
                get: function () {
                    return this.selectedTemplate;
                },
                enumerable: false,
                configurable: true
            });
            ModalSessionWizardViewModel.prototype.hideDivAndButtons = function () {
                this.btnSessionWizardComplete.Hide();
                this.btnSessionWizardProtocol.Hide();
                this.btnSessionWizardScreens.Hide();
                this.btnSessionWizardTemplate.Hide();
                this.divProtocol.Hide();
                this.divScreens.Hide();
                this.divModel.Hide();
            };
            ModalSessionWizardViewModel.prototype.showDivModel = function () {
                var self = this;
                if (this.mw) {
                    this.mw.SetTitle(Framework.LocalizationManager.Get("SessionWizard") + " " + Framework.LocalizationManager.Get("SelectTemplate"));
                }
                this.selectedTemplate = new PanelLeaderModels.TemplatedSession("", "", "", [], []);
                this.hideDivAndButtons();
                this.divModelContent.HtmlElement.innerHTML = "";
                var templates = PanelLeaderModels.TemplatedSession.GetTemplates();
                this.cards = [];
                templates.forEach(function (x) {
                    var card = Framework.Form.Card.Create(Framework.LocalizationManager.Get(x.LabelKey), Framework.LocalizationManager.Get(x.DescriptionKey), function () {
                        self.selectedTemplate = x;
                        var index = 1;
                        x.Screens.forEach(function (x) {
                            x.Id = index;
                            index++;
                        });
                        self.cards.forEach(function (c) {
                            c.TextElement.HtmlElement.classList.remove("selected");
                        });
                        card.TextElement.HtmlElement.classList.add("selected");
                        self.btnSessionWizardProtocol.CheckState();
                    });
                    card.ID = x.Id;
                    self.cards.push(card);
                    self.divModelContent.Append(card.TextElement);
                    //setTimeout(() => { Framework.Text.TruncateTextToFit(x.DescriptionKey, card.HtmlElement, true); }, 500);
                });
                this.divModel.Show();
                this.btnSessionWizardProtocol.SetInnerHTML('<i class="fas fa-arrow-right"></i>');
                this.btnSessionWizardProtocol.Show();
                this.btnSessionWizardProtocol.CheckState();
            };
            ModalSessionWizardViewModel.prototype.showDivProtocol = function () {
                var self = this;
                this.mw.SetTitle(Framework.LocalizationManager.Get("SessionWizard") + " " + Framework.LocalizationManager.Get("SelectProtocol"));
                this.hideDivAndButtons();
                this.btnSessionWizardTemplate.SetInnerHTML('<i class="fas fa-arrow-left"></i>');
                this.btnSessionWizardTemplate.Show();
                this.btnSessionWizardScreens.SetInnerHTML('<i class="fas fa-arrow-right"></i>');
                this.btnSessionWizardScreens.Show();
                this.divProtocol.Show();
                this.divProtocolContent.HtmlElement.innerHTML = "";
                if (this.selectedTemplate.Id == "XlsxSession") {
                    self.ShowModalSessionTemplateDB(function (session) {
                        // création de la séance
                        var newSession = new PanelLeaderModels.Session();
                        var productDesign = session.ListExperimentalDesigns.filter(function (x) { return x.Type == "Product"; })[0];
                        var attributeDesign = session.ListExperimentalDesigns.filter(function (x) { return x.Type == "Attribute"; })[0];
                        session.ListScreens.forEach(function (screen) {
                            newSession.ListScreens.push(screen);
                        });
                        // Lecture du fichier excel
                        Framework.FileHelper.BrowseFile(".xlsx", function (file) {
                            var fileReader = new FileReader();
                            fileReader.onload = function (e) {
                                if (!e) {
                                    var data = fileReader.content;
                                }
                                else {
                                    var data = e.target.result;
                                }
                                var workbook = XLSX.read(data, {
                                    type: 'binary'
                                });
                                var subjects = [];
                                var subjectCodes = [];
                                workbook.SheetNames.forEach(function (sheetName) {
                                    var importedObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                    if (sheetName == "subjects") {
                                        importedObject.forEach(function (x) {
                                            var subject = new Models.Subject();
                                            subject.Code = x.code;
                                            subjects.push(subject);
                                            subjectCodes.push(x.code);
                                        });
                                        newSession.AddNewPanelists(subjects);
                                    }
                                    if (sheetName == "products") {
                                        var items_1 = [];
                                        importedObject.forEach(function (x) {
                                            var labels = [];
                                            var values = Object.keys(x);
                                            for (var i = 1; i < values.length; i++) {
                                                labels.push(new Framework.KeyValuePair(i, x[values[i]]));
                                            }
                                            var item = new Models.ExperimentalDesignItem();
                                            item.Code = x.code;
                                            item.Labels = labels;
                                            items_1.push(item);
                                        });
                                        var newProductDesign = Models.ExperimentalDesign.Create("Product", productDesign.Id, subjectCodes, productDesign.Order, items_1[0].Labels.length, items_1);
                                        newSession.AddNewDesign(newProductDesign);
                                    }
                                    if (sheetName == "attributes") {
                                        var items_2 = [];
                                        importedObject.forEach(function (x) {
                                            var labels = [];
                                            var item = new Models.ExperimentalDesignItem();
                                            item.Code = x.code;
                                            item.LongName = x.label;
                                            //item.Description = x.label;
                                            labels.push(new Framework.KeyValuePair(1, x.label));
                                            item.Labels = labels;
                                            items_2.push(item);
                                        });
                                        var newAttributeDesign = Models.ExperimentalDesign.Create("Attribute", attributeDesign.Id, subjectCodes, attributeDesign.Order, items_2[0].Labels.length, items_2);
                                        newSession.AddNewDesign(newAttributeDesign);
                                    }
                                    //PanelLeaderModels.Session.ApplyStyleS(newSession.DefaultScreenOptions.DefaultStyle, newSession);
                                });
                                self.UploadSession(newSession, function () {
                                    self.SaveSession(newSession);
                                    self.mw.Close();
                                });
                            };
                            fileReader.readAsBinaryString(file);
                        });
                    });
                    return;
                }
                // Nombre de juges       
                var titleDiv = Framework.Form.TextElement.Create('<i class="fas fa-caret-right" > </i> ' + Framework.LocalizationManager.Get("Panelists"));
                this.divProtocolContent.Append(titleDiv);
                this.subjectsPropertyEditor = Framework.Form.PropertyEditorWithNumericUpDown.Render("", "NbSubjects", 1, 1, 200, function (x) {
                    self.selectedTemplate.NbSubjects = x;
                }, 1);
                this.subjectsPropertyEditor.SetPropertyKeyMaxWidth(400);
                this.divProtocolContent.Append(this.subjectsPropertyEditor.Editor);
                // Propriétés des plans d'expérience
                this.selectedTemplate.ListExperimentalDesigns.forEach(function (x) {
                    var titleDiv = Framework.Form.TextElement.Create('<i class="fas fa-caret-right" > </i> ' + Framework.LocalizationManager.Get("ExperimentalDesign") + " '" + Framework.LocalizationManager.Get(x.Name) + "'");
                    self.divProtocolContent.Append(titleDiv);
                    titleDiv.HtmlElement.style.marginTop = "15px";
                    //x.AddItem();
                    var listDesignsPropertyEditor = x.GetProperties(self.selectedTemplate.ListExperimentalDesigns.map(function (x) { return x.Name; }), false, function () {
                        x.AddItem();
                        self.btnSessionWizardScreens.CheckState();
                    });
                    listDesignsPropertyEditor.forEach(function (option) {
                        option.Group = x.Name;
                        self.divProtocolContent.Append(option.Editor);
                        option.SetPropertyKeyMaxWidth(400);
                    });
                });
                this.btnSessionWizardScreens.CheckState();
            };
            ModalSessionWizardViewModel.prototype.showDivScreens = function () {
                var self = this;
                this.mw.SetTitle(Framework.LocalizationManager.Get("SessionWizard") + " " + Framework.LocalizationManager.Get("SelectScreens"));
                this.hideDivAndButtons();
                this.btnSessionWizardProtocol.SetInnerHTML('<i class="fas fa-arrow-left"></i>');
                this.btnSessionWizardProtocol.Show();
                this.btnSessionWizardComplete.Show();
                this.divScreens.Show();
                this.divScreenSelection.HtmlElement.innerHTML = "";
                this.divCommonScreenOptions.HtmlElement.innerHTML = "";
                var formProperties = PanelLeaderModels.DefaultScreenOptions.GetForm(self.selectedTemplate.DefaultScreenOptions, function (changedValue, options) {
                    self.selectedTemplate.DefaultScreenOptions = options;
                    self.setOverview();
                });
                formProperties.forEach(function (x) {
                    self.divCommonScreenOptions.Append(x.Editor);
                });
                var index = 1;
                this.selectedTemplate.Screens.forEach(function (screen) {
                    var spanCss = "fa-sliders-h";
                    if (screen.SelectedScreen == "WelcomeScreen" || screen.SelectedScreen == "NoWelcomeScreen") {
                        spanCss = "fa-home";
                    }
                    else if (screen.SelectedScreen == "OverallInstructionScreen" || screen.SelectedScreen == "RepeatedInstructionScreen" || screen.SelectedScreen == "NoOverallInstructionScreen" || screen.SelectedScreen == "NoRepeatedInstructionScreen") {
                        spanCss = "fa-info";
                    }
                    else if (screen.SelectedScreen == "ExitScreen" || screen.SelectedScreen == "NoExitScreen") {
                        spanCss = "fa-sign-out-alt";
                    }
                    else if (screen.SelectedScreen == "ForcedBreakScreen" || screen.SelectedScreen == "NoForcedBreakScreen") {
                        spanCss = "fa-clock";
                    }
                    else if (screen.SelectedScreen == "SubjectSummaryScreen" || screen.SelectedScreen == "NoSubjectSummaryScreen") {
                        spanCss = "fa-chart-bar";
                    }
                    var select = Framework.Form.Select.Render(screen.SelectedScreen, Framework.KeyValuePair.FromArray(screen.Screens.map(function (x) { return x.Name; }), true), Framework.Form.Validator.NotEmpty(), function (x) {
                        screen.SelectedScreen = x;
                        //if (x.substring(0, 2) == "No") {
                        //    self.selectedMiniatureId = self.selectedTemplate.Screens.filter((x) => { return x.SelectedScreen.substring(0, 2) != "No" })[0].Id;
                        //}
                        self.setOverview();
                    }, false, ["form-control"]);
                    select.HtmlElement.style.width = "400px";
                    var div = Framework.Form.ControlWithLabel.Render(select, undefined, spanCss);
                    self.divScreenSelection.Append(div.Element);
                    index++;
                });
                self.setOverview();
            };
            ModalSessionWizardViewModel.prototype.setOverview = function () {
                var self = this;
                this.divScreenList.HtmlElement.innerHTML = "";
                var session = PanelLeaderModels.Session.FromTemplate(this.selectedTemplate);
                var divMiniatures = document.createElement("div");
                divMiniatures.style.height = "65vh";
                divMiniatures.style.width = "430px";
                divMiniatures.style.overflowY = "auto";
                divMiniatures.style.overflowX = "hidden";
                this.divScreenList.HtmlElement.appendChild(divMiniatures);
                var selectedScreens = this.selectedTemplate.Screens.filter(function (x) { return x.SelectedScreen.substr(0, 2) != 'No'; });
                for (var i = 0; i < session.ListScreens.length; i++) {
                    var screen_3 = Framework.Factory.CreateFrom(Models.Screen, session.ListScreens[i]);
                    var miniature = screen_3.RenderAsMiniature(i, divMiniatures.clientWidth - 5, session.ListExperimentalDesigns, function (x) {
                    });
                    divMiniatures.appendChild(miniature.Div);
                    var div = document.createElement("div");
                    div.classList.add("miniatureOptions");
                    //let b2 = Framework.Form.Button.Create(() => { return true; }, (btn) => {
                    //    let index = Number(btn.HtmlElement.getAttribute("index"));
                    //    let templatedScreen = selectedScreens[index];
                    //    let screen = templatedScreen.Screens.filter((y) => { return y.Name == templatedScreen.SelectedScreen })[0];
                    //    if (screen instanceof PanelLeaderModels.TemplatedScreen) {
                    //        (<PanelLeaderModels.TemplatedScreen>screen).Edit(() => {
                    //            self.setOverview();
                    //        });
                    //    }
                    //}, '<i class="fas fa-edit"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Edit"));
                    //div.appendChild(b2.HtmlElement);
                    miniature.AddDiv(div);
                    //b2.HtmlElement.setAttribute("index", i.toString());
                    var b1 = Framework.Form.Button.Create(function () { return true; }, function (btn) {
                        var index = Number(btn.HtmlElement.getAttribute("index"));
                        // Options               
                        var templatedScreen = selectedScreens[index];
                        var options = templatedScreen.Screens.filter(function (y) { return y.Name == templatedScreen.SelectedScreen; })[0].GetOptions();
                        if (options.length > 0) {
                            var div_2 = document.createElement("div");
                            var groups_1 = new Framework.Dictionary.Dictionary();
                            options.forEach(function (option) {
                                if (groups_1.Get(option.Group) == undefined) {
                                    var accordion = Framework.Form.Accordion.Create(Framework.LocalizationManager.Get(option.Group), ["propertyHeader"]);
                                    div_2.appendChild(accordion.HtmlElement);
                                    groups_1.Add(option.Group, accordion);
                                }
                                groups_1.Get(option.Group).HtmlElement.appendChild(option.Editor.HtmlElement);
                                option.SetPropertyKeyMaxWidth(400);
                                option.OnCheck = function () {
                                    validateForm_1();
                                };
                            });
                            var errorDiv_1 = document.createElement("div");
                            div_2.appendChild(errorDiv_1);
                            var validateForm_1 = function () {
                                var validationResult = "";
                                for (var i_1 = 0; i_1 < options.length; i_1++) {
                                    if (options[i_1].IsVisible == true && options[i_1].ValidationResult != "") {
                                        validationResult += options[i_1].ValidationResult + "\n";
                                    }
                                }
                                errorDiv_1.classList.remove("alert");
                                errorDiv_1.classList.remove("alert-danger");
                                errorDiv_1.innerHTML = "";
                                if (validationResult.length > 0) {
                                    errorDiv_1.classList.add("alert");
                                    errorDiv_1.classList.add("alert-danger");
                                    errorDiv_1.innerHTML = validationResult;
                                    modal_1.ConfirmButton.Disable();
                                }
                                else {
                                    modal_1.ConfirmButton.Enable();
                                }
                            };
                            var modal_1 = Framework.Modal.Confirm(Framework.LocalizationManager.Get("Options"), div_2, function () {
                                self.setOverview();
                            });
                            validateForm_1();
                        }
                    }, '<i class="fas fa-cog"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Options"));
                    div.appendChild(b1.HtmlElement);
                    b1.HtmlElement.setAttribute("index", i.toString());
                }
            };
            return ModalSessionWizardViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalSessionWizardViewModel = ModalSessionWizardViewModel;
        var DataViewModel = /** @class */ (function (_super) {
            __extends(DataViewModel, _super);
            function DataViewModel(listData, tabs) {
                var _this = _super.call(this) || this;
                _this.displayFormat = "canonical";
                _this.selectedData = []; // Données sélectionnées dans le tableau
                _this.currentTabData = []; // Données de l'onglet actif
                _this.isOnline = true;
                var self = _this;
                _this.sessionData = listData;
                _this.tabDiv = Framework.Form.TextElement.Register("sheetTabsDiv");
                //this.btnInsertData = Framework.Form.Button.Register("btnInsertData", () => { return true; }, () => {
                //    let dtype = "";
                //    if (self.TableData.ListData.length > 0) {
                //        dtype = self.TableData.ListData[0].Type;
                //    }
                //    self.AddData(self.selectedSheetName, dtype);
                //});
                _this.btnDeleteData = Framework.Form.Button.Register("btnDeleteData", function () { return self.TableData && self.TableData.SelectedData.length > 0; }, function () {
                    var mw = Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveTheSelection"), function () {
                        self.DeleteData(self.TableData.SelectedData);
                        self.setDataTable();
                    });
                });
                //this.btnTest = Framework.Form.Button.Register("btnTest", () => { return true; }, () => {
                //    // TODO : sortir ça d'ici
                //    let report = new PanelLeaderModels.Report();
                //    report.AddBarplots(this.TableData.ListData, "AttributeCode", "ProductCode");
                //    let formDiv = report.ReportDiv;
                //    let scatter = new Framework.D3.ScatterPlot("Test scatter", 600, 600, "test", "test");
                //    let div = document.createElement("div");
                //    scatter.RenderIn(div);
                //    formDiv.appendChild(div);
                //    let saveHTMLBtn = Framework.Form.Button.Create(() => { return true; }, () => {
                //        //TODO
                //    }, '<i class="fas fa-file-code"></i>', ["btnCircle"], Framework.LocalizationManager.Get("SaveAsHTML"));
                //    let savePPTBtn = Framework.Form.Button.Create(() => { return true; }, () => {
                //        //TODO
                //    }, '<i class="fas fa-file-powerpoint"></i>', ["btnCircle"], Framework.LocalizationManager.Get("SaveAsPPT"));
                //    let savePDFBtn = Framework.Form.Button.Create(() => { return true; }, () => {
                //        //TODO
                //    }, '<i class="fas fa-file-pdf"></i>', ["btnCircle"], Framework.LocalizationManager.Get("SaveAsPDF"));
                //    let printBtn = Framework.Form.Button.Create(() => { return true; }, () => {
                //        //TODO
                //    }, '<i class="fas fa-print"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Print"));
                //    let exitBtn = Framework.Form.Button.Create(() => { return true; }, () => {
                //        mw.Close();
                //    }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Close"));
                //    let mw = Framework.Modal.Custom(formDiv, Framework.LocalizationManager.Get("Report"), [saveHTMLBtn, savePPTBtn, savePDFBtn, printBtn, exitBtn], "800px", "800px", true, true, false);
                //});
                //this.btnShowDataTransformation = Framework.Form.Button.Register("btnShowDataTransformation", () => { return true; }, () => {
                //    Framework.Popup.Show(self.btnShowDataTransformation.HtmlElement, self.getUpdateSelectionDiv(), 'top');
                //});
                //this.btnImportData = Framework.Form.Button.Register("btnImportData", () => {
                //    return self.isLocked == false;
                //}, () => {
                //    let selectedDatatype: string = "";
                //    //Affichage message type de données + format puis gérer type de donnée et template
                //    let select: Framework.Form.Select = Framework.Form.Select.Render("", Framework.KeyValuePair.FromArray(Models.Data.ImportTemplates), Framework.Form.Validator.NotEmpty(), (newVal: string) => {
                //        selectedDatatype = newVal;
                //    }, true);
                //    Framework.Modal.Confirm(Framework.LocalizationManager.Get("ChooseDataTypeToImport"), select.HtmlElement, () => {
                //        self.ShowModalImportData(selectedDatatype);
                //    });
                //});
                //this.btnExportData = Framework.Form.Button.Register("btnExportData", () => {
                //    return true;
                //}, () => {
                //    self.TableData.Export(Framework.LocalizationManager.Get("Data"));
                //});
                _this.btnExportAllData = Framework.Form.Button.Register("btnExportAllData", function () {
                    return true;
                }, function () {
                    var wb = new Framework.ExportManager("", "", "");
                    self.tabNames.forEach(function (tab) {
                        var data = self.sessionData.filter(function (x) { return x.SheetName == tab; });
                        if (data.length > 0) {
                            var datatable = Models.Data.GetDataTable(data);
                            wb.AddWorksheet(tab, datatable.GetAsArray());
                        }
                    });
                    wb.Save("data", "xlsx");
                });
                //this.btnShowPivot = Framework.Form.Button.Register("btnShowPivot", () => {
                //    return true;
                //}, () => {
                //    ModalPivotViewModel.Show(listData.filter((x) => { return x.SheetName == self.selectedSheetName; }));
                //});
                //this.btnShowAnalysis = Framework.Form.Button.Register("btnShowAnalysis", () => {
                //    return self.isOnline == true;
                //}, () => {
                //    self.ShowModalAnalysis(self.TableData.DisplayedData);
                //});
                //this.btnToggleDataView = Framework.Form.Button.Register("btnToggleDataView", () => {
                //    return true;
                //}, () => {
                //    if (self.displayFormat == "canonical") {
                //        self.displayFormat = "extended";
                //    } else {
                //        self.displayFormat = "canonical"
                //    }
                //    self.setDataTable();
                //});
                _this.divTableData = Framework.Form.TextElement.Register("divTableData");
                _this.tabNames = tabs;
                _this.setTabs();
                return _this;
                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});
            }
            DataViewModel.prototype.OnConnectivityChanged = function (isOnline) {
                this.isOnline = isOnline;
                //this.btnShowAnalysis.CheckState();
            };
            DataViewModel.prototype.setDataTable = function () {
                var self = this;
                this.divTableData.HtmlElement.innerHTML = "";
                this.currentTabData = this.sessionData.filter(function (x) { return x.SheetName == self.selectedSheetName; });
                if (this.currentTabData.length > 0) {
                    var selectedDataType = Models.Data.GetType(this.currentTabData[0]);
                    //this.TableData = new Framework.Form.Table<Models.Data>();
                    //this.TableData.ListColumns = [];
                    //let col1 = new Framework.Form.TableColumn();
                    //col1.Name = "Session";
                    //col1.Title = Framework.LocalizationManager.Get("Session");
                    //col1.RemoveSpecialCharacters = true;
                    //col1.MinWidth = 100;
                    //this.TableData.ListColumns.push(col1);
                    //let col5 = new Framework.Form.TableColumn();
                    //col5.Name = "Replicate";
                    //col5.Title = Framework.LocalizationManager.Get("Replicate");
                    //col5.Type = "integer";
                    //col5.DefaultValue = 1;
                    //col5.MinWidth = 100;
                    //this.TableData.ListColumns.push(col5);
                    //let col6 = new Framework.Form.TableColumn();
                    //col6.Name = "Intake";
                    //col6.Title = Framework.LocalizationManager.Get("Intake");
                    //col6.Type = "positiveInteger";
                    //col6.DefaultValue = 1;
                    //col6.MinWidth = 100;
                    //this.TableData.ListColumns.push(col6);
                    //let col2 = new Framework.Form.TableColumn();
                    //col2.Name = "SubjectCode";
                    //col2.Title = Framework.LocalizationManager.Get("Subject");
                    //col2.RemoveSpecialCharacters = true;
                    //col2.MinWidth = 100;
                    //this.TableData.ListColumns.push(col2);
                    //let col3 = new Framework.Form.TableColumn();
                    //col3.Name = "ProductCode";
                    //col3.Title = Framework.LocalizationManager.Get("Product");
                    //col3.RemoveSpecialCharacters = true;
                    //col3.MinWidth = 100;
                    //this.TableData.ListColumns.push(col3);
                    if (self.displayFormat == "canonical") {
                        this.TableData = Models.Data.GetDataTable(this.currentTabData);
                        //this.TableData.ListData = this.currentTabData;
                        this.TableData.OnDataUpdated = function (data, propertyName, oldValue, newValue) {
                            self.OnDataChanged(data, propertyName, oldValue, newValue);
                        };
                        //if (selectedDataType != "SpeechToText") {
                        //    let col4 = new Framework.Form.TableColumn();
                        //    col4.Name = "AttributeCode";
                        //    col4.Title = Framework.LocalizationManager.Get("Attribute");
                        //    col4.RemoveSpecialCharacters = true;
                        //    col4.MinWidth = 100;
                        //    this.TableData.ListColumns.push(col4);
                        //}
                        //if (selectedDataType != "Question" && selectedDataType != "FreeTextQuestion" && selectedDataType != "SingleAnswerQuestion") {
                        //    let col7 = new Framework.Form.TableColumn();
                        //    col7.Name = "Score";
                        //    col7.Title = Framework.LocalizationManager.Get("Score");
                        //    col7.Type = "number";
                        //    col7.MinWidth = 100;
                        //    this.TableData.ListColumns.push(col7);
                        //}
                        //let col8 = new Framework.Form.TableColumn();
                        //col8.Name = "ControlName";
                        //col8.Title = Framework.LocalizationManager.Get("ControlName");
                        //col8.RemoveSpecialCharacters = true;
                        //col8.MinWidth = 100;
                        //this.TableData.ListColumns.push(col8);
                        //if (selectedDataType == "TDS" || selectedDataType == "Event" || selectedDataType == "Emotion" || selectedDataType == "TCATA") {
                        //    let col8 = new Framework.Form.TableColumn();
                        //    col8.Name = "Time";
                        //    col8.Title = Framework.LocalizationManager.Get("Time");
                        //    col8.Type = "number";
                        //    col8.MinWidth = 100;
                        //    this.TableData.ListColumns.push(col8);
                        //    let col9 = new Framework.Form.TableColumn();
                        //    col9.Name = "StandardizedTime";
                        //    col9.Title = Framework.LocalizationManager.Get("StandardizedTime");
                        //    col9.Type = "number";
                        //    col9.MinWidth = 100;
                        //    col9.RenderFunction = (val: number) => {
                        //        if (val == undefined) {
                        //            return "";
                        //        }
                        //        return val.toString();                                
                        //    };
                        //    this.TableData.ListColumns.push(col9);
                        //    let col10 = new Framework.Form.TableColumn();
                        //    col10.Name = "Duration";
                        //    col10.Title = Framework.LocalizationManager.Get("Duration");
                        //    col10.Type = "number";
                        //    col10.MinWidth = 100;
                        //    col10.RenderFunction = (val: number) => {
                        //        if (val == undefined) {
                        //            return "";
                        //        }
                        //        return val.toString();
                        //    };
                        //    this.TableData.ListColumns.push(col10);
                        //}
                        //if (selectedDataType == "Sentiment" || selectedDataType == "Question" || selectedDataType == "FreeTextQuestion" || selectedDataType == "SingleAnswerQuestion" || selectedDataType == "MultipleAnswersQuestion") {
                        //    let col11 = new Framework.Form.TableColumn();
                        //    col11.Name = "QuestionLabel";
                        //    col11.Title = Framework.LocalizationManager.Get("Label");
                        //    col11.RemoveSpecialCharacters = true;
                        //    this.TableData.ListColumns.push(col11);
                        //}
                        //if (selectedDataType == "Sentiment" || selectedDataType == "Question" || selectedDataType == "FreeTextQuestion" || selectedDataType == "SpeechToText" || selectedDataType == "SingleAnswerQuestion" || selectedDataType == "MultipleAnswersQuestion") {
                        //    let col12 = new Framework.Form.TableColumn();
                        //    col12.Name = "Description";
                        //    col12.Title = Framework.LocalizationManager.Get("Description");
                        //    this.TableData.ListColumns.push(col12);
                        //}
                        //let col13 = new Framework.Form.TableColumn();
                        //col13.Name = "Status";
                        //col13.Title = Framework.LocalizationManager.Get("Status");
                        //col13.Editable = false;
                        //col13.MinWidth = 100;
                        //this.TableData.ListColumns.push(col13);
                        //let col14 = new Framework.Form.TableColumn();
                        //col14.Name = "RecordedDate";
                        //col14.Title = Framework.LocalizationManager.Get("Date");
                        //col14.Editable = false;
                        //col14.MinWidth = 100;
                        //col14.RenderFunction = (val, row) => { return new Date(val).toLocaleString(); };
                        //this.TableData.ListColumns.push(col14);
                    }
                    if (self.displayFormat == "extended") {
                        // TODO : durées cumulées ?
                        //if (selectedDataType == "TDS") {
                        //    //    // Temps en colonne
                        //    //    // TODO : discrétisation
                        //    dataColumns.push({ data: "Time", title: Framework.LocalizationManager.Get("Time") , render: function (data, type, row) {
                        //        if (type === 'display') {
                        //            if (data == undefined || data == null) {
                        //                return "0";
                        //            }
                        //            return data;
                        //        }
                        //        return "0";
                        //    }
                        //    });
                        //}
                        //let datasetSummary: PanelLeaderModels.DatasetSummary = new PanelLeaderModels.DatasetSummary(this.currentTabData);
                        this.TableData = Models.Data.GetExtendedDataTable(this.currentTabData);
                        //this.TableData.ListData = datasetSummary.FlatContingencyTable;
                        //// Si profil, hédonique...
                        //datasetSummary.Attributes.forEach((x, i) => {
                        //    let col = new Framework.Form.TableColumn();
                        //    col.Name = "AttributesScores";
                        //    col.Title = x;
                        //    col.Type = "number";
                        //    col.MinWidth = 100;
                        //    col.Editable = false;
                        //    col.Filterable = false;
                        //    col.RenderFunction = (y) => {
                        //        if (y == undefined) {
                        //            return "<span style='background:red'>-</span>";
                        //        }
                        //        let res;
                        //        if (selectedDataType == "TDS") {
                        //            res = y.Entries.filter((e) => { return e.Key == x });
                        //        } else {
                        //            res = y.Entries.filter((e) => { return e.Key == x });
                        //        }
                        //        if (res.length > 0 && res[0].Val != undefined) {
                        //            return res[0].Val;
                        //        }
                        //        return "0";
                        //    }
                        //    this.TableData.ListColumns.push(col);
                        //});
                    }
                    this.TableData.Height = "70vh";
                    this.TableData.OnSelectionChanged = function (sel) {
                        self.selectedData = sel;
                        self.btnDeleteData.CheckState();
                    };
                    this.TableData.Render(this.divTableData.HtmlElement);
                }
            };
            DataViewModel.prototype.setTabs = function () {
                var _this = this;
                var self = this;
                this.tabDiv.HtmlElement.innerHTML = "";
                this.tabButtons = [];
                this.tabNames.forEach(function (x) {
                    var button = Framework.Form.Button.Create(function () { return true; }, function (b) {
                        self.selectedSheetName = b.CustomAttributes.Get("SheetName");
                        self.setDataTable();
                        self.tabButtons.forEach(function (y) { y.HtmlElement.classList.remove("selected"); });
                        b.HtmlElement.classList.add("selected");
                    }, Framework.LocalizationManager.Get(x), ["expDesignButton"]);
                    button.CustomAttributes.Add("SheetName", x);
                    self.tabDiv.Append(button);
                    _this.tabButtons.push(button);
                });
                if (this.tabButtons.length > 0) {
                    this.tabButtons[this.tabButtons.length - 1].Click();
                }
                //let button: Framework.Form.Button = Framework.Form.Button.Create(() => { return true; }, () => {
                //    self.AddDataTab();
                //}, '<span><i class="fas fa-plus"></i></span>&nbsp;' + Framework.LocalizationManager.Get("NewTab"), ["expDesignButton"]);
                //self.tabDiv.Append(button);
            };
            DataViewModel.prototype.Update = function () {
                this.setTabs();
            };
            DataViewModel.prototype.getUpdateSelectionDiv = function () {
                var self = this;
                var div = document.createElement("div");
                //TODO : proposer dans onglet actuel ou nouvel onglet
                var b0 = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    self.showRenameTab();
                }, Framework.LocalizationManager.Get("RenameTab"), ["popupEditableProperty"]);
                div.appendChild(b0.HtmlElement);
                var b1 = Framework.Form.Button.Create(function () {
                    return Framework.Array.Unique(self.currentTabData.map(function (x) { return x.Session; })).length > 1;
                }, function () {
                    self.showTransformSessionsInReplicates();
                }, Framework.LocalizationManager.Get("TransformSessionsInReplicates"), ["popupEditableProperty"]);
                div.appendChild(b1.HtmlElement);
                var b2 = Framework.Form.Button.Create(function () {
                    return Framework.Array.Unique(self.currentTabData.map(function (x) { return x.Replicate; })).length > 1;
                }, function () {
                    self.showTransformReplicatesInIntakes();
                }, Framework.LocalizationManager.Get("TransformReplicatesInIntakes"), ["popupEditableProperty"]);
                div.appendChild(b2.HtmlElement);
                //TODO
                //let b3 = Framework.Form.Button.Create(() => {
                //    return true;
                //}, () => {
                //    //TODO : nouvel onglet ou remplacer les données
                //}, Framework.LocalizationManager.Get("SplitInPeriods"), ["popupEditableProperty"]);
                //div.appendChild(b3.HtmlElement);
                var b6 = Framework.Form.Button.Create(function () {
                    return Framework.Array.Unique(self.currentTabData.map(function (x) { return x.Score; })).length > 1;
                }, function () {
                    self.showTransformScores();
                }, Framework.LocalizationManager.Get("TransformScores"), ["popupEditableProperty"]);
                div.appendChild(b6.HtmlElement);
                var b4 = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    //TODO : nouvel onglet ou remplacer les données
                }, Framework.LocalizationManager.Get("AverageScores"), ["popupEditableProperty"]);
                div.appendChild(b4.HtmlElement);
                var b5 = Framework.Form.Button.Create(function () {
                    return self.currentTabData.length > 0;
                }, function () {
                    self.showSearchReplace();
                }, Framework.LocalizationManager.Get("SearchReplace"), ["popupEditableProperty"]);
                div.appendChild(b5.HtmlElement);
                var b7 = Framework.Form.Button.Create(function () {
                    return self.selectedData.length > 0;
                }, function () {
                    self.showModifySelection();
                }, Framework.LocalizationManager.Get("ModifySelection"), ["popupEditableProperty"]);
                div.appendChild(b7.HtmlElement);
                var b8 = Framework.Form.Button.Create(function () {
                    return self.selectedData.length > 0;
                }, function () {
                    self.showMoveSelectionToAnotherTab();
                }, Framework.LocalizationManager.Get("CopySelectionToAnotherTab"), ["popupEditableProperty"]);
                div.appendChild(b8.HtmlElement);
                var b10 = Framework.Form.Button.Create(function () { return true; }, function () {
                    Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveTheTab"), function () {
                        self.RemoveDataTab(self.selectedSheetName);
                        self.setTabs();
                    });
                }, Framework.LocalizationManager.Get("DeleteTab"), ["popupEditableProperty"]);
                div.appendChild(b10.HtmlElement);
                var b11 = Framework.Form.Button.Create(function () {
                    // Commentaire libre
                    //TODO return self.selectedData.length > 0 && self.selectedData[0].Type == "FreeTextQuestiocControl";                    
                    return true;
                }, function () {
                    self.FeelingAnalysis(self.currentTabData, true);
                }, Framework.LocalizationManager.Get("FeelingAnalysis"), ["popupEditableProperty"]);
                div.appendChild(b11.HtmlElement);
                return div;
            };
            DataViewModel.prototype.showTransformForm = function (title, onConfirm, controls) {
                if (controls === void 0) { controls = []; }
                var copyInNewTab = true;
                var self = this;
                var div = document.createElement("div");
                controls.forEach(function (x) {
                    div.appendChild(x.Editor.HtmlElement);
                });
                var checkbox = Framework.Form.PropertyEditorWithToggle.Render("", "CopyInANewTab", copyInNewTab, function (x) {
                    copyInNewTab = x;
                });
                div.appendChild(checkbox.Editor.HtmlElement);
                Framework.Modal.Confirm(title, div, function () {
                    onConfirm(copyInNewTab);
                    if (copyInNewTab == true) {
                        self.setTabs();
                    }
                    self.setDataTable();
                });
            };
            DataViewModel.prototype.showModifySelection = function () {
                var self = this;
                var column = "";
                var replace = "";
                var colNames = self.TableData.ListColumns.map(function (x) { return new Framework.KeyValuePair(x.Name, x.Title); });
                var select = Framework.Form.PropertyEditorWithPopup.Render("", "Column", "", colNames.map(function (x) { return x.Key; }), function (x) {
                    column = colNames.filter(function (c) { return c.Key == x; })[0].Value;
                }, true);
                var input2 = Framework.Form.PropertyEditorWithTextInput.Render("", "ReplacementValue", "", function (x) {
                    replace = x;
                }, Framework.Form.Validator.MinLength(1));
                this.showTransformForm(Framework.LocalizationManager.Get("ModifySelection"), function (copyInNewTab) {
                    if (column.length > 0 && replace.length > 0) {
                        //TODO : état du bouton OK en fonction de ça
                        self.ModifySelectionInData(self.currentTabData, column, replace, copyInNewTab);
                    }
                }, [select, input2]);
            };
            DataViewModel.prototype.showSearchReplace = function () {
                var self = this;
                var column = "";
                var search = "";
                var replace = "";
                var colNames = self.TableData.ListColumns.map(function (x) { return new Framework.KeyValuePair(x.Name, x.Title); });
                var select = Framework.Form.PropertyEditorWithPopup.Render("", "Column", "", colNames.map(function (x) { return x.Key; }), function (x) {
                    column = colNames.filter(function (c) { return c.Key == x; })[0].Value;
                }, true);
                var input1 = Framework.Form.PropertyEditorWithTextInput.Render("", "SearchValue", "", function (x) {
                    search = x;
                }, Framework.Form.Validator.MinLength(1));
                var input2 = Framework.Form.PropertyEditorWithTextInput.Render("", "ReplacementValue", "", function (x) {
                    replace = x;
                }, Framework.Form.Validator.MinLength(1));
                this.showTransformForm(Framework.LocalizationManager.Get("SearchReplace"), function (copyInNewTab) {
                    if (column.length > 0 && search.length > 0 && replace.length > 0) {
                        //TODO : état du bouton OK en fonction de ça
                        self.SearchAndReplaceData(self.currentTabData, column, search, replace, copyInNewTab);
                    }
                }, [select, input1, input2]);
            };
            DataViewModel.prototype.showTransformScores = function () {
                var self = this;
                var transformation = "";
                var options = ["Rank", "Log", "Sqrt"];
                if (Framework.Array.Unique(this.currentTabData.map(function (x) { return x.Session; })).length > 0) {
                    options.push("AverageOverSessions");
                }
                if (Framework.Array.Unique(this.currentTabData.map(function (x) { return x.Replicate; })).length > 0) {
                    options.push("AverageOverReplicates");
                }
                if (Framework.Array.Unique(this.currentTabData.map(function (x) { return x.Intake; })).length > 0) {
                    options.push("AverageOverIntakes");
                }
                var select = Framework.Form.PropertyEditorWithPopup.Render("", "Transformation", "", options, function (x) {
                    transformation = x;
                }, true);
                this.showTransformForm(Framework.LocalizationManager.Get("TransformScores"), function (copyInNewTab) {
                    if (transformation == "Rank") {
                        self.TransformScoresInRanks(self.currentTabData, copyInNewTab);
                    }
                    if (transformation == "Log") {
                        self.TransformScores(self.currentTabData, copyInNewTab, 'log');
                    }
                    if (transformation == "Sqrt") {
                        self.TransformScores(self.currentTabData, copyInNewTab, 'sqrt');
                    }
                    if (transformation == "AverageOverSessions") {
                        self.TransformScoresInMeans(self.currentTabData, copyInNewTab, "Session");
                    }
                    if (transformation == "AverageOverReplicates") {
                        self.TransformScoresInMeans(self.currentTabData, copyInNewTab, "Replicate");
                    }
                    if (transformation == "AverageOverIntakes") {
                        self.TransformScoresInMeans(self.currentTabData, copyInNewTab, "Intake");
                    }
                }, [select]);
            };
            DataViewModel.prototype.showTransformReplicatesInIntakes = function () {
                var self = this;
                this.showTransformForm(Framework.LocalizationManager.Get("TransformReplicatesInIntakes"), function (copyInNewTab) {
                    self.TransformReplicatesInIntakes(self.currentTabData, copyInNewTab);
                });
            };
            DataViewModel.prototype.showTransformSessionsInReplicates = function () {
                var self = this;
                this.showTransformForm(Framework.LocalizationManager.Get("TransformSessionsInReplicates"), function (copyInNewTab) {
                    self.TransformSessionsInReplicates(self.currentTabData, copyInNewTab);
                    //if (copyInNewTab == true) {
                    //    self.setTabs();
                    //}
                    //self.setDataTable();
                });
                //let copyInNewTab: boolean = true;
                //let self = this;
                //let div: HTMLDivElement = document.createElement("div");
                //let checkbox = Framework.Form.PropertyEditor.RenderWithToggle("CopyInANewTab", copyInNewTab, (x) => {
                //    copyInNewTab = x;
                //});
                //div.appendChild(checkbox.Editor.HtmlElement);
                //Framework.Modal.Confirm(Framework.LocalizationManager.Get("TransformSessionsInReplicates"), "", div, () => {
                //    self.controller.TransformSessionsInReplicates(self.currentTabData, copyInNewTab);
                //    if (copyInNewTab == true) {
                //        self.setTabs();
                //    }
                //    self.setDataTable();
                //});
            };
            DataViewModel.prototype.showMoveSelectionToAnotherTab = function () {
                var newTab = Framework.LocalizationManager.Get("NewTab");
                var deleteAfterCopy = false;
                var self = this;
                var div = document.createElement("div");
                var select = Framework.Form.PropertyEditorWithPopup.Render("", "NewTab", newTab, self.tabNames, function (x) {
                    newTab = x;
                }, true);
                div.appendChild(select.Editor.HtmlElement);
                var checkbox = Framework.Form.PropertyEditorWithToggle.Render("", "DeleteFromCurrentTabAfterCopy", deleteAfterCopy, function (x) {
                    deleteAfterCopy = x;
                });
                div.appendChild(checkbox.Editor.HtmlElement);
                Framework.Modal.Confirm(Framework.LocalizationManager.Get("RenameTab"), div, function () {
                    self.MoveSelectionToAnotherTab(self.selectedData, newTab, deleteAfterCopy);
                    //if (deleteAfterCopy == false) {
                    //    self.setTabs();
                    //}
                    self.setDataTable();
                });
            };
            DataViewModel.prototype.showRenameTab = function () {
                var self = this;
                var div = document.createElement("div");
                var newName = undefined;
                var input = Framework.Form.InputText.Create(this.selectedSheetName, function (x) {
                    newName = x;
                }, Framework.Form.Validator.Unique(this.tabNames), false);
                div.appendChild(input.HtmlElement);
                Framework.Modal.Confirm(Framework.LocalizationManager.Get("EnterNewName"), div, function () {
                    if (newName) {
                        var index = self.tabNames.indexOf(self.selectedSheetName);
                        self.tabNames[index] = newName;
                        self.selectedSheetName = newName;
                        self.MoveSelectionToAnotherTab(self.currentTabData, newName, true);
                        //self.setTabs();
                    }
                });
            };
            DataViewModel.prototype.SetLock = function (isLocked) {
                this.isLocked = true;
                //this.btnImportData.CheckState();
                //this.btnExportData.CheckState();
                //this.btnShowPivot.CheckState();
                //this.btnToggleDataView.CheckState();
                //this.btnShowAnalysis.CheckState();
                if (this.isLocked == true) {
                    this.TableData.Disable();
                }
                else {
                    this.TableData.Enable();
                }
            };
            return DataViewModel;
        }(PanelLeaderViewModel));
        ViewModels.DataViewModel = DataViewModel;
        var ModalSaveAnalysisAsTemplateViewModel = /** @class */ (function (_super) {
            __extends(ModalSaveAnalysisAsTemplateViewModel, _super);
            function ModalSaveAnalysisAsTemplateViewModel(mw, templateNames, onConfirm) {
                var _this = _super.call(this, mw) || this;
                var self = _this;
                var div = Framework.Form.TextElement.Create();
                var textName = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("TemplateName"), ["inlineInput"]);
                div.Append(textName);
                var customValidatorTemplateName = Framework.Form.Validator.Custom(function (value) {
                    var res = "";
                    if (value.length < 6) {
                        res = Framework.LocalizationManager.Get("TemplateNameMin6Characters");
                    }
                    if (templateNames.indexOf(value) > -1) {
                        res = Framework.LocalizationManager.Get("TemplateNameAlreayExists");
                    }
                    return res;
                });
                var inputName = Framework.Form.InputText.Create("", function () {
                    okButton.CheckState();
                }, customValidatorTemplateName, true, ["inlineInput"]);
                div.Append(inputName);
                var textDescription = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("Description"), ["inlineInput"]);
                div.Append(textDescription);
                var inputDescription = Framework.Form.InputText.Create("", function () {
                    okButton.CheckState();
                }, Framework.Form.Validator.MinLength(6), true, ["inlineInput"]);
                div.Append(inputDescription);
                mw.Body.appendChild(div.HtmlElement);
                var cancelButton = Framework.Form.Button.Create(function () { return true; }, function () { mw.Close(); }, Framework.LocalizationManager.Get("Cancel"), ["btnCircle"]);
                var okButton = Framework.Form.Button.Create(function () {
                    return inputName.IsValid && inputDescription.IsValid;
                }, function () {
                    onConfirm(inputName.Value, inputDescription.Value);
                    mw.Close();
                }, Framework.LocalizationManager.Get("OK"), ["btnCircle"]);
                //TODO
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 13, function () { okButton.Click(); });
                return _this;
            }
            return ModalSaveAnalysisAsTemplateViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalSaveAnalysisAsTemplateViewModel = ModalSaveAnalysisAsTemplateViewModel;
        var ModalAnalysisViewModel = /** @class */ (function (_super) {
            __extends(ModalAnalysisViewModel, _super);
            //private selectedFunctions: string[] = [];
            //TODO : choix du modèle d'analyse personnalisé ou analyse par défaut
            function ModalAnalysisViewModel(mw, listData, dataTypes /*, templates: PanelLeaderModels.AnalysisTemplate[]*/) {
                var _this = _super.call(this, mw) || this;
                //private divAnalysisFunctionSelection: Framework.Form.TextElement;
                _this.listData = [];
                //private currentAnalysis: PanelLeaderModels.Analysis;
                //private memorizeAnalysis: boolean = false;
                //private language: string = "en";
                //private productLabels: string = "codes"; // codes ou labels
                //private attributeLabels: string = "codes"; // codes ou labels
                //private subjectLabels: string = "codes"; // codes ou names ou firstNames
                _this.missingDataActions = [
                    { Value: "Ignore", Key: "IgnoreThisWarning" }, // Ignorer l'avertissement
                    { Value: "Impute", Key: "ImputeMissingData" } // Imputer les données manquantes (moy juge + moyenne produit) / gmean -> state==completed                          
                ];
                var self = _this;
                _this.mw.SetTitle(Framework.LocalizationManager.Get("Analysis"));
                _this.listData = listData;
                //this.dataTypes = dataTypes;
                //this.templates = templates;
                _this.divAnalysisDataSummary = Framework.Form.TextElement.Register("divAnalysisDataSummary");
                _this.divAnalysisDataSelection = Framework.Form.TextElement.Register("divAnalysisDataSelection");
                //this.divAnalysisFunctionSelection = Framework.Form.TextElement.Register("divAnalysisFunctionSelection");
                _this.divPivot = Framework.Form.TextElement.Register("divPivot");
                //this.divFunctionSelection = Framework.Form.TextElement.Register("divFunctionSelection");
                _this.btnShowReport = Framework.Form.Button.Create(function () {
                    return true;
                }, function () {
                    //let rServer = new Framework.DataReport.RServer(this.RServerWCFServiceURL, this.RServerLogin, this.RServerPassword, this.RServerOnComplete);
                    //rServer.Open(datasetSummary.ListData, () => {
                    //    //TODO : loading
                    //}, (id: string) => {
                    //    rServer.WorkingDirectoryId = id;
                    //    self.report = new Framework.DataReport.Report(datasetSummary, rServer);
                    //    self.mw.Close();
                    //    self.report.ShowModal();
                    //}, (error: string) => {
                    //    //TODO
                    //});
                    //self.report.Functions.forEach((x) => {
                    //    let cb = Framework.Form.CheckBox.Create(() => { return true; }, (ev, sender) => {
                    //        x.IsSelected = sender.IsChecked;
                    //    }, Framework.LocalizationManager.Get(x.Label), "", x.IsSelected, []);
                    //    self.divFunctionSelection.Append(cb);
                    //});
                }, '<i class="fas fa-arrow-right"></i>', ["btnCircle"], Framework.LocalizationManager.Get("FunctionSelection"));
                _this.pAnalysisMissingDataWarning = Framework.Form.TextElement.Register("pAnalysisMissingDataWarning");
                _this.divAnalysisMissingDataStrategy = Framework.Form.TextElement.Register("divAnalysisMissingDataStrategy");
                _this.divPivot.HtmlElement.innerHTML = "";
                _this.divAnalysisMissingDataStrategy.HtmlElement.innerHTML = "";
                // Diagnostic des données
                var datasetSummary = new PanelLeaderModels.DatasetSummary(_this.listData);
                _this.divAnalysisDataSummary.Append(datasetSummary.GetLogDiv());
                _this.pAnalysisMissingDataWarning.Hide();
                _this.divAnalysisMissingDataStrategy.Hide();
                if (datasetSummary.MissingDataCount > 0) {
                    _this.btnShowReport.Disable();
                    _this.divPivot.HtmlElement.appendChild(datasetSummary.MissingDataTable);
                    // Bloquer le lancement des analyses
                    self.pAnalysisMissingDataWarning.Show();
                    if (datasetSummary.MissingDataPercentage < 20) {
                        // Moins de 20% de données manquantes
                        self.pAnalysisMissingDataWarning.Set(Framework.LocalizationManager.Get("AnalysisMissingDataWarning"));
                        self.divAnalysisMissingDataStrategy.Show();
                        var selectStrategy = Framework.Form.Select.RenderWithLabel(Framework.LocalizationManager.Get("AnalysisMissingDataStrategy"), "", self.missingDataActions, Framework.Form.Validator.NotEmpty(), function (newVal) {
                            if (newVal == "Impute") {
                                var listImputedData = datasetSummary.ImputMissingData();
                                self.ImputData(listImputedData, false);
                                self.pAnalysisMissingDataWarning.Hide();
                                self.divAnalysisMissingDataStrategy.Hide();
                                self.divPivot.HtmlElement.innerHTML = "";
                            }
                            self.btnShowReport.Enable();
                        }, true);
                        self.divAnalysisMissingDataStrategy.Append(selectStrategy);
                    }
                }
                //TODO : mémoriser fonction / appeler fonction
                mw.AddButton(_this.btnShowReport);
                return _this;
                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});
            }
            //TODO : nom du fichier, mémorisation des outputs, publication en tant que rapport
            //TODO : cancel analysis
            //TODO : vérification des paramètres impératifs saisis
            //TODO : blocage bouton analyse tant que analyse pas terminée
            //TODO : barre de progrès
            //TODO : css pour les outputs
            //TODO : copyright / info si version gratuite
            //TODO : fonction adminonly
            //TODO : replaceproducts
            ModalAnalysisViewModel.prototype.OnConnectivityChanged = function (isOnline) {
                //TODO
            };
            return ModalAnalysisViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalAnalysisViewModel = ModalAnalysisViewModel;
        //export class ModalAnalysisViewModel extends PanelLeaderModalViewModel {
        //    //TODO : nom du fichier, mémorisation des outputs, publication en tant que rapport
        //    //TODO : cancel analysis
        //    //TODO : vérification des paramètres impératifs saisis
        //    //TODO : blocage bouton analyse tant que analyse pas terminée
        //    //TODO : barre de progrès
        //    //TODO : css pour les outputs
        //    //TODO : copyright / info si version gratuite
        //    //TODO : fonction adminonly
        //    //TODO : replaceproducts
        //    public OnConnectivityChanged(isOnline: boolean) {
        //        //TODO
        //    }
        //    private divTimeSensTemplates: Framework.Form.TextElement;
        //    private divMyTemplates: Framework.Form.TextElement;
        //    private divPivot: Framework.Form.TextElement;
        //    private divFunctionSelection: Framework.Form.TextElement;
        //    //private divDataSelection: Framework.Form.TextElement;
        //    private pSessions: Framework.Form.TextElement;
        //    private pReplicates: Framework.Form.TextElement;
        //    private pIntakes: Framework.Form.TextElement;
        //    private pProducts: Framework.Form.TextElement;
        //    private pAttributes: Framework.Form.TextElement;
        //    private pSubjects: Framework.Form.TextElement;
        //    private pDataDiagnosis: Framework.Form.TextElement;
        //    private pAnalysisTotalData: Framework.Form.TextElement;
        //    private pAnalysisMissingData: Framework.Form.TextElement;
        //    private pAnalysisMissingDataWarning: Framework.Form.TextElement;
        //    private divAnalysisMissingDataStrategy: Framework.Form.TextElement;
        //    private divAnalysisTemplateSelection: Framework.Form.TextElement;
        //    private divAnalysisDataSelection: Framework.Form.TextElement;
        //    private divAnalysisFunctionSelection: Framework.Form.TextElement;
        //    private selectedTemplate: PanelLeaderModels.AnalysisTemplate = undefined; // Template choisi
        //    private listData: Models.Data[] = [];
        //    private btnShowChooseTemplateStep: Framework.Form.Button;
        //    private btnShowCheckDataStep: Framework.Form.Button;
        //    private btnShowParameterDefinitionStep: Framework.Form.Button;
        //    private btnStartAnalysis: Framework.Form.Button;
        //    private currentAnalysis: PanelLeaderModels.Analysis;
        //    private memorizeAnalysis: boolean = false;
        //    private language: string = "en";
        //    private productLabels: string = "codes"; // codes ou labels
        //    private attributeLabels: string = "codes"; // codes ou labels
        //    private subjectLabels: string = "codes"; // codes ou names ou firstNames
        //    private missingDataActions: Framework.KeyValuePair[] = [
        //        { Value: "Ignore", Key: "IgnoreThisWarning" }, // Ignorer l'avertissement
        //        { Value: "Impute", Key: "ImputeMissingData" }// Imputer les données manquantes (moy juge + moyenne produit) / gmean -> state==completed                          
        //    ];
        //    private sessions: string[];
        //    private replicates: string[];
        //    private intakes: string[];
        //    private products: string[];
        //    private attributes: string[];
        //    private subjects: string[];
        //    //private selectedSessions: string[];
        //    //private selectedReplicates: string[];
        //    //private selectedIntakes: string[];
        //    //private selectedProducts: string[];
        //    //private selectedAttributes: string[];
        //    //private selectedSubjects: string[];
        //    private variables: string[] = ["Replicate"]; //TODO : autres varaibles (age, sexe, question...), intake
        //    private selectedVariables: string[];
        //    private dataType: string;
        //    private dataTypes: string[];
        //    private templates: PanelLeaderModels.AnalysisTemplate[];
        //    public RunAnalysis: (analysis: PanelLeaderModels.Analysis, language: string, dataType: string, listData: Models.Data[], callback: () => void, productLabels, attributeLabels, subjectLabels) => void;
        //    public RemoveAnalysisTemplate: (template: PanelLeaderModels.AnalysisTemplate, callback: () => void) => void; //TODO
        //    public ShowModalSaveAnalysisAsTemplate: (analysis: PanelLeaderModels.Analysis, onComplete: () => void) => void;
        //    public ImputData: (listData: Models.Data[], save: boolean) => void;
        //    constructor(mw: Framework.Modal.Modal, listData: Models.Data[], dataTypes: string[], templates: PanelLeaderModels.AnalysisTemplate[]) {
        //        super(mw);
        //        let self = this;
        //        this.listData = listData;
        //        this.dataTypes = dataTypes;
        //        this.templates = templates;
        //        this.divAnalysisTemplateSelection = Framework.Form.TextElement.Register("divAnalysisTemplateSelection");
        //        this.divAnalysisDataSelection = Framework.Form.TextElement.Register("divAnalysisDataSelection");
        //        this.divAnalysisFunctionSelection = Framework.Form.TextElement.Register("divAnalysisFunctionSelection");
        //        this.divTimeSensTemplates = Framework.Form.TextElement.Register("divTimeSensTemplates");
        //        this.divMyTemplates = Framework.Form.TextElement.Register("divMyTemplates");
        //        this.divPivot = Framework.Form.TextElement.Register("divPivot");
        //        this.divFunctionSelection = Framework.Form.TextElement.Register("divFunctionSelection");
        //        //this.divDataSelection = Framework.Form.TextElement.Register("divDataSelection");
        //        this.btnShowChooseTemplateStep = Framework.Form.Button.Create(() => {
        //            return true;
        //        }, () => { self.showDivTemplateSelection(); }, '<i class="fas fa-arrow-right"></i>', ["btnCircle"], Framework.LocalizationManager.Get("AnalysisTemplate"));
        //        this.btnShowCheckDataStep = Framework.Form.Button.Create(() => {
        //            return self.selectedTemplate != undefined;
        //        }, () => {
        //            self.showDivDataCheck();
        //        }, '<i class="fas fa-arrow-right"></i>', ["btnCircle"], Framework.LocalizationManager.Get("DataSelection"));
        //        this.btnShowParameterDefinitionStep = Framework.Form.Button.Create(() => {
        //            return true;
        //        }, () => {
        //            self.showDivFunctionSelection();
        //        }, '<i class="fas fa-arrow-right"></i>', ["btnCircle"], Framework.LocalizationManager.Get("FunctionSelection"));
        //        this.btnStartAnalysis = Framework.Form.Button.Create(() => {
        //            return true;
        //        }, () => { self.startAnalysis(); }, '<i class="fab fa-r-project"></i>', ["btnCircle"], Framework.LocalizationManager.Get("StartAnalysis"));
        //        this.pDataDiagnosis = Framework.Form.TextElement.Register("pDataDiagnosis");
        //        this.pAnalysisTotalData = Framework.Form.TextElement.Register("pAnalysisTotalData");
        //        this.pAnalysisMissingData = Framework.Form.TextElement.Register("pAnalysisMissingData");
        //        this.pAnalysisMissingDataWarning = Framework.Form.TextElement.Register("pAnalysisMissingDataWarning");
        //        this.divAnalysisMissingDataStrategy = Framework.Form.TextElement.Register("divAnalysisMissingDataStrategy");
        //        this.showDivTemplateSelection();
        //        mw.AddButton(this.btnStartAnalysis);
        //        mw.AddButton(this.btnShowCheckDataStep);
        //        mw.AddButton(this.btnShowChooseTemplateStep);
        //        mw.AddButton(this.btnShowParameterDefinitionStep);
        //        //TODO
        //        //Framework.ShortcutManager.Add({
        //        //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
        //        //        self.btnImport.Click();
        //        //    }
        //        //});
        //    }
        //    private showDivTemplateSelection(): void {
        //        this.btnStartAnalysis.Hide();
        //        this.btnShowCheckDataStep.Show();
        //        this.btnShowChooseTemplateStep.Hide();
        //        this.btnShowParameterDefinitionStep.Hide();
        //        this.divAnalysisTemplateSelection.Show();
        //        this.divAnalysisDataSelection.Hide();
        //        this.divAnalysisFunctionSelection.Hide();
        //        this.mw.SetTitle(Framework.LocalizationManager.Get("Analysis") + " - " + Framework.LocalizationManager.Get("SelectAnalysisTemplate"));
        //        let self = this;
        //        this.divTimeSensTemplates.HtmlElement.innerHTML = "";
        //        this.divMyTemplates.HtmlElement.innerHTML = "";
        //        //let dataTypes: string[] = this.controller.Session.GetDataTypes();
        //        //self.controller.GetAnalysisTemplates((dataTypes: string[], templates: PanelLeaderModels.AnalysisTemplate[]) => {
        //        // Templates TimeSens adaptés au type de données de la séance
        //        let timeSensTemplates: PanelLeaderModels.AnalysisTemplate[] = [];
        //        this.dataTypes.forEach((x) => {
        //            let dataTemplates = PanelLeaderModels.AnalysisTemplate.Templates.filter((y) => { return y.DataType == x });
        //            dataTemplates.forEach((y) => {
        //                timeSensTemplates.push(y);
        //            });
        //        });
        //        let cards: Framework.Form.Card[] = [];
        //        let setSelectedTemplate = (template: PanelLeaderModels.AnalysisTemplate) => {
        //            self.setSelectedTemplate(template);
        //            cards.forEach((c) => {
        //                c.TextElement.HtmlElement.classList.remove("selected");
        //            });
        //            self.btnShowCheckDataStep.CheckState();
        //        };
        //        timeSensTemplates.forEach((template) => {
        //            let card = Framework.Form.Card.Create(Framework.LocalizationManager.Get(template.LabelKey), Framework.LocalizationManager.Get(template.DataType), () => {
        //                setSelectedTemplate(template);
        //                card.TextElement.HtmlElement.classList.add("selected");
        //            });
        //            self.divTimeSensTemplates.Append(card.TextElement);
        //            cards.push(card);
        //        });
        //        if (this.templates.length == 0) {
        //            this.divMyTemplates.Set(Framework.LocalizationManager.Get("NoCustomTemplate"));
        //        }
        //        this.templates.forEach((x) => {
        //            let card = Framework.Form.Card.Create(Framework.LocalizationManager.Get(x.LabelKey), Framework.LocalizationManager.Get(x.DataType), () => {
        //                setSelectedTemplate(x);
        //                card.TextElement.HtmlElement.classList.add("selected");
        //            });
        //            self.divMyTemplates.Append(card.TextElement);
        //            cards.push(card);
        //        });
        //        //TODO
        //        //if (template.Label.length > 0) {
        //        //    // Custom Template
        //        //    let btnDelete = Framework.Form.Button.Create(() => { return true; }, () => {
        //        //        self.controller.RemoveAnalysisTemplate(template, () => {
        //        //            self.divMyTemplates.HtmlElement.removeChild(card.HtmlElement);
        //        //        });
        //        //    }, "", ["templateCardDeleteButton"], Framework.LocalizationManager.Get("Delete"));
        //        //    btnDelete.HtmlElement.innerHTML = '<i class="fas fa-trash-alt"></i>';
        //        //    cbody.Append(btnDelete);
        //        //}
        //        //});
        //    }
        //    private setSelectedTemplate(template: PanelLeaderModels.AnalysisTemplate) {
        //        let self = this;
        //        self.selectedTemplate = template;
        //        if (self.selectedTemplate.Json.length > 0) {
        //            // Custom Template                    
        //            self.currentAnalysis = Framework.Factory.Create(PanelLeaderModels.Analysis, self.selectedTemplate.Json);
        //        } else {
        //            // TimeSens Template
        //            PanelLeaderModels.Analysis.FromJSON(self.selectedTemplate.JsonFile, (analysis: PanelLeaderModels.Analysis) => {
        //                self.currentAnalysis = analysis;
        //            });
        //        }
        //        //let typeArray = Object.keys(Models.DataType).map(function (type) {
        //        //    return Models.DataType[type];
        //        //});
        //        //let dataType = typeArray.indexOf(template.DataType);
        //        //self.dataType = Models.DataType[dataType];
        //        //self.listData = self.controller.Session.ListData.filter((d) => { return d.Type == dataType.toString(); });
        //        self.sessions = Framework.Array.Unique(self.listData.map((x) => { return x.Session.toString() }));
        //        //self.selectedSessions = self.sessions;
        //        self.replicates = Framework.Array.Unique(self.listData.map((x) => { return x.Replicate.toString() }));
        //        //self.selectedReplicates = self.replicates;
        //        self.intakes = Framework.Array.Unique(self.listData.map((x) => {
        //            if (x.Intake) {
        //                return x.Intake.toString()
        //            } else { return "1"; }
        //        }));
        //        //self.selectedIntakes = self.intakes;
        //        self.products = Framework.Array.Unique(self.listData.map((x) => { return x.ProductCode }));
        //        //self.selectedProducts = self.products;
        //        self.attributes = Framework.Array.Unique(self.listData.map((x) => { return x.AttributeCode }));
        //        //self.selectedAttributes = self.attributes;
        //        self.subjects = Framework.Array.Unique(self.listData.map((x) => { return x.SubjectCode }));
        //        //self.selectedSubjects = self.subjects;
        //        self.selectedVariables = [];
        //        //TODO : activer bouton next
        //        //self.tabAnalysisDataSelection.Enable();
        //        //self.tabAnalysisDataSelection.Click();
        //    }
        //    //private showDivDataSelection(): void {
        //    //    this.divAnalysisTemplateSelection.Hide();
        //    //    this.divAnalysisDataSelection.Show();
        //    //    this.divAnalysisFunctionSelection.Hide();
        //    //    this.btnStartAnalysis.Hide();
        //    //    this.btnShowCheckDataStep.Hide();
        //    //    this.btnShowChooseTemplateStep.Hide();
        //    //    this.btnShowParameterDefinitionStep.Show();
        //    //    let self = this;
        //    //    this.divDataSelection.HtmlElement.innerHTML = "";
        //    //    //let setTabState = function () {
        //    //    //    self.tabAnalysisTemplateSelection.Disable();
        //    //    //    self.tabAnalysisFunctionSelection.Disable();
        //    //    //    self.tabAnalysisDataSelection.Disable();
        //    //    //    if (self.selectedSessions.length > 0 && self.selectedReplicates.length > 0 && self.selectedIntakes.length > 0 && self.selectedSubjects.length > 0 && self.selectedAttributes.length > 0 && self.selectedProducts.length > 0) {
        //    //    //        self.tabAnalysisTemplateSelection.Enable();
        //    //    //        self.tabAnalysisFunctionSelection.Enable();
        //    //    //        self.tabAnalysisDataSelection.Enable();
        //    //    //    }
        //    //    //}
        //    //    if (this.sessions.length > 1) {
        //    //        let selectSessions = Framework.Form.Select.RenderMultipleWithLabel("Sessions", this.selectedSessions, Framework.KeyValuePair.FromArray(this.sessions), Framework.Form.Validator.NotEmpty(), (newVal, select) => {
        //    //            self.selectedSessions = newVal;
        //    //            self.showDivDataCheck();
        //    //            //setTabState();
        //    //        }, false, ["selectWithLabel"], )
        //    //        this.divDataSelection.Append(selectSessions);
        //    //    }
        //    //    if (this.replicates.length > 1) {
        //    //        let selectReplicates = Framework.Form.Select.RenderMultipleWithLabel(Framework.LocalizationManager.Get("Replicates"), this.selectedReplicates, Framework.KeyValuePair.FromArray(this.replicates), Framework.Form.Validator.NotEmpty(), (newVal, select) => {
        //    //            self.selectedReplicates = newVal;
        //    //            self.showDivDataCheck();
        //    //            //setTabState();
        //    //        }, false, ["selectWithLabel"], )
        //    //        this.divDataSelection.Append(selectReplicates);
        //    //    }
        //    //    if (this.intakes.length > 1) {
        //    //        let selectIntakes = Framework.Form.Select.RenderMultipleWithLabel(Framework.LocalizationManager.Get("Intakes"), this.selectedIntakes, Framework.KeyValuePair.FromArray(this.intakes), Framework.Form.Validator.NotEmpty(), (newVal, select) => {
        //    //            self.selectedIntakes = newVal;
        //    //            self.showDivDataCheck();
        //    //            //setTabState();
        //    //        }, false, ["selectWithLabel"], )
        //    //        this.divDataSelection.Append(selectIntakes);
        //    //    }
        //    //    if (this.subjects.length > 1) {
        //    //        let selectSubjects = Framework.Form.Select.RenderMultipleWithLabel(Framework.LocalizationManager.Get("Subjects"), this.selectedSubjects, Framework.KeyValuePair.FromArray(this.subjects), Framework.Form.Validator.NotEmpty(), (newVal, select) => {
        //    //            self.selectedSubjects = newVal;
        //    //            self.showDivDataCheck();
        //    //            //setTabState();
        //    //        }, false, ["selectWithLabel"], )
        //    //        this.divDataSelection.Append(selectSubjects);
        //    //    }
        //    //    if (this.products.length > 1) {
        //    //        let selectProducts = Framework.Form.Select.RenderMultipleWithLabel(Framework.LocalizationManager.Get("Products"), this.selectedProducts, Framework.KeyValuePair.FromArray(this.products), Framework.Form.Validator.NotEmpty(), (newVal, select) => {
        //    //            self.selectedProducts = newVal;
        //    //            self.showDivDataCheck();
        //    //            //setTabState();
        //    //        }, false, ["selectWithLabel"])
        //    //        this.divDataSelection.Append(selectProducts);
        //    //    }
        //    //    if (this.attributes.length > 1) {
        //    //        let selectAttributes = Framework.Form.Select.RenderMultipleWithLabel(Framework.LocalizationManager.Get("Attributes"), this.selectedAttributes, Framework.KeyValuePair.FromArray(this.attributes), Framework.Form.Validator.NotEmpty(), (newVal, select) => {
        //    //            self.selectedAttributes = newVal;
        //    //            self.showDivDataCheck();
        //    //            //setTabState();
        //    //        }, false, ["selectWithLabel"], )
        //    //        this.divDataSelection.Append(selectAttributes);
        //    //    }
        //    //    if (this.variables.length > 0) {
        //    //        let selectVariables = Framework.Form.Select.RenderMultipleWithLabel(Framework.LocalizationManager.Get("Variables"), this.selectedVariables, Framework.KeyValuePair.FromArray(this.variables), Framework.Form.Validator.NotEmpty(), (newVal, select) => {
        //    //            self.selectedVariables = newVal;
        //    //            self.showDivDataCheck();
        //    //            //setTabState();
        //    //        }, false, ["selectWithLabel"], )
        //    //        this.divDataSelection.Append(selectVariables);
        //    //    }
        //    //}
        //    private showDivDataCheck(): void {
        //        this.mw.SetTitle(Framework.LocalizationManager.Get("Analysis") + " - " + Framework.LocalizationManager.Get("DataCheck"));
        //        this.divAnalysisTemplateSelection.Hide();
        //        this.divAnalysisDataSelection.Show();
        //        this.divAnalysisFunctionSelection.Hide();
        //        this.btnStartAnalysis.Hide();
        //        this.btnShowCheckDataStep.Hide();
        //        this.btnShowChooseTemplateStep.Hide();
        //        this.btnShowParameterDefinitionStep.Show();
        //        this.divPivot.HtmlElement.innerHTML = "";
        //        this.divAnalysisMissingDataStrategy.HtmlElement.innerHTML = "";
        //        let self = this;
        //        this.pSessions = Framework.Form.TextElement.Register("pSessions", Framework.LocalizationManager.Format("Sessions:", [this.sessions.length.toString(), this.sessions.join(', ')]));
        //        this.pReplicates = Framework.Form.TextElement.Register("pReplicates", Framework.LocalizationManager.Format("Replicates:", [this.replicates.length.toString(), this.replicates.join(', ')]));
        //        this.pIntakes = Framework.Form.TextElement.Register("pIntakes", Framework.LocalizationManager.Format("Intakes:", [this.intakes.length.toString(), this.intakes.join(', ')]));
        //        this.pProducts = Framework.Form.TextElement.Register("pProducts", Framework.LocalizationManager.Format("Products:", [this.products.length.toString(), this.products.join(', ')]));
        //        this.pAttributes = Framework.Form.TextElement.Register("pAttributes", Framework.LocalizationManager.Format("Attributes:", [this.attributes.length.toString(), this.attributes.join(', ')]));
        //        this.pSubjects = Framework.Form.TextElement.Register("pSubjects", Framework.LocalizationManager.Format("Subjects:", [this.subjects.length.toString(), this.subjects.join(', ')]));
        //        this.pAnalysisMissingData.Hide();
        //        this.pAnalysisMissingDataWarning.Hide();
        //        this.divAnalysisMissingDataStrategy.Hide();
        //        //let listData = this.listData.filter((x) => {
        //        //    let res = self.selectedProducts.indexOf(x.ProductCode) > -1 &&
        //        //        self.selectedAttributes.indexOf(x.AttributeCode) > -1 &&
        //        //        self.selectedSubjects.indexOf(x.SubjectCode) > -1 &&
        //        //        self.selectedSessions.indexOf(x.Session.toString()) > -1 &&
        //        //        //self.selectedIntakes.indexOf(x.Intake.toString()) > -1 && //TOFIX
        //        //        self.selectedReplicates.indexOf(x.Replicate.toString()) > -1;
        //        //    return res;
        //        //});
        //        // Diagnostic des données
        //        let datasetSummary = new PanelLeaderModels.DatasetSummary(this.listData);
        //        //self.tabAnalysisFunctionSelection.Enable();
        //        self.btnStartAnalysis.Enable();
        //        this.pDataDiagnosis.Set(Framework.LocalizationManager.Get("CompleteAndBalanceDataset"));
        //        self.pAnalysisTotalData.Set(Framework.LocalizationManager.Format("AnalysisTotalDataCount", [datasetSummary.DataCount.toString(), datasetSummary.ExpectedDataCount.toString()]));
        //        if (datasetSummary.MissingDataCount > 0) {
        //            this.pDataDiagnosis.Set(Framework.LocalizationManager.Get("UncompleteOrUnbalanceDataset"));
        //            this.btnShowParameterDefinitionStep.Disable();
        //            this.divPivot.HtmlElement.appendChild(datasetSummary.MissingDataTable);
        //            // Bloquer le lancement des analyses
        //            //self.tabAnalysisFunctionSelection.Disable();
        //            let prct: number = Math.round(datasetSummary.MissingDataCount / datasetSummary.ExpectedDataCount * 10000) / 100;
        //            self.pAnalysisMissingData.Set(Framework.LocalizationManager.Format("AnalysisMissingDataCount", [datasetSummary.MissingDataCount.toString(), prct.toString()]));
        //            self.pAnalysisMissingData.Show();
        //            self.pAnalysisMissingDataWarning.Show();
        //            if (prct < 20) {
        //                // Moins de 20% de données manquantes
        //                self.pAnalysisMissingDataWarning.Set(Framework.LocalizationManager.Get("AnalysisMissingDataWarning"));
        //                self.divAnalysisMissingDataStrategy.Show();
        //                let selectStrategy = Framework.Form.Select.RenderWithLabel(Framework.LocalizationManager.Get("AnalysisMissingDataStrategy"), "", self.missingDataActions, Framework.Form.Validator.NotEmpty(), (newVal: string) => {
        //                    if (newVal == "Impute") {
        //                        let listImputedData: Models.Data[] = datasetSummary.ImputMissingData();
        //                        self.ImputData(listImputedData, false);
        //                        self.pAnalysisTotalData.Set(Framework.LocalizationManager.Format("AnalysisImputedDataCount", [listImputedData.length.toString(), (Math.round(listImputedData.length / datasetSummary.ExpectedDataCount * 10000) / 100).toString()]));
        //                        self.pAnalysisMissingData.Hide();
        //                        self.pAnalysisMissingDataWarning.Hide();
        //                        self.divAnalysisMissingDataStrategy.Hide();
        //                        self.divPivot.HtmlElement.innerHTML = "";
        //                    }
        //                    //self.tabAnalysisFunctionSelection.Enable();
        //                    //self.btnStartAnalysis.Enable();
        //                    self.btnShowParameterDefinitionStep.Enable();
        //                }, true);
        //                self.divAnalysisMissingDataStrategy.Append(selectStrategy);
        //            } else {
        //                self.pAnalysisMissingData.Set(Framework.LocalizationManager.Get("AnalysisMissingDataTooMuch"));
        //            }
        //        }
        //    }
        //    private setCurrentAnalysisForm() {
        //        let setOptions = function (rp: PanelLeaderModels.AnalysisFunctionParameter, div: Framework.Form.TextElement) {
        //            div.HtmlElement.innerHTML = "";
        //            let options = rp.Options.filter((x) => {
        //                return x.Key == rp.SelectedOption;
        //            });
        //            options[0].OptionParameters.forEach((op) => {
        //                if (op.SpecialValue) {
        //                    if (op.SpecialValue == "$Products") {
        //                        op.Values = Framework.KeyValuePair.FromArray(self.products);
        //                    }
        //                }
        //                if (op.Values) {
        //                    let label = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get(op.Label), ["analysisOptionLabel"]);
        //                    div.Append(label);
        //                    let select = Framework.Form.Select.Render(op.SelectedValue, op.Values, Framework.Form.Validator.NotEmpty(), (newVal: string, elt: Framework.Form.Select) => {
        //                    }, false, ["analysisSelect"], { Object: op, Property: "SelectedValue" });
        //                    div.Append(select);
        //                    let clearer = Framework.Form.TextElement.Create("");
        //                    clearer.HtmlElement.style.clear = "both";
        //                    div.Append(clearer);
        //                }
        //            });
        //        }
        //        let self = this;
        //        self.currentAnalysis.Functions.forEach((f) => {
        //            let accordion: Framework.Form.Accordion = Framework.Form.Accordion.Create(Framework.LocalizationManager.Get(f.Label), ["analysisGroup"], f.IsOpen, "left");
        //            self.divFunctionSelection.Append(accordion);
        //            f.Parameters.forEach((rp) => {
        //                let values: Framework.KeyValuePair[] = [];
        //                if (rp.Options) {
        //                    rp.Options.forEach((x) => {
        //                        values.push({ Key: Framework.LocalizationManager.Get(x.Label), Value: x.Key })
        //                    });
        //                }
        //                let label = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get(rp.Label), ["analysisParameterLabel"]);
        //                accordion.Append(label.HtmlElement);
        //                //TODO : Afficher + seulement si options disponibles
        //                label.HtmlElement.onclick = () => {
        //                    optionsDiv.ToggleVisibility();
        //                    label.HtmlElement.classList.toggle("opened");
        //                }
        //                let select = Framework.Form.Select.Render(rp.SelectedOption, values, Framework.Form.Validator.NotEmpty(), (newVal: string, elt: Framework.Form.Select) => {
        //                    setOptions(rp, optionsDiv);
        //                }, false, ["analysisSelect"], { Object: rp, Property: "SelectedOption" });
        //                accordion.Append(select.HtmlElement);
        //                let clearer = Framework.Form.TextElement.Create("");
        //                clearer.HtmlElement.style.clear = "both";
        //                accordion.Append(clearer.HtmlElement);
        //                let optionsDiv = Framework.Form.TextElement.Create("");
        //                accordion.Append(optionsDiv.HtmlElement);
        //                optionsDiv.Hide();
        //                setOptions(rp, optionsDiv);
        //            });
        //        });
        //        // Options
        //        let accordion: Framework.Form.Accordion = Framework.Form.Accordion.Create(Framework.LocalizationManager.Get("Options"), ["analysisGroup"], false, "left");
        //        self.divFunctionSelection.Append(accordion);
        //        let label0 = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("By"), ["analysisParameterLabel"]);
        //        accordion.Append(label0.HtmlElement);
        //        let selectBy = Framework.Form.Select.Render("", Framework.KeyValuePair.FromArray(this.variables), Framework.Form.Validator.NotEmpty(), (newVal: string) => {
        //            self.variables = [newVal];
        //        }, false, ["analysisSelect"]);
        //        accordion.Append(selectBy.HtmlElement);
        //        let clearer0 = Framework.Form.TextElement.Create("");
        //        clearer0.HtmlElement.style.clear = "both";
        //        accordion.Append(clearer0.HtmlElement);
        //        let label1 = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("Language"), ["analysisParameterLabel"]);
        //        accordion.Append(label1.HtmlElement);
        //        let selectLanguage = Framework.Form.Select.Render(Framework.LocalizationManager.GetDisplayLanguage(), [{ Key: "English", Value: "en" }, { Key: "Français", Value: "fr" }], Framework.Form.Validator.NotEmpty(), (newVal: string) => {
        //            self.language = newVal;
        //        }, false, ["analysisSelect"]);
        //        accordion.Append(selectLanguage.HtmlElement);
        //        let clearer1 = Framework.Form.TextElement.Create("");
        //        clearer1.HtmlElement.style.clear = "both";
        //        accordion.Append(clearer1.HtmlElement);
        //        let label2 = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("ProductLabels"), ["analysisParameterLabel"]);
        //        accordion.Append(label2.HtmlElement);
        //        let selectProductLabels = Framework.Form.Select.Render("codes", [{ Key: "Code", Value: "codes" }, { Key: "Label", Value: "labels" }], Framework.Form.Validator.NotEmpty(), (newVal: string) => {
        //            self.productLabels = newVal;
        //        }, false, ["analysisSelect"]);
        //        accordion.Append(selectProductLabels.HtmlElement);
        //        let clearer2 = Framework.Form.TextElement.Create("");
        //        clearer2.HtmlElement.style.clear = "both";
        //        accordion.Append(clearer2.HtmlElement);
        //        let label3 = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("AttributeLabels"), ["analysisParameterLabel"]);
        //        accordion.Append(label3.HtmlElement);
        //        let selectAttributeLabels = Framework.Form.Select.Render("codes", [{ Key: "Code", Value: "codes" }, { Key: "Label", Value: "labels" }], Framework.Form.Validator.NotEmpty(), (newVal: string) => {
        //            self.attributeLabels = newVal;
        //        }, false, ["analysisSelect"]);
        //        accordion.Append(selectAttributeLabels.HtmlElement);
        //        let clearer3 = Framework.Form.TextElement.Create("");
        //        clearer3.HtmlElement.style.clear = "both";
        //        accordion.Append(clearer3.HtmlElement);
        //        let label4 = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("SubjectLabels"), ["analysisParameterLabel"]);
        //        accordion.Append(label4.HtmlElement);
        //        let selectSubjectLabels = Framework.Form.Select.Render("codes", [{ Key: "Code", Value: "codes" }, { Key: "LastName", Value: "LastName" }, { Key: "FirstName", Value: "FirstName" }], Framework.Form.Validator.NotEmpty(), (newVal: string) => {
        //            self.subjectLabels = newVal;
        //        }, false, ["analysisSelect"]);
        //        accordion.Append(selectSubjectLabels.HtmlElement);
        //        let clearer4 = Framework.Form.TextElement.Create("");
        //        clearer4.HtmlElement.style.clear = "both";
        //        accordion.Append(clearer4.HtmlElement);
        //        let label5 = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("MemorizeAnalysis"), ["analysisParameterLabel"]);
        //        accordion.Append(label5.HtmlElement);
        //        let selectMemorizeAnalysis = Framework.Form.Select.Render("False", [{ Key: "TRUE", Value: "True" }, { Key: "FALSE", Value: "False" }], Framework.Form.Validator.NotEmpty(), (newVal: string) => {
        //            self.memorizeAnalysis = newVal == "True";
        //        }, false, ["analysisSelect"]);
        //        accordion.Append(selectMemorizeAnalysis.HtmlElement);
        //        let clearer5 = Framework.Form.TextElement.Create("");
        //        clearer5.HtmlElement.style.clear = "both";
        //        accordion.Append(clearer5.HtmlElement);
        //    }
        //    private showDivFunctionSelection(): void {
        //        this.mw.SetTitle(Framework.LocalizationManager.Get("Analysis") + " - " + Framework.LocalizationManager.Get("FunctionSelection"));
        //        this.divAnalysisTemplateSelection.Hide();
        //        this.divAnalysisDataSelection.Hide();
        //        this.divAnalysisFunctionSelection.Show();
        //        this.btnStartAnalysis.Show();
        //        this.btnShowCheckDataStep.Hide();
        //        this.btnShowChooseTemplateStep.Hide();
        //        this.btnShowParameterDefinitionStep.Hide();
        //        let self = this;
        //        this.divFunctionSelection.HtmlElement.innerHTML = "";
        //        self.setCurrentAnalysisForm();
        //    }
        //    private startAnalysis() {
        //        let self = this;
        //        if (this.memorizeAnalysis == true) {
        //            self.ShowModalSaveAnalysisAsTemplate(self.currentAnalysis, () => { self.runAnalysis() });
        //            //let div = Framework.Form.TextElement.Create();
        //            ////TODO : by variable + ajouter modalités comme session, intake, rep + capture des erreurs
        //            //let templateNames = [];
        //            //let modal: Framework.Modal;
        //            //let textName = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("TemplateName"), ["inlineInput"]);
        //            //div.Append(textName);
        //            //let customValidatorTemplateName: Framework.Form.Validator.CustomValidator = Framework.Form.Validator.Custom((value: any) => {
        //            //    let res = "";
        //            //    if (value.length < 6) {
        //            //        res = Framework.LocalizationManager.Get("TemplateNameMin6Characters");
        //            //    }
        //            //    if (templateNames.indexOf(value) > -1) {
        //            //        res = Framework.LocalizationManager.Get("TemplateNameAlreayExists");
        //            //    }
        //            //    return res;
        //            //});
        //            //let inputName = Framework.Form.InputText.Create("", () => {
        //            //    okButton.CheckState();
        //            //}, customValidatorTemplateName, true, ["inlineInput"]);
        //            //div.Append(inputName);
        //            //let textDescription = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("Description"), ["inlineInput"]);
        //            //div.Append(textDescription);
        //            //let inputDescription = Framework.Form.InputText.Create("", () => {
        //            //    okButton.CheckState();
        //            //}, Framework.Form.Validator.MinLength(6), true, ["inlineInput"]);
        //            //div.Append(inputDescription);
        //            //let cancelButton = Framework.Form.Button.Create(() => { return true; }, () => { modal.Close(); }, Framework.LocalizationManager.Get("Cancel"), ["btnCircle"]);
        //            //let okButton = Framework.Form.Button.Create(() => {
        //            //    return inputName.IsValid && inputDescription.IsValid;
        //            //}, () => {
        //            //    let template: PanelLeaderModels.AnalysisTemplate = new PanelLeaderModels.AnalysisTemplate();
        //            //    template.DataType = self.selectedTemplate.DataType;
        //            //    template.Label = inputName.Value;
        //            //    template.Description = inputDescription.Value;
        //            //    template.Json = JSON.stringify(self.currentAnalysis);
        //            //    self.controller.SaveAnalysisTemplate(template, () => {
        //            //        modal.Close();
        //            //        self.runAnalysis();
        //            //    });
        //            //    //self.controller.LocalDB.SaveAnalysisTemplate(template).then(() => {
        //            //    //    modal.Close();
        //            //    //    self.runAnalysis();
        //            //    //});
        //            //}, Framework.LocalizationManager.Get("OK"), ["btnCircle"]);
        //            //self.controller.GetAnalysisTemplateNames((names: string[]) => {
        //            //    templateNames = names;
        //            //    modal = Framework.Modal.Show(div.HtmlElement, Framework.LocalizationManager.Get("SaveAsAnalysisTemplate"), [cancelButton, okButton]);
        //            //});
        //        } else {
        //            this.runAnalysis();
        //        }
        //    }
        //    public EnableAnalysisButton() {
        //        this.btnStartAnalysis.Enable();
        //    }
        //    private runAnalysis() {
        //        //TODO : check paramètres impératifs
        //        let self = this;
        //        this.btnStartAnalysis.Disable();
        //        this.RunAnalysis(this.currentAnalysis, this.language, this.selectedTemplate.DataType, this.listData, () => {
        //            self.EnableAnalysisButton();
        //        }, this.productLabels, this.attributeLabels, this.subjectLabels);
        //        ////TODO : traitement des variables supplémentaires -> variable ByVariable
        //        ////TODO : attention aux caractères spéciaux
        //        //let self = this;
        //        //let listData = this.listData;
        //        ////if (this.productLabels == "labels" || this.attributeLabels == "labels" || this.subjectLabels == "firstNames" || this.subjectLabels == "lastNames") {
        //        //listData.forEach((x) => {
        //        //    // Variable(s) supplémentaire (session par défaut)                    
        //        //    x["ByVariable"] = "Session " + x.Session;
        //        //    if (this.selectedVariables.length > 0) {
        //        //        //TODO
        //        //        if (this.selectedVariables.indexOf("Replicate") > -1) {
        //        //            x["ByVariable"] += ", Replicate " + x.Replicate;
        //        //        }
        //        //    }
        //        //    if (this.productLabels == "labels") {
        //        //        let label = self.controller.Session.ListProducts.filter((p) => { return p.Code == x.ProductCode })[0].Description;
        //        //        if (label.length > 0) {
        //        //            x.ProductCode = label;
        //        //        }
        //        //    }
        //        //    if (this.attributeLabels == "labels") {
        //        //        //TODO
        //        //        //let label = self.controller.Session.ListAttributes.filter((a) => { return a.Code == x.AttributeCode })[0].Label;
        //        //        //if (label.length > 0) {
        //        //        //    x.AttributeCode = label;
        //        //        //}
        //        //    }
        //        //    let label = "";
        //        //    if (this.subjectLabels == "firstNames") {
        //        //        label = self.controller.Session.ListSubjects.filter((s) => { return s.Code == x.SubjectCode })[0].FirstName;
        //        //    }
        //        //    if (this.subjectLabels == "lastNames") {
        //        //        label = self.controller.Session.ListSubjects.filter((s) => { return s.Code == x.SubjectCode })[0].LastName;
        //        //    }
        //        //    if (label.length > 0) {
        //        //        x.SubjectCode = label;
        //        //    }
        //        //});
        //        ////}
        //        //let script: string = PanelLeaderModels.Analysis.GetRCode(this.currentAnalysis, listData, this.language, this.controller.Session.GetProductColors(), this.controller.Session.GetAttributeColors());
        //        //this.btnStartAnalysis.Disable();
        //        //this.controller.RunRScript(script, this.selectedTemplate.DataType, () => {
        //        //    self.EnableAnalysisButton();
        //        //});
        //    }
        //    public CheckState() {
        //        //TODO : vérif de l'état de chaque vue après lock/unlock
        //    }
        //}
        var ModalSaveMailAsTemplateViewModel = /** @class */ (function (_super) {
            __extends(ModalSaveMailAsTemplateViewModel, _super);
            function ModalSaveMailAsTemplateViewModel(mw, templates) {
                var _this = _super.call(this, mw) || this;
                var self = _this;
                var div = document.createElement("div");
                var p = document.createElement("p");
                p.innerText = Framework.LocalizationManager.Get("TemplateName");
                div.appendChild(p);
                var inputText = Framework.Form.InputText.Create("", function () {
                    btnSave.CheckState();
                }, Framework.Form.Validator.Unique(templates.map(function (x) { return x.Label; })), false, ["blockForm"]);
                div.appendChild(inputText.HtmlElement);
                var p1 = document.createElement("p");
                p1.innerText = Framework.LocalizationManager.Get("Description");
                div.appendChild(p1);
                var inputDescription = Framework.Form.InputText.Create("", function () {
                }, Framework.Form.Validator.NoValidation(), false, ["blockForm"]);
                div.appendChild(inputDescription.HtmlElement);
                var cb = Framework.Form.CheckBox.Create(function () { return true; }, function () { }, Framework.LocalizationManager.Get("DefaultTemplate"), "", false, ["blockForm"]);
                div.appendChild(cb.HtmlElement);
                var btnSave = Framework.Form.Button.Create(function () {
                    return inputText.IsValid == true;
                }, function () {
                    var template = new PanelLeaderModels.MailTemplate();
                    template.Description = inputDescription.Value;
                    template.Label = inputText.Value;
                    //TODO
                    //template.DisplayedName = this.inputMailDisplayName.Value;
                    //template.Body = this.inputMailContent.HtmlElement.innerHTML;
                    //template.Subject = this.inputMailSubject.Value;
                    //template.ReturnMailAddress = this.inputMailReturnAddress.Value;
                    //template.IsDefault = isDefault;
                    //self.mailTemplatesDB.SaveMailTemplate(template).then(() => { mw.Close(); callback(); });
                    self.OnSave(template);
                    mw.Close();
                }, "", ["btnCircle"], Framework.LocalizationManager.Get("Save"));
                var btnCancel = Framework.Form.Button.Create(function () { return true; }, function () {
                    mw.Close();
                }, "", ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                mw.AddButton(btnCancel);
                mw.AddButton(btnSave);
                mw.Body.appendChild(div);
                //TODO
                Framework.ShortcutManager.Add(function () { return self.mw.IsVisible; }, 13, function () { btnSave.Click(); });
                return _this;
            }
            return ModalSaveMailAsTemplateViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalSaveMailAsTemplateViewModel = ModalSaveMailAsTemplateViewModel;
        var ModalEditDesignRanksViewModel = /** @class */ (function (_super) {
            __extends(ModalEditDesignRanksViewModel, _super);
            function ModalEditDesignRanksViewModel(mw, design, onChange) {
                var _this = _super.call(this, mw) || this;
                var self = _this;
                var nbRanks = design.NbReplicates * design.NbItems;
                var codes = [];
                design.ListItems.forEach(function (x) {
                    x.Labels.forEach(function (kvp) {
                        codes.push(x.Code + "-" + kvp.Key);
                    });
                });
                var ranks = [];
                ranks.push(new Framework.KeyValuePair("-", "0"));
                for (var i = 1; i <= nbRanks; i++) {
                    ranks.push(new Framework.KeyValuePair(i, i));
                }
                var div = Framework.Form.TextElement.Create("");
                var p0 = document.createElement("p");
                p0.innerText = Framework.LocalizationManager.Get("ForSelectedPanelists");
                div.HtmlElement.appendChild(p0);
                var p1 = document.createElement("p");
                div.HtmlElement.appendChild(p1);
                var lb1 = document.createElement("label");
                lb1.style.width = "200px";
                lb1.innerText = Framework.LocalizationManager.Get("Move");
                p1.appendChild(lb1);
                var selectItemCodeForDesign = Framework.Form.Select.Render("", Framework.KeyValuePair.FromArray(codes), Framework.Form.Validator.NotEmpty(), function (x) { }, false);
                selectItemCodeForDesign.HtmlElement.style.width = "200px";
                p1.appendChild(selectItemCodeForDesign.HtmlElement);
                var p2 = document.createElement("p");
                div.HtmlElement.appendChild(p2);
                var lb2 = document.createElement("label");
                lb2.style.width = "200px";
                lb2.innerText = Framework.LocalizationManager.Get("AtRank");
                p2.appendChild(lb2);
                var selectItemRankForDesign = Framework.Form.Select.Render("", ranks, Framework.Form.Validator.NotEmpty(), function (x) { }, false);
                selectItemRankForDesign.HtmlElement.style.width = "200px";
                p2.appendChild(selectItemRankForDesign.HtmlElement);
                var okButton = Framework.Form.Button.Create(function () { return true; }, function () {
                    var p = selectItemCodeForDesign.Value.split('-');
                    onChange(p[0], p[1], Number(selectItemRankForDesign.Value));
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("OK"));
                //okButton.HtmlElement.style.cssFloat = "right";
                //div.Append(button);
                var cancelButton = Framework.Form.Button.Create(function () { return true; }, function () {
                    mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                mw.AddButton(cancelButton);
                mw.AddButton(okButton);
                mw.Body.appendChild(div.HtmlElement);
                mw.Float('top');
                return _this;
            }
            return ModalEditDesignRanksViewModel;
        }(PanelLeaderModalViewModel));
        ViewModels.ModalEditDesignRanksViewModel = ModalEditDesignRanksViewModel;
    })(ViewModels = PanelLeader.ViewModels || (PanelLeader.ViewModels = {}));
})(PanelLeader || (PanelLeader = {}));
//# sourceMappingURL=app.js.map