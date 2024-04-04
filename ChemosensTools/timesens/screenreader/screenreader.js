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
var ScreenReader;
(function (ScreenReader) {
    ScreenReader.PanelistCodeDisplayModeEnum = [
        { Key: "NeverShowPanelistCodesOnClient", Value: "Never" }, { Key: "ShowNotStartedPanelistCodesOnClient", Value: "NotStarted" }, { Key: "ShowNotFinishedPanelistCodesOnClient", Value: "NotFinished" }
    ];
    ScreenReader.CheckCompatibilityModeEnum = ["Warning", "Strict", "NoCheck"];
    var Actions = /** @class */ (function () {
        function Actions() {
            this.OnLastScreen = undefined;
            this.OnNavigation = undefined;
            this.OnValidationError = undefined;
            this.OnError = undefined;
            this.OnNotification = undefined;
            this.OnSaveProgressAsPanelLeader = undefined;
            this.OnProgressUpload = undefined;
            this.OnBase64StringUpload = undefined;
            this.OnRScriptStarted = undefined;
            this.OnSave = undefined;
            this.OnDataChanged = undefined;
            this.OnClose = undefined;
        }
        return Actions;
    }());
    ScreenReader.Actions = Actions;
    var State = /** @class */ (function () {
        function State() {
            this.IsInDemo = false;
            this.IsInSimulation = false;
            this.IsPanelLeader = false;
        }
        return State;
    }());
    ScreenReader.State = State;
    var Reader = /** @class */ (function () {
        function Reader(subjectSeance, currentScreenDiv, actions, state) {
            if (actions === void 0) { actions = new Actions(); }
            if (state === void 0) { state = new State(); }
            this.actions = new Actions();
            this.state = new State();
            this.IsOnLine = true;
            var self = this;
            subjectSeance.ListExperimentalDesigns.forEach(function (x) {
                Models.ExperimentalDesign.ConvertItemLabelsFromV1(x);
            });
            self.Session = subjectSeance;
            self.currentScreenDiv = currentScreenDiv;
            //TODO : redimensionnement / changement orientation
            // Redimensionnement de l'écran ou changement d'orientation
            //window.addEventListener("resize", function () {
            //    setTimeout(() => {
            //        Framework.Scale.ScaleDiv(self.currentScreenDiv, window.innerWidth, window.innerHeight);
            //    }, 100);
            //}, false);
            //window.addEventListener("orientationchange", function () {
            //    setTimeout(() => {
            //        Framework.Scale.ScaleDiv(self.currentScreenDiv, window.innerWidth, window.innerHeight);
            //    }, 100);
            //}, false);
            self.actions = actions;
            self.state = state;
            // Toolbar
            if (document.getElementById("simulationToolBar") == undefined && (self.state.IsInDemo || self.state.IsPanelLeader)) {
                self.createToolBar();
            }
            // Vérification de la compatibilité
            //TODO : intersection des browsers
            //TODO : renvoie liste des browsers sur même OS
            var compatibilityResult = self.checkBrowserCompatibility();
            if (self.Session.BrowserCheckMode == undefined) {
                self.Session.BrowserCheckMode = "Warning";
            }
            self.addYTPlayer();
            if (compatibilityResult != "" && (self.Session.BrowserCheckMode == "Warning" || self.Session.BrowserCheckMode == "Strict")) {
                self.createScreenIncompatibleBrowser(compatibilityResult);
                return;
            }
            else {
                // Création de la liste des écrans
                self.createAllScreens();
            }
        }
        Reader.prototype.onClose = function () {
            var self = this;
            this.stopSpeechToText();
            this.stopTextToSpeech();
            this.stopRecorders();
            this.stopAllTimers();
            this.stopAllChronometers();
            if (this.state.IsInSimulation == true) {
                // Suppression des lignes de plans de présentation créés à la volée
                self.Session.ListExperimentalDesigns
                    .filter(function (x) { return x.CanAddItem == true; })
                    .forEach(function (x) {
                    x.ListExperimentalDesignRows = [];
                });
            }
            if (this.actions.OnClose) {
                this.actions.OnClose();
            }
        };
        Reader.prototype.onScreenChanged = function () {
            if (this.state.IsInDemo || this.state.IsInSimulation || this.state.IsPanelLeader) {
                this.showProgress();
            }
        };
        Reader.prototype.onLastScreen = function () {
            if (this.actions.OnLastScreen) {
                this.actions.OnLastScreen();
            }
        };
        Reader.prototype.onError = function (ex) {
            if (this.actions.OnError) {
                this.actions.OnError(ex);
            }
        };
        Reader.prototype.onValidationError = function (message) {
            if (this.actions.OnValidationError) {
                this.actions.OnValidationError(message);
            }
        };
        // Utilisé en test
        Reader.prototype.SetEvent = function (event, f) {
            if (event == "OnValidationError") {
                this.actions.OnValidationError = f;
            }
        };
        Reader.prototype.onNavigation = function (url, blank) {
            if (blank === void 0) { blank = false; }
            if (this.actions.OnNavigation) {
                this.actions.OnNavigation(url, blank);
            }
        };
        Reader.prototype.onProgressUpload = function (action, checkProgress) {
            if (checkProgress === void 0) { checkProgress = true; }
            if (this.actions.OnProgressUpload) {
                this.actions.OnProgressUpload(action, checkProgress);
            }
            else {
                action();
            }
        };
        Reader.prototype.onBase64StringUpload = function (base64string, filename) {
            if (this.actions.OnBase64StringUpload) {
                this.actions.OnBase64StringUpload(base64string, filename);
            }
        };
        Reader.prototype.onRScriptStarted = function (rScript, success, error) {
            if (this.actions.OnRScriptStarted) {
                this.actions.OnRScriptStarted(rScript, success, error);
            }
        };
        Reader.prototype.onSave = function (blob, filename) {
            if (this.actions.OnSave) {
                this.actions.OnSave(blob, filename);
            }
        };
        Reader.prototype.onNotification = function (message) {
            if (this.actions.OnNotification) {
                this.actions.OnNotification(message);
            }
        };
        Reader.prototype.onSaveProgressAsPanelLeader = function (callback) {
            if (this.actions.OnSaveProgressAsPanelLeader) {
                this.actions.OnSaveProgressAsPanelLeader(callback);
            }
        };
        Reader.prototype.onDataChanged = function (data) {
            if (this.state && (this.state.IsInDemo || this.state.IsInSimulation || this.state.IsPanelLeader)) {
                this.showDataNotification(data);
            }
        };
        //#endregion
        Reader.Initialize = function (subjectSeance, currentScreenDiv, actions, state, callback) {
            if (actions === void 0) { actions = new Actions(); }
            if (state === void 0) { state = new State(); }
            var Requirements2 = new Framework.ModuleRequirements();
            Requirements2.CssFiles = ['/screenreader/css/screenreader.css'];
            Requirements2.JsFiles = ['/screenreader/models.js'];
            Requirements2.Recommanded = [];
            Requirements2.Required = [];
            if (window.location.hostname.indexOf("localhost") > -1) {
                Requirements2.AppUrl = 'http://localhost:44301/timesens';
                Requirements2.FrameworkUrl = 'http://localhost:44301/framework';
                Requirements2.WcfServiceUrl = 'http://localhost:44301/WebService.svc/';
            }
            else {
                Requirements2.AppUrl = 'https://www.chemosenstools.com/timesens';
                Requirements2.FrameworkUrl = 'https://www.chemosenstools.com/framework';
                Requirements2.WcfServiceUrl = 'https://www.chemosenstools.com/WebService.svc/';
            }
            Requirements2.DefaultLanguage = 'en';
            Requirements2.AuthorizedLanguages = ['en', 'fr'];
            Requirements2.OnLoaded = function (compatibilityResult) {
                var reader = new Reader(subjectSeance, currentScreenDiv, actions, state);
                callback(reader);
            };
            Framework.LoadModule(Requirements2);
        };
        Reader.prototype.addYTPlayer = function () {
            var self = this;
            // Ajout lecteur youtube     
            // TODO : ajout conditionnel
            window.onYouTubeIframeAPIReady = function () {
                try {
                    self.YTPlayer = new YT.Player();
                }
                catch (e) {
                }
            };
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        };
        Reader.prototype.checkBrowserCompatibility = function () {
            for (var i = 0; i < this.Session.ListScreens.length; i++) {
                var controls = Models.Screen.SetControls(this.Session.ListScreens[i]);
                for (var j = 0; j < controls.length; j++) {
                    var txt = controls[j].CheckCompatibility();
                    if (txt != "") {
                        return (txt);
                    }
                }
            }
            return "";
        };
        Reader.prototype.createScreenIncompatibleBrowser = function (message) {
            //TODO : améliorer
            this.listScreens = [];
            var screen = new Models.Screen();
            screen.ExperimentalDesignId = 0;
            screen.Background = "transparent";
            screen.Resolution = this.Session.ListScreens[0].Resolution;
            var html = "<p style='text-align:center;color:darkblue'>" + Framework.LocalizationManager.Get("YourBrowserIsNotCompatible") + "</p><p>&snbp;</p>" + "<p style='text-align:center;color:darkblue;'>" + Framework.LocalizationManager.Format("PleasePasteAndCopyThisLinkInOneOfThisBrowser", ["<u>" + window.location.href + "</u><br/>", "<br/><br/>" + message]) + "</p>";
            if (this.Session.BrowserCheckMode == "Warning") {
                var button = ScreenReader.Controls.CustomButton.Create(Framework.LocalizationManager.Get("ContinueInThisBrowser"), "GoToNextPage", 80, 600);
                button._Background = "orange";
                button._BorderBrush = "red";
                button._Left = 800;
                button._Top = 800;
                screen.AddControl(button, "500");
                html = "<p style='text-align:center;color:darkblue'>" + Framework.LocalizationManager.Get("YourBrowserIsNotCompatible") + "</p><p>&nbsp;</p>" + "<p style='text-align:center;color:darkblue;'>" + Framework.LocalizationManager.Format("YouShouldPasteAndCopyThisLinkInOneOfThisBrowser", ["<u>" + window.location.href + "</u><br/>", "<br/><br/>" + message]) + "</p>";
            }
            var textArea = Controls.TextArea.Create(html);
            textArea._BorderThickness = 0;
            var link = "<u>" + window.location.href + "</u><br/>";
            textArea._Background = "transparent";
            textArea._Height = 200;
            textArea._Width = 800;
            textArea._Top = 0;
            textArea._Left = 0;
            textArea.OnClick = function () {
                window.clipboardData.setData('Text', window.location.href);
                alert(Framework.LocalizationManager.Get("URLCopiedInClipboard"));
            };
            //textArea.IsEditable = true;
            textArea._FriendlyName = "TextArea0";
            screen.AddControl(textArea, "Center");
            //screen.Controls.push(textArea);
            var s = new Models.ScreenWithExperimentalDesign();
            s.Screen = screen;
            if (this.Session.BrowserCheckMode == "Warning") {
                this.createAllScreens();
                this.listScreens.splice(0, 0, s);
            }
            this.listScreens.push(s);
            this.CurrentScreen = s;
            this.listControls = Models.Screen.SetControls(s.Screen);
            var div = Models.Screen.RenderContainer(this.CurrentScreen.Screen, this.currentScreenDiv.clientHeight, this.currentScreenDiv.clientWidth);
            this.currentScreenDiv.style.cssText = div.style.cssText;
            this.Render();
            this.onScreenChanged();
        };
        // Génère la liste des écrans de la séance en fonction des plans de présentation et des visibilités conditionelles
        Reader.prototype.createAllScreens = function () {
            this.listScreens = [];
            var cpt = 0;
            var _session = this.Session;
            try {
                while (cpt < this.Session.ListScreens.length) {
                    var templatedScreen = this.Session.ListScreens[cpt];
                    if (templatedScreen.ExperimentalDesignId == 0) {
                        // Ecran non répété
                        var s = new Models.ScreenWithExperimentalDesign();
                        s.Screen = templatedScreen;
                        s.SubjectCode = this.Session.Subject.Code;
                        if (this.subjectCodeForSimulation) {
                            s.SubjectCode = this.subjectCodeForSimulation;
                        }
                        s.Replicate = 1;
                        if (templatedScreen.IsConditionnal == undefined || templatedScreen.IsConditionnal == false || (templatedScreen.IsConditionnal == true && s.VerifyConditions() == true)) {
                            this.listScreens.push(s);
                        }
                        cpt++;
                    }
                    else {
                        // Bloc répété
                        var design = this.Session.ListExperimentalDesigns.filter(function (x) {
                            return x.Id === templatedScreen.ExperimentalDesignId;
                        })[0];
                        if (design.NbIntakes == undefined || design.NbIntakes < 1) {
                            design.NbIntakes = 1;
                        }
                        // Ecrans du bloc
                        var groupedScreens = [];
                        var screenIndex = cpt;
                        while (screenIndex < this.Session.ListScreens.length && this.Session.ListScreens[screenIndex].ExperimentalDesignId == templatedScreen.ExperimentalDesignId) {
                            groupedScreens.push(this.Session.ListScreens[screenIndex]);
                            screenIndex++;
                        }
                        // Plan de présentation du sujet sélectionné , trié par rang
                        var listRows = design.ListExperimentalDesignRows.filter(function (x) {
                            return (x.SubjectCode == _session.Subject.Code);
                        }).sort(function (row1, row2) {
                            return row1.Rank - row2.Rank;
                        });
                        var cptRow = 0;
                        while (cptRow < listRows.length) {
                            for (var intake = 1; intake <= design.NbIntakes; intake++) {
                                var cptScreen = 0;
                                while (cptScreen < groupedScreens.length) {
                                    // 1 écran par produit / répétition
                                    var s = new Models.ScreenWithExperimentalDesign();
                                    s.Screen = groupedScreens[cptScreen];
                                    if (design.Type == "Product") {
                                        if (listRows[cptRow]["ProductCode"]) {
                                            s.ProductCode = (listRows[cptRow]).ProductCode; // Compatibilité SL
                                        }
                                        else {
                                            s.ProductCode = listRows[cptRow].Code;
                                        }
                                        s.ProductRank = listRows[cptRow].Rank;
                                    }
                                    if (design.Type == "Attribute") {
                                        if (listRows[cptRow]["AttributeCode"]) {
                                            s.AttributeCode = (listRows[cptRow]).AttributeCode; // Compatibilité SL
                                        }
                                        else {
                                            s.AttributeCode = listRows[cptRow].Code;
                                        }
                                        s.AttributeRank = listRows[cptRow].Rank;
                                    }
                                    if (design.Type == "TriangleTest") {
                                        s.ProductCode = Models.TriangleTestExperimentalDesignRow.GetTriangle((listRows[cptRow])); // Compatibilité SL
                                        s.ProductRank = listRows[cptRow].Rank;
                                    }
                                    s.Replicate = listRows[cptRow].Replicate;
                                    s.Intake = intake;
                                    s.SubjectCode = _session.Subject.Code;
                                    if (this.subjectCodeForSimulation) {
                                        s.SubjectCode = this.subjectCodeForSimulation;
                                    }
                                    // Ecran conditionnel
                                    if (groupedScreens[cptScreen].IsConditionnal == undefined || groupedScreens[cptScreen].IsConditionnal == false || (groupedScreens[cptScreen].IsConditionnal == true && s.VerifyConditions() == true)) {
                                        this.listScreens.push(s);
                                    }
                                    cptScreen++;
                                }
                            }
                            cptRow++;
                        }
                        cpt += groupedScreens.length;
                    }
                }
            }
            catch (ex) {
                this.onError(ex);
            }
        };
        Reader.prototype.getReplicate = function () {
            var currentScreen = this.listScreens[this.Session.Progress.CurrentState.CurrentScreen];
            if (currentScreen.Replicate != undefined) {
                return currentScreen.Replicate.toString();
            }
            return "";
        };
        Reader.prototype.getIntake = function () {
            var currentScreen = this.listScreens[this.Session.Progress.CurrentState.CurrentScreen];
            if (currentScreen.Intake != undefined) {
                return currentScreen.Intake.toString();
            }
            return "";
        };
        Reader.prototype.getProductRank = function () {
            var currentScreen = this.listScreens[this.Session.Progress.CurrentState.CurrentScreen];
            if (currentScreen.ProductRank != undefined) {
                return currentScreen.ProductRank.toString();
            }
            return "";
        };
        Reader.prototype.getProductDescription = function () {
            var currentScreen = this.listScreens[this.Session.Progress.CurrentState.CurrentScreen];
            var design = this.getCurrentScreenDesign();
            if (design == undefined) {
                return "";
            }
            if (currentScreen.ProductCode != undefined) {
                return design.ListItems.filter(function (x) { return x.Code == currentScreen.ProductCode; })[0].Description;
            }
            return "";
        };
        Reader.prototype.getCurrentScreenDesign = function () {
            var currentScreen = this.listScreens[this.Session.Progress.CurrentState.CurrentScreen];
            var id = currentScreen.Screen.ExperimentalDesignId;
            if ((id > 0) == false) {
                return undefined;
            }
            var designs = this.Session.ListExperimentalDesigns.filter(function (x) {
                return (x.Id == id);
            });
            return designs[0];
        };
        Object.defineProperty(Reader.prototype, "CurrentItemLabel", {
            get: function () {
                return this.getSpecialLabel();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Reader.prototype, "CurrentProductRank", {
            get: function () {
                var currentScreen = this.listScreens[this.Session.Progress.CurrentState.CurrentScreen];
                if (currentScreen.ProductRank != undefined) {
                    return currentScreen.ProductRank;
                }
                return undefined;
            },
            enumerable: false,
            configurable: true
        });
        Reader.prototype.getSpecialLabel = function () {
            var res = "";
            var currentScreen = this.listScreens[this.Session.Progress.CurrentState.CurrentScreen];
            var design = this.getCurrentScreenDesign();
            if (design == undefined) {
                return "";
            }
            if (design.Type == "Attribute") {
                if (design.ListExperimentalDesignRows[0]["AttributeCode"]) {
                    var rows = design.ListExperimentalDesignRows.filter(function (x) {
                        return (x.AttributeCode == currentScreen.AttributeCode && x.Replicate == currentScreen.Replicate);
                    });
                    res = rows[0].AttributeLabel;
                }
                if (design.ListExperimentalDesignRows[0].Code && design.ListExperimentalDesignRows[0].Code.length > 0) {
                    var rows = design.ListExperimentalDesignRows.filter(function (x) {
                        return (x.Code == currentScreen.AttributeCode && x.Replicate == currentScreen.Replicate);
                    });
                    res = rows[0].Label;
                }
            }
            if (design.Type == "Product") {
                if (design.ListExperimentalDesignRows[0]["ProductCode"]) {
                    var rows = design.ListExperimentalDesignRows.filter(function (x) {
                        return (x.ProductCode == currentScreen.ProductCode && x.Replicate == currentScreen.Replicate);
                    });
                    res = rows[0].ProductLabel;
                }
                if (design.ListExperimentalDesignRows[0].Code && design.ListExperimentalDesignRows[0].Code.length > 0) {
                    var rows = design.ListExperimentalDesignRows.filter(function (x) {
                        return (x.Code == currentScreen.ProductCode && x.Replicate == currentScreen.Replicate);
                    });
                    if (rows.length == 0) {
                        rows = design.ListExperimentalDesignRows.filter(function (x) {
                            return (x.Code == currentScreen.ProductCode && x.Replicate == 1);
                        });
                    }
                    res = rows[0].Label;
                }
            }
            return res;
        };
        Reader.prototype.getExistingData = function (control) {
            var _this = this;
            var existingData = [];
            if (this.Session.Progress.ListData) {
                existingData = this.Session.Progress.ListData.filter(function (x) { return x.SubjectCode == _this.CurrentScreen.SubjectCode
                    //&& x.DataControlId == control._Id
                    && x.ControlName == control._FriendlyName
                    && x.ProductCode == _this.CurrentScreen.ProductCode
                    && x.Replicate == _this.CurrentScreen.Replicate
                    && x.Intake == _this.CurrentScreen.Intake
                    && x.Score != null; });
            }
            return existingData;
        };
        Reader.prototype.getPreviousReplicateData = function (control) {
            var _this = this;
            var existingData = [];
            if (this.Session.Progress.ListData) {
                existingData = this.Session.Progress.ListData.filter(function (x) { return x.SubjectCode == _this.CurrentScreen.SubjectCode
                    //&& x.DataControlId == control._Id
                    && x.ControlName == control._FriendlyName
                    && x.ProductCode == _this.CurrentScreen.ProductCode
                    && x.Replicate == _this.CurrentScreen.Replicate - 1
                    && x.Score != null; });
            }
            return existingData;
        };
        Reader.prototype.GetControlByName = function (name) {
            var controls = this.listControls.filter(function (x) { return x._FriendlyName == name; });
            if (controls.length > 0) {
                return controls[0];
            }
            return undefined;
        };
        Reader.prototype.Render = function () {
            var cpt = 0;
            var _subjectSessionReader = this;
            var _loop_1 = function () {
                control = _subjectSessionReader.listControls[cpt];
                if (control._Type == "TextArea") {
                    control.Replace("/CurrentDate/", new Date(Date.now()).toLocaleDateString());
                    control.Replace("/PanellistNameTag/", _subjectSessionReader.Session.Subject.FirstName + " " + _subjectSessionReader.Session.Subject.LastName);
                    control.Replace("/SubjectFirstName/", _subjectSessionReader.Session.Subject.FirstName);
                    control.Replace("/SubjectLastName/", _subjectSessionReader.Session.Subject.LastName);
                    control.Replace("/SubjectCode/", _subjectSessionReader.Session.Subject.Code);
                    control.Replace("/SubjectNote/", _subjectSessionReader.Session.Subject.Notes);
                    control.Replace("/PanellistCodeTag/", _subjectSessionReader.Session.Subject.Code); // gardé pour compatibilité
                    control.Replace("/PanellistNotesTag/", _subjectSessionReader.Session.Subject.Notes); // gardé pour compatibilité
                    control.Replace("/ProductDescription/", _subjectSessionReader.getProductDescription());
                    control.Replace("/Replicate/", _subjectSessionReader.getReplicate());
                    control.Replace("/Intake/", _subjectSessionReader.getIntake());
                    control.Replace("/ProductRank/", _subjectSessionReader.getProductRank());
                    control.Replace("/SpecialLabel/", _subjectSessionReader.getSpecialLabel()); // gardé pour compatibilité
                    control.Replace("/ExperimentalDesignItemLabel/", _subjectSessionReader.getSpecialLabel());
                }
                if (control._Type == "SampleCodeChecker") {
                    control.ExperimentalDesign = _subjectSessionReader.getCurrentScreenDesign();
                    control.SetExpectedSampleLabel(_subjectSessionReader.getSpecialLabel());
                }
                if (control._Type == "SampleCodeInput") {
                    control.ExperimentalDesign = _subjectSessionReader.getCurrentScreenDesign();
                    control.SetExpectedAnswers();
                }
                if (control._Type == "FreeListOfTerms") {
                    control.SubjectCode = _subjectSessionReader.Session.Subject.Code;
                    control.ExperimentalDesign = (_subjectSessionReader.Session.ListExperimentalDesigns.filter(function (x) { return x.Id == control._ExperimentalDesignId; }))[0];
                }
                if (control instanceof ScreenReader.Controls.MediaRecorderControl) {
                    if (_subjectSessionReader.state.IsInSimulation == false) {
                        var name_1 = "";
                        if (_subjectSessionReader.Session.Access.ServerCode) {
                            name_1 += _subjectSessionReader.Session.Access.ServerCode + "_";
                        }
                        if (_subjectSessionReader.Session.Subject.Code) {
                            name_1 += "subject" + _subjectSessionReader.Session.Subject.Code.replace('_', '') + "_";
                        }
                        if (_subjectSessionReader.CurrentScreen.ProductCode) {
                            name_1 += "product" + _subjectSessionReader.CurrentScreen.ProductCode.replace('_', '') + "_";
                        }
                        if (_subjectSessionReader.CurrentScreen.ProductRank) {
                            name_1 += "trial" + _subjectSessionReader.CurrentScreen.ProductRank + "_";
                        }
                        if (_subjectSessionReader.CurrentScreen.Replicate) {
                            name_1 += "rep" + _subjectSessionReader.CurrentScreen.Replicate + "_";
                        }
                        if (_subjectSessionReader.CurrentScreen.Intake) {
                            name_1 += "intake" + _subjectSessionReader.CurrentScreen.Intake + "_";
                        }
                        var date = new Date(Date.now());
                        name_1 += date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
                        control.OnUpload = function (base64string, extension) {
                            _subjectSessionReader.onBase64StringUpload(base64string, name_1 + "." + extension);
                        };
                        control.OnSave = function (blob, extension) {
                            _subjectSessionReader.onSave(blob, name_1 + "." + extension);
                        };
                        //(<Controls.MediaRecorderControl>control).OnLocalSave = function (blob: Blob, extension: string) {
                        //Framework.BlobHelper.BlobToBase64(blob, (base64) => {
                        //    Framework.LocalStorage.SaveToLocalForage("Videos", name + "." + extension, base64, false);
                        //});
                        //};
                    }
                    if (control instanceof Controls.MediaRecorderControl && control._StartMode == "PageLoaded") {
                        // Démarrage de l'enregistrement
                        control.StartRecord();
                    }
                }
                if (control._Type == "CustomProgressBar") {
                    control.CurrentScreenIndex = _subjectSessionReader.Session.Progress.CurrentState.CurrentScreen + 1;
                    control.LastScreenIndex = _subjectSessionReader.listScreens.length;
                }
                if (control._Type == "CustomMedia") {
                    control.SetPlayer(_subjectSessionReader.YTPlayer);
                    //if ((<Controls.CustomMedia>control)._StartMode == "ClickOnStart") {
                    if (control._StartMode == "ClickOnMedia") {
                        control.OnPlay = function () {
                            _subjectSessionReader.start_ButtonClick(null);
                        };
                    }
                }
                //if (control._Type == "SubjectForm") {
                //    (<Controls.SubjectForm>control).Subject = _subjectSessionReader.Session.Subject;
                //}
                //if (control._Type == "SubjectSummary") {
                //    (<Controls.SubjectSummary>control).IsOnLine = _subjectSessionReader.IsOnLine;
                //    (<Controls.SubjectSummary>control).SubjectCode = _subjectSessionReader.Session.Subject.Code;
                //    //(<Controls.SubjectSummary>control).ServerCode = _subjectSessionReader.Session.Access.ServerCode;
                //    (<Controls.SubjectSummary>control).OnRScriptStarted = function (rScript: string, success: Function, error: Function) {
                //        _subjectSessionReader.onRScriptStarted(rScript, success, error);
                //    }
                //}
                if (control instanceof Controls.DataControl) {
                    control.onDataChanged = function (data) { _subjectSessionReader.onDataChanged(data); };
                    control.SubjectCode = _subjectSessionReader.CurrentScreen.SubjectCode;
                    control.ProductCode = _subjectSessionReader.CurrentScreen.ProductCode;
                    control.Replicate = _subjectSessionReader.CurrentScreen.Replicate;
                    control.Intake = _subjectSessionReader.CurrentScreen.Intake;
                    control.ProductRank = _subjectSessionReader.CurrentScreen.ProductRank;
                    control.AttributeCode = _subjectSessionReader.CurrentScreen.AttributeCode;
                    control.AttributeRank = _subjectSessionReader.CurrentScreen.AttributeRank;
                    control.UploadId = Number(_subjectSessionReader.Session.Progress.CurrentState.ServerCode);
                    control.SetExperimentalDesign(_subjectSessionReader.Session.ListExperimentalDesigns.filter(function (x) { return x.Id == control._ExperimentalDesignId; })[0]);
                    if (control instanceof Controls.SampleCodeInput) {
                        control.ProductCode = "";
                        control.AttributeCode = "";
                    }
                    var listData = _subjectSessionReader.getExistingData(control);
                    if (listData && listData.length > 0) {
                        control.SetExistingData(listData);
                    }
                    if (control instanceof Controls.StackedControl && control._ShowPreExistingScore == true) {
                        var previousData = _subjectSessionReader.getPreviousReplicateData(control);
                        control.SetPreviousReplicateData(previousData);
                    }
                    if (control instanceof Controls.StackedControlWithLabel && control._ShowTooltip == true) {
                        control.Tooltips = (_subjectSessionReader.Session.ListExperimentalDesigns.filter(function (x) { return x.Id == control._ExperimentalDesignId; })[0]).ListItems.map(function (x) { return new Framework.KeyValuePair(x.Code, x.Description); });
                    }
                    if (control instanceof Controls.GroupedControl) {
                        control.SetAttributeExperimentalDesign(_subjectSessionReader.Session.ListExperimentalDesigns.filter(function (x) { return x.Id == control._ExperimentalDesignId; })[0]);
                    }
                    if (control instanceof Controls.GroupDescriptionControl) {
                        control.ListData = _subjectSessionReader.Session.Progress.ListData.filter(function (x) {
                            return x.ControlName == control._AssociatedControlId
                                && x.SubjectCode == control.SubjectCode;
                            //&& x.Replicate == (<Controls.GroupDescriptionControl>control).Replicate; //TODO
                        });
                    }
                    if (control instanceof Controls.RandomPrice) {
                        control.ProductPrices = _subjectSessionReader.Session.Progress.ListData.filter(function (x) {
                            return x.ControlName == control._AssociatedControlId;
                        });
                    }
                }
                if (control instanceof Controls.CustomImage && control._Source == "Product") {
                    var currentDesign = _subjectSessionReader.Session.ListExperimentalDesigns.filter(function (x) { return x.Id == _subjectSessionReader.CurrentScreen.Screen.ExperimentalDesignId; })[0];
                    var binaries = currentDesign.ListItems.filter(function (x) { return x.Code == _subjectSessionReader.CurrentScreen.ProductCode; })[0].Image;
                    if (binaries) {
                        control.SetBinaries(binaries);
                    }
                }
                if (control._Type == "CustomChronometer") {
                    control.OnMaxTimeReached = function () {
                        _subjectSessionReader.stop_ButtonClick(null);
                    };
                }
                if (control._Type == "CustomTimer") {
                    control.OnMaxTimeReached = function () {
                        // Stop times
                        _subjectSessionReader.saveStopInAllDataControls();
                        // Page suivante
                        _subjectSessionReader.goToNextScreen();
                    };
                }
                //if (control._Type == "QuestionControl") {
                //    var customQuestion: Controls.QuestionControl = <Controls.QuestionControl>control;
                //    customQuestion.AttachedLabel = customQuestion.getAttachedLabel(<Controls.TextArea[]>_subjectSessionReader.listControls.filter((x) => { return x._Type == "TextArea" }));
                //}
                if (control._Type == "SpeechToText") {
                    stt = control;
                    stt.OnSpeech = function (text, confidence) {
                        _subjectSessionReader.listControls.forEach(function (x) {
                            if (x._VocalEnabled == true && x.OnSpeechRecognized) {
                                x.OnSpeechRecognized(text);
                            }
                        });
                    };
                }
                if (control._Type == "CustomButton") {
                    customButton = control;
                    customButton.OnClick = function () {
                        var _customButton = this;
                        var buttonAction = function () {
                            switch (_customButton._Action) {
                                case "CloseApplication":
                                    // Retourne à l'écran utilisé pour appeler TimeSens pour panel leader
                                    _subjectSessionReader.goToNextScreen_ButtonClick(_customButton, "nothing", function () {
                                        // Mode simulation : ferme
                                        if (_subjectSessionReader.state.IsInSimulation == true) {
                                            _subjectSessionReader.onClose();
                                        }
                                        else {
                                            _subjectSessionReader.onNavigation("index.html");
                                        }
                                    });
                                    break;
                                case "GoToLoginScreen":
                                    // Propage l'événement OnNavigate
                                    _subjectSessionReader.onNavigation("index.html");
                                    _customButton.Disable();
                                    break;
                                case "GoToUrl":
                                    // Propage l'événement OnNavigate
                                    var gurl = _customButton._URL;
                                    if (_customButton._URLVariablePart && _customButton._URLVariablePart == "subject") {
                                        gurl += "&subjectcode=" + _subjectSessionReader.Session.Subject.Code;
                                    }
                                    _subjectSessionReader.onNavigation(gurl, _customButton._Blank);
                                    _customButton.Disable();
                                    break;
                                case "GoToUrlAndGoToNextPage":
                                    // Propage l'événement OnNavigate  
                                    _subjectSessionReader.goToNextScreen_ButtonClick(_customButton, "nothing", function () { _subjectSessionReader.onNavigation(_customButton._URL); });
                                    break;
                                case "StartChronometer":
                                    _subjectSessionReader.start_ButtonClick(_customButton);
                                    break;
                                case "StopChronometer":
                                    _subjectSessionReader.stop_ButtonClick(_customButton);
                                    break;
                                case "GoToNextPage":
                                    _subjectSessionReader.goToNextScreen_ButtonClick(_customButton);
                                    break;
                                case "StopChronometerAndGoToNextPage":
                                    if (_subjectSessionReader.stop_ButtonClick(_customButton)) {
                                        _subjectSessionReader.goToNextScreen_ButtonClick(_customButton);
                                    }
                                    break;
                                case "GoToPreviousPage":
                                    _subjectSessionReader.goToPreviousScreen_ButtonClick(_customButton);
                                    break;
                                //case "CloseAndSendMail"://deprecated    , TODO ?                            
                                //    break;
                                case "AddRepThenGoToNextPage":
                                    _subjectSessionReader.goToNextScreen_ButtonClick(_customButton, "replicate");
                                    break;
                                case "AddIntakeThenGoToNextPage":
                                    _subjectSessionReader.goToNextScreen_ButtonClick(_customButton, "intake");
                                    break;
                                case "TDS":
                                    _subjectSessionReader.saveEvent_ButtonClick(_customButton, 'TDS');
                                    _customButton.OnDataChanged = _subjectSessionReader.onDataChanged;
                                    break;
                                case "GoToAnchor":
                                    _subjectSessionReader.goToAnchor_ButtonClick(_customButton);
                                    break;
                                case "GoToScreen":
                                    _subjectSessionReader.goToScreen(_customButton._ScreenId);
                                    break;
                                case "GoToScreenIf":
                                    _subjectSessionReader.goToScreenIf(_customButton._GoToScreenConditions);
                                    break;
                                case "GoToScreenOfSampleCodeInput":
                                    var design = _subjectSessionReader.getCurrentScreenDesign();
                                    _subjectSessionReader.goToScreenOfSampleCodeInput(_customButton, design.Id);
                                    break;
                                case "GoToScreenOfDesignItem":
                                    _subjectSessionReader.actionGoToScreenOfDesignItem();
                                    break;
                                case "GoToScreenOfSampleCodeInputAndExit":
                                    var design2 = _subjectSessionReader.getCurrentScreenDesign();
                                    var action = function () {
                                        //alert(_subjectSessionReader.Session.Progress.CurrentState.CurrentScreen + "/" + _subjectSessionReader.Session.Progress.CurrentState.CountScreen);
                                        if (_subjectSessionReader.state.IsInSimulation == true) {
                                            _subjectSessionReader.onClose();
                                        }
                                        else {
                                            if (_customButton._URL.length > 0) {
                                                _subjectSessionReader.onNavigation(_customButton._URL);
                                            }
                                            else {
                                                _subjectSessionReader.onNavigation("index.html");
                                            }
                                        }
                                    };
                                    _subjectSessionReader.goToScreenOfSampleCodeInput(_customButton, design2.Id, action);
                                    break;
                                case "SendSMSAndGoNextPage": //deprecated
                                    break;
                                case "SendSMSLeaveSession": //deprecated
                                    break;
                                case "HideControl":
                                    _subjectSessionReader.setControlsVisibility(_customButton._GroupOfControlID, 'hide');
                                    break;
                                case "ShowControl":
                                    _subjectSessionReader.setControlsVisibility(_customButton._GroupOfControlID, 'show');
                                    break;
                                case "StartSameSession":
                                    var url = window.location.href.split('?')[0];
                                    if (_subjectSessionReader.Session.Access) {
                                        url += "?servercode=" + _subjectSessionReader.Session.Access.ServerCode;
                                    }
                                    _subjectSessionReader.onNavigation(url);
                                    // TODO gestion mode local
                                    break;
                                case "InterruptSession": //deprecated
                                    break;
                                case "SaveEvent":
                                    _subjectSessionReader.saveEvent_ButtonClick(_customButton);
                                    _customButton.OnDataChanged = _subjectSessionReader.onDataChanged;
                                    break;
                                case "SaveEventThenGoToNextPage":
                                    _subjectSessionReader.saveEvent_ButtonClick(_customButton);
                                    _subjectSessionReader.goToNextScreen_ButtonClick(_customButton);
                                    break;
                                case "StopRecorder":
                                    _subjectSessionReader.stopRecorders("ClickOnStopRecord");
                                    break;
                            }
                        };
                        if (_customButton._ConfirmationRequired == true) {
                            Framework.Modal.Confirm(Framework.LocalizationManager.Get("ConfirmationRequired"), Framework.LocalizationManager.Get("AreYouSureToWantToExit"), function () {
                                buttonAction();
                            });
                        }
                        else {
                            buttonAction();
                        }
                    };
                }
                if (control != null) {
                    control.Render(false, _subjectSessionReader.CurrentScreen.Screen.Ratio);
                    if (control._Events.length > 0 && control._StartWithChronometer == false) {
                        control.StartTiming();
                    }
                    htmlElement = control.HtmlElement;
                }
                if (htmlElement != undefined) {
                    _subjectSessionReader.currentScreenDiv.appendChild(htmlElement);
                }
                cpt++;
            };
            var htmlElement, control, stt, customButton;
            while (cpt < this.listControls.length) {
                _loop_1();
            }
            var _ref = this;
            // Bouton start présent à l'écran?
            var startButtons = (this.listControls.filter(function (x) {
                return ((x instanceof Controls.CustomButton && x._Action == "StartChronometer")
                    || (x instanceof Controls.CustomMedia && x._StartMode == "ClickOnMedia"));
            }));
            var dataControls = this.listControls.filter(function (x) {
                return (x instanceof Controls.DataControl);
            });
            if (startButtons.length > 0) {
                // Si oui, on désactive tous les contrôles "temporels"                             
                dataControls.forEach(function (x) {
                    if (_ref.isTemporalDataControl(x)) {
                        x.Disable();
                    }
                });
                // On désactive les boutons "Navigation et stop"
                (this.listControls.filter(function (x) {
                    return (x instanceof Controls.CustomButton && (_ref.isNavigationControl(x) || _ref.isStopControl(x) || _ref.isDataControlButton(x)));
                })).forEach(function (y) {
                    y.Disable();
                });
            }
            else {
                // Si non, on met StartDate au démarrage de la page     
                dataControls.forEach(function (x) {
                    x.SetStartDate(_subjectSessionReader.DisplayDate);
                });
                // Lance automatiquement le chronomètre
                this.listControls.filter(function (x) {
                    return (x instanceof Controls.CustomChronometer);
                }).forEach(function (y) {
                    y.Start();
                });
            }
            // Démarrage du minuteur
            this.listControls.filter(function (x) {
                return (x instanceof Controls.CustomTimer);
            }).forEach(function (y) {
                y.Start();
            });
        };
        Reader.prototype.actionGoToScreenOfDesignItem = function () {
            var items = this.listControls.filter(function (x) { return x._Type == "SampleCodeInput"; });
            if (items.length > 0) {
                var control = items[0];
                if (control.IsValid == false) {
                    this.onValidationError(control.ValidationMessage);
                    return;
                }
                var design = this.getCurrentScreenDesign();
                var label_1 = control.ListData[0].Description;
                var answer = control.ListAnswers.filter(function (x) { return x.Label == label_1; })[0];
                var code = answer.Code;
                var res = this.goToScreenOfDesignItem(design.Id, code);
                if (res != "") {
                    control.ValidationMessage = Framework.LocalizationManager.Get(res) + "\n";
                    this.onValidationError(control.ValidationMessage);
                }
            }
        };
        Reader.prototype.stopSpeechToText = function () {
            this.listControls.filter(function (x) {
                return (x instanceof Controls.TextArea && x._SpokenLanguage != "None");
            }).forEach(function (y) {
                y.Stop();
            });
        };
        Reader.prototype.stopTextToSpeech = function () {
            this.listControls.filter(function (x) {
                return (x instanceof Controls.SpeechToText);
            }).forEach(function (y) {
                y.Stop();
            });
        };
        Reader.prototype.stopRecorders = function (stopMode) {
            if (stopMode === void 0) { stopMode = undefined; }
            var recorders = this.listControls.filter(function (x) {
                return (x instanceof Controls.MediaRecorderControl);
            });
            if (stopMode) {
                recorders = recorders.filter(function (x) {
                    return (x._StopMode == stopMode);
                });
            }
            recorders.forEach(function (y) {
                y.StopRecord();
            });
        };
        Reader.prototype.setControlsVisibility = function (groupID, action) {
            for (var i = 0; i < this.listControls.length; i++) {
                var control = this.listControls[i];
                if (Framework.Array.Intercept(control._Group, groupID)) {
                    if (action == "show") {
                        control.Show();
                    }
                    if (action == "hide") {
                        control.Hide();
                    }
                }
            }
        };
        Reader.prototype.addIntake = function () {
            var _this = this;
            // Crée de nouveaux écrans
            var currentIndex = this.Session.Progress.CurrentState.CurrentScreen;
            var insertIndex = currentIndex + 1;
            var screen = this.listScreens[currentIndex];
            //let ok: boolean = false;
            //while (insertIndex < this.listScreens.length && ok == false) {
            //    let nextScreen: Models.ScreenWithExperimentalDesign = this.listScreens[insertIndex];
            //    let sameScreens: boolean = screen.Replicate == nextScreen.Replicate
            //        && screen.ProductCode == nextScreen.ProductCode
            //        && screen.ProductRank == nextScreen.ProductRank
            //        && screen.AttributeCode == nextScreen.AttributeCode
            //        && screen.AttributeRank == nextScreen.AttributeRank
            //        && screen.BlockId == nextScreen.BlockId
            //        && screen.SubjectCode == nextScreen.SubjectCode;
            //    if (sameScreens == true) {
            //        insertIndex++;
            //    }
            //    else {
            //        ok = true;
            //    }
            //}
            //if (insertIndex <= currentIndex) {
            //    // Pas d'écran à ajouter
            //    return;
            //}
            // Ajout d'écrans (pas prise en compte des écrans suivants)
            var screensWithCurrentExperimentalDesignId = this.listScreens.slice(0, currentIndex + 1).filter(function (x) {
                //var screensWithCurrentExperimentalDesignId: Models.ScreenWithExperimentalDesign[] = this.listScreens.filter((x) => {
                return x.Screen.ExperimentalDesignId == _this.listScreens[currentIndex].Screen.ExperimentalDesignId
                    && x.AttributeCode == _this.listScreens[currentIndex].AttributeCode
                    && x.AttributeRank == _this.listScreens[currentIndex].AttributeRank
                    && x.ProductCode == _this.listScreens[currentIndex].ProductCode
                    && x.ProductRank == _this.listScreens[currentIndex].ProductRank
                    && x.Replicate == _this.listScreens[currentIndex].Replicate;
            });
            // Ecrans suivants avec le même plan prés : changement de rep
            var nextScreensWithCurrentExperimentalDesignId = this.listScreens.slice(currentIndex + 1, this.listScreens.length).filter(function (x) {
                return x.Screen.ExperimentalDesignId == _this.listScreens[currentIndex].Screen.ExperimentalDesignId
                    && x.AttributeCode == _this.listScreens[currentIndex].AttributeCode
                    && x.AttributeRank == _this.listScreens[currentIndex].AttributeRank
                    && x.ProductCode == _this.listScreens[currentIndex].ProductCode
                    && x.ProductRank == _this.listScreens[currentIndex].ProductRank
                    && x.Replicate == _this.listScreens[currentIndex].Replicate;
            });
            nextScreensWithCurrentExperimentalDesignId.forEach(function (x) {
                x.Intake = x.Intake + 1;
                if (x.Screen.Controls) {
                    x.Screen.Controls.forEach(function (y) {
                        if (y instanceof Controls.DataControl) {
                            y.ListData = [];
                            y.Intake = y.Intake + 1;
                        }
                    });
                }
            });
            // Type d'experimentaldesign
            var design = this.Session.ListExperimentalDesigns.filter(function (x) {
                return x.Id == screensWithCurrentExperimentalDesignId[0].Screen.ExperimentalDesignId;
            })[0];
            var loop = 0;
            for (var i = 0; i < screensWithCurrentExperimentalDesignId.length; i++) {
                var screen_1 = screensWithCurrentExperimentalDesignId[i];
                var newScreen = new Models.ScreenWithExperimentalDesign();
                newScreen.Screen = new Models.Screen();
                newScreen.Screen.ExperimentalDesignId = screen_1.Screen.ExperimentalDesignId;
                newScreen.Screen.IsConditionnal = screen_1.Screen.IsConditionnal;
                newScreen.Screen.ListConditions = screen_1.Screen.ListConditions;
                newScreen.Screen.Resolution = screen_1.Screen.Resolution;
                newScreen.Screen.XamlContent = screen_1.Screen.XamlContent;
                newScreen.Screen.Controls = screen_1.Screen.Controls;
                if (newScreen.Screen.Controls) {
                    newScreen.Screen.Controls.forEach(function (x) {
                        if (x instanceof Controls.DataControl) {
                            x.ListData = [];
                            x.Intake = x.Intake + 1;
                        }
                    });
                }
                newScreen.AttributeCode = screen_1.AttributeCode;
                newScreen.AttributeRank = screen_1.AttributeRank;
                newScreen.ProductCode = screen_1.ProductCode;
                newScreen.ProductRank = screen_1.ProductRank;
                newScreen.SubjectCode = screen_1.SubjectCode;
                newScreen.Replicate = screen_1.Replicate;
                newScreen.Intake = screen_1.Intake + 1;
                if (newScreen.Screen.IsConditionnal == false || (newScreen.Screen.IsConditionnal == true && newScreen.VerifyConditions() == true)) {
                    this.listScreens.splice(insertIndex + loop, 0, newScreen);
                    loop++;
                }
            }
            // Modification du plan de présentation
            //let p: Models.ExperimentalDesignRow = new Models.ExperimentalDesignRow();
            //p.Rank = this.listScreens[currentIndex].ProductRank;
            //if (design.Type == "Product") {                               
            //    p.Code = this.listScreens[currentIndex].ProductCode;
            //    p.Label = Models.ExperimentalDesign.GetLabel(design, this.listScreens[currentIndex].ProductCode);
            //}
            //if (design.Type == "Attribute") {
            //    p = new Models.AttributeExperimentalDesignRow();
            //    p.Code = this.listScreens[currentIndex].AttributeCode;
            //    p.Label = Models.ExperimentalDesign.GetLabel(design, this.listScreens[currentIndex].AttributeCode);
            //}
            //p.Replicate = this.listScreens[currentIndex].Replicate + 1;
            //p.SubjectCode = this.Session.Subject.Code;            
            //design.ListExperimentalDesignRows.push(p);
            //TODO : comment sauvegarder (pour reprise) si séance locale ?
            //TODO : sauvegarde sur serveur
            //        if (!IsTimeSense)
            //            if (IsNetworkAvailable && !MySeance.Access.LocalSession) {
            //                // Si réseau
            //                proxy.UpdateSubjectSeanceExperimentalDesignAsync(MySeance.Access.ServerCode, MySeance.Access.SubjectCode, Serializer.SerializeToString(design));
            //            }
            //            else {
            //                // Sauvegarde dans l'isolated storage
            //                saveSubjectSeanceInIsolatedStorage("LocalSessions");
            //            }
        };
        Reader.prototype.addRep = function () {
            //TODO : add intake à la place
            var _this = this;
            // Crée de nouveaux écrans
            var currentIndex = this.Session.Progress.CurrentState.CurrentScreen;
            var insertIndex = currentIndex + 1;
            var screen = this.listScreens[currentIndex];
            //screen.AlreadyDisplayed = true;
            //let ok: boolean = false;
            //while (insertIndex < this.listScreens.length && ok == false) {
            //    let nextScreen: Models.ScreenWithExperimentalDesign = this.listScreens[insertIndex];
            //    let sameScreens: boolean = screen.Replicate == nextScreen.Replicate
            //        && screen.ProductCode == nextScreen.ProductCode
            //        && screen.ProductRank == nextScreen.ProductRank
            //        && screen.AttributeCode == nextScreen.AttributeCode
            //        && screen.AttributeRank == nextScreen.AttributeRank
            //        && screen.BlockId == nextScreen.BlockId
            //        && screen.SubjectCode == nextScreen.SubjectCode;
            //    if (sameScreens == true) {
            //        insertIndex++;
            //    }
            //    else {
            //        ok = true;
            //    }
            //}
            //if (insertIndex <= currentIndex) {
            //    // Pas d'écran à ajouter
            //    return;
            //}
            // Ajout d'écrans (pas prise en compte des écrans suivants)
            var screensWithCurrentExperimentalDesignId = this.listScreens.slice(0, currentIndex + 1).filter(function (x) {
                //var screensWithCurrentExperimentalDesignId: Models.ScreenWithExperimentalDesign[] = this.listScreens.filter((x) => {
                return x.Screen.ExperimentalDesignId == _this.listScreens[currentIndex].Screen.ExperimentalDesignId
                    && x.AttributeCode == _this.listScreens[currentIndex].AttributeCode
                    && x.AttributeRank == _this.listScreens[currentIndex].AttributeRank
                    && x.ProductCode == _this.listScreens[currentIndex].ProductCode
                    && x.ProductRank == _this.listScreens[currentIndex].ProductRank
                    && x.Replicate == _this.listScreens[currentIndex].Replicate;
            });
            // Ecrans suivants avec le même plan prés : changement de rep
            var nextScreensWithCurrentExperimentalDesignId = this.listScreens.slice(currentIndex + 1, this.listScreens.length).filter(function (x) {
                return x.Screen.ExperimentalDesignId == _this.listScreens[currentIndex].Screen.ExperimentalDesignId
                    && x.AttributeCode == _this.listScreens[currentIndex].AttributeCode
                    && x.AttributeRank == _this.listScreens[currentIndex].AttributeRank
                    && x.ProductCode == _this.listScreens[currentIndex].ProductCode
                    && x.ProductRank == _this.listScreens[currentIndex].ProductRank
                    && x.Replicate == _this.listScreens[currentIndex].Replicate;
            });
            nextScreensWithCurrentExperimentalDesignId.forEach(function (x) {
                x.Replicate = x.Replicate + 1;
                if (x.Screen.Controls) {
                    x.Screen.Controls.forEach(function (y) {
                        if (y instanceof Controls.DataControl) {
                            y.ListData = [];
                            y.Replicate = y.Replicate + 1;
                        }
                    });
                }
            });
            // Type d'experimentaldesign
            var design = this.Session.ListExperimentalDesigns.filter(function (x) {
                return x.Id == screensWithCurrentExperimentalDesignId[0].Screen.ExperimentalDesignId;
            })[0];
            var loop = 0;
            for (var i = 0; i < screensWithCurrentExperimentalDesignId.length; i++) {
                var screen_2 = screensWithCurrentExperimentalDesignId[i];
                var newScreen = new Models.ScreenWithExperimentalDesign();
                newScreen.Screen = new Models.Screen();
                newScreen.Screen.ExperimentalDesignId = screen_2.Screen.ExperimentalDesignId;
                newScreen.Screen.IsConditionnal = screen_2.Screen.IsConditionnal;
                newScreen.Screen.ListConditions = screen_2.Screen.ListConditions;
                newScreen.Screen.Resolution = screen_2.Screen.Resolution;
                newScreen.Screen.XamlContent = screen_2.Screen.XamlContent;
                newScreen.Screen.Controls = screen_2.Screen.Controls;
                if (newScreen.Screen.Controls) {
                    newScreen.Screen.Controls.forEach(function (x) {
                        if (x instanceof Controls.DataControl) {
                            x.ListData = [];
                            x.Replicate = x.Replicate + 1;
                        }
                    });
                }
                newScreen.AttributeCode = screen_2.AttributeCode;
                newScreen.AttributeRank = screen_2.AttributeRank;
                newScreen.ProductCode = screen_2.ProductCode;
                newScreen.ProductRank = screen_2.ProductRank;
                newScreen.SubjectCode = screen_2.SubjectCode;
                newScreen.Replicate = screen_2.Replicate + 1;
                //newScreen.AlreadyDisplayed = false;
                if (newScreen.Screen.IsConditionnal == false || (newScreen.Screen.IsConditionnal == true && newScreen.VerifyConditions() == true)) {
                    this.listScreens.splice(insertIndex + loop, 0, newScreen);
                    loop++;
                }
            }
            //// Modification (replicate) des écrans avec le même plan d'expérience situés après l'écran avec le bouton addrep
            //let ok: boolean = false;
            //let nextScreenIndex = insertIndex;
            //while (nextScreenIndex <= this.listScreens.length && ok == false) {
            //    let nextScreen: Models.ScreenWithExperimentalDesign = this.listScreens[nextScreenIndex];
            //    let sameScreens: boolean = screen.Replicate > nextScreen.Replicate
            //        && screen.ProductCode == nextScreen.ProductCode
            //        && screen.ProductRank == nextScreen.ProductRank
            //        && screen.AttributeCode == nextScreen.AttributeCode
            //        && screen.AttributeRank == nextScreen.AttributeRank
            //        && screen.BlockId == nextScreen.BlockId
            //        && screen.SubjectCode == nextScreen.SubjectCode;
            //    if (sameScreens == true) {
            //        nextScreen.Replicate = screen.Replicate;
            //        nextScreenIndex++;
            //    }
            //    else {
            //        ok = true;
            //    }
            //}
            // Modification du plan de présentation
            var p;
            if (design.Type == "Product") {
                p = new Models.ProductExperimentalDesignRow();
                p.Rank = this.listScreens[currentIndex].ProductRank;
                p.ProductCode = this.listScreens[currentIndex].ProductCode;
                p.ProductLabel = Models.ExperimentalDesign.GetLabel(design, this.listScreens[currentIndex].ProductCode);
            }
            if (design.Type == "Attribute") {
                p = new Models.AttributeExperimentalDesignRow();
                p.Rank = this.listScreens[currentIndex].AttributeRank;
                p.AttributeCode = this.listScreens[currentIndex].AttributeCode;
                p.AttributeLabel = Models.ExperimentalDesign.GetLabel(design, this.listScreens[currentIndex].AttributeCode);
            }
            if (design.Type == "TriangleTest") {
                p = new Models.TriangleTestExperimentalDesignRow();
                p.Rank = this.listScreens[currentIndex].ProductRank;
                var pList = this.listScreens[currentIndex].ProductCode.split('|');
                p.ProductCode1 = pList[0];
                p.ProductCode2 = pList[1];
                p.ProductCode3 = pList[2];
                p.ProductLabel1 = Models.ExperimentalDesign.GetLabel(design, pList[0]);
                p.ProductLabel2 = Models.ExperimentalDesign.GetLabel(design, pList[1]);
                p.ProductLabel3 = Models.ExperimentalDesign.GetLabel(design, pList[2]);
            }
            p.Replicate = this.listScreens[currentIndex].Replicate + 1;
            p.SubjectCode = this.Session.Subject.Code;
            //p.UploadId = design.ListExperimentalDesignRows[0].UploadId;
            design.ListExperimentalDesignRows.push(p);
            //TODO : comment sauvegarder (pour reprise) si séance locale ?
            //TODO : sauvegarde sur serveur
            //        if (!IsTimeSense)
            //            if (IsNetworkAvailable && !MySeance.Access.LocalSession) {
            //                // Si réseau
            //                proxy.UpdateSubjectSeanceExperimentalDesignAsync(MySeance.Access.ServerCode, MySeance.Access.SubjectCode, Serializer.SerializeToString(design));
            //            }
            //            else {
            //                // Sauvegarde dans l'isolated storage
            //                saveSubjectSeanceInIsolatedStorage("LocalSessions");
            //            }
        };
        Reader.prototype.getControlStartDate = function () {
            // Défaut : Date/time d'affichage de l'écran
            var startDate = this.DisplayDate;
            // Si l'écran contient un bouton start existe : Date/time du clic sur le bouton
            var startButtons = this.listControls.filter(function (x) { return x._Type == "CustomButton" && x._Action == "StartChronometer"; });
            if (startButtons.length > 0 && startButtons[0].AttachedData != undefined && startButtons[0].AttachedData.RecordedDate != undefined) {
                startDate = startButtons[0].AttachedData.RecordedDate;
            }
            // Si l'écran contient un Media avec startMode=ClickOnStart       
            var customMedias = this.listControls.filter(function (x) { return x._Type == "CustomMedia" && x._StartMode == "ClickOnStart"; });
            if (customMedias.length > 0 && customMedias[0].StartDate != undefined) {
                startDate = customMedias[0].StartDate;
            }
            return startDate;
        };
        Reader.prototype.saveEvent_ButtonClick = function (customButton, eventType) {
            if (eventType === void 0) { eventType = "Event"; }
            if (customButton.IsEnabled == false) {
                return;
            }
            if (this.Session.Progress.ListData == undefined) {
                this.Session.Progress.ListData = [];
            }
            var d = new Models.Data();
            d.DataControlId = customButton._Id;
            d.ControlName = customButton._FriendlyName;
            d.AttributeCode = customButton._EventName;
            d.AttributeRank = 0;
            d.Score = 1;
            d.RecordedDate = new Date(Date.now());
            d.ProductCode = this.CurrentScreen.ProductCode;
            d.ProductRank = this.CurrentScreen.ProductRank;
            d.Intake = this.CurrentScreen.Intake;
            d.Replicate = this.CurrentScreen.Replicate;
            d.Session = Number(this.Session.Progress.CurrentState.ServerCode);
            d.SubjectCode = this.Session.Subject.Code;
            d.Time = (d.RecordedDate.getTime() - this.getControlStartDate().getTime()) / 1000;
            d.Type = eventType;
            customButton.onDataChanged(d);
            this.Session.Progress.ListData.push(d);
            if (eventType == "TDS") {
                // Suppression de la surbrillance de tous les boutons
                var dtsButtons = this.listControls.filter(function (x) { return x._Type == "CustomButton" && x._Action == "TDS"; });
                for (var i = 0; i < dtsButtons.length; i++) {
                    var b = dtsButtons[i];
                    b._Background = b.MemoryBackground;
                    b.SetBackground(b._Background);
                    b._BorderBrush = b.MemoryBorderBrush;
                    b.SetBorderBrush(b._BorderBrush);
                }
                // Surbrillance du bouton sélectionné
                customButton._Background = customButton._SelectedBackground;
                customButton.SetBackground(customButton._SelectedBackground);
                customButton._BorderBrush = customButton._SelectedBorderBrush;
                customButton.SetBorderBrush(customButton._SelectedBorderBrush);
            }
        };
        Reader.prototype.start_ButtonClick = function (customButton) {
            var startDate = new Date(Date.now());
            if (customButton != null) {
                if (customButton.HtmlElement.classList.contains("disabled")) {
                    return;
                }
                if (customButton.AttachedData == undefined) {
                    customButton.AttachedData = new Models.Data();
                }
                customButton.AttachedData.RecordedDate = startDate;
            }
            var dataControls = this.listControls.filter(function (x) {
                return (x instanceof Controls.DataControl);
            });
            // Instancie StartDate dans tous les DataControls
            dataControls.forEach(function (y) {
                y.SetStartDate(startDate);
            });
            // Active tous les contrôles temporels
            var _ref = this;
            this.listControls.filter(function (x) {
                return (_ref.isTemporalDataControl(x));
            }).forEach(function (y) {
                y.Enable();
            });
            // Active les boutons STOP
            this.listControls.filter(function (x) {
                return (x instanceof Controls.CustomButton && (_ref.isDataControlButton(x) || _ref.isStopControl(x)));
            }).forEach(function (y) {
                y.Enable();
            });
            // Désactive les boutons START
            this.listControls.filter(function (x) {
                return (x instanceof Controls.CustomButton && x._Action == "StartChronometer");
            }).forEach(function (y) {
                y.Disable();
            });
            // Minutage des contrôles
            this.listControls.forEach(function (x) {
                if (x._StartWithChronometer == true && x._Events.length > 0) {
                    x.StartTiming();
                }
            });
            // Lance le chronomètre        
            this.listControls.filter(function (x) {
                return (x instanceof Controls.CustomChronometer);
            }).forEach(function (y) {
                y.Start();
            });
            // Lance les vidéos avec StartMode=ClickOnStart
            this.listControls.filter(function (x) {
                return (x instanceof Controls.CustomMedia && x._StartMode == "ClickOnStart");
            }).forEach(function (y) {
                y.Play();
            });
            // Lance l'enregistrement des MediaRecorder avec StartMode=ClickOnStartButton
            this.listControls.filter(function (x) {
                return (x instanceof Controls.MediaRecorderControl && x._StartMode == "ClickOnStartButton");
            }).forEach(function (y) {
                y.StartRecord();
            });
        };
        Reader.prototype.stop_ButtonClick = function (customButton) {
            if (customButton != undefined && customButton.HtmlElement.classList.contains("disabled")) {
                return false;
            }
            // Ne pas valider le stop si Attribut obligatoire (DTSButtonsControl)
            var message = "";
            var _ref = this;
            this.listControls.filter(function (x) {
                return (_ref.isTemporalDataControl(x));
            }).forEach(function (y) {
                if (y.IsValid == false) {
                    message += y.ValidationMessage;
                }
            });
            if (message.length > 0) {
                this.onValidationError(message);
                return false;
            }
            // Active les boutons de navigation
            this.listControls.filter(function (x) {
                return (_ref.isNavigationControl(x));
            }).forEach(function (y) {
                y.Enable();
            });
            //Désactive les boutons STOP (mais pas stop and go to nextpage)
            this.listControls.filter(function (x) {
                return (x instanceof Controls.CustomButton && x._Action == "StopChronometer");
            }).forEach(function (y) {
                y.Disable();
            });
            // Désactive tous les contrôles temporels
            this.listControls.filter(function (x) {
                return (_ref.isTemporalDataControl(x));
            }).forEach(function (y) {
                y.Disable();
            });
            // Désactive les boutons DTS
            this.listControls.filter(function (x) {
                return (x instanceof Controls.CustomButton && x._Action == "TDS");
            }).forEach(function (y) {
                y.Disable();
            });
            // Stoppe le chronomètre
            this.stopAllChronometers();
            // Enregistre StopDate dans tous les data controls
            this.saveStopInAllDataControls();
            // Stoppe l'enregistrement des MediaRecorder avec StopMode=ClickOnStopButton
            this.stopRecorders("ClickOnStop");
            return true;
        };
        Reader.prototype.isStopControl = function (control) {
            var res = false;
            res = control instanceof Controls.CustomButton
                && (control._Action == "StopChronometer" || control._Action == "StopChronometerAndGoToNextPage" || control._Action == "SaveEventThenGoToNextPage");
            return res;
        };
        Reader.prototype.isDataControlButton = function (control) {
            var res = false;
            res = control instanceof Controls.CustomButton
                && (control._Action == "TDS" || control._Action == "SaveEvent");
            return res;
        };
        Reader.prototype.isNavigationControl = function (dataControl) {
            var res = false;
            res = dataControl instanceof Controls.CustomButton
                && (dataControl._Action == "GoToNextPage" || dataControl._Action == "GoToPreviousPage" || dataControl._Action == "StopChronometerAndGoToNextPage");
            return res;
        };
        Reader.prototype.isTemporalDataControl = function (dataControl) {
            // retourne les contrôles enregistrant un temps potentiellement associés à START/STOP
            var res = false;
            res = dataControl instanceof Controls.DataControl
                && (dataControl.IsTemporalDataControl());
            return res;
        };
        Reader.prototype.stopAllTimers = function () {
            // Stoppe tous les timers
            this.listControls.filter(function (x) {
                return (x instanceof Controls.CustomTimer);
            }).forEach(function (y) {
                y.Stop();
            });
            // Stoppe tous les minutages de contrôles
            this.listControls.forEach(function (y) {
                y.StopTiming();
            });
        };
        Reader.prototype.stopAllChronometers = function () {
            // Stoppe tous les chronomètres
            this.listControls.filter(function (x) {
                return (x instanceof Controls.CustomChronometer);
            }).forEach(function (y) {
                y.Stop();
            });
        };
        Reader.prototype.saveStopInAllDataControls = function () {
            // Enregistre StopDate dans tous les data controls
            var stopDate = new Date(Date.now());
            this.listControls.filter(function (x) {
                return (x instanceof Controls.DataControl);
            }).forEach(function (y) {
                y.SetStopDate(stopDate);
            });
            // DTS buttons
            var dtsButtons = this.listControls.filter(function (x) { return x._Type == "CustomButton" && x._Action == "TDS"; });
            if (dtsButtons.length > 0) {
                // 1 seul stop enregsitré            
                var d = new Models.Data();
                d.AttributeCode = "STOP";
                d.DataControlId = dtsButtons[0]._Id;
                d.ControlName = dtsButtons[0]._FriendlyName;
                d.ProductCode = this.CurrentScreen.ProductCode;
                d.ProductRank = this.CurrentScreen.ProductRank;
                d.Intake = this.CurrentScreen.Intake;
                d.Replicate = this.CurrentScreen.Replicate;
                d.Score = 1;
                d.Session = Number(this.Session.Progress.CurrentState.ServerCode);
                d.SubjectCode = this.CurrentScreen.SubjectCode;
                d.Type = "TDS";
                d.RecordedDate = new Date(Date.now());
                dtsButtons[0].AttachedData = d;
                dtsButtons[0].AttachedData.Time = (dtsButtons[0].AttachedData.RecordedDate.getTime() - this.getControlStartDate().getTime()) / 1000;
                dtsButtons[0].onDataChanged(dtsButtons[0].AttachedData);
                if (this.Session.Progress.ListData) {
                    var previousStop = this.Session.Progress.ListData.filter(function (x) { return x.AttributeCode == "STOP" && x.DataControlId == d.DataControlId && x.ProductCode == d.ProductCode && x.ProductRank == d.ProductRank && x.Replicate == d.Replicate && x.Session == d.Session && x.SubjectCode == d.SubjectCode; });
                    if (previousStop.length == 0) {
                        this.Session.Progress.ListData.push(dtsButtons[0].AttachedData);
                    }
                }
                // enregistrement start           
                var d1 = new Models.Data();
                d1.AttributeCode = "START";
                d1.DataControlId = dtsButtons[0]._Id;
                d1.ControlName = dtsButtons[0]._FriendlyName;
                d1.ProductCode = this.CurrentScreen.ProductCode;
                d1.ProductRank = this.CurrentScreen.ProductRank;
                d1.Replicate = this.CurrentScreen.Replicate;
                d1.Intake = this.CurrentScreen.Intake;
                d1.Score = 1;
                d1.Session = Number(this.Session.Progress.CurrentState.ServerCode);
                d1.SubjectCode = this.CurrentScreen.SubjectCode;
                d1.Type = "TDS";
                d1.RecordedDate = new Date(Date.now());
                dtsButtons[0].AttachedData = d1;
                dtsButtons[0].AttachedData.Time = 0;
                dtsButtons[0].onDataChanged(dtsButtons[0].AttachedData);
                if (this.Session.Progress.ListData) {
                    var previousStop = this.Session.Progress.ListData.filter(function (x) { return x.AttributeCode == "START" && x.DataControlId == d.DataControlId && x.ProductCode == d.ProductCode && x.ProductRank == d.ProductRank && x.Replicate == d.Replicate && x.Session == d.Session && x.SubjectCode == d.SubjectCode; });
                    if (previousStop.length == 0) {
                        this.Session.Progress.ListData.push(dtsButtons[0].AttachedData);
                    }
                }
            }
        };
        Reader.prototype.goToPreviousScreen_ButtonClick = function (customButton) {
            if (customButton.HtmlElement.classList.contains("disabled")) {
                return;
            }
            // Désactivation du bouton
            customButton.Disable();
            // Page précédente
            this.goToPreviousScreen();
        };
        Reader.prototype.goToNextScreen_ButtonClick = function (customButton, add, action, screenIndex) {
            if (add === void 0) { add = "nothing"; }
            if (action === void 0) { action = undefined; }
            if (screenIndex === void 0) { screenIndex = undefined; }
            if (customButton.HtmlElement.classList.contains("disabled")) {
                return;
            }
            // Validation
            var canGoToNextPage = true;
            var message = "";
            for (var i = 0; i < this.listControls.length; i++) {
                canGoToNextPage = canGoToNextPage && this.listControls[i].IsValid;
                if (this.listControls[i].ValidationMessage && this.listControls[i].ValidationMessage.length > 0) {
                    message += this.listControls[i].ValidationMessage + "\r\n";
                }
            }
            this.ValidationMessage = message;
            if (canGoToNextPage == true) {
                // Désactivation du bouton
                customButton.Disable();
                if (add == "replicate") {
                    // Ajout d'une rép
                    this.addRep();
                }
                if (add == "intake") {
                    // Ajout d'une rép
                    this.addIntake();
                }
                // Recherche de renvoi vers des ancres
                //TODO : questiontablecontrol, custombutton gotoanchorid
                var anchorId = null;
                //var redirectQuestionControls = this.listControls.filter((x) => {
                //    return x instanceof Controls.QuestionControl && (<Controls.QuestionControl>x)._ListConditions.length > 0;
                //});
                //for (var i = 0; i < redirectQuestionControls.length; i++) {
                //    anchorId = (<Controls.QuestionControl>redirectQuestionControls[i]).VerifyConditions();
                //}
                var anchorIndex = screenIndex;
                if (anchorId != null && anchorId.length > 0) {
                    anchorIndex = this.getScreenWithAnchorId(anchorId);
                }
                if (anchorIndex == null) {
                    // Page suivante                
                    this.goToNextScreen(null, action);
                }
                else {
                    // Page contenant l'ancre
                    this.goToNextScreen(anchorIndex, action);
                }
                //if (action) {
                //    action();
                //}
            }
            else {
                this.onValidationError(message);
            }
        };
        Reader.prototype.getScreenWithAnchorId = function (anchorId) {
            var index = null;
            for (var i = 0; i < this.listScreens.length; i++) {
                //TODO : supprimer référence à XAML
                //if (this.listScreens[i].Screen.XamlContent.indexOf("AnchorControl") > -1) {
                //    let canvas: Element = Models.Screen.ReadXAML(this.listScreens[i].Screen.XamlContent);
                //    let controls = Models.Screen.SetControlsFromCanvas(canvas);
                //    let anchors = controls.filter((x) => { return x._Type == "AnchorControl" && (<Controls.AnchorControl>x)._AnchorId == anchorId });
                //    if (anchors.length > 0) {
                //        return i;
                //    }
                //}
            }
            return index;
        };
        Reader.prototype.createToolBar = function () {
            var self = this;
            var div = document.createElement("div");
            div.id = "simulationToolBar";
            div.style.position = "absolute";
            div.classList.add("simulationToolBar");
            var info = Framework.Form.Button.Create(function () { return true; }, function () {
            }, "", ["toolboxbutton", "getProgressInfoButton"], Framework.LocalizationManager.Get("GetProgressInfoTooltip"));
            info.HtmlElement.id = "GetProgressInfo";
            if (this.state.IsInDemo || this.state.IsPanelLeader) {
                div.appendChild(info.HtmlElement);
                div.appendChild(Framework.Form.Button.Create(function () { return true; }, function () {
                    self.GoToFirstScreenAsPanelLeader();
                }, "", ["toolboxbutton", "goToFirstScreenButton"], Framework.LocalizationManager.Get("GoToFirstScreenTooltip")).HtmlElement);
                div.appendChild(Framework.Form.Button.Create(function () { return true; }, function () {
                    self.GoToPreviousScreenAsPanelLeader();
                }, "", ["toolboxbutton", "goToPreviousScreenButton"], Framework.LocalizationManager.Get("GoToPreviousScreenTooltip")).HtmlElement);
                div.appendChild(Framework.Form.Button.Create(function () { return true; }, function () {
                    self.GoToNextScreenAsPanelLeader();
                }, "", ["toolboxbutton", "goToNextScreenButton"], Framework.LocalizationManager.Get("GoToNextScreenTooltip")).HtmlElement);
                div.appendChild(Framework.Form.Button.Create(function () { return true; }, function () {
                    self.GoToLastScreenAsPanelLeader();
                }, "", ["toolboxbutton", "goToLastScreenButton"], Framework.LocalizationManager.Get("GoToLastScreenTooltip")).HtmlElement);
            }
            if (this.state.IsPanelLeader) {
                div.appendChild(Framework.Form.Button.Create(function () { return true; }, function () {
                    self.SaveProgressAsPanelLeader();
                }, "", ["toolboxbutton", "saveProgressButton"], Framework.LocalizationManager.Get("SaveProgressTooltip")).HtmlElement);
                div.appendChild(Framework.Form.Button.Create(function () { return true; }, function () {
                    self.SaveSessionFile();
                }, "", ["toolboxbutton", "saveSessionFileButton"], Framework.LocalizationManager.Get("SaveSessionFileTooltip")).HtmlElement);
            }
            this.currentScreenDiv.parentElement.appendChild(div);
            $(div).draggable({ containment: "parent" });
        };
        Reader.prototype.Screenshot = function (listImg, lastScreenCallback) {
            if (listImg === void 0) { listImg = []; }
            var self = this;
            var height = window.innerHeight;
            var width = window.innerHeight * (this.currentScreenDiv.clientWidth / this.currentScreenDiv.clientHeight);
            Framework.Screenshot.Capture(this.currentScreenDiv, function (x) {
                listImg.push(x);
                self.GoToNextScreenAsPanelLeader();
                if (listImg.length != self.listScreens.length) {
                    self.Screenshot(listImg, lastScreenCallback);
                }
                else {
                    lastScreenCallback(listImg);
                }
            }, height, width);
        };
        Reader.prototype.GoToNextScreenAsPanelLeader = function () {
            this.stopAllTimers();
            if (this.Session.Progress.CurrentState.CurrentScreen != this.Session.Progress.CurrentState.CountScreen - 1) {
                this.Session.Progress.CurrentState.CurrentScreen++;
                this.SetSubjectScreen(this.Session.Progress.CurrentState.CurrentScreen, false, this.height, this.width);
            }
        };
        Reader.prototype.GoToPreviousScreenAsPanelLeader = function () {
            this.stopAllTimers();
            if (this.Session.Progress.CurrentState.CurrentScreen != 0) {
                this.Session.Progress.CurrentState.CurrentScreen--;
                this.SetSubjectScreen(this.Session.Progress.CurrentState.CurrentScreen, false, this.height, this.width);
            }
        };
        Reader.prototype.GoToFirstScreenAsPanelLeader = function () {
            this.stopAllTimers();
            this.Session.Progress.CurrentState.CurrentScreen = 0;
            this.SetSubjectScreen(this.Session.Progress.CurrentState.CurrentScreen, false, this.height, this.width);
        };
        Reader.prototype.GoToLastScreenAsPanelLeader = function () {
            this.stopAllTimers();
            this.Session.Progress.CurrentState.CurrentScreen = this.listScreens.length - 1;
            this.SetSubjectScreen(this.Session.Progress.CurrentState.CurrentScreen, false, this.height, this.width);
        };
        Reader.prototype.SaveProgressAsPanelLeader = function () {
            var self = this;
            this.onSaveProgressAsPanelLeader(function () {
                //self.SaveProgressAsPanelLeader();
                self.onProgressUpload(function () { });
            });
        };
        Reader.prototype.SetSubjectScreen = function (screenIndex, goBack, height, width) {
            if (goBack === void 0) { goBack = false; }
            if (height === void 0) { height = window.innerHeight; }
            if (width === void 0) { width = window.innerWidth; }
            // goBack = true si c'est un retour en arrière (click sur previous page) -> TODO = traitement spécial (contrôles temporels ?)
            this.height = height;
            this.width = width;
            // Efface les contrôles de la div currentScreen
            this.currentScreenDiv.innerHTML = "";
            // Index de l'écran courant
            this.Session.Progress.CurrentState.CurrentScreen = screenIndex;
            if (screenIndex >= this.listScreens.length) {
                // Dernier écran
                this.onLastScreen();
                this.currentScreenDiv.className = "logo";
                return;
            }
            this.CurrentScreen = this.listScreens[this.Session.Progress.CurrentState.CurrentScreen];
            if (this.Session.Progress.DisplayedScreenIndex == undefined) {
                this.Session.Progress.DisplayedScreenIndex = [];
            }
            this.Session.Progress.DisplayedScreenIndex.push(this.Session.Progress.CurrentState.CurrentScreen);
            //alert(this.Session.Progress.DisplayedScreenIndex.join(","));
            //this.CurrentScreen.AlreadyDisplayed = true;
            this.listControls = Models.Screen.SetControls(this.listScreens[screenIndex].Screen);
            var div = Models.Screen.RenderContainer(this.CurrentScreen.Screen, height, width);
            //let div = Models.Screen.Render(this.CurrentScreen.Screen, height, width, this.Session.ListExperimentalDesigns, (control: ScreenReader.Controls.BaseControl) => {  });
            this.currentScreenDiv.style.cssText = div.style.cssText;
            this.currentScreenDiv.style.margin = "auto";
            this.currentScreenDiv.style.position = "relative";
            this.DisplayDate = new Date(Date.now());
            this.Render();
            this.onScreenChanged();
            if (this.OnScreenChanged) {
                this.OnScreenChanged(this.Session.Progress.CurrentState.CurrentScreen);
            }
        };
        Reader.prototype.GetIndexOfScreenId = function (screenId) {
            var index = 0;
            this.listScreens.filter(function (sc, ind) {
                if (sc.Screen.Id == screenId) {
                    index = ind;
                    return index;
                }
            });
            return index;
        };
        Reader.prototype.saveDataControls = function (listDataControls) {
            //if (this.IsInDemo == true) {
            //    // En mode simulation les données ne sont pas enregistrées
            //    return;
            //}
            // Commenté car nécessaire pour charger score préexistant
            if (this.Session.Progress.ListData == undefined) {
                this.Session.Progress.ListData = [];
            }
            // Enregistrement dans objet
            for (var i = 0; i < listDataControls.length; i++) {
                var dataControl = listDataControls[i];
                for (var j = 0; j < dataControl.ListData.length; j++) {
                    //TODO : vérifier si données existe déjà en cas de goBack (cf savedata)
                    if (dataControl.ListData[j].Time && dataControl.ListData[j].Time < 0) {
                    }
                    else {
                        this.Session.Progress.ListData.push(dataControl.ListData[j]);
                    }
                }
            }
        };
        Reader.prototype.saveLocalProgress = function () {
            // TODO : mettre ça dans panelist
            if (this.state.IsInDemo == true) {
                // En mode simulation les données ne sont pas enregistrées
                return;
            }
            // Sauvegarde locale (clé = code session + _ + code juge)  // Attention au quota
            try {
                this.Session.Progress.CurrentState.CountScreen = this.listScreens.length;
                this.Session.Progress.CurrentState.LastAccess = new Date(Date.now());
                var json = JSON.stringify(this.Session.Progress);
                // Prise en compte des caractères japonais -> Appliquer ça partout où nécessaire
                json = json.replace(/[\u007F-\uFFFF]/g, function (chr) {
                    return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
                });
                Framework.LocalStorage.SaveToLocalStorage(this.Session.Progress.CurrentState.ServerCode + "_" + this.Session.Progress.CurrentState.SubjectCode, json, true);
            }
            catch (ex) {
                this.onError(new Error(Framework.LocalizationManager.Get("UnableToSaveToLocalStorage")));
            }
        };
        Reader.prototype.resetScreenList = function () {
            // Création des écrans si la page contient un controle FreeListOfTerms
            var containsFreeListOfTerms = this.listControls.filter(function (x) {
                return (x instanceof Controls.FreeListOfTerms);
            }).length > 0;
            if (containsFreeListOfTerms == true) {
                this.createAllScreens();
            }
        };
        Reader.prototype.goToScreenIf = function (conditions) {
            var _loop_2 = function (i) {
                var condition = Framework.Factory.CreateFrom(Controls.GoToScreenCondition, conditions[i]);
                var dataControl = this_1.listControls.filter(function (x) { return x._FriendlyName == condition.DataControlId; })[0];
                var dataControlValue = dataControl.GetValue();
                if (condition.IsVerified(dataControlValue) == true) {
                    this_1.goToScreen(condition.ScreenId);
                    return "break";
                }
            };
            var this_1 = this;
            // Dès qu'une condition de la liste est vérifiée, redirige vers l'écran
            for (var i = 0; i < conditions.length; i++) {
                var state_1 = _loop_2(i);
                if (state_1 === "break")
                    break;
            }
        };
        Reader.prototype.goToScreenOfSampleCodeInput = function (btn, designId, action) {
            if (action === void 0) { action = undefined; }
            for (var i = 0; i < this.listScreens.length; i++) {
                var sampleCodeInputs = this.listScreens[i].Screen.Controls.filter(function (x) { return x._Type == "SampleCodeInput"; });
                if (this.listScreens[i].Screen.ExperimentalDesignId == designId && sampleCodeInputs.length > 0) {
                    if (sampleCodeInputs[0]._AddRep == true) {
                        this.goToNextScreen_ButtonClick(btn, "replicate", action, i);
                    }
                    else {
                        this.goToNextScreen_ButtonClick(btn, "", action);
                    }
                    break;
                }
            }
        };
        Reader.prototype.goToScreenOfDesignItem = function (designId, code) {
            //let indexes: number[] = [];
            //for (let i = 0; i < this.listScreens.length; i++) {
            //    //if (this.listScreens[i].Screen.ExperimentalDesignId == designId && this.listScreens[i].AlreadyDisplayed == false && (this.listScreens[i].ProductCode == code || this.listScreens[i].AttributeCode == code)) {
            //    if (this.listScreens[i].Screen.ExperimentalDesignId == designId && (this.listScreens[i].ProductCode == code || this.listScreens[i].AttributeCode == code)) {
            //        indexes.push(i);
            //    }
            //}
            //if (indexes.length == 0) {
            //    return "WrongSampleCode";
            //}
            //let index = 0;
            //while (this.listScreens[indexes[index]].Screen.Controls.filter((x) => { return x._Type == "SampleCodeInput" }).length > 0) {
            //    index++;
            //    if (index == indexes.length) {
            //        return "SampleAlreadyTasted";
            //    }
            //}
            //
            //this.goToNextScreen(indexes[index]);
            var newIndex = -1;
            for (var i = 0; i < this.listScreens.length; i++) {
                if (this.listScreens[i].Screen.ExperimentalDesignId == designId /*&& this.Session.Progress.DisplayedScreenIndex.indexOf(i) >= 0*/ && (this.listScreens[i].ProductCode == code || this.listScreens[i].AttributeCode == code)) {
                    newIndex = i + 1;
                    break;
                }
            }
            //alert(newIndex);
            if (newIndex > -1) {
                if (this.Session.Progress.DisplayedScreenIndex.indexOf(newIndex) >= 0) {
                    return "SampleAlreadyTasted";
                }
                this.goToNextScreen(newIndex);
                return "";
            }
            else {
                return "WrongSampleCode";
            }
        };
        Reader.prototype.goToScreen = function (screenId) {
            // Va vers le premier écran avec l'id rencontré
            var indexes = [];
            for (var i = 0; i < this.listScreens.length; i++) {
                if (this.listScreens[i].Screen.Id == screenId) {
                    indexes.push(i);
                    break;
                }
            }
            var max = Math.max.apply(null, indexes);
            var min = Math.min.apply(null, indexes);
            var index = this.Session.Progress.CurrentState.CurrentScreen;
            if (this.Session.Progress.CurrentState.CurrentScreen > min) {
                index = max;
            }
            if (this.Session.Progress.CurrentState.CurrentScreen < max) {
                index = min;
            }
            this.goToNextScreen(index);
        };
        Reader.prototype.goToAnchor_ButtonClick = function (customButton) {
            var index = undefined;
            for (var i = 0; i < this.listScreens.length; i++) {
                var controls = Models.Screen.SetControls(this.listScreens[i].Screen);
                if (controls != undefined) {
                    var anchors = controls.filter(function (x) { return x._Type == "AnchorControl"; });
                    if (anchors.length > 0 && customButton._AnchorID == anchors[0]._AnchorId) {
                        index = i;
                    }
                }
                //else if (this.listScreens[i].Screen.XamlContent && this.listScreens[i].Screen.XamlContent.indexOf('AnchorControl') > -1) {
                //    // Fichier V1 : lecture XAML
                //    let elt: Element = this.readXMLOfScreen(i);
                //    for (let j = 0; j < elt.childNodes.length; j++) {
                //        if (elt.childNodes[j].nodeName == "my:AnchorControl") {
                //            if (customButton._AnchorID == elt.childNodes[j].attributes.getNamedItem("AnchorId").value) {
                //                index = i;
                //                break;
                //            }
                //        }
                //    }
                //}
            }
            this.goToNextScreen(index);
        };
        Reader.prototype.goToNextScreen = function (index, action) {
            if (index === void 0) { index = null; }
            if (action === void 0) { action = undefined; }
            var self = this;
            this.stopSpeechToText();
            this.stopTextToSpeech();
            this.stopRecorders();
            this.stopAllTimers();
            this.stopAllChronometers();
            this.saveStopInAllDataControls();
            // Enregistrement des données
            this.saveDataControls((this.listControls.filter(function (x) {
                return (x instanceof Controls.DataControl);
            })));
            // MAJ des écrans si la page contient un controle FreeListOfTerms
            this.resetScreenList();
            if (index == null) {
                // Indice de la page suivante
                this.Session.Progress.CurrentState.CurrentScreen++;
            }
            else {
                // Navigation par ancre
                this.Session.Progress.CurrentState.CurrentScreen = index;
            }
            // Sauvegarde locale
            this.saveLocalProgress();
            // Upload des données sur le serveur
            this.onProgressUpload(function () {
                // Affichage du nouvel écran
                self.showCurrentScreen();
                if (action) {
                    action();
                }
            });
        };
        Reader.prototype.showCurrentScreen = function (goBack) {
            if (goBack === void 0) { goBack = false; }
            var self = this;
            //TODO : améliorer transition (fading ?)
            //$(this.currentScreenDiv).hide("drop", { direction: "left" }, "slow", () => {
            if (self.state.IsInSimulation == true) {
                this.SetSubjectScreen(this.Session.Progress.CurrentState.CurrentScreen, goBack, this.height, this.width);
            }
            else {
                self.SetSubjectScreen(self.Session.Progress.CurrentState.CurrentScreen, goBack);
            }
            $(self.currentScreenDiv).show();
            //});
        };
        Reader.prototype.goToPreviousScreen = function () {
            if (this.Session.Progress.CurrentState.CurrentScreen > 0) {
                var self_1 = this;
                this.stopAllTimers();
                this.stopAllChronometers();
                this.saveStopInAllDataControls();
                // Enregistrement dans l'objet        
                this.saveDataControls((this.listControls.filter(function (x) {
                    return (x instanceof Controls.DataControl);
                })));
                // Indice de la page suivante
                this.Session.Progress.CurrentState.CurrentScreen--;
                // Sauvegarde locale
                this.saveLocalProgress();
                // Upload sur le serveur
                this.onProgressUpload(function () {
                    self_1.showCurrentScreen(true);
                }, false);
                // Affichage du nouvel écran
                //this.showCurrentScreen(true);
                //TODO : afficher les valeurs déjà saisies dans les contrôles
            }
        };
        Reader.prototype.showProgress = function () {
            var res = Framework.LocalizationManager.Get("Screen") + ": " + (this.Session.Progress.CurrentState.CurrentScreen + 1) + "/" + this.listScreens.length;
            res += "<br/>" + Framework.LocalizationManager.Get("Subject") + ": " + this.Session.Subject.Code;
            if (this.CurrentScreen.Screen.ExperimentalDesignId > 0) {
                res += "<br/>" + Framework.LocalizationManager.Get("ExperimentalDesign") + ": " + this.CurrentScreen.Screen.ExperimentalDesignId;
                res += "<br/>" + Framework.LocalizationManager.Get("Replicate") + ": " + this.CurrentScreen.Replicate;
                if (this.CurrentScreen.ProductCode) {
                    res += "<br/>" + Framework.LocalizationManager.Get("ProductRank") + ": " + this.CurrentScreen.ProductRank + " (" + this.CurrentScreen.ProductCode + ")";
                }
                if (this.CurrentScreen.AttributeCode) {
                    res += "<br/>" + Framework.LocalizationManager.Get("AttributeRank") + ": " + this.CurrentScreen.AttributeRank + " (" + this.CurrentScreen.AttributeCode + ")";
                }
            }
            // Affichage progression
            this.displayProgress(res);
        };
        Reader.prototype.displayProgress = function (message) {
            setTimeout(function () {
                var elt = $('#GetProgressInfo')[0];
                if (elt) {
                    $(elt)
                        .tooltipster({ 'contentAsHTML': true, 'timer': 3000 })
                        .tooltipster('content', message)
                        .tooltipster('option', 'side', 'top')
                        .tooltipster('option', 'theme', 'light')
                        .tooltipster('open');
                }
            }, 200);
        };
        Reader.prototype.showDataNotification = function (data) {
            if (this.actions.OnDataChanged) {
                this.actions.OnDataChanged(data);
                return;
            }
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
            // Affichage progression
            this.displayProgress(txt);
        };
        Reader.prototype.SaveSessionFile = function () {
            // Enregistrement de la séance du juge pour utilisation locale
            //for (var i = 0; i < this.Session.ListScreens.length; i++) {
            //    if (this.Session.ListScreens[i].Controls == undefined) {
            //        // Fichier créé en Silverlight : lecture de XAMLContent  
            //        var xml: string = this.Session.ListScreens[i].XamlContent;
            //        var canvas: Element = Models.Screen.ReadXAML(xml);
            //        if (canvas.getAttribute("Background") != undefined) {
            //            this.Session.ListScreens[i].Background = canvas.getAttribute("Background").valueOf();
            //        }
            //        this.Session.ListScreens[i].Controls = Models.Screen.SetControlsFromCanvas(canvas);
            //    }
            //}
            for (var i = 0; i < this.Session.ListScreens.length; i++) {
                delete this.Session.ListScreens[i].XamlContent;
            }
            var fileName = this.Session.Access.ServerCode + "_" + this.Session.Access.SubjectCode + ".xml";
            Framework.FileHelper.SaveObjectAs(this.Session, fileName);
        };
        return Reader;
    }());
    ScreenReader.Reader = Reader;
    var Controls;
    (function (Controls) {
        var BaseControl = /** @class */ (function () {
            //constructor(control: Element = null) {
            function BaseControl() {
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "Canvas.Top", "_Top", "number");
                //    this.setPropertyFromXaml(control, "Canvas.Left", "_Left", "number");
                //    this.setPropertyFromXaml(control, "Canvas.ZIndex", "_ZIndex", "number");
                //    this.setPropertyFromXaml(control, "Width", "_Width", "number");
                //    this.setPropertyFromXaml(control, "Height", "_Height", "number");
                //    this.setPropertyFromXaml(control, "FontFamily", "_FontFamily");
                //    this.setPropertyFromXaml(control, "FontSize", "_FontSize", "number");
                //    this.setPropertyFromXaml(control, "FontStyle", "_FontStyle");
                //    this.setPropertyFromXaml(control, "Background", "_Background", 'color');
                //    this.setPropertyFromXaml(control, "Foreground", "_Foreground", 'color');
                //    this.setPropertyFromXaml(control, "BorderBrush", "_BorderBrush", 'color');
                //    this.setPropertyFromXaml(control, "Id", "_Id");
                //    this.setPropertyFromXaml(control, "Opacity", "_Opacity");
                //    this.setPropertyFromXaml(control, "Tag", "_Tag");
                //    this.setPropertyFromXaml(control, "FontWeight", "_FontWeight");
                //    this.setPropertyFromXaml(control, "IsModal", "_IsModal");
                //    this.setPropertyFromXaml(control, "StartWithChronometer", "_StartWithChronometer");
                //    this.setPropertyFromXaml(control, "CustomSound", "_CustomSoundWhenDisplayed");
                // Propriétés customisables
                // Seuls les attributs préfixés par "_" sont visibles et modifiables dans TimeSens pour Panel Leader. Seuls ces attributs sont sérialisés et enregistrés dans le fichier séance.
                this._Top = 0; // Coordonnée pour positionnement vertical du contrôle à l'écran
                this._Left = 0; // Coordonnée pour positionnement horizontal du contrôle à l'écran
                this._ZIndex = 0; // Coordonnée pour positionnement Z du contrôle à l'écran
                this._Width = 20; // Largeur du conteneur du contrôle
                this._Height = 20; // Hauteur du conteneur du contrôle
                this._FontFamily = "Trebuchet MS,Arial"; // Police de caractère
                this._FontSize = 32; // Taille de police (en pixels)
                this._FontWeight = ""; // Epaisseur de la police (bold)
                this._FontStyle = ""; // Style de la police (italic)            
                this._Foreground = "black";
                this._Background = "white"; // Couleur de fond du conteneur
                this._BorderThickness = 0; // Epaisseur de la bordure du conteneur            
                this._BorderBrush = "black"; // Couleur de la bordure du conteneur
                this._Id = 0; // Identifiant unique du contrôle, conservé pour compatibilité
                this._Opacity = 1; // Opacité du conteneur
                this._Tag = ""; // Tag
                this._IsModal = false; // Propriétés de minutage. Si oui, simule un affiche modal
                this._Events = []; // Propriétés de minutage. Minutage de l'apparition/disparition de la zone de texte
                this._PlaySoundWhenDisplayed = ""; // Propriétés de minutage. Si oui, joue un son à chaque apparition de la boite
                this._CustomSoundWhenDisplayed = ""; // Propriétés de minutage. Si défini, son joué à chaque apparition de la boite (sinon son par défaut). Base64 string.
                this._StartWithChronometer = false; // Propriétés de minutage. Démarrage des événements en même temps que le click sur start ?
                this._Group = []; //Liste des groupes de contrôles auquel est rattaché le contrôle
                this._VocalEnabled = true;
                this._FriendlyName = ""; // Friendly name (remplace Id + AkaName de la V1)
                this.OnSpeechRecognized = undefined;
                this.IsValid = true; // Contrôle valide ou non (bloque passage à l'écran suivant si non valide)
                this.ValidationMessage = ""; // Message d'erreur si contrôle non valide
                this.IsEnabled = true; // Contrôle actif ou non
                this.IsVisible = true; // Contrôle visible ou non        
                //public OnFriendlyNameChanged: (oldName: string, newName: string) => void;
                //public BeforePropertyChanged: (propertyName: string, propertyValue: any) => void = () => { };
                this.OnPropertyChanged = function () { };
                this.DefaultLeftCoordinate = "";
                this.DefaultTopCoordinate = "";
                this.DefaultHeight = 100;
                this.DefaultWidth = 100;
                this.additionalEditableProperties = [];
                this.isCompatibleWithBrowser = true;
                //    // Conservé pour compatibilité
                //    let playSound = this.getPropertyFromXaml(control, "PlaySoundWhenDisplayed", false);
                //    if (playSound == true && this._CustomSoundWhenDisplayed.length > 0) {
                //        this._PlaySoundWhenDisplayed = "CustomSound";
                //    } else if (playSound == true && this._CustomSoundWhenDisplayed.length == 0) {
                //        this._PlaySoundWhenDisplayed = "DefaultSound";
                //    } else {
                //        this._PlaySoundWhenDisplayed = "NoSound";
                //    }
                //    this._BorderThickness = Number((<string>this.getPropertyFromXaml<string>(control, "BorderThickness", "0")).split(",", 1));
                //    let events: string = this.getPropertyFromXaml<string>(control, "Events", "");
                //    if (events.length > 0) {
                //        try {
                //            this._Events = Framework.Serialization.JsonToInstance<Models.TimerEvent[]>([], events);
                //        } catch (ex) {
                //            this._Events = [];
                //        }
                //    }
                //}
                //if (this._FontFamily == "Portable User Interface") {
                //    this._FontFamily = "Verdana";
                //}
                if (this._Events == undefined || this._Events.length == 0) {
                    this._Events = [];
                    var event_1 = new Models.TimerEvent();
                    event_1.Action = "visible";
                    event_1.Time = 0;
                    this._Events.push(event_1);
                }
            }
            BaseControl.prototype.toJSON = function () {
                // Surcharge de toJSON pour exposer seulement les propriétés à sérialiser
                var obj = {};
                for (var propertyName in this) {
                    if (propertyName.substring(0, 1) == "_") {
                        obj[propertyName.toString()] = this[propertyName];
                    }
                }
                return obj;
            };
            BaseControl.prototype.StartTiming = function () {
                var _this = this;
                // Démarre le minutage du contrôle
                var time = 0;
                var maxTime = 1;
                this._Events.forEach(function (x) {
                    if (x.Time > maxTime) {
                        maxTime = x.Time + 1;
                    }
                });
                var _self = this;
                this.displayTimer = setInterval(function () {
                    var actions = (_self._Events.filter(function (x) { return x.Time == time; }));
                    if (actions.length > 0) {
                        if (actions[0].Action == "visible") {
                            // Affiche le controle
                            _self.HtmlElement.style.display = "block";
                            if (_self._PlaySoundWhenDisplayed == "CustomSound" && _self._CustomSoundWhenDisplayed.length > 0) {
                                Framework.Sound.PlayB64Sound(_self._CustomSoundWhenDisplayed);
                            }
                            if (_self._PlaySoundWhenDisplayed == "DefaultSound") {
                                Framework.Sound.PlaySound('bip.mp3');
                            }
                            if (_self._IsModal == true && document.getElementById('currentScreen')) {
                                // Grise tout sauf le controle en cours                                                 
                                document.getElementById('currentScreen').appendChild(_self.modalDiv);
                                _self.HtmlElement.style.zIndex = "100001";
                                _self.HtmlElement.style.background = 'white';
                            }
                        }
                        if (actions[0].Action == "hidden") {
                            // Masque le controle
                            _self.HtmlElement.style.display = "none";
                            if (_self._IsModal == true) {
                                // suppression du masque gris
                                if (document.body.contains(_self.modalDiv)) {
                                    document.getElementById('currentScreen').removeChild(_self.modalDiv);
                                }
                                _self.HtmlElement.style.zIndex = _this._ZIndex.toString();
                                _self.HtmlElement.style.background = _this._Background;
                            }
                        }
                    }
                    time++;
                    if (time > maxTime) {
                        clearInterval(_self.displayTimer);
                        ;
                    }
                }, 1000);
            };
            BaseControl.prototype.StopTiming = function () {
                // Arrête le minutage du contrôle
                clearInterval(this.displayTimer);
            };
            BaseControl.prototype.CheckCompatibility = function () {
                var res = "";
                return res;
            };
            BaseControl.prototype.Show = function () {
                // Affiche le contrôle
                this.IsVisible = true;
                $(this.HtmlElement).show();
            };
            BaseControl.prototype.Hide = function () {
                // Masque le contrôle
                this.IsVisible = false;
                $(this.HtmlElement).hide();
            };
            BaseControl.prototype.Scrollable = function () {
                // Rend le conteneur scrollable si contenu déborder
                var self = this;
                setTimeout(function () {
                    if (self.HtmlElement.scrollHeight > self.HtmlElement.clientHeight + 4) {
                        self.HtmlElement.classList.add("hiddenOverflow");
                    }
                }, 10);
            };
            BaseControl.prototype.SetBorder = function (width, color) {
                if (width == 0) {
                    this.HtmlElement.style.border = "0";
                }
                else {
                    this.HtmlElement.style.border = "solid";
                    this.HtmlElement.style.borderWidth = width + "px";
                    this.HtmlElement.style.borderColor = color;
                }
            };
            BaseControl.prototype.SetBorderBackground = function (color) {
                this.HtmlElement.style.background = color;
            };
            BaseControl.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                var self = this;
                self.Ratio = ratio;
                // Gardé pour compatibilité
                if (this._Id != undefined && this._Id != 0) {
                    if (this._FriendlyName != undefined && this._FriendlyName.length > 0) {
                    }
                    else {
                        this._FriendlyName = this._Id.toString();
                    }
                }
                // Rendu du conteneur principal du contrôle (div)    
                this.HtmlElement = document.createElement("div");
                if (editMode == false && this._Events && this._Events.length > 0 && this._Events[0].Time == 0 && this._Events[0].Action == "hidden") {
                    this.HtmlElement.style.display = "none";
                }
                //if (this._Id != undefined) {
                //    this.HtmlElement.id = this._Id.toString();
                //}
                if (this._FriendlyName != undefined) {
                    this.HtmlElement.id = this._FriendlyName;
                }
                //let ratio: number = 1;
                //if (self.screen) {
                //    ratio = self.screen.Ratio;
                //}
                //this.Ratio = ratio;
                this.HtmlElement.style.position = "absolute";
                this.HtmlElement.style.left = (this._Left * ratio) + "px";
                this.HtmlElement.style.top = (this._Top * ratio) + "px";
                this.HtmlElement.style.zIndex = this._ZIndex != undefined ? this._ZIndex.toString() : "1000";
                this.HtmlElement.style.width = (this._Width * ratio) + "px";
                this.HtmlElement.style.height = (this._Height * ratio) + "px";
                this.HtmlElement.style.opacity = this._Opacity != undefined ? this._Opacity.toString() : "1";
                this.HtmlElement.style.background = this._Background;
                this.HtmlElement.style.border = "solid";
                this.HtmlElement.style.borderWidth = this._BorderThickness + "px";
                this.HtmlElement.style.borderColor = this._BorderBrush;
                // Div qui vient en recouvrement pour simuler un affichage modal (minutage)
                if (this._IsModal == true) {
                    this.modalDiv = document.createElement("div");
                    this.modalDiv.style.width = "100%";
                    this.modalDiv.style.height = "100%";
                    this.modalDiv.style.background = "black";
                    this.modalDiv.style.opacity = "0.6";
                    this.modalDiv.style.zIndex = "100000";
                    this.modalDiv.style.position = "absolute";
                }
                // Test compatibilité navigateur
                if (this.CheckCompatibility() != "") {
                    this.HtmlElement.style.border = "1px solid red";
                    this.HtmlElement.style.color = "red";
                    this.HtmlElement.style.lineHeight = this._Height + "px";
                    this.HtmlElement.style.textOverflow = "ellipsis";
                    this.HtmlElement.style.overflow = "hidden";
                    this.HtmlElement.style.whiteSpace = "nowrap";
                    this.HtmlElement.innerHTML = Framework.LocalizationManager.Get("ControlNotCompatibleWithBrowser");
                    this.HtmlElement.title = Framework.LocalizationManager.Get("ControlNotCompatibleWithBrowser");
                    this.isCompatibleWithBrowser = false;
                }
            };
            BaseControl.prototype.SetStickiness = function (gridStickiness, gridIncrement) {
                this.gridStickiness = gridStickiness;
                this.gridIncrement = gridIncrement;
            };
            BaseControl.prototype.SetScreen = function (screen) {
                this.screen = screen;
            };
            BaseControl.prototype.RenderWithAdorner = function (container, screen, ratio, additionalParameters) {
                var _this = this;
                if (screen === void 0) { screen = undefined; }
                if (additionalParameters === void 0) { additionalParameters = undefined; }
                var self = this;
                self.Ratio = ratio;
                // Conteneur (Div de l'écran')
                this.container = container;
                // Paramètres passés depuis panelleader
                this.parameters = additionalParameters;
                this.screen = screen;
                //this.gridStickiness = gridStickiness;
                //this.gridIncrement = gridIncrement;
                // Mode édition
                this.Render(true, ratio);
                this.HtmlElement.style.left = "0";
                this.HtmlElement.style.top = "0";
                this.Adorner = document.createElement("div");
                this.Adorner.style.position = "absolute";
                this.Adorner.style.left = (this._Left * ratio) + "px";
                this.Adorner.style.top = (this._Top * ratio) + "px";
                this.Adorner.style.width = (this._Width * ratio) + 4 + "px";
                this.Adorner.style.height = (this._Height * ratio) + 4 + "px";
                this.Adorner.appendChild(this.HtmlElement);
                this.container.appendChild(this.Adorner);
                // Clic sur l'élément : highlight
                this.HtmlElement.addEventListener(Framework.Events.Click, function (e) {
                    if (self.OnSelect) {
                        self.OnSelect(_this);
                    }
                }, false);
            };
            //private setHandleTitle() {
            //    this.Adorner.title = this._Type + ' #' + this._FriendlyName;
            //    if (this._Group.length > 0) {
            //        this.Adorner.title += " [" + this._Group.join(', ') + "]";
            //    }
            //    this.topLeftHandle.title = Math.round(this._Left) + ", " + Math.round(this._Top).toString();
            //    this.rightHandle.title = Math.round(this._Width).toString();
            //    this.bottomHandle.title = Math.round(this._Height).toString();
            //}
            BaseControl.prototype.Highlight = function () {
                var self = this;
                this.Adorner.classList.add("adornerBorder");
                // Poignée pour déplacer le contrôle (interact.js)
                this.borderHandle = document.createElement("div");
                //this.topLeftHandle.style.background = "red";
                //this.topLeftHandle.style.height = "100%";
                //this.topLeftHandle.style.width = "100%";
                //this.topLeftHandle.style.border = "3px solid darkblue";
                this.borderHandle.classList.add("draggableDiv");
                //this.topLeftHandle.innerHTML = '<i class="fas fa-arrows-alt fa-lg"></i>';
                this.Adorner.appendChild(this.borderHandle);
                // Poignées pour redimensionner le contrôle quand il est sélectionné
                this.rightHandle = this.createSizeHandle("Right");
                this.leftHandle = this.createSizeHandle("Left");
                this.bottomHandle = this.createSizeHandle("Bottom");
                this.topHandle = this.createSizeHandle("Top");
                //this.upLeftHandle = this.createSizeHandle("TopLeft");
                //this.bottomLeftHandle = this.createSizeHandle("BottomLeft");
                //this.upRightHandle = this.createSizeHandle("TopRight");
                //this.bottomRightHandle = this.createSizeHandle("BottomRight");
                this.Adorner.appendChild(this.rightHandle);
                this.Adorner.appendChild(this.leftHandle);
                this.Adorner.appendChild(this.bottomHandle);
                this.Adorner.appendChild(this.topHandle);
                //this.Adorner.appendChild(this.upLeftHandle);
                //this.Adorner.appendChild(this.upRightHandle);
                //this.Adorner.appendChild(this.bottomLeftHandle);
                //this.Adorner.appendChild(this.bottomRightHandle);
                this.HtmlElement.style.zIndex = "1000";
                // Bouton pour éditer les propriétés du contrôle
                //this.toolbar = Framework.Form.TextElement.Create("", ["toolbar"]);
                //let editButton = Framework.Form.Button.Create(() => { return true; }, () => { self.showPropertiesToolbar(); }, '<i class="fas fa-edit fa-lg"></i>', ["btnCircle", "btn24"], Framework.LocalizationManager.Get("ClickToOpen"));
                //this.toolbar.Append(editButton);
                // Ajout de la toolbar
                //this.Adorner.appendChild(this.toolbar.HtmlElement);
                //this.setHandleTitle();
                function dragElement(elmnt) {
                    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, top = 0, left = 0;
                    elmnt.onmousedown = dragMouseDown;
                    var parent = elmnt.parentElement;
                    var PADDING = 2;
                    var rect;
                    var viewport = {
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: 0
                    };
                    function dragMouseDown(e) {
                        e = e || window.event;
                        // get the mouse cursor position at startup:
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        // store the current viewport and element dimensions when a drag starts
                        rect = elmnt.getBoundingClientRect();
                        var clickOnBorder = false;
                        if (rect.left > (pos3 - 5) && rect.left < (pos3 + 5)) {
                            // Bordure gauche
                            clickOnBorder = true;
                        }
                        if (rect.right > (pos3 - 5) && rect.right < (pos3 + 5)) {
                            // Bordure droite
                            clickOnBorder = true;
                        }
                        if (rect.top > (pos4 - 5) && rect.top < (pos4 + 5)) {
                            // Bordure haut
                            clickOnBorder = true;
                        }
                        if (rect.bottom > (pos4 - 5) && rect.bottom < (pos4 + 5)) {
                            // Bordure bas
                            clickOnBorder = true;
                        }
                        viewport.bottom = parent.clientHeight - PADDING;
                        viewport.left = PADDING;
                        viewport.right = parent.clientWidth - PADDING;
                        viewport.top = PADDING;
                        document.onmouseup = closeDragElement;
                        // call a function whenever the cursor moves:
                        if (clickOnBorder) {
                            document.onmousemove = elementDrag;
                        }
                    }
                    function elementDrag(e) {
                        e = e || window.event;
                        // calculate the new cursor position:
                        pos1 = pos3 - e.clientX;
                        pos2 = pos4 - e.clientY;
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        // check to make sure the element will be within our viewport boundary
                        var newLeft = elmnt.offsetLeft - pos1;
                        var newTop = elmnt.offsetTop - pos2;
                        if (newLeft < viewport.left
                            || newTop < viewport.top
                            || newLeft + rect.width > viewport.right
                            || newTop + rect.height > viewport.bottom) {
                            // the element will hit the boundary, do nothing...
                        }
                        else {
                            top = (elmnt.offsetTop - pos2);
                            left = (elmnt.offsetLeft - pos1);
                            // set the element's new position:
                            if (isResizing == "") {
                                self.Adorner.style.top = top + "px";
                                self.Adorner.style.left = left + "px";
                            }
                            if (isResizing == "left") {
                                var l = elmnt.offsetLeft - newLeft;
                                var l2 = elmnt.clientWidth + l;
                                if (l2 >= 20) {
                                    elmnt.style.width = (l2) + "px";
                                }
                                self.Adorner.style.left = left + "px";
                            }
                            if (isResizing == "right") {
                                var l = newLeft - elmnt.offsetLeft;
                                var l2 = elmnt.clientWidth + l;
                                if (l2 >= 20) {
                                    elmnt.style.width = (l2) + "px";
                                }
                            }
                            if (isResizing == "bottom") {
                                var l = newTop - elmnt.offsetTop;
                                var l2 = elmnt.clientHeight + l;
                                if (l2 >= 20) {
                                    elmnt.style.height = (l2) + "px";
                                }
                            }
                            if (isResizing == "top") {
                                var l = elmnt.offsetTop - newTop;
                                var l2 = elmnt.clientHeight + l;
                                if (l2 >= 20) {
                                    elmnt.style.height = (l2) + "px";
                                }
                                self.Adorner.style.top = top + "px";
                            }
                        }
                    }
                    function closeDragElement() {
                        /* stop moving when mouse button is released:*/
                        document.onmouseup = null;
                        document.onmousemove = null;
                        if (left > 0 && top > 0) {
                            if (isResizing == "") {
                                self.SetLeft(left / self.Ratio);
                                self.SetTop(top / self.Ratio);
                            }
                            if (isResizing == "left") {
                                self.SetWidth(elmnt.clientWidth / self.Ratio);
                                self.SetLeft(left / self.Ratio);
                            }
                            if (isResizing == "right") {
                                self.SetWidth(elmnt.clientWidth / self.Ratio);
                            }
                            if (isResizing == "bottom") {
                                self.SetHeight(elmnt.clientHeight / self.Ratio);
                            }
                            if (isResizing == "top") {
                                self.SetHeight(elmnt.clientHeight / self.Ratio);
                                self.SetTop(top / self.Ratio);
                            }
                        }
                        isResizing = "";
                    }
                }
                // déplacement
                var isResizing = "";
                dragElement(this.Adorner);
                this.leftHandle.onmousedown = function (ev) {
                    isResizing = "left";
                };
                this.rightHandle.onmousedown = function (ev) {
                    isResizing = "right";
                    //self.rightHandle.classList.add("hidden");
                };
                this.bottomHandle.onmousedown = function (ev) {
                    isResizing = "bottom";
                };
                this.topHandle.onmousedown = function (ev) {
                    isResizing = "top";
                };
                //dragElement(this.Adorner, (left: number, top: number) => {
                //    //self.Adorner.style.width += left + "px";
                //    let w = self._Width;
                //    let ww = left / self.Ratio;
                //    self.Adorner.style.width = left + "px";
                //}, (left: number, top: number) => {
                //    //let memoryL = self._Left;
                //    //let l = Framework.Maths.Round(left / self.Ratio, 0);
                //    //self._Left = l;
                //    //self.OnPropertyChanged("_Left", memoryL, self._Left);
                //    //let memoryT = self._Top;
                //    //let t = Framework.Maths.Round(top / self.Ratio, 0);
                //    //self._Top = t;
                //    //self.OnPropertyChanged("_Top", memoryT, self._Top);
                //});
                //Framework.DragDropManager.Draggable(this.Adorner, document.getElementById('currentScreen'),
                //    () => {
                //        $('.tooltipster-show').tooltipster('hide');
                //    },
                //    (elt, dx, dy) => {
                //        dx = dx * self.Ratio;
                //        dy = dy * self.Ratio;
                //        self.SetLeft(self._Left + dx);
                //        self.SetTop(self._Top + dy);                            
                //    },
                //    () => {
                //        if (self.gridStickiness == true) {
                //            self.SetLeft(Math.floor(self._Left / self.gridIncrement) * self.gridIncrement);
                //            self.SetTop(Math.floor(self._Top / self.gridIncrement) * self.gridIncrement);
                //        }
                //    },
                //    this.topLeftHandle,
                //    undefined,
                //    this.Ratio
                //);
                //Framework.DragDropManager.Draggable(this.bottomHandle, document.getElementById('currentScreen'),
                //    () => {
                //    },
                //    (elt, dx, dy) => {
                //        dx = dx * self.Ratio;
                //        dy = dy * self.Ratio;
                //        if (self._Height + dy > 1) {
                //            self._Height += dy;
                //            self.SetHeight(self._Height + dy);
                //        }
                //    },
                //    () => {
                //        self.updateControl();
                //    },
                //    undefined,
                //    undefined,
                //    this.Ratio
                //);
                //Framework.DragDropManager.Draggable(this.topHandle, document.getElementById('currentScreen'),
                //    () => {
                //    },
                //    (elt, dx, dy) => {
                //        dx = dx * self.Ratio;
                //        dy = dy * self.Ratio;
                //        self.SetTop(self._Top + dy);
                //        if (self._Height - dy > 1) {
                //            self.SetHeight(self._Height - dy);
                //        }
                //    },
                //    () => {
                //        self.updateControl();
                //    },
                //    undefined,
                //    undefined,
                //    this.Ratio
                //);
                //Framework.DragDropManager.Draggable(this.rightHandle, document.getElementById('currentScreen'),
                //    () => {
                //    },
                //    (elt, dx, dy) => {
                //        dx = dx * self.Ratio;
                //        dy = dy * self.Ratio;
                //        if (self._Width + dx > 1) {
                //            self.SetWidth(self._Width + dx);
                //        }
                //    },
                //    () => {
                //        self.updateControl();
                //    },
                //    undefined,
                //    undefined,
                //    this.Ratio
                //);
                //Framework.DragDropManager.Draggable(this.leftHandle, document.getElementById('currentScreen'),
                //    () => {
                //    },
                //    (elt, dx, dy) => {
                //        dx = dx * self.Ratio;
                //        dy = dy * self.Ratio;
                //        self.SetLeft(self._Left + dx);
                //        if (self._Width - dx > 1) {
                //            self.SetWidth(self._Width - dx);
                //        }
                //    },
                //    () => {
                //        self.updateControl();
                //    },
                //    undefined,
                //    undefined,
                //    this.Ratio
                //);
                //Framework.DragDropManager.Draggable(this.upLeftHandle, document.getElementById('currentScreen'),
                //    () => {
                //    },
                //    (elt, dx, dy) => {
                //        dx = dx * self.Ratio;
                //        dy = dy * self.Ratio;
                //        self.SetLeft(self._Left + dx);
                //        if (self._Width - dx > 1) {
                //            self.SetWidth(self._Width - dx);
                //        }
                //        self.SetTop(self._Top + dy);
                //        if (self._Height - dy > 1) {
                //            self.SetHeight(self._Height - dy);
                //        }
                //    },
                //    () => {
                //        self.updateControl();
                //    },
                //    undefined,
                //    undefined,
                //    this.Ratio
                //);
                //Framework.DragDropManager.Draggable(this.upRightHandle, document.getElementById('currentScreen'),
                //    () => {
                //    },
                //    (elt, dx, dy) => {
                //        dx = dx * self.Ratio;
                //        dy = dy * self.Ratio;
                //        if (self._Width + dx > 1) {
                //            self.SetWidth(self._Width + dx);
                //        }
                //        self.SetTop(self._Top + dy);
                //        if (self._Height - dy > 1) {
                //            self.SetHeight(self._Height - dy);
                //        }
                //    },
                //    () => {
                //        self.updateControl();
                //    },
                //    undefined,
                //    undefined,
                //    this.Ratio
                //);
                //Framework.DragDropManager.Draggable(this.bottomLeftHandle, document.getElementById('currentScreen'),
                //    () => {
                //    },
                //    (elt, dx, dy) => {
                //        dx = dx * self.Ratio;
                //        dy = dy * self.Ratio;
                //        self.SetLeft(self._Left + dx);
                //        if (self._Width - dx > 1) {
                //            self.SetWidth(self._Width - dx);
                //        }
                //        if (self._Height + dy > 1) {
                //            self._Height += dy;
                //            self.SetHeight(self._Height + dy);
                //        }
                //    },
                //    () => {
                //        self.updateControl();
                //    },
                //    undefined,
                //    undefined,
                //    this.Ratio
                //);
                //Framework.DragDropManager.Draggable(this.bottomRightHandle, document.getElementById('currentScreen'),
                //    () => {
                //    },
                //    (elt, dx, dy) => {
                //        dx = dx * self.Ratio;
                //        dy = dy * self.Ratio;
                //        if (self._Width + dx > 1) {
                //            self.SetWidth(self._Width + dx);
                //        }
                //        if (self._Height + dy > 1) {
                //            self._Height += dy;
                //            self.SetHeight(self._Height + dy);
                //        }
                //    },
                //    () => {
                //        self.updateControl();
                //    },
                //    undefined,
                //    undefined,
                //    this.Ratio
                //);
            };
            BaseControl.prototype.Update = function () {
                this.updateControl();
            };
            BaseControl.prototype.updateControl = function () {
                if (this.Adorner) {
                    if (this.container.contains(this.Adorner)) {
                        this.container.removeChild(this.Adorner);
                    }
                    this.RenderWithAdorner(this.container, this.screen, this.screen.Ratio, this.parameters);
                    this.Highlight();
                }
            };
            BaseControl.prototype.horizontalAlignLeft = function () {
                var memory = this._Left;
                this.Adorner.style.left = "0";
                this._Left = 0;
                this.updateControl();
                this.OnPropertyChanged("_Left", memory, this._Left);
            };
            BaseControl.prototype.horizontalAlignRight = function () {
                var memory = this._Left;
                //let newLeft = this.HtmlElement.parentElement.parentElement.clientWidth - this._Width;
                var newLeft = Models.Screen.Width(this.screen) - this._Width;
                this.Adorner.style.left = newLeft + "px";
                this._Left = newLeft;
                this.updateControl();
                this.OnPropertyChanged("_Left", memory, this._Left);
            };
            BaseControl.prototype.horizontalAlignCenter = function () {
                var memory = this._Left;
                //let newLeft = (this.HtmlElement.parentElement.parentElement.clientWidth - this._Width) / 2;
                var newLeft = (Models.Screen.Width(this.screen) - this._Width) / 2;
                this.Adorner.style.left = newLeft + "px";
                this._Left = newLeft;
                this.updateControl();
                this.OnPropertyChanged("_Left", memory, this._Left);
            };
            BaseControl.prototype.verticalAlignCenter = function () {
                var memory = this._Top;
                //let newTop = (this.HtmlElement.parentElement.parentElement.clientHeight - this._Height) / 2;
                var newTop = (Models.Screen.Height - this._Height) / 2;
                this.Adorner.style.top = newTop + "px";
                this._Top = newTop;
                this.updateControl();
                this.OnPropertyChanged("_Top", memory, this._Top);
            };
            BaseControl.prototype.verticalAlignTop = function () {
                var memory = this._Top;
                var newTop = 10;
                this.Adorner.style.top = newTop + "px";
                this._Top = newTop;
                this.updateControl();
                this.OnPropertyChanged("_Top", memory, this._Top);
            };
            BaseControl.prototype.verticalAlignBottom = function () {
                var memory = this._Top;
                //let newTop = (this.HtmlElement.parentElement.parentElement.clientHeight - this._Height - 10);
                var newTop = Models.Screen.Height - this._Height - 10;
                this.Adorner.style.top = newTop + "px";
                this._Top = newTop;
                this.updateControl();
                this.OnPropertyChanged("_Top", memory, this._Top);
            };
            BaseControl.prototype.rotateLeft = function () {
                alert("TODO: rotate left");
            };
            BaseControl.prototype.rotateRight = function () {
                alert("TODO: rotate left");
            };
            BaseControl.prototype.forward = function () {
                var memory = this._ZIndex;
                this._ZIndex = 10000;
                this.HtmlElement.style.zIndex = "10000";
                this.OnPropertyChanged("_ZIndex", memory, this._ZIndex);
                //TODO : améliorer
            };
            BaseControl.prototype.backward = function () {
                var memory = this._ZIndex;
                this._ZIndex = 0;
                this.HtmlElement.style.zIndex = "0";
                this.OnPropertyChanged("_ZIndex", memory, this._ZIndex);
                //TODO : améliorer
            };
            BaseControl.prototype.changeBorderBackground = function (color) {
                var memory = this._Background;
                this._Background = color;
                this.HtmlElement.style.background = color;
                this.updateControl();
                this.OnPropertyChanged("_Background", memory, this._Background);
            };
            BaseControl.prototype.changeBorderColor = function (color) {
                var memory = this._BorderBrush;
                this._BorderBrush = color;
                this.HtmlElement.style.borderColor = color;
                this.OnPropertyChanged("_BorderBrush", memory, this._BorderBrush);
            };
            BaseControl.prototype.changeBorderThickness = function (thickness) {
                var memory = this._BorderThickness;
                this._BorderThickness = thickness;
                this.HtmlElement.style.borderWidth = thickness + "px";
                //TOFIX : si bouton, le texte n'est plus centré
                this.OnPropertyChanged("_BorderThickness", memory, this._BorderThickness);
            };
            BaseControl.prototype.delete = function () {
                Models.Screen.RemoveControl(this.screen, this);
                if (this.Adorner) {
                    this.container.removeChild(this.Adorner);
                }
                else if (this.HtmlElement) {
                    this.container.removeChild(this.HtmlElement);
                }
            };
            BaseControl.prototype.SetLeft = function (left) {
                if (left <= 0) {
                    return;
                }
                if ((left + this._Width) >= Models.Screen.Width(this.screen)) {
                    return;
                }
                //let memory = this._Left;
                //left = Math.round(left);
                //this._Left = left;
                //if (this.Adorner) {
                //    this.Adorner.style.left = this._Left + "px";
                //    //this.setHandleTitle();
                //}
                //this.OnPropertyChanged("_Left", memory, this._Left);
                var self = this;
                var memory = self._Left;
                self._Left = left;
                self.OnPropertyChanged("_Left", memory, self._Left);
                self.updateControl();
            };
            BaseControl.prototype.SetTop = function (top) {
                if (top <= 0) {
                    return;
                }
                if ((top + this._Height) >= Models.Screen.Height) {
                    return;
                }
                var self = this;
                var memory = self._Top;
                self._Top = top;
                self.OnPropertyChanged("_Top", memory, self._Top);
                self.updateControl();
                //let memory = this._Top;
                //top = Math.round(top);
                //this._Top = top;
                //if (this.Adorner) {
                //    this.Adorner.style.top = this._Top + "px";
                //    //this.setHandleTitle();
                //}
                //this.OnPropertyChanged("_Top", memory, this._Top);
            };
            //public SetZIndex(z: number) {
            //    let memory = this._ZIndex;
            //    this._ZIndex = z;
            //    if (this.Adorner) {
            //        this.Adorner.style.zIndex = this._ZIndex.toString();
            //    }
            //    this.OnPropertyChanged("_ZIndex", memory, this._ZIndex);
            //}
            BaseControl.prototype.SetHeight = function (height) {
                //let memory = this._Height;
                //height = Math.round(height);
                //this._Height = height;
                //this.HtmlElement.style.height = this._Height + "px";
                //if (this.Adorner) {
                //    this.Adorner.style.height = this._Height + "px";
                //    this.updateSizeHandle(this.topHandle);
                //    this.updateSizeHandle(this.bottomHandle);
                //    //this.setHandleTitle();
                //}
                //this.OnPropertyChanged("_Height", memory, this._Height);
                //TODO : vérif
                var self = this;
                var memory = self._Height;
                self._Height = height;
                self.OnPropertyChanged("_Height", memory, self._Height);
                self.updateControl();
            };
            BaseControl.prototype.SetWidth = function (width) {
                //let memory = this._Width;
                //width = Math.round(width);
                //this._Width = width;
                //this.HtmlElement.style.width = this._Width + "px";
                //if (this.Adorner) {
                //    this.Adorner.style.width = this._Width + "px";
                //    this.updateSizeHandle(this.leftHandle);
                //    this.updateSizeHandle(this.rightHandle);
                //    //this.setHandleTitle();
                //}
                //this.OnPropertyChanged("_Width", memory, this._Width);
                //TODO : vérif
                var self = this;
                var memory = self._Width;
                self._Width = width;
                self.OnPropertyChanged("_Width", memory, self._Width);
                self.updateControl();
            };
            BaseControl.prototype.Delete = function () {
                this.delete();
            };
            BaseControl.prototype.changeProperty = function (propertyName, newPropertyValue) {
                var memory = this[propertyName];
                this[propertyName] = newPropertyValue;
                this.OnPropertyChanged(propertyName, memory, this[propertyName]);
            };
            BaseControl.prototype.GetPositionForm = function () {
                var self = this;
                var div = Framework.Form.TextElement.Create("");
                div.Append(Framework.Form.Button.Create(function () { return true; }, function () { self.DefaultLeftCoordinate = "Left"; self.horizontalAlignLeft(); }, '<i class="fas fa-arrow-left"></i>', ["btnCircle", "btn24", "btnBlack"], "HorizontalAlignLeft"));
                div.Append(Framework.Form.Button.Create(function () { return true; }, function () { self.DefaultLeftCoordinate = "Center"; self.horizontalAlignCenter(); }, '<i class="fas fa-arrows-alt-h"></i>', ["btnCircle", "btn24", "btnBlack"], "HorizontalAlignCenter"));
                div.Append(Framework.Form.Button.Create(function () { return true; }, function () { self.DefaultLeftCoordinate = "Right"; self.horizontalAlignRight(); }, '<i class="fas fa-arrow-right"></i>', ["btnCircle", "btn24", "btnBlack"], "HorizontalAlignRight"));
                div.Append(Framework.Form.Button.Create(function () { return true; }, function () { self.DefaultTopCoordinate = "Top"; self.verticalAlignTop(); }, '<i class="fas fa-arrow-up"></i>', ["btnCircle", "btn24", "btnBlack"], "VerticalAlignTop"));
                div.Append(Framework.Form.Button.Create(function () { return true; }, function () { self.DefaultTopCoordinate = "Center"; self.verticalAlignCenter(); }, '<i class="fas fa-arrows-alt-v"></i>', ["btnCircle", "btn24", "btnBlack"], "VerticalAlignCenter"));
                div.Append(Framework.Form.Button.Create(function () { return true; }, function () { self.DefaultTopCoordinate = "Bottom"; self.verticalAlignBottom(); }, '<i class="fas fa-arrow-down"></i>', ["btnCircle", "btn24", "btnBlack"], "VerticalAlignBottom"));
                div.Append(Framework.Form.Button.Create(function () { return true; }, function () { self.forward(); }, '<i class="fas fa-chevron-up"></i>', ["btnCircle", "btn24", "btnBlack"], "Forward"));
                div.Append(Framework.Form.Button.Create(function () { return true; }, function () { self.backward(); }, '<i class="fas fa-chevron-down"></i>', ["btnCircle", "btn24", "btnBlack"], "Backward"));
                return div;
                //let formSetPosition = Framework.Form.PropertyEditorWithPopup.Render("Coordinates", "Position", Framework.LocalizationManager.Get("ClickToEdit"), ["HorizontalAlignLeft", "HorizontalAlignCenter", "HorizontalAlignRight", "VerticalAlignTop", "VerticalAlignCenter", "VerticalAlignBottom", "Forward", "Backward"], (x) => {
                //    switch (x) {
                //        case "HorizontalAlignLeft":
                //            self.DefaultLeftCoordinate = "Left";
                //            self.horizontalAlignLeft();
                //            formSetPosition.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                //            break;
                //        case "HorizontalAlignCenter":
                //            self.DefaultLeftCoordinate = "Center";
                //            self.horizontalAlignCenter();
                //            formSetPosition.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                //            break;
                //        case "HorizontalAlignRight":
                //            self.DefaultLeftCoordinate = "Right";
                //            self.horizontalAlignRight();
                //            formSetPosition.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                //            break;
                //        case "VerticalAlignTop":
                //            self.DefaultTopCoordinate = "Top";
                //            self.verticalAlignTop();
                //            formSetPosition.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                //            break;
                //        case "VerticalAlignCenter":
                //            self.DefaultTopCoordinate = "Center";
                //            self.verticalAlignCenter();
                //            formSetPosition.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                //            break;
                //        case "VerticalAlignBottom":
                //            self.DefaultTopCoordinate = "bottom";
                //            self.verticalAlignBottom();
                //            formSetPosition.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                //            break;
                //        case "Forward":
                //            self.forward();
                //            formSetPosition.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                //            break;
                //        case "Backward":
                //            self.backward();
                //            formSetPosition.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                //            break;
                //    }
                //});
                //return formSetPosition;
            };
            BaseControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = [];
                if ((mode == "edition" || mode == "creation") /*&& self._Type.indexOf("Question")>-1*/) {
                    var formFriendlyName = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "ID", self._FriendlyName, function (x) {
                        self.changeProperty("_FriendlyName", x);
                        //TODO
                    }, Framework.Form.Validator.MinLength(1));
                    properties.push(formFriendlyName);
                }
                if (mode == "edition") {
                    if (Models.Screen.HasControlOfType(self.screen, "SpeechToText") == true) {
                        var formVocalEnabled = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "VocalEnabled", self._VocalEnabled, function (x) {
                            self.changeProperty("_VocalEnabled", x);
                        });
                        properties.push(formVocalEnabled);
                    }
                    var formSetBorderWidth = Framework.Form.PropertyEditorWithNumericUpDown.Render("Design", "BorderThickness", Math.round(self._BorderThickness), 0, 10, function (x) {
                        self.changeBorderThickness(x);
                    });
                    properties.push(formSetBorderWidth);
                    var formSetBackgroundColor = Framework.Form.PropertyEditorWithColorPopup.Render("Design", "BackgroundColor", self._Background, function (x) {
                        self.changeBorderBackground(x);
                    });
                    properties.push(formSetBackgroundColor);
                    var formSetBorderColor = Framework.Form.PropertyEditorWithColorPopup.Render("Design", "BorderColor", self._BorderBrush, function (x) {
                        self.changeBorderColor(x);
                    });
                    properties.push(formSetBorderColor);
                    //TODO : tenir compte position
                    var maxH = this.HtmlElement.parentElement.parentElement.clientHeight;
                    var formSetHeight = Framework.Form.PropertyEditorWithNumericUpDown.Render("Coordinates", "Height", Math.round(self._Height), 10, maxH, function (x) {
                        self.SetHeight(x);
                    });
                    properties.push(formSetHeight);
                    //TODO : tenir compte position
                    var maxW = this.HtmlElement.parentElement.parentElement.clientWidth;
                    var formSetWidth = Framework.Form.PropertyEditorWithNumericUpDown.Render("Coordinates", "Width", Math.round(self._Width), 10, maxW, function (x) {
                        self.SetWidth(x);
                    });
                    properties.push(formSetWidth);
                    var maxL = this.HtmlElement.parentElement.parentElement.clientWidth;
                    var formSetLeft = Framework.Form.PropertyEditorWithNumericUpDown.Render("Coordinates", "Left", Math.round(self._Left), 0, maxL, function (x) { self.SetLeft(x); });
                    properties.push(formSetLeft);
                    var maxT = this.HtmlElement.parentElement.parentElement.clientHeight;
                    var formSetTop = Framework.Form.PropertyEditorWithNumericUpDown.Render("Coordinates", "Top", Math.round(self._Top), 0, maxT, function (x) { self.SetTop(x); });
                    properties.push(formSetTop);
                    //let formSetZ = Framework.Form.PropertyEditorWithNumericUpDown.Render("Coordinates", "ZIndex", self._ZIndex, 0, 2147483647, (x) => { self.SetZIndex(x); });
                    //properties.push(formSetZ);
                    //TODO : alignement sur la grille
                    //TODO ? self.rotateLeft();, self.rotateRight();
                    //let formSetPosition = Framework.Form.PropertyEditorWithPopup.RenderWithButtons("Coordinates", "Position", Framework.LocalizationManager.Get("ClickToEdit"), [{ Key: "HorizontalAlignLeft", Value: "leftAlignButton" }, { Key: "HorizontalAlignCenter", Value: "" }, { Key: "HorizontalAlignRight", Value: "" }, { Key: "VerticalAlignTop", Value: "" }, { Key: "VerticalAlignCenter", Value: "" }, { Key: "VerticalAlignBottom", Value: "" }, { Key: "Forward", Value: "" }, { Key: "Backward", Value: "" }], (x) => {
                    var formSetPosition_1 = Framework.Form.PropertyEditorWithPopup.Render("Coordinates", "Position", Framework.LocalizationManager.Get("ClickToEdit"), ["HorizontalAlignLeft", "HorizontalAlignCenter", "HorizontalAlignRight", "VerticalAlignTop", "VerticalAlignCenter", "VerticalAlignBottom", "Forward", "Backward"], function (x) {
                        switch (x) {
                            case "HorizontalAlignLeft":
                                self.DefaultLeftCoordinate = "Left";
                                self.horizontalAlignLeft();
                                formSetPosition_1.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                                break;
                            case "HorizontalAlignCenter":
                                self.DefaultLeftCoordinate = "Center";
                                self.horizontalAlignCenter();
                                formSetPosition_1.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                                break;
                            case "HorizontalAlignRight":
                                self.DefaultLeftCoordinate = "Right";
                                self.horizontalAlignRight();
                                formSetPosition_1.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                                break;
                            case "VerticalAlignTop":
                                self.DefaultTopCoordinate = "Top";
                                self.verticalAlignTop();
                                formSetPosition_1.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                                break;
                            case "VerticalAlignCenter":
                                self.DefaultTopCoordinate = "Center";
                                self.verticalAlignCenter();
                                formSetPosition_1.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                                break;
                            case "VerticalAlignBottom":
                                self.DefaultTopCoordinate = "bottom";
                                self.verticalAlignBottom();
                                formSetPosition_1.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                                break;
                            case "Forward":
                                self.forward();
                                formSetPosition_1.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                                break;
                            case "Backward":
                                self.backward();
                                formSetPosition_1.SetLabelForPropertyValue(Framework.LocalizationManager.Get("ClickToEdit"));
                                break;
                        }
                    });
                    properties.push(formSetPosition_1);
                    //let formSetModaltiming = Framework.Form.PropertyEditorWithToggle.Render("Timing", "ModalDisplay", self._IsModal, (x) => {
                    //    self.changeProperty("_IsModal", x);
                    //});
                    //properties.push(formSetModaltiming);
                    var formSetStartTimingWithChrono = Framework.Form.PropertyEditorWithToggle.Render("Timing", "StartWithChronometer", self._StartWithChronometer, function (x) {
                        self.changeProperty("_StartWithChronometer", x);
                    });
                    properties.push(formSetStartTimingWithChrono);
                    // TODO : taille max, son depuis url
                    if (self._PlaySoundWhenDisplayed == "") {
                        self._PlaySoundWhenDisplayed = "NoSound";
                    }
                    var formSetSound = Framework.Form.PropertyEditorWithPopup.Render("Timing", "PlaySoundWhenDisplayed", self._PlaySoundWhenDisplayed, ["NoSound", "DefaultSound", "CustomSound"], function (x, y) {
                        self.changeProperty("_PlaySoundWhenDisplayed", x);
                        validateFormSetSoundBinaries_1();
                    }, true, Framework.Form.Validator.NotEmpty());
                    properties.push(formSetSound);
                    var validateFormSetSoundBinaries_1 = function () {
                        if (self._CustomSoundWhenDisplayed.length == 0) {
                            formSetSoundBinaries_1.ValidationResult = "SelectSoundFile";
                        }
                        else {
                            formSetSoundBinaries_1.ValidationResult = "";
                        }
                        formSetSoundBinaries_1.Check();
                    };
                    var formSetSoundBinaries_1 = Framework.Form.PropertyEditorWithButton.Render("Timing", "SoundFile", Framework.LocalizationManager.Get("Browse"), function () {
                        Framework.FileHelper.BrowseBinaries('.wav', function (binaries) {
                            if (binaries) {
                                self.changeProperty("_CustomSoundWhenDisplayed", binaries);
                                self.updateControl();
                            }
                            validateFormSetSoundBinaries_1();
                        });
                    }, function () {
                        return self._PlaySoundWhenDisplayed == "CustomSound";
                    });
                    validateFormSetSoundBinaries_1();
                    properties.push(formSetSoundBinaries_1);
                    // TOTEST
                    var formSetControlTimingContent = Framework.Form.PropertyEditorWithButton.Render("Timing", "TimingEvents", this._Events.length.toString(), function () {
                        //self.BeforePropertyChanged("_Events", self._Events);
                        self.showTimingEventForm();
                    });
                    properties.push(formSetControlTimingContent);
                }
                return properties;
            };
            BaseControl.prototype.SetFontFamily = function (fontFamily) {
                //TODO : textarea
                this.changeProperty("_FontFamily", fontFamily);
            };
            BaseControl.prototype.showSelectionToolbar = function (callback, insertSpecialTextButtons, showBaseButtons) {
                if (callback === void 0) { callback = undefined; }
                if (insertSpecialTextButtons === void 0) { insertSpecialTextButtons = []; }
                if (showBaseButtons === void 0) { showBaseButtons = true; }
                Framework.InlineHTMLEditor.Show(callback, insertSpecialTextButtons, showBaseButtons);
            };
            BaseControl.prototype.ShowProperties = function () {
                this.showPropertiesToolbar();
            };
            BaseControl.prototype.showPropertiesToolbar = function () {
                var self = this;
                var div = Framework.Form.TextElement.Create("");
                var commonPropertiesDiv = Framework.Form.Accordion.Create(Framework.LocalizationManager.Get("CoordinatesSizeAndBorder"), ["propertyHeader"], false);
                div.Append(commonPropertiesDiv);
                var properties = this.GetEditableProperties("edition");
                properties.forEach(function (x) { x.SetPropertyKeyMaxWidth(360); });
                properties.filter(function (x) { return x.Group == "Coordinates"; }).forEach(function (x) {
                    commonPropertiesDiv.Append(x.Editor.HtmlElement);
                });
                var parameterProperties = properties.filter(function (x) { return x.Group == "Parameters"; });
                if (parameterProperties.length > 0) {
                    var parameterPropertiesDiv_1 = Framework.Form.Accordion.Create(Framework.LocalizationManager.Get("Parameters"), ["propertyHeader"]);
                    div.Append(parameterPropertiesDiv_1);
                    parameterProperties.forEach(function (x) {
                        parameterPropertiesDiv_1.Append(x.Editor.HtmlElement);
                    });
                }
                var designPropertiesDiv = Framework.Form.Accordion.Create(Framework.LocalizationManager.Get("Design"), ["propertyHeader"]);
                div.Append(designPropertiesDiv);
                properties.filter(function (x) { return x.Group == "Design"; }).forEach(function (x) {
                    designPropertiesDiv.Append(x.Editor.HtmlElement);
                });
                this.additionalEditableProperties.forEach(function (group) {
                    var additionalDesignProperties = properties.filter(function (x) { return x.Group == group; });
                    if (additionalDesignProperties.length > 0) {
                        var parameterPropertiesDiv_2 = Framework.Form.Accordion.Create(Framework.LocalizationManager.Get(group), ["propertyHeader"]);
                        div.Append(parameterPropertiesDiv_2);
                        additionalDesignProperties.forEach(function (x) {
                            parameterPropertiesDiv_2.Append(x.Editor.HtmlElement);
                        });
                    }
                });
                // Groupe Timing
                var timingDiv = Framework.Form.Accordion.Create(Framework.LocalizationManager.Get("Timing"), ["propertyHeader"], false);
                div.Append(timingDiv);
                properties.filter(function (x) { return x.Group == "Timing"; }).forEach(function (x) {
                    timingDiv.Append(x.Editor.HtmlElement);
                });
                var compatibility = this.CheckCompatibility();
                if (compatibility.length > 0) {
                    var compatibilityPropertiesDiv = Framework.Form.Accordion.Create(Framework.LocalizationManager.Get("BrowserCompatibility"), ["propertyHeader"]);
                    div.Append(compatibilityPropertiesDiv);
                    var textCompatibility = Framework.Form.TextElement.Create(compatibility);
                    compatibilityPropertiesDiv.Append(textCompatibility.HtmlElement);
                    div.Append(compatibilityPropertiesDiv);
                }
                var modal = Framework.Modal.Custom(div.HtmlElement, Framework.LocalizationManager.Get(this._Type), undefined, "100vh", "550px", true, false, true);
                modal.Float('left');
            };
            BaseControl.prototype.showTimingEventForm = function () {
                var events = Framework.Factory.Clone(this._Events);
                var div = Framework.Form.TextElement.Create("");
                var self = this;
                var table = new Framework.Form.Table();
                table.ListColumns = [];
                var col1 = new Framework.Form.TableColumn();
                col1.Name = "Time";
                col1.Title = Framework.LocalizationManager.Get("Time");
                col1.Type = "integer";
                col1.Sortable = false;
                col1.Filterable = false;
                table.ListColumns.push(col1);
                var col2 = new Framework.Form.TableColumn();
                col2.Name = "Action";
                col2.Title = Framework.LocalizationManager.Get("Visibility");
                col2.Type = "enum";
                col2.MinWidth = 150;
                col2.Sortable = false;
                col2.Filterable = false;
                col2.EnumValues = Framework.KeyValuePair.FromArray(Models.TimerEvent.ActionEnum, true);
                table.ListColumns.push(col2);
                table.Height = "500px";
                table.ListData = events;
                //table.OnSelectionChanged = () => {
                //};
                //table.OnDataUpdated = (subject: Models.Subject, propertyName: string, oldValue: any, newValue: any) => {
                //};
                table.AddFunction = function () {
                    var event = new Models.TimerEvent();
                    event.Time = Math.max.apply(null, events.map(function (x) { return x.Time; })) + 1;
                    var lastAction = events[events.length - 1].Action;
                    if (lastAction == "visible") {
                        event.Action = "hidden";
                    }
                    if (lastAction == "hidden") {
                        event.Action = "visible";
                    }
                    //events.push(event);
                    table.Insert([event]);
                };
                table.RemoveFunction = function () {
                    table.Remove(table.SelectedData);
                };
                table.Render(div.HtmlElement, 800);
                //TODO : améliorer
                //let dtParameters = new Framework.Form.DataTableParameters();
                //dtParameters.ListData = events;
                //dtParameters.Paging = false;
                //dtParameters.ListColumns = [
                //    {
                //        data: "Time", title: Framework.LocalizationManager.Get("Time"), render: function (data, type, row) {
                //            return data;
                //        }
                //    },
                //    {
                //        data: "Action", title: Framework.LocalizationManager.Get("Visibility"), render: function (data, type, row) {
                //            return Framework.LocalizationManager.Get(data);
                //        }
                //    }
                //];
                //dtParameters.Order = [[0, 'desc']];
                //// Edition du contenu des cellules
                //dtParameters.OnEditCell = (propertyName, data) => {
                //    if (propertyName == "Time") {
                //        return Framework.Form.InputNumericUpDown.Create(data["Time"], 0, 200, 1, (x) => {
                //            data["Time"] = x;
                //        }, true).HtmlElement;
                //    }
                //    if (propertyName == "Action") {
                //        return Framework.Form.Select.Render(data["Action"], Framework.KeyValuePair.FromArray(Models.TimerEvent.ActionEnum, true), Framework.Form.Validator.NoValidation(), (x) => {
                //            data["Action"] = x;
                //        }, false, ["tableInput"]).HtmlElement;
                //    }
                //}
                //let dataTable: Framework.Form.DataTable;
                //let selection: Models.TimerEvent[] = [];
                //let setTable = () => {
                //    Framework.Form.DataTable.AppendToDiv("", "400px", div.HtmlElement, dtParameters, (dt) => {
                //        dataTable = dt;
                //    }, (sel: Models.TimerEvent[]) => {
                //        selection = sel;
                //    }, () => {
                //        let event: Models.TimerEvent = new Models.TimerEvent();
                //        event.Time = Math.max.apply(null, events.map((x) => { return x.Time })) + 1;
                //        let lastAction = events[events.length - 1].Action;
                //        if (lastAction == "visible") {
                //            event.Action = "hidden";
                //        }
                //        if (lastAction == "hidden") {
                //            event.Action = "visible";
                //        }
                //        events.push(event);
                //        setTable();
                //    }, () => {
                //        selection.forEach((x) => {
                //            Framework.Array.Remove(events, x);
                //        });
                //        setTable();
                //    });
                //}
                //setTable();
                Framework.Modal.Confirm(Framework.LocalizationManager.Get("Events"), div.HtmlElement, function () {
                    self.changeProperty("_Events", events);
                });
            };
            BaseControl.prototype.updateSizeHandle = function (handle) {
                if (handle.id == "bottomSizeHandle") {
                    handle.style.left = ((this._Width * this.Ratio) / 2) - 6 + "px";
                    handle.style.top = (this._Height * this.Ratio) + "px";
                }
                if (handle.id == "topSizeHandle") {
                    handle.style.left = ((this._Width * this.Ratio) / 2) - 6 + "px";
                    handle.style.top = -6 + "px";
                }
                if (handle.id == "rightSizeHandle") {
                    handle.style.top = ((this._Height * this.Ratio) / 2) - 6 + "px";
                    handle.style.left = (this._Width * this.Ratio) + "px";
                }
                if (handle.id == "leftSizeHandle") {
                    handle.style.top = ((this._Height * this.Ratio) / 2) - 6 + "px";
                    handle.style.left = -6 + "px";
                }
            };
            BaseControl.prototype.createSizeHandle = function (position) {
                var self = this;
                var handle = document.createElement("div");
                handle.classList.add("adornerHandle");
                handle.setAttribute("Handle", position);
                // Classe pour déplacer le contrôle (interact.js)
                handle.classList.add("resizable");
                if (position == "Bottom") {
                    handle.id = "bottomSizeHandle";
                    handle.style.cursor = "ns-resize";
                    handle.classList.add("arrow-down");
                }
                if (position == "Top") {
                    handle.id = "topSizeHandle";
                    handle.style.cursor = "ns-resize";
                    handle.classList.add("arrow-up");
                }
                if (position == "Right") {
                    handle.id = "rightSizeHandle";
                    handle.style.cursor = "ew-resize";
                    handle.classList.add("arrow-right");
                }
                if (position == "Left") {
                    handle.id = "leftSizeHandle";
                    handle.style.cursor = "ew-resize";
                    handle.classList.add("arrow-left");
                }
                if (position == "TopLeft") {
                    handle.id = "topLeftSizeHandle";
                    handle.style.cursor = "nw-resize";
                    handle.classList.add("handleCircleTopLeft");
                }
                if (position == "TopRight") {
                    handle.id = "topRightSizeHandle";
                    handle.style.cursor = "ne-resize";
                    handle.classList.add("handleCircleTopRight");
                }
                if (position == "BottomLeft") {
                    handle.id = "bottomLeftSizeHandle";
                    handle.style.cursor = "sw-resize";
                    handle.classList.add("handleCircleBottomLeft");
                }
                if (position == "BottomRight") {
                    handle.id = "bottomRightSizeHandle";
                    handle.style.cursor = "se-resize";
                    handle.classList.add("handleCircleBottomRight");
                }
                this.updateSizeHandle(handle);
                return handle;
            };
            BaseControl.prototype.RemoveHighlight = function () {
                if (this.Adorner) {
                    this.HtmlElement.style.zIndex = this._ZIndex.toString();
                    this.Adorner.classList.remove("adornerBorder");
                    $(".adornerHandle").remove();
                    $(".draggableDiv").remove();
                    //if (this.toolbar) {
                    //    $(".toolbar").remove();
                    //}
                    // Suppression des controles sélectionnés (à l'intérieur d'un stackedcontrol)
                    $("*").removeClass("selectedControlInsideAdorner");
                }
            };
            BaseControl.prototype.SetCoordinates = function () {
                //let screenWidth = this.HtmlElement.parentElement.parentElement.clientWidth;
                //let screenHeight = this.HtmlElement.parentElement.parentElement.clientHeight;
                var screenHeight = Models.Screen.Height;
                var screenWidth = Models.Screen.Width(this.screen);
                var top = Number(this.DefaultTopCoordinate);
                var left = Number(this.DefaultLeftCoordinate);
                if (this._Top && this._Top > 0) {
                    top = this._Top;
                }
                if (this._Left && this._Left > 0) {
                    left = this._Left;
                }
                if (top) {
                    this._Top = top;
                }
                else {
                    this._Top = 0;
                    if (this.DefaultTopCoordinate == "Top") {
                        this._Top = 10;
                    }
                    if (this.DefaultTopCoordinate == "Center") {
                        this._Top = (screenHeight - this._Height) / 2;
                    }
                    if (this.DefaultTopCoordinate == "Bottom") {
                        this._Top = screenHeight - 10 - this._Height;
                    }
                }
                if (left) {
                    this._Left = left;
                }
                else {
                    this._Left = 0;
                    if (this.DefaultLeftCoordinate == "Left") {
                        this._Left = 10;
                    }
                    if (this.DefaultLeftCoordinate == "Center") {
                        this._Left = (screenWidth - this._Width) / 2;
                    }
                    if (this.DefaultLeftCoordinate == "Right") {
                        this._Left = screenWidth - 10 - this._Width;
                    }
                }
                this.updateControl();
            };
            BaseControl.prototype.SetStyle = function (style) {
                if (style === void 0) { style = {}; }
                if (style) {
                    this.style = style;
                    if (style["FontSize"]) {
                        //this._FontSize = Number(style["FontSize"]);
                        this.changeProperty("_FontSize", Number(style["FontSize"]));
                    }
                    if (style["FontFamily"]) {
                        //this._FontFamily = style["FontFamily"];
                        this.changeProperty("_FontFamily", style["FontFamily"]);
                    }
                    if (style["FontColor"]) {
                        //this._Foreground = style["FontColor"];
                        this.changeProperty("_Foreground", style["FontColor"]);
                    }
                    if (style["Background"]) {
                        //this._Background = style["Background"];
                        this.changeProperty("_Background", style["Background"]);
                    }
                }
                this.updateControl();
            };
            return BaseControl;
        }());
        Controls.BaseControl = BaseControl;
        var Rectangle = /** @class */ (function (_super) {
            __extends(Rectangle, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function Rectangle() {
                var _this = _super.call(this) || this;
                //this.setPropertyFromXaml(control, "Fill", "_Background", 'color');
                //this.setPropertyFromXaml(control, "Stroke", "_BorderBrush", 'color');
                //let t = this.getPropertyFromXaml<string>(control, "StrokeThickness", "0");
                //if (t) {
                //    this._BorderThickness = Number(t.split(",", 1));
                //}
                _this._Type = "Rectangle";
                return _this;
            }
            Rectangle.Create = function () {
                var control = new Rectangle();
                control._Height = 100;
                control._Width = 100;
                control._BorderThickness = 1;
                control._BorderBrush = "black";
                control._Background = "gray";
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                return control;
            };
            Rectangle.prototype.Render = function (editMode, ratio) {
                _super.prototype.Render.call(this, editMode, ratio);
            };
            return Rectangle;
        }(BaseControl));
        Controls.Rectangle = Rectangle;
        var TextArea = /** @class */ (function (_super) {
            __extends(TextArea, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function TextArea() {
                var _this = _super.call(this) || this;
                _this._HtmlContent = ""; // Contenu HTML            
                _this._PlayAfter = 0;
                _this._SpokenLanguage = "None";
                _this._Margin = 20;
                _this._TextHorizontalAlignment = "left";
                _this._Type = "TextArea";
                return _this;
            }
            //public OnChange: () => void = () => { };
            TextArea.prototype.GetHtmlDivElement = function () {
                return this.label.Div;
            };
            TextArea.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                var self = this;
                var label = new Label(this._HtmlContent);
                //ScreenReader.Controls.TextArea.SpecialTextEnum.forEach((x) => {
                //    let button = Framework.Form.Button.Create(() => { return true; }, () => { Framework.Selection.Replace("/" + x + "/"); }, Framework.LocalizationManager.Get(x), ["popupEditableProperty"]);
                //    label.ToolbarInsertTextButtons.push(button);
                //});
                this.label = label;
                this.label.IsEditable = editMode;
                label._FontSize = this._FontSize;
                label._FontFamily = this._FontFamily;
                label.Margin = this._Margin;
                label._Width = this._Width;
                label._Height = this._Height;
                label.VerticalAlignment = "top";
                label.HorizontalAlignment = this._TextHorizontalAlignment;
                //label.OnChanged = function () {
                //    let f = function convertir(chn: string, p1, decalage, s) {
                //        let r = chn.split(':')[0] + ": " + Math.round(Number(p1) / ratio);
                //        return r;
                //    }
                //    let text = label.GetText().replace(/font-size:\s*(\d+)\s*/g, f);
                //    self.changeProperty("_HtmlContent", text);
                //}
                label.Render(editMode, ratio);
                //if (editMode == true) {
                //    label.HtmlElement.onclick = () => {
                //        self.caretPosition = Framework.Selection.GetHTMLCaretPosition(label.HtmlElement);
                //    }
                //    label.HtmlElement.onkeydown = (event) => {
                //        if (event.keyCode === 9) {
                //            event.preventDefault();
                //            var range = window.getSelection().getRangeAt(0);
                //            var tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
                //            range.insertNode(tabNode);
                //            range.setStartAfter(tabNode);
                //            range.setEndAfter(tabNode);
                //        }
                //    }
                //}
                this.HtmlElement.appendChild(label.HtmlElement);
                if (this.OnClick) {
                    this.HtmlElement.onclick = function () { self.OnClick(); };
                }
                this.HtmlElement.style.overflow = "hidden";
                //if (editMode == false && this._Events[0].Action == "hidden") {
                //    this.HtmlElement.style.display = "none";
                //} else {
                //    this.HtmlElement.style.display = "block";
                //}
                this.HtmlElement.style.padding = "3px";
                this.HtmlElement.style.background = this._Background;
                label.HtmlElement.style.background = this._Background;
                if (editMode == false && this._SpokenLanguage != "None") {
                    //let bingClientTTS = new BingSpeech.TTSClient("6d2194cdb9f64890b8660d400e0c072f");
                    //let voice = BingSpeech.SupportedLocales.enUS_Female;
                    //if (this._Voice == "FR_Female") {
                    //    voice = BingSpeech.SupportedLocales.frFR_Female;
                    //}
                    //if (this._Voice == "FR_Male") {
                    //    voice = BingSpeech.SupportedLocales.frFR_Male;
                    //}
                    //if (this._Voice == "US_Female") {
                    //    voice = BingSpeech.SupportedLocales.enUS_Female;
                    //}
                    //if (this._Voice == "US_Male") {
                    //    voice = BingSpeech.SupportedLocales.enUS_Male;
                    //}
                    //this.timeOut = setTimeout(() => {
                    //    bingClientTTS.synthesize(label.HtmlElement.innerText, voice);
                    //}, self._PlayAfter * 1000);
                    //TODO
                    this.speak();
                }
                self.Scrollable();
            };
            TextArea.prototype.speak = function () {
                var self = this;
                var synth = window.speechSynthesis;
                if (synth == undefined) {
                    return;
                }
                //synth.onvoiceschanged = () => {
                //    console.log("voicechanged");
                //};
                //let voices = synth.getVoices();
                //console.log(voices);
                //window.speechSynthesis.onvoiceschanged = function () {
                //    console.log(window.speechSynthesis.getVoices());    
                //};
                //alert(self._SpokenLanguage);
                this.timeOut = setTimeout(function () {
                    var speechSynthesisUtterance = new SpeechSynthesisUtterance(self.label.HtmlElement.innerText);
                    //speechSynthesisUtterance.onerror = function (event) {
                    //    console.log('An error has occurred with the speech synthesis: ' + (<any>event).error);
                    //}
                    //speechSynthesisUtterance.onstart = function (event) {
                    //    self.IsSpeaking = true;
                    //}
                    //speechSynthesisUtterance.onend = function (event) {
                    //    self.IsSpeaking = false;
                    //}
                    //speechSynthesisUtterance.voice = voices[0];
                    speechSynthesisUtterance.lang = self._SpokenLanguage;
                    speechSynthesisUtterance.pitch = 1;
                    speechSynthesisUtterance.rate = 1;
                    synth.speak(speechSynthesisUtterance);
                }, self._PlayAfter * 1000);
            };
            TextArea.prototype.Stop = function () {
                if (this.timeOut) {
                    clearTimeout(this.timeOut);
                }
            };
            TextArea.prototype.Replace = function (toReplace, replacement) {
                // Remplace du contenu HTML
                if (this._HtmlContent.indexOf(toReplace) > -1) {
                    this._HtmlContent = this._HtmlContent.split(toReplace).join(replacement);
                }
            };
            TextArea.prototype.SetCss = function (styleName, value) {
                if (this.label) {
                    var descendants = Array.prototype.slice.call(this.label.HtmlElement.children[0].querySelectorAll("*"), 0);
                    descendants.forEach(function (x) {
                        x.style[styleName] = value;
                    });
                    this._HtmlContent = this.label.HtmlElement.children[0].innerHTML;
                }
            };
            TextArea.Create = function (text, height, width) {
                if (text === void 0) { text = Framework.LocalizationManager.Get("EnterText"); }
                if (height === void 0) { height = 400; }
                if (width === void 0) { width = 400; }
                var textArea = new TextArea();
                textArea._Height = height;
                textArea._Width = width;
                textArea._BorderThickness = 0;
                textArea._Background = "white";
                textArea._BorderBrush = "gray";
                textArea.DefaultLeftCoordinate = "Center";
                textArea.DefaultTopCoordinate = "Center";
                textArea._HtmlContent = text;
                return textArea;
            };
            TextArea.prototype.SetStyle = function (style) {
                if (style === void 0) { style = {}; }
                if (style) {
                    _super.prototype.SetStyle.call(this, style);
                    //let div = document.createElement("div");
                    //div.innerHTML = this._HtmlContent;
                    //let text = div.innerText;
                    //this._HtmlContent = '<p style="font-size:' + style["FontSize"] + 'px; font-family:' + style["FontFamily"] + '; color:' + style["FontColor"] + '">' + text + '</p>';
                    //this.updateControl();
                }
            };
            TextArea.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition") {
                    //TODO : insert special content
                    var formSetSpecialContent = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "InsertSpecialText", Framework.LocalizationManager.Get("ClickToEdit"), ScreenReader.Controls.TextArea.SpecialTextEnum, function (x) {
                        Framework.Selection.SetCaretPosition(self.label.HtmlElement, self.caretPosition);
                        Framework.Selection.Replace("/" + x + "/");
                    });
                    properties.push(formSetSpecialContent);
                    var formSetAlignment = Framework.Form.PropertyEditorWithPopup.Render("Design", "Alignment", self._TextHorizontalAlignment, ['left', 'right', 'center', 'justify'], function (x) {
                        self.changeProperty("_TextHorizontalAlignment", x);
                        self.updateControl();
                    });
                    properties.push(formSetAlignment);
                    //let formSetLanguage = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "Voice", self._SpokenLanguage, ["None", "fr-FR", "en-EN"], (x) => {
                    //    self.changeProperty("_SpokenLanguage", x);
                    //    formSetPlayAfter.Editor.Hide();
                    //    if (x != "None") {
                    //        formSetPlayAfter.Editor.Show();
                    //    }
                    //});
                    //properties.push(formSetLanguage);
                    //let formSetPlayAfter = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "PlayAfter", self._PlayAfter, 0, 1000, (x) => {
                    //    self.changeProperty("_PlayAfter", x);
                    //}, 1);
                    //properties.push(formSetPlayAfter);
                    //formSetPlayAfter.Editor.Hide();
                    var formSetTextSize = Framework.Form.PropertyEditorWithPopup.Render("Design", "FontSize", self._FontSize.toString(), Framework.InlineHTMLEditor.FontSizeEnum, function (x) {
                        self.changeProperty("_FontSize", Number(x));
                        self.updateControl();
                    });
                    properties.push(formSetTextSize);
                    var formSetTextSpacing = Framework.Form.PropertyEditorWithPopup.Render("Design", "Margin", self._Margin.toString(), Framework.InlineHTMLEditor.FontSizeEnum, function (x) {
                        self.changeProperty("_Margin", Number(x));
                        self.updateControl();
                    });
                    properties.push(formSetTextSpacing);
                    var formSetTextFontFamily = Framework.Form.PropertyEditorWithPopup.Render("Design", "TextFont", self._FontFamily, Framework.InlineHTMLEditor.FontNameEnum, function (x) {
                        self.changeProperty("_FontFamily", x);
                        self.updateControl();
                    });
                    properties.push(formSetTextFontFamily);
                    var formSetRemoveDesign = Framework.Form.PropertyEditorWithButton.Render("Design", "RemoveStyle", "", function () {
                        var div = document.createElement("div");
                        div.innerHTML = self._HtmlContent;
                        //div.innerHTML = self._HtmlContent.replace("</p>", "||</p>").replace("<br>", "||<br>").replace("<br/>", "||<br>");;
                        //self._HtmlContent = div.innerText.replace("||","\n");
                        self._HtmlContent = div.innerText;
                        self.updateControl();
                    }, function () { return true; }, "fas fa-remove-format");
                    properties.push(formSetRemoveDesign);
                }
                return properties;
            };
            TextArea.SpecialTextEnum = ["CurrentDate", /*"SubjectFirstName", "SubjectLastName",*/ "SubjectCode", "Replicate", "Intake", "ProductRank", "ProductDescription", "SubjectNote", "ExperimentalDesignItemLabel"];
            return TextArea;
        }(BaseControl));
        Controls.TextArea = TextArea;
        var GoToScreenCondition = /** @class */ (function () {
            function GoToScreenCondition() {
                this.DataControlId = "";
                this.Operator = "IsEqual";
                this.DataControlValue = "";
                this.ScreenId = 0;
            }
            //TODO
            GoToScreenCondition.prototype.IsVerified = function (values) {
                var res = false;
                if (this.Operator == "IsEqual") {
                    res = values.indexOf(this.DataControlValue) > -1;
                }
                if (this.Operator == "IsNotEqual") {
                    res = values.indexOf(this.DataControlValue) == -1;
                }
                //if (this.Operator == "IsGreater") {
                //    res = this.DataControlValue > value;
                //}
                //if (this.Operator == "IsLower") {
                //    res = this.DataControlValue < value;
                //}
                //if (this.Operator == "Contains") {
                //    res = this.DataControlValue. == value;
                //}
                return res;
            };
            GoToScreenCondition.OperatorEnum = ["IsEqual", "IsNotEqual", /* "IsGreater", "IsLower", "Contains"*/];
            return GoToScreenCondition;
        }());
        Controls.GoToScreenCondition = GoToScreenCondition;
        var CustomButton = /** @class */ (function (_super) {
            __extends(CustomButton, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function CustomButton() {
                var _this = _super.call(this) || this;
                // TODO : Héritage de datacontrol ?
                _this._Action = ""; // Différentes actions : "GoToPreviousPage", "GoToNextPage", "CloseApplication", "CloseAndSendMail", "InterruptSession", "SaveEvent", "StartChronometer", "StopChronometer", "GoToUrl", "GoToLoginScreen", "StopChronometerAndGoToNextPage", "AddRepThenGoToNextPage", "TDS", "GoToAnchor", "SendSMSAndGoNextPage", "SendSMSLeaveSession", "HideControl", "ShowControl", "StartSameSession" -> gérées dans subjectsessionhelper
                _this._URL = ""; // Si action = GoToUrl
                _this._URLVariablePart = "";
                _this._Blank = false; // Si action = GoToUrl
                _this._EventName = ""; // Si action = SaveEvent
                _this._OneClickOnly = false; // Si true, le bouton est désactivé après le premier clic
                _this._BackgroundImage = ""; // si BackgroundMode = "Image",image (binaries)
                _this._BackgroundMode = "Transparent"; // Type de background : "Image", "Opaque", "Transparent"
                _this._HorizontalContentAlignment = "center"; // Alignement horizontal du texte
                _this._VerticalContentAlignment = "middle"; // Alignement vertical du texte            
                _this._PlaySoundOnClick = "NoSound";
                _this._CustomSound = ""; // Si PlaySound, son à jouer (binaries)
                _this._AnchorID = ""; // Si action = "GoToAnchor" (deprecated)
                _this._ScreenId = undefined;
                _this._GoToScreenConditions = [];
                _this._GroupOfControlID = []; // Si action = "Showcontrol" ou "hideControl"
                _this._Content = ""; // Texte            
                _this._HoverBackground = "gold"; // Couleur d'arrière plan au passage de la souris
                _this._SelectedBackground = "gold"; // Couleur d'arrière plan quand le bouton est cliqué
                _this._SelectedBorderBrush = "black"; // Couleur de la bordure quand le bouton est coché
                _this._ChangeHoverBackground = true;
                _this._ConfirmationRequired = false;
                _this.IsEditable = true;
                _this.ListGroupOfControlFriendlyNames = undefined;
                _this.ScreenIds = [];
                _this.OnDataChanged = undefined;
                //if (control != null) {
                //    this._Content = (<any>control.childNodes[1].childNodes[1]).attributes["Text"].value;
                //    this._Foreground = Framework.Color.ColorFromRGB((<any>control.childNodes[1].childNodes[1]).attributes["Foreground"].value);
                //    this.setPropertyFromXaml(control, "Action", "_Action");
                //    this.setPropertyFromXaml(control, "BackgroundMode", "_BackgroundMode");
                //    this.setPropertyFromXaml(control, "BackgroundImage", "_BackgroundImage");
                //    this.setPropertyFromXaml(control, "HorizontalContentAlignment", "_HorizontalContentAlignment");
                //    this.setPropertyFromXaml(control, "VerticalContentAlignment", "_VerticalContentAlignment");
                //    this.setPropertyFromXaml(control, "OneClickOnly", "_OneClickOnly");
                //    this.setPropertyFromXaml(control, "CustomSound", "_CustomSound");
                //    this.setPropertyFromXaml(control, "URL", "_URL");
                //    this.setPropertyFromXaml(control, "EventName", "_EventName");
                //    this.setPropertyFromXaml(control, "GoToAnchorID", "_AnchorID");
                //    // Conservé pour compatibilité
                //    let playSound = this.getPropertyFromXaml(control, "PlaySound", false);
                //    if (playSound == true && this._CustomSound.length > 0) {
                //        this._PlaySoundOnClick = "CustomSound";
                //    } else if (playSound == true && this._CustomSound.length == 0) {
                //        this._PlaySoundOnClick = "DefaultSound";
                //    } else {
                //        this._PlaySoundOnClick = "NoSound";
                //    }
                //}
                _this._BorderThickness = Math.max(_this._BorderThickness, 1);
                _this._Type = "CustomButton";
                return _this;
            }
            CustomButton.prototype.onDataChanged = function (data) {
                //// Evenement déclenché sur enregistrement de données
                if (this.OnDataChanged) {
                    this.OnDataChanged(data);
                }
            };
            Object.defineProperty(CustomButton.prototype, "Text", {
                get: function () {
                    var div = document.createElement("div");
                    div.innerHTML = this._Content;
                    return div.innerText;
                },
                enumerable: false,
                configurable: true
            });
            CustomButton.prototype.Render = function (editMode, ratio) {
                var _this = this;
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                var _customButton = this;
                //if (this._VerticalContentAlignment.toLowerCase() == "center") {
                //    this._VerticalContentAlignment = "middle";
                //}
                this.HtmlElement.style.verticalAlign = this._VerticalContentAlignment;
                //if (this._VerticalContentAlignment = "middle") {
                //    let nbLines: number = this._Content.split("\r").length;
                //    this.HtmlElement.style.lineHeight = (this._Height / nbLines) + "px";
                //}
                this.HtmlElement.style.lineHeight = this._FontSize * ratio + "px";
                this.HtmlElement.style.overflow = "hidden";
                this.HtmlElement.style.zIndex = "1001";
                this.SetBackground(this._Background);
                this.MemoryBackground = this._Background;
                this.MemoryHoverBackground = this._HoverBackground;
                this.MemoryBorderBrush = this._BorderBrush;
                if (this._Action == "StopChronometer") {
                    this.Disable();
                }
                else {
                    this.Enable();
                }
                var div = document.createElement("div");
                div.innerHTML = this._Content;
                //let label: Label = new Label(this._Content);
                var label = new Label(div.innerText);
                label.IsEditable = editMode;
                label._FontFamily = this._FontFamily;
                label._Foreground = this._Foreground;
                label._FontSize = this._FontSize;
                label._FontWeight = this._FontWeight;
                label._FontStyle = this._FontStyle;
                label.HorizontalAlignment = this._HorizontalContentAlignment;
                label._Width = this._Width;
                label._Height = this._Height;
                label.OnChanged = function () {
                    _customButton._Content = label.GetText();
                    if (_customButton.OnLabelChanged) {
                        _customButton.OnLabelChanged(_customButton._Content);
                    }
                };
                //label.IsEditable = editMode;
                label.Render(editMode, ratio);
                label.HtmlElement.style.background = "transparent";
                this.HtmlElement.appendChild(label.HtmlElement);
                this.EditableElement = label.Div.firstChild;
                this.HtmlElement.className = "customButton";
                if (editMode == false) {
                    _customButton.OnSpeechRecognized = function (text) {
                        if (_customButton.Text.length > 0 && text.toLowerCase().indexOf(_customButton.Text.toLowerCase()) > -1) {
                            _customButton.OnClick();
                        }
                    };
                    // Rendu en mode non éditable
                    var startEventType = 'mousedown';
                    var endEventType = 'mouseup';
                    try {
                        if (Modernizr.touchevents == true) {
                            startEventType = 'touchstart';
                            endEventType = 'touchend';
                        }
                    }
                    catch (ex) {
                    }
                    this.HtmlElement.addEventListener(endEventType, function () {
                        if (_customButton.IsEnabled == false) {
                            return;
                        }
                        if (_customButton.OnRelease != undefined) {
                            _customButton.OnRelease();
                        }
                    }, false);
                    this.HtmlElement.addEventListener(startEventType, function () {
                        if (_customButton.IsEnabled == false) {
                            return;
                        }
                        if (_customButton.OnClick != undefined) {
                            // Effet de clic
                            //let background = _customButton.HtmlElement.style.background;
                            //$(_customButton.HtmlElement).effect("shake");
                            //$(_customButton.HtmlElement).fadeTo(1000,0.8).fadeTo(1000,1);
                            if (_customButton._Action != "TDS") {
                                // Clic : couleur pendant quelques secondes
                                $(_customButton.HtmlElement).effect("highlight", { color: 'gold' }, 800);
                            }
                            _customButton.OnClick();
                        }
                        if (_customButton._OneClickOnly == true && _customButton._Action != "StopChronometerAndGoToNextPage" && _customButton._Action != "StopChronometer") {
                            // Si OneClickOnly, on désactive le bouton après le premier clic
                            _this.Disable();
                        }
                        if (_customButton._PlaySoundOnClick == "CustomSound" && _customButton._CustomSound.length > 0) {
                            Framework.Sound.PlayB64Sound(_customButton._CustomSound);
                        }
                        if (_customButton._PlaySoundOnClick == "DefaultSound") {
                            // Lecture du son par défaut
                            Framework.Sound.PlaySound('bip.mp3');
                        }
                    }, false);
                    // Gestion du background           
                    if (this._ChangeHoverBackground && _customButton._Action != "TDS") {
                        $(_customButton.HtmlElement).hover(function () {
                            if (_customButton.IsEnabled == true) {
                                $(_customButton.HtmlElement).css("border-color", _customButton._SelectedBorderBrush);
                            }
                        }, function () {
                            if (_customButton.IsEnabled == true) {
                                $(_customButton.HtmlElement).css("border-color", _customButton._BorderBrush);
                            }
                        });
                    }
                }
            };
            CustomButton.prototype.SetBorderBrush = function (color) {
                if (this.HtmlElement != undefined) {
                    this.HtmlElement.style.borderColor = color;
                }
            };
            CustomButton.prototype.SetBackground = function (color) {
                if (this.HtmlElement != undefined) {
                    switch (this._BackgroundMode) {
                        case "Image":
                            this.HtmlElement.style.background = color;
                            this.HtmlElement.style.backgroundImage = "url(" + this._BackgroundImage + ")";
                            this.HtmlElement.style.backgroundSize = "contain";
                            this.HtmlElement.style.backgroundRepeat = "no-repeat";
                            this.HtmlElement.style.backgroundPosition = "center center";
                            this.HtmlElement.classList.add("customImageButton");
                            break;
                        case "Opaque":
                            this.HtmlElement.style.background = color;
                            break;
                        case "Transparent":
                            var browser = Framework.Browser.GetBrowserInfo().Name;
                            var background = "(top,#FFFFFF 50%," + color + " 200%);";
                            switch (browser) {
                                case "Safari":
                                case "Chrome":
                                case "Firefox":
                                    this.HtmlElement.style.background = "linear-gradient(to bottom, white 50%, " + color + ")";
                                    break;
                                case "IE":
                                    this.HtmlElement.style.background = "-ms-linear-gradient" + background;
                                    break;
                                case "Opera":
                                    this.HtmlElement.style.background = "-o-linear-gradient" + background;
                                    break;
                            }
                            break;
                    }
                }
            };
            CustomButton.prototype.Enable = function () {
                this.IsEnabled = true;
                this.HtmlElement.style.cursor = "pointer";
                this._Background = this.MemoryBackground;
                this._HoverBackground = this.MemoryHoverBackground;
                this.SetBackground(this._Background);
                this.SetBorderBrush(this._BorderBrush);
                this.HtmlElement.classList.remove("disabled");
            };
            CustomButton.prototype.Disable = function () {
                this.IsEnabled = false;
                this.HtmlElement.style.cursor = "not-allowed";
                this._Background = "lightgray";
                this._HoverBackground = "lightgray";
                this.SetBackground("lightgray");
                this.SetBorderBrush("lightgray");
                this.HtmlElement.classList.add("disabled");
            };
            CustomButton.prototype.Click = function () {
                var clickEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent("mousedown", true, true);
                this.HtmlElement.dispatchEvent(clickEvent);
            };
            CustomButton.prototype.Release = function () {
                var clickEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent("mouseup", true, true);
                this.HtmlElement.dispatchEvent(clickEvent);
            };
            CustomButton.prototype.changeBorderBackground = function (color) {
                _super.prototype.changeBorderBackground.call(this, color);
                this.updateControl();
            };
            CustomButton.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                //TODO : vérifier format fichier et taille max
                var formSetBackgroundMode = Framework.Form.PropertyEditorWithPopup.Render("Design", "BackgroundMode", self._BackgroundMode, CustomButton.BackgroundModeEnum, function (x, y) {
                    self.changeProperty("_BackgroundMode", x);
                    self.updateControl();
                    formSetImage.Check();
                });
                var validateFormSetImage = function () {
                    if (self._BackgroundImage.length == 0) {
                        formSetImage.ValidationResult = "SelectImageFile";
                    }
                    else {
                        formSetImage.ValidationResult = "";
                    }
                    formSetImage.Check();
                };
                var formSetImage = Framework.Form.PropertyEditorWithButton.Render("Design", "ImageFile", Framework.LocalizationManager.Get("Browse"), function () {
                    Framework.FileHelper.BrowseBinaries('.png, .jpg', function (binaries) {
                        if (binaries) {
                            self.changeProperty("_BackgroundImage", binaries);
                            self.updateControl();
                        }
                        validateFormSetImage();
                    });
                }, function () { return self._BackgroundMode == "Image"; });
                validateFormSetImage();
                // TODO : taille max, son depuis url
                var formSetSound = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "PlaySoundOnClick", self._PlaySoundOnClick, ["NoSound", "DefaultSound", "CustomSound"], function (x, y) {
                    self.changeProperty("_PlaySoundOnClick", x);
                    formSetSoundBinaries.Check();
                }, true, Framework.Form.Validator.NotEmpty());
                var validateFormSetSoundBinaries = function () {
                    if (self._CustomSound.length == 0) {
                        formSetSoundBinaries.ValidationResult = "SelectSoundFile";
                    }
                    else {
                        formSetSoundBinaries.ValidationResult = "";
                    }
                    formSetSoundBinaries.Check();
                };
                var formSetSoundBinaries = Framework.Form.PropertyEditorWithButton.Render("Parameters", "SoundFile", Framework.LocalizationManager.Get("Browse"), function () {
                    Framework.FileHelper.BrowseBinaries('.wav', function (binaries) {
                        if (binaries) {
                            self.changeProperty("_CustomSound", binaries);
                            self.updateControl();
                        }
                        validateFormSetSoundBinaries();
                    });
                }, function () { return self._PlaySoundOnClick == "CustomSound"; });
                validateFormSetSoundBinaries();
                var formSetOneClickOnly = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "OneClickOnly", self._OneClickOnly, function (x) {
                    self.changeProperty("_OneClickOnly", x);
                });
                //TODO
                //let formSetHoverBackgroundColor = Framework.Form.PropertyEditor.RenderWithColorPopup("HoverBackgroundColor", Framework.Color.RgbToHex(self._HoverBackground), (x) => {
                //    self._HoverBackground = Framework.Color.ColorFromString(x, false);
                //});
                //properties.push(formSetHoverBackgroundColor.Editor.HtmlElement);
                //TODO : que si bouton DTS ou event
                //let formSetSelectedBackgroundColor = Framework.Form.PropertyEditor.RenderWithColorPopup("SelectedBackgroundColor", Framework.Color.RgbToHex(self._SelectedBackground), (x) => {
                //    self._SelectedBackground = Framework.Color.ColorFromString(x);
                //});
                //properties.push(formSetSelectedBackgroundColor.Editor.HtmlElement);
                //TODO : que si bouton DTS ou event
                //let formSetSelectedBorderColor = Framework.Form.PropertyEditor.RenderWithColorPopup("SelectedBorderColor", Framework.Color.RgbToHex(self._SelectedBorderBrush), (x) => {
                //    self._SelectedBorderBrush = Framework.Color.ColorFromString(x);
                //});
                //properties.push(formSetSelectedBorderColor.Editor.HtmlElement);
                //TODO _HorizontalContentAlignment: string = "center"; // Alignement horizontal du texte
                //TODO _VerticalContentAlignment: string = "middle"; // Alignement vertical du texte
                var formSetAction = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "Action", self._Action, self.getActionList(), function (x, y) {
                    self.changeProperty("_Action", x);
                    formSetURL.Check();
                    formSetAction.Check();
                    formSetEvent.Check();
                    formSetGroupOfControlID.Check();
                    formSetScreenId.Check();
                    formSetCondition.Check();
                    if (mode == "creation") {
                        switch (x) {
                            case "GoToPreviousPage":
                                self._Content = Framework.LocalizationManager.Get("Previous");
                                break;
                            case "GoToNextPage":
                            case "StopChronometerAndGoToNextPage":
                            case "GoToUrlAndGoToNextPage":
                            case "AddRepThenGoToNextPage":
                            case "SaveEventThenGoToNextPage":
                                self._Content = Framework.LocalizationManager.Get("Next");
                                break;
                            case "StartChronometer":
                                self._Content = Framework.LocalizationManager.Get("Start");
                                self.DefaultLeftCoordinate = "Right";
                                self.DefaultTopCoordinate = "Top";
                                break;
                            case "StopChronometer":
                                self._Content = Framework.LocalizationManager.Get("Stop");
                                self.DefaultLeftCoordinate = "Left";
                                self.DefaultTopCoordinate = "Top";
                                break;
                            case "GoToLoginScreen":
                                self._Content = Framework.LocalizationManager.Get("Exit");
                                break;
                        }
                    }
                }, true, Framework.Form.Validator.NotEmpty(Framework.LocalizationManager.Get("SelectAnAction")));
                var formSetConfirmationRequired = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "ConfirmationRequired", self._ConfirmationRequired, function (x) {
                    self.changeProperty("_ConfirmationRequired", x);
                });
                var formSetURL = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "URL", self._URL, function (x) {
                    if (formSetURL.ValidationResult == "") {
                        self.changeProperty("_URL", x);
                    }
                }, Framework.Form.Validator.MinLength(3), function () { return (self._Action == "GoToUrl" || self._Action == "GoToUrlAndGoToNextPage" || self._Action == "GoToScreenOfSampleCodeInputAndExit"); });
                var formSetBlank = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "New window", self._Blank, function (x) {
                    self.changeProperty("_Blank", x);
                }, function () { return (self._Action == "GoToUrl"); });
                //TOFIX : URRL
                var formSetURLVariablePart = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "URL Variable part", self._URLVariablePart, function (x) {
                    self.changeProperty("_URLVariablePart", x);
                }, Framework.Form.Validator.NoValidation(), function () { return (self._Action == "GoToUrl" || self._Action == "GoToUrlAndGoToNextPage" || self._Action == "GoToScreenOfSampleCodeInputAndExit"); });
                var formSetEvent = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "EventName", self._EventName, function (x) {
                    if (formSetEvent.ValidationResult == "") {
                        self.changeProperty("_EventName", x);
                    }
                }, Framework.Form.Validator.MinLength(3), function () { return (self._Action == "TDS" || self._Action == "SaveEvent" || self._Action == "SaveEventThenGoToNextPage"); });
                var controlIds = self.ListGroupOfControlFriendlyNames;
                if (controlIds == undefined) {
                    controlIds = [];
                }
                var formSetGroupOfControlID = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "Group", self._GroupOfControlID.join(', '), controlIds, function (x, btn) {
                    //TODO : cases à cocher ?
                    if (self._GroupOfControlID.indexOf(x) < 0) {
                        self._GroupOfControlID.push(x);
                    }
                    else {
                        Framework.Array.Remove(self._GroupOfControlID, x);
                    }
                    formSetGroupOfControlID.SetLabelForPropertyValue(self._GroupOfControlID.join(', '));
                }, true, Framework.Form.Validator.NotEmpty(Framework.LocalizationManager.Get("SelectOneOrSeveralControls")), function () { return (self._Action == "HideControl" || self._Action == "ShowControl"); });
                var formSetScreenId = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "Screen", this.defaultScreenIndex, this.screenNumbers, function (x, btn) {
                    //self._ScreenId = self.ScreenIds[Number(x) - 1];
                    self.changeProperty("_ScreenId", self.ScreenIds[Number(x) - 1]);
                }, true, Framework.Form.Validator.NotEmpty(Framework.LocalizationManager.Get("SelectAnchorId")), function () { return self._Action == "GoToScreen"; });
                var formSetCondition = Framework.Form.PropertyEditorWithButton.Render("Parameters", "Conditions", self._GoToScreenConditions.length.toString(), function () {
                    self.showConditionForm();
                    //TODO                    
                }, function () { return self._Action == "GoToScreenIf"; });
                if (mode == "edition") {
                    properties.push(formSetBackgroundMode);
                    properties.push(formSetImage);
                    properties.push(formSetSound);
                    properties.push(formSetSoundBinaries);
                    properties.push(formSetOneClickOnly);
                }
                if (mode == "edition") {
                    var formSetTextDecoration = Framework.Form.PropertyEditorWithPopup.Render("Design", "TextStyle", Framework.LocalizationManager.Get("ClickToEdit"), ["Normal", "Bold", "Italic", "Bold and italic"], function (x) {
                        if (x == "Bold") {
                            self.changeProperty("_FontWeight", "bold");
                            self.changeProperty("_FontStyle", "");
                        }
                        if (x == "Italic") {
                            self.changeProperty("_FontStyle", "italic");
                            self.changeProperty("_FontWeight", "");
                        }
                        if (x == "Normal") {
                            self.changeProperty("_FontStyle", "");
                            self.changeProperty("_FontWeight", "");
                        }
                        if (x == "Bold and italic") {
                            self.changeProperty("_FontWeight", "bold");
                            self.changeProperty("_FontStyle", "italic");
                        }
                        self.updateControl();
                    });
                    properties.push(formSetTextDecoration);
                    var formSetTextSize = Framework.Form.PropertyEditorWithPopup.Render("Design", "FontSize", self._FontSize.toString(), Framework.InlineHTMLEditor.FontSizeEnum, function (x) {
                        //self._FontSize = Number(x);
                        self.changeProperty("_FontSize", Number(x));
                        self.updateControl();
                    });
                    properties.push(formSetTextSize);
                    var formSetTextForeground = Framework.Form.PropertyEditorWithColorPopup.Render("Design", "TextColor", self._Foreground, function (x) {
                        //self._Foreground = x;
                        self.changeProperty("_Foreground", x);
                        self.updateControl();
                    });
                    properties.push(formSetTextForeground);
                    var formSetTextFontFamily = Framework.Form.PropertyEditorWithPopup.Render("Design", "TextFont", self._FontFamily, Framework.InlineHTMLEditor.FontNameEnum, function (x) {
                        //self._FontFamily = x;
                        self.changeProperty("_FontFamily", x);
                        self.updateControl();
                    });
                    properties.push(formSetTextFontFamily);
                }
                if (mode == "creation" || mode == "edition") {
                    properties.push(formSetAction);
                    properties.push(formSetURL);
                    properties.push(formSetBlank);
                    properties.push(formSetURLVariablePart);
                    properties.push(formSetEvent);
                    properties.push(formSetGroupOfControlID);
                    properties.push(formSetScreenId);
                    properties.push(formSetCondition);
                    properties.push(formSetConfirmationRequired);
                }
                return properties;
            };
            CustomButton.prototype.getActionList = function () {
                var list = ["GoToPreviousPage", "GoToNextPage", /*"CloseApplication"*/ , "GoToLoginScreen", "GoToScreen", "GoToUrl", "GoToUrlAndGoToNextPage",
                    "TDS", "SaveEvent", "SaveEventThenGoToNextPage", "StartSameSession", "HideControl", "ShowControl"];
                if (this.screen.Controls.filter(function (x) { return x instanceof ScreenReader.Controls.DataControl; }).length > 0) {
                    list.push("StartChronometer");
                    list.push("StopChronometer");
                    list.push("StopChronometerAndGoToNextPage");
                    list.push("GoToScreenIf");
                }
                if (Models.Screen.HasControlOfType(this.screen, "MediaRecorderControl")) {
                    list.push("StopRecorder");
                }
                if (Models.Screen.HasControlOfType(this.screen, "SampleCodeInput")) {
                    list.push("GoToScreenOfDesignItem");
                }
                if (this.screen.ExperimentalDesignId > 0) {
                    list.push("AddIntakeThenGoToNextPage");
                    list.push("GoToScreenOfSampleCodeInput");
                    list.push("GoToScreenOfSampleCodeInputAndExit");
                }
                return list;
            };
            Object.defineProperty(CustomButton.prototype, "screenNumbers", {
                get: function () {
                    var screenIds = [];
                    for (var i = 1; i <= this.ScreenIds.length; i++) {
                        screenIds.push(i.toString());
                    }
                    return screenIds;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(CustomButton.prototype, "defaultScreenIndex", {
                get: function () {
                    if (this._ScreenId == undefined) {
                        this._ScreenId = this.ScreenIds[0];
                    }
                    var screenIndex = (this.ScreenIds.indexOf(this._ScreenId) + 1).toString();
                    return screenIndex;
                },
                enumerable: false,
                configurable: true
            });
            CustomButton.prototype.getScreenIndex = function (screenId) {
                return this.ScreenIds.indexOf(screenId) + 1;
            };
            CustomButton.prototype.showConditionForm = function () {
                var self = this;
                var conditions = Framework.Factory.Clone(this._GoToScreenConditions);
                var div = Framework.Form.TextElement.Create("");
                var getControlIds = function () {
                    return self.screen.Controls.filter(function (x) { return x instanceof DataControl; }).map(function (x) { return x._FriendlyName; });
                };
                var addCondition = function () {
                    var condition = new GoToScreenCondition();
                    condition.DataControlId = getControlIds()[0];
                    condition.DataControlValue = "";
                    condition.Operator = "IsEqual";
                    condition.ScreenId = self.ScreenIds[self.defaultScreenIndex];
                    conditions.push(condition);
                };
                if (conditions.length == 0) {
                    addCondition();
                }
                var parameters = new Framework.Form.DataTableParameters();
                parameters.ListData = conditions;
                parameters.ListColumns = [
                    { data: "DataControlId", title: Framework.LocalizationManager.Get("ID") },
                    { data: "Operator", title: Framework.LocalizationManager.Get("Operator") },
                    { data: "DataControlValue", title: Framework.LocalizationManager.Get("Value") },
                    {
                        data: "ScreenId", title: Framework.LocalizationManager.Get("Screen"), render: function (data, type, row) {
                            if (type === 'display') {
                                return self.getScreenIndex(data);
                            }
                            return "";
                        }
                    }
                ];
                parameters.OnEditCell = function (propertyName, data) {
                    if (propertyName == "DataControlId") {
                        return Framework.Form.Select.Render(data.DataControlId, Framework.KeyValuePair.FromArray(getControlIds()), Framework.Form.Validator.NotEmpty(), function (x) {
                            data.DataControlId = x;
                        }, false, ["tableInput"]).HtmlElement;
                    }
                    if (propertyName == "Operator") {
                        return Framework.Form.Select.Render(data.Operator, Framework.KeyValuePair.FromArray(GoToScreenCondition.OperatorEnum), Framework.Form.Validator.NotEmpty(), function (x) {
                            data.Operator = x;
                        }, false, ["tableInput"]).HtmlElement;
                    }
                    if (propertyName == "DataControlValue") {
                        return Framework.Form.InputText.Create(data.DataControlValue, function (x) {
                            data.DataControlValue = x;
                        }, Framework.Form.Validator.NotEmpty(), false, ["tableInput"]).HtmlElement;
                    }
                    if (propertyName == "ScreenId") {
                        var kvp_1 = [];
                        var index_1 = 1;
                        //let selectedIndex = -1;
                        self.ScreenIds.forEach(function (x) {
                            kvp_1.push(new Framework.KeyValuePair(index_1, x));
                            //if (x == data.ScreenId) {
                            //    selectedIndex = index;
                            //}
                            index_1++;
                        });
                        return Framework.Form.Select.Render(data.ScreenId, kvp_1, Framework.Form.Validator.NotEmpty(), function (x) {
                            data.ScreenId = Number(x);
                        }, false, ["tableInput"]).HtmlElement;
                    }
                };
                var dt;
                var sel = [];
                Framework.Form.DataTable.AppendToDiv("", "400px", div.HtmlElement, parameters, function (table) {
                    dt = table;
                }, function (selection) {
                    sel = selection;
                }, function () {
                    //OnAdd
                    addCondition();
                    dt.Refresh();
                }, function () {
                    sel.forEach(function (x) {
                        Framework.Array.Remove(conditions, x);
                    });
                    dt.Refresh();
                });
                var modal = Framework.Modal.Confirm(Framework.LocalizationManager.Get("Conditions"), div.HtmlElement, function () {
                    self.changeProperty("_GoToScreenConditions", conditions);
                    //self._GoToScreenConditions = conditions;
                });
            };
            CustomButton.Create = function (text, action, height, width) {
                if (text === void 0) { text = Framework.LocalizationManager.Get("EnterText"); }
                if (action === void 0) { action = ""; }
                if (height === void 0) { height = 60; }
                if (width === void 0) { width = 150; }
                var customButton = new CustomButton();
                customButton._Height = height;
                customButton._Width = width;
                customButton._BorderThickness = 1;
                customButton._Action = action;
                customButton._Content = text;
                customButton.DefaultLeftCoordinate = "Right";
                customButton.DefaultTopCoordinate = "Bottom";
                customButton._BackgroundMode = "Transparent";
                return customButton;
            };
            CustomButton.prototype.SetStyle = function (style) {
                if (style === void 0) { style = {}; }
                if (style) {
                    _super.prototype.SetStyle.call(this, style);
                    if (style["FontColor"]) {
                        //this._Background = style["FontColor"];
                        this.changeProperty("_Background", style["FontColor"]);
                    }
                    this.updateControl();
                }
            };
            CustomButton.BackgroundModeEnum = ["Transparent", "Opaque", "Image"];
            return CustomButton;
        }(BaseControl));
        Controls.CustomButton = CustomButton;
        var CustomProgressBar = /** @class */ (function (_super) {
            __extends(CustomProgressBar, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function CustomProgressBar() {
                var _this = _super.call(this) || this;
                _this._DisplayMode = "Numeric"; // Mode d'affichage : "Numeric", "Bar"
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "DisplayMode", "_DisplayMode");
                //}
                _this._Type = "CustomProgressBar";
                return _this;
            }
            CustomProgressBar.GetProgress = function (customProgressBar) {
                if (customProgressBar._DisplayMode == "Numeric") {
                    return (customProgressBar.label.innerText);
                }
                if (customProgressBar._DisplayMode == "Bar") {
                    return (customProgressBar.progress.title);
                }
            };
            CustomProgressBar.prototype.Render = function (editMode, ratio) {
                _super.prototype.Render.call(this, editMode, ratio);
                if (this._DisplayMode == "Numeric") {
                    this.label = document.createElement("label");
                    if (this.CurrentScreenIndex != undefined && this.LastScreenIndex != undefined) {
                        this.label.innerText = this.CurrentScreenIndex + "/" + this.LastScreenIndex;
                    }
                    else {
                        this.label.innerText = "x/x";
                    }
                    this.HtmlElement.appendChild(this.label);
                    this.label.style.fontFamily = this._FontFamily;
                    //this.label.style.color = Framework.Color.RgbToHex(this._Foreground);
                    this.label.style.color = this._Foreground;
                    this.label.style.borderWidth = this._BorderThickness + "px";
                    //this.label.style.borderColor = Framework.Color.RgbToHex(this._BorderBrush);
                    this.label.style.borderColor = this._BorderBrush;
                    this.label.style.fontSize = this._FontSize * ratio + "px";
                    this.label.style.fontWeight = this._FontWeight;
                    this.label.style.fontStyle = this._FontStyle;
                }
                if (this._DisplayMode == "Bar") {
                    this.progress = document.createElement("progress");
                    if (this.CurrentScreenIndex != undefined && this.LastScreenIndex != undefined) {
                        this.progress.value = this.CurrentScreenIndex / this.LastScreenIndex;
                        this.progress.max = 1;
                        this.progress.title = this.CurrentScreenIndex + "/" + this.LastScreenIndex;
                    }
                    this.HtmlElement.appendChild(this.progress);
                    //this.progress.style.color = Framework.Color.RgbToHex(this._Foreground);
                    this.progress.style.color = this._Foreground;
                    this.progress.style.borderWidth = this._BorderThickness + "px";
                    //this.progress.style.borderColor = Framework.Color.RgbToHex(this._BorderBrush);
                    this.progress.style.borderColor = this._BorderBrush;
                    //this.progress.style.background = Framework.Color.RgbToHex(this._Background);
                    this.progress.style.background = this._Background;
                }
            };
            CustomProgressBar.DisplayModeEnum = ["None", "Numeric", "Bar"];
            CustomProgressBar.PositionEnum = ["TopLeft", "TopCenter", "TopRight", "BottomLeft", "BottomCenter", "BottomRight"];
            return CustomProgressBar;
        }(BaseControl));
        Controls.CustomProgressBar = CustomProgressBar;
        //TODO : supprimer et remplacer par framework.select
        //class ComboBox extends BaseControl {
        //    private select: HTMLSelectElement; // Contrôle HTML associé : <select>
        //    public SelectedValue: string;
        //    private listValues: Framework.KeyValuePair[];
        //    public OnChange: Function;
        //    private title: string;
        //    constructor(listValues: Framework.KeyValuePair[], selectedValue: string, title: string) {
        //        super();
        //        this.SelectedValue = selectedValue;
        //        this.listValues = listValues;
        //        this.title = title;
        //    }
        //    public Render(editMode: boolean = false, ratio: number): void {
        //        var _combobox = this;
        //        super.Render(editMode, ratio);
        //        this.select = document.createElement("select");
        //        let hasSelectedValue = false;
        //        for (var i = 0; i < this.listValues.length; i++) {
        //            var option = document.createElement("option");
        //            option.value = this.listValues[i].Key;
        //            option.text = this.listValues[i].Value;
        //            if (option.value == this.SelectedValue) {
        //                option.selected = true;
        //                hasSelectedValue = true;
        //            }
        //            this.select.appendChild(option);
        //        }
        //        // Option vide
        //        var option = document.createElement("option");
        //        option.value = "";
        //        option.text = "";
        //        if (hasSelectedValue == false) {
        //            option.selected = true;
        //            this.SelectedValue = "";
        //            this.IsValid = false;
        //            this.ValidationMessage = Framework.LocalizationManager.Get("MandatoryAnswer") + this.title + "\r\n";
        //        }
        //        this.select.appendChild(option);
        //        if (editMode) {
        //            _combobox.select.disabled = true;
        //        } else {
        //            this.select.onchange = () => {
        //                _combobox.SetValue(_combobox.select.value);
        //            };
        //        }
        //        this.HtmlElement.appendChild(this.select);
        //        this.select.style.fontFamily = this._FontFamily;
        //        //this.select.style.color = Framework.Color.RgbToHex(this._Foreground);
        //        this.select.style.color = this._Foreground;
        //        this.select.style.borderWidth = this._BorderThickness + "px";
        //        //this.select.style.borderColor = Framework.Color.RgbToHex(this._BorderBrush);
        //        this.select.style.borderColor = this._BorderBrush;
        //        this.select.style.borderStyle = "solid";
        //        this.select.style.fontSize = this._FontSize*ratio + "px";
        //        this.select.style.fontWeight = this._FontWeight;
        //        this.select.style.fontStyle = this._FontStyle;
        //        this.select.style.width = this._Width + "px";
        //        this.select.style.height = this._Height + "px";
        //        //this.select.style.background = Framework.Color.RgbToHex(this._Background);
        //        this.select.style.background = this._Background;
        //        this.select.style.boxSizing = "border-box";
        //        this.select.style.display = "table-cell";
        //        this.select.style.verticalAlign = "middle";
        //        this.HtmlElement.style.display = "table";
        //    }
        //    public SetValue(value: string) {
        //        this.select.value = value;
        //        this.SelectedValue = value;
        //        if (this.SelectedValue != undefined && this.SelectedValue.length > 0) {
        //            this.IsValid = true;
        //        }
        //        else {
        //            this.IsValid = false;
        //            this.ValidationMessage = this.title + " " + Framework.LocalizationManager.Get("MustAnswerAllAttributes") + "\r\n";
        //        }
        //        if (this.OnChange != undefined) {
        //            this.OnChange();
        //        }
        //    }
        //}
        var Label = /** @class */ (function (_super) {
            __extends(Label, _super);
            function Label(text) {
                var _this = _super.call(this) || this;
                _this.HorizontalAlignment = "left";
                _this.VerticalAlignment = "middle";
                _this.IsEditable = false;
                _this.AcceptReturn = true;
                _this.ToolbarInsertTextButtons = [];
                _this.WhiteSpace = "pre-wrap";
                _this.Margin = 20;
                var self = _this;
                if (text) {
                    _this.text = text;
                }
                else {
                    _this.text = "";
                }
                _this.WhiteSpace = "pre-wrap";
                return _this;
            }
            Object.defineProperty(Label.prototype, "Div", {
                get: function () {
                    return this.label;
                },
                enumerable: false,
                configurable: true
            });
            Label.prototype.GetText = function () {
                return this.label.innerHTML;
            };
            Label.prototype.GetTextWithoutFormat = function () {
                return this.label.innerText;
            };
            Label.prototype.SetText = function (text) {
                this.label.innerHTML = text;
            };
            //public Edit() {
            //    let textarea = document.createElement("textarea");
            //    textarea.innerHTML = this.text;
            //    let rect = this.HtmlElement.getBoundingClientRect();
            //    let div = document.createElement("div");
            //    div.style.background = "lightgray";
            //    //div.style.width = rect.width + 'px';
            //    //div.style.height = rect.height + 'px';
            //    let toolbarDiv = document.createElement("div");
            //    //toolbarDiv.style.width = "800px";
            //    div.appendChild(toolbarDiv);
            //    div.appendChild(textarea);
            //    let modal = Framework.Modal.Custom(div, undefined, undefined, "auto", "auto", false, true, true);
            //    let self = this;
            //    modal.OnClose = () => {
            //        let text = tinymce.activeEditor.getContent()
            //        self.label.innerHTML = text;
            //        self.OnChanged(text);
            //    };
            //    tinymce.init({
            //        target: textarea,
            //        toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
            //        menubar: false,
            //        statusbar: false,
            //        fixed_toolbar_container: toolbarDiv,
            //        //height: (rect.height + 50)  + 'px',
            //        //width:1200,
            //        setup: function (ed) {
            //            ed.on('init', function (args) {
            //                //setTimeout(() => {
            //                //(<HTMLIFrameElement>document.getElementById(ed.id + '_ifr')).width = rect.width + 'px';                                                                
            //                //(<HTMLIFrameElement>document.getElementById(ed.id + '_ifr')).height = rect.height + 'px';                   
            //                let csstext = 'width:' + rect.width + 'px !important;height:' + rect.height + 'px !important';
            //                (<HTMLIFrameElement>document.getElementById(ed.id + '_ifr')).style.cssText = csstext;
            //                //}, 500);
            //                //        //document.getElementById(ed.id + '_ifr').style.height = rect.height + 'px';
            //                //        document.getElementById(ed.id + '_ifr').style.width = rect.width + 'px';
            //                //        document.getElementById(ed.id + '_ifr').parentElement.style.background = "gray";
            //                //let ifr = (<HTMLIFrameElement>document.getElementsByClassName("tox-edit-area__iframe")[0]);
            //                //ifr.width = "400px !important";
            //            });
            //        }
            //    });
            //}
            Label.prototype.Render = function (editMode, ratio) {
                //TODO : gestion undo/redo
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                var self = this;
                this.label = document.createElement("div");
                // Texte : taille adaptée au scaling
                var f = function convertir(chn, p1, decalage, s) {
                    var r = chn.split(':')[0] + ": " + Math.round(Number(p1) * ratio);
                    return r;
                };
                //let text = this.text.replace(/font-size:\s*(\d+)\s*/g, f);                
                var text = this.text;
                this.label.innerHTML = text;
                //this.label.innerHTML = this.text;
                this.HtmlElement.appendChild(this.label);
                this.HtmlElement.style.background = "transparent";
                this.label.style.fontFamily = this._FontFamily;
                this.label.style.color = this._Foreground;
                this.label.style.fontSize = this._FontSize * ratio + "px";
                this.label.style.fontWeight = this._FontWeight;
                this.label.style.fontStyle = this._FontStyle;
                this.label.style.height = (this._Height * ratio) + "px";
                this.label.style.maxHeight = (this._Height * ratio) + "px";
                this.label.style.width = (this._Width * ratio) + "px";
                this.label.style.boxSizing = "border-box";
                this.label.style.verticalAlign = this.VerticalAlignment;
                this.label.style.textAlign = this.HorizontalAlignment;
                this.label.style.textOverflow = "ellipsis";
                //this.label.style.whiteSpace = "pre-wrap";
                this.label.style.whiteSpace = this.WhiteSpace;
                //this.label.style.paddingTop = "6px";
                this.label.style.display = "table-cell";
                this.HtmlElement.style.display = "table";
                this.HtmlElement.style.tableLayout = "fixed";
                this.HtmlElement.style.wordWrap = "break-word";
                this.label.style.lineHeight = ((this.Margin + this._FontSize) * ratio) + "px";
                var editable = false;
                if (this.IsEditable == true) {
                    this.label.contentEditable = "true";
                    editable = true;
                }
                else {
                    //this.label.contentEditable = "false";
                    this.label.classList.add("noselect");
                    this.label.spellcheck = false;
                }
                if (editMode == true && this.IsEditable == true) {
                    //if (self.OnChanged) {
                    //                self.OnChanged(self.GetText());
                    //        }
                    //ICI supp
                    //self.HtmlElement.addEventListener('mouseup', function (e) {
                    //    //formatselect | outdent indent |  checklist |  casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',                            
                    //    tinymce.init({
                    //        //content_style: "body { line-height: 1; }",
                    //        target: self.label,
                    //        inline: true,
                    //        width: "950px",
                    //        plugins: 'lists emoticons link',
                    //        fixed_toolbar_container: '#textEditToolbar',
                    //        toolbar: 'undo redo | alignleft aligncenter alignright alignjustify | numlist bullist | bold italic underline strikethrough | forecolor backcolor | fontselect fontsizeselect | emoticons link removeformat',
                    //        fontsize_formats: "8px 10px 12px 14px 18px 22px 24px 28px 32px 36px 42px 50px 60px",
                    //        menubar: false,
                    //        statusbar: false,
                    //        color_map: [
                    //            '#BFEDD2', 'Light Green',
                    //            '#FBEEB8', 'Light Yellow',
                    //            '#F8CAC6', 'Light Red',
                    //            '#ECCAFA', 'Light Purple',
                    //            '#C2E0F4', 'Light Blue',
                    //            '#2DC26B', 'Green',
                    //            '#F1C40F', 'Yellow',
                    //            '#E03E2D', 'Red',
                    //            '#B96AD9', 'Purple',
                    //            '#3598DB', 'Blue',
                    //            '#169179', 'Dark Turquoise',
                    //            '#E67E23', 'Orange',
                    //            '#BA372A', 'Dark Red',
                    //            '#843FA1', 'Dark Purple',
                    //            '#236FA1', 'Dark Blue',
                    //            '#ECF0F1', 'Light Gray',
                    //            '#CED4D9', 'Medium Gray',
                    //            '#95A5A6', 'Gray',
                    //            '#7E8C8D', 'Dark Gray',
                    //            '#34495E', 'Navy Blue',
                    //            '#000000', 'Black',
                    //            '#ffffff', 'White',
                    //        ],
                    //        setup: function (ed) {
                    //            ed.on('Change', function (args) {                                    
                    //                if (self.OnChanged) {
                    //                    self.OnChanged(self.GetText());
                    //                }
                    //            });
                    //            //ed.on('init', function (e) {
                    //            //    e.target.fire("focusin");
                    //            //});
                    //            //TODO : bouton insert
                    //            //ed.ui.registry.addButton('customInsertButton', {
                    //            //    text: 'My Button',
                    //            //    onAction: function (_) {
                    //            //        ed.insertContent('&nbsp;<strong>It\'s my button!</strong>&nbsp;');
                    //            //    }
                    //            //});
                    //        }
                    //    });
                    //    //self.Edit();
                    //    // Sélection
                    //    //let selection: string = window.getSelection().toString();
                    //    //if (selection.length > 0) {
                    //    //    self.showSelectionToolbar(() => {
                    //    //        if (self.OnChanged) {
                    //    //            self.OnChanged(self.GetText());
                    //    //        }
                    //    //    }, self.ToolbarInsertTextButtons);
                    //    //} else {
                    //    //    if (self.ToolbarInsertTextButtons.length > 0) {
                    //    //        self.showSelectionToolbar(() => {
                    //    //            if (self.OnChanged) {
                    //    //                self.OnChanged(self.GetText());
                    //    //            }
                    //    //        }, self.ToolbarInsertTextButtons, false);
                    //    //    }
                    //    //}
                    //}, false);
                }
                if (editMode == false && this.label.contentEditable == "true") {
                    //if (editMode == false && editable == true) {
                    setTimeout(function () {
                        if (self.AcceptReturn == false) {
                            self.HtmlElement.addEventListener('keydown', function (e) {
                                if (e.keyCode == 13) {
                                    e.preventDefault();
                                }
                            });
                        }
                        self.HtmlElement.addEventListener('keyup', function (e) {
                            // Changement de texte
                            if (self.OnChanged) {
                                self.OnChanged(self.GetText());
                            }
                        }, false);
                        self.HtmlElement.addEventListener('DOMNodeInserted', function (e) {
                            // Changement de style
                            if (self.OnChanged) {
                                self.OnChanged(self.GetText());
                            }
                        }, false);
                        self.HtmlElement.addEventListener('DOMNodeRemoved', function (e) {
                            // Changement de style
                            if (self.OnChanged) {
                                self.OnChanged(self.GetText());
                            }
                        }, false);
                    }, 100);
                }
            };
            return Label;
        }(BaseControl));
        Controls.Label = Label;
        //TODO : supprimer et remplacer par framework.inputtext
        //class TextBox extends BaseControl {
        //    //public TextWrapping: string;
        //    //public TextAlignment: string; 
        //    //TODO : mask?
        //    private input: HTMLTextAreaElement; // Contrôle HTML associé : <input type=text>
        //    public Required: boolean = false;
        //    //public InputType: string = "text";
        //    public PlaceHolder: string;
        //    public Text: string;
        //    public OnInput: Function;
        //    public AcceptReturn: boolean = true;
        //    constructor(text: string = "") {
        //        super();
        //        this.Text = text;
        //    }
        //    public Render(editMode: boolean = false, ratio: number): void {
        //        super.Render(editMode, ratio);
        //        this.input = document.createElement("textarea");
        //        // Validation css
        //        //this.input.type = this.InputType;
        //        this.input.required = this.Required;
        //        this.input.value = this.Text;
        //        this.IsValid = this.input.validity.valid;
        //        this.input.placeholder = this.PlaceHolder;
        //        this.input.style.overflow = "hidden";
        //        this.input.style.boxSizing = "border-box";
        //        this.input.style["resize"] = "none";
        //        this.input.style["-ms-overflow-style"] = "none";
        //        var _textbox = this;
        //        if (this.AcceptReturn == false) {
        //            // Interdir le retour chariot
        //            this.input.onkeypress = function (event) {
        //                if (event.which == 13) {
        //                    return false;
        //                }
        //            };
        //        }
        //        if (editMode) {
        //            this.input.disabled = true;
        //        } else {
        //            this.input.oninput = () => {
        //                _textbox.SetText(this.input.value);
        //            };
        //        }
        //        this.HtmlElement.appendChild(this.input);
        //        this.input.style.fontFamily = this._FontFamily;
        //        //this.input.style.color = Framework.Color.RgbToHex(this._Foreground);
        //        this.input.style.color = this._Foreground;
        //        this.input.style.borderWidth = this._BorderThickness + "px";
        //        this.input.style.borderStyle = "solid";
        //        //this.input.style.borderColor = Framework.Color.RgbToHex(this._BorderBrush);
        //        this.input.style.borderColor = this._BorderBrush;
        //        this.input.style.fontSize = this._FontSize + "px";
        //        this.input.style.fontWeight = this._FontWeight;
        //        this.input.style.fontStyle = this._FontStyle;
        //        this.input.style.height = this._Height + "px";
        //        this.input.style.width = this._Width + "px";
        //        //this.input.style.background = Framework.Color.RgbToHex(this._Background);
        //        this.input.style.background = this._Background;
        //        this.input.style.overflowY = "auto";
        //        this.input.classList.add("vk"); // Clavier virtuel
        //    }
        //    public SetText(text: string) {
        //        this.input.value = text;
        //        this.IsValid = this.input.validity.valid;
        //        this.Text = this.input.value;
        //        if (this.OnInput != undefined) {
        //            this.OnInput();
        //        }
        //    }
        //}
        var DataControl = /** @class */ (function (_super) {
            __extends(DataControl, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function DataControl() {
                var _this = _super.call(this) || this;
                //TODO : ajouter imperative qui remplace dans tous les contrôles hérités IsImperative, MustAnswer...
                _this.OnDataChanged = undefined;
                _this._DataType = ""; // Type de données
                _this._ExperimentalDesignId = 0; // Identifiant du plan de présentation
                _this._EvaluationMode = ""; // Mode d'évaluation : Product/Attribute
                _this._CustomErrorMessage = "";
                _this.showExperimentalDesignProperty = true;
                _this.Intake = 1;
                _this.Items = [];
                _this.LoadExistingData = false;
                _this.ListData = [];
                _this.PreviousReplicateData = [];
                _this.ListExperimentalDesigns = []; // Passé en paramètre depuis scénario en mode création/édition
                return _this;
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "DataType", "_DataType");
                //    this.setPropertyFromXaml(control, "ExperimentalDesignId", "_ExperimentalDesignId");
                //    this.setPropertyFromXaml(control, "EvaluationMode", "_EvaluationMode");
                //    this.setPropertyFromXaml(control, "akaName", "_AkaName");
                //}
            }
            DataControl.prototype.onDataChanged = function (data) {
                if (this.OnDataChanged) {
                    this.OnDataChanged(data);
                }
            };
            DataControl.prototype.SetStartDate = function (date) {
                if (this.StartDate == undefined) {
                    this.StartDate = date;
                    if (this.IsTemporalDataControl()) {
                        var d = new Models.Data();
                        d.AttributeCode = "START";
                        d.DataControlId = this._Id;
                        d.ControlName = this._FriendlyName;
                        d.ProductCode = this.ProductCode;
                        d.ProductRank = this.ProductRank;
                        d.Replicate = this.Replicate;
                        d.Intake = this.Intake;
                        if (d.Type == "TI") {
                            d.Score = 0;
                        }
                        else {
                            d.Score = 1;
                        }
                        d.Session = this.UploadId;
                        d.SubjectCode = this.SubjectCode;
                        d.Type = this._DataType;
                        d.RecordedDate = date;
                        d.Time = 0;
                        // Si aucun stop déjà enregistré
                        var previousStart = this.ListData.filter(function (x) { return x.AttributeCode == "START" && x.DataControlId == d.DataControlId && x.ProductCode == d.ProductCode && x.ProductRank == d.ProductRank && x.Replicate == d.Replicate && x.Session == d.Session && x.SubjectCode == d.SubjectCode; });
                        if (previousStart.length == 0) {
                            this.ListData.push(d);
                            this.onDataChanged(d);
                        }
                    }
                }
            };
            DataControl.prototype.IsTemporalDataControl = function () {
                // retourne les contrôles enregistrant un temps potentiellement associés à START/STOP
                var res = false;
                res = this instanceof Controls.DataControl
                    && (this._DataType == "TCATA"
                        || this._DataType == "DynamicProfile"
                        || this._DataType == "DynamicLiking"
                        || this._DataType == "TDS"
                        || this._DataType == "TI"
                        || this._DataType == "DATI");
                return res;
            };
            DataControl.prototype.SetStopDate = function (date) {
                if (this.StopDate == undefined) {
                    this.StopDate = date;
                    if (this.IsTemporalDataControl()) {
                        var d = new Models.Data();
                        d.AttributeCode = "STOP";
                        d.DataControlId = this._Id;
                        d.ControlName = this._FriendlyName;
                        d.ProductCode = this.ProductCode;
                        d.ProductRank = this.ProductRank;
                        d.Replicate = this.Replicate;
                        d.Intake = this.Intake;
                        if (d.Type == "TI") {
                            d.Score = 0;
                        }
                        else {
                            d.Score = 1;
                        }
                        d.Session = this.UploadId;
                        d.SubjectCode = this.SubjectCode;
                        d.Type = this._DataType;
                        d.RecordedDate = date;
                        d.Time = (date.getTime() - this.StartDate.getTime()) / 1000;
                        // Si aucun stop déjà enregistré
                        var previousStop = this.ListData.filter(function (x) { return x.AttributeCode == "STOP" && x.DataControlId == d.DataControlId && x.ProductCode == d.ProductCode && x.ProductRank == d.ProductRank && x.Replicate == d.Replicate && x.Session == d.Session && x.SubjectCode == d.SubjectCode; });
                        if (previousStop.length == 0) {
                            this.ListData.push(d);
                            this.onDataChanged(d);
                        }
                        // Calcul temps standardisé
                        var existingData = this.ListData.filter(function (x) { return x.DataControlId == d.DataControlId && x.ProductCode == d.ProductCode && x.Replicate == d.Replicate && x.SubjectCode == d.SubjectCode && x.Time > 0; });
                        if (existingData.length > 0) {
                            existingData = existingData.sort(function (a, b) {
                                if (a.Time - b.Time > 0) {
                                    return 1;
                                }
                                if (a.Time - b.Time < 0) {
                                    return -1;
                                }
                            });
                            var firstTime_1 = existingData[0].Time;
                            existingData.forEach(function (x) {
                                x.StandardizedTime = Framework.Maths.Round((x.Time - firstTime_1) / d.Time, 3);
                            });
                            for (var i = 0; i < existingData.length - 1; i++) {
                                existingData[i].Duration = Framework.Maths.Round(existingData[i + 1].Time - existingData[i].Time, 3);
                            }
                        }
                        d.StandardizedTime = 1;
                    }
                }
            };
            DataControl.prototype.SetExperimentalDesign = function (design) {
                if (design == undefined) {
                    return;
                }
                this.ExperimentalDesign = design;
                this.ExperimentalDesign.CanAddItem = false;
                this.changeProperty("_ExperimentalDesignId", design.Id);
                //this._ExperimentalDesignId = design.Id;
                // Référence à this pour les lambdas
                var _dataControl = this;
                this.Items = [];
                if (this.ExperimentalDesign.ListExperimentalDesignRows.length > 0) {
                    // Vérification : rép existe ?
                    var replicate_1 = _dataControl.Replicate;
                    if (replicate_1 == undefined) {
                        replicate_1 = 1;
                    }
                    var repExists = this.ExperimentalDesign.ListExperimentalDesignRows.filter(function (x) { return (x.SubjectCode == _dataControl.SubjectCode && x.Replicate == _dataControl.Replicate); }).length > 0;
                    if (!repExists) {
                        replicate_1 = 1;
                    }
                    var subjectCode_1 = _dataControl.SubjectCode;
                    if (subjectCode_1 == undefined) {
                        subjectCode_1 = this.ExperimentalDesign.ListExperimentalDesignRows[0].SubjectCode;
                    }
                    // Lignes de plan de présentation du sujet pour la rép
                    var rows = this.ExperimentalDesign.ListExperimentalDesignRows.filter(function (x) { return (x.SubjectCode == subjectCode_1 && x.Replicate == replicate_1); });
                    rows = rows.sort(function (row1, row2) {
                        return row1.Rank - row2.Rank;
                    });
                    if (rows[0].Code) {
                        rows.forEach((function (x) { _dataControl.Items.push(new Models.CodeLabel(x.Code, x.Label)); }));
                    }
                    else if (rows[0]["AttributeCode"] || rows[0]["ProductCode"] || rows[0]["ProductCode1"]) {
                        // Origine SL (conservé pour comaptibilité V1)s
                        if (this._EvaluationMode == "Product") {
                            rows.forEach((function (x) { _dataControl.Items.push(new Models.CodeLabel(x.AttributeCode, x.AttributeLabel)); }));
                        }
                        if (this._EvaluationMode == "Attribute") {
                            rows.forEach((function (x) { _dataControl.Items.push(new Models.CodeLabel(x.ProductCode, x.ProductLabel)); }));
                        }
                        if (this._EvaluationMode == "TriangleTest") {
                            rows.forEach((function (x) { _dataControl.Items.push(new Models.CodeLabel(Models.TriangleTestExperimentalDesignRow.GetTriangle(x), Models.TriangleTestExperimentalDesignRow.GetTriangleLabel(x))); }));
                        }
                    }
                }
            };
            DataControl.prototype.SetExistingData = function (listData) {
                if (listData.length > 0) {
                    //this.LoadExistingData = true;
                    this.ListData = listData;
                }
            };
            DataControl.prototype.SetPreviousReplicateData = function (listData) {
                if (listData.length > 0) {
                    this.PreviousReplicateData = listData;
                }
            };
            DataControl.prototype.GetValue = function () {
                return [];
            };
            //TODO : utiliser partout
            DataControl.prototype.AddData = function (code, rank) {
                if (code === void 0) { code = undefined; }
                if (rank === void 0) { rank = undefined; }
                var d = new Models.Data();
                if (this._EvaluationMode == "Attribute") {
                    d.ProductCode = code;
                    d.ProductRank = rank;
                }
                else {
                    d.ProductCode = this.ProductCode;
                    d.ProductRank = this.ProductRank;
                }
                if (this._EvaluationMode == "Product") {
                    d.AttributeCode = code;
                    d.AttributeRank = rank;
                }
                else {
                    d.AttributeCode = this.AttributeCode;
                    d.AttributeRank = this.AttributeRank;
                }
                d.ControlName = this._FriendlyName;
                d.Replicate = this.Replicate;
                d.Intake = this.Intake;
                d.RecordedDate = new Date(Date.now());
                d.Session = this.UploadId;
                d.SubjectCode = this.SubjectCode;
                d.Type = this._DataType;
                this.ListData.push(d);
                return d;
            };
            DataControl.prototype.Enable = function () {
                //this.IsEnabled = false;
            };
            DataControl.prototype.Disable = function () {
                //this.IsEnabled = true;
            };
            DataControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition" || mode == "creation") {
                    if (this.showExperimentalDesignProperty == true) {
                        var validateFormSetExperimentalDesignFormProperty_1 = function () {
                            var text = Framework.LocalizationManager.Get("None");
                            var designs = self.ListExperimentalDesigns.filter(function (x) { return x.Id == self._ExperimentalDesignId; });
                            if (designs.length > 0) {
                                text = designs[0].Name;
                            }
                            formSetExperimentalDesignFormProperty_1.SetLabelForPropertyValue(text);
                            if (self._ExperimentalDesignId <= 0) {
                                formSetExperimentalDesignFormProperty_1.ValidationResult = Framework.LocalizationManager.Get("SelectExperimentalDesign");
                            }
                            formSetExperimentalDesignFormProperty_1.Check();
                        };
                        //TODO : si un seul plan prés, ne pas poser la question
                        //TODO : si pas de plan de prés, en créer un nouveau
                        var formSetExperimentalDesignFormProperty_1 = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "ExperimentalDesign", "", this.ListExperimentalDesigns.map(function (x) { return x.Name; }), function (x, btn) {
                            self.SetExperimentalDesign(self.ListExperimentalDesigns.filter(function (y) { return y.Name == x; })[0]);
                            validateFormSetExperimentalDesignFormProperty_1();
                        });
                        validateFormSetExperimentalDesignFormProperty_1();
                        properties.push(formSetExperimentalDesignFormProperty_1);
                    }
                    var formCustomErrorProperty = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "CustomErrorMessage", this._CustomErrorMessage, function (x) {
                        self.changeProperty("_CustomErrorMessage", x);
                    });
                    properties.push(formCustomErrorProperty);
                }
                return properties;
            };
            return DataControl;
        }(BaseControl));
        Controls.DataControl = DataControl;
        var FreeListOfTerms = /** @class */ (function (_super) {
            __extends(FreeListOfTerms, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function FreeListOfTerms() {
                var _this = _super.call(this) || this;
                // TODO : bouton pour supprimer une ligne (ou la remettre à vide)
                _this._MinNumberOfItems = 0; // Nombre maximal de descripteurs à générer
                _this._MaxNumberOfItems = 10; // Nombre minimal de descripteurs à générer
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "MinNumberOfItems", "_MinNumberOfItems");
                //    this.setPropertyFromXaml(control, "MaxNumberOfItems", "_MaxNumberOfItems");
                //    this.setPropertyFromXaml(control, "ExperimentalDesignId", "_ExperimentalDesignId");
                //}
                _this._Type = "FreeListOfTerms";
                _this.additionalEditableProperties = ["ControlDesign"];
                _this.validate();
                return _this;
            }
            FreeListOfTerms.Create = function (experimentalDesignId) {
                if (experimentalDesignId === void 0) { experimentalDesignId = 0; }
                var control = new FreeListOfTerms();
                control._Height = 600;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                control._ExperimentalDesignId = experimentalDesignId;
                return control;
            };
            FreeListOfTerms.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                var self = this;
                //let res: Models.Data[] = [];
                //for (var i = this._MinNumberOfItems; i < this._MaxNumberOfItems; i++) {
                //    let d = new Models.Data();
                //    d.AttributeCode = "";
                //    d.AttributeRank = i + 1;
                //    res.push(d);
                //}
                var table = new Framework.Form.Table();
                table.ListColumns = [];
                var col1 = new Framework.Form.TableColumn();
                col1.Name = "Label";
                col1.Title = Framework.LocalizationManager.Get("Label");
                col1.Filterable = false;
                col1.Sortable = false;
                col1.MinWidth = 100;
                table.ListColumns.push(col1);
                var selection = [];
                table.Height = this._Height + "px";
                table.ListData = self.ExperimentalDesign.ListExperimentalDesignRows.filter(function (x) { return x.SubjectCode == self.SubjectCode; });
                table.OnDataUpdated = function (expDesignRow, propertyName, oldValue, newValue) {
                    expDesignRow.Code = self.SubjectCode + "_" + newValue;
                    expDesignRow.Label = newValue;
                };
                table.AddFunction = function () {
                    var index = table.ListData.length + 1;
                    var expDesignRow = new Models.AttributeExperimentalDesignRow();
                    expDesignRow.Rank = index;
                    expDesignRow.Replicate = 1;
                    expDesignRow.SubjectCode = self.SubjectCode;
                    self.ExperimentalDesign.ListExperimentalDesignRows.push(expDesignRow);
                    expDesignRow.Code = self.SubjectCode + "_Descriptor_" + index;
                    expDesignRow.Label = Framework.LocalizationManager.Get("Descriptor") + " " + index;
                    table.Insert([expDesignRow]);
                    self.validate();
                };
                table.RemoveFunction = function () {
                    selection.forEach(function (x) {
                        Framework.Array.Remove(self.ExperimentalDesign.ListExperimentalDesignRows, x);
                    });
                    table.Remove(selection);
                    self.validate();
                };
                table.OnSelectionChanged = (function (x) {
                    selection = x;
                });
                self.ExperimentalDesign.CanAddItem = true;
                //table.ShowFooter = false;
                table.Render(this.HtmlElement, this._Width);
                //let dtParameters = new Framework.Form.DataTableParameters();
                //dtParameters.ListData = res;
                //dtParameters.ListColumns = [
                //    {
                //        data: "AttributeCode", title: Framework.LocalizationManager.Get("Attribute"), className: 'dt-body-right', render: function (data, type, row) {
                //            if (data == "") {
                //                return '<span style="font-style:italic;color:gray;width:100%">' + Framework.LocalizationManager.Get("Attribute") + " " + row["AttributeRank"] + '</span>';
                //            } else {
                //                return data;
                //            }
                //        }
                //    }
                //];
                //dtParameters.Order = [[0, 'desc']];
                //dtParameters.Paging = false;
                //dtParameters.Filtering = false;
                //dtParameters.Ordering = false;
                //if (editMode == false) {
                //    dtParameters.OnEditCell = (propertyName, data) => {
                //        let l = Framework.Form.InputText.Create(data[propertyName], (x) => {
                //            data[propertyName] = x;
                //            self.validate();
                //            let expDesignRow: Models.ExperimentalDesignRow = self.ExperimentalDesign.ListExperimentalDesignRows[data["AttributeRank"] - 1];
                //            if (expDesignRow == undefined) {
                //                expDesignRow = new Models.AttributeExperimentalDesignRow();
                //                expDesignRow.Rank = data["AttributeRank"];
                //                expDesignRow.Replicate = 1;
                //                expDesignRow.SubjectCode = self.SubjectCode;
                //                self.ExperimentalDesign.ListExperimentalDesignRows.push(expDesignRow);
                //            }
                //            expDesignRow.Code = self.SubjectCode + "_" + x;
                //            expDesignRow.Label = x;
                //        }, Framework.Form.Validator.NoValidation(), false, ["tableInput"]);
                //        l.HtmlElement.style.textAlign = "left";
                //        return l.HtmlElement;
                //    }
                //}
                //dtParameters.TdHeight = 20;
                //let dtTable: Framework.Form.DataTable;
                //Framework.Form.DataTable.AppendToDiv(undefined, this._Height + "px", this.HtmlElement, dtParameters, (dt) => {
                //    dtTable = dt;
                //    dt.SetStyle('td', 'text-align', 'left');
                //    dt.SetStyle('td', 'font-weight', self._FontWeight);
                //    dt.SetStyle('td', 'font-style', self._FontStyle);
                //    dt.SetStyle('td', 'font-size', self._FontSize + "px");
                //    dt.SetStyle('td', 'color', self._Foreground);
                //    dt.SetStyle('td', 'font-family', self._FontFamily);
                //});
            };
            FreeListOfTerms.prototype.validate = function () {
                var self = this;
                // Nb min et max de descripteurs  
                if (this.ExperimentalDesign) {
                    var fill = this.ExperimentalDesign.ListExperimentalDesignRows.filter(function (x) { return x.SubjectCode == self.SubjectCode; }).length;
                    this.IsValid = fill >= this._MinNumberOfItems && fill <= this._MaxNumberOfItems;
                    if (this.IsValid == false) {
                        this.ValidationMessage = Framework.LocalizationManager.Format("ItemsMustBeBetweenAnd", [this._MinNumberOfItems.toString(), this._MaxNumberOfItems.toString()]);
                    }
                    var uniqueDesc = Framework.Array.Unique(this.ListData.map(function (x) { return x.AttributeCode; }));
                    if (this.ListData.length > uniqueDesc.length) {
                        this.IsValid = false;
                        this.ValidationMessage = Framework.LocalizationManager.Get("AttributeLabelsHaveToBeUnique");
                    }
                }
            };
            FreeListOfTerms.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition" || mode == "creation") {
                    //TOFIX : vérifier max > min
                    var formSetMinNumberOfItems = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MinNumberOfItems", self._MinNumberOfItems, 0, self._MaxNumberOfItems, function (x) {
                        if (x <= self._MaxNumberOfItems) {
                            self.changeProperty("_MinNumberOfItems", x);
                        }
                    });
                    properties.push(formSetMinNumberOfItems);
                    var formSetMaxNumberOfItems = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MaxNumberOfItems", self._MaxNumberOfItems, self._MinNumberOfItems, 100, function (x) {
                        if (x >= self._MinNumberOfItems) {
                            self.changeProperty("_MaxNumberOfItems", x);
                        }
                    });
                    properties.push(formSetMaxNumberOfItems);
                }
                if (mode == "edition") {
                    var formSetTextDecoration = Framework.Form.PropertyEditorWithPopup.Render("ControlDesign", "TextStyle", Framework.LocalizationManager.Get("ClickToEdit"), ["Bold", "Italic"], function (x) {
                        if (x == "Bold") {
                            //self._FontWeight = "bold";
                            self.changeProperty("_FontWeight", "bold");
                        }
                        else {
                            //self._FontWeight = "";
                            self.changeProperty("_FontWeight", "");
                        }
                        if (x == "Italic") {
                            //self._FontStyle = "italic";
                            self.changeProperty("_FontStyle", "italic");
                        }
                        else {
                            //self._FontStyle = "";
                            self.changeProperty("_FontStyle", "");
                        }
                        self.updateControl();
                    });
                    properties.push(formSetTextDecoration);
                    var formSetTextSize = Framework.Form.PropertyEditorWithPopup.Render("ControlDesign", "FontSize", self._FontSize.toString(), Framework.InlineHTMLEditor.FontSizeEnum, function (x) {
                        //self._FontSize = Number(x);
                        self.changeProperty("_FontSize", Number(x));
                        self.updateControl();
                    });
                    properties.push(formSetTextSize);
                    var formSetTextForeground = Framework.Form.PropertyEditorWithColorPopup.Render("ControlDesign", "TextColor", self._Foreground, function (x) {
                        //self._Foreground = x;
                        self.changeProperty("_Foreground", x);
                        self.updateControl();
                    });
                    properties.push(formSetTextForeground);
                    var formSetTextFontFamily = Framework.Form.PropertyEditorWithPopup.Render("ControlDesign", "TextFont", self._FontFamily, Framework.InlineHTMLEditor.FontNameEnum, function (x) {
                        //self._FontFamily = x;
                        self.changeProperty("_FontFamily", x);
                        self.updateControl();
                    });
                    properties.push(formSetTextFontFamily);
                }
                return properties;
            };
            return FreeListOfTerms;
        }(DataControl));
        Controls.FreeListOfTerms = FreeListOfTerms;
        var SpeechToText = /** @class */ (function (_super) {
            __extends(SpeechToText, _super);
            function SpeechToText() {
                var _this = _super.call(this) || this;
                //TODO : améliorer icones
                //TODO : définir contexte sensoriel (mots avec plus de poids) et mots à exclure
                _this._RecognitionLanguage = "None";
                _this.canRestart = true;
                _this._Type = "SpeechToText";
                //TODO
                _this._DataType = "SpeechToText";
                return _this;
            }
            SpeechToText.IsCompatible = function () {
                var isCompatible = true;
                var speechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
                if (speechRecognition == undefined) {
                    isCompatible = false;
                }
                return isCompatible;
            };
            SpeechToText.prototype.CheckCompatibility = function () {
                // let authorized Browsers = MS Edge, Chrome, Firefox or Opera
                var isCompatible = true;
                var speechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
                if (speechRecognition == undefined) {
                    isCompatible = false;
                }
                //var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
                //var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
                if (isCompatible == false) {
                    return "Chrome";
                }
                return "";
            };
            SpeechToText.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                var self = this;
                this.HtmlElement.className = "speechRecognitionLoading";
                self.HtmlElement.title = Framework.LocalizationManager.Get("SpeechRecognitionLoading");
                if (editMode == false) {
                    try {
                        this.ListData = [];
                        this.start();
                    }
                    catch (_a) {
                        //TODO : icone non compatible
                        self.HtmlElement.className = "speechRecognitionError";
                        self.HtmlElement.title = Framework.LocalizationManager.Get("BrowserNotCompatibleWithSpeechAPI");
                    }
                }
            };
            SpeechToText.prototype.start = function () {
                if (this.canRestart == false) {
                    return;
                }
                var self = this;
                //var colors = ['acide','salé','sucré','amer' ];
                //var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
                //var speechRecognitionList = new SpeechGrammarList();
                //speechRecognitionList.addFromString(grammar, 1);
                var speechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
                this.recognition = new speechRecognition();
                this.recognition.lang = 'fr-FR';
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.maxAlternatives = 1;
                //this.recognition.grammars = speechRecognitionList;
                this.recognition.onresult = function (event) {
                    //console.log(event);
                    try {
                        var speechToText = event.results[0][0].transcript;
                        self.OnSpeech(speechToText, event.results[0][0].confidence);
                        var d = self.AddData();
                        d.Type = "SpeechToText";
                        d.Description = speechToText;
                        d.Score = event.results[0][0].confidence;
                        //console.log(d);
                        //console.log(self.ListData);                  
                    }
                    catch (err) {
                        console.log(err);
                    }
                };
                this.recognition.onspeechend = function () {
                    //console.log("stop");
                };
                this.recognition.onaudiostart = function () {
                    //console.log("audiostart");
                };
                this.recognition.onaudioend = function () {
                    //console.log("audioend");
                };
                this.recognition.onsoundstart = function () {
                    //console.log("soundstart");
                    self.HtmlElement.className = "speechRecognitionStarted";
                    self.HtmlElement.title = Framework.LocalizationManager.Get("Recording");
                };
                this.recognition.onsoundend = function () {
                    console.log("soundend");
                    self.HtmlElement.className = "speechRecognitionWaiting";
                    self.HtmlElement.title = Framework.LocalizationManager.Get("Waiting");
                };
                this.recognition.onspeechstart = function () {
                    //console.log("speechstart");
                };
                this.recognition.onspeechend = function () {
                    console.log("speechend");
                };
                this.recognition.onstart = function () {
                    console.log("start");
                };
                this.recognition.onend = function () {
                    //console.log("end1");
                    self.start();
                };
                this.recognition.onnomatch = function (event) {
                    //console.log("nomatch");
                    //self.HtmlElement.innerHTML = "Not recognized: " + event.error;                    
                };
                this.recognition.onerror = function (event) {
                    //console.log("error");
                    //self.HtmlElement.innerHTML = 'Error occurred in recognition: ' + event.error;                    
                };
                this.recognition.start();
            };
            SpeechToText.prototype.Stop = function () {
                //alert("stop");
                this.canRestart = false;
                if (this.recognition) {
                    this.recognition.stop();
                    //console.log("end2");
                }
            };
            SpeechToText.Create = function (evaluationMode, language, text, height, width) {
                if (language === void 0) { language = "en-EN"; }
                if (text === void 0) { text = Framework.LocalizationManager.Get("SpeakToInputText"); }
                if (height === void 0) { height = 50; }
                if (width === void 0) { width = 50; }
                var control = new SpeechToText();
                control._EvaluationMode = evaluationMode;
                control._RecognitionLanguage = language;
                control._Height = height;
                control._Width = width;
                control._BorderThickness = 1;
                control.DefaultLeftCoordinate = "Right";
                control.DefaultTopCoordinate = "Top";
                return control;
            };
            SpeechToText.RecognitionLanguageEnum = ["None", "fr-FR", "en-EN"];
            return SpeechToText;
        }(DataControl));
        Controls.SpeechToText = SpeechToText;
        //export class SpeechToText extends BaseControl {
        //    //TODO : améliorer icones
        //    //TODO : définir contexte sensoriel
        //    public _RecognitionLanguage: string = "None";
        //    public static RecognitionLanguageEnum: string[] = ["None","fr-FR","en-EN"];
        //    public OnSpeech: (text: string) => void;
        //    constructor() {
        //        super();
        //        this._Type = "SpeechToText";
        //    }
        //    public CheckCompatibility(): string {
        //        // let authorized Browsers = MS Edge, Chrome, Firefox or Opera
        //        let isCompatible: boolean = true;
        //        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        //        if (getUserMedia == undefined) {
        //            isCompatible = false;
        //        }
        //        var audioContext = window.AudioContext || window.webkitAudioContext;
        //        if (audioContext == undefined) {
        //            alert("b");
        //            isCompatible = false;
        //        }
        //        if (isCompatible == false) {
        //            return "Edge, Chrome, Firefox, Opera";
        //        }
        //        return "";
        //    }
        //    public Render(editMode: boolean = false): void {
        //        super.Render(editMode);
        //        let self = this;
        //        this.HtmlElement.className = "speechRecognitionLoading";
        //        self.HtmlElement.title = Framework.LocalizationManager.Get("SpeechRecognitionLoading");
        //        if (editMode == false) {
        //            try {
        //                this.createAndSetupClient();
        //                this.start();
        //            } catch {
        //                //TODO : icone non compatible
        //                self.HtmlElement.className = "speechRecognitionError";
        //                self.HtmlElement.title = Framework.LocalizationManager.Get("BrowserNotCompatibleWithSpeechAPI");
        //            }
        //        }
        //    }
        //    private client: any;
        //    private start() {
        //        this.client.startMicAndContinuousRecognition();
        //    }
        //    private stop() {
        //        this.client.endMicAndContinuousRecognition();
        //    }
        //    public Stop() {
        //        this.stop();
        //    }
        //    private createAndSetupClient() {
        //        let self = this;
        //        if (this.client) {
        //            this.stop();
        //        }
        //        this.client = new BingSpeech.RecognitionClient('6d2194cdb9f64890b8660d400e0c072f', self._RecognitionLanguage);
        //        this.client.onFinalResponseReceived = function (response) {                    
        //            if (self.OnSpeech) {
        //                self.OnSpeech(response);
        //                //self.HtmlElement.innerHTML = response;
        //                //let div = document.createElement("div");
        //                //div.innerText = response;
        //                //Framework.Popup.Show(self.HtmlElement, div);
        //            }
        //        }
        //        this.client.onError = function (code, requestId) {
        //            self.HtmlElement.className = "speechRecognitionError";
        //            self.HtmlElement.title = Framework.LocalizationManager.Get("Error");
        //            setTimeout(() => {
        //                self.HtmlElement.className = "speechRecognitionStarted";
        //                self.HtmlElement.title = Framework.LocalizationManager.Get("SpeechRecognitionStarted");
        //            }, 500);
        //            //console.log("<Error with request n°" + requestId + ">" + code);
        //        }
        //        this.client.onVoiceDetected = function () {
        //            self.HtmlElement.className = "speechRecognitionStarted";
        //            self.HtmlElement.title = Framework.LocalizationManager.Get("SpeechRecognitionStarted");
        //        }
        //        this.client.onVoiceEnded = function () {
        //            self.HtmlElement.className = "speechRecognitionLoading";
        //            self.HtmlElement.title = Framework.LocalizationManager.Get("SpeechRecognitionEnded");
        //        }
        //        this.client.onNetworkActivityStarted = function () {
        //            //networkActivity.classList.remove("hidden");
        //        }
        //        this.client.onNetworkActivityEnded = function () {
        //            //networkActivity.classList.add("hidden");
        //        }
        //    }
        //    public static Create(language:string = "en-EN", text: string = Framework.LocalizationManager.Get("SpeakToInputText"), height: number = 50, width: number = 50): SpeechToText {
        //        let control: SpeechToText = new SpeechToText();
        //        control._RecognitionLanguage = language;
        //        control._Height = height;
        //        control._Width = width;
        //        control._BorderThickness = 1;
        //        control.defaultLeftCoordinate = "Right";
        //        control.defaultTopCoordinate = "Top";
        //        return control;
        //    }
        //}
        var CustomCheckBox = /** @class */ (function (_super) {
            __extends(CustomCheckBox, _super);
            function CustomCheckBox() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.IsChecked = false;
                _this.CanUncheck = false;
                return _this;
            }
            CustomCheckBox.prototype.Check = function () {
                this.HtmlElement.style.background = this._Background;
                this.IsChecked = true;
            };
            CustomCheckBox.prototype.Uncheck = function () {
                this.HtmlElement.style.background = "transparent";
                this.IsChecked = false;
            };
            CustomCheckBox.prototype.Click = function () {
                this.HtmlElement.click();
            };
            CustomCheckBox.prototype.SetLabel = function (checkBoxLabel, editMode) {
                var self = this;
                this.checkBoxLabel = checkBoxLabel;
                // Texte
                var label = "";
                if (checkBoxLabel.Visibility == true) {
                    label = checkBoxLabel.Label;
                }
                var tick = new Label(label);
                var measure = Framework.Scale.MeasureText(label, checkBoxLabel.FontSize, this._FontFamily, this._FontStyle, this._FontWeight);
                var tickWidth = measure.width;
                var tickHeight = measure.height;
                var margin = 0;
                if (checkBoxLabel.Margin) {
                    margin = checkBoxLabel.Margin;
                }
                var addTick = false;
                switch (checkBoxLabel.Placement) {
                    case "Top":
                        tick._Left = this._Width / 2 - tickWidth / 2;
                        tick._Top = -tickHeight - 2 - margin;
                        tick.HorizontalAlignment = "center";
                        addTick = true;
                        break;
                    case "Left":
                        tick._Left = -tickWidth - 2;
                        tick._Top = this._Height / 2 - tickHeight / 2;
                        addTick = true;
                        break;
                    case "Bottom":
                        tick._Left = this._Width / 2 - tickWidth / 2;
                        tick._Top = this._Height + 2;
                        addTick = true;
                        break;
                    case "Right":
                        tick._Left = this._Width + 2;
                        tick._Top = this._Height / 2 - tickHeight / 2;
                        tick.HorizontalAlignment = "right";
                        addTick = true;
                        break;
                }
                tick._ZIndex = this._ZIndex;
                tick._Width = tickWidth;
                tick._FontFamily = this._FontFamily;
                tick._Foreground = this._Foreground;
                if (checkBoxLabel.Color) {
                    tick._Foreground = checkBoxLabel.Color;
                }
                tick._FontSize = this._FontSize * Math.min(self.Ratio, 0.9);
                if (checkBoxLabel.FontSize) {
                    tick._FontSize = checkBoxLabel.FontSize * Math.min(self.Ratio, 0.9);
                }
                tick._FontWeight = this._FontWeight;
                tick._FontStyle = this._FontStyle;
                tick.IsEditable = false;
                tick.Render(editMode, self.Ratio);
                tick.HtmlElement.style.overflow = "hidden";
                tick.HtmlElement.style.whiteSpace = "nowrap";
                if (checkBoxLabel.TooltipImage && checkBoxLabel.TooltipImage.length > 0) {
                    var img = document.createElement("img");
                    img.src = checkBoxLabel.TooltipImage;
                    img.height = 100;
                    Framework.Popup.Create(tick.HtmlElement, img, "top", "hover");
                    tick.HtmlElement.style.cursor = "help";
                }
                if (addTick == true) {
                    this.HtmlElement.appendChild(tick.HtmlElement);
                }
                //if (editMode == true) {
                //    tick.OnChanged = (text) => {
                //        if (self.OnTickLabelChanged) {
                //            self.OnTickLabelChanged(self, text);
                //        }
                //    }
                //}
            };
            CustomCheckBox.prototype.Render = function (editMode, ratio) {
                _super.prototype.Render.call(this, editMode, ratio);
                // Checkbox = div remplie ou non
                this.HtmlElement.style.borderWidth = Math.max(1, this._BorderThickness) + "px";
                this.HtmlElement.style.boxShadow = "inset 1px " + this._BorderBrush;
                this.HtmlElement.style.background = "transparent";
                var _customCheckBox = this;
                if (editMode == false) {
                    this.HtmlElement.addEventListener('click', function () {
                        if (_customCheckBox.IsEnabled == false) {
                            return;
                        }
                        _customCheckBox.IsChecked = !_customCheckBox.IsChecked;
                        if (_customCheckBox.IsChecked == true) {
                            _customCheckBox.Check();
                        }
                        else {
                            if (_customCheckBox.CanUncheck) {
                                _customCheckBox.Uncheck();
                            }
                        }
                        // Masquer la sélection
                        if (_customCheckBox.DelayThumbVisibility > 0) {
                            setTimeout(function () {
                                _customCheckBox.HtmlElement.style.background = "transparent";
                            }, _customCheckBox.DelayThumbVisibility);
                        }
                        if (_customCheckBox.OnClick) {
                            _customCheckBox.OnClick();
                        }
                    }, false);
                }
            };
            CustomCheckBox.prototype.Enable = function () {
                this.IsEnabled = true;
                this.HtmlElement.style.cursor = "pointer";
                this.HtmlElement.classList.remove("disabled");
            };
            CustomCheckBox.prototype.Disable = function () {
                this.IsEnabled = false;
                this.HtmlElement.style.cursor = "not-allowed";
                this.HtmlElement.classList.add("disabled");
            };
            return CustomCheckBox;
        }(DataControl));
        var DiscreteScale = /** @class */ (function (_super) {
            __extends(DiscreteScale, _super);
            function DiscreteScale() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.CanUncheck = false;
                return _this;
            }
            DiscreteScale.prototype.SetSelectedValue = function (score) {
                var cb = this.listCustomCheckBox.filter(function (x) { return x.Value == score; })[0];
                cb.Check();
            };
            DiscreteScale.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                this.listCustomCheckBox = [];
                this.HtmlElement.className = "discreteScale";
                this.HtmlElement.style.background = "transparent";
                this.HtmlElement.style.borderWidth = "0";
                var self = this;
                var left = 0;
                var top = 0;
                // FontSize : espace réservé pour les éventuels CheckBoxLabels
                left += this._FontSize;
                top += this._FontSize;
                var increment = 0;
                if (this.Orientation == "Horizontal") {
                    increment = ((this._Width) / this.ListControlLabels.length - 10);
                    //left = (this._Width - (this.ListControlLabels.length * this.CheckBoxSize))/ (this.ListControlLabels.length + 1);
                }
                if (this.Orientation == "Vertical") {
                    increment = (this._Height) / this.ListControlLabels.length;
                }
                for (var i = 0; i < this.ListControlLabels.length; i++) {
                    var checkboxLabel = self.ListControlLabels[i];
                    // Case à cocher
                    var ccb = new CustomCheckBox();
                    if (this._Background != 'white') {
                        ccb._Background = this._Background;
                    }
                    else {
                        ccb._Background = this._BorderBrush;
                    }
                    //ccb._BorderBrush = this._BorderBrush;
                    if (checkboxLabel.Color && checkboxLabel.Color != "white") {
                        ccb._BorderBrush = checkboxLabel.Color;
                        ccb._Background = checkboxLabel.Color;
                    }
                    else {
                        ccb._BorderBrush = this._BorderBrush;
                    }
                    ccb._BorderThickness = this._BorderThickness;
                    ccb._FontFamily = this._FontFamily;
                    ccb._FontSize = this._FontSize;
                    ccb._FontWeight = this._FontWeight;
                    ccb._FontStyle = this._FontStyle;
                    ccb._Foreground = this._Foreground;
                    ccb._Width = this.CheckBoxSize;
                    ccb._Height = this.CheckBoxSize;
                    ccb._Top = top;
                    ccb._Left = left;
                    ccb._FriendlyName = this._FriendlyName;
                    if (this.Orientation == "Horizontal") {
                        left += increment;
                    }
                    if (this.Orientation == "Vertical") {
                        top += increment;
                    }
                    ccb.DelayThumbVisibility = this.DelayThumbVisibility;
                    ccb.Value = checkboxLabel.Value;
                    ccb.Render(editMode, ratio);
                    this.HtmlElement.appendChild(ccb.HtmlElement);
                    if (editMode == false) {
                        ccb.OnClick = function () {
                            var currentCheckBox = this;
                            // Décocher les autres cases
                            for (var i = 0; i < self.listCustomCheckBox.length; i++) {
                                var _ccb = self.listCustomCheckBox[i];
                                _ccb.Uncheck();
                            }
                            // Enregistrement
                            if (self.CanUncheck == true && self.AttachedData.Score == currentCheckBox.Value) {
                                self.AttachedData.Score = null;
                            }
                            else {
                                self.AttachedData.Score = currentCheckBox.Value;
                                currentCheckBox.Check();
                            }
                            self.AttachedData.RecordedDate = new Date(Date.now());
                            self.OnClick();
                        };
                    }
                    else {
                        if (this.OnTickLabelChanged) {
                            ccb.OnTickLabelChanged = function (cb, htmlContent) {
                                self.OnTickLabelChanged(cb.Value, htmlContent);
                            };
                        }
                    }
                    this.listCustomCheckBox.push(ccb);
                    ccb.SetLabel(checkboxLabel, editMode);
                }
            };
            DiscreteScale.prototype.ClickOnCheckBox = function (val) {
                var cb = this.listCustomCheckBox.filter(function (x) { return x.Value == val; });
                if (cb.length > 0) {
                    cb[0].Click();
                }
            };
            DiscreteScale.prototype.Enable = function () {
                for (var i = 0; i < this.listCustomCheckBox.length; i++) {
                    this.listCustomCheckBox[i].Enable();
                }
            };
            DiscreteScale.prototype.Disable = function () {
                for (var i = 0; i < this.listCustomCheckBox.length; i++) {
                    this.listCustomCheckBox[i].Disable();
                }
            };
            return DiscreteScale;
        }(DataControl));
        var StackedControl = /** @class */ (function (_super) {
            __extends(StackedControl, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function StackedControl() {
                var _this = _super.call(this) || this;
                _this._FirstItemRank = 0; // Rang du premier item à afficher
                _this._LastItemRank = 0; // Rang du dernier item à afficher
                _this._MustAnswerAllAttributes = false; // Réponse obligatoire ?
                _this._MinNumberOfAnswers = null;
                _this._MaxNumberOfAnswers = null;
                _this._ShowPreExistingScore = false; // Affichage des scores des réps précédentes ?
                _this._KeepSelectedItemVisibility = "";
                _this._SaveClickMode = ""; // Mode d'enregistrement : AllClicks, FirstClick, LastClick
                _this._ListControlStyle = []; //remplace listbackground
                _this.items = [];
                var self = _this;
                self._ControlBackground = "white";
                self._ControlBorderBrush = "black";
                self._ControlBorderThickness = 1;
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "FirstItemRank", "_FirstItemRank");
                //    this.setPropertyFromXaml(control, "LastItemRank", "_LastItemRank");
                //    this.setPropertyFromXaml(control, "MustAnswerAllAttributes", "_MustAnswerAllAttributes");
                //    this.setPropertyFromXaml(control, "ShowPreExistingScore", "_ShowPreExistingScore");
                //    this.setPropertyFromXaml(control, "KeepSelectedItemVisibility", "_KeepSelectedItemVisibility");
                //    this.setPropertyFromXaml(control, "SaveClickMode", "_SaveClickMode");
                //    this._ControlBorderThickness = this._BorderThickness;
                //    this._ControlBackground = this._Background;
                //    this._ControlForeground = this._Foreground;
                //    this._ControlBorderBrush = this._BorderBrush;
                //    this._Background = "white";
                //    this._BorderBrush = "white";
                //}
                self.additionalEditableProperties = ["ControlDesign"];
                return _this;
            }
            StackedControl.prototype.getRankedItems = function () {
                var res = [];
                var begin = this._FirstItemRank - 1;
                if (begin < 0) {
                    begin = 0;
                }
                if (this._LastItemRank == 0) {
                    this._LastItemRank = this.Items.length;
                }
                var nbItems = Math.min(this._LastItemRank - this._FirstItemRank + 1, this.Items.length);
                if (this.ExperimentalDesign && this.ExperimentalDesign.CanAddItem == true) {
                    nbItems = this.Items.length;
                }
                var cpt = 0;
                var index = begin;
                while (cpt < nbItems) {
                    if (this.Items[index]) {
                        res.push(this.Items[index]);
                    }
                    cpt++;
                    index++;
                }
                return res;
            };
            StackedControl.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                var self = this;
                this.ListData = [];
                this.items = this.getRankedItems();
                // Style par défaut issu du XAML
                this.items.forEach(function (x) {
                    var controlStyle = self.getControlStyle(x.Code);
                    if (controlStyle == undefined) {
                        controlStyle = new StackedControlStyle();
                        controlStyle.Code = x.Code;
                        controlStyle.FontFamily = undefined;
                        controlStyle.FontWeight = undefined;
                        controlStyle.FontStyle = undefined;
                        controlStyle.FontSize = undefined;
                        controlStyle.Background = undefined;
                        controlStyle.Foreground = undefined;
                        controlStyle.BorderThickness = undefined;
                        controlStyle.BorderBrush = undefined;
                        //controlStyle.Label = x.Label;
                        //let span = document.createElement("span");
                        //span.innerText = x.Label;
                        //span.style.fontFamily = self._FontFamily;
                        //span.style.fontWeight = self._FontWeight;
                        //span.style.fontSize = self._FontSize + "px";
                        //span.style.textDecoration = self._FontStyle;
                        ////span.style.color = Framework.Color.RgbToHex(self._Foreground);
                        //span.style.color = self._Foreground;
                        //controlStyle.HtmlContent = span.outerHTML;
                        //controlStyle.FontFamily = self._FontFamily;
                        //controlStyle.FontWeight = self._FontWeight == "bold";
                        //controlStyle.FontStyle = self._FontStyle == "italic";
                        //controlStyle.FontSize = self._FontSize;
                        self._ListControlStyle.push(controlStyle);
                    }
                    if (controlStyle.FontFamily == undefined) {
                        controlStyle.FontFamily = self._FontFamily;
                    }
                    if (controlStyle.FontWeight == undefined) {
                        controlStyle.FontWeight = self._FontWeight == "bold";
                    }
                    if (controlStyle.FontStyle == undefined) {
                        controlStyle.FontStyle = self._FontStyle == "italic";
                    }
                    if (controlStyle.FontSize == undefined) {
                        controlStyle.FontSize = self._FontSize;
                    }
                    if (controlStyle.Background == undefined) {
                        controlStyle.Background = self._ControlBackground;
                        //if (self._Type == "DTSButtonsControl") {
                        //    controlStyle.Background = "blue";
                        //}
                    }
                    if (controlStyle.Foreground == undefined) {
                        controlStyle.Foreground = self._ControlForeground;
                        //if (self._Type == "DTSButtonsControl") {
                        //    controlStyle.Foreground = "white";
                        //}
                    }
                    if (controlStyle.BorderThickness == undefined) {
                        controlStyle.BorderThickness = self._ControlBorderThickness;
                    }
                    if (controlStyle.BorderBrush == undefined) {
                        controlStyle.BorderBrush = self._ControlBorderBrush;
                    }
                    //let span = document.createElement("span");
                    //span.innerHTML = controlStyle.HtmlContent;
                    //if (span.innerText.indexOf(x.Label) < 0) {
                    //    // Changement de label depuis plan prés
                    //    //TODO : améliorer pour pas perdre toute mise en forme
                    //    span.innerText = x.Label;
                    //    controlStyle.HtmlContent = span.innerHTML;
                    //}
                });
            };
            StackedControl.prototype.OnChange = function (control) {
                if (this.IsEnabled == false) {
                    return;
                }
                // Enregistrement de la valeur dans ListData
                if (this._SaveClickMode != "AllClicks") {
                    var d = [];
                    if (this._EvaluationMode == "Product") {
                        d = this.ListData.filter(function (x) { return (x.AttributeCode == control.AttachedData.AttributeCode && x.Replicate == control.AttachedData.Replicate); });
                    }
                    if (this._EvaluationMode == "Attribute") {
                        d = this.ListData.filter(function (x) { return (x.ProductCode == control.AttachedData.ProductCode && x.Replicate == control.AttachedData.Replicate); });
                    }
                    if (d.length > 0) {
                        control.AttachedData.RecordedDate = new Date(Date.now());
                        d[0].RecordedDate = control.AttachedData.RecordedDate;
                        d[0].Score = control.AttachedData.Score;
                        if (this.StartDate != undefined) {
                            // Enregistrement du temps                        
                            control.AttachedData.Time = (control.AttachedData.RecordedDate.getTime() - this.StartDate.getTime()) / 1000;
                            d[0].Time = control.AttachedData.Time;
                        }
                        this.onDataChanged(d[0]);
                    }
                }
                else {
                    control.AttachedData.RecordedDate = new Date(Date.now());
                    var dd = new Models.Data();
                    dd.AttributeCode = control.AttachedData.AttributeCode;
                    dd.AttributeRank = control.AttachedData.AttributeRank;
                    dd.DataControlId = control.AttachedData.DataControlId;
                    dd.ControlName = control._FriendlyName;
                    dd.ProductCode = control.AttachedData.ProductCode;
                    dd.ProductRank = control.AttachedData.ProductRank;
                    dd.Replicate = control.AttachedData.Replicate;
                    dd.Score = control.AttachedData.Score;
                    dd.Session = control.AttachedData.Session;
                    dd.Intake = control.AttachedData.Intake;
                    dd.SubjectCode = control.AttachedData.SubjectCode;
                    dd.Type = control.AttachedData.Type;
                    if (this.StartDate != undefined) {
                        dd.Time = (new Date(Date.now()).getTime() - this.StartDate.getTime()) / 1000;
                    }
                    dd.RecordedDate = control.AttachedData.RecordedDate;
                    control.AttachedData.Time = dd.Time;
                    var existingData = [];
                    if (control instanceof CustomSlider) {
                        // Les 3 events du slider sont déclenchés mais il ne faut enregistrer la donnée qu'une fois
                        if (this._EvaluationMode == "Product") {
                            existingData = this.ListData.filter(function (x) { return x.AttributeCode == dd.AttributeCode
                                && x.DataControlId == dd.DataControlId
                                && x.ProductCode == dd.ProductCode
                                && x.Replicate == dd.Replicate
                                && x.Score == dd.Score
                                && x.Intake == dd.Intake
                                && x.Session == dd.Session
                                && (dd.Time - x.Time) < 0.1; });
                        }
                        if (this._EvaluationMode == "Attribute") {
                            existingData = this.ListData.filter(function (x) { return x.ProductCode == dd.ProductCode
                                && x.DataControlId == dd.DataControlId
                                && x.ProductCode == dd.ProductCode
                                && x.Replicate == dd.Replicate
                                && x.Score == dd.Score
                                && x.Intake == dd.Intake
                                && x.Session == dd.Session
                                && (dd.Time - x.Time) < 0.1; });
                        }
                    }
                    if (existingData.length == 0) {
                        this.ListData.push(dd);
                        this.onDataChanged(dd);
                    }
                }
                this.Validate();
            };
            StackedControl.prototype.Validate = function () {
                var _this = this;
                if (this._MustAnswerAllAttributes == true) {
                    this._MinNumberOfAnswers = this._MaxNumberOfAnswers = this.items.length;
                }
                if (this._MinNumberOfAnswers > 0 || this._MaxNumberOfAnswers > 0) {
                    this.ValidationMessage = "";
                    // Tous les scores doivent être non nuls
                    if (this._SaveClickMode != "AllClicks") {
                        var nullData = this.ListData.filter(function (x) { return (x.Score == null); });
                        //this.IsValid = nullData.length == 0;
                        var notNullData = this.ListData.filter(function (x) { return (x.Score != null); }).length;
                        this.IsValid = notNullData >= this._MinNumberOfAnswers && notNullData <= this._MaxNumberOfAnswers;
                        if (this.IsValid == false) {
                            this.ValidationMessage = "erreur";
                        }
                        // Message d'erreur
                        for (var i = 0; i < nullData.length; i++) {
                            var labelToDisplay = "";
                            var kvp = undefined;
                            if (this._EvaluationMode == "Product") {
                                kvp = (this.items.filter(function (x) {
                                    return x.Code == nullData[i].AttributeCode;
                                }))[0];
                            }
                            if (this._EvaluationMode == "Attribute") {
                                kvp = (this.items.filter(function (x) {
                                    return x.Code == nullData[i].ProductCode;
                                }))[0];
                            }
                            labelToDisplay = kvp.Label;
                            if (kvp.Label && kvp.Label.length == 0) {
                                labelToDisplay = kvp.Code;
                            }
                            this.ValidationMessage += labelToDisplay + "\n";
                            if (this._CustomErrorMessage != "") {
                                this.ValidationMessage = this._CustomErrorMessage + "\n";
                            }
                        }
                    }
                    else {
                        this.IsValid = true;
                        var nbAnswers = 0;
                        for (var i = 0; i < this.items.length; i++) {
                            var d = this.ListData.filter(function (x) { return (x.AttributeCode == _this.items[i].Code); });
                            if (d.length == 0) {
                                //this.IsValid = false;
                                var labelToDisplay = this.items[i].Label;
                                if (labelToDisplay.length == 0) {
                                    labelToDisplay = this.items[i].Code;
                                }
                                this.ValidationMessage += labelToDisplay + "\n";
                            }
                            else {
                                nbAnswers++;
                            }
                        }
                        this.IsValid = nbAnswers >= this._MinNumberOfAnswers && nbAnswers <= this._MaxNumberOfAnswers;
                    }
                    if (this.IsValid) {
                        this.ValidationMessage = "";
                    }
                    if (this.ValidationMessage.length > 0) {
                        this.ValidationMessage = Framework.LocalizationManager.Get("FollowingAttributesHaveToBeScored");
                        if (this._CustomErrorMessage != "") {
                            this.ValidationMessage = this._CustomErrorMessage + "\n";
                        }
                    }
                }
            };
            StackedControl.prototype.SetData = function (control, code, rank) {
                var _this = this;
                // Données à enregistrer
                var d = new Models.Data();
                if (this._EvaluationMode == "Product") {
                    d.AttributeCode = code;
                    d.ProductCode = this.ProductCode;
                    d.AttributeRank = rank;
                    d.ProductRank = this.ProductRank;
                }
                if (this._EvaluationMode == "Attribute") {
                    d.ProductCode = code;
                    d.AttributeCode = this.AttributeCode;
                    d.ProductRank = rank;
                    d.AttributeRank = this.AttributeRank;
                }
                d.DataControlId = this._Id;
                d.ControlName = this._FriendlyName;
                d.Replicate = this.Replicate;
                d.Intake = this.Intake;
                d.Score = null;
                d.Session = this.UploadId;
                d.SubjectCode = this.SubjectCode;
                d.Type = this._DataType;
                control.AttachedData = d;
                if (this.LoadExistingData == false) {
                    //control.AttachedData = d;
                    if (this._SaveClickMode != "AllClicks") {
                        this.ListData.push(d);
                    }
                }
                else {
                    // Données existante (navigation en arrière ou en mode panel leader)
                    var dd = [];
                    if (this._EvaluationMode == "Product") {
                        dd = this.ListData.filter(function (x) {
                            return (x.AttributeCode == code
                                //&& x.DataControlId == this._Id
                                && x.ControlName == _this._FriendlyName
                                && x.ProductCode == _this.ProductCode
                                && x.Replicate == _this.Replicate
                                && x.SubjectCode == _this.SubjectCode);
                        });
                    }
                    if (this._EvaluationMode == "Attribute") {
                        dd = this.ListData.filter(function (x) {
                            return (x.ProductCode == code
                                //&& x.DataControlId == this._Id
                                && x.ControlName == _this._FriendlyName
                                && x.ProductCode == _this.ProductCode
                                && x.Replicate == _this.Replicate
                                && x.SubjectCode == _this.SubjectCode);
                        });
                    }
                    if (dd.length > 0) {
                        control.AttachedData = dd[dd.length - 1];
                        control.SetSelectedValue(dd[dd.length - 1].Score);
                    }
                }
                if (this.PreviousReplicateData && this.PreviousReplicateData.length > 0) {
                    // Récupération score rép précédente
                    var dd = [];
                    if (this._EvaluationMode == "Product") {
                        dd = this.PreviousReplicateData.filter(function (x) {
                            return (x.AttributeCode == code
                                //&& x.DataControlId == this._Id
                                && x.ControlName == _this._FriendlyName
                                && x.ProductCode == _this.ProductCode
                                && x.Replicate == _this.Replicate - 1
                                && x.SubjectCode == _this.SubjectCode);
                        });
                    }
                    if (this._EvaluationMode == "Attribute") {
                        dd = this.PreviousReplicateData.filter(function (x) {
                            return (x.ProductCode == code
                                //&& x.DataControlId == this._Id
                                && x.ControlName == _this._FriendlyName
                                && x.ProductCode == _this.ProductCode
                                && x.Replicate == _this.Replicate - 1
                                && x.SubjectCode == _this.SubjectCode);
                        });
                    }
                    if (dd.length > 0) {
                        d.Score = Number(dd[0].Score);
                        control.AttachedData = d;
                        control.SetSelectedValue(d.Score);
                    }
                }
            };
            StackedControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition") {
                    if (self._FirstItemRank == 0) {
                        self._FirstItemRank = 1;
                    }
                    //TODO : test last > first
                    self.selectedItemCode = "All";
                    var formSetFirstItemRank = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "FirstItemRank", self._FirstItemRank, 1, self.Items.length, function (x) {
                        self.changeProperty("_FirstItemRank", x);
                        self.updateControl();
                    });
                    properties.push(formSetFirstItemRank);
                    var formSetLastItemRank = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "LastItemRank", Math.min(self._LastItemRank, self.Items.length), self._FirstItemRank, self.Items.length, function (x) {
                        self.changeProperty("_LastItemRank", x);
                        self.updateControl();
                    });
                    properties.push(formSetLastItemRank);
                    //let formApplyDesignToAll = Framework.Form.PropertyEditor.RenderWithToggle("ControlDesign", "CommonDesign", self._ApplyDesignToAll, (x) => {
                    //    self._ApplyDesignToAll = x;
                    //});
                    //properties.push(formApplyDesignToAll);
                    var setSelectionText_1 = function () {
                        if (self.selectedItemCode == "All") {
                            return Framework.LocalizationManager.Get(self.selectedItemCode);
                        }
                        return self.selectedItemCode;
                    };
                    var selection = Framework.Array.Merge(["All"], self.items.map(function (x) { return x.Code; }));
                    var formApplyDesignTo_1 = Framework.Form.PropertyEditorWithPopup.Render("ControlDesign", "ApplyDesignTo", setSelectionText_1(), selection, function (x) {
                        self.selectedItemCode = x;
                        formApplyDesignTo_1.SetLabelForPropertyValue(setSelectionText_1());
                    });
                    properties.push(formApplyDesignTo_1);
                    var getCurrentStyle = function (styleName) {
                        var styles = [];
                        //if (self._ApplyDesignToAll == true) {
                        if (self.selectedItemCode == "All") {
                            styles = self._ListControlStyle;
                        }
                        else {
                            styles = self._ListControlStyle.filter(function (x) { return x.Code == self.selectedItemCode; });
                        }
                        var text = Framework.LocalizationManager.Get("ClickToEdit");
                        if (styles.length > 0 && styles[0][styleName]) {
                            text = styles[0][styleName].toString();
                        }
                        return text;
                    };
                    var formSetTextAlignment = Framework.Form.PropertyEditorWithPopup.Render("ControlDesign", "TextAlignment", getCurrentStyle("HorizontalContentAlignment"), ["Left", "Center", "Right"], function (x) {
                        self._ListControlStyle.forEach(function (cs) {
                            if (self.selectedItemCode == "All" || cs.Code == self.selectedItemCode) {
                                cs.HorizontalContentAlignment = x;
                            }
                        });
                        self.updateControl();
                    });
                    properties.push(formSetTextAlignment);
                    var formSetTextDecoration = Framework.Form.PropertyEditorWithPopup.Render("ControlDesign", "TextStyle", Framework.LocalizationManager.Get("ClickToEdit"), ["Bold", "Italic"], function (x) {
                        self._ListControlStyle.forEach(function (cs) {
                            if (self.selectedItemCode == "All" || cs.Code == self.selectedItemCode) {
                                if (x == "Bold") {
                                    cs.FontWeight = !cs.FontWeight;
                                }
                                if (x == "Italic") {
                                    cs.FontStyle = !cs.FontStyle;
                                }
                            }
                        });
                        self.updateControl();
                    });
                    properties.push(formSetTextDecoration);
                    var formSetTextSize = Framework.Form.PropertyEditorWithPopup.Render("ControlDesign", "FontSize", getCurrentStyle("FontSize"), Framework.InlineHTMLEditor.FontSizeEnum, function (x) {
                        self._ListControlStyle.forEach(function (cs) {
                            if (self.selectedItemCode == "All" || cs.Code == self.selectedItemCode) {
                                cs.FontSize = Number(x);
                            }
                        });
                        self.updateControl();
                    });
                    properties.push(formSetTextSize);
                    var formSetTextForeground = Framework.Form.PropertyEditorWithColorPopup.Render("ControlDesign", "TextColor", getCurrentStyle("Foreground"), function (x) {
                        self._ListControlStyle.forEach(function (cs) {
                            if (self.selectedItemCode == "All" || cs.Code == self.selectedItemCode) {
                                cs.Foreground = x;
                            }
                        });
                        self.updateControl();
                    });
                    properties.push(formSetTextForeground);
                    var formSetTextFontFamily = Framework.Form.PropertyEditorWithPopup.Render("ControlDesign", "TextFont", getCurrentStyle("FontFamily"), Framework.InlineHTMLEditor.FontNameEnum, function (x) {
                        self._ListControlStyle.forEach(function (cs) {
                            if (self.selectedItemCode == "All" || cs.Code == self.selectedItemCode) {
                                cs.FontFamily = x;
                            }
                        });
                        self.updateControl();
                    });
                    properties.push(formSetTextFontFamily);
                    var formSetBorderWidth = Framework.Form.PropertyEditorWithNumericUpDown.Render("ControlDesign", "BorderThickness", Number(getCurrentStyle("BorderThickness")), 0, 10, function (x) {
                        self.setControlStyle("BorderThickness", x, self.selectedItemCode == "All");
                    });
                    properties.push(formSetBorderWidth);
                    var formSetAllButtonBackground = Framework.Form.PropertyEditorWithColorPopup.Render("ControlDesign", "BackgroundColor", getCurrentStyle("Background"), function (x) {
                        self.setControlStyle("Background", x, self.selectedItemCode == "All");
                    });
                    properties.push(formSetAllButtonBackground);
                    var formSetAllButtonBorder = Framework.Form.PropertyEditorWithColorPopup.Render("ControlDesign", "BorderColor", getCurrentStyle("BorderBrush"), function (x) {
                        self.setControlStyle("BorderBrush", x, self.selectedItemCode == "All");
                    });
                    properties.push(formSetAllButtonBorder);
                }
                if (mode == "edition" || mode == "creation" || mode == 'wizard') {
                    var formSetMustAnswerAllAttributes = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "MustAnswerAllAttributes", self._MustAnswerAllAttributes, function (x) {
                        self.changeProperty("_MustAnswerAllAttributes", x);
                    });
                    var formSetMinNumberOfAnswers = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MinNumberOfAnswers", self._MinNumberOfAnswers, 0, self.items.length, function (x) {
                        self.changeProperty("_MinNumberOfAnswers", x);
                    }, 1);
                    properties.push(formSetMinNumberOfAnswers);
                    var formSetMaxNumberOfAnswers = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MaxNumberOfAnswers", self._MaxNumberOfAnswers, 0, self.items.length, function (x) {
                        self.changeProperty("_MaxNumberOfAnswers", x);
                    }, 1);
                    properties.push(formSetMaxNumberOfAnswers);
                    properties.push(formSetMustAnswerAllAttributes);
                }
                return properties;
            };
            StackedControl.prototype.getControlStyle = function (code) {
                var ref = this._ListControlStyle.filter(function (x) { return x.Code == code; });
                if (ref.length > 0) {
                    return ref[0];
                }
                return undefined;
            };
            StackedControl.prototype.setControlStyle = function (attribute, value, applyToAll) {
                if (applyToAll === void 0) { applyToAll = false; }
                var self = this;
                var code = ""; // Code du bouton sélectionné
                if (this.selectedItemCode) {
                    code = this.selectedItemCode;
                }
                var memory = this._ListControlStyle;
                this._ListControlStyle.forEach(function (x) {
                    if (x.Code == code || applyToAll == true) {
                        x[attribute] = value;
                    }
                });
                this.OnPropertyChanged("_ListControlStyle", memory, this._ListControlStyle);
                this.updateControl();
            };
            StackedControl.prototype.SetStyle = function (style) {
                if (style === void 0) { style = {}; }
                if (style) {
                    //this._ListControlStyle.forEach((x) => {
                    //    let div = document.createElement("div");
                    //    div.innerHTML = x.Label;
                    //    //x.HtmlContent = '<span style="font-size:' + style["FontSize"] + 'px; font-family:' + style["FontFamily"] + '; color:' + style["FontColor"] + '">' + div.innerText + '</span>';
                    //});
                    this.setControlStyle("BorderBrush", style["FontColor"], true);
                    this.setControlStyle("Background", style["FontColor"], true);
                }
                this.updateControl();
            };
            return StackedControl;
        }(DataControl));
        Controls.StackedControl = StackedControl;
        var StackedControlWithLabel = /** @class */ (function (_super) {
            __extends(StackedControlWithLabel, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function StackedControlWithLabel() {
                var _this = _super.call(this) || this;
                //TODO : séparer espace entre label et control et espace entre controls (pour l'instant les 2 = linespacing)            
                _this._LabelPosition = "Left"; // Si ShowLabel, position du libellé de la collection de cases à cocher             
                _this._Orientation = "Horizontal"; // Orientation des collections de case à cocher : Horizontal, Vertical
                _this._ShowLabel = "AlwaysVisible"; // Affichage du libellé de la collection de cases à cocher ?
                _this._LabelWidth = 150; // Si ShowLabel, largeur (hauteur) du libellé de la collection de cases à cocher 
                _this._ListControlLabels = []; // Etiquettes des cases à cocher
                _this._LineSpacing = 0; // Espace entre chaque collection de cases à cocher
                _this._MarginBetweenLabelAndControl = 0;
                _this._ShowTooltip = false;
                _this.listControls = [];
                _this.additionalPropertyName = "CurrentScaleDesign";
                var self = _this;
                return _this;
                //if (control != null) {
                //    this._ListControlLabels = [];
                //    let checkBoxLabels = this.getPropertyFromXaml<string>(control, "CheckBoxLabels", "");
                //    if (checkBoxLabels.length > 0) {
                //        this._ListControlLabels = Framework.Serialization.JsonToInstance(this._ListControlLabels, checkBoxLabels);
                //    }
                //    let sliderLabels = this.getPropertyFromXaml<string>(control, "SliderLabels", "");
                //    if (sliderLabels.length > 0) {
                //        let labels = JSON.parse(sliderLabels);
                //        labels.forEach((x) => {
                //            let controlLabel: ControlLabel = new ControlLabel();
                //            controlLabel.Item = x.Item;
                //            controlLabel.Label = x.Label;
                //            controlLabel.Placement = x.Placement;
                //            controlLabel.Value = x["Position"];
                //            self._ListControlLabels.push(controlLabel);
                //        });
                //    }
                //    this.setPropertyFromXaml(control, "LabelPosition", "_LabelPosition");
                //    this.setPropertyFromXaml(control, "Orientation", "_Orientation");
                //    this.setPropertyFromXaml(control, "ShowLabel", "_ShowLabel");
                //    this.setPropertyFromXaml(control, "LabelWidth", "_LabelWidth");
                //    this.setPropertyFromXaml(control, "LineSpacing", "_LineSpacing");
                //}
            }
            StackedControlWithLabel.prototype.SetControlFactory = function (factory) {
                this.controlFactory = factory;
            };
            StackedControlWithLabel.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "creation") {
                    var validateFormSetDataType_1 = function () {
                        if (self._DataType == "None" || self._DataType == "") {
                            formSetDataType_1.ValidationResult = Framework.LocalizationManager.Get("SelectDataType");
                        }
                        self._SaveClickMode = "LastClick";
                        if (self._DataType == "DynamicLiking" || self._DataType == "DynamicProfile") {
                            self._SaveClickMode = "AllClicks";
                        }
                        formSetDataType_1.Check();
                    };
                    var formSetDataType_1 = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "DataType", this._DataType, StackedControlWithLabel.DataTypeEnum, function (x) {
                        self.changeProperty("_DataType", x);
                        validateFormSetDataType_1();
                    });
                    properties.push(formSetDataType_1);
                    validateFormSetDataType_1();
                }
                if (mode == "creation" || mode == "edition" || mode == 'wizard') {
                    var formSetOrientation = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "Orientation", self._Orientation, DiscreteScalesControl.OrientationEnum, function (x) {
                        self.changeProperty("_Orientation", x);
                        self.updateControl();
                    });
                    properties.push(formSetOrientation);
                    var formShowTooltip = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "Tooltip", self._ShowTooltip, function (x) {
                        self.changeProperty("_ShowTooltip", x);
                        self.updateControl();
                    });
                    properties.push(formShowTooltip);
                }
                if (mode == "edition") {
                    var formSetLabel = Framework.Form.PropertyEditorWithButton.Render("ControlDesign", "ScaleValues", Framework.LocalizationManager.Get("ClickToEdit"), function () {
                        if (self.selectedItemCode == 'All') {
                            self.ShowLabelTable('*');
                        }
                        else {
                            self.ShowLabelTable(self.selectedItemCode);
                        }
                    });
                    properties.push(formSetLabel);
                    //TOFIX
                    var formSetLineSpacing = Framework.Form.PropertyEditorWithNumericUpDown.Render("Design", "LineSpacing", self._LineSpacing, 0, 100, function (x) {
                        self.changeProperty("_LineSpacing", x);
                        self.updateControl();
                    });
                    properties.push(formSetLineSpacing);
                    var formSetMarginBetweenLabelAndControl = Framework.Form.PropertyEditorWithNumericUpDown.Render("Design", "MarginBetweenLabelAndControl", self._MarginBetweenLabelAndControl, 0, 100, function (x) {
                        self.changeProperty("_MarginBetweenLabelAndControl", x);
                        self.updateControl();
                    });
                    properties.push(formSetMarginBetweenLabelAndControl);
                    var formSetTickMarksVisibility = Framework.Form.PropertyEditorWithPopup.Render("Design", "TickMarksVisibility", self._ShowLabel, DiscreteScalesControl.TickMarksVisibilityEnum, function (x) {
                        //TODO : par slider
                        self.changeProperty("_ShowLabel", x);
                        self.updateControl();
                    });
                    properties.push(formSetTickMarksVisibility);
                    var formSetLabelWidth = Framework.Form.PropertyEditorWithNumericUpDown.Render("Design", "LabelWidth", self._LabelWidth, 0, 600, function (x) {
                        //TODO : par slider
                        self.changeProperty("_LabelWidth", x);
                        self.updateControl();
                    });
                    properties.push(formSetLabelWidth);
                    var formSetLabelPosition = Framework.Form.PropertyEditorWithPopup.Render("Design", "LabelPosition", self._LabelPosition, DiscreteScalesControl.LabelPositionEnum, function (x) {
                        //TODO : par slider
                        self.changeProperty("_LabelPosition", x);
                        self.updateControl();
                    });
                    properties.push(formSetLabelPosition);
                    // TODO si datatype == "DynamicLiking", "ProgressiveLiking", "DynamicProfile", "ProgressiveLiking" -> _ShowPreExistingScore
                    //    // TODO si datatype == "DynamicLiking", "DynamicProfile" -> _KeepSelectedItemVisibility, 
                }
                return properties;
            };
            StackedControlWithLabel.prototype.ShowLabelTable = function (item) {
                var divSlidersLabel = Framework.Form.TextElement.Create("");
                var self = this;
                var commonLabels = self._ListControlLabels.filter(function (x) { return x.Item == '*'; });
                var labels = commonLabels;
                if (item != '*') {
                    commonLabels.forEach(function (x) {
                        if (self._ListControlLabels.filter(function (y) { return y.Item == item && y.Value == x.Value; }).length == 0) {
                            var newLabel = new ControlLabel(x.Value, x.Label);
                            newLabel.Item = item;
                            newLabel.Label = x.Label;
                            newLabel.Placement = x.Placement;
                            newLabel.Value = x.Value;
                            newLabel.FontSize = x.FontSize;
                            newLabel.Margin = x.Margin;
                            newLabel.Color = x.Color;
                            self._ListControlLabels.push(newLabel);
                        }
                    });
                    labels = self._ListControlLabels.filter(function (x) { return x.Item == item; });
                }
                labels.forEach(function (x) {
                    if (x["FontSize"] == undefined) {
                        x["FontSize"] = 20;
                    }
                    if (x["Margin"] == undefined) {
                        x["Margin"] = 5;
                    }
                });
                var table = new Framework.Form.Table();
                table.ListColumns = [];
                var col1 = new Framework.Form.TableColumn();
                col1.Name = "Value";
                col1.Title = Framework.LocalizationManager.Get("Value");
                //let col1Validator = (code: string) => {
                //    return Framework.Form.Validator.HasMinLength(code, 1) + Framework.Form.Validator.IsUnique(code, self.subjects.map(a => a.Code));
                //}
                col1.Validator = Framework.Form.Validator.IsNumber();
                col1.RemoveSpecialCharacters = true;
                table.ListColumns.push(col1);
                var col2 = new Framework.Form.TableColumn();
                col2.Name = "Placement";
                col2.Title = Framework.LocalizationManager.Get("Placement");
                col2.Type = "enum";
                col2.MinWidth = 150;
                col2.Sortable = false;
                col2.Filterable = false;
                col2.EnumValues = Framework.KeyValuePair.FromArray(DiscreteScalesControl.TickPlacementsEnum, true);
                table.ListColumns.push(col2);
                var col3 = new Framework.Form.TableColumn();
                col3.Name = "Label";
                //col3.Type = "html";
                col3.MinWidth = 150;
                col3.Sortable = false;
                col3.Filterable = false;
                col3.Title = Framework.LocalizationManager.Get("Label");
                table.ListColumns.push(col3);
                var col4 = new Framework.Form.TableColumn();
                col4.Name = "TooltipImage";
                col4.Title = Framework.LocalizationManager.Get("Image");
                col4.Type = "image";
                col4.Filterable = false;
                col4.Sortable = false;
                col4.MinWidth = 120;
                table.ListColumns.push(col4);
                var col5 = new Framework.Form.TableColumn();
                col5.Name = "FontSize";
                col5.Title = Framework.LocalizationManager.Get("FontSize");
                col5.MinWidth = 150;
                col5.Type = "number";
                col5.Sortable = false;
                col5.Filterable = false;
                table.ListColumns.push(col5);
                var col6 = new Framework.Form.TableColumn();
                col6.Name = "Margin";
                col6.Title = Framework.LocalizationManager.Get("Margin");
                col6.Type = "number";
                col6.Sortable = false;
                col6.Filterable = false;
                table.ListColumns.push(col6);
                var col7 = new Framework.Form.TableColumn();
                col7.Name = "Color";
                col7.Title = Framework.LocalizationManager.Get("Color");
                col7.Type = "color";
                col7.Sortable = false;
                col7.Filterable = false;
                table.ListColumns.push(col7);
                table.Height = "500px";
                table.ListData = labels;
                //table.OnSelectionChanged = () => {
                //self.btnDeleteSubjects.CheckState();
                //self.btnSetSubjectsPasswords.CheckState();
                //};
                //TODO
                //table.OnDataUpdated = (subject: Models.Subject, propertyName: string, oldValue: any, newValue: any) => {
                //    //self.OnSubjectUpdate(subject, propertyName, oldValue, newValue);
                //};
                table.AddFunction = function () {
                    var label = new ScreenReader.Controls.ControlLabel(0, "");
                    label.Item = item;
                    label.Label = "";
                    label.Placement = "Top";
                    label.Value = commonLabels.map(function (x) { return x.Value; }).sort(function (a, b) {
                        if (a < b) {
                            return 1;
                        }
                        if (b < a) {
                            return -1;
                        }
                    })[0] + 1;
                    self._ListControlLabels.push(label);
                    table.Insert([label]);
                };
                table.RemoveFunction = function () {
                    table.SelectedData.forEach(function (x) {
                        var selection = self._ListControlLabels.filter(function (y) { return y.Value == x.Value; });
                        selection.forEach(function (y) {
                            Framework.Array.Remove(self._ListControlLabels, y);
                        });
                    });
                    table.Remove(table.SelectedData);
                };
                table.Render(divSlidersLabel.HtmlElement, 800);
                //let dtParameters = new Framework.Form.DataTableParameters();
                //dtParameters.ListColumns = [
                //    {
                //        data: "Value", title: Framework.LocalizationManager.Get("Value"), render: function (data, type, row) {
                //            return data;
                //        }
                //    },
                //    {
                //        data: "Placement", title: Framework.LocalizationManager.Get("Placement"), render: function (data, type, row) {
                //            return Framework.LocalizationManager.Get(data);
                //        }
                //    },
                //    {
                //        data: "Label", title: Framework.LocalizationManager.Get("Label"), render: function (data, type, row) {
                //            if (data && type === 'display') {
                //                return data;
                //            }
                //            return "";
                //        }
                //    },
                //];
                //dtParameters.Order = [[0, 'desc']];
                //dtParameters.Paging = false;
                //// Edition du contenu des cellules
                //dtParameters.OnEditCell = (propertyName, data) => {
                //    if (propertyName == "Value" /*&& item == '*'*/) {
                //        return Framework.Form.InputText.Create(data["Value"], (x) => {
                //            data["Value"] = x;
                //        }, Framework.Form.Validator.IsNumber(), false, ["tableInput"]).HtmlElement;
                //    }
                //    if (propertyName == "Placement") {
                //        return Framework.Form.Select.Render(data["Placement"], Framework.KeyValuePair.FromArray(DiscreteScalesControl.TickPlacementsEnum, true), Framework.Form.Validator.NotEmpty(), (x) => {
                //            data["Placement"] = x;
                //        }, false, ["tableInput"]).HtmlElement;
                //    }
                //    if (propertyName == "Label") {
                //        let l = Framework.Form.InputText.Create(data["Label"], (x) => {
                //            data["Label"] = x;
                //        }, Framework.Form.Validator.NoValidation(), false, ["tableInput"]);
                //        return l.HtmlElement;
                //    }
                //}
                //dtParameters.TdHeight = 20;
                var modal;
                //let dtTable: Framework.Form.DataTable;
                var btnOK = Framework.Form.Button.Create(function () { return true; }, function () {
                    self.updateControl();
                    modal.Close();
                }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("OK"));
                var btnCancel = Framework.Form.Button.Create(function () { return true; }, function () {
                    modal.Close();
                }, '<i class="fas fa-times"></i>', ["btnCircle"], Framework.LocalizationManager.Get("OK"));
                //let setTable = () => {
                //    let commonLabels = self._ListControlLabels.filter((x) => { return x.Item == '*'; });
                //    let labels = commonLabels;
                //    if (item != '*') {
                //        commonLabels.forEach((x) => {
                //            if (self._ListControlLabels.filter((y) => { return y.Item == item && y.Value == x.Value }).length == 0) {
                //                let newLabel = new ControlLabel();
                //                newLabel.Item = item;
                //                newLabel.Label = x.Label;
                //                newLabel.Placement = x.Placement;
                //                newLabel.Value = x.Value;
                //                self._ListControlLabels.push(newLabel);
                //            }
                //        });
                //        labels = self._ListControlLabels.filter((x) => { return x.Item == item; });
                //    }
                //    dtParameters.ListData = labels;
                //    Framework.Form.DataTable.AppendToDiv(undefined, '400px', divSlidersLabel.HtmlElement, dtParameters, (dt) => {
                //        dtTable = dt;
                //    }, (sel) => { },
                //        () => {
                //            let label: ScreenReader.Controls.ControlLabel = new ScreenReader.Controls.ControlLabel();
                //            label.Item = item;
                //            label.Label = "";
                //            label.Placement = "Top";
                //            label.Value = commonLabels.map((x) => { return x.Value }).sort((a, b) => {
                //                if (a < b) {
                //                    return 1;
                //                }
                //                if (b < a) {
                //                    return -1;
                //                }
                //            })[0] + 1;
                //            self._ListControlLabels.push(label);
                //            setTable();
                //        },
                //        () => {
                //            dtTable.SelectedData.forEach((x: ControlLabel) => {
                //                let selection = self._ListControlLabels.filter((y) => { return y.Value == x.Value });
                //                selection.forEach((y) => {
                //                    Framework.Array.Remove(self._ListControlLabels, y);
                //                });
                //            });
                //            setTable();
                //        });
                //}
                //setTable();
                modal = Framework.Modal.Custom(divSlidersLabel.HtmlElement, Framework.LocalizationManager.Get("MarksAndLabels") + " " + item, [btnCancel, btnOK]);
            };
            StackedControlWithLabel.prototype.GetListControls = function () {
                return this.listControls;
            };
            StackedControlWithLabel.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                if (this._LabelPosition == "None" || this._LabelPosition == "NR") {
                    this._LabelWidth = 0;
                }
                this.listControls = [];
                var self = this;
                var top = this._BorderThickness + 20;
                var left = this._BorderThickness;
                var _loop_3 = function () {
                    var isFirst = i == 0;
                    var isLast = i == this_2.items.length - 1;
                    control = this_2.controlFactory();
                    control._ZIndex = this_2._ZIndex;
                    //control._Id = this._Id;
                    control._FriendlyName = this_2._FriendlyName;
                    var code = this_2.items[i].Code;
                    var llabel = this_2.items[i].Label;
                    var labels = Framework.Factory.Clone(this_2._ListControlLabels);
                    var selectedLabels = labels.filter(function (x) { return x.Item == code; });
                    //if (selectedLabels.length == 0) {
                    selectedLabels = selectedLabels.concat(labels.filter(function (x) { return x.Item == '*'; }));
                    //}
                    control.ListControlLabels = selectedLabels;
                    if (!(self._ShowLabel == "AlwaysVisible" || (self._ShowLabel == "VisibleOnFirstLineOnly" && isFirst == true) || (self._ShowLabel == "VisibleOnLastLineOnly" && isLast == true))) {
                        control.ListControlLabels.forEach(function (x) { x.Visibility = false; });
                    }
                    else {
                        control.ListControlLabels.forEach(function (x) { x.Visibility = true; });
                    }
                    control.Orientation = this_2._Orientation;
                    control.DelayThumbVisibility = 0;
                    control._FontFamily = this_2._FontFamily;
                    control._FontSize = this_2._FontSize;
                    control._FontStyle = this_2._FontStyle;
                    control._FontWeight = this_2._FontWeight;
                    control._Foreground = this_2._Foreground;
                    var style = this_2.getControlStyle(code);
                    control._BorderThickness = style.BorderThickness;
                    control._BorderBrush = style.BorderBrush;
                    control._Background = style.Background;
                    switch (this_2._KeepSelectedItemVisibility) {
                        case "OneSecond":
                            control.DelayThumbVisibility = 1000;
                            break;
                        case "TwoSeconds":
                            control.DelayThumbVisibility = 2000;
                            break;
                        case "ThreeSeconds":
                            control.DelayThumbVisibility = 3000;
                            break;
                        case "FiveSeconds":
                            control.DelayThumbVisibility = 5000;
                            break;
                        case "TenSeconds":
                            control.DelayThumbVisibility = 10000;
                            break;
                        default:
                            control.DelayThumbVisibility = 0;
                            break;
                    }
                    //var label: Label = new Label(style.HtmlContent);
                    //let content = style.Label;
                    var content = llabel;
                    if (self._LabelWidth == 0) {
                        content = "";
                    }
                    if (self._ShowTooltip == true) {
                        content = '<i class="fas fa-info-circle" > </i> ' + content;
                    }
                    label = new Label(content);
                    label._Width = self._LabelWidth;
                    label._ZIndex = self._ZIndex;
                    label._Foreground = style.Foreground;
                    label.HorizontalAlignment = style.HorizontalContentAlignment;
                    if (style.FontWeight == true) {
                        label._FontWeight = "Bold";
                    }
                    if (style.FontStyle == true) {
                        label._FontStyle = "Italic";
                    }
                    label._FontSize = style.FontSize;
                    label._FontFamily = style.FontFamily;
                    label.IsEditable = false;
                    self.listControls.push(control);
                    //let controlWithLabel: ControlWithLabel = new ControlWithLabel(control, self._Height, self._Width, label, self._LabelPosition, self._Orientation, 0);
                    var controlWithLabel = new ControlWithLabel(control, self._Height, self._Width, label, self._LabelPosition, self._Orientation, self._MarginBetweenLabelAndControl);
                    controlWithLabel._Left = left;
                    controlWithLabel._Top = top;
                    if (editMode == true) {
                        //controlWithLabel.OnClick = (x) => {
                        //    // Highlight de l'échelle sélectionnée
                        //    x.HtmlElement.classList.add("selectedControlInsideAdorner");
                        //    self.selectedItemCode = x.HtmlElement.getAttribute("code");
                        //}
                        //controlWithLabel.OnLabelChanged = (x) => {
                        //    let ref = self.getControlStyle(code);
                        //    ref.HtmlContent = x;
                        //}
                        control.OnTickLabelChanged = function (val, content) {
                            var cbl = self._ListControlLabels.filter(function (x) { return x.Item == self.selectedItemCode && x.Value == val; });
                            if (cbl.length == 0) {
                                cbl = self._ListControlLabels.filter(function (x) { return x.Item == '*' && x.Value == val; });
                            }
                            cbl[0].Label = content;
                        };
                    }
                    controlWithLabel.Render(editMode, ratio);
                    control.HtmlElement.setAttribute("code", code);
                    if (self._ShowTooltip == true && self.Tooltips) {
                        var tooltips = self.Tooltips.filter(function (x) { return x.Key == code; });
                        if (tooltips.length > 0) {
                            var div = document.createElement("div");
                            div.innerHTML = tooltips[0].Value;
                            Framework.Popup.Create(label.HtmlElement, div, "left", "hover");
                        }
                    }
                    if (this_2._Orientation == "Horizontal") {
                        top += controlWithLabel._Height + self._LineSpacing;
                    }
                    if (this_2._Orientation == "Vertical") {
                        left += controlWithLabel._Height + self._LineSpacing;
                    }
                    controlWithLabel.HtmlElement.style.background = "transparent";
                    this_2.HtmlElement.appendChild(controlWithLabel.HtmlElement);
                    this_2.SetData(control, this_2.items[i].Code, i + 1);
                };
                var this_2 = this, control, label;
                for (var i = 0; i < this.items.length; i++) {
                    _loop_3();
                }
                if (editMode == false && (this._MustAnswerAllAttributes == true || this._MinNumberOfAnswers > 0 || this._MaxNumberOfAnswers > 0)) {
                    this.Validate();
                }
                this.Scrollable();
            };
            StackedControlWithLabel.OrientationEnum = ["Horizontal", "Vertical"];
            StackedControlWithLabel.DataTypeEnum = ["Hedonic", "DynamicLiking", "ProgressiveLiking", "Profile", "DynamicProfile", "ProgressiveProfile"];
            StackedControlWithLabel.LabelPositionEnum = ["NR", "Left", "Right", "TopCenter", "TopLeft", "TopRight", "BottomCenter", "BottomLeft", "BottomRight"];
            StackedControlWithLabel.TickMarksVisibilityEnum = ["NeverVisible", "AlwaysVisible", "VisibleOnFirstLineOnly", "VisibleOnLastLineOnly"];
            StackedControlWithLabel.TickPlacementsEnum = ["NR", "Left", "Right", "Top", "Bottom"];
            return StackedControlWithLabel;
        }(StackedControl));
        Controls.StackedControlWithLabel = StackedControlWithLabel;
        var DiscreteScalesControl = /** @class */ (function (_super) {
            __extends(DiscreteScalesControl, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function DiscreteScalesControl() {
                var _this = _super.call(this) || this;
                _this._CheckBoxWidth = 10; // Taille du côté de la case à cocher
                _this._CanUncheck = false; // Cases décochables ?
                //if (control != null) {
                //    let checkBoxLabels = this.getPropertyFromXaml<string>(control, "CheckBoxLabels", "");
                //    this._ListControlLabels = Framework.Serialization.JsonToInstance(this._ListControlLabels, checkBoxLabels);
                //    this.setPropertyFromXaml(control, "CheckBoxWidth", "_CheckBoxWidth");
                //    this.setPropertyFromXaml(control, "CanUncheck", "_CanUncheck");
                //}
                _this._Type = "DiscreteScalesControl";
                return _this;
            }
            DiscreteScalesControl.prototype.discreteScaleRenderer = function (editMode) {
                var self = this;
                var ds = new DiscreteScale();
                ds._Height = this._CheckBoxWidth;
                ds.CheckBoxSize = this._CheckBoxWidth;
                ds.CanUncheck = this._CanUncheck;
                if (editMode == false) {
                    ds.OnClick = function () {
                        self.clickOnDiscreteScale(this);
                    };
                }
                return ds;
            };
            DiscreteScalesControl.prototype.Render = function (editMode, ratio) {
                var _this = this;
                if (editMode === void 0) { editMode = false; }
                var self = this;
                _super.prototype.SetControlFactory.call(this, function () { return _this.discreteScaleRenderer(editMode); });
                _super.prototype.Render.call(this, editMode, ratio);
                this.listDiscreteScales = _super.prototype.GetListControls.call(this);
                // Reconnaissance vocale marche avec un seul controle
                if (editMode == false && this.listDiscreteScales.length == 1) {
                    this.OnSpeechRecognized = function (text) {
                        var n = Number(text);
                        if (n) {
                            self.listDiscreteScales[0].ClickOnCheckBox(n);
                        }
                    };
                }
            };
            DiscreteScalesControl.prototype.clickOnDiscreteScale = function (ds) {
                this.OnChange(ds);
            };
            DiscreteScalesControl.prototype.ClickOn = function (attribute, score) {
                var ds = this.listDiscreteScales.filter(function (x) { return x.AttachedData.AttributeCode == attribute; })[0];
                ds.AttachedData.Score = score;
                this.clickOnDiscreteScale(ds);
            };
            DiscreteScalesControl.prototype.Disable = function () {
                this.IsEnabled = false;
                this.listDiscreteScales.forEach(function (x) {
                    x.Disable();
                });
            };
            DiscreteScalesControl.prototype.Enable = function () {
                this.IsEnabled = true;
                this.listDiscreteScales.forEach(function (x) {
                    x.Enable();
                });
            };
            DiscreteScalesControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "creation" || mode == 'wizard') {
                    var validateFormSetTypeOfScale_1 = function () {
                        if (self.Scale == undefined || self.Scale == "" || self.Scale == "None") {
                            formSetTypeOfScale_1.ValidationResult = Framework.LocalizationManager.Get("SelectTypeOfScale");
                            self.Scale = "None";
                        }
                        formSetTypeOfScale_1.Check();
                    };
                    var formSetTypeOfScale_1 = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "TypeOfScale", self.Scale, DiscreteScalesControl.TypeOfScaleEnum, function (x) {
                        self.setListLabel(x);
                        self.Scale = x;
                        validateFormSetTypeOfScale_1();
                    });
                    properties.push(formSetTypeOfScale_1);
                    validateFormSetTypeOfScale_1();
                }
                if (mode == "edition" || mode == 'creation') {
                    var formSetCanUncheck = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "CanUncheck", self._CanUncheck, function (x) {
                        self.changeProperty("_CanUncheck", x);
                    });
                    properties.push(formSetCanUncheck);
                    var formSetCheckboxWidth = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "CheckBoxWidth", self._CheckBoxWidth, 10, 60, function (x) {
                        self.changeProperty("_CheckBoxWidth", x);
                        self.updateControl();
                    });
                    properties.push(formSetCheckboxWidth);
                }
                return properties;
            };
            DiscreteScalesControl.prototype.setListLabel = function (typeOfScale) {
                var self = this;
                var listLabels = [];
                if (typeOfScale == "DiscreteScale5Points" || typeOfScale == "DiscreteScale7Points" || typeOfScale == "DiscreteScale9Points") {
                    listLabels.push(new ScreenReader.Controls.ControlLabel(1, "1"));
                    listLabels.push(new ScreenReader.Controls.ControlLabel(2, ""));
                    listLabels.push(new ScreenReader.Controls.ControlLabel(3, ""));
                    listLabels.push(new ScreenReader.Controls.ControlLabel(4, ""));
                    if (typeOfScale == "DiscreteScale5Points") {
                        listLabels.push(new ScreenReader.Controls.ControlLabel(5, "5"));
                    }
                    else {
                        listLabels.push(new ScreenReader.Controls.ControlLabel(5, ""));
                    }
                }
                if (typeOfScale == "DiscreteScale7Points" || typeOfScale == "DiscreteScale9Points") {
                    listLabels.push(new ScreenReader.Controls.ControlLabel(6, ""));
                    if (typeOfScale == "DiscreteScale7Points") {
                        listLabels.push(new ScreenReader.Controls.ControlLabel(7, "7"));
                    }
                    else {
                        listLabels.push(new ScreenReader.Controls.ControlLabel(7, ""));
                    }
                }
                if (typeOfScale == "DiscreteScale9Points") {
                    listLabels.push(new ScreenReader.Controls.ControlLabel(8, ""));
                    listLabels.push(new ScreenReader.Controls.ControlLabel(9, "9"));
                }
                self.changeProperty("_ListControlLabels", listLabels);
            };
            DiscreteScalesControl.Create = function (dataType, experimentalDesignId, evaluationMode, typeOfScale) {
                if (dataType === void 0) { dataType = ""; }
                if (experimentalDesignId === void 0) { experimentalDesignId = 0; }
                if (evaluationMode === void 0) { evaluationMode = "Product"; }
                if (typeOfScale === void 0) { typeOfScale = "DiscreteScale9Points"; }
                var control = new DiscreteScalesControl();
                control._Height = 600;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                control._BorderThickness = 0;
                control._EvaluationMode = evaluationMode;
                control._ExperimentalDesignId = experimentalDesignId;
                control._DataType = dataType;
                control._MustAnswerAllAttributes = true;
                control._Orientation = "Horizontal";
                control._LastItemRank = 1000;
                control.setListLabel(typeOfScale);
                control.setControlStyle("BorderThickness", 1, true);
                control._CheckBoxWidth = 25;
                return control;
            };
            DiscreteScalesControl.TypeOfScaleEnum = ["DiscreteScale5Points", "DiscreteScale7Points", "DiscreteScale9Points"];
            return DiscreteScalesControl;
        }(StackedControlWithLabel));
        Controls.DiscreteScalesControl = DiscreteScalesControl;
        var SlidersControl = /** @class */ (function (_super) {
            __extends(SlidersControl, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function SlidersControl() {
                var _this = _super.call(this) || this;
                _this._SliderMargin = 0; // Marge entre le libellé et le slider
                _this._MarginBetweenSliders = 0; // Marge entre les sliders
                _this._Minimum = 0; // Borne gauche du slider
                _this._Maximum = 10; // Borne droite du slider
                _this._Precision = 0.01; // Précision du slider
                _this._SliderHeight = 40; // Hauteur du curseur
                _this._CursorWidth = 4; // Largeur du curseur
                _this._CursorColor = "blue"; // Couleur du curseur
                _this.listSliders = [];
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "MarginBetweenSliders", "_MarginBetweenSliders");
                //    this.setPropertyFromXaml(control, "Minimum", "_Minimum");
                //    this.setPropertyFromXaml(control, "Maximum", "_Maximum");
                //    this.setPropertyFromXaml(control, "Precision", "_Precision");
                //    this.setPropertyFromXaml(control, "SliderHeight", "_SliderHeight");
                //    this.setPropertyFromXaml(control, "CursorColor", "_CursorColor", 'color');
                //    this._LineSpacing = this._MarginBetweenSliders;
                //}
                _this._SliderBarHeight = _this._SliderHeight - 24;
                _this._Type = "SlidersControl";
                return _this;
            }
            SlidersControl.prototype.continuousScaleRenderer = function (editMode) {
                var self = this;
                var cs = new CustomSlider();
                cs.SliderBarHeight = this._SliderBarHeight;
                cs.CursorWidth = this._CursorWidth;
                cs.Maximum = this._Maximum;
                cs.Minimum = this._Minimum;
                cs.Precision = this._Precision;
                cs.CursorColor = this._CursorColor;
                cs._FontFamily = this._FontFamily;
                cs._Foreground = this._Foreground;
                cs._FontSize = this._FontSize;
                cs._FontWeight = this._FontWeight;
                cs._FontStyle = this._FontStyle;
                if (editMode == false) {
                    cs.OnClick = function () {
                        self.clickOnCustomSlider(this);
                    };
                }
                return cs;
            };
            SlidersControl.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                var self = this;
                _super.prototype.SetControlFactory.call(this, function () {
                    return self.continuousScaleRenderer(editMode);
                });
                _super.prototype.Render.call(this, editMode, ratio);
                this.listSliders = _super.prototype.GetListControls.call(this);
            };
            SlidersControl.prototype.Disable = function () {
                // Désactive le contrôle
                this.IsEnabled = false;
                this.listSliders.forEach(function (x) {
                    x.Disable();
                });
            };
            SlidersControl.prototype.Enable = function () {
                this.IsEnabled = true;
                // Désactive le contrôle
                this.listSliders.forEach(function (x) {
                    x.Enable();
                });
            };
            SlidersControl.prototype.clickOnCustomSlider = function (cs) {
                this.OnChange(cs);
            };
            SlidersControl.prototype.ClickOn = function (attribute, score) {
                var cs = this.listSliders.filter(function (x) { return x.AttachedData.AttributeCode == attribute; })[0];
                cs.AttachedData.RecordedDate = new Date(Date.now());
                cs.AttachedData.Score = score;
                this.clickOnCustomSlider(cs);
            };
            SlidersControl.prototype.GetListSliders = function () {
                return this.listSliders;
            };
            SlidersControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "creation" || mode == "wizard") {
                    var ScaleDataType_1 = function () {
                        if (self.Scale == undefined || self.Scale == "" || self.Scale == "None") {
                            formSetScale_1.ValidationResult = Framework.LocalizationManager.Get("SelectTypeOfScale");
                            self.Scale = "None";
                        }
                        formSetScale_1.Check();
                    };
                    var formSetScale_1 = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "TypeOfScale", self.Scale, SlidersControl.TypeOfScaleEnum, function (x) {
                        self.setListLabel(x);
                        self.Scale = x;
                        ScaleDataType_1();
                    });
                    properties.push(formSetScale_1);
                    ScaleDataType_1();
                    //TODO : min, max, precision à la place de type d'échelle ? ou ajouter d'autres types d'échelles
                }
                if (mode == "edition") {
                    var formSetPrecision = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "Precision", self._Precision, 0, 1, function (x) {
                        self.changeProperty("_Precision", x);
                    }, 0.01);
                    properties.push(formSetPrecision);
                    //TODO : vérifier min/max cohérent
                    var formSetMinimum = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "Minimum", self._Minimum, -100, 100, function (x) {
                        self.changeProperty("_Minimum", x);
                    });
                    properties.push(formSetMinimum);
                    var formSetMaximum = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "Maximum", self._Maximum, -100, 100, function (x) {
                        self.changeProperty("_Maximum", x);
                    });
                    properties.push(formSetMaximum);
                    var formSetSliderBarHeight = Framework.Form.PropertyEditorWithNumericUpDown.Render("ControlDesign", "SliderHeight", self._SliderBarHeight, 10, 100, function (x) {
                        self.changeProperty("_SliderBarHeight", x);
                        self.updateControl();
                    });
                    properties.push(formSetSliderBarHeight);
                    var formSetCursorWidth = Framework.Form.PropertyEditorWithNumericUpDown.Render("ControlDesign", "CursorWidth", self._CursorWidth, 1, 100, function (x) {
                        self.changeProperty("_CursorWidth", x);
                    });
                    properties.push(formSetCursorWidth);
                    var formSetCursorColor = Framework.Form.PropertyEditorWithColorPopup.Render("ControlDesign", "CursorColor", self._CursorColor, function (x) {
                        //TODO : par slider
                        self.changeProperty("_CursorColor", x);
                    });
                    properties.push(formSetCursorColor);
                }
                return properties;
            };
            SlidersControl.prototype.setListLabel = function (typeOfScale) {
                var self = this;
                var listLabels = [];
                if (typeOfScale == "LabeledContinuousScale0-10" || typeOfScale == "UnlabeledContinuousScale0-10") {
                    this._Minimum == 0;
                    this._Maximum == 10;
                }
                if (typeOfScale == "LabeledContinuousScale0-10") {
                    var markMin = new ScreenReader.Controls.ControlLabel(0, "0");
                    var markMax = new ScreenReader.Controls.ControlLabel(10, "10");
                    listLabels.push(markMin);
                    listLabels.push(markMax);
                }
                if (typeOfScale == "UnlabeledContinuousScale0-10") {
                    var markMin = new ScreenReader.Controls.ControlLabel(0, "");
                    var markMax = new ScreenReader.Controls.ControlLabel(10, "");
                    listLabels.push(markMin);
                    listLabels.push(markMax);
                }
                self.changeProperty("_ListControlLabels", listLabels);
            };
            SlidersControl.Create = function (dataType, experimentalDesignId, evaluationMode, typeOfScale, orientation) {
                if (dataType === void 0) { dataType = ""; }
                if (experimentalDesignId === void 0) { experimentalDesignId = 0; }
                if (evaluationMode === void 0) { evaluationMode = "Product"; }
                if (typeOfScale === void 0) { typeOfScale = "LabeledContinuousScale0-10"; }
                if (orientation === void 0) { orientation = "Horizontal"; }
                var control = new SlidersControl();
                control._Height = 600;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                control._BorderThickness = 0;
                control._EvaluationMode = evaluationMode;
                control._ExperimentalDesignId = experimentalDesignId;
                control._DataType = dataType;
                control._MustAnswerAllAttributes = true;
                control._Orientation = orientation;
                control._Minimum = 0;
                control._Maximum = 10;
                control._LastItemRank = 1000;
                control.setListLabel(typeOfScale);
                return control;
            };
            SlidersControl.TypeOfScaleEnum = ["LabeledContinuousScale0-10", "UnlabeledContinuousScale0-10"];
            return SlidersControl;
        }(StackedControlWithLabel));
        Controls.SlidersControl = SlidersControl;
        var ControlWithLabel = /** @class */ (function (_super) {
            __extends(ControlWithLabel, _super);
            //public OnLabelChanged: (htmlContent: string, sender: Label) => void;
            function ControlWithLabel(control, height, width, label, labelPosition, orientation, marginBetweenControlAndLabel) {
                if (labelPosition === void 0) { labelPosition = "None"; }
                if (orientation === void 0) { orientation = "Horizontal"; }
                if (marginBetweenControlAndLabel === void 0) { marginBetweenControlAndLabel = 0; }
                var _this = _super.call(this) || this;
                _this.labelPosition = "None";
                _this.orientation = "Horizontal";
                _this.marginBetweenControlAndLabel = 0;
                _this.parentHeight = 0;
                _this.parentWidth = 0;
                _this.control = control;
                _this.label = label;
                _this.labelPosition = labelPosition;
                _this.orientation = orientation;
                _this.marginBetweenControlAndLabel = marginBetweenControlAndLabel;
                _this.parentHeight = height;
                _this.parentWidth = width;
                return _this;
            }
            ControlWithLabel.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                var self = this;
                if (this.OnClick) {
                    this.HtmlElement.onclick = function () {
                        self.OnClick(self.control);
                    };
                }
                self.label._Background = "transparent";
                var setLabel = function (labelLeft, labelTop, labelHeight, labelWidth) {
                    self.label._Height = labelHeight;
                    self.label._Width = labelWidth;
                    self.label._Left = labelLeft;
                    self.label._Top = labelTop;
                };
                //self.label.OnChanged = function () {
                //    if (self.OnLabelChanged) {
                //        self.OnLabelChanged(self.label.GetText(), self.label);
                //    }
                //}
                var setControl = function (controlLeft, controlTop, controlHeight, controlWidth) {
                    //self.control._Height = controlHeight * ratio;
                    //self.control._Width = controlWidth * ratio;
                    //self.control._Left = controlLeft * ratio;
                    //self.control._Top = controlTop * ratio;
                    self.control._Height = controlHeight;
                    self.control._Width = controlWidth;
                    self.control._Left = controlLeft;
                    self.control._Top = controlTop;
                };
                // Calcul des tailles disponibles pour libellé et controle
                var controlHeight = this.control._Height + this.control._FontSize * 2;
                //let controlHeight: number = this.control._Height + this.control._FontSize ;
                var labelWidth = this.label._Width;
                if (this.orientation == "Horizontal") {
                    if (this.control instanceof CustomCheckBox) {
                        // Pas de calcul des tailles
                        if (this.labelPosition == "Left") {
                            setLabel(0, 0, this.control._Height, this.label._Width);
                            setControl(this.label._Width, 0, this.control._Height, this.control._Width);
                            this._Height = this.control._Height /*+ this.marginBetweenControlAndLabel*/;
                        }
                        if (this.labelPosition == "Right") {
                            setLabel(this.control._Width + this.marginBetweenControlAndLabel, 0, this.control._Height, this.label._Width);
                            setControl(0, 0, this.control._Height, this.control._Width);
                            this._Height = this.control._Height /*+ this.marginBetweenControlAndLabel*/;
                        }
                        if (this.labelPosition == "TopCenter") {
                            setLabel(0, 0, this.control._Height, this.label._Width);
                            setControl((this.label._Width - this.control._Width) / 2, this.control._Height + this.marginBetweenControlAndLabel, this.control._Height, this.control._Width);
                            this._Height = this.control._Height * 2 + this.marginBetweenControlAndLabel;
                        }
                        if (this.labelPosition == "BottomCenter") {
                            setLabel(0, this.control._Height + this.marginBetweenControlAndLabel, this.control._Height, this.label._Width);
                            setControl((this.label._Width - this.control._Width) / 2, 0, this.control._Height, this.control._Width);
                            this._Height = this.control._Height * 2 + this.marginBetweenControlAndLabel;
                        }
                    }
                    else {
                        var widthWithLabel = this.parentWidth - this.label._Width - this.marginBetweenControlAndLabel;
                        if (this.labelPosition == "None" || this.labelPosition == "NR") {
                            setControl(0, 0, controlHeight, this.parentWidth);
                        }
                        if (this.labelPosition == "Left") {
                            setLabel(0, 0, controlHeight, this.label._Width);
                            setControl(this.label._Width + this.marginBetweenControlAndLabel, 0, controlHeight, widthWithLabel);
                        }
                        if (this.labelPosition == "Right") {
                            setLabel(widthWithLabel, 0, controlHeight, this.label._Width);
                            setControl(0, 0, controlHeight, widthWithLabel);
                        }
                        if (this.labelPosition == "TopCenter" || this.labelPosition == "TopLeft" || this.labelPosition == "TopRight") {
                            setLabel(0, 0, this.control._FontSize, this.parentWidth);
                            //setControl(0, this.control._FontSize + 2 , controlHeight, this.parentWidth);
                            setControl(0, this.control._FontSize + 2 + this.marginBetweenControlAndLabel, controlHeight, this.parentWidth);
                        }
                        if (this.labelPosition == "BottomCenter" || this.labelPosition == "BottomLeft" || this.labelPosition == "BottomRight") {
                            setLabel(0, controlHeight, this.control._FontSize, this.parentWidth);
                            setControl(0, 0, controlHeight, this.parentWidth);
                        }
                        this._Height = controlHeight;
                    }
                    if (this.labelPosition == "TopCenter" || this.labelPosition == "BottomCenter") {
                        this.label.HorizontalAlignment = "center";
                    }
                    if (this.labelPosition == "TopLeft" || this.labelPosition == "BottomLeft") {
                        this.label.HorizontalAlignment = "left";
                    }
                    if (this.labelPosition == "TopRight" || this.labelPosition == "BottomRight") {
                        this.label.HorizontalAlignment = "right";
                    }
                }
                if (this.orientation == "Vertical") {
                    var heightWithLabel = this.parentHeight - this.label._Width - this.marginBetweenControlAndLabel;
                    if (this.labelPosition == "Left" || this.labelPosition == "TopLeft" || this.labelPosition == "BottomLeft") {
                        setLabel(0, 0, this.parentHeight, this._FontSize);
                        setControl(this.label._Width + this.marginBetweenControlAndLabel, 0, this.parentHeight - 2 * this._FontSize, controlHeight);
                        if (this.labelPosition == "TopLeft") {
                            this.label.HorizontalAlignment = "left";
                        }
                        if (this.labelPosition == "BottomLeft") {
                            this.label.HorizontalAlignment = "right";
                        }
                        if (this.labelPosition == "Left") {
                            this.label.HorizontalAlignment = "center";
                        }
                    }
                    if (this.labelPosition == "Right" || this.labelPosition == "TopRight" || this.labelPosition == "BottomRight") {
                        setLabel(controlHeight, 0, this.parentHeight, this._FontSize);
                        setControl(0, 0, this.parentHeight - 2 * this._FontSize, controlHeight);
                        if (this.labelPosition == "TopRight") {
                            this.label.HorizontalAlignment = "left";
                        }
                        if (this.labelPosition == "BottomRight") {
                            this.label.HorizontalAlignment = "right";
                        }
                        if (this.labelPosition == "Right") {
                            this.label.HorizontalAlignment = "center";
                        }
                    }
                    if (this.labelPosition == "TopCenter") {
                        setLabel(0, 0, labelWidth, controlHeight);
                        setControl(0, labelWidth + this.marginBetweenControlAndLabel, heightWithLabel, controlHeight);
                        this.label.HorizontalAlignment = "left";
                    }
                    if (this.labelPosition == "BottomCenter") {
                        setLabel(0, heightWithLabel + this.marginBetweenControlAndLabel + 2 * this._FontSize, labelWidth, controlHeight);
                        setControl(0, 0, heightWithLabel, controlHeight);
                        this.label.HorizontalAlignment = "left";
                    }
                    this._Height = controlHeight;
                }
                this.control.Render(editMode, ratio);
                this.HtmlElement.appendChild(this.control.HtmlElement);
                if (this.labelPosition != "None") {
                    this.label._Background = "transparent";
                    this.label.Render(editMode, ratio);
                    var lineHeight = null;
                    if (this.control instanceof CustomCheckBox) {
                        lineHeight = self.control._Height * self.Ratio + "px";
                    }
                    if (this.orientation == "Vertical") {
                        this.label.HtmlElement.classList.add("verticalWriting");
                        if (this.labelPosition == "TopCenter" || this.labelPosition == "BottomCenter") {
                            lineHeight = this._Height * self.Ratio + "px";
                        }
                    }
                    if (lineHeight != null) {
                        this.label.HtmlElement.style.lineHeight = lineHeight;
                        if (this.label.HtmlElement.hasChildNodes) {
                            this.label.HtmlElement.children[0].style.lineHeight = lineHeight;
                        }
                    }
                    this.HtmlElement.appendChild(this.label.HtmlElement);
                }
            };
            return ControlWithLabel;
        }(BaseControl));
        var CustomSlider = /** @class */ (function (_super) {
            __extends(CustomSlider, _super);
            function CustomSlider() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.CursorColor = "blue";
                _this.cursorOpacity = 0;
                _this.CursorWidth = 4;
                return _this;
            }
            CustomSlider.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                this.HtmlElement.style.background = "transparent";
                this.HtmlElement.style.borderWidth = "0";
                var self = this;
                var timeOut;
                var slider = document.createElement("div");
                if (this.Orientation == "Horizontal") {
                    slider.style.top = ((this._Height - this.SliderBarHeight) / 2) * self.Ratio + "px";
                }
                var direction = 'ltr';
                if (this.Orientation == "Vertical") {
                    direction = 'rtl';
                    slider.style.left = (this._FontSize) * self.Ratio + "px";
                    slider.style.top = (this._FontSize) * self.Ratio + "px";
                }
                noUiSlider.create(slider, {
                    start: 0,
                    range: {
                        'min': this.Minimum,
                        'max': this.Maximum
                    },
                    step: this.Precision,
                    animate: true,
                    orientation: this.Orientation.toLowerCase(),
                    direction: direction
                });
                this.slider = slider;
                this.HtmlElement.appendChild(slider);
                var sl = slider;
                if (editMode == false) {
                    sl.noUiSlider.on('set', function () {
                        f();
                    });
                    sl.noUiSlider.on('change', function () {
                        f();
                    });
                    sl.noUiSlider.on('slide', function () {
                        // Slide : on force à avoir une différence minimale de 1/100 du range de l'échelle pour enregistrer les données
                        var oldscore = undefined;
                        if (_customSlider.AttachedData) {
                            oldscore = _customSlider.AttachedData.Score;
                        }
                        if (oldscore == undefined) {
                            oldscore = 0;
                        }
                        var newscore = sl.noUiSlider.get();
                        var diff = (_customSlider.Maximum - _customSlider.Minimum) / 100;
                        if (Math.abs(newscore - oldscore) >= diff) {
                            f();
                        }
                    });
                }
                else {
                    //TODO
                    //if (this.OnTickLabelChanged) {
                    //    this.OnTickLabelChanged(sl, htmlContent);
                    //}
                }
                $(slider).addClass('noUi-target-' + this._FriendlyName);
                var f = function () {
                    clearTimeout(timeOut);
                    _customSlider.cursorOpacity = 1;
                    $(slider).find(".noUi-handle").show();
                    // Masquer le curseur
                    if (_customSlider.DelayThumbVisibility > 0) {
                        timeOut = setTimeout(function () {
                            _customSlider.cursorOpacity = 0;
                            $(slider).find(".noUi-handle").hide();
                        }, _customSlider.DelayThumbVisibility);
                    }
                    $(slider).find(".noUi-handle").show();
                    if (_customSlider.AttachedData) {
                        _customSlider.AttachedData.Score = Number(sl.noUiSlider.get());
                        _customSlider.AttachedData.RecordedDate = new Date(Date.now());
                    }
                    _customSlider.OnClick();
                };
                var _customSlider = this;
                setTimeout(function () {
                    if (_customSlider.AttachedData && _customSlider.AttachedData.Score == null) {
                        $(slider).find(".noUi-handle").hide();
                    }
                    $(slider).find(".noUi-handle").addClass('noUi-handle-' + _customSlider._FriendlyName);
                    var width = (_customSlider._Width - _customSlider._FontSize * 2) * self.Ratio;
                    if (_customSlider.Orientation == "Horizontal") {
                        $(_customSlider.HtmlElement).find(".noUi-target").css('width', width + "px");
                        $(_customSlider.HtmlElement).find(".noUi-target").css('height', _customSlider.SliderBarHeight * self.Ratio + "px");
                        $(_customSlider.HtmlElement).find(".noUi-target").css('left', _customSlider._FontSize * self.Ratio + "px");
                        $(_customSlider.HtmlElement).find(".noUi-handle").css('height', (_customSlider.SliderBarHeight * self.Ratio + 10) + "px");
                        $(_customSlider.HtmlElement).find(".noUi-handle").css('width', _customSlider.CursorWidth + 'px');
                        $(_customSlider.HtmlElement).find(".noUi-handle").css('left', "-2px");
                    }
                    else {
                        $(_customSlider.HtmlElement).find(".noUi-target").css('width', (_customSlider.SliderBarHeight + 10) * self.Ratio + "px");
                        $(_customSlider.HtmlElement).find(".noUi-target").css('height', _customSlider._Height * self.Ratio + "px");
                        $(_customSlider.HtmlElement).find(".noUi-handle").css('height', '10px');
                        $(_customSlider.HtmlElement).find(".noUi-handle").css('width', (_customSlider.SliderBarHeight + 10) * self.Ratio + "px");
                        $(_customSlider.HtmlElement).find(".noUi-handle").css('top', "-5px");
                    }
                    $(_customSlider.HtmlElement).find(".noUi-target").css('background', _customSlider._Background);
                    $(_customSlider.HtmlElement).find(".noUi-target").css('border', _customSlider._BorderThickness + "px solid " + _customSlider._BorderBrush);
                    $(_customSlider.HtmlElement).find(".noUi-target").css('color', "transparent");
                    $(_customSlider.HtmlElement).find(".noUi-target").css('border-radius', "0");
                    $(_customSlider.HtmlElement).find(".noUi-target").css('box-shadow', "none");
                    $(_customSlider.HtmlElement).find(".noUi-handle").css('background', _customSlider.CursorColor);
                    $(_customSlider.HtmlElement).find(".noUi-handle").css('border-radius', "0");
                    $(_customSlider.HtmlElement).find(".noUi-handle").css('box-shadow', "none");
                    $(_customSlider.HtmlElement).find(".noUi-handle").css('border', '0');
                }, 10);
                this.SetTicks(editMode, this.ListControlLabels);
            };
            CustomSlider.prototype.SetSelectedValue = function (score) {
                var sl = this.slider;
                sl.noUiSlider.set(score);
            };
            CustomSlider.prototype.GetSelectedValue = function () {
                var sl = this.slider;
                return sl.noUiSlider.get();
            };
            CustomSlider.prototype.SetTicks = function (editMode, listSliderLabels) {
                var _this = this;
                var self = this;
                var labels = listSliderLabels.filter(function (x) { return x.Item != "*"; });
                if (labels.length == 0) {
                    labels = listSliderLabels.filter(function (x) { return x.Item == "*"; });
                }
                // Ticks
                for (var j = 0; j < labels.length; j++) {
                    var sliderLabel = labels[j];
                    // Texte
                    var txt = "";
                    if (sliderLabel.Label != undefined && sliderLabel.Visibility == true) {
                        txt = sliderLabel.Label;
                    }
                    //if (sliderLabel.FontSize == undefined) {
                    //    sliderLabel.FontSize = 20;
                    //}
                    //if (sliderLabel.Margin == undefined) {
                    //    sliderLabel.Margin = 10;
                    //}
                    var tick = new Label(txt);
                    var measure = Framework.Scale.MeasureText(txt, sliderLabel.FontSize, this._FontFamily, this._FontStyle, this._FontWeight);
                    var tickWidth = measure.width;
                    sliderLabel.Margin = Number(sliderLabel.Margin);
                    if (this.Orientation == "Horizontal") {
                        //tick._Left = this._Width * ((sliderLabel.Position - this.Minimum) / (this.Maximum - this.Minimum)) - tickWidth / 2; // -tickWidth /2 pour centrage
                        tick._Left = Math.max(0, (this._Width - this._FontSize * 2) * ((sliderLabel.Value - this.Minimum) / (this.Maximum - this.Minimum)) - 2) + this._FontSize - tickWidth / 2;
                        if (sliderLabel.Placement == "Top") {
                            tick._Top = -sliderLabel.FontSize - sliderLabel.Margin;
                        }
                        if (sliderLabel.Placement == "Bottom") {
                            tick._Top = sliderLabel.FontSize + sliderLabel.Margin;
                        }
                        if (sliderLabel.Placement == "Left") {
                            tick._Top = 0;
                            tick._Left = sliderLabel.FontSize - tickWidth - sliderLabel.Margin;
                        }
                        if (sliderLabel.Placement == "Right") {
                            tick._Top = 0;
                            tick._Left = this._Width - sliderLabel.FontSize + sliderLabel.Margin;
                        }
                        tick._Width = tickWidth;
                        tick._Height = this._Height;
                        tick.HorizontalAlignment = "center";
                    }
                    if (this.Orientation == "Vertical") {
                        tick._Left = 0;
                        tick.HorizontalAlignment = "center";
                        if (sliderLabel.Placement == "Top") {
                            tick._Top = 0;
                        }
                        if (sliderLabel.Placement == "Bottom") {
                            tick._Top = this._Height + this._FontSize;
                        }
                        if (sliderLabel.Placement == "Left") {
                            tick._Top = this._Height * ((sliderLabel.Value - this.Minimum) / (this.Maximum - this.Minimum)) + this._FontSize / 2;
                            tick._Left = -tickWidth;
                        }
                        if (sliderLabel.Placement == "Right") {
                            tick._Top = this._Height * ((sliderLabel.Value - this.Minimum) / (this.Maximum - this.Minimum)) + this._FontSize / 2;
                            tick._Left = this.SliderBarHeight + 10;
                        }
                        tick._Width = this._Width;
                        tick._Height = this._FontSize;
                    }
                    //tick._Top /= this.Ratio;
                    //tick._Left /= this.Ratio;
                    tick._FontFamily = this._FontFamily;
                    tick._Foreground = this._Foreground;
                    tick._FontSize = Number(sliderLabel.FontSize);
                    tick._Foreground = sliderLabel.Color;
                    tick._FontWeight = this._FontWeight;
                    tick._FontStyle = this._FontStyle;
                    tick._ZIndex = -100;
                    tick.WhiteSpace = "nowrap";
                    //tick.IsEditable = editMode;
                    tick.IsEditable = false;
                    tick.Render(editMode, self.Ratio);
                    tick.HtmlElement.style.overflow = "auto";
                    tick.HtmlElement.setAttribute("Value", sliderLabel.Value.toString());
                    this.HtmlElement.appendChild(tick.HtmlElement);
                    //tick.HtmlElement.style.background = "yellow";
                    // Marque
                    var tickMark = new Rectangle();
                    var offsetTop = (this._Height - this.SliderBarHeight) / 2;
                    var offsetLeft = (this._Width - this.SliderBarHeight) / 2;
                    if (this.Orientation == "Horizontal") {
                        tickMark._Height = this.SliderBarHeight + 6;
                        tickMark._Width = 2;
                        tickMark._Left = (Math.max(0, (this._Width - this._FontSize * 2) * ((sliderLabel.Value - this.Minimum) / (this.Maximum - this.Minimum)) - 2) + this._FontSize);
                        tickMark._Top = (-3 + offsetTop);
                    }
                    if (this.Orientation == "Vertical") {
                        tickMark._Height = 2;
                        tickMark._Width = this.SliderBarHeight + 6;
                        tickMark._Top = (Math.max(0, this._Height * ((sliderLabel.Value - this.Minimum) / (this.Maximum - this.Minimum)) - 2) + this._FontSize);
                        tickMark._Left = (-5 + offsetLeft);
                    }
                    //tickMark._Top /= this.Ratio;
                    //tickMark._Left /= this.Ratio;
                    tickMark._ZIndex = -1;
                    tickMark._Background = this._BorderBrush;
                    if (sliderLabel.TooltipImage && sliderLabel.TooltipImage.length > 0) {
                        var img = document.createElement("img");
                        img.src = sliderLabel.TooltipImage;
                        img.height = 100;
                        Framework.Popup.Create(tickMark.HtmlElement, img, "top", "hover");
                    }
                    if (editMode == true) {
                        //TOFIX
                        tick.OnChanged = function (text) {
                            if (self.OnTickLabelChanged) {
                                var val = Number(_this.HtmlElement.getAttribute("Value"));
                                self.OnTickLabelChanged(val, text);
                            }
                        };
                    }
                    tickMark.Render(editMode, self.Ratio);
                    this.HtmlElement.appendChild(tickMark.HtmlElement);
                }
            };
            CustomSlider.prototype.Enable = function () {
                this.slider.removeAttribute('disabled');
                this.slider.style.cursor = "pointer";
            };
            CustomSlider.prototype.Disable = function () {
                this.slider.setAttribute('disabled', 'true');
                this.slider.style.cursor = "not-allowed";
            };
            return CustomSlider;
        }(DataControl));
        Controls.CustomSlider = CustomSlider;
        var GroupedControl = /** @class */ (function (_super) {
            __extends(GroupedControl, _super);
            //protected showAttributeExperimentalDesignProperty:boolean = false;
            //constructor(control: Element = null) {
            //    super(control);
            function GroupedControl() {
                var _this = _super.call(this) || this;
                //public _GroupDescription: string = "";
                //public _AttributeExperimentalDesignId: number;
                _this.Attributes = [];
                return _this;
                //if (control != null) {
                //    //this.setPropertyFromXaml(control, "GroupDescription", "_GroupDescription");
                //    //this.setPropertyFromXaml(control, "AttributeExperimentalDesignId", "_AttributeExperimentalDesignId");
                //    this.setPropertyFromXaml(control, "AttributeExperimentalDesignId", "_ExperimentalDesignId");
                //}
            }
            GroupedControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition") {
                    var formSetTextDecoration = Framework.Form.PropertyEditorWithPopup.Render("ControlDesign", "TextStyle", Framework.LocalizationManager.Get("ClickToEdit"), ["Bold", "Italic"], function (x) {
                        if (x == "Bold") {
                            self._FontWeight = "bold";
                        }
                        else {
                            self._FontWeight = "";
                        }
                        if (x == "Italic") {
                            self._FontStyle = "italic";
                        }
                        else {
                            self._FontStyle = "";
                        }
                        self.updateControl();
                    });
                    properties.push(formSetTextDecoration);
                    var formSetTextSize = Framework.Form.PropertyEditorWithPopup.Render("ControlDesign", "FontSize", self._FontSize.toString(), Framework.InlineHTMLEditor.FontSizeEnum, function (x) {
                        self.changeProperty("_FontSize", Number(x));
                        self.updateControl();
                    });
                    properties.push(formSetTextSize);
                    var formSetTextForeground = Framework.Form.PropertyEditorWithColorPopup.Render("ControlDesign", "TextColor", self._Foreground, function (x) {
                        self.changeProperty("_Foreground", x);
                        self.updateControl();
                    });
                    properties.push(formSetTextForeground);
                    var formSetTextFontFamily = Framework.Form.PropertyEditorWithPopup.Render("ControlDesign", "TextFont", self._FontFamily, Framework.InlineHTMLEditor.FontNameEnum, function (x) {
                        self.changeProperty("_FontFamily", x);
                        self.updateControl();
                    });
                    properties.push(formSetTextFontFamily);
                }
                //if (this.showAttributeExperimentalDesignProperty == true && (mode == "edition" || mode == "creation")) {
                //    let validateFormSetExperimentalDesignFormProperty = () => {
                //        let text = Framework.LocalizationManager.Get("None");
                //        let designs = self.ListExperimentalDesigns.filter((x) => { return x.Id == self._AttributeExperimentalDesignId });
                //        if (designs.length > 0) {
                //            text = designs[0].Name;
                //        }
                //        formSetExperimentalDesignFormProperty.SetLabelForPropertyValue(text);
                //        if (self._AttributeExperimentalDesignId <= 0) {
                //            formSetExperimentalDesignFormProperty.ValidationResult = Framework.LocalizationManager.Get("SelectExperimentalDesign");
                //        }
                //        formSetExperimentalDesignFormProperty.Check();
                //    }
                //    let formSetExperimentalDesignFormProperty = Framework.Form.PropertyEditor.RenderWithPopup("Parameters", "AttributeExperimentalDesign", "", this.ListExperimentalDesigns.map((x) => { return x.Name }), (x, btn) => {
                //        let design = self.ListExperimentalDesigns.filter((y) => { return y.Name == x })[0];
                //        self._AttributeExperimentalDesignId = design.Id;
                //        validateFormSetExperimentalDesignFormProperty();
                //    });
                //    validateFormSetExperimentalDesignFormProperty();
                //    properties.push(formSetExperimentalDesignFormProperty);
                //}
                return properties;
            };
            GroupedControl.prototype.SetAttributeExperimentalDesign = function (design) {
                var _this = this;
                if (design == undefined) {
                    return;
                }
                this.ExperimentalDesign = design;
                this.Attributes = [];
                if (this.ExperimentalDesign.ListExperimentalDesignRows.length > 0) {
                    // Vérification : rép existe ?
                    var subjectCode_2 = this.SubjectCode;
                    if (subjectCode_2 == undefined) {
                        subjectCode_2 = this.ExperimentalDesign.ListExperimentalDesignRows[0].SubjectCode;
                    }
                    var replicate_2 = this.Replicate;
                    var repExists = this.ExperimentalDesign.ListExperimentalDesignRows.filter(function (x) { return (x.SubjectCode == subjectCode_2 && x.Replicate == _this.Replicate); }).length > 0;
                    if (!repExists) {
                        replicate_2 = 1;
                    }
                    // Lignes de plan de présentation du sujet pour la rép
                    var rows = this.ExperimentalDesign.ListExperimentalDesignRows.filter(function (x) { return (x.SubjectCode == subjectCode_2 && x.Replicate == replicate_2); });
                    rows = rows.sort(function (row1, row2) {
                        return row1.Rank - row2.Rank;
                    });
                    rows.forEach((function (x) { _this.Attributes.push(new Models.CodeLabel(x.Code, x.Label)); }));
                }
            };
            return GroupedControl;
        }(DataControl));
        Controls.GroupedControl = GroupedControl;
        var StackedControlStyle = /** @class */ (function () {
            function StackedControlStyle() {
                this.BorderThickness = 0;
                this.FontWeight = false;
                this.FontStyle = false;
                this.FontUnderline = false;
                this.FontSize = 32;
            }
            return StackedControlStyle;
        }());
        var DTSButtonsControl = /** @class */ (function (_super) {
            __extends(DTSButtonsControl, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function DTSButtonsControl() {
                var _this = _super.call(this) || this;
                //TODO : 0 ou nodominance attribut ?
                _this._MarginBetweenButtons = 0; // Marge entre les boutons (pixels)
                _this._NbColumns = 2; // Nombre de colonnes
                _this._HorizontalContentAlignment = "Center"; // Alignement horizontal des textes
                _this._VerticalContentAlignment = "Middle"; // Alignement vertical des textes
                _this._DominanceMode = "DominantUntilNextClick"; // Mode de dominance : "DominantUntilNextClick", "DominantWhileHeldDown", "DominantUntilNextClickOrUnclick", "DominantForALimitedDuration" TODO : rajouter DominantUntilUnclick (TCATA)            
                _this._SelectedButtonBackground = "orange"; // Couleur d'arrière plan du bouton sélectionné            
                _this._SelectedButtonBorder = "yellow"; // Couleur d'arrière plan du bouton sélectionné
                _this.listButtons = [];
                _this._ActionWhenSelectedButtonChanged = "ChangeBackgroundAndBorder";
                _this._ChangeHoverBackground = true;
                _this._LimitedDuration = 5;
                _this.selectedButton = undefined;
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "MarginButton", "_MarginBetweenButtons");
                //    this.setPropertyFromXaml(control, "Column", "_NbColumns");
                //    this.setPropertyFromXaml(control, "HorizontalContentAlignment", "_HorizontalContentAlignment"); //TODO dans properties
                //    this.setPropertyFromXaml(control, "VerticalContentAlignment", "_VerticalContentAlignment"); //TODO dans properties
                //    this.setPropertyFromXaml(control, "DominanceMode", "_DominanceMode");
                //    this.setPropertyFromXaml(control, "SelectedButtonBackground", "_SelectedButtonBackground", 'color');
                //    this.setPropertyFromXaml(control, "LimitedDuration", "_LimitedDuration");
                //    this.setPropertyFromXaml(control, "_ChangeHoverBackground", "_ChangeHoverBackground");
                //    this.setPropertyFromXaml(control, "_ActionWhenSelectedButtonChanged", "_ActionWhenSelectedButtonChanged");
                //}
                _this._Type = "DTSButtonsControl";
                _this.ValidationMessage = "";
                _this._EvaluationMode = "Product";
                return _this;
            }
            DTSButtonsControl.prototype.GetDominanceModeEnum = function () {
                if (this._DataType == "TDS") {
                    return [
                        "DominantUntilNextClick", //DTS classique
                        "DominantUntilNextClickOrUnclick", // DTS déclicable
                        "DominantWhileHeldDown", // DTS hold down
                        "DominantForALimitedDuration" // Fading DTS/TCATA
                    ];
                }
                if (this._DataType == "TCATA") {
                    return [
                        "DominantUntilUnclick", // CATA/TCATA                        
                        "DominantForALimitedDuration" // Fading DTS/TCATA
                    ];
                }
            };
            ;
            DTSButtonsControl.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                var self = this;
                // Création du contenu
                var nbRows = Math.ceil(this.items.length / this._NbColumns);
                var buttonWidth = Math.floor((this._Width - (this._MarginBetweenButtons * (this._NbColumns - 1))) / this._NbColumns);
                var buttonHeight = Math.floor((this._Height - (this._MarginBetweenButtons * (nbRows - 1))) / nbRows);
                var currentRow = 0;
                var currentCol = 0;
                var _dtsButtonsControl = this;
                if (this._MustAnswerAllAttributes == true) {
                    this.validate();
                }
                for (var i = 0; i < this.items.length; i++) {
                    var cb = new CustomButton();
                    cb._Left = currentCol * buttonWidth + currentCol * this._MarginBetweenButtons;
                    cb._Top = currentRow * buttonHeight + currentRow * this._MarginBetweenButtons;
                    ;
                    cb._ZIndex = this._ZIndex;
                    cb._Width = buttonWidth;
                    cb._Height = buttonHeight;
                    cb._ChangeHoverBackground = this._ChangeHoverBackground;
                    //cb._Id = this._Id;
                    cb._FriendlyName = this._FriendlyName;
                    cb._Opacity = this._Opacity;
                    cb._Tag = this._Tag;
                    cb._Action = "TDS";
                    cb._HorizontalContentAlignment = this._HorizontalContentAlignment;
                    cb._VerticalContentAlignment = this._VerticalContentAlignment;
                    cb._SelectedBackground = this._SelectedButtonBackground;
                    cb._SelectedBorderBrush = this._SelectedButtonBorder;
                    cb._BackgroundMode = "Opaque";
                    cb.IsEditable = false;
                    var code = this.items[i].Code;
                    var style = this.getControlStyle(code);
                    //cb._Content = style.HtmlContent;
                    cb._Content = this.items[i].Label;
                    cb._BorderThickness = style.BorderThickness;
                    cb._BorderBrush = style.BorderBrush;
                    cb._Background = style.Background;
                    cb._Foreground = style.Foreground;
                    var align = "center";
                    if (style.HorizontalContentAlignment) {
                        align = style.HorizontalContentAlignment;
                    }
                    cb._HorizontalContentAlignment = align;
                    if (style.FontWeight == true) {
                        cb._FontWeight = "Bold";
                    }
                    if (style.FontStyle == true) {
                        cb._FontStyle = "Italic";
                    }
                    cb._FontSize = style.FontSize;
                    cb._FontFamily = style.FontFamily;
                    //if (editMode == true) {
                    //    cb.OnLabelChanged = (x) => {
                    //        let ref = _dtsButtonsControl.getControlStyle(code);
                    //        ref.HtmlContent = x;
                    //    }
                    //}
                    // Données à enregistrer
                    var d = new Models.Data();
                    d.AttributeCode = code;
                    d.AttributeRank = i + 1;
                    d.DataControlId = this._Id;
                    d.ControlName = this._FriendlyName;
                    d.ProductCode = this.ProductCode;
                    d.ProductRank = this.ProductRank;
                    d.Replicate = this.Replicate;
                    d.Intake = this.Intake;
                    d.Score = undefined;
                    if (self._DataType == "TCATA") {
                        d.Score = 0;
                    }
                    d.Session = this.UploadId;
                    d.SubjectCode = this.SubjectCode;
                    d.Type = self._DataType;
                    cb.AttachedData = d;
                    if (editMode == false) {
                        if (this._DominanceMode == "DominantUntilNextClick") {
                            cb.OnClick = function () {
                                _dtsButtonsControl.clickOnCustomButton(this, 1);
                            };
                        }
                        if (this._DominanceMode == "DominantUntilUnclick") {
                            cb.OnClick = function () {
                                _dtsButtonsControl.toggleCustomButton(this);
                            };
                        }
                        if (this._DominanceMode == "DominantWhileHeldDown") {
                            cb.OnClick = function () {
                                _dtsButtonsControl.clickOnCustomButton(this, 1);
                            };
                            cb.OnRelease = function () {
                                _dtsButtonsControl.clickOnCustomButton(this, 0);
                            };
                        }
                        if (this._DominanceMode == "DominantUntilNextClickOrUnclick") {
                            cb.OnClick = function () {
                                if (this.AttachedData.Score == undefined || this.AttachedData.Score == 0) {
                                    _dtsButtonsControl.clickOnCustomButton(this, 1);
                                }
                                else {
                                    _dtsButtonsControl.clickOnCustomButton(this, 0);
                                }
                            };
                        }
                        if (this._DominanceMode == "DominantForALimitedDuration") {
                            cb.OnClick = function () {
                                _dtsButtonsControl.clickOnCustomButton(this, 1);
                                var _cb = this;
                                setTimeout(function () {
                                    if (_cb.IsEnabled == true && _cb._Background != _dtsButtonsControl._Background) {
                                        _dtsButtonsControl.clickOnCustomButton(_cb, 0);
                                    }
                                }, _dtsButtonsControl._LimitedDuration * 1000);
                            };
                        }
                    }
                    //cb.Render(editMode, ratio);
                    cb.Render(false, ratio);
                    cb.HtmlElement.setAttribute("code", code);
                    //if (editMode == true) {
                    //    //TODO : rendre plus visible
                    //    cb.HtmlElement.onclick = (x) => {
                    //        let div = $(x.target).closest('.customButton')[0];
                    //        _dtsButtonsControl.selectedItemCode = (<HTMLDivElement>div).getAttribute("code");
                    //        _dtsButtonsControl.selectedButton = _dtsButtonsControl.listButtons.filter((b) => { return b.AttachedData.AttributeCode == _dtsButtonsControl.selectedItemCode })[0];
                    //        div.classList.add("selectedControlInsideAdorner");
                    //    }
                    //}
                    this.listButtons.push(cb);
                    currentCol++;
                    if (currentCol >= this._NbColumns) {
                        currentCol = 0;
                        currentRow++;
                    }
                    this.HtmlElement.appendChild(cb.HtmlElement);
                }
                if (editMode == false) {
                    self.OnSpeechRecognized = function (text) {
                        self.listButtons.forEach(function (b) {
                            if (b.Text.length > 0 && Framework.WordComparer.ContainsWithSoundex(b.Text, text, Framework.LocalizationManager.GetDisplayLanguage())) {
                                self.clickOnCustomButton(b, 1);
                            }
                        });
                    };
                }
            };
            DTSButtonsControl.prototype.validate = function () {
                this.ValidationMessage = "";
                if (this._MustAnswerAllAttributes == true) {
                    // Au moins un score                
                    this.IsValid = this.ListData.length > 0;
                    // Message d'erreur
                    if (this.IsValid == false) {
                        this.ValidationMessage = this._FriendlyName + " : " + Framework.LocalizationManager.Get("AtLeastOneAttributeHaveToBeSelected") + "\n";
                    }
                }
            };
            DTSButtonsControl.prototype.clickOnCustomButton = function (cb, score) {
                if (score === void 0) { score = 1; }
                var self = this;
                if (this.IsEnabled == false) {
                    return;
                }
                cb.AttachedData.RecordedDate = new Date(Date.now());
                cb.AttachedData.Score = score;
                if (this.StartDate != undefined) {
                    // Enregistrement du temps                        
                    cb.AttachedData.Time = (cb.AttachedData.RecordedDate.getTime() - this.StartDate.getTime()) / 1000;
                }
                this.onDataChanged(cb.AttachedData);
                // Copie de l'objet
                //TODO : tester let d: Models.Data = Helpers.SerializationHelper.CloneObject<Models.Data>(cb.AttachedData); ou createfrom
                var j = JSON.stringify(cb.AttachedData);
                var d = JSON.parse(j);
                this.ListData.push(d);
                this.validate();
                // Suppression de la surbrillance de tous les boutons et mise à 0 des scores
                for (var i = 0; i < this.listButtons.length; i++) {
                    var b = this.listButtons[i];
                    if (b.AttachedData.AttributeCode != cb.AttachedData.AttributeCode) {
                        b.AttachedData.Score = 0;
                    }
                    var style = self._ListControlStyle.filter(function (x) { return x.Code == b.AttachedData.AttributeCode; })[0];
                    b.SetBackground(style.Background);
                    b.SetBorderBrush(style.BorderBrush);
                }
                // Surbrillance du bouton sélectionné            
                if (cb.AttachedData.Score == 1) {
                    if (this._ActionWhenSelectedButtonChanged == "ChangeBackground" || this._ActionWhenSelectedButtonChanged == "ChangeBackgroundAndBorder") {
                        cb._Background = cb._SelectedBackground;
                        cb.SetBackground(cb._SelectedBackground);
                    }
                    if (this._ActionWhenSelectedButtonChanged == "ChangeBorder" || this._ActionWhenSelectedButtonChanged == "ChangeBackgroundAndBorder") {
                        cb._BorderBrush = cb._SelectedBorderBrush;
                        cb.SetBorderBrush(cb._SelectedBorderBrush);
                    }
                }
            };
            DTSButtonsControl.prototype.toggleCustomButton = function (cb) {
                var self = this;
                if (this.IsEnabled == false) {
                    return;
                }
                cb.AttachedData.RecordedDate = new Date(Date.now());
                if (cb.AttachedData.Score == 0) {
                    cb.AttachedData.Score = 1;
                }
                else {
                    cb.AttachedData.Score = 0;
                }
                if (this.StartDate != undefined) {
                    // Enregistrement du temps                        
                    cb.AttachedData.Time = (cb.AttachedData.RecordedDate.getTime() - this.StartDate.getTime()) / 1000;
                }
                this.onDataChanged(cb.AttachedData);
                // Copie de l'objet
                //TODO : tester let d: Models.Data = Helpers.SerializationHelper.CloneObject<Models.Data>(cb.AttachedData); ou createfrom
                var j = JSON.stringify(cb.AttachedData);
                var d = JSON.parse(j);
                this.ListData.push(d);
                this.validate();
                // Surbrillance du bouton sélectionné            
                if (cb.AttachedData.Score == 1) {
                    if (this._ActionWhenSelectedButtonChanged == "ChangeBackground" || this._ActionWhenSelectedButtonChanged == "ChangeBackgroundAndBorder") {
                        cb._Background = cb._SelectedBackground;
                        cb.SetBackground(cb._SelectedBackground);
                    }
                    if (this._ActionWhenSelectedButtonChanged == "ChangeBorder" || this._ActionWhenSelectedButtonChanged == "ChangeBackgroundAndBorder") {
                        cb._BorderBrush = cb._SelectedBorderBrush;
                        cb.SetBorderBrush(cb._SelectedBorderBrush);
                    }
                }
                else {
                    var style = self._ListControlStyle.filter(function (x) { return x.Code == cb.AttachedData.AttributeCode; })[0];
                    cb.SetBackground(style.Background);
                    cb.SetBorderBrush(style.BorderBrush);
                }
            };
            DTSButtonsControl.prototype.Disable = function () {
                // Désactive le contrôle
                this.IsEnabled = false;
                this.listButtons.forEach(function (x) {
                    x.Disable();
                });
            };
            DTSButtonsControl.prototype.Enable = function () {
                this.IsEnabled = true;
                // Désactive le contrôle
                this.listButtons.forEach(function (x) {
                    x.Enable();
                });
            };
            DTSButtonsControl.prototype.ClickOn = function (attribute) {
                var cb = this.listButtons.filter(function (x) { return x.AttachedData.AttributeCode == attribute; })[0];
                this.clickOnCustomButton(cb);
            };
            DTSButtonsControl.prototype.GetListButtons = function () {
                return this.listButtons;
            };
            DTSButtonsControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "creation") {
                    var validateFormSetDataType_2 = function () {
                        if (self._DataType.length < 1) {
                            formSetDataType_2.ValidationResult = Framework.LocalizationManager.Get("SelectDataType") + "\n";
                        }
                        formSetDataType_2.Check();
                    };
                    var formSetDataType_2 = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "DataType", this._DataType, DTSButtonsControl.DataTypeEnum, function (x) {
                        self.changeProperty("_DataType", x);
                        validateFormSetDataType_2();
                    });
                    properties.push(formSetDataType_2);
                    validateFormSetDataType_2();
                }
                if (mode == "creation" || mode == "edition" || mode == "wizard") {
                    var formSetDominanceMode = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "DominanceMode", self._DominanceMode, self.GetDominanceModeEnum(), function (x, y) {
                        self.changeProperty("_DominanceMode", x);
                        formSetDuration_1.Check();
                    });
                    properties.push(formSetDominanceMode);
                    var formSetDuration_1 = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "DurationBeforeFading", self._LimitedDuration, 1, 30, function (x) {
                        self.changeProperty("_LimitedDuration", x);
                    }, 1, function () { return (self._DominanceMode == "DominantForALimitedDuration"); });
                    properties.push(formSetDuration_1);
                }
                if (mode == "edition") {
                    var formSetMarginBetweenButtons = Framework.Form.PropertyEditorWithNumericUpDown.Render("Design", "MarginBetweenButtons", self._MarginBetweenButtons, 0, 30, function (x) {
                        self.changeProperty("_MarginBetweenButtons", x);
                        self.updateControl();
                    });
                    properties.push(formSetMarginBetweenButtons);
                    var formSetNbColumns = Framework.Form.PropertyEditorWithNumericUpDown.Render("Design", "NbColumns", self._NbColumns, 1, 5, function (x) {
                        self.changeProperty("_NbColumns", x);
                        self.updateControl();
                    });
                    properties.push(formSetNbColumns);
                    // Bouton actif
                    var formSetSelectedButtonBackground = Framework.Form.PropertyEditorWithColorPopup.Render("ControlDesign", "ActiveButtonBackgroundColor", self._SelectedButtonBackground, function (x) {
                        self.changeProperty("_SelectedButtonBackground", x);
                    });
                    properties.push(formSetSelectedButtonBackground);
                    var formSetSelectedButtonBorder = Framework.Form.PropertyEditorWithColorPopup.Render("ControlDesign", "ActiveButtonBorderColor", self._SelectedButtonBorder, function (x) {
                        self.changeProperty("_SelectedButtonBorder", x);
                    });
                    properties.push(formSetSelectedButtonBorder);
                    var formSetActionWhenSelectedButtonChanged = Framework.Form.PropertyEditorWithPopup.Render("ControlDesign", "ActionWhenSelectedButtonChanged", self._ActionWhenSelectedButtonChanged, DTSButtonsControl.ActionWhenSelectedButtonChangedEnum, function (x, y) {
                        self.changeProperty("_ActionWhenSelectedButtonChanged", x);
                    });
                    properties.push(formSetActionWhenSelectedButtonChanged);
                    //TODO : hoverbackground
                }
                return properties;
            };
            DTSButtonsControl.Create = function (experimentalDesignId, dataType) {
                if (experimentalDesignId === void 0) { experimentalDesignId = 0; }
                if (dataType === void 0) { dataType = "TDS"; }
                var control = new DTSButtonsControl();
                control._Height = 500;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                control._ExperimentalDesignId = experimentalDesignId;
                control._DataType = dataType;
                control._MustAnswerAllAttributes;
                control._NbColumns = 2;
                control._MarginBetweenButtons = 10;
                control._BorderThickness = 0;
                //control.SetStyle();                
                return control;
            };
            DTSButtonsControl.prototype.SetStyle = function (style) {
                if (style === void 0) { style = undefined; }
                if (style) {
                    //this._ListControlStyle.forEach((x) => {
                    //    let div = document.createElement("div");
                    //    div.innerHTML = x.Label;
                    //    //x.HtmlContent = '<span style="font-size:' + style["FontSize"] + 'px; font-family:' + style["FontFamily"] + '">' + div.innerText + '</span>';
                    //});
                    this.setControlStyle("BorderBrush", style["FontColor"], true);
                    this.setControlStyle("Background", style["FontColor"], true);
                    this.setControlStyle("Foreground", Framework.Color.InvertHexColor(style["FontColor"]), true);
                }
                else {
                    this.setControlStyle("BorderBrush", "darkblue", true);
                    this.setControlStyle("Background", "blue", true);
                    this.setControlStyle("Foreground", "white", true);
                }
                this.updateControl();
            };
            DTSButtonsControl.DataTypeEnum = ["TDS", "TCATA"];
            DTSButtonsControl.ActionWhenSelectedButtonChangedEnum = [
                "ChangeBackground",
                "ChangeBorder",
                "ChangeBackgroundAndBorder",
                "DoNothing"
            ];
            return DTSButtonsControl;
        }(StackedControl));
        Controls.DTSButtonsControl = DTSButtonsControl;
        var CATAControl = /** @class */ (function (_super) {
            __extends(CATAControl, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function CATAControl() {
                var _this = _super.call(this) || this;
                // TODO : récupérer valeur existante
                _this._NbColumns = 1; // Nombre de colonnes
                _this._LabelPosition = "Right"; // Position des libellés
                _this._MarginBetweenButtonAndLabel = 10; // Marge horizontale entre les cases à cocher et les libellés
                _this._MarginBetweenButtons = 10; // Marge verticale entre les boutons
                _this._LimitedDuration = 5; // Si Fading, durée pendant laquelle la case reste allumée avant de s'éteindre automatiquement (secondes)
                _this._Fading = false; // Si true, la case cochée s'éteint après LimitedDuration 
                _this._MaxNumberOfAnswers = undefined;
                _this._MinNumberOfAnswers = 0;
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "Column", "_NbColumns"); // Nombre de colonnes
                //    this.setPropertyFromXaml(control, "LabelPosition", "_LabelPosition"); // Position des libellés
                //    this.setPropertyFromXaml(control, "MarginBetweenButtonAndLabel", "_MarginBetweenButtonAndLabel");
                //    this.setPropertyFromXaml(control, "MarginBetweenButtons", "_MarginBetweenButtons");
                //    this.setPropertyFromXaml(control, "LimitedDuration", "_LimitedDuration");
                //    this.setPropertyFromXaml(control, "Fading", "_Fading");
                //    this._LabelPosition = "Right";
                //}
                _this._Type = "CATAControl";
                _this.ValidationMessage = "";
                if (_this._MaxNumberOfAnswers == undefined) {
                    _this._MaxNumberOfAnswers = _this.items.length;
                }
                _this._ControlBackground = "darkblue";
                return _this;
            }
            CATAControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition") {
                    var formSetNbColumns = Framework.Form.PropertyEditorWithNumericUpDown.Render("Design", "NbColumns", self._NbColumns, 1, 5, function (x) {
                        self.changeProperty("_NbColumns", x);
                        self.updateControl();
                    });
                    properties.push(formSetNbColumns);
                    var formSetLabelPosition = Framework.Form.PropertyEditorWithPopup.Render("Design", "LabelPosition", self._LabelPosition, CATAControl.LabelPositionEnum, function (x) {
                        self.changeProperty("_LabelPosition", x);
                        self.updateControl();
                    });
                    properties.push(formSetLabelPosition);
                    var formSetMarginBetweenButtons = Framework.Form.PropertyEditorWithNumericUpDown.Render("Design", "MarginBetweenButtons", self._MarginBetweenButtons, 0, 100, function (x) {
                        self.changeProperty("_MarginBetweenButtons", x);
                        self.updateControl();
                    });
                    properties.push(formSetMarginBetweenButtons);
                    //let formSetMarginBetweenButtonAndLabel = Framework.Form.PropertyEditorWithNumericUpDown.Render("Design", "MarginBetweenButtonAndLabel", self._MarginBetweenButtonAndLabel, 0, 100, (x) => {
                    //    self.changeProperty("_MarginBetweenButtonAndLabel", x);
                    //    self.updateControl();
                    //});
                    //properties.push(formSetMarginBetweenButtonAndLabel);
                }
                if (mode == "edition" || mode == "creation") {
                    var min = 0;
                    if (self._MustAnswerAllAttributes == true) {
                        min = 1;
                    }
                    var formSetMinNumberOfAnswers = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MinNumberOfAnswers", self._MinNumberOfAnswers, min, self.items.length, function (x) {
                        self.changeProperty("_MinNumberOfAnswers", x);
                    });
                    properties.push(formSetMinNumberOfAnswers);
                    var formSetMaxNumberOfAnswers = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MaxNumberOfAnswers", self._MaxNumberOfAnswers, 0, self.items.length, function (x) {
                        self.changeProperty("_MaxNumberOfAnswers", x);
                    });
                    properties.push(formSetMaxNumberOfAnswers);
                }
                if (mode == "creation") {
                    var validateFormSetDataType_3 = function () {
                        if (self._DataType.length < 1) {
                            formSetDataType_3.ValidationResult = Framework.LocalizationManager.Get("SelectDataType") + "\n";
                        }
                        formSetDataType_3.Check();
                    };
                    var formSetDataType_3 = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "DataType", this._DataType, CATAControl.DataTypeEnum, function (x) {
                        self.changeProperty("_DataType", x);
                        validateFormSetDataType_3();
                        formSetFading_1.Check();
                        formSetLimitedDuration_1.Check();
                    });
                    properties.push(formSetDataType_3);
                    validateFormSetDataType_3();
                    var formSetFading_1 = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "Fading", self._Fading, function (x) {
                        self.changeProperty("_Fading", x);
                        formSetLimitedDuration_1.Check();
                    }, function () { return self._DataType == "TCATA"; });
                    properties.push(formSetFading_1);
                    var formSetLimitedDuration_1 = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "LimitedDuration", self._LimitedDuration, 1, 30, function (x) {
                        self.changeProperty("_LimitedDuration", x);
                    }, 1, function () { return self._DataType == "TCATA" && self._Fading == true; });
                    properties.push(formSetLimitedDuration_1);
                }
                return properties;
            };
            CATAControl.prototype.validate = function () {
                this.ValidationMessage = "";
                //if (this._MustAnswerAllAttributes == true) {
                // Au moins un score                
                var nb = Framework.Array.Unique((this.ListData.filter(function (x) { return (x.AttributeCode != "START" && x.Score == 1); })).map(function (x) { return x.AttributeCode; })).length;
                this.IsValid = (nb >= this._MinNumberOfAnswers && nb <= this._MaxNumberOfAnswers);
                // Message d'erreur
                if (this.IsValid == false) {
                    this.ValidationMessage = "";
                    if (nb < this._MinNumberOfAnswers) {
                        this.ValidationMessage += Framework.LocalizationManager.Format("MinNumberOfAnswers", [this._MinNumberOfAnswers.toString()]) + "\r\n";
                    }
                    if (nb > this._MaxNumberOfAnswers) {
                        this.ValidationMessage += Framework.LocalizationManager.Format("MaxNumberOfAnswers", [this._MaxNumberOfAnswers.toString()]) + "\r\n";
                    }
                    if (this.ValidationMessage != "" && this._CustomErrorMessage != "") {
                        this.ValidationMessage = this._CustomErrorMessage + "\r\n";
                    }
                }
                else {
                    this.ValidationMessage = "";
                }
                //}
            };
            CATAControl.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                this.listCheckboxes = [];
                var self = this;
                if (self._MustAnswerAllAttributes == true && self._MinNumberOfAnswers == 0) {
                    self._MinNumberOfAnswers = 1;
                }
                // Label le plus long : détermine la taille de la boite de tous les labels
                var longerLabel;
                var longerLabelLength = 0;
                var size = this._FontSize;
                var fontFamily = this._FontFamily;
                this.items.forEach(function (x) {
                    x.Label.length > longerLabelLength ? longerLabel = x.Label : null;
                    var style = self.getControlStyle(x.Code);
                    size = style.FontSize;
                    fontFamily = style.FontFamily;
                });
                var measure = Framework.Scale.MeasureText(longerLabel, size, fontFamily, this._FontStyle, this._FontWeight);
                var labelWidth = measure.width;
                var labelHeight = measure.height;
                var nbItemPerCol = Math.round(this.items.length / this._NbColumns);
                var colWidth = this._Width / this._NbColumns;
                var left = 0;
                var top = 0;
                var currentCol = 0;
                var lineHeight = labelHeight + 2 * this._MarginBetweenButtons;
                var cptItem = 0;
                for (var i = 0; i < this.items.length; i++) {
                    var code = this.items[i].Code;
                    var style = this.getControlStyle(code);
                    var control = new CustomCheckBox();
                    control._BorderThickness = style.BorderThickness;
                    control._BorderBrush = style.BorderBrush;
                    control._Background = style.Background;
                    //var label: Label = new Label(style.HtmlContent);
                    //var label: Label = new Label(style.Label);
                    var label = new Label(this.items[i].Label);
                    label._Width = colWidth - labelHeight - 10;
                    label._Foreground = style.Foreground;
                    var align = "left";
                    if (style.HorizontalContentAlignment) {
                        align = style.HorizontalContentAlignment;
                    }
                    label.HorizontalAlignment = align;
                    if (style.FontWeight == true) {
                        label._FontWeight = "Bold";
                    }
                    if (style.FontStyle == true) {
                        label._FontStyle = "Italic";
                    }
                    label._FontSize = style.FontSize;
                    label._FontFamily = style.FontFamily;
                    control._Width = labelHeight;
                    control._Height = labelHeight;
                    control.Value = 1;
                    control.AttributeCode = this.items[i].Code;
                    control.AttributeRank = i + 1;
                    control.CanUncheck = true;
                    if (editMode == false) {
                        control.OnClick = function () { self.clickOnCheckBox(this); };
                        // Données à enregistrer
                        if (this._DataType == "CATA") {
                            var d = new Models.Data();
                            d.AttributeCode = this.items[i].Code;
                            d.AttributeRank = i + 1;
                            d.DataControlId = this._Id;
                            d.ControlName = this._FriendlyName;
                            d.ProductCode = this.ProductCode;
                            d.ProductRank = this.ProductRank;
                            d.Replicate = this.Replicate;
                            d.Intake = this.Intake;
                            d.Score = 0;
                            d.Session = this.UploadId;
                            d.SubjectCode = this.SubjectCode;
                            d.Type = this._DataType;
                            d.RecordedDate = new Date(Date.now());
                            this.ListData.push(d);
                        }
                    }
                    this.listCheckboxes.push(control);
                    var controlWithLabel = new ControlWithLabel(control, labelHeight, colWidth, label, self._LabelPosition, "Horizontal", self._MarginBetweenButtonAndLabel);
                    controlWithLabel._Left = left;
                    controlWithLabel._Top = top;
                    //if (editMode == true) {
                    //    controlWithLabel.OnClick = (x) => {
                    //        // Highlight de l'échelle sélectionnée
                    //        x.HtmlElement.classList.add("selectedControlInsideAdorner");
                    //        self.selectedItemCode = x.HtmlElement.getAttribute("code");
                    //    }
                    //    controlWithLabel.OnLabelChanged = (x) => {
                    //        let ref = self.getControlStyle(code);
                    //        ref.HtmlContent = x;
                    //    }
                    //}
                    controlWithLabel.Render(editMode, ratio);
                    control.HtmlElement.setAttribute("code", code);
                    this.HtmlElement.appendChild(controlWithLabel.HtmlElement);
                    top += controlWithLabel._Height + self._MarginBetweenButtons;
                    cptItem++;
                    if (cptItem >= nbItemPerCol) {
                        left += colWidth;
                        top = 0;
                        currentCol++;
                        cptItem = 0;
                    }
                }
                //if (this._MustAnswerAllAttributes == true) {
                this.validate();
                //}
                if (editMode == false) {
                    this.OnSpeechRecognized = function (text) {
                        self.listCheckboxes.forEach(function (b) {
                            var label = self.items.filter(function (x) { return x.Code == b.AttributeCode; })[0].Label;
                            if (Framework.WordComparer.ContainsWithSoundex(label, text, Framework.LocalizationManager.GetDisplayLanguage())) {
                                self.clickOnCheckBox(b);
                            }
                        });
                    };
                }
                this.Scrollable();
            };
            CATAControl.prototype.clickOnCheckBox = function (cb) {
                var self = this;
                if (self.IsEnabled == false) {
                    return;
                }
                // Enregistrement
                if (self._DataType == "CATA") {
                    var d = self.ListData.filter(function (x) { return (x.AttributeCode == cb.AttributeCode); });
                    if (d.length > 0) {
                        d[0].RecordedDate = new Date(Date.now());
                        if (cb.IsChecked == true) {
                            d[0].Score = 1;
                        }
                        else {
                            d[0].Score = 0;
                        }
                    }
                    self.onDataChanged(d[0]);
                }
                if (self._DataType == "TCATA") {
                    if (self.StartDate != undefined) {
                        var dd = new Models.Data();
                        dd.AttributeCode = cb.AttributeCode;
                        dd.AttributeRank = cb.AttributeRank;
                        dd.DataControlId = self._Id;
                        dd.ControlName = self._FriendlyName;
                        dd.ProductCode = self.ProductCode;
                        dd.ProductRank = self.ProductRank;
                        dd.Replicate = self.Replicate;
                        dd.Intake = self.Intake;
                        if (cb.IsChecked == true) {
                            dd.Score = 1;
                        }
                        else {
                            dd.Score = 0;
                        }
                        dd.Session = self.UploadId;
                        dd.SubjectCode = self.SubjectCode;
                        dd.RecordedDate = new Date(Date.now());
                        dd.Type = self._DataType;
                        dd.Time = (new Date(Date.now()).getTime() - self.StartDate.getTime()) / 1000;
                        self.ListData.push(dd);
                    }
                    self.onDataChanged(dd);
                    if (self._Fading == true) {
                        if (cb.IsChecked == true && cb.IsEnabled == true) {
                            cb._Tag = setTimeout(function () {
                                var dd = new Models.Data();
                                dd.AttributeCode = cb.AttributeCode;
                                dd.AttributeRank = cb.AttributeRank;
                                dd.DataControlId = self._Id;
                                dd.ControlName = self._FriendlyName;
                                dd.ProductCode = self.ProductCode;
                                dd.ProductRank = self.ProductRank;
                                dd.Intake = self.Intake;
                                dd.Replicate = self.Replicate;
                                dd.Score = 0;
                                dd.Session = self.UploadId;
                                dd.SubjectCode = self.SubjectCode;
                                dd.RecordedDate = new Date(Date.now());
                                dd.Type = self._DataType;
                                dd.Time = (new Date(Date.now()).getTime() - self.StartDate.getTime()) / 1000;
                                self.ListData.push(dd);
                                self.onDataChanged(dd);
                                cb.Uncheck();
                                clearTimeout(Number(cb._Tag));
                            }, self._LimitedDuration * 1000).toString();
                        }
                        if (cb.IsChecked == false) {
                            clearTimeout(Number(cb._Tag));
                        }
                    }
                }
                if (self._MaxNumberOfAnswers == 1) {
                    // Décliquer tous les autres
                    if (cb.IsChecked) {
                        self.listCheckboxes.forEach(function (x) {
                            if (cb.AttributeCode != x.AttributeCode) {
                                var d = self.ListData.filter(function (y) { return (x.AttributeCode == y.AttributeCode); });
                                d.forEach(function (y) {
                                    y.RecordedDate = new Date(Date.now());
                                    y.Score = 0;
                                });
                                x.Uncheck();
                            }
                        });
                    }
                }
                // Validation
                self.validate();
            };
            CATAControl.prototype.Disable = function () {
                // Désactive le contrôle
                this.IsEnabled = false;
                this.listCheckboxes.forEach(function (x) {
                    x.Disable();
                });
            };
            CATAControl.prototype.Enable = function () {
                this.IsEnabled = true;
                // Désactive le contrôle
                this.listCheckboxes.forEach(function (x) {
                    x.Enable();
                });
            };
            CATAControl.prototype.GetListCheckboxes = function () {
                return this.listCheckboxes;
            };
            CATAControl.Create = function (experimentalDesignId, dataType) {
                if (experimentalDesignId === void 0) { experimentalDesignId = 0; }
                if (dataType === void 0) { dataType = "CATA"; }
                var control = new CATAControl();
                control._Height = 600;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                control._ExperimentalDesignId = experimentalDesignId;
                control._DataType = dataType;
                control._MustAnswerAllAttributes;
                control._NbColumns = 1;
                control._MarginBetweenButtons = 10;
                control._Fading = false;
                control._EvaluationMode = "Product";
                return control;
            };
            CATAControl.LabelPositionEnum = ["Left", "Right", "TopCenter", "BottomCenter"];
            CATAControl.DataTypeEnum = ["CATA", "TCATA"];
            return CATAControl;
        }(StackedControl));
        Controls.CATAControl = CATAControl;
        var ControlLabel = /** @class */ (function () {
            function ControlLabel(value, label) {
                if (label === void 0) { label = ""; }
                this.FontSize = 20;
                this.Margin = 12;
                this.Color = "darkblue";
                this.Visibility = true;
                this.Item = "*";
                this.Value = value;
                this.Label = label;
                this.Placement = "Top";
                this.TooltipImage = "";
                this.FontSize = 20;
                this.Margin = 10;
                this.Color = "darkblue";
                this.Visibility = true;
            }
            return ControlLabel;
        }());
        Controls.ControlLabel = ControlLabel;
        var BaseChronometer = /** @class */ (function (_super) {
            __extends(BaseChronometer, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function BaseChronometer() {
                var _this = _super.call(this) || this;
                // TODO : _Precision pas implémenté dans l'affichage : "Minutes", "Seconds", "Milliseconds"
                // TODO : paramétrer autres actions ?
                //TODO : boderthickness, borderbrus, background, foreground
                _this._MaxTime = 60; // Temps maximal avant passage à écran suivant (Minuteur) ou désactivation des contrôles (Chronomètre)
                _this._IsVisible = true; // Visibilité
                _this._Precision = "Seconds"; // Précision de l'affichage
                _this.IsStarted = false;
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "MaxTime", "_MaxTime");
                //    this.setPropertyFromXaml(control, "IsVisible", "_IsVisible");
                //    this.setPropertyFromXaml(control, "Precision", "_Precision");
                //}
                _this.showExperimentalDesignProperty = false;
                return _this;
            }
            BaseChronometer.prototype.Render = function (editMode, ratio) {
                _super.prototype.Render.call(this, editMode, ratio);
                this.HtmlElement.className = "BaseChronometer";
                if (this._IsVisible == false) {
                    this.HtmlElement.style.display = "none";
                    this.HtmlElement.style.opacity = "0";
                }
                this.Label = document.createElement("label");
                this.Label.innerText = "0.0";
                this.Label.style.fontFamily = "Digit";
                this.Label.style.color = this._Foreground;
                // Autofit texte
                this.Label.style.fontSize = this._Height * ratio + 'px';
                this.HtmlElement.appendChild(this.Label);
            };
            BaseChronometer.prototype.setText = function (val) {
                var sval = val.toFixed(1);
                if (this._Precision == "Seconds") {
                    sval = Math.round(val).toFixed(0);
                }
                if (this._Precision == "Minutes") {
                    var mins = ~~((val % 3600) / 60);
                    var secs = ~~val % 60;
                    var ssecs = secs.toString();
                    if (secs < 10) {
                        ssecs = "0" + secs.toString();
                    }
                    sval = mins + "'" + ssecs + '';
                    //TODO
                }
                this.Label.innerText = sval;
            };
            BaseChronometer.prototype.SetText = function (val) {
                this.setText(val);
            };
            BaseChronometer.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition") {
                    var formSetVisibility = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "Visibility", self._IsVisible, function (x) {
                        self.changeProperty("_IsVisible", x);
                    });
                    properties.push(formSetVisibility);
                    var formSetPrecision = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "Precision", self._Precision, BaseChronometer.PrecisionEnum, function (x, y) {
                        self.changeProperty("_Precision", x);
                        self.setText(self._MaxTime);
                        self.updateControl();
                    });
                    properties.push(formSetPrecision);
                }
                return properties;
            };
            BaseChronometer.PrecisionEnum = ["Minutes", "Seconds" /*, "Milliseconds"*/];
            return BaseChronometer;
        }(DataControl));
        var CustomChronometer = /** @class */ (function (_super) {
            __extends(CustomChronometer, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function CustomChronometer() {
                var _this = _super.call(this) || this;
                _this.isPaused = false;
                _this.time = 0;
                _this._Type = "CustomChronometer";
                return _this;
            }
            // Démarre le chronomètre
            CustomChronometer.prototype.Start = function () {
                this.IsStarted = true;
                this.StartDate = new Date(Date.now());
                var customChronometer = this;
                this.Timer = setInterval(function () {
                    if (customChronometer.isPaused == false) {
                        customChronometer.time = (new Date(Date.now()).getTime() - customChronometer.StartDate.getTime());
                        customChronometer.Label.innerText = (customChronometer.time / 1000).toFixed(1);
                        if (customChronometer._MaxTime != undefined && (customChronometer.time / 1000) >= customChronometer._MaxTime) {
                            //    clearInterval(this.Timer);
                            customChronometer.Label.innerText = customChronometer._MaxTime.toFixed(1);
                            customChronometer.OnMaxTimeReached();
                            customChronometer.Stop();
                        }
                    }
                }, 100);
            };
            // Stoppe le chronomètre
            CustomChronometer.prototype.Stop = function () {
                clearInterval(this.Timer);
                this.IsStarted = false;
            };
            CustomChronometer.prototype.Pause = function () {
                this.isPaused = true;
                this.IsStarted = false;
            };
            CustomChronometer.prototype.Render = function (editMode, ratio) {
                _super.prototype.Render.call(this, editMode, ratio);
                this.Label.innerText = "0.0";
                this.HtmlElement.className = "customChronometer";
            };
            CustomChronometer.prototype.GetTime = function () {
                return this.time;
            };
            CustomChronometer.prototype.GetEditableProperties = function (mode) {
                var _this = this;
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition") {
                    var formSetMaxTime = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "ChronometerMaxTime", self._MaxTime, 0, 300000, function (x) {
                        self.changeProperty("_MaxTime", x);
                        self.setText(_this._MaxTime);
                        self.updateControl();
                    });
                    properties.push(formSetMaxTime);
                }
                return properties;
            };
            CustomChronometer.Create = function (maxTime, height, width, style) {
                if (maxTime === void 0) { maxTime = 60; }
                if (height === void 0) { height = 50; }
                if (width === void 0) { width = 50; }
                if (style === void 0) { style = undefined; }
                var chronometer = new CustomChronometer();
                chronometer._Height = height;
                chronometer._Width = width;
                chronometer._MaxTime = maxTime;
                chronometer._BorderThickness = 1;
                if (style) {
                    //TODO
                    if (style["FontSize"]) {
                        chronometer._FontSize = Number(style["FontSize"]);
                    }
                    if (style["FontFamily"]) {
                        chronometer._FontFamily = style["FontFamily"];
                    }
                    if (style["FontColor"]) {
                        chronometer._Foreground = style["FontColor"];
                    }
                }
                return chronometer;
            };
            return CustomChronometer;
        }(BaseChronometer));
        Controls.CustomChronometer = CustomChronometer;
        var CustomTimer = /** @class */ (function (_super) {
            __extends(CustomTimer, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function CustomTimer() {
                var _this = _super.call(this) || this;
                _this._Type = "CustomTimer";
                return _this;
            }
            CustomTimer.prototype.Render = function (editMode, ratio) {
                _super.prototype.Render.call(this, editMode, ratio);
                this.setText(this._MaxTime);
                this.HtmlElement.className = "customTimer";
            };
            // Démarre le minuteur
            CustomTimer.prototype.Start = function () {
                this.IsStarted = true;
                this.StartDate = new Date(Date.now());
                var customTimer = this;
                this.Timer = setInterval(function () {
                    var diff = (new Date(Date.now()).getTime() - customTimer.StartDate.getTime()) / 1000;
                    customTimer.setText(customTimer._MaxTime - diff);
                    if (customTimer._MaxTime != undefined && diff >= customTimer._MaxTime) {
                        clearInterval(customTimer.Timer);
                        customTimer.setText(customTimer._MaxTime);
                        customTimer.OnMaxTimeReached();
                        customTimer.Hide();
                    }
                }, 100);
            };
            CustomTimer.prototype.Stop = function () {
                this.IsStarted = false;
                clearInterval(this.Timer);
            };
            CustomTimer.Create = function (visibility, maxTime) {
                var timer = new CustomTimer();
                timer._Height = 100;
                timer._Width = 100;
                timer.DefaultLeftCoordinate = "Top";
                timer.DefaultTopCoordinate = "Top";
                timer._BorderThickness = 0;
                timer._MaxTime = maxTime;
                timer._IsVisible = visibility == "Visible";
                return timer;
            };
            CustomTimer.prototype.GetEditableProperties = function (mode) {
                var _this = this;
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition") {
                    var formSetMaxTime = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MaxTime", self._MaxTime, 0, 300000, function (x) {
                        self.changeProperty("_MaxTime", x);
                        self.setText(_this._MaxTime);
                        self.updateControl();
                    });
                    properties.push(formSetMaxTime);
                }
                return properties;
            };
            return CustomTimer;
        }(BaseChronometer));
        Controls.CustomTimer = CustomTimer;
        var BaseQuestionControl = /** @class */ (function (_super) {
            __extends(BaseQuestionControl, _super);
            function BaseQuestionControl() {
                var _this = _super.call(this) || this;
                _this._LabelContent = "";
                _this._LabelBorderWidth = 0;
                _this._LabelBorderColor = "black";
                _this._LabelBackground = "transparent";
                _this._LabelMarginLeft = 0;
                _this._LabelMarginRight = 0;
                _this._LabelMarginBottom = 0;
                _this._LabelPosition = "Top";
                _this._LabelWidth = 300;
                //public _AnswerMaxHeight: number = 100;
                _this._ListAnswers = [];
                _this.showCreationProperties = true;
                _this.additionalEditableProperties = ["QuestionDesign", "AnswerDesign"];
                _this._ListAnswers = [
                    new Framework.KeyValuePair("A", Framework.LocalizationManager.Get("Answer") + " A"),
                    new Framework.KeyValuePair("B", Framework.LocalizationManager.Get("Answer") + " B"),
                ];
                _this.showExperimentalDesignProperty = false;
                return _this;
            }
            BaseQuestionControl.prototype.GetHtmlDivElement = function () {
                return this.Label.Div;
            };
            BaseQuestionControl.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                var self = this;
                this.Label = new Label(this._LabelContent);
                this.Label._FontFamily = this._FontFamily;
                this.Label._FontSize = this._FontSize;
                this.Label._FontStyle = this._FontStyle;
                this.Label._FontWeight = this._FontWeight;
                this.Label.VerticalAlignment = "top";
                this.Label._Width = this._Width;
                if (editMode == true) {
                    this.Label.IsEditable = true;
                    //this.Label.OnChanged = (x) => {
                    //    self._LabelContent = x;
                    //    self.resize();
                    //};
                }
                else {
                    this.Label.IsEditable = false;
                }
                this.Label.Render(editMode, ratio);
                this.HtmlElement.appendChild(this.Label.HtmlElement);
                this.Label.HtmlElement.style.wordWrap = "break-word";
                //this.label.HtmlElement.style.wordBreak = "break-all";                
                this.Label.HtmlElement.style.wordBreak = "break-word";
                this.Label.HtmlElement.style.textOverflow = "clip";
                this.Label.HtmlElement.style.maxWidth = this._Width + "px";
                this.Label.SetBorder(this._LabelBorderWidth, this._LabelBorderColor);
                this.Label.SetBorderBackground(this._LabelBackground);
            };
            BaseQuestionControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition") {
                    //let formSetAnswerMaxHeight = Framework.Form.PropertyEditorWithNumericUpDown.Render("QuestionDesign", "AnswerMaxHeight", self._AnswerMaxHeight, 0, 1000, (x) => {
                    //    self.changeProperty("_AnswerMaxHeight", x);
                    //    self.resize();
                    //});
                    //properties.push(formSetAnswerMaxHeight);
                    var formSetLabelPosition = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "LabelPosition", self._LabelPosition, ["Top", "Left"], function (x) {
                        self.changeProperty("_LabelPosition", x);
                        self.resize();
                    });
                    properties.push(formSetLabelPosition);
                    var formSetLabelWidth = Framework.Form.PropertyEditorWithNumericUpDown.Render("QuestionDesign", "LabelWidth", self._LabelWidth, 0, 1000, function (x) {
                        self.changeProperty("_LabelWidth", x);
                        self.resize();
                    });
                    properties.push(formSetLabelWidth);
                    var formSetLabelBorderWidth = Framework.Form.PropertyEditorWithNumericUpDown.Render("QuestionDesign", "BorderThickness", self._LabelBorderWidth, 0, 10, function (x) {
                        self.changeProperty("_LabelBorderWidth", x);
                        self.Label.SetBorder(self._LabelBorderWidth, self._LabelBorderColor);
                    });
                    properties.push(formSetLabelBorderWidth);
                    var formSetLabelBorderColor = Framework.Form.PropertyEditorWithColorPopup.Render("QuestionDesign", "BorderColor", self._LabelBorderColor, function (x) {
                        self.changeProperty("_LabelBorderColor", x);
                        self.Label.SetBorder(self._LabelBorderWidth, self._LabelBorderColor);
                    });
                    properties.push(formSetLabelBorderColor);
                    var formSetLabelBackgroundColor = Framework.Form.PropertyEditorWithColorPopup.Render("QuestionDesign", "BackgroundColor", self._LabelBackground, function (x) {
                        self.changeProperty("_LabelBackground", x);
                        self.Label.SetBorderBackground(self._LabelBackground);
                    });
                    properties.push(formSetLabelBackgroundColor);
                    var formSetLabelMarginLeft = Framework.Form.PropertyEditorWithNumericUpDown.Render("QuestionDesign", "MarginLeft", self._LabelMarginLeft, 0, 300, function (x) {
                        self.changeProperty("_LabelMarginLeft", x);
                        self.resize();
                    });
                    properties.push(formSetLabelMarginLeft);
                    var formSetLabelMarginRight = Framework.Form.PropertyEditorWithNumericUpDown.Render("QuestionDesign", "MarginRight", self._LabelMarginRight, 0, 300, function (x) {
                        self.changeProperty("_LabelMarginRight", x);
                        self.resize();
                    });
                    properties.push(formSetLabelMarginRight);
                    var formSetLabelMarginBottom = Framework.Form.PropertyEditorWithNumericUpDown.Render("QuestionDesign", "MarginBottom", self._LabelMarginBottom, 0, 300, function (x) {
                        self.changeProperty("_LabelMarginBottom", x);
                        self.resize();
                    });
                    properties.push(formSetLabelMarginBottom);
                    var formSetTextDecoration = Framework.Form.PropertyEditorWithPopup.Render("Design", "TextStyle", Framework.LocalizationManager.Get("ClickToEdit"), ["Normal", "Bold", "Italic", "Bold and italic"], function (x) {
                        if (x == "Bold") {
                            self.changeProperty("_FontWeight", "bold");
                            self.changeProperty("_FontStyle", "");
                        }
                        if (x == "Italic") {
                            self.changeProperty("_FontStyle", "italic");
                            self.changeProperty("_FontWeight", "");
                        }
                        if (x == "Normal") {
                            self.changeProperty("_FontStyle", "");
                            self.changeProperty("_FontWeight", "");
                        }
                        if (x == "Bold and italic") {
                            self.changeProperty("_FontWeight", "bold");
                            self.changeProperty("_FontStyle", "italic");
                        }
                        self.updateControl();
                    });
                    properties.push(formSetTextDecoration);
                    var formSetTextSize = Framework.Form.PropertyEditorWithPopup.Render("Design", "FontSize", self._FontSize.toString(), Framework.InlineHTMLEditor.FontSizeEnum, function (x) {
                        //self._FontSize = Number(x);
                        self.changeProperty("_FontSize", Number(x));
                        self.updateControl();
                    });
                    properties.push(formSetTextSize);
                    var formSetTextFontFamily = Framework.Form.PropertyEditorWithPopup.Render("Design", "TextFont", self._FontFamily, Framework.InlineHTMLEditor.FontNameEnum, function (x) {
                        //self._FontFamily = x;
                        self.changeProperty("_FontFamily", x);
                        self.updateControl();
                    });
                    properties.push(formSetTextFontFamily);
                    var formSetRemoveDesign = Framework.Form.PropertyEditorWithButton.Render("Design", "RemoveStyle", "", function () {
                        var div = document.createElement("div");
                        div.innerHTML = self._LabelContent;
                        //div.innerHTML = self._HtmlContent.replace("</p>", "||</p>").replace("<br>", "||<br>").replace("<br/>", "||<br>");;
                        //self._HtmlContent = div.innerText.replace("||","\n");
                        self._LabelContent = div.innerText;
                        self.updateControl();
                    }, function () { return true; }, "fas fa-remove-format");
                    properties.push(formSetRemoveDesign);
                }
                return properties;
            };
            BaseQuestionControl.prototype.resize = function () {
                this.Label.HtmlElement.style.marginLeft = this._LabelMarginLeft / this.Ratio + "px";
                this.Label.HtmlElement.style.marginRight = this._LabelMarginRight / this.Ratio + "px";
                this.Label.HtmlElement.style.marginBottom = this._LabelMarginBottom / this.Ratio + "px";
            };
            BaseQuestionControl.prototype.ShowListAnswers = function () {
                var div = Framework.Form.TextElement.Create("");
                var self = this;
                var table = new Framework.Form.Table();
                table.ListColumns = [];
                var col1 = new Framework.Form.TableColumn();
                col1.Name = "Key";
                col1.Title = Framework.LocalizationManager.Get("SavedValue");
                col1.Sortable = false;
                col1.Filterable = false;
                col1.RemoveSpecialCharacters = true;
                table.ListColumns.push(col1);
                var col2 = new Framework.Form.TableColumn();
                col2.Name = "Value";
                col2.Title = Framework.LocalizationManager.Get("DisplayedText");
                col2.MinWidth = 150;
                col2.Sortable = false;
                col2.Filterable = false;
                table.ListColumns.push(col2);
                table.Height = "500px";
                table.ListData = this._ListAnswers;
                //table.OnSelectionChanged = () => {
                //};
                //table.OnDataUpdated = (subject: Models.Subject, propertyName: string, oldValue: any, newValue: any) => {
                //};
                table.AddFunction = function () {
                    var label;
                    if (self.style) {
                        label = new Framework.KeyValuePair("", '<p style="font-size:' + self.style["FontSize"] + 'px; font-family:' + self.style["FontFamily"] + '; color:' + self.style["FontColor"] + '"></p>');
                    }
                    else {
                        label = new Framework.KeyValuePair("", '<p></p>');
                    }
                    table.Insert([label]);
                };
                table.RemoveFunction = function () {
                    table.Remove(table.SelectedData);
                };
                table.Render(div.HtmlElement, 800);
                //let dtParameters = new Framework.Form.DataTableParameters();
                //dtParameters.ListData = this._ListAnswers;
                //dtParameters.ListColumns = [
                //    {
                //        data: "Key", title: Framework.LocalizationManager.Get("Value"), render: function (data, type, row) {
                //            return data;
                //        }
                //    },
                //    {
                //        data: "Value", title: Framework.LocalizationManager.Get("Label"), render: function (data, type, row) {
                //            return data;
                //        }
                //    }
                //];
                //dtParameters.Order = [[0, 'desc']];
                //dtParameters.Paging = false;
                //dtParameters.PageLength = 100;
                //dtParameters.ScrollY = "400px";
                //// Edition du contenu des cellules
                //dtParameters.OnEditCell = (propertyName, data) => {
                //    if (propertyName == "Key") {
                //        return Framework.Form.InputText.Create(data["Key"], (x) => {
                //            data["Key"] = x;
                //        }, Framework.Form.Validator.Unique(self._ListAnswers.map((z) => { return z.Key })), false, ["tableInput"]).HtmlElement;
                //    }
                //    if (propertyName == "Value") {
                //        return Framework.Form.InputText.Create(data["Value"], (x) => {
                //            data["Value"] = x;
                //        }, Framework.Form.Validator.NoValidation(), false, ["tableInput"]).HtmlElement;
                //    }
                //}
                //dtParameters.TdHeight = 20;
                var modal;
                //let dtTable: Framework.Form.DataTable;
                ////let btnOK = Framework.Form.Button.Create(() => { return true; }, () => {
                ////    self.updateControl();
                ////    modal.Close();
                ////}, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("OK"));
                ////let buttons = [];
                //Framework.Form.DataTable.AppendToDiv(undefined, "400px", div.HtmlElement, dtParameters, (dt) => {
                //    dtTable = dt;
                //}, (sel) => { }, () => {
                //    let label: Framework.KeyValuePair;
                //    if (self.style) {
                //        label = new Framework.KeyValuePair("", '<p style="font-size:' + self.style["FontSize"] + 'px; font-family:' + self.style["FontFamily"] + '; color:' + self.style["FontColor"] + '"></p>');
                //    } else {
                //        label = new Framework.KeyValuePair("", '<p></p>');
                //    }
                //    dtTable.AddItem(label);
                //    //self._ListAnswers.push(label);
                //}, () => {
                //    dtTable.SelectedData.forEach((x: Framework.KeyValuePair) => {
                //        let selection = self._ListAnswers.filter((y) => { return y.Key == x.Key });
                //        selection.forEach((y) => {
                //            Framework.Array.Remove(self._ListAnswers, y);
                //        });
                //    });
                //    dtTable.RemoveSelection();
                //});
                //modal = Framework.Modal.Custom(div.HtmlElement, Framework.LocalizationManager.Get("ListAnswers"), [btnOK]);
                modal = Framework.Modal.Alert(Framework.LocalizationManager.Get("ListAnswers"), div.HtmlElement, function () {
                    self.updateControl();
                });
            };
            BaseQuestionControl.prototype.SetStyle = function (style) {
                if (style === void 0) { style = {}; }
                if (style) {
                    _super.prototype.SetStyle.call(this, style);
                    //let labelContent = '<p style="font-size:' + style["FontSize"] + 'px; font-family:' + style["FontFamily"] + '; color:' + style["FontColor"] + '">' + this._LabelContent + '</p>';
                    //this.changeProperty("_LabelContent", labelContent);
                    //this.changeProperty("_LabelBorderColor", style["FontColor"]);
                    //this.updateControl();
                }
            };
            return BaseQuestionControl;
        }(DataControl));
        Controls.BaseQuestionControl = BaseQuestionControl;
        var FreeTextQuestionControl = /** @class */ (function (_super) {
            __extends(FreeTextQuestionControl, _super);
            function FreeTextQuestionControl() {
                var _this = _super.call(this) || this;
                _this._Mask = "None";
                _this._AnswerBorderWidth = 1;
                _this._AnswerBorderColor = "black";
                _this._AnswerBorderColorWithError = "red";
                _this._AnswerBackground = "transparent";
                _this._AnswerFontFamily = "Calibri";
                _this._AnswerFontSize = 30;
                _this._AnswerFontColor = "black";
                _this._AnswerMarginLeft = 0;
                _this._AnswerMarginRight = 0;
                _this._HasRecordButton = false;
                _this.CanRecord = true;
                _this._ExcludedWords = [];
                _this._AcceptReturn = true;
                _this._CustomMask = "";
                _this._DataType = "FreeTextQuestion";
                _this._Type = "FreeTextQuestionControl";
                return _this;
            }
            FreeTextQuestionControl.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                // Donnée associée
                var data = new Models.Data();
                data.AttributeCode = this.AttributeCode;
                data.AttributeRank = this.AttributeRank;
                data.DataControlId = this._Id;
                data.ControlName = this._FriendlyName;
                data.Description = null;
                data.Intake = this.Intake;
                data.Group = this._FriendlyName;
                data.ProductCode = this.ProductCode;
                data.ProductRank = this.ProductRank;
                data.Replicate = this.Replicate;
                data.Session = this.UploadId;
                data.SubjectCode = this.SubjectCode;
                data.Type = "FreeTextQuestion";
                this.ListData = [];
                this.ListData.push(data);
                var self = this;
                //this.answerBox = new Label("<span></span>");
                this.answerBox = new Label("");
                this.answerBox._Width = this._Width;
                this.answerBox._BorderThickness = 1;
                this.answerBox._BorderBrush = "black";
                this.answerBox.VerticalAlignment = "top";
                this.answerBox.AcceptReturn = this._AcceptReturn;
                if (editMode == true) {
                    this.answerBox.IsEditable = false;
                }
                else {
                    this.answerBox.IsEditable = true;
                    this.answerBox.OnChanged = function (x) {
                        self.validate();
                    };
                    this.OnSpeechRecognized = function (text) {
                        var canAdd = true;
                        if (self.CanRecord == false) {
                            return;
                        }
                        //Mots non autorisés
                        var words = text.split(' ');
                        words.forEach(function (w) {
                            if (self._ExcludedWords.indexOf(w) > -1) {
                                canAdd = false;
                            }
                        });
                        if (canAdd == true) {
                            self.answerBox.SetText(self.answerBox.GetText() + "\n" + text);
                            self.validate();
                        }
                    };
                }
                this.answerBox.Render(editMode, ratio);
                //if (editMode == false) {
                //    this.answerBox.HtmlElement.contentEditable = "true";
                //}
                this.HtmlElement.appendChild(this.answerBox.HtmlElement);
                setTimeout(function () {
                    self.resize();
                    //if (editMode == false) {
                    //    self.answerBox.SetText(" ");
                    //    self.answerBox.HtmlElement.focus();
                    //    Framework.Selection.SetCaretPosition(self.answerBox.HtmlElement, 0);
                    //    self.answerBox.SetText("");
                    //}
                }, 50);
                if (this._AcceptReturn == true) {
                    this.answerBox.HtmlElement.style.overflowY = "auto";
                }
                else {
                    this.answerBox.HtmlElement.style.overflowY = "hidden";
                }
                this.answerBox.HtmlElement.style.display = "block";
                this.answerBox.SetBorder(this._AnswerBorderWidth, this._AnswerBorderColor);
                this.answerBox.SetBorderBackground(this._AnswerBackground);
                this.answerBox.HtmlElement.children[0].style.padding = "5px";
                this.answerBox.HtmlElement.children[0].style.fontFamily = this._AnswerFontFamily;
                this.answerBox.HtmlElement.children[0].style.fontSize = this._AnswerFontSize * ratio + "px";
                this.answerBox.HtmlElement.children[0].style.color = this._AnswerFontColor;
                if (this._HasRecordButton == true && SpeechToText.IsCompatible() == true) {
                    this.CanRecord = false;
                    var btn_1 = Framework.Form.Button.Create(function () {
                        return true;
                    }, function (b) {
                        self.CanRecord = !self.CanRecord;
                        if (self.CanRecord == true) {
                            b.HtmlElement.innerHTML = '<i class="fas fa-microphone-alt" style="font-size:40px"></i>';
                        }
                        else {
                            b.HtmlElement.innerHTML = '<i class="fas fa-microphone-slash" style="font-size:40px"></i>';
                        }
                        btn_1.CheckState();
                    }, '<i class="fas fa-microphone-alt-slash" style="font-size:40px"></i>', []);
                    btn_1.HtmlElement.style.position = "absolute";
                    btn_1.HtmlElement.style.right = "0";
                    btn_1.HtmlElement.style.bottom = "0";
                    btn_1.HtmlElement.style.height = "64px";
                    btn_1.HtmlElement.style.width = "80px";
                    btn_1.HtmlElement.style.background = "transparent";
                    btn_1.HtmlElement.style.border = "0";
                    this.HtmlElement.appendChild(btn_1.HtmlElement);
                    if (editMode == true) {
                        btn_1.Disable();
                    }
                }
                if (editMode == false) {
                    this.validate();
                }
            };
            FreeTextQuestionControl.prototype.GetValue = function () {
                return [this.ListData[0].Description];
            };
            FreeTextQuestionControl.prototype.resize = function () {
                _super.prototype.resize.call(this);
                //let labelHeight = ((this.Label.HtmlElement.clientHeight)+10) * this.Ratio;
                var labelHeight = ((this.Label.HtmlElement.clientHeight));
                if (this._LabelPosition == "Top") {
                    var answerHeight = (this._Height - this.Label.HtmlElement.clientHeight - this._LabelMarginBottom) * this.Ratio;
                    this.answerBox.HtmlElement.style.height = answerHeight + "px";
                    this.answerBox.HtmlElement.style.maxHeight = answerHeight + "px";
                    //this.answerBox.HtmlElement.style.maxHeight = this._AnswerMaxHeight + "px";
                    this.answerBox.HtmlElement.firstChild.style.height = answerHeight - 10 + "px";
                    this.answerBox.HtmlElement.style.top = (labelHeight + this._LabelMarginBottom * this.Ratio) + "px";
                    this.answerBox.HtmlElement.style.width = (this._Width - this._AnswerMarginLeft - this._AnswerMarginRight) * this.Ratio + "px";
                    this.answerBox.HtmlElement.style.left = (this._AnswerMarginLeft) / this.Ratio + "px";
                }
                if (this._LabelPosition == "Left") {
                    this.Label.HtmlElement.style.width = (this._LabelWidth) * this.Ratio + "px";
                    this.Label.HtmlElement.style.maxWidth = (this._LabelWidth) * this.Ratio + "px";
                    //this.label.Update();
                    //TODO : contenu pas resizé
                    var answerHeight = this._Height * this.Ratio;
                    this.answerBox.HtmlElement.style.height = answerHeight + "px";
                    this.answerBox.HtmlElement.style.maxHeight = answerHeight + "px";
                    //this.answerBox.HtmlElement.style.maxHeight = this._AnswerMaxHeight + "px";
                    //(<HTMLElement>this.answerBox.HtmlElement.firstChild).style.height = answerHeight - 10 + "px";
                    this.answerBox.HtmlElement.style.top = "0";
                    this.answerBox.HtmlElement.style.width = (this._Width - this._AnswerMarginLeft - this._AnswerMarginRight - this._LabelWidth) * this.Ratio + "px";
                    this.answerBox.HtmlElement.style.left = (this._AnswerMarginLeft + this._LabelWidth) / this.Ratio + "px";
                }
            };
            FreeTextQuestionControl.prototype.validate = function () {
                if (this._CustomMask != "") {
                    //'^[0-7]'
                    var reg = new RegExp(this._CustomMask);
                    if (reg.test(this.answerBox.GetTextWithoutFormat()) == true) {
                        this.ValidationMessage = "";
                    }
                    else {
                        this.ValidationMessage = Framework.LocalizationManager.Get("InvalidInput");
                    }
                }
                else {
                    this.ValidationMessage = Framework.Form.Validator.Validate(this._Mask, this.answerBox.GetTextWithoutFormat());
                }
                this.IsValid = this.ValidationMessage == "";
                if (this.IsValid == false && this._CustomErrorMessage != "") {
                    this.ValidationMessage = this._CustomErrorMessage + "\n";
                }
                this.answerBox.HtmlElement.title = this.ValidationMessage;
                if (this.ValidationMessage != "") {
                    this.answerBox.SetBorder(this._AnswerBorderWidth, this._AnswerBorderColorWithError);
                    return;
                }
                else {
                    this.answerBox.SetBorder(this._AnswerBorderWidth, this._AnswerBorderColor);
                    this.answerBox.HtmlElement.style.borderWidth = "1px";
                }
                this.ListData[0].QuestionLabel = this.Label.GetTextWithoutFormat();
                this.ListData[0].Description = this.answerBox.GetTextWithoutFormat();
                this.ListData[0].RecordedDate = new Date(Date.now());
            };
            FreeTextQuestionControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "creation" || mode == "edition") {
                    //TODO : autres masques de saisie
                    var formSetMask = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "Mask", self._Mask, Framework.Form.Validator.ValidatorEnum, function (x) {
                        self.changeProperty("_Mask", x);
                    });
                    properties.push(formSetMask);
                    var formCustomMask = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "CustomMask", self._CustomMask, function (x) { self.changeProperty("_CustomMask", x); });
                    properties.push(formCustomMask);
                }
                if (mode == "edition") {
                    var formSetAnswerBorderWidth = Framework.Form.PropertyEditorWithNumericUpDown.Render("AnswerDesign", "BorderThickness", self._AnswerBorderWidth, 0, 10, function (x) {
                        self.changeProperty("_AnswerBorderWidth", x);
                        self.answerBox.SetBorder(self._AnswerBorderWidth, self._AnswerBorderColor);
                    });
                    properties.push(formSetAnswerBorderWidth);
                    var formSetAnswerBorderColor = Framework.Form.PropertyEditorWithColorPopup.Render("AnswerDesign", "BorderColor", self._AnswerBorderColor, function (x) {
                        self.changeProperty("_AnswerBorderColor", x);
                        self.answerBox.SetBorder(self._AnswerBorderWidth, self._AnswerBorderColor);
                    });
                    properties.push(formSetAnswerBorderColor);
                    var formSetAnswerBorderColorWithError = Framework.Form.PropertyEditorWithColorPopup.Render("AnswerDesign", "BorderColorWithError", self._AnswerBorderColorWithError, function (x) {
                        self.changeProperty("_AnswerBorderColorWithError", x);
                    });
                    properties.push(formSetAnswerBorderColorWithError);
                    var formSetAnswerBackgroundColor = Framework.Form.PropertyEditorWithColorPopup.Render("AnswerDesign", "BackgroundColor", self._AnswerBackground, function (x) {
                        self.changeProperty("_AnswerBackground", x);
                        self.answerBox.SetBorderBackground(self._AnswerBackground);
                    });
                    properties.push(formSetAnswerBackgroundColor);
                    var fonts = Framework.InlineHTMLEditor.FontNameEnum.map(function (x) { return x; });
                    var formSetAnswerFontFamily = Framework.Form.PropertyEditorWithPopup.Render("AnswerDesign", "FontFamily", self._AnswerFontFamily, fonts, function (x) {
                        self.changeProperty("_AnswerFontFamily", x);
                    });
                    properties.push(formSetAnswerFontFamily);
                    var formSetAnswerFontSize = Framework.Form.PropertyEditorWithPopup.Render("AnswerDesign", "FontSize", self._AnswerFontSize.toString(), Framework.InlineHTMLEditor.FontSizeEnum, function (x) {
                        self.changeProperty("_AnswerFontSize", Number(x));
                    });
                    properties.push(formSetAnswerFontSize);
                    var formSetAnswerFontColor = Framework.Form.PropertyEditorWithColorPopup.Render("AnswerDesign", "FontColor", self._AnswerFontColor, function (x) {
                        self.changeProperty("_AnswerFontColor", x);
                    });
                    properties.push(formSetAnswerFontColor);
                    var formSetAnswerMarginLeft = Framework.Form.PropertyEditorWithNumericUpDown.Render("AnswerDesign", "MarginLeft", self._AnswerMarginLeft, 0, 300, function (x) {
                        self.changeProperty("_AnswerMarginLeft", x);
                        self.resize();
                    });
                    properties.push(formSetAnswerMarginLeft);
                    var formSetAnswerMarginRight = Framework.Form.PropertyEditorWithNumericUpDown.Render("AnswerDesign", "MarginRight", self._AnswerMarginRight, 0, 300, function (x) {
                        self.changeProperty("_AnswerMarginRight", x);
                        self.resize();
                    });
                    properties.push(formSetAnswerMarginRight);
                    // TODO : saisie sous forme de tableau
                    if (Models.Screen.HasSpeechToText(this.screen) == true) {
                        var formSetExcludedWords = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "ExcludedWords", self._ExcludedWords.join(', '), function (x) {
                            self.changeProperty("_ExcludedWords", x.replace(' ', '').split(','));
                        });
                        properties.push(formSetExcludedWords);
                        var formHasRecordButton = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "RecordButton", self._HasRecordButton, function (x) {
                            self.changeProperty("_HasRecordButton", x);
                        });
                        properties.push(formHasRecordButton);
                    }
                    var formAcceptReturn = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "AcceptReturn", self._AcceptReturn, function (x) {
                        self.changeProperty("_AcceptReturn", x);
                    });
                    properties.push(formAcceptReturn);
                }
                return properties;
            };
            FreeTextQuestionControl.Create = function () {
                var control = new FreeTextQuestionControl();
                control._LabelContent = Framework.LocalizationManager.Get("EnterQuestionLabel");
                control._Height = 200;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                return control;
            };
            FreeTextQuestionControl.prototype.SetStyle = function (style) {
                if (style === void 0) { style = {}; }
                if (style) {
                    _super.prototype.SetStyle.call(this, style);
                    //let div = document.createElement("div");
                    //div.innerHTML = this._LabelContent;
                    //let text = div.innerText;
                    //this._LabelContent = '<p style="font-size:' + style["FontSize"] + 'px; font-family:' + style["FontFamily"] + '; color:' + style["FontColor"] + '">' + text + '</p>';
                    ////this._AnswerFontSize = style["FontSize"];
                    //this.changeProperty("_AnswerFontSize", style["FontSize"]);
                    ////this._AnswerFontFamily = style["FontFamily"];
                    //this.changeProperty("_AnswerFontFamily", style["FontFamily"]);
                    ////this._AnswerFontColor = style["FontColor"];
                    //this.changeProperty("_AnswerFontColor", style["FontColor"]);
                    ////this._AnswerBorderColor = style["FontColor"];
                    //this.changeProperty("_AnswerBorderColor", style["FontColor"]);
                    //this.updateControl();
                }
            };
            return FreeTextQuestionControl;
        }(BaseQuestionControl));
        Controls.FreeTextQuestionControl = FreeTextQuestionControl;
        var CheckboxQuestionControl = /** @class */ (function (_super) {
            __extends(CheckboxQuestionControl, _super);
            function CheckboxQuestionControl() {
                var _this = _super.call(this) || this;
                _this._MaxNumberOfAnswers = 1;
                _this._MinNumberOfAnswers = 0;
                _this._CheckboxSize = 20;
                //TODO : style par checkbox
                _this._CheckboxBorderWidth = 1; //TODO
                _this._CheckboxBorderColor = "black"; //TODO
                _this._CheckboxBackground = "transparent"; //TODO
                _this._MarginLeft = 0;
                _this._MarginRight = 0;
                _this._MarginBetweenCheckboxAndLabel = 10;
                _this._MarginBetweenCheckboxes = 10;
                _this._RandomizeAnswers = false;
                _this._AddFreeText = false;
                //TODO : choix ajout options autre avec texte libre
                //TODO : renvoie vers ancre
                _this._LabelPosition = "Right";
                _this._DataType = "CheckboxQuestion";
                _this._Type = "CheckboxQuestionControl";
                return _this;
            }
            CheckboxQuestionControl.prototype.Render = function (editMode, ratio) {
                var _this = this;
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                this.ListData = [];
                this.div = document.createElement("div");
                this.div.style.position = "relative";
                this.HtmlElement.appendChild(this.div);
                //TODO : overflow
                var self = this;
                if (this._RandomizeAnswers == true) {
                    Framework.Array.Shuffle(this._ListAnswers);
                }
                var top = 0;
                this._ListAnswers.forEach(function (kvp) {
                    // Données associées
                    var data = new Models.Data();
                    data.AttributeCode = self.AttributeCode;
                    data.AttributeRank = self.AttributeRank;
                    data.DataControlId = self._Id;
                    data.ControlName = self._FriendlyName;
                    data.Description = kvp.Key;
                    data.Score = 0; // 1 si case cochée, 0 si non cochée
                    data.QuestionLabel = _this.Label.GetTextWithoutFormat();
                    data.Group = self._FriendlyName;
                    data.ProductCode = self.ProductCode;
                    data.ProductRank = self.ProductRank;
                    data.Intake = self.Intake;
                    data.Replicate = self.Replicate;
                    data.Session = self.UploadId;
                    data.SubjectCode = self.SubjectCode;
                    data.Type = "MultipleAnswersQuestion"; //TODO    
                    data.RecordedDate = new Date(Date.now());
                    self.ListData.push(data);
                    // Case à cocher avec label
                    var control = new CustomCheckBox();
                    control._BorderThickness = self._CheckboxBorderWidth;
                    control._BorderBrush = self._CheckboxBorderColor;
                    control._Background = self._CheckboxBackground;
                    var label = new Label(kvp.Value);
                    //label.IsEditable = editMode;
                    label._FontSize = self._FontSize;
                    //label._FontSize = Math.max(self._FontSize * ratio, 18);
                    label._FontFamily = self._FontFamily;
                    label._Height = self._CheckboxSize;
                    label._Width = self._Width - self._CheckboxSize - self._MarginBetweenCheckboxAndLabel - self._MarginLeft - self._MarginRight - 10; //TODO                    
                    control._Width = self._CheckboxSize;
                    control._Height = self._CheckboxSize;
                    control.AttributeCode = kvp.Key;
                    control.CanUncheck = true;
                    if (editMode == false) {
                        control.OnClick = function () {
                            if (self.IsEnabled == false) {
                                return;
                            }
                            var currentCheckBox = this;
                            // Enregistrement
                            var d = self.ListData.filter(function (x) { return (x.Description == currentCheckBox.AttributeCode); });
                            if (d.length > 0) {
                                d[0].RecordedDate = new Date(Date.now());
                                if (currentCheckBox.IsChecked == true) {
                                    d[0].Score = 1;
                                }
                                else {
                                    d[0].Score = 0;
                                }
                            }
                            self.onDataChanged(d[0]);
                            // Validation
                            self.validate();
                        };
                    }
                    ;
                    var controlWithLabel = new ControlWithLabel(control, self._CheckboxSize, self._Width, label, self._LabelPosition, "Horizontal", self._MarginBetweenCheckboxAndLabel);
                    controlWithLabel._Left = Number(self.div.style.left.replace("px", ""));
                    controlWithLabel._Top = top;
                    //if (editMode == true) {
                    //controlWithLabel.OnClick = (x) => {
                    //    //TODO : sélection de la case à cocher pour mise en forme
                    //    x.HtmlElement.classList.add("selectedControlInsideAdorner");
                    //    //self.selectedItemCode = x.HtmlElement.getAttribute("code");
                    //}
                    //controlWithLabel.OnLabelChanged = (x, sender) => {
                    //    let key = sender.HtmlElement.getAttribute("code");
                    //    self._ListAnswers.filter((a) => { return a.Key == key })[0].Value = x;
                    //}
                    //}
                    controlWithLabel.Render(editMode, ratio);
                    controlWithLabel.HtmlElement.style.position = "relative";
                    label.HtmlElement.setAttribute("code", kvp.Key);
                    _this.div.appendChild(controlWithLabel.HtmlElement);
                    top += controlWithLabel._Height + self._MarginBetweenCheckboxes;
                });
                if (editMode == false) {
                    //TODO
                    //this.OnSpeechRecognized = (text: string) => {
                    //    self.listButtons.forEach((b) => {
                    //        //if (b._VocalTrigger.length > 0 && text.toLowerCase().indexOf(b._VocalTrigger.toLowerCase()) > -1) {                                
                    //        if (b._VocalTrigger.length > 0 && Framework.WordComparer.ContainsWithSoundex(b._VocalTrigger, text, Framework.LocalizationManager.GetDisplayLanguage())) {
                    //            self.clickOnCustomButton(b, 1);
                    //        }
                    //    });
                    //}
                }
                //if (self._AddFreeText == true) {
                //    // Données associées
                //    var data: Models.Data = new Models.Data();
                //    data.AttributeCode = self.AttributeCode;
                //    data.AttributeRank = self.AttributeRank;
                //    data.DataControlId = self._Id;
                //    data.Description = "";
                //    data.Score = 0; // 1 si case cochée, 0 si non cochée
                //    data.QuestionLabel = this.label.GetTextWithoutFormat();
                //    data.Group = self._AkaName;
                //    data.ProductCode = self.ProductCode;
                //    data.ProductRank = self.ProductRank;
                //    data.Replicate = self.Replicate;
                //    data.Session = self.UploadId;
                //    data.SubjectCode = self.SubjectCode;
                //    data.Type = "CheckboxQuestion";
                //    self.ListData.push(data);
                //    // Case à cocher avec label
                //    var control: CustomCheckBox = new CustomCheckBox();
                //    control._BorderThickness = self._CheckboxBorderWidth;
                //    control._BorderBrush = Framework.Color.ColorFromString(self._CheckboxBorderColor, false);
                //    control._Background = Framework.Color.ColorFromString(self._CheckboxBackground, false);
                //    var label: Label = new Label(Framework.LocalizationManager.Get("Other"));
                //    label.IsEditable = editMode;
                //    label._Height = self._CheckboxSize;
                //    label._Width = self._Width - self._CheckboxSize - self._MarginBetweenCheckboxAndLabel - self._MarginLeft - self._MarginRight - 10;//TODO                    
                //    control._Width = self._CheckboxSize;
                //    control._Height = self._CheckboxSize;                    
                //    control.CanUncheck = true;
                //    if (editMode == false) {
                //        control.OnClick = function () {
                //            if (self.IsEnabled == false) {
                //                return;
                //            }
                //            var currentCheckBox = <CustomCheckBox>this;
                //            // Enregistrement
                //            var d: Models.Data[] = self.ListData.filter((x) => { return (x.Description == currentCheckBox.AttributeCode); });
                //            if (d.length > 0) {
                //                d[0].RecordedDate = new Date(Date.now());
                //                if (currentCheckBox.IsChecked == true) {
                //                    d[0].Score = 1;
                //                }
                //                else {
                //                    d[0].Score = 0;
                //                }
                //            }
                //            self.onDataChanged(d[0]);
                //            // Validation
                //            self.validate();
                //        }
                //    };
                //    //this.listCheckboxes.push(control);
                //    let controlWithLabel: ControlWithLabel = new ControlWithLabel(control, self._CheckboxSize, self._Width, label, self._LabelPosition, "Horizontal", self._MarginBetweenCheckboxAndLabel);
                //    controlWithLabel._Left = Number(self.div.style.left.replace("px", ""));
                //    controlWithLabel._Top = top;
                //    if (editMode == true) {
                //        controlWithLabel.OnClick = (x) => {
                //            //TODO : sélection de la case à cocher pour mise en forme
                //            x.HtmlElement.classList.add("selectedControlInsideAdorner");
                //            //self.selectedItemCode = x.HtmlElement.getAttribute("code");
                //        }
                //        controlWithLabel.OnLabelChanged = (x, sender) => {
                //            let key = sender.HtmlElement.getAttribute("code");
                //            self._ListAnswers.filter((a) => { return a.Key == key })[0].Value = x;
                //        }
                //    }
                //    controlWithLabel.Render(editMode);
                //    controlWithLabel.HtmlElement.style.position = "relative";
                //    label.HtmlElement.setAttribute("code", kvp.Key);
                //    this.div.appendChild(controlWithLabel.HtmlElement);
                //    top += controlWithLabel._Height + self._MarginBetweenCheckboxes;
                //}
                //this.answerBox = new Label("");
                //this.answerBox._Width = this._Width;
                //this.answerBox._BorderThickness = 1;
                //this.answerBox._BorderBrush = Framework.Color.ColorFromString("black", true);
                //this.answerBox.VerticalAlignment = "top";
                //if (editMode == true) {
                //    this.answerBox.IsEditable = false;
                //} else {
                //    this.answerBox.IsEditable = true;
                //    this.answerBox.OnChanged = (x) => {
                //        self.validate();
                //    };
                //    this.OnSpeechRecognized = (text: string) => {
                //        self.answerBox.SetText(self.answerBox.GetText() + "\n" + text);
                //        self.validate();
                //    }
                //}
                setTimeout(function () {
                    self.resize();
                }, 200);
                //this.answerBox.HtmlElement.style.overflowY = "auto";
                //this.answerBox.HtmlElement.style.display = "block";
                //this.answerBox.SetBorder(this._AnswerBorderWidth, this._AnswerBorderColor);
                //this.answerBox.SetBorderBackground(this._AnswerBackground);
                //(<HTMLElement>this.answerBox.HtmlElement.children[0]).style.padding = "5px";
                //(<HTMLElement>this.answerBox.HtmlElement.children[0]).style.fontFamily = this._AnswerFontFamily;
                //(<HTMLElement>this.answerBox.HtmlElement.children[0]).style.fontSize = this._AnswerFontSize + "px";
                //(<HTMLElement>this.answerBox.HtmlElement.children[0]).style.color = this._AnswerFontColor;
                if (editMode == false) {
                    this.validate();
                }
            };
            CheckboxQuestionControl.prototype.resize = function () {
                _super.prototype.resize.call(this);
                var labelHeight = this.Label.HtmlElement.clientHeight;
                var answerHeight = this._Height - labelHeight - this._LabelMarginBottom;
                this.div.style.height = answerHeight + "px";
                this.div.style.maxHeight = answerHeight + "px";
                this.div.style.top = (labelHeight + this._LabelMarginBottom) + "px";
                this.div.style.width = (this._Width - this._MarginLeft - this._MarginRight) + "px";
                this.div.style.left = (this._MarginLeft) + "px";
                //let answerHeight = (this._Height - labelHeight - this._LabelMarginBottom) * this.Ratio;
                //this.div.style.height = answerHeight + "px";
                //this.div.style.maxHeight = answerHeight + "px";
                //this.div.style.top = (labelHeight + this._LabelMarginBottom * this.Ratio) + "px";
                //this.div.style.width = (this._Width - this._MarginLeft - this._MarginRight) * this.Ratio + "px";
                //this.div.style.left = (this._MarginLeft) * this.Ratio + "px";
            };
            CheckboxQuestionControl.prototype.GetValue = function () {
                return this.ListData.filter(function (x) { return x.Score == 1; }).map(function (x) { return x.Description; });
            };
            CheckboxQuestionControl.prototype.validate = function () {
                this.ValidationMessage = "";
                var answers = this.ListData.filter(function (x) { return x.Score == 1; });
                if (answers.length < this._MinNumberOfAnswers) {
                    this.ValidationMessage = Framework.LocalizationManager.Get("MinNumberOfAnswers") + this._MinNumberOfAnswers + "\n";
                }
                if (answers.length > this._MaxNumberOfAnswers) {
                    this.ValidationMessage = Framework.LocalizationManager.Get("MaxNumberOfAnswers") + this._MaxNumberOfAnswers + "\n";
                }
                this.IsValid = this.ValidationMessage == "";
                if (this.IsValid == false && this._CustomErrorMessage != "") {
                    this.ValidationMessage = this._CustomErrorMessage + "\n";
                }
                this.div.title = this.ValidationMessage;
                if (this.ValidationMessage != "") {
                    //    this.answerBox.SetBorder(this._AnswerBorderWidth, this._AnswerBorderColorWithError);                    
                    return;
                }
                else {
                    //    this.answerBox.SetBorder(this._AnswerBorderWidth, this._AnswerBorderColor);
                    //    this.answerBox.HtmlElement.style.borderWidth = "1px";                    
                }
            };
            CheckboxQuestionControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "creation" || mode == "edition") {
                    var formSetListAnswers = Framework.Form.PropertyEditorWithButton.Render("Parameters", "ListAnswers", Framework.LocalizationManager.Get("ClickToEdit"), function () {
                        self.ShowListAnswers();
                    });
                    properties.push(formSetListAnswers);
                    //TODO : contrôler min/max
                    var formSetMinNumberOfAnswers = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MinNumberOfAnswers", self._MinNumberOfAnswers, 0, 10, function (x) {
                        self.changeProperty("_MinNumberOfAnswers", x);
                    });
                    properties.push(formSetMinNumberOfAnswers);
                    var formSetMaxNumberOfAnswers = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MaxNumberOfAnswers", self._MaxNumberOfAnswers, 1, self._ListAnswers.length, function (x) {
                        self.changeProperty("_MaxNumberOfAnswers", x);
                    });
                    properties.push(formSetMaxNumberOfAnswers);
                    var formSetRandomizeAnswers = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "RandomizeAnswers", self._RandomizeAnswers, function (x) {
                        self.changeProperty("_RandomizeAnswers", x);
                    });
                    properties.push(formSetRandomizeAnswers);
                    //TODO
                    //let formSetAddFreeText = Framework.Form.PropertyEditor.RenderWithToggle("AddFreeText", self._AddFreeText, (x) => {
                    //    self._AddFreeText = x;
                    //    self.updateControl();
                    //});
                    //properties.push(formSetAddFreeText.Editor.HtmlElement);
                }
                if (mode == "edition") {
                    var formSetChexboxSize = Framework.Form.PropertyEditorWithNumericUpDown.Render("AnswerDesign", "CheckBoxSize", self._CheckboxSize, 10, 100, function (x) {
                        self.changeProperty("_CheckboxSize", x);
                        self.updateControl();
                    });
                    properties.push(formSetChexboxSize);
                    var formSetAnswerMarginLeft = Framework.Form.PropertyEditorWithNumericUpDown.Render("AnswerDesign", "MarginLeft", self._MarginLeft, 0, 300, function (x) {
                        self.changeProperty("_MarginLeft", x);
                        self.resize();
                    });
                    properties.push(formSetAnswerMarginLeft);
                    var formSetAnswerMarginRight = Framework.Form.PropertyEditorWithNumericUpDown.Render("AnswerDesign", "MarginRight", self._MarginRight, 0, 300, function (x) {
                        self.changeProperty("_MarginRight", x);
                        self.resize();
                    });
                    properties.push(formSetAnswerMarginRight);
                    var formSetMarginBetweenCheckboxAndLabel = Framework.Form.PropertyEditorWithNumericUpDown.Render("AnswerDesign", "MarginBetweenCheckboxAndLabel", self._MarginBetweenCheckboxAndLabel, 0, 300, function (x) {
                        self.changeProperty("_MarginBetweenCheckboxAndLabel", x);
                        self.updateControl();
                    });
                    properties.push(formSetMarginBetweenCheckboxAndLabel);
                    var formSetMarginBetweenCheckboxes = Framework.Form.PropertyEditorWithNumericUpDown.Render("AnswerDesign", "MarginBetweenCheckboxes", self._MarginBetweenCheckboxes, 0, 300, function (x) {
                        self.changeProperty("_MarginBetweenCheckboxes", x);
                        self.updateControl();
                    });
                    properties.push(formSetMarginBetweenCheckboxes);
                    var formSetLabelPosition = Framework.Form.PropertyEditorWithPopup.Render("AnswerDesign", "LabelPosition", self._LabelPosition, CheckboxQuestionControl.LabelPositionEnum, function (x) {
                        self.changeProperty("_LabelPosition", x);
                        self.updateControl();
                    });
                    properties.push(formSetLabelPosition);
                    var formSetCheckboxBorderWidth = Framework.Form.PropertyEditorWithNumericUpDown.Render("AnswerDesign", "BorderThickness", self._CheckboxBorderWidth, 1, 10, function (x) {
                        self.changeProperty("_CheckboxBorderWidth", x);
                        self.updateControl();
                    });
                    properties.push(formSetCheckboxBorderWidth);
                    var formSetCheckboxBorderColor = Framework.Form.PropertyEditorWithColorPopup.Render("AnswerDesign", "BorderColor", self._CheckboxBorderColor, function (x) {
                        self.changeProperty("_CheckboxBorderColor", x);
                        self.updateControl();
                    });
                    properties.push(formSetCheckboxBorderColor);
                    var formSetCheckboxBackgroundColor = Framework.Form.PropertyEditorWithColorPopup.Render("AnswerDesign", "BackgroundColor", self._CheckboxBackground, function (x) {
                        self.changeProperty("_CheckboxBackground", x);
                        self.updateControl();
                    });
                    properties.push(formSetCheckboxBackgroundColor);
                }
                return properties;
            };
            CheckboxQuestionControl.Create = function () {
                var control = new CheckboxQuestionControl();
                control._LabelContent = Framework.LocalizationManager.Get("EnterQuestionLabel");
                control._Height = 600;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                return control;
            };
            CheckboxQuestionControl.prototype.SetStyle = function (style) {
                if (style === void 0) { style = {}; }
                if (style) {
                    _super.prototype.SetStyle.call(this, style);
                    ////this._CheckboxBackground = style["FontColor"];
                    //this.changeProperty("_CheckboxBackground", style["FontColor"]);
                    ////this._CheckboxBorderColor = style["FontColor"];
                    //this.changeProperty("_CheckboxBorderColor", style["FontColor"]);
                    //this._ListAnswers.forEach((x) => {
                    //    x.Value = '<p style="font-size:' + style["FontSize"] + 'px; font-family:' + style["FontFamily"] + '; color:' + style["FontColor"] + '">' + x.Value + '</p>';
                    //});
                    //let div = document.createElement("div");
                    //div.innerHTML = this._LabelContent;
                    //let text = div.innerText;
                    //this._LabelContent = '<p style="font-size:' + style["FontSize"] + 'px; font-family:' + style["FontFamily"] + '; color:' + style["FontColor"] + '">' + text + '</p>';
                    //this.updateControl();
                }
            };
            CheckboxQuestionControl.LabelPositionEnum = ["Left", "Right"];
            return CheckboxQuestionControl;
        }(BaseQuestionControl));
        Controls.CheckboxQuestionControl = CheckboxQuestionControl;
        var ComboboxQuestionControl = /** @class */ (function (_super) {
            __extends(ComboboxQuestionControl, _super);
            function ComboboxQuestionControl() {
                var _this = _super.call(this) || this;
                _this._AnswerBorderWidth = 1;
                _this._AnswerBorderColor = "black";
                _this._AnswerBorderColorWithError = "red";
                _this._AnswerBackground = "transparent";
                _this._AnswerFontFamily = "Calibri";
                _this._AnswerFontSize = 30;
                _this._AnswerFontColor = "black";
                _this._AnswerMarginLeft = 0;
                _this._AnswerMarginRight = 0;
                _this._DefaultText = Framework.LocalizationManager.Get("ClickToSelect");
                _this._PreciseAnswer = "";
                _this._PreciseAnswerText = Framework.LocalizationManager.Get("EnterText");
                _this._ExcludedWords = [];
                _this._RandomizeAnswers = false;
                _this._AddFreeText = false;
                _this._IsImperative = false;
                _this._ListAnswersMode = "";
                _this._DataType = "ComboboxQuestion";
                _this._Type = "ComboboxQuestionControl";
                return _this;
            }
            ComboboxQuestionControl.prototype.Render = function (editMode, ratio) {
                var _this = this;
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                // Donnée associée
                var data = new Models.Data();
                data.AttributeCode = this.AttributeCode;
                data.AttributeRank = this.AttributeRank;
                data.DataControlId = this._Id;
                data.ControlName = this._FriendlyName;
                data.Description = null;
                data.Group = this._FriendlyName;
                data.ProductCode = this.ProductCode;
                data.ProductRank = this.ProductRank;
                data.Intake = this.Intake;
                data.Replicate = this.Replicate;
                data.Session = this.UploadId;
                data.SubjectCode = this.SubjectCode;
                data.Type = "SingleAnswerQuestion";
                data.RecordedDate = new Date(Date.now());
                this.ListData = [];
                this.ListData.push(data);
                var self = this;
                this.answerBox = document.createElement("select");
                this.answerBox.style.width = this._Width * this.Ratio + "px";
                this.answerBox.style.position = "absolute";
                //this.answerBox.style.borderWidth = "1px";
                //this.answerBox.style.borderColor = "black";
                this.answerBox.style.verticalAlign = "top";
                if (editMode == true) {
                    this.answerBox.disabled = true;
                }
                else {
                    var option = document.createElement("option");
                    option.text = this._DefaultText;
                    option.value = "";
                    option.style.fontFamily = this._AnswerFontFamily;
                    option.style.fontSize = this._AnswerFontSize * this.Ratio + "px";
                    option.style.color = this._AnswerFontColor;
                    option.style.fontStyle = "italic";
                    option.selected = true;
                    option.disabled = true;
                    this.answerBox.appendChild(option);
                    var listAnswers_1 = this._ListAnswers;
                    if (this._ExperimentalDesignId > 0 && this.Items.length > 0) {
                        listAnswers_1 = [];
                        this.Items.forEach(function (x) {
                            listAnswers_1.push(new Framework.KeyValuePair(x.Code, x.Label));
                        });
                    }
                    //this._ListAnswers.forEach((x) => {
                    listAnswers_1.forEach(function (x) {
                        var option = document.createElement("option");
                        option.text = x.Value;
                        option.value = x.Key;
                        option.style.fontFamily = _this._AnswerFontFamily;
                        option.style.fontSize = _this._AnswerFontSize * _this.Ratio + "px";
                        option.style.color = _this._AnswerFontColor;
                        _this.answerBox.appendChild(option);
                    });
                    this.answerBox.onchange = function (x) {
                        self.validate();
                    };
                    //TODO
                    //this.OnSpeechRecognized = (text: string) => {
                    //    let canAdd: boolean = true;
                    //    //Mots non autorisés
                    //    let words = text.split(' ');
                    //    words.forEach((w) => {
                    //        if (self._ExcludedWords.indexOf(w) > -1) {
                    //            canAdd = false;
                    //        }
                    //    });
                    //    if (canAdd == true) {
                    //        self.answerBox.SetText(self.answerBox.GetText() + "\n" + text);
                    //        self.validate();
                    //    }
                    //}
                }
                this.HtmlElement.appendChild(this.answerBox);
                setTimeout(function () {
                    self.resize();
                }, 200);
                this.answerBox.style.overflowY = "auto";
                this.answerBox.style.display = "block";
                this.answerBox.style.borderWidth = this._AnswerBorderWidth + "px";
                this.answerBox.style.borderColor = this._AnswerBorderColor;
                this.answerBox.style.backgroundColor = this._AnswerBackground;
                this.answerBox.style.padding = "5px";
                this.answerBox.style.fontFamily = this._AnswerFontFamily;
                this.answerBox.style.fontSize = this._AnswerFontSize * this.Ratio + "px";
                this.answerBox.style.color = this._AnswerFontColor;
                if (editMode == false) {
                    this.validate();
                }
            };
            ComboboxQuestionControl.prototype.GetValue = function () {
                return [this.ListData[0].Description];
            };
            ComboboxQuestionControl.prototype.resize = function () {
                _super.prototype.resize.call(this);
                var labelHeight = this.Label.HtmlElement.clientHeight;
                var answerHeight = (this._Height - labelHeight - this._LabelMarginBottom) * this.Ratio;
                this.answerBox.style.height = answerHeight + "px";
                this.answerBox.style.maxHeight = answerHeight + "px";
                //this.answerBox.style.maxHeight = this._AnswerMaxHeight + "px";
                this.answerBox.style.top = (labelHeight + this._LabelMarginBottom * this.Ratio) + "px";
                this.answerBox.style.width = (this._Width - this._AnswerMarginLeft - this._AnswerMarginRight) * this.Ratio + "px";
                this.answerBox.style.left = (this._AnswerMarginLeft) * this.Ratio + "px";
            };
            ComboboxQuestionControl.prototype.validate = function () {
                var self = this;
                if (this._IsImperative == true) {
                    this.ValidationMessage = Framework.Form.Validator.IsNotEmpty(this.answerBox.value);
                    this.IsValid = this.ValidationMessage == "";
                    if (this.IsValid == false && this._CustomErrorMessage != "") {
                        this.ValidationMessage = this._CustomErrorMessage + "\n";
                    }
                    this.answerBox.title = this.ValidationMessage;
                    if (this.ValidationMessage != "") {
                        this.answerBox.style.borderColor = this._AnswerBorderColorWithError;
                        return;
                    }
                    else {
                        this.answerBox.style.borderColor = this._AnswerBorderColor;
                    }
                }
                this.ListData[0].QuestionLabel = this.Label.GetTextWithoutFormat();
                this.ListData[0].Description = this.answerBox.value;
                this.ListData[0].RecordedDate = new Date(Date.now());
                var l = this._ListAnswers.filter(function (x) { return x.Key == self._PreciseAnswer; });
                if (l.length > 0) {
                    var val = l[0].Key;
                    if (this.answerBox.value == val) {
                        var text_1 = Framework.Form.InputText.Create("", function (txt, send) {
                            self.ListData[0].Description = txt;
                            btn_2.CheckState();
                        });
                        text_1.HtmlElement.style.width = "100%";
                        var btn_2 = Framework.Form.Button.Create(function () { return text_1.Value != ""; }, function () { mw_1.Close(); }, "OK", ["btn", "btn-primary"]);
                        var mw_1 = new Framework.Modal.CustomModal(text_1.HtmlElement, self._PreciseAnswerText, [btn_2]);
                        mw_1.show();
                    }
                }
            };
            ComboboxQuestionControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (self.showCreationProperties && (mode == "creation" || mode == "edition")) {
                    var formSetListAnswersMode = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "ListAnswersMode", self._ListAnswersMode, ["ExperimentalDesign", "List"], function (x) {
                        self._ListAnswersMode = x;
                        validateFormSetExperimentalDesignFormProperty_2();
                    });
                    properties.push(formSetListAnswersMode);
                    var validateFormSetExperimentalDesignFormProperty_2 = function () {
                        var text = Framework.LocalizationManager.Get("None");
                        var designs = self.ListExperimentalDesigns.filter(function (x) { return x.Id == self._ExperimentalDesignId; });
                        if (designs.length > 0) {
                            text = designs[0].Name;
                        }
                        formSetExperimentalDesignFormProperty_2.SetLabelForPropertyValue(text);
                        formSetExperimentalDesignFormProperty_2.ValidationResult = "";
                        if (self._ListAnswersMode == "") {
                            formSetExperimentalDesignFormProperty_2.ValidationResult = Framework.LocalizationManager.Get("SelectListAnswersMode");
                        }
                        if (self._ListAnswersMode == "ExperimentalDesign") {
                            if (self._ExperimentalDesignId <= 0) {
                                formSetExperimentalDesignFormProperty_2.ValidationResult = Framework.LocalizationManager.Get("SelectExperimentalDesign");
                            }
                            formSetExperimentalDesignFormProperty_2.Editor.Show();
                        }
                        else {
                            formSetExperimentalDesignFormProperty_2.Editor.Hide();
                        }
                        if (self._ListAnswersMode == "List") {
                            formSetListAnswers_1.Editor.Show();
                            formSetRandomizeAnswers_1.Editor.Show();
                        }
                        else {
                            formSetListAnswers_1.Editor.Hide();
                            formSetRandomizeAnswers_1.Editor.Hide();
                        }
                        //formSetExperimentalDesignFormProperty.Check();
                    };
                    var formSetListAnswers_1 = Framework.Form.PropertyEditorWithButton.Render("Parameters", "ListAnswers", Framework.LocalizationManager.Get("ClickToEdit"), function () {
                        self.ShowListAnswers();
                    });
                    var formSetRandomizeAnswers_1 = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "RandomizeAnswers", self._RandomizeAnswers, function (x) {
                        self.changeProperty("_RandomizeAnswers", x);
                    });
                    var formSetExperimentalDesignFormProperty_2 = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "ExperimentalDesign", "", this.ListExperimentalDesigns.map(function (x) { return x.Name; }), function (x, btn) {
                        self.SetExperimentalDesign(self.ListExperimentalDesigns.filter(function (y) { return y.Name == x; })[0]);
                        validateFormSetExperimentalDesignFormProperty_2();
                    });
                    var formSetDefaultText = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "DefaultText", self._DefaultText, function (x) {
                        self.changeProperty("_DefaultText", x);
                    }, Framework.Form.Validator.NoValidation());
                    properties.push(formSetDefaultText);
                    var formSetImperative = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "IsImperative", self._IsImperative, function (x) {
                        self.changeProperty("_IsImperative", x);
                    });
                    validateFormSetExperimentalDesignFormProperty_2();
                    properties.push(formSetExperimentalDesignFormProperty_2);
                    properties.push(formSetListAnswers_1);
                    properties.push(formSetRandomizeAnswers_1);
                    properties.push(formSetImperative);
                }
                if (mode == "edition") {
                    var formSetPrecise = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "PreciseAnswer", self._PreciseAnswer, function (x) {
                        self.changeProperty("_PreciseAnswer", x);
                        if (self._PreciseAnswer != "") {
                            formSetPreciseText_1.Editor.Show();
                        }
                        else {
                            formSetPreciseText_1.Editor.Hide();
                        }
                    }, Framework.Form.Validator.NoValidation());
                    properties.push(formSetPrecise);
                    var formSetPreciseText_1 = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "PreciseAnswerText", self._PreciseAnswerText, function (x) {
                        self.changeProperty("_PreciseAnswerText", x);
                    }, Framework.Form.Validator.NoValidation());
                    properties.push(formSetPreciseText_1);
                    if (self._PreciseAnswer != "") {
                        formSetPreciseText_1.Editor.Show();
                    }
                    else {
                        formSetPreciseText_1.Editor.Hide();
                    }
                    var formSetAnswerBorderWidth = Framework.Form.PropertyEditorWithNumericUpDown.Render("AnswerDesign", "BorderThickness", self._AnswerBorderWidth, 0, 10, function (x) {
                        self.changeProperty("_AnswerBorderWidth", x);
                        self.updateControl();
                        //self.answerBox.SetBorder(self._AnswerBorderWidth, self._AnswerBorderColor);
                    });
                    properties.push(formSetAnswerBorderWidth);
                    var formSetAnswerBorderColor = Framework.Form.PropertyEditorWithColorPopup.Render("AnswerDesign", "BorderColor", self._AnswerBorderColor, function (x) {
                        self.changeProperty("_AnswerBorderColor", x);
                        self.updateControl();
                        //self.answerBox.SetBorder(self._AnswerBorderWidth, self._AnswerBorderColor);
                    });
                    properties.push(formSetAnswerBorderColor);
                    var formSetAnswerBorderColorWithError = Framework.Form.PropertyEditorWithColorPopup.Render("AnswerDesign", "BorderColorWithError", self._AnswerBorderColorWithError, function (x) {
                        self.changeProperty("_AnswerBorderColorWithError", x);
                    });
                    properties.push(formSetAnswerBorderColorWithError);
                    var formSetAnswerBackgroundColor = Framework.Form.PropertyEditorWithColorPopup.Render("AnswerDesign", "BackgroundColor", self._AnswerBackground, function (x) {
                        self.changeProperty("_AnswerBackground", x);
                        self.updateControl();
                        //self.answerBox.SetBorderBackground(self._AnswerBackground);
                    });
                    properties.push(formSetAnswerBackgroundColor);
                    var fonts = Framework.InlineHTMLEditor.FontNameEnum.map(function (x) { return x; });
                    var formSetAnswerFontFamily = Framework.Form.PropertyEditorWithPopup.Render("AnswerDesign", "FontFamily", self._AnswerFontFamily, fonts, function (x) {
                        self.changeProperty("_AnswerFontFamily", x);
                    });
                    properties.push(formSetAnswerFontFamily);
                    var formSetAnswerFontSize = Framework.Form.PropertyEditorWithPopup.Render("AnswerDesign", "FontSize", self._AnswerFontSize.toString(), Framework.InlineHTMLEditor.FontSizeEnum, function (x) {
                        self.changeProperty("_AnswerFontSize", Number(x));
                    });
                    properties.push(formSetAnswerFontSize);
                    var formSetAnswerFontColor = Framework.Form.PropertyEditorWithColorPopup.Render("AnswerDesign", "FontColor", self._AnswerFontColor, function (x) {
                        self.changeProperty("_AnswerFontColor", x);
                    });
                    properties.push(formSetAnswerFontColor);
                    var formSetAnswerMarginLeft = Framework.Form.PropertyEditorWithNumericUpDown.Render("AnswerDesign", "MarginLeft", self._AnswerMarginLeft, 0, 300, function (x) {
                        self.changeProperty("_AnswerMarginLeft", x);
                        self.resize();
                    });
                    properties.push(formSetAnswerMarginLeft);
                    var formSetAnswerMarginRight = Framework.Form.PropertyEditorWithNumericUpDown.Render("AnswerDesign", "MarginRight", self._AnswerMarginRight, 0, 300, function (x) {
                        self.changeProperty("_AnswerMarginRight", x);
                        self.resize();
                    });
                    properties.push(formSetAnswerMarginRight);
                    // TODO : saisie sous forme de tableau
                    //if (Models.Screen.HasSpeechToText(this.screen) == true) {
                    //    let formSetExcludedWords = Framework.Form.PropertyEditor.RenderWithTextInput("Parameters", "ExcludedWords", self._ExcludedWords.join(', '), (x) => {
                    //        self.BeforePropertyChanged("_ExcludedWords", self._ExcludedWords);
                    //        self._ExcludedWords = x.replace(' ', '').split(',');
                    //    });
                    //    properties.push(formSetExcludedWords.Editor.HtmlElement);
                    //}
                }
                return properties;
            };
            ComboboxQuestionControl.Create = function () {
                var control = new ComboboxQuestionControl();
                control._LabelContent = Framework.LocalizationManager.Get("EnterQuestionLabel");
                control._Height = 200;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                return control;
            };
            ComboboxQuestionControl.prototype.SetStyle = function (style) {
                if (style === void 0) { style = {}; }
                if (style) {
                    _super.prototype.SetStyle.call(this, style);
                    //let div = document.createElement("div");
                    //div.innerHTML = this._LabelContent;
                    //let text = div.innerText;
                    //this._LabelContent = '<p style="font-size:' + style["FontSize"] + 'px; font-family:' + style["FontFamily"] + '; color:' + style["FontColor"] + '">' + text + '</p>';
                    ////this._AnswerFontSize = style["FontSize"];
                    ////this._AnswerFontFamily = style["FontFamily"];
                    ////this._AnswerFontColor = style["FontColor"];
                    ////this._AnswerBorderColor = style["FontColor"];
                    //this.changeProperty("_AnswerFontSize", style["FontSize"]);
                    //this.changeProperty("_AnswerFontFamily", style["FontFamily"]);
                    //this.changeProperty("_AnswerFontColor", style["FontColor"]);
                    //this.changeProperty("_AnswerBorderColor", style["FontColor"]);
                    //this.updateControl();
                }
            };
            return ComboboxQuestionControl;
        }(BaseQuestionControl));
        Controls.ComboboxQuestionControl = ComboboxQuestionControl;
        var SampleCodeChecker = /** @class */ (function (_super) {
            __extends(SampleCodeChecker, _super);
            function SampleCodeChecker() {
                var _this = _super.call(this) || this;
                _this._Type = "SampleCodeChecker";
                _this.showCreationProperties = false;
                return _this;
            }
            SampleCodeChecker.prototype.SetExpectedSampleLabel = function (label) {
                this.expectedSampleLabel = label;
            };
            SampleCodeChecker.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                this._ListAnswers = [];
                var self = this;
                if (this.ExperimentalDesign) {
                    this.ExperimentalDesign.ListItems.forEach(function (x) {
                        var item = Framework.Factory.CreateFrom(Models.ExperimentalDesignItem, x);
                        item.GetLabels().forEach(function (label) {
                            self._ListAnswers.push(new Framework.KeyValuePair(label, label));
                        });
                    });
                }
                _super.prototype.Render.call(this, editMode, ratio);
            };
            SampleCodeChecker.prototype.validate = function () {
                var answers = this.ListData.filter(function (x) { return x.Score == 1; });
                this.ValidationMessage = "";
                if (answers.length != 1) {
                    this.ValidationMessage = Framework.LocalizationManager.Get("ExpectedAnswer") + "\n";
                }
                else if (answers[0].Description != this.expectedSampleLabel) {
                    this.ValidationMessage = Framework.LocalizationManager.Get("WrongSample") + "\n";
                }
                this.IsValid = this.ValidationMessage == "";
                if (this.ValidationMessage != "") {
                    //    this.answerBox.SetBorder(this._AnswerBorderWidth, this._AnswerBorderColorWithError);                    
                    return;
                }
                else {
                    //    this.answerBox.SetBorder(this._AnswerBorderWidth, this._AnswerBorderColor);
                    //    this.answerBox.HtmlElement.style.borderWidth = "1px";                    
                }
            };
            SampleCodeChecker.Create = function () {
                var control = new SampleCodeChecker();
                control._LabelContent = Framework.LocalizationManager.Get("EnterSampleLabel");
                control._Height = 200;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                return control;
            };
            SampleCodeChecker.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                return properties;
            };
            return SampleCodeChecker;
        }(ComboboxQuestionControl));
        Controls.SampleCodeChecker = SampleCodeChecker;
        var SampleCodeInput = /** @class */ (function (_super) {
            __extends(SampleCodeInput, _super);
            function SampleCodeInput() {
                var _this = _super.call(this) || this;
                _this.ListAnswers = undefined;
                _this._AddRep = false;
                _this._Type = "SampleCodeInput";
                _this.showCreationProperties = false;
                _this.ProductCode = "";
                _this.AttributeCode = "";
                _this._AcceptReturn = false;
                return _this;
            }
            SampleCodeInput.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                //this.HtmlElement.onkeydown = (ev) => {
                //    if (Number(ev.char)) {
                //        return true;
                //    } else {
                //        ev.preventDefault();
                //    }
                //}            
            };
            SampleCodeInput.prototype.SetExpectedAnswers = function () {
                this.ListAnswers = [];
                var self = this;
                if (this.ExperimentalDesign) {
                    this.ExperimentalDesign.ListItems.forEach(function (x) {
                        var item = Framework.Factory.CreateFrom(Models.ExperimentalDesignItem, x);
                        var rep = 1;
                        item.GetLabels().forEach(function (label) {
                            self.ListAnswers.push({ Code: item.Code, Label: label, Replicate: rep });
                            rep++;
                        });
                    });
                }
            };
            SampleCodeInput.prototype.validate = function () {
                _super.prototype.validate.call(this);
                var answer = this.ListData[0].Description;
                this.ValidationMessage = "";
                if (answer == null || answer.length == 0) {
                    this.ValidationMessage = Framework.LocalizationManager.Get("ExpectedAnswer") + "\n";
                }
                else {
                    var exist = this.ListAnswers.filter(function (x) { return x.Label == answer; }).length > 0;
                    if (exist == false) {
                        this.ValidationMessage = Framework.LocalizationManager.Get("WrongSampleCode") + "\n";
                    }
                }
                this.IsValid = this.ValidationMessage == "";
                if (this.ValidationMessage != "") {
                    //    this.answerBox.SetBorder(this._AnswerBorderWidth, this._AnswerBorderColorWithError);                    
                    return;
                }
                else {
                    //    this.answerBox.SetBorder(this._AnswerBorderWidth, this._AnswerBorderColor);
                    //    this.answerBox.HtmlElement.style.borderWidth = "1px";                    
                }
            };
            SampleCodeInput.Create = function () {
                var control = new SampleCodeInput();
                control._LabelContent = Framework.LocalizationManager.Get("EnterSampleLabel");
                control._Height = 200;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                return control;
            };
            SampleCodeInput.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                var formAddRep = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "AddRep", self._AddRep, function (x) {
                    self.changeProperty("_AddRep", x);
                });
                properties.push(formAddRep);
                return properties;
            };
            return SampleCodeInput;
        }(FreeTextQuestionControl));
        Controls.SampleCodeInput = SampleCodeInput;
        // Obsolète, gardé pour compatibilité SL
        //export class QuestionControl extends DataControl {
        //    //TODO : reprendre, récupérer valeur existante
        //    public _QuestionType: string = "";
        //    private dictionary: string = "";
        //    public _Mask: string = "";
        //    public _CheckBoxAlignment: string = "";
        //    //public LabelAlignment: string;
        //    public _MaxNumberOfAnswers: number = 1;
        //    public _MinNumberOfAnswers: number = 0;
        //    private conditionsCollectionString: string = "";
        //    public _ListConditions: Models.QuestionCondition[] = [];
        //    public _TextAreaId: string = ""; // TODO : supprimer
        //    //public MarginLeft: number;
        //    //public MarginTop: number;
        //    public _RandomizeAnswers: boolean = false;
        //    public _ControlBackground: string;
        //    public _ControlForeground: string;
        //    public _ControlBorderBrush: string;
        //    public _ControlBorderThickness: number;
        //    private pattern: RegExp;
        //    //private questionLabel: string; // Label de la textarea attachée à la question
        //    public _ListAnswers: Framework.KeyValuePair[] = [];
        //    private listCheckbox: CustomCheckBox[] = [];
        //    private textbox: TextBox;
        //    private combobox: ComboBox;
        //    public AttachedLabel: string;
        //    constructor(control: Element = null) {
        //        super(control);
        //        this._DataType = "Question";
        //        this._Type = "QuestionControl";
        //        this._Background = "transparent";
        //        this._ControlBackground = "white";
        //        this._ControlBorderBrush = "black";
        //        this._ControlBorderThickness = 1;
        //        if (control != null) {
        //            //this._QuestionType = this.getPropertyFromXaml<string>(control, "QuestionType", "");
        //            ////this.CheckBoxWidth = getPropertyFromAttribute<number>(control, "CheckBoxWidth", 10);
        //            //this.dictionary = this.getPropertyFromXaml<string>(control, "Dictionary", "");
        //            //this._QuestionMask = this.getPropertyFromXaml<string>(control, "QuestionMask", "");
        //            //this._QuestionCheckBoxAlignment = this.getPropertyFromXaml<string>(control, "QuestionCheckBoxAlignment", ""); //TODO
        //            //this._IsImperative = this.getPropertyFromXaml<boolean>(control, "IsImperative", false);//TODO : remplacer par min/max
        //            //this._IsMultipleChoice = this.getPropertyFromXaml<boolean>(control, "IsMultipleChoice", false);
        //            ////this.LabelAlignment = getPropertyFromAttribute<string>(control, "LabelAlignment", "");
        //            //this._MaxNumberOfAnswers = this.getPropertyFromXaml<number>(control, "MaxNumberOfAnswers", 100);
        //            //this._MinNumberOfAnswers = this.getPropertyFromXaml<number>(control, "MinNumberOfAnswers", 0);
        //            //this.conditionsCollectionString = this.getPropertyFromXaml<string>(control, "ConditionsCollectionString", "");//TODO
        //            //this._TextAreaId = this.getPropertyFromXaml<string>(control, "TextAreaId", "");
        //            //this._RandomizeCheckboxAnswers = this.getPropertyFromXaml<boolean>(control, "RandomizeCheckboxAnswers", false);
        //            ////this.MarginLeft = getPropertyFromAttribute<number>(control, "MarginLeft", 0);
        //            ////this.MarginTop = getPropertyFromAttribute<number>(control, "MarginTop", 0);
        //            this.setPropertyFromXaml(control, "QuestionType", "_QuestionType");
        //            this.setPropertyFromXaml(control, "Dictionary", "dictionary");
        //            this.setPropertyFromXaml(control, "QuestionMask", "_Mask");
        //            this.setPropertyFromXaml(control, "QuestionCheckBoxAlignment", "_CheckBoxAlignment");
        //            //this.setPropertyFromXaml(control, "IsImperative", "_IsImperative");//TODO : remplacer par min/max
        //            //this.setPropertyFromXaml(control, "IsMultipleChoice", "_IsMultipleChoice"); //TODO : remplacer par min/max
        //            this.setPropertyFromXaml(control, "MaxNumberOfAnswers", "_MaxNumberOfAnswers");
        //            this.setPropertyFromXaml(control, "MinNumberOfAnswers", "_MinNumberOfAnswers");
        //            this.setPropertyFromXaml(control, "ConditionsCollectionString", "conditionsCollectionString");
        //            this.setPropertyFromXaml(control, "TextAreaId", "_TextAreaId");
        //            this.setPropertyFromXaml(control, "RandomizeCheckboxAnswers", "_RandomizeAnswers");
        //            this._ControlBorderThickness = this._BorderThickness;
        //            this._ControlBackground = this._Background;
        //            this._ControlForeground = this._Foreground;
        //            this._ControlBorderBrush = this._BorderBrush;
        //            this._Background = "white";
        //            this._BorderBrush = "white";
        //            this._FontSize = this._FontSize * 0.75; // Correspondance silverlight
        //            let imperative = this.getPropertyFromXaml<boolean>(control, "IsImperative", false);
        //            if (imperative == true) {
        //                this._MinNumberOfAnswers = 1;
        //            }
        //            let multipleChoice = this.getPropertyFromXaml<boolean>(control, "IsMultipleChoice", false);
        //            if (multipleChoice == false) {
        //                this._MaxNumberOfAnswers = 1;
        //            }
        //            if (this.conditionsCollectionString.length > 0) {
        //                let tab = this.conditionsCollectionString.split('#');
        //                for (var i = 0; i < tab.length; i++) {
        //                    let condArray = tab[i].split('|');
        //                    if (condArray.length == 3) {
        //                        let cond: Models.QuestionCondition = new Models.QuestionCondition();
        //                        cond.Condition = condArray[0];
        //                        cond.Value = condArray[1];
        //                        cond.AnchorId = condArray[2];
        //                        this._ListConditions.push(cond);
        //                    }
        //                }
        //            }
        //            if (this.dictionary.length > 0) {
        //                // Valeurs autorisées (checkbox, combobox)
        //                var lines: string[] = this.dictionary.split('\n');
        //                for (var i = 0; i < lines.length; i++) {
        //                    var tab: string[] = lines[i].split('|');
        //                    if (tab.length == 2) {
        //                        this._ListAnswers.push(new Framework.KeyValuePair(tab[0], tab[1]));
        //                    }
        //                }
        //            }
        //            // Label de la question
        //            //if (this.TextAreaId != "") {
        //            //    this.questionLabel = this.getAttachedLabel();
        //            //}
        //        }
        //    }
        //    public HasEditableProperties(): boolean {
        //        return true;
        //    }
        //    public GetTextBox(): TextBox {
        //        return this.textbox;
        //    }
        //    public GetComboBox(): ComboBox {
        //        return this.combobox;
        //    }
        //    public getAttachedLabel(controls: TextArea[]): string {
        //        //TODO : trouve pas textarea associée -> non chargée quand l'appel est lancé ?
        //        var txt = "";
        //        //try {
        //        //    txt = (<HTMLElement>document.getElementById(this._TextAreaId).lastChild).innerText;
        //        //} catch (ex) {
        //        //}
        //        //var label = (<HTMLElement>document.getElementById(this._TextAreaId));
        //        let self = this;
        //        //let textarea = controls.filter((x) => { return x._Id.toString() == self._TextAreaId; })
        //        let textarea = controls.filter((x) => { return x._FriendlyName.toString() == self._TextAreaId; })
        //        if (textarea.length > 0) {
        //            let div = document.createElement("div");
        //            div.innerHTML = textarea[0]._HtmlContent;
        //            txt = div.innerText;
        //        }
        //        return txt;
        //    }
        //    public Render(editMode: boolean = false, ratio: number): void {
        //        super.Render(editMode, ratio);
        //        // Ordre aléatoire des réponses
        //        if (this._RandomizeAnswers == true) {
        //            Framework.Array.Shuffle(this._ListAnswers);
        //        }
        //        // Masque de saisie : expression régulière (TextBox)
        //        if (this._Mask != "") {
        //            this.pattern = new RegExp(this._Mask.replace("\\", "\\\\") + "@");
        //        } else {
        //            this.pattern = null;
        //        }
        //        if (this._MinNumberOfAnswers > 0) {
        //            this.IsValid = false;
        //        } else {
        //            this.IsValid = true;
        //        }
        //        var _questionControl = this;
        //        // Donnée associée
        //        var data: Models.Data = new Models.Data();
        //        data.AttributeCode = this.AttributeCode;
        //        data.AttributeRank = this.AttributeRank;
        //        data.DataControlId = this._Id;
        //        data.ControlName = this._FriendlyName;
        //        data.Description = null;
        //        data.Group = this._FriendlyName;
        //        data.ProductCode = this.ProductCode;
        //        data.ProductRank = this.ProductRank;
        //        data.Replicate = this.Replicate;
        //        data.Session = this.UploadId;
        //        data.SubjectCode = this.SubjectCode;
        //        data.QuestionLabel = this.AttachedLabel;
        //        data.Type = "Question";
        //        if (this._QuestionType == "TextBox") {
        //            data.Score = 1;
        //        }
        //        if (this._QuestionType == "CheckBox") {
        //            data.Score = 2;
        //        }
        //        if (this._QuestionType == "ComboBox") {
        //            data.Score = 3;
        //        }
        //        this.ListData.push(data);
        //        switch (this._QuestionType) {
        //            case "TextBox":
        //                //TODO : conditions
        //                var textbox: TextBox = new TextBox("");
        //                this.textbox = textbox;
        //                textbox.Text = "";
        //                textbox._Height = this._Height;
        //                textbox._Width = this._Width;
        //                //textbox._Background = new Framework.Color(0, 255, 255, 255);
        //                textbox._Background = "white";
        //                textbox._BorderBrush = this._ControlBorderBrush;
        //                textbox._BorderThickness = Math.max(1, this._ControlBorderThickness);
        //                textbox._FontFamily = this._FontFamily;
        //                textbox._FontSize = this._FontSize;
        //                textbox._FontStyle = this._FontStyle;
        //                textbox._FontWeight = this._FontWeight;
        //                textbox._Foreground = this._ControlForeground;
        //                textbox.PlaceHolder = "";
        //                if (this._MinNumberOfAnswers > 0) {
        //                    textbox.Required = true;
        //                    _questionControl.ValidationMessage = Framework.LocalizationManager.Get("MandatoryAnswer") + this.AttachedLabel + "\n";
        //                }
        //                textbox.OnInput = function () {
        //                    // Validation
        //                    _questionControl.ValidationMessage = "";
        //                    if (_questionControl._MinNumberOfAnswers > 0) {
        //                        _questionControl.IsValid = textbox.Text.length > 0;
        //                        if (_questionControl.IsValid == false) {
        //                            textbox.HtmlElement.style.border = "1px solid red";    //TODO : rendu pas terrible                           
        //                            _questionControl.ValidationMessage = Framework.LocalizationManager.Get("MandatoryAnswer") + _questionControl.AttachedLabel + "\n";
        //                            return;
        //                        } else {
        //                            // Bordure initiale
        //                            //textbox.HtmlElement.style.borderColor = Framework.Color.RgbToHex(_questionControl._BorderBrush);
        //                            textbox.HtmlElement.style.borderColor = _questionControl._ControlBorderBrush;
        //                            textbox.HtmlElement.style.borderWidth = _questionControl._ControlBorderThickness + "px";
        //                        }
        //                    }
        //                    if (_questionControl.pattern != null) {
        //                        _questionControl.IsValid = _questionControl.pattern.exec(textbox.Text) != null;
        //                        if (_questionControl.IsValid == false) {
        //                            textbox.HtmlElement.style.border = "1px solid red"; //TODO : rendu pas terrible
        //                            _questionControl.ValidationMessage = Framework.LocalizationManager.Get("UnexpectedFormat") + _questionControl.AttachedLabel + "\n"; //TODO : récupérer en fonction du pattern                                
        //                            return;
        //                        } else {
        //                            // Bordure initiale
        //                            //textbox.HtmlElement.style.borderColor = Framework.Color.RgbToHex(_questionControl._BorderBrush);
        //                            textbox.HtmlElement.style.borderColor = _questionControl._ControlBorderBrush;
        //                            textbox.HtmlElement.style.borderWidth = _questionControl._ControlBorderThickness + "px";
        //                        }
        //                    }
        //                    _questionControl.ListData[0].Description = (<TextBox>this).Text;
        //                    _questionControl.ListData[0].RecordedDate = new Date(Date.now());
        //                    _questionControl.onDataChanged(_questionControl.ListData[0]);
        //                };
        //                textbox.Render(editMode, ratio);
        //                this.HtmlElement.appendChild(textbox.HtmlElement);
        //                break;
        //            case "ComboBox":
        //                //TODO : conditions
        //                if (this._ListAnswers.length == 0) {
        //                    break;
        //                }
        //                // Suppression des doublons
        //                let values: Framework.KeyValuePair[] = [];
        //                this._ListAnswers.forEach((kvp) => {
        //                    if (kvp.Key.length > 0 && values.filter((x) => { return x.Key == kvp.Key; }).length == 0) {
        //                        values.push(kvp);
        //                    }
        //                });
        //                var combobox: ComboBox = new ComboBox(values, "", "");
        //                this.combobox = combobox;
        //                combobox._Height = this._Height;
        //                combobox._Width = this._Width;
        //                //combobox.Background = this.Background;
        //                //combobox._Background = new Framework.Color(0, 255, 255, 255);
        //                combobox._Background = "white";
        //                //combobox.BorderBrush = this.BorderBrush;
        //                //combobox._BorderBrush = new Framework.Color(0, 0, 0, 0);
        //                combobox._BorderBrush = "black";
        //                combobox._BorderThickness = 1;
        //                combobox._FontFamily = this._FontFamily;
        //                combobox._FontSize = this._FontSize * 100 / 75;
        //                combobox._FontStyle = this._FontStyle;
        //                combobox._FontWeight = this._FontWeight;
        //                combobox._Foreground = this._ControlForeground;
        //                combobox.SelectedValue = "";
        //                if (this._MinNumberOfAnswers > 0) {
        //                    _questionControl.ValidationMessage = Framework.LocalizationManager.Get("MandatoryAnswer") + this.AttachedLabel + "\r\n";
        //                }
        //                combobox.OnChange = function () {
        //                    // Validation
        //                    _questionControl.ValidationMessage = "";
        //                    if (_questionControl._MinNumberOfAnswers > 0) {
        //                        _questionControl.IsValid = combobox.SelectedValue.length > 0;
        //                        if (_questionControl.IsValid == false) {
        //                            combobox.HtmlElement.style.border = "1px solid red";    //TODO : rendu pas terrible                           
        //                            _questionControl.ValidationMessage = Framework.LocalizationManager.Get("MandatoryAnswer") + _questionControl.AttachedLabel + "\r\n";
        //                            return;
        //                        } else {
        //                            // Bordure initiale
        //                            //combobox.HtmlElement.style.borderColor = Framework.Color.RgbToHex(_questionControl._BorderBrush);
        //                            combobox.HtmlElement.style.borderColor = _questionControl._ControlBorderBrush;
        //                            combobox.HtmlElement.style.borderWidth = _questionControl._ControlBorderThickness + "px";
        //                        }
        //                    }
        //                    _questionControl.ListData[0].Description = (<ComboBox>this).SelectedValue;
        //                    _questionControl.ListData[0].RecordedDate = new Date(Date.now());
        //                    _questionControl.onDataChanged(_questionControl.ListData[0]);
        //                };
        //                combobox.Render(editMode, ratio);
        //                this.HtmlElement.appendChild(combobox.HtmlElement);
        //                break;
        //            case "CheckBox":
        //                //TODO : conditions
        //                if (this._ListAnswers.length == 0) {
        //                    break;
        //                }
        //                if (this._MinNumberOfAnswers > 0) {
        //                    this.IsValid = false;
        //                    this.ValidationMessage = _questionControl.AttachedLabel + " " + Framework.LocalizationManager.Get("MinNumberOfAnswers") + " " + _questionControl._MinNumberOfAnswers + "\n";
        //                } else {
        //                    this.IsValid = true;
        //                    this.ValidationMessage = "";
        //                }
        //                var top = 0;
        //                var left = 0;
        //                var height: number = Framework.Scale.MeasureText(this._ListAnswers[0].Value, this._FontSize, this._FontFamily, this._FontStyle, this._FontWeight).height;
        //                for (var i = 0; i < this._ListAnswers.length; i++) {
        //                    var checkbox: CustomCheckBox = new CustomCheckBox();
        //                    checkbox.CanUncheck = true;
        //                    checkbox._Height = height;
        //                    checkbox._Width = height;
        //                    checkbox._Background = this._ControlBorderBrush;
        //                    checkbox._BorderBrush = this._ControlBorderBrush;
        //                    checkbox._BorderThickness = Math.max(1, this._ControlBorderThickness);
        //                    checkbox.Value = this._ListAnswers[i].Key;
        //                    checkbox._Top = top;
        //                    checkbox.IsValid = true;
        //                    checkbox.OnClick = function () {
        //                        if (_questionControl._MaxNumberOfAnswers == 1) {
        //                            // 1 seul clic autorisé
        //                            if ((<CustomCheckBox>this).IsChecked == true) {
        //                                _questionControl.listCheckbox.forEach((x) => {
        //                                    x.Uncheck();
        //                                });
        //                                (<CustomCheckBox>this).Check();
        //                            }
        //                        }
        //                        // Validation
        //                        _questionControl.ValidationMessage = "";
        //                        _questionControl.IsValid = true;
        //                        var nbChecked = 0;
        //                        _questionControl.listCheckbox.forEach((x) => {
        //                            if (x.IsChecked == true) nbChecked++
        //                        });
        //                        if (nbChecked < _questionControl._MinNumberOfAnswers) {
        //                            _questionControl.IsValid = false;
        //                            _questionControl.ValidationMessage = _questionControl.AttachedLabel + " " + Framework.LocalizationManager.Format("MinNumberOfAnswersF", [_questionControl._MinNumberOfAnswers.toString()]) + "\n";
        //                            return;
        //                        }
        //                        if (_questionControl._MaxNumberOfAnswers != null && nbChecked > _questionControl._MaxNumberOfAnswers) {
        //                            _questionControl.IsValid = false;
        //                            _questionControl.ValidationMessage = _questionControl.AttachedLabel + " " + Framework.LocalizationManager.Format("MaxNumberOfAnswersF", [_questionControl._MaxNumberOfAnswers.toString()]) + "\n";
        //                            return;
        //                        }
        //                        // Enregistrement des données
        //                        var txt: string[] = [];
        //                        _questionControl.listCheckbox.forEach((x) => {
        //                            if (x.IsChecked == true) txt.push(x.Value);
        //                        });
        //                        _questionControl.ListData[0].Description = txt.join('|');
        //                        _questionControl.ListData[0].RecordedDate = new Date(Date.now());
        //                        _questionControl.onDataChanged(_questionControl.ListData[0]);
        //                    };
        //                    var txt: string = this._ListAnswers[i].Value;
        //                    var lb: Label = new Label(txt);
        //                    lb._FontFamily = this._FontFamily;
        //                    lb._FontSize = this._FontSize;
        //                    lb._FontStyle = this._FontStyle;
        //                    lb._FontWeight = this._FontWeight;
        //                    lb._Foreground = this._ControlForeground;
        //                    lb._Height = height;
        //                    let textSize = Framework.Scale.MeasureText(txt, lb._FontSize, lb._FontFamily, lb._FontStyle, lb._FontWeight);
        //                    lb._Width = Math.min(this._Width, textSize.width + 5);
        //                    let coef = Math.max(1, textSize.width / this._Width);
        //                    if (this._CheckBoxAlignment == "Vertical") {
        //                        lb._Left = height + 10;
        //                        lb._Top = top;
        //                        top += coef * height + coef * 15;
        //                    }
        //                    if (this._CheckBoxAlignment == "Horizontal") {
        //                        checkbox._Left = left;
        //                        left += checkbox._Width + 5;
        //                        lb._Left = left;
        //                        left += lb._Width + 5;
        //                        lb._Top = top;
        //                    }
        //                    this.listCheckbox.push(checkbox);
        //                    checkbox.Render(editMode, ratio);
        //                    lb.Render(editMode, ratio);
        //                    this.HtmlElement.appendChild(checkbox.HtmlElement);
        //                    this.HtmlElement.appendChild(lb.HtmlElement);
        //                }
        //                break;
        //        }
        //    }
        //    //TODO : vérifier/améliorer
        //    public VerifyConditions(): string {
        //        // Renvoie l'id de l'ancre qui vérifie la première condition de la liste
        //        if (this.ListData.length > 0) {
        //            let tab: string[] = this.ListData[0].Description.split('|');
        //            for (var i = 0; i < this._ListConditions.length; i++) {
        //                let isVerified: boolean = false;
        //                switch (this._ListConditions[i].Condition) {
        //                    case "Equal":
        //                        isVerified = false;
        //                        // ListValues doit contenir au moins une des valeurs
        //                        for (var j = 0; j < tab.length; j++) {
        //                            if (this._ListConditions[i].Value == tab[j]) {
        //                                isVerified = true;
        //                                break
        //                            }
        //                        }
        //                        break;
        //                    case "Different":
        //                        // ListValues ne doit contenir aucune des valeurs
        //                        isVerified = true;
        //                        for (var j = 0; j < tab.length; j++) {
        //                            if (this._ListConditions[i].Value == tab[j]) {
        //                                isVerified = false;
        //                                break;
        //                            }
        //                        }
        //                        break;
        //                    case "Superior":
        //                        isVerified = false;
        //                        // ListValues doit contenir au moins une des valeurs
        //                        for (var j = 0; j < tab.length; j++) {
        //                            if (Number(tab[j]) == NaN) {
        //                                if (this._ListConditions[i].Value > tab[j]) {
        //                                    isVerified = true;
        //                                    break
        //                                }
        //                            } else {
        //                                if (Number(this._ListConditions[i].Value) > Number(tab[j])) {
        //                                    isVerified = true;
        //                                    break
        //                                }
        //                            }
        //                        }
        //                        break;
        //                    case "Inferior":
        //                        isVerified = false;
        //                        // ListValues doit contenir au moins une des valeurs
        //                        for (var j = 0; j < tab.length; j++) {
        //                            if (Number(tab[j]) == NaN) {
        //                                if (this._ListConditions[i].Value < tab[j]) {
        //                                    isVerified = true;
        //                                    break
        //                                }
        //                            } else {
        //                                if (Number(this._ListConditions[i].Value) < Number(tab[j])) {
        //                                    isVerified = true;
        //                                    break
        //                                }
        //                            }
        //                        }
        //                        break;
        //                    //case "And":
        //                    //    isVerified = true;
        //                    //    for (var j = 0; j < tab.length; j++) {
        //                    //        if (!(this.ListConditions[i].ListValues.indexOf(tab[j]) > -1)) {
        //                    //            isVerified = false;
        //                    //            break;
        //                    //        }
        //                    //    }
        //                    //    break;
        //                    //case "Or":
        //                    //    for (var j = 0; j < tab.length; j++) {
        //                    //        if (this.ListConditions[i].ListValues.indexOf(tab[j]) > -1) {
        //                    //            return (this.ListConditions[i].AnchorId);
        //                    //        }
        //                    //    }
        //                    //    break;
        //                    //case "Superior":
        //                    //case "Inferior":
        //                    //    //TODO
        //                    //    break;
        //                }
        //                if (isVerified == true) {
        //                    return (this._ListConditions[i].AnchorId);
        //                }
        //            }
        //        }
        //        return null;
        //    }
        //}
        //export class QuestionTableControl extends DataControl {
        //    //TODO : reprendre, récupérer valeur existante + tout ce qui est dans questioncontrol
        //    public _HeadColumnWidth: number;
        //    public _HeadRowHeight: number;
        //    public _QuestionDictionary: string;
        //    public _AnswerDictionary: string;
        //    //public QuestionType: string;
        //    //public QuestionMask: boolean;
        //    public _IsImperative: boolean;
        //    public _RandomizeQuestions: boolean;
        //    public _TextAlignment: string;
        //    public _IsMultipleChoice: boolean;
        //    public _MaxNumberOfAnswers: number;
        //    public _MinNumberOfAnswers: number;
        //    public _CheckBoxWidth: number;
        //    public _ShowGrid: boolean;
        //    //public _HeadColumnBackground: Framework.Color;
        //    public _HeadColumnBackground: string;
        //    //public _HeadRowBackground: Framework.Color;
        //    public _HeadRowBackground: string;
        //    private listQuestions: Framework.KeyValuePair[] = [];
        //    private listAnswers: Framework.KeyValuePair[] = [];
        //    private listCheckboxes: CustomCheckBox[] = [];
        //    constructor(control: Element = null) {
        //        super(control);
        //        if (control != null) {
        //            this._HeadColumnWidth = this.getPropertyFromXaml<number>(control, "HeadColumnWidth", 100);
        //            this._HeadRowHeight = this.getPropertyFromXaml<number>(control, "HeadRowHeight", 100);
        //            this._QuestionDictionary = this.getPropertyFromXaml<string>(control, "QuestionDictionary", "");
        //            this._AnswerDictionary = this.getPropertyFromXaml<string>(control, "AnswerDictionary", "");
        //            this._IsImperative = this.getPropertyFromXaml<boolean>(control, "IsImperative", false);// Gardé pour compatibilité
        //            this._RandomizeQuestions = this.getPropertyFromXaml<boolean>(control, "RandomizeQuestions", false);
        //            this._TextAlignment = this.getPropertyFromXaml<string>(control, "TextAlignment", "Left");
        //            this._IsMultipleChoice = this.getPropertyFromXaml<boolean>(control, "IsMultipleChoice", false);
        //            this._MaxNumberOfAnswers = this.getPropertyFromXaml<number>(control, "MaxNumberOfAnswers", 1);
        //            this._MinNumberOfAnswers = this.getPropertyFromXaml<number>(control, "MinNumberOfAnswers", 0);
        //            this._CheckBoxWidth = this.getPropertyFromXaml<number>(control, "CheckBoxWidth", 30);
        //            this._ShowGrid = this.getPropertyFromXaml<boolean>(control, "ShowGrid", false);
        //            //this._HeadColumnBackground = this.getPropertyFromXaml<Framework.Color>(control, "HeadColumnBackground", new Framework.Color(0, 0, 0, 0));
        //            this._HeadColumnBackground = this.getPropertyFromXaml<string>(control, "HeadColumnBackground", "white");
        //            //this._HeadRowBackground = this.getPropertyFromXaml<Framework.Color>(control, "HeadRowBackground", new Framework.Color(0, 0, 0, 0));
        //            this._HeadRowBackground = this.getPropertyFromXaml<string>(control, "HeadRowBackground", "white");
        //            this._FontSize = this.getPropertyFromXaml<number>(control, "FontSize", 16) * 3 / 4; // correspondance SL pixel HTML pixels
        //        }
        //        this._Type = "QuestionControlTable";
        //        this._DataType = "Question";
        //        if (this._QuestionDictionary != null) {
        //            let lines: string[] = this._QuestionDictionary.split('\n');
        //            for (var i = 0; i < lines.length; i++) {
        //                let tab: string[] = lines[i].split('|');
        //                if (tab.length == 2) {
        //                    this.listQuestions.push(new Framework.KeyValuePair(tab[0], tab[1]));
        //                }
        //            }
        //        }
        //        if (this._AnswerDictionary != null) {
        //            let lines: string[] = this._AnswerDictionary.split('\n');
        //            for (var i = 0; i < lines.length; i++) {
        //                let tab: string[] = lines[i].split('|');
        //                if (tab.length == 2) {
        //                    this.listAnswers.push(new Framework.KeyValuePair(tab[0], tab[1]));
        //                }
        //            }
        //        }
        //        // Ordre aléatoire des réponses
        //        if (this._RandomizeQuestions == true) {
        //            Framework.Array.Shuffle(this.listQuestions);
        //        }
        //        if (this._IsImperative == true) {
        //            if (this._MinNumberOfAnswers < 1) {
        //                this._MinNumberOfAnswers = 1;
        //            }
        //            this.IsValid = false;
        //        } else {
        //            this.IsValid = true;
        //        }
        //    }
        //    public Render(editMode: boolean = false, ratio: number): void {
        //        super.Render(editMode, ratio);
        //        // Donnée associée
        //        for (let i = 0; i < this.listQuestions.length; i++) {
        //            var data: Models.Data = new Models.Data();
        //            data.AttributeCode = this.AttributeCode;
        //            data.AttributeRank = this.AttributeRank;
        //            data.DataControlId = this._Id;
        //            data.ControlName = this._FriendlyName;
        //            data.Description = null;
        //            data.Group = this._FriendlyName + "_" + this.listQuestions[i].Key;
        //            data.ProductCode = this.ProductCode;
        //            data.ProductRank = this.ProductRank;
        //            data.Replicate = this.Replicate;
        //            data.Session = this.UploadId;
        //            data.SubjectCode = this.SubjectCode;
        //            data.QuestionLabel = this.listQuestions[i].Value;
        //            data.Type = "Question";
        //            this.ListData.push(data);
        //        }
        //        let table: HTMLTableElement = document.createElement("table");
        //        if (this._ShowGrid == true) {
        //            table.style.border = "1px solid black";
        //        }
        //        table.style.fontFamily = this._FontFamily;
        //        table.style.fontSize = this._FontSize + "px";
        //        //table.style.color = Framework.Color.RgbToHex(this._Foreground);
        //        table.style.color = this._Foreground;
        //        table.style.width = this._Width + "px !important";
        //        table.style.height = this._Height + "px !important";
        //        table.style.overflowY = "auto";
        //        let thead = document.createElement("thead");
        //        //thead.style.background = Framework.Color.RgbToHex(this._HeadColumnBackground);
        //        thead.style.background = this._HeadColumnBackground;
        //        table.appendChild(thead);
        //        let tr1 = document.createElement("tr");
        //        thead.appendChild(tr1);
        //        let th1 = document.createElement("th");
        //        th1.style.width = this._HeadColumnWidth + "px";
        //        th1.style.height = this._HeadRowHeight + "px";
        //        tr1.appendChild(th1);
        //        for (let i = 0; i < this.listAnswers.length; i++) {
        //            let th = document.createElement("th");
        //            th.style.width = this._HeadColumnWidth + "px";
        //            th.style.height = this._HeadRowHeight + "px";
        //            let div2: HTMLDivElement = document.createElement("div");
        //            div2.style.width = this._HeadColumnWidth + "px";
        //            div2.style.height = this._HeadRowHeight + "px";
        //            div2.style.fontSize = this._FontSize + "px";
        //            div2.style.display = "table-cell";
        //            div2.style.verticalAlign = "middle";
        //            div2.innerText = this.listAnswers[i].Value;
        //            th.appendChild(div2);
        //            //th.innerText = this.listAnswers[i].Value;
        //            tr1.appendChild(th);
        //        }
        //        let tbody = document.createElement("tbody");
        //        table.appendChild(tbody);
        //        let tdWidth: number = (this._Width - this._HeadColumnWidth) / this.listAnswers.length;
        //        let self = this;
        //        for (let i = 0; i < this.listQuestions.length; i++) {
        //            let tr = document.createElement("tr");
        //            tbody.appendChild(tr);
        //            let td1 = document.createElement("td");
        //            //td1.style.background = Framework.Color.RgbToHex(this._HeadRowBackground);
        //            td1.style.background = this._HeadRowBackground;
        //            td1.style.width = this._HeadColumnWidth + "px";
        //            let div1: HTMLDivElement = document.createElement("div");
        //            div1.style.width = tdWidth + "px";
        //            div1.style.height = this._HeadRowHeight + "px";
        //            div1.style.fontSize = this._FontSize + "px";
        //            div1.style.display = "table-cell";
        //            div1.style.verticalAlign = "middle";
        //            div1.innerText = this.listQuestions[i].Value;
        //            td1.appendChild(div1);
        //            tr.appendChild(td1);
        //            for (let j = 0; j < this.listAnswers.length; j++) {
        //                let td = document.createElement("td");
        //                td.width = tdWidth + "px";
        //                td.height = this._HeadRowHeight + "px";
        //                td.style.textAlign = "center";
        //                let cb: CustomCheckBox = new CustomCheckBox();
        //                this.listCheckboxes.push(cb);
        //                cb.CanUncheck = true;
        //                cb._Height = this._CheckBoxWidth;
        //                cb._Width = this._CheckBoxWidth;
        //                cb._BorderBrush = this._BorderBrush;
        //                //cb._Background = new Framework.Color(0, 0, 0, 0);
        //                cb._Background = this._BorderBrush;
        //                cb._BorderThickness = 1;
        //                cb.Render(editMode, ratio);
        //                cb.HtmlElement.style.display = "inline-block";
        //                cb.HtmlElement.style.position = "static";
        //                cb._Tag = this._FriendlyName + "_" + this.listQuestions[i].Key;
        //                cb.Value = this.listAnswers[j].Key;
        //                cb.OnClick = function () {
        //                    let c: CustomCheckBox = this;
        //                    let checkboxes = self.listCheckboxes.filter((x) => x._Tag == c._Tag && x != this); // checkboxes associées à la question
        //                    if (self._IsMultipleChoice == false) {
        //                        // 1 seul clic autorisé
        //                        checkboxes.forEach((x) => {
        //                            x.Uncheck();
        //                        });
        //                    }
        //                    // Validation
        //                    self.ValidationMessage = "";
        //                    self.IsValid = true;
        //                    for (let i = 0; i < self.listQuestions.length; i++) {
        //                        var nbChecked = 0;
        //                        let ccheckboxes = self.listCheckboxes.filter((x) => x._Tag == self._FriendlyName + "_" + self.listQuestions[i].Key); // checkboxes associées à la question
        //                        ccheckboxes.forEach((x) => {
        //                            if (x.IsChecked == true) nbChecked++
        //                        });
        //                        if (nbChecked < self._MinNumberOfAnswers) {
        //                            self.IsValid = false;
        //                            self.ValidationMessage = self.listQuestions[i].Value + ": " + Framework.LocalizationManager.Get("MinNumberOfAnswers") + " " + self._MinNumberOfAnswers + "\n";
        //                        }
        //                        if (self._MaxNumberOfAnswers != null && self._MaxNumberOfAnswers != 0 && nbChecked > self._MaxNumberOfAnswers) {
        //                            self.IsValid = false;
        //                            self.ValidationMessage = self.listQuestions[i].Value + ": " + Framework.LocalizationManager.Get("MaxNumberOfAnswers") + " " + self._MaxNumberOfAnswers + "\n";
        //                        }
        //                    }
        //                    // Enregistrement des données
        //                    var txt: string[] = [];
        //                    checkboxes = self.listCheckboxes.filter((x) => x._Tag == c._Tag);
        //                    checkboxes.forEach((x) => {
        //                        if (x.IsChecked == true) txt.push(x.Value);
        //                    });
        //                    self.ListData.filter((x) => x.Group == c._Tag)[0].Description = txt.join('|');
        //                    self.ListData.filter((x) => x.Group == c._Tag)[0].RecordedDate = new Date(Date.now());
        //                    self.onDataChanged(self.ListData.filter((x) => x.Group == c._Tag)[0]);
        //                };
        //                //let div: HTMLDivElement = document.createElement("div");
        //                //div.style.width = tdWidth + "px";
        //                //div.style.height = this.HeadRowHeight + "px";;
        //                //div.appendChild(cb.HtmlElement);
        //                td.appendChild(cb.HtmlElement);
        //                tr.appendChild(td);
        //            }
        //        }
        //        this.HtmlElement.appendChild(table);
        //    }
        //}
        var CustomImage = /** @class */ (function (_super) {
            __extends(CustomImage, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function CustomImage() {
                var _this = _super.call(this) || this;
                _this._Binaries = ""; // Contenu binaire           
                _this._URL = ""; // URL de l'image            
                _this._Source = "None";
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "Binaries", "_Binaries");
                //    this.setPropertyFromXaml(control, "AdaptSize", "_AdaptSize");
                //    this.setPropertyFromXaml(control, "KeepProportion", "_KeepProportion");
                //    this.setPropertyFromXaml(control, "URL", "_URL");
                //    if (this._Binaries.length > 0) {
                //        this._Binaries = "data:image/gif;base64," + this._Binaries;
                //    }
                //}
                _this._Type = "CustomImage";
                return _this;
            }
            CustomImage.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                var validateFormSetSource = function () {
                    if (self._Source == "None") {
                        formSetSource.ValidationResult = Framework.LocalizationManager.Get("SelectSource");
                    }
                    else {
                        formSetSource.ValidationResult = "";
                    }
                    formSetSource.Check();
                };
                var formSetSource = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "Source", self._Source, CustomImage.SourceEnum, function (x, y) {
                    self.changeProperty("_Source", x);
                    if (self._Source == "None") {
                        self._URL = "";
                        self._Binaries = "";
                        self.updateControl();
                    }
                    if (self._Source == "LocalImage") {
                        self._URL = "";
                    }
                    if (self._Source == "ExternalImage") {
                        self._Binaries = "";
                    }
                    validateFormSetSource();
                    formSetBinaries.Check();
                    formSetURL.Check();
                    formSetSource.Check();
                });
                properties.push(formSetSource);
                validateFormSetSource();
                var formSetURL = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "URL", self._URL, function (x) {
                    if (formSetURL.ValidationResult == "") {
                        self.changeProperty("_URL", x);
                    }
                }, Framework.Form.Validator.ImageURL(), function () { return (self._Source == "ExternalImage"); });
                properties.push(formSetURL);
                var validateFormSetBinaries = function () {
                    if (self._Binaries.length > 0) {
                        formSetBinaries.ValidationResult = "";
                    }
                    else {
                        formSetBinaries.ValidationResult = Framework.LocalizationManager.Get("SelectBinaries");
                    }
                    formSetBinaries.Check();
                };
                var formSetBinaries = Framework.Form.PropertyEditorWithButton.Render("Parameters", "Binaries", Framework.LocalizationManager.Get("Browse"), function () {
                    Framework.FileHelper.BrowseBinaries('.png,.jpg', function (binaries) {
                        if (binaries) {
                            self.changeProperty("_Binaries", binaries);
                            self.updateControl();
                        }
                        validateFormSetBinaries();
                    });
                }, function () { return (self._Source == "LocalImage"); });
                properties.push(formSetBinaries);
                validateFormSetBinaries();
                if (mode == "edition") {
                    var formSetOpacity = Framework.Form.PropertyEditorWithNumericUpDown.Render("Design", "Opacity", self._Opacity, 0, 1, function (x) {
                        self.changeProperty("_Opacity", x);
                        self.updateControl();
                    }, 0.05);
                    properties.push(formSetOpacity);
                }
                return properties;
            };
            CustomImage.Create = function () {
                var control = new CustomImage();
                control._Height = 600;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                return control;
            };
            CustomImage.prototype.Render = function (editMode, ratio) {
                _super.prototype.Render.call(this, editMode, ratio);
                this.image = document.createElement("img");
                //if (this._BorderThickness > 0) {
                this.HtmlElement.style.borderWidth = this._BorderThickness + "px";
                this.HtmlElement.style.borderColor = this._BorderBrush;
                this.HtmlElement.style.borderStyle = "solid";
                this.HtmlElement.style.textAlign = "center";
                //}
                if (this._Binaries != undefined && this._Binaries.length > 0) {
                    if (this._Binaries.substr(0, 10) != "data:image") {
                        this._Binaries = "data:image/gif;base64," + this._Binaries;
                    }
                    this.image.src = this._Binaries;
                }
                if (this._URL != undefined && this._URL.length > 0) {
                    this.image.src = this._URL;
                }
                this.image.style.maxWidth = "100%";
                this.image.style.maxHeight = "100%";
                this.image.style.opacity = this._Opacity.toString();
                this.HtmlElement.appendChild(this.image);
            };
            CustomImage.prototype.Resize = function () {
                this._Height = this.image.clientHeight;
                this._Width = this.image.clientWidth;
                this.updateControl();
            };
            CustomImage.prototype.SetBinaries = function (binaries) {
                this._Binaries = binaries;
            };
            CustomImage.SourceEnum = ["None", "LocalImage", "ExternalImage" /*, "Product"*/];
            return CustomImage;
        }(BaseControl));
        Controls.CustomImage = CustomImage;
        var CustomMedia = /** @class */ (function (_super) {
            __extends(CustomMedia, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function CustomMedia() {
                var _this = _super.call(this) || this;
                //TODO : que MP4            
                _this._Binaries = ""; // Contenu binaire
                _this._StartMode = ""; // Mode de déclenchement de la lecture : "PageLoaded", "ClickOnStart", "ClickOnMedia"
                _this._URL = ""; // URL de la vidéo
                _this._Source = "None";
                _this.ytplayer = undefined;
                _this.editMode = false;
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "Binaries", "_Binaries");
                //    this.setPropertyFromXaml(control, "StartMode", "_StartMode");
                //    this.setPropertyFromXaml(control, "URL", "_URL");
                //}
                if (_this._StartMode.length == 0) {
                    _this._StartMode = "PageLoaded";
                }
                if (_this._Binaries.length > 0) {
                    //TODO : marche pas avec certains mp4
                    _this._Source = "LocalVideo";
                    _this._Binaries = 'data:video/mp4;base64,' + _this._Binaries;
                }
                if (_this._URL.length > 0) {
                    _this._Source = "ExternalVideo";
                    if (_this._URL.indexOf("youtube") > -1) {
                        _this._Source = "YouTubeVideo";
                    }
                }
                _this._Type = "CustomMedia";
                return _this;
            }
            CustomMedia.Create = function () {
                var control = new CustomMedia();
                control._Height = 600;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                return control;
            };
            CustomMedia.prototype.SetPlayer = function (player) {
                this.ytplayer = player;
            };
            CustomMedia.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                this.editMode = editMode;
                _super.prototype.Render.call(this, editMode, ratio);
                this.video = document.createElement("video");
                this.video.style.width = "100%";
                this.video.style.height = "auto";
                this.video.style.maxHeight = "100%";
                this.video.controls = false;
                //this.video.poster = "images/video.png";
                this.iframe = document.createElement("iframe");
                this.HtmlElement.innerHTML = "";
                this.HtmlElement.style.border = this._BorderThickness + "px";
                //this.HtmlElement.style.borderColor = Framework.Color.RgbToHex(this._BorderBrush);
                this.HtmlElement.style.borderColor = this._BorderBrush;
                this.HtmlElement.style.borderStyle = "solid";
                //TODO
                //if (this.editMode == true) {
                //    let emptyDiv = document.createElement("div");
                //    emptyDiv.classList.add("emptyVideo");
                //    emptyDiv.style.width = this._Width - 40+ "px";
                //    emptyDiv.style.height = this._Height - 40 + "px";
                //    emptyDiv.style.margin = "20px";
                //    this.HtmlElement.appendChild(emptyDiv);
                //    return;
                //} 
                if (this._Binaries != undefined && this._Binaries.length > 0) {
                    //TODO ?
                    //this.video.src = "data:video/mp4;base64," + this._Binaries; 
                    this.video.src = this._Binaries;
                    //this.isYouTube = false;
                }
                if (this._URL != undefined && this._URL.length > 0) {
                    // Si vidéo youtube
                    //if (this._URL.indexOf("youtube") > -1) {
                    //    this.isYouTube = true;
                    //}
                    //else {
                    this.video.src = this._URL;
                    //    this.isYouTube = false;
                    //}
                }
                if (this._Source == "YouTubeVideo") {
                    if (editMode == false) {
                        this.iframe.width = this._Width + "px";
                        this.iframe.height = this._Height + "px";
                        var urlParts = this._URL.split("/");
                        var id = urlParts[urlParts.length - 1].replace("watch?v=", "");
                        var url = "https://www.youtube.com/embed/" + id + "?rel=0";
                        var _self_1 = this;
                        this.iframe.id = "YTplayer" + Math.random;
                        this.iframe.src = url;
                        this.iframe.src += "&enablejsapi=1&autoplay=0&controls=0&showinfo=0&modestbranding=1&autohide=1";
                        this.iframe.frameBorder = "0";
                        this.HtmlElement.appendChild(this.iframe);
                        this.iframe.onload = function () {
                            _self_1.ytplayer = new YT.Player(_self_1.iframe.id, {
                                events: {
                                    'onStateChange': function (state) {
                                        if (state.data == 2) {
                                            _self_1.ytplayer.playVideo();
                                        }
                                        if (state.data == 3 && _self_1.OnPlay) {
                                            _self_1.StartDate = new Date(Date.now());
                                            _self_1.OnPlay();
                                        }
                                    }
                                }
                            });
                        };
                    }
                }
                else {
                    this.HtmlElement.appendChild(this.video);
                }
                var _video = this;
                if (editMode == false) {
                    if (this._StartMode == "PageLoaded") {
                        //this.iframe.src += "&autoplay=1&controls=0&showinfo=0&modestbranding=1&autohide=1";
                        //TODO : désactiver controles
                        this.Play();
                    }
                    //if (this._StartMode == "ClickOnStart") {
                    //    this.iframe.src += "&autoplay=0&controls=0&showinfo=0&modestbranding=1&autohide=1";
                    //}
                    //if (this.StartMode == "ClickOnStart") {
                    //    // Bouton "Start chronometer"
                    //    this.iframe.src += "&autoplay=0&controls=0";
                    //    //this.iframe.src += "controls=0";
                    //    //this.iframe.style.pointerEvents = "none";
                    //    this.video.controls = false;
                    //}
                    //if (this._StartMode == "ClickOnMedia") {
                    //    this.video.onclick = function () {
                    //        _video.iframe.src += "&modestbranding=1;autohide=1&amp;showinfo=0&amp;controls=0";
                    //        //TODO : désactiver controles
                    //        _video.Play();
                    //    };
                    //}
                }
            };
            CustomMedia.prototype.Play = function () {
                if (this.editMode == false) {
                    this.StartDate == new Date(Date.now());
                    if (this._Source == "YouTubeVideo") {
                        try {
                            this.iframe.src = this.iframe.src.replace("autoplay=0", "autoplay=1"); // Nécessaire en localhost
                            if (this.ytplayer) {
                                this.ytplayer.playVideo();
                            }
                        }
                        catch (ex) {
                        }
                    }
                    else {
                        this.video.play();
                    }
                }
            };
            CustomMedia.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition" || mode == "creation") {
                    var formSetStartMode = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "PlayerStartMode", self._StartMode, CustomMedia.StartModeEnum, function (x, y) {
                        self.changeProperty("_StartMode", x);
                    });
                    properties.push(formSetStartMode);
                    var validateFormSetSource_1 = function () {
                        if (self._Source == "None") {
                            formSetSource_1.ValidationResult = Framework.LocalizationManager.Get("SelectSource");
                        }
                        else {
                            formSetSource_1.ValidationResult = "";
                        }
                        formSetSource_1.Check();
                    };
                    var formSetSource_1 = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "Source", self._Source, CustomMedia.SourceEnum, function (x, y) {
                        self.changeProperty("_Source", x);
                        if (self._Source == "None") {
                            self._URL = "";
                            self._Binaries = "";
                            self.updateControl();
                        }
                        if (self._Source == "LocalVideo") {
                            self._URL = "";
                        }
                        if (self._Source == "ExternalVideo" || self._Source == "YouTubeVideo") {
                            self._Binaries = "";
                        }
                        validateFormSetSource_1();
                        formSetBinaries_1.Check();
                        formSetURL_1.Check();
                        formSetSource_1.Check();
                    });
                    properties.push(formSetSource_1);
                    validateFormSetSource_1();
                    //TODO : check youtube url
                    var formSetURL_1 = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "URL", self._URL, function (x) {
                        if (formSetURL_1.ValidationResult == "") {
                            self.changeProperty("_URL", x);
                        }
                    }, Framework.Form.Validator.URL(), function () { return (self._Source == "ExternalVideo" || self._Source == "YouTubeVideo"); });
                    properties.push(formSetURL_1);
                    var validateFormSetBinaries_1 = function () {
                        if (self._Binaries.length > 0) {
                            formSetBinaries_1.ValidationResult = "";
                        }
                        else {
                            formSetBinaries_1.ValidationResult = Framework.LocalizationManager.Get("SelectBinaries");
                        }
                        formSetBinaries_1.Check();
                    };
                    var formSetBinaries_1 = Framework.Form.PropertyEditorWithButton.Render("Parameters", "Binaries", Framework.LocalizationManager.Get("Browse"), function () {
                        Framework.FileHelper.BrowseBinaries('.mp4', function (binaries) {
                            if (binaries) {
                                self.changeProperty("_Binaries", binaries);
                                self.updateControl();
                            }
                            validateFormSetBinaries_1();
                        });
                    }, function () { return (self._Source == "LocalVideo"); });
                    properties.push(formSetBinaries_1);
                    validateFormSetBinaries_1();
                }
                return properties;
            };
            CustomMedia.SourceEnum = ["None", "LocalVideo", "ExternalVideo", "YouTubeVideo"];
            CustomMedia.StartModeEnum = ["PageLoaded", "ClickOnStart", "ClickOnMedia"];
            return CustomMedia;
        }(BaseControl));
        Controls.CustomMedia = CustomMedia;
        //export class SubjectSummary extends BaseControl {
        //    //TODO : contenu HTML + svg
        //    //TODO : gif animé pendant l'attente
        //    //TODO : enregistrer en image en pdf   
        //    //TODO : refresh automatique
        //    //TODO : send mail on click : passer web service en paramètre
        //    //TODO : tester avec vrai retour html
        //    //TODO : boutons -> svg
        //    //TODO: si non connecté, afficher message
        //    public _CanRefresh: boolean = true;
        //    public _CanPrint: boolean = true;
        //    public _CanSave: boolean = true;
        //    public _CanSend: boolean = true;
        //    public _RFunction: string = "RawData";
        //    public SubjectCode: string;
        //    //public ServerCode: string;
        //    public IsOnLine: boolean;
        //    public OnRScriptStarted: (rScript: string, success: Function, error: Function) => void = undefined;
        //    private zoomIndex: number = 1;
        //    constructor(control: Element = null) {
        //        super(control);
        //        if (control != null) {
        //            this.setPropertyFromXaml(control, "CanRefresh", "_CanRefresh");
        //            this.setPropertyFromXaml(control, "CanPrint", "_CanPrint");
        //            this.setPropertyFromXaml(control, "CanSave", "_CanSave");
        //            this.setPropertyFromXaml(control, "CanSend", "_CanSend");
        //            this.setPropertyFromXaml(control, "RFunction", "_RFunction");
        //        }
        //        this._Type = "SubjectSummary";
        //    }
        //    public Render(editMode: boolean, ratio: number): void {
        //        super.Render(editMode, ratio);
        //        var _subjectSummary = this;
        //        // Défaut : affichage image
        //        var div: HTMLDivElement = document.createElement("div");
        //        div.id = "SubjectSummary";
        //        div.style.height = this._Height + "px";
        //        div.style.width = this._Width + "px";
        //        div.style.overflow = "auto";
        //        //div.style.background = Framework.Color.RgbToHex(this._Background);
        //        div.style.background = this._Background;
        //        div.style.border = "solid";
        //        div.style.borderWidth = this._BorderThickness + "px";
        //        //div.style.borderColor = Framework.Color.RgbToHex(this._BorderBrush);
        //        div.style.borderColor = this._BorderBrush;
        //        this.HtmlElement.appendChild(div);
        //        // Div pour le contenu html
        //        var htmldiv: HTMLDivElement = document.createElement("div");
        //        htmldiv.id = "SubjectSummaryHtml";
        //        htmldiv.style.maxWidth = this._Width + "px";
        //        htmldiv.style.maxHeight = this._Height + "px";
        //        htmldiv.innerHTML = "<div style='margin-top:" + ((this._Height / 2) - 60) + "px'><p><i class='fas fa-chart-pie'></i></p><p>" + Framework.LocalizationManager.Get("DownloadingResults") + "</p><p><img src='images/progressbar.gif'></img></p></div>";
        //        div.appendChild(htmldiv);
        //        // Div pour les boutons
        //        var buttonsDiv: HTMLDivElement = document.createElement("div");
        //        buttonsDiv.style.height = "32px";
        //        buttonsDiv.style.top = this._Top + this._Height + "px";
        //        this.HtmlElement.appendChild(buttonsDiv);
        //        if (this._CanPrint) {
        //            var printdiv: HTMLDivElement = document.createElement("div");
        //            printdiv.title = Framework.LocalizationManager.Get("Print");
        //            printdiv.innerHTML = '<i class="fas fa-print"></i>';
        //            printdiv.onclick = function () {
        //                var restorepage = document.body.innerHTML;
        //                var printcontent = document.getElementById("SubjectSummary").innerHTML;
        //                document.body.innerHTML = printcontent;
        //                window.print();
        //                document.body.innerHTML = restorepage;
        //            };
        //            printdiv.classList.add("subjectsummary_button");
        //            buttonsDiv.appendChild(printdiv);
        //        }
        //        if (this._CanSave) {
        //            var savediv: HTMLDivElement = document.createElement("div");
        //            savediv.title = Framework.LocalizationManager.Get("Save");
        //            savediv.innerHTML = '<i class="fas fa-save"></i>';
        //            savediv.onclick = function () {
        //                saveTextAs(document.getElementById("SubjectSummary").innerHTML, "results.html");
        //            };
        //            savediv.classList.add("subjectsummary_button");
        //            buttonsDiv.appendChild(savediv);
        //        }
        //        if (this._CanRefresh && this.IsOnLine) {
        //            var refreshdiv: HTMLDivElement = document.createElement("div");
        //            refreshdiv.title = Framework.LocalizationManager.Get("Refresh");
        //            refreshdiv.innerHTML = '<i class="fas fa-sync-alt"></i>';
        //            refreshdiv.onclick = function () {
        //                if (_subjectSummary.OnRScriptStarted) {
        //                    _subjectSummary.OnRScriptStarted(script, (response) => { htmldiv.innerHTML = response.d; }, () => { htmldiv.innerHTML = Framework.LocalizationManager.Get("UnexpectedError"); });
        //                }
        //            };
        //            refreshdiv.classList.add("subjectsummary_button");
        //            buttonsDiv.appendChild(refreshdiv);
        //        }
        //        if (this._CanSend && this.IsOnLine) {
        //            var senddiv: HTMLDivElement = document.createElement("div");
        //            senddiv.title = Framework.LocalizationManager.Get("Send");
        //            senddiv.innerHTML = '<i class="fas fa-at"></i>';
        //            senddiv.onclick = function () {
        //                alert("Not implemented.")
        //            };
        //            senddiv.classList.add("subjectsummary_button");
        //            buttonsDiv.appendChild(senddiv);
        //        }
        //        var zoomin: HTMLDivElement = document.createElement("div");
        //        zoomin.title = Framework.LocalizationManager.Get("ZoomIn");
        //        zoomin.innerHTML = '<i class="fas fa-search-plus"></i>';
        //        zoomin.onclick = function () {
        //            _subjectSummary.zoomIndex += 0.1;
        //            htmldiv.style.zoom = _subjectSummary.zoomIndex.toString();
        //        };
        //        zoomin.classList.add("subjectsummary_button");
        //        buttonsDiv.appendChild(zoomin);
        //        var zoomout: HTMLDivElement = document.createElement("div");
        //        zoomout.title = Framework.LocalizationManager.Get("ZoomOut");
        //        zoomout.innerHTML = '<i class="fas fa-search-minus"></i>';
        //        zoomout.onclick = function () {
        //            _subjectSummary.zoomIndex -= 0.1;
        //            htmldiv.style.zoom = _subjectSummary.zoomIndex.toString();
        //        };
        //        zoomout.classList.add("subjectsummary_button");
        //        buttonsDiv.appendChild(zoomout);
        //        //TOFIX
        //        let script: string = "library(TimeSens);\n";
        //        script += "TS_SubjectSummary(functionName='" + this._RFunction + "', subjectCode='" + this.SubjectCode + "', language ='" + Framework.LocalizationManager.GetDisplayLanguage() + "')\n";
        //        if (_subjectSummary.OnRScriptStarted) {
        //            _subjectSummary.OnRScriptStarted(script, (response) => { htmldiv.innerHTML = response.d; }, () => { htmldiv.innerHTML = Framework.LocalizationManager.Get("UnexpectedError"); });
        //        }
        //    }
        //    public GetEditableProperties(mode: string = "edition"): Framework.Form.PropertyEditor[] {
        //        let self = this;
        //        let properties = super.GetEditableProperties(mode);
        //        if (mode == "edition") {
        //            let formSetCanRefresh = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "CanRefresh", self._CanRefresh, (x) => {
        //                self.changeProperty("_CanRefresh", x);
        //            });
        //            properties.push(formSetCanRefresh);
        //            let formSetCanPrint = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "CanPrint", self._CanPrint, (x) => {
        //                self.changeProperty("_CanPrint", x);
        //            });
        //            properties.push(formSetCanPrint);
        //            let formSetCanSave = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "CanSave", self._CanPrint, (x) => {
        //                self.changeProperty("_CanSave", x);
        //            });
        //            properties.push(formSetCanSave);
        //            let formSetCanSend = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "CanSend", self._CanSend, (x) => {
        //                self.changeProperty("_CanSend", x);
        //            });
        //            properties.push(formSetCanSend);
        //        }
        //        if (mode == "edition" || mode == "creation" || mode == "wizard") {
        //            let formSetRFunction = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "RFunction", self._RFunction, SubjectSummary.GetRFunctions(), (x, y) => {
        //                self.changeProperty("_RFunction", x);
        //            });
        //            properties.push(formSetRFunction);
        //        }
        //        return properties;
        //    }
        //    public static GetRFunctions(): string[] {
        //        //TODO : remplir en fonction des types de données disponibless avanr
        //        let functionsEnum = ["RawData"];
        //        return functionsEnum;
        //    }
        //    public static Create(height: number = 600, width: number = 600): SubjectSummary {
        //        let control: SubjectSummary = new SubjectSummary();
        //        control._Height = height;
        //        control._Width = width;
        //        control._BorderThickness = 1;
        //        control.DefaultLeftCoordinate = "Center";
        //        control.DefaultTopCoordinate = "Center";
        //        return control;
        //    }
        //}
        var GroupDescription = /** @class */ (function () {
            function GroupDescription() {
                this.Group = "";
                this.Products = "";
                this.Description = [];
            }
            return GroupDescription;
        }());
        var GroupDescriptionControl = /** @class */ (function (_super) {
            __extends(GroupDescriptionControl, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function GroupDescriptionControl() {
                var _this = _super.call(this) || this;
                _this._CanAddDescription = true; // Possibilité d'ajouter une description
                _this._MinNumberOfTerms = 0; // Nombre de descripteurs minimal
                _this._MaxNumberOfTerms = 10; // Nombre de descripteurs maximal
                _this.ListControlNames = [];
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "CanAddDescription", "_CanAddDescription");
                //    this.setPropertyFromXaml(control, "AssociatedControlId", "_AssociatedControlId");
                //    this.setPropertyFromXaml(control, "MinNumberOfTerms", "_MinNumberOfTerms");
                //    this.setPropertyFromXaml(control, "MaxNumberOfTerms", "_MaxNumberOfTerms");
                //}
                _this._Type = "GroupDescriptionControl";
                _this._EvaluationMode = "Attribute";
                _this.groupDescriptions = [];
                _this.additionalEditableProperties = ["ControlDesign"];
                return _this;
                //this.listAnchors = [];
                //this.addDescriptorButton = undefined;
                //this.showExperimentalDesignProperty = false;
                //this.showAttributeExperimentalDesignProperty = true;
            }
            // Utilisé en test uniquement
            //private listAnchors: HTMLAnchorElement[] = [];
            //private listModalDescriptors: Controls.CustomCheckBox[] = [];
            //private addDescriptorButton: HTMLAnchorElement;
            GroupDescriptionControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition" || mode == "creation") {
                    var validateFormSetControlId_1 = function () {
                        if (self._AssociatedControlId == undefined || self._AssociatedControlId.length == 0) {
                            formSetControlId_1.ValidationResult = Framework.LocalizationManager.Get("EnterSortingControlID");
                        }
                        formSetControlId_1.Check();
                    };
                    if ((self._AssociatedControlId == "" || self._AssociatedControlId == undefined) && self.ListControlNames.length > 0) {
                        self._AssociatedControlId = self.ListControlNames[0];
                    }
                    if (self.ListControlNames.length == 0) {
                        self._AssociatedControlId = "";
                    }
                    var formSetControlId_1 = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "SortingControlID", self._AssociatedControlId, self.ListControlNames, function (x) {
                        self.changeProperty("_AssociatedControlId", x);
                        validateFormSetControlId_1();
                    });
                    properties.push(formSetControlId_1);
                    validateFormSetControlId_1();
                    var formSetMinNumberOfTerms = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MinNumberOfTermsProperty", self._MinNumberOfTerms, 0, this.Items.length, function (x) {
                        self.changeProperty("_MinNumberOfTerms", x);
                    });
                    properties.push(formSetMinNumberOfTerms);
                    var formSetMaxNumberOfTerms = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MaxNumberOfTermsProperty", self._MaxNumberOfTerms, 0, this.Items.length, function (x) {
                        self.changeProperty("_MaxNumberOfTerms", x);
                    });
                    properties.push(formSetMaxNumberOfTerms);
                    var formSetCanAddDescription = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "CanAddDescription", self._CanAddDescription, function (x) {
                        self.changeProperty("_CanAddDescription", x);
                    });
                    properties.push(formSetCanAddDescription);
                }
                return properties;
            };
            GroupDescriptionControl.prototype.validate = function () {
                var self = this;
                this.ValidationMessage = "";
                this.IsValid = true;
                for (var i = 0; i < this.groupDescriptions.length; i++) {
                    if (this.groupDescriptions[i].Description.length > self._MaxNumberOfTerms) {
                        self.IsValid = false;
                        self.ValidationMessage += Framework.LocalizationManager.Format("MaxNumberOfTerms", [self._MaxNumberOfTerms.toString(), this.groupDescriptions[i].Group]) + '\r\n';
                    }
                    if (this.groupDescriptions[i].Description.length < self._MinNumberOfTerms) {
                        self.IsValid = false;
                        self.ValidationMessage += Framework.LocalizationManager.Format("MinNumberOfTerms", [self._MinNumberOfTerms.toString(), this.groupDescriptions[i].Group]) + '\r\n';
                    }
                }
            };
            GroupDescriptionControl.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                var self = this;
                //if (this.ListData.length == 0) {
                //    return;
                //}
                // Liste des groupes            
                this.ListData.forEach(function (x) {
                    var gd = self.groupDescriptions.filter(function (y) { return y.Group == x.Score.toString(); });
                    if (gd.length == 0) {
                        var newGd = new GroupDescription();
                        newGd.Group = x.Score.toString();
                        self.groupDescriptions.push(newGd);
                    }
                });
                self.groupDescriptions.forEach(function (x) {
                    var res = [];
                    self.ListData.filter(function (d) { return d.Group == x.Group; }).forEach(function (z) {
                        res.push(z.ProductCode);
                    });
                    x.Products = res.join(',');
                });
                // Tri par numéro de groupe croissant
                var f = function sortNumber(a, b) {
                    return Number(a.Group) - Number(b.Group);
                };
                self.groupDescriptions.sort(f);
                var dtParameters = new Framework.Form.DataTableParameters();
                dtParameters.ListData = self.groupDescriptions;
                dtParameters.ListColumns = [
                    {
                        data: "Group", title: Framework.LocalizationManager.Get("Group"), render: function (data, type, row) {
                            return data;
                        }
                    },
                    {
                        data: "Products", title: Framework.LocalizationManager.Get("Products"), render: function (data, type, row) {
                            return data;
                        }
                    },
                    {
                        data: "Description", title: Framework.LocalizationManager.Get("Description"), render: function (data, type, row) {
                            if (data.length == 0) {
                                return Framework.LocalizationManager.Get("NoDescription");
                            }
                            return data.join(', ');
                        }
                    }
                ];
                dtParameters.Order = [[0, 'desc']];
                dtParameters.Paging = false;
                dtParameters.Filtering = false;
                dtParameters.Ordering = false;
                if (editMode == false) {
                    dtParameters.OnEditCell = function (propertyName, data) {
                        if (propertyName == "Description") {
                            var div_1 = document.createElement("div");
                            var getAttributeForm_1 = function (attribute) {
                                var pr = Framework.Form.PropertyEditorWithToggle.Render("", attribute.Label, data["Description"].indexOf(attribute.Code) > -1, function (x) {
                                    var arr = data["Description"];
                                    if (arr.length > 0 && arr.indexOf(attribute.Code) > -1) {
                                        self.RemoveDescription(data["Group"], attribute.Code);
                                        ////Framework.Array.Remove(data["Description"], attribute.Code);
                                    }
                                    else {
                                        //arr.push(attribute.Code);
                                        self.AddDescription(data["Group"], attribute.Code);
                                    }
                                });
                                pr.Editor.HtmlElement.classList.add("noDot");
                                return pr;
                            };
                            var getDescriptionForm_1 = function () {
                                var pr = Framework.Form.Button.Create(function () { return true; }, function () {
                                    var input = Framework.Form.InputText.Create("", function () { }, Framework.Form.Validator.MinLength(3), false, ['tableInput']);
                                    Framework.Modal.Confirm(Framework.LocalizationManager.Get("PleaseEnterNewDescriptor"), input.HtmlElement, function () {
                                        if (input.ValidationMessage == "") {
                                            div_1.removeChild(pr.HtmlElement);
                                            var newAttribute = new Models.CodeLabel(input.Value, input.Value);
                                            self.Attributes.push(newAttribute);
                                            var arr = data["Description"];
                                            arr.push(input.Value);
                                            var pr1 = getAttributeForm_1(newAttribute);
                                            div_1.appendChild(pr1.Editor.HtmlElement);
                                            var pr2 = getDescriptionForm_1();
                                            div_1.appendChild(pr2.HtmlElement);
                                        }
                                    });
                                }, Framework.LocalizationManager.Get("Descriptor"), ['tableInput', 'btnEditableProperty', 'editableProperty']);
                                return pr;
                            };
                            // Liste de cases à cocher
                            self.Attributes.forEach(function (attribute) {
                                var pr = getAttributeForm_1(attribute);
                                div_1.appendChild(pr.Editor.HtmlElement);
                            });
                            if (self._CanAddDescription == true) {
                                var pr = getDescriptionForm_1();
                                div_1.appendChild(pr.HtmlElement);
                            }
                            return div_1;
                        }
                    };
                }
                dtParameters.TdHeight = 20;
                var dtTable;
                Framework.Form.DataTable.AppendToDiv(undefined, this._Height + "px", this.HtmlElement, dtParameters, function (dt) {
                    dtTable = dt;
                    dt.SetStyle('td', 'text-align', 'left');
                    dt.SetStyle('td', 'font-weight', self._FontWeight);
                    dt.SetStyle('td', 'font-style', self._FontStyle);
                    dt.SetStyle('td', 'font-size', self._FontSize + "px");
                    dt.SetStyle('td', 'color', self._Foreground);
                    dt.SetStyle('td', 'font-family', self._FontFamily);
                });
                //for (var i = 0; i < this.groupDescriptions.length; i++) {
                //    let group: string = this.groupDescriptions[i].Group;
                //    let p: HTMLParagraphElement = document.createElement("p");
                //    p.style.fontSize = this._FontSize + "px";
                //    let span: HTMLSpanElement = document.createElement("span");
                //    span.style.fontFamily = this._FontFamily;
                //    span.style.fontSize = this._FontSize + "px";
                //    span.style.fontWeight = this._FontWeight;
                //    span.style.fontStyle = this._FontStyle;
                //    span.innerHTML = "Group " + group + ": " + this.GetProductLabels(group) + " - ";
                //    p.appendChild(span);
                //    let span2: HTMLSpanElement = document.createElement("span");
                //    let a: HTMLAnchorElement = document.createElement("a");
                //    a.style.color = "red";
                //    a.style.cursor = "pointer";
                //    a.id = "groupDescription" + group;
                //    a.style.fontFamily = this._FontFamily;
                //    a.style.fontSize = this._FontSize + "px";
                //    a.style.fontWeight = this._FontWeight;
                //    a.style.fontStyle = this._FontStyle;
                //    a.innerHTML = Framework.LocalizationManager.Get("NoDescription");
                //    a.setAttribute("group", group);
                //    a.setAttribute("groupIndex", i.toString());
                //    span2.appendChild(a);
                //    this.listAnchors.push(a);
                //    p.appendChild(span2);
                //    a.onclick = function () {
                //        self.listModalDescriptors = [];
                //        let group = this.getAttribute("group");
                //        let groupIndex: number = Number(this.getAttribute("groupIndex"));
                //        let div: HTMLDivElement = document.createElement("div");
                //        div.style.fontFamily = self._FontFamily;
                //        div.style.fontSize = self._FontSize + "px";
                //        div.style.fontWeight = self._FontWeight;
                //        div.style.fontStyle = self._FontStyle;
                //        div.style.width = "400px";
                //        let div2: HTMLDivElement = document.createElement("div");
                //        div2.style.height = "400px";
                //        div2.style.overflowY = "scroll";
                //        div2.style.border = "1px solid black";
                //        div2.style.margin = "5px";
                //        div2.style.padding = "5px";
                //        // En tête : groupe + produits associés
                //        div.title = "Group " + group + ": " + self.GetProductLabels(group);
                //        var longerLabel: string;
                //        var longerLabelLength: number = 0;
                //        self.Attributes.forEach((x) => { x.Label.length > longerLabelLength ? longerLabel = x.Label : null; });
                //        var measure = Framework.Scale.MeasureText(longerLabel, self._FontSize, self._FontFamily, self._FontStyle, self._FontWeight);
                //        var labelHeight: number = measure.height;
                //        // Liste de cases à cocher
                //        for (var j = 0; j < self.Attributes.length; j++) {
                //            let p: HTMLParagraphElement = document.createElement("p");
                //            let ccb: CustomCheckBox = self.createCheckbox(self.Attributes[j].Code, self.Attributes[j].Label, labelHeight, groupIndex, editMode);
                //            self.listModalDescriptors.push(ccb);
                //            p.appendChild(ccb.HtmlElement);
                //            div2.appendChild(p);
                //        }
                //        div.appendChild(div2);
                //        //let button1: HTMLAnchorElement = document.createElement("a");
                //        //button1.text = Framework.LocalizationManager.Get("OK");
                //        //button1.style.color = "white";
                //        //button1.classList.add("smallbutton");
                //        //button1.style.height = "40px";
                //        //button1.style.width = "200px";
                //        //button1.style.fontSize = "14px";
                //        //button1.style.verticalAlign = "center";
                //        //button1.style.textDecoration = "none";
                //        //button1.style.fontWeight = "bold";
                //        //button1.style.cssFloat = "right";
                //        //button1.style.margin = "5px";
                //        //button1.style.border = "1px solid black";
                //        //button1.onclick = function () {
                //        //    $(div).remove();
                //        //};
                //        //div.appendChild(button1);
                //        let b1 = Framework.Form.Button.Create(() => { return true; }, () => {
                //            modal.Close();
                //        }, '<i class="fas fa-check"></i>', ["btnCircle"], Framework.LocalizationManager.Get("OK"));
                //        let buttons = [b1];
                //        if (self._CanAddDescription == true) {
                //            let b2 = Framework.Form.Button.Create(() => { return true; }, () => {
                //                let div: HTMLDivElement = document.createElement("div");
                //                div.title = Framework.LocalizationManager.Get("NewDescriptor");
                //                let p: HTMLParagraphElement = document.createElement("p");
                //                p.innerText = Framework.LocalizationManager.Get("PleaseEnterNewDescriptor");
                //                div.appendChild(p);
                //                let t: HTMLInputElement = document.createElement("input");
                //                t.type = "text";
                //                t.style.display = "block";
                //                t.style.width = "100%";
                //                t.style.height = "32px";
                //                div.appendChild(t);
                //                let button: HTMLAnchorElement = document.createElement("a");
                //                button.textContent = Framework.LocalizationManager.Get("OK");
                //                button.style.color = "white";
                //                button.classList.add("smallbutton");
                //                button.style.marginTop = "10px";
                //                button.setAttribute("groupIndex", this.getAttribute("groupIndex"));
                //                button.onclick = function () {
                //                    // Ajout nouveau descripteur dans liste et dans attributes
                //                    if (self.Attributes.filter((x) => { return x.Label == t.value; }).length == 0) {
                //                        let codelabel: Models.CodeLabel = new Models.CodeLabel(t.value, t.value);
                //                        self.Attributes.push(codelabel);
                //                        self.AddDescription(group, t.value);
                //                        // MAJ du texte
                //                        self.setLink(groupIndex);
                //                        // Ajout case à cocher
                //                        let p: HTMLParagraphElement = document.createElement("p");
                //                        let ccb: CustomCheckBox = self.createCheckbox(t.value, t.value, labelHeight, Number(this.getAttribute("groupIndex")), editMode);
                //                        ccb.IsChecked = true;
                //                        ccb.Check();
                //                        p.appendChild(ccb.HtmlElement);
                //                        div2.appendChild(p);
                //                    }
                //                    modal.Close();
                //                };
                //                button.style.display = "block";
                //                div.appendChild(button);
                //            }, '<i class="fas fa-add"></i>', ["btnCircle"], Framework.LocalizationManager.Get("NewDescriptor"));
                //            buttons.push(b2);
                //            //let button2: HTMLAnchorElement = document.createElement("a");
                //            //button2.text = Framework.LocalizationManager.Get("NewDescriptor");
                //            //button2.style.color = "white";
                //            //button2.style.height = "40px";
                //            //button2.style.width = "200px";
                //            //button2.style.fontSize = "14px";
                //            //button2.style.verticalAlign = "center";
                //            //button2.style.textDecoration = "none";
                //            //button2.style.fontWeight = "bold";
                //            //button2.style.cssFloat = "right";
                //            //button2.style.margin = "5px";
                //            //button2.style.border = "1px solid black";
                //            //button2.classList.add("smallbutton");
                //            //button2.setAttribute("groupIndex", groupIndex.toString());
                //            //self.addDescriptorButton = button2;
                //            //button2.onclick = function () {
                //            //    let div: HTMLDivElement = document.createElement("div");
                //            //    div.title = Framework.LocalizationManager.Get("NewDescriptor");
                //            //    let p: HTMLParagraphElement = document.createElement("p");
                //            //    p.innerText = Framework.LocalizationManager.Get("PleaseEnterNewDescriptor");
                //            //    div.appendChild(p);
                //            //    let t: HTMLInputElement = document.createElement("input");
                //            //    t.type = "text";
                //            //    t.style.display = "block";
                //            //    t.style.width = "100%";
                //            //    t.style.height = "32px";
                //            //    div.appendChild(t);
                //            //    let button: HTMLAnchorElement = document.createElement("a");
                //            //    button.textContent = Framework.LocalizationManager.Get("OK");
                //            //    button.style.color = "white";
                //            //    button.classList.add("smallbutton");
                //            //    button.style.marginTop = "10px";
                //            //    button.setAttribute("groupIndex", this.getAttribute("groupIndex"));
                //            //    button.onclick = function () {
                //            //        // Ajout nouveau descripteur dans liste et dans attributes
                //            //        if (self.Attributes.filter((x) => { return x.Label == t.value; }).length == 0) {
                //            //            let codelabel: Models.CodeLabel = new Models.CodeLabel(t.value, t.value);
                //            //            self.Attributes.push(codelabel);
                //            //            self.AddDescription(group, t.value);
                //            //            // MAJ du texte
                //            //            self.setLink(groupIndex);
                //            //            // Ajout case à cocher
                //            //            let p: HTMLParagraphElement = document.createElement("p");
                //            //            let ccb: CustomCheckBox = self.createCheckbox(t.value, t.value, labelHeight, Number(this.getAttribute("groupIndex")), editMode);
                //            //            ccb.IsChecked = true;
                //            //            ccb.Check();
                //            //            p.appendChild(ccb.HtmlElement);
                //            //            div2.appendChild(p);
                //            //        }
                //            //        modal.Close();
                //            //    };
                //            //    button.style.display = "block";
                //            //    div.appendChild(button);
                //            //    return;
                //            //};
                //            //div.appendChild(button2);
                //        }
                //        let modal = Framework.Modal.Show(div, Framework.LocalizationManager.Get("Group") + " " + group + ": " + self.GetProductLabels(group), buttons);
                //    };
                //    this.HtmlElement.appendChild(p);
                //}
                this.validate();
            };
            //private createCheckbox(code: string, label: string, size: number, groupIndex: number, editMode: boolean): Controls.CustomCheckBox {
            //    let ccb: Controls.CustomCheckBox = new CustomCheckBox();
            //    ccb._BorderBrush = "black";
            //    ccb._BorderThickness = 1;
            //    ccb._FontSize = 20;
            //    ccb._FontFamily = this._FontFamily;
            //    ccb._FontWeight = this._FontWeight;
            //    ccb._FontStyle = this._FontStyle;
            //    ccb._Foreground = "black";
            //    ccb._Background = "black";
            //    let ccbl: ControlLabel = new ControlLabel();
            //    ccbl.Item = code;
            //    ccbl.Label = label;
            //    ccbl.Placement = "Right";
            //    ccb._Height = size;
            //    ccb._Width = size;
            //    ccb.CanUncheck = true;
            //    ccb.Render(editMode);
            //    // Précocher les boutons si la description existe
            //    if (this.groupDescriptions[groupIndex].Description.indexOf(ccbl.Item) > -1) {
            //        ccb.IsChecked = true;
            //        ccb.Check();
            //    }
            //    ccb.HtmlElement.setAttribute("group", this.groupDescriptions[groupIndex].Group);
            //    ccb.HtmlElement.setAttribute("description", ccbl.Item);
            //    ccb.HtmlElement.setAttribute("groupIndex", groupIndex.toString());
            //    ccb.SetLabel(ccbl, editMode);
            //    let self = this;
            //    if (editMode == false) {
            //        ccb.OnClick = function () {
            //            let group = this.HtmlElement.getAttribute("group");
            //            let description = this.HtmlElement.getAttribute("description");
            //            let groupIndex = Number(this.HtmlElement.getAttribute("groupIndex"))
            //            // MAJ des données
            //            if (this.IsChecked) {
            //                self.AddDescription(group, description);
            //            } else {
            //                self.RemoveDescription(group, description);
            //            }
            //            // MAJ du texte
            //            self.setLink(groupIndex);
            //        };
            //    }
            //    ccb.HtmlElement.style.position = "relative";
            //    return ccb;
            //}
            //private setLink(groupIndex: number) {
            //    let newText: string[] = [];
            //    for (var i = 0; i < this.groupDescriptions[groupIndex].Description.length; i++) {
            //        let labels = this.Attributes.filter((x) => { return x.Code == this.groupDescriptions[groupIndex].Description[i]; })
            //        if (labels.length > 0) {
            //            newText.push(labels[0].Label);
            //        } else {
            //            newText.push(this.groupDescriptions[groupIndex].Description[i]);
            //        }
            //    }
            //    let a = document.getElementById("groupDescription" + this.groupDescriptions[groupIndex].Group)
            //    if (newText.length > 0) {
            //        a.innerHTML = newText.join(', ');
            //        a.style.color = "green";
            //    } else {
            //        a.innerHTML = Framework.LocalizationManager.Get("NoDescription");
            //        a.style.color = "red";
            //    }
            //}
            GroupDescriptionControl.prototype.AddDescription = function (group, attribute) {
                var self = this;
                var data = this.ListData.filter(function (x) { return x.Group == group; });
                var groupDescription = self.groupDescriptions.filter(function (x) { return x.Group == group; })[0];
                groupDescription.Description.push(attribute);
                data.forEach(function (x) {
                    var tab = Framework.Array.Unique((x.Description + "," + attribute).split(","));
                    if (tab.indexOf('') >= 0) {
                        tab.splice(tab.indexOf(''), 1);
                    }
                    x.Description = tab.join(",");
                    self.onDataChanged(x);
                });
                self.validate();
            };
            GroupDescriptionControl.prototype.RemoveDescription = function (group, attribute) {
                var self = this;
                var data = this.ListData.filter(function (x) { return x.Group == group; });
                var gd = self.groupDescriptions.filter(function (x) { return x.Group == group; })[0];
                var index = gd.Description.indexOf(attribute);
                gd.Description.splice(index, 1);
                data.forEach(function (x) {
                    var tab = Framework.Array.Unique(x.Description.replace(attribute, "").split(","));
                    if (tab.indexOf('') >= 0) {
                        tab.splice(tab.indexOf(''), 1);
                    }
                    x.Description = tab.join(",");
                    self.onDataChanged(x);
                });
                self.validate();
            };
            //public GetListAnchors(): HTMLAnchorElement[] {
            //    return this.listAnchors;
            //}
            //public GetListModalDescriptors(): CustomCheckBox[] {
            //    return this.listModalDescriptors;
            //}
            //public GetGroups(): GroupDescription[] {
            //    return this.groupDescriptions;
            //}
            //public GetAddDescriptorButton(): HTMLAnchorElement {
            //    return this.addDescriptorButton;
            //}
            //public GetProductLabels(group: string): string {
            //    let label: string = "";
            //    let self = this;
            //    let groupData: Models.Data[] = this.ListData.filter((x) => {
            //        return x.Group == group;
            //    });
            //    let products: string[] = [];
            //    groupData.forEach((x) => {
            //        if (products.indexOf(x.ProductCode) == -1) {
            //            products.push(x.ProductCode);
            //        }
            //    });
            //    let codes: string[] = [];
            //    products.forEach((code) => {
            //        let items = self.Items.filter((x) => {
            //            return x.Code == code;
            //        });
            //        items.forEach((x) => {
            //            if (codes.indexOf(x.Label) == -1) {
            //                codes.push(x.Label);
            //            }
            //        });
            //    });
            //    label = codes.join(', ');
            //    return label;
            //}
            GroupDescriptionControl.Create = function (experimentalDesignId) {
                if (experimentalDesignId === void 0) { experimentalDesignId = 0; }
                var control = new GroupDescriptionControl();
                control._Height = 600;
                control._Width = 600;
                control.DefaultTopCoordinate = "Center";
                control.DefaultLeftCoordinate = "Center";
                return control;
            };
            return GroupDescriptionControl;
        }(GroupedControl));
        Controls.GroupDescriptionControl = GroupDescriptionControl;
        var NappingControl = /** @class */ (function (_super) {
            __extends(NappingControl, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function NappingControl() {
                var _this = _super.call(this) || this;
                //TODO : mettre carrés en dehors de la zone au chargement
                //TODO : récupérer valeur existante
                //TODO : faire propriétés communes drag drop avec sorting et ranking (duplicat)
                _this._BoxSize = 50; // Taille du carré à déplacer
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "BoxSize", "_BoxSize");
                //}
                _this._BorderThickness = 1;
                _this._BorderBrush = "black";
                _this._EvaluationMode = "Attribute";
                _this._Type = "NappingControl";
                return _this;
            }
            NappingControl.Create = function (experimentalDesignId) {
                if (experimentalDesignId === void 0) { experimentalDesignId = 0; }
                var control = new NappingControl();
                control._Height = 600;
                control._Width = 600;
                control._BorderThickness = 1;
                control._BorderBrush = "black";
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                control._ExperimentalDesignId = experimentalDesignId;
                control._EvaluationMode = "Attribute";
                return control;
            };
            NappingControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition") {
                    var formSetBoxSize = Framework.Form.PropertyEditorWithNumericUpDown.Render("Design", "BoxSize", self._BoxSize, 10, 100, function (x) {
                        self.changeProperty("_BoxSize", x);
                        self.updateControl();
                    });
                    properties.push(formSetBoxSize);
                }
                return properties;
            };
            NappingControl.prototype.Render = function (editMode, ratio) {
                _super.prototype.Render.call(this, editMode, ratio);
                var _nappingControl = this;
                var self = this;
                this.ListData = [];
                // TODO Prendre couleur produit
                var colors = Framework.Color.DistinctPalette;
                var top = 0;
                var left = 0;
                // Items (produits)
                for (var i = 0; i < this.Items.length; i++) {
                    var draggable = document.createElement("div");
                    draggable.style.height = this._BoxSize + "px";
                    draggable.style.width = this._BoxSize + "px";
                    draggable.style.left = left + "px";
                    draggable.style.top = top + "px";
                    draggable.style.fontFamily = this._FontFamily;
                    draggable.style.fontSize = this._FontSize + "px";
                    draggable.style.fontWeight = this._FontWeight;
                    draggable.style.fontStyle = this._FontStyle;
                    draggable.style.background = colors[i].Hex;
                    draggable.style.color = Framework.Color.InvertHexColor(colors[i].Hex);
                    draggable.style.position = "absolute";
                    draggable.style.textAlign = "center";
                    draggable.style.border = "1px solid black";
                    draggable.innerText = this.Items[i].Label;
                    draggable.setAttribute("productcode", this.Items[i].Code);
                    draggable.classList.add("noselect");
                    this.HtmlElement.appendChild(draggable);
                    Framework.DragDropManager.Draggable(draggable, this.HtmlElement, function () { }, function (elt, dx, dy) {
                        if (_nappingControl.IsEnabled == false) {
                            return;
                        }
                        var l = (Number(elt.style.left.replace('px', '')) + dx);
                        var t = (Number(elt.style.top.replace('px', '')) + dy);
                        elt.style.left = l + "px";
                        elt.style.top = t + "px";
                    }, function (elt, left, top) {
                        var x = left + (_nappingControl._BoxSize / 2);
                        var y = _nappingControl._Height - top - (_nappingControl._BoxSize / 2);
                        // Données à enregistrer
                        var date = new Date(Date.now());
                        var time;
                        if (_nappingControl.StartDate) {
                            time = (date.getTime() - _nappingControl.StartDate.getTime()) / 1000;
                        }
                        var data = _nappingControl.ListData.filter(function (x) { return x.ProductCode == elt.getAttribute('productcode'); });
                        if (data.length > 0) {
                            data[0].X = Framework.Maths.Round(Number(x.toFixed(2)) - self._BoxSize / 2, 0);
                            data[0].Y = Framework.Maths.Round(Number(y.toFixed(2)) - self._BoxSize / 2, 0);
                            if (data[0].X < 0) {
                                data[0].X = 0;
                            }
                            if (data[0].Y < 0) {
                                data[0].Y = 0;
                            }
                            data[0].RecordedDate = new Date(Date.now());
                        }
                        // Validation
                        _nappingControl.onDataChanged(data[0]);
                    }, undefined, undefined, this.Ratio);
                    // Données à enregistrer
                    var d = new Models.Data();
                    d.DataControlId = this._Id;
                    d.ControlName = this._FriendlyName;
                    d.ProductCode = this.Items[i].Code;
                    d.ProductRank = i + 1;
                    d.Replicate = this.Replicate;
                    d.Intake = this.Intake;
                    d.Score = null;
                    d.Session = this.UploadId;
                    d.SubjectCode = this.SubjectCode;
                    d.Type = this._DataType;
                    d.X = left + this._BoxSize / 2;
                    d.Y = _nappingControl._Height - top - this._BoxSize / 2;
                    d.Description = "";
                    this.ListData.push(d);
                    top += this._BoxSize + 5;
                    if (top + this._BoxSize > this._Height) {
                        top = 0;
                        left += this._BoxSize + 5;
                    }
                }
            };
            return NappingControl;
        }(GroupedControl));
        Controls.NappingControl = NappingControl;
        // Non utilisé pour l'instant
        //export class DATIControl extends DataControl {
        //    //TODO : finaliser, propriété drag drop commune
        //    public _AttrX: string = "";
        //    public _AttrY: string = "";
        //    public _StartOn: string = "Zero";
        //    public _PlotDiagonal: boolean = true;
        //    public _RandomizeAxes: boolean = true;
        //    public _Minimum: number = 0;
        //    public _Maximum: number = 0;
        //    private x: number;
        //    private y: number;
        //    constructor(control: Element = null) {
        //        super(control);
        //        if (control) {
        //            this.setPropertyFromXaml(control, "AttrX", "_AttrX");
        //            this.setPropertyFromXaml(control, "AttrY", "_AttrY");
        //            this.setPropertyFromXaml(control, "StartOn", "_StartOn");
        //            this.setPropertyFromXaml(control, "PlotDiagonal", "_PlotDiagonal");
        //            this.setPropertyFromXaml(control, "RandomizeAxes", "_RandomizeAxes");
        //            this.setPropertyFromXaml(control, "Minimum", "_Minimum");
        //            this.setPropertyFromXaml(control, "Maximum", "_Maximum");
        //        }
        //        this._Type = "DATIControl";
        //    }
        //    public Render(): void {
        //        super.Render();
        //        var _control = this;
        //        let dropable: HTMLDivElement = document.createElement("div");
        //        dropable.style.height = this._Height + "px";
        //        dropable.style.width = this._Width + "px";
        //        dropable.style.background = "linear-gradient(135deg, #e4f5fc 0%,#bfe8f9 50%,#9fd8ef 50%,#2ab0ed 100%)";
        //        dropable.style.border = "none";
        //        dropable.style.borderLeft = "1px solid black";
        //        dropable.style.borderBottom = "1px solid black";
        //        let draggable: HTMLDivElement = document.createElement("div");
        //        draggable.classList.add('draggable');
        //        draggable.style.height = "10px";
        //        draggable.style.width = "10px";
        //        draggable.style.background = "blue";
        //        draggable.style.top = (this._Height - 10) + "px";
        //        draggable.style.position = "relative";
        //        this.HtmlElement.appendChild(dropable);
        //        dropable.appendChild(draggable);
        //        interact('.draggable')
        //            .draggable({
        //                // enable inertial throwing
        //                inertia: true,
        //                // keep the element within the area of it's parent
        //                restrict: {
        //                    restriction: "parent",
        //                    endOnly: true,
        //                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        //                },
        //                // enable autoScroll
        //                autoScroll: true,
        //                // call this function on every dragmove event
        //                onmove: dragMoveListener,
        //                // call this function on every dragend event
        //                onend: function (event) {
        //                    if (_control.IsEnabled == false) {
        //                        return;
        //                    }
        //                    let x = Number(event.target.getAttribute('data-x')) + 5;
        //                    let y = Number(-event.target.getAttribute('data-y')) + 5;
        //                    // Données à enregistrer
        //                    var date: Date = new Date(Date.now());
        //                    var time;
        //                    if (_control.StartDate) {
        //                        time = (date.getTime() - _control.StartDate.getTime()) / 1000;
        //                    }
        //                    var d1: Models.Data = new Models.Data();
        //                    d1.DataControlId = _control._Id;
        //                    d1.ProductCode = _control.ProductCode
        //                    d1.ProductRank = _control.ProductRank;
        //                    d1.Replicate = _control.Replicate;
        //                    d1.Session = _control.UploadId;
        //                    d1.SubjectCode = _control.SubjectCode;
        //                    d1.Type = "DATI";
        //                    d1.AttributeCode = _control._AttrY;
        //                    d1.Score = Number(((y / _control._Width) * (_control._Maximum - _control._Minimum)).toFixed(2));
        //                    d1.RecordedDate = date;
        //                    d1.Time = time;
        //                    _control.ListData.push(d2);
        //                    var d2: Models.Data = new Models.Data();
        //                    d2.DataControlId = _control._Id;
        //                    d2.ProductCode = _control.ProductCode
        //                    d2.ProductRank = _control.ProductRank;
        //                    d2.Replicate = _control.Replicate;
        //                    d2.Session = _control.UploadId;
        //                    d2.SubjectCode = _control.SubjectCode;
        //                    d2.Type = "DATI";
        //                    d2.AttributeCode = _control._AttrX;
        //                    d2.Score = Number(((x / _control._Width) * (_control._Maximum - _control._Minimum)).toFixed(2));
        //                    d2.RecordedDate = date;
        //                    d2.Time = time;
        //                    _control.ListData.push(d2);
        //                    // Validation
        //                    _control.validate();
        //                    _control.onDataChanged(d1);
        //                    _control.onDataChanged(d2);
        //                }
        //            });
        //        function dragMoveListener(event) {
        //            // Fix pour la prise en compte du scale
        //            var scaleM = $('#currentScreen').css('transform').replace('matrix(', '');
        //            var scale = Number(scaleM.split(',')[0]);
        //            if (!scale) {
        //                scale = 1;
        //            }
        //            var target = event.target,
        //                // keep the dragged position in the data-x/data-y attributes
        //                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx / scale,
        //                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy / scale;
        //            // translate the element
        //            target.style.webkitTransform =
        //                target.style.transform =
        //                'translate(' + x + 'px, ' + y + 'px)';
        //            // update the posiion attributes
        //            target.setAttribute('data-x', x);
        //            target.setAttribute('data-y', y);
        //        }
        //        // this is used later in the resizing and gesture demos
        //        var w: any = window;
        //        w.dragMoveListener = dragMoveListener;
        //        var xlegend: HTMLDivElement = document.createElement("div");
        //        xlegend.innerHTML = this._AttrX;
        //        xlegend.style.left = (this._Width + 10) + "px";
        //        xlegend.style.top = (this._Height - (Framework.Scale.MeasureText(this._AttrY, this._FontSize, this._FontFamily, this._FontStyle, this._FontWeight).height / 2)) + "px";
        //        xlegend.style.zIndex = "10000";
        //        xlegend.style.position = "absolute";
        //        xlegend.style.fontFamily = this._FontFamily;
        //        xlegend.style.fontSize = this._FontSize + "px";
        //        xlegend.style.color = Framework.Color.RgbToHex(this._Foreground);
        //        this.HtmlElement.appendChild(xlegend);
        //        var ylegend: HTMLDivElement = document.createElement("div");
        //        ylegend.innerHTML = this._AttrY;
        //        ylegend.style.left = -(Framework.Scale.MeasureText(this._AttrY, this._FontSize, this._FontFamily, this._FontStyle, this._FontWeight).width / 2) + "px";
        //        ylegend.style.top = -30 + "px";
        //        ylegend.style.zIndex = "10000";
        //        ylegend.style.position = "absolute";
        //        ylegend.style.fontFamily = this._FontFamily;
        //        ylegend.style.fontSize = this._FontSize + "px";
        //        ylegend.style.color = Framework.Color.RgbToHex(this._Foreground);
        //        this.HtmlElement.appendChild(ylegend);
        //    }
        //    private validate() {
        //        this.ValidationMessage = "";
        //        this.IsValid = true;
        //    }
        //    public Disable(): void {
        //        this.IsEnabled = false;
        //        this.HtmlElement.style.cursor = "no-drop";
        //    }
        //    public Enable(): void {
        //        this.IsEnabled = true;
        //        this.HtmlElement.style.cursor = "default";
        //    }
        //}
        var DraggableItem = /** @class */ (function () {
            function DraggableItem(code, label, width, height, color, control) {
                this.div = document.createElement("div");
                this.div.innerHTML = label;
                this.div.style.margin = "0";
                this.div.style.marginBottom = "5px";
                this.div.style.zIndex = "1000";
                this.div.style.width = width + "px";
                this.div.style.height = height + "px";
                this.div.style.position = "absolute";
                this.div.style.border = '1px solid black';
                this.div.style.background = color.Hex;
                this.div.style.color = Framework.Color.InvertHexColor(color.Hex);
                this.div.style.fontFamily = control._FontFamily;
                this.div.style.fontSize = control._FontSize + "px";
                this.div.style.fontWeight = control._FontWeight;
                this.div.style.fontStyle = control._FontStyle;
                this.div.style.textAlign = "center";
                this.div.style.touchAction = "none";
                this.div.classList.add("noselect");
                this.code = code;
            }
            Object.defineProperty(DraggableItem.prototype, "Div", {
                get: function () {
                    return this.div;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DraggableItem.prototype, "Code", {
                get: function () {
                    return this.code;
                },
                enumerable: false,
                configurable: true
            });
            return DraggableItem;
        }());
        var DropZone = /** @class */ (function () {
            function DropZone(label, width, height, left, top, maxItems) {
                this.maxItems = 1;
                this.containerDiv = document.createElement("div");
                this.containerDiv.classList.add("noselect");
                this.labelDiv = document.createElement("div");
                this.labelDiv.style.width = width + "px";
                this.labelDiv.style.position = "absolute";
                this.labelDiv.style.height = "20px";
                this.labelDiv.style.textAlign = "center";
                this.labelDiv.style.left = left + "px";
                this.labelDiv.style.top = top + "px";
                this.labelDiv.style.fontSize = "16px";
                this.labelDiv.innerHTML = label;
                this.labelDiv.classList.add("noselect");
                this.containerDiv.appendChild(this.labelDiv);
                this.dropZoneDiv = document.createElement("div");
                this.dropZoneDiv.style.background = "lightblue";
                this.dropZoneDiv.style.position = "absolute";
                this.dropZoneDiv.style.border = '1px solid black';
                this.dropZoneDiv.style.width = width + "px";
                this.dropZoneDiv.style.userSelect = "none";
                this.dropZoneDiv.style.zIndex = "1";
                this.dropZoneDiv.style.height = (height - 20) + "px";
                ;
                this.dropZoneDiv.style.width = width + "px";
                ;
                this.dropZoneDiv.style.background = "lightgray";
                this.dropZoneDiv.style.left = left + "px";
                this.dropZoneDiv.style.top = (top + 30) + "px";
                this.dropZoneDiv.classList.add("noselect");
                this.containerDiv.appendChild(this.dropZoneDiv);
                this.Group = 0;
                this.items = [];
                this.maxItems = maxItems;
            }
            Object.defineProperty(DropZone.prototype, "MaxItems", {
                get: function () {
                    return this.maxItems;
                },
                enumerable: false,
                configurable: true
            });
            DropZone.prototype.NbItems = function () {
                return this.items.length;
            };
            Object.defineProperty(DropZone.prototype, "DropZone", {
                get: function () {
                    return this.dropZoneDiv;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(DropZone.prototype, "Container", {
                get: function () {
                    return this.containerDiv;
                },
                enumerable: false,
                configurable: true
            });
            DropZone.prototype.PositionItems = function () {
                var top = Number(this.dropZoneDiv.style.top.replace('px', ''));
                for (var i = 0; i < this.items.length; i++) {
                    this.items[i].Div.style.top = top + "px";
                    top += Number(this.items[i].Div.style.height.replace('px', '')) + 2;
                }
            };
            DropZone.prototype.MoveItem = function (item, onChange) {
                //item.DropZone.Group = this.Group;
                if (this.items.length < this.maxItems) {
                    this.items.push(item);
                    Framework.Array.Remove(item.DropZone.items, item);
                    item.DropZone.PositionItems();
                    item.DropZone = this;
                    item.Div.style.left = this.dropZoneDiv.style.left;
                    this.PositionItems();
                    onChange(item);
                }
                else {
                    item.Div.style.left = item.DropZone.dropZoneDiv.style.left;
                    item.DropZone.PositionItems();
                }
            };
            DropZone.prototype.AddItem = function (item) {
                this.items.push(item);
                item.DropZone = this;
                item.Div.style.left = this.dropZoneDiv.style.left;
                this.PositionItems();
            };
            return DropZone;
        }());
        var DragDropControl = /** @class */ (function (_super) {
            __extends(DragDropControl, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function DragDropControl() {
                var _this = _super.call(this) || this;
                //TODO : récupérer valeur existante
                //TODO : style du texte
                //TODO : couleurs produits
                _this._BoxSize = 100;
                _this.listDraggableItems = [];
                _this.listDropZones = [];
                return _this;
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "BoxSize", "_BoxSize");
                //}
            }
            DragDropControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition") {
                    var formSetBoxSize = Framework.Form.PropertyEditorWithNumericUpDown.Render("Design", "BoxSize", self._BoxSize, 10, 100, function (x) {
                        self.changeProperty("_BoxSize", x);
                        self.updateControl();
                    });
                    properties.push(formSetBoxSize);
                }
                return properties;
            };
            DragDropControl.prototype.changeData = function (item) {
                var productData = this.ListData.filter(function (x) { return x.ProductCode == item.Code; })[0];
                productData.Score = item.DropZone.Group;
                productData.Group = item.DropZone.Group.toString();
                productData.RecordedDate = new Date(Date.now());
                this.validate();
                this.onDataChanged(productData);
            };
            DragDropControl.prototype.Render = function (creationMode, maxItemPerGroup, dropZones, ratio) {
                if (creationMode === void 0) { creationMode = false; }
                if (maxItemPerGroup === void 0) { maxItemPerGroup = undefined; }
                if (dropZones === void 0) { dropZones = undefined; }
                if (ratio === void 0) { ratio = 1; }
                _super.prototype.Render.call(this, creationMode, ratio);
                if (maxItemPerGroup == undefined) {
                    maxItemPerGroup = this.Items.length;
                }
                if (dropZones == undefined) {
                    dropZones = this.Items.length;
                }
                this.ListData = [];
                this.listDraggableItems = [];
                this.listDropZones = [];
                var self = this;
                var top = 0;
                var left = 0;
                var dropZonesDiv = [];
                var draggableItemsDiv = [];
                var maxBoxSize = Framework.Maths.Round((this._Width - (5 * this.Items.length + 1)) / (this.Items.length + 1), 0);
                if (this._BoxSize > maxBoxSize) {
                    this._BoxSize = maxBoxSize;
                }
                var baseDropZone = new DropZone("0", this._BoxSize, this._Height - this._BoxSize - 20, 0, 0, this.Items.length);
                this.listDropZones.push(baseDropZone);
                dropZonesDiv.push(baseDropZone.DropZone);
                this.HtmlElement.appendChild(baseDropZone.Container);
                left += this._BoxSize + 5;
                var colors = Framework.Color.DistinctPalette;
                var boxHeight = (this._Height - this._BoxSize - 20);
                var itemHeight = this._BoxSize;
                while ((itemHeight * (this.Items.length + 1)) >= boxHeight) {
                    itemHeight = itemHeight - 2;
                }
                for (var i = 0; i < dropZones; i++) {
                    var dropZone = new DropZone((i + 1).toString(), this._BoxSize, boxHeight, left, 0, maxItemPerGroup);
                    dropZone.Group = i + 1;
                    this.HtmlElement.appendChild(dropZone.Container);
                    this.listDropZones.push(dropZone);
                    dropZonesDiv.push(dropZone.DropZone);
                    left += this._BoxSize + 5;
                }
                var j = 0;
                for (var i = 0; i < this.Items.length; i++) {
                    // Données par défaut : groupe 0
                    var d = new Models.Data();
                    d.DataControlId = this._Id;
                    d.ControlName = this._FriendlyName;
                    d.ProductCode = this.Items[i].Code;
                    d.AttributeCode = this.AttributeCode;
                    d.AttributeRank = this.AttributeRank;
                    d.ProductRank = i + 1;
                    d.Replicate = this.Replicate;
                    d.Score = 0;
                    d.Group = "0";
                    d.Session = this.UploadId;
                    d.SubjectCode = this.SubjectCode;
                    d.Type = this._DataType;
                    this.ListData.push(d);
                    if (i % 19 === 0) {
                        j = 0;
                    }
                    var draggable = new DraggableItem(this.Items[i].Code, this.Items[i].Label, this._BoxSize, itemHeight, colors[j], self);
                    draggable.DropZone = baseDropZone;
                    this.HtmlElement.appendChild(draggable.Div);
                    this.listDraggableItems.push(draggable);
                    draggableItemsDiv.push(draggable.Div);
                    j++;
                    baseDropZone.AddItem(draggable);
                    if (creationMode == false) {
                        Framework.DragDropManager.Dropable(draggable.Div, this.HtmlElement, function () {
                        }, function (elt, dx, dy) {
                            elt.style.left = (Number(elt.style.left.replace('px', '')) + dx) + "px";
                            elt.style.top = (Number(elt.style.top.replace('px', '')) + dy) + "px";
                        }, function (draggableElt, dropZone) {
                            var de = self.listDraggableItems[draggableItemsDiv.indexOf(draggableElt)];
                            var dz = self.listDropZones[dropZonesDiv.indexOf(dropZone)];
                            dz.MoveItem(de, function (item) {
                                self.changeData(item);
                            });
                        }, dropZonesDiv, this.Ratio);
                    }
                }
                this.validate();
            };
            DragDropControl.prototype.validate = function () {
                this.ValidationMessage = "";
                // Tous les scores doivent être non nuls
                var nullData = this.ListData.filter(function (x) { return (x.Score == 0); });
                this.IsValid = nullData.length == 0;
                // Message d'erreur
                for (var i = 0; i < nullData.length; i++) {
                    this.ValidationMessage += (this.Items.filter(function (x) { return x.Code == nullData[i].ProductCode; }))[0].Label + ", ";
                }
                if (this.ValidationMessage.length > 0) {
                    this.ValidationMessage = Framework.LocalizationManager.Get("FollowingProductsHaveToBeRanked");
                }
            };
            return DragDropControl;
        }(GroupedControl));
        var SortingControl = /** @class */ (function (_super) {
            __extends(SortingControl, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function SortingControl() {
                var _this = _super.call(this) || this;
                //TODO : améliorer gestion min/max en fonction du plan de présentation (à la création), gérer min<=max
                _this._MaxNumberOfGroups = undefined; // Nombre maximal de groupes
                _this._MinNumberOfGroups = 1; // Nombre miniaml de groupes
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "MaxNumberOfGroups", "_MaxNumberOfGroups", "number");
                //    this.setPropertyFromXaml(control, "MinNumberOfGroups", "_MinNumberOfGroups", "number");
                //} else {
                _this._MinNumberOfGroups = 1;
                _this._MaxNumberOfGroups = 1;
                //}
                _this._Type = "SortingControl";
                var self = _this;
                return _this;
            }
            //TODO : récupérer valeur existante
            //TODO : couleurs produits -> utiliser couleur du plan prés
            SortingControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition" || mode == "creation" || mode == "wizard") {
                    var maxLength = this.Items.length;
                    if (maxLength == 0) {
                        maxLength = 40;
                    }
                    var formSetMinNumberOfGroups = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MinNumberOfGroupsProperty", self._MinNumberOfGroups, 1, maxLength, function (x) {
                        self.changeProperty("_MinNumberOfGroups", x);
                    });
                    properties.push(formSetMinNumberOfGroups);
                    if (self._MaxNumberOfGroups == undefined || self._MaxNumberOfGroups > this.Items.length) {
                        self._MaxNumberOfGroups = this.Items.length;
                    }
                    if (self._MaxNumberOfGroups == 0) {
                        self._MaxNumberOfGroups = 10;
                    }
                    var formSetMaxNumberOfGroups = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MaxNumberOfGroupsProperty", self._MaxNumberOfGroups, 1, maxLength, function (x) {
                        self.changeProperty("_MaxNumberOfGroups", x);
                        self.updateControl();
                    });
                    properties.push(formSetMaxNumberOfGroups);
                }
                return properties;
            };
            SortingControl.prototype.Render = function (creationMode, ratio) {
                if (creationMode === void 0) { creationMode = false; }
                _super.prototype.Render.call(this, creationMode, undefined, this._MaxNumberOfGroups, ratio);
            };
            SortingControl.Create = function (experimentalDesignId) {
                if (experimentalDesignId === void 0) { experimentalDesignId = 0; }
                var control = new SortingControl();
                control._Height = 600;
                control._Width = 600;
                control.DefaultTopCoordinate = "Center";
                control.DefaultLeftCoordinate = "Center";
                control._ExperimentalDesignId = experimentalDesignId;
                control._EvaluationMode = "Attribute";
                control._DataType = "Sorting";
                return control;
            };
            return SortingControl;
        }(DragDropControl));
        Controls.SortingControl = SortingControl;
        //export class RankingControl extends DragDropControl {
        //    //TODO : récupérer valeur existante
        //    //TODO : couleurs produits
        //    public _TieAllowed: boolean = false;
        //    public GetEditableProperties(mode: string = "edition"): Framework.Form.PropertyEditor[] {
        //        let self = this;
        //        let properties = super.GetEditableProperties(mode);
        //        if (mode == "edition" || mode == "creation" || mode == "wizard") {
        //            let formSetTieAllowed = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "TieAllowed", self._TieAllowed, (x) => {
        //                self.changeProperty("_TieAllowed", x);
        //            });
        //            properties.push(formSetTieAllowed);
        //        }
        //        return properties;
        //    }
        //    public Render(creationMode: boolean = false, ratio: number): void {
        //        let maxItem = 1;
        //        if (this._TieAllowed == true) {
        //            maxItem = this.Items.length;
        //        }
        //        super.Render(creationMode, maxItem, 1, ratio);
        //    }
        //    //constructor(control: Element = null) {
        //    //    super(control);
        //    constructor() {
        //        super();
        //        //if (control != null) {
        //        //    this.setPropertyFromXaml(control, "TieAllowed", "_TieAllowed");
        //        //}
        //        this._Type = "RankingControl";
        //    }
        //    public static Create(experimentalDesignId: number = 0): RankingControl {
        //        let control: RankingControl = new RankingControl();
        //        control._Height = 600;
        //        control._Width = 600;
        //        control.DefaultTopCoordinate = "Center";
        //        control.DefaultLeftCoordinate = "Center"
        //        control._ExperimentalDesignId = experimentalDesignId;
        //        control._EvaluationMode = "Attribute";
        //        control._DataType = "Ranking";
        //        return control;
        //    }
        //}
        var RankingControl = /** @class */ (function (_super) {
            __extends(RankingControl, _super);
            function RankingControl() {
                var _this = _super.call(this) || this;
                //TODO : récupérer valeur existante
                //TODO : couleurs produits
                _this._Message = "Click to edit the product rank";
                _this._Type = "RankingControl";
                return _this;
            }
            RankingControl.prototype.validate = function () {
                this.IsValid = false;
                this.ValidationMessage = Framework.LocalizationManager.Get("AllProductsHaveToBeRanked");
                var nb = this.ListData.filter(function (x) { return (x.Score == 0); }).length;
                this.IsValid = (nb == 0);
                // Message d'erreur
                if (this.IsValid == false) {
                    this.ValidationMessage = Framework.LocalizationManager.Get("AllProductsHaveToBeRanked");
                    if (this.ValidationMessage != "" && this._CustomErrorMessage != "") {
                        this.ValidationMessage = this._CustomErrorMessage + "\r\n";
                    }
                }
                else {
                    this.ValidationMessage = "";
                }
                //}
            };
            RankingControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition" || mode == "creation" || mode == "wizard") {
                    var formMessage = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "Message", self._Message, function (x) {
                        self.changeProperty("_Message", x);
                        self.updateControl();
                    });
                    properties.push(formMessage);
                }
                return properties;
            };
            RankingControl.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                var self = this;
                _super.prototype.Render.call(this, editMode, ratio);
                var table = document.createElement("table");
                table.style.fontSize = (this._FontSize * ratio) + "px";
                table.style.fontFamily = this._FontFamily;
                table.style.color = "black";
                this.HtmlElement.appendChild(table);
                var tds = [];
                var _loop_4 = function () {
                    var tr = document.createElement("tr");
                    table.appendChild(tr);
                    var td1 = document.createElement("td");
                    td1.style.padding = "10px";
                    tr.appendChild(td1);
                    var td2 = document.createElement("td");
                    td2.style.padding = "10px";
                    tr.appendChild(td2);
                    td1.innerText = "#" + (i + 1).toString();
                    td2.innerText = self._Message;
                    td2.setAttribute("rank", (i + 1).toString());
                    tds.push(td2);
                    if (editMode == false) {
                        td2.onclick = function (ev) {
                            var td = ev.target;
                            var rank = Number(td.getAttribute("rank"));
                            var div = document.createElement("div");
                            //let button = Framework.Form.Button.Create(() => { return true; }, (btn) => {
                            //    let data = self.ListData.filter(x => { return x.Score == rank });
                            //    if (data && data.length > 0) {
                            //        data[0].Score = 0;
                            //    }
                            //    Framework.Popup.Hide(td2);
                            //    td.innerText = self._Message;
                            //    self.validate();
                            //}, "-", ["popupEditableProperty"], "-");
                            //div.appendChild(button.HtmlElement);
                            //self.ListData.filter(x => { return x.Score == 0 }).forEach(d => {
                            self.ListData.forEach(function (d) {
                                var label = self.Items.filter(function (x) { return x.Code == d.ProductCode; })[0].Label;
                                var button = Framework.Form.Button.Create(function () { return true; }, function (btn) {
                                    var existing = tds.filter(function (x) { return x.innerText == label; });
                                    if (existing.length > 0) {
                                        existing.forEach(function (e) {
                                            e.innerText = self._Message;
                                            var data = self.ListData.filter(function (x) { return x.ProductCode == d.ProductCode; })[0];
                                            data.Score = 0;
                                        });
                                    }
                                    var adata = self.ListData.filter(function (x) { return x.Score == rank; });
                                    if (adata.length > 0) {
                                        adata[0].Score = 0;
                                    }
                                    var data = self.ListData.filter(function (x) { return x.ProductCode == d.ProductCode; })[0];
                                    data.Score = rank;
                                    Framework.Popup.Hide(td2);
                                    td.innerText = label;
                                    self.validate();
                                }, label, ["popupEditableProperty"], label);
                                div.appendChild(button.HtmlElement);
                            });
                            Framework.Popup.Show(td2, div, "right");
                        };
                        // Données à enregistrer
                        d = new Models.Data();
                        d.ProductCode = this_3.items[i].Code;
                        d.DataControlId = this_3._Id;
                        d.ControlName = this_3._FriendlyName;
                        d.Replicate = this_3.Replicate;
                        d.Intake = this_3.Intake;
                        d.Score = 0; // Non classé
                        d.Session = this_3.UploadId;
                        d.SubjectCode = this_3.SubjectCode;
                        d.Type = "Ranking";
                        d.RecordedDate = new Date(Date.now());
                        this_3.ListData.push(d);
                    }
                };
                var this_3 = this, d;
                for (var i = 0; i < this.items.length; i++) {
                    _loop_4();
                }
                this.validate();
            };
            RankingControl.Create = function (experimentalDesignId) {
                if (experimentalDesignId === void 0) { experimentalDesignId = 0; }
                var control = new RankingControl();
                control._Height = 600;
                control._Width = 600;
                control.DefaultTopCoordinate = "Center";
                control.DefaultLeftCoordinate = "Center";
                control._ExperimentalDesignId = experimentalDesignId;
                control._EvaluationMode = "Attribute";
                control._DataType = "Ranking";
                return control;
            };
            return RankingControl;
        }(StackedControl));
        Controls.RankingControl = RankingControl;
        var DiscriminationTestControl = /** @class */ (function (_super) {
            __extends(DiscriminationTestControl, _super);
            function DiscriminationTestControl() {
                var _this = _super.call(this) || this;
                //TODO : mise en forme texte
                //["2AFC", "3AFC", "TriangleTest", "DuoTrio", "TwoOutOfFive", "Tetrad"];/ / TODO ? ANoA(POutOfN)
                _this._CheckBoxWidth = 30; // Taille de la case à cocher
                _this._LabelPosition = "Top"; // Position du libellé
                _this._LineSpacing = 10; // Espace entre les cases à cocher
                _this._MustAnswerAllAttributes = true; // Réponse obligatoire ?
                _this._ControlBackground = "blue";
                _this._ControlForeground = "blue";
                _this._ControlBorderBrush = "blue";
                _this._ControlBorderThickness = 1;
                _this.showExperimentalDesignProperty = false;
                _this._Background = "white";
                _this._BorderThickness = 0;
                _this._Type = "DiscriminationTest";
                return _this;
            }
            DiscriminationTestControl.prototype.validate = function () {
                if (this._MustAnswerAllAttributes == true) {
                    // Au moins un score                
                    this.IsValid = this.ListData.filter(function (x) { return (x.Score != null); }).length > 0;
                    // Message d'erreur
                    this.ValidationMessage = Framework.LocalizationManager.Get("PleaseChooseOneProduct");
                    if (this._Test == "TetradTest") {
                        this.ValidationMessage = Framework.LocalizationManager.Get("PleaseChooseTwoProducts");
                    }
                }
            };
            DiscriminationTestControl.prototype.Render = function (editMode, ratio) {
                var _this = this;
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                this.listCheckboxes = [];
                this.ListData = [];
                var self = this;
                var measure = Framework.Scale.MeasureText(this.Items[0].Label, this._FontSize, this._FontFamily, this._FontStyle, this._FontWeight);
                var labelHeight = measure.height;
                // Top position des labels
                var topLabel = 0;
                var topCheckBox = 0;
                if (this._LabelPosition == "Top") {
                    topLabel = 0;
                    topCheckBox = labelHeight + 3 + this._LineSpacing;
                }
                if (this._LabelPosition == "Bottom") {
                    topCheckBox = 0;
                    topLabel = this._CheckBoxWidth + 3 + this._LineSpacing;
                }
                var item = this.Items[0];
                if (this.ProductCode != null) {
                    item = this.Items.filter(function (x) { return x.Code == _this.ProductCode; })[0];
                }
                this.productCodes = item.Code.split('|');
                var productLabels = item.Label.split('|');
                var nbCheckboxes = this.productCodes.length;
                // Création des cases à cocher
                for (var i = 0; i < nbCheckboxes; i++) {
                    var left = (this._Width / (nbCheckboxes + 1)) * (i + 1);
                    var ccb = new CustomCheckBox();
                    ccb._Background = this._ControlBackground;
                    ccb._BorderBrush = this._ControlBorderBrush;
                    ccb._BorderThickness = this._ControlBorderThickness;
                    ccb._Width = this._CheckBoxWidth;
                    ccb._Height = this._CheckBoxWidth;
                    ccb._Left = left;
                    ccb._Top = topCheckBox;
                    ccb.ProductRank = this.ProductRank;
                    ccb.ProductCode = item.Code;
                    ccb.AttributeCode = this.productCodes[i];
                    ccb.AttributeRank = i;
                    ccb.CanUncheck = true;
                    ccb.Render(editMode, ratio);
                    this.HtmlElement.appendChild(ccb.HtmlElement);
                    this.listCheckboxes.push(ccb);
                    if (this._MustAnswerAllAttributes == true) {
                        this.validate();
                    }
                    // Label
                    var label = new Label(productLabels[i]);
                    label._Left = left;
                    label._Top = topLabel;
                    label._ZIndex = this._ZIndex;
                    label._Height = labelHeight;
                    label._FontFamily = this._FontFamily;
                    label._Foreground = this._ControlForeground;
                    label._FontSize = this._FontSize;
                    label._FontWeight = this._FontWeight;
                    label._FontStyle = this._FontStyle;
                    label.Render(editMode, ratio);
                    this.HtmlElement.appendChild(label.HtmlElement);
                }
                if (editMode == true) {
                    return;
                }
                // Données à enregistrer
                var d = new Models.Data();
                d.AttributeRank = null;
                d.DataControlId = this._Id;
                d.ControlName = this._FriendlyName;
                d.ProductCode = this.ProductCode;
                d.ProductRank = this.ProductRank;
                d.Replicate = this.Replicate;
                d.Intake = this.Intake;
                d.Score = null;
                d.Session = this.UploadId;
                d.SubjectCode = this.SubjectCode;
                d.Type = this._Test;
                this.ListData.push(d);
                if (this._Test == "PairedTest") {
                    this.setPairedTest();
                }
                if (this._Test == "TriangleTest") {
                    this.setTriangleTest();
                }
                if (this._Test == "TetradTest" || this._Test == "TwoOutOfFiveTest") {
                    this.setTwoOutOfX();
                }
                this.validate();
            };
            DiscriminationTestControl.prototype.setPairedTest = function () {
                // 2 produits sont présentés à chaque juge. Chaque juge doit identifier le produit ayant l’intensité la plus forte pour une caractéristique spécifique.
                var self = this;
                this.listCheckboxes.forEach(function (ccb) {
                    ccb.OnClick = function () {
                        if (self.IsEnabled == false) {
                            return;
                        }
                        var currentCheckBox = this;
                        // Unclick des autres cases
                        self.listCheckboxes.forEach(function (x) {
                            x.Uncheck();
                        });
                        currentCheckBox.Check();
                        // Enregistrement
                        var d = self.ListData[0];
                        d.RecordedDate = new Date(Date.now());
                        d.Score = 1;
                        d.AttributeCode = ccb.AttributeCode;
                        d.AttributeRank = ccb.AttributeRank + 1;
                        // Validation
                        self.validate();
                        self.onDataChanged(d);
                    };
                });
            };
            DiscriminationTestControl.prototype.setTriangleTest = function () {
                // 3 échantillons sont présentés à chaque juge dans des ordres différents. Parmi ces 3 échantillons, 2 sont similaires et le troisième est différent. Les juges doivent identifier le produit différent des deux autres.
                // AAB, ABA, BAA, BBA, BAB, ABB
                var self = this;
                // Bonne réponse (produit différent)
                var goodAnswerPosition;
                if (this.productCodes[0] == this.productCodes[1]) {
                    //AAB, BBA
                    goodAnswerPosition = 2;
                }
                if (this.productCodes[0] == this.productCodes[2]) {
                    //ABA, BAB
                    goodAnswerPosition = 1;
                }
                if (this.productCodes[1] == this.productCodes[2]) {
                    // BAA, ABB
                    goodAnswerPosition = 0;
                }
                this.listCheckboxes.forEach(function (ccb) {
                    ccb.OnClick = function () {
                        if (self.IsEnabled == false) {
                            return;
                        }
                        var currentCheckBox = this;
                        // Unclick des autres cases
                        self.listCheckboxes.forEach(function (x) {
                            x.Uncheck();
                        });
                        currentCheckBox.Check();
                        // Enregistrement
                        var d = self.ListData[0];
                        d.RecordedDate = new Date(Date.now());
                        if (ccb.AttributeRank == goodAnswerPosition) {
                            d.Score = 1;
                        }
                        else {
                            d.Score = 0;
                        }
                        d.AttributeCode = ccb.AttributeCode;
                        d.AttributeRank = ccb.AttributeRank + 1;
                        // Validation
                        self.validate();
                        self.onDataChanged(d);
                    };
                });
            };
            //https://www.newfoodmagazine.com/article/25140/comparison-sensory-methods/
            DiscriminationTestControl.prototype.setTwoOutOfX = function () {
                // 1 groupe de 2 produits identiques, un groupe de X identiques.Chaque juge doit identifier les 2 groupes d’échantillons ce qui revient à cocher les 2 produits identiques
                var self = this;
                this.listCheckboxes.forEach(function (ccb) {
                    ccb.CanUncheck = true;
                    ccb.OnClick = function () {
                        if (self.IsEnabled == false) {
                            return;
                        }
                        var currentCheckBox = this;
                        var d = self.ListData[0];
                        d.RecordedDate = new Date(Date.now());
                        d.Score = null;
                        var checkedIndex = [];
                        for (var i = 0; i < self.listCheckboxes.length; i++) {
                            if (self.listCheckboxes[i].IsChecked == true) {
                                checkedIndex.push(i);
                            }
                        }
                        if (checkedIndex.length == 2) {
                            d.Score = 0;
                            var att1 = self.listCheckboxes[checkedIndex[0]].AttributeCode;
                            var att2 = self.listCheckboxes[checkedIndex[1]].AttributeCode;
                            if (self._Test == "TetradTest" && att1 == att2) {
                                d.Score = 1;
                            }
                            if (self._Test == "TwoOutOfFiveTest") {
                                var codes = d.ProductCode.split('|');
                                var frequencies = Framework.Array.Frequency(codes);
                                var twicePresentedProduct = frequencies.Entries.filter(function (x) { return x.Val == 2; })[0].Key;
                                if (att1 == att2 && att1 == twicePresentedProduct) {
                                    d.Score = 1;
                                }
                            }
                            d.AttributeCode = att1 + "|" + att2;
                            self.onDataChanged(d);
                        }
                        // Validation
                        self.validate();
                    };
                });
            };
            DiscriminationTestControl.Create = function (test, experimentalDesignId) {
                if (experimentalDesignId === void 0) { experimentalDesignId = 0; }
                var control = new DiscriminationTestControl();
                control._Height = 600;
                control._Width = 600;
                control.DefaultTopCoordinate = "Center";
                control.DefaultLeftCoordinate = "Center";
                control._ExperimentalDesignId = experimentalDesignId;
                control._EvaluationMode = "Attribute";
                return control;
            };
            DiscriminationTestControl.prototype.SetStyle = function (style) {
                if (style === void 0) { style = {}; }
                if (style) {
                    this._ControlBackground = style["FontColor"];
                    this._ControlForeground = style["FontColor"];
                    this._ControlBorderBrush = style["FontColor"];
                    this.updateControl();
                }
            };
            DiscriminationTestControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "creation") {
                    var validateFormSetExperimentalDesignFormProperty_3 = function () {
                        var text = Framework.LocalizationManager.Get("None");
                        var designs = self.ListExperimentalDesigns.filter(function (x) { return x.Id == self._ExperimentalDesignId; });
                        if (designs.length > 0) {
                            text = designs[0].Name;
                        }
                        formSetExperimentalDesignFormProperty_3.SetLabelForPropertyValue(text);
                        if (self._ExperimentalDesignId <= 0) {
                            formSetExperimentalDesignFormProperty_3.ValidationResult = Framework.LocalizationManager.Get("SelectExperimentalDesign");
                        }
                        else {
                            if (self.ExperimentalDesign.PresentationMode == "Pair") {
                                self._Test = "PairedTest";
                            }
                            if (self.ExperimentalDesign.PresentationMode == "Triangle") {
                                self._Test = "TriangleTest";
                            }
                            if (self.ExperimentalDesign.PresentationMode == "Tetrad") {
                                self._Test = "TetradTest";
                            }
                            if (self.ExperimentalDesign.PresentationMode == "TwoOutOfFive") {
                                self._Test = "TwoOutOfFiveTest";
                            }
                        }
                        formSetExperimentalDesignFormProperty_3.Check();
                    };
                    var formSetExperimentalDesignFormProperty_3 = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "ExperimentalDesign", "", this.ListExperimentalDesigns.map(function (x) { return x.Name; }), function (x, btn) {
                        self.ExperimentalDesign = self.ListExperimentalDesigns.filter(function (y) { return y.Name == x; })[0];
                        self.SetExperimentalDesign(self.ExperimentalDesign);
                        validateFormSetExperimentalDesignFormProperty_3();
                    });
                    validateFormSetExperimentalDesignFormProperty_3();
                    properties.push(formSetExperimentalDesignFormProperty_3);
                }
                if (mode == "edition") {
                    var formSetLabelPosition = Framework.Form.PropertyEditorWithPopup.Render("Design", "LabelPosition", self._LabelPosition, ["Top", "Bottom"], function (x) {
                        self.changeProperty("_LabelPosition", x);
                        self.updateControl();
                    });
                    properties.push(formSetLabelPosition);
                    var formSetCheckboxBorderColor = Framework.Form.PropertyEditorWithColorPopup.Render("Design", "CheckboxBorderColor", self._ControlBorderBrush, function (x) {
                        self.changeProperty("_ControlBorderBrush", x);
                        self.updateControl();
                    });
                    properties.push(formSetCheckboxBorderColor);
                    var formSetCheckboxBackgroundColor = Framework.Form.PropertyEditorWithColorPopup.Render("Design", "CheckboxBackgroundColor", self._ControlBackground, function (x) {
                        self.changeProperty("_ControlBackground", x);
                        self.updateControl();
                    });
                    properties.push(formSetCheckboxBackgroundColor);
                    var formSetCheckboxBorderThickness = Framework.Form.PropertyEditorWithNumericUpDown.Render("Design", "CheckboxBorderThickness", self._ControlBorderThickness, 1, 10, function (x) {
                        self.changeProperty("_ControlBorderThickness", x);
                        self.updateControl();
                    });
                    properties.push(formSetCheckboxBorderThickness);
                }
                return properties;
            };
            return DiscriminationTestControl;
        }(DataControl));
        Controls.DiscriminationTestControl = DiscriminationTestControl;
        var TriangleTestControl = /** @class */ (function (_super) {
            __extends(TriangleTestControl, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function TriangleTestControl() {
                var _this = _super.call(this) || this;
                //TODO : récupérer valeur existante
                _this._CheckBoxWidth = 30; // Taille de la case à cocher
                _this._LabelPosition = "Top"; // Position du libellé
                _this._LineSpacing = 10; // Espace entre les cases à cocher
                _this._MustAnswerAllAttributes = true; // Réponse obligatoire ?
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "CheckBoxWidth", "_CheckBoxWidth");
                //    this.setPropertyFromXaml(control, "LabelPosition", "_LabelPosition");
                //    this.setPropertyFromXaml(control, "LineSpacing", "_LineSpacing");
                //    this.setPropertyFromXaml(control, "MustAnswerAllAttributes", "_MustAnswerAllAttributes");
                //    this._ControlBorderThickness = this._BorderThickness;
                //    this._ControlBackground = this._Background;
                //    this._ControlForeground = this._Foreground;
                //    this._ControlBorderBrush = this._BorderBrush;
                //}
                _this._Background = "white";
                _this._BorderThickness = 0;
                _this._Type = "TriangleTestControl";
                return _this;
            }
            TriangleTestControl.prototype.validate = function () {
                if (this._MustAnswerAllAttributes == true) {
                    // Au moins un score                
                    this.IsValid = this.ListData.filter(function (x) { return (x.Score != null); }).length > 0;
                    // Message d'erreur
                    this.ValidationMessage = Framework.LocalizationManager.Get("PleaseChooseOneProduct");
                }
            };
            TriangleTestControl.prototype.Render = function (editMode, ratio) {
                var _this = this;
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                this.listCheckboxes = [];
                var _triangleTestControl = this;
                var measure = Framework.Scale.MeasureText(this.Items[0].Label, this._FontSize, this._FontFamily, this._FontStyle, this._FontWeight);
                var labelHeight = measure.height;
                // Top position des labels
                var topLabel = 0;
                var topCheckBox = 0;
                if (this._LabelPosition == "Top") {
                    topLabel = 0;
                    topCheckBox = labelHeight + 3 + this._LineSpacing;
                }
                if (this._LabelPosition == "Bottom") {
                    topCheckBox = 0;
                    topLabel = this._CheckBoxWidth + 3 + this._LineSpacing;
                }
                // Triangle à afficher
                var item = this.Items[0];
                if (this.ProductCode != null) {
                    item = this.Items.filter(function (x) { return x.Code == _this.ProductCode; })[0];
                }
                var productCodes = item.Code.split('|');
                var productLabels = item.Label.split('|');
                // Données à enregistrer
                var d = new Models.Data();
                d.AttributeCode = "TriangleTest";
                d.AttributeRank = null;
                d.DataControlId = this._Id;
                d.ControlName = this._FriendlyName;
                d.ProductCode = this.ProductCode;
                d.ProductRank = this.ProductRank;
                d.Replicate = this.Replicate;
                d.Intake = this.Intake;
                d.Score = null;
                d.Session = this.UploadId;
                d.SubjectCode = this.SubjectCode;
                d.Type = this._DataType;
                this.ListData.push(d);
                // Bonne réponse (produit différent)
                var goodAnswerPosition;
                if (productCodes[0] != productCodes[1] && productCodes[0] != productCodes[2]) {
                    goodAnswerPosition = 0;
                }
                if (productCodes[1] != productCodes[0] && productCodes[1] != productCodes[2]) {
                    goodAnswerPosition = 1;
                }
                if (productCodes[2] != productCodes[0] && productCodes[2] != productCodes[1]) {
                    goodAnswerPosition = 2;
                }
                // Création des 3 cases à cocher
                for (var i = 0; i < 3; i++) {
                    var left = this._Width / 4 * (i + 1);
                    var ccb = new CustomCheckBox();
                    ccb._Background = this._ControlBackground;
                    ccb._BorderBrush = this._ControlBorderBrush;
                    ccb._BorderThickness = this._ControlBorderThickness;
                    ccb._Width = this._CheckBoxWidth;
                    ccb._Height = this._CheckBoxWidth;
                    ccb._Left = left;
                    ccb._Top = topCheckBox;
                    if (i == goodAnswerPosition) {
                        ccb.Value = 1;
                    }
                    else {
                        ccb.Value = 0;
                    }
                    ccb.ProductCode = item.Code;
                    ccb.CanUncheck = true;
                    ccb.Render(editMode, ratio);
                    this.HtmlElement.appendChild(ccb.HtmlElement);
                    if (editMode == false) {
                        ccb.OnClick = function () {
                            if (_triangleTestControl.IsEnabled == false) {
                                return;
                            }
                            var currentCheckBox = this;
                            // Unclick des autres cases
                            _triangleTestControl.listCheckboxes.forEach(function (x) {
                                x.Uncheck();
                            });
                            currentCheckBox.Check();
                            // Enregistrement
                            var d = _triangleTestControl.ListData.filter(function (x) { return (x.ProductCode == currentCheckBox.ProductCode); });
                            if (d.length > 0) {
                                d[0].RecordedDate = new Date(Date.now());
                                d[0].Score = currentCheckBox.Value;
                            }
                            // Validation
                            _triangleTestControl.validate();
                            _triangleTestControl.onDataChanged(d[0]);
                        };
                    }
                    this.listCheckboxes.push(ccb);
                    if (this._MustAnswerAllAttributes == true) {
                        this.validate();
                    }
                    // Label
                    var label = new Label(productLabels[i]);
                    label._Left = left;
                    label._Top = topLabel;
                    label._ZIndex = this._ZIndex;
                    label._Height = labelHeight;
                    label._FontFamily = this._FontFamily;
                    label._Foreground = this._ControlForeground;
                    label._FontSize = this._FontSize;
                    label._FontWeight = this._FontWeight;
                    label._FontStyle = this._FontStyle;
                    label.Render(editMode, ratio);
                    this.HtmlElement.appendChild(label.HtmlElement);
                }
            };
            return TriangleTestControl;
        }(DataControl));
        Controls.TriangleTestControl = TriangleTestControl;
        var AnchorControl = /** @class */ (function (_super) {
            __extends(AnchorControl, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function AnchorControl() {
                var _this = _super.call(this) || this;
                // TODO : _AnchorId -> Id
                // TODO : utiliser screenId pour les renvois
                _this._AnchorName = ""; // Friendly name
                _this._AnchorId = ""; // Identifiant de l'ancre
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "AnchorName", "_AnchorName");
                //    this.setPropertyFromXaml(control, "AnchorId", "_AnchorId");
                //}
                _this._Type = "AnchorControl";
                return _this;
            }
            return AnchorControl;
        }(BaseControl));
        Controls.AnchorControl = AnchorControl;
        var InteractiveWheel = /** @class */ (function (_super) {
            __extends(InteractiveWheel, _super);
            function InteractiveWheel() {
                var _this = _super.call(this) || this;
                _this._Type = "InteractiveWheel";
                return _this;
            }
            InteractiveWheel.Create = function () {
                var control = new InteractiveWheel();
                control._Height = 600;
                control._Width = 600;
                control._Top = 100;
                control._Left = 100;
                return control;
            };
            InteractiveWheel.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                //let self = this;
                var width = this._Height;
                var height = this._Width;
                var radius = Math.min(width, height) / 2;
                var centerRadius = 0.4 * radius;
                var backCircleRadius = 0.1 * radius;
                var data = {
                    "name": "",
                    "children": [
                        {
                            "name": "Mechanical",
                            "children": [
                                {
                                    "name": "Static",
                                    "children": [{ "name": "HARD", "value": 10 }, { "name": "BRITTLE", "value": 10 }]
                                },
                                {
                                    "name": "Dynamic",
                                    "children": [{ "name": "CHEWY", "value": 10 }, { "name": "STICKY", "value": 10.1 }]
                                },
                                {
                                    "name": "Temporal",
                                    "children": [{ "name": "MELTING", "value": 10 }]
                                }
                            ]
                        },
                        {
                            "name": "Geometrical",
                            "children": [
                                {
                                    "name": "Particle shape",
                                    "children": [{ "name": "POWDERY", "value": 10 }]
                                },
                                {
                                    "name": "Particle size",
                                    "children": [{ "name": "COARSE", "value": 10 }]
                                }
                            ]
                        },
                        {
                            "name": "Other",
                            "children": [
                                {
                                    "name": "Moisture content",
                                    "children": [{ "name": "DRY", "value": 10 }]
                                },
                                {
                                    "name": "Fat content",
                                    "children": [{ "name": "FATTY", "value": 10 }]
                                },
                                {
                                    "name": "Cream content",
                                    "children": [{ "name": "CREAMY", "value": 10 }]
                                },
                                {
                                    "name": "Wax content",
                                    "children": [{ "name": "WAXY", "value": 10 }]
                                },
                                {
                                    "name": "Mouthcoating",
                                    "children": [{ "name": "MOUTHCOATING", "value": 10 }]
                                }
                            ]
                        }
                    ]
                };
                var svg = d3.create("svg").append("svg").attr("width", width).attr("height", height);
                var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");
                var colorScale = d3.scaleOrdinal().range([
                    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
                ]);
                var xScale = d3.scaleLinear().range([0, 2 * Math.PI]);
                //var rScale = d3.scaleLinear().range([0.4 * radius, radius]);
                var rScale = d3.scaleLinear().range([0, radius]);
                var root = d3.hierarchy(data);
                root.sum(function (d) { return d.value; })
                    .sort(function (a, b) { return b.height - a.height || b.value - a.value; });
                var partition = d3.partition();
                partition(root);
                var arc = d3.arc()
                    .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, xScale(d.x0))); })
                    .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, xScale(d.x1))); })
                    .innerRadius(function (d) { return Math.max(0, rScale(d.y0)); })
                    .outerRadius(function (d) { return Math.max(0, rScale(d.y1)); });
                g.selectAll("path")
                    .data(root.descendants())
                    .enter()
                    .append("path")
                    .attr("d", arc)
                    .attr('stroke', '#fff')
                    .attr("fill", function (d) {
                    while (d.depth > 1)
                        d = d.parent;
                    if (d.depth == 0)
                        return "lightgray";
                    return colorScale(d.value);
                })
                    .attr("opacity", 0.8)
                    .on("click", click)
                    .append("title")
                    .text(function (d) { return d.data.name + "\n" + d.value; });
                g.selectAll("text")
                    .data(root.descendants())
                    .enter()
                    .append("text")
                    .attr("fill", "black")
                    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
                    .attr("dy", "5px")
                    .attr("font", "10px")
                    .attr("text-anchor", "middle")
                    .on("click", click)
                    .text(function (d) { return d.data.name; });
                this.HtmlElement.appendChild(svg._groups[0][0]);
                function click(d) {
                    //TODO : click sur un autre : tous les éléments reprennent leur couleur initiale                    
                    d3.selectAll("path").style("fill", function (d) {
                        while (d.depth > 1)
                            d = d.parent;
                        if (d.depth == 0)
                            return "lightgray";
                        return colorScale(d.value);
                    });
                    d3.select(this).style("fill", "yellow");
                    d3.selectAll("text").style("fill", "black");
                    //alert(d.data.value);
                    //var tween = g.transition()
                    //    .duration(500)
                    //    .tween("scale", function () {
                    //        var xdomain = d3.interpolate(xScale.domain(), [d.x0, d.x1]);
                    //        var ydomain = d3.interpolate(rScale.domain(), [d.y0, 1]);
                    //        var yrange = d3.interpolate(rScale.range(), [d.y0 ? backCircleRadius : centerRadius, radius]);
                    //        return function (t) {
                    //            xScale.domain(xdomain(t));
                    //            rScale.domain(ydomain(t)).range(yrange(t));
                    //        };
                    //    });
                    //tween.selectAll("path")
                    //.attrTween("d", function (d) {
                    //    return function () {
                    //        return arc(d);
                    //    };
                    //});
                    //tween.selectAll("text")
                    //.attrTween("transform", function (d) {
                    //    return function () {
                    //        return "translate(" + arc.centroid(d) + ")";
                    //    };
                    //})
                    //.attrTween("opacity", function (d) {
                    //    return function () {
                    //        return (xScale(d.x0) < 2 * Math.PI) && (xScale(d.x1) > 0.0) && (rScale(d.y1) > 0.0) ? 1.0 : 0;
                    //    };
                    //})
                    //.attrTween("font", function (d) {
                    //    return function () {
                    //        return (xScale(d.x0) < 2 * Math.PI) && (xScale(d.x1) > 0.0) && (rScale(d.y1) > 0.0) ? "10px" : 1e-6;
                    //    };
                    //});
                }
            };
            return InteractiveWheel;
        }(DataControl));
        Controls.InteractiveWheel = InteractiveWheel;
        var MediaRecorderControl = /** @class */ (function (_super) {
            __extends(MediaRecorderControl, _super);
            //constructor(control: Element = null) {
            //    super(control);
            function MediaRecorderControl() {
                var _this = _super.call(this) || this;
                //public OnLocalSave: (blob: Blob, extension: string) => void;
                _this.IsRecording = false; // Pour test
                _this.CanRecord = false; // Pour test
                //public _RecordType: string = "Video"; // Video | Sound | Picture  //TODO
                _this._OnStopAction = "UploadOnServer"; // Upload, Save, Nothing
                _this._DisplayDuringRecord = "Icon"; // Nothing, Text, Icon, LiveStream
                _this._TextDisplayedDuringRecord = ""; // Si _DisplayDuringRecord == "Text"
                _this._StartMode = "PageLoaded"; // PageLoaded, ClickOnStart, ClickOnStartRecord
                _this._StopMode = "PageChanged"; // PageChanged, ClickOnStop, ClickOnStopRecord
                _this._MaxDuration = 30;
                _this._FacingMode = "user"; // user|environment
                _this._IsImperative = false; // Pour test
                //if (control != null) {
                //    this.setPropertyFromXaml(control, "RecordType", "_RecordType");
                //    //this.setPropertyFromXaml(control, "StartWithStartButton", "_StartWithStartButton");
                //    //this.setPropertyFromXaml(control, "StopWithStopButton", "_StopWithStopButton");
                //    //this.setPropertyFromXaml(control, "UploadOnStop", "_UploadOnStop");
                //    //this.setPropertyFromXaml(control, "ShowPreview", "_ShowPreview");
                //    //this.setPropertyFromXaml(control, "ShowLiveStream", "_ShowLiveStream");
                //    this.setPropertyFromXaml(control, "StartMode", "_StartMode");
                //    this.setPropertyFromXaml(control, "StopMode", "_StopMode");
                //    this.setPropertyFromXaml(control, "OnStopAction", "_OnStopAction");
                //    this.setPropertyFromXaml(control, "DisplayDuringRecord", "_DisplayDuringRecord");
                //    this.setPropertyFromXaml(control, "TextDisplayedDuringRecord", "_TextDisplayedDuringRecord");
                //    //this._RecordType = this.getPropertyFromXaml<string>(control, "RecordType", "Video");
                //    //this._StartWithStartButton = this.getPropertyFromXaml<boolean>(control, "StartWithStartButton", true);
                //    //this._StopWithStopButton = this.getPropertyFromXam*$ù^^^^^^^^^é"p)=l<boolean>(control, "StopWithStopButton", true);
                //    //this._UploadOnStop = this.getPropertyFromXaml<boolean>(control, "UploadOnStop", true);
                //    //this._ShowPreview = this.getPropertyFromXaml<boolean>(control, "ShowPreview", false);
                //    //this._ShowLiveStream = this.getPropertyFromXaml<boolean>(control, "ShowLiveStream", true);
                //    //let mediaRecorderActions = getPropertyFromAttribute<string>(control, "MediaRecorderActions", "[\"Record\",\"Pause\",\"Stop\",\"See\",\"Save\",\"Upload\"]");
                //    //this.MediaRecorderActions = JSON.parse(mediaRecorderActions);
                //}
                //this._Type = "MediaRecorderControl";
                _this.showExperimentalDesignProperty = false;
                return _this;
            }
            //public static RecordTypeEnum: string[] = ["Video", "Sound", "Picture"];
            //private validate() {
            //    if (this._IsImperative == true && this.isCompatibleWithBrowser == true && this.IsValid == false) {                    
            //        // Message d'erreur
            //        this.ValidationMessage = Framework.LocalizationManager.Get("MandatoryRecord");
            //    }
            //}
            MediaRecorderControl.prototype.CheckCompatibility = function () {
                //let isCompatible: boolean = true;
                var res = Framework.CanIUse.CheckBrowser.GetBrowserCompatibitityResult("stream");
                //if (!Modernizr.getusermedia) {
                //    isCompatible = false;
                //}
                //if (isCompatible == false) {
                //    return "https://caniuse.com/#search=getusermedia";
                //}
                if (res.CurrentBrowserCompatible == false) {
                    return res.CompatibleBrowsers;
                }
                return "";
            };
            MediaRecorderControl.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                this.IsValid = true;
                if (this.isCompatibleWithBrowser == false) {
                    return;
                }
                if (this._IsImperative == true) {
                    this.IsValid = false;
                    this.ValidationMessage = Framework.LocalizationManager.Get("MandatoryRecord");
                }
                var self = this;
                //https://htmlpreview.github.io/?https://github.com/Azure-Samples/SpeechToText-WebSockets-Javascript/blob/preview/samples/browser/Sample.html
                //Key (cognitive service):980d81abdebf419d92e0c1b7a5bd5e10
                //Key (api) 6d2194cdb9f64890b8660d400e0c072f
                this.videoElement = document.createElement("video");
                this.videoElement.controls = false;
                this.videoElement.autoplay = true;
                this.videoElement.style.background = "white";
                this.videoElement.style.height = (this._Height) * ratio + "px";
                //this.videoElement.style.height = Math.max(60, this._Height - 32) + "px";
                this.videoElement.style.width = (this._Width) * ratio + "px";
                //this.videoElement.style.width = "auto";
                //this.videoElement.style.border = "1px solid black";
                this.HtmlElement.style.background = "white";
                this.HtmlElement.style.border = "white";
                this.HtmlElement.appendChild(this.videoElement);
                this.div = document.createElement("div");
                this.HtmlElement.appendChild(this.div);
                //let pauseBtn: HTMLButtonElement = document.createElement("button");
                //pauseBtn.classList.add("pauseButton");
                //pauseBtn.classList.add("mediaRecorderButton");
                //pauseBtn.title = Localization.Localize("Pause");
                //div.appendChild(pauseBtn);
                //let stopBtn: HTMLButtonElement = document.createElement("button");
                //if (this._RecordType == "Video" && this._StopMode == "ClickOnStopRecord") {
                //    stopBtn.classList.add("stopButton");
                //    stopBtn.classList.add("mediaRecorderButton");
                //    stopBtn.title = Framework.LocalizationManager.Get("Stop");
                //    div.appendChild(stopBtn);
                //}
                //let showBtn: HTMLButtonElement = document.createElement("button");
                //showBtn.classList.add("showButton");
                //showBtn.classList.add("mediaRecorderButton");
                //showBtn.title = Localization.Localize("Show");
                //div.appendChild(showBtn);
                this.hidden_canvas = document.createElement("canvas");
                this.CanRecord = true;
                //stopBtn.addEventListener('click', function () {
                //    recBtn.disabled = false;
                //    stopBtn.disabled = true;
                //    self.StopRecord();
                //});
                //pauseBtn.addEventListener('click', pauseRecording);
                //showBtn.addEventListener('click', function () { showRecord });
                //let audio: boolean = (this.RecordType == "Video" || this.RecordType == "Audio");
                //let video: boolean = (this.RecordType == "Video" || this.RecordType == "Picture");
                var constraints = {
                    advanced: [{
                            facingMode: self._FacingMode
                        }]
                };
                if (editMode == false) {
                    navigator.mediaDevices.getUserMedia({
                        //TODO : Video, Audio, Picture
                        audio: true,
                        video: constraints
                    })
                        .then(function (stream) {
                        self.liveStream = stream;
                        try {
                            self.videoElement.srcObject = stream;
                        }
                        catch (error) {
                            self.videoElement.src = window.URL.createObjectURL(stream);
                        }
                        self.videoElement.muted = true;
                        self.videoElement.play();
                        self.recorder = new MediaRecorder(self.liveStream);
                        self.recorder.addEventListener('dataavailable', function (e) { return self.onRecordingReady(e); });
                        //recBtn.disabled = true;
                        //stopBtn.disabled = false;
                        //self.recorder.start();
                        //self.IsRecording = true;
                        //self.setDisplay();
                        //         recBtn.disabled = false;
                    });
                }
                //function pauseRecording() {
                //    recorder.pause();
                //}
            };
            MediaRecorderControl.prototype.convertControl = function (control, callback) {
                var self = this;
                if (self._Type == "PhotoRecorder") {
                    //let image: HTMLImageElement = document.createElement("img");
                    // Get the exact size of the video element.
                    var width = this.videoElement.videoWidth;
                    var height = this.videoElement.videoHeight;
                    // Context object for working with the canvas.
                    var context = this.hidden_canvas.getContext('2d');
                    // Set the canvas to the same dimensions as the video.
                    this.hidden_canvas.width = width;
                    this.hidden_canvas.height = height;
                    // Draw a copy of the current frame from the video on the canvas.
                    context.drawImage(this.videoElement, 0, 0, width, height);
                    //// Get an image dataURL from the canvas.
                    //var imageDataURL = this.hidden_canvas.toDataURL('image/png');
                    //// Set the dataURL as source of an image element, showing the captured photo.
                    //image.setAttribute('src', imageDataURL);
                    //var context = this.hidden_canvas.getContext('2d');
                    //this.hidden_canvas.width = control.width;
                    //this.hidden_canvas.height = control.height;
                    //context.drawImage(control, 0, 0, control.width, control.height);
                    this.hidden_canvas.toBlob(function (blob) {
                        callback(blob, self.extension);
                    });
                }
                if (self._Type == "VideoRecorder") {
                    callback(this.videoData, this.extension);
                }
            };
            //private showRecord(control: HTMLImageElement | HTMLVideoElement) {
            //    let self = this;
            //    let modal: HTMLDivElement = document.createElement("div");
            //    //modal.style.position = "fixed";
            //    //modal.style.top = "50%";
            //    //modal.style.left = "50%";
            //    //modal.style.transform = "translate(-50%,-50%)";
            //    //modal.style.boxShadow = "0px 0px 1px 5000px rgba(0,0,0,0.8)";
            //    let extension = "";
            //    if (control) {
            //        modal.appendChild(control);
            //    }
            //    let buttonsDiv: HTMLDivElement = document.createElement("div");
            //    buttonsDiv.style.textAlign = "right";
            //    modal.appendChild(buttonsDiv);
            //    //let saveBtn: HTMLButtonElement = document.createElement("button");
            //    //saveBtn.classList.add("saveButton");
            //    //saveBtn.classList.add("mediaRecorderButton");
            //    //saveBtn.title = Framework.LocalizationManager.Get("Save");
            //    //saveBtn.onclick = function () {
            //    //    // Enregistrement sur disque local
            //    //    self.convertControl(control, function (blob, extension) {
            //    //        //saveAs(blob, name + "." + extension);
            //    //        self.OnSave(blob, self.extension);
            //    //    });
            //    //};
            //    //buttonsDiv.appendChild(saveBtn);
            //    //let uploadBtn: HTMLButtonElement = document.createElement("button");
            //    //uploadBtn.classList.add("uploadButton");
            //    //uploadBtn.classList.add("mediaRecorderButton");
            //    //uploadBtn.title = Framework.LocalizationManager.Get("Upload");
            //    //uploadBtn.onclick = function () {
            //    //    // Upload sur le serveur
            //    //    self.convertControl(control, function (blob, extension) {
            //    //        self.blobToBase64(blob, function (base64) {
            //    //            self.OnUpload(base64, self.extension);
            //    //        });
            //    //    });
            //    //};
            //    //buttonsDiv.appendChild(uploadBtn);
            //    //let closeBtn: HTMLButtonElement = document.createElement("button");
            //    //closeBtn.classList.add("closeButton");
            //    //closeBtn.classList.add("mediaRecorderButton");
            //    //closeBtn.title = Framework.LocalizationManager.Get("Close");
            //    //closeBtn.onclick = function () {
            //    //    $(modal).dialog("close");
            //    //};
            //    //buttonsDiv.appendChild(closeBtn);
            //    this.HtmlElement.appendChild(modal);
            //    $(modal).dialog({
            //        resizable: false,
            //        modal: true,
            //        width: 'auto',
            //        height: 'auto',
            //        title: 'screenshot'
            //    }); //TODO : modal, center
            //}
            MediaRecorderControl.prototype.onRecordingReady = function (e) {
                // e.data contains a blob representing the recording
                //recorder.stop();           
                var self = this;
                this.videoData = e.data;
                var v = document.createElement("video");
                v.src = URL.createObjectURL(this.videoData);
                if (this._OnStopAction == "Nothing") {
                    //self.StopRecord();
                    return;
                }
                this.convertControl(v, function (blob, name) {
                    if (self.OnSave && (self._OnStopAction == "Save" || self._OnStopAction == "SaveAndUpload")) {
                        self.OnSave(blob, self.extension);
                        //self.StopRecord();
                    }
                    Framework.BlobHelper.BlobToBase64(blob, function (base64) {
                        //self.OnLocalSave(base64, self.extension);
                        if (self.OnUpload && (self._OnStopAction == "UploadOnServer" || self._OnStopAction == "SaveAndUpload")) {
                            self.OnUpload(base64, self.extension);
                            //self.StopRecord();
                        }
                    });
                });
                //if (this._OnStopAction == "Save" || this._OnStopAction == "SaveAndUpload") {
                //    this.convertControl(v, function (blob, name) {
                //        self.OnSave(blob, self.extension);
                //    });
                //}
                //if (this._OnStopAction == "Upload" || this._OnStopAction == "SaveAndUpload") {
                //    this.convertControl(v, function (blob, name) {
                //        self.blobToBase64(blob, function (base64) {
                //            self.OnUpload(base64, self.extension);
                //        });
                //    });
                //}
                //if (this._ShowPreview == true) {
                //    v.controls = true;
                //    v.autoplay = true;
                //    this.showRecord(v);
                //}
            };
            MediaRecorderControl.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition" || mode == "creation") {
                    var btnSetOnStopAction = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "RecorderOnStopAction", self._OnStopAction, ScreenReader.Controls.MediaRecorderControl.OnStopActionEnum, function (x) {
                        self.changeProperty("_OnStopAction", x);
                    }, true);
                    properties.push(btnSetOnStopAction);
                    var btnSetFacingMode = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "FacingMode", self._FacingMode, ScreenReader.Controls.MediaRecorderControl.FacingModeEnum, function (x) {
                        self.changeProperty("_FacingMode", x);
                    }, true);
                    properties.push(btnSetFacingMode);
                    var btnIsImperative = Framework.Form.PropertyEditorWithToggle.Render("Parameters", "Imperative", self._IsImperative, function (x) { self._IsImperative = x; });
                    properties.push(btnIsImperative);
                    var btnMaxTime = Framework.Form.PropertyEditorWithNumericUpDown.Render("Parameters", "MaxDuration", self._MaxDuration, 0, 300, function (x) { self._MaxDuration = x; });
                    properties.push(btnMaxTime);
                }
                return properties;
            };
            MediaRecorderControl.prototype.setDisplay = function () {
                var self = this;
                if (self._DisplayDuringRecord == "Icon") {
                    self.HtmlElement.innerHTML = '<i class="fas fa-video blink" > </i>';
                    self.videoElement.style.opacity = "0";
                }
                if (self._DisplayDuringRecord == "Text") {
                    self.HtmlElement.style.fontSize = "24px";
                    self.HtmlElement.innerHTML = this._TextDisplayedDuringRecord;
                    self.videoElement.style.opacity = "0";
                }
                if (self._DisplayDuringRecord == "Nothing") {
                    self.HtmlElement.innerHTML = "";
                    self.videoElement.style.opacity = "0";
                }
            };
            MediaRecorderControl.prototype.StartRecord = function () {
                var self = this;
                if (self.recorder == undefined) {
                    setTimeout(function () {
                        self.StartRecord();
                        if (self._StopMode == "MaxDuration") {
                            setTimeout(function () {
                                self.StopRecord();
                            }, self._MaxDuration * 1000);
                        }
                    }, 500);
                }
                else {
                    self.recorder.start();
                    self.IsRecording = true;
                    self.setDisplay();
                }
            };
            MediaRecorderControl.prototype.StopRecord = function () {
                try {
                    var self_2 = this;
                    //if (this.liveStream) {
                    //    this.liveStream.stop();
                    //}
                    if (this.recorder) {
                        this.recorder.stop();
                        this.HtmlElement.innerHTML = "";
                    }
                    this.IsRecording = false;
                }
                catch (_a) { }
            };
            MediaRecorderControl.StartModeEnum = ["PageLoaded", "ClickOnStartButton", "ClickOnStartRecord"];
            MediaRecorderControl.StopModeEnum = ["PageChanged", "ClickOnStopButton", "ClickOnStopRecord", "MaxDuration"];
            MediaRecorderControl.DisplayDuringRecordEnum = ["Nothing", "Text", "Icon", "LiveStream"];
            MediaRecorderControl.OnStopActionEnum = ["UploadOnServer", "Save", "SaveAndUpload", "Nothing"];
            MediaRecorderControl.FacingModeEnum = ["user", "environment"];
            return MediaRecorderControl;
        }(DataControl));
        Controls.MediaRecorderControl = MediaRecorderControl;
        var VideoRecorder = /** @class */ (function (_super) {
            __extends(VideoRecorder, _super);
            function VideoRecorder() {
                var _this = _super.call(this) || this;
                _this._Type = "VideoRecorder";
                _this.extension = "webm";
                return _this;
            }
            VideoRecorder.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                if (this.isCompatibleWithBrowser == false) {
                    return;
                }
                var self = this;
                var recBtn = document.createElement("button");
                if (this._StartMode == "ClickOnStartRecord") {
                    recBtn.classList.add("recordButton");
                    recBtn.classList.add("mediaRecorderButton");
                    recBtn.title = Framework.LocalizationManager.Get("Record");
                    this.div.appendChild(recBtn);
                }
                recBtn.addEventListener('click', function () {
                    recBtn.disabled = true;
                    //stopBtn.disabled = false;
                    self.StartRecord();
                    self.IsValid = true;
                    self.ValidationMessage = "";
                });
            };
            VideoRecorder.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition" || mode == "creation") {
                    var btnSetStartMode = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "RecorderStartMode", self._StartMode, ScreenReader.Controls.VideoRecorder.StartModeEnum, function (x) {
                        self.changeProperty("_StartMode", x);
                    }, true);
                    properties.push(btnSetStartMode);
                    var btnSetStopMode = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "RecorderStopMode", self._StopMode, ScreenReader.Controls.VideoRecorder.StopModeEnum, function (x) {
                        self.changeProperty("_StopMode", x);
                    }, true);
                    properties.push(btnSetStopMode);
                    var setTextDisplayedDuringRecordVisibility_1 = function () {
                        if (self._DisplayDuringRecord == "Text") {
                            btnSetTextDisplayedDuringRecord_1.Editor.Show();
                        }
                        else {
                            btnSetTextDisplayedDuringRecord_1.Editor.Hide();
                        }
                    };
                    var btnSetDisplayDuringRecord = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "DisplayDuringRecord", self._DisplayDuringRecord, ScreenReader.Controls.VideoRecorder.DisplayDuringRecordEnum, function (x) {
                        self.changeProperty("_DisplayDuringRecord", x);
                        setTextDisplayedDuringRecordVisibility_1();
                    }, true);
                    properties.push(btnSetDisplayDuringRecord);
                    var btnSetTextDisplayedDuringRecord_1 = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "TextDisplayedDuringRecord", self._TextDisplayedDuringRecord, function (x) {
                        self.changeProperty("_TextDisplayedDuringRecord", x);
                    });
                    properties.push(btnSetTextDisplayedDuringRecord_1);
                    setTextDisplayedDuringRecordVisibility_1();
                }
                return properties;
            };
            VideoRecorder.Create = function () {
                var control = new VideoRecorder();
                control._Height = 600;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                return control;
            };
            return VideoRecorder;
        }(MediaRecorderControl));
        Controls.VideoRecorder = VideoRecorder;
        var PhotoRecorder = /** @class */ (function (_super) {
            __extends(PhotoRecorder, _super);
            function PhotoRecorder() {
                var _this = _super.call(this) || this;
                _this._Type = "PhotoRecorder";
                _this._DisplayDuringRecord = "LiveStream";
                _this.extension = "png";
                return _this;
            }
            PhotoRecorder.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                if (this.isCompatibleWithBrowser == false) {
                    return;
                }
                var self = this;
                this.pictureBtn = document.createElement("button");
                this.pictureBtn.classList.add("pictureButton");
                this.pictureBtn.classList.add("mediaRecorderButton");
                this.pictureBtn.title = Framework.LocalizationManager.Get("Picture");
                this.pictureBtn.style.position = "absolute";
                this.pictureBtn.style.right = "0";
                this.pictureBtn.style.bottom = "0";
                this.pictureBtn.style.height = "64px";
                this.pictureBtn.style.width = "64px";
                this.div.appendChild(this.pictureBtn);
                this.pictureBtn.addEventListener('click', function () {
                    self.takeSnapshot();
                    self.IsValid = true;
                    self.ValidationMessage = "";
                });
            };
            PhotoRecorder.prototype.takeSnapshot = function () {
                if (this.videoElement.paused == false) {
                    //let image: HTMLImageElement = document.createElement("img");
                    //// Get the exact size of the video element.
                    //var width = this.videoElement.videoWidth;
                    //var height = this.videoElement.videoHeight;
                    //// Context object for working with the canvas.
                    //var context = this.hidden_canvas.getContext('2d');
                    //// Set the canvas to the same dimensions as the video.
                    //this.hidden_canvas.width = width;
                    //this.hidden_canvas.height = height;
                    //// Draw a copy of the current frame from the video on the canvas.
                    //context.drawImage(this.videoElement, 0, 0, width, height);
                    //// Get an image dataURL from the canvas.
                    //var imageDataURL = this.hidden_canvas.toDataURL('image/png');
                    //// Set the dataURL as source of an image element, showing the captured photo.
                    //image.setAttribute('src', imageDataURL);
                    this.videoElement.pause();
                    var div = document.createElement("div");
                    div.innerHTML = Framework.LocalizationManager.Get("PictureTaken");
                    Framework.Popup.Show(this.pictureBtn, div, "top");
                }
                else {
                    this.videoElement.play();
                }
            };
            PhotoRecorder.Create = function () {
                var control = new PhotoRecorder();
                control._Height = 600;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                return control;
            };
            return PhotoRecorder;
        }(MediaRecorderControl));
        Controls.PhotoRecorder = PhotoRecorder;
        var RandomPrice = /** @class */ (function (_super) {
            __extends(RandomPrice, _super);
            function RandomPrice() {
                var _this = _super.call(this) || this;
                _this._Prices = "";
                _this.ListControlNames = [];
                _this._WinText = "Win";
                _this._LoseText = "Did'nt win";
                _this._DrawingProductText = "Drawing product...";
                _this._DrawingPriceText = "Drawing random price...";
                _this._DrawnProductText = "Drawn product:";
                _this._ReservePriceText = "Your reserve price:";
                _this._RandomPriceText = "Random price:";
                _this._ResultText = "Result:";
                _this._Type = "RandomPrice";
                return _this;
            }
            RandomPrice.Create = function () {
                var control = new RandomPrice();
                control._Height = 600;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                return control;
            };
            RandomPrice.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition" || mode == "creation") {
                    //let validateFormSetControlId = () => {
                    //    if (self._AssociatedControlId == undefined || self._AssociatedControlId.length == 0) {
                    //        formSetControlId.ValidationResult = Framework.LocalizationManager.Get("EnterControlID");
                    //    }
                    //    formSetControlId.Check();
                    //}
                    var form_WinTextProperty = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "Win text", this._WinText, function (x) {
                        self.changeProperty("_WinText", x);
                    });
                    properties.push(form_WinTextProperty);
                    var form_LoseTextProperty = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "Lose text", this._LoseText, function (x) {
                        self.changeProperty("_LoseText", x);
                    });
                    properties.push(form_LoseTextProperty);
                    var form_DrawingProductTextProperty = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "Drawing product text", this._DrawingProductText, function (x) {
                        self.changeProperty("_DrawingProductText", x);
                    });
                    properties.push(form_DrawingProductTextProperty);
                    var form_DrawingPriceTextProperty = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "Drawing price text", this._DrawingPriceText, function (x) {
                        self.changeProperty("_DrawingPriceText", x);
                    });
                    properties.push(form_DrawingPriceTextProperty);
                    var formDrawedProductTextProperty = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "Drawn product text", this._DrawnProductText, function (x) {
                        self.changeProperty("_DrawnProductText", x);
                    });
                    properties.push(formDrawedProductTextProperty);
                    var form_ReservePriceTextProperty = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "Reserve price text", this._ReservePriceText, function (x) {
                        self.changeProperty("_ReservePriceText", x);
                    });
                    properties.push(form_ReservePriceTextProperty);
                    var form_RandomPriceTextProperty = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "Random price text", this._RandomPriceText, function (x) {
                        self.changeProperty("_RandomPriceText", x);
                    });
                    properties.push(form_RandomPriceTextProperty);
                    var form_ResultTextProperty = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "Result text", this._ResultText, function (x) {
                        self.changeProperty("_ResultText", x);
                    });
                    properties.push(form_ResultTextProperty);
                    if ((self._AssociatedControlId == "" || self._AssociatedControlId == undefined) && self.ListControlNames.length > 0) {
                        self._AssociatedControlId = self.ListControlNames[0];
                    }
                    if (self.ListControlNames.length == 0) {
                        self._AssociatedControlId = "";
                    }
                    var formSetControlId = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "ControlID", self._AssociatedControlId, self.ListControlNames, function (x) {
                        self.changeProperty("_AssociatedControlId", x);
                        //validateFormSetControlId();
                    });
                    properties.push(formSetControlId);
                    //validateFormSetControlId();               
                    var formPricesProperty = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "Prices", this._Prices, function (x) {
                        self.changeProperty("_Prices", x);
                    });
                    properties.push(formPricesProperty);
                }
                return properties;
            };
            RandomPrice.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                this.HtmlElement.innerHTML = "";
                this.HtmlElement.style.fontFamily = "Arial";
                var self = this;
                if (editMode == false) {
                    // Prix
                    var prices = this._Prices.replace(" ", "").replace(",", ".").split(";");
                    //[1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5, 5, 6, 6, 6, 7, 7, 7, 7];
                    // Tirage au sort du produit
                    var codes = this.ExperimentalDesign.ListItems.map(function (x) { return x.Code; });
                    Framework.Array.Shuffle(codes);
                    var code_1 = codes[0];
                    var label_2 = (this.ExperimentalDesign.ListItems.filter(function (x) { return x.Code == code_1; })[0]).Labels[0].Value;
                    // Tirage au sort du prix
                    Framework.Array.Shuffle(prices);
                    var price_1 = prices[0];
                    // Résultat
                    var reservePrice_1 = 0;
                    if (this.ProductPrices != undefined && this._AssociatedControlId != undefined) {
                        var data = this.ProductPrices.filter(function (x) { return x.ProductCode == code_1; });
                        if (data.length > 0) {
                            reservePrice_1 = Number(data[0].Description.replace(",", "."));
                        }
                    }
                    var result_1 = this._LoseText;
                    if (reservePrice_1 >= Number(price_1)) {
                        result_1 = this._WinText;
                    }
                    this.ListData = [];
                    var d = new Models.Data();
                    d.AttributeRank = null;
                    d.DataControlId = this._Id;
                    d.ControlName = this._FriendlyName;
                    d.ProductCode = code_1;
                    d.ProductRank = null;
                    d.Replicate = this.Replicate;
                    d.Intake = this.Intake;
                    d.Score = Number(price_1);
                    d.Session = this.UploadId;
                    d.SubjectCode = this.SubjectCode;
                    d.RecordedDate = new Date(Date.now());
                    d.Description = result_1;
                    d.AttributeCode = result_1;
                    d.Type = "BDM";
                    this.ListData.push(d);
                    this.HtmlElement.innerHTML = "<i class='fas fa-spinner fa-spin'></i>" + this._DrawingProductText;
                    setTimeout(function () {
                        var text = self._DrawnProductText + " " + label_2 + "<br/><br/>";
                        text += self._ReservePriceText + " " + reservePrice_1 + "<br/><br/>";
                        self.HtmlElement.innerHTML = text;
                        setTimeout(function () {
                            self.HtmlElement.innerHTML = text + "<i class='fas fa-spinner fa-spin'></i>" + self._DrawingPriceText;
                            setTimeout(function () {
                                text += self._RandomPriceText + " " + price_1 + "<br/><br/>";
                                text += self._ResultText + " " + result_1 + "!";
                                self.HtmlElement.innerHTML = text;
                            }, 2000);
                        }, 2000);
                    }, 2000);
                    //this.HtmlElement.innerHTML = "Random code: " + code + ", random price: " + price + ", reserve price: " + reservePrice + ", result" + result;
                }
                else {
                    this.HtmlElement.innerHTML = "-";
                }
            };
            return RandomPrice;
        }(DataControl));
        Controls.RandomPrice = RandomPrice;
        var ExternalDocument = /** @class */ (function (_super) {
            __extends(ExternalDocument, _super);
            function ExternalDocument() {
                var _this = _super.call(this) || this;
                _this.showExperimentalDesignProperty = false;
                _this._Type = "ExternalDocument";
                return _this;
            }
            ExternalDocument.Create = function () {
                var control = new ExternalDocument();
                control._Height = 600;
                control._Width = 600;
                control.DefaultLeftCoordinate = "Center";
                control.DefaultTopCoordinate = "Center";
                return control;
            };
            ExternalDocument.prototype.GetEditableProperties = function (mode) {
                if (mode === void 0) { mode = "edition"; }
                var self = this;
                var properties = _super.prototype.GetEditableProperties.call(this, mode);
                if (mode == "edition" || mode == "creation") {
                    var btnSetFixedPartDocumentURL = Framework.Form.PropertyEditorWithTextInput.Render("Parameters", "FixedPartDocumentURL", self._FixedPartDocumentURL, function (x) {
                        self.changeProperty("_FixedPartDocumentURL", x);
                        self.render();
                    });
                    properties.push(btnSetFixedPartDocumentURL);
                    var btnSetVariablePartDocumentURL = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "VariablePartDocumentURL", self._VariablePartDocumentURL, ["None", "Product", "Subject"], function (x) {
                        self.changeProperty("_VariablePartDocumentURL", x);
                        self.render();
                    }, true);
                    properties.push(btnSetVariablePartDocumentURL);
                    var btnSetExtension = Framework.Form.PropertyEditorWithPopup.Render("Parameters", "Extension", self._Extension, [".pdf", ".png", ".jpg", ".html"], function (x) {
                        self.changeProperty("_Extension", x);
                        self.render();
                    }, true);
                    properties.push(btnSetExtension);
                }
                return properties;
            };
            ExternalDocument.prototype.render = function () {
                this.HtmlElement.innerHTML = "";
                var url = this._FixedPartDocumentURL;
                if (this._VariablePartDocumentURL == "Product") {
                    url += this.ProductCode;
                }
                if (this._VariablePartDocumentURL == "Subject") {
                    url += this.SubjectCode;
                }
                url += this._Extension;
                if (this._Extension == ".html" || this._Extension == ".pdf") {
                    var iframe = document.createElement('iframe');
                    iframe.src = url;
                    iframe.height = this._Height + "px";
                    iframe.width = this._Width + "px";
                    iframe.border = "0";
                    this.HtmlElement.appendChild(iframe);
                }
                if (this._Extension == ".png" || this._Extension == ".jpg") {
                    var image = document.createElement("img");
                    //this.HtmlElement.style.borderWidth = this._BorderThickness + "px";
                    //this.HtmlElement.style.borderColor = this._BorderBrush;
                    //this.HtmlElement.style.borderStyle = "solid";
                    //this.HtmlElement.style.textAlign = "center";
                    image.src = url;
                    image.style.maxWidth = "100%";
                    image.style.maxHeight = "100%";
                    image.style.opacity = this._Opacity.toString();
                    this.HtmlElement.appendChild(image);
                }
            };
            ExternalDocument.prototype.Render = function (editMode, ratio) {
                if (editMode === void 0) { editMode = false; }
                _super.prototype.Render.call(this, editMode, ratio);
                this.render();
            };
            return ExternalDocument;
        }(DataControl));
        Controls.ExternalDocument = ExternalDocument;
        //class TDSTutorialEvent {
        //    public Color: string;
        //    public GoodAnswer: number;
        //    public ReactionTime: number;
        //    public DisplayTime: number;
        //    public EvaluationNumber: number;
        //    constructor(color: string, displayTime: number, evaluationNumber = 1) {
        //        this.Color = color;
        //        this.DisplayTime = displayTime;
        //        this.ReactionTime = displayTime;
        //        this.GoodAnswer = 0;
        //        this.EvaluationNumber = evaluationNumber;
        //    }
        //}
        //export class TDSTutorial extends BaseControl {
        //    private listEvents: TDSTutorialEvent[];
        //    private colorDiv: HTMLDivElement;
        //    private startButton: CustomButton;
        //    private evaluationNumber: number = 1;
        //    private currentEvent: TDSTutorialEvent;
        //    private currentTime: number;
        //    public OnSuccess: (events: TDSTutorialEvent[]) => void = () => { };
        //    public _MaxEvaluation: number = 2;
        //    public _MinScore: number = 6;
        //    public _MinReactionTime: number = 4;
        //    public _Colors: string[] = ["green", "yellow", "red", "pink", "blue", "gray", "black", "orange"];
        //    public _TutorialEvents: TDSTutorialEvent[] = [
        //        new TDSTutorialEvent("green", 8),
        //        new TDSTutorialEvent("yellow", 6),
        //        new TDSTutorialEvent("blue", 4),
        //        new TDSTutorialEvent("red", 4),
        //        new TDSTutorialEvent("yellow", 3),
        //        new TDSTutorialEvent("pink", 3),
        //        new TDSTutorialEvent("green", 2),
        //        new TDSTutorialEvent("gray", 2)
        //    ];
        //    constructor() {
        //        super();
        //        this._Type = "TDSTutorial";
        //    }
        //    public Render(editMode: boolean = false): void {
        //        super.Render(editMode);
        //        let self = this;
        //        this.listEvents = [];
        //        this.evaluationNumber = 1;
        //        this.colorDiv = document.createElement("div");
        //        this.colorDiv.style.height = "300px";
        //        this.colorDiv.style.width = "580px";
        //        this.colorDiv.style.top = "1px";
        //        this.colorDiv.style.left = "9px";
        //        this.colorDiv.style.position = "absolute";
        //        this.HtmlElement.appendChild(this.colorDiv);
        //        this.addStart(editMode);
        //        let top = 310;
        //        let left = 8;
        //        let index = 0;
        //        Framework.Array.Shuffle(this._Colors);
        //        this._Colors.forEach((color) => {
        //            let button = CustomButton.Create(color, "", 80, 140);
        //            button._Background = color;
        //            button._BackgroundMode = "Opaque";
        //            button._Foreground = Framework.Color.GetContrastedColor(color);
        //            button._Left = left;
        //            button._Top = top;
        //            if (editMode == false) {
        //                button.OnClick = () => {
        //                    if (button._Background == self.currentEvent.Color) {
        //                        self.currentEvent.GoodAnswer = 1;
        //                        self.currentEvent.ReactionTime = self.currentTime / 1000;
        //                    } else {
        //                        self.currentEvent.GoodAnswer = 0;
        //                        self.currentEvent.ReactionTime = self.currentEvent.DisplayTime;
        //                    }
        //                };
        //            }
        //            button.Render();
        //            self.HtmlElement.appendChild(button.HtmlElement);
        //            left += 148;
        //            index++;
        //            if (index == 4) {
        //                left = 8;
        //                top += 100;
        //                index = 0;
        //            }
        //        });
        //    }
        //    private addStart(editMode: boolean = false) {
        //        let self = this;
        //        this.startButton = CustomButton.Create("START", "", 200, 200);
        //        this.startButton._Background = "lightgreen";
        //        this.startButton._Left = 200;
        //        this.startButton._Top = 90;
        //        if (editMode == false) {
        //            this.startButton.OnClick = () => {
        //                self.start();
        //            };
        //        }
        //        this.startButton.Render();
        //        this.colorDiv.appendChild(this.startButton.HtmlElement);
        //    }
        //    private start() {
        //        this._TutorialEvents.forEach((x) => {
        //            let copy = Framework.Factory.Clone(x);
        //            copy.EvaluationNumber = this.evaluationNumber;
        //            this.listEvents.push(x);
        //        });
        //        this.colorDiv.removeChild(this.startButton.HtmlElement);
        //        this.display(0);
        //    }
        //    private display(index: number) {
        //        let self = this;
        //        let event = this.listEvents[index];
        //        this.colorDiv.style.backgroundColor = event.Color;
        //        this.colorDiv.style.borderColor = event.Color;
        //        self.currentEvent = event;
        //        this.currentTime = 0;
        //        let f = setInterval(() => {
        //            if (self.currentTime == event.DisplayTime * 1000) {
        //                clearInterval(f);
        //                if (index < self.listEvents.length - 1) {
        //                    self.display(index + 1);
        //                } else {
        //                    self.showScore();
        //                }
        //            } else {
        //                self.currentTime += 100;
        //            }
        //        }, 100);
        //    }
        //    private showScore() {
        //        let self = this;
        //        let events = this.listEvents.filter((x) => { return x.EvaluationNumber == self.evaluationNumber });
        //        let cumulatedScore = 0;
        //        let cumulatedReactionTime = 0;
        //        events.forEach((e) => {
        //            cumulatedScore += e.GoodAnswer;
        //            if (e.GoodAnswer == 1) {
        //                cumulatedReactionTime += e.ReactionTime;
        //            }
        //        });
        //        let averageScore = cumulatedScore / events.length * 100;
        //        let averageReactionTime = cumulatedReactionTime / cumulatedScore;
        //        let isOK: boolean = ((cumulatedScore >= this._MinScore && averageReactionTime <= this._MinReactionTime) || this.evaluationNumber == this._MaxEvaluation);
        //        let btnText = Framework.LocalizationManager.Get("Continue");
        //        if (isOK == false) {
        //            btnText = Framework.LocalizationManager.Get("StartAgain");
        //        }
        //        let div = document.createElement("div");
        //        let p1 = document.createElement("p");
        //        p1.innerHTML = Framework.LocalizationManager.Format("TDSTutorialEvaluationNumber", [this.evaluationNumber.toString()]);
        //        div.appendChild(p1);
        //        let p2 = document.createElement("p");
        //        let averageScoreColor = "green";
        //        if (cumulatedScore < this._MinScore) {
        //            averageScoreColor = "red";
        //        }
        //        p2.style.color = averageScoreColor;
        //        p2.innerHTML = Framework.LocalizationManager.Format("TDSTutorialScore", [Framework.Maths.Round(averageScore, 2).toString()]);
        //        div.appendChild(p2);
        //        let p3 = document.createElement("p");
        //        let averageReactionTimeColor = "green";
        //        if (averageReactionTime > this._MinReactionTime) {
        //            averageReactionTimeColor = "red";
        //        }
        //        p3.style.color = averageReactionTimeColor;
        //        p3.innerHTML = Framework.LocalizationManager.Format("TDSTutorialReactionTime", [Framework.Maths.Round(averageReactionTime, 2).toString()]);
        //        div.appendChild(p3);
        //        let p4 = document.createElement("p");
        //        if (isOK == true) {
        //            p4.innerHTML = Framework.LocalizationManager.Get("TDSTutorialResultOK");
        //        } else {
        //            p4.innerHTML = Framework.LocalizationManager.Get("TDSTutorialResultKO");
        //        }
        //        div.appendChild(p4);
        //        Framework.Modal.Alert(Framework.LocalizationManager.Get("TDSTrainingResult"), div, () => {
        //            if (isOK == false) {
        //                self.evaluationNumber++;
        //                self.colorDiv.style.backgroundColor = "transparent";
        //                self.addStart();
        //            } else {
        //                self.OnSuccess(self.listEvents);
        //                //TODO : click on next + mémoriser les scores
        //            }
        //        }, btnText);
        //    }
        //    public static Create(): TDSTutorial {
        //        let control: TDSTutorial = new TDSTutorial();
        //        control._Height = 600;
        //        control._Width = 600;
        //        control.DefaultTopCoordinate = "Center";
        //        control.DefaultLeftCoordinate = "Center";
        //        return control;
        //    }
        //}
        //export class BarcodeReader extends DataControl {
        //    //TODO : enregistrement
        //    private _scannerIsRunning: boolean;
        //    private div: HTMLDivElement;
        //    private textbox: Label;
        //    private textbox2: Label;
        //    public _ListAuthorizedCodes: Framework.KeyValuePair[] = [];
        //    constructor() {
        //        super();
        //        this._Type = "BarcodeReader";
        //        this.showExperimentalDesignProperty = false;
        //    }
        //    public CheckCompatibility(): string {
        //        let res = Framework.CanIUse.CheckBrowser.GetBrowserCompatibitityResult("stream");
        //        if (res.CurrentBrowserCompatible == false) {
        //            return res.CompatibleBrowsers;
        //        }
        //        return "";
        //    }
        //    public Render(editMode: boolean = false) {
        //        super.Render(editMode);
        //        let self = this;
        //        this.HtmlElement.innerHTML = "";
        //        this.ListData = [];
        //        let data = this.AddData();
        //        data.Group = this._FriendlyName;
        //        this.div = document.createElement("div");
        //        this.div.style.border = "1px solid black";
        //        this.div.style.height = "320px";
        //        this.div.style.width = "480px";
        //        if (this.isCompatibleWithBrowser == false) {
        //            this.div.innerHTML = Framework.LocalizationManager.Get("AccessToWebcamNotAllowedByBrowser");
        //            this.div.style.lineHeight = "310px";
        //            this.div.style.textAlign = "center";
        //            this.HtmlElement.style.color = this._BorderBrush;
        //            this.HtmlElement.style.borderWidth = this._BorderThickness + "px";
        //        }
        //        this.HtmlElement.appendChild(this.div);
        //        this.textbox = new Label("");
        //        this.textbox.HorizontalAlignment = "center";
        //        this.textbox._Top = 330;
        //        this.textbox._Height = 50;
        //        this.textbox._Width = 240;
        //        this.textbox._BorderBrush = "black";
        //        this.textbox._BorderThickness = 1;
        //        this.textbox.AcceptReturn = false;
        //        if (editMode == false) {
        //            this.textbox.IsEditable = true;
        //            this.textbox.OnChanged = (x) => {
        //                self.ListData[0].Description = x;
        //                self.Validate();
        //            }
        //        }
        //        this.textbox.Render(false);
        //        this.textbox.HtmlElement.style.lineHeight = "50px";
        //        this.HtmlElement.appendChild(this.textbox.HtmlElement);
        //        this.textbox2 = new Label("");
        //        this.textbox2.HorizontalAlignment = "center";
        //        this.textbox2._Top = 330;
        //        this.textbox2._Left = 241;
        //        this.textbox2._Height = 50;
        //        this.textbox2._Width = 240;
        //        this.textbox2._BorderBrush = "black";
        //        this.textbox2._BorderThickness = 1;
        //        this.textbox2.IsEditable = false;
        //        this.textbox2.Render(false);
        //        this.textbox2.HtmlElement.style.lineHeight = "50px";
        //        this.HtmlElement.appendChild(this.textbox2.HtmlElement);
        //        if (this.isCompatibleWithBrowser == true) {
        //            this._scannerIsRunning = false;
        //            if (editMode == false) {
        //                setTimeout(() => {
        //                    if (self._scannerIsRunning == true) {
        //                        Quagga.stop();
        //                    }
        //                    self.startScanner();
        //                }, 500);
        //            }
        //        }
        //        if (editMode == false) {
        //            this.Validate();
        //        }
        //    }
        //    private startScanner() {
        //        let self = this;
        //        //self._scannerIsRunning = true;
        //        Quagga.init({
        //            inputStream: {
        //                name: "Live",
        //                type: "LiveStream",
        //                target: self.div,
        //                constraints: {
        //                    width: 480,
        //                    height: 320,
        //                    //facingMode: "environment"
        //                },
        //            },
        //            decoder: {
        //                readers: [
        //                    "code_128_reader",
        //                    "ean_reader"
        //                    //"ean_8_reader",
        //                    //"code_39_reader",
        //                    //"code_39_vin_reader",
        //                    //"codabar_reader",
        //                    //"upc_reader",
        //                    //"upc_e_reader",
        //                    //"i2of5_reader"
        //                ],
        //                locator: { patchSize: 'large' },
        //                //debug: {
        //                //    showCanvas: true,
        //                //    showPatches: true,
        //                //    showFoundPatches: true,
        //                //    showSkeleton: true,
        //                //    showLabels: true,
        //                //    showPatchLabels: true,
        //                //    showRemainingPatchLabels: true,
        //                //    boxFromPatches: {
        //                //        showTransformed: true,
        //                //        showTransformedBox: true,
        //                //        showBB: true
        //                //    }
        //                //}
        //            },
        //        }, function (err) {
        //            if (err) {
        //                console.log(err);
        //                return
        //            }
        //            Quagga.start();
        //            document.getElementsByTagName("video")[0].style.height = "320px";
        //            document.getElementsByTagName("video")[0].style.width = "480px";
        //            self.div.style.border = "0";
        //            // Set flag to is running
        //            self._scannerIsRunning = true;
        //        });
        //        //Quagga.onProcessed(function (result) {
        //        //    var drawingCtx = Quagga.canvas.ctx.overlay,
        //        //        drawingCanvas = Quagga.canvas.dom.overlay;
        //        //    if (result) {
        //        //        if (result.boxes) {
        //        //            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
        //        //            $('.scannerBox').remove();
        //        //            result.boxes.filter(function (box) {
        //        //                return box !== result.box;
        //        //            }).forEach(function (box) {
        //        //                console.log(box);
        //        //                let topleft = box[0];
        //        //                let bottomleft = box[1];
        //        //                let bottomright = box[3];
        //        //                let topright = box[2];
        //        //                let top = Math.max(topleft[1], topright[1]);
        //        //                let bottom = Math.min(bottomleft[1], bottomright[1]);
        //        //                let left = Math.min(bottomleft[0], topleft[0]);
        //        //                let right = Math.max(bottomright[0], topright[0]);
        //        //                let height = top - bottom;
        //        //                let width = right - left;
        //        //                //alert(left + " " + top + " " + height + " " + width);
        //        //                let dd = document.createElement("div");
        //        //                dd.classList.add("scannerBox");
        //        //                dd.style.border = "1px solid green";
        //        //                dd.style.background = "transparent";
        //        //                dd.style.position = "absolute";
        //        //                dd.style.left = left + "px";
        //        //                dd.style.top = top + "px";
        //        //                dd.style.height = height + "px";
        //        //                dd.style.width = width + "px";
        //        //                self.div.appendChild(dd);
        //        //                ////Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
        //        //            });
        //        //        }
        //        //        if (result.box) {
        //        //            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
        //        //        }
        //        //        if (result.codeResult && result.codeResult.code) {
        //        //            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        //        //        }
        //        //    }
        //        //});
        //        //TOTEST avec une vraie webcam
        //        Quagga.onDetected(function (result) {
        //            alert(JSON.stringify(result));
        //            if (result.codeResult && result.codeResult.code) {
        //                self.textbox.SetText(result.codeResult.code);
        //                self.Validate();
        //            }
        //            //alert("Barcode detected and processed : [" + result.codeResult.code + "]" + result);
        //        });
        //    }
        //    public static Create(): BarcodeReader {
        //        let control: BarcodeReader = new BarcodeReader();
        //        control._Height = 400;
        //        control._Width = 480;
        //        control.DefaultTopCoordinate = "Center";
        //        control.DefaultLeftCoordinate = "Center";
        //        return control;
        //    }
        //    public Validate() {
        //        this.IsValid = true;
        //        if (this._ListAuthorizedCodes.length == 0) {
        //            this.ValidationMessage = "";
        //            return;
        //        }
        //        let kvp = this._ListAuthorizedCodes.filter((x) => { return x.Key == this.ListData[0].Description });
        //        if (kvp.length == 0) {
        //            this.IsValid = false;
        //            this.ValidationMessage = Framework.LocalizationManager.Get("BarcodeNotRecognized");
        //            this.textbox2.SetText(this.ValidationMessage);
        //        } else {
        //            this.IsValid = true;
        //            this.ValidationMessage = "";
        //            this.textbox2.SetText(kvp[0].Value);
        //        }
        //    }
        //    public GetEditableProperties(mode: string = "edition"): Framework.Form.PropertyEditor[] {
        //        let self = this;
        //        let properties = super.GetEditableProperties(mode);
        //        if (mode == "edition" || mode == "creation") {
        //            let btnSetListAuthorizedCodes = Framework.Form.PropertyEditorWithButton.Render("Parameters", "ListAuthorizedCodes", Framework.LocalizationManager.Get("ClickToEdit"), () => {
        //                self.showListCodesForm();
        //            });
        //            properties.push(btnSetListAuthorizedCodes);
        //        }
        //        return properties;
        //    }
        //    private showListCodesForm() {
        //        let codes: Framework.KeyValuePair[] = Framework.Factory.Clone(this._ListAuthorizedCodes);
        //        let div = Framework.Form.TextElement.Create("");
        //        let self = this;
        //        let dtParameters = new Framework.Form.DataTableParameters();
        //        dtParameters.ListData = codes;
        //        dtParameters.Paging = false;
        //        dtParameters.ListColumns = [
        //            {
        //                data: "Key", title: Framework.LocalizationManager.Get("Barcode"), render: function (data, type, row) {
        //                    return data;
        //                }
        //            },
        //            {
        //                data: "Value", title: Framework.LocalizationManager.Get("Label"), render: function (data, type, row) {
        //                    return data;
        //                }
        //            }
        //        ];
        //        dtParameters.Order = [[0, 'desc']];
        //        // Edition du contenu des cellules
        //        dtParameters.OnEditCell = (propertyName, data) => {
        //            return Framework.Form.InputText.Create(data[propertyName], (x) => { data[propertyName] = x }, Framework.Form.Validator.MinLength(3), false, ['tableInput']).HtmlElement;
        //        }
        //        let dataTable: Framework.Form.DataTable;
        //        let selection = [];
        //        let setTable = () => {
        //            Framework.Form.DataTable.AppendToDiv("", "400px", div.HtmlElement, dtParameters, (dt) => {
        //                dataTable = dt;
        //            }, (sel: Framework.KeyValuePair[]) => {
        //                selection = sel;
        //            }, () => {
        //                let kvp = new Framework.KeyValuePair("", "");
        //                codes.push(kvp);
        //                setTable();
        //            }, () => {
        //                selection.forEach((x) => {
        //                    Framework.Array.Remove(codes, x);
        //                });
        //                setTable();
        //            });
        //        }
        //        setTable();
        //        Framework.Modal.Confirm(Framework.LocalizationManager.Get("ListAuthorizedCodes"), div.HtmlElement, () => {
        //            self.changeProperty("_ListAuthorizedCodes", codes);
        //        });
        //    }
        //}
    })(Controls = ScreenReader.Controls || (ScreenReader.Controls = {}));
})(ScreenReader || (ScreenReader = {}));
//# sourceMappingURL=screenreader.js.map