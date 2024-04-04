declare var jsPDF;

module PanelLeaderModels {

    export class ServerDirectory extends Framework.Database.DBItem {
        public ID: string = "0";
        public Name: string;
        public ParentId: string;

        public static Create(currentDirectory: ServerDirectory = undefined, existingDirectories: ServerDirectory[]): ServerDirectory {
            let self = this;
            let newDirectory: ServerDirectory = new ServerDirectory();
            newDirectory.ID = undefined;
            let currentDirectoryId = "0";
            if (currentDirectory) {
                currentDirectoryId = currentDirectory.ID;
            }

            newDirectory.ParentId = currentDirectoryId;
            newDirectory.Name = ServerDirectory.GetValidDirectoryName(newDirectory, Framework.LocalizationManager.Get("NewDirectory"), existingDirectories);

            return newDirectory;
        }

        public static GetValidDirectoryName(directory: ServerDirectory, name: string, existingDirectories: ServerDirectory[]): string {

            let directoryId = "0"; // Root

            let newName = name;

            // Nom unique
            let index = 1;
            let dirsAtSameLevel = existingDirectories.filter((x) => { return x.ParentId == directoryId });
            while (dirsAtSameLevel.filter((x) => { return x.Name == name }).length > 0) {
                newName = name + " " + index;
                index++;
            }

            return newName;
        }

        public GetParentDirectories(localDirectories: ServerDirectory[]): ServerDirectory[] {
            let res: ServerDirectory[] = [];
            if (this.ParentId == undefined) {
                return res;
            }
            res.push(this);
            let current = this.ParentId;
            let directories = localDirectories.filter((x) => { return x.ID == current; });
            while (directories.length > 0) {
                res.push(directories[0]);
                current = directories[0].ParentId;
                directories = localDirectories.filter((x) => { return x.ID == current; });
            }
            return res.reverse();
        }

        public GetChildrenDirectories(localDirectories: ServerDirectory[]): PanelLeaderModels.ServerDirectory[] {
            let self = this;
            let directories = localDirectories.filter((x) => { return x.ParentId == self.ID });
            return directories;
        }

        public GetParentDirectory(localDirectories: ServerDirectory[]): ServerDirectory {
            let parentDirectory = localDirectories.filter((x) => { return x.ID == this.ParentId })[0];
            return parentDirectory;
        }

        public GetSessions(linksToLocalSessions: ServerSessionShortcut[]): ServerSessionShortcut[] {
            let self = this;
            let links: ServerSessionShortcut[] = linksToLocalSessions.filter((x) => { return x.LocalDirectoryId == this.ID; });
            return links;
        }
    }

    export class ServerSessionShortcut extends Framework.Database.DBItem {
        public LocalDirectoryId: string;
        public Name: string;
        public Description: string;

        public static GetValidName(link: ServerSessionShortcut, name: string, existingLinkToLocalSessions: ServerSessionShortcut[]): string {

            let newName = name;

            let index = 1;
            let sessionsAtSameLevel = existingLinkToLocalSessions.filter((x) => { return x.LocalDirectoryId == link.LocalDirectoryId });
            while (sessionsAtSameLevel.filter((x) => { return x.Name == name }).length > 0) {
                newName = name + " " + index;
                index++;
            }

            return newName;
        }
    }

    export class MonitoringProgress {
        public SubjectCode: string;
        public Mail: string;
        public Password: string;
        public FirstName: string;
        public LastName: string;
        public LastAccess: string;
        public Progress: string;
        public Products: string = "";
        public MailStatus: string;
        public URL: string;

        public static GetEncryptedURL(url:string): string {
            if (url == undefined) {
                return "";
            }

            let baseURL = url.split('?')[0];
            let parameters = Framework.Browser.GetQueryStringParameters(url);

            let id = "";

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

            let newUrl = baseURL;
            if (id.length > 0) {

                newUrl += "?id=" + btoa(id);
            }

                    //pTODO screenshot

            return newUrl;
        }

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

    export class ProgressInfo {
        public MonitoringProgress: MonitoringProgress[];
        public RequiredTokens: number;
        public AvailableTokens: number;
        public DataCount: number;
        public Subjects: string[];
        public Videos: string[];
        public VideosSize: number;
    }

    export class Mail {
        public ReturnMailAddress: string;
        public DisplayedName: string;
        public Subject: string;
        public Body: string;
    }

    export class MailTemplate extends Framework.Database.DBItem {
        public ReturnMailAddress: string;
        public DisplayedName: string;
        public Subject: string;
        public Body: string;
        public Label: string;
        public Description: string;
        public IsDefault: boolean = false;
    }

    export class OptionalTemplatedScreen {
        public Id: number;
        public Screens: BaseTemplatedScreen[] = [];
        public SelectedScreen: string = "";

        constructor(screens: BaseTemplatedScreen[], selectedScreen: string) {
            this.Screens = screens;
            this.SelectedScreen = selectedScreen;
        }
    }

    export class BaseTemplatedScreen {

        public DefaultScreenOptions: DefaultScreenOptions;
        public Name: string;

        public constructor(name: string) {
            this.Name = name;
            this.DefaultScreenOptions = new DefaultScreenOptions();
            this.DefaultScreenOptions.Language = Framework.LocalizationManager.GetDisplayLanguage(); //TODO : défaut = langue utilisée à l'écran
        }

        public GetOptions(): Framework.Form.PropertyEditor[] {
            return [];
        }
    }

    //TODO : récupérer les propertyeditor : à la création depuis l'assistant, à la création depuis le scénario, à la modification -> getProperties(option)

    export class TemplatedScreen extends BaseTemplatedScreen {
        //TODO : controle button, timer
        public Title: string;
        public NextScreen: string = TemplatedScreen.NextScreenEnum[0];
        public TimerValue: number = 30;
        public TimerVisibility: string = "Visible";
        public ScreenExperimentalDesignId: number;
        public Content: string;

        private showNextButtonEnabled: boolean = true;

        public constructor(name: string, title: string, nextScreen: string = "ClickOnNextButton", screenExperimentalDesignId: number = 0, timerValue: number = 60, timerVisibility: string = "NotVisible", showNextButtonEnabled: boolean = true) {
            super(name);
            this.Title = title;
            this.NextScreen = nextScreen;
            this.ScreenExperimentalDesignId = screenExperimentalDesignId;
            this.TimerValue = timerValue;
            this.TimerVisibility = timerVisibility;
            this.showNextButtonEnabled = showNextButtonEnabled;
        }

        public static NextScreenEnum: string[] = ["ClickOnNextButton", "WhenTimerElapsed"];
        public static TimerVisibilityEnum: string[] = ["NotVisible", "Visible"];
        public static TimerMaxTimeEnum: string[] = ["5", "10", "20", "30", "60"];

        public GetOptions(): Framework.Form.PropertyEditor[] {

            let self = this;

            let res: Framework.Form.PropertyEditor[] = [];

            let setState = () => {
                timerVisibility.Disable();
                timerMaxTime.Disable();
                if (self.NextScreen == "WhenTimerElapsed") {
                    timerVisibility.Enable();
                    timerMaxTime.Enable();
                }
            };

            if (this.showNextButtonEnabled == true) {
                let nextScreen = Framework.Form.PropertyEditorWithPopup.Render("GoToNextScreenOptions", "NextScreen", this.NextScreen, TemplatedScreen.NextScreenEnum, (x) => {
                    self.NextScreen = x;
                    setState();
                });
                res.push(nextScreen);
            }

            let timerVisibility = Framework.Form.PropertyEditorWithPopup.Render("GoToNextScreenOptions", "TimerVisibility", this.TimerVisibility, TemplatedScreen.TimerVisibilityEnum, (x) => {
                self.TimerVisibility = x;
            });
            res.push(timerVisibility);


            let timerMaxTime = Framework.Form.PropertyEditorWithNumericUpDown.Render("GoToNextScreenOptions", "TimeBeforeStoppingChronometer", this.TimerValue, 0, 300, (x) => {
                self.TimerValue = x;
            });
            res.push(timerMaxTime);

            setState();

            return res;

        }

        public Edit(callback: () => void) {

            let self = this;

            let body = document.createElement("div");

            let editorDiv = document.createElement("div");
            Framework.InlineHTMLEditor.GetButtons().forEach((x) => {
                editorDiv.appendChild(x.HtmlElement);
            });
            body.appendChild(editorDiv);

            let textarea0 = document.createElement("div");
            textarea0.innerHTML = Framework.LocalizationManager.Get(this.Title);
            textarea0.style.border = "1px solid black";
            textarea0.style.overflowY = "scroll";
            textarea0.style.overflowX = "hidden";
            textarea0.style.height = "50px";
            textarea0.style.padding = "3px";
            textarea0.contentEditable = "true";
            body.appendChild(textarea0);

            let textarea = document.createElement("div");
            textarea.innerHTML = Framework.LocalizationManager.Get(this.Content);
            textarea.style.border = "1px solid black";
            textarea.style.overflowY = "scroll";
            textarea.style.overflowX = "hidden";
            textarea.style.height = "300px";
            textarea.style.padding = "3px";
            textarea.contentEditable = "true";
            body.appendChild(textarea);

            Framework.Modal.Confirm(Framework.LocalizationManager.Get("Options"), body, () => {
                self.Title = textarea0.innerHTML;
                self.Content = textarea.innerHTML;
                callback();
            }, undefined, undefined, undefined, undefined, "500px");

        }
    }

    //TODO : utiliser geteditableproperties partout

    export class TemplatedScreenWithContent extends TemplatedScreen {
        //TODO : controle textarea*2

        public constructor(name: string, title: string, content: string = "", screenExperimentalDesignId: number = 0, nextScreen: string = "ClickOnNextButton", timerValue: number = 60, timerVisibility: string = "NotVisible", showNextButtonEnabled: boolean = true) {
            super(name, title, nextScreen, screenExperimentalDesignId, timerValue, timerVisibility, showNextButtonEnabled);
            this.Content = content;
        }

    }

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

    export class TemplatedScreenWithExit extends TemplatedScreenWithContent {

        //TODO : controle button

        public EndAction: string;
        public URL: string;

        public static EndActionEnum: string[] = ["GoToURL", "GoToLoginScreen"];

        public constructor(name: string, title: string, content: string = "", endAction: string, url: string, screenExperimentalDesignId: number = 0) {
            super(name, title, content, screenExperimentalDesignId, "");
            this.EndAction = endAction;
            this.URL = url;
        }

        public GetOptions(): Framework.Form.PropertyEditor[] {

            let self = this;
            let res: Framework.Form.PropertyEditor[] = super.GetOptions();

            let setState = () => {
                url.Disable();
                if (self.EndAction == "GoToURL") {
                    url.Enable();
                }
            };

            let action = Framework.Form.PropertyEditorWithPopup.Render("Button", "EndAction", this.EndAction, TemplatedScreenWithExit.EndActionEnum, (x) => {
                self.EndAction = x;
                setState();
            });
            res.push(action);

            //TOCHECK : validation
            let url = Framework.Form.PropertyEditorWithTextInput.Render("Button", "URL", Framework.LocalizationManager.Get(this.URL), (x) => {
                self.URL = x;
            }, Framework.Form.Validator.URL());
            res.push(url);

            setState();

            return res;
        }

    }

    export class TemplatedScreenWithTimeControl extends TemplatedScreen {

        //TODO : controle startbutton,stopbutton, chronometer

        public StartMode: string = TemplatedScreenWithTimeControl.StartModeEnum[0];
        public StopMode: string = TemplatedScreenWithTimeControl.StopModeEnum[0];
        public Chronometer: string = TemplatedScreenWithTimeControl.ChronometerVisibilityEnum[0];
        public MaxTime: number = 120;
        public ShowTimeControlOptions: boolean = false;

        public static StartModeEnum: string[] = [
            "ClickOnStartButton","ScreenLoaded",  /*"ClickOnAttribute",*/
        ];

        public static StopModeEnum: string[] = [
            "ClickOnNextButton", "ClickOnStopButton", "AfterDelay"
        ];

        public static ChronometerVisibilityEnum: string[] = [
            "NoChronometer", "NotVisible", "Visible"
        ];

        public constructor(name: string, title: string, nextScreen: string = "ClickOnNextButton", screenExperimentalDesignId: number = 0, timerValue: number = 60, timerVisibility: string = "NotVisible", showTimeControlOptions: boolean = true) {
            super(name, title, nextScreen, screenExperimentalDesignId, timerValue, timerVisibility);
            this.ShowTimeControlOptions = showTimeControlOptions;
        }


        public GetOptions(): Framework.Form.PropertyEditor[] {

            let self = this;

            let res: Framework.Form.PropertyEditor[] = super.GetOptions();

            if (this.ShowTimeControlOptions == true) {

                let startMode = Framework.Form.PropertyEditorWithPopup.Render("TimeOptions", "StartMode", TemplatedScreenWithTimeControl.StartModeEnum[0], TemplatedScreenWithTimeControl.StartModeEnum, (x) => {
                    self.StartMode = x;
                });
                res.push(startMode);

                let stopMode = Framework.Form.PropertyEditorWithPopup.Render("TimeOptions", "StopMode", TemplatedScreenWithTimeControl.StopModeEnum[0], TemplatedScreenWithTimeControl.StopModeEnum, (x) => {
                    self.StopMode = x;
                });
                res.push(stopMode);

                let chronometerVisibility = Framework.Form.PropertyEditorWithPopup.Render("TimeOptions", "Chronometer", TemplatedScreenWithTimeControl.ChronometerVisibilityEnum[0], TemplatedScreenWithTimeControl.ChronometerVisibilityEnum, (x) => {
                    self.Chronometer = x;
                });
                res.push(chronometerVisibility);

                let timerMaxTime = Framework.Form.PropertyEditorWithNumericUpDown.Render("TimeOptions", "MaxTime", this.TimerValue, 0, 300, (x) => {
                    self.TimerValue = x;
                });
                res.push(timerMaxTime);
            }

            return res;
        }


    }

    export class TemplatedScreenWithDiscreteScale extends TemplatedScreenWithTimeControl {

        public TypeOfScale: string = ScreenReader.Controls.DiscreteScalesControl.TypeOfScaleEnum[0];
        public DiscreteScale: ScreenReader.Controls.DiscreteScalesControl;

        public constructor(name: string, screenExperimentalDesignId: number, discreteScale: ScreenReader.Controls.DiscreteScalesControl, showTimeControlOptions: boolean, title: string = "/SpecialLabel/", nextScreen: string = "ClickOnNextButton") {
            super(name, title, nextScreen, screenExperimentalDesignId);
            this.ShowTimeControlOptions = showTimeControlOptions;
            this.DiscreteScale = discreteScale;
        }

        public GetOptions(): Framework.Form.PropertyEditor[] {

            let self = this;

            self.DiscreteScale.Scale = self.TypeOfScale;

            let res: Framework.Form.PropertyEditor[] = super.GetOptions();

            self.DiscreteScale.GetEditableProperties("wizard").forEach((x) => {
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
        }

    }

    export class TemplatedScreenWithContinuousScale extends TemplatedScreenWithTimeControl {

        public TypeOfScale: string = ScreenReader.Controls.SlidersControl.TypeOfScaleEnum[0];
        public ContinuousScale: ScreenReader.Controls.SlidersControl;

        public constructor(name: string, screenExperimentalDesignId: number, continuousScale: ScreenReader.Controls.SlidersControl, showTimeControlOptions: boolean, title: string = "/SpecialLabel/", nextScreen: string = "ClickOnNextButton") {
            super(name, title, nextScreen, screenExperimentalDesignId);
            this.ShowTimeControlOptions = showTimeControlOptions;
            this.ContinuousScale = continuousScale;
        }

        public GetOptions(): Framework.Form.PropertyEditor[] {

            let self = this;

            self.ContinuousScale.Scale = self.TypeOfScale;

            let res: Framework.Form.PropertyEditor[] = super.GetOptions();

            self.ContinuousScale.GetEditableProperties("wizard").forEach((x) => {
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
        }
    }

    export class TemplatedScreenWithTDS extends TemplatedScreenWithTimeControl {

        public TDSControl: ScreenReader.Controls.DTSButtonsControl;

        public constructor(name: string, screenExperimentalDesignId: number, tdsControl: ScreenReader.Controls.DTSButtonsControl, title: string = "/SpecialLabel/", nextScreen: string = "ClickOnNextButton"/*, tdsControl2: ScreenReader.Controls.DTSButtonsControl = undefined*/) {
            super(name, title, nextScreen, screenExperimentalDesignId);                
            
            this.TDSControl = tdsControl;            
        }

        public GetOptions(): Framework.Form.PropertyEditor[] {

            let self = this;

            let res: Framework.Form.PropertyEditor[] = super.GetOptions();

            self.TDSControl.GetEditableProperties("wizard").forEach((x) => {
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
        }

    }

    export class TemplatedScreenWithCATA extends TemplatedScreenWithTimeControl {

        public CATAControl: ScreenReader.Controls.CATAControl;

        public constructor(name: string, screenExperimentalDesignId: number, cataControl: ScreenReader.Controls.CATAControl, showTimeControlOptions: boolean, title: string = "/SpecialLabel/", nextScreen: string = "ClickOnNextButton") {
            super(name, title, nextScreen, screenExperimentalDesignId);
            this.CATAControl = cataControl;
        }

        public GetOptions(): Framework.Form.PropertyEditor[] {

            let self = this;
            let res: Framework.Form.PropertyEditor[] = super.GetOptions();

            //TODO

            let mandatory = Framework.Form.PropertyEditorWithToggle.Render("", "MandatoryAnswer", self.CATAControl._MustAnswerAllAttributes, (x) => {
                self.CATAControl._MustAnswerAllAttributes = x;
            });
            res.push(mandatory);

            if (self.CATAControl._DataType == "TCATA") {

                let setState = () => {
                    duration.Disable();
                    if (self.CATAControl._Fading == true) {
                        duration.Enable();
                    }
                };

                let fading = Framework.Form.PropertyEditorWithToggle.Render("", "Fading", self.CATAControl._Fading, (x) => {
                    self.CATAControl._Fading = x;
                    setState();
                });
                res.push(fading);

                let duration = Framework.Form.PropertyEditorWithNumericUpDown.Render("", "Duration", self.CATAControl._LimitedDuration, 1, 30, (x) => {
                    self.CATAControl._LimitedDuration = x;
                }, 0.5);
                res.push(duration);

                setState();
            }

            return res;
        }

    }

    export class TemplatedScreenWithTDSAndDiscreteScale extends TemplatedScreenWithTimeControl {

        public TDSControl: ScreenReader.Controls.DTSButtonsControl;
        public DiscreteScale: ScreenReader.Controls.DiscreteScalesControl;

        public constructor(name: string, screenExperimentalDesignId: number, tdsControl: ScreenReader.Controls.DTSButtonsControl, discreteScaleControl: ScreenReader.Controls.DiscreteScalesControl, title: string = "/SpecialLabel/", nextScreen: string = "ClickOnNextButton") {
            super(name, title, nextScreen, screenExperimentalDesignId);
            this.TDSControl = tdsControl;
            this.DiscreteScale = discreteScaleControl;
        }

        public GetOptions(): Framework.Form.PropertyEditor[] {

            let self = this;
            let res: Framework.Form.PropertyEditor[] = super.GetOptions();

            self.TDSControl.GetEditableProperties("wizard").forEach((x) => {
                res.push(x);
            });

            self.DiscreteScale.GetEditableProperties("wizard").forEach((x) => {
                res.push(x);
            });

            return res;
        }

    }

    export class TemplatedScreenWithTDSAndContinuousScale extends TemplatedScreenWithTimeControl {

        public TDSControl: ScreenReader.Controls.DTSButtonsControl;
        public ContinuousScale: ScreenReader.Controls.SlidersControl;

        public constructor(name: string, screenExperimentalDesignId: number, tdsControl: ScreenReader.Controls.DTSButtonsControl, continuousScale: ScreenReader.Controls.SlidersControl, title: string = "/SpecialLabel/", nextScreen: string = "ClickOnNextButton") {
            super(name, title, nextScreen, screenExperimentalDesignId);
            this.TDSControl = tdsControl;
            this.ContinuousScale = continuousScale;
        }

        public GetOptions(): Framework.Form.PropertyEditor[] {

            let self = this;
            let res: Framework.Form.PropertyEditor[] = super.GetOptions();

            self.TDSControl.GetEditableProperties("wizard").forEach((x) => {
                res.push(x);
            });

            self.ContinuousScale.GetEditableProperties("wizard").forEach((x) => {
                res.push(x);
            });

            return res;
        }

    }

    export class TemplatedScreenWithSorting extends TemplatedScreen {

        public SortingControl: ScreenReader.Controls.SortingControl;

        public constructor(name: string, screenExperimentalDesignId: number, sortingControl: ScreenReader.Controls.SortingControl, title: string = "/SpecialLabel/", nextScreen: string = "ClickOnNextButton") {
            super(name, title, nextScreen, screenExperimentalDesignId);
            this.SortingControl = sortingControl;
        }

        public GetOptions(): Framework.Form.PropertyEditor[] {

            let self = this;
            let res: Framework.Form.PropertyEditor[] = super.GetOptions();

            self.SortingControl.GetEditableProperties("wizard").forEach((x) => {
                res.push(x);
            });

            return res;
        }

    }

    export class TemplatedScreenWithRanking extends TemplatedScreen {

        public RankingControl: ScreenReader.Controls.RankingControl;

        public constructor(name: string, screenExperimentalDesignId: number, rankingControl: ScreenReader.Controls.RankingControl, title: string = "/SpecialLabel/", nextScreen: string = "ClickOnNextButton") {
            super(name, title, nextScreen, screenExperimentalDesignId);
            this.RankingControl = rankingControl;
        }

        public GetOptions(): Framework.Form.PropertyEditor[] {

            let self = this;
            let res: Framework.Form.PropertyEditor[] = super.GetOptions();

            self.RankingControl.GetEditableProperties("wizard").forEach((x) => {
                res.push(x);
            });

            return res;
        }

    }

    export class TemplatedScreenWithNapping extends TemplatedScreen {

        public NappingControl: ScreenReader.Controls.NappingControl;

        public constructor(name: string, screenExperimentalDesignId: number, nappingControl: ScreenReader.Controls.NappingControl, title: string = "/SpecialLabel/", nextScreen: string = "ClickOnNextButton") {
            super(name, title, nextScreen, screenExperimentalDesignId);
            this.NappingControl = nappingControl;
        }

        public GetOptions(): Framework.Form.PropertyEditor[] {

            let self = this;
            let res: Framework.Form.PropertyEditor[] = super.GetOptions();

            self.NappingControl.GetEditableProperties("wizard").forEach((x) => {
                res.push(x);
            });

            return res;
        }

    }

    export class TemplatedScreenWithDiscrimination extends TemplatedScreen {

        public DiscriminationControl: ScreenReader.Controls.DiscriminationTestControl;

        public constructor(name: string, screenExperimentalDesignId: number, control: ScreenReader.Controls.DiscriminationTestControl, title: string = "/SpecialLabel/", nextScreen: string = "ClickOnNextButton") {
            super(name, title, nextScreen, screenExperimentalDesignId);
            this.DiscriminationControl = control;
        }

        public GetOptions(): Framework.Form.PropertyEditor[] {

            let self = this;
            let res: Framework.Form.PropertyEditor[] = super.GetOptions();

            self.DiscriminationControl.GetEditableProperties("wizard").forEach((x) => {
                res.push(x);
            });

            return res;
        }

    }

    export class TemplatedSession {
        public Id: string;
        public LabelKey: string;
        public DescriptionKey: string;
        public NbSubjects: number = 1;
        //public ListSubjects: Models.Subject[] = [];
        //public ListAttributes: Models.Attribute[] = [];
        public DefaultScreenOptions: PanelLeaderModels.DefaultScreenOptions;
        public ListExperimentalDesigns: Models.ExperimentalDesign[] = [];
        public Screens: OptionalTemplatedScreen[] = [];
        public Options: Framework.Form.PropertyEditor[] = [];

        //TODO : changer contenu des textes en fonction du template

        private static getExperimentalDesign(designType: string, name: string, id: number, order: string, replicates: number, nbItems: number = 1, presentationMode: string = "Single"): Models.ExperimentalDesign {

            //TOFIX : test par paire

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

            let res = Models.ExperimentalDesign.Create(designType, id, [], order, replicates, [], presentationMode);
            for (let i = 0; i < nbItems; i++) {
                res.AddItem();
            }
            res.Name = name;
            return res;
        }

        constructor(id: string, labelKey: string, descriptionKey: string, defaultScreens: OptionalTemplatedScreen[], designs: Models.ExperimentalDesign[]) {
            let self = this;
            this.Id = id;
            this.LabelKey = labelKey;
            this.DescriptionKey = descriptionKey;

            this.DefaultScreenOptions = new DefaultScreenOptions();

            this.Screens = [].concat(
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithContent("WelcomeScreen", "TemplateWelcomeScreenTitle", "TemplateWelcomeScreenContent"),
                    new BaseTemplatedScreen("NoWelcomeScreen")], "WelcomeScreen"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithContent("OverallInstructionScreen", "TemplateOverallIstructionsScreenTitle", "TemplateOverallIstructionsScreenContent"),
                    new BaseTemplatedScreen("NoOverallInstructionScreen")], "OverallInstructionScreen"),
                defaultScreens,

                new OptionalTemplatedScreen([
                    new TemplatedScreenWithExit("ExitScreen", "TemplateExitScreenTitle", "TemplateExitScreenContent", "GoToURL", "https://www.timesens.com/V2/"),
                    new BaseTemplatedScreen("NoExitScreen")], "ExitScreen")
            );

            let index = 1;
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

        //TODO : faire des groupes de templates

        private static getRepeatedInstructionsOptionalTemplatedScreen(experimentalDesignId: number, title: string = "TemplateEmptySessionScreenTitle", content: string = "TemplateEmptySessionScreenContent"): OptionalTemplatedScreen {
            return new OptionalTemplatedScreen([
                new TemplatedScreenWithContent("RepeatedInstructionScreen", "TemplateEmptySessionScreenTitle", "TemplateEmptySessionScreenContent", experimentalDesignId),
                new BaseTemplatedScreen("NoRepeatedInstructionScreen")
            ], "RepeatedInstructionScreen");
        }

        private static getForcedBreakOptionalTemplatedScreen(experimentalDesignId: number, title: string = "TemplateForcedBreakScreenTitle", content: string = "TemplateForcedBreakScreenContent", time: number = 30): OptionalTemplatedScreen {
            return new OptionalTemplatedScreen([
                new TemplatedScreenWithContent("ForcedBreakScreen", title, content, experimentalDesignId, "WhenTimerElapsed", time, "Visible", false),
                new BaseTemplatedScreen("NoForcedBreakScreen")
            ], "NoForcedBreakScreen");
        }

        //private static getSubjectSummaryTemplatedScreen(title: string = "TemplateSubjectSummaryScreenTitle"): OptionalTemplatedScreen {
        //    return new OptionalTemplatedScreen([
        //        new TemplatedScreenWithSubjectSummary("SubjectSummaryScreen", title),
        //        new BaseTemplatedScreen("NoSubjectSummaryScreen")
        //    ], "NoSubjectSummaryScreen");
        //}

        public static GetHedonicTestTemplatedSession(nbProducts: number = 1, nbAttributes: number = 1): TemplatedSession {
            // TOTEST Test hédonique (si intake > 1, variante "progressive liking")            
            return new TemplatedSession("HedonicTest", "TemplateHedonicTest", "TemplateHedonicTestDescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateHedonicTestInstructionScreenTitle", "TemplateHedonicTestInstructionScreenContent"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithDiscreteScale("DiscreteScaleScreen", 1, ScreenReader.Controls.DiscreteScalesControl.Create("Hedonic", 2), false),
                    new TemplatedScreenWithContinuousScale("ContinuousScaleScreen", 1, ScreenReader.Controls.SlidersControl.Create("Hedonic", 2), false)
                ], "DiscreteScaleScreen"),
                TemplatedSession.getForcedBreakOptionalTemplatedScreen(1),
                //TemplatedSession.getSubjectSummaryTemplatedScreen()
            ],
                [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1, nbProducts), TemplatedSession.getExperimentalDesign("Attribute", "Hedonic", 2, "Fixed", 1, nbAttributes)]
            )
        }

        public static GetXlsxTemplatedSession(): TemplatedSession {            
            return new TemplatedSession("XlsxSession", "TemplateXlsxSession", "TemplateXlsxSessionDescription", [], []);
        }

        public static GetEmptyTemplatedSession(): TemplatedSession {
            // TOTEST Séance vide
            return new TemplatedSession("EmptySession", "TemplateEmptySession", "TemplateEmptySessionDescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithContent("DataMeasurementScreen", "TemplateDataMeasurementScreenTitle", "TemplateDataMeasurementScreenContent", 1),
                ], "DataMeasurementScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "Attribute", 2, "Fixed", 1)]
            )
        }

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

        public static GetMonadicProfileTemplatedSession(): TemplatedSession {
            // TOTEST Profil monadique (si intake > 1, variante "progressive profile")
            return new TemplatedSession("MonadicProfile", "TemplateMonadicProfile", "TemplateMonadicProfileDescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateMonadicProfileInstructionScreenTitle", "TemplateMonadicProfileInstructionScreenContent"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithDiscreteScale("DiscreteScaleScreen", 1, ScreenReader.Controls.DiscreteScalesControl.Create("Profile", 2), false),
                    new TemplatedScreenWithContinuousScale("ContinuousScaleScreen", 1, ScreenReader.Controls.SlidersControl.Create("Profile", 2), false)
                ], "DiscreteScaleScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "Profile", 2, "Fixed", 1)]
            )
        }

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

        public static GetTDSTemplatedSession(): TemplatedSession {
            // TOTEST TDS
            return new TemplatedSession("TDS", "TemplateTDS", "TemplateTDSDescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateTDSInstructionScreenTitle", "TemplateTDSProfileInstructionScreenContent"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithTDS("TDSScreen", 1, ScreenReader.Controls.DTSButtonsControl.Create(2)),
                ], "TDSScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "TDS", 2, "Random", 1)]
            )
        }

        public static GetAlternatedTDSTemplatedSession(): TemplatedSession {
            // TOTEST Alternated TDS
            return new TemplatedSession("AlternatedTDS", "TemplateAlternatedTDS", "TemplateAlternatedTDSDescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateAlternatedTDSInstructionScreenTitle", "TemplateAlternatedTDSProfileInstructionScreenContent"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithTDS("TDSScreen", 1, ScreenReader.Controls.DTSButtonsControl.Create(2)),
                ], "TDSScreen"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithTDS("TDSScreen", 1, ScreenReader.Controls.DTSButtonsControl.Create(3)),
                ], "TDSScreen")
            ], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "Modality1", 2, "Random", 1), TemplatedSession.getExperimentalDesign("Attribute", "Modality2", 3, "Random", 1)]
            )
        }

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

        public static GetCATATemplatedSession(): TemplatedSession {
            // TOTEST CATA
            return new TemplatedSession("CATA", "TemplateCATA", "TemplateCATADescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateCATAInstructionScreenTitle", "TemplateCATAInstructionScreenContent"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithCATA("CATAScreen", 1, ScreenReader.Controls.CATAControl.Create(2, "CATA"), false),
                ], "CATAScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "CATA", 2, "Random", 1)]
            )
        }

        public static GetTCATATemplatedSession(): TemplatedSession {
            // TOTEST TCATA
            return new TemplatedSession("TCATA", "TemplateTCATA", "TemplateTCATADescription", [
                TemplatedSession.getRepeatedInstructionsOptionalTemplatedScreen(1, "TemplateTCATAInstructionScreenTitle", "TemplateTCATAInstructionScreenContent"),
                new OptionalTemplatedScreen([
                    new TemplatedScreenWithCATA("TCATAScreen", 1, ScreenReader.Controls.CATAControl.Create(2, "TCATA"), true),
                ], "TCATAScreen")], [TemplatedSession.getExperimentalDesign("Product", "Product", 1, "WilliamsLatinSquare", 1), TemplatedSession.getExperimentalDesign("Attribute", "TCATA", 2, "Random", 1)]
            )
        }

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

        public static GetTemplates(): TemplatedSession[] {
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
        }

    }

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

    export class Upload {

        public Id: number;
        public ServerCode: string;
        public Date: Date;
        public ShowSubjectCodeOnClient: string;
        public Description: string;
        public Password: string;
        //public ObservableCollection<AuthorizedDates> ListAuthorizedDates { get; set; }

        public ExpirationDate: Date;
        public MailPath: string;
        public MinTimeBetweenConnexions: number;
        public InitialUploader: string;

        public AnonymousMode: string;

        public CheckCompatibilityMode: string = "Warning";

        constructor() {
            this.ExpirationDate = new Date(Date.now());
            this.ExpirationDate.setMonth(this.ExpirationDate.getMonth() + 2);
        }

    }

    export class FlatContingencyTableRow {
        public Session: number;
        public Replicate: number;
        public Intake: number;
        public SubjectCode: string;
        public ProductCode: string;
        public AttributesCounts: Framework.Dictionary.Dictionary;
        public AttributesScores: Framework.Dictionary.Dictionary;
        public Count: number;
        public Time: number;
    }

    export class DatasetSummary {
        public Sessions: number[];
        public Replicates: number[];
        public Intakes: number[];
        public Subjects: string[];
        public Products: string[];
        public Attributes: string[];


        public FlatContingencyTable: FlatContingencyTableRow[];

        public DataCount: number;

        private listData: Models.Data[];

        public get ListData() {
            return this.listData;
        }

        public get ExpectedDataCount(): number {
            return this.FlatContingencyTable.length * this.Attributes.length;
        }

        public get MissingData(): FlatContingencyTableRow[] {
            let self = this;
            return (this.FlatContingencyTable.filter((x) => { return x.Count != self.Attributes.length; }));
        }

        public get MissingDataCount(): number {
            return this.ExpectedDataCount - this.DataCount;
        }

        public get MissingDataPercentage(): number {
            let prct: number = Math.round(this.MissingDataCount / this.ExpectedDataCount * 10000) / 100;
            return prct;
        }

        public get MissingDataTable(): HTMLTableElement {
            // Tableau HTML avec données manquantes
            let htmTable = document.createElement("table");
            let thead = document.createElement("thead"); htmTable.appendChild(thead);
            let tr = document.createElement("tr"); thead.appendChild(tr);
            let th1 = document.createElement("th"); th1.innerHTML = Framework.LocalizationManager.Get("Session"); tr.appendChild(th1);
            let th2 = document.createElement("th"); th2.innerHTML = Framework.LocalizationManager.Get("Replicate"); tr.appendChild(th2);
            let th3 = document.createElement("th"); th3.innerHTML = Framework.LocalizationManager.Get("Intake"); tr.appendChild(th3);
            let th4 = document.createElement("th"); th4.innerHTML = Framework.LocalizationManager.Get("Subject"); tr.appendChild(th4);
            let th5 = document.createElement("th"); th5.innerHTML = Framework.LocalizationManager.Get("Product"); tr.appendChild(th5);
            this.Attributes.forEach((att) => {
                let th = document.createElement("th"); th.innerHTML = att; tr.appendChild(th);
            });
            let tbody = document.createElement("tbody"); htmTable.appendChild(tbody);

            this.MissingData.forEach((x) => {
                let tr = document.createElement("tr"); tbody.appendChild(tr);
                let td1 = document.createElement("td"); td1.innerHTML = x.Session.toString(); tr.appendChild(td1);
                let td2 = document.createElement("td"); td2.innerHTML = x.Replicate.toString(); tr.appendChild(td2);
                let intake = 1;
                if (x.Intake) {
                    intake = x.Intake;
                }
                let td3 = document.createElement("td"); td3.innerHTML = intake.toString(); tr.appendChild(td3);
                let td4 = document.createElement("td"); td4.innerHTML = x.SubjectCode; tr.appendChild(td4);
                let td5 = document.createElement("td"); td5.innerHTML = x.ProductCode; tr.appendChild(td5);
                x.AttributesCounts.Entries.forEach((entry) => {
                    let td = document.createElement("td"); td.innerHTML = entry.Val.toString(); tr.appendChild(td);
                    if (entry.Val == 0) {
                        td.style.background = "red";
                    }
                });
            });
            htmTable.classList.add("table");

            return htmTable;
        }

        public ImputMissingData(): Models.Data[] {
            let self = this;
            let listImputedData: Models.Data[] = [];

            this.MissingData.forEach((x) => {

                let missingAttributes = x.AttributesCounts.Entries.filter((x) => { return x.Val == 0 });
                //Framework.Array.GetAllIndexes(x.AttributesCounts, 0);

                missingAttributes.forEach((ma) => {
                    let missingAttribute = ma.Key;

                    // Calcul de moyenne juge + moyenne produit - gmean
                    let sumProd = 0;
                    let prod = self.listData.filter((y) => { return y.ProductCode == x.ProductCode && y.AttributeCode == missingAttribute });
                    prod.forEach((y) => { sumProd += y.Score; });
                    let moyProd = sumProd / prod.length;

                    let sumJuge = 0;
                    let jug = self.listData.filter((y) => { return y.SubjectCode == x.SubjectCode && y.AttributeCode == missingAttribute });
                    jug.forEach((y) => { sumJuge += y.Score; });
                    let moyJuge = sumJuge / jug.length;

                    let sum = 0;
                    let all = self.listData.filter((y) => { return y.AttributeCode == missingAttribute });
                    all.forEach((y) => { sum += y.Score; });
                    let moy = sum / all.length;

                    let score = moyProd + moyJuge - moy;

                    let data = new Models.Data;
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
        }

        public GetLogDiv(): Framework.Form.TextElement {

            let div = Framework.Form.TextElement.Create("");

            div.Append(Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("Sessions:", [this.Sessions.length.toString(), this.Sessions.join(', ')])));
            div.Append(Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("Replicates:", [this.Replicates.length.toString(), this.Replicates.join(', ')])));
            div.Append(Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("Intakes:", [this.Intakes.length.toString(), this.Intakes.join(', ')])));
            div.Append(Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("Products:", [this.Products.length.toString(), this.Products.join(', ')])));
            div.Append(Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("Attributes:", [this.Attributes.length.toString(), this.Attributes.join(', ')])));
            div.Append(Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("Subjects:", [this.Subjects.length.toString(), this.Subjects.join(', ')])));

            let pDataDiagnosis = Framework.Form.TextElement.Create(Framework.LocalizationManager.Get("CompleteAndBalanceDataset"));
            let pAnalysisTotalData = Framework.Form.TextElement.Create(Framework.LocalizationManager.Format("AnalysisTotalDataCount", [this.DataCount.toString(), this.ExpectedDataCount.toString()]));
            let pAnalysisMissingData = Framework.Form.TextElement.Create("");

            if (this.MissingDataCount > 0) {
                pDataDiagnosis.Set(Framework.LocalizationManager.Get("UncompleteOrUnbalanceDataset"));
                pAnalysisMissingData.Set(Framework.LocalizationManager.Format("AnalysisMissingDataCount", [this.MissingDataCount.toString(), this.MissingDataPercentage.toString()]));
                //pAnalysisMissingData.Show();
                if (this.MissingDataPercentage < 20) {
                    //TODO pAnalysisTotalData.Set(Framework.LocalizationManager.Format("AnalysisImputedDataCount", [listImputedData.length.toString(), (Math.round(listImputedData.length / datasetSummary.ExpectedDataCount * 10000) / 100).toString()]));
                    //pAnalysisMissingData.Hide();
                } else {
                    pAnalysisMissingData.Set(Framework.LocalizationManager.Get("AnalysisMissingDataTooMuch"));
                }
            }
            div.Append(pAnalysisTotalData);
            div.Append(pAnalysisMissingData);
            div.Append(pDataDiagnosis);

            return div;
        }

        constructor(listData: Models.Data[]) {

            let self = this;

            this.listData = listData;
            this.Sessions = Framework.Array.Unique(listData.map((x) => { return x.Session }));
            this.Replicates = Framework.Array.Unique(listData.map((x) => { return x.Replicate }));
            this.Intakes = Framework.Array.Unique(listData.map((x) => { return x.Intake })).filter((x) => { return x != undefined });
            this.Subjects = Framework.Array.Unique(listData.map((x) => { return x.SubjectCode }));
            this.Products = Framework.Array.Unique(listData.map((x) => { return x.ProductCode }));
            this.Attributes = Framework.Array.Unique(listData.map((x) => { return x.AttributeCode }));

            if (Models.Data.GetType(listData[0]) == "TDS") {
                Framework.Array.Remove(this.Attributes, "START");
                Framework.Array.Remove(this.Attributes, "STOP");
            }

            this.DataCount = 0;

            // colonnes 0 à 4 : session, rep, intake, subject, product ; colonne 5 : tableau d'effectif par attribut
            this.FlatContingencyTable = [];


            for (let i1 = 0; i1 < self.Sessions.length; i1++) {
                let session = self.Sessions[i1];
                for (let i2 = 0; i2 < self.Replicates.length; i2++) {
                    let replicate = self.Replicates[i2];
                    for (let i3 = 0; i3 < self.Intakes.length; i3++) {
                        let intake = self.Intakes[i3];
                        for (let i4 = 0; i4 < self.Subjects.length; i4++) {
                            let subject = self.Subjects[i4];
                            for (let i5 = 0; i5 < self.Products.length; i5++) {
                                let product = self.Products[i5];

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

                                let tabAttributeCounts = new Framework.Dictionary.Dictionary();
                                let tabAttributeScores = new Framework.Dictionary.Dictionary();
                                let cpt = 0;
                                for (let i7 = 0; i7 < self.Attributes.length; i7++) {
                                    let attribute = self.Attributes[i7];
                                    let sel = listData.filter((x) => { return x.Session == session && x.Replicate == replicate && (x.Intake == undefined || x.Intake == intake) && x.SubjectCode == subject && x.ProductCode == product && x.AttributeCode == attribute });
                                    let count = sel.length;
                                    tabAttributeCounts.Add(attribute, count);
                                    cpt += count;
                                    let score = undefined;
                                    if (sel.length > 0) {
                                        score = sel[0].Score;
                                    }
                                    tabAttributeScores.Add(attribute, score);
                                }
                                self.FlatContingencyTable.push({ "Session": session, "Replicate": replicate, "Intake": intake, "SubjectCode": subject, "ProductCode": product, "Time": 0, "AttributesCounts": tabAttributeCounts, "AttributesScores": tabAttributeScores, "Count": cpt });
                                self.DataCount += cpt;


                            };
                        };
                    };
                };
            };


        }
    }

    export class SessionInfo {
        public Description: string;
        public DataBasePath: string;
        public LastSave: string;
        //public LastSynchronisation: string;
        public Log: string;
        public Size: string;
        public Owner: string;
    }

    export class DefaultScreenOptions {
        public ScreenBackground: string = "white";
        public Resolution: string = "4:3";
        public ProgressBar: string = "None";
        public ProgressBarPosition: string = "TopLeft";
        public DefaultStyle: object = { FontSize: 32, FontFamily: "Calibri", FontColor: "darkblue"};
        public Language: string = 'en';

        public static GetResolutionRatio(resolution: string): number {
            let tab = resolution.split(':');
            return (Number(tab[0]) / Number(tab[1]));
        }

        constructor() {
            this.Language = Framework.LocalizationManager.GetDisplayLanguage();
        }

        public static GetForm(defaultScreenOptions: DefaultScreenOptions, onChange: (changedValue: string, options: DefaultScreenOptions) => void): Framework.Form.PropertyEditor[] {

            let options = Framework.Factory.Clone(defaultScreenOptions);

            let res: Framework.Form.PropertyEditor[] = [];

            let formSetLanguage = Framework.Form.PropertyEditorWithPopup.Render("", "Language", defaultScreenOptions.Language, ['en', 'fr'], (x) => {
                options.Language = x;
                onChange("Language", options);
            });
            res.push(formSetLanguage);

            let formSetResolution = Framework.Form.PropertyEditorWithPopup.Render("", "Resolution", defaultScreenOptions.Resolution, Models.Screen.Resolutions, (x) => {
                options.Resolution = x;
                onChange("Resolution", options);
            });
            res.push(formSetResolution);

            let formSetProgressBar = Framework.Form.PropertyEditorWithPopup.Render("", "ProgressBar", defaultScreenOptions.ProgressBar, ScreenReader.Controls.CustomProgressBar.DisplayModeEnum, (x) => {
                options.ProgressBar = x;
                onChange("ProgressBar", options);
            });
            res.push(formSetProgressBar);

            let formSetProgressBarPosition = Framework.Form.PropertyEditorWithPopup.Render("", "ProgressBarPosition", defaultScreenOptions.ProgressBarPosition, ScreenReader.Controls.CustomProgressBar.PositionEnum, (x) => {
                options.ProgressBarPosition = x;
                onChange("ProgressBar", options);
            });
            res.push(formSetProgressBarPosition);

            let formSetScreenBackground = Framework.Form.PropertyEditorWithColorPopup.Render("", "ScreenBackground", defaultScreenOptions.ScreenBackground, (x) => {
                options.ScreenBackground = x;
                onChange("Background", options);
            });
            res.push(formSetScreenBackground);

            let formSetFontFamily = Framework.Form.PropertyEditorWithPopup.Render("", "FontFamily", defaultScreenOptions.DefaultStyle["FontFamily"], Framework.InlineHTMLEditor.FontNameEnum, (x) => {
                options.DefaultStyle["FontFamily"] = x;
                onChange("Style", options);
            });
            res.push(formSetFontFamily);

            let formSetFontSize = Framework.Form.PropertyEditorWithPopup.Render("", "FontSize", defaultScreenOptions.DefaultStyle["FontSize"], Framework.InlineHTMLEditor.FontSizeEnum, (x) => {
                options.DefaultStyle["FontSize"] = x;
                onChange("Style", options);
            });
            res.push(formSetFontSize);

            let formSetFontColor = Framework.Form.PropertyEditorWithColorPopup.Render("", "FontColor", defaultScreenOptions.DefaultStyle["FontColor"], (x) => {
                options.DefaultStyle["FontColor"] = x;
                onChange("Style", options);
            });
            res.push(formSetFontColor);

            return res;
        }
    }

    export class Session extends Framework.Database.DBItem {
        public LocalDirectoryId: string;
        public Name: string;
        public Description: string;
        public IsLocked: boolean = false;
        public Log: string = "";
        //public ListAttributes: Models.Attribute[] = []; // Conservé pour compatibilité V1
        public ListSubjects: Models.Subject[] = [];
        //public ListProducts: Models.Product[] = []; // Conservé pour compatibilité V1
        public Upload: Upload;
        public ListExperimentalDesigns: Models.ExperimentalDesign[] = [];
        public ListScreens: Models.Screen[] = [];
        public ListData: Models.Data[] = [];

        //public ListOutputs: Output[];
        public DataTabs: string[];
        public MonitoringProgress: PanelLeaderModels.MonitoringProgress[] = [];
        public Mail: PanelLeaderModels.Mail; // Modèle de mail à envoyer au panéliste
        public SubjectPasswordGenerator: Framework.Random.Generator;
        public Version: string;
        public DefaultScreenOptions: DefaultScreenOptions;

        constructor() {
            super();
            this.Name = "";
            this.ListSubjects = [];
            this.ListExperimentalDesigns = [];
            this.ListScreens = [];
            this.ListData = [];
            //this.ListOutputs = [];

            this.Upload = new Upload();
            this.Upload.Date = undefined;
            this.Upload.Description = "";
            this.Upload.ExpirationDate = new Date(Date.now());
            this.Upload.ExpirationDate.setMonth(this.Upload.ExpirationDate.getMonth() + 2);
            this.Upload.InitialUploader = undefined;
            this.Upload.MailPath = undefined;
            this.Upload.MinTimeBetweenConnexions = 0;
            this.Upload.Password = "";
            this.Upload.ServerCode = undefined;
            this.Upload.ShowSubjectCodeOnClient = "NotStarted";

            this.Upload.AnonymousMode = "NotAuthorized";

            this.Mail = new PanelLeaderModels.Mail();
            this.MonitoringProgress = [];

            this.SubjectPasswordGenerator = new Framework.Random.Generator();

            this.DefaultScreenOptions = new DefaultScreenOptions();

            this.DataTabs = [];
        }

        public static FromData(data: Models.Data[]): PanelLeaderModels.Session {
            let subjects = Framework.Array.Unique(data.map((x) => { return x.SubjectCode }));
            let products = Framework.Array.Unique(data.map((x) => { return x.ProductCode }));
            let attributes = Framework.Array.Unique(data.map((x) => { return x.AttributeCode }));
            let replicates = Framework.Array.Unique(data.map((x) => { return x.Replicate }));
            let intakes = Framework.Array.Unique(data.map((x) => { return x.Intake }));

            let session = new PanelLeaderModels.Session();

            session.LogAction("Creation", "New session from data.", false);

            subjects.forEach((x) => {
                let subject = session.AddNewPanelist([]);
                subject.Code = x;
                session.AddNewPanelists([subject]);
            });

            let productDesign = session.GetNewDesign("Product", "Custom", replicates.length, []);
            productDesign.NbIntakes = intakes.length;
            session.AddNewDesign(productDesign);

            products.forEach((x) => {
                let item = productDesign.GetNewItem([], []);
                item.Code = x;
                session.AddItemsToDesign(productDesign, [item]);
            });


            let attributeDesign = session.GetNewDesign("Attribute", "Custom", 1, []);
            session.AddNewDesign(attributeDesign);
            attributes.forEach((x) => {
                let item = productDesign.GetNewItem([], []);
                item.Code = x;
                session.AddItemsToDesign(attributeDesign, [item]);
            });


            session.AddData(data, "Imported");

            return session;

        }

        public SetMailFromTemplate(template: PanelLeaderModels.MailTemplate) {

            this.Mail.Body = template.Body;
            this.Mail.Subject = template.Subject;
            this.Mail.ReturnMailAddress = template.ReturnMailAddress;
            this.Mail.DisplayedName = template.DisplayedName;

            this.OnChanged();

        }

        public GetSessionInfo(dataBasePath: string): SessionInfo {
            let info = new SessionInfo();
            info.Description = this.Description;
            info.DataBasePath = dataBasePath + "/" + this.ID;
            info.LastSave = this.LastUpdate.substr(0, 4) + "-" + this.LastUpdate.substr(5, 2) + "-" + this.LastUpdate.substr(8, 2) + " " + this.LastUpdate.substr(11, 8);
            //info.LastSynchronisation = Framework.LocalizationManager.Get(this.Status);
            info.Log = this.Log;
            info.Size = Framework.Maths.Round((JSON.stringify(this).length / 1024), 2) + " ko";
            return info;
        }

        public OnLockedChanged: (isLocked: boolean) => void = () => { };
        public OnChanged: () => void = () => { };
        public OnLog: (action: string, detail: string) => void = () => { };

        public Close() {
            // Ajout aux fichiers récents
            this.LogAction("Close", "Session closed.", false, false);
        }

        public GetSubjectSession(): Models.SubjectSeance {
            let subjectSession = new Models.SubjectSeance();
            subjectSession.ListExperimentalDesigns = this.ListExperimentalDesigns;
            subjectSession.ListScreens = this.ListScreens;
            subjectSession.Subject = this.ListSubjects[0];
            subjectSession.Progress = new Models.Progress();
            subjectSession.Progress.CurrentState = new Models.State();
            subjectSession.Progress.CurrentState.CurrentScreen = 0;
            return subjectSession;
        }

        public LogAction(action: string, detail: string, logOnServer: boolean, triggerOnChange: boolean = true): void {
            this.Log += "[" + Framework.Format.ToDateString() + ", " + this.Owner + "] " + detail + "\r\n";
            if (triggerOnChange == true) {
                this.OnChanged();
            }
            if (logOnServer == true) {
                this.OnLog(action, detail);
            }
        }

        public ListFriendlyNames: string[] = [];

        public static FromJSON(json: string): Session {
            let session = Framework.Factory.Create(PanelLeaderModels.Session, json);
            return session;
        }

        public static FromJson(json: string, onStart: () => void, onComplete: (session: PanelLeaderModels.Session) => void): void {

            let self = this;

            onStart();

            // worker pour ne pas bloquer l'UI
            var worker: Worker = new Worker("ts/ReadJSONWorkerPL.js");
            worker.onmessage = function (e) {
                let session: PanelLeaderModels.Session = Framework.Factory.CreateFrom(PanelLeaderModels.Session, e.data);
                session.OnChanged();
                onComplete(session);
                worker.terminate();
            };
            worker.postMessage(json);
        }

        public ToggleLock() {
            if (this.IsLocked == true) {
                this.IsLocked = false;
            } else {
                this.IsLocked = true;
            }
            this.OnLockedChanged(this.IsLocked);
            this.LogAction("Lock", "Session locked: " + this.IsLocked + ".", false);
        }

        public Check(login: string = "", returnMailAddress: string = "", displayedName: string = "") {

            let session = this;

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
            if ((<any>(session)).ListUploads && (<any>(session)).ListUploads.length > 0) {
                session.Upload = (<any>(session)).ListUploads[0];
            }
            delete session["ListUploads"];

            if ((<any>(session)).AnonymousAccess && (<any>(session)).AnonymousAccess.Mode) {
                session.Upload.AnonymousMode = (<any>(session)).AnonymousAccess.Mode;
            }

            if (session.Upload.ExpirationDate == undefined) {
                session.Upload.ExpirationDate = new Date(Date.now());
                session.Upload.ExpirationDate.setMonth(session.Upload.ExpirationDate.getMonth() + 2);
            }

            let colors: string[] = ["red", "blue", "lawngreen", "purple", "darkgrey", "cyan", "fuschia", "coral", "orange", "turquoise", "darkgreen", "violet", "gold", "indigo", "burlywood"];

            // Couleurs des attributs par défaut
            if (session["ListAttributes"]) {
                let colorIndex = 0;
                session["ListAttributes"].forEach((x) => {
                    if (x.Color == undefined) {
                        x.Color = colors[colorIndex];
                        colorIndex++;
                        if (colorIndex == colors.length) {
                            colorIndex = 0;
                        }
                    }
                });
            }

            if (session["ListProducts"]) {
                let colorIndex = 0;
                // Couleurs des produits par défaut            
                session["ListProducts"].forEach((x) => {
                    if (x.Color == undefined) {
                        x.Color = colors[colorIndex];
                        colorIndex++;
                        if (colorIndex == colors.length) {
                            colorIndex = 0;
                        }
                    }
                });
            }

            let listDesigns: Models.ExperimentalDesign[] = [];
            session.ListExperimentalDesigns.forEach((x) => {

                let design: Models.ExperimentalDesign = Framework.Factory.CreateFrom(Models.ExperimentalDesign, x)
                design.ConvertFromSL();

                listDesigns.push(design);

            });
            session.ListExperimentalDesigns = listDesigns;

            session.ListFriendlyNames = [];

            // Controle ID par défaut
            session.ListScreens.forEach((screen) => {

                let nbItems = 0;
                let nbJuges = 0;
                let nbReps = 0;
                let nbIntakes = 0;

                if (screen.ExperimentalDesignId == 0) {
                } else {
                    let designs = session.ListExperimentalDesigns.filter((x) => { return screen.ExperimentalDesignId == x.Id });
                    let currentDesign = designs[0];
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
                screen.Controls.forEach((control) => {
                    if (!control._FriendlyName || control._FriendlyName == "" || control._FriendlyName == "0" || (control._FriendlyName != undefined && session.ListFriendlyNames.indexOf(control._FriendlyName) > -1)) {
                        if (control._Id != undefined && control._Id != 0) {
                            control._FriendlyName = control._Id.toString();
                        } else {
                            control._FriendlyName = session.GetUniqueControlFriendlyName(control, control._FriendlyName);
                        }
                    } else {
                        session.ListFriendlyNames.push(control._FriendlyName);
                    }
                });
            });

            // Transformation ListProduct, ListAttribute, ListItemLabel en ListExperimentalDesignItem  
            session.ListExperimentalDesigns.forEach((design) => {
                if (design.Type == "Product") {
                    Models.ExperimentalDesign.ConvertItemLabelsFromV1(design, session["ListProducts"]);
                }
                if (design.Type == "Attribute") {
                    Models.ExperimentalDesign.ConvertItemLabelsFromV1(design, session["ListAttributes"]);
                }
            });
        }

        public GetUniqueControlFriendlyName(control: ScreenReader.Controls.BaseControl, name): string {
            let i = 1;
            if (name == "") {
                let name: string = control._Type + "_" + i.toString();
            }
            while (this.ListFriendlyNames.indexOf(name) > -1) {
                i += 1;
                name = control._Type + "_" + i.toString();
            }
            this.ListFriendlyNames.push(name);
            return name;
        }

        public static FromFile(file: File, onStart: () => void, onComplete: (session: PanelLeaderModels.Session) => void): void {
            let self = this;

            //onStart();

            // Lecture du fichier local
            var fileReader: FileReader = new FileReader();
            fileReader.onload = function (e) {
                let json: string = <any>fileReader.result;
                Session.FromJson(json, onStart, onComplete);
            }
            fileReader.readAsText(file);
        }

        public static FromTemplate(templatedSession: TemplatedSession): Session {
            let session = new Session();

            session.AddNewPanelists(session.GetNewPanelists(templatedSession.NbSubjects));

            templatedSession.ListExperimentalDesigns.forEach((x) => {
                let design = session.GetNewDesign(x.Type, x.Order, x.NbReplicates, x.ListItems, x.Name);
                session.AddNewDesign(design);
            });



            let screenId = 1;
            templatedSession.Screens.forEach((x) => {

                let templatedScreen = x.Screens.filter((y) => { return y.Name == x.SelectedScreen })[0];
                templatedScreen.DefaultScreenOptions = templatedSession.DefaultScreenOptions;

                //if (templatedScreen instanceof TemplatedScreenWithSubjectSummary) {
                //    session.AddScreen(Models.Screen.CreateScreenWithSubjectSummary(screenId, <TemplatedScreenWithSubjectSummary>templatedScreen));
                //}

                if (templatedScreen instanceof TemplatedScreenWithContent) {
                    if (templatedScreen instanceof TemplatedScreenWithExit) {
                        session.AddScreen(Models.Screen.CreateExitScreen(screenId, <TemplatedScreenWithExit>templatedScreen));
                    } else {
                        session.AddScreen(Models.Screen.CreateScreenWithContent(screenId, <TemplatedScreenWithContent>templatedScreen));
                    }
                }

                if (templatedScreen instanceof TemplatedScreenWithCATA) {
                    session.AddScreen(Models.Screen.CreateCATAScreen(screenId, <TemplatedScreenWithCATA>templatedScreen));
                }

                if (templatedScreen instanceof TemplatedScreenWithSorting) {
                    session.AddScreen(Models.Screen.CreateSortingScreen(screenId, <TemplatedScreenWithSorting>templatedScreen));
                }

                if (templatedScreen instanceof TemplatedScreenWithRanking) {
                    session.AddScreen(Models.Screen.CreateRankingScreen(screenId, <TemplatedScreenWithRanking>templatedScreen));
                }

                if (templatedScreen instanceof TemplatedScreenWithNapping) {
                    session.AddScreen(Models.Screen.CreateNappingScreen(screenId, <TemplatedScreenWithNapping>templatedScreen));
                }

                if (templatedScreen instanceof TemplatedScreenWithDiscrimination) {
                    session.AddScreen(Models.Screen.CreateDiscriminationScreen(screenId, <TemplatedScreenWithDiscrimination>templatedScreen));
                }

                if (templatedScreen instanceof TemplatedScreenWithTDS) {
                    session.AddScreen(Models.Screen.CreateTDSScreen(screenId, <TemplatedScreenWithTDS>templatedScreen));
                }

                if (templatedScreen instanceof TemplatedScreenWithDiscreteScale) {
                    session.AddScreen(Models.Screen.CreateDiscreteScaleScreen(screenId, <TemplatedScreenWithDiscreteScale>templatedScreen));
                }

                if (templatedScreen instanceof TemplatedScreenWithContinuousScale) {
                    session.AddScreen(Models.Screen.CreateContinuousScaleScreen(screenId, <TemplatedScreenWithContinuousScale>templatedScreen));
                }

                if (templatedScreen instanceof TemplatedScreenWithTDSAndDiscreteScale) {
                    session.AddScreen(Models.Screen.CreateTDSAndDiscreteScaleScreen(screenId, <TemplatedScreenWithTDSAndDiscreteScale>templatedScreen));
                }

                if (templatedScreen instanceof TemplatedScreenWithTDSAndContinuousScale) {
                    session.AddScreen(Models.Screen.CreateTDSAndContinuousScaleScreen(screenId, <TemplatedScreenWithTDSAndContinuousScale>templatedScreen));
                }
                screenId++;
            });
            //TODO : logo TimeSens
            //TODO : appliquer style, calculer coordonnées en fonction de résolution
            //TODO : options de déploiement

            session.OnChanged();

            return session;
        }

        public GetNewScreen(screen: Models.Screen = undefined, index: number = undefined, experimentalDesignId: number = undefined): Models.Screen {
            if (screen == undefined) {
                screen = Models.Screen.Create(experimentalDesignId);
            }

            screen.Resolution = this.DefaultScreenOptions.Resolution;

            if (screen.Id == undefined) {
                let ids: number[] = this.ListScreens.map((x) => { return x.Id });

                let max = 0;
                if (ids.length > 0) {
                    max = Math.max.apply(null, ids);
                }

                screen.Id = max + 1;
            }
            return screen;
        }

        public AddScreen(screen: Models.Screen = undefined, index: number = undefined, experimentalDesignId: number = undefined, newId=false) {
            if (index > -1) {

                if (index > 0) {
                    let background = this.ListScreens[index - 1].Background;
                    let resolution = this.ListScreens[index - 1].Resolution;
                }

                if (newId) {
                    let ids: number[] = this.ListScreens.map((x) => { return x.Id });

                    let max = 0;
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
        }

        public DeleteScreen(screenId: number): number {

            let deletedScreenIndex: number = -1;
            let screenToDelte: Models.Screen = undefined;
            for (let i = 0; i < this.ListScreens.length; i++) {
                if (this.ListScreens[i].Id == screenId) {
                    screenToDelte = this.ListScreens[i];
                    deletedScreenIndex = i;
                    break;
                }
            }

            Framework.Array.Remove(this.ListScreens, screenToDelte);
            let newSelectedScreenIndex: number = 0;
            if (deletedScreenIndex > 0) {
                newSelectedScreenIndex = deletedScreenIndex - 1;
            }

            this.LogAction("Scenario", "Screen deleted at index " + deletedScreenIndex + ".", false);
            return this.ListScreens[newSelectedScreenIndex].Id;
        }

        public MoveScreen(index: number, direction: string) {

            let newIndex: number;

            if (direction == "up" && index > 0) {
                newIndex = index - 1;
            }

            if (direction == "down" && index < this.ListScreens.length - 1) {
                newIndex = index + 1;
            }

            Framework.Array.SwapElementsAt(this.ListScreens, index, newIndex);
            this.LogAction("Scenario", "Screen " + index + " moved " + direction + ".", false);
        }

        public ChangeAllScreensResolution(resolution: string) {
            let self = this;
            let resizeRatio = DefaultScreenOptions.GetResolutionRatio(resolution) / DefaultScreenOptions.GetResolutionRatio(this.DefaultScreenOptions.Resolution);
            this.DefaultScreenOptions.Resolution = resolution;
            this.ListScreens.forEach((x) => {
                x.Resolution = this.DefaultScreenOptions.Resolution;
                x.Controls.forEach((c) => {
                    c._Left *= resizeRatio;
                    //c._Top *= resizeRatio;
                    //c._Height *= resizeRatio;
                    c._Width *= resizeRatio;
                });
            });
            this.LogAction("Scenario", "Screen resolution changed to " + resolution + ".", false);
        }

 

        public AddItemsToDesign(design: Models.ExperimentalDesign, items: Models.ExperimentalDesignItem[]): string[] {
            let self = this;
            let existing: string[] = [];
            items.forEach((x) => {
                let uniqueCode = self.GetUniqueCode(design.ListItems, "Code", x.Code);
                if (x.Code != uniqueCode) {
                    x.Code = uniqueCode;
                    existing.push(x.Code);
                }
                if (x.LongName == null) {
                    x.LongName = x.Code;
                }
                if (x.Color == null) {
                    x.Color = Framework.Color.GetColorFromContrastedPalette(design.ListItems.map((x) => { return x.Color; }));
                }
                design.AddItem(x);
            });
            this.LogAction("Protocol", "Items " + items.map((x) => { return x.Code }).join(', ') + " added to design " + design.Name + ".", false);
            return existing;
        }

        public EditDesignRanks(design: Models.ExperimentalDesign, subjectCodes: string[], itemCode: string, replicate: number, newRank: number) {
            subjectCodes.forEach((x) => {
                design.SetItemRank(itemCode, replicate, newRank, x);
            });
            this.LogAction("Protocol", "Row order of design " + design.Name + " ranks changed.", false);
        }

        public ResetDesign(design: Models.ExperimentalDesign) {
            design.Reset();
            this.LogAction("Protocol", "Design " + design.Name + " reset.", false);
        }

        public UpdateDesignLabels(design: Models.ExperimentalDesign, items: Models.ExperimentalDesignItem[]) {
            design.UpdateItemLabels(items);
            this.LogAction("Protocol", "Item labels updated.", false);
        }

        public RemoveItemsFromDesign(design: Models.ExperimentalDesign, items: Models.ExperimentalDesignItem[], removeData: boolean) {
            let codes = items.map((x) => { return x.Code });
            design.RemoveItems(codes);
            if (design.Type == "Product") {
                this.removeData(codes, "ProductCode");
            }
            if (design.Type == "Attribute") {
                this.removeData(codes, "AttributeCode");
            }
            this.LogAction("Protocol", "Items " + codes.join(',') + " removed from design " + design.Name + ".", false);
        }

        public UpdateItemLabel(design: Models.ExperimentalDesign, oldCode: string, newCode: string, replicate: number, newLabel: string, oldLabel: string) {
            design.UpdateItemLabel(oldCode, newCode, replicate, newLabel, oldLabel);
            this.LogAction("Protocol", "Item label updated.", false);
        }

        public SetSubjectsPasswords(subjects: Models.Subject[], newPasswords: string[] = undefined): { newPasswords: string[], oldPasswords: string[] } {
            let oldPasswords = subjects.map((x) => { return x.Password });
            if (newPasswords == undefined) {
                newPasswords = Framework.Random.Helper.GetUniqueRandomCodes(subjects.map((s: Models.Subject) => { return s.Password; }), subjects.length, this.SubjectPasswordGenerator.IncludeDigits, this.SubjectPasswordGenerator.IncludeLowercases, this.SubjectPasswordGenerator.IncludeUppercases, this.SubjectPasswordGenerator.Length);
            }
            for (let i = 0; i < subjects.length; i++) {
                subjects[i].Password = newPasswords[i];
            }
            this.LogAction("Protocol", "Passwords changed for subjcets " + subjects.join(', ') + ".", false)
            return { newPasswords: newPasswords, oldPasswords: oldPasswords };
        }

        public ResetSubjectsPasswords(subjects: Models.Subject[]) {
            for (let i = 0; i < subjects.length; i++) {
                subjects[i].Password = "";
            }
            this.LogAction("Protocol", "Passwords reseted for subjects " + subjects.join(', ') + ".", false)
        }

        public SetMonitoringProgress(url: string, resetProgress: boolean) {

            let self = this;

            if (this.MonitoringProgress == undefined || resetProgress == true) {
                this.MonitoringProgress = [];
            }

            this.ListSubjects.forEach((s) => {
                let p: PanelLeaderModels.MonitoringProgress;
                let subjectProgress = self.MonitoringProgress.filter((x) => x.SubjectCode == s.Code);
                if (subjectProgress.length == 0) {
                    p = new PanelLeaderModels.MonitoringProgress();
                    p.URL = undefined;
                    p.LastAccess = "-";
                    p.MailStatus = Framework.LocalizationManager.Get("NotSent");
                    p.Progress = "-";
                    p.SubjectCode = s.Code;
                    p.Password = s.Password;
                    self.MonitoringProgress.push(p);
                } else {
                    p = subjectProgress[0];
                }
                p.FirstName = s.FirstName;
                p.LastName = s.LastName;
                p.Mail = s.Mail;
                if (self.Upload.ServerCode != undefined) {
                    p.URL = url + "/panelist/index.html?servercode=" + self.Upload.ServerCode + "&subjectcode=" + s.Code + "&password=" + s.Password; //TODO: crypter les paramètres, notamment panelleader                   
                }
                let nbProducts = Framework.Array.Unique(self.ListData.filter((x) => x.SubjectCode == p.SubjectCode && x.ProductCode.length > 0).map((x) => { return x.ProductCode })).length;
                if (nbProducts > 0) {
                    p.Products = nbProducts.toString(); //TODO : 1/x
                }
                else {
                    p.Products = "-";
                }

            });

            this.OnChanged();
            //TODO : supprimer les juges qui ont élé enlevés
        }

        private monitoringProgressToArray(): string[][] {
            let session = this;
            let res: string[][] = [];
            //let titleRow = ["Session code", "Subject code", "Password", /*Framework.LocalizationManager.Get("FirstName"), Framework.LocalizationManager.Get("LastName"),*/ /*Framework.LocalizationManager.Get("Mail"),*/ "URL to open the session"/*, Framework.LocalizationManager.Get("Products"), Framework.LocalizationManager.Get("Progress"), Framework.LocalizationManager.Get("Date")*/];
            let titleRow = ["Session code", "Subject code", "Password",  "URL to open the session", Framework.LocalizationManager.Get("Progress"), Framework.LocalizationManager.Get("Date")];
            res.push(titleRow);
            session.MonitoringProgress.forEach((x:MonitoringProgress) => {
                let row = [session.Upload.ServerCode, x.SubjectCode, x.Password, MonitoringProgress.GetEncryptedURL(x.URL), x.Progress,x.LastAccess];
                res.push(row);
            });
            return res;
        }

        public UpdateMonitoringProgress(url: string, progress: PanelLeaderModels.MonitoringProgress[]): PanelLeaderModels.MonitoringProgress[] {

            let session = this;

            this.SetMonitoringProgress(url, false);

            progress.forEach((p) => {
                let subjectProgresses = session.MonitoringProgress.filter((x) => x.SubjectCode == p.SubjectCode);
                if (subjectProgresses.length > 0) {
                    subjectProgresses[0].Progress = p.Progress;
                    subjectProgresses[0].LastAccess = p.LastAccess;
                   
                }
                //subjectProgress.MailStatus = p.CurrentState.MailStatus;
            });

            this.OnChanged();

            return session.MonitoringProgress;
        }

        private listDataContains(codes: string[], attributeName: string): boolean {
            let res = false
            let existingCodes = this.ListData.map((x) => { return x[attributeName]; });
            codes.forEach((x) => {
                if (existingCodes.indexOf(x) > -1) {
                    res = true;
                }
            });
            return res;
        }

        public ListDataContainsProductCode(codes: string[]): boolean {
            return this.listDataContains(codes, "ProductCode");
        }

        public ListDataContainsAttributeCode(codes: string[]): boolean {
            return this.listDataContains(codes, "AttributeCode");
        }

        public ListDataContainsSubjectCode(codes: string[]): boolean {
            return this.listDataContains(codes, "SubjectCode");
        }

        public RemoveDesign(design: Models.ExperimentalDesign, associatedData: Models.Data[] = []) {
            Framework.Array.Remove(this.ListExperimentalDesigns, design);
            Framework.Array.Remove(this.ListData, associatedData);
            this.LogAction("Protocol", "Design " + design.Name + " removed.", false);
        }

        public CheckIfDesignIsUsedByControl(design: Models.ExperimentalDesign): string {
            for (let i = 0; i < this.ListScreens.length; i++) {
                let screen = this.ListScreens[i];
                if (screen.ExperimentalDesignId == design.Id) {
                    return "Screen " + (i + 1);
                }
                for (let j = 0; j < screen.Controls.length; j++) {
                    let control = screen.Controls[j];
                    if (control["ExperimentalDesignId"] == design.Id) {
                        return "Control " + control._FriendlyName;
                    }
                }
            }
            return "";
        }

        public GetDesignData(design: Models.ExperimentalDesign): Models.Data[] {
            let self = this;
            let res: Models.Data[] = [];
            design.ListItems.forEach((item) => {
                let variable = ""
                if (design.Type == "Product") {
                    variable = "ProductCode";
                }
                if (design.Type == "Attribute") {
                    variable = "AttributeCode";
                }
                self.ListData.filter((x) => { return x[variable] == item.Code }).forEach((d) => {
                    res.push(d);
                });
            });
            return res;
        }

        public UpdateDesign(design: Models.ExperimentalDesign, source: Models.ExperimentalDesign) {
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
        }

        public RemoveSubjects(subjects: Models.Subject[], removeData: boolean) {

            // Suppression dans les plans de présentation
            let codes = subjects.map((x) => { return x.Code });
            this.ListExperimentalDesigns.forEach((x) => { x.RemoveSubjects(codes); });

            let listSubjectsChanged: boolean = false;
            let listDataChanged: boolean = false;
            let listExperimentalDesignChanged: boolean = false;

            let self = this;

            subjects.forEach((s) => {
                // Suppression de la liste des produits
                Framework.Array.Remove(self.ListSubjects, s);
                listSubjectsChanged = true;

                // Suppression de la liste des données
                if (removeData == true) {
                    let data = self.ListData.filter((x) => {
                        return x.SubjectCode == s.Code;
                    });
                    data.forEach((d) => {
                        Framework.Array.Remove(self.ListData, d);
                        listDataChanged = true;
                    });

                }
            });

            self.LogAction("Protocol", "Subject(s) " + codes.join(', ') + " removed.", false);
        }

        public RemoveData(data: Models.Data[]) {
            let self = this;
            data.forEach((d) => {
                Framework.Array.Remove(self.ListData, d);
            });
            self.LogAction("Data", data.length + " data rows removed.", false);
        }

        private removeData(codes: string[], attributeName: string) {
            let self = this;
            let cpt = 0;
            codes.forEach((x) => {
                let data = self.ListData.filter((y) => { return y[attributeName] == x });
                data.forEach((y) => {
                    Framework.Array.Remove(self.ListData, y);
                    cpt++;
                });
            });
            self.LogAction("Data", cpt + " data rows removed.", false);
        }

        public GetNewData(sheetName: string, dType: string, nb: number = 1): Models.Data[] {
            let data: Models.Data[] = [];
            for (var i = 0; i < nb; i++) {
                let d = new Models.Data();
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
        }

        public GetNewItems(design: Models.ExperimentalDesign, nb: number = 1): Models.ExperimentalDesignItem[] {
            let items: Models.ExperimentalDesignItem[] = [];
            for (var i = 0; i < nb; i++) {
                let item = design.GetNewItem(items.map((x) => { return x.Code }), Framework.Array.Merge(design.ListItems.map((x) => { return x.Color; }), items.map((x) => { return x.Color })));
                items.push(item);
            }

            return items;
        }

        private exists(listData: any[], attributeName: string, attributeValue: string): boolean {
            let count = listData.filter((x) => { return x[attributeName] == attributeValue }).length;
            return count > 0;
        }

        public GetUniqueCode(listData: any[], attributeName: string, attributeValue: string) {
            let newCode = attributeValue;
            let index = 1;
            while (this.exists(listData, attributeName, newCode) == true) {
                newCode = attributeValue + "_" + index;
                index++;
            }
            return newCode;
        }

        public AddNewPanelist(newCodes: string[]): Models.Subject {
            let subject = new Models.Subject();
            subject.Code = Framework.Format.GetCode(this.ListSubjects.map((x) => { return x.Code; }).concat(newCodes), "S");
            return subject;
        }

        public GetNewPanelists(nb: number = 1): Models.Subject[] {
            let subjects: Models.Subject[] = [];
            let newCodes: string[] = [];
            for (var i = 0; i < nb; i++) {
                let subject = this.AddNewPanelist(newCodes);
                subjects.push(subject);
                newCodes.push(subject.Code);
            }

            return subjects;
        }

        public UpdateSubjectCodes(oldValue: any, newValue: any) {

            // MAJ dans les plans prés
            this.ListExperimentalDesigns.forEach((design) => {
                design.ListExperimentalDesignRows.filter((x) => { return x.SubjectCode == oldValue }).forEach((row) => {
                    row.SubjectCode = newValue;
                });
            });

            // MAJ dans les données
            this.ListData.filter((x) => { return x.SubjectCode == oldValue }).forEach((data) => {
                data.SubjectCode = newValue;
            });

            this.OnChanged();
        }

        public GetDesignFromInlineDesign(dtype: string, items: any[]): { design: Models.ExperimentalDesign, existingSubjects: string[], existingItems: string[] } {
            // Transformation inlinedesign en ExperimentalDesignRow[]
            let rows: Models.ExperimentalDesignRow[] = [];
            let itemLabels: Models.ExperimentalDesignItem[] = [];
            let subjects: Models.Subject[] = [];
            items.forEach((item) => {
                // item: SubjectCode Rank 1 Rank 2 ...
                let subjectCode = item["SubjectCode"];
                if (subjects.filter((s) => { return s.Code == subjectCode }).length == 0) {
                    let subject: Models.Subject = new Models.Subject();
                    subject.Code = subjectCode;
                    subjects.push(subject);
                }
                for (let rank = 1; rank <= 50; rank++) {
                    if (item["Rank" + rank]) {
                        var row: Models.ExperimentalDesignRow = new Models.ExperimentalDesignRow();
                        var code = item["Rank" + rank];
                        var replicate = rows.filter((r) => { return r.SubjectCode == subjectCode && r.Code == code }).length + 1;
                        row.SubjectCode = subjectCode;
                        row.Code = code;
                        row.Rank = rank;
                        row.Replicate = replicate;
                        row.Label = code;//TODO : générer nouveau label si produit ?
                        rows.push(row);

                        let listLabelsWithCode = itemLabels.filter((x) => { return x.Code == code; });
                        if (listLabelsWithCode.length == 0) {
                            let item = new Models.ExperimentalDesignItem();
                            item.Code = row.Code;
                            item.LongName = row.Code;
                            item.Labels = [];
                            itemLabels.push(item);
                        }
                        listLabelsWithCode = itemLabels.filter((x) => { return x.Code == code; });
                        listLabelsWithCode.forEach((x) => {
                            if (x.Labels.filter((kvp) => { return kvp.Key == replicate }).length == 0) {
                                x.Labels.push(new Framework.KeyValuePair(replicate, row.Code));
                            }

                        });
                    }
                }
            });

            let existingSubjects = this.AddNewPanelists(subjects);
            let existingItems: Framework.KeyValuePair[];

            //TOFIX
            //if (dtype == "Product") {
            //   //TODO : pair, triangle...        
            //    existingItems = this.AddNewProducts(products);
            //}
            //if (dtype == "Attribute") {
            //    existingItems = this.AddNewAttributes(attributes);
            //}

            //Renommage dans itemlabels et dans rows 
            existingSubjects.forEach((s) => {
                let subjectRows = rows.filter((x) => { return x.SubjectCode == s.Key });
                subjectRows.forEach((x) => { x.Code = s.Value });
            });
            //existingItems.forEach((item) => {
            //    let il = itemLabels.filter((x) => { return x.Code == item.Key });
            //    il.forEach((x) => { x.Code = item.Value });
            //    let itemRows = rows.filter((x) => { return x.Code == item.Key });
            //    itemRows.forEach((x) => { x.Code = item.Value });
            //});

            let newDesign: Models.ExperimentalDesign = this.GetNewDesign(dtype, "Custom", Framework.Array.Unique(rows.map((x) => { return x.Replicate })).length, itemLabels);
            newDesign.ListExperimentalDesignRows = rows;

            let existingSubjectCodes: string[] = existingSubjects.map((x) => { return x.Key.toString(); });
            //let existingItemCodes: string[] = existingItems.map((x) => { return x.Key.toString(); });
            let existingItemCodes: string[];

            return { design: newDesign, existingSubjects: existingSubjectCodes, existingItems: existingItemCodes };
        }

        public AddNewPanelists(subjects: Models.Subject[]): Framework.KeyValuePair[] {

            let existing: Framework.KeyValuePair[] = [];
            let self = this;
            subjects.forEach((x) => {
                let uniqueCode = self.GetUniqueCode(self.ListSubjects, "Code", x.Code);
                if (x.Code != uniqueCode) {
                    let code = x.Code;
                    x.Code = uniqueCode;
                    existing.push(new Framework.KeyValuePair(code, uniqueCode));
                }
                self.ListSubjects.push(x);
            });

            // MAJ des plans de présentation  
            this.ListExperimentalDesigns.forEach((x) => {
                //x.Update([s.Code], x.ListItemLabels);
                x.AddSubjects(subjects.map((y) => { return y.Code; }));
            });

            //if (this.OnListSubjectChanged) {
            //    this.OnListSubjectChanged(s, "New");
            //}
            //TODO + modif plan prés (Listitems, listrows)
            //_code = StringExtensions.RemoveTrimming0(StringExtensions.RemoveDiacritics(value));

            self.LogAction("Protocol", "Subject(s) " + subjects.map((x) => { return x.Code }).join(', ') + " added.", false);
            return existing;
        }

        public GetNewDesign(edtype: string, order: string, replicates: number, items: Models.ExperimentalDesignItem[], name: string = ''): Models.ExperimentalDesign {
            let id = 1;
            while (this.ListExperimentalDesigns.filter((x) => { return x.Id == id }).length > 0) {
                id++;
            }

            let subjects: string[] = this.ListSubjects.map((x) => { return x.Code });

            let design = Models.ExperimentalDesign.Create(edtype, id, subjects, order, replicates, items);

            if (name.length > 0) {
                design.Name = name;
            } else {
                design.Name = Framework.LocalizationManager.Format("ExperimentalDesignOfType", [Framework.LocalizationManager.Get(edtype), id.toString()]);
            }

            let nameSuffix = 0;
            let designName = design.Name;
            while (this.ListExperimentalDesigns.filter((x) => { return x.Name == design.Name }).length > 0) {
                nameSuffix++;
                design.Name = designName + " (" + nameSuffix + ")";
            }

            return design;
        }

        public AddNewDesign(design: Models.ExperimentalDesign) {
            this.ListExperimentalDesigns.push(design);
            this.LogAction("Protocol", "New " + design.Type + " design added.", false);
        }

        public ApplyStyle(style: object) {
            let self = this;
            self.DefaultScreenOptions.DefaultStyle = style;
            this.ListScreens.forEach((x) => {
                x.Controls.forEach((control) => {
                    control.SetStyle(self.DefaultScreenOptions.DefaultStyle);
                });
            });

            this.LogAction("Scenario", "Screens style changed.", false);
        }

        public static ApplyStyleS(style: object, session: Session) {
            session.ApplyStyle(style);
        }

        public SetListScreensBackground(background: string) {
            let self = this;

            this.DefaultScreenOptions.ScreenBackground = background;

            this.ListScreens.forEach((x) => {
                x.Background = background;
            });

            this.LogAction("Scenario", "Screens' background changed.", false);
        }

        public SetListScreensProgressBar(position: string, ptype: string) {
            let self = this;
            let index = 0;

            this.DefaultScreenOptions.ProgressBarPosition = position;
            this.DefaultScreenOptions.ProgressBar = ptype;

            this.ListScreens.forEach((x) => {
                //let screen = Framework.Factory.CreateFrom(Models.Screen, x);
                //screen.SetProgressBar(position, ptype, index + 1, self.ListScreens.length);
                Models.Screen.SetProgressBar(x, position, ptype, index + 1, self.ListScreens.length);
                index++;
            });

            this.LogAction("Scenario", "Screens' progress bars changed.", false);
        }

        public SaveAsUndeployedCopy(deleteUpload: boolean, deleteData: boolean, deleteSubjects: boolean, deleteProducts: boolean, deleteAttributes: boolean, deleteMail: boolean): PanelLeaderModels.Session {
            let copyOfSession: PanelLeaderModels.Session = Framework.Factory.CreateFrom(PanelLeaderModels.Session, this);
            copyOfSession.Description = this.Description + " " + Framework.LocalizationManager.Get("CopyOf");
            copyOfSession.ID = undefined;
            copyOfSession.LocalDirectoryId = undefined;
            copyOfSession.Log = "";

            if (deleteData == true) {
                copyOfSession.ListData = [];
            }
            if (deleteSubjects == true) {
                copyOfSession.ListSubjects = [];
                copyOfSession.ListExperimentalDesigns.forEach((x) => {
                    x.ListExperimentalDesignRows = [];
                });
            }
            if (deleteProducts == true) {
                copyOfSession.ListExperimentalDesigns.filter((x) => { return x.Type == "Product" }).forEach((x) => {
                    x.ListExperimentalDesignRows = [];
                    x.ListItems = [];
                });
            }
            if (deleteAttributes == true) {
                copyOfSession.ListExperimentalDesigns.filter((x) => { return x.Type == "Attribute" }).forEach((x) => {
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
        }

        public AddControlToScreen(screen: Models.Screen, control: ScreenReader.Controls.BaseControl, onSelect: (control: ScreenReader.Controls.BaseControl) => void, style:boolean=true) {

            if (control == undefined) {
                return;
            }

            screen.Controls.push(control);
            control.OnSelect = (control: ScreenReader.Controls.BaseControl) => {
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
                    setTimeout(() => {
                        (<ScreenReader.Controls.CustomImage>control).Resize();
                    }, 500);
                }

                onSelect(control);
            }

            this.LogAction("Scenario", "control " + control._FriendlyName + " added on screen " + screen.Id + ".", false);
        }

        public RemoveControlFromScreen(screen: Models.Screen, control: ScreenReader.Controls.BaseControl) {
            control.SetScreen(screen);
            control.Delete();
            this.LogAction("Scenario", "control " + control._FriendlyName + " removed from screen " + screen.Id + ".", false);
        }

        public UpdateControlName(control: ScreenReader.Controls.BaseControl, oldName: string, newName: string) {
            while (this.ListFriendlyNames.indexOf(newName) > -1) {
                // Le nom existe déjà, nouveau nom généré
                newName += "1";
            }

            Framework.Array.Remove(this.ListFriendlyNames, oldName);
            this.ListFriendlyNames.push(newName);
            control._FriendlyName = newName;
            this.LogAction("Scenario", "Control " + oldName + " renamed " + newName + ".", false);
        };

        public GetNewDataTab(): string {
            let name: string = Framework.LocalizationManager.Get("Tab");
            let index: number = 1;
            while (this.DataTabs.indexOf(name + " " + index) > -1) {
                index++;
            }

            return name + " " + index;
        }

        public AddDataTab(name: string): void {
            this.DataTabs.push(name);
            this.LogAction("Data", "Tab " + name + " added.", false);
        }

        public RemoveDataTab(name: string): void {
            Framework.Array.Remove(this.DataTabs, name);
            this.LogAction("Data", "Tab " + name + " removed.", false);
        }

        public MoveSelectionToAnotherTab(selectedData: Models.Data[], newTab: string, deleteAfterCopy: boolean) {
            let self = this;
            if (newTab == Framework.LocalizationManager.Get("NewTab")) {
                newTab = this.GetNewDataTab();
                this.AddDataTab(newTab);
            }

            // "Déplacement" des données = changement de SheetName
            // "Copie" des données = duplication des données
            selectedData.forEach((x) => {
                if (deleteAfterCopy == false) {
                    let newData = Framework.Factory.Clone(x);
                    self.ListData.push(newData);
                }
                x.Status = "Computed";
                x.SheetName = newTab;
            });

            self.LogAction("Data", selectedData.length + " data rows moved to " + newTab + ".", false);
        }

        public TransformSessionsInReplicates(selectedData: Models.Data[], copy: boolean) {

            let self = this;

            let tab = selectedData[0].SheetName;

            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }

            let sessions = Framework.Array.Unique(selectedData.map((x) => { return x.Session }));

            selectedData.forEach((x) => {
                if (copy == true) {
                    let newData = Framework.Factory.Clone(x);
                    self.ListData.push(newData);
                }
                x.SheetName = tab;
                x.Replicate = sessions.indexOf(x.Session) + 1;
                x.Session = 1;
                x.Status = "Computed";
            });

            self.LogAction("Data", selectedData.length + " data rows updated (sessions transformed in replicates).", false);
        }

        public TransformReplicatesInIntakes(selectedData: Models.Data[], copy: boolean) {

            let self = this;

            let tab = selectedData[0].SheetName;

            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }

            selectedData.forEach((x) => {
                if (copy == true) {
                    let newData = Framework.Factory.Clone(x);
                    self.ListData.push(newData);
                }
                x.SheetName = tab;
                x.Intake = x.Replicate;
                x.Replicate = 1;
                x.Status = "Computed";
            });

            self.LogAction("Data", selectedData.length + " data rows updated (replicates transformed in intakes).", false);
        }

        public TransformScoresInMeans(selectedData: Models.Data[], copy: boolean, variable: string) {

            let self = this;

            let tab = selectedData[0].SheetName;

            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }

            let subjects = Framework.Array.Unique(selectedData.map((x) => { return x.SubjectCode; }));
            subjects.forEach((subject) => {
                let subjectData = selectedData.filter((x) => {
                    return x.SubjectCode == subject;
                });
                let products = Framework.Array.Unique(subjectData.map((x) => { return x.ProductCode; }));
                products.forEach((product) => {
                    let productData = subjectData.filter((x) => {
                        return x.ProductCode == product;
                    });
                    let attributes = Framework.Array.Unique(productData.map((x) => { return x.AttributeCode; }));
                    attributes.forEach((attribute) => {

                        let attributeData = productData.filter((x) => {
                            return x.AttributeCode == attribute;
                        });

                        let group1: string;
                        let group2: string;
                        let dataGroup1 = [];
                        let dataGroup2 = [];

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

                        dataGroup1 = Framework.Array.Unique(attributeData.map((x) => { return x[group1]; }));
                        dataGroup1.forEach((g1) => {
                            let g1Data = attributeData.filter((x) => {
                                return x[group1] == g1;
                            });
                            dataGroup2 = Framework.Array.Unique(g1Data.map((x) => { return x[group2]; }));
                            dataGroup2.forEach((g2) => {
                                let g2Data = g1Data.filter((x) => {
                                    return x[group2] == g2;
                                });
                                let sum = 0;
                                g2Data.forEach((d) => {
                                    sum += d.Score;
                                });
                                let newData = Framework.Factory.Clone(g2Data[0]);
                                newData.Score = sum / g2Data.length;
                                newData.SheetName = tab;
                                newData.Status = "Computed";
                                self.ListData.push(newData);
                                if (copy == false) {
                                    g2Data.forEach((d) => {
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
        }

        public TransformScores(selectedData: Models.Data[], copy: boolean, transformation: string) {

            let self = this;

            let tab = selectedData[0].SheetName;

            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }

            selectedData.forEach((x) => {
                if (copy == true) {
                    let newData = Framework.Factory.Clone(x);
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

        }

        public TransformScoresInRanks(selectedData: Models.Data[], copy: boolean) {

            let self = this;

            let tab = selectedData[0].SheetName;

            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }

            let sessions = Framework.Array.Unique(selectedData.map((x) => { return x.Session; }));
            let replicates = Framework.Array.Unique(selectedData.map((x) => { return x.Replicate; }));
            let intakes = Framework.Array.Unique(selectedData.map((x) => { return x.Intake; }));
            let subjects = Framework.Array.Unique(selectedData.map((x) => { return x.SubjectCode; }));
            let attributes = Framework.Array.Unique(selectedData.map((x) => { return x.AttributeCode; }));

            sessions.forEach((session) => {
                replicates.forEach((replicate) => {
                    intakes.forEach((intake) => {
                        subjects.forEach((subject) => {
                            attributes.forEach((attribute) => {
                                let data = selectedData.filter((x) => { return x.Session == session && x.Replicate == replicate && x.Intake == intake && x.SubjectCode == subject && x.AttributeCode == attribute });
                                // Tri par score
                                data = Framework.Array.SortBy(data, "Score");

                                let rank = 1;
                                for (let i = 0; i < data.length; i++) {
                                    let d = data[i];
                                    if (copy == true) {
                                        let newData = Framework.Factory.Clone(d);
                                        self.ListData.push(newData);
                                    }
                                    //TOCHECK (égalités)
                                    if ((i + 1) < data.length && d.Score < data[i + 1].Score) {
                                        d.Score = i + 1;
                                        rank++;
                                    } else {
                                        d.Score = rank;
                                    }

                                    d.Type = "11";//Ranking
                                    d.SheetName = tab;
                                    d.Status = "Computed";
                                }

                            });
                        });
                    });
                });
            });

            self.LogAction("Data", selectedData.length + " data rows updated (scores transformed in ranks).", false);

        }

        public SearchAndReplaceData(selectedData: Models.Data[], column: string, search: string, replace: string, copy: boolean) {

            let self = this;

            let tab = selectedData[0].SheetName;

            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }

            selectedData.forEach((x) => {
                if (copy == true) {
                    let newData = Framework.Factory.Clone(x);
                    self.ListData.push(newData);
                }
                x.SheetName = tab;
                x[column] = (<string>x[column].toString()).replace(search, replace);
                x.Status = "Computed";
            });

            self.LogAction("Data", selectedData.length + " data rows updated.", false);
        }

        public ModifySelectionInData(selectedData: Models.Data[], column: string, replace: string, copy: boolean) {

            let self = this;

            let tab = selectedData[0].SheetName;

            if (copy == true) {
                tab = this.GetNewDataTab();
                this.AddDataTab(tab);
            }

            selectedData.forEach((x) => {
                if (copy == true) {
                    let newData = Framework.Factory.Clone(x);
                    self.ListData.push(newData);
                }
                x.SheetName = tab;
                x[column] = replace;
                x.Status = "Computed";
            });
            self.LogAction("Data", selectedData.length + " data rows updated.", false);
        }

        public AddData(listData: Models.Data[], source: string) {
            let self = this;
            listData.forEach((d) => {
                let exists = (self.ListData.filter((x) => {
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
                        && x.Y == d.Y
                }).length > 0);
                if (exists == false) {
                    self.ListData.push(d);
                }
            });
            self.LogAction("Data", listData.length + " data rows added (" + source + ").", true);
        }

        public static GetDefaultExperimentalDesign(listDesigns: Models.ExperimentalDesign[], designType: string): Models.ExperimentalDesign[] {

            let res: Models.ExperimentalDesign[] = [];

            // Plan de présentation descripteurs par défaut
            let designs = listDesigns.filter((x) => { return x.Type == designType });
            designs.forEach((x) => {
                res.push(x);
            });
            if (res.length > 0) {
                return res;
            }

            // Pas de plan : crée un nouveau et l'ajouter à la liste
            let experimentalDesign: Models.ExperimentalDesign = new Models.ExperimentalDesign();
            let id = 1;
            if (listDesigns.length > 0) {
                id = Math.max.apply(Math, listDesigns.map(function (x) { return x.Id; })) + 1;
            }
            experimentalDesign.Id = id;
            experimentalDesign.Type = designType;
            experimentalDesign.Name = Framework.LocalizationManager.Get("Default" + designType + "ExperimentalDesign");
            //TODO : continuer, ajouter à liste plan présentation de la séance
            res.push(experimentalDesign);
            return res;
        }

        public GetSubjectFromCode(code: string): Models.Subject {
            return this.ListSubjects.filter((x) => { return x.Code == code })[0];
        }

        public GetMemo() {
            let wb = new Framework.ExportManager(Framework.LocalizationManager.Get("Memo"), "", "");

            let readme: string[][] = [];
            readme.push(["Description of the other sheets contained in this file."]);
            readme.push(["This file contains the information for connecting to the session."]);
            readme.push(["The 'links' sheet contains individualized subjects' links for connecting directly to the session. Subjects connecting through https://www.chemosenstools.com/timesens/panelist/login.html will have to enter their session code, select their subject code in a dropdown list and enter their password."]);
            readme.push(["The 'products' sheet makes the correspondence between product codes used in the report and product labels presented to the subjects."]);
            readme.push(["The 'tasting orders' sheet indicates in what order each subject will have to taste each product. For example, if the study features 5 products and 3 replicates then this sheet will include columns named from rank1 to rank15. This sheet can be useful if products are served one by one to the subjects in sensory booths."]);

            wb.AddWorksheet("Read me", readme);

            wb.AddWorksheet("links", this.monitoringProgressToArray());
            let index = 1;
            this.ListExperimentalDesigns.filter(x=>x.Type=="Product").forEach((x) => {
                let array = x.GetAsArray();
                let prod = x.GetProducts();
                if (index == 1) {
                    wb.AddWorksheet("products", prod);
                    wb.AddWorksheet("tasting order", array.LabelArray);
                } else {
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

        }

        public SetDataTabs() {
            let self = this;
            self.ListData.filter((x) => { return x.SheetName == undefined || x.SheetName.length == 0 }).forEach((x) => {
                x.SheetName = Models.Data.GetType(x);                
            });

            let dataTabs = Framework.Array.Unique(self.ListData.map((x) => { return x.SheetName; }));;
            self.DataTabs = Framework.Array.Unique(Framework.Array.Merge(dataTabs, self.DataTabs));

            //if (self.DataTabs.length == 0) {
                
            //    self.DataTabs = Framework.Array.Unique(self.ListData.map((x) => { return x.SheetName; }));
            //}
        }

        public UpdatePanelistMail(subjectCode: string, mail: string) {
            this.GetSubjectFromCode(subjectCode).Mail = mail;
            this.LogAction("Monitoring", "Mail of subject " + subjectCode + " updated.", false);
        }

        public GetMailContent(subjectCode: string, url: string): string {
            let monitoringProgresses = this.MonitoringProgress.filter((x) => {
                return x.SubjectCode == subjectCode;
            });

            let timesensURL = url;

            if (monitoringProgresses.length > 0) {

                let monitoringProgress = monitoringProgresses[0];

                // Remplacement des valeurs spéciales
                let htmlContent = this.Mail.Body;
                htmlContent = htmlContent.replace("[SERVER_CODE]", this.Upload.ServerCode);
                if (monitoringProgress.FirstName) {
                    htmlContent = htmlContent.replace("[SUBJECT_FIRST_NAME]", monitoringProgress.FirstName);
                } else {
                    htmlContent = htmlContent.replace("[SUBJECT_FIRST_NAME]", "");
                }
                if (monitoringProgress.LastName) {
                    htmlContent = htmlContent.replace("[SUBJECT_LAST_NAME]", monitoringProgress.LastName);
                } else {
                    htmlContent = htmlContent.replace("[SUBJECT_LAST_NAME]", "");
                }
                htmlContent = htmlContent.replace("[SUBJECT_CODE]", monitoringProgress.SubjectCode);
                if (monitoringProgress.Password) {
                    htmlContent = htmlContent.replace("[SUBJECT_PASSWORD]", monitoringProgress.Password);
                } else {
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
        }

        public RemoveUpload(url: string, status: string, removeData: boolean) {
            let serverCode = this.Upload.ServerCode;

            this.Upload.Date = undefined;
            this.Upload.ServerCode = undefined;
            this.SetMonitoringProgress(url, true);

            if (removeData == true) {
                // Suppression des données de la séance
                let data = this.ListData.filter((x) => { return x.Session.toString() == serverCode });
                if (data.length > 0) {
                    this.RemoveData(data);
                }
            }

            // Deverrouillage de la session       
            this.IsLocked == false;
            this.OnLockedChanged(false);

            this.LogAction("Delete", "Upload with server code [" + this.Upload.ServerCode + "] deleted with " + status + ".", true);
        }

        public SetUpload(url: string, serverCode: string, login: string, mail: string) {
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
            let detail = "Session uploaded with server code " + this.Upload.ServerCode + ", ";
            detail += "password: " + this.Upload.Password + ", ";
            detail += "anonymous mode: " + this.Upload.AnonymousMode + ", ";
            detail += "expiration date: " + Framework.Format.ToDateString(new Date(this.Upload.ExpirationDate.toString())) + ", ";
            detail += "min time between connexions: " + this.Upload.MinTimeBetweenConnexions + ", ";
            detail += "display mode of panelists' codes: [" + this.Upload.ShowSubjectCodeOnClient + ", ";
            detail += "panelists: " + this.ListSubjects.length + ", ";
            //detail += "products: " + this.ListProducts.length + ", ";
            //detail += "attributes: " + this.ListAttributes.length + ", ";
            detail += "screens: " + this.ListScreens.length + "."
            this.LogAction("Upload", detail, true);
        }

        public ToggleScreenCondition(screen: Models.Screen, condition: string, value) {

            let list = [];

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

            let index = list.indexOf(value);

            if (index > -1) {
                list.splice(index, 1);
            } else {
                list.push(value);
            }

            //TODO
            this.LogAction("Scenario", "Condition changed in screen " + screen.Id, true);
        }

        public SetScreenBackground(screen: Models.Screen, color: string) {
            screen.SetBackground(color);
            this.LogAction("Scenario", "Background changed for screen " + screen.Id, true);
        }

        public SetScreenExperimentalDesign(screen: Models.Screen, experimentalDesignId: number) {
            screen.ExperimentalDesignId = experimentalDesignId;
            this.LogAction("Scenario", "Experimental design changed for screen " + screen.Id, true);
        }
    }

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

    export class DBField extends Framework.Database.DBItem {
        public Name: string = "";
        public Type: string = ""; // Character, Numeric, Date, Enumeration, Boolean
        public DefaultValue: string = "";
        public Enumeration: string = "";
        public Visibility: string = "True";

        public static GetDataTableParameters(listData: DBField[], onFieldChange: (fields: PanelLeaderModels.DBField) => void): Framework.Form.DataTableParameters {
            let fieldParameters = new Framework.Form.DataTableParameters();
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

            fieldParameters.OnEditCell = (propertyName, data) => {

                if (propertyName == "Type") {
                    return Framework.Form.Select.Render(data["Type"], Framework.KeyValuePair.FromArray(["Character", "Numeric", "Date", "Enumeration", "Boolean"]), Framework.Form.Validator.NotEmpty(), (x) => {
                        data["Type"] = x;
                        onFieldChange(data);
                    }, false).HtmlElement;
                }
                if (propertyName == "Name") {
                    return Framework.Form.InputText.Create(data["Name"], (x, y) => {
                        if (y.IsValid == true) {
                            data["Name"] = x;
                            onFieldChange(data);
                        }
                    }, Framework.Form.Validator.Unique(fieldParameters.ListData.map(a => a.Name))).HtmlElement;
                }
                if (propertyName == "DefaultValue") {
                    return Framework.Form.InputText.Create(data["DefaultValue"], (x, y) => {
                        data["DefaultValue"] = x;
                        onFieldChange(data);
                    }, Framework.Form.Validator.NoValidation()).HtmlElement;
                }
                if (propertyName == "Enumeration" && data["Type"] == "Enumeration") {
                    return Framework.Form.InputText.Create(data["Enumeration"], (x, y) => {
                        data["Enumeration"] = x;
                        onFieldChange(data);
                    }, Framework.Form.Validator.NoValidation()).HtmlElement; //TODO : valeur spécifique pour tester enum val1|val2...
                }
                if (propertyName == "Visibility") {
                    return Framework.Form.Select.Render(data["Visibility"], Framework.KeyValuePair.FromArray(["True", "False"]), Framework.Form.Validator.NotEmpty(), (x) => {
                        data["Visibility"] = x;
                        onFieldChange(data);
                    }, false).HtmlElement;
                }
            }

            return fieldParameters;

        }

        public static ExtendDataTableColumnsWithDBFields(fields: DBField[], dataTableColumns: any[]) {
            fields.filter((x) => { return x.Visibility == null || x.Visibility == "True" }).forEach((x) => {
                dataTableColumns.push({
                    data: "Custom" + x.ID, title: x.Name, render: function (data, type, row) {
                        if (type === 'display') {
                            if (data == undefined || data == null) {
                                if (x.DefaultValue != null) {
                                    data = x.DefaultValue;
                                } else {
                                    data = "";
                                }
                            }
                            return data;
                        }
                        return "";
                    }
                });
            });
        }

        public static OnEditDataTableCellWithDBFields(field: DBField, data: any, propertyName: string) {

            let kvp: Framework.KeyValuePair[] = [];
            if (field.Type == 'Enumeration') {
                kvp = Framework.KeyValuePair.FromArray(field.Enumeration.split('|'));
            }

            return Framework.Form.DataTable.OnEditDataTableCell(data, propertyName, field.Type, field.DefaultValue, kvp);
            //TODO :Date, Boolean            
        }
    }





    
}