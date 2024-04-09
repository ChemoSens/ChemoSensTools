module PanelLeader {

    export class PanelLeaderApp extends Framework.App {

        protected currentViewContainerName: string = "currentView";
        protected currentViewModel: ViewModels.PanelLeaderViewModel;
        protected currentContainer: HTMLElement;

        private commandInvoker: Framework.CommandInvoker;
        private session: PanelLeaderModels.Session;
        private account: Models.Account;
        private menuViewModel: ViewModels.MenuViewModel;

        private warnings: string[] = [];
        private isSaving: boolean = false;
        private isSaved: boolean = true;

        private dbSessionShortcut: Framework.Database.ServerDB;
        private dbDirectory: Framework.Database.ServerDB;
        private dbSession: Framework.Database.ServerDB;
        private dbSubjectCustomField: Framework.Database.ServerDB;
        private dbSubject: Framework.Database.ServerDB;
        private dbProductCustomField: Framework.Database.ServerDB;
        private dbProduct: Framework.Database.ServerDB;
        private dbAttributeCustomField: Framework.Database.ServerDB;
        private dbAttribute: Framework.Database.ServerDB;

        public get DbSubject() {
            return this.dbSubject;
        }

        public get License() {
            return this.account;
        }

        public OnLogin: () => void = () => { }

        constructor(isInTest: boolean = false) {
            super(PanelLeader.PanelLeaderApp.GetRequirements(), isInTest);
        }

        public static GetRequirements(): Framework.ModuleRequirements {
            let panelLeaderRequirements: Framework.ModuleRequirements = new Framework.ModuleRequirements();
            if (window.location.hostname.indexOf("localhost") > -1) {
                panelLeaderRequirements.AppUrl = 'http://localhost:44301/timesens';
                panelLeaderRequirements.FrameworkUrl = 'http://localhost:44301/framework';
                panelLeaderRequirements.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
            } else {
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
            panelLeaderRequirements.Required = [] //TODO;

            panelLeaderRequirements.Extensions = ["DataTable", "Slider", /*"Pivot",*/ /*"PPT",*/ "Crypto", "Zip", "Capture", "Xlsx", /*"Speech", */"Offline"/*, "Barcode", "D3","Face"*/];
            return panelLeaderRequirements;
        }

        protected onError(error: string) {
            super.onError(error);
            //TODO : que si admin, sinon envoi de mail ou stockage sur serveur
        }

        protected onConnectivityChanged(isOnline: boolean) {
            super.onConnectivityChanged(isOnline);

            if (this.currentViewModel) {
                this.currentViewModel.OnConnectivityChanged(this.isOnline);
            }
            if (isOnline == false) {
                this.addWarning(Framework.LocalizationManager.Get("NoNetwork"));
            } else {
                this.removeWarning(Framework.LocalizationManager.Get("NoNetwork"));
            }
        }

        protected start(fullScreen: boolean = false) {

            super.start(fullScreen);

            let self = this;

            // Initialisation du menu
            this.ShowMenu();

            // Commandes
            //TODO : framework.app ?
            this.commandInvoker = new Framework.CommandInvoker(() => {
                self.menuViewModel.OnUndoChanged(self.commandInvoker.CanRedo, self.commandInvoker.CanUndo);
                //HOWTO? Quand undo sur une commande d'une autre vue ?
                //Pb sur tous les micro changements sans validation (modification de texte, déplacement à la souris)-> tout est enregistré
            });

            // Vérification de la licence
            let localLicense = Models.Account.FromLocalStorage();

            // Pas de license locale : affichage vue login
            if (localLicense == undefined || localLicense.ExpirationDate <= new Date(Date.now())) {
                this.showModalLogin();
                return;
            }

            self.closeSession();

            // Test licence (si connexion)
            this.login(localLicense.Login, localLicense.Password, () => {
            }, (error: string) => {
                self.showModalLogin();
            });

        }

        public get Menu(): ViewModels.MenuViewModel {
            return this.menuViewModel;
        }

        public get IsSaved(): boolean {
            return this.isSaved;
        }

        private toggleLock() {
            this.session.ToggleLock();
            this.menuViewModel.SetLock(this.session.IsLocked);
            this.currentViewModel.OnLockChanged(this.session.IsLocked);
        }

        private closeSession(onClosed: () => void = () => { }): void {
            let self = this;
            this.warnings = [];

            let onComplete = () => {
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
                    Framework.Modal.Confirm(Framework.LocalizationManager.Get("SessionHasUnsavedChanged"), Framework.LocalizationManager.Get("DoYouWantToSaveChanges"), () => {
                        self.saveSessionInLocalDB(() => {
                            onComplete();
                        }, self.account.PanelLeaderApplicationSettings.DatabaseSynchronization);
                    }, () => {
                        onComplete();
                    }, Framework.LocalizationManager.Get("Yes"), Framework.LocalizationManager.Get("No"));
                } else {
                    //if (self.license.PanelLeaderApplicationSettings && self.license.PanelLeaderApplicationSettings.DatabaseSynchronization == true) {
                    //    self.dbSession.UploadItem(self.session, () => { }, () => { }, () => { onComplete(); });
                    //} else {
                    //    onComplete();
                    //}
                    self.saveSessionInLocalDB(() => {
                        onComplete();
                    }, self.account.PanelLeaderApplicationSettings.DatabaseSynchronization);
                }

            } else {
                onComplete();
            }

        }

        public addData(listData: Models.Data[], save: boolean, source: string) {
            let self = this;

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
        }


        private onSessionChanged() {
            let self = this;
            self.menuViewModel.OnSessionChanged(this.session != undefined, this.session != undefined && this.session.Upload.Date != undefined, this.session != undefined && this.session.ListData != undefined && self.session.ListData.length > 0, this.session.Name)
        }

        private sendMail(recipients: string[], callback: (monitoringProgresses: PanelLeaderModels.MonitoringProgress[]) => void) {
            let self = this;

            recipients.forEach((code: string) => {

                self.notify(Framework.LocalizationManager.Get("SendingMail"), 'progress');

                let monitoringProgresses = self.session.MonitoringProgress.filter((x) => {
                    return x.SubjectCode == code;
                });

                if (monitoringProgresses.length > 0) {
                    let monitoringProgress = monitoringProgresses[0];

                    let timesensURL = self.rootURL + "/panelist";

                    let htmlContent = self.session.GetMailContent(code, timesensURL);

                    let obj = {
                        toEmail: monitoringProgress.Mail,
                        subject: self.session.Mail.Subject,
                        body: encodeURI(htmlContent),
                        displayName: encodeURI(self.session.Mail.DisplayedName),
                        replyTo: encodeURI(self.session.Mail.ReturnMailAddress)
                    };

                    self.CallWCF('SendMail', obj, () => {
                        self.notify(Framework.LocalizationManager.Format("SendingMail", ["InProgress"]), 'progress');
                    }, (res) => {
                        // Mise à jour du statut du mail
                        monitoringProgress.MailStatus = Framework.LocalizationManager.Format("MailSentWith", [Framework.LocalizationManager.Get(res.Status), Framework.Format.ToDateString()]);
                        self.session.LogAction("SendMail", "Mail sent to [" + monitoringProgress.Mail + "] with [" + res.Status + "].", false, false);
                        self.notify(Framework.LocalizationManager.Format("SendingMail", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                        callback(monitoringProgresses);
                    });
                }
            })
        }

        private autoSave() {
            if (this.account && this.account.PanelLeaderApplicationSettings.Autosave == true) {
                this.saveSessionInLocalDB();
            }
        }

        private saveLicense(synchronize: boolean = true, notify: boolean = false) {

            if (this.isInTest == true) {
                return;
            }

            let self = this;
            this.account.SaveInLocalStorage();
            if (synchronize == true) {

                let obj = {
                    login: this.account.Login,
                    password: this.account.Password,
                    jsonLicense: encodeURI(JSON.stringify(this.account))
                };

                self.CallWCF('UpdateAccountAsUser', obj, () => {
                    if (notify == true) {
                        self.notify(Framework.LocalizationManager.Format("SavingLicense", [Framework.LocalizationManager.Get('InProgress')]), 'progress')
                    }
                },
                    (res) => {
                        if (notify == true) {
                            self.notify(Framework.LocalizationManager.Format("SavingLicense", [Framework.LocalizationManager.Get(res.Status)]), res.Status)
                        }
                    }
                );
            }

        }

        private notify(warning: string, status: string, timeOut: number = undefined, minDisplayTime: number = 1) {
            let self = this;

            setTimeout(() => {
                if (status == 'success' || status == 'error') {
                    timeOut = 5000;
                }
                self.menuViewModel.ShowWarning(warning, Framework.LocalizationManager.Get(status));
                if (timeOut) {
                    setTimeout(() => {
                        self.menuViewModel.HideWarning();
                    }, timeOut);
                }
            }, minDisplayTime);
        }

        private addWarning(warning: string) {
            this.warnings.push(warning);
            this.notify(warning, 'warning', 5000);
        }

        private removeWarning(warning: string) {
            Framework.Array.Remove(this.warnings, warning);
        }

        private login(loginId: string, loginPassword: string, onSuccess: () => void, onError: (error: string) => void) {

            let self = this;
            let token = Framework.LocalStorage.GetFromLocalStorage("Token");

            let obj = {
                login: loginId,
                password: loginPassword,
                token: token
            }

            self.CallWCF('LoginAsPanelLeader', obj, () => {
                Framework.Progress.Show(Framework.LocalizationManager.Get("CheckingLicense"));
            }, (res) => {
                Framework.Progress.Hide();
                if (res.Status == 'success') {

                    self.account = Models.Account.FromJson(res.Result);
                    (<HTMLButtonElement>document.getElementById("mainButton")).disabled = false;
                    self.menuViewModel.OnLicenseChanged(this.account.FirstName, this.account.LastName);
                    self.saveLicense();

                    // Message pour prévenir expiration proche ou peu de jetons restants
                    let message = self.account.CheckForWarning();
                    if (message.length > 0) {
                        let modal = Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), message);
                        modal.AddCheckbox(Framework.LocalizationManager.Get("DoNotDisplayThisWarningAgain"), () => {
                            self.account.PanelLeaderApplicationSettings.LicenceWarningEnabled = false;
                            self.saveLicense();
                        });
                    }

                    let obj = {
                        client: "PanelLeader",
                        version: self.version,
                        login: loginId
                    }

                    self.CallWCF('LogConnexion', obj, () => { }, () => { });

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
                    self.dbSessionShortcut.DownloadItems(() => { }, () => { }, (list: PanelLeaderModels.ServerSessionShortcut[]) => {
                        list = list.sort((a, b) => { return (Number(a.LastUpdate) - Number(b.LastUpdate)) });
                        self.menuViewModel.SetRecentFiles(list.slice(-20));
                    });

                    self.OnLogin();

                    // Langue
                    if (self.account.PanelLeaderApplicationSettings.Language) {
                        Framework.LocalizationManager.SetDisplayLanguage(self.account.PanelLeaderApplicationSettings.Language);
                    }

                    onSuccess();
                } else {

                    onError(res.ErrorMessage);
                }
            });

        }

        private saveSessionInLocalDB(callback: () => void = undefined, synchronizeOnServer: boolean = false) {
            if (this.isSaving == true) {
                return;
            }

            if (this.session == undefined) {
                return;
            }

            let self = this;
            if (this.version) {
                this.session.Version = this.version;
            }

            //self.notify(Framework.LocalizationManager.Format("SavingSession", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
            self.notify('', 'progress');

            this.isSaving = true;

            this.dbSession.SaveItem(self.session, () => { }, () => { }, () => {
                setTimeout(() => {
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

        }

        public SetNewSession(session: PanelLeaderModels.Session, saveInLocalDB: boolean) {

            let self = this;
            Framework.Progress.Hide();

            self.closeSession(() => {

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

                self.session.OnChanged = () => {
                    self.isSaved = false;
                    self.menuViewModel.OnSaveChanged(true);
                }

                self.session.OnLockedChanged = (x) => {
                    self.menuViewModel.SetLock(x);
                    self.currentViewModel.OnLockChanged(x);
                }


                self.session.OnLog = (action: string, detail: string) => {

                    let obj = {
                        login: self.account.Login,
                        date: new Date(Date.now()).toUTCString(),
                        action: action,
                        detail: "[" + Framework.Format.ToDateString() + "] " + detail
                    }

                    self.CallWCF('LogPanelLeaderAction', obj, () => { }, () => { });
                }


                self.onSessionChanged();

                Framework.Progress.Hide();

                if (saveInLocalDB == true) {
                    self.showModalSessionsDB(undefined, () => {
                        self.menuViewModel.TabProtocol.Click();
                    }, false);
                }

                self.menuViewModel.CheckState();
                self.menuViewModel.TabProtocol.Click();

                //Log            
                self.session.LogAction("Open", "Session opened with TimeSens for Panel Leader version  [" + this.version + "].", false, false);
            });

        }

        protected showView(htmlPath: string, viewModelFactory: () => ViewModels.PanelLeaderViewModel) {
            let self = this;
            super.showView(self.rootURL + "/panelleader/" + htmlPath, viewModelFactory, (vm: ViewModels.PanelLeaderViewModel, container: HTMLElement) => {
                self.currentViewModel = vm;
                self.currentContainer = container;
                self.autoSave();
                vm.OnLockChanged(self.session.IsLocked);
            });
        }

        protected showModal(htmlPath: string, title: string, viewFactory: (mw: Framework.Modal.Modal) => ViewModels.PanelLeaderViewModel, height: string = undefined, width: string = undefined, canClose: boolean = false, grayBackground: boolean = true, backdrop: boolean = false, onLoaded = undefined) {
            let self = this;

            super.showModal(self.rootURL + "/panelleader/" + htmlPath, title, viewFactory, height, width, canClose, grayBackground, backdrop, (vm: ViewModels.PanelLeaderViewModel, modal: Framework.Modal.Modal) => {
                if (vm && vm.HelpPage) {
                    modal.SetHelpFunction(() => {
                        self.showModalHelp(vm.HelpPage);
                    });
                }
                self.autoSave();
            });
        }

        public ShowMenu() {

            $(".navbar a").on("click", function () {
                $(".navbar").find(".active").removeClass("active");
                $(this).parent().addClass("active");
            });


            let self = this;
            this.menuViewModel = new ViewModels.MenuViewModel();

            let openSessionFromId = (id: string) => {
                self.dbSessionShortcut.GetItemOnServer(id).then(
                    (link: PanelLeaderModels.ServerSessionShortcut) => {
                        //self.dbLinkToLocalSession.SaveItemOnServerAndLocalDB(link, () => { }, () => { }, () => { });
                        self.dbSession.GetItemOnServer(id).then((session: PanelLeaderModels.Session) => {
                            if (session != null) {
                                self.SetNewSession(session, false);
                            } else {
                                //TODO
                                //    self.dbSession.DownloadItem(link.ID, () => { }, () => { }, (item: PanelLeaderModels.Session) => {
                                //        self.dbSession.GetItemByID(id.toString()).then((ls: PanelLeaderModels.Session) => {
                                //            self.SetNewSession(ls, false);
                                //        });
                                //    });
                            }
                        });


                    }
                );
            }

            this.menuViewModel.Undo = () => {
                self.commandInvoker.Undo();
            }

            this.menuViewModel.Redo = () => {
                self.commandInvoker.Redo();
            }

            this.menuViewModel.ShowWarnings = () => {
                self.menuViewModel.ShowWarningsPopup(self.warnings);
            }

            this.menuViewModel.ShowModalSessionWizard = () => {
                self.showModalSessionWizard();
            }

            this.menuViewModel.ShowModalNewSessionFromArchive = () => {
                Framework.FileHelper.BrowseFile(".ts2", (file: File) => {
                    PanelLeaderModels.Session.FromFile(file, () => {
                        Framework.Progress.Show(Framework.LocalizationManager.Get("LoadingFile"));
                    }, (session: PanelLeaderModels.Session) => {
                        self.SetNewSession(session, true);
                    });
                })
            }

            this.menuViewModel.ShowModalNewSessionFromDelimitedTextFile = () => {

                //TODO : faire une fonction commune avec data
                let selectedDatatype: string = "";
                let select: Framework.Form.Select = Framework.Form.Select.Render("", Framework.KeyValuePair.FromArray(Models.Data.ImportTemplates), Framework.Form.Validator.NotEmpty(), (newVal: string) => {
                    selectedDatatype = newVal;
                }, true);

                Framework.Modal.Confirm(Framework.LocalizationManager.Get("ChooseDataTypeToImport"), select.HtmlElement, () => {
                    let template: Framework.ImportManager.Template = Models.Data.GetImportTemplate(selectedDatatype);
                    self.showModalImport(Framework.LocalizationManager.Get("DataImport"), template, (items: Models.Data[]) => {
                        items.forEach((x) => { x.SheetName = selectedDatatype; x.Type = selectedDatatype; x.Status = "Imported"; });
                        let session = PanelLeaderModels.Session.FromData(items);
                        self.SetNewSession(session, true);
                    });
                });

            }

            this.menuViewModel.ExportSessionAsArchive = () => {
                self.session.LogAction("Export", "Session exported as json.", false, false);
                Framework.FileHelper.SaveObjectAs(self.session.SaveAsUndeployedCopy(true, false, false, false, false, false), self.session.Name + ".ts2");
            }

            this.menuViewModel.ShowModalSessionsDB = () => {
                self.showModalSessionsDB((id: string) => {
                    openSessionFromId(id);
                });
            }

            this.menuViewModel.SaveSessionInLocalDB = () => {
                self.saveSessionInLocalDB();
            }

            this.menuViewModel.ShowModalSessionLog = () => {
                self.showModalSessionLog();
            }

            this.menuViewModel.ShowModalSaveAsUndeployedCopy = () => {
                self.showModalSaveAsUndeployedCopy();
            }

            this.menuViewModel.Exit = () => {
                self.closeSession();
                Framework.Browser.GoHome();
            }

            this.menuViewModel.ShowModalSettings = () => {
                self.showModalSettings();
            }

            this.menuViewModel.ShowModalHelp = () => {
                if (self.currentViewModel) {
                    self.showModalHelp(self.currentViewModel.HelpPage);
                } else {
                    self.showModalHelp("menu");
                }
            }

            this.menuViewModel.LogOut = () => {
                self.account = undefined;
                self.closeSession();
                Framework.LocalStorage.RemoveItem("license");
                self.showModalLogin();
                self.menuViewModel.OnLicenseChanged();
            }

            this.menuViewModel.ToggleLock = () => {
                self.toggleLock();
            }

            this.menuViewModel.ShowModalBugReport = () => {
                self.showModalBugReport();
            }

            this.menuViewModel.ShowViewSubjects = () => {
                self.showViewSubjects();
            }

            this.menuViewModel.ShowViewProducts = () => {
                self.showViewProducts();
            }

            this.menuViewModel.ShowViewAttributes = () => {
                self.showViewAttributes();
            }

            this.menuViewModel.ShowViewScenario = () => {
                return self.showViewScenario();
            }

            this.menuViewModel.ShowViewUpload = () => {
                self.showViewUpload();
            }

            this.menuViewModel.ShowViewMonitoring = () => {
                self.showViewMonitoring();
            }

            this.menuViewModel.ShowViewData = () => {
                self.showViewData();
            }

            this.menuViewModel.OpenSessionFromLocalDB = (id) => {
                openSessionFromId(id);
            }

            this.menuViewModel.Save = () => {
                self.saveSessionInLocalDB();
            }

        }

        public OnSubjectsViewModelLoaded: (vm: PanelLeader.ViewModels.SubjectsViewModel) => void = () => { };
        private showViewSubjects() {
            let self = this;

            //let subjectDBFields: PanelLeaderModels.DBField[] = [];
            //self.dbSubjectCustomField.GetAllItems(() => { }, () => { }, (x: PanelLeaderModels.DBField[]) => {
            //    subjectDBFields = x;
            self.showView("html/ViewSubjects.html", () => {

                let subjectViewModel = new ViewModels.SubjectsViewModel(self.session.ListSubjects, self.session.SubjectPasswordGenerator/*, subjectDBFields*/);

                subjectViewModel.OnSubjectUpdate = (subject: Models.Subject, propertyName: string, oldValue: any, newValue: any) => {
                    let cmd = new Framework.Command(() => {
                        if (propertyName == "Code") {
                            self.session.UpdateSubjectCodes(oldValue, newValue);
                        }
                    }, () => {
                        subject[propertyName] = oldValue;
                        if (propertyName == "Code") {
                            self.session.UpdateSubjectCodes(newValue, oldValue);
                        }
                        subjectViewModel.TableSubject.Refresh([subject]);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                subjectViewModel.ListDataContainsSubjectCode = (codes: string[]) => { return self.session.ListDataContainsSubjectCode(codes); }

                subjectViewModel.AddNewPanelists = (nb: number) => {
                    let addedPanelists = self.session.GetNewPanelists(nb);
                    let cmd = new Framework.Command(() => {
                        self.session.AddNewPanelists(addedPanelists);
                        subjectViewModel.Update();
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("SubjectsAddedCheckDesign"))
                        //subjectViewModel.TableSubject.Insert(addedPanelists, 0, false);
                    }, () => {
                        self.session.RemoveSubjects(addedPanelists, false);
                        //subjectViewModel.TableSubject.Remove(addedPanelists, false);
                        subjectViewModel.Update();
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("SubjectsAddedCheckDesign"))
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                subjectViewModel.RemovePanelists = (subjects: Models.Subject[], removeSubjectsData: boolean) => {
                    let removedPanelists = subjects;
                    let cmd = new Framework.Command(() => {
                        self.session.RemoveSubjects(subjects, removeSubjectsData);
                        subjectViewModel.Update();
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("SubjectsAddedCheckDesign"))
                        //subjectViewModel.TableSubject.Remove(subjects, false);
                    }, () => {
                        self.session.AddNewPanelists(removedPanelists);

                        subjectViewModel.Update();
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("SubjectsAddedCheckDesign"))
                        // Attention index pas bon
                        //subjectViewModel.TableSubject.Insert(removedPanelists, 0, false);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };

                subjectViewModel.SetPanelistsPasswords = (subjects: Models.Subject[]) => {
                    let oldPasswords = subjects.map((x) => { return x.Password });
                    let cmd = new Framework.Command(() => {
                        self.session.SetSubjectsPasswords(subjects);
                        subjectViewModel.TableSubject.Refresh(subjects);
                    }, () => {
                        self.session.SetSubjectsPasswords(subjects, oldPasswords);
                        subjectViewModel.TableSubject.Refresh(subjects);;
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };

                subjectViewModel.ResetPanelistsPasswords = (subjects: Models.Subject[]) => {
                    let oldPasswords = subjects.map((x) => { return x.Password });
                    let cmd = new Framework.Command(() => {
                        self.session.ResetSubjectsPasswords(subjects);
                        subjectViewModel.TableSubject.Refresh(subjects);
                    }, () => {
                        self.session.SetSubjectsPasswords(subjects, oldPasswords);
                        subjectViewModel.TableSubject.Refresh(subjects);;
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                subjectViewModel.ShowModalImportPanelists = () => {

                    return self.showModalImport(Framework.LocalizationManager.Get("SubjectImport"), Models.Subject.GetImportTemplate(), (items: Models.Subject[]) => {
                        let cmd = new Framework.Command(() => {
                            let replacedCodes = self.session.AddNewPanelists(items);
                            ////subjectViewModel.TableSubject.Insert(items, 0);
                            subjectViewModel.Update();
                            let text: string = Framework.LocalizationManager.Get("SubjectsAddedCheckDesign");
                            if (replacedCodes.length > 0) {
                                text += "\n" + Framework.LocalizationManager.Format("ExistingCodesReplaced", [replacedCodes.join(',')]);
                            }
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), text)
                        }, () => {
                            self.session.RemoveSubjects(items, false);
                            //subjectViewModel.TableSubject.Remove(items);
                            subjectViewModel.Update();
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("SubjectsAddedCheckDesign"))
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    },
                        () => {
                            self.showModalSubjectsDB(() => {
                                //subjectViewModel.Update();
                            });
                        });
                };

                subjectViewModel.ShowViewProducts = () => { self.showViewProducts(); }
                subjectViewModel.ShowViewAttributes = () => { self.showViewAttributes(); }

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

        }

        public OnExperimentalDesignViewModelLoaded: (vm: PanelLeader.ViewModels.ExperimentalDesignItemsViewModel) => void = () => { };
        private showViewExperimentalDesignItems(dtype: string) {
            let self = this;

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

            self.showView("html/ViewExperimentalDesignItems.html", () => {

                let viewModel = new ViewModels.ExperimentalDesignItemsViewModel(dtype, self.session.ListExperimentalDesigns/*, fields*/);

                viewModel.SetActiveLi(dtype);

                viewModel.ListDataContainsItemCode = (codes: string[]) => {

                    if (dtype == "Product") {
                        return self.session.ListDataContainsProductCode(codes);
                    }

                    if (dtype == "Attribute") {
                        return self.session.ListDataContainsAttributeCode(codes);
                    }
                }

                viewModel.ShowViewAttributes = () => {
                    self.showViewAttributes();
                }

                viewModel.ShowViewSubjects = () => {
                    self.showViewSubjects();
                }

                viewModel.ShowViewProducts = () => {
                    self.showViewProducts();
                }

                viewModel.ExportItemsToLocalDB = (inlineItemLabels: Models.ExperimentalDesignItem[]) => {
                    inlineItemLabels.forEach((x) => {
                        //TODO : vérifier si item existe déjà
                        self.dbProduct.SaveItem(x, () => { }, () => { }, () => { });
                    });
                };

                viewModel.ShowModalImportDesign = () => {

                    let template = "";
                    if (dtype == "Product") {
                        template = "ProductDesign";
                    }
                    if (dtype == "Attribute") {
                        template = "AttributeDesign";
                    }

                    self.showModalImport(Framework.LocalizationManager.Get("ExperimentalDesignImport"), Models.ExperimentalDesign.GetImportTemplate(template), (inlineDesign: any[]) => {

                        let res = self.session.GetDesignFromInlineDesign(dtype, inlineDesign); // Import depuis CSV ou Excel
                        let cmd = new Framework.Command(() => {
                            self.session.AddNewDesign(res.design);
                            viewModel.Update(res.design);
                            let warning = "";
                            if (res.existingSubjects && res.existingSubjects.length > 0) {
                                warning += Framework.LocalizationManager.Format("ExistingSubjectCodesReplaced", [res.existingSubjects.join(',')]) + "\n";
                            }
                            if (res.existingItems && res.existingItems.length > 0) {
                                warning += Framework.LocalizationManager.Format("ExistingCodesReplaced", [res.existingItems.join(',')]);
                            }
                            if (warning.length > 0) {
                                self.notify(warning, 'info', 3000);
                            }

                        }, () => {
                            self.session.RemoveDesign(res.design);
                            viewModel.Update(undefined);
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    });
                }

                viewModel.ShowModalImportItems = (design: Models.ExperimentalDesign) => {
                    self.showModalImport(Framework.LocalizationManager.Get("Import"), Models.ExperimentalDesignItem.GetImportTemplate(dtype), (items: Models.ExperimentalDesignItem[]) => {
                        let cmd = new Framework.Command(() => {
                            let replacedCodes = self.session.AddItemsToDesign(design, items);
                            viewModel.Update(design);
                            if (replacedCodes.length > 0) {
                                let warning = Framework.LocalizationManager.Format("ExistingCodesReplaced", [replacedCodes.join(',')]);
                                self.notify(warning, 'info', 3000);
                            }
                        }, () => {
                            self.session.RemoveItemsFromDesign(design, items, false);
                            viewModel.Update(design);
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    },
                        () => {
                            self.showModalExperimentalDesignItemDB(design, () => {
                                viewModel.Update(design);
                            });
                        });
                }

                viewModel.AddNewDesign = () => {
                    let newDesign = self.session.GetNewDesign(dtype, "Fixed", 1, []);
                    let cmd = new Framework.Command(() => {
                        self.showModalDesignSettings(newDesign, (design: Models.ExperimentalDesign) => {
                            self.session.AddNewDesign(design);
                            viewModel.Update(design);
                        });
                    }, () => {
                        self.session.RemoveDesign(newDesign);
                        viewModel.Update(undefined);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                    return newDesign;
                }

                viewModel.AddItemsToDesign = (design: Models.ExperimentalDesign, nb: number) => {
                    let items = self.session.GetNewItems(design, nb);
                    let cmd = new Framework.Command(() => {
                        self.session.AddItemsToDesign(design, items);
                        viewModel.Update(design);
                    }, () => {
                        self.session.RemoveItemsFromDesign(design, items, false)
                        viewModel.Update(design);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                viewModel.UpdateDesignLabels = (design: Models.ExperimentalDesign) => {
                    let oldItems: Models.ExperimentalDesignItem[] = Framework.Factory.Clone(design.ListItems);
                    let newItems: Models.ExperimentalDesignItem[] = design.GetNewLabels();
                    let cmd = new Framework.Command(() => {
                        self.session.UpdateDesignLabels(design, newItems);
                        viewModel.Update(design);
                    }, () => {
                        self.session.UpdateDesignLabels(design, oldItems);
                        viewModel.Update(design);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                viewModel.UpdateItem = (design: Models.ExperimentalDesign, oldItemCode: string, propertyName: string, oldPropertyValue: any, newPropertyValue: any) => {

                    let item = design.ListItems.filter((x) => { return x.Code == oldItemCode; })[0];

                    let oldCode = oldItemCode;
                    let newCode = undefined;
                    let replicate = 1;
                    let oldLabel = undefined;
                    let newLabel = undefined;

                    if (propertyName == "Code") {
                        oldCode = oldPropertyValue;
                        newCode = newPropertyValue;
                    } else if (propertyName.length > 1 && propertyName.indexOf("R") == 0 && Number(propertyName[1])) {
                        replicate = Number(propertyName.replace("R", ""));
                        oldLabel = oldPropertyValue;
                        newLabel = newPropertyValue;
                    } else if (design.Type == "Attribute" && propertyName == "LongName") {
                        oldLabel = oldPropertyValue;
                        newLabel = newPropertyValue;
                    }
                    else {
                        item[propertyName] = newPropertyValue;
                        return;
                    }

                    let memoryOldCode = newCode;
                    let memoryNewCode = oldCode;
                    let memoryOldLabel = newLabel;
                    let memoryNewLabel = oldLabel;
                    let cmd = new Framework.Command(() => {
                        self.session.UpdateItemLabel(design, oldCode, newCode, replicate, newLabel, oldLabel);
                        viewModel.TableExperimentalDesign.DisableAndAddRefreshIcon(() => { viewModel.Update(design) });
                    }, () => {
                        self.session.UpdateItemLabel(design, memoryOldCode, memoryNewCode, replicate, memoryNewLabel, memoryOldLabel);
                        viewModel.TableExperimentalDesign.DisableAndAddRefreshIcon(() => { viewModel.Update(design) });
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                viewModel.ResetDesign = (design: Models.ExperimentalDesign) => {
                    let oldRows: Models.ExperimentalDesignRow[] = Framework.Factory.Clone(design.ListExperimentalDesignRows);
                    let cmd = new Framework.Command(() => {
                        self.session.ResetDesign(design);
                        viewModel.Update(design);
                    }, () => {
                        design.ListExperimentalDesignRows = oldRows;
                        viewModel.Update(design);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                viewModel.ShowModalEditDesignRanks = (design: Models.ExperimentalDesign, subjectCodes: string[]) => {
                    self.showModalEditDesignRanks(design, (itemCode, replicate, newRank) => {
                        let oldRows: Models.ExperimentalDesignRow[] = Framework.Factory.Clone(design.ListExperimentalDesignRows);
                        let cmd = new Framework.Command(() => {
                            self.session.EditDesignRanks(design, subjectCodes, itemCode, replicate, newRank);
                            viewModel.Update(design);
                        }, () => {
                            design.ListExperimentalDesignRows = oldRows;
                            viewModel.Update(design);
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    });
                }

                viewModel.RemoveDesign = (design: Models.ExperimentalDesign, associatedData: Models.Data[]) => {
                    let cmd = new Framework.Command(() => {
                        self.session.RemoveDesign(design, associatedData);
                        viewModel.Update(undefined);
                    }, () => {
                        self.session.AddNewDesign(design);
                        viewModel.Update(design);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                viewModel.EditDesignSettings = (design: Models.ExperimentalDesign) => {
                    let oldDesign = Framework.Factory.CreateFrom(Models.ExperimentalDesign, design);
                    let cmd = new Framework.Command(() => {
                        self.showModalDesignSettings(design, (newDesign: Models.ExperimentalDesign) => {
                            self.session.UpdateDesign(design, newDesign);
                            viewModel.Update(design);
                        });
                    }, () => {
                        self.session.UpdateDesign(design, oldDesign);
                        viewModel.Update(design);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                viewModel.CheckIfDesignIsUsedByControl = (design: Models.ExperimentalDesign) => {
                    return self.session.CheckIfDesignIsUsedByControl(design);
                }

                viewModel.GetDesignData = (design: Models.ExperimentalDesign) => {
                    return self.session.GetDesignData(design);
                }

                viewModel.RemoveItemsFromDesign = (design: Models.ExperimentalDesign, items: Models.ExperimentalDesignItem[], removeItemsData: boolean) => {
                    let cmd = new Framework.Command(() => {
                        self.session.RemoveItemsFromDesign(design, items, removeItemsData);
                        viewModel.Update(design);
                    }, () => {
                        self.session.AddItemsToDesign(design, items);
                        viewModel.Update(design);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

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

        }

        private showViewProducts() {
            this.showViewExperimentalDesignItems("Product");
        }

        private showViewAttributes() {
            this.showViewExperimentalDesignItems("Attribute");
        }

        public OnScenarioViewModelLoaded: (vm: PanelLeader.ViewModels.ScenarioViewModel) => void = () => { };
        private showViewScenario() {
            let self = this;

            this.showView("html/ViewScenario.html", () => {

                let scenarioViewModel = new ViewModels.ScenarioViewModel(self.session.GetSubjectSession());

                let showModalScreenXML = (session: PanelLeaderModels.Session, index: number, experimentalDesignId: number, callback: () => void) => {
                    self.showModalScreenXML(session.ListScreens, session.ListExperimentalDesigns, (screens: Models.Screen[]) => {

                        screens.reverse().forEach((screen) => {
                            screen.Resolution = session.DefaultScreenOptions.Resolution;
                            Models.Screen.ChangeResolution(screen, session.DefaultScreenOptions.Resolution);
                            let cmd = new Framework.Command(() => {
                                self.session.AddScreen(screen, index, experimentalDesignId, true);
                                scenarioViewModel.UpdateMiniatures();
                                //index++;
                                callback();
                            }, () => {
                                self.session.DeleteScreen(screen.Id);
                                scenarioViewModel.UpdateMiniatures();
                                callback();
                            });
                            self.commandInvoker.ExecuteCommand(cmd);
                        });
                    });
                };

                scenarioViewModel.ShowModalScreenFromXML = (index: number, experimentalDesignId: number, callback: () => void) => {
                    self.showModalSessionsDB((id: string) => {

                        //TOFIX : doublon de cette fonction
                        self.dbSessionShortcut.GetItemOnServer(id.toString()).then(
                            (link: PanelLeaderModels.ServerSessionShortcut) => {

                                self.dbSession.GetItemOnServer(id.toString()).then((session: PanelLeaderModels.Session) => {
                                    if (session != null) {
                                        showModalScreenXML(session, index, experimentalDesignId, callback);
                                    } else {
                                        self.dbSession.DownloadItem(link.ID, () => { }, () => { }, (item: PanelLeaderModels.Session) => {
                                            self.dbSession.GetItemOnServer(id.toString()).then((ls: PanelLeaderModels.Session) => {
                                                showModalScreenXML(session, index, experimentalDesignId, callback);
                                            });
                                        });
                                    }
                                });


                            }
                        );

                    });
                };

                scenarioViewModel.ShowModalScreenProperties = (screen: Models.Screen, index: number, callback: () => void) => {
                    self.showModalScreenProperties(screen, index + 1, () => {
                        callback();
                    }, scenarioViewModel);
                }

                scenarioViewModel.MoveScreen = (index: number, direction: string) => {
                    //TODO : drag'n drop
                    let undoDirection = "up";
                    let undoIndex = index + 1;
                    if (direction == "up") {
                        undoDirection = "down";
                        undoIndex = index - 1;
                    }
                    let cmd = new Framework.Command(() => {
                        self.session.MoveScreen(index, direction);
                        scenarioViewModel.UpdateMiniatures();
                    }, () => {
                        self.session.MoveScreen(undoIndex, undoDirection);
                        scenarioViewModel.UpdateMiniatures();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                scenarioViewModel.ShowModalSimulation = (subjectSession: Models.SubjectSeance, currentScreenId: number) => {
                    self.showModalSimulation(subjectSession, currentScreenId, self.isInTest);
                }

                self.OnModalSimulationViewModelLoaded = (vm: ViewModels.ModalSimulationViewModel) => {
                    vm.Start();
                }



                scenarioViewModel.AddControlToScreen = (screen: Models.Screen, control: ScreenReader.Controls.BaseControl, onSelect: (control: ScreenReader.Controls.BaseControl) => void, style: boolean) => {
                    let cmd = new Framework.Command(() => {
                        self.session.AddControlToScreen(screen, control, onSelect, style);
                    }, () => {
                        self.session.RemoveControlFromScreen(screen, control);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                scenarioViewModel.RemoveControlFromScreen = (screen: Models.Screen, control: ScreenReader.Controls.BaseControl) => {
                    let cmd = new Framework.Command(() => {
                        self.session.RemoveControlFromScreen(screen, control);
                    }, () => {
                        self.session.AddControlToScreen(screen, control, () => { }); //TODO ? onSelect
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                //scenarioViewModel.UpdateControlName = (control: ScreenReader.Controls.BaseControl, oldName: string, newName: string) => {
                //    //TODO : enregistrer le chanement 1 seule fois (pas chaque caractère)
                //    let cmd = new Framework.Command(() => {
                //        self.session.UpdateControlName(control, oldName, newName);
                //    }, () => {
                //        self.session.UpdateControlName(control, newName, oldName);
                //    });
                //    self.commandInvoker.ExecuteCommand(cmd);
                //}

                scenarioViewModel.OnControlPropertyChanged = (control: ScreenReader.Controls.BaseControl, propertyName: string, oldValue: any, newValue: any) => {
                    //TODO : Attention tous les microchangements sont enregsitrés !
                    let cmd = new Framework.Command(() => {
                        if (propertyName == "_FriendlyName") {
                            self.session.UpdateControlName(control, oldValue, newValue);
                        }
                        self.session.OnChanged();
                    }, () => {
                        control[propertyName] = oldValue;
                        control.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                scenarioViewModel.InsertScreen = (screen: Models.Screen, index: number, experimentalDesignId: number) => {

                    let newScreen = self.session.GetNewScreen(screen, index, experimentalDesignId);
                    let cmd = new Framework.Command(() => {
                        self.session.AddScreen(newScreen, index, experimentalDesignId);
                        scenarioViewModel.CurrentScreen = newScreen;
                        scenarioViewModel.UpdateMiniatures();
                    }, () => {
                        self.session.DeleteScreen(newScreen.Id);
                        scenarioViewModel.UpdateMiniatures();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                    return newScreen;
                }

                scenarioViewModel.DeleteScreen = (screen: Models.Screen, index: number) => {
                    let cmd = new Framework.Command(() => {
                        let newScreenId = self.session.DeleteScreen(screen.Id);
                        scenarioViewModel.UpdateMiniatures();
                        scenarioViewModel.OnScreenChanged(newScreenId, false);
                    }, () => {
                        //TOFIX : pas inséré au bon endroit si 1er écran supprimé
                        self.session.AddScreen(screen, index);
                        scenarioViewModel.UpdateMiniatures();
                    });
                    self.commandInvoker.ExecuteCommand(cmd)
                };

                scenarioViewModel.ShowModalScreensStyle = (callback: () => void) => {
                    self.showModalScreensStyle(callback);
                }

                scenarioViewModel.GetListSortingControlNames = () => {
                    let res = [];
                    //TODO : mettre ça dans session, écrans précédents uniquement
                    self.session.ListScreens.forEach((x) => {
                        x.Controls.filter((y) => { return y._Type == "SortingControl" }).forEach((z) => {
                            res.push(z._FriendlyName);
                        });
                    });
                    return res;
                }

                scenarioViewModel.GetListControlNames = () => {
                    let res = [];
                    //TODO : mettre ça dans session, écrans précédents uniquement
                    self.session.ListScreens.forEach((x) => {
                        x.Controls.forEach((z) => {
                            res.push(z._FriendlyName);
                        });
                    });
                    return res;
                }

                scenarioViewModel.GetListDataControlNames = () => {
                    let res = [];
                    //TODO : mettre ça dans session, écrans précédents uniquement
                    self.session.ListScreens.forEach((x) => {
                        x.Controls.filter((y) => { return y._Type == "FreeTextQuestionControl" }).forEach((z) => {
                            res.push(z._FriendlyName);
                        });
                    });
                    return res;
                }

                //scenarioViewModel.OnControlPropertyChanged = () => {
                //    //TODO: faire tous les changements de screenreader ici ?
                //    self.session.OnChanged();
                //}


                scenarioViewModel.HelpPage = "viewScenario";

                self.OnScenarioViewModelLoaded(scenarioViewModel);

                return scenarioViewModel;
            });
        }

        public OnUploadViewModelLoaded: (vm: PanelLeader.ViewModels.UploadViewModel) => void = () => { }
        private showViewUpload() {
            let self = this;

            this.showView("html/ViewUpload.html", () => {

                let uploadViewModel = new ViewModels.UploadViewModel(self.session.Upload);

                let upload = () => {
                    // Vérifier si on renomme un sujet ce qui se passe
                    // maj séance locale, enregistrement, verrouillage session, désactivation undo, maj vue monitoring, progress, blocage actions, maj vue upload, maj vue data si suppression, maj log serveur et local
                    // TODO : mise à jour des séances ou non
                    // Envoi au web service qui crée les subject sessions sur le serveur et qui retourne un servercode  
                    let templatedSubjectSeance: Models.TemplatedSubjectSeance = Models.TemplatedSubjectSeance.CreateTemplatedSubjectSeance(self.session, self.account);


                    let obj = {
                        login: self.account.Login,
                        password: self.account.Password,
                        jsonTemplatedSubjectSeance: JSON.stringify(templatedSubjectSeance),
                    };

                    let wsvc: string = 'UploadSubjectsSeance';
                    if (self.session.Upload.ServerCode != undefined && self.session.Upload.ServerCode.length > 0) {
                        // MAJ sinon
                        wsvc = 'UpdateSubjectsSeance';
                        obj["updateSessions"] = true;
                    }

                    self.CallWCF(wsvc, obj, () => {
                        self.notify(Framework.LocalizationManager.Format("UploadingSession", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                    }, (res) => {

                        if (res.Status == 'success') {

                            let serverCode = self.session.Upload.ServerCode;

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
                        } else {
                            self.session.LogAction("Upload", "Error during session upload.", false);
                        }

                        self.notify(Framework.LocalizationManager.Format("UploadingSession", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                    })
                };

                let remove = (removeData: boolean) => {
                    let self = this;

                    let obj = {
                        serverCode: self.session.Upload.ServerCode,
                        login: self.account.Login,
                        password: self.account.Password
                    };

                    self.CallWCF('DeleteSubjectsSeance', obj, () => {
                        self.notify(Framework.LocalizationManager.Format("DeletingSessionOnServer", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                    }, (res) => {

                        self.session.RemoveUpload(self.rootURL, res.Status, removeData)

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

                }

                uploadViewModel.UploadSessionOnServer = () => {
                    let cmd = new Framework.Command(() => {
                        upload();
                    }, () => {
                        remove(false);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };

                uploadViewModel.DeleteSessionOnServer = (removeData: boolean) => {
                    let cmd = new Framework.Command(() => {
                        remove(removeData);
                    }, () => {
                        upload();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };

                uploadViewModel.OnSessionDeleted = () => { };
                uploadViewModel.OnSessionUploaded = () => { };

                uploadViewModel.Notify = () => {
                    self.notify(Framework.LocalizationManager.Get("SessionUpdateRequired"), 'info', 3000);
                };

                uploadViewModel.HasAssociatedData = () => {
                    return (self.session.ListData.filter((x) => { return x.Session.toString() == self.session.Upload.ServerCode }).length > 0);
                }

                uploadViewModel.HelpPage = "viewUpload";

                self.OnUploadViewModelLoaded(uploadViewModel);

                return uploadViewModel;
            });
        }

        public OnMonitoringViewModelLoaded: (vm: PanelLeader.ViewModels.MonitoringViewModel) => void = () => { };
        private showViewMonitoring() {
            let self = this;

            this.showView("html/ViewMonitoring.html", () => {

                self.session.SetMonitoringProgress(self.rootURL, false);
                let monitoringViewModel = new ViewModels.MonitoringViewModel(self.session.MonitoringProgress);

                monitoringViewModel.UpdateMail = (subjectCode: string, mail: string) => {
                    let memory = self.session.GetSubjectFromCode(subjectCode).Mail;
                    let cmd = new Framework.Command(() => {
                        self.session.UpdatePanelistMail(subjectCode, mail);
                    }, () => {
                        self.session.UpdatePanelistMail(subjectCode, memory);
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };

                monitoringViewModel.PrintMemo = () => {
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

                monitoringViewModel.UpdateData = (data: Models.Data[]) => {

                    self.addData(data, true, "download");

                };

                monitoringViewModel.RefreshMonitoring = (success: (monitoringProgress: PanelLeaderModels.MonitoringProgress[]) => void, error: Function) => {
                    //TODO : téléchargement des images
                    //TODO : téléchargement de videos + gestion des jetons associée
                    //TODO : analyser les vidéos + gestion des jetons associée
                    //TODO : option analyze emotion que pour licence fullprice

                    //TODO : télécharger les images ?

                    // MAJ session locale, MAJ vue monitoring, MAJ vue data, enregistrement, désactivation undio, maj log serveur et local, progerss bar + blocage actions

                    // Avancement   
                    let obj = {
                        serverCode: self.session.Upload.ServerCode,
                        login: self.account.Login,
                        password: self.account.Password
                    }

                    self.CallWCF('RefreshMonitoring', obj, () => {
                        self.notify(Framework.LocalizationManager.Format("DownloadingProgress", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                    }, (res) => {
                        if (res.Status == 'success') {
                            let progress: PanelLeaderModels.ProgressInfo = JSON.parse(res.Result);

                            // Mise à jour de la progression
                            let monitoringProgress: PanelLeaderModels.MonitoringProgress[] = self.session.UpdateMonitoringProgress(self.rootURL, progress.MonitoringProgress);

                            let requiredTokens = progress.RequiredTokens;
                            let availableTokens = progress.AvailableTokens;

                            let dataCount = progress.DataCount;
                            //let videos = progress.Videos;
                            let videosSize = progress.VideosSize;
                            let listVideos = progress.Videos.join(';');
                            //let subjectCount = progress.Subjects.length;

                            if (dataCount > 0 || videosSize > 0) {
                                //1 vérification de l'avancement
                                //2 téléchargement des données après validation

                                let onConfirm = (downloadData: boolean, downloadVideos: boolean, analyzeEmotions: boolean) => {

                                    //TODO gérer barre d'avancemen avec start event->stop event'

                                    // Enregistrement
                                    self.saveSessionInLocalDB();

                                    if (downloadData == true) {
                                        // Téléchargement des données

                                        let obj = {
                                            serverCode: self.session.Upload.ServerCode,
                                            subjects: progress.Subjects.join(';'),
                                            login: self.account.Login,
                                            password: self.account.Password,
                                            dataStatus: "Pending"
                                        }

                                        self.CallWCF('DownloadData', obj, () => {
                                            self.notify(Framework.LocalizationManager.Format("DownloadingData", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                                        }, (res) => {

                                            if (res.Status == 'success') {
                                                let listData: Models.Data[] = JSON.parse(res.Result);
                                                self.addData(listData, true, "download");

                                                //TODO : mise à jour products

                                            } else {
                                                self.session.LogAction("DownloadData", "Data downloaded with error.", false);
                                            }

                                            self.notify(Framework.LocalizationManager.Format("DownloadingData", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                                        });
                                    }

                                    if (downloadVideos == true) {

                                        let obj = {
                                            serverCode: self.session.Upload.ServerCode,
                                            password: self.account.Password,
                                            login: self.account.Login,
                                            listVideos: encodeURI(listVideos)
                                        }

                                        self.CallWCF('DownloadVideos', obj, () => {
                                            self.notify(Framework.LocalizationManager.Format("DownloadingVideos", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                                        }, (res) => {

                                            if (res.Status == 'success') {
                                                let url = res.Result;
                                                window.open(url, "windowname", "width:400,height:300");

                                            } else {
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

                                    success(monitoringProgress);

                                }

                                let onCancel = () => {
                                    // Pas de mise à jour des données
                                    success(monitoringProgress);
                                }

                                self.showModalTokenDownloadConfirmation(progress, onConfirm, onCancel);
                            } else {
                                success(monitoringProgress);
                            }
                        }
                        else {
                            error();
                        }
                        self.session.LogAction("Monitoring", "Session with server code " + this.session.Upload.ServerCode + " monitored with " + res.Status + ".", false);
                        self.notify(Framework.LocalizationManager.Format("DownloadingProgress", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                    });

                }

                monitoringViewModel.ResetUserProgress = (subjects: string[], removeData: boolean, callback: (monitoringProgress: PanelLeaderModels.MonitoringProgress[]) => void) => {

                    ViewModels.ModalResetProgressViewModel.Show((resetProgress: boolean, resetMinTimeBetween2Connections: boolean) => {
                        if (resetProgress == true) {

                            let obj = {
                                serverCode: self.session.Upload.ServerCode,
                                subjectCodes: subjects.join(';'),
                                login: self.account.Login,
                                password: self.account.Password,
                                newCurrentScreen: "0"
                            }

                            self.CallWCF('RemoveProgress', obj,
                                () => {
                                    self.notify(Framework.LocalizationManager.Format("ResetingProgress", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                                },
                                (res) => {

                                    let monitoringProgress: PanelLeaderModels.MonitoringProgress[] = JSON.parse(res.Result);

                                    if (res.Status == 'success') {

                                        if (removeData == true) {
                                            let toRemoveData = self.session.ListData.filter(x => { return subjects.indexOf(x.SubjectCode) > -1 });
                                            self.session.RemoveData(toRemoveData);
                                        }

                                        let result = self.session.UpdateMonitoringProgress(self.rootURL, monitoringProgress);
                                        callback(result);

                                        // Enregistrement
                                        self.saveSessionInLocalDB();
                                    }

                                    self.session.LogAction("ResetingProgress", "Progress reset for panelist(s) " + subjects.join(', ') + " with " + res.Status + ".", false);
                                    self.notify(Framework.LocalizationManager.Format("ResetingProgress", [Framework.LocalizationManager.Get(res.Status)]), res.Status);

                                });


                        }
                        if (resetMinTimeBetween2Connections == true) {

                            subjects.forEach((subject) => {
                                let obj = {
                                    serverCode: self.session.Upload.ServerCode,
                                    subjectCode: subject,
                                    login: self.account.Login,
                                    password: self.account.Password
                                }
                                self.CallWCF('ResetMinTimeBetween2Connections', obj, () => {
                                    self.notify(Framework.LocalizationManager.Format("ResetingMinTimeBetween2Connections", [Framework.LocalizationManager.Get('InProgress')]), 'progress');
                                }, (res) => {
                                    self.notify(Framework.LocalizationManager.Format("ResetingMinTimeBetween2Connections", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                                    self.session.LogAction("ResetMinTimeBetween2Connections", "Min time between connections reset for panelist " + subject + " with " + res.Status + ".", false);
                                });
                            });
                        }
                    });

                };

                monitoringViewModel.ShowModalSendMail = (recipients: string[], onClose: (monitoringProgresses) => void) => {
                    self.showModalSendMail(recipients, onClose);

                };

                monitoringViewModel.HelpPage = "viewMonitoring";

                self.OnMonitoringViewModelLoaded(monitoringViewModel);

                return monitoringViewModel;
            });
        }

        public OnDataViewModelLoaded: (vm: PanelLeader.ViewModels.DataViewModel) => void = () => { };
        private showViewData() {
            let self = this;

            this.showView("html/ViewData.html", () => {

                // Découpage en onglet
                self.session.SetDataTabs();

                let dataViewModel = new ViewModels.DataViewModel(self.session.ListData, self.session.DataTabs);

                dataViewModel.RemoveDataTab = (name: string) => {
                    let cmd = new Framework.Command(() => {
                        self.session.RemoveDataTab(name);
                        dataViewModel.Update();
                    }, () => {
                        self.session.AddDataTab(name);
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                dataViewModel.DeleteData = (data: Models.Data[]) => {
                    let cmd = new Framework.Command(() => {
                        self.session.RemoveData(data);
                        dataViewModel.Update();
                    }, () => {
                        self.addData(data, false, "");
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                dataViewModel.ModifySelectionInData = (selectedData: Models.Data[], column: string, replace: string, copy: boolean) => {
                    let memory = Framework.Factory.Clone(self.session.ListData);
                    let cmd = new Framework.Command(() => {
                        self.session.ModifySelectionInData(selectedData, column, replace, copy);
                        dataViewModel.Update();
                    }, () => {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                dataViewModel.SearchAndReplaceData = (selectedData: Models.Data[], column: string, search: string, replace: string, copy: boolean) => {
                    let memory = Framework.Factory.Clone(self.session.ListData);
                    let cmd = new Framework.Command(() => {
                        self.session.SearchAndReplaceData(selectedData, column, search, replace, copy);
                        dataViewModel.Update();
                    }, () => {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                dataViewModel.TransformScoresInRanks = (selectedData: Models.Data[], copy: boolean) => {
                    let memory = Framework.Factory.Clone(self.session.ListData);
                    let cmd = new Framework.Command(() => {
                        self.session.TransformScoresInRanks(selectedData, copy);
                        dataViewModel.Update();
                    }, () => {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                dataViewModel.TransformScores = (selectedData: Models.Data[], copy: boolean, transformation: string) => {
                    let memory = Framework.Factory.Clone(self.session.ListData);
                    let cmd = new Framework.Command(() => {
                        self.session.TransformScores(selectedData, copy, transformation);
                        dataViewModel.Update();
                    }, () => {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                dataViewModel.TransformScoresInMeans = (selectedData: Models.Data[], copy: boolean, variable: string) => {
                    let memory = Framework.Factory.Clone(self.session.ListData);
                    let cmd = new Framework.Command(() => {
                        self.session.TransformScoresInMeans(selectedData, copy, variable);
                        dataViewModel.Update();
                    }, () => {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                dataViewModel.TransformReplicatesInIntakes = (selectedData: Models.Data[], copy: boolean) => {
                    let memory = Framework.Factory.Clone(self.session.ListData);
                    let cmd = new Framework.Command(() => {
                        self.session.TransformReplicatesInIntakes(selectedData, copy);
                        dataViewModel.Update();
                    }, () => {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                dataViewModel.TransformSessionsInReplicates = (selectedData: Models.Data[], copy: boolean) => {
                    let memory = Framework.Factory.Clone(self.session.ListData);
                    let cmd = new Framework.Command(() => {
                        self.session.TransformSessionsInReplicates(selectedData, copy);
                        dataViewModel.Update();
                    }, () => {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                dataViewModel.MoveSelectionToAnotherTab = (selectedData: Models.Data[], newTab: string, deleteAfterCopy: boolean) => {
                    let memory = Framework.Factory.Clone(self.session.ListData);
                    let cmd = new Framework.Command(() => {
                        self.session.MoveSelectionToAnotherTab(selectedData, newTab, deleteAfterCopy);
                        dataViewModel.Update();
                    }, () => {
                        self.session.ListData = [];
                        self.session.ListData = memory;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                dataViewModel.AddDataTab = () => {
                    let name = self.session.GetNewDataTab();
                    let cmd = new Framework.Command(() => {
                        self.session.AddDataTab(name);
                        dataViewModel.Update();
                    }, () => {
                        self.session.RemoveDataTab(name);
                        dataViewModel.Update();
                    });

                    self.commandInvoker.ExecuteCommand(cmd);
                }

                dataViewModel.AddData = (sheetName: string, dType: string) => {
                    let data = self.session.GetNewData(sheetName, dType);
                    let cmd = new Framework.Command(() => {
                        self.session.AddData(data, "Inserted");
                        dataViewModel.Update();
                    }, () => {
                        self.session.RemoveData(data);
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                dataViewModel.OnDataChanged = (data: Models.Data, propertyName: string, oldValue: any, newValue: any) => {
                    let cmd = new Framework.Command(() => {
                        data.Status = "Updated";
                        self.session.LogAction("Data", "Data updated for subject " + data.SubjectCode, false);
                    }, () => {
                        data[propertyName] = oldValue;
                        dataViewModel.Update();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                dataViewModel.ShowModalAnalysis = (listData: Models.Data[]) => {
                    self.showModalAnalysis(listData);
                }

                dataViewModel.ShowModalImportData = (datatype: string) => {
                    //TODO : insérer juges produits descripteurs ?
                    let template: Framework.ImportManager.Template = Models.Data.GetImportTemplate(datatype);
                    self.showModalImport(Framework.LocalizationManager.Get("DataImport"), template, (items: Models.Data[]) => {
                        let tab = self.session.GetNewDataTab();
                        let cmd = new Framework.Command(() => {
                            self.session.AddDataTab(tab);
                            items.forEach((x) => { x.SheetName = tab; x.Type = datatype; x.Status = "Imported"; });
                            self.session.AddData(items, "Imported");
                            dataViewModel.Update();
                        }, () => {
                            self.session.RemoveDataTab(tab);
                            dataViewModel.Update();
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    });
                };


                dataViewModel.FeelingAnalysis = (selectedData: Models.Data[], copy: boolean) => {

                    let tab = [];
                    let id = 0;
                    selectedData.forEach((x) => {
                        let obj = { id: id, language: 'fr', text: x.Description };
                        //TOFIX : limite au nombre de caractères ?
                        //if (id >=1000) {
                        tab.push(obj);
                        //}
                        id++;

                    });

                    let documents = {
                        'documents': tab
                    };

                    let body = JSON.stringify(documents);

                    $.ajax({
                        type: "POST",
                        url: "https://francecentral.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",  //https://francecentral.api.cognitive.microsoft.com/text/analytics/v2.0
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Ocp-Apim-Subscription-Key', '86ce684ef8444ff484ea5393ee3a1349');
                            xhr.setRequestHeader("Content-Type", "application/json");
                        },
                        data: JSON.stringify(documents),
                        success: function (result) {

                            let tab = "Sentiment";
                            let cmd = new Framework.Command(() => {

                                if (self.session.ListData.filter((x) => { return x.SheetName == tab }).length == 0) {
                                    self.session.AddDataTab(tab);
                                }
                                let items: Models.Data[] = [];
                                result.documents.forEach((x) => {
                                    let id = Number(x["id"]);
                                    let item = new Models.Data();
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
                                })
                                self.session.AddData(items, "Computed");
                                dataViewModel.Update();
                            }, () => {
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

                }

                dataViewModel.HelpPage = "viewData";

                self.OnDataViewModelLoaded(dataViewModel);

                return dataViewModel;
            });
        }

        public OnModalSettingsViewModelLoaded: (vm: ViewModels.ModalSettingsViewModel) => void = () => { };
        private showModalSettings() {
            let self = this;
            this.showModal("html/ModalSettings.html", Framework.LocalizationManager.Get("Settings"), (mw: Framework.Modal.Modal) => {

                let vm = new ViewModels.ModalSettingsViewModel(mw, self.account.PanelLeaderApplicationSettings, self.version);

                vm.SaveLicense = (applicationSettings: Models.PanelLeaderApplicationSettings) => {
                    self.account.PanelLeaderApplicationSettings.Language = applicationSettings.Language;
                    self.account.PanelLeaderApplicationSettings.DatabaseSynchronization = applicationSettings.DatabaseSynchronization;
                    self.account.PanelLeaderApplicationSettings.Autosave = applicationSettings.Autosave;
                    self.account.PanelLeaderApplicationSettings.DisplayName = applicationSettings.DisplayName;
                    self.account.PanelLeaderApplicationSettings.ReturnMailAddress = applicationSettings.ReturnMailAddress;
                    self.saveLicense();
                    if (self.account.PanelLeaderApplicationSettings.Language) {
                        Framework.LocalizationManager.SetDisplayLanguage(self.account.PanelLeaderApplicationSettings.Language);
                    }
                }

                vm.Close = () => {
                    mw.Close();
                }

                vm.HelpPage = "modalSettings";
                self.OnModalSettingsViewModelLoaded(vm);

                return vm;
            });

        }

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

        public OnModalTokenDownloadConfirmationViewModelLoaded: (vm: ViewModels.ModalTokenDownloadConfirmationViewModel) => void = () => { };
        private showModalTokenDownloadConfirmation(progress: PanelLeaderModels.ProgressInfo, onConfirm, onCancel) {
            let self = this;

            this.showModal("html/ModalTokenDownloadConfirmation.html", Framework.LocalizationManager.Get("Validation"), (mw: Framework.Modal.Modal) => {

                let requiredTokens = progress.RequiredTokens;
                let availableTokens = progress.AvailableTokens;

                let dataCount = progress.DataCount;
                let videos = progress.Videos;
                let videosSize = progress.VideosSize;
                let listVideos = progress.Videos.join(';');
                let subjectCount = progress.Subjects.length;

                let modal = new ViewModels.ModalTokenDownloadConfirmationViewModel(mw, requiredTokens, availableTokens, subjectCount, dataCount, videos, videosSize, onConfirm, onCancel);

                modal.HelpPage = "modalValidation";

                self.OnModalTokenDownloadConfirmationViewModelLoaded(modal);

                return modal;
            });

        }

        public OnModalProtocolDBFieldsViewModelLoaded: (vm: ViewModels.ModalProtocolDBFieldsViewModel) => void = () => { };
        private showModalCustomDBFields(db: Framework.Database.ServerDB, onClose: (fields: PanelLeaderModels.DBField[]) => void) {

            let self = this;

            let fields: PanelLeaderModels.DBField[] = [];

            //db.GetAllItems(() => { }, () => { }, (x: PanelLeaderModels.DBField[]) => {
            db.DownloadItems(() => { }, () => { }, (x: PanelLeaderModels.DBField[]) => {
                fields = x;
                show();
            });

            let show = () => {

                return self.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("Fields"), (mw: Framework.Modal.Modal) => {

                    let vm = new ViewModels.ModalProtocolDBFieldsViewModel(mw, fields, (field: PanelLeaderModels.DBField) => {
                        db.SaveItem(field, () => { }, () => { }, () => { });
                    });

                    vm.AddDBField = () => {
                        let field: PanelLeaderModels.DBField = new PanelLeaderModels.DBField();
                        db.SaveItem(field, () => { }, () => { }, () => {
                            fields.push(field);
                            vm.SetDataTableFields(fields);
                        });
                    };

                    vm.RemoveDBFields = (fields: PanelLeaderModels.DBField[]) => {
                        fields.forEach((x) => {
                            db.RemoveItem(x, () => { }, () => { }, () => { });
                            Framework.Array.Remove(fields, x);
                        });
                        vm.SetDataTableFields(fields);
                    };

                    vm.HelpPage = "modalCustomDBField";

                    mw.OnClose = () => {
                        onClose(fields);
                    };

                    self.OnModalProtocolDBFieldsViewModelLoaded(vm);

                    return vm;
                }, "80vh", undefined, true);
            }

        }

        public OnModalSubjectsDBViewModelLoaded: (vm: ViewModels.ModalSubjectsDBViewModel) => void = () => { };
        private showModalSubjectsDB(onClose: () => void) {

            let self = this;

            let subjectDBFields: PanelLeaderModels.DBField[] = [];
            let subjects: Models.Subject[] = [];

            //self.dbSubjectCustomField.GetAllItems(() => { }, () => { }, (x: PanelLeaderModels.DBField[]) => {
            self.dbSubjectCustomField.DownloadItems(() => { }, () => { }, (x: PanelLeaderModels.DBField[]) => {
                subjectDBFields = x;
                //self.dbSubject.GetAllItems(() => { }, () => { }, (x: Models.Subject[]) => {
                self.dbSubject.DownloadItems(() => { }, () => { }, (x: Models.Subject[]) => {
                    subjects = x;
                    show();
                })
            });

            let show = () => {

                self.showModal("html/ModalSubjectsDB.html", Framework.LocalizationManager.Get("SubjectsDB"), (mw: Framework.Modal.Modal) => {

                    let vm = new ViewModels.ModalSubjectsDBViewModel(mw, subjectDBFields, subjects, (subject: Models.Subject, propertyName: string, oldValue: string, newValue: string) => {
                        self.dbSubject.SaveItem(subject, () => { }, () => { }, () => { });
                    });

                    vm.ImportSubjects = (subjectsToImport: Models.Subject[]) => {
                        let cmd = new Framework.Command(() => {
                            let replacedCodes = self.session.AddNewPanelists(subjectsToImport);
                            onClose();
                            let text: string = Framework.LocalizationManager.Get("SubjectsAddedCheckDesign");
                            if (replacedCodes.length > 0) {
                                text += "\n" + Framework.LocalizationManager.Format("ExistingCodesReplaced", [replacedCodes.join(',')]);
                            }
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), text)
                        }, () => {
                            self.session.RemoveSubjects(subjectsToImport, false);
                            onClose();
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("SubjectsAddedCheckDesign"))
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    }

                    vm.DeleteSubjects = (subjectsToDelete: Models.Subject[]) => {
                        subjectsToDelete.forEach((x) => {
                            self.dbSubject.RemoveItem(x, () => { }, () => { }, () => { });
                            Framework.Array.Remove(subjects, x);
                        });
                        vm.SetDataTable(subjects, subjectDBFields);
                    }

                    vm.HelpPage = "modalSubjectsDB";

                    self.OnModalSubjectsDBViewModelLoaded(vm);

                    return vm;
                }, "80vh", "95vw", true);
            }

        }

        public OnModalExperimentalDesignItemDBViewModelLoaded: (vm: ViewModels.ModalExperimentalDesignItemDBViewModel) => void = () => { };
        private showModalExperimentalDesignItemDB(design: Models.ExperimentalDesign, onClose: () => void) {

            let self = this;

            let fields: PanelLeaderModels.DBField[] = [];
            let items: Models.ExperimentalDesignItem[] = [];

            let dbFields: Framework.Database.ServerDB;
            let dbItems: Framework.Database.ServerDB;

            if (design.Type == "Product") {
                dbFields = self.dbProductCustomField;
                dbItems = self.dbProduct;
            }

            if (design.Type == "Attribute") {
                dbFields = self.dbAttributeCustomField;
                dbItems = self.dbAttribute;
            }

            //dbFields.GetAllItems(() => { }, () => { }, (x: PanelLeaderModels.DBField[]) => {
            dbFields.DownloadItems(() => { }, () => { }, (x: PanelLeaderModels.DBField[]) => {
                fields = x;
                //dbItems.GetAllItems(() => { }, () => { }, (x: Models.ExperimentalDesignItem[]) => {
                dbItems.DownloadItems(() => { }, () => { }, (x: Models.ExperimentalDesignItem[]) => {
                    items = x;

                    self.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get(design.Type) + " DB", (mw: Framework.Modal.Modal) => {

                        let vm = new ViewModels.ModalExperimentalDesignItemDBViewModel(mw, fields, items, (item: Models.ExperimentalDesignItem, propertyName: string, oldValue: string, newValue: string) => {
                            dbItems.SaveItem(item, () => { }, () => { }, () => { });
                        });

                        vm.ImportItems = (itemsToImport: Models.ExperimentalDesignItem[]) => {
                            let cmd = new Framework.Command(() => {
                                let replacedCodes = self.session.AddItemsToDesign(design, itemsToImport);
                                onClose();
                                if (replacedCodes.length > 0) {
                                    let warning = Framework.LocalizationManager.Format("ExistingCodesReplaced", [replacedCodes.join(',')]);
                                    self.notify(warning, 'info', 3000);
                                }
                            }, () => {
                                self.session.RemoveItemsFromDesign(design, itemsToImport, false);
                                onClose();
                            });
                            self.commandInvoker.ExecuteCommand(cmd);
                        }

                        vm.DeleteItems = (itemsToDelete: Models.ExperimentalDesignItem[]) => {
                            itemsToDelete.forEach((x) => {
                                dbItems.RemoveItem(x, () => { }, () => { }, () => { });
                                Framework.Array.Remove(items, x);
                            });
                            vm.SetDataTable(items, fields);
                        }

                        vm.HelpPage = "modalItemsDB";

                        self.OnModalExperimentalDesignItemDBViewModelLoaded(vm);

                        return vm;
                    }, "80vh", "95vw", true);

                })
            });

        }

        public OnModalSaveMailAsTemplateViewModelLoaded: (vm: ViewModels.ModalSaveMailAsTemplateViewModel) => void = () => { };
        private showSaveAsMailTemplate(recipients: string[], templates: PanelLeaderModels.MailTemplate[]) {

            let self = this;

            self.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("SaveAsTemplate"), (mw: Framework.Modal.Modal) => {
                let vm = new ViewModels.ModalSaveMailAsTemplateViewModel(mw, templates);

                vm.OnSave = (template: PanelLeaderModels.MailTemplate) => {

                    self.sendMail(recipients, (monitoringProgresses) => {
                        //TODO
                    });

                };

                vm.HelpPage = "modalSaveAsMailTemplate";

                self.OnModalSaveMailAsTemplateViewModelLoaded(vm);

                return vm;
            }, "100vh", "400px");

        }

        private showModalHelp(htmlPage: string) {

            //TODO : CSS, viewmodel            
            let path = "help/" + htmlPage + ".html";
            Framework.BaseView.Load(path, undefined, (div) => {
                var w = window.open();
                $(w.document.body).html(div.innerHTML);
            });

        }

        public OnModalImportViewModelLoaded: (vm: ViewModels.ModalImportViewModel<any>) => void = () => { };
        private showModalImport(title: string, importTemplate: Framework.ImportManager.Template, importFunction: (data: any[]) => void, importFromDBFunction: () => void = undefined): Framework.Modal.ConfirmModal {
            let self = this;

            let sources: string[] = ["XLS", "XLSX", "CSV", "TXT"/*, "XML"*/];

            //if (importFromDBFunction) {
            //    sources.push("DB");
            //}

            let importFromXMLFunction = (json: string, callback: (data: any) => void) => {

                Framework.Progress.Show(Framework.LocalizationManager.Get("ImportingData"));
                var worker: Worker = new Worker("ts/ReadJSONWorkerPL.js");
                worker.onmessage = function (e) {
                    let session: PanelLeaderModels.Session = Framework.Factory.CreateFrom(PanelLeaderModels.Session, e.data);
                    session.Check();
                    if (importTemplate.Name == "Subject") {
                        callback(session.ListSubjects);
                    }

                    if (importTemplate.Name == "ProductDesign" || importTemplate.Name == "AttributeDesign" || importTemplate.Name == "Product" || importTemplate.Name == "Attribute") {

                        let designs = session.ListExperimentalDesigns;
                        if (importTemplate.Name == "ProductDesign" || importTemplate.Name == "Product") {
                            designs = designs.filter((x) => { return x.Type == "Product" });
                        }
                        if (importTemplate.Name == "AttributeDesign" || importTemplate.Name == "Attribute") {
                            designs = designs.filter((x) => { return x.Type == "Attribute" });
                        }

                        if (designs.length > 1) {
                            let div = document.createElement("div");
                            let selectedDesign: Models.ExperimentalDesign = undefined;
                            let select = Framework.Form.Select.Render("", Framework.KeyValuePair.FromArray(designs.map((x) => { return x.Name })), Framework.Form.Validator.NotEmpty(), (x) => {
                                selectedDesign = Framework.Factory.CreateFrom(Models.ExperimentalDesign, session.ListExperimentalDesigns.filter((design) => { return design.Name == x })[0]);
                            }, false);
                            div.appendChild(select.HtmlElement);
                            Framework.Modal.Alert(Framework.LocalizationManager.Get("SelectAnExperimentalDesign"), div, () => {
                                if (importTemplate.Name == "ProductDesign" || importTemplate.Name == "AttributeDesign") {
                                    callback(selectedDesign.GetExperimentalDesignTable(true));
                                }
                                if (importTemplate.Name == "Product" || importTemplate.Name == "Attribute") {
                                    callback(selectedDesign.ListItems);
                                }
                            });
                        } else {
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

            let div = document.createElement("div");

            let d = document.createElement("div");
            d.innerHTML = Framework.LocalizationManager.Get("ChooseFileFormat");
            div.appendChild(d);

            let format = "";
            let select = Framework.Form.Select.Render("", Framework.KeyValuePair.FromArray(sources), Framework.Form.Validator.NotEmpty(), (x) => { format = x; }, false);
            select.HtmlElement.style.width = "100%";
            div.appendChild(select.HtmlElement);

            return Framework.Modal.Confirm(title, div, () => {

                self.showModal("html/ModalImport.html", title, (mw: Framework.Modal.Modal) => {
                    let vm = new ViewModels.ModalImportViewModel(mw, format, importTemplate, importFunction, importFromXMLFunction, importFromDBFunction);

                    self.OnModalImportViewModelLoaded(vm);

                    vm.HelpPage = "modalImport";

                    return vm;
                }, "80vh", "80vw", true);

            });

        }

        //private showModalNewSessionFromTemplate() {
        //    let self = this;

        //    //TODO
        //    alert("Not implemented");

        //    //this.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("NewSessionFromDelimitedTextFile"), "modalNewSessionFromDelimitedTextFile", (mw: Framework.Modal) => {
        //    //    //let modal = new Views.ModalSimulation(mw, subjectSession);
        //    //    //return modal;
        //    //});
        //}

        public OnModalSimulationViewModelLoaded: (vm: ViewModels.ModalSimulationViewModel) => void = () => { };
        private showModalSimulation(subjectSession: Models.SubjectSeance, currentScreenId: number, isInTest: boolean) {
            let self = this;

            let coef = 1;
            if (subjectSession.ListScreens[0]) {
                coef = Models.Screen.GetRatio(subjectSession.ListScreens[0]);
            }
            let height = window.innerHeight - 160;
            let width = height * coef;

            this.showModal("html/ModalDefault.html", undefined, (mw: Framework.Modal.Modal) => {
                let vm = new ViewModels.ModalSimulationViewModel(mw, subjectSession, currentScreenId, isInTest);

                vm.HelpPage = "modalSimulation";


                self.OnModalSimulationViewModelLoaded(vm);

                return vm;
            }, height + "px", width + "px", true);

        }

        public OnModalEditDesignRanksViewModelLoaded: (vm: ViewModels.ModalEditDesignRanksViewModel) => void = () => { };
        private showModalEditDesignRanks(design: Models.ExperimentalDesign, onChange: (itemCode: string, replicate: number, newRank: number) => void) {
            let self = this;
            this.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("ProductRanks"), (mw: Framework.Modal.Modal) => {

                let vm = new ViewModels.ModalEditDesignRanksViewModel(mw, design, onChange);

                vm.HelpPage = "modalEditDesignRanks";

                self.OnModalEditDesignRanksViewModelLoaded(vm);

                return vm;

            }, "180px", "400px", false, false, true);
        }

        public OnModalScreenStyleViewModelLoaded: (vm: ViewModels.ModalScreenStyleViewModel) => void = () => { };
        private showModalScreensStyle(onChange: () => void) {

            let self = this;
            this.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("ScreenStyle"), (mw: Framework.Modal.Modal) => {

                let vm = new ViewModels.ModalScreenStyleViewModel(mw, self.session.DefaultScreenOptions);

                vm.HelpPage = "modalScreenStyle";

                vm.ChangeScreenResolution = (resolution: string) => {
                    let memory = self.session.DefaultScreenOptions.Resolution;
                    let cmd = new Framework.Command(() => {
                        self.session.ChangeAllScreensResolution(resolution);
                        onChange();
                    }, () => {
                        self.session.ChangeAllScreensResolution(memory);
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                vm.SetListScreensProgressBar = (position: string, barType: string) => {
                    let memoryPosition = self.session.DefaultScreenOptions.ProgressBarPosition;
                    let memoryType = self.session.DefaultScreenOptions.ProgressBar;
                    let cmd = new Framework.Command(() => {
                        self.session.SetListScreensProgressBar(position, barType);
                        onChange();
                    }, () => {
                        self.session.SetListScreensProgressBar(memoryPosition, memoryType);
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                vm.SetListScreensBackground = (background: string) => {
                    let memory = self.session.DefaultScreenOptions.ScreenBackground;
                    let cmd = new Framework.Command(() => {
                        self.session.SetListScreensBackground(background);
                        onChange();
                    }, () => {
                        self.session.SetListScreensBackground(memory);
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                vm.SetSessionStyle = (style: object) => {
                    let memory = self.session.DefaultScreenOptions.DefaultStyle;
                    let cmd = new Framework.Command(() => {
                        self.session.ApplyStyle(style);
                        onChange();
                    }, () => {
                        self.session.ApplyStyle(memory);
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                }

                self.OnModalScreenStyleViewModelLoaded(vm);

                mw.Float('right');

                return vm;
            }, "100vh", "550px", true, false, true);

        }

        public OnModalDesignSettingsViewModelLoaded: (vm: ViewModels.ModalDesignSettingsViewModel) => void = () => { };
        private showModalDesignSettings(design: Models.ExperimentalDesign, onChange: (design: Models.ExperimentalDesign) => void) {

            let self = this;
            this.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("ExperimentalDesignSettings"), (mw: Framework.Modal.Modal) => {
                let vm = new ViewModels.ModalDesignSettingsViewModel(mw, design, self.session.ListExperimentalDesigns.map((e) => { return e.Name; }), onChange);
                vm.HelpPage = "modalExperimentalDesignSettings";
                self.OnModalDesignSettingsViewModelLoaded(vm);
                return vm;
            }, undefined, "750px");

        }

        private showModalBugReport() {
            //TODO : VM
            let self = this;
            let user = "Inconnu";
            if (self.account) {
                user = self.account.FirstName + " " + self.account.LastName;
            }

            let textarea = document.createElement("textarea");
            textarea.rows = 5;
            textarea.style.width = "100%";
            textarea.style.height = "200px";
            textarea.style.verticalAlign = "top";

            Framework.GlobalErrorCatcher.GetBugReport((date: string, browser: string, os: string, context: string, img: string) => {
                let modal = Framework.Modal.Confirm(Framework.LocalizationManager.Get("PleaseEnterBugDescription"), textarea, () => {
                    let detail = textarea.innerText;

                    // Envoi de mail
                    Framework.GlobalErrorCatcher.GetHtmlReport("PanelLeader", user, detail, date, browser, os, context, img, (html: string) => {

                        let obj = { data: encodeURI(html) }

                        self.CallWCF('UploadBug', obj, () => {
                        }, () => {
                        });
                    });

                    // Enregistrement dans issues
                    let obj1 = {
                        browser: browser,
                        os: os,
                        software: "PanelLeader",
                        type: "Defect",
                        login: self.account.Login,
                        password: self.account.Password,
                        title: "Nouveau bug",
                        detail: detail,
                        sendMail: false
                    }
                    self.CallWCF('CreateIssue', obj1, () => { }, () => { });
                });
            });

        }

        public OnModalSessionLogViewModelLoaded: (vm: ViewModels.ModalSessionLogViewModel) => void = () => { };
        private showModalSessionLog() {

            let self = this;

            let dataBasePath: string = "";

            let show = () => {
                self.showModal("html/ModalSessionLog.html", Framework.LocalizationManager.Get("SessionLog") + " " + self.session.Name, (mw: Framework.Modal.Modal) => {
                    let vm = new ViewModels.ModalSessionLogViewModel(mw, self.session.GetSessionInfo(dataBasePath + "/" + self.session.Name));
                    vm.HelpPage = "modalSessionLog";
                    self.OnModalSessionLogViewModelLoaded(vm);
                    return vm;
                }, undefined, undefined, true);
            }

            if (self.session.LocalDirectoryId != "0") {
                self.dbDirectory.GetItemOnServer(self.session.LocalDirectoryId).then((dir: PanelLeaderModels.ServerDirectory) => {
                    //self.dbLocalDirectory.GetAllItems(() => { }, () => { }, (directories: PanelLeaderModels.LocalDirectory[]) => {
                    self.dbDirectory.DownloadItems(() => { }, () => { }, (directories: PanelLeaderModels.ServerDirectory[]) => {
                        let parents = dir.GetParentDirectories(directories);
                        parents.forEach((x) => {
                            dataBasePath += "/" + x.Name;
                        });
                        show();
                    });
                });
            } else {
                show();
            }

        }

        public OnModalScreenFromXMLViewModelLoaded: (vm: ViewModels.ModalScreenFromXMLViewModel) => void = () => { };
        private showModalScreenXML(screens: Models.Screen[], listDesigns: Models.ExperimentalDesign[], callback: (selectedScreens: Models.Screen[]) => void) {

            let self = this;
            this.showModal("html/ModalDefault.html", Framework.LocalizationManager.Get("Screen"), (mw: Framework.Modal.Modal) => {

                let vm = new ViewModels.ModalScreenFromXMLViewModel(mw, screens, listDesigns, callback);

                vm.HelpPage = "modalScreenXML";
                self.OnModalScreenFromXMLViewModelLoaded(vm);

                return vm;
            }, undefined, "830px", true, false, true);

        }

        public OnModalScreenPropertiesViewModelLoaded: (vm: ViewModels.ModalScreenPropertiesViewModel) => void = () => { };
        private showModalScreenProperties(screen: Models.Screen, screenIndex: number, onChange: () => void, scenarioView: ViewModels.ScenarioViewModel) {

            let self = this;
            this.showModal("html/ModalDefault.html", Framework.LocalizationManager.Format("ScreenId", [screenIndex.toString()]), (mw: Framework.Modal.Modal) => {

                let vm = new ViewModels.ModalScreenPropertiesViewModel(mw, screen, self.session.ListExperimentalDesigns, self.session.ListSubjects, onChange);

                vm.HelpPage = "modalScreenProperties";

                vm.SetBackground = (currentScreen: Models.Screen, background: string) => {
                    let memoryBackground = currentScreen.Background;
                    let cmd = new Framework.Command(() => {
                        self.session.SetScreenBackground(currentScreen, background);
                        onChange();
                    }, () => {
                        self.session.SetScreenBackground(currentScreen, memoryBackground);
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };

                vm.SetExperimentalDesign = (currentScreen: Models.Screen, experimentalDesignId: number) => {
                    let memoryId = currentScreen.ExperimentalDesignId;
                    let cmd = new Framework.Command(() => {
                        self.session.SetScreenExperimentalDesign(currentScreen, experimentalDesignId);
                        onChange();
                    }, () => {
                        self.session.SetScreenExperimentalDesign(currentScreen, memoryId);
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };

                //TODo : méthode dans session
                vm.SetTimer = (currentScreen: Models.Screen, timer: boolean) => {
                    let undoTimer: boolean = !timer;
                    let cmd = new Framework.Command(() => {
                        if (timer == true) {
                            let control = ScreenReader.Controls.CustomTimer.Create("Visible", 60);
                            scenarioView.AddControlToScreen(currentScreen, control, (c: ScreenReader.Controls.BaseControl) => {
                                scenarioView.SetCurrentControl(control);
                            }, true);
                        } else {
                            scenarioView.RemoveControlFromScreen(currentScreen, currentScreen.GetTimer());
                        }
                    }, () => {
                        if (undoTimer == true) {
                            let control = ScreenReader.Controls.CustomTimer.Create("Visible", 60);
                            scenarioView.AddControlToScreen(currentScreen, control, (c: ScreenReader.Controls.BaseControl) => {
                                scenarioView.SetCurrentControl(control);
                            }, true);
                        } else {
                            scenarioView.RemoveControlFromScreen(currentScreen, currentScreen.GetTimer());
                        }
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };

                //TODo : méthode dans session
                vm.SetChronometer = (currentScreen: Models.Screen, chronometer: boolean) => {
                    let undoChronometer: boolean = !chronometer;
                    let cmd = new Framework.Command(() => {
                        if (chronometer == true) {
                            let control = ScreenReader.Controls.CustomChronometer.Create(60);
                            scenarioView.AddControlToScreen(currentScreen, control, (c: ScreenReader.Controls.BaseControl) => {
                                scenarioView.SetCurrentControl(control);
                            }, true);
                        } else {
                            scenarioView.RemoveControlFromScreen(currentScreen, currentScreen.GetChronometer());
                        }
                    }, () => {
                        if (undoChronometer == true) {
                            let control = ScreenReader.Controls.CustomChronometer.Create(60);
                            scenarioView.AddControlToScreen(currentScreen, control, (c: ScreenReader.Controls.BaseControl) => {
                                scenarioView.SetCurrentControl(control);
                            }, true);
                        } else {
                            scenarioView.RemoveControlFromScreen(currentScreen, currentScreen.GetChronometer());
                        }
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };

                //TODo : méthode dans session
                vm.SetConditionalVisibility = (currentScreen: Models.Screen, conditional: boolean) => {
                    let undoConditional: boolean = !conditional;
                    let cmd = new Framework.Command(() => {
                        currentScreen.IsConditionnal = conditional;
                        onChange();
                    }, () => {
                        currentScreen.IsConditionnal = undoConditional;
                        onChange();
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };

                //TODo : méthode dans session
                vm.SetSpeechRecognition = (currentScreen: Models.Screen, recognition: string) => {
                    let cmd = new Framework.Command(() => {
                        let spt = currentScreen.GetSpeechToText();
                        if (spt) {
                            scenarioView.RemoveControlFromScreen(currentScreen, spt);
                        }
                        if (recognition != "None") {
                            let designType: string = "";
                            var designs: Models.ExperimentalDesign[] = self.session.ListExperimentalDesigns.filter(function (x) {
                                return x.Id === currentScreen.ExperimentalDesignId;
                            });
                            if (designs.length > 0) {
                                designType = designs[0].Type;
                            }
                            let control: ScreenReader.Controls.SpeechToText = ScreenReader.Controls.SpeechToText.Create(designType, recognition);
                            scenarioView.AddControlToScreen(currentScreen, control, (c: ScreenReader.Controls.BaseControl) => {
                                scenarioView.SetCurrentControl(control);
                            }, true);
                        }
                    }, () => {
                        scenarioView.RemoveControlFromScreen(currentScreen, currentScreen.GetSpeechToText());
                    });
                    self.commandInvoker.ExecuteCommand(cmd);
                };

                vm.ToggleScreenCondition = (screen: Models.Screen, condition: string, value) => {
                    self.session.ToggleScreenCondition(screen, condition, value);
                };

                self.OnModalScreenPropertiesViewModelLoaded(vm);

                mw.Float('right');

                return vm;
            }, "100vh", "500px", true, false, true);

        }

        public OnModalSessionsDBViewModelLoaded: (vm: ViewModels.ModalSessionsDBViewModel) => void = () => { };
        private showModalSessionsDB(callbackOnSelectSession: (id: string) => void, callbackOnClose: () => void = undefined, canClose: boolean = true) {
            let self = this;

            let listLinkToLocalSession: PanelLeaderModels.ServerSessionShortcut[] = [];
            let listLocalDirectory: PanelLeaderModels.ServerDirectory[] = [];

            //self.dbLinkToLocalSession.GetAllItems(() => { }, () => { }, (list: PanelLeaderModels.LinkToLocalSession[]) => {
            self.dbSessionShortcut.DownloadItems(() => { }, () => { }, (list: PanelLeaderModels.ServerSessionShortcut[]) => {
                listLinkToLocalSession = list;
                //self.dbLocalDirectory.GetAllItems(() => { }, () => { }, (list: PanelLeaderModels.LocalDirectory[]) => {
                self.dbDirectory.DownloadItems(() => { }, () => { }, (list: PanelLeaderModels.ServerDirectory[]) => {
                    listLocalDirectory = list;
                    show();
                });
            });

            let show = () => {
                self.showModal("html/ModalSessionsDB.html", Framework.LocalizationManager.Get("LocalSessions"), (mw: Framework.Modal.Modal) => {

                    let vm = new ViewModels.ModalSessionsDBViewModel(mw, listLocalDirectory, listLinkToLocalSession, callbackOnSelectSession, callbackOnClose);

                    vm.HelpPage = "modalSessionsDB";

                    vm.SaveAs = (linkToLocalSession: PanelLeaderModels.ServerSessionShortcut, filename: string, description: string, localDirectoryId: string, callback: () => void) => {
                        self.isSaving = true;

                        //self.session.Name = PanelLeaderModels.ServerSessionShortcut.GetValidName(linkToLocalSession, filename, listLinkToLocalSession); //TODO : message si rename
                        self.session.Name = filename;
                        self.session.Description = description;
                        self.session.LocalDirectoryId = localDirectoryId;
                        self.session.Version = self.version;

                        let link = new PanelLeaderModels.ServerSessionShortcut();
                        link.Description = self.session.Description;
                        link.Name = self.session.Name;
                        link.LocalDirectoryId = localDirectoryId;;
                        self.dbSessionShortcut.SaveItem(link, () => { }, () => { }, (item: PanelLeaderModels.ServerSessionShortcut) => {
                            self.session.ID = item.ID;
                            self.dbSession.SaveItem(self.session, () => { }, () => { }, () => {
                                self.isSaving = false;
                                callback();
                            });
                        });
                    }

                    vm.CreateDirectory = (parentDirectory: PanelLeaderModels.ServerDirectory, callback: () => void) => {

                        let newDirectory = PanelLeaderModels.ServerDirectory.Create(parentDirectory, listLocalDirectory);

                        self.dbDirectory.SaveItem(newDirectory, () => { }, () => { }, (item: PanelLeaderModels.ServerDirectory) => {
                            listLocalDirectory.push(item);
                            callback();
                        });

                    };

                    vm.DeleteDirectory = (directory: PanelLeaderModels.ServerDirectory, callback: () => void) => {

                        self.dbDirectory.RemoveItem(directory, () => { }, () => { }, (item: PanelLeaderModels.ServerDirectory) => {
                            Framework.Array.Remove(listLocalDirectory, item);
                            callback();
                            //TODO : supprimer link et session du directory
                        });

                    };

                    vm.RenameDirectory = (directory: PanelLeaderModels.ServerDirectory, newName: string, callback: (newName: string) => void) => {
                        directory.Name = PanelLeaderModels.ServerDirectory.GetValidDirectoryName(directory, newName, listLocalDirectory);

                        self.dbDirectory.SaveItem(directory, () => { }, () => { }, (item: PanelLeaderModels.ServerDirectory) => {
                            callback(directory.Name);
                        });

                    };

                    vm.DeleteSession = (link: PanelLeaderModels.ServerSessionShortcut, callback: () => void) => {

                        self.dbSessionShortcut.RemoveItem(link, () => { }, () => { }, (item: PanelLeaderModels.ServerSessionShortcut) => {
                            Framework.Array.Remove(listLinkToLocalSession, item);
                            self.dbSession.GetItemOnServer(item.ID).then((x: PanelLeaderModels.Session) => {
                                //TODO : suppression session
                                if (x != null) {
                                    self.dbSession.RemoveItem(x, () => { }, () => { }, () => {
                                        self.menuViewModel.SetRecentFiles(listLinkToLocalSession);
                                        callback();
                                    });
                                }
                            });

                        });

                    }

                    vm.RenameSession = (link: PanelLeaderModels.ServerSessionShortcut, newName: string, callback: (newName: string) => void) => {
                        link.Name = PanelLeaderModels.ServerSessionShortcut.GetValidName(link, newName, listLinkToLocalSession);
                        self.dbSessionShortcut.SaveItem(link, () => { }, () => { }, (item: PanelLeaderModels.ServerSessionShortcut) => {
                            callback(link.Name);
                            self.dbSession.GetItemOnServer(link.ID).then((x: PanelLeaderModels.Session) => {
                                x.Name = link.Name;
                                self.dbSession.SaveItem(x, () => { }, () => { }, () => { });
                            });
                        });

                    }

                    self.OnModalSessionsDBViewModelLoaded(vm);

                    return vm;


                }, "80vh", "70vw", canClose);

            }
        }

        public OnModalTemplatedSessionsDBLoaded: (vm: ViewModels.ModalSessionsDBViewModel) => void = () => { };
        private showModalTemplatedSessionsDB(callbackOnSelectSession: (id: string) => void, callbackOnClose: () => void = undefined, canClose: boolean = true) {
            let self = this;

            let listLinkToLocalSession: PanelLeaderModels.ServerSessionShortcut[] = [];
            let listLocalDirectory: PanelLeaderModels.ServerDirectory[] = [];

            self.dbSessionShortcut.DownloadItems(() => { }, () => { }, (list: PanelLeaderModels.ServerSessionShortcut[]) => {
                listLinkToLocalSession = list;
                self.dbDirectory.DownloadItems(() => { }, () => { }, (list: PanelLeaderModels.ServerDirectory[]) => {
                    listLocalDirectory = list;
                    show();
                });
            });

            let show = () => {
                self.showModal("html/ModalSessionsDB.html", Framework.LocalizationManager.Get("LocalSessions"), (mw: Framework.Modal.Modal) => {
                    let vm = new ViewModels.ModalSessionsDBViewModel(mw, listLocalDirectory, listLinkToLocalSession, callbackOnSelectSession, callbackOnClose);
                    vm.HelpPage = "modalSessionsDB";
                    self.OnModalTemplatedSessionsDBLoaded(vm);
                    return vm;
                }, "80vh", "70vw", canClose);

            }
        }

        public OnModalAnalysisViewModelLoaded: (vm: ViewModels.ModalAnalysisViewModel) => void = () => { };
        private showModalAnalysis(listData: Models.Data[]) {
            let self = this;

            let dbAnalysisTemplates = Framework.Database.ServerDB.GetInstance("AnalysisTemplate", self.account.PanelLeaderApplicationSettings.DatabaseSynchronization, self.wcfServiceUrl, self.account.Login, self.account.Password);

            //dbAnalysisTemplates.GetAllItems(() => { }, () => { }, (templates: PanelLeaderModels.AnalysisTemplate[]) => {
            dbAnalysisTemplates.DownloadItems(() => { }, () => { }, (/*templates: PanelLeaderModels.AnalysisTemplate[]*/) => {

                self.showModal("html/ModalAnalysis.html", Framework.LocalizationManager.Get("Analysis"), (mw: Framework.Modal.Modal) => {

                    let dataTypes: string[] = [];

                    if (self.session.ListData.length > 0) {
                        dataTypes = Framework.Array.Unique(self.session.ListData.map((x) => { return Models.DataType[x.Type]; }));
                    }

                    //let appropriateTemplates = [];
                    //dataTypes.forEach((x) => {
                    //    let dataTemplates = templates.filter((y) => { return y.DataType == x });
                    //    dataTemplates.forEach((y) => {
                    //        appropriateTemplates.push(y);
                    //    });
                    //});

                    let vm = new ViewModels.ModalAnalysisViewModel(mw, listData, dataTypes/*, appropriateTemplates*/);

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

                    vm.RServerLogin = this.account.Login;
                    vm.RServerPassword = this.account.Password;
                    vm.RServerWCFServiceURL = this.wcfServiceUrl;
                    vm.RServerOnComplete = () => {
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

                    vm.ImputData = (listData: Models.Data[], save: boolean) => {
                        let cmd = new Framework.Command(() => {
                            self.addData(listData, save, "imputation");
                        }, () => {
                        });
                        self.commandInvoker.ExecuteCommand(cmd);
                    };

                    self.OnModalAnalysisViewModelLoaded(vm);

                    return vm;

                }, "80vh", "80vw", true);
            });
        }

        public OnModalSessionWizardViewModelLoaded: (vm: ViewModels.ModalSessionWizardViewModel) => void = () => { };
        private showModalSessionWizard() {
            let self = this;

            this.showModal("html/ModalSessionWizard.html", Framework.LocalizationManager.Get("SessionWizard"), (mw: Framework.Modal.Modal) => {

                let vm = new ViewModels.ModalSessionWizardViewModel(mw);

                vm.ShowModalSessionTemplateDB = (onLoaded: (session: PanelLeaderModels.Session) => void) => {

                    self.showModalTemplatedSessionsDB((id: string) => {

                        self.dbSessionShortcut.GetItemOnServer(id).then(
                            (link: PanelLeaderModels.ServerSessionShortcut) => {
                                self.dbSession.GetItemOnServer(id).then((session: PanelLeaderModels.Session) => {
                                    if (session != null) {
                                        onLoaded(session);
                                    } else {
                                    }
                                });


                            }
                        );
                    });
                }

                vm.CreateNewSessionFromTemplate = (template: PanelLeaderModels.TemplatedSession) => {
                    let session = PanelLeaderModels.Session.FromTemplate(template);
                    self.SetNewSession(session, true);
                };

                vm.SaveSession = (session: PanelLeaderModels.Session) => {
                    self.SetNewSession(session, true);
                };

                vm.UploadSession = (session: PanelLeaderModels.Session, onUploaded: () => void) => {


                    let templatedSubjectSeance: Models.TemplatedSubjectSeance = Models.TemplatedSubjectSeance.CreateTemplatedSubjectSeance(session, self.account);

                    let obj = {
                        login: self.account.Login,
                        password: self.account.Password,
                        jsonTemplatedSubjectSeance: JSON.stringify(templatedSubjectSeance),
                    };

                    let wsvc: string = 'UploadSubjectsSeance';

                    self.CallWCF(wsvc, obj, () => {

                    }, (res) => {

                        if (res.Status == 'success') {
                            let serverCode = res.Result;
                            session.SetUpload(self.rootURL, serverCode, self.account.Login, self.account.Password);
                            onUploaded();
                        } else {
                            //self.session.LogAction("Upload", "Error during session upload.", false);
                        }

                        self.notify(Framework.LocalizationManager.Format("UploadingSession", [Framework.LocalizationManager.Get(res.Status)]), res.Status);
                    })

                }

                vm.HelpPage = "modalSessionWizard";

                self.OnModalSessionWizardViewModelLoaded(vm);

                return vm;
            }, "80vh", "1000px", true);

        }

        public OnModalLoginViewModelLoaded: (vm: ViewModels.ModalLoginViewModel) => void = () => { };
        private showModalLogin() {
            let self = this;

            this.showModal("html/ModalLogin.html", Framework.LocalizationManager.Get("Login"), (mw: Framework.Modal.Modal) => {

                let login = "";
                let password = "";
                if (this.account) {
                    login = this.account.Login;
                    password = this.account.Password;
                }
                let vm = new ViewModels.ModalLoginViewModel(mw, login, password);

                vm.Login = (login: string, password: string) => {
                    self.login(login, password, () => {
                        mw.Close();
                    }, (error: string) => {
                        vm.OnError(Framework.LocalizationManager.Get(error));
                    });
                }

                vm.HelpPage = "modalLogin";

                self.OnModalLoginViewModelLoaded(vm);

                return vm;
            });

        }

        public OnModalSaveSessionAsUndeployedCopyViewModelLoaded: (vm: ViewModels.ModalSaveSessionAsUndeployedCopyViewModel) => void = () => { };
        private showModalSaveAsUndeployedCopy() {

            let self = this;
            this.showModal("html/ModalSaveAsUndeployedCopy.html", Framework.LocalizationManager.Get("SaveAsCopy"), (mw: Framework.Modal.Modal) => {

                let vm = new ViewModels.ModalSaveSessionAsUndeployedCopyViewModel(mw);

                vm.HelpPage = "modalSettings";

                vm.SaveSessionAsUndeployedCopy = (deleteUpload: boolean, deleteData: boolean, deleteSubjects: boolean, deleteProducts: boolean, deleteAttributes: boolean, deleteMail: boolean, callback: () => void) => {
                    let copyOfSession: PanelLeaderModels.Session = self.session.SaveAsUndeployedCopy(deleteUpload, deleteData, deleteSubjects, deleteProducts, deleteAttributes, deleteMail);
                    copyOfSession.Name = Framework.LocalizationManager.Get("CopyOf ") + copyOfSession.Name;
                    self.SetNewSession(copyOfSession, true);
                    callback();
                }

                self.OnModalSaveSessionAsUndeployedCopyViewModelLoaded(vm);

                return vm;

            }, undefined, undefined, false);

        }

        public OnModalMailViewModelLoaded: (vm: ViewModels.ModalMailViewModel) => void = () => { };
        private showModalSendMail(recipients: string[], onClose: (monitoringProgresses) => void) {

            let self = this;

            let dbMailTemplates = Framework.Database.ServerDB.GetInstance("MailTemplate", self.account.PanelLeaderApplicationSettings.DatabaseSynchronization, self.wcfServiceUrl, self.account.Login, self.account.Password);

            //dbMailTemplates.GetAllItems(() => { }, () => { }, (templates: PanelLeaderModels.MailTemplate[]) => {
            dbMailTemplates.DownloadItems(() => { }, () => { }, (templates: PanelLeaderModels.MailTemplate[]) => {

                let defaultTemplates = templates.filter((y) => { return y.IsDefault == true });
                if (defaultTemplates.length > 0) {
                    let defaultTemplate = defaultTemplates[defaultTemplates.length - 1];
                    self.session.SetMailFromTemplate(defaultTemplate);
                }

                self.showModal("html/ModalSendMail.html", Framework.LocalizationManager.Get("SendMail"), (mw: Framework.Modal.Modal) => {

                    let vm = new ViewModels.ModalMailViewModel(mw, templates, self.session.Mail, recipients, onClose);

                    vm.HelpPage = "modalSendMail";

                    vm.RemoveMailTemplate = (template: PanelLeaderModels.MailTemplate, callback: () => void) => {
                        dbMailTemplates.RemoveItem(template, () => { }, () => { }, () => { callback(); });
                    };

                    vm.SaveMailTemplate = (template: PanelLeaderModels.MailTemplate, callback: () => void) => {
                        dbMailTemplates.SaveItem(template, () => { }, () => { }, () => { callback(); });
                    };

                    vm.SendMail = (recipients: string[], subject: string, body: string, displayName: string, returnAddress: string, saveAsTemplate: boolean, callback: (monitoringProgresses) => void, templates: PanelLeaderModels.MailTemplate[]) => {
                        //TODO Fractionner envoi de mails
                        self.session.Mail.Body = body;
                        self.session.Mail.DisplayedName = displayName;
                        self.session.Mail.ReturnMailAddress = returnAddress;
                        self.session.Mail.Subject = subject;

                        if (saveAsTemplate == true) {
                            self.showSaveAsMailTemplate(recipients, templates);
                        } else {
                            self.sendMail(recipients, callback);
                        }
                    };

                    self.OnModalMailViewModelLoaded(vm);

                    return vm;

                }, undefined, undefined, true);
            });

        }

    }

    export module ViewModels {

        export abstract class PanelLeaderViewModel extends Framework.ViewModel {

            protected isLocked: boolean = false;

            public OnLockChanged(isLocked: boolean) {
            }

        }

        export abstract class PanelLeaderModalViewModel extends PanelLeaderViewModel {

            protected mw: Framework.Modal.Modal;

            constructor(mw: Framework.Modal.Modal) {
                super();
                this.mw = mw;
            }

            public Close() {
                this.mw.Close();
            }
        }

        export class MenuViewModel {

            // Onglets
            private tabProtocol: Framework.Form.ClickableElement;
            private tabScenario: Framework.Form.ClickableElement;
            private tabDeployment: Framework.Form.ClickableElement;
            private tabMonitoring: Framework.Form.ClickableElement;
            private tabData: Framework.Form.ClickableElement;
            //private tabAnalysis: Framework.Form.ClickableElement;
            //private tabOutputs: Framework.Form.ClickableElement;

            public get TabProtocol(): Framework.Form.ClickableElement { return this.tabProtocol; }
            //public get TabScenario(): Framework.Form.ClickableElement { return this.tabScenario; }
            //public get TabDeployment(): Framework.Form.ClickableElement { return this.tabDeployment; }
            //public get TabMonitoring(): Framework.Form.ClickableElement { return this.tabMonitoring; }
            //public get TabData(): Framework.Form.ClickableElement { return this.tabData; }
            //public get TabAnalysis(): Framework.Form.ClickableElement { return this.tabAnalysis; }
            //public get TabOutputs(): Framework.Form.ClickableElement { return this.tabOutputs; }


            private ulRecentFiles: HTMLUListElement;

            //private iconMenuSpinnerRotating: Framework.Form.TextElement;

            //private anchorMenuBug: Framework.Form.ClickableElement;

            // Eléments du menu
            private anchorMenuNewSessionFromXML: Framework.Form.ClickableElement;
            private anchorMenuNewSessionFromWizard: Framework.Form.ClickableElement;
            //private anchorMenuNewSessionFromDelimitedTextFile: Framework.Form.ClickableElement;
            //private anchorMenuNewSessionFromFromTemplate: Framework.Form.ClickableElement;
            private anchorMenuExportSessionAsXML: Framework.Form.ClickableElement;
            private anchorMenuBrowseLocalDB: Framework.Form.ClickableElement;
            private anchorMenuSaveSessionInLocalDB: Framework.Form.ClickableElement;
            private anchorMenuSaveSessionAsUndeployedCopy: Framework.Form.ClickableElement;
            //private anchorMenuSaveSessionAsTemplate: Framework.Form.ClickableElement;
            //private anchorMenuExit: Framework.Form.ClickableElement;
            private anchorMenuShowSettings: Framework.Form.ClickableElement;
            //private anchorMenuHelp: Framework.Form.ClickableElement;
            private anchorMenuLogout: Framework.Form.ClickableElement;
            //private anchorMenuToggleLock: Framework.Form.ClickableElement;
            //private anchorMenuUndo: Framework.Form.ClickableElement;
            //private anchorMenuRedo: Framework.Form.ClickableElement;
            private anchorMenuSave: Framework.Form.ClickableElement;
            private anchorMenuFullScreen: Framework.Form.ClickableElement;
            //private anchorMenuCurrentFile: Framework.Form.ClickableElement;
            private anchorMenuWarning: Framework.Form.ClickableElement;
            //private iconMenuToggleLock: Framework.Form.TextElement;
            //private anchorMenuOpenSubjectDB: Framework.Form.ClickableElement;
            private anchorMenuCurrentSession: Framework.Form.ClickableElement;
            private anchorMenuDatabase: Framework.Form.ClickableElement;
            private anchorMenuAbout: Framework.Form.ClickableElement;
            private anchorMenuImportSessionV1: Framework.Form.ClickableElement;

            public Undo: () => void;
            public Redo: () => void;
            public ShowWarnings: () => void;
            public ShowModalSessionWizard: () => void;
            public ShowModalNewSessionFromArchive: () => void;
            public ShowModalNewSessionFromDelimitedTextFile: () => void;
            public ExportSessionAsArchive: () => void;
            public ShowModalSessionsDB: () => void;
            public SaveSessionInLocalDB: () => void;
            public ShowModalSessionLog: () => void;
            public ShowModalSaveAsUndeployedCopy: () => void;
            public ShowModalSettings: () => void;
            //public ShowModalDatabase: () => void;
            public Exit: () => void;
            public ShowModalHelp: () => void;
            public LogOut: () => void;
            public ToggleLock: () => void;
            public ShowModalBugReport: () => void;
            public ShowViewSubjects: () => void;
            public ShowViewProducts: () => void;
            public ShowViewAttributes: () => void;
            public ShowViewScenario: () => void;
            public ShowViewUpload: () => void;
            public ShowViewMonitoring: () => void;
            public ShowViewData: () => void;
            public OpenSessionFromLocalDB: (id: string) => void;
            //public DeleteRecentFiles: () => void;
            public Save: () => void;


            private hasSessionDefined: boolean = false;
            private canUndo: boolean = false;
            private canRedo: boolean = false;
            private canSave: boolean = false;
            private isUploaded: boolean = false;
            private hasData: boolean = false;
            private isOnline: boolean = true;

            public get HasSessionDefined() { return this.hasSessionDefined }
            public get CanUndo() { return this.canUndo }
            public get CanRedo() { return this.canRedo }
            public get CanSave() { return this.canSave }
            public get IsUploaded() { return this.isUploaded }
            public get HasData() { return this.hasData }

            constructor() {

                let self = this;

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

                self.anchorMenuFullScreen = Framework.Form.ClickableElement.Register("anchorMenuFullScreen", undefined, () => {

                    Framework.Browser.ToggleFullScreen();
                    if (Framework.Browser.IsFullScreen == false) {
                        self.anchorMenuFullScreen.SetInnerHTML('<i class="fas fa-expand-arrows-alt"></i>');
                    } else {
                        self.anchorMenuFullScreen.SetInnerHTML('<i class="fas fa-compress-arrows-alt"></i>');
                    }
                });

                self.anchorMenuAbout = Framework.Form.ClickableElement.Register("anchorMenuAbout", () => {
                    return self.hasSessionDefined == true;
                }, () => {
                    self.ShowModalSessionLog();
                });

                self.anchorMenuNewSessionFromXML = Framework.Form.ClickableElement.Register("anchorMenuNewSessionFromXML", undefined, () => { self.ShowModalNewSessionFromArchive(); });

                self.anchorMenuNewSessionFromWizard = Framework.Form.ClickableElement.Register("anchorMenuNewSessionFromWizard", undefined, () => {
                    self.ShowModalSessionWizard();
                });

                //self.anchorMenuNewSessionFromDelimitedTextFile = Framework.Form.ClickableElement.Register("anchorMenuNewSessionFromDelimitedTextFile", undefined, () => { self.ShowModalNewSessionFromDelimitedTextFile(); });

                //TODO self.anchorMenuNewSessionFromFromTemplate = Framework.Form.ClickableElement.Register("anchorMenuNewSessionFromFromTemplate", undefined, () => { controller.ShowModalNewSessionFromTemplate(); });

                self.anchorMenuExportSessionAsXML = Framework.Form.ClickableElement.Register("anchorMenuExportSessionAsXML", () => { return self.hasSessionDefined }, () => { self.ExportSessionAsArchive(); }); //TODO : actualiser quand session change

                self.anchorMenuBrowseLocalDB = Framework.Form.ClickableElement.Register("anchorMenuBrowseLocalDB", undefined, () => {
                    self.ShowModalSessionsDB();
                });

                self.anchorMenuSaveSessionInLocalDB = Framework.Form.ClickableElement.Register("anchorMenuSaveSessionInLocalDB", () => { return self.hasSessionDefined }, () => {
                    self.SaveSessionInLocalDB();
                });

                //self.anchorMenuCurrentFile = Framework.Form.ClickableElement.Register("anchorMenuCurrentFile", () => { return self.hasSessionDefined }, () => {
                //    self.ShowModalSessionLog();
                //});

                self.anchorMenuSaveSessionAsUndeployedCopy = Framework.Form.ClickableElement.Register("anchorMenuSaveSessionAsUndeployedCopy", () => { return self.hasSessionDefined }, () => {
                    self.ShowModalSaveAsUndeployedCopy();
                });        //TODO : actualiser quand session change
                //TODO self.anchorMenuSaveSessionAsTemplate = Framework.Form.ClickableElement.Register("anchorMenuSaveSessionAsTemplate", () => { return controller.Session != undefined }, () => { controller.ShowModalSaveSessionAsTemplate(); });        //TODO : actualiser quand session change

                //self.anchorMenuExit = Framework.Form.ClickableElement.Register("anchorMenuExit", () => {
                //    return true;
                //}, () => {
                //    Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToExitTimeSens"), () => {
                //        self.Exit();
                //    });
                //});

                self.anchorMenuShowSettings = Framework.Form.ClickableElement.Register("anchorMenuShowSettings", undefined, () => {
                    self.ShowModalSettings();
                });

                //self.anchorMenuAbout = Framework.Form.ClickableElement.Register("anchorMenuAbout", undefined, () => { controller.ShowModalAbout(); });

                //self.anchorMenuHelp = Framework.Form.ClickableElement.Register("anchorMenuHelp", undefined, () => {
                //    self.ShowModalHelp();
                //});

                self.anchorMenuLogout = Framework.Form.ClickableElement.Register("anchorMenuLogout", () => { return true; }, () => {
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

                self.anchorMenuSave = Framework.Form.ClickableElement.Register("anchorMenuSave", () => { return self.canSave; }, () => { self.Save(); })

                self.anchorMenuCurrentSession = Framework.Form.ClickableElement.Register("anchorMenuCurrentSession", () => { return self.hasSessionDefined; }, () => { })

                //this.anchorMenuBug = Framework.Form.ClickableElement.Register("anchorMenuBug", () => { return true; }, () => { self.ShowModalBugReport(); });


                this.anchorMenuWarning = Framework.Form.ClickableElement.Register("anchorMenuWarning", () => { return true; }, () => {
                    self.ShowWarnings();
                });
                this.anchorMenuWarning.Hide();


                //this.iconMenuToggleLock = Framework.Form.TextElement.Register("iconMenuToggleLock");

                this.ulRecentFiles = <HTMLUListElement>document.getElementById("ulRecentFiles");

                this.tabProtocol = Framework.Form.ClickableElement.Register("tabProtocol", () => { return self.hasSessionDefined; }, () => { self.ShowViewSubjects(); });
                this.tabScenario = Framework.Form.ClickableElement.Register("tabScenario", () => { return self.hasSessionDefined; }, () => { self.ShowViewScenario(); });
                this.tabDeployment = Framework.Form.ClickableElement.Register("tabDeployment", () => { return self.hasSessionDefined; }, () => { self.ShowViewUpload(); });
                this.tabMonitoring = Framework.Form.ClickableElement.Register("tabMonitoring", () => { return self.isUploaded }, () => { self.ShowViewMonitoring(); });
                this.tabData = Framework.Form.ClickableElement.Register("tabData", () => { return self.hasData }, () => { self.ShowViewData(); });
                //self.tabOutputs = Framework.Form.ClickableElement.Register("tabOutputs", () => { return controller.Session != undefined && controller.Session.ListOutputs != undefined && controller.Session.ListOutputs.length > 0; }, () => { controller.SetCurrentView("Outputs"); });

                // TODO - ajouter dans toutes les vues et les modales : Raccourcis clavier            
                //Framework.ShortcutManager.Add(() => { return true; }, 113, () => { self.anchorMenuBug.Click(); });
                //Framework.ShortcutManager.Add(() => { return true; }, 112, () => { self.anchorMenuHelp.Click(); });
                //Framework.ShortcutManager.Add(() => { return self.anchorMenuSave.IsEnabled; }, 83, () => {
                //    self.anchorMenuHelp.Click();
                //}, true);

            }



            public OnLicenseChanged(firstName: string = undefined, lastName: string = undefined) {
                this.anchorMenuLogout.Disable();
                if (firstName && lastName) {
                    this.anchorMenuLogout.Enable();
                    this.anchorMenuLogout.HighlightOn(Framework.LocalizationManager.Format("ClickToLogOut", [firstName.charAt(0) + ". " + lastName]), "bottom");
                }
            }

            public OnSaveChanged(hasChanges: boolean) {
                //this.canSave = hasChanges;
                this.canSave = true;
                this.anchorMenuSave.CheckState();

                //if (hasChanges == true) {                    
                //    this.anchorMenuSave.Enable();
                //} else {
                //    this.anchorMenuSave.Disable();
                //}
            }

            public OnUndoChanged(canRedo: boolean, canUndo: boolean) {
                this.canRedo = canRedo;
                this.canUndo = canUndo;
                //this.anchorMenuUndo.CheckState();
                //this.anchorMenuRedo.CheckState();
            }

            public OnSessionChanged(hasSessionDefined: boolean = false, isUploaded: boolean = false, hasData: boolean = false, sessionInfo: string = "") {
                this.hasSessionDefined = hasSessionDefined;
                this.isUploaded = isUploaded;
                this.hasData = hasData;
                this.tabMonitoring.CheckState();
                this.tabData.CheckState();
                this.anchorMenuAbout.CheckState();
                this.anchorMenuAbout.HtmlElement.title = sessionInfo;
                this.anchorMenuAbout.HighlightOn(sessionInfo, 'bottom');
            }

            public CheckState() {
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

            }

            public ShowWarningsPopup(warnings: string[]) {
                // affichage de tous les warnings quand on clique sur le bouton

                let div = document.createElement("div");

                warnings.forEach((x) => {
                    div.innerHTML += '<p>' + Framework.LocalizationManager.Get(x) + '</p>';
                });

                Framework.Popup.Show(this.anchorMenuWarning.HtmlElement, div, 'bottom');
            }

            public ShowWarning(warning: string, status: string) {

                let self = this;

                if (status == 'nothing') {
                    this.anchorMenuWarning.Hide();
                    return;
                }

                let div = document.createElement("div");

                let wclass = 'fas fa-info';
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
                    setTimeout(() => {
                        Framework.Popup.Show(self.anchorMenuWarning.HtmlElement, div, 'bottom');
                    }, 100);
                }

            }

            public HideWarning() {
                this.anchorMenuWarning.Hide();
                try {
                    Framework.Popup.Destroy(this.anchorMenuWarning.HtmlElement);
                } catch {
                }
            }

            public SetLock(isLocked: boolean) {

                if (this.hasSessionDefined == false) {
                    return;
                }

                if (isLocked == true) {
                    //TODOthis.controller.AddWarning(Framework.LocalizationManager.Get("SessionIsLocked"));
                    //TODOthis.controller.Notify(Framework.LocalizationManager.Get("SessionIsLocked"), 'info');
                    //this.iconMenuToggleLock.HighlightOn(Framework.LocalizationManager.Get("SessionIsLocked"), "bottom");
                    //this.iconMenuToggleLock.HtmlElement.className = "fa fa-lock";
                } else {
                    //this.controller.RemoveWarning(Framework.LocalizationManager.Get("SessionIsLocked"));
                    //this.iconMenuToggleLock.HighlightOn(Framework.LocalizationManager.Get("SessionIsUnlocked"), "bottom");
                    //this.iconMenuToggleLock.HtmlElement.className = "fa fa-unlock";
                }
                //this.anchorMenuToggleLock.Enable();
                //this.anchorMenuCurrentFile.Enable();
            }

            public SetRecentFiles(ls: PanelLeaderModels.ServerSessionShortcut[]) {

                let self = this;

                try {
                    self.ulRecentFiles.innerHTML = "";
                    ls.forEach((link: PanelLeaderModels.ServerSessionShortcut) => {
                        if (link != null) {
                            let li: HTMLLIElement = document.createElement("li");
                            let a: HTMLAnchorElement = document.createElement("a");
                            li.appendChild(a);
                            a.innerHTML = '<i class="fa fa-file" aria-hidden="true"></i> ' + link.Name;
                            a.title = link.Description;
                            a.setAttribute("SessionId", link.ID);
                            a.onclick = function () {
                                self.OpenSessionFromLocalDB((<any>this).getAttribute("SessionId"));
                            }
                            self.ulRecentFiles.appendChild(li);
                        }
                    });
                } catch (err) {
                    //alert(err);
                }

            };

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

            public OnConnectivityChanged(isOnline: boolean) {
                this.isOnline = isOnline;
            }
        }

        export class ExperimentalDesignItemsViewModel extends PanelLeaderViewModel {

            private divList: Framework.Form.TextElement;
            private divItemsTable: Framework.Form.TextElement;
            private divExperimentalDesignTable: Framework.Form.TextElement;

            public TableItems: Framework.Form.Table<Models.ExperimentalDesignItem>;
            public TableExperimentalDesign: Framework.Form.Table<Models.ExperimentalDesignRow>;

            private btnImportItems: Framework.Form.Button;
            //private btnExportItems: Framework.Form.Button;
            private btnInsertItems: Framework.Form.Button;
            private btnDeleteItems: Framework.Form.Button;
            private btnSetLabels: Framework.Form.Button;
            private btnResetDesign: Framework.Form.Button;
            private btnEditDesign: Framework.Form.Button;
            private btnDeleteDesign: Framework.Form.Button;
            private btnUpdateDesign: Framework.Form.Button;
            private btnShowSubjects: Framework.Form.Button;
            private btnShowAttributes: Framework.Form.Button;
            private btnShowProducts: Framework.Form.Button;
            //private btnDatabaseFields: Framework.Form.Button;

            private tabs: Framework.Form.Button[] = [];

            private designs: Models.ExperimentalDesign[];
            private items: Models.ExperimentalDesignItem[]
            private selectedDesign: Models.ExperimentalDesign = undefined;
            private designType: string;

            public ShowViewSubjects: () => void;
            public ShowViewAttributes: () => void;
            public ShowViewProducts: () => void;
            public AddNewDesign: (designType: string) => Models.ExperimentalDesign;
            public AddItemsToDesign: (design: Models.ExperimentalDesign, nb: number) => void;
            public RemoveItemsFromDesign: (design: Models.ExperimentalDesign, items: Models.ExperimentalDesignItem[], removeItemsData: boolean) => void;
            public ShowModalImportItems: (design: Models.ExperimentalDesign) => void;
            public ShowModalImportDesign: () => void;
            public UpdateDesignLabels: (design: Models.ExperimentalDesign) => void;
            public UpdateItem: (design: Models.ExperimentalDesign, oldItemCode: string, propertyName: string, oldPropertyValue: any, newPropertyValue: any) => void;
            public ResetDesign: (design: Models.ExperimentalDesign) => void;
            public RemoveDesign: (design: Models.ExperimentalDesign, associatedData: Models.Data[]) => void;
            public ShowModalEditDesignRanks: (design: Models.ExperimentalDesign, subjectCodes: string[]) => void;
            public EditDesignSettings: (design: Models.ExperimentalDesign) => void;

            public CheckIfDesignIsUsedByControl: (design: Models.ExperimentalDesign) => string;
            public GetDesignData: (design: Models.ExperimentalDesign) => Models.Data[];

            //public EditCustomFields: (design: Models.ExperimentalDesign) => void;
            //public AdditionalFields: PanelLeaderModels.DBField[];

            public ExportItemsToLocalDB: (items: Models.ExperimentalDesignItem[]) => void;

            public ListDataContainsItemCode: (codes: string[]) => boolean;

            private setSelectExperimentalDesigns() {
                let self = this;

                self.divList.HtmlElement.innerHTML = "";
                self.divExperimentalDesignTable.HtmlElement.innerHTML = "";
                self.divItemsTable.HtmlElement.innerHTML = "";

                this.tabs = [];

                self.designs.filter((x) => { return x.Type == self.designType }).forEach((x) => {
                    let button: Framework.Form.Button = Framework.Form.Button.Create(() => { return true; }, (b) => {
                        self.setCurrentDesign(b.CustomAttributes.Get("Design"));
                        self.tabs.forEach((y) => { y.HtmlElement.classList.remove("selected"); });
                        b.HtmlElement.classList.add("selected");
                    }, x.Name, ["expDesignButton"]);
                    button.CustomAttributes.Add("Design", x);
                    self.divList.Append(button);
                    this.tabs.push(button);
                });

                if (this.tabs.length > 0) {
                    this.tabs[this.tabs.length - 1].Click();
                }

                let button: Framework.Form.Button = Framework.Form.Button.Create(() => { return self.isLocked == false; }, () => {
                    self.AddNewDesign(self.designType);
                }, '<span><i class="fas fa-plus"></i></span>&nbsp;' + Framework.LocalizationManager.Get("NewDesign"), ["expDesignButton"]);
                self.divList.Append(button);

            }

            constructor(designType: string, designs: Models.ExperimentalDesign[]/*, additionalFields: PanelLeaderModels.DBField[]*/) {
                super();

                let self = this;

                this.designType = designType;
                this.designs = designs;
                //this.AdditionalFields = additionalFields;

                this.divList = Framework.Form.TextElement.Register("divList");
                this.divItemsTable = Framework.Form.TextElement.Register("divItemsTable");
                this.divExperimentalDesignTable = Framework.Form.TextElement.Register("divExperimentalDesignTable");

                this.btnShowSubjects = Framework.Form.Button.Register("btnShowSubjects", () => { return true; }, () => {
                    self.ShowViewSubjects();
                });

                this.btnShowAttributes = Framework.Form.Button.Register("btnShowAttributes", () => { return true; }, () => {
                    self.ShowViewAttributes();
                });

                this.btnShowProducts = Framework.Form.Button.Register("btnShowProducts", () => { return true; }, () => {
                    self.ShowViewProducts();
                });

                if (designType == "Attribute") {
                    self.btnShowAttributes.HtmlElement.classList.add("active");
                }
                if (designType == "Product") {
                    self.btnShowProducts.HtmlElement.classList.add("active");
                }

                this.btnImportItems = Framework.Form.Button.Register("btnImportItems", () => {
                    return self.isLocked == false;
                }, () => {

                    let div = document.createElement("div");
                    let p = document.createElement("p");

                    p.innerHTML = Framework.LocalizationManager.Format("ImportItemsOrDesign", [Framework.LocalizationManager.Get(designType).toLowerCase()])
                    div.appendChild(p);

                    let b1 = Framework.Form.Button.Create(() => { return true; }, () => {
                        modal.Close();
                        self.ShowModalImportItems(self.selectedDesign);
                    }, Framework.LocalizationManager.Format("ImportItems", [Framework.LocalizationManager.Get(designType).toLowerCase()]), ["btn", "btn-primary"]);

                    let b2 = Framework.Form.Button.Create(() => { return true; }, () => {
                        modal.Close();
                        self.ShowModalImportDesign();
                    }, Framework.LocalizationManager.Get("ImportDesign"), ["btn", "btn-primary"]);

                    let modal = Framework.Modal.Custom(div, Framework.LocalizationManager.Format("ImportItems", [Framework.LocalizationManager.Get(designType).toLowerCase()]), [b1, b2]);

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

                this.btnInsertItems = Framework.Form.Button.Register("btnInsertItems", () => {
                    return self.isLocked == false;
                }, () => {
                    let modal = Framework.Modal.Confirm(Framework.LocalizationManager.Format("AddNewItem", [Framework.LocalizationManager.Get(designType).toLowerCase()]), "");
                    let max = 100;
                    //if (self.selectedDesign.Order == "WilliamsLatinSquare") {
                    //    max = 18;
                    //}
                    modal.AddNumericUpDown(0, max, 1, 1, (val: number) => {
                        self.AddItemsToDesign(self.selectedDesign, val);
                    });

                });

                this.btnDeleteItems = Framework.Form.Button.Register("btnDeleteItems", () => {
                    return self.isLocked == false && self.TableItems && self.TableItems.SelectedData.length > 0;
                }, () => {
                    let div = document.createElement("div");

                    let d = document.createElement("div");
                    d.innerHTML = Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveTheSelection");
                    div.appendChild(d);

                    let removeData: boolean = false;

                    if (self.ListDataContainsItemCode(self.TableItems.SelectedData.map((x) => { return x.Code; }))) {
                        let cb = Framework.Form.CheckBox.Create(() => { return true; }, () => { }, Framework.LocalizationManager.Get("RemoveItemData"), "", false, []);
                        div.appendChild(cb.HtmlElement);
                    }

                    let mw = Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), div, () => {
                        self.RemoveItemsFromDesign(self.selectedDesign, self.TableItems.SelectedData, removeData);
                    });
                });

                this.btnSetLabels = Framework.Form.Button.Register("btnSetLabels", () => {
                    return self.isLocked == false;
                }, () => {
                    Framework.Modal.Confirm(Framework.LocalizationManager.Get("ItemLabelParameters"), Framework.Random.Generator.GetFormContent(self.selectedDesign.RandomCodeGenerator, 3).HtmlElement, () => {
                        self.UpdateDesignLabels(self.selectedDesign);
                    }, undefined, undefined, undefined, undefined, "400px");
                });
                if (designType == "Attribute") {
                    this.btnSetLabels.Hide();
                }

                this.btnResetDesign = Framework.Form.Button.Register("btnResetDesign", () => {
                    return self.isLocked == false;
                }, () => {
                    self.ResetDesign(self.selectedDesign);
                });

                this.btnEditDesign = Framework.Form.Button.Register("btnEditDesign", () => {
                    return self.isLocked == false && self.TableExperimentalDesign && self.TableExperimentalDesign.SelectedData.length > 0;
                }, () => {
                    self.ShowModalEditDesignRanks(self.selectedDesign, self.TableExperimentalDesign.SelectedData.map((x) => { return x.SubjectCode }));
                });

                this.btnDeleteDesign = Framework.Form.Button.Register("btnDeleteDesign", () => {
                    return self.isLocked == false;
                }, () => {
                    let checkResult = self.CheckIfDesignIsUsedByControl(self.selectedDesign);
                    if (checkResult == "") {
                        let associatedData: Models.Data[] = self.GetDesignData(self.selectedDesign);
                        if (associatedData.length > 0) {
                            let modal = Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveThisElement"));
                            modal.AddCheckbox(Framework.LocalizationManager.Get("RemoveItemData"), () => {
                                self.RemoveDesign(self.selectedDesign, associatedData);
                            });
                        } else {
                            Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveThisElement"), () => {
                                self.RemoveDesign(self.selectedDesign, associatedData);
                            });
                        }
                    } else {
                        let splitResult = checkResult.split(" ");
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("DesignCannotBeRemoved"), Framework.LocalizationManager.Format("DesignIsAttached", [Framework.LocalizationManager.Get(splitResult[0]), splitResult[1]]));
                    }
                });

                this.btnUpdateDesign = Framework.Form.Button.Register("btnUpdateDesign", () => {
                    return self.isLocked == false;
                }, () => {
                    self.EditDesignSettings(self.selectedDesign);
                });

                //this.btnDatabaseFields = Framework.Form.Button.Register("btnDatabaseFields", () => { return true; }, () => {
                //    self.EditCustomFields(self.selectedDesign);
                //});

                this.setSelectExperimentalDesigns();

                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return true; }, KeyCode: 113, Action: () => {
                //        self.anchorMenuBug.Click();
                //    }
                //});
            }

            public SetActiveLi(dtype: string) {
                this.btnShowProducts.HtmlElement.parentElement.classList.remove("active");
                this.btnShowAttributes.HtmlElement.parentElement.classList.remove("active");

                if (dtype == "Attribute") {
                    this.btnShowAttributes.HtmlElement.parentElement.classList.add("active");
                }
                if (dtype == "Product") {
                    this.btnShowProducts.HtmlElement.parentElement.classList.add("active");
                }
            }

            public Update(design: Models.ExperimentalDesign, fields: PanelLeaderModels.DBField[] = undefined) {
                //if (fields) {
                //    this.AdditionalFields = fields;
                //}

                this.setSelectExperimentalDesigns();
                if (design) {
                    this.setCurrentDesign(design);
                    this.TableItems.Refresh();
                }
            }

            private export() {
                let wb = new Framework.ExportManager("", "", "");
                wb.AddWorksheet(Framework.LocalizationManager.Get(this.designType), this.TableItems.GetAsArray());
                let array = this.selectedDesign.GetAsArray();
                wb.AddWorksheet(Framework.LocalizationManager.Get("Codes"), array.CodeArray);
                wb.AddWorksheet(Framework.LocalizationManager.Get("Labels"), array.LabelArray);
                wb.Save(Framework.LocalizationManager.Get(this.selectedDesign.Name), "xlsx");
            }

            private setCurrentDesign(design: Models.ExperimentalDesign) {

                // MAJ nom dans les onglets
                let tabs = this.tabs.filter((x) => {
                    let d = <Models.ExperimentalDesign>x.CustomAttributes.Get("Design");
                    return d.Id == design.Id;
                });
                if (tabs.length > 0) {
                    tabs[0].SetInnerHTML(design.Name);
                }

                this.selectedDesign = design;
                this.setItemLabelTable();
                this.setExperimentalDesignTable();

            }

            private setItemLabelTable() {

                let self = this;

                let listItems = self.selectedDesign.ListItems;
                let codes: string[] = [];
                let reps: number[] = [];

                listItems.forEach((item) => {
                    if (self.selectedDesign.Type == "Product") {
                        item.Labels.forEach((kvp) => {
                            item["R" + kvp.Key] = kvp.Value;
                            reps.push(kvp.Key);
                        });
                    }
                    codes.push(item.Code);
                });

                reps = Framework.Array.Unique(reps);
                let columnsRep: string[] = [];

                this.TableItems = new Framework.Form.Table<Models.ExperimentalDesignItem>();
                this.TableItems.ListColumns = [];

                let col1 = new Framework.Form.TableColumn();
                col1.Name = "Code";
                if (self.selectedDesign.Type == "Product") {
                    col1.Title = Framework.LocalizationManager.Get("Product");
                }
                if (self.selectedDesign.Type == "Attribute") {
                    col1.Title = Framework.LocalizationManager.Get("Attribute");
                }
                let col1Validator = (code: string) => {
                    return Framework.Form.Validator.HasMinLength(code, 2) + Framework.Form.Validator.IsUnique(code, self.selectedDesign.ListItems.map(a => a.Code));
                }
                col1.Validator = Framework.Form.Validator.Custom(col1Validator);
                col1.RemoveSpecialCharacters = true;
                this.TableItems.ListColumns.push(col1);

                if (this.selectedDesign.Type == "Attribute") {
                    let col2 = new Framework.Form.TableColumn();
                    col2.Name = "LongName";
                    col2.Title = Framework.LocalizationManager.Get("DisplayedName");
                    this.TableItems.ListColumns.push(col2);
                }
                let col13 = new Framework.Form.TableColumn();
                col13.Name = "Description";
                col13.Title = Framework.LocalizationManager.Get("Description");
                this.TableItems.ListColumns.push(col13);


                if (this.selectedDesign.Type == "Product") {
                    reps.forEach((x) => {
                        let col = new Framework.Form.TableColumn();
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

                    let col = new Framework.Form.TableColumn();
                    //col.Name = "Image";
                    col.Name = "ImageURL";
                    col.Title = Framework.LocalizationManager.Get("Image URL");
                    //col.Type = "image";
                    col.Filterable = false;
                    col.Sortable = false;
                    //col.Width = "90px";
                    col.MinWidth = 90;
                    this.TableItems.ListColumns.push(col);
                }

                let col14 = new Framework.Form.TableColumn();
                col14.Name = "Notes";
                col14.Title = Framework.LocalizationManager.Get("Notes");
                this.TableItems.ListColumns.push(col14);

                //this.TableItems.Height = ($('#divExperimentalDesignActions').offset().top - $('#samplesTab').offset().top - 120) + "px";
                this.TableItems.Height = "25vh";

                this.TableItems.ListData = listItems;

                this.TableItems.OnSelectionChanged = () => {
                    self.btnEditDesign.CheckState();
                    self.btnDeleteItems.CheckState();
                };

                this.TableItems.OnDataUpdated = (item: Models.ExperimentalDesignItem, propertyName: string, oldValue: any, newValue: any) => {
                    let oldCode = item["Code"];
                    if (propertyName == "Code") {
                        oldCode = oldValue;
                    }

                    self.UpdateItem(self.selectedDesign, oldCode, propertyName, oldValue, newValue);
                };

                this.TableItems.Render(this.divItemsTable.HtmlElement);

            }

            private setExperimentalDesignTable() {
                let self = this;

                this.TableExperimentalDesign = new Framework.Form.Table<Models.ExperimentalDesignRow>();
                this.TableExperimentalDesign.ListColumns = [];

                let nbRanks = Framework.Array.Unique(self.selectedDesign.ListExperimentalDesignRows.map((x) => { return x.Rank })).length;

                let col1 = new Framework.Form.TableColumn();
                col1.Name = "SubjectCode";
                col1.Title = Framework.LocalizationManager.Get("Subject");
                col1.Editable = false;
                //col1.Width = "120px";
                col1.MinWidth = 120;
                this.TableExperimentalDesign.ListColumns.push(col1);

                for (let i = 1; i <= nbRanks; i++) {

                    let col = new Framework.Form.TableColumn();
                    col.Name = "Rank" + i;
                    col.Title = Framework.LocalizationManager.Format("RankNumber", [i.toString()]);
                    col.Editable = false;
                    col.Filterable = false;
                    //col.Width = "90px";
                    col.MinWidth = 90;
                    col.RenderFunction = (val) => {
                        let d: Models.ExperimentalDesignRow = JSON.parse(val);

                        let code: string = d.Code;
                        let label: string = d.Label;

                        if (self.selectedDesign.Type == "Product") {
                            code = d.Code + " " + d.Replicate;
                        }

                        return "<span style='font-size:10px' title='" + code + "'>" + code + "</span><br/><span style='font-size:10px' title='" + label + "'>" + label + "</span>";
                    }
                    this.TableExperimentalDesign.ListColumns.push(col);
                }


                //this.TableExperimentalDesign.Height = ($('#divExperimentalDesignActions').offset().top - $('#samplesTab').offset().top - 120) + "px";
                this.TableExperimentalDesign.Height = "25vh";

                this.TableExperimentalDesign.ListData = self.selectedDesign.GetExperimentalDesignTable();

                this.TableExperimentalDesign.OnSelectionChanged = (sel) => {
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
            }

            public OnLockChanged(isLocked: boolean) {
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
                    } else {
                        this.TableExperimentalDesign.Enable();
                        this.TableItems.Enable();
                    }
                }
            }

        }

        export class SubjectsViewModel extends PanelLeaderViewModel {

            //private dataTableSubject: Framework.Form.DataTable;

            private divPanelistsTable: Framework.Form.TextElement;

            private btnSetSubjectsPasswords: Framework.Form.Button;
            private btnDeleteSubjects: Framework.Form.Button;
            private btnImportSubjects: Framework.Form.Button;
            //private btnExportSubjects: Framework.Form.Button;
            private btnInsertSubjects: Framework.Form.Button;

            private btnShowProducts: Framework.Form.Button;
            private btnShowAttributes: Framework.Form.Button;
            //private btnDatabaseFields: Framework.Form.Button;

            public AddNewPanelists: (nb: number) => void;
            public RemovePanelists: (subjects: Models.Subject[], removeSubjectsData: boolean) => void;
            public SetPanelistsPasswords: (subjects: Models.Subject[]) => void;
            public ResetPanelistsPasswords: (subjects: Models.Subject[]) => void;
            public ShowModalImportPanelists: () => Framework.Modal.ConfirmModal;
            public ShowViewProducts: () => void;
            public ShowViewAttributes: () => void;
            //public EditCustomFields: () => void;
            //public ExportPanelistToLocalDB: (subjects: Models.Subject[]) => void;

            public OnSubjectUpdate: (subject: Models.Subject, propertyName: string, oldValue: any, newValue: any) => void;

            public ListDataContainsSubjectCode: (codes: string[]) => boolean;

            private selection: Models.Subject[];
            private subjects: Models.Subject[];
            private subjectPasswordGenerator: Framework.Random.Generator;

            //public AdditionalFields: PanelLeaderModels.DBField[];

            private modalConfirmInsertSubjects: Framework.Modal.Modal;

            public TableSubject: Framework.Form.Table<Models.Subject>;

            constructor(subjects: Models.Subject[], subjectPasswordGenerator: Framework.Random.Generator/*, additionalFields: PanelLeaderModels.DBField[]*/) {
                super();

                let self = this;

                this.subjects = subjects;
                this.subjectPasswordGenerator = subjectPasswordGenerator;
                //this.AdditionalFields = additionalFields;

                this.divPanelistsTable = Framework.Form.TextElement.Register("divPanelistsTable");

                this.setTable();

                this.btnShowProducts = Framework.Form.Button.Register("btnShowProducts", () => { return true; }, () => {
                    self.ShowViewProducts();
                });

                this.btnShowAttributes = Framework.Form.Button.Register("btnShowAttributes", () => { return true; }, () => {
                    self.ShowViewAttributes();
                });

                //this.btnDatabaseFields = Framework.Form.Button.Register("btnDatabaseFields", () => { return true; }, () => {
                //    self.EditCustomFields();
                //});

                this.btnDeleteSubjects = Framework.Form.Button.Register("btnDeleteSubjects", () => {
                    return self.isLocked == false && self.TableSubject.SelectedData.length > 0;
                }, () => {
                    let div = document.createElement("div");
                    let removeSubjectsData: boolean = false;

                    if (self.ListDataContainsSubjectCode(self.TableSubject.SelectedData.map((x) => { return x.Code; }))) {
                        let cb = Framework.Form.CheckBox.Create(() => { return true; }, () => {
                            removeSubjectsData = cb.IsChecked;
                        }, Framework.LocalizationManager.Get("RemoveSubjectData"), "", false, []);
                        div.appendChild(cb.HtmlElement);
                    }

                    let mw = Framework.Modal.Confirm(Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveTheSelection"), div, () => {
                        self.RemovePanelists(self.TableSubject.SelectedData, removeSubjectsData);
                    });

                });

                this.btnInsertSubjects = Framework.Form.Button.Register("btnInsertSubjects", () => {
                    return self.isLocked == false;
                }, () => {
                    let modal = self.modalConfirmInsertSubjects = Framework.Modal.Confirm(Framework.LocalizationManager.Get("AddNewPanelist"), "");
                    modal.AddNumericUpDown(0, 100, 1, 1, (val: number) => {
                        self.AddNewPanelists(val);
                    });
                });

                this.btnSetSubjectsPasswords = Framework.Form.Button.Register("btnSetSubjectsPasswords", () => {
                    return self.isLocked == false && self.TableSubject && self.TableSubject.SelectedData.length > 0;
                }, () => {
                    let div = document.createElement("div");
                    div.appendChild(Framework.Random.Generator.GetFormContent(subjectPasswordGenerator, 3).HtmlElement);
                    let resetPasswordsBtn = Framework.Form.Button.Create(() => { return true; }, () => {
                        self.ResetPanelistsPasswords(self.TableSubject.SelectedData);
                        mw.Close();
                    }, Framework.LocalizationManager.Get("ResetPasswords"), ["btnResetPasswords"]);
                    div.appendChild(resetPasswordsBtn.HtmlElement);

                    let mw = Framework.Modal.Confirm(Framework.LocalizationManager.Get("PasswordParameters"), div, () => {
                        self.SetPanelistsPasswords(self.TableSubject.SelectedData);
                    }, undefined, undefined, undefined, undefined, "400px");
                });

                this.btnImportSubjects = Framework.Form.Button.Register("btnImportSubjects", () => {
                    return self.isLocked == false;
                }, () => {
                    self.ShowModalImportPanelists();
                });

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

            private setTable() {

                let self = this;

                this.TableSubject = new Framework.Form.Table<Models.Subject>();
                this.TableSubject.ListColumns = [];

                let col1 = new Framework.Form.TableColumn();
                col1.Name = "Code";
                col1.Title = Framework.LocalizationManager.Get("Subject");
                let col1Validator = (code: string) => {
                    return Framework.Form.Validator.HasMinLength(code, 1) + Framework.Form.Validator.IsUnique(code, self.subjects.map(a => a.Code));
                }
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

                let col4 = new Framework.Form.TableColumn();
                col4.Name = "Mail";
                col4.Title = Framework.LocalizationManager.Get("Email");
                col4.Validator = Framework.Form.Validator.Mail();
                this.TableSubject.ListColumns.push(col4);

                let col5 = new Framework.Form.TableColumn();
                col5.Name = "Password";
                col5.Title = Framework.LocalizationManager.Get("Password");
                //col5.Width = "160px";
                col5.MinWidth = 160;
                this.TableSubject.ListColumns.push(col5);

                let col6 = new Framework.Form.TableColumn();
                col6.Name = "Notes";
                col6.Title = Framework.LocalizationManager.Get("Notes");
                //col5.Width = "160px";
                col6.MinWidth = 160;
                this.TableSubject.ListColumns.push(col6);

                let col7 = new Framework.Form.TableColumn();
                col7.Name = "URL";
                col7.Title = Framework.LocalizationManager.Get("URL");
                //col5.Width = "160px";
                col7.MinWidth = 160;
                this.TableSubject.ListColumns.push(col7);
                

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

                this.TableSubject.OnSelectionChanged = () => {
                    self.btnDeleteSubjects.CheckState();
                    self.btnSetSubjectsPasswords.CheckState();
                };

                this.TableSubject.OnDataUpdated = (subject: Models.Subject, propertyName: string, oldValue: any, newValue: any) => {
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


            }

            public Update() {
                this.TableSubject.Render(this.divPanelistsTable.HtmlElement);
            }

            public GetState(): { btnSetSubjectsPasswords: boolean, btnImportSubjects: boolean, /*btnExportSubjects: boolean,*/ btnInsertSubjects: boolean, btnShowProducts: boolean, btnShowAttributes: boolean } {
                return {
                    btnSetSubjectsPasswords: this.btnSetSubjectsPasswords.IsEnabled,
                    btnImportSubjects: this.btnImportSubjects.IsEnabled,
                    //btnExportSubjects: this.btnExportSubjects.IsEnabled,
                    btnInsertSubjects: this.btnInsertSubjects.IsEnabled,
                    btnShowProducts: this.btnShowProducts.IsEnabled,
                    btnShowAttributes: this.btnShowAttributes.IsEnabled
                }
            }

            public OnLockChanged(isLocked: boolean) {
                this.isLocked = isLocked;
                this.btnSetSubjectsPasswords.CheckState();
                this.btnImportSubjects.CheckState();
                //this.btnExportSubjects.CheckState();
                this.btnInsertSubjects.CheckState();
                if (this.isLocked == true) {
                    this.TableSubject.Disable();
                } else {
                    this.TableSubject.Enable();
                }

            }

        }

        export class ModalImportViewModel<T> extends PanelLeaderModalViewModel {

            private format: string = "";
            private divColumnsSelection: Framework.Form.TextElement;
            private divOverview: Framework.Form.TextElement;
            private btnShowDivOverview: Framework.Form.Button;
            private btnImport: Framework.Form.Button;
            private form;

            private onImport: (data: T[]) => void;
            private importFromDBFunction: () => void;

            constructor(mw: Framework.Modal.Modal, format: string, importTemplate: Framework.ImportManager.Template, onImport: (data: T[]) => void, importFromXMLFunction: (json: string, cb: (data: T[]) => void) => void = undefined, importFromDBFunction: () => void) {
                super(mw);

                let self = this;

                this.format = format;
                this.importFromDBFunction = importFromDBFunction;
                this.onImport = onImport;

                this.divColumnsSelection = Framework.Form.TextElement.Register("divColumnsSelection");
                this.divOverview = Framework.Form.TextElement.Register("divOverview");

                this.btnShowDivOverview = Framework.Form.Button.Create(() => {
                    return false;
                }, () => {
                    self.showDivOverview();
                }, '<i class="fas fa-arrow-right"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Overview"));
                this.mw.AddButton(this.btnShowDivOverview);


                this.btnImport = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    onImport(self.form.tabOfObject);
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Import"));
                this.mw.AddButton(this.btnImport);

                if (self.format == "XLS" || self.format == "XLSX" || self.format == "CSV" || self.format == "TXT") {
                    self.showDivColumnsSelection<T>(importTemplate);
                }
                if (self.format == "XML") {
                    self.importFromXml(importTemplate, importFromXMLFunction);
                }
                if (self.format == "DB") {
                    self.mw.Close();
                    self.importFromDBFunction();
                }

                //TODO
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { self.btnImport.Click(); });

            }

            private hideAll() {
                this.divColumnsSelection.Hide();
                this.divOverview.Hide();
                this.btnShowDivOverview.Hide();
                this.btnImport.Hide();
            }

            private showDivColumnsSelection<T>(importTemplate: Framework.ImportManager.Template) {

                let self = this;
                this.hideAll();

                this.divColumnsSelection.Show();
                this.btnShowDivOverview.Show();

                this.importFromCsvOrXls(importTemplate);
            }

            private importFromCsvOrXls(importTemplate: Framework.ImportManager.Template) {

                let self = this;

                Framework.ImportManager.Form.Import<T>("." + this.format, importTemplate, (res: Framework.ImportManager.Form<T>) => {

                    self.form = res;



                    let kvp: Framework.KeyValuePair[] = [];

                    kvp.push({ Value: "[Select]", Key: Framework.LocalizationManager.Get("Select") });

                    for (var propertyName in res.ImportedObject[0]) {
                        let p = propertyName;
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

                    let table = new Framework.Form.Table<Framework.ImportManager.ColumnTemplate>();
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

                    let col4 = new Framework.Form.TableColumn();
                    col4.Name = "Description";
                    col4.Editable = false;
                    col4.Title = Framework.LocalizationManager.Get("AttributeName");
                    col4.Filterable = false;
                    col4.Sortable = false;
                    table.ListColumns.push(col4);

                    let col2 = new Framework.Form.TableColumn();
                    col2.Name = "ColumnName";
                    col2.Title = Framework.LocalizationManager.Get("ColumnName");
                    col2.Type = "enum";
                    col2.EnumValues = kvp;
                    col2.Filterable = false;
                    col2.Sortable = false;
                    table.ListColumns.push(col2);

                    let col3 = new Framework.Form.TableColumn();
                    col3.Name = "IsImperative";
                    col3.Editable = false;
                    col3.Title = Framework.LocalizationManager.Get("IsImperative");
                    col3.Filterable = false;
                    col3.Sortable = false;
                    col3.RenderFunction = (x) => {
                        let res = "False";
                        if (x == true) {
                            res = "True";
                        }
                        return Framework.LocalizationManager.Get(res);
                    }
                    col3.MinWidth = 100;
                    table.ListColumns.push(col3);

                    table.Height = "800px";

                    table.ListData = importTemplate.ColumnTemplates;


                    table.OnDataUpdated = (item: Framework.ImportManager.ColumnTemplate, propertyName: string, oldValue: any, newValue: any) => {
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

            }

            private importFromXml(importTemplate: Framework.ImportManager.Template, importFromXMLFunction: (json: string, cb: (data: T[]) => void) => void) {

                let self = this;

                Framework.ImportManager.Form.ImportFromXML<T>(importTemplate, importFromXMLFunction, (res: Framework.ImportManager.Form<T>) => {

                    self.form = res;
                    self.showDivOverview();
                });

            }

            private showDivOverview() {
                this.hideAll();
                this.divOverview.Show();
                this.btnImport.Show();

                let dt: Framework.Form.DataTableParameters = this.form.getPreviewDataTableParameters();

                Framework.Form.DataTable.AppendToDiv("", "78vh", this.divOverview.HtmlElement, dt,
                    (table) => {
                    }
                );

            }

        }

        export class ModalProtocolDBFieldsViewModel extends PanelLeaderModalViewModel {

            private dataTableFieldsDB: Framework.Form.DataTable;

            public AddDBField: () => void;
            public RemoveDBFields: (fields: PanelLeaderModels.DBField[]) => void;
            private onFieldChange: (field: PanelLeaderModels.DBField) => void;

            constructor(mw: Framework.Modal.Modal, subjectDBFields: PanelLeaderModels.DBField[], onFieldChange: (field: PanelLeaderModels.DBField) => void) {
                super(mw);
                let self = this;
                this.onFieldChange = onFieldChange;
                this.SetDataTableFields(subjectDBFields);

                let btnOK = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    //TODO : addselection to session
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("AddSubjectsToiSessionThenClose"));
                this.mw.AddButton(btnOK);

                //TODO
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { btnOK.Click(); });
            }

            public SetDataTableFields(fields: PanelLeaderModels.DBField[]) {
                let self = this;
                Framework.Form.DataTable.AppendToDiv(Framework.LocalizationManager.Get("Fields"), "50vh", this.mw.Body, PanelLeaderModels.DBField.GetDataTableParameters(fields, self.onFieldChange), (dt: Framework.Form.DataTable) => {
                    self.dataTableFieldsDB = dt;
                }, (sel: any[]) => {
                }, () => {
                    self.AddDBField();
                }, () => {
                    self.RemoveDBFields(self.dataTableFieldsDB.SelectedData);
                });
            }


        }

        export class ModalSubjectsDBViewModel extends PanelLeaderModalViewModel {

            private dataTableSubjectDB: Framework.Form.DataTable;

            public ImportSubjects: (subjects: Models.Subject[]) => void;
            public DeleteSubjects: (subjects: Models.Subject[]) => void;

            private onSubjectChange: (subject: Models.Subject, propertyName: string, oldValue: string, newValue: string) => void;

            constructor(mw: Framework.Modal.Modal, fields: PanelLeaderModels.DBField[], subjects: Models.Subject[], onSubjectChange: (subject: Models.Subject, propertyName: string, oldValue: string, newValue: string) => void) {
                super(mw);
                let self = this;

                this.onSubjectChange = onSubjectChange;

                let btnCancel = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    self.mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                this.mw.AddButton(btnCancel);

                let btnOK = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    self.ImportSubjects(self.dataTableSubjectDB.SelectedData);
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Import"));
                this.mw.AddButton(btnOK);

                this.SetDataTable(subjects, fields);

                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { btnOK.Click(); });
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 27, () => { btnCancel.Click(); });
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible && self.dataTableSubjectDB.SelectedData.length > 0; }, 46, () => { self.DeleteSubjects(self.dataTableSubjectDB.SelectedData); });
            }

            public SetDataTable(subjects: Models.Subject[], fields: PanelLeaderModels.DBField[]) {
                let self = this;
                Framework.Form.DataTable.AppendToDiv(Framework.LocalizationManager.Get("Subjects"), "50vh", this.mw.Body, Models.Subject.GetDataTableParameters(subjects, fields, self.onSubjectChange), (dt: Framework.Form.DataTable) => {
                    self.dataTableSubjectDB = dt;
                }, (sel: any[]) => {
                }, undefined, () => {
                    self.DeleteSubjects(self.dataTableSubjectDB.SelectedData);
                });
            }

        }

        export class ModalExperimentalDesignItemDBViewModel extends PanelLeaderModalViewModel {

            private dataTableDB: Framework.Form.DataTable;

            public ImportItems: (items: Models.ExperimentalDesignItem[]) => void;
            public DeleteItems: (items: Models.ExperimentalDesignItem[]) => void;

            private onItemChange: (item: Models.ExperimentalDesignItem, propertyName: string, oldValue: string, newValue: string) => void;

            constructor(mw: Framework.Modal.Modal, fields: PanelLeaderModels.DBField[], items: Models.ExperimentalDesignItem[], onItemChange: (item: Models.ExperimentalDesignItem, propertyName: string, oldValue: string, newValue: string) => void) {
                super(mw);
                let self = this;

                this.onItemChange = onItemChange;

                let btnCancel = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    self.mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                this.mw.AddButton(btnCancel);

                let btnOK = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    self.ImportItems(self.dataTableDB.SelectedData);
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Import"));
                this.mw.AddButton(btnOK);

                this.SetDataTable(items, fields);

                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { btnOK.Click(); });
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 27, () => { btnCancel.Click(); });
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible && self.dataTableDB.SelectedData.length > 0; }, 46, () => { self.DeleteItems(self.dataTableDB.SelectedData); });
            }

            //TODO : remplacer
            public SetDataTable(items: Models.ExperimentalDesignItem[], fields: PanelLeaderModels.DBField[]) {
                let self = this;
                Framework.Form.DataTable.AppendToDiv(Framework.LocalizationManager.Get("Items"), "50vh", this.mw.Body, Models.ExperimentalDesignItem.GetDataTableParameters(items, fields, self.onItemChange), (dt: Framework.Form.DataTable) => {
                    self.dataTableDB = dt;
                }, (sel: any[]) => {
                }, undefined, () => {
                    self.DeleteItems(self.dataTableDB.SelectedData);
                });
            }

        }

        export class ModalSettingsViewModel extends PanelLeaderModalViewModel {

            private applicationSettings: Models.PanelLeaderApplicationSettings;
            private applicationSettingsCopy: Models.PanelLeaderApplicationSettings;
            private version: string;
            private btnSave: Framework.Form.Button;
            private selectLanguage: Framework.Form.Select;
            private inputMailAddress: Framework.Form.InputText;
            private inputDisplayName: Framework.Form.InputText;
            //private selectDatabaseSynchronization: Framework.Form.Select;
            private selectAutosave: Framework.Form.Select; // Au changement de page
            private spanVersion: Framework.Form.TextElement;

            private isOnline: boolean = true;

            public SaveLicense: (applicationSettings: Models.PanelLeaderApplicationSettings) => void;

            public get ApplicationSettings() { return this.applicationSettings }
            public get ApplicationSettingsCopy() { return this.applicationSettingsCopy }
            public get BtnSave() { return this.btnSave }
            public get SelectLanguage() { return this.selectLanguage }
            public get InputMailAddress() { return this.inputMailAddress }
            public get InputDisplayName() { return this.inputDisplayName }
            //public get SelectDatabaseSynchronization() { return this.selectDatabaseSynchronization }
            public get SelectAutosave() { return this.selectAutosave }
            public get SpanVersion() { return this.spanVersion }
            public get Version() {
                return this.version
            }

            constructor(mw: Framework.Modal.Modal, applicationSettings: Models.PanelLeaderApplicationSettings, version: string) {
                super(mw);
                let self = this;

                this.applicationSettings = applicationSettings;
                this.version = version;

                this.applicationSettingsCopy = Framework.Factory.Clone(applicationSettings);

                this.selectLanguage = Framework.Form.Select.Register("selectLanguage", applicationSettings.Language, Framework.LocalizationManager.AcceptedLanguages, Framework.Form.Validator.NotEmpty(), () => {
                    self.applicationSettingsCopy.Language = self.selectLanguage.Value;
                    self.btnSave.CheckState();
                });

                //this.selectDatabaseSynchronization = Framework.Form.Select.Register("selectDatabaseSynchronization", applicationSettings.DatabaseSynchronization.toString(), Framework.KeyValuePair.FromArray(["true", "false"]), Framework.Form.Validator.NotEmpty(), () => {
                //    self.applicationSettingsCopy.DatabaseSynchronization = self.selectDatabaseSynchronization.Value == "true";
                //    self.btnSave.CheckState();
                //});

                this.selectAutosave = Framework.Form.Select.Register("selectAutosave", applicationSettings.Autosave.toString(), Framework.KeyValuePair.FromArray(["true", "false"]), Framework.Form.Validator.NotEmpty(), () => {
                    self.applicationSettingsCopy.Autosave = self.selectAutosave.Value == "true";
                    self.btnSave.CheckState();
                });

                this.inputDisplayName = Framework.Form.InputText.Register("inputDisplayName", applicationSettings.DisplayName, Framework.Form.Validator.MinLength(3), () => {
                    self.applicationSettingsCopy.DisplayName = self.inputDisplayName.Value;
                    self.btnSave.CheckState();
                });

                this.inputMailAddress = Framework.Form.InputText.Register("inputMailAddress", applicationSettings.ReturnMailAddress, Framework.Form.Validator.Mail(), () => {
                    self.applicationSettingsCopy.ReturnMailAddress = self.inputMailAddress.Value;
                    self.btnSave.CheckState();
                });

                this.spanVersion = Framework.Form.TextElement.Register("spanVersion", version);

                let btnCancel = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    self.mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                this.mw.AddButton(btnCancel);

                this.btnSave = Framework.Form.Button.Create(() => {
                    return self.isOnline == true && self.selectLanguage.IsValid && /*self.selectDatabaseSynchronization.IsValid &&*/ self.selectAutosave.IsValid && self.inputDisplayName.IsValid && self.inputMailAddress.IsValid;
                }, () => {
                    self.SaveLicense(self.applicationSettingsCopy);
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Save"));
                this.mw.AddButton(this.btnSave);

                // Raccourcis clavier
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { self.btnSave.Click(); });
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 27, () => { btnCancel.Click(); });

            }

            public OnConnectivityChanged(isOnline: boolean) {
                this.isOnline = isOnline;
                this.btnSave.CheckState();
            }
        }

        export class ModalMailViewModel extends PanelLeaderModalViewModel {

            //TODO : recall
            //TODO : paramètres du mail : inclure code juge, password, code session

            private spanMailButtons: Framework.Form.TextElement;

            private inputMailReturnAddress: Framework.Form.InputText;
            private inputMailDisplayName: Framework.Form.InputText;
            private inputMailSubject: Framework.Form.InputText;
            private inputMailContent: Framework.Form.TextElement;

            private selectMailTemplate: Framework.Form.Select;

            private btnInsertMailFirstName: Framework.Form.Button;
            private btnInsertMailLastName: Framework.Form.Button;
            private btnInsertMailServerCode: Framework.Form.Button;
            private btnInsertMailSubjectCode: Framework.Form.Button;
            private btnInsertMailSubjectPassword: Framework.Form.Button;
            private btnInsertMailEncryptedURL: Framework.Form.Button;
            private btnInsertMailURLAsText: Framework.Form.Button;
            private btnInsertMailTSHomePage: Framework.Form.Button;
            private btnSendMail: Framework.Form.Button;

            //private divLoadMailTemplate: Framework.Form.TextElement;

            private inputSaveAsMailTemplate: Framework.Form.CheckBox;

            private templates: PanelLeaderModels.MailTemplate[] = [];

            private htmlEditorButtons: Framework.Form.ClickableElement[];

            private onClose: (monitoringProgresses) => void;

            private mail: PanelLeaderModels.Mail;

            private isOnline: boolean = true;

            private recipients: string[];

            public RemoveMailTemplate: (template: PanelLeaderModels.MailTemplate, callback: () => void) => void;
            public SaveMailTemplate: (template: PanelLeaderModels.MailTemplate, callback: () => void) => void;
            public SendMail: (recipients: string[], subject: string, body: string, displayName: string, returnAddress: string, saveAsTemplate: boolean, callback: (monitoringProgresses) => void, templates: PanelLeaderModels.MailTemplate[]) => void;

            public OnConnectivityChanged(isOnline: boolean) {
                this.isOnline = isOnline;
            }

            constructor(mw: Framework.Modal.Modal, templates: PanelLeaderModels.MailTemplate[], mail: PanelLeaderModels.Mail, recipients: string[], onClose: (monitoringProgresses) => void) {
                super(mw);

                this.mail = mail;
                this.recipients = recipients;
                this.onClose = onClose;
                this.templates = templates;

                let self = this;

                //TODO : default template

                this.selectMailTemplate = Framework.Form.Select.Register("selectMailTemplate", "", Framework.KeyValuePair.FromArray(self.templates.map((x) => { return x.Description; })), Framework.Form.Validator.NoValidation(), (x) => {
                    if (x && x.length > 0) {
                        let template = self.templates.filter((t) => { return t.Description == x })[0];
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

                this.inputMailReturnAddress = Framework.Form.InputText.Register("inputMailReturnAddress", self.mail.ReturnMailAddress, Framework.Form.Validator.Mail(), () => {
                    self.setButtonStates();
                    self.btnSendMail.CheckState();
                }, false);

                this.inputMailDisplayName = Framework.Form.InputText.Register("inputMailDisplayName", self.mail.DisplayedName, Framework.Form.Validator.MinLength(5), () => {
                    self.setButtonStates();
                    self.btnSendMail.CheckState();
                }, false);

                this.inputMailSubject = Framework.Form.InputText.Register("inputMailSubject", self.mail.Subject, Framework.Form.Validator.MinLength(5), () => {
                    self.setButtonStates();
                    self.btnSendMail.CheckState();
                }, false);

                this.inputSaveAsMailTemplate = Framework.Form.CheckBox.Register("inputSaveAsMailTemplate", () => { return true; }, () => { }, "");
                //TOFIX : unchecked par défaut

                this.inputMailContent = Framework.Form.TextElement.Register("inputMailContent");
                this.inputMailContent.SetHtml(self.mail.Body);
                this.inputMailContent.HtmlElement.onclick = () => {
                    self.setButtonStates();
                }

                this.spanMailButtons = Framework.Form.TextElement.Register("spanMailButtons");

                //let div = document.createElement("div");


                let insertTextButtons: Framework.Form.Button[] = [];

                this.btnInsertMailServerCode = Framework.Form.Button.Create(() => { return true; }, () => {
                    Framework.Selection.Replace("[SERVER_CODE]");
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("ServerCode"), ["mailOption"], "");
                insertTextButtons.push(this.btnInsertMailServerCode);

                this.btnInsertMailFirstName = Framework.Form.Button.Create(() => { return true; }, () => {
                    Framework.Selection.Replace("[SUBJECT_FIRST_NAME]")
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("SubjectFirstName"), ["mailOption"], "");
                insertTextButtons.push(this.btnInsertMailFirstName);

                this.btnInsertMailLastName = Framework.Form.Button.Create(() => { return true; }, () => {
                    Framework.Selection.Replace("[SUBJECT_LAST_NAME]")
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("SubjectLastName"), ["mailOption"], "");
                insertTextButtons.push(this.btnInsertMailLastName);

                this.btnInsertMailSubjectCode = Framework.Form.Button.Create(() => { return true; }, () => {
                    Framework.Selection.Replace("[SUBJECT_CODE]")
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("SubjectCode"), ["mailOption"], "");
                insertTextButtons.push(this.btnInsertMailSubjectCode);

                this.btnInsertMailSubjectPassword = Framework.Form.Button.Create(() => { return true; }, () => {
                    Framework.Selection.Replace("[SUBJECT_PASSWORD]")
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("SubjectPassword"), ["mailOption"], "");
                insertTextButtons.push(this.btnInsertMailSubjectPassword);

                //this.btnInsertMailURLAsText = Framework.Form.Button.Create(() => { return true; }, () => {
                //    Framework.Selection.Replace("[SESSION_URL]")
                //    self.btnSendMail.CheckState();
                //}, Framework.LocalizationManager.Get("URLAsText"), ["mailOption"], "");
                //div.appendChild(this.btnInsertMailURLAsText.HtmlElement);

                this.btnInsertMailEncryptedURL = Framework.Form.Button.Create(() => { return true; }, () => {
                    Framework.Selection.Replace("[SESSION_HYPERLINK]")
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("EncryptedURL"), ["mailOption"], "");
                insertTextButtons.push(this.btnInsertMailEncryptedURL);

                this.btnInsertMailTSHomePage = Framework.Form.Button.Create(() => { return true; }, () => {
                    Framework.Selection.Replace("[TIMESENS_HOMEPAGE_HYPERLINK]")
                    self.btnSendMail.CheckState();
                }, Framework.LocalizationManager.Get("URLTSHomePage"), ["mailOption"], "");
                insertTextButtons.push(this.btnInsertMailTSHomePage);

                this.htmlEditorButtons = Framework.InlineHTMLEditor.GetButtons(undefined, insertTextButtons);

                self.spanMailButtons.HtmlElement.innerHTML = "";
                this.htmlEditorButtons.forEach((x) => {
                    self.spanMailButtons.HtmlElement.appendChild(x.HtmlElement);
                });

                this.btnSendMail = Framework.Form.Button.Create(() => {
                    return self.isOnline == true && self.inputMailDisplayName.IsValid && self.inputMailReturnAddress.IsValid && self.inputMailSubject.IsValid;
                }, () => {
                    //TODO : tester contenu du message
                    self.SendMail(self.recipients, self.inputMailSubject.Value, self.inputMailContent.HtmlElement.innerHTML, self.inputMailDisplayName.Value, self.inputMailReturnAddress.Value, self.inputSaveAsMailTemplate.IsChecked, (monitoringProgresses) => {
                        self.onClose(monitoringProgresses);
                        self.mw.Close();
                    }, self.templates);

                }, '<i class="far fa-envelope"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Send"));
                this.mw.AddButton(this.btnSendMail);

                this.setButtonStates();

                //TODO
                //Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { self.btnSendMail.Click(); });

            }

            private deleteTemplate(template: PanelLeaderModels.MailTemplate) {
                let self = this;
                this.RemoveMailTemplate(template, () => {
                    self.templates.splice(self.templates.indexOf(template), 1);
                });
                //this.controller.LocalDB.RemoveMailTemplate(template).then(() => { self.templates.splice(self.templates.indexOf(template), 1); });
                //TODO : recréer liste de modèles
            }

            private loadTemplate(template: PanelLeaderModels.MailTemplate) {
                this.inputMailReturnAddress.Set(template.ReturnMailAddress);
                this.inputMailDisplayName.Set(template.DisplayedName);
                this.inputMailSubject.Set(template.Subject);
                this.inputMailContent.SetHtml(template.Body);
            }

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

            private saveAsTemplate(templateName: string, description: string, isDefault: boolean, callback: () => void) {
                let template: PanelLeaderModels.MailTemplate = new PanelLeaderModels.MailTemplate();
                template.Description = description;
                template.Label = templateName;
                template.DisplayedName = this.inputMailDisplayName.Value;
                template.Body = this.inputMailContent.HtmlElement.innerHTML;
                template.Subject = this.inputMailSubject.Value;
                template.ReturnMailAddress = this.inputMailReturnAddress.Value;
                template.IsDefault = isDefault;
                this.SaveMailTemplate(template, callback);
                //this.controller.LocalDB.SaveMailTemplate(template).then(() => { callback(); });
            }

            private setButtonStates() {
                let active: boolean = false;
                if (document.activeElement === this.inputMailContent.HtmlElement) {
                    active = true;
                }
                this.htmlEditorButtons.forEach((x) => {
                    if (active == true) {
                        x.Enable();
                    } else {
                        x.Disable();
                    }
                });
            }

        }

        export class ModalSaveSessionAsUndeployedCopyViewModel extends PanelLeaderModalViewModel {

            //TODO :outputs ?

            private cbDeleteUpload: Framework.Form.CheckBox;
            private cbDeleteData: Framework.Form.CheckBox;
            private cbDeleteSubjects: Framework.Form.CheckBox;
            private cbDeleteProducts: Framework.Form.CheckBox;
            private cbDeleteAttributes: Framework.Form.CheckBox;
            private cbDeleteMail: Framework.Form.CheckBox;
            private btnSaveAsUndeployedCopy: Framework.Form.Button;

            public SaveSessionAsUndeployedCopy: (deleteUpload: boolean, deleteData: boolean, deleteSubjects: boolean, deleteProducts: boolean, deleteAttributes: boolean, deleteMail: boolean, callback: () => void) => void;

            constructor(mw: Framework.Modal.Modal) {
                super(mw);
                let self = this;

                this.cbDeleteData = Framework.Form.CheckBox.Register("cbDeleteData", () => { return true; }, () => { }, "");
                this.cbDeleteData.Check();
                this.cbDeleteUpload = Framework.Form.CheckBox.Register("cbDeleteUpload", () => { return true; }, () => { }, "");
                this.cbDeleteUpload.Check();
                this.cbDeleteSubjects = Framework.Form.CheckBox.Register("cbDeleteSubjects", () => { return true; }, () => { }, "");
                this.cbDeleteProducts = Framework.Form.CheckBox.Register("cbDeleteProducts", () => { return true; }, () => { }, "");
                this.cbDeleteAttributes = Framework.Form.CheckBox.Register("cbDeleteAttributes", () => { return true; }, () => { }, "");
                this.cbDeleteMail = Framework.Form.CheckBox.Register("cbDeleteMail", () => { return true; }, () => { }, "");

                let btnCancel = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    self.mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                this.mw.AddButton(btnCancel);

                this.btnSaveAsUndeployedCopy = Framework.Form.Button.Create(() => { return true; }, () => {
                    self.SaveSessionAsUndeployedCopy(self.cbDeleteUpload.IsChecked, self.cbDeleteData.IsChecked, self.cbDeleteSubjects.IsChecked, self.cbDeleteProducts.IsChecked, self.cbDeleteAttributes.IsChecked, self.cbDeleteMail.IsChecked, () => { self.mw.Close(); });
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Save"));
                this.mw.AddButton(this.btnSaveAsUndeployedCopy);

                //TODO
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { self.btnSaveAsUndeployedCopy.Click(); });
            }

        }

        export class ModalSessionsDBViewModel extends PanelLeaderModalViewModel {

            //TODO : afficher espace occupé et disponible
            private breadcrumbLocalDBDiv: Framework.Form.TextElement;
            private localDBDirectoriesDiv: Framework.Form.TextElement;
            private localDBSessionsDiv: Framework.Form.TextElement;
            private localDBSaveSessionDiv: Framework.Form.TextElement;
            private localDBDiv: Framework.Form.TextElement;
            private inputSessionFileName: Framework.Form.InputText
            private inputSessionFileDescription: Framework.Form.InputText
            private btnSaveSessionInCurrentDirectory: Framework.Form.Button;
            private currentDirectory: PanelLeaderModels.ServerDirectory = undefined;

            private callbackOnClose: () => void = undefined;
            private callbackOnSelectSession: (id: string) => void = undefined;

            private localDirectories: PanelLeaderModels.ServerDirectory[];
            private linksToLocalSessions: PanelLeaderModels.ServerSessionShortcut[];

            public SaveAs: (linkToLocalSession: PanelLeaderModels.ServerSessionShortcut, filename: string, description: string, localDirectoryId: string, callback: () => void) => void;
            public CreateDirectory: (parentDirectory: PanelLeaderModels.ServerDirectory, callback: () => void) => void;
            public DeleteDirectory: (directory: PanelLeaderModels.ServerDirectory, callback: () => void) => void;
            public RenameDirectory: (directory: PanelLeaderModels.ServerDirectory, newName: string, callback: (newName: string) => void) => void; //TOCHECK
            public DeleteSession: (link: PanelLeaderModels.ServerSessionShortcut, callback: () => void) => void;
            public RenameSession: (link: PanelLeaderModels.ServerSessionShortcut, newName: string, callback: (newName: string) => void) => void;

            constructor(mw: Framework.Modal.Modal, localDirectories: PanelLeaderModels.ServerDirectory[], linksToLocalSessions: PanelLeaderModels.ServerSessionShortcut[], callbackOnSelectSession: (id: string) => void, callbackOnClose: () => void) {
                super(mw);

                let self = this;

                this.localDirectories = localDirectories;
                this.linksToLocalSessions = linksToLocalSessions;
                this.callbackOnSelectSession = callbackOnSelectSession;

                this.breadcrumbLocalDBDiv = Framework.Form.TextElement.Register("breadcrumbLocalDBDiv");
                this.localDBDirectoriesDiv = Framework.Form.TextElement.Register("localDBDirectoriesDiv");
                this.localDBSessionsDiv = Framework.Form.TextElement.Register("localDBSessionsDiv");
                this.localDBSaveSessionDiv = Framework.Form.TextElement.Register("localDBSaveSessionDiv");
                this.localDBSaveSessionDiv.Hide();
                this.localDBDiv = Framework.Form.TextElement.Register("localDBDiv");


                let getFilenames = () => {
                    let localDirectoryId = "0";
                    if (self.currentDirectory) {
                        localDirectoryId = self.currentDirectory.ID;
                    }
                    return linksToLocalSessions.filter(x => { return x.LocalDirectoryId == localDirectoryId }).map(x => { return x.Name });
                }

                this.inputSessionFileName = Framework.Form.InputText.Register("inputSessionFileName", "", Framework.Form.Validator.Unique2(getFilenames, 4, "FileAlreadyExists"), () => {
                    self.btnSaveSessionInCurrentDirectory.CheckState();
                }, true);

                this.inputSessionFileDescription = Framework.Form.InputText.Register("inputSessionFileDescription", "", Framework.Form.Validator.NoValidation(), () => {
                    self.btnSaveSessionInCurrentDirectory.CheckState();
                });

                self.openDirectory(new PanelLeaderModels.ServerDirectory());

                if (callbackOnClose) {
                    this.callbackOnClose = callbackOnClose;

                    this.localDBDiv.HtmlElement.style.height = "50vh";
                    this.localDBDiv.HtmlElement.style.maxHeight = "50vh";
                    this.localDBDiv.HtmlElement.style.overflowY = "scroll";
                    this.localDBSaveSessionDiv.Show();

                    this.btnSaveSessionInCurrentDirectory = Framework.Form.Button.Create(() => {
                        return self.inputSessionFileDescription && self.inputSessionFileDescription.IsValid && self.inputSessionFileName && self.inputSessionFileName.IsValid;
                    }, () => {
                        let localDirectoryId = "0";
                        if (self.currentDirectory) {
                            localDirectoryId = self.currentDirectory.ID;
                        }
                        let newSession = new PanelLeaderModels.ServerSessionShortcut();
                        newSession.LocalDirectoryId = localDirectoryId;
                        self.SaveAs(newSession, self.inputSessionFileName.Value, self.inputSessionFileDescription.Value, localDirectoryId, () => {
                            self.mw.Close();
                            if (self.callbackOnClose) {
                                self.callbackOnClose();
                            }
                        });

                    }, '<i class="fas fa-save"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Save"));
                    this.mw.AddButton(this.btnSaveSessionInCurrentDirectory);

                    //TODO
                    Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { self.btnSaveSessionInCurrentDirectory.Click(); });
                }
            }

            public SetInputFileNameError() {
                this.inputSessionFileName.Invalidate("Erroe");
            }

            private goBack() {
                // Remonte d'un niveau
                this.openDirectory(this.currentDirectory.GetParentDirectory(this.localDirectories));
            }

            private setBreadcrumb() {

                let self = this;

                // RAZ
                this.breadcrumbLocalDBDiv.HtmlElement.innerHTML = "";

                let span = document.createElement("span");
                span.innerHTML = Framework.LocalizationManager.Get("CurrentDirectory");
                this.breadcrumbLocalDBDiv.HtmlElement.appendChild(span);

                // Home
                let homeButton = Framework.Form.Button.Create(() => { return true; }, () => {
                    self.openDirectory(undefined);
                }, Framework.LocalizationManager.Get("RootDirectory"), ["localDBBreadcrumb"], Framework.LocalizationManager.Get("RootDirectory"));
                this.breadcrumbLocalDBDiv.Append(homeButton);

                let parents = this.currentDirectory.GetParentDirectories(this.localDirectories);
                parents.forEach((x) => {
                    let button = Framework.Form.Button.Create(() => { return true; }, () => {
                        self.openDirectory(x);
                    }, x.Name, ["localDBBreadcrumb"], x.Name);
                    let separator = Framework.Form.TextElement.Create(" > ", ["localDBBreadcrumb"]);
                    self.breadcrumbLocalDBDiv.Append(separator);
                    self.breadcrumbLocalDBDiv.Append(button);
                });

            }

            private openDirectory(localDirectory: PanelLeaderModels.ServerDirectory) {
                this.currentDirectory = Framework.Factory.CreateFrom(PanelLeaderModels.ServerDirectory, localDirectory);
                this.setBreadcrumb();
                this.setDirectories();
                this.setSessions();
            }

            private setDirectories() {

                this.localDBDirectoriesDiv.HtmlElement.innerHTML = "";

                let self = this;

                // Bouton retour rep précédent
                if (this.currentDirectory != undefined) {
                    let div0 = Framework.Form.TextElement.Create("", ["localDBDirectory"]);
                    self.localDBDirectoriesDiv.Append(div0);
                    let button0 = Framework.Form.Button.Create(() => { return true; }, () => {
                        self.goBack();
                    }, "", ["localDBBackDirectoryButton"], Framework.LocalizationManager.Get("GoBack"));
                    div0.Append(button0);
                }

                // Bouton nouveau répertoire
                let div = Framework.Form.TextElement.Create("", ["localDBDirectory"]);
                self.localDBDirectoriesDiv.Append(div);
                let button = Framework.Form.Button.Create(() => { return true; }, () => {
                    self.CreateDirectory(self.currentDirectory, () => {
                        self.setDirectories();
                    });
                }, "", ["localDBNewDirectoryButton"], Framework.LocalizationManager.Get("CreateNewDirectory"));
                div.Append(button);

                //let children = this.controller.GetChildrenDirectories(this.currentDirectory);
                let children = this.currentDirectory.GetChildrenDirectories(this.localDirectories);
                children.forEach((x) => {

                    let div = Framework.Form.TextElement.Create("", ["localDBDirectory"]);
                    self.localDBDirectoriesDiv.Append(div);

                    //TODO : ajouter nombre de sessions dans le répertoire entre parenthèses
                    let btnOpenDir = Framework.Form.Button.Create(() => { return true; }, () => {
                        self.openDirectory(x);
                    }, "", ["localDBDirectoryButton"], x.Name);
                    div.Append(btnOpenDir);

                    let label = Framework.Form.TextElement.Create("", ["localDBLabel"]);
                    label.HtmlElement.title = x.Name;
                    div.Append(label);

                    let span = Framework.Form.TextElement.Create(x.Name);
                    label.Append(span);

                    let btnDelete = Framework.Form.Button.Create(() => { return true; }, () => {
                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveThisElement"), () => {
                            self.DeleteDirectory(x, () => {
                                let l = self.localDirectories;
                                self.setDirectories();
                                self.setSessions();
                            });
                        });
                    }, '<i class="fas fa-trash"></i>', ["btnCircle", "btn24"], Framework.LocalizationManager.Get("Delete"));
                    label.Append(btnDelete);
                    btnDelete.Hide();

                    let btnRename = Framework.Form.Button.Create(() => { return true; }, () => {

                        let input = document.createElement("input");
                        input.value = x.Name;
                        input.type = "text";
                        input.style.width = "100%";

                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("PleaseEnterNewName"), input, () => {
                            let name = input.value;
                            self.RenameDirectory(x, name, (newName: string) => {
                                span.SetHtml(newName);
                                label.HtmlElement.title = newName;
                            });

                        });
                    }, '<i class="fas fa-edit"></i>', ["btnCircle", "btn24"], Framework.LocalizationManager.Get("Rename"));
                    label.Append(btnRename);
                    btnRename.Hide();

                    //TODO : déplacer répertoire

                    label.HtmlElement.onmouseover = () => {
                        span.Hide();
                        btnDelete.Show()
                        btnRename.Show();
                    }

                    label.HtmlElement.onmouseout = () => {
                        span.Show();
                        btnDelete.Hide()
                        btnRename.Hide();
                    }
                });
            }

            private setSessions() {
                this.localDBSessionsDiv.HtmlElement.innerHTML = "";

                let self = this;

                let currentDirectoryId = "0";
                if (self.currentDirectory.ID) {
                    currentDirectoryId = self.currentDirectory.ID;
                }

                let children: PanelLeaderModels.ServerSessionShortcut[] = this.currentDirectory.GetSessions(this.linksToLocalSessions); //this.controller.LocalDB.GetDirectorySessions(currentDirectoryId);

                children.sort((x, y) => { return x.Name.localeCompare(y.Name); }).forEach((x) => {

                    let div = Framework.Form.TextElement.Create("", ["localDBDirectory"]);
                    div.HtmlElement.title = x.Name;
                    self.localDBSessionsDiv.Append(div);

                    let btnOpenSession = Framework.Form.Button.Create(() => { return true; }, () => {
                        self.callbackOnSelectSession(x.ID);
                        //self.controller.OpenSessionFromLocalDB(Number(x.Id));
                        self.mw.Close();
                    }, "", ["localDBSessionButton"], x.Name);
                    div.Append(btnOpenSession);

                    let pdiv = document.createElement("div");
                    pdiv.innerHTML = x.Name + "\n" + x.Description;

                    Framework.Popup.Create(btnOpenSession.HtmlElement, pdiv, "right");

                    let label = Framework.Form.TextElement.Create("", ["localDBLabel"]);
                    label.HtmlElement.title = x.Name;
                    div.Append(label);

                    let span = Framework.Form.TextElement.Create(x.Name);
                    label.Append(span);

                    let btnDelete = Framework.Form.Button.Create(() => { return true; }, () => {
                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveThisElement"), () => {
                            self.DeleteSession(x, () => {
                                self.setSessions();
                            });
                        });
                    }, '<i class="fas fa-trash"></i>', ["localDBLabelButton"], Framework.LocalizationManager.Get("Delete"));
                    label.Append(btnDelete);
                    btnDelete.Hide();

                    let btnRename = Framework.Form.Button.Create(() => { return true; }, () => {

                        let input = document.createElement("input");
                        input.value = x.Name;
                        input.type = "text";
                        input.style.width = "100%";

                        Framework.Modal.Confirm(Framework.LocalizationManager.Get("PleaseEnterNewName"), input, () => {
                            self.RenameSession(x, input.value, (name: string) => {
                                span.SetHtml(name);
                                label.HtmlElement.title = name;
                            });
                        });

                    }, '<i class="fas fa-edit"></i>', ["localDBLabelButton"], Framework.LocalizationManager.Get("Rename"));
                    label.Append(btnRename);
                    btnRename.Hide();

                    //TODO : déplacer fichier

                    label.HtmlElement.onmouseover = () => {
                        span.Hide();
                        btnDelete.Show()
                        btnRename.Show();
                    }

                    label.HtmlElement.onmouseout = () => {
                        span.Show();
                        btnDelete.Hide()
                        btnRename.Hide();
                    }
                });
            }

        }

        export class ModalSessionLogViewModel extends PanelLeaderModalViewModel {

            //private labelOwner: Framework.Form.TextElement;
            private labelSize: Framework.Form.TextElement;
            private labelDescription: Framework.Form.TextElement;
            private labelDataBasePath: Framework.Form.TextElement;
            private labelLastSave: Framework.Form.TextElement;
            //private labelLastSynchronisation: Framework.Form.TextElement;
            private labelActions: Framework.Form.TextElement;
            private btnPrint: Framework.Form.Button;

            public get LabelSize() { return this.labelSize }
            public get LabelDescription() { return this.labelDescription }
            public get LabelDataBasePath() { return this.labelDataBasePath }
            public get LabelLastSave() { return this.labelLastSave }
            //public get LabelLastSynchronisation() { return this.labelLastSynchronisation }
            public get LabelActions() { return this.labelActions }

            constructor(mw: Framework.Modal.Modal, sessionInfo: PanelLeaderModels.SessionInfo) {
                super(mw);
                let self = this;

                this.labelDescription = Framework.Form.TextElement.Register("labelDescription", sessionInfo.Description);
                this.labelDataBasePath = Framework.Form.TextElement.Register("labelDataBasePath", sessionInfo.DataBasePath);
                this.labelLastSave = Framework.Form.TextElement.Register("labelLastSave", sessionInfo.LastSave);
                //this.labelLastSynchronisation = Framework.Form.TextElement.Register("labelLastSynchronisation", sessionInfo.LastSynchronisation);
                this.labelActions = Framework.Form.TextElement.Register("labelActions", sessionInfo.Log);
                //this.labelOwner = Framework.Form.TextElement.Register("labelOwner", sessionInfo.Owner);
                this.labelSize = Framework.Form.TextElement.Register("labelSize", sessionInfo.Size);

                this.btnPrint = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    let text = Framework.LocalizationManager.Get("DataBasePath") + ": " + sessionInfo.DataBasePath + "\r\n";
                    text += Framework.LocalizationManager.Get("Description") + ": " + sessionInfo.Description + "\r\n";
                    text += Framework.LocalizationManager.Get("LastSave") + ": " + sessionInfo.LastSave + "\r\n";
                    //text += Framework.LocalizationManager.Get("SynchronizationStatus") + ": " + sessionInfo.LastSynchronisation + "\r\n";
                    text += Framework.LocalizationManager.Get("Log") + ":\r\n" + sessionInfo.Log;
                    let blob = new Blob([text], {
                        type: 'text/plain'
                    });
                    Framework.FileHelper.SaveAs(blob, "info.txt");
                }, '<i class="fas fa-save"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Save"));
                this.mw.AddButton(this.btnPrint);

                let btnClose = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    self.mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Close"));
                this.mw.AddButton(btnClose);

                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { btnClose.Click(); });
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 27, () => { btnClose.Click(); });
            }

        }

        export class ModalDesignSettingsViewModel extends PanelLeaderModalViewModel {

            constructor(mw: Framework.Modal.Modal, selectedDesign: Models.ExperimentalDesign, listDesignNames: string[], onChange: (design: Models.ExperimentalDesign) => void) {
                super(mw);
                let self = this;

                let design = Framework.Factory.Create(Models.ExperimentalDesign, JSON.stringify(selectedDesign));

                let res = design.GetProperties(listDesignNames);
                res.forEach((p) => {
                    p.SetPropertyKeyMaxWidth(530)
                });

                res.forEach((x) => {
                    self.mw.Body.appendChild(x.Editor.HtmlElement);
                });

                let btnCancel = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    self.mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                this.mw.AddButton(btnCancel);

                let btnSave = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    onChange(design);
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Save"));
                this.mw.AddButton(btnSave);

                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 27, () => { btnCancel.Click(); });
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { btnSave.Click(); });
            }
        }

        export class ModalTokenDownloadConfirmationViewModel extends PanelLeaderModalViewModel {

            //private pTokenConfirmationMessage: Framework.Form.TextElement;
            //private pTokenRequired: Framework.Form.TextElement;
            //private pTokenAvailable: Framework.Form.TextElement;
            private btnCancelTokenDownload: Framework.Form.ClickableElement;
            private btnValidateTokenDownload: Framework.Form.ClickableElement;

            private pDownloadDataConfirmation: Framework.Form.TextElement;
            private pDownloadVideosConfirmation: Framework.Form.TextElement;
            //private pAnalyzeVideos: Framework.Form.TextElement;

            private spanDownloadDataConfirmation: Framework.Form.TextElement;
            private spanDownloadVideosConfirmation: Framework.Form.TextElement;


            private cbDownloadData: Framework.Form.CheckBox;
            private cbDownloadVideos: Framework.Form.CheckBox;
            //private cbAnalyzeVideos: Framework.Form.CheckBox;

            private isOnline: boolean = true;

            public OnConnectivityChanged(isOnline: boolean) {
                this.isOnline = isOnline;
                this.btnValidateTokenDownload.CheckState();
            }

            constructor(mw: Framework.Modal.Modal, requiredTokens: number, availableTokens: number, subjectCount: number, dataCount: number, videos: string[], videosSize: number, onConfirm: (downloadData: boolean, downloadVideos: boolean, analyzeEmotions: boolean) => void, onCancel: Function) {
                super(mw);
                let self = this;

                let canValidate: boolean = true;
                let message: string = Framework.LocalizationManager.Get("PleaseConfirmDataDownload");

                //TOFIX
                //if (requiredTokens > availableTokens) {
                //    message = Framework.LocalizationManager.Get("NotEnoughTokens");
                //    canValidate = false;
                //    //TODO : lien vers site web pour acheter jetons
                //}

                //this.pTokenConfirmationMessage = Framework.Form.TextElement.Register("pTokenConfirmationMessage", message);
                //this.pTokenRequired = Framework.Form.TextElement.Register("pTokenRequired", Framework.LocalizationManager.Format("RequiredTokens", [requiredTokens.toString()]));
                //this.pTokenAvailable = Framework.Form.TextElement.Register("pTokenAvailable", Framework.LocalizationManager.Format("AvailableTokens", [availableTokens.toString()]));
                this.btnValidateTokenDownload = Framework.Form.Button.Create(() => { return self.isOnline == true /*&& canValidate*/; }, () => {
                    onConfirm(self.cbDownloadData.IsChecked, self.cbDownloadVideos.IsChecked, false/*self.cbAnalyzeVideos.IsChecked*/); self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Confirm"));
                this.mw.AddButton(this.btnValidateTokenDownload);

                this.btnCancelTokenDownload = Framework.Form.Button.Create(() => { return true; }, () => {
                    onCancel();
                    self.mw.Close()
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));
                this.mw.AddButton(this.btnCancelTokenDownload)


                this.pDownloadDataConfirmation = Framework.Form.TextElement.Register("pDownloadDataConfirmation");
                this.pDownloadVideosConfirmation = Framework.Form.TextElement.Register("pDownloadVideosConfirmation");
                //this.pAnalyzeVideos = Framework.Form.TextElement.Register("pAnalyzeVideos");

                this.spanDownloadDataConfirmation = Framework.Form.TextElement.Register("spanDownloadDataConfirmation", Framework.LocalizationManager.Format("DownloadDataConfirmation", [dataCount.toString(), subjectCount.toString()]));
                let mo = Math.round(videosSize * 100 / 1048576) / 100;
                this.spanDownloadVideosConfirmation = Framework.Form.TextElement.Register("spanDownloadVideosConfirmation", Framework.LocalizationManager.Format("DownloadVideosConfirmation", [videos.length.toString(), mo.toString()]));

                this.cbDownloadData = Framework.Form.CheckBox.Register("cbDownloadData", () => { return canValidate; }, () => { }, "");
                this.cbDownloadVideos = Framework.Form.CheckBox.Register("cbDownloadVideos", () => { return canValidate; }, () => { }, "");
                //this.cbAnalyzeVideos = Framework.Form.CheckBox.Register("cbAnalyzeVideos", () => { return canValidate; }, () => { }, "");

                if (dataCount > 0) {
                    this.pDownloadDataConfirmation.Show();
                    this.cbDownloadData.Check();
                } else {
                    this.pDownloadDataConfirmation.Hide();
                }
                if (videos.length > 0) {
                    this.pDownloadVideosConfirmation.Show();
                    //this.pAnalyzeVideos.Show();
                    this.cbDownloadVideos.Check();
                    //this.cbAnalyzeVideos.Check();
                } else {
                    this.pDownloadVideosConfirmation.Hide();
                    //this.pAnalyzeVideos.Hide();
                }

                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 27, () => { self.btnCancelTokenDownload.Click(); });
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { self.btnValidateTokenDownload.Click(); });

            }


        }

        export class UploadViewModel extends PanelLeaderViewModel {

            private upload: PanelLeaderModels.Upload;
            private isOnline: boolean = true;

            private btnUpload: Framework.Form.ClickableElement;
            private btnUpdate: Framework.Form.ClickableElement;
            private btnDelete: Framework.Form.ClickableElement;

            private inputUploadDescription: Framework.Form.InputText;
            private inputUploadInformation: Framework.Form.InputText;
            private inputUploadPassword: Framework.Form.InputText;
            private inputUploadExpiration: Framework.Form.InputText;
            private selectMinTimeBetweenConnections: Framework.Form.Select;
            private selectUploadPanelistCodeDisplayMode: Framework.Form.Select;
            private selectUploadPanelistCodeAnonymousMode: Framework.Form.Select;
            //private selectPanelistCheckBrowserMode: Framework.Form.Select;

            public OnSessionDeleted: () => void;
            public OnSessionUploaded: () => void;
            public UploadSessionOnServer: () => void;
            public DeleteSessionOnServer: (removeData: boolean) => void;
            public Notify: () => void;

            public HasAssociatedData: () => boolean;

            public OnConnectivityChanged(isOnline: boolean) {
                this.checkState();
            }

            public get CanUpload(): boolean {
                return this.isOnline == true && this.isLocked == false && this.upload.Date == undefined && new Date(this.upload.ExpirationDate.toString()) > new Date(Date.now());
            }

            public get CanUpdate(): boolean {
                return this.isOnline == true && this.isLocked == false && this.upload.Date != undefined && new Date(this.upload.ExpirationDate.toString()) > new Date(Date.now());
            }

            public get CanDelete(): boolean {
                return this.isOnline == true && this.isLocked == false && this.upload.Date != undefined;
            }



            constructor(upload: PanelLeaderModels.Upload) {
                super();

                let self = this;

                this.upload = upload;

                this.upload.ExpirationDate = new Date(this.upload.ExpirationDate.toString());

                this.btnUpload = Framework.Form.ClickableElement.Register("btnUploadBlock", () => {
                    return self.CanUpload;
                }, () => {
                    self.UploadSessionOnServer();
                });

                this.btnUpdate = Framework.Form.ClickableElement.Register("btnUpdateBlock", () => {
                    return self.CanUpdate;
                }, () => {
                    self.UploadSessionOnServer();
                });

                this.btnDelete = Framework.Form.ClickableElement.Register("btnDeleteBlock", () => {
                    return self.CanDelete;
                }, () => {
                    if (self.HasAssociatedData() == true) {
                        let modal = Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), "");
                        modal.AddCheckbox(Framework.LocalizationManager.Get("RemoveAssociatedData"), () => { self.DeleteSessionOnServer(true); }, () => { self.DeleteSessionOnServer(false); });
                    } else {
                        self.DeleteSessionOnServer(false);
                    }
                });

                let descriptionValidator = (description: string) => {
                    let res = "";
                    if (description.length == 0) {
                        res = Framework.LocalizationManager.Get("DescriptionRequired");
                    }
                    return res;
                }
                let validator1 = Framework.Form.Validator.Custom(descriptionValidator);

                this.inputUploadDescription = Framework.Form.InputText.Register("inputUploadDescription", this.upload.Description, validator1, (description: string) => {
                    self.upload.Description = description;
                    self.checkState();
                    self.remindToUpload();
                });

                this.inputUploadInformation = Framework.Form.InputText.Register("inputUploadInformation", this.getUploadInformation(), undefined, (information: string) => {
                    return self.setUploadInformation(information);
                });

                let dateValidator = (expirationDate) => {
                    let res = "";
                    if (expirationDate <= new Date(Date.now())) {
                        res = Framework.LocalizationManager.Get("WrongExpirationDate");
                    }
                    return res;
                }
                let validator2 = Framework.Form.Validator.Custom(dateValidator);

                this.inputUploadExpiration = Framework.Form.InputText.Register("inputUploadExpiration", this.upload.ExpirationDate.toLocaleDateString(), validator2, (date: Date) => {
                    return "";
                });

                this.inputUploadExpiration.HtmlElement.onclick = () => {
                    Framework.Form.ModalDatePicker.Render(this.inputUploadExpiration.HtmlElement, self.upload.ExpirationDate, (date: Date) => {
                        self.upload.ExpirationDate = date;
                        self.inputUploadExpiration.Set(this.upload.ExpirationDate.toLocaleDateString());
                        self.checkState();
                        self.remindToUpload();
                    });
                };

                this.inputUploadPassword = Framework.Form.InputText.Register("inputUploadPassword", this.upload.Password, Framework.Form.Validator.NoValidation(), (password: string) => {
                    self.upload.Password = password;
                    return "";
                }, true);

                this.selectMinTimeBetweenConnections = Framework.Form.Select.Register("selectMinTimeBetweenConnections", this.upload.MinTimeBetweenConnexions, Framework.KeyValuePair.FromArray(Framework.Maths.Sequence(0, 48).map((x) => { return x.toString() })), Framework.Form.Validator.NoValidation(), (x) => {
                    self.upload.MinTimeBetweenConnexions = x;
                });

                this.selectUploadPanelistCodeDisplayMode = Framework.Form.Select.Register("selectUploadPanelistCodeDisplayMode", this.upload.ShowSubjectCodeOnClient, ScreenReader.PanelistCodeDisplayModeEnum, Framework.Form.Validator.NotEmpty(), (displayMode: string) => {
                    return self.setPanelistCodeDisplayMode(displayMode);
                });

                //this.selectPanelistCheckBrowserMode = Framework.Form.Select.Register("selectPanelistCheckBrowserMode", this.upload.CheckCompatibilityMode, Framework.KeyValuePair.FromArray(ScreenReader.CheckCompatibilityModeEnum), Framework.Form.Validator.NotEmpty(), (mode: string) => {
                //    return self.upload.CheckCompatibilityMode = mode;
                //});

                this.selectUploadPanelistCodeAnonymousMode = Framework.Form.Select.Register("selectUploadPanelistCodeAnonymousMode", this.upload.AnonymousMode, [{ Key: "NotAuthorized", Value: "NotAuthorized" }, { Key: "CreateJudgeAuto", Value: "CreateJudgeAuto" }, { Key: "UseExperimentalDesign", Value: "UseExperimentalDesign" }], Framework.Form.Validator.NotEmpty(), (anonymousMode: string) => {
                    return self.setPanelistAnonymousMode(anonymousMode);
                });

                this.checkState();

                Framework.ShortcutManager.Add(() => { return self.IsContainerVisible; }, 46, () => {
                    if (self.btnDelete.IsEnabled == true && document.activeElement.localName != "input") {
                        self.btnDelete.Click();
                    }
                });
                Framework.ShortcutManager.Add(() => { return self.IsContainerVisible; }, 13, () => {
                    if (self.btnUpload.IsEnabled == true) {
                        self.btnUpload.Click();
                    }
                    if (self.btnUpdate.IsEnabled == true) {
                        self.btnUpdate.Click();
                    }
                });
            }

            private setPanelistCodeDisplayMode(displayMode: string): string {
                this.upload.ShowSubjectCodeOnClient = displayMode;
                this.remindToUpload();
                return "";
            }

            private setPanelistAnonymousMode(anonymousMode: string): string {
                this.upload.AnonymousMode = anonymousMode;
                if (anonymousMode == "UseExperimentalDesign") {
                    this.setPanelistCodeDisplayMode("NotStarted");
                    this.selectUploadPanelistCodeDisplayMode.Set("NotStarted");
                }
                this.remindToUpload();
                return "";
            }

            private remindToUpload() {
                this.Notify();
            }

            private setUploadInformation(information: string): string {
                if (information == undefined || information.length == 0) {
                    return Framework.LocalizationManager.Get("NotUploaded");
                }
                return "";
            }

            private getUploadInformation(): string {
                let res: string = Framework.LocalizationManager.Get("NotUploaded");
                if (this.upload.Date != undefined) {
                    res = this.upload.ServerCode;
                }
                return res;
            }

            public Update(serverCode: string = "") {

                this.inputUploadInformation.Set(serverCode);

                // Etat des boutons
                this.checkState();
            }

            private checkState() {
                this.btnUpload.CheckState();
                this.btnUpdate.CheckState();
                this.btnDelete.CheckState();
            }

            public SetLock(isLocked: boolean) {
                this.isLocked = true;
                this.checkState();
            }

            public get InputUploadDescription() {
                return this.inputUploadDescription;
            }

        }

        export class ModalScreenStyleViewModel extends PanelLeaderModalViewModel {

            public ChangeScreenResolution: (resolution: string) => void;
            public SetListScreensProgressBar: (position: string, barType: string) => void;
            public SetListScreensBackground: (background: string) => void;
            public SetSessionStyle: (style: object) => void;

            constructor(mw: Framework.Modal.Modal, defaultScreenOptions: PanelLeaderModels.DefaultScreenOptions) {

                super(mw);
                let self = this;

                let formProperties = PanelLeaderModels.DefaultScreenOptions.GetForm(defaultScreenOptions, (changedValue: string, options: PanelLeaderModels.DefaultScreenOptions) => {
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

                formProperties.forEach((x) => {
                    x.SetPropertyKeyMaxWidth(320);
                    mw.Body.appendChild(x.Editor.HtmlElement);
                });

                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});
            }

        }

        export class ModalScreenFromXMLViewModel extends PanelLeaderModalViewModel {
            constructor(mw: Framework.Modal.Modal, screens: Models.Screen[], listDesigns: Models.ExperimentalDesign[], callback: (selectedScreens: Models.Screen[]) => void) {
                super(mw);

                let selectedScreens: Models.Screen[] = [];
                let div = document.createElement("div");
                div.style.width = "810px";
                for (var i = 0; i < screens.length; i++) {
                    let screen = Framework.Factory.CreateFrom(Models.Screen, screens[i]);
                    let miniature = screen.RenderAsMiniature(i, 200, listDesigns, (x) => {

                        let selected = selectedScreens.filter((x) => { return x.Id == screen.Id; }).length > 0;
                        if (selected == false) {
                            selectedScreens.push(screen);
                            miniature.Div.style.border = "1px solid orange";
                        } else {
                            Framework.Array.Remove(selectedScreens, screen);
                            miniature.Div.style.border = "";
                        }

                        btnOK.CheckState();

                    });
                    miniature.Div.style.cssFloat = "left";
                    div.appendChild(miniature.Div);
                }

                mw.Body.appendChild(div);

                let btnOK = Framework.Form.Button.Create(() => { return selectedScreens.length > 0; }, () => {
                    callback(selectedScreens);
                    mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("OK"));

                let btnCancel = Framework.Form.Button.Create(() => { return true; }, () => { mw.Close(); }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));

                mw.AddButton(btnCancel);
                mw.AddButton(btnOK);

            }
        }

        export class ModalScreenPropertiesViewModel extends PanelLeaderModalViewModel {

            private currentScreen: Models.Screen;
            private onChange: () => void;
            private listDesigns: Models.ExperimentalDesign[];
            private listSubjects: Models.Subject[];

            public SetBackground: (currentScreen: Models.Screen, background: string) => void;
            public SetExperimentalDesign: (currentScreen: Models.Screen, experimentalDesignId: number) => void;
            public SetTimer: (currentScreen: Models.Screen, timer: boolean) => void;
            public SetChronometer: (currentScreen: Models.Screen, chronometer: boolean) => void;
            public SetConditionalVisibility: (currentScreen: Models.Screen, conditional: boolean) => void;
            public SetSpeechRecognition: (currentScreen: Models.Screen, recognition: string) => void;

            public ToggleScreenCondition: (screen: Models.Screen, condition: string, value) => void;

            constructor(mw: Framework.Modal.Modal, currentScreen: Models.Screen, listDesigns: Models.ExperimentalDesign[], listSubjects: Models.Subject[], onChange: () => void) {
                super(mw);

                this.currentScreen = currentScreen;
                this.onChange = onChange;
                this.listDesigns = listDesigns;
                this.listSubjects = listSubjects;

                let self = this;

                let formSetBackground = Framework.Form.PropertyEditorWithColorPopup.Render("", "ScreenBackground", currentScreen.Background, (x) => {
                    self.SetBackground(currentScreen, x);
                });
                formSetBackground.SetPropertyKeyMaxWidth(300);
                mw.Body.appendChild(formSetBackground.Editor.HtmlElement);

                let setFormSetExperimentalDesignFormPropertyValue = () => {
                    let text = Framework.LocalizationManager.Get("None");
                    let designs = listDesigns.filter((x) => { return x.Id == currentScreen.ExperimentalDesignId });
                    if (designs.length > 0) {
                        text = designs[0].Name;
                    }
                    formSetExperimentalDesignFormProperty.SetLabelForPropertyValue(text);
                }

                let designs = listDesigns.map((x) => { return x.Name });
                designs.push(Framework.LocalizationManager.Get("NoDesign"));

                let formSetExperimentalDesignFormProperty = Framework.Form.PropertyEditorWithPopup.Render("", "ExperimentalDesign", "", designs, (x, btn) => {
                    let id = 0;
                    if (x == Framework.LocalizationManager.Get("NoDesign")) {
                        id = 0;
                    } else {
                        id = listDesigns.filter((y) => { return y.Name == x })[0].Id;
                    }
                    self.SetExperimentalDesign(currentScreen, id);
                    setFormSetExperimentalDesignFormPropertyValue();
                });
                setFormSetExperimentalDesignFormPropertyValue();
                mw.Body.appendChild(formSetExperimentalDesignFormProperty.Editor.HtmlElement);

                let hasTimer: boolean = Models.Screen.HasControlOfType(currentScreen, "CustomTimer") == true;
                let formSetScreenTimer = Framework.Form.PropertyEditorWithToggle.Render("", "TimedScreen", hasTimer, (x) => {
                    self.SetTimer(currentScreen, x);
                });
                mw.Body.appendChild(formSetScreenTimer.Editor.HtmlElement);

                let hasChronometer: boolean = Models.Screen.HasControlOfType(currentScreen, "CustomChronometer") == true;
                let formSetScreenChronometer = Framework.Form.PropertyEditorWithToggle.Render("", "Chronometer", hasChronometer, (x) => {
                    self.SetChronometer(currentScreen, x);
                });
                mw.Body.appendChild(formSetScreenChronometer.Editor.HtmlElement);

                //TODO : timer value, timer visibility


                let formSetScreenConditional = Framework.Form.PropertyEditorWithButton.Render("", "ConditionalVisibility", Framework.LocalizationManager.Get(currentScreen.IsConditionnal.toString()), () => {
                    let divConditions = this.getConditionalVisibilityForm(() => { mw.Close(); });
                    let mw = Framework.Modal.Confirm(Framework.LocalizationManager.Get("CheckConditionsToDisplayScreen"), divConditions.HtmlElement, () => {
                        if (self.currentScreen.ListConditions.AttributeConditions.length > 0 ||
                            self.currentScreen.ListConditions.ProductConditions.length > 0 ||
                            self.currentScreen.ListConditions.ProductRankConditions.length > 0 ||
                            self.currentScreen.ListConditions.ReplicateConditions.length > 0 ||
                            self.currentScreen.ListConditions.IntakeConditions.length > 0 ||
                            self.currentScreen.ListConditions.SubjectConditions.length > 0
                        ) {
                            self.SetConditionalVisibility(currentScreen, true);
                        } else {
                            self.SetConditionalVisibility(currentScreen, false);
                        }
                        formSetScreenConditional.SetLabelForPropertyValue(Framework.LocalizationManager.Get(currentScreen.IsConditionnal.toString()))
                    }, undefined, undefined, undefined, undefined, "500px");
                });
                mw.Body.appendChild(formSetScreenConditional.Editor.HtmlElement);

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

            private toggleCondition(condition: string, value) {
                this.ToggleScreenCondition(this.currentScreen, condition, value);
                this.onChange();
            }

            private getConditionalVisibilityForm(close: () => void): Framework.Form.TextElement {

                //TODO : par défaut, cocher tout, plus logique ?
                //TODO : style
                let self = this;

                let div = Framework.Form.TextElement.Create("");
                div.HtmlElement.style.padding = "10px";
                div.HtmlElement.style.margin = "10px";

                let btn = Framework.Form.Button.Create(() => { return true; }, () => {
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

                let designs = this.listDesigns.filter((x) => { return self.currentScreen.ExperimentalDesignId == x.Id });
                if (designs.length > 0) {
                    let currentDesign = designs[0];

                    if (currentDesign.NbReplicates > 1) {

                        let replicates = [];
                        for (var i = 1; i <= currentDesign.NbReplicates; i++) {
                            replicates.push(i);
                        }

                        let replicateDiv = Framework.Form.TextElement.Create("");
                        replicates.forEach((replicate) => {
                            let isChecked = self.currentScreen.ListConditions.ReplicateConditions.filter((x) => { return x == replicate }).length > 0;

                            let cbf = Framework.Form.PropertyEditorWithToggle.Render("", replicate.toString(), isChecked, (val) => {
                                self.toggleCondition("Replicate", replicate);
                            });
                            replicateDiv.Append(cbf.Editor);

                        });

                        let accordionReplicate = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("Replicate"));
                        accordionReplicate.HtmlElement.style.marginTop = "15px";
                        accordionReplicate.HtmlElement.style.fontWeight = "bold";
                        div.Append(accordionReplicate);
                        div.Append(replicateDiv);
                    }

                    if (currentDesign.NbIntakes > 1) {

                        let intakes = [];
                        for (var i = 1; i <= currentDesign.NbIntakes; i++) {
                            intakes.push(i);
                        }

                        let intakeDiv = Framework.Form.TextElement.Create("");
                        intakes.forEach((intake) => {
                            let isChecked = self.currentScreen.ListConditions.IntakeConditions.filter((x) => { return x == intake }).length > 0;

                            let cbf = Framework.Form.PropertyEditorWithToggle.Render("", intake.toString(), isChecked, (val) => {
                                self.toggleCondition("Intake", intake);
                            });
                            intakeDiv.Append(cbf.Editor);

                        });

                        let accordionIntake = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("Intake"));
                        accordionIntake.HtmlElement.style.marginTop = "15px";
                        accordionIntake.HtmlElement.style.fontWeight = "bold";
                        div.Append(accordionIntake);
                        div.Append(intakeDiv);
                    }

                    let items = Framework.Array.SortBy(Models.ExperimentalDesign.GetItems(currentDesign), "Code");

                    if (items.length > 1) {
                        if (currentDesign.Type == "Product") {
                            let productDiv = Framework.Form.TextElement.Create("");
                            items.forEach((x) => {
                                let isChecked = self.currentScreen.ListConditions.ProductConditions.filter((y) => { return y == x["Code"] }).length > 0;

                                let cbf = Framework.Form.PropertyEditorWithToggle.Render("", x["Code"], isChecked, (val) => {
                                    self.toggleCondition("Product", x["Code"]);
                                });
                                productDiv.Append(cbf.Editor);
                            });

                            let accordionProduct = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("ProductCode"));
                            accordionProduct.HtmlElement.style.marginTop = "15px";
                            accordionProduct.HtmlElement.style.fontWeight = "bold";
                            div.Append(accordionProduct);
                            div.Append(productDiv);

                            let rankDiv = Framework.Form.TextElement.Create("");
                            let ranks = Framework.Array.Unique(currentDesign.ListExperimentalDesignRows.map(function (x) { return x.Rank; })).sort();

                            ranks.forEach((x) => {
                                let isChecked = self.currentScreen.ListConditions.ProductRankConditions.filter((y) => { return y == x }).length > 0;
                                let cbf = Framework.Form.PropertyEditorWithToggle.Render("", x.toString(), isChecked, (val) => {
                                    self.toggleCondition("ProductRank", Number(x));
                                });
                                rankDiv.Append(cbf.Editor);

                            });

                            let accordionRank = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("ProductRank"));
                            accordionRank.HtmlElement.style.marginTop = "15px";
                            accordionRank.HtmlElement.style.fontWeight = "bold";
                            div.Append(accordionRank);
                            div.Append(rankDiv);

                        }

                        if (currentDesign.Type == "Attribute") {
                            let attributeDiv = Framework.Form.TextElement.Create("");
                            items.forEach((x) => {
                                let isChecked = self.currentScreen.ListConditions.AttributeConditions.filter((y) => { return y == x["Code"] }).length > 0;
                                let cbf = Framework.Form.PropertyEditorWithToggle.Render("", x["Code"], isChecked, (val) => {
                                    self.toggleCondition("Product", x["Code"]);
                                });
                                attributeDiv.Append(cbf.Editor);

                            });

                            let accordionAttribute = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("AttributeCode"));
                            accordionAttribute.HtmlElement.style.marginTop = "15px";
                            accordionAttribute.HtmlElement.style.fontWeight = "bold";
                            div.Append(accordionAttribute);
                            div.Append(attributeDiv);
                        }

                    }

                }

                let subjectDiv = Framework.Form.TextElement.Create("");

                this.listSubjects.sort().forEach((x) => {
                    let isChecked = false;
                    if (self.currentScreen.ListConditions && self.currentScreen.ListConditions.SubjectConditions) {
                        isChecked = self.currentScreen.ListConditions.SubjectConditions.filter((y) => { return y == x.Code }).length > 0;
                    }
                    let cbf = Framework.Form.PropertyEditorWithToggle.Render("", x.Code, isChecked, (val) => {
                        self.toggleCondition("Subject", x.Code);
                    });
                    subjectDiv.Append(cbf.Editor);

                });

                let accordionSubject = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("SubjectCode"));
                accordionSubject.HtmlElement.style.marginTop = "15px";
                accordionSubject.HtmlElement.style.fontWeight = "bold";
                div.Append(accordionSubject);
                div.Append(subjectDiv);

                return div;
            }

        }

        export class ScenarioViewModel extends PanelLeaderViewModel {

            private listScreensWidth: number = 220; // Largeur de la partie gauche de l'écran

            private containerHeight: number = window.innerHeight - 90;

            private scenarioViewContainer: HTMLElement; // Container principal de la vue
            private listScreensContainer: HTMLElement; // Container de la liste des écrans
            private activeScreenContainer: HTMLDivElement; // Container de l'écran actif
            private activeScreenWrapper: HTMLDivElement; // Wrapper du container de l'écran actif

            private subjectSession: Models.SubjectSeance;


            private btnSimulateSession: Framework.Form.Button;
            private btnSelectNextControl: Framework.Form.Button;
            private btnInsertScreen: Framework.Form.Button;
            private btnSetScreenStyle: Framework.Form.Button;
            private btnZoomIn: Framework.Form.Button;
            private btnZoomOut: Framework.Form.Button;
            private btnToggleGridVisibility: Framework.Form.Button;
            private btnPasteControl: Framework.Form.Button;
            private btnCopyControl: Framework.Form.Button;
            private btnEditControl: Framework.Form.Button;
            private btnCutControl: Framework.Form.Button;
            private btnDeleteControl: Framework.Form.Button;
            private btnMoveUpScreen: Framework.Form.Button;
            private btnMoveDownScreen: Framework.Form.Button;
            private btnDeleteScreen: Framework.Form.Button;
            private btnCopyScreen: Framework.Form.Button;
            private btnPasteScreen: Framework.Form.Button;
            //private btnSaveScreenAsPicture: Framework.Form.Button;
            private btnEditScreenProperties: Framework.Form.Button;
            private btnAddControl: Framework.Form.Button;
            private btnPositionControl: Framework.Form.Button;

            private designGridVisibility: boolean = false;
            private designGridStickiness: boolean = false;
            private designGridIncrement: number = 60;

            private scaleFactor: number = 1;

            private screenDiv: HTMLDivElement;
            public CurrentScreen: Models.Screen;
            private copiedScreen: Models.Screen;

            private copiedControl: ScreenReader.Controls.BaseControl;

            private miniaturesScreens: Models.ScreenMiniature[];

            private selectedControl: ScreenReader.Controls.BaseControl;
            private selectedControlIndex: number = 0;

            private miniaturesDiv: HTMLDivElement;

            private controlIds: string[] = [];

            private get selectedScreenIndex(): number {
                let self = this;

                if (this.miniaturesScreens == undefined) {
                    return -1;
                }

                let index = 0;

                for (let mini of this.miniaturesScreens) {
                    if (mini.Screen.Id != self.CurrentScreen.Id) {
                        index++;
                    } else {
                        break;
                    }
                }

                return index;
            }

            //private subject: Models.Subject;
            private listScreens: Models.Screen[];
            private listDesigns: Models.ExperimentalDesign[];

            private editor: Framework.Editor;

            //public OnControlChanged: () => void;
            public ShowModalScreenFromXML: (index: number, experimentalDesignId: number, callback: () => void) => void;
            public ShowModalScreenProperties: (screen: Models.Screen, index: number, callback: () => void) => void;
            public MoveScreen: (index: number, direction: string) => void;
            public ShowModalSimulation: (subjectSession: Models.SubjectSeance, currentScreenId: number) => void;
            public AddControlToScreen: (screen: Models.Screen, control: ScreenReader.Controls.BaseControl, onSelect: (control: ScreenReader.Controls.BaseControl) => void, style: boolean) => void;
            public RemoveControlFromScreen: (screen: Models.Screen, control: ScreenReader.Controls.BaseControl) => void;
            public OnControlPropertyChanged: (control: ScreenReader.Controls.BaseControl, propertyName: string, oldValue: any, newValue: any) => void;
            public InsertScreen: (screen: Models.Screen, index: number, experimentalDesignId: number) => Models.Screen;
            public DeleteScreen: (screen: Models.Screen, index: number) => void;
            public ShowModalScreensStyle: (callback: () => void) => void;
            public GetListSortingControlNames: () => string[];
            public GetListControlNames: () => string[];
            public GetListDataControlNames: () => string[];

            //constructor(subject: Models.Subject, listScreens: Models.Screen[], listDesigns: Models.ExperimentalDesign[]) {
            constructor(subjectSession: Models.SubjectSeance) {

                super();

                let self = this;
                let scenarioView = this;

                //this.subject = subject;
                //this.listScreens = listScreens;
                //this.listDesigns = listDesigns;

                this.scenarioViewContainer = $("#scenarioViewContainer")[0];
                this.listScreensContainer = $("#listScreensContainer")[0];
                this.activeScreenContainer = <HTMLDivElement>($("#activeScreenContainer")[0]);
                this.activeScreenWrapper = <HTMLDivElement>($("#activeScreenWrapper")[0]);

                this.scenarioViewContainer.style.height = this.containerHeight + "px";
                this.listScreensContainer.style.height = (this.containerHeight - 70) + "px";
                this.listScreensContainer.style.width = this.listScreensWidth + "px";
                this.listScreensContainer.style.overflowY = "scroll"; //TODO : css
                this.listScreensContainer.style.overflowX = "hidden"; //TODO : css
                this.activeScreenContainer.style.height = this.containerHeight - 70 + "px";
                this.activeScreenContainer.style.margin = 5 + "px";

                this.activeScreenWrapper.style.height = this.containerHeight - 70 + "px";
                this.activeScreenWrapper.style.textAlign = "center"; //TODO : css
                this.activeScreenContainer.style.display = "inline-block"; //TODO : css

                //this.subjectSession = new Models.SubjectSeance();
                //this.subjectSession.ListExperimentalDesigns = listDesigns;
                //this.subjectSession.ListScreens = listScreens;
                //this.subjectSession.Subject = subject;
                //this.subjectSession.Progress = new Models.Progress();
                //this.subjectSession.Progress.CurrentState = new Models.State();
                //this.subjectSession.Progress.CurrentState.CurrentScreen = 0;
                this.subjectSession = subjectSession;
                this.listScreens = subjectSession.ListScreens;
                this.listDesigns = subjectSession.ListExperimentalDesigns;

                this.btnEditScreenProperties = Framework.Form.Button.Register("btnEditScreenProperties", () => {
                    return (self.isLocked == false && self.CurrentScreen != undefined);//TODO : actualiser état du bouton
                }, () => {
                    self.ShowModalScreenProperties(self.CurrentScreen, self.selectedScreenIndex + 1, () => { self.saveCurrentScreen(); });
                });

                //this.btnSaveScreenAsPicture = Framework.Form.Button.Register("btnSaveScreenAsPicture", () => {
                //    return true;
                //}, (e) => {
                //    Framework.Screenshot.SaveAs(self.activeScreenContainer);
                //});

                this.btnCopyScreen = Framework.Form.Button.Register("btnCopyScreen", () => {
                    return self.isLocked == false;
                }, (e) => {
                    self.copiedScreen = Framework.Factory.Clone<Models.Screen>(self.CurrentScreen);
                    self.copiedScreen.Id = undefined;
                });

                this.btnMoveUpScreen = Framework.Form.Button.Register("btnMoveUpScreen", () => {
                    return (self.isLocked == false && self.selectedScreenIndex > 0);//TODO : actualiser état du bouton
                }, (e) => {
                    self.MoveScreen(self.selectedScreenIndex, "up");
                    //self.setMiniatures();
                    //self.highlightSelectedScreen(self.currentScreen.Id);
                    //self.btnMoveDownScreen.CheckState();
                    //self.btnMoveUpScreen.CheckState();
                });

                this.btnMoveDownScreen = Framework.Form.Button.Register("btnMoveDownScreen", () => {
                    return (self.isLocked == false && self.selectedScreenIndex != (self.subjectSession.ListScreens.length) - 1);//TODO : actualiser état du bouton
                }, (e) => {
                    self.MoveScreen(self.selectedScreenIndex, "down");
                    //self.setMiniatures();
                    //self.highlightSelectedScreen(self.currentScreen.Id);
                    //self.btnMoveDownScreen.CheckState();
                    //self.btnMoveUpScreen.CheckState();
                });

                this.btnDeleteScreen = Framework.Form.Button.Register("btnDeleteScreen", () => {
                    return (self.isLocked == false && self.subjectSession && self.subjectSession.ListScreens.length > 1);//TODO : actualiser état du bouton
                }, (e) => {
                    Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("DoYouConfirmScreenRemoval"), () => {
                        self.DeleteScreen(self.CurrentScreen, self.selectedScreenIndex);
                    });
                });

                this.btnInsertScreen = Framework.Form.Button.Register("btnInsertScreen", () => {
                    return self.isLocked == false;
                }, (e) => {
                    self.showInsertScreen();
                });

                this.btnPasteScreen = Framework.Form.Button.Register("btnPasteScreen", () => {
                    return self.isLocked == false;
                }, (e) => {
                    self.InsertScreen(Framework.Factory.Clone(self.copiedScreen), self.selectedScreenIndex, undefined);
                });

                this.btnSetScreenStyle = Framework.Form.Button.Register("btnSetScreenStyle", () => {
                    return self.isLocked == false;
                }, (e) => {
                    self.ShowModalScreensStyle(() => {
                        self.OnScreenChanged(self.CurrentScreen.Id, false)
                        self.setMiniatures();
                        self.highlightSelectedScreen(self.CurrentScreen.Id);
                    });
                });

                this.btnSimulateSession = Framework.Form.Button.Register("btnSimulateSession", () => {
                    return true;
                }, () => {
                    self.ShowModalSimulation(self.subjectSession, self.CurrentScreen.Id);
                }, Framework.LocalizationManager.Get("SimulateSession"));

                this.btnZoomIn = Framework.Form.Button.Register("btnZoomIn", () => {
                    return self.scaleFactor < 2;
                }, (e) => {
                    self.scaleFactor += 0.05;
                    self.screenDiv.style.transform = "scale(" + self.scaleFactor + ")";
                    self.btnZoomIn.CheckState();
                    self.btnZoomOut.CheckState();
                }, Framework.LocalizationManager.Get("ZoomIn"));

                this.btnZoomOut = Framework.Form.Button.Register("btnZoomOut", () => {
                    return self.scaleFactor > 0.6;
                }, (e) => {
                    self.scaleFactor -= 0.05;
                    self.screenDiv.style.transform = "scale(" + self.scaleFactor + ")";
                    self.btnZoomIn.CheckState();
                    self.btnZoomOut.CheckState();
                }, Framework.LocalizationManager.Get("ZoomOut"));

                this.btnToggleGridVisibility = Framework.Form.Button.Register("btnToggleGrid", () => {
                    return true;
                }, (e) => {
                    self.setGrid();
                }, Framework.LocalizationManager.Get("ToggleGridVisibility"));

                //TODO                
                //    new Framework.Form.ToolBarDropDownButtonItem(() => { self.screenEditor.AlignControlsOnGrid(); }, ["toolboxbutton", "toggleDesignGridButton"], "", Framework.LocalizationManager.Get("AlignAllcontrolsOnGrid"))

                //TODO
                this.btnSelectNextControl = Framework.Form.Button.Register("btnSelectNextControl", () => {
                    return true;
                }, (e) => {
                    self.selectNextControl();
                }, Framework.LocalizationManager.Get("SelectNextControl"));

                this.btnAddControl = Framework.Form.Button.Register("btnAddControl", () => {
                    return self.isLocked == false;
                }, () => {
                    self.showControlList();
                });

                this.btnPasteControl = Framework.Form.Button.Register("btnPasteControl", () => {
                    return (self.isLocked == false && self.CurrentScreen != undefined && self.copiedControl != undefined);
                }, (e) => {
                    let newControl = Framework.Factory.CreateFrom(ScreenReader.Controls.BaseControl, self.copiedControl, false);
                    newControl._Left += 10;
                    newControl._Top += 10;
                    self.addControl(newControl, false);
                }, Framework.LocalizationManager.Get("PasteTooltip"));

                this.btnCopyControl = Framework.Form.Button.Register("btnCopyControl", () => {
                    return (self.isLocked == false && self.CurrentScreen != undefined && self.selectedControl != undefined);//TODO : actualiser état du bouton
                }, (e) => {
                    self.copiedControl = self.selectedControl;
                    self.btnPasteControl.CheckState();
                }, Framework.LocalizationManager.Get("CopyTooltip"));

                this.btnEditControl = Framework.Form.Button.Register("btnEditControl", () => {
                    return (self.isLocked == false && self.CurrentScreen != undefined && self.selectedControl != undefined); //TODO : actualiser
                }, (e) => {
                    self.selectedControl.Highlight();
                    self.selectedControl.ShowProperties();
                }, Framework.LocalizationManager.Get("EditControlTooltip"));

                this.btnPositionControl = Framework.Form.Button.Register("btnPositionControl", () => {
                    return (self.isLocked == false && self.CurrentScreen != undefined && self.selectedControl != undefined); //TODO : actualiser
                }, (e) => {
                    let div = document.createElement("div");
                    div.appendChild(self.selectedControl.GetPositionForm().HtmlElement);
                    Framework.Popup.Show(self.btnPositionControl.HtmlElement, div, "top");
                }, Framework.LocalizationManager.Get("PositionControlTooltip"));

                this.btnCutControl = Framework.Form.Button.Register("btnCutControl", () => {
                    return (self.isLocked == false && self.CurrentScreen != undefined && self.selectedControl != undefined);//TODO : actualiser état du bouton
                }, (e) => {
                    //TODO
                    self.copiedControl = self.selectedControl;
                    self.RemoveControlFromScreen(self.CurrentScreen, self.selectedControl);
                    //self.currentScreen.DeleteControl(self.selectedControl);
                    self.btnPasteControl.CheckState();
                }, Framework.LocalizationManager.Get("PasteTooltip"));

                this.btnDeleteControl = Framework.Form.Button.Register("btnDeleteControl", () => {
                    return (self.isLocked == false && self.CurrentScreen != undefined && self.selectedControl != undefined);//TODO : actualiser état du bouton
                }, (e) => {
                    Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("ConfirmControlRemoval"), () => {
                        self.RemoveControlFromScreen(self.CurrentScreen, self.selectedControl);
                    });
                    //self.currentScreen.DeleteControl(self.selectedControl);
                }, Framework.LocalizationManager.Get("DeleteTooltip"));

                this.miniaturesDiv = document.createElement("div");
                this.miniaturesDiv.style.width = this.listScreensContainer.clientWidth + "px";
                this.miniaturesDiv.style.height = this.listScreensContainer.clientHeight + "px";
                this.miniaturesDiv.style.margin = "1px";
                this.listScreensContainer.appendChild(this.miniaturesDiv);

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

            }

            public UpdateMiniatures() {
                this.setMiniatures();
                this.highlightSelectedScreen(this.CurrentScreen.Id);
                this.btnMoveDownScreen.CheckState();
                this.btnMoveUpScreen.CheckState();
            }

            private showInsertScreen() {
                let self = this;
                let div = document.createElement("div");

                let cb = () => {
                    //self.setMiniatures();
                    //self.highlightSelectedScreen(self.currentScreen.Id);
                    //self.btnMoveDownScreen.CheckState();
                    //self.btnMoveUpScreen.CheckState();
                    modal.Close();
                };

                //let div1 = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("InsertSingleScreen"), ["font-weight-bold"]);
                //div.appendChild(div1.HtmlElement);

                let b1 = Framework.Form.Button.Create(() => { return true; }, () => {
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

                let b2 = Framework.Form.Button.Create(() => { return true; }, () => {
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

                let b4 = Framework.Form.Button.Create(() => { return true; }, () => {
                    self.ShowModalScreenFromXML(self.selectedScreenIndex, self.getPreviousScreenExperimentalDesign(), () => { cb(); });


                    //self.showInsertScreenFromAnotherSession((screens: Models.Screen[]) => {
                    //    screens.forEach((screen) => {
                    //        self.InsertScreen(screen, self.selectedScreenIndex, self.getPreviousScreenExperimentalDesign());
                    //    });
                    //    cb();
                    //});
                }, Framework.LocalizationManager.Get("FromAnotherSession"), ["textButton"]);
                div.appendChild(b4.HtmlElement);

                //TODO : modèles d'écran


                let modal = Framework.Modal.Custom(div, Framework.LocalizationManager.Get("InsertScreen"), undefined, undefined, "500px", true);

            }

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

            private getPreviousScreenExperimentalDesign(): number {
                // Plan de présentation de l'écran précédent'
                let previousScreenIndex = Math.max(0, this.selectedScreenIndex - 1);
                let experimentalDesignId = this.miniaturesScreens[previousScreenIndex].Screen.ExperimentalDesignId;
                // Si pas de plan à l'écran précédent, Id du premier plan de présentation
                if (experimentalDesignId == 0) {
                    experimentalDesignId = this.listDesigns.filter((x) => { return x.Type == "Product"; })[0].Id;
                }
                if (experimentalDesignId == undefined) {
                    experimentalDesignId = 0;
                }
                return experimentalDesignId;
            }

            private setMiniatures() {
                let self = this;

                this.miniaturesDiv.innerHTML = "";
                this.miniaturesScreens = [];
                for (var i = 0; i < self.listScreens.length; i++) {
                    let screen = Framework.Factory.CreateFrom(Models.Screen, self.listScreens[i]);

                    let miniature = screen.RenderAsMiniature(i, this.listScreensContainer.clientWidth - 5, this.listDesigns, (x) => {
                        self.OnScreenChanged(x.Screen.Id, true);
                    });
                    this.miniaturesScreens.push(miniature);
                    this.miniaturesDiv.appendChild(miniature.Div);
                }
            }

            private highlightSelectedScreen(selectedScreenId: number) {
                let self = this;
                this.miniaturesScreens.forEach((x) => {
                    if (x.Screen.Id == selectedScreenId) {
                        x.Div.style.border = "1px solid gold";
                        x.NumberDiv.style.background = "#F5F6CE";
                    } else {
                        x.Div.style.border = "1px solid gray";
                        x.NumberDiv.style.background = "transparent";
                    }
                });

            }

            private setGrid() {
                $(".screenGrid").remove();

                //let div = this.screenDiv;
                let div = this.activeScreenWrapper;
                //let div = this.activeScreenContainer;

                if (this.designGridIncrement > 0) {

                    //TODO : conserver grille (mettre sur wrapper ?)
                    var scale = this.screenDiv.getBoundingClientRect().width / this.screenDiv.offsetWidth;
                    let width = div.scrollWidth /** scale*/;
                    let height = div.scrollHeight /** scale*/;
                    //let left = div.getBoundingClientRect().left;
                    let left = 0;

                    for (var i = 0; i < width / this.designGridIncrement; i++) {
                        let hr = document.createElement("div");
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
                        let hr = document.createElement("div");
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
                } else {
                    this.btnToggleGridVisibility.HtmlElement.classList.add("active");
                }
            }

            private selectNextControl(): void {
                this.CurrentScreen.Controls.forEach((x) => {
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
            }

            private saveCurrentScreen() {
                if (this.CurrentScreen != undefined && this.selectedScreenIndex != undefined) {
                    this.listScreens[this.selectedScreenIndex] = this.CurrentScreen;
                    this.updateMiniature(this.selectedScreenIndex);
                }
            }

            private updateMiniature(index: number) {
                let self = this;
                let screen = Framework.Factory.CreateFrom(Models.Screen, this.listScreens[index]);
                let miniature = screen.RenderAsMiniature(index, this.listScreensContainer.clientWidth - 5, this.listDesigns, (x) => {
                    self.OnScreenChanged(x.Screen.Id, true);
                });

                this.miniaturesScreens.splice(index, 1, miniature);

                this.miniaturesDiv.removeChild(this.miniaturesDiv.children[index]);
                this.miniaturesDiv.insertBefore(miniature.Div, this.miniaturesDiv.children[index]);

                this.highlightSelectedScreen(this.CurrentScreen.Id);

            }

            public OnScreenChanged(screenId: number, saveCurrentScreen: boolean) {

                let self = this;

                if (saveCurrentScreen) {
                    this.saveCurrentScreen();
                }

                let activeScreen: Models.Screen = this.listScreens.filter((x) => { return x.Id == screenId; })[0];
                this.CurrentScreen = Framework.Factory.CreateFrom(Models.Screen, activeScreen);

                //    if (self.selectedControl) {
                //        //TODO
                //        //self.screenEditor.SelectedControl.SetLock(self.controller.Session.IsLocked);
                //        //self.screenEditor.SelectedControl.SetStickiness(self.designGridStickiness, self.designGridIncrement);
                //    }
                //}

                let activeScreenHeight = Number(self.activeScreenContainer.style.height.replace("px", ""));
                let activeScreenWidth = activeScreenHeight * Models.Screen.GetRatio(self.listScreens[0]);

                // Affichage écran sélectionné
                let div: HTMLDivElement = Models.Screen.Render(this.CurrentScreen, activeScreenHeight, activeScreenWidth, this.listDesigns, (control: ScreenReader.Controls.BaseControl) => {
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

                let clearControlSelection = () => {
                    self.clearControlsSelection();
                    self.btnCopyControl.CheckState();
                    self.btnCutControl.CheckState();
                    self.btnDeleteControl.CheckState();
                    self.btnEditControl.CheckState();
                    self.btnPositionControl.CheckState();
                    tinymce.remove();
                }

                clearControlSelection();


                // Clic en dehors d'un contrôle : déselection                            
                this.activeScreenContainer.addEventListener(Framework.Events.Click, (e) => {
                    if ((<HTMLDivElement>e.target).id == "currentScreen") {
                        clearControlSelection();
                    }
                }, false);

                this.highlightSelectedScreen(screenId);
            }

            public SetCurrentControl(control: ScreenReader.Controls.BaseControl) {

                if (this.isLocked == true) {
                    return;
                    //TODO : désactiver sélection du texte et changement de style
                }

                let self = this;

                self.saveCurrentScreen();

                self.clearControlsSelection();
                self.selectedControl = control;

                self.selectedControl.Highlight();

                if (self.selectedControl._Type == "CustomButton") {
                    (<ScreenReader.Controls.CustomButton>self.selectedControl).ScreenIds = self.listScreens.map((x) => { return x.Id });
                }

                if (self.selectedControl instanceof ScreenReader.Controls.DataControl) {
                    (<ScreenReader.Controls.DataControl>control).ListExperimentalDesigns = self.listDesigns;
                }

                if (self.selectedControl instanceof ScreenReader.Controls.GroupDescriptionControl) {
                    (<ScreenReader.Controls.GroupDescriptionControl>control).ListControlNames = self.GetListSortingControlNames();
                }

                if (self.selectedControl instanceof ScreenReader.Controls.RandomPrice) {
                    (<ScreenReader.Controls.RandomPrice>control).ListControlNames = self.GetListDataControlNames();
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

                self.selectedControl.OnPropertyChanged = (propertyName: string, oldValue: any, newValue: any) => {
                    self.OnControlPropertyChanged(self.selectedControl, propertyName, oldValue, newValue);
                }

                //let f = function convertir(chn: string, p1, decalage, s) {
                //    let r = chn.split(':')[0] + ": " + Math.round(Number(p1) / self.selectedControl.Ratio);
                //    return r;
                //}

                //let setHtmlContent = function (text: string) {
                //    return text.replace(/font-size:\s*(\d+)\s*/g, f);
                //}

                //if (self.selectedControl instanceof ScreenReader.Controls.TextArea) {
                if (self.selectedControl._Type == "TextArea") {
                    self.editor.Set((<ScreenReader.Controls.TextArea>self.selectedControl).GetHtmlDivElement(), (text: string) => {
                        //(<ScreenReader.Controls.TextArea>self.selectedControl)._HtmlContent = setHtmlContent(text);
                        (<ScreenReader.Controls.TextArea>self.selectedControl)._HtmlContent = text;
                    });
                }
                //else if (self.selectedControl instanceof ScreenReader.Controls.CustomButton) {
                else if (self.selectedControl._Type == "CustomButton") {
                    self.editor.Set((<ScreenReader.Controls.CustomButton>self.selectedControl).HtmlElement, (text: string) => {
                        (<ScreenReader.Controls.CustomButton>self.selectedControl)._Content = text;
                    }, true);
                }
                //else if (self.selectedControl instanceof ScreenReader.Controls.BaseQuestionControl) {
                else if (self.selectedControl._Type == "FreeTextQuestionControl" || self.selectedControl._Type == "CheckboxQuestionControl" || self.selectedControl._Type == "ComboboxQuestionControl") {
                    //self.editor.Set((<ScreenReader.Controls.BaseQuestionControl>self.selectedControl).Label.HtmlElement, (text: string) => { (<ScreenReader.Controls.BaseQuestionControl>self.selectedControl)._LabelContent = setHtmlContent(text); });
                    self.editor.Set((<ScreenReader.Controls.BaseQuestionControl>self.selectedControl).GetHtmlDivElement(), (text: string) => {
                        (<ScreenReader.Controls.BaseQuestionControl>self.selectedControl)._LabelContent = text;
                    });
                }
                else {
                    self.editor.Disable();
                }
            }

            private clearControlsSelection() {

                $(".screenContextMenu").remove();

                // Clic remet à 0 la liste des controles sélectionnés, supprime tous les highlights
                let self = this;
                self.selectedControl = undefined;
                self.CurrentScreen.Controls.forEach((control) => {
                    if (control.RemoveHighlight) {
                        control.RemoveHighlight();
                    }
                });

                if (self.editor) {
                    self.editor.Disable();
                }
            }

            private addControl(control: ScreenReader.Controls.BaseControl, style: boolean = true) {
                let self = this;
                this.AddControlToScreen(this.CurrentScreen, control, (c: ScreenReader.Controls.BaseControl) => {
                    self.SetCurrentControl(control);
                    //TODO : afficher propriétés
                }, style);
                this.controlIds.push(control._FriendlyName);
            }

            private showControlList() {

                let self = this;

                this.controlIds = self.GetListControlNames();

                let container = Framework.Form.TextElement.Create("");

                let controlsDiv = Framework.Form.TextElement.Create("", ["controlsDiv"]);
                container.Append(controlsDiv);

                let optionsDiv = Framework.Form.TextElement.Create("", ["optionsDiv"]);
                container.Append(optionsDiv);

                //let errorDiv = Framework.Form.TextElement.Create("");
                //errorDiv.HtmlElement.style.margin = "20px";
                //container.Append(errorDiv);

                let designs = [];
                let screenDesign = undefined;
                if (this.CurrentScreen.ExperimentalDesignId > 0) {
                    screenDesign = self.listDesigns.filter((x) => { return x.Id == self.CurrentScreen.ExperimentalDesignId })[0];

                    if (screenDesign.Type == "Product") {
                        designs = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Attribute');
                    }
                    if (screenDesign.Type == "Attribute") {
                        designs = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Product');
                    }
                }

                let isFormValid: boolean = true;



                let setForm = function (control: ScreenReader.Controls.BaseControl) {

                    control._FriendlyName = Framework.Format.Unique(control._Type + "_1", self.controlIds);

                    modal.SetTitle(Framework.LocalizationManager.Get("Options") + " - " + Framework.LocalizationManager.Get(control._Type));
                    controlsDiv.HtmlElement.innerHTML = "";
                    optionsDiv.HtmlElement.innerHTML = "";

                    control.OnCreationFormClosed = () => {
                        self.addControl(control);
                        modal.Close();
                    };

                    let shouldAddDirectly: boolean = true;

                    let creationProperties = control.GetEditableProperties("creation");

                    let validateForm = () => {

                        let validationResult = "";
                        for (let i = 0; i < creationProperties.length; i++) {
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

                        } else {
                            isFormValid = true;
                            btnOK.CheckState();

                        }
                    }

                    creationProperties.forEach((x) => {
                        x.OnCheck = () => {
                            validateForm();
                        }
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
                }

                let control: ScreenReader.Controls.BaseControl = undefined;

                let btnAddControlButton = Framework.Form.Button.Create(() => { return true; }, () => {
                    control = ScreenReader.Controls.CustomButton.Create();
                    control.SetScreen(self.CurrentScreen);
                    (<ScreenReader.Controls.CustomButton>control).ListGroupOfControlFriendlyNames = self.CurrentScreen.Controls.map((x) => { return x._FriendlyName });
                    (<ScreenReader.Controls.CustomButton>control).ScreenIds = self.listScreens.map((x) => { return x.Id });
                    setForm(control);
                }, Framework.LocalizationManager.Get("Button"), ["textButton"]);
                controlsDiv.Append(btnAddControlButton);

                let btnAddControlTextArea = Framework.Form.Button.Create(() => { return true; }, (e) => {
                    //TODO : partout                                       
                    control = ScreenReader.Controls.TextArea.Create();
                    let width = Models.Screen.Width(self.CurrentScreen);
                    control._Width = width * 0.95;
                    control._Left = width * 0.025;
                    setForm(control);
                }, Framework.LocalizationManager.Get("TextArea"), ["textButton"]);
                controlsDiv.Append(btnAddControlTextArea);

                let btnAddControlRectangle = Framework.Form.Button.Create(() => { return true; }, (e) => {
                    control = ScreenReader.Controls.Rectangle.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("Rectangle"), ["textButton"]);
                controlsDiv.Append(btnAddControlRectangle);

                let btnAddControlVideo = Framework.Form.Button.Create(() => { return true; }, (e) => {
                    control = ScreenReader.Controls.CustomMedia.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("VideoPlayer"), ["textButton"]);
                controlsDiv.Append(btnAddControlVideo);

                let btnAddControlImage = Framework.Form.Button.Create(() => { return true; }, (e) => {
                    control = ScreenReader.Controls.CustomImage.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("Picture"), ["textButton"]);
                controlsDiv.Append(btnAddControlImage);

                //let btnAddControlChronometer = Framework.Form.Button.Create(() => { return Models.Screen.HasControlOfType(self.currentScreen, "CustomChronometer") == false; }, (e) => {
                //    control = ScreenReader.Controls.CustomChronometer.Create();
                //    setForm(control);
                //}, Framework.LocalizationManager.Get("Chronometer"), ["textButton"]);
                //controlsDiv.Append(btnAddControlChronometer);

                let btnAddControlVideoRecorder = Framework.Form.Button.Create(() => { return Models.Screen.HasControlOfType(self.CurrentScreen, "VideoRecorder") == false; }, (e) => {
                    control = ScreenReader.Controls.VideoRecorder.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("VideoRecorder"), ["textButton"]);
                controlsDiv.Append(btnAddControlVideoRecorder);

                let btnAddControlPhotoRecorder = Framework.Form.Button.Create(() => { return Models.Screen.HasControlOfType(self.CurrentScreen, "PhotoRecorder") == false; }, (e) => {
                    control = ScreenReader.Controls.PhotoRecorder.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("PhotoRecorder"), ["textButton"]);
                controlsDiv.Append(btnAddControlPhotoRecorder);

                let btnAddRandomPrice = Framework.Form.Button.Create(() => { return self.CurrentScreen.ExperimentalDesignId == 0 && self.listDesigns.filter((x) => { return x.Type == "Product" }).length > 0 }, (e) => {
                    control = ScreenReader.Controls.RandomPrice.Create();
                    (<ScreenReader.Controls.DataControl>control).ListExperimentalDesigns = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Product');
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

                let btnAddControlButtonList = Framework.Form.Button.Create(() => { return self.CurrentScreen.ExperimentalDesignId > 0 }, (e) => {
                    control = ScreenReader.Controls.DTSButtonsControl.Create();
                    (<ScreenReader.Controls.DataControl>control).ListExperimentalDesigns = designs;
                    setForm(control);
                }, Framework.LocalizationManager.Get("ButtonList"), ["textButton"]);
                controlsDiv.Append(btnAddControlButtonList);

                let btnAddControlContinuousScaleList = Framework.Form.Button.Create(() => { return self.CurrentScreen.ExperimentalDesignId > 0 }, (e) => {
                    control = ScreenReader.Controls.SlidersControl.Create("None", 0, screenDesign.Type, "None");
                    (<ScreenReader.Controls.DataControl>control).ListExperimentalDesigns = designs;
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

                let btnAddControlDiscreteScaleList = Framework.Form.Button.Create(() => { return self.CurrentScreen.ExperimentalDesignId > 0 }, (e) => {
                    control = ScreenReader.Controls.DiscreteScalesControl.Create("None", 0, screenDesign.Type, "None");
                    (<ScreenReader.Controls.DataControl>control).ListExperimentalDesigns = designs;
                    //(<SubjectSessionReader.Controls.DiscreteScalesControl>control)._EvaluationMode = screenDesign.Type;
                    setForm(control);
                }, Framework.LocalizationManager.Get("DiscreteScalesList"), ["textButton"]);
                controlsDiv.Append(btnAddControlDiscreteScaleList);

                let btnAddControlCheckboxList = Framework.Form.Button.Create(() => { return self.CurrentScreen.ExperimentalDesignId > 0 }, (e) => {
                    control = ScreenReader.Controls.CATAControl.Create();
                    (<ScreenReader.Controls.DataControl>control).ListExperimentalDesigns = designs;
                    setForm(control);
                }, Framework.LocalizationManager.Get("CheckboxList"), ["textButton"]);
                controlsDiv.Append(btnAddControlCheckboxList);

                let btnAddControlSorting = Framework.Form.Button.Create(() => { return self.CurrentScreen.ExperimentalDesignId == 0 && self.listDesigns.filter((x) => { return x.Type == "Attribute" }).length > 0 }, (e) => {
                    control = ScreenReader.Controls.SortingControl.Create();
                    (<ScreenReader.Controls.DataControl>control).ListExperimentalDesigns = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Product');
                    setForm(control);
                }, Framework.LocalizationManager.Get("SortingControl"), ["textButton"]);
                controlsDiv.Append(btnAddControlSorting);

                let btnAddControlGroupDescription = Framework.Form.Button.Create(() => {
                    return self.CurrentScreen.ExperimentalDesignId == 0 && self.GetListSortingControlNames().length > 0;
                }, (e) => {
                    control = ScreenReader.Controls.GroupDescriptionControl.Create();
                    (<ScreenReader.Controls.GroupDescriptionControl>control).ListControlNames = self.GetListSortingControlNames();
                    (<ScreenReader.Controls.GroupDescriptionControl>control).ListExperimentalDesigns = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Attribute');
                    setForm(control);
                }, Framework.LocalizationManager.Get("GroupDescriptionControl"), ["textButton"]);
                controlsDiv.Append(btnAddControlGroupDescription);

                //let btnAddControlNapping = Framework.Form.Button.Create(() => { return self.CurrentScreen.ExperimentalDesignId == 0 && self.listDesigns.filter((x) => { return x.Type == "Product" }).length > 0 }, (e) => {
                //    control = ScreenReader.Controls.NappingControl.Create();
                //    (<ScreenReader.Controls.DataControl>control).ListExperimentalDesigns = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Product');
                //    setForm(control);
                //}, Framework.LocalizationManager.Get("NappingControl"), ["textButton"]);
                //controlsDiv.Append(btnAddControlNapping);

                let btnAddControlRanking = Framework.Form.Button.Create(() => { return self.CurrentScreen.ExperimentalDesignId == 0 && self.listDesigns.filter((x) => { return x.Type == "Product" }).length > 0 }, (e) => {
                    control = ScreenReader.Controls.RankingControl.Create();
                    (<ScreenReader.Controls.DataControl>control).ListExperimentalDesigns = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Product');
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


                let btnAddFreeTextQuestionButton = Framework.Form.Button.Create(() => { return true; }, (e) => {
                    control = ScreenReader.Controls.FreeTextQuestionControl.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("FreeTextQuestion"), ["textButton"]);
                controlsDiv.Append(btnAddFreeTextQuestionButton);

                let btnAddCheckboxQuestionButton = Framework.Form.Button.Create(() => { return true; }, (e) => {
                    control = ScreenReader.Controls.CheckboxQuestionControl.Create();
                    setForm(control);
                }, Framework.LocalizationManager.Get("CheckboxQuestion"), ["textButton"]);
                controlsDiv.Append(btnAddCheckboxQuestionButton);

                let btnAddComboboxQuestionButton = Framework.Form.Button.Create(() => { return true; }, (e) => {
                    control = ScreenReader.Controls.ComboboxQuestionControl.Create();
                    (<ScreenReader.Controls.ComboboxQuestionControl>control).ListExperimentalDesigns = PanelLeaderModels.Session.GetDefaultExperimentalDesign(self.listDesigns, 'Attribute');
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

                let btnCancel = Framework.Form.Button.Create(() => { return true; }, () => {
                    modal.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));

                let btnOK = Framework.Form.Button.Create(() => {
                    return isFormValid == true;
                }, () => {
                    self.addControl(control);
                    modal.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("OK"));

                //let modal: Framework.Modal.Modal = Framework.Modal.Custom(container.HtmlElement, Framework.LocalizationManager.Get("NewControl"), [btnCancel, btnOK], "580px", "800px", true, true, false);
                let modal = Framework.Modal.Custom(container.HtmlElement, Framework.LocalizationManager.Get("NewControl"), [btnCancel, btnOK], "580px", "800px", false, true, false);
            }

            public OnLockChanged(isLocked: boolean) {
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
                } else {
                    this.activeScreenWrapper.classList.remove("disabledScreen");
                }
            }



        }

        export class MonitoringViewModel extends PanelLeaderViewModel {

            //TODO: URL cryptée en base 64 (comme depuis version SL)
            //TODO: Fractionner envoi de mails
            //TODO: Associer code serveur à un répertoire par panel elader
            //TODO : envoi de SMS
            //TODO : notifications in browser et au chargement de la séance
            //TODO : reset progress to specific page, to 0, reset min page between connections
            //TODO : lancer dans les boxes (voir Benjamin)
            //TODO : paramétrage du lien : page accueil, avec code juge, avec password, avec code serveur
            //TODO : recall mail et fréqeunce de rappel de mail
            // Detail : clientinfo, geolocation, hasissue
            //TODO : envoi de notification

            public TableMonitoring: Framework.Form.Table<PanelLeaderModels.MonitoringProgress>;


            private btnPrintMemo: Framework.Form.Button;
            private btnMail: Framework.Form.Button;
            private btnResetProgress: Framework.Form.Button;
            private btnRefreshMonitoring: Framework.Form.Button;

            //private btnPrintSession: Framework.Form.Button;

            private btnImportZipFromOfflineMode: Framework.Form.Button;
            //private btnExportAsZipForOfflineMode: Framework.Form.Button;

            private divMonitoringTable: Framework.Form.TextElement;

            private isRefreshing: boolean;

            //private dataTableMonitoring: Framework.Form.DataTable;

            private recipients: string[];

            private isOnline: boolean = true;

            public UpdateMail: (subjectCode: string, mail: string) => void;
            public PrintMemo: () => void;
            //public DownloadSubjectSeancesAsZip: (listSubjectCodes: string[]) => void; //TODO
            public RefreshMonitoring: (success: (monitoringProgress: PanelLeaderModels.MonitoringProgress[]) => void, error: Function) => void;
            public ResetUserProgress: (subjects: string[], removeData: boolean, callback: (monitoringProgress: PanelLeaderModels.MonitoringProgress[]) => void) => void;
            public ShowModalSendMail: (recipients: string[], onClose: (monitoringProgresses) => void) => void;
            public OnDataTableLoaded: (dt: Framework.Form.DataTable) => void;
            public UpdateData: (data: Models.Data[]) => void;

            private checkSelection(): boolean {
                //return this.dataTableMonitoring && this.dataTableMonitoring.SelectedData.length > 0;
                return this.TableMonitoring && this.TableMonitoring.SelectedData.length > 0;
            }

            public OnConnectivityChanged(isOnline: boolean) {
                this.isOnline = isOnline;
            }

            constructor(listProgress: PanelLeaderModels.MonitoringProgress[]) {
                super();
                let self = this;

                this.isRefreshing = false;

                this.divMonitoringTable = Framework.Form.TextElement.Register("divMonitoringTable");

                this.btnPrintMemo = Framework.Form.Button.Register("btnPrintMemo", () => { return true; }, (e) => {
                    self.PrintMemo();
                }, Framework.LocalizationManager.Get("PrintMemo"));

                //this.btnPrintSession = Framework.Form.Button.Register("btnPrintSession", () => { return self.isOnline == true && self.checkSelection(); }, (e) => {
                //    let urls = self.TableMonitoring.SelectedData.map((x) => { return x.URL });
                //    urls.forEach((x) => {
                //        Framework.Browser.OpenNew(PanelLeaderModels.MonitoringProgress.GetEncryptedURL(x + "&screenshot=true"));
                //    });
                //}, Framework.LocalizationManager.Get("PrintSession"));

                this.btnMail = Framework.Form.Button.Register("btnMail", () => {
                    return self.isOnline == true && self.checkSelection(); //TODO : actualiser
                }, () => {
                    //self.ShowModalSendMail(self.recipients, () => { self.dataTableMonitoring.Refresh(); });
                    self.ShowModalSendMail(self.recipients, (monitoringProgresses) => {
                        self.TableMonitoring.Refresh(monitoringProgresses);
                    });
                }, Framework.LocalizationManager.Get("SendMailToSelectedPanelists"));


                this.btnResetProgress = Framework.Form.Button.Register("btnResetProgress", () => {
                    return self.isOnline == true && self.checkSelection();
                }, () => {
                    self.ResetUserProgress(self.TableMonitoring.SelectedData.map(a => a.SubjectCode), true, (monitoringProgress: PanelLeaderModels.MonitoringProgress[]) => {
                        self.setDataTable(monitoringProgress);
                    });
                }, Framework.LocalizationManager.Get("UpdateProgress"));

                this.btnRefreshMonitoring = Framework.Form.Button.Register("btnRefreshMonitoring", () => {
                    //TODO séance non expirée
                    return self.isOnline == true && self.isRefreshing == false;
                }, () => {
                    self.isRefreshing = true;
                    self.btnRefreshMonitoring.CheckState();
                    self.RefreshMonitoring((monitoringProgress: PanelLeaderModels.MonitoringProgress[]) => {
                        self.setDataTable(monitoringProgress);
                        self.isRefreshing = false;
                        self.btnRefreshMonitoring.CheckState();
                    }, (error) => {
                        Framework.Modal.Alert(Framework.LocalizationManager.Get("Error"), Framework.LocalizationManager.Get("ErrorWhileDownloadingProgress"));
                        self.isRefreshing = false;
                        self.btnRefreshMonitoring.CheckState();
                    });
                }, Framework.LocalizationManager.Get("Refresh"));

                this.btnImportZipFromOfflineMode = Framework.Form.Button.Register("btnImportZipFromOfflineMode", () => {
                    return true;
                }, () => {
                    Framework.FileHelper.BrowseFile(".xml", file => {

                        var fileReader: FileReader = new FileReader();
                        fileReader.onload = function (e) {
                            if (!e) {
                                var data = (<any>fileReader).content;
                            }
                            else {
                                var data = (<any>e.target).result;
                            }
                            var decrypted = atob(data);
                            var obj: Models.LocalSessionProgress = Framework.Serialization.JsonToInstance(new Models.LocalSessionProgress(), decrypted);

                            self.UpdateData(obj.Progress.ListData);
                        }
                        fileReader.readAsBinaryString(file);




                    })
                }, Framework.LocalizationManager.Get("ImportZipFromOfflineMode"));

                //this.btnExportAsZipForOfflineMode = Framework.Form.Button.Register("btnExportAsZipForOfflineMode", () => {
                //    return true;
                //}, () => {
                //    //TODO;
                //    alert("Not implemented");
                //}, Framework.LocalizationManager.Get("ExportAsZipForOfflineMode"));

                this.setDataTable(listProgress);

                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});

            }

            private setDataTable(listProgress: PanelLeaderModels.MonitoringProgress[]) {

                let self = this;

                this.TableMonitoring = new Framework.Form.Table<PanelLeaderModels.MonitoringProgress>();
                this.TableMonitoring.ListColumns = [];

                let col1 = new Framework.Form.TableColumn();
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

                let col4 = new Framework.Form.TableColumn();
                col4.Name = "Mail";
                col4.Title = Framework.LocalizationManager.Get("Email");
                col4.Validator = Framework.Form.Validator.Mail();
                this.TableMonitoring.ListColumns.push(col4);

                let col5 = new Framework.Form.TableColumn();
                col5.Name = "LastAccess";
                col5.Title = Framework.LocalizationManager.Get("LastAccess");
                col5.Editable = false;
                col5.MinWidth = 200;
                this.TableMonitoring.ListColumns.push(col5);

                let col6 = new Framework.Form.TableColumn();
                col6.Name = "Progress";
                col6.Title = Framework.LocalizationManager.Get("Progress");
                col6.Editable = false;
                col6.MinWidth = 150;
                this.TableMonitoring.ListColumns.push(col6);

                let col6b = new Framework.Form.TableColumn();
                col6b.Name = "Products";
                col6b.Title = Framework.LocalizationManager.Get("Products");
                col6b.Editable = false;
                col6b.MinWidth = 150;
                this.TableMonitoring.ListColumns.push(col6b);

                let col7 = new Framework.Form.TableColumn();
                col7.Name = "MailStatus";
                col7.Title = Framework.LocalizationManager.Get("MailStatus");
                col7.Editable = false;
                col7.MinWidth = 350;
                this.TableMonitoring.ListColumns.push(col7);

                let col8 = new Framework.Form.TableColumn();
                col8.Name = "URL";
                col8.Title = Framework.LocalizationManager.Get("URL");
                col8.Editable = false;
                col8.Filterable = false;
                col8.Sortable = false;
                col8.MinWidth = 100;
                col8.RenderFunction = (val: string) => {
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

                this.TableMonitoring.OnSelectionChanged = (selection) => {
                    self.recipients = selection.map((x) => { return x.SubjectCode; });
                    self.btnMail.CheckState();
                    self.btnResetProgress.CheckState();
                    //self.btnPrintSession.CheckState();
                    //self.btnExportAsZipForOfflineMode.CheckState();
                };

                this.TableMonitoring.OnDataUpdated = (progress: PanelLeaderModels.MonitoringProgress, propertyName: string, oldValue: any, newValue: any) => {
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
            }

            public SetLock(isLocked: boolean) {
                this.isLocked = true;
                this.btnPrintMemo.CheckState();
                this.btnMail.CheckState();
                this.btnResetProgress.CheckState();
                this.btnRefreshMonitoring.CheckState();
                //this.btnImportZipFromOfflineMode.CheckState();
                //this.btnExportAsZipForOfflineMode.CheckState();

                if (this.isLocked == true) {
                    this.TableMonitoring.Disable();
                } else {
                    this.TableMonitoring.Enable();
                }
            }
        }

        export class ModalResetProgressViewModel extends PanelLeaderViewModel {

            private isOnline: boolean = true;

            public OnConnectivityChanged(isOnline: boolean) {
                this.isOnline = isOnline;
            }

            public static Show(callback: (resetProgress: boolean, resetMinTimeBetween2Connections: boolean) => void) {
                let self = this;

                //TODO : mettre ça dans HTML ? 
                let div = document.createElement("div");

                let cb1 = Framework.Form.CheckBox.Create(() => { return true; }, () => { }, Framework.LocalizationManager.Get("ResetProgress"), "", false, ["blockForm"]);
                div.appendChild(cb1.HtmlElement);

                let cb2 = Framework.Form.CheckBox.Create(() => { return true; }, () => { }, Framework.LocalizationManager.Get("ResetMinTimeBetween2Connections"), "", false, ["blockForm"]);
                div.appendChild(cb2.HtmlElement);

                let btnOK = Framework.Form.Button.Create(() => {
                    //TODO return self.isOnLine == true;
                    return true;
                }, () => {
                    callback(cb1.IsChecked, cb2.IsChecked);
                    mw.Close();
                }, Framework.LocalizationManager.Get("OK"), ["btnCircle"]);

                let mw: Framework.Modal.Modal = Framework.Modal.Confirm(Framework.LocalizationManager.Get("UpdateProgress"), div, () => {
                    callback(cb1.IsChecked, cb2.IsChecked);
                });

                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});
            }
        }

        export class ModalSimulationViewModel extends PanelLeaderModalViewModel {

            private reader: ScreenReader.Reader;
            public get Reader(): ScreenReader.Reader {
                return this.reader;
            }

            private subjectSession: Models.SubjectSeance;
            public get SubjectSession(): Models.SubjectSeance {
                return this.subjectSession;
            }

            public OnScreenChanged: (index: number) => void;

            private readerState: ScreenReader.State;
            private readerActions: ScreenReader.Actions;

            private btnInfo: Framework.Form.Button;

            private currentScreenId: number;

            constructor(mw: Framework.Modal.Modal, subjectSession: Models.SubjectSeance, currentScreenId: number, isInTest: boolean) {
                super(mw);
                let self = this;

                this.currentScreenId = currentScreenId;
                this.subjectSession = subjectSession;

                this.readerState = new ScreenReader.State();
                this.readerState.IsInSimulation = true;
                this.readerState.IsPanelLeader = false;

                this.readerActions = new ScreenReader.Actions();
                this.readerActions.OnLastScreen = () => {
                    mw.Close();
                };
                this.readerActions.OnNavigation = (url) => {
                    //TODO
                };
                this.readerActions.OnValidationError = (message) => {
                    //TODO
                    if (isInTest == false) {
                        alert(message);
                    }
                };

                this.readerActions.OnError = (error) => {
                    //TODO
                    //if (self.IsInTest == false) {
                    //    self.ShowModalBox(Localization.Localize("Error"), error);
                    //}
                }
                this.readerActions.OnNotification = (message) => {
                    //self.ShowModalBox(Localization.Localize("Tip"), message);
                }
                this.readerActions.OnBase64StringUpload = (base64string: string, filename: string) => {
                    //TODO
                }

                this.readerActions.OnRScriptStarted = (rScript: string, success: Function, error: Function) => {
                    //TODO : message si offline
                }
                this.readerActions.OnSave = (blob: Blob, filename: string) => {
                    //saveAs(blob, filename);
                };
                this.readerActions.OnClose = () => {
                    mw.Close();
                };
                this.readerActions.OnDataChanged = (data: Models.Data) => {

                    let txt = "";
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

                    if (this.btnInfo) {
                        this.btnInfo.HighlightOn(txt, 'top');
                    }

                }

                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});

            }

            public Start() {
                let self = this;

                ScreenReader.Reader.Initialize(this.subjectSession, this.mw.Body, this.readerActions, this.readerState, (reader: ScreenReader.Reader) => {

                    self.reader = reader;

                    if (self.OnScreenChanged) {
                        reader.OnScreenChanged = self.OnScreenChanged;
                    }

                    let index = reader.GetIndexOfScreenId(this.currentScreenId);

                    reader.SetSubjectScreen(index, false, self.mw.Body.clientHeight, self.mw.Body.clientWidth);
                    self.mw.Body.classList.add("noMaxHeight");

                    let btnGoToFirstScreen = Framework.Form.Button.Create(() => { return true; }, () => {
                        reader.GoToFirstScreenAsPanelLeader();
                        self.btnInfo.HighlightOn(Framework.LocalizationManager.Get("Screen") + " " + (self.subjectSession.Progress.CurrentState.CurrentScreen + 1), 'top');
                    }, '<i class="fas fa-fast-backward"></i>', ["btnCircle"], Framework.LocalizationManager.Get("GoToFirstScreenTooltip"));
                    btnGoToFirstScreen.HtmlElement.style.cssFloat = "left";

                    let btnGoToPreviousScreen = Framework.Form.Button.Create(() => { return true; }, () => {
                        reader.GoToPreviousScreenAsPanelLeader();
                        self.btnInfo.HighlightOn(Framework.LocalizationManager.Get("Screen") + " " + (self.subjectSession.Progress.CurrentState.CurrentScreen + 1), 'top');
                    }, '<i class="fas fa-step-backward"></i>', ["btnCircle"], Framework.LocalizationManager.Get("GoToPreviousScreenTooltip"));
                    btnGoToPreviousScreen.HtmlElement.style.cssFloat = "left";

                    let btnGoToNextScreen = Framework.Form.Button.Create(() => { return true; }, () => {
                        reader.GoToNextScreenAsPanelLeader();
                        self.btnInfo.HighlightOn(Framework.LocalizationManager.Get("Screen") + " " + (self.subjectSession.Progress.CurrentState.CurrentScreen + 1), 'top');
                    }, '<i class="fas fa-step-forward"></i>', ["btnCircle"], Framework.LocalizationManager.Get("GoToNextScreenTooltip"));
                    btnGoToNextScreen.HtmlElement.style.cssFloat = "left";

                    let btnGoToLastScreen = Framework.Form.Button.Create(() => { return true; }, () => {
                        reader.GoToLastScreenAsPanelLeader();
                        self.btnInfo.HighlightOn(Framework.LocalizationManager.Get("Screen") + " " + (self.subjectSession.Progress.CurrentState.CurrentScreen + 1), 'top');
                    }, '<i class="fas fa-fast-forward"></i>', ["btnCircle"], Framework.LocalizationManager.Get("GoToLastScreenTooltip"));
                    btnGoToLastScreen.HtmlElement.style.cssFloat = "left";

                    //let btnSubject = Framework.Form.Button.Create(() => { return true; }, () => {
                    //    //TODO
                    //    reader.ChangeSubject("");
                    //}, '<i class="fas fa-users"></i>', ["btnCircle"], Framework.LocalizationManager.Get("ChnageSubject"));

                    let btnExit = Framework.Form.Button.Create(() => { return true; }, () => {

                        if (self.readerState.IsInSimulation == true) {
                            // Suppression des lignes de plans de présentation créés à la volée
                            self.subjectSession.ListExperimentalDesigns
                                .filter(x => { return x.CanAddItem == true })
                                .forEach(x => {
                                    x.ListExperimentalDesignRows = [];
                                });
                        }

                        self.mw.Close();
                    }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Exit"));

                    //TODO : améliorer design
                    self.btnInfo = Framework.Form.Button.Create(() => { return true; }, () => {
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

            }
        }

        export class ModalLoginViewModel extends PanelLeaderModalViewModel {

            private isOnline: boolean = true;

            public OnConnectivityChanged(isOnline: boolean) {
                this.isOnline = isOnline;
            }

            private inputLoginId: Framework.Form.InputText;
            private inputLoginPassword: Framework.Form.InputText;
            private divLoginError: Framework.Form.TextElement
            private btnLogin: Framework.Form.ClickableElement;

            public get InputLoginId() { return this.inputLoginId }
            public get InputLoginPassword() { return this.inputLoginPassword }
            public get DivLoginError() { return this.divLoginError }
            public get BtnLogin() { return this.btnLogin }

            public Login: (login: string, password: string, onSuccess: () => void, onError: (error: string) => void) => void;

            constructor(mw: Framework.Modal.Modal, login: string, password: string) {
                super(mw);

                let self = this;

                this.inputLoginId = Framework.Form.InputText.Register("inputLoginId", "", Framework.Form.Validator.MinLength(4), () => {
                    self.btnLogin.CheckState();
                }, true);
                this.inputLoginPassword = Framework.Form.InputText.Register("inputLoginPassword", "", Framework.Form.Validator.MinLength(4), () => {
                    self.btnLogin.CheckState();
                }, true);
                this.divLoginError = Framework.Form.TextElement.Register("divLoginError");

                this.btnLogin = Framework.Form.Button.Create(() => {
                    return self.isOnline == true && self.inputLoginId.IsValid && self.inputLoginPassword.IsValid;
                }, () => {
                    self.Login(self.inputLoginId.Value, self.inputLoginPassword.Value, () => { self.mw.Close(); }, (e) => {
                        self.divLoginError.SetHtml(e);
                        self.divLoginError.Show();
                    });
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Login"));

                this.inputLoginId.Set(login);
                this.inputLoginPassword.Set(password);

                this.mw.AddButton(this.btnLogin);

                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { self.btnLogin.Click(); });

            }

            public OnError(error: string) {
                this.divLoginError.Set(error);
                this.divLoginError.Show();
            }

        }

        export class ModalSessionWizardViewModel extends PanelLeaderModalViewModel {

            private divModel: Framework.Form.TextElement;
            private divModelContent: Framework.Form.TextElement;
            private divProtocol: Framework.Form.TextElement;
            private divProtocolContent: Framework.Form.TextElement;
            private divScreens: Framework.Form.TextElement;
            private divScreensContent: Framework.Form.TextElement;
            private divCommonScreenOptions: Framework.Form.TextElement;
            private divScreenSelection: Framework.Form.TextElement;
            private divScreenList: Framework.Form.TextElement;

            private btnSessionWizardComplete: Framework.Form.Button;
            private btnSessionWizardTemplate: Framework.Form.Button;
            private btnSessionWizardProtocol: Framework.Form.Button;
            private btnSessionWizardScreens: Framework.Form.Button;

            public ShowModalSessionTemplateDB: (onLoaded: (session: PanelLeaderModels.Session) => void) => void;
            public SaveSession: (session: PanelLeaderModels.Session) => void;
            public UploadSession: (session: PanelLeaderModels.Session, onUploaded: () => void) => void;

            private cards: Framework.Form.Card[] = [];
            private subjectsPropertyEditor: Framework.Form.PropertyEditorWithNumericUpDown;

            private selectedTemplate: PanelLeaderModels.TemplatedSession = new PanelLeaderModels.TemplatedSession("", "", "", [], []);

            public CreateNewSessionFromTemplate: (template: PanelLeaderModels.TemplatedSession) => void;

            public get BtnSessionWizardTemplate() {
                return this.btnSessionWizardTemplate;
            }

            public get BtnSessionWizardProtocol() {
                return this.btnSessionWizardProtocol;
            }

            public get BtnSessionWizardScreens() {
                return this.btnSessionWizardScreens;
            }

            public get BtnSessionWizardComplete() {
                return this.btnSessionWizardComplete;
            }

            public get Cards() {
                return this.cards;
            }

            public get SubjectsPropertyEditor() {
                return this.subjectsPropertyEditor;
            }

            public get SelectedTemplate() {
                return this.selectedTemplate;
            }

            constructor(mw: Framework.Modal.Modal) {
                super(mw);
                let self = this;

                this.divModel = Framework.Form.TextElement.Register("divModel");
                this.divModelContent = Framework.Form.TextElement.Register("divModelContent");
                this.divProtocol = Framework.Form.TextElement.Register("divProtocol");
                this.divProtocolContent = Framework.Form.TextElement.Register("divProtocolContent");
                this.divScreens = Framework.Form.TextElement.Register("divScreens");
                this.divScreensContent = Framework.Form.TextElement.Register("divScreensContent");
                this.divCommonScreenOptions = Framework.Form.TextElement.Register("divCommonScreenOptions");
                this.divScreenList = Framework.Form.TextElement.Register("wizardScreenList");
                this.divScreenSelection = Framework.Form.TextElement.Register("divScreenSelection");

                this.btnSessionWizardTemplate = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    self.showDivModel();
                }, "", ["btnCircle"]);

                this.btnSessionWizardProtocol = Framework.Form.Button.Create(() => {
                    return self.selectedTemplate.Id != "";
                }, () => {
                    self.showDivProtocol();
                }, "", ["btnCircle"]);

                this.btnSessionWizardScreens = Framework.Form.Button.Create(() => {
                    let res = self.selectedTemplate.NbSubjects > 0;
                    self.selectedTemplate.ListExperimentalDesigns.forEach((x) => {
                        res = res && x.ListItems.length > 0;
                    })
                    return res;
                }, () => {
                    self.showDivScreens();
                }, "", ["btnCircle"]);

                this.btnSessionWizardComplete = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    self.CreateNewSessionFromTemplate(self.selectedTemplate);
                    self.mw.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Complete"));

                this.hideDivAndButtons();
                this.showDivModel();

                this.mw.AddButton(this.btnSessionWizardTemplate);
                this.mw.AddButton(this.btnSessionWizardProtocol);
                this.mw.AddButton(this.btnSessionWizardScreens);
                this.mw.AddButton(this.btnSessionWizardComplete);

                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});
            }

            private hideDivAndButtons() {
                this.btnSessionWizardComplete.Hide();
                this.btnSessionWizardProtocol.Hide();
                this.btnSessionWizardScreens.Hide();
                this.btnSessionWizardTemplate.Hide();
                this.divProtocol.Hide();
                this.divScreens.Hide();
                this.divModel.Hide();
            }

            private showDivModel() {

                let self = this;

                if (this.mw) {
                    this.mw.SetTitle(Framework.LocalizationManager.Get("SessionWizard") + " " + Framework.LocalizationManager.Get("SelectTemplate"));
                }

                this.selectedTemplate = new PanelLeaderModels.TemplatedSession("", "", "", [], []);
                this.hideDivAndButtons();

                this.divModelContent.HtmlElement.innerHTML = "";
                let templates = PanelLeaderModels.TemplatedSession.GetTemplates();

                this.cards = [];

                templates.forEach((x) => {

                    let card = Framework.Form.Card.Create(Framework.LocalizationManager.Get(x.LabelKey), Framework.LocalizationManager.Get(x.DescriptionKey), () => {
                        self.selectedTemplate = x;
                        let index = 1;
                        x.Screens.forEach((x) => {
                            x.Id = index;
                            index++;
                        });

                        self.cards.forEach((c) => {
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
            }

            private showDivProtocol() {

                let self = this;

                this.mw.SetTitle(Framework.LocalizationManager.Get("SessionWizard") + " " + Framework.LocalizationManager.Get("SelectProtocol"));

                this.hideDivAndButtons();
                this.btnSessionWizardTemplate.SetInnerHTML('<i class="fas fa-arrow-left"></i>');
                this.btnSessionWizardTemplate.Show();
                this.btnSessionWizardScreens.SetInnerHTML('<i class="fas fa-arrow-right"></i>');
                this.btnSessionWizardScreens.Show();
                this.divProtocol.Show();

                this.divProtocolContent.HtmlElement.innerHTML = "";

                if (this.selectedTemplate.Id == "XlsxSession") {

                    self.ShowModalSessionTemplateDB((session: PanelLeaderModels.Session) => {

                        // création de la séance
                        let newSession: PanelLeaderModels.Session = new PanelLeaderModels.Session();

                        let productDesign = session.ListExperimentalDesigns.filter(x => { return x.Type == "Product" })[0];
                        let attributeDesign = session.ListExperimentalDesigns.filter(x => { return x.Type == "Attribute" })[0];

                        session.ListScreens.forEach(screen => {
                            newSession.ListScreens.push(screen);
                        });

                        // Lecture du fichier excel
                        Framework.FileHelper.BrowseFile(".xlsx", (file: File) => {
                            var fileReader: FileReader = new FileReader();
                            fileReader.onload = function (e) {
                                if (!e) {
                                    var data = (<any>fileReader).content;
                                }
                                else {
                                    var data = (<any>e.target).result;
                                }

                                var workbook = XLSX.read(data, {
                                    type: 'binary'
                                });

                                let subjects: Models.Subject[] = [];
                                let subjectCodes: string[] = [];

                                workbook.SheetNames.forEach(function (sheetName) {
                                    let importedObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                    if (sheetName == "subjects") {
                                        importedObject.forEach(x => {
                                            let subject: Models.Subject = new Models.Subject();
                                            subject.Code = x.code;
                                            subjects.push(subject);
                                            subjectCodes.push(x.code);
                                        });
                                        newSession.AddNewPanelists(subjects);
                                    }
                                    if (sheetName == "products") {
                                        let items: Models.ExperimentalDesignItem[] = [];
                                        importedObject.forEach(x => {
                                            let labels: Framework.KeyValuePair[] = [];
                                            let values = Object.keys(x);
                                            for (let i = 1; i < values.length; i++) {
                                                labels.push(new Framework.KeyValuePair(i, x[values[i]]));
                                            }
                                            let item: Models.ExperimentalDesignItem = new Models.ExperimentalDesignItem();
                                            item.Code = x.code;
                                            item.Labels = labels;
                                            items.push(item);
                                        });
                                        let newProductDesign = Models.ExperimentalDesign.Create("Product", productDesign.Id, subjectCodes, productDesign.Order, items[0].Labels.length, items)
                                        newSession.AddNewDesign(newProductDesign);

                                    }
                                    if (sheetName == "attributes") {
                                        let items: Models.ExperimentalDesignItem[] = [];
                                        importedObject.forEach(x => {
                                            let labels: Framework.KeyValuePair[] = [];
                                            let item: Models.ExperimentalDesignItem = new Models.ExperimentalDesignItem();
                                            item.Code = x.code;
                                            item.LongName = x.label;
                                            //item.Description = x.label;
                                            labels.push(new Framework.KeyValuePair(1, x.label));
                                            item.Labels = labels;
                                            items.push(item);
                                        });
                                        let newAttributeDesign = Models.ExperimentalDesign.Create("Attribute", attributeDesign.Id, subjectCodes, attributeDesign.Order, items[0].Labels.length, items);
                                        newSession.AddNewDesign(newAttributeDesign);

                                    }

                                    //PanelLeaderModels.Session.ApplyStyleS(newSession.DefaultScreenOptions.DefaultStyle, newSession);
                                })

                                self.UploadSession(newSession, () => {
                                    self.SaveSession(newSession);
                                    self.mw.Close();
                                })

                            };
                            fileReader.readAsBinaryString(file);
                        });

                    });

                    return;
                }

                // Nombre de juges       
                let titleDiv = Framework.Form.TextElement.Create('<i class="fas fa-caret-right" > </i> ' + Framework.LocalizationManager.Get("Panelists"));
                this.divProtocolContent.Append(titleDiv);

                this.subjectsPropertyEditor = Framework.Form.PropertyEditorWithNumericUpDown.Render("", "NbSubjects", 1, 1, 200, (x) => {
                    self.selectedTemplate.NbSubjects = x;
                }, 1);
                this.subjectsPropertyEditor.SetPropertyKeyMaxWidth(400);

                this.divProtocolContent.Append(this.subjectsPropertyEditor.Editor);

                // Propriétés des plans d'expérience
                this.selectedTemplate.ListExperimentalDesigns.forEach((x) => {
                    let titleDiv = Framework.Form.TextElement.Create('<i class="fas fa-caret-right" > </i> ' + Framework.LocalizationManager.Get("ExperimentalDesign") + " '" + Framework.LocalizationManager.Get(x.Name) + "'");
                    self.divProtocolContent.Append(titleDiv);
                    titleDiv.HtmlElement.style.marginTop = "15px";

                    //x.AddItem();

                    let listDesignsPropertyEditor: Framework.Form.PropertyEditor[] = x.GetProperties(self.selectedTemplate.ListExperimentalDesigns.map((x) => { return x.Name; }), false, () => {
                        x.AddItem();
                        self.btnSessionWizardScreens.CheckState();
                    });

                    listDesignsPropertyEditor.forEach((option) => {
                        option.Group = x.Name;
                        self.divProtocolContent.Append(option.Editor);
                        option.SetPropertyKeyMaxWidth(400);
                    });
                });



                this.btnSessionWizardScreens.CheckState();

            }

            private showDivScreens() {

                let self = this;

                this.mw.SetTitle(Framework.LocalizationManager.Get("SessionWizard") + " " + Framework.LocalizationManager.Get("SelectScreens"));

                this.hideDivAndButtons();
                this.btnSessionWizardProtocol.SetInnerHTML('<i class="fas fa-arrow-left"></i>');
                this.btnSessionWizardProtocol.Show();
                this.btnSessionWizardComplete.Show();
                this.divScreens.Show();

                this.divScreenSelection.HtmlElement.innerHTML = "";
                this.divCommonScreenOptions.HtmlElement.innerHTML = "";


                let formProperties = PanelLeaderModels.DefaultScreenOptions.GetForm(self.selectedTemplate.DefaultScreenOptions, (changedValue: string, options: PanelLeaderModels.DefaultScreenOptions) => {
                    self.selectedTemplate.DefaultScreenOptions = options;
                    self.setOverview();
                });

                formProperties.forEach((x) => {
                    self.divCommonScreenOptions.Append(x.Editor);
                });

                let index = 1;
                this.selectedTemplate.Screens.forEach((screen) => {

                    let spanCss = "fa-sliders-h";
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


                    let select = Framework.Form.Select.Render(screen.SelectedScreen, Framework.KeyValuePair.FromArray(screen.Screens.map((x) => { return x.Name }), true), Framework.Form.Validator.NotEmpty(), (x) => {
                        screen.SelectedScreen = x;
                        //if (x.substring(0, 2) == "No") {
                        //    self.selectedMiniatureId = self.selectedTemplate.Screens.filter((x) => { return x.SelectedScreen.substring(0, 2) != "No" })[0].Id;
                        //}
                        self.setOverview();
                    }, false, ["form-control"]);
                    select.HtmlElement.style.width = "400px";

                    let div = Framework.Form.ControlWithLabel.Render(select, undefined, spanCss);

                    self.divScreenSelection.Append(div.Element);
                    index++;
                });


                self.setOverview();
            }

            private setOverview() {
                let self = this;

                this.divScreenList.HtmlElement.innerHTML = "";

                let session = PanelLeaderModels.Session.FromTemplate(this.selectedTemplate);

                let divMiniatures = document.createElement("div");

                divMiniatures.style.height = "65vh";
                divMiniatures.style.width = "430px";
                divMiniatures.style.overflowY = "auto";
                divMiniatures.style.overflowX = "hidden";
                this.divScreenList.HtmlElement.appendChild(divMiniatures);

                let selectedScreens = this.selectedTemplate.Screens.filter((x) => { return x.SelectedScreen.substr(0, 2) != 'No' });

                for (var i = 0; i < session.ListScreens.length; i++) {
                    let screen = Framework.Factory.CreateFrom(Models.Screen, session.ListScreens[i]);
                    let miniature = screen.RenderAsMiniature(i, divMiniatures.clientWidth - 5, session.ListExperimentalDesigns, (x) => {
                    });
                    divMiniatures.appendChild(miniature.Div);

                    let div = document.createElement("div");
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

                    let b1 = Framework.Form.Button.Create(() => { return true; }, (btn) => {
                        let index = Number(btn.HtmlElement.getAttribute("index"));

                        // Options               
                        let templatedScreen = selectedScreens[index];

                        let options = templatedScreen.Screens.filter((y) => { return y.Name == templatedScreen.SelectedScreen })[0].GetOptions();
                        if (options.length > 0) {

                            let div = document.createElement("div");

                            let groups: Framework.Dictionary.Dictionary = new Framework.Dictionary.Dictionary();

                            options.forEach((option) => {
                                if (groups.Get(option.Group) == undefined) {
                                    let accordion = Framework.Form.Accordion.Create(Framework.LocalizationManager.Get(option.Group), ["propertyHeader"]);
                                    div.appendChild(accordion.HtmlElement);
                                    groups.Add(option.Group, accordion);
                                }
                                groups.Get(option.Group).HtmlElement.appendChild(option.Editor.HtmlElement);
                                option.SetPropertyKeyMaxWidth(400);
                                option.OnCheck = () => {
                                    validateForm();
                                }
                            });

                            let errorDiv = document.createElement("div");
                            div.appendChild(errorDiv);


                            let validateForm = () => {

                                let validationResult = "";
                                for (let i = 0; i < options.length; i++) {
                                    if (options[i].IsVisible == true && options[i].ValidationResult != "") {
                                        validationResult += options[i].ValidationResult + "\n";
                                    }
                                }

                                errorDiv.classList.remove("alert");
                                errorDiv.classList.remove("alert-danger");
                                errorDiv.innerHTML = "";
                                if (validationResult.length > 0) {
                                    errorDiv.classList.add("alert");
                                    errorDiv.classList.add("alert-danger");
                                    errorDiv.innerHTML = validationResult;
                                    modal.ConfirmButton.Disable();
                                } else {
                                    modal.ConfirmButton.Enable();
                                }
                            }

                            let modal = Framework.Modal.Confirm(Framework.LocalizationManager.Get("Options"), div, () => {
                                self.setOverview();
                            });

                            validateForm();




                        }
                    }, '<i class="fas fa-cog"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Options"));
                    div.appendChild(b1.HtmlElement);
                    b1.HtmlElement.setAttribute("index", i.toString());

                }

            }

        }

        export class DataViewModel extends PanelLeaderViewModel {

            //TODO : import : enlever champ si choisi dans liste
            //TODO : affichage colonne supp : data.status, datetime
            //TODO : TDL
            //TODO : JDD avec tous les types de donénes
            //TODO : statut des données et couleur différente
            //TODO : merge columns

            //private btnInsertData: Framework.Form.Button;
            private btnDeleteData: Framework.Form.Button;

            //private btnImportData: Framework.Form.Button;
            //private btnExportData: Framework.Form.Button;
            private btnExportAllData: Framework.Form.Button;
            //private btnShowPivot: Framework.Form.Button;
            //private btnToggleDataView: Framework.Form.Button;
            //private btnShowAnalysis: Framework.Form.Button;
            //private btnShowDataTransformation: Framework.Form.Button;
            //private btnTest: Framework.Form.Button;

            //private dataTableData: Framework.Form.DataTable;
            public TableData: Framework.Form.Table<any>;

            private divTableData: Framework.Form.TextElement;

            private selectedSheetName: string;

            private displayFormat: string = "canonical";

            private sessionData: Models.Data[]; // Toutes les données

            private tabButtons: Framework.Form.Button[];
            private tabNames: string[];

            private tabDiv: Framework.Form.TextElement;

            private selectedData: Models.Data[] = []; // Données sélectionnées dans le tableau
            private currentTabData: Models.Data[] = []; // Données de l'onglet actif

            public RemoveDataTab: (name: string) => void;
            public DeleteData: (data: Models.Data[]) => void;
            public ModifySelectionInData: (selectedData: Models.Data[], column: string, replace: string, copy: boolean) => void;
            public SearchAndReplaceData: (selectedData: Models.Data[], column: string, search: string, replace: string, copy: boolean) => void;
            public TransformScoresInRanks: (selectedData: Models.Data[], copy: boolean) => void;
            public TransformScores: (selectedData: Models.Data[], copy: boolean, transformation: string) => void;
            public TransformScoresInMeans: (selectedData: Models.Data[], copy: boolean, variable: string) => void;
            public TransformReplicatesInIntakes: (selectedData: Models.Data[], copy: boolean) => void;
            public TransformSessionsInReplicates: (selectedData: Models.Data[], copy: boolean) => void;
            public MoveSelectionToAnotherTab: (selectedData: Models.Data[], newTab: string, deleteAfterCopy: boolean) => void;
            public AddDataTab: () => void;
            public AddData: (sheetName: string, dType: string) => void;
            public ShowModalAnalysis: (listData: Models.Data[]) => void;
            public OnDataChanged: (data: Models.Data, propertyName: string, oldValue: any, newValue: any) => void;
            public ShowModalImportData: (datatype: string) => void;
            public FeelingAnalysis: (selectedData: Models.Data[], copy: boolean) => void;

            private isOnline: boolean = true;

            public OnConnectivityChanged(isOnline: boolean) {
                this.isOnline = isOnline;
                //this.btnShowAnalysis.CheckState();
            }

            private setDataTable() {

                let self = this;

                this.divTableData.HtmlElement.innerHTML = "";

                this.currentTabData = this.sessionData.filter((x) => { return x.SheetName == self.selectedSheetName; });

                if (this.currentTabData.length > 0) {

                    let selectedDataType = Models.Data.GetType(this.currentTabData[0]);
                    
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

                        this.TableData.OnDataUpdated = (data: Models.Data, propertyName: string, oldValue: any, newValue: any) => {
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

                    this.TableData.OnSelectionChanged = (sel) => {
                        self.selectedData = sel;
                        self.btnDeleteData.CheckState();
                    };

                    this.TableData.Render(this.divTableData.HtmlElement);

                }
            }

            constructor(listData: Models.Data[], tabs: string[]) {
                super();
                let self = this;
                this.sessionData = listData;

                this.tabDiv = Framework.Form.TextElement.Register("sheetTabsDiv");

                //this.btnInsertData = Framework.Form.Button.Register("btnInsertData", () => { return true; }, () => {
                //    let dtype = "";
                //    if (self.TableData.ListData.length > 0) {
                //        dtype = self.TableData.ListData[0].Type;
                //    }

                //    self.AddData(self.selectedSheetName, dtype);
                //});

                this.btnDeleteData = Framework.Form.Button.Register("btnDeleteData", () => { return self.TableData && self.TableData.SelectedData.length > 0; }, () => {
                    let mw: Framework.Modal.Modal = Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveTheSelection"), () => {
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

                this.btnExportAllData = Framework.Form.Button.Register("btnExportAllData", () => {
                    return true;
                }, () => {
                    let wb = new Framework.ExportManager("", "", "");
                    self.tabNames.forEach(tab => {
                        let data = self.sessionData.filter((x) => { return x.SheetName == tab; });
                        if (data.length > 0) {
                            let datatable = Models.Data.GetDataTable(data);
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

                this.divTableData = Framework.Form.TextElement.Register("divTableData");


                this.tabNames = tabs;

                this.setTabs();

                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});

            }

            private setTabs() {

                let self = this;

                this.tabDiv.HtmlElement.innerHTML = "";

                this.tabButtons = [];

                this.tabNames.forEach((x) => {
                    let button: Framework.Form.Button = Framework.Form.Button.Create(() => { return true; }, (b) => {
                        self.selectedSheetName = b.CustomAttributes.Get("SheetName");
                        self.setDataTable();
                        self.tabButtons.forEach((y) => { y.HtmlElement.classList.remove("selected"); });
                        b.HtmlElement.classList.add("selected");
                    }, Framework.LocalizationManager.Get(x), ["expDesignButton"]);
                    button.CustomAttributes.Add("SheetName", x);
                    self.tabDiv.Append(button);
                    this.tabButtons.push(button);
                });

                if (this.tabButtons.length > 0) {
                    this.tabButtons[this.tabButtons.length - 1].Click();
                }

                //let button: Framework.Form.Button = Framework.Form.Button.Create(() => { return true; }, () => {
                //    self.AddDataTab();

                //}, '<span><i class="fas fa-plus"></i></span>&nbsp;' + Framework.LocalizationManager.Get("NewTab"), ["expDesignButton"]);
                //self.tabDiv.Append(button);
            }

            public Update() {
                this.setTabs();
            }

            private getUpdateSelectionDiv(): HTMLDivElement {

                let self = this;

                let div = document.createElement("div");

                //TODO : proposer dans onglet actuel ou nouvel onglet

                let b0 = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    self.showRenameTab();
                }, Framework.LocalizationManager.Get("RenameTab"), ["popupEditableProperty"]);
                div.appendChild(b0.HtmlElement);

                let b1 = Framework.Form.Button.Create(() => {
                    return Framework.Array.Unique(self.currentTabData.map((x) => { return x.Session })).length > 1;
                }, () => {
                    self.showTransformSessionsInReplicates();
                }, Framework.LocalizationManager.Get("TransformSessionsInReplicates"), ["popupEditableProperty"]);
                div.appendChild(b1.HtmlElement);

                let b2 = Framework.Form.Button.Create(() => {
                    return Framework.Array.Unique(self.currentTabData.map((x) => { return x.Replicate })).length > 1;
                }, () => {
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

                let b6 = Framework.Form.Button.Create(() => {
                    return Framework.Array.Unique(self.currentTabData.map((x) => { return x.Score })).length > 1;
                }, () => {
                    self.showTransformScores();
                }, Framework.LocalizationManager.Get("TransformScores"), ["popupEditableProperty"]);
                div.appendChild(b6.HtmlElement);

                let b4 = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
                    //TODO : nouvel onglet ou remplacer les données
                }, Framework.LocalizationManager.Get("AverageScores"), ["popupEditableProperty"]);
                div.appendChild(b4.HtmlElement);

                let b5 = Framework.Form.Button.Create(() => {
                    return self.currentTabData.length > 0;
                }, () => {
                    self.showSearchReplace();
                }, Framework.LocalizationManager.Get("SearchReplace"), ["popupEditableProperty"]);
                div.appendChild(b5.HtmlElement);

                let b7 = Framework.Form.Button.Create(() => {
                    return self.selectedData.length > 0;
                }, () => {
                    self.showModifySelection();
                }, Framework.LocalizationManager.Get("ModifySelection"), ["popupEditableProperty"]);
                div.appendChild(b7.HtmlElement);

                let b8 = Framework.Form.Button.Create(() => {
                    return self.selectedData.length > 0;
                }, () => {
                    self.showMoveSelectionToAnotherTab();
                }, Framework.LocalizationManager.Get("CopySelectionToAnotherTab"), ["popupEditableProperty"]);
                div.appendChild(b8.HtmlElement);

                let b10 = Framework.Form.Button.Create(() => { return true; }, () => {
                    Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureYouWantToRemoveTheTab"), () => {
                        self.RemoveDataTab(self.selectedSheetName);
                        self.setTabs();
                    });

                }, Framework.LocalizationManager.Get("DeleteTab"), ["popupEditableProperty"]);
                div.appendChild(b10.HtmlElement);

                let b11 = Framework.Form.Button.Create(() => {
                    // Commentaire libre
                    //TODO return self.selectedData.length > 0 && self.selectedData[0].Type == "FreeTextQuestiocControl";                    
                    return true;
                }, () => {
                    self.FeelingAnalysis(self.currentTabData, true);
                }, Framework.LocalizationManager.Get("FeelingAnalysis"), ["popupEditableProperty"]);
                div.appendChild(b11.HtmlElement);

                return div;
            }

            private showTransformForm(title: string, onConfirm: (copyInNewTab: boolean) => void, controls: Framework.Form.PropertyEditor[] = []) {
                let copyInNewTab: boolean = true;
                let self = this;
                let div: HTMLDivElement = document.createElement("div");

                controls.forEach((x) => {
                    div.appendChild(x.Editor.HtmlElement);
                });

                let checkbox = Framework.Form.PropertyEditorWithToggle.Render("", "CopyInANewTab", copyInNewTab, (x) => {
                    copyInNewTab = x;
                });
                div.appendChild(checkbox.Editor.HtmlElement);

                Framework.Modal.Confirm(title, div, () => {
                    onConfirm(copyInNewTab);
                    if (copyInNewTab == true) {
                        self.setTabs();
                    }
                    self.setDataTable();
                });
            }

            private showModifySelection() {
                let self = this;

                let column: string = "";
                let replace: string = "";
                let colNames = self.TableData.ListColumns.map((x) => { return new Framework.KeyValuePair(x.Name, x.Title) });

                let select = Framework.Form.PropertyEditorWithPopup.Render("", "Column", "", colNames.map((x) => { return x.Key }), (x) => {
                    column = colNames.filter((c) => { return c.Key == x })[0].Value;
                }, true);

                let input2 = Framework.Form.PropertyEditorWithTextInput.Render("", "ReplacementValue", "", (x) => {
                    replace = x;
                }, Framework.Form.Validator.MinLength(1));

                this.showTransformForm(Framework.LocalizationManager.Get("ModifySelection"), (copyInNewTab: boolean) => {
                    if (column.length > 0 && replace.length > 0) {
                        //TODO : état du bouton OK en fonction de ça
                        self.ModifySelectionInData(self.currentTabData, column, replace, copyInNewTab);
                    }
                }, [select, input2]);
            }

            private showSearchReplace() {
                let self = this;

                let column: string = "";
                let search: string = "";
                let replace: string = "";
                let colNames = self.TableData.ListColumns.map((x) => { return new Framework.KeyValuePair(x.Name, x.Title) });

                let select = Framework.Form.PropertyEditorWithPopup.Render("", "Column", "", colNames.map((x) => { return x.Key }), (x) => {
                    column = colNames.filter((c) => { return c.Key == x })[0].Value;
                }, true);

                let input1 = Framework.Form.PropertyEditorWithTextInput.Render("", "SearchValue", "", (x) => {
                    search = x;
                }, Framework.Form.Validator.MinLength(1));

                let input2 = Framework.Form.PropertyEditorWithTextInput.Render("", "ReplacementValue", "", (x) => {
                    replace = x;
                }, Framework.Form.Validator.MinLength(1));

                this.showTransformForm(Framework.LocalizationManager.Get("SearchReplace"), (copyInNewTab: boolean) => {
                    if (column.length > 0 && search.length > 0 && replace.length > 0) {
                        //TODO : état du bouton OK en fonction de ça
                        self.SearchAndReplaceData(self.currentTabData, column, search, replace, copyInNewTab);
                    }
                }, [select, input1, input2]);
            }

            private showTransformScores() {
                let self = this;

                let transformation: string = "";
                let options = ["Rank", "Log", "Sqrt"];
                if (Framework.Array.Unique(this.currentTabData.map((x) => { return x.Session })).length > 0) {
                    options.push("AverageOverSessions");
                }
                if (Framework.Array.Unique(this.currentTabData.map((x) => { return x.Replicate })).length > 0) {
                    options.push("AverageOverReplicates");
                }
                if (Framework.Array.Unique(this.currentTabData.map((x) => { return x.Intake })).length > 0) {
                    options.push("AverageOverIntakes");
                }
                let select = Framework.Form.PropertyEditorWithPopup.Render("", "Transformation", "", options, (x) => {
                    transformation = x;
                }, true);

                this.showTransformForm(Framework.LocalizationManager.Get("TransformScores"), (copyInNewTab: boolean) => {
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
            }

            private showTransformReplicatesInIntakes() {
                let self = this;
                this.showTransformForm(Framework.LocalizationManager.Get("TransformReplicatesInIntakes"), (copyInNewTab: boolean) => {
                    self.TransformReplicatesInIntakes(self.currentTabData, copyInNewTab);
                });
            }

            private showTransformSessionsInReplicates() {
                let self = this;
                this.showTransformForm(Framework.LocalizationManager.Get("TransformSessionsInReplicates"), (copyInNewTab: boolean) => {
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
            }

            private showMoveSelectionToAnotherTab() {
                let newTab: string = Framework.LocalizationManager.Get("NewTab");
                let deleteAfterCopy: boolean = false;
                let self = this;
                let div: HTMLDivElement = document.createElement("div");
                let select = Framework.Form.PropertyEditorWithPopup.Render("", "NewTab", newTab, self.tabNames, (x) => {
                    newTab = x;
                }, true);
                div.appendChild(select.Editor.HtmlElement);
                let checkbox = Framework.Form.PropertyEditorWithToggle.Render("", "DeleteFromCurrentTabAfterCopy", deleteAfterCopy, (x) => {
                    deleteAfterCopy = x;
                });
                div.appendChild(checkbox.Editor.HtmlElement);

                Framework.Modal.Confirm(Framework.LocalizationManager.Get("RenameTab"), div, () => {
                    self.MoveSelectionToAnotherTab(self.selectedData, newTab, deleteAfterCopy);
                    //if (deleteAfterCopy == false) {
                    //    self.setTabs();
                    //}
                    self.setDataTable();
                });
            }

            private showRenameTab() {

                let self = this;

                let div = document.createElement("div");

                let newName: string = undefined;

                let input = Framework.Form.InputText.Create(this.selectedSheetName, (x) => {
                    newName = x;
                }, Framework.Form.Validator.Unique(this.tabNames), false);
                div.appendChild(input.HtmlElement);

                Framework.Modal.Confirm(Framework.LocalizationManager.Get("EnterNewName"), div, () => {
                    if (newName) {
                        let index = self.tabNames.indexOf(self.selectedSheetName);
                        self.tabNames[index] = newName;
                        self.selectedSheetName = newName;
                        self.MoveSelectionToAnotherTab(self.currentTabData, newName, true);
                        //self.setTabs();
                    }
                });
            }

            public SetLock(isLocked: boolean) {
                this.isLocked = true;
                //this.btnImportData.CheckState();
                //this.btnExportData.CheckState();
                //this.btnShowPivot.CheckState();
                //this.btnToggleDataView.CheckState();
                //this.btnShowAnalysis.CheckState();

                if (this.isLocked == true) {
                    this.TableData.Disable();
                } else {
                    this.TableData.Enable();
                }
            }

        }

        export class ModalSaveAnalysisAsTemplateViewModel extends PanelLeaderModalViewModel {

            constructor(mw: Framework.Modal.Modal, templateNames: string[], onConfirm: (label: string, description: string) => void) {

                super(mw);
                let self = this;

                let div = Framework.Form.TextElement.Create();

                let textName = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("TemplateName"), ["inlineInput"]);
                div.Append(textName);

                let customValidatorTemplateName: Framework.Form.Validator.CustomValidator = Framework.Form.Validator.Custom((value: any) => {
                    let res = "";

                    if (value.length < 6) {
                        res = Framework.LocalizationManager.Get("TemplateNameMin6Characters");
                    }

                    if (templateNames.indexOf(value) > -1) {
                        res = Framework.LocalizationManager.Get("TemplateNameAlreayExists");
                    }

                    return res;
                });

                let inputName = Framework.Form.InputText.Create("", () => {
                    okButton.CheckState();
                }, customValidatorTemplateName, true, ["inlineInput"]);
                div.Append(inputName);

                let textDescription = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("Description"), ["inlineInput"]);
                div.Append(textDescription);

                let inputDescription = Framework.Form.InputText.Create("", () => {
                    okButton.CheckState();
                }, Framework.Form.Validator.MinLength(6), true, ["inlineInput"]);
                div.Append(inputDescription);

                mw.Body.appendChild(div.HtmlElement);

                let cancelButton = Framework.Form.Button.Create(() => { return true; }, () => { mw.Close(); }, Framework.LocalizationManager.Get("Cancel"), ["btnCircle"]);
                let okButton = Framework.Form.Button.Create(() => {
                    return inputName.IsValid && inputDescription.IsValid;
                }, () => {
                    onConfirm(inputName.Value, inputDescription.Value);
                    mw.Close();
                }, Framework.LocalizationManager.Get("OK"), ["btnCircle"]);

                //TODO
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { okButton.Click(); });
            }

        }

        export class ModalAnalysisViewModel extends PanelLeaderModalViewModel {

            //TODO : nom du fichier, mémorisation des outputs, publication en tant que rapport
            //TODO : cancel analysis
            //TODO : vérification des paramètres impératifs saisis
            //TODO : blocage bouton analyse tant que analyse pas terminée
            //TODO : barre de progrès
            //TODO : css pour les outputs
            //TODO : copyright / info si version gratuite
            //TODO : fonction adminonly
            //TODO : replaceproducts

            public OnConnectivityChanged(isOnline: boolean) {
                //TODO
            }

            private divAnalysisDataSummary: Framework.Form.TextElement;
            private divPivot: Framework.Form.TextElement;
            //private divFunctionSelection: Framework.Form.TextElement;
            private pAnalysisMissingDataWarning: Framework.Form.TextElement;
            private divAnalysisMissingDataStrategy: Framework.Form.TextElement;
            private divAnalysisDataSelection: Framework.Form.TextElement;
            //private divAnalysisFunctionSelection: Framework.Form.TextElement;


            private listData: Models.Data[] = [];

            private btnShowReport: Framework.Form.Button;

            //private currentAnalysis: PanelLeaderModels.Analysis;

            //private memorizeAnalysis: boolean = false;
            //private language: string = "en";
            //private productLabels: string = "codes"; // codes ou labels
            //private attributeLabels: string = "codes"; // codes ou labels
            //private subjectLabels: string = "codes"; // codes ou names ou firstNames

            private missingDataActions: Framework.KeyValuePair[] = [
                { Value: "Ignore", Key: "IgnoreThisWarning" }, // Ignorer l'avertissement
                { Value: "Impute", Key: "ImputeMissingData" }// Imputer les données manquantes (moy juge + moyenne produit) / gmean -> state==completed                          
            ];

            //private variables: string[] = ["Replicate"]; //TODO : autres varaibles (age, sexe, question...), intake
            //private selectedVariables: string[];

            //private dataType: string;

            //private dataTypes: string[];
            //private templates: PanelLeaderModels.AnalysisTemplate[];

            //private report: Framework.DataReport.Report;

            //public RunAnalysis: (analysis: PanelLeaderModels.Analysis, language: string, dataType: string, listData: Models.Data[], callback: () => void, productLabels, attributeLabels, subjectLabels) => void;
            //public RemoveAnalysisTemplate: (template: PanelLeaderModels.AnalysisTemplate, callback: () => void) => void; //TODO
            //public ShowModalSaveAnalysisAsTemplate: (analysis: PanelLeaderModels.Analysis, onComplete: () => void) => void;
            public RServerLogin: string;
            public RServerPassword: string;
            public RServerWCFServiceURL: string;
            public RServerOnComplete: () => void;


            public ImputData: (listData: Models.Data[], save: boolean) => void;

            //private selectedFunctions: string[] = [];

            //TODO : choix du modèle d'analyse personnalisé ou analyse par défaut


            constructor(mw: Framework.Modal.Modal, listData: Models.Data[], dataTypes: string[]/*, templates: PanelLeaderModels.AnalysisTemplate[]*/) {
                super(mw);
                let self = this;

                this.mw.SetTitle(Framework.LocalizationManager.Get("Analysis"));

                this.listData = listData;
                //this.dataTypes = dataTypes;
                //this.templates = templates;

                this.divAnalysisDataSummary = Framework.Form.TextElement.Register("divAnalysisDataSummary");
                this.divAnalysisDataSelection = Framework.Form.TextElement.Register("divAnalysisDataSelection");
                //this.divAnalysisFunctionSelection = Framework.Form.TextElement.Register("divAnalysisFunctionSelection");
                this.divPivot = Framework.Form.TextElement.Register("divPivot");
                //this.divFunctionSelection = Framework.Form.TextElement.Register("divFunctionSelection");

                this.btnShowReport = Framework.Form.Button.Create(() => {
                    return true;
                }, () => {
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

                this.pAnalysisMissingDataWarning = Framework.Form.TextElement.Register("pAnalysisMissingDataWarning");
                this.divAnalysisMissingDataStrategy = Framework.Form.TextElement.Register("divAnalysisMissingDataStrategy");

                this.divPivot.HtmlElement.innerHTML = "";
                this.divAnalysisMissingDataStrategy.HtmlElement.innerHTML = "";

                // Diagnostic des données
                let datasetSummary = new PanelLeaderModels.DatasetSummary(this.listData);


                this.divAnalysisDataSummary.Append(datasetSummary.GetLogDiv());
                this.pAnalysisMissingDataWarning.Hide();
                this.divAnalysisMissingDataStrategy.Hide();

                if (datasetSummary.MissingDataCount > 0) {
                    this.btnShowReport.Disable();
                    this.divPivot.HtmlElement.appendChild(datasetSummary.MissingDataTable);
                    // Bloquer le lancement des analyses
                    self.pAnalysisMissingDataWarning.Show();
                    if (datasetSummary.MissingDataPercentage < 20) {
                        // Moins de 20% de données manquantes
                        self.pAnalysisMissingDataWarning.Set(Framework.LocalizationManager.Get("AnalysisMissingDataWarning"));
                        self.divAnalysisMissingDataStrategy.Show();

                        let selectStrategy = Framework.Form.Select.RenderWithLabel(Framework.LocalizationManager.Get("AnalysisMissingDataStrategy"), "", self.missingDataActions, Framework.Form.Validator.NotEmpty(), (newVal: string) => {
                            if (newVal == "Impute") {
                                let listImputedData: Models.Data[] = datasetSummary.ImputMissingData();
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

                mw.AddButton(this.btnShowReport);

                //TODO
                //Framework.ShortcutManager.Add({
                //    Condition: () => { return self.mw.IsVisible; }, KeyCode: 13, Action: () => {
                //        self.btnImport.Click();
                //    }
                //});
            }


        }

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

        export class ModalSaveMailAsTemplateViewModel extends PanelLeaderModalViewModel {

            public OnSave: (template: PanelLeaderModels.MailTemplate) => void;

            constructor(mw: Framework.Modal.Modal, templates: PanelLeaderModels.MailTemplate[]) {

                super(mw);
                let self = this;

                let div = document.createElement("div");

                let p = document.createElement("p");
                p.innerText = Framework.LocalizationManager.Get("TemplateName");
                div.appendChild(p);

                let inputText = Framework.Form.InputText.Create("", () => {
                    btnSave.CheckState();
                }, Framework.Form.Validator.Unique(templates.map((x) => { return x.Label; })), false, ["blockForm"]);
                div.appendChild(inputText.HtmlElement);

                let p1 = document.createElement("p");
                p1.innerText = Framework.LocalizationManager.Get("Description");
                div.appendChild(p1);

                let inputDescription = Framework.Form.InputText.Create("", () => {
                }, Framework.Form.Validator.NoValidation(), false, ["blockForm"]);
                div.appendChild(inputDescription.HtmlElement);

                let cb = Framework.Form.CheckBox.Create(() => { return true; }, () => { }, Framework.LocalizationManager.Get("DefaultTemplate"), "", false, ["blockForm"]);
                div.appendChild(cb.HtmlElement);

                let btnSave = Framework.Form.Button.Create(() => {
                    return inputText.IsValid == true;
                }, () => {

                    let template: PanelLeaderModels.MailTemplate = new PanelLeaderModels.MailTemplate();
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

                let btnCancel = Framework.Form.Button.Create(() => { return true; }, () => {
                    mw.Close();
                }, "", ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));


                mw.AddButton(btnCancel);
                mw.AddButton(btnSave);

                mw.Body.appendChild(div);

                //TODO
                Framework.ShortcutManager.Add(() => { return self.mw.IsVisible; }, 13, () => { btnSave.Click(); });
            }

        }

        export class ModalEditDesignRanksViewModel extends PanelLeaderModalViewModel {

            constructor(mw: Framework.Modal.Modal, design: Models.ExperimentalDesign, onChange: (itemCode: string, replicate: number, newRank: number) => void) {

                super(mw);
                let self = this;

                let nbRanks = design.NbReplicates * design.NbItems;

                let codes = [];
                design.ListItems.forEach((x) => {
                    x.Labels.forEach((kvp) => {
                        codes.push(x.Code + "-" + kvp.Key);
                    });
                });

                let ranks = [];
                ranks.push(new Framework.KeyValuePair("-", "0"));
                for (let i = 1; i <= nbRanks; i++) {
                    ranks.push(new Framework.KeyValuePair(i, i));
                }

                let div = Framework.Form.TextElement.Create("");

                let p0 = document.createElement("p");
                p0.innerText = Framework.LocalizationManager.Get("ForSelectedPanelists");
                div.HtmlElement.appendChild(p0);

                let p1 = document.createElement("p");
                div.HtmlElement.appendChild(p1);

                let lb1 = document.createElement("label");
                lb1.style.width = "200px";
                lb1.innerText = Framework.LocalizationManager.Get("Move");
                p1.appendChild(lb1);

                let selectItemCodeForDesign = Framework.Form.Select.Render("", Framework.KeyValuePair.FromArray(codes), Framework.Form.Validator.NotEmpty(), (x) => { }, false);
                selectItemCodeForDesign.HtmlElement.style.width = "200px";
                p1.appendChild(selectItemCodeForDesign.HtmlElement);

                let p2 = document.createElement("p");
                div.HtmlElement.appendChild(p2);

                let lb2 = document.createElement("label");
                lb2.style.width = "200px";
                lb2.innerText = Framework.LocalizationManager.Get("AtRank");
                p2.appendChild(lb2);

                let selectItemRankForDesign = Framework.Form.Select.Render("", ranks, Framework.Form.Validator.NotEmpty(), (x) => { }, false);
                selectItemRankForDesign.HtmlElement.style.width = "200px";
                p2.appendChild(selectItemRankForDesign.HtmlElement);

                let okButton = Framework.Form.Button.Create(() => { return true; }, () => {
                    let p = selectItemCodeForDesign.Value.split('-');
                    onChange(p[0], p[1], Number(selectItemRankForDesign.Value));
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("OK"));
                //okButton.HtmlElement.style.cssFloat = "right";
                //div.Append(button);

                let cancelButton = Framework.Form.Button.Create(() => { return true; }, () => {
                    mw.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("Cancel"));

                mw.AddButton(cancelButton);
                mw.AddButton(okButton);

                mw.Body.appendChild(div.HtmlElement);
                mw.Float('top');
            }
        }
    }

}
