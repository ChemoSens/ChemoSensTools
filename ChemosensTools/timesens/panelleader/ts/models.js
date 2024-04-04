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
var PanelLeaderModels;
(function (PanelLeaderModels) {
    var ServerDirectory = /** @class */ (function (_super) {
        __extends(ServerDirectory, _super);
        function ServerDirectory() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.ID = "0";
            return _this;
        }
        ServerDirectory.Create = function (currentDirectory, existingDirectories) {
            if (currentDirectory === void 0) { currentDirectory = undefined; }
            var self = this;
            var newDirectory = new ServerDirectory();
            newDirectory.ID = undefined;
            var currentDirectoryId = "0";
            if (currentDirectory) {
                currentDirectoryId = currentDirectory.ID;
            }
            newDirectory.ParentId = currentDirectoryId;
            newDirectory.Name = ServerDirectory.GetValidDirectoryName(newDirectory, Framework.LocalizationManager.Get("NewDirectory"), existingDirectories);
            return newDirectory;
        };
        ServerDirectory.GetValidDirectoryName = function (directory, name, existingDirectories) {
            var directoryId = "0"; // Root
            var newName = name;
            // Nom unique
            var index = 1;
            var dirsAtSameLevel = existingDirectories.filter(function (x) { return x.ParentId == directoryId; });
            while (dirsAtSameLevel.filter(function (x) { return x.Name == name; }).length > 0) {
                newName = name + " " + index;
                index++;
            }
            return newName;
        };
        ServerDirectory.prototype.GetParentDirectories = function (localDirectories) {
            var res = [];
            if (this.ParentId == undefined) {
                return res;
            }
            res.push(this);
            var current = this.ParentId;
            var directories = localDirectories.filter(function (x) { return x.ID == current; });
            while (directories.length > 0) {
                res.push(directories[0]);
                current = directories[0].ParentId;
                directories = localDirectories.filter(function (x) { return x.ID == current; });
            }
            return res.reverse();
        };
        ServerDirectory.prototype.GetChildrenDirectories = function (localDirectories) {
            var self = this;
            var directories = localDirectories.filter(function (x) { return x.ParentId == self.ID; });
            return directories;
        };
        ServerDirectory.prototype.GetParentDirectory = function (localDirectories) {
            var _this = this;
            var parentDirectory = localDirectories.filter(function (x) { return x.ID == _this.ParentId; })[0];
            return parentDirectory;
        };
        ServerDirectory.prototype.GetSessions = function (linksToLocalSessions) {
            var _this = this;
            var self = this;
            var links = linksToLocalSessions.filter(function (x) { return x.LocalDirectoryId == _this.ID; });
            return links;
        };
        return ServerDirectory;
    }(Framework.Database.DBItem));
    PanelLeaderModels.ServerDirectory = ServerDirectory;
    var ServerSessionShortcut = /** @class */ (function (_super) {
        __extends(ServerSessionShortcut, _super);
        function ServerSessionShortcut() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ServerSessionShortcut.GetValidName = function (link, name, existingLinkToLocalSessions) {
            var newName = name;
            var index = 1;
            var sessionsAtSameLevel = existingLinkToLocalSessions.filter(function (x) { return x.LocalDirectoryId == link.LocalDirectoryId; });
            while (sessionsAtSameLevel.filter(function (x) { return x.Name == name; }).length > 0) {
                newName = name + " " + index;
                index++;
            }
            return newName;
        };
        return ServerSessionShortcut;
    }(Framework.Database.DBItem));
    PanelLeaderModels.ServerSessionShortcut = ServerSessionShortcut;
    var MonitoringProgress = /** @class */ (function () {
        function MonitoringProgress() {
            this.Products = "";
            //public static GetDataTableParameters(data: PanelLeaderModels.MonitoringProgress[], onChanged: (progress: MonitoringProgress) => void): Framework.Form.DataTableParameters {
            //    let monitoringColumns = [
            //        { data: "SubjectCode", title: Framework.LocalizationManager.Get("SubjectCode") },
            //        { data: "FirstName", title: Framework.LocalizationManager.Get("FirstName") },
            //        { data: "LastName", title: Framework.LocalizationManager.Get("LastName") },
            //        { data: "Mail", title: Framework.LocalizationManager.Get("Mail") },
            //        { data: "LastAccess", title: Framework.LocalizationManager.Get("LastAccess") },
            //        { data: "Progress", title: Framework.LocalizationManager.Get("Progress") },
            //        { data: "MailStatus", title: Framework.LocalizationManager.Get("MailStatus") },
            //        {
            //            data: "URL", title: Framework.LocalizationManager.Get("URL"), render: function (data, type, row) {
            //                if (type === 'display') {
            //                    if (data == undefined) {
            //                        return Framework.LocalizationManager.Get("NotDeployed");
            //                    }
            //                    return "<a href='" + data + "' target='_blank' title='" + Framework.LocalizationManager.Get("StartSessionAsPanelist") + "'><i class='fa fa-user' aria-hidden='true'></i></a> <a href='" + data + "&panelleader=true' target='_blank'  title='" + Framework.LocalizationManager.Get("StartSessionAsPanelLeader") + "'><i class='fa fa-user-secret' aria-hidden='true'></i></a> <a href='" + data + "&screenshot=true' target='_blank'  title='" + Framework.LocalizationManager.Get("SaveScreenshot") + "'><i class='fas fa-camera'></i</a>";
            //                }
            //                return "";
            //            }
            //        },
            //        //{
            //        //    data: "Detail", title: Framework.LocalizationManager.Get("Detail"), render: function (data, type, row) {
            //        //        if (type === 'display') {
            //        //            return "<a href='" + data + "' target='_blank' title='" + Framework.LocalizationManager.Get("StartSessionAsPanelist") + "'><i class='fa fa-user' aria-hidden='true'></i></a> <a href='" + data + "&panelleader=true' target='_blank'  title='" + Framework.LocalizationManager.Get("StartSessionAsPanelLeader") + "'><i class='fa fa-user-secret' aria-hidden='true'></i></a>";
            //        //        }
            //        //        return data;
            //        //    }
            //        //}
            //        //TODO : lien avec info connection : browser, geolocation, issue...
            //    ];
            //    let monitoringDataTableParameters = new Framework.Form.DataTableParameters();
            //    monitoringDataTableParameters.ListData = data;
            //    monitoringDataTableParameters.ListColumns = monitoringColumns;
            //    monitoringDataTableParameters.Order = [[0, 'asc']];
            //    monitoringDataTableParameters.Paging = false;
            //    monitoringDataTableParameters.OnEditCell = (propertyName: string, data: PanelLeaderModels.MonitoringProgress) => {
            //        if (propertyName == "Mail") {
            //            return Framework.Form.InputText.Create(data.Mail, (x) => {
            //                data.Mail = x;
            //                onChanged(data);
            //            }, Framework.Form.Validator.Mail(), false, ["tableInput"]).HtmlElement;
            //        }
            //    }
            //    return monitoringDataTableParameters;
            //}
        }
        MonitoringProgress.GetEncryptedURL = function (url) {
            if (url == undefined) {
                return "";
            }
            var baseURL = url.split('?')[0];
            var parameters = Framework.Browser.GetQueryStringParameters(url);
            var id = "";
            if (parameters["servercode"] != undefined) {
                id += "servercode=" + parameters["servercode"];
            }
            if (parameters["subjectcode"] != undefined) {
                id += "&subjectcode=" + parameters["subjectcode"];
            }
            if (parameters["password"] != undefined) {
                id += "&password=" + parameters["password"];
            }
            if (parameters["panelleader"] != undefined && (parameters["panelleader"] == true || parameters["panelleader"] == "true")) {
                id += "&panelleader=true";
            }
            if (parameters["lang"] != undefined) {
                id += "&lang=" + parameters["lang"];
            }
            var newUrl = baseURL;
            if (id.length > 0) {
                newUrl += "?id=" + btoa(id);
            }
            //pTODO screenshot
            return newUrl;
        };
        return MonitoringProgress;
    }());
    PanelLeaderModels.MonitoringProgress = MonitoringProgress;
    var ProgressInfo = /** @class */ (function () {
        function ProgressInfo() {
        }
        return ProgressInfo;
    }());
    PanelLeaderModels.ProgressInfo = ProgressInfo;
    var Mail = /** @class */ (function () {
        function Mail() {
        }
        return Mail;
    }());
    PanelLeaderModels.Mail = Mail;
    var MailTemplate = /** @class */ (function (_super) {
        __extends(MailTemplate, _super);
        function MailTemplate() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.IsDefault = false;
            return _this;
        }
        return MailTemplate;
    }(Framework.Database.DBItem));
    PanelLeaderModels.MailTemplate = MailTemplate;
    var OptionalTemplatedScreen = /** @class */ (function () {
        function OptionalTemplatedScreen(screens, selectedScreen) {
            this.Screens = [];
            this.SelectedScreen = "";
            this.Screens = screens;
            this.SelectedScreen = selectedScreen;
        }
        return OptionalTemplatedScreen;
    }());
    PanelLeaderModels.OptionalTemplatedScreen = OptionalTemplatedScreen;
    var BaseTemplatedScreen = /** @class */ (function () {
        function BaseTemplatedScreen(name) {
            this.Name = name;
            this.DefaultScreenOptions = new DefaultScreenOptions();
            this.DefaultScreenOptions.Language = Framework.LocalizationManager.GetDisplayLanguage(); //TODO : défaut = langue utilisée à l'écran
        }
        BaseTemplatedScreen.prototype.GetOptions = function () {
            return [];
        };
        return BaseTemplatedScreen;
    }());
    PanelLeaderModels.BaseTemplatedScreen = BaseTemplatedScreen;
    //TODO : récupérer les propertyeditor : à la création depuis l'assistant, à la création depuis le scénario, à la modification -> getProperties(option)
    var TemplatedScreen = /** @class */ (function (_super) {
        __extends(TemplatedScreen, _super);
        function TemplatedScreen(name, title, nextScreen, screenExperimentalDesignId, timerValue, timerVisibility, showNextButtonEnabled) {
            if (nextScreen === void 0) { nextScreen = "ClickOnNextButton"; }
            if (screenExperimentalDesignId === void 0) { screenExperimentalDesignId = 0; }
            if (timerValue === void 0) { timerValue = 60; }
            if (timerVisibility === void 0) { timerVisibility = "NotVisible"; }
            if (showNextButtonEnabled === void 0) { showNextButtonEnabled = true; }
            var _this = _super.call(this, name) || this;
            _this.NextScreen = TemplatedScreen.NextScreenEnum[0];
            _this.TimerValue = 30;
            _this.TimerVisibility = "Visible";
            _this.showNextButtonEnabled = true;
            _this.Title = title;
            _this.NextScreen = nextScreen;
            _this.ScreenExperimentalDesignId = screenExperimentalDesignId;
            _this.TimerValue = timerValue;
            _this.TimerVisibility = timerVisibility;
            _this.showNextButtonEnabled = showNextButtonEnabled;
            return _this;
        }
        TemplatedScreen.prototype.GetOptions = function () {
            var self = this;
            var res = [];
            var setState = function () {
                timerVisibility.Disable();
                timerMaxTime.Disable();
                if (self.NextScreen == "WhenTimerElapsed") {
                    timerVisibility.Enable();
                    timerMaxTime.Enable();
                }
            };
            if (this.showNextButtonEnabled == true) {
                var nextScreen = Framework.Form.PropertyEditorWithPopup.Render("GoToNextScreenOptions", "NextScreen", this.NextScreen, TemplatedScreen.NextScreenEnum, function (x) {
                    self.NextScreen = x;
                    setState();
                });
                res.push(nextScreen);
            }
            var timerVisibility = Framework.Form.PropertyEditorWithPopup.Render("GoToNextScreenOptions", "TimerVisibility", this.TimerVisibility, TemplatedScreen.TimerVisibilityEnum, function (x) {
                self.TimerVisibility = x;
            });
            res.push(timerVisibility);
            var timerMaxTime = Framework.Form.PropertyEditorWithNumericUpDown.Render("GoToNextScreenOptions", "TimeBeforeStoppingChronometer", this.TimerValue, 0, 300, function (x) {
                self.TimerValue = x;
            });
            res.push(timerMaxTime);
            setState();
            return res;
        };
        TemplatedScreen.prototype.Edit = function (callback) {
            var self = this;
            var body = document.createElement("div");
            var editorDiv = document.createElement("div");
            Framework.InlineHTMLEditor.GetButtons().forEach(function (x) {
                editorDiv.appendChild(x.HtmlElement);
            });
            body.appendChild(editorDiv);
            var textarea0 = document.createElement("div");
            textarea0.innerHTML = Framework.LocalizationManager.Get(this.Title);
            textarea0.style.border = "1px solid black";
            textarea0.style.overflowY = "scroll";
            textarea0.style.overflowX = "hidden";
            textarea0.style.height = "50px";
            textarea0.style.padding = "3px";
            textarea0.contentEditable = "true";
            body.appendChild(textarea0);
            var textarea = document.createElement("div");
            textarea.innerHTML = Framework.LocalizationManager.Get(this.Content);
            textarea.style.border = "1px solid black";
            textarea.style.overflowY = "scroll";
            textarea.style.overflowX = "hidden";
            textarea.style.height = "300px";
            textarea.style.padding = "3px";
            textarea.contentEditable = "true";
            body.appendChild(textarea);
            Framework.Modal.Confirm(Framework.LocalizationManager.Get("Options"), body, function () {
                self.Title = textarea0.innerHTML;
                self.Content = textarea.innerHTML;
                callback();
            }, undefined, undefined, undefined, undefined, "500px");
        };
        TemplatedScreen.NextScreenEnum = ["ClickOnNextButton", "WhenTimerElapsed"];
        TemplatedScreen.TimerVisibilityEnum = ["NotVisible", "Visible"];
        TemplatedScreen.TimerMaxTimeEnum = ["5", "10", "20", "30", "60"];
        return TemplatedScreen;
    }(BaseTemplatedScreen));
    PanelLeaderModels.TemplatedScreen = TemplatedScreen;
    //TODO : utiliser geteditableproperties partout
    var TemplatedScreenWithContent = /** @class */ (function (_super) {
        __extends(TemplatedScreenWithContent, _super);
        //TODO : controle textarea*2
        function TemplatedScreenWithContent(name, title, content, screenExperimentalDesignId, nextScreen, timerValue, timerVisibility, showNextButtonEnabled) {
            if (content === void 0) { content = ""; }
            if (screenExperimentalDesignId === void 0) { screenExperimentalDesignId = 0; }
            if (nextScreen === void 0) { nextScreen = "ClickOnNextButton"; }
            if (timerValue === void 0) { timerValue = 60; }
            if (timerVisibility === void 0) { timerVisibility = "NotVisible"; }
            if (showNextButtonEnabled === void 0) { showNextButtonEnabled = true; }
            var _this = _super.call(this, name, title, nextScreen, screenExperimentalDesignId, timerValue, timerVisibility, showNextButtonEnabled) || this;
            _this.Content = content;
            return _this;
        }
        return TemplatedScreenWithContent;
    }(TemplatedScreen));
    PanelLeaderModels.TemplatedScreenWithContent = TemplatedScreenWithContent;
    //export class TemplatedScreenWithSubjectSummary extends TemplatedScreen {
    //    public SubjectSummary: ScreenReader.Controls.SubjectSummary;
    //    public constructor(name: string, title: string) {
    //        super(name, title);
    //    }
    //    public GetOptions(): Framework.Form.PropertyEditor[] {
    //        let self = this;
    //        let res: Framework.Form.PropertyEditor[] = super.GetOptions();
    //        self.SubjectSummary.GetEditableProperties("wizard").forEach((x) => {
    //            res.push(x);
    //        });
    //        return res;
    //    }
    //}
    var TemplatedScreenWithExit = /** @class */ (function (_super) {
        __extends(TemplatedScreenWithExit, _super);
        function TemplatedScreenWithExit(name, title, content, endAction, url, screenExperimentalDesignId) {
            if (content === void 0) { content = ""; }
            if (screenExperimentalDesignId === void 0) { screenExperimentalDesignId = 0; }
            var _this = _super.call(this, name, title, content, screenExperimentalDesignId, "") || this;
            _this.EndAction = endAction;
            _this.URL = url;
            return _this;
        }
        TemplatedScreenWithExit.prototype.GetOptions = function () {
            var self = this;
            var res = _super.prototype.GetOptions.call(this);
            var setState = function () {
                url.Disable();
                if (self.EndAction == "GoToURL") {
                    url.Enable();
                }
            };
            var action = Framework.Form.PropertyEditorWithPopup.Render("Button", "EndAction", this.EndAction, TemplatedScreenWithExit.EndActionEnum, function (x) {
                self.EndAction = x;
                setState();
            });
            res.push(action);
            //TOCHECK : validation
            var url = Framework.Form.PropertyEditorWithTextInput.Render("Button", "URL", Framework.LocalizationManager.Get(this.URL), function (x) {
                self.URL = x;
            }, Framework.Form.Validator.URL());
            res.push(url);
            setState();
            return res;
        };
        TemplatedScreenWithExit.EndActionEnum = ["GoToURL", "GoToLoginScreen"];
        return TemplatedScreenWithExit;
    }(TemplatedScreenWithContent));
    PanelLeaderModels.TemplatedScreenWithExit = TemplatedScreenWithExit;
    var TemplatedScreenWithTimeControl = /** @class */ (function (_super) {
        __extends(TemplatedScreenWithTimeControl, _super);
        function TemplatedScreenWithTimeControl(name, title, nextScreen, screenExperimentalDesignId, timerValue, timerVisibility, showTimeControlOptions) {
            if (nextScreen === void 0) { nextScreen = "ClickOnNextButton"; }
            if (screenExperimentalDesignId === void 0) { screenExperimentalDesignId = 0; }
            if (timerValue === void 0) { timerValue = 60; }
            if (timerVisibility === void 0) { timerVisibility = "NotVisible"; }
            if (showTimeControlOptions === void 0) { showTimeControlOptions = true; }
            var _this = _super.call(this, name, title, nextScreen, screenExperimentalDesignId, timerValue, timerVisibility) || this;
            //TODO : controle startbutton,stopbutton, chronometer
            _this.StartMode = TemplatedScreenWithTimeControl.StartModeEnum[0];
            _this.StopMode = TemplatedScreenWithTimeControl.StopModeEnum[0];
            _this.Chronometer = TemplatedScreenWithTimeControl.ChronometerVisibilityEnum[0];
            _this.MaxTime = 120;
            _this.ShowTimeControlOptions = false;
            _this.ShowTimeControlOptions = showTimeControlOptions;
            return _this;
        }
        TemplatedScreenWithTimeControl.prototype.GetOptions = function () {
            var self = this;
            var res = _super.prototype.GetOptions.call(this);
            if (this.ShowTimeControlOptions == true) {
                var startMode = Framework.Form.PropertyEditorWithPopup.Render("TimeOptions", "StartMode", TemplatedScreenWithTimeControl.StartModeEnum[0], TemplatedScreenWithTimeControl.StartModeEnum, function (x) {
                    self.StartMode = x;
                });
                res.push(startMode);
                var stopMode = Framework.Form.PropertyEditorWithPopup.Render("TimeOptions", "StopMode", TemplatedScreenWithTimeControl.StopModeEnum[0], TemplatedScreenWithTimeControl.StopModeEnum, function (x) {
                    self.StopMode = x;
                });
                res.push(stopMode);
                var chronometerVisibility = Framework.Form.PropertyEditorWithPopup.Render("TimeOptions", "Chronometer", TemplatedScreenWithTimeControl.ChronometerVisibilityEnum[0], TemplatedScreenWithTimeControl.ChronometerVisibilityEnum, function (x) {
                    self.Chronometer = x;
                });
                res.push(chronometerVisibility);
                var timerMaxTime = Framework.Form.PropertyEditorWithNumericUpDown.Render("TimeOptions", "MaxTime", this.TimerValue, 0, 300, function (x) {
                    self.TimerValue = x;
                });
                res.push(timerMaxTime);
            }
            return res;
        };
        TemplatedScreenWithTimeControl.StartModeEnum = [
            "ClickOnStartButton", "ScreenLoaded", /*"ClickOnAttribute",*/
        ];
        TemplatedScreenWithTimeControl.StopModeEnum = [
            "ClickOnNextButton", "ClickOnStopButton", "AfterDelay"
        ];
        TemplatedScreenWithTimeControl.ChronometerVisibilityEnum = [
            "NoChronometer", "NotVisible", "Visible"
        ];
        return TemplatedScreenWithTimeControl;
    }(TemplatedScreen));
    PanelLeaderModels.TemplatedScreenWithTimeControl = TemplatedScreenWithTimeControl;
    var TemplatedScreenWithDiscreteScale = /** @class */ (function (_super) {
        __extends(TemplatedScreenWithDiscreteScale, _super);
        function TemplatedScreenWithDiscreteScale(name, screenExperimentalDesignId, discreteScale, showTimeControlOptions, title, nextScreen) {
            if (title === void 0) { title = "/SpecialLabel/"; }
            if (nextScreen === void 0) { nextScreen = "ClickOnNextButton"; }
            var _this = _super.call(this, name, title, nextScreen, screenExperimentalDesignId) || this;
            _this.TypeOfScale = ScreenReader.Controls.DiscreteScalesControl.TypeOfScaleEnum[0];
            _this.ShowTimeControlOptions = showTimeControlOptions;
            _this.DiscreteScale = discreteScale;
            return _this;
        }
        TemplatedScreenWithDiscreteScale.prototype.GetOptions = function () {
            var self = this;
            self.DiscreteScale.Scale = self.TypeOfScale;
            var res = _super.prototype.GetOptions.call(this);
            self.DiscreteScale.GetEditableProperties("wizard").forEach(function (x) {
                res.push(x);
            });
            //let mandatory = Framework.Form.PropertyEditor.RenderWithToggle("","MandatoryAnswer", self.DiscreteScale._MustAnswerAllAttributes, (x) => {
            //    self.DiscreteScale._MustAnswerAllAttributes = x;
            //});
            //res.push(mandatory);
            //let typeOfScale = Framework.Form.PropertyEditor.RenderWithPopup("","Scale", this.TypeOfScale, ScreenReader.Controls.DiscreteScalesControl.TypeOfScaleEnum, (x) => {
            //    self.TypeOfScale = x;
            //    self.DiscreteScale = ScreenReader.Controls.DiscreteScalesControl.Create(self.DiscreteScale._DataType, self.DiscreteScale._ExperimentalDesignId, self.DiscreteScale._EvaluationMode, self.TypeOfScale);
            //});
            //res.push(typeOfScale);
            return res;
        };
        return TemplatedScreenWithDiscreteScale;
    }(TemplatedScreenWithTimeControl));
    PanelLeaderModels.TemplatedScreenWithDiscreteScale = TemplatedScreenWithDiscreteScale;
    var TemplatedScreenWithContinuousScale = /** @class */ (function (_super) {
        __extends(TemplatedScreenWithContinuousScale, _super);
        function TemplatedScreenWithContinuousScale(name, screenExperimentalDesignId, continuousScale, showTimeControlOptions, title, nextScreen) {
            if (title === void 0) { title = "/SpecialLabel/"; }
            if (nextScreen === void 0) { nextScreen = "ClickOnNextButton"; }
            var _this = _super.call(this, name, title, nextScreen, screenExperimentalDesignId) || this;
            _this.TypeOfScale = ScreenReader.Controls.SlidersControl.TypeOfScaleEnum[0];
            _this.ShowTimeControlOptions = showTimeControlOptions;
            _this.ContinuousScale = continuousScale;
            return _this;
        }
        TemplatedScreenWithContinuousScale.prototype.GetOptions = function () {
            var self = this;
            self.ContinuousScale.Scale = self.TypeOfScale;
            var res = _super.prototype.GetOptions.call(this);
            self.ContinuousScale.GetEditableProperties("wizard").forEach(function (x) {
                res.push(x);
            });
            //let mandatory = Framework.Form.PropertyEditor.RenderWithToggle("","MandatoryAnswer", self.ContinuousScale._MustAnswerAllAttributes, (x) => {
            //    self.ContinuousScale._MustAnswerAllAttributes = x;
            //});
            //res.push(mandatory);
            //let typeOfScale = Framework.Form.PropertyEditor.RenderWithPopup("","Scale", this.TypeOfScale, ScreenReader.Controls.SlidersControl.TypeOfScaleEnum, (x) => {
            //    self.TypeOfScale = x;
            //    self.ContinuousScale = ScreenReader.Controls.SlidersControl.Create(self.ContinuousScale._DataType, self.ContinuousScale._ExperimentalDesignId, self.ContinuousScale._EvaluationMode, self.TypeOfScale);
            //});
            //res.push(typeOfScale);
            return res;
        };
        return TemplatedScreenWithContinuousScale;
    }(TemplatedScreenWithTimeControl));
    PanelLeaderModels.TemplatedScreenWithContinuousScale = TemplatedScreenWithContinuousScale;
    var TemplatedScreenWithTDS = /** @class */ (function (_super) {
        __extends(TemplatedScreenWithTDS, _super);
        function TemplatedScreenWithTDS(name, screenExperimentalDesignId, tdsControl, title, nextScreen /*, tdsControl2: ScreenReader.Controls.DTSButtonsControl = undefined*/) {
            if (title === void 0) { title = "/SpecialLabel/"; }
            if (nextScreen === void 0) { nextScreen = "ClickOnNextButton"; }
            var _this = _super.call(this, name, title, nextScreen, screenExperimentalDesignId) || this;
            _this.TDSControl = tdsControl;
            return _this;
        }
        TemplatedScreenWithTDS.prototype.GetOptions = function () {
            var self = this;
            var res = _super.prototype.GetOptions.call(this);
            self.TDSControl.GetEditableProperties("wizard").forEach(function (x) {
                res.push(x);
            });
            //let mandatory = Framework.Form.PropertyEditor.RenderWithToggle("","MandatoryAnswer", self.TDSControl._MustAnswerAllAttributes, (x) => {
            //    self.TDSControl._MustAnswerAllAttributes = x;
            //});
            //res.push(mandatory);
            //let dominanceMode = Framework.Form.PropertyEditor.RenderWithPopup("","DominanceMode", ScreenReader.Controls.DTSButtonsControl.DominanceModeEnum[0], ScreenReader.Controls.DTSButtonsControl.DominanceModeEnum, (x) => {
            //    self.TDSControl._DominanceMode = x;
            //});
            //res.push(dominanceMode);
            return res;
        };
        return TemplatedScreenWithTDS;
    }(TemplatedScreenWithTimeControl));
    PanelLeaderModels.TemplatedScreenWithTDS = TemplatedScreenWithTDS;
    var TemplatedScreenWithCATA = /** @class */ (function (_super) {
        __extends(TemplatedScreenWithCATA, _super);
        function TemplatedScreenWithCATA(name, screenExperimentalDesignId, cataControl, showTimeControlOptions, title, nextScreen) {
            if (title === void 0) { title = "/SpecialLabel/"; }
            if (nextScreen === void 0) { nextScreen = "ClickOnNextButton"; }
            var _this = _super.call(this, name, title, nextScreen, screenExperimentalDesignId) || this;
            _this.CATAControl = cataControl;
            return _this;
        }
        TemplatedScreenWithCATA.prototype.GetOptions = function () {
            var self = this;
            var res = _super.prototype.GetOptions.call(this);
            //TODO
            var mandatory = Framework.Form.PropertyEditorWithToggle.Render("", "MandatoryAnswer", self.CATAControl._MustAnswerAllAttributes, function (x) {
                self.CATAControl._MustAnswerAllAttributes = x;
            });
            res.push(mandatory);
            if (self.CATAControl._DataType == "TCATA") {
                var setState_1 = function () {
                    duration_1.Disable();
                    if (self.CATAControl._Fading == true) {
                        duration_1.Enable();
                    }
                };
                var fading = Framework.Form.PropertyEditorWithToggle.Render("", "Fading", self.CATAControl._Fading, function (x) {
                    self.CATAControl._Fading = x;
                    setState_1();
                });
                res.push(fading);
                var duration_1 = Framework.Form.PropertyEditorWithNumericUpDown.Render("", "Duration", self.CATAControl._LimitedDuration, 1, 30, function (x) {
                    self.CATAControl._LimitedDuration = x;
                }, 0.5);
                res.push(duration_1);
                setState_1();
            }
            return res;
        };
        return TemplatedScreenWithCATA;
    }(TemplatedScreenWithTimeControl));
    PanelLeaderModels.TemplatedScreenWithCATA = TemplatedScreenWithCATA;
    var TemplatedScreenWithTDSAndDiscreteScale = /** @class */ (function (_super) {
        __extends(TemplatedScreenWithTDSAndDiscreteScale, _super);
        function TemplatedScreenWithTDSAndDiscreteScale(name, screenExperimentalDesignId, tdsControl, discreteScaleControl, title, nextScreen) {
            if (title === void 0) { title = "/SpecialLabel/"; }
            if (nextScreen === void 0) { nextScreen = "ClickOnNextButton"; }
            var _this = _super.call(this, name, title, nextScreen, screenExperimentalDesignId) || this;
            _this.TDSControl = tdsControl;
            _this.DiscreteScale = discreteScaleControl;
            return _this;
        }
        TemplatedScreenWithTDSAndDiscreteScale.prototype.GetOptions = function () {
            var self = this;
            var res = _super.prototype.GetOptions.call(this);
            self.TDSControl.GetEditableProperties("wizard").forEach(function (x) {
                res.push(x);
            });
            self.DiscreteScale.GetEditableProperties("wizard").forEach(function (x) {
                res.push(x);
            });
            return res;
        };
        return TemplatedScreenWithTDSAndDiscreteScale;
    }(TemplatedScreenWithTimeControl));
    PanelLeaderModels.TemplatedScreenWithTDSAndDiscreteScale = TemplatedScreenWithTDSAndDiscreteScale;
    var TemplatedScreenWithTDSAndContinuousScale = /** @class */ (function (_super) {
        __extends(TemplatedScreenWithTDSAndContinuousScale, _super);
        function TemplatedScreenWithTDSAndContinuousScale(name, screenExperimentalDesignId, tdsControl, continuousScale, title, nextScreen) {
            if (title === void 0) { title = "/SpecialLabel/"; }
            if (nextScreen === void 0) { nextScreen = "ClickOnNextButton"; }
            var _this = _super.call(this, name, title, nextScreen, screenExperimentalDesignId) || this;
            _this.TDSControl = tdsControl;
            _this.ContinuousScale = continuousScale;
            return _this;
        }
        TemplatedScreenWithTDSAndContinuousScale.prototype.GetOptions = function () {
            var self = this;
            var res = _super.prototype.GetOptions.call(this);
            self.TDSControl.GetEditableProperties("wizard").forEach(function (x) {
                res.push(x);
            });
            self.ContinuousScale.GetEditableProperties("wizard").forEach(function (x) {
                res.push(x);
            });
            return res;
        };
        return TemplatedScreenWithTDSAndContinuousScale;
    }(TemplatedScreenWithTimeControl));
    PanelLeaderModels.TemplatedScreenWithTDSAndContinuousScale = TemplatedScreenWithTDSAndContinuousScale;
    var TemplatedScreenWithSorting = /** @class */ (function (_super) {
        __extends(TemplatedScreenWithSorting, _super);
        function TemplatedScreenWithSorting(name, screenExperimentalDesignId, sortingControl, title, nextScreen) {
            if (title === void 0) { title = "/SpecialLabel/"; }
            if (nextScreen === void 0) { nextScreen = "ClickOnNextButton"; }
            var _this = _super.call(this, name, title, nextScreen, screenExperimentalDesignId) || this;
            _this.SortingControl = sortingControl;
            return _this;
        }
        TemplatedScreenWithSorting.prototype.GetOptions = function () {
            var self = this;
            var res = _super.prototype.GetOptions.call(this);
            self.SortingControl.GetEditableProperties("wizard").forEach(function (x) {
                res.push(x);
            });
            return res;
        };
        return TemplatedScreenWithSorting;
    }(TemplatedScreen));
    PanelLeaderModels.TemplatedScreenWithSorting = TemplatedScreenWithSorting;
    var TemplatedScreenWithRanking = /** @class */ (function (_super) {
        __extends(TemplatedScreenWithRanking, _super);
        function TemplatedScreenWithRanking(name, screenExperimentalDesignId, rankingControl, title, nextScreen) {
            if (title === void 0) { title = "/SpecialLabel/"; }
            if (nextScreen === void 0) { nextScreen = "ClickOnNextButton"; }
            var _this = _super.call(this, name, title, nextScreen, screenExperimentalDesignId) || this;
            _this.RankingControl = rankingControl;
            return _this;
        }
        TemplatedScreenWithRanking.prototype.GetOptions = function () {
            var self = this;
            var res = _super.prototype.GetOptions.call(this);
            self.RankingControl.GetEditableProperties("wizard").forEach(function (x) {
                res.push(x);
            });
            return res;
        };
        return TemplatedScreenWithRanking;
    }(TemplatedScreen));
    PanelLeaderModels.TemplatedScreenWithRanking = TemplatedScreenWithRanking;
    var TemplatedScreenWithNapping = /** @class */ (function (_super) {
        __extends(TemplatedScreenWithNapping, _super);
        function TemplatedScreenWithNapping(name, screenExperimentalDesignId, nappingControl, title, nextScreen) {
            if (title === void 0) { title = "/SpecialLabel/"; }
            if (nextScreen === void 0) { nextScreen = "ClickOnNextButton"; }
            var _this = _super.call(this, name, title, nextScreen, screenExperimentalDesignId) || this;
            _this.NappingControl = nappingControl;
            return _this;
        }
        TemplatedScreenWithNapping.prototype.GetOptions = function () {
            var self = this;
            var res = _super.prototype.GetOptions.call(this);
            self.NappingControl.GetEditableProperties("wizard").forEach(function (x) {
                res.push(x);
            });
            return res;
        };
        return TemplatedScreenWithNapping;
    }(TemplatedScreen));
    PanelLeaderModels.TemplatedScreenWithNapping = TemplatedScreenWithNapping;
    var TemplatedScreenWithDiscrimination = /** @class */ (function (_super) {
        __extends(TemplatedScreenWithDiscrimination, _super);
        function TemplatedScreenWithDiscrimination(name, screenExperimentalDesignId, control, title, nextScreen) {
            if (title === void 0) { title = "/SpecialLabel/"; }
            if (nextScreen === void 0) { nextScreen = "ClickOnNextButton"; }
            var _this = _super.call(this, name, title, nextScreen, screenExperimentalDesignId) || this;
            _this.DiscriminationControl = control;
            return _this;
        }
        TemplatedScreenWithDiscrimination.prototype.GetOptions = function () {
            var self = this;
            var res = _super.prototype.GetOptions.call(this);
            self.DiscriminationControl.GetEditableProperties("wizard").forEach(function (x) {
                res.push(x);
            });
            return res;
        };
        return TemplatedScreenWithDiscrimination;
    }(TemplatedScreen));
    PanelLeaderModels.TemplatedScreenWithDiscrimination = TemplatedScreenWithDiscrimination;
    var TemplatedSession = /** @class */ (function () {
        function TemplatedSession(id, labelKey, descriptionKey, defaultScreens, designs) {
            this.NbSubjects = 1;
            this.ListExperimentalDesigns = [];
            this.Screens = [];
            this.Options = [];
            var self = this;
            this.Id = id;
            this.LabelKey = labelKey;
            this.DescriptionKey = descriptionKey;
            this.DefaultScreenOptions = new DefaultScreenOptions();
            this.Screens = [].concat(new OptionalTemplatedScreen([
                new TemplatedScreenWithContent("WelcomeScreen", "TemplateWelcomeScreenTitle", "TemplateWelcomeScreenContent"),
                new BaseTemplatedScreen("NoWelcomeScreen")
            ], "WelcomeScreen"), new OptionalTemplatedScreen([
                new TemplatedScreenWithContent("OverallInstructionScreen", "TemplateOverallIstructionsScreenTitle", "TemplateOverallIstructionsScreenContent"),
                new BaseTemplatedScreen("NoOverallInstructionScreen")
            ], "OverallInstructionScreen"), defaultScreens, new OptionalTemplatedScreen([
                new TemplatedScreenWithExit("ExitScreen", "TemplateExitScreenTitle", "TemplateExitScreenContent", "GoToURL", "https://www.timesens.com/V2/"),
                new BaseTemplatedScreen("NoExitScreen")
            ], "ExitScreen"));
            var index = 1;
            this.ListExperimentalDesigns = designs;
            //let subject = new Models.Subject(); subject.Code = "S001";
            //this.ListSubjects.push(subject);
            //let attributeDesigns = this.ListExperimentalDesigns.filter((x) => {
            //    return x.Type == "Attribute";
            //}).forEach((x) => {
            //    let attribute = new Models.Attribute();
            //    attribute.Code = Framework.Format.GetCode(self.ListAttributes.map((x) => { return x.Code; }), x.Name, 3);
            //    attribute.Control = x.Name;
            //    //attribute.Label = attribute.Code;
            //    this.ListAttributes.push(attribute);
            //});
        }
        //TODO : changer contenu des textes en fonction du template
        TemplatedSession.getExperimentalDesign = function (designType, name, id, order, replicates, nbItems, presentationMode) {
            //TOFIX : test par paire
            if (nbItems === void 0) { nbItems = 1; }
            if (presentationMode === void 0) { presentationMode = "Single"; }
            //let items: Models.ExperimentalDesignItem[] = []
            //let item = new Models.ExperimentalDesignItem();
            //let code: string = "";
            //let label: string = "";
            //if (designType == "Product") {
            //    code = "P001";
            //    label = "P001";
            //}
            //if (designType == "Attribute") {
            //    code = "A001";
            //    label = "A001_" + name;
            //}
            //item.Code = code;
            //item.LongName = code;
            //item.Labels = [];
            //item.Labels.push(new Framework.KeyValuePair(1, label));
            //item.DefaultRank = 1;
            //item.Color = Framework.Color.ContrastedColorPalette[0];
            //items.push(item);
            var res = Models.ExperimentalDesign.Create(designType, id, [], order, replicates, [], presentationMode);
            for (var i = 0; i < nbItems; i++) {
                res.AddItem();
            }
            res.Name = name;
            return res;
        };
        //TODO : faire des groupes de templates
        TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen = function (experimentalDesignId, title, content) {
            if (title === void 0) { title = "TemplateEmptySessionScreenTitle"; }
            if (content === void 0) { content = "TemplateEmptySessionScreenContent"; }
            return new OptionalTemplatedScreen([
                new TemplatedScreenWithContent("RepeatedInstructionScreen", "TemplateEmptySessionScreenTitle", "TemplateEmptySessionScreenContent", experimentalDesignId),
                new BaseTemplatedScreen("NoRepeatedInstructionScreen")
            ], "RepeatedInstructionScreen");
        };
        TemplatedSession.getForcedBreakOptionalTemplatedScreen = function (experimentalDesignId, title, content, time) {
            if (title === void 0) { title = "TemplateForcedBreakScreenTitle"; }
            if (content === void 0) { content = "TemplateForcedBreakScreenContent"; }
            if (time === void 0) { time = 30; }
            return new OptionalTemplatedScreen([
                new TemplatedScreenWithContent("ForcedBreakScreen", title, content, experimentalDesignId, "WhenTimerElapsed", time, "Visible", false),
                new BaseTemplatedScreen("NoForcedBreakScreen")
            ], "NoForcedBreakScreen");
        };
        //private static getSubjectSummaryTemplatedScreen(title: string = "TemplateSubjectSummaryScreenTitle"): OptionalTemplatedScreen {
        //    return new OptionalTemplatedScreen([
        //        new TemplatedScreenWithSubjectSummary("SubjectSummaryScreen", title),
        //        new BaseTemplatedScreen("NoSubjectSummaryScreen")
        //    ], "NoSubjectSummaryScreen");
        //}
        TemplatedSession.GetHedonicTestTemplatedSession = function (nbProducts, nbAttributes) {
            if (nbProducts === void 0) { nbProducts = 1; }
            if (nbAttributes === void 0) { nbAttributes = 1; }
            // TOTEST Test hédonique (si intake > 1, variante "progressive liking")            
            return new TemplatedSession("HedonicTest", "TemplateHedonicTest", "TemplateHedonicTestDescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateHedonicTestInstructionScreenTitle", "TemplateHedonicTestInstructionScreenContent"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithDiscreteScale("DiscreteScaleScreen", 1, ScreenReader.Controls.DiscreteScalesControl.Create("Hedonic", 2), false),
                    new TemplatedScreenWithContinuousScale("ContinuousScaleScreen", 1, ScreenReader.Controls.SlidersControl.Create("Hedonic", 2), false)
                ], "DiscreteScaleScreen"),
                TemplatedSession.getForcedBreakOptionalTemplatedScreen(1),
                //TemplatedSession.getSubjectSummaryTemplatedScreen()
            ], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1, nbProducts), TemplatedSession.getExperimentalDesign("Attribute", "Hedonic", 2, "Fixed", 1, nbAttributes)]);
        };
        TemplatedSession.GetXlsxTemplatedSession = function () {
            return new TemplatedSession("XlsxSession", "TemplateXlsxSession", "TemplateXlsxSessionDescription", [], []);
        };
        TemplatedSession.GetEmptyTemplatedSession = function () {
            // TOTEST Séance vide
            return new TemplatedSession("EmptySession", "TemplateEmptySession", "TemplateEmptySessionDescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithContent("DataMeasurementScreen", "TemplateDataMeasurementScreenTitle", "TemplateDataMeasurementScreenContent", 1),
                ], "DataMeasurementScreen")
            ], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "Attribute", 2, "Fixed", 1)]);
        };
        //public static GetDynamicLikingTemplatedSession(): TemplatedSession {
        //    // TOTEST Dynamic liking
        //    return new TemplatedSession("DynamicLiking", "TemplateDynamicLiking", "TemplateDynamicLikingDescription", [
        //        TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateDynamicLikingInstructionScreenTitle", "TemplateDynamicLikingInstructionScreenContent"),
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithDiscreteScale("DiscreteScaleScreen", 1, ScreenReader.Controls.DiscreteScalesControl.Create("DynamicLiking", 2), true),
        //            new TemplatedScreenWithContinuousScale("ContinuousScaleScreen", 1, ScreenReader.Controls.SlidersControl.Create("DynamicLiking", 2), true)
        //        ], "DiscreteScaleScreen"),
        //        TemplatedSession.getForcedBreakOptionalTemplatedScreen(1),
        //        //TemplatedSession.getSubjectSummaryTemplatedScreen()
        //    ],
        //        [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "DynamicLiking", 2, "Fixed", 1)]
        //    )
        //}
        TemplatedSession.GetMonadicProfileTemplatedSession = function () {
            // TOTEST Profil monadique (si intake > 1, variante "progressive profile")
            return new TemplatedSession("MonadicProfile", "TemplateMonadicProfile", "TemplateMonadicProfileDescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateMonadicProfileInstructionScreenTitle", "TemplateMonadicProfileInstructionScreenContent"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithDiscreteScale("DiscreteScaleScreen", 1, ScreenReader.Controls.DiscreteScalesControl.Create("Profile", 2), false),
                    new TemplatedScreenWithContinuousScale("ContinuousScaleScreen", 1, ScreenReader.Controls.SlidersControl.Create("Profile", 2), false)
                ], "DiscreteScaleScreen")
            ], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "Profile", 2, "Fixed", 1)]);
        };
        //public static GetDynamicProfileTemplatedSession(): TemplatedSession {
        //    // TOTEST Profil dynamique
        //    return new TemplatedSession("DynamicProfile", "TemplateDynamicProfile", "TemplateDynamicProfileDescription", [
        //        TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateDynamicProfileInstructionScreenTitle", "TemplateDynamicProfileInstructionScreenContent"),
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithDiscreteScale("DiscreteScaleScreen", 1, ScreenReader.Controls.DiscreteScalesControl.Create("DynamicProfile", 2), true),
        //            new TemplatedScreenWithContinuousScale("ContinuousScaleScreen", 1, ScreenReader.Controls.SlidersControl.Create("DynamicProfile", 2), true)
        //        ], "DiscreteScaleScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "DynamicProfile", 2, "Fixed", 1)]
        //    )
        //}
        //public static GetTITemplatedSession(): TemplatedSession {
        //    // TOTEST TI (= profil dynamique ?)
        //    return new TemplatedSession("TI", "TemplateTI", "TemplateTIDescription", [
        //        TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateTIInstructionScreenTitle", "TemplateTIInstructionScreenContent"),
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithContinuousScale("ContinuousScaleScreen", 1, ScreenReader.Controls.SlidersControl.Create("TI", 2, "Product", "LabeledContinuousScale0-10", "Vertical"), true),
        //        ], "ContinuousScaleScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "TI", 2, "Random", 1)]
        //    )
        //}
        //public static GetComparativeProfileTemplatedSession(): TemplatedSession {
        //    // TOTEST Profil comparatif
        //    return new TemplatedSession("ComparativeProfile", "TemplateComparativeProfile", "TemplateComparativeProfileDescription", [
        //        TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(2, "TemplateComparativeProfileInstructionScreenTitle", "TemplateComparativeProfileInstructionScreenContent"),
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithDiscreteScale("DiscreteScaleScreen", 1, ScreenReader.Controls.DiscreteScalesControl.Create("Profile", 1, "Attribute"), false),
        //            new TemplatedScreenWithContinuousScale("ContinuousScaleScreen", 2, ScreenReader.Controls.SlidersControl.Create("Profile", 1, "Attribute"), false)
        //        ], "DiscreteScaleScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "Profile", 2, "Fixed", 1)]
        //    )
        //}
        TemplatedSession.GetTDSTemplatedSession = function () {
            // TOTEST TDS
            return new TemplatedSession("TDS", "TemplateTDS", "TemplateTDSDescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateTDSInstructionScreenTitle", "TemplateTDSProfileInstructionScreenContent"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithTDS("TDSScreen", 1, ScreenReader.Controls.DTSButtonsControl.Create(2)),
                ], "TDSScreen")
            ], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "TDS", 2, "Random", 1)]);
        };
        TemplatedSession.GetAlternatedTDSTemplatedSession = function () {
            // TOTEST Alternated TDS
            return new TemplatedSession("AlternatedTDS", "TemplateAlternatedTDS", "TemplateAlternatedTDSDescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateAlternatedTDSInstructionScreenTitle", "TemplateAlternatedTDSProfileInstructionScreenContent"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithTDS("TDSScreen", 1, ScreenReader.Controls.DTSButtonsControl.Create(2)),
                ], "TDSScreen"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithTDS("TDSScreen", 1, ScreenReader.Controls.DTSButtonsControl.Create(3)),
                ], "TDSScreen")
            ], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "Modality1", 2, "Random", 1), TemplatedSession.getExperimentalDesign("Attribute", "Modality2", 3, "Random", 1)]);
        };
        //public static GetAlternatedTDLTemplatedSession(): TemplatedSession {
        //    // TOTEST Alternated TDS
        //    return new TemplatedSession("AlternatedTDL", "TemplateAlternatedTDL", "TemplateAlternatedTDLDescription", [
        //        TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateAlternatedTDLInstructionScreenTitle", "TemplateAlternatedTDLInstructionScreenContent"),
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithTDS("TDSScreen", 1, ScreenReader.Controls.DTSButtonsControl.Create(2)),
        //        ], "TDSScreen"),
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithDiscreteScale("DiscreteScaleScreen", 1, ScreenReader.Controls.DiscreteScalesControl.Create("Liking", 3), false),
        //            new TemplatedScreenWithContinuousScale("ContinuousScaleScreen", 1, ScreenReader.Controls.SlidersControl.Create("Liking", 3), false)
        //        ], "DiscreteScaleScreen")
        //    ], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "TDS", 2, "Random", 1), TemplatedSession.getExperimentalDesign("Attribute", "Liking", 3, "Fixed", 1)]
        //    )
        //}
        //public static GetSimultaneousTDLTemplatedSession(): TemplatedSession {
        //    // TOTEST Simultaneous TDL
        //    return new TemplatedSession("SimultaneousTDL", "TemplateSimultaneousTDL", "TemplateSimultaneousTDLDescription", [
        //        TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateSimultaneousTDLInstructionScreenTitle", "TemplateSimultaneousTDLInstructionScreenContent"),
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithTDSAndDiscreteScale("TDSAndDiscreteScaleScreen", 1, ScreenReader.Controls.DTSButtonsControl.Create(2), ScreenReader.Controls.DiscreteScalesControl.Create("Hedonic", 3)),
        //            new TemplatedScreenWithTDSAndContinuousScale("TDSAndContinuousScaleScreen", 1, ScreenReader.Controls.DTSButtonsControl.Create(2), ScreenReader.Controls.SlidersControl.Create("Hedonic", 3)),
        //        ], "TDSAndDiscreteScaleScreen"),
        //    ], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "TDS", 2, "Random", 1), TemplatedSession.getExperimentalDesign("Attribute", "Liking", 3, "Fixed", 1)]
        //    )
        //}
        //public static GetDualTDSTemplatedSession(): TemplatedSession {
        // TODO DUAL TDS
        //return new TemplatedSession("DualTDS", "TemplateDualTDS", "TemplateDualTDSDescription", [
        //    TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateDualTDSInstructionScreenTitle", "TemplateDualTDSProfileInstructionScreenContent"),
        //    new OptionalTemplatedScreen([
        //        new TemplatedScreenWithTDS("TDSScreen", 1, ScreenReader.Controls.DTSButtonsControl.Create(2)),
        //    ], "TDSScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "Modality1", 2, "Random", 1), TemplatedSession.getExperimentalDesign("Attribute", "Modality2", 3, "Random", 1)]
        //),
        //}
        TemplatedSession.GetCATATemplatedSession = function () {
            // TOTEST CATA
            return new TemplatedSession("CATA", "TemplateCATA", "TemplateCATADescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateCATAInstructionScreenTitle", "TemplateCATAInstructionScreenContent"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithCATA("CATAScreen", 1, ScreenReader.Controls.CATAControl.Create(2, "CATA"), false),
                ], "CATAScreen")
            ], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "CATA", 2, "Random", 1)]);
        };
        TemplatedSession.GetTCATATemplatedSession = function () {
            // TOTEST TCATA
            return new TemplatedSession("TCATA", "TemplateTCATA", "TemplateTCATADescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateTCATAInstructionScreenTitle", "TemplateTCATAInstructionScreenContent"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithCATA("TCATAScreen", 1, ScreenReader.Controls.CATAControl.Create(2, "TCATA"), true),
                ], "TCATAScreen")
            ], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "TCATA", 2, "Random", 1)]);
        };
        //public static GetSortingTemplatedSession(): TemplatedSession {
        //    // TOTEST Sorting + TODO : écran optionnel avec description
        //    return new TemplatedSession("Sorting", "TemplateSorting", "TemplateSortingDescription", [
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithSorting("SortingScreen", 1, ScreenReader.Controls.SortingControl.Create(1)),
        //        ], "SortingScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1)]
        //    )
        //}
        //public static GetRankingTemplatedSession(): TemplatedSession {
        //    // TOTEST Ranking
        //    return new TemplatedSession("Ranking", "TemplateRanking", "TemplateRankingDescription", [
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithRanking("RankingScreen", 1, ScreenReader.Controls.RankingControl.Create(1)),
        //        ], "RankingScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1)]
        //    )
        //}
        //public static GetNappingTemplatedSession(): TemplatedSession {
        //    // TOTEST Napping
        //    return new TemplatedSession("Napping", "TemplateNapping", "TemplateNappingDescription", [
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithNapping("NappingScreen", 1, ScreenReader.Controls.NappingControl.Create(1)),
        //        ], "NappingScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1)]
        //    )
        //}
        //public static GetPairedTestTemplatedSession(): TemplatedSession {
        //    // TOTEST Test par paire
        //    return new TemplatedSession("PairedTest", "TemplatePairedTest", "TemplatePairedTestDescription", [
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithDiscrimination("MeasurementScreen", 1, ScreenReader.Controls.DiscriminationTestControl.Create("PairedTest", 1)),
        //        ], "MeasurementScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1, 2, "Pair")]
        //    )
        //}
        //public static GetTriangleTestTemplatedSession(): TemplatedSession {
        //    // TOTEST Test par triangulaire
        //    return new TemplatedSession("TriangleTest", "TemplateTriangleTest", "TemplateTriangleTestDescription", [
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithDiscrimination("MeasurementScreen", 1, ScreenReader.Controls.DiscriminationTestControl.Create("TriangleTest", 1)),
        //        ], "MeasurementScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1, 2, "Triangle")]
        //    )
        //}
        //public static GetTetradTestTemplatedSession(): TemplatedSession {
        //    // TOTEST Tetrade
        //    return new TemplatedSession("TetradTest", "TemplateTetradTest", "TemplateTetradTestDescription", [
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithDiscrimination("MeasurementScreen", 1, ScreenReader.Controls.DiscriminationTestControl.Create("TetradTest", 1)),
        //        ], "MeasurementScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1, 2, "Tetrad")]
        //    )
        //}
        //public static GetTwoOutOfFiveTestTemplatedSession(): TemplatedSession {
        //    // TOTEST Tetrade
        //    return new TemplatedSession("TwoOutOfFiveTest", "TemplateTwoOutOfFiveTest", "TemplateTwoOutOfFiveTestDescription", [
        //        new OptionalTemplatedScreen([
        //            new TemplatedScreenWithDiscrimination("MeasurementScreen", 1, ScreenReader.Controls.DiscriminationTestControl.Create("TwoOutOfFiveTest", 1)),
        //        ], "MeasurementScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1, 2, "TwoOutOfFive")]
        //    )
        //}
        TemplatedSession.GetTemplates = function () {
            return [
                TemplatedSession.GetXlsxTemplatedSession(),
                TemplatedSession.GetEmptyTemplatedSession(),
                TemplatedSession.GetHedonicTestTemplatedSession(),
                //TemplatedSession.GetDynamicLikingTemplatedSession(),
                TemplatedSession.GetMonadicProfileTemplatedSession(),
                //TemplatedSession.GetDynamicProfileTemplatedSession(),
                //TemplatedSession.GetTITemplatedSession(),
                //TemplatedSession.GetComparativeProfileTemplatedSession(),
                TemplatedSession.GetTDSTemplatedSession(),
                TemplatedSession.GetAlternatedTDSTemplatedSession(),
                //TemplatedSession.GetAlternatedTDLTemplatedSession(),
                //TemplatedSession.GetSimultaneousTDLTemplatedSession(),
                TemplatedSession.GetCATATemplatedSession(),
                TemplatedSession.GetTCATATemplatedSession(),
                //TemplatedSession.GetSortingTemplatedSession(),
                //TemplatedSession.GetRankingTemplatedSession(),
                //TemplatedSession.GetNappingTemplatedSession(),
                //TemplatedSession.GetPairedTestTemplatedSession(),
                //TemplatedSession.GetTriangleTestTemplatedSession(),
                //TemplatedSession.GetTetradTestTemplatedSession(),
                //TemplatedSession.GetTwoOutOfFiveTestTemplatedSession()
                //TODO : DATI
                //profil flash
                //description libre
                // TODO : familels de test :
                //Discrimination
                //Positionnement
                //Préférence
                //Description qualitative
                //Description quantitative
                //Description temporelle
            ];
        };
        return TemplatedSession;
    }());
    PanelLeaderModels.TemplatedSession = TemplatedSession;
    //export class AnalysisTemplate extends Framework.Database.DBItem {
    //    public Name: string;
    //    public DataType: string;
    //    public JsonFile: string;
    //    public LabelKey: string;
    //    public DescriptionKey: string;
    //    public Json: string; // Pour custom template
    //    public Label: string; // Pour custom template
    //    public Description: string; // Pour custom template
    //    // Templates d'analyses
    //    //TODO
    //    public static Templates: AnalysisTemplate[] = [
    //        {
    //            Name: "Profile", LastUpdate: "", Owner: "", ID: "Profile", DataType: "Profile", JsonFile: "profile", LabelKey: "AnalysisProfile", DescriptionKey: "AnalysisProfileDescription", Json: "", Label: "", Description: ""
    //        }
    //    ];
    //}
    //export class AnalysisFunction {
    //    public Parameters: AnalysisFunctionParameter[];
    //    public Label: string;
    //    public RCode: string;
    //    public IsOpen: boolean;
    //}
    //export class AnalysisFunctionParameter {
    //    public Label: string;
    //    public SelectedOption: string;
    //    public Options: AnalysisOption[];
    //    public RCode: string;
    //}
    //export class AnalysisOption {
    //    public Key: string;
    //    public Label: string;
    //    public RCode: string;
    //    public OptionParameters: OptionParameter[];
    //}
    //export class OptionParameter {
    //    public Label: string;
    //    public RCode: string;
    //    public SelectedValue: string;
    //    public SpecialValue: string;
    //    public Values: Framework.KeyValuePair[];
    //}
    //export class Analysis {
    //    public Functions: AnalysisFunction[];
    //    public RClass: string;
    //    //TODO : augmenter le nombre de couleurs disponibles
    //    public static Colors: string[] = ["red", "blue", "lawngreen", "purple", "darkgrey", "cyan", "fuschia", "coral", "orange", "turquoise", "darkgreen", "violet", "gold", "indigo", "burlywood"];
    //    public static FromJSON(path: string, onsuccess: (analysis: Analysis) => void): void {
    //        $.getJSON(Framework.RootUrl + '/website/analyses/jsonTemplates/' + path + '.json', function (data) {
    //            let analysis: Analysis = data;
    //            onsuccess(analysis);
    //        })
    //    }
    //    public static GetRCode(analysis: Analysis, listData: Models.Data[], language: string, productColors: string, attributeColors: string, subjectLabels = "", productLabels = "", attributeLabels = ""): string {
    //        let rCode: string = "";
    //        // Création des données
    //        rCode += 'textData="' + Models.Data.GetColumns(Models.Data.GetType(listData[0])).join(';') + ";ByVariable" + '\n';
    //        listData.forEach((data) => {
    //            rCode += Models.Data.ToString(data) + '\n';
    //            //TODO : remplacement des labels si nécessaire
    //        });
    //        rCode += '";\n';
    //        rCode += 'canonicalData<-read.table(text=textData,sep=";",header=TRUE);\n';
    //        rCode += 'library("TimeSensR");\n';
    //        rCode += 'SetR6Environment();\n';
    //        rCode += 'obj<-' + analysis.RClass + '$new(canonicalData,"' + language + '");\n';
    //        rCode += 'obj$SetProductColors(' + productColors + ');\n';
    //        rCode += 'obj$SetAttributeColors(' + attributeColors + ');\n';
    //        analysis.Functions.forEach((f) => {
    //            rCode += 'obj$' + f.RCode + '(';
    //            f.Parameters.forEach((p, idx, array) => {
    //                rCode += p.RCode + '=list(';
    //                let option = p.Options.filter((o) => { return o.Key == p.SelectedOption })[0];
    //                option.OptionParameters.forEach((op, idx, array) => {
    //                    let value = op.SelectedValue;
    //                    if (Number(op.SelectedValue)) {
    //                    } else if (op.SelectedValue == "TRUE" || op.SelectedValue == "FALSE") {
    //                    } else {
    //                        value = '"' + value + '"';
    //                    }
    //                    rCode += op.RCode + '=' + value;
    //                    if (idx < array.length - 1) {
    //                        rCode += ',';
    //                    }
    //                });
    //                rCode += ')';
    //                if (idx < array.length - 1) {
    //                    rCode += ',';
    //                }
    //            });
    //            rCode += ');\n';
    //        });
    //        rCode += 'obj$SaveToHtml("result.html");\n';
    //        return rCode;
    //    }
    //}
    var Upload = /** @class */ (function () {
        function Upload() {
            this.CheckCompatibilityMode = "Warning";
            this.ExpirationDate = new Date(Date.now());
            this.ExpirationDate.setMonth(this.ExpirationDate.getMonth() + 2);
        }
        return Upload;
    }());
    PanelLeaderModels.Upload = Upload;
    var FlatContingencyTableRow = /** @class */ (function () {
        function FlatContingencyTableRow() {
        }
        return FlatContingencyTableRow;
    }());
    PanelLeaderModels.FlatContingencyTableRow = FlatContingencyTableRow;
    var DatasetSummary = /** @class */ (function () {
        function DatasetSummary(listData) {
            var self = this;
            this.listData = listData;
            this.Sessions = Framework.Array.Unique(listData.map(function (x) { return x.Session; }));
            this.Replicates = Framework.Array.Unique(listData.map(function (x) { return x.Replicate; }));
            this.Intakes = Framework.Array.Unique(listData.map(function (x) { return x.Intake; })).filter(function (x) { return x != undefined; });
            this.Subjects = Framework.Array.Unique(listData.map(function (x) { return x.SubjectCode; }));
            this.Products = Framework.Array.Unique(listData.map(function (x) { return x.ProductCode; }));
            this.Attributes = Framework.Array.Unique(listData.map(function (x) { return x.AttributeCode; }));
            if (Models.Data.GetType(listData[0]) == "TDS") {
                Framework.Array.Remove(this.Attributes, "START");
                Framework.Array.Remove(this.Attributes, "STOP");
            }
            this.DataCount = 0;
            // colonnes 0 à 4 : session, rep, intake, subject, product ; colonne 5 : tableau d'effectif par attribut
            this.FlatContingencyTable = [];
            var _loop_1 = function (i1) {
                var session = self.Sessions[i1];
                var _loop_2 = function (i2) {
                    var replicate = self.Replicates[i2];
                    var _loop_3 = function (i3) {
                        var intake = self.Intakes[i3];
                        var _loop_4 = function (i4) {
                            var subject = self.Subjects[i4];
                            var _loop_5 = function (i5) {
                                var product = self.Products[i5];
                                //TODO
                                //if (Models.Data.GetType(listData[0]) == "TDS") {
                                //    let sel = listData.filter((x) => { return x.Session == session && x.Replicate == replicate && x.Intake == intake && x.SubjectCode == subject && x.ProductCode == product }).sort((a, b) => { return a.Time - b.Time; });;
                                //    let dominantAttribute = "";
                                //    let time = 0;
                                //    // TODO : gestion des 0/1, standardisation, temps calcul
                                //    for (let i6 = 0; i6 < sel.length; i6++) {
                                //        let data = sel[i6];
                                //    //sel.forEach((data) => {
                                //        for (let t = time; t < data.Time; t++) {
                                //            let tabAttributeCounts = new Framework.Dictionary();
                                //            let tabAttributeScores = new Framework.Dictionary();
                                //            let cpt = 0;
                                //            for (let i7 = 0; i7 < self.Attributes.length; i7++) {
                                //                let attribute = self.Attributes[i7];
                                //            //self.Attributes.forEach((attribute) => {
                                //                if (attribute == dominantAttribute) {
                                //                    tabAttributeCounts.Add(attribute, 1);
                                //                    tabAttributeScores.Add(attribute, 1);
                                //                } else {
                                //                    tabAttributeCounts.Add(attribute, 0);
                                //                    tabAttributeScores.Add(attribute, 0);
                                //                }
                                //            }/*)*/;
                                //            self.FlatContingencyTable.push({ "Session": session, "Replicate": replicate, "Intake": intake, "Subject": subject, "Product": product, "Time": t, "AttributesCounts": tabAttributeCounts, "AttributesScores": tabAttributeScores, "Count": cpt });
                                //        }
                                //        time = Math.ceil(data.Time);
                                //        dominantAttribute = data.AttributeCode;
                                //    }/*)*/
                                //} else {
                                var tabAttributeCounts = new Framework.Dictionary.Dictionary();
                                var tabAttributeScores = new Framework.Dictionary.Dictionary();
                                var cpt = 0;
                                var _loop_6 = function (i7) {
                                    var attribute = self.Attributes[i7];
                                    var sel = listData.filter(function (x) { return x.Session == session && x.Replicate == replicate && (x.Intake == undefined || x.Intake == intake) && x.SubjectCode == subject && x.ProductCode == product && x.AttributeCode == attribute; });
                                    var count = sel.length;
                                    tabAttributeCounts.Add(attribute, count);
                                    cpt += count;
                                    var score = undefined;
                                    if (sel.length > 0) {
                                        score = sel[0].Score;
                                    }
                                    tabAttributeScores.Add(attribute, score);
                                };
                                for (var i7 = 0; i7 < self.Attributes.length; i7++) {
                                    _loop_6(i7);
                                }
                                self.FlatContingencyTable.push({ "Session": session, "Replicate": replicate, "Intake": intake, "SubjectCode": subject, "ProductCode": product, "Time": 0, "AttributesCounts": tabAttributeCounts, "AttributesScores": tabAttributeScores, "Count": cpt });
                                self.DataCount += cpt;
                            };
                            for (var i5 = 0; i5 < self.Products.length; i5++) {
                                _loop_5(i5);
                            }
                            ;
                        };
                        for (var i4 = 0; i4 < self.Subjects.length; i4++) {
                            _loop_4(i4);
                        }
                        ;
                    };
                    for (var i3 = 0; i3 < self.Intakes.length; i3++) {
                        _loop_3(i3);
                    }
                    ;
                };
                for (var i2 = 0; i2 < self.Replicates.length; i2++) {
                    _loop_2(i2);
                }
                ;
            };
            for (var i1 = 0; i1 < self.Sessions.length; i1++) {
                _loop_1(i1);
            }
            ;
        }
        Object.defineProperty(DatasetSummary.prototype, "ListData", {
            get: function () {
                return this.listData;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatasetSummary.prototype, "ExpectedDataCount", {
            get: function () {
                return this.FlatContingencyTable.length * this.Attributes.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatasetSummary.prototype, "MissingData", {
            get: function () {
                var self = this;
                return (this.FlatContingencyTable.filter(function (x) { return x.Count != self.Attributes.length; }));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatasetSummary.prototype, "MissingDataCount", {
            get: function () {
                return this.ExpectedDataCount - this.DataCount;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatasetSummary.prototype, "MissingDataPercentage", {
            get: function () {
                var prct = Math.round(this.MissingDataCount / this.ExpectedDataCount * 10000) / 100;
                return prct;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DatasetSummary.prototype, "MissingDataTable", {
            get: function () {
                // Tableau HTML avec données manquantes
                var htmTable = document.createElement("table");
                var thead = document.createElement("thead");
                htmTable.appendChild(thead);
                var tr = document.createElement("tr");
                thead.appendChild(tr);
                var th1 = document.createElement("th");
                th1.innerHTML = Framework.LocalizationManager.Get("Session");
                tr.appendChild(th1);
                var th2 = document.createElement("th");
                th2.innerHTML = Framework.LocalizationManager.Get("Replicate");
                tr.appendChild(th2);
                var th3 = document.createElement("th");
                th3.innerHTML = Framework.LocalizationManager.Get("Intake");
                tr.appendChild(th3);
                var th4 = document.createElement("th");
                th4.innerHTML = Framework.LocalizationManager.Get("Subject");
                tr.appendChild(th4);
                var th5 = document.createElement("th");
                th5.innerHTML = Framework.LocalizationManager.Get("Product");
                tr.appendChild(th5);
                this.Attributes.forEach(function (att) {
                    var th = document.createElement("th");
                    th.innerHTML = att;
                    tr.appendChild(th);
                });
                var tbody = document.createElement("tbody");
                htmTable.appendChild(tbody);
                this.MissingData.forEach(function (x) {
                    var tr = document.createElement("tr");
                    tbody.appendChild(tr);
                    var td1 = document.createElement("td");
                    td1.innerHTML = x.Session.toString();
                    tr.appendChild(td1);
                    var td2 = document.createElement("td");
                    td2.innerHTML = x.Replicate.toString();
                    tr.appendChild(td2);
                    var intake = 1;
                    if (x.Intake) {
                        intake = x.Intake;
                    }
                    var td3 = document.createElement("td");
                    td3.innerHTML = intake.toString();
                    tr.appendChild(td3);
                    var td4 = document.createElement("td");
                    td4.innerHTML = x.SubjectCode;
                    tr.appendChild(td4);
                    var td5 = document.createElement("td");
                    td5.innerHTML = x.ProductCode;
                    tr.appendChild(td5);
                    x.AttributesCounts.Entries.forEach(function (entry) {
                        var td = document.createElement("td");
                        td.innerHTML = entry.Val.toString();
                        tr.appendChild(td);
                        if (entry.Val == 0) {
                            td.style.background = "red";
                        }
                    });
                });
                htmTable.classList.add("table");
                return htmTable;
            },
            enumerable: false,
            configurable: true
        });
        DatasetSummary.prototype.ImputMissingData = function () {
            var self = this;
            var listImputedData = [];
            this.MissingData.forEach(function (x) {
                var missingAttributes = x.AttributesCounts.Entries.filter(function (x) { return x.Val == 0; });
                //Framework.Array.GetAllIndexes(x.AttributesCounts, 0);
                missingAttributes.forEach(function (ma) {
                    var missingAttribute = ma.Key;
                    // Calcul de moyenne juge + moyenne produit - gmean
                    var sumProd = 0;
                    var prod = self.listData.filter(function (y) { return y.ProductCode == x.ProductCode && y.AttributeCode == missingAttribute; });
                    prod.forEach(function (y) { sumProd += y.Score; });
                    var moyProd = sumProd / prod.length;
                    var sumJuge = 0;
                    var jug = self.listData.filter(function (y) { return y.SubjectCode == x.SubjectCode && y.AttributeCode == missingAttribute; });
                    jug.forEach(function (y) { sumJuge += y.Score; });
                    var moyJuge = sumJuge / jug.length;
                    var sum = 0;
                    var all = self.listData.filter(function (y) { return y.AttributeCode == missingAttribute; });
                    all.forEach(function (y) { sum += y.Score; });
                    var moy = sum / all.length;
                    var score = moyProd + moyJuge - moy;
                    var data = new Models.Data;
                    data.AttributeCode = missingAttribute;
                    data.ProductCode = x.ProductCode;
                    data.Intake = x.Intake;
                    data.Replicate = x.Replicate;
                    data.SubjectCode = x.SubjectCode;
                    data.Session = x.Session;
                    data.Type = self.listData[0].Type;
                    data.Status = "Imputed";
                    data.Score = Math.round(score * 100) / 100;
                    //data.DataControlId = self.listData[0].DataControlId;
                    data.ControlName = self.listData[0].ControlName;
                    listImputedData.push(data);
                });
            });
            return listImputedData;
        };
        DatasetSummary.prototype.GetLogDiv = function () {
            var div = Framework.Form.TextElement.Create("");
            div.Append(Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("Sessions:", [this.Sessions.length.toString(), this.Sessions.join(', ')])));
            div.Append(Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("Replicates:", [this.Replicates.length.toString(), this.Replicates.join(', ')])));
            div.Append(Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("Intakes:", [this.Intakes.length.toString(), this.Intakes.join(', ')])));
            div.Append(Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("Products:", [this.Products.length.toString(), this.Products.join(', ')])));
            div.Append(Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("Attributes:", [this.Attributes.length.toString(), this.Attributes.join(', ')])));
            div.Append(Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("Subjects:", [this.Subjects.length.toString(), this.Subjects.join(', ')])));
            var pDataDiagnosis = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("CompleteAndBalanceDataset"));
            var pAnalysisTotalData = Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("AnalysisTotalDataCount", [this.DataCount.toString(), this.ExpectedDataCount.toString()]));
            var pAnalysisMissingData = Framework.Form.TextElement.Create("");
            if (this.MissingDataCount > 0) {
                pDataDiagnosis.Set(Framework.LocalizationManager.Get("UncompleteOrUnbalanceDataset"));
                pAnalysisMissingData.Set(Framework.LocalizationManager.Format("AnalysisMissingDataCount", [this.MissingDataCount.toString(), this.MissingDataPercentage.toString()]));
                //pAnalysisMissingData.Show();
                if (this.MissingDataPercentage < 20) {
                    //TODO pAnalysisTotalData.Set(Framework.LocalizationManager.Format("AnalysisImputedDataCount", [listImputedData.length.toString(), (Math.round(listImputedData.length / datasetSummary.ExpectedDataCount * 10000) / 100).toString()]));
                    //pAnalysisMissingData.Hide();
                }
                else {
                    pAnalysisMissingData.Set(Framework.LocalizationManager.Get("AnalysisMissingDataTooMuch"));
                }
            }
            div.Append(pAnalysisTotalData);
            div.Append(pAnalysisMissingData);
            div.Append(pDataDiagnosis);
            return div;
        };
        return DatasetSummary;
    }());
    PanelLeaderModels.DatasetSummary = DatasetSummary;
    var SessionInfo = /** @class */ (function () {
        function SessionInfo() {
        }
        return SessionInfo;
    }());
    PanelLeaderModels.SessionInfo = SessionInfo;
    var DefaultScreenOptions = /** @class */ (function () {
        function DefaultScreenOptions() {
            this.ScreenBackground = "white";
            this.Resolution = "4:3";
            this.ProgressBar = "None";
            this.ProgressBarPosition = "TopLeft";
            this.DefaultStyle = { FontSize: 32, FontFamily: "Calibri", FontColor: "darkblue" };
            this.Language = 'en';
            this.Language = Framework.LocalizationManager.GetDisplayLanguage();
        }
        DefaultScreenOptions.GetResolutionRatio = function (resolution) {
            var tab = resolution.split(':');
            return (Number(tab[0]) / Number(tab[1]));
        };
        DefaultScreenOptions.GetForm = function (defaultScreenOptions, onChange) {
            var options = Framework.Factory.Clone(defaultScreenOptions);
            var res = [];
            var formSetLanguage = Framework.Form.PropertyEditorWithPopup.Render("", "Language", defaultScreenOptions.Language, ['en', 'fr'], function (x) {
                options.Language = x;
                onChange("Language", options);
            });
            res.push(formSetLanguage);
            var formSetResolution = Framework.Form.PropertyEditorWithPopup.Render("", "Resolution", defaultScreenOptions.Resolution, Models.Screen.Resolutions, function (x) {
                options.Resolution = x;
                onChange("Resolution", options);
            });
            res.push(formSetResolution);
            var formSetProgressBar = Framework.Form.PropertyEditorWithPopup.Render("", "ProgressBar", defaultScreenOptions.ProgressBar, ScreenReader.Controls.CustomProgressBar.DisplayModeEnum, function (x) {
                options.ProgressBar = x;
                onChange("ProgressBar", options);
            });
            res.push(formSetProgressBar);
            var formSetProgressBarPosition = Framework.Form.PropertyEditorWithPopup.Render("", "ProgressBarPosition", defaultScreenOptions.ProgressBarPosition, ScreenReader.Controls.CustomProgressBar.PositionEnum, function (x) {
                options.ProgressBarPosition = x;
                onChange("ProgressBar", options);
            });
            res.push(formSetProgressBarPosition);
            var formSetScreenBackground = Framework.Form.PropertyEditorWithColorPopup.Render("", "ScreenBackground", defaultScreenOptions.ScreenBackground, function (x) {
                options.ScreenBackground = x;
                onChange("Background", options);
            });
            res.push(formSetScreenBackground);
            var formSetFontFamily = Framework.Form.PropertyEditorWithPopup.Render("", "FontFamily", defaultScreenOptions.DefaultStyle["FontFamily"], Framework.InlineHTMLEditor.FontNameEnum, function (x) {
                options.DefaultStyle["FontFamily"] = x;
                onChange("Style", options);
            });
            res.push(formSetFontFamily);
            var formSetFontSize = Framework.Form.PropertyEditorWithPopup.Render("", "FontSize", defaultScreenOptions.DefaultStyle["FontSize"], Framework.InlineHTMLEditor.FontSizeEnum, function (x) {
                options.DefaultStyle["FontSize"] = x;
                onChange("Style", options);
            });
            res.push(formSetFontSize);
            var formSetFontColor = Framework.Form.PropertyEditorWithColorPopup.Render("", "FontColor", defaultScreenOptions.DefaultStyle["FontColor"], function (x) {
                options.DefaultStyle["FontColor"] = x;
                onChange("Style", options);
            });
            res.push(formSetFontColor);
            return res;
        };
        return DefaultScreenOptions;
    }());
    PanelLeaderModels.DefaultScreenOptions = DefaultScreenOptions;
    var Session = /** @class */ (function (_super) {
        __extends(Session, _super);
        function Session() {
            var _this = _super.call(this) || this;
            _this.IsLocked = false;
            _this.Log = "";
            //public ListAttributes: Models.Attribute[] = []; // Conservé pour compatibilité V1
            _this.ListSubjects = [];
            _this.ListExperimentalDesigns = [];
            _this.ListScreens = [];
            _this.ListData = [];
            _this.MonitoringProgress = [];
            _this.OnLockedChanged = function () { };
            _this.OnChanged = function () { };
            _this.OnLog = function () { };
            _this.ListFriendlyNames = [];
            _this.Name = "";
            _this.ListSubjects = [];
            _this.ListExperimentalDesigns = [];
            _this.ListScreens = [];
            _this.ListData = [];
            //this.ListOutputs = [];
            _this.Upload = new Upload();
            _this.Upload.Date = undefined;
            _this.Upload.Description = "";
            _this.Upload.ExpirationDate = new Date(Date.now());
            _this.Upload.ExpirationDate.setMonth(_this.Upload.ExpirationDate.getMonth() + 2);
            _this.Upload.InitialUploader = undefined;
            _this.Upload.MailPath = undefined;
            _this.Upload.MinTimeBetweenConnexions = 0;
            _this.Upload.Password = "";
            _this.Upload.ServerCode = undefined;
            _this.Upload.ShowSubjectCodeOnClient = "NotStarted";
            _this.Upload.AnonymousMode = "NotAuthorized";
            _this.Mail = new PanelLeaderModels.Mail();
            _this.MonitoringProgress = [];
            _this.SubjectPasswordGenerator = new Framework.Random.Generator();
            _this.DefaultScreenOptions = new DefaultScreenOptions();
            _this.DataTabs = [];
            return _this;
        }
        Session.FromData = function (data) {
            var subjects = Framework.Array.Unique(data.map(function (x) { return x.SubjectCode; }));
            var products = Framework.Array.Unique(data.map(function (x) { return x.ProductCode; }));
            var attributes = Framework.Array.Unique(data.map(function (x) { return x.AttributeCode; }));
            var replicates = Framework.Array.Unique(data.map(function (x) { return x.Replicate; }));
            var intakes = Framework.Array.Unique(data.map(function (x) { return x.Intake; }));
            var session = new PanelLeaderModels.Session();
            session.LogAction("Creation", "New session from data.", false);
            subjects.forEach(function (x) {
                var subject = session.AddNewPanelist([]);
                subject.Code = x;
                session.AddNewPanelists([subject]);
            });
            var productDesign = session.GetNewDesign("Product", "Custom", replicates.length, []);
            productDesign.NbIntakes = intakes.length;
            session.AddNewDesign(productDesign);
            products.forEach(function (x) {
                var item = productDesign.GetNewItem([], []);
                item.Code = x;
                session.AddItemsToDesign(productDesign, [item]);
            });
            var attributeDesign = session.GetNewDesign("Attribute", "Custom", 1, []);
            session.AddNewDesign(attributeDesign);
            attributes.forEach(function (x) {
                var item = productDesign.GetNewItem([], []);
                item.Code = x;
                session.AddItemsToDesign(attributeDesign, [item]);
            });
            session.AddData(data, "Imported");
            return session;
        };
        Session.prototype.SetMailFromTemplate = function (template) {
            this.Mail.Body = template.Body;
            this.Mail.Subject = template.Subject;
            this.Mail.ReturnMailAddress = template.ReturnMailAddress;
            this.Mail.DisplayedName = template.DisplayedName;
            this.OnChanged();
        };
        Session.prototype.GetSessionInfo = function (dataBasePath) {
            var info = new SessionInfo();
            info.Description = this.Description;
            info.DataBasePath = dataBasePath + "/" + this.ID;
            info.LastSave = this.LastUpdate.substr(0, 4) + "-" + this.LastUpdate.substr(5, 2) + "-" + this.LastUpdate.substr(8, 2) + " " + this.LastUpdate.substr(11, 8);
            //info.LastSynchronisation = Framework.LocalizationManager.Get(this.Status);
            info.Log = this.Log;
            info.Size = Framework.Maths.Round((JSON.stringify(this).length / 1024), 2) + " ko";
            return info;
        };
        Session.prototype.Close = function () {
            // Ajout aux fichiers récents
            this.LogAction("Close", "Session closed.", false, false);
        };
        Session.prototype.GetSubjectSession = function () {
            var subjectSession = new Models.SubjectSeance();
            subjectSession.ListExperimentalDesigns = this.ListExperimentalDesigns;
            subjectSession.ListScreens = this.ListScreens;
            subjectSession.Subject = this.ListSubjects[0];
            subjectSession.Progress = new Models.Progress();
            subjectSession.Progress.CurrentState = new Models.State();
            subjectSession.Progress.CurrentState.CurrentScreen = 0;
            return subjectSession;
        };
        Session.prototype.LogAction = function (action, detail, logOnServer, triggerOnChange) {
            if (triggerOnChange === void 0) { triggerOnChange = true; }
            this.Log += "[" + Framework.Format.ToDateString() + ", " + this.Owner + "] " + detail + "\r\n";
            if (triggerOnChange == true) {
                this.OnChanged();
            }
            if (logOnServer == true) {
                this.OnLog(action, detail);
            }
        };
        Session.FromJSON = function (json) {
            var session = Framework.Factory.Create(PanelLeaderModels.Session, json);
            return session;
        };
        Session.FromJson = function (json, onStart, onComplete) {
            var self = this;
            onStart();
            // worker pour ne pas bloquer l'UI
            var worker = new Worker("ts/ReadJSONWorkerPL.js");
            worker.onmessage = function (e) {
                var session = Framework.Factory.CreateFrom(PanelLeaderModels.Session, e.data);
                session.OnChanged();
                onComplete(session);
                worker.terminate();
            };
            worker.postMessage(json);
        };
        Session.prototype.ToggleLock = function () {
            if (this.IsLocked == true) {
                this.IsLocked = false;
            }
            else {
                this.IsLocked = true;
            }
            this.OnLockedChanged(this.IsLocked);
            this.LogAction("Lock", "Session locked: " + this.IsLocked + ".", false);
        };
        Session.prototype.Check = function (login, returnMailAddress, displayedName) {
            if (login === void 0) { login = ""; }
            if (returnMailAddress === void 0) { returnMailAddress = ""; }
            if (displayedName === void 0) { displayedName = ""; }
            var session = this;
            // Vérification de la compatibilité
            if (session.Mail == undefined) {
                // Mail par défaut
                session.Mail = new PanelLeaderModels.Mail();
            }
            if (session.Mail.Body == undefined) {
                session.Mail.Body = Framework.LocalizationManager.Format("DefaultMail", ["[SUBJECT_FIRST_NAME]", "[SESSION_URL]", "[TIMESENS_HOMEPAGE_HYPERLINK]", "[SERVER_CODE]", "[SUBJECT_CODE]", "[SUBJECT_PASSWORD]"]);
            }
            if (session.Mail.Subject == undefined) {
                session.Mail.Subject = Framework.LocalizationManager.Get("NewSessionAvailable");
            }
            if (session.Mail.ReturnMailAddress == undefined) {
                session.Mail.ReturnMailAddress = returnMailAddress;
            }
            if (session.Mail.DisplayedName == undefined) {
                session.Mail.DisplayedName = displayedName;
            }
            if (session.Upload.InitialUploader == undefined) {
                session.Upload.InitialUploader = login;
            }
            session.Upload.MailPath = returnMailAddress;
            if (session.Upload.Description == undefined) {
                session.Upload.Description = session.Description;
            }
            if (session.Upload.ShowSubjectCodeOnClient == undefined) {
                session.Upload.ShowSubjectCodeOnClient = ScreenReader.PanelistCodeDisplayModeEnum[0].Value;
            }
            if (session.Upload.CheckCompatibilityMode == undefined) {
                session.Upload.CheckCompatibilityMode = "NoCheck";
            }
            if (session.Upload.AnonymousMode == undefined) {
                session.Upload.AnonymousMode = "NotAuthorized";
            }
            if (session.Upload.MinTimeBetweenConnexions == undefined) {
                session.Upload.MinTimeBetweenConnexions = 0;
            }
            if (session.Upload.Password == undefined) {
                session.Upload.Password = Framework.Random.Helper.GetRandomNumberAsString(4);
            }
            session.Owner = login;
            // Conversions pour compatibilité SL
            if ((session).ListUploads && (session).ListUploads.length > 0) {
                session.Upload = (session).ListUploads[0];
            }
            delete session["ListUploads"];
            if ((session).AnonymousAccess && (session).AnonymousAccess.Mode) {
                session.Upload.AnonymousMode = (session).AnonymousAccess.Mode;
            }
            if (session.Upload.ExpirationDate == undefined) {
                session.Upload.ExpirationDate = new Date(Date.now());
                session.Upload.ExpirationDate.setMonth(session.Upload.ExpirationDate.getMonth() + 2);
            }
            var colors = ["red", "blue", "lawngreen", "purple", "darkgrey", "cyan", "fuschia", "coral", "orange", "turquoise", "darkgreen", "violet", "gold", "indigo", "burlywood"];
            // Couleurs des attributs par défaut
            if (session["ListAttributes"]) {
                var colorIndex_1 = 0;
                session["ListAttributes"].forEach(function (x) {
                    if (x.Color == undefined) {
                        x.Color = colors[colorIndex_1];
                        colorIndex_1++;
                        if (colorIndex_1 == colors.length) {
                            colorIndex_1 = 0;
                        }
                    }
                });
            }
            if (session["ListProducts"]) {
                var colorIndex_2 = 0;
                // Couleurs des produits par défaut            
                session["ListProducts"].forEach(function (x) {
                    if (x.Color == undefined) {
                        x.Color = colors[colorIndex_2];
                        colorIndex_2++;
                        if (colorIndex_2 == colors.length) {
                            colorIndex_2 = 0;
                        }
                    }
                });
            }
            var listDesigns = [];
            session.ListExperimentalDesigns.forEach(function (x) {
                var design = Framework.Factory.CreateFrom(Models.ExperimentalDesign, x);
                design.ConvertFromSL();
                listDesigns.push(design);
            });
            session.ListExperimentalDesigns = listDesigns;
            session.ListFriendlyNames = [];
            // Controle ID par défaut
            session.ListScreens.forEach(function (screen) {
                var nbItems = 0;
                var nbJuges = 0;
                var nbReps = 0;
                var nbIntakes = 0;
                if (screen.ExperimentalDesignId == 0) {
                }
                else {
                    var designs = session.ListExperimentalDesigns.filter(function (x) { return screen.ExperimentalDesignId == x.Id; });
                    var currentDesign = designs[0];
                    nbItems = currentDesign.ListItems.length;
                    nbJuges = currentDesign.Subjects.length;
                    nbReps = currentDesign.NbReplicates;
                    nbIntakes = currentDesign.NbIntakes;
                }
                if (screen.ListConditions.AttributeConditions == undefined || nbItems < 2) {
                    screen.ListConditions.AttributeConditions = [];
                }
                if (screen.ListConditions.ProductConditions == undefined || nbItems < 2) {
                    screen.ListConditions.ProductConditions = [];
                }
                if (screen.ListConditions.ProductRankConditions == undefined || nbItems < 2) {
                    screen.ListConditions.ProductRankConditions = [];
                }
                if (screen.ListConditions.ReplicateConditions == undefined || nbReps < 2) {
                    screen.ListConditions.ReplicateConditions = [];
                }
                if (screen.ListConditions.SubjectConditions == undefined || nbJuges < 2) {
                    screen.ListConditions.SubjectConditions = [];
                }
                if (screen.ListConditions.IntakeConditions == undefined || nbIntakes < 2) {
                    screen.ListConditions.IntakeConditions = [];
                }
                screen.Controls = Models.Screen.SetControls(screen);
                screen.Controls.forEach(function (control) {
                    if (!control._FriendlyName || control._FriendlyName == "" || control._FriendlyName == "0" || (control._FriendlyName != undefined && session.ListFriendlyNames.indexOf(control._FriendlyName) > -1)) {
                        if (control._Id != undefined && control._Id != 0) {
                            control._FriendlyName = control._Id.toString();
                        }
                        else {
                            control._FriendlyName = session.GetUniqueControlFriendlyName(control, control._FriendlyName);
                        }
                    }
                    else {
                        session.ListFriendlyNames.push(control._FriendlyName);
                    }
                });
            });
            // Transformation ListProduct, ListAttribute, ListItemLabel en ListExperimentalDesignItem  
            session.ListExperimentalDesigns.forEach(function (design) {
                if (design.Type == "Product") {
                    Models.ExperimentalDesign.ConvertItemLabelsFromV1(design, session["ListProducts"]);
                }
                if (design.Type == "Attribute") {
                    Models.ExperimentalDesign.ConvertItemLabelsFromV1(design, session["ListAttributes"]);
                }
            });
        };
        Session.prototype.GetUniqueControlFriendlyName = function (control, name) {
            var i = 1;
            if (name == "") {
                var name_1 = control._Type + "_" + i.toString();
            }
            while (this.ListFriendlyNames.indexOf(name) > -1) {
                i += 1;
                name = control._Type + "_" + i.toString();
            }
            this.ListFriendlyNames.push(name);
            return name;
        };
        Session.FromFile = function (file, onStart, onComplete) {
            var self = this;
            //onStart();
            // Lecture du fichier local
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                var json = fileReader.result;
                Session.FromJson(json, onStart, onComplete);
            };
            fileReader.readAsText(file);
        };
        Session.FromTemplate = function (templatedSession) {
            var session = new Session();
            session.AddNewPanelists(session.GetNewPanelists(templatedSession.NbSubjects));
            templatedSession.ListExperimentalDesigns.forEach(function (x) {
                var design = session.GetNewDesign(x.Type, x.Order, x.NbReplicates, x.ListItems, x.Name);
                session.AddNewDesign(design);
            });
            var screenId = 1;
            templatedSession.Screens.forEach(function (x) {
                var templatedScreen = x.Screens.filter(function (y) { return y.Name == x.SelectedScreen; })[0];
                templatedScreen.DefaultScreenOptions = templatedSession.DefaultScreenOptions;
                //if (templatedScreen instanceof TemplatedScreenWithSubjectSummary) {
                //    session.AddScreen(Models.Screen.CreateScreenWithSubjectSummary(screenId, <TemplatedScreenWithSubjectSummary>templatedScreen));
                //}
                if (templatedScreen instanceof TemplatedScreenWithContent) {
                    if (templatedScreen instanceof TemplatedScreenWithExit) {
                        session.AddScreen(Models.Screen.CreateExitScreen(screenId, templatedScreen));
                    }
                    else {
                        session.AddScreen(Models.Screen.CreateScreenWithContent(screenId, templatedScreen));
                    }
                }
                if (templatedScreen instanceof TemplatedScreenWithCATA) {
                    session.AddScreen(Models.Screen.CreateCATAScreen(screenId, templatedScreen));
                }
                if (templatedScreen instanceof TemplatedScreenWithSorting) {
                    session.AddScreen(Models.Screen.CreateSortingScreen(screenId, templatedScreen));
                }
                if (templatedScreen instanceof TemplatedScreenWithRanking) {
                    session.AddScreen(Models.Screen.CreateRankingScreen(screenId, templatedScreen));
                }
                if (templatedScreen instanceof TemplatedScreenWithNapping) {
                    session.AddScreen(Models.Screen.CreateNappingScreen(screenId, templatedScreen));
                }
                if (templatedScreen instanceof TemplatedScreenWithDiscrimination) {
                    session.AddScreen(Models.Screen.CreateDiscriminationScreen(screenId, templatedScreen));
                }
                if (templatedScreen instanceof TemplatedScreenWithTDS) {
                    session.AddScreen(Models.Screen.CreateTDSScreen(screenId, templatedScreen));
                }
                if (templatedScreen instanceof TemplatedScreenWithDiscreteScale) {
                    session.AddScreen(Models.Screen.CreateDiscreteScaleScreen(screenId, templatedScreen));
                }
                if (templatedScreen instanceof TemplatedScreenWithContinuousScale) {
                    session.AddScreen(Models.Screen.CreateContinuousScaleScreen(screenId, templatedScreen));
                }
                if (templatedScreen instanceof TemplatedScreenWithTDSAndDiscreteScale) {
                    session.AddScreen(Models.Screen.CreateTDSAndDiscreteScaleScreen(screenId, templatedScreen));
                }
                if (templatedScreen instanceof TemplatedScreenWithTDSAndContinuousScale) {
                    session.AddScreen(Models.Screen.CreateTDSAndContinuousScaleScreen(screenId, templatedScreen));
                }
                screenId++;
            });
            //TODO : logo TimeSens
            //TODO : appliquer style, calculer coordonnées en fonction de résolution
            //TODO : options de déploiement
            session.OnChanged();
            return session;
        };
        Session.prototype.GetNewScreen = function (screen, index, experimentalDesignId) {
            if (screen === void 0) { screen = undefined; }
            if (index === void 0) { index = undefined; }
            if (experimentalDesignId === void 0) { experimentalDesignId = undefined; }
            if (screen == undefined) {
                screen = Models.Screen.Create(experimentalDesignId);
            }
            screen.Resolution = this.DefaultScreenOptions.Resolution;
            if (screen.Id == undefined) {
                var ids = this.ListScreens.map(function (x) { return x.Id; });
                var max = 0;
                if (ids.length > 0) {
                    max = Math.max.apply(null, ids);
                }
                screen.Id = max + 1;
            }
            return screen;
        };
        Session.prototype.AddScreen = function (screen, index, experimentalDesignId, newId) {
            if (screen === void 0) { screen = undefined; }
            if (index === void 0) { index = undefined; }
            if (experimentalDesignId === void 0) { experimentalDesignId = undefined; }
            if (newId === void 0) { newId = false; }
            if (index > -1) {
                if (index > 0) {
                    var background = this.ListScreens[index - 1].Background;
                    var resolution = this.ListScreens[index - 1].Resolution;
                }
                if (newId) {
                    var ids = this.ListScreens.map(function (x) { return x.Id; });
                    var max = 0;
                    if (ids.length > 0) {
                        max = Math.max.apply(null, ids);
                    }
                    screen.Id = max + 1;
                }
                this.ListScreens.splice(index + 1, 0, screen);
            }
            else {
                this.ListScreens.push(screen);
            }
            this.LogAction("Scenario", "Screen inserted at index " + index + ".", false);
        };
        Session.prototype.DeleteScreen = function (screenId) {
            var deletedScreenIndex = -1;
            var screenToDelte = undefined;
            for (var i = 0; i < this.ListScreens.length; i++) {
                if (this.ListScreens[i].Id == screenId) {
                    screenToDelte = this.ListScreens[i];
                    deletedScreenIndex = i;
                    break;
                }
            }
            Framework.Array.Remove(this.ListScreens, screenToDelte);
            var newSelectedScreenIndex = 0;
            if (deletedScreenIndex > 0) {
                newSelectedScreenIndex = deletedScreenIndex - 1;
            }
            this.LogAction("Scenario", "Screen deleted at index " + deletedScreenIndex + ".", false);
            return this.ListScreens[newSelectedScreenIndex].Id;
        };
        Session.prototype.MoveScreen = function (index, direction) {
            var newIndex;
            if (direction == "up" && index > 0) {
                newIndex = index - 1;
            }
            if (direction == "down" && index < this.ListScreens.length - 1) {
                newIndex = index + 1;
            }
            Framework.Array.SwapElementsAt(this.ListScreens, index, newIndex);
            this.LogAction("Scenario", "Screen " + index + " moved " + direction + ".", false);
        };
        Session.prototype.ChangeAllScreensResolution = function (resolution) {
            var _this = this;
            var self = this;
            var resizeRatio = DefaultScreenOptions.GetResolutionRatio(resolution) / DefaultScreenOptions.GetResolutionRatio(this.DefaultScreenOptions.Resolution);
            this.DefaultScreenOptions.Resolution = resolution;
            this.ListScreens.forEach(function (x) {
                x.Resolution = _this.DefaultScreenOptions.Resolution;
                x.Controls.forEach(function (c) {
                    c._Left *= resizeRatio;
                    //c._Top *= resizeRatio;
                    //c._Height *= resizeRatio;
                    c._Width *= resizeRatio;
                });
            });
            this.LogAction("Scenario", "Screen resolution changed to " + resolution + ".", false);
        };
        Session.prototype.AddItemsToDesign = function (design, items) {
            var self = this;
            var existing = [];
            items.forEach(function (x) {
                var uniqueCode = self.GetUniqueCode(design.ListItems, "Code", x.Code);
                if (x.Code != uniqueCode) {
                    x.Code = uniqueCode;
                    existing.push(x.Code);
                }
                if (x.LongName == null) {
                    x.LongName = x.Code;
                }
                if (x.Color == null) {
                    x.Color = Framework.Color.GetColorFromContrastedPalette(design.ListItems.map(function (x) { return x.Color; }));
                }
                design.AddItem(x);
            });
            this.LogAction("Protocol", "Items " + items.map(function (x) { return x.Code; }).join(', ') + " added to design " + design.Name + ".", false);
            return existing;
        };
        Session.prototype.EditDesignRanks = function (design, subjectCodes, itemCode, replicate, newRank) {
            subjectCodes.forEach(function (x) {
                design.SetItemRank(itemCode, replicate, newRank, x);
            });
            this.LogAction("Protocol", "Row order of design " + design.Name + " ranks changed.", false);
        };
        Session.prototype.ResetDesign = function (design) {
            design.Reset();
            this.LogAction("Protocol", "Design " + design.Name + " reset.", false);
        };
        Session.prototype.UpdateDesignLabels = function (design, items) {
            design.UpdateItemLabels(items);
            this.LogAction("Protocol", "Item labels updated.", false);
        };
        Session.prototype.RemoveItemsFromDesign = function (design, items, removeData) {
            var codes = items.map(function (x) { return x.Code; });
            design.RemoveItems(codes);
            if (design.Type == "Product") {
                this.removeData(codes, "ProductCode");
            }
            if (design.Type == "Attribute") {
                this.removeData(codes, "AttributeCode");
            }
            this.LogAction("Protocol", "Items " + codes.join(',') + " removed from design " + design.Name + ".", false);
        };
        Session.prototype.UpdateItemLabel = function (design, oldCode, newCode, replicate, newLabel, oldLabel) {
            design.UpdateItemLabel(oldCode, newCode, replicate, newLabel, oldLabel);
            this.LogAction("Protocol", "Item label updated.", false);
        };
        Session.prototype.SetSubjectsPasswords = function (subjects, newPasswords) {
            if (newPasswords === void 0) { newPasswords = undefined; }
            var oldPasswords = subjects.map(function (x) { return x.Password; });
            if (newPasswords == undefined) {
                newPasswords = Framework.Random.Helper.GetUniqueRandomCodes(subjects.map(function (s) { return s.Password; }), subjects.length, this.SubjectPasswordGenerator.IncludeDigits, this.SubjectPasswordGenerator.IncludeLowercases, this.SubjectPasswordGenerator.IncludeUppercases, this.SubjectPasswordGenerator.Length);
            }
            for (var i = 0; i < subjects.length; i++) {
                subjects[i].Password = newPasswords[i];
            }
            this.LogAction("Protocol", "Passwords changed for subjcets " + subjects.join(', ') + ".", false);
            return { newPasswords: newPasswords, oldPasswords: oldPasswords };
        };
        Session.prototype.ResetSubjectsPasswords = function (subjects) {
            for (var i = 0; i < subjects.length; i++) {
                subjects[i].Password = "";
            }
            this.LogAction("Protocol", "Passwords reseted for subjects " + subjects.join(', ') + ".", false);
        };
        Session.prototype.SetMonitoringProgress = function (url, resetProgress) {
            var self = this;
            if (this.MonitoringProgress == undefined || resetProgress == true) {
                this.MonitoringProgress = [];
            }
            this.ListSubjects.forEach(function (s) {
                var p;
                var subjectProgress = self.MonitoringProgress.filter(function (x) { return x.SubjectCode == s.Code; });
                if (subjectProgress.length == 0) {
                    p = new PanelLeaderModels.MonitoringProgress();
                    p.URL = undefined;
                    p.LastAccess = "-";
                    p.MailStatus = Framework.LocalizationManager.Get("NotSent");
                    p.Progress = "-";
                    p.SubjectCode = s.Code;
                    p.Password = s.Password;
                    self.MonitoringProgress.push(p);
                }
                else {
                    p = subjectProgress[0];
                }
                p.FirstName = s.FirstName;
                p.LastName = s.LastName;
                p.Mail = s.Mail;
                if (self.Upload.ServerCode != undefined) {
                    p.URL = url + "/panelist/index.html?servercode=" + self.Upload.ServerCode + "&subjectcode=" + s.Code + "&password=" + s.Password; //TODO: crypter les paramètres, notamment panelleader                   
                }
                var nbProducts = Framework.Array.Unique(self.ListData.filter(function (x) { return x.SubjectCode == p.SubjectCode && x.ProductCode.length > 0; }).map(function (x) { return x.ProductCode; })).length;
                if (nbProducts > 0) {
                    p.Products = nbProducts.toString(); //TODO : 1/x
                }
                else {
                    p.Products = "-";
                }
            });
            this.OnChanged();
            //TODO : supprimer les juges qui ont élé enlevés
        };
        Session.prototype.monitoringProgressToArray = function () {
            var session = this;
            var res = [];
            //let titleRow = ["Session code", "Subject code", "Password", /*Framework.LocalizationManager.Get("FirstName"), Framework.LocalizationManager.Get("LastName"),*/ /*Framework.LocalizationManager.Get("Mail"),*/ "URL to open the session"/*, Framework.LocalizationManager.Get("Products"), Framework.LocalizationManager.Get("Progress"), Framework.LocalizationManager.Get("Date")*/];
            var titleRow = ["Session code", "Subject code", "Password", "URL to open the session", Framework.LocalizationManager.Get("Progress"), Framework.LocalizationManager.Get("Date")];
            res.push(titleRow);
            session.MonitoringProgress.forEach(function (x) {
                var row = [session.Upload.ServerCode, x.SubjectCode, x.Password, MonitoringProgress.GetEncryptedURL(x.URL), x.Progress, x.LastAccess];
                res.push(row);
            });
            return res;
        };
        Session.prototype.UpdateMonitoringProgress = function (url, progress) {
            var session = this;
            this.SetMonitoringProgress(url, false);
            progress.forEach(function (p) {
                var subjectProgresses = session.MonitoringProgress.filter(function (x) { return x.SubjectCode == p.SubjectCode; });
                if (subjectProgresses.length > 0) {
                    subjectProgresses[0].Progress = p.Progress;
                    subjectProgresses[0].LastAccess = p.LastAccess;
                }
                //subjectProgress.MailStatus = p.CurrentState.MailStatus;
            });
            this.OnChanged();
            return session.MonitoringProgress;
        };
        Session.prototype.listDataContains = function (codes, attributeName) {
            var res = false;
            var existingCodes = this.ListData.map(function (x) { return x[attributeName]; });
            codes.forEach(function (x) {
                if (existingCodes.indexOf(x) > -1) {
                    res = true;
                }
            });
            return res;
        };
        Session.prototype.ListDataContainsProductCode = function (codes) {
            return this.listDataContains(codes, "ProductCode");
        };
        Session.prototype.ListDataContainsAttributeCode = function (codes) {
            return this.listDataContains(codes, "AttributeCode");
        };
        Session.prototype.ListDataContainsSubjectCode = function (codes) {
            return this.listDataContains(codes, "SubjectCode");
        };
        Session.prototype.RemoveDesign = function (design, associatedData) {
            if (associatedData === void 0) { associatedData = []; }
            Framework.Array.Remove(this.ListExperimentalDesigns, design);
            Framework.Array.Remove(this.ListData, associatedData);
            this.LogAction("Protocol", "Design " + design.Name + " removed.", false);
        };
        Session.prototype.CheckIfDesignIsUsedByControl = function (design) {
            for (var i = 0; i < this.ListScreens.length; i++) {
                var screen_1 = this.ListScreens[i];
                if (screen_1.ExperimentalDesignId == design.Id) {
                    return "Screen " + (i + 1);
                }
                for (var j = 0; j < screen_1.Controls.length; j++) {
                    var control = screen_1.Controls[j];
                    if (control["ExperimentalDesignId"] == design.Id) {
                        return "Control " + control._FriendlyName;
                    }
                }
            }
            return "";
        };
        Session.prototype.GetDesignData = function (design) {
            var self = this;
            var res = [];
            design.ListItems.forEach(function (item) {
                var variable = "";
                if (design.Type == "Product") {
                    variable = "ProductCode";
                }
                if (design.Type == "Attribute") {
                    variable = "AttributeCode";
                }
                self.ListData.filter(function (x) { return x[variable] == item.Code; }).forEach(function (d) {
                    res.push(d);
                });
            });
            return res;
        };
        Session.prototype.UpdateDesign = function (design, source) {
            design.Type = source.Type;
            design.ShuffleReplicates = source.ShuffleReplicates;
            design.RandomCodeGenerator = source.RandomCodeGenerator;
            design.PresentationMode = source.PresentationMode;
            design.Order = source.Order;
            design.NoConsecutiveItems = source.NoConsecutiveItems;
            design.NbReplicates = source.NbReplicates;
            design.NbIntakes = source.NbIntakes;
            design.Name = source.Name;
            design.ListItems = Framework.Factory.Clone(source.ListItems);
            design.ListExperimentalDesignRows = Framework.Factory.Clone(source.ListExperimentalDesignRows);
            design.KeepRanksBetweenReplicates = source.KeepRanksBetweenReplicates;
            this.LogAction("Protocol", "Design " + design.Name + " updated.", false);
        };
        Session.prototype.RemoveSubjects = function (subjects, removeData) {
            // Suppression dans les plans de présentation
            var codes = subjects.map(function (x) { return x.Code; });
            this.ListExperimentalDesigns.forEach(function (x) { x.RemoveSubjects(codes); });
            var listSubjectsChanged = false;
            var listDataChanged = false;
            var listExperimentalDesignChanged = false;
            var self = this;
            subjects.forEach(function (s) {
                // Suppression de la liste des produits
                Framework.Array.Remove(self.ListSubjects, s);
                listSubjectsChanged = true;
                // Suppression de la liste des données
                if (removeData == true) {
                    var data = self.ListData.filter(function (x) {
                        return x.SubjectCode == s.Code;
                    });
                    data.forEach(function (d) {
                        Framework.Array.Remove(self.ListData, d);
                        listDataChanged = true;
                    });
                }
            });
            self.LogAction("Protocol", "Subject(s) " + codes.join(', ') + " removed.", false);
        };
        Session.prototype.RemoveData = function (data) {
            var self = this;
            data.forEach(function (d) {
                Framework.Array.Remove(self.ListData, d);
            });
            self.LogAction("Data", data.length + " data rows removed.", false);
        };
        Session.prototype.removeData = function (codes, attributeName) {
            var self = this;
            var cpt = 0;
            codes.forEach(function (x) {
                var data = self.ListData.filter(function (y) { return y[attributeName] == x; });
                data.forEach(function (y) {
                    Framework.Array.Remove(self.ListData, y);
                    cpt++;
                });
            });
            self.LogAction("Data", cpt + " data rows removed.", false);
        };
        Session.prototype.GetNewData = function (sheetName, dType, nb) {
            if (nb === void 0) { nb = 1; }
            var data = [];
            for (var i = 0; i < nb; i++) {
                var d = new Models.Data();
                d.SheetName = sheetName;
                d.Type = dType;
                d.Status = "Inserted";
                d.AttributeCode = "";
                d.ProductCode = "";
                d.SubjectCode = "";
                d.Time = 0;
                //TODO : remplir champs en fonction de dtype
                data.push(d);
            }
            return data;
        };
        Session.prototype.GetNewItems = function (design, nb) {
            if (nb === void 0) { nb = 1; }
            var items = [];
            for (var i = 0; i < nb; i++) {
                var item = design.GetNewItem(items.map(function (x) { return x.Code; }), Framework.Array.Merge(design.ListItems.map(function (x) { return x.Color; }), items.map(function (x) { return x.Color; })));
                items.push(item);
            }
            return items;
        };
        Session.prototype.exists = function (listData, attributeName, attributeValue) {
            var count = listData.filter(function (x) { return x[attributeName] == attributeValue; }).length;
            return count > 0;
        };
        Session.prototype.GetUniqueCode = function (listData, attributeName, attributeValue) {
            var newCode = attributeValue;
            var index = 1;
            while (this.exists(listData, attributeName, newCode) == true) {
                newCode = attributeValue + "_" + index;
                index++;
            }
            return newCode;
        };
        Session.prototype.AddNewPanelist = function (newCodes) {
            var subject = new Models.Subject();
            subject.Code = Framework.Format.GetCode(this.ListSubjects.map(function (x) { return x.Code; }).concat(newCodes), "S");
            return subject;
        };
        Session.prototype.GetNewPanelists = function (nb) {
            if (nb === void 0) { nb = 1; }
            var subjects = [];
            var newCodes = [];
            for (var i = 0; i < nb; i++) {
                var subject = this.AddNewPanelist(newCodes);
                subjects.push(subject);
                newCodes.push(subject.Code);
            }
            return subjects;
        };
        Session.prototype.UpdateSubjectCodes = function (oldValue, newValue) {
            // MAJ dans les plans prés
            this.ListExperimentalDesigns.forEach(function (design) {
                design.ListExperimentalDesignRows.filter(function (x) { return x.SubjectCode == oldValue; }).forEach(function (row) {
                    row.SubjectCode = newValue;
                });
            });
            // MAJ dans les données
            this.ListData.filter(function (x) { return x.SubjectCode == oldValue; }).forEach(function (data) {
                data.SubjectCode = newValue;
            });
            this.OnChanged();
        };
        Session.prototype.GetDesignFromInlineDesign = function (dtype, items) {
            // Transformation inlinedesign en ExperimentalDesignRow[]
            var rows = [];
            var itemLabels = [];
            var subjects = [];
            items.forEach(function (item) {
                // item: SubjectCode Rank 1 Rank 2 ...
                var subjectCode = item["SubjectCode"];
                if (subjects.filter(function (s) { return s.Code == subjectCode; }).length == 0) {
                    var subject = new Models.Subject();
                    subject.Code = subjectCode;
                    subjects.push(subject);
                }
                for (var rank = 1; rank <= 50; rank++) {
                    if (item["Rank" + rank]) {
                        var row = new Models.ExperimentalDesignRow();
                        var code = item["Rank" + rank];
                        var replicate = rows.filter(function (r) { return r.SubjectCode == subjectCode && r.Code == code; }).length + 1;
                        row.SubjectCode = subjectCode;
                        row.Code = code;
                        row.Rank = rank;
                        row.Replicate = replicate;
                        row.Label = code; //TODO : générer nouveau label si produit ?
                        rows.push(row);
                        var listLabelsWithCode = itemLabels.filter(function (x) { return x.Code == code; });
                        if (listLabelsWithCode.length == 0) {
                            var item_1 = new Models.ExperimentalDesignItem();
                            item_1.Code = row.Code;
                            item_1.LongName = row.Code;
                            item_1.Labels = [];
                            itemLabels.push(item_1);
                        }
                        listLabelsWithCode = itemLabels.filter(function (x) { return x.Code == code; });
                        listLabelsWithCode.forEach(function (x) {
                            if (x.Labels.filter(function (kvp) { return kvp.Key == replicate; }).length == 0) {
                                x.Labels.push(new Framework.KeyValuePair(replicate, row.Code));
                            }
                        });
                    }
                }
            });
            var existingSubjects = this.AddNewPanelists(subjects);
            var existingItems;
            //TOFIX
            //if (dtype == "Product") {
            //   //TODO : pair, triangle...        
            //    existingItems = this.AddNewProducts(products);
            //}
            //if (dtype == "Attribute") {
            //    existingItems = this.AddNewAttributes(attributes);
            //}
            //Renommage dans itemlabels et dans rows 
            existingSubjects.forEach(function (s) {
                var subjectRows = rows.filter(function (x) { return x.SubjectCode == s.Key; });
                subjectRows.forEach(function (x) { x.Code = s.Value; });
            });
            //existingItems.forEach((item) => {
            //    let il = itemLabels.filter((x) => { return x.Code == item.Key });
            //    il.forEach((x) => { x.Code = item.Value });
            //    let itemRows = rows.filter((x) => { return x.Code == item.Key });
            //    itemRows.forEach((x) => { x.Code = item.Value });
            //});
            var newDesign = this.GetNewDesign(dtype, "Custom", Framework.Array.Unique(rows.map(function (x) { return x.Replicate; })).length, itemLabels);
            newDesign.ListExperimentalDesignRows = rows;
            var existingSubjectCodes = existingSubjects.map(function (x) { return x.Key.toString(); });
            //let existingItemCodes: string[] = existingItems.map((x) => { return x.Key.toString(); });
            var existingItemCodes;
            return { design: newDesign, existingSubjects: existingSubjectCodes, existingItems: existingItemCodes };
        };
        Session.prototype.AddNewPanelists = function (subjects) {
            var existing = [];
            var self = this;
            subjects.forEach(function (x) {
                var uniqueCode = self.GetUniqueCode(self.ListSubjects, "Code", x.Code);
                if (x.Code != uniqueCode) {
                    var code = x.Code;
                    x.Code = uniqueCode;
                    existing.push(new Framework.KeyValuePair(code, uniqueCode));
                }
                self.ListSubjects.push(x);
            });
            // MAJ des plans de présentation  
            this.ListExperimentalDesigns.forEach(function (x) {
                //x.Update([s.Code], x.ListItemLabels);
                x.AddSubjects(subjects.map(function (y) { return y.Code; }));
            });
            //if (this.OnListSubjectChanged) {
            //    this.OnListSubjectChanged(s, "New");
            //}
            //TODO + modif plan prés (Listitems, listrows)
            //_code = StringExtensions.RemoveTrimming0(StringExtensions.RemoveDiacritics(value));
            self.LogAction("Protocol", "Subject(s) " + subjects.map(function (x) { return x.Code; }).join(', ') + " added.", false);
            return existing;
        };
        Session.prototype.GetNewDesign = function (edtype, order, replicates, items, name) {
            if (name === void 0) { name = ''; }
            var id = 1;
            while (this.ListExperimentalDesigns.filter(function (x) { return x.Id == id; }).length > 0) {
                id++;
            }
            var subjects = this.ListSubjects.map(function (x) { return x.Code; });
            var design = Models.ExperimentalDesign.Create(edtype, id, subjects, order, replicates, items);
            if (name.length > 0) {
                design.Name = name;
            }
            else {
                design.Name = Framework.LocalizationManager.Format("ExperimentalDesignOfType", [Framework.LocalizationManager.Get(edtype), id.toString()]);
            }
            var nameSuffix = 0;
            var designName = design.Name;
            while (this.ListExperimentalDesigns.filter(function (x) { return x.Name == design.Name; }).length > 0) {
                nameSuffix++;
                design.Name = designName + " (" + nameSuffix + ")";
            }
            return design;
        };
        Session.prototype.AddNewDesign = function (design) {
            this.ListExperimentalDesigns.push(design);
            this.LogAction("Protocol", "New " + design.Type + " design added.", false);
        };
        Session.prototype.ApplyStyle = function (style) {
            var self = this;
            self.DefaultScreenOptions.DefaultStyle = style;
            this.ListScreens.forEach(function (x) {
                x.Controls.forEach(function (control) {
                    control.SetStyle(self.DefaultScreenOptions.DefaultStyle);
                });
            });
            this.LogAction("Scenario", "Screens style changed.", false);
        };
        Session.ApplyStyleS = function (style, session) {
            session.ApplyStyle(style);
        };
        Session.prototype.SetListScreensBackground = function (background) {
            var self = this;
            this.DefaultScreenOptions.ScreenBackground = background;
            this.ListScreens.forEach(function (x) {
                x.Background = background;
            });
            this.LogAction("Scenario", "Screens' background changed.", false);
        };
        Session.prototype.SetListScreensProgressBar = function (position, ptype) {
            var self = this;
            var index = 0;
            this.DefaultScreenOptions.ProgressBarPosition = position;
            this.DefaultScreenOptions.ProgressBar = ptype;
            this.ListScreens.forEach(function (x) {
                //let screen = Framework.Factory.CreateFrom(Models.Screen, x);
                //screen.SetProgressBar(position, ptype, index + 1, self.ListScreens.length);
                Models.Screen.SetProgressBar(x, position, ptype, index + 1, self.ListScreens.length);
                index++;
            });
            this.LogAction("Scenario", "Screens' progress bars changed.", false);
        };
        Session.prototype.SaveAsUndeployedCopy = function (deleteUpload, deleteData, deleteSubjects, deleteProducts, deleteAttributes, deleteMail) {
            var copyOfSession = Framework.Factory.CreateFrom(PanelLeaderModels.Session, this);
            copyOfSession.Description = this.Description + " " + Framework.LocalizationManager.Get("CopyOf");
            copyOfSession.ID = undefined;
            copyOfSession.LocalDirectoryId = undefined;
            copyOfSession.Log = "";
            if (deleteData == true) {
                copyOfSession.ListData = [];
            }
            if (deleteSubjects == true) {
                copyOfSession.ListSubjects = [];
                copyOfSession.ListExperimentalDesigns.forEach(function (x) {
                    x.ListExperimentalDesignRows = [];
                });
            }
            if (deleteProducts == true) {
                copyOfSession.ListExperimentalDesigns.filter(function (x) { return x.Type == "Product"; }).forEach(function (x) {
                    x.ListExperimentalDesignRows = [];
                    x.ListItems = [];
                });
            }
            if (deleteAttributes == true) {
                copyOfSession.ListExperimentalDesigns.filter(function (x) { return x.Type == "Attribute"; }).forEach(function (x) {
                    x.ListExperimentalDesignRows = [];
                    x.ListItems = [];
                });
            }
            if (deleteMail == true) {
                copyOfSession.Mail = undefined;
            }
            if (deleteUpload == true) {
                copyOfSession.Upload = new PanelLeaderModels.Upload();
                copyOfSession.IsLocked = false;
                copyOfSession.MonitoringProgress = [];
            }
            return copyOfSession;
        };
        Session.prototype.AddControlToScreen = function (screen, control, onSelect, style) {
            if (style === void 0) { style = true; }
            if (control == undefined) {
                return;
            }
            screen.Controls.push(control);
            control.OnSelect = function (control) {
                onSelect(control);
            };
            control._FriendlyName = this.GetUniqueControlFriendlyName(control, control._FriendlyName);
            if (screen.Container) {
                control.RenderWithAdorner(screen.Container, screen, screen.Ratio);
                //TODO : ajouter control id et control name unique    
                control.SetCoordinates();
                if (style == true) {
                    control.SetStyle(this.DefaultScreenOptions.DefaultStyle);
                }
                if (control instanceof ScreenReader.Controls.CustomImage) {
                    setTimeout(function () {
                        control.Resize();
                    }, 500);
                }
                onSelect(control);
            }
            this.LogAction("Scenario", "control " + control._FriendlyName + " added on screen " + screen.Id + ".", false);
        };
        Session.prototype.RemoveControlFromScreen = function (screen, control) {
            control.SetScreen(screen);
            control.Delete();
            this.LogAction("Scenario", "control " + control._FriendlyName + " removed from screen " + screen.Id + ".", false);
        };
        Session.prototype.UpdateControlName = function (control, oldName, newName) {
            while (this.ListFriendlyNames.indexOf(newName) > -1) {
                // Le nom existe déjà, nouveau nom généré
                newName += "1";
            }
            Framework.Array.Remove(this.ListFriendlyNames, oldName);
            this.ListFriendlyNames.push(newName);
            control._FriendlyName = newName;
            this.LogAction("Scenario", "Control " + oldName + " renamed " + newName + ".", false);
        };
        ;
        Session.prototype.GetNewDataTab = function () {
            var name = Framework.LocalizationManager.Get("Tab");
            var index = 1;
            while (this.DataTabs.indexOf(name + " " + index) > -1) {
                index++;
            }
            return name + " " + index;
        };
        Session.prototype.AddDataTab = function (name) {
            this.DataTabs.push(name);
            this.LogAction("Data", "Tab " + name + " added.", false);
        };
        Session.prototype.RemoveDataTab = function (name) {
            Framework.Array.Remove(this.DataTabs, name);
            this.LogAction("Data", "Tab " + name + " removed.", false);
        };
        Session.prototype.MoveSelectionToAnotherTab = function (selectedData, newTab, deleteAfterCopy) {
            var self = this;
            if (newTab == Framework.LocalizationManager.Get("NewTab")) {
                newTab = this.GetNewDataTab();
                this.AddDataTab(newTab);
            }
            // "Déplacement" des données = changement de SheetName
            // "Copie" des données = duplication des données
            selectedData.forEach(function (x) {
                if (deleteAfterCopy == false) {
                    var newData = Framework.Factory.Clone(x);
                    self.ListData.push(newData);
                }
                x.Status = "Computed";
                x.SheetName = newTab;
            });
            self.LogAction("Data", selectedData.length + " data rows moved to " + newTab + ".", false);
        };
        Session.prototype.TransformSessionsInReplicates = function (selectedData, copy) {
            var self = this;
            var tab = selectedData[0].SheetName;
            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }
            var sessions = Framework.Array.Unique(selectedData.map(function (x) { return x.Session; }));
            selectedData.forEach(function (x) {
                if (copy == true) {
                    var newData = Framework.Factory.Clone(x);
                    self.ListData.push(newData);
                }
                x.SheetName = tab;
                x.Replicate = sessions.indexOf(x.Session) + 1;
                x.Session = 1;
                x.Status = "Computed";
            });
            self.LogAction("Data", selectedData.length + " data rows updated (sessions transformed in replicates).", false);
        };
        Session.prototype.TransformReplicatesInIntakes = function (selectedData, copy) {
            var self = this;
            var tab = selectedData[0].SheetName;
            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }
            selectedData.forEach(function (x) {
                if (copy == true) {
                    var newData = Framework.Factory.Clone(x);
                    self.ListData.push(newData);
                }
                x.SheetName = tab;
                x.Intake = x.Replicate;
                x.Replicate = 1;
                x.Status = "Computed";
            });
            self.LogAction("Data", selectedData.length + " data rows updated (replicates transformed in intakes).", false);
        };
        Session.prototype.TransformScoresInMeans = function (selectedData, copy, variable) {
            var self = this;
            var tab = selectedData[0].SheetName;
            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }
            var subjects = Framework.Array.Unique(selectedData.map(function (x) { return x.SubjectCode; }));
            subjects.forEach(function (subject) {
                var subjectData = selectedData.filter(function (x) {
                    return x.SubjectCode == subject;
                });
                var products = Framework.Array.Unique(subjectData.map(function (x) { return x.ProductCode; }));
                products.forEach(function (product) {
                    var productData = subjectData.filter(function (x) {
                        return x.ProductCode == product;
                    });
                    var attributes = Framework.Array.Unique(productData.map(function (x) { return x.AttributeCode; }));
                    attributes.forEach(function (attribute) {
                        var attributeData = productData.filter(function (x) {
                            return x.AttributeCode == attribute;
                        });
                        var group1;
                        var group2;
                        var dataGroup1 = [];
                        var dataGroup2 = [];
                        if (variable == "Session") {
                            group1 = "Replicate";
                            group2 = "Intake";
                            //let replicates = Framework.Array.Unique(attributeData.map((x) => { return x.Replicate; }));
                            //replicates.forEach((replicate) => {
                            //    let replicateData = attributeData.filter((x) => {
                            //        return x.Replicate == replicate;
                            //    });
                            //    let intakes = Framework.Array.Unique(replicateData.map((x) => { return x.Intake; }));
                            //    intakes.forEach((intake) => {
                            //        let data = replicateData.filter((x) => {
                            //            return x.Intake == intake;
                            //        });
                            //        let sum = 0;
                            //        data.forEach((d) => {
                            //            sum += d.Score;
                            //        });
                            //        let newData = Framework.Factory.Clone(data[0]);
                            //        newData.Score = sum / data.length;
                            //        newData.SheetName = tab;
                            //        newData.Status = "Computed";
                            //        self.session.ListData.push(newData);                                    
                            //        if (copy == false) {
                            //            data.forEach((d) => {
                            //                Framework.Array.Remove(selectedData, d);
                            //            });
                            //        }
                            //    });
                            //});
                        }
                        if (variable == "Replicate") {
                            group1 = "Session";
                            group2 = "Intake";
                        }
                        if (variable == "Intake") {
                            group1 = "Session";
                            group2 = "Replicate";
                        }
                        dataGroup1 = Framework.Array.Unique(attributeData.map(function (x) { return x[group1]; }));
                        dataGroup1.forEach(function (g1) {
                            var g1Data = attributeData.filter(function (x) {
                                return x[group1] == g1;
                            });
                            dataGroup2 = Framework.Array.Unique(g1Data.map(function (x) { return x[group2]; }));
                            dataGroup2.forEach(function (g2) {
                                var g2Data = g1Data.filter(function (x) {
                                    return x[group2] == g2;
                                });
                                var sum = 0;
                                g2Data.forEach(function (d) {
                                    sum += d.Score;
                                });
                                var newData = Framework.Factory.Clone(g2Data[0]);
                                newData.Score = sum / g2Data.length;
                                newData.SheetName = tab;
                                newData.Status = "Computed";
                                self.ListData.push(newData);
                                if (copy == false) {
                                    g2Data.forEach(function (d) {
                                        Framework.Array.Remove(selectedData, d);
                                    });
                                }
                            });
                        });
                        //TOCHECK
                    });
                });
            });
            self.LogAction("Data", selectedData.length + " data rows updated (scores averaged).", false);
        };
        Session.prototype.TransformScores = function (selectedData, copy, transformation) {
            var self = this;
            var tab = selectedData[0].SheetName;
            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }
            selectedData.forEach(function (x) {
                if (copy == true) {
                    var newData = Framework.Factory.Clone(x);
                    self.ListData.push(newData);
                }
                x.SheetName = tab;
                if (transformation == 'sqrt') {
                    x.Score = Framework.Maths.Round(Math.sqrt(x.Score), 3);
                }
                if (transformation == 'log') {
                    x.Score = Framework.Maths.Round(Math.log(x.Score), 3);
                }
                x.Status = "Computed";
            });
            self.LogAction("Data", selectedData.length + " data rows updated (scores transformed in " + transformation + ").", false);
        };
        Session.prototype.TransformScoresInRanks = function (selectedData, copy) {
            var self = this;
            var tab = selectedData[0].SheetName;
            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }
            var sessions = Framework.Array.Unique(selectedData.map(function (x) { return x.Session; }));
            var replicates = Framework.Array.Unique(selectedData.map(function (x) { return x.Replicate; }));
            var intakes = Framework.Array.Unique(selectedData.map(function (x) { return x.Intake; }));
            var subjects = Framework.Array.Unique(selectedData.map(function (x) { return x.SubjectCode; }));
            var attributes = Framework.Array.Unique(selectedData.map(function (x) { return x.AttributeCode; }));
            sessions.forEach(function (session) {
                replicates.forEach(function (replicate) {
                    intakes.forEach(function (intake) {
                        subjects.forEach(function (subject) {
                            attributes.forEach(function (attribute) {
                                var data = selectedData.filter(function (x) { return x.Session == session && x.Replicate == replicate && x.Intake == intake && x.SubjectCode == subject && x.AttributeCode == attribute; });
                                // Tri par score
                                data = Framework.Array.SortBy(data, "Score");
                                var rank = 1;
                                for (var i = 0; i < data.length; i++) {
                                    var d = data[i];
                                    if (copy == true) {
                                        var newData = Framework.Factory.Clone(d);
                                        self.ListData.push(newData);
                                    }
                                    //TOCHECK (égalités)
                                    if ((i + 1) < data.length && d.Score < data[i + 1].Score) {
                                        d.Score = i + 1;
                                        rank++;
                                    }
                                    else {
                                        d.Score = rank;
                                    }
                                    d.Type = "11"; //Ranking
                                    d.SheetName = tab;
                                    d.Status = "Computed";
                                }
                            });
                        });
                    });
                });
            });
            self.LogAction("Data", selectedData.length + " data rows updated (scores transformed in ranks).", false);
        };
        Session.prototype.SearchAndReplaceData = function (selectedData, column, search, replace, copy) {
            var self = this;
            var tab = selectedData[0].SheetName;
            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }
            selectedData.forEach(function (x) {
                if (copy == true) {
                    var newData = Framework.Factory.Clone(x);
                    self.ListData.push(newData);
                }
                x.SheetName = tab;
                x[column] = x[column].toString().replace(search, replace);
                x.Status = "Computed";
            });
            self.LogAction("Data", selectedData.length + " data rows updated.", false);
        };
        Session.prototype.ModifySelectionInData = function (selectedData, column, replace, copy) {
            var self = this;
            var tab = selectedData[0].SheetName;
            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }
            selectedData.forEach(function (x) {
                if (copy == true) {
                    var newData = Framework.Factory.Clone(x);
                    self.ListData.push(newData);
                }
                x.SheetName = tab;
                x[column] = replace;
                x.Status = "Computed";
            });
            self.LogAction("Data", selectedData.length + " data rows updated.", false);
        };
        Session.prototype.AddData = function (listData, source) {
            var self = this;
            listData.forEach(function (d) {
                var exists = (self.ListData.filter(function (x) {
                    return x.AttributeCode == d.AttributeCode
                        && x.AttributeRank == d.AttributeRank
                        && x.ControlName == d.ControlName
                        && x.DataControlId == d.DataControlId
                        && x.Description == d.Description
                        && x.Duration == d.Duration
                        && x.Group == d.Group
                        && x.Intake == d.Intake
                        && x.ProductCode == d.ProductCode
                        && x.ProductRank == d.ProductRank
                        && x.QuestionLabel == d.QuestionLabel
                        && x.RecordedDate == d.RecordedDate
                        && x.Replicate == d.Replicate
                        && x.Score == d.Score
                        && x.Session == d.Session
                        && x.SubjectCode == d.SubjectCode
                        && x.Time == d.Time
                        && x.Type == d.Type
                        && x.X == d.X
                        && x.Y == d.Y;
                }).length > 0);
                if (exists == false) {
                    self.ListData.push(d);
                }
            });
            self.LogAction("Data", listData.length + " data rows added (" + source + ").", true);
        };
        Session.GetDefaultExperimentalDesign = function (listDesigns, designType) {
            var res = [];
            // Plan de présentation descripteurs par défaut
            var designs = listDesigns.filter(function (x) { return x.Type == designType; });
            designs.forEach(function (x) {
                res.push(x);
            });
            if (res.length > 0) {
                return res;
            }
            // Pas de plan : crée un nouveau et l'ajouter à la liste
            var experimentalDesign = new Models.ExperimentalDesign();
            var id = 1;
            if (listDesigns.length > 0) {
                id = Math.max.apply(Math, listDesigns.map(function (x) { return x.Id; })) + 1;
            }
            experimentalDesign.Id = id;
            experimentalDesign.Type = designType;
            experimentalDesign.Name = Framework.LocalizationManager.Get("Default" + designType + "ExperimentalDesign");
            //TODO : continuer, ajouter à liste plan présentation de la séance
            res.push(experimentalDesign);
            return res;
        };
        Session.prototype.GetSubjectFromCode = function (code) {
            return this.ListSubjects.filter(function (x) { return x.Code == code; })[0];
        };
        Session.prototype.GetMemo = function () {
            var wb = new Framework.ExportManager(Framework.LocalizationManager.Get("Memo"), "", "");
            var readme = [];
            readme.push(["Description of the other sheets contained in this file."]);
            readme.push(["This file contains the information for connecting to the session."]);
            readme.push(["The 'links' sheet contains individualized subjects' links for connecting directly to the session. Subjects connecting through https://www.chemosenstools.com/timesens/panelist/login.html will have to enter their session code, select their subject code in a dropdown list and enter their password."]);
            readme.push(["The 'products' sheet makes the correspondence between product codes used in the report and product labels presented to the subjects."]);
            readme.push(["The 'tasting orders' sheet indicates in what order each subject will have to taste each product. For example, if the study features 5 products and 3 replicates then this sheet will include columns named from rank1 to rank15. This sheet can be useful if products are served one by one to the subjects in sensory booths."]);
            wb.AddWorksheet("Read me", readme);
            wb.AddWorksheet("links", this.monitoringProgressToArray());
            var index = 1;
            this.ListExperimentalDesigns.filter(function (x) { return x.Type == "Product"; }).forEach(function (x) {
                var array = x.GetAsArray();
                var prod = x.GetProducts();
                if (index == 1) {
                    wb.AddWorksheet("products", prod);
                    wb.AddWorksheet("tasting order", array.LabelArray);
                }
                else {
                    wb.AddWorksheet("products " + index, prod);
                    wb.AddWorksheet("tasting order " + index, array.LabelArray);
                }
                index++;
                //wb.AddWorksheet(index.toString(), array.CodeArray); index++;
                //wb.AddWorksheet(index.toString(), array.LabelArray); index++;
            });
            //TODO : Onglet 4 (Progress): Code Panéliste,Dernier accès,Localisation,Avancement
            // Onglet 5 (Issues): Sujet,Date,Navigateur,Ecran,Message
            wb.Save(Framework.LocalizationManager.Get("Memo"), "xlsx");
        };
        Session.prototype.SetDataTabs = function () {
            var self = this;
            self.ListData.filter(function (x) { return x.SheetName == undefined || x.SheetName.length == 0; }).forEach(function (x) {
                x.SheetName = Models.Data.GetType(x);
            });
            var dataTabs = Framework.Array.Unique(self.ListData.map(function (x) { return x.SheetName; }));
            ;
            self.DataTabs = Framework.Array.Unique(Framework.Array.Merge(dataTabs, self.DataTabs));
            //if (self.DataTabs.length == 0) {
            //    self.DataTabs = Framework.Array.Unique(self.ListData.map((x) => { return x.SheetName; }));
            //}
        };
        Session.prototype.UpdatePanelistMail = function (subjectCode, mail) {
            this.GetSubjectFromCode(subjectCode).Mail = mail;
            this.LogAction("Monitoring", "Mail of subject " + subjectCode + " updated.", false);
        };
        Session.prototype.GetMailContent = function (subjectCode, url) {
            var monitoringProgresses = this.MonitoringProgress.filter(function (x) {
                return x.SubjectCode == subjectCode;
            });
            var timesensURL = url;
            if (monitoringProgresses.length > 0) {
                var monitoringProgress = monitoringProgresses[0];
                // Remplacement des valeurs spéciales
                var htmlContent = this.Mail.Body;
                htmlContent = htmlContent.replace("[SERVER_CODE]", this.Upload.ServerCode);
                if (monitoringProgress.FirstName) {
                    htmlContent = htmlContent.replace("[SUBJECT_FIRST_NAME]", monitoringProgress.FirstName);
                }
                else {
                    htmlContent = htmlContent.replace("[SUBJECT_FIRST_NAME]", "");
                }
                if (monitoringProgress.LastName) {
                    htmlContent = htmlContent.replace("[SUBJECT_LAST_NAME]", monitoringProgress.LastName);
                }
                else {
                    htmlContent = htmlContent.replace("[SUBJECT_LAST_NAME]", "");
                }
                htmlContent = htmlContent.replace("[SUBJECT_CODE]", monitoringProgress.SubjectCode);
                if (monitoringProgress.Password) {
                    htmlContent = htmlContent.replace("[SUBJECT_PASSWORD]", monitoringProgress.Password);
                }
                else {
                    htmlContent = htmlContent.replace("[SUBJECT_PASSWORD]", "");
                }
                htmlContent = htmlContent.replace("[SESSION_URL]", MonitoringProgress.GetEncryptedURL(monitoringProgress.URL));
                htmlContent = htmlContent.replace("[SESSION_HYPERLINK]", MonitoringProgress.GetEncryptedURL(monitoringProgress.URL));
                htmlContent = htmlContent.replace("[TIMESENS_HOMEPAGE_HYPERLINK]", timesensURL);
                return htmlContent;
            }
            else {
                return undefined;
            }
        };
        Session.prototype.RemoveUpload = function (url, status, removeData) {
            var serverCode = this.Upload.ServerCode;
            this.Upload.Date = undefined;
            this.Upload.ServerCode = undefined;
            this.SetMonitoringProgress(url, true);
            if (removeData == true) {
                // Suppression des données de la séance
                var data = this.ListData.filter(function (x) { return x.Session.toString() == serverCode; });
                if (data.length > 0) {
                    this.RemoveData(data);
                }
            }
            // Deverrouillage de la session       
            this.IsLocked == false;
            this.OnLockedChanged(false);
            this.LogAction("Delete", "Upload with server code [" + this.Upload.ServerCode + "] deleted with " + status + ".", true);
        };
        Session.prototype.SetUpload = function (url, serverCode, login, mail) {
            // MAJ de la séance locale
            this.Upload.Date = new Date(Date.now());
            if (serverCode) {
                this.Upload.ServerCode = serverCode;
            }
            this.Upload.InitialUploader = login;
            this.Upload.MailPath = mail;
            // MAJ monitoring & onglet
            this.SetMonitoringProgress(url, this.Upload.ServerCode == undefined || this.Upload.ServerCode == '');
            // Verrouillage de la session       
            this.IsLocked == true;
            this.OnLockedChanged(true);
            // Log local et serveur
            var detail = "Session uploaded with server code " + this.Upload.ServerCode + ", ";
            detail += "password: " + this.Upload.Password + ", ";
            detail += "anonymous mode: " + this.Upload.AnonymousMode + ", ";
            detail += "expiration date: " + Framework.Format.ToDateString(new Date(this.Upload.ExpirationDate.toString())) + ", ";
            detail += "min time between connexions: " + this.Upload.MinTimeBetweenConnexions + ", ";
            detail += "display mode of panelists' codes: [" + this.Upload.ShowSubjectCodeOnClient + ", ";
            detail += "panelists: " + this.ListSubjects.length + ", ";
            //detail += "products: " + this.ListProducts.length + ", ";
            //detail += "attributes: " + this.ListAttributes.length + ", ";
            detail += "screens: " + this.ListScreens.length + ".";
            this.LogAction("Upload", detail, true);
        };
        Session.prototype.ToggleScreenCondition = function (screen, condition, value) {
            var list = [];
            if (condition == "Attribute") {
                list = screen.ListConditions.AttributeConditions;
            }
            if (condition == "Product") {
                list = screen.ListConditions.ProductConditions;
            }
            if (condition == "Replicate") {
                list = screen.ListConditions.ReplicateConditions;
            }
            if (condition == "Intake") {
                list = screen.ListConditions.IntakeConditions;
            }
            if (condition == "ProductRank") {
                list = screen.ListConditions.ProductRankConditions;
            }
            if (condition == "Subject") {
                list = screen.ListConditions.SubjectConditions;
            }
            var index = list.indexOf(value);
            if (index > -1) {
                list.splice(index, 1);
            }
            else {
                list.push(value);
            }
            //TODO
            this.LogAction("Scenario", "Condition changed in screen " + screen.Id, true);
        };
        Session.prototype.SetScreenBackground = function (screen, color) {
            screen.SetBackground(color);
            this.LogAction("Scenario", "Background changed for screen " + screen.Id, true);
        };
        Session.prototype.SetScreenExperimentalDesign = function (screen, experimentalDesignId) {
            screen.ExperimentalDesignId = experimentalDesignId;
            this.LogAction("Scenario", "Experimental design changed for screen " + screen.Id, true);
        };
        return Session;
    }(Framework.Database.DBItem));
    PanelLeaderModels.Session = Session;
    //export class RFunction {
    //    public Selected: boolean = false;;
    //    public Title: string;
    //    public Description: string = "";
    //    //public Name: string;//Nom de la fonction R        
    //    public Parameters: RFunctionParameter[] = [];
    //    public URLToHelp: string = "";
    //    public RCode: string = "";
    //    public AdminOnly: boolean = false;
    //    //public Visibility: boolean = true;
    //}
    //export class DataSetInfo {
    //    public Products: number;
    //    public Attributes: number;
    //    public Replicates: number;
    //    public IsCompleted: boolean;
    //}
    //export class ConditionalValue {
    //    public Condition: string;
    //    public Value: string;
    //    public static VerifyCondition(p: ConditionalValue, dInfo: DataSetInfo): boolean {
    //        let res = true;
    //        if (p.Condition == "MinProducts2" && dInfo.Products <= 2) {
    //            res = false;
    //        }
    //        if (p.Condition == "MinProducts3" && dInfo.Products <= 3) {
    //            res = false;
    //        }
    //        if (p.Condition == "MinAttributes2" && dInfo.Attributes <= 2) {
    //            res = false;
    //        }
    //        if (p.Condition == "MinAttributes3" && dInfo.Attributes <= 2) {
    //            res = false;
    //        }
    //        if (p.Condition == "MinReplicates2" && dInfo.Replicates <= 2) {
    //            res = false;
    //        }
    //        if (p.Condition == "CompletedDataSet" && dInfo.IsCompleted == false) {
    //            res = false;
    //        }
    //        if (p.Condition == "MinProducts3AndCompletedDataset" && (dInfo.IsCompleted == false || dInfo.Products <= 3)) {
    //            res = false;
    //        }
    //        return res;
    //    }
    //}
    //export class RFunctionOnChangeParameter {
    //    public IfValue: string;
    //    public ThenDisplay: DisplayParameter[];
    //    public ThenHide: DisplayParameter[];
    //}
    //export class DisplayParameter {
    //    public Function: string;
    //    public ParameterId: string;
    //}
    var DBField = /** @class */ (function (_super) {
        __extends(DBField, _super);
        function DBField() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.Name = "";
            _this.Type = ""; // Character, Numeric, Date, Enumeration, Boolean
            _this.DefaultValue = "";
            _this.Enumeration = "";
            _this.Visibility = "True";
            return _this;
        }
        DBField.GetDataTableParameters = function (listData, onFieldChange) {
            var fieldParameters = new Framework.Form.DataTableParameters();
            fieldParameters.ListData = listData;
            fieldParameters.Paging = false;
            fieldParameters.ListColumns = [
                //{ data: "ID", title: Framework.LocalizationManager.Get("ID") },
                { data: "Name", title: Framework.LocalizationManager.Get("Name") },
                { data: "Type", title: Framework.LocalizationManager.Get("Type") },
                { data: "DefaultValue", title: Framework.LocalizationManager.Get("DefaultValue") },
                {
                    data: "Enumeration", title: Framework.LocalizationManager.Get("Enumeration"), render: function (data, type, row) {
                        if (type === 'display') {
                            if (row["Type"] != "Enumeration") {
                                return "-";
                            }
                            if (data == undefined || data == null) {
                                return "";
                            }
                            return data;
                        }
                        return "";
                    }
                },
                {
                    data: "Visibility", title: Framework.LocalizationManager.Get("Visibility"), render: function (data, type, row) {
                        if (type === 'display') {
                            if (data == undefined || data == null) {
                                row['Visibility'] = "True";
                                return Framework.LocalizationManager.Get("True");
                            }
                        }
                        return Framework.LocalizationManager.Get(data);
                    }
                }
            ];
            fieldParameters.Order = [[0, 'asc']];
            fieldParameters.OnEditCell = function (propertyName, data) {
                if (propertyName == "Type") {
                    return Framework.Form.Select.Render(data["Type"], Framework.KeyValuePair.FromArray(["Character", "Numeric", "Date", "Enumeration", "Boolean"]), Framework.Form.Validator.NotEmpty(), function (x) {
                        data["Type"] = x;
                        onFieldChange(data);
                    }, false).HtmlElement;
                }
                if (propertyName == "Name") {
                    return Framework.Form.InputText.Create(data["Name"], function (x, y) {
                        if (y.IsValid == true) {
                            data["Name"] = x;
                            onFieldChange(data);
                        }
                    }, Framework.Form.Validator.Unique(fieldParameters.ListData.map(function (a) { return a.Name; }))).HtmlElement;
                }
                if (propertyName == "DefaultValue") {
                    return Framework.Form.InputText.Create(data["DefaultValue"], function (x, y) {
                        data["DefaultValue"] = x;
                        onFieldChange(data);
                    }, Framework.Form.Validator.NoValidation()).HtmlElement;
                }
                if (propertyName == "Enumeration" && data["Type"] == "Enumeration") {
                    return Framework.Form.InputText.Create(data["Enumeration"], function (x, y) {
                        data["Enumeration"] = x;
                        onFieldChange(data);
                    }, Framework.Form.Validator.NoValidation()).HtmlElement; //TODO : valeur spécifique pour tester enum val1|val2...
                }
                if (propertyName == "Visibility") {
                    return Framework.Form.Select.Render(data["Visibility"], Framework.KeyValuePair.FromArray(["True", "False"]), Framework.Form.Validator.NotEmpty(), function (x) {
                        data["Visibility"] = x;
                        onFieldChange(data);
                    }, false).HtmlElement;
                }
            };
            return fieldParameters;
        };
        DBField.ExtendDataTableColumnsWithDBFields = function (fields, dataTableColumns) {
            fields.filter(function (x) { return x.Visibility == null || x.Visibility == "True"; }).forEach(function (x) {
                dataTableColumns.push({
                    data: "Custom" + x.ID, title: x.Name, render: function (data, type, row) {
                        if (type === 'display') {
                            if (data == undefined || data == null) {
                                if (x.DefaultValue != null) {
                                    data = x.DefaultValue;
                                }
                                else {
                                    data = "";
                                }
                            }
                            return data;
                        }
                        return "";
                    }
                });
            });
        };
        DBField.OnEditDataTableCellWithDBFields = function (field, data, propertyName) {
            var kvp = [];
            if (field.Type == 'Enumeration') {
                kvp = Framework.KeyValuePair.FromArray(field.Enumeration.split('|'));
            }
            return Framework.Form.DataTable.OnEditDataTableCell(data, propertyName, field.Type, field.DefaultValue, kvp);
            //TODO :Date, Boolean            
        };
        return DBField;
    }(Framework.Database.DBItem));
    PanelLeaderModels.DBField = DBField;
})(PanelLeaderModels || (PanelLeaderModels = {}));
//# sourceMappingURL=models.js.map